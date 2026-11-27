# Checkpoint — 2026-09-19T03:46:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
afd6d1af — fix(sentinella): una lettura senza taratura restava invisibile a schermo

## Cosa è stato completato
Tre cantieri in parallelo (direttiva 26/07): QA su Sentinella, ricerca
continua su Flotta, seconda UX su Conti. Ogni finding verificato
indipendentemente prima di agire. In più, lanciato in background il giro
completo del browser (`tutti.mjs`) su una worktree del commit `aade8904`
(ancora in corso a fine giro, si legge con `leggi-giro.mjs` quando finisce).

- [x] **Sentinella** (`afd6d1af`): `statoTaraturaStrumento` guarda solo il
      calendario di OGGI — uno strumento con un certificato scaduto nel
      2020 e uno nuovo aperto nel 2026 risponde "regolare" anche se una
      lettura fu presa nel 2025, in un buco senza nessun certificato
      attivo. Confermato sulla dimostrazione: "Vibrazioni V2 — confine
      Nord" ha esattamente questo caso, già dichiarato "scoperta" nel
      file per l'ARPA ma muto sullo schermo. Aggiunto `BADGE_LETTURE_
      SCOPERTE`, tenuto fuori da `STATI_TARATURA` (codominio dichiarato
      di un'altra funzione, regola 18) per non violarne il conteggio
      esatto; mostrato in aggiunta nella lista punti e nel Quadro.
      Dichiarata la nuova portata in `sonda-vuoto.mjs`.
- [x] **Ricerca su Flotta** (`19478bd6`): `propostaScorte` risponde solo
      a "quanto abbiamo consumato", mai a "quanto sappiamo già che
      consumeremo" dai tagliandi in agenda (SAP PM: "dependent
      requirements"). Costo Medio, non implementata.
- [x] **Conti**: seconda iterazione UX, nessun difetto sopra soglia
      trovato (contrasto 9 combinazioni, overflow, alone dinamico) —
      report onesto, nessuna unità aperta.

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3181/3181 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `suite-collegate.mjs` 3/3 · `iniezioni-fresche.mjs` 710/710 ·
`numeri-nei-documenti.mjs` 43/43 (423 banchi, copertura 1052/1052) ·
`copertura-funzioni.mjs` 11/11 · `sonda-vuoto.mjs` 15/15 ·
`sentinella-badge-scoperta.mjs` 5/5 normale, 1 KO/1 iniezione sotto
`--controprova`. Numeri propagati con lo strumento a ogni passo.

## Stato roadmap
Tredicesimo giro di deep-pass QA/ricerca. Sentinella ha ricevuto la sua
prima QA approfondita di questa sessione (oltre al fix occupato() di
inizio giornata); Flotta la sua prima ricerca continua oggi; Conti la sua
seconda iterazione UX (pulita).

## Prossimi passi
- **Prossimo passo atomico**: leggere l'esito del giro completo del
  browser quando finisce (`leggi-giro.mjs` sul log in
  `/tmp/.../scratchpad/giro-completo-19-0316.log`), verificando prima la
  sezione 0 (di quanti commit il branch è avanzato rispetto ad `aade8904`
  e se toccano le superfici misurate) prima di fidarsi di eventuali KO.
- Aprire almeno tre nuovi cantieri paralleli su superfici non ancora
  fresche oggi: Campo (QA o UX, non toccata da un po' in questa
  sessione), ricerca continua a rotazione su Scudo o Sentinella (le
  meno recenti), UX su Deepwork ID o Sentinella (mai iterate oggi).
- Ogni mandato di ricerca/QA continua a includere il vincolo esplicito
  "non eseguire alcun comando git" e "non modificare il codice di
  prodotto — solo verificare e riportare".

## Blocchi
Nessuno.
