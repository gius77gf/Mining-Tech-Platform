/* CHE COSA SI VEDE DENTRO LE MODALI — aprendole tutte, non una per app.
   ══════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE. Il 01/08 due difetti veri dentro le finestre di dialogo li
   ha trovati **solo un occhio umano**:

   1. Sentinella, modale che corregge una misura: «(mm/s)» usciva **«(MM/S)»**.
      `.flab` è in maiuscolo, quella era la prima etichetta di campo dell'app a
      portarsi dietro un'unità, e l'elenco delle esenzioni (`.kpi .l .u`,
      `.badge .u`, `.tab th .u`) non conosceva `.flab`. Lo `<span class="u">`
      c'era: **leggendo il codice non si vede**, perché nessuna riga è
      sbagliata — sbagliato è l'incontro fra una classe e un contenuto che
      quella classe non aveva previsto.
   2. Terra, tendina della provenienza della densità a 320 px: le etichette
      tagliate, e il taglio si portava via **la parte che distingue una fonte
      dall'altra** — cioè proprio quello che rende difendibile il numero.

   ⛔ E NESSUN BANCO APRIVA QUELLE MODALI. `modali.mjs` esiste dal 01/08 ma si
   apre la strada con **un gesto generico** — il primo `[title^="Rimuovi"]` di
   ogni sezione — che raggiunge una modale sola per sezione e quattro app su
   sei. Tutto il resto (le schede di modifica, le richieste di un valore, le
   conferme che non cominciano per «Rimuovi») non lo apre nessuno.
   Il censimento sta in fondo a questo file e lo stampa il banco stesso: è la
   difesa contro lo «zero violazioni» ottenuto non guardando niente.

   ⛔ E `modali.mjs` NON POTEVA VEDERE IL SECONDO DIFETTO, non per come è
   scritto ma per come è fatto il browser: **un `<select>` non dichiara di
   tagliare**. Misurato prima di scrivere una riga, con un'opzione da 224 px
   dentro una tendina da 120:

       <select>  scrollWidth 118, clientWidth 118   ← non dice niente
       <div>     scrollWidth 235, clientWidth 120   ← lo dice

   Quindi `scrollWidth > clientWidth`, che è la domanda giusta per tutto il
   resto, sulle tendine risponde **sempre di no**. Per loro si CLONA la tendina
   con la sola opzione da provare, le si toglie la larghezza imposta
   (`width:max-content`) e si legge quanto il browser dice di volere per
   mostrarla intera. Non è un calcolo: è la stessa domanda fatta a un elemento
   che sa rispondere.

   ⛔ E FINO AL 09/08 QUELLA MISURA ERA UNA SOTTRAZIONE, CON UN'IPOTESI FALSA
   SCRITTA ACCANTO. Confrontava la larghezza del solo TESTO con
   `clientWidth - padding`, e il commento diceva che la freccia della tendina
   sta dentro il padding, quindi «la misura è prudente, cioè assolve». Chromium
   la freccia la disegna dentro la **scatola di contenuto**: erano ~20 px di
   cecità, nella direzione che assolve. Sotto ci viveva il taglio di
   «— nessun esito registrato —» in Scudo (201,9 px di testo contro 214 di
   spazio dichiarato: assolto, e sullo schermo si leggeva
   «— nessun esito registrat…»). Il costo della stretta è misurato e scritto
   accanto alla misura, com'è la regola: si misura, non si teme.

   CHE COSA MISURA, e perché queste tre cose e non otto (un banco che ne
   misura otto e ne sbaglia una diventa un banco che nessuno guarda):
     1. **un'unità di misura in maiuscolo** — la trasformazione EFFETTIVA
        (`getComputedStyle(...).textTransform`), non il testo: `innerText` su
        un elemento nascosto ricade su `textContent` e il maiuscolo non si
        vede. È il difetto 1.
     2. **testo tagliato** — `scrollWidth > clientWidth` per l'orizzontale,
        `scrollHeight > clientHeight` per il verticale, sull'elemento vero;
        e per le tendine la misura del font, che è l'unica che risponde. È il
        difetto 2.
     3. **qualcosa che esce dal suo spazio** — la finestra più larga dello
        schermo, o il corpo che si mette a scorrere in orizzontale mentre la
        modale è aperta. A **320 px** oltre che a 390: il difetto 2 si vedeva
        solo stretto.

   ⚠️ LE MODALI SI APRONO CON UN GESTO, e il banco deve GUIDARE l'app. Cammina
   sui comandi della sezione, clicca il primo mai visto, e se si apre una
   finestra la misura e la chiude col primo bottone del piede (che per
   convenzione annulla). Tre cose imparate misurando, tutte e tre nel verso
   che fa guardare MENO:
     · le pillole dei filtri (`.chg`, `[data-filtro]`) **restringono la lista
       sotto**: cliccando «Superamenti» i punti di misura scendono da 40 a 25 e
       i loro comandi spariscono dal giro. Si escludono, e si resta sul filtro
       largo che è quello di partenza;
     · `[data-goto]` porta in **un'altra sezione**: il giro finirebbe a
       misurare una schermata che crede di non essere lì;
     · l'impronta di un comando **non può essere la sua etichetta**: la
       linguetta della serie storica si chiama «Apri…» da chiusa e «Chiudi…»
       da aperta, quindi al giro dopo sembrava un comando NUOVO e la
       richiudeva — e la tabella che stava per comparire (con dentro proprio
       il difetto 1) non è **mai** stata guardata. Si usa ciò che non cambia:
       `id` e attributi `data-`.

   ⚠️ E SI PRETENDE LA PROVA DI AVER APERTO: `#modal` con la classe `show`, il
   riquadro largo più di zero e un titolo non vuoto. Un banco che non apre
   niente risponde «tutto a posto» dopo aver guardato una schermata su otto.

   Uso:
     node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823
     node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823 --solo=terra
     node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823 --controprova
   La controprova rimette i due difetti veri in una COPIA del repository (una
   `git worktree`: i file delle app non sono di questo banco, ci scrivono altri
   cantieri) e pretende che il banco cada. Vedi in fondo. */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..', '..', '..', '..');
const chromium = await prendiChromium();
let PORTA = process.argv[2] && /^\d+$/.test(process.argv[2]) ? process.argv[2] : '8823';
/* la controprova serve una COPIA, e la serve su una porta sua */
const PORTA_COPIA = (process.argv.find((a) => a.startsWith('--porta-copia=')) || '').slice(14) || '8177';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
/* una sezione sola, per nome (`--sezione=@cave`). Stessa ragione di `--solo=`:
   un banco che costringe ad aprire tutte le superfici per guardarne una si
   lancia una volta al giorno, e quindi non si lancia. */
const SEZIONE = (process.argv.find((a) => a.startsWith('--sezione=')) || '').slice(10);
const CONTROPROVA = process.argv.includes('--controprova');
/* stampa il testo di ogni finestra aperta, una volta per finestra: le misure
   automatiche sono tre, quello che si legge dentro è di più */
const DIMMI = process.argv.includes('--dimmi');
const dette = new Set();
/* `--iniezione=A` (solo il difetto esatto di Sentinella) o `=B` (solo la
   forma generica, su tutte le superfici). Senza, tutt'e due. */
const QUALE = ((process.argv.find((a) => a.startsWith('--iniezione=')) || '').slice(12) || 'tutte').toUpperCase();
const TETTO = +((process.argv.find((a) => a.startsWith('--tetto=')) || '').slice(8) || 200);
/* quante volte si prova lo STESSO comando su righe diverse: due, perché il
   testo tagliato dipende dai dati e una riga sola non lo dimostrerebbe */
const PER_FORMA = 2;
/* ⛔ ANCHE A 320 px, e non è pignoleria: il difetto vero di Terra si vedeva
   solo stretto. 320 è il telefono più piccolo che si trova in cava.
   ⛔ E DUE NON BASTANO PER LE TENDINE — la frase che stava scritta qui era una
   DEDUZIONE, ed era falsa. Diceva: «la scatola cresce con la finestra e la voce
   ha una larghezza sua che non cambia, quindi ciò che taglia a 360 taglia anche
   a 320». Il primo pezzo è vero, il secondo no: il corpo del carattere dei
   campi **cambia con la larghezza** (i `@media` del foglio condiviso), quindi
   la voce si stringe insieme alla scatola e il taglio vive in una FASCIA di
   larghezze, non sopra una soglia.
   Il controesempio è misurato, ed è uno dei due difetti che questa correzione
   ha fatto uscire: `#ppv-scelta` di Sentinella taglia a **360** (297 px in 282)
   e a **390** (331 in 312), e NON taglia né a 320 né a 430. Con le due
   larghezze di questo elenco è stato preso a 390 — cioè per fortuna: una voce
   la cui fascia cadesse tutta dentro 360 non la vedrebbe nessuna delle due.
   ⚠️ Il conto onesto: portare questo banco a quattro larghezze raddoppierebbe
   una passata che oggi dura 16m34s, e il tetto di `tutti.mjs` è mezz'ora — un
   banco che sfonda il limite non diventa lento, viene UCCISO. Le quattro
   larghezze le copre `tendine-nelle-finestre.mjs`, che chiede SOLO questa
   domanda e per questo se le può permettere (due minuti a superficie). La
   divisione del lavoro è dichiarata lì e qui, e i due usano lo STESSO righello:
   se un giorno questo tetto non ci fosse più, la strada giusta è portare qui le
   larghezze e togliere quel file, non tenerne due che divergono.
   ⚠️ La controprova a soglie (famiglia D) vuole 360 per far vedere DOVE una
   voce smette di tagliare: il costo se lo prende quella passata sola. */
