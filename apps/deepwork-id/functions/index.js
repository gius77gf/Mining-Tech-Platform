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

admin.initializeApp();
const db = admin.firestore();

// Regione europea, coerente con la scelta dati EU del fondatore
const REGION = "europe-west1";

// ------------------------------------------------------------
// Claims: ricostruisce la mappa {orgId: role} di un utente
// leggendo TUTTE le sue membership attive, e la scrive nel token.
// ------------------------------------------------------------
async function rebuildClaims(uid) {
  const snap = await db
    .collectionGroup("members")
    .where(admin.firestore.FieldPath.documentId(), ">=", "")
    .get()
    .catch(() => null);

  // collectionGroup su documentId con uid: più robusto filtrare a mano
  const orgs = {};
  if (snap) {
    for (const doc of snap.docs) {
      if (doc.id !== uid) continue;
      const data = doc.data();
      if (data.status !== "active") continue;
      const orgId = doc.ref.parent.parent.id;
      orgs[orgId] = data.role || "member";
    }
  }
  await admin.auth().setCustomUserClaims(uid, { orgs });
  return orgs;
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.set(orgRef.collection("members").doc(auth.uid), {
      role: "owner",
      status: "active",
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromMillis(
      Date.now() + 14 * 24 * 60 * 60 * 1000  // 14 giorni
    ),
  });
  // TODO (fase successiva): email di notifica all'invitato.
  return { inviteId: inviteRef.id };
});

// ------------------------------------------------------------
// acceptInvites: al login, l'utente riscatta gli inviti pendenti
// che corrispondono alla SUA email verificata.
// ------------------------------------------------------------
exports.acceptInvites = onCall({ region: REGION }, async (request) => {
  const auth = request.auth;
  if (!auth || !auth.token.email) {
    throw new HttpsError("unauthenticated", "Serve un profilo con email.");
  }
  const email = auth.token.email.toLowerCase();

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
    await db.doc(`organizations/${inv.orgId}/members/${auth.uid}`).set({
      role: inv.role || "member",
      status: "active",
      invitedBy: inv.invitedBy || null,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await doc.ref.update({ status: "accepted", acceptedBy: auth.uid });
    accepted.push(inv.orgId);
  }
  if (accepted.length) await rebuildClaims(auth.uid);
  return { accepted };
});
