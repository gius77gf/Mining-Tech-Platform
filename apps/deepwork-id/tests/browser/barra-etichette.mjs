/* ⛔ L'ETICHETTA DELLA BARRA IN BASSO CI DEVE STARE NELLA SUA COLONNA.
   ────────────────────────────────────────────────────────────────────
   La barra in basso è una griglia a colonne fisse (`--nav-cols`). Se
   l'etichetta di una voce è più larga della sua colonna succede una di due
   cose, e sono tutt'e due brutte: o esce e viene tagliata, o va **a capo** e
   alza la barra, spingendo le icone fuori posto.

   ⚠️ E QUESTO BANCO NON PRETENDE UNA MISURA UNICA, che era la prima idea e
   sarebbe stata sbagliata. Il core scrive 9 px (`.bn span`) e le app scrivono
   9, 8,5 o 8: sembrava che si fossero allontanate dal riferimento per
   pigrizia. Misurato il 01/08 rimettendo 9 px a tutte:
     · Scudo      → «Personale» 61 px su 63 di colonna, «Documenti» 59 su 62
     · Sentinella → «Monitoraggi», «Programma», «Adempimenti» escono a 390 px,
                    e a 360 ne escono CINQUE su sei
     · Conti (8 voci) e Terra → escono a 360 px
   Le parole di quelle app sono più lunghe: a parità di sei colonne 9 px **non
   è raggiungibile**, e il rimpicciolimento era l'unica cosa che si poteva
   fare. Uniformare i numeri avrebbe rotto quattro app su sei per amore di una
   simmetria che il prodotto non può avere.

   Quindi il difetto non è il numero, è che oggi la stessa decisione è presa
   **sei volte a mano** — `font-size` in una regola, `letter-spacing` in
   un'altra, `padding` in una terza, due dentro una `@media` — senza che niente
   si accorga quando una voce nuova, con una parola più lunga, smette di
   entrare. Questo banco è quel «niente». Racconto e misure:
   `docs/E8_LE_PAGINE_AFFIANCATE.md`.

   Uso:  node apps/deepwork-id/tests/browser/barra-etichette.mjs [porta]
         node …/barra-etichette.mjs [porta] --solo=scudo
         node …/barra-etichette.mjs [porta] --controprova

   ⚠️ `--solo=` non e' un lusso: aprire tutte e quattordici le superfici costa
   minuti, e una verifica che costa minuti si salta. Con `--solo=` la stessa
   domanda su una pagina costa secondi, e allora la si fa ogni volta.

   La controprova rimette il difetto — l'etichetta a 11 px, la misura che
   `dw-app-shell.css` portava prima di E0 — e pretende che il banco lo veda.
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const PORTA = +(process.argv[2] || 8823);
const CONTROPROVA = process.argv.includes('--controprova');
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const LARGHEZZE = [390, 360];

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });

let etichette = 0, superfici = 0, conBarra = 0, guai = 0;
const dettagli = [];

for (const [nome, via] of SUPERFICI) {
  if (SOLO && !nome.includes(SOLO)) continue;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(browser, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    if (CONTROPROVA) await p.addStyleTag({ content: '.nav button{font-size:11px !important}' });
    const d = await p.evaluate(() => {
      const n = document.querySelector('.nav');
      if (!n) return { voci: 0, male: [] };
      const bs = [...n.querySelectorAll('button')];
      /* ⛔ QUINTA VERSIONE, E LE QUATTRO PRIME ERANO TUTTE SBAGLIATE. Vale la
         pena elencarle, perche' il difetto era sempre lo stesso — **calcolare
         invece di chiedere**, e misurare il soggetto sbagliato:
           1. larghezza da un `Range` e righe = altezza / corpo → «TUTTE le
              etichette vanno a capo», 5 su 5, 6 su 6, 8 su 8;
           2. `Range.getClientRects().length` → «le sei voci di Sentinella a
              360 px vanno a capo». **Lo scatto della barra le mostra su una
              riga sola**;
           3. `white-space:nowrap` sul «figlio che non e' l'icona» — che NON
              ESISTE: l'etichetta e' un **nodo di testo**, e il ripiego
              misurava il bottone intero, icona compresa;
           4. avvolto il nodo di testo e confrontato con la colonna → 0 fuori
              posto **e la controprova incapace di fallire**. Misurata la
              ragione: gonfiando l'etichetta la COLONNA cresce con lei (48 →
              56 px), quindi l'etichetta non puo' mai essere tagliata.
         Quello che cede e' la **barra**: a 11 px Sentinella ha 431 px di
         contenuto in 344 di barra, e siccome `.nav` ha `overflow:hidden` le
         ultime voci spariscono **in silenzio**. La pagina resta larga 360,
         quindi `fuori-schermo` non se ne accorge, e la regola 19 conta le
         colonne ma non le misura. Nessuno guardava qui.
         La domanda giusta e' UNA, e la sa il browser: **il contenuto della
         barra sta dentro la barra?** */
      const largo = Math.round(n.scrollWidth), dentro = Math.round(n.clientWidth);
      const male = largo > dentro + 1
        ? [{ testo: bs.map((b) => (b.textContent || '').trim()).join(' · '),
             largo, col: dentro, perche: 'il contenuto della barra non ci sta nella barra' }]
        : [];
      return { voci: bs.length, male };
    });
    await ctx.close();
    if (!d.voci) continue;            // pagine senza barra: niente da misurare
    conBarra++; etichette += d.voci; guai += d.male.length;
    console.log(`  ${d.male.length ? '✗' : 'ok'}  ${nome} @${larghezza}: ${d.voci} voci`
      + (d.male.length ? ` · la barra taglia (${d.male[0].largo} su ${d.male[0].col})` : ' · il contenuto sta dentro la barra'));
    for (const m of d.male) dettagli.push(`    ⛔ ${nome} @${larghezza}: «${m.testo}» ${m.perche} (${m.largo} su ${m.col})`);
  }
  superfici++;
}
await browser.close();

for (const x of dettagli) console.log(x);
/* ⚠️ Si stampa quante etichette e quante barre si sono guardate. Le superfici
   senza barra in basso (l'accesso, il profilo, il portone di Genesi) non sono
   un errore: sono zero soggetti, e un banco che ne trovasse zero dappertutto
   direbbe «tutto a posto» senza aver misurato niente. */
console.log(`\n${etichette} etichette misurate su ${conBarra} barre (${superfici} superfici aperte) · ${guai} fuori posto`);
if (CONTROPROVA) {
  console.log(guai > 0
    ? `\n✓ controprova: con l'etichetta a 11 px il banco lo vede (${guai} fuori posto)`
    : '\n✗ controprova: con l\'etichetta a 11 px il banco NON lo vede — non sa fallire');
  process.exit(guai > 0 ? 0 : 1);
}
process.exit(guai > 0 ? 1 : 0);
