/* IL SALVATAGGIO CHE NON RIESCE — che cosa vede chi sta davanti alla macchina.
   ────────────────────────────────────────────────────────────────────────
   Flotta è l'app che si usa IN CAVA: il giro macchina si fa in piazzale a
   inizio turno, il guasto si segnala dove è successo. Sono i due posti dove la
   rete non c'è.

   ⛔ IL FATTO, MISURATO PRIMA DI SCRIVERE QUESTO BANCO (01/08). Col pacchetto
   `firebase` vero (12.16.0, quello in `tests/node_modules`) e la rete chiusa
   con `disableNetwork`, su quattro chiamate:
     · `addDoc` di un controllo      → PENDENTE (4 s di attesa, non si muove)
     · `addDoc` di una manutenzione  → PENDENTE
     · `updateDoc` delle ore         → PENDENTE
     · `getDocs`                     → risolta in 8 ms, dalla cache
   Le scritture **non rifiutano**: restano appese. Quindi il difetto non era un
   errore da catturare — un `try/catch` non lo vede — ma un `await` che non
   torna. Fino al 01/08 il gestore del giro macchina si fermava lì: nessun
   toast, nessun errore, la scheda ferma col dito ancora sul bottone.

   ⚠️ CHE COSA MISURA QUESTO BANCO, E CHE COSA NO. Firestore vero qui non c'è
   (serve rete e un progetto): al suo posto c'è un finto che **applica la
   regola misurata sopra** — a `navigator.onLine` falso le scritture non
   rispondono mai. Quello che si misura è dunque **la PAGINA**: che cosa fa
   Flotta quando una scrittura non torna. Che sia proprio quello il
   comportamento di Firestore lo dice la misura qui sopra, non questo banco.

   Uso:
     node salvataggio-offline.mjs [porta]
     node salvataggio-offline.mjs [porta] --senza-guardia   (DEVE fallire)

   Con `--senza-guardia` la pagina servita torna a com'era: `salva()` aspetta e
   basta, e il bottone non si spegne. Le stesse asserzioni devono cadere — se
   non cadono, il banco non sta misurando la difesa.
*/
import { prendiChromium, CHROMIUM } from './giro.mjs';

const args = process.argv.slice(2);
const SENZA = args.includes('--senza-guardia');
const PORTA = Number(args.find((a) => /^\d+$/.test(a))) || 8853;
const VIA = '/apps/flotta/index.html';

/* ── il finto Firebase in modo MEMBRO ────────────────────────────────────
   `finto-firebase.mjs` serve ad aprire il core e lascia le app in
   dimostrazione (niente auth → `flottaData` ricade su `demo`, che scrive in
   memoria e non sa che cosa sia la rete). Qui serve il contrario: l'app deve
   andare in `live`, cioè passare dallo SDK e da `addDoc`. */
