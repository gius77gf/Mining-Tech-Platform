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
const { dataISOEsiste } = await import(join(HERE, "../../../shared/deepwork-id-client/dw-shell.js"));
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
/* ⚠️ QUESTA REGOLA ERA SCRITTA UNA SECONDA VOLTA, E PIÙ DEBOLE. La versione di
   casa era `/^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(…))`, e
   accettava «2026-02-30»: `Date.parse` non rifiuta un giorno che non esiste, lo
   fa SCORRERE al 2 marzo. Una data d'esempio impossibile sarebbe passata per
   buona, diventando un altro giorno in silenzio.
   La versione giusta è in `shared/` da mesi — `dataISOEsiste`, che ricostruisce
   la data e la confronta con quella scritta — e la usano già le app. Qui si
   importa: un alias non è una seconda implementazione. */
const isDate = (s) => dataISOEsiste(s);
/* ⛔ ASSENTE E CORROTTO NON SONO LA STESSA COSA, e confonderli ha un costo che
   si è visto il 01/08: `run-demo` pretendeva che ogni fattura d'esempio avesse
   emissione e scadenza valide, quindi la dimostrazione NON POTEVA contenere una
   fattura senza data — cioè proprio il caso per cui era appena stata costruita
   una difesa (senza scadenza non è «Regolare», e senza emissione non entra
   nella media del credito come zero giorni). Il divieto rendeva invisibile la
   parte migliore del prodotto, che è lo stesso difetto già trovato con la
   chiusura del mese: la dimostrazione più povera della realtà proprio dove il
   prodotto è più forte.
   Quello che `run-demo` deve impedire è un dato CORROTTO — «2026-13-45», un
   numero al posto di una data, un refuso che fa crashare un badge. Un campo
   ASSENTE non è un refuso: è uno stato che il prodotto sa raccontare, e
   metterlo nella dimostrazione è un modo di mostrarlo.
   ⚠️ Il permesso è stretto apposta: assente vuol dire `null`, `undefined` o
   stringa vuota. Qualunque altra cosa deve restare una data valida. */
