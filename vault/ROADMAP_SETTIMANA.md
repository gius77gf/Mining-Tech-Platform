# Roadmap Settimana — 2026-07-20 → 2026-07-24

Obiettivo generale della settimana (indicato dall'utente): sfruttare al
massimo il tempo/capacità disponibile per migliorare il progetto e le
prestazioni di sviluppo. Task derivati dall'analisi dello stato attuale
del repository, condivisa e approvata con l'utente.

## 1. Sistemare i riferimenti rotti nel service worker
[sequenziale] — taglia S — stato: da fare
`sw.js` punta a file (`deepwork-v3.3.html`, `v3.2.html`) che non esistono
più: il fallback offline fallisce silenziosamente.

## 2. Configurare Firebase/notifiche push e verificare le regole di sicurezza Firestore
[sequenziale] — taglia M — stato: da fare
`firebase-messaging-sw.js` ha ancora valori segnaposto
(`INCOLLA_QUI_LA_API_KEY...`). Verificare inoltre che esistano regole di
sicurezza Firestore coerenti con i ruoli dell'app (non risultano presenti
nel repo).

## 3. Sostituire le credenziali finte con vera autenticazione
[sequenziale, dipende da 2] — taglia L — stato: da fare
**Priorità di sicurezza**: credenziali admin/utente sono attualmente in
chiaro nel codice client (es. `admin/admin`), leggibili da chiunque apra il
sorgente della pagina. Da sostituire con Firebase Authentication reale o
verifica lato server.

## 4. Baseline tooling: package.json, bundler, .gitignore, split del monolite HTML
[parallelo-gruppo-A] — taglia L — stato: da fare
Il progetto è oggi un unico `index.html` da 8.266 righe senza build tool.

## 5. Scaffold di test (unit su hash/verifica password, smoke e2e login/nav)
[parallelo-gruppo-A, dipende da 4 per la struttura moduli] — taglia M — stato: da fare

## 6. CI su GitHub Actions (lint + test + preview deploy Netlify su PR)
[parallelo-gruppo-A] — taglia S — stato: da fare

## 7. README e documentazione reale (modello dati, ruoli, collezioni Firestore)
[parallelo-gruppo-B] — taglia S — stato: da fare

## 8. Censire lo stato delle feature a metà (3D/fotogrammetria, import MWD, simulatore volate) e aprire issue
[parallelo-gruppo-B] — taglia M — stato: da fare

## Vincoli
- Non pushare mai su main senza istruzioni esplicite dell'utente per il
  lavoro di sviluppo regolare (il file skill lo ricorda già).
- Commit piccoli e frequenti; un checkpoint per ogni unità completata.

## Riferimenti
- Ultimo checkpoint: vault/checkpoints/2026-07-19_1040_avvio-settimana.md
