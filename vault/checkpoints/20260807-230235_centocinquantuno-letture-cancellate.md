# Checkpoint — 2026-08-07 23:3x UTC

## Tipo
unit-complete (la misura a mano che cancellava 151 letture)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`10df5bf` — *Una misura digitata a mano cancellava 151 letture importate, in silenzio*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 212 | **il tetto dello storico + regola 29** (`10df5bf`) | **151 letture** salvate; prove **2.302 → 2.303** |

## ⛔ Il difetto
`MAX_LETTURE = 500` è esportata dal modulo ed è **già importata** in quella
pagina: il percorso dell'**import** la usa e per giunta **dichiara** il taglio
all'utente. La scrittura **a mano** tagliava con un `50` scritto lì — un decimo
dello spazio, e senza dirlo.

```
storico prima                                  : 200
dopo UNA lettura a mano, col 50 scritto a mano : 50  -> perse 151
dopo UNA lettura a mano, con MAX_LETTURE       : 201 -> perse 0
```

## ⛔ E «perse» va letto stretto: non scartate, CANCELLATE
Non compaiono in `scartate` di `reportConformita`, perché quello elenca ciò che
ha **rifiutato** e queste erano già entrate. Sparivano **senza lasciare traccia
da nessuna parte**, e il report per l'ente coprirebbe cinquanta letture
credendo di coprirle tutte.

È la **copia debole di una costante condivisa**: la regola vive nel modulo, la
pagina se n'era tenuta un numero suo — la stessa famiglia delle funzioni
riscritte in casa, applicata a un tetto.

## ⛔ Regola 29 perché non torni
Un `slice(-N)` sulle letture non può nascere con un numero al posto della
costante, e la regola **stampa quante slice ha guardato**. Controprovata
rimettendo il difetto: cade.

## Stato delle prove
Prove **2.303** (`run-kpi` 1886, `run-stile` **297**), copertura **702/702**,
banchi **153**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
⛔ Il giro completo (19:08 su `2ab9535`), a **212 sezioni**, con attesa armata.

## Prossimo passo atomico
1. ⏱️ **Terra · `divarioRecupero`**: la bandiera c'è per i m² (`senzaMq`) e
   **non** per i m³ — `somma` usa `(+x[campo] || 0)`, quindi un lotto **senza
   volume dichiarato** vale 0 m³ e il divario scende in silenzio. Proposto dal
   cantiere e **non ancora verificato da me**: verificare, e se vero la regola
   giusta è già in casa (`detrazioneRecupero` separa assente/illeggibile e
   dichiara «la detrazione che esce è INCOMPLETA»).
2. ⏱️ **Terra · `csvRilievi`**: guardia a un verso solo (`volumeM3 == null ||
   !Number.isFinite(+r.volumeM3)` non copre `""`), e il messaggio dice «8
   rilievi» mentre il lettore ne riporta **7**. Proposto, non verificato.
3. ⛔ **Raccogliere il giro** quando finisce e **rilanciarlo sul commit
   corrente** — quello vecchio è indietro di oltre trenta commit.
4. ⏱️ **Scudo · il verbale DPI**: «Consegnato il» scrive «—» su una data
   assente, mentre la colonna accanto fu corretta il 03/08 proprio per questo.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- La barra vera del core: si **dichiara** non misurata, non è ancora misurata.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
