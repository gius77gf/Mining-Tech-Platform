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
         node …/barra-etichette.mjs [porta] --tema=chiaro   (o --tema=sole)
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
/* ⛔ IL TEMA È TRE, E FINO AL 07/08 QUESTO BANCO NE GUARDAVA UNO — e quel buco
   ha lasciato passare un difetto grosso, non una sfumatura. Le verticali
   girano fra `scuro`, `chiaro` e `sole` con `shared/dw-tema.js`; il sole è il
   tema per chi legge il telefono IN CAVA, cioè il posto dove il prodotto vive.
   Nel sole `body.dw.outdoor-mode .nav button{font-size:11px}` ha specificità
   (0,3,2) e **batte ogni gradino** del foglio condiviso: le `@media` di
   `dw-app-shell.css` scrivono 8,5 / 8 px con una specificità più bassa e non
   mordono. Effetto misurato prima della correzione, e siccome `.nav` ha
   `overflow:hidden` quello che esce **sparisce in silenzio**:
     · Sentinella tagliata a TUTTE le larghezze (453 in 410 a 430 px, fino a
       441 in 300 a 320 px: **due voci intere** che non ci sono più);
     · Flotta a 320 px: 316 in 300;
     · Terra  a 320 px: 311 in 300.
   Nessuna di queste era visibile al buio, dove il banco era verde.
   ⛔ E CHI NON HA IL TEMA VA DICHIARATO NON MISURATO, NON CONTATO A POSTO —
   la difesa è copiata da `contrasto.mjs`, che l'ha pagata: la domanda giusta
   non è «la classe è rimasta attaccata?» ma «questa superficie SA che cos'è
   questo tema?». `sole` e `chiaro` sono concetti di `shared/dw-tema.js`, e chi
   non lo carica non ha `window.dwTema`. Sono otto superfici su quattordici
   (elencate con la ragione nella regola 27 di `run-stile.mjs`): il core, che
   ha due temi suoi, la vetrina, Genesi e le pagine del servizio comune. Un
   tema che non si accende non è un tema che passa. */
const TEMA = (process.argv.find((a) => a.startsWith('--tema=')) || '').slice(7);
const CLASSE_TEMA = { chiaro: 'light-mode', sole: 'outdoor-mode' };
if (TEMA && !CLASSE_TEMA[TEMA]) {
  console.error(`✗ tema sconosciuto: «${TEMA}». Sono ${Object.keys(CLASSE_TEMA).join(', ')} (o niente per il buio).`);
  process.exit(2);
}
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

let etichette = 0, superfici = 0, conBarra = 0, guai = 0, tagliate = 0;
const perSuperficie = {};
const senzaMisura = [];
const dettagli = [];
const temaRifiutato = [];
let temaMisurate = 0;

