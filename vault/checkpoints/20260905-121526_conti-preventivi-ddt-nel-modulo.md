# Checkpoint — 2026-09-05T12:15:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e97fd82b — Conti: i preventivi e i DDT dalle pesate nel modulo — Conti è a zero
file composti nella pagina, 14 export su 14 dal modulo

## Completato
`csvProspettoPreventivi`, `csvProspettoDdt`, `nomeClienteOrdine` nel modulo di
Conti; la pagina chiama; la frase «N righe nel foglio» conta le righe del
file composto (contava un array della pagina che non c'era più: l'ha preso il
banco delle frasi). Censimento: `conti.prospettoDdt` verificato chiamando
l'export, `conti.prospettoPreventivi` censito (mancava).
Misure: run-kpi 2676/0; conti-documenti 81/81 + controprova 6/6;
conti-frasi-da-uno 41/41; nomi-liberi 26/0; iniezioni 525/525; copertura
867/867 (fondo Conti 176); giro `node` sulla copia: 38 comandi a posto,
asserzioni 3.589. Documenti: 3.157 prove, run-kpi 2676.

## Stato roadmap
Voce Flotta/Conti aperta per l'ultimo file: il libretto del mezzo di Flotta.
Il conto della giornata sui file composti nella pagina: Scudo 2, Campo 1
(la consegna), Flotta 7 su 8, Conti 6 su 6 — tutti saliti nel modulo, con la
prova in run-kpi e l'intestazione verificata chiamando l'export.

## Prossimo passo atomico
Il libretto del mezzo (`btn-sch-csv`, righe ~4950-5044 di
`apps/flotta/index.html`): ~60 righe di `R(sezione, voce, data, testo,
euro)` con `VUOTA(sez, frase)` per le sei sezioni vuote, che leggono
`oreMotoreTx`, `lavorazioneTx`, `MB`, la fotografia del mezzo `f`
(consumo, officina, fermi). Prima di muovere: leggere il blocco INTERO e
`libretto-vuoti.mjs` (righe 70-95: rimette due difetti nella pagina con
`rimetti` — vanno riancorati sul modulo, e quel banco applica per file?).
Poi `csvLibretto(mezzo, {...})` nel modulo con `R`/`VUOTA` dentro, la
pagina chiama, prova in run-kpi sulla dimostrazione (sei sezioni vuote
dichiarate su un mezzo nudo), censimento se il libretto è censito.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
