# Checkpoint — 2026-09-02T19:39:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4508291e — Genesi fuori dal browser, unità 2: le volate della Home passano dalla porta

## Completato
- `apps/genesi/genesi.html`: `const GDB = genesiData()`; i sette punti di
  `genesiVolate` (renderHome, salvaVolata, apri/duplica/elimina) passano
  dalla porta; il tetto delle 50 sta nella porta. Stessa chiave sotto.
- Banco `tests/browser/genesi-locale.mjs` (17 prove; controprova cade in 8),
  registrato in `tutti.mjs` (216 esecuzioni, 88 file). Scatto guardato.
- `run-kpi` aggiornata (la pagina non tocca più genesiVolate da sé);
  `funzioni-mai-usate` senza l'eccezione di genesiData.
- Righello corretto: i due censimenti di Genesi non contavano `async
  function` (171 funzioni nella pagina, non 170; tabella di DEVELOPMENT.md
  rimisurata).
- Giro node 37/37; conti dei documenti (216 banchi, 3.332 asserzioni).
- Banchi esistenti che scrivono la chiave a mano rilanciati: verdi.

## Prossimo passo atomico
**Unità 3 del piano** (`docs/GENESI_FUORI_DAL_BROWSER.md` §5): le altre
chiavi passano dalla porta. Disegno già deciso leggendo i chiamanti:
- `genesiNuvole`: `renderHome` legge `await GDB.nuvole()` al posto di
  `_lsGet('genesiNuvole')` (riga ~4867); `nuvola-poc.html` continua a
  scrivere la chiave (è un'altra pagina: resta com'è, lo dice il piano);
- `genesiCmpA/B`: `cmpSave(slot)` → `GDB.aggiungi('confronti', {slot, ...snap})`;
  `cmpRender` e il gestore di `cmpExport` diventano async e leggono
  `await GDB.confronti()` (elenco con `slot` addosso: A = quello con slot
  'A'); `_cmpLoad` sparisce;
- `genesiRicon`: `riconStorico()` → `await GDB.riconciliazioni()`; i tre
  chiamanti (3891 in riconRender, 4007 il salvataggio → `GDB.aggiungi`,
  4014 l'export) diventano async;
- `genesiSito`: il caso delicato — `sitoStore()` è SINCRONA e alimenta
  `sitoLegge → ppvSite` in tutti i calcoli PPV. Disegno: `let SITO = await
  GDB.sito();` a livello di modulo (la pagina è un module script: il
  top-level await regge e in modalità locale costa un microtask);
  `sitoStore()` restituisce SITO, `sitoSalva(s)` fa `SITO = s; GDB.aggiungi('sito', s)`.
  La prova pretende un numero PPV letto prima e dopo, uguale.
- Il banco `genesi-locale.mjs` si estende: A/B salvati e mostrati nel
  confronto, una riconciliazione salvata e rilettura, un referto di sito
  aggiunto → chiave `genesiSito` e PPV che cambia; Terra continua a leggere
  `genesiNuvole` (già provato dal banco di Terra `btn-dal-drone`).
- Le iniezioni di `genesi-frasi-limite` (righe 94-97) citano il corpo di
  renderHome: se cambia la riga di `nv` vanno ri-ancorate.

## Blocchi
Nessuno.
