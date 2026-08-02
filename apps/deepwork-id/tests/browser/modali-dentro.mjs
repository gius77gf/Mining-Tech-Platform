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
const CONTROPROVA = process.argv.includes('--controprova');
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
         `window.chiedi =` nemmeno: si vuole la chiamata, non la parola */
      if (vivo[i] === 1 && !/[A-Za-z0-9_.$]/.test(prima)) n++;
      i += nome.length;
    }
  }
  return n;
}

/* ══ IL GESTO CHE APRE ═════════════════════════════════════════════════════ */
const PROSSIMO = async ([fatti, forme, attesa, quanteVolte]) => {
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
  const MAI = '[data-filtro], .chg, [data-goto], [id*="tema"], [title^="Tema"], [aria-label^="Tema"]';
  const lista = [...document.querySelectorAll('button, [role="button"], summary, .item[onclick], tr[data-id]')]
    .filter((e) => vis(e) && !e.closest(FUORI) && !e.matches(MAI));
  const conta = (f) => forme.filter((x) => x === f).length;
  const el = lista.find((e) => !fatti.includes(identita(e)) && conta(forma(e)) < quanteVolte);
  if (!el) return { fine: true, restano: lista.length };
  const chiave = identita(el), sagoma = forma(el), etichetta = eti(el);
  try { el.click(); } catch (e) { return { chiave, sagoma, etichetta, errore: String(e).slice(0, 60) }; }
  await new Promise((r) => setTimeout(r, attesa));
  const m = document.getElementById('modal');
  const box = m && m.querySelector('.modal-box, .modal-card, [class*="modal-"]');
  const titolo = (document.getElementById('modal-title') || {}).textContent || '';
  /* ⛔ LA PROVA DI AVER APERTO, non la speranza: la classe `show`, un riquadro
     largo davvero, e un titolo. Senza questa riga un banco che non apre niente
     risponde «tutto a posto». */
  const aperta = !!(m && m.classList.contains('show')
    && box && box.getBoundingClientRect().width > 1 && titolo.trim());
  return { chiave, sagoma, etichetta, aperta, titolo: titolo.trim() };
};

