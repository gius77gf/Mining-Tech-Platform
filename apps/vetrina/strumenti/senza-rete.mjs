/* ⛔ LA VETRINA SI APRE ANCHE SENZA RETE? Si stacca e si guarda.

   Il fondatore l'ha chiesto il 25/08, dicendo «mi pare che tutte le app
   dovrebbero essere in grado di farlo». Censite le dieci superfici: otto hanno
   il MANIFEST (si installano sul telefono), **due sole** hanno un service
   worker — il core e Genesi. La vetrina non aveva né l'uno né l'altro, e
   staccando la rete era una PAGINA BIANCA.
   ⚠️ E non bastava il service worker del CORE, che pure ha la radice come
   ambito e quindi controlla anche `/apps/`: il suo ripiego di navigazione
   riporta a `./index.html`, che dalla sua posizione è il core. Misurato: con
   quello attivo, la vetrina offline era bianca lo stesso.

   ⛔ IL VERDETTO NON È «LA PAGINA RISPONDE». Una pagina d'errore risponde
   anche lei, e un ripiego che mostra il core risponde benissimo mostrando
   un'altra cosa. Si pretende che ci sia la VETRINA: il suo testo, gli otto
   nomi della corona, e i collegamenti alle app. Un solo numero non
   distinguerebbe «funziona» da «c'è qualcosa».

   ⚠️ E si misurano DUE storie diverse, perché l'utente vero fa tutt'e due:
   chi ha scorso tutta la pagina, e chi l'ha solo aperta e se n'è andato.
   La seconda è la più severa: in cache c'è meno roba.

   Uso:  node senza-rete.mjs [--radice .] [--controprova]
*/
/* ⚠️ Playwright si importa in forma DINAMICA, come i banchi del repository:
   `import-esistenti.mjs` risolve gli import statici e un percorso assoluto
   fuori dal repository glielo fa dichiarare inesistente. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { resolve } from 'path';
import { servi } from './servi.mjs';

const i = process.argv.indexOf('--radice');
const RADICE = resolve(i > 0 ? process.argv[i + 1] : '.');
const CONTROPROVA = process.argv.includes('--controprova');
const srv = await servi(RADICE);
const B = `http://127.0.0.1:${srv.porta}`;

const b = await chromium.launch();
let passati = 0, falliti = 0;
const prova = (n, c) => { if (c) { passati++; console.log(`  ok  ${n}`); } else { falliti++; console.log(`  ✗   ${n}`); } };

if (CONTROPROVA)
  console.log('⚠️  CONTROPROVA: qui sotto il rosso è quello VOLUTO — si toglie la registrazione\n    del service worker dalla pagina SERVITA (mai dal file) e ci si aspetta che non regga.\n');

for (const [nome, scorri] of [['chi ha scorso tutta la pagina', true], ['chi l\'ha solo aperta', false]]) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();

  /* ⛔ L'INIEZIONE SI FA NELLA RISPOSTA HTTP, MAI SUL FILE: il file lo stanno
     leggendo anche gli altri, e una controprova che scrive su disco lascia il
     repository rotto se muore a metà. */
  let iniettate = 0;
  if (CONTROPROVA)
    /* ⛔ E LA REGOLA DEVE COMBACIARE CON L'INDIRIZZO VERO. La prima stesura
       usava una glob che finiva in «apps/index.html», ma la pagina si apre da
       «/apps/» — la cartella — quindi non combaciava con niente: l'iniezione
       non iniettava, il service worker restava, e la controprova diceva
       «regge lo stesso». È la terza delle cinque cause di «non distingue», e
       si riconosce solo CONTANDO le sostituzioni fatte davvero.
       ⚠️ E scrivendo QUESTO commento ho rifatto un'altra trappola già scritta:
       la glob conteneva due asterischi seguiti da una barra, cioè la sequenza
       che CHIUDE un commento a blocco. Il commento finiva lì e il resto
       diventava codice. Un esempio di codice dentro un commento va scritto
       senza i suoi delimitatori — a parole, come qui. */
    await p.route(u => /\/apps\/(index\.html)?(\?.*)?$/.test(new URL(u).pathname + new URL(u).search), async r => {
      const v = await r.fetch();
      const testo = await v.text();
      const dopo = testo.replace("navigator.serviceWorker.register('./sw.js')", "Promise.reject()");
      if (dopo !== testo) iniettate++;
      await r.fulfill({ response: v, body: dopo });
    });

  await p.goto(B + '/apps/', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  if (scorri) {
    await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } scrollTo(0, 0); });
    await p.waitForTimeout(2500);
  }
  const sw = await p.evaluate(() => navigator.serviceWorker.getRegistrations().then(r => r.map(x => x.scope)));
  const prima = await p.evaluate(() => ({ testo: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length, img: [...document.images].filter(i => i.naturalWidth > 0).length }));

  await ctx.setOffline(true);
  try { await p.reload({ waitUntil: 'load', timeout: 20000 }); } catch (_) { /* offline: ci si aspetta che possa non caricare */ }
  await p.waitForTimeout(2500);
  const dopo = await p.evaluate(() => ({
    testo: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
    img: [...document.images].filter(i => i.naturalWidth > 0).length,
    corona: document.querySelectorAll('.corona .anello a').length,
    app: new Set([...document.querySelectorAll('a[href^="/apps/"]')].map(a => a.getAttribute('href'))).size,
  })).catch(() => ({ testo: 0, img: 0, corona: 0, app: 0 }));

  console.log(`▸ ${nome}  ·  service worker: ${sw.length ? sw.join(', ') : 'NESSUNO'}`);
  /* ⛔ un'iniezione che non ha iniettato niente non fallisce: fa girare la
     controprova su un prodotto SANO, che risponde «regge» — e sembra che il
     controllo non sappia distinguere, mentre il difetto non c'era mai stato. */
  if (CONTROPROVA) {
    console.log(`    iniezioni riuscite: ${iniettate}`);
    if (!iniettate) { console.log('    ⛔ ZERO INIEZIONI: la controprova non ha toccato niente, non c\'è niente da concludere.'); falliti++; }
  }
  console.log(`    con la rete  : ${prima.testo} caratteri, ${prima.img} immagini`);
  console.log(`    SENZA la rete: ${dopo.testo} caratteri, ${dopo.img} immagini, ${dopo.corona} nomi, ${dopo.app} app collegate`);
  /* ⛔ E IL CRITERIO DEVE COMPRENDERE LE IMMAGINI, se no non distingue.
     Prima diceva «testo + otto nomi + i collegamenti», e la controprova —
     con la registrazione tolta e ZERO service worker — passava lo stesso: il
     browser si ritira fuori il DOCUMENTO dalla sua cache, quindi testo e nomi
     ci sono comunque. A cambiare erano le immagini: 88 contro **0**.
     ⚠️ E qui il righello è più mite della realtà, il che va detto: questo
     server non manda intestazioni di cache, e Chromium serve il documento
     lo stesso. Il sito vero manda `must-revalidate`, che vieta di servire
     una copia vecchia — quindi là, senza service worker, offline non ci
     sarebbe nemmeno il testo. Il criterio regge in tutt'e due i mondi perché
     guarda la cosa che manca in entrambi. */
  const regge = dopo.testo > 500 && dopo.corona === 8 && dopo.app >= 7
                && dopo.img >= Math.max(1, Math.floor(prima.img * 0.9));
  if (CONTROPROVA) prova(`${nome}: senza la registrazione NON regge`, !regge);
  else {
    prova(`${nome}: la vetrina c'è anche offline`, regge);
    prova(`${nome}: offline non perde testo`, dopo.testo >= prima.testo * 0.95);
    prova(`${nome}: le immagini già viste restano`, dopo.img >= prima.img * 0.9);
  }
  await ctx.close();
}

await b.close(); srv.chiudi();
console.log(`\nRisultato senza rete: ${passati} passati, ${falliti} falliti${CONTROPROVA ? '  ·  (controprova: il rosso qui è quello voluto)' : ''}`);
if (falliti) process.exit(1);