const LARGHEZZE = ((process.argv.find((a) => a.startsWith('--iniezione=')) || '').slice(12) || '').toUpperCase() === 'D'
  ? [390, 360, 320] : [390, 320];

/* ⛔ L'ELENCO DELLE UNITÀ NON SI RISCRIVE QUI. Esiste già, dentro
   `unita-maiuscole.mjs`, con accanto le ragioni di ogni voce (perché «h» sì e
   il litro no, perché «km/h» va riconosciuta prima di «h»). Una seconda copia
   nasce uguale e diverge al primo cambiamento: è il difetto che in questo
   repo è costato una giornata. Quel file è un banco — in fondo chiama
   `process.exit`, quindi importarlo lo farebbe partire — e allora si legge il
   suo elenco come TESTO. Se un giorno cambia forma il banco si ferma e lo
   dice, invece di misurare con una lista vuota. */
function unitaDalBanco() {
  const t = readFileSync(join(QUI, 'unita-maiuscole.mjs'), 'utf8');
  const m = t.match(/const UNITA = \[([\s\S]*?)\];/);
  if (!m) {
    console.error('✗ non trovo `const UNITA = [...]` in unita-maiuscole.mjs: l\'elenco delle unità');
    console.error('  vive lì e questo banco lo legge. Senza, misurerebbe con una lista vuota.');
    process.exit(2);
  }
  const lista = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  if (lista.length < 20) {
    console.error(`✗ dall'elenco di unita-maiuscole.mjs sono uscite solo ${lista.length} unità: la lettura non regge.`);
    process.exit(2);
  }
  return lista;
}
const UNITA = unitaDalBanco();

/* ⛔ IL CENSIMENTO E IL GESTO CHE APRE VIVONO IN `apri-modali.mjs` DAL 09/08,
   e non e' un riordino: e' la regola del `shared/` applicata ai banchi. Il
   giorno in cui si e' misurato il contrasto DENTRO le finestre e' saltato
   fuori che `contrasto.mjs` non ne apriva nessuna — quindi o si estraeva
   questo gesto, o nasceva il secondo apritore, che sarebbe divergiuto da
   questo al primo comando nuovo. Le trecento righe di commento che stavano
   qui — perche' l'impronta si prende PRIMA del contrassegno, perche' `.chg`
   non e' una pillola di filtro nel core, perche' `.sitem[onclick]` — sono
   andate LI' con il codice: erano difetti pagati, e un commento che si
   stacca dal suo codice smette di difenderlo. */
import { SCEGLI, TOCCA, CHIUDI, DOVE, quanteModaliEsistono, titoliDalProgramma } from './apri-modali.mjs';

