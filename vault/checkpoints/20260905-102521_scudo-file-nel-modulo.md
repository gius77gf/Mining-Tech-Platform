# Checkpoint — 2026-09-05T10:25:21Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
52cb2fdc — Scudo: i due file composti nella pagina salgono nel modulo — il
prospetto delle azioni e il riepilogo dei near-miss si provano anche con node

## Completato
`csvProspettoAzioni`, `csvRiepilogoNearMiss`, `etichettaPeriodoNearMiss` nel
modulo di Scudo; la pagina chiama. Censimento delle intestazioni: i due file
verificati chiamando l'export, e «prospettoIndici» (nome sbagliato, verde
per caso) rinominato sul file vero. Sette iniezioni del banco riancorate sul
modulo; una scritta senza «NOME = » davanti (il preambolo di
`iniezioni-fresche` la prendeva per una dichiarazione doppia e la tabella
COME_LIVE risultava illeggibile).
Misure: run-kpi 2660/0 (+3); scudo-documenti 89/89 sano e --live,
controprova 43 caduti con 27/27; iniezioni-fresche 525/525, 0 illeggibili;
copertura 831/831, fondo Scudo 197; giro `node` sulla copia: 38 comandi a
posto, asserzioni 3.573. Documenti: 3.141 prove, run-kpi 2660.

## Stato roadmap
Voce Scudo del 05/09 aggiunta e chiusa.

## Prossimo passo atomico
La stessa domanda su **Campo**: `grep -n "window.open\|\.print()\|download *=" apps/campo/index.html`
e per ogni uscita trovare chi compone le righe. Il foglio di consegna del
turno (`btn-consegna`, `.txt`) è il candidato: ha già `lavoriNonConclusi` e
`testoSegnalazioniTurno` nel modulo ma la composizione del testo sta nella
pagina — se è così, `testoConsegnaTurno(…)` nel modulo con prova in run-kpi,
riancorando le iniezioni di `campo-foglio-turno.mjs` (COME_LIVE compreso).
Prima di scrivere: leggere il blocco intero del bottone e la tabella delle
iniezioni del banco, e NON citare nelle iniezioni una stringa preceduta da
«NOME = ». Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
