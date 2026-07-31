# Checkpoint — la strada da cui entrano i numeri dello strumento

**Commit:** `6a5c697`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Correzione al messaggio del commit precedente

Il commit `6a5c697` dice «Sentinella 77 → **94** su 107». Contato dopo,
sono **89**. Il numero l'ho scritto a stima invece di rileggerlo: è
esattamente la cosa che `CLAUDE.md` dice di non fare — *il messaggio del
commit si scrive DOPO aver letto l'esito*. Il conteggio vero, ottenuto
cercando `sentinella.<nome>` in `run-kpi.mjs`, è **89/107**.

## Che cosa è stato fatto

17 prove sull'**import dal sismografo** e sulla **serie storica** di
Sentinella. È la sorgente dei numeri che finiscono nel report per l'ente,
ed è da qui che il 31/07 è uscito un difetto vero — una misura che spariva
dal report, annunciata all'utente come «1 doppione scartato».

**Il lettore CSV.** Riconosce da solo `;`, `,` e TAB. Le virgolette
proteggono il separatore e sé stesse: senza, un «b;c» dentro un campo
diventerebbe due colonne e da lì in poi tutta la riga scivola — la data
finisce nella colonna dell'ora. Regge l'a capo dentro un campo quotato, il
BOM di Excel, le fine riga di Windows, e butta le righe vuote.

**Le date.** Due numeri di due cifre si leggono **giorno/mese**,
all'italiana: leggerle all'americana sposterebbe le misure di mesi interi
dentro un documento che va all'ente. E una data che non esiste viene
**scartata, non «corretta»**: il 31 febbraio non è il 3 marzo, e
correggerlo in silenzio metterebbe nel registro una misura in un giorno in
cui non è stata fatta.

**L'ora.** Solo i due punti la separano, perché col punto «12.07» è la
data. Le 25 e il minuto 75 non passano.

**La firma del doppione.** Stessa data, stessa **ora**, stesso valore. È
il punto esatto del difetto di ieri: quando l'ora veniva persa, due misure
diverse dello stesso giorno diventavano un doppione. La difesa vera sta a
monte (l'ora si legge anche dalla cella della data); questa prova blinda
che **l'ora entri nella firma**.

## Controprova, e la seconda cosa da tenere

Quattordici difetti in una copia del modulo: **14 su 14** fanno cadere la
prova col loro nome.

Uno però è caduto **solo togliendo tutto lo strato**. Il BOM è protetto da
**due guardie indipendenti**: il `replace(/^﻿/, "")` in testa a
`leggiCsv` **e** il `trim()` su ogni cella — perché `U+FEFF`, per
`String.prototype.trim()`, è uno spazio. Togliendo solo il `replace` la
prova non cadeva.

È la causa 2 di `CLAUDE.md` (difesa in profondità), e stavolta il banco
l'ha resa visibile: adesso stampa **quante guardie ha tolto**
(`2 guardie tolte`). E nella prova c'è scritto, per chi domani volesse
«semplificare» togliendo il `replace`: a reggere resta il `trim`.

## Numeri

- Sentinella: **77 → 89 funzioni coperte su 107**
- `run-kpi.mjs`: **897 → 914**; totale `node`: **1.180 → 1.197**

## Stato del giro del browser

In corso, settimo banco su diciannove (collegamenti · controprova).

## Prossimo passo atomico

Restano scoperte in Sentinella 18 voci, quasi tutte del **ponte con
Scudo** e delle **volate previste/eseguite**: `ponteScudo`,
`volataPrevista`, `volatePreviste`, `volateEseguite`,
`etichettaStatoVolata`, `PPV_STRUMENTO`, `VOL_ESEGUITA`,
`CSV_VOLATE_INTESTAZIONE`. Alcune sono già coperte di rimbalzo dai test
del ponte scritti ieri, ma non chiamate per nome: vanno guardate una per
una prima di scrivere, perché una prova che ripete una prova esistente
alza il totale senza alzare la difesa.

Poi **Scudo** (55/71) e **Terra** (31/39).

## In sospeso, con la sua ragione

La correzione di `messaggioNumero` scritto due volte
(`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`): aspetta la fine del giro del
browser perché tocca cinque moduli dati.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
