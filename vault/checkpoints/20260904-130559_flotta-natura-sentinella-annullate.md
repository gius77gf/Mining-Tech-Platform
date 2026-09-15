# Checkpoint — 2026-09-04T13:05:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e92ce468 — Sentinella, la lettura dichiarata non valida; prima: 10f1df43 Flotta scelti/subìti, 6a7bfbbb ricerca fattura elettronica

## Completato
- Flotta: `naturaFermo` e i tre totali (scelti / subìti / non classificati)
  nell'affidabilità, con la frase; run-kpi 2531, Flotta 98/98.
- Sentinella: la lettura dichiarata non valida (cantiere raccolto e
  rimisurato: banco 60/0 nei due versi, run-kpi 2545, 150/150). Documenti
  allineati (3.026 / 798 / 3.449 / 231 banchi su 95 file).
- Ricerca sulla fattura elettronica differita in coda a
  `docs/RICERCA_CONTINUA_CONTI.md` (delta NON ancora fatto).
- Sul disco, non committato: il cantiere Deepwork ID / vetrina (morto a
  metà con la sesta interruzione): `apps/deepwork-id/*.html`, `apps/index.html`,
  `apps/vetrina/sito.py`, `run-stile.mjs`, `tutti.mjs` (due righe id-stati),
  `vetrina-collegamenti.mjs`, `LEGGIMI.md`, nuovi `finto-id.mjs` e `id-stati.mjs`.

## Prossimo passo atomico
1. Valutare il cantiere Deepwork ID senza il suo rapporto: leggere i diff
   (`git diff HEAD -- apps/deepwork-id apps/index.html apps/vetrina`),
   lanciare `id-stati.mjs` nei due versi e `vetrina-collegamenti.mjs`,
   `run-stile` (le 3 rosse di stamattina erano sue), `sintassi-pagine`,
   `nomi-liberi`, `iniezioni-fresche`; guardare le pagine a 320/390 con
   scatti; se regge, copia + giro node, commit come «Nona tappa», documenti
   (banchi 231 → 233, file 95 → 97), checkpoint, roadmap. Se non regge,
   dichiararlo e tenere solo ciò che si misura.
2. Il delta della ricerca sulla fattura elettronica dal meccanismo
   (`xmlFatturaPA` in conti-data: chi compone DatiDDT, i decimali, la
   quadratura riga).
3. I due candidati di Sentinella visti negli scatti (numerone troncato a 320,
   tabella che scorre) e quelli di Flotta (contatore azzerato, mappa colonne).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-25, Q1; registro
esplosivi.
