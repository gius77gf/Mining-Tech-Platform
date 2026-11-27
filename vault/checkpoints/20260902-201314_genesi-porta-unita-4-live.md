# Checkpoint — 2026-09-02T20:13:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
747661cb — Genesi fuori dal browser, unità 4: la modalità live, e senza rete si resta locali

## Completato
- `genesiData()` asincrona con il ramo live (forma di `terraData`): cinque
  `orgCollection` sotto `apps/genesi/…`, forme dei documenti dichiarate
  (confronti un doc per slot A/B, sito un doc `unico`), tetti solo nel
  browser; senza rete/login/in tour resta `locale`.
- Pagina: `const GDB = await genesiData()`.
- Misure: `genesi-locale.mjs --offline` (rete staccata al browser) 27/27
  identiche, registrato in `tutti.mjs` (217 esecuzioni); run-kpi 2439/0
  (la porta in node torna locale da sola); emulatore `run.mjs` 81/0 con 6
  prove nuove su Genesi, nessuna riga nuova nelle regole.
- Giro node 37/37 dopo la correzione dei conti; mappa §4: blocco tolto;
  piano §5 righe 1-4 ✅; roadmap.

## Prossimo passo atomico
Tre strade, in quest'ordine di valore:
1. **Unità 8 del piano** (dipende da 3 e 4, ora fatte): Terra legge le nuvole
   di Genesi da `orgCollection('nuvole')` con seconda istanza SDK
   (`appId:'genesi'`, sola lettura, pigra — forma di `rapportiniCampo` in
   `apps/conti/conti-data.js`) e TIENE la chiave del browser come ripiego
   (`apps/terra/index.html` ~4486 legge `genesiNuvole`). Funzione pura in
   `terra-data.js` «org se c'è, chiave se no» con prova in run-kpi; il banco
   di Terra che preme `btn-dal-drone` resta verde. Sarebbe il **primo ponte
   di DATI verso Genesi**: aggiornare mappa §2/§6 (12 ponti).
2. **Unità 5**: «porta le tue volate nell'organizzazione» (copia una tantum,
   idempotente, contrassegno `genesiMigratoV1`, le chiavi locali non si
   cancellano) — vuole un bottone in Home.
3. **Unità 7**: `designLeggibile` (32 campi, valore sporco → vuoto dichiarato).
⛔ L'unità 6 (coda offline in live) è la decisione 5b del fondatore: NON si fa.

## Blocchi
Nessuno.
