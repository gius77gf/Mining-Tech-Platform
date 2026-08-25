/* Fotografa PIU' SCHERMATE di ogni app, navigando come farebbe una persona:
   si preme la voce nella barra in basso e si aspetta che la schermata cambi.
   ⛔ Si PRETENDE la prova di aver navigato — quale `.page` e' visibile — se no
      si fotografa otto volte la stessa schermata senza accorgersene. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'fs';
const OUT = process.argv[2];
const APP = [
  ['campo',      '/apps/campo/index.html',      ['dash','att','squ','rap','set','dash']],
  ['flotta',     '/apps/flotta/index.html',     ['dash','giro','mez','man','sca','cos']],
  ['scudo',      '/apps/scudo/index.html',      ['dash','pers','scad','azio','isp','doc']],
  ['conti',      '/apps/conti/index.html',      ['dash','fat','pes','ord','cli','rep']],
  ['sentinella', '/apps/sentinella/index.html', ['dash','mon','prog','ade','reg','rep']],
  ['terra',      '/apps/terra/index.html',      ['dash','tit','fro','ril','pia','den']],
  ['genesi',     '/apps/genesi/genesi.html',    [null,null,null,null,null,null]],
];
const b = await chromium.launch();
const esito = [];
for (const [nome, via, sezioni] of APP) {
  const p = await b.newPage({ viewport: { width: 1180, height: 738 }, deviceScaleFactor: 1 });
  const err = [];
  p.on('pageerror', e => err.push(e.message.split('\n')[0]));
  try {
    await p.goto('http://127.0.0.1:8951' + via, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(2600);
    for (let i = 0; i < sezioni.length; i++) {
      const s = sezioni[i];
      if (s) {
        const bott = await p.$('#nav-' + s);
        if (!bott) { esito.push(`${nome}/${s}: voce assente`); continue; }
        await bott.click().catch(() => {});
        await p.waitForTimeout(1500);
        const aperta = await p.evaluate(() => {
          const v = [...document.querySelectorAll('.page')].filter(x => getComputedStyle(x).display !== 'none');
          return v.length ? (v[0].id || v[0].className) : 'NESSUNA';
        });
        if (aperta === 'NESSUNA') { esito.push(`${nome}/${s}: nessuna schermata aperta`); continue; }
      } else {
        await p.waitForTimeout(1200 + i * 900);   // Genesi: la sola schermata, in momenti diversi
      }
      const f = `${OUT}/${nome}-${i}.png`;
      await p.screenshot({ path: f });
      esito.push(`${nome}-${i} ok${s ? ' (' + s + ')' : ''}`);
    }
  } catch (e) { esito.push(`${nome}: ${e.message.split('\n')[0]}`); }
  if (err.length) esito.push(`${nome}: errori di pagina -> ${err.slice(0,2).join('; ')}`);
  await p.close();
}
console.log(esito.join('\n'));
await b.close();
