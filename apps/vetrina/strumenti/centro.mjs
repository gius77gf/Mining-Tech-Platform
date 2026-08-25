/* ⛔ «Mi pare un po' decentrata» e' una misura, non un'impressione: si chiede
   al browser dove sta il centro dell'anello e dove sta il centro OTTICO del
   marchio. Sono due cose diverse — il marchio ha l'emblema in alto e le due
   scritte sotto, quindi il suo centro geometrico NON e' il centro di cio' che
   l'occhio vede. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { existsSync } from 'fs';
import { dirname, basename } from 'path';
import { servi } from './servi.mjs';

/* ⛔ L'INDIRIZZO NON SI INCHIODA DENTRO. Fino al 25/08 qui c'era
   `http://127.0.0.1:8941/_p-vetrina.html`, il nome che l'anteprima aveva nello
   scratchpad il giorno in cui il file e' nato — un indirizzo che dopo lo
   spostamento della pagina nel repository non esisteva piu'. Il server se lo
   alza `servi.mjs`, che lo fa per tutti e cinque i righelli. */
const PAGINA = process.argv[2];
if (!PAGINA || !existsSync(PAGINA)) {
  console.error('uso: node centro <pagina.html>   (es. apps/index.html)');
  process.exit(2);
}
const srv = await servi(dirname(PAGINA));

const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`http://127.0.0.1:${srv.porta}/${basename(PAGINA)}`, { waitUntil: 'networkidle' });
  const c = await p.$('.corona'); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  console.log(w + 'px  ' + await p.evaluate(() => {
    const co = document.querySelector('.corona');
    const an = co.querySelector('.anello');
    const ce = co.querySelector('.centro');
    const sv = co.querySelector('.centro svg');
    const rc = co.getBoundingClientRect(), ra = an.getBoundingClientRect();
    const re = ce.getBoundingClientRect(), rs = sv.getBoundingClientRect();
    const nomi = [...an.querySelectorAll('i')].map(i => i.getBoundingClientRect());
    const cx = nomi.reduce((a, r) => a + r.x + r.width / 2, 0) / nomi.length;
    const cy = nomi.reduce((a, r) => a + r.y + r.height / 2, 0) / nomi.length;
    return [
      `corona ${Math.round(rc.width)}x${Math.round(rc.height)}`,
      `centro dei nomi  x=${Math.round(cx)} y=${Math.round(cy)}`,
      `centro del marchio x=${Math.round(rs.x + rs.width / 2)} y=${Math.round(rs.y + rs.height / 2)}`,
      `scarto  x=${Math.round(rs.x + rs.width / 2 - cx)}  y=${Math.round(rs.y + rs.height / 2 - cy)}`,
      `blocco centro y=${Math.round(re.y)}..${Math.round(re.bottom)}`,
    ].join(' · ');
  }));
  await p.close();
}
await b.close(); srv.chiudi();
