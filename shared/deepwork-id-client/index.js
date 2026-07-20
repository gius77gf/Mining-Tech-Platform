// ============================================================
// Deepwork ID — SDK client condiviso (scheletro v0.1)
// Unico punto di accesso all'identità per TUTTE le app
// dell'ecosistema: nessuna app reimplementa login/autorizzazioni.
// Architettura: apps/deepwork-id/ARCHITETTURA.md
//
// Uso tipico in un'app:
//   import { DeepworkID } from '../../shared/deepwork-id-client/index.js';
//   const id = await DeepworkID.init({ appId: 'scudo' });
//   if (!id.user) id.loginWithGoogle();          // o loginTour()
//   if (!id.hasEntitlement()) id.showLocked();   // app non pagata
//   const db = id.orgCollection('turni');        // già sigillata sull'org
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInAnonymously, signOut,
  sendEmailVerification, sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, collection,
  query, where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getFunctions, httpsCallable,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-functions.js";

// Config del progetto Firebase NUOVO dedicato all'ecosistema
// (decisione fondatore 2026-07-19). Placeholder finché il progetto
// non viene creato su console (procedura weekend, vedi GUIDA_FIREBASE.md).
// Con l'emulatore locale questi valori non servono reali.
const FIREBASE_CONFIG = {
  apiKey: "PLACEHOLDER_IN_ATTESA_DEL_PROGETTO",
  authDomain: "PLACEHOLDER.firebaseapp.com",
  projectId: "PLACEHOLDER",
};

const DEMO_ORG_ID = "org_demo";

class DeepworkIDClient {
  constructor(appId) {
    this.appId = appId;        // es. 'deepwork' | 'genesi' | 'scudo' ...
    this.user = null;          // utente Firebase autenticato (o null)
    this.orgId = null;         // organizzazione attiva
    this.orgs = {};            // mappa {orgId: role} dai custom claims
    this.entitlement = null;   // entitlement dell'app corrente nell'org attiva
    this._app = null;
    this._auth = null;
    this._db = null;
    this._fns = null;
  }

  // ---------- inizializzazione ----------
  async _setup() {
    this._app = initializeApp(FIREBASE_CONFIG);
    this._auth = getAuth(this._app);
    this._db = getFirestore(this._app);
    // stessa regione delle Cloud Functions (europe-west1, dati EU)
    this._fns = getFunctions(this._app, "europe-west1");

    // attende il primo stato di autenticazione noto
    await new Promise((resolve) => {
      const off = onAuthStateChanged(this._auth, async (user) => {
        off();
        this.user = user || null;
        if (user) await this._loadClaimsAndOrg();
        resolve();
      });
    });
    return this;
  }

  async _loadClaimsAndOrg() {
    const token = await this.user.getIdTokenResult();
    this.orgs = token.claims.orgs || {};
    const orgIds = Object.keys(this.orgs);
    // org attiva: la preferita dell'utente se ancora valida, altrimenti la prima
    let preferred = null;
    if (!this.user.isAnonymous && orgIds.length > 1) {
      const prof = await getDoc(doc(this._db, "users", this.user.uid)).catch(() => null);
      const d = prof && prof.exists() ? prof.data() : null;
      if (d && d.defaultOrgId && this.orgs[d.defaultOrgId]) preferred = d.defaultOrgId;
    }
    this.orgId = preferred || orgIds[0] || (this.user.isAnonymous ? DEMO_ORG_ID : null);
    if (this.orgId) await this._loadEntitlement();
  }

  async _loadEntitlement() {
    const snap = await getDoc(
      doc(this._db, "organizations", this.orgId, "entitlements", this.appId)
    );
    this.entitlement = snap.exists() ? snap.data() : null;
  }

  // ---------- login ----------
  async loginWithGoogle() {
    await signInWithPopup(this._auth, new GoogleAuthProvider());
    // NOTA privacy (decisione fondatore): il profilo mostrato nelle app
    // è NEUTRO/aziendale — displayName e foto Google NON vengono
    // propagati nelle interfacce.
    this.user = this._auth.currentUser;
    await this._loadClaimsAndOrg();
    return this.authState();
  }

  async registerWithEmail(email, password) {
    await createUserWithEmailAndPassword(this._auth, email, password);
    this.user = this._auth.currentUser;
    // email di verifica subito dopo la registrazione (best-effort:
    // se l'invio fallisce la registrazione resta valida)
    await sendEmailVerification(this.user).catch(() => {});
    await this._loadClaimsAndOrg();
    return this.authState();
  }

  // ---------- verifica email e recupero password ----------
  emailVerified() {
    return !!(this.user && !this.user.isAnonymous && this.user.emailVerified);
  }

  async resendVerification() {
    if (!this.user || this.user.isAnonymous) throw new Error("Nessun account connesso");
    await sendEmailVerification(this.user);
  }

  // funziona anche da NON autenticati: serve solo l'email del profilo
  async requestPasswordReset(email) {
    await sendPasswordResetEmail(this._auth, email);
  }