/* ══ LE TRE MISURE, dentro la modale aperta ════════════════════════════════ */
const MISURA = ([UNITA, larghezza]) => {
  const ov = document.getElementById('modal');
  if (!ov) return null;
  const dentro = [...ov.querySelectorAll('*')].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0.5 && r.height > 0.5;
  });
  const cls = (e) => (typeof e.className === 'string' ? e.className : '').trim().slice(0, 28) || e.tagName.toLowerCase();
  const proprio = (e) => [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
    .map((n) => n.textContent.trim()).join(' ');
  const maiuscole = [], tagliati = [], tendine = [], fuori = [];
  let guardati = 0, opzioni = 0;
  /* quante tendine hanno dovuto rinunciare alla scorciatoia (le due sonde non
     davano lo stesso ingombro) e sono tornate a clonare voce per voce. Va
     STAMPATO: se un giorno diventa la maggioranza, la passata torna lenta e si
     scopre dal numero invece che dal limite che la uccide. */
  let perVoce = 0, alBordo = 0;

  /* 1 · UN'UNITÀ IN MAIUSCOLO. La trasformazione effettiva, non il testo. */
  for (const e of dentro) {
    guardati++;
    const t = proprio(e);
    if (!t) continue;
    if (getComputedStyle(e).textTransform !== 'uppercase') continue;
    const u = UNITA.find((x) => {
      const i = t.indexOf(x);
      if (i < 0) return false;
      const pr = i === 0 ? ' ' : t[i - 1];
      const dp = t[i + x.length] || ' ';
      return /[\s\d(/·,]/.test(pr) && !/[a-zA-Zà-ù]/.test(dp);
    });
    if (u) maiuscole.push({ unita: u, testo: t.slice(0, 46), classe: cls(e) });
  }

  /* 2 · TESTO TAGLIATO. La domanda che il browser sa rispondere. */
  for (const e of dentro) {
    const cs = getComputedStyle(e);
    const scorreX = cs.overflowX === 'auto' || cs.overflowX === 'scroll';
    const scorreY = cs.overflowY === 'auto' || cs.overflowY === 'scroll';
    const t = proprio(e);
    if (!t) continue;                       // il testo tagliato è di chi il testo ce l'ha
    if (!scorreX && e.scrollWidth > e.clientWidth + 1) {
      tagliati.push({ verso: '→', serve: Math.round(e.scrollWidth), spazio: Math.round(e.clientWidth),
        testo: t.slice(0, 44), classe: cls(e) });
    }
    /* il verticale solo dove il taglio è NETTO: `overflow:hidden`. Un testo
       che esce da un riquadro senza ritaglio si vede lo stesso — brutto, non
       perduto — e un banco rumoroso è un banco che nessuno legge. */
    if (!scorreY && cs.overflowY === 'hidden' && e.scrollHeight > e.clientHeight + 1) {
      tagliati.push({ verso: '↓', serve: Math.round(e.scrollHeight), spazio: Math.round(e.clientHeight),
        testo: t.slice(0, 44), classe: cls(e) });
    }
  }

  /* 2b · LE TENDINE, che non dichiarano di tagliare (misurato: un <select>
     risponde scrollWidth === clientWidth anche con l'opzione al doppio).

     ⛔ E FINO AL 09/08 QUI C'ERA UN'IPOTESI FALSA, SCRITTA IN CHIARO E MAI
     MISURATA. La riga diceva: *«lo spazio utile è il riquadro meno i margini
     interni; la freccia sta DENTRO quel margine perché `select.dw-input` la
     disegna col padding — dove non fosse così la misura è prudente, cioè
     assolve»*, e calcolava `clientWidth - paddingLeft - paddingRight`.
     Chromium la freccia la disegna dentro la **scatola di contenuto**, non
     dentro il padding: sono circa **20 px** che al testo non arrivano mai.
     Quindi quel confronto non era prudente — era **cieco su una banda di
     20 px**, e nella direzione che ASSOLVE.
     Che cosa ci viveva dentro, misurato: `#vf-esito` di Scudo mostrava
     «— nessun esito registrato —», che chiede **201,9 px** di testo dove
     `clientWidth - padding` ne dava **214** a 320 px. Questo banco lo
     assolveva — 201,9 < 214 — e sullo schermo si leggeva
     «— nessun esito registrat…». Stessa cosa per «Soggetto pubblico o privato
     abilitato» a 360 px, sfuggito per **mezzo pixel** (253,5 contro 254).
     È la regola di CLAUDE.md alla lettera: *un controllo tenuto largo «per non
     fare falsi allarmi» può essere cieco proprio dove serve, e il costo della
     stretta si MISURA, non si teme.*

     ⛔ E IL COSTO È STATO MISURATO PRIMA DI ADOTTARLA, su tutte le superfici, con
     i due righelli affiancati nello stesso giro: **due allarmi nuovi, zero
     falsi**. Il vecchio ne vedeva **0** in tutto il repository; il nuovo ne
     vede 2, e sono questi due, per nome:
       · `core` @390, `#sm-cava` «— nessuna —»: chiede 149 px in 142. Il solo
         testo sta in 101,4 contro i 114 che il righello vecchio dichiarava
         liberi — assolto di larghissimo, e tagliato lo stesso;
       · `sentinella` @390, `#ppv-scelta` «5,6 mm/s · Vibrazioni V2 — confine
         N…»: chiede 330 px in 312, e il testo (282,5) stava nei 284 del
         righello vecchio. **Assolto per un pixel e mezzo**, ed è la voce
         SCELTA: il valore che l'utente legge a tendina chiusa era monco.
     Denominatore, perché un numero di violazioni senza il suo denominatore si
     legge al contrario: 404 aperture di finestra, 244 voci di tendina, 14
     superfici (8 raggiunte su 9 che hanno modali, più 5 che non ne hanno per
     costruzione), 16 minuti e 34 secondi.
     Due allarmi pochi e dichiarabili per nome sono meglio di una regola larga
     che nasconde: è esattamente il conto che la regola chiede di fare, e per
     questo la stretta è entrata.

     ⛔ LA DOMANDA GIUSTA NON SI CALCOLA, SI CHIEDE — E SI CHIEDE UNA VOLTA PER
     TENDINA, NON UNA PER VOCE. Si clona la tendina con una sola opzione, le si
     toglie la larghezza imposta (`width:max-content`) e si legge quanto il
     browser dice di volere per mostrarla intera: testo, padding, freccia e
     bordi insieme, senza che il banco debba sapere quanto misura nessuno dei
     pezzi. Togliendo la larghezza del solo testo resta l'INGOMBRO NON
     TESTUALE, che è una proprietà della tendina e non della voce.
     ⚠️ E LA SCORCIATOIA È VERIFICATA, NON ASSUNTA: l'ingombro si misura con DUE
     sonde di lunghezza molto diversa e si pretende che diano lo stesso numero.
     Se non lo danno — un minimo di larghezza del browser, un `max-content` che
     non è lineare — la semplificazione non vale e si torna a clonare voce per
     voce. È la stessa disciplina del resto del file: quando si sostituisce una
     misura con un conto, il conto va provato contro la misura.
     ⚠️ E NON È UN'OTTIMIZZAZIONE FACOLTATIVA: la prima stesura clonava per ogni
     voce, e con qualche migliaio di voci la passata ha sfondato la mezz'ora
     che `tutti.mjs` concede a un banco (`--limite=`). Un banco troppo lento non
     diventa lento: viene UCCISO, e il giro dichiara quella superficie non
     misurata. La correzione al righello si sarebbe pagata in copertura. */
  for (const s of ov.querySelectorAll('select')) {
    const r = s.getBoundingClientRect();
    if (r.width < 1) continue;
    const cs = getComputedStyle(s);
    const scatola = r.width;
    const righello = document.createElement('span');
    righello.style.cssText = 'position:absolute; left:-9999px; top:0; visibility:hidden; white-space:pre';
    righello.style.font = cs.font;
    righello.style.letterSpacing = cs.letterSpacing;
    document.body.appendChild(righello);
    const largo = (t) => { righello.textContent = t; return righello.getBoundingClientRect().width; };
    const chiedi = (t) => {
      const cl = s.cloneNode(false);
      cl.removeAttribute('id');
      const solo = document.createElement('option');
      solo.textContent = t;
      cl.appendChild(solo);
      cl.style.cssText = cs.cssText;
      cl.style.position = 'absolute'; cl.style.left = '-9999px'; cl.style.top = '0';
      cl.style.width = 'max-content'; cl.style.minWidth = '0';
      cl.style.maxWidth = 'none'; cl.style.flex = '0 0 auto';
      s.parentNode.appendChild(cl);
      const w = cl.getBoundingClientRect().width;
      cl.remove();
      return w;
    };
    const SONDA_A = 'Wg', SONDA_B = 'WgWgWgWgWgWgWgWgWgWgWgWgWgWgWgWgWgWgWgWg';
    const iA = chiedi(SONDA_A) - largo(SONDA_A), iB = chiedi(SONDA_B) - largo(SONDA_B);
    const ingombro = Math.abs(iA - iB) < 0.75 ? (iA + iB) / 2 : null;
    if (ingombro === null) perVoce++;
    for (const o of s.options) {
      opzioni++;
      const testo = largo(o.textContent);
      let serve = ingombro === null ? chiedi(o.textContent) : ingombro + testo;
      /* ⛔ E DOVE IL VERDETTO SI DECIDE, LA SCORCIATOIA NON BASTA: si rimisura
         col clone vero. La somma `ingombro + testo` e il clone diretto della
         stessa voce non danno sempre lo stesso numero al decimo — misurato
         una differenza di ~1 px su `#sm-cava` del core — perché il testo dentro
         un `<option>` e lo stesso testo dentro uno `<span>` non vengono
         composti in modo identico fino all'ultimo sub-pixel. Un pixel non conta
         quasi mai; conta ESATTAMENTE quando la voce sfiora il bordo, cioè
         proprio dove il banco deve dire sì o no. Quindi la scorciatoia serve a
         scartare in fretta i casi lontani, e chi entra nella fascia di tre
         pixel intorno al bordo viene rimisurato per intero.
         È la stessa disciplina della sonda doppia qui sopra: si può sostituire
         una misura con un conto, ma non dove il conto decide. */
      if (ingombro !== null && Math.abs(serve - scatola) <= 3) { serve = chiedi(o.textContent); alBordo++; }
      if (serve > scatola + 0.5) {
        tendine.push({ serve: Math.round(serve), spazio: Math.round(scatola),
          testo: (o.textContent || '').trim().slice(0, 44), id: s.id || cls(s),
          scelta: o.selected,
          /* ⛔ LA VOCE VUOTA È QUELLA CHE SI VEDE FINCHÉ NESSUNO HA COMPILATO
             IL CAMPO: lo stato di partenza di ogni scheda nuova, cioè il caso
             più comune del prodotto — e il MENO misurato, perché nella
             dimostrazione i campi sono quasi tutti pieni. È testualmente la
             ragione per cui il taglio di «— nessun verbale —» non l'aveva
             visto nessuno («tutt'e due le verifiche il verbale ce l'hanno
             già»), e per cui quello di «— nessun esito registrato —» è
             sopravvissuto. Quindi si giudica sempre, anche quando non è la
             scelta: `value === ""` è la convenzione con cui ogni tendina di
             questo ecosistema scrive il proprio segnaposto. */
          vuota: o.value === '',
          __ingombro: ingombro === null ? null : Math.round(ingombro * 10) / 10 });
      }
    }
    righello.remove();
  }

  /* 4 · UN BERSAGLIO DI TOCCO TROPPO PICCOLO. CLAUDE.md lo pretende dopo ogni
     correzione di disposizione — «"ci sta" non è "si usa"», il bottone «Esci»
     largo 16 px su 44 di altezza, dentro lo schermo e impossibile da premere.
     Dentro una finestra di conferma vale doppio: è il posto dove si preme il
     bottone che cancella qualcosa, e la finestra è l'unica parte
     dell'interfaccia che nasce stretta di suo.
     ⚠️ Si guardano i COMANDI, non i campi: un `input[type=checkbox]` è piccolo
     per costruzione e il suo bersaglio vero è la `<label>` che lo contiene. E
     si salta chi ha dentro un altro comando, se no si misura il contenitore e
     si assolve il bottoncino. */
  const piccoli = [];
  for (const e of ov.querySelectorAll('button, [role="button"], [onclick], a[href]')) {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (e.querySelector('button, [role="button"], [onclick], a[href]')) continue;
    if (r.width < 43.5 || r.height < 43.5) {
      piccoli.push({ largo: Math.round(r.width), alto: Math.round(r.height),
        testo: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) || e.tagName.toLowerCase(),
        classe: cls(e) });
    }
  }

  /* 3 · QUALCOSA CHE ESCE DAL SUO SPAZIO. */
  const box = ov.querySelector('.modal-box, .modal-card');
  if (box) {
    const r = box.getBoundingClientRect();
    if (r.width > larghezza + 1) fuori.push({ che: 'la finestra', largo: Math.round(r.width), schermo: larghezza });
    if (r.left < -1) fuori.push({ che: 'la finestra esce a sinistra', largo: Math.round(r.left), schermo: larghezza });
  }
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    /* ⚠️ E SI DICE CHI SPORGE, non solo che il corpo scorre. «333 px su 320»
       manda a cercare in tutta la pagina; il nome dell'elemento che esce dal
       bordo destro è la stessa misura, e si può aprire. Il 07/08 il colpevole
       delle Dashboard (`.chart-card` a 678 px) è saltato fuori così, chiedendo
       al browser invece di dedurlo. */
    /* ⚠️ `getBoundingClientRect()` risponde nel VIEWPORT: se la pagina è già
       scorsa di lato, il bordo destro di chi sporge torna dentro lo schermo e
       il colpevole non si trova più. Si somma lo scorrimento. */
    const sx = window.scrollX || document.documentElement.scrollLeft || 0;
    const sporge = [...document.querySelectorAll('*')]
      .map((e) => ({ e, destra: e.getBoundingClientRect().right + sx, largo: e.getBoundingClientRect().width }))
      .filter((x) => x.destra > de.clientWidth + 1 && x.largo > 0)
      .sort((a, c) => c.destra - a.destra)[0];
    fuori.push({ che: 'il corpo scorre in orizzontale'
      + (sporge ? ` — sporge ${sporge.e.tagName.toLowerCase()}.${cls(sporge.e)} fino a ${Math.round(sporge.destra)}`
                : ' — nessun elemento sporge a destra: guardare il traboccamento ALL\'INDIETRO'),
      largo: de.scrollWidth, schermo: de.clientWidth });
  }
  /* per `--dimmi`: il testo che l'utente legge davvero dentro la finestra */
  const corpo = ((document.getElementById('modal-body') || {}).innerText || '')
    .replace(/\s+/g, ' ').trim();
  const piede = ((document.getElementById('modal-foot') || {}).innerText || '')
    .replace(/\s+/g, ' ').trim();
  return { maiuscole, tagliati, tendine, fuori, piccoli, guardati, opzioni, perVoce, alBordo, corpo, piede };
};

