/* ⚠️ NON VA IN npm test: non è un banco, è lo STRUMENTO della passata in
   profondità. Apre una superficie a una o più larghezze, va in ogni sezione e
   scatta la pagina INTERA a fette da 1400 px (nel contenitore non c'è PIL: si
   usa `clip` di Playwright), stampa lo scorrimento laterale e gli errori di
   pagina. Le fette vanno GUARDATE una per una: uno scatto propone, una misura
   decide (CLAUDE.md).
   ⛔ Sta qui e non nello scratchpad perché il 10/09 il contenitore si è
   riavviato a metà ciclo e lo scratchpad — con la sonda gemella di questa e le
   130 fette della giornata — è sparito. «Gli strumenti di misura vivono nei
   test, non nello scratchpad» era già scritto: pagato di nuovo.
   Il core si apre col finto Firebase (`finto-firebase.mjs`) e le quattro pagine
   di Deepwork ID col finto ID (`finto-id.mjs`) nello scenario `--scenario=`
   (member, anonymous, unauthorized, tour; default member con i dati di
   `DATI_ORG`): senza, quelle pagine restano l'anteprima senza backend.
   Uso:
     node apps/deepwork-id/tests/browser/fette.mjs --app=conti --scatti=/tmp/x
     node apps/deepwork-id/tests/browser/fette.mjs --app=core --larghezze=320 --scatti=/tmp/x
     node apps/deepwork-id/tests/browser/fette.mjs --app='id · profilo' --scenario=member --scatti=/tmp/x
   Alza un server proprio (porta con --porta=, default 8731), col contrassegno
   del pid riletto dal server: se sulla porta risponde un altro, si ferma. */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prendiChromium, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';
import { montaFintoId, DATI_ORG } from './finto-id.mjs';

const arg = (n, d) => { const a = process.argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const APP = arg('app', '');
const LARGHEZZE = arg('larghezze', '320,430').split(',').map((x) => +x).filter((x) => x > 0);
const OUT = arg('scatti', '');
const PORTA = Number(arg('porta', '8731'));
const SCENARIO = arg('scenario', 'member');
const ALTEZZA = 900, FETTA = 1400;
const R = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const sup = SUPERFICI.find(([n]) => n === APP);
if (!sup || !OUT) {
  console.error(`Uso: --app=<${SUPERFICI.map(([n]) => n).join('|')}> --scatti=<cartella> [--larghezze=320,430] [--scenario=member]`);
  process.exit(2);
}
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const srv = createServer((q, s) => {
  const f = join(R, decodeURIComponent((q.url || '/').split('?')[0]));
  if (!existsSync(f) || statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'Content-Type': TIPI[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  s.end(readFileSync(f));
});
await new Promise((r, x) => { srv.once('error', x); srv.listen(PORTA, r); });
const SEGNO = join(R, '__fette-' + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__fette-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: scatterei la sua copia.`); process.exit(2); }
} finally { unlinkSync(SEGNO); }

const chromium = await prendiChromium();
const b = await chromium.launch();
mkdirSync(OUT, { recursive: true });
const eId = APP.startsWith('id · ');
const scenario = SCENARIO === 'member' ? { stato: 'member', dati: DATI_ORG() }
  : SCENARIO === 'unauthorized' ? { stato: 'unauthorized', emailVerified: false }
  : SCENARIO === 'null' ? null : { stato: SCENARIO };
let fette = 0;
for (const L of LARGHEZZE) {
  let ctx, p, errori = [], dentro = true;
  if (eId) {
    /* `apriSuperficie` monta il finto solo per il core: le pagine di Deepwork ID
       si aprono a mano, come fa `id-stati.mjs`, col finto ID PRIMA di goto */
    ctx = await b.newContext({ viewport: { width: L, height: ALTEZZA }, locale: 'it-IT' });
    p = await ctx.newPage();
    p.on('pageerror', (e) => errori.push(e.message));
    await montaFintoId(p, scenario);
    await p.goto(`http://127.0.0.1:${PORTA}${sup[1]}`);
    await p.waitForTimeout(2200);
  } else {
    ({ ctx, p, errori, dentro } = await apriSuperficie(b, {
      nome: APP, via: sup[1], porta: PORTA, larghezza: L, altezza: ALTEZZA,
      montaFintoFirebase: APP === 'core' ? montaFintoFirebase : null,
    }));
  }
  if (APP === 'core') console.log(`${L}px: accesso al core ${dentro ? 'riuscito' : 'NON riuscito (guscio)'}`);
  p.setDefaultTimeout(4000);
  for (const s of await sezioniDi(p, APP)) {
    await vaiA(p, APP, s);
    await p.waitForTimeout(300);
    const nome = `${L}-${(s || 'unica').replace(/[^a-z0-9-]/gi, '_')}`;
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0, i = 0; y < H; y += FETTA, i++) {
      await p.screenshot({ path: join(OUT, `${nome}-${String(i).padStart(2, '0')}.png`), fullPage: true,
        clip: { x: 0, y, width: L, height: Math.min(FETTA, H - y) } }).catch((e) => console.log('scatto fallito', nome, e.message));
      fette++;
    }
    const largo = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    console.log(`${nome}: ${Math.ceil(H / FETTA)} fette · ${largo.sw > largo.cw ? '⚠️ scorre in orizzontale ' + largo.sw + '>' + largo.cw : 'ok'}`);
  }
  console.log(`${L}px: errori di pagina ${errori.length}` + (errori.length ? '\n  ' + errori.join('\n  ') : ''));
  await ctx.close();
}
await b.close(); srv.close();
console.log(`${fette} fette in ${OUT}`);
