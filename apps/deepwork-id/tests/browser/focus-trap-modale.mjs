/* LA MODALE NON INTRAPPOLAVA IL FOCUS: TAB USCIVA SUL FONDO, NIENTE `inert`
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node focus-trap-modale.mjs [--porta=8977]
     node focus-trap-modale.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su shared/dw-app-ui.js (18/09):
   `dwUiAggancia()` gestiva `Escape` ma non `Tab`, e il contenuto dietro la
   modale non riceveva `inert` né `aria-hidden`, nonostante tutte le 8
   pagine dichiarino `aria-modal="true"`. Con la tastiera, Tab dall'ultimo
   bottone della modale usciva sulla barra di navigazione DIETRO — che
   restava cliccabile e leggibile dagli screen reader — invece di tornare al
   primo campo. Corretto in due posti perché sono due implementazioni
   diverse e non condivise (CLAUDE.md, «una regola scritta due volte»):
   `intrappolaSfondo`/`dwUiAggancia` in shared/dw-app-ui.js (7 delle 8
   superfici: le 6 app + admin.html) e `intrappolaSfondoModal` in
   index.html (il core, che NON consuma il file condiviso — è l'originale
   da cui le app copiano, non un suo cliente).

   Misura qui, su due superfici indipendenti (Conti per lo shared, il core
   per la sua copia): il fondo diventa `inert` mentre la modale è aperta,
   Tab non esce mai dalla modale, l'ultimo elemento richiude il giro sul
   primo e viceversa con Shift+Tab, `inert` torna `false` alla chiusura. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8977;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola. Se un'ancora non si trova più
   (perché il codice è cambiato per un'altra ragione) l'iniezione non tocca
   niente, e lo si dichiara sotto invece di dare un falso «so fallire». */
const DIFETTI_SHARED = [
  [`    intrappolaSfondo(true);\n`, ``],
  [`    intrappolaSfondo(false);   // prima di rimettere il fuoco: un elemento inert non lo riceve\n`, ``],
];
const DIFETTI_CORE = [
  [`  intrappolaSfondoModal(true);\n`, ``],
  [`intrappolaSfondoModal(false); }`, `}`],
];
/* per file (non per richiesta: la stessa pagina puo' essere servita piu'
   volte in un giro) — si conta QUALI guardie sono state trovate almeno una
   volta, non quante richieste le hanno colpite */
const colpitiShared = new Set(), colpitiCore = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("shared/dw-app-ui.js")) {
    let t = corpo.toString("utf8");
    DIFETTI_SHARED.forEach(([a, b], i) => { if (t.includes(a)) { t = t.replace(a, b); colpitiShared.add(i); } });
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("/index.html") && !p.includes("/apps/")) {
    let t = corpo.toString("utf8");
    DIFETTI_CORE.forEach(([a, b], i) => { if (t.includes(a)) { t = t.replace(a, b); colpitiCore.add(i); } });
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

console.log(`\n════════ La modale intrappola Tab e mette inert il fondo${CONTROPROVA ? " · controprova" : ""} ════════`);

/* ── SUPERFICIE 1: CONTI, cioè shared/dw-app-ui.js (7 delle 8 pagine) ── */
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1200);

  // un campo di testo + due bottoni (Annulla, Salva): nessun campo data in
  // mezzo, quindi il conto "N tab = N fermate" torna esatto
  await pg.evaluate(() => { window.__esitoChiediValore = window.chiediValore('Prova', '<p>banco</p>', '<input id="modal-campo" class="dw-input">', 'Salva'); });
  await pg.waitForTimeout(400);

  const aperta = await pg.evaluate(() => document.getElementById('modal')?.classList.contains('show'));
  dice(aperta, 'Conti: la modale si apre');

  const inertStato = await pg.evaluate(() => [...document.body.children].map((f) => ({ id: f.id || f.tagName, inert: f.inert })));
  dice(inertStato.every((f) => (f.id === 'modal' ? f.inert === false : f.inert === true)),
    'Conti: tutti i fratelli della modale sono inert, la modale no', JSON.stringify(inertStato));

  const focusabili = await pg.evaluate(() => [...document.getElementById('modal').querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
    .filter((el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null).map((el) => el.id || el.textContent.trim()));
  dice(focusabili.length === 3, 'Conti: la modale ha i 3 elementi previsti (campo, Annulla, Salva)', JSON.stringify(focusabili));

  await pg.evaluate(() => document.getElementById('modal-campo')?.focus());
  const passo = [];
  for (let i = 0; i < focusabili.length; i++) {
    await pg.keyboard.press('Tab');
    passo.push(await pg.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim()));
  }
  dice(passo[passo.length - 1] === focusabili[0], 'Conti: dopo N Tab dal primo elemento si torna al primo (giro chiuso)', JSON.stringify(passo));

  await pg.evaluate(() => document.getElementById('modal-campo')?.focus());
  await pg.keyboard.press('Shift+Tab');
  const dopoShiftTab = await pg.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim());
  dice(dopoShiftTab === focusabili[focusabili.length - 1], 'Conti: Shift+Tab dal primo elemento va all\'ultimo', dopoShiftTab);

  await pg.evaluate(() => { const bs = [...document.querySelectorAll('#modal-foot .mbtn')]; const a = bs.find((x) => /annulla/i.test(x.textContent)); if (a) a.click(); });
  await pg.waitForTimeout(300);
  const inertDopo = await pg.evaluate(() => [...document.body.children].map((f) => f.inert));
  dice(inertDopo.every((v) => v === false), 'Conti: chiusa la modale, nessun fratello resta inert', JSON.stringify(inertDopo));
  dice(errori.length === 0, 'Conti: nessun errore di pagina', errori.join(' · '));
  await pg.close();
}

