# Checkpoint — 2026-09-04T07:17:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
21980bf9 — Ricerca sul registro esplosivi (metà sul mondo); prima: 7eb71fbb la maglia e le coordinate con la virgola

## Completato
- Core: maglia («Sp3,2×I3,8», «B 3,2 × S 3,8», PDF «3,2 m»), coordinate dei
  fori con la virgola, cinque `toFixed(1).replace` tolti; banco
  `core-documenti-che-escono` 71 → 74 nei due versi (17/17 rimessi), righello
  `numeroFoglio` corretto (leggeva la prima «n,n m» del foglio: con la maglia
  alla virgola prendeva l'interasse). Giro node 38/0.
- Ricerca (agente, WebSearch, seconda mano dichiarata) sul registro di carico
  e scarico degli esplosivi in coda a `docs/RICERCA_CONTINUA_CORE.md`, con
  sette domande per il delta. Il delta NON è fatto: va fatto dal meccanismo.
- In corso, cantiere parallelo: passata in profondità su Deepwork ID e vetrina
  (agente; scrive solo in `apps/deepwork-id/*.html`, `apps/index.html` e
  banchi `id-*`/`vetrina-*`; non committa).

## Prossimo passo atomico
1. Raccogliere il rapporto del cantiere Deepwork ID/vetrina: rimisurare ogni
   difetto dichiarato su una copia di HEAD, lanciare i banchi nuovi nei due
   versi, registrarli in `tutti.mjs` se non l'ha fatto, aggiornare i numeri
   guardati (banchi 229 → N in `numeri-nei-documenti`), copia + giro node,
   commit con `-F`, checkpoint, roadmap («Nona tappa»).
2. Il delta della ricerca sugli esplosivi, dal meccanismo: aprire
   `misureVolataProgetto`/`misureVolataFochino`/`esitoSparo`/`esplosivoPerTipo`
   in dw-shell e rispondere alle sette domande del documento (chi sa i kg per
   volata, chi sa i colpi mancati, che cos'è un lotto); scrivere il delta sotto
   la ricerca con il commit di verifica, e SOLO poi decidere se il registro è
   un cantiere (probabile: ma la conservazione 5/50 anni e la vidimazione sono
   norma di seconda mano → decisione del fondatore prima di scriverla in una
   schermata).
3. Il Report tecnico mensile col punto («81.0», «1190.7»): foglio e righello
   (`num` con parseFloat in `core-documenti-che-escono`) insieme.

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-24, Q1.
