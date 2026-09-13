# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
98dfe99f

## Completato
Unità 93 — Terra: la tolleranza dichiarata dal rilevatore (`tolleranzaPct`
nel rilievo, `classeAccuratezza` con `fonte`/`tolleranzaTipica`, verbale,
riga, badge, `incertezzaScavo.delRilevatore`) e «direttore responsabile»
nelle tre firme, con la prova che pretende la stessa parola in Terra, Scudo e
Sentinella. Chiuse le due voci della ricerca dell'11/09. run-kpi 2895,
totale 3.376. Screenshot a 430 px guardati.

## Imparato
- Un nome di campo può far cadere una prova che conta una PAROLA: `dichiarati`
  dentro `incertezzaScavo` è finito nel JSON del riepilogo annuale, e P2 —
  che pretende che il «dichiarato» dei turni non entri nel foglio per gli
  enti — l'ha contato. Il nome giusto dice di chi è la cosa (`delRilevatore`),
  e la ragione sta scritta accanto.
- Quando un valore dichiarato batte quello tipico, il tipico resta accanto:
  chi legge deve vedere se lo batte davvero.

## Prossimo passo atomico
Leggere il giro del browser su `faf5e271` (`scratchpad/giri/ultimo-log.txt`,
`leggi-giro.mjs`) quando `ultimo-exit.txt` compare, e chiudere i KO veri.
Poi la ricerca a rotazione del secondo giro su Campo («che cosa scrive il
caposquadra a fine turno e che cosa ne fa il direttore il giorno dopo» — il
mondo via WebSearch, delta dal meccanismo) oppure su Sentinella («che cosa
chiede l'ARPA dopo un reclamo per le vibrazioni»). In coda, dichiarato: la
colonna `tolleranzaPct` nel CSV dei rilievi (`csvRilievi`/`parseRilieviCsv`
+ pin `CSV_TABELLE` in `dw-shell.js`), da fare col prossimo ritocco del CSV.

## Blocchi
Nessuno.
