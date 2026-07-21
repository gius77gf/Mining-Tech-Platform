# Checkpoint — 2026-07-22T02:00:00Z

## Tipo
unit-complete (UX app verticale — Campo, ordinamento attività)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo ordinamento attività)

## Completato
Fallback #1 (seconde iterazioni app — ordinamenti), unità finale della serie
dopo Conti (#305), Flotta (#306), Scudo (#307), Terra (#308), Sentinella (#309).
La lista attività della giornata di Campo era ordinata solo per stato; ora c'è
un controllo "Ordina":
- `apps/campo/index.html`: select `#att-ord` (stato prima le anomalie / titolo
  A→Z); stato `ordAttSel` + comparatore `attCmp`; il render usa `.sort(attCmp)`.
  Rispetta il filtro attivo (tutte/in-corso/pianificate/anomalie).

Con questa unità TUTTE le 6 liste principali delle app verticali (Conti fatture,
Flotta mezzi, Scudo scadenze, Terra rilievi, Sentinella sensori, Campo attività)
hanno un controllo di ordinamento coerente, con lo stesso pattern:
`let ordX` + `xCmp` comparatore + `.sort(xCmp)` + select `#x-ord` in UI.

Verifica: `node --check` del modulo Campo OK; Playwright — default stato →
titolo in ordine alfabetico (Carico e trasporto, Controllo pre-turno mezzi,
Frantoio primario, Perforazione fronte Est, Volata fronte Nord); nessun errore.
Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, passare a un'altra tipologia di seconda iterazione UX
(stati vuoti più informativi, validazioni degli input dei form) o a test
aggiuntivi sull'emulatore. Burden-reale Genesi resta rimandato.

## Blocchi
Burden-reale Genesi: conferma geometria. Core Fasi 3-4: gated (auth Firebase).
Dati default sensibili + mitigazione password: non toccare senza conferma.
