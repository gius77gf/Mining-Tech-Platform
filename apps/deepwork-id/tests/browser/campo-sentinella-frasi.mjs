/* LE FRASI DI CAMPO E SENTINELLA CON UN DATO SOLO
   ══════════════════════════════════════════════════════════════════════════
   Uso:
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823 --controprova
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823 --solo=campo

   ⛔ PERCHÉ NON BASTAVA `uno-solo.mjs`, che questa famiglia la guarda già.
   Quel banco cerca «1 <parola al plurale>» su ogni schermata di ogni
   superficie, e su Campo e Sentinella rispondeva **verde**. Ma il suo limite è
   scritto nella sua intestazione, e va letto: *«guarda quello che la
   dimostrazione mostra. Se un conto non vale mai 1 nei dati d'esempio, il
   difetto c'è e questo banco non lo vede»*. La dimostrazione di Sentinella ha
   sei punti di misura e dodici letture: il ramo del singolare non lo attraversa
   mai nessuno.
   Servendo la stessa dimostrazione **tagliata a un elemento per collezione**,
   sulle stesse identiche schermate sono uscite cinque frasi sbagliate, fra cui
   due sui documenti che ESCONO — il foglio per l'ARPA («misure registrate in
   **1 giorno diversi**») e il riepilogo dei referti («**Restano fuori 1
   volate**»). Cioè: non mancava una regola, mancava il **caso**.

   ⛔ E IL CASO SI COSTRUISCE NEI DATI SERVITI, MAI SUL DISCO: CLAUDE.md lo
   vieta, perché un giro del browser che gira in quel momento misurerebbe il
   difetto iniettato. Il taglio passa da `rotte` di `giro.mjs`, che riscrive la
   risposta HTTP del modulo dati; il file su disco non viene toccato.

   ⛔ LA SECONDA DOMANDA — quella che CLAUDE.md chiede di farsi dopo ogni
   controllo nuovo: *se il difetto stesse un piano più sotto, questo banco lo
   direbbe?* Sotto il plurale del sostantivo c'è l'accordo di tutto il resto
   della frase, ed è lì che i difetti si erano nascosti: il **verbo** («ci sono
   1 attività registrata»), l'**aggettivo** che segue il sostantivo già
   declinato («1 giorno **diversi**»), il **participio** («1 **conformi**»).
   Per questo i rilevatori sono TRE e non uno:
     · D1 — la parola plurale attaccata DOPO l'uno («1 volate»);
     · D2 — il verbo plurale PRIMA dell'uno («ci sono 1», «restano 1»);
     · D3 — l'aggettivo plurale una parola PIÙ IN LÀ («1 giorno diversi»).
   Ognuno dei tre è l'unico che prende almeno un difetto vero, e per due di
   loro si è visto solo dopo averli scritti: D2 è il solo che avrebbe preso «In
   questo periodo ci sono 1 attività registrata» (lì il sostantivo è
   invariabile e il ternario c'era: la sola parola che distingue il singolare
   era il verbo, scritto fisso), e D3 è il solo che prende la frase del foglio
   per l'ARPA — con due rilevatori la controprova cadeva lo stesso, per colpa
   degli altri difetti, e quella riga non la guardava nessuno.

   ── seconda tornata, 07/08: i DOCUMENTI CHE ESCONO, e il caso mai costruito ──
   Rifatta la stessa domanda su Sentinella, sono usciti altri **sette** difetti,
   tutti in due punti ciechi che il primo giro non poteva vedere:
   1. **il banco non premeva niente.** Visitava le sei schermate e non toccava
      un comando, quindi le frasi che si leggono *nel momento in cui un file
      esce dall'azienda* non le guardava nessuno — e infatti erano tutte e
      quattro sbagliate: «Esportati **1 monitoraggi** e **1 adempimenti**
      (CSV)» sul bottone che prepara il file per l'ARPA, «Esportate **1
      volate**» sul registro che è un documento verso gli enti, «Esportati **1
      ricettori**», e «**Esportati** 1 certificato» — quest'ultimo col
      sostantivo GIUSTO e il participio davanti fisso al plurale, cioè
      illeggibile dal codice. Più la **striscia** (il toast), che non si legge
      dal DOM perché sparisce da sola: quella dell'import diceva «Importate 1
      letture» mentre la nota accanto, a tre centimetri, scriveva già
      «Importata 1 lettura» — lo stesso evento in due dialetti;
   2. **il taglio era superficiale.** Tagliava le collezioni di primo livello,
      ma le letture e le tarature stanno DENTRO il monitoraggio: con «un dato
      solo» restavano dodici, e le due frasi che parlano di una lettura sola
      non venivano prodotte da nessuno — «Nella finestra **ci sono** 1 lettura:
      **troppo poche**» e «**Delle** 1 lettura **registrate** su questo
      strumento», che è la catena della taratura, cioè quello che nel report
      per l'ARPA diventa «Riferibilità delle misure». Più «**1 fori**» sulla
      riga del brogliaccio, che vuole una volata da un foro solo.
   Cioè: il banco diceva «nessuna frase lasciata al plurale» **due volte** per
   ragioni diverse — perché non aveva premuto nulla e perché aveva costruito il
   caso sbagliato. Da qui le due righe di riepilogo che contano i **comandi
   premuti** e le **strisce lette**: uno zero lì vuol dire che il banco non ha
   guardato, non che i documenti siano a posto.

   ⚠️ LA FRAZIONE NON È UN PLURALE SBAGLIATO, e questa riga nasce da un falso
   allarme del primo giro: «Rapportini consegnati da **0/1 squadre**» è giusto
   — è un rapporto, si legge «zero su una». L'uno preceduto da `/` viene quindi
   escluso, come `uno-solo.mjs` esclude già cifra, virgola e punto.

   ⚠️ IL MESE HA BISOGNO DEL SUO OROLOGIO. «Rispetto a aprile» (manca la d
   eufonica) si vede solo quando il mese precedente comincia per a — due mesi
   l'anno su dodici. Il caso si monta fermando l'orologio di
   `andamentoRicettore` a maggio 2026 e spostando indietro di due mesi le
   letture della dimostrazione: tutt'e due nel modulo SERVITO, in una
   trasformazione sola.

   COSA NON GUARDA, dichiarato perché non prometta troppo: le unità di misura
   (`unita-maiuscole.mjs`), i numeri tranquilli sullo zero
   (`campo-numeri-tranquilli.mjs`, `sentinella-numeri-tranquilli.mjs`) e il
   testo tagliato dal clamp. Su quest'ultimo la misura è stata fatta a mano il
   06/08 e il risultato è un negativo: 153 righe con clamp, 27 tagliano
   davvero, 3 tagliano una parola che dichiara una non-misura — e tutt'e tre
   sono la NOTA scritta dall'utente, non una dichiarazione calcolata, che resta
   sempre visibile. */
