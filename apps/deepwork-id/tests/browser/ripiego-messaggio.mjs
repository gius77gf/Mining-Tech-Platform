/* ⛔ CHE COSA DICE IL CORE QUANDO IL DATABASE NON RISPONDE.
   Banco nato il 02/08, il giorno in cui il fondatore ha chiuso le regole del
   Firebase pubblico (`allow read, write: if false`). Da quel momento il ramo
   di ripiego del core — `initDBOfflineFallback` — non è più il caso raro: è
   quello che prende **tutti** i visitatori del sito dimostrativo. E diceva:

       «⚠ Modalità degradata — connessione database non disponibile»

   falso nel caso più frequente (la connessione c'era, erano le regole a dire
   di no) e muto sulla cosa che riguarda chi legge: che da lì in poi quello che
   scrive **non viene salvato**.

   ⚠️ PERCHÉ QUESTO BANCO ESISTE INVECE DI UNA PROVA `node`. La scelta del
   messaggio è pura e sta in `shared/` (`motivoDatiNonSalvati`), provata in
   `run-helpers.mjs`. Quello che `node` NON può vedere è il **collegamento**:
   che il core la chiami davvero, con l'errore vero, e che il badge resti
   acceso. È la guardia scollegata di CLAUDE.md: una funzione giusta che non
   chiama nessuno non protegge niente.

   ⚠️ E IL CORE IN LOCALE NON PARTE DA SOLO. Tutto il suo programma sta in un
   `<script type="module">` che importa Firebase da gstatic.com: senza rete
   l'import fallisce, il modulo non gira e restano i segnaposto. Chi non lo sa
   misura una pagina che non ha mai eseguito una riga — ed è successo oggi,
   scrivendo questo banco: la prima misura diceva «la pagina entra» guardando
   il markup statico. Si monta `finto-firebase.mjs` PRIMA di `goto`.

   Si lancia con: node ripiego-messaggio.mjs [porta] [--controprova]
   `--controprova` rimette il messaggio unico di prima e pretende che il banco
   cada: senza, non si sa se stia misurando qualcosa.

   ⛔ E LA RIGA FINALE DELLA CONTROPROVA DICEVA «10 FALLITI» COME UN GUASTO VERO.
   Misurato il 07/08, e il costo è stato un cantiere aperto per niente: nel
   registro del giro completo la controprova stampava

       Risultato messaggio del ripiego: 26 passati, 10 falliti

   con le stesse identiche parole della passata normale — che nello stesso
   registro, dodici righe più su, diceva «36 passati, 0 falliti». Quel 10 è il
   risultato VOLUTO (è il difetto rimesso dentro che fa cadere le asserzioni sul
   messaggio), ma chi legge il registro non ha nessun modo di saperlo dalla riga.
   Un rosso che vuol dire verde è peggio di un rosso: insegna a non fidarsi di
   nessuno dei due. Adesso le due passate parlano due lingue diverse.

   ⛔ E LA CONTROPROVA NON GUARDAVA *QUALI* ASSERZIONI CADEVANO. Bastava un
   `falliti > 0` — cioè avrebbe detto «il banco SA fallire» anche se a cadere
   fosse stato «il programma del core è partito davvero», che vuol dire il
   contrario: banco rotto, non rilevatore vivo. È la quarta delle cinque cause
   di CLAUDE.md (l'iniezione puntata nel posto sbagliato) letta al rovescio.
   Adesso pretende due cose: che a cadere siano **solo** asserzioni sul
   messaggio, e che **ogni caso** ne faccia cadere almeno una — se no
   l'iniezione ha raggiunto due casi su tre e nessuno se ne accorge. */

import { prendiChromium, CHROMIUM } from './giro.mjs';
import { MODULI, montaFintoFirebase } from './finto-firebase.mjs';
const chromium = await prendiChromium();

const PORTA = process.argv.find((a) => /^\d+$/.test(a)) || '8791';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
/* i NOMI di quelle cadute, non solo il conto: serve alla controprova per dire
   se è caduto il rilevatore o il banco */
