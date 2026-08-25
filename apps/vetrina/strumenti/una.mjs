/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const sel = process.argv[2], out = process.argv[3];
import { existsSync } from 'fs';
import { dirname, basename } from 'path';
import { servi } from './servi.mjs';

/* ⛔ L'INDIRIZZO NON SI INCHIODA DENTRO: `servi.mjs` alza il server e sceglie
   la porta chiedendola al sistema. Fino al 25/08 qui c'era il nome che
   l'anteprima aveva nello scratchpad, e dopo lo spostamento della pagina nel
   repository quell'indirizzo non esisteva piu'. */
const PAGINA = process.argv[2];
if (!PAGINA || !existsSync(PAGINA)) {
  console.error('uso: node <righello>.mjs <pagina.html>   (es. apps/index.html)');
  process.exit(2);
}
const srv = await servi(dirname(PAGINA));

const b = await chromium.launch();
const p = await b.newPage({viewport:{width:1440,height:900}});
await p.goto(`http://127.0.0.1:${srv.porta}/${basename(PAGINA)}`,{waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);});
await p.waitForTimeout(800);
const e = await p.$(sel); if(!e){console.log('selettore assente:',sel);process.exit(1);}
await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(1400);
await p.screenshot({path:out}); await b.close(); srv.chiudi(); console.log('fatto');