import { prendiChromium, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
/* ⛔ IL VOCABOLARIO E I TRE RILEVATORI STANNO IN `frasi-da-uno.mjs`, non qui.
   Erano nati in questo file; il 07/08 erano già ricopiati in
   `scudo-frasi-da-uno.mjs` e stavano per esserlo una terza volta per Terra.
   Due elenchi di parole nati uguali divergono al primo cambiamento, e da lì
   la stessa domanda riceve due risposte diverse a seconda del banco che la
   fa: è la copia debole applicata ai controlli. Il commento che spiegava
   perché i rilevatori sono TRE — e perché lo slash è escluso — se n'è andato
   con loro, dove lo legge chi li usa. */
import { PAROLE, INVARIABILI, VERBI, AGGETTIVI, setaccia,
         AGGANCIO_DOPO_CARICO } from './frasi-da-uno.mjs';

const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
if (!PORTA) { console.error('serve la porta del server statico'); process.exit(2); }

const APP = {
  campo: { via: '/apps/campo/index.html', modulo: '**/campo-data.js' },
  sentinella: { via: '/apps/sentinella/index.html', modulo: '**/sentinella-data.js' },
};

/* ── IL TAGLIO: la dimostrazione ridotta a un elemento per collezione ──────
   Il seme è la riga con cui tutt'e due i moduli copiano la dimostrazione in
   memoria. Se un giorno cambiasse, `rotte` se ne accorge da sé: una
   trasformazione che non cambia niente ferma il banco invece di lasciarlo
   girare su dati interi stampando verde. */
const SEME = 'const mem = JSON.parse(JSON.stringify(DEMO));';
/* ⛔ E IL TAGLIO VA IN PROFONDITÀ, se no il caso limite non arriva mai. Fino al
   07/08 tagliava solo le collezioni di PRIMO livello: le letture e le tarature
   di Sentinella stanno **dentro** il monitoraggio, quindi con «un dato solo»
   restavano dodici — e le tre frasi che parlano di una lettura sola («ci sono
   1 lettura: troppo poche», «Delle 1 lettura registrate», la scheda della
   taratura) non venivano prodotte da nessuno. Il banco diceva «pulito» avendo
   guardato il caso sbagliato: è il controllo che non guarda dove crede, un
   piano più sotto.
   ⚠️ E i fori della volata si portano a uno di proposito: «1 fori» sul
   brogliaccio — che la nota della lista chiama «un documento verso gli enti» —
   è il difetto che questa riga esiste per far comparire. Una volata da un foro
   solo in cava è normale (uno sfiancamento, un ripristino), non di laboratorio. */
const tagliaAUno = (t) => t.replace(SEME, SEME + `
    for (const k of Object.keys(mem)) if (Array.isArray(mem[k])) mem[k] = mem[k].slice(0, 1);
    for (const m of (mem.monitoraggi || [])) {
      if (Array.isArray(m.letture)) m.letture = m.letture.slice(0, 1);
      if (Array.isArray(m.tarature)) m.tarature = m.tarature.slice(0, 1);
    }
    for (const v of (mem.volate || [])) if (v.nFori != null) v.nFori = 1;`);

/* ── L'OROLOGIO: fermo a maggio 2026, con le letture spostate indietro ──── */
const OROLOGIO = 'const oggi = opts.oggi ? new Date(opts.oggi) : new Date();';
const aMaggio = (t) => {
  if (!t.includes(OROLOGIO)) { console.error('✗ orologio di andamentoRicettore non trovato'); process.exit(2); }
  return t.replace(OROLOGIO, 'const oggi = new Date("2026-05-20T09:00:00");')
    .replace('export async function sentinellaData() {',
      'for (const m of DEMO.monitoraggi || []) for (const l of (m.letture || [])) '
      + 'l.data = String(l.data).replace("2026-06", "2026-04").replace("2026-07", "2026-05");\n'
      + 'export async function sentinellaData() {');
};

/* ── LA CONTROPROVA: i difetti veri rimessi nella copia SERVITA ───────────
   Sono le otto frasi trovate il 06/08, nella forma esatta che avevano prima
   della correzione. Non sono difetti inventati: se una di queste non facesse
   più cadere il banco, vorrebbe dire che il banco ha smesso di guardare lì. */
const DIFETTI = {
  campo: [
    ['${conta(av.pianificate, "pianificata", "pianificate")}', '${av.pianificate} pianificate'],
    ['In questo periodo ${attTot === 1 ? "c\'è" : "ci sono"} <b>${attTot}</b>',
     'In questo periodo ci sono <b>${attTot}</b>'],
  ],
  sentinella: [
    ['${conf.conformi} ${plurale(conf.conformi, "conforme", "conformi")} ·', '${conf.conformi} conformi ·'],
    ['su ${conf.totale} ${plurale(conf.totale, "punto", "punti")} in ascolto', 'su ${conf.totale} punti in ascolto'],
    ['<b>${conf.conformi}</b> ${plurale(conf.conformi, "conforme", "conformi")} ·', '<b>${conf.conformi}</b> conformi ·'],
    ['${plurale(R.nMancanti, "Resta", "Restano")} fuori <b>${R.nMancanti}</b> ${plurale(R.nMancanti, "volata", "volate")}',
     'Restano fuori <b>${R.nMancanti}</b> volate'],
    ['misure registrate in ${gg(C.nGiorniMisurati)}${C.nGiorniMisurati === 1 ? "" : " diversi"}',
     'misure registrate in ${gg(C.nGiorniMisurati)} diversi'],
    ['Rispetto ${esc(aMese(MESI_IT[pre.mese - 1]))}', 'Rispetto a ${esc(MESI_IT[pre.mese - 1])}'],
    /* ── 07/08 · i sei difetti dei DOCUMENTI CHE ESCONO e delle due schermate
       che parlano di una lettura sola. Nessuno di questi lo vedeva il giro
       precedente: quattro stanno nel messaggio che compare DOPO aver premuto
       un bottone (e nessun banco lo premeva), due nel testo di una scheda che
       la dimostrazione non produceva mai perché aveva dodici letture. */
    // il file per l'ARPA e il consulente ambientale
    ['const contoAmb = MON.length + " " + plurale(MON.length, "monitoraggio", "monitoraggi")\n      + " e " + ADE.length + " " + plurale(ADE.length, "adempimento", "adempimenti");\n    esito("reg-esito", "Esportato il CSV: " + contoAmb + ".", "success",\n      "Esportato il CSV: " + contoAmb + ".");',
     'esito("reg-esito", "Esportati " + MON.length + " monitoraggi e " + ADE.length + " adempimenti (CSV).", "success",\n      "Esportati " + MON.length + " monitoraggi e " + ADE.length + " adempimenti.");'],
    // il registro volate, che è un documento verso gli enti
    ['esito("vol-esito-msg", plurale(VOL.length, "Esportata ", "Esportate ") + VOL.length + " "\n      + plurale(VOL.length, "volata", "volate") + " (CSV)"',
     'esito("vol-esito-msg", "Esportate " + VOL.length + " volate (CSV)"'],
    // l'anagrafe dei ricettori
    ['esito("ric-esito", plurale(RIC.length, "Esportato ", "Esportati ") + RIC.length + " "\n      + plurale(RIC.length, "ricettore", "ricettori") + " (CSV).", "success");',
     'esito("ric-esito", "Esportati " + RIC.length + " ricettori (CSV).", "success");'],
    /* ⛔ E QUESTO IL SOSTANTIVO CE L'AVEVA GIUSTO: a essere fisso al plurale
       era il PARTICIPIO davanti («Esportati 1 certificato»). Leggendo il
       codice sembra la riga corretta del file — si è visto premendo il
       bottone, ed è il difetto che ha fatto nascere la seconda metà di D2. */
    ['esito("tar-esito", plurale(n, "Esportato ", "Esportati ") + n\n      + plurale(n, " certificato (CSV).", " certificati (CSV)."), "success");',
     'esito("tar-esito", "Esportati " + n + (n === 1 ? " certificato (CSV)." : " certificati (CSV)."), "success");'],
    // la scheda della taratura: articolo e participio attorno a un sostantivo
    // già declinato — la stessa forma di «1 giorno diversi» sul foglio ARPA
    ['${plurale(letture.length, "Della", "Delle")} <b>${letture.length}</b> ${plurale(letture.length, "lettura", "letture")} ${plurale(letture.length, "registrata", "registrate")} su questo strumento:',
     'Delle <b>${letture.length}</b> ${letture.length === 1 ? "lettura" : "letture"} registrate su questo strumento:'],
    // l'andamento per ricettore: verbo davanti e aggettivo dietro
    ['Nella finestra ${plurale(p.n, "c\'è", "ci sono")} <b>${p.n}</b> ${plurale(p.n, "lettura", "letture")}: ${plurale(p.n, "troppo poca", "troppo poche")} per disegnare',
     'Nella finestra ci sono <b>${p.n}</b> ${p.n === 1 ? "lettura" : "letture"}: troppo poche per disegnare'],
    // la riga del brogliaccio
    ['`${+v.nFori} ${plurale(+v.nFori, "foro", "fori")}`', '`${+v.nFori} fori`'],
  ],
};

/* ⛔ I BOTTONI CHE PRODUCONO UN DOCUMENTO, per sezione. Fino al 07/08 questo
   banco visitava le schermate e non premeva niente: i quattro messaggi di
   export di Sentinella — cioè le frasi che si leggono nel momento in cui un
   file esce dall'azienda — non erano guardati da nessuno, e infatti erano
   tutti e quattro sbagliati. Un giro che apre le pagine e non tocca i comandi
   misura metà prodotto. */
const BOTTONI = {
  campo: [],
  sentinella: ['btn-export-amb', 'btn-vol-export', 'btn-ref-export', 'btn-ric-export', 'btn-tar-export'],
};

/* ⚠️ SI CONTANO I DIFETTI RIMESSI, NON LE SOSTITUZIONI. La pagina viene servita
   più volte (quattro, fra i tre casi di Sentinella e quello di Campo), quindi
   un contatore crescente stampava «41 iniezioni su 15 difetti» — un numero che
   non si può confrontare con niente, e che quindi non dice se qualcosa è
   rimasto fuori. Con l'insieme, i due numeri si guardano in faccia. */
const colpiti = new Set();
let iniezioniMancate = 0;
const inietta = (app) => (testo) => {
  let t = testo;
  for (const [da, a] of DIFETTI[app]) {
    const n = t.split(da).length - 1;
    /* ⚠️ UN `replace` CHE NON TROVA NIENTE NON FALLISCE: si conta e si dice. */
    if (n !== 1) { console.log(`  ⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 60)}…»`); iniezioniMancate++; continue; }
    t = t.replace(da, a); colpiti.add(app + '|' + da);
  }
  return t;
};

let ok = 0, ko = 0, schermate = 0, caratteri = 0, comandi = 0, strisce = 0;
const trovate = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 260)}` : ''}`); }
};

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

