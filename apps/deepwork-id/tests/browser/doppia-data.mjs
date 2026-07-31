/* ⛔ UN TEMPO RELATIVO PORTA CON SÉ LA DATA — CONTROLLATO SUL RENDERIZZATO.
   ────────────────────────────────────────────────────────────────────────
   Il dettaglio 8 di `docs/RICERCA_VALORE_PRODOTTO_202607.md`: le date vanno in
   **doppia forma**, «scade tra 5 giorni (12/08/2026)». La ragione è pratica e
   non estetica: il tempo relativo si capisce al volo mentre si scorre un
   elenco, ma la data assoluta è quella che serve quando si ha l'ente al
   telefono, o quando si scrive un'email — e «fra cinque giorni» letto domani
   vuol dire un altro giorno.

   ⚠️ PERCHÉ QUESTO BANCO ESISTE E NON UNA REGOLA IN `run-stile.mjs`.
   Ci ho provato, leggendo il codice, e la misura era da buttare: Campo, Scudo
   e Terra risultavano a **zero** tempi relativi — non credibile per app con
   uno scadenzario — e tre degli otto «trovati» erano un commento, un `<label>`
   e un attributo `title`. Il motivo è strutturale: il tempo relativo **nasce
   al momento del disegno**, composto da variabili che ogni app chiama a modo
   suo (`ritardo`, `gg`, `giorniTra`). Nel sorgente non c'è una forma da
   cercare; nella pagina sì. È la stessa ragione per cui le unità in maiuscolo
   si controllano qui e non nel CSS.

   Cosa si pretende: se un testo dice «tra N giorni», «scaduta da N giorni»,
   «in ritardo di N giorni», allora **nello stesso elemento** (o in quello che
   lo contiene, che è ciò che l'occhio legge come una riga sola) deve comparire
   anche una data in cifre.

   Uso:
     node apps/deepwork-id/tests/browser/doppia-data.mjs 8823
     node apps/deepwork-id/tests/browser/doppia-data.mjs 8823 --solo=scudo
     node apps/deepwork-id/tests/browser/doppia-data.mjs 8823 --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const MARCA = 'scade tra 5 giorni';

const CERCA = () => {
  /* le forme con cui in italiano si scrive un tempo relativo. Con il numero
     dentro, perché «in scadenza» senza numero non promette nessuna data. */
  const RELATIVO = /\b(tra|fra)\s+\d+\s*(giorn|gg|mes|settiman)|scadut[ao]\s+da\s+\d+|in ritardo di\s+\d+|\d+\s*(giorni|gg)\s+fa\b/i;
  /* una data in cifre: 12/08/2026, 12-08-2026, 2026-08-12 — e anche il solo
     giorno/mese, 08/08.
     ⚠️ L'anno NON si pretende, e l'ha insegnato la prima esecuzione di questo
     banco: Flotta scrive «Fra 8 giorni (~08/08)», che è esattamente la doppia
     forma chiesta dalla ricerca, in versione compatta perché parla di una
     proiezione a otto giorni (e la tilde dice che è una stima). Pretendere
     l'anno avrebbe segnalato come difetto una riga scritta bene: il banco
     sbagliava, non il prodotto. È la correzione giusta e non un allentamento —
     «08/08» una data lo è davvero. */
  const DATA = /\b\d{1,2}[\/\-.]\d{1,2}([\/\-.]\d{2,4})?\b|\b\d{4}-\d{2}-\d{2}\b/;
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
    const proprio = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!proprio || !RELATIVO.test(proprio)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    /* ⚠️ NON basta guardare il testo PROPRIO. Quello che l'occhio legge come
       una riga sola è spesso spezzato in più elementi — «scade tra 5 giorni»
       in uno `<span>` e «(12/08/2026)» in quello accanto. Se si guardasse solo
       il testo proprio si segnalerebbero come colpevoli proprio le righe
       scritte BENE. Si guarda quindi il testo del contenitore, salendo finché
       si resta dentro una riga ragionevole. */
    let contesto = proprio, su = el;
    for (let i = 0; i < 3 && su.parentElement; i++) {
      su = su.parentElement;
      const t = (su.innerText || su.textContent || '').trim();
      if (t.length > 400) break;          // troppo grande: non è più «la riga»
      contesto = t;
      if (DATA.test(contesto)) break;
    }
    if (DATA.test(contesto)) return;      // la data c'è: a posto
    out.push({
      testo: proprio.slice(0, 60),
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
    });
  });
  return out;
};

let ok = 0, ko = 0, misurati = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
const visti = new Set();
let superficiProvate = 0;
const superficiCieche = [];

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  if (CONTROPROVA) {
    /* il veleno: un tempo relativo senza nessuna data accanto */
    await p.evaluate((marca) => {
      const d = document.createElement('div');
      d.className = 'controprova-data';
      d.textContent = marca;
      document.body.appendChild(d);
    }, MARCA);
  }
  let trovate = 0, presa = 0;
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s).catch(() => {});
    for (const v of await p.evaluate(CERCA)) {
      const chiave = `${nome}|${v.classe}|${v.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      misurati++;
      if (v.testo.startsWith(MARCA)) { presa++; continue; }   // è il veleno
      trovate++; ko++;
      console.log(`  KO  ${nome}: «${v.testo}» dice quanto manca ma non quando  .${v.classe}`);
    }
  }
  if (CONTROPROVA) { superficiProvate++; if (!presa) superficiCieche.push(nome); }
  if (!trovate) { ok++; console.log(`  ok  ${nome}: ogni tempo relativo porta con sé la data`); }
  await ctx.close();
}
await b.close();
console.log(`\n${ok} superfici a posto, ${ko} tempi relativi senza data`);

if (CONTROPROVA) {
  console.log(`${superficiProvate} superfici avvelenate, ${superficiProvate - superficiCieche.length} l'hanno vista`);
  if (superficiCieche.length === 0) {
    console.log('La controprova è stata trovata su tutte le superfici: il banco sa fallire.');
    process.exit(0);
  }
  console.log(`\n⚠️ CONTROPROVA INCOMPLETA: su ${superficiCieche.join(', ')} il tempo relativo senza data è passato.`);
  process.exit(1);
}
process.exit(ko > 0 ? 1 : 0);
