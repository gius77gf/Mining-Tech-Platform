# Checkpoint — 2026-07-19 15:10
Task completato: Task 2, blocco fondamenta di Deepwork ID — 5 unità:
1. firestore.rules bozza v0.1 (deny-by-default, isolamento path-based, tenant demo sola lettura) — commit 6f8b05c
2. SDK client condiviso shared/deepwork-id-client/index.js (login Google/email/tour, entitlement, accesso dati sigillato sull'org, multi-org) — commit 5202abb
3. Stile deepwork estratto in shared/deepwork-style.css (token vincolanti + mappa accenti per app) — commit abda944
4. Pagina di accesso apps/deepwork-id/index.html (login/registrazione/tour, stile verificato con screenshot nel browser) — commit e99941a
5. GUIDA_FIREBASE.md passo-passo per il fondatore (procedura weekend, gratuita) — commit dc112dd
Commit di riferimento: dc112dd (ultimo del blocco)
Prossimo passo atomico: configurare l'emulatore Firebase locale (firebase.json + emulators) in apps/deepwork-id/ e scrivere i primi test automatici delle regole di sicurezza (isolamento tra org verificato da test, non a occhio). In alternativa se l'ambiente non consente l'emulatore: iniziare task 6 (config pubblicazione Netlify per apps/) o task 3 (scheletro app Scudo usando SDK + stile condivisi).