/* Il testo della schermata aperta, o `null` se non se n'è aperta nessuna. */
const schermataAperta = (p) => p.evaluate(() => {
  const a = [...document.querySelectorAll('.page')].find((x) => getComputedStyle(x).display !== 'none');
  return a ? a.innerText : null;
});

/* Legge ogni sezione di una superficie, PREME i comandi che producono un
   documento, e raccoglie le frasi non declinate — dalla schermata e dalla
   striscia (il toast), che dicono la stessa cosa in due posti e il 07/08 la
   dicevano in due dialetti. */
async function guarda(app, { modulo, caso, etichetta, premi = false }) {
  const { ctx, p, errori } = await apriSuperficie(b, {
    nome: app, via: APP[app].via, porta: PORTA,
    rotte: [[APP[app].modulo, modulo]],
    trasforma: CONTROPROVA ? inietta(app) : null,
  });
  /* ⚠️ IL TOAST NON SI LEGGE DAL DOM: sparisce da solo, e un banco che arriva
     tardi misura una pagina senza toast e dice «pulito». Si intercetta la
     funzione, dopo che la struttura condivisa l'ha installata. */
  const montato = await p.evaluate(AGGANCIO_DOPO_CARICO).catch(() => false);
  if (premi) dice(montato === true, `${app}/${etichetta}: la striscia (toast) è agganciata — se no i suoi messaggi non li legge nessuno`, montato);
  const sezioni = await sezioniDi(p, app);
  for (const s of sezioni) {
    await vaiA(p, app, s);
    /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
       fotografa la stessa schermata a ogni giro e risponde «tutto a posto». */
    const t = await schermataAperta(p);
    if (t === null) { dice(false, `${app}/${etichetta}: nessuna schermata aperta in «${s}»`); continue; }
    schermate++; caratteri += t.length;
    trovate.push(...setaccia(`${app}/${caso}/${s}`, t));
    if (!premi) continue;
    for (const bid of (BOTTONI[app] || [])) {
      const el = await p.$('#' + bid);
      if (!el || !(await el.isVisible().catch(() => false))) continue;   // il bottone vive in un'altra sezione
      await el.click({ timeout: 4000 }).catch(() => {});
      await p.waitForTimeout(500);
      comandi++;
      const dopo = await schermataAperta(p);
      if (dopo) { caratteri += dopo.length; trovate.push(...setaccia(`${app}/${caso}/${s}/${bid}`, dopo)); }
    }
  }
  if (premi) {
    const strip = await p.evaluate(() => window.__dwToast || []).catch(() => []);
    strisce += strip.length;
    for (const m of strip) { caratteri += m.length; trovate.push(...setaccia(`${app}/${caso}/STRISCIA`, m)); }
  }
  dice(errori.length === 0, `${app}/${etichetta}: la pagina non solleva errori`, errori.slice(0, 2));
  await ctx.close();
}