const caduti = [];
const ok = (cond, nome, dettaglio = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; caduti.push(nome); console.error(`  ✗ ${nome}${dettaglio ? ' — ' + dettaglio : ''}`); }
};

/* Le asserzioni che parlano del MESSAGGIO — le sole che il difetto rimesso
   dentro dalla controprova può far cadere. Tutte le altre («il programma del
   core è partito davvero», «si entra davvero nell'app», «nessun errore di
   pagina», quelle sul badge) riguardano la STRUTTURA: se cade una di quelle, il
   banco è rotto, e un `falliti > 0` da solo lo scambierebbe per un successo. */
const SUL_MESSAGGIO = /il messaggio dice la causa giusta|la cosa che riguarda chi legge|modalità degradata|il tono è quello giusto/;

/* ⚠️ QUANTE SCHERMATE HA GUARDATO DAVVERO. CLAUDE.md: dopo aver scritto un
   controllo ci si chiede quanti soggetti ha guardato e lo si STAMPA — un numero
   che non torna si vede, un «zero violazioni» no. Qui le schermate sono due per
   caso, e sono di piani diversi: quella d'accesso (dove vive il toast) e quella
   dentro l'app (l'unica dove la barra in alto esiste, quindi l'unica dove il
   badge si può misurare). Si contano DOPO la prova di esserci arrivati, non
   prima: un login che non riesce deve far scendere il numero. */
let schermate = 0;

/* I tre casi, e il perché di ognuno. Il codice è quello che l'SDK di Firestore
   mette in `error.code`. */
const CASI = [
  { nome: 'regole chiuse', codice: 'permission-denied',
    attesa: /Accesso al database non consentito/, tono: 'info',
    perche: 'è il caso di OGGI: le regole dicono di no, la rete sta benissimo' },
  { nome: 'rete morta', codice: 'unavailable',
    attesa: /Nessun collegamento al database/, tono: 'err',
    perche: 'il caso per cui il ripiego era nato' },
  { nome: 'causa ignota', codice: 'boh-mai-visto',
    attesa: /Database non raggiungibile/, tono: 'err',
    perche: 'quello che non si sa si dichiara: non diventa «va tutto bene»' },
];

/* Un Firestore finto che RIFIUTA con il codice voluto: è l'unico modo di far
   percorrere al core il ramo vero, quello del `catch`. */
function firestoreCheRifiuta(codice) {
  return MODULI['firebase-firestore.js'].replace(
    'export async function getDoc() { return { exists: () => false, data: () => null, id: \'finto\' }; }',
    `export async function getDoc() {
       const e = new Error('finto: ${codice}'); e.code = '${codice}'; throw e; }`
  );
}

const browser = await chromium.launch({ executablePath: CHROMIUM });
let iniezioni = 0;

