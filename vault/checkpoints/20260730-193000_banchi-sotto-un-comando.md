# Checkpoint — i banchi del browser sotto un comando solo, e «REPORT» rientra

- **Tipo**: infrastruttura di prova + difetto di impaginazione chiuso
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `87d200d` (barra), `tutti.mjs` nello stesso lavoro

## `tests/browser/tutti.mjs`

I banchi del browser non girano in CI (servono Chromium e un server statico) e
quindi giravano solo se qualcuno se li ricordava. Un elenco che sta nella testa
di chi l'ha scritto, alla settimana dopo non esiste: adesso l'elenco è un file.

Lancia in fila i sette banchi — campi interi, contrasto, unità in maiuscolo,
collegamenti della vetrina, più le tre controprove — e stampa un riepilogo.
**Alza da sé il server statico** se non risponde: non è comodità, è che un banco
che pretende una condizione non ovvia viene lanciato una volta e poi mai più.

## Il difetto della barra

Su un telefono da 390 px, in Sentinella i sei nomi delle sezioni fanno **395 px
dentro una barra da 374**: «REPORT» finiva a 404, cioè fuori dallo schermo,
invisibile e non toccabile. Le altre app ci stanno solo perché hanno nomi più
corti — è fortuna, non progetto, e Conti ne ha sette.

Sotto i 400 px spaziatura e corpo si stringono quel tanto che basta: una voce di
navigazione o si legge intera o non serve. «Report» adesso finisce a 381.

## Due errori miei, dello stesso tipo: guardare il pezzo sbagliato

1. La prima misura chiedeva a ogni **bottone** se il contenuto traboccava, e
   rispondeva «tutto a posto»: i bottoni non sono tagliati, è la loro **somma**
   a non entrare nella barra. Misurare il pezzo sbagliato assolve.
2. La prima correzione l'avevo scritta in `dw-app-shell.css`, ma la regola che
   vince sta in `dw-app-ui.css`, caricato dopo. Una regola nel foglio sbagliato
   non fa niente **e sembra fatta**: tolta da lì.

## Prossimo passo atomico

Il cantiere di Flotta ha lasciato una decisione da prendere e l'ha scritta: nei
badge di Flotta c'è «SCADUTA (+20 h)», con la «h» in maiuscolo di proposito nel
modulo dati e un test che la tiene ferma. «h» non è ambigua come «m³», e non è
né in `avvolgiUnita` né nell'elenco del banco. **Va decisa una volta per tutte
le app**: o entra nell'elenco (e allora una riga in `shared/` e una nel banco), o
si dichiara esclusa con la ragione scritta accanto. Oggi è nel mezzo, che è il
posto peggiore.

## Aperto

- Il giro completo di `tutti.mjs` era ancora in corso alla scrittura di questo
  checkpoint: i singoli banchi erano tutti verdi poco prima.
