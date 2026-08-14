/* LE FRASI DI SCUDO QUANDO IL NUMERO È UNO
   ══════════════════════════════════════════════════════════════════════════
   Uso:
     node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823
     node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823 --controprova
     node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823 --dimmi

   ⛔ PERCHÉ ESISTE, E PERCHÉ SU SCUDO IN PARTICOLARE. Il filo del «testo che
   mente» era stato chiuso su cinque app RENDENDO la pagina con un dato solo
   per collezione; su Scudo no — lì era stato chiuso **leggendo il modulo**. La
   differenza non è di metodo, è di risultato: aprendo davvero la pagina con un
   lavoratore, una scadenza, un near-miss, un DPI, un'ispezione, un appalto, un
   permesso e un documento sono uscite **diciassette** frasi che leggendo il
   codice non si erano viste. Due di loro finiscono in qualcosa che ESCE
   dall'azienda:
     · nel CSV del riepilogo L. 198/2025 — «L'unico near-miss del periodo ha la
       gravità potenziale scritta. **SONO** meno di 5» (il sostantivo il
       singolare ce l'aveva: a mancarlo era il verbo, ed è la seconda volta che
       succede su questo stesso riepilogo);
     · nel **promemoria che si copia negli appunti** e si manda per email o SMS
       al lavoratore — «risulta SCADUTA dal 06/08/2026 (**1 giorni fa**)». Il
       giorno dopo la scadenza è esattamente quando lo si manda.
   Le altre quindici stanno a schermo, e la più letta di tutte è sul Quadro:
   «**1 near-miss registrati** — non azzerano il conteggio, ma vanno guardati».

   ⚠️ E `uno-solo.mjs` non poteva prenderle: guarda quello che la dimostrazione
   MOSTRA, e la dimostrazione di Scudo ha 7 lavoratori, 23 scadenze, 5
   near-miss, 5 permessi. Il ramo del singolare non lo attraversa mai nessuno.

   ⛔ IL CASO SI COSTRUISCE NEI DATI SERVITI, MAI SUL DISCO: CLAUDE.md lo
   vieta, perché un giro del browser che gira in quel momento misurerebbe il
   difetto iniettato. Il taglio passa da `rotte` di `giro.mjs`, che riscrive la
   risposta HTTP di `scudo-data.js`; il file su disco non viene toccato.
   ⚠️ Il taglio non è solo `slice(0,1)`: tagliando alla cieca i riferimenti si
   rompono (la scadenza punta a un lavoratore che non c'è più, la mansione a
   persone sparite) e mezza pagina finisce nei rami «non lo sappiamo», che sono
   un'ALTRA famiglia di frasi. Il caso «uno» **ricuce** gli id sull'unico
   lavoratore e sull'unico cantiere: è una cava piccola vera, non un archivio a
   pezzi.

   ⛔ QUATTRO CASI E NON UNO, e ognuno esiste perché un ramo non si raggiunge
   altrimenti — la lezione del banco delle modali, che dichiarava «0 su 68
   aperte» e nessuno la leggeva:
     · `uno`      — uno per collezione, con la scadenza scaduta: gli esiti degli
                    export e degli import, la checklist, la matrice, il CSV;
     · `giorno`   — un infortunio E un near-miss (il quadrante del Quadro non
                    disegna il near-miss se non c'è nemmeno un infortunio), un
                    permesso solo e CHIUSO (il ramo tranquillo dei permessi), il
                    DSS rivisto ieri e la scadenza scaduta ieri (il promemoria);
     · `regolare` — la persona che PUÒ andare: «Oggi possono andare 1 persone»
                    si vede solo quando quel numero è 1, cioè quando è tutto a
                    posto — il caso che nessuno va a cercare;
     · `due`      — due tipi di adempimento e UNO solo da sistemare: serve
                    all'`aria` del grafico di copertura, che è la sola versione
                    di quel numero che arriva a chi non guarda lo schermo.

   ⛔ TRE RILEVATORI, non uno, per la ragione misurata su Campo e Sentinella:
   sotto il plurale del sostantivo c'è l'accordo di tutto il resto della frase.
     · D1 — la parola plurale attaccata DOPO l'uno («1 scadenze»);
     · D2 — il verbo plurale PRIMA dell'uno («ci sono 1»);
     · D3 — l'aggettivo che sta una parola PIÙ IN LÀ («1 già presenti»).
   Su Scudo il difetto peggiore era di un quarto tipo che nessuno dei tre
   prende — «Tutte le voci hanno un esito» su una checklist di UNA voce, dove
   di numeri non ce n'è nemmeno uno. Quelle si chiedono al testo reso, una per
   una, e sono le asserzioni esplicite qui sotto.

   COSA NON GUARDA, dichiarato perché non prometta troppo: i due FOGLI
   STAMPATI (il verbale DPI e la cartella del lavoratore) — li apre
   `scudo-documenti.mjs`, e con un dato solo sono usciti puliti: «1
   dispositivo», «1 sezione è senza righe», «1 scadenza già scaduta». Non
   guarda le unità di misura (`unita-maiuscole.mjs`), i numeri tranquilli sullo
   zero (`scudo-numeri-tranquilli.mjs`) e il testo tagliato dal clamp. */
