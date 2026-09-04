/* ⚠️ NON VA IN npm test: non e' un banco, e' il finto Firebase che i banchi di
   Deepwork ID montano PRIMA di goto per raggiungere gli stati veri delle pagine. */
/* UN FINTO FIREBASE PER LE PAGINE DI DEEPWORK ID.
   `finto-firebase.mjs` serve al CORE: risponde solo per app/firestore/storage/
   messaging, e per `firebase-auth.js` e `firebase-functions.js` consegna
   `export default {}`. L'SDK di Deepwork ID importa NOMI da tutt'e due (getAuth,
   httpsCallable, query, where…): l'import fallisce al collegamento e le pagine
   scivolano nel modo «Backend non ancora configurato» — l'anteprima. È quello
   che ogni banco ha sempre misurato su queste quattro pagine.
   Qui si risponde quanto basta perché l'SDK parta e la pagina raggiunga gli
   stati che esistono per davvero: `member`, `unauthorized`, `tour`, e le
   risposte (o gli errori) delle funzioni. Lo scenario arriva da
   `window.__scenarioId`, messo con addInitScript PRIMA di goto. */

const APP = `
  export function initializeApp(cfg) { return { name: '[finto]', options: cfg || {} }; }
  export function getApps() { return []; }
  export function getApp() { return { name: '[finto]' }; }
`;

const AUTH = `
  const S = window.__scenarioId || { stato: 'anonymous' };
  window.__chiamateId = window.__chiamateId || [];
  const nota = (n, a) => window.__chiamateId.push({ n, a: a || null });
  const codice = (c) => { const e = new Error(c); e.code = c; return e; };
  const erroreDi = (n) => { const c = S.errori && S.errori[n]; if (c) throw codice(c); };
  const utente = (o) => ({
    uid: o.uid, email: o.email || null, isAnonymous: !!o.anonimo,
    emailVerified: o.emailVerified !== false, _orgs: o.orgs || {},
    async getIdTokenResult() { return { claims: { orgs: this._orgs } }; },
    async getIdToken() { return 'finto'; },
  });
  const PERSONE = {
    member: () => utente({ uid: 'u1', email: S.email || 'titolare@cava-alfa.it',
      orgs: S.orgs || { org_cava_alfa: 'owner', org_consorzio: 'member' } }),
    unauthorized: () => utente({ uid: 'u9', email: S.email || 'nuovo@esempio.it', orgs: {}, emailVerified: S.emailVerified }),
    tour: () => utente({ uid: 'anon', anonimo: true }),
  };
  const auth = { currentUser: PERSONE[S.stato] ? PERSONE[S.stato]() : null };
  window.__authFinto = auth; window.__personeFinte = PERSONE;
  export function getAuth() { return auth; }
  export function onAuthStateChanged(a, cb) { setTimeout(() => cb(auth.currentUser), 0); return () => {}; }
  export function connectAuthEmulator() {}
  export class GoogleAuthProvider {}
  export async function signInWithPopup() { nota('signInWithPopup'); erroreDi('signInWithPopup'); auth.currentUser = PERSONE[S.dopo || 'member'](); }
  /* ⚠️ i codici per i campi vuoti ('auth/invalid-email', 'auth/missing-password')
     sono quelli dell'SDK Firebase v9+ (AuthErrorCode): riprodotti, non misurati
     contro Firebase vero. Il banco che li usa lo dichiara. */
  export async function signInWithEmailAndPassword(a, email, pass) {
    nota('signInWithEmailAndPassword', [email, pass]);
    if (!email) throw codice('auth/invalid-email');
    if (!pass) throw codice('auth/missing-password');
    erroreDi('signInWithEmailAndPassword');
    auth.currentUser = PERSONE[S.dopo || 'member']();
  }
  export async function createUserWithEmailAndPassword(a, email, pass) {
    nota('createUserWithEmailAndPassword', [email, pass]);
    if (!email) throw codice('auth/invalid-email');
    if (!pass) throw codice('auth/missing-password');
    if (pass.length < 6) throw codice('auth/weak-password');
    erroreDi('createUserWithEmailAndPassword');
    auth.currentUser = PERSONE[S.dopo || 'unauthorized']();
  }
  export async function signInAnonymously() { nota('signInAnonymously'); erroreDi('signInAnonymously'); auth.currentUser = PERSONE.tour(); }
  export async function signOut() { nota('signOut'); auth.currentUser = null; }
  export async function sendEmailVerification() { nota('sendEmailVerification'); erroreDi('sendEmailVerification'); }
  export async function sendPasswordResetEmail(a, email) {
    nota('sendPasswordResetEmail', [email]);
    if (!email) throw codice('auth/invalid-email');
    erroreDi('sendPasswordResetEmail');
  }
`;