/* ══ LA CONTROPROVA: I DUE DIFETTI VERI, RIMESSI IN UNA COPIA ══════════════
   ⛔ I FILE DELLE APP NON SONO DI QUESTO BANCO. Mentre gira, altri cantieri ci
   scrivono: iniettare sul disco vivo vuol dire misurare il loro lavoro a metà,
   e ripristinare con `git checkout` vuol dire **cancellarlo** (successo il
   01/08, dieci minuti di lavoro non committato buttati). Quindi si costruisce
   una `git worktree` su HEAD, si inietta LÌ, e si serve quella — è lo stesso
   meccanismo che `tutti.mjs` usa per tutto il giro, provato da
   `giro-su-copia.mjs`. L'albero vivo non viene toccato in nessun momento.

   DUE FAMIGLIE DI INIEZIONE, e la copertura si dichiara per tutte e due:
     A · ESATTA, una superficie. In Sentinella si toglie `.flab .u`
         dall'elenco delle esenzioni dal maiuscolo: è **alla lettera** il
         difetto del 01/08, e fa tornare «(MM/S)» nella modale che corregge
         una misura.
     B · GENERICA, tutte le superfici che caricano `shared/dw-app-ui.js` (le
         sei app e Genesi). Dentro `apriModale`, appena il corpo è montato:
         · lo `<span class="u">` viene **sciolto** — cioè l'unità torna a
           stare nuda dentro l'etichetta, che è la forma generale del
           difetto 1;
         · le voci delle tendine vengono **allungate**, che è la forma
           generale del difetto 2 (un'etichetta che non ci sta nella tendina).
   ⚠️ E l'iniezione **si conta mentre inietta** (`window.__iniz`), perché «lo
   script non è fallito» non vuol dire «ha fatto qualcosa»: senza quel numero
   non si distingue un banco cieco da un'iniezione che non ha iniettato. */
const INIEZIONI = [];
let COPIA = null, servitore = null;

const DENTRO_APRI_MODALE = `document.getElementById("modal-body").innerHTML = corpo;`;
/* il punto corrispondente dentro il core: lì il corpo E il piede sono già
   montati, quindi l'iniezione arriva su tutto quello che si vede */
const DENTRO_OPEN_MODAL_CORE = `document.body.classList.add('modal-open'); // blocca lo scroll del fondo`;
const INIETTA = `
    /* ── CONTROPROVA (solo nella copia servita dal banco delle modali) ── */
    try {
      var __mb = document.getElementById("modal-body");
      window.__iniz = window.__iniz || { span: 0, opzioni: 0, unita: 0, piccoli: 0 };
      __mb.querySelectorAll("span.u").forEach(function (s) {
        s.replaceWith(document.createTextNode(s.textContent)); window.__iniz.span++;
      });
      /* E QUESTA E' LA FORMA DEL DIFETTO, NON UNA SUA IMITAZIONE: si prende
         una classe dell'app che e' GIA' in maiuscolo — la sua, non una
         scritta qui — e le si mette dentro un'unita', che e' esattamente
         l'incontro da cui il difetto nasce. Serve perche' lo span con la
         classe u dentro una modale ce l'hanno poche app: senza questa riga
         l'iniezione non arriverebbe sulle altre, e «so fallire» varrebbe per
         una superficie sola. getComputedStyle risponde anche a modale ancora
         nascosta: text-transform non dipende dalla disposizione. */
      var __su = [].slice.call(__mb.querySelectorAll("*")).filter(function (e) {
        return getComputedStyle(e).textTransform === "uppercase"
          && !/^(SELECT|INPUT|TEXTAREA|OPTION)$/.test(e.tagName);
      });
      if (__su.length) { __su[0].appendChild(document.createTextNode(" 12 m\\u00b3")); window.__iniz.unita++; }
      __mb.querySelectorAll("option").forEach(function (o) {
        o.textContent = o.textContent + " \\u2014 rilevato in cantiere dallo strumento tarato";
        window.__iniz.opzioni++;
      });
      /* la quarta misura (07/08): un comando sotto i 44x44 dentro la finestra.
         Si AGGIUNGE un bottone piccolo invece di rimpicciolirne uno esistente,
         perche' il piede della finestra qui non e' ancora montato — e un
         rimpicciolimento che non trova il suo bersaglio e' un'iniezione che
         non inietta, cioe' la terza causa dell'elenco di CLAUDE.md. */
      var __pb = document.createElement("button");
      __pb.textContent = "x";
      __pb.style.cssText = "width:22px;height:18px;min-height:0;min-width:0;padding:0;";
      __mb.appendChild(__pb); window.__iniz.piccoli = (window.__iniz.piccoli || 0) + 1;
    } catch (e) {}`;

/* ⛔ LE INIEZIONI DELLA FAMIGLIA D STANNO IN UNA TABELLA, E NON È ESTETICA.
   `iniezioni-fresche.mjs` — il controllo che in tre secondi dice se una
   controprova ha smesso di mordere perché il codice si è mosso — sa leggere
   due forme sole: le tabelle il cui nome comincia per `DIFETT`/`INIEZION`, e
   le `.replace("…")` scritte a mano. Le chiamate `inietta(rel, da, a, cosa)`
   di questo file **non sono nessuna delle due**, quindi le famiglie A, B e C
   NON sono sorvegliate da lì: se il loro bersaglio sparisce lo si scopre solo
   lanciando il giro, cioè ore dopo. Che non sia teoria lo dice la storia di
   questo stesso file: l'iniezione A è rimasta rotta per giorni quando qualcuno
   ha aggiunto `.fl .u` accanto a `.flab .u`.
   Scritta come tabella, la famiglia D entra nel censimento e il giorno in cui
   qualcuno riscrive quelle etichette il controllo lo dice subito.
   ⚠️ A, B e C restano fuori: portarle qui dentro vuol dire toccare tre
   iniezioni che stanno reggendo, e non è il lavoro di questa unità — è
   dichiarato perché si veda, non taciuto.
   ⚠️ E LA FORMA È UNA MAPPA `rotta → {da, a}`, non una terna e non un elenco,
   e tutt'e due i dettagli sono stati pagati in cinque minuti l'uno.
   Terna `[cerca, sostituisci, descrizione]`: il censimento prende il SECONDO
   elemento per l'ago — cioè la versione ROTTA — e dichiara scadute due
   iniezioni sanissime; il suo commento avverte che di terne ne esistono già
   tre convenzioni diverse qui dentro e che indovinare la posizione è il modo
   di sbagliare.
   Elenco che chiude con una quadra: il censimento cerca la fine di una tabella
   col primo `\n];` che trova dopo la sua apertura, e `const INIEZIONI = []`
   sta settanta righe più su — la MIA quadra è diventata la sua fine, quel
   `eval` è saltato e l'elenco dei banchi «non leggibili da fermi» è passato da
   zero a uno. Una tabella nuova può quindi rendere illeggibile una vecchia che
   non ha toccato: chiusa con la graffa, il problema non si pone.
   Scritta come
   `[cerca, sostituisci, descrizione]` il censimento ha preso il SECONDO
   elemento per l'ago — cioè la versione ROTTA — e ha dichiarato due iniezioni
   scadute che erano sanissime. Non è un suo difetto: il suo commento racconta
   che di terne ne esistono già tre convenzioni diverse in questo repository e
   che indovinare la posizione è il modo di sbagliare. La forma a oggetto dice
   quale campo è quale e non si può leggere male. */
const DIFETTI_SOGLIE = {
  'apps/scudo/index.html': {
    da: '"— nessun esito —")}</select>`',
    a: '"— nessun esito registrato —")}</select>`',
    cosa: 'D1 · Scudo: la voce vuota lunga di `#vf-esito` (250 px: cade solo a 320)' },
  'apps/scudo/scudo-data.js': {
    da: 'nome: "Soggetto abilitato", quando:',
    a: 'nome: "Soggetto pubblico o privato abilitato", quando:',
    cosa: 'D2 · Scudo: il soggetto abilitato per esteso in `#vf-ente` (302 px: cade a 320 e a 360)' },
};

