/* ⚠️ NON VA IN npm test: non e' un banco, e' l'ATTREZZO che tutti i banchi
   importano (SUPERFICI, apriSuperficie, sezioniDi). Gira dentro di loro. */
/* IL GIRO DELLE SUPERFICI, in un posto solo.
   Aprire una pagina e visitarne le sezioni è la stessa cosa per ogni banco che
   guarda l'interfaccia: se ogni banco se la riscrive, la seconda copia nasce
   uguale e diverge al primo cambiamento — è il difetto che nel prodotto è
   costato una giornata e in Terra è costato «1.500» che diventava «500».
   Qui sta una volta sola. */

export async function prendiChromium() {
  /* Playwright non è una dipendenza del repo (nessuno vuole un `npm install`
     per aprire il progetto) ed è installato globalmente. La risoluzione dei
     moduli ES non guarda NODE_PATH: si prova il nome, poi il posto. */
  for (const dove of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs',
                      '/opt/node22/lib/node_modules/playwright/index.js']) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error("Playwright non si trova. Installalo, o lancia il banco da una cartella che ce l'ha accanto.");
  process.exit(2);
}

export const CHROMIUM = '/opt/pw-browsers/chromium';

/* ⚠️ QUESTO ELENCO È LA COPERTURA DI TUTTI I BANCHI DEL BROWSER: un'app che non
   sta qui non viene guardata da nessuno, e nessuno se ne accorge — i banchi
   dicono «ok» sulle sette che vedono. Conti è rimasta fuori fino al 30/07 e in
   tre banchi diversi non è mai stata aperta. Quando nasce un'app si aggiunge
   qui, subito. */
export const SUPERFICI = [
  ['core', '/index.html'],
  ['vetrina', '/apps/index.html'],
  ['campo', '/apps/campo/index.html'],
  ['conti', '/apps/conti/index.html'],
  ['flotta', '/apps/flotta/index.html'],
  ['scudo', '/apps/scudo/index.html'],
  ['sentinella', '/apps/sentinella/index.html'],
  ['terra', '/apps/terra/index.html'],
  ['genesi', '/apps/genesi/genesi.html'],
  /* ⛔ ENTRATE IL 01/08, e la ragione è che i banchi dicevano «tutte le
     superfici» e ne conoscevano NOVE. `run-stile.mjs` le guardava già da
     giorni; qui no — quindi su queste due pagine nessun banco ha mai misurato
     il contrasto, gli id doppi, il fuori-schermo o i bersagli di tocco.
     Non sono pagine di servizio: la prima è quella in cui finisce chi non ha
     un permesso — cioè un momento in cui l'utente è già in difficoltà — e la
     seconda è il portone di Genesi, la prima cosa che si vede.
     ⚠️ Un elenco tenuto a mano si aggiorna quando qualcuno se ne ricorda: il
     controllo in fondo a questo file pretende che le due liste combacino. */
  ['id · non autorizzato', '/apps/deepwork-id/non-autorizzato.html'],
  ['genesi · accesso', '/apps/genesi/login.html'],
  /* ⛔ ENTRATE il 01/08, e la ragione è che il controllo che le due liste
     combacino era **dichiarato in questo commento e non esisteva**: le regole
     di stile guardavano quindici superfici, il giro undici. Queste tre le apre
     un cliente davvero — è dove si accede, dove si guarda il proprio profilo e
     dove il titolare amministra l'organizzazione — e nessun banco le aveva mai
     misurate. Non hanno barra di navigazione: `sezioniDi` risponde [''] e
     vengono guardate in una passata sola, che è quello che serve. */
  ['id · accesso', '/apps/deepwork-id/index.html'],
  ['id · profilo', '/apps/deepwork-id/profilo.html'],
  ['id · amministrazione', '/apps/deepwork-id/admin.html'],
];

