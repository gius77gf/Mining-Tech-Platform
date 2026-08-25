/* Le finestre piccole rendono a ~200-290 px e portavano la stessa immagine da
   880: tre copie della stessa stringa base64, cioe' 3,7 MB di pagina per pixel
   che nessuno vede. Qui se ne fa una serie da 440. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
const D = process.argv[2]; mkdirSync(D + '/p', { recursive: true });
const b = await chromium.launch(); const p = await b.newPage();
let tot = 0, n = 0;
for (const f of readdirSync(D).filter(x => x.endsWith('.jpg')).sort()) {
  const b64 = readFileSync(`${D}/${f}`).toString('base64');
  const o = await p.evaluate(async ([d, w, q]) => {
    const im = new Image(); im.src = 'data:image/jpeg;base64,' + d; await im.decode();
    const c = document.createElement('canvas');
    c.width = w; c.height = Math.round(im.naturalHeight * w / im.naturalWidth);
    const x = c.getContext('2d'); x.fillStyle = '#0b0906'; x.fillRect(0,0,c.width,c.height);
    x.drawImage(im, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', q);
  }, [b64, 440, .7]);
  const buf = Buffer.from(o.split(',')[1], 'base64');
  writeFileSync(`${D}/p/${f}`, buf); tot += buf.length; n++;
}
console.log(`${n} miniature a 440px — ${(tot/1048576).toFixed(2)} MB (le grandi pesano ${(readdirSync(D).filter(x=>x.endsWith('.jpg')).reduce((a,f)=>a+readFileSync(`${D}/${f}`).length,0)/1048576).toFixed(2)} MB)`);
await b.close();
