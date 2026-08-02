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

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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
  console.log(`\ncontroprova: ${viste} iniezioni viste su ${provate} pagine`);
  console.log(viste === provate ? "controprova: il controllo SA fallire" : "controprova: NON distingue");
  process.exit(viste === provate ? 0 : 1);
}

console.log(`\nRisultato sintassi delle pagine: ${passati} passati, ${falliti} falliti  ·  ${scriptVisti} blocchi <script> compilati`);
process.exit(falliti ? 1 : 0);
