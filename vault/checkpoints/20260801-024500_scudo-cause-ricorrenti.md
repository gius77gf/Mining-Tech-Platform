# Scudo: le cause che si ripetono, e la soglia che ora vive in un posto solo

**Data:** 01/08/2026 · **App:** Scudo
**Unità precedente:** `20260801-023000_scudo-analisi-causa-strato-dati.md`

## Cosa è stato fatto

`analisiDiEvento`, `eventiSenzaAnalisi`, `causeRicorrenti` — e
`MIN_TENDENZA`/`troppoPochiPerTendenza`, che è la parte che conta.

**`eventiSenzaAnalisi` è quello che rende la funzione viva invece che
facoltativa.** Senza un conto degli eventi rimasti senza un perché, l'analisi
la fa chi ha voglia e il registro si riempie di eventi muti. Gli infortuni con
assenza vengono per primi — sono quelli su cui l'ente chiede conto — poi gli
altri, poi i near-miss.

**`causeRicorrenti` risponde alla domanda per cui la scheda esiste** (quali
cause tornano), e la circonda della guardia giusta: tre analisi su venti **non**
dicono «la causa principale è organizzativa», dicono che sono state fatte tre
analisi su venti. Le righe si mostrano lo stesso — non si nasconde il poco che
c'è — ma `leggibile` è `false` e la ragione dice quante ne servono.

## ⛔ La soglia era scritta a mano, e stava per diventare due

`riepilogoNearMiss` aveva `pochi: list.length < 5` **inline**. Ricopiare quel 5
in `causeRicorrenti` avrebbe prodotto due numeri che divergono al primo
ripensamento — cioè due schermate della stessa app che dicono «pochi dati» a
soglie diverse, senza che nessuno se ne accorga.

Estratta in `MIN_TENDENZA` + `troppoPochiPerTendenza`, con **due chiamanti e
una definizione**. E la prova non si accontenta del comportamento: chiama
`riepilogoNearMiss` con quattro segnalazioni e pretende `pochi === true`,
così se qualcuno gli rimettesse un 5 suo la cosa si vede.

La controprova lo conferma in modo netto: cambiando la soglia dentro
`riepilogoNearMiss` cade **anche una prova preesistente**, scritta prima di
questa unità. È la dimostrazione che le due funzioni condividono davvero la
stessa regola, non che si somigliano.

## Le prove

Quattro `test` nuovi (**1072 → 1076**), tre difetti rimessi e **quattro** prove
cadute:
- `leggibile` sempre vero → la tendenza letta su due punti;
- la soglia riportata in casa dentro `riepilogoNearMiss`;
- le analisi **orfane** (che puntano a un evento inesistente) contate come
  eventi analizzati, cioè un numeratore gonfiato.

Stato: `run-kpi` **1076**, prove `node` **1.434**, copertura **452/452**,
`run-stile` 268, sonda del vuoto 7/7.

⚠️ E di nuovo un conteggio scritto a occhio nei documenti sarebbe stato
sbagliato: la copertura l'ho **letta dal censimento** invece di sommarla a
mente (452, non 447 + le nuove).

## Prossimo passo atomico

**La schermata dell'analisi** in Scudo: la catena dei perché dentro la scheda
dell'evento — che parte da **tre** righe e cresce, perché cinque caselle vuote
si riempiono per farle sparire — la famiglia della causa, il collegamento
all'azione correttiva che esiste già, e nel Quadro il conto degli **eventi
gravi senza un perché**.

In parallelo resta pronta la **schermata dei lotti** in Terra, con
`volumeMisuratoDiLotto` da scrivere: è il ponte coi rilievi che permette di
dire «previsti 180.000 m³, **misurati** 96.400» invece di fidarsi del progetto.