function inietta(rel, da, a, cosa) {
  const f = join(COPIA, rel);
  const t = readFileSync(f, 'utf8');
  const quante = t.split(da).length - 1;
  /* ⛔ un'iniezione che non trova il suo bersaglio va detta a voce alta: una
     controprova che non ha iniettato niente misura un file SANO e dice «il
     banco non sa fallire» — è la terza delle cinque cause di CLAUDE.md, nella
     veste più difficile da vedere. */
  if (quante === 0) {
    console.error(`✗ l'iniezione «${cosa}» non trova il suo bersaglio in ${rel}: il file è cambiato.`);
    console.error(`  cercavo: ${da.slice(0, 80)}`);
    process.exit(2);
  }
  writeFileSync(f, t.split(da).join(a));
  INIEZIONI.push({ rel, cosa, quante, caratteri: (a.length - da.length) * quante });
}

async function rispondePorta(porta, via) {
  try { const r = await fetch(`http://127.0.0.1:${porta}${via}`, { signal: AbortSignal.timeout(1500) }); return r.ok ? await r.text() : null; }
  catch (e) { return null; }
}

if (CONTROPROVA) {
  const dove = join(RADICE, '..', 'copia-modali-' + process.pid);
  if (existsSync(dove)) rmSync(dove, { recursive: true, force: true });
  execFileSync('git', ['worktree', 'add', '--detach', dove, 'HEAD'], { cwd: RADICE, stdio: 'ignore' });
  COPIA = dove;
  console.log(`▶ controprova: copia di HEAD in ${dove} — l'albero vivo non viene toccato.`);
  /* le due famiglie si possono lanciare separate: serve a sapere QUALE ha
     fatto cadere che cosa, invece di leggere un verde solo */
  if (QUALE === 'TUTTE' || QUALE === 'A') {
    /* ⛔ E QUESTA RIGA ERA ROTTA DA GIORNI SENZA CHE NESSUNO LO SAPESSE. Fino
       al 07/08 cercava `,.flab .u{`, cioè `.flab .u` come **ultimo** selettore
       della regola; poi qualcuno ha aggiunto legittimamente `.fl .u` accanto
       (`.flab .u,.fl .u{`) e il bersaglio non c'era più. Il banco lo dice a
       voce alta ed esce con 2 — quindi non ha mentito — ma la controprova non
       partiva, e una controprova che non parte è una difesa che non c'è.
       Adesso si cerca `.flab .u,`, cioè il selettore con la sua virgola, che
       non dipende da quanti fratelli ha dopo. */
    inietta('apps/sentinella/index.html', '.flab .u,', '.flab-tolta-dalla-controprova .u,',
      'A · Sentinella: `.flab .u` fuori dalle esenzioni (il difetto del 01/08, alla lettera)');
  }
  if (QUALE === 'TUTTE' || QUALE === 'B') {
    inietta('shared/dw-app-ui.js', DENTRO_APRI_MODALE, DENTRO_APRI_MODALE + INIETTA,
      'B · dw-app-ui: unità dentro una classe maiuscola dell\'app, span.u sciolto, voci di tendina allungate');
  }
  /* ⛔ E FINO AL 07/08 LA CONTROPROVA NON TOCCAVA IL CORE, cioè la superficie
     che il fondatore mostra per prima. La famiglia A è di Sentinella, la B
     entra in `shared/dw-app-ui.js` — e il core non lo carica: ha il suo
     `openModal`, che è l'originale da cui quella struttura è stata estratta.
     Quindi il banco poteva dire «so fallire» avendolo dimostrato su sette
     superfici e mai su quella. È lo stesso difetto che questo file racconta
     due volte (l'elenco scritto sulla forma delle app), spostato dentro la
     controprova. */
  if (QUALE === 'TUTTE' || QUALE === 'C') {
    inietta('index.html', DENTRO_OPEN_MODAL_CORE, DENTRO_OPEN_MODAL_CORE + INIETTA,
      'C · core: gli stessi difetti dentro il suo `openModal` (il core non carica dw-app-ui.js)');
  }
  /* ⛔ LA FAMIGLIA D — E SERVE A DIMOSTRARE UNA COSA CHE LE ALTRE TRE NON
     POSSONO. A, B e C allungano OGNI opzione di una frase intera: provano che
     il banco sa vedere un taglio, e va benissimo — ma cadono a tutte le
     larghezze, quindi non distinguono «misura la larghezza» da «si accorge che
     qualcosa non va». Un banco che cade dappertutto passerebbe quella prova
     anche misurando l'umore.
     Qui invece si rimettono i DUE difetti veri chiusi il 09/08, con le loro due
     soglie diverse — e sono state misurate, non scelte:
       · «— nessun esito registrato —» chiede 250 px: cade a 320 (scatola 242),
         passa a 360 (282) e a 390 (312);
       · «Soggetto pubblico o privato abilitato» chiede 302 px: cade a 320 E a
         360, passa a 390.
     Se le due soglie si separano, il righello sta misurando la larghezza. Se il
     banco cadesse su tutt'e due dappertutto, o su nessuna delle due, questa
     passata lo direbbe — ed è per questo che non sta dentro `TUTTE`: girando
     insieme all'allungamento generico ogni voce taglierebbe ovunque e la
     separazione sparirebbe.
     ⚠️ Vuole 360 px, che il giro normale non fa: le larghezze in più costano, e
     costano solo qui (vedi `LARGHEZZE`). */
  if (QUALE === 'D') {
    for (const [rel, d] of Object.entries(DIFETTI_SOGLIE)) inietta(rel, d.da, d.a, d.cosa);
  }

  /* il server della copia, col contrassegno che dice che stiamo misurando LA
     NOSTRA copia e non quella di qualcun altro rimasta su quella porta */
  const marchio = '.contrassegno-modali-' + process.pid;
  writeFileSync(join(COPIA, marchio), String(process.pid));
  servitore = spawn('python3', ['-m', 'http.server', PORTA_COPIA], { cwd: COPIA, stdio: 'ignore', detached: true });
  let letto = null;
  for (let i = 0; i < 40 && letto === null; i++) {
    await new Promise((r) => setTimeout(r, 250));
    letto = await rispondePorta(PORTA_COPIA, '/' + marchio);
  }
  if (String(letto).trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA_COPIA} non risponde la MIA copia (contrassegno letto: ${JSON.stringify(letto)}).`);
    console.error('  Probabilmente c\'è già un server acceso lì: misurerei la cartella di qualcun altro,');
    console.error('  che è il modo silenzioso di far dire a una controprova «non so fallire». Mi fermo.');
    try { process.kill(-servitore.pid); } catch (e) {}
    execFileSync('git', ['worktree', 'remove', '--force', COPIA], { cwd: RADICE, stdio: 'ignore' });
    process.exit(2);
  }
  PORTA = PORTA_COPIA;
  console.log(`▶ la copia risponde sulla porta ${PORTA} (contrassegno ${process.pid} riletto dal server).`);
  for (const i of INIEZIONI) console.log(`   iniettato: ${i.cosa} — ${i.quante} punto/i in ${i.rel}`);
}

function togliLaCopia() {
  if (servitore) { try { process.kill(-servitore.pid); } catch (e) {} servitore = null; }
  if (!COPIA) return;
  try { execFileSync('git', ['worktree', 'remove', '--force', COPIA], { cwd: RADICE, stdio: 'ignore' }); }
  catch (e) { try { rmSync(COPIA, { recursive: true, force: true }); } catch (e2) {} }
  COPIA = null;
}
process.on('exit', togliLaCopia);

/* ══ IL GIRO ═══════════════════════════════════════════════════════════════ */
let ko = 0, appPulite = 0;
let apertePerTutti = 0, elementiPerTutti = 0, opzioniPerTutti = 0, clickPerTutti = 0;
let perVoceTot = 0, alBordoTot = 0;
const tendineTagliate = new Set();
/* per la controprova a soglie (famiglia D): a QUALI larghezze una voce
   visibile risulta tagliata. È il dato che separa «misura la larghezza» da
   «si accorge che qualcosa non va». */
const soglieViste = new Map();
let inciampi = 0, restate = 0, forzate = 0, sviate = 0, scese = 0;
const interrotte = [];
const raggiunte = [], nonRaggiunte = [];
/* le superfici che non hanno modali PER COSTRUZIONE: non sono mancate, e
   tenerle nel conto delle mancate falserebbe il denominatore in basso */
const senzaModali = [];
const censimento = [];
const visto = new Set();

const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  /* il censimento si fa sul file SERVITO, non su quello su disco: è la copia
     che il banco sta guardando */
  let esistono = null, programma = [];
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}${via}`);
    const sorgente = await r.text();
    esistono = quanteModaliEsistono(sorgente);
    programma = titoliDalProgramma(sorgente);
  } catch (e) { esistono = null; }

  const titoli = new Set();
  let male = 0, aperteQui = 0;
  /* per la controprova: quanto è ARRIVATA qui (span sciolti, voci allungate)
     e che cosa il banco ha VISTO. Sono due numeri diversi, e l'utile è il
     secondo diviso il primo. */
  const conto = { span: 0, opzioni: 0, unita: 0, piccoli: 0, vistoMaiusc: 0, vistoTendina: 0, vistoPiccoli: 0 };
  /* ⛔ «NON RAGGIUNTA» E «SENZA DATI» SONO DUE COSE DIVERSE, e fino al 06/08 il
     banco le diceva con la stessa frase. Il core stampava «nessuna modale
     aperta — il banco NON ha guardato questa superficie», che si legge «c'è un
     guasto nel banco»: e per due giorni la roadmap ha mandato a cercare il
     selettore giusto, che non era la causa (`301b5b7`). La causa vera, già
     misurata e scritta trenta righe più su, è che la **dimostrazione del core
     è quasi vuota**: il banco ha un programma da 68 modali e non ha le righe
     da cui aprirle.
     Sono due diagnosi opposte e portano a due lavori opposti — sistemare il
     banco, oppure popolare la dimostrazione — quindi vanno separate, e il
     numero che le separa è **quanti comandi cliccabili ha trovato**:
     · zero candidati → non ci è arrivato (accesso, navigazione, selettore);
     · candidati sì, modali no → ci è arrivato e non c'era niente da aprire.
     È il principio del fondatore applicato al banco: l'assenza di un dato non
     è un dato favorevole, e nemmeno un guasto. È uno stato da dichiarare. */
  let candidatiQui = 0, clickQui = 0;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    const atteso = p.url();
    for (const s of await sezioniDi(p, nome)) {
      if (p.isClosed()) break;
      if (SEZIONE && SEZIONE !== s) continue;
      await vaiA(p, nome, s);
      const fatti = [], forme = [];
      let diFila = 0;
      /* la schermata di casa, letta DOPO essere arrivati */
      const casa = await p.evaluate(DOVE).catch(() => '');
      /* ⛔ E «MI SONO SPOSTATO» HA DUE SIGNIFICATI OPPOSTI, che vanno separati
         o si sbaglia in un verso o nell'altro. Confinare il giro nella sua
         sezione l'ha reso ripetibile, e ha tolto **tutte** le finestre di
         dettaglio: la scheda di una cava, di un mezzo, di una macchina e
         l'editor di volata NON sono sezioni — sono un piano più sotto, e ci si
         arriva solo cliccando una riga. Rimettendo a posto anche quel tocco,
         «Modifica cava» diventava irraggiungibile mentre il suo bottone era il
         terzo dell'elenco. Quindi:
         · di lato (una schermata che ha già il suo turno nel giro) → si torna
           indietro: lì misurerebbe due volte e a caso;
         · più sotto (una schermata che nessuna sezione visita) → si RESTA, e
           si torna a casa quando i suoi comandi sono finiti. È l'unico modo di
           aprire le finestre delle schede di dettaglio.
         L'elenco delle «sue» schermate è **derivato** da quello delle sezioni,
         non riscritto: per il core `@cave` è `screen-cave`. */
      const sueSezioni = new Set((await sezioniDi(p, nome))
        .filter((x) => typeof x === 'string' && x.startsWith('@')).map((x) => 'screen-' + x.slice(1)));
      let inProfondita = false;
      const rimettiti = async () => {
        if (!casa || p.isClosed()) return;
        const ora = await p.evaluate(DOVE).catch(() => casa);
        if (ora === casa) { inProfondita = false; return; }
        if (sueSezioni.size === 0 || sueSezioni.has(ora)) {
          sviate++; await vaiA(p, nome, s); inProfondita = false; return;
        }
        if (!inProfondita) scese++;
        inProfondita = true;
      };
      for (let i = 0; i < TETTO; i++) {
        const scelto = await p.evaluate(SCEGLI, [fatti, forme, PER_FORMA]).catch(() => null);
        if (!scelto) {   /* nemmeno la scelta risponde: la pagina non c'è più */
          inciampi++; if (++diFila >= 5) { interrotte.push(`${nome}/${s}@${larghezza}`); break; } continue;
        }
        if (typeof scelto.restano === 'number' && scelto.restano > candidatiQui) candidatiQui = scelto.restano;
        if (scelto.fine) {
          /* finiti i comandi della scheda di dettaglio: si risale, non si
             chiude la sezione — quello che restava da provare sta a casa */
          if (inProfondita) { await vaiA(p, nome, s); inProfondita = false; continue; }
          break;
        }
        fatti.push(scelto.chiave); forme.push(scelto.sagoma);
        clickPerTutti++; clickQui++;
        const r = await p.evaluate(TOCCA, 170).catch(() => null);
        /* ⛔ IL TOCCO PUÒ PORTARE LA PAGINA ALTROVE — o chiuderla. Non è una
           ragione per fermare il giro (la chiave è già segnata), ma è una
           ragione per RIMETTERSI dove si era: senza, il giro continuerebbe a
           misurare **un'altra pagina** credendo di essere nella sezione. */
        if (p.isClosed()) {
          inciampi++; interrotte.push(`${nome}/${s}@${larghezza} (pagina chiusa dopo «${scelto.etichetta}»)`);
          break;
        }
        if (!r || p.url() !== atteso) {
          inciampi++; diFila++;
          if (inciampi <= 3) console.log(`      · inciampo su «${scelto.etichetta}» in ${nome}/${s}: ${p.url() !== atteso ? 'la pagina è andata altrove' : 'il contesto è saltato'}`);
          if (p.url() !== atteso) {
            await p.goto(atteso).catch(() => {});
            await p.waitForTimeout(1200);
            await vaiA(p, nome, s);
          } else { await p.waitForTimeout(300); }
          if (diFila >= 5) { interrotte.push(`${nome}/${s}@${larghezza}`); break; }
          continue;
        }
        diFila = 0;
        /* la finestra c'era già e il tocco non l'ha cambiata: non è
           un'apertura, è la stessa schermata riletta. Si conta a parte e si
           richiude, se no il giro seguente la rilegge di nuovo. */
        if (r.restata) { restate++; await p.evaluate(CHIUDI).catch(() => {}); await rimettiti(); continue; }
        if (!r.aperta) { await rimettiti(); continue; }
        aperteQui++; apertePerTutti++;
        /* ⚠️ «QUANTE MODALI DIVERSE» NON È «QUANTI TITOLI DIVERSI»: il titolo
           si porta dentro la data e il nome della riga («Correggi la misura
           del 12/07/2026»), quindi contando i titoli vivi una chiamata sola
           sembrava ventisette modali — cioè un numero più alto del censimento,
           che è il segno che si sta contando un'altra cosa. Via le cifre. */
        const magro = r.titolo.replace(/\d+/g, '#').replace(/\s+/g, ' ').slice(0, 46);
        titoli.add(magro);
        const m = await p.evaluate(MISURA, [UNITA, larghezza]).catch(() => null);
        /* ⚠️ `--dimmi` STAMPA QUELLO CHE C'È DENTRO, una volta per finestra.
           Serve perché tre misure automatiche non sono un occhio: i due difetti
           per cui questo banco esiste li ha trovati una persona che guardava.
           Un plurale sbagliato col numero 1, un numero tranquillo dove non è
           stato misurato niente, una frase che si contraddice: si vedono
           leggendo, e leggere costa solo se il testo non è stampato. */
        if (DIMMI && m && !dette.has(magro)) {
          dette.add(magro);
          console.log(`\n  ▸ ${nome} «${r.titolo}»\n    ${(m.corpo || '(vuoto)').slice(0, 700)}\n    [piede] ${m.piede || '(nessun bottone)'}`);
        }
        const chiusa = await p.evaluate(CHIUDI).catch(() => null);
        if (chiusa === false) forzate++;
        /* ⚠️ E LA CHIUSURA STESSA PUÒ PORTARE ALTROVE: il primo bottone del
           piede per convenzione annulla, ma nel core «Nuovo rapportino» ne ha
           due che NAVIGANO sul modulo. Senza questa riga il giro proseguiva
           sul modulo credendo di essere nella sezione di partenza. */
        await rimettiti();
        if (!m) continue;
        elementiPerTutti += m.guardati; opzioniPerTutti += m.opzioni; perVoceTot += m.perVoce || 0; alBordoTot += m.alBordo || 0;
        /* le voci che nessuno vedrà mai a tendina chiusa: né scelte né vuote.
           Si contano e si dichiarano — un numero tolto in silenzio è un numero
           che qualcuno rimetterà. */
        for (const x of m.tendine) if (!x.scelta && !x.vuota) tendineTagliate.add(`${nome}|${x.id}|${x.testo}`);
        const dillo = (testo) => {
          const chiave = `${nome}|${larghezza}|${testo}`;
          if (visto.has(chiave)) return false;
          visto.add(chiave); male++; ko++; return true;
        };
        for (const x of m.maiuscole) {
          conto.vistoMaiusc++;
          if (dillo(`MAIUSC|${x.classe}|${x.testo}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: «${x.testo}» in maiuscolo — dentro c'è «${x.unita}»  .${x.classe}`);
          }
        }
        for (const x of m.tagliati) {
          if (dillo(`TAGLIO|${x.verso}|${x.classe}|${x.testo}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: ${x.verso} «${x.testo}» chiede ${x.serve} in ${x.spazio}  .${x.classe}`);
          }
        }
        for (const x of m.tendine) {
          /* ⚠️ NON OGNI OPZIONE TAGLIATA È UN DIFETTO, ed è una decisione già
             presa e MISURATA (shared/dw-app-ui.css, 31/07: 19 tendine su 84
             tagliano e nessuna diventa ambigua). Casca quella che l'utente sta
             LEGGENDO — l'opzione scelta, quella che si vede a tendina chiusa:
             se è tagliata, il valore mostrato è monco. Le altre si contano e
             si dichiarano in fondo.
             ⛔ E CASCA ANCHE LA VOCE VUOTA, ANCHE QUANDO NON È QUELLA SCELTA:
             la ragione sta accanto alla misura, ed è che quella è la voce che
             si vede finché il campo non è compilato — lo stato di partenza di
             ogni scheda. Senza questa riga il banco la prendeva solo se
             capitava di aprire la scheda giusta: misurato su Scudo, le prime
             due righe con verifica periodica hanno l'esito già registrato,
             quindi la voce vuota di `#vf-esito` non era mai la scelta e il
             difetto si vedeva o no a seconda di quale riga toccava il giro.
             È la quinta causa del «non distingue»: il caso difeso che non c'è
             nella prova. */
          if (!x.scelta && !x.vuota) continue;
          conto.vistoTendina++;
          if (!soglieViste.has(x.id)) soglieViste.set(x.id, new Set());
          soglieViste.get(x.id).add(larghezza);
          if (dillo(`TENDINA|${x.id}|${x.testo}`)) {
            const come = x.scelta ? 'mostra' : 'mostrerà, finché il campo è vuoto,';
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: la tendina #${x.id} ${come} «${x.testo}» tagliato — chiede ${x.serve} px in ${x.spazio}`);
          }
        }
        for (const x of m.piccoli) {
          conto.vistoPiccoli++;
          if (dillo(`TOCCO|${x.classe}|${x.testo}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: il comando «${x.testo}» è ${x.largo}×${x.alto} px — sotto i 44×44  .${x.classe}`);
          }
        }
        for (const x of m.fuori) {
          if (dillo(`FUORI|${x.che}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: ${x.che} — ${x.largo} px su ${x.schermo}`);
          }
        }
      }
    }
    if (CONTROPROVA) {
      const z = await p.evaluate(() => window.__iniz || { span: 0, opzioni: 0, unita: 0, piccoli: 0 }).catch(() => null);
      if (z) { conto.span += z.span; conto.opzioni += z.opzioni; conto.unita += z.unita; conto.piccoli += (z.piccoli || 0); }
    }
    await ctx.close();
  }
  censimento.push({ app: nome, esistono, aperte: titoli.size, conto, quali: [...titoli], programma, candidati: candidatiQui, provati: clickQui });
  if (aperteQui === 0) {
    nonRaggiunte.push(nome);
    if (esistono === 0) {
      /* ⛔ LA TERZA DIAGNOSI, e mancava proprio sulla pagina che il fondatore
         apre per prima. L'08/08 la vetrina usciva come «NON RAGGIUNTA — il
         banco non ci è arrivato: accesso, navigazione o selettore», cioè con
         la diagnosi che sul core è costata due giorni di caccia al selettore.
         Misurato aprendo `apps/index.html`: **zero** `<button>`, zero
         `onclick`, zero `<summary>`, zero modali — quattro `<a href>` e basta.
         È una vetrina statica: non c'è niente da aprire **per costruzione**.
         Il conto dei candidati non basta a separarle, perché qui è zero in
         tutt'e due i casi; il numero che le separa è quante modali il suo
         programma ne contiene, e il banco ce l'ha già in mano.
         ⚠️ Perché conta: queste righe sono quelle che questo repository legge
         PRIMA dei KO. Una riga che accusa il banco dove non c'è niente da
         accusare insegna a non leggerle — ed è il modo più veloce di perdere
         il controllo più prezioso che c'è. */
      console.log(`  ✓  ${nome}: NIENTE DA APRIRE — questa superficie non ha modali nel suo programma`
        + ` (zero comandi cliccabili, zero finestre): non è un buco del banco, è com'è fatta.`);
      nonRaggiunte.pop();   // non è una superficie mancata: non va nel conto
      senzaModali.push(nome);
    } else if (candidatiQui === 0) {
      console.log(`  ⚠️  ${nome}: NON RAGGIUNTA — zero comandi cliccabili trovati in tutte le sezioni.`
        + ` Il banco non ci è arrivato: accesso, navigazione o selettore.`
        + ` (nel suo programma ce ne sono ${esistono} da aprire)`);
    } else {
      console.log(`  ⚠️  ${nome}: RAGGIUNTA MA SENZA DATI — ${candidatiQui} comandi cliccabili trovati,`
        + ` ${clickQui} provati, 0 modali aperte. Il banco ci è arrivato e non c'era niente da aprire:`
        + ` la dimostrazione non ha le righe.`
        + (esistono ? ` (nel suo programma ce ne sono ${esistono} da aprire)` : ''));
    }
  } else {
    raggiunte.push(nome);
    if (!male) { appPulite++; console.log(`  ok  ${nome}: ${titoli.size} modali diverse, ${aperteQui} aperture, niente da dire`); }
    else console.log(`  --  ${nome}: ${titoli.size} modali diverse, ${aperteQui} aperture, ${male} cose da guardare`);
  }
}
await b.close();

