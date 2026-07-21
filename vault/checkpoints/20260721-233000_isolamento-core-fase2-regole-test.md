# Checkpoint — 2026-07-21T23:30:00Z

## Tipo
unit-complete (isolamento core Fase 2 — regola + test isolamento; + fix percorso Fase 1)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — isolamento core: apps/core + 8 test emulatore)

## Completato
Eseguendo i test sull'emulatore ho scoperto e corretto un bug del MODELLO di
percorso della Fase 1: `organizations/{org}/core/{col}/{id}` ha un numero
DISPARI di segmenti → riferimento documento non valido. Modello corretto: il
cuore vive come **app `core`** → `organizations/{org}/apps/core/{col}/{id}`
(pari, valido) e — vantaggio grosso — è coperto dalla **regola generica già
provata** `apps/{appId}/**`, senza regole nuove.
- `index.html`: helper `dcol/ddoc` (modalità multi-tenant) → percorso
  `apps/core/...` (il bug era dormiente, flag spento; ora corretto).
- `apps/deepwork-id/firestore.rules`: nessuna regola nuova; commento che
  chiarisce che `apps/{appId}/**` copre anche appId='core'. Rimosso il match
  ridondante che avevo aggiunto.
- `run.mjs`: seed dati cuore `organizations/{org}/apps/core/rapportini/...` +
  **8 test d'isolamento** (il concorrente NON legge/scrive/cancella/elenca né
  accede in profondità ai dati `apps/core/**` di un'altra org; il membro legge
  i propri). Regole 44 → 52; CI 314 → 322.
- `docs/ISOLAMENTO_CORE.md`: percorso corretto ad `apps/core`; Fasi 1-2 marcate
  fatte.

Verifica: `node --check` core OK; **emulatore Firestore: 52/52 test passati**,
inclusi gli 8 nuovi del cuore; Playwright boot core → login ok, body invariato,
zero errori JS.

## Prossimo passo atomico
Aggiornare PR #297 (design + Fase 1 corretta + Fase 2). Poi Fasi 3-4 (auth
Firebase + migrazione) sono GATED: servono decisioni/infra del fondatore.
Dopodiché, per direttiva del fondatore, passare alla RICERCA su Genesi +
competitor.

## Blocchi
Fase 3 (auth server-side/claim) e Fase 4 (migrazione dati + attivazione flag):
gated, toccano produzione/infra Firebase → conferma del fondatore.