const MODULI = {
  'firebase-app.js': `
    let unica = null;
    export function initializeApp(cfg) { unica = unica || { name: '[finto]', options: cfg || {} }; return unica; }
    export function getApps() { return unica ? [unica] : []; }
    export function getApp() { return unica; }
  `,
  'firebase-auth.js': `
    const UTENTE = {
      uid: 'u-prova', isAnonymous: false, emailVerified: true, email: 'prova@esempio.it',
      getIdTokenResult: async () => ({ claims: { orgs: { org_prova: 'admin' } } }),
    };
    export function getAuth() { return { currentUser: UTENTE }; }
    export function onAuthStateChanged(a, cb) { setTimeout(() => cb(UTENTE), 0); return () => {}; }
    export function connectAuthEmulator() {}
    export class GoogleAuthProvider {}
    export async function signInWithPopup() { return { user: UTENTE }; }
    export async function createUserWithEmailAndPassword() { return { user: UTENTE }; }
    export async function signInWithEmailAndPassword() { return { user: UTENTE }; }
    export async function signInAnonymously() { return { user: UTENTE }; }
    export async function signOut() {}
    export async function sendEmailVerification() {}
    export async function sendPasswordResetEmail() {}
  `,
  'firebase-functions.js': `
    export function getFunctions() { return { tipo: 'finto' }; }
    export function httpsCallable() { return async () => ({ data: {} }); }
    export function connectFunctionsEmulator() {}
  `,
  'firebase-firestore.js': `
    const nulla = () => {};
    const MEZZI = [
      { id: 'm1', nome: 'Escavatore E1 — CAT 352', ore: 5870, area: 'fronte Est', stato: 'operativo', tipo: 'escavatore' },
      { id: 'm2', nome: 'Dumper D1 — CAT 745', ore: 8420, area: '', stato: 'operativo', tipo: 'dumper' },
    ];
    const DATI = { mezzi: MEZZI };
    window.__scritture = [];
    export function getFirestore() { return { tipo: 'finto' }; }
    export function initializeFirestore() { return { tipo: 'finto' }; }
    export function collection(db, ...p) { return { via: p.join('/'), nome: p[p.length - 1] }; }
    export function doc(rifOdb, ...p) {
      const base = rifOdb && rifOdb.via ? rifOdb.via : '';
      return { via: [base].concat(p).filter(Boolean).join('/'), id: p[p.length - 1] || 'x' };
    }
    export function query(r) { return r; }
    export function where() { return {}; }
    export function connectFirestoreEmulator() {}
    export async function getDocs(rif) {
      const righe = DATI[(rif && rif.nome) || ''] || [];
      const docs = righe.map((d) => ({ id: d.id, data: () => d }));
      return { empty: !docs.length, size: docs.length, docs, forEach: (f) => docs.forEach(f) };
    }
    export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }
    /* ⛔ LA REGOLA MISURATA: senza rete una scrittura Firestore non risolve e
       non rifiuta. Qui è riprodotta tale e quale — è l'unica cosa che questo
       finto pretende di sapere fare. */
    const scrivi = (che, rif, dati) => {
      window.__scritture.push({ che, via: (rif && rif.via) || '', dati });
      if (window.__modoScrittura === 'rifiuta') {
        const e = new Error('Missing or insufficient permissions.');
        e.code = 'permission-denied';
        return Promise.reject(e);
      }
      if (!navigator.onLine) return new Promise(() => {});   // pendente per sempre
      return Promise.resolve({ id: 'nuovo-' + window.__scritture.length });
    };
    export function addDoc(rif, dati) { return scrivi('addDoc', rif, dati); }
    export function setDoc(rif, dati) { return scrivi('setDoc', rif, dati); }
    export function updateDoc(rif, dati) { return scrivi('updateDoc', rif, dati); }
    export function deleteDoc(rif) { return scrivi('deleteDoc', rif, null); }
    export function onSnapshot(rif, next) { setTimeout(() => { try { next({ empty: true, size: 0, docs: [], forEach: nulla }); } catch (e) {} }, 0); return nulla; }
    export function writeBatch() { const b = { set: () => b, update: () => b, delete: () => b, commit: async () => {} }; return b; }
  `,
  'firebase-storage.js': `
    export function getStorage() { return { tipo: 'finto' }; }
    export function ref(s, via) { return { via: via || '' }; }
    export async function uploadBytes() { return { ref: {} }; }
    export async function uploadString() { return { ref: {} }; }
    export async function getDownloadURL() { return 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; }
    export async function deleteObject() {}
  `,
};

/* Le due iniezioni che rimettono il difetto. Restano nel CORPO SERVITO: il file
   su disco non si tocca mai. Ognuna dichiara quanti caratteri ha cambiato — una
   sostituzione che non trova niente finisce in silenzio e lascia un banco che
   «non distingue» per il motivo sbagliato. */
