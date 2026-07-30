/* DUE ELEMENTI CON LO STESSO id, NELLA PAGINA VIVA.
   ────────────────────────────────────────────────────────────────────────
   È un difetto che non fa rumore: il browser non protesta, la pagina si
   apre, tutto sembra a posto. Ma `getElementById` restituisce **il primo**,
   e quindi il secondo elemento diventa irraggiungibile — e chi lo guarda non
   ha nessun modo di accorgersene.

   Trovato dal vero il 31/07, tre volte in un'ora:
   · in **Conti** due bottoni erano `btn-lis-export`. Il secondo, «Esporta
     listino (CSV)», non riceveva nessun gestore: **cliccarlo non faceva
     niente**. E con lui era irraggiungibile l'unico export che calcola i
     prezzi convertiti a tonnellata e a metro cubo.
   · in **Flotta** e in **Sentinella** due note erano `ric-esito`: quella
     sotto il form non mostrava mai niente, e la conferma di «Aggiungi»
     compariva 122 px (Flotta) e 332 px (Sentinella) più in su, lontano dal
     bottone premuto.

   ⚠️ PERCHÉ NEL BROWSER E NON SUL SORGENTE. Cercandoli nel testo dei file se
   ne trovano **45**, e quasi tutti non sono difetti: stanno dentro i modelli
   delle modali, che il browser monta uno alla volta quando servono. Una
   regola sul sorgente avrebbe dato 45 falsi allarmi e sarebbe stata spenta
   dopo due giorni. La pagina viva, visitata sezione per sezione, ne dà 3 —
   e sono tutti e tre veri.

   Uso:
     node id-unici.mjs [porta]
     node id-unici.mjs --controprova   (rimette il difetto: DEVE fallire)
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie, sezioniDi, vaiA } from './giro.mjs';
/* ⚠️ Senza, il core non parte: tutto il suo programma sta in un modulo che
   importa Firebase da gstatic.com, e qui la rete non c'è. Restano i segnaposto
   e la pagina sembra vuota — non è un difetto suo, è l'ambiente. */
import { montaFintoFirebase } from './finto-firebase.mjs';

const args = process.argv.slice(2);
const CONTROPROVA = args.includes('--controprova');
const PORTA = Number(args.find((a) => /^\d+$/.test(a))) || 8899;

/* La controprova rimette il difetto vero: due elementi con lo stesso id, come
   in Conti prima della correzione. Si inietta nel corpo servito, così il file
   su disco non viene toccato.

   ⚠️ SI PRENDE L'ULTIMO `</body>`, NON IL PRIMO. Alla prima scrittura usavo
   `replace('</body>', …)`, che sostituisce la PRIMA occorrenza — e in Terra ce
   ne sono tre, in Genesi e Campo due: le prime stanno dentro le stringhe dei
   modelli di stampa. Il difetto finiva lì, cioè dentro del testo che il browser
   non monta, e la controprova diceva «pulito» su tre superfici su nove. Una
   controprova che non arriva dappertutto non dimostra quello che sembra: per
   quelle tre non era mai stato provato che il banco sapesse fallire. */
const RIMETTI_IL_DIFETTO = (corpo) => {
  const i = corpo.lastIndexOf('</body>');
  const doppio = '<button id="dw-doppione">uno</button><button id="dw-doppione">due</button>';
  if (i < 0) return corpo + doppio;          // nessun </body>: si appende in coda
  return corpo.slice(0, i) + doppio + corpo.slice(i);
};

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;

for (const [nome, via] of SUPERFICI) {
  const { ctx, p } = await apriSuperficie(browser, {
    nome, via, porta: PORTA, montaFintoFirebase,
    trasforma: CONTROPROVA ? RIMETTI_IL_DIFETTO : null,
  });
  /* si visitano TUTTE le sezioni: metà degli elementi nasce quando una
     schermata si apre, e un id ripetuto che compare solo lì conta uguale. */
  for (const s of await sezioniDi(p, nome)) await vaiA(p, nome, s).catch(() => {});

  const doppi = await p.evaluate(() => {
    const conta = new Map();
    for (const el of document.querySelectorAll('[id]')) {
      const n = conta.get(el.id) || { n: 0, tag: [] };
      n.n++; n.tag.push(el.tagName.toLowerCase());
      conta.set(el.id, n);
    }
    return [...conta].filter(([, v]) => v.n > 1)
      .map(([id, v]) => ({ id, n: v.n, tag: [...new Set(v.tag)].join('/') }));
  });

  if (doppi.length === 0) { ok++; console.log(`  ok  ${nome}: nessun id ripetuto nella pagina viva`); }
  else {
    ko++;
    console.log(`  KO  ${nome}: ${doppi.length} id ripetuti`);
    for (const d of doppi) console.log(`        «${d.id}» ×${d.n}  (${d.tag}) — getElementById vede solo il primo`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${ok} superfici pulite, ${ko} con id ripetuti`);

/* ⚠️ IL CODICE D'USCITA DICE DUE COSE DIVERSE NEI DUE MODI, e la prima
   scrittura le confondeva: in controprova uscivo 1 perché trovavo i doppioni,
   cioè segnalavo come guasto il fatto che il banco funzionasse. Nel riepilogo
   di `tutti.mjs` risultava «KO» accanto alle altre controprove che dicono «ok».

   Il modo giusto:
   · giro normale → si esce male se una superficie ha id ripetuti;
   · controprova → si esce male se una superficie è rimasta PULITA, perché vuol
     dire che il difetto iniettato non è arrivato e per quella superficie non è
     stato dimostrato niente. È esattamente il difetto trovato il 31/07, quando
     l'iniezione finiva dentro i modelli di stampa di tre superfici su nove. */
if (CONTROPROVA) {
  if (ok > 0) {
    console.log(`\n⚠️ CONTROPROVA INCOMPLETA: su ${ok} superfici il difetto iniettato non è arrivato,`
      + " quindi lì il banco non ha dimostrato di saper fallire.");
    process.exit(1);
  }
  console.log("\nLa controprova ha trovato il difetto su tutte le superfici: il banco sa fallire.");
  process.exit(0);
}
process.exit(ko > 0 ? 1 : 0);
