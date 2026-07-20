# Checkpoint — 2026-07-20 — D3 verifica email + recupero password (fatto)

## Task completato — D3
- SDK (shared/deepwork-id-client/index.js):
  - registerWithEmail ora invia l'email di verifica subito dopo la
    registrazione (best-effort: se l'invio fallisce il profilo resta
    valido);
  - nuovi metodi emailVerified(), resendVerification(),
    requestPasswordReset(email) (funziona anche da non autenticati).
- Login (apps/deepwork-id/index.html): link "Password dimenticata?"
  → invia l'email di reset all'indirizzo scritto nel campo email,
  messaggi in italiano semplice; mappato anche l'errore
  too-many-requests. FIX di robustezza: l'import dello SDK è ora
  dinamico dentro try/catch — prima, se i moduli Firebase (gstatic)
  non erano raggiungibili, l'INTERA pagina moriva senza gestori né
  messaggi (scoperto testando col proxy che blocca gstatic).
- non-autorizzato.html: banner "email non verificata" con azione
  "Invia di nuovo l'email".
- Verifiche: sintassi ok; Playwright → gestori attivi anche senza
  backend (messaggio mockup), zero errori console.
- NOTA: il collaudo end-to-end reale (email che arrivano davvero)
  sarà possibile solo dopo la creazione del progetto Firebase
  (weekend fondatore).

## Commit
- 0a9a410 — Deepwork ID D3: email verification + password reset flows

## Prossimo passo atomico
D4 — Pannello amministrazione organizzazione (taglia M): in
profilo.html (o pagina dedicata admin.html) elenco membri dell'org
attiva con ruoli, inviti pendenti con scadenza, revoca invito,
cambio ruolo/rimozione membro. Servono callable nuove in
functions/index.js (listMembers non serve: leggibile da Firestore
via rules; revoca/cambio ruolo/rimozione → Cloud Functions
updateMemberRole/removeMember/revokeInvite con controllo owner/admin
e MAI declassare l'ultimo owner). Aggiornare regole/test emulatore se
si aggiungono letture (19 test → estendere). Poi D5.
