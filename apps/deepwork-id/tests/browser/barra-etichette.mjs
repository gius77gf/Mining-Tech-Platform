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
/* ⛔ 430 E 320 SONO ENTRATE IL 07/08, E PER UNA RAGIONE PRECISA. Un cantiere,
   guardando uno scatto di Conti a 430 px, ha riferito che le etichette della
   barra erano tagliate — «QUADR», «ATTUR», «BANCA», «ORDIN» — e io l'ho
   riportato in due documenti **senza rimisurarlo**, che è esattamente quello
   che la regola di casa vieta: niente entra sulla parola dell'agente.
   Rimisurato: **164 voci a 430, 390, 360 e 320 px su sei app, ZERO parole più
   larghe della loro colonna** — la parola è un nodo di testo nudo dentro il
   bottone, e si misura con un `Range`, non con `querySelectorAll` (la prima
   sonda cercava uno `span` e trovava l'**icona**, 20 px su 19, in tutte e sei
   le app: un difetto finto, identico dappertutto, che è il segno che si sta
   guardando il righello invece del soggetto).
   La spiegazione la dà l'intestazione qui sotto: la colonna cresce con
   l'etichetta, quindi tagliare non è nemmeno possibile. Il difetto non c'era.
   ⚠️ Quello che 430 e 320 aggiungono davvero è **coprire le larghezze che
   qualcuno guarda**: il banco misurava 390 e 360, la segnalazione parlava di
   430, e una domanda a cui il banco non può rispondere resta aperta anche
   quando la risposta è «no». Uno scatto **propone**, una misura **decide**. */
const LARGHEZZE = [430, 390, 360, 320];
/* ⛔ 320 È ENTRATA IL 07/08, QUANDO IL DIFETTO CHE LA TENEVA FUORI È STATO
   CHIUSO. Per mezza giornata questa riga è stata `[430, 390, 360]` con accanto
   il difetto **dichiarato invece che registrato**: a 320 px la barra di
   Sentinella chiedeva **328 px di contenuto dentro 302**, e siccome `.nav` ha
   `overflow:hidden` l'ultima voce spariva in silenzio — sullo scatto si legge
   «REGISTRI RE», e l'icona di Report **non c'è**. Registrarlo qui prima della
   correzione avrebbe messo il giro in rosso su un difetto noto, cioè avrebbe
   insegnato a non guardare il giro (la stessa ragione per cui i due temi
   chiari sono entrati in `tutti.mjs` solo a palette finite).

   ⚠️ E LA NOTA PER CHI DOVEVA CORREGGERLO DICEVA UNA COSA FALSA, che vale la
   pena tenere scritta perché il numero era giusto e a sbagliare era la
   **lettura**. Diceva: «la strada ovvia è già stata provata e non funziona —
   rimpicciolire il carattere fa SALIRE il contenuto da 328 a 333». I 5 px in
   più c'erano davvero. Ma a 320 px il foglio condiviso applica già
   `@media(max-width:360px)`, cioè font **8 px** e spaziatura **.8 px**: quella
   prova non rimpiccioliva niente — scriveva 8 px dov'erano già 8 e portava la
   spaziatura da .8 a **.9**. Le sei parole contano 51 lettere, 51 × 0,1 =
   **5,1 px**, cioè esattamente i 5 comparsi. Chi misura un `@media` deve
   chiedere il valore **calcolato** al browser, non leggerlo nella regola base:
   sta in CLAUDE.md, e questa nota è costata mezza giornata a qualcun altro.
   ⚠️ Falsa anche la seconda metà: «le colonne sono `1fr`, quindi il minimo
   della barra è sei volte la colonna più larga» — sarebbe 413. Con `1fr` le
   tracce si equalizzano **solo se ci stanno**; quando non ci stanno ognuna
   resta alla propria min-content, e il minimo è la loro **somma**: 42,36 +
   68,88 + 63,42 + 66,81 + 46,19 + 40,14 = **327,8**, i 328 misurati.

   Chi governava quel minimo, chiesto alla griglia con `repeat(6,min-content)`
   invece che dedotto: ogni colonna misura **la parola più due pixel di
   padding**, alla cifra. Non l'icona (21 px, non arriva mai a governare), non
   `min-height:var(--tap)` (è verticale), non il `gap` (è fra icona e parola).
   Chiuso in `apps/sentinella/index.html` con un gradino a `max-width:345px`
   (la misura dice che fino a 345 ci sta e da 344 in giù no): 7,5 px di corpo e
   0,45 di spaziatura → **292,78 in 302**, avanzano 9,2. È la stessa leva, più
   mite, che Conti usa per dieci voci e Scudo per otto (7 px, spaziatura 0 e
   −0,1). Il commento accanto alla regola porta le misure di tutti i candidati
   e le due cose che restano aperte (2 px d'aria fra le tre parole lunghe, e i
   41,4 px di larghezza del bersaglio di tocco).
   ⚠️ E per misurare NON si usa `scrollWidth`: quando il contenuto ci sta
   risponde `clientWidth` e basta, quindi 292,78 e 302,30 si leggono tutt'e due
   «302 in 302». Qui va benissimo — al banco serve solo sapere se esce — ma chi
   sceglie fra due valori deve sommare le min-content, se no sceglie alla
   cieca il candidato che passa per 3 decimi di pixel. */

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
