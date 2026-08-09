/* ⚠️ NON VA IN npm test: non e' un banco, e' l'APRITORE DELLE MODALI che i
   banchi importano (SCEGLI, TOCCA, CHIUDI, DOVE, e il censimento). Gira dentro
   di loro.

   ⛔ PERCHE' STA IN UN FILE SUO, dal 09/08. Viveva dentro `modali-dentro.mjs`,
   che pero' chiama `process.exit` in fondo: chiunque altro ne avesse avuto
   bisogno avrebbe dovuto RISCRIVERLO — ed e' la copia debole che questo
   repository paga piu' cara. E' successo il 09/08 misurando il contrasto
   DENTRO le finestre: `contrasto.mjs` cammina sulle sezioni e non apre nessuna
   modale (provato: sul cammino di Scudo 1050 testi misurati, **zero** dentro
   `#modal`), quindi il colore dentro le finestre non lo guardava nessuno, in
   nessuna app e in nessuno dei tre temi. Per guardarlo serviva questo gesto,
   che esisteva gia': o lo si estraeva, o nasceva il secondo apritore.

   Le due meta', e vanno tenute distinte:
   · il GESTO (`SCEGLI` → `TOCCA` → misura → `CHIUDI`, con `DOVE` che dice se
     il tocco ha portato altrove). E' in due passi di proposito: la storia sta
     nei commenti qui sotto, e ognuno di quei commenti e' un difetto pagato;
   · il CENSIMENTO (`quanteModaliEsistono`, `titoliDalProgramma`), che risponde
     alla domanda che in questa casa conta piu' dei KO: **quante ne esistono, e
     quante ne ho aperte davvero**.

   Chi lo usa: `modali-dentro.mjs` (maiuscole, tagli, bersagli di tocco) e
   `contrasto.mjs --modali` (il colore). */
/* ══ IL CENSIMENTO ═════════════════════════════════════════════════════════
   Quante modali esistono in una superficie: quante volte il suo programma
   chiama `apriModale`, `chiedi`, `chiediValore` (le tre porte del core, dove
   passano tutte) oppure `openModal`, che è il nome che ha nel core.
   Si contano solo le chiamate VERE: `mascheraCodice` toglie il contenuto
   delle stringhe e i commenti, se no «chiedi(» dentro una frase spiegata in
   un commento conterebbe come una modale. */
import { mascheraCodice } from '../tokenizza.mjs';
export function quanteModaliEsistono(sorgente) {
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
export function titoliDalProgramma(sorgente) {
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
export const SCEGLI = ([fatti, forme, quanteVolte]) => {
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

export const TOCCA = async (attesa) => {
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
export const DOVE = () => {
  const a = document.querySelector('.screen.active');          /* il core */
  if (a) return a.id;
  const p = [...document.querySelectorAll('.page, .scr, [id^="page-"]')]
    .filter((e) => getComputedStyle(e).display !== 'none');    /* le app */
  return p.length ? p[0].id || p[0].className : '';
};

export const CHIUDI = async () => {
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
