/* ⛔ LE UNITÀ DI MISURA NON VANNO IN MAIUSCOLO — CONTROLLATO SUL RENDERIZZATO.
   Non è gusto: «m³» diventa «M³», che si legge come un'altra grandezza (M =
   mega), e «µg/m³» diventa «ΜG/M³» — Chromium trasforma la mu in mu greca
   maiuscola — cioè milligrammi, MILLE VOLTE TANTO, su un documento che il
   cliente consegna all'ente. È già successo davvero.

   Perché serve anche questo, se `run-stile.mjs` ha già la regola 2: quella
   legge il CODICE, e il difetto vero nasce dall'incontro fra una classe con
   `text-transform: uppercase` e un contenuto che quella classe non aveva
   previsto. Il 30/07 è passata inosservata «1.637 M³» in Terra: nessuna riga
   di codice era sbagliata, sbagliato era l'incontro. Solo il renderizzato lo
   vede.

   ⚠️ SI LEGGE LA TRASFORMAZIONE, NON IL TESTO. `innerText` su una scheda
   nascosta ricade su `textContent` e il maiuscolo non si vede: il maiuscolo va
   chiesto a `getComputedStyle`, che risponde comunque.

   Uso:  node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823
         node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823 --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');

/* La misura vive nella pagina. Un elemento è colpevole se la sua
   trasformazione effettiva è maiuscola E il suo testo PROPRIO contiene
   un'unità: qualunque maiuscolo la corrompe, comprese quelle che di loro
   hanno già una maiuscola (MPa → MPA). */
const CERCA = (controprova) => {
  /* le unità che compaiono nell'ecosistema. Non un'espressione generica: una
     lista, perché «t» dentro una parola non è una tonnellata e la lista con i
     confini di parola è l'unico modo di non riempire il risultato di rumore */
  const UNITA = ['m³', 'm²', 'µg/m³', 'mg/m³', 'mm/s', 'dB(A)', 'dB(L)', 'dB',
    'kg/m³', 'kg/foro', 'kg/m', 'kg', 'km/h', 'km', 'MPa', 'GPa', 'kbar', 'Hz',
    'ms/m', 'ms', 'm/kg', 't/m³', '€/m³', '€/kg', '€/foro', '€/t', '€/m',
    'cm', 'mm', 'gg', 'm³/giorno', 'm³/anno'];
  const out = [];
  if (controprova) {
    /* si sporca una superficie che è a posto, per vedere se il controllo se ne
       accorge: senza questo, «0 violazioni» può voler dire «non sto guardando» */
    const vittima = document.querySelector('.kpi .l, .badge, .sec, .name');
    if (vittima) {
      const s = document.createElement('span');
      s.textContent = ' 12 m³';
      s.style.textTransform = 'uppercase';
      s.className = 'controprova-unita';
      vittima.appendChild(s);
    }
  }
  document.querySelectorAll('body *').forEach((el) => {
    const proprio = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!proprio) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.textTransform !== 'uppercase') return;
    const unita = UNITA.find((u) => {
      const i = proprio.indexOf(u);
      if (i < 0) return false;
      /* deve essere un'unità, non un pezzo di parola: prima di lei uno spazio o
         una cifra, dopo di lei niente che continui la parola */
      const prima = i === 0 ? ' ' : proprio[i - 1];
      const dopo = proprio[i + u.length] || ' ';
      return /[\s\d(/·,]/.test(prima) && !/[a-zA-Zà-ù]/.test(dopo);
    });
    if (!unita) return;
    out.push({ unita, testo: proprio.slice(0, 46),
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 44) });
  });
  return out;
};

let ok = 0, ko = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
const visti = new Set();
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  let trovate = 0;
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    for (const v of await p.evaluate(CERCA, CONTROPROVA)) {
      const chiave = `${nome}|${v.classe}|${v.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      trovate++; ko++;
      console.log(`  KO  ${nome}: «${v.testo}» in maiuscolo — dentro c'è «${v.unita}»  .${v.classe}`);
    }
  }
  if (!trovate) { ok++; console.log(`  ok  ${nome}: nessuna unità di misura in maiuscolo`); }
  await ctx.close();
}
await b.close();
console.log(`\n${ok} superfici pulite, ${ko} violazioni`);
/* nella controprova il successo è il contrario */
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
