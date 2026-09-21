# Checkpoint — 2026-09-05T07:25:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7c82da93 — Documenti: le suite con l'emulatore rimisurate in questo contenitore, e due righe di Conti passate a «c'è a metà»

## Completato
- Emulatore lanciato qui: regole 81/0, SDK 19/0, primo avvio 8/0, funzioni
  21/0 (punto 4 della lista del ciclo: rimisurato, niente da correggere).
- `docs/CONCORRENTI_CONTI.md`: fattura elettronica e pesa da «confermate
  assenti» a «c'è a metà», coi comandi rilanciati; roadmap B4 47 → 45 con la
  ragione (la riga tiene la forma `| totale **N** (era 54` che la guardia legge).
- Giro `node` sulla copia verde.

## Prossimo passo atomico
L'ultimo dei quattro lettori per nome: `proponiMappa` di Sentinella sopra
`mappaColonne` di shared, TENENDO il ripiego sui dati (senza intestazione:
prima colonna che è una data, ultima numerica) e l'esclusione degli assi
(`proponiColonneEvento`). Prima di scrivere: leggere `proponiMappa` e
`proponiColonneEvento` per intero e le loro prove in run-kpi (`grep -n
"proponiMappa(" apps/deepwork-id/tests/run-kpi.mjs | wc -l`); la forma
`{colData, colOra, colValore}` non cambia; la controprova è la suite
esistente + il banco `sentinella-evento-import`. Se le prove esistenti
cadono, è il righello nuovo e non il vecchio: fermarsi e leggere.
Dopo: punto 6, ricerca a rotazione sul mondo per Sentinella (relazione
periodica vibrazioni per Comune/ARPA: sezioni, tabelle, cadenze; UNI 9916,
DIN 4150-3), solo WebSearch, in coda a `docs/RICERCA_CONTINUA_SENTINELLA.md`.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
