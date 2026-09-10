/* LE ETICHETTE DELL'ASSE DI UN GRAFICO NON SI LEGGONO COME UNA PAROLA SOLA.
   Nato il 10/09 da uno scatto a 320 px: l'invecchiamento del credito di Conti
   scriveva «€ 0 € 5.000 € 10.000€15.000€20.000» — cinque etichette da 42 px
   su un asse da 126. Nessun errore, nessuna prova rossa: il numero era giusto e
   a mentire era il disegno, come la barra da 3 px del 06/08. Il conto delle
   tacche era fisso a quattro, cioè dipendeva dal VALORE e non dallo SPAZIO.
   Misurato prima di scrivere il banco, su 28 grafici con tacche delle sei app:
   a 320 px ne collidevano 3 (Conti aging e venduto, Flotta costi), a 430
   nessuno. Il motore adesso dirada le etichette (tacchePerLarghezza in
   `shared/dw-grafici.js`, provata in run-kpi): questo banco pretende che nel
   browser, con le larghezze vere di getBoundingClientRect, NESSUN grafico di
   nessuna app abbia due etichette di tacca che si toccano — sullo stesso
   asse, cioè alla stessa `y`.

   ⚠️ Le tacche SENZA TESTO non contano: il grafico a linea ne ha di vuote
   allo stesso punto (la prima misura le segnalava come «|» sovrapposte: era
   il righello, non il prodotto). E il denominatore si stampa: quanti grafici
   con tacche per app, perché «0 sovrapposizioni» su zero grafici è silenzio.

   La controprova rimette il difetto nel motore SERVITO (mai sul file): toglie
   la guardia `if (portaT[iT])` e le etichette tornano tutte — a 320 px l'aging
   di Conti deve tornare a collidere.

   Uso:  node apps/deepwork-id/tests/browser/grafici-tacche.mjs 8823
         node apps/deepwork-id/tests/browser/grafici-tacche.mjs 8823 --controprova --solo=conti
         node apps/deepwork-id/tests/browser/grafici-tacche.mjs 8823 --larghezze=320 */
import { prendiChromium, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const CHIESTE = (process.argv.find((a) => a.startsWith('--larghezze=')) || '').slice(12)
  .split(',').map((x) => +x).filter((x) => x > 0);
const LARGHEZZE = CHIESTE.length ? CHIESTE : [320, 430];
/* le app che disegnano coi grafici condivisi: il core e la vetrina non li caricano */
const APP = ['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].filter((n) => !SOLO || n === SOLO);
if (SOLO && !APP.length) { console.error(`✗ --solo=${SOLO}: non è un'app con grafici (${['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].join(', ')})`); process.exit(2); }

const GUARDIA = 'if (portaT[iT]) ';
const ROTTE = CONTROPROVA ? [['**/dw-grafici.js', (t) => t.split(GUARDIA).join('')]] : [];

/* nel browser: per ogni svg con tacche, le coppie di etichette (non vuote)
   che si toccano sullo stesso asse */
const MISURA = () => [...document.querySelectorAll('svg')]
  .filter((g) => g.querySelector('.dwg-tick') && g.getClientRects().length)
  .map((g) => {
    const t = [...g.querySelectorAll('.dwg-tick')].filter((e) => e.textContent.trim()).map((e) => {
      const r = e.getBoundingClientRect(); return { x: r.left, x2: r.right, y: Math.round(r.top), t: e.textContent };
    });
    const perY = {};
    for (const k of t) (perY[k.y] ||= []).push(k);
    const sov = [];
    for (const y in perY) {
      const a = perY[y].sort((p, q) => p.x - q.x);
      for (let i = 1; i < a.length; i++) if (a[i].x < a[i - 1].x2 + 1) sov.push(`«${a[i - 1].t}» e «${a[i].t}»`);
    }
    return { id: g.closest('[id]')?.id || '(senza id)', tacche: t.length, sov };
  });

const b = await chromium.launch();
let grafici = 0, ko = 0, appOk = 0;
for (const nome of APP) {
  const via = SUPERFICI.find(([n]) => n === nome)[1];
  let graficiApp = 0, koApp = 0;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 900, rotte: ROTTE });
    p.setDefaultTimeout(4000);
    const visti = new Set();
    for (const s of await sezioniDi(p, nome)) {
      await vaiA(p, nome, s);
      for (const g of await p.evaluate(MISURA)) {
        if (visti.has(g.id)) continue;
        visti.add(g.id); graficiApp++;
        if (g.sov.length) { koApp++; console.log(`  KO  ${nome} @${larghezza} #${g.id}: ${g.sov.length} coppie di etichette che si toccano → ${g.sov.join(', ')}`); }
      }
    }
    await ctx.close();
  }
  grafici += graficiApp; ko += koApp;
  if (!graficiApp) console.log(`  ··  ${nome}: nessun grafico con tacche visto — NON MISURATA`);
  else if (!koApp) { appOk++; console.log(`  ok  ${nome}: ${graficiApp} grafici con tacche (${LARGHEZZE.join('/')} px), nessuna etichetta sull'altra`); }
}
await b.close();
console.log(`\n${appOk} app a posto su ${APP.length}, ${grafici} grafici con tacche guardati, ${ko} con etichette sovrapposte`);
if (CONTROPROVA) console.log(ko ? '✔ CONTROPROVA OK: senza la guardia le etichette tornano a toccarsi' : '✗ CONTROPROVA FALLITA: il difetto rimesso non si vede');
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko || !grafici ? 1 : 0));
