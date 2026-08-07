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
/* le unità che compaiono nell'ecosistema. Non un'espressione generica: una
   lista, perché «t» dentro una parola non è una tonnellata e la lista con i
   confini di parola è l'unico modo di non riempire il risultato di rumore */
/* «h» (l'ora) è entrata il 30/07 insieme a `UNITA_DA_SALVARE` in
   `shared/deepwork-id-client/dw-shell.js`: là c'è scritto perché lei sì e il
   litro no. Sta in fondo per la stessa ragione — «km/h» e «m³/h» vanno
   riconosciute prima, o si segnalerebbe l'ora dentro una velocità. */
/* ⛔ «t» E «mc» NUDE SONO ENTRATE IL 06/08, E L'ELENCO SENZA DI LORO ERA CIECO
   PROPRIO SULL'UNITÀ PIÙ COMUNE IN CAVA. Il banco diceva «nessuna unità in
   maiuscolo» mentre in Conti erano a schermo — e su un DDT stampato — «LORDO
   (T)», «TARA (T)», «NETTO (T)»: la tonnellata diventata un tesla. Misurato
   rimettendo il difetto vero (6 punti) su una copia di `HEAD`: con l'elenco
   vecchio **0 violazioni**, con «t» dentro **2**. E il costo del rumore è
   stato misurato PRIMA di cambiare, non dopo: elenco esteso su tutte e
   **quattordici** le superfici pulite, **0 falsi allarmi**. «mc» è una unità
   vera del core (`${m.mc} mc`) e di Conti (colonna del listino), non
   un'ipotesi. Stanno in fondo con «h» per la stessa ragione d'ordine. */
const UNITA = ['m³', 'm²', 'µg/m³', 'mg/m³', 'mm/s', 'dB(A)', 'dB(L)', 'dB',
  'kg/m³', 'kg/foro', 'kg/m', 'kg', 'km/h', 'km', 'MPa', 'GPa', 'kbar', 'Hz',
  'ms/m', 'ms', 'm/kg', 't/m³', '€/m³', '€/kg', '€/foro', '€/t', '€/m',
  'cm', 'mm', 'gg', 'm³/giorno', 'm³/anno', 'h', 'mc', 't'];

const CERCA = ({ controprova, UNITA }) => {
  const out = [];
  if (controprova) {
    /* ⛔ LA CONTROPROVA SI MISURA ANCHE NELLA COPERTURA, NON SOLO NELL'ESITO.
       Fino al 06/08 sporcava la pagina con **una** unità sola («12 m³») e
       chiedeva «hai visto qualcosa?»: sapere fallire su una delle trentacinque
       non dice niente sulle altre trentaquattro — ed era esattamente il caso,
       perché «t» non era nemmeno in elenco e la controprova diceva ok. Adesso
       inietta **una riga per ogni unità** e pretende che siano riconosciute
       tutte, stampando il conto. */
    const box = document.createElement('div');
    box.id = 'dw-cp-unita';
    box.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#fff';
    for (const u of UNITA) {
      const s = document.createElement('span');
      s.textContent = ' 12 ' + u;
      s.style.textTransform = 'uppercase';
      s.style.display = 'inline-block';
      s.className = 'controprova-unita';
      s.dataset.cp = u;
      box.appendChild(s);
    }
    document.body.appendChild(box);
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
    out.push({ unita, testo: proprio.slice(0, 46), cp: el.dataset.cp || '',
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 44) });
  });
  return out;
};

let ok = 0, ko = 0, superfici = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
const visti = new Set();
const riconosciute = new Set();   // solo controprova: quali unità iniettate sono state viste
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  superfici++;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  let trovate = 0;
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    for (const v of await p.evaluate(CERCA, { controprova: CONTROPROVA, UNITA })) {
      if (v.cp) { riconosciute.add(v.cp); continue; }   // è la nostra iniezione, non il prodotto
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

if (CONTROPROVA) {
  /* ⛔ IL VERDETTO È LA COPERTURA, NON «HO VISTO QUALCOSA». Un'unità che
     l'elenco contiene ma che il confine di parola non lascia mai passare è un
     buco silenzioso: qui si vede, perché resta fuori dal conto. */
  const mancanti = UNITA.filter((u) => !riconosciute.has(u));
  console.log(`\ncontroprova su ${superfici} superfici: ${UNITA.length - mancanti.length}/${UNITA.length}`
    + ` unità riconosciute quando sono in maiuscolo`);
  if (mancanti.length) console.log(`  NON riconosciute: ${mancanti.join(', ')}`);
  process.exit(mancanti.length ? 1 : 0);
}

console.log(`\n${ok} superfici pulite, ${ko} violazioni  ·  ${UNITA.length} unità cercate su ${superfici} superfici`);
process.exit(ko > 0 ? 1 : 0);
