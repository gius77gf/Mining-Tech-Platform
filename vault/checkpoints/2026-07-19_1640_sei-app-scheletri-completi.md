# Checkpoint — 2026-07-19 16:40
Task completato: Task 3 — scheletri navigabili di TUTTE e 6 le app verticali completati e verificati con screenshot nel browser:
- shared/dw-app-shell.css: shell comune estratta da Scudo (una correzione futura vale per tutte) — commit b7deb25
- Campo (accento arancio operativo) — commit 2e78e58
- Flotta (azzurro logistica) — commit 15fcc45
- Conti (teal dati) — commit 71846cc
- Sentinella (sabbia sistema) — commit 5a49694
- Terra (verde cava) — commit acb33ec
Ognuna: quadro KPI + 3 sezioni di dominio con dati demo realistici, banner tour, aggancio SDK Deepwork ID, stile deepwork vincolante rispettato.
Commit di riferimento: acb33ec
Prossimo passo atomico: Task 4 — audit sicurezza Deepwork core: iniziare dal fix di sw.js (riferimenti a file inesistenti deepwork-v3.3.html/v3.2.html) e dal censimento completo dei problemi di sicurezza del monolite index.html (credenziali in chiaro, regole Firestore del progetto esistente, firebase-messaging-sw.js placeholder). Ricordare la REGOLA SERALE per il ciclo delle ~21:40: prima revisione del lavoro di oggi.
