# Checkpoint — 2026-09-18T04:12:50Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3648bfcc

## Cosa è stato completato
Seconda delle tre unità correlate (Terra ✅, Sentinella ✅, Campo in corso)
preparate insieme e committate una per una con verifica isolata separata.

Sentinella, quarto giro di deep-pass (agente ae91d1f1bb713478c): due delle
quattro chiamate a `misuraFuoriCondizioni` (conferma di scrittura di
"Registra misura", anteprima import CSV) non passavano il terzo argomento
— il ponte meteo con Campo — mentre le altre due (scheda del punto,
report) lo passavano già dal terzo giro (17/09). Corretto in
`apps/sentinella/index.html` con lo stesso pattern già in uso. Rafforzato
il test di censimento in `run-kpi.mjs`: prima contava solo "≥3 chiamate"
senza guardare il contenuto di ciascuna, ora pretende il terzo argomento
su ogni riga che chiama la funzione (così la stessa lacuna non può
riformarsi su un quinto punto futuro senza che il test se ne accorga).

Nessuna nuova unità di test (solo assertion aggiuntive su un test
esistente): i numeri dei documenti erano già corretti, nessun
aggiornamento necessario. Giro isolato: 41/41.

## Stato roadmap
Vedi il checkpoint precedente (20260918-040510) per l'elenco completo dei
difetti confermati e ancora da correggere/committare (Conti, Genesi,
Campo).

## Prossimo passo atomico
Committare l'unità Campo (l'ultima delle tre): a questo punto il working
tree corrisponde ESATTAMENTE allo stato finale desiderato per
`apps/campo/campo-data.js`, `apps/campo/index.html`,
`apps/deepwork-id/tests/browser/campo-foglio-turno.mjs` e
`apps/deepwork-id/tests/run-kpi.mjs` — non serve più ricostruire nessun
file a strati, basta `git add` normale su questi quattro file. Passi:
1. Costruire una worktree isolata da HEAD, `git diff --cached | git apply`
   (o semplicemente copiare i quattro file, dato che non ci sono più altre
   unità sovrapposte), `git add -A`, lanciare `giro-node.mjs`.
2. Aggiornare i numeri nei documenti (KPI sale di 2 unità di test nuove:
   "rapportoGiornata porta le segnalazioni" e "il giudizio di idoneità
   arriva in entrambi i documenti" — quindi `run-kpi` 3125→3127, somma
   3.619→3.621, e il numero di esecuzioni browser sale di 2 per le nuove
   asserzioni dentro `campo-foglio-turno.mjs`, che non è una nuova
   *esecuzione* ma resta lo stesso banco: verificare comunque il totale
   `Asserzioni eseguite dal giro` leggendolo, non a memoria).
3. Rilanciare il giro isolato con i documenti corretti fino a quando
   `numeri-nei-documenti.mjs` passa e il totale stampato coincide con
   quello scritto nei documenti (di solito serve un secondo giro, perché
   il totale del giro include le ~43 asserzioni di
   `numeri-nei-documenti.mjs` stesso solo quando quella suite passa).
4. Commit (`git commit -F`), checkpoint, push.
5. Poi Conti (`registroVendite`) e Genesi (`D2.tratti`), poi proseguire la
   rotazione di deep-pass/ricerca continua. Mantenere ≥3 cantieri
   paralleli.

## Blocchi
Nessuno.