/* Il core è l'unico che non ha la barra delle sezioni delle app: si naviga con
   la sua funzione `nav`, la stessa che chiamano i suoi bottoni. Le sezioni con
   la chiocciola sono queste.

   ⛔ E QUESTO ELENCO NE CONTENEVA DICIASSETTE SU TRENTATRÉ, misurato il 07/08.
   È lo stesso difetto di `SUPERFICI` qui sopra, un piano più in basso: una
   schermata che non sta qui non la guarda nessun banco del browser, e nessuno
   se ne accorge — i banchi dicono «ok» su quelle che vedono. Le nove che
   mancavano non erano schermate di servizio: `rapp` e `rapp-foc` sono i due
   moduli che si compilano in cava (564 e 420 caratteri di testo, 9 e 10
   comandi), `volate-list` è il portone dell'editor di volata, e `recon3d`,
   `splat`, `3d` sono le tre schermate 3D. Il conto è stato fatto aprendo ogni
   `.screen` del core con `nav()` e misurando testo e comandi visibili.

   ⚠️ SEI RESTANO FUORI, PER DICHIARAZIONE E NON PER SVISTA: `cava-det`,
   `mac-det`, `mezzo-det`, `editor-cava`, `gemello` e `chat` non si aprono con
   `nav()` da sole — vogliono una riga scelta prima (`state.cavaSel`,
   `state.macSel`, `state.chatWith`…). Navigandoci a mano si misura un guscio
   da 6-21 caratteri
   e si dichiara «pulito» avendo guardato una schermata vuota, che è il difetto
   che questo commento esiste per non ripetere. Ci si arriva **cliccando la
   riga** nella loro lista, ed è quello che fanno i banchi che camminano sui
   comandi (`modali-dentro.mjs`). */
export const SEZIONI_CORE = ['@home', '@volate', '@cave', '@menu', '@macchine',
  '@deposito', '@personale', '@clienti', '@ufficio', '@admin', '@strumenti-foc',
  '@notifiche', '@messaggi', '@contatti', '@impostazioni', '@utenti', '@dashboard',
  '@rapp', '@rapp-foc', '@rapp-ok', '@volate-list', '@sismogrammi', '@audit',
  '@recon3d', '@splat', '@3d'];

/* L'utente finto per il core: senza, `renderHome` e mezze schermate non partono
   (`state.user` è nullo e le funzioni escono subito). Il ruolo si sceglie:
   moltissimi pezzi dell'interfaccia esistono solo per certi permessi. */
export const UTENTE_PROVA = (ruolo = 'admin') =>
  ({ id: 'u1', user: 'prova', nome: 'Giuseppe', cognome: 'F.', ruolo, cave: [] });

const AGGANCIO = 'window.fabPrimary=fabPrimary;';

/* Apre una superficie pronta all'uso. `trasforma(corpo)` permette a un banco di
   servire una versione modificata della pagina — è così che si fanno le
   controprove: si rimette il difetto e si pretende che il banco fallisca.

   ⛔ E `rotte` FA LA STESSA COSA PER I FILE CHE LA PAGINA IMPORTA, che è dove
   stanno i DATI. Nasce il 06/08 dal banco delle frasi al singolare: per vedere
   se una pagina dice «1 letture» bisogna darle **una lettura sola**, e la
   dimostrazione ne ha dodici. Le tre strade sbagliate, scartate con la ragione:
     · toccare `apps/<app>/<app>-data.js` sul disco → CLAUDE.md lo vieta (un
       giro del browser che gira in quel momento misura il difetto iniettato);
     · rifarsi un `newContext` + `goto` nel proprio banco → è la seconda copia
       di `apriSuperficie`, cioè il difetto che questo file esiste per togliere;
     · filtrare a schermo con i comandi dell'app → misura il filtro, non il
       caso limite.
   Forma: una coppia `[glob, funzione]`, dove il glob è quello di Playwright
   (due asterischi, barra, `campo-data.js`) e la funzione prende il testo del
   file e ne restituisce un altro. Si registrano PRIMA di `goto`, e il
   `content-type` resta quello vero della risposta — un modulo ES servito come
   `text/html` non viene eseguito.
   ⚠️ Il glob NON si scrive qui dentro per esteso: la sua coda è la stessa
   coppia di caratteri che chiude un commento, e la prima stesura di queste
   righe ha spaccato il file. CLAUDE.md lo dice già — un esempio di codice
   dentro un commento va scritto senza i suoi delimitatori — ed è stato rifatto
   lo stesso. */
