# Checkpoint — 2026-07-21 — Data layer: API doc() idiomatica (fatto)

## Task completato
Allineata una regola VINCOLANTE ("mai percorsi Firestore costruiti a
mano"): i 6 data layer (scudo/campo/flotta/conti/sentinella/terra)
costruivano il path del documento come
`orgCollection(n).path + "/" + docId` per aggiorna()/rimuovi().
Sostituito con l'API idiomatica `doc(orgCollection(n), docId)` (11
sostituzioni) — stesso path risultante
(`organizations/<org>/apps/<app>/<coll>/<id>`), meno fragile, una sola
chiamata a orgCollection.

Verifica di merito (non cosmetica): la collection orgCollection punta
sotto `apps/<appId>` e le rules la coprono con
`match /apps/{appId}/{document=**}` (riga 86) → il refactor resta
autorizzato. Aggiunto un test in run-sdk.mjs che esercita
addDoc→updateDoc→deleteDoc via `doc(orgCollection(name), id)` sotto le
rules reali. Suite 77→78, TUTTA VERDE sugli emulatori localmente
(22 helper + 26 rules + 15 SDK + 15 functions). CI aggiornata a 78.

## Nota
Confermato che le rules coprono correttamente il path annidato reale
delle app (`apps/{appId}/{document=**}`), non solo il primo livello
sotto l'org — nessun buco di autorizzazione per il go-live.

## Commit
- 195e19b  Data layer: doc(orgCollection(name), id) invece del path a mano

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.
