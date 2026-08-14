/* LA MANINA È UNA PROMESSA: una riga che mostra `cursor:pointer` dice «toccami».
   Se non fa niente, chi la tocca non pensa «la riga è ferma» — pensa di aver
   SBAGLIATO MIRA, e riprova. In un elenco lungo di scadenze o di documenti,
   riprovare due volte su una riga morta è il momento in cui l'app sembra rotta.
   È il principio dell'assenza-che-non-è-un-dato-favorevole spostato
   sull'interazione: un segnale tranquillo dove non c'è niente.

   Misurato il 01/08 su tutte e sei le app, e non era un caso isolato:
   Scudo 91 righe su 118, Conti 111 su 126, Sentinella 25 su 39, Flotta 3,
   Terra 2. Zero il difetto opposto — nessuna riga viva che non lo dica.
   Censimento e convenzione: `docs/LA_MANINA_CHE_PROMETTE.md`.

   ⚠️ QUESTO BANCO NON GUARDA LE CLASSI, e non è pignoleria: le sei app usano
   cinque convenzioni diverse (`tap`, `cliccabile`, `statico`, stile in riga,
   niente). Un controllo sulle classi misurerebbe la convenzione, non la
   promessa. Qui si mette il **cursore calcolato** contro l'**aggancio vero**.

   ⚠️ E «aggancio» ha TRE forme. La terza me l'ero persa alla prima passata, e
   Conti risultava con otto righe bugiarde che bugiarde non erano:
     1. un `onclick` sull'elemento;
     2. un `data-…` sulla riga, su cui la pagina ha una delega;
     3. essere una `<label>` con dentro un controllo — cliccabile per natura,
        senza che nessuno le attacchi niente;
     4. essere un `<a href>` — idem, e questa l'ha trovata il banco stesso alla
        prima passata su `profilo.html`, dove la riga «Amministrazione» è un
        collegamento. Due forme su quattro le ho scoperte sbagliando: il segno
        è sempre lo stesso, una riga accusata che guardando il sorgente è sana.
   Un aggancio DENTRO la riga (il bottoncino `›`) non conta: lì il bersaglio è
   il bottone, e la sua manina ce l'ha per conto suo.

   Uso:  node apps/deepwork-id/tests/browser/promesse-tocco.mjs [porta]
         node …/promesse-tocco.mjs [porta] --controprova

   La controprova rimette il difetto nella pagina — `cursor:pointer` su TUTTE
   le righe, che è il verso da cui partivano Scudo, Campo, Flotta e Terra — e
   pretende che il banco lo VEDA. Senza, non si saprebbe se sa fallire: un
   controllo che risponde «zero» su un prodotto sano e su uno rotto non
   dimostra niente.
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie, sezioniDi, vaiA } from './giro.mjs';
/* ⚠️ Il core non parte senza: tutto il suo programma sta in un `<script
   type="module">` che importa Firebase da gstatic.com, e senza rete resta
   coi segnaposto. Va montato PRIMA di aprire la pagina (vedi CLAUDE.md). */
import { montaFintoFirebase } from './finto-firebase.mjs';

const porta = +(process.argv[2] || 8931);
const CONTROPROVA = process.argv.includes('--controprova');
const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });

let vociTotali = 0, superficiViste = 0, guai = 0;
const dettagli = [];

for (const [nome, via] of SUPERFICI) {
  const { ctx, p } = await apriSuperficie(browser, { nome, via, porta, montaFintoFirebase });
  if (CONTROPROVA) {
    /* il difetto rimesso: la manina su TUTTE le righe, che e' il verso da cui
       partivano quattro app su sei. `!important` perche' deve vincere sulle
       regole locali, altrimenti l'iniezione non inietterebbe niente — ed e'
       uno dei modi in cui una controprova dice «non distingue» senza motivo. */
    await p.addStyleTag({ content: '.item{cursor:pointer !important}' });
  }
  let voci = 0, promette = [], tace = [];
  for (const sez of await sezioniDi(p, nome)) {
    await vaiA(p, nome, sez);
    await p.waitForTimeout(350);
    const righe = await p.evaluate(() =>
      [...document.querySelectorAll('.page.active .item, .screen.active .item')].map((el) => ({
        mano: getComputedStyle(el).cursor === 'pointer',
        viva: !!(el.getAttribute('onclick')
          || [...el.attributes].some((a) => a.name.startsWith('data-'))
          || (el.tagName === 'LABEL' && el.querySelector('input,select,textarea'))
          || (el.tagName === 'A' && el.getAttribute('href'))),
        cls: el.className.trim().replace(/\s+/g, '.'),
        t: (el.textContent || '').trim().slice(0, 34).replace(/\s+/g, ' '),
      })));
    for (const r of righe) {
      voci++;
      if (r.mano && !r.viva) promette.push(`${sez || '—'}: [${r.cls}] «${r.t}»`);
      if (!r.mano && r.viva) tace.push(`${sez || '—'}: [${r.cls}] «${r.t}»`);
    }
  }
  await ctx.close();
  vociTotali += voci; superficiViste++;
  const male = promette.length + tace.length;
  guai += male;
  console.log(`  ${male ? '✗' : 'ok'}  ${nome}: ${voci} voci · ${promette.length} promettono e non mantengono`
    + ` · ${tace.length} fanno e non lo dicono`);
  for (const s of promette.slice(0, 6)) dettagli.push(`    ⛔ ${nome} — ${s}`);
  for (const s of tace.slice(0, 6)) dettagli.push(`    ⚠️ ${nome} — ${s}`);
}
await browser.close();

for (const d of dettagli) console.log(d);
/* ⚠️ Si stampa QUANTE voci sono state guardate, non solo l'esito: un banco che
   non trovasse nessuna `.item` — un selettore cambiato, una pagina che non si
   apre — direbbe «zero guai» dopo aver misurato niente. È la difesa che
   `CLAUDE.md` chiede a ogni controllo nuovo. */
console.log(`\n${vociTotali} voci misurate su ${superficiViste} superfici · ${guai} promesse fuori posto`);
if (CONTROPROVA) {
  console.log(guai > 0
    ? `\n✓ controprova: col difetto rimesso il banco lo vede (${guai} promesse fuori posto)`
    : '\n✗ controprova: col difetto rimesso il banco NON lo vede — non sa fallire');
  process.exit(guai > 0 ? 0 : 1);
}
process.exit(guai > 0 ? 1 : 0);
