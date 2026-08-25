/* ⛔ «I nomi toccano il marchio» si misura: si campiona la rotazione a piu'
   istanti e si chiede se il rettangolo di un nome interseca quello del centro.
   Un solo istante non basta — l'anello gira, e la collisione capita a un certo
   angolo e non a un altro: guardando uno scatto solo si dichiara pulito un
   difetto che compare due secondi dopo. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente. */
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
  console.error('uso: node corona-urti <pagina.html>   (es. apps/index.html)');
  process.exit(2);
}
const srv = await servi(dirname(PAGINA));

const b = await chromium.launch();
/* ⛔ E LE LARGHEZZE DEI TELEFONI VERI MANCAVANO. Fino al 25/08 l'elenco era
   1440, 1024 e 390: sotto i 720px l'anello non c'era, quindi misurare 375 o 360
   non avrebbe detto niente. Adesso c'e', e il confine misurato sta proprio li'
   in mezzo — 360 regge, 320 no — quindi le larghezze che decidono il confine
   vanno guardate, se no il numero che lo dichiara non ha nessuno che lo tenga. */
for (const w of [1440, 1024, 430, 390, 375, 360, 320]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`http://127.0.0.1:${srv.porta}/${basename(PAGINA)}`, { waitUntil: 'networkidle' });
  const c = await p.$('.corona'); await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
  /* ⛔ A QUESTA LARGHEZZA C'E' UN ANELLO, O UNA GRIGLIA? Sotto il confine
     misurato i nomi diventano una griglia sotto il marchio, e imporre a una
     griglia la rotazione che il righello usa per campionare gli istanti
     PRODUCE il difetto invece di trovarlo: il 25/08 a 320px sono uscite 8
     collisioni e 8 nomi fuori schermo, tutte fabbricate da questa riga.
     Un righello che non sa in quale forma sia il suo soggetto misura la
     propria iniezione. */
  const anello = await p.evaluate(() =>
    getComputedStyle(document.querySelector('.corona .anello a')).position !== 'static');
  if (!anello) {
    const g = await p.evaluate(() => { let f = 0;
      document.querySelectorAll('.corona .anello a').forEach(i => {
        const q = i.getBoundingClientRect(); if (q.left < 0 || q.right > innerWidth) f++; });
      return { fuori: f, tot: document.querySelectorAll('.corona .anello a').length }; });
    console.log(`${String(w).padStart(4)}px · i nomi sono una GRIGLIA, non un anello (sotto il confine misurato) · ${g.tot} voci, ${g.fuori} fuori schermo`);
    await p.close(); continue;
  }
  /* ⛔ GLI ISTANTI SI COMANDANO, NON SI ASPETTANO. Prima si dormiva 650ms fra
     un campione e l'altro su un anello che gira di continuo: gli angoli
     misurati erano quelli che capitavano, diversi a ogni lancio. Effetto
     misurato il 25/08: due lanci sullo stesso commit hanno detto 2 e 3
     sovrapposizioni, e il secondo veniva DOPO una correzione che non poteva
     peggiorare niente — cioe' il numero si muoveva da solo. Un righello che
     non ripete la stessa misura non sa dire se una correzione ha funzionato.
     Adesso l'animazione si ferma e l'angolo si impone. */
  let urti = 0, peggio = 0, campioni = 0, nomi = 0;
  const colpevoli = [], sbordati = [];
  let fuoriTot = 0;
  for (let k = 0; k < 12; k++) {
    const r = await p.evaluate(async (g) => {
      const an = document.querySelector('.corona .anello');
      const voci = [...document.querySelectorAll('.corona .anello a')];
      if (!voci.length) return { n:0, max:0, tot:0, chi:[] };
      an.style.animation = 'none'; an.style.transform = `rotate(${g}deg)`;
      voci.forEach(v => { v.style.animation = 'none'; v.style.rotate = `${-g}deg`; });
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const cen = document.querySelector('.corona .centro').getBoundingClientRect();
      const gonf = (r, m) => ({ l: r.x - m, t: r.y - m, r: r.right + m, b: r.bottom + m });
      const C = gonf(cen, 10);
      /* ⛔ LA SECONDA DOMANDA: un nome puo' non toccare il marchio e USCIRE
         DALLO SCHERMO. Sono i due vincoli che si stringono l'uno sull'altro al
         calare della larghezza, e finche' questo righello ne guardava uno solo
         dichiarava «0 sovrapposizioni» su una corona che sborda. */
      let n = 0, max = 0, tot = 0, fuori = 0; const chi = [], usciti = [];
      voci.forEach(i => {
        const q = i.getBoundingClientRect(); tot++;
        const ox = Math.min(C.r, q.right) - Math.max(C.l, q.x);
        const oy = Math.min(C.b, q.bottom) - Math.max(C.t, q.y);
        if (ox > 0 && oy > 0) { n++; const d = Math.min(ox, oy); max = Math.max(max, d);
          chi.push(`${i.textContent.trim()} @${g}° di ${Math.round(d)}px`); }
        if (q.left < 0 || q.right > innerWidth) { fuori++;
          usciti.push(`${i.textContent.trim()} @${g}° di ${Math.round(Math.max(-q.left, q.right - innerWidth))}px`); }
      });
      return { n, max, tot, chi, fuori, usciti };
    }, k * 30);
    urti += r.n; peggio = Math.max(peggio, r.max); campioni++; nomi = r.tot;
    fuoriTot += r.fuori; colpevoli.push(...r.chi); sbordati.push(...(r.usciti||[]));
    /* ⛔ ZERO SOGGETTI NON E' ZERO DIFETTI. Cambiando i nomi da <i> ad <a>
       questo righello ha continuato a stampare «0 sovrapposizioni» — su ZERO
       nomi guardati. Un verde su un denominatore vuoto e' peggio di un rosso. */
    if (r.tot === 0) { console.log(`${w}px · ⛔ NESSUN NOME TROVATO: il selettore non aggancia piu' niente`); break; }
  }
  /* ⛔ E UN NUMERO SENZA IL SUO SOGGETTO MANDA A CERCARE ALLA CIECA: dicendo
     «3 sovrapposizioni» e basta, ho passato mezz'ora a rimpicciolire il
     marchio credendo che il colpevole fosse lui. */
  console.log(`${String(w).padStart(4)}px · ${campioni} istanti × ${nomi} nomi = ${campioni*nomi} controlli · SUL CENTRO ${urti} (la peggiore ${Math.round(peggio)}px) · FUORI SCHERMO ${fuoriTot}`);
  if (colpevoli.length) console.log(`        sul centro: ${[...new Set(colpevoli)].slice(0,5).join(' | ')}`);
  if (sbordati.length) console.log(`        fuori schermo: ${[...new Set(sbordati)].slice(0,5).join(' | ')}`);
  await p.close();
}
await b.close(); srv.chiudi();
