# Checkpoint — 2026-09-06T08:02:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8895a681 — Scudo: il verbale di ispezione su carta

## Completato
`fogliaIspezione` nel modulo (forma della cartella; voci senza esito contate
e in grassetto; non conformità senza azione = sezione vuota rossa), UN
disegnatore dei fogli a sezioni nella pagina, «Stampa il verbale» nel
pannello della checklist con la finestra che dichiara prima di stampare.
run-kpi +8 (2782) e le prove del punto unico adattate; documenti-dimostrazione
132; banco `scudo-verbale-ispezione.mjs` 46 ok, controprova 22/44; 261
esecuzioni / 110 file; copertura 921/921 (fondo Scudo 214). Docs:
CONCORRENTI_SCUDO riga a C'È, B4 scudo 3 e totale 38, mondo in
RICERCA_CONTINUA_SCUDO.

## Stato roadmap
Voce `[x]` «IL VERBALE DI ISPEZIONE SU CARTA (06/09, notte)».

## Prossimo passo atomico
Le tre righe rimaste di Scudo nella B4 sono export Excel (decisione di
formato: il CSV c'è ovunque), notifiche automatiche (backend) e app offline
(service worker: decisione di piattaforma) — nessuna si colma da sola in
un'unità. Si passa alle altre app: leggere le sezioni «CONFERMATO ASSENTE»
di `docs/CONCORRENTI_FLOTTA.md` (5: firma digitale, link fatture↔ordini,
unità di misura per mezzo…), `CONCORRENTI_CONTI.md` (8: e-ticketing DDT,
ritenuta d'acconto, foto prodotto, ruoli…), `CONCORRENTI_TERRA.md` (4:
cut/fill, pit design…), `CONCORRENTI_CAMPO.md` (11: quasi tutte hardware) e
`CONCORRENTI_SENTINELLA.md` (11: quasi tutte hardware/rete). Candidata
concreta e contenuta: **Flotta «Link fatture a ordini di lavoro»** come
PONTE DI DATI Conti↔Flotta (una fattura passiva in Conti che porta
`ordineLavoroId`, e in Flotta l'ordine che la mostra): prima aprire
`costoOrdine` in `flotta-data.js` e i costi in `conti-data.js`
(`VOCI_COSTO` con `daMezzo` in `shared/dw-ponti.js` è il ponte esistente
«per non contare due volte») — cercare il MECCANISMO, non la parola
«fattura». Procedura come sempre: prova col comando, funzione in
scratchpad, record composto nel modulo o in shared, run-kpi PRIMA del
riepilogo, banco con controprova per file registrato in tutti.mjs, scatti
guardati, pin, giro sulla COPIA, commit con -F, checkpoint, push.
⚠️ «Unità di misura per mezzo» (ore/km) è un cantiere da PIÙ unità (266 +
246 occorrenze di «ore» in modulo e pagina, misurato il 06/09): non si apre
a fine ciclo, si apre a inizio blocco con una mappa dei lettori.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore.
