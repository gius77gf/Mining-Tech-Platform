/* ⛔ IL CONTRASTO SOPRA UNA FOTOGRAFIA NON LO MISURA NESSUNO.
   `prova.mjs` risale gli antenati cercando un `background-color`: sotto una
   fotografia non ce n'e' uno, quindi arriva al `body` e misura contro il nero,
   cioe' risponde «a posto» avendo guardato un fondo che non e' quello.
   Qui si legge il RENDERIZZATO, e tre trappole pestate scrivendolo:
   1. si nasconde SOLO il testo, mai un elemento che dipinge un fondo suo — il
      bottone ambra nascosto lasciava vedere il nero dietro e il suo inchiostro
      scuro risultava a 1,24 invece di 11. Il righello accusava un colore sano;
   2. un filtro «sta nella finestra» lasciava 6 soggetti su 40: si scorre
      sezione per sezione, se no il denominatore si svuota e il verde non parla
      di niente;
   3. si tiene il pixel PEGGIORE e si stampa la FORBICE: sopra una fotografia
      il fondo e' mosso, e un numero solo senza la sua forbice non si sa quanto
      vale. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto('http://127.0.0.1:8941/_p-S-sito.html', {waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);});
await p.waitForTimeout(1200);

const L = `(function(){
  return function(r,g,bb){return [r,g,bb].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);})
    .reduce(function(a,x,i){return a+[.2126,.7152,.0722][i]*x;},0);};})()`;

const sezioni = await p.$$('.ingresso, .fascia, .invito, .scena');
let trovati=0, giudicati=0, saltatiFondo=0, sfumati=0, nonInVista=0;
const bassi=[], tutti=[];
for (const sez of sezioni) {
  const conFondale = await sez.evaluate(e => !!e.querySelector(':scope > .fondale, :scope > .lavoro'));
  if (!conFondale) continue;
  await sez.scrollIntoViewIfNeeded(); await p.waitForTimeout(700);
  const info = await sez.evaluate((s) => {
    const op = c => { const v=(c||'').match(/[\d.]+/g); return v && v.length>3 ? +v[3] : (c && c!=='transparent' ? 1 : 0); };
    const out=[]; let salt=0, sf=0, fuori=0;
    s.querySelectorAll('h1,h2,h3,p,span,a,b,s,li,em').forEach((e,i)=>{
      const t=e.textContent.trim();
      if(!t || e.querySelector('h1,h2,h3,p,span,a,b,s,li,em')) return;
      const cs=getComputedStyle(e);
      // 1. mai un elemento che dipinge un fondo suo, ne' con un antenato che lo fa
      let n=e, proprio=false;
      while(n && n!==s){ const c=getComputedStyle(n);
        if(op(c.backgroundColor)>.25 || c.backgroundImage!=='none'){proprio=true;break;} n=n.parentElement; }
      if(proprio){salt++;return;}
      if(cs.webkitTextFillColor==='rgba(0, 0, 0, 0)'||cs.backgroundClip==='text'){sf++;return;}
      const r=e.getBoundingClientRect();
      if(r.width<4||r.height<4) return;
      if(r.bottom<0||r.top>innerHeight){fuori++;return;}
      e.dataset.dwT='1';
      out.push({t:t.slice(0,34),col:cs.color,r:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]});
    });
    return {out,salt,sf,fuori,sez:s.className.split(' ')[0]+(s.closest('.app')?'/'+s.closest('.app').id:'')};
  });
  trovati+=info.out.length+info.salt+info.sf+info.fuori;
  saltatiFondo+=info.salt; sfumati+=info.sf; nonInVista+=info.fuori;
  if(!info.out.length){ await p.evaluate(()=>document.querySelectorAll('[data-dw-t]').forEach(e=>e.removeAttribute('data-dw-t'))); continue; }
  await p.evaluate(()=>document.querySelectorAll('[data-dw-t]').forEach(e=>e.style.visibility='hidden'));
  await p.waitForTimeout(220);
  const png = (await p.screenshot({type:'png'})).toString('base64');
  await p.evaluate(()=>document.querySelectorAll('[data-dw-t]').forEach(e=>{e.style.visibility='';e.removeAttribute('data-dw-t');}));
  const r = await p.evaluate(async ([d, lista, Lsrc]) => {
    const lum = eval(Lsrc);
    const im=new Image(); im.src='data:image/png;base64,'+d; await im.decode();
    const c=document.createElement('canvas'); c.width=im.width; c.height=im.height;
    const g=c.getContext('2d'); g.drawImage(im,0,0);
    const cr=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    return lista.map(s=>{
      const [x,y,w,h]=s.r;
      const X=Math.max(0,x),Y=Math.max(0,y),W=Math.min(w,c.width-X),H=Math.min(h,c.height-Y);
      if(W<2||H<2) return null;
      const dat=g.getImageData(X,Y,W,H).data;
      let lo=1,hi=0;
      for(let k=0;k<dat.length;k+=4){const l=lum(dat[k],dat[k+1],dat[k+2]); if(l<lo)lo=l; if(l>hi)hi=l;}
      const v=s.col.match(/[\d.]+/g).map(Number), lt=lum(v[0],v[1],v[2]);
      return {t:s.t,col:s.col,peggio:+Math.min(cr(lt,lo),cr(lt,hi)).toFixed(2),meglio:+Math.max(cr(lt,lo),cr(lt,hi)).toFixed(2)};
    }).filter(Boolean);
  }, [png, info.out, L]);
  for(const e of r){ giudicati++; tutti.push({...e,sez:info.sez}); if(e.peggio<4.5) bassi.push({...e,sez:info.sez}); }
}
console.log(`sopra una fotografia — ${trovati} testi in ${sezioni.length} sezioni`);
console.log(`  giudicati ${giudicati} · con fondo proprio ${saltatiFondo} (li misura gia' prova.mjs) · inchiostro sfumato ${sfumati} (non giudicabili, DICHIARATI) · fuori dalla finestra ${nonInVista}`);
console.log(`  sotto 4.5:1 -> ${bassi.length}`);
bassi.sort((a,b)=>a.peggio-b.peggio).slice(0,18).forEach(e=>
  console.log(`   ${String(e.peggio).padStart(5)} (forbice ${(e.meglio-e.peggio).toFixed(2)})  [${e.sez}] ${e.col}  «${e.t}»`));
if(!bassi.length&&tutti.length){const m=tutti.sort((a,b)=>a.peggio-b.peggio)[0];
  console.log(`   il piu' magro: ${m.peggio}:1 (forbice ${(m.meglio-m.peggio).toFixed(2)}) «${m.t}» [${m.sez}]`);}
await b.close();