export async function apriSuperficie(browser, { nome, via, porta, larghezza = 430, altezza = 950,
                                                ruolo = 'admin', trasforma = null, montaFintoFirebase = null,
                                                rotte = [] }) {
  /* ⛔ SUL CORE IL SERVICE WORKER VA BLOCCATO, se no il RELOAD di
     `accediAlCore` NON PASSA DALLE ROTTE. Misurato il 04/09 con una sonda
     datata: il core registra `./sw.js` (cache-first sull'app shell, e
     `./index.html` sta nella precache), e già 3,5 s dopo il primo `goto`
     `navigator.serviceWorker.controller` è attivo. Al reload la rotta su
     `index.html` NON veniva colpita (una richiesta sola, non due), la pagina
     tornava dalla cache del SW in 72–98 ms **senza la porticina**
     `__provaUtente` (e senza il finto Firestore che rifiuta), i moduli gstatic
     uscivano `net::ERR_ABORTED` — e l'accesso non riusciva più: ogni banco
     moriva su «`window.__provaUtente is not a function`». Con il SW bloccato:
     due richieste, porticina presente, dentro al secondo tentativo in 1,3 s.
     È la stessa famiglia già scritta in `core-documenti-che-escono.mjs`: le
     rotte di Playwright non intercettano ciò che passa dal service worker.
     Solo per il core: le app non hanno un SW (Genesi sì, ma nessun banco la
     ricarica) e non si cambia il comportamento di chi già entrava. */
  const ctx = await browser.newContext({ viewport: { width: larghezza, height: altezza }, locale: 'it-IT',
                                         ...(nome === 'core' ? { serviceWorkers: 'block' } : {}) });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  if (nome === 'core' && montaFintoFirebase) await montaFintoFirebase(p);
  for (const [glob, fn] of rotte) {
    await p.route(glob, async (r) => {
      const res = await r.fetch();
      const prima = await res.text();
      const dopo = fn(prima);
      /* ⚠️ UN `replace` CHE NON TROVA NIENTE NON FALLISCE: restituisce il testo
         identico, il banco gira su dati NON modificati e stampa verde. È la
         trappola dello script che «non fallisce» senza aver fatto niente,
         scritta in CLAUDE.md. Qui si vede subito. */
      if (dopo === prima) { console.error(`✗ rotta ${glob}: la trasformazione non ha cambiato niente`); process.exit(2); }
      await r.fulfill({ status: 200, headers: res.headers(), body: dopo });
    });
  }
  if (nome === 'core' || trasforma) {
    await p.route('**' + via, async (r) => {
      const res = await r.fetch();
      let corpo = await res.text();
      if (nome === 'core') {
        /* `state` del core è una variabile di modulo, non sta su window: senza
           una porticina non si può dargli un utente, e senza utente metà
           schermate restano vuote. Il file su disco non viene toccato. */
        if (!corpo.includes(AGGANCIO)) { console.error('✗ punto di aggancio non trovato nel core'); process.exit(2); }
        corpo = corpo.replace(AGGANCIO, AGGANCIO + '\nwindow.__provaUtente=(u)=>{state.user=u;};');
      }
      if (trasforma) corpo = trasforma(corpo);
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: corpo });
    });
  }
  await p.goto(`http://127.0.0.1:${porta}${via}`);
  await p.waitForTimeout(nome === 'core' ? 3500 : 2200);
  if (nome === 'core') {
    /* ⛔ FINO AL 03/08 QUI IL CORE RESTAVA SULLA SCHERMATA D'ACCESSO, e ogni
       banco che «guardava il core» guardava un guscio vuoto. Misurato:
       **1.036 elementi, 258 caratteri di testo, UN bottone visibile**, e in
       `@volate` 107 caratteri. `state.user` iniettato non basta: senza dati il
       `DB` è vuoto e le schermate non disegnano niente. Il segno da leggere
       era già stampato dal banco delle modali — «core: nessuna modale aperta —
       il banco NON ha guardato questa superficie (nel suo programma ce ne sono
       68 da aprire)» — cioè il controllo lo DICHIARAVA e nessuno lo leggeva.
       Due cose servono, e sono tutt'e due in CLAUDE.md già pagate a caro
       prezzo:
       1. il finto Firestore deve **RIFIUTARE**. Se risponde «nessun documento»
          il core crede di essere al primo avvio, semina il database e
          l'accesso risponde «Credenziali errate» su credenziali giuste: i dati
          d'esempio si caricano solo passando dal ripiego;
       2. l'accesso va **ritentato**, perché i dati arrivano DOPO che `doLogin`
          esiste. */
    const dentro = await accediAlCore(p);
    /* ⛔ E SE NON CI SI RIESCE, LO SI DICE. Un banco che misura il guscio della
       schermata d'accesso credendo di misurare l'app è la stessa cosa che
       questa correzione è nata per togliere: sotto carico (il giro completo
       più tre cantieri) i tentativi possono esaurirsi, e allora il numero che
       esce è di un'altra pagina. La riga costa niente e si vede nel riepilogo
       del banco che la stampa. */
    if (!dentro) console.warn('  ⚠️  core: non si è riusciti ad ACCEDERE — quello che segue misura la schermata d\'accesso, non l\'app');
    /* ⛔ E SE LA PORTICINA NON C'È, LO SI DICE INVECE DI MORIRE. Fino al 04/09
       questa riga era un `TypeError` che uccideva il banco intero — nessun
       riepilogo, nessuna riga «non ho guardato» — quando la pagina dopo
       l'accesso non era più quella servita dalla rotta (vedi il blocco sul
       service worker più su). Un banco che muore qui non ha misurato niente:
       si dichiara, e si torna con `dentro:false` così chi chiama lo stampa. */
    const porticina = await p.evaluate(() => typeof window.__provaUtente === 'function').catch(() => false);
    if (!porticina) {
      console.warn('  ⚠️  core: la porticina __provaUtente non c\'è dopo l\'accesso — la pagina non è quella servita dalla rotta (service worker? reload fuori rotta?): quello che segue è il GUSCIO');
      return { ctx, p, errori, dentro: false };
    }
    await p.evaluate((u) => window.__provaUtente(u), UTENTE_PROVA(ruolo));
    return { ctx, p, errori, dentro };
  }
  return { ctx, p, errori, dentro: true };
}

