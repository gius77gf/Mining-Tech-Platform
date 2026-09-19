# Checkpoint — 2026-09-15T20:09:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
afa64c4a

## Cosa è stato completato
Chiusi gli ultimi due lettori CSV "muti" trovati dalla riverifica del
15/09 su `docs/RICERCA_CONTINUA_ASSENZA.md` (documento invecchiato: 6
delle 8 voci originarie erano già risolte da commit non tracciati dal
documento, ne restavano 2 vere: `scudo/infortuni` e
`sentinella/monitoraggi`).

- `apps/scudo/scudo-data.js`: nuova `scartiInfortuniCsv(text)`, sul
  modello di `scartiRilieviCsv` — rilegge il CSV riga per riga,
  distingue una riga vuota da una scartata per data mancante/non
  esistente, ragione dichiarata per ogni riga persa.
- `apps/scudo/index.html`: import + wiring — `frasePersi(scartate)`
  appeso sia al messaggio d'errore "Nessuna riga valida" sia al
  messaggio di successo "Import registro: ...".
- `apps/sentinella/sentinella-data.js`: nuova
  `scartiMonitoraggiCsv(text)`, stesso pattern con ragione a cascata
  (nome→valore→soglia).
- `apps/sentinella/index.html`: import + wiring — stessa forma, sui
  messaggi dell'"Import sensori".
- `apps/deepwork-id/tests/run-kpi.mjs`: censimento B9 aggiornato
  19→21 `scarti*Csv` derivati dal disco; nuova tabella dedicata
  "B5-bis (15/09)" con le ragioni esatte per entrambe le funzioni;
  fixture `CSV_INF`/`CSV_MON` aggiunte a `coppie`.
- Doc-cascade aggiornato con i numeri REALI misurati (non stimati):
  `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md` →
  run-kpi 3032→3033, somma nove suite 3.516→3.517, asserzioni giro
  completo 3.939→3.940, copertura 1015/1015→1017/1017, e il
  denominatore del giro corretto da valori già stale prima di questa
  unità (22/34→26/40 comandi con riga da sommare, 12/13→14 nominati).

## Verifica
- `run-kpi.mjs`: 3033 passati, 0 falliti.
- `run-stile.mjs`: 328 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34 passati, 0 falliti (le due pagine toccate
  compilano).
- `copertura-funzioni.mjs`: 0 funzioni scoperte, 1017/1017.
- Controprova (nei due versi, `cp`+`diff -q` per il ripristino):
  disattivata la guardia in `scartiInfortuniCsv` → B5-bis e B9 cadono
  (3 falliti); ripristinato, byte-identico; stessa cosa su
  `scartiMonitoraggiCsv`.
- Giro completo su worktree isolata (`HEAD` + `git diff --cached |
  git apply` + `git add -A`): 40 comandi, inizialmente 1 caduto
  (`numeri-nei-documenti.mjs`, per lo scarto atteso fra le cifre
  vecchie nei documenti e quelle reali appena misurate) — corretto e
  riverificato: `numeri-nei-documenti.mjs` 43 passati, 0 falliti.

## Stato roadmap
`vault/ROADMAP_SETTIMANA.md` aggiornato con la nuova cifra delle prove
e la voce nella catena narrativa 3032→3033.
`docs/RICERCA_CONTINUA_ASSENZA.md` (commit precedente `d89bd5a2`) resta
la fonte della riverifica; questa unità ne traduce in codice la parte
sicura e ungated (nessuna decisione del fondatore richiesta: la
funzione dichiara solo le righe scartate, non introduce soglie né
giudizi di prodotto).

## Prossimo passo atomico
Applicare la stessa disciplina di riverifica ("niente entra sulla
parola dell'agente", stavolta su un DOCUMENTO invecchiato invece che su
una ricerca fresca) a `docs/RICERCA_CONTINUA_PAROLE.md`, l'altro tema
trasversale fissato da tempo (dal 04/09) e non ancora riverificato in
questo ciclo: lanciare un agente che rilegga ogni proposta P1..Pn del
documento contro il codice attuale con `grep`/`Read` diretti (non
fidandosi del testo del documento), dichiari quali sono ancora vere,
quali sono state risolte nel frattempo, e quali erano già sbagliate
alla scrittura — poi, se il residuo è piccolo e sicuro, tradurlo in
un'unità di codice con lo stesso schema di questa (funzione +
wiring + test + controprova + doc-cascade).

## Blocchi
Nessuno.
