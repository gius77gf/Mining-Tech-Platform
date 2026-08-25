/* ⛔ L'ANTEPRIMA SI FA DALLA PAGINA DEL SITO, NON DA UN SECONDO GENERATORE.

   Il problema: la pagina del sito porta gli sfondi a 1920px e qualita' 0,78,
   perche' su uno schermo a densita' doppia servono davvero (misurato: a 1440
   con densita' 2 gli sfondi venivano ingranditi 1,79 volte, ed e' li' che si
   vedevano i pixel). Con tutto incollato dentro fa 17,9 MB, e un artefatto su
   claude.ai si ferma a 16.

   La strada sbagliata sarebbe generare DUE pagine — una «bella» e una
   «leggera». Il giorno che una cambia, l'altra resta indietro in silenzio: e'
   la copia debole che questo repository paga da mesi.

   Qui invece si parte dalla pagina VERA, gia' committata, e si rimpiccioliscono
   soltanto le IMMAGINI finche' non ci si sta. Il testo, la struttura, il CSS e
   il JavaScript sono gli stessi byte: non c'e' niente che possa divergere.

   ⚠️ E si dichiara di quanto si e' rimpicciolito. Un'anteprima piu' povera
   dell'originale va detta, se no chi la guarda giudica il prodotto su una
   copia peggiore e non lo sa.

   Uso:  node impagina.mjs <index.html> <cartella-img> <uscita.html> [--tetto 15]
*/
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';

const [PAGINA, CARTELLA, USCITA] = process.argv.slice(2);
const i = process.argv.indexOf('--tetto');
const TETTO = (i > 0 ? +process.argv[i + 1] : 15) * 1048576;

let html = readFileSync(PAGINA, 'utf8');
const nome = basename(CARTELLA.replace(/\/$/, ''));
const rif = [...new Set([...html.matchAll(new RegExp(`${nome}/([A-Za-z0-9._-]+)`, 'g'))].map(m => m[1]))];
if (!rif.length) { console.error(`⛔ nessun riferimento a ${nome}/ nella pagina: mi fermo.`); process.exit(2); }

const b = await chromium.launch();
const p = await b.newPage();

/* si prova a scendere finche' non ci si sta: si parte dal vero e si cede il
   minimo indispensabile, invece di scegliere a caso un valore «che di sicuro
   basta» e buttare via qualita' che ci sarebbe stata */
const SCALINI = [[1920, .78], [1500, .72], [1240, .68], [1020, .62], [860, .56], [720, .5]];
let esito = null;

for (const [maxLarga, q] of SCALINI) {
  const pezzi = {};
  let byte = 0;
  for (const f of rif) {
    const via = join(CARTELLA, f);
    if (!existsSync(via)) { console.error(`⛔ manca ${via}`); process.exit(2); }
    if (/\.svg$/i.test(f)) {                       // il marchio: testo, non si tocca
      pezzi[f] = 'data:image/svg+xml;utf8,' + encodeURIComponent(readFileSync(via, 'utf8'));
      byte += pezzi[f].length; continue;
    }
    const b64 = readFileSync(via).toString('base64');
    const u = await p.evaluate(async ([d, w, qq]) => {
      const im = new Image(); im.src = 'data:image/jpeg;base64,' + d; await im.decode();
      if (im.naturalWidth <= w) return null;        // gia' piccola: si tiene com'e'
      const c = document.createElement('canvas');
      c.width = w; c.height = Math.round(im.naturalHeight * w / im.naturalWidth);
      const g = c.getContext('2d');
      g.fillStyle = '#08090c'; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(im, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', qq);
    }, [b64, maxLarga, q]);
    pezzi[f] = u || ('data:image/jpeg;base64,' + b64);
    byte += pezzi[f].length;
  }
  const stima = html.length + byte;
  console.log(`  ${String(maxLarga).padStart(4)}px q${q}  ->  ${(stima / 1048576).toFixed(2)} MB`);
  if (stima <= TETTO) { esito = { pezzi, maxLarga, q, stima }; break; }
}
await b.close();

if (!esito) { console.error('⛔ non ci si sta nemmeno al minimo: mi fermo invece di consegnare una pagina che non si apre.'); process.exit(1); }

for (const [f, u] of Object.entries(esito.pezzi)) html = html.split(`${nome}/${f}`).join(u);
const rimaste = (html.match(new RegExp(`${nome}/`, 'g')) || []).length;
writeFileSync(USCITA, html);

console.log(`\nanteprima scritta: ${(html.length / 1048576).toFixed(2)} MB su un tetto di ${(TETTO / 1048576).toFixed(0)}`);
console.log(`${rif.length} immagini incollate dentro · riferimenti rimasti a ${nome}/: ${rimaste}`);
if (esito.maxLarga < 1920)
  console.log(`⚠️  L'ANTEPRIMA E' PIU' POVERA DEL SITO: sfondi portati da 1920px a ${esito.maxLarga}px (qualita' ${esito.q}) per stare nel tetto. Il sito vero li ha alla misura piena.`);
else
  console.log('✔ nessuna perdita: l\'anteprima ha le stesse immagini del sito.');
if (rimaste > 0) { console.error(`⛔ ${rimaste} riferimenti non sostituiti: la pagina cercherebbe file che li' non ci sono.`); process.exit(1); }