/* ── SUPERFICIE 2: IL CORE, con la sua propria intrappolaSfondoModal ── */
{
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.route('https://www.gstatic.com/firebasejs/**', async (r) => {
    const nome = r.request().url().split('/').pop();
    if (nome === 'firebase-app.js') return r.fulfill({ status: 200, contentType: 'text/javascript', body: `export function initializeApp(cfg){ return { name:'[finto]', options: cfg||{} }; }` });
    if (nome === 'firebase-firestore.js') return r.fulfill({ status: 200, contentType: 'text/javascript', body: `
      const nulla=()=>{};
      export function getFirestore(){ return {tipo:'finto'}; }
      export function initializeFirestore(){ return {tipo:'finto'}; }
      export function persistentLocalCache(){ return {}; }
      export function persistentMultipleTabManager(){ return {}; }
      export async function enableIndexedDbPersistence(){}
      export function collection(db,...p){ return {via:p.join('/')}; }
      export function doc(db,...p){ return {via:p.join('/'),id:p[p.length-1]||'x'}; }
      export async function setDoc(){}
      export async function updateDoc(){}
      export async function deleteDoc(){}
      export async function addDoc(){ return {id:'finto'}; }
      export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }
      export async function getDocs(){ return {empty:true,size:0,docs:[],forEach:nulla}; }
      export function onSnapshot(rif,next){ const vuoto={empty:true,size:0,docs:[],forEach:nulla,exists:()=>false,data:()=>null}; setTimeout(()=>{try{(typeof next==='function'?next:nulla)(vuoto);}catch(e){}},0); return nulla; }
      export function writeBatch(){ const b={set:()=>b,update:()=>b,delete:()=>b,commit:async()=>{}}; return b; }
    ` });
    if (nome === 'firebase-storage.js') return r.fulfill({ status: 200, contentType: 'text/javascript', body: `export function getStorage(){return{tipo:'finto'};}export function ref(s,via){return{via:via||''};}export async function uploadBytes(){return{ref:{}};}export async function uploadString(){return{ref:{}};}export async function getDownloadURL(){return 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';}export async function deleteObject(){}` });
    if (nome === 'firebase-messaging.js') return r.fulfill({ status: 200, contentType: 'text/javascript', body: `export function getMessaging(){return{tipo:'finto'};}export async function getToken(){return '';}export function onMessage(){return ()=>{};}export async function isSupported(){return false;}` });
    return r.fulfill({ status: 200, contentType: 'text/javascript', body: 'export default {};' });
  });
  await pg.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await pg.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await pg.route('https://fonts.gstatic.com/**', (r) => r.fulfill({ status: 200, contentType: 'font/woff2', body: '' }));

  await pg.goto(`http://127.0.0.1:${porta}/index.html`, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof window.doLogin === 'function', { timeout: 15000 });
  await pg.fill('#lu', 'admin');
  await pg.fill('#lp', 'admin');
  await pg.click('#btn-login');
  await pg.waitForFunction(() => { const h = document.getElementById('screen-home'); return h && getComputedStyle(h).display !== 'none'; }, { timeout: 10000 });

  // "Conferma uscita": due bottoni, nessun campo data — il conto esatto
  await pg.evaluate(() => window.confirmLogout());
  await pg.waitForTimeout(300);
  dice(await pg.evaluate(() => document.getElementById('modal')?.classList.contains('show')), 'Core: la modale "Conferma uscita" si apre');

  const inertStato = await pg.evaluate(() => [...document.body.children].map((f) => ({ id: f.id || f.tagName, inert: f.inert })));
  dice(inertStato.every((f) => (f.id === 'modal' ? f.inert === false : f.inert === true)),
    'Core: tutti i fratelli della modale sono inert, la modale no', JSON.stringify(inertStato));

  const focusabili = await pg.evaluate(() => [...document.getElementById('modal').querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
    .filter((el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null).map((el) => el.id || el.textContent.trim()));
  dice(focusabili.length === 2, 'Core: "Conferma uscita" ha i 2 bottoni previsti (Annulla, ESCI)', JSON.stringify(focusabili));

  await pg.evaluate(() => { const lista = [...document.getElementById('modal').querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter((el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null); if (lista[0]) lista[0].focus(); });
  const passo = [];
  for (let i = 0; i < focusabili.length; i++) {
    await pg.keyboard.press('Tab');
    passo.push(await pg.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim()));
  }
  dice(passo[passo.length - 1] === focusabili[0], 'Core: dopo N Tab dal primo elemento si torna al primo (giro chiuso)', JSON.stringify(passo));

  await pg.evaluate(() => { const lista = [...document.getElementById('modal').querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter((el) => !el.disabled && el.tabIndex >= 0 && el.offsetParent !== null); if (lista[0]) lista[0].focus(); });
  await pg.keyboard.press('Shift+Tab');
  const dopoShiftTab = await pg.evaluate(() => document.activeElement.id || document.activeElement.textContent.trim());
  dice(dopoShiftTab === focusabili[focusabili.length - 1], 'Core: Shift+Tab dal primo elemento va all\'ultimo', dopoShiftTab);

  // "Nuovo Promemoria" ha un campo `type="date"` in mezzo: i suoi segmenti
  // interni consumano Tab senza cambiare `document.activeElement` (vedi
  // commento in cima), quindi qui si pretende solo che 12 Tab di fila non
  // facciano MAI uscire il fuoco dalla modale — non un conto esatto.
  await pg.evaluate(() => window.closeModal());
  await pg.waitForTimeout(200);
  await pg.evaluate(() => window.openPromemoriaForm());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => document.getElementById('rm-t')?.focus());
  const dentro = [];
  for (let i = 0; i < 12; i++) {
    await pg.keyboard.press('Tab');
    dentro.push(await pg.evaluate(() => document.getElementById('modal').contains(document.activeElement)));
  }
  dice(dentro.every(Boolean), 'Core: 12 Tab di fila non escono mai dalla modale (col campo data in mezzo)', JSON.stringify(dentro));

  await pg.evaluate(() => window.closeModal());
  await pg.waitForTimeout(200);
  const inertDopo = await pg.evaluate(() => [...document.body.children].map((f) => f.inert));
  dice(inertDopo.every((v) => v === false), 'Core: chiusa la modale, nessun fratello resta inert', JSON.stringify(inertDopo));
  dice(errori.length === 0, 'Core: nessun errore di pagina', errori.join(' · '));
  await pg.close();
}

if (CONTROPROVA) {
  dice(colpitiShared.size === DIFETTI_SHARED.length, `CONTROPROVA: guardie shared trovate e tolte (${colpitiShared.size}/${DIFETTI_SHARED.length})`);
  dice(colpitiCore.size === DIFETTI_CORE.length, `CONTROPROVA: guardie core trovate e tolte (${colpitiCore.size}/${DIFETTI_CORE.length})`);
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\nCONTROPROVA — difetto rimesso: ${ko} cadute su ${ok + ko}, ${ok} rimaste in piedi.`);
  console.log(ko > 0 ? 'controprova: il banco SA fallire' : 'controprova: NON distingue');
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato trappola del focus: ${ok} passati, ${ko} falliti`);
process.exit(ko > 0 ? 1 : 0);
