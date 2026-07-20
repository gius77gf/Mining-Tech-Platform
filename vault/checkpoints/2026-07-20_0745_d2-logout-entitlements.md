# Checkpoint — 2026-07-20 — D2 logout coerente + entitlements (fatto)

## Task completato — D2
- `shared/deepwork-id-client/dw-shell.js` (nuovo): mountExit(db) —
  pulsante "Esci" nella barra alta, SOLO in modalità live (in
  demo/tour non c'è account). Stile .dw-exit in dw-app-shell.css
  (body.has-exit allarga il padding del titolo).
- I 6 data layer (scudo, campo, flotta, conti, sentinella, terra)
  espongono `logout: () => id.logout()` nell'api live; le 6 pagine
  importano mountExit e lo chiamano dopo il data layer.
- SDK: nuovo metodo `listEntitlements()` (tutti gli entitlement
  dell'org attiva). profilo.html: per i membri la griglia app è
  generata dagli entitlement REALI (attivo + validUntil non scaduto);
  il mockup statico resta come fallback senza backend.
- Verifiche: sintassi ok su SDK/dw-shell/12 html; smoke Playwright
  su 6 app in demo (KPI e liste ok, NIENTE pulsante Esci, zero
  errori console); simulazione live → pulsante montato e stilato
  (screenshot d2-exit-live.png in scratchpad).

## Commit
- dea6ae3 — Deepwork ID D2: coherent logout on app pages + real entitlements grid

## Nota CI (da ricontrollare)
Tutti i run restano "queued" (coda runner GitHub piano gratuito, non
errore di config: ubuntu-latest). Se persiste per ore → indagare.

## Prossimo passo atomico
D3 — Verifica email + recupero password (taglia M): nello SDK
aggiungere sendEmailVerification dopo la registrazione e
sendPasswordResetEmail; in apps/deepwork-id/index.html link
"Password dimenticata?" con invio email di reset e messaggi in
italiano semplice; avviso "verifica la tua email" post-registrazione.
Testabile solo a sintassi/mockup finché il backend non c'è (progetto
Firebase = weekend fondatore). Poi D4 pannello amministrazione org.
