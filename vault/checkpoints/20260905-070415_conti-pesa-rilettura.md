# Checkpoint — 2026-09-05T07:04:15Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
cb389e65 — Conti, import dalla pesa: la riga col solo netto non entra (con la ragione vera), e la finestra dice prima che cosa entrerebbe

## Completato
- `pesateDallaPesa`: la riga col solo netto va fra le scartate con la ragione
  vera; `netto` tolto da `entrano`. Prova nuova.
- Finestra «Come ho letto il file»: anteprima di che cosa entrerebbe (per
  nome) con l'unità suggerita. `conti-banca-colonne` 52/0.
- Giro `node` sulla copia verde (3.553 asserzioni, invariato).

## Prossimo passo atomico
Punto 4 della lista del ciclo: le suite con l'emulatore, rimisurate in questo
contenitore (non lo sono ancora oggi). Comandi (da CLAUDE.md):
`cd apps/deepwork-id/tests && npm ci`; `cd apps/deepwork-id/functions && npm ci`;
poi `cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec --only
firestore,auth,functions --project demo-deepwork "cd tests && node run.mjs &&
node run-sdk.mjs && node run-bootstrap.mjs && node run-fns.mjs"`. Attesi
75/19/8/21 verdi. Se un numero non torna, PRIMA leggere se è lo strumento
(cartella `node_modules` vuota, porta occupata) e poi il codice. Se tutto
torna, un test in più sulle regole: la nuova collezione `pianocarico` di
Campo con `idForo` non cambia le regole (è dentro `/apps/{appId}/**`), quindi
niente da aggiungere lì — scrivere invece in `tests/claims-convergenza` o
`run-sdk` una prova che `orgCollection` con `appId: "sentinella"` da Campo
legga la stessa organizzazione (il ponte P6 in produzione), se non c'è già
(`grep -n "appId: \"sentinella\"\|appId:\"sentinella\"" apps/deepwork-id/tests/*.mjs`).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