/* ══ QUANTI SOGGETTI HA GUARDATO DAVVERO ═══════════════════════════════════ */
console.log('\n── il censimento: quante modali esistono, quante ne ha aperte ──');
let esistonoTot = 0, aperteTot = 0;
for (const c of censimento) {
  esistonoTot += c.esistono || 0; aperteTot += c.aperte;
  console.log(`   ${String(c.app).padEnd(22)} ${String(c.esistono ?? '?').padStart(3)} nel programma  →  ${String(c.aperte).padStart(3)} aperte e guardate`
    + (c.aperte === 0 ? `   [${c.candidati} comandi trovati, ${c.provati} provati: ${c.candidati ? 'senza dati' : 'non raggiunta'}]` : ''));
  /* le finestre aperte si dicono per NOME: un numero non si può controllare,
     un elenco sì — e quello che manca all'appello si vede */
  if (c.quali.length) console.log(`      aperte: ${c.quali.join(' · ')}`);
  /* ⛔ E SOPRATTUTTO QUELLE CHE NON SI SONO APERTE, per nome e per riga: è la
     riga «non ho guardato» che in questo repo è rimasta stampata per mesi
     senza che nessuno la leggesse, adesso scritta in modo che si possa
     controllare voce per voce invece che credere a un numero. */
  if (c.programma && c.programma.length) {
    const viste = c.quali;
    const chiusa = (t) => viste.some((v) => v.toLowerCase().startsWith(t.toLowerCase().slice(0, 24)));
    const mancanti = c.programma.filter((x) => !x.calcolato && !chiusa(x.titolo));
    const calcolati = c.programma.filter((x) => x.calcolato);
    const perNome = [...new Set(mancanti.map((x) => `${x.titolo} (r.${x.riga})`))];
    if (perNome.length) {
      console.log(`      NON APERTE (${perNome.length} titoli su ${c.programma.length} chiamate):`);
      for (let k = 0; k < perNome.length; k += 3) console.log('        · ' + perNome.slice(k, k + 3).join(' · '));
    }
    if (calcolati.length) {
      console.log(`      titolo COSTRUITO a tempo di esecuzione, non confrontabile (${calcolati.length}): `
        + calcolati.map((x) => `r.${x.riga} ${x.arg}`).join(' · ').slice(0, 220));
    }
  }
}
console.log(`   ${'TOTALE'.padEnd(22)} ${String(esistonoTot).padStart(3)}                 →  ${String(aperteTot).padStart(3)}`);
console.log(`\n${appPulite} superfici pulite, ${ko} cose da guardare (contate per larghezza: la stessa`);
console.log(`   riga sbagliata a 390 e a 320 sono due misure, non una)`);
console.log(`soggetti guardati: ${apertePerTutti} aperture di modale, ${elementiPerTutti} elementi misurati, `
  + `${opzioniPerTutti} voci di tendina, ${clickPerTutti} comandi provati, `
  + `${raggiunte.length} superfici raggiunte su ${raggiunte.length + nonRaggiunte.length}`
  + (senzaModali.length ? `, più ${senzaModali.length} senza modali per costruzione (${senzaModali.join(', ')})` : ''));
