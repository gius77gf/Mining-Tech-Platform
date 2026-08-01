# Terra: il ponte fra i lotti e i rilievi

**Data:** 01/08/2026 · **App:** Terra
**Unità precedente:** `20260801-024500_scudo-cause-ricorrenti.md`

## Cosa è stato fatto

`volumeMisuratoDiLotto` e `rilieviFuoriDaiLotti`. È il pezzo che rende il piano
a lotti una cosa **misurata** invece che dichiarata: un rilievo sta su un fronte
(`fronteId`), il fronte sta in un lotto (`frontiId`), quindi si può scrivere
«previsti 180.000 m³, **misurati** 96.400» invece di fidarsi del progetto.

## Le tre regole, che sono le stesse del ponte col volume

1. **Le riprese da cumulo restano fuori**, e vengono dichiarate: è materiale
   già cavato prima, e contarlo qui vorrebbe dire attribuire due volte lo
   stesso scavo. La regola vive in `shared/` (`provenienzaDi`) e si chiama —
   non si riscrive.
2. **Un lotto senza fronti non ha volume zero**: non ha un volume misurabile.
   Senza questa distinzione un lotto appena creato risulterebbe «non ancora
   cominciato» **esattamente come uno scavato e mai rilevato** — e sono due
   situazioni opposte.
3. **Un fronte senza rilievi elaborati è «mai misurato», non «zero»**, e le
   riprese da solo cumulo hanno una frase loro, diversa da entrambe.

## ⛔ E i rilievi che non stanno in nessun lotto

`rilieviFuoriDaiLotti` esiste per una ragione precisa: se sparissero in
silenzio, la somma dei lotti sarebbe **più piccola del volume davvero
misurato** — e nessuno se ne accorgerebbe, perché ogni singolo lotto tornerebbe
lo stesso. È la forma esatta delle voci di costo senza data, in un altro
angolo del prodotto: **si contano a parte, non si nascondono**. E si dichiara
anche quanti non hanno proprio un fronte, che è un problema diverso da quello
di un fronte non ancora assegnato a un lotto.

## Le prove

Tre `test` nuovi (**1076 → 1079**), tre difetti rimessi e tre cadute:
il cumulo contato come scavo del lotto (19.400 → 24.400), il lotto senza fronti
che risponde `0` invece di «non misurabile», e gli orfani che spariscono.

Stato: `run-kpi` **1079**, prove `node` **1.437**, copertura **454/454**,
`run-stile` 268, sonda del vuoto 7/7.

## Prossimo passo atomico

**Le schermate**, che è dove tutto questo diventa visibile. Due, in parallelo
perché toccano file diversi:

- **Terra**: la collezione `lotti`, l'elenco con sequenza e semaforo, il
  divario in cima — che resta **«non misurato»** finché nessun lotto è
  registrato — e per ogni lotto il previsto accanto al misurato.
- **Scudo**: la catena dei perché dentro la scheda dell'evento, che parte da
  **tre** righe e cresce; nel Quadro il conto degli **eventi gravi senza un
  perché**, che è quello che fa fare l'analisi invece di lasciarla facoltativa.

Tutte e due chiudono con uno scatto **guardato** e il loro banco.
