/* ⛔ «Non ci devono essere spazi vuoti» e' una richiesta VERIFICABILE, quindi
   si verifica invece di guardarla a occhio. Si fotografa la pagina intera, la
   si legge a fasce orizzontali e per ogni fascia si chiede: quanto e' scura, e
   quanto e' UNIFORME? Una fascia scura ma variata e' una fotografia notturna;
   una fascia scura e piatta e' un buco. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8941/_p-vetrina.html', { waitUntil: 'networkidle' });
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}scrollTo(0,0);});
/* ⛔ SI ASPETTA CHE LE IMMAGINI CI SIANO DAVVERO. Senza, il conto dipende da
   quante hanno fatto in tempo a caricarsi durante lo scorrimento: schiarendo i
   fondali il numero e' SALITO da 26 a 33, che e' impossibile — stavo tarando
   contro il rumore del mio righello invece che contro la pagina. */
const attese = await p.evaluate(async () => {
  const im = [...document.images];
  await Promise.all(im.map(i => i.complete ? null : i.decode().catch(() => null)));
  return `${im.filter(i => i.naturalWidth > 0).length}/${im.length}`;
});
await p.waitForTimeout(1200);
const png = (await p.screenshot({ fullPage: true, type: 'png' })).toString('base64');
const r = await p.evaluate(async (d) => {
  const im = new Image(); im.src = 'data:image/png;base64,' + d; await im.decode();
  const W = 240, H = Math.round(im.naturalHeight * W / im.naturalWidth);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0, W, H);
  const dat = g.getImageData(0, 0, W, H).data;
  const FASCIA = 8, fasce = [];
  for (let y0 = 0; y0 + FASCIA <= H; y0 += FASCIA) {
    let s = 0, s2 = 0, n = 0;
    for (let y = y0; y < y0 + FASCIA; y++) for (let x = 0; x < W; x++) {
      const k = (y * W + x) * 4, l = (dat[k] + dat[k+1] + dat[k+2]) / 3;
      s += l; s2 += l * l; n++;
    }
    const media = s / n, dev = Math.sqrt(Math.max(0, s2 / n - media * media));
    fasce.push({ y: y0, media: +media.toFixed(1), dev: +dev.toFixed(1) });
  }
  const scala = im.naturalHeight / H;
  const vuote = fasce.filter(f => f.media < 16 && f.dev < 7);
  return { alte: im.naturalHeight, fasce: fasce.length, vuote: vuote.length,
           scala: +scala.toFixed(1),
           dove: vuote.map(f => `${Math.round(f.y * scala)}px (luce ${f.media}, variazione ${f.dev})`) };
}, png);
console.log(`pagina alta ${r.alte}px · ${r.fasce} fasce misurate · immagini caricate ${attese}`);
console.log(`fasce PIATTE E NERE (luce<16 e variazione<7): ${r.vuote}`);
r.dove.forEach(x => console.log('   ' + x));
await b.close();