for (const app of Object.keys(APP)) {
  if (SOLO && SOLO !== app) continue;
  await guarda(app, { modulo: tagliaAUno, caso: 'uno', etichetta: 'un dato solo', premi: true });
}
/* Il mese col nome che comincia per vocale: solo Sentinella lo scrive. */
if (!SOLO || SOLO === 'sentinella') {
  await guarda('sentinella', { modulo: (t) => aMaggio(tagliaAUno(t)), caso: 'maggio', etichetta: 'orologio a maggio' });
  /* ⚠️ Questa è l'unica frase che i due rilevatori non sanno vedere: non c'è
     nessun «1» in mezzo. Si chiede al testo reso, non al codice. */
  const { ctx, p } = await apriSuperficie(b, {
    nome: 'sentinella', via: APP.sentinella.via, porta: PORTA,
    rotte: [[APP.sentinella.modulo, aMaggio]],
    trasforma: CONTROPROVA ? inietta('sentinella') : null,
  });
  await vaiA(p, 'sentinella', 'nav-prog');
  const t = await p.evaluate(() => {
    const a = [...document.querySelectorAll('.page')].find((x) => getComputedStyle(x).display !== 'none');
    return a ? a.innerText : '';
  });
  schermate++; caratteri += t.length;
  const conf = t.includes('Rispetto a');
  dice(conf && !/Rispetto a aprile|Rispetto a agosto/i.test(t),
    'il confronto fra i mesi mette la d eufonica («rispetto ad aprile»)',
    conf ? t.slice(t.indexOf('Rispetto a'), t.indexOf('Rispetto a') + 60) : 'il verdetto del confronto non è comparso');
  await ctx.close();
}

