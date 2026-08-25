import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const sel = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://127.0.0.1:8941/_p-S-sito.html',{waitUntil:'networkidle'});
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);});
await p.waitForTimeout(800);
const e = await p.$(sel); if(!e){console.log('selettore assente:',sel);process.exit(1);}
await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(1400);
await p.screenshot({path:out}); await b.close(); console.log('fatto');
