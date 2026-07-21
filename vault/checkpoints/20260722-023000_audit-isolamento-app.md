# Checkpoint — 2026-07-22T02:30:00Z

## Tipo
unit-complete (fallback #5 — revisione sicurezza; direttiva fondatore #1)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — audit isolamento app)

## Completato
Revisione di sicurezza sull'isolamento multi-tenant delle 6 app verticali
(priorità #1 del fondatore: rivendita a aziende concorrenti). Verificato con
ricerca automatica + lettura del codice e documentato in
`docs/AUDIT_ISOLAMENTO_APP.md` (in italiano semplice, per Giuseppe):
- Tutte e 6 le app (campo/conti/flotta/scudo/sentinella/terra) usano
  `orgCollection` per OGNI operazione dati (read/aggiungi/aggiorna/rimuovi).
- ZERO percorsi Firestore costruiti a mano: `collection(db,…)`/`doc(db,…)` = 0
  occorrenze in tutti i .js/.html delle app.
- Demo/tour: dati solo in memoria, nessun rischio di mescolamento.
- Genesi non tocca il DB org (localStorage); l'unico file senza orgCollection è
  il service-worker, che non accede a dati.
- Rete di sicurezza: i test regole Firestore in CI (emulatore) rifiutano
  l'accesso cross-org e diventano rossi se qualcuno rompe l'isolamento.
Il core resta mono-azienda, predisposto (ISOLAMENTO_CORE.md), attivazione
gated sul via libera del fondatore.

Esito: isolamento delle app verticali CONFERMATO solido. Nessun intervento di
codice necessario (è una conferma, non un bug-fix).

## Prossimo passo atomico
Aprire PR. Poi: proseguire con seconde iterazioni/approfondimenti sicuri
(fallback), oppure — se il fondatore dà i due via libera — sbloccare il lavoro
ad alto valore gated: (1) Genesi P1.1/P1.2 (burden reale/boretrack) con
conferma del segno geometrico del fronte; (2) core Fasi 3-4 (auth server +
migrazione) con via libera Firebase.

## Blocchi
Genesi burden-reale: conferma geometria. Core Fasi 3-4: via libera Firebase.
Dati default sensibili + mitigazione password: non toccare senza conferma.