for (const f of trovate) console.log(`      ${f}`);
dice(trovate.length === 0, `nessuna frase lasciata al plurale con un dato solo (${trovate.length} trovate)`, trovate[0]);

/* ⛔ IL CONTROLLO SUL RIGHELLO, non sul risultato: quante schermate ha letto
   davvero, e nessuna parola invariabile finita fra quelle cercate. */
dice(schermate >= (SOLO ? 5 : 12), `abbastanza schermate lette (${schermate}, ${caratteri} caratteri)`, schermate);
/* ⛔ E QUANTI COMANDI HA PREMUTO DAVVERO, e quante strisce ha letto. È la riga
   che il 07/08 mancava: il banco visitava le schermate e non toccava niente,
   quindi i quattro messaggi di export di Sentinella — tutti e quattro
   sbagliati — non li guardava nessuno, e il riepilogo diceva lo stesso
   «nessuna frase lasciata al plurale». Uno zero qui vuol dire che il banco non
   ha premuto nulla, non che i documenti siano a posto. */
const attesiComandi = SOLO === 'campo' ? 0 : BOTTONI.sentinella.length;
dice(comandi >= attesiComandi,
  `i comandi che producono un documento sono stati premuti davvero (${comandi} su ${attesiComandi} attesi, ${strisce} strisce lette)`,
  `premuti ${comandi}`);
