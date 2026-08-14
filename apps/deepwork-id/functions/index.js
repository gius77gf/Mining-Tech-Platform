// ============================================================
// Deepwork ID — Cloud Functions (bozza v0.1, non ancora deployata)
// Il SOLO punto del sistema autorizzato a scrivere i custom claims
// e a creare organizzazioni/membership. Il client non può mai farlo
// (le security rules lo impediscono per costruzione).
// Deploy: `firebase deploy --only functions` dal progetto nuovo
// (dopo la creazione su console — vedi GUIDA_FIREBASE.md).
// ============================================================

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { convergiClaims } = require("./claims");

admin.initializeApp();
const db = admin.firestore();

// Regione europea, coerente con la scelta dati EU del fondatore
const REGION = "europe-west1";

// ------------------------------------------------------------
// Claims: ricostruisce la mappa {orgId: role} di un utente
// leggendo TUTTE le sue membership attive, e la scrive nel token.
// ------------------------------------------------------------
async function leggiOrgsAttive(uid) {
  // Ogni documento membership porta il campo `uid` (scritto sotto):
  // la collectionGroup può così filtrare in modo esatto ed efficiente.
  const snap = await db
    .collectionGroup("members")
    .where("uid", "==", uid)
    .where("status", "==", "active")
    .get();

  const orgs = {};
  for (const doc of snap.docs) {
    const orgId = doc.ref.parent.parent.id;
    orgs[orgId] = doc.data().role || "member";
  }
  return orgs;
}

async function scriviClaims(uid, orgs) {
  try {
    await admin.auth().setCustomUserClaims(uid, { orgs });
  } catch (e) {
    // UN UTENTE CHE NON ESISTE PIÙ NON È UN GUASTO DEL SISTEMA: è un fatto.
    // Succede quando qualcuno cancella il proprio profilo e la membership resta,
    // e succede negli emulatori quando la pulizia iniziale toglie gli account
    // mentre i trigger delle cancellazioni sono ancora in volo. Finora
    // l'eccezione non gestita UCCIDEVA il trigger («Your function was killed
    // because it raised an unhandled error»): un fallimento rumoroso su un caso
    // che non richiede nessuna azione, e che portava con sé le invocazioni
    // legittime in corso.
    // Si assorbe SOLO questo codice: qualunque altro errore deve continuare a
    // far fallire il trigger, perché lì un claim non aggiornato è un problema di
    // sicurezza vero e va visto.
    if (e && e.code === "auth/user-not-found") {
      console.warn(`rebuildClaims: nessun utente Auth per ${uid}, membership orfana — niente da aggiornare`);
      return false;   // «non c'è più niente da scrivere»: ferma la convergenza
    }
    throw e;
  }
  return true;
}

/* Legge, scrive, RILEGGE: la ragione sta per esteso in `claims.js`. In due
   parole: due scritture di membership ravvicinate sullo stesso utente fanno
   partire due trigger, e quello rimasto indietro può atterrare per ultimo
   cancellando un'organizzazione dal token — con la membership che su
   Firestore dice ancora `active`. Rileggere dopo aver scritto lo rimette a
   posto da sé. */
async function rebuildClaims(uid) {
  const esito = await convergiClaims({
    leggi: () => leggiOrgsAttive(uid),
    scrivi: (orgs) => scriviClaims(uid, orgs),
  });
  if (esito.fermato === "giri-esauriti") {
    // Non è un guasto ed è raro: le membership stanno cambiando più in fretta
    // di quanto si riesca a rileggerle. Si dichiara invece di tacere, perché
    // un claim che resta indietro non ha nessun altro modo di farsi vedere.
    console.warn(`rebuildClaims: claims di ${uid} non convergiuti in ${esito.letture} letture`);
  }
  return esito.orgs;
}

// Trigger: ogni scrittura su una membership riallinea i claims.
exports.onMemberWrite = onDocumentWritten(
  { document: "organizations/{orgId}/members/{uid}", region: REGION },
  async (event) => {
    const uid = event.params.uid;
    await rebuildClaims(uid);
  }
);