import { prendiChromium, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
/* ⛔ I RILEVATORI VENGONO DALL'ATTREZZO CONDIVISO, NON RICOPIATI. Fino al
   07/08 questo file teneva le SUE liste di invariabili, verbi e aggettivi,
   scritte a poche ore di distanza da quelle di `frasi-da-uno.mjs` — e infatti
   erano già DIVERSE. È il difetto che CLAUDE.md censisce, applicato ai
   controlli invece che al prodotto: finché ci sono due elenchi, «nessuna
   frase al plurale» vuol dire due cose diverse a seconda del banco che
   risponde, e nessuno se ne accorge perché sono tutt'e due verdi. */
import { INVARIABILI as INV_COM, VERBI as VERBI_COM, AGGETTIVI as AGG_COM }
  from './frasi-da-uno.mjs';

const PORTA = process.argv[2];
const CONTROPROVA = process.argv.includes('--controprova');
const DIMMI = process.argv.includes('--dimmi');
if (!PORTA) { console.error('serve la porta del server statico'); process.exit(2); }

const VIA = '/apps/scudo/index.html';
const MODULO = '**/scudo-data.js';

/* ── I RILEVATORI ─────────────────────────────────────────────────────────
   Elenchi corti di proposito: un elenco lungo sbaglia, e un allarme che
   sbaglia insegna a non guardarlo.
   ⛔ `near-miss`, `analisi`, `DPI`, `specie`, `crisi` sono INVARIABILI e non
   entrano: «1 near-miss» è giusto. Stanno dichiarati sotto per essere letti. */
const PAROLE = [
  // i sostantivi del mestiere della sicurezza in cava
  'scadenze', 'voci', 'righe', 'persone', 'lavoratori', 'documenti', 'azioni',
  'ispezioni', 'permessi', 'appalti', 'imprese', 'eventi', 'giorni', 'mesi',
  'anni', 'dispositivi', 'corsi', 'nomine', 'consegne', 'segnalazioni', 'misure',
  'cantieri', 'mansioni', 'sezioni', 'infortuni', 'adempimenti', 'tipi',
  'episodi', 'luoghi', 'addetti', 'requisiti', 'certificati', 'verbali', 'allegati',
  // gli aggettivi e i participi che seguono il sostantivo: il piano di sotto
  'registrati', 'registrate', 'aggiunti', 'saltate', 'conformi', 'previsti',
  'previste', 'assegnati', 'assegnate', 'valutati', 'chiuse', 'chiusi',
  'scadute', 'scaduti', 'aperte', 'aperti', 'gravi', 'presenti', 'coperte',
];
/* ⚠️ E QUELLO CHE RESTA QUI È SOLO IL **DELTA**, dichiarato parola per parola
   invece di essere nascosto dentro una copia. Aggiungere queste parole
   all'elenco condiviso renderebbe più severi TUTTI gli altri banchi in una
   volta, e l'ampiezza di un controllo è un numero che si misura prima di
   cambiarlo (CLAUDE.md, 07/08): è un'unità sua, non una riga da infilare
   qui di straforo. */
const SOLO_SCUDO_INV = ['near-miss', 'DPI'];        // «1 near-miss» è giusto; «1 DPI» pure
const SOLO_SCUDO_VERBI = ['sono', 'hanno', 'vanno']; // «sono 1 voce», «hanno 1 corso»
const SOLO_SCUDO_AGG = ['assegnati', 'assegnate', 'valutati', 'chiusi', 'chiuse',
  'scaduti', 'scadute', 'gravi', 'previsti', 'previste', 'saltati'];
const unisci = (...liste) => [...new Set(liste.flat())];
const INVARIABILI = unisci(INV_COM, SOLO_SCUDO_INV);
const VERBI = unisci(VERBI_COM, SOLO_SCUDO_VERBI);
const AGGETTIVI = unisci(AGG_COM, SOLO_SCUDO_AGG);

/* ⚠️ `[^\d,./]` — lo slash è escluso perché «0/1 scadenze» è una frazione, non
   un plurale sbagliato. Fra il numero e la parola solo spazi veri, mai un a
   capo: due riquadri accostati non sono una frase. */
const D1 = new RegExp('(?:^|[^\\d,./])1[  ]+(' + PAROLE.join('|') + ')\\b', 'gi');
const D2 = new RegExp('\\b(' + VERBI.join('|') + ')[  ]+1(?=[  ][a-zà-ù])', 'gi');
const D3 = new RegExp('(?:^|[^\\d,./])1[  ]+[a-zà-ù\']+[  ]+(' + AGGETTIVI.join('|') + ')\\b', 'gi');

/* ── I CASI, montati sulla copia in memoria della dimostrazione ───────────
   Il seme è la riga con cui il modulo copia `DEMO`. Se un giorno cambiasse,
   `rotte` se ne accorge da sé: una trasformazione che non cambia niente ferma
   il banco invece di lasciarlo girare su dati interi stampando verde. */
const SEME = 'const mem = JSON.parse(JSON.stringify(DEMO));';
const RICUCI = `
    { const L = mem.lavoratori[0], K = mem.cantieri[0], A = mem.appaltatori[0];
      for (const s of mem.scadenze) s.lavoratoreId = L.id;
      for (const d of mem.dpi) d.lavoratoreId = L.id;
      for (const n of mem.nomine) n.lavoratoreId = L.id;
      for (const m of mem.mansioni) { m.lavoratoriIds = [L.id]; m.requisiti = (m.requisiti||[]).slice(0,1); m.dpi = (m.dpi||[]).slice(0,1); }
      for (const i of mem.ispezioni) { i.voci = (i.voci||[]).slice(0,1); i.cantiereId = K.id; i.responsabileId = L.id; }
      for (const a of mem.appalti) { a.appaltatoreId = A.id; a.cantiereId = K.id; }
      for (const p of mem.permessi) { p.cantiereId = K.id; p.rilasciatoDaId = L.id; p.riceventeId = L.id; p.sorveglianteId = L.id; }
      for (const z of mem.azioni) z.responsabileId = L.id; }`;
const UNO_PER_COLLEZIONE = '\n    for (const k of Object.keys(mem)) if (Array.isArray(mem[k])) mem[k] = mem[k].slice(0, 1);';
const IERI = '\n    const _g = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);';

const CASI = {
  uno: UNO_PER_COLLEZIONE + RICUCI,
  /* un infortunio E un near-miss (il quadrante del Quadro), un permesso solo e
     CHIUSO (il ramo tranquillo), il DSS rivisto IERI e la scadenza scaduta
     IERI (il promemoria che si copia negli appunti) */
  giorno: UNO_PER_COLLEZIONE + RICUCI + IERI + `
    mem.infortuni = [
      { id: "i1", data: _g(80), tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Est",
        luogoTipo: "fronte", categoria: "caduta-massi", gravitaPotenziale: "mortale", descrizione: "Caduta massi vicino al perforatore" },
      { id: "i2", data: _g(180), tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, luogo: "officina",
        luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },
    ];
    mem.permessi = [{ id: "pw2", tipo: "caldo", lavoro: "Saldatura del telaio del vaglio in officina",
      luogo: "Officina, banco 2", cantiereId: mem.cantieri[0].id,
      dal: _g(13) + "T08:00", al: _g(13) + "T12:00",
      rilasciatoDaId: mem.lavoratori[0].id, riceventeId: mem.lavoratori[0].id, sorveglianteId: null, appaltoId: null,
      misure: ["infiammabili", "estintore", "vigilanza-dopo", "delimitazione", "dpi"], atmosfera: null,
      stato: "chiuso", chiusuraOra: _g(13) + "T11:40", chiusuraDaId: mem.lavoratori[0].id, note: "" }];
    mem.documenti = [{ id: "c4", titolo: "DSS — Documento Sicurezza e Salute", meta: "", tipo: "DSS",
      cantiereId: mem.cantieri[0].id, stato: "valido", dssRevisione: _g(1), dssMotivo: "periodica", dssTrasmissione: _g(1) }];
    mem.scadenze = [{ id: "s1", lavoratoreId: mem.lavoratori[0].id, tipo: "Visita medica",
      descrizione: "Visita medica periodica", dataScadenza: _g(1) }];`,
  /* la persona che PUÒ andare: il ramo tranquillo della matrice e i due stati
     vuoti «va tutto bene», che con un elemento solo restavano al plurale */
  regolare: UNO_PER_COLLEZIONE + RICUCI + IERI + `
    mem.scadenze = [{ id: "s1", lavoratoreId: mem.lavoratori[0].id, tipo: "Visita medica",
      descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: _g(-400) }];
    for (const m of mem.mansioni) m.requisiti = ["visita"];
    mem.azioni = []; mem.infortuni = [];`,
  /* due tipi di adempimento e UNO solo da sistemare: l'`aria` del grafico */
  due: UNO_PER_COLLEZIONE + RICUCI + IERI + `
    mem.scadenze = [
      { id: "s1", lavoratoreId: mem.lavoratori[0].id, tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: _g(1) },
      { id: "s2", lavoratoreId: mem.lavoratori[0].id, tipo: "Corso", descrizione: "Corso antincendio", dataScadenza: _g(-900) },
    ];`,
};

/* ── LA CONTROPROVA: i difetti VERI rimessi nella copia SERVITA ───────────
   Sono le diciassette frasi trovate il 07/08, nella forma esatta che avevano
   prima della correzione. Non sono difetti inventati: se una di queste non
   facesse più cadere il banco, vorrebbe dire che il banco ha smesso di
   guardare lì. Si contano quelle **rimesse davvero**: un `replace` che non
   trova niente non fallisce, e una controprova che non inietta è una prova che
   non prova. */
const DIFETTI_MODULO = [
  ['return testa + plurale(val, "È", "Sono") + " meno di " + MIN_TENDENZA',
   'return testa + "Sono" + " meno di " + MIN_TENDENZA'],
  [`: (list.length === 1
          ? "L'unico permesso registrato è in ordine."
          : "Tutti i " + list.length + " permessi registrati sono in ordine.") };`,
   `: "Tutti i " + list.length + " permessi registrati sono in ordine." };`],
  ['perche: "Ultima revisione " + conta(giorni, "giorno", "giorni") + " fa, dentro i dodici mesi',
   'perche: "Ultima revisione " + giorni + " giorni fa, dentro i dodici mesi'],
  ['(${conta(-g, "giorno", "giorni")} fa)', '(${-g} giorni fa)'],
];
const DIFETTI_PAGINA = [
  // 1 · il Quadro, la prima frase che si legge
  ['${conta(ri.nearMiss, "near-miss registrato", "near-miss registrati")} — ${plurale(ri.nearMiss, "non azzera", "non azzerano")} il conteggio, ma ${plurale(ri.nearMiss, "va guardato", "vanno guardati")}.',
   '${ri.nearMiss} near-miss registrati — non azzerano il conteggio, ma vanno guardati.'],
  // 2 · l'aria del grafico di copertura: quello che sente chi non lo vede
  ['conta(cop.length, "tipo di adempimento", "tipi di adempimento") + ", "\n          + conta(copTot, "adempimento da sistemare", "adempimenti da sistemare") + " in tutto.',
   'cop.length + " tipi di adempimento, "\n          + copTot + " adempimenti da sistemare in tutto.'],
  // 3 · i due stati vuoti «va tutto bene»
  [`(cop.length === 1
          ? "Sull'<b>unico</b> tipo di adempimento registrato le persone sono in "
          : "Su tutti i tipi di adempimento registrati (<b>" + cop.length + "</b>) le persone sono in ")`,
   `"Su tutti i tipi di adempimento registrati (<b>" + cop.length + "</b>) le persone sono in "`],
  [`(manConGente.length === 1
          ? "Sull'<b>unica</b> mansione con persone assegnate corsi e DPI sono in ordine: "
          : "Su tutte le mansioni con persone assegnate (<b>" + manConGente.length + "</b>) corsi e DPI sono in ordine: ")`,
   `"Su tutte le mansioni con persone assegnate (<b>" + manConGente.length + "</b>) corsi e DPI sono in ordine: "`],
  // 4 · il riepilogo della matrice, nei suoi due rami
  [`(MANS.length === 1 ? "La mansione c'è" : "Le mansioni ci sono") + ", ma non è ancora assegnata`,
   `"Le mansioni ci sono, ma non è ancora assegnata`],
  ['`Oggi ${plurale(matPuo, "può", "possono")} andare <b>${matPuo}</b> ${plurale(matPuo, "persona", "persone")} su ${matTot}`',
   '`Oggi possono andare <b>${matPuo}</b> persone su ${matTot}`'],
  // 5 · la checklist di una voce sola: qui di numeri non ce n'è nemmeno uno
  [`plurale(r.totale, "L'unica voce ha un esito.", "Tutte le voci hanno un esito.")`,
   `"Tutte le voci hanno un esito."`],
  // 6 · i tre esiti degli export
  ['plurale(INF.length, "Esportato ", "Esportati ") + conta(INF.length, "evento del registro", "eventi del registro") + " (CSV)."',
   '"Esportati " + INF.length + " eventi del registro (CSV)."'],
  /* ⏱️ RI-ANCORATA il 09/08: l'ancora arrivava fino a ` + " (CSV)."`, e quel
     pezzo non è più adiacente — la frase ha guadagnato in mezzo il ramo dei
     lavoratori «senza nessuna scadenza registrata». Cioè l'iniezione era
     scaduta per la ragione di sempre, il codice si è mosso perché è
     migliorato. Adesso l'ancora si ferma dove la frase è stabile. */
  ['plurale(LAV.length, "Esportato ", "Esportati ") + conta(LAV.length, "lavoratore", "lavoratori") + " e " + conta(SCA.length, "scadenza", "scadenze")',
   '"Esportati " + LAV.length + " lavoratori e " + SCA.length + " scadenze"'],
  ['plurale(AZI.length, "Esportata ", "Esportate ") + conta(AZI.length, "azione correttiva", "azioni correttive") + " (CSV)."',
   '"Esportate " + AZI.length + " azioni correttive (CSV)."'],
  // 7 · i due import
  ['`Import registro: ${conta(agg, "evento aggiunto", "eventi aggiunti")}${dup ? `, ${conta(dup, "già presente (saltato)", "già presenti (saltati)")}` : ""}.`',
   '`Import registro: ${agg} eventi aggiunti${dup ? `, ${dup} già presenti (saltati)` : ""}.`'],
  /* ⏱️ RIMESSA SUL BERSAGLIO IL 14/08. Citava la frase vecchia — «${aggiunti}
     ${plurale(...)}, ${conta(saltate, ...)} (intestazioni o duplicati)» — che
     l'unità B5-bis ha riscritto **a ragione**: quel numero solo metteva insieme
     quattro cose diverse (intestazione, riga vuota, doppione, riga scartata).
     Finché citava il testo vecchio, l'iniezione non trovava più il suo pezzo:
     la controprova girava su un prodotto SANO e diceva di saper fallire senza
     aver rotto niente. È la terza delle cinque cause di «non distingue», quella
     in cui non si tocca né la prova né il codice. */
  ['`Import completato: ${conta(aggiunti, "lavoratore aggiunto", "lavoratori aggiunti")}`',
   '`Import completato: ${aggiunti} lavoratori aggiunti`'],
  // 8 · la mansione appena aggiunta: tre numeri in una frase sola
  ['" (" + conta(rec.requisiti.length, "corso", "corsi") + ", " + conta(rec.dpi.length, "DPI", "DPI") + ", " + conta(rec.lavoratoriIds.length, "persona", "persone") + ")."',
   '" (" + rec.requisiti.length + " corsi, " + rec.dpi.length + " DPI, " + rec.lavoratoriIds.length + " persone)."'],
];

const rimessi = new Set();
let iniezioniMancate = 0;
const inietta = (elenco) => (testo) => {
  let t = testo;
  for (const [da, a] of elenco) {
    const n = t.split(da).length - 1;
    /* ⚠️ SI CONTA E SI DICE: un `replace` che non trova niente non fallisce. */
    if (n !== 1) { console.log(`  ⛔ INIEZIONE MANCATA (${n} soggetti): «${da.slice(0, 64).replace(/\n/g, ' ')}…»`); iniezioniMancate++; continue; }
    t = t.replace(da, a); rimessi.add(da);
  }
  return t;
};

let ok = 0, ko = 0, schermate = 0, caratteri = 0, azioni = 0;
const trovate = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 300)}` : ''}`); }
};
const setaccio = (dove, t) => {
  for (const [re, quale] of [[D1, 'D1'], [D2, 'D2'], [D3, 'D3']])
    for (const m of t.matchAll(re))
      trovate.push(`[${quale} ${dove}] …${t.slice(Math.max(0, m.index - 60), m.index + 80).replace(/\n/g, ' · ')}…`);
};

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

