# Checkpoint — Genesi: i comandi del Progetto 2D alti quanto un dito

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): i comandi del Progetto 2D
alti quanto un dito…»). Il precedente, `2fe759db` (la colonna del Progetto
2D), è confermato dal giro `node` completo: 47 comandi a posto, 4523
asserzioni, uscita 0.

## Che cosa è stato fatto
- Misurato: 49 comandi su 71 del Progetto 2D sotto i 44×44 px (`--tap` dello
  stile condiviso). I peggiori: occhio e lucchetto dei livelli, 17×17.
- Pagina (solo CSS, in fondo al foglio dove vince la cascata): altezza e
  larghezza minime di 44 px per i comandi centrati, quelli in `#d2-altri`,
  il comando «Simula», le intestazioni delle sezioni, i livelli, gli
  strumenti, annulla/ripeti, il gettone dei materiali, occhio e lucchetto. A
  320 px gli strumenti prendono la riga intera. Da 49 a 0 sotto misura.
- Banco `genesi-colonna-progetto.mjs`: una domanda in più (il dito), 15 → 19
  controlli; controprova 6 difetti rimessi su 6, cadono 12.
- Scatti a 430 e 320 guardati prima e dopo: stesso carattere, pagina più
  lunga di ~390 px.
- Rigirati i banchi del browser di Genesi sull'albero vivo: i quattro più
  vicini alla modifica prima del commit (esito nel messaggio del commit); gli
  altri ~50 in coda — il loro esito va letto in
  `scratchpad/scatti/tocco/esiti.txt` (o rilanciati) e sta nel checkpoint
  SUCCESSIVO, non qui.
- Numeri: invariati (nessun banco nuovo, nessuna prova `node` nuova): giro
  `node` 4523 su 47 comandi, 465 esecuzioni nel browser.

## Stato roadmap
Chiusa «i comandi del Progetto 2D alti quanto un dito»; E7 resta aperta con
la nota di ciò che manca (Home, finestre, comandi sopra il 3D).

## Prossimo passo atomico
**Le stesse due domande (bordo e dito) sul resto di Genesi.**
1. PRIMA: leggere l'esito dei banchi di Genesi lasciati in coda
   (`scratchpad/scatti/tocco/esiti.txt`; se lo scratchpad non c'è più,
   rilanciare `for p in apps/deepwork-id/tests/browser/genesi-*.mjs; do node
   $p; echo "$p $?"; done`). Un KO lì è un effetto dei comandi più alti: va
   letto il banco (probabile una misura a pixel fissi), non allentato.
2. Misura in scratchpad (`scatti/domanda.mjs` e `scatti/tocco.mjs`, se ci
   sono ancora; se no sono 40 righe: per ogni `button, input, select, a[href],
   summary` visibile dentro un contenitore, rettangolo vs bordi e vs 44×44):
   su `#scr-home`, sulle finestre aperte una alla volta (`#cmpModal`,
   `#riconModal`, `#sigModal`, `#sitoModal`, `#sentModal`, la scheda del foro
   `#d2-insp`, la tabella dei fori) e sui comandi sopra la scena 3D
   (`#topright`, `#cams`, `#tlrow1`).
3. Correggere nel CSS della pagina, estendere `genesi-colonna-progetto.mjs`
   con le stesse due domande sulle superfici nuove (una domanda per
   superficie, col suo denominatore), scatti guardati.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
