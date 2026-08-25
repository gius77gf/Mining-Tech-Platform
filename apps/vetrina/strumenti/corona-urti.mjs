/* ⛔ «I nomi toccano il marchio» si misura: si campiona la rotazione a piu'
   istanti e si chiede se il rettangolo di un nome interseca quello del centro.
   Un solo istante non basta — l'anello gira, e la collisione capita a un certo
   angolo e non a un altro: guardando uno scatto solo si dichiara pulito un
   difetto che compare due secondi dopo. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const b = await chromium.launch();
for (const w of [1440, 1024, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:8941/_p-vetrina.html', { waitUntil: 'networkidle' });
  const c = await p.$('.corona'); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  let urti = 0, peggio = 0, campioni = 0, nomi = 0;
  for (let k = 0; k < 12; k++) {
    const r = await p.evaluate(() => {
      const cen = document.querySelector('.corona .centro').getBoundingClientRect();
      const gonf = (r, m) => ({ l: r.x - m, t: r.y - m, r: r.right + m, b: r.bottom + m });
      const C = gonf(cen, 10);
      let n = 0, max = 0, tot = 0;
      document.querySelectorAll('.corona .anello i').forEach(i => {
        const q = i.getBoundingClientRect(); tot++;
        const ox = Math.min(C.r, q.right) - Math.max(C.l, q.x);
        const oy = Math.min(C.b, q.bottom) - Math.max(C.t, q.y);
        if (ox > 0 && oy > 0) { n++; max = Math.max(max, Math.min(ox, oy)); }
      });
      return { n, max, tot };
    });
    urti += r.n; peggio = Math.max(peggio, r.max); campioni++; nomi = r.tot;
    await p.waitForTimeout(650);
  }
  console.log(`${w}px · ${campioni} istanti × ${nomi} nomi = ${campioni*nomi} controlli · SOVRAPPOSIZIONI ${urti} · la peggiore ${Math.round(peggio)}px`);
  await p.close();
}
await b.close();
