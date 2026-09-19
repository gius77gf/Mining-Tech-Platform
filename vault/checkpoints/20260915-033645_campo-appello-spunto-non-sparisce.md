# Checkpoint — 2026-09-15T03:36:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2d6870b9 (pushato)

## Cosa è stato completato

Passata in profondità su Campo (agente in background `ab81a37706f2efe38`,
verificata a mano prima di agire — «niente entra sulla parola dell'agente»):
trovato un difetto vero, della famiglia «numero tranquillo», nell'appello di
emergenza.

**Il difetto**: `appelloTurno(operatori, presenze, data, turno, squadra)`
costruiva l'elenco filtrando `operatoriDi(operatori, squadra)` sullo stato
**attuale** dell'operatore, poi cercava lo spunto di presenza per ciascuno.
Se un operatore veniva spuntato «presente» durante il turno e **dopo**
qualcuno gli cambiava lo stato anagrafico in "non-disponibile" (turno
cambiato, mansione riassegnata, ecc.), al richiamo successivo dell'appello
quell'operatore spariva dall'elenco **insieme al suo spunto**. In un
appello di emergenza (nome della funzione), un operatore realmente presente
in cava — che ha risposto all'appello — smette di comparire perché il
sistema anagrafico non lo classifica più come «in turno». È esattamente il
principio del fondatore violato nella direzione pericolosa: un dato
mancante (o cambiato) que produce un «tutto a posto» invece di un
allarme — qui l'assenza dalla lista, non un «assente» esplicito, che è
anche peggio perché nessuno lo cerca.

**Raggio d'impatto**: `appelloTurno` è la funzione condivisa da cui
dipendono — verificato leggendo i chiamanti in `campo-data.js` e
`apps/campo/index.html` — l'export CSV dell'appello, il calcolo di
conformità sulle ore di riposo obbligatorie, e il riepilogo di consegna
turno. Tutti e tre ereditano automaticamente la correzione perché chiamano
la stessa funzione pura.

**La correzione**: `appelloTurno` adesso costruisce l'elenco unendo (a) gli
operatori ancora "in ruolo" secondo `operatoriDi` esclusi i
"non-disponibile", **e** (b) gli operatori che sono **usciti** dal ruolo ma
hanno comunque uno spunto di presenza registrato per quel turno/data
("spunto orfano"): un `Set` degli id già in (a) evita i doppioni, e i
"conSpuntoOrfano" vengono filtrati sulla stessa squadra (quando dichiarata)
per non mescolare turni diversi. Il totale, i presenti, gli assenti e il
flag "completo" derivano tutti dall'elenco unito, quindi restano coerenti.

**Verifica**:
- Nuovo test in `run-kpi.mjs`: *"⛔ appello: uno spunto già fatto non
  sparisce se dopo si segna non disponibile"* — un operatore spuntato
  "presente", poi passato a "non-disponibile": verificato che resti
  nell'elenco, che il suo spunto "presente" non si perda, che il totale non
  scenda, e che un collega mai spuntato (Carla) resti correttamente fuori.
- Iniettato il difetto (`conSpuntoOrfano` neutralizzato a `[]`): il nuovo
  test cade come previsto; ripristinato, torna verde.
- Verificato che il test adiacente preesistente (operatore
  "non-disponibile" fin dall'inizio, mai spuntato) non regredisce — quel
  caso resta correttamente escluso.
- `run-kpi.mjs`: 2985/0.
- `sintassi-pagine.mjs`: 34/34.
- `numeri-nei-documenti.mjs`: inizialmente 4 scarti per il conteggio prove
  3.465→3.466 non ancora propagato nei quattro documenti cascata; corretto
  in tutti e quattro; riverificato 43/0.
- Giro isolato su worktree separata (`git worktree add --detach HEAD` +
  `git diff --cached | git apply` + `git add -A`), `giro-node.mjs` in
  background: **40 comandi a posto, 0 caduti**. Il giro ha segnalato che la
  cifra "giro completo" nei documenti era stale (3.930 invece di 3.931);
  corretta in `DEVELOPMENT.md` e `STATO_PRODOTTO.md`, riverificato
  `numeri-nei-documenti.mjs` 43/0.
- `git status --short` confermato **prima** del commit: esattamente i 6
  file intesi (`apps/campo/campo-data.js`, `apps/deepwork-id/tests/run-kpi.mjs`,
  `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
  `vault/ROADMAP_SETTIMANA.md`), niente di più.
- `git show --stat HEAD` dopo il commit: confermati gli stessi 6 file.
- Push riuscito: `02adc41a..2d6870b9`.

## Stato roadmap

B3 (Genesi legami) e B12 (core calotta galleria) chiusi in questa finestra.
Scudo appalti (messaggio per id) chiuso. Campo appello (spunto non sparisce)
chiuso adesso. Nessun'altra voce aperta identificata al momento in
`vault/ROADMAP_SETTIMANA.md` — si prosegue con la lista di ripiego del
mandato standing (seconde iterazioni / passate in profondità sulle app non
ancora toccate questa finestra: Flotta, Conti, Sentinella, Terra).

## Prossimo passo atomico

Lanciare una passata in profondità (agente in background, come già fatto
per Scudo e Campo) su **Flotta**: aprire ogni schermata, premere ogni
bottone che produce un file/export e aprire il file prodotto, cercare
numeri tranquilli dove non è stato misurato niente — sul modello esatto
del mandato già usato per Campo (`ab81a37706f2efe38`) e Scudo
(`a0c84a333738e2e5f`), citando `grep` verificabili e includendo un elenco
dei falsi allarmi scartati. Nel frattempo, se non ci sono altre unità
pronte da chiudere subito, verificare a mano (senza fidarsi della parola
dell'agente) ogni candidato non appena il report arriva, seguendo la
disciplina già rodata: fix → test con difetto iniettato → giro isolato su
worktree → `git status --short` prima del commit → checkpoint → push.

Nessuno stop volontario: si prosegue subito.
