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
   resto, sulle tendine risponde **sempre di no**. Per loro si misura quanto
   spazio chiede il testo dell'opzione — e lo misura il browser, mettendo il
   testo in uno `<span>` col **font vero della tendina** e chiedendo la
   larghezza del suo riquadro. Non è un calcolo: è la stessa domanda fatta a
   un elemento che sa rispondere.

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
   solo stretto. 320 è il telefono più piccolo che si trova in cava. */
const LARGHEZZE = [390, 320];

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

/* ══ IL CENSIMENTO ═════════════════════════════════════════════════════════
   Quante modali esistono in una superficie: quante volte il suo programma
   chiama `apriModale`, `chiedi`, `chiediValore` (le tre porte del core, dove
   passano tutte) oppure `openModal`, che è il nome che ha nel core.
   Si contano solo le chiamate VERE: `mascheraCodice` toglie il contenuto
   delle stringhe e i commenti, se no «chiedi(» dentro una frase spiegata in
   un commento conterebbe come una modale. */
import { mascheraCodice } from '../tokenizza.mjs';
function quanteModaliEsistono(sorgente) {
  const vivo = mascheraCodice(sorgente);
  let n = 0;
  const nomi = ['apriModale(', 'chiedi(', 'chiediValore(', 'openModal('];
  for (const nome of nomi) {
    let i = 0;
    while ((i = sorgente.indexOf(nome, i)) >= 0) {
      const prima = sorgente[i - 1] || ' ';
      /* `chiedi(` dentro `chiediValore(` non è una seconda modale, e
         `window.chiedi =` nemmeno: si vuole la chiamata, non la parola.
         E la DICHIARAZIONE non è una modale: `function openModal(` nel core è
         il posto dove la finestra è scritta, non uno dei posti da cui si apre. */
      const dichiarazione = /function\s+$/.test(sorgente.slice(Math.max(0, i - 12), i));
      if (vivo[i] === 1 && !dichiarazione && !/[A-Za-z0-9_.$]/.test(prima)) n++;
      i += nome.length;
    }
  }
  return n;
}

/* ⛔ E UN NUMERO NON SI PUÒ CONTROLLARE: «11 su 68» non dice QUALI mancano.
   Dal 07/08 il censimento tira fuori anche il **titolo** di ogni chiamata —
   il primo argomento — così l'appello si legge per nome, che è la sola forma
   in cui si vede che cosa non è stato guardato. La regola del repo vale anche
   qui: una riga che dice «non ho guardato questa» conta più di dieci verdi.

   ⚠️ IL LIMITE È DICHIARATO, perché il confronto non è esatto. Un titolo
   scritto per intero (`'Nuova cava'`) si riconosce; uno costruito
   (`` `Rapportino ${fmt(r.data)}` ``) si riconosce dal suo pezzo **fisso**
   («Rapportino»), perché a schermo le cifre diventano `#` e non tornerebbero
   mai uguali; uno che di fisso non ha niente (`c.ragsoc`, `html`) non si può
   confrontare e finisce in un elenco suo, dichiarato invece che dato per
   raggiunto. Un titolo dato per raggiunto a torto è il modo di far sparire una
   finestra dall'appello. */
