/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:8941/_p-S-sito.html', {waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);});
await p.waitForTimeout(1200);
const app = await p.$$('.app');
for (const [i,n] of [[1,'terra'],[2,'campo'],[4,'scudo'],[8,'deepworkid']]) {
  if(!app[i]) continue;
  await app[i].scrollIntoViewIfNeeded(); await p.waitForTimeout(1600);
  const box = await app[i].boundingBox();
  await p.mouse.move(box.x+box.width*0.75, box.y+box.height*0.45);
  await p.waitForTimeout(900);
  await p.screenshot({path:`sc-${n}.png`});
}
await b.close(); console.log('scene fotografate');