const FUNCTIONS = `
  const S = window.__scenarioId || {};
  window.__chiamateId = window.__chiamateId || [];
  const nota = (n, a) => window.__chiamateId.push({ n, a: a || null });
  const BASE = { createOrganization: { orgId: 'org_nuova' }, inviteMember: { inviteId: 'i_nuovo' },
                 acceptInvites: { accepted: [] }, updateMemberRole: {}, removeMember: {}, revokeInvite: {} };
  export function getFunctions() { return { tipo: 'finto' }; }
  export function connectFunctionsEmulator() {}
  export function httpsCallable(f, nome) {
    return async (dati) => {
      nota(nome, dati);
      const c = S.errori && S.errori[nome];
      if (c) { const e = new Error(c); e.code = 'functions/' + c; throw e; }
      const R = (S.risposte || {})[nome];
      const data = R !== undefined ? R : (BASE[nome] || {});
      const auth = window.__authFinto;
      if (auth && auth.currentUser) {
        if (nome === 'createOrganization') auth.currentUser._orgs = { ...auth.currentUser._orgs, [data.orgId]: 'owner' };
        if (nome === 'acceptInvites' && data.accepted && data.accepted.length && S.orgsDopoInvito) auth.currentUser._orgs = S.orgsDopoInvito;
      }
      return { data };
    };
  }
`;

const FIRESTORE = `
  const S = window.__scenarioId || {};
  const DATI = S.dati || {};
  window.__chiamateId = window.__chiamateId || [];
  const nota = (n, a) => window.__chiamateId.push({ n, a: a || null });
  /* le date viaggiano come {__ts: millis} e qui diventano un Timestamp finto */
  const vivo = (v) => {
    if (Array.isArray(v)) return v.map(vivo);
    if (v && typeof v === 'object') {
      if ('__ts' in v) { const ms = v.__ts; return { toDate: () => new Date(ms), toMillis: () => ms }; }
      const o = {}; for (const k of Object.keys(v)) o[k] = vivo(v[k]); return o;
    }
    return v;
  };
  const documenti = (via) => (DATI[via] || []).map((d) => {
    const { id, ...resto } = d;
    return { id, data: () => vivo(resto), exists: () => true };
  });
  export function getFirestore() { return { tipo: 'finto' }; }
  export function connectFirestoreEmulator() {}
  export function collection(db, ...p) { return { via: p.join('/') }; }
  export function doc(db, ...p) { return { via: p.join('/'), id: p[p.length - 1] }; }
  export function query(ref, ...clausole) { return { via: ref.via, clausole }; }
  export function where(campo, op, val) { return { campo, op, val }; }
  export async function getDocs(q) {
    let docs = documenti(q.via);
    for (const c of (q.clausole || [])) docs = docs.filter((d) => c.op === '==' ? d.data()[c.campo] === c.val : true);
    nota('getDocs', [q.via, docs.length]);
    return { empty: !docs.length, size: docs.length, docs, forEach: (f) => docs.forEach(f) };
  }
  export async function getDoc(ref) {
    const i = ref.via.lastIndexOf('/');
    const d = documenti(ref.via.slice(0, i)).find((x) => x.id === ref.via.slice(i + 1));
    nota('getDoc', [ref.via, !!d]);
    return d || { exists: () => false, data: () => undefined, id: ref.id };
  }
  export async function setDoc(ref, dati) { nota('setDoc', [ref.via, dati]); }
  export async function updateDoc(ref, dati) { nota('updateDoc', [ref.via, dati]); }
  export async function deleteDoc(ref) { nota('deleteDoc', [ref.via]); }
  export async function addDoc(ref, dati) { nota('addDoc', [ref.via, dati]); return { id: 'finto' }; }
`;

