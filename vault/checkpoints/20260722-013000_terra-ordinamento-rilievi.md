# Checkpoint — 2026-07-22T01:30:00Z

## Tipo
unit-complete (UX app verticale — Terra, ordinamento rilievi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra ordinamento rilievi)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti), dopo Conti (#305), Flotta
(#306), Scudo (#307). La lista rilievi di Terra era ordinata solo per data;
ora c'è un controllo "Ordina":
- `apps/terra/index.html`: select `#ril-ord` (data più recente / volume dal più
  grande / titolo A→Z); stato `ordRil` + comparatore `rilCmp` (volume usa
  `volumeM3`, a parità ordina per data recente); il render usa `.sort(rilCmp)`.
  Rispetta il filtro attivo (tutti/elaborati/pianificati).
Utile per confrontare i rilievi per volume estratto (colpo d'occhio sul rilievo
più corposo) oltre alla cronologia.

Verifica: `node --check` del modulo Terra OK; Playwright — default data →
volume 21.300→20.100→19.400→18.600 m³ (decrescente, i pianificati senza volume
in coda) → titolo in ordine alfabetico; nessun errore. Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, valutare ordinamento anche su Campo attività (stato/
titolo) e Sentinella, oppure passare a test aggiuntivi/altre seconde iterazioni.
Burden-reale Genesi resta rimandato.

## Blocchi
Burden-reale Genesi: conferma geometria. Core Fasi 3-4: gated (auth Firebase).
Dati default sensibili + mitigazione password: non toccare senza conferma.
