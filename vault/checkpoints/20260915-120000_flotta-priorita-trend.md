# Checkpoint — 2026-09-15T12:00:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
81d0b99b

## Cosa è stato completato
Decima unità del ciclo odierno: `prioritaOperative` (Flotta) estesa con due
parametri facoltativi (`rifornimenti`, `interventi`) — un mezzo OPERATIVO
con consumo o costo per intervento sopra la sua tolleranza dichiarata entra
in lista come voce categoria "trend" (gravità "warn"), riusando
`consumoControStoria`/`costoControStoria` senza riscriverne una copia. Un
mezzo fermo o in verifica non riceve il trend (è già in cima per una
ragione più urgente). Senza i due parametri il comportamento resta quello
di prima, parola per parola. Wired in `index.html`.

Chiude la lacuna 2 del sesto giro di ricerca su Flotta (15/09) — dichiarata
"piccola" dall'agente una volta che i due segnali di trend esistessero, e
le due unità precedenti di questo ciclo (costo contro storia, e prima
ancora il consumo) li avevano appena costruiti. **Il sesto giro di ricerca
su Flotta è ora chiuso su entrambe le sue lacune tradotte in codice**;
resta aperto solo il terzo segnale della lacuna 1 (frequenza fermi in
aumento/calo, richiede storicizzare `durataFermo`/`giorniFermo` come
serie — non fatto, dichiarato nel documento di ricerca).

Test: `run-kpi.mjs` +2 blocchi (3003→3005), con controprova (tolta la
guardia "solo mezzi operativi", confermata la caduta dell'asserzione sul
mezzo fermo, ripristinata e riverificata byte-identica con `diff`).

## Verifica
- `run-stile.mjs` e `sintassi-pagine.mjs` (giro completo): puliti prima del
  giro isolato
- Giro isolato su worktree pulita (`/tmp/wt-flotta-prio`, ora rimossa):
  39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni invariata (1001/1001): questa unità estende una
  firma esistente, non aggiunge una funzione nuova — misurato, non
  assunto per analogia con le unità precedenti
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1001/1001
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
- Push riuscito al primo tentativo: `c5e59b13..81d0b99b`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Sesto giro di ricerca (Flotta,
Sentinella, Deepwork ID) chiuso. Quinto giro di ricerca su Terra chiuso su
2 lacune su 3. Restano aperti: la lacuna 3 di Terra (finestra corta vs
lunga su `ritmoMedioAnnuo`), il terzo segnale della lacuna 1 di Flotta
(frequenza fermi), la Decisione 30 e i quattro punti Genesi in attesa del
fondatore — nessuno di questi va implementato senza conferma esplicita.
Nessun giro di ricerca continua è ancora stato lanciato su Conti o Campo
in questa sessione.

## Prossimo passo atomico
Aprire un settimo giro di ricerca continua in background su Conti o Campo
(nessuna delle due app coperta ancora in questa sessione), con mandato
mirato secondo la disciplina di CLAUDE.md (prima il mondo, poi il codice,
con le fonti citate e il delta fatto da chi ha il codice in mano — non
dall'agente). Nel frattempo continuare con la lacuna 3 di Terra
(`ritmoMedioAnnuo`: confronto fra finestra corta, es. ultimi 90 giorni, e
finestra lunga, per rilevare un'accelerazione o un rallentamento del
ritmo di scavo) come prossima unità di codice piccola, così il ciclo non
resta fermo fra un'unità e l'altra mentre la ricerca cammina.
