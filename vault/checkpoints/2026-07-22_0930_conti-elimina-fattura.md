# Checkpoint — 2026-07-22 — Conti: elimina fattura errata (fatto)

## Task completato
Seconda iterazione, app Conti: completato il CRUD-delete (Conti era
l'unica app senza rimozione voce). Una fattura con dati sbagliati e non
ancora incassata non si poteva correggere. Aggiunta la ✕ "Elimina
fattura errata" SOLO sulle fatture non incassate (le incassate non si
eliminano: si usa "annulla incasso" del #117). Aggiunto il metodo
rimuovi() al data layer di Conti (live deleteDoc + demo), assente
prima.

Verifica: sintassi OK (index.html + conti-data.js); Playwright — fattura
2026/031 eliminata (5->4), la ✕ NON compare sulle fatture incassate;
screenshot (design intatto, ✕ solo su non-incassate).

## Tema CRUD-delete/correggibilità: COMPLETO su tutte le 6 app
Conti (annulla incasso #117 + elimina fattura), Sentinella (registro
bidirezionale #118 + rimuovi sensore #120), Campo (richiama rapportino
#119), Flotta (rimuovi costo #121), Terra/Scudo già completi.

## Commit
- 7b156c8  Conti: elimina una fattura non incassata inserita per errore

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima 2a iterazione: cambiare tema —
ordinamenti/filtri utili o miglioramenti UX (es. totale delle fatture
filtrate, ricerca dove le liste sono lunghe). Sempre con screenshot.
MAI fermarsi.
