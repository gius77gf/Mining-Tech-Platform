/* ⛔ LA PROVA DEL GENERATORE — perché un generatore rotto non si vede.
   ══════════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE, e la ragione è di ieri sera. Il 14/08 `cava-sintetica.mjs` è
   rimasto **rotto sul disco per una ventina di minuti**: chiamava
   `densitaDelMateriale(MATERIALE)` con tutti e due i nomi **liberi** — nessun
   import, nessuna dichiarazione — e `generaCava` sollevava `ReferenceError` a
   ogni chiamata, per qualunque taglia. Errore **duro**, e nessun controllo
   l'ha visto: `nomi-liberi.mjs` dichiara di non guardare la cartella `tests/`.
   L'ha trovato un cantiere che stava provando a usarlo, e ha dovuto pinnarsi
   una copia di `HEAD` per tirare avanti.
   ⚠️ Un generatore è peggio di una suite quando si rompe: le suite falliscono
   e si vedono, un generatore rotto fa **fermare il lavoro di chi lo usa** e
   sembra un problema loro.

   ⛔ E NON PROVA CHE LA CAVA SIA REALISTICA — quello non lo può dire nessuna
   prova, perché metà dei parametri è `[dedotto]`. Prova le cose che il
   generatore PROMETTE di sé: che parta, che le copie fra app siano lo stesso
   oggetto, che i casi rari escano con ogni seme, e che la produzione generata
   sia quella dichiarata. Sono le quattro promesse su cui si appoggia chi lo
   usa per accusare il prodotto: se una cade, le accuse non valgono.          */

import { generaCava, TAGLIE, PARAMETRI } from "./cava-sintetica.mjs";

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log("  ✓ " + nome); }
  catch (e) { failed++; console.log("  ✗ " + nome + ": " + e.message); }
};
const ok = (c, m) => { if (!c) throw new Error(m); };

console.log("\n— La cava sintetica: le quattro promesse del generatore —");

test("parte su tutte e tre le taglie, per 1, 12 e 24 mesi", () => {
  for (const taglia of Object.keys(TAGLIE)) {
    for (const mesi of [1, 12, 24]) {
      const c = generaCava({ mesi, seme: 7, taglia });
      ok(c && c.campo && c.terra && c.scudo && c.sentinella && c.conti && c.flotta,
        `${taglia}/${mesi}: mancano delle app`);
      ok(c.meta.simulazione === true, "i dati devono dichiararsi simulati");
    }
  }
});

/* ⛔ È l'invariante per cui il generatore esiste: nella dimostrazione le copie
   fra app erano array scritti a mano e avevano preso a divergere (8 righe su 9
   con lo stesso id su persone diverse). Qui sono LO STESSO OGGETTO, e questa
   prova pretende l'identità — non l'uguaglianza: due copie uguali oggi
   divergono domani senza che nessuno lo veda. */
test("le copie fra app sono lo STESSO oggetto, non una seconda scrittura", () => {
  const c = generaCava({ mesi: 24, seme: 7 });
  const coppie = [
    ["campo.scadenzeScudo", c.campo.scadenzeScudo, "scudo.scadenze", c.scudo.scadenze],
    ["campo.lavoratoriScudo", c.campo.lavoratoriScudo, "scudo.lavoratori", c.scudo.lavoratori],
    ["campo.infortuniScudo", c.campo.infortuniScudo, "scudo.infortuni", c.scudo.infortuni],
    ["terra.rapportiniCampo", c.terra.rapportiniCampo, "campo.rapportini", c.campo.rapportini],
    ["conti.rilieviTerra", c.conti.rilieviTerra, "terra.rilievi", c.terra.rilievi],
    ["campo.frontiTerra", c.campo.frontiTerra, "terra.fronti", c.terra.fronti],
  ];
  for (const [na, a, nb, b] of coppie) ok(a === b, `${na} non è ${nb}`);
});

/* ⛔ Tre volte in un file solo un caso raro è uscito ZERO con qualche seme —
   `personeSenzaScadenze`, `infortuniVeri`, `rilieviDaCumulo` — e ogni volta
   voleva dire che una difesa del prodotto non veniva esercitata mentre il giro
   diceva «tutto a posto». La probabilità non è una promessa: questa prova
   pretende che ogni caso esca con OGNI seme. */
test("ogni caso voluto esce con ogni seme (la probabilità non è una promessa)", () => {
  const min = {};
  for (const seme of [1, 2, 3, 5, 7, 11, 13, 17, 19, 23]) {
    const c = generaCava({ mesi: 24, seme });
    ok(c.meta.maiProdotti.length === 0,
      `seme ${seme}: casi mai prodotti — ${c.meta.maiProdotti.join(", ")}`);
    for (const [k, n] of Object.entries(c.meta.casiVoluti)) {
      min[k] = min[k] === undefined ? n : Math.min(min[k], n);
    }
  }
  for (const [k, n] of Object.entries(min)) ok(n >= 1, `${k} scende a ${n} su qualche seme`);
});

/* La cava deve produrre quello che dichiara di produrre. Lo scarto ammesso non
   è zero e non è arbitrario: è la quota di turni che il generatore lascia
   apposta SENZA quantità registrata (roccia uscita che nessuno ha scritto),
   più il caso. Un simulatore che sbaglia il totale in modo sistematico fa
   sembrare un difetto del prodotto uno scarto che è suo — successo il 14/08
   con la stagionalità non normalizzata, -9% su tutte e tre le taglie. */
test("la produzione generata è quella dichiarata, entro la quota non registrata", () => {
  const ammesso = PARAMETRI.quotaSenzaMisura.v + 0.05;
  for (const taglia of Object.keys(TAGLIE)) {
    const c = generaCava({ mesi: 12, seme: 7, taglia });
    const prodotto = c.campo.rapportini.reduce((s, r) => s + (r.prodQta || 0), 0);
    const atteso = TAGLIE[taglia].produzioneAnnuaT;
    const scarto = Math.abs(prodotto - atteso) / atteso;
    ok(scarto <= ammesso,
      `${taglia}: dichiarata ${atteso} t, generata ${prodotto} t (${(scarto * 100).toFixed(1)}%, ammesso ${(ammesso * 100).toFixed(0)}%)`);
  }
});

/* ⚠️ Una taglia sconosciuta deve FERMARE, non ripiegare sulla media: un
   generatore che ripiega in silenzio produce una cava diversa da quella
   chiesta, e chi legge i risultati non lo sa. */
test("una taglia sconosciuta ferma la generazione invece di ripiegare", () => {
  let fermato = false;
  try { generaCava({ taglia: "gigante" }); } catch { fermato = true; }
  ok(fermato, "ha generato lo stesso");
});

console.log(`\nRisultato cava sintetica: ${passed} passati, ${failed} falliti`);
if (failed) process.exit(1);
