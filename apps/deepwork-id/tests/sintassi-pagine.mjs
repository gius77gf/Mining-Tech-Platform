/* ⛔ LE PAGINE SI COMPILANO? — e perché questa suite è nata tardi, il 02/08.
   Il controllo esiste **in CI** da settimane (il passo «JS syntax checks» del
   workflow) e non esisteva **in casa**: il giro `node` prima del commit non
   apriva nessuna pagina. Risultato, quel giorno: `apps/sentinella/index.html`
   è stato committato con dentro

       + (daLeggere ? ` · ${daLeggere} senza una lettura` : "")
       ${ ...un commento... }                    ← FUORI da ogni template
       + (daSistemare ? ...)

   (scritto così, senza i delimitatori veri: la prima versione di questo
   commento li conteneva davvero e chiudeva il commento a metà — la stessa
   famiglia del difetto che il file esiste per prendere, fatta scrivendolo)

   cioè un `${...}` in mezzo a una catena di `+`. Tutte le suite `node` erano
   verdi — nessuna importa le pagine — le prove erano 1.901, la copertura
   602/602, e la verifica sulla copia diceva quello che dice sempre. La pagina
   di Sentinella, aperta, sarebbe morta prima di disegnare qualcosa.
   È la terza volta che questa famiglia di difetti passa: `import { daCampo }`
   senza il modulo (Scudo rotta per cinque commit), il `<script>` dimenticato,
   e adesso questo. Il costo di scoprirlo dalla CI invece che qui sono i minuti
   di attesa più un commit rosso nella storia.

   ⚠️ LA REGOLA GENERALE, che vale oltre a questo file: **un controllo che gira
   solo in CI è un controllo che si scopre dopo il push.** Se la CI sa fare una
   cosa in tre secondi, quella cosa deve stare anche nel giro di casa — se no
   la verifica «sulla copia di quello che si committa» resta verde su un commit
   rosso, che è il modo peggiore di sbagliare.

   Il controllo è **lo stesso** della CI, di proposito e non per somiglianza:
   estrae i blocchi `<script>` e li dà a `node --check`. I blocchi troppo corti
   e quelli che iniziano per `{` (importmap, manifest JSON) restano fuori,
   esattamente come là.

   Si lancia con: node apps/deepwork-id/tests/sintassi-pagine.mjs */

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const CONTROPROVA = process.argv.includes("--controprova");

/* Le pagine: il core alla radice, la vetrina, e tutte quelle delle app.
   ⚠️ L'elenco è **derivato**, non scritto a mano: un'app nuova entra da sola.
   Una lista a memoria si accorcia, e ogni volta che si accorcia il verde vale
   un po' meno. */
function pagine() {
  const out = [];
  for (const p of ["index.html", "apps/index.html"]) if (existsSync(join(RADICE, p))) out.push(p);
  const appDir = join(RADICE, "apps");
  for (const app of readdirSync(appDir, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    for (const f of readdirSync(join(appDir, app.name))) {
      if (f.endsWith(".html")) out.push(`apps/${app.name}/${f}`);
    }
  }
  return [...new Set(out)].sort();
}

function blocchi(html) {
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1].trim())
    .filter((b) => b.length >= 50 && !b.startsWith("{"));
}

function compila(codice) {
  const r = spawnSync(process.execPath, ["--input-type=module", "--check"], { input: codice });
  return r.status === 0 ? null : String(r.stderr).split("\n").slice(0, 4).join(" ").trim();
}

/* ⛔ E I MODULI A SÉ STANTI, aggiunti l'08/08 — e la ragione è la stessa
   regola che ha fatto nascere questo file, trovata violata un'altra volta.
   La CI compila anche i file che **non stanno dentro una pagina**: i service
   worker, le funzioni di Firebase, i moduli condivisi. Il giro di casa no.
   Misurato invece che supposto: rotto `sw.js` con un `const rotto = ;` su una
   copia staccata, il giro `node` intero ha risposto **23 comandi, 0 caduti,
   uscita 0**. Cioè un errore di sintassi **duro** nel service worker del
   core — quello che va in produzione a ogni merge e che tiene la cache della
   PWA — passava la verifica «sulla copia di quello che si committa» e lo
   trovava solo la CI, dopo il push.
   ⚠️ I moduli dati e `pointcloud.js` in pratica erano già coperti, perché
   `run-kpi` e `run-pointcloud` li **importano** e un import di un file rotto
   fallisce. I service worker e le funzioni no: nessuna suite li importa —
   `nomi-liberi` li **legge come testo**, che è un'altra cosa.
   ⚠️ L'elenco è **derivato**, non ricopiato da quello della CI: un elenco
   gemello si scosta dall'originale al primo file nuovo. Qui si prendono per
   convenzione i service worker (`sw.js`, `*-sw.js`), l'ingresso delle
   funzioni, i moduli condivisi e quelli dati — così un'app nuova entra da
   sola. Costo misurato: **0,3 secondi** per tutti, tre.module.js compreso. */
