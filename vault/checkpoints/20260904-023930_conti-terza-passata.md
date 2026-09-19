# Checkpoint — 2026-09-04T02:39:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3a2c5902 — Conti: il periodo scritto al contrario non è un periodo vuoto

## Completato
Terza passata in profondità su Conti (cantiere parallelo). Undici banchi verdi
dal disco, dodici file aperti, demo svuotata in 13 configurazioni, sei periodi
a 390/320 nei due temi. Un difetto vero, rimisurato da me contro una copia di
HEAD prima di committarlo: il periodo scritto al contrario (31/07 → 01/07)
usciva come «€ 0,00 · 0 voci» in Costi e «prova ad allargare il periodo» nel
Report. Ora il campo «al» porta l'errore e le schermate dicono «non è vuoto —
non esiste». Giro node sulla copia HEAD+file: 38/0.

## In corso (sul disco, NON committato)
- Unità «le barre accettano null»: `shared/dw-grafici.js` (`separaMancanti`,
  voce «non misurato» in coda senza barra, tabella accessibile con «—»),
  `shared/dw-grafici.css`, Terra `volumeFronteRilevato` + pagina, run-kpi +4
  (2529), copertura terra 77, docs 3.006→3.010 / 789→790 / 3.428→3.432,
  `terra-geometrie.mjs` (scena 2-bis + iniezione 6; sana 0 KO, controprova
  6/6 rimessi e cade). **Manca** `flotta-disegni.mjs`: le iniezioni 4 e 5 di
  `DIFETTI_MOTORE` cercano le due righe del motore che ho cambiato
  (`w = lunghezzaBarra(pxv(d.valore) - pxv(0), 2)` → ora `w = d.manca ? 0 :
  lunghezzaBarra(…)`; `y = pyv(d.valore), h = lunghezzaBarra(pyv(0) - y, 2)`
  → `y = d.manca ? pyv(0) : pyv(d.valore), h = d.manca ? 0 : …`):
  `iniezioni-fresche` cade finché non le aggiorno, e NON si tocca quel banco
  finché gira il giro filtrato del browser (è nella sua lista, passata 185).
- Giro browser filtrato `--solo=scudo,sentinella,flotta,core` (copia di
  4fca9069, pid 24544, registro `scratchpad/giro-browser-0904a.log`): 49 su
  66 passate alle 02:40Z.

## Prossimo passo atomico
1. Quando il giro browser finisce: aggiornare le due stringhe cercate in
   `flotta-disegni.mjs` (DIFETTI_MOTORE 4 e 5) alle righe nuove del motore,
   lanciare `flotta-disegni` sano + `--controprova` senza proxy, poi
   `iniezioni-fresche`; ricostruire la copia dello staged, giro node, commit
   con `-F`, push, checkpoint.
2. Leggere il giro con `leggi-giro.mjs`, riverificare ogni KO sul commit
   corrente prima di aprire cantieri.
3. Poi l'unità «lo schermo del progetto con i chili grezzi» nel core (tocca
   `core-documenti-che-escono.mjs`: solo a giro fermo).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-24, Q1.
