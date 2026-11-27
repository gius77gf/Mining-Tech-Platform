# Checkpoint — 2026-09-19T03:16:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
93cf308e — fix(shared): i filtri .chg non avevano una larghezza minima di tocco

## Cosa è stato completato
Tre cantieri in parallelo (direttiva 26/07): quinta QA su Deepwork ID,
ricerca continua su Genesi, seconda UX su Terra. Ogni finding verificato
indipendentemente (grep rilanciati, misure rifatte) prima di agire.

- [x] **Deepwork ID → decisione 37 aggiornata** (`6a017bb8`): verificato che
      `revokeRefreshTokens` è già stato costruito (`revocaSessioni()`,
      chiamata da `updateMemberRole`/`removeMember`). La QA ha però
      RIPRODOTTO sotto l'emulatore il limite che il codice stesso
      dichiara: un admin appena rimosso ha continuato, con lo stesso
      token, a leggere un documento riservato e a **cancellare una
      fattura emessa** (azione admin-only) — una scrittura vera, non
      un'ipotesi. Aggiunta una strada (d) per chiudere il residuo
      (incrocio con la membership live sui controlli più sensibili),
      non implementata: compromesso latenza/costo per il fondatore.
- [x] **Genesi**: ricerca continua (`2265bb2c`) su validazione pre-sparo
      e tracciabilità — G45 (semaforo di sintesi), zona di sgombero
      geometrica e consuntivo foro-per-foro già esistono, verificato
      prima di proporre. Due delta: (1) nessun export legge il semaforo
      prima di scaricare — implementata, PROVATA, e **scartata**
      (`61da46dc` per la sola proposta 2; la 1 ha rotto 24/91 prove di
      `genesi-documenti-che-escono.mjs` e il codice è stato ripristinato:
      costo reale Medio, non Piccolo, lasciata come candidato); (2)
      `GDB.utente` non veniva mai scritto su una volata salvata —
      **implementata** (`61da46dc`), con `window.__genesi.GDB` come nuovo
      hook di debug per testarla senza una rete vera.
- [x] **Terra → shared/dw-app-ui.css** (`93cf308e`): `.chg` (filtri a
      segmento) aveva `min-height:var(--tap)` ma nessuna `min-width` —
      stessa famiglia della decisione 40 (`.nav`), selettore diverso.
      Misurato su Terra: 56,48×60px nel tema del sole. Aggiunto
      `min-width:var(--tap)`, verificato che nessuna app trabocca a
      320px in nessun tema dopo la correzione. In più: `iniezioni-
      fresche.mjs` non guardava mai i file `.css` — estesa la raccolta
      dei sorgenti (709/709 sul bersaglio, prima 708/709).

## Verifica prima dell'ultimo commit
`run-kpi.mjs` 3180/3180 · `sintassi-pagine.mjs` 34/34 · `run-stile.mjs`
330/330 · `suite-collegate.mjs` 3/3 · `iniezioni-fresche.mjs` 709/709 ·
`numeri-nei-documenti.mjs` 43/43 (421 banchi, copertura 1051/1051) ·
`sonda-vuoto.mjs` 15/15 · `copertura-funzioni.mjs` 11/11 ·
`fuori-schermo.mjs` 0 fuori posto su tutte e sei le app a 320px ·
`chg-min-larghezza.mjs` 3/3 normale, 1 KO/1 iniezione sotto
`--controprova`. Numeri propagati con lo strumento a ogni passo.

## Stato roadmap
Dodicesimo giro di deep-pass QA/ricerca. Deepwork ID ha ricevuto cinque
passate QA in questa sessione; Genesi la quinta ricerca/QA combinata;
Terra la sua seconda iterazione UX.

## Prossimi passi
- **Prossimo passo atomico**: nessun finding di codice specifico in coda.
  La decisione 37 (residuo del token) e la decisione 40 (barra di
  navigazione) aspettano il fondatore. Aprire almeno tre nuovi cantieri
  paralleli su superfici non ancora fresche oggi: Campo o Sentinella
  (QA, non toccate da un po' in questa sessione), ricerca continua a
  rotazione su Flotta (l'unica app senza una ricerca oggi), seconda
  iterazione UX su un'app diversa da Scudo/Flotta/Terra (già fatte).
- Ogni mandato di ricerca/QA continua a includere il vincolo esplicito
  "non eseguire alcun comando git" e "non modificare il codice di
  prodotto — solo verificare e riportare".

## Blocchi
Nessuno.