  async loginWithEmail(email, password) {
    await signInWithEmailAndPassword(this._auth, email, password);
    this.user = this._auth.currentUser;
    await this._loadClaimsAndOrg();
    return this.authState();
  }

  // Modalità tour: accesso anonimo al tenant demo, sola lettura
  async loginTour() {
    await signInAnonymously(this._auth);
    this.user = this._auth.currentUser;
    this.orgId = DEMO_ORG_ID;
    await this._loadEntitlement();
    return this.authState();
  }

  async logout() {
    await signOut(this._auth);
    this.user = null; this.orgId = null; this.orgs = {}; this.entitlement = null;
  }

  // ---------- stato e autorizzazioni ----------
  authState() {
    if (!this.user) return "anonymous";           // nessun login
    if (this.user.isAnonymous) return "tour";     // modalità tour
    if (!this.orgId) return "unauthorized";       // account senza org
    return "member";
  }

  role() {
    return this.orgId ? this.orgs[this.orgId] || null : null;
  }

  // tutti gli entitlement dell'org attiva ({appId: dati}) — usato dal
  // profilo per la griglia delle app incluse nell'abbonamento
  async listEntitlements() {
    if (!this.orgId) return {};
    const snap = await getDocs(
      collection(this._db, "organizations", this.orgId, "entitlements")
    );
    const out = {};
    snap.docs.forEach((d) => { out[d.id] = d.data(); });
    return out;
  }

  hasEntitlement(tier = null) {
    if (!this.entitlement || !this.entitlement.active) return false;
    if (this.entitlement.validUntil &&
        this.entitlement.validUntil.toDate() < new Date()) return false;
    if (tier && this.entitlement.tier !== tier) return false;
    return true;
  }

  // ---------- accesso dati sigillato sull'org ----------
  // Le app NON costruiscono mai percorsi Firestore a mano: passano da
  // qui, così è impossibile scrivere per errore fuori dalla propria org.
  orgCollection(name) {
    if (!this.orgId) throw new Error("Nessuna organizzazione attiva");
    return collection(
      this._db, "organizations", this.orgId, "apps", this.appId, name
    );
  }

  // ---------- operazioni server (Cloud Functions) ----------
  // Passano SEMPRE dal backend: il client non può scrivere claims,
  // membership o organizzazioni direttamente (le rules lo vietano).

  async createOrganization(name) {
    const call = httpsCallable(this._fns, "createOrganization");
    const res = await call({ name });
    await this.user.getIdToken(true);      // forza refresh del token → nuovi claims
    await this._loadClaimsAndOrg();
    return res.data.orgId;
  }

  async inviteMember(email, role = "member") {
    if (!this.orgId) throw new Error("Nessuna organizzazione attiva");
    const call = httpsCallable(this._fns, "inviteMember");
    const res = await call({ orgId: this.orgId, email, role });
    return res.data.inviteId;
  }

  // ---------- amministrazione organizzazione (D4) ----------
  // Letture dirette (le rules le consentono ai membri/admin);
  // le MODIFICHE passano sempre dalle Cloud Functions coi guardrail.

  async listMembers() {
    if (!this.orgId) throw new Error("Nessuna organizzazione attiva");
    const snap = await getDocs(
      collection(this._db, "organizations", this.orgId, "members")
    );
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  }

  async listPendingInvites() {
    if (!this.orgId) throw new Error("Nessuna organizzazione attiva");
    const snap = await getDocs(query(
      collection(this._db, "invites"),
      where("orgId", "==", this.orgId),
      where("status", "==", "pending")
    ));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async updateMemberRole(uid, role) {
    const call = httpsCallable(this._fns, "updateMemberRole");
    await call({ orgId: this.orgId, uid, role });
  }

  async removeMember(uid) {
    const call = httpsCallable(this._fns, "removeMember");
    await call({ orgId: this.orgId, uid });
  }

  async revokeInvite(inviteId) {
    const call = httpsCallable(this._fns, "revokeInvite");
    await call({ inviteId });
  }

  // Da chiamare dopo ogni login registrato: riscatta eventuali inviti
  // pendenti per l'email dell'utente e aggiorna org attiva/claims.
  async redeemInvites() {
    const call = httpsCallable(this._fns, "acceptInvites");
    const res = await call({});
    if (res.data.accepted && res.data.accepted.length) {
      await this.user.getIdToken(true);
      await this._loadClaimsAndOrg();
    }
    return res.data.accepted || [];
  }

  // ---------- multi-org (es. consulente su più aziende) ----------
  async switchOrg(orgId) {
    if (!this.orgs[orgId]) throw new Error("Non sei membro di questa organizzazione");
    this.orgId = orgId;
    await this._loadEntitlement();
    // persiste la preferenza (best-effort: se fallisce non blocca lo switch)
    await setDoc(doc(this._db, "users", this.user.uid),
      { defaultOrgId: orgId }, { merge: true }).catch(() => {});
  }
}

export const DeepworkID = {
  async init({ appId }) {
    return new DeepworkIDClient(appId)._setup();
  },
};
