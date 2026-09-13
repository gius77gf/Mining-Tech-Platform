# Checkpoint — 2026-09-05T10:05:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
11ea5280 — Sentinella: il riferimento della soglia applicata va nei documenti —
scheda della volata e report per l'ente, dalla stessa funzione

## Completato
`riferimentoSoglia(m, ricettori)` e `presetDelPunto(m)` nel modulo; la scheda
della volata e la scheda del punto nel report scrivono «Riferimento della
soglia: …» dalla stessa funzione — il riferimento del valore che VALE, con
l'avvertenza «da verificare» sui preset, «scritta sul ricettore» quando vince
il ricettore (prima la scheda diceva il preset del punto anche in quel caso:
giusta solo perché in dimostrazione i numeri coincidono). `frequenzaFuoriBanda`
passa da `presetDelPunto`: una domanda sola.
Misure: run-kpi 2657/0 (+3); banco della scheda 41/41 (controprova 30/41 con
7/7); banco del report 27/27 (controprova 15 caduti, 4/4 iniezioni); sintassi
34/0; giro `node` sulla copia: 38 comandi a posto, asserzioni 3.570;
copertura 827/827, fondo Sentinella 158. Documenti: 3.138 prove, run-kpi 2657.
Righello sbagliato una volta: contava la parola «soglia applicata» e prendeva
l'etichetta del grafico (5 su 3) — adesso conta le righe della scheda.

## Stato roadmap
Voce Sentinella del 05/09 chiusa, con la nota di questa unità in coda.

## Prossimo passo atomico
Punto 4 della lista «se la roadmap sembra finita»: le suite dell'emulatore in
un contenitore che potrebbe essere fresco. Prima misurare: `ls
apps/deepwork-id/tests/node_modules | head -1` e `ls
apps/deepwork-id/functions/node_modules | head -1`; se vuote, `npm ci` in
tutt'e due (una volta per contenitore), poi
`cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec --only firestore,auth,functions --project demo-deepwork "cd tests && node run.mjs && node run-sdk.mjs && node run-bootstrap.mjs && node run-fns.mjs"`
e confrontare coi numeri dichiarati (81 regole, 19 SDK, 8 primo avvio, 21
funzioni). Se un numero non torna, si corregge il documento che lo dichiara
(DEVELOPMENT, STATO_PRODOTTO, DECISIONI_WEEKEND), non il giro. Alla prossima
accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
