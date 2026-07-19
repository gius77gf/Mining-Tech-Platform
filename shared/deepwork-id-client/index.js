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
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, collection,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
  }

  // ---------- inizializzazione ----------
  async _setup() {
    this._app = initializeApp(FIREBASE_CONFIG);
    this._auth = getAuth(this._app);
    this._db = getFirestore(this._app);

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
    // org attiva: default utente se valida, altrimenti la prima
    // TODO: leggere users/{uid}.defaultOrgId e usarla se presente in orgs
    this.orgId = orgIds[0] || (this.user.isAnonymous ? DEMO_ORG_ID : null);
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
    await this._loadClaimsAndOrg();
    return this.authState();
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

  // ---------- multi-org (es. consulente su più aziende) ----------
  async switchOrg(orgId) {
    if (!this.orgs[orgId]) throw new Error("Non sei membro di questa organizzazione");
    this.orgId = orgId;
    await this._loadEntitlement();
    // TODO: persistere come defaultOrgId in users/{uid}
  }
}

export const DeepworkID = {
  async init({ appId }) {
    return new DeepworkIDClient(appId)._setup();
  },
};
