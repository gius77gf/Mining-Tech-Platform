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

let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const eq = (got, exp, why) => {
  const a = JSON.stringify(got), b = JSON.stringify(exp);
  if (a !== b) throw new Error(`${why}: atteso ${b}, ottenuto ${a}`);
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
test("kpiFrom: da incassare, in scadenza, gare aperte, DSO", () => {
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-25", emessa: "2026-07-10" },
    { importo: 50, incassata: true, scadenza: "2026-06-01", emessa: "2026-05-01" },
    { importo: 30, incassata: false, scadenza: "2026-07-22", emessa: "2026-07-02" },
  ];
  const gare = [{ stato: "aperta" }, { stato: "vinta" }];
  eq(conti.kpiFrom(fatture, gare, oggi),
    { daIncassare: 130, inScadenza: 2, gareAperte: 1, dso: 14 }, "kpi conti");
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
test("kpiFrom: una fattura senza data di emissione non rompe il DSO", () => {
  // regressione: prima una fattura senza "emessa" rendeva il DSO = NaN
  // (mostrato come "NaN giorni" nel cruscotto). Ora contribuisce 0.
  const oggi = new Date("2026-07-20T00:00:00");
  const fatture = [
    { importo: 100, incassata: false, scadenza: "2026-07-25", emessa: undefined },   // senza data → 0 gg
    { importo: 50,  incassata: false, scadenza: "2026-07-25", emessa: "2026-07-10" }, // 10 gg
  ];
  const dso = conti.kpiFrom(fatture, [], oggi).dso;
  eq(Number.isFinite(dso), true, "DSO è un numero finito");
  eq(dso, 5, "media di 0 e 10");
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
  eq(terra.fmtM3(1200000), "1.2M", "milioni");
  eq(terra.fmtM3(38000), "38k", "migliaia");
  eq(terra.fmtM3(500), "500", "unità");
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
  eq(terra.kpiFrom(fronti, rilievi, piano, oggi),
    { volumiMese: 1000, rilieviMese: 1, avanzamento: 25, riserveM3: 500000, frontiAttivi: 1 }, "kpi terra");
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
test("riservaResidua: residuo = riserve − estratto; anni al ritmo pianificato", () => {
  eq(terra.riservaResidua(1000000, 100000, 125000), { residuo: 900000, anni: 7.2 }, "900k / 125k = 7,2 anni");
  eq(terra.riservaResidua(100000, 200000, 125000), { residuo: 0, anni: 0 }, "estratto > riserve → residuo 0");
});
test("riservaResidua: senza riserva stimata = null; senza ritmo = anni null", () => {
  eq(terra.riservaResidua(null, 100, 125000), null, "riserve assenti → null");
  eq(terra.riservaResidua(1000000, 0, 0).anni, null, "ritmo 0 → anni non stimabili");
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
test("Conti kpiFrom([],[]) = zero e DSO 0 (niente divisione per zero)", () =>
  eq(conti.kpiFrom([], []), { daIncassare: 0, inScadenza: 0, gareAperte: 0, dso: 0 }, "conti vuoto"));
test("Sentinella kpiFrom([],[]) = tutti zero", () =>
  eq(sentinella.kpiFrom([], []), { attivi: 0, superamenti: 0, adempimenti30: 0 }, "sentinella vuoto"));
test("Terra kpiFrom([],[],[]) = zero, avanzamento e riserve null", () =>
  eq(terra.kpiFrom([], [], []),
    { volumiMese: 0, rilieviMese: 0, avanzamento: null, riserveM3: null, frontiAttivi: 0 }, "terra vuoto"));
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
test("CAUSALI_FERMO: lista non vuota, tutte stringhe uniche", () => {
  const c = campo.CAUSALI_FERMO;
  eq(c.length > 0, true, "non vuota");
  eq(c.length, new Set(c).size, "uniche");
});
test("riassuntoRapportino: compone turno/squadra/produzione/consegne", () => {
  eq(campo.riassuntoRapportino({ turno: "Mattina", squadra: "Squadra A", produzione: "90 t", note: "cambiare benna" }),
     "Turno Mattina · Squadra A · Produzione: 90 t · Consegne: cambiare benna", "completo");
  eq(campo.riassuntoRapportino({ squadra: "Squadra B" }), "Squadra B", "solo squadra");
  eq(campo.riassuntoRapportino({}), "", "niente → vuoto");
});

console.log(`\nRisultato KPI app: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