const MODULI = {
  'firebase-app.js': APP,
  'firebase-auth.js': AUTH,
  'firebase-functions.js': FUNCTIONS,
  'firebase-firestore.js': FIRESTORE,
};

/* Da chiamare PRIMA di goto. `scenario`: { stato: 'anonymous'|'member'|'unauthorized'|'tour',
   email, orgs, emailVerified, dopo, errori:{nomeChiamata: codice}, risposte:{nome: data},
   orgsDopoInvito, dati:{ 'collezione/…': [{id, …}] } }. Con `scenario === null` non si
   monta niente: la pagina resta senza rete, com'è per i banchi di sempre. */
export async function montaFintoId(p, scenario) {
  if (scenario) await p.addInitScript((s) => { window.__scenarioId = s; }, scenario);
  await p.route('https://www.gstatic.com/firebasejs/**', async (r) => {
    const nome = r.request().url().split('/').pop();
    const corpo = MODULI[nome];
    if (!corpo) return r.fulfill({ status: 200, contentType: 'text/javascript', body: 'export default {};' });
    await r.fulfill({ status: 200, contentType: 'text/javascript', body: corpo });
  });
  await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.route('https://fonts.gstatic.com/**', (r) => r.fulfill({ status: 200, contentType: 'font/woff2', body: '' }));
}

const g = 86400000;
export const ADESSO = Date.now();
/* i dati di un'organizzazione con i casi che il prodotto deve saper raccontare:
   un membro disabilitato, un invito che scade domani (singolare), uno già
   scaduto ma ancora «pending», uno senza data, un abbonamento scaduto e uno con
   la scadenza scritta come stringa ISO (che l'SDK normalizza) */
export const DATI_ORG = () => ({
  'organizations/org_cava_alfa/members': [
    { id: 'u1', email: 'titolare@cava-alfa.it', role: 'owner', status: 'active' },
    { id: 'u2', email: 'ufficio@cava-alfa.it', role: 'admin', status: 'active' },
    { id: 'u3', email: 'capocava@cava-alfa.it', role: 'member', status: 'active' },
    { id: 'u4', email: 'ex-collega@cava-alfa.it', role: 'member', status: 'disabled' },
  ],
  'invites': [
    { id: 'i1', email: 'nuovo@collega.it', orgId: 'org_cava_alfa', role: 'member', status: 'pending', expiresAt: { __ts: ADESSO + 11 * g } },
    { id: 'i2', email: 'domani@collega.it', orgId: 'org_cava_alfa', role: 'admin', status: 'pending', expiresAt: { __ts: ADESSO + 0.6 * g } },
    { id: 'i3', email: 'scaduto@collega.it', orgId: 'org_cava_alfa', role: 'member', status: 'pending', expiresAt: { __ts: ADESSO - 2 * g } },
    { id: 'i4', email: 'altra-org@collega.it', orgId: 'org_consorzio', role: 'member', status: 'pending', expiresAt: { __ts: ADESSO + 5 * g } },
    { id: 'i5', email: 'accettato@collega.it', orgId: 'org_cava_alfa', role: 'member', status: 'accepted', expiresAt: { __ts: ADESSO + 5 * g } },
  ],
  'organizations/org_cava_alfa/entitlements': [
    { id: 'deepwork', active: true },
    { id: 'scudo', active: true, validUntil: { __ts: ADESSO + 30 * g } },
    { id: 'campo', active: true, validUntil: { __ts: ADESSO - 1 * g } },
    { id: 'flotta', active: false },
    { id: 'deepwork-id', active: true },
  ],
});