/* Entra nel core coi dati d'esempio. Torna `true` se ci è riuscito: chi la
   chiama può dichiarare di aver guardato un guscio vuoto invece di tacere. */
export async function accediAlCore(p) {
  const { MODULI } = await import('./finto-firebase.mjs');
  await p.route('https://www.gstatic.com/firebasejs/**firebase-firestore.js', (r) =>
    r.fulfill({ status: 200, contentType: 'text/javascript',
      body: MODULI['firebase-firestore.js'].replace(
        "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
        "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));
  await p.reload({ waitUntil: 'load' }).catch(() => {});
  await p.waitForFunction(() => typeof window.doLogin === 'function', { timeout: 30000 }).catch(() => {});
  /* ⚠️ I DATI ARRIVANO DOPO `doLogin`, e sotto carico anche parecchio dopo:
     cliccare troppo presto legge «Credenziali errate» su credenziali giuste.
     Si aspetta il segnale vero — la lista degli utenti nel DB — e solo dopo si
     prova, con dieci tentativi invece di sei. */
  await p.waitForFunction(() => {
    const b = document.getElementById('btn-login');
    return !!b && !b.disabled;
  }, { timeout: 30000 }).catch(() => {});
  for (let giro = 0; giro < 10; giro++) {
    const dentro = await p.evaluate(() => {
      const h = document.getElementById('screen-home');
      return !!h && getComputedStyle(h).display !== 'none';
    }).catch(() => false);
    if (dentro) return true;
    /* ⚠️ TIMEOUT ESPLICITI: quando il campo non è azionabile (la pagina è un
       guscio) `fill`/`click` aspettano i 30 s di Playwright CIASCUNO, e dieci
       giri fanno un quarto d'ora di banco appeso senza una riga. Misurato il
       04/09: 31 s a giro. Se il campo è visibile, 5 s bastano a chiunque. */
    await p.fill('#lu', 'admin', { timeout: 5000 }).catch(() => {});
    await p.fill('#lp', 'admin', { timeout: 5000 }).catch(() => {});
    await p.click('#btn-login', { timeout: 5000 }).catch(() => {});
    await p.waitForFunction(() => {
      const h = document.getElementById('screen-home');
      return !!h && getComputedStyle(h).display !== 'none';
    }, { timeout: 2500 }).catch(() => {});
  }
  return false;
}

/* L'elenco delle sezioni da visitare, nella forma che `vaiA` sa usare. */
export async function sezioniDi(p, nome) {
  if (nome === 'core') return SEZIONI_CORE;
  const s = await p.$$eval('.nav button[id^=nav-], #bottomnav button[data-scr]',
    (bs) => bs.map((x) => x.id || `[data-scr="${x.dataset.scr}"]`));
  return s.length ? s : [''];
}

/* Va in una sezione e apre quello che sta chiuso: fisarmoniche, pannelli,
   linguette. È il gesto che farebbe una persona, non un forzare gli stili — che
   non regge, perché la schermata rimette a posto i propri stili appena cambia. */
export async function vaiA(p, nome, sezione) {
  /* ⛔ CHIAMATA CON DUE ARGOMENTI: NON NAVIGA, E NON SE NE ACCORGE NESSUNO.
     Successo il 01/08 scrivendo una sonda: `vaiA(p, sez)` mette la sezione in
     `nome`, lascia `sezione` a `undefined`, e la funzione esce senza cliccare
     niente. La sonda ha girato otto sezioni di Conti misurando **otto volte la
     stessa schermata** — e il risultato non sembrava rotto, sembrava un
     prodotto strano: la stessa riga che compariva in ogni sezione. Da lì una
     conclusione sbagliata sul prodotto, e mezz'ora buttata a cercarla nel posto
     sbagliato.
     Non è la firma a essere sbagliata (i banchi la usano bene da sempre): è che
     l'errore è **silenzioso**, e un banco che non naviga risponde «tutto a
     posto» dopo aver guardato una schermata su otto. Costa una riga impedirlo.
     ⚠️ Il controllo è sul NUMERO di argomenti, non sul valore: `sezione` vuota
     è legittima — è quello che risponde `sezioniDi` per le pagine senza barra
     di navigazione, e vuol dire «guardala tutta in una passata». */
  if (arguments.length < 3) {
    throw new Error('vaiA(p, nome, sezione) vuole TRE argomenti: chiamata con '
      + `${arguments.length} ("${nome}" e' finito in \`nome\`). Senza il terzo non naviga, `
      + 'e il banco misurerebbe la stessa schermata a ogni giro.');
  }
  if (sezione && sezione.startsWith('@')) {
    await p.evaluate((x) => { if (typeof nav === 'function') nav(x); }, sezione.slice(1)).catch(() => {});
    await p.waitForTimeout(450);
    /* nell'amministrazione del core i campi stanno in linguette */
    if (sezione === '@admin') {
      for (const l of await p.$$('#screen-admin .atab')) {
        await l.click({ timeout: 2500 }).catch(() => {});
        await p.waitForTimeout(180);
      }
    }
  } else if (sezione) {
    const sel = sezione.startsWith('[') ? `#bottomnav button${sezione}` : `#${sezione}`;
    await p.click(sel, { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(500);
  }
  /* il pannello dei parametri del 3D di Genesi */
  if (nome === 'genesi' && !(await p.evaluate(() => document.body.classList.contains('show-params')))) {
    await p.click('#btnParams', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(400);
  }
  /* ⛔ SOLO QUELLI CHE SI VEDONO, E IL NUMERO CHE LO IMPONE È 17 SECONDI PER
     SEZIONE. Misurato l'08/08 inseguendo un giro del browser rimasto appeso
     sette ore e mezza. Questa riga apriva OGNI accordion chiuso della pagina —
     non solo quelli della sezione appena aperta — e su Flotta e Scudo sono
     **sette, tutti INVISIBILI** perché stanno in sezioni che non sono a
     schermo. Playwright aspetta che un elemento diventi *azionabile*: un
     invisibile non lo diventa mai, quindi ogni click bruciava i 2.500 ms pieni
     e il `.catch(() => {})` se li mangiava senza lasciare traccia.
     Il costo, misurato con `vaiA` cronometrata: Conti **0,55 s** per sezione
     (zero accordion chiusi), Terra 3,2 (uno), Flotta e Scudo **oltre 15** —
     trenta volte Conti, e nessuno dei due click serviva a niente.
     ⚠️ Non è un'ottimizzazione «per far prima»: era un'eccezione ingoiata che
     costava ore e non produceva NIENTE DA LEGGERE. E la conta dice che non si
     perde copertura — su quelle quattro superfici gli accordion chiusi e
     VISIBILI sono zero: quel giro non ne apriva nessuno.
     Il timeout resta corto di proposito: se un accordion visibile non si apre
     in 800 ms non è lentezza, è un difetto, e va visto altrove. */
  for (const acc of await p.$$('.dc-sec.closed .dc-sec-h:visible, details:not([open]) > summary:visible')) {
    await acc.click({ timeout: 800 }).catch(() => {});
    await p.waitForTimeout(60);
  }
}

/* ⛔ LA FRASE DI RIEPILOGO CONTRO IL FILE, in un posto solo.
   La domanda di `CLAUDE.md` nomina tre cose che escono: «un CSV, un PDF, una
   FRASE DI RIEPILOGO». Frase e file sono **due uscite della stessa azione**:
   il numero che la frase dichiara deve rendere conto delle righe che il file
   contiene. Se divergono, una delle due mente — e quella che l'utente legge è
   la frase. La forma in cui divergono è sempre la stessa: la frase conta
   l'array SORGENTE mentre il ciclo che scrive FILTRA.

   Sta qui perché la usano già due banchi (Flotta e Conti), e una regola usata
   due volte in questa casa si scrive una volta: due copie nascono uguali e
   divergono al primo cambiamento.

   ⚠️ TRE COSE IMPARATE SCRIVENDOLA, tutte nel righello e nessuna nel prodotto:
   1. le frasi VECCHIE restano a schermo, quindi vanno azzerate PRIMA del click
      (se no si legge il conto di un'altra esportazione: otto KO tutti falsi);
   2. la stessa frase compare spesso in DUE elementi — la nota della scheda e
      il toast — e sommandone i numeri il conto raddoppia: si deduplica;
   3. «il primo numero = le righe» sbaglia, perché una frase può portare più
      conti («6 mezzi, 3 manutenzioni, 1 ricambio» → 10 righe) e il file può
      avere righe che non sono dati (un'avvertenza in coda, una cella sola).
      La domanda che regge: le righe di DATO stanno fra i numeri della frase,
      oppure sono la loro somma.
   ⚠️ E gli IMPORTI non sono conti: «per circa € 18,00» non dice quante righe
   ci sono. Si tolgono prima di leggere i numeri — in Flotta l'inclusione li
   tollerava per caso, ma un numero di troppo fa passare il confronto per la
   ragione sbagliata, che è peggio di un fallimento. */
/* ⚠️ E IL SELETTORE STA IN UNA COSTANTE SOLA perché la domanda che segue non
   si può fare senza di lui: «la frase è vuota» ha DUE cause opposte — la
   pagina non ha nessun posto dove dirla (il RIGHELLO non guarda dove crede),
   oppure il posto c'è e il prodotto non ci ha scritto niente (il PRODOTTO non
   annuncia quanto esce). Contarle insieme fa passare la prima per la seconda,
   e il 08/08 su Genesi è successo: sette uscite marcate «non viste dal
   selettore» mentre `#toast` in quella pagina c'è, alla riga 972. Chi vuole
   distinguerle chiama `postiDaFrase`, che riusa QUESTO selettore: scritto una
   seconda volta a mano, il giorno che si allarga uno dei due, l'altro risponde
   su una domanda diversa senza dirlo. */
export const SEL_FRASI = ".esito, .note.esito, #toast, .toast";
export async function azzeraFrasi(pg) {
  await pg.evaluate((s) => {
    for (const e of document.querySelectorAll(s)) e.textContent = "";
  }, SEL_FRASI);
}
export async function frasiVisibili(pg) {
  return pg.evaluate((s) => {
    const vive = [...document.querySelectorAll(s)]
      .filter((e) => e.textContent.trim() && getComputedStyle(e).display !== "none");
    return [...new Set(vive.map((e) => e.textContent.replace(/\s+/g, " ").trim()))].join(" | ");
  }, SEL_FRASI);
}
/* quanti posti ha questa pagina per dire una frase di riepilogo: zero vuol
   dire che il silenzio misurato sopra è del righello, non del prodotto */
export async function postiDaFrase(pg) {
  return pg.evaluate((s) => document.querySelectorAll(s).length, SEL_FRASI);
}
/* i numeri che in una frase sono CONTI: via gli importi (€ prima o dopo), le
   percentuali e i decimali, che non dicono quante righe ci sono */
export function contiNellaFrase(frase) {
  /* ⚠️ E NON SONO CONTI NEMMENO I PERIODI E LE DURATE. «Riepilogo near-miss
     esportato (ultimi 90 giorni)» non dice quante righe ci sono: dice su che
     finestra. Misurato su Scudo, dove quel 90 accusava un export sano.
     La domanda da farsi davanti a ogni numero di una frase — ed è la stessa
     che serve per le ore di Campo e le soglie di Sentinella — è: **è un conto
     o è una misura?** */
  const pulita = String(frase || "")
    .replace(/€\s*[\d.]+(?:,\d+)?/g, " ")
    .replace(/[\d.]+(?:,\d+)?\s*(?:€|%)/g, " ")
    .replace(/\b(?:ultim|prossim|prim)[aeio]\s+[\d.]+/gi, " ")
    .replace(/[\d.]+(?:,\d+)?\s*(?:giorn[io]|mes[ei]|ann[io]|or[ae]|minut[io]|gg|mm\/s|kg|m³|t)\b/gi, " ")
    .replace(/\d+,\d+/g, " ");
  return [...pulita.matchAll(/\b(\d[\d.]*)\b/g)]
    .map((x) => +x[1].replace(/\./g, "")).filter(Number.isFinite);
}
/* le righe di DATO di un CSV: senza intestazione e senza le righe che non
   hanno separatori (le avvertenze in coda, che sono una cella sola) */
export function righeDiDato(righe) {
  return (righe || []).slice(1).filter((r) => String(r).includes(";")).length;
}

/* ⛔ LA LARGHEZZA DELLA CARTA, CHIESTA AL DOCUMENTO INVECE CHE INDOVINATA.
   Sta qui perché il 09/08 la stessa decisione è nata in DUE banchi nello
   stesso blocco — `scudo-documenti` e `genesi-foglio-in-cava` — e la regola di
   casa dice che a quel punto si scrive una volta sola, prima che nasca la
   terza copia (che sarebbe `stampe-fs`, dove la domanda è già dichiarata
   aperta in roadmap).

   La ragione per cui la funzione esiste: un foglio che vive in `@media print`
   **non si stampa sul telefono, si stampa sulla carta**. Misurarlo contro
   `window.innerWidth` a 390 px produce **accuse false** — 390 è più stretto di
   una A4 (688 px col margine di 14 mm, 718 col margine di serie del browser),
   quindi un foglio sano risulta traboccante. È costato un'accusa a un verbale
   di Scudo che ci stava con 62 px di margine, e la correzione «ovvia» sarebbe
   stata togliergli una colonna.

   `mm` e `bordoMm` sono i RIPIEGHI, e vanno **dichiarati da chi chiama**: se
   il documento non porta una regola `@page` non lo si può sapere, e un numero
   inventato in silenzio è peggio di un ripiego scritto. */
export const FORMATI_CARTA = { a4: 210, a5: 148, letter: 215.9 };
export function larghezzaCarta(cssDellaRegolaPage, { mm = 210, bordoMm = 14 } = {}) {
  const t = String(cssDellaRegolaPage || "");
  const f = (t.match(/\b(a4|a5|letter)\b/i) || [])[1];
  const m = t.match(/margin:\s*([\d.]+)mm(?:\s+([\d.]+)mm)?/i);
  const larga = f ? FORMATI_CARTA[f.toLowerCase()] : mm;
  const bordo = m ? +(m[2] ?? m[1]) : bordoMm;
  return { px: Math.round((larga - 2 * bordo) * 96 / 25.4), larga, bordo, dichiarata: !!(f || m) };
}
/* la regola `@page` come la vede il browser: si chiede al foglio di stile, non
   si cerca a testo nel sorgente (una regola può stare in una stringa, in un
   file a parte, o essere stata riscritta a runtime) */
export async function regolaPage(pg) {
  return pg.evaluate(() => {
    for (const ss of document.styleSheets) {
      let regole; try { regole = ss.cssRules; } catch { continue; }
      for (const r of regole || []) {
        if (r.constructor.name !== "CSSMediaRule" || r.conditionText !== "print") continue;
        for (const q of r.cssRules) if (q.constructor.name === "CSSPageRule") return q.style.cssText;
      }
    }
    return null;
  });
}
