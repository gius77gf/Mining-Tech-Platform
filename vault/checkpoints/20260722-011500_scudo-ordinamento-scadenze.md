# Checkpoint — 2026-07-22T01:15:00Z

## Tipo
unit-complete (UX app verticale — Scudo, ordinamento scadenze)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo ordinamento scadenze)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti), dopo Conti (#305) e Flotta
(#306). La lista scadenze di Scudo era ordinata solo per data; ora c'è un
controllo "Ordina":
- `apps/scudo/index.html`: select `#scad-ord` (scadenza prima le vicine / tipo
  A→Z / lavoratore A→Z); stato `ordScad` + comparatore `scadCmp` (per
  lavoratore usa il nome via `byId`, con fallback "azienda", e a parità di nome
  ordina per data); il render usa `.sort(scadCmp)`. Rispetta il filtro attivo
  (tutte/scadute/entro 30gg/regolari).
Utile per raggruppare gli adempimenti per persona (tutte le scadenze di un
lavoratore vicine) o per tipo (tutte le visite mediche insieme).

Verifica: `node --check` del modulo Scudo OK; Playwright — default scadenza →
tipo in ordine alfabetico (Consegna DPI, Corso antincendio, CQC, Formazione,
Visita medica) → lavoratore in ordine alfabetico (Franco Riva, Giulia Verdi,
Luca Bianchi, Mario Rossi, Paolo Gallo); nessun errore. Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, proseguire con ordinamenti/filtri su Campo/Terra/
Sentinella o test aggiuntivi. Burden-reale Genesi resta rimandato.

## Blocchi
Burden-reale Genesi: conferma geometria. Core Fasi 3-4: gated (auth Firebase).
Dati default sensibili + mitigazione password: non toccare senza conferma.
