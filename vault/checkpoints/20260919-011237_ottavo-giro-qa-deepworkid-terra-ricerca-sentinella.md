# Checkpoint — 2026-09-19T01:12:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9dfe4277 — fix(terra): csvRilievi/parseRilieviCsv non portavano affatto `rilevatore`

## Cosa è stato completato
Tre cantieri in parallelo (direttiva 26/07): QA su Deepwork ID (ridispatchato
dopo l'interruzione del giro precedente), seconda QA su Terra, ricerca
continua su Sentinella. Ogni finding verificato riga per riga contro il
codice attuale prima di correggere.

- [x] **Deepwork ID** (`8d063397`): `profilo.html` offriva "Invita
      nell'organizzazione attiva" (campo email + bottone) sempre attivo a
      qualunque membro connesso, senza leggere `id.role()` — stessa
      correzione già fatta in `admin.html` il 18/09 ("un bottone che
      promette un'azione che fallirà sempre"), qui mancava del tutto. Il
      server (`inviteMember`) rifiuta sempre chi non è owner/admin (già
      provato da `run-fns.mjs`): non una falla di sicurezza, ma un membro
      semplice vedeva una funzione promessa che avrebbe sempre fallito.
      Disabilitato lo stesso modo di `admin.html`; esteso `id-stati.mjs`
      con lo stesso scenario e la sua iniezione per la controprova.
- [x] **Terra** (`9dfe4277`): `csvRilievi`/`parseRilieviCsv` non portavano
      affatto il campo `rilevatore` (chi ha eseguito il rilievo, mostrato
      nel verbale per l'ente come "Eseguito da") — non una riga che non lo
      passava (come `tolleranzaPct` l'11/09), ma nessuna colonna per lui
      nel formato del file. Un rilievo scaricato come copia di sicurezza
      (decisione 12a) e ri-caricato (cambio dispositivo) tornava "non
      indicato" nel verbale. Aggiunta come nona colonna, letta e passata
      nell'import CSV, compatibile all'indietro (file a otto colonne
      restano leggibili).
- [x] **Ricerca su Sentinella**: taratura strumenti — la copertura/validità
      retroattiva è già solida (`coperturaTaratura`), ma manca la
      registrazione dell'incertezza di misura del certificato e uno stato
      "incerto" quando l'intervallo di incertezza attraversa la soglia.
      Non implementato: richiede prima la lettura del testo primario di
      ISO/IEC 17025 e UNI 9916 (WebFetch bloccato) e un caso reale di
      formato del certificato — appeso in
      `docs/RICERCA_CONTINUA_SENTINELLA.md` (`4f1d7f3c`).

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3180/3180 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `copertura-funzioni.mjs` 1051/1051 (terra 106/106) ·
`numeri-nei-documenti.mjs` 43/43 (413 banchi) · `suite-collegate.mjs` 3/3 ·
`nomi-doppi.mjs` 49 nomi, 0 da sistemare · `iniezioni-fresche.mjs` 701/701 ·
`id-stati.mjs` 36/36 normale, 22 KO sotto `--controprova` (18/18 iniezioni
applicate). Numeri propagati (3.676 prove, 3180 addendo run-kpi) con
`numeri-nei-documenti.mjs` rilanciato fresco.

## Stato roadmap
Otto giri di deep-pass QA/ricerca oggi/stanotte. Sei app + Deepwork ID
hanno ricevuto almeno un giro dedicato; alcune due o tre.

## Prossimi passi
- **Prossimo passo atomico**: il giro `giro-node.mjs` completo è stato
  rilanciato fresco dopo questa unità (verificare il suo output in
  `/tmp/.../scratchpad/giro-node-3.log`, o rilanciarlo se il file non
  esiste più per via di un riavvio) e propagare l'eventuale nuovo numero
  di "asserzioni del giro completo" (`docs/DEVELOPMENT.md`/
  `docs/STATO_PRODOTTO.md`, oggi dichiarato 4155 ma non ancora rimisurato
  dopo l'ottavo giro). Poi aprire almeno altri due cantieri paralleli:
  una nuova ricerca continua a rotazione (Campo e Deepwork ID non ne
  hanno ancora avuta una oggi) e/o una seconda iterazione UX con
  screenshot.
- Il giro di convergenza visivo lungo (PID 688) resta perso in uno dei
  riavvii del contenitore: se serve un giro visivo completo va rilanciato
  da zero, non è urgente.

## Blocchi
Nessuno.