const doppie = INVARIABILI.filter((w) => PAROLE.includes(w));
dice(doppie.length === 0, 'nessuna parola invariabile è finita fra quelle cercate (accuserebbe una frase giusta)', doppie);

if (CONTROPROVA) {
  const attese = (SOLO ? DIFETTI[SOLO].length : DIFETTI.campo.length + DIFETTI.sentinella.length);
  console.log(`\n  ${colpiti.size} difetti su ${attese} rimessi davvero nella copia servita (${iniezioniMancate} iniezioni mancate)`);
  if (iniezioniMancate || colpiti.size < attese) { console.error('✗ un difetto non è stato rimesso: il banco non è stato messo alla prova'); process.exit(1); }
  console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate, ${caratteri} caratteri`);
  /* Nella controprova il verde è il fallimento: i difetti sono dentro. */
  if (ko === 0) { console.error('✗ CONTROPROVA: coi difetti rimessi il banco NON è caduto'); process.exit(1); }
  console.log('✔ CONTROPROVA: coi difetti rimessi il banco cade, come deve.');
  process.exit(0);
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate, ${comandi} comandi premuti, ${strisce} strisce, ${caratteri} caratteri`
  + `  ·  ${PAROLE.length} parole, ${VERBI.length} verbi e ${AGGETTIVI.length} aggettivi cercati, ${INVARIABILI.length} invariabili escluse`);
process.exit(ko ? 1 : 0);
