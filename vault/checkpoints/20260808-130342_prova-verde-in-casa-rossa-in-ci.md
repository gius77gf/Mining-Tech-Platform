# Checkpoint — 2026-08-08 13:03 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`5465b7c` — fix(test): la prova del primo avvio era verde in casa e rossa in CI

## Che cosa è stato completato

La CI è caduta su `b940756`, cioè sul **mio** commit precedente: le due prove
aggiunte a `run-bootstrap.mjs` passavano qui e cadevano là.

**La correzione allo script regge** — fondere le rivendicazioni invece di
sostituirle era un difetto vero e resta corretto. Era la **prova** a chiedere la
cosa sbagliata nel posto sbagliato.

### La causa, che vale oltre questo caso
Le rivendicazioni le scrivono in **due**: `bootstrap-owner.mjs` e il trigger
`onMemberWrite` → `rebuildClaims`, che le ricostruisce **dalle membership vere**
e scrive `{ orgs }` e basta. Qui l'emulatore delle **funzioni** non parte (la
politica di rete del contenitore lo nega), quindi la misura di casa vedeva un
mondo con **un solo scrittore**; la CI ne ha due. Stessa suite, stesso nome,
**due prove diverse**.
La regola nuova, scritta in `CLAUDE.md`: *sotto l'emulatore, prima di scrivere
un'asserzione su uno stato, si chiede **chi altro lo scrive in CI** — e se la
risposta è «un trigger», quell'asserzione lì non ci va.*

### Che cosa è stato fatto
- **nuovo** `apps/deepwork-id/tests/bootstrap-rivendicazioni.mjs` — 7 asserzioni
  con due finti, **senza emulatore**, quindi la risposta è la stessa nei due
  posti. Soggetto: ciò che `bootstrapOwner` **scrive**, non lo stato finale.
- **controprova sul FILE VERO**: iniettata la riga di prima → **2 asserzioni
  cadono, uscita 1**; ripristinato da copia `cp` + `diff -q` (mai
  `git checkout`), e ricontato `grep -c attuali` = 3.
- `run-bootstrap.mjs` torna a **8**, con dentro il racconto del perché quelle
  due prove non possono vivere lì.
- La seconda prova **tolta, non spostata**: pretendeva la conservazione di una
  rivendicazione diversa da `orgs`. Misurato: le rivendicazioni le scrivono in
  due e ne esiste **una sola** che qualcuno legga — `orgs`, letta dalle regole
  (`request.auth.token.orgs`) e dall'SDK (`token.claims.orgs`). Pinnarne
  un'altra voleva dire blindare un'invenzione, in contrasto con `rebuildClaims`.
- **La quarta forma di invecchiamento, per la seconda volta in due giorni**:
  `CLAUDE.md` dichiarava `run-bootstrap.mjs` = **10** e
  `numeri-nei-documenti` passava, perché quel numero **non è nel suo elenco**.
  Ora è 8, e la suite nuova entra nel numero **sorvegliato** (2.326 → **2.333**,
  sette suite): sono prove di comportamento senza rete e senza browser, cioè
  esattamente ciò che l'etichetta promette.
- Trovata di passaggio una **discordanza fra due documenti sullo stesso
  addendo** (75 contro 68 sulle regole di sicurezza): allineati.
- Dentro c'è anche l'unità SDK di ieri sera, già verde e non committata: dopo un
  cambio di org **rifiutato** lo stato deve restare quello di prima, e a
  proteggerlo era solo l'**ordine** delle righe in `switchOrg`.
  ⚠️ Detto onestamente: la mia prima ipotesi era **sbagliata** — il caso «membro
  che passa a un'org estranea» una prova negativa ce l'aveva già.

## Verifiche
- giro `node` **27/27** sul disco **e** sulla copia di ciò che si committava
  (worktree da `HEAD` + `diff --cached` + `add -A`, patch **identica**);
- sotto emulatore: **Bootstrap 8/0** e **SDK 19/0**
  (`firebase emulators:exec --only firestore,auth --project demo-deepwork`);
- `suite-collegate` vede 110 file: la suite nuova **è** in `npm test`.

## Stato roadmap
Invariato nei task; questa è una correzione nata dalla CI.

## Prossimo passo atomico
**Raccogliere il giro del browser** (PID 16670, avviato ~11:10Z su una copia di
`c3888fe`, registro in `scratchpad/nomi4/giro-nuovo.txt`) con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`:
**sezione 1 prima della 2**, e leggere la riga «le tre passate più lente» per
ritarare il limite di 30 minuti.
⚠️ Attesta `c3888fe`: le unità dopo (contrasto, unità nude, regole negative,
primo avvio, questa) **non ci sono dentro**.
⚠️ E nel registro il rosso di una **controprova** è il verde del banco: le
intestazioni adesso lo dichiarano, si legge quella riga prima di aprire un
cantiere su un KO.

## Blocchi
Nessuno. `run-fns.mjs` (21) resta verificabile **solo in CI**: vuole l'emulatore
delle funzioni, che qui non parte perché chiede la rete.
