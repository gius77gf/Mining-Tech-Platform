/* Il conto che il difetto di prima non aveva: dove finisce ogni pezzo della
   scena rispetto al bordo dello schermo. Un pezzo che esce non fa scorrere la
   pagina (`overflow-x:clip`), quindi non si vede da nessun'altra misura. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const w of [1440, 1100]) {
  const p = await b.newPage({ viewport:{width:w,height:900} });
  await p.goto('http://127.0.0.1:8941/_p-S-sito.html', {waitUntil:'networkidle'});
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);});
  await p.waitForTimeout(900);
  const m = await p.evaluate((W) => {
    const out = [];
    document.querySelectorAll('.app').forEach((a,i)=>{
      a.querySelectorAll('.orb,.pop').forEach(e=>{
        const r = e.getBoundingClientRect();
        const fuoriDx = Math.round(r.right - W), fuoriSx = Math.round(-r.left);
        const f = Math.max(fuoriDx, fuoriSx);
        if (f > 2) out.push(`${a.id}/${e.className.replace('orb ','').replace('pop ','pop.')}: fuori ${f}px su ${Math.round(r.width)}`);
      });
    });
    return out;
  }, w);
  console.log(`${w}px — pezzi fuori schermo: ${m.length}`);
  m.slice(0,14).forEach(x=>console.log('   '+x));
  await p.close();
}
await b.close();
