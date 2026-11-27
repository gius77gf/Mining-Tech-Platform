# Checkpoint — 2026-09-15T07:49:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c1e32a37 (pushato)

## Cosa è stato completato

Chiuso il finding del terzo giro di ricerca in background (Terra, Flotta,
Campo — vedi i checkpoint precedenti e successivi per gli altri due).
Riverificato a mano prima di agire: lettura diretta del codice, riproduzione
indipendente in `node -e`, non la parola dell'agente.

**Il difetto**: cinque funzioni di `apps/campo/campo-data.js`
(`anomalieAperte`, `storicoSettimana`, `registrazioniSenzaGiorno`,
`fermiPerGiorno`, `disponibilitaTurno`) confondevano `fermoMin: 0` (un
fermo cronometrato DAVVERO a zero minuti — si è fermato e non è costato
niente) con `fermoMin: null` (mai cronometrato), mentre `minutiFermoDi`
(fonte unica dal 07/08, già usata da `paretoFermi`/`csvAttivita`) le
distingue correttamente. `disponibilitaTurno` si contraddiceva perfino da
sola: il suo `par` (da `paretoFermi`) usava già `minutiFermoDi`, ma
`conMinuti` due righe sotto ricopiava il confronto debole.

Il 14/08 questa divergenza era stata trovata e **deliberatamente lasciata
aperta** come "decisione di prodotto", con sei prove di sorveglianza a
tenerla sotto controllo. Riletta oggi: non era una biforcazione legittima,
`minutiFermoDi` esisteva già da prima e copriva già metà dell'app. Chiusa
portando i cinque punti a chiamarla invece di ricopiarne il confronto.

**Verifica**:
- Corretti anche due test locali che usavano `fermoMin: 0` per intendere
  "mai misurato" (uno in `disponibilitaTurno`, uno in `anomalieAperte`) —
  cambiati a `fermoMin: null`, e aggiunta l'asserzione mancante per il caso
  vero (`fermoMin: 0` → calcolabile).
- Le sei prove di sorveglianza del 14/08 riscritte da "NON dicono la stessa
  cosa" (5 contro 1) a "sono tutti d'accordo" (0 contro 6), stesso schema
  di verifica, verdetto capovolto onestamente.
- `run-kpi.mjs`: 2991/0 (nessun nuovo `test()`, solo asserzioni dentro
  quelli esistenti + riscritture). `run-stile.mjs`: 328/0.
  `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/0 (nessun
  aggiornamento cascata necessario, il conto non è salito).
- Controprova: rimessi i cinque siti alla forma vecchia con uno script
  python di sostituzione mirata — le sei prove di sorveglianza e le due
  prove locali cadono, tutte con il messaggio atteso; ripristinato via
  `cp` + `diff -q`, riverificato verde.
- Giro isolato su worktree separata (scoped esattamente ai due file di
  questa unità): **40 comandi a posto, 0 caduti**.
- `git status --short` verificato prima del commit: esattamente i 2 file
  intesi (il resto — Terra, i quattro documenti — restava fuori dall'indice,
  verificato con `git diff --cached -- run-kpi.mjs | grep "^@@"` per
  confermare che gli hunk staged fossero solo quelli di Campo).

## Nota di processo

Durante il blocco precedente (unità Scudo `kpiFrom`), un `git add` di due
soli file per correggere il nome di un checkpoint mal datato ha inglobato
per errore anche i file già staged dell'unità Scudo, che sono finiti nello
stesso commit (`aad3f77b`) invece che in uno separato — entrambi i
contenuti erano comunque già verificati e corretti, quindi nessun danno
funzionale, solo un confine di commit meno pulito del solito.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata).

## Prossimo passo atomico

Terra (fronte conteso fra due lotti) è già corretto e testato in locale,
non ancora committato: prossimo passo è il giro isolato su worktree e il
commit di quell'unità. Poi resta da decidere su Flotta
(`urgenzaManutenzione` vs `tagliandiInScadenza`, tie-break su scale diverse
— verificato, ma la correzione tocca una decisione di design sui campi che
la voce "vincente" porta con sé, quindi va presa con più cura, non a
sportello). Nessuno stop volontario: si prosegue subito con Terra.