const assente = (v) => v == null || v === "";
const dataAssenteOValida = (v) => assente(v) || isDate(v);
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
    /* ⛔ `lavoratoreId: null` NON È UN DATO CORROTTO: è la SCADENZA AZIENDALE,
       che l'app ha sempre saputo fare — il form ha l'opzione «— azienda —»,
       l'import CSV la produce quando il nome non è in anagrafica, l'elenco la
       disegna «azienda» e la modale che toglie una persona PROMETTE che le sue
       scadenze restino «come scadenze aziendali». Questa riga la vietava,
       quindi la dimostrazione non poteva contenere né una scadenza d'azienda
       né il ramo AZIENDA del CSV, ed è la stessa correzione già fatta il 01/08
       per la fattura senza scadenza: un campo assente è uno stato che il
       prodotto sa raccontare, quello che va impedito è un id che non trova
       niente. Il caso è arrivato con le verifiche periodiche delle
       attrezzature (art. 71 c.11): un'autogru non è di nessuno in
       particolare. */
    ok(s.lavoratoreId == null || lav.has(s.lavoratoreId),
      `scadenza ${s.id}: lavoratoreId ${s.lavoratoreId} non è né vuoto (scadenza aziendale) né un lavoratore esistente`);
    ok(isDate(s.dataScadenza), `scadenza ${s.id}: data non valida ${s.dataScadenza}`);
  }
  idsOk(S.infortuni, "infortuni");
  for (const x of S.infortuni) {
    ok(isDate(x.data), `infortunio ${x.id}: data non valida ${x.data}`);
    ok(["infortunio", "near-miss"].includes(x.tipo), `infortunio ${x.id}: tipo «${x.tipo}» sconosciuto`);
    /* ⚠️ IL DATO CORROTTO NON È IL DATO ASSENTE, ed è la stessa correzione già
       fatta il 01/08 per la fattura senza scadenza. Questa riga pretendeva un
       numero, quindi la dimostrazione NON POTEVA contenere l'infortunio a
       prognosi ancora aperta — cioè proprio il caso per cui la decisione 17 del
       fondatore (02/08) è stata presa: `giorniAssenza: null` vuol dire «non si
       sanno ancora», ed è uno stato che il prodotto sa raccontare.
       Quello che va impedito resta: un «tre giorni» scritto a parole, o un
       numero negativo. Un near-miss invece i giorni li ha sempre, e valgono
       zero — per lui la colonna vuota è una risposta. */
    const prognosiAperta = x.tipo === "infortunio" && x.giorniAssenza === null;
    ok(prognosiAperta || (isNum(x.giorniAssenza) && x.giorniAssenza >= 0),
      `infortunio ${x.id}: giorniAssenza «${x.giorniAssenza}» non è né un numero né una prognosi aperta`);
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
  /* Un tagliando può essere programmato in due modi, e sono alternativi: a
     calendario (ha una data) oppure a ore del contatore (ha le ore, e la data
     non esiste finché non è dovuto). Quello che NON deve mai succedere è che
     non abbia né l'una né le altre: sarebbe un intervento invisibile in
     entrambe le viste. Se la data c'è dev'essere una data vera. */
  for (const n of F.manutenzioni) {
    const aData = n.dataPrevista != null, aOre = isNum(n.orePreviste);
    ok(aData || aOre, `manutenzione ${n.id}: né data né ore previste — non comparirebbe da nessuna parte`);
    ok(!aData || isDate(n.dataPrevista), `manutenzione ${n.id}: data ${n.dataPrevista} non valida`);
  }
  for (const c of F.costi) ok(isNum(c.importo), `costo ${c.id}: importo non numerico`);
  // il budget dell'anno (05/09): anno intero, importo positivo, voce testo (vuota = tutta la flotta)
  idsOk(F.budget, "budget");
  for (const b of F.budget) { ok(Number.isInteger(b.anno) && b.anno > 2000, `budget ${b.id}: anno non valido`); ok(isNum(b.importo) && b.importo > 0, `budget ${b.id}: importo non positivo`); ok(typeof b.voce === "string", `budget ${b.id}: voce non testo`); }
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
    ok(dataAssenteOValida(f.emessa) && dataAssenteOValida(f.scadenza),
      `fattura ${f.id}: una data c'è ma non si legge (emessa «${f.emessa}», scadenza «${f.scadenza}»)`);
    // il confronto ha senso solo con tutt'e due: con una sola non c'è ordine da
    // violare — e pretenderlo qui rimetterebbe dalla finestra il divieto tolto
    ok(assente(f.emessa) || assente(f.scadenza)
      || Date.parse(f.emessa) <= Date.parse(f.scadenza), `fattura ${f.id}: emessa dopo la scadenza`);
  }
  for (const g of N.gare)
    ok(["aperta", "vinta", "persa"].includes(g.stato), `gara ${g.id}: stato «${g.stato}» sconosciuto`);
});

/* ⚠️ LA CONTROPROVA DEL PERMESSO APPENA DATO. Allargare una regola è il modo
   più facile di spegnerla senza accorgersene: da qui in avanti «assente va
   bene» potrebbe voler dire «qualunque cosa va bene». Quindi si pretende che
   la distinzione regga in tutt'e due i versi, e si contano i casi provati. */
test("conti: la data ASSENTE è permessa, la data CORROTTA no", () => {
  // assente in tutte le forme che i moduli producono davvero, più una data vera
  // ⚠️ «2026-07-01T00:00» sta fra gli ACCETTATI, e non è una svista: la prova
  // l'aveva messo fra i corrotti e ha accusato il codice. `dataISOEsiste`
  // taglia a dieci caratteri di proposito, perché in archivio ci sono istanti
  // interi (`registratoIl`) e un istante valido non è una data rotta. Corretta
  // la prova, non la funzione.
  const passano = [null, undefined, "", "2026-07-01", "2024-02-29",   // 2024 è bisestile
                   "2026-07-01T00:00"];
  // corrotto: il giorno che NON ESISTE (`Date.parse` lo farebbe scorrere al 2
  // marzo), il mese impossibile, il formato italiano, il testo, lo zero
  // mancante, il numero, e lo spazio — che non è «vuoto»
  const cadono = ["2026-02-30", "2026-13-45", "01/07/2026", "domani",
                  "2026-7-1", 20260701, " "];
  for (const v of passano)
    ok(dataAssenteOValida(v), `«${v}» doveva essere accettata (assente, o data che esiste)`);
  for (const v of cadono)
    ok(!dataAssenteOValida(v), `«${v}» doveva essere RIFIUTATA: una data che c'è deve leggersi`);
  ok(passano.length === 6 && cadono.length === 7,
    `casi provati: ${passano.length} accettati e ${cadono.length} rifiutati — se questi numeri`
    + " scendono, la controprova sta guardando meno di quel che dice");
});

