# Checkpoint — «il contatore segna adesso 0 ore» era una frase falsa

- **Tipo**: unità (**secondo difetto di prodotto** della giornata) + una traccia
  precisa per il prossimo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `d7540a9`

## Il difetto

`+null` fa **0**, e `Number.isFinite(0)` risponde **true**. Su un mezzo **senza
contaore**, il piano del prossimo tagliando partiva quindi da zero: la finestra
diceva

> «Il contatore segna adesso **0 ore**: il prossimo cade a 500»

su una macchina che poteva essere a seimila ore. La frase non è imprecisa: è
**falsa**, su un numero che quel contatore non ha mai dato.

È lo stesso `+null === 0` che in questo progetto **è già costato una volta**,
sulla base d'asta delle gare in Conti. La forma sbagliata non è
`Number.isFinite(x)`: è **`Number.isFinite(+x)` su un valore che può essere
nullo**.

Corretto in **due** punti, perché stava in tutti e due: la funzione ora esclude
`null` prima di convertire, e la pagina non fa più `(+mezzoDi.ore || 0)`.

L'ha trovato una **prova nuova**, nata rossa. Senza quella prova il difetto
sarebbe rimasto: nessun errore, nessun test, solo una finestra che dice una cosa
non vera a chi programma la manutenzione.

## Le altre due regole bloccate su questa funzione

- **Si riparte dalle ore VERE, non da quelle previste.** Tagliando dei 6000 h
  fatto a 6040 → il prossimo cade a 6040 + passo. Ripartire dalle 6000 farebbe
  accumulare ogni ritardo in silenzio: dopo cinque tagliandi il mezzo gira con
  duecento ore di manutenzione arretrata e il piano dice che è a posto.
- **I decimi non si arrotondano.** 5875,5 resta 5875,5: i contaore contano i
  decimi, e scrivere 5876 sarebbe di nuovo un numero mai dato dal contatore.

## ⚠️ La traccia per il prossimo passo (misurata, non sospettata)

Cercando lo stesso schema altrove: in `apps/flotta/index.html` ci sono **una
ventina** di `(+m.ore || 0)`. La maggior parte sono **visualizzazioni**
(`toLocaleString`), e lì lo zero è brutto ma non decide niente. Ma almeno due
finiscono in un **calcolo**:

- riga ~1397: `perCampo(Math.round(+m.ore || 0) + p.ogniOre, 1)` — precompila le
  ore del tagliando dallo stesso zero falso che ho appena corretto altrove;
- riga ~1700: `const mancano = n.orePreviste - (m.ore || 0);` — «quante ore
  mancano» calcolate contro uno zero: **è esattamente la lezione già scritta**
  (un tagliando dovuto sembra lontanissimo).

Va guardato ognuno **uno per uno**, distinguendo visualizzazione da calcolo:
una sostituzione in blocco romperebbe le righe dove lo zero è solo un modo di
scrivere «—».

## Stato

- **501** KPI (433 all'inizio della giornata) → **760** prove `node`, verdi
- **68 prove nuove** in giornata, **2 difetti di prodotto** trovati e corretti
- giro a 19 banchi: fermato per fare la correzione (regola di stamattina), **da
  rilanciare**

## Prossimo passo atomico

Rilanciare il giro a 19 banchi e **non toccare più i moduli finché non
finisce**. Nel frattempo, sul solo `run-kpi.mjs` (che nessuna pagina importa),
preparare le prove per i due `(+m.ore || 0)` di calcolo elencati qui sopra: si
scrivono ora, si verificano con la copia del modulo, e la correzione si applica
quando il giro è finito.

## Bloccanti

- Nessuno.
