# Checkpoint — 2026-09-15T06:38:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7dc35407 (pushato)

## Cosa è stato completato

Chiuso il difetto trovato dal secondo giro di ricerca in background su Conti
(insieme a Sentinella, secondo passaggio — vedi le sub-agent-handback
precedenti alla compattazione). Riverificato a mano prima di agire: lettura
diretta di `statoFattura` (righe 3900-3959 di `apps/conti/conti-data.js`) e
di `statoIncasso`, più uno script `node -e` di riproduzione.

**Il difetto**: `statoFattura`, nel ramo "saldata" (`residuo === 0 &&
s.incassato > 0`), restituiva `{ ...s, stato: "saldata", ... }` ereditando
tutti i campi di `statoIncasso` **senza sovrascrivere `parziale`**. Con un
incasso parziale (7000 su 10000) seguito da una nota di credito che azzera
il residuo (3000), `s.parziale` restava `true` da `statoIncasso` e l'oggetto
finale dichiarava contemporaneamente `saldata:true` e `parziale:true` — una
contraddizione interna. Riprodotto: `statoFattura({importo:10000}, [{...,
importo:7000}], [{...,totale:3000}])` → `{stato:'saldata', saldata:true,
parziale:true}`.

Nessuna schermata mostra oggi le due bandiere insieme (i template
controllano prima `stato==="saldata"`), quindi non è un difetto visibile in
produzione — ma è la stessa famiglia già chiusa oggi con `testoSollecito`
(la bandiera `nonEmessa` letta da un consumatore diverso dallo schermo): un
contratto interno inconsistente che aspetta solo un secondo lettore.

**Osservazione ulteriore, non ancora affrontata in questa unità**: durante
la verifica ho trovato che `applicaIncassi` (riga 2269) decora l'array
`FAT` visibile a schermo usando solo `statoIncasso` — **senza le note**
(`index.html:3249` chiama `FAT = applicaIncassi(FATG, INC)` senza `NOT`).
Il badge (`fatBadge`) è protetto (controlla prima `stornatoDi`), ma il
colore di riga e il testo meta nella lista fatture (righe ~3400-3449)
possono restare su un accento "parziale" anche quando il sotto-testo del
residuo (che chiama `statoFattura(f, INC, NOT)` fresco) dice già "saldata".
Portata più larga (filtri, conteggi, stile su tutta la schermata Fatture):
**non corretto qui**, per la regola "misura prima di irrigidire" — da
riprendere come unità a sé.

**La correzione**: aggiunto `parziale: false,` esplicito nel ramo "saldata"
di `statoFattura`, con commento che rimanda al parallelo di oggi con
`testoSollecito`.

**Verifica**:
- Nuovo test in `run-kpi.mjs`: "⛔ Conti · statoFattura: «saldata» e
  «parziale» non sono mai vere insieme (15/09)", con lo stesso schema
  fixture di `FAT`/incassi/note già in uso.
- Controprova: rimesso il vecchio ramo (senza `parziale:false`), il test
  cade esattamente sull'asserzione attesa; ripristinato e riverificato.
- `run-kpi.mjs`: 2990/0. `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`:
  34/34. `numeri-nei-documenti.mjs`: 43/0 (cascata aggiornata 2989→2990,
  3.470→3.471 in tutti e quattro i documenti).
- ⚠️ Trovata e corretta, scrivendo questa cascata, una rottura auto-inflitta
  della regex `RE_SOMMA_SCRITTA` in `docs/DEVELOPMENT.md`: avevo scritto
  «...in `statoFattura` (Conti): 2990 + 328 + ...» — la parentesi di
  `(Conti)` annidata dentro la parentesi sorvegliata tagliava la cattura
  `[^)]*` al primo `)` incontrato, esattamente il difetto già descritto in
  questo file (CLAUDE.md) sui template annidati/parentesi. Corretto scrivendo
  «di Conti» senza parentesi.
- Giro isolato su worktree separata (`git diff --cached | git apply`,
  scoped esattamente ai sei file di questa unità): **40 comandi a posto, 0
  caduti**. La cifra "asserzioni eseguite dal giro" (3.937, misurata fresca)
  è stata scritta in `DEVELOPMENT.md`/`STATO_PRODOTTO.md`.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Segnata come
follow-up NON fatta: l'osservazione su `applicaIncassi`/riga-colore della
lista Fatture (vedi sopra) — da riprendere con una ricerca/unità a sé, dato
il raggio più ampio.

## Prossimo passo atomico

Indipendentemente da questa unità, arrivato l'esito della ricerca in
background su Deepwork ID (3 findings, tutti riverificati a mano):
- **A** (verdetto scaduto in `docs/REVISIONE_SICUREZZA_202607.md`): fix in
  corso nella prossima unità (verrà committata separatamente).
- **B** (limite di `convergiClaims` con 3+ scritture): meccanismo
  riprodotto indipendentemente in scratchpad, test aggiunto a
  `claims-convergenza.mjs` (19→22 prove) — nella prossima unità.
- **C** (DDT/`pesate` di Conti fuori da `documentoEmesso`): candidato di
  prodotto/policy di sicurezza, richiede una decisione del fondatore (come
  le "tre domande" dello stesso documento) — NON implementato, da segnalare
  in roadmap come domanda aperta, non da correggere di iniziativa.

Nessuno stop volontario: si prosegue subito con la unità A+B (già pronta,
solo da ricomporre e committare).