for (const [nome, via] of SUPERFICI) {
  if (SOLO && !nome.includes(SOLO)) continue;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(browser, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    if (TEMA) {
      /* si scrive la chiave che `dw-tema.js` rilegge E si chiama la sua
         funzione: la classe appiccicata a mano verrebbe tolta al primo
         `applica()`, e la chiave da sola arriverebbe troppo tardi (la pagina è
         già aperta). Poi si PRETENDE che la classe ci sia: se non c'è, questa
         superficie quel tema non ce l'ha. */
      const messa = await p.evaluate(({ cls, t }) => {
        if (!window.dwTema) return false;
        try { localStorage.setItem('dw-tema', t); } catch (e) { /* niente */ }
        window.dwTema(t);
        return document.body.classList.contains(cls);
      }, { cls: CLASSE_TEMA[TEMA], t: TEMA });
      if (!messa) {
        await ctx.close();
        console.log(`  ⚠️  ${nome} non ha il tema «${TEMA}»: NON misurata (non carica dw-tema.js).`);
        temaRifiutato.push(nome);
        break;                        // le altre larghezze direbbero la stessa cosa
      }
      if (larghezza === LARGHEZZE[0]) temaMisurate++;
    }
    if (CONTROPROVA) await p.addStyleTag({ content: '.nav button,.bnav button{font-size:11px !important}' });
    const d = await p.evaluate(() => {
      /* ⛔ DUE SELETTORI, E IL SECONDO È IL CORE (07/08). Le barre delle app
         sono `.nav`; quella in basso del core è **`.bnav`** (`id="global-nav"`).
         Con il solo `.nav` questo banco APRIVA il core e non trovava nessuna
         barra, e stampava — a ogni giro, da mesi — «0 etichette misurate su 0
         barre (1 superfici aperte) · 0 fuori posto»: un numero che si legge «a
         posto» e vuol dire «non ho guardato». È la famiglia dello «0 modali su
         68», e la regola che la prende è scritta in CLAUDE.md: *se un elenco di
         soggetti è copiato dalla forma di un'app, provarlo su una superficie
         che quella forma non ce l'ha*. Qui il soggetto è un SELETTORE, che è la
         stessa cosa in una veste diversa. */
      const n = document.querySelector('.nav, .bnav');
      /* ⛔ E NON BASTA TROVARLA: VA PRETESA VISIBILE E PIENA, se no si passa da
         uno zero evidente a un VERDE FALSO, che è peggio. Misurato il 07/08
         allargando il selettore per il core: `.bnav#global-nav` esiste, ma in
         questo stato è `offsetParent === null` e contiene **un bottone solo,
         senza testo** — la barra vera la riempie il programma più tardi. Con la
         sola aggiunta del selettore il banco passava da «0 barre» (che almeno
         si vede) a «1 voce · 0 fuori posto», cioè dichiarava di aver misurato
         una barra che non c'era. Adesso una barra nascosta o vuota si dichiara
         NON MISURATA e finisce nel conto in fondo, dove le righe «non ho
         guardato» vanno lette per prime. */
      /* ⚠️ E LA VISIBILITÀ NON SI CHIEDE A `offsetParent`: su un elemento
         `position:fixed` risponde **null** anche quando l'elemento è
         perfettamente visibile — e OGNI barra in basso è fissa. Provato prima
         di committare, su Conti: la guardia scritta così dichiarava «barra
         nascosta» su tutte e quattro le larghezze e avrebbe portato la
         copertura del banco da 164 etichette a ZERO, cioè avrebbe spento il
         controllo per correggere un buco. Si chiede al rettangolo e al
         `display`, che rispondono alla domanda vera. */
      const st = n && getComputedStyle(n);
      const r = n && n.getBoundingClientRect();
      if (!n || !st || st.display === 'none' || st.visibility === 'hidden' || !r.width || !r.height)
        return { voci: 0, male: [], nonMisurata: 'barra nascosta' };
      /* ⚠️ E «vuota» si misura sulle ETICHETTE, non sui bottoni: la `.bnav` del
         core è visibile e contiene UN bottone SENZA testo — la barra vera la
         riempie il programma più tardi. Contando i bottoni, il banco tornava a
         dire «1 voce · 0 fuori posto», cioè un verde su una barra che non c'è:
         il difetto che questa guardia esiste per impedire, in terza stesura. */
      /* ⛔ E QUESTA GUARDIA HA TENUTO IL CORE FUORI DAL BANCO PER DUE GIORNI,
         CON UNA DIAGNOSI INVENTATA. Chiedeva `querySelectorAll('button')` — la
         forma delle sei app — e il core le voci le ha come `<div class="bn">`:
         quindi rispondeva sempre zero, usciva di qui, e la riga sotto che
         allarga la ricerca a `.bn` (commit `4ac0790`, lo stesso giorno di
         questa guardia) **non veniva mai raggiunta**. Widening morto dal
         giorno in cui è stato scritto.
         ⚠️ Il danno non è il buco: è che la frase stampata nel registro —
         «barra senza etichette (**non ancora costruita**)» — è una **causa
         inventata dal banco**, e falsa. La barra del core è costruita e piena;
         quello che manca è nel righello. Chi leggeva quella riga per due giorni
         pensava a un problema di tempi e non andava a guardare.
         La regola: **la domanda «ci sono etichette?» e la domanda «quanto
         larghe sono?» devono guardare la STESSA lista.** Finché sono due
         elenchi, allargarne uno solo non produce un errore — produce una
         cecità che si dichiara con parole rassicuranti. Adesso la lista è una
         (`VOCI`), e quando non trova niente lo dice **senza inventarsi il
         perché**. */
      const VOCI = 'button, .bn';
      const conParola = [...n.querySelectorAll(VOCI)]
        .filter((x) => !x.classList.contains('nav-fab'))
        .filter((x) => [...x.querySelectorAll('span')].concat(x)
          .some((y) => [...y.childNodes].some((z) => z.nodeType === 3 && z.textContent.trim())));
      if (!conParola.length)
        return { voci: 0, male: [], nonMisurata: `nessuna voce con un'etichetta fra «${VOCI}»` };
      /* ⛔ LE VOCI NON SONO SEMPRE `<button>`, e per questo la barra del core
         non la misurava nessuno. Nelle sei app le voci sono `<button>`; nel
         core sono **`<div class="bn">`**, e l'unico `<button>` dentro
         `#global-nav` e' il pulsante centrale (`.nav-fab`) — che di etichetta
         non ne ha. Cercando `button` il banco trovava quindi UNA voce senza
         parola e rispondeva «1 voce · 0 fuori posto»: un verde su una barra
         che non aveva nemmeno guardato.
         `.bn` e' del core soltanto — misurato: 4 nel core, ZERO in tutt'e sei
         le app — quindi allargare qui non conta niente due volte. E il FAB
         resta fuori di proposito: e' un comando, non una voce di navigazione,
         e la sua etichetta e' l'`aria-label`. */
      const bs = conParola;   /* la STESSA lista della guardia qui sopra */
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
      /* ⛔ E QUESTA E' LA SECONDA DOMANDA, che il 07/08 ha trovato piu' della
         prima. La domanda di sopra e' sulla BARRA, e c'e' un modo di renderla
         cieca senza volerlo: se il BOTTONE ha `overflow:hidden`, la sua
         min-content va a zero, le colonne della griglia non crescono, la barra
         non trabocca **mai** e il banco risponde «ok» qualunque cosa succeda
         alle parole. E' il caso di Conti, che ha `overflow:hidden` sul bottone
         dal giorno in cui gli sono state date dieci voci: nel tema sole
         tagliava **otto etichette a 430 px e dieci a 320**, e questo banco le
         dichiarava a posto a ogni larghezza.
         La domanda giusta e' la stessa un piano piu' sotto — *il contenuto del
         BOTTONE sta dentro il bottone?* — ed e' la lezione di `fuori-schermo`,
         che chiedeva «esce dallo schermo?» mentre la pillola usciva dal proprio
         riquadro. Vale per tutt'e due i casi: con `overflow:hidden` la parola
         viene tagliata, senza viene stampata sopra la vicina. */
      /* ⚠️ E LA PRIMA STESURA DI QUESTA SECONDA DOMANDA CHIEDEVA
         `scrollWidth > clientWidth` SUL BOTTONE, che e' sbagliato per una
         ragione che si vede solo misurando: in un bottone `.active` c'e' la
         **pastiglia** `::before`, che e' piu' larga del bottone di proposito.
         Scudo a 320 px veniva accusato con «40 su 37» mentre la parola
         «Quadro» ne chiede **30,5**: un difetto finto, e sempre sulla PRIMA
         voce — che e' il segno che si sta guardando il righello, non il
         soggetto. Si misura la PAROLA, che e' un nodo di testo nudo e vuole un
         `Range` (`querySelectorAll` non vede una scatola anonima).
         ⚠️ Contro l'obiezione gia' scritta qui sopra al punto 4 — «gonfiando
         l'etichetta la COLONNA cresce con lei, quindi non puo' essere
         tagliata» — vale la differenza che rende vero questo caso: dove le
         colonne sono FISSE (`--nav-cols`) e il bottone ha `overflow:hidden`,
         la colonna **non** cresce, e la parola viene tagliata dentro di lei
         senza che la barra trabocchi di un pixel. */
      const parolaDi = (btn) => {
        for (const nodo of btn.childNodes) {
          if (nodo.nodeType !== 3 || !nodo.textContent.trim()) continue;
          const rg = document.createRange();
          rg.selectNodeContents(nodo);
          return { testo: nodo.textContent.trim(), largo: rg.getBoundingClientRect().width };
        }
        /* ⛔ E NEL CORE LA PAROLA STA DENTRO UNO `<span>`, non nuda. Senza
           questo ripiego le quattro voci del core si misuravano «senza
           parola», cioe' zero etichette, cioe' di nuovo un verde su niente.
           Si prende il primo figlio che porta SOLO testo — l'icona e' un
           `<svg>` e non ne porta — e lo si misura con lo stesso `Range`: la
           domanda resta «quanto e' larga la parola», non «quanto e' largo il
           bottone». */
        for (const el of btn.children) {
          if (el.tagName === 'SVG' || el.tagName === 'svg') continue;
          const testo = (el.textContent || '').trim();
          if (!testo || el.children.length) continue;
          const rg = document.createRange();
          rg.selectNodeContents(el);
          return { testo, largo: rg.getBoundingClientRect().width };
        }
        return null;
      };
      const strette = [];
      for (const x of bs) {
        const w = parolaDi(x);
        if (w && w.largo > x.clientWidth + 0.5) strette.push({ ...w, col: x.clientWidth });
      }
      if (strette.length) {
        male.push({ testo: strette.map((x) => x.testo).join(' · '),
          largo: +Math.max(...strette.map((x) => x.largo)).toFixed(1),
          col: +Math.min(...strette.map((x) => x.col)).toFixed(1),
          dentroIlBottone: true,
          perche: `${strette.length} parole non ci stanno nel proprio bottone` });
      }
      return { voci: bs.length, male, tagliate: strette.length };
    });
    await ctx.close();
    /* ⛔ E LA RAGIONE PER CUI NON SI E' MISURATO VA CONTATA, non saltata in
       silenzio: «pagina senza barra» e «barra che c'e' ma e' nascosta o vuota»
       sono due cose diverse, e la seconda e' un buco del BANCO, non del
       prodotto. Finiscono nella riga «non ho guardato» in fondo. */
    if (d.nonMisurata) { senzaMisura.push(`${nome}@${larghezza}: ${d.nonMisurata}`); continue; }
    if (!d.voci) continue;            // pagine senza barra: niente da misurare
    conBarra++; etichette += d.voci; guai += d.male.length; tagliate += (d.tagliate || 0);
    perSuperficie[nome] = (perSuperficie[nome] || 0) + d.male.length;
    console.log(`  ${d.male.length ? '✗' : 'ok'}  ${nome} @${larghezza}: ${d.voci} voci`
      + (d.male.length
        ? ' · ' + d.male.map((m) => m.dentroIlBottone
            ? `${m.perche} (la più stretta ${m.col} px per ${m.largo} di parola)`
            : `la barra taglia (${m.largo} su ${m.col})`).join(' · ')
        : ' · ogni parola sta nel suo bottone, e i bottoni nella barra'));
    for (const m of d.male) dettagli.push(`    ⛔ ${nome} @${larghezza}: «${m.testo}» ${m.perche} (${m.largo} su ${m.col})`);
  }
  superfici++;
}
await browser.close();

