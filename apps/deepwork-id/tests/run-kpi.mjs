// ============================================================
// Test delle funzioni PURE di calcolo delle 6 app verticali
// (kpiFrom + helper di stato). Sono i numeri su cui l'azienda fa
// affidamento (scadenze, superamenti, incassi, volumi, flotta):
// qui li blindiamo contro regressioni. JS puro, nessun emulatore.
// I moduli *-data.js non hanno import top-level problematici (lo SDK
// è importato in modo dinamico DENTRO la funzione dati), quindi le
// funzioni pure si importano ed eseguono in Node senza rete.
// ============================================================

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const app = (name, file) => import(join(HERE, `../../${name}/${file}`));

const scudo = await app("scudo", "scudo-data.js");
const conti = await app("conti", "conti-data.js");
const sentinella = await app("sentinella", "sentinella-data.js");
const terra = await app("terra", "terra-data.js");
const flotta = await app("flotta", "flotta-data.js");
const campo = await app("campo", "campo-data.js");
const shell = await import(join(HERE, "../../../shared/deepwork-id-client/dw-shell.js"));
const ponti = await import(join(HERE, "../../../shared/dw-ponti.js"));
/* Il motore dei grafici è uno script classico (IIFE), non un modulo ESM: si carica
   con `require`, che fa scattare il suo `module.exports`. Serve la sua GEOMETRIA
   pura — numeri dentro, stringa fuori — per difendere la regola dei buchi senza
   browser. */
const { createRequire } = await import("node:module");
const grafici = createRequire(import.meta.url)(join(HERE, "../../../shared/dw-grafici.js"));

let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const eq = (got, exp, why) => {
  const a = JSON.stringify(got), b = JSON.stringify(exp);
  if (a !== b) throw new Error(`${why}: atteso ${b}, ottenuto ${a}`);
};
/* Asserzione vero/falso con il motivo scritto: serve dove il controllo non è
   «questo valore è quello» ma «questa condizione regge» — un residuo azzerato,
   un turno che risulta chiuso, un motivo che nomina il corso mancante. */
const ok = (cond, why) => { if (!cond) throw new Error(String(why || "condizione non verificata")); };

/* Come eq, ma guarda solo i campi elencati e ignora quelli in più.
   Serve dove il risultato è destinato a crescere: aggiungere un campo nuovo a
   un KPI o a un parser è una cosa voluta, e non deve far fallire un test che
   parlava d'altro. I valori vengono comunque confrontati uno per uno, quindi
   un numero sbagliato viene preso lo stesso; per i campi nuovi si scrive una
   riga in più, così la novità è coperta invece che solo tollerata. */
const contiene = (got, exp, why) => {
  if (got == null || typeof got !== "object") throw new Error(`${why}: atteso un oggetto, ottenuto ${JSON.stringify(got)}`);
  for (const k of Object.keys(exp)) {
    const a = JSON.stringify(got[k]), b = JSON.stringify(exp[k]);
    if (a !== b) throw new Error(`${why}: campo ${k} atteso ${b}, ottenuto ${a}`);
  }
};
// date relative a OGGI per i test che usano internamente new Date()
const iso = (d) => d.toISOString().slice(0, 10);
const plusDays = (n) => iso(new Date(Date.now() + n * 86400000));
const PAST = "2000-01-01", FUT = "2099-12-31";

console.log("\n— Scudo: scadenze personale —");
test("statoScadenza classifica passato/futuro/vicino", () => {
  eq(scudo.statoScadenza(PAST), "scaduta", "passato");
  eq(scudo.statoScadenza(FUT), "regolare", "futuro");
  eq(scudo.statoScadenza(plusDays(10)), "in-scadenza", "entro 30gg");
});
test("livelloScadenza: etichette e fasce fini (scaduta/oggi/7/30/oltre)", () => {
  const o = new Date("2026-07-20T00:00:00");
  eq(scudo.livelloScadenza("2026-07-19", o), { cls: "danger", label: "scaduta da 1 gg", giorni: -1 }, "scaduta ieri");
  eq(scudo.livelloScadenza("2026-07-20", o), { cls: "danger", label: "scade oggi", giorni: 0 }, "oggi");
  eq(scudo.livelloScadenza("2026-07-27", o).cls, "danger", "entro 7 gg = rosso");
  eq(scudo.livelloScadenza("2026-07-28", o).cls, "warn", "8 gg = giallo");
  eq(scudo.livelloScadenza("2026-08-19", o).cls, "warn", "30 gg = giallo");
  eq(scudo.livelloScadenza("2026-08-20", o).cls, "ok", "31 gg = verde");
});
test("livelloScadenza: senza data non allarma (giorni null)", () => {
  eq(scudo.livelloScadenza(undefined), { cls: "ok", label: "senza data", giorni: null }, "undefined");
  eq(scudo.livelloScadenza("").giorni, null, "vuota");
});
test("coperturaFormazione: raggruppa per tipo con stati, peggiore prima", () => {
  const o = new Date("2026-07-20T00:00:00");
  // uso date relative a 'oggi' del test? statoScadenza usa new Date() reale;
  // per determinismo passo date molto lontane.
  const sca = [
    { tipo: "Visita medica", dataScadenza: "2000-01-01" }, // scaduta
    { tipo: "Visita medica", dataScadenza: "2099-01-01" }, // regolare
    { tipo: "Corso",         dataScadenza: "2099-01-01" }, // regolare
  ];
  const c = scudo.coperturaFormazione(sca);
  eq(c[0].tipo, "Visita medica", "peggiore (con scadute) prima");
  eq(c[0], { tipo: "Visita medica", totale: 2, scadute: 1, inScadenza: 0, regolari: 1 }, "conteggi visita");
  eq(c[1], { tipo: "Corso", totale: 1, scadute: 0, inScadenza: 0, regolari: 1 }, "conteggi corso");
});
test("coperturaFormazione: nessuna scadenza = lista vuota (niente crash)", () =>
  eq(scudo.coperturaFormazione([]), [], "vuoto"));
test("riepilogoInfortuni: giorni senza infortuni; i near-miss non azzerano il contatore", () => {
  const inf = [
    { data: "2026-05-18", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0 },
    { data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4 },
    { data: "2026-01-10", tipo: "infortunio", gravita: "grave", giorniAssenza: 30 },
  ];
  const r = scudo.riepilogoInfortuni(inf, new Date(2026, 6, 21));   // 21 luglio 2026
  eq(r.infortuni, 2, "due infortuni veri");
  eq(r.nearMiss, 1, "un near-miss");
  eq(r.gravi, 1, "uno grave");
  eq(r.giorniAssenzaTot, 34, "4+30 giorni di assenza");
  eq(r.ultimo, "2026-02-03", "ultimo infortunio = il più recente (near-miss escluso)");
  if (!(r.giorniSenza > 160 && r.giorniSenza < 175)) throw new Error("giorniSenza atteso ~168, ottenuto " + r.giorniSenza);
});
test("riepilogoInfortuni: senza infortuni veri giorniSenza è null (non un falso 0)", () => {
  const r = scudo.riepilogoInfortuni([{ data: "2026-07-01", tipo: "near-miss" }], new Date(2026, 6, 21));
  eq(r.infortuni, 0, "nessun infortunio vero");
  eq(r.nearMiss, 1, "un near-miss");
  eq(r.giorniSenza, null, "senza infortuni → null");
});
test("parseInfortuniCsv: legge data/tipo/gravità/giorni/descrizione; scarta data non ISO", () => {
  const csv = "data;tipo;gravita;giorniAssenza;descrizione;luogo\n2026-02-03;infortunio;lieve;4;Taglio alla mano;officina\n2026-05-18;near-miss;lieve;0;Caduta massi;fronte Est\n15/05/2026;infortunio;grave;10;;\n";
  const p = scudo.parseInfortuniCsv(csv);
  eq(p.length, 2, "solo le 2 righe con data ISO");
  eq(p[0], { data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, descrizione: "Taglio alla mano", luogo: "officina" }, "riga completa");
  eq(p[1].tipo, "near-miss", "near-miss riconosciuto");
  const solo = scudo.parseInfortuniCsv("2026-01-01;xyz;;;;");
  eq(solo[0].tipo, "near-miss", "tipo sconosciuto → near-miss (prudente)");
});
test("parseScadenzeCsv: legge lav/tipo/desc/data, azienda=null, scarta data non valida", () => {
  const csv = "lavoratore;tipo;descrizione;scadenza\n"
    + "Mario Rossi;Visita medica;Periodica;2026-09-01\n"
    + "AZIENDA;DVR;Revisione;2026-10-15\n"
    + "Tizio;Corso;Antincendio;15/10/2026\n"       // data non ISO → scartata
    + ";;;2026-11-01\n";                            // tipo assente → "Altro", lavoratore null
  const s = scudo.parseScadenzeCsv(csv);
  eq(s.length, 3, "3 valide (scartata la data non ISO)");
  eq(s[0], { lavoratore: "Mario Rossi", tipo: "Visita medica", descrizione: "Periodica", dataScadenza: "2026-09-01" }, "riga lavoratore");
  eq(s[1].lavoratore, null, "AZIENDA → null");
  eq(s[2], { lavoratore: null, tipo: "Altro", descrizione: null, dataScadenza: "2026-11-01" }, "tipo assente → Altro");
});
test("parseScadenzeCsv: CRLF (Excel) e testo vuoto = niente crash", () => {
  eq(scudo.parseScadenzeCsv(""), [], "vuoto");
  const s = scudo.parseScadenzeCsv("Luca;Patente;CQC;2026-12-01\r\n");
  eq(s.length, 1, "CRLF ok");
  eq(s[0].dataScadenza, "2026-12-01", "data letta");
});
/* LA REGOLA CONDIVISA SUI DOPPIONI DENTRO UN FILE.
   Nata dentro Scudo il 31/07 e subito portata in shared/, perché la misura ha
   detto che lo stesso buco stava in DIECI gestori d'importazione su dieci, in
   tutte e sei le app: il doppione si cercava solo contro l'elenco caricato
   all'apertura, che non si aggiorna mentre il file scorre. */
test("senzaDoppioni: la stessa chiave due volte entra una volta sola", () => {
  const r = shell.senzaDoppioni(
    [{ n: "Rossi" }, { n: "Bianchi" }, { n: "Rossi" }], x => x.n);
  eq(r.length, 2, "tre righe, due cose diverse");
  eq(r.map(x => x.n), ["Rossi", "Bianchi"], "e resta l'ordine del file");
});
test("senzaDoppioni: maiuscole e spazi non fanno due cose diverse", () => {
  const r = shell.senzaDoppioni([{ n: "Rossi Mario" }, { n: "  ROSSI MARIO " }], x => x.n);
  eq(r.length, 1, "è la stessa persona scritta in due modi");
  eq(r[0].n, "Rossi Mario", "vince la PRIMA scrittura: chi rilegge il proprio file si aspetta il suo ordine");
});
test("senzaDoppioni: una chiave VUOTA passa, non schiaccia le righe insieme", () => {
  /* Decisione presa apposta: senza chiave non si può decidere se sia un
     doppione, e schiacciare insieme tutte le righe senza chiave farebbe
     sparire dati veri. Chi le scarta è il lettore dell'app, che sa quali
     campi sono obbligatori per quella cosa lì. */
  const r = shell.senzaDoppioni([{ n: "" }, { n: "" }, { n: null }, { n: "Rossi" }], x => x.n);
  eq(r.length, 4, "tre righe senza chiave restano tre, più quella con la chiave");
});
test("senzaDoppioni: la chiave può essere composta (titolo + data)", () => {
  /* Serve davvero: gli adempimenti di Sentinella considerano doppione la
     stessa pratica con la stessa scadenza, non lo stesso titolo. */
  const righe = [
    { t: "Relazione", s: "2026-12-31" },
    { t: "Relazione", s: "2027-12-31" },
    { t: "Relazione", s: "2026-12-31" },
  ];
  eq(shell.senzaDoppioni(righe, x => x.t + "|" + x.s).length, 2, "due scadenze diverse restano due");
});
test("senzaDoppioni: elenco vuoto o assente = niente crash", () => {
  eq(shell.senzaDoppioni([], x => x), [], "elenco vuoto");
  eq(shell.senzaDoppioni(null, x => x), [], "elenco che manca");
});
/* ⚠️ Questo controlla il COMPORTAMENTO, non l'identità, e va detto: una copia
   scritta a mano che si comportasse allo stesso modo passerebbe. L'identità —
   che l'app CHIAMI la regola condivisa invece di riscriverla — non si vede da
   qui, perché `senzaDoppioni` non viene ri-esportata: si usa e basta. È una
   regola di stile sul codice sorgente, e sta in run-stile.mjs (regola 12).
   Qui si prova la metà che si può provare: che Scudo scelga come la regola
   condivisa, compreso «vince la prima scrittura». */
test("parseLavoratoriCsv si comporta come la regola condivisa", () => {
  eq(typeof shell.senzaDoppioni, "function", "la regola condivisa esiste ed è esportata");
  const dentro = scudo.parseLavoratoriCsv("Rossi;operatore;333\nRossi;capocava;444");
  const fuori = shell.senzaDoppioni(
    [{ nome: "Rossi" }, { nome: "Rossi" }], x => x.nome);
  eq(dentro.length, fuori.length, "stesso numero di righe in uscita");
  eq(dentro[0].ruolo, "operatore", "e la stessa scelta: vince la prima");
});

/* L'ANAGRAFICA DEI LAVORATORI — il primo file che una cava carica, e fino al
   31/07 l'unico dei diciassette import che nessuna prova poteva guardare,
   perché stava scritto dentro la pagina. Portarlo fuori ha fatto emergere un
   difetto vero: il doppione si cercava solo fra chi era GIÀ in archivio, e
   quell'elenco non si aggiornava mentre il file scorreva. Non è un caso di
   scuola — l'esportazione di Scudo scrive una riga per ogni SCADENZA, quindi
   il file di un lavoratore con tre scadenze lo nomina tre volte. */
test("parseLavoratoriCsv: nome/ruolo/telefono, intestazione e riga AZIENDA fuori", () => {
  const p = scudo.parseLavoratoriCsv(
    "nome;ruolo;telefono\nRossi Mario;operatore;333 1234567\nBianchi Luca;capocava;\nAZIENDA;;;");
  eq(p.length, 2, "due persone: l'intestazione e la riga aziendale non sono persone");
  eq(p[0], { nome: "Rossi Mario", ruolo: "operatore", tel: "333 1234567", attivo: true }, "prima riga");
  eq(p[1].tel, "", "un telefono che manca resta vuoto, non diventa un finto numero");
  eq(p[1].attivo, true, "chi si carica entra attivo");
});
test("parseLavoratoriCsv: lo stesso nome più volte NEL FILE entra una volta sola", () => {
  /* Esattamente la forma dell'export di Scudo: una riga per scadenza. */
  const esportato =
    "nome;ruolo;telefono;idoneita;scadenza;data;stato\n" +
    "Rossi Mario;operatore;333;idoneo;Visita medica;2026-01-01;ok\n" +
    "Rossi Mario;operatore;333;idoneo;Corso antincendio;2026-02-01;ok\n" +
    "Rossi Mario;operatore;333;idoneo;Patentino;2026-03-01;ok\n" +
    "AZIENDA;;;;DVR;2026-04-01;ok";
  const p = scudo.parseLavoratoriCsv(esportato);
  eq(p.length, 1, "un lavoratore con tre scadenze resta UN lavoratore");
  eq(p[0].nome, "Rossi Mario", "ed è lui");
});
test("parseLavoratoriCsv: il doppione si riconosce anche scritto diverso", () => {
  const p = scudo.parseLavoratoriCsv("Rossi Mario;operatore;333\n  ROSSI MARIO ;capocava;444");
  eq(p.length, 1, "maiuscole e spazi non fanno due persone diverse");
  eq(p[0].ruolo, "operatore", "vince la prima scrittura, non l'ultima");
});
test("parseLavoratoriCsv: CRLF (Excel), righe vuote e testo assente = niente crash", () => {
  eq(scudo.parseLavoratoriCsv(""), [], "testo vuoto");
  eq(scudo.parseLavoratoriCsv(null), [], "testo che manca");
  const p = scudo.parseLavoratoriCsv("Rossi Mario;operatore;333\r\n\r\nBianchi Luca;;\r\n");
  eq(p.length, 2, "CRLF di Windows e righe vuote in mezzo");
});
test("SCADENZE_PRESET: lista non vuota, chiavi uniche, categorie/tipo validi", () => {
  const P = scudo.SCADENZE_PRESET;
  eq(P.length > 0, true, "non vuota");
  eq(P.length, new Set(P.map(x => x.chiave)).size, "chiavi uniche");
  // "cava" è la terza categoria, aggiunta col blocco di preset del D.Lgs 624/96
  // (relazione annuale sulla stabilità dei fronti, DSS, sorvegliante…): sono
  // adempimenti dell'attività estrattiva, né della persona né dell'azienda.
  eq(P.every(x => ["persona", "azienda", "cava"].includes(x.categoria)), true, "categorie valide");
  eq(P.every(x => x.tipo && x.etichetta), true, "tipo + etichetta presenti");
});
test("presetScadenza: chiave valida → daVerificare true; inesistente → null", () => {
  const p = scudo.presetScadenza("sorv-sanitaria");
  eq(p.daVerificare, true, "daVerificare sempre true");
  eq(p.categoria, "persona", "categoria persona");
  eq(scudo.presetScadenza("boh"), null, "chiave inesistente = null");
});
test("kpiFrom conta scadute/in-scadenza e lavoratori regolari", () => {
  const lav = [{ id: "l1", attivo: true }, { id: "l2", attivo: true }, { id: "l3", attivo: false }];
  const sca = [
    { lavoratoreId: "l1", dataScadenza: PAST },        // scaduta
    { lavoratoreId: "l2", dataScadenza: plusDays(10) },// in-scadenza
    { lavoratoreId: "l1", dataScadenza: FUT },         // regolare
  ];
  eq(scudo.kpiFrom(lav, sca), { scadute: 1, trenta: 1, regolari: 0 }, "kpi scudo");
});
test("kpiFrom: regolare solo se attivo E senza scadenze problematiche", () => {
  const lav = [
    { id: "a", attivo: true },   // solo una scadenza futura → regolare
    { id: "b", attivo: true },   // nessuna scadenza → regolare
    { id: "c", attivo: false },  // nessun problema ma inattivo → NON conta
    { id: "d", attivo: true },   // ha una scaduta → NON regolare
  ];
  const sca = [
    { lavoratoreId: "a", dataScadenza: FUT },
    { lavoratoreId: "d", dataScadenza: PAST },
  ];
  eq(scudo.kpiFrom(lav, sca), { scadute: 1, trenta: 0, regolari: 2 }, "regolari = a + b");
});
test("statoScadenza: una scadenza SENZA data non allarma (= regolare)", () => {
  // dato incompleto (data mancante) → non deve risultare scaduta/in-scadenza
  eq(scudo.statoScadenza(undefined), "regolare", "undefined");
  eq(scudo.statoScadenza(""), "regolare", "vuota");
  eq(scudo.statoScadenza(null), "regolare", "null");
  // e nel KPI il lavoratore con una scadenza senza data resta "regolare"
  eq(scudo.kpiFrom([{ id: "l1", attivo: true }], [{ lavoratoreId: "l1" }]),
    { scadute: 0, trenta: 0, regolari: 1 }, "kpi con scadenza senza data");
});
test("idoneitaLabel: esito → classe/etichetta (art. 41)", () => {
  eq(scudo.idoneitaLabel("idoneo").cls, "ok", "idoneo");
  eq(scudo.idoneitaLabel("prescrizioni").cls, "warn", "prescrizioni");
  eq(scudo.idoneitaLabel("non-idoneo").cls, "danger", "non idoneo");
  eq(scudo.idoneitaLabel("").cls, "", "non definito");
  eq(scudo.idoneitaLabel(undefined).label, "Idoneità n.d.", "assente = n.d.");
});
test("idoneitaSuccessivo: ciclo n.d.→idoneo→prescrizioni→non-idoneo→n.d.", () => {
  eq(scudo.idoneitaSuccessivo(""), "idoneo", "nd→idoneo");
  eq(scudo.idoneitaSuccessivo("idoneo"), "prescrizioni", "idoneo→prescrizioni");
  eq(scudo.idoneitaSuccessivo("prescrizioni"), "non-idoneo", "prescrizioni→non-idoneo");
  eq(scudo.idoneitaSuccessivo("non-idoneo"), "", "non-idoneo→nd");
  eq(scudo.idoneitaSuccessivo("valore-strano"), "idoneo", "sconosciuto→idoneo");
});
test("idoneitaCriticita: solo attivi non-idonei o con prescrizioni", () => {
  const lav = [
    { id: "a", attivo: true,  idoneita: "idoneo" },
    { id: "b", attivo: true,  idoneita: "prescrizioni" },
    { id: "c", attivo: true,  idoneita: "non-idoneo" },
    { id: "d", attivo: false, idoneita: "non-idoneo" },  // inattivo → escluso
    { id: "e", attivo: true },                            // senza idoneità → escluso
  ];
  eq(scudo.idoneitaCriticita(lav).map(l => l.id), ["b", "c"], "solo b e c");
});

console.log("\n— Conti: fatture e gare —");
test("giorni calcola la distanza in giorni", () => {
  eq(conti.giorni("2026-07-20", new Date("2026-07-10T00:00:00")), 10, "10 giorni");
});
test("kpiFrom: da incassare, in scadenza, gare aperte, età media credito", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-25", emessa: "2026-07-10" },
    { importo: 50, incassata: true, scadenza: "2026-06-01", emessa: "2026-05-01" },
    { importo: 30, incassata: false, scadenza: "2026-07-22", emessa: "2026-07-02" },
  ];
  const gare = [{ stato: "aperta" }, { stato: "vinta" }];
  eq(conti.kpiFrom(fatture, gare, oggi),
    { daIncassare: 130, inScadenza: 2, gareAperte: 1, etaCredito: 14 }, "kpi conti");
});
test("kpiFrom: inScadenza = solo fatture NON incassate con scadenza entro 10 giorni", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 10, incassata: false, scadenza: "2026-07-30", emessa: "2026-07-01" }, // +10 gg → conta (confine)
    { importo: 10, incassata: false, scadenza: "2026-07-31", emessa: "2026-07-01" }, // +11 gg → NON conta
    { importo: 10, incassata: false, scadenza: "2026-07-10", emessa: "2026-07-01" }, // scaduta → conta
    { importo: 10, incassata: true,  scadenza: "2026-07-21", emessa: "2026-07-01" }, // incassata e vicina → NON conta
  ];
  eq(conti.kpiFrom(fatture, [], oggi).inScadenza, 2, "confine 10gg + scaduta, esclusa l'incassata");
});
test("kpiFrom: una fattura senza data di emissione non rompe l'età media credito", () => {
  // regressione: prima una fattura senza "emessa" rendeva la metrica = NaN
  // (mostrata come "NaN giorni" nel cruscotto). Ora contribuisce 0.
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-25", emessa: undefined },   // senza data → 0 gg
    { importo: 50,  incassata: false, scadenza: "2026-07-25", emessa: "2026-07-10" }, // 10 gg
  ];
  const etaCredito = conti.kpiFrom(fatture, [], oggi).etaCredito;
  eq(Number.isFinite(etaCredito), true, "età media credito è un numero finito");
  eq(etaCredito, 5, "media di 0 e 10");
});
test("agingIncassi: fatture divise per fascia di ritardo, importi corretti", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-08-01" }, // non scaduto
    { importo: 200, incassata: false, scadenza: "2026-07-10" }, // scaduto 10 gg → 1-30
    { importo: 300, incassata: false, scadenza: "2026-06-01" }, // scaduto 49 gg → 31-60
    { importo: 400, incassata: false, scadenza: "2026-05-01" }, // scaduto 80 gg → 61-90
    { importo: 500, incassata: false, scadenza: "2026-03-01" }, // scaduto 141 gg → >90
    { importo: 999, incassata: true,  scadenza: "2026-03-01" }, // incassata → esclusa
  ];
  const a = conti.agingIncassi(fatture, oggi);
  eq(a.nonScaduto, { conto: 1, importo: 100 }, "non scaduto");
  eq(a.g1_30,   { conto: 1, importo: 200 }, "1-30");
  eq(a.g31_60,  { conto: 1, importo: 300 }, "31-60");
  eq(a.g61_90,  { conto: 1, importo: 400 }, "61-90");
  eq(a.oltre90, { conto: 1, importo: 500 }, ">90");
  eq(a.scadutoTot, 1400, "totale scaduto = 200+300+400+500");
});
test("agingIncassi: nessuna fattura = fasce a zero (niente crash)", () => {
  const a = conti.agingIncassi([], new Date("2026-07-20T00:00:00"));
  eq(a.scadutoTot, 0, "scaduto 0");
  eq(a.nonScaduto.conto, 0, "non scaduto 0");
});
test("agingIncassi: confini esatti delle fasce (off-by-one su 30/31/60/61/90/91 gg)", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  // scadenze scelte per cadere a ESATTAMENTE r giorni di ritardo (verificato
  // con la funzione giorni): il confine di ogni fascia non deve slittare.
  const fatture = [
    { importo: 1, incassata: false, scadenza: "2026-06-20" }, // r=30 → g1_30
    { importo: 1, incassata: false, scadenza: "2026-06-19" }, // r=31 → g31_60
    { importo: 1, incassata: false, scadenza: "2026-05-21" }, // r=60 → g31_60
    { importo: 1, incassata: false, scadenza: "2026-05-20" }, // r=61 → g61_90
    { importo: 1, incassata: false, scadenza: "2026-04-21" }, // r=90 → g61_90
    { importo: 1, incassata: false, scadenza: "2026-04-20" }, // r=91 → oltre90
  ];
  const a = conti.agingIncassi(fatture, oggi);
  eq(a.g1_30.conto, 1, "r=30 nella prima fascia");
  eq(a.g31_60.conto, 2, "r=31 e r=60 nella seconda fascia");
  eq(a.g61_90.conto, 2, "r=61 e r=90 nella terza fascia");
  eq(a.oltre90.conto, 1, "r=91 oltre i 90 giorni");
});
test("agingIncassi: scadenza esattamente oggi = non scaduto (g=0)", () => {
  const a = conti.agingIncassi([{ importo: 10, incassata: false, scadenza: "2026-07-20" }], new Date("2026-07-20T00:00:00"));
  eq(a.nonScaduto.conto, 1, "g=0 non scaduto");
  eq(a.scadutoTot, 0, "niente scaduto");
});
test("gareRiepilogo: conta stati, valori e tasso di vittoria (solo decise)", () => {
  const gare = [
    { stato: "aperta", base: 100 },
    { stato: "aperta", base: 200 },
    { stato: "vinta",  base: 300 },
    { stato: "vinta",  base: 400 },
    { stato: "persa",  base: 500 },
  ];
  const r = conti.gareRiepilogo(gare);
  eq(r.aperte, 2, "2 aperte"); eq(r.baseAperta, 300, "base aperte 300");
  eq(r.vinte, 2, "2 vinte"); eq(r.perse, 1, "1 persa");
  eq(r.tassoVittoria, 67, "2 vinte su 3 decise = 67%");
});
test("gareRiepilogo: nessuna gara decisa → tasso null (niente divisione per zero)", () => {
  const r = conti.gareRiepilogo([{ stato: "aperta", base: 100 }]);
  eq(r.tassoVittoria, null, "nessuna decisa");
  eq(r.vinte, 0, "0 vinte");
});
test("prioritaIncasso: ordina per ritardo, poi per importo; esclude incassate", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { numero: "A", importo: 100, incassata: false, scadenza: "2026-08-01" }, // non scaduta
    { numero: "B", importo: 200, incassata: false, scadenza: "2026-07-01" }, // scaduta 19 gg
    { numero: "C", importo: 900, incassata: false, scadenza: "2026-07-01" }, // scaduta 19 gg, più grossa
    { numero: "D", importo: 999, incassata: true,  scadenza: "2026-01-01" }, // incassata → esclusa
  ];
  const p = conti.prioritaIncasso(fatture, oggi).map(x => x.f.numero);
  eq(p, ["C", "B", "A"], "C e B (scadute, C più grossa) poi A");
  eq(conti.prioritaIncasso(fatture, oggi)[0].ritardo, 19, "ritardo in giorni");
});
test("incassoAtteso: somma le fatture aperte in scadenza entro N giorni", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-25" }, // tra 5 gg → dentro
    { importo: 200, incassata: false, scadenza: "2026-08-19" }, // tra 30 gg → dentro (confine)
    { importo: 400, incassata: false, scadenza: "2026-08-20" }, // tra 31 gg → fuori
    { importo: 800, incassata: false, scadenza: "2026-07-10" }, // già scaduta → fuori (non "atteso")
    { importo: 999, incassata: true,  scadenza: "2026-07-25" }, // incassata → fuori
  ];
  eq(conti.incassoAtteso(fatture, 30, oggi), { conto: 2, importo: 300 }, "5gg + 30gg = 300");
});
test("incassoAtteso: nessuna in finestra = zero (niente crash)", () =>
  eq(conti.incassoAtteso([], 30, new Date("2026-07-20T00:00:00")), { conto: 0, importo: 0 }, "vuoto"));
test("incassoPerMese: raggruppa gli incassi attesi per mese, scadute a parte", () => {
  const oggi = new Date(2026, 6, 15);   // 15 luglio 2026 (ora locale)
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-20" },  // questo mese
    { importo: 70,  incassata: false, scadenza: "2026-07-31" },  // questo mese
    { importo: 50,  incassata: false, scadenza: "2026-08-05" },  // mese prossimo
    { importo: 30,  incassata: false, scadenza: "2026-06-01" },  // già scaduta
    { importo: 999, incassata: true,  scadenza: "2026-07-25" },  // incassata → ignorata
    { importo: 40,  incassata: false, scadenza: "2027-06-01" },  // oltre 6 mesi → fuori finestra
  ];
  const r = conti.incassoPerMese(fatture, 6, oggi);
  eq(r.mesi.length, 6, "6 mesi in finestra");
  eq(r.mesi[0], { mese: "2026-07", conto: 2, importo: 170 }, "luglio: 2 fatture, 170");
  eq(r.mesi[1], { mese: "2026-08", conto: 1, importo: 50 }, "agosto: 1 fattura, 50");
  eq(r.scadute, { conto: 1, importo: 30 }, "una scaduta a parte");
});
test("incassoPerMese: lista vuota = 6 mesi a zero, niente scadute (no crash)", () => {
  const r = conti.incassoPerMese([], 6, new Date(2026, 6, 15));
  eq(r.mesi.length, 6, "6 mesi");
  eq(r.mesi.every(m => m.conto === 0 && m.importo === 0), true, "tutti a zero");
  eq(r.scadute, { conto: 0, importo: 0 }, "niente scadute");
});
test("esposizioneClienti: totale non incassato per cliente, con scaduto, dal più esposto", () => {
  const oggi = new Date(2026, 6, 20);   // 20 luglio 2026
  const fatture = [
    { cliente: "Edil Srl", importo: 5000, incassata: false, scadenza: "2026-07-10" }, // scaduta
    { cliente: "Edil Srl", importo: 3000, incassata: false, scadenza: "2026-08-30" }, // a scadere
    { cliente: "Strade Spa", importo: 2000, incassata: false, scadenza: "2026-08-01" },
    { cliente: "Edil Srl", importo: 9999, incassata: true,  scadenza: "2026-07-01" }, // incassata → esclusa
    { cliente: "Vuoto", importo: 0, incassata: false, scadenza: "2026-08-01" },       // importo 0 → escluso
  ];
  const e = conti.esposizioneClienti(fatture, oggi);
  eq(e.length, 2, "2 clienti esposti");
  // Con l'anagrafica clienti la riga porta anche chiave, clienteId, fido e
  // oltreFido. Si verificano i campi che contano invece dell'uguaglianza
  // esatta: aggiungere un campo non deve far fallire un test che non lo usa.
  eq(e[0].cliente, "Edil Srl", "Edil in cima");
  eq(e[0].totale, 8000, "totale esposto 8000");
  eq(e[0].scaduto, 5000, "di cui scaduto 5000");
  eq(e[0].conto, 2, "su 2 fatture");
  eq(e[1].cliente, "Strade Spa", "Strade seconda");
  eq(e[1].totale, 2000, "totale esposto 2000");
  eq(e[1].scaduto, 0, "niente scaduto");
  eq(e[1].conto, 1, "su 1 fattura");
});
test("esposizioneClienti: nessuna fattura aperta = lista vuota (niente crash)", () =>
  eq(conti.esposizioneClienti([{ cliente: "X", importo: 100, incassata: true, scadenza: "2026-07-01" }]), [], "tutte incassate"));
test("parseFattureCsv: legge le fatture, coerce importo/incassata, scarta rotte", () => {
  const csv = "numero;cliente;importo;emessa;scadenza;incassata\n"
    + "2026/050;Edil Srl;1000,50;2026-07-01;2026-08-01;si\n"
    + "2026/051;Strade Spa;2000;2026-07-05;2026-08-05\n"
    + ";SenzaNumero;500;;;\n"
    + "2026/052;;300;;;\n";
  const f = conti.parseFattureCsv(csv);
  eq(f.length, 2, "solo 2 valide");
  eq(f[0], { numero: "2026/050", cliente: "Edil Srl", importo: 1000.5, emessa: "2026-07-01", scadenza: "2026-08-01", incassata: true }, "virgola decimale + incassata si");
  eq(f[1].incassata, false, "senza colonna incassata → false");
});
test("parseFattureCsv: testo vuoto = lista vuota (niente crash)", () =>
  eq(conti.parseFattureCsv(""), [], "vuoto"));
test("parseGareCsv: legge titolo/base/scadenza/stato; stato ignoto → aperta; scarta righe senza titolo", () => {
  const csv = "titolo;base;scadenza;stato\nComune di Ragusa — inerti;120000;2026-07-28;aperta\nANAS — SS115;340.000,50;2026-08-12;vinta\nSenza stato;5000;2026-09-01;boh\n;1000;2026-09-01;aperta\n";
  const p = conti.parseGareCsv(csv);
  eq(p.length, 3, "3 gare valide (riga senza titolo scartata)");
  eq(p[0], { titolo: "Comune di Ragusa — inerti", base: 120000, scadenza: "2026-07-28", stato: "aperta" }, "riga completa");
  eq(p[1].base, 340000.5, "base all'italiana");
  eq(p[1].stato, "vinta", "stato valido mantenuto");
  eq(p[2].stato, "aperta", "stato ignoto → aperta");
});
/* ⛔ LA PROVA CHE CONTA È LA DENSITÀ MANCANTE. Un listino vero, nato prima
   dell'app, spesso la densità non ce l'ha, e la tentazione è metterci un valore
   "ragionevole" per far funzionare le conversioni. Da m³ a tonnellate si passa
   proprio con quel numero: una densità inventata trasforma un dato MANCANTE in
   un dato SBAGLIATO, che nessuno andrà più a controllare perché ha l'aria di
   essere stato inserito. Finisce in una fattura e poi nella denuncia annuale.
   Se manca deve restare `null`, e Conti dice che non può convertire. */
/* ⚠️ TRE CAMPI, TRE DECISIONI DIVERSE — ed è il punto della funzione. Non
   esiste una regola sola «il dato che manca resta mancante»: dipende da cosa
   fa quel dato.
   - la GIACENZA che manca vale ZERO, ed è l'unico posto di tutta la giornata in
     cui il valore di comodo è quello giusto: un ricambio in magazzino senza
     quantità è un ricambio che non c'è, e zero è ciò che fa scattare il
     sotto-scorta — cioè l'avviso che serve. Lasciarla vuota nasconderebbe
     proprio i pezzi finiti, che sono quelli da ordinare.
   - la SOGLIA MINIMA che manca resta null: una soglia inventata fa suonare un
     allarme che nessuno ha chiesto, oppure lo tace.
   - il PREZZO che manca resta null: entra nel conto dei costi, e uno zero
     farebbe sembrare gratis un pezzo che gratis non è. */
test("parseRicambiCsv: la giacenza che manca vale zero, la soglia e il prezzo no", () => {
  const csv = "nome;giacenza;sogliaMin;prezzo\n"
    + "Denti benna;;3;\n"              // niente giacenza, niente prezzo
    + "Olio idraulico;1;;420,50\n"     // niente soglia
    + "Bulloni;abc;0;0\n";             // giacenza illeggibile, soglia e prezzo zero
  const r = flotta.parseRicambiCsv(csv);
  eq(r.length, 3, "nessun ricambio scartato");
  eq(r[0].giacenza, 0, "giacenza assente → 0: il pezzo finito DEVE risultare finito");
  eq(r[2].giacenza, 0, "e illeggibile → 0, per la stessa ragione");
  eq(r[0].prezzo, null, "prezzo assente → null, non gratis");
  eq(r[2].prezzo, null, "prezzo zero → null: un ricambio non costa zero");
  eq(r[1].sogliaMin, null, "soglia assente → null: nessun allarme inventato");
  eq(r[2].sogliaMin, null, "soglia zero → null");
  eq(r[0].sogliaMin, 3, "e quella scritta si rispetta");
});
test("parseRicambiCsv: intestazione, righe vuote, prezzi all'italiana", () => {
  const csv = "nome;giacenza;sogliaMin;prezzo\r\nFiltro olio motore CAT;6;4;48\r\n\r\n;9;1;10\r\nCingolo;2;1;1.250,75\r\n";
  const r = flotta.parseRicambiCsv(csv);
  eq(r.length, 2, "intestazione, riga vuota e riga senza nome fuori");
  eq(r[0], { nome: "Filtro olio motore CAT", giacenza: 6, sogliaMin: 4, prezzo: 48 }, "riga completa");
  eq(r[1].prezzo, 1250.75, "migliaia e decimali all'italiana");
});
test("parseRicambiCsv: niente testo, niente errori", () => {
  eq(flotta.parseRicambiCsv("").length, 0, "vuoto");
  eq(flotta.parseRicambiCsv(null).length, 0, "null");
});
/* ⛔ LA SOGLIA DI UN RICETTORE È UN NUMERO DI SICUREZZA. Inventarne uno
   "ragionevole" quando il file non ce l'ha vorrebbe dire dichiarare conforme o
   non conforme una misura sulla base di un valore che nessuno ha scelto — e la
   conformità finisce in un report che il cliente consegna all'ente. La soglia
   propria del ricettore è già facoltativa nel prodotto: se manca resta `null` e
   il ricettore vale comunque come anagrafica.
   Stessa logica sulla CLASSE ACUSTICA, per una ragione in più: la classe decide
   una soglia. Una classe non riconosciuta resta VUOTA — un campo vuoto si vede
   e si corregge, una classe sbagliata no. */
test("parseRicettoriCsv: la soglia e la classe non si inventano mai", () => {
  const csv = "nome;tipo;distanza;classe;soglia;unita;nota\n"
    + "Confine Nord;confine;90;;;;\n"            // né classe né soglia
    + "Scuola;scuola;640;I;non so;µg/m³;\n"      // soglia illeggibile
    + "Capannone;magazzino;120;VII;3;mm/s;\n";   // tipo e classe fuori vocabolario
  const r = sentinella.parseRicettoriCsv(csv);
  eq(r.length, 3, "nessun ricettore scartato: l'anagrafica vale comunque");
  eq(r[0].soglia, null, "soglia assente → null");
  eq(r[1].soglia, null, "soglia illeggibile → null, non un valore di comodo");
  eq(r[0].classe, "", "classe assente → vuota");
  eq(r[2].classe, "", "classe fuori vocabolario → vuota, non la più vicina");
  eq(r[2].tipo, "altro", "un tipo sconosciuto ricade su «altro», che è dichiarato");
});
test("parseRicettoriCsv: legge quello che il cliente scrive davvero", () => {
  const csv = "nome;tipo;distanza;classe;soglia;unita;nota\r\n"
    + "Casa Bianchi — via Cava 12;ABITAZIONE;320;iii;5;mm/s;la più vicina al fronte\r\n"
    + "\r\n"
    + ";confine;90;V;20;mm/s;senza nome\r\n"
    + "Casa lontana;abitazione;1.250,5;II;2,5;mm/s;\r\n";
  const r = sentinella.parseRicettoriCsv(csv);
  eq(r.length, 2, "intestazione, riga vuota e riga senza nome fuori");
  eq(r[0], { nome: "Casa Bianchi — via Cava 12", tipo: "abitazione", distanza: 320,
             classe: "III", soglia: 5, unita: "mm/s", nota: "la più vicina al fronte" },
     "maiuscole e minuscole non contano, il resto sì");
  eq(r[1].distanza, 1250.5, "distanza all'italiana");
  eq(r[1].soglia, 2.5, "e soglia con la virgola");
});
test("parseRicettoriCsv: niente testo, niente errori", () => {
  eq(sentinella.parseRicettoriCsv("").length, 0, "vuoto");
  eq(sentinella.parseRicettoriCsv(null).length, 0, "null");
});
test("parseListinoCsv: la densità che manca resta mancante, non diventa un numero", () => {
  const csv = "nome;unita;prezzo;densita;iva\n"
    + "Misto di cava;t;6,5;;22\n"          // densità assente
    + "Detrito;t;4;0;22\n"                  // densità zero: non è una densità
    + "Sabbia;mc;22;non so;22\n";           // densità illeggibile
  const l = conti.parseListinoCsv(csv);
  eq(l.length, 3, "tre prodotti, nessuno scartato per colpa della densità");
  eq(l[0].densita, null, "assente → null");
  eq(l[1].densita, null, "zero → null: una densità zero non esiste");
  eq(l[2].densita, null, "illeggibile → null, non un valore di comodo");
  eq(l[0].prezzo, 6.5, "e il prezzo si legge lo stesso: il prodotto è utilizzabile");
});
test("parseListinoCsv: unità di prezzo scritte come le scrive la gente", () => {
  const csv = "nome;unita;prezzo;densita;iva\n"
    + "A;mc;22;1,6;22\nB;m³;22;1,6;22\nC;M3;22;1,6;22\n"
    + "D;TONNELLATE;12;1,5;22\nE;t;12;1,5;22\nF;;12;1,5;22\nG;pezzi;12;1,5;22\n";
  const l = conti.parseListinoCsv(csv);
  eq(l.map(x => x.unitaPrezzo).join(","), "m3,m3,m3,t,t,t,t",
    "le tre scritture del metro cubo valgono m3; tutto il resto ricade su t, che in cava è il caso normale");
});
test("parseListinoCsv: intestazione, righe vuote, prezzi all'italiana, IVA propria", () => {
  const csv = "nome;unita;prezzo;densita;iva\r\n"
    + "Stabilizzato 0/30;t;8,50;1,9;22\r\n"
    + "\r\n"
    + ";t;10;1,5;22\r\n"                    // senza nome: si scarta
    + "Pietrisco agevolato;t;1.250,75;1,5;10\r\n";
  const l = conti.parseListinoCsv(csv);
  eq(l.length, 2, "intestazione, riga vuota e riga senza nome fuori");
  eq(l[0], { nome: "Stabilizzato 0/30", unitaPrezzo: "t", prezzo: 8.5, densita: 1.9, iva: 22 }, "riga completa");
  eq(l[1].prezzo, 1250.75, "migliaia e decimali all'italiana");
  eq(l[1].iva, 10, "un'aliquota diversa da 22 si rispetta");
});
test("parseListinoCsv: niente testo, niente errori", () => {
  eq(conti.parseListinoCsv("").length, 0, "vuoto");
  eq(conti.parseListinoCsv(null).length, 0, "null");
  eq(conti.parseListinoCsv("nome;unita;prezzo;densita;iva").length, 0, "solo intestazione");
});
test("parseFattureCsv: gestisce CRLF (export Excel) e scarta importo ≤ 0", () => {
  const csv = "numero;cliente;importo;emessa;scadenza\r\n"
    + "A1;Alfa;100;2026-07-01;2026-08-01\r\n"
    + "A2;Beta;0;2026-07-01;2026-08-01\r\n"
    + "A3;Gamma;-50;2026-07-01;2026-08-01\r\n";
  const f = conti.parseFattureCsv(csv);
  eq(f.length, 1, "solo importo > 0");
  eq(f[0].numero, "A1", "riga valida");
});
test("livelloSollecito: fasce di ritardo → livello di sollecito", () => {
  eq(conti.livelloSollecito(0).livello, 0, "non scaduta = nessun sollecito");
  eq(conti.livelloSollecito(10), { livello: 1, label: "1° sollecito", cls: "warn" }, "10 gg = 1°");
  eq(conti.livelloSollecito(15).livello, 1, "confine 15 gg = 1°");
  eq(conti.livelloSollecito(16).livello, 2, "16 gg = 2°");
  eq(conti.livelloSollecito(45).livello, 2, "confine 45 gg = 2°");
  eq(conti.livelloSollecito(46), { livello: 3, label: "ultimo avviso", cls: "danger" }, "46 gg = ultimo");
});
test("interessiMora: D.Lgs 231/2002, importo × tasso × giorni/365", () => {
  // 10.000 € al 10,15% per 365 gg = 1015 €
  eq(conti.interessiMora(10000, 365, 10.15), { interessi: 1015, giorni: 365, tasso: 10.15 }, "1 anno intero");
  // 10.000 € al 10,15% per 30 gg ≈ 83,42 €
  eq(conti.interessiMora(10000, 30, 10.15).interessi, 83.42, "30 giorni");
  eq(conti.interessiMora(10000, 30).tasso, conti.TASSO_MORA_DEFAULT, "tasso di default 10,15%");
});
test("interessiMora: non in ritardo o dati non validi = zero", () => {
  eq(conti.interessiMora(10000, 0).interessi, 0, "0 giorni = 0");
  eq(conti.interessiMora(0, 30).interessi, 0, "importo 0 = 0");
  eq(conti.interessiMora(10000, -5).interessi, 0, "ritardo negativo = 0");
});
test("testoSollecito: lettera pronta con mora 231/2002 e totale dovuto", () => {
  const t = conti.testoSollecito(
    { numero: "2026/031", cliente: "Edilcave Srl", importo: 18300, scadenza: "2026-07-08" },
    new Date(2026, 6, 21));   // 13 giorni di ritardo
  const must = ["2026/031", "Edilcave Srl", "€ 18.300", "13 giorni", "€ 66,16", "€ 40", "€ 18.406,16", "231/2002"];
  for (const s of must) if (!t.includes(s)) throw new Error(`manca "${s}" nel testo del sollecito`);
});
test("testoSollecito: null se non scaduta o dati non validi", () => {
  eq(conti.testoSollecito({ numero: "X", importo: 100, scadenza: "2099-12-31" }, new Date(2026, 6, 21)), null, "non scaduta");
  eq(conti.testoSollecito({ numero: "X", importo: 0, scadenza: "2000-01-01" }, new Date(2026, 6, 21)), null, "importo 0");
  eq(conti.testoSollecito({ numero: "X", importo: 100 }, new Date(2026, 6, 21)), null, "senza scadenza");
});
test("estrattoContoCliente: elenca le fatture aperte del cliente con totali e mora", () => {
  const fatture = [
    { numero: "2026/031", cliente: "Edilcave Srl", importo: 18300, scadenza: "2026-07-08", incassata: false },  // scaduta 13 gg
    { numero: "2026/040", cliente: "Edilcave Srl", importo: 5000,  scadenza: "2026-08-30", incassata: false },   // non scaduta
    { numero: "2026/028", cliente: "Edilcave Srl", importo: 12000, scadenza: "2026-06-12", incassata: true },     // incassata → esclusa
    { numero: "2026/034", cliente: "Stradesud",    importo: 9750,  scadenza: "2026-07-25", incassata: false },    // altro cliente
  ];
  const t = conti.estrattoContoCliente("Edilcave Srl", fatture, new Date(2026, 6, 21));
  const must = ["Estratto conto — Edilcave Srl", "Data: 21/07/2026", "2026/031", "2026/040",
                "Totale aperto: € 23.300", "Di cui scaduto: € 18.300", "€ 40 × 1", "231/2002"];
  for (const s of must) if (!t.includes(s)) throw new Error(`manca "${s}" nell'estratto conto`);
  if (t.includes("2026/028")) throw new Error("la fattura incassata non deve comparire");
  if (t.includes("2026/034")) throw new Error("le fatture di altri clienti non devono comparire");
});
test("estrattoContoCliente: null se cliente senza fatture aperte o nome vuoto", () => {
  eq(conti.estrattoContoCliente("Nessuno", [{ cliente: "Altro", importo: 100, incassata: false, scadenza: "2026-07-01" }], new Date(2026, 6, 21)), null, "cliente inesistente");
  eq(conti.estrattoContoCliente("", [{ cliente: "Altro", importo: 100, incassata: false, scadenza: "2026-07-01" }], new Date(2026, 6, 21)), null, "nome vuoto");
  eq(conti.estrattoContoCliente("X", [{ cliente: "X", importo: 100, incassata: true, scadenza: "2026-07-01" }], new Date(2026, 6, 21)), null, "solo fatture incassate");
});
// — Scudo: testo del promemoria scadenze —
test("testoPromemoria: convocazione per scadenza scaduta o in scadenza", () => {
  const scaduta = scudo.testoPromemoria(
    { tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-07-02" },
    { nome: "Mario Rossi" }, new Date(2026, 6, 21));   // scaduta da 19 gg
  for (const s of ["Mario Rossi", "Visita medica", "SCADUTA", "02/07/2026", "19 giorni fa"])
    if (!scaduta.includes(s)) throw new Error(`manca "${s}" nel promemoria (scaduta)`);
  const prox = scudo.testoPromemoria(
    { tipo: "Corso", descrizione: "Corso antincendio", dataScadenza: "2026-08-10" },
    { nome: "Luca Bianchi" }, new Date(2026, 6, 21));   // tra 20 gg
  for (const s of ["Luca Bianchi", "scade il 10/08/2026", "tra 20 giorni"])
    if (!prox.includes(s)) throw new Error(`manca "${s}" nel promemoria (in scadenza)`);
});
test("testoPromemoria: null se regolare, senza lavoratore o senza data", () => {
  eq(scudo.testoPromemoria({ tipo: "X", dataScadenza: "2099-12-31" }, { nome: "Y" }, new Date(2026, 6, 21)), null, "regolare");
  eq(scudo.testoPromemoria({ tipo: "X", dataScadenza: "2000-01-01" }, { nome: "" }, new Date(2026, 6, 21)), null, "senza nome");
  eq(scudo.testoPromemoria({ tipo: "X" }, { nome: "Y" }, new Date(2026, 6, 21)), null, "senza data");
});
test("prioritaIncasso: fattura senza data = ritardo 0 (non in cima per errore)", () => {
  const p = conti.prioritaIncasso([{ numero: "X", importo: 50, incassata: false }], new Date("2026-07-20T00:00:00"));
  eq(p[0].ritardo, 0, "senza data → ritardo 0");
});
test("agingIncassi: fattura senza scadenza = non scaduto, non gonfia lo scaduto", () => {
  // robustezza su dati importati/legacy: una data mancante non deve
  // finire nel bucket 'oltre 90 gg' (regressione da revisione notturna).
  const a = conti.agingIncassi([{ importo: 100, incassata: false }], new Date("2026-07-20T00:00:00"));
  eq(a.nonScaduto, { conto: 1, importo: 100 }, "senza data → non scaduto");
  eq(a.oltre90.conto, 0, "non finisce in oltre 90");
  eq(a.scadutoTot, 0, "scaduto totale 0");
});

console.log("\n— Sentinella: monitoraggi ambientali —");
test("statoMisura: superamento/attenzione/conforme dalla soglia", () => {
  eq(sentinella.statoMisura({ valore: 10, soglia: 10 }).cls, "danger", "=soglia");
  eq(sentinella.statoMisura({ valore: 9.5, soglia: 10 }).cls, "warn", "90%");
  eq(sentinella.statoMisura({ valore: 5, soglia: 10 }).cls, "ok", "sotto");
});
test("kpiFrom: attivi, superamenti, adempimenti entro 30gg", () => {
  const mon = [{ valore: 10, soglia: 10 }, { valore: 1, soglia: 10 }];
  const ade = [{ scadenza: plusDays(10) }, { scadenza: FUT }];
  eq(sentinella.kpiFrom(mon, ade), { attivi: 2, superamenti: 1, adempimenti30: 1 }, "kpi sentinella");
});
test("kpiFrom: un adempimento senza scadenza non viene conteggiato (né crash)", () => {
  // dato incompleto: niente NaN, l'adempimento senza data semplicemente
  // non entra nel conteggio "entro 30 giorni"
  const ade = [{ titolo: "senza data" }, { scadenza: plusDays(5) }];
  const k = sentinella.kpiFrom([], ade);
  eq(Number.isFinite(k.adempimenti30), true, "adempimenti30 è un numero finito");
  eq(k.adempimenti30, 1, "conta solo quello con la data");
});

console.log("\n— Terra: volumi e avanzamento —");
test("fmtM3 formatta k/M e gestisce il vuoto", () => {
  // il decimale dei milioni con la VIRGOLA: questo test asseriva «1.2M» col
  // punto inglese, quindi inchiodava il difetto invece di proteggere il
  // prodotto. Corretto rendendolo più giusto, non più permissivo.
  eq(terra.fmtM3(1200000), "1,2M", "milioni");
  eq(terra.fmtM3(38000), "38k", "migliaia");
  eq(terra.fmtM3(500), "500", "unità");
  eq(terra.fmtM3(500.5), "500,5", "sotto i mille il decimale si vede, con la virgola");
  eq(terra.fmtM3(null), "—", "vuoto");
});
test("kpiFrom: volumi del mese, avanzamento annuo, fronti attivi", () => {
  const oggi = new Date("2026-07-15T00:00:00");
  const fronti = [{ stato: "attivo" }, { stato: "sospeso" }];
  const rilievi = [
    { stato: "elaborato", volumeM3: 1000, data: "2026-07-05" },
    { stato: "elaborato", volumeM3: 2000, data: "2026-06-10" },
    { stato: "pianificato", volumeM3: null, data: "2026-07-20" },
  ];
  const piano = [{ pianificatoAnnuoM3: 12000, riserveM3: 500000 }];
  contiene(terra.kpiFrom(fronti, rilievi, piano, oggi),
    { volumiMese: 1000, rilieviMese: 1, avanzamento: 25, riserveM3: 500000, frontiAttivi: 1 }, "kpi terra");
});
/* Il punto della separazione scavo/cumulo: il materiale ripreso da un cumulo
   già estratto NON è nuovo scavo e non deve consumare il volume concesso. */
test("kpiFrom: la ripresa da cumulo non consuma il concesso", () => {
  const oggi = new Date("2026-07-15T00:00:00");
  const piano = [{ pianificatoAnnuoM3: 12000, riserveM3: 500000 }];
  const soloScavo = [{ stato: "elaborato", volumeM3: 1000, data: "2026-07-05" }];
  const conCumulo = soloScavo.concat([{ stato: "elaborato", volumeM3: 4000, data: "2026-07-06", provenienza: "cumulo" }]);
  const a = terra.kpiFrom([], soloScavo, piano, oggi);
  const b = terra.kpiFrom([], conCumulo, piano, oggi);
  eq(b.volumiMese, a.volumiMese, "i volumi di scavo del mese non cambiano");
  eq(b.avanzamento, a.avanzamento, "l'avanzamento sul concesso non cambia");
  eq(b.volumiMeseCumulo, 4000, "la ripresa da cumulo si conta a parte");
});
test("provenienzaRilievo: un rilievo senza il campo vale scavo (dati vecchi intatti)", () => {
  eq(terra.provenienzaRilievo({}), "scavo", "campo assente");
  eq(terra.provenienzaRilievo({ provenienza: "CUMULO" }), "cumulo", "maiuscole e spazi non contano");
  eq(terra.provenienzaRilievo({ provenienza: "boh" }), "scavo", "valore non previsto = scavo, mai perdere volume");
});
test("kpiFrom: l'avanzamento annuo ignora i rilievi di altri anni", () => {
  const oggi = new Date("2026-07-15T00:00:00");
  const rilievi = [
    { stato: "elaborato", volumeM3: 3000, data: "2026-03-01" },  // anno corrente → conta
    { stato: "elaborato", volumeM3: 9000, data: "2025-12-31" },  // anno scorso → NON conta
  ];
  const piano = [{ pianificatoAnnuoM3: 12000 }];
  const k = terra.kpiFrom([], rilievi, piano, oggi);
  eq(k.avanzamento, 25, "solo i 3000 del 2026 (non 100% con i 9000 del 2025)");
  eq(k.volumiMese, 0, "nessun rilievo a luglio → volumi mese 0");
});
test("volumeFronte: somma solo i rilievi elaborati (con volume) del fronte", () => {
  const rilievi = [
    { fronteId: "f1", stato: "elaborato",  volumeM3: 1000 },  // conta
    { fronteId: "f1", stato: "elaborato",  volumeM3: 500 },   // conta
    { fronteId: "f1", stato: "pianificato", volumeM3: null }, // pianificato → no
    { fronteId: "f1", stato: "elaborato",  volumeM3: null },  // senza volume → no
    { fronteId: "f2", stato: "elaborato",  volumeM3: 9999 },  // altro fronte → no
  ];
  eq(terra.volumeFronte(rilievi, "f1"), 1500, "1000 + 500");
  eq(terra.volumeFronte(rilievi, "f2"), 9999, "solo il suo");
  eq(terra.volumeFronte([], "f1"), 0, "nessun rilievo = 0");
});
test("valoreMateriale: m³ → tonnellate → valore (densità e prezzo)", () => {
  eq(terra.valoreMateriale(1000, 1.6, 12), { tonnellate: 1600, valore: 19200 }, "1000 m³ × 1,6 × 12€");
  eq(terra.valoreMateriale(0, 1.6, 12), { tonnellate: 0, valore: 0 }, "volume 0");
});
test("valoreMateriale: input non validi contano come 0 (niente NaN)", () => {
  eq(terra.valoreMateriale(1000, undefined, 12), { tonnellate: 0, valore: 0 }, "densità assente → 0");
  eq(terra.valoreMateriale("abc", 1.6, 12), { tonnellate: 0, valore: 0 }, "volume non numerico → 0");
  eq(terra.valoreMateriale(1000, 1.6, ""), { tonnellate: 1600, valore: 0 }, "prezzo vuoto → valore 0");
});
test("valoreMateriale: input negativi trattati come 0 (niente valori assurdi)", () => {
  eq(terra.valoreMateriale(-5, 1.6, 12), { tonnellate: 0, valore: 0 }, "volume negativo → 0");
  eq(terra.valoreMateriale(1000, -1, 12), { tonnellate: 0, valore: 0 }, "densità negativa → 0");
  eq(terra.valoreMateriale(1000, 1.6, -3), { tonnellate: 1600, valore: 0 }, "prezzo negativo → 0");
});
test("parseRilieviCsv: legge data/volume/metodo/gsd, scarta righe non valide", () => {
  const csv = "data;volumeM3;metodo;gsd\n2026-07-15;19400;RTK+GCP;2\n2026-06-16;21300\nquando;100;;\n2026-05-01;abc;;\n";
  const p = terra.parseRilieviCsv(csv);
  eq(p.length, 2, "solo 2 valide (data e volume validi)");
  contiene(p[0], { data: "2026-07-15", volumeM3: 19400, metodo: "RTK+GCP", gsd: "2" }, "riga completa");
  contiene(p[1], { data: "2026-06-16", volumeM3: 21300, metodo: null, gsd: null }, "riga minima");
  eq(p[0].provenienza, "scavo", "senza sesta colonna il volume vale scavo, come prima");
});
test("parseRilieviCsv: testo vuoto = lista vuota (niente crash)", () =>
  eq(terra.parseRilieviCsv(""), [], "vuoto"));
test("parseFrontiCsv: legge nome/banco/quota/stato; stato ignoto → attivo; scarta righe senza nome", () => {
  const csv = "nome;banco;quota;stato\nFronte Nord;banco 2;340;attivo\nFronte Sud;banco 3;320;sospeso\nFronte X;;10;boh\n;banco 1;5;attivo\n";
  const p = terra.parseFrontiCsv(csv);
  eq(p.length, 3, "3 fronti validi (riga senza nome scartata)");
  eq(p[0], { nome: "Fronte Nord", banco: "banco 2", quota: 340, stato: "attivo" }, "riga completa");
  eq(p[1].stato, "sospeso", "stato valido mantenuto");
  eq(p[2].stato, "attivo", "stato ignoto → attivo");
});
test("parseRilieviCsv: colonna fronte facoltativa (nome), righe a 4 colonne invariate", () => {
  const csv = "data;volumeM3;metodo;gsd;fronte\n2026-07-15;19400;RTK;2;Fronte Nord\n2026-06-16;21300\n";
  const p = terra.parseRilieviCsv(csv);
  eq(p.length, 2, "due righe valide");
  eq(p[0].fronte, "Fronte Nord", "nome fronte estratto quando presente");
  eq(p[1].fronte, undefined, "riga senza fronte → nessuna chiave (retrocompatibile)");
});
test("parseRilieviCsv: CRLF, scarta data non ISO, virgola decimale", () => {
  const csv = "data;volumeM3;metodo;gsd\r\n2026-07-15;19400,5;RTK;2\r\n15/07/2026;1000;RTK;2\r\n";
  const p = terra.parseRilieviCsv(csv);
  eq(p.length, 1, "scarta la data non AAAA-MM-GG");
  contiene(p[0], { data: "2026-07-15", volumeM3: 19400.5, metodo: "RTK", gsd: "2" }, "ISO + virgola decimale");
});
test("riservaResidua: residuo = riserve − estratto; anni al ritmo pianificato", () => {
  eq(terra.riservaResidua(1000000, 100000, 125000), { residuo: 900000, anni: 7.2 }, "900k / 125k = 7,2 anni");
  eq(terra.riservaResidua(100000, 200000, 125000), { residuo: 0, anni: 0 }, "estratto > riserve → residuo 0");
});
test("riservaResidua: senza riserva stimata = null; senza ritmo = anni null", () => {
  eq(terra.riservaResidua(null, 100, 125000), null, "riserve assenti → null");
  eq(terra.riservaResidua(1000000, 0, 0).anni, null, "ritmo 0 → anni non stimabili");
});
test("trendVolumi: confronta gli ultimi due rilievi elaborati (per data)", () => {
  const ril = [
    { data: "2026-07-01", volumeM3: 18600, stato: "elaborato" },   // precedente
    { data: "2026-07-15", volumeM3: 19400, stato: "elaborato" },   // ultimo
    { data: "2026-06-16", volumeM3: 21300, stato: "elaborato" },   // più vecchio
    { data: "2026-08-01", volumeM3: null,  stato: "pianificato" }, // ignorato
  ];
  eq(terra.trendVolumi(ril), { ultimo: 19400, precedente: 18600, delta: 800, pct: 4 }, "+800 (+4%)");
});
test("trendVolumi: meno di due rilievi elaborati = null", () => {
  eq(terra.trendVolumi([{ data: "2026-07-15", volumeM3: 100, stato: "elaborato" }]), null, "uno solo");
  eq(terra.trendVolumi([]), null, "vuoto");
});
test("classeAccuratezza: da metodo+GSD a classe e tolleranza tipica", () => {
  eq(terra.classeAccuratezza({ metodo: "RTK+GCP", gsd: "2" }).classe, "survey-grade", "RTK+GCP, GSD 2");
  eq(terra.classeAccuratezza({ metodo: "RTK+GCP", gsd: "2" }).tolleranzaPct, 2, "±2%");
  eq(terra.classeAccuratezza({ metodo: "PPK" }).classe, "survey-grade", "PPK, GSD ignoto");
  eq(terra.classeAccuratezza({ metodo: "RTK", gsd: "5" }).classe, "indicativo", "GSD 5 > 2 → indicativo");
  eq(terra.classeAccuratezza({ gsd: "1.5" }).classe, "indicativo", "solo GSD, niente metodo → indicativo");
  eq(terra.classeAccuratezza({}).classe, "n.d.", "niente → n.d.");
  eq(terra.classeAccuratezza({}).tolleranzaPct, null, "n.d. → tolleranza null");
});
test("bandaVolume: banda ± sulla base della %tolleranza", () => {
  eq(terra.bandaVolume(19400, 2), { volume: 19400, banda: 388, min: 19012, max: 19788 }, "19400 ±2% = ±388");
  eq(terra.bandaVolume(1000, 8), { volume: 1000, banda: 80, min: 920, max: 1080 }, "1000 ±8% = ±80");
  eq(terra.bandaVolume(50, 8).min, 46, "min non negativo");
  eq(terra.bandaVolume(100, null), null, "tolleranza assente → null");
  eq(terra.bandaVolume(-5, 2), null, "volume negativo → null");
});
test("presetDensita: ritorna densità tipica del litotipo con avviso daVerificare", () => {
  const c = terra.presetDensita("calcare-compatto");
  eq(c.densita, 2.6, "calcare compatto 2,6 t/m³");
  eq(c.daVerificare, true, "sempre da verificare");
  eq(terra.presetDensita("inesistente"), null, "chiave sconosciuta → null");
  // ogni preset ha chiave/etichetta/densità plausibile per una roccia in banco
  for (const p of terra.DENSITA_PRESET) {
    if (!p.chiave || !p.etichetta) throw new Error("preset senza chiave/etichetta");
    if (!(p.densita >= 1.5 && p.densita <= 3.2)) throw new Error(`densità fuori range per ${p.chiave}: ${p.densita}`);
  }
  // le chiavi sono uniche
  const chiavi = terra.DENSITA_PRESET.map(p => p.chiave);
  if (new Set(chiavi).size !== chiavi.length) throw new Error("chiavi duplicate nei preset densità");
});
test("proiezioneAnnua: al ritmo attuale supera l'autorizzato → danger", () => {
  const rilievi = [
    { data: "2026-07-15", volumeM3: 19400, stato: "elaborato" },
    { data: "2026-07-01", volumeM3: 18600, stato: "elaborato" },
    { data: "2026-06-16", volumeM3: 21300, stato: "elaborato" },
    { data: "2026-05-15", volumeM3: 20100, stato: "elaborato" },
    { data: "2026-08-01", volumeM3: null,  stato: "pianificato" },   // ignorato
    { data: "2025-12-30", volumeM3: 99999, stato: "elaborato" },     // anno diverso → ignorato
  ];
  const p = terra.proiezioneAnnua(rilievi, 125000, new Date(2026, 6, 21));  // ~55% dell'anno, 79400 estratti
  eq(p.estrattoAnno, 79400, "somma solo elaborati del 2026");
  eq(p.pianificato, 125000, "piano annuo");
  eq(p.stato, "danger", "proiezione oltre l'autorizzato");
  if (!(p.proiezione > 125000)) throw new Error("la proiezione deve superare il piano");
  if (!(p.pctPiano > 100)) throw new Error("pctPiano deve superare 100");
});
test("proiezioneAnnua: null senza piano; proiezione null se troppo presto nell'anno", () => {
  eq(terra.proiezioneAnnua([{ data: "2026-03-01", volumeM3: 100, stato: "elaborato" }], 0, new Date(2026, 6, 21)), null, "nessun piano → null");
  const presto = terra.proiezioneAnnua([{ data: "2026-01-03", volumeM3: 500, stato: "elaborato" }], 125000, new Date(2026, 0, 5));
  eq(presto.proiezione, null, "meno di ~1 mese → niente stima");
  eq(presto.estrattoAnno, 500, "l'estratto è comunque riportato");
});
test("qualitaRilievo: compone metodo + GSD; vuoto se non si sa nulla", () => {
  eq(terra.qualitaRilievo({ metodo: "RTK+GCP", gsd: "2" }), "RTK+GCP · GSD 2 cm", "metodo + gsd");
  eq(terra.qualitaRilievo({ metodo: "PPK" }), "PPK", "solo metodo");
  eq(terra.qualitaRilievo({ gsd: "3" }), "GSD 3 cm", "solo gsd");
  eq(terra.qualitaRilievo({}), "", "niente → vuoto");
  eq(terra.qualitaRilievo({ metodo: null, gsd: "" }), "", "campi vuoti → vuoto");
});

console.log("\n— Flotta: mezzi e manutenzioni —");
test("urgenza: a ore / scaduta / in scadenza", () => {
  eq(flotta.urgenza(null).giorni, 9999, "a ore");
  eq(flotta.urgenza(PAST).cls, "danger", "scaduta");
  eq(flotta.urgenza(plusDays(10)).cls, "warn", "entro 30gg");
});
test("kpiFrom: operativi, in manutenzione, tagliandi 30gg, carburante", () => {
  const mezzi = [{ stato: "operativo" }, { stato: "operativo" }, { stato: "fermo" }];
  const manut = [{ dataPrevista: plusDays(5) }, { dataPrevista: null }, { dataPrevista: FUT }];
  const costi = [{ voce: "Carburante", importo: 8400 }, { voce: "Ricambi", importo: 100 }];
  eq(flotta.kpiFrom(mezzi, manut, costi),
    { operativi: 2, inManutenzione: 1, tagliandi30: 1, carburante: 8400 }, "kpi flotta");
});
test("kpiFrom: carburante somma solo le voci col nome «carburante» (case-insensitive)", () => {
  const costi = [
    { voce: "Carburante gasolio", importo: 5000 },  // sottostringa → conta
    { voce: "CARBURANTE", importo: 3000 },           // maiuscolo → conta
    { voce: "Ricambi", importo: 999 },               // → non conta
    { voce: "Assicurazione", importo: 1200 },        // → non conta
  ];
  eq(flotta.kpiFrom([], [], costi).carburante, 8000, "5000 + 3000, il resto escluso");
});
test("urgenzaOre: tagliando a ore motore ai confini (scaduto/50h/oltre)", () => {
  eq(flotta.urgenzaOre(500, 500).cls, "danger", "0 ore mancanti = scaduto");
  eq(flotta.urgenzaOre(500, 520).cls, "danger", "già superato");
  eq(flotta.urgenzaOre(500, 520).label, "SCADUTA (+20 h)", "quante ore oltre");
  eq(flotta.urgenzaOre(500, 450).cls, "warn", "50 h mancanti = warn");   // confine 50
  eq(flotta.urgenzaOre(500, 449).cls, "ok", "51 h mancanti = ok");
});
/* ⚠️ Questa prova, fino al 31/07, pretendeva l'OPPOSTO: «ore attuali mancanti
   trattate come 0 (niente crash)», e bloccava `mancano === 500`. Era una prova
   invecchiata che teneva in piedi un difetto — lo zero di comodo che faceva
   sembrare lontano il tagliando di un mezzo senza contatore. Non è stata resa
   più permissiva: è stata resa più GIUSTA, e adesso pretende che l'app
   dichiari di non sapere. Il «niente crash» resta, ed è quello che conta di
   quella prova: la funzione non esplode. */
test("⛔ urgenzaOre: senza le ore attuali non si finge di saperle", () =>
  eq(flotta.urgenzaOre(500, undefined).mancano, null, "non si sa quanto manca, e non si dice 500"));

console.log("\n— Campo: attività e squadre —");
test("kpiFrom: squadre attive, in corso, rapportini, anomalie", () => {
  const att = [{ stato: "in-corso" }, { stato: "anomalia" }, { stato: "fatto" }];
  const squ = [{ stato: "operativa" }, { stato: "ferma" }];
  const rap = [{ stato: "inviato" }, { stato: "bozza" }];
  eq(campo.kpiFrom(att, squ, rap),
    { squadreAttive: 1, inCorso: 1, rapportiniOggi: 1, anomalie: 1 }, "kpi campo");
});

// ------------------------------------------------------------
// Condizioni al CONFINE: è qui che si nascondono gli errori di
// "un giorno di troppo/di meno". Passo un OGGI fisso così le soglie
// (0 giorni, 30 giorni, rapporto 0,9 e 1,0) sono deterministiche.
// ------------------------------------------------------------
const OGGI = new Date("2026-07-20T00:00:00");

console.log("\n— Confini: soglie di scadenza (Scudo) —");
test("statoScadenza: oggi stesso = in-scadenza (non ancora scaduta)", () =>
  eq(scudo.statoScadenza("2026-07-20", OGGI), "in-scadenza", "0 giorni"));
test("statoScadenza: esattamente 30 giorni = in-scadenza", () =>
  eq(scudo.statoScadenza("2026-08-19", OGGI), "in-scadenza", "30 giorni"));
test("statoScadenza: 31 giorni = regolare", () =>
  eq(scudo.statoScadenza("2026-08-20", OGGI), "regolare", "31 giorni"));
test("statoScadenza: ieri = scaduta", () =>
  eq(scudo.statoScadenza("2026-07-19", OGGI), "scaduta", "-1 giorno"));

console.log("\n— Confini: urgenza manutenzioni (Flotta) —");
test("urgenza: senza data = manutenzione a ore", () =>
  eq(flotta.urgenza(null, OGGI), { cls: "ok", label: "a ore", giorni: 9999 }, "a ore"));
test("urgenza: oggi stesso = warn (0 gg)", () =>
  eq(flotta.urgenza("2026-07-20", OGGI), { cls: "warn", label: "0 gg", giorni: 0 }, "0 gg"));
test("urgenza: esattamente 30 giorni = warn", () =>
  eq(flotta.urgenza("2026-08-19", OGGI), { cls: "warn", label: "30 gg", giorni: 30 }, "30 gg"));
test("urgenza: 31 giorni = ok", () =>
  eq(flotta.urgenza("2026-08-20", OGGI), { cls: "ok", label: "31 gg", giorni: 31 }, "31 gg"));
test("urgenza: ieri = scaduta", () =>
  eq(flotta.urgenza("2026-07-19", OGGI), { cls: "danger", label: "Scaduta", giorni: -1 }, "scaduta"));
test("previsioneGiorni: ore mancanti / ritmo = giorni stimati (arrotonda su)", () => {
  eq(flotta.previsioneGiorni(80, 8), 10, "80h a 8h/gg = 10 gg");
  eq(flotta.previsioneGiorni(85, 8), 11, "85h a 8h/gg = 11 gg (ceil)");
});
test("previsioneGiorni: già scaduto = 0, ritmo assente/zero = null", () => {
  eq(flotta.previsioneGiorni(0, 8), 0, "mancano 0 → 0");
  eq(flotta.previsioneGiorni(-10, 8), 0, "negativo → 0");
  eq(flotta.previsioneGiorni(80, 0), null, "ritmo 0 → non stimabile");
  eq(flotta.previsioneGiorni(80, undefined), null, "ritmo assente → non stimabile");
});
test("disponibilitaFlotta: % operativi sul totale", () => {
  const mezzi = [{ stato: "operativo" }, { stato: "operativo" }, { stato: "fermo" }, { stato: "verifica" }];
  eq(flotta.disponibilitaFlotta(mezzi), { pct: 50, operativi: 2, totale: 4 }, "2 su 4 = 50%");
});
test("disponibilitaFlotta: nessun mezzo = pct null (niente divisione per zero)", () =>
  eq(flotta.disponibilitaFlotta([]), { pct: null, operativi: 0, totale: 0 }, "vuoto"));
test("ripartizioneCosti: accorpa per voce, % sul totale, dal più pesante", () => {
  const costi = [
    { voce: "Carburante", importo: 8000 },
    { voce: "Ricambi", importo: 1500 },
    { voce: "Carburante", importo: 500 },   // stessa voce → accorpata
    { voce: "Gratis", importo: 0 },          // importo 0 → ignorato
  ];
  const r = flotta.ripartizioneCosti(costi);
  eq(r.totale, 10000, "totale 10000");
  eq(r.voci, [
    { voce: "Carburante", importo: 8500, pct: 85 },
    { voce: "Ricambi", importo: 1500, pct: 15 },
  ], "carburante 85%, ricambi 15%");
});
test("ripartizioneCosti: nessun costo = totale 0, voci vuote (niente crash)", () =>
  eq(flotta.ripartizioneCosti([]), { totale: 0, voci: [] }, "vuoto"));
test("prioritaOperative: unisce manutenzioni urgenti, ricambi sotto scorta e mezzi fermi (danger prima)", () => {
  const mezzi = [
    { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5990, stato: "operativo" },  // tagliando a 6000h → mancano 10h → danger? no, ≤50 = warn
    { id: "m2", nome: "Dumper D3 — CAT 745", ore: 9105, stato: "fermo", area: "officina" },
    { id: "m3", nome: "Pala P1 — CAT 980", ore: 6540, stato: "operativo" },
  ];
  const manutenzioni = [
    { titolo: "Tagliando 500h", mezzo: "Escavatore E1", orePreviste: 6000 },        // 10h → warn
    { titolo: "Revisione", mezzo: "Pala P1", dataPrevista: "2099-12-31" },           // lontana → esclusa (ok)
  ];
  const ricambi = [
    { id: "p4", nome: "Denti benna", giacenza: 0, sogliaMin: 3 },                    // esaurito → danger
    { id: "p1", nome: "Filtro olio", giacenza: 6, sogliaMin: 4 },                    // ok → escluso
  ];
  const p = flotta.prioritaOperative(mezzi, manutenzioni, ricambi, new Date(2026, 6, 21));
  // atteso: Dumper fermo (danger) + Denti benna esaurito (danger) prima, poi tagliando E1 (warn)
  eq(p.length, 3, "3 priorità");
  eq(p.every(x => ["danger", "warn"].includes(x.gravita)), true, "solo danger/warn");
  eq(p[p.length - 1].gravita, "warn", "l'ultimo è warn (tagliando a ore)");
  eq(p.filter(x => x.gravita === "danger").length, 2, "due danger (mezzo fermo + ricambio esaurito)");
  if (!p.some(x => x.categoria === "ricambio" && /Denti benna/.test(x.titolo))) throw new Error("manca il ricambio esaurito");
  if (!p.some(x => x.categoria === "mezzo" && /Dumper D3/.test(x.titolo))) throw new Error("manca il mezzo fermo");
});
test("prioritaOperative: nessuna criticità = lista vuota (niente crash)", () =>
  eq(flotta.prioritaOperative([{ nome: "X", ore: 10, stato: "operativo" }], [], []), [], "tutto ok"));
test("sottoScorta: ricambi con giacenza ≤ soglia, ordinati per gravità", () => {
  const ric = [
    { id: "a", nome: "A", giacenza: 6, sogliaMin: 4 },  // sopra → escluso
    { id: "b", nome: "B", giacenza: 2, sogliaMin: 4 },  // sotto di 2
    { id: "c", nome: "C", giacenza: 0, sogliaMin: 3 },  // sotto di 3 (peggiore)
    { id: "d", nome: "D", giacenza: 1, sogliaMin: 1 },  // = soglia → incluso (mancano 0)
  ];
  const s = flotta.sottoScorta(ric);
  eq(s.map(x => x.id), ["c", "b", "d"], "peggiore prima; A escluso");
  eq(s[0].mancano, 3, "a C mancano 3"); eq(s[2].mancano, 0, "a D mancano 0");
});
test("sottoScorta: nessun ricambio = lista vuota (niente crash)", () =>
  eq(flotta.sottoScorta([]), [], "vuoto"));
test("parseTelemetriaCsv: legge mezzo/ore/carburante, scarta righe non valide", () => {
  const csv = "mezzo;ore;carburante\nEscavatore E1;5900;8400\nDumper D1;8420\n;100;0\nPala P1;abc;10\n";
  const p = flotta.parseTelemetriaCsv(csv);
  eq(p.length, 2, "solo 2 righe valide (header e righe rotte scartate)");
  eq(p[0], { mezzo: "Escavatore E1", ore: 5900, carburante: 8400 }, "riga con carburante");
  eq(p[1], { mezzo: "Dumper D1", ore: 8420, carburante: null }, "riga senza carburante");
});
test("parseMezziCsv: legge nome/area/ore/stato; stato ignoto → operativo; scarta righe senza nome", () => {
  const csv = "nome;area;ore;stato\nEscavatore E1 — CAT 352;fronte Est;5870;operativo\nDumper D3;officina;9105;fermo\nPala X;;100;boh\n;piazzale;50;operativo\n";
  const p = flotta.parseMezziCsv(csv);
  eq(p.length, 3, "3 mezzi validi (riga senza nome scartata)");
  eq(p[0], { nome: "Escavatore E1 — CAT 352", area: "fronte Est", ore: 5870, stato: "operativo" }, "riga completa");
  eq(p[1].stato, "fermo", "stato valido mantenuto");
  eq(p[2].stato, "operativo", "stato ignoto → operativo (badge non si rompe)");
});
test("parseTelemetriaCsv: testo vuoto = lista vuota (niente crash)", () =>
  eq(flotta.parseTelemetriaCsv(""), [], "vuoto"));
test("parseTelemetriaCsv: CRLF, scarta ore negative, carburante opzionale", () => {
  const csv = "mezzo;ore;carburante\r\nD1;8500;120\r\nD2;-5;10\r\nD3;9000;\r\n";
  const p = flotta.parseTelemetriaCsv(csv);
  eq(p.length, 2, "scarta le ore negative");
  eq(p[0], { mezzo: "D1", ore: 8500, carburante: 120 }, "riga completa");
  eq(p[1], { mezzo: "D3", ore: 9000, carburante: null }, "carburante mancante = null");
});
test("scaricoGiacenza: sottrae la quantità, mai sotto zero", () => {
  eq(flotta.scaricoGiacenza(5), 4, "default −1");
  eq(flotta.scaricoGiacenza(5, 3), 2, "−3");
  eq(flotta.scaricoGiacenza(1, 3), 0, "non scende sotto zero");
  eq(flotta.scaricoGiacenza(undefined, 1), 0, "giacenza assente → 0");
});

console.log("\n— Confini: stato misura sensori (Sentinella) —");
test("statoMisura: rapporto esattamente 1,0 = superamento", () =>
  eq(sentinella.statoMisura({ valore: 50, soglia: 50 }).cls, "danger", "r=1"));
test("statoMisura: rapporto esattamente 0,9 = attenzione", () =>
  eq(sentinella.statoMisura({ valore: 45, soglia: 50 }).cls, "warn", "r=0,9"));
test("statoMisura: appena sotto 0,9 = conforme", () =>
  eq(sentinella.statoMisura({ valore: 44, soglia: 50 }).cls, "ok", "r<0,9"));
test("statoMisura: soglia 0 non manda in crash (guardia 0,001)", () =>
  eq(sentinella.statoMisura({ valore: 5, soglia: 0 }).cls, "danger", "soglia 0"));

console.log("\n— Libreria soglie normative preimpostate (Sentinella) —");
test("presetSoglia: chiave valida restituisce valore+unità+fonte", () => {
  const p = sentinella.presetSoglia("pm10-giorno");
  eq(p.valore, 50, "PM10 giornaliera 50"); eq(p.unita, "µg/m³", "unità"); eq(p.daVerificare, true, "sempre da verificare");
});
test("presetSoglia: chiave inesistente = null (niente crash)", () =>
  eq(sentinella.presetSoglia("boh"), null, "sconosciuta"));
test("SOGLIE_PRESET: ogni voce ha campi validi e valore > 0", () => {
  for (const p of sentinella.SOGLIE_PRESET) {
    if (!p.chiave || !p.tipo || !p.etichetta || !p.unita || !p.fonte) throw new Error("campo mancante in " + JSON.stringify(p));
    if (!(+p.valore > 0)) throw new Error("valore non positivo in " + p.chiave);
  }
});
test("SOGLIE_PRESET: chiavi tutte uniche", () => {
  const ch = sentinella.SOGLIE_PRESET.map(p => p.chiave);
  eq(ch.length, new Set(ch).size, "nessun duplicato");
});
test("presetSoglia: valori DIN 4150-3 di riferimento corretti", () => {
  eq(sentinella.presetSoglia("din-res-fond").valore, 5, "residenziale fondazione <10Hz");
  eq(sentinella.presetSoglia("din-sens-fond").valore, 3, "sensibile fondazione <10Hz");
  eq(sentinella.presetSoglia("din-ind-fond").valore, 20, "industriale fondazione <10Hz");
});
test("scaledDistance: SD = R/√W (distanza scalata di volata)", () => {
  eq(sentinella.scaledDistance(100, 25), 20, "100/√25 = 20");
  eq(sentinella.scaledDistance(60, 4), 30, "60/√4 = 30");
});
test("scaledDistance: dati non validi = null (niente divisione per zero)", () => {
  eq(sentinella.scaledDistance(100, 0), null, "carica 0");
  eq(sentinella.scaledDistance(0, 25), null, "distanza 0");
  eq(sentinella.scaledDistance(100, undefined), null, "carica assente");
});
test("caricaMax: inverso di SD → W = (R/SD)² (carica max per ritardo)", () => {
  eq(sentinella.caricaMax(100, 20), 25, "100/20=5 → 25 kg");
  eq(sentinella.caricaMax(60, 30), 4, "60/30=2 → 4 kg");
  // coerenza con scaledDistance: SD(caricaMax) ≈ SD obiettivo
  eq(Math.round(sentinella.scaledDistance(100, sentinella.caricaMax(100, 20))), 20, "andata/ritorno");
});
test("caricaMax: dati non validi = null", () => {
  eq(sentinella.caricaMax(100, 0), null, "SD 0");
  eq(sentinella.caricaMax(0, 20), null, "distanza 0");
  eq(sentinella.caricaMax(100, undefined), null, "SD assente");
});
test("parseMonitoraggiCsv: legge sensori, virgola decimale, scarta soglia ≤ 0", () => {
  const csv = "nome;tipo;valore;soglia;unita;nota\n"
    + "Vibrazioni V1;vibrazioni;5,6;5;mm/s;confine Nord\n"
    + "Polveri P2;polveri;36.8;40;µg/m³;\n"
    + "Rotto;rumore;10;0;dB(A);\n"          // soglia 0 → scartato
    + ";polveri;5;40;µg/m³;\n";             // senza nome → scartato
  const m = sentinella.parseMonitoraggiCsv(csv);
  eq(m.length, 2, "2 validi (scartati soglia 0 e senza nome)");
  eq(m[0], { nome: "Vibrazioni V1", tipo: "vibrazioni", valore: 5.6, soglia: 5, unita: "mm/s", nota: "confine Nord" }, "riga completa, virgola decimale");
  eq(sentinella.statoMisura(m[0]).cls, "danger", "5.6/5 → superamento");
});
test("parseMonitoraggiCsv: CRLF (Excel) e testo vuoto = niente crash", () => {
  eq(sentinella.parseMonitoraggiCsv(""), [], "vuoto");
  const m = sentinella.parseMonitoraggiCsv("Rumore R1;rumore;62;70;dB(A);\r\n");
  eq(m.length, 1, "CRLF ok");
  eq(m[0].soglia, 70, "soglia letta");
});
test("riepilogoConformita: conta conformi/attenzione/superamento", () => {
  const mon = [
    { valore: 4, soglia: 10 },   // 40% → conforme
    { valore: 9.5, soglia: 10 }, // 95% → attenzione
    { valore: 12, soglia: 10 },  // superamento
    { valore: 10, soglia: 10 },  // 100% → superamento
  ];
  eq(sentinella.riepilogoConformita(mon), { conformi: 1, attenzione: 1, superamento: 2, totale: 4 }, "conteggi");
});
test("riepilogoConformita: nessun monitoraggio = tutto 0 (niente crash)", () =>
  eq(sentinella.riepilogoConformita([]), { conformi: 0, attenzione: 0, superamento: 0, totale: 0 }, "vuoto"));
test("prioritaConformita: misure non conformi + adempimenti (scaduto=danger), danger prima", () => {
  const mon = [
    { nome: "Vibr V2", valore: 5.6, soglia: 5, unita: "mm/s" },     // 1.12 → superamento (danger)
    { nome: "PM10", valore: 36.8, soglia: 40, unita: "µg/m³" },     // 0.92 → attenzione (warn)
    { nome: "Acque", valore: 12, soglia: 35, unita: "mg/l" },       // 0.34 → conforme (escluso)
  ];
  const ade = [
    { titolo: "Relazione ARPA", ente: "ARPA", scadenza: "2026-07-10" }, // scaduto da 11 gg → danger
    { titolo: "Rinnovo AUA", ente: "SUAP", scadenza: "2026-08-10" },    // tra 20 gg → warn
    { titolo: "Lontana", ente: "—", scadenza: "2099-01-01" },           // >30 gg → esclusa
  ];
  const p = sentinella.prioritaConformita(mon, ade, new Date(2026, 6, 21));
  eq(p.length, 4, "2 misure non-ok + 2 adempimenti entro 30 gg");
  eq(p.filter(x => x.gravita === "danger").length, 2, "V2 superamento + ARPA scaduto");
  eq(p[0].gravita, "danger", "danger in cima");
  eq(p[p.length - 1].gravita, "warn", "warn in fondo");
  if (!p.some(x => x.categoria === "adempimento" && x.badge === "scaduto da 11 gg")) throw new Error("adempimento scaduto deve essere danger con i giorni");
  if (!p.some(x => x.categoria === "adempimento" && /entro 10\/08\/2026/.test(x.dettaglio))) throw new Error("data formattata GG/MM/AAAA");
});
test("prioritaConformita: tutto conforme e nessuna scadenza vicina = vuoto", () =>
  eq(sentinella.prioritaConformita([{ nome: "X", valore: 1, soglia: 10, unita: "u" }], [{ titolo: "Y", scadenza: "2099-01-01" }], new Date(2026, 6, 21)), [], "vuoto"));
test("parseAdempimentiCsv: legge titolo/ente/scadenza; ente vuoto → —; scarta data non ISO", () => {
  const csv = "titolo;ente;scadenza\nRelazione annuale AUA;ARPA;2026-08-10\nRinnovo AUA;;2026-09-30\nSenza data;SUAP;boh\n;ARPA;2026-10-01\n";
  const p = sentinella.parseAdempimentiCsv(csv);
  eq(p.length, 2, "2 righe valide (titolo + data ISO)");
  eq(p[0], { titolo: "Relazione annuale AUA", ente: "ARPA", scadenza: "2026-08-10" }, "riga completa");
  eq(p[1].ente, "—", "ente vuoto diventa —");
});
test("riepilogoVolate: totale, questo mese, kg del mese, contestazioni", () => {
  const vol = [
    { data: "2026-07-17", kgTotali: 480, esito: "regolare" },
    { data: "2026-07-03", kgTotali: 410, esito: "contestazione" },
    { data: "2026-06-20", kgTotali: 300, esito: "regolare" },
  ];
  const r = sentinella.riepilogoVolate(vol, new Date(2026, 6, 21));   // luglio 2026
  eq(r.totale, 3, "tre volate");
  eq(r.questoMese, 2, "due a luglio");
  eq(r.kgMese, 890, "480+410 kg nel mese");
  eq(r.ultima, "2026-07-17", "volata più recente");
  eq(r.contestazioni, 1, "una con contestazione");
});
test("riepilogoVolate: vuoto = tutto zero (niente crash)", () =>
  eq(sentinella.riepilogoVolate([], new Date(2026, 6, 21)), { totale: 0, questoMese: 0, kgMese: 0, ultima: null, contestazioni: 0 }, "vuoto"));
test("parseVolateCsv: legge le colonne, scarta data non ISO, esito default regolare", () => {
  const csv = "data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note\n2026-07-17;Fronte Nord;42;480;18;320;regolare;ok\n2026-07-03;Est;36;410;22;280;contestazione;\nboh;X;1;1;1;1;;\n";
  const p = sentinella.parseVolateCsv(csv);
  eq(p.length, 2, "solo le 2 righe con data ISO");
  eq(p[0], { data: "2026-07-17", fronte: "Fronte Nord", nFori: 42, kgTotali: 480, kgMaxRitardo: 18, distanzaRicettore: 320, esito: "regolare", note: "ok" }, "riga completa");
  eq(p[1].esito, "contestazione", "esito riconosciuto");
});

console.log("\n— Confini: giorni alla scadenza (Sentinella/Conti) —");
test("giorni: oggi stesso = 0", () => {
  eq(sentinella.giorni("2026-07-20", OGGI), 0, "sentinella 0");
  eq(conti.giorni("2026-07-20", OGGI), 0, "conti 0");
});
test("giorni: domani = 1, ieri = -1", () => {
  eq(sentinella.giorni("2026-07-21", OGGI), 1, "domani");
  eq(conti.giorni("2026-07-19", OGGI), -1, "ieri");
});

// ------------------------------------------------------------
// Input VUOTI: un'organizzazione appena creata non ha ancora dati.
// Ogni kpiFrom deve restituire zeri/null sensati SENZA andare in crash
// (divisioni per zero, riduzioni o accessi su array vuoto). Blindiamo
// la forma dell'output per un'azienda "al giorno zero".
// ------------------------------------------------------------
console.log("\n— Input vuoti: azienda al giorno zero —");
test("Scudo kpiFrom([],[]) = tutti zero", () =>
  eq(scudo.kpiFrom([], []), { scadute: 0, trenta: 0, regolari: 0 }, "scudo vuoto"));
test("Conti kpiFrom([],[]) = zero e età media credito 0 (niente divisione per zero)", () =>
  eq(conti.kpiFrom([], []), { daIncassare: 0, inScadenza: 0, gareAperte: 0, etaCredito: 0 }, "conti vuoto"));
test("Sentinella kpiFrom([],[]) = tutti zero", () =>
  eq(sentinella.kpiFrom([], []), { attivi: 0, superamenti: 0, adempimenti30: 0 }, "sentinella vuoto"));
test("Terra kpiFrom([],[],[]) = zero, avanzamento e riserve null", () =>
  contiene(terra.kpiFrom([], [], []),
    { volumiMese: 0, volumiMeseCumulo: 0, rilieviMese: 0, avanzamento: null, riserveM3: null, frontiAttivi: 0 }, "terra vuoto"));
test("Flotta kpiFrom([],[],[]) = tutti zero", () =>
  eq(flotta.kpiFrom([], [], []),
    { operativi: 0, inManutenzione: 0, tagliandi30: 0, carburante: 0 }, "flotta vuoto"));
test("Campo kpiFrom([],[],[]) = tutti zero", () =>
  eq(campo.kpiFrom([], [], []),
    { squadreAttive: 0, inCorso: 0, rapportiniOggi: 0, anomalie: 0 }, "campo vuoto"));

// ------------------------------------------------------------
// Integrità dei DATI DEMO: è ciò che vede chi prova l'app senza account
// (il "tour", vetrina commerciale). Se una modifica ai dati di esempio
// sbaglia un nome di campo o un tipo, un KPI diventerebbe NaN/undefined.
// Qui pretendiamo che ogni kpiFrom, sui PROPRI dati demo, produca solo
// numeri finiti (o null dove è previsto), senza andare in crash.
// ------------------------------------------------------------
console.log("\n— Integrità dei dati demo (tour) —");
const finitoOnull = (v) => v === null || (typeof v === "number" && Number.isFinite(v));
const kpiTuttoFinito = (obj, why) => {
  for (const [k, v] of Object.entries(obj))
    if (!finitoOnull(v)) throw new Error(`${why}: KPI "${k}" non è un numero finito (${JSON.stringify(v)})`);
};
test("Scudo: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = scudo.DEMO; kpiTuttoFinito(scudo.kpiFrom(d.lavoratori, d.scadenze), "scudo demo");
});
test("Campo: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = campo.DEMO; kpiTuttoFinito(campo.kpiFrom(d.attivita, d.squadre, d.rapportini), "campo demo");
});
test("Flotta: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = flotta.DEMO; kpiTuttoFinito(flotta.kpiFrom(d.mezzi, d.manutenzioni, d.costi), "flotta demo");
});
test("Conti: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = conti.DEMO; kpiTuttoFinito(conti.kpiFrom(d.fatture, d.gare), "conti demo");
});
test("Sentinella: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = sentinella.DEMO; kpiTuttoFinito(sentinella.kpiFrom(d.monitoraggi, d.adempimenti), "sentinella demo");
});
test("Terra: kpiFrom sui dati demo dà numeri finiti", () => {
  const d = terra.DEMO; kpiTuttoFinito(terra.kpiFrom(d.fronti, d.rilievi, d.piano), "terra demo");
});

// ------------------------------------------------------------
// Parsing del piano di carico CSV (Campo): funzione pura estratta per
// poterla blindare. Salta l'header, coerce foro/prog a numero, scarta
// le righe non valide, e NON altera i campi liberi (che restano testo
// grezzo: è il rendering a doverli escapare — vedi AUDIT punto 13).
// ------------------------------------------------------------
console.log("\n— Campo: parsing del piano di carico CSV —");
test("parsePianoCsv salta l'header e legge le righe valide", () => {
  const out = campo.parsePianoCsv("foro;x;fila;prof;prog;borr;rit\n1;3.5;A;12;100;2;20\n2;4;B;12;80;2;18");
  eq(out.length, 2, "righe");
  eq(out[0], { foro: 1, x: "3.5", fila: "A", prof: "12", prog: 100, borr: "2", rit: "20", reale: null }, "prima riga");
});
test("parsePianoCsv scarta righe con foro o prog non validi", () => {
  const out = campo.parsePianoCsv("0;x;A;12;100;2;20\n3;x;A;12;0;2;20\n5;x;A;12;90;2;20");
  eq(out.map(p => p.foro), [5], "solo la riga valida");
});
test("parsePianoCsv su testo vuoto = nessuna riga (niente crash)", () =>
  eq(campo.parsePianoCsv(""), [], "vuoto"));
test("parsePianoCsv: gestisce CRLF (export Excel)", () => {
  const out = campo.parsePianoCsv("foro;x;fila;prof;prog;borr;rit\r\n1;3.5;A;12;100;2;20\r\n2;4;B;12;80;2;18\r\n");
  eq(out.length, 2, "due fori");
  eq(out[0].foro, 1, "foro 1");
  eq(out[1].prog, 80, "prog del secondo foro");
});
test("parsePianoCsv conserva testo/HTML nei campi liberi (l'escape è a valle)", () => {
  const out = campo.parsePianoCsv("1;<img src=x onerror=alert(1)>;A;12;100;2;20");
  eq(out[0].x, "<img src=x onerror=alert(1)>", "campo libero non alterato dal parser");
});

console.log("\n— Campo: scostamento progettato-vs-reale (ponte Genesi) —");
test("scartoLivello classifica ai confini (10% ok, 25% warn, oltre danger)", () => {
  eq(campo.scartoLivello(110, 100), "ok", "esatto 10% = ok");       // 0.10
  eq(campo.scartoLivello(90, 100), "ok", "in difetto 10% = ok");
  eq(campo.scartoLivello(125, 100), "warn", "esatto 25% = warn");   // 0.25
  eq(campo.scartoLivello(126, 100), "danger", "oltre 25% = danger");// 0.26
});
test("scartoLivello: foro non ancora registrato = da-registrare (niente crash)", () => {
  eq(campo.scartoLivello(null, 100), "da-registrare", "reale null");
  eq(campo.scartoPct(null, 100), null, "scartoPct null se non registrato");
});
test("scartoPct: prog 0 non manda in crash (divisione protetta)", () =>
  eq(Number.isFinite(campo.scartoPct(50, 0)), true, "prog 0 → numero finito"));
test("pianoRiepilogo: stimato = reale dei registrati + progetto dei non registrati", () => {
  const piano = [
    { foro: 1, prog: 100, reale: 130 },  // registrato sopra progetto
    { foro: 2, prog: 100, reale: null },  // da registrare → conta 100 (progetto)
  ];
  const r = campo.pianoRiepilogo(piano);
  eq(r.registrati, 1, "1 registrato");
  eq(r.totale, 2, "2 fori");
  eq(r.progettatoKg, 200, "progettato 200");
  eq(r.stimatoKg, 230, "stimato 130 + 100");
  eq(r.pct, 15, "+15% (30/200)");
  eq(r.livello, "warn", "15% = warn");
});
test("pianoRiepilogo: piano vuoto = null (niente crash/divisione per zero)", () =>
  eq(campo.pianoRiepilogo([]), null, "vuoto"));
test("riepilogoFermi: conta le anomalie per causale, ordinate per frequenza", () => {
  const att = [
    { stato: "anomalia", causale: "Guasto meccanico" },
    { stato: "anomalia", causale: "Guasto meccanico" },
    { stato: "anomalia", causale: "Meteo" },
    { stato: "in-corso", causale: "Guasto meccanico" },  // non anomalia → esclusa
    { stato: "anomalia", causale: "causale-inventata" },  // sconosciuta → Altro
    { stato: "anomalia" },                                // senza causale → Altro
  ];
  eq(campo.riepilogoFermi(att), [
    { causale: "Altro", conto: 2 },            // a parità, ordine alfabetico
    { causale: "Guasto meccanico", conto: 2 },
    { causale: "Meteo", conto: 1 },
  ], "conteggio e ordine per frequenza");
});
test("riepilogoFermi: nessuna anomalia = lista vuota (niente crash)", () =>
  eq(campo.riepilogoFermi([{ stato: "in-corso" }]), [], "nessun fermo"));
test("paretoFermi: somma i minuti per causale e ordina per tempo perso", () => {
  const att = [
    { stato: "anomalia", causale: "Meteo", fermoMin: 30 },
    { stato: "anomalia", causale: "Guasto meccanico", fermoMin: 45 },
    { stato: "anomalia", causale: "Guasto meccanico", fermoMin: 15 },
    { stato: "in-corso", causale: "Meteo", fermoMin: 999 },   // non anomalia → esclusa
    { stato: "anomalia", causale: "sconosciuta" },            // senza minuti → 0, in Altro
  ];
  const pf = campo.paretoFermi(att);
  eq(pf.totaleMin, 90, "totale minuti");
  eq(pf.voci[0], { causale: "Guasto meccanico", conto: 2, minuti: 60 }, "prima la causale col tempo maggiore");
  eq(pf.voci[1], { causale: "Meteo", conto: 1, minuti: 30 }, "poi meteo");
  eq(pf.voci[2], { causale: "Altro", conto: 1, minuti: 0 }, "sconosciuta in Altro con 0 min");
});
test("paretoFermi: minuti non numerici o negativi contano 0 (mai NaN)", () => {
  const pf = campo.paretoFermi([
    { stato: "anomalia", causale: "Meteo", fermoMin: "abc" },
    { stato: "anomalia", causale: "Meteo", fermoMin: -20 },
  ]);
  eq(pf.totaleMin, 0, "totale 0");
  eq(pf.voci[0].conto, 2, "conteggio corretto");
});
test("paretoFermi: nessuna anomalia = struttura vuota", () =>
  eq(campo.paretoFermi([]), { voci: [], totaleMin: 0 }, "vuoto"));
test("CAUSALI_FERMO: lista non vuota, tutte stringhe uniche", () => {
  const c = campo.CAUSALI_FERMO;
  eq(c.length > 0, true, "non vuota");
  eq(c.length, new Set(c).size, "uniche");
});
test("avanzamentoGiornata: concluse sul totale + ripartizione per stato", () => {
  const att = [
    { stato: "conclusa" }, { stato: "conclusa" }, { stato: "conclusa" },
    { stato: "in-corso" }, { stato: "pianificata" }, { stato: "anomalia" },
  ];
  eq(campo.avanzamentoGiornata(att),
     { totale: 6, concluse: 3, inCorso: 1, pianificate: 1, anomalie: 1, pct: 50 }, "3/6 = 50%");
});
test("avanzamentoGiornata: nessuna attività = tutto zero, pct 0 (niente crash)", () =>
  eq(campo.avanzamentoGiornata([]), { totale: 0, concluse: 0, inCorso: 0, pianificate: 0, anomalie: 0, pct: 0 }, "vuoto"));
test("riassuntoRapportino: compone turno/squadra/produzione/consegne", () => {
  eq(campo.riassuntoRapportino({ turno: "Mattina", squadra: "Squadra A", produzione: "90 t", note: "cambiare benna" }),
     "Turno Mattina · Squadra A · Produzione: 90 t · Consegne: cambiare benna", "completo");
  eq(campo.riassuntoRapportino({ squadra: "Squadra B" }), "Squadra B", "solo squadra");
  eq(campo.riassuntoRapportino({}), "", "niente → vuoto");
});
test("coperturaRapportini: quali squadre hanno consegnato il rapportino, chi manca", () => {
  const squadre = [
    { nome: "Squadra A — Perforazione", stato: "operativa" },
    { nome: "Squadra B — Carico", stato: "operativa" },
    { nome: "Squadra C — Impianto", stato: "ferma" },
  ];
  const rapportini = [
    { squadra: "Squadra A", stato: "inviato" },
    { squadra: "Squadra C", stato: "bozza" },      // bozza → non conta
    { squadra: "Squadra B", stato: "inviato" },
  ];
  const c = campo.coperturaRapportini(squadre, rapportini);
  eq(c.coperte, 2, "A e B hanno consegnato");
  eq(c.totale, 3, "3 squadre");
  eq(c.pct, 67, "2/3 = 67%");
  eq(c.mancanti, ["Squadra C — Impianto"], "manca la C (solo bozza)");
});
test("coperturaRapportini: nessuna squadra = pct null (niente crash)", () =>
  eq(campo.coperturaRapportini([], []), { coperte: 0, totale: 0, pct: null, mancanti: [] }, "vuoto"));
test("parseSquadreCsv: legge nome/persone/area/stato; persone intere; stato ignoto → operativa", () => {
  const csv = "nome;persone;area;stato\nSquadra A — Perforazione;4;fronte Est;operativa\nSquadra C — Impianto;2;frantoio;ferma\nSquadra X;3;;boh\n;piazzale;2;operativa\n";
  const p = campo.parseSquadreCsv(csv);
  eq(p.length, 3, "3 squadre valide (riga senza nome scartata)");
  eq(p[0], { nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" }, "riga completa");
  eq(p[1].stato, "ferma", "stato valido mantenuto");
  eq(p[2].stato, "operativa", "stato ignoto → operativa");
});

console.log("\n— Import CSV robusto: numeri all'italiana e ';' nei campi —");
test("numIt: formati italiano/inglese/misti", () => {
  eq(shell.numIt("18.300,50"), 18300.5, "punto migliaia + virgola decimali");
  eq(shell.numIt("18,300.50"), 18300.5, "formato inglese");
  eq(shell.numIt("1234,5"), 1234.5, "solo virgola = decimale");
  eq(shell.numIt("1234.5"), 1234.5, "solo punto = decimale");
  eq(shell.numIt("1234"), 1234, "intero");
  eq(shell.numIt("19.4"), 19.4, "punto isolato resta decimale");
  eq(Number.isNaN(shell.numIt("")), true, "vuoto = NaN");
  eq(Number.isNaN(shell.numIt("abc")), true, "non numero = NaN");
});
test("parseFattureCsv: cliente con ';' tra virgolette NON perde la fattura (round-trip)", () => {
  const csv = 'numero;cliente;importo;emessa;scadenza;incassata\n'
    + '2026/031;"Rossi; & Figli";18.300,50;2026-06-07;2026-07-08;si\n';
  const f = conti.parseFattureCsv(csv);
  eq(f.length, 1, "fattura non persa");
  eq(f[0].cliente, "Rossi; & Figli", "cliente intero (virgolette + ; interno)");
  eq(f[0].importo, 18300.5, "importo 18.300,50 letto");
  eq(f[0].incassata, true, "incassata si");
});
test("parseMonitoraggiCsv: nome con ';' tra virgolette NON perde il sensore", () => {
  const csv = 'nome;tipo;valore;soglia;unita;nota\n'
    + '"Vibrazioni V2; Nord";vibrazioni;5,6;5;mm/s;volata\n';
  const m = sentinella.parseMonitoraggiCsv(csv);
  eq(m.length, 1, "sensore non perso");
  eq(m[0].nome, "Vibrazioni V2; Nord", "nome intero");
  eq(m[0].valore, 5.6, "valore 5,6 letto");
});
test("parseRilieviCsv: metodo con ';' tra virgolette NON sposta il gsd", () => {
  const csv = 'data;volumeM3;metodo;gsd\n'
    + '2026-07-15;19.400,5;"RTK; con GCP";2\n';
  const p = terra.parseRilieviCsv(csv);
  eq(p.length, 1, "rilievo letto");
  eq(p[0].metodo, "RTK; con GCP", "metodo intero");
  eq(p[0].gsd, "2", "gsd corretto (non spostato)");
  eq(p[0].volumeM3, 19400.5, "volume 19.400,5 letto");
});

console.log("\n— Conteggio giorni robusto all'ora del giorno (fix off-by-one) —");
test("giorniTra + Scudo: una scadenza di OGGI non è 'scaduta' nel pomeriggio", () => {
  const pom = new Date("2026-07-20T15:00:00");
  eq(shell.giorniTra("2026-07-20", pom), 0, "oggi = 0 giorni");
  eq(shell.giorniTra("2026-07-25", pom), 5, "tra 5 giorni (non 4)");
  eq(scudo.statoScadenza("2026-07-20", pom), "in-scadenza", "oggi non è scaduta");
  eq(scudo.livelloScadenza("2026-07-20", pom), { cls: "danger", label: "scade oggi", giorni: 0 }, "scade oggi");
});
test("giorniTra: segno futuro/passato — invariante delle guardie data-futura (Scudo/Sentinella)", () => {
  // le guardie rifiutano un evento se giorniTra(data) > 0 (nel futuro): blindiamo il segno
  const oggi = new Date("2026-07-20T09:00:00");
  eq(shell.giorniTra("2026-07-21", oggi) > 0, true, "domani è futuro → rifiutato");
  eq(shell.giorniTra("2026-08-19", oggi) > 0, true, "+30gg è futuro → rifiutato");
  eq(shell.giorniTra("2026-07-20", oggi) > 0, false, "oggi NON è futuro → accettato");
  eq(shell.giorniTra("2026-07-19", oggi) > 0, false, "ieri NON è futuro → accettato");
  eq(shell.giorniTra("2026-07-19", oggi) < 0, true, "ieri è passato (segno negativo)");
});
test("conti/sentinella/flotta: nessun off-by-one con l'ora del giorno", () => {
  const pom = new Date("2026-07-20T18:30:00");
  eq(conti.giorni("2026-07-22", pom), 2, "conti: 2 giorni");
  eq(sentinella.giorni("2026-07-20", pom), 0, "sentinella: oggi = 0");
  eq(flotta.urgenza("2026-07-20", pom), { cls: "warn", label: "0 gg", giorni: 0 }, "flotta: 0 gg, non scaduta");
});
test("terra.kpiFrom: mese/anno LOCALI, coerenti con le date dei rilievi", () => {
  const oggi = new Date(2026, 6, 1, 0, 30);   // 1° luglio 2026, 00:30 ORA LOCALE
  const k = terra.kpiFrom([], [{ data: "2026-07-01", volumeM3: 1000, stato: "elaborato" }], [], oggi);
  eq(k.volumiMese, 1000, "il rilievo del 1° luglio conta nel mese corrente");
});

console.log("\n— Confini e casi limite (helper di questa sessione) —");
test("proiezioneAnnua: soglie di stato ok (<90%) / warn (90-100%) a metà anno", () => {
  const meta = new Date(2026, 6, 2);   // ~50% dell'anno trascorso
  const ok = terra.proiezioneAnnua([{ data: "2026-04-01", volumeM3: 20000, stato: "elaborato" }], 100000, meta);
  eq(ok.stato, "ok", "proiezione ~40% → ok");
  const warn = terra.proiezioneAnnua([{ data: "2026-04-01", volumeM3: 47500, stato: "elaborato" }], 100000, meta);
  eq(warn.stato, "warn", "proiezione ~95% → warn");
  if (!(warn.pctPiano >= 90 && warn.pctPiano < 100)) throw new Error("pctPiano warn deve stare in [90,100): " + warn.pctPiano);
});
test("prioritaOperative: manutenzione a ore su un mezzo assente viene ignorata (non crasha)", () => {
  const p = flotta.prioritaOperative(
    [{ nome: "Escavatore E1 — CAT 352", ore: 100, stato: "operativo" }],
    [{ titolo: "Tagliando", mezzo: "Mezzo Fantasma", orePreviste: 50 }],   // mezzo non nel parco
    []);
  eq(p, [], "nessuna voce: il mezzo della manutenzione a ore non esiste");
});
test("coperturaRapportini: un rapportino di una squadra sconosciuta non falsa il conteggio", () => {
  const c = campo.coperturaRapportini(
    [{ nome: "Squadra A — Perforazione" }],
    [{ squadra: "Squadra Z", stato: "inviato" }, { squadra: "Squadra A", stato: "inviato" }]);
  eq(c.coperte, 1, "solo A conta");
  eq(c.totale, 1, "una squadra");
  eq(c.mancanti, [], "A ha consegnato");
});
test("estrattoContoCliente: cliente con sole fatture NON scadute = documento senza mora", () => {
  const t = conti.estrattoContoCliente("Futura Srl",
    [{ numero: "2026/050", cliente: "Futura Srl", importo: 5000, scadenza: "2026-09-30", incassata: false }],
    new Date(2026, 6, 21));
  if (t == null) throw new Error("deve restituire il documento anche senza scaduti");
  if (!t.includes("Totale aperto: € 5.000")) throw new Error("manca il totale aperto");
  if (!t.includes("non ancora scaduta")) throw new Error("la fattura futura va marcata come non scaduta");
  if (t.includes("Interessi di mora")) throw new Error("senza scaduti non deve comparire la riga mora");
});
test("prioritaConformita: misura esattamente al 90% della soglia = attenzione (warn)", () => {
  const p = sentinella.prioritaConformita([{ nome: "M", valore: 9, soglia: 10, unita: "u" }], [], new Date(2026, 6, 21));
  eq(p.length, 1, "una misura in attenzione");
  eq(p[0].gravita, "warn", "ratio 0.90 → attenzione");
});


// ============================================================
// LE FUNZIONI NUOVE DEL 29/07, BLINDATE
// Queste asserzioni nascono dalle verifiche fatte a mano mentre si
// controllavano i sei cantieri della giornata. Erano prove usa-e-getta:
// qui diventano permanenti, perché sono esattamente i punti in cui una
// regressione costerebbe di più — soldi incassati, turni firmati, chi può
// andare a fare un lavoro, volumi denunciati agli enti.
// ============================================================

console.log("\n— Conti: incassi parziali e data di incasso vera —");
test("acconto + saldo tornano al centesimo e azzerano il residuo", () => {
  const f = { id: "f1", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25" };
  const inc = [{ fatturaId: "f1", importo: 3000.50, data: "2026-07-20" },
               { fatturaId: "f1", importo: 6749.50, data: "2026-07-28" }];
  const s = conti.statoIncasso(f, inc);
  ok(Math.abs(s.incassato - 9750) < 0.005, `incassato ${s.incassato} invece di 9750`);
  ok(Math.abs(s.residuo) < 0.005, `residuo ${s.residuo} invece di 0`);
  ok(s.saldata === true, "con tutto incassato deve risultare saldata");
});
test("col solo acconto la fattura resta parziale, non incassata", () => {
  const f = { id: "f1", importo: 9750, emessa: "2026-06-25" };
  const s = conti.statoIncasso(f, [{ fatturaId: "f1", importo: 3000.50, data: "2026-07-20" }]);
  ok(s.saldata === false, "un acconto non salda la fattura");
  ok(s.parziale === true, "deve risultare parziale");
  ok(Math.abs(s.residuo - 6749.50) < 0.005, `residuo ${s.residuo} invece di 6749,50`);
});
test("l'aperto scende del SOLO acconto, non dell'intera fattura", () => {
  const f = { id: "f1", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25" };
  const a = conti.applicaIncassi([f], [{ fatturaId: "f1", importo: 3000.50, data: "2026-07-20" }]);
  ok(Math.abs(conti.apertoDi(a[0]) - 6749.50) < 0.005, `aperto ${conti.apertoDi(a[0])} invece di 6749,50`);
});
// COMPATIBILITÀ: è il punto che romperebbe i conti di chi usa già l'app
test("una fattura vecchia incassata SENZA data resta incassata", () => {
  const vecchia = { id: "f0", importo: 5000, emessa: "2026-05-12", incassata: true };
  const a = conti.applicaIncassi([vecchia], undefined);
  ok(a[0].incassata === true, "senza movimenti vale la marcatura di prima");
  ok(a[0].senzaDataIncasso === true, "e deve dichiarare che la data non è registrata");
});
test("collezione incassi assente: nessun totale si muove da solo", () => {
  const f = { id: "f1", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25" };
  const v = { id: "f0", importo: 5000, emessa: "2026-05-12", incassata: true };
  const k = conti.kpiFrom(conti.applicaIncassi([v, f], undefined), []);
  ok(Math.abs(k.daIncassare - 9750) < 0.005, `da incassare ${k.daIncassare}: la vecchia incassata non deve rientrare`);
});
test("giorni reali di pagamento fra emissione e saldo", () =>
  ok(conti.giorniFraDate("2026-06-25", "2026-07-28") === 33,
     `${conti.giorniFraDate("2026-06-25", "2026-07-28")} invece di 33`));

console.log("\n— Flotta: ordine di lavoro e fermi macchina —");
test("il costo dell'ordine è la somma esatta di manodopera, ricambi e spese", () => {
  const c = flotta.costoOrdine({
    manodopera: [{ chi: "Marco", ore: 4, tariffa: 32 }, { chi: "Luca", ore: 2.5, tariffa: 40 }],
    ricambi: [{ nome: "Filtro", qta: 2, prezzo: 31.5 }, { nome: "Olio", qta: 1, prezzo: 48 }],
    altreSpese: 50 });
  ok(Math.abs(c.manodopera.costo - 228) < 0.005, `manodopera ${c.manodopera.costo} invece di 228`);
  ok(Math.abs(c.manodopera.ore - 6.5) < 0.005, `ore ${c.manodopera.ore} invece di 6,5`);
  ok(Math.abs(c.ricambi.costo - 111) < 0.005, `ricambi ${c.ricambi.costo} invece di 111`);
  ok(Math.abs(c.totale - 389) < 0.005, `totale ${c.totale} invece di 389`);
});
test("un ricambio senza prezzo NON passa per gratis: viene contato a parte", () => {
  const c = flotta.costoOrdine({ ricambi: [{ nome: "X", qta: 2 }] });
  ok(c.ricambi.senzaPrezzo > 0, "va dichiarato quante righe non hanno prezzo");
});
test("ordine vuoto o sporco: zero, mai NaN", () => {
  ok(flotta.costoOrdine({}).totale === 0, "ordine vuoto = 0");
  const s = flotta.costoOrdine({ manodopera: [{ chi: "X", ore: "due", tariffa: 30 }], ricambi: [{ qta: -3, prezzo: 10 }] });
  ok(Number.isFinite(s.totale), `totale non finito: ${s.totale}`);
});
test("una manutenzione vecchia senza stato risulta «da fare»", () =>
  ok(flotta.statoOrdine({}).chiave === "da-fare", `stato ${flotta.statoOrdine({}).chiave}`));
test("disponibilità: 3 giorni persi su 60 giorni-macchina = 95%", () => {
  const mezzi = [{ id: "m1", nome: "Escavatore E1 — CAT 352" }, { id: "m2", nome: "Dumper D1 — Volvo" }];
  const oggi = new Date("2026-07-29T12:00:00Z");
  ok(flotta.affidabilitaFlotta([], mezzi, 30, oggi).pct === 100, "senza fermi = 100%");
  const t = flotta.affidabilitaFlotta([{ mezzo: "Escavatore E1", inizio: "2026-07-20", fine: "2026-07-22" }], mezzi, 30, oggi);
  ok(Math.abs(t.pct - 95) < 0.05, `${t.pct}% con ${t.persi} persi su ${t.giorniMacchina}`);
});
test("un fermo di un mezzo non in parco non falsa la disponibilità", () => {
  const mezzi = [{ id: "m1", nome: "Escavatore E1 — CAT 352" }, { id: "m2", nome: "Dumper D1 — Volvo" }];
  const f = flotta.affidabilitaFlotta([{ mezzo: "Mezzo inesistente", inizio: "2026-07-20", fine: "2026-07-22" }],
                                      mezzi, 30, new Date("2026-07-29T12:00:00Z"));
  ok(f.pct === 100 && f.fuoriParco === 1, `pct ${f.pct}, fuoriParco ${f.fuoriParco}: va escluso E dichiarato`);
});

console.log("\n— Campo: il turno firmato non è più riscrivibile —");
test("un turno firmato risulta chiuso, e torna la chiusura per poter dire chi ha firmato", () => {
  const c = [{ data: "2026-07-29", turno: "mattina", da: "Rossi", a: "Bianchi", ora: "14:20" }];
  const t = campo.turnoChiuso(c, "2026-07-29", "mattina");
  ok(!!t, "il turno firmato deve risultare chiuso");
  ok(t.ora === "14:20", "deve tornare la chiusura, non solo un sì");
});
test("una consegna SENZA ora non chiude niente", () =>
  ok(!campo.turnoChiuso([{ data: "2026-07-29", turno: "mattina", da: "Rossi" }], "2026-07-29", "mattina"),
     "senza l'ora la consegna non è firmata e non deve bloccare"));
test("il blocco vale solo per quel giorno e quel turno", () => {
  const c = [{ data: "2026-07-29", turno: "mattina", ora: "14:20" }];
  ok(!campo.turnoChiuso(c, "2026-07-29", "pomeriggio"), "l'altro turno resta aperto");
  ok(!campo.turnoChiuso(c, "2026-07-28", "mattina"), "l'altro giorno resta aperto");
});
test("le registrazioni vecchie senza data né turno restano modificabili", () =>
  ok(!campo.turnoChiuso([{ data: "2026-07-29", turno: "mattina", ora: "14:20" }], null, null),
     "chi non appartiene a un turno non può essere bloccato da una firma"));
test("le riaperture non si perdono e si leggono", () => {
  ok(campo.riaperture({ riaperture: [{ da: "Verdi", ora: "15:10" }] }).length === 1, "una riapertura registrata si vede");
  ok(campo.riaperture({}).length === 0, "senza riaperture la lista è vuota, non un errore");
});

console.log("\n— Scudo: chi può andare a fare quel lavoro —");
const _mansFoch = () => {
  const p = scudo.mansionePreset("fochino") || {};
  return { id: "M1", nome: "Fochino", requisiti: p.requisiti || [], dpi: p.dpi || [], lavoratoriIds: ["L1"] };
};
test("senza i corsi non può andare, e la scheda dice QUALI mancano", () => {
  const a = scudo.abilitazioneLavoratore({ id: "L1", nome: "Mario", attivo: true }, _mansFoch(), [], [],
                                         new Date("2026-07-29T12:00:00Z"));
  ok(a.esito === "no", `esito ${a.esito}`);
  ok(a.bloccanti.some(b => /^manca /.test(b)), `i motivi devono nominare il corso: ${a.bloccanti.join(" | ")}`);
});
test("un corso SCADUTO blocca, e lo dice con la data", () => {
  const m = _mansFoch(), oggi = new Date("2026-07-29T12:00:00Z");
  const sc = m.requisiti.map((ch, i) => ({ id: "x" + i, lavoratoreId: "L1", preset: ch, dataScadenza: "2026-03-10" }));
  const a = scudo.abilitazioneLavoratore({ id: "L1", attivo: true }, m, sc, [], oggi);
  ok(a.esito === "no", `esito ${a.esito}`);
  ok(a.bloccanti.some(b => /scaduta il/.test(b)), `manca la data nel motivo: ${a.bloccanti[0]}`);
});
// La distinzione che rende utile la matrice: il corso BLOCCA, il DPI AVVISA
test("un DPI mai consegnato avvisa, non blocca", () => {
  const m = _mansFoch(), oggi = new Date("2026-07-29T12:00:00Z");
  if (!m.dpi.length) return;                        // se il preset non richiede DPI il caso non esiste
  const sc = m.requisiti.map((ch, i) => ({ id: "s" + i, lavoratoreId: "L1", preset: ch, dataScadenza: "2027-06-30" }));
  const a = scudo.abilitazioneLavoratore({ id: "L1", attivo: true }, m, sc, [], oggi);
  ok(a.esito === "attenzione", `esito ${a.esito}: col corso valido il DPI mancante è un avviso, non un blocco`);
});
test("chi non è in forza non può andare comunque", () => {
  const m = _mansFoch(), oggi = new Date("2026-07-29T12:00:00Z");
  const sc = m.requisiti.map((ch, i) => ({ id: "s" + i, lavoratoreId: "L1", preset: ch, dataScadenza: "2027-06-30" }));
  const a = scudo.abilitazioneLavoratore({ id: "L1", attivo: false }, m, sc, [], oggi);
  ok(a.esito === "no" && a.bloccanti.some(b => /in forza/.test(b)), `${a.esito}: ${a.bloccanti.join(" | ")}`);
});
test("collezioni di formazione e DPI assenti: nessun crash e nessun NaN", () => {
  const r = scudo.riepilogoMansioni([_mansFoch()], [{ id: "L1", attivo: true }], undefined, undefined,
                                    new Date("2026-07-29T12:00:00Z"));
  ok(JSON.stringify(r).indexOf("NaN") < 0, "un NaN in una tessera è un numero sbagliato mostrato all'utente");
});


console.log("\n— I ponti fra le app (Blocco 4) —");
// Campo → Genesi: il consuntivo che chiude il cerchio della calibrazione.
// Il cantiere lo aveva lasciato senza test perché credeva che Campo non
// avesse una suite: ce l'ha, ed è questa.
test("il consuntivo tiene la carica reale GREZZA, non arrotondata", () => {
  const D = "2026-07-29", T = "Pomeriggio";
  const csv = campo.pianoConsuntivoCsv([{ data: D, turno: T, foro: 2, prog: 58, reale: 71.25 }]);
  ok(/;71\.25;/.test(csv), `la misura va persa: ${csv.split("\n")[1]}`);
});
test("lo scarto in chili porta il SEGNO: senza verso non calibra niente", () => {
  const csv = campo.pianoConsuntivoCsv([{ data: "2026-07-29", turno: "M", foro: 1, prog: 58, reale: 44.7 }]);
  ok(/;-13\.3;/.test(csv), `manca il segno: ${csv.split("\n")[1]}`);
});
test("un foro non registrato lascia le celle vuote, non uno zero", () => {
  const csv = campo.pianoConsuntivoCsv([{ data: "2026-07-29", turno: "M", foro: 6, prog: 58 }]);
  ok(/;6;58;;;;/.test(csv), `uno zero qui vorrebbe dire «caricato con nulla»: ${csv.split("\n")[1]}`);
});
test("un nome con punto e virgola non spezza la riga del CSV", () =>
  ok(campo.pianoConsuntivoCsv([{ data: "2026-07-29", turno: "M", foro: 1, prog: 58, reale: 50, da: "Rossi;Mario" }])
       .trim().split("\n").length === 2, "il nome quotato deve restare in una riga sola"));
test("il parziale confronta i soli fori già caricati", () => {
  const D = "2026-07-29", T = "P";
  const piano = [44.7, 71.25, 58, 66.9, 33.4].map((r, i) => ({ data: D, turno: T, foro: i + 1, prog: 58, reale: r }))
    .concat([{ data: D, turno: T, foro: 6, prog: 58 }]);
  const p = campo.pianoParziale(piano);
  ok(p.registrati === 5 && p.totale === 6, `${p.registrati}/${p.totale} invece di 5/6`);
  ok(Math.abs(p.realeKg - 274.25) < 0.005, `reali ${p.realeKg} invece di 274,25`);
  ok(p.progettatoKg === 290, `progetto ${p.progettatoKg}: va contato sui soli fori caricati, non su tutti`);
});
test("senza fori caricati il parziale è null, non zeri finti", () => {
  ok(campo.pianoParziale([{ foro: 1, prog: 58 }]) === null, "nessuna misura non è «scostamento zero»");
  ok(campo.pianoParziale([]) === null && campo.pianoParziale(undefined) === null, "vuoto e assente = null");
});

// Sentinella → Scudo: l'azione correttiva che nasce dal superamento.
test("l'azione si ritrova dalla sua origine, e non pesca origini di altro tipo", () => {
  const az = [{ id: "a1", origineTipo: "superamento", origineId: "m1", origineVoce: "2026-07-29", stato: "aperta" },
              { id: "a2", origineTipo: "ispezione", origineId: "i9", origineVoce: "x", stato: "aperta" }];
  ok(sentinella.azioniDiOrigine(az, "superamento", "m1", "2026-07-29").length === 1, "deve trovarne una");
  ok(sentinella.azioniDiOrigine(az, "superamento", "i9", "x").length === 0, "non deve pescare l'ispezione");
  ok(sentinella.azioniDiOrigine(undefined, "superamento", "m1", "2026-07-29").length === 0, "senza azioni: lista vuota");
});
test("lo stato del ponte distingue «nessuna azione» da «da chiudere»", () => {
  const az = [{ origineTipo: "superamento", origineId: "m1", origineVoce: "2026-07-29", stato: "aperta" }];
  ok(sentinella.statoPonte([], "superamento", "m1", "2026-07-29").n === 0, "senza azioni n = 0");
  ok(sentinella.statoPonte(az, "superamento", "m1", "2026-07-29").daChiudere === 1, "con un'azione aperta: 1 da chiudere");
});
// Il testo NON deve suggerire un nesso causale che nessuno ha dimostrato
test("l'avviso sulla volata nega esplicitamente il rapporto di causa", () =>
  ok(/non .*(caus|dimostrat)/i.test(String(sentinella.AVVISO_COINCIDENZA || "")),
     `un documento che va all'ente non può insinuare: «${sentinella.AVVISO_COINCIDENZA}»`));
test("la scadenza proposta scavalca mese e anno, e non produce NaN", () => {
  ok(sentinella.dataPiuGiorni(30, new Date(2026, 6, 29)) === "2026-08-28", "30 giorni da 29/07");
  ok(sentinella.dataPiuGiorni(1, new Date(2026, 11, 31)) === "2027-01-01", "capodanno");
  ok(sentinella.dataPiuGiorni("boh", new Date(2026, 6, 29)) === "", "ingresso non numerico = vuoto, non NaN");
});
test("Scudo riconosce l'origine ambientale e non la confonde con un'ispezione", () => {
  ok(scudo.daAmbiente({ origineTipo: "superamento" }) === true, "un superamento è ambientale");
  ok(scudo.daAmbiente({ origineTipo: "ispezione" }) === false, "un'ispezione no");
  ok(scudo.daAmbiente({}) === false, "senza origine no");
  ok(JSON.stringify(scudo.riepilogoAmbiente([])).indexOf("NaN") < 0, "archivio vuoto senza NaN");
});

console.log("\n— Ponte Sentinella → Genesi: i referti per la legge di sito —");
// Il vincolo che conta più di tutti: la legge di sito decide le distanze di
// sicurezza, quindi una PPV inventata farebbe più danno di qualunque altro
// numero finto in tutta la piattaforma. Questi test esistono per quello.
test("una volata senza PPV misurata NON diventa un referto", () => {
  const r = sentinella.refertoDaVolata({ id: "v2", data: "2026-07-07", distanzaRicettore: 150, kgMaxRitardo: 25 });
  ok(r.pronto === false, "senza misura non può essere pronto");
  ok(r.motivi.includes("ppv"), `e il motivo va detto: ${JSON.stringify(r.motivi)}`);
});
test("PPV a zero, negativa, testuale o vuota vengono tutte rifiutate", () => {
  for (const brutta of [0, -1, "boh", "", null, undefined]) {
    const r = sentinella.refertoDaVolata({ id: "x", data: "2026-07-07", distanzaRicettore: 150, kgMaxRitardo: 25, ppvMisurata: brutta });
    ok(r.pronto === false, `PPV ${JSON.stringify(brutta)} accettata: falserebbe la legge di sito`);
  }
});
test("mancano distanza o carica per ritardo: niente referto, col motivo", () => {
  ok(sentinella.refertoDaVolata({ id: "a", data: "2026-07-08", kgMaxRitardo: 25, ppvMisurata: 4 }).pronto === false, "senza distanza");
  ok(sentinella.refertoDaVolata({ id: "b", data: "2026-07-08", distanzaRicettore: 150, ppvMisurata: 4 }).pronto === false, "senza carica");
  ok(sentinella.refertoDaVolata({}).motivi.length > 0, "volata vuota: motivi, non crash");
});
test("nel file per Genesi entrano SOLO le volate con la misura", () => {
  const V = [{ id: "v1", data: "2026-07-06", distanzaRicettore: 90, kgMaxRitardo: 5.2, ppvMisurata: 3.9, ppvFonte: "strumento" },
             { id: "v2", data: "2026-07-07", distanzaRicettore: 150, kgMaxRitardo: 25 },
             { id: "v3", data: "2026-07-08", distanzaRicettore: 420, kgMaxRitardo: 40, ppvMisurata: 1.35, ppvFonte: "manuale" }];
  const csv = sentinella.csvRefertiGenesi(V.map(v => sentinella.refertoDaVolata(v)));
  const righe = csv.trim().split("\n");
  ok(righe.length === 3, `${righe.length - 1} righe invece di 2: la volata senza misura non deve entrare`);
  ok(!/;150;/.test(csv), "la volata senza PPV è finita nel file");
  ok(righe[1].includes("2026-07-06") && righe[2].includes("2026-07-08"), "le righe vanno ordinate per data");
  ok(righe.every(r => r.split(";").length === righe[0].split(";").length), "una cella con ; spezzerebbe il file");
});
test("zero referti pronti: solo l'intestazione, nessuna riga inventata", () => {
  const solo = sentinella.csvRefertiGenesi([sentinella.refertoDaVolata({ id: "v", data: "2026-07-07", distanzaRicettore: 150, kgMaxRitardo: 25 })]);
  ok(solo.trim().split("\n").length === 1, "un file con righe finte è peggio di un file vuoto");
  ok(typeof sentinella.csvRefertiGenesi(undefined) === "string", "lista assente: stringa, non crash");
});
test("le soglie dichiarate della legge di sito: 3 referti per esistere, 8 per essere solida", () => {
  ok(sentinella.MIN_REFERTI === 3, `MIN_REFERTI ${sentinella.MIN_REFERTI}`);
  ok(sentinella.REFERTI_SOLIDI === 8, `REFERTI_SOLIDI ${sentinella.REFERTI_SOLIDI}`);
});

console.log("\n— Ponte Genesi → Sentinella: la volata prevista —");
// Una volata PROGETTATA non è una volata SPARATA. Tenerle distinte non è
// pedanteria: se una previsione entrasse fra i referti, falserebbe la legge
// di sito, cioè il calcolo da cui dipendono le distanze di sicurezza.
test("una volata senza il campo stato vale ESEGUITA (è ciò che è)", () => {
  ok(sentinella.statoVolata({}) === "eseguita", "le volate storiche non devono cambiare natura");
  ok(sentinella.statoVolata({ stato: "PREVISTA" }) === "prevista", "maiuscole e spazi non contano");
  ok(sentinella.statoVolata({ stato: "boh" }) === "eseguita", "uno stato illeggibile non deve far sparire una volata");
});
test("VINCOLO: una volata prevista non diventa mai un referto", () => {
  const prevista = { id: "p1", data: "2026-07-27", stato: "prevista", distanzaRicettore: 300, kgMaxRitardo: 58, ppvPrevista: 6.4 };
  const r = sentinella.refertoDaVolata(prevista);
  ok(r.pronto === false, "una previsione non è una misura");
  ok(r.motivi.includes("prevista"), `il motivo va detto: ${JSON.stringify(r.motivi)}`);
  ok(r.ppv === null, `la PPV del referto non deve prendere la prevista: ${r.ppv}`);
  const forzata = sentinella.refertoDaVolata({ ...prevista, ppvMisurata: 6.1 });
  ok(forzata.pronto === false, "nemmeno con una misura addosso, finché è prevista");
});
test("la guardia ridondante del CSV scarta comunque una prevista", () =>
  ok(sentinella.csvRefertiGenesi([{ pronto: true, prevista: true, d: 300, w: 58, ppv: 6.4, data: "2026-07-27" }])
       .trim().split("\n").length === 1, "due guardie indipendenti valgono più di una"));
test("una eseguita con misura entra, e porta la MISURA non la previsione", () => {
  const r = sentinella.refertoDaVolata({ id: "e1", data: "2026-07-17", distanzaRicettore: 320, kgMaxRitardo: 18,
                                         ppvMisurata: 5.6, ppvPrevista: 4.6 });
  ok(r.pronto === true, "questa è una misura vera");
  ok(r.ppv === 5.6, `deve valere 5,6 (misurato), non 4,6 (previsto): ${r.ppv}`);
  const csv = sentinella.csvRefertiGenesi([r]);
  ok(/5\.6/.test(csv) && !/4\.6/.test(csv), "nel file per Genesi la previsione non deve comparire");
});
test("una volata prevista non è un fatto avvenuto", () => {
  const prevista = { id: "p1", data: "2026-07-27", stato: "prevista" };
  ok(sentinella.volateDelGiorno([prevista], "2026-07-27").length === 0, "non è successo niente quel giorno");
  ok(sentinella.volateDelGiorno([{ data: "2026-07-27" }], "2026-07-27").length === 1, "una volata senza stato sì");
});
test("lo scarto fra previsto e misurato: è il confronto che dà valore al registro", () => {
  const sc = sentinella.scartoPpvVolata({ ppvPrevista: 4.6, ppvMisurata: 5.6 });
  ok(Math.abs(sc.delta - 1) < 0.005, `delta ${sc.delta} invece di 1`);
  ok(Math.abs(sc.pct - 21.7) < 0.05, `${sc.pct}% invece di 21,7`);
  ok(sc.verso === "sopra", `verso ${sc.verso}`);
  ok(sentinella.scartoPpvVolata({ ppvPrevista: 4.6 }) === null, "senza misura è null, non «scarto zero»");
});

console.log("\n— Ponte Terra → Conti: cavato contro venduto —");
// Il confronto ha senso solo se è onesto: metri cubi contro tonnellate senza
// la densità dichiarata non è una stima prudente, è un numero inventato.
const _RIL = [{ stato: "elaborato", volumeM3: 10000, data: "2026-07-10", metodo: "RTK" }];
const _pes = (netto, densita) => [{ data: "2026-07-15", prodotto: "Misto", netto, densita }];
test("i numeri tondi: 20.000 t a densità 2,5 fanno 8.000 m³, divario 2.000 (20%)", () => {
  const r = conti.riconciliazione(_RIL, _pes(20000, 2.5), "2026-07-01", "2026-07-31");
  ok(r.cav.m3 === 10000 && r.ven.t === 20000, `cavato ${r.cav.m3}, venduto ${r.ven.t} t`);
  ok(r.ven.m3 === 8000, `conversione ${r.ven.m3} invece di 8000`);
  ok(r.divario === 2000 && r.pct === 20, `divario ${r.divario} (${r.pct}%)`);
  ok(r.stato === "attenzione", `stato ${r.stato}`);
});
test("un divario piccolo è coerente, uno enorme è un errore da cercare", () => {
  ok(conti.riconciliazione(_RIL, _pes(24000, 2.5), "2026-07-01", "2026-07-31").stato === "coerente", "4% è sfrido");
  ok(conti.riconciliazione(_RIL, _pes(5000, 2.5), "2026-07-01", "2026-07-31").stato === "implausibile",
     "l'80% non è sfrido e non va chiamato «scorte»");
});
test("venduto più del cavato è un DISAVANZO, non una scorta", () => {
  const r = conti.riconciliazione(_RIL, _pes(30000, 2.5), "2026-07-01", "2026-07-31");
  ok(r.stato === "disavanzo", `stato ${r.stato}`);
  ok(r.divario < 0, "un divario negativo non può essere presentato come materiale a piazzale");
});
test("senza densità non converte e non stima: lo dichiara", () => {
  const r = conti.riconciliazione(_RIL, _pes(20000, undefined), "2026-07-01", "2026-07-31");
  ok(r.stato === "no-densita", `stato ${r.stato}`);
  ok(r.divario === null, "un divario calcolato senza densità sarebbe inventato");
  ok(r.ven.viaggiSenzaDensita === 1, "va detto quanti viaggi restano fuori dal conto");
});
test("con solo metà dei viaggi convertibili il confronto si dichiara parziale", () => {
  const r = conti.riconciliazione(_RIL, [{ data: "2026-07-15", prodotto: "A", netto: 10000, densita: 2.5 },
                                         { data: "2026-07-16", prodotto: "B", netto: 10000 }],
                                  "2026-07-01", "2026-07-31");
  ok(r.parziale === true, "un confronto parziale spacciato per completo è peggio di nessun confronto");
  ok(r.copertura === 50, `copertura ${r.copertura}%`);
});
test("la ripresa da cumulo non gonfia il cavato", () => {
  const r = conti.riconciliazione(_RIL.concat([{ stato: "elaborato", volumeM3: 5000, data: "2026-07-11", provenienza: "cumulo" }]),
                                  _pes(20000, 2.5), "2026-07-01", "2026-07-31");
  ok(r.cav.m3 === 10000, `scavo ${r.cav.m3}: il cumulo non è nuovo scavo`);
  ok(r.cav.cumuloM3 === 5000, `cumulo ${r.cav.cumuloM3}: va contato, ma a parte`);
});
test("archivi mancanti: stati che spiegano, non zeri", () => {
  ok(conti.riconciliazione([], _pes(20000, 2.5), "2026-07-01", "2026-07-31").stato === "no-cavato", "nessun rilievo");
  ok(conti.riconciliazione(_RIL, [], "2026-07-01", "2026-07-31").stato === "no-venduto", "nessun DDT");
  ok(conti.riconciliazione(undefined, _pes(20000, 2.5), "2026-07-01", "2026-07-31").stato === "no-terra", "Terra non risponde");
});
test("il valore del cavato non si inventa senza prezzo", () => {
  ok(conti.valoreCavato(10000, 12) === 120000, "10.000 m³ a 12 €/m³");
  ok(conti.valoreCavato(10000, null) === null && conti.valoreCavato(10000, 0) === null, "senza prezzo: null, non zero");
});

// ══════════════════════════════════════════════════════════════════════
// LA VIRGOLA DECIMALE — il difetto più pericoloso trovato finora
// ══════════════════════════════════════════════════════════════════════
// Misurato in Chromium: in un `input type="number"`, digitando «2,4» da
// tastiera, `.value` diventa «24» e `checkValidity()` risponde true. Il
// browser scarta la virgola e chiama valido il numero sbagliato: dieci volte
// tanto, salvato in silenzio. Su una PPV significa un falso superamento e un
// valore falso dentro la regressione della legge di sito, che decide le
// distanze di sicurezza. La correzione è `type=text inputmode=decimal` più
// una validazione nostra, e questa è la validazione.
test("numeroDaCampo: la virgola italiana è un decimale", () => {
  contiene(sentinella.numeroDaCampo("2,4"), { ok: true, valore: 2.4, vuoto: false }, "«2,4»");
  contiene(sentinella.numeroDaCampo("2.4"), { ok: true, valore: 2.4 }, "il punto vale quanto la virgola");
  ok(sentinella.numeroDaCampo("1.250,75").valore === 1250.75, "migliaia all'italiana");
  ok(sentinella.numeroDaCampo("1,250.75").valore === 1250.75, "migliaia all'inglese");
  ok(sentinella.numeroDaCampo("  2,4  ").valore === 2.4, "spazi intorno");
});
test("numeroDaCampo: vuoto non è zero, testo non è zero", () => {
  contiene(sentinella.numeroDaCampo(""), { vuoto: true, ok: false, valore: null, motivo: "vuoto" }, "campo vuoto");
  contiene(sentinella.numeroDaCampo(null), { vuoto: true, ok: false, valore: null }, "null");
  contiene(sentinella.numeroDaCampo("abc"), { ok: false, valore: null, motivo: "non-numero" }, "testo");
  ok(sentinella.numeroDaCampo("abc").valore === null, "non si salva zero al posto di un numero non capito");
});
test("numeroDaCampo: zero è una lettura valida ma non una soglia valida", () => {
  ok(sentinella.numeroDaCampo("0", { min: 0 }).ok === true, "zero passa dove il minimo è zero");
  ok(sentinella.numeroDaCampo("0", { positivo: true }).motivo === "non-positivo", "zero non passa dove serve positivo");
  ok(sentinella.numeroDaCampo("-3", { min: 0 }).motivo === "sotto-minimo", "sotto il minimo");
  ok(sentinella.numeroDaCampo("500", { max: 100 }).motivo === "sopra-massimo", "sopra il massimo");
});
test("numeroDaCampo: quattro decimali, gli stessi con cui la PPV viene salvata", () => {
  ok(sentinella.numeroDaCampo("2,44449").valore === 2.4445, "arrotondato a quattro decimali");
  ok(sentinella.numeroDaCampo("2,4", { decimali: 0 }).valore === 2, "decimali su richiesta");
});
test("la catena campo → record: 2,4 arriva sulla volata come 2,4", () => {
  const v = sentinella.numeroDaCampo("2,4").valore;
  const c = sentinella.campiPpvVolata(v, { fonte: sentinella.PPV_MANUALE });
  ok(c.ppvMisurata === 2.4, "sulla volata la PPV è 2,4, non 24 — era " + c.ppvMisurata);
});
test("conferma volata: i chili scritti con la virgola non decuplicano", () => {
  const prev = { id: "v1", stato: sentinella.VOL_PREVISTA, data: "2026-07-20",
    nFori: 18, kgTotali: 430, kgMaxRitardo: 20, distanzaRicettore: 240 };
  const r = sentinella.confermaVolataEseguita(prev,
    { kgTotali: "187,5", kgMaxRitardo: "12,5", distanzaRicettore: "312,5", data: "2026-07-25" },
    new Date("2026-07-30T12:00:00Z"));
  contiene(r.campi, { kgTotali: 187.5, kgMaxRitardo: 12.5, distanzaRicettore: 312.5 }, "le tre virgole");
  // svuotare un campo è una correzione, non una dimenticanza: era già così
  const z = sentinella.confermaVolataEseguita(prev, { kgTotali: "", data: "2026-07-25" },
    new Date("2026-07-30T12:00:00Z"));
  ok(z.campi.kgTotali === 0, "campo svuotato → zero, come nel form a mano");
  // chiave assente ≠ campo svuotato: resta il valore del progetto
  const t = sentinella.confermaVolataEseguita(prev, { data: "2026-07-25" },
    new Date("2026-07-30T12:00:00Z"));
  ok(t.campi.kgTotali === 430, "campo non toccato → resta il progetto");
});

test("numeroIt: il secondo argomento non cambia il comportamento di prima", () => {
  ok(sentinella.numeroIt(36.8) === "36,8", "sotto cento, due decimali di serie");
  ok(sentinella.numeroIt(312.5) === "313", "da cento in su arrotonda: regola di lettura dell'app, invariata");
  ok(sentinella.numeroIt(312.5, 1) === "312,5", "ma chi ha bisogno della misura la chiede — era " + sentinella.numeroIt(312.5, 1));
  ok(sentinella.numeroIt(1286) === "1.286", "migliaia col punto anche su Node");
});
test("numeroIt: un dato che manca non si scrive «0»", () => {
  // «0 µg/m³» è un fatto, e falso: dice che si è misurato zero. Il trattino
  // dice la verità. Che il vecchio «0» fosse un difetto e non una scelta lo
  // diceva l'incoerenza: undefined dava già il trattino, null no.
  ok(sentinella.numeroIt(null) === "—", "null → trattino, non «0» — era " + sentinella.numeroIt(null));
  ok(sentinella.numeroIt("") === "—", "stringa vuota → trattino — era " + sentinella.numeroIt(""));
  ok(sentinella.numeroIt(undefined) === "—", "undefined → trattino, come già faceva");
  ok(sentinella.numeroIt("abc") === "—", "testo → trattino");
  ok(sentinella.numeroIt(0) === "0" && sentinella.numeroIt("0") === "0", "ma uno zero VERO si scrive: è una misura");
});
test("la prima schermata non scrive i numeri col punto inglese", () => {
  const p = sentinella.prioritaConformita(
    [{ nome: "Polveri PM10", valore: 36.8, soglia: 40, unita: "µg/m³", nota: "media 7gg" }], [],
    new Date("2026-07-30T12:00:00Z"));
  ok(p.length === 1, "una voce di priorità");
  ok(p[0].dettaglio.startsWith("36,8 µg/m³"), "il valore con la virgola — era «" + p[0].dettaglio + "»");
  ok(!/\d\.\d/.test(p[0].dettaglio), "e nessun punto decimale da nessuna parte nella riga");
});

// ══════════════════════════════════════════════════════════════════════
// PIANO DI CARICO: le colonne si leggono per NOME, non per posizione
// ══════════════════════════════════════════════════════════════════════
// Il difetto è stato trovato per caso, sbagliando l'intestazione in una prova:
// un file con le colonne in ordine diverso si caricava COMUNQUE, senza errori,
// con la profondità nel borraggio e il ritardo nella carica progettata. La riga
// sembrava normale. Questo è il test che non lo lascia tornare.
test("piano CSV: le colonne in ordine diverso vengono lette per nome", () => {
  // stesso contenuto, ordine sconvolto e nomi con unità fra parentesi
  const csv = "foro;carica (kg);prof_m;borr_m;rit_ms;x_m;fila\n"
            + "1;40;13,20;3,00;25;0,00;A\n2;44,7;13,20;3,00;25;4,50;A";
  const out = campo.parsePianoCsv(csv);
  ok(out.length === 2, "due righe lette — erano " + out.length);
  contiene(out[0], { foro: 1, prog: 40 }, "prima riga");
  ok(out[0].prof === "13,20", "la profondità è la profondità — era " + JSON.stringify(out[0].prof));
  ok(out[0].borr === "3,00", "il borraggio è il borraggio — era " + JSON.stringify(out[0].borr));
  ok(out[0].rit === "25", "il ritardo è il ritardo — era " + JSON.stringify(out[0].rit));
  ok(out[0].x === "0,00", "la x è la x — era " + JSON.stringify(out[0].x));
  ok(out[1].prog === 44.7, "e la carica con la virgola vale 44,7 — era " + out[1].prog);
});
test("piano CSV: senza intestazione si legge per posizione, come prima", () => {
  // è il formato dei file vecchi: il contratto non cambia di una virgola
  const out = campo.parsePianoCsv("1;3.5;A;12;100;2;20\n2;4;B;12;80;2;18");
  ok(out.length === 2, "due righe");
  contiene(out[0], { foro: 1, x: "3.5", fila: "A", prof: "12", prog: 100, borr: "2", rit: "20" },
    "ordine posizionale storico");
});
test("piano CSV: l'app sa dire come ha letto il file", () => {
  const m = campo.mappaPianoCsv("foro;carica_kg;prof;borr;rit;x;fila\n1;40;12;2;20;0;A");
  ok(m.conIntestazione === true, "riconosce l'intestazione");
  ok(m.indici.prog === 1, "«carica_kg» è la carica progettata — era " + m.indici.prog);
  ok(m.indici.prof === 2 && m.indici.borr === 3, "profondità e borraggio al posto giusto");
  ok(m.mancanti.length === 0, "niente colonne mancanti — mancavano " + JSON.stringify(m.mancanti));
  const senza = campo.mappaPianoCsv("1;3.5;A;12;100;2;20");
  ok(senza.conIntestazione === false, "senza intestazione lo dichiara");
  // una colonna che non conosciamo va segnalata, non fatta sparire in silenzio
  const strana = campo.mappaPianoCsv("foro;prog;pinco;prof\n1;40;xx;12");
  ok(strana.ignorate.includes("pinco"), "la colonna sconosciuta è dichiarata — " + JSON.stringify(strana.ignorate));
  ok(strana.mancanti.includes("rit") && strana.mancanti.includes("borr"),
    "e quelle assenti pure — " + JSON.stringify(strana.mancanti));
});
test("piano CSV: senza la colonna della carica non si inventa niente", () => {
  // prog manca → nessuna riga passa il filtro, invece di righe con carica zero
  const out = campo.parsePianoCsv("foro;prof;borr\n1;12;2\n2;12;2");
  ok(out.length === 0, "nessuna riga: meglio un import vuoto che cariche a zero — erano " + out.length);
});

// Campo ha lo stesso lettore, e il caso che conta è la CARICA per foro: quel
// numero esce nel CSV del consuntivo e torna a Genesi a tarare la
// riconciliazione, quindi un fattore dieci non resta in Campo — avvelena la
// calibrazione dell'altra app.
test("Campo numeroDaCampo: la virgola sulla carica per foro", () => {
  contiene(campo.numeroDaCampo("44,7"), { ok: true, valore: 44.7, vuoto: false }, "«44,7» kg");
  ok(campo.numeroDaCampo("44.7").valore === 44.7, "il punto vale quanto la virgola");
  ok(campo.numeroDaCampo("1.250,75").valore === 1250.75, "migliaia all'italiana");
  ok(campo.numeroDaCampo("1,250.75").valore === 1250.75, "migliaia all'inglese");
  ok(campo.numeroDaCampo("44,7449").valore === 44.745, "tre decimali: al grammo si è già oltre il vero");
});
test("Campo numeroDaCampo: vuoto e incomprensibile non sono zero", () => {
  contiene(campo.numeroDaCampo(""), { vuoto: true, ok: false, valore: null, motivo: "vuoto" }, "vuoto");
  contiene(campo.numeroDaCampo("abc"), { ok: false, valore: null, motivo: "non-numero" }, "testo");
  ok(campo.numeroDaCampo(null).vuoto === true, "null è vuoto, non zero");
  ok(campo.numeroDaCampo("-3", { min: 0 }).motivo === "sotto-minimo", "chili negativi");
  ok(campo.numeroDaCampo("0", { min: 0 }).ok === true, "zero chili è una registrazione valida (foro non caricato)");
  ok(campo.numeroDaCampo("0", { positivo: true }).motivo === "non-positivo", "ma non un obiettivo di turno valido");
});
test("Campo: la catena carica → CSV → Genesi non cambia di un grammo", () => {
  // il consuntivo scrive il numero GREZZO col punto: è un dato, non testo
  const kg = campo.numeroDaCampo("44,7").valore;
  const csv = campo.pianoConsuntivoCsv([
    { n: 1, foro: 1, data: "2026-07-30", turno: "mattina", prog: 40, reale: kg, squadra: "A" },
  ]);
  ok(/;44\.7;/.test(csv), "nel CSV esce 44.7 col punto — era «" + csv.split("\n")[1] + "»");
  ok(!/;447;/.test(csv), "e NON 447: il fattore dieci non arriva a Genesi");
  ok(/;4\.7;/.test(csv), "e lo scarto col segno è +4.7");
});

// ══════════════════════════════════════════════════════════════════════
// FLOTTA: la tessera «Tagliandi 30gg» contava solo i tagliandi a data
// ══════════════════════════════════════════════════════════════════════
// Un tagliando programmato a ORE non entrava nel numero di testa, quindi la
// tessera diceva un numero più basso del vero senza dirlo. Ora il ritmo d'uso
// si MISURA dalle letture del contatore, e dove non si può misurare non si
// stima: si dichiara a parte.
const _OGGI_F = new Date("2026-07-30T12:00:00Z");
const _ind = (g) => { const d = new Date(_OGGI_F); d.setDate(d.getDate() - g); return d.toISOString().slice(0, 10); };
test("ritmo d'uso: due letture del contatore bastano, una no", () => {
  const r = flotta.ritmoOreMezzi([
    { mezzo: "E1", data: _ind(20), ore: 1000 },
    { mezzo: "E1", data: _ind(2), ore: 1080 },
  ], _OGGI_F)[0];
  ok(r.oreGiorno === 4.44, "80 ore in 18 giorni = 4,44 h/gg — era " + r.oreGiorno);
  const uno = flotta.ritmoOreMezzi([{ mezzo: "E1", data: _ind(5), ore: 1000 }], _OGGI_F)[0];
  ok(uno.oreGiorno === null, "una lettura sola non è un ritmo");
  ok(/seconda/.test(uno.perche), "e lo spiega nominando la seconda lettura: " + uno.perche);
});
test("ritmo d'uso: il confine è metà dell'orizzonte, 15 giorni su 30", () => {
  const f = (g) => flotta.ritmoOreMezzi([
    { mezzo: "E1", data: _ind(g), ore: 1000 }, { mezzo: "E1", data: _ind(0), ore: 1060 },
  ], _OGGI_F)[0];
  ok(f(15).oreGiorno !== null, "una finestra di 15 giorni si può proiettare a 30");
  ok(f(14).oreGiorno === null, "una di 14 no — proiettare 30 giorni da 14 è una moltiplicazione, non una stima");
  ok(/almeno 15/.test(f(14).perche), "e lo scrive: " + f(14).perche);
});
test("ritmo d'uso: contatore fermo, lettura vecchia, lettura nel futuro", () => {
  const fermo = flotta.ritmoOreMezzi([
    { mezzo: "E1", data: _ind(20), ore: 1000 }, { mezzo: "E1", data: _ind(0), ore: 1000 },
  ], _OGGI_F)[0];
  ok(fermo.oreGiorno === null && /non è salito/.test(fermo.perche), "contatore fermo: " + fermo.perche);
  const vecchio = flotta.ritmoOreMezzi([
    { mezzo: "E1", data: _ind(120), ore: 1000 }, { mezzo: "E1", data: _ind(90), ore: 1200 },
  ], _OGGI_F)[0];
  ok(vecchio.oreGiorno === null && /passato/.test(vecchio.perche), "storico vecchio: " + vecchio.perche);
  const futuro = flotta.ritmoOreMezzi([
    { mezzo: "E1", data: _ind(20), ore: 1000 }, { mezzo: "E1", data: _ind(2), ore: 1080 },
    { mezzo: "E1", data: _ind(-10), ore: 9999 },
  ], _OGGI_F)[0];
  ok(futuro.oreGiorno === 4.44 && futuro.letture === 2,
    "una lettura datata nel futuro non è un fatto e viene ignorata — " + futuro.oreGiorno + " su " + futuro.letture + " letture");
  ok(flotta.ritmoOreMezzi(null, _OGGI_F).length === 0 && flotta.ritmoOreMezzi([], _OGGI_F).length === 0, "niente letture, niente ritmi");
});
const _MEZZI_F = [{ nome: "Escavatore E1", ore: 1080, stato: "operativo" }];
const _LETT_F = [{ mezzo: "Escavatore E1", data: _ind(20), ore: 1000 },
  { mezzo: "Escavatore E1", data: _ind(2), ore: 1080 }];
test("tagliandi a ore: contati quando il ritmo si misura", () => {
  // 100 ore mancanti a 4,44 h/gg ⇒ 23 giorni: dentro i 30
  const t = flotta.tagliandiInScadenza([{ id: "m1", titolo: "Tagliando", mezzo: "Escavatore E1", orePreviste: 1180 }],
    _MEZZI_F, _LETT_F, _OGGI_F);
  contiene(t, { totale: 1, aOre: 1, aData: 0, nonStimabili: 0 }, "un tagliando a ore, ritmo noto");
  ok(t.voci[0].giorni === 23, "100 ore a 4,44 h/gg = 23 giorni — erano " + t.voci[0].giorni);
});
test("tagliandi a ore: senza storico NON si stima, si dichiara", () => {
  const t = flotta.tagliandiInScadenza([{ id: "m1", titolo: "Tagliando", mezzo: "Escavatore E1", orePreviste: 1180 }],
    _MEZZI_F, [], _OGGI_F);
  contiene(t, { totale: 0, aOre: 0, nonStimabili: 1 }, "niente letture: fuori dal conto, ma dichiarato");
  ok(t.daStimare.length === 1 && /Escavatore E1/.test(t.daStimare[0].mezzo + " " + (t.daStimare[0].perche || "")),
    "e il mezzo viene nominato, non nascosto");
});
test("tagliandi a ore: uno GIÀ oltre entra anche senza storico", () => {
  const t = flotta.tagliandiInScadenza([{ id: "m1", titolo: "Tagliando", mezzo: "Escavatore E1", orePreviste: 1000 }],
    _MEZZI_F, [], _OGGI_F);
  contiene(t, { totale: 1, aOre: 1, nonStimabili: 0 }, "il contatore è già a 1080 su 1000: è scaduto, non da stimare");
});
test("tagliandi a ore: uno lontano resta fuori, e non è «non stimabile»", () => {
  const t = flotta.tagliandiInScadenza([{ id: "m1", titolo: "Tagliando", mezzo: "Escavatore E1", orePreviste: 1600 }],
    _MEZZI_F, _LETT_F, _OGGI_F);
  contiene(t, { totale: 0, aOre: 0, nonStimabili: 0 }, "520 ore a 4,44 h/gg sono oltre 100 giorni: fuori, e si sa perché");
});
test("kpiFrom: il contratto a tre argomenti non è cambiato", () => {
  const k = flotta.kpiFrom(_MEZZI_F, [{ id: "m1", mezzo: "Escavatore E1", dataPrevista: _ind(-10) }], []);
  const chiavi = Object.keys(k).sort().join(",");
  ok(chiavi === "carburante,inManutenzione,operativi,tagliandi30",
    "esattamente le quattro chiavi storiche, nessuna in più — erano " + chiavi);
  ok(k.tagliandi30 === 1, "un tagliando a data fra dieci giorni");
});
test("kpiFrom: col quarto argomento il conto è onesto e si scompone", () => {
  const manut = [{ id: "m1", mezzo: "Escavatore E1", dataPrevista: _ind(-10) },
    { id: "m2", titolo: "Tagliando", mezzo: "Escavatore E1", orePreviste: 1180 }];
  const k = flotta.kpiFrom(_MEZZI_F, manut, [], { letture: _LETT_F, oggi: _OGGI_F });
  ok(k.tagliandi30 === 2, "uno a data più uno a ore — era " + k.tagliandi30);
  ok(k.tagliandi.aData + k.tagliandi.aOre === k.tagliandi.totale, "le due strade sommano al totale");
  const senza = flotta.kpiFrom(_MEZZI_F, manut, [], { letture: [], oggi: _OGGI_F });
  ok(senza.tagliandi30 === 1 && senza.tagliandi.nonStimabili === 1,
    "senza letture il numero non cresce, ma il non stimabile è dichiarato");
});

// ══════════════════════════════════════════════════════════════════════
// IL PUNTO AMBIGUO — quando NON si indovina al posto dell'utente
// ══════════════════════════════════════════════════════════════════════
// `numIt` è l'aiutante condiviso e legge i file delle MACCHINE, dove il
// decimale è il punto: «1.250» per lui è 1,25, ed è giusto per un CSV. Ma un
// italiano che digita «1.250» in un campo intende milleduecentocinquanta, e le
// due letture distano MILLE VOLTE. Su un imponibile di fattura è la differenza
// fra 1.250 € e 1,25 €.
// La regola che Flotta, Conti e Terra hanno adottato: se per quel campo una
// sola lettura è possibile (una densità di 1500 t/m³ non esiste) si risolve; se
// entrambe stanno nei limiti, l'app si FERMA e mostra le due letture invece di
// scegliere. Questi test proteggono quella scelta.
test("la convenzione vive in UN posto: le sei app leggono «1.250» allo stesso modo", async () => {
  const sh = await import("../../../shared/deepwork-id-client/dw-shell.js");
  // il lettore condiviso è la sorgente: le app ci delegano e aggiungono solo i
  // loro decimali. Se un domani una si riscrive la logica per conto suo, questo
  // test se ne accorge perché le risposte divergono.
  const base = sh.numeroScritto("1.250");
  for (const [nome, mod] of [["campo", campo], ["conti", conti], ["flotta", flotta],
                             ["sentinella", sentinella], ["terra", terra]]) {
    const r = mod.numeroDaCampo("1.250");
    ok(r.motivo === base.motivo, `${nome}: stesso motivo del condiviso («${base.motivo}») — era «${r.motivo}»`);
    contiene({ l: r.letture }, { l: base.letture }, `${nome}: stesse letture`);
  }
  // e dove una sola lettura è possibile, TUTTE risolvono allo stesso modo
  for (const [nome, mod] of [["campo", campo], ["conti", conti], ["flotta", flotta],
                             ["sentinella", sentinella], ["terra", terra]])
    ok(mod.numeroDaCampo("1.600", { min: 0.3, max: 5 }).valore === 1.6,
      `${nome}: «1.600» in un campo 0,3–5 vale 1,6 — era ${mod.numeroDaCampo("1.600", { min: 0.3, max: 5 }).valore}`);
});
test("il messaggio dell'ambiguo mostra le due letture, non dice «non valido»", async () => {
  const sh = await import("../../../shared/deepwork-id-client/dw-shell.js");
  const m = sh.messaggioNumero(sh.numeroScritto("1.250"), "i chili caricati", { unita: "kg" });
  ok(/1250 kg/.test(m) && /1,25 kg/.test(m), "entrambe le letture nel messaggio — era: " + m);
  ok(/non voglio indovinare/.test(m), "e dice che non indovina");
  // la lettura decimale di «5.875» è 5,875: con due decimali diventerebbe
  // «5,88», un terzo numero che nessuno ha scritto
  const m2 = sh.messaggioNumero(sh.numeroScritto("5.875"), "le ore", { unita: "h" });
  ok(/5,875 h/.test(m2), "tre decimali sulla lettura decimale — era: " + m2);
  // e i motivi che c'erano prima continuano a dire la cosa giusta
  ok(/negativo/.test(sh.messaggioNumero(sh.numeroScritto("-3", { min: 0 }), "i chili", { min: 0 })), "negativo");
  ok(/non è un numero/.test(sh.messaggioNumero(sh.numeroScritto("abc"), "la PPV")), "non-numero");
  ok(/Senza/.test(sh.messaggioNumero(sh.numeroScritto(""), "l'imponibile")), "vuoto");
});
test("«1.250» non si indovina: le due letture vengono dichiarate", () => {
  for (const [nome, mod] of [["flotta", flotta], ["conti", conti], ["terra", terra]]) {
    const r = mod.numeroDaCampo("1.250");
    ok(r.motivo === "ambiguo", `${nome}: motivo «ambiguo» — era «${r.motivo}»`);
    ok(r.valore === null, `${nome}: nessun valore scelto a caso — era ${r.valore}`);
    contiene({ l: r.letture }, { l: [1250, 1.25] }, `${nome}: le due letture`);
  }
});
test("ma dove una sola lettura è possibile, si risolve senza chiedere", () => {
  // una densità di 1500 t/m³ non esiste: «1.600» in quel campo è 1,6
  ok(terra.numeroDaCampo("1.600", { min: 0.3, max: 5 }).valore === 1.6,
    "densità «1.600» → 1,6 t/m³");
  // 32.500 tonnellate su una pesata non esistono: è 32,5
  ok(conti.numeroDaCampo("32.500", { max: 500 }).valore === 32.5, "lordo «32.500» → 32,5 t");
  // due punti = migliaia, nessun dubbio possibile
  ok(terra.numeroDaCampo("1.200.000").valore === 1200000, "«1.200.000» m³ concessi");
  ok(flotta.numeroDaCampo("1.234.567").valore === 1234567, "«1.234.567»");
  // e con le migliaia italiane più i decimali non c'è ambiguità
  ok(conti.numeroDaCampo("1.250,75").valore === 1250.75, "«1.250,75» → 1250,75");
});
test("vuoto e incomprensibile non sono zero, in nessuna delle tre app", () => {
  for (const [nome, mod] of [["flotta", flotta], ["conti", conti], ["terra", terra]]) {
    contiene(mod.numeroDaCampo(""), { vuoto: true, ok: false, valore: null }, `${nome}: vuoto`);
    ok(mod.numeroDaCampo("abc").valore === null, `${nome}: testo non è zero`);
    ok(mod.numeroDaCampo("-5", { min: 0 }).motivo === "sotto-minimo", `${nome}: sotto il minimo`);
  }
  // «2,4,5» non è 245: due virgole non sono un numero, sono un errore di battitura
  ok(flotta.numeroDaCampo("2,4,5").motivo === "non-numero", "«2,4,5» rifiutato");
  ok(flotta.numeroDaCampo("1e3").motivo === "non-numero", "la notazione esponenziale non è un numero da cava");
});
test("quello che arriva dal foglio di calcolo si legge comunque", () => {
  ok(flotta.numeroDaCampo("€ 12,50").valore === 12.5, "il simbolo dell'euro non è un errore");
  ok(flotta.numeroDaCampo("1 250,75").valore === 1250.75, "lo spazio come separatore di migliaia");
  ok(flotta.numeroDaCampo(",75").valore === 0.75, "«,75» → 0,75");
  ok(conti.numeroDaCampo("€ 1.250,75").valore === 1250.75, "euro più migliaia italiane");
});
test("Flotta: interoDaCampo non accetta un decimale travestito", () =>
  ok(flotta.interoDaCampo("2,4").motivo === "non-intero", "«2,4» giorni non è un numero di giorni"));

// ── le catene: dal campo al numero che l'utente legge ──────────────────
test("Conti: «1.250,75» imponibile → IVA 275,17 → totale 1.525,92", () => {
  contiene(conti.totaliDaRighe([{ imponibile: conti.numeroDaCampo("1.250,75").valore, aliquota: 22 }]),
    { imponibile: 1250.75, ivaImporto: 275.17, totale: 1525.92 }, "la fattura");
});
test("Conti: la pesata scritta con la virgola dà il netto giusto", () =>
  ok(conti.nettoPesata(conti.numeroDaCampo("42,6").valore, conti.numeroDaCampo("14,2").valore) === 28.4,
    "42,6 − 14,2 = 28,4 t"));
test("Flotta: le ore e la tariffa con la virgola fanno il costo giusto", () => {
  const ore = flotta.numeroDaCampo("2,5").valore, tar = flotta.numeroDaCampo("32,50").valore;
  ok(ore === 2.5 && tar === 32.5, "letti 2,5 h e 32,50 €");
  const c = flotta.costoOrdine({ manodopera: [{ chi: "Rossi", ore, tariffa: tar }] });
  ok(c.manodopera.costo === 81.25, "2,5 × 32,50 = 81,25 € — era " + c.manodopera.costo);
});
test("Flotta: il mezzo decimo del contatore non si perde", () => {
  // la firma è (manutenzione, oreAttuali, dataChiusura): il piano dice OGNI
  // quante ore, il contatore dice dove siamo. Al primo giro avevo passato il
  // mezzo al posto del piano e la funzione, giustamente, non ha inventato nulla.
  ok(flotta.prossimoTagliando({ titolo: "Tagliando", mezzo: "E1", ogniOre: 250 }, 5875.5).orePreviste === 6125.5,
    "contatore 5875,5 + ogni 250 h = 6125,5 h — era "
    + JSON.stringify(flotta.prossimoTagliando({ titolo: "T", mezzo: "E1", ogniOre: 250 }, 5875.5)));
  ok(flotta.urgenzaOre(6500, 5265.5).label === "tra 1234,5 h",
    "l'etichetta scrive 1234,5 e non 1234.5 — era «" + flotta.urgenzaOre(6500, 5265.5).label + "»");
  ok(flotta.urgenzaOre(6500, 6520).label === "SCADUTA (+20 h)", "l'etichetta storica non cambia");
});
test("Terra: il GSD si legge sia numero sia testo, e si scrive con la virgola", () => {
  ok(terra.qualitaRilievo({ metodo: "RTK", gsd: 2.5 }) === "RTK · GSD 2,5 cm", "gsd numero");
  ok(terra.qualitaRilievo({ metodo: "RTK", gsd: "2.5" }) === "RTK · GSD 2,5 cm", "gsd dal CSV col punto");
  ok(terra.qualitaRilievo({ metodo: "RTK", gsd: "2" }) === "RTK · GSD 2 cm", "gsd intero invariato");
  // 2,5 cm sta SOPRA la soglia dei 2 cm, quindi «indicativo» è la risposta giusta
  ok(terra.classeAccuratezza({ metodo: "RTK+GCP", gsd: 2.5 }).classe === "indicativo", "2,5 cm → indicativo");
  ok(terra.classeAccuratezza({ metodo: "RTK+GCP", gsd: 1.8 }).classe === "survey-grade", "1,8 cm → survey-grade");
});
test("il ponte Terra ↔ Conti non cambia di un decimale", () => {
  const rilievi = [{ data: "2026-03-10", stato: "elaborato", volumeM3: 4200.5, provenienza: "scavo" }];
  ok(conti.cavatoPeriodo(rilievi, "2026-01-01", "2026-12-31").m3 === 4200.5,
    "un volume con la virgola arriva intero in cavatoPeriodo");
  const senza = conti.vendutoPeriodo(
    [{ data: "2026-03-11", netto: 28.4, quantita: 28.4, unitaVendita: "t", densita: null, prezzoUnitario: 8.5 }],
    "2026-01-01", "2026-12-31");
  contiene(senza, { tSenzaDensita: 28.4, m3: 0, copertura: 0 },
    "e senza densità NON si converte: le tonnellate restano dichiarate a parte");
});

/* ══════════════════════════════════════════════════════════════════════
   PONTE P2 — CAMPO → TERRA: il dichiarato dei turni, e le tre cose che
   non deve poter diventare.
   ══════════════════════════════════════════════════════════════════════ */
test("P2: le tre unità di Campo non si trattano allo stesso modo", () => {
  const rapp = [
    { data: "2026-03-02", turno: "Mattina", prodQta: 1300, prodUnita: "t" },
    { data: "2026-03-03", turno: "Mattina", prodQta: 500,  prodUnita: "m³" },
    { data: "2026-03-04", turno: "Notte",   prodQta: 12,   prodUnita: "viaggi" },
  ];
  const d = terra.produzioneDichiarata(rapp, "2026-03-01", "2026-03-31", 2.6);
  /* 1300 t / 2,6 = 500 m³, più i 500 m³ dichiarati direttamente = 1000 */
  contiene(d, { m3: 1000, m3Diretti: 500, m3DaTonnellate: 500, t: 1300, viaggi: 12, turni: 3 },
    "tonnellate convertite con la densità, metri cubi sommati, viaggi contati a parte");
  ok(d.parziale === true, "con dei viaggi dentro il totale in m³ è per difetto, e lo dichiara");
  /* i VIAGGI non si convertono MAI: servirebbe la portata del mezzo, che
     cambia da camion a camion. Nessuna densità li fa entrare nei m³. */
  const soloViaggi = terra.produzioneDichiarata([rapp[2]], "2026-03-01", "2026-03-31", 2.6);
  contiene(soloViaggi, { m3: 0, viaggi: 12, turni: 1 }, "dodici viaggi non diventano metri cubi");
});
test("P2: senza densità le tonnellate NON si convertono e non si stimano", () => {
  const rapp = [{ data: "2026-03-02", prodQta: 1300, prodUnita: "t" }];
  const d = terra.produzioneDichiarata(rapp, "2026-03-01", "2026-03-31", null);
  contiene(d, { m3: 0, t: 1300, tSenzaDensita: 1300, densita: null, parziale: true },
    "le tonnellate restano dichiarate a parte, come nel ponte Terra ↔ Conti");
  /* e una densità impossibile non vale come densità */
  for (const cattiva of [0, -2.6, NaN, "due virgola sei", null, undefined]) {
    const x = terra.produzioneDichiarata(rapp, "2026-03-01", "2026-03-31", cattiva);
    ok(x.m3 === 0 && x.tSenzaDensita === 1300, `densità ${JSON.stringify(cattiva)}: non si converte`);
  }
});
test("P2: «non lo so» e «zero» restano due risposte diverse", () => {
  ok(terra.produzioneDichiarata(null, "2026-03-01", "2026-03-31", 2.6) === null,
    "rapportini assenti → null, non un totale di zero");
  ok(terra.misuratoPeriodo(null, "", "") === null, "rilievi assenti → null");
  const vuoto = terra.produzioneDichiarata([], "2026-03-01", "2026-03-31", 2.6);
  contiene(vuoto, { m3: 0, turni: 0 }, "nessun rapportino nel periodo → zero turni, non null");
  eq(terra.riconciliazioneTurni([], null, "2026-03-01", "2026-03-31", 2.6).stato, "no-campo",
    "Campo non raggiungibile: si dice, non si confronta");
  eq(terra.riconciliazioneTurni(null, [{ data: "2026-03-02", prodQta: 900, prodUnita: "m³" }],
    "2026-03-01", "2026-03-31", 2.6).stato, "no-misura",
    "se manca Terra il dichiarato da solo non è un confronto: si dice quale metà manca");
});
test("P2: il misurato conta solo i rilievi elaborati, e lo scavo separato dal cumulo", () => {
  const rilievi = [
    { data: "2026-03-05", stato: "elaborato",   volumeM3: 900, provenienza: "scavo" },
    { data: "2026-03-06", stato: "pianificato", volumeM3: 500, provenienza: "scavo" },
    { data: "2026-03-07", stato: "elaborato",   volumeM3: 200, provenienza: "cumulo" },
    { data: "2026-02-01", stato: "elaborato",   volumeM3: 700, provenienza: "scavo" },
  ];
  const m = terra.misuratoPeriodo(rilievi, "2026-03-01", "2026-03-31");
  contiene(m, { m3: 900, rilievi: 1, m3Cumulo: 200, rilieviCumulo: 1, pianificati: 1 },
    "un pianificato è un'intenzione, un cumulo non è roccia uscita dal fronte, febbraio è fuori periodo");
});
test("P2: il confronto dice sempre COME va letto il numero", () => {
  const mis = [{ data: "2026-03-05", stato: "elaborato", volumeM3: 1000, provenienza: "scavo" }];
  const dichiara = (m3) => [{ data: "2026-03-10", prodQta: m3, prodUnita: "m³" }];
  const stato = (m3) => terra.riconciliazioneTurni(mis, dichiara(m3), "2026-03-01", "2026-03-31", 2.6).stato;
  eq(stato(950), "coerente", "5% sotto: dentro la tolleranza di una stima a occhio");
  eq(stato(800), "attenzione", "20% sotto: conviene andare a guardare");
  eq(stato(500), "implausibile", "metà: non è imprecisione di stima");
  eq(stato(1200), "sopra-misura", "dichiarato più del misurato: o le stime sono gonfie o il rilievo non copre tutto");
  eq(terra.riconciliazioneTurni([], dichiara(900), "2026-03-01", "2026-03-31", 2.6).stato, "no-misura",
    "senza rilievo elaborato non c'è niente contro cui confrontare");
  eq(terra.riconciliazioneTurni(mis, [], "2026-03-01", "2026-03-31", 2.6).stato, "no-dichiarato",
    "nessun turno ha dichiarato: si dice");
  eq(terra.riconciliazioneTurni(mis, [{ data: "2026-03-10", prodQta: 30, prodUnita: "viaggi" }],
    "2026-03-01", "2026-03-31", 2.6).stato, "no-densita",
    "solo viaggi: niente di convertibile, quindi non si confronta");
  /* il SEGNO dello scostamento non si arrotonda via: senza verso non si sa da
     che parte cercare. È la stessa scelta del ponte Campo → Genesi. */
  const sopra = terra.riconciliazioneTurni(mis, dichiara(1200), "2026-03-01", "2026-03-31", 2.6);
  ok(sopra.scostamento === -200 && sopra.pct === -20, `il segno resta: ${sopra.scostamento} / ${sopra.pct}%`);
});
test("P2: la banda di coerenza vale nei DUE sensi", () => {
  /* Trovato guardando lo stato renderizzato: qualunque eccesso, anche dell'1%,
     diventava un allarme rosso. Ma se una stima a occhio può stare quindici punti
     SOTTO la misura senza che sia un problema, può stare quindici punti SOPRA per
     la stessa ragione — è la stessa imprecisione nell'altro verso. Un allarme che
     scatta su una differenza normale insegna a non guardarlo più, che è
     esattamente ciò che queste soglie dovevano evitare. */
  const mis = [{ data: "2026-03-05", stato: "elaborato", volumeM3: 1000, provenienza: "scavo" }];
  const r = (m3) => terra.riconciliazioneTurni(mis, [{ data: "2026-03-10", prodQta: m3, prodUnita: "m³" }],
    "2026-03-01", "2026-03-31", 2.6);
  for (const [m3, stato, verso] of [
    [1000, "coerente", "sotto"],
    [1050, "coerente", "sopra"],       // 5% in più: imprecisione normale
    [1140, "coerente", "sopra"],       // 14%: ancora dentro la banda
    [1160, "sopra-misura", "sopra"],   // 16%: oltre, e il verso cambia il significato
    [1500, "sopra-misura", "sopra"],
    [950,  "coerente", "sotto"],
    [800,  "attenzione", "sotto"],
    [500,  "implausibile", "sotto"],
  ]) {
    const x = r(m3);
    eq([x.stato, x.verso], [stato, verso], `${m3} m³ dichiarati contro 1000 misurati`);
  }
  /* `verso` è una parola perché il segno da solo si legge male: «−16%» non dice
     se è il dichiarato o il misurato a essere più alto. */
  ok(r(1160).scostamento < 0 && r(1160).verso === "sopra", "il segno e la parola concordano");
  ok(r(800).scostamento > 0 && r(800).verso === "sotto", "e anche nell'altro verso");
});
test("P2: senza rilievi il dichiarato NON si perde", () => {
  /* Guardato a schermo: la sezione diventava due note grigie che dicono «non
     posso», mentre in archivio c'erano quindici rapportini con la produzione.
     È il caso in cui quel dato vale PIÙ di tutti — una cava che non ha ancora
     fatto volare il drone non ha nessun'altra fonte. */
  const rapp = [
    { data: "2026-03-02", prodQta: 1900, prodUnita: "t" },
    { data: "2026-03-05", prodQta: 1900, prodUnita: "t" },
  ];
  ok(terra.avanzamentoDaUltimoRilievo([], rapp, 1.9, new Date("2026-03-10T09:00:00Z")) === null,
    "senza rilievi non c'è un «da quando»");
  /* ...ma la produzione dichiarata del periodo si legge comunque, ed è quello
     che la pagina mostra al posto della nota grigia */
  const d = terra.produzioneDichiarata(rapp, "2026-02-09", "2026-03-10", 1.9);
  ok(d && d.turni === 2 && d.m3 === 2000, `due turni, 2000 m³ (ottenuti ${d && d.m3})`);
});
test("P2: le soglie NON sono quelle del ponte Terra ↔ Conti, ed è voluto", () => {
  /* là si confrontano due misure (un rilievo e una pesa), qui una misura con una
     stima a occhio di fine turno: pretendere la stessa precisione farebbe
     suonare l'allarme su una differenza normale. */
  ok(terra.SOGLIA_TURNI.coerente > conti.SOGLIA_DIVARIO.coerente,
    `la banda del dichiarato (${terra.SOGLIA_TURNI.coerente}%) deve essere più larga di quella fra due misure (${conti.SOGLIA_DIVARIO.coerente}%)`);
  ok(terra.SOGLIA_TURNI.attenzione > conti.SOGLIA_DIVARIO.attenzione,
    "e lo stesso vale per la soglia dell'implausibile");
  /* la controprova: un 12% qui è coerente, là sarebbe già attenzione */
  const mis = [{ data: "2026-03-05", stato: "elaborato", volumeM3: 1000, provenienza: "scavo" }];
  eq(terra.riconciliazioneTurni(mis, [{ data: "2026-03-10", prodQta: 880, prodUnita: "m³" }],
    "2026-03-01", "2026-03-31", 2.6).stato, "coerente", "12% di scostamento su una stima è normale");
});
test("P2: la stima corrente riempie SOLO il buco fra due voli del drone", () => {
  const rilievi = [{ data: "2026-03-10", stato: "elaborato", volumeM3: 5000, provenienza: "scavo" }];
  const rapp = [
    { data: "2026-03-09", prodQta: 400, prodUnita: "m³" },   // PRIMA del rilievo: già misurato
    { data: "2026-03-11", prodQta: 300, prodUnita: "m³" },
    { data: "2026-03-12", prodQta: 250, prodUnita: "m³" },
  ];
  const a = terra.avanzamentoDaUltimoRilievo(rilievi, rapp, 2.6, new Date("2026-03-13T09:00:00Z"));
  contiene(a, { dal: "2026-03-11", al: "2026-03-13", giorni: 3, dallUltimoRilievo: "2026-03-10" },
    "si parte dal giorno DOPO l'ultimo rilievo");
  ok(a.dich.m3 === 550, `solo i turni successivi al rilievo: 550, non 950 (ottenuti ${a.dich.m3})`);
  /* senza un rilievo da cui partire non è un avanzamento, è solo una somma */
  ok(terra.avanzamentoDaUltimoRilievo([], rapp, 2.6, new Date("2026-03-13T09:00:00Z")) === null,
    "nessun rilievo elaborato → null");
  ok(terra.avanzamentoDaUltimoRilievo([{ data: "2026-03-13", stato: "elaborato", volumeM3: 10 }],
    rapp, 2.6, new Date("2026-03-13T09:00:00Z")) === null,
    "rilievo di oggi: nessun buco da riempire");
});
test("P2: la tendina del periodo offre i confini dei voli, non date libere", () => {
  /* Una data libera permetterebbe di chiedere un periodo che non corrisponde a
     nessuna misura, e il numero che ne esce sarebbe uno scostamento nato solo
     dalle date. Meglio togliere la possibilità di fare la domanda sbagliata che
     spiegare dopo perché la risposta non vale. */
  const R = [
    { data: "2025-11-20", stato: "elaborato", volumeM3: 22000, provenienza: "scavo" },
    { data: "2026-05-15", stato: "elaborato", volumeM3: 20100, provenienza: "scavo" },
    { data: "2026-06-16", stato: "elaborato", volumeM3: 21300, provenienza: "scavo" },
    { data: "2026-06-25", stato: "elaborato", volumeM3: 5200,  provenienza: "cumulo" },
    { data: "2026-08-01", stato: "pianificato", volumeM3: null },
  ];
  const l = terra.intervalliFraRilievi(R);
  eq(l.length, 2, "tre voli di scavo fanno due intervalli");
  contiene(l[0], { dal: "2026-05-16", al: "2026-06-16", rilievoPrecedente: "2026-05-15" },
    "il più recente per primo, e si parte dal giorno DOPO il volo precedente");
  contiene(l[1], { dal: "2025-11-21", al: "2026-05-15" }, "poi quello prima");
  ok(!l.some((i) => i.al === "2026-06-25"), "una ripresa da cumulo non è un confine");
  ok(!l.some((i) => i.al === "2026-08-01"), "e un rilievo pianificato nemmeno");
  eq(terra.intervalliFraRilievi([R[0]]), [], "con un volo solo non c'è nessun intervallo");
  eq(terra.intervalliFraRilievi(null), [], "rilievi assenti → lista vuota, non un errore");
  /* il periodo naturale è il primo della lista: una sola verità, due nomi */
  contiene(terra.periodoFraUltimiRilievi(R), l[0], "il periodo naturale è l'intervallo più recente");
});
test("P2: il periodo del confronto è fra due voli, non un mese di calendario", () => {
  /* il volume di un rilievo è l'accumulo dall'ultimo volo: confrontarlo con un
     mese qualsiasi legge uno scostamento che nasce solo dalle date. */
  const R = [
    { data: "2026-07-01", stato: "elaborato", volumeM3: 18600, provenienza: "scavo" },
    { data: "2026-07-15", stato: "elaborato", volumeM3: 19400, provenienza: "scavo" },
    { data: "2026-08-01", stato: "pianificato", volumeM3: null },
  ];
  contiene(terra.periodoFraUltimiRilievi(R),
    { dal: "2026-07-02", al: "2026-07-15", rilievoPrecedente: "2026-07-01" },
    "si parte dal giorno DOPO il penultimo: quel giorno è già dentro la misura precedente");
  ok(terra.periodoFraUltimiRilievi([R[1]]) === null, "con un rilievo solo non c'è intervallo");
  ok(terra.periodoFraUltimiRilievi(null) === null, "rilievi assenti → null");
  /* un CUMULO non è un volo di scavo e non fa periodo */
  ok(terra.periodoFraUltimiRilievi([R[1], { data: "2026-07-20", stato: "elaborato", volumeM3: 500, provenienza: "cumulo" }]) === null,
    "una ripresa da cumulo non conta come rilievo di scavo");
  /* due rilievi nello STESSO giorno non fanno un intervallo */
  ok(terra.periodoFraUltimiRilievi([
    { data: "2026-07-15", stato: "elaborato", volumeM3: 100, provenienza: "scavo" },
    { data: "2026-07-15", stato: "elaborato", volumeM3: 200, provenienza: "scavo" }]) === null,
    "due rilievi dello stesso giorno: nessun intervallo fra cui confrontare");
});
test("P2: la dimostrazione di Terra è coerente coi suoi rilievi", () => {
  /* Se i numeri d'esempio non si parlano, la prima cosa che il fondatore vede è
     un allarme rosso che non significa niente. La densità è quella del
     materiale scritto nell'autorizzazione (sabbia e ghiaia, 1,9 t/m³). */
  const per = terra.periodoFraUltimiRilievi(terra.DEMO.rilievi);
  ok(per != null, "la dimostrazione ha almeno due rilievi di scavo");
  const dens = terra.presetDensita("sabbia-ghiaia").densita;
  const r = terra.riconciliazioneTurni(terra.DEMO.rilievi, terra.DEMO.rapportiniCampo, per.dal, per.al, dens);
  eq(r.stato, "coerente", "coi numeri d'esempio i due mondi si parlano");
  ok(Math.abs(r.pct) < 5, `e lo scostamento è piccolo (${r.pct}%)`);
  /* e la stima corrente ha qualcosa da dire, viaggi compresi */
  const a = terra.avanzamentoDaUltimoRilievo(terra.DEMO.rilievi, terra.DEMO.rapportiniCampo, dens,
    new Date("2026-07-30T09:00:00Z"));
  ok(a && a.dich.turni > 0 && a.dich.viaggi > 0,
    "la dimostrazione mostra sia i metri cubi stimati sia i viaggi che non si convertono");
});
test("P2 · LA GUARDIA: il dichiarato non può diventare un rilievo", () => {
  /* È il difetto peggiore che questo ponte poteva introdurre, per tre ragioni:
     i rilievi consumano il volume CONCESSO, finiscono nel riepilogo annuale che
     va agli ENTI, e portano metodo e GSD che li rendono difendibili in audit.
     Un conteggio di viaggi dichiarato da un preposto non ha niente di tutto
     questo. Qui si verifica che nessuna funzione del ponte produca un record
     che i lettori dei rilievi possano prendere per una misura. */
  const rapp = [{ data: "2026-03-11", prodQta: 900, prodUnita: "m³" }];
  const rilievi = [{ id: "r1", fronteId: "f1", data: "2026-03-05", stato: "elaborato", volumeM3: 1000, provenienza: "scavo" }];
  const esiti = [
    terra.produzioneDichiarata(rapp, "2026-03-01", "2026-03-31", 2.6),
    terra.riconciliazioneTurni(rilievi, rapp, "2026-03-01", "2026-03-31", 2.6),
    terra.avanzamentoDaUltimoRilievo(rilievi, rapp, 2.6, new Date("2026-03-13T09:00:00Z")),
  ];
  const testo = JSON.stringify(esiti);
  ok(!/"stato":"elaborato"/.test(testo.replace(/"stato":"(no-|coerente|attenzione|implausibile|sopra-misura)[^"]*"/g, "")),
    "nessun esito del ponte porta lo stato che rende un rilievo una misura");
  ok(!/"volumeM3"/.test(testo), "e nessuno porta il campo volumeM3: non somiglia a un rilievo");
  /* e la prova che conta: i lettori dei rilievi NON vedono il dichiarato */
  const prima = terra.volumeFronte(rilievi, "f1");
  const conPonte = terra.volumeFronte(rilievi.concat([]), "f1");
  ok(prima === 1000 && conPonte === 1000, "il volume del fronte resta quello misurato");
  const est = terra.estrattoComplessivo(rilievi, { volumeAutorizzatoM3: 100000 });
  ok(est.rilevato === 1000 && est.totale === 1000,
    `il volume concesso lo consuma solo il misurato (rilevato ${est.rilevato}, totale ${est.totale})`);
  /* e il riepilogo che va agli ENTI non conosce il dichiarato: si conta quante
     volte compare nel documento, e deve essere zero. */
  const rie = terra.riepilogoAnnuale(rilievi, 2026, { volumeAutorizzatoM3: 100000 }, new Date("2026-12-31T00:00:00Z"));
  ok(!JSON.stringify(rie).includes("dichiarat"),
    "il riepilogo annuale per gli enti non porta nessun numero dichiarato");
});
/* ══════════════════════════════════════════════════════════════════════
   PONTE P3 · CAMPO ↔ SCUDO — «chi è in turno è in regola?»
   ══════════════════════════════════════════════════════════════════════
   La regola più delicata scritta finora, perché una risposta sbagliata qui è
   peggio di nessuna risposta: chi non sa, controlla; chi crede di sapere, no. */
test("P3 · NON si accoppia per nome, mai", () => {
  /* la prova che conta più di tutte. Nei dati di esempio Campo aveva un «Marco
     Rossi» e Scudo un «Mario Rossi», Campo un'«Anna Conti» e Scudo un'«Anna Neri»
     e una «Sara Conti»: un accoppiamento per nome — anche «intelligente» —
     avrebbe dichiarato in regola una persona guardando i documenti di un'altra. */
  const lavoratori = [{ id: "d1", nome: "Mario Rossi", attivo: true }];
  const scadenze = [{ id: "s1", lavoratoreId: "d1", tipo: "Visita medica", dataScadenza: "2020-01-01" }];
  const omonimo = { id: "o1", nome: "Mario Rossi" };          // stesso nome, nessun id
  const r = ponti.idoneitaOperatore(omonimo, lavoratori, scadenze, new Date("2026-07-30"));
  ok(r.stato === "non-collegato",
    `stesso nome identico ma nessun collegamento: la risposta è «non lo so», non «scaduta» (${r.stato})`);
  ok(r.lavoratore === null, "e non si restituisce il lavoratore trovato per nome");
  /* e il caso opposto: nomi diversi ma id giusto → si guarda l'id */
  const r2 = ponti.idoneitaOperatore({ id: "o1", nome: "Tutt'altro Nome", lavoratoreId: "d1" },
    lavoratori, scadenze, new Date("2026-07-30"));
  ok(r2.stato === "scaduta", "col collegamento giusto si legge il documento, qualunque nome ci sia scritto");
});
test("P3 · i cinque stati, e nessuno che finge di sapere", () => {
  const oggi = new Date("2026-07-30T00:00:00");
  const lav = [{ id: "d1", nome: "A" }, { id: "d2", nome: "B" }, { id: "d3", nome: "C" }];
  const sca = [
    { lavoratoreId: "d1", tipo: "Visita medica", dataScadenza: "2026-07-02" },  // scaduta
    { lavoratoreId: "d1", tipo: "Patente", dataScadenza: "2028-05-30" },
    { lavoratoreId: "d2", tipo: "Formazione", dataScadenza: "2026-08-09" },     // entro 30 giorni
    { lavoratoreId: "d3", tipo: "Patente", dataScadenza: "2027-01-01" },        // lontana
  ];
  const st = (o) => ponti.idoneitaOperatore(o, lav, sca, oggi).stato;
  ok(st({ lavoratoreId: "d1" }) === "scaduta", "un documento scaduto vince su quelli validi");
  ok(st({ lavoratoreId: "d2" }) === "in-scadenza", "entro trenta giorni: in scadenza");
  ok(st({ lavoratoreId: "d3" }) === "regolare", "tutto valido: regolare");
  ok(st({ lavoratoreId: "d9" }) === "collegamento-rotto", "id che non esiste più in Scudo");
  ok(st({}) === "non-collegato", "senza id non si indovina");
  /* collegato ma senza nessun documento registrato: NON è «regolare», è un'altra
     cosa — in Scudo non c'è niente da controllare, e dirlo è diverso dal dire
     che è tutto a posto */
  const solo = ponti.idoneitaOperatore({ lavoratoreId: "d1" }, lav, [], oggi);
  ok(solo.stato === "senza-scadenze", "collegato ma senza documenti: si dice, non si assume");
});
test("P3 · il riepilogo del turno non trasforma un «non lo so» in un «sì»", () => {
  const oggi = new Date("2026-07-30T00:00:00");
  const lav = [{ id: "d1", nome: "A" }];
  const sca = [{ lavoratoreId: "d1", tipo: "Patente", dataScadenza: "2028-01-01" }];
  const q = ponti.idoneitaDiTurno(
    [{ id: "o1", lavoratoreId: "d1" }, { id: "o2" }], lav, sca, oggi);
  ok(q.regolari === 1 && q.nonCollegati === 1, "i due conti restano separati");
  /* e i DUE modi di non sapere restano distinti: «non collegato» è un lavoro non
     fatto, «collegamento rotto» è un dato da riparare. Il riepilogo che li chiamava
     entrambi «non collegate» diceva una cosa falsa della seconda. */
  ok(q.senzaCollegamento === 1 && q.collegamentiRotti === 0, "qui manca il collegamento, non è rotto");
  const rotto = ponti.idoneitaDiTurno([{ id: "o1", lavoratoreId: "d9" }], lav, sca, oggi);
  ok(rotto.collegamentiRotti === 1 && rotto.senzaCollegamento === 0,
    "un id che non esiste più è un collegamento ROTTO, non un collegamento assente");
  ok(rotto.nonCollegati === 1, "e la somma dei due resta il conto complessivo dei «non lo so»");
  ok(q.tuttoInRegola === false,
    "con una persona di cui non si sa niente, «tutto in regola» è FALSO");
  const tutti = ponti.idoneitaDiTurno([{ id: "o1", lavoratoreId: "d1" }], lav, sca, oggi);
  ok(tutti.tuttoInRegola === true, "se si sa tutto e va tutto bene, allora sì");
  ok(ponti.idoneitaDiTurno([], lav, sca, oggi).tuttoInRegola === false,
    "nessuno in elenco non è «tutto in regola»: è niente da dire");
  eq(ponti.idoneitaDiTurno(null, null, null, oggi).righe, [], "dati assenti: nessun errore");
});
test("P3 · UNA SOLA implementazione della soglia: Scudo ri-esporta, non riscrive", () => {
  /* la regola di ieri, applicata: `terra.X === ponti.X`. Qui vale per Scudo e per
     Campo, e si pretende l'IDENTITÀ, non il comportamento — due copie uguali oggi
     divergono domani senza che nessuno lo veda. */
  ok(scudo.statoScadenza === ponti.statoScadenzaHSE,
    "scudo.statoScadenza è la funzione di shared/, non una copia");
  ok(campo.idoneitaDiTurno === ponti.idoneitaDiTurno, "e Campo ri-esporta la stessa");
  ok(campo.idoneitaOperatore === ponti.idoneitaOperatore, "idem per il singolo operatore");
  ok(campo.statoScadenzaHSE === ponti.statoScadenzaHSE, "idem per la soglia");
});
test("P3 · le due dimostrazioni non si smentiscono a vicenda", () => {
  /* Campo porta una copia dei lavoratori e delle scadenze di Scudo per far vedere
     il ponte anche senza backend. Se quelle copie divergessero, la dimostrazione
     dell'ecosistema direbbe due cose diverse sulla stessa persona — ed è proprio
     ciò che il ponte serve a evitare. */
  const perId = new Map(scudo.DEMO.lavoratori.map(l => [l.id, l]));
  for (const l of campo.DEMO.lavoratoriScudo) {
    const vero = perId.get(l.id);
    ok(vero, `il lavoratore ${l.id} della copia di Campo esiste in Scudo`);
    if (vero) ok(vero.nome === l.nome, `e si chiama allo stesso modo (${l.nome} / ${vero && vero.nome})`);
  }
  /* la chiave (lavoratore + tipo) NON è univoca: in Scudo d3 ha due «Formazione»,
     e la prima versione di questa prova le confondeva accusando i dati di essere
     divergenti quando l'errore era suo. Si verifica quindi l'APPARTENENZA: ogni
     riga della copia di Campo deve esistere in Scudo con la stessa data. */
  const scaScudo = new Set(scudo.DEMO.scadenze.map(s => s.lavoratoreId + "|" + s.tipo + "|" + s.dataScadenza));
  for (const s of campo.DEMO.scadenzeScudo) {
    ok(scaScudo.has(s.lavoratoreId + "|" + s.tipo + "|" + s.dataScadenza),
      `la scadenza «${s.tipo} ${s.dataScadenza}» di ${s.lavoratoreId} esiste identica in Scudo`);
  }
  /* e gli operatori di Campo puntano a lavoratori che esistono */
  for (const o of campo.DEMO.operatori) {
    if (!o.lavoratoreId) continue;
    ok(perId.has(o.lavoratoreId), `l'operatore ${o.nome} punta a un lavoratore vero (${o.lavoratoreId})`);
    ok(perId.get(o.lavoratoreId).nome === o.nome,
      `e allo stesso nome: ${o.nome} / ${perId.get(o.lavoratoreId).nome}`);
  }
});
/* ── P3, l'altra metà: dal lato di SCUDO ────────────────────────────────── */
test("P3 · «sta lavorando adesso» = in forza IN UNA SQUADRA OPERATIVA", () => {
  const squadre = [
    { nome: "Squadra A — Perforazione", stato: "operativa" },
    { nome: "Squadra C — Impianto", stato: "ferma" },
  ];
  const oper = [
    { id: "o1", nome: "A", squadra: "Squadra A", stato: "in-forza" },
    { id: "o2", nome: "B", squadra: "Squadra A", stato: "non-disponibile" },
    { id: "o3", nome: "C", squadra: "Squadra C", stato: "in-forza" },
    { id: "o4", nome: "D", squadra: "Squadra Z", stato: "in-forza" },
  ];
  eq(ponti.inTurnoOggi(oper, squadre).map(o => o.id), ["o1"],
    "in forza in una squadra operativa: solo lui");
  /* IL NOME DELLA SQUADRA PORTA LA SPECIALITÀ dopo un trattino («Squadra A —
     Perforazione») mentre l'operatore ne tiene solo la prima parte. Senza
     riconoscerlo NESSUNO risulterebbe mai in turno — e il ponte direbbe che non
     lavora nessuno: l'errore silenzioso e rassicurante, il peggiore di tutti. */
  ok(ponti.inTurnoOggi([{ id: "x", squadra: "Squadra A", stato: "in-forza" }],
    [{ nome: "Squadra A — Perforazione", stato: "operativa" }]).length === 1,
    "«Squadra A» e «Squadra A — Perforazione» sono la stessa squadra");
  eq(ponti.inTurnoOggi(null, null), [], "dati assenti: nessuno, e nessun errore");
  eq(ponti.inTurnoOggi(oper, []), [], "nessuna squadra registrata: nessuno in turno");
});
test("P3 · lo scadenzario ordina per urgenza, e a parità viene prima chi è in turno", () => {
  const oggi = new Date("2026-07-30T00:00:00");
  const lav = [{ id: "d1", nome: "In turno" }, { id: "d2", nome: "A casa" }];
  const oper = [{ id: "o1", lavoratoreId: "d1", squadra: "Squadra A", stato: "in-forza" }];
  const squ = [{ nome: "Squadra A", stato: "operativa" }];
  const sca = [
    { id: "s1", lavoratoreId: "d2", tipo: "Visita", dataScadenza: "2026-07-01" }, // scaduta, a casa
    { id: "s2", lavoratoreId: "d1", tipo: "Visita", dataScadenza: "2026-07-01" }, // scaduta, in turno
    { id: "s3", lavoratoreId: "d1", tipo: "Corso", dataScadenza: "2027-01-01" },  // regolare
  ];
  const q = ponti.scadenzeDiChiLavora(sca, lav, oper, squ, oggi);
  eq(q.righe.map(r => r.scadenza.id), ["s2", "s1", "s3"],
    "prima le scadute, e fra due scadute uguali prima quella di chi è in turno");
  ok(q.daFermare === 1, "una sola riguarda chi sta lavorando adesso");
  ok(q.schierati === 1 && q.schieratiNonCollegati === 0, "e si sa di chi si sta parlando");
});
test("P3 · «nessuno da fermare» non vale se non si è guardato", () => {
  const oggi = new Date("2026-07-30T00:00:00");
  /* una persona schierata SENZA collegamento: il conto delle scadute in turno è
     zero, ma non perché sia tutto a posto — perché non si è potuto guardare.
     Il numero che lo dice esiste apposta. */
  const q = ponti.scadenzeDiChiLavora(
    [{ lavoratoreId: "d1", tipo: "Visita", dataScadenza: "2026-01-01" }],
    [{ id: "d1", nome: "X" }],
    [{ id: "o1", squadra: "Squadra A", stato: "in-forza" }],   // senza lavoratoreId
    [{ nome: "Squadra A", stato: "operativa" }], oggi);
  ok(q.daFermare === 0, "nessuna scaduta risulta in turno…");
  ok(q.schierati === 1 && q.schieratiNonCollegati === 1,
    "…ma c'è una persona schierata di cui non si sa niente, e il conto lo dice");
});
test("P3 · lato Scudo: la dimostrazione dice la stessa cosa dell'altra metà", () => {
  const oggi = new Date("2026-07-30T00:00:00");
  const q = scudo.scadenzeDiChiLavora(scudo.DEMO.scadenze, scudo.DEMO.lavoratori,
    scudo.DEMO.operatoriCampo, scudo.DEMO.squadreCampo, oggi);
  ok(q.schierati === 4, `quattro persone in turno nella dimostrazione (${q.schierati})`);
  ok(q.daFermare >= 1, "e almeno un documento scaduto le riguarda, se no non si vedrebbe niente");
  /* la copia che Scudo tiene di Campo deve coincidere con l'originale, altrimenti
     le due app raccontano due turni diversi */
  eq(scudo.DEMO.operatoriCampo.map(o => o.id + "|" + o.nome + "|" + (o.lavoratoreId || "")),
     campo.DEMO.operatori.map(o => o.id + "|" + o.nome + "|" + (o.lavoratoreId || "")),
     "gli operatori copiati in Scudo sono identici a quelli di Campo");
  eq(scudo.DEMO.squadreCampo.map(s => s.nome + "|" + s.stato),
     campo.DEMO.squadre.map(s => s.nome + "|" + s.stato),
     "e così le squadre, stato compreso");
  ok(scudo.inTurnoOggi === ponti.inTurnoOggi && scudo.scadenzeDiChiLavora === ponti.scadenzeDiChiLavora,
    "Scudo ri-esporta le funzioni di shared/, non ne tiene una copia");
});
test("Campo · le attività citano operatori che esistono davvero", () => {
  /* NASCE DA UN DIFETTO MIO, di un'ora prima: rinominando gli operatori della
     dimostrazione per allinearli a Scudo ho lasciato indietro le attività, che
     citavano ancora «Marco Rossi» e «Luca Ferrari». Campo lega l'attività alla
     persona PER NOME (`a.operatore === o.nome`), quindi il conto «N in carico
     oggi» era diventato zero per tutti — in silenzio, senza errori, e non l'ho
     visto nello screenshot perché il conto semplicemente spariva.
     Nota per il futuro: il legame interno per nome è fragile per la stessa ragione
     per cui il ponte con Scudo non lo usa. Qui però la stringa la scrive l'utente
     nel campo «operatore», e cambiarla in un id è un lavoro a parte: intanto la
     dimostrazione resta coerente per forza. */
  const nomi = new Set(campo.DEMO.operatori.map(o => String(o.nome).trim()));
  const orfane = campo.DEMO.attivita.filter(a => a.operatore && !nomi.has(String(a.operatore).trim()));
  ok(orfane.length === 0,
    `nessuna attività cita una persona fuori anagrafica (${orfane.map(a => a.operatore).join(", ")})`);
  /* e almeno una la cita, altrimenti la prova passerebbe su un elenco vuoto —
     è la trappola del `[].every` già pestata due volte */
  ok(campo.DEMO.attivita.some(a => a.operatore), "e almeno un'attività ha un operatore, se no non si prova niente");
});
test("P3 · la dimostrazione mostra TUTTI gli stati, altrimenti non dimostra", () => {
  const q = campo.idoneitaDiTurno(campo.DEMO.operatori, campo.DEMO.lavoratoriScudo,
    campo.DEMO.scadenzeScudo, new Date("2026-07-30T00:00:00"));
  ok(q.scadute > 0, "c'è almeno un documento scaduto da far vedere");
  ok(q.inScadenza > 0, "e almeno uno in scadenza");
  ok(q.regolari > 0, "e almeno una persona in regola");
  ok(q.nonCollegati > 0, "e almeno una non collegata: è lo stato che si dimentica");
  ok(q.tuttoInRegola === false, "quindi la dimostrazione non dice «tutto a posto»");
});

/* ══════════════════════════════════════════════════════════════════════
   TERRA · LA RIPARTIZIONE PER FRONTE, che è una REGOLA e non un disegno
   ══════════════════════════════════════════════════════════════════════
   Nata guardando la sezione renderizzata, non leggendo il codice. Due difetti
   che i numeri non mostravano:
    · una voce SENZA fronte e SENZA scavo prendeva una riga con badge «0 m³» e
      sembrava rotta. Non è un fronte mancante: è una ripresa da cumulo, che per
      definizione non esce da un fronte;
    · mancava la QUOTA, l'unico numero che un elenco di valori assoluti non dà. */
test("Terra · ripartizione per fronte: una ripresa da cumulo non è un fronte", () => {
  const R = {
    scavo: 79400,
    fronti: [
      { fronteId: "f1", scavo: 40700, cumulo: 0, rilievi: 2 },
      { fronteId: "f2", scavo: 38700, cumulo: 0, rilievi: 2 },
      { fronteId: null, scavo: 0, cumulo: 5200, rilievi: 1 },
    ],
  };
  const RF = terra.ripartizioneFronti(R);
  eq(RF.righe.map(r => r.fronteId), ["f1", "f2"], "la voce di solo cumulo esce dall'elenco");
  ok(RF.cumuliFuori === 5200, "e il suo volume torna a parte, per dirlo a parole");
  ok(RF.conCumuliInRiga === false, "nessuna riga porta cumuli: la nota non deve rimandarci");
  ok(RF.senzaFronte === 0, "e non c'è scavo da attribuire");
});
test("Terra · ripartizione per fronte: uno scavo senza fronte invece RESTA", () => {
  /* è il caso opposto e va distinto: qui manca davvero la ripartizione, ed è
     quella che il modulo dell'ente chiede */
  const R = {
    scavo: 59300,
    fronti: [
      { fronteId: "f1", scavo: 40700, cumulo: 0, rilievi: 2 },
      { fronteId: null, scavo: 18600, cumulo: 5200, rilievi: 2 },
    ],
  };
  const RF = terra.ripartizioneFronti(R);
  ok(RF.righe.length === 2, "la voce senza fronte ma con scavo resta in elenco");
  ok(RF.righe[1].senzaFronte === true, "ed è marcata come tale");
  ok(RF.cumuliFuori === 0, "i suoi cumuli non finiscono fuori: la riga c'è e li porta");
  ok(RF.conCumuliInRiga === true, "e la nota può rimandare alla riga");
  ok(RF.senzaFronte === 1, "c'è uno scavo da attribuire");
});
test("Terra · ripartizione per fronte: la quota, e quando non si può dare", () => {
  const R = { scavo: 79400, fronti: [
    { fronteId: "f1", scavo: 40700, cumulo: 0, rilievi: 2 },
    { fronteId: "f2", scavo: 38700, cumulo: 0, rilievi: 2 }] };
  const q = terra.ripartizioneFronti(R).righe.map(r => r.quotaPct);
  eq(q, [51.3, 48.7], "una cifra decimale, come il resto della denuncia");
  ok(Math.abs(q[0] + q[1] - 100) < 0.11, "e le quote fanno cento");
  /* su un totale zero la quota NON è zero: è una domanda senza senso, e un «0%»
     scritto accanto a un fronte direbbe una cosa falsa */
  const zero = terra.ripartizioneFronti({ scavo: 0, fronti: [{ fronteId: "f1", scavo: 0, cumulo: 0, rilievi: 1 }] });
  ok(zero.righe[0].quotaPct === null, "totale zero: nessuna quota, non «0%»");
  /* un fronte a zero dentro un anno che ha scavato: stessa risposta, per la stessa
     ragione — quel fronte non ha una quota, non ne ha una pari a zero */
  const misto = terra.ripartizioneFronti({ scavo: 1000, fronti: [
    { fronteId: "f1", scavo: 1000, cumulo: 0, rilievi: 1 },
    { fronteId: "f2", scavo: 0, cumulo: 0, rilievi: 1 }] });
  ok(misto.righe[1].quotaPct === null, "fronte senza scavo: nessuna quota");
  ok(misto.righe[0].quotaPct === 100, "e chi ha scavato tutto ha il cento per cento");
});
test("Terra · ripartizione per fronte: niente dati, niente errori", () => {
  eq(terra.ripartizioneFronti({ scavo: 0, fronti: [] }).righe, [], "elenco vuoto");
  eq(terra.ripartizioneFronti(null).righe, [], "riepilogo assente: non un errore");
  eq(terra.ripartizioneFronti({}).righe, [], "riepilogo senza fronti: non un errore");
  ok(terra.ripartizioneFronti(null).cumuliFuori === 0, "e nessun cumulo da dichiarare");
});
test("Terra · ripartizione per fronte: la controprova — prima usciva la riga rotta", () => {
  /* la versione di prima: tutte le voci in elenco, badge = scavo. Si rifà qui per
     mostrare che il difetto c'era davvero, e che la correzione lo toglie. Senza
     questo passaggio le prove qui sopra direbbero solo che la funzione fa quello
     che ho scritto io. */
  const fronti = [
    { fronteId: "f1", scavo: 40700, cumulo: 0, rilievi: 2 },
    { fronteId: null, scavo: 0, cumulo: 5200, rilievi: 1 },
  ];
  const vecchio = fronti.map(f => ({ nome: f.fronteId || "Senza fronte indicato", badge: f.scavo }));
  ok(vecchio.length === 2 && vecchio[1].badge === 0,
    "prima la ripresa da cumulo era una riga con badge «0 m³»");
  const RF = terra.ripartizioneFronti({ scavo: 40700, fronti });
  ok(RF.righe.length === 1, "adesso quella riga non c'è più");
  ok(RF.cumuliFuori === 5200, "e il suo volume non è andato perso: è nella nota");
});
test("Terra · ripartizione per fronte: la dimostrazione la esercita davvero", () => {
  /* una prova su dati inventati direbbe solo che la funzione fa quello che ho
     scritto. Questa passa dal riepilogo VERO della dimostrazione, dove c'è una
     ripresa da cumulo senza fronte: se un giorno sparisse dai dati finti, il caso
     che ha originato la correzione smetterebbe di essere coperto e nessuno lo
     saprebbe. */
  const R = terra.riepilogoAnnuale(terra.DEMO.rilievi, 2026,
    terra.DEMO.autorizzazioni[0], new Date("2026-07-30T00:00:00Z"));
  const RF = terra.ripartizioneFronti(R);
  ok(RF.cumuliFuori > 0,
    `la dimostrazione contiene una ripresa da cumulo senza fronte (${RF.cumuliFuori} m³)`);
  ok(RF.righe.length > 0 && RF.righe.every(r => r.fronteId),
    "e in elenco restano solo fronti veri");
  ok(RF.righe.every(r => r.quotaPct > 0), "tutti con la loro quota");
});
test("P2 · il grafico: la dimostrazione racconta una storia, e un buco", () => {
  /* Il grafico esiste per una domanda che il confronto di un periodo alla volta
     non poteva rispondere: «le stime dei turni stanno migliorando o
     peggiorando?». Se nella dimostrazione lo scarto fosse uguale in tutti gli
     intervalli, il grafico non mostrerebbe niente e la domanda resterebbe senza
     risposta anche con lui. */
  const iv = terra.intervalliFraRilievi(terra.DEMO.rilievi).slice().reverse();
  const scarti = [];
  let buchi = 0;
  for (const i of iv) {
    const m = terra.misuratoPeriodo(terra.DEMO.rilievi, i.dal, i.al);
    const d = terra.produzioneDichiarata(terra.DEMO.rapportiniCampo, i.dal, i.al, 1.9);
    if (!d || !d.turni || !(d.m3 > 0)) { buchi++; continue; }
    scarti.push(Math.round(100 * (m.m3 - d.m3) / m.m3 * 100) / 100);
  }
  ok(scarti.length >= 3, `servono almeno tre punti per vedere un andamento (ce ne sono ${scarti.length})`);
  /* e devono MIGLIORARE, cioè avvicinarsi a zero: è la storia che il grafico
     racconta, e va vista nei numeri prima che a schermo */
  for (let k = 1; k < scarti.length; k++) {
    ok(Math.abs(scarti[k]) < Math.abs(scarti[k - 1]),
      `lo scarto deve stringersi: ${scarti.join(" → ")}`);
  }
  ok(buchi >= 1, "e resta almeno un intervallo senza rapportini, per far vedere il BUCO");
  /* il buco NON è uno zero: la produzione dichiarata di quell'intervallo è
     assente, non nulla — la differenza è tutto il punto */
  const vecchio = iv[0];
  const d0 = terra.produzioneDichiarata(terra.DEMO.rapportiniCampo, vecchio.dal, vecchio.al, 1.9);
  ok(d0 !== null && d0.turni === 0, "nell'intervallo più vecchio non ci sono turni, e il lettore lo dice");
});
test("P2 · lato CAMPO: la dimostrazione di Campo è coerente coi rilievi finti", () => {
  /* Chi compila il rapportino deve vedere l'esito della propria stima. Se i
     numeri d'esempio non si parlano, la prima cosa che si vede è un avviso che
     non significa niente. */
  const per = ponti.periodoFraUltimiRilievi(campo.DEMO.rilieviTerra);
  ok(per != null, "la dimostrazione di Campo ha due rilievi di Terra");
  const vig = campo.DEMO.autorizzazioniTerra.find((a) => a.stato === "vigente");
  const d = ponti.densitaDelMateriale(vig && vig.materiale);
  ok(d && d.densita === 1.9, `la densità si ricava dal materiale dell'atto (${d && d.densita})`);
  const r = ponti.riconciliazioneTurni(campo.DEMO.rilieviTerra, campo.DEMO.rapportini, per.dal, per.al, d.densita);
  eq(r.stato, "coerente", "coi numeri d'esempio i due mondi si parlano");
  ok(Math.abs(r.pct) > 0.5 && Math.abs(r.pct) < 10,
    `e lo scostamento non è ZERO — uno scarto nullo in dimostrazione sembra costruito (${r.pct}%)`);
  ok(r.dich.turni >= 5, `e ci sono abbastanza turni nel periodo (${r.dich.turni})`);
});
test("P2 · «coerente» e «parziale» insieme: la combinazione che inganna", () => {
  /* Trovato guardando lo stato a schermo: con dei viaggi nel periodo il confronto
     diceva «i due numeri si parlano» e in coda ammetteva che i viaggi non erano nel
     conto. Ma se quei viaggi fossero contati il dichiarato salirebbe, e l'accordo
     apparente potrebbe sparire — dichiarare un accordo basandosi su metà dei dati è
     il numero comodo, che qui non si prende mai.
     Questa prova esiste perché la combinazione sia DOCUMENTATA: `stato: "coerente"`
     e `parziale: true` possono presentarsi insieme, e chi scrive un'interfaccia
     sopra `riconciliazioneTurni` deve guardare entrambi. */
  const mis = [{ data: "2026-03-05", stato: "elaborato", volumeM3: 1000, provenienza: "scavo" }];
  const r = terra.riconciliazioneTurni(mis, [
    { data: "2026-03-10", prodQta: 980, prodUnita: "m³" },
    { data: "2026-03-11", prodQta: 14, prodUnita: "viaggi" },
  ], "2026-03-01", "2026-03-31", 2.6);
  eq(r.stato, "coerente", "sui soli metri cubi lo scarto è del 2%");
  ok(r.parziale === true, "ma il conto è parziale: 14 viaggi restano fuori");
  ok(r.dich.viaggi === 14, "e i viaggi sono contati a parte, non convertiti");
  /* la stessa combinazione con delle tonnellate senza densità */
  const r2 = terra.riconciliazioneTurni(mis, [
    { data: "2026-03-10", prodQta: 980, prodUnita: "m³" },
    { data: "2026-03-11", prodQta: 500, prodUnita: "t" },
  ], "2026-03-01", "2026-03-31", null);
  eq(r2.stato, "coerente", "i metri cubi diretti si sommano anche senza densità");
  ok(r2.parziale === true && r2.dich.tSenzaDensita === 500,
    "e le tonnellate non convertibili rendono il conto parziale");
});
test("P2 · UNA SOLA implementazione: Terra ri-esporta, non riscrive", () => {
  /* La logica del ponte serve a Terra e a Campo, e non appartiene a nessuna delle
     due: vive in `shared/dw-ponti.js`. `terra-data.js` la ri-esporta col nome con
     cui Terra l'ha sempre chiamata. Qui si pretende che siano LA STESSA funzione,
     non due copie che si assomigliano — l'identità è l'unica prova che regge, il
     comportamento uguale oggi può divergere domani. */
  for (const nome of ["produzioneRapportino", "produzioneDichiarata", "riconciliazioneTurni",
    "misuratoPeriodo", "intervalliFraRilievi", "periodoFraUltimiRilievi",
    "avanzamentoDaUltimoRilievo"]) {
    ok(typeof ponti[nome] === "function", `shared/dw-ponti esporta ${nome}`);
    ok(terra[nome] === ponti[nome], `${nome}: Terra ri-esporta la funzione condivisa, non una copia`);
  }
  ok(terra.SOGLIA_TURNI === ponti.SOGLIA_TURNI, "e le soglie sono lo stesso oggetto");
  /* la regola del cumulo: era scritta in Terra e in Conti, ora la sorgente è una */
  ok(terra.provenienzaRilievo === ponti.provenienzaDi,
    "provenienzaRilievo di Terra È provenienzaDi di shared/");
  for (const [r, atteso] of [[{ provenienza: "cumulo" }, "cumulo"], [{ provenienza: "Cumulo " }, "cumulo"],
    [{ provenienza: "scavo" }, "scavo"], [{}, "scavo"], [null, "scavo"]]) {
    eq(ponti.provenienzaDi(r), atteso, `provenienzaDi(${JSON.stringify(r)})`);
  }
});
test("P2 · IL CONTRATTO con Campo: le due letture dicono la stessa cosa", () => {
  /* La forma del dato che attraversa il confine è {prodQta, prodUnita}. Terra la
     rilegge per conto suo, e questa è la stessa strada per cui la convenzione sui
     numeri era finita scritta quattro volte: qui il disallineamento deve
     FALLIRE, non restare in silenzio. */
  const casi = [
    { prodQta: 120, prodUnita: "t" }, { prodQta: 0.5, prodUnita: "m³" },
    { prodQta: 12, prodUnita: "viaggi" }, { prodQta: 0, prodUnita: "t" },
    { prodQta: -5, prodUnita: "t" }, { prodQta: null, prodUnita: "t" },
    { prodQta: 7, prodUnita: "tonnellate" },   // unità sconosciuta: ricade sulle t
    { prodQta: 7 },                            // unità assente
    {},
  ];
  for (const c of casi) {
    eq(terra.produzioneRapportino(c), campo.produzioneDi(c),
      `la lettura di Terra e quella di Campo devono coincidere su ${JSON.stringify(c)}`);
  }
  eq(campo.UNITA_PRODUZIONE, ["t", "m³", "viaggi"],
    "e le unità ammesse sono quelle su cui il ponte è costruito");
});

/* ══════════════════════════════════════════════════════════════════════
   LA CONVENZIONE CONDIVISA: due aggiunte per i file delle MACCHINE
   ══════════════════════════════════════════════════════════════════════ */
test("la notazione scientifica è ammessa solo a chi la chiede", () => {
  /* «1.5e3» non è un numero che una persona scrive in un modulo: accettarlo lì
     vorrebbe dire prendere per buono un «2e5» battuto per sbaglio e salvare
     duecentomila. Ma le macchine la scrivono — l'esportazione di una
     perforatrice mette l'energia specifica così, un sismografo può dare la
     velocità come «1.5E-2». Quindi è dietro un interruttore spento. */
  ok(shell.numeroScritto("1.5e3", { decimali: 6 }).ok === false,
    "in un campo scritto a mano resta rifiutata");
  eq(shell.numeroScritto("1.5e3", { decimali: 6 }).motivo, "non-numero", "e il motivo è chiaro");
  ok(shell.numeroScritto("1.5e3", { scientifica: true, decimali: 6 }).valore === 1500,
    "col permesso esplicito si legge");
  for (const [t, atteso] of [["1.5E-2", 0.015], ["2e5", 200000], ["1,5e3", 1500], ["-2.5e2", -250]]) {
    const r = shell.numeroScritto(t, { scientifica: true, decimali: 6 });
    ok(r.ok && r.valore === atteso, `${t} → ${atteso} (ottenuto ${r.valore})`);
  }
  /* il permesso NON apre la porta a tutto il resto */
  for (const t of ["2,4,5", "3x4", "e3", "1.5e", "1.5e3.2", "abc"]) {
    ok(shell.numeroScritto(t, { scientifica: true, decimali: 6 }).ok === false,
      `«${t}» resta rifiutato anche col permesso`);
  }
  /* e un esponente NON è ambiguo come «1.250»: non si chiede niente */
  ok(shell.numeroScritto("1.250e3", { scientifica: true, decimali: 6 }).valore === 1250,
    "«1.250e3» è 1250, non una domanda sulle migliaia");
});
test("l'arrotondamento non può peggiorare il numero", () => {
  /* `Math.round(n * 10^dec)` con molti decimali esce dagli interi esatti e
     restituisce spazzatura: una coordinata UTM chiesta a 10 decimali darebbe
     4,51234567e16, oltre 2^53. Quando succede si tiene il numero com'è. */
  const r = shell.numeroScritto("4512345,67", { decimali: 10 });
  ok(r.ok && r.valore === 4512345.67, `la coordinata resta se stessa (ottenuto ${r.valore})`);
  ok(shell.numeroScritto("2,4449", { decimali: 2 }).valore === 2.44,
    "e nel caso normale si arrotonda come prima");
  ok(shell.numeroScritto("13,25", { decimali: 1 }).valore === 13.3, "13,25 a un decimale è 13,3");
  /* la controprova: senza la guardia il conto andrebbe fuori */
  ok(!Number.isSafeInteger(Math.round(4512345.67 * 1e10)),
    "senza guardia Math.round(n·1e10) sarebbe fuori dagli interi esatti");
});

/* ══════════════════════════════════════════════════════════════════════
   IL MOTORE DEI GRAFICI: un valore mancante non si scavalca
   ══════════════════════════════════════════════════════════════════════
   Queste prove sono nate nel browser, perché è lì che si è SCOPERTO il difetto:
   `percorso` univa tutti i valori numerici in un tratto continuo, quindi
   [95, null, 140] veniva disegnata come una linea intera — un segmento che
   nessuno ha misurato, contro il commento della funzione stessa e contro la regola
   già scritta per gli altri grafici. Per TENERE la regola il browser non serve:
   dentro entrano numeri, fuori esce una stringa. Vivono qui perché una difesa che
   sta nello scratchpad alla prossima sessione non c'è più. */
{
  const { tratti, percorso } = grafici.geometria;
  const px = (i) => i * 100, py = (v) => 200 - v;
  const conta = (d, c) => (d.match(new RegExp("\\" + c, "g")) || []).length;

  test("grafici: i valori si spezzano in tratti di numeri consecutivi", () => {
    eq(tratti([95, null, 140, 290]), [[0], [2, 3]], "un buco separa due tratti");
    eq(tratti([10, 20, 15, 30]), [[0, 1, 2, 3]], "senza buchi un tratto solo");
    eq(tratti([null, 42, null]), [[1]], "un dato isolato è un tratto di un punto");
    eq(tratti([null, null]), [], "tutto mancante: nessun tratto");
    eq(tratti([]), [], "serie vuota: nessun tratto");
    eq(tratti(null), [], "serie assente: nessun tratto, non un errore");
    eq(tratti([10, NaN, 15, undefined, 7]), [[0], [2], [4]], "NaN e undefined fanno buco come null");
    eq(tratti([10, 0, 15]), [[0, 1, 2]],
      "uno ZERO NON è un buco: è una misura, e la linea resta intera");
  });
  test("grafici: la linea non attraversa il buco", () => {
    const d = percorso([95, null, 140, 290], px, py, false);
    ok(conta(d, "M") === 2, `due sottopercorsi, non uno: ${d}`);
    ok(conta(percorso([10, 20, 15, 30], px, py, false), "M") === 1, "senza buchi resta un percorso solo");
    ok(percorso([null, null], px, py, false) === "", "niente da disegnare → stringa vuota");
    /* un punto isolato resta VISIBILE: `l0 0` è un segmento di lunghezza zero, che
       il browser disegna come un puntino. Sparire sarebbe perdere un dato vero. */
    ok(/l0 0/.test(percorso([null, 42, null], px, py, false)), "un dato isolato resta un puntino");
    /* e con la curva morbida il comportamento è lo stesso */
    ok(conta(percorso([1, 2, 3, null, 5, 6, 7], px, py, true), "M") === 2,
      "anche con la curva i tratti restano due");
  });
  test("grafici: la controprova — senza la correzione la linea scavalcherebbe", () => {
    /* si rifà a mano quello che faceva la versione di prima: tutti i numeri in un
       tratto unico. Se un giorno `percorso` tornasse a comportarsi così, la prova
       qui sopra fallisce e questa spiega perché era sbagliato. */
    const vecchio = (valori) => {
      const pts = [];
      valori.forEach((v, i) => { if (Number.isFinite(+v) && v !== null && v !== "") pts.push([px(i), py(v)]); });
      let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
      for (let i = 1; i < pts.length; i++) d += "L" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
      return d;
    };
    const v = [95, null, 140, 290];
    ok(conta(vecchio(v), "M") === 1, "la vecchia logica faceva un percorso solo");
    ok(conta(percorso(v, px, py, false), "M") === 2, "la nuova ne fa due");
  });
}

/* ══════════════════════════════════════════════════════════════════════
   LE ETICHETTE DELL'ASSE X NON SI SOVRAPPONGONO
   ══════════════════════════════════════════════════════════════════════
   Il difetto stava in questo: il motore scampionava le etichette col solo CONTO
   (una ogni `passo`) e poi aggiungeva l'ultima comunque, senza guardare se ci
   stava. Ma lo spazio che serve dipende da quanto è LUNGO il testo, e tutte le
   prove sui grafici usavano `A B C D`. Misurato a 390 px con quattro nomi di
   fronte veri («Gradone Nord-Est», «Gradone Sud-Ovest»): 12 px di sovrapposizione.
   Adesso il passo dà i candidati e la geometria decide chi resta. La decisione è
   in `tenuteX`, che riceve riquadri e torna indici: nessun DOM, quindi la regola
   si prova qui e non solo nel browser dello scratchpad — che alla sessione
   successiva non c'è più. Le larghezze vere, quelle, si misurano nel browser
   (`getBBox`): una stima le aveva sbagliate di un terzo. */
{
  const { tenuteX } = grafici.geometria;
  /* riquadri da sinistra a destra, come li passa il disegno */
  const sp = (sin, larg) => ({ sin, des: sin + larg });

  test("grafici: l'ultima etichetta non si butta mai", () => {
    eq(tenuteX([sp(0, 30)], 4), [0], "una sola etichetta resta");
    /* due attaccate: cade la PRIMA, non l'ultima — il dato più recente è quello
       che si guarda per primo, una tacca intermedia in meno si legge comunque */
    eq(tenuteX([sp(0, 40), sp(35, 40)], 4), [1], "di due sovrapposte resta la seconda");
    /* tre a catena NON si riducono a una: caduta la penultima, la prima non tocca
       più niente e torna a starci. Scartare a catena getterebbe informazione che
       c'è spazio per mostrare — la prima versione di questa prova si aspettava
       proprio quello, e si aspettava male. */
    eq(tenuteX([sp(0, 40), sp(38, 40), sp(76, 40)], 4), [0, 2],
      "tre a catena: cade quella in mezzo, la prima ci sta di nuovo");
  });
  test("grafici: chi ci sta resta, e nell'ordine da sinistra a destra", () => {
    eq(tenuteX([sp(0, 30), sp(50, 30), sp(100, 30)], 4), [0, 1, 2], "larghe abbastanza: tutte");
    /* fra la PRIMA e un'intermedia che si toccano cade l'intermedia: la prima dice
       da dove comincia l'asse, l'intermedia serve solo a leggere la scala */
    eq(tenuteX([sp(0, 30), sp(31, 30), sp(100, 30)], 4), [0, 2],
      "fra la prima e l'intermedia che si toccano cade l'intermedia");
    /* il respiro è un minimo, e «almeno 4» include 4: con 4 px di stacco l'etichetta
       resta, con 3 cade. Il confine va provato da entrambi i lati, altrimenti la
       prova starebbe zitta se un giorno diventasse 3 o 5. */
    eq(tenuteX([sp(0, 30), sp(34, 30)], 4), [0, 1], "4 px di stacco bastano: il respiro è un minimo");
    eq(tenuteX([sp(0, 30), sp(33, 30)], 4), [1], "3 px non bastano");
    eq(tenuteX([sp(0, 30), sp(34, 30)], 0), [0, 1], "senza respiro richiesto basta non toccarsi");
  });
  /* QUESTA PROVA NASCE DA UNO SCREENSHOT, non da un conto. La prima versione di
     `tenuteX` teneva solo l'ultima e scorreva verso sinistra: con quattro nomi di
     fronte a 390 px restavano la SECONDA e la QUARTA, e il lato sinistro dell'asse
     era vuoto — un grafico che non dice da dove comincia. Le sovrapposizioni erano
     zero, quindi nessuna misura automatica se ne sarebbe accorta: si è visto
     guardando. */
  test("grafici: l'asse dice sempre da dove comincia e dove finisce", () => {
    /* quattro etichette larghe, dove solo le due estremità ci stanno */
    const q = [sp(0, 100), sp(80, 100), sp(170, 100), sp(260, 100)];
    eq(tenuteX(q, 4), [0, 3], "restano le due estremità, non due tacche in mezzo");
    /* e se nemmeno le due estremità ci stanno, resta l'ultima: quella non cade mai */
    eq(tenuteX([sp(0, 100), sp(60, 100)], 4), [1], "se le estremità si toccano resta l'ultima");
    /* con tre, la prima e la terza prima della seconda */
    eq(tenuteX([sp(0, 60), sp(50, 60), sp(120, 60)], 4), [0, 2],
      "la tacca di mezzo cede il posto alle estremità");
  });
  test("grafici: niente etichette, niente da decidere", () => {
    eq(tenuteX([], 4), [], "lista vuota");
    eq(tenuteX(null, 4), [], "lista assente: non un errore");
    /* un riquadro non misurabile si SALTA invece di far cadere tutto quello che
       gli sta a sinistra: un'etichetta che non si sa dov'è non deve poter
       cancellare quelle che si sanno */
    eq(tenuteX([sp(0, 30), null, sp(100, 30)], 4), [0, 2], "un riquadro assente si salta");
    eq(tenuteX([sp(0, 30), { sin: NaN, des: NaN }, sp(100, 30)], 4), [0, 2],
      "un riquadro NaN si salta come uno assente");
  });
  /* ── il taglio delle etichette delle BARRE ────────────────────────────────
     Nelle barre i nomi lunghi sono la norma, non l'eccezione: mezzi, clienti,
     fronti. Misurato a 390 px sulla versione che tagliava a conto di caratteri
     (`banda / 6`), due difetti veri: nel verticale due nomi troncati si
     **toccavano** ancora (4 px) e «Bravo»/«Charl…» si leggevano come una parola
     sola; nell'orizzontale non c'era troncatura affatto e un nome lungo **usciva
     dal disegno**. Ora la larghezza si misura (`getComputedTextLength`) e il taglio
     — la parte che si può sbagliare senza accorgersene — sta in `tagliaA`, pura. */
  test("grafici: il taglio di un'etichetta lascia qualcosa da leggere", () => {
    const { tagliaA } = grafici.geometria;
    ok(tagliaA("Escavatore", 20) === "Escavatore", "se ci sta tutto non si tocca");
    ok(tagliaA("Escavatore", 10) === "Escavatore", "il caso al pelo non aggiunge i puntini");
    ok(tagliaA("Escavatore Komatsu", 10) === "Escavatore…", "taglia e mette i puntini");
    /* uno spazio appeso ai puntini legge male, e si vedeva a schermo */
    ok(tagliaA("Dumper Volvo A40", 7) === "Dumper…", "lo spazio prima dei puntini si toglie");
    ok(tagliaA("Cava di Monte Cerreto — settore", 24) === "Cava di Monte Cerreto…",
      "e così il trattino: «Cerreto —…» era il caso vero visto nello screenshot");
    ok(tagliaA("Fronte, Nord", 7) === "Fronte…", "anche la virgola");
    /* sotto una lettera i puntini non dicono niente: a quel punto è la FORMA del
       grafico che è sbagliata, non l'etichetta — ma non si restituisce «…» nudo */
    ok(tagliaA("Escavatore", 0) === "E…", "almeno una lettera prima dei puntini");
    ok(tagliaA("—Nord", 1) === "—…", "se la prima lettera è punteggiatura si tiene comunque");
    ok(tagliaA("", 5) === "", "testo vuoto: niente da tagliare");
    ok(tagliaA(null, 5) === "", "testo assente: non un errore");
  });
  test("grafici: la controprova — il vecchio taglio non bastava", () => {
    const { tagliaA } = grafici.geometria;
    /* la versione di prima: `et.slice(0, floor(banda/6)) + '…'`, senza respiro e
       senza togliere lo spazio. Con banda 60 dà 10 caratteri di «Dumper Volvo A40»
       cioè «Dumper Vol…» — e su «Gradone Nord-Est»/«Gradone Sud-Ovest» le due
       troncature restavano attaccate perché nessuno sottraeva il respiro. */
    const vecchio = (t, banda) => t.slice(0, Math.max(2, Math.floor(banda / 6))) + "…";
    ok(vecchio("Dumper Volvo A40", 60) === "Dumper Vol…", "il vecchio taglio contava i caratteri");
    /* banda 78 → 13 caratteri, e il tredicesimo di «Dumper Volvo A40» è lo SPAZIO */
    ok(vecchio("Dumper Volvo A40", 78) === "Dumper Volvo …",
      "e poteva lasciare uno spazio appeso ai puntini");
    ok(tagliaA("Dumper Volvo A40", 13) === "Dumper Volvo…", "il nuovo no");
  });
  /* ── il numero al centro della ciambella ──────────────────────────────────
     Stessa famiglia: una DIMENSIONE del carattere decisa da una stima per conto di
     caratteri. La stima è tarata sulle cifre, e su «1.111.110 m³/giorno» sbagliava
     per difetto — misurato, 127 px di testo in un buco da 120. Ora si parte dalla
     stima e si riduce in proporzione finché ci sta; la misura arriva da fuori,
     quindi la regola si prova qui con un carattere finto di larghezza nota. */
  test("grafici: il numero al centro si rimpicciolisce finché ci sta", () => {
    const { dimCheCiSta } = grafici.geometria;
    /* carattere finto: a dimensione d il testo è largo d · k */
    const largo = (k) => (d) => d * k;
    ok(dimCheCiSta(30, 120, largo(2)) === 30, "se ci sta già non si tocca");
    /* a 30 il testo è largo 150 in un buco da 120 → 30 · 120/150 = 24 */
    eq(Math.round(dimCheCiSta(30, 120, largo(5))), 24, "riduce in proporzione, in un giro");
    ok(largo(5)(dimCheCiSta(30, 120, largo(5))) <= 120 + 1e-9, "e dopo ci sta davvero");
    /* il pavimento vince sulla proporzione: meglio al limite del leggibile che
       microscopico. Con k=40 la proporzione chiederebbe 3 px. */
    ok(dimCheCiSta(30, 120, largo(40)) === 11, "sotto il minimo non si scende");
    ok(dimCheCiSta(30, 120, largo(40), 15) === 15, "e il minimo è dichiarabile");
    ok(dimCheCiSta(30, 0, largo(5)) === 30, "buco a zero: non si decide niente");
    ok(dimCheCiSta(30, 120, () => 0) === 30, "misura non disponibile: si tiene la stima");
    /* un carattere che NON scala in proporzione non deve far girare all'infinito:
       qui la larghezza resta 300 qualunque sia la dimensione */
    const fisso = dimCheCiSta(30, 120, () => 300);
    ok(fisso === 11, `col carattere che non scala si finisce al minimo, non in un ciclo (${fisso})`);
  });
  test("grafici: la controprova — la vecchia scelta si sovrapponeva", () => {
    /* la versione di prima: gli indici del passo, più l'ultimo, sempre.
       I numeri non sono inventati — sono quelli misurati a 390 px: il disegno va da
       38 a 378 unità di viewBox, e «Gradone Nord-Est» ne occupa circa 108 (86 px di
       schermo, che il viewBox scala a 108). Con quattro nomi così l'ultima entrava
       dentro la penultima. Una prima versione di questa prova usava 60 unità — la
       larghezza dello SCHERMO invece di quella del viewBox — e non conteneva
       nessuna sovrapposizione: la guardia qui sotto l'ha detto. */
    const larg = 108, x0 = 38, x1 = 378;
    const posti = [0, 1, 2, 3].map((i) => x0 + ((x1 - x0) * i) / 3);
    const riquadri = posti.map((X, i) =>
      i === 3 ? sp(X - larg, larg) : i === 0 ? sp(X, larg) : sp(X - larg / 2, larg));
    let sovrapposte = 0;
    for (let i = 1; i < riquadri.length; i++) if (riquadri[i].sin < riquadri[i - 1].des) sovrapposte++;
    ok(sovrapposte > 0, "il caso di prova contiene davvero una sovrapposizione");
    const tenute = tenuteX(riquadri, 4);
    let ancora = 0;
    for (let i = 1; i < tenute.length; i++) {
      if (riquadri[tenute[i]].sin < riquadri[tenute[i - 1]].des) ancora++;
    }
    ok(ancora === 0, `dopo la scelta nessuna si sovrappone (tenute: ${tenute.join(",")})`);
    ok(tenute[tenute.length - 1] === 3, "e l'ultima è fra quelle tenute");
  });
}

/* ── LA GUARDIA SUI CAMPI INTERI ───────────────────────────────────────────
   Fin qui era verificata solo controllando che fosse MONTATA nelle pagine: un
   controllo di montaggio dice che il pezzo c'è, non che funziona. La verifica
   vera si è fatta col browser, digitando davvero in tutti e dieci i campi
   interi di Genesi — e la controprova (stessa pagina con la guardia smontata)
   ha fatto cadere 20 asserzioni su 33, quindi la prova sapeva fallire.
   Quel banco però vive nello scratchpad, cioè alla sessione dopo non esiste:
   la DECISIONE è stata estratta in `decisioneIntero`, funzione pura, e le sue
   tre risposte si provano qui, dove girano sempre e senza browser.
   Il caso che conta davvero è «1.500»: senza guardia il campo `type="number"`
   lo legge all'inglese e vale 1,5 — millecinquecento diventa uno e mezzo, in
   silenzio. Misurato nel browser, non dedotto. */
{
  const { decisioneIntero, eCampoIntero } = shell;
  test("guardia interi: un separatore battuto a mano si rifiuta e si spiega", () => {
    for (const c of [",", "."]) {
      const d = decisioneIntero(c, "1");
      ok(d && d.blocca === true, `«${c}» viene bloccato`);
      ok(/intero/.test(d.messaggio), `«${c}»: il messaggio dice che qui va un intero`);
      ok(d.valore === undefined, `«${c}»: il campo non viene riscritto`);
    }
  });
  test("guardia interi: quello che non c'entra passa senza intralci", () => {
    ok(decisioneIntero("4", "") === null, "una cifra passa");
    ok(decisioneIntero("42", "") === null, "un incolla di sole cifre passa");
    ok(decisioneIntero(null, "") === null, "niente dato (un tasto che non scrive): niente da decidere");
    ok(decisioneIntero(undefined, "12") === null, "dato assente: niente da decidere");
    ok(decisioneIntero("", "12") === null, "dato vuoto: niente da decidere");
  });
  test("guardia interi: un incolla con separatori, a campo vuoto, si ripulisce", () => {
    const d = decisioneIntero("1.500", "");
    ok(d && d.blocca === true, "l'incolla viene fermato");
    eq(d.valore, "1500", "e il campo diventa millecinquecento, non uno e mezzo");
    ok(/separatori/.test(d.messaggio), "dicendo che i separatori sono stati tolti");
    eq(decisioneIntero("1 500.000", "").valore, "1500000", "punto e spazi insieme");
  });
  test("guardia interi: le migliaia separate da spazio le sistema già il browser", () => {
    /* misurato in Chromium, battendo e incollando davvero: «1 500 000» in un
       `type="number"` diventa 1500000, valido. Gli spazi li toglie da sé.
       Una prima versione di questa prova pretendeva che li togliesse la
       GUARDIA, e accusava il codice di non fare una cosa che non serve fare:
       intercettare anche gli spazi vorrebbe dire bloccare tasti che oggi
       funzionano già. Si lascia passare, e lo si scrive qui perché la
       prossima volta non venga «aggiustato». */
    ok(decisioneIntero("1 500 000", "") === null, "spazio normale: la guardia non interviene");
    ok(decisioneIntero("1 500", "") === null, "spazio unificatore: idem");
    ok(decisioneIntero("1 500", "") === null, "spazio stretto: idem");
  });
  test("guardia interi: a campo pieno si rifiuta invece di sovrascrivere", () => {
    /* su type=number non c'è cursore (selectionStart è null, misurato): non si
       può inserire nel punto giusto, e sovrascrivere quello che c'era sarebbe
       peggio del rifiuto */
    const d = decisioneIntero("1.500", "12");
    ok(d && d.blocca === true, "si ferma");
    ok(d.valore === undefined, "e NON tocca quello che c'era");
    ok(/senza separatori/.test(d.messaggio), "spiegando cosa fare");
  });
  test("guardia interi: si applica ai campi giusti e solo a quelli", () => {
    const finto = (attr, tipo) => ({
      tagName: "INPUT", type: tipo === undefined ? "number" : tipo,
      getAttribute: (n) => (n in attr ? attr[n] : null),
    });
    ok(eCampoIntero(finto({ step: "1" })) === true, "step intero: è un campo intero");
    ok(eCampoIntero(finto({})) === true, "senza step: è un campo intero");
    ok(eCampoIntero(finto({ step: "0.5" })) === false, "step decimale: non lo è");
    ok(eCampoIntero(finto({ inputmode: "decimal" })) === false, "inputmode decimale: non lo è");
    ok(eCampoIntero(finto({}, "text")) === false, "un campo di testo non lo è");
    ok(eCampoIntero(null) === false, "niente elemento: non è un errore");
  });
  test("guardia interi: la controprova — senza la guardia «1.500» vale 1,5", () => {
    /* quello che fa il browser da solo, misurato in Chromium: il punto è letto
       come separatore decimale. Se questa prova smette di fallire senza la
       guardia, la guardia non sta più servendo a niente. */
    ok(Number("1.500") === 1.5, "il lettore del browser fa 1,5 di «1.500»");
    eq(Number(decisioneIntero("1.500", "").valore), 1500, "con la guardia fa 1500");
  });
}

/* ── PONTE P2 — CAMPO → TERRA, FRONTE PER FRONTE ────────────────────────
   Terra sapeva quanto è stato cavato fra un rilievo e l'altro, ma non da dove.
   Il rischio grosso di questa funzione non è sbagliare una somma: è attribuire
   la produzione al fronte SBAGLIATO, che è un errore muto su un numero che
   finisce nella denuncia annuale. Per questo si accoppia per `fronteId` e mai
   per nome — e la prova qui sotto lo pretende. */
{
  const { produzionePerFronte } = ponti;
  const FRONTI = [{ id: "f1", nome: "Fronte Nord" }, { id: "f2", nome: "Fronte Est" }];
  const rap = (data, qta, unita, fronteId) => ({ data, prodQta: qta, prodUnita: unita, fronteId });

  test("P2: la produzione si divide per fronte, e la quota è sull'attribuito", () => {
    const r = produzionePerFronte([
      rap("2026-07-10", 1000, "t", "f1"),
      rap("2026-07-11", 500, "t", "f2"),
      rap("2026-07-12", 300, "t", undefined),
    ], FRONTI, "2026-07-01", "2026-07-31", 2.5);
    eq(r.righe.length, 2, "due fronti con produzione");
    eq(r.righe[0].nome, "Fronte Nord", "in testa quello che ha prodotto di più");
    eq(r.righe[0].m3, 400, "mille tonnellate a densità 2,5 fanno 400 m³");
    eq(r.m3Attribuito, 600, "attribuito: solo quello che ha un fronte");
    eq(r.m3Totale, 720, "totale: attribuito più quello che non ce l'ha");
    /* la quota è sull'ATTRIBUITO: dire «il Nord è il 55%» quando un pezzo non
       si sa da dove viene è un modo elegante di mentire */
    eq(r.righe[0].quotaPct, 66.7, "la quota si calcola su quello che si sa");
    eq(r.senzaFronte.m3, 120, "e quello che non si sa resta a parte, dichiarato");
  });

  test("P2: ⛔ NON si accoppia per nome, mai", () => {
    /* il rapportino porta il NOME del fronte al posto dell'identificativo:
       deve finire fra i non attribuiti, non su «Fronte Nord». Se un giorno
       qualcuno «migliora» la funzione facendole leggere i nomi, questa prova
       cade — ed è esattamente il suo mestiere. */
    const r = produzionePerFronte([
      { data: "2026-07-10", prodQta: 100, prodUnita: "m³", fronteId: "Fronte Nord" },
    ], FRONTI, "", "", 2.5);
    eq(r.righe.length, 0, "nessun fronte riconosciuto");
    eq(r.fronteSconosciuto.m3, 100, "finisce fra quelli con un fronte che non esiste");
    ok(r.senzaFronte.m3 === 0, "e non si confonde con chi il fronte non l'ha proprio indicato");
  });

  test("P2: «non indicato» e «fronte che non esiste» restano due cose diverse", () => {
    const r = produzionePerFronte([
      { data: "2026-07-10", prodQta: 50, prodUnita: "m³" },
      { data: "2026-07-11", prodQta: 70, prodUnita: "m³", fronteId: "f-cancellato" },
    ], FRONTI, "", "", 2.5);
    eq(r.senzaFronte.m3, 50, "chi non l'ha indicato");
    eq(r.fronteSconosciuto.m3, 70, "chi indica un fronte che non c'è più");
    eq(r.copertura, 0, "e la copertura dice che non si sa niente di dove venga");
  });

  test("P2: senza densità le tonnellate non diventano metri cubi", () => {
    const r = produzionePerFronte([rap("2026-07-10", 1000, "t", "f1")], FRONTI, "", "", 0);
    eq(r.righe[0].m3, 0, "niente conversione inventata");
    eq(r.righe[0].tSenzaDensita, 1000, "le tonnellate restano dichiarate come tali");
    ok(r.parziale === true, "e il conto si dichiara parziale");
    ok(r.densita === null, "la densità mancante è null, non zero");
  });

  test("P2: i viaggi si contano e non si convertono", () => {
    const r = produzionePerFronte([rap("2026-07-10", 6, "viaggi", "f1")], FRONTI, "", "", 2.5);
    eq(r.righe[0].viaggi, 6, "i viaggi si contano");
    eq(r.righe[0].m3, 0, "ma non diventano metri cubi: manca la portata del mezzo");
    ok(r.parziale === true, "e il conto è dichiaratamente per difetto");
  });

  test("P2: il periodo e i dati inutilizzabili", () => {
    const r = produzionePerFronte([
      rap("2026-06-30", 100, "m³", "f1"),          // prima
      rap("2026-08-01", 100, "m³", "f1"),          // dopo
      rap("2026-07-10", 100, "m³", "f1"),          // dentro
      { data: "non una data", prodQta: 9, prodUnita: "m³", fronteId: "f1" },
      { data: "2026-07-11", fronteId: "f1" },      // senza produzione
    ], FRONTI, "2026-07-01", "2026-07-31", 2.5);
    eq(r.m3Attribuito, 100, "solo quello dentro il periodo");
    eq(r.scartati, 2, "data illeggibile e turno senza produzione: contati, non nascosti");
  });

  test("P2: senza rapportini è «non lo so», non zero", () => {
    ok(produzionePerFronte(null, FRONTI, "", "", 2.5) === null, "null e non un oggetto a zero");
    const vuoto = produzionePerFronte([], FRONTI, "", "", 2.5);
    eq(vuoto.righe.length, 0, "elenco vuoto: nessuna riga");
    ok(vuoto.copertura === null, "e la copertura è «non pervenuta», non 0%");
  });

  test("P2: i fronti della dimostrazione di Campo sono quelli di Terra", async () => {
    /* Se qui inventassi altri identificativi il ponte funzionerebbe in
       dimostrazione e si romperebbe in produzione, che è il modo peggiore di
       sbagliare: nessuno se ne accorge finché non è davanti a un cliente. */
    const dC = await campo.campoData(), dT = await terra.terraData();
    const idC = (await dC.frontiTerra()).map((f) => f.id).sort();
    const idT = (await dT.fronti()).map((f) => f.id).sort();
    ok(idC.length > 0, "Campo ha dei fronti dimostrativi");
    eq(idC.join(","), idT.join(","), "gli stessi identificativi di Terra");
  });

  test("P2: la dimostrazione di Campo esercita davvero la ripartizione", async () => {
    /* dati d'esempio che non toccano il caso interessante sono dati che
       mentono: qui si pretende che ci sia sia produzione attribuita sia
       produzione senza fronte, altrimenti la nota «non attribuita» non si
       vedrebbe mai e nessuno saprebbe se funziona */
    const dC = await campo.campoData();
    const r = produzionePerFronte(await dC.rapportini(), await dC.frontiTerra(), "", "", 2.4);
    ok(r.righe.length >= 2, `almeno due fronti con produzione (${r.righe.length})`);
    ok(r.senzaFronte.m3 > 0, "e qualcosa che dichiaratamente non è attribuito");
    ok(r.copertura > 0 && r.copertura < 100, `copertura fra 0 e 100 (${r.copertura})`);
  });

  test("P2: la funzione vive in shared/ e le app la ri-esportano identica", () => {
    /* non «si comporta uguale»: È la stessa. Due copie uguali oggi divergono
       domani senza che nessuno lo veda. */
    ok(campo.produzionePerFronte === ponti.produzionePerFronte,
      "campo.produzionePerFronte è la stessa funzione di dw-ponti");
    ok(terra.produzionePerFronte === ponti.produzionePerFronte,
      "terra.produzionePerFronte è la stessa funzione di dw-ponti");
  });
}

/* ── L'UNITÀ DENTRO UN TESTO MAIUSCOLO ──────────────────────────────────
   Il 30/07 questa riga è nata in TRE app nello stesso pomeriggio, e nasceva
   già diversa: due accettavano «30gg» attaccato, la terza pretendeva lo
   spazio e su «30gg» non faceva niente. Tre copie che il primo giorno si
   comportano in due modi — il difetto che qui è già costato una giornata.
   Adesso è una sola, in shared/, e queste prove tengono ferma la differenza
   che le divideva. */
{
  const { avvolgiUnita } = shell;
  /* lo spazio di separazione sta DENTRO lo span (il perché è accanto ad
     `avvolgiUnita`): le prove lo scrivono come lo scrive la funzione */
  /* lo spazio di separazione sta DENTRO lo span ed è quello unificatore: il
     perché sta accanto ad `avvolgiUnita`. Le prove lo scrivono con l'escape,
     perché a occhio è identico a uno spazio normale. */
  const U = (u, sp = "") => `<span class="u">${sp ? "\u00A0" : ""}${u}</span>`;
  test("unità nel maiuscolo: col separatore e senza", () => {
    eq(avvolgiUnita("tra 13 gg"), `tra 13${U("gg", " ")}`, "con lo spazio");
    /* è ESATTAMENTE il caso su cui le tre copie divergevano */
    eq(avvolgiUnita("Tagliandi 30gg"), `Tagliandi 30${U("gg")}`, "e attaccato, che una delle tre non vedeva");
  });
  test("unità nel maiuscolo: si avvolge solo quello che è un'unità", () => {
    eq(avvolgiUnita("oggi"), "oggi", "«gg» dentro una parola non è un'unità");
    eq(avvolgiUnita("leggi 3 righe"), "leggi 3 righe", "e nemmeno preceduto da una cifra lontana");
    eq(avvolgiUnita("Squadra B"), "Squadra B", "un testo senza numeri non si tocca");
  });
  test("unità nel maiuscolo: più unità nella stessa frase", () => {
    eq(avvolgiUnita("21 gg e 4 mm"), `21${U("gg", " ")} e 4${U("mm", " ")}`, "tutte e due");
    eq(avvolgiUnita("1500 m³"), `1500${U("m³", " ")}`, "anche il metro cubo, che è il caso peggiore");
  });
  test("unità nel maiuscolo: niente testo, niente errori", () => {
    eq(avvolgiUnita(null), "", "null diventa vuoto, non «null»");
    eq(avvolgiUnita(""), "", "vuoto resta vuoto");
    eq(avvolgiUnita(42), "42", "un numero si accetta e si restituisce come testo");
  });
  /* L'ORA. Le etichette dei tagliandi di Flotta finiscono in una pastiglia, e la
     pastiglia è maiuscola: prima di oggi uscivano «TRA 24,5 H» e «SCADUTA (+20
     H)». Le due prove che contano davvero sono le ultime due: se «h» mangiasse
     la coda di «km/h» o di «m³/h», l'ora finirebbe dentro una velocità e dentro
     una portata — ed è per quello che sta in fondo all'elenco. */
  test("unità nel maiuscolo: l'ora", () => {
    eq(avvolgiUnita("tra 24,5 h"), `tra 24,5${U("h", " ")}`, "l'etichetta di un tagliando");
    eq(avvolgiUnita("SCADUTA (+20 h)"), `SCADUTA (+20${U("h", " ")})`, "e quella scaduta, dentro le parentesi");
    eq(avvolgiUnita("contatore 1.240 h"), `contatore 1.240${U("h", " ")}`, "col migliaio all'italiana");
    eq(avvolgiUnita("40 km/h"), `40${U("km/h", " ")}`, "«km/h» resta intera: l'ora non le stacca la coda");
    eq(avvolgiUnita("120 m³/h"), `120${U("m³/h", " ")}`, "e nemmeno a «m³/h», che è una portata");
    eq(avvolgiUnita("3 ha di piazzale"), "3 ha di piazzale", "«ha» non è un'ora");
  });
  /* ⚠️ QUESTE SONO LE PROVE DELL'ORDINE, e sono le uniche che cadono se qualcuno
     rimette l'elenco in ordine scritto a mano: ognuna è un'unità COMPOSTA che
     comincia con un'unità SEMPLICE già in elenco. Con l'ordine sbagliato non
     falliscono con un errore: restituiscono `<span>kg</span>/m³`, che sembra
     giusto finché non finisce in una pastiglia e diventa «kg/M³» — il metro cubo
     maiuscolo, cioè l'errore che questa funzione esiste per impedire. */
  test("unità nel maiuscolo: la composta batte la semplice", () => {
    eq(avvolgiUnita("2,6 kg/m³"), `2,6${U("kg/m³", " ")}`, "«kg/m³» non si spezza in «kg» più «/m³»");
    eq(avvolgiUnita("1,2 kg/foro"), `1,2${U("kg/foro", " ")}`, "né «kg/foro»");
    eq(avvolgiUnita("2,7 t/m³"), `2,7${U("t/m³", " ")}`, "né la densità");
    eq(avvolgiUnita("400 m³/giorno"), `400${U("m³/giorno", " ")}`, "né «m³/giorno», che comincia come «m³»");
    eq(avvolgiUnita("18 mm/s"), `18${U("mm/s", " ")}`, "né «mm/s», che comincia come «mm»");
  });
  /* Il costo orario di Flotta ha la valuta PRIMA del numero: non c'è nessun
     «€/h» preceduto da una cifra: l'unico pezzo da salvare è la coda. */
  /* ⛔ I SOLDI. Lo spazio dopo il simbolo è quello UNIFICATORE (U+00A0) e va
     chiesto per CODICE, non a occhio: a occhio è identico a uno spazio normale,
     e la differenza si vede solo il giorno in cui, su una colonna stretta, il
     simbolo resta a fine riga e la cifra va a capo da sola. Prima del 30/07 gli
     spazi erano tre: Conti l'unificatore, Terra quello normale, Flotta nessuno. */
  const { euro, euro0, conEuro } = shell;
  test("i soldi: una sola forma per tutto l'ecosistema", () => {
    eq(euro(48200), "€ 48.200,00", "il totale in colonna ha sempre due decimali");
    eq(euro0(48200), "€ 48.200", "l'indicatore arrotondato non ne ha nessuno");
    eq(euro(178.5), "€ 178,50", "«178,5» non è come si scrive una cifra");
    /* ⚠️ «8400,00» SENZA IL PUNTO NON È UN DIFETTO, ed è la prova che ha
       corretto me e non il codice. In italiano il separatore delle migliaia
       compare da cinque cifre in su (regola CLDR: `minimumGroupingDigits` vale
       2), quindi 8.400 si scrive «8400» e 48.200 si scrive «48.200». Avevo
       scritto l'asserzione col punto, dandolo per scontato, e la misura ha detto
       di no. È il comportamento che Conti ha sempre avuto: qui si stava
       unificando la convenzione, non cambiandola. Se un giorno si vorrà il punto
       anche sotto i diecimila — le fatture spesso lo mettono — è una decisione
       da prendere apposta, con `useGrouping: "always"`, e non da far scivolare
       dentro un'unità che parlava d'altro. */
    eq(euro(8400), "€ 8400,00", "sotto i diecimila l'italiano non mette il punto (CLDR)");
    eq(euro(9999.994), "€ 9999,99", "e i centesimi si troncano al centesimo, non si inventano");
    eq(euro(0), "€ 0,00", "zero è zero, non vuoto");
    eq(euro(null), "€ 0,00", "e un dato che manca non diventa «NaN» davanti a un cliente");
    eq(euro(-1234.5), "-€ 1234,50", "il meno sta DAVANTI al simbolo, non incastrato fra simbolo e cifre");
    eq(euro(-48200), "-€ 48.200,00", "e anche quando il punto delle migliaia c'è");
  });
  /* `conEuro` esiste perché il simbolo e il formato del numero sono due cose
     diverse: quando un'app formatta la cifra a modo suo per una ragione sua
     (l'indicatore di Flotta scrive «8,4k» per farla stare in una casella
     piccola) deve poter mettere il simbolo giusto SENZA riscriverne la regola —
     è da quella strada che erano nate le tre forme diverse. */
  test("i soldi: il simbolo si può mettere su un numero scritto a modo proprio", () => {
    eq(conEuro("8,4") + "k", "\u20AC\u00A08,4k", "l'indicatore compatto di Flotta");
    eq(conEuro("-8,4"), "-\u20AC\u00A08,4", "col meno davanti, come le altre due");
    eq(conEuro(""), "\u20AC\u00A0", "una stringa vuota non fa esplodere niente");
    eq(conEuro(null), "\u20AC\u00A0", "e nemmeno un valore che manca");
  });
  test("i soldi: lo spazio è quello unificatore, non quello normale", () => {
    ok(euro(1)[1].charCodeAt(0) === 0xA0, "euro: dopo «€» c'è U+00A0");
    ok(euro0(1)[1].charCodeAt(0) === 0xA0, "euro0: dopo «€» c'è U+00A0");
    /* ⚠️ questa riga era stata riscritta per sbaglio in «non contiene
       l'unificatore», che è l'opposto di quello che deve dire: qui lo spazio
       cercato è quello NORMALE, e infatti si scrive con l'escape. */
    ok(!euro(1).includes("\u20AC\u0020"), "e non c'è nessuno spazio normale dopo il simbolo");
  });
  test("unità nel maiuscolo: il costo orario, con la valuta davanti", () => {
    eq(avvolgiUnita("€19,02/h"), `€19,02${U("/h")}`, "«/h» si salva anche da sola");
    eq(avvolgiUnita("9,7 l/h"), `9,7${U("l/h", " ")}`, "e i litri all'ora restano interi");
    eq(avvolgiUnita("12,50 €/h"), `12,50${U("€/h", " ")}`, "e la forma con lo spazio davanti");
    eq(avvolgiUnita("40 km/h"), `40${U("km/h", " ")}`, "«/h» non stacca la coda a «km/h»");
    eq(avvolgiUnita("120 m³/h"), `120${U("m³/h", " ")}`, "né a «m³/h»");
  });
}


/* IL FORO RIPETUTO NEL PIANO DI CARICO — la decisione OPPOSTA a tutte le altre.
   Ovunque il doppione dentro il file si toglie; qui no. Due righe per lo stesso
   foro non sono un fastidio da ripulire, sono un errore nel PROGETTO della
   volata: toglierne una in silenzio farebbe sparire una carica e scendere il
   totale dell'esplosivo senza che nessuno sappia perché. Entrano entrambe, e
   l'app lo dichiara prima di scrivere. */
test("foriRipetuti: trova i numeri di foro che compaiono più volte", () => {
  const p = [{ foro: 1 }, { foro: 7 }, { foro: 2 }, { foro: 7 }, { foro: 3 }];
  eq(campo.foriRipetuti(p), [7], "il 7 c'è due volte");
});
test("foriRipetuti: un foro nominato tre volte si segnala UNA volta sola", () => {
  eq(campo.foriRipetuti([{ foro: 5 }, { foro: 5 }, { foro: 5 }]), [5],
     "l'avviso non deve dire «5, 5»");
});
test("foriRipetuti: l'ordine è quello del file, non quello dei numeri", () => {
  eq(campo.foriRipetuti([{ foro: 9 }, { foro: 2 }, { foro: 9 }, { foro: 2 }]), [9, 2],
     "chi legge ritrova i fori nell'ordine in cui li ha scritti");
});
test("foriRipetuti: niente doppioni, elenco vuoto o assente = nessun avviso", () => {
  eq(campo.foriRipetuti([{ foro: 1 }, { foro: 2 }]), [], "un piano pulito non avvisa");
  eq(campo.foriRipetuti([]), [], "elenco vuoto");
  eq(campo.foriRipetuti(null), [], "elenco che manca");
  eq(campo.foriRipetuti([{ foro: NaN }, { foro: NaN }]), [],
     "due righe senza numero di foro non sono «lo stesso foro»");
});
test("il piano NON perde righe: parsePianoCsv le tiene tutte e due", () => {
  /* la controprova del comportamento: se un giorno qualcuno applicasse qui la
     regola degli altri import, questo test cade — ed è quello che deve fare. */
  const righe = campo.parsePianoCsv(
    "foro;x;fila;prof;prog;borr;rit\n7;1,0;A;12;25;3;25\n7;1,5;A;12;30;3;42");
  eq(righe.length, 2, "due righe per il foro 7 restano due");
  eq(righe.map(r => r.prog), [25, 30], "e tutte e due le cariche restano nel totale");
  eq(campo.foriRipetuti(righe), [7], "ma il 7 viene segnalato");
});


/* ⛔ LE ORE DEL CONTATORE NON SI INVENTANO (31/07). Il contatore COMANDA la
   manutenzione: `tagliandiInScadenza` calcola quanto manca come «ore previste
   meno ore del mezzo». Un mezzo importato con le ore illeggibili, messo a zero,
   farebbe sembrare il tagliando lontanissimo proprio quando magari è già
   scaduto — e non comparirebbe nessun errore, solo una scadenza sbagliata.
   «Zero ore» e «non lo so» sono due cose diverse, e adesso l'app le distingue:
   il mezzo entra lo stesso, ma finisce fra quelli DA STIMARE, con il perché. */
test("parseMezziCsv: le ore illeggibili restano vuote, non diventano zero", () => {
  const p = flotta.parseMezziCsv("Escavatore 1;Fronte Nord;;operativo");
  eq(p.length, 1, "il mezzo entra lo stesso: esiste");
  eq(p[0].ore, null, "ma senza contatore");
  const q = flotta.parseMezziCsv("Pala 2;Piazzale;abc;operativo");
  eq(q[0].ore, null, "e nemmeno da un testo che non è un numero");
  const r = flotta.parseMezziCsv("Dumper 3;Pista;0;operativo");
  eq(r[0].ore, 0, "uno ZERO scritto apposta resta zero: è un mezzo nuovo");
});
test("un mezzo senza contatore non fa sembrare il tagliando lontano", () => {
  /* La prova che conta: due mezzi identici, uno col contatore e uno senza. */
  const manutenzioni = [{ id: "m1", titolo: "Tagliando 500 h", mezzo: "Pala 2", orePreviste: 500 }];
  const senza = flotta.tagliandiInScadenza(manutenzioni, [{ nome: "Pala 2", ore: null }], [],
    new Date(2026, 6, 31));
  eq(senza.voci.length, 0, "senza contatore non si promette una data");
  eq(senza.daStimare.length, 1, "va fra quelli da stimare");
  ok(/contatore/.test(senza.daStimare[0].perche), "e il perché nomina il contatore");
});


/* ⛔ LA BASE D'ASTA NON SI INVENTA (31/07). Viene SOMMATA: `gareRiepilogo`
   calcola quanto valgono le gare aperte, vinte e perse, ed è il numero che il
   titolare guarda per sapere «per quanto stiamo correndo». Una base illeggibile
   messa a zero abbassa quel totale in silenzio.
   A differenza del prezzo di un prodotto, però, una gara SENZA base è
   legittima: a volte la base non è ancora pubblicata. Quindi la gara entra, la
   base resta vuota, il totale la salta — e il riepilogo dice QUANTE sono, così
   chi legge sa che il totale è parziale. */
test("parseGareCsv: una base illeggibile resta vuota, non diventa zero", () => {
  const g = conti.parseGareCsv("Fornitura inerti 2026;;2026-09-01;aperta");
  eq(g.length, 1, "la gara entra: la scadenza serve comunque");
  eq(g[0].base, null, "ma senza base");
  eq(conti.parseGareCsv("Gara X;abc;2026-09-01;aperta")[0].base, null, "e nemmeno da un testo");
  eq(conti.parseGareCsv("Gara Y;0;2026-09-01;aperta")[0].base, 0, "uno zero scritto apposta resta zero");
});
test("gareRiepilogo: il totale salta le gare senza base, e lo dichiara", () => {
  const r = conti.gareRiepilogo([
    { stato: "aperta", base: 50000 },
    { stato: "aperta", base: null },
    { stato: "aperta", base: 30000 },
  ]);
  eq(r.aperte, 3, "sono tre gare aperte");
  eq(r.baseAperta, 80000, "il totale somma solo quelle con la base");
  eq(r.apertesenzaBase, 1, "e dice che una non ce l'ha: senza questo il totale inganna");
});


/* Terzo e ultimo zero di comodo tolto il 31/07 — e i due che RESTANO, con la
   ragione, perché la decisione va rifatta uguale la prossima volta:
   · `giorniAssenza` di un infortunio **resta zero**: la colonna vuota vuol dire
     davvero «nessuna assenza», che è il caso normale di un near-miss. Qui il
     valore di comodo è quello giusto, come la giacenza di un ricambio.
   · `quota` di un fronte **resta zero**: è un dato descrittivo, non entra in
     nessun conto — cambiarlo sposterebbe solo del rumore. */
test("parseSquadreCsv: «persone» non scritte restano vuote, non diventano zero", () => {
  const q = campo.parseSquadreCsv("Squadra A;;Fronte Nord;operativa");
  eq(q.length, 1, "la squadra entra: esiste e va assegnata");
  eq(q[0].persone, null, "ma senza numero di persone");
  eq(campo.parseSquadreCsv("Squadra B;0;Piazzale;operativa")[0].persone, 0,
     "uno zero scritto apposta resta zero: una squadra si può svuotare");
  eq(campo.parseSquadreCsv("Squadra C;4;Fronte Sud;operativa")[0].persone, 4, "e un numero vero passa");
});


/* LO STATO VUOTO È UNA REGOLA SOLA (31/07). Era scritta SEI volte, una per app,
   e non erano uguali: cinque prendevano il disegno dell'icona, Conti il suo
   NOME. È il difetto che la regola del fondatore vieta — la stessa cosa
   riscritta, che oggi si somiglia e domani no.
   Aggiunto il terzo pezzo che mancava a tutte e sei: COME SI COMINCIA. Misurato
   prima di scriverlo: 99 stati vuoti nelle sei app, ZERO con un modo di
   cominciare. È facoltativo di proposito — «Giornata tranquilla» non ha bisogno
   di un bottone. */
test("statoVuoto: i tre pezzi ci sono, e l'azione è facoltativa", () => {
  const senza = shell.statoVuoto("<svg/>", "Non hai ancora scadenze", "Ti avvisano prima che scadano.");
  ok(senza.includes("Non hai ancora scadenze"), "il titolo");
  ok(senza.includes("Ti avvisano prima che scadano."), "la spiegazione");
  ok(!senza.includes("empty-do"), "senza azione non c'è nemmeno il contenitore: niente spazio vuoto");
  const con = shell.statoVuoto("<svg/>", "Titolo", "Spiegazione", "<button>Aggiungi</button>");
  ok(con.includes('class="empty-do"'), "con l'azione compare il posto dove sta");
  ok(con.includes("<button>Aggiungi</button>"), "e l'azione dentro");
  ok(con.indexOf("empty-sub") < con.indexOf("empty-do"), "l'azione viene DOPO la spiegazione");
});
test("statoVuoto: la struttura è quella del core, invariata", () => {
  const v = shell.statoVuoto("ICONA", "T", "S");
  for (const classe of ["empty-state", "empty-icon", "empty-title", "empty-sub"])
    ok(v.includes(classe), `manca .${classe}: le sei app disegnavano questo`);
});

// ============================================================
// I MODELLI DI CSV DEL DOCUMENTO CARICANO DAVVERO
//
// `docs/ONBOARDING_DATI.md` è il documento che il primo cliente ha in mano
// mentre prepara i suoi file: per ogni import c'è un ESEMPIO da copiare. Fin
// qui nessuno legava quell'esempio al lettore che dovrà digerirlo — bastava
// cambiare una colonna nel codice e il documento restava a insegnare un
// formato che l'app rifiuta, senza che niente si lamentasse. Il difetto non
// farebbe rumore da noi: farebbe rumore il primo giorno, a casa del cliente,
// e sembrerebbe che l'app non funzioni.
//
// Il controllo prende gli esempi VERI dal documento (non copie: il file,
// letto adesso) e li dà alla funzione VERA dell'app, pretendendo che entrino
// TUTTE le righe di dati — non «almeno una»: una riga persa in silenzio è
// esattamente la cosa che nessuno nota.
//
// Controprovato due volte, il 31/07, rimettendo il difetto:
//  · cambiata l'intestazione delle gare nel documento → 3 righe invece di 2
//    (l'intestazione entra come dato, e in lista comparirebbe una gara che si
//    chiama «nome»);
//  · rotta l'estrazione dei blocchi → 17 controlli falliti invece di passare
//    a vuoto.
// ============================================================
{
  const { readFileSync } = await import("node:fs");
  const DOC = readFileSync(join(HERE, "../../../docs/ONBOARDING_DATI.md"), "utf8");

  /* Titolo della sezione → lettore che quella pagina usa davvero. Dal 31/07
     ci sono TUTTI: l'anagrafica dei lavoratori di Scudo era l'unico import
     scritto dentro la pagina, ed è stata portata in `parseLavoratoriCsv`
     proprio perché nessuna prova poteva guardarla. */
  const MAPPA = [
    ["Scudo — 1) anagrafica lavoratori", scudo.parseLavoratoriCsv],
    ["Scudo — 2) scadenzario", scudo.parseScadenzeCsv],
    ["Scudo — 3) registro infortuni", scudo.parseInfortuniCsv],
    ["Flotta — 1) parco mezzi", flotta.parseMezziCsv],
    ["Flotta — 2) ore motore", flotta.parseTelemetriaCsv],
    ["Flotta — 3) magazzino ricambi", flotta.parseRicambiCsv],
    ["Conti — 1) fatture", conti.parseFattureCsv],
    ["Conti — 2) gare", conti.parseGareCsv],
    ["Conti — 3) listino", conti.parseListinoCsv],
    ["Sentinella — sensori", sentinella.parseMonitoraggiCsv],
    ["Sentinella — 2) scadenze ambientali", sentinella.parseAdempimentiCsv],
    ["Sentinella — 3) registro volate", sentinella.parseVolateCsv],
    ["Sentinella — 4) ricettori", sentinella.parseRicettoriCsv],
    ["Terra — 1) fronti", terra.parseFrontiCsv],
    ["Terra — 2) rilievi drone", terra.parseRilieviCsv],
    ["Campo — 1) squadre", campo.parseSquadreCsv],
    ["Campo — 2) piano di carico", campo.parsePianoCsv],
  ];

  /* Primo blocco recintato di ogni sezione «## ...». */
  const esempi = new Map();
  {
    let sezione = null, dentro = false, buf = null;
    for (const r of DOC.split("\n")) {
      if (r.startsWith("## ")) { sezione = r.slice(3).trim(); dentro = false; buf = null; continue; }
      if (r.trim().startsWith("```")) {
        if (!dentro && sezione && !esempi.has(sezione)) { dentro = true; buf = []; }
        else if (dentro) { esempi.set(sezione, buf.join("\n")); dentro = false; buf = null; }
        continue;
      }
      if (dentro) buf.push(r);
    }
  }

  /* ⚠️ La rete di sicurezza del controllo stesso: se l'estrazione si rompe
     (il documento cambia forma, i blocchi non si chiudono più) la mappa resta
     vuota e TUTTI i controlli sotto passerebbero senza guardare niente. Qui si
     pretende che gli esempi si siano trovati, così un controllo inerte
     fallisce invece di mentire. */
  test("onboarding: gli esempi del documento si trovano tutti", () => {
    ok(esempi.size >= MAPPA.length,
       `esempi estratti ${esempi.size}, ne servono almeno ${MAPPA.length}`);
  });

  for (const [titolo, fn] of MAPPA) {
    test(`onboarding: l'esempio «${titolo}» entra tutto`, () => {
      const chiave = [...esempi.keys()].find(k => k.startsWith(titolo));
      ok(chiave, `nel documento non c'è nessuna sezione che inizia con «${titolo}»`);
      const testo = esempi.get(chiave);
      const attese = testo.split("\n").filter(Boolean).length - 1;   // meno l'intestazione
      ok(attese > 0, "l'esempio non ha nemmeno una riga di dati");
      const righe = fn(testo);
      ok(Array.isArray(righe), "il lettore non ha restituito un elenco");
      eq(righe.length, attese, "righe caricate dall'esempio del documento");
    });
  }
}

// ============================================================
// IL GIRO DI ANDATA E RITORNO: QUELLO CHE ESCE DEVE POTER RIENTRARE
//
// `ONBOARDING_DATI.md` promette a chi compra che **il file esportato si
// re-importa**: è la copia di sicurezza, ed è il modo di spostare i dati da
// una postazione all'altra. Una promessa del genere si rompe senza rumore —
// basta aggiungere una colonna all'export, o cambiarne l'ordine, e il file
// continua a scaricarsi benissimo. Ci si accorge il giorno in cui serve
// davvero, cioè il giorno peggiore.
//
// Misurato il 31/07 e trovato un caso vero: l'export delle **fatture** di
// Conti scrive `numero;cliente;emessa;imponibile;…`, mentre il lettore aspetta
// `numero;cliente;importo;emessa;…`. In terza posizione l'export mette una
// data e il lettore ci cerca un importo: `numIt("2026-07-15")` non è un
// numero, la riga cade, e ri-caricando il proprio export si ottengono **zero
// fatture**. Quell'export è un PROSPETTO (stato, incassato, residuo, giorni di
// pagamento: roba da commercialista), non un backup — ed è giusto che lo sia:
// quello che non va è la promessa scritta nel documento, corretta insieme a
// questo controllo.
//
// Qui si guardano i sette che il ri-caricamento lo promettono davvero.
// L'intestazione si legge dal SORGENTE della pagina, non da una copia: una
// copia invecchia in silenzio ed è precisamente il difetto che si sta
// cercando.
// ============================================================
{
  const { readFileSync } = await import("node:fs");
  const pagina = (app) => readFileSync(join(HERE, `../../${app}/index.html`), "utf8");

  /* Per ogni esportazione: il file che scarica, le colonne che il LETTORE
     legge in ordine, una riga d'esempio scritta come la scrive l'export, e
     quante righe deve restituire. */
  const GIRI = [
    { app: "campo", file: "campo_squadre.csv", fn: campo.parseSquadreCsv,
      colonne: ["nome", "persone", "area", "stato"],
      riga: "Squadra A;4;Fronte Nord;operativa" },
    { app: "conti", file: "conti_gare.csv", fn: conti.parseGareCsv,
      colonne: ["titolo", "base", "scadenza", "stato"],
      riga: "Fornitura inerti 2026;50000;2026-09-01;aperta" },
    { app: "conti", file: "conti_listino.csv", fn: conti.parseListinoCsv,
      colonne: ["nome", "unita", "prezzo", "densita", "iva"],
      riga: "Stabilizzato 0/30;t;8,50;1,9;22" },
    { app: "flotta", file: "flotta_ricambi.csv", fn: flotta.parseRicambiCsv,
      colonne: ["nome", "giacenza", "sogliaMin", "prezzo"],
      riga: "Filtro olio motore;6;4;48,00" },
    { app: "scudo", file: "scudo_registro_infortuni.csv", fn: scudo.parseInfortuniCsv,
      colonne: ["data", "tipo", "gravita", "giorniAssenza", "descrizione", "luogo"],
      riga: "2026-07-30;infortunio;lieve;3;taglio alla mano;officina" },
    { app: "scudo", file: "scudo_personale_scadenze.csv", fn: scudo.parseLavoratoriCsv,
      colonne: ["nome", "ruolo", "telefono"],   // le colonne dopo la terza non le legge
      riga: "Rossi Mario;operatore;333 1112222;idoneo;Visita medica;2026-12-01;ok" },
    { app: "sentinella", file: "sentinella_ricettori.csv", fn: sentinella.parseRicettoriCsv,
      colonne: ["nome", "tipo", "distanza", "classe", "soglia", "unita", "nota"],
      riga: "Casa Bianchi;abitazione;320;III;5;mm/s;la più vicina" },
  ];

  /* Trova l'intestazione dell'export che scarica QUEL file: si cerca il nome
     del file e si risale alla riga `csv = "…\n"` più vicina sopra di lui,
     perché è lì che l'export dichiara le proprie colonne. */
  function intestazioneExport(src, nomeFile) {
    const righe = src.split("\n");
    const giu = righe.findIndex(r => r.includes(`a.download = "${nomeFile}"`));
    if (giu < 0) return null;
    for (let k = giu; k >= 0 && k > giu - 40; k--) {
      const m = /csv = "([^"]*?)\\n"/.exec(righe[k]);
      if (m) return m[1];
    }
    return null;
  }

  for (const g of GIRI) {
    test(`giro completo: ${g.file} si ri-carica`, () => {
      const testa = intestazioneExport(pagina(g.app), g.file);
      ok(testa, `nella pagina di ${g.app} non si trova l'export che scarica ${g.file}`);
      const scritte = testa.split(";");
      /* le colonne che il lettore legge devono stare all'INIZIO e in
         quell'ordine: quelle dopo può ignorarle, quelle prima no. */
      eq(scritte.slice(0, g.colonne.length), g.colonne,
         `l'export scrive «${testa}», il lettore legge «${g.colonne.join(";")}»`);
      /* e poi la prova vera: una riga come la scrive l'export, riletta. */
      const righe = g.fn(testa + "\n" + g.riga);
      eq(righe.length, 1, "la riga esportata deve rientrare");
    });
  }


  /* IL VALORE CATTIVO DEVE TORNARE IDENTICO.
     Un nome di cliente con un punto e virgola dentro, o un'unità scritta
     «mm/s; dB(A)», sono cose che una persona scrive davvero. Se l'export non
     le protegge con csvCell, il punto e virgola spezza la riga e il pezzo dopo
     finisce nella colonna successiva — SILENZIOSAMENTE. Misurato il 31/07 su
     Sentinella: «mm/s; dB(A)» tornava con unità «mm/s» e la nota del ricettore
     diventava «dB(A)». Nessun errore, nessun avviso, un dato sbagliato.
     E l'apostrofo di guardia davanti a «=» (che impedisce a Excel di eseguire
     una formula) dev'essere tolto in lettura, altrimenti il nome cambia a ogni
     giro di export e import.
     Controprovato togliendo csvCell all'unità: la prova cade dicendo
     «atteso "mm/s; dB(A)", ottenuto "mm/s"». */
  const CATTIVI = [
    ["nome con punto e virgola", "Cava Rossi; & Figli"],
    ["nome che sembra una formula", "=SOMMA(A1:A9)"],
    ["nome con virgolette", 'Fronte "Nord"'],
  ];
  /* Il valore cattivo va provato su TUTTI e sette gli export che promettono di
     ri-caricarsi, non su uno solo: il buco di Sentinella stava proprio in uno
     che nessuno guardava. Per ognuno: il campo di testo che il cliente scrive
     (nome, titolo, descrizione) e la coda della riga come la scrive l'export. */
  const CODA = [
    ["squadre (Campo)", campo.parseSquadreCsv, ";4;Fronte Nord;operativa", "nome"],
    ["gare (Conti)", conti.parseGareCsv, ";50000;2026-09-01;aperta", "titolo"],
    ["listino (Conti)", conti.parseListinoCsv, ";t;8,50;1,9;22", "nome"],
    ["ricambi (Flotta)", flotta.parseRicambiCsv, ";6;4;48,00", "nome"],
    ["anagrafica (Scudo)", scudo.parseLavoratoriCsv, ";operatore;333 1112222", "nome"],
    ["ricettori (Sentinella)", sentinella.parseRicettoriCsv, ";abitazione;320;III;5;mm/s;", "nome"],
  ];
  for (const [che, valore] of CATTIVI) {
    for (const [dove, fn, coda, campoTesto] of CODA) {
      test(`giro completo: ${dove} — un ${che} torna identico`, () => {
        const letto = fn(shell.csvCell(valore) + coda);
        eq(letto.length, 1, "la riga non si spezza");
        eq(letto[0][campoTesto], valore, "il valore è quello di partenza, carattere per carattere");
      });
    }
  }
  /* Il registro infortuni ha il testo libero in mezzo, non in testa: la
     descrizione e il luogo sono le due colonne che il cliente scrive. */
  for (const [che, valore] of CATTIVI) {
    test(`giro completo: registro infortuni (Scudo) — un ${che} torna identico`, () => {
      const letto = scudo.parseInfortuniCsv(
        "2026-07-30;infortunio;lieve;3;" + shell.csvCell(valore) + ";" + shell.csvCell(valore));
      eq(letto.length, 1, "la riga non si spezza");
      eq(letto[0].descrizione, valore, "la descrizione resta intera");
      eq(letto[0].luogo, valore, "e anche il luogo");
    });
  }
  test("giro completo: l'unità del ricettore sopravvive al punto e virgola", () => {
    /* la riga esattamente come la scrive l'export di Sentinella */
    const c = shell.csvCell;
    const riga = [c("Casa Bianchi"), c("abitazione"), 320, c("III"), 5, c("mm/s; dB(A)"), c("vicina")].join(";");
    const r = sentinella.parseRicettoriCsv(riga)[0];
    eq(r.unita, "mm/s; dB(A)", "l'unità resta intera");
    eq(r.nota, "vicina", "e la nota non si prende il pezzo dell'unità");
  });


  /* ⛔ IL FILE SBAGLIATO NON DEVE ENTRARE. È il difetto più grosso trovato il
     31/07, e non faceva nessun rumore: ri-caricando nel listino il PROSPETTO
     dei prezzi — che è un altro file, con le colonne in un altro ordine —
     entravano tutti i prodotti con prezzo ZERO e con l'IVA presa dalla colonna
     del prezzo («Stabilizzato 0/30» con IVA 8,5%). Un listino intero
     sbagliato, pronto per finire in una fattura, senza un solo avviso.
     La difesa è semplice e non tocca i file buoni: senza un prezzo leggibile
     nella sua colonna la riga non entra. */
  test("giro completo: il prospetto dei prezzi NON entra nel listino", () => {
    const testa = intestazioneExport(pagina("conti"), "conti_listino_prezzi.csv");
    ok(testa, "l'export dei prezzi convertiti esiste");
    const letto = conti.parseListinoCsv(
      testa + "\nStabilizzato 0/30;8,5;t;1,9;8,5;16,15;22\nSabbia lavata;22;m3;1,6;13,75;22;22");
    eq(letto.length, 0, "nessuna riga: le colonne non sono quelle del listino");
  });
  test("il listino non inventa più uno zero al posto del prezzo", () => {
    /* stessa regola già scritta per i ricambi di Flotta: uno zero fa sembrare
       gratis una cosa che non lo è, e da lì passa in un DDT e in una fattura. */
    eq(conti.parseListinoCsv("Misto di cava;t;;1,9;22").length, 0,
       "una riga senza prezzo non entra");
    eq(conti.parseListinoCsv("Misto di cava;t;abc;1,9;22").length, 0,
       "e nemmeno una col prezzo illeggibile");
    const zero = conti.parseListinoCsv("Omaggio;t;0;1,9;22");
    eq(zero.length, 1, "lo zero SCRITTO APPOSTA entra: è una decisione di chi compila");
    eq(zero[0].prezzo, 0, "e vale zero");
  });


  /* ⚠️ LE PROVE QUI SOPRA GUARDANO IL LETTORE, NON L'EXPORT — e il difetto di
     Sentinella stava dall'altra parte. Costruendo la riga con `csvCell` si
     prova che il lettore sa disfare quello che `csvCell` ha fatto; NON si prova
     che l'export lo abbia usato. Per quello si guarda la riga vera nel
     sorgente, e si contano le protezioni: ogni colonna di TESTO ne vuole una.
     Sull'export dei ricettori ce n'erano 2 dove ne servivano 5, ed è così che
     l'unità usciva senza protezione. */
  const PROTEZIONI = [
    ["campo_squadre.csv", "campo", 2, "nome e area"],
    ["conti_gare.csv", "conti", 1, "titolo"],
    ["conti_listino.csv", "conti", 1, "nome"],
    ["flotta_ricambi.csv", "flotta", 1, "nome"],
    ["scudo_registro_infortuni.csv", "scudo", 2, "descrizione e luogo"],
    ["sentinella_ricettori.csv", "sentinella", 5, "nome, tipo, classe, unità, nota"],
  ];
  for (const [file, app, quante, quali] of PROTEZIONI) {
    test(`giro completo: ${file} protegge i campi di testo`, () => {
      const src = pagina(app).split("\n");
      const giu = src.findIndex(r => r.includes(`.download = "${file}"`));
      ok(giu >= 0, `non si trova l'export che scarica ${file}`);
      /* le righe che compongono il CSV stanno fra l'intestazione e il download */
      let inizio = -1;
      for (let k = giu; k >= 0 && k > giu - 40; k--) if (/csv = "/.test(src[k])) { inizio = k; break; }
      ok(inizio >= 0, "non si trova dove l'export dichiara le colonne");
      const corpo = src.slice(inizio, giu).join("\n");
      const trovate = (corpo.match(/csvCell\(/g) || []).length;
      ok(trovate >= quante,
         `${file}: ${trovate} protezioni csvCell, ne servono almeno ${quante} (${quali})`);
    });
  }

  /* Il caso trovato per strada, tenuto fermo perché non torni di nascosto:
     l'export delle fatture NON è un backup, e il documento non deve dire che
     lo sia. Se un giorno lo diventasse, questo controllo lo dice. */
  test("giro completo: l'export delle fatture di Conti resta un prospetto, non un backup", () => {
    const testa = intestazioneExport(pagina("conti"), "conti_situazione_fatture.csv");
    ok(testa, "l'export della situazione fatture esiste");
    const letto = conti.parseFattureCsv(
      testa + "\n2026/001;Edil Rossi Srl;2026-07-15;1000;22;220;1220;2026-08-14;aperta;0;1220;;;0");
    eq(letto.length, 0,
       "oggi non rientra: se qualcuno lo rende ri-caricabile, va aggiornato anche ONBOARDING_DATI.md");
  });
}

/* ══ I NUMERI CHE DIVENTANO SOLDI, E CHE NESSUNA PROVA GUARDAVA ══════════
   ────────────────────────────────────────────────────────────────────────
   Censite il 01/08 le funzioni esportate dai moduli dati e cercate una per una
   in TUTTE le suite. `importiFattura` — quella che decide imponibile, IVA e
   totale di una fattura — non compariva in nessuna. Con lei `convertiQuantita`
   (che trasforma tonnellate in metri cubi con la densità), `canonePeriodo`
   (quello che si deve all'ente per il materiale cavato) e i due prezzi per
   unità.

   Non è un buco di stile: è la parte che finisce su un documento fiscale e su
   una dichiarazione all'ente. Un errore lì non fa rumore — produce un numero
   plausibile e sbagliato, esattamente la categoria di difetto che questa suite
   esiste per prendere. */
{
  const imp = conti.importiFattura;

  test("fattura vecchia (solo `importo`): vale come imponibile, IVA zero", () => {
    const r = imp({ importo: 1000 });
    eq(r.imponibile, 1000, "l'importo diventa imponibile");
    eq(r.ivaImporto, 0, "nessuna IVA");
    eq(r.totale, 1000, "totale uguale all'imponibile");
    eq(r.conIva, false, "ed è dichiarata come fattura senza IVA");
    eq(r.aliquota, null, "senza aliquota: non se ne inventa una");
  });
  test("fattura con IVA: totale e aliquota si ricavano, non si indovinano", () => {
    const r = imp({ imponibile: 1000, ivaImporto: 220 });
    eq(r.totale, 1220, "totale = imponibile + IVA quando il totale non è scritto");
    eq(r.aliquota, 22, "l'aliquota si ricava dal rapporto IVA/imponibile");
    eq(r.conIva, true, "ed è una fattura con IVA");
  });
  test("l'aliquota scritta a mano vince su quella calcolata", () => {
    /* ⚠️ I NUMERI DI QUESTA PROVA SONO SCELTI PER DISCRIMINARE, e la prima
       versione non lo faceva: avevo scritto imponibile 1000 / IVA 100 /
       aliquota 10, ma lì il calcolo dà **anch'esso** 10 — la prova passava
       identica con e senza la riga che fa vincere l'aliquota dichiarata.
       L'ha scoperto la controprova, rimettendo il difetto: due difetti
       iniettati, uno solo trovato. Qui la scritta (10) e la calcolata (22)
       sono diverse apposta, così la prova dice davvero qualcosa.
       La ragione della regola: l'aliquota è un dato del documento, non una
       stima da ricavare per divisione. */
    const r = imp({ imponibile: 1000, ivaImporto: 220, aliquotaIva: 10 });
    eq(r.aliquota, 10, "vince l'aliquota dichiarata, non il 22 che verrebbe dal rapporto");
  });
  test("il totale scritto vince sulla somma, e non viene corretto di nascosto", () => {
    const r = imp({ imponibile: 1000, ivaImporto: 220, totale: 1219.99 });
    eq(r.totale, 1219.99, "il totale del documento resta quello del documento");
  });
  test("imponibile zero: nessuna divisione per zero, nessuna aliquota inventata", () => {
    const r = imp({ imponibile: 0, ivaImporto: 0 });
    eq(r.aliquota, null, "con imponibile zero l'aliquota non si può ricavare: null, non NaN");
    eq(r.totale, 0, "e il totale è zero");
  });
  test("una fattura assente non fa esplodere il conto", () => {
    const r = imp(null);
    eq(r.totale, 0, "totale zero");
    eq(r.conIva, false, "e nessuna IVA");
  });

  /* ── le conversioni: qui un errore cambia i metri cubi dichiarati ── */
  test("convertiQuantita: t → m³ divide per la densità, m³ → t moltiplica", () => {
    eq(conti.convertiQuantita(27, "t", "m3", 2.7), 10, "27 t a densità 2,7 fanno 10 m³");
    eq(conti.convertiQuantita(10, "m3", "t", 2.7), 27, "e 10 m³ tornano 27 t");
  });
  test("convertiQuantita: stessa unità, nessuna densità richiesta", () => {
    eq(conti.convertiQuantita(12.5, "t", "t", null), 12.5, "t → t resta uguale anche senza densità");
  });
  test("convertiQuantita senza densità utile risponde null, non zero", () => {
    /* zero sarebbe una misura, e sbagliata: null vuol dire «non lo so», ed è
       la convenzione che il resto del progetto già usa */
    eq(conti.convertiQuantita(27, "t", "m3", 0), null, "densità zero: non si sa");
    eq(conti.convertiQuantita(27, "t", "m3", -1), null, "densità negativa: non si sa");
    eq(conti.convertiQuantita(27, "t", "m3", undefined), null, "densità assente: non si sa");
  });

  /* ── il canone: è quello che si deve all'ente ── */
  const pesate = [
    { data: "2026-07-05", prodotto: "Misto", netto: 30, densita: 1.5 },
    { data: "2026-07-20", prodotto: "Misto", netto: 30, densita: 1.5 },
    { data: "2026-06-30", prodotto: "Misto", netto: 99, densita: 1.5 },   // fuori periodo
    { data: "2026-07-10", prodotto: "Sabbia", netto: 10 },                // senza densità
  ];
  test("canonePeriodo: somma solo il periodo chiesto", () => {
    const r = conti.canonePeriodo(pesate, { canoneUnita: "t", canoneAliquota: 1 }, "2026-07-01", "2026-07-31");
    eq(r.tonnellate, 70, "30 + 30 + 10, e le 99 di giugno restano fuori");
  });
  test("canonePeriodo a metri cubi: chi non ha densità NON conta come zero", () => {
    const r = conti.canonePeriodo(pesate, { canoneUnita: "m3", canoneAliquota: 2 }, "2026-07-01", "2026-07-31");
    eq(r.metriCubi, 40, "60 t a densità 1,5 fanno 40 m³; la sabbia senza densità non si somma");
    eq(r.senzaDensita, 1, "e viene CONTATA, così l'utente sa che manca un dato");
  });
  test("canonePeriodo: il dovuto è base × aliquota, per prodotto", () => {
    const r = conti.canonePeriodo(pesate, { canoneUnita: "t", canoneAliquota: 0.5 }, "2026-07-01", "2026-07-31");
    const misto = r.perProdotto.find((x) => x.prodotto === "Misto");
    eq(misto.dovuto, 30, "60 t × 0,50 €/t");
  });
  test("canonePeriodo senza aliquota non inventa un dovuto", () => {
    const r = conti.canonePeriodo(pesate, {}, "2026-07-01", "2026-07-31");
    eq(r.aliquota, 0, "aliquota assente vale zero");
    const misto = r.perProdotto.find((x) => x.prodotto === "Misto");
    eq(misto.dovuto, 0, "e il dovuto è zero, non NaN");
  });
}

/* ══ LA SOGLIA CHE DECIDE SE C'È UN SUPERAMENTO ═════════════════════════
   ────────────────────────────────────────────────────────────────────────
   `sogliaEfficace` era anche lei fra le funzioni che nessuna prova nominava, e
   non decide una sfumatura: decide **contro quale numero** si confronta una
   lettura, cioè se quella lettura diventa un superamento da mettere nel report
   che il cliente consegna all'ente.

   La regola è dichiarata anche nell'interfaccia: se il punto è collegato a un
   ricettore che ha una soglia propria **e la stessa unità**, vince quella del
   ricettore, perché è il limite scritto per quella casa. Il caso che conta
   davvero è però il terzo: unità **diverse**. Lì la funzione NON usa il numero
   del ricettore — confrontare mm/s con dB(A) darebbe un verdetto inventato —
   torna a quella del punto e alza `conflitto`, così l'interfaccia può dirlo. */
{
  const se = sentinella.sogliaEfficace;
  const casa = { id: "r1", nome: "Casa Bianchi", soglia: 3, unita: "mm/s" };

  test("soglia: vince quella del ricettore quando l'unità è la stessa", () => {
    const r = se({ ricettoreId: "r1", soglia: 5, unita: "mm/s" }, [casa]);
    eq(r.valore, 3, "il limite scritto per quella casa");
    eq(r.fonte, "ricettore", "e la fonte lo dice");
    eq(r.conflitto, false, "nessun conflitto");
  });
  test("soglia: senza ricettore collegato vale quella del punto", () => {
    const r = se({ soglia: 5, unita: "mm/s" }, [casa]);
    eq(r.valore, 5, "resta la soglia del punto");
    eq(r.fonte, "punto", "e la fonte lo dice");
  });
  test("soglia: unità DIVERSE non si confrontano, e il conflitto si dichiara", () => {
    /* è il caso per cui questa prova esiste: 3 mm/s e 55 dB(A) non sono
       confrontabili, e prendere il numero del ricettore darebbe un verdetto
       inventato su un documento che va all'ente */
    const r = se({ ricettoreId: "r1", soglia: 55, unita: "dB(A)" }, [casa]);
    eq(r.valore, 55, "si torna alla soglia del punto");
    eq(r.conflitto, true, "e si dichiara il conflitto invece di nasconderlo");
    eq(r.unitaRicettore, "mm/s", "dicendo anche quale unità aveva il ricettore");
  });
  test("soglia: un ricettore senza soglia propria non copre quella del punto", () => {
    const muto = { id: "r2", nome: "Scuola", unita: "mm/s" };
    const r = se({ ricettoreId: "r2", soglia: 4, unita: "mm/s" }, [muto]);
    eq(r.valore, 4, "vale quella del punto");
    eq(r.fonte, "punto", "e la fonte lo dice");
  });
  test("soglia: zero e negativi non sono soglie", () => {
    /* zero non è «nessun limite»: è un limite impossibile da rispettare, e
       preso sul serio farebbe risultare superata ogni singola lettura */
    const zero = { id: "r3", nome: "Cascina", soglia: 0, unita: "mm/s" };
    eq(se({ ricettoreId: "r3", soglia: 4, unita: "mm/s" }, [zero]).valore, 4,
       "una soglia zero sul ricettore non vince");
    eq(se({ soglia: -1, unita: "mm/s" }, []).valore, null,
       "e una soglia negativa sul punto non è una soglia: null");
  });
  test("soglia: un punto senza soglia e senza ricettore risponde null, non zero", () => {
    eq(se({ unita: "mm/s" }, []).valore, null, "null vuol dire «non lo so»");
  });
}

/* ══ IL PUNTO DI RIORDINO E LA VITA DELLA CAVA ══════════════════════════
   Due numeri su cui si prende una decisione vera, e nessuno dei due era
   provato: quanti pezzi tenere a magazzino prima che il fornitore consegni, e
   quanto materiale resta nella concessione. */
{
  test("punto di riordino: consumo × (consegna + sicurezza), arrotondato in su", () => {
    const r = flotta.puntoDiRiordino(0.5, 10, 4);
    eq(r.copertura, 14, "dieci giorni di consegna più quattro di sicurezza");
    eq(r.esatto, 7, "mezzo pezzo al giorno per quattordici giorni");
    eq(r.soglia, 7, "e la soglia è il numero intero di pezzi");
  });
  test("punto di riordino: si arrotonda SEMPRE in su, mai in giù", () => {
    /* mezzo pezzo non si ordina: arrotondare in giù vuol dire restare a secco
       proprio il giorno in cui il mezzo è fermo */
    const r = flotta.puntoDiRiordino(0.5, 11, 0);
    eq(r.esatto, 5.5, "il conto esatto ha i decimali");
    eq(r.soglia, 6, "ma la soglia sale a sei");
  });
  test("punto di riordino: mai sotto un pezzo", () => {
    const r = flotta.puntoDiRiordino(0.001, 1, 0);
    eq(r.soglia, 1, "un consumo piccolissimo dà comunque soglia 1, non 0");
  });
  test("punto di riordino: senza consumo o senza tempo di consegna risponde null", () => {
    /* null vuol dire «non lo so», e per un pezzo che non si sa quanto si usi è
       la risposta onesta: proporre zero sarebbe una proposta */
    eq(flotta.puntoDiRiordino(0, 10, 2), null, "nessun consumo: non si propone niente");
    eq(flotta.puntoDiRiordino(0.5, 0, 2), null, "nessun tempo di consegna: idem");
  });

  const oggi = new Date("2026-07-01T00:00:00Z");
  const aut = { volumeAutorizzatoM3: 100000, sogliaGuardiaPct: 80, anniRitmo: 3 };
  /* ⚠️ I rilievi devono avere `stato: "elaborato"`: `estrattoComplessivo`
     conta SOLO quelli, ed è giusto — un rilievo in calendario o ancora da
     elaborare non è materiale uscito dalla cava. La prima stesura di queste
     prove non lo sapeva e accusava il codice: prima di dire che c'è un
     difetto va letto come il codice si aspetta i dati. */
  const ril = (volumeM3) => [{ data: "2025-07-01", volumeM3, stato: "elaborato" }];
  test("vita cava: percentuale e residuo dal volume autorizzato", () => {
    const v = terra.vitaCava(aut, ril(25000), oggi);
    eq(v.pct, 25, "25.000 su 100.000 fanno il 25%");
    eq(v.residuo, 75000, "e restano 75.000 m³");
    eq(v.stato, "ok", "sotto la soglia di guardia");
  });
  test("vita cava: superata la soglia di guardia lo stato cambia", () => {
    const v = terra.vitaCava(aut, ril(85000), oggi);
    eq(v.stato, "warn", "85% è oltre la guardia dell'80%");
  });
  test("vita cava: il residuo non va sotto zero", () => {
    /* se si è cavato più dell'autorizzato il residuo è zero, non un numero
       negativo: un «-4.000 m³ residui» su un documento è peggio di un errore */
    const v = terra.vitaCava(aut, ril(104000), oggi);
    eq(v.residuo, 0, "residuo zero, non negativo");
    eq(v.stato, "danger", "e lo stato è rosso");
  });
  test("vita cava: senza volume autorizzato non si inventa una vita", () => {
    eq(terra.vitaCava({}, ril(1000), oggi), null,
       "null: senza il numero della concessione non c'è niente da dire");
  });
}

/* ══ IL TITOLO CHE VALE E IL RITMO CHE STIMA L'ESAURIMENTO ══════════════
   `autorizzazioneVigente` sceglie sotto quale titolo si sta cavando, e
   `ritmoMedioAnnuo` è il numero da cui esce l'anno di esaurimento della cava.
   Il ritmo ha una regola che vale la pena bloccare: conta **solo lo scavo**,
   perché il materiale ripreso da un cumulo era già stato scavato (e già
   scalato) prima — contarlo di nuovo consumerebbe due volte la concessione. */
{
  test("titolo vigente: vince quello dichiarato vigente, non il primo dell'elenco", () => {
    const scaduto = { id: "a1", numero: "111", stato: "scaduta" };
    const buono = { id: "a2", numero: "222", stato: "vigente" };
    eq(terra.autorizzazioneVigente([scaduto, buono]).numero, "222", "vince il vigente");
  });
  test("titolo vigente: senza nessun vigente si ripiega sul primo, e nulla si inventa", () => {
    eq(terra.autorizzazioneVigente([{ id: "a1", numero: "111", stato: "scaduta" }]).numero, "111",
       "si mostra quello che c'è");
    eq(terra.autorizzazioneVigente([]), null, "e con l'elenco vuoto: null");
    eq(terra.autorizzazioneVigente(null), null, "come con l'elenco assente");
  });

  const oggiR = new Date("2026-07-01T00:00:00Z");
  test("ritmo medio: volume di scavo diviso gli anni davvero coperti", () => {
    const r = terra.ritmoMedioAnnuo([
      { data: "2024-07-01", volumeM3: 10000, stato: "elaborato" },
      { data: "2026-07-01", volumeM3: 10000, stato: "elaborato" },
    ], 3, oggiR);
    eq(r.volume, 20000, "somma dei volumi elaborati nella finestra");
    eq(Math.round(r.durataAnni), 2, "dal primo rilievo a oggi: due anni");
    /* ⚠️ NON si pretende esattamente 10.000: l'anno qui dura 365,25 giorni
       (i bisestili), quindi due anni di calendario sono 1,9986 anni-media e
       il ritmo viene 10.007. È il codice ad avere ragione — pretendere il
       numero tondo avrebbe fatto passare per difetto la gestione corretta dei
       bisestili. Si controlla quindi la cosa che conta: che il ritmo sia
       quello, a meno dello scarto che i bisestili giustificano. */
    ok(Math.abs(r.annuo - 10000) < 20, `ritmo ~10.000 m³/anno, trovato ${Math.round(r.annuo)}`);
  });
  test("⛔ ritmo medio: la ripresa di CUMULI non consuma la concessione", () => {
    /* la stessa regola che `run-stile.mjs` difende alla regola 7: cumulo =
       già estratto. Se entrasse nel ritmo, l'anno di esaurimento verrebbe
       fuori prima del vero e si prenderebbero decisioni su un numero falso. */
    const r = terra.ritmoMedioAnnuo([
      { data: "2024-07-01", volumeM3: 10000, stato: "elaborato" },
      { data: "2026-07-01", volumeM3: 10000, stato: "elaborato" },
      { data: "2025-07-01", volumeM3: 50000, stato: "elaborato", provenienza: "cumulo" },
    ], 3, oggiR);
    eq(r.volume, 20000, "i 50.000 dal cumulo restano fuori dal ritmo");
  });
  test("ritmo medio: storico troppo corto non produce una media", () => {
    /* meno di tre mesi: una media su due settimane direbbe che la cava finisce
       il mese prossimo, ed è un numero peggiore di nessun numero */
    eq(terra.ritmoMedioAnnuo([{ data: "2026-06-20", volumeM3: 5000, stato: "elaborato" }], 3, oggiR),
       null, "null invece di una media senza senso");
  });
  test("ritmo medio: i rilievi non elaborati non contano", () => {
    eq(terra.ritmoMedioAnnuo([
      { data: "2024-07-01", volumeM3: 10000, stato: "in-calendario" },
      { data: "2026-07-01", volumeM3: 10000, stato: "in-calendario" },
    ], 3, oggiR), null, "un rilievo in calendario non è materiale uscito dalla cava");
  });
}

/* ══ CHI PUÒ SALIRE SU UN MEZZO ═════════════════════════════════════════
   `statoRequisito` legge, dalle scadenze di una persona, se un requisito
   (visita medica, formazione, abilitazione) è coperto. Da lì esce chi risulta
   idoneo. Non era provata.

   Due comportamenti che vanno bloccati, e sono quelli su cui un errore non fa
   rumore:
   · «nessuna riga in scadenzario» deve dare **mancante**, non «regolare» —
     l'assenza di un documento non è una conferma che va tutto bene;
   · con più rinnovi vale **l'ultimo**, cioè la data più lontana: se vincesse
     la più vecchia, una persona in regola risulterebbe scaduta e verrebbe
     tenuta ferma per niente. */
{
  const oggiS = new Date("2026-07-01T00:00:00Z");
  const req = { chiave: "visita-medica", etichetta: "Visita medica", parole: ["visita"] };

  test("requisito senza nessuna riga in scadenzario: MANCANTE, non regolare", () => {
    const r = scudo.statoRequisito(req, [], oggiS);
    eq(r.stato, "mancante", "l'assenza del documento non è una conferma");
    eq(r.scadenza, null, "e non si inventa una data");
  });
  test("requisito coperto e lontano: regolare", () => {
    const r = scudo.statoRequisito(req, [
      { id: "s1", preset: "visita-medica", dataScadenza: "2027-01-01" },
    ], oggiS);
    eq(r.stato, "regolare", "manca più di un mese");
    eq(r.scadenzaId, "s1", "e dice quale riga lo copre");
  });
  test("requisito scaduto: scaduta", () => {
    const r = scudo.statoRequisito(req, [
      { id: "s1", preset: "visita-medica", dataScadenza: "2026-06-01" },
    ], oggiS);
    eq(r.stato, "scaduta", "la data è passata");
  });
  test("⛔ con più rinnovi vale l'ULTIMO, non il primo trovato", () => {
    /* il caso vero: la visita del 2025 è stata rinnovata nel 2027. Se vincesse
       la vecchia, una persona in regola risulterebbe scaduta e resterebbe a
       terra senza motivo — un difetto che costa una giornata di lavoro a
       qualcuno e non dà nessun errore. */
    const r = scudo.statoRequisito(req, [
      { id: "vecchia", preset: "visita-medica", dataScadenza: "2025-06-01" },
      { id: "nuova", preset: "visita-medica", dataScadenza: "2027-06-01" },
    ], oggiS);
    eq(r.stato, "regolare", "vale il rinnovo più lontano");
    eq(r.scadenzaId, "nuova", "ed è quello indicato");
  });
  test("requisito riconosciuto anche per descrizione, non solo per chiave", () => {
    /* chi carica lo scadenzario da CSV non scrive le chiavi interne: scrive
       «Visita medica». Se il riconoscimento fosse solo per chiave, tutti i
       requisiti caricati da file risulterebbero mancanti. */
    const r = scudo.statoRequisito(req, [
      { id: "s9", descrizione: "Visita medica", dataScadenza: "2027-01-01" },
    ], oggiS);
    eq(r.stato, "regolare", "riconosciuto dalla descrizione");
    eq(r.scadenzaId, "s9", "ed è la riga giusta");
  });
}

/* ══ IL REPORT DI CONFORMITÀ — È IL DOCUMENTO CHE VA ALL'ENTE ═══════════
   ────────────────────────────────────────────────────────────────────────
   `reportConformita` non era provata, ed è la funzione che produce l'unica
   cosa che il cliente consegna davvero fuori dall'azienda. Qui un errore non
   fa perdere tempo: fa dichiarare il falso a un ente.

   Tre comportamenti da bloccare, tutti e tre nel verso che ASSOLVE — cioè
   quello pericoloso, perché un difetto che assolve non lo segnala nessuno:
   · la lettura **esattamente sulla soglia** conta come superamento (`>=`).
     Cambiarlo in `>` farebbe risultare conformi proprio i casi limite, che
     sono quelli su cui si discute;
   · un punto **senza letture** non è «conforme», è «senza-dati». Dire
     conforme dove non si è misurato è la bugia più facile da scrivere;
   · le letture **fuori periodo** non entrano: un report di luglio con dentro
     una misura di giugno non è il report di luglio.

   ⛔ Qui si MISURA il comportamento, non si tocca nessuna soglia: le soglie
   di sicurezza restano decisione del fondatore. */
{
  const casa = { id: "r1", nome: "Casa Bianchi", soglia: 3, unita: "mm/s" };
  const punto = (letture) => ({
    id: "m1", nome: "Vibrazioni P1", unita: "mm/s", soglia: 3, ricettoreId: "r1", letture,
  });
  const fai = (letture, extra) => sentinella.reportConformita({
    dal: "2026-07-01", al: "2026-07-31", ricettori: [casa],
    monitoraggi: [punto(letture)], ...(extra || {}),
  });

  test("report: una lettura sotto soglia è conforme", () => {
    const r = fai([{ data: "2026-07-10", valore: 2 }]);
    eq(r.esito, "conforme", "2 mm/s sotto una soglia di 3");
    eq(r.nSuperamenti, 0, "nessun superamento");
  });
  test("⛔ report: la lettura ESATTAMENTE sulla soglia è un superamento", () => {
    const r = fai([{ data: "2026-07-10", valore: 3 }]);
    eq(r.nSuperamenti, 1, "3 su soglia 3 conta come superamento");
    eq(r.esito, "non-conforme", "e il report lo dichiara");
  });
  test("⛔ report: senza letture NON è conforme, è senza-dati", () => {
    const r = fai([]);
    eq(r.esito, "senza-dati", "dire conforme dove non si è misurato sarebbe falso");
    eq(r.nLetture, 0, "e le letture sono zero");
  });
  test("⛔ report: le letture fuori periodo restano fuori", () => {
    const r = fai([
      { data: "2026-06-20", valore: 9 },   // giugno: fuori
      { data: "2026-07-10", valore: 2 },
    ]);
    eq(r.nLetture, 1, "una sola lettura nel periodo");
    eq(r.esito, "conforme", "il 9 di giugno non rende non conforme il report di luglio");
  });
  test("report: minimo, massimo e media si leggono dalle letture del periodo", () => {
    const r = fai([
      { data: "2026-07-05", valore: 1 },
      { data: "2026-07-15", valore: 2 },
    ]);
    const p = r.punti[0];
    eq(p.min, 1, "minimo");
    eq(p.max, 2, "massimo");
    eq(p.media, 1.5, "media");
  });
  test("report: filtrando per ricettore si guarda solo quel ricettore", () => {
    const altro = { id: "m2", nome: "Polveri P2", unita: "mm/s", soglia: 3,
                    ricettoreId: "r2", letture: [{ data: "2026-07-10", valore: 99 }] };
    const r = sentinella.reportConformita({
      dal: "2026-07-01", al: "2026-07-31", ricettori: [casa], ricettoreId: "r1",
      monitoraggi: [punto([{ data: "2026-07-10", valore: 2 }]), altro],
    });
    eq(r.punti.length, 1, "solo il punto di quel ricettore");
    eq(r.esito, "conforme", "e il 99 dell'altro ricettore non lo tocca");
  });
  test("report: un valore illeggibile non diventa zero, viene scartato", () => {
    /* zero sarebbe una misura, e per giunta rassicurante */
    const r = fai([{ data: "2026-07-10", valore: "non-un-numero" }]);
    eq(r.nLetture, 0, "scartata");
    eq(r.esito, "senza-dati", "e il report lo dice invece di dichiarare conforme");
  });
}

/* ══ CHI VA FERMATO, E CHI INVECE NO ════════════════════════════════════
   ────────────────────────────────────────────────────────────────────────
   `lavoratoriScoperti` è il numero che va in cima al Quadro di Scudo, perché è
   quello che **ferma il lavoro**. Sotto c'è `abilitazioneLavoratore`, che
   distingue fra ciò che BLOCCA e ciò che è solo un'attenzione.

   Quella distinzione è la cosa da difendere, e sbaglia in due modi opposti,
   tutti e due costosi:
   · se un'attenzione diventasse un blocco, si fermerebbe gente che può
     lavorare — e un'app che ferma per niente viene aggirata entro una
     settimana, che è il modo peggiore di perdere una difesa;
   · se un blocco diventasse un'attenzione, salirebbe su un mezzo chi non
     doveva. */
{
  const oggiL = new Date("2026-07-01T00:00:00Z");
  const rossi = { id: "L1", nome: "Rossi Mario", attivo: true };
  const mans = (extra) => ({ nome: "Escavatorista", lavoratoriIds: ["L1"],
                             requisiti: ["visita-medica"], dpi: [], ...(extra || {}) });
  const scad = (dataScadenza) => [{ id: "s1", lavoratoreId: "L1",
                                    preset: "visita-medica", dataScadenza }];

  test("scoperti: requisito in regola, nessuno da fermare", () => {
    const out = scudo.lavoratoriScoperti([mans()], [rossi], scad("2027-01-01"), [], oggiL);
    eq(out.length, 0, "Rossi può lavorare");
  });
  test("⛔ scoperti: requisito SCADUTO ferma la persona", () => {
    const out = scudo.lavoratoriScoperti([mans()], [rossi], scad("2026-01-01"), [], oggiL);
    eq(out.length, 1, "Rossi è scoperto");
    ok(out[0].motivi.some((m) => /scadut/i.test(m)), `il motivo lo dice: ${out[0].motivi.join(" · ")}`);
  });
  test("⛔ scoperti: requisito MANCANTE ferma la persona", () => {
    const out = scudo.lavoratoriScoperti([mans()], [rossi], [], [], oggiL);
    eq(out.length, 1, "senza la riga in scadenzario è scoperto");
    ok(out[0].motivi.some((m) => /manca/i.test(m)), "e il motivo dice che manca");
  });
  test("⛔ scoperti: «in scadenza» NON ferma — è un'attenzione, non un blocco", () => {
    /* fra venti giorni scade: va rinnovata, ma oggi la persona può lavorare.
       Fermarla sarebbe un falso allarme, e i falsi allarmi insegnano a
       ignorare anche quelli veri. */
    const out = scudo.lavoratoriScoperti([mans()], [rossi], scad("2026-07-20"), [], oggiL);
    eq(out.length, 0, "in scadenza non è scoperto");
  });
  test("⛔ scoperti: chi non è più in forza è fermo, qualunque carta abbia", () => {
    const uscito = { id: "L1", nome: "Rossi Mario", attivo: false };
    const out = scudo.lavoratoriScoperti([mans()], [uscito], scad("2027-01-01"), [], oggiL);
    eq(out.length, 1, "non è in forza");
    ok(out[0].motivi.some((m) => /forza/i.test(m)), "e il motivo lo dice");
  });
  test("⛔ scoperti: «non idoneo» ferma, «idoneo con prescrizioni» no", () => {
    const no = { id: "L1", nome: "Rossi Mario", attivo: true, idoneita: "non-idoneo" };
    const pres = { id: "L1", nome: "Rossi Mario", attivo: true, idoneita: "prescrizioni" };
    eq(scudo.lavoratoriScoperti([mans()], [no], scad("2027-01-01"), [], oggiL).length, 1,
       "il giudizio di non idoneità ferma");
    eq(scudo.lavoratoriScoperti([mans()], [pres], scad("2027-01-01"), [], oggiL).length, 0,
       "le prescrizioni no: si lavora, con le prescrizioni");
  });
  test("scoperti: una persona compare UNA volta sola, con tutte le sue mansioni", () => {
    const due = [mans(), mans({ nome: "Addetto brillamento" })];
    const out = scudo.lavoratoriScoperti(due, [rossi], [], [], oggiL);
    eq(out.length, 1, "una riga per persona, non una per mansione");
    eq(out[0].mansioni.length, 2, "ma le mansioni bloccate sono elencate tutte e due");
    eq(out[0].motivi.length, 1, "e il motivo, che è lo stesso, non si ripete");
  });
}

/* ══ IL GIRO MACCHINA: CHI L'HA FATTO E CHI HA TROVATO QUALCOSA ═════════
   `coperturaControlli` dice quanti mezzi hanno il giro fatto oggi, quali
   mancano, e **su quanti è stata trovata un'anomalia**. È il riquadro da cui
   si decide se un mezzo esce.

   ⚠️ L'ultimo dei tre numeri aveva un difetto che dipendeva dall'ORDINE
   dell'elenco, trovato il 01/08 misurando invece di leggere: il conteggio
   guardava solo il PRIMO giro di ogni mezzo. In cava un mezzo si controlla a
   ogni cambio turno, quindi il caso non è teorico — primo giro pulito, secondo
   giro con un'anomalia, e il riquadro diceva **zero anomalie**. Adesso il mezzo
   conta se l'anomalia c'è in QUALUNQUE giro della giornata. */
{
  const mezzi = [{ nome: "Dumper D4" }, { nome: "Pala PC210" }];
  const cc = flotta.coperturaControlli;

  test("giro macchina: chi non l'ha fatto finisce fra i mancanti", () => {
    const r = cc([{ data: "2026-07-01", mezzo: "Dumper D4", anomalie: 0 }], mezzi, "2026-07-01");
    eq(r.totale, 2, "due mezzi nel parco");
    eq(r.fatti, 1, "uno solo ha il giro fatto");
    eq(r.mancanti.join(","), "Pala PC210", "e si dice quale manca");
  });
  test("giro macchina: i giri di un altro giorno non contano per oggi", () => {
    const r = cc([{ data: "2026-06-30", mezzo: "Dumper D4", anomalie: 0 }], mezzi, "2026-07-01");
    eq(r.fatti, 0, "il giro di ieri non copre oggi");
    eq(r.mancanti.length, 2, "mancano tutti e due");
  });
  test("giro macchina: un giro su un mezzo non più nel parco non gonfia il conto", () => {
    const r = cc([{ data: "2026-07-01", mezzo: "Escavatore venduto", anomalie: 0 }], mezzi, "2026-07-01");
    eq(r.fatti, 0, "non è un mezzo del parco");
    eq(r.totale, 2, "e il totale resta quello del parco");
  });
  test("giro macchina: i mezzi con un'anomalia si contano una volta sola", () => {
    const r = cc([
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 2 },
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 1 },
    ], mezzi, "2026-07-01");
    eq(r.conAnomalie, 1, "un mezzo, non due giri");
  });
  test("⛔ giro macchina: l'anomalia del SECONDO turno non sparisce", () => {
    /* il difetto vero, che dipendeva dall'ordine: primo giro pulito, secondo
       giro con un'anomalia. Il riquadro diceva zero. */
    const r = cc([
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 0 },
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 3 },
    ], mezzi, "2026-07-01");
    eq(r.conAnomalie, 1, "l'anomalia trovata al secondo giro conta come il primo");
  });
  test("⛔ giro macchina: l'ordine dell'elenco non cambia il risultato", () => {
    const giri = [
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 0 },
      { data: "2026-07-01", mezzo: "Dumper D4", anomalie: 3 },
    ];
    eq(cc(giri, mezzi, "2026-07-01").conAnomalie,
       cc(giri.slice().reverse(), mezzi, "2026-07-01").conAnomalie,
       "stessa giornata, stesso numero, comunque siano ordinati i giri");
  });
}

/* ══ IL CONSUMO PER MEZZO: QUANDO SI PUÒ DIRE, E QUANDO NO ══════════════
   `consumoPerMezzo` calcola litri/ora dai rifornimenti. Il pregio da difendere
   non è la divisione — è che la funzione **si rifiuta di rispondere** quando i
   dati non bastano, e **dice perché**.

   Serve almeno un secondo rifornimento col contatore delle ore, altrimenti non
   si sa quante ore separano i due pieni. Rispondere lo stesso — con i litri
   diviso un'ora inventata — darebbe un numero su cui qualcuno deciderebbe se
   un mezzo consuma troppo. */
{
  const cpm = flotta.consumoPerMezzo;
  const p = (data, litri, ore, euro) => ({ data, mezzo: "Dumper D4", litri, ore, euro });

  test("consumo: con due pieni e il contatore si calcolano i litri/ora", () => {
    const r = cpm([p("2026-07-01", 100, 1000, 150), p("2026-07-10", 200, 1100, 300)]);
    const m = r.mezzi[0];
    eq(m.oreCoperte, 100, "cento ore fra il primo e l'ultimo pieno");
    ok(m.litriOra > 0, `litri/ora calcolati: ${m.litriOra}`);
  });
  test("⛔ consumo: con un solo contatore NON si inventa un numero", () => {
    const r = cpm([p("2026-07-01", 100, 1000, 150), p("2026-07-10", 200, null, 300)]);
    const m = r.mezzi[0];
    eq(m.litriOra, null, "null invece di un litri/ora inventato");
    /* ⚠️ È QUESTA la riga che discrimina, non quella sopra. Provato togliendo
       il ramo «dati insufficienti» su una COPIA del modulo: `litriOra` resta
       null lo stesso (con un contatore solo le ore coperte sono zero, e il
       calcolo non parte comunque), mentre la RAGIONE cambia — diventa «il
       contatore non è cambiato», che è una spiegazione sbagliata per il caso.
       Se un domani si tenesse solo l'asserzione sul numero, questa prova
       smetterebbe di misurare senza che il totale cali di uno. */
    ok(/secondo rifornimento/i.test(m.perche), `e si dice perché: ${m.perche}`);
  });
  test("⛔ consumo: senza nessun contatore si dice che manca il contatore", () => {
    const r = cpm([p("2026-07-01", 100, null, 150), p("2026-07-10", 200, null, 300)]);
    const m = r.mezzi[0];
    eq(m.litriOra, null, "niente numero");
    ok(/contatore/i.test(m.perche), `e la ragione è quella giusta: ${m.perche}`);
  });
  test("consumo: i litri comunque si sommano, anche senza contatore", () => {
    /* il consumo orario non si può dire, ma i litri messi nel serbatoio sì:
       sono un dato certo e servono per la spesa */
    const r = cpm([p("2026-07-01", 100, null, 150), p("2026-07-10", 200, null, 300)]);
    eq(r.mezzi[0].litri, 300, "trecento litri in tutto");
    eq(r.mezzi[0].euro, 450, "e quattrocentocinquanta euro");
  });
  test("consumo: un rifornimento senza litri non entra", () => {
    const r = cpm([p("2026-07-01", 0, 1000, 0), p("2026-07-10", 200, 1100, 300)]);
    eq(r.mezzi[0].litri, 200, "il pieno da zero litri non è un pieno");
  });
}

/* ══ IL PROSSIMO TAGLIANDO — DA DOVE RIPARTE IL CONTO ═══════════════════
   `prossimoTagliando` decide quando un mezzo andrà fermato per la
   manutenzione. La regola scritta nel modulo, e che qui si blocca:

   > si riparte dalle ore che il mezzo ha **adesso**, non da quelle previste.

   Se il tagliando dei 6000 h è stato fatto a **6040**, il prossimo cade a
   6040 + passo. Ripartire dalle 6000 previste vorrebbe dire che ogni ritardo
   si accumula in silenzio: dopo cinque tagliandi il mezzo gira con duecento
   ore di manutenzione arretrata, e il piano continua a dire che è a posto.

   E i decimi: i contaore contano i decimi, quindi 5875,5 non diventa 5876 —
   scriveremmo «il contatore segna adesso 5.876 ore», un numero che quel
   contatore non ha mai detto. */
{
  const pt = flotta.prossimoTagliando;

  test("⛔ tagliando a ore: si riparte dalle ore VERE, non da quelle previste", () => {
    const r = pt({ titolo: "Tagliando 500h", mezzo: "Dumper D4", ogniOre: 500 }, 6040, "2026-07-01");
    eq(r.orePreviste, 6540, "6040 (le ore vere) + 500, non 6000 + 500");
    eq(r.oreBase, 6040, "e si dichiara da quali ore si è ripartiti");
    eq(r.da, "ore", "il criterio è quello a ore");
  });
  test("tagliando a ore: i decimi del contatore non si arrotondano all'ora", () => {
    const r = pt({ titolo: "T", ogniOre: 500 }, 5875.5, "2026-07-01");
    eq(r.oreBase, 5875.5, "il contatore segna 5875,5 e resta 5875,5");
  });
  test("tagliando a calendario: dalla data di chiusura più i mesi del passo", () => {
    const r = pt({ titolo: "Revisione", ogniMesi: 12 }, null, "2026-07-01");
    eq(r.dataPrevista, "2027-07-01", "un anno dopo la chiusura");
    eq(r.da, "mesi", "il criterio è quello a calendario");
    eq(r.orePreviste, null, "e non si mette anche una soglia a ore");
  });
  test("tagliando: senza passo non si programma niente", () => {
    /* comportamento dichiarato: una manutenzione una tantum non genera il
       prossimo appuntamento, e inventarlo riempirebbe lo scadenzario di
       scadenze che nessuno ha chiesto */
    eq(pt({ titolo: "Riparazione una tantum" }, 6040, "2026-07-01"), null, "nessun passo, nessun piano");
  });
  test("tagliando a ore: senza il contatore non si programma a ore", () => {
    eq(pt({ titolo: "T", ogniOre: 500 }, null, "2026-07-01"), null,
       "senza le ore attuali il conto non si può fare, e non si tira a indovinare");
    eq(pt({ titolo: "T", ogniOre: 500 }, -1, "2026-07-01"), null, "e un contatore negativo non è un contatore");
  });
}

/* ══ LA NUMERAZIONE DELLE FATTURE ═══════════════════════════════════════
   `prossimoNumero` propone il numero della prossima fattura. Non era provata,
   ed è una di quelle cose in cui un errore non si vede subito e poi non si può
   più sistemare: due fatture con lo stesso numero sono un'irregolarità, e la
   correzione a posteriori richiede una nota di credito.

   Il comportamento che conta di più è quello sui **buchi**: se esistono la 001
   e la 005, la prossima è la **006**, non la 002. Riempire un buco vorrebbe
   dire riusare il numero di una fattura annullata — cioè creare il doppione
   che si voleva evitare. */
{
  const pn = conti.prossimoNumero;

  test("numerazione: il primo numero dell'anno", () => {
    eq(pn([], 2026), "2026/001", "si comincia da uno, con lo zero davanti");
  });
  test("numerazione: si continua dal più alto", () => {
    eq(pn(["2026/001", "2026/002"], 2026), "2026/003", "il massimo più uno");
  });
  test("⛔ numerazione: i buchi NON si riempiono", () => {
    /* la 002, 003 e 004 possono essere state annullate: riusarle creerebbe
       due documenti con lo stesso numero, che è l'irregolarità vera */
    eq(pn(["2026/001", "2026/005"], 2026), "2026/006", "si va oltre il massimo, non nel buco");
  });
  test("numerazione: gli anni diversi non si mescolano", () => {
    eq(pn(["2025/041", "2026/002"], 2026), "2026/003", "il 41 del 2025 non conta per il 2026");
    eq(pn(["2025/041"], 2026), "2026/001", "e un anno nuovo riparte da uno");
  });
  test("numerazione: si riconosce anche la forma «001/2026»", () => {
    /* chi arriva da un altro gestionale scrive spesso numero/anno: se non la
       riconoscessimo, la proposta ripartirebbe da 001 e sarebbe un doppione */
    eq(pn(["007/2026"], 2026), "2026/008", "letta anche al contrario");
  });
  test("numerazione: le righe che non sono numeri non spostano il conto", () => {
    eq(pn(["", null, "bozza", "2026/002"], 2026), "2026/003", "solo i numeri veri contano");
  });
  test("numerazione: le cifre di riempimento si rispettano", () => {
    eq(pn(["2026/009"], 2026, 5), "2026/00010", "cinque cifre se cinque sono chieste");
  });
}

/* ══ DAI DDT ALLA FATTURA: NIENTE VIAGGI FATTURATI DUE VOLTE ════════════
   È il flusso vero della cava: tanti viaggi documentati da DDT nel mese, UNA
   fattura riepilogativa. Due funzioni, nessuna delle due provata, e tutte e
   due su cose che diventano soldi:

   · `pesateDaFatturare` sceglie **quali** viaggi entrano. La riga che fa tutto
     il lavoro è `filter(p => !p.fatturaId)`: senza, un DDT già fatturato
     tornerebbe in una seconda fattura, e il cliente pagherebbe due volte lo
     stesso viaggio.
   · `righeDaPesate` raggruppa per prodotto — ma a **parità di prezzo, unità e
     aliquota**. Due prezzi diversi dello stesso prodotto restano due righe, ed
     è come deve essere: fonderle darebbe un prezzo medio che non è quello di
     nessun DDT, su un documento fiscale. */
{
  const ddt = (id, extra) => ({ id, numero: id, data: "2026-07-10", clienteId: "C1",
    prodotto: "Misto", prodottoId: "P1", netto: 10, prezzoUnitario: 5,
    unitaVendita: "t", aliquotaIva: 22, ...(extra || {}) });

  test("⛔ DDT: quelli già fatturati non tornano in una seconda fattura", () => {
    const out = conti.pesateDaFatturare([
      ddt("d1"),
      ddt("d2", { fatturaId: "F-2026-001" }),
    ], "C1");
    eq(out.length, 1, "solo quello non ancora fatturato");
    eq(out[0].id, "d1", "ed è quello giusto");
  });
  test("DDT: si prendono solo quelli del cliente e del periodo chiesti", () => {
    const tutti = [
      ddt("d1"),
      ddt("d2", { clienteId: "C2" }),
      ddt("d3", { data: "2026-06-01" }),
    ];
    eq(conti.pesateDaFatturare(tutti, "C1", "2026-07-01", "2026-07-31").length, 1,
       "un cliente, un periodo, un viaggio");
  });
  test("DDT: senza cliente si prendono quelli di tutti", () => {
    eq(conti.pesateDaFatturare([ddt("d1"), ddt("d2", { clienteId: "C2" })], "").length, 2,
       "il filtro cliente è facoltativo");
  });

  test("righe: i viaggi dello stesso prodotto si sommano in una riga sola", () => {
    const r = conti.righeDaPesate([ddt("d1"), ddt("d2")]);
    eq(r.length, 1, "una riga");
    eq(r[0].quantita, 20, "venti tonnellate in tutto");
    eq(r[0].imponibile, 100, "venti per cinque euro");
    eq(r[0].ddt.length, 2, "e la riga porta con sé i due numeri di DDT");
  });
  test("⛔ righe: prezzi diversi dello stesso prodotto NON si fondono", () => {
    /* fonderle darebbe un prezzo medio che non è quello di nessun DDT, su un
       documento fiscale in cui ogni riga deve essere verificabile */
    const r = conti.righeDaPesate([ddt("d1"), ddt("d2", { prezzoUnitario: 7 })]);
    eq(r.length, 2, "due prezzi, due righe");
  });
  test("⛔ righe: unità diverse non si sommano fra loro", () => {
    const r = conti.righeDaPesate([ddt("d1"), ddt("d2", { unitaVendita: "m3", quantita: 4 })]);
    eq(r.length, 2, "tonnellate e metri cubi restano separati");
  });
  test("righe: aliquote diverse restano righe diverse (serve al registro IVA)", () => {
    const r = conti.righeDaPesate([ddt("d1"), ddt("d2", { aliquotaIva: 10 })]);
    eq(r.length, 2, "ogni aliquota fa storia a sé");
  });
}

/* ══ LE LETTURE DEL SISMOGRAFO CHE ARRIVANO DA UN FILE ══════════════════
   `unisciLetture` mette insieme le letture importate e quelle già registrate.
   Da qui esce il report che va all'ente, quindi tre cose devono valere:

   · i doppioni si scartano — **anche quelli dentro lo stesso file**, che è la
     forma che sfuggiva a tutti gli import prima del 31/07;
   · quando si supera il tetto si tengono le letture **più recenti**, non le
     prime capitate;
   · e quante ne sono state **tagliate** si dice, invece di lasciarle sparire
     in silenzio. Una misura che scompare senza una riga è peggio di una misura
     mancante: nessuno la va a cercare. */
{
  const ul = sentinella.unisciLetture;
  const L = (data, valore, ora) => ({ data, valore, ...(ora ? { ora } : {}) });

  test("letture: le nuove si aggiungono a quelle che c'erano", () => {
    const r = ul([L("2026-07-01", 1)], [L("2026-07-02", 2)]);
    eq(r.aggiunte, 1, "una aggiunta");
    eq(r.letture.length, 2, "e in tutto sono due");
  });
  test("⛔ letture: il doppione di una già presente viene scartato e contato", () => {
    const r = ul([L("2026-07-01", 1)], [L("2026-07-01", 1)]);
    eq(r.aggiunte, 0, "niente aggiunte");
    eq(r.duplicati, 1, "e il doppione si dichiara");
  });
  test("⛔ letture: due righe uguali DENTRO lo stesso file entrano una volta sola", () => {
    /* è la forma di doppione che nel progetto era sfuggita a tutti e dieci gli
       import: si confrontava solo con l'archivio, che non si aggiorna mentre
       il file scorre */
    const r = ul([], [L("2026-07-01", 1), L("2026-07-01", 1)]);
    eq(r.aggiunte, 1, "una sola");
    eq(r.duplicati, 1, "e l'altra è dichiarata doppione");
  });
  test("letture: stessa data e ora ma valore diverso NON è un doppione", () => {
    const r = ul([], [L("2026-07-01", 1, "08:00"), L("2026-07-01", 2, "08:00")]);
    eq(r.aggiunte, 2, "sono due misure diverse");
  });
  test("letture: si riordinano per data e ora", () => {
    const r = ul([], [L("2026-07-03", 3), L("2026-07-01", 1), L("2026-07-02", 2)]);
    eq(r.letture.map((x) => x.valore).join(","), "1,2,3", "in ordine di tempo");
  });
  test("⛔ letture: oltre il tetto si tengono le PIÙ RECENTI, e si dice quante sono cadute", () => {
    const molte = Array.from({ length: 5 }, (_, i) => L(`2026-07-0${i + 1}`, i + 1));
    const r = ul([], molte, 3);
    eq(r.letture.length, 3, "tre tenute");
    eq(r.letture.map((x) => x.valore).join(","), "3,4,5", "le ultime tre, non le prime");
    eq(r.tagliate, 2, "e le due cadute si dichiarano");
  });
}

/* ══ LA PRODUZIONE DEL GIORNO, PER UNITÀ E PER TURNO ════════════════════
   `totaliProduzione` somma quanto è uscito dalla cava. La regola che va
   difesa è scritta anche nell'interfaccia: **tonnellate e metri cubi restano
   separati**. Sommarli darebbe un numero che non è né l'uno né l'altro, e che
   sembrerebbe comunque plausibile — la categoria peggiore.

   E la produzione **non dichiarata** non è zero: un rapportino senza quantità
   semplicemente non partecipa, invece di tirare giù la media. */
{
  const tp = campo.totaliProduzione;
  const rap = (turno, prodQta, prodUnita) => ({ turno, prodQta, prodUnita });

  test("⛔ produzione: tonnellate e metri cubi NON si sommano fra loro", () => {
    const r = tp([rap("Mattino", 100, "t"), rap("Mattino", 40, "m³")]);
    eq(r.perUnita.t, 100, "cento tonnellate");
    eq(r.perUnita["m³"], 40, "e quaranta metri cubi, separati");
  });
  test("produzione: i turni si sommano fra loro, unità per unità", () => {
    const r = tp([rap("Mattino", 100, "t"), rap("Pomeriggio", 50, "t")]);
    eq(r.perUnita.t, 150, "centocinquanta in giornata");
    eq(r.perTurno.length, 2, "e due turni distinti");
  });
  test("⛔ produzione: un rapportino senza quantità non conta come zero", () => {
    /* zero abbasserebbe la media di giornata; «non dichiarata» invece non
       partecipa, ed è la verità */
    const r = tp([rap("Mattino", 100, "t"), rap("Pomeriggio", null, "t")]);
    eq(r.perUnita.t, 100, "resta cento");
    eq(r.perTurno.length, 1, "e il turno senza produzione non compare fra i totali");
  });
  test("produzione: una quantità negativa o zero non è una produzione", () => {
    eq(Object.keys(tp([rap("Mattino", 0, "t"), rap("Sera", -5, "t")]).perUnita).length, 0,
       "nessun totale da dichiarare");
  });
  test("produzione: i turni escono nell'ordine della giornata, non alfabetico", () => {
    const r = tp([rap("Sera", 10, "t"), rap("Mattino", 20, "t")]);
    eq(r.perTurno[0].turno, "Mattino", "prima il mattino, anche se è arrivato dopo");
  });
  test("produzione: un turno non compilato finisce sotto «Senza turno»", () => {
    const r = tp([rap("", 10, "t")]);
    eq(r.perTurno[0].turno, "Senza turno", "detto, non nascosto");
  });
}

/* ══ L'IMPORT DAL SISMOGRAFO: LEGGERE IL FILE PRIMA DI FIDARSENE ════════
   `proponiMappa` indovina quale colonna è data, ora e valore; `preparaLetture`
   applica quella scelta e restituisce **una voce per ogni riga del file**,
   buona o scartata che sia. È il gemello di `unisciLetture`, e sta a monte:
   qui si decide *cosa* entra nella serie storica che finisce nel report per
   l'ente.

   Le regole che valgono il lavoro:

   · **nessuna riga sparisce in silenzio.** Ogni riga torna indietro con `ok` e,
     se scartata, con il motivo scritto in italiano. Un import muto è il modo
     migliore per perdere dati senza accorgersene: nessun errore, nessun
     avviso, solo una serie storica più corta di quella che si è caricata;
   · **il numero di riga è quello del FILE**, intestazione compresa. Chi legge
     «riga 5» va a cercarla nel foglio: se contassimo le righe di dati, la
     riga 5 dell'anteprima sarebbe la 6 del file e l'utente correggerebbe la
     cella sbagliata;
   · **due numeri di due cifre si leggono GIORNO/MESE**, mai mese/giorno. Su
     `07/12/2026` la differenza fra le due letture è di cinque mesi, su una
     data che va su un documento;
   · **una data impossibile si scarta, non si "corregge"**. Il 31/02 non
     diventa il 3 marzo: diventa una riga rossa con scritto perché. */
{
  const pl = sentinella.preparaLetture;
  const M = { colData: 0, colOra: -1, colValore: 2 };

  test("⛔ import: nessuna riga sparisce, ognuna torna col suo motivo", () => {
    const r = pl([
      ["12/07/2026", "", "2,5"],
      ["12/07/2026", "", ""],
      ["", "", "1"],
      ["12/07/2026", "", "abc"],
    ], M);
    eq(r.length, 4, "quattro righe dentro, quattro voci fuori");
    eq(r.map((x) => x.ok).join(","), "true,false,false,false", "una buona e tre scartate");
    eq(r.filter((x) => !x.ok).every((x) => x.motivo !== ""), true, "e ognuna dice perché");
  });
  test("⛔ import: il numero di riga è quello del file, intestazione compresa", () => {
    /* l'utente va a cercare «riga 2» nel foglio: se contassimo le righe di
       dati correggerebbe la cella sbagliata */
    const r = pl([["Data", "Ora", "PPV"], ["", "", "1"]], { ...M, conIntestazione: true });
    eq(r.length, 1, "l'intestazione non è un dato");
    eq(r[0].riga, 2, "ma la riga scartata è la 2 del file, non la 1");
  });
  test("⛔ import: 07/12/2026 è il 7 dicembre (giorno/mese), non il 12 luglio", () => {
    eq(pl([["07/12/2026", "", "1"]], M)[0].data, "2026-12-07", "regola italiana, dichiarata anche a schermo");
  });
  test("⛔ import: una data impossibile si scarta, non si «corregge»", () => {
    const r = pl([["31/02/2026", "", "1"]], M)[0];
    eq(r.data, "", "il 31 febbraio non diventa il 3 marzo");
    eq(r.motivo, "data non riconosciuta", "e lo dice");
  });
  test("import: data e ora nella stessa cella si leggono lo stesso", () => {
    /* molti strumenti scrivono «12/07/2026 10:30» in una casella sola */
    const r = pl([["12/07/2026 10:30", "", "2,5"]], M)[0];
    eq(r.data, "2026-07-12", "la data");
    eq(r.ora, "10:30", "e l'ora, senza chiedere una colonna che non c'è");
  });
  test("⛔ import: se la colonna dell'ora è vuota, l'ora si cerca nella cella della data", () => {
    /* il caso vero: il file scrive «12/07/2026 08:00» nella cella della data
       E ha una colonna Ora che per quelle righe è vuota. Prima l'ora veniva
       buttata, e allora due misure dello stesso giorno con lo stesso valore
       avevano la STESSA firma (data + ora + valore): la seconda spariva come
       doppione, e l'interfaccia annunciava «1 doppione scartato» — una frase
       sicura e non vera, su una serie storica che va all'ente */
    const r = pl([["12/07/2026 08:00", "", "0,5"], ["12/07/2026 14:00", "", "0,5"]],
                 { colData: 0, colOra: 1, colValore: 2 });
    eq(r.map((x) => x.ora).join(","), "08:00,14:00", "le due ore ci sono");
    const buone = r.filter((x) => x.ok).map((x) => ({ data: x.data, valore: x.valore, ora: x.ora }));
    const u = sentinella.unisciLetture([], buone);
    eq(u.aggiunte, 2, "e restano due misure");
    eq(u.duplicati, 0, "nessun doppione da annunciare");
  });
  test("import: la colonna dell'ora scelta vince su quella scritta nella data", () => {
    /* la ricerca nella cella della data è un RIPIEGO, non una sovrascrittura:
       se l'utente ha indicato dove sta l'ora, quella è l'ora */
    const r = pl([["12/07/2026 08:00", "14:30", "0,5"]], { colData: 0, colOra: 1, colValore: 2 })[0];
    eq(r.ora, "14:30", "quella della colonna");
  });
  test("import: la notazione scientifica dello strumento è un numero", () => {
    /* già costata una volta in questo progetto: gli export delle macchine
       scrivono 1.2e-3, e irrigidire il lettore fa sparire quelle righe */
    eq(pl([["12/07/2026", "", "1.2e-3"]], M)[0].valore, 0.0012, "0,0012 mm/s");
  });
  test("⛔ import: «manca» e «non è un numero» sono due motivi diversi", () => {
    /* suggeriscono due azioni diverse: la prima cella è da compilare, la
       seconda da correggere */
    eq(pl([["12/07/2026", "", ""]], M)[0].motivo, "valore mancante", "vuota");
    eq(pl([["12/07/2026", "", "n.d."]], M)[0].motivo, "valore non numerico", "scritta male");
  });
  test("import: un valore negativo non è una misura", () => {
    eq(pl([["12/07/2026", "", "-1"]], M)[0].motivo, "valore negativo", "una PPV negativa non esiste");
  });
  test("⛔ import: lo zero è una misura buona, non un dato mancante", () => {
    /* il fondo scala di una giornata senza volate è zero: scartarlo
       toglierebbe dal report proprio i giorni tranquilli */
    const r = pl([["12/07/2026", "", "0"]], M)[0];
    eq(r.ok, true, "accettata");
    eq(r.valore, 0, "e vale zero");
  });
  test("import: senza righe non si inventa niente", () => {
    eq(pl([], M).length, 0, "vuoto");
    eq(pl(null, null).length, 0, "e nemmeno con la mappa mancante");
  });

  const pm = sentinella.proponiMappa;
  test("mappa: l'intestazione dice quale colonna è quale", () => {
    eq(pm([["Data", "Time", "LAeq"], ["12/07/2026", "10:30", "61,2"]], true),
       { colData: 0, colOra: 1, colValore: 2 }, "data, ora e valore riconosciuti");
  });
  test("⛔ mappa: una colonna non fa due mestieri", () => {
    /* «Data/Ora» contiene sia «data» sia «ora»: senza l'esclusione finirebbe
       proposta per tutt'e due, e l'ora verrebbe letta due volte al posto del
       valore */
    const m = pm([["Data/Ora", "PPV"], ["12/07/2026 10:30", "2,5"]], true);
    eq(m.colData, 0, "è la data");
    eq(m.colOra !== m.colData, true, "e non è anche l'ora");
    eq(m.colValore, 1, "il valore è l'altra");
  });
  test("mappa: senza intestazione si va a colpo d'occhio sui dati", () => {
    /* prima colonna che sembra una data, ultima colonna numerica come valore */
    const m = pm([["2,5", "12/07/2026"]], false);
    eq(m.colData, 1, "la data è dove c'è una data, non dove capita");
    eq(m.colValore, 0, "e il valore è l'altra");
  });
  test("mappa: un'intestazione che non dice niente non blocca la proposta", () => {
    const m = pm([["A", "B", "C"], ["12/07/2026", "10:30", "2,5"]], true);
    eq(m.colData, 0, "ripiega sui dati");
    eq(m.colValore, 2, "e prende l'ultima numerica");
  });
}

/* ══ IL PROGRAMMA DI MONITORAGGIO: «SONO IN REGOLA CON LE MISURE?» ══════
   L'autorizzazione dice ogni quanto va misurato ogni punto. Queste funzioni
   rispondono alla domanda che l'azienda si fa davvero — *sono indietro?* — e
   accendono l'allerta nel quadro. Sbagliare qui non produce un numero storto:
   produce un **verde tranquillo su una misura che l'ente si aspettava**.

   Le regole bloccate:

   · **si riparte dall'ultima misura VERA, non da quella prevista.** Misura dei
     7 giorni fatta all'undicesimo → la prossima cade all'undicesimo + 7. È lo
     stesso principio del tagliando in Flotta, ed è quello che impedisce al
     ritardo di accumularsi in silenzio;
   · **la tolleranza separa il giallo dal rosso, e il confine è preciso**:
     scaduta da *tolleranza* giorni è ancora «da fare»; il giorno dopo è «in
     ritardo». Un confine spostato di uno cambia il colore di una tessera;
   · **«mai misurato» è un avviso, non un allarme**: può essere un punto appena
     creato, e un rosso che non serve insegna a ignorare i rossi;
   · **una riga che punta a un punto sparito resta visibile.** Sparire in
     silenzio toglierebbe dall'elenco proprio l'obbligo che nessuno sta più
     seguendo;
   · **l'ordine è l'urgenza, non l'alfabeto**: prima il ritardo più lungo. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const punto = (id, nome, ...date) => ({ id, nome, letture: date.map((d) => ({ data: d, valore: 1 })) });
  const riga = (o) => ({ monitoraggioId: "m1", ogniGiorni: 7, tolleranzaGiorni: 3, ...o });
  const stato = (r, m) => sentinella.statoRigaProgramma(r, m, OGGI);

  test("programma: la prossima misura si conta dall'ultima fatta", () => {
    const s = stato(riga(), punto("m1", "Casa", "2026-07-29"));
    eq(s.prossima, "2026-08-05", "ultima + sette giorni");
    eq(s.stato, "in-regola", "e per ora è in regola");
    eq(s.label, "Fra 5 giorni", "detto in giorni, non in date da tradurre");
  });
  test("⛔ programma: si riparte dalla misura VERA, non da quella prevista", () => {
    /* misura dei 7 giorni fatta all'undicesimo: la prossima cade
       all'undicesimo + 7, altrimenti ogni ritardo si somma al successivo e
       dopo cinque giri il punto è indietro di un mese col semaforo verde */
    const s = stato(riga({ dal: "2026-07-01" }), punto("m1", "Casa", "2026-07-12"));
    eq(s.prossima, "2026-07-19", "dal 12, non dall'8 che era la scadenza teorica");
  });
  test("⛔ programma: scaduta da quanto vale la tolleranza è ancora «da fare»", () => {
    const s = stato(riga(), punto("m1", "Casa", "2026-07-21"));   // prossima 28/07, oggi 31
    eq(s.stato, "da-fare", "tre giorni di ritardo, tolleranza tre");
    eq(s.cls, "warn", "giallo");
    eq(s.label, "Da fare da 3 giorni", "e si dice da quanto");
  });
  test("⛔ programma: il giorno dopo la tolleranza diventa «in ritardo»", () => {
    const s = stato(riga(), punto("m1", "Casa", "2026-07-20"));   // prossima 27/07, oggi 31
    eq(s.stato, "in-ritardo", "quattro giorni, tolleranza tre");
    eq(s.cls, "danger", "rosso");
    eq(s.label, "In ritardo di 4 giorni", "e si dice di quanto");
  });
  test("programma: scaduta oggi si dice «Da fare oggi», non «da 0 giorni»", () => {
    eq(stato(riga(), punto("m1", "Casa", "2026-07-24")).label, "Da fare oggi", "in italiano");
  });
  test("⛔ programma: «mai misurato» è un avviso, non un allarme", () => {
    /* può essere un punto appena creato: un rosso che non serve insegna a
       ignorare i rossi */
    const s = stato(riga(), punto("m1", "Casa"));
    eq(s.stato, "mai", "mai misurato");
    eq(s.cls, "warn", "giallo, non rosso");
    eq(s.maiMisurato, true, "e la pagina lo sa senza rileggere le letture");
  });
  test("programma: senza letture si parte dalla data di inizio, se c'è", () => {
    const s = stato(riga({ dal: "2026-07-01" }), punto("m1", "Casa"));
    eq(s.stato, "in-ritardo", "l'obbligo è partito il primo, la prima misura era l'8");
  });
  test("programma: una riga sospesa non è né in regola né in ritardo", () => {
    const s = stato(riga({ attivo: false }), punto("m1", "Casa", "2026-01-01"));
    eq(s.stato, "sospesa", "sospesa");
    eq(s.cls, "", "e niente semaforo: non chiede niente a nessuno");
  });
  test("programma: senza frequenza non si finge una scadenza", () => {
    const s = stato(riga({ ogniGiorni: 0 }), punto("m1", "Casa", "2026-01-01"));
    eq(s.stato, "senza-frequenza", "manca il dato, e si chiede");
    eq(s.prossima, null, "invece di inventare una data");
  });
  test("⛔ programma: l'ultima misura è quella più recente per data E ora", () => {
    const m = { letture: [
      { data: "2026-07-30", ora: "18:00", valore: 9 },
      { data: "2026-07-30", ora: "08:00", valore: 1 },
      { data: "2026-07-29", valore: 5 }] };
    eq(sentinella.ultimaLettura(m).valore, 9, "le 18, non l'ultima riga dell'elenco");
  });
  test("programma: una lettura senza valore leggibile non è l'ultima misura", () => {
    const m = { letture: [{ data: "2026-07-30", valore: "boh" }, { data: "2026-07-29", valore: 5 }] };
    eq(sentinella.ultimaLettura(m).data, "2026-07-29", "l'ultima buona");
  });

  const prog = [riga({ monitoraggioId: "m1" }), riga({ monitoraggioId: "m2" }), riga({ monitoraggioId: "sparito" })];
  const punti = [punto("m1", "Casa Rossi", "2026-07-01"), punto("m2", "Aaa scuola", "2026-07-10")];

  test("⛔ programma: l'ordine è l'urgenza, non l'alfabeto", () => {
    const v = sentinella.programmaEsteso(prog, punti, OGGI);
    eq(v[0].nome, "Casa Rossi", "23 giorni di ritardo prima di 14, anche se viene dopo nell'alfabeto");
    eq(v[1].nome, "Aaa scuola", "poi il ritardo più corto");
  });
  test("⛔ programma: la riga di un punto sparito resta visibile", () => {
    /* sparire in silenzio toglierebbe dall'elenco proprio l'obbligo che
       nessuno sta più seguendo */
    const v = sentinella.programmaEsteso(prog, punti, OGGI);
    eq(v.length, 3, "tre righe dentro, tre fuori");
    eq(v[2].nome, "Punto non più in elenco", "detto, non nascosto");
  });
  test("programma: il riepilogo conta tutte le righe, nessuna esclusa", () => {
    const r = sentinella.riepilogoProgramma(prog, punti, OGGI);
    eq(r.totale, 3, "il totale è il numero di righe");
    eq(r.inRitardo + r.daFare + r.mai + r.sospese + r.senzaFrequenza + r.inRegola, r.totale,
       "e la somma degli stati torna: nessuna riga cade fuori dal conto");
  });
  test("⛔ programma: nelle allerte finisce solo ciò che chiede un'azione", () => {
    const sospese = [riga({ monitoraggioId: "m1", attivo: false })];
    eq(sentinella.allerteProgramma(sospese, punti, OGGI).length, 0, "una riga sospesa non allerta nessuno");
    const a = sentinella.allerteProgramma(prog, punti, OGGI);
    eq(a.length, 3, "le altre tre sì");
    eq(a[0].categoria, "programma", "stessa forma delle allerte del quadro");
    eq(a[0].gravita, "danger", "il ritardo è rosso");
    eq(a[2].gravita, "warn", "il mai misurato è giallo");
  });
  test("programma: l'allerta dice ogni quanto e da quando non si misura", () => {
    const a = sentinella.allerteProgramma(prog, punti, OGGI)[0];
    eq(a.dettaglio.includes("ogni settimana"), true, "la frequenza in parole");
    eq(a.dettaglio.includes("01/07/2026"), true, "e la data dell'ultima misura");
  });
  test("programma: senza nessuna misura l'allerta lo scrive, non lascia il vuoto", () => {
    const a = sentinella.allerteProgramma([riga({ monitoraggioId: "sparito" })], punti, OGGI)[0];
    eq(a.dettaglio.includes("nessuna misura registrata"), true, "detto in italiano");
  });

  test("programma: la frequenza si dice in parole quando ha un nome", () => {
    eq(sentinella.etichettaFrequenza(30), "ogni mese", "trenta giorni");
    eq(sentinella.etichettaFrequenza(7), "ogni settimana", "sette");
    eq(sentinella.etichettaFrequenza(45), "ogni 45 giorni", "e quando un nome non c'è si dicono i giorni");
    eq(sentinella.etichettaFrequenza(0), "frequenza non impostata", "zero non è una frequenza");
  });
  test("⛔ programma: il conto dei giorni non inciampa nell'ora legale", () => {
    /* il 29 marzo 2026 l'ora legale toglie un'ora: contando in ora locale la
       somma scivolerebbe di un giorno, e la scadenza cadrebbe il giorno prima */
    eq(sentinella.piuGiorni("2026-03-28", 1), "2026-03-29", "il giorno del cambio");
    eq(sentinella.piuGiorni("2026-03-28", 2), "2026-03-30", "e quello dopo");
    eq(sentinella.piuGiorni("2026-02-28", 1), "2026-03-01", "il 2026 non è bisestile");
    eq(sentinella.piuGiorni("boh", 1), "", "e una data che non è una data non diventa oggi");
  });
}

/* ══ DAL SUPERAMENTO ALL'AZIONE: «E VOI COSA AVETE FATTO?» ══════════════
   È la domanda che l'ente fa dopo un superamento, e il ponte
   Sentinella → Scudo esiste per avere una risposta scritta. Le funzioni qui
   sotto decidono **quali superamenti sono ancora aperti**, **quali azioni
   appartengono a quale superamento** e **che colore ha la risposta**.

   Le regole bloccate:

   · **senza soglia non esiste superamento.** Non se ne inventa una: un punto
     senza soglia impostata non è né dentro né fuori, e dichiararlo fuori
     riempirebbe il quadro di rossi che nessuno può chiudere;
   · **un punto senza storico è comunque un superamento**, con la voce
     «valore-corrente» invece di una data. Farlo sparire perché non c'è una
     data da citare toglierebbe dall'elenco un superamento vero;
   · **«nessuna azione» è ROSSO**, non grigio. La casella vuota è esattamente
     la risposta che l'ente non vuole sentire;
   · **le azioni si legano al preciso superamento**, non solo al punto: quella
     chiusa a marzo non deve far sembrare gestito quello di luglio. */
{
  const punto = (o) => ({ id: "p1", nome: "Casa Rossi", tipo: "vibrazioni", valore: 12, soglia: 10, letture: [], ...o });

  test("⛔ superamenti: l'ultima lettura oltre è la più RECENTE, non la più alta", () => {
    /* la domanda è «quando è successo l'ultima volta», non «quanto è andata
       male la peggiore». Il caso è costruito perché le due risposte siano
       DIVERSE: il picco (50) è del 1° luglio, l'ultimo superamento (12) è del
       3. Con dati in cui coincidono la prova non proverebbe niente — ed è
       proprio così che era scritta la prima volta. */
    const l = sentinella.ultimaLetturaOltre({ letture: [
      { data: "2026-07-01", valore: 50 },
      { data: "2026-07-05", valore: 3 },
      { data: "2026-07-03", valore: 12 }] }, 10);
    eq(l.data, "2026-07-03", "l'ultima che ha superato, non la più alta");
    eq(l.valore, 12, "e con il suo valore, non col picco");
  });
  test("superamenti: «oltre» vuol dire anche «uguale», come il semaforo", () => {
    eq(sentinella.ultimaLetturaOltre({ letture: [{ data: "2026-07-01", valore: 10 }] }, 10).valore, 10,
       "il valore uguale alla soglia è già un superamento");
  });
  test("⛔ superamenti: senza soglia valida non se ne inventa una", () => {
    eq(sentinella.ultimaLetturaOltre({ letture: [{ data: "2026-07-01", valore: 99 }] }, 0), null, "soglia zero");
    eq(sentinella.superamentiAperti([punto({ soglia: null })], []).length, 0, "e il punto non finisce fra gli aperti");
  });
  test("⛔ superamenti: un punto senza storico è comunque un superamento", () => {
    /* il valore digitato a mano sulla scheda: la voce esiste, solo senza una
       data da citare */
    const s = sentinella.superamentiAperti([punto({})], [])[0];
    eq(s.voce, "valore-corrente", "la voce lo dice");
    eq(s.data, "", "e la data resta vuota invece di essere inventata");
  });
  test("superamenti: con lo storico la voce è la data della lettura che l'ha causato", () => {
    const s = sentinella.superamentiAperti([punto({ letture: [
      { data: "2026-07-01", valore: 11 },
      { data: "2026-07-09", valore: 12 },
      { data: "2026-07-05", valore: 4 }] })], [])[0];
    eq(s.voce, "2026-07-09", "l'ultima volta che è andata oltre");
  });
  test("⛔ superamenti: l'ordine è la gravità, non il nome", () => {
    const l = sentinella.superamentiAperti([
      punto({ id: "p1", nome: "Casa Rossi", valore: 12, soglia: 10 }),
      punto({ id: "p2", nome: "Aaa scuola", valore: 30, soglia: 10 })], []);
    eq(l[0].nome, "Aaa scuola", "tre volte la soglia prima di una volta e due decimi");
    eq(l.length, 2, "e sono due");
  });
  test("superamenti: quello che sta sotto soglia non è aperto", () => {
    eq(sentinella.superamentiAperti([punto({ valore: 2, soglia: 10 })], []).length, 0, "niente da chiudere");
  });

  test("⛔ ponte: le azioni si legano al preciso superamento, non solo al punto", () => {
    /* quella chiusa a marzo non deve far sembrare gestito quello di luglio */
    const az = [
      { origineTipo: sentinella.ORIGINE_SUPERAMENTO, origineId: "p5", origineVoce: "2026-07-09", stato: "aperta" },
      { origineTipo: sentinella.ORIGINE_SUPERAMENTO, origineId: "p5", origineVoce: "2026-03-01", stato: "chiusa" },
      { origineTipo: sentinella.ORIGINE_RECLAMO, origineId: "p5", origineVoce: "2026-07-09", stato: "chiusa" }];
    eq(sentinella.azioniDiOrigine(az, sentinella.ORIGINE_SUPERAMENTO, "p5", "2026-07-09").length, 1, "una sola è di questo");
    eq(sentinella.azioniDiOrigine(az, sentinella.ORIGINE_SUPERAMENTO, "p5").length, 2, "senza voce tornano tutte del punto");
    eq(sentinella.azioniDiOrigine(az, sentinella.ORIGINE_SUPERAMENTO, "").length, 0, "e senza id non si tira su niente");
  });
  test("⛔ ponte: «nessuna azione» è rosso, non grigio", () => {
    /* la casella vuota è esattamente la risposta che l'ente non vuole sentire */
    const p = sentinella.statoPonte([]);
    eq(p.cls, "danger", "rosso");
    eq(p.label, "Nessuna azione", "detto in chiaro");
  });
  test("ponte: tutte chiuse è verde, e si dice al singolare quando è una", () => {
    eq(sentinella.statoPonte([{ stato: "chiusa" }]).cls, "ok", "verde");
    eq(sentinella.statoPonte([{ stato: "chiusa" }]).label, "Azione chiusa", "una sola, non «1 azioni»");
    eq(sentinella.statoPonte([{ stato: "chiusa" }, { stato: "chiusa" }]).label, "2 azioni chiuse", "due");
  });
  test("ponte: una aperta su due resta gialla e dice quante ne mancano", () => {
    const p = sentinella.statoPonte([{ stato: "chiusa" }, { stato: "aperta" }]);
    eq(p.cls, "warn", "giallo: qualcosa è stato fatto, ma non è finita");
    eq(p.label, "1 azione da chiudere", "e si dice quante");
  });
  test("ponte: se sono tutte in corso si dice «in corso», non «da chiudere»", () => {
    eq(sentinella.statoPonte([{ stato: "in-corso" }]).label, "Azione in corso", "qualcuno ci sta lavorando");
  });

  test("⛔ bozza: l'azione porta con sé da dove viene", () => {
    /* senza la provenienza, in Scudo resterebbe un compito senza storia, e
       la domanda dell'ente non avrebbe una risposta collegata al fatto */
    const s = sentinella.superamentiAperti([punto({ id: "p5", nome: "Con storia",
      letture: [{ data: "2026-07-09", valore: 12 }] })], [])[0];
    const b = sentinella.bozzaAzioneSuperamento(s);
    eq(b.origineApp, sentinella.PONTE_APP, "l'app di partenza");
    eq(b.origineTipo, sentinella.ORIGINE_SUPERAMENTO, "il tipo di fatto");
    eq(b.origineId, "p5", "il punto");
    eq(b.origineVoce, "2026-07-09", "e il preciso superamento, non solo il punto");
    eq(b.stato, "aperta", "nasce aperta");
  });
  test("bozza: la nota cita il valore misurato e la soglia applicata", () => {
    const s = sentinella.superamentiAperti([punto({ id: "p5", nome: "Con storia",
      letture: [{ data: "2026-07-09", valore: 12 }] })], [])[0];
    const n = sentinella.bozzaAzioneSuperamento(s).origineNota;
    eq(n.includes("misurato 12 mm/s"), true, "quanto si è misurato");
    eq(n.includes("soglia applicata 10 mm/s"), true, "e contro cosa");
    eq(n.includes("09/07/2026"), true, "e quando, in italiano");
  });
  test("bozza: senza un superamento vero non si prepara niente", () => {
    eq(sentinella.bozzaAzioneSuperamento({ nome: "x" }), null, "manca l'id");
    eq(sentinella.bozzaAzioneSuperamento(null), null, "e manca tutto");
  });
}

/* ══ IL REFERTO DEL SISMOGRAFO CHE TARA LA LEGGE DI SITO ════════════════
   Da queste volate Genesi ricava K e β, e da K e β dipendono **le distanze di
   sicurezza**. È il posto in tutto l'ecosistema dove un numero finto fa più
   danno: non produce un report brutto, produce una distanza di sicurezza
   sbagliata.

   Il vincolo più importante è uno solo, ed è quello che queste prove
   difendono: **una volata PREVISTA non diventa mai un referto.** Nemmeno se
   porta una PPV prevista, nemmeno se ha distanza e carica. Se dentro la
   regressione entrasse un valore *previsto* al posto di uno *misurato*, la
   legge di sito confermerebbe sé stessa e le distanze uscirebbero da un
   calcolo circolare — un numero che sembra misurato e non lo è. */
{
  const vol = (o) => ({ id: "v1", data: "2026-07-10", fronte: "Fronte A",
    distanzaRicettore: 200, kgMaxRitardo: 50, ppvMisurata: 3.2, ppvFonte: "strumento",
    ppvPuntoId: "p1", ppvPuntoNome: "Casa Rossi", ppvData: "2026-07-10", ppvOra: "10:30", ...o });

  test("referto: una volata completa è pronta, con i suoi tre numeri", () => {
    const r = sentinella.refertoDaVolata(vol());
    eq(r.pronto, true, "pronta");
    eq(r.motivi.length, 0, "niente da chiedere");
    eq(r.ppv, 3.2, "la PPV misurata");
  });
  test("⛔ referto: una volata PREVISTA non è un referto, nemmeno con tutto il resto", () => {
    /* il vincolo T9: con una PPV prevista dentro la regressione, la legge di
       sito confermerebbe sé stessa e le distanze di sicurezza uscirebbero da
       un calcolo circolare */
    const r = sentinella.refertoDaVolata(vol({ stato: "prevista" }));
    eq(r.pronto, false, "non è un referto");
    eq(r.ppv, null, "e la PPV che porta con sé non viene nemmeno letta");
  });
  test("⛔ referto: alla volata prevista si chiede UNA cosa sola: che sia stata sparata", () => {
    /* elencarle anche gli altri dati mancanti chiederebbe di riempire una PPV
       che non può ancora esistere */
    const r = sentinella.refertoDaVolata(vol({ stato: "prevista", ppvMisurata: 0, distanzaRicettore: 0, kgMaxRitardo: 0 }));
    eq(r.motivi.join(","), "prevista", "un motivo solo, e dice il fatto che manca");
  });
  test("referto: quello che manca si dice tutto insieme, non uno alla volta", () => {
    const r = sentinella.refertoDaVolata({ id: "v9", data: "2026-01-01" });
    eq(r.motivi.join(","), "ppv,distanza,carica", "tre mancanze, tre motivi");
  });
  test("⛔ referto: una volata vecchia non porta una PPV finta", () => {
    /* registrata prima che quei campi esistessero: null, non zero */
    eq(sentinella.ppvDiVolata({ id: "v" }), null, "niente PPV");
    eq(sentinella.ppvDiVolata({ ppvMisurata: 0 }), null, "e zero non è una misura");
    eq(sentinella.ppvDiVolata({ ppvMisurata: -1 }), null, "nemmeno un valore negativo");
  });
  test("⛔ referto: la PPV a mano non si porta dietro una provenienza che non ha", () => {
    /* «trascritta dal referto» significa che il punto di misura non lo
       sappiamo: tenerne uno vecchio farebbe risalire alla casa sbagliata */
    const c = sentinella.campiPpvVolata(3.25, { fonte: "manuale", puntoId: "p1", punto: "Casa", ora: "10:30", data: "2026-07-10" });
    eq(c.ppvPuntoId, "", "nessun punto");
    eq(c.ppvPuntoNome, "", "nessun nome");
    eq(c.ppvOra, "", "nessuna ora");
    eq(c.ppvData, "2026-07-10", "la data invece resta: quella la sappiamo");
  });
  test("referto: la PPV dal sismografo tiene punto, nome e ora", () => {
    const c = sentinella.campiPpvVolata(3.25678, { fonte: "strumento", puntoId: "p1", punto: "Casa", ora: "10:30", data: "2026-07-10" });
    eq(c.ppvPuntoNome, "Casa", "il punto");
    eq(c.ppvMisurata, 3.2568, "e il valore a quattro decimali, come lo strumento");
  });
  test("⛔ referto: togliere una PPV azzera anche la sua provenienza", () => {
    /* mai il valore senza la sua provenienza, e mai la provenienza senza il
       valore: resterebbe un numero che dice di venire da un punto che non l'ha
       mai misurato */
    const v = Object.values(sentinella.CAMPI_PPV_VUOTI);
    eq(v.length, 6, "sei campi");
    eq(v.every((x) => x === "" || x === 0), true, "e si azzerano tutti insieme");
  });
  test("referto: da dove viene la PPV si dice sempre con le stesse parole", () => {
    eq(sentinella.testoFontePpv(sentinella.ppvDiVolata(vol())), "sismografo · Casa Rossi · 10:30", "dal sismografo");
    eq(sentinella.testoFontePpv(sentinella.ppvDiVolata(vol({ ppvFonte: "manuale" }))),
       "trascritta a mano dal referto", "a mano");
    eq(sentinella.testoFontePpv(null), "", "e senza PPV non si scrive niente");
  });
  test("referto: il riferimento permette di risalire alla volata dalla riga della regressione", () => {
    eq(sentinella.riferimentoReferto(sentinella.refertoDaVolata(vol())),
       "Volata 10/07/2026 · Fronte A · Casa Rossi", "data, fronte e punto");
  });

  test("⛔ candidate: solo le letture di VIBRAZIONE di quel giorno", () => {
    const mons = [
      { id: "p1", nome: "Casa", tipo: "vibrazioni", unita: "mm/s",
        letture: [{ data: "2026-07-10", valore: 3.2, ora: "10:30" }, { data: "2026-07-10", valore: 5.1 }, { data: "2026-07-09", valore: 9 }] },
      { id: "p2", nome: "Rumore", tipo: "rumore", letture: [{ data: "2026-07-10", valore: 70 }] }];
    const c = sentinella.lettureVibrazioniDelGiorno(mons, "2026-07-10");
    eq(c.length, 2, "due: il rumore non è una PPV e il giorno prima non è quel giorno");
    eq(c[0].valore, 5.1, "e in cima la più alta, che è quella che conta per la conformità");
  });
  test("⛔ candidate: un punto che non misura in mm/s è marcato, non silenziato", () => {
    /* il numero c'è ma NON è una PPV: la scheda lo mostra a parte invece di
       farlo scegliere, e nasconderlo lascerebbe l'utente a chiedersi dove è
       finita la sua lettura */
    const c = sentinella.lettureVibrazioniDelGiorno(
      [{ id: "p3", nome: "Altro", tipo: "vibrazioni", unita: "dB", letture: [{ data: "2026-07-10", valore: 99 }] }],
      "2026-07-10");
    eq(c.length, 1, "c'è");
    eq(c[0].unitaOk, false, "ma è marcato come non utilizzabile come PPV");
  });
  test("candidate: senza una data vera non si propone niente", () => {
    eq(sentinella.lettureVibrazioniDelGiorno([], "boh").length, 0, "elenco vuoto");
  });

  test("⛔ registro: prima ciò su cui c'è da lavorare, poi il fatto più recente", () => {
    const reg = sentinella.refertiDaVolate([
      vol({ id: "a", data: "2026-07-01" }), vol({ id: "b", data: "2026-07-20" }),
      vol({ id: "c", data: "2026-07-15", ppvMisurata: 0 }), vol({ id: "d", stato: "prevista" })]);
    eq(reg.tutti.map((r) => r.id).join(","), "c,d,b,a", "le due incomplete davanti, poi le pronte dalla più recente");
    eq(reg.nPronti, 2, "due pronte");
    eq(reg.motivi.ppv, 1, "e il conto di cosa manca, per dirlo una volta sola");
    eq(reg.motivi.prevista, 1, "compresa quella ancora da sparare");
  });
  test("⛔ registro: sotto tre referti si dice quanti ne mancano, non «non si può»", () => {
    const reg = sentinella.refertiDaVolate([vol({ id: "a" }), vol({ id: "b", data: "2026-07-02" })]);
    eq(reg.abbastanza, false, "due non bastano");
    eq(reg.mancanoAlMinimo, 1, "e ne manca uno: è un numero, non un muro");
  });
  test("⛔ registro: senza escursione di distanza scalata la pendenza non è ricavabile", () => {
    /* tre volate identiche danno tre volte lo stesso punto: da lì passa
       qualunque retta, e la legge uscirebbe da un calcolo che non ha misurato
       niente. Meglio dirlo prima dell'export che dopo il rifiuto */
    const uguali = sentinella.refertiDaVolate([vol({ id: "a" }), vol({ id: "b" }), vol({ id: "c" })]);
    eq(uguali.escursione, 1, "nessuna escursione");
    const diverse = sentinella.refertiDaVolate([
      vol({ id: "a", distanzaRicettore: 100 }), vol({ id: "b", distanzaRicettore: 400 }), vol({ id: "e" })]);
    eq(Math.round(diverse.escursione * 100) / 100, 4, "quattro volte fra la più vicina e la più lontana");
  });
  test("registro: ogni motivo dice anche come si rimedia", () => {
    eq(sentinella.MOTIVI_REFERTO.every((m) => m.come && m.etichetta && m.breve), true,
       "un elenco di mancanze senza il rimedio lascia l'utente fermo");
    eq(sentinella.motivoReferto("boh").etichetta, "Dato mancante", "e un motivo sconosciuto non rompe la pagina");
  });
}

/* ══ «COME STA ANDANDO DOVE ABITA LA GENTE» ═════════════════════════════
   Il confronto fra il mese in corso e quello prima, per ogni punto collegato
   a un ricettore. La regola di onestà è scritta nel modulo e va difesa qui:
   **se le letture non bastano NON si inventa una linea** — si dice quante ce
   ne sono.

   Le due che contano di più:

   · **«nessuna misura» non è «zero mm/s».** Senza letture media, massimo e
     minimo restano `null`: uno zero lì significherebbe «è andato benissimo»
     su un mese in cui non si è misurato niente;
   · **non si confronta un mese con il nulla.** Con un mese vuoto la
     variazione non esiste: dichiararla −100 % darebbe un miglioramento
     inventato dall'assenza di dati, che è esattamente il numero che un'azienda
     vorrebbe leggere e che non deve trovare. */
{
  const punto = { id: "p1", nome: "Casa", tipo: "vibrazioni", letture: [
    { data: "2026-06-10", valore: 2 }, { data: "2026-06-20", valore: 4 },
    { data: "2026-07-05", valore: 6, ora: "14:00" }, { data: "2026-07-05", valore: 3, ora: "08:00" },
    { data: "2026-07-25", valore: 12 }] };
  const OGGI = new Date("2026-07-31T12:00:00");

  test("periodo: il mese finisce quando finisce davvero", () => {
    eq(sentinella.limitiMese(2026, 2).al, "2026-02-28", "febbraio normale");
    eq(sentinella.limitiMese(2028, 2).al, "2028-02-29", "e quello bisestile");
    eq(sentinella.limitiMese(2026, 12).al, "2026-12-31", "dicembre");
  });
  test("⛔ periodo: gli estremi sono compresi", () => {
    /* un intervallo che escludesse il primo o l'ultimo giorno toglierebbe
       silenziosamente due letture da ogni mese */
    eq(sentinella.lettureNelPeriodo(punto, "2026-06-10", "2026-06-20").map((x) => x.valore).join(","),
       "2,4", "la prima e l'ultima ci sono");
  });
  test("periodo: le letture dello stesso giorno restano in ordine di ora", () => {
    eq(sentinella.lettureNelPeriodo(punto, "2026-07-01", "2026-07-10").map((x) => x.valore).join(","),
       "3,6", "le 8 prima delle 14");
  });
  test("periodo: senza estremi si prende tutto, invece di niente", () => {
    eq(sentinella.lettureNelPeriodo(punto, "", "").length, 5, "cinque letture");
  });

  test("statistiche: media, massimo, minimo e superamenti del periodo", () => {
    const st = sentinella.statPeriodo(punto, "2026-07-01", "2026-07-31", 10);
    eq(st.n, 3, "tre letture");
    eq(st.media, 7, "media sette");
    eq(st.max, 12, "massimo dodici");
    eq(st.min, 3, "minimo tre");
    eq(st.superamenti, 1, "e un solo superamento della soglia");
  });
  test("⛔ statistiche: «nessuna misura» non è «zero»", () => {
    /* uno zero lì significherebbe «è andato benissimo» su un mese in cui non
       si è misurato niente */
    const st = sentinella.statPeriodo(punto, "2027-01-01", "2027-01-31", 10);
    eq(st.n, 0, "nessuna lettura");
    eq(st.media, null, "e la media non esiste");
    eq(st.max, null, "né il massimo");
  });
  test("⛔ statistiche: senza soglia non si contano superamenti", () => {
    eq(sentinella.statPeriodo(punto, "2026-07-01", "2026-07-31", 0).superamenti, 0,
       "non se ne inventa una per poter contare");
  });

  test("⛔ confronto: non si confronta un mese con il nulla", () => {
    /* dichiarare −100 % darebbe un miglioramento inventato dall'assenza di
       dati: esattamente il numero che un'azienda vorrebbe leggere */
    const c = sentinella.confrontoMesi({ letture: [{ data: "2026-07-05", valore: 6 }] }, 10, OGGI);
    eq(c.confrontabile, false, "il mese prima è vuoto");
    eq(c.deltaPct, null, "quindi nessuna variazione");
    eq(c.deltaMedia, null, "e nessuna differenza di media");
  });
  test("confronto: con due mesi pieni la variazione si calcola e si dice in percento", () => {
    const c = sentinella.confrontoMesi(punto, 10, OGGI);
    eq(c.confrontabile, true, "confrontabile");
    eq(c.deltaMedia, 4, "quattro in più di media");
    eq(c.deltaPct, 133.3, "cioè +133,3 %");
    eq(c.deltaSuperamenti, 1, "e un superamento in più");
  });
  test("⛔ confronto: una media su UNA lettura sola viene dichiarata debole", () => {
    /* è un confronto legittimo ma fragile: nasconderlo farebbe prendere per
       tendenza quello che è un caso */
    const c = sentinella.confrontoMesi(
      { letture: [{ data: "2026-06-10", valore: 2 }, { data: "2026-07-05", valore: 6 }] }, 10, OGGI);
    eq(c.confrontabile, true, "confrontabile");
    eq(c.debole, true, "ma dichiarato debole");
    eq(sentinella.confrontoMesi(punto, 10, OGGI).debole, false, "con più letture no");
  });

  test("andamento: si guardano solo i punti collegati a quel ricettore", () => {
    const a = sentinella.andamentoRicettore(
      [{ ...punto, ricettoreId: "r1" }, { id: "p2", nome: "Altro", ricettoreId: "r2", letture: [] }],
      [{ id: "r1", nome: "Casa Rossi" }], "r1", { oggi: OGGI });
    eq(a.punti.length, 1, "uno solo è di questo ricettore");
    eq(a.ricettore.nome, "Casa Rossi", "e il ricettore si ritrova");
    eq(a.dal + "→" + a.al, "2026-02-01→2026-07-31", "sei mesi, mese in corso compreso");
  });
  test("⛔ andamento: sotto tre letture non si disegna una linea", () => {
    /* da due punti passa qualunque linea: mostrarla darebbe una tendenza che
       i dati non contengono */
    const a = sentinella.andamentoRicettore(
      [{ id: "p3", nome: "Poche", ricettoreId: "r1",
         letture: [{ data: "2026-07-01", valore: 1 }, { data: "2026-07-02", valore: 2 }] }],
      [{ id: "r1", nome: "X" }], "r1", { oggi: OGGI });
    eq(a.punti[0].n, 2, "due letture");
    eq(a.punti[0].abbastanza, false, "non bastano");
    eq(a.minLetture, 3, "e si dice qual è il minimo, invece di lasciare il vuoto");
  });
}

/* ══ «OGGI» È UNA SOLA COSA, E VIVE IN shared/ ══════════════════════════
   `oggiISO` era scritta **sei volte** nel progetto in **tre** versioni: cinque
   giuste e una — quella di Conti — che prendeva il giorno da `toISOString()`,
   cioè il giorno UTC. In Italia sono una o due ore avanti, e fra mezzanotte e
   le due (il turno di notte) quella versione data i documenti **al giorno
   prima**. Vedi `docs/RICERCA_GIORNO_LOCALE_202607.md`.

   Il test pretende l'**IDENTITÀ**, non il comportamento: due copie uguali oggi
   divergono domani senza che nessuno se ne accorga. È la stessa regola già
   costata una giornata con la convenzione sui numeri. */
{
  test("⛔ oggi: Campo ri-esporta la funzione di shared, non ne tiene una sua", () => {
    eq(campo.oggiISO === shell.oggiISO, true, "è la stessa funzione, non una copia che si comporta uguale");
  });
  test("⛔ oggi: e nemmeno Flotta, che ne aveva la settima copia", () => {
    /* l'ha trovata la regola 15 di run-stile.mjs, non una lettura del codice:
       si chiamava `oggiIso` e stava nel modulo dati */
    eq(flotta.oggiIso === shell.oggiISO, true, "stessa funzione, nome di sempre");
  });
  test("⛔ oggi: il giorno si legge dall'orologio LOCALE, non da quello di Greenwich", () => {
    /* mezzanotte e mezza del 2 giugno a Roma: `toISOString()` scriverebbe il
       1° giugno, e il rapportino del turno di notte finirebbe nel giorno prima */
    eq(shell.oggiISO(new Date(2026, 5, 2, 0, 30)), "2026-06-02", "il 2, non il 1°");
    eq(shell.oggiISO(new Date(2026, 0, 1, 0, 30)), "2026-01-01", "e a capodanno l'anno è quello nuovo");
  });
  test("⛔ oggi: il MESE di una data si legge nello stesso modo", () => {
    /* la chiave con cui si raggruppano i grafici: presa da `toISOString()`
       sposta ogni barra di un mese intero */
    eq(shell.meseLocale(new Date(2026, 4, 1)), "2026-05", "maggio è maggio, anche il primo giorno");
    eq(shell.meseLocale(new Date(2026, 0, 1)), "2026-01", "e gennaio è gennaio");
  });
  test("oggi: una data che non è una data non diventa oggi", () => {
    eq(shell.isoLocale("boh"), "", "stringa vuota, invece di un giorno inventato");
  });
  test("oggi: mezzogiorno e mezzanotte dello stesso giorno danno lo stesso giorno", () => {
    eq(shell.isoLocale(new Date(2026, 6, 31, 12, 0)), shell.isoLocale(new Date(2026, 6, 31, 0, 0)),
       "l'ora non sposta il calendario");
  });
}

/* ══ LA PROPOSTA DEL TAGLIANDO, E LO ZERO CHE NON ESISTE ════════════════
   Scegliendo un piano nel form, l'app propone a quante ore mettere il prossimo
   tagliando. Prima faceva `Math.round(+m.ore || 0) + p.ogniOre` e scriveva
   «X ha 0 ore: il tagliando è proposto a 500». Su un mezzo **senza contaore**
   quella frase asserisce un numero che il contatore non ha mai dato: non è
   imprecisa, è **falsa**. È il terzo `+null === 0` di questo progetto — dopo la
   base d'asta delle gare in Conti e la finestra del prossimo tagliando. */
{
  const pt = flotta.propostaTagliando;
  const p500 = flotta.pianoTagliando("500");

  test("proposta: con le ore note si somma il passo", () => {
    const r = pt("CAT 320", 5875, p500);
    eq(r.oreProposte, 6375, "5875 più cinquecento");
    eq(r.oreNote, true, "le ore si sanno");
    /* ⚠️ in italiano 6375 si scrive SENZA il punto: la lingua raggruppa solo
       da cinque cifre in su (`minimumGroupingDigits: 2`). La prima stesura
       pretendeva «6.375» e cadeva — era la prova a sbagliare la lingua, non il
       codice a sbagliare il numero */
    eq(r.testo.includes("il tagliando è proposto a 6375"), true, "e lo dice");
    eq((1234567).toLocaleString("it-IT"), "1.234.567", "col punto si scrive da cinque cifre in su");
  });
  test("⛔ proposta: senza contaore NON si propone zero più il passo", () => {
    /* `+null` fa 0 e `Number.isFinite(0)` risponde true: è la forma sbagliata,
       non `Number.isFinite(x)` ma `Number.isFinite(+x)` su un valore nullo */
    for (const vuoto of [null, undefined, ""]) {
      const r = pt("CAT 320", vuoto, p500);
      eq(r.oreProposte, null, "niente da precompilare");
      eq(r.oreNote, false, "e si sa di non sapere");
      /* ⚠️ non basta cercare «0 ore»: la coda della frase contiene «+500 ore».
         Quello che non deve esistere è l'ASSERZIONE sul mezzo */
      eq(r.testo.includes("CAT 320 ha 0 ore"), false, "la frase «X ha 0 ore» non compare");
      eq(/\bha 0 ore\b/.test(r.testo), false, "in nessuna forma");
    }
  });
  test("⛔ proposta: senza contaore si dice cosa fare, non si lascia il vuoto", () => {
    const r = pt("CAT 320", null, p500);
    eq(r.testo.includes("non sappiamo le ore"), true, "si dichiara l'ignoranza");
    eq(r.testo.includes("programma il tagliando per data"), true, "e si offre la via d'uscita vera");
  });
  test("proposta: un contaore illeggibile vale come mancante, non come zero", () => {
    eq(pt("CAT 320", "boh", p500).oreProposte, null, "non è un numero");
    eq(pt("CAT 320", -5, p500).oreProposte, null, "e un contaore non va indietro");
  });
  test("proposta: senza mezzo scelto si spiega il piano e basta", () => {
    const r = pt("", 5875, p500);
    eq(r.oreProposte, null, "non c'è un mezzo a cui proporlo");
    eq(r.testo.includes("Tagliando 500 h"), true, "ma il piano si spiega lo stesso");
  });
  test("proposta: le ore si arrotondano solo per la proposta, mai in silenzio sul dato", () => {
    eq(pt("CAT 320", 5875.6, p500).oreProposte, 6376, "5876 più cinquecento");
  });
}

/* ══ DAL PROGETTO ALLO SPARO: LA CONFERMA DI UNA VOLATA ═════════════════
   Genesi manda a Sentinella una volata **prevista**. Dopo lo sparo qualcuno la
   conferma come eseguita, correggendo quello che in cava è andato diversamente
   dal progetto — fori saltati, carica ridotta, data spostata.

   Le due regole che reggono tutto il ponte:

   · **la previsione non si tocca.** I dati si correggono, il numero previsto
     resta scritto com'era: altrimenti il confronto previsto→misurato sarebbe un
     confronto con un numero **aggiustato dopo**, cioè con niente;
   · **una volata eseguita è un fatto avvenuto**, quindi la sua data non può
     stare nel futuro. È la stessa regola del registro a mano, per lo stesso
     motivo. */
{
  const cv = sentinella.confermaVolataEseguita;
  const OGGI = new Date("2026-07-31T12:00:00");
  const prevista = { id: "v1", stato: "prevista", data: "2026-07-20", fronte: "A",
    nFori: 20, kgTotali: 400, kgMaxRitardo: 50, distanzaRicettore: 200,
    ppvPrevista: 4.2, ppvPrevLimite: 5, ppvPrevNorma: "UNI 9916",
    ppvPrevFonte: "genesi-sito", airblastPrevisto: 120 };

  test("stato: il silenzio del registro significa ESEGUITA", () => {
    /* un registro compilato a mano è un elenco di fatti avvenuti: senza la
       colonna dello stato non si dà per «prevista» ciò che è già successo */
    eq(sentinella.statoVolata({}), "eseguita", "senza stato");
    eq(sentinella.statoVolata({ stato: "progetto" }), "prevista", "e i sinonimi si riconoscono");
    eq(sentinella.statoDaTesto("sparata"), "eseguita", "anche dall'altra parte");
    eq(sentinella.statoDaTesto("boh"), "", "una parola che non dice niente non decide");
  });
  test("⛔ conferma: la previsione NON viene toccata", () => {
    /* correggere anche il previsto renderebbe il confronto un confronto con un
       numero aggiustato dopo lo sparo */
    const r = cv(prevista, { nFori: "18", kgMaxRitardo: "45,5" }, OGGI);
    eq(r.ok, true, "la conferma va a buon fine");
    eq(Object.keys(r.campi).filter((k) => /^ppvPrev|^airblast|^ppvMisurata/.test(k)).length, 0,
       "nessun campo della previsione né della misura viene riscritto");
  });
  test("⛔ conferma: la data non può essere nel futuro", () => {
    const r = cv(prevista, { data: "2026-08-05" }, OGGI);
    eq(r.ok, false, "rifiutata");
    eq(r.errori[0].campo, "data", "e si dice quale campo");
    eq(r.errori[0].testo.includes("lasciala prevista"), true, "con la via d'uscita, non solo il no");
  });
  test("conferma: una volata già eseguita non si conferma due volte", () => {
    const r = cv({ ...prevista, stato: "eseguita" }, {}, OGGI);
    eq(r.ok, false, "niente da confermare");
    eq(r.errori[0].testo.includes("già registrata come eseguita"), true, "e lo dice in italiano");
  });
  test("⛔ conferma: un campo non toccato resta quello del progetto, uno svuotato vale zero", () => {
    /* svuotare è una CORREZIONE («quei fori non li abbiamo fatti»), non una
       dimenticanza: trattarla come «lascia com'era» ribalterebbe la volontà */
    eq(cv(prevista, {}, OGGI).campi.nFori, 20, "non toccato: resta il progetto");
    eq(cv(prevista, { nFori: "" }, OGGI).campi.nFori, 0, "svuotato: vale zero");
  });
  test("⛔ conferma: si dice che cosa è cambiato rispetto al progetto", () => {
    /* una correzione silenziosa su un documento è un problema: prima di
       salvare l'utente deve vedere che cosa sta cambiando */
    const c = cv(prevista, { nFori: "18", kgMaxRitardo: "45,5" }, OGGI).cambi;
    eq(c.map((x) => x.campo).join(","), "nFori,kgMaxRitardo", "due cose cambiate, due righe");
    eq(c[0].da + "→" + c[0].a, "20→18", "da quanto a quanto");
    eq(cv(prevista, {}, OGGI).cambi.length, 0, "e senza correzioni non si elenca niente");
  });
  test("conferma: la virgola italiana vale quanto il punto", () => {
    eq(cv(prevista, { kgMaxRitardo: "45,5" }, OGGI).campi.kgMaxRitardo, 45.5, "45,5 kg");
  });

  test("⛔ previsione: si dice su che base Genesi ha previsto", () => {
    /* una previsione calibrata sul sito vale più di una da manuale, e l'utente
       ha il diritto di sapere quale delle due sta leggendo */
    eq(sentinella.previsioneDiVolata(prevista).calibrata, true, "legge di sito");
    eq(sentinella.testoFontePrevisione(sentinella.previsioneDiVolata(prevista)),
       "da Genesi · legge di sito calibrata", "detto in chiaro");
    eq(sentinella.testoFontePrevisione(sentinella.previsioneDiVolata({ ...prevista, ppvPrevFonte: "genesi-litologia" })),
       "da Genesi · stima dalla litologia", "e l'altra base si distingue");
  });
  test("previsione: una volata registrata a mano non ne ha una calcolata qui", () => {
    eq(sentinella.previsioneDiVolata({ id: "v" }), null, "niente previsione");
    eq(sentinella.testoFontePrevisione(null), "", "e niente da scrivere");
  });
  test("⛔ previsione: i campi del progetto non entrano MAI in quelli della misura", () => {
    const c = sentinella.campiPrevisioneVolata(4.2, { limite: 5, norma: "UNI 9916", fonte: "genesi-sito", airblast: 120 });
    eq(Object.keys(c).some((k) => /^ppvMisurata|^ppvFonte$|^ppvPunto/.test(k)), false,
       "una previsione messa accanto a una misura, in una settimana, diventa indistinguibile da essa");
    eq(c.ppvPrevista, 4.2, "il previsto sta nel suo campo");
  });

  test("⛔ scarto: il confronto previsto→misurato esiste solo con ENTRAMBI i numeri", () => {
    eq(sentinella.scartoPpvVolata(prevista), null, "manca la misura");
    eq(sentinella.scartoPpvVolata({ ppvMisurata: 5, ppvFonte: "strumento" }), null, "manca la previsione");
  });
  test("scarto: con entrambi si dice di quanto e da che parte", () => {
    const s = sentinella.scartoPpvVolata({ ...prevista, stato: "eseguita", ppvMisurata: 5.1, ppvFonte: "strumento" });
    eq(s.delta, 0.9, "nove decimi in più");
    eq(s.pct, 21.4, "cioè +21,4 %");
    eq(s.verso, "sopra", "sopra il previsto");
  });

  test("⛔ firma: col codice di Genesi il doppione si riconosce anche dopo la conferma", () => {
    /* la conferma può aver corretto fori, chili e persino la data: senza il
       codice, reimportare il file del progetto creerebbe una riga fantasma */
    eq(sentinella.firmaVolata({ codiceVolata: "G-77", data: "2026-07-20", nFori: 20 }),
       sentinella.firmaVolata({ codiceVolata: "G-77", data: "2026-07-21", nFori: 18 }),
       "stessa volata, stessa firma");
  });
  test("firma: senza codice si torna a data, fronte, fori e chili", () => {
    eq(sentinella.firmaVolata({ data: "2026-07-20", fronte: "A", nFori: 20, kgTotali: 400 }),
       "2026-07-20|a|20|400", "i file già in giro si deduplicano come prima");
  });

  const registro = [{ id: "a", stato: "prevista", data: "2026-08-10" },
    { id: "b", stato: "prevista", data: "2026-07-20" },
    { id: "c", data: "2026-07-01" }, { id: "d", data: "2026-07-25" }];
  test("⛔ registro: prima le previste in ordine di calendario, poi le eseguite dalla più recente", () => {
    /* le previste con la data già passata vengono per prime: sono quelle da
       confermare, ed è l'unica cosa che chiede un'azione */
    eq(sentinella.volateOrdinate(registro).map((v) => v.id).join(","), "b,a,d,c", "l'ordine del registro");
  });
  test("⛔ registro: si conta quante previste aspettano la conferma", () => {
    /* una volata sparata e mai confermata lascia un buco nel brogliaccio */
    const r = sentinella.riepilogoPreviste(registro, OGGI);
    eq(r.totale, 2, "due previste");
    eq(r.daConfermare, 1, "e una la cui data è già arrivata");
    eq(r.prossima, "2026-08-10", "l'altra è la prossima in calendario");
  });
}

/* ══ IL GIRO EXPORT → IMPORT DEL REGISTRO VOLATE ════════════════════════
   Il CSV è il modo in cui i dati **escono** dall'app e **rientrano**: nel
   backup dell'azienda, nel file che Genesi manda a Sentinella, nel foglio che
   qualcuno apre per controllare. Una colonna spostata o un'intestazione che
   non combacia con quello che il lettore si aspetta è il modo più **silenzioso**
   di perdere un registro: nessun errore, solo righe che rientrano diverse da
   come sono uscite.

   La prova più forte è quindi una sola: **si scrive, si rilegge, e si pretende
   che torni identico** — campo per campo, non «più o meno».

   ⚠️ Ma il giro da solo NON basta, e la controprova l'ha fatto vedere: scritti
   i numeri con la virgola italiana invece che col punto, il giro resta
   **identico** — perché il lettore usa `numIt`, che la virgola la legge. Il
   giro dimostra che scrittore e lettore vanno d'accordo fra loro, **non** che
   il formato sia quello giusto per chi il file lo apre con un altro programma.
   Per quello serve un'asserzione sul TESTO del file, ed è la penultima qui
   sotto. Vale in generale: **una prova di andata e ritorno resta verde anche
   se le due metà sbagliano insieme.** */
{
  const volate = [
    { id: "v1", data: "2026-07-20", fronte: 'Fronte "A"; nord', nFori: 20, kgTotali: 400,
      kgMaxRitardo: 50, distanzaRicettore: 200, esito: "regolare", note: "tutto ok",
      ppvMisurata: 3.2, ppvFonte: "strumento", ppvPuntoId: "p1", ppvPuntoNome: "Casa Rossi",
      ppvData: "2026-07-20", ppvOra: "10:30", stato: "eseguita", codiceVolata: "G-77" },
    { id: "v2", data: "2026-08-10", fronte: "B", nFori: 15, kgTotali: 300, kgMaxRitardo: 40,
      distanzaRicettore: 180, stato: "prevista", ppvPrevista: 4.2, ppvPrevLimite: 5,
      ppvPrevNorma: "UNI 9916", ppvPrevFonte: "genesi-sito", airblastPrevisto: 120, codiceVolata: "G-78" },
  ];
  const CAMPI = ["data", "fronte", "nFori", "kgTotali", "kgMaxRitardo", "distanzaRicettore",
    "esito", "note", "ppvMisurata", "ppvFonte", "ppvPuntoNome", "ppvOra", "stato",
    "ppvPrevista", "ppvPrevLimite", "ppvPrevNorma", "ppvPrevFonte", "airblastPrevisto", "codiceVolata"];
  const giro = sentinella.parseVolateCsv(sentinella.csvRegistroVolate(volate));

  test("⛔ csv: quello che esce rientra IDENTICO, campo per campo", () => {
    eq(giro.length, 2, "due righe fuori, due dentro");
    for (const orig of volate) {
      const r = giro.find((x) => x.codiceVolata === orig.codiceVolata) || {};
      const diversi = CAMPI.filter((c) => orig[c] !== undefined
        && String(orig[c]) !== String(r[c] === undefined ? "" : r[c]));
      eq(diversi.join(","), "", `la volata ${orig.codiceVolata} torna com'era`);
    }
  });
  test("⛔ csv: un punto e virgola DENTRO un campo non spacca il file", () => {
    /* il separatore è il punto e virgola, e «Fronte "A"; nord» ne contiene uno
       insieme a due virgolette: senza le regole delle virgolette la riga si
       spezzerebbe e tutte le colonne dopo scivolerebbero di uno */
    eq(giro[0].fronte, 'Fronte "A"; nord', "il testo torna esattamente com'era");
  });
  test("⛔ csv: una cella che comincia per «=» non diventa una formula", () => {
    /* aperto in Excel, «=SOMMA(A1:A9)» in una cella di testo verrebbe ESEGUITO:
       è la strada con cui un file di dati diventa un programma */
    const riga = sentinella.csvRegistroVolate([{ data: "2026-07-01", fronte: "=SOMMA(A1:A9)", nFori: 1 }]).split("\n")[1];
    eq(riga.includes("'=SOMMA(A1:A9)"), true, "l'apice davanti la disinnesca");
  });
  test("⛔ csv: lo stato attraversa il giro, così progetto ed evento restano distinti", () => {
    eq(giro.find((x) => x.codiceVolata === "G-78").stato, "prevista", "la prevista resta prevista");
    eq(giro.find((x) => x.codiceVolata === "G-77").stato, "eseguita", "e l'eseguita eseguita");
  });
  test("⛔ csv: la PPV PREVISTA non rientra nelle colonne della misurata", () => {
    /* sono due colonne diverse perché sono due cose diverse: una previsione
       messa dove sta una misura, dopo una settimana, non si distingue più */
    const prevista = giro.find((x) => x.codiceVolata === "G-78");
    eq(prevista.ppvMisurata, undefined, "nessuna misura su una volata non ancora sparata");
    eq(prevista.ppvPrevista, 4.2, "il previsto sta nel suo campo");
  });
  test("csv: l'id del punto di misura non viaggia nel file", () => {
    /* un id è vero solo dentro l'organizzazione che l'ha scritto: nel file
       resta il NOME, che è quello che un'altra azienda può leggere */
    eq(giro[0].ppvPuntoId, "", "nessun id");
    eq(giro[0].ppvPuntoNome, "Casa Rossi", "ma il nome sì");
  });
  test("⛔ csv: un file vecchio, senza le colonne in coda, si importa come prima", () => {
    /* le undici colonne della PPV e della previsione sono nate dopo: un
       registro esportato prima deve rientrare uguale, non a metà */
    const vecchio = "data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note\n"
      + "2026-07-01;A;12;250;30;150;regolare;niente\n";
    const v = sentinella.parseVolateCsv(vecchio);
    eq(v.length, 1, "la riga entra");
    eq(v[0].nFori, 12, "coi suoi numeri");
    eq(sentinella.statoVolata(v[0]), "eseguita", "e resta un fatto avvenuto, che è quello che è");
  });
  test("csv: una riga senza una data vera si scarta", () => {
    eq(sentinella.parseVolateCsv("data;fronte\n;A\n2026-07-01;B").length, 1, "solo quella con la data");
  });
  test("⛔ csv: un registro vuoto è l'intestazione da sola, non un file vuoto", () => {
    /* chi lo apre vede le colonne e capisce che il registro è vuoto, invece di
       un file di zero byte che sembra un export fallito */
    const c = sentinella.csvRegistroVolate([]);
    eq(c.startsWith("data;fronte;"), true, "c'è l'intestazione");
    eq(sentinella.parseVolateCsv(c).length, 0, "e nessuna riga");
  });
  test("csv: le righe escono in ordine di data", () => {
    const righe = sentinella.csvRegistroVolate(volate).split("\n").slice(1).filter(Boolean);
    eq(righe[0].startsWith("2026-07-20"), true, "prima luglio");
    eq(righe[1].startsWith("2026-08-10"), true, "poi agosto");
  });
  test("⛔ csv: i numeri per un'altra macchina escono col PUNTO decimale", () => {
    /* il file lo legge un programma, non una persona: la virgola italiana
       sarebbe un separatore di colonna in mezzo a un numero */
    eq(sentinella.csvRegistroVolate(volate).includes(";3.2;"), true, "3.2, non 3,2");
  });

  test("⛔ csv referti: a Genesi vanno i tre numeri e da dove vengono", () => {
    const pronti = sentinella.refertiDaVolate([{ id: "r1", data: "2026-07-20", fronte: "A",
      distanzaRicettore: 200, kgMaxRitardo: 50, ppvMisurata: 3.2, ppvFonte: "strumento",
      ppvPuntoNome: "Casa" }]).pronti;
    const c = sentinella.csvRefertiGenesi(pronti).split("\n");
    eq(c[0], sentinella.CSV_REFERTI_INTESTAZIONE, "l'intestazione è quella dichiarata");
    eq(c[1].startsWith("200;50;3.2;"), true, "distanza, carica per ritardo, PPV");
    eq(c[1].includes("Volata 20/07/2026"), true, "e il riferimento per risalire alla volata");
  });
}

/* ══ IL RECLAMO DI UN RESIDENTE, E LA COINCIDENZA CHE NON È UNA CAUSA ═══
   Il reclamo è l'altro ingresso del ponte verso Scudo: non finisce quando è
   stato registrato, richiede che qualcuno faccia qualcosa entro una data.

   La regola più delicata di tutte non è un calcolo, è una **frase**. Un
   superamento nello stesso giorno di una volata va **guardato**, non
   **spiegato**: due fatti nello stesso giorno sono due fatti nello stesso
   giorno. Scrivere «causato dalla volata» dentro un documento che finisce
   all'ente è un autogol — e spesso è anche falso. */
{
  const reclami = [
    { id: "r1", data: "2026-07-10", tipo: "rumore", stato: "aperto",
      chi: "Sig. Rossi", descrizione: "rumore alle 6", ora: "06:15" },
    { id: "r2", data: "2026-07-20", tipo: "polvere", stato: "chiuso" },
    { id: "r3", data: "boh", tipo: "altro" }];

  test("reclami: quanti in tutto, quanti ancora aperti, e l'ultimo", () => {
    const r = sentinella.riepilogoReclami(reclami);
    eq(r.totale, 3, "tre in tutto");
    eq(r.aperti, 2, "due aperti: chi non ha stato non è chiuso");
    eq(r.ultimo, "2026-07-20", "e una data impossibile non diventa «l'ultimo»");
  });
  test("reclami: senza reclami non si inventa una data", () => {
    eq(sentinella.riepilogoReclami([]).ultimo, null, "nessun ultimo");
    eq(sentinella.riepilogoReclami(null).totale, 0, "e nemmeno con la lista mancante");
  });
  test("reclami: un tipo sconosciuto finisce sotto «Altro», non sparisce", () => {
    eq(sentinella.etichettaReclamo("POLVERE"), "Polvere", "il maiuscolo non conta");
    eq(sentinella.etichettaReclamo("boh"), "Altro", "e l'ignoto ha un posto dove stare");
  });

  test("⛔ bozza reclamo: l'azione porta con sé il fatto, scritto in italiano", () => {
    /* Scudo non può leggere le collezioni di Sentinella: un'azione che dicesse
       solo «origine: reclamo xyz» sarebbe illeggibile per l'RSPP */
    const b = sentinella.bozzaAzioneReclamo(reclami[0], { id: "ric1", nome: "Casa Rossi" });
    eq(b.origineTipo, sentinella.ORIGINE_RECLAMO, "il tipo di fatto");
    eq(b.origineApp, sentinella.PONTE_APP, "e da quale app arriva");
    eq(b.origineNota.includes("Sig. Rossi"), true, "chi ha segnalato");
    eq(b.origineNota.includes("«rumore alle 6»"), true, "e le sue parole, fra virgolette");
    eq(b.origineNota.includes("Casa Rossi"), true, "col ricettore");
  });
  test("bozza reclamo: la descrizione proposta dice già cosa fare", () => {
    const b = sentinella.bozzaAzioneReclamo(reclami[0], { id: "ric1", nome: "Casa Rossi" });
    eq(b.descrizione, "Dare seguito al reclamo per rumore a Casa Rossi del 10/07/2026",
       "un compito, non un'etichetta");
    eq(b.stato, "aperta", "e nasce aperta");
  });
  test("⛔ bozza reclamo: senza data la voce non resta vuota", () => {
    /* `origineVoce` è la chiave con cui si riconosce il doppione: vuota,
       due reclami diversi sembrerebbero lo stesso */
    eq(sentinella.bozzaAzioneReclamo({ id: "r9", tipo: "altro" }, null).origineVoce, "reclamo",
       "una parola al posto del vuoto");
    eq(sentinella.bozzaAzioneReclamo({ tipo: "rumore" }), null, "e senza id non si prepara niente");
  });

  const volate = [{ id: "v1", data: "2026-07-10", fronte: "A" },
    { id: "v2", data: "2026-07-10", fronte: "B" }, { id: "v3", data: "2026-07-11", fronte: "A" }];
  test("⛔ coincidenza: si dice che c'era una volata, NON che è stata la causa", () => {
    /* «causato dalla volata» dentro un documento che va all'ente è un autogol,
       e spesso è anche falso: servono la misura strumentale, l'ora e una
       valutazione tecnica */
    const c = sentinella.coincidenzaVolata(volate, "2026-07-10");
    eq(c.n, 2, "due volate quel giorno");
    eq(c.testo.includes("causa"), false, "il testo non parla di cause");
    eq(c.avviso.includes("non una causa dimostrata"), true, "e l'avviso lo dice esplicitamente");
  });
  test("coincidenza: si dice quante e su quali fronti", () => {
    eq(sentinella.coincidenzaVolata(volate, "2026-07-10").testo,
       "Quel giorno sono state registrate 2 volate (A, B).", "al plurale");
    eq(sentinella.coincidenzaVolata(volate, "2026-07-11").testo,
       "Quel giorno è stata registrata una volata (A).", "e al singolare, in italiano");
  });
  test("⛔ coincidenza: senza volate quel giorno non si scrive niente", () => {
    /* un riquadro vuoto accanto a un superamento suggerirebbe un legame che
       nessuno ha misurato */
    eq(sentinella.coincidenzaVolata(volate, "2026-07-12"), null, "niente da dire");
  });

  test("esito del report: le tre facce sono quelle del semaforo di tutta l'app", () => {
    eq(sentinella.ESITI["conforme"].cls, "ok", "verde");
    eq(sentinella.ESITI["non-conforme"].cls, "danger", "rosso");
    eq(sentinella.ESITI["senza-dati"].cls, "warn", "e «senza dati» è giallo, non verde");
  });
  test("⛔ esito del report: «senza dati» non dice che il limite è stato rispettato", () => {
    /* è la differenza fra «abbiamo misurato e va bene» e «non abbiamo
       misurato»: su un documento per l'ente confonderle è il difetto peggiore */
    const t = sentinella.ESITI["senza-dati"].testo;
    eq(t.includes("non può dire se il limite è stato rispettato"), true, "lo dichiara");
    eq(t.includes("nessuna lettura ha raggiunto la soglia"), false, "e non si spaccia per conforme");
  });
}

/* ══ IL REGISTRO DELLE AZIONI CORRETTIVE (CAPA) ═════════════════════════
   È l'altra sponda dei due ponti di Sentinella, ed è quello che la legge chiede
   di tracciare insieme agli eventi: **segnala → correggi → verifica**. Un
   infortunio, un near-miss, una voce non conforme di un'ispezione, un
   superamento ambientale, il reclamo di un residente: tutti finiscono qui, e da
   qui esce la risposta alla domanda «e voi cosa avete fatto?».

   La scelta di fondo che le prove difendono: **l'avanzamento si salva, il
   semaforo si calcola.** «Aperta / in corso / chiusa» è un dato scritto da
   qualcuno; «scaduta / in scadenza / regolare» viene dalla data, ogni volta.
   Salvare anche quello significherebbe avere nel database un'azione «regolare»
   che nel frattempo è scaduta — un dato derivato che invecchia in silenzio. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const az = (o) => ({ id: "a1", descrizione: "x", stato: "aperta", scadenza: "2026-08-15", ...o });

  test("azioni: l'avanzamento gira col tocco, e si richiude in cerchio", () => {
    eq(scudo.azioneStatoSuccessivo("aperta"), "in-corso", "aperta → in corso");
    eq(scudo.azioneStatoSuccessivo("in-corso"), "chiusa", "in corso → chiusa");
    eq(scudo.azioneStatoSuccessivo("chiusa"), "aperta", "e si può riaprire, perché a volte non era finita");
    eq(scudo.azioneStatoSuccessivo("boh"), "in-corso", "uno stato sconosciuto vale «aperta»");
  });
  test("⛔ azioni: un'azione senza stato è APERTA, non chiusa", () => {
    /* il valore di partenza deve essere quello che chiede attenzione: il
       contrario nasconderebbe un compito che nessuno ha preso in carico */
    eq(scudo.azioneLabel(undefined).label, "Aperta", "aperta");
    eq(scudo.azioneLabel(undefined).cls, "danger", "e in rosso");
  });
  test("⛔ azioni: il semaforo della scadenza NON è lo stato salvato", () => {
    /* è calcolato dalla data ogni volta: salvarlo darebbe un'azione «regolare»
       nel database che nel frattempo è scaduta */
    eq(scudo.statoAzione(az({ scadenza: "2026-07-30" }), OGGI), "scaduta", "ieri");
    eq(scudo.statoAzione(az({ scadenza: "2026-07-31" }), OGGI), "in-scadenza", "oggi non è ancora scaduta");
    eq(scudo.statoAzione(az({ scadenza: "2026-08-30" }), OGGI), "in-scadenza", "trenta giorni: preavviso");
    eq(scudo.statoAzione(az({ scadenza: "2026-08-31" }), OGGI), "regolare", "trentuno: ancora lontana");
  });
  test("⛔ azioni: un'azione CHIUSA non scade più, nemmeno se la data è passata", () => {
    /* il lavoro è finito: tenerla rossa riempirebbe il quadro di allarmi che
       nessuno può togliere, e allora si smette di guardarli */
    eq(scudo.statoAzione(az({ scadenza: "2026-01-01", stato: "chiusa" }), OGGI), "regolare", "chiusa a gennaio");
  });
  test("azioni: senza scadenza non si allarma", () => {
    eq(scudo.statoAzione(az({ scadenza: "" }), OGGI), "regolare", "manca la data, non il rispetto della data");
  });

  const elenco = [az({ id: "a1", scadenza: "2026-08-30" }), az({ id: "a2", scadenza: "2026-07-01" }),
    az({ id: "a3", scadenza: "2027-01-01" }), az({ id: "a4", scadenza: "2026-07-02", stato: "chiusa" }),
    az({ id: "a5", scadenza: "", stato: "in-corso" })];

  test("⛔ azioni: le urgenti sono solo quelle DA CHIUDERE e con la data addosso", () => {
    const u = scudo.azioniUrgenti(elenco, OGGI);
    eq(u.map((a) => a.id).join(","), "a2,a1", "la scaduta e quella in scadenza");
    eq(u[0].scadenza < u[1].scadenza, true, "prima la più vecchia, che è la più urgente");
  });
  test("azioni: la chiusa e quella senza data non entrano fra le urgenti", () => {
    const u = scudo.azioniUrgenti(elenco, OGGI).map((a) => a.id);
    eq(u.includes("a4"), false, "chiusa a luglio, era scaduta");
    eq(u.includes("a5"), false, "e quella senza scadenza");
  });
  test("⛔ azioni: il riepilogo conta ogni azione una volta sola", () => {
    const r = scudo.riepilogoAzioni(elenco, OGGI);
    eq(r.totale, 5, "cinque azioni");
    eq(r.aperte + r.inCorso + r.chiuse, r.totale, "e i tre stati fanno il totale: nessuna cade fuori");
    eq(r.daChiudere, 4, "quattro non sono chiuse");
    eq(r.scadute, 1, "una scaduta");
    eq(r.inScadenza, 1, "e una in scadenza");
  });

  const miste = [{ origineTipo: "evento", origineId: "e1" }, { origineTipo: "ispezione", origineId: "i1" },
    { origineTipo: "superamento", origineId: "p1", stato: "aperta" },
    { origineTipo: "reclamo", origineId: "r1", stato: "chiusa" }];

  test("⛔ azioni: si risale dall'evento alle sue azioni, e solo alle sue", () => {
    /* è la catena che l'ispettore percorre al contrario: questo infortunio,
       che cosa avete fatto? */
    eq(scudo.azioniDiEvento(miste, "e1").length, 1, "quella dell'evento");
    eq(scudo.azioniDiEvento(miste, "i1").length, 0, "non quella dell'ispezione, che ha lo stesso ruolo ma altra origine");
    eq(scudo.azioniDiEvento(miste, "").length, 0, "e senza id non si tira su tutto");
  });
  test("azioni: e allo stesso modo dall'ispezione", () => {
    eq(scudo.azioniDiIspezione(miste, "i1").length, 1, "quella dell'ispezione");
    eq(scudo.azioniDiIspezione(miste, "e1").length, 0, "non quella dell'evento");
  });
  test("⛔ ambiente: un'azione che arriva da Sentinella si riconosce", () => {
    /* serve a scrivere l'origine giusta e a NON farla cancellare da una
       modifica fatta dal form di Scudo, che non sa da dove viene */
    eq(miste.map((a) => scudo.daAmbiente(a)).join(","), "false,false,true,true", "le due ambientali");
    eq(scudo.etichettaAmbiente(miste[2]), "Superamento", "e si dice quale delle due è");
    eq(scudo.etichettaAmbiente(miste[3]), "Reclamo", "l'altra");
  });
  test("ambiente: il riepilogo separa i superamenti dai reclami", () => {
    const r = scudo.riepilogoAmbiente(miste);
    eq(r.totale, 2, "due ambientali");
    eq(r.superamenti, 1, "un superamento");
    eq(r.reclami, 1, "e un reclamo");
    eq(r.daChiudere, 1, "una sola resta da chiudere");
  });
  test("ambiente: senza nessuna azione ambientale tutti zero, niente si rompe", () => {
    eq(scudo.riepilogoAmbiente([]).totale, 0, "vuoto");
    eq(scudo.riepilogoAmbiente(null).daChiudere, 0, "e nemmeno con la lista mancante");
  });
}

/* ══ «CHI PUÒ FARE QUEL LAVORO DOMANI MATTINA» ══════════════════════════
   È la funzione con la posta più alta di tutta la piattaforma: dice se una
   persona può stare in cava a fare un certo lavoro. Tre risposte sole, perché
   di mattina non c'è tempo di leggere una tabella — **può / attenzione / no**.

   La scelta dichiarata nel modulo, e che queste prove blindano:

   · **bloccano** la persona non in forza, l'idoneità sanitaria negativa e un
     corso richiesto **mancante o scaduto**;
   · **i DPI NON bloccano, ma pesano.** L'app sa se la consegna è
     *registrata*, non se il lavoratore ha l'elmetto **in mano**: dirlo come
     certezza sarebbe una bugia. Restano in evidenza, non nascosti.

   ⛔ Qui non si tocca nulla di quello che l'app decide: si scrive soltanto la
   prova che continui a deciderlo così. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const REQ = scudo.REQUISITI_FORMAZIONE[0];      // la visita medica periodica
  const lav = (o) => ({ id: "L1", nome: "Mario Rossi", attivo: true, idoneita: "idoneo", ...o });
  const mansione = { id: "m1", nome: "Fochino", lavoratoriIds: ["L1"], requisiti: [REQ.chiave], dpi: [] };
  const inRegola = [{ lavoratoreId: "L1", preset: REQ.chiave, dataScadenza: "2027-06-01" }];

  test("⛔ requisito: una scadenza lo copre in tre modi, dal più sicuro al più tollerante", () => {
    /* i dati veri arrivano da fogli diversi: pretendere solo il campo `preset`
       lascerebbe fuori tutte le righe scritte a mano prima che esistesse */
    eq(scudo.scadenzaCopreRequisito({ preset: REQ.chiave, descrizione: "qualsiasi" }, REQ), true, "nata da quell'adempimento");
    eq(scudo.scadenzaCopreRequisito({ descrizione: REQ.etichetta.toUpperCase() }, REQ), true, "stessa descrizione, maiuscole a parte");
    eq(scudo.scadenzaCopreRequisito({ descrizione: "corso " + REQ.parole[0] }, REQ), true, "o una parola che lo identifica");
    eq(scudo.scadenzaCopreRequisito({ descrizione: "revisione estintori" }, REQ), false, "e un'altra cosa non lo copre");
  });
  test("⛔ requisito: con più rinnovi vale l'ULTIMO, non il primo trovato", () => {
    /* il primo trovato sarebbe il corso del 2026 già scaduto, e la persona
       risulterebbe non abilitata pur avendo rinnovato */
    const due = [{ lavoratoreId: "L1", preset: REQ.chiave, dataScadenza: "2026-01-01" },
      { lavoratoreId: "L1", preset: REQ.chiave, dataScadenza: "2027-06-01" }];
    const st = scudo.statoRequisito(REQ, due, OGGI);
    eq(st.scadenza, "2027-06-01", "il rinnovo più lontano");
    eq(st.stato, "regolare", "quindi in regola");
  });
  test("requisito: senza nessuna riga lo stato è MANCANTE, non «regolare»", () => {
    /* «non risulta» non è «va bene»: è la stessa differenza fra «senza dati» e
       «conforme» del report ambientale */
    eq(scudo.statoRequisito(REQ, [], OGGI).stato, "mancante", "mancante");
  });
  test("requisito: una chiave sconosciuta non rompe la schermata", () => {
    const r = scudo.requisitoSicuro("corso-inventato");
    eq(r.etichetta, "corso-inventato", "meglio l'etichetta grezza che una pagina rotta");
    eq(scudo.requisitoFormazione("corso-inventato"), null, "ma si sa che non è dell'elenco");
  });

  test("abilitazione: con tutto a posto la risposta è «può»", () => {
    eq(scudo.abilitazioneLavoratore(lav(), mansione, inRegola, [], OGGI).esito, "puo", "può andare");
  });
  test("⛔ abilitazione: un corso richiesto che manca BLOCCA", () => {
    const a = scudo.abilitazioneLavoratore(lav(), mansione, [], [], OGGI);
    eq(a.esito, "no", "non può");
    eq(a.bloccanti.length > 0, true, "e si dice perché");
  });
  test("⛔ abilitazione: bloccano anche il non in forza e il non idoneo", () => {
    eq(scudo.abilitazioneLavoratore(lav({ attivo: false }), mansione, inRegola, [], OGGI).bloccanti.join(""),
       "non è in forza", "chi non è in forza non va in cava");
    eq(scudo.abilitazioneLavoratore(lav({ idoneita: "non-idoneo" }), mansione, inRegola, [], OGGI).bloccanti.join(""),
       "giudicato non idoneo alla visita medica", "e nemmeno chi il medico ha giudicato non idoneo");
  });
  test("⛔ abilitazione: «idoneo con prescrizioni» avvisa, non blocca", () => {
    /* il medico l'ha dichiarato idoneo: bloccarlo sarebbe l'app che decide al
       posto del medico competente */
    const a = scudo.abilitazioneLavoratore(lav({ idoneita: "prescrizioni" }), mansione, inRegola, [], OGGI);
    eq(a.esito, "attenzione", "può andare, con qualcosa da sapere");
    eq(a.attenzioni.join(""), "idoneo con prescrizioni", "e lo si legge");
  });
  test("⛔ abilitazione: un DPI mai consegnato NON blocca, ma resta in evidenza", () => {
    /* l'app sa se la consegna è REGISTRATA, non se il lavoratore ha l'elmetto
       in mano: dirlo come certezza sarebbe una bugia in tutte e due le
       direzioni — bloccare chi ce l'ha, o assolvere chi non ce l'ha */
    const dpi = scudo.TIPI_DPI[0];
    const a = scudo.abilitazioneLavoratore(lav(), { ...mansione, dpi: [dpi.chiave] }, inRegola, [], OGGI);
    eq(a.esito, "attenzione", "non «no»");
    eq(a.attenzioni.some((x) => x.includes("consegna mai registrata")), true,
       "e la frase dice REGISTRATA, non «non ce l'ha»");
  });

  test("⛔ matrice: prima chi può andare, poi chi no — non l'alfabeto", () => {
    /* di mattina si guarda la prima riga: deve essere una persona che può
       lavorare, non la prima in ordine alfabetico */
    const righe = scudo.matriceMansione({ ...mansione, lavoratoriIds: ["L1", "L2"] },
      [lav({ id: "L1", nome: "Zeta" }), lav({ id: "L2", nome: "Anna" })], inRegola, [], OGGI);
    eq(righe.map((r) => r.lavoratore.nome + ":" + r.esito).join(","), "Zeta:puo,Anna:no",
       "Zeta può e viene prima, Anna no e viene dopo");
  });
  test("matrice: una persona non più in elenco non fa sparire la riga delle altre", () => {
    const righe = scudo.matriceMansione({ ...mansione, lavoratoriIds: ["L1", "sparito"] },
      [lav({ id: "L1" })], inRegola, [], OGGI);
    eq(righe.length, 1, "resta quella che c'è");
  });
  test("matrice: il riepilogo conta le tre risposte, e la somma torna", () => {
    const r = scudo.riepilogoMansioni([{ ...mansione, lavoratoriIds: ["L1", "L2"] }],
      [lav({ id: "L1" }), lav({ id: "L2", nome: "Anna" })], inRegola, [], OGGI)[0];
    eq(r.puo + r.attenzione + r.no, r.totale, "nessuna persona cade fuori dal conto");
    eq(r.puo, 1, "una può");
    eq(r.no, 1, "e una no");
  });
}

/* ══ L'ORGANIGRAMMA DELLA SICUREZZA: CHI HA QUEL RUOLO, DAVVERO ═════════
   Sorvegliante, direttore, preposto, RSPP, medico competente, RLS, primo
   soccorso, antincendio: otto ruoli **obbligatori**, e sono fra le prime cose
   che un ispettore chiede. L'organigramma dice per ognuno chi c'è e com'è messa
   la sua formazione.

   ⛔ La regola che queste prove hanno trovato mancante: **una nomina copre un
   ruolo solo se la persona c'è ancora.** Una nomina che punta a un lavoratore
   cancellato dall'anagrafica — o non più in forza — non copre niente: il ruolo
   è scoperto, e dirlo verde è un semaforo che mente su un obbligo di legge. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const rspp = (o) => ({ id: "n1", ruolo: "rspp", lavoratoreId: "L1", ...o });
  const LAV = [{ id: "L1", nome: "Mario", attivo: true }, { id: "L2", nome: "Anna", attivo: false }];
  const bloccoDi = (nomine, scadenze = []) =>
    scudo.organigrammaSicurezza(nomine, LAV, scadenze, OGGI).find((x) => x.ruolo.chiave === "rspp");

  test("nomina: è attiva quando è già decorsa e non è ancora finita", () => {
    eq(scudo.nominaAttiva({ ruolo: "rspp" }, OGGI), true, "senza date è in corso");
    eq(scudo.nominaAttiva({ dal: "2026-09-01" }, OGGI), false, "una che deve ancora partire");
    eq(scudo.nominaAttiva({ al: "2026-06-01" }, OGGI), false, "e una già finita");
    eq(scudo.nominaAttiva({ dal: "2026-07-31" }, OGGI), true, "il giorno in cui comincia conta");
    eq(scudo.nominaAttiva({ al: "2026-07-31" }, OGGI), true, "e anche quello in cui finisce");
  });
  test("⛔ organigramma: un ruolo obbligatorio senza nessuno è ROSSO", () => {
    const o = bloccoDi([]);
    eq(o.mancante, true, "nessuno è nominato");
    eq(o.stato, "danger", "e si vede");
    eq(scudo.NOMINE_RUOLI.filter((r) => r.obbligatoria).length, 8, "gli obbligatori sono otto");
  });
  test("⛔ organigramma: una nomina su una persona NON PIÙ IN ANAGRAFICA non copre il ruolo", () => {
    /* è un semaforo verde su una sedia vuota, e su un obbligo di legge */
    const o = bloccoDi([rspp({ lavoratoreId: "sparito" })]);
    eq(o.stato, "danger", "il ruolo resta da sistemare");
    eq(scudo.nomineDaSistemare([o]).length, 1, "e finisce nelle urgenze del quadro");
  });
  test("⛔ organigramma: una nomina su chi NON È PIÙ IN FORZA non copre il ruolo", () => {
    /* la persona esiste ancora in anagrafica ma ha lasciato l'azienda: la
       nomina resta scritta, il ruolo però è scoperto */
    const o = bloccoDi([rspp({ lavoratoreId: "L2" })]);
    eq(o.stato, "danger", "da sistemare");
    eq(o.persone.length, 1, "la nomina resta visibile: si deve poter capire chi era");
  });
  test("organigramma: con la persona in forza il ruolo è coperto", () => {
    const o = bloccoDi([rspp()]);
    eq(o.stato, "ok", "verde");
    eq(o.mancante, false, "coperto");
    eq(scudo.nomineDaSistemare([o]).length, 0, "niente da sistemare");
  });
  test("⛔ organigramma: nominato ma senza la formazione richiesta è ROSSO", () => {
    /* il preposto ha un corso obbligatorio con aggiornamento biennale: averlo
       nominato senza il corso è una nomina che non regge */
    const org = scudo.organigrammaSicurezza([{ id: "n2", ruolo: "preposto", lavoratoreId: "L1" }],
      LAV, [], OGGI).find((x) => x.ruolo.chiave === "preposto");
    eq(org.senzaFormazione, 1, "una persona senza il corso");
    eq(org.stato, "danger", "e il blocco è rosso");
  });
  test("organigramma: col corso in regola il preposto è a posto", () => {
    const org = scudo.organigrammaSicurezza([{ id: "n2", ruolo: "preposto", lavoratoreId: "L1" }],
      LAV, [{ lavoratoreId: "L1", preset: "form-preposto", dataScadenza: "2027-06-01" }],
      OGGI).find((x) => x.ruolo.chiave === "preposto");
    eq(org.senzaFormazione, 0, "il corso c'è");
    eq(org.stato, "ok", "verde");
  });
  test("organigramma: un ruolo NON obbligatorio senza nessuno non è un allarme", () => {
    /* il dirigente delegato è una figura che può non esserci: un rosso lì
       insegnerebbe a ignorare i rossi */
    const o = scudo.organigrammaSicurezza([], LAV, [], OGGI).find((x) => !x.ruolo.obbligatoria);
    eq(o.mancante, false, "non manca: non è dovuto");
    eq(o.stato, "mute", "e resta spento");
  });
}

/* ══ I DPI: UN ELENCO DI CONSEGNE CHE DICE CHI È SCOPERTO ═══════════════
   Il registro dei dispositivi di protezione non serve a niente se dice solo
   quello che è stato consegnato: la domanda vera è **chi è scoperto**. Qui si
   incrociano le mansioni (che dicono quali DPI servono) con le consegne
   registrate.

   ⚠️ Nota di parentela: `allarmiDpi` **salta** i lavoratori non più in forza
   (`if (!l || l.attivo === false) continue`), ed è la guardia che
   nell'organigramma delle nomine **mancava** — il difetto corretto un'unità fa.
   Qui c'era già: si scrive la prova perché resti. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const ELMETTO = scudo.TIPI_DPI[0];
  const OTO = scudo.TIPI_DPI.find((t) => t.addestramento);   // otoprotettori: addestramento obbligatorio
  const LAV = [{ id: "L1", nome: "Mario", attivo: true }, { id: "L2", nome: "Anna", attivo: false },
    { id: "L3", nome: "Bruno", attivo: true }];
  const MANS = [{ id: "m1", nome: "Fochino", lavoratoriIds: ["L1", "L2", "L3"],
    dpi: [ELMETTO.chiave, OTO.chiave] }];

  test("⛔ dpi: chi non ha mai ricevuto un dispositivo richiesto è scoperto, in rosso", () => {
    const a = scudo.allarmiDpi(MANS, LAV, [], OGGI);
    eq(a.length, 4, "due persone in forza per due dispositivi");
    eq(a.every((x) => x.gravita === "danger"), true, "e «mai consegnato» è rosso");
  });
  test("⛔ dpi: chi non è più in forza non compare fra gli scoperti", () => {
    /* è la guardia che nell'organigramma delle nomine mancava: qui c'era già,
       e questa prova serve a tenerla */
    const a = scudo.allarmiDpi(MANS, LAV, [], OGGI);
    eq(a.some((x) => x.lavoratoreId === "L2"), false, "Anna ha lasciato l'azienda");
  });
  test("⛔ dpi: due problemi sullo stesso dispositivo stanno in UNA riga sola", () => {
    /* due righe uguali una sotto l'altra sembrano un errore del programma, e
       chi legge non capisce se sono due elmetti o due volte lo stesso */
    const c = [{ id: "c1", lavoratoreId: "L1", tipo: OTO.chiave, dataConsegna: "2020-01-01",
      scadenza: "2024-01-01", addestramento: false }];
    const righe = scudo.allarmiDpi(MANS, LAV, c, OGGI)
      .filter((x) => x.lavoratoreId === "L1" && x.tipo === OTO.chiave);
    eq(righe.length, 1, "una riga");
    eq(righe[0].motivo, "da sostituire · addestramento non registrato", "coi due motivi dentro");
    eq(righe[0].gravita, "danger", "e il più grave dei due vince");
  });
  test("dpi: con tutto consegnato e addestrato non si allarma nessuno", () => {
    const c = [{ id: "c2", lavoratoreId: "L1", tipo: ELMETTO.chiave, dataConsegna: "2026-01-01", scadenza: "2028-01-01" },
      { id: "c3", lavoratoreId: "L1", tipo: OTO.chiave, dataConsegna: "2026-01-01", scadenza: "2028-01-01", addestramento: true }];
    eq(scudo.allarmiDpi(MANS, LAV, c, OGGI).filter((x) => x.lavoratoreId === "L1").length, 0, "niente da sistemare");
  });
  test("⛔ dpi: l'addestramento mancante emerge anche FUORI da una mansione", () => {
    /* un dispositivo che richiede addestramento consegnato senza è una cosa
       fuori posto comunque, anche se nessuna mansione lo richiede */
    const c = [{ id: "c4", lavoratoreId: "L3", tipo: OTO.chiave, dataConsegna: "2026-01-01",
      scadenza: "2028-01-01", addestramento: false }];
    const a = scudo.allarmiDpi([], LAV, c, OGGI);
    eq(a.length, 1, "una riga anche senza mansioni");
    eq(a[0].motivo, "addestramento non registrato", "col suo motivo");
  });
  test("dpi: la consegna che conta è l'ULTIMA, non la prima registrata", () => {
    const c = [{ id: "x1", lavoratoreId: "L1", tipo: "elmetto", dataConsegna: "2024-01-01" },
      { id: "x2", lavoratoreId: "L1", tipo: "elmetto", dataConsegna: "2026-01-01" }];
    eq(scudo.ultimaConsegnaDpi(c, "L1", "elmetto").id, "x2", "quella del 2026");
  });
  test("dpi: il riepilogo separa i tre motivi", () => {
    const c = [{ id: "c1", lavoratoreId: "L1", tipo: OTO.chiave, dataConsegna: "2020-01-01",
      scadenza: "2024-01-01", addestramento: false }];
    const r = scudo.riepilogoDpi(c, scudo.allarmiDpi(MANS, LAV, c, OGGI));
    eq(r.mancanti, 3, "tre mai consegnati");
    eq(r.daSostituire, 1, "uno da sostituire");
    eq(r.addestramenti, 1, "e un addestramento non registrato");
  });
  test("⛔ verbale: il foglio della persona parte dalla consegna più recente", () => {
    /* è il documento che in ispezione viene chiesto per primo: in cima ci va
       quello che vale adesso */
    const c = [{ id: "x1", lavoratoreId: "L1", tipo: "elmetto", dataConsegna: "2024-01-01" },
      { id: "x2", lavoratoreId: "L1", tipo: "elmetto", dataConsegna: "2026-01-01" }];
    const v = scudo.verbaleDpi({ id: "L1" }, c, OGGI);
    eq(v.righe[0].consegna.id, "x2", "la più recente in cima");
    eq(v.righe.length, 2, "e la storia resta tutta");
  });
}

/* ══ LE ISPEZIONI PERIODICHE ════════════════════════════════════════════
   Il terzo ingresso del registro delle azioni correttive, dopo gli eventi e i
   due ponti ambientali: da una voce **non conforme** nasce un'azione.

   La regola più importante non riguarda i conteggi, riguarda il **tempo**: le
   voci del modello vengono **copiate dentro** l'ispezione. Un modello che
   cambia domani non deve riscrivere le ispezioni già fatte — **un controllo
   firmato non si modifica a posteriori**, e un'ispezione che cambiasse forma
   dopo la firma non varrebbe niente davanti a nessuno. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const CHIAVE = scudo.MODELLI_ISPEZIONE[0].chiave;

  test("⛔ ispezione: le voci del modello sono COPIATE, non collegate", () => {
    /* la copia è quello che rende il controllo un documento e non una vista su
       un modello che intanto è cambiato */
    const isp = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-07-31" });
    const modello = scudo.modelloIspezione(CHIAVE);
    eq(isp.voci.length, modello.voci.length, "tutte le voci del modello");
    eq(isp.voci[0].testo, modello.voci[0], "col loro testo");
    eq(isp.voci[0].id, "v1", "e un id proprio dell'ispezione");
    eq(Array.isArray(isp.voci) && isp.voci !== modello.voci, true, "un elenco nuovo, non lo stesso oggetto");
  });
  test("ispezione: nasce in corso, senza esiti e senza data di chiusura", () => {
    const isp = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-07-31" });
    eq(isp.stato, "in-corso", "in corso");
    eq(Object.keys(isp.esiti).length, 0, "nessun esito già messo");
    eq(isp.dataChiusura, null, "e nessuna chiusura");
  });
  test("ispezione: un modello che non esiste non produce un'ispezione vuota", () => {
    eq(scudo.nuovaIspezioneDaModello("inventato"), null, "null, non un guscio senza voci");
  });
  test("⛔ ispezione: quello che manca si conta, non si dà per conforme", () => {
    /* una voce non ancora spuntata è «da fare»: contarla come conforme
       renderebbe completo un controllo che nessuno ha finito */
    const isp = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-07-31" });
    isp.esiti[isp.voci[0].id] = { esito: "conforme" };
    isp.esiti[isp.voci[1].id] = { esito: "non-conforme", nota: "sbarramento caduto" };
    const r = scudo.riepilogoIspezione(isp);
    eq(r.conformi, 1, "una conforme");
    eq(r.nonConformi, 1, "una no");
    eq(r.daFare, isp.voci.length - 2, "e tutte le altre restano da fare");
    eq(r.completa, false, "quindi non è completa");
  });
  test("ispezione: «non applicabile» è una risposta data, non una mancante", () => {
    const isp = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-07-31" });
    for (const v of isp.voci) isp.esiti[v.id] = { esito: "na" };
    const r = scudo.riepilogoIspezione(isp);
    eq(r.na, isp.voci.length, "tutte non applicabili");
    eq(r.completa, true, "il controllo è comunque finito");
    eq(r.percento, 100, "e si vede");
  });
  test("⛔ ispezione: le voci non conformi portano con sé la nota", () => {
    /* la nota è quello che diventa la descrizione dell'azione correttiva:
       perderla lascerebbe un compito senza il fatto che l'ha generato */
    const isp = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-07-31" });
    isp.esiti[isp.voci[1].id] = { esito: "non-conforme", nota: "  sbarramento caduto  " };
    const nc = scudo.vociNonConformi(isp);
    eq(nc.length, 1, "una voce");
    eq(nc[0].nota, "sbarramento caduto", "con la nota, ripulita dagli spazi");
    eq(nc[0].testo, isp.voci[1].testo, "e col testo della voce");
  });
  test("⛔ ispezione: un'ispezione COMPLETATA non è più in ritardo", () => {
    /* è finita: tenerla rossa è lo stesso allarme che nessuno può togliere
       delle azioni correttive */
    eq(scudo.statoIspezione({ stato: "completata", data: "2026-01-01" }, OGGI), "regolare", "fatta a gennaio");
    eq(scudo.statoIspezione({ stato: "in-corso", data: "2026-01-01" }, OGGI), "scaduta", "una non finita invece sì");
  });
  test("ispezione: senza data programmata non si allarma", () => {
    eq(scudo.statoIspezione({ stato: "in-corso", data: "" }, OGGI), "regolare", "manca la data, non il rispetto della data");
  });
  test("⛔ ispezioni: il riepilogo somma le non conformità di TUTTE, anche delle chiuse", () => {
    /* una non conformità trovata resta un fatto anche dopo che l'ispezione è
       stata chiusa: è da lì che nascono le azioni */
    const a = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-01-01", stato: "completata" });
    a.esiti[a.voci[0].id] = { esito: "non-conforme", nota: "x" };
    const b = scudo.nuovaIspezioneDaModello(CHIAVE, { data: "2026-01-15" });
    b.esiti[b.voci[0].id] = { esito: "non-conforme", nota: "y" };
    const r = scudo.riepilogoIspezioni([a, b], OGGI);
    eq(r.totale, 2, "due ispezioni");
    eq(r.completate, 1, "una completata");
    eq(r.scadute, 1, "e una non finita che era di gennaio");
    eq(r.nonConformi, 2, "le non conformità si contano tutte e due");
  });
  test("ispezioni: i tre esiti hanno il colore del semaforo di tutta l'app", () => {
    eq(scudo.esitoLabel("conforme").cls, "ok", "verde");
    eq(scudo.esitoLabel("non-conforme").cls, "danger", "rosso");
    eq(scudo.esitoLabel("na").cls, "tag", "e «non applicabile» non è né l'uno né l'altro");
    eq(scudo.esitoLabel("boh"), null, "un esito inventato non esiste");
  });
}

/* ══ IL NEAR-MISS, E IL MURO DELLE SCADENZE ═════════════════════════════
   Un mancato infortunio si segnala **in piedi sul piazzale, con i guanti**, in
   pochi secondi — o non lo segnala nessuno. Da lì la scelta: si TOCCA una
   categoria e un luogo invece di scrivere, e la segnalazione è già completa.

   Le funzioni qui sotto sono quello che rende possibile quella scelta: la
   descrizione si compone da sola, e il riepilogo **dichiara quando i numeri
   sono troppo pochi** per leggerci una tendenza invece di disegnare un grafico
   che suggerisce andamenti inesistenti. */
{
  const OGGI = new Date("2026-07-31T12:00:00");

  test("⛔ near-miss: da due tocchi esce già una frase leggibile", () => {
    /* la segnalazione deve restare leggibile nel registro anche se è costata
       tre tocchi: una riga vuota nel registro degli eventi non serve a nessuno */
    eq(scudo.descrizioneNearMiss({ categoria: "caduta-massi", luogoTipo: "fronte" }),
       "Caduta massi — Fronte", "categoria e luogo");
    eq(scudo.descrizioneNearMiss({ categoria: "caduta-massi" }), "Caduta massi", "o la sola categoria");
    eq(scudo.descrizioneNearMiss({}), "Near-miss segnalato", "e senza niente resta comunque una frase");
  });
  test("near-miss: quello che scrive la persona vince su quello che compone l'app", () => {
    eq(scudo.descrizioneNearMiss({ categoria: "caduta-massi", luogoTipo: "fronte",
      dettaglio: "  masso caduto vicino alla pala  " }), "masso caduto vicino alla pala",
      "le sue parole, ripulite dagli spazi");
  });
  test("near-miss: il luogo scritto a mano vale quanto quello toccato", () => {
    eq(scudo.descrizioneNearMiss({ categoria: "caduta-massi", luogo: "Fronte nord" }),
       "Caduta massi — Fronte nord", "il registro di sempre continua a funzionare");
  });

  const eventi = [
    { id: "e1", tipo: "near-miss", data: "2026-07-20", categoria: "caduta-massi", luogoTipo: "fronte" },
    { id: "e2", tipo: "near-miss", data: "2026-07-25", categoria: "caduta-massi", luogo: "Piazzale ovest" },
    { id: "e3", tipo: "near-miss", data: "2026-01-01", categoria: "mezzi", luogoTipo: "pista" },
    { id: "e4", tipo: "infortunio", data: "2026-07-10", categoria: "mezzi" },
    { id: "e5", tipo: "near-miss", data: "2026-07-28", anonimo: true }];
  const azioni = [{ origineTipo: "evento", origineId: "e1" }, { origineTipo: "evento", origineId: "e1" },
    { origineTipo: "ispezione", origineId: "e2" }];

  test("⛔ near-miss: il riepilogo guarda SOLO i near-miss, non gli infortuni", () => {
    /* sono due registri diversi con due significati diversi: mescolarli
       gonfierebbe un conteggio che la legge chiede separato */
    const r = scudo.riepilogoNearMiss(eventi, azioni, 90, OGGI);
    eq(r.totale, 3, "tre nel periodo");
    eq(r.totaleStorico, 4, "quattro in tutto: l'infortunio resta fuori da entrambi");
  });
  test("near-miss: fuori dal periodo si conta nello storico, non nel periodo", () => {
    eq(scudo.riepilogoNearMiss(eventi, azioni, null, OGGI).totale, 4, "senza finestra ci sono tutti");
  });
  test("⛔ near-miss: una segnalazione senza categoria non sparisce dal conto", () => {
    /* finisce sotto «Non classificato»: toglierla farebbe sembrare che si
       segnali meno di quanto si segnala */
    const r = scudo.riepilogoNearMiss(eventi, azioni, 90, OGGI);
    eq(r.perTipo.some((x) => x.etichetta === "Non classificato"), true, "c'è, e si vede che manca il dato");
    eq(r.perTipo.reduce((s, x) => s + x.valore, 0), r.totale, "e la somma torna col totale");
    eq(r.perLuogo.reduce((s, x) => s + x.valore, 0), r.totale, "anche per luogo");
  });
  test("⛔ near-miss: due azioni sullo stesso evento sono UN evento con azione", () => {
    /* «quante segnalazioni hanno prodotto un'azione» è un conto di eventi, non
       di azioni: contare le azioni farebbe sembrare seguito un registro dove
       una sola segnalazione ne ha generate due */
    const r = scudo.riepilogoNearMiss(eventi, azioni, 90, OGGI);
    eq(r.conAzione, 1, "un evento seguito");
    eq(r.azioni, 2, "da due azioni");
    eq(r.senzaAzione, 2, "e due segnalazioni restate senza");
  });
  test("⛔ near-miss: con pochi numeri lo si DICE, invece di disegnare una tendenza", () => {
    eq(scudo.riepilogoNearMiss(eventi, azioni, 90, OGGI).pochi, true,
       "tre segnalazioni non sono un andamento");
  });
  test("near-miss: le anonime si contano, perché è la garanzia che le fa arrivare", () => {
    eq(scudo.riepilogoNearMiss(eventi, azioni, 90, OGGI).anonime, 1, "una anonima");
  });

  test("⛔ muro: una scadenza già passata non finisce in un mese futuro", () => {
    /* metterla nel mese in cui cadeva la nasconderebbe fra le cose da fare più
       avanti: le scadute hanno un contatore tutto loro */
    const sc = [{ dataScadenza: "2026-06-01" }, { dataScadenza: "2026-08-15" },
      { dataScadenza: "2026-08-20" }, { dataScadenza: "2028-01-01" }, { dataScadenza: "boh" }];
    const m = scudo.muroScadenze(sc, OGGI, 12);
    eq(m.scadute, 1, "quella di giugno è scaduta");
    eq(m.fuori, 1, "quella del 2028 è oltre l'orizzonte, e si dice");
    eq(m.totale, 4, "la data illeggibile non si conta nemmeno");
    eq(m.mesi.find((x) => x.chiave === "2026-08").totale, 2, "e due cadono ad agosto");
  });
  test("muro: i mesi ci sono tutti, anche quelli vuoti", () => {
    /* un mese saltato farebbe sembrare il muro più basso di com'è */
    const m = scudo.muroScadenze([], OGGI, 12);
    eq(m.mesi.length, 12, "dodici mesi");
    eq(m.da, "2026-07", "dal mese in corso");
  });
  test("⛔ periodicità: la data proposta non cade in un giorno che non esiste", () => {
    /* dal 31 gennaio, «fra un mese» non è il 31 febbraio */
    eq(scudo.dataDaPeriodicita(1, new Date("2026-01-31T12:00:00")), "2026-02-28", "l'ultimo giorno che c'è");
    eq(scudo.dataDaPeriodicita(12, OGGI), "2027-07-31", "e a dodici mesi è lo stesso giorno dell'anno dopo");
  });
  test("periodicità: senza un numero di mesi non si propone una data", () => {
    eq(scudo.dataDaPeriodicita(0, OGGI), null, "zero non è una periodicità");
    eq(scudo.dataDaPeriodicita("boh", OGGI), null, "e nemmeno una parola");
  });
}

/* ══ LA CHIUSURA DEL TURNO: LA FIRMA DELLA CONSEGNA ═════════════════════
   Il rapporto di fine turno diventa un **documento** quando porta un nome e
   un'ora: chi consegna, chi riceve, quando. È quello che, in caso di
   contestazione, distingue un appunto da una consegna fatta.

   E una firma vale qualcosa **solo se dopo la firma il documento non cambia
   più**: `turnoChiuso` è la funzione che ogni punto di salvataggio deve
   chiedere prima di scrivere. Con due regole che tirano in direzioni opposte e
   vanno tenute insieme:

   · **chiuso vuol dire chiuso** — nessuno ci scrive più sopra;
   · **i dati vecchi restano modificabili.** Una registrazione senza giorno o
     senza turno — salvata prima che quei campi esistessero — non appartiene a
     nessun turno chiuso. Nessuna azienda si ritrova i propri dati bloccati
     dall'oggi al domani per un aggiornamento del programma. */
{
  const chiusure = [
    { id: "c1", data: "2026-07-30", turno: "Mattina", consegna: "Mario", ricevuta: "Anna", ora: "14:05" },
    { id: "c2", data: "2026-07-31", turno: "Mattina", consegna: "Bruno", ricevuta: "", ora: "" },
    { id: "c3", data: "2026-07-30", turno: "Mattina", consegna: "Mario", ricevuta: "Carla", ora: "14:20",
      riaperture: [{ da: "Mario Bianchi", il: "2026-07-30", ora: "15:10", motivo: "dimenticati i minuti di fermo" }] },
    /* una chiusura VECCHIA, salvata prima che esistessero giorno e turno.
       Senza questa riga la prova qui sotto non proverebbe niente: la guardia
       `if (!d || !t) return null` non avrebbe niente da fermare, e il filtro su
       una data vuota basterebbe da solo. È lo stesso difetto già trovato oggi
       sulla lettura «più recente, non più alta». */
    { id: "c0", data: "", turno: "", consegna: "Vecchio", ricevuta: "Registro", ora: "12:00" }];

  test("⛔ chiusura: un turno con la firma e l'ora è CHIUSO", () => {
    eq(campo.turnoChiuso(chiusure, "2026-07-30", "Mattina").id, "c3", "chiuso, e vale l'ultima registrata");
  });
  test("⛔ chiusura: senza l'ORA il turno non è chiuso", () => {
    /* la riga c'è ma la firma no: è un foglio compilato a metà, e bloccarci
       sopra le scritture fermerebbe il lavoro senza che nessuno abbia firmato */
    eq(campo.turnoChiuso(chiusure, "2026-07-31", "Mattina"), null, "aperto");
  });
  test("⛔ chiusura: i dati vecchi senza giorno o turno restano modificabili", () => {
    /* regola ferrea di compatibilità: nessuna azienda si ritrova i propri dati
       bloccati dall'oggi al domani per un aggiornamento del programma */
    eq(campo.turnoChiuso(chiusure, "", "Mattina"), null, "senza giorno non appartiene a nessun turno chiuso");
    eq(campo.turnoChiuso(chiusure, "2026-07-30", ""), null, "e nemmeno senza turno");
  });
  test("chiusura: fra due chiusure dello stesso turno vale l'ULTIMA", () => {
    eq(campo.chiusuraDi(chiusure, "2026-07-30", "Mattina").ricevuta, "Carla", "la consegna corretta");
  });
  test("⛔ chiusura: il riassunto dice chi consegna, a chi e a che ora", () => {
    eq(campo.riassuntoChiusura(chiusure[2]), "Consegnato da Mario a Carla alle 14:20", "la frase intera");
    eq(campo.riassuntoChiusura({ consegna: "Mario", ora: "14:00" }), "Consegnato da Mario alle 14:00",
       "e con un nome solo non resta una preposizione appesa");
    eq(campo.riassuntoChiusura(chiusure[1]), "", "senza ora non c'è niente da riassumere");
  });

  test("⛔ riapertura: la traccia resta, sempre", () => {
    /* è quello che rende la correzione alla luce del sole invece che di
       nascosto: le riaperture non si cancellano mai */
    eq(campo.riaperture(chiusure[2]).length, 1, "una riapertura");
    eq(campo.riaperture(chiusure[0]).length, 0, "e chi non ne ha non ne inventa");
    eq(campo.riaperture(null).length, 0, "nemmeno senza chiusura");
  });
  test("riapertura: la riga dice chi, quando e perché", () => {
    eq(campo.riassuntoRiapertura(chiusure[2].riaperture[0], (d) => d.split("-").reverse().join("/")),
       "Riaperto da Mario Bianchi il 30/07/2026 alle 15:10 — dimenticati i minuti di fermo",
       "tutto quello che serve a capire la correzione");
    eq(campo.riassuntoRiapertura({ da: "Anna", ora: "09:00" }), "Riaperto da Anna alle 09:00",
       "e senza motivo non resta un trattino sospeso");
  });
  test("riapertura: l'ultima è quella che conta per lo stato attuale", () => {
    eq(campo.ultimaRiapertura(chiusure[2]).ora, "15:10", "la più recente");
    eq(campo.ultimaRiapertura(chiusure[0]), null, "e senza riaperture è null, non un oggetto vuoto");
  });

  test("⛔ turno: quello suggerito segue l'ora, e la notte attraversa la mezzanotte", () => {
    /* chi registra non deve sceglierlo ogni volta: 6-14 mattina, 14-22
       pomeriggio, il resto notte — e alle 3 si è ancora nel turno di notte */
    eq(campo.turnoCorrente(new Date(2026, 6, 31, 6, 0)), "Mattina", "le sei");
    eq(campo.turnoCorrente(new Date(2026, 6, 31, 13, 59)), "Mattina", "fino alle due meno un minuto");
    eq(campo.turnoCorrente(new Date(2026, 6, 31, 14, 0)), "Pomeriggio", "le quattordici");
    eq(campo.turnoCorrente(new Date(2026, 6, 31, 22, 0)), "Notte", "le ventidue");
    eq(campo.turnoCorrente(new Date(2026, 6, 31, 3, 0)), "Notte", "e le tre di mattina sono ancora notte");
  });
  test("turno: i tre turni sono quelli che usa il rapportino", () => {
    eq(campo.TURNI.join(","), "Mattina,Pomeriggio,Notte", "e nient'altro");
  });
}

/* ══ L'INIZIO DEL TURNO: LA CHECKLIST E L'APPELLO ═══════════════════════
   Due cose si fanno prima di cominciare: si controlla che il posto sia sicuro,
   e si guarda **chi c'è**.

   ⛔ La regola più affilata di tutta l'app sta nell'appello, ed è scritta nel
   modulo: **«non lo so» è una risposta diversa da «non c'è».** Chi non è ancora
   stato spuntato non viene contato né presente né assente — perché se suona
   l'allarme e si va al punto di raccolta, l'appello si fa su questa lista, e
   contare per assente qualcuno che nessuno ha guardato vuol dire non andarlo a
   cercare. */
{
  const OGGI = "2026-07-31";
  const operatori = [
    { id: "o1", nome: "Anna", squadra: "Squadra A — Perforazione", stato: "in-forza" },
    { id: "o2", nome: "Bruno", squadra: "Squadra A", stato: "in-forza" },
    { id: "o3", nome: "Carla", squadra: "Squadra A", stato: "non-disponibile" },
    { id: "o4", nome: "Dario", squadra: "Squadra B", stato: "in-forza" }];
  const presenze = [{ data: OGGI, turno: "Mattina", operatoreId: "o1", stato: "presente", ora: "06:05" }];

  test("⛔ appello: chi non è stato spuntato NON è un assente", () => {
    /* su un appello di emergenza la differenza è tutto: contare per assente
       qualcuno che nessuno ha guardato vuol dire non andarlo a cercare */
    const a = campo.appelloTurno(operatori, presenze, OGGI, "Mattina", "Squadra A");
    eq(a.presenti, 1, "una presente");
    eq(a.assenti, 0, "nessun assente");
    eq(a.daFare, 1, "e uno ancora da guardare");
    eq(a.completo, false, "quindi l'appello non è finito");
  });
  test("⛔ appello: chi non è disponibile non entra nella lista da spuntare", () => {
    /* è in anagrafica ma oggi non è al lavoro: chiederne la presenza
       allungherebbe la lista con una domanda che non ha risposta */
    const a = campo.appelloTurno(operatori, presenze, OGGI, "Mattina", "Squadra A");
    eq(a.righe.some((r) => r.operatore.id === "o3"), false, "Carla non c'è nell'elenco");
    eq(a.totale, 2, "restano due persone da spuntare");
  });
  test("appello: la squadra si riconosce anche col nome esteso", () => {
    /* «Squadra A — Perforazione» e «Squadra A» sono la stessa squadra: chi
       scrive il nome per esteso non deve sparire dall'appello */
    const a = campo.appelloTurno(operatori, presenze, OGGI, "Mattina", "Squadra A");
    eq(a.righe.some((r) => r.operatore.nome === "Anna"), true, "Anna c'è");
  });
  test("appello: senza squadra si guarda tutta la cava", () => {
    eq(campo.appelloTurno(operatori, presenze, OGGI, "Mattina", "").totale, 3,
       "tutti quelli in forza, di ogni squadra");
  });
  test("appello: fra due spunte della stessa persona vale l'ULTIMA", () => {
    const due = [{ data: OGGI, turno: "Mattina", operatoreId: "o1", stato: "presente", ora: "06:05" },
      { data: OGGI, turno: "Mattina", operatoreId: "o1", stato: "assente", ora: "06:40" }];
    eq(campo.presenzaDi(due, OGGI, "Mattina", "o1").stato, "assente", "la correzione conta");
  });
  test("appello: un appello vuoto non è un appello completo", () => {
    eq(campo.appelloTurno([], [], OGGI, "Mattina", "").completo, false,
       "zero persone spuntate su zero non è «fatto»");
  });

  test("⛔ checklist: quello che non è stato spuntato NON risulta a posto", () => {
    /* stessa regola delle ispezioni di Scudo: un controllo mai finito non deve
       sembrare un controllo superato */
    const st = campo.statoChecklist({ 0: "ok", 1: "no" });
    eq(st.ok, 1, "una a posto");
    eq(st.no, 1, "una no");
    eq(st.mancanti, campo.CHECKLIST_INIZIO.length - 2, "e tutte le altre mancano");
    eq(st.completa, false, "quindi non è completa");
  });
  test("⛔ checklist: le voci NON a posto escono con il loro testo", () => {
    /* è quello che il preposto legge e su cui decide se si comincia: un numero
       non dice che cosa non va */
    const st = campo.statoChecklist({ 1: "no" });
    eq(st.problemi.length, 1, "un problema");
    eq(st.problemi[0], campo.CHECKLIST_INIZIO[1].testo, "col testo della voce, non l'indice");
  });
  test("checklist: «non applicabile» è una risposta data, e chiude il controllo", () => {
    const esiti = {};
    campo.CHECKLIST_INIZIO.forEach((_, i) => { esiti[i] = "na"; });
    const st = campo.statoChecklist(esiti);
    eq(st.completa, true, "il controllo è finito");
    eq(st.problemi.length, 0, "e non c'è niente da segnalare");
    eq(st.pct, 100, "cento per cento");
  });
  test("checklist: gli esiti si leggono sia con la chiave testo sia con quella numero", () => {
    /* come sono salvati nel database, senza costringere la pagina a
       normalizzare prima di chiedere */
    eq(campo.statoChecklist({ "0": "ok" }).ok, 1, "chiave testo");
    eq(campo.statoChecklist({ 0: "ok" }).ok, 1, "chiave numero");
  });

  test("⛔ giorno: una registrazione SENZA data appartiene a tutti i giorni", () => {
    /* i dati salvati prima che la data esistesse non devono sparire dagli
       elenchi: è la stessa compatibilità del turno chiuso */
    eq(campo.eDelGiorno({ titolo: "vecchia" }, OGGI), true, "una riga senza data si vede");
    eq(campo.eDelGiorno({ data: "2026-07-30" }, OGGI), false, "una di ieri no");
    eq(campo.diGiorno([{ data: OGGI }, { data: "2026-07-30" }, {}], OGGI).length, 2, "oggi e la senza data");
  });
  test("giorno: quante righe sono ancora senza data si dice, invece di nasconderle", () => {
    eq(campo.senzaData([{ data: OGGI }, {}, { data: "  " }]), 2, "due da sistemare");
  });
}

/* ══ IL BADGE DEL TAGLIANDO A ORE: L'ULTIMO ZERO DI COMODO ══════════════
   `tagliandiInScadenza` lo aveva già capito, e l'aveva scritto nel commento:
   *«zero ore» e «non lo so» sono due cose diverse: con `|| 0` un mezzo senza
   contatore diventava un mezzo nuovo di fabbrica, e il tagliando sembrava
   lontano.* Là il mezzo senza contatore finisce fra quelli **da stimare**, con
   il perché.

   Ma il **badge della lista Manutenzioni** passava ancora da `urgenzaOre` con
   le ore convertite a zero: su un mezzo di cui non sappiamo il contatore
   mostrava **«tra 500 h» in verde** — un colore tranquillo dove non è stato
   misurato niente. È il principio scritto in `CLAUDE.md`, e il terzo `+null`
   della giornata. */
{
  test("⛔ tagliando a ore: senza contatore NON si dice che manca tanto", () => {
    for (const ignoto of [null, undefined, ""]) {
      const u = flotta.urgenzaOre(500, ignoto);
      eq(u.mancano, null, "non si sa quanto manca");
      eq(u.oreNote, false, "e si sa di non saperlo");
      eq(u.cls, "", "niente verde rassicurante");
    }
  });
  test("⛔ tagliando a ore: il badge dice comunque a quante ore è previsto", () => {
    /* la stessa frase che la pagina usa quando il mezzo non è nel parco: chi
       guarda deve capire che il tagliando c'è, non che è lontano */
    eq(flotta.urgenzaOre(500, null).label, "a 500 h", "il dato che abbiamo, e nient'altro");
  });
  test("tagliando a ore: con il contatore noto il conto è quello di sempre", () => {
    eq(flotta.urgenzaOre(6000, 5990).cls, "warn", "dieci ore: preavviso");
    eq(flotta.urgenzaOre(6000, 5990).mancano, 10, "e quante ne mancano");
    eq(flotta.urgenzaOre(6000, 6040).cls, "danger", "già passate: scaduta");
    eq(flotta.urgenzaOre(6000, 5000).cls, "ok", "mille ore: lontano davvero");
  });
  test("tagliando a ore: un contatore di ZERO è un dato, non un'assenza", () => {
    /* una macchina nuova ha davvero zero ore: la differenza fra «zero» e «non
       lo so» va tenuta in tutte e due le direzioni */
    const u = flotta.urgenzaOre(500, 0);
    eq(u.oreNote, true, "lo zero è una lettura");
    eq(u.mancano, 500, "e il conto si fa");
  });
}

/* ══ TERRA: LO SCAVO CONSUMA IL CONCESSO, LA RIPRESA NO ═════════════════
   È la distinzione che regge tutta l'app, e sta anche nei moduli degli enti:
   il materiale **tolto dal fronte** consuma il volume autorizzato; quello
   **ripreso da un cumulo** era già stato estratto e si conta a parte. Contarli
   insieme farebbe risultare esaurita una concessione che non lo è — o, peggio,
   nasconderebbe un esaurimento vero sotto un numero gonfiato dai cumuli. */
{
  const OGGI = new Date("2026-07-31T12:00:00");
  const R = (o) => ({ id: "r1", data: "2026-07-01", stato: "elaborato", volumeM3: 10000, fronteId: "f1", ...o });
  const rilievi = [
    R({ id: "a", data: "2026-05-01", volumeM3: 5000 }),
    R({ id: "b", data: "2026-06-01", volumeM3: 8000 }),
    R({ id: "c", data: "2026-07-01", volumeM3: 12000 }),
    R({ id: "d", data: "2026-07-15", volumeM3: 50000, provenienza: "cumulo" }),
    R({ id: "e", data: "2026-07-20", volumeM3: 3000, fronteId: "f2" }),
    R({ id: "f", data: "2026-07-25", volumeM3: 1000, stato: "da-elaborare" })];

  test("⛔ provenienza: la ripresa dai cumuli si separa dallo scavo", () => {
    eq(terra.soloCumulo(rilievi).map((r) => r.id).join(","), "d", "solo quello dal cumulo");
    eq(terra.soloScavo(rilievi).some((r) => r.id === "d"), false, "e lo scavo non lo comprende");
  });
  test("provenienza: senza il campo, un rilievo è SCAVO", () => {
    /* è il valore che consuma il concesso: dare per «cumulo» quello che non è
       dichiarato farebbe sparire volume vero dal conto della concessione */
    eq(terra.etichettaProvenienza(""), "Scavo dal fronte", "il valore di partenza");
    eq(terra.etichettaProvenienza("boh"), "Scavo dal fronte", "e anche una parola sconosciuta");
    eq(terra.etichettaProvenienza("cumulo"), "Ripresa da un cumulo", "il cumulo va dichiarato");
  });
  test("⛔ ritmo: il grafico mensile conta lo SCAVO, non i cumuli ripresi", () => {
    /* i 50.000 m³ ripresi dal cumulo a luglio raddoppierebbero la barra e
       farebbero sembrare che si stia scavando il triplo */
    const m = terra.volumiPerMese(rilievi, 12, OGGI);
    eq(m.find((x) => x.ym === "2026-07").volume, 15000, "luglio: 12.000 dal fronte f1 più 3.000 da f2");
    eq(m.map((x) => x.ym).join(","), "2026-05,2026-06,2026-07", "e si parte dal primo mese con dati");
  });
  test("ritmo: i mesi vuoti in mezzo restano, quelli davanti no", () => {
    /* un mese a zero in mezzo è un'informazione (non si è scavato); dodici mesi
       vuoti prima del primo rilievo sono solo un grafico che comincia lontano */
    const soloLuglio = terra.volumiPerMese([R({ id: "z", data: "2026-07-10", volumeM3: 100 })], 12, OGGI);
    eq(soloLuglio.length, 1, "un mese solo");
  });

  test("⛔ confronto: fra due rilievi si somma quello scavato IN MEZZO", () => {
    /* la differenza fra i due volumi non è quanto si è scavato: è quanto è
       cambiato il volume del fronte. Lo scavato è la somma dei rilievi
       intermedi, ed è quello che consuma la concessione */
    const c = terra.confrontoRilievi(rilievi, "a", "c");
    eq(c.giorni, 61, "due mesi fra i due voli");
    eq(c.scavato, 20000, "8.000 di giugno più 12.000 di luglio");
    eq(c.rilieviInMezzo, 2, "due rilievi in mezzo");
    eq(c.delta, 7000, "e la differenza fra i due volumi è un'altra cosa");
  });
  test("confronto: l'ordine in cui si scelgono i due rilievi non conta", () => {
    eq(terra.confrontoRilievi(rilievi, "c", "a").giorni, 61, "si mette in ordine da solo");
  });
  test("⛔ confronto: due fronti diversi non si confrontano", () => {
    /* sarebbe una differenza fra due posti diversi della cava: un numero che
       non significa niente e che sembra un avanzamento */
    eq(terra.confrontoRilievi(rilievi, "a", "e"), null, "fronti diversi");
    eq(terra.confrontoRilievi(rilievi, "a", "a"), null, "e lo stesso rilievo con sé stesso");
    eq(terra.confrontoRilievi(rilievi, "a", "f"), null, "né uno ancora da elaborare");
  });

  test("⛔ scadenze: «senza data» non è «a posto» per caso, ed è dichiarato", () => {
    const l = terra.livelloScadenzaTerra("", 30, OGGI);
    eq(l.label, "senza data", "lo dice");
    eq(l.giorni, null, "e non inventa un conto alla rovescia");
  });
  test("scadenze: il preavviso lo decide l'utente, e il confine è preciso", () => {
    /* periodicità e termini cambiano da regione a regione: Terra non li
       indovina, li applica */
    eq(terra.statoScadenzaTerra("2026-08-15", 30, OGGI), "in-scadenza", "quindici giorni, preavviso trenta");
    eq(terra.statoScadenzaTerra("2026-08-15", 0, OGGI), "a-posto", "col preavviso a zero è ancora lontana");
    eq(terra.statoScadenzaTerra("2026-07-31", 0, OGGI), "in-scadenza", "ma il giorno stesso sì");
    eq(terra.statoScadenzaTerra("2026-07-30", 30, OGGI), "scaduta", "e ieri è scaduta");
  });
  test("scadenze: la frase dice da quanto è scaduta o quanto manca", () => {
    eq(terra.livelloScadenzaTerra("2026-07-01", 30, OGGI).label, "scaduta da 30 gg", "da quanto");
    eq(terra.livelloScadenzaTerra("2026-08-15", 30, OGGI).label, "tra 15 gg", "quanto manca");
    eq(terra.livelloScadenzaTerra("2026-07-31", 30, OGGI).label, "scade oggi", "e oggi si dice oggi");
  });
  test("scadenze: il riepilogo conta ogni scadenza una volta sola", () => {
    const sc = [{ dataScadenza: "2026-07-01", preavvisoGiorni: 30 }, { dataScadenza: "2026-08-15", preavvisoGiorni: 30 },
      { dataScadenza: "2027-01-01", preavvisoGiorni: 30 }, { dataScadenza: "", preavvisoGiorni: 30 }];
    const r = terra.riepilogoScadenze(sc, OGGI);
    eq(r.scadute + r.inScadenza + r.aPosto, r.totale, "la somma torna");
    eq(r.totale, 4, "e nessuna cade fuori, nemmeno quella senza data");
  });
  test("⛔ scadenze: i tipi preimpostati dichiarano di essere da verificare", () => {
    /* periodicità e termini stanno nell'atto e nella legge regionale: un
       preset che si desse per certo sarebbe una consulenza sbagliata */
    eq(terra.presetScadenzaTerra("autorizzazione").daVerificare, true, "sempre da verificare");
    eq(terra.presetScadenzaTerra("boh"), null, "e un tipo inventato non esiste");
  });
  test("scadenze: la ricorrenza non propone un giorno che non esiste", () => {
    eq(terra.prossimaData("2026-01-31", 1), "2026-02-28", "dal 31 gennaio, fra un mese");
    eq(terra.prossimaData("2026-07-31", 12), "2027-07-31", "e a dodici mesi lo stesso giorno");
    eq(terra.prossimaData("boh", 1), null, "senza una data vera non si propone niente");
    eq(terra.prossimaData("2026-01-31", 0), null, "e senza ricorrenza nemmeno");
  });
}

/* ══ LE SCADENZE DI LEGGE DEI MEZZI ═════════════════════════════════════
   Revisione alla Motorizzazione, verifica periodica dell'attrezzatura, funi e
   catene, assicurazione. Un mezzo che gira in cava con la verifica scaduta è
   la stessa famiglia del lavoratore senza il corso: un obbligo non rispettato
   che l'app deve far vedere prima che lo veda un ispettore.

   ⛔ E qui il principio di `CLAUDE.md` — **l'assenza di un dato non è un dato
   favorevole** — è già applicato bene, ed è quello che queste prove tengono:
   una scadenza **senza data** è **gialla**, non verde, e nel conteggio sta
   insieme a quelle in scadenza. «Non so quando scade la revisione» è un
   problema, non una tranquillità. */
{
  const OGGI = new Date("2026-07-31T12:00:00");

  test("⛔ scadenze mezzi: «senza data» è GIALLA, non verde", () => {
    /* è la stessa idea di «senza dati» ≠ «conforme»: non sapere quando scade
       la revisione di un mezzo che gira è un problema aperto */
    for (const vuota of ["", null, undefined]) {
      const st = flotta.statoScadenzaMezzo(vuota, OGGI);
      eq(st.stato, "senza-data", "lo dichiara");
      eq(st.cls, "warn", "e resta gialla");
      eq(st.giorni, null, "senza inventare un conto alla rovescia");
    }
  });
  test("⛔ scadenze mezzi: «senza data» si conta con le cose da fare, non con quelle a posto", () => {
    const c = flotta.contaScadenzeMezzi([{ mezzo: "CAT 320", dataScadenza: "" }], OGGI);
    eq(c.inScadenza, 1, "sta fra quelle da sistemare");
    eq(c.aPosto, 0, "e non fra quelle a posto");
  });
  test("scadenze mezzi: il semaforo segue la data, e il giorno stesso è rosso", () => {
    /* una revisione che scade oggi non è «fra poco»: o si fa oggi o domani il
       mezzo non può circolare */
    eq(flotta.statoScadenzaMezzo("2026-07-01", OGGI).label, "scaduta da 30 gg", "da quanto");
    eq(flotta.statoScadenzaMezzo("2026-07-31", OGGI).cls, "danger", "oggi è rosso, non giallo");
    eq(flotta.statoScadenzaMezzo("2026-08-15", OGGI).cls, "warn", "quindici giorni: preavviso");
    eq(flotta.statoScadenzaMezzo("2027-01-01", OGGI).cls, "ok", "cinque mesi: lontana");
  });
  test("scadenze mezzi: il preavviso lo decide l'utente", () => {
    eq(flotta.statoScadenzaMezzo("2026-08-15", OGGI, 0).stato, "a-posto", "col preavviso a zero");
    eq(flotta.statoScadenzaMezzo("2026-08-15", OGGI, 30).stato, "in-scadenza", "e con trenta giorni no");
  });

  const scadenze = [
    { id: "s1", mezzo: "CAT 320", tipo: "Revisione", dataScadenza: "2026-08-15" },
    { id: "s2", mezzo: "Aaa", tipo: "Assicurazione", dataScadenza: "2026-07-01" },
    { id: "s3", mezzo: "Zeta", tipo: "Verifica", dataScadenza: "" },
    { id: "s4", mezzo: "CAT 320", tipo: "Funi", dataScadenza: "2027-06-01" }];

  test("⛔ scadenze mezzi: in cima quelle senza data e le scadute, non l'alfabeto", () => {
    /* la prima riga che si guarda deve essere quella che ferma un mezzo: una
       senza data viene prima di tutto perché non si sa nemmeno quanto tempo c'è */
    eq(flotta.scadenzeOrdinate(scadenze, OGGI).map((x) => x.id).join(","), "s3,s2,s1,s4",
       "senza data, scaduta, in scadenza, a posto");
  });
  test("scadenze mezzi: il conteggio torna, e dice quanti MEZZI sono coinvolti", () => {
    const c = flotta.contaScadenzeMezzi(scadenze, OGGI);
    eq(c.scadute + c.inScadenza + c.aPosto, c.totale, "nessuna cade fuori");
    eq(c.mezzi, 3, "tre mezzi, anche se le scadenze sono quattro");
  });

  test("⛔ scadenze mezzi: un anno digitato male si ferma prima di salvare", () => {
    /* è l'errore più frequente su un campo data, e una revisione datata 2010
       farebbe risultare il mezzo fermo da anni */
    eq(flotta.validaScadenzaMezzo({ mezzo: "x", tipo: "y", dataScadenza: "2010-01-01" }, OGGI).errori.dataScadenza
       .includes("controlla l'anno"), true, "dieci anni indietro");
    eq(flotta.validaScadenzaMezzo({ mezzo: "x", tipo: "y", dataScadenza: "2060-01-01" }, OGGI).errori.dataScadenza
       .includes("controlla l'anno"), true, "e quindici avanti");
  });
  test("scadenze mezzi: quello che manca si dice campo per campo", () => {
    const e = flotta.validaScadenzaMezzo({}, OGGI).errori;
    eq(Object.keys(e).join(","), "mezzo,tipo,dataScadenza", "tre campi, tre messaggi");
    eq(e.mezzo.startsWith("Scegli"), true, "e ognuno dice che cosa fare");
  });
  test("scadenze mezzi: una scadenza buona passa", () => {
    eq(flotta.validaScadenzaMezzo({ mezzo: "x", tipo: "y", dataScadenza: "2026-12-01" }, OGGI).ok, true, "ok");
  });

  test("⛔ ricorrenza: la prossima scadenza non cade in un giorno che non esiste", () => {
    eq(flotta.aggiungiMesi("2026-01-31", 1), "2026-02-28", "dal 31 gennaio, fra un mese");
    eq(flotta.aggiungiMesi("2026-07-31", 12), "2027-07-31", "e a dodici mesi lo stesso giorno");
    eq(flotta.aggiungiMesi("boh", 1), null, "senza una data vera non si propone niente");
    eq(flotta.aggiungiMesi("2026-01-31", 0), null, "e senza periodicità nemmeno");
  });
  test("ricorrenza: i preset portano la norma che li giustifica", () => {
    /* «ogni 12 mesi» detto senza dire perché è una regola che nessuno può
       controllare: qui accanto c'è l'articolo */
    eq(flotta.SCADENZE_MEZZO_PRESET.every((p) => p.etichetta && p.norma !== undefined), true,
       "ognuno ha etichetta e riferimento");
    eq(flotta.presetScadenzaMezzo("revisione").mesi, 60, "la revisione è ogni cinque anni");
    eq(flotta.presetScadenzaMezzo("funi-catene").mesi, 3, "funi e catene ogni tre mesi");
    eq(flotta.presetScadenzaMezzo("boh"), null, "e un tipo inventato non esiste");
  });
}

/* ══ CONTI: LA FATTURA E IL SUO CLIENTE ═════════════════════════════════
   È il punto in cui i soldi trovano un nome. Una fattura attaccata al cliente
   sbagliato è un sollecito mandato a chi ha già pagato — e un'esposizione che
   sembra sotto controllo mentre è concentrata su uno solo.

   Il problema vero non è tecnico, è di **dati veri**: le fatture vecchie hanno
   solo il testo libero, e la stessa azienda è scritta in cinque modi («Cave
   S.r.l.», «CAVE SRL», «Cave  Srl»). Se ogni variante diventa una riga, il
   credito guarda cinque clienti piccoli invece di uno grosso. */
{
  const clienti = [{ id: "c1", ragioneSociale: "Cave del Nord S.r.l.", fido: 10000 },
    { id: "c2", ragioneSociale: "Edil Rossi" }];

  test("⛔ cliente: le varianti di scrittura sono lo stesso nome", () => {
    /* accenti, punteggiatura, maiuscole e spazi doppi: quello che cambia fra
       due modi di scrivere la stessa azienda, e non fra due aziende */
    eq(conti.chiaveNome("Cave S.r.l."), conti.chiaveNome("CAVE SRL"), "punteggiatura e maiuscole");
    eq(conti.chiaveNome("  Società   Anonima  "), conti.chiaveNome("Societa Anonima"), "accenti e spazi doppi");
    eq(conti.chiaveNome(""), "", "e il vuoto resta vuoto");
  });
  test("⛔ cliente: una fattura vecchia col solo testo si riconosce dal nome", () => {
    /* è quello che rende possibile la migrazione senza toccare le fatture
       già emesse */
    eq(conti.clienteDiFattura({ cliente: "CAVE DEL NORD SRL" }, clienti).id, "c1", "riconosciuto");
    eq(conti.clienteDiFattura({ cliente: "Tizio" }, clienti), null, "e chi non c'è resta senza");
  });
  test("⛔ cliente: un collegamento ROTTO non viene sostituito da un nome simile", () => {
    /* la fattura punta a un cliente cancellato: ripiegare sul nome la
       attaccherebbe a un'anagrafica che nessuno ha scelto, e i soldi
       finirebbero sul conto di un altro */
    eq(conti.clienteDiFattura({ clienteId: "cancellato", cliente: "Edil Rossi" }, clienti), null,
       "meglio nessun cliente che quello sbagliato");
  });
  test("cliente: il nome mostrato è quello dell'anagrafica quando c'è", () => {
    /* così correggere la ragione sociale in un posto la corregge ovunque */
    eq(conti.nomeCliente({ cliente: "cave del nord srl" }, clienti), "Cave del Nord S.r.l.", "dall'anagrafica");
    eq(conti.nomeCliente({ cliente: "Tizio" }, clienti), "Tizio", "altrimenti il testo salvato");
    eq(conti.nomeCliente({}, clienti), "—", "e senza niente un trattino, non una riga vuota");
  });
  test("⛔ cliente: le fatture si raggruppano per anagrafica, non per come è scritto il nome", () => {
    eq(conti.chiaveCliente({ cliente: "CAVE DEL NORD SRL" }, clienti), "id:c1", "quello collegato");
    eq(conti.chiaveCliente({ cliente: "Cave del Nord S.r.l." }, clienti),
       conti.chiaveCliente({ cliente: "CAVE DEL NORD SRL" }, clienti), "due scritture, una riga sola");
    eq(conti.chiaveCliente({ cliente: "Tizio" }, clienti), "nome:tizio", "e chi non è in anagrafica sta sul nome normalizzato");
  });

  const fatture = [{ id: "f1", cliente: "Tizio S.p.A.", importo: 1000 },
    { id: "f2", cliente: "TIZIO SPA", importo: 500 }, { id: "f3", cliente: "Edil Rossi", importo: 200 },
    { id: "f4", cliente: "", importo: 99 }, { id: "f5", cliente: "Caio", importo: 300 }];

  test("⛔ migrazione: l'elenco da collegare unisce le varianti e porta gli id", () => {
    /* è la lista di lavoro: «questi nomi vanno collegati». Le due scritture di
       Tizio sono una voce sola, e porta gli id di tutte e due le fatture così
       si collegano in un colpo */
    const l = conti.clientiDaCollegare(fatture, clienti);
    eq(l.length, 2, "Tizio e Caio: Edil Rossi è già in anagrafica");
    eq(l[0].conto, 2, "Tizio ha due fatture");
    eq(l[0].importo, 1500, "per millecinquecento euro");
    eq(l[0].ids.join(","), "f1,f2", "e si collegano insieme");
  });
  test("migrazione: prima chi ha più fatture, e una fattura senza nome non entra", () => {
    const l = conti.clientiDaCollegare(fatture, clienti);
    eq(l[0].nome, "Tizio S.p.A.", "il più grosso in cima");
    eq(l.some((x) => x.ids.includes("f4")), false, "e su una fattura senza nome non c'è niente da collegare");
  });

  test("⛔ prezzo: senza la densità non si inventa una conversione", () => {
    /* il listino è in €/m³ e la pesa dà tonnellate: senza il peso di volume
       quel prezzo non si può portare a tonnellata, e tirare a indovinare
       vorrebbe dire fatturare un numero inventato */
    eq(conti.prezzoPerTonnellata({ prezzo: 30, unitaPrezzo: "m3" }), null, "manca la densità");
    eq(conti.prezzoPerTonnellata({ prezzo: 30, unitaPrezzo: "m3", densita: 1.6 }), 18.75, "con la densità si converte");
    eq(conti.prezzoPerTonnellata({ prezzo: 12.5, unitaPrezzo: "t" }), 12.5, "e se è già in tonnellate resta");
  });
  test("prezzo: una densità di zero o negativa non è una densità", () => {
    for (const d of [0, -1, "boh", null]) eq(conti.densitaValida({ densita: d }), null, "scartata");
    eq(conti.densitaValida({ densita: 1.6 }), 1.6, "e quella buona passa");
  });

  test("⛔ mora: gli interessi si contano solo su un ritardo vero", () => {
    /* su una fattura non ancora scaduta il conto è zero: chiedere interessi
       prima della scadenza è la cosa che fa perdere un cliente */
    eq(conti.interessiMora(10000, 0, 12).interessi, 0, "nessun ritardo");
    /* ⚠️ il caso che la guardia difende davvero è il ritardo NEGATIVO: con
       zero giorni l'aritmetica dà già zero da sola, e la prova non provava
       niente. Con -10 giorni, senza guardia, gli interessi diventerebbero
       NEGATIVI — cioè l'app farebbe uno sconto per aver pagato in anticipo,
       che è l'opposto di quello che significa la mora */
    eq(conti.interessiMora(10000, -10, 12).interessi, 0, "e su una fattura ancora da scadere nemmeno");
    eq(conti.interessiMora(10000, -10, 12).giorni, 0, "i giorni di ritardo non vanno sottozero");
    eq(conti.interessiMora(0, 90, 12).interessi, 0, "e su zero euro nemmeno");
    eq(conti.interessiMora(10000, 90, 12).interessi, 295.89, "novanta giorni al 12%");
  });
  test("mora: il sollecito sale per fasce, e prima della scadenza non esiste", () => {
    eq(conti.livelloSollecito(0).livello, 0, "non scaduta: nessun sollecito");
    eq(conti.livelloSollecito(1).livello, 1, "il giorno dopo, il primo");
    eq(conti.livelloSollecito(16).livello, 2, "dopo due settimane, il secondo");
    eq(conti.livelloSollecito(46).livello, 3, "e dopo un mese e mezzo, l'ultimo avviso");
    eq(conti.livelloSollecito(46).cls, "danger", "che è rosso");
  });
  test("mora: le spese di recupero sono quelle di legge", () => {
    eq(conti.SPESE_RECUPERO_231, 40, "quaranta euro forfettari, art. 6 D.Lgs 231/2002");
  });
}

// ── Campo: chi fa cosa, obiettivo di turno, fermi ─────────────────────
/* Il censimento della copertura dava Campo come la meno difesa delle sei
   (39 funzioni su 73). Queste sono le funzioni che rispondono alle tre
   domande che un preposto fa a inizio e a fine turno: «di chi è questa
   attività», «quanto manca all'obiettivo», «quanto ci siamo fermati».
   Le regole bloccate qui sono TUTTE dichiarate nei commenti del modulo:
   il test serve a impedire che una riscrittura le contraddica in silenzio. */
{
  console.log("\n— Campo: assegnazione, obiettivo di turno, fermi —");

  const SQU_A = "Squadra A — Perforazione", SQU_B = "Squadra B — Carico";
  const ATT = [
    { data: "2026-07-31", turno: "Mattino", squadra: SQU_A, operatore: "Mario Rossi", stato: "conclusa" },
    { data: "2026-07-31", turno: "Mattino", squadra: SQU_A, operatore: "", stato: "in-corso" },
    { data: "2026-07-31", turno: "Mattino", squadra: SQU_A, operatore: "Luca Bianchi", stato: "anomalia", fermoMin: 45 },
    { data: "2026-07-31", turno: "Mattino", squadra: SQU_B, operatore: "Anna Neri", stato: "in-corso" },
    { data: "2026-07-31", turno: "Mattino", squadra: "", operatore: "", stato: "in-corso" },
  ];
  const SQUADRE = [{ nome: SQU_A }, { nome: SQU_B }, { nome: "Squadra C — Impianto" }];

  test("eMia: il mio nome vince sulla squadra (se me l'hanno data, tocca a me)", () => {
    ok(campo.eMia({ squadra: "Squadra Z", operatore: "Mario Rossi" },
      { squadra: "Squadra A", operatore: "Mario Rossi" }),
      "un'attività col mio nome è mia anche se è di un'altra squadra");
  });
  test("eMia: della mia squadra senza nome è mia, con il nome di un altro no", () => {
    ok(campo.eMia({ squadra: SQU_A, operatore: "" }, { squadra: "Squadra A", operatore: "Mario Rossi" }),
      "senza nome tocca a chiunque della squadra");
    ok(!campo.eMia({ squadra: "Squadra A", operatore: "Luca" }, { squadra: "Squadra A", operatore: "Mario Rossi" }),
      "col nome di un altro non è mia");
  });
  test("eMia: chi dichiara solo la squadra vede il lavoro di TUTTA la squadra", () => {
    /* è il caposquadra: se filtrasse anche a lui per nome non vedrebbe niente */
    ok(campo.eMia({ squadra: "Squadra A", operatore: "Luca" }, { squadra: "Squadra A" }),
      "senza il mio nome guardo tutta la squadra");
  });
  test("eMia: se non ho detto qual è la mia squadra non è mia niente", () => {
    ok(!campo.eMia({ squadra: "Squadra A", operatore: "" }, { operatore: "Mario Rossi" }),
      "nessuna squadra dichiarata: nessuna attività mia");
    ok(!campo.eMia(null, { squadra: "Squadra A" }), "attività assente");
    ok(!campo.eMia({ squadra: "Squadra A" }, null), "io assente");
  });

  test("caricoSquadre: le attività senza squadra sono contate A PARTE", () => {
    /* il commento del modulo: «sono il vero problema: non le fa nessuno».
       Se finissero in una squadra qualsiasi sparirebbero dal conto. */
    const c = campo.caricoSquadre(ATT, SQUADRE);
    eq(c.nonAssegnate, 1, "una attività senza squadra");
    eq(c.righe.reduce((n, r) => n + r.aperte + r.concluse, 0), 4,
      "e non entra nel carico di nessuna squadra");
  });
  test("caricoSquadre: un'anomalia è ancora aperta (non è una conclusa)", () => {
    const a = campo.caricoSquadre(ATT, SQUADRE).righe.find(r => r.squadra === "Squadra A");
    contiene(a, { squadra: "Squadra A", nome: SQU_A, aperte: 2, concluse: 1, anomalie: 1 },
      "l'anomalia conta fra le aperte e in più come anomalia");
  });
  test("caricoSquadre: una squadra senza attività resta in elenco a zero", () => {
    /* farla sparire direbbe «non esiste»; a zero dice «non ha niente in mano» */
    const c = campo.caricoSquadre(ATT, SQUADRE);
    contiene(c.righe.find(r => r.squadra === "Squadra C") || {},
      { aperte: 0, concluse: 0 }, "la squadra ferma si vede");
    eq(c.righe.length, 3, "tutte e tre le squadre in elenco");
    eq(c.righe.map(r => r.squadra), ["Squadra A", "Squadra B", "Squadra C"],
      "ordinate per aperte in giù, poi per nome");
  });
  test("caricoSquadre: senza dati non inventa righe", () =>
    eq(campo.caricoSquadre([], []), { righe: [], nonAssegnate: 0 }, "vuoto"));

  const OBIETTIVI = [
    { data: "2026-07-31", turno: "Mattino", unita: "t", valore: 100 },
    { data: "2026-07-31", turno: "Mattino", unita: "t", valore: 120 },
    { data: "2026-07-31", turno: "Mattino", unita: campo.UNITA_ATTIVITA, valore: 3 },
  ];
  const RAP = [
    { data: "2026-07-31", turno: "Mattino", stato: "bozza",   prodQta: 60, prodUnita: "t" },
    { data: "2026-07-31", turno: "Mattino", stato: "inviato", prodQta: 45, prodUnita: "t" },
    { data: "2026-07-31", turno: "Pomeriggio", stato: "inviato", prodQta: 500, prodUnita: "t" },
    { data: "2026-07-31", turno: "Mattino", stato: "inviato", prodQta: 9, prodUnita: "m³" },
  ];

  test("obiettivoDi: l'ultimo salvato vince (si corregge riscrivendolo)", () => {
    eq(campo.obiettivoDi(OBIETTIVI, "2026-07-31", "Mattino", "t").valore, 120,
      "120 salvato dopo 100");
  });
  test("obiettivoDi: cerca per giorno, turno e unità, e non ne inventa uno", () => {
    eq(campo.obiettivoDi(OBIETTIVI, "2026-07-31", "Notte", "t"), null, "turno senza obiettivo");
    eq(campo.obiettivoDi(OBIETTIVI, "2026-07-31", "Mattino", "m³"), null, "unità senza obiettivo");
    eq(campo.obiettivoDi([], "2026-07-31", "Mattino", "t"), null, "nessun obiettivo salvato");
  });

  test("statoObiettivo: la produzione conta BOZZE COMPRESE (la produzione è produzione)", () => {
    /* 60 in bozza + 45 inviato = 105: contare solo l'inviato direbbe al preposto
       che è più indietro di quanto è, e lo farebbe correre per niente */
    contiene(campo.statoObiettivo(OBIETTIVI[1], RAP, ATT),
      { obiettivo: 120, fatto: 105, mancante: 15, scarto: -15, pct: 88, livello: "warn" },
      "105 su 120");
  });
  test("statoObiettivo: le unità non si mescolano, e gli altri turni nemmeno", () => {
    /* i 9 m³ e i 500 t del pomeriggio non entrano in un obiettivo di mattino in t */
    eq(campo.statoObiettivo(OBIETTIVI[1], RAP, ATT).fatto, 105,
      "solo i t di quel turno");
  });
  test("statoObiettivo: a zero il livello è «atteso», non un allarme", () => {
    /* a inizio turno essere a zero è normale: un rosso lì dentro insegna a
       ignorare i rossi, ed è il modo migliore per non vedere quelli veri */
    const s = campo.statoObiettivo({ data: "2026-07-30", turno: "Notte", unita: "t", valore: 100 }, RAP, ATT);
    contiene(s, { fatto: 0, pct: 0, livello: "atteso" }, "zero all'inizio non è un allarme");
    ok(s.livello !== "danger", "e non deve mai diventare danger");
  });
  test("statoObiettivo: raggiunto e superato si vedono nello scarto", () => {
    const s = campo.statoObiettivo({ data: "2026-07-31", turno: "Mattino", unita: "t", valore: 100 }, RAP, ATT);
    contiene(s, { fatto: 105, mancante: 0, scarto: 5, pct: 105, livello: "ok" },
      "sopra l'obiettivo: mancante a zero, scarto positivo");
  });
  test("statoObiettivo: un obiettivo sulle attività conta quelle concluse", () => {
    contiene(campo.statoObiettivo(OBIETTIVI[2], RAP, ATT),
      { unita: campo.UNITA_ATTIVITA, obiettivo: 3, fatto: 1, pct: 33 }, "una conclusa su tre");
  });
  test("statoObiettivo: senza un numero positivo non risponde niente", () => {
    /* meglio nessuno stato che uno stato costruito su un obiettivo che non c'è */
    eq(campo.statoObiettivo(null, RAP, ATT), null, "nessun obiettivo");
    eq(campo.statoObiettivo({ data: "x", turno: "y", unita: "t", valore: 0 }, RAP, ATT), null, "zero");
    eq(campo.statoObiettivo({ data: "x", turno: "y", unita: "t", valore: "" }, RAP, ATT), null, "vuoto");
    eq(campo.statoObiettivo({ data: "x", turno: "y", unita: "t", valore: -5 }, RAP, ATT), null, "negativo");
  });

  const ATT_FERMI = [
    { data: "2026-07-29", stato: "anomalia", fermoMin: 5 },
    { data: "2026-07-31", stato: "anomalia", fermoMin: 30 },
    { data: "2026-07-31", stato: "anomalia", fermoMin: 15 },
    { data: "2026-07-31", stato: "conclusa" },
    { data: "", stato: "anomalia", fermoMin: 999 },
    { data: "2026-08-05", stato: "anomalia", fermoMin: 777 },
  ];
  const OGGI = new Date("2026-07-31T12:00:00");

  test("fermiPerGiorno: i giorni PRIMA della prima registrazione restano fuori", () => {
    /* disegnarli a zero direbbe «quel giorno non ci siamo fermati», mentre la
       verità è che non c'era ancora nessuno a registrare — è la stessa regola
       che dice che l'assenza di un dato non è un dato favorevole */
    const g = campo.fermiPerGiorno(ATT_FERMI, 14, OGGI);
    eq(g[0].data, "2026-07-29", "la finestra parte dalla prima registrazione, non 14 giorni fa");
    eq(g.length, 3, "tre giorni, non quattordici");
  });
  test("fermiPerGiorno: un giorno DENTRO la finestra senza fermi vale zero", () => {
    /* e questo invece è un dato vero: quel giorno c'eravamo e non ci siamo fermati */
    eq(campo.fermiPerGiorno(ATT_FERMI, 14, OGGI)[1], { data: "2026-07-30", minuti: 0, fermi: 0 },
      "il 30 luglio a zero");
  });
  test("fermiPerGiorno: somma i minuti del giorno e conta i fermi", () => {
    eq(campo.fermiPerGiorno(ATT_FERMI, 14, OGGI)[2], { data: "2026-07-31", minuti: 45, fermi: 2 },
      "30 + 15 minuti, due fermi; la conclusa non è un fermo");
  });
  test("fermiPerGiorno: senza data o nel futuro non entrano", () => {
    /* i 999 minuti senza data e i 777 del 5 agosto non compaiono da nessuna parte */
    const tot = campo.fermiPerGiorno(ATT_FERMI, 14, OGGI).reduce((n, g) => n + g.minuti, 0);
    eq(tot, 50, "5 + 45, e basta");
    eq(campo.fermiPerGiorno([], 14, OGGI), [], "nessuna registrazione: nessuna finestra");
    eq(campo.fermiPerGiorno([{ data: "", stato: "anomalia", fermoMin: 10 }], 14, OGGI), [],
      "solo registrazioni senza data: idem");
  });

  test("storicoSettimana: le giornate vuote restano in elenco (un giorno vuoto è un'informazione)", () => {
    const st = campo.storicoSettimana(ATT, RAP, 3, OGGI);
    eq(st.map(g => g.data), ["2026-07-29", "2026-07-30", "2026-07-31"], "tre giornate in ordine");
    contiene(st[0], { attTot: 0, rapTot: 0, minutiFermo: 0 }, "il 29 è vuoto e si vede");
    contiene(st[2], { attTot: 5, attConcluse: 1, minutiFermo: 45, fermi: 1, rapInviati: 3, rapTot: 4 },
      "il 31 ha tutto");
    eq(st[2].prod, { "t": 605, "m³": 9 }, "produzione tenuta separata per unità");
  });
  test("totaliSettimana: t e m³ non si sommano, e i giorni con dati si contano", () => {
    const t = campo.totaliSettimana(campo.storicoSettimana(ATT, RAP, 3, OGGI));
    contiene(t, { giorni: 3, giorniConDati: 1, minutiFermo: 45, fermi: 1, attTot: 5, attConcluse: 1, pctConcluse: 20 },
      "totali della finestra");
    eq(t.prod, { "t": 605, "m³": 9 }, "due unità, due totali");
  });
  test("totaliSettimana: senza attività la percentuale è vuota, non cento", () => {
    /* zero attività su zero non è «tutto concluso»: è «non c'è niente da dire» */
    eq(campo.totaliSettimana(campo.storicoSettimana([], [], 3, OGGI)).pctConcluse, null, "null, non 100");
  });
  test("unitaPrevalente: sceglie l'unità che pesa di più, e null se non c'è produzione", () => {
    /* tonnellate e metri cubi non si sommano: il grafico ne disegna una sola */
    eq(campo.unitaPrevalente(campo.storicoSettimana(ATT, RAP, 3, OGGI)), "t", "605 t contro 9 m³");
    eq(campo.unitaPrevalente(campo.storicoSettimana([], [], 3, OGGI)), null, "nessuna produzione");
  });

  test("etichettaAssegnazione e operatoriDi: nome breve della squadra e ordine alfabetico", () => {
    eq(campo.etichettaAssegnazione({ squadra: SQU_A, operatore: "Mario Rossi" }), "Squadra A · Mario Rossi", "squadra e persona");
    eq(campo.etichettaAssegnazione({ squadra: SQU_A }), "Squadra A", "solo squadra");
    eq(campo.etichettaAssegnazione({}), "", "non assegnata: stringa vuota, non «nessuno»");
    eq(campo.operatoriDi([{ nome: "Zeno", squadra: SQU_A }, { nome: "Anna", squadra: "Squadra A" },
      { nome: "Bruno", squadra: "Squadra B" }], "Squadra A").map(o => o.nome),
      ["Anna", "Zeno"], "la squadra si riconosce dal nome breve, in ordine alfabetico");
  });
}

// ── Campo: la foto dell'anomalia, il meteo, la checklist ──────────────
/* Secondo gruppo di funzioni scoperte di Campo. Due famiglie molto diverse:
   · la FOTO è anche una questione di sicurezza — `eFotoValida` è l'ultima
     cosa che sta fra un `data:` costruito a mano e un tag <img> della
     pagina (docs/AUDIT_SICUREZZA.md), e le misure decidono se una foto da
     8 MB entra o no in un documento Firestore da 1 MB;
   · il METEO è la voce che «spiega i fermi»: qui conta soprattutto che
     quando NON è stato registrato niente non esca un giudizio tranquillo. */
{
  console.log("\n— Campo: foto dell'anomalia, meteo, checklist —");

  test("eImmagine: passano le foto del telefono (HEIC compreso), non i documenti", () => {
    ok(campo.eImmagine({ type: "image/jpeg" }), "jpeg");
    ok(campo.eImmagine({ type: "IMAGE/HEIC" }), "heic dell'iPhone, anche scritto in maiuscolo");
    ok(!campo.eImmagine({ type: "application/pdf" }), "un pdf non è una foto");
    ok(!campo.eImmagine({ type: "image/svg+xml" }), "un SVG può contenere codice: fuori");
    ok(!campo.eImmagine({}), "senza tipo non si indovina");
    ok(!campo.eImmagine(null), "senza file nemmeno");
  });
  test("⛔ eFotoValida: solo data URL di immagine in base64, mai «javascript:», mai SVG", () => {
    /* è l'ultimo controllo prima di un <img> della pagina: se cede qui, cede
       in tutte le anomalie salvate da chiunque nell'organizzazione */
    ok(campo.eFotoValida("data:image/jpeg;base64,AAAA"), "jpeg");
    ok(campo.eFotoValida("data:image/png;base64,AAA="), "png col padding");
    ok(!campo.eFotoValida("data:image/svg+xml;base64,AAAA"), "SVG: no");
    ok(!campo.eFotoValida("data:image/gif;base64,AAAA"), "gif: no (il canvas riscrive in JPEG)");
    ok(!campo.eFotoValida("javascript:alert(1)"), "javascript: no");
    ok(!campo.eFotoValida("https://esterno/foto.jpg"), "un indirizzo esterno non è una foto salvata");
    ok(!campo.eFotoValida(""), "vuoto: no");
  });
  test("byteFoto: conta i byte del file, non i caratteri del base64", () => {
    /* il base64 è un terzo più lungo del file: leggere la lunghezza del testo
       farebbe credere che una foto da 210 kB ne pesi 280, e la scaletta dei
       tentativi rimpicciolirebbe per niente */
    eq(campo.byteFoto("data:image/jpeg;base64," + "A".repeat(100)), 75, "100 caratteri = 75 byte");
    eq(campo.byteFoto("data:image/jpeg;base64," + "A".repeat(98) + "=="), 73, "il riempimento finale non conta");
  });
  test("byteFoto: quello che non è un data URL pesa zero", () => {
    eq(campo.byteFoto("robaccia"), 0, "senza virgola non c'è nessun contenuto");
    eq(campo.byteFoto(""), 0, "vuoto");
    eq(campo.byteFoto(null), 0, "niente");
  });
  test("formattaByte: kB fin sotto il mega, poi MB con la virgola italiana", () => {
    eq(campo.formattaByte(245760), "240 kB", "240 kB");
    eq(campo.formattaByte(3355443), "3,2 MB", "virgola, non punto");
    /* il pavimento a 1 kB è voluto: una foto da 300 byte esiste, e «0 kB»
       direbbe che non c'è. Non è un numero inventato su un dato mancante —
       lì la pagina non disegna proprio la riga della foto. */
    eq(campo.formattaByte(300), "1 kB", "un file piccolo non pesa «0 kB»");
  });
  test("misuraRidotta: rimpicciolisce tenendo le proporzioni, sul lato lungo", () => {
    eq(campo.misuraRidotta(4000, 3000, 1280), { w: 1280, h: 960 }, "orizzontale");
    eq(campo.misuraRidotta(3000, 4000, 1024), { w: 768, h: 1024 }, "verticale: il lato lungo è l'altezza");
  });
  test("misuraRidotta: non ingrandisce mai una foto piccola", () => {
    /* stirarla non aggiunge niente e fa pesare di più lo stesso dettaglio */
    eq(campo.misuraRidotta(800, 600, 1280), { w: 800, h: 600 }, "resta com'è");
  });
  test("misuraRidotta: misure assenti o assurde danno 1×1, non zero né NaN", () => {
    eq(campo.misuraRidotta(0, 0, 1280), { w: 1, h: 1 }, "zero per zero");
    eq(campo.misuraRidotta(-5, -5, 1280), { w: 1, h: 1 }, "negative");
    eq(campo.misuraRidotta("", "", 1280), { w: 1, h: 1 }, "vuote");
  });
  test("la scaletta dei tentativi scende, e il tetto sta ben sotto il mega di Firestore", () => {
    /* un documento Firestore non può superare 1 MB IN TUTTO: se il tetto della
       sola foto ci arrivasse vicino, l'anomalia non si salverebbe più */
    ok(campo.FOTO_MAX_BYTE < 1048576 * 0.35, "il tetto lascia spazio agli altri campi");
    const lati = campo.FOTO_TENTATIVI.map(t => t.lato);
    const qual = campo.FOTO_TENTATIVI.map(t => t.qualita);
    eq(lati, [...lati].sort((a, b) => b - a), "i lati scendono");
    eq(qual, [...qual].sort((a, b) => b - a), "e anche la qualità");
    ok(campo.FOTO_TENTATIVI.length >= 3, "più di un tentativo, se no non è una scaletta");
  });

  const METEO = [
    { data: "2026-07-31", turno: "Mattino", cielo: "Sereno" },
    { data: "2026-07-31", turno: "Mattino", cielo: "Pioggia", piste: "Fangose", visibilita: "Ridotta" },
    { data: "2026-07-31", turno: "Pomeriggio", cielo: "Nuvoloso" },
  ];
  test("meteoDi: l'ultimo registrato vince, e per un turno senza niente non inventa", () => {
    contiene(campo.meteoDi(METEO, "2026-07-31", "Mattino"), { cielo: "Pioggia" }, "la correzione vale");
    eq(campo.meteoDi(METEO, "2026-07-31", "Notte"), null, "turno mai registrato");
    eq(campo.meteoDi([], "2026-07-31", "Mattino"), null, "niente registrato");
  });
  test("riassuntoMeteo: una riga sola, e vuota se non c'è niente", () => {
    eq(campo.riassuntoMeteo(METEO[1]), "Pioggia · piste fangose · visibilità ridotta", "la riga intera");
    eq(campo.riassuntoMeteo({ cielo: "Sereno" }), "Sereno", "solo quello che è stato detto");
    eq(campo.riassuntoMeteo({}), "", "registrazione vuota");
    eq(campo.riassuntoMeteo(null), "", "nessuna registrazione");
  });
  test("meteoAvverso: le condizioni che da sole spiegano un fermo", () => {
    ok(campo.meteoAvverso({ cielo: "Pioggia" }), "pioggia");
    ok(campo.meteoAvverso({ cielo: "Neve o gelo" }), "neve o gelo");
    ok(campo.meteoAvverso({ cielo: "Caldo estremo" }), "caldo estremo");
    ok(campo.meteoAvverso({ cielo: "Sereno", piste: "Ghiacciate" }), "col sole ma le piste ghiacciate");
    ok(campo.meteoAvverso({ cielo: "Sereno", visibilita: "Scarsa" }), "visibilità scarsa");
  });
  test("meteoAvverso: «Ridotta» non è «Scarsa», e il sereno non è avverso", () => {
    /* allargare la soglia farebbe suonare l'allarme quasi sempre, e un
       allarme quasi sempre acceso non è un allarme */
    ok(!campo.meteoAvverso({ cielo: "Sereno", visibilita: "Ridotta" }), "ridotta no");
    ok(!campo.meteoAvverso({ cielo: "Sereno", piste: "Asciutte", visibilita: "Buona" }), "giornata buona");
    ok(!campo.meteoAvverso({ cielo: "Nuvoloso" }), "nuvoloso non ferma niente");
  });
  test("⛔ meteo non registrato: nessun giudizio, e il cartellone non si disegna", () => {
    /* meteoAvverso(null) è false, ma NON significa «bel tempo»: la pagina
       disegna il cartellone solo quando riassuntoMeteo dice qualcosa, e
       l'export scrive «non registrato». Le due cose vanno insieme: se un
       giorno il cartellone comparisse anche a riassunto vuoto, un turno mai
       compilato si mostrerebbe come un turno senza problemi. */
    ok(!campo.meteoAvverso(null), "senza registrazione non c'è nessun giudizio");
    eq(campo.riassuntoMeteo(null), "", "e nemmeno niente da scrivere: è questo che spegne il cartellone");
    eq(campo.riassuntoMeteo(campo.meteoDi([], "2026-07-31", "Notte")), "", "turno mai compilato");
  });

  test("checklistDi: l'ultima salvata vince e la squadra si riconosce dal nome breve", () => {
    const CHK = [
      { data: "2026-07-31", turno: "Mattino", squadra: "Squadra A", esiti: { "0": "ok" } },
      { data: "2026-07-31", turno: "Mattino", squadra: "Squadra A — Perforazione", esiti: { "0": "no" } },
    ];
    eq(campo.checklistDi(CHK, "2026-07-31", "Mattino", "Squadra A — Perforazione").esiti, { "0": "no" },
      "«Squadra A» e «Squadra A — Perforazione» sono la stessa squadra");
    eq(campo.checklistDi(CHK, "2026-07-31", "Mattino", "Squadra B"), null, "un'altra squadra non eredita");
    eq(campo.checklistDi([], "2026-07-31", "Mattino", "Squadra A"), null, "mai compilata");
  });
  test("statoChecklist: «non risposto» non è «a posto», e i problemi si leggono", () => {
    /* una voce lasciata in bianco che contasse come ok trasformerebbe la
       checklist in una firma finta: è esattamente ciò che deve impedire */
    const s = campo.statoChecklist({ "0": "ok", "1": "no", "2": "na" });
    contiene(s, { ok: 1, no: 1, na: 1, risposte: 3, completa: false }, "tre risposte su nove");
    eq(s.mancanti, s.totale - s.risposte, "le mancanti sono quelle non toccate");
    eq(s.problemi.length, 1, "un problema elencato");
    ok(s.problemi[0].length > 3, "e nominato per esteso, non per numero");
  });
  test("statoChecklist: mai compilata è 0%, non «completa»", () => {
    const s = campo.statoChecklist({});
    contiene(s, { ok: 0, no: 0, na: 0, risposte: 0, completa: false, pct: 0 }, "vuota");
    eq(s.problemi, [], "nessun problema TROVATO non vuol dire nessun problema");
    eq(campo.statoChecklist(null).risposte, 0, "senza esiti non esplode");
  });
  test("le liste a scelta rapida restano quelle previste (si tocca, non si scrive)", () => {
    eq(campo.ESITI_CHECK, ["ok", "no", "na"], "fatto / non a posto / non applicabile");
    eq(campo.STATI_PRESENZA, ["presente", "assente"], "e «non spuntato» non è uno stato: è l'assenza di risposta");
    ok(campo.METEO_CIELO.includes("Pioggia") && campo.METEO_CIELO.includes("Neve o gelo"), "cielo");
    ok(campo.METEO_PISTE.includes("Ghiacciate"), "piste");
    eq(campo.METEO_VISIBILITA, ["Buona", "Ridotta", "Scarsa"], "visibilità");
  });
}

// ── Flotta: i fermi, i costi per mese, la disponibilità registrata ────
/* Flotta era rimasta la meno difesa (34 funzioni su 71). Il blocco dei
   FERMI è quello che pesa di più: da lì esce la disponibilità del parco,
   cioè il numero con cui si decide se una macchina si ripara ancora o si
   sostituisce. Tutte le regole qui sotto sono scritte nei commenti del
   modulo come «regole di onestà»: qui diventano asserzioni. */
{
  console.log("\n— Flotta: fermi, costi per mese, disponibilità —");
  const OGGI = new Date("2026-07-31T10:00:00");

  test("causali di fermo: la lista è chiusa, e un motivo non riconosciuto si vede", () => {
    /* servono categorie confrontabili nel tempo, se no la disponibilità non
       si può nemmeno calcolare; ma una chiave sconosciuta non diventa mai
       «Altro» in silenzio: viene ripetuta com'è */
    eq(flotta.etichettaCausale("attesa-ricambi"), "Attesa ricambi", "chiave nota");
    eq(flotta.etichettaCausale("pippo"), "pippo", "chiave sconosciuta: si mostra com'è");
    eq(flotta.etichettaCausale(""), "Motivo non indicato", "e senza motivo lo dice");
    eq(flotta.causaleFermo("x"), null, "causaleFermo non inventa una voce");
    ok(flotta.CAUSALI_FERMO.every(c => c.chiave && c.etichetta && c.nota),
      "ogni causale ha chiave, etichetta e spiegazione");
  });
  test("⚠️ `CAUSALI_FERMO` esiste in DUE app e NON è la stessa cosa", () => {
    /* Trovato scrivendo questa prova, con un'asserzione buttata lì che è
       caduta: Campo esporta anche lui `CAUSALI_FERMO`. Non è la regola
       riscritta due volte — sono due tassonomie di soggetti diversi:
       Campo dice perché si è fermata UN'ATTIVITÀ di turno (testo semplice:
       «Mancanza materiale», «Attesa mezzo», «Cambio turno»), Flotta perché
       è fuori servizio UNA MACCHINA (voci con chiave, per calcolare la
       disponibilità: «attesa-ricambi», «gomme-cingoli»).
       La prova sta qui perché il nome uguale è una trappola per chi arriva
       dopo: se un giorno le due liste diventassero davvero la stessa cosa,
       il posto è `shared/`, non una copia. */
    ok(Array.isArray(campo.CAUSALI_FERMO) && typeof campo.CAUSALI_FERMO[0] === "string",
      "Campo: testo semplice, sono voci da scegliere in un elenco");
    ok(typeof flotta.CAUSALI_FERMO[0] === "object" && flotta.CAUSALI_FERMO[0].chiave,
      "Flotta: voci con chiave, perché ci si calcola sopra la disponibilità");
    ok(campo.CAUSALI_FERMO.includes("Attesa mezzo"), "Campo parla di attività di turno");
    ok(flotta.CAUSALI_FERMO.some(c => c.chiave === "gomme-cingoli"), "Flotta parla di macchine");
  });

  test("giorniFermo: una giornata persa è persa tutta (conteggio inclusivo)", () => {
    /* ferma il 3 e ripartita il 3 = un giorno, non zero: in cava mezza
       giornata di escavatore fermo non è mezza giornata di lavoro */
    eq(flotta.giorniFermo({ inizio: "2026-07-03", fine: "2026-07-03" }, "2026-07-01", "2026-07-31"), 1,
      "stesso giorno = 1");
  });
  test("giorniFermo: un fermo aperto conta fino alla fine della finestra", () => {
    eq(flotta.giorniFermo({ inizio: "2026-07-29" }, "2026-07-01", "2026-07-31"), 3, "29, 30, 31");
  });
  test("giorniFermo: un fermo più vecchio pesa solo per la parte che ci sta dentro", () => {
    /* un fermo di due mesi non può pesare due mesi su una finestra di trenta
       giorni: il denominatore non lo reggerebbe e la percentuale mentirebbe */
    eq(flotta.giorniFermo({ inizio: "2026-05-01", fine: "2026-07-05" }, "2026-07-01", "2026-07-31"), 5, "1→5 luglio");
    eq(flotta.giorniFermo({ inizio: "2026-01-01", fine: "2026-01-05" }, "2026-07-01", "2026-07-31"), 0, "fuori finestra");
    eq(flotta.giorniFermo({ fine: "2026-07-05" }, "2026-07-01", "2026-07-31"), 0, "senza inizio non è un fermo");
  });
  test("durataFermo: un fermo aperto conta fino a oggi E LO DICHIARA", () => {
    /* «3 giorni» su un fermo ancora aperto è un numero che cresce: il flag
       `aperto` è quello che impedisce di leggerlo come un fermo finito */
    contiene(flotta.durataFermo({ inizio: "2026-07-29" }, OGGI), { giorni: 3, aperto: true, fine: null }, "aperto");
    contiene(flotta.durataFermo({ inizio: "2026-07-28", fine: "2026-07-30" }, OGGI),
      { giorni: 3, aperto: false, fine: "2026-07-30" }, "chiuso");
  });
  test("durataFermo: senza inizio non inventa una durata", () => {
    /* zero giorni direbbe «non si è fermata»: qui la risposta è «non lo so» */
    contiene(flotta.durataFermo({}, OGGI), { giorni: null }, "nessun inizio");
    contiene(flotta.durataFermo({ inizio: "2026-07-30", fine: "2026-07-28" }, OGGI), { giorni: null },
      "ripartita prima di fermarsi: nessuna durata, non una negativa");
  });

  test("validaFermo: mezzo, motivo e giorno sono obbligatori, con la frase che dice cosa fare", () => {
    const v = flotta.validaFermo({}, OGGI);
    eq(v.ok, false, "non si salva");
    eq(Object.keys(v.errori).sort(), ["causale", "inizio", "mezzo"], "tre cose mancanti");
    ok(/Scegli il mezzo/.test(v.errori.mezzo), "e l'errore dice cosa fare, non «campo non valido»");
  });
  test("validaFermo: un fermo non comincia domani e non riparte nel futuro", () => {
    /* la data futura è il modo più facile per falsare la disponibilità:
       giorni persi che non sono ancora successi */
    ok(!flotta.validaFermo({ mezzo: "X", causale: "altro", inizio: "2026-08-01" }, OGGI).ok, "inizio domani");
    const f = flotta.validaFermo({ mezzo: "X", causale: "altro", inizio: "2026-07-29", fine: "2026-08-05" }, OGGI);
    ok(!f.ok && /futuro/.test(f.errori.fine), "ripartenza nel futuro");
    ok(!flotta.validaFermo({ mezzo: "X", causale: "altro", inizio: "2026-07-29", fine: "2026-07-28" }, OGGI).ok,
      "ripartita prima di essersi fermata");
    ok(!flotta.validaFermo({ mezzo: "X", causale: "altro", inizio: "1990-01-01" }, OGGI).ok,
      "oltre dieci anni fa: quasi sempre un anno sbagliato");
  });
  test("validaFermo: un fermo aperto è valido (la macchina è ferma adesso)", () => {
    contiene(flotta.validaFermo({ mezzo: "CAT 320", causale: "guasto-meccanico", inizio: "2026-07-29" }, OGGI),
      { ok: true, inizio: "2026-07-29", fine: null }, "senza ripartenza si salva");
  });

  test("fermiOrdinati: prima gli aperti dal più lungo, poi i chiusi dal più recente", () => {
    /* l'ordine è la risposta a «di cosa mi devo occupare adesso»: una
       macchina ferma da dodici giorni non può stare sotto a una riparata */
    const FERMI = [
      { mezzo: "B", causale: "attesa-ricambi", inizio: "2026-07-20" },
      { mezzo: "A", causale: "guasto-meccanico", inizio: "2026-07-29" },
      { mezzo: "C", causale: "operatore", inizio: "2026-07-10", fine: "2026-07-12" },
      { mezzo: "D", causale: "verifica", inizio: "2026-07-25", fine: "2026-07-26" },
    ];
    eq(flotta.fermiOrdinati(FERMI, OGGI).map(f => f.mezzo), ["B", "A", "D", "C"], "ordine");
    contiene(flotta.fermiOrdinati(FERMI, OGGI)[0], { aperto: true, giorni: 12, causaleTx: "Attesa ricambi" },
      "la riga porta con sé durata, stato e motivo per esteso");
  });

  test("etichettaMese: «lug 2026», e un mese che non esiste non diventa gennaio", () => {
    eq(flotta.etichettaMese("2026-07"), "lug 2026", "mese normale");
    eq(flotta.etichettaMese("boh"), "—", "non è un mese");
    eq(flotta.etichettaMese("2026-13"), "? 2026", "mese fuori scala: si vede che è storto");
  });
  test("costiPerMese: le voci senza data non finiscono in nessun mese, e si dichiarano", () => {
    /* attribuirle a «oggi» sarebbe inventare un mese di competenza; farle
       sparire sarebbe peggio, perché quei soldi sono stati spesi davvero */
    const c = flotta.costiPerMese([
      { data: "2026-05-10", importo: 100 }, { data: "2026-07-01", importo: 250 },
      { data: "2026-07-20", importo: 50 }, { data: "", importo: 999 },
    ]);
    eq(c.senzaData, { voci: 1, importo: 999 }, "una voce senza data, dichiarata");
    eq(c.totale, 400, "e non entra nel totale dei mesi");
    eq(c.mesi.map(m => [m.ym, m.importo, m.voci]), [["2026-05", 100, 1], ["2026-07", 300, 2]], "mesi");
  });
  test("costiPerMese: un mese senza registrazioni NON è un mese a zero euro", () => {
    /* non compare fra i mesi — disegnarlo a zero direbbe «quel mese non
       abbiamo speso niente» — ma `mancanti` lo conta, così si può scrivere */
    const c = flotta.costiPerMese([{ data: "2026-05-10", importo: 100 }, { data: "2026-07-01", importo: 250 }]);
    eq(c.mesi.length, 2, "maggio e luglio");
    eq(c.mancanti, 1, "giugno manca, e lo dice");
    eq(flotta.costiPerMese([]).mancanti, 0, "senza dati non manca niente");
  });

  test("disponibilitaStorico: dello stesso giorno vale l'ultima registrazione", () => {
    const s = flotta.disponibilitaStorico([
      { data: "2026-07-31", operativi: 9, totale: 10 },
      { data: "2026-07-31", operativi: 7, totale: 10 },
    ], 30, OGGI);
    eq(s.punti.length, 1, "un giorno, un punto");
    contiene(s.punti[0], { operativi: 7, pct: 70 }, "l'ultima situazione nota del giorno");
  });
  test("disponibilitaStorico: una riga incoerente si scarta, non si aggiusta", () => {
    /* 12 operativi su 10 non è un 120% da disegnare, ed è la ragione per cui
       il giorno finisce fra quelli SENZA registrazione invece che nel grafico */
    const s = flotta.disponibilitaStorico([
      { data: "2026-07-29", operativi: 8, totale: 10 },
      { data: "2026-07-30", operativi: 12, totale: 10 },
      { data: "2026-07-30", operativi: 3, totale: 0 },
    ], 30, OGGI);
    eq(s.punti.map(p => p.data), ["2026-07-29"], "resta solo il giorno buono");
    eq(s.giorniSenza, 29, "e i giorni senza registrazione si contano");
  });
  test("disponibilitaStorico: niente riempimenti, e la finestra taglia il passato", () => {
    /* un giorno senza registrazione non vale «tutto operativo»: semplicemente
       non c'è, e quanti sono si scrive accanto al grafico */
    const s = flotta.disponibilitaStorico([
      { data: "2026-06-01", operativi: 5, totale: 10 },
      { data: "2026-07-29", operativi: 8, totale: 10 },
    ], 30, OGGI);
    eq(s.punti.map(p => p.data), ["2026-07-29"], "il 1° giugno è fuori dai 30 giorni");
    contiene(s, { finestra: 30, giorniSenza: 29 }, "finestra e giorni senza");
    eq(flotta.disponibilitaStorico([], 30, OGGI).punti, [], "senza registrazioni nessun punto");
  });

  test("costoOfficinaPerMezzo: dal più caro, e conta anche QUANTE volte", () => {
    /* «3.000 € in un colpo» e «3.000 € in dieci volte» sono due storie
       diverse: la prima è un guasto, la seconda è una macchina da sostituire */
    const c = flotta.costoOfficinaPerMezzo([
      { mezzo: "CAT 320", costo: 3000 }, { mezzo: "CAT 320", costo: 1000 },
      { mezzo: "Volvo", costo: 500 }, { mezzo: "", costo: 200 },
      { mezzo: "Volvo", costo: 0 }, { mezzo: "Volvo", costo: -50 },
    ]);
    eq(c.totale, 4700, "totale");
    eq(c.mezzi.map(m => [m.mezzo, m.costo, m.interventi]),
      [["CAT 320", 4000, 2], ["Volvo", 500, 1], ["Senza mezzo", 200, 1]],
      "gli interventi a costo zero o negativo non entrano, e chi non ha mezzo si vede");
    eq(c.mezzi[0].pct, 85, "e il peso di ciascuno");
  });
  test("costoOfficinaPerMezzo: senza interventi non c'è nessuna percentuale da dare", () => {
    eq(flotta.costoOfficinaPerMezzo([]), { totale: 0, mezzi: [] }, "vuoto");
  });
}

console.log(`\nRisultato KPI app: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
