# Checkpoint — 2026-09-15T16:56:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9863ed41

## Cosa è stato completato
Due unità.

**Unità 31 — prima fetta del delta TCO di Flotta: `etaMezzo`.** Per la
disciplina "scomposizione prima di scrivere codice" (già applicata a
Terra e Genesi in questa sessione), presa UNA sola delle quattro
funzioni proposte dal settimo giro di ricerca, la più piccola e senza
dipendenze: `etaMezzo(mezzo, oggi)` calcola l'età in anni da
`messaInServizio`, o da `possessoDal` come ripiego, mai un'età
negativa su una data futura (dichiara `misurabile:false` invece di
sottrarre al contrario — principio del fondatore). Agganciata a
`fascicoloMezzo().eta` e al libretto CSV, dove il flag `misurabile`
viene davvero LETTO prima di scrivere la riga (regola 20 di
run-stile: una bandiera dichiarata e non letta non protegge niente).

Durante la scrittura dei test è emerso un errore mio, non del
prodotto: avevo calcolato a mano "917 giorni" usando l'`OGGI`
sbagliato — quello file-level (2026-07-20), mentre il mio test era
annidato dentro un blocco con un `OGGI` di sezione shadowato
(2026-07-31T10:00:00). Corretto usando una data locale al test
(`const D = new Date(...)`), non un valore preso in prestito
dall'ambiente circostante — esattamente la lezione di questo
repository sulle "copie deboli" applicata ai TEST invece che al
codice di prodotto.

**Unità 32 — riverifica del giro di ricerca su Deepwork ID** (arrivato
via subagent handback, sui ruoli DENTRO un'organizzazione — la
domanda aperta lasciata scritta in CLAUDE.md sotto MULTI-TENANT).
Rilanciati i tre grep citati, tutti e tre confermati identici
all'uscita dichiarata: `isAdmin(orgId)` somma la gestione inviti e la
cancellazione di documenti emessi di qualunque app sotto lo stesso
predicato (5 righe); zero meccanismo di Billing Admin; `appRoles`
resta un commento non implementato. Committato l'append di ricerca,
nessun codice toccato.

Con questa il conto delle ricerche riverificate di persona oggi sale a
6 su 6.

## Verifica
- `run-kpi.mjs`: 3022 passati, 0 falliti (era 3021)
- `run-stile.mjs`: 328 passati, 0 falliti (incluso il controllo sulla
  regola 16, `useGrouping` dichiarato esplicitamente sul nuovo
  `toLocaleString("it-IT")`)
- Controprova su `etaMezzo`: iniettato il difetto (possessoDal prima
  di messaInServizio), la prova nuova cade; ripristinato byte-identico
  (`diff -q` pulito)
- `copertura-funzioni.mjs`: 0 funzioni scoperte (1013/1013)
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti dopo la correzione
  della cascata (era 37/6 subito dopo l'unità, per il drift atteso)
- Giro isolato su worktree (`giro-node.mjs`): 39/40 comandi a posto,
  l'unico caduto è `numeri-nei-documenti.mjs` — atteso, perché la
  worktree misurava il codice PRIMA della correzione dei documenti.
  Ha anche corretto una cifra vecchia: "asserzioni eseguite dal giro"
  era dichiarato 3.971 nei documenti ma il giro ne esegue davvero
  **3.929** — non un difetto di oggi, un numero stimato che non era
  mai stato rimisurato da tempo; corretto a valore reale.
- Grep di riverifica su Deepwork ID: tre comandi rilanciati, uscita
  identica a quella citata dall'agente
- Push riuscito al primo tentativo su tutt'e tre i commit:
  `9b91fb93..3838333d`, `3838333d..9863ed41`

## Stato roadmap
Flotta: prima fetta del delta TCO fatta e verificata. Restano le altre
tre proposte del settimo giro (ammortamento in `costoOrarioMezzo`, TCO
completo, soglia di sostituzione) — non prese oggi, per la stessa
disciplina di scomposizione: vanno una alla volta, e la prossima
(ammortamento) richiede prima cercare TUTTI i chiamanti di
`costoOrarioMezzo` (la regola della "firma allargata a metà").
Deepwork ID: il delta sui ruoli è documentato con tre "non c'è"
verificati; nessuna decisione di prodotto presa (richiede la parola
del fondatore, come le altre voci in DECISIONI_WEEKEND.md).

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Due strade aperte, a scelta di chi
riprende:
1. Continuare il delta TCO di Flotta: prima leggere OGNI chiamante di
   `costoOrarioMezzo` (grep `costoOrarioMezzo(` su tutte le app, non
   solo Flotta — per la regola sulla firma allargata a metà) prima di
   aggiungere l'ammortamento del possesso al costo orario.
2. Scrivere una nuova voce in `docs/DECISIONI_WEEKEND.md` per la
   domanda sui ruoli dentro l'organizzazione (isAdmin che somma due
   compiti, Billing Admin assente) — decisione di prodotto che
   richiede la parola del fondatore, sul modello delle voci #22-#24
   già scritte oggi.
3. Lanciare un nuovo giro di ricerca in background su un'app diversa
   (rotazione: Campo o Conti, i cui documenti di ricerca non sono
   stati toccati da altrettanto tempo quanto Deepwork ID lo era).
Se questa unità si esaurisce prima di scegliere, la prossima riparte
da qui senza bisogno di rileggere altro. Il ciclo continua senza
fermarsi (regola del fondatore, mai in pausa).
