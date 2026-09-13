# Checkpoint — 2026-09-05T12:59:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3c1d97d1 — Terra: il riepilogo dell'anno e l'archivio dei fronti e rilievi nel
modulo — le sei app sono a zero file composti nella pagina

## Completato
`csvRiepilogoAnno(DEN, fronti, oggi)` e `csvFrontiRilievi(fronti, rilievi)`
con le costanti dell'intestazione, `MESI_NOME` ed `etichettaFronteDi` saliti
dalla pagina; run-kpi +2 (2681); censimento `terra.prospettoAvanzamento` e
`terra.prospettoFronti` verificati chiamando l'export (soglia 38 → 40,
pagine 0); fondo di copertura di Terra 80 → 86. La prova statica delle
sette celle del titolo legge le due celle del CSV nel modulo (terzo posto
della tupla). `terra-numeri-tranquilli` inietta per file, cinque
riancorate sul modulo (2, 6a, 6b, 6c, 7): 19 su 19 rimessi, 33 cadute su 73.
Iniezioni fresche 525/525. Pin: prove 3.162, asserzioni 3.594, copertura
881/881. Giro `node` sulla copia: 38 comandi a posto.

⚠️ La riga dei rilievi nel file esce dal più recente: la prima stesura della
prova leggeva gli indici nell'ordine di inserimento (R poi P) e cadeva su un
prodotto sano — corretta la prova, non il prodotto.

## Stato roadmap
Aggiunta la voce `[x]` «TERRA — il riepilogo dell'anno e l'archivio…» sotto
quella di Campo. La domanda «che cosa esce, e chi decide i suoi numeri?» è
chiusa su tutte e sei le app. Il core (`index.html` alla radice) ha un solo
CSV (`deepwork_fori_fronte`) e nessun modulo dati: detto in roadmap, nessun
cantiere a metà.

## Prossimo passo atomico
Terra, il verbale del rilievo: `fogliaVerbale(r)` nella pagina
(`apps/terra/index.html`, cerca `function fogliaVerbale`) compone la tabella
`dati = [[etichetta, testo], …]` con le funzioni del modulo
(`classeAccuratezza`, `bandaVolume`, `confrontoRilievi`, `provenienzaRilievo`)
ma le RIGHE — cioè le parole e i formati che l'ente legge — vivono nella
pagina, dove nessuna prova di run-kpi le vede (è lì che la quota grezza è
vissuta fino al 03/08). Stessa forma di `fogliaVolata` di Sentinella:
`verbaleRilievo(r, {rilievi, fronti, aut, oggi})` nel modulo che restituisce
`{titolo, righe: [[etichetta, testo, manca]], nonMisurati}`, la pagina
disegna e basta, prova in run-kpi (quota non dichiarata, volume non
leggibile, senza rilievo precedente, senza autorizzazione), iniezioni di
`terra-numeri-tranquilli` 6d riancorata sul modulo leggendo «N rimessi
davvero». Prima di scrivere: `grep -n "fogliaRelazione\|relazioneLotto"` —
la relazione del lotto ha GIÀ questa forma (`relazioneLotto` nel modulo),
quindi il verbale si allinea a lei, non si inventa.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