// ------------------------------------------------------------
// createOrganization: crea org + primo membro owner + claims.
// Chiamabile da qualunque utente autenticato NON anonimo.
// ------------------------------------------------------------
exports.createOrganization = onCall({ region: REGION }, async (request) => {
  const auth = request.auth;
  if (!auth || auth.token.firebase.sign_in_provider === "anonymous") {
    throw new HttpsError("unauthenticated", "Serve un profilo registrato.");
  }
  const name = String(request.data && request.data.name || "").trim();
  if (name.length < 2 || name.length > 80) {
    throw new HttpsError("invalid-argument", "Nome organizzazione non valido.");
  }

  const orgRef = db.collection("organizations").doc();
  await db.runTransaction(async (tx) => {
    tx.set(orgRef, {
      name,
      status: "active",
      ownerUid: auth.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.set(orgRef.collection("members").doc(auth.uid), {
      uid: auth.uid,
      role: "owner",
      status: "active",
      joinedAt: FieldValue.serverTimestamp(),
    });
  });
  await rebuildClaims(auth.uid);
  return { orgId: orgRef.id };
});

// ------------------------------------------------------------
// inviteMember: un admin/owner invita una email nella propria org.
// ------------------------------------------------------------
exports.inviteMember = onCall({ region: REGION }, async (request) => {
  const auth = request.auth;
  if (!auth) throw new HttpsError("unauthenticated", "Accesso richiesto.");
  const { orgId, email, role } = request.data || {};
  const myRole = auth.token.orgs && auth.token.orgs[orgId];
  if (myRole !== "owner" && myRole !== "admin") {
    throw new HttpsError("permission-denied", "Solo owner/admin possono invitare.");
  }
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    throw new HttpsError("invalid-argument", "Email non valida.");
  }
  const cleanRole = ["admin", "member"].includes(role) ? role : "member";

  const inviteRef = db.collection("invites").doc();
  await inviteRef.set({
    email: cleanEmail,
    orgId,
    role: cleanRole,
    status: "pending",
    invitedBy: auth.uid,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt: Timestamp.fromMillis(
      Date.now() + 14 * 24 * 60 * 60 * 1000  // 14 giorni
    ),
  });
  // TODO (fase successiva): email di notifica all'invitato.
  return { inviteId: inviteRef.id };
});

// ------------------------------------------------------------
// Gestione membri (pannello amministrazione, D4).
// Guardrail comuni: solo owner/admin; i ruoli owner li tocca solo
// un owner; MAI lasciare l'organizzazione senza owner attivi.
// ------------------------------------------------------------
async function requireAdmin(auth, orgId) {
  if (!auth) throw new HttpsError("unauthenticated", "Accesso richiesto.");
  const myRole = auth.token.orgs && auth.token.orgs[orgId];
  if (myRole !== "owner" && myRole !== "admin") {
    throw new HttpsError("permission-denied", "Solo owner/admin possono gestire i membri.");
  }
  return myRole;
}

async function countActiveOwners(orgId) {
  const owners = await db.collection(`organizations/${orgId}/members`)
    .where("role", "==", "owner").where("status", "==", "active").get();
  return owners.size;
}

exports.updateMemberRole = onCall({ region: REGION }, async (request) => {
  const { orgId, uid, role } = request.data || {};
  const myRole = await requireAdmin(request.auth, orgId);
  if (!["owner", "admin", "member"].includes(role)) {
    throw new HttpsError("invalid-argument", "Ruolo non valido.");
  }
  const memRef = db.doc(`organizations/${orgId}/members/${uid}`);
  const mem = await memRef.get();
  if (!mem.exists) throw new HttpsError("not-found", "Membro non trovato.");
  const current = mem.data().role;
  // i ruoli owner (in entrata o in uscita) li gestisce solo un owner
  if ((current === "owner" || role === "owner") && myRole !== "owner") {
    throw new HttpsError("permission-denied", "Solo un owner può gestire altri owner.");
  }
  // mai declassare l'ULTIMO owner attivo
  if (current === "owner" && role !== "owner" && (await countActiveOwners(orgId)) <= 1) {
    throw new HttpsError("failed-precondition",
      "È l'ultimo owner: nomina prima un altro owner.");
  }
  await memRef.update({ role });
  await rebuildClaims(uid);
  return { uid, role };
});

exports.removeMember = onCall({ region: REGION }, async (request) => {
  const { orgId, uid } = request.data || {};
  const myRole = await requireAdmin(request.auth, orgId);
  const memRef = db.doc(`organizations/${orgId}/members/${uid}`);
  const mem = await memRef.get();
  if (!mem.exists) throw new HttpsError("not-found", "Membro non trovato.");
  if (mem.data().role === "owner") {
    if (myRole !== "owner") {
      throw new HttpsError("permission-denied", "Solo un owner può rimuovere un owner.");
    }
    if ((await countActiveOwners(orgId)) <= 1) {
      throw new HttpsError("failed-precondition",
        "È l'ultimo owner: nomina prima un altro owner.");
    }
  }
  await memRef.delete();
  await rebuildClaims(uid);
  return { uid };
});

exports.revokeInvite = onCall({ region: REGION }, async (request) => {
  const { inviteId } = request.data || {};
  const invRef = db.collection("invites").doc(String(inviteId || ""));
  const inv = await invRef.get();
  if (!inv.exists) throw new HttpsError("not-found", "Invito non trovato.");
  await requireAdmin(request.auth, inv.data().orgId);
  if (inv.data().status !== "pending") {
    throw new HttpsError("failed-precondition", "L'invito non è più pendente.");
  }
  await invRef.update({ status: "revoked", revokedBy: request.auth.uid });
  return { inviteId };
});

// ------------------------------------------------------------
// acceptInvites: al login, l'utente riscatta gli inviti pendenti
// che corrispondono alla SUA email verificata.
// ------------------------------------------------------------
exports.acceptInvites = onCall({ region: REGION }, async (request) => {
  const auth = request.auth;
  // email VERIFICATA obbligatoria: senza questo controllo, chi registra un
  // indirizzo che non possiede (email_verified=false) potrebbe riscattare gli
  // inviti indirizzati a quell'email ed entrare in un'organizzazione altrui.
  if (!auth || !auth.token.email || auth.token.email_verified !== true) {
    throw new HttpsError("unauthenticated", "Serve un profilo con email verificata.");
  }
  const email = auth.token.email.trim().toLowerCase();

  const pending = await db.collection("invites")
    .where("email", "==", email)
    .where("status", "==", "pending")
    .get();

  const accepted = [];
  for (const doc of pending.docs) {
    const inv = doc.data();
    if (inv.expiresAt && inv.expiresAt.toMillis() < Date.now()) {
      await doc.ref.update({ status: "expired" });
      continue;
    }
    // già membro? NON sovrascrivere il ruolo: un invito 'member' non deve
    // declassare un owner/admin già presente (altrimenti si potrebbe lasciare
    // l'org senza owner). Consuma comunque l'invito.
    const memRef = db.doc(`organizations/${inv.orgId}/members/${auth.uid}`);
    if ((await memRef.get()).exists) {
      await doc.ref.update({ status: "accepted", acceptedBy: auth.uid });
      continue;
    }
    // ruolo dell'invito comunque limitato ad admin/member (difesa in profondità:
    // inviteMember già lo impedisce, ma un invito con role 'owner' non deve mai
    // creare un owner per questa via).
    const cleanRole = ["admin", "member"].includes(inv.role) ? inv.role : "member";
    await memRef.set({
      uid: auth.uid,
      role: cleanRole,
      status: "active",
      invitedBy: inv.invitedBy || null,
      joinedAt: FieldValue.serverTimestamp(),
    });
    await doc.ref.update({ status: "accepted", acceptedBy: auth.uid });
    accepted.push(inv.orgId);
  }
  if (accepted.length) await rebuildClaims(auth.uid);
  return { accepted };
});
