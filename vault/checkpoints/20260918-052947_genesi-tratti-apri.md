# Checkpoint — 2026-09-18T05:29:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
31d5bfa3

## Cosa è stato completato
Primo dei difetti confermati del backlog: Genesi, `D2.tratti` non veniva
azzerato riaprendo (bottone "Apri") una volata il cui `design` salvato non
aveva `tratti` — un tratto disegnato prima restava attaccato al progetto
appena caricato. Corretto con un deep-copy (`(arr[i].design?.tratti ||
[]).map(...)`), stesso pattern già usato da `d2ApplySnap`. Nuovo banco
browser (`genesi-tratti-non-persistono-su-apri.mjs`, iniezione diretta
via `window.__genesi.D2` invece di simulare i click sul canvas),
controprova verificata in entrambe le direzioni, registrato in
`tutti.mjs`. Giro isolato (worktree, due passaggi per correggere i numeri
nei documenti dopo la misura vera): 41/41, **4121** asserzioni, **341**
banchi browser, **150** file di banco distinti.

Nel frattempo, mentre il giro isolato girava, sono stati preparati (non
ancora committati) altri tre lavori, tutti verificati a livello di unità
ma NON ancora passati per un giro isolato completo:
1. **Flotta**: fix del doppio invio su `btn-rif`/`btn-cos` (`occupato()`),
   nuovo banco `flotta-doppio-invio.mjs` — controprova verificata in
   entrambe le direzioni (7→9 e 10→12 col difetto rimesso, invece di
   7→8 e 10→11), registrato in `tutti.mjs`.
2. **Sicurezza CRITICA — Deepwork ID** (dal deep-pass di
   addc188f0a5cb5926): un admin di un'organizzazione poteva dirottare un
   proprio invito pendente verso un'organizzazione concorrente cambiando
   il campo `orgId` con una scrittura diretta — la regola Firestore
   controllava solo `isAdmin(resource.data.orgId)` (l'org di PRIMA della
   scrittura), non quella nuova. Corretto rendendo `orgId` immutabile
   sull'update (`request.resource.data.orgId == resource.data.orgId`) in
   `apps/deepwork-id/firestore.rules`. Due nuovi test in `run.mjs`
   (il dirottamento fallisce; un update legittimo senza toccare l'org
   continua a funzionare). Rilanciata l'intera suite delle regole
   sull'emulatore Firestore: **93 passati, 0 falliti** (era 91).
3. **Scudo**, primo dei due difetti dal quarto giro di deep-pass
   (a76e56f7569610db8): `abilitazioneLavoratore`/`pillReq` gestivano solo
   3 dei 4 stati che `statoScadenzaHSE` sa dire — mancava "senza data" (un
   requisito con la scadenza illeggibile spariva da bloccanti/attenzioni e
   la pastiglia lo disegnava come "in ordine", verde). Aggiunto il ramo
   mancante in entrambi i posti (mirror del ramo già esistente per i DPI).
   Nuovo test in `run-kpi.mjs` con controprova verificata (KPI: 3129→3130).

## Stato roadmap
Difetti confermati e ancora da correggere/committare, in ordine:
1. **Flotta** — PRONTO per il giro isolato e il commit (vedi sopra).
2. **Sicurezza Deepwork ID (CRITICO)** — PRONTO per il commit (il giro
   isolato `node` non copre `run.mjs`, che vuole l'emulatore Firestore;
   già rilanciato a mano: 93/0). Priorità alta per la natura del difetto
   (rottura dell'isolamento multi-tenant, il requisito fondante).
3. **Scudo, difetto 1/2** (abilitazioneLavoratore) — PRONTO per il commit.
   Resta il difetto 2/2 dello stesso agente: `csvRegistroInfortuni`
   (`apps/scudo/scudo-data.js:2427-2454`) non esporta
   categoria/anonimato/gravitaPotenziale dei near-miss — mostrati a
   schermo, persi su export→reimport. NON ancora affrontato.
4. **Conti**, due difetti dal quinto giro di deep-pass
   (a8b791e876bd4d072), NON ancora corretti — vedi checkpoint
   20260918-045355 per i dettagli:
   - una fattura "come non emessa" (scartata dallo SdI) resta credito
     vero in sei funzioni (kpiFrom, agingIncassi, ecc.);
   - `rigaPesata` non applica mai gli scaglioni di quantità, a differenza
     di `rigaPreventivo` — il più delicato, tocca un prezzo di vendita.

## Prossimo passo atomico
1. **Committare Flotta**: costruire una worktree isolata copiando SOLO
   `apps/flotta/index.html`, il nuovo
   `apps/deepwork-id/tests/browser/flotta-doppio-invio.mjs`, e le due
   righe già aggiunte a `tutti.mjs` per questa unità (isolarle da quelle
   di Genesi, già committate, e dalle prossime di Scudo/sicurezza —
   tecnica della riga 3512 di questo file, o layering con
   `hash-object`/`update-index --cacheinfo` se serve). Lanciare
   `giro-node.mjs`, correggere i numeri nei documenti sulla misura VERA
   (non indovinarli), ricontrollare, commit, checkpoint, push.
2. **Committare la sicurezza Deepwork ID**: `apps/deepwork-id/firestore.rules`,
   `apps/deepwork-id/tests/run.mjs`, più le tre righe doc (91→93,
   139→141, in DEVELOPMENT.md/STATO_PRODOTTO.md/DECISIONI_WEEKEND.md —
   già scritte nel working tree). Questo file non passa dal giro `node`
   (run.mjs è escluso, vuole l'emulatore): verificare invece rilanciando
   `cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec
   --only firestore --project demo-deepwork "cd tests && node run.mjs"`
   sulla worktree isolata prima di committare, poi comunque il giro
   `node` completo per sincronizzare i numeri dei documenti (91→93 non
   tocca banchi/KPI, quindi non dovrebbe cambiare l'asserzioni-totale del
   giro `node`, ma va verificato, non assunto).
3. **Committare Scudo, difetto 1/2**: `apps/scudo/scudo-data.js`,
   `apps/scudo/index.html`, `apps/deepwork-id/tests/run-kpi.mjs` (il
   nuovo test, KPI 3129→3130) — worktree isolata, giro, numeri, commit.
4. Poi: Scudo difetto 2/2 (csvRegistroInfortuni), Conti (SdI-come-non-
   emessa, poi scaglioni su `rigaPesata`).
5. Continuare a dare priorità al fix del backlog rispetto a nuove
   scoperte di ricerca, per non lasciarlo allungare ulteriormente.

## Blocchi
Nessuno.
