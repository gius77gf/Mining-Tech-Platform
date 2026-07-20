// ============================================================
// Test di INTEGRITÀ dei dati DEMO delle 6 app: sono ciò che l'utente
// vede in modalità demo/tour PRIMA del go-live (e la base delle
// schermate negli screenshot). Un errore qui (id duplicati, chiave
// esterna rotta, data non valida, campo numerico non numerico) si
// vedrebbe come UI rotta. JS puro, nessun emulatore.
// ============================================================

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const demo = async (name, file) => (await import(join(HERE, `../../${name}/${file}`))).DEMO;

const S = await demo("scudo", "scudo-data.js");
const C = await demo("campo", "campo-data.js");
const F = await demo("flotta", "flotta-data.js");
const N = await demo("conti", "conti-data.js");
const E = await demo("sentinella", "sentinella-data.js");
const T = await demo("terra", "terra-data.js");

let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const ok = (c, why) => { if (!c) throw new Error(why); };
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00"));
const isNum = (v) => typeof v === "number" && !Number.isNaN(v);
// ogni record ha un id e gli id sono unici nella collezione
const idsOk = (arr, label) => {
  ok(Array.isArray(arr) && arr.length > 0, `${label}: collezione vuota`);
  const ids = arr.map(x => x.id);
  ok(ids.every(Boolean), `${label}: record senza id`);
  ok(new Set(ids).size === ids.length, `${label}: id duplicati`);
};

console.log("\n— Integrità dati DEMO —");

test("scudo: id unici, scadenze→lavoratore risolve, date valide", () => {
  idsOk(S.lavoratori, "lavoratori"); idsOk(S.scadenze, "scadenze"); idsOk(S.documenti, "documenti");
  const lav = new Set(S.lavoratori.map(l => l.id));
  for (const s of S.scadenze) {
    ok(lav.has(s.lavoratoreId), `scadenza ${s.id}: lavoratoreId ${s.lavoratoreId} inesistente`);
    ok(isDate(s.dataScadenza), `scadenza ${s.id}: data non valida ${s.dataScadenza}`);
  }
});

test("campo: id unici e stati coerenti", () => {
  idsOk(C.attivita, "attivita"); idsOk(C.squadre, "squadre"); idsOk(C.rapportini, "rapportini");
  for (const r of C.rapportini) ok(["inviato", "bozza"].includes(r.stato), `rapportino ${r.id}: stato ${r.stato}`);
  for (const q of C.squadre) ok(isNum(q.persone), `squadra ${q.id}: persone non numerico`);
});

test("flotta: id unici, date manutenzioni valide, costi numerici", () => {
  idsOk(F.mezzi, "mezzi"); idsOk(F.manutenzioni, "manutenzioni"); idsOk(F.costi, "costi");
  for (const n of F.manutenzioni) ok(isDate(n.dataPrevista), `manutenzione ${n.id}: data ${n.dataPrevista}`);
  for (const c of F.costi) ok(isNum(c.importo), `costo ${c.id}: importo non numerico`);
  for (const m of F.mezzi) ok(isNum(m.ore), `mezzo ${m.id}: ore non numerico`);
});

test("conti: id unici, importi numerici, emessa non dopo scadenza", () => {
  idsOk(N.fatture, "fatture"); idsOk(N.gare, "gare");
  for (const f of N.fatture) {
    ok(isNum(f.importo), `fattura ${f.id}: importo non numerico`);
    ok(isDate(f.emessa) && isDate(f.scadenza), `fattura ${f.id}: date non valide`);
    ok(Date.parse(f.emessa) <= Date.parse(f.scadenza), `fattura ${f.id}: emessa dopo la scadenza`);
  }
});

test("sentinella: id unici, valore/soglia numerici, date adempimenti", () => {
  idsOk(E.monitoraggi, "monitoraggi"); idsOk(E.adempimenti, "adempimenti"); idsOk(E.registri, "registri");
  for (const m of E.monitoraggi) ok(isNum(m.valore) && isNum(m.soglia) && m.soglia > 0, `monitoraggio ${m.id}: valori`);
  for (const a of E.adempimenti) ok(isDate(a.scadenza), `adempimento ${a.id}: data ${a.scadenza}`);
});

test("terra: id unici, date rilievi valide, volumeM3 numerico o null", () => {
  idsOk(T.fronti, "fronti"); idsOk(T.rilievi, "rilievi"); idsOk(T.piano, "piano");
  const fro = new Set(T.fronti.map(f => f.id));
  for (const r of T.rilievi) {
    ok(isDate(r.data), `rilievo ${r.id}: data ${r.data}`);
    ok(r.volumeM3 === null || isNum(r.volumeM3), `rilievo ${r.id}: volumeM3 ${r.volumeM3}`);
    ok(r.fronteId == null || fro.has(r.fronteId), `rilievo ${r.id}: fronteId ${r.fronteId} inesistente`);
  }
  for (const f of T.fronti) ok(isNum(f.avanzamento), `fronte ${f.id}: avanzamento non numerico`);
});

console.log(`\nRisultato Demo: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