/* ⚠️ DICHIARATE, NON BOCCIATE, e la ragione è già misurata: il commento di
   `shared/dw-app-ui.css` racconta il conto del 31/07 — 19 tendine su 84
   tagliano almeno un'opzione a 390 px e NESSUNA diventa ambigua. Un banco che
   le bocciasse tutte darebbe diciannove allarmi veri e inutili, e verrebbe
   spento in due giorni. Casca solo l'opzione SCELTA, cioè quella che si legge
   a tendina chiusa: lì il valore mostrato è monco. Le altre si contano, così
   il numero resta sotto gli occhi invece di sparire. */
console.log(`voci di tendina tagliate ma non scelte (dichiarate, non bocciate): ${tendineTagliate.size}`);
console.log(`tendine in cui l'ingombro non testuale non era una costante (misurate voce per voce): ${perVoceTot}`
  + ` · voci vicine al bordo rimisurate col clone vero: ${alBordoTot}`);
/* ⚠️ E QUESTE DUE RIGHE DICONO SE IL RIGHELLO REGGE. «Restate» sono i tocchi
   che hanno trovato la finestra di prima ancora aperta: fino al 07/08 venivano
   contati come aperture (436 su 11 finestre vere). «Forzate» sono le chiusure
   in cui il primo bottone del piede non ha chiuso: se quel numero cresce, il
   banco sta misurando la finestra sbagliata da qualche parte. */
