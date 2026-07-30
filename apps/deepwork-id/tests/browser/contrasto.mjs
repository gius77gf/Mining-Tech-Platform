/* IL CONTRASTO DI TUTTO IL TESTO, SU TUTTE LE SUPERFICI, MISURATO SUL
   RENDERIZZATO. Estende a badge, pillole, note e tabelle la misura nata per i
   riquadri della home del core, dove un sottotitolo stava a 1,08:1 — arancione
   scuro su arancione, invisibile — senza che nessun test lo vedesse.

   Soglia: 4,5:1 per il testo piccolo (WCAG 1.4.3), 3:1 per quello grande
   (≥ 24 px, oppure ≥ 18,66 px in grassetto).

   TRE TRAPPOLE, tutte e tre nel verso che ASSOLVE — cioè il peggiore:
   1. **Sfondi a gradiente**: il colore vero sta in `background-image`, e
      cercando un fondo opaco fra gli antenati si finisce contro lo sfondo della
      pagina. Bianco su arancione risultava 19:1. Si tiene il caso peggiore fra
      i colori del gradiente.
   2. **Trasparenza del colore del testo**: va composta col fondo.
   3. **`opacity` ereditata**: `opacity:.85` su un antenato portava 4,75 a 4,31.

   Cosa NON si misura, e perché: il testo dentro le immagini e gli SVG (il
   contrasto lì non si legge dal DOM), e il testo nascosto. Le soglie di
   sicurezza e i colori scelti dal fondatore non si toccano: questo banco
   MISURA, non corregge.

   Uso:
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --solo=terra
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --tutti   (elenca anche i promossi)
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const TUTTI = process.argv.includes('--tutti');

/* La misura vive nella pagina: si passa una volta sola e si raccoglie tutto il
   testo visibile con il suo contrasto effettivo. */
