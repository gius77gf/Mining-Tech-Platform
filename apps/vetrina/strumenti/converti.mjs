import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
const D = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage();
let tot = 0;
for (const f of readdirSync(D).filter(x => x.endsWith('.png')).sort()) {
  const b64 = readFileSync(`${D}/${f}`).toString('base64');
  const o = await p.evaluate(async ([d, w, q]) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + d; await im.decode();
    const c = document.createElement('canvas');
    c.width = w; c.height = Math.round(im.naturalHeight * w / im.naturalWidth);
    const x = c.getContext('2d'); x.fillStyle = '#0b0906'; x.fillRect(0,0,c.width,c.height);
    x.drawImage(im, 0, 0, c.width, c.height);
    return { u: c.toDataURL('image/jpeg', q), w: c.width, h: c.height };
  }, [b64, 880, .76]);
  const dst = `${D}/${f.replace('.png', '.jpg')}`;
  const buf = Buffer.from(o.u.split(',')[1], 'base64');
  writeFileSync(dst, buf); unlinkSync(`${D}/${f}`); tot += buf.length;
}
console.log(`convertite in JPEG 880px — peso totale ${(tot/1048576).toFixed(2)} MB`);
await b.close();
