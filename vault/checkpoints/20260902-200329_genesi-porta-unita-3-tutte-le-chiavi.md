# Checkpoint — 2026-09-02T20:03:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5fbe26c2 — Genesi fuori dal browser, unità 3: A/B, riconciliazioni, legge di sito e nuvole dalla porta

## Completato
- Le cinque chiavi di Genesi passano da `GDB`; nella pagina restano solo
  `genesiSent` e il consenso. La legge di sito ha una copia di lavoro
  (`let SITO = await GDB.sito()`, top-level await) così `ppvSite()` resta
  sincrona; `sitoSalva` aggiorna copia e porta.
- `genesi-locale.mjs` copre le cinque chiavi (27 prove, controprova cade in 9).
- `genesi-foglio-in-cava`: la scena che seminava la legge di sito a mano fra
  A e B ricarica (con i ganci del banco rimessi dopo la ricarica: `ganci(pg)`).
- Censimento: 169 funzioni nella pagina, 68 estraibili; tabella rimisurata.
- Giro node 37/37, documenti allineati. Sei banchi di Genesi rilanciati: verdi.
- Piano §5: righe 1-3 ✅. Le unità 1-3 valgono da sole.

## Prossimo passo atomico
**Unità 4 del piano**: la modalità **live**. In `genesiData()`: se
`opzioni.live !== false`, provare `DeepworkID.init({ appId: 'genesi' })`
in try/catch (forma di `terraData`: vedi `apps/terra/terra-data.js` ~2159,
`mode = 'live'` solo con `authState() === 'member'`), cinque
`orgCollection` (volate, confronti, riconciliazioni, sito, nuvole); in ogni
altro caso resta `'locale'` — NON «demo in memoria». La pagina non importa
l'SDK oggi (riga 1140: «non porta dentro né Firebase né l'SDK») e il service
worker non mette in cache gstatic: senza rete l'import fallisce e il catch
DEVE riportare a locale — va misurato con `context.setOffline(true)`, non
dedotto. Prova negativa sotto emulatore in `run.mjs` (orgB non legge
`apps/genesi/volate` di orgA), copiata da `scudo/turni`; nessuna riga nuova in
`firestore.rules` (§3d). Prima di scrivere: leggere `terraData` per intero
e `shared/deepwork-id-client/index.js:227-231` (orgCollection).
⚠️ Decisione da lasciare al fondatore, NON prendere: la coda offline (unità 6,
la 5b). L'unità 4 si fa senza.
In alternativa, se il tempo è poco: la seconda passata in profondità su Conti
(Report cresciuto) o il verbale di riconciliazione (candidato 5 della ricerca).

## Blocchi
Nessuno.
