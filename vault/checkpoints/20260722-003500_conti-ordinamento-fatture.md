# Checkpoint — 2026-07-22T00:35:00Z

## Tipo
unit-complete (UX app verticale — Conti, ordinamento fatture)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti ordinamento fatture)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti). La lista fatture di Conti
era ordinata solo per scadenza; ora c'è un controllo "Ordina per":
- `index.html`: select "Ordina" (scadenza / importo dal più grande / cliente
  A→Z); `ordFat` + comparatore `fatCmp`; il render usa `.sort(fatCmp)`.
Utile per la gestione incassi: ordinare per importo (chi mi deve di più) o per
cliente.

Verifica: syntax modulo OK; Playwright — default scadenza → importo riordina
(031 €18.300 sopra 028 €12.000) → cliente in ordine alfabetico; nessun errore.
Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, proseguire con altre seconde iterazioni UX sulle app
(ordinamenti/filtri dove mancano) o test aggiuntivi. Burden-reale Genesi resta
rimandato (segno geometrico da chiarire col fondatore).

## Blocchi
Burden-reale Genesi: conferma geometria. Motore fisico: non toccare. Core Fasi
3-4: gated.
