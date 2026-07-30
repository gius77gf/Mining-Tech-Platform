/* UN FINTO FIREBASE, per poter aprire il CORE in locale.
   Il core non si ferma al login: tutto il suo programma sta in un
   `<script type="module">` che importa Firebase da gstatic.com. Qui la rete è
   chiusa, l'import fallisce, il modulo non parte — e restano solo i «segnaposto»
   che il core installa apposta («Funzione nav non ancora pronta»). Per questo
   `nav('ufficio')` non faceva niente: non era il nav del core.

   Qui si servono quattro moduli finti al posto di quelli di Google. Non
   simulano Firebase: rispondono quanto basta perché il programma del core parta
   e le schermate si montino. Nessun dato: le liste restano vuote, ed è giusto
   così — quello che si vuole provare sono i campi, non i dati. */
export const MODULI = {
  'firebase-app.js': `
    export function initializeApp(cfg) { return { name: '[finto]', options: cfg || {} }; }
  `,
  'firebase-firestore.js': `
    const nulla = () => {};
    export function getFirestore() { return { tipo: 'finto' }; }
    export function initializeFirestore() { return { tipo: 'finto' }; }
    export function persistentLocalCache() { return {}; }
    export function persistentMultipleTabManager() { return {}; }
    export async function enableIndexedDbPersistence() {}
    export function collection(db, ...p) { return { via: p.join('/') }; }
    export function doc(db, ...p) { return { via: p.join('/'), id: p[p.length - 1] || 'x' }; }
    export async function setDoc() {}
    export async function updateDoc() {}
    export async function deleteDoc() {}
    export async function addDoc() { return { id: 'finto' }; }
    export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }
    export async function getDocs() { return { empty: true, size: 0, docs: [], forEach: nulla }; }
    export function onSnapshot(rif, next) {
      // si risponde una volta, con una raccolta vuota: il core toglie il velo di
      // caricamento quando arriva la prima risposta, non quando arriva un dato
      const vuoto = { empty: true, size: 0, docs: [], forEach: nulla,
                      exists: () => false, data: () => null };
      setTimeout(() => { try { (typeof next === 'function' ? next : nulla)(vuoto); } catch (e) {} }, 0);
      return nulla;                       // la funzione per disiscriversi
    }
    export function writeBatch() {
      const b = { set: () => b, update: () => b, delete: () => b, commit: async () => {} };
      return b;
    }
  `,
  'firebase-storage.js': `
    export function getStorage() { return { tipo: 'finto' }; }
    export function ref(s, via) { return { via: via || '' }; }
    export async function uploadBytes() { return { ref: {} }; }
    export async function uploadString() { return { ref: {} }; }
    export async function getDownloadURL() { return 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; }
    export async function deleteObject() {}
  `,
  'firebase-messaging.js': `
    export function getMessaging() { return { tipo: 'finto' }; }
    export async function getToken() { return ''; }
    export function onMessage() { return () => {}; }
    export async function isSupported() { return false; }
  `,
};

/* Aggancia i finti moduli a una pagina Playwright. Da chiamare PRIMA di goto. */
export async function montaFintoFirebase(p) {
  await p.route('https://www.gstatic.com/firebasejs/**', async (r) => {
    const nome = r.request().url().split('/').pop();
    const corpo = MODULI[nome];
    if (!corpo) return r.fulfill({ status: 200, contentType: 'text/javascript', body: 'export default {};' });
    await r.fulfill({ status: 200, contentType: 'text/javascript', body: corpo });
  });
  // le librerie di comodo (PDF, grafici) e i caratteri: non servono a questa
  // prova e senza rete fanno solo rumore in console
  await p.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.route('https://fonts.gstatic.com/**', (r) => r.fulfill({ status: 200, contentType: 'font/woff2', body: '' }));
}