/* Apre Scudo su un caso e ne visita tutte le sezioni, raccogliendo le frasi
   non declinate. Torna la pagina aperta: le prove esplicite vengono dopo. */
async function apri(caso) {
  const coda = CASI[caso];
  const { ctx, p, errori } = await apriSuperficie(b, {
    nome: 'scudo', via: VIA, porta: PORTA,
    rotte: [[MODULO, (t) => {
      const conCaso = t.replace(SEME, SEME + coda);
      return CONTROPROVA ? inietta(DIFETTI_MODULO)(conCaso) : conCaso;
    }]],
    trasforma: CONTROPROVA ? inietta(DIFETTI_PAGINA) : null,
  });
  /* Gli export escono da un `<a download>` e il promemoria finisce negli
     APPUNTI: si intercettano tutt'e due, se no il banco non li vede mai. */
  await p.evaluate(() => {
    window.__scaricati = [];
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
      return orig.apply(this, arguments);
    };
    Object.defineProperty(navigator, 'clipboard',
      { value: { writeText: async (t) => { window.__copiato = t; } }, configurable: true });
  });
  const sezioni = await sezioniDi(p, 'scudo');
  dice(sezioni.length >= 8, `${caso}: la barra di navigazione ha tutte le sue voci (${sezioni.length})`, sezioni);
  for (const s of sezioni) {
    await vaiA(p, 'scudo', s);
    /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
       fotografa la stessa schermata a ogni giro e risponde «tutto a posto». */
    const t = await p.evaluate(() => {
      const a = [...document.querySelectorAll('.page')].find((x) => getComputedStyle(x).display !== 'none');
      return a ? { id: a.id, testo: a.innerText } : null;
    });
    if (t === null) { dice(false, `${caso}: nessuna schermata aperta in «${s}»`); continue; }
    const { id, testo } = t;
    if (id !== 'page-' + s.replace(/^nav-/, '')) dice(false, `${caso}/${s}: ho navigato altrove (${id})`, id);
    schermate++; caratteri += testo.length;
    setaccio(`${caso}/${s}`, testo);
    /* le quattro schede di Personale sono quattro schermate, non una */
    if (s === 'nav-pers') {
      for (const tb of ['mans', 'nom', 'dpi', 'lav']) {
        await p.click(`#pers-tabs [data-tab="${tb}"]`).catch(() => {});
        await p.waitForTimeout(420);
        for (const acc of await p.$$('.dc-sec.closed .dc-sec-h, details:not([open]) > summary'))
          { await acc.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(60); }
        const tt = await p.evaluate(() => (document.getElementById('page-pers') || {}).innerText || '');
        schermate++; caratteri += tt.length;
        setaccio(`${caso}/pers-${tb}`, tt);
      }
    }
  }
  dice(errori.length === 0, `${caso}: la pagina non solleva errori`, errori.slice(0, 2));
  return { ctx, p };
}
const vaiSez = async (p, nav) => {
  await p.click('#' + nav).catch(() => {});
  await p.waitForTimeout(600);
  for (const acc of await p.$$('.dc-sec.closed .dc-sec-h, details:not([open]) > summary'))
    { await acc.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(60); }
  return p.evaluate((n) => {
    const pg = document.getElementById('page-' + n.replace(/^nav-/, ''));
    return !!pg && getComputedStyle(pg).display !== 'none';
  }, nav);
};
const testo = (p, sel) => p.$eval(sel, (e) => (e.innerText || '').replace(/\s+/g, ' ')).catch(() => '(assente ' + sel + ')');

