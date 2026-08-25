/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync, writeFileSync } from 'fs';
import { servi } from './servi.mjs';
const D = process.argv[2], nomi = process.argv.slice(3);
/* ⛔ IL SERVER SE LO ALZA LUI, sulla cartella che gli e' stata passata. Prima
   dava per scontato che qualcuno stesse gia' servendo `D` sulla 8941: era vero
   nello scratchpad e falso ovunque altro, e un 404 qui non fa fallire niente —
   fa misurare una pagina vuota. */
const srv = await servi(D);
const b = await chromium.launch();
for (const n of nomi) {
  // stesso involucro che costruisce l'artefatto: se no document.body non c'e'
  writeFileSync(`${D}/_p-${n}.html`, '<!doctype html><html lang="it"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'
    + readFileSync(`${D}/${n}.html`, 'utf8') + '</body></html>');
  for (const [et, w, h] of [['desk', 1440, 900], ['tel', 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const err = [];
    p.on('pageerror', e => err.push(e.message.split('\n')[0]));
    await p.goto(`http://127.0.0.1:${srv.porta}/_p-${n}.html`, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(1500);
    const m = await p.evaluate(() => {
      const lum = c => { const sr = /^color\(srgb/.test(c); const v = c.match(/[\d.]+/g).map(Number);
        return [.2126,.7152,.0722].reduce((a,k,i)=>{let x = sr ? v[i] : v[i]/255; return a+k*(x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4));},0); };
      const cr = (a,b)=>{const la=lum(a),lb=lum(b);return (Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);};
      /* ⛔ UN FONDO SEMITRASPARENTE VA SOVRAPPOSTO, NON PRESO PER BUONO.
         I pannelli di vetro hanno fondi rgba(...,.05): fermarsi li' e leggerne
         il colore dichiarato fa dire «contrasto 1,00» su un testo perfettamente
         leggibile. Si compone strato per strato fino al primo fondo opaco. */
      const canali = c => { const sr=/^color\(srgb/.test(c); const v=c.match(/[\d.]+/g).map(Number);
        const a = v.length>3 ? v[3] : 1;
        return { r: sr?v[0]*255:v[0], g: sr?v[1]*255:v[1], b: sr?v[2]*255:v[2], a }; };
      const fon = e => {
        const strati=[]; let a=e;
        while(a){ const g=getComputedStyle(a).backgroundColor;
          if(g){ const c=canali(g); if(c.a>0) strati.push(c); if(c.a>=1) break; }
          a=a.parentElement; }
        const b=canali(getComputedStyle(document.body).backgroundColor);
        if(!strati.length||strati[strati.length-1].a<1) strati.push({r:b.r,g:b.g,b:b.b,a:1});
        let out=strati[strati.length-1];
        for(let i=strati.length-2;i>=0;i--){ const s=strati[i];
          out={ r:s.r*s.a+out.r*(1-s.a), g:s.g*s.a+out.g*(1-s.a), b:s.b*s.a+out.b*(1-s.a), a:1 }; }
        return `rgb(${Math.round(out.r)}, ${Math.round(out.g)}, ${Math.round(out.b)})`; };
      const bassi=[], nonMis=[];
      for(const e of document.querySelectorAll('h1,h2,h3,h4,p,span,b,a,em,figcaption')){
        const t=(e.textContent||'').trim(); if(!t||e.children.length) continue;
        if(getComputedStyle(e).webkitTextFillColor==='rgba(0, 0, 0, 0)') continue; // testo a sfumatura: non ha UN colore
        const st=getComputedStyle(e); if(st.opacity==='0'||st.display==='none') continue;
        const px=parseFloat(st.fontSize), gr=px>=24||(px>=18.66&&+st.fontWeight>=700);
        const r=cr(st.color,fon(e));
        /* ⚠️ un fondo a SFUMATURA non ha un colore da leggere: `backgroundColor`
           torna trasparente e il righello confronta il testo col fondo della
           pagina — 1,06 su un bottone perfettamente leggibile. Si DICHIARA non
           misurabile invece di accusare. */
        let sfum=false, an=e;
        while(an){
          const st2=getComputedStyle(an), bg2=st2.backgroundColor;
          const pieno = bg2 && !/rgba\(0, 0, 0, 0\)/.test(bg2) && !/, 0\)$/.test(bg2);
          if(pieno) break;                                  // fondo vero: si misura
          if(/gradient/.test(st2.backgroundImage)){sfum=true;break;}  // solo sfumatura: non si misura
          an=an.parentElement; }
        if(sfum){ nonMis.push(t.slice(0,20)); continue; }
        if(r<(gr?3:4.5)) bassi.push(`${t.slice(0,20)}|${px}px|${r.toFixed(2)}`);
      }
      const im=[...document.querySelectorAll('img')];
      return { alta: document.documentElement.scrollHeight,
        lat: document.documentElement.scrollWidth>document.documentElement.clientWidth,
        img:`${im.filter(i=>i.naturalWidth>0).length}/${im.length}`,
        testi: document.querySelectorAll('h1,h2,h3,h4,p,span,b,a,em,figcaption').length, bassi, nonMis };
    });
    console.log(`${n} ${et.padEnd(4)} ${m.alta}px  scorr-lat=${m.lat}  img=${m.img}  testi=${m.testi}  sotto-soglia=${m.bassi.length} ${m.bassi.slice(0,4).join(' · ')}  sfumature-non-misurabili=${m.nonMis.length}${err.length?'  ERRORI: '+err.join('; '):''}`);
    await p.screenshot({ path: `${D}/${n}-${et}.png`, fullPage: et === 'desk' });
    await p.close();
  }
}
await b.close(); srv.chiudi();
