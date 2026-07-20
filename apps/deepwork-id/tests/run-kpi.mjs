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
test("kpiFrom conta scadute/in-scadenza e lavoratori regolari", () => {
  const lav = [{ id: "l1", attivo: true }, { id: "l2", attivo: true }, { id: "l3", attivo: false }];
  const sca = [
    { lavoratoreId: "l1", dataScadenza: PAST },        // scaduta
    { lavoratoreId: "l2", dataScadenza: plusDays(10) },// in-scadenza
    { lavoratoreId: "l1", dataScadenza: FUT },         // regolare
  ];
  eq(scudo.kpiFrom(lav, sca), { scadute: 1, trenta: 1, regolari: 0 }, "kpi scudo");
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

console.log("\n— Confini: stato misura sensori (Sentinella) —");
test("statoMisura: rapporto esattamente 1,0 = superamento", () =>
  eq(sentinella.statoMisura({ valore: 50, soglia: 50 }).cls, "danger", "r=1"));
test("statoMisura: rapporto esattamente 0,9 = attenzione", () =>
  eq(sentinella.statoMisura({ valore: 45, soglia: 50 }).cls, "warn", "r=0,9"));
test("statoMisura: appena sotto 0,9 = conforme", () =>
  eq(sentinella.statoMisura({ valore: 44, soglia: 50 }).cls, "ok", "r<0,9"));
test("statoMisura: soglia 0 non manda in crash (guardia 0,001)", () =>
  eq(sentinella.statoMisura({ valore: 5, soglia: 0 }).cls, "danger", "soglia 0"));

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

console.log(`\nRisultato KPI app: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
