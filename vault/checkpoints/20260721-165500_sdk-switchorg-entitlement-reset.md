# Checkpoint — 2026-07-21T16:55:00Z

## Tipo
unit-complete (fix condivisi da review shared — 4/4, chiude la review)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — switchOrg azzera l'entitlement prima del reload)

## Completato (Unit C: SDK switchOrg)
Ultima nota (minore) della review del codice condiviso: `switchOrg` impostava
`this.orgId = nuovaOrg` e poi ricaricava l'entitlement SENZA azzerarlo prima.
Se `_loadEntitlement` (getDoc) falliva per un problema di rete transitorio,
`this.entitlement` restava quello dell'org PRECEDENTE mentre orgId era già il
nuovo → `hasEntitlement()` avrebbe riportato lo stato di abbonamento sbagliato
per la nuova org finché non riusciva un reload. (L'ISOLAMENTO dei DATI resta
comunque intatto: gli accessi passano da orgCollection con l'orgId corretto;
è solo un flag di fatturazione.) Aggiunto `this.entitlement = null;` prima del
reload, come già fa `_loadClaimsAndOrg` (che è testato).
Nessun nuovo test: il ramo dipende da un errore di rete transitorio (non
simulabile sull'emulatore senza fault injection) e aggiungere a `tizio` una
seconda org romperebbe il test di isolamento esistente (che verifica che orgB
sia respinta). La regressione è coperta dai test switchOrg esistenti; il fix
rispecchia un pattern già testato. Syntax OK.

## Esito complessivo della review del codice CONDIVISO
- Isolamento multi-tenant: **VERIFICATO SOLIDO** (orgCollection sigillato).
- 4 bug nei parser CSV/numeri + 1 nota SDK → **TUTTI CHIUSI** (#262 numIt+
  csvCell, #263 parseCsvLine, questo switchOrg). +13 test condivisi totali.
Suite 294.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI (le 3 review della
sessione — UI, data-layer, shared — sono chiuse: valutare nuove rifiniture/
ricerche o una revisione di superfici non ancora toccate, es. core).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
