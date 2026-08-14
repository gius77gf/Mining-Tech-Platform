# Checkpoint — 2026-08-07 23:1x UTC

## Tipo
unit-complete (la gravità sconosciuta che diventava «lieve»)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b227324` — *Un infortunio importato come «mortale» usciva dal nostro CSV come «lieve»*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 210 | **`parseInfortuniCsv`: la gravità non dichiarata** (`b227324`) | 2 casi su 3 passavano da «lieve» a `null` |

## ⛔ Il difetto
`... === "grave" ? "grave" : "lieve"`: colonna vuota → «lieve», e **qualunque
altra parola** → «lieve». Un file scritto da un altro gestionale non usa per
forza le nostre due parole, ed è esattamente il caso dell'**import**.

| riga importata | prima | dopo |
|---|---|---|
| colonna **vuota** | `"lieve"` | `null` |
| colonna **«mortale»** | `"lieve"` | `null` |
| colonna «grave» | `"grave"` | `"grave"` (invariato) |

## ⛔ E la svista si vede dai VICINI DI CASA, nello stesso oggetto letterale
`tipo`, su un valore ignoto, ricade su «near-miss» — il caso **prudente**, col
commento che lo dichiara — e `giorniAssenza` ha **tre righe** di ragione per non
trasformare una colonna vuota in uno zero. La gravità, in mezzo a loro,
ricadeva sulla parola che **tranquillizza**.

## ⚠️ Perché `null` e non «grave»
`null` è la convenzione di casa per «non dichiarato» (la stessa di
`giorniAssenza` a prognosi aperta e di `scadenza` in `parseAzioniCsv`). Mettere
«grave» sarebbe stato inventare una fascia nell'altro verso. Il KPI degli
infortuni gravi conta `=== "grave"` e **non cambia**; l'export scriveva già
`${x.gravita||""}` e ora mette la cella **vuota** invece di una parola falsa; la
riga a schermo dice «gravità non dichiarata» invece di tacere.

## ⚠️ Le prove stanno dove la riga era già guardata a metà
Il blocco che asseriva il `tipo` girava sulla **stessa riga di CSV**, la cui
colonna `gravita` era vuota e **non la guardava nessuno**. Controprovate
rimettendo il difetto vero: cadono («atteso null, ottenuto "lieve"»).
Ripristino da **copia** con `diff -q`.

## Stato delle prove
Prove **2.301**, copertura **702/702**, banchi **153**, regole **68**, giro
`node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
⛔ Il giro completo (19:08 su `2ab9535`), a **212 sezioni**, con attesa armata.

## Prossimo passo atomico
1. ⛔ **Scudo · `nominaAttiva` con data di FINE illeggibile**: `giorniTra` dà
   `NaN`, `Number.isFinite(g) && g < 0` non scatta, e la nomina resta **attiva
   per sempre**. La regola giusta è due righe sotto (`senzaData` usa
   `dataISOEsiste` con la ragione scritta: «una data impossibile è illeggibile
   quanto una mancante») ma guarda **solo `dal`**. Proposto dal cantiere e
   **dichiarato dormiente** (il form non ha il campo `al`): **verificare
   entrambe le cose** contro il codice, poi correggere e blindare.
2. ⛔ **Sentinella · la lettura a mano taglia lo storico a 50** mentre
   `MAX_LETTURE` è **500** e il percorso import lo dichiara: sarebbero **151
   letture cancellate**, non scartate. Verificare, correggere, blindare.
3. ⛔ **Raccogliere il giro** quando finisce e rilanciarlo sul commit corrente.
4. ⏱️ **Terra · `divarioRecupero`** ha la bandiera per i m² e non per i m³
   (`somma` usa `+x || 0`). Proposto, non verificato.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- La barra vera del core: si **dichiara** non misurata, non è ancora misurata.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
