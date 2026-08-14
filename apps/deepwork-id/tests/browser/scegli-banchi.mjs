/* ⛔ QUALI PASSATE DEL GIRO, E QUANTE NE RESTANO FUORI.
   ══════════════════════════════════════════════════════════════════════════
   ⚠️ Questo file NON VA IN npm test: non è una prova, è la funzione che sceglie
   — la lancia `tutti.mjs`, e a provarla è `browser/filtro-banchi.mjs`, che sta
   in `npm test`.
   PERCHÉ ESISTE. Misurato il 14/08 sul giro lanciato alle 04:29: dieci passate
   in 41 minuti = 4,1 min/passata, e in `tutti.mjs` ce ne sono **198**. Sono
   **13,5 ore**: il giro non finisce dentro una sessione. Non è un caso
   isolato — quello della sera prima è stato spento a 3h52 con 60 passate, e i
   suoi primi KO erano contrasti **chiusi cinque ore prima**.
   ⛔ Il difetto non è che sia lento: è che era **tutto-o-niente**. Il runner
   accettava `--limite=`, `--radice-impronta=`, `--banchi-finti` — nessun modo
   di lanciare le sole passate che coprono le superfici appena toccate. Quindi
   l'unica verifica completa che questo repository ha **non arriva mai in
   fondo**, e le due letture sbagliate che ne nascono sono già scritte in
   CLAUDE.md: accuse che sembrano fresche, e KO già chiusi.

   ⛔ E LA PARTE CHE COSTA PIÙ DEL FILTRO È LA DICHIARAZIONE. Un giro filtrato
   stampa le stesse identiche frasi di un giro intero: stesse intestazioni,
   stesso riepilogo, stesso «0 KO». Chi apre quel registro senza sapere come è
   stato lanciato legge un verde che riguarda **tutto il prodotto**, e invece
   riguarda dodici passate su 198. È alla lettera la famiglia che questo
   repository ha già pagato quattro volte (il registro che si tronca e sembra
   completo, la controprova letta come un guasto, il riepilogo contato due
   volte): **un dato che il programma ha in mano non si indovina dal testo**.
   Quindi chi filtra non ottiene solo meno passate: ottiene anche la riga che
   dice **quante ne ha lasciate fuori**, e quelle non sono «a posto» — sono
   NON MISURATE.

   ⛔ E UN NOME SCONOSCIUTO NON PUÒ USCIRE ZERO. È il difetto già trovato e
   chiuso su `contrasto-non-testo.mjs`, dove `--solo=` con un nome sbagliato
   usciva **zero** dichiarando di non aver guardato niente: il verde della
   dimenticanza. Qui un nome che non combacia con nessuna passata ferma il giro
   **prima di alzare il server**, con l'elenco di ciò che si poteva scrivere.

   Uso, dentro `tutti.mjs`:
     --solo=<pezzo>[,<pezzo>…]   tiene le passate il cui file O il cui nome
                                 contiene il pezzo (senza maiuscole)
     --da=<n>                    parte dalla n-esima passata scelta (1 = prima)

   La scelta sta in un file suo, e non dentro `tutti.mjs`, per una ragione
   sola: `tutti.mjs` alza un server e apre Chromium appena lo importi, quindi
   una prova non può chiamarlo. Qui invece la domanda è pura e la prova la fa
   in millisecondi (`filtro-banchi.mjs`).                                     */

/* Un pezzo di `--solo=` combacia con una passata se sta nel nome del FILE
   (`contrasto.mjs`) o nel nome mostrato («contrasto · tema sole»). Il file
   serve a chi ragiona per banchi, il nome a chi ragiona per app: `--solo=scudo`
   prende sia `scudo-disegni.mjs` sia «i documenti di Scudo».
   ⚠️ Le maiuscole si tolgono da tutt'e due i lati: un utente scrive `scudo`,
   il nome mostrato dice «Scudo». */
export function combacia(pezzo, nome, file) {
  const p = String(pezzo).toLowerCase().trim();
  if (!p) return false;
  return String(file || '').toLowerCase().includes(p)
      || String(nome || '').toLowerCase().includes(p);
}

/* Ritorna { scelti, fuori, ignoti, saltate } — MAI un elenco vuoto in
   silenzio: `ignoti` è la ragione per cui il chiamante deve uscire diverso da
   zero, `fuori` e `saltate` sono il denominatore da stampare. */
export function scegliBanchi(banchi, { solo = '', da = 0 } = {}) {
  const pezzi = String(solo).split(',').map((s) => s.trim()).filter(Boolean);

  /* ⚠️ Gli ignoti si calcolano PRIMA di filtrare, e uno per uno: se si
     guardasse solo il risultato complessivo, `--solo=scudo,sbagliato`
     risponderebbe «ho trovato delle passate» e il nome storto sparirebbe. È la
     stessa forma dell'elenco di eccezioni che nessuno rilegge. */
  const ignoti = pezzi.filter((p) => !banchi.some(([nome, file]) => combacia(p, nome, file)));

  const tenuti = pezzi.length
    ? banchi.filter(([nome, file]) => pezzi.some((p) => combacia(p, nome, file)))
    : banchi.slice();

  /* `--da=n` è 1-based perché il registro numera le passate da 1: chi legge
     «passata 61 di 198» e vuole ripartire da lì scrive `--da=61`, non `60`. */
  const n = Math.max(0, Math.floor(Number(da) || 0));
  const saltate = n > 1 ? Math.min(n - 1, tenuti.length) : 0;
  const scelti = tenuti.slice(saltate);

  return { scelti, fuori: banchi.length - scelti.length, ignoti, saltate, totale: banchi.length };
}

/* La riga che finisce nel registro. Torna `null` quando non c'è niente da
   dichiarare (giro intero): una riga «filtro: nessuno» stampata sempre
   diventerebbe rumore, e il rumore si smette di leggere. */
export function dichiaraFiltro({ scelti, fuori, saltate, totale }, { solo = '', da = 0 } = {}) {
  if (!fuori && !saltate) return null;
  const come = [solo ? `--solo=${solo}` : '', da ? `--da=${da}` : ''].filter(Boolean).join(' ');
  return `⚠️ GIRO PARZIALE: ${scelti.length} passate su ${totale} (${come}). `
       + `Le altre ${fuori} NON sono state misurate — e un soggetto non misurato NON è un soggetto a posto.`;
}