const CHIUDI = async () => {
  const b = document.querySelector('#modal-foot .mbtn, #modal-foot button');
  if (b) b.click(); else if (typeof window.chiudiModale === 'function') window.chiudiModale();
  await new Promise((r) => setTimeout(r, 120));
  const m = document.getElementById('modal');
  return !(m && m.classList.contains('show'));
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

  /* 3 · QUALCOSA CHE ESCE DAL SUO SPAZIO. */
  const box = ov.querySelector('.modal-box, .modal-card');
  if (box) {
    const r = box.getBoundingClientRect();
    if (r.width > larghezza + 1) fuori.push({ che: 'la finestra', largo: Math.round(r.width), schermo: larghezza });
    if (r.left < -1) fuori.push({ che: 'la finestra esce a sinistra', largo: Math.round(r.left), schermo: larghezza });
  }
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    fuori.push({ che: 'il corpo scorre in orizzontale', largo: de.scrollWidth, schermo: de.clientWidth });
  }
  return { maiuscole, tagliati, tendine, fuori, guardati, opzioni };
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
const INIETTA = `
    /* ── CONTROPROVA (solo nella copia servita dal banco delle modali) ── */
    try {
      var __mb = document.getElementById("modal-body");
      window.__iniz = window.__iniz || { span: 0, opzioni: 0 };
      __mb.querySelectorAll("span.u").forEach(function (s) {
        s.replaceWith(document.createTextNode(s.textContent)); window.__iniz.span++;
      });
      __mb.querySelectorAll("option").forEach(function (o) {
        o.textContent = o.textContent + " \\u2014 rilevato in cantiere dallo strumento tarato";
        window.__iniz.opzioni++;
      });
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
  inietta('apps/sentinella/index.html', ',.flab .u{', ',.flab-tolta-dalla-controprova .u{',
    'A · Sentinella: `.flab .u` fuori dalle esenzioni (il difetto del 01/08, alla lettera)');
  inietta('shared/dw-app-ui.js', DENTRO_APRI_MODALE, DENTRO_APRI_MODALE + INIETTA,
    'B · dw-app-ui: lo <span class="u"> sciolto e le voci delle tendine allungate, in ogni modale');

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
const raggiunte = [], nonRaggiunte = [];
const censimento = [];
const visto = new Set();

const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  /* il censimento si fa sul file SERVITO, non su quello su disco: è la copia
     che il banco sta guardando */
  let esistono = null;
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}${via}`);
    esistono = quanteModaliEsistono(await r.text());
  } catch (e) { esistono = null; }

  const titoli = new Set();
  let male = 0, aperteQui = 0;
  /* per la controprova: quanto è ARRIVATA qui (span sciolti, voci allungate)
     e che cosa il banco ha VISTO. Sono due numeri diversi, e l'utile è il
     secondo diviso il primo. */
  const conto = { span: 0, opzioni: 0, vistoMaiusc: 0, vistoTendina: 0 };
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    for (const s of await sezioniDi(p, nome)) {
      await vaiA(p, nome, s);
      const fatti = [], forme = [];
      for (let i = 0; i < TETTO; i++) {
        const r = await p.evaluate(PROSSIMO, [fatti, forme, 170, PER_FORMA]).catch(() => ({ fine: true }));
        if (r.fine) break;
        fatti.push(r.chiave); forme.push(r.sagoma);
        clickPerTutti++;
        if (!r.aperta) continue;
        aperteQui++; apertePerTutti++;
        /* ⚠️ «QUANTE MODALI DIVERSE» NON È «QUANTI TITOLI DIVERSI»: il titolo
           si porta dentro la data e il nome della riga («Correggi la misura
           del 12/07/2026»), quindi contando i titoli vivi una chiamata sola
           sembrava ventisette modali — cioè un numero più alto del censimento,
           che è il segno che si sta contando un'altra cosa. Via le cifre. */
        titoli.add(r.titolo.replace(/\d+/g, '#').replace(/\s+/g, ' ').slice(0, 46));
        const m = await p.evaluate(MISURA, [UNITA, larghezza]).catch(() => null);
        await p.evaluate(CHIUDI);
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
        for (const x of m.fuori) {
          if (dillo(`FUORI|${x.che}`)) {
            console.log(`  KO  ${nome} @${larghezza} «${r.titolo.slice(0, 30)}»: ${x.che} — ${x.largo} px su ${x.schermo}`);
          }
        }
      }
    }
    if (CONTROPROVA) {
      const z = await p.evaluate(() => window.__iniz || { span: 0, opzioni: 0 }).catch(() => null);
      if (z) { conto.span += z.span; conto.opzioni += z.opzioni; }
    }
    await ctx.close();
  }
  censimento.push({ app: nome, esistono, aperte: titoli.size, conto });
  if (aperteQui === 0) {
    nonRaggiunte.push(nome);
    console.log(`  ⚠️  ${nome}: nessuna modale aperta — il banco NON ha guardato questa superficie`
      + (esistono ? ` (nel suo programma ce ne sono ${esistono} da aprire)` : ''));
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
  console.log(`   ${String(c.app).padEnd(22)} ${String(c.esistono ?? '?').padStart(3)} nel programma  →  ${String(c.aperte).padStart(3)} aperte e guardate`);
}
console.log(`   ${'TOTALE'.padEnd(22)} ${String(esistonoTot).padStart(3)}                 →  ${String(aperteTot).padStart(3)}`);
console.log(`\n${appPulite} superfici pulite, ${ko} cose da guardare`);
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
  let arrivate = 0, viste = 0, spanTot = 0, opzTot = 0;
  for (const c of censimento) {
    const arrivata = c.conto.span + c.conto.opzioni > 0;
    const vista = c.conto.vistoMaiusc + c.conto.vistoTendina > 0;
    if (arrivata) arrivate++;
    if (vista) viste++;
    spanTot += c.conto.span; opzTot += c.conto.opzioni;
    console.log(`   ${String(c.app).padEnd(22)} iniezione: ${String(c.conto.span).padStart(4)} span sciolti, `
      + `${String(c.conto.opzioni).padStart(4)} voci allungate  →  vista: ${c.conto.vistoMaiusc} unità in maiuscolo, `
      + `${c.conto.vistoTendina} tendine tagliate ${arrivata ? (vista ? '✓' : '✗ ARRIVATA E NON VISTA') : '· non arrivata'}`);
  }
  console.log(`   ${spanTot} span sciolti + ${opzTot} voci allungate su ${arrivate} superfici; il banco l'ha vista su ${viste}.`);
  console.log(ko ? '  ✓ la controprova è stata vista: il banco sa fallire'
                 : '  ✗ IL BANCO NON SA FALLIRE: i difetti erano dentro e non se n\'è accorto');
  process.exit(ko && viste ? 0 : 1);
}
process.exit(ko ? 1 : 0);
