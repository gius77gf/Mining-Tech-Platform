# Checkpoint — 2026-09-19T02:30:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4cc456bf — docs: decisione 40 — la barra di navigazione è sotto il minimo di tocco

## Cosa è stato completato
Tre cantieri in parallelo (direttiva 26/07): quarta QA su Genesi (DXF/3D),
ricerca continua su Terra, seconda UX su Scudo. Tutti e tre i finding
verificati indipendentemente prima di agire.

- [x] **Genesi** (`15881fd0`): due difetti verificati con riproduzione
      diretta. (1) `pointcloud.js` `parseXYZ` trattava la virgola come
      separatore di campo anche quando la riga aveva già spazi (decimale
      italiano: "12,345 56,789 90,123" diventava sei numeri spaccati e
      mescolati col colore, senza errore) — corretto leggendo con `numIt`
      quando la riga ha spazi, comma/`;` restano separatori solo senza
      spazi (compatibile coi test esistenti). (2) `genesi-data.js`
      `_dxfEntita`/`dxfInTratti` non riconoscevano LWPOLYLINE — l'entità
      polilinea di DEFAULT di AutoCAD/LibreCAD/QCAD, i tre programmi
      nominati nel tooltip — dando "nessun tratto leggibile" su un file
      con la geometria vera. Aggiunto il riconoscimento (vertici come
      coppie di codici 10/20 ripetute nella stessa entità). Nuovi test
      con controprova in tre file (`run-pointcloud.mjs`, `run-kpi.mjs`,
      `genesi-dxf-import.mjs` con upload reale nel browser).
- [x] **Ricerca su Terra** (`b6f3b4df`): il mondo (Propeller/ASPRS-NSSDA/
      Trimble, fonti di seconda mano) distingue un GCP (costruisce il
      modello, residuo quasi zero per costruzione) da un checkpoint
      indipendente (l'unico che misura l'accuratezza vera). Terra nomina
      già il concetto in quattro punti (commento, riepilogo, verbale,
      tooltip) ma non lo implementa — nessun campo per contare i
      checkpoint o il loro scarto. Proposta a costo Medio, non
      implementata, appesa in `docs/RICERCA_CONTINUA_TERRA.md`.
- [x] **Scudo → decisione 40** (`4cc456bf`): la barra di navigazione in
      basso (`.nav`, `shared/dw-app-ui.css`) garantisce un'altezza minima
      ai bottoni ma nessuna larghezza minima. Riverificato indipendente-
      mente con `getBoundingClientRect`: Conti (10 colonne) è a **31px**
      @320px (30% del minimo), Scudo (8 colonne) a 37-43px, Flotta/
      Sentinella/Terra (6 colonne) a 48-58px — sopra i 44 normali ma
      sotto i 60 che il tema del sole richiede in TUTTE le app tranne
      Campo. Tocca `shared/`, introdurrebbe un pattern (scorrimento
      orizzontale) mai visto altrove nell'ecosistema: messo in
      `docs/DECISIONI_WEEKEND.md` come decisione 40, nessuna proposta
      implementata.

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3180/3180 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `run-pointcloud.mjs` 36/36 (+2, con controprova) ·
`genesi-dxf-import.mjs` 11/11 normale (+1 KO atteso, difetto preesistente
non toccato, sotto `--controprova`) · `suite-collegate.mjs` 3/3 ·
`numeri-nei-documenti.mjs` 43/43 (415 banchi, copertura 1051/1051).
Numeri propagati con lo strumento: 3676→3678 prove (34→36 sull'addendo
`run-pointcloud`), decisioni aperte 26→27.

## Stato roadmap
Undicesimo giro di deep-pass QA/ricerca. Genesi ha ricevuto quattro
passate QA in questa sessione; Scudo due iterazioni UX; Terra la sua
prima ricerca continua di oggi.

## Prossimi passi
- **Prossimo passo atomico**: nessun finding di codice specifico in coda
  (la decisione 40 aspetta il fondatore). Aprire almeno tre nuovi
  cantieri paralleli su superfici non ancora fresche oggi: seconda
  iterazione UX su Terra o Deepwork ID (non ancora fatte in questa
  sessione), nuova ricerca continua a rotazione su Flotta o Genesi
  (Conti/Scudo/Sentinella/Campo/DeepworkID/Terra coperte oggi), quinta
  passata QA su un'app diversa da Genesi.
- Ogni mandato di ricerca/QA continua a includere il vincolo esplicito
  "non eseguire alcun comando git" e "non modificare il codice di
  prodotto — solo verificare e riportare".

## Blocchi
Nessuno.
