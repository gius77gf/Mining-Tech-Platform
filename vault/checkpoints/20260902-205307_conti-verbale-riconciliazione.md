# Checkpoint — 2026-09-02T20:53:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d24d017c — Conti: il verbale di riconciliazione, il divario scritto con la sua causa

## Completato
- `verbali` in Conti: `CAUSE_DIVARIO`, `causaDivario`, `verbaleDelPeriodo`
  (periodo esatto, ultimo scritto, allora/adesso), `storicoVerbali` (passo e
  verso); demo con un verbale coerente per prova; `+null` non è zero.
- Report: riquadro del verbale sotto «Cavato contro venduto», «Scrivi il
  verbale» (tendina delle cause + nota), storico con ▲▼=, segno detto a parole.
- Banco `conti-verbale.mjs` 13/13, controprova cade; run-kpi 2448; copertura
  conti 146; giro node verde dopo i conti (219 esecuzioni, 89 file, 3.341
  asserzioni) e una parola cambiata in una causa («senza» è nel lessico
  dell'assenza di `sonda-vuoto`: la causa lo dice con altre parole).
- Ricerca del giorno: candidato 5 chiuso; restano 2, 3 e la metà del 6.

## Prossimo passo atomico
Tre strade, in ordine: (1) il verbale anche per «Prodotto contro venduto»
(`tipo: "prodotto"`, le funzioni lo sanno già: `verbaleDelPeriodo(…,
"prodotto", c.divarioT)` e `storicoVerbali(VER, "prodotto")`; manca solo il
riquadro in `renderProdottoVenduto` con la stessa forma — un'ora); (2) la
seconda passata in profondità su Conti, il cui Report oggi ha guadagnato
due riquadri (aprire ogni schermata, premere ogni export, cercare i numeri
tranquilli — in particolare il verbale con un periodo che NON ha confronto);
(3) il candidato 2 della ricerca (densità in banco per litotipo nel listino,
per convertire il cavato di Terra in tonnellate e chiudere il triangolo su
una sola unità) — costo medio, va progettato in scratchpad prima.

## Blocchi
Nessuno.
