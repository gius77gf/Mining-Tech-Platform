# Checkpoint — 2026-09-06T00:39:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ce9326fa — Scudo: le versioni di un documento

## Completato
Un documento nuovo dello stesso tipo e ambito CHIEDE se sostituisce quello in
archivio; il vecchio resta con `stato: "sostituito"` (neutro, `superato`, non
un problema), il nuovo porta `sostituisce`; `catenaDocumento`/`descriviCatena`
sotto la riga; il DSS conserva la revisione precedente in `dssStorico`.
run-kpi +11 (2774); banco `scudo-versioni-documenti.mjs` 46 ok, controprova
14/46 (3/3 per file), 259 esecuzioni / 109 file; copertura 920/920 (fondo
Scudo 213). Il banco ha preso un difetto vero (la data «precedente» letta da
`doc` dopo la scrittura). Docs: CONCORRENTI_SCUDO riga a C'È, B4 scudo 4 e
totale 39, mondo in RICERCA_CONTINUA_SCUDO.

## Stato roadmap
Voce `[x]` «LE VERSIONI DI UN DOCUMENTO IN SCUDO (06/09, notte)».

## Prossimo passo atomico
La prossima riga della B4 (39 confermate assenti: campo 11 · sentinella 11 ·
conti 5 · flotta 4 · terra 4 · scudo 4) che il codice può colmare senza
hardware, backend o una decisione commerciale. Le quattro di Scudo rimaste
sono report PDF delle ispezioni (c'è già la stampa @media print di due
fogli: guardare `stampaVerbale` e `costruisciCartella` prima di dire che
manca), export Excel, notifiche automatiche (backend) e app offline (service
worker: è una decisione di piattaforma). Le candidate NON di Scudo si
prendono dalle sezioni «CONFERMATE ASSENTI» / «CONFERMATO ASSENTE» dei
documenti dei concorrenti (i sei documenti usano notazioni diverse: si legge
il documento, non si grepa una parola). Procedura come sempre: rifare la
prova col comando; cercare il MECCANISMO nel modulo; funzione provata in
scratchpad; record composto nel modulo; prove in run-kpi PRIMA del
riepilogo; banco con controprova per file registrato in tutti.mjs; scatti
guardati; pin nei quattro documenti; giro node sulla COPIA; commit con -F;
checkpoint; push.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore.
