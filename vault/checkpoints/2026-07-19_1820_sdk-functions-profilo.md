# Checkpoint — 2026-07-19 18:20
Task completato: due unità aggiuntive del blocco serale esteso:
1. SDK: cablate le chiamate alle Cloud Functions (createOrganization, inviteMember, redeemInvites) con refresh forzato del token per applicare subito i nuovi claims — commit ffdec98
2. Deepwork ID: schermata profilo post-login (profilo NEUTRO come da decisione fondatore: solo email+iniziali; organizzazioni con ruoli, creazione org, inviti, griglia app per entitlement) verificata con screenshot — commit 4c093db
Commit di riferimento: 4c093db
Prossimo passo atomico: CICLO SERALE (~21:40): revisione completa della giornata come da REGOLA SERALE e CLAUDE.md — rieseguire i test delle rules (19/19 attesi), controllo coerenza incrociata di tutti i file prodotti oggi, refusi, riferimenti rotti. Se pulita: collegare la pagina di login (index.html di deepwork-id) al redirect verso profilo.html dopo autenticazione, e aggiungere il flusso "organizzazione attiva" nello switch multi-org (persistenza defaultOrgId su users/{uid}).
