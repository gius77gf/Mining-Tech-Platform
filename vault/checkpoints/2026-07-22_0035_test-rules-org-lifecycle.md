# Checkpoint — 2026-07-22 — Test rules ciclo vita org (fatto)

## Task completato
Chiusa la copertura delle regole sul ciclo di vita delle
organizzazioni: nessuno crea un'org con scrittura diretta dal client
e nemmeno l'owner puo cancellare la propria org (nelle rules
create/delete sono false → solo la Cloud Function). Con questo, la
copertura delle regole Firestore è ESAUSTIVA su tutte le collezioni:
isolamento dati, metadati+ciclo vita org, entitlement, membri, inviti
(create/read/update/delete, positivo e negativo), profili, tour/demo.

Suite 111 → 113 (rules 31 → 33), verde in locale sugli emulatori.
Job CI a 113.

## Commit
- 55d2413  Test rules: ciclo di vita org solo via Function (no client)

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare con test/revisioni finché
emerge valore reale; i grandi passi restanti (go-live Firebase, dati
default, meteo/push, editor metodi, gestione errori UI) richiedono il
fondatore al weekend. MAI fermarsi volontariamente.
