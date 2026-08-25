/* Le stesse app in MODALITA' CHIARA (punto 10 del fondatore) e GENESI davvero
   navigata (punto 6).
   ⚠️ Il tema NON si accende cliccando: `shared/dw-tema.js` legge `?tema=chiaro`
      dall'indirizzo, lo salva e lo toglie dall'indirizzo. Basta chiedere la
      pagina cosi'.
   ⛔ Genesi non ha `.page`: e' un editor 3D con `#bottomnav` a tre voci
      (`data-scr="home|design|sim"`). Prima si fotografava sei volte la stessa
      schermata a istanti diversi — ed e' esattamente il difetto che questo
      repository chiama «un banco che non naviga risponde tutto a posto».
      Qui si PRETENDE la prova: quale bottone risulta `.on` dopo il click. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT = process.argv[2], PORTA = process.argv[3] || '8951';
const APP = [
  ['campo','/apps/campo/index.html',['dash','att','squ','rap','set','dash']],
  ['flotta','/apps/flotta/index.html',['dash','giro','mez','man','sca','cos']],
  ['scudo','/apps/scudo/index.html',['dash','pers','scad','azio','isp','doc']],
  ['conti','/apps/conti/index.html',['dash','fat','pes','ord','cli','rep']],
  ['sentinella','/apps/sentinella/index.html',['dash','mon','prog','ade','reg','rep']],
  ['terra','/apps/terra/index.html',['dash','tit','fro','ril','pia','den']],
];
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const esito = [];
for (const [nome, via, sez] of APP) {
  const p = await b.newPage({ viewport:{width:1180,height:738} });
  try {
    await p.goto(`http://127.0.0.1:${PORTA}${via}?tema=chiaro`, {waitUntil:'networkidle', timeout:30000});
    await p.waitForTimeout(2600);
    const chiaro = await p.evaluate(() => document.body.classList.contains('light-mode'));
    if (!chiaro) { esito.push(`${nome}: il tema chiaro NON si e' acceso — nessuno scatto`); await p.close(); continue; }
    for (let i=0;i<sez.length;i++){
      const bott = await p.$('#nav-'+sez[i]);
      if(!bott){esito.push(`${nome}/${sez[i]}: voce assente`);continue;}
      await bott.click().catch(()=>{}); await p.waitForTimeout(1400);
      const aperta = await p.evaluate(()=>{const v=[...document.querySelectorAll('.page')]
        .filter(x=>getComputedStyle(x).display!=='none');return v.length?(v[0].id||'?'):'NESSUNA';});
      if(aperta==='NESSUNA'){esito.push(`${nome}/${sez[i]}: nessuna schermata aperta`);continue;}
      await p.screenshot({path:`${OUT}/${nome}c-${i}.png`});
      esito.push(`${nome}c-${i} ok (${sez[i]}, chiaro)`);
    }
  } catch(e){ esito.push(`${nome}: ${e.message.split('\n')[0]}`); }
  await p.close();
}
/* GENESI: le tre schermate vere, nei due temi */
for (const [suff, q] of [['', ''], ['c', '?tema=chiaro']]) {
  const p = await b.newPage({ viewport:{width:1180,height:738} });
  try {
    await p.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html${q}`, {waitUntil:'networkidle', timeout:40000});
    await p.waitForTimeout(5200);                 // lo splash e il motore 3D
    const scr = ['home','design','sim'];
    for (let i=0;i<scr.length;i++){
      const ok = await p.evaluate(async (s)=>{
        const btn=document.querySelector(`#bottomnav button[data-scr="${s}"]`);
        if(!btn) return 'assente'; btn.click();
        await new Promise(r=>setTimeout(r,1500));
        return btn.classList.contains('on') ? 'ok' : 'non attivata';
      }, scr[i]);
      if(ok!=='ok'){esito.push(`genesi${suff}/${scr[i]}: ${ok}`);continue;}
      await p.waitForTimeout(1800);
      await p.screenshot({path:`${OUT}/genesi${suff}-${i}.png`});
      esito.push(`genesi${suff}-${i} ok (${scr[i]}${suff?', chiaro':''})`);
    }
  } catch(e){ esito.push(`genesi${suff}: ${e.message.split('\n')[0]}`); }
  await p.close();
}
console.log(esito.join('\n'));
await b.close();
