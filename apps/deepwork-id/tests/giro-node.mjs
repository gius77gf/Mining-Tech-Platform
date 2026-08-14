/* ⚠️ NON VA IN npm test: è il LANCIATORE del giro, non una prova. Messo in
   `test` chiamerebbe sé stesso.

   IL GIRO DI VERIFICA PRIMA DEL COMMIT, IN UN COMANDO SOLO
   ══════════════════════════════════════════════════════════════════════
   Perché esiste: il 01/08 la CI è caduta su `suite-collegate.mjs`, che
   pretende che ogni file `.mjs` in `tests/` o giri in CI o dichiari di
   essere una misura. Il file nuovo (`mostra.mjs`) non lo dichiarava — ed
   era giusto che il controllo lo prendesse. Quello che NON era giusto è
   **come** l'abbiamo saputo: il giro fatto a mano prima del commit ne
   lanciava undici su diciannove, scelte a memoria. Una lista tenuta a
   mente si accorcia da sola, e ogni volta che si accorcia il verde che
   stampa vale un po' meno.

   ⛔ E LA LISTA NON SI SCRIVE UNA SECONDA VOLTA. La verità è `scripts.test`
   di `package.json` — quella che gira in CI. Qui si LEGGE quella e si
   tolgono le quattro suite che hanno bisogno degli emulatori Firebase,
   dichiarate per nome con la ragione. Se domani qualcuno aggiunge una
   suite a `test`, entra qui **da sola**: è la differenza fra un elenco
   derivato e un elenco gemello, che è il difetto costato una giornata con
   la convenzione sui numeri.

   Uso:  node apps/deepwork-id/tests/giro-node.mjs
         node apps/deepwork-id/tests/giro-node.mjs --tz   (anche in ora italiana)

   ⚠️ `--tz` non è un vezzo: il contenitore è in UTC e le cave sono in
   Italia, e il 01/08 la suite intera rilanciata con l'orologio del cliente
   è caduta in due punti che in UTC erano verdi. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));

/* Le suite che NON possono girare qui, con la ragione accanto: vogliono gli
   emulatori Firebase (firebase-tools + Java), che in questo ambiente non
   partono. In CI girano, ed è lì che vanno lette. */
const SERVE_EMULATORE = [
  ["run.mjs",           "regole di sicurezza Firestore"],
  ["run-sdk.mjs",       "SDK identità contro il database vero"],
  ["run-fns.mjs",       "Cloud Functions"],
  ["run-bootstrap.mjs", "primo avvio di un'organizzazione"],
];

const script = JSON.parse(readFileSync(join(QUI, "package.json"), "utf8")).scripts.test;
const comandi = script.split("&&").map(c => c.trim()).filter(Boolean);

/* ⛔ Un'eccezione che non serve più è un'eccezione che nasconde: se una
   suite dichiarata qui non compare più in `test`, la riga va tolta —
   altrimenti un giorno copre un'esclusione che nessuno ha deciso. */
const orfane = SERVE_EMULATORE.filter(([f]) => !comandi.some(c => c.includes(f)));
if (orfane.length) {
  console.error(`⛔ ${orfane.length} suite dichiarate «servono l'emulatore» non sono più in npm test: `
    + orfane.map(([f]) => f).join(", ") + " — vanno tolte da SERVE_EMULATORE.");
  process.exit(2);
}

const daFare = comandi.filter(c => !SERVE_EMULATORE.some(([f]) => c.includes(f)));
const tz = process.argv.includes("--tz");

console.log(`\nGiro di verifica senza emulatori — ${daFare.length} suite su ${comandi.length}`);
console.log(`(fuori: ${SERVE_EMULATORE.map(([f, p]) => `${f} — ${p}`).join(" · ")})`);
console.log(tz ? "orologio: UTC e poi Europe/Rome\n" : "orologio: UTC (usa --tz per rifare tutto anche in ora italiana)\n");

const giri = tz ? [{}, { TZ: "Europe/Rome" }] : [{}];
const caduti = [];
/* ⏱️ QUANTE ASSERZIONI GIRANO IN TUTTO, MISURATE INVECE CHE DERIVATE.
   Fino al 09/08 questo numero i documenti se lo ricavavano a mano — «era 2.663
   l'08/08 e questa unità ha aggiunto un caso» — cioè la forma di scrittura che
   CLAUDE.md indica come quella che marcisce: un conto che si muove da solo va
   DERIVATO DA UN COMANDO, non ricopiato. Lo stampa il giro, che è l'unico che
   li lancia tutti.
   ⛔ E si stampa col suo DENOMINATORE: non tutti i comandi hanno una riga da
   sommare — le controprove stampano un verdetto, non un totale — e un numero
   senza il conto di chi non ha risposto si legge come se li avesse contati
   tutti. Quelli che non rispondono si NOMINANO, non si contano soltanto. */