const INIEZIONI = [
  ['la difesa: `salva` aspetta e basta, come prima',
   'const salva = (azione, cosa, poi) => scriviConEsito(azione, {',
   'const salva = async (azione) => { await azione(); return { ok: true, messaggio: "" }; };\n  const salvaVecchio = (azione, cosa, poi) => scriviConEsito(azione, {'],
  ['il bottone che si spegne mentre la scrittura è per aria',
   'const occupato = (id, on, testo) => {',
   'const occupato = () => {};\n  const occupatoVecchio = (id, on, testo) => {'],
];

function senzaGuardia(corpo) {
  let fatto = 0, caratteri = 0;
  for (const [nome, cerca, metti] of INIEZIONI) {
    const quante = corpo.split(cerca).length - 1;
    if (quante !== 1) {
      console.error(`✗ iniezione «${nome}»: il testo da sostituire compare ${quante} volte, non 1.`);
      process.exit(2);
    }
    const prima = corpo.length;
    corpo = corpo.replace(cerca, metti);
    caratteri += corpo.length - prima;
    fatto++;
  }
  console.log(`  (controprova: ${fatto} iniezioni, ${caratteri >= 0 ? '+' : ''}${caratteri} caratteri nel corpo servito)`);
  return corpo;
}

async function apriFlotta(browser) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 950 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  await p.route('https://www.gstatic.com/firebasejs/**', async (r) => {
    const nome = r.request().url().split('/').pop();
    await r.fulfill({ status: 200, contentType: 'text/javascript', body: MODULI[nome] || 'export default {};' });
  });
  await p.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.route('https://fonts.gstatic.com/**', (r) => r.fulfill({ status: 200, contentType: 'font/woff2', body: '' }));
  if (SENZA) {
    await p.route('**' + VIA, async (r) => {
      const res = await r.fetch();
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: senzaGuardia(await res.text()) });
    });
  }
  await p.goto(`http://127.0.0.1:${PORTA}${VIA}`);
  await p.waitForFunction(() => !!document.querySelector('#mode-note') && document.querySelector('#mode-note').textContent.length > 0,
    null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(600);
  return { ctx, p, errori };
}

/* ── le asserzioni ─────────────────────────────────────────────────────── */
let ok = 0, ko = 0, scenari = 0, asserzioni = 0;
const dice = (cond, testo) => {
  asserzioni++;
  if (cond) { ok++; console.log(`     ok  ${testo}`); }
  else { ko++; console.log(`     KO  ${testo}`); }
};
/* aspetta che una nota d'esito si riempia, e RESTITUISCE quanto ha aspettato:
   il numero serve, perché «è comparso subito» e «è comparso dopo dodici
   secondi» sono due prodotti diversi. */
async function attendiTesto(p, sel, maxMs) {
  const t0 = Date.now();
  try {
    await p.waitForFunction((s) => {
      const el = document.querySelector(s);
      return !!el && el.textContent.trim().length > 0;
    }, sel, { timeout: maxMs, polling: 200 });
  } catch (e) { /* scaduto: il testo non è mai comparso */ }
  const testo = await p.$eval(sel, (el) => el.textContent.trim()).catch(() => '');
  return { ms: Date.now() - t0, testo };
}

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });

for (const modo of ['rete-tolta', 'server-che-rifiuta']) {
  // ── 1. IL GIRO MACCHINA ───────────────────────────────────────────────
  {
    scenari++;
    console.log(`\n  ▸ giro macchina · ${modo}`);
    const { ctx, p, errori } = await apriFlotta(browser);
    const modoNota = await p.$eval('#mode-note', (e) => e.textContent.trim()).catch(() => '');
    dice(!/esempio|dimostr/i.test(modoNota) && modoNota.length > 0,
      `l'app è in modo REALE (passa da addDoc), non in dimostrazione — nota: «${modoNota.slice(0, 60)}»`);
    await p.click('#nav-giro');
    await p.waitForTimeout(500);
    const mezzi = await p.$$('[data-giro-mezzo]');
    dice(mezzi.length > 0, `la schermata del giro elenca ${mezzi.length} macchine`);
    if (!mezzi.length) { await ctx.close(); continue; }
    await mezzi[0].click();
    await p.waitForTimeout(400);
    await p.click('#btn-giro-tutto');                       // tutte le voci «a posto»
    await p.fill('#giro-operatore', 'Mario della cava');
    const voci = await p.$$eval('[data-chk]', (b) => b.length);
    dice(voci > 0, `${voci / 2} voci di controllo compilate`);
    if (modo === 'rete-tolta') await ctx.setOffline(true);
    else await p.evaluate(() => { window.__modoScrittura = 'rifiuta'; });
    await p.click('#btn-giro-salva');
    // mentre la scrittura è per aria: il bottone dev'essere spento e dirlo.
    // Otto secondi di apparente immobilità invitano al secondo tocco, e due
    // tocchi sul giro macchina sono due giri nel registro.
    await p.waitForTimeout(400);
    const durante = await p.evaluate(() => {
      const b = document.getElementById('btn-giro-salva');
      return { spento: !!b && b.disabled, testo: b ? b.textContent.trim() : '' };
    });
    // solo dove la scrittura resta appesa: quando il server rifiuta subito
    // (10 ms misurati) a 400 ms il bottone è già tornato toccabile, ed è
    // giusto così — asserirlo lì misurerebbe la velocità del finto.
    if (modo === 'rete-tolta') dice(durante.spento, `mentre salva il bottone è spento (dice «${durante.testo}»)`);
    else console.log(`     · (rifiuto immediato: a 400 ms il bottone è già ${durante.spento ? 'ancora spento' : 'tornato toccabile'})`);
    const r = await attendiTesto(p, '#giro-esito', 14000);
    const scritture = await p.evaluate(() => (window.__scritture || []).length);
    console.log(`     · risposta dopo ${r.ms} ms · scritture tentate: ${scritture}`);
    console.log(`     · testo: «${r.testo}»`);
    dice(r.testo.length > 0, "l'app dice qualcosa: il salvataggio non sparisce in silenzio");
    dice(/salvato niente/i.test(r.testo), 'e dice esplicitamente che non è stato salvato niente');
    dice(!/Giro salvato/i.test(r.testo), 'non compare mai la parola tranquilla «Giro salvato»');
    dice(!/firestore|firebase|FirebaseError|Missing or insufficient/i.test(r.testo),
      'il messaggio è del prodotto, non di Firebase');
    const restaSuGiro = await p.evaluate(() => {
      // `giro-passo2` è la checklist compilata: se il salvataggio non è
      // riuscito e la pagina torna al passo 1 («su quale mezzo?»), il lavoro
      // fatto sparisce dallo schermo come se fosse stato messo via.
      const s = document.getElementById('giro-passo2');
      const op = document.getElementById('giro-operatore');
      return { visibile: !!s && getComputedStyle(s).display !== 'none', operatore: op ? op.value : null,
               spuntate: document.querySelectorAll('[data-chk].on, [data-chk][aria-pressed="true"]').length };
    });
    dice(restaSuGiro.visibile, 'la checklist compilata resta a schermo (non si torna al passo «su quale mezzo?»)');
    dice(!(await p.$eval('#btn-giro-salva', (b) => b.disabled)), 'e a risposta data il bottone torna toccabile');
    // la riga lunga dev'essere SOTTO GLI OCCHI: il toast sparisce da solo, la
    // riga resta — ma sullo scatto del 01/08 stava fuori schermo, cioè non
    // l'avrebbe letta nessuno.
    await p.waitForTimeout(900);
    const dentro = await p.evaluate(() => {
      const r = document.getElementById('giro-esito').getBoundingClientRect();
      return { su: Math.round(r.top), giu: Math.round(r.bottom), h: window.innerHeight };
    });
    dice(dentro.su >= 0 && dentro.giu <= dentro.h,
      `la riga con la spiegazione è nello schermo (${dentro.su}–${dentro.giu} su ${dentro.h} px)`);
    dice(restaSuGiro.operatore === 'Mario della cava' && restaSuGiro.spuntate > 0,
      `quello che era stato compilato è ancora lì: operatore «${restaSuGiro.operatore}», ${restaSuGiro.spuntate} risposte`);
    dice(errori.length === 0, `nessun errore di pagina (${errori.length})${errori.length ? ' → ' + errori[0] : ''}`);
    await p.screenshot({ path: `/tmp/flotta-giro-${modo}.png` }).catch(() => {});
    await ctx.close();

  }

  // ── 2. LA SEGNALAZIONE DI GUASTO ──────────────────────────────────────
  {
    scenari++;
    console.log(`\n  ▸ segnalazione guasto · ${modo}`);
    const { ctx, p, errori } = await apriFlotta(browser);
    await p.click('#nav-mez');
    await p.waitForTimeout(500);
    const tri = await p.$$('[data-guasto-mezzo]');
    dice(tri.length > 0, `la schermata dei mezzi ha ${tri.length} comandi «segnala un guasto»`);
    if (!tri.length) { await ctx.close(); continue; }
    await tri[0].click();
    await p.waitForTimeout(400);
    await p.fill('#gua-desc', 'Perde olio dal braccio');
    await p.click('#gua-gravita button');                    // il primo gradino di gravità
    if (modo === 'rete-tolta') await ctx.setOffline(true);
    else await p.evaluate(() => { window.__modoScrittura = 'rifiuta'; });
    await p.click('#modal-foot .mbtn.primary');
    const r = await attendiTesto(p, '#gua-esito', 14000);
    console.log(`     · risposta dopo ${r.ms} ms`);
    console.log(`     · testo: «${r.testo}»`);
    dice(r.testo.length > 0, "l'app dice qualcosa invece di restare muta");
    dice(/salvato niente/i.test(r.testo), 'e dice esplicitamente che non è stato salvato niente');
    dice(!/firestore|firebase|FirebaseError|Missing or insufficient/i.test(r.testo),
      'il messaggio è del prodotto, non di Firebase');
    const stato = await p.evaluate(() => ({
      aperta: !!document.querySelector('#modal.show'),
      desc: (document.getElementById('gua-desc') || {}).value || null,
    }));
    dice(stato.aperta, 'la finestra resta aperta: nessuno può credere di avere segnalato');
    dice(stato.desc === 'Perde olio dal braccio', `il testo scritto è ancora dentro («${stato.desc}»)`);
    await p.waitForTimeout(900);
    const dentroG = await p.evaluate(() => {
      const r = document.getElementById('gua-esito').getBoundingClientRect();
      return { su: Math.round(r.top), giu: Math.round(r.bottom), h: window.innerHeight };
    });
    dice(dentroG.su >= 0 && dentroG.giu <= dentroG.h,
      `la riga con la spiegazione è nello schermo (${dentroG.su}–${dentroG.giu} su ${dentroG.h} px)`);
    dice(errori.length === 0, `nessun errore di pagina (${errori.length})${errori.length ? ' → ' + errori[0] : ''}`);
    await p.screenshot({ path: `/tmp/flotta-guasto-${modo}.png` }).catch(() => {});
    await ctx.close();
  }
}

await browser.close();
console.log(`\n${scenari} scenari · ${asserzioni} asserzioni · ${ok} a posto, ${ko} cadute`);

if (SENZA) {
  /* La controprova deve far cadere le asserzioni sul MESSAGGIO in tutti e
     quattro gli scenari: senza guardia la pagina non dice niente. */
  if (ko >= 8) {
    console.log(`La controprova ha fatto cadere ${ko} asserzioni su ${asserzioni}: il banco sa fallire.`);
    process.exit(0);
  }
  console.log(`\n⚠️ CONTROPROVA INERTE: solo ${ko} asserzioni cadute. Il banco non sta misurando la difesa.`);
  process.exit(1);
}
process.exit(ko > 0 ? 1 : 0);
