# Checkpoint — 2026-09-17T22:49:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c7d3ddef

## Cosa è stato completato
Fix del difetto trovato dal terzo giro di deep-pass su Conti (agente
a5fa955d5c679000d): "Fattura differita dai DDT" mescolava DDT di
clienti diversi (Edilcave + Stradesud) nell'anteprima e nei totali
finché nessun cliente era scelto nella tendina `dif-cli`. Causa:
`difVisibili()` in `apps/conti/index.html` chiamava `pesateDaFatturare`
senza guardia sul valore vuoto — funzione il cui contratto generale
(non filtrare senza `clienteId`) è corretto e provato altrove, ma la
pagina lo usava per un flusso che si presenta esplicitamente come "un
cliente solo". Corretto rendendo `difVisibili()` vuota finché `dif-cli`
non ha un valore.

Nuovo banco `conti-differita-cliente.mjs` con controprova (registrato in
`tutti.mjs`), verificato dal vivo con Playwright prima e dopo. Giro
completo su worktree isolata: 41/41, 4099 asserzioni (i due documenti
che dichiaravano 4098 sono stati corretti).

In parallelo (background, non ancora integrati in questo commit):
- Ricerca continua su Conti (topic più stale, agente a6ca19c8e53902d3c):
  append in `docs/RICERCA_CONTINUA_CONTI.md`, undicesimo giro sulla
  revisione prezzi obbligatoria negli appalti pubblici (D.Lgs 36/2023
  art. 60). Tre proposte a costo piccolo/medio, tutte sulla struttura
  dati mancante (durata fornitura, garaId↔fatturato, indici dichiarati),
  nessuna formula di calcolo pronta — cautela esplicita perché le soglie
  di legge sono di seconda mano. Non ancora deciso se implementare.
- Terzo giro deep-pass su Scudo (agente ac03391fa217e0877): un difetto
  vero trovato — nel Quadro, una scadenza di "verifica periodica
  attrezzatura" che diventa anche scaduta/in-scadenza compare DUE VOLTE
  con due badge discordanti (uno specifico da `verificheDaSistemare`,
  uno generico "Scadenza aziendale" da `urg` senza deduplica). Non
  ancora fixato.
- Terzo giro deep-pass su Genesi (agente a200d8450deefcbef): ancora in
  corso, nessun esito ricevuto.
- Verifica indipendente della proposta Terra/falda (grep confermato) e
  implementazione della parte a basso costo (vedi prossimo passo:
  ancora da committare, sull'altra worktree `wt-terra2`).

## Stato roadmap
Terzo giro di deep-pass: Sentinella ✅, Conti ✅ (questo commit), Scudo
(difetto trovato, da fixare), Genesi (in corso).

## Prossimo passo atomico
1. **Fixare il difetto Scudo** (agente ac03391fa217e0877): nel Quadro
   (`apps/scudo/index.html`, la funzione di rendering dentro `refresh()`,
   intorno alle righe 2425-2452), la lista `urg` (scadenze generiche
   scadute/in-scadenza, righe ~2432 e seguenti) non esclude le scadenze
   già rappresentate in `verUrg` (quelle con `scadenzaDiVerifica(s)===true`,
   gestite da `verificheDaSistemare`). Quando una "verifica periodica
   attrezzatura" diventa scaduta/in-scadenza, compare due volte nello
   stesso `#urg-list`: una volta col badge specifico e corretto (es. "Non
   idonea"), una volta col badge generico "Scaduta"/"Scadenza aziendale"
   che perde l'informazione di sicurezza. Fix: `urg` deve escludere gli id
   già presenti in `verUrg` prima di concatenare. Aggiungere test/banco
   con controprova (iniettare una scadenza di verifica periodica scaduta
   nella risposta HTTP, verificare che compaia una sola volta in
   `#urg-list`). Poi il solito giro isolato, commit, checkpoint.
2. **Chiudere e committare l'unità Terra** (worktree `wt-terra2` già
   avviata con `--solo=terra`, verificare il suo esito quando la notifica
   arriva, poi commit separato: `apps/terra/terra-data.js` — nuova voce
   `acque` in `TIPI_SCADENZA_TERRA` — + test in `run-kpi.mjs` + append di
   chiusura in `docs/RICERCA_CONTINUA_TERRA.md`). Occhio ai numeri nei
   documenti: con questo unico aggiunto, KPI sale a 3117 (dai 3116 di
   questo checkpoint) e il totale del giro `node` di conseguenza — va
   rimisurato con un giro fresco sulla worktree Terra, non dedotto.
3. Verificare l'esito del deep-pass Genesi quando arriva, e valutare se
   contiene difetti da fixare.
4. Decidere se/quando implementare le proposte di ricerca su Conti
   (revisione prezzi PA) — costo piccolo/medio, ma serie: da trattare
   come unità a sé, non di corsa.
5. Mantenere ≥3 cantieri paralleli; ridispatchare non appena uno libera
   uno slot.

## Blocchi
Nessuno.
