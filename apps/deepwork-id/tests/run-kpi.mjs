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
test("urgenzaOre: ore attuali mancanti trattate come 0 (niente crash)", () =>
  eq(flotta.urgenzaOre(500, undefined).mancano, 500, "ore attuali assenti → 0"));

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

console.log(`\nRisultato KPI app: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
