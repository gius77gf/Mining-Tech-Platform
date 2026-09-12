# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 12:29 UTC
- **Commit di partenza**: `7843c228`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il repository è raggiungibile, `HEAD` combacia col remoto (nessuna
divergenza), working tree pulita. Dall'ultimo aggiornamento di questo file
(09:15 UTC, commit `5fdfd644`) sono state completate e pushate **sei unità**
(119-124): rimisurato e corretto `docs/MAPPA_ECOSISTEMA.md` (16 ponti su 56,
Genesi sbloccata dal 02/09 — la nota nel prompt della routine che dice
«Genesi NON esce dal browser» e «6 ponti su 56» è **superata**, non va
seguita alla lettera); chiuso senza difetto l'esame delle fatture demo di
Conti; estratte quattro funzioni pure da `genesi.html` a `genesi-data.js`
(`_sitoParseCsv`, `_sentCell`, `esplCardHtml`, `innCardHtml`), con la
correzione a cascata di due tool di misura che le marcavano male (un falso
positivo del tokenizzatore di `genesi-estraibili.mjs` su due forme diverse,
e uno scope-gap nel conto del "contagio" di `numeri-nei-documenti.mjs`);
letto un giro completo del browser (2h15) e chiuso i due KO veri trovati
(un'unità in maiuscolo in una modale di Sentinella). Ogni unità verificata
con `giro-node.mjs` su worktree pulita prima del commit (exit 0 ogni volta).

## Prossimi passi immediati

1. Un giro del browser mirato (Genesi + Sentinella, lanciato dopo l'unità
   123) è ancora in corso: leggerlo con `leggi-giro.mjs` quando finisce e
   chiudere eventuali KO veri (ricordare: attesta un commit precedente alle
   unità 121-124, quindi ogni KO va riverificato contro il codice attuale).
2. Continuare il cantiere B3 (Genesi fuori dal browser): restano funzioni
   nella fascia 3-5/6-10 di `genesi-estraibili.mjs --elenco`, ma le rimaste
   sono in maggioranza genuinamente legate allo stato (non falsi positivi) o
   toccano fisica della volata (MIC, PPV) — richiedono la stessa rigor usata
   per `computeMIC` (parola per parola, migliaia di casi generati), non un
   trasloco semplice.
3. Altrimenti: prossime voci `[ ]` di `vault/ROADMAP_SETTIMANA.md` (B12, B4,
   B0-bis, B0, C2, E-serie, Q1) o ricerca a rotazione.

Nota sul prompt fisso della routine: cita ancora la mappa dei ponti e lo
stato di Genesi come erano il 26/08. Non è un'istruzione da riverificare
alla lettera ogni volta — è già stato fatto, ripetutamente, e il documento
vivo è `docs/MAPPA_ECOSISTEMA.md`, non il testo del prompt.
