# Checkpoint — la quota falsa adesso ha un controllo

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Banchi del browser:** 31 → **33**

La quota di base nel sistema sbagliato è venuta fuori **guardando uno
screenshot**. Una difesa che dipende da chi guarda non è una difesa:
`tests/browser/quota-base-reale.mjs`, **7 prove**.

## La forma generale, che non dipende dal cono

> La quota di base deve cadere **dentro l'intervallo Z della nuvola caricata**.

Un piano di base fuori dalla nuvola non è una stima imprecisa: è un numero di un
**altro sistema di coordinate**. Il banco carica una nuvola sintetica
georeferenziata (Z fra 340 e 346 m) col vero `<input type=file>` — è la
georeferenziazione a creare l'offset grande, cioè la condizione in cui il difetto
si manifesta — e pretende:

- la quota di base dentro l'intervallo Z;
- la **Z del ritaglio** nello stesso sistema;
- la **X del ritaglio** in coordinate vere, non centrate sullo zero;
- e la riga sotto il visore che mostra **la stessa** quota del record salvato:
  chi guarda l'app e chi legge il verbale non devono vedere due numeri diversi.

## La controprova riproduce il difetto vero

Togliendo l'offset nella risposta HTTP (**2 iniezioni** dichiarate) il banco
stampa esattamente quello che ho visto nello screenshot:

```
volume ≈ 1.362 m³ (griglia 0,49 m, base -2,85 m — stima)
```

**2 cadute su 7.** Non una fallita generica: la stessa riga, con lo stesso
numero.

## Prossimo passo atomico

1. la **seconda metà dell'unità 5**: la cella si cambia, col ricalcolo e la
   regola sul record già salvato;
2. la nota di credito nell'**export per il commercialista** e nel registro IVA;
3. giro completo a **33 esecuzioni** a lavoro sul codice fermo.