console.log(`\n════════ le frasi di Scudo quando il numero è uno${CONTROPROVA ? ' · CONTROPROVA' : ''} ════════`);

// ══ CASO «uno» ════════════════════════════════════════════════════════════
console.log('\n· il caso «uno»: un lavoratore, una scadenza, un near-miss, un permesso…');
{
  const { ctx, p } = await apri('uno');

  // 1 · il riepilogo dei near-miss, a schermo E nel CSV della L. 198/2025
  dice(await vaiSez(p, 'nav-doc'), 'uno: sono nella schermata Documenti');
  const pot = await testo(p, '#pot-riep');
  dice(/È meno di 5/.test(pot) && !/Sono meno di 5/.test(pot),
    "⛔ «L'unico near-miss del periodo ha la gravità potenziale scritta. È meno di 5» — il verbo stava fuori dal ternario", pot);

  const csv = await (async () => {
    if (!(await p.$('#btn-nm-export'))) return '(bottone assente)';
    await p.evaluate(() => document.getElementById('btn-nm-export').scrollIntoView());
    await p.click('#btn-nm-export').catch(() => {});
    await p.waitForTimeout(500);
    const g = await p.evaluate(() => { const l = window.__scaricati.slice(); window.__scaricati = []; return l; });
    return g.length ? decodeURIComponent(g[0].href.replace(/^data:text\/csv;charset=utf-8,/, '')) : '(nessun file)';
  })();
  azioni++;
  if (DIMMI) console.log('\n[CSV riepilogo near-miss]\n' + csv + '\n');
  dice(csv.split('\n').length > 8, `il CSV del riepilogo L. 198/2025 esce davvero (${csv.split('\n').length} righe)`, csv.slice(0, 80));
  dice(/È meno di 5/.test(csv) && !/Sono meno di 5/.test(csv),
    '⛔ E NEL FILE CHE ESCE DALL\'AZIENDA: «È meno di 5», non «Sono meno di 5»',
    (csv.match(/potenziale;L'unico[^\n]*/) || [])[0]);

  // 2 · la checklist di una voce sola: qui non c'è nessun numero a tradirla
  dice(await vaiSez(p, 'nav-isp'), 'uno: sono nella schermata Ispezioni');
  const apribile = await p.$('[data-isp-apri]');
  if (apribile) {
    await apribile.click().catch(() => {});
    await p.waitForTimeout(800);
    azioni++;
    const comp = await p.evaluate(() => (document.getElementById('isp-compila') || {}).innerText || '');
    dice(/1 voce su 1/.test(comp), 'la checklist si è aperta davvero (una voce sola)', comp.slice(0, 120));
    dice(/L'unica voce ha un esito/.test(comp) && !/Tutte le voci hanno un esito/.test(comp),
      "⛔ «L'unica voce ha un esito», non «Tutte le voci hanno un esito»", comp.slice(0, 260));
    setaccio('uno/checklist', comp);
  } else dice(false, "la checklist si può aprire ([data-isp-apri])", 'nessun candidato');

  // 3 · i tre esiti degli export
  const premi = async (nav, tab, id, sel) => {
    await vaiSez(p, nav);
    if (tab) { await p.click(`#pers-tabs [data-tab="${tab}"]`).catch(() => {}); await p.waitForTimeout(400); }
    if (!(await p.$('#' + id))) return '(bottone assente: ' + id + ')';
    await p.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
    await p.click('#' + id).catch(() => {});
    await p.waitForTimeout(500);
    azioni++;
    return testo(p, sel);
  };
  const eAzi = await premi('nav-azio', null, 'btn-azi-export', '#azi-esito-msg');
  dice(/Esportata 1 azione correttiva \(CSV\)/.test(eAzi), '⛔ «Esportata 1 azione correttiva», non «Esportate 1 azioni correttive»', eAzi);
  const ePers = await premi('nav-pers', 'lav', 'btn-export-csv', '#import-esito');
  dice(/Esportato 1 lavoratore e 1 scadenza \(CSV\)/.test(ePers),
    '⛔ «Esportato 1 lavoratore e 1 scadenza» — tre parole sbagliate in una frase sola', ePers);
  const eInf = await premi('nav-doc', null, 'btn-inf-export', '#inf-esito');
  dice(/Esportato 1 evento del registro \(CSV\)/.test(eInf), '⛔ «Esportato 1 evento del registro»', eInf);

  // 4 · i due import, con un file di UNA riga
  const carica = async (input, righe) => {
    await p.setInputFiles(input, { name: 'prova.csv', mimeType: 'text/csv', buffer: Buffer.from(righe, 'utf8') }).catch(() => {});
    await p.waitForTimeout(900);
    azioni++;
  };
  await vaiSez(p, 'nav-doc');
  const unEvento = 'data;tipo;gravita;giorniAssenza;descrizione;luogo\n2026-01-05;near-miss;lieve;0;Segnalazione importata;pista\n';
  await carica('#inf-file', unEvento);
  const i1 = await testo(p, '#inf-esito');
  dice(/Import registro: 1 evento aggiunto\./.test(i1), '⛔ «1 evento aggiunto», non «1 eventi aggiunti»', i1);
  await carica('#inf-file', unEvento + '2026-01-06;near-miss;lieve;0;Seconda segnalazione;pista\n');
  const i2 = await testo(p, '#inf-esito');
  dice(/1 evento aggiunto, 1 già presente \(saltato\)/.test(i2),
    '⛔ e il doppione: «1 già presente (saltato)», non «1 già presenti (saltati)»', i2);

  await vaiSez(p, 'nav-pers');
  await p.click('#pers-tabs [data-tab="lav"]').catch(() => {}); await p.waitForTimeout(400);
  await carica('#csv-file', 'nome;ruolo;telefono\n');   // solo l'intestazione: UNA riga saltata
  const i3 = await testo(p, '#import-esito');
  dice(/1 riga saltata \(intestazioni o duplicati\)/.test(i3), '⛔ «1 riga saltata», non «1 righe saltate»', i3);

  // 5 · la mansione appena aggiunta: tre numeri in una frase sola
  await p.click('#pers-tabs [data-tab="mans"]').catch(() => {}); await p.waitForTimeout(600);
  await p.fill('#mans-nome', 'Mansione di prova').catch(() => {});
  const scelti = await p.evaluate(() => {
    const c = (s) => { const e = document.querySelector(s); if (e) { e.click(); return 1; } return 0; };
    return c('[data-mreq]') + c('[data-mdpi]') + c('[data-mlav]');
  });
  dice(scelti === 3, 'il form della mansione accetta un corso, un DPI e una persona', scelti);
  await p.waitForTimeout(300);
  await p.click('#btn-mans').catch(() => {});
  await p.waitForTimeout(900);
  azioni++;
  const eMans = await testo(p, '#mans-esito');
  dice(/\(1 corso, 1 DPI, 1 persona\)/.test(eMans), '⛔ «(1 corso, 1 DPI, 1 persona)», non «1 corsi, 1 DPI, 1 persone»', eMans);

  await ctx.close();
}

// ══ CASO «giorno» ═════════════════════════════════════════════════════════
console.log('\n· il caso «giorno»: un infortunio e un near-miss, un permesso chiuso, il DSS di ieri');
{
  const { ctx, p } = await apri('giorno');

  dice(await vaiSez(p, 'nav-dash'), 'giorno: sono sul Quadro');
  const saf = await testo(p, '#safety-banner');
  dice(/1 near-miss registrato — non azzera il conteggio, ma va guardato/.test(saf),
    '⛔ sul Quadro: «1 near-miss registrato — non azzera il conteggio, ma va guardato» (tre pezzi, tutti e tre al plurale)', saf);

  dice(await vaiSez(p, 'nav-perm'), 'giorno: sono nella schermata Permessi');
  const perm = await testo(p, '#perm-riep');
  dice(/L'unico permesso registrato è in ordine/.test(perm) && !/Tutti i 1 permessi/.test(perm),
    "⛔ «L'unico permesso registrato è in ordine», non «Tutti i 1 permessi registrati sono in ordine»", perm);

  dice(await vaiSez(p, 'nav-doc'), 'giorno: sono nella schermata Documenti');
  const dss = await testo(p, '#dss-list');
  dice(/Ultima revisione 1 giorno fa/.test(dss) && !/1 giorni fa/.test(dss),
    '⛔ il DSS rivisto ieri: «Ultima revisione 1 giorno fa»', dss.slice(0, 260));

  // il promemoria: non resta a schermo, va negli APPUNTI e poi in un'email
  dice(await vaiSez(p, 'nav-scad'), 'giorno: sono nello scadenzario');
  const bot = await p.$('[data-prom-scad]');
  if (bot) {
    await bot.scrollIntoViewIfNeeded().catch(() => {});
    await bot.click({ force: true }).catch(() => {});
    await p.waitForTimeout(800);
    azioni++;
    const copiato = await p.evaluate(() => window.__copiato || '');
    dice(copiato.length > 80, 'il promemoria è stato davvero copiato negli appunti', copiato.slice(0, 80));
    dice(/\(1 giorno fa\)/.test(copiato) && !/\(1 giorni fa\)/.test(copiato),
      "⛔ NEL TESTO CHE SI MANDA AL LAVORATORE: «(1 giorno fa)», non «(1 giorni fa)»",
      (copiato.match(/risulta SCADUTA[^\n]*/) || [])[0]);
    setaccio('giorno/promemoria', copiato);
  } else dice(false, 'lo scadenzario ha il bottone Promemoria ([data-prom-scad])', 'assente');

  await ctx.close();
}

// ══ CASO «regolare» ═══════════════════════════════════════════════════════
console.log('\n· il caso «regolare»: la persona che PUÒ andare, e i due stati vuoti tranquilli');
{
  const { ctx, p } = await apri('regolare');

  dice(await vaiSez(p, 'nav-pers'), 'regolare: sono in Personale');
  await p.click('#pers-tabs [data-tab="mans"]').catch(() => {}); await p.waitForTimeout(600);
  const mat = await testo(p, '#mat-riep');
  dice(/Oggi può andare 1 persona su 1/.test(mat), '⛔ «Oggi può andare 1 persona su 1», non «possono andare 1 persone»', mat);
  const gm = await testo(p, '#graf-mansioni');
  dice(/Sull'unica mansione con persone assegnate/.test(gm),
    "⛔ «Sull'unica mansione con persone assegnate corsi e DPI sono in ordine»", gm.slice(0, 220));

  dice(await vaiSez(p, 'nav-scad'), 'regolare: sono nello scadenzario');
  const gc = await testo(p, '#graf-copertura');
  dice(/Sull'unico tipo di adempimento registrato/.test(gc),
    "⛔ «Sull'unico tipo di adempimento registrato le persone sono in regola»", gc.slice(0, 220));

  await ctx.close();
}

// ══ CASO «due» ════════════════════════════════════════════════════════════
console.log("\n· il caso «due»: due tipi e UN adempimento da sistemare — l'aria del grafico");
{
  const { ctx, p } = await apri('due');
  dice(await vaiSez(p, 'nav-scad'), 'due: sono nello scadenzario');
  const arie = await p.evaluate(() => [...document.querySelectorAll('[aria-label]')]
    .map((x) => x.getAttribute('aria-label')).filter((s) => s && s.length > 40));
  const cop = arie.find((a) => /Copertura della formazione/.test(a)) || '(nessuna aria di copertura)';
  dice(/1 adempimento da sistemare in tutto/.test(cop),
    "⛔ L'ARIA DEL GRAFICO — l'unica versione del numero che arriva a chi non lo vede: «1 adempimento da sistemare in tutto»", cop);
  for (const a of arie) setaccio('due/aria', a);
  dice(arie.length >= 2, `le arie dei grafici sono state lette davvero (${arie.length})`, arie.length);
  await ctx.close();
}

await b.close();

// ══ IL SETACCIO ═══════════════════════════════════════════════════════════
for (const f of trovate) console.log(`      ${f}`);
dice(trovate.length === 0, `nessuna frase lasciata al plurale con un dato solo (${trovate.length} trovate)`, trovate[0]);

/* ⛔ IL CONTROLLO SUL RIGHELLO, non sul risultato: quante schermate ha letto
   davvero e quanti comandi ha premuto. Uno «zero violazioni» senza questi
   numeri non distingue «pulito» da «non ho aperto niente». */
dice(schermate >= 40, `abbastanza schermate lette (${schermate}, ${caratteri} caratteri)`, schermate);
dice(azioni >= 9, `abbastanza comandi premuti davvero (${azioni}: export, import, promemoria, checklist, mansione)`, azioni);
const doppie = INVARIABILI.filter((w) => PAROLE.includes(w));
dice(doppie.length === 0, 'nessuna parola invariabile è finita fra quelle cercate (accuserebbe una frase giusta)', doppie);

const ATTESI = DIFETTI_MODULO.length + DIFETTI_PAGINA.length;
if (CONTROPROVA) {
  console.log(`\n  ${rimessi.size} difetti su ${ATTESI} rimessi davvero  ·  ${iniezioniMancate} iniezioni mancate`
    + `  ·  ${ko} prove cadute su ${ok + ko}`);
  if (rimessi.size < ATTESI) {
    console.error('✗ un difetto non è stato rimesso: il banco non è stato messo alla prova su quel punto.');
    process.exit(1);
  }
  if (ko === 0) { console.error('✗ CONTROPROVA: coi difetti rimessi il banco NON è caduto'); process.exit(1); }
  console.log('✔ CONTROPROVA: coi difetti rimessi il banco cade, come deve.');
  process.exit(0);
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate, ${caratteri} caratteri, ${azioni} comandi premuti`
  + `  ·  ${PAROLE.length} parole, ${VERBI.length} verbi e ${AGGETTIVI.length} aggettivi cercati,`
  + ` ${INVARIABILI.length} invariabili escluse  ·  ${ATTESI} difetti tenuti chiusi dalla controprova`);
process.exit(ko ? 1 : 0);
