# Checkpoint — 2026-09-05T16:59:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d5db85f8 — Conti: il DDT e il preventivo si compongono nel modulo — tre fogli su
tre fuori dalla pagina

## Completato
`fogliaDdt(p, {clienti})`, `fogliaPreventivo(o, {clienti, oggi})` ed
`ETICHETTA_STATO_PREVENTIVO` in `apps/conti/conti-data.js`; `fogliDdt` e
`stampaPreventivo` nella pagina disegnano e basta; il badge dello stato
legge le parole dal modulo. run-kpi +6 (2706), copertura Conti 180/180
(fondo 180). Banchi: `conti-stampe` (iniezione 5 sul modulo; 20/20, cp 6
rimessi / 10 KO voluti), `stampe-fs --solo=conti` 22/22,
`conti-frasi-da-uno` 41/41, `conti-documenti-che-escono` 81/81. Pin: prove
3.187, asserzioni 3.619, copertura 887/887. Giro `node` sulla copia: 38
comandi a posto. Scatti del DDT e della conferma d'ordine guardati.

⚠️ La prova statica «la pagina non compone più» aveva l'ancora «a chiamata»
troppo larga: quella parola sta anche nell'ELENCO a schermo. Un'ancora che
cerca la parola del foglio nella pagina intera accusa lo schermo.

## Stato roadmap
Voce `[x]` «CONTI — il DDT e il preventivo si compongono nel modulo» sotto
quella della fattura; la riga «restano fogliDdt e stampaPreventivo» chiusa
con ✅. Conti: tre fogli su tre e quattordici CSV su quattordici nel modulo.

## Prossimo passo atomico
Campo, il rapporto di giornata stampato (`apps/campo/index.html`, cerca
`window.print()</` — è la fine del template; il suo inizio è la funzione
che compone `<!DOCTYPE` per il rapporto, ~cento righe più su): undici
sezioni (checklist, meteo, personale presente, obiettivo, attività, fermi
per causale, disponibilità, foto, produzione, rapportini, chiusura e firme,
riaperture) composte nella pagina da funzioni del modulo (`paretoFermi`,
`appello`, `disponibilitaTurno`, `produzioneDi`, `formattaProduzione`,
`riaperture`). Stessa forma dei fogli di Terra: `rapportoGiornata(d, {…})`
nel modulo con sezioni `{titolo, colonne, righe, nota, vuota}` in testo,
la pagina tiene HTML e CSS. È il foglio più grande (~100 righe di
template): prima censire le iniezioni dei banchi
(`campo-numeri-tranquilli`, `campo-foglio-turno`, `campo-sentinella-frasi`,
`stampe-fs --solo=campo`) con
`grep -n "Fermi per causale\|Personale presente\|Rapportini\|Disponibilità del turno" apps/deepwork-id/tests/browser/*.mjs`
e riancorarle leggendo «N rimessi davvero». Se troppo grande per un'unità,
spezzare per sezioni (prima le tabelle coi numeri: fermi, disponibilità,
produzione, personale).
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
