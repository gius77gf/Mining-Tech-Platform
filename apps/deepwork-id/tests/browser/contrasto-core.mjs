/* IL CONTRASTO DEL TESTO, MISURATO SUL RENDERIZZATO.
   Non si può leggere dal codice: i due riquadri a fondo pieno della home del
   core avevano lo sfondo scritto in linea e il colore del testo no, e il
   sottotitolo di «Progetto volata» stava a 1,12:1 — praticamente invisibile.
   Nessun test lo vedeva, nessun errore in console, la pagina si apriva.

   Soglia: 4,5:1 per il testo piccolo (WCAG 1.4.3), 3:1 per il testo grande
   (≥ 24 px, oppure ≥ 18,66 px se in grassetto).

   TRE COSE CHE UNA MISURA INGENUA SBAGLIA, tutte e tre pestate qui:
   1. **Gli sfondi a gradiente.** Il colore di fondo è trasparente e il colore
      vero sta in `background-image`. Risalendo gli antenati in cerca di un
      fondo opaco si finisce contro il nero della pagina, e un testo bianco su
      arancione risulta 19:1. Si leggono i colori del gradiente e si tiene il
      caso PEGGIORE.
   2. **La trasparenza del colore.** `rgba(20,15,4,.82)` su arancione non è nero
      pieno: va composto col fondo.
   3. **L'`opacity` degli antenati.** `.tile-feat .td-big` aveva `opacity:.85`,
      che schiariva tutto e portava 4,75 a 4,31. Si moltiplicano le opacità
      lungo la catena.
   Senza queste tre, il numero è più bello del vero — ed è il caso peggiore:
   una misura che assolve.

   Si lancia come gli altri banchi:
     node apps/deepwork-id/tests/browser/contrasto-core.mjs 8823
     node apps/deepwork-id/tests/browser/contrasto-core.mjs 8823 --controprova
*/
import { montaFintoFirebase } from './finto-firebase.mjs';

async function prendiChromium() {
  for (const dove of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs',
                      '/opt/node22/lib/node_modules/playwright/index.js']) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error('Playwright non si trova.');
  process.exit(2);
}
const chromium = await prendiChromium();

const PORTA = process.argv[2];
const CONTROPROVA = process.argv.includes('--controprova');
/* il difetto vero, com'era scritto prima: lo stile in linea che metteva il
   fondo arancione senza portarsi dietro il colore del testo */
const DIFETTO = ['<div class="tile tile-volata" onclick="nav(\'volate-list\')">',
  '<div class="tile" style="background:linear-gradient(135deg,#ff8f00,#e65100);color:#fff;border:none;position:relative;" onclick="nav(\'volate-list\')">'];

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: 430, height: 950 }, locale: 'it-IT' })).newPage();
const err = [];
p.on('pageerror', (e) => err.push(e.message));
await montaFintoFirebase(p);
await p.route('**/index.html', async (r) => {
  const res = await r.fetch();
  let corpo = await res.text();
  /* `state` del core è una variabile di modulo: per guardare la home serve un
     utente, e lo si passa da una porticina aperta solo nella pagina servita
     alla prova. Il file su disco non viene toccato. */
  const ago = 'window.fabPrimary=fabPrimary;';
  if (!corpo.includes(ago)) { console.error('✗ punto di aggancio non trovato'); process.exit(2); }
  corpo = corpo.replace(ago, ago + '\nwindow.__provaUtente=(u)=>{state.user=u;};');
  if (CONTROPROVA) {
    const prima = corpo;
    corpo = corpo.replace(DIFETTO[0], DIFETTO[1]);
    if (corpo === prima) { console.error('✗ CONTROPROVA INERTE: il riquadro non è stato trovato'); process.exit(2); }
  }
  await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: corpo });
});
await p.goto(`http://127.0.0.1:${PORTA}/index.html`);
await p.waitForTimeout(3500);
await p.evaluate(() => window.__provaUtente({ id: 'u1', user: 'prova', nome: 'Giuseppe', cognome: 'F.', ruolo: 'admin', cave: [] }));
await p.evaluate(() => window.nav('home'));
await p.waitForTimeout(900);

const misure = await p.evaluate(() => {
  const num = (c) => (c.match(/[\d.]+/g) || []).map(Number);
  const lum = (c) => {
    const [r, g, bl] = num(c);
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const sfondiDi = (el) => {
    let a = el;
    while (a) {
      const cs = getComputedStyle(a);
      const grad = cs.backgroundImage && cs.backgroundImage.match(/rgba?\([^)]*\)/g);
      if (grad && grad.length) return grad;
      const n = num(cs.backgroundColor);
      if (n.length < 4 || n[3] > 0.5) return [cs.backgroundColor];
      a = a.parentElement;
    }
    return ['rgb(0, 0, 0)'];
  };
  const opacitaEreditata = (el) => {
    let o = 1, a = el;
    while (a && a !== document.body) { o *= parseFloat(getComputedStyle(a).opacity || '1'); a = a.parentElement; }
    return o;
  };
  const composto = (fg, sf, op) => {
    const f = num(fg), s = num(sf);
    const alfa = (f.length > 3 ? f[3] : 1) * op;
    const m = (i) => Math.round(alfa * f[i] + (1 - alfa) * s[i]);
    return `rgb(${m(0)}, ${m(1)}, ${m(2)})`;
  };
  const rapporto = (f, s) => {
    const L1 = Math.max(lum(f), lum(s)), L2 = Math.min(lum(f), lum(s));
    return (L1 + 0.05) / (L2 + 0.05);
  };
  const out = [];
  document.querySelectorAll('.screen.active .tile').forEach((card) => {
    card.querySelectorAll('.tt, .td, .tt-big, .td-big').forEach((t) => {
      const testo = (t.textContent || '').trim();
      if (!testo) return;
      const cs = getComputedStyle(t);
      const op = opacitaEreditata(t);
      const sfondi = sfondiDi(t);
      const dim = parseFloat(cs.fontSize);
      const grande = dim >= 24 || (dim >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
      out.push({
        testo: testo.slice(0, 34), dim, grande,
        soglia: grande ? 3 : 4.5,
        rapporto: Math.round(Math.min(...sfondi.map((sf) => rapporto(composto(cs.color, sf, op), sf))) * 100) / 100,
      });
    });
  });
  return out;
});

let ok = 0, ko = 0;
console.log(`\n── contrasto dei riquadri della home del core${CONTROPROVA ? '  (CONTROPROVA: deve fallire)' : ''} ──`);
for (const m of misure) {
  const passa = m.rapporto >= m.soglia;
  if (passa) { ok++; console.log(`  ok  ${String(m.rapporto).padStart(6)}:1  ${m.testo}`); }
  else { ko++; console.log(`  KO  ${String(m.rapporto).padStart(6)}:1  ${m.testo}  (serve ${m.soglia}:1 a ${m.dim}px)`); }
}
if (!misure.length) { console.error('✗ nessun testo misurato: la home non si è montata'); process.exit(2); }
if (err.length) console.log('  errori pagina:', err.slice(0, 3));
console.log(`\n${ok} passate, ${ko} fallite`);
await b.close();
/* nella controprova il successo è il contrario: se NON fallisce, non sta misurando */
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
