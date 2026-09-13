# Checkpoint — 2026-09-05T17:37:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
87d1d27b — Scudo: il verbale di consegna DPI e la cartella del lavoratore si
compongono nel modulo — i fogli stampati sono chiusi

## Completato
`fogliaVerbaleDpi(lav, {dpi, mansioni, oggi})` e `fogliaCartella(c, oggi)`
in `apps/scudo/scudo-data.js`; `costruisciVerbale` e `costruisciCartella`
nella pagina costruiscono il DOM e basta. run-kpi +5 (2717), copertura
Scudo 199/199 (fondo 199). Banchi: `stampe-fs --solo=scudo` 17/17 (cp 3
rimessi), `scudo-documenti` 89/89 (7, 13, 14 sul modulo; cp 27/27),
`scudo-numeri-tranquilli` 50/50 (n. 4 nei difetti del modulo; cp 12/12).
Pin: prove 3.198, asserzioni 3.630, copertura 890/890. Giro `node` sulla
copia: 38 comandi a posto. Scatti del verbale e della cartella guardati.

⚠️ `scudo-frasi-da-uno` e `campo-sentinella-frasi` NON alzano un server:
vogliono la porta posizionale di quello di `tutti.mjs`. Lanciati da soli
cadono con ERR_CONNECTION_REFUSED e non provano niente — non è un KO del
prodotto, e non li ho misurati.

## Stato roadmap
Voce `[x]` «SCUDO — il verbale DPI e la cartella del lavoratore si
compongono nel modulo» sotto quella di Campo. La domanda «chi decide i
numeri di ciò che esce?» è chiusa su CSV e fogli stampati di tutte e sei le
app (Flotta e il report di Sentinella stampano lo schermo, che è già del
modulo).

## Prossimo passo atomico
Il ponte Flotta→Conti che la routine chiama «a metà» è CHIUSO da giorni
(la mappa conta 13 ponti su 56, `confrontoCostiMezzi` letto da tutt'e due
le pagine): non riaprirlo. Prossima cosa, dalla lista della routine al
punto 2 — la passata in profondità su un'app — con un metodo nuovo che
oggi ha reso tanto: ogni foglio e ogni CSV adesso è una funzione pura, e
quindi si può fare il **giro completo dei documenti di dimostrazione
senza browser**: `node` che chiama OGNI `foglia*`/`csv*`/`rapportoGiornata`/
`prospettoDenuncia`/`testoConsegnaTurno` sulla dimostrazione di ogni app e
cerca i numeri tranquilli (uno «0», «€ 0,00», «0%», «—» dove il dato è
assente e non zero) e i singolari sbagliati («1 rilievi»). Scriverlo in
`apps/deepwork-id/tests/documenti-dimostrazione.mjs`, metterlo in
`npm test` e nel giro; stampare il denominatore (quanti documenti, quante
celle). Ogni difetto vero che trova → unità sua.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
