# Checkpoint — 2026-09-05T22:32:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
82bcb99d — Il ponte 3e: la volata prevista da Genesi a Sentinella senza il file

## Completato
`previstaDaGenesi` in `shared/dw-ponti.js`; Genesi collezione `previste` e
scrittura dal bottone «per Sentinella»; Sentinella `previsteGenesi`,
`previsteDaChiave`, `previsteNuove`, `accogliPrevista`, blocco «Previste da
Genesi» nel registro; `parseVolateCsv` per nome (il buco delle due code).
run-kpi 2739, copertura 907/907, banco `ponte-genesi-sentinella.mjs` (30,
controprova 2/2), giro `node` sulla copia: 40 comandi a posto. Mappa: 14
ponti di dati, 0 sovrapposizioni non collegate. Scatto guardato.

## Stato roadmap
Voce `[x]` «IL PONTE 3e — la volata prevista da Genesi a Sentinella SENZA il
file»; la mappa aggiornata nella sua tabella.

## Prossimo passo atomico
Il ponte 3e ha un lato ancora aperto, scritto nella mappa: «il terzo lato:
Campo registra il turno vero, e nessuno confronta il progettato con il
reale». PRIMA di costruire: leggere `docs/MAPPA_ECOSISTEMA.md` §3e e §3f e
cercare nel codice CHI oggi confronta una volata prevista con quella
eseguita — `scartoPpvVolata` e `confermaVolataEseguita` in Sentinella (che
confrontano PPV prevista e misurata, e fori/chili di progetto con quelli
dichiarati alla conferma) e `riconciliazioni` di Genesi (`riconStorico`,
prev/real) — e dire con la misura se il confronto progettato/reale ESISTE
già in due posti (allora è un ponte fra Genesi e Sentinella sulla
riconciliazione, non un pezzo nuovo) o se manca il lato di Campo (il
turno vero: `volateDelGiorno` in `dw-ponti` e la consegna di turno P6). Poi
l'unità più piccola che chiude UNA direzione, con la riga della mappa.
In alternativa: la passata in profondità su Genesi (l'unica app che il
banco del contrasto non misura su tre temi) — aprire ogni schermata,
GUARDARLA, cercare i numeri tranquilli.

## Blocchi
Nessuno.