for (const x of dettagli) console.log(x);
/* ⛔ PRIMA DI TUTTO: le barre TROVATE ma non misurabili. Il core sta qui — la
   sua `.bnav#global-nav` esiste, ma in questo stato e' nascosta e vuota, quindi
   la barra vera del core NON la misura ancora nessuno. Dichiararlo e' l'unica
   cosa che impedisce a un «0 fuori posto» di sembrare una promozione. */
if (senzaMisura.length) {
  console.log(`\n   ⚠️ ${senzaMisura.length} barre TROVATE ma NON misurate — non vuol dire «a posto»:`);
  for (const x of senzaMisura) console.log(`      · ${x}`);
}
/* ⛔ PRIMA DEI KO: quante superfici ha davvero guardato con questo tema. Un
   «zero fuori posto» ottenuto su due superfici su quattordici non è una buona
   notizia, ed è la riga «non ho guardato» che CLAUDE.md dice di leggere per
   prima. */
if (TEMA) {
  console.log(`\n   TEMA «${TEMA}»: ${temaMisurate} superfici misurate`
    + (temaRifiutato.length
      ? `, ${temaRifiutato.length} NON misurate perché non hanno questo tema (${temaRifiutato.join(', ')})`
      : ''));
}
/* ⚠️ Si stampa quante etichette e quante barre si sono guardate. Le superfici
   senza barra in basso (l'accesso, il profilo, il portone di Genesi) non sono
   un errore: sono zero soggetti, e un banco che ne trovasse zero dappertutto
   direbbe «tutto a posto» senza aver misurato niente. */
