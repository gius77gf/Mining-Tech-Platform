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
  const sq = new Set(C.squadre.map(s => s.nome.split(" — ")[0]));
  for (const r of C.rapportini)
    ok(r.squadra == null || sq.has(r.squadra.split(" — ")[0]), `rapportino ${r.id}: squadra «${r.squadra}» inesistente`);
});

test("flotta: id unici, date manutenzioni valide, costi numerici", () => {
  idsOk(F.mezzi, "mezzi"); idsOk(F.manutenzioni, "manutenzioni"); idsOk(F.costi, "costi");
  for (const n of F.manutenzioni) ok(isDate(n.dataPrevista), `manutenzione ${n.id}: data ${n.dataPrevista}`);
  for (const c of F.costi) ok(isNum(c.importo), `costo ${c.id}: importo non numerico`);
  const mz = new Set(F.mezzi.map(m => m.nome.split(" — ")[0]));
  for (const n of F.manutenzioni)
    ok(n.mezzo == null || mz.has(n.mezzo.split(" — ")[0]), `manutenzione ${n.id}: mezzo «${n.mezzo}» inesistente`);
  for (const m of F.mezzi) ok(isNum(m.ore), `mezzo ${m.id}: ore non numerico`);
  // stato noto: uno stato con un refuso farebbe crashare il badge (MB[stato])
  for (const m of F.mezzi)
    ok(["operativo", "fermo", "verifica"].includes(m.stato), `mezzo ${m.id}: stato «${m.stato}» sconosciuto`);
});

test("conti: id unici, importi numerici, emessa non dopo scadenza", () => {
  idsOk(N.fatture, "fatture"); idsOk(N.gare, "gare");
  for (const f of N.fatture) {
    ok(isNum(f.importo), `fattura ${f.id}: importo non numerico`);
    ok(isDate(f.emessa) && isDate(f.scadenza), `fattura ${f.id}: date non valide`);
    ok(Date.parse(f.emessa) <= Date.parse(f.scadenza), `fattura ${f.id}: emessa dopo la scadenza`);
  }
  for (const g of N.gare)
    ok(["aperta", "vinta", "persa"].includes(g.stato), `gara ${g.id}: stato «${g.stato}» sconosciuto`);
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
  for (const f of T.fronti) ok(["attivo", "sospeso"].includes(f.stato), `fronte ${f.id}: stato «${f.stato}» sconosciuto`);
  for (const r of T.rilievi) ok(["elaborato", "pianificato"].includes(r.stato), `rilievo ${r.id}: stato «${r.stato}» sconosciuto`);
  for (const p of T.piano) ok(["vigente", "in-esame"].includes(p.stato), `piano ${p.id}: stato «${p.stato}» sconosciuto`);
  // vetrina: almeno un rilievo elaborato è collegato a un fronte, così la
  // demo/tour mostra i m³ estratti per fronte (volumeFronte) invece di 0.
  ok(T.rilievi.some(r => r.stato === "elaborato" && r.fronteId && fro.has(r.fronteId)),
     "nessun rilievo demo collegato a un fronte: volumeFronte mostrerebbe 0 nella vetrina");
});

// La API demo (usata prima del go-live / in tour) deve fare CRUD in memoria E
// non crashare su una collezione non ancora presente in DEMO — hardening da
// revisione del data-layer (aggiorna/rimuovi con guardia `mem[n] || []`).
// L'import dinamico dell'SDK fallisce in Node → si cade in modalità demo.
const { scudoData } = await import(join(HERE, "../../scudo/scudo-data.js"));
const dapi = await scudoData();
const _before = (await dapi.lavoratori()).length;
const { id: _nid } = await dapi.aggiungi("lavoratori", { nome: "Test QA" });
await dapi.aggiorna("lavoratori", _nid, { ruolo: "Collaudo" });
const _upd = (await dapi.lavoratori()).find(l => l.id === _nid);
await dapi.rimuovi("lavoratori", _nid);
const _after = (await dapi.lavoratori()).length;
let _unseededOk = true, _unseededErr = "";
try { await dapi.aggiorna("collezione_mai_vista", "x", { a: 1 }); await dapi.rimuovi("collezione_mai_vista", "x"); }
catch (e) { _unseededOk = false; _unseededErr = e.message; }

test("demo api (scudo): CRUD in memoria + collezione nuova non crasha", () => {
  ok(dapi.mode === "demo", `senza backend deve cadere in demo (mode=${dapi.mode})`);
  ok(_before === _after, `il round-trip lascia il conteggio invariato (${_before}→${_after})`);
  ok(_upd && _upd.ruolo === "Collaudo", "aggiorna applica le modifiche in memoria");
  ok(_unseededOk, `aggiorna/rimuovi su una collezione nuova non deve lanciare: ${_unseededErr}`);
});

console.log(`\nRisultato Demo: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
