# Checkpoint — 2026-08-07 22:0x UTC

## Tipo
unit-complete (la barra del core: da «0 fuori posto» a «NON misurata»)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e9d4a8f` — *La barra del core: da «0 fuori posto» a «NON misurata», e il righello sbagliato due volte*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 203 | **`barra-etichette` dichiara le barre non misurate** (`e9d4a8f`) | core: **4 larghezze su 4** dichiarate · Conti invariata a **40 etichette** |

## ⛔ Il difetto
Le barre delle app sono `.nav`; quella in basso del core è **`.bnav`**
(`id="global-nav"`). Il banco apriva il core, non trovava nessuna barra e
stampava — **a ogni giro, da mesi** — «0 etichette misurate su 0 barre (1
superfici aperte) · **0 fuori posto**»: un numero che si legge «a posto» e vuol
dire «non ho guardato». Famiglia dello «0 modali su 68».

## ⛔ E il righello ha sbagliato DUE volte — è la parte che vale
Tutt'e due prese **prima** del commit:
1. **allargare il solo selettore ha peggiorato le cose**: la `.bnav` del core
   esiste ma è vuota, e il banco è passato da «0 barre» (che almeno si vede) a
   «1 voce · 0 fuori posto» — un **verde falso** su una barra che non c'è;
2. la guardia di visibilità scritta con **`offsetParent`** dichiarava «barra
   nascosta» su **Conti**, che ce l'ha visibilissima: `offsetParent` è `null`
   su ogni elemento **`position:fixed`**, e ogni barra in basso è fissa.
   Misurato sul giro intero: **da 164 etichette a ZERO**. Avrei spento il
   controllo per correggere un buco.

**Terza stesura**, e «vuota» si misura sulle **etichette**, non sui bottoni: la
barra del core ha un bottone senza testo, quindi contando i bottoni il verde
falso tornava.

## ⚠️ Verificato nei due versi
Conti **40 etichette su 4 barre** (invariata), il core dichiara «barra senza
etichette (non ancora costruita)» a tutte e quattro le larghezze, e la
controprova **sa ancora fallire** (4 fuori posto, 31 tagliate).

## ⛔ Coda dichiarata, e NON è mia
`orologio-cliente.mjs` fa cadere **1** prova di Flotta («pagella: senza le ore
la macchina esce dalla classifica»). Verificato su una worktree **pulita di
HEAD**, senza la mia modifica: **cade uguale**. È l'ora — UTC **22:02**, Roma
**00:02**: Roma ha passato la mezzanotte e il container no. È la famiglia di
`docs/RICERCA_GIORNO_LOCALE_202607.md`: **una prova il cui esito dipende
dall'orologio del muro**. Va sistemata, ed è un'unità sua.

## Stato delle prove
Prove **2.300** (`run-kpi` 1885 in UTC), copertura **702/702**, banchi **153**,
regole **68**. Giro `node`: **22 su 23**, e il ventitreesimo è la coda qui
sopra, dichiarata e non mia.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **208 sezioni**, nella
sezione delle controprove.

## Prossimo passo atomico
1. ⛔ **La prova di Flotta che dipende dall'orologio** — è il primo passo
   perché fa cadere il giro `node` **adesso**: cade solo dopo la mezzanutte di
   Roma. Si guarda come la prova costruisce «oggi» e le si dà una data fissa,
   invece di leggere l'orologio.
2. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»,
   poi i KO, distinguendo le controprove. Poi **rilanciarlo sul commit
   corrente** — quello vecchio non copre ventidue commit.
3. ⏱️ **La barra vera del core non è ancora misurata da nessuno**: adesso lo
   *dichiara*, che è meglio, ma per misurarla davvero il banco deve arrivare
   allo stato in cui il programma l'ha costruita.
4. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
