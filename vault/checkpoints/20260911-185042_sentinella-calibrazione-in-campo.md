# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1654ea53

## Completato
Unità 114 — Sentinella: la calibrazione in campo delle misure di rumore.
`scartoCalibrazioneDb` sul punto (dichiarato dall'utente), `calibrazione:
{ prima, dopo }` sulla lettura, `scartoCalibrazione` / `validitaCalibrazione`
/ `contaCalibrazioni` nel modulo, ragione di annullamento «calibrazione», lo
stato su ogni riga della tabella e il conto nel report nel periodo. run-kpi
2910 → 2911, copertura 992/992, screenshot a 430 px guardati.

## Imparato
- Il report contava la calibrazione su TUTTO l'archivio mentre due righe
  sopra scriveva «letture nel periodo: 1»: due denominatori nello stesso
  foglio. Un conto nuovo in un documento prende il denominatore dei conti
  che gli stanno accanto, non quello comodo.
- `numeroDichiarato` non legge la virgola: un valore arrivato come testo
  «94,2» va normalizzato prima, se no la funzione risponde «non registrata»
  su un dato che c'è.

## Prossimo passo atomico
Leggere il giro del browser lanciato su `755ef985` (`$S/giri/ultimo-log.txt`,
con `leggi-giro.mjs`) quando `ultimo-exit.txt` compare: chiudere i KO veri
(al giro precedente, su `2766bf9b`, erano 0). Poi ricerca a rotazione, terzo
giro, Campo (candidata: il registro degli esplosivi in cava — carico/scarico,
il verbale di brillamento, chi lo firma, che cosa chiede il Questore; delta
dal meccanismo su `pianoDiCarico`, `brillamento`, `testoConsegnaTurno`), poi
Conti e Genesi al quarto giro.

## Blocchi
Nessuno.
