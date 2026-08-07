# Checkpoint — 2026-08-07 21:0x UTC

## Tipo
unit-complete (le tre copie del formattatore diventano `perLettura`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ecf5024` — *Anche Flotta smette di avere la sua copia — e la trappola era gia' censita*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 200 | **`campo.numeroIt` diventa un alias** (`9818d4a`) | prove **2.299 → 2.300**, identità `===` provata |
| 201 | **le DUE copie di Flotta** (`ecf5024`) | `mostra` + `h`, e la riga del censimento **ritirata** |

## ⛔ Due correzioni a cose che avevo scritto io stesso, un'ora prima
1. **«La metà di Flotta non si può fare»** — dichiarato con la ragione che la
   riga 833 passa `n.orePreviste` che «può essere null». **Falso, e dedotto
   invece che guardato**: quella riga sta dentro `if (n.orePreviste)`. È la
   regola *«prima di misurare l'effetto di una modifica si guarda da quale
   regola il soggetto è già governato»*, saltata da chi l'ha citata due volte
   stanotte;
2. **«La gemella di Flotta è divergente»**, raccontata come scoperta del
   momento. Era **già censita** in `sonda-vuoto.mjs`, dichiarata «DORMIENTE,
   non VERO», con la stessa analisi parola per parola. Annunciare come nuovo
   ciò che c'era già è vietato dalla direttiva 5 — e vale anche quando a
   riscoprirlo è chi ha scritto la riga.

## ⛔ E il censimento ha preteso che la sua riga sparisse
Tolta la copia, `sonda-vuoto` è caduta: la riga che scusava `flotta.mostra`
**non si presentava più**. È il conto «N dichiarati / N che si presentano», e
la riga prevedeva esattamente come sarebbe finita — tranne che a chiudere il
buco è stata la traslocazione in `shared/`, non un chiamante nuovo.

## ⚠️ «La suite resta a 1885» non dimostra che quelle righe siano guardate
Controprovate una per una: rompendo `h` cade **1** prova, rompendo `mostra` ne
cadono **2**. Ripristino da **copia** con `diff -q`, mai da `git checkout`.

## ⛔ Perché l'identità e non il comportamento
Il comportamento di `campo.numeroIt` era **già** identico a `perLettura` —
misurato campione per campione prima di toccare niente. E non ha impedito che
la gemella di Flotta divergesse su `null` («0» invece di «»). Due copie uguali
oggi divergono domani: il test chiede `===`.

## Stato delle prove
Prove **2.300** (`run-kpi` **1885**), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **174 sezioni**.
⚠️ Gira su un commit vecchio di **diciotto**.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»,
   poi i KO, distinguendo le controprove. Poi **rilanciarlo sul commit
   corrente**.
2. ⏱️ **Le sei app scrivono i numeri all'italiana?** Misurato solo il core
   (32 schermate, 11 punti decimali corretti). Le app **non sono state
   guardate affatto**: stessa sonda, stesso metodo. **Non misurato** — e vale
   la pena, perché il core era pieno di punti e nessuno se n'era accorto.
3. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