const senzaTotale = [];
const perSuite = new Map();
let asserzioni = 0, conTotale = 0;
/* ⛔ E IL PRIMO RIGHELLO SBAGLIAVA, NELLA FAMIGLIA CHE QUESTO FILE CONOSCE GIÀ:
   cercava il primo «N passati» in tutta l'uscita, e `orologio-cliente.mjs`
   RILANCIA tre suite in ora italiana e ne STAMPA i riepiloghi. Quindi il conto
   si prendeva il «1984 passati» di `run-kpi` una seconda volta: 4741 invece di
   2757, gonfiato del 72% da un comando solo.
   È alla lettera la lezione scritta il giorno prima sul riepilogo del giro del
   browser — «una RIPETIZIONE contata come roba nuova» — ed è stata presa solo
   perché due righelli indipendenti davano numeri diversi. Un totale da solo
   non l'avrebbe mai detto.
   La forma che regge: si legge **l'ULTIMA riga**, cioè il verdetto che il
   comando dà DI SÉ. Le righe che un comando ripete di altri stanno in mezzo e
   non contano — per costruzione, non per un elenco di eccezioni. */
const contaAsserzioni = (out, c, primoGiro) => {
  if (!primoGiro) return;                       // con --tz gira tutto due volte: si conta un giro solo
  const ultima = String(out || "").trim().split("\n").filter((r) => r.trim()).pop() || "";
  const m = /(\d+) passati/.exec(ultima);
  if (m) {
    asserzioni += +m[1]; conTotale++;
    /* ⛔ e il totale si tiene anche PER SUITE: serve al controllo per addendo
       qui sotto. Il comando può avere dei flag (`classi-orfane --controprova`),
       quindi la chiave è il solo nome del file. */
    const nomeFile = (/([\w-]+\.mjs)/.exec(c) || [])[1];
    /* ⛔ NON si SOMMA: si tiene la PRIMA passata. Alcuni file compaiono due
       volte con flag diversi (la passata sana e la controprova, o due giri
       dello stesso banco), e sommarli gonfia l'addendo — è la «ripetizione
       contata come roba nuova» che questo stesso file racconta per il 4741 di
       `orologio-cliente`. Misurato subito: `fogli-guardati.mjs` dava 10
       sommando (3 + 7) contro i 3 che il documento dichiara, e il 3 è giusto. */
    if (nomeFile && primoGiro && !perSuite.has(nomeFile)) perSuite.set(nomeFile, +m[1]);
  }
  else senzaTotale.push(c.replace(/^node\s+/, ""));   // col flag: `classi-orfane --controprova` non è `classi-orfane`
};
for (const env of giri) {
  const dove = env.TZ || "UTC";
  const primoGiro = env === giri[0];
  for (const c of daFare) {
    try {
      const out = execSync(c, { cwd: QUI, encoding: "utf8", env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
      const ultima = out.trim().split("\n").filter(r => r.trim()).pop() || "(nessuna riga)";
      console.log(`  ✓ [${dove}] ${ultima}`);
      contaAsserzioni(out, c, primoGiro);
    } catch (e) {
      caduti.push(`[${dove}] ${c}`);
      const testo = ((e.stdout || "") + (e.stderr || "")).split("\n").filter(r => r.includes("✗")).slice(0, 6);
      console.error(`  ✗ [${dove}] ${c}`);
      for (const r of testo) console.error(`      ${r.trim()}`);
      contaAsserzioni((e.stdout || "") + (e.stderr || ""), c, primoGiro);
    }
  }
}

console.log(`\nAsserzioni eseguite dal giro: ${asserzioni}`
  + `  ·  ${conTotale} comandi su ${daFare.length} hanno una riga da sommare`);
if (senzaTotale.length) {
  console.log(`   ⚠️  ${senzaTotale.length} NON contati, perché stampano un verdetto invece di un totale: ${senzaTotale.join(", ")}`);
  console.log("      Non vuol dire «non hanno provato niente»: vuol dire che questo conto non li vede.");
}
console.log("   ⚠️  E non è il numero da citare come «prove»: qui dentro ci sono suite che contano FILE"
  + " (una asserzione per file), che crescono da sole quando nasce un file, e ci sono le CONTROPROVE, che sono"
  + " asserzioni vere ma su un difetto messo apposta. Quello da citare è il totale delle otto"
  + " suite che contano casi, sorvegliato da numeri-nei-documenti.mjs.");
console.log("   ⚠️  Le suite che `orologio-cliente` rilancia in ora italiana NON sono contate due volte:"
  + " di ogni comando si legge solo l'ultima riga, cioè il verdetto che dà di sé.");

/* ── e il numero che il giro stampa dev'essere quello scritto nei documenti ──
   ⛔ ENTRATA IL 09/08 SU UN NUMERO CHE ERA STALE DI CINQUANTOTTO. I documenti
   del fondatore dicevano «il giro completo esegue **2.757** asserzioni su
   **34** comandi» e il giro ne eseguiva **2.815**. E la cosa che fa male è che
   `STATO_PRODOTTO.md`, due righe sotto, spiegava già la cura: *«un conto che si
   muove da solo va derivato da un comando, non ricopiato»* — poi il conto è
   stato ricopiato lo stesso, perché **il comando che lo produce non guardava il
   documento**.
   ⚠️ Perché la sorveglianza sta QUI e non in `numeri-nei-documenti.mjs`: quel
   numero lo sa solo chi ha appena lanciato tutto. Metterlo là vorrebbe dire far
   rilanciare il giro dentro il giro — minuti, per un confronto che qui costa
   una lettura di file. **Un dato si sorveglia dove nasce.**
   ⚠️ E non fa cadere il giro se il documento non ha la frase: la frase può
   essere riscritta, e un controllo che pretende una forma esatta di prosa
   diventa un ostacolo invece che una difesa. Se manca lo **dichiara**, che è la
   riga da leggere per prima. */
/* Dove i documenti scrivono la somma per addendi. La regex prende la CATENA,
   non i singoli numeri: così se qualcuno la riscrive in un'altra forma il
   controllo lo dice invece di leggerne una parte. */
const ADDENDI_NEI_DOCUMENTI = [
  ["docs/DEVELOPMENT.md", /non a memoria — al [\d/]+: (\d[\d\s+.]*\d)\)/],
];

const NUMERI_DEL_GIRO = [
  ["docs/DEVELOPMENT.md", /`node` completo esegue \*\*([\d.]+)\*\* asserzioni su \*\*(\d+)\*\* comandi/],
  ["docs/STATO_PRODOTTO.md", /il giro completo ne esegue \*\*([\d.]+)\*\*/],
];
let numeriStorti = false;
{ /* ⚠️ e NON si salta con `--tz`: il primo abbozzo lo faceva («con due giri si
     guarda una volta sola»), ma `asserzioni` è GIÀ di un giro solo — lo
     garantisce `contaAsserzioni`, che ignora le passate dopo la prima. Saltarlo
     avrebbe reso `giro-node --tz` cieco proprio sul controllo appena scritto,
     ed è la forma in miniatura del «controllo che non guarda dove crede». */
  const radice = join(QUI, "..", "..", "..");
  const storte = [], senzaFrase = [];
  for (const [rel, regola] of NUMERI_DEL_GIRO) {
    let testo = "";
    try { testo = readFileSync(join(radice, rel), "utf8"); } catch { senzaFrase.push(`${rel} (non si legge)`); continue; }
    const m = regola.exec(testo);
    if (!m) { senzaFrase.push(rel); continue; }
    const dichiarato = +m[1].replace(/\./g, "");
    if (dichiarato !== asserzioni) storte.push(`${rel} dice ${m[1]} asserzioni, il giro ne ha eseguite ${asserzioni}`);
    if (m[2] && +m[2] !== daFare.length) storte.push(`${rel} dice ${m[2]} comandi, il giro ne ha lanciati ${daFare.length}`);
  }
  /* ⛔ E ADESSO GLI ADDENDI, UNO PER UNO — nato da un errore fatto il 14/08.
     Nei documenti era scritto «2226 + 318 + 75 + …» dove il vero era
     «2223 + 321 + …»: **due addendi sbagliati che si cancellavano**, quindi la
     somma tornava, il totale era giusto e ogni controllo diceva ✓. È alla
     lettera il caso «coerente ma falsa» che `numeri-nei-documenti.mjs` descrive
     nel suo commento — e che lì non si può prendere, perché quel file non
     lancia le suite: il conto statico delle prove non funziona (si generano
     dentro i cicli — 2.122 statiche contro 2.229 vere), e allargare la regex
     sarebbe la strada sbagliata, come è già scritto.
     Quindi il controllo va **dove i numeri nascono**: qui, che è l'unico posto
     che le ha lanciate tutte e ha il totale di ognuna.
     ⚠️ L'elenco delle otto suite **non si riscrive**: si legge da
     `numeri-nei-documenti.mjs`, che già ce l'ha e nello stesso ordine in cui i
     documenti scrivono la somma. Elenco **derivato, non gemello** — se un
     giorno le suite diventano nove, questo controllo lo sa da sé. */
  const ADDENDI = sorveglianzaAddendi();
  function sorveglianzaAddendi() {
    let fonte = "";
    try { fonte = readFileSync(join(QUI, "numeri-nei-documenti.mjs"), "utf8"); } catch { return null; }
    const m = /const SUITE = \[([^\]]+)\]/.exec(fonte);
    if (!m) return null;
    return [...m[1].matchAll(/"([\w-]+\.mjs)"/g)].map(x => x[1]);
  }
  if (!ADDENDI) {
    console.log("   ⚠️  non ho potuto leggere l'elenco delle otto suite da numeri-nei-documenti.mjs:"
      + " gli ADDENDI non sono sorvegliati (e questo NON vuol dire che siano giusti)");
  } else {
    const veri = ADDENDI.map(f => perSuite.get(f));
    const mancanti = ADDENDI.filter((f, i) => veri[i] == null);
    if (mancanti.length) {
      console.log(`   ⚠️  di ${mancanti.join(", ")} non ho un totale: gli addendi NON sono sorvegliati`);
    } else {
      for (const [rel, regola] of ADDENDI_NEI_DOCUMENTI) {
        let testo = "";
        try { testo = readFileSync(join(radice, rel), "utf8"); } catch { continue; }
        const m = regola.exec(testo);
        if (!m) { console.log(`   ⚠️  in ${rel} non trovo la somma scritta: gli addendi lì NON sono sorvegliati`); continue; }
        const scritti = m[1].split("+").map(x => +x.trim().replace(/\./g, ""));
        if (scritti.length !== veri.length) {
          storte.push(`${rel}: la somma scritta ha ${scritti.length} addendi, le suite sono ${veri.length}`);
          continue;
        }
        scritti.forEach((n, i) => {
          if (n !== veri[i]) storte.push(`${rel}: l'addendo ${i + 1} (${ADDENDI[i]}) dice ${n}, la suite ne ha eseguite ${veri[i]}`);
        });
      }
      console.log(`   ✓ addendi verificati uno per uno contro la loro suite: ${veri.join(" + ")}`);
    }
  }

  if (senzaFrase.length)
    console.log(`   ⚠️  la frase col totale non si trova in: ${senzaFrase.join(", ")} — non è un guasto, `
      + "ma finché non la trovo quel documento NON è sorvegliato da qui");
  if (storte.length) {
    console.error("\n⛔ I DOCUMENTI DICHIARANO UN ALTRO NUMERO — e questo lo sa solo chi ha appena lanciato tutto:");
    for (const r of storte) console.error("   · " + r);
    console.error("   Si corregge il documento, non il giro. Il numero da scrivere è quello stampato qui sopra.");
    numeriStorti = true;   /* NON in `caduti`: non è un comando, e gonfiarlo lì
                              farebbe dire «33 comandi a posto» su 34 lanciati e
                              tutti verdi — un numero che mente per dire il vero */
  } else if (!senzaFrase.length) {
    console.log(`   ✓ e i ${NUMERI_DEL_GIRO.length} documenti che lo dichiarano dicono lo stesso numero.`);
  }
}

console.log(`\nGiro senza emulatori: ${daFare.length * giri.length - caduti.length} comandi a posto, ${caduti.length} caduti`
  + (numeriStorti ? "  ·  ⛔ ma i numeri scritti nei documenti NON tornano (qui sopra)" : ""));
if (caduti.length) console.error("  caduti: " + caduti.join(" · "));
process.exit(caduti.length || numeriStorti ? 1 : 0);