for (const caso of CASI) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await montaFintoFirebase(p);
  // ... e sopra ci va la rotta più stretta, che vince: Playwright usa l'ultima
  // registrata. Qui si sostituisce SOLO il modulo firestore.
  await p.route('https://www.gstatic.com/firebasejs/**firebase-firestore.js', (r) =>
    r.fulfill({ status: 200, contentType: 'text/javascript', body: firestoreCheRifiuta(caso.codice) }));
  iniezioni++;

  if (CONTROPROVA) {
    // il messaggio unico di prima, rimesso nella pagina servita
    await p.route(`${BASE}/index.html`, async (r) => {
      const risp = await r.fetch();
      let corpo = await risp.text();
      const prima = corpo.length;
      corpo = corpo.replace(
        'setTimeout(()=>toast(state.soloMemoria.messaggio, state.soloMemoria.tono), 600);',
        "setTimeout(()=>toast('⚠ Modalità degradata — connessione database non disponibile','err'), 600);"
      );
      if (corpo.length === prima) throw new Error('CONTROPROVA A VUOTO: il testo da sostituire non c\'è più');
      await r.fulfill({ status: 200, contentType: 'text/html', body: corpo });
    });
  }

  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  await p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await p.waitForFunction(() => document.getElementById('toast').classList.contains('show'), { timeout: 15000 })
    .catch(() => {});

  const m = await p.evaluate(() => {
    const t = document.getElementById('toast');
    const b = document.getElementById('sync-badge');
    const rb = b && b.getBoundingClientRect();
    return {
      testo: t.textContent, classi: t.className, mostrato: t.classList.contains('show'),
      // la risposta del browser alla domanda «esce dal suo spazio?»
      esce: t.scrollWidth > t.clientWidth,
      badge: b ? { testo: b.innerText, classi: b.className, titolo: b.title,
                   visibile: !!rb && rb.width > 0 && rb.height > 0 } : null,
      // prova di essere davvero nel ripiego: il core ha caricato i default
      programmaPartito: typeof window.doLogin === 'function',
    };
  });

  console.log(`\n[${caso.nome}] ${caso.perche}`);
  console.log(`  toast: «${m.testo}» (${m.classi})`);
  console.log(`  badge: ${m.badge ? `«${m.badge.testo}» ${m.badge.classi} visibile=${m.badge.visibile}` : '(assente)'}`);

  ok(m.programmaPartito, `${caso.nome}: il programma del core è partito davvero`,
    'senza finto-firebase si misura il markup statico, non il core');
  if (m.programmaPartito) schermate++;   // la schermata d'accesso, misurata davvero
  ok(errori.length === 0, `${caso.nome}: nessun errore di pagina`, errori.join(' · '));
  ok(caso.attesa.test(m.testo), `${caso.nome}: il messaggio dice la causa giusta`, `letto «${m.testo}»`);
  ok(/quello che scrivi non viene salvato/.test(m.testo),
    `${caso.nome}: e dice la cosa che riguarda chi legge`, `letto «${m.testo}»`);
  ok(!/degradata/.test(m.testo), `${caso.nome}: niente «modalità degradata»`, `letto «${m.testo}»`);
  ok(m.classi.includes(caso.tono), `${caso.nome}: il tono è quello giusto (${caso.tono})`, m.classi);
  ok(!m.esce, `${caso.nome}: il messaggio non esce dal suo spazio`);
  /* ⛔ IL BADGE VA GUARDATO DENTRO L'APP, NON SULLA SCHERMATA DI ACCESSO.
     Prima misura di questo banco: badge «NON SALVA» con la classe giusta e
     `visibile=false` su tutti e tre i casi — e non era un difetto, è che la
     barra in alto non c'è finché non si entra. Un banco che misura la cosa
     giusta nel posto sbagliato dice tre volte «rotto» su codice sano. */
  await p.fill('#lu', 'admin');
  await p.fill('#lp', 'admin');
  await p.click('#btn-login');
  await p.waitForFunction(() => {
    const h = document.getElementById('screen-home');
    return h && getComputedStyle(h).display !== 'none';
  }, { timeout: 8000 }).catch(() => {});
  const dentro = await p.evaluate(() => {
    const h = document.getElementById('screen-home');
    const b = document.getElementById('sync-badge');
    const rb = b && b.getBoundingClientRect();
    return {
      entrato: !!h && getComputedStyle(h).display !== 'none',
      badge: b ? { testo: b.innerText, classi: b.className, titolo: b.title,
                   visibile: !!rb && rb.width > 0 && rb.height > 0,
                   esce: b.scrollWidth > b.clientWidth,
                   anima: getComputedStyle(b).animationName } : null,
    };
  });
  console.log(`  dentro: entrato=${dentro.entrato} badge=${dentro.badge ? `«${dentro.badge.testo}» visibile=${dentro.badge.visibile}` : '(assente)'}`);

  // la prova di essere entrati, prima di misurare qualunque cosa dell'app
  ok(dentro.entrato, `${caso.nome}: si entra davvero nell'app`);
  if (dentro.entrato) schermate++;       // la schermata dentro l'app, misurata davvero
  ok(!!dentro.badge && dentro.badge.visibile && /NON SALVA/.test(dentro.badge.testo),
    `${caso.nome}: il badge resta acceso quando il toast se ne va`,
    dentro.badge ? `«${dentro.badge.testo}» visibile=${dentro.badge.visibile}` : 'badge assente');
  ok(!!dentro.badge && !dentro.badge.esce, `${caso.nome}: il badge non esce dal suo spazio`);
  ok(!!dentro.badge && /quello che scrivi non viene salvato/.test(dentro.badge.titolo),
    `${caso.nome}: e il motivo per esteso resta a portata di mouse`,
    dentro.badge ? `«${dentro.badge.titolo}»` : '');
  /* NON lampeggia: non è un'attesa che passerà, è lo stato di tutta la
     sessione, e una cosa che pulsa si smette di guardare. */
  ok(!!dentro.badge && dentro.badge.anima === 'none', `${caso.nome}: il badge non lampeggia`,
    dentro.badge ? dentro.badge.anima : '');

  await p.close();
}

