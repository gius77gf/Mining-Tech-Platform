/* Porta le miniature alla misura del fondale. Il ritaglio si DICHIARA (quale
   finestra e' stata usata): la volta scorsa una funzione di ritaglio non
   ritagliava e nessuno se n'era accorto, perche' non stampava la finestra. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
const S = process.argv[2];
const PIANO = JSON.parse(readFileSync(process.argv[3], 'utf8'));   // [{da, a, largh, alt, cy}]
mkdirSync(S + '/pronte', { recursive: true });
const b = await chromium.launch(); const p = await b.newPage();
let tot = 0;
for (const x of PIANO) {
  const b64 = readFileSync(`${S}/s/${x.da}`).toString('base64');
  const o = await p.evaluate(async ([d, W, H, cy, q]) => {
    const im = new Image(); im.src = 'data:image/jpeg;base64,' + d; await im.decode();
    const iw = im.naturalWidth, ih = im.naturalHeight, r = W / H;
    // la finestra: la piu' grande che sta nell'immagine col rapporto voluto
    let sw = iw, sh = Math.round(iw / r);
    if (sh > ih) { sh = ih; sw = Math.round(ih * r); }
    const sx = Math.round((iw - sw) / 2);
    const sy = Math.max(0, Math.min(ih - sh, Math.round(ih * cy - sh / 2)));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); g.fillStyle = '#08090c'; g.fillRect(0, 0, W, H);
    g.drawImage(im, sx, sy, sw, sh, 0, 0, W, H);
    return { u: c.toDataURL('image/jpeg', q), iw, ih, sx, sy, sw, sh };
  }, [b64, x.largh, x.alt, x.cy ?? 0.5, x.q ?? 0.62]);
  const buf = Buffer.from(o.u.split(',')[1], 'base64');
  writeFileSync(`${S}/pronte/${x.a}`, buf); tot += buf.length;
  console.log(`${x.a.padEnd(20)} da ${o.iw}x${o.ih} finestra ${o.sw}x${o.sh}+${o.sx}+${o.sy} -> ${x.largh}x${x.alt}  ${(buf.length/1024).toFixed(0)} KB`);
}
console.log(`\n${PIANO.length} fondali · peso totale ${(tot/1048576).toFixed(2)} MB`);
await b.close();
