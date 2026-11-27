# Checkpoint — 2026-09-02T19:22:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7254452a — Genesi fuori dal browser, unità 1: la porta sui dati sopra le stesse chiavi

## Completato
- `genesiData({storage})` in `apps/genesi/genesi-data.js` (blocco G8): la
  forma delle porte di Terra e Conti, asincrona, sopra le cinque chiavi di
  `localStorage` della pagina, stessi nomi/forme/tetti (50 volate, 30
  lavorazioni), stesse risposte al JSON corrotto. Storage iniettabile.
- Prove in `run-kpi` (2 sincrone + 3 in volo, messe PRIMA dell'`await`):
  2438 → **2440**; i tetti letti dal sorgente della pagina e di nuvola-poc.
- Copertura genesi-data 69 → **71**; `funzioni-mai-usate` guarda da oggi anche
  `genesi-data.js` (misurato: 768 funzioni, un solo allarme nuovo,
  `genesiData` dichiarata DA COLLEGARE entro il 09/09).
- Piano `docs/GENESI_FUORI_DAL_BROWSER.md` §5: riga 1 ✅; roadmap; conti dei
  documenti rimisurati (2.921 prove, 3.331 asserzioni, condivisi 189/189).
- Giro node 37/37.
- La pagina di Genesi NON è cambiata di un byte (per scelta del piano).

## Prossimo passo atomico
**Unità 2 del piano**: la pagina usa la porta per `genesiVolate` (7 punti:
`renderHome` 4850/4856, `salvaVolata` 4867/4884, il gestore dei bottoni
4890/4902/4907/4912). Forma: `import { genesiData } from './genesi-data.js'`
nell'import esistente (riga 1121), `const db = genesiData();` accanto alle
altre costanti di modulo (⚠️ NON `db` nudo: alla riga 5879 c'è un
`const db=$('diDel')` locale — usare `gdb` o simile per non pestarlo),
`renderHome` diventa `async` (7 chiamanti: 4742, 4884, 4905, 4907, 4912,
4941 — nessuno legge il valore di ritorno). Le due iniezioni di
`genesi-frasi-limite.mjs` (righe 94-97) citano il corpo di `renderHome`
testualmente: se la riga cambia vanno ri-ancorate, e `iniezioni-fresche` lo
dice. Poi il banco nuovo `tests/browser/genesi-locale.mjs`: salva una volata
dalla Home → la chiave `genesiVolate` contiene 1 record con nome/data/design/
sintesi/id; ricarica → la Home la mostra; elimina → chiave vuota; con
`--controprova` si rimette `_lsGet` al posto della porta in un punto e si
pretende che cada. Registrarlo in `tutti.mjs`. Togliere `genesiData` da
ACCETTATE in `funzioni-mai-usate` (la prova «eccezione vecchia» lo pretende).
I banchi esistenti che scrivono `genesiVolate` a mano restano verdi per
costruzione: è la stessa chiave.

## Blocchi
Nessuno.