console.log(`finestre già aperte ritrovate al tocco (non contate come aperture): ${restate}`
  + ` · chiusure che hanno dovuto forzare: ${forzate}`
  + ` · tocchi che hanno portato di lato (rimessi a posto): ${sviate}`
  + ` · discese in una scheda di dettaglio (seguite fino in fondo): ${scese}`);
/* ⚠️ GLI INCIAMPI SI DICHIARANO: un tocco che porta la pagina altrove fa
   perdere il resto della sezione, e un banco che non lo dice sembra averla
   guardata tutta. */
if (inciampi) console.log(`inciampi (il tocco ha fatto saltare il contesto): ${inciampi}`
  + (interrotte.length ? ` — sezioni lasciate a metà: ${interrotte.join(', ')}` : ''));
if (nonRaggiunte.length) {
  console.log(`⚠️ NON RAGGIUNTE: ${nonRaggiunte.join(', ')}.`);
  console.log('   Non vuol dire «a posto»: vuol dire che nessuna loro modale è stata aperta,');
  console.log('   quindi su di loro questo banco non ha misurato NIENTE.');
}
if (CONTROPROVA) {
  /* ⛔ «SA FALLIRE IN UN PUNTO» NON DIMOSTRA NIENTE SUGLI ALTRI MILLE. Quindi
     la controprova si misura anche nella sua COPERTURA: dove l'iniezione è
     ARRIVATA (quanti span sciolti, quante voci allungate — contati dal codice
     iniettato mentre iniettava) e dove il banco l'ha VISTA. Le due colonne
     vanno lette insieme: un'iniezione arrivata e non vista è un buco del
     banco; una non arrivata è un buco della controprova, e i due si curano in
     modo opposto. */
  console.log('\n── la copertura della controprova ──');
  for (const i of INIEZIONI) console.log(`   nel testo: ${i.cosa}\n              ${i.quante} punto/i in ${i.rel}`);
  if (QUALE === 'A') {
    console.log('   (solo la famiglia A: le colonne del conto a tempo di esecuzione sono di B e restano a zero)');
  }
  /* ⚠️ la famiglia D non inietta JavaScript dentro la modale: cambia due
     etichette nel sorgente servito. Le colonne «span sciolti / unità / voci
     allungate / comandi rimpiccioliti» le riempie il codice iniettato da B e
     C, quindi qui restano a zero — e senza questa riga la tabella stampa
     «non arrivata» accanto a una superficie in cui l'iniezione è arrivata
     benissimo. Un conto che vale per un'altra famiglia va dichiarato, se no
     si legge come un buco. */
  if (QUALE === 'D') {
    console.log('   (famiglia D: cambia due etichette nel sorgente, non inietta codice —');
    console.log('    le colonne del conto a tempo di esecuzione sono di B/C e restano a zero.');
    console.log('    Quello che conta qui è il verdetto sulle SOGLIE, in fondo.)');
  }
  let arrivate = 0, viste = 0, spanTot = 0, opzTot = 0, uniTot = 0, picTot = 0;
  for (const c of censimento) {
    const q = c.conto;
    const arrivata = q.span + q.opzioni + q.unita + q.piccoli > 0;
    const vista = q.vistoMaiusc + q.vistoTendina + q.vistoPiccoli > 0;
    if (arrivata) arrivate++;
    if (vista) viste++;
    spanTot += q.span; opzTot += q.opzioni; uniTot += q.unita; picTot += q.piccoli;
    console.log(`   ${String(c.app).padEnd(22)} iniettato: ${String(q.span).padStart(3)} span sciolti, `
      + `${String(q.unita).padStart(3)} unità messe in una classe maiuscola, ${String(q.opzioni).padStart(4)} voci allungate,`
      + ` ${String(q.piccoli).padStart(3)} comandi rimpiccioliti`
      + `  →  visto: ${q.vistoMaiusc} unità in maiuscolo, ${q.vistoTendina} tendine tagliate, ${q.vistoPiccoli} bersagli piccoli`
      + `  ${arrivata ? (vista ? '✓' : '✗ ARRIVATA E NON VISTA') : (QUALE === 'A' ? '·' : '· non arrivata')}`);
  }
  console.log(`   ${spanTot + uniTot + opzTot + picTot} iniezioni in tutto (${spanTot} span, ${uniTot} unità, `
    + `${opzTot} voci, ${picTot} comandi rimpiccioliti)`
    + ` su ${arrivate} superfici; il banco le ha viste su ${viste}.`);
  console.log(ko ? '  ✓ la controprova è stata vista: il banco sa fallire'
                 : '  ✗ IL BANCO NON SA FALLIRE: i difetti erano dentro e non se n\'è accorto');
  /* ⛔ LA FAMIGLIA D SI GIUDICA A PARTE, PERCHÉ CHIEDE UNA COSA PIÙ FORTE.
     Le altre pretendono che un rosso ci sia; questa pretende che il rosso
     compaia SOTTO una certa larghezza e sparisca sopra — cioè che il righello
     misuri i pixel e non l'umore. Le due soglie sono diverse apposta: se il
     banco cadesse dappertutto, o da nessuna parte, il verdetto lo direbbe.
     ⚠️ E si pretende anche il verso «non cade»: una prova che verifica solo
     dove cade passerebbe anche con un banco che accusa tutto. È la stessa
     lezione delle regole di sicurezza — la sola prova che conta è quella che
     pretende un RIFIUTO. */
  if (QUALE === 'D') {
    const SOGLIE = [
      ['vf-esito', 'la voce vuota lunga (250 px)', [320], [360, 390]],
      ['vf-ente', 'il soggetto per esteso (302 px)', [320, 360], [390]],
    ];
    let vKo = 0;
    console.log('\n── la controprova a SOGLIE: è la larghezza che decide? ──');
    for (const [id, che, cade, passa] of SOGLIE) {
      const dove = soglieViste.get(id) || new Set();
      /* ⛔ e prima ancora: la tendina l'ho INCONTRATA? Un verdetto «non cade a
         390» è vero anche se il banco quella finestra non l'ha mai aperta —
         cioè un verde che ha guardato altrove. Se non l'ho vista, non assolvo
         e non accuso: dichiaro NON MISURATO e faccio fallire la passata. */
      const incontrata = opzioniPerTutti > 0 && (dove.size > 0 || soglieViste.has(id));
      if (!incontrata) {
        console.log(`  ⚠️ NON MISURATO  #${id}: ${che} — la tendina non è comparsa in nessuna finestra aperta.`);
        vKo++; continue;
      }
      const giu = cade.filter((l) => dove.has(l)), su = passa.filter((l) => dove.has(l));
      const bene = giu.length === cade.length && su.length === 0;
      if (!bene) vKo++;
      console.log(`  ${bene ? 'ok ' : '✗  '} #${id}: ${che} — cade a [${[...dove].sort((a, b) => a - b).join(', ')}]`
        + `, atteso cade a [${cade.join(', ')}] e NON a [${passa.join(', ')}]`);
    }
    console.log(vKo === 0
      ? '  ✓ le due soglie si separano: il righello misura la LARGHEZZA'
      : '  ✗ le soglie non si separano: il banco non sta misurando la larghezza');
    process.exit(vKo === 0 && ko && viste ? 0 : 1);
  }
}
process.exit(ko ? 1 : 0);
