# Checkpoint — 2026-09-15T09:37:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
139f2561 (pushato)

## Cosa è stato completato

Chiusa la seconda unità Conti rimasta dal quarto giro di ricerca ("DDT
numerazione senza salti dichiarata ma non imposta" — segnata nei
checkpoint precedenti come "probabilmente una nota in DECISIONI_WEEKEND
più che un fix"). Riverificando di persona il codice, il difetto si è
rivelato più concreto e più cavo di una semplice decisione da girare al
fondatore: è finito come fix, non come nota.

**Il difetto**: `prossimoNumero` (Conti) propone sempre il numero
`max+1` fra quelli già usati nell'anno — il campo del DDT è `readonly`,
quindi **duplicati** non ne nascono mai. Ma il dialogo di cancellazione
di un DDT prometteva incondizionatamente: *"il numero che si libera
verrà riusato dalla prossima, così la numerazione resta senza salti"*.
Falso ogni volta che si cancella un DDT che NON è l'ultimo della serie
(la situazione più comune: si corregge la pesata sbagliata di ieri, non
quella appena salvata) — se esistono già DDT successivi, il numero
cancellato non torna mai a essere proposto: un **buco permanente**,
l'esatto contrario di quanto promesso e di quanto richiede il DPR
472/1996 sulla numerazione progressiva citato nello stesso file.

**La correzione**: non si tocca la possibilità di cancellare un DDT (è
una scelta di chi usa l'app, non nostra): si dice la verità PRIMA che la
prema. Nuova funzione pura `cancellazioneLasciaBuco(daCancellare, tutti,
anno)` in `conti-data.js`, che riusa `prossimoNumero` invece di
riscriverne il parsing (se il numero proposto non cambia togliendo il
documento dall'elenco, un altro documento teneva già lo stesso massimo —
cancellare non abbassa niente, quindi lascia un buco). Il dialogo mostra
ora un avviso esplicito quando cancellare lascerebbe un buco, invece del
messaggio rassicurante sempre uguale.

**Verifica**:
- Verificato a mano in `node`, prima di scrivere il fix nella pagina:
  quattro scenari (non ultimo della serie → buco; ultimo della serie →
  nessun buco; unico documento → nessun buco; documento senza numero →
  nessun buco, non un errore).
- Nuovo test in `run-kpi.mjs`, cinque casi, incluso un DDT di un anno
  diverso (2025 in mezzo a fatture 2026) per confermare che l'anno usato
  è quello del documento che si cancella, non quello di oggi — altrimenti
  un DDT vecchio verrebbe confrontato con la serie sbagliata.
- `sintassi-pagine.mjs` (34/34) e `nomi-liberi.mjs` (31/0, 0 fuori scope,
  0 liberi) confermano che `conti/index.html` compila e il nuovo nome
  importato (`cancellazioneLasciaBuco`) è usato correttamente, non un
  nome libero.
- `numeri-nei-documenti.mjs`: cascata dei quattro documenti aggiornata
  (run-kpi 2995→2996, totale 3.479→3.480, copertura funzioni pure
  996/996→997/997) e la cifra "asserzioni eseguite dal giro" ricalcolata
  fresca sulla worktree isolata (3.903).
- Giro isolato su worktree separata, scoped esattamente ai 7 file di
  questa unità: **40 comandi a posto, 0 caduti**.

## Stato roadmap

Il quarto giro di ricerca (Sentinella, Conti, Genesi) e i suoi due
findings residui su Conti sono **entrambi chiusi** ora: `applicaIncassi`
(unità precedente) e la numerazione DDT (questa unità). Nessuna voce di
roadmap dedicata rimasta aperta da quel giro.

## Prossimo passo atomico

Per la regola "il lavoro non finisce mai da solo": lanciare un nuovo giro
di ricerca mirata in background (tre cantieri paralleli su app non
ancora coperte in profondità, seguendo il mandato corretto della routine
— `docs/MAPPA_ECOSISTEMA.md` §6 come fonte di stato vivo, corretto in
questa sessione via `update_trigger` — invece del boilerplate fisso e
scaduto). In alternativa o in parallelo: una seconda iterazione di
qualità/estetica su un'app già toccata, o una revisione mirata di
sicurezza/qualità su codice già su main, seguendo l'elenco "SE LA
ROADMAP SEMBRA FINITA" del mandato della routine. Nessuno stop
volontario: si prosegue subito.
