# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
85bc4045

## Completato
Unità 72 — Sentinella, `misureDelGiornoPerReclamo`: le letture di quel giorno
sui punti della stessa grandezza accanto a ogni reclamo, col verdetto dei
badge; «nessuna lettura» non è un verdetto. Riga `.rec-misure` nel registro.
run-kpi 2858, copertura 946/946.

## Imparato
- La dimostrazione aveva la risposta giusta scritta a mano e incompleta: la
  nota di x1 citava la lettura di V1 di cinque giorni prima, e il giorno del
  reclamo V2 aveva un superamento alle 10:25. Una funzione che guarda i dati
  dice di più di chi li ricorda.
- 64 su 70 è «vicino alla soglia», non «sotto»: la prima stesura della prova
  lo sbagliava e la regola dei badge (`statoMisura`) l'ha corretta — la
  ragione per cui il verdetto si prende da lei e non si riscrive.

- Un colore di stato usato come TESTO non è `--danger`: è `--ink-dg`. I temi
  chiaro e sole re-inchiostrano i token `--ink-*` e lasciano `--danger` al
  fondo dei badge; il banco del contrasto l'ha misurato (3,24 → 4,86).

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 04:26Z su `1fa39d0c`
(`scratchpad/giri/`, `leggi-giro.mjs`) quando `ultimo-exit.txt` compare.
Poi la voce aperta «SENTINELLA — «APERTO DA N GIORNI» E LA DATA DI CHIUSURA
DEL RECLAMO» (piccola: `apertoDaGiorni` sulla riga aperta, `chiusoIl` scritto
dalla pagina alla chiusura, il riepilogo dice il più vecchio aperto), oppure
l'undicesima tranche B3 su Genesi.

## Blocchi
Nessuno.
