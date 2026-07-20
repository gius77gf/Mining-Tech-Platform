# Checkpoint — 2026-07-22 — Flotta: rimuovi voce di costo (fatto)

## Task completato
Seconda iterazione, app Flotta: CRUD delete mancante sui costi. Le voci
di costo si potevano solo aggiungere — una registrata per errore
restava bloccata. Aggiunta la ✕ "Rimuovi voce di costo" (con conferma
su voce+importo) e uno stato vuoto per la lista costi ("Nessun costo
registrato."). Coerente col pattern ✕ delle altre app.

Verifica: sintassi OK; Playwright — rimossa la voce "Carburante", lista
3->2, nessun errore; screenshot (✕ integrata col design).

## Stato 2e iterazioni app (correggibilità + CRUD delete)
- Conti: annulla incasso (#117)
- Sentinella: registro bidirezionale (#118) + rimuovi sensore (#120)
- Campo: richiama rapportino (#119)
- Flotta: rimuovi voce di costo (questo)
- Terra/Scudo: già completi/correggibili

## Commit
- c1f33b4  Flotta: rimozione di una voce di costo + stato vuoto

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima 2a iterazione: Conti — elimina
una gara/fattura inserita per errore (prima dell'incasso), oppure
ordinamenti/filtri aggiuntivi dove utili. Sempre con screenshot. MAI
fermarsi.
