# Checkpoint — 2026-09-05T10:57:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5c9a6d50 — Flotta: i costi e i fermi macchina si compongono nel modulo — due file
su otto, con le intestazioni censite e verificate chiamando l'export

## Completato
`csvCosti` e `csvFermiMacchina` (+ costanti delle intestazioni) nel modulo di
Flotta; la pagina chiama. Censimento: `flotta.costi` verificato chiamando
l'export, `flotta.fermi` censito (mancava). Banco
`flotta-documenti-che-escono` 79/79, controprova con l'iniezione dei fermi
riancorata sul modulo; `flotta-frasi-da-uno` 42/42.
Misure: run-kpi 2665/0 (+2); iniezioni-fresche 525/525; sintassi 34/0;
copertura 837/837 (fondo Flotta 111); giro `node` sulla copia: 38 comandi a
posto, asserzioni 3.578. Documenti: 3.146 prove, run-kpi 2665.
Due inciampi del ciclo, scritti perché non si ripetano: (1) la voce di
roadmap aperta senza la sua riga d'indice fa cadere il guardiano
dell'indice — la riga va aggiunta nel blocco dell'indice, e un sotto-punto
che comincia con «- \`» dentro la voce confonde; (2) un giro lanciato su una
copia con un numero sbagliato nei documenti si ferma da sé: prima di
lanciare il giro si lancia `numeri-nei-documenti` da solo (quaranta secondi).

## Stato roadmap
Voce Flotta del 05/09 APERTA: restano sei file nella pagina di Flotta
(registro-interventi, scadenze-di-legge, situazione, giri-macchina,
libretto, lista-della-spesa) e sei di Conti (incassi, clienti, costi,
listino_prezzi, pesate_ddt, preventivi), elencati nella voce con l'indice.

## Prossimo passo atomico
Prossimi due di Flotta, i più corti: `flotta-giri-macchina.csv`
(`btn-giro-csv`, riga ~4844: le righe da `CTR` con `statoControllo`-simile,
9 colonne) e `flotta-scadenze-di-legge.csv` (`btn-sca-csv`, riga ~4333:
`scadenzeOrdinate(SCA, new Date(), preavvisoSca)` più la riga «nessuna
scadenza registrata» per mezzo da `contaScadenzeMezzi`). Per ognuno:
funzione `csvX` nel modulo con la costante dell'intestazione, la pagina
chiama, prova in run-kpi sulla dimostrazione, riga nel censimento
`CSV_TABELLE` con `fonte:`, iniezioni dei banchi riancorate sul modulo (MAI
citando una stringa preceduta da «NOME = »). Prima: `numeri-nei-documenti`
da solo, poi il giro sulla copia. Alla prossima accensione della routine:
canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