test("sentinella: id unici, valore/soglia numerici, date adempimenti", () => {
  idsOk(E.monitoraggi, "monitoraggi"); idsOk(E.adempimenti, "adempimenti"); idsOk(E.registri, "registri");
  /* ⛔ ASSENTE NON È CORROTTO — TERZA VOLTA, e stavolta è stata cercata invece
     che subita. Questa riga pretendeva `isNum(m.soglia) && m.soglia > 0` su
     OGNI punto, quindi la dimostrazione **non poteva contenere** il caso della
     decisione 16 del fondatore — il punto senza soglia, quello su cui l'app
     fino al 02/08 scriveva «Conforme» nel report che va all'ente.
     Le altre due volte erano la fattura senza scadenza e la volata senza
     numeri: tre app, tre autori, la stessa forma. La regola per riconoscerla è
     scritta in `docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md`: se una prova
     d'integrità pretende che un campo ci sia SEMPRE, va riletta chiedendosi se
     sta vietando un'**assenza** invece di una **corruzione**.
     Quello che resta vietato è il valore corrotto, e la soglia ne ha due
     forme: `"abc"` e i numeri **non positivi** — su una soglia `-3` il
     rapporto usciva 120.000%, misurato dal cantiere della decisione 16. */
  for (const m of E.monitoraggi) {
    ok(isNum(m.valore), `monitoraggio ${m.id}: valore`);
    const senzaSoglia = m.soglia === null || m.soglia === undefined;
    ok(senzaSoglia || (isNum(m.soglia) && m.soglia > 0),
      `monitoraggio ${m.id}: la soglia o non c'è, o è un numero positivo (letto ${JSON.stringify(m.soglia)})`);
  }
  ok(E.monitoraggi.some((m) => m.soglia === null || m.soglia === undefined),
    "la dimostrazione deve CONTENERE un punto senza soglia: è il caso della decisione 16,"
    + " e una difesa che non si vede in vetrina non la guarda nessuno");
  for (const a of E.adempimenti) ok(isDate(a.scadenza), `adempimento ${a.id}: data ${a.scadenza}`);
  idsOk(E.volate, "volate");
  for (const v of E.volate) {
    ok(isDate(v.data), `volata ${v.id}: data non valida ${v.data}`);
    /* ⛔ ASSENTE NON È CORROTTO, anche qui. Questa riga pretendeva che ogni
       volata avesse tutti i numeri — quindi la dimostrazione NON POTEVA
       contenere il caso per cui la difesa esiste: la volata che non dichiara
       la distanza del ricettore, su cui il report per l'ente scriveva
       «distanza 0 m». È lo stesso difetto già corretto per le fatture senza
       scadenza, in un'altra app e con un altro autore. Quello che va
       impedito resta il numero che C'È e non si legge («abc», `NaN`): un
       campo assente è uno stato che il prodotto sa raccontare. */
    for (const [ch, val] of [["kgTotali", v.kgTotali], ["kgMaxRitardo", v.kgMaxRitardo],
                             ["distanzaRicettore", v.distanzaRicettore]])
      ok(val == null || isNum(val), `volata ${v.id}: ${ch} c'è ma non è un numero («${val}»)`);
    ok(["regolare", "contestazione"].includes(v.esito), `volata ${v.id}: esito «${v.esito}» sconosciuto`);
  }
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
