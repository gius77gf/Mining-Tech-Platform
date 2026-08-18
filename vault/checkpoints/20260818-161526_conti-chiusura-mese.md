# Checkpoint — 2026-08-18T16:15:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fcdebdcb

## Cosa e stato completato
Unita Conti, nata dallo stress con la cava sintetica (10 anni, 3.600 righe di
costo — la dimostrazione ne ha 40).

1. `vociMancantiNelMese` da quadratica a una passata sola
   (`Map<voce, Set<mese>>`): `renderChiusura` 84,5 ms → 1,5 ms, x55, con
   1.021 casi di confronto identici. E `margineMese` adesso restituisce
   `vociMancanti`, cosi la pagina smette di chiamarla due volte.
2. `perchePeriodoSenzaCosti` separa «tre costi con l'importo illeggibile» da
   «nessun costo»: erano raccontati uguale, e il primo e un dato assente
   travestito da dato.
3. Sotto quel messaggio la pagina scriveva «€ 0,00» — un numero tranquillo
   dove aveva appena dichiarato di non sapere. Adesso «—», via
   `numeroDichiarato`.

## Numeri riallineati (lanciando le suite, non a memoria)
- prove 2.853 → **2.876** (`run-kpi` 2373 → 2396)
- copertura funzioni 759/759 → **760/760**
- asserzioni del giro 3.234 → **3.259**
- Documenti toccati: docs/DEVELOPMENT.md, docs/STATO_PRODOTTO.md,
  docs/DECISIONI_WEEKEND.md, vault/ROADMAP_SETTIMANA.md

## Verifica
Sulla **copia di cio che si committa** (worktree staccata da HEAD +
`git diff --cached | git apply` + `git -C "$W" add -A`):
- `giro-node.mjs`: **37 comandi a posto, 0 caduti**
- `numeri-nei-documenti.mjs`: **43 passati, 0 falliti**

## Prossimo passo atomico
Punto ③ del rapporto di stress, mai affrontato: **`terra.banchiDaSempre`
costruisce un anno per giro di ciclo senza nessun tetto**. Una data digitata
male (`2926-03-15`) fa 911 anni: 52 ms e la pagina stampa «Anni guardati:
2016–2926». Le sorelle lo fanno gia giusto (`serieAnnuale`,
`scudo.andamentoIndici`): si legge come lo fanno LORO prima di scrivere il
tetto, invece di inventarne uno.
File: `apps/terra/terra-data.js` (funzione `banchiDaSempre`), e il punto
della pagina che stampa l'intervallo degli anni in `apps/terra/index.html`.

## Blocchi
Nessuno.