const MISURA = () => {
  const num = (c) => (c.match(/[\d.]+/g) || []).map(Number);
  const lum = (c) => {
    const [r, g, b] = num(c);
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  /* IL FONDO VERO SI COMPONE, NON SI SCEGLIE. Terza volta che questa misura
     accusa il prodotto a torto: prendendo il primo `background-image` incontrato
     risalendo, gli ALONI D'AMBIENTE — gradienti quasi trasparenti come
     `rgba(255,171,0,.08)`, che nel prodotto sono luce, non fondo — venivano
     letti come tinta piena. Risultato: 183 bocciature su 228 in Genesi, su una
     pagina che si legge benissimo. Adesso si parte dal fondo della pagina e si
     spalmano sopra, uno per uno, tutti gli strati fino al testo, ciascuno con la
     sua trasparenza. Dove c'è un gradiente si tengono TUTTE le sue fermate come
     candidati, e alla fine vince il caso peggiore. */
  const mescola = (sopra, sotto) => {
    const f = num(sopra), s = num(sotto);
    if (!f.length) return sotto;
    const a = f.length > 3 ? f[3] : 1;
    if (a === 0) return sotto;
    if (a === 1) return `rgb(${f[0]}, ${f[1]}, ${f[2]})`;
    const m = (i) => Math.round(a * f[i] + (1 - a) * s[i]);
    return `rgb(${m(0)}, ${m(1)}, ${m(2)})`;
  };
  const sfondiDi = (el) => {
    const catena = [];
    for (let a = el; a; a = a.parentElement) catena.push(a);
    let fondi = ['rgb(0, 0, 0)'];               // sotto tutto c'è il nero della finestra
    for (let i = catena.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(catena[i]);
      /* Un antenato con `background-clip:text` NON dipinge nessuno sfondo: il
         suo colore è ritagliato sulle proprie lettere. Contandolo come fondo,
         un `<small>` dentro un numero a gradiente risultava a 1,25:1 su una
         scheda che si legge benissimo. È la quarta volta che questa misura
         accusa il prodotto al posto di sé stessa. */
      if ((cs.webkitBackgroundClip || cs.backgroundClip) === 'text' && catena[i] !== el) continue;
      const stop = cs.backgroundImage && cs.backgroundImage.match(/rgba?\([^)]*\)/g);
      const prossimi = new Set();
      for (const f of fondi) {
        const conColore = mescola(cs.backgroundColor, f);
        if (stop && stop.length) for (const t of stop) prossimi.add(mescola(t, conColore));
        else prossimi.add(conColore);
      }
      fondi = [...prossimi].slice(0, 12);       // basta: oltre si moltiplicano senza dire di più
    }
    return fondi;
  };
  const opacitaEreditata = (el) => {
    let o = 1, a = el;
    while (a && a !== document.documentElement) { o *= parseFloat(getComputedStyle(a).opacity || '1'); a = a.parentElement; }
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
  document.querySelectorAll('body *').forEach((el) => {
    /* solo le foglie che contengono testo proprio: prendendo anche i
       contenitori si misurerebbe più volte lo stesso testo, e con lo sfondo
       sbagliato */
    const proprio = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!proprio) return;
    /* EMOJI E SIMBOLI NON SI DIPINGONO CON `color`: il carattere porta i propri
       colori, e misurarli contro il fondo dava «📋 a 2,76:1» su icone che si
       vedono benissimo. Se non c'è nemmeno una lettera o una cifra, non è testo
       da leggere: è un disegno. */
    if (!/[\p{L}\p{N}]/u.test(proprio)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const op = opacitaEreditata(el);
    if (op < 0.06) return;                      // praticamente non si vede: non è testo
    const dim = parseFloat(cs.fontSize);
    const grande = dim >= 24 || (dim >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    /* TESTO DIPINTO COL GRADIENTE (`background-clip:text`). Lì `color` è
       trasparente e la tinta del testo È il gradiente dell'elemento: leggendo
       `color` si misura il nulla contro sé stesso e viene 1:1 su cifre che sullo
       schermo si leggono benissimo. Il colore lo danno le fermate del gradiente,
       lo sfondo lo dà l'antenato. Trovato su diciannove numeri di Terra: la
       misura accusava il prodotto, come tante altre volte. */
    /* IL TESTO DENTRO UN SVG si dipinge con `fill`, non con `color`: leggendo
       `color` si misura un colore ereditato che sullo schermo non c'è. È così
       che «µg/m³» dentro un grafico risultava a 1,25:1. */
    const dentroSvg = el.ownerSVGElement || el.tagName.toLowerCase() === 'svg';
    const ritaglio = cs.webkitBackgroundClip || cs.backgroundClip;
    let sfondi, inchiostri;
    if (dentroSvg) {
      const f = cs.fill;
      if (!f || f === 'none') return;
      inchiostri = [f];
      sfondi = sfondiDi(el.ownerSVGElement ? el.ownerSVGElement.parentElement || el : el);
    } else if (ritaglio === 'text') {
      const stop = (cs.backgroundImage || '').match(/rgba?\([^)]*\)/g);
      if (!stop || !stop.length) return;
      inchiostri = stop;
      sfondi = sfondiDi(el.parentElement || document.body);
    } else {
      inchiostri = [cs.color];
      sfondi = sfondiDi(el);
    }
    out.push({
      testo: proprio.slice(0, 40),
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
      dim, grande, soglia: grande ? 3 : 4.5,
      rapporto: Math.round(Math.min(...sfondi.flatMap((sf) =>
        inchiostri.map((inc) => rapporto(composto(inc, sf, op), sf)))) * 100) / 100,
    });
  });
  return out;
};

const b = await chromium.launch({ executablePath: CHROMIUM });
let misurati = 0, bocciati = 0;
const visti = new Set();

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  console.log(`\n══════ ${nome} ══════`);
  const { ctx, p, errori } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  const sezioni = await sezioniDi(p, nome);
  let bocciatiQui = 0, misuratiQui = 0;
  for (const s of sezioni) {
    await vaiA(p, nome, s);
    const misure = await p.evaluate(MISURA);
    for (const m of misure) {
      /* lo stesso testo con la stessa classe si incontra su più schermate:
         si segnala una volta sola, altrimenti l'elenco è illeggibile */
      const chiave = `${nome}|${m.classe}|${m.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      misurati++; misuratiQui++;
      const passa = m.rapporto >= m.soglia;
      if (!passa) {
        bocciati++; bocciatiQui++;
        console.log(`  KO  ${String(m.rapporto).padStart(6)}:1  (serve ${m.soglia})  ${m.dim}px  «${m.testo}»  .${m.classe}`);
      } else if (TUTTI) {
        console.log(`  ok  ${String(m.rapporto).padStart(6)}:1  «${m.testo}»`);
      }
    }
  }
  console.log(`  ${misuratiQui} testi misurati, ${bocciatiQui} sotto soglia`);
  if (errori.length) console.log('  ⚠ errori pagina:', errori.slice(0, 2));
  await ctx.close();
}

await b.close();
console.log(`\n${misurati} testi misurati in tutto, ${bocciati} sotto soglia`);
process.exit(bocciati ? 1 : 0);