console.log(`\n${iniezioni} casi montati sul core vero`);
const ATTESE = CASI.length * 2;
console.log(`schermate guardate davvero: ${schermate} su ${ATTESE} attese `
  + `(${CASI.length} casi × la schermata d'accesso + quella dentro l'app)`);
await browser.close();

if (!CONTROPROVA) {
  console.log(`\nRisultato messaggio del ripiego: ${passati} passati, ${falliti} falliti`);
  process.exit(falliti > 0 ? 1 : 0);
}

/* ⛔ DA QUI IN GIÙ IL ROSSO È IL RISULTATO VOLUTO, E LA RIGA DEVE DIRLO.
   Le parole sono di proposito diverse da quelle della passata normale: nel
   registro del giro completo le due passate stanno a poche righe di distanza, e
   finché dicevano tutt'e due «N passati, M falliti» la seconda si leggeva come
   un guasto. Qui si scrive «cadute», che è quello che sono. */
const suStruttura = caduti.filter((n) => !SUL_MESSAGGIO.test(n));
const casiMuti = CASI.filter((c) => !caduti.some((n) => n.startsWith(`${c.nome}:`)));

console.log(`\nCONTROPROVA — il difetto è stato rimesso dentro, quindi le cadute `
  + `sono il risultato VOLUTO:`);
console.log(`  ${falliti} asserzioni cadute su ${passati + falliti}, `
  + `${passati} rimaste in piedi`);
console.log(`  cadute sul messaggio: ${caduti.length - suStruttura.length} · `
  + `sulla struttura del banco: ${suStruttura.length} (devono essere zero)`);
console.log(`  casi in cui l'iniezione NON ha morso: `
  + `${casiMuti.length ? casiMuti.map((c) => c.nome).join(', ') : 'nessuno'}`);

/* Tre condizioni, e servono tutt'e tre. `falliti > 0` da solo diceva «il banco
   SA fallire» anche quando a cadere era «il programma del core è partito
   davvero» — cioè quando il banco era rotto e non stava misurando niente. */
const strutturaIntatta = suStruttura.length === 0;
const tuttiMorsi = casiMuti.length === 0;
if (falliti > 0 && strutturaIntatta && tuttiMorsi) {
  console.log('controprova: il banco SA fallire');
  process.exit(0);
}
if (falliti === 0) console.error('controprova: NON distingue — il difetto rimesso dentro non fa cadere niente');
if (!strutturaIntatta) console.error('controprova: NON VALE — sono cadute asserzioni sulla STRUTTURA, '
  + `il banco è rotto e non sta misurando il messaggio: ${suStruttura.join(' · ')}`);
if (!tuttiMorsi) console.error('controprova: PARZIALE — l\'iniezione non ha raggiunto tutti i casi, '
  + `quindi «sa fallire» varrebbe solo per una parte: ${casiMuti.map((c) => c.nome).join(', ')}`);
process.exit(1);
