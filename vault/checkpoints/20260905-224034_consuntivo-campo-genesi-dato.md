# Checkpoint — 2026-09-05T22:40:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3671fa90 — Il consuntivo di carico da Campo a Genesi come dato

## Completato
`CONSUNTIVO_COLONNE`, `normalizzaPiano`, `pianoConsuntivoCsv` in `shared/dw-ponti.js`
(Campo ri-esporta per identità); `pianoCampo()` nella porta live di Genesi
(seconda istanza sull'appId di Campo) e il bottone «Leggi il consuntivo da
Campo (organizzazione)» nella riconciliazione, solo in live. run-kpi 2742,
copertura 904/904 (campo 132, dw-ponti 79), giro `node` sulla copia: 40
comandi a posto. Mappa: 15 ponti di dati, ponti di file censiti a 4.

## Stato roadmap
Voce `[x]` «IL CONSUNTIVO DI CARICO DA CAMPO A GENESI COME DATO».

## Prossimo passo atomico
Il ponte gemello, nell'altro verso: Genesi→Campo, il PIANO di carico come
dato (oggi solo file: `parsePianoCsv` in Campo). Forma da copiare: il 3e.
(1) leggere in `genesi.html` il bottone che esporta il piano per Campo (quali
colonne scrive: foro, x, fila, prof, prog, borr, rit, id_foro…) e in
`campo-data.js` `parsePianoCsv` (quali legge); (2) la forma del record in
`shared/dw-ponti.js` — `pianoDaGenesi(righe, meta)` — e in Genesi una
collezione `piani` (chiave `genesiPiani`, un documento per esportazione, col
codice della volata) scritta dal bottone oltre al file; (3) in Campo la
porta live legge `piani` di Genesi con la seconda istanza (forma di
`nuvoleGenesi`), la pagina mostra «Piani da Genesi» accanto a «importa da
CSV» e caricarne uno fa la STESSA scrittura dell'import (rimuove il vecchio
`pianocarico`, aggiunge le righe); (4) la prova che dal ponte e dal file
esce lo stesso piano riga per riga; (5) banco del browser con due pagine
nello stesso contesto (in locale Campo legge la chiave `genesiPiani`, come
Sentinella legge `genesiPreviste`); (6) mappa: 16 ponti, ponti di file 1.

## Blocchi
Nessuno.