console.log(`\n${etichette} etichette misurate su ${conBarra} barre (${superfici} superfici aperte)`
  + ` nel tema «${TEMA || 'scuro'}» · ${guai} fuori posto`);
/* le due domande si contano separate: sapere QUALE ha morso dice dove guardare,
   e un totale unico le confonderebbe (la seconda, da sola, non allarga mai la
   barra — taglia dentro il bottone e la barra resta serena). */
console.log(`   di cui ${tagliate} etichette tagliate DENTRO il proprio bottone`
  + ' — la domanda che una barra con `overflow:hidden` sul bottone non può sentirsi fare.');
if (CONTROPROVA) {
  /* ⛔ E IL VERDETTO SI SCOMPONE, se no una superficie che il difetto non lo sa
     produrre si nasconde dentro il totale. Il core è entrato in questo banco
     oggi e ha quattro parole corte in una barra larga: gonfiarle a 11 px non
     la fa traboccare, e va bene così — quello che NON va bene è che il totale
     dica «✓» senza far vedere quel numero. È la lezione già pagata due volte:
     ogni addendo ha un lettore che lo conosce, il totale no. */
  const mute = Object.entries(perSuperficie).filter(([, n]) => !n).map(([s]) => s);
  console.log(guai > 0
    ? `\n✓ controprova: con l'etichetta a 11 px il banco lo vede (${guai} fuori posto)`
      + (mute.length ? `\n   ⚠️ ma su ${mute.length} superfici l'iniezione non morde: ${mute.join(', ')}`
        + ' — la loro barra ha spazio da vendere, quindi lì questa controprova non dimostra niente' : '')
    : '\n✗ controprova: con l\'etichetta a 11 px il banco NON lo vede — non sa fallire');
  process.exit(guai > 0 ? 0 : 1);
}
process.exit(guai > 0 ? 1 : 0);