function titoliDalProgramma(sorgente) {
  const vivo = mascheraCodice(sorgente);
  const fuori = [];
  const nomi = ['apriModale(', 'chiedi(', 'chiediValore(', 'openModal('];
  for (const nome of nomi) {
    let i = 0;
    while ((i = sorgente.indexOf(nome, i)) >= 0) {
      const prima = sorgente[i - 1] || ' ';
      const dichiarazione = /function\s+$/.test(sorgente.slice(Math.max(0, i - 12), i));
      if (vivo[i] !== 1 || dichiarazione || /[A-Za-z0-9_.$]/.test(prima)) { i += nome.length; continue; }
      /* il primo argomento: dal `(` alla prima virgola di primo livello */
      let j = i + nome.length, dep = 0, q = null, arg = '';
      while (j < sorgente.length && j < i + nome.length + 400) {
        const c = sorgente[j], p = sorgente[j - 1];
        if (q) { if (c === q && p !== '\\') q = null; }
        else if (c === "'" || c === '"' || c === '`') q = c;
        else if ('(['.includes(c) || c === '{') dep++;
        else if (')]'.includes(c) || c === '}') { if (dep === 0 && c === ')') break; dep--; }
        else if (c === ',' && dep === 0) break;
        arg += c; j++;
      }
      arg = arg.trim();
      const riga = sorgente.slice(0, i).split('\n').length;
      /* il pezzo fisso: quello che si legge a schermo comunque */
      let fisso = null;
      const sec = arg.match(/^'((?:[^'\\]|\\.)*)'$/) || arg.match(/^"((?:[^"\\]|\\.)*)"$/);
      if (sec) fisso = sec[1];
      else if (arg.startsWith('`')) fisso = arg.slice(1).split('${')[0];
      else if (/^'/.test(arg)) fisso = arg.slice(1).split("'")[0];   // 'Guasto: '+(g.componente)
      else if (/^"/.test(arg)) fisso = arg.slice(1).split('"')[0];
      /* un template SENZA parti calcolate finisce col suo apice inverso:
         va tolto, se no il nome nell'appello non è quello che si legge */
      fisso = (fisso || '').replace(/`$/, '').replace(/\\'/g, "'").replace(/\s+/g, ' ').trim();
      fuori.push({ riga, titolo: fisso, calcolato: fisso.length < 4, arg: arg.slice(0, 40) });
      i += nome.length;
    }
  }
  return fuori;
}

/* ══ IL GESTO CHE APRE ═════════════════════════════════════════════════════
   ⛔ IN DUE PASSI, E NON PER ELEGANZA. In un passo solo (scegli-e-clicca) un
   click che porta la pagina altrove distrugge il contesto: la chiamata
   fallisce, e il banco non sa nemmeno QUALE comando stava provando — quindi
   o si ferma lì, o lo riprova all'infinito. Fermarsi era il comportamento
   della prima stesura, ed era **silenzioso**: Scudo apriva 2 modali su 28
   chiamate nel programma e il banco stampava un `ok`. Adesso il comando si
   sceglie e si marca PRIMA (`SCEGLI`), si tocca DOPO (`TOCCA`): se il tocco
   fa saltare tutto, la chiave è già in mano e il giro va avanti dal comando
   dopo, contando gli inciampi e dichiarandoli in fondo. */
const SCEGLI = ([fatti, forme, quanteVolte]) => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const eti = (e) => (e.getAttribute('aria-label') || e.title || e.textContent || '')
    .trim().replace(/\s+/g, ' ').slice(0, 60);
  /* ⛔ L'IMPRONTA È LA FORMA DEL COMANDO, NON LA RIGA SU CUI STA, e la
     differenza vale ore. Otto righe di elenco hanno otto bottoni «Rimuovi X»
     con `data-del="id1..id8"`: sono lo STESSO comando, aprono la STESSA
     finestra, e cliccarli tutti costa otto volte tanto per misurare la stessa
     cosa. Si tiene la forma (i NOMI degli attributi `data-`, l'etichetta senza
     le cifre) e se ne provano `quanteVolte` per forma — più di una perché il
     testo tagliato dipende dai DATI: un nome lungo taglia dove uno corto no.
     ⚠️ E la forma non può essere l'etichetta viva: la linguetta della serie
     storica si chiama «Apri…» da chiusa e «Chiudi…» da aperta, quindi al giro
     dopo sembrava un comando nuovo e la richiudeva. */
  const forma = (e) => {
    const chiavi = Object.keys(e.dataset).sort().join(',');
    const magra = eti(e).replace(/\d+/g, '#').slice(0, 30);
    return e.tagName + '|' + (e.id || '') + '|' + chiavi + '|' + (chiavi ? magra.slice(0, 12) : magra);
  };
  /* e questa è l'identità del singolo comando, che serve a non ricliccare due
     volte lo stesso: valori degli attributi `data-`, non i loro nomi */
  const identita = (e) => {
    const d = Object.entries(e.dataset).map(([k, v]) => k + '=' + v).sort().join(',');
    return e.tagName + '|' + (e.id || '') + '|' + (d || eti(e));
  };
  const FUORI = '.nav, #bottomnav, .modal-ov, #modal, .chgs';
  /* `.dw-exit` porta al login, e da lì non si torna: non apre modali, porta
     via la pagina */
  /* ⛔ E IL BOTTONE DEL TEMA NON SI CHIAMA «TEMA». Misurato il 06/08 sul core:
     `#btn-outdoor` ha `title="Cambia tema (chiaro/scuro)"` e
     `aria-label="Cambia tema chiaro o scuro"` — tutt'e due cominciano per
     «Cambia», quindi `^="Tema"` non li prende, e `[id*="tema"]` non prende
     `btn-outdoor`. Il banco quindi lo premeva a ogni giro, cioè ribaltava il
     tema della pagina centinaia di volte per sezione mentre credeva di provare
     comandi diversi. Adesso si cerca la PAROLA, dovunque stia e senza guardare
     le maiuscole (`*=` con la bandiera `i`), invece della sua posizione: un
     elenco scritto sul prefisso è un elenco che il primo sinonimo aggira. */
  /* ⛔ `[data-scr]` È LA NAVIGAZIONE DEL CORE, e fino al 07/08 non era esclusa
     da niente. `FUORI` toglie `.nav` e `#bottomnav`, che sono i nomi che usano
     le APP; la barra in basso del core si chiama `.bnav#global-nav`, quindi le
     sue quattro voci finivano fra i candidati e il banco, in fondo a ogni
     sezione, si portava da solo su un'altra schermata — poi continuava a
     cliccare credendo di essere ancora nella sezione di prima. È lo stesso
     motivo per cui `[data-goto]` è escluso nelle app, e la forma generale è
     `[data-scr]`: un comando che dichiara una SCHERMATA è navigazione, non
     una finestra da aprire. (Il `.nav-fab` del core resta dentro: non naviga,
     apre «Nuovo rapportino».) */
  const MAI = '[data-filtro], [data-goto], [data-scr], .dw-exit, .outdoor-toggle,'
    + '[id*="tema" i], [title*="tema" i], [aria-label*="tema" i]';
  /* ⛔ `.chg` NON È UNA PILLOLA DI FILTRO DAPPERTUTTO — misurato il 07/08.
     L'esclusione era scritta sulla classe, e la ragione (le pillole
     restringono la lista sotto) vale nelle app. Nel core `.chg` è il bottone
     d'azione del deposito: PRELEVA, TOTALE, ✕, «+ Aggiungi tipo punta» —
     quattro finestre del programma che nessun banco poteva aprire. In Campo
     sono gli otto «C'è / Non c'è» dell'appello del turno, cioè il gesto
     centrale di quella schermata.
     Quindi il filtro si riconosce da come si COMPORTA, non da come si chiama:
     una pillola fra sorelle di cui una è **accesa** (`.active`) sceglie una
     vista; un bottone solo, o un gruppo senza nessuno acceso, fa una cosa.
     Misura del cambio, contando i candidati visibili sezione per sezione su
     tutte le superfici: core 187 → 176 (+48 forme, −4 voci di navigazione),
     campo 56 → 64 (+8: l'appello), conti/flotta invariate. */
  const filtro = (e) => {
    if (!e.matches('.chg, .chip, [data-filtro]')) return false;
    const padre = e.parentElement;
    return !!(padre && padre.querySelector('.chg.active, .chip.active, [data-filtro].active'));
  };
  /* ⛔ `.sitem[onclick]` È LA SECONDA CAUSA DELLA CECITÀ SUL CORE, trovata il
     03/08. Questo elenco era scritto sulla forma delle APP, che usano `.item`;
     il core usa `.sitem` — «SEGNALAZIONE item», la riga di lista da cui si apre
     ogni sua scheda. Effetto: il banco provava **6.800 comandi** sul core e
     apriva **zero modali su 68**, perché i bottoni veri (navigazione, FAB)
     portano altrove e tutto quello che apre una scheda è una riga `.sitem`.
     Prima ancora il core non passava nemmeno la schermata d'accesso (corretto
     in `giro.mjs`): il banco lo dichiarava da mesi in fondo al suo riepilogo —
     «nessuna modale aperta … nel suo programma ce ne sono 68 da aprire». Un
     controllo che confessa di essere cieco e che nessuno legge è come non
     averlo.
     ⛔ **E QUESTA CORREZIONE, DA SOLA, NON BASTA: MISURATO DOPO.** Rimessa
     `.sitem[onclick]`, il banco sul solo core risponde **ancora 0 modali
     aperte su 68**, con gli stessi 6.800 comandi provati. Il conto statico
     (41 `.sitem[onclick]` nel sorgente contro 0 `.item[onclick]`) era vero ma
     non era la causa. Quella vera, misurata contando gli elementi VISIBILI
     sezione per sezione dopo l'accesso, è che **la dimostrazione del core è
     quasi vuota**: 0-2 righe cliccabili per sezione (`@volate` ne ha **zero**,
     perché `rapportini: []`), 3 bottoni e 4-5 `[role=button]`. Il banco ha un
     programma da 68 modali e una dimostrazione che non ha le righe da cui
     aprirle.
     Quindi la strada non è un terzo ritocco al selettore: o la dimostrazione
     del core si popola come quella delle app, oppure il banco deve
     **dichiarare** che sul core misura una superficie senza dati invece di
     dire «non raggiunta». Scritto qui perché il prossimo non ricominci dal
     selettore. */
  /* ⛔ E L'ELENCO ERA ANCORA SCRITTO SULLA FORMA DELLE APP. Dopo `.sitem`
     (03/08) restavano fuori tutte le altre forme che nel core aprono qualcosa:
     `.tile` e `.pcard` (le mattonelle della home e del menu, da cui si va nei
     moduli), `.atab` (le linguette di deposito, macchine e impostazioni: senza
     di loro ASTE e LUBRIFICANTI non si vedono, e con loro tre finestre), e
     `.kpi-card`. Aggiungere un quarto nome all'elenco sarebbe stato il quarto
     ritocco allo stesso selettore; la domanda giusta è un'altra e non ha nomi
     dentro: **questo elemento porta un gestore di click?** In questo repo la
     risposta è l'attributo `onclick`, che tutte le superfici usano. I
     collegamenti veri (`a[href]`) restano fuori di proposito: portano via dalla
     pagina, non aprono finestre. */
  const lista = [...document.querySelectorAll('button, [role="button"], summary, [onclick], .item[onclick], .sitem[onclick], tr[data-id]')]
    .filter((e) => vis(e) && !e.closest(FUORI) && !e.matches(MAI) && !filtro(e));
  const conta = (f) => forme.filter((x) => x === f).length;
  const el = lista.find((e) => !fatti.includes(identita(e)) && conta(forma(e)) < quanteVolte);
  if (!el) return { fine: true, restano: lista.length };
  /* ⛔ L'IMPRONTA SI PRENDE PRIMA DEL CONTRASSEGNO, E QUESTA RIGA È LA CAUSA
     VERA DELLO «0 MODALI SU 68». Misurata il 06/08, e per giorni si è cercata
     altrove (nel selettore, poi nei dati della dimostrazione).
     `identita` e `forma` leggono il `dataset`. Mettendo `data-dw-sonda`
     **prima** di calcolarle, quello che tornava era
     `BUTTON|btn-x|dwSonda=1` — cioè l'impronta dell'elemento **col
     contrassegno addosso**. Ma `TOCCA` il contrassegno lo toglie, quindi al
     giro dopo `find` confronta `BUTTON|btn-x|` con una lista che contiene
     `BUTTON|btn-x|dwSonda=1`: non combaciano **mai**. Le due difese contro i
     doppioni — `fatti` (il singolo comando) e `forme` (quante volte per
     sagoma) — erano tutt'e due morte, e il banco ripremeva lo stesso comando
     finché non finiva il programma. Da qui i 6.800 comandi provati che nel
     commento qui sopra sembravano la prova di una superficie senza dati:
     erano lo **stesso pugno di comandi** contato migliaia di volte.
     ⚠️ La lezione oltre il caso: uno strumento che **scrive** sul soggetto che
     sta misurando deve leggerlo **prima** di scriverci. Il contrassegno serve
     a ritrovare l'elemento dopo, non a descriverlo. */
  const chiave = identita(el), sagoma = forma(el), etichetta = eti(el);
  document.querySelectorAll('[data-dw-sonda]').forEach((x) => x.removeAttribute('data-dw-sonda'));
  el.setAttribute('data-dw-sonda', '1');
  return { chiave, sagoma, etichetta, restano: lista.length };
};

const TOCCA = async (attesa) => {
  const el = document.querySelector('[data-dw-sonda]');
  if (!el) return { sparito: true };
  /* ⛔ SI GUARDA COM'ERA PRIMA, se no «c'è una modale» si legge «l'ho aperta
     io». Misurato il 07/08 sul core: 980 comandi provati e **436 aperture**
     per **11 finestre diverse**. Il conto era gonfio perché una modale rimasta
     aperta (la chiusura non sempre riesce, vedi `CHIUDI`) fa rispondere
     `aperta: true` a ogni tocco successivo — e il banco misurava per centinaia
     di volte la stessa schermata credendo di guardarne una nuova. È la stessa
     famiglia dello strumento che scrive sul soggetto che misura: qui lo
     strumento non azzera lo stato prima di leggerlo. */
  const prima = (() => {
    const m0 = document.getElementById('modal');
    return {
      cera: !!(m0 && m0.classList.contains('show')),
      titolo: ((document.getElementById('modal-title') || {}).textContent || '').trim(),
    };
  })();
  el.removeAttribute('data-dw-sonda');
  el.click();
  await new Promise((r) => setTimeout(r, attesa));
  const m = document.getElementById('modal');
  const box = m && m.querySelector('.modal-box, .modal-card, [class*="modal-"]');
  const titolo = (document.getElementById('modal-title') || {}).textContent || '';
  /* ⛔ LA PROVA DI AVER APERTO, non la speranza: la classe `show`, un riquadro
     largo davvero, e un titolo. Senza questa riga un banco che non apre niente
     risponde «tutto a posto». */
  const cePost = !!(m && m.classList.contains('show')
    && box && box.getBoundingClientRect().width > 1 && titolo.trim());
  /* nuova = non c'era prima, oppure c'era ma adesso dice un'altra cosa */
  const nuova = cePost && (!prima.cera || prima.titolo !== titolo.trim());
  return { aperta: nuova, restata: cePost && !nuova, titolo: titolo.trim() };
};

/* ⛔ DOVE SONO ADESSO — e non lo dice l'indirizzo. Fino al 07/08 il banco
   controllava di essere rimasto nella sua sezione con `p.url()`: in una app a
   schermata sola l'indirizzo non cambia MAI, quindi quel controllo rispondeva
   sempre «sono a posto». Effetto misurato sul core: partito da `@cave`, il
   primo comando in ordine di documento è il `←` (che torna indietro), il
   secondo è il pulsante tondo (che apre «Nuovo rapportino», il cui primo
   bottone del piede NAVIGA sul modulo) — e da lì in avanti il giro misurava
   altre schermate credendo di essere fra le cave. Le finestre di `@cave` non
   le ha aperte nessuno: «Nuova cava» e «Modifica cava» risultavano non
   raggiungibili mentre il loro bottone era il terzo della lista.
   La prova di essere nella sezione giusta è la stessa che CLAUDE.md pretende
   per la navigazione: **quale schermata è visibile**. Se cambia, si torna
   indietro invece di continuare a misurare un'altra pagina. */
const DOVE = () => {
  const a = document.querySelector('.screen.active');          /* il core */
  if (a) return a.id;
  const p = [...document.querySelectorAll('.page, .scr, [id^="page-"]')]
    .filter((e) => getComputedStyle(e).display !== 'none');    /* le app */
  return p.length ? p[0].id || p[0].className : '';
};

const CHIUDI = async () => {
  /* ⛔ E LA CHIUSURA SI VERIFICA, non si spera: se la finestra resta aperta,
     tutto quello che il banco misura dopo è la finestra di prima. Il primo
     bottone del piede per convenzione annulla, ma non sempre chiude (nel core
     «Nuovo rapportino» ha due bottoni che NAVIGANO), e il ripiego conosceva un
     nome solo (`chiudiModale`, delle app: il core la chiama `closeModal`).
     Si prova in ordine, e in ultima istanza si toglie la classe a mano — un
     banco che non sa richiudere è un banco che dalla prima finestra in poi
     misura sempre quella. Torna `false` quando ha dovuto forzare: chi chiama
     lo conta e lo dichiara. */
  const aperta = () => { const m = document.getElementById('modal'); return !!(m && m.classList.contains('show')); };
  const b = document.querySelector('#modal-foot .mbtn, #modal-foot button');
  if (b) b.click();
  await new Promise((r) => setTimeout(r, 120));
  if (!aperta()) return true;
  for (const nome of ['chiudiModale', 'closeModal']) {
    if (typeof window[nome] === 'function') { try { window[nome](); } catch (e) {} }
    if (!aperta()) return true;
  }
  const m = document.getElementById('modal');
  if (m) { m.classList.remove('show'); document.body.classList.remove('modal-open'); }
  return false;
};

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
     Si chiede al browser quanto spazio vuole il testo, col font vero. */
  const righello = document.createElement('span');
  righello.style.cssText = 'position:fixed; left:-9999px; top:0; visibility:hidden; white-space:pre';
  document.body.appendChild(righello);
  for (const s of ov.querySelectorAll('select')) {
    const r = s.getBoundingClientRect();
    if (r.width < 1) continue;
    const cs = getComputedStyle(s);
    righello.style.font = cs.font;
    righello.style.letterSpacing = cs.letterSpacing;
    /* lo spazio utile: il riquadro meno i margini interni. La freccia della
       tendina sta DENTRO quel margine perché `select.dw-input` la disegna col
       padding — dove non fosse così la misura è prudente, cioè assolve. */
    const spazio = s.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
    for (const o of s.options) {
      opzioni++;
      righello.textContent = o.textContent;
      const serve = righello.getBoundingClientRect().width;
      if (serve > spazio + 1) {
        tendine.push({ serve: Math.round(serve), spazio: Math.round(spazio),
          testo: (o.textContent || '').trim().slice(0, 44), id: s.id || cls(s),
          scelta: o.selected });
      }
    }
  }
  righello.remove();

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
  return { maiuscole, tagliati, tendine, fuori, piccoli, guardati, opzioni, corpo, piede };
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
const tendineTagliate = new Set();
let inciampi = 0, restate = 0, forzate = 0, sviate = 0, scese = 0;
const interrotte = [];
const raggiunte = [], nonRaggiunte = [];
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
        elementiPerTutti += m.guardati; opzioniPerTutti += m.opzioni;
        for (const x of m.tendine) if (!x.scelta) tendineTagliate.add(`${nome}|${x.id}|${x.testo}`);
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
             tagliano e nessuna diventa ambigua). Qui casca solo quella che
             l'utente sta LEGGENDO — l'opzione scelta, quella che si vede a
             tendina chiusa: se è tagliata, il valore mostrato è monco. Le
             altre si contano e si dichiarano in fondo. */
          if (!x.scelta) continue;
          conto.vistoTendina++;
          if (dillo(`TENDINA|${x.id}|${x.testo}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: la tendina #${x.id} mostra «${x.testo}» tagliato — chiede ${x.serve} px in ${x.spazio}`);
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
    if (candidatiQui === 0) {
      console.log(`  ⚠️  ${nome}: NON RAGGIUNTA — zero comandi cliccabili trovati in tutte le sezioni.`
        + ` Il banco non ci è arrivato: accesso, navigazione o selettore.`
        + (esistono ? ` (nel suo programma ce ne sono ${esistono} da aprire)` : ''));
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
  + `${raggiunte.length} superfici raggiunte su ${raggiunte.length + nonRaggiunte.length}`);
/* ⚠️ DICHIARATE, NON BOCCIATE, e la ragione è già misurata: il commento di
   `shared/dw-app-ui.css` racconta il conto del 31/07 — 19 tendine su 84
   tagliano almeno un'opzione a 390 px e NESSUNA diventa ambigua. Un banco che
   le bocciasse tutte darebbe diciannove allarmi veri e inutili, e verrebbe
   spento in due giorni. Casca solo l'opzione SCELTA, cioè quella che si legge
   a tendina chiusa: lì il valore mostrato è monco. Le altre si contano, così
   il numero resta sotto gli occhi invece di sparire. */
console.log(`voci di tendina tagliate ma non scelte (dichiarate, non bocciate): ${tendineTagliate.size}`);
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
  process.exit(ko && viste ? 0 : 1);
}
process.exit(ko ? 1 : 0);
