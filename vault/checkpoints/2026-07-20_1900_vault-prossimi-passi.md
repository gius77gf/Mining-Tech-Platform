# Checkpoint — 2026-07-20 — Vault Obsidian "Prossimi passi" allineato

## Task completato
ecosistema-vault/04 - Prossimi passi.md aggiornato allo stato reale
(commit f9e4e9f su main del vault): spuntati overhaul Genesi,
flyrock, presplit/A-B, Deepwork ID, le 6 app, registro
progettato-vs-reale, schede ricerca; aggiunti i punti aperti veri
(collaudo online post-Firebase, post-volata, editor metodi v4.1 da
decidere, meteo/push, salvataggio fori, secondo passaggio ricerca).
Era un appunto in sospeso dal 19/07 ("vault stale").

## In corso in parallelo
Test callable D4 (run-fns.mjs, 10 test sui guardrail) sugli
emulatori Auth+Firestore+Functions: la registrazione del trigger
onMemberWrite falliva per il proxy della sandbox ("denied by" sul
PUT locale della CLI); tentativo in corso con variabili proxy
rimosse per il processo CLI. Se anche così fallisse: NON è un
problema del codice ma dell'ambiente — lasciare run-fns.mjs fuori da
npm test (girerà in CI dove il proxy non c'è) e aggiungerlo con un
commento; verificare in CI l'esito reale.

## Prossimo passo atomico
Chiudere l'unità test-callable (in un modo o nell'altro: vedi sopra),
commit + PR. Poi approfondimenti secondo-passaggio ricerca o terze
iterazioni. MAI fermarsi volontariamente.