function moduliASe() {
  const out = [];
  const seSta = (p) => { if (existsSync(join(RADICE, p))) out.push(p); };
  /* i service worker della radice */
  for (const f of readdirSync(RADICE)) if (/(^|-)sw\.js$/.test(f)) out.push(f);
  seSta("apps/deepwork-id/functions/index.js");
  /* i service worker e i moduli delle app */
  const appDir = join(RADICE, "apps");
  for (const app of readdirSync(appDir, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    for (const f of readdirSync(join(appDir, app.name))) {
      if (/(^|-)sw\.js$/.test(f) || /-data\.js$/.test(f) || f === "pointcloud.js") out.push(`apps/${app.name}/${f}`);
    }
  }
  /* i moduli condivisi */
  for (const d of ["shared", "shared/deepwork-id-client"]) {
    let voci = [];
    try { voci = readdirSync(join(RADICE, d)); } catch { continue; }
    for (const f of voci) if (f.endsWith(".js")) out.push(`${d}/${f}`);
  }
  return [...new Set(out)].sort();
}

/* Un service worker e le funzioni di Firebase NON sono moduli ESM: `sw.js` usa
   `importScripts`, le funzioni usano `require`. Vanno compilati come script
   classici, se no il controllo li accusa per una ragione che non è la loro. */
function compilaFile(rel, percorso = null) {
  const vero = percorso || join(RADICE, rel);
  const modulo = !/(^|\/)([\w-]*sw)\.js$/.test(rel) && !rel.includes("/functions/");
  const r = modulo
    ? spawnSync(process.execPath, ["--input-type=module", "--check"], { input: readFileSync(vero, "utf8") })
    : spawnSync(process.execPath, ["--check", vero]);
  return r.status === 0 ? null : String(r.stderr).split("\n").slice(0, 4).join(" ").trim();
}

let passati = 0, falliti = 0, scriptVisti = 0;
const rotte = [];
for (const p of pagine()) {
  const html = readFileSync(join(RADICE, p), "utf8");
  let bad = 0;
  blocchi(html).forEach((b, i) => {
    scriptVisti++;
    const err = compila(b);
    if (err) { bad++; rotte.push(`${p} script#${i}: ${err}`); }
  });
  if (bad === 0) { passati++; console.log(`  ✓ ${p}`); }
  else { falliti++; console.error(`  ✗ ${p}: ${bad} blocchi non compilano`); }
}
let moduliVisti = 0;
for (const rel of moduliASe()) {
  moduliVisti++;
  const err = compilaFile(rel);
  if (err) { falliti++; console.error(`  ✗ ${rel}: non compila`); rotte.push(`${rel}: ${err}`); }
  else { passati++; console.log(`  ✓ ${rel}`); }
}
for (const r of rotte) console.error(`     ${r}`);

/* ⚠️ E LA CONTROPROVA, perché una prova che non sa fallire non dimostra
   niente: si rompe una pagina **in memoria** (mai sul disco: le pagine le
   carica il browser, e un banco che girasse in quel momento misurerebbe una
   falsità) e si pretende che il controllo la veda. Stampa quante iniezioni ha
   provato, non solo l'esito: sapere fallire in un punto non dice niente sugli
   altri. */
if (CONTROPROVA) {
  let viste = 0, provate = 0;
  for (const p of pagine()) {
    const html = readFileSync(join(RADICE, p), "utf8");
    const bs = blocchi(html);
    if (!bs.length) continue;
    provate++;
    // lo stesso difetto vero del 02/08: un `${...}` fuori da ogni template
    const rotto = bs[bs.length - 1] + '\n${"" /* difetto rimesso */}\n';
    if (compila(rotto)) viste++;
    else console.error(`  ✗ controprova: ${p} non è stata vista rompersi`);
  }
  /* ⛔ E LA STESSA COSA SUI MODULI A SÉ, che è il difetto vero misurato
     l'08/08: `sw.js` rotto passava il giro intero, 23 comandi e 0 caduti.
     ⚠️ L'INIEZIONE VA IN UNA CARTELLA TEMPORANEA, MAI SUL FILE VERO. La prima
     stesura scriveva sul modulo e lo ripristinava: avrebbe funzionato, ma
     `CLAUDE.md` vieta di toccare moduli e pagine mentre gira un giro del
     browser — e questa controprova sta nel giro `node`, che si lancia
     **proprio** mentre l'altro cammina. Sarebbe stata una trappola armata a
     ogni commit. Il nome del file si conserva, perché è lui a dire se è un
     modulo o uno script classico. */
  let visteM = 0, provateM = 0;
  const tmp = mkdtempSync(join(tmpdir(), "sintassi-"));
  for (const rel of moduliASe()) {
    provateM++;
    const finto = join(tmp, rel.split("/").pop());
    writeFileSync(finto, readFileSync(join(RADICE, rel), "utf8") + "\nconst _rotto_ = ;\n");
    if (compilaFile(rel, finto)) visteM++;
    else console.error(`  ✗ controprova: ${rel} non è stato visto rompersi`);
    rmSync(finto, { force: true });
  }
  rmSync(tmp, { recursive: true, force: true });
  console.log(`\ncontroprova: ${viste} iniezioni viste su ${provate} pagine, ${visteM} su ${provateM} moduli a sé`);
  const bene = viste === provate && visteM === provateM;
  console.log(bene ? "controprova: il controllo SA fallire" : "controprova: NON distingue");
  process.exit(bene ? 0 : 1);
}

console.log(`\nRisultato sintassi delle pagine: ${passati} passati, ${falliti} falliti  ·  ${scriptVisti} blocchi <script> compilati e ${moduliVisti} moduli a sé`);
process.exit(falliti ? 1 : 0);
