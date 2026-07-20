# Checkpoint — 2026-07-22 — Conti: annulla incasso (fatto)

## Task completato
Nuovo ciclo, punto 1 della lista (seconde iterazioni app verticali):
prima unità su Conti. Una fattura segnata incassata per errore non era
correggibile. Ora toccando una fattura INCASSATA si annulla l'incasso
(torna tra le aperte, dataIncasso azzerata) con conferma; il tocco su
una fattura aperta resta "segna incassata". Completa il ciclo di
aggiornamento senza cancellare i record contabili (giusto per la
contabilità: si corregge, non si elimina).

Verifica: sintassi OK; test Playwright del round-trip incassa→annulla
(fattura 2026/031 → incassata → tornata aperta, nessun errore di
pagina); screenshot della lista fatture (design system intatto).

## Commit
- df423c6  Conti: annulla incasso di una fattura (correzione errori)

## Prossimo passo atomico
Push + PR + merge a CI verde. Poi continuare le seconde iterazioni
sulle app: prossima idea → Conti "elimina gara inserita per errore" o
passare a Flotta/Sentinella/Terra/Campo con lo stesso criterio (CRUD
mancante/correzioni/validazioni, ognuno con screenshot). MAI fermarsi.
