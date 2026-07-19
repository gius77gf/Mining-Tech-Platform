# Checkpoint — 2026-07-19 17:45
Task completato: quattro unità su istruzione "scarica tutti i token di oggi":
1. Cloud Functions di Deepwork ID (bozza v0.1): rebuildClaims (unico scrittore dei custom claims), createOrganization, inviteMember (con scadenza 14gg), acceptInvites legato all'email verificata — commit 9da3dad
2. Revisione anticipata: corretto rebuildClaims (query esatta per campo uid nelle membership invece di scansione completa) — commit f61bb7a
3. Mitigazione ponte password PREPARATA e NON ATTIVATA (docs/MITIGAZIONE_PASSWORD.md) — richiede conferma esplicita del fondatore — commit 8618cb4
4. CLAUDE.md creato: istruzioni permanenti del repo per tutte le sessioni future (procedura cicli, regole vincolanti stile/multi-tenant/git/spese/sicurezza, comandi test) — commit 02267c9
Commit di riferimento: f61bb7a
Prossimo passo atomico: CICLO SERALE (~21:40 di oggi): revisione completa della giornata come da REGOLA SERALE (coerenza incrociata di tutto il lavoro: architettura, SDK, rules+test, 7 pagine app, functions, audit; verificare che i riferimenti nel vault e in CLAUDE.md puntino a file esistenti; rieseguire i test delle rules). Se revisione pulita: proseguire con integrazione SDK→Functions (chiamate httpsCallable per createOrganization/acceptInvites nello SDK client) oppure schermata post-login di Deepwork ID (selezione organizzazione + profilo neutro).
