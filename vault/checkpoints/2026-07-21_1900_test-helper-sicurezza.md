# Checkpoint — 2026-07-21 — Test helper di sicurezza (fatto)

## Task completato
Nuovo file apps/deepwork-id/tests/run-helpers.mjs: 15 test JS puri
(nessun emulatore) che blindano gli helper di sicurezza CONDIVISI di
shared/deepwork-id-client/dw-shell.js contro regressioni future:
- esc() — 5 test: neutralizza <>, virgolette " e ', e-commerciale
  per prima, null→"", testo normale invariato.
- csvCell() — 10 test: apostrofo davanti a = + - @, virgolette per il
  separatore ;, raddoppio virgolette interne, a capo, null→"", numero,
  testo innocuo invariato.
Agganciato in testa alla catena `npm test`; job CI rinominato
"Helper + Firestore rules + SDK + Functions tests (70)" (55→70).

## Commit
- d03ea94  Test: helper di sicurezza condivisi (esc + csvCell), suite a 70
(entra nella PR #95 assieme alla protezione CSV-injection)

## Prossimo passo atomico
Attendere CI verde su PR #95 (ora 70 test) e mergiare. Poi continuare
fino a esaurimento crediti. Ciclo SERALE (~21:40 UTC): revisione
COMPLETA prima di nuovi task. MAI fermarsi volontariamente.
