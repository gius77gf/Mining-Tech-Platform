# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
14241027

## Completato
Unità 92 — ricerca a rotazione, secondo giro, Terra: «che cosa consegna il
topografo col rilievo annuale, e che cosa firma il direttore responsabile».
Metà sul mondo di seconda mano (20 fonti), delta dal meccanismo contro
`e5e2ea6a` con i comandi rilanciati. Due mancanze piccole aperte (la
tolleranza dichiarata dal rilevatore nel verbale; «direttore responsabile»
nelle tre firme), due dichiarate (geometrie, addetti medi), tre a posto.
Solo documenti.

## Imparato
- Le tre app che firmano un foglio chiamano la stessa persona con due nomi:
  Scudo e Sentinella «direttore responsabile» (la figura del D.P.R. 128),
  Terra «direttore dei lavori» (la parola del cantiere edile). È la famiglia
  «le parole del mestiere» e si prende solo confrontando le app fra loro,
  non leggendone una.
- Terra dichiara da sola il buco della domanda 2 («le tolleranze sono
  valori tipici e vanno confermate con i punti di controllo del
  rilevatore»): la frase è onesta, e il passo dopo è dare al rilevatore un
  posto dove scriverli.

## Prossimo passo atomico
Unità 93, Terra, le due voci aperte insieme: (1) nelle tre righe di firma di
`apps/terra/index.html` (righe con `class='firma'`: verbale, relazione di
lotto, riepilogo annuale) «Il direttore dei lavori» → «Il direttore
responsabile», e una prova in `run-kpi` che pretende la stessa parola in
Terra, Scudo e Sentinella; (2) campo facoltativo `new-ril-toll` (tolleranza
dichiarata dal rilevatore, in %) salvato in `tolleranzaPct` del rilievo,
`classeAccuratezza(r)` che quando il campo è un numero > 0 risponde
`{classe:"dichiarata", tolleranzaPct: quel numero, fonte:"rilevatore"}` e
altrimenti com'è oggi (`fonte:"classe"`), il verbale che scrive «dichiarata
dal rilevatore» o «tipica del metodo» leggendo `fonte`, banco/prove in
`run-kpi` (prima in scratchpad). Poi leggere il giro del browser su
`faf5e271` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.
