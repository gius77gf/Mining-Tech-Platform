# Checkpoint — 2026-07-20 — D4 pannello amministrazione org (fatto)

## Task completato — D4
- Cloud Functions (apps/deepwork-id/functions/index.js): tre callable
  nuove con guardrail — updateMemberRole (i ruoli owner li gestisce
  solo un owner; MAI declassare l'ultimo owner attivo), removeMember
  (stessi vincoli), revokeInvite (solo inviti pendenti, admin
  dell'org). Ogni modifica ricostruisce i claims.
- SICUREZZA rafforzata: in firestore.rules la collezione members ora
  è in sola lettura dal client (write: false) — le scritture passano
  SOLO dalle Cloud Functions: un admin non può auto-promuoversi
  modificando il proprio documento membership.
- Test regole estesi 19 → 26, TUTTI PASSATI sull'emulatore (nuovi:
  lettura membri della propria org sì / concorrente no, scrittura
  membership negata anche a owner, auto-promozione negata, inviti
  leggibili solo da owner/admin della propria org).
- SDK: listMembers(), listPendingInvites() (letture dirette permesse
  dalle rules) + wrapper updateMemberRole/removeMember/revokeInvite.
- UI: apps/deepwork-id/admin.html — membri con cambio ruolo (select)
  e rimozione con conferma, inviti pendenti con giorni alla scadenza
  e revoca, form invito con ruolo; voce "Amministrazione" nel
  profilo. Anteprima con dati di esempio senza backend (verificata
  Playwright, screenshot d4-admin.png in scratchpad, zero errori).

## Commit
- c19780c — Deepwork ID D4: organization admin panel with guarded member management

## Nota CI: run ancora in coda runner GitHub all'ultimo controllo.

## Prossimo passo atomico
D5 — Test SDK con emulatore Auth+Firestore (taglia M): script di test
che esercita il FLUSSO (registrazione → org → claims → orgCollection
→ isolamento) contro gli emulatori. Nota: lo SDK importa i moduli
Firebase da gstatic (bloccati dal proxy in sandbox) — se necessario,
testare la LOGICA del flusso con l'admin SDK/emulatore come già fatto
per le rules, oppure rendere l'URL dei moduli parametrico. Dopo D5:
PR cumulativa FASE D verso main, poi FASE E (E1 censimento feature).
