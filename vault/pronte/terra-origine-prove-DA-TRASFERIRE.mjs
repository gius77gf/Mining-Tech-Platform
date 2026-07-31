import * as O from "./origine.mjs";
let ok = 0, ko = 0;
const test = (n, f) => { try { f(); ok++; console.log(`  ✓ ${n}`); } catch (e) { ko++; console.log(`  ✗ ${n}: ${e.message}`); } };
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: atteso ${JSON.stringify(b)}, ottenuto ${JSON.stringify(a)}`); };
const vero = (c, m) => { if (!c) throw new Error(m); };

const PIENO = { origine: { da: "visore", file: "cava.las", quandoVisore: "2026-07-15T09:12",
  puntiTotali: 4812331, puntiRitaglio: 218004, cella: 0.5, quotaBase: 340.42, areaCoperta: 729,
  ritaglio: { x0: 10, x1: 70, y0: 5, y1: 65, z0: 338, z1: 352 }, georeferenziato: true } };

console.log("\n──── la provenienza del volume ────");

/* ⛔ LA PROVA CHE LA SCHEDA INDICA COME PRIMA */
test("senza origine la frase NON sembra una misura, e lo dice", () => {
  const f = O.descriviOrigine({ volumeM3: 1000 });
  vero(/non è registrata|non risultano/.test(f), "deve dire che non si sa");
  vero(/non è riproducibile/.test(f), "e che il numero non è rifacibile");
  /* l'asserzione giusta non è «non nominare i parametri» — la frase LI NOMINA,
     per dire che non ci sono, ed è esattamente quello che deve fare. È «non
     mostrare NUMERI»: un valore scritto lì dentro sarebbe una misura inventata,
     ed è l'unica cosa che rende una frase d'assenza pericolosa. */
  vero(!/\d/.test(f), "e NON deve contenere nessuna cifra: " + f.slice(0, 90));
});
test("origineDi: assente, malformata o con un `da` inventato ricade su «non registrata»", () => {
  for (const r of [null, {}, { origine: null }, { origine: "visore" }, { origine: { da: "boh" } }])
    eq(O.origineDi(r).noto, false, "su " + JSON.stringify(r));
  eq(O.origineDi(PIENO).noto, true, "e con un'origine vera è nota");
  eq(O.origineDi(PIENO).da, "visore", "col suo `da`");
});
test("dal visore: la frase porta i parametri che rendono il numero rifacibile", () => {
  const f = O.descriviOrigine(PIENO);
  for (const atteso of ["griglia", "0,50 m", "340,42 m", "729 m²", "218.004", "4.812.331", "cava.las", "15/07/2026"])
    vero(f.includes(atteso), `manca «${atteso}» in: ${f.slice(0, 200)}`);
  vero(/X da 10,00 a 70,00/.test(f), "e il ritaglio");
  vero(!/Non risulta registrato/.test(f), "e non dichiara mancanze che non ci sono");
});
test("⛔ dal visore ma a metà: quello che manca viene DICHIARATO, non saltato", () => {
  const f = O.descriviOrigine({ origine: { da: "visore", cella: 0.5, puntiRitaglio: 100 } });
  vero(/0,50 m/.test(f), "dice quello che sa");
  vero(/Non risulta registrato/.test(f), "e dichiara quello che non sa");
  vero(/quota di base/.test(f) && /ritaglio/.test(f), "nominando che cosa manca: " + f.slice(-140));
});
test("la nuvola non georeferenziata è un avviso, non un dettaglio", () => {
  const f = O.descriviOrigine({ origine: { ...PIENO.origine, georeferenziato: false } });
  vero(/NON è georeferenziata/.test(f), "lo deve dire");
  vero(/non in metri cubi/.test(f), "e dire che cosa significa per il numero");
});
test("manuale e csv non fingono di essere un calcolo", () => {
  vero(/inserito a mano/.test(O.descriviOrigine({ origine: { da: "manuale" } })), "manuale");
  const c = O.descriviOrigine({ origine: { da: "csv", file: "volumi.csv" } });
  vero(/fuori da questa applicazione/.test(c) && /volumi\.csv/.test(c), "csv: " + c);
});
test("i numeri sono scritti all'italiana e col raggruppamento dichiarato", () => {
  const f = O.descriviOrigine(PIENO);
  vero(/218\.004/.test(f), "le migliaia col punto");
  vero(/0,50/.test(f), "i decimali con la virgola");
  vero(!/218004/.test(f), "e mai la cifra secca");
});
console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);
