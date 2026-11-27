# Checkpoint — 2026-09-16T01:35:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7327d94d

## Cosa completato
- **Chiusa la migrazione dei 21 lettori CSV alle righe fisiche**, aperta dal
  delta PAROLE il 15/09. `shared/deepwork-id-client/dw-shell.js`:
  `leggiCsv` guadagna `nRighe` (additivo — verificato ogni chiamante nel
  repository prima di allargare il contratto: tutti leggono solo `.righe`/
  `.delim`, nessuno confronta l'oggetto intero). `nRighe[i]` è la riga
  FISICA su cui comincia `righe[i]`: un a capo dentro le virgolette avanza
  il conteggio senza chiudere la riga logica, che è esattamente il caso per
  cui `leggiCsv` esiste (evitare di spezzare sulle righe fisiche quando un
  campo può contenerne una).
- Migrati con lei gli ultimi due lettori non standard: `scudo.scartiAzioniCsv`
  e `conti.scartiClientiCsv`.
- Test nuovi in `run-kpi.mjs`: uno dedicato su `leggiCsv().nRighe` (casi
  semplice/multi-riga/righe vuote/CRLF/vuoto), un B17 che prova entrambi i
  lettori migrati col caso più difficile (una riga logica su due righe
  fisiche seguita da una riga rotta, verificando che la riga rotta si
  nomini con la riga fisica 4, non la posizione 2). Corretto un fixture
  preesistente (`conti.parseClientiCsv` nella tabella QUATTRO) che
  assumeva ancora la vecchia numerazione posizionale.
- Controprova su **tre livelli**: la funzione condivisa (rimosso
  l'incremento del contatore mentre si è dentro le virgolette), e
  ciascuno dei due lettori migrati (sostituito `nRiga` allineato con un
  contatore posizionale locale) — tutte e tre le prove cadono come atteso;
  ripristinato da backup, `diff -q` conferma l'identità byte per byte in
  tutti e tre i casi.
- `run-kpi.mjs`: 3051/0. `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`:
  34/0. `run-helpers.mjs`: 83/0. `funzioni-mai-usate.mjs`: 4/0.
  `numeri-nei-documenti.mjs`: 43/0. Giro isolato: **4012** asserzioni,
  40/40 comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3049→3051,
  somma nove suite 3.543→3.545, giro completo 4010→4012.
- Commit `7327d94d`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.
- **Ricerca continua su Scudo ricevuta per intero** (dopo che il primo
  hand-back dell'agente conteneva solo un riassunto — richiesto e ottenuto
  il testo markdown completo via `SendMessage`): 5 temi — rischio chimico/
  Titolo IX D.Lgs 81/08 (assente come entità, solo checklist su
  silice/polveri), denuncia infortunio INAIL come scadenza automatica
  (Scudo ha già gravità/giorni-assenza ma nessuna scadenza ne nasce — la
  ricerca dichiara ONESTAMENTE di non poter scrivere il numero di legge
  definitivo finché manca il campo `dataCertificato`, da cui decorre il
  termine vero), anagrafica attrezzature (mancanza segnalata tre volte,
  mai colmata, con un confine esplicito e dichiarato verso Flotta per non
  duplicare i mezzi mobili), notifiche automatiche (confermata assente sei
  volte di fila da agosto, richiede backend — proposto un primo passo
  in-app senza server), barriere mancate nell'analisi causa/ICAM (il
  meccanismo dei 5 Perché è maturo, manca solo il pezzo specifico ICAM).
  **Non ancora appesa** a `docs/RICERCA_CONTINUA_SCUDO.md` né riverificata
  indipendentemente: da fare nella prossima unità.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Tutte e sei le app hanno avuto almeno un
giro di ricerca continua in questa sessione (15-16/09): Genesi, Campo,
Deepwork ID, Core, Terra, Sentinella (ieri); Conti, Flotta, Scudo (oggi).

## Prossimo passo atomico
1. Riverificare indipendentemente i grep della ricerca su Scudo (in
   particolare il caso REACH→forEach che l'agente stesso segnala come
   trabocchetto, e i grep a zero sui cinque temi) e appenderla a
   `docs/RICERCA_CONTINUA_SCUDO.md` in coda, formato fisso.
2. Poi aprire un'unità concreta: il tema più piccolo e pronto è il n°5
   (barriere mancate/ICAM) — non tocca `validaAnalisi` né la tassonomia
   esistente, aggiunge solo un campo opzionale `barriereMancate` sul record
   di analisi, stesso pattern di `CAUSE_ANALISI`.
3. Resta aperto il difetto collaterale reale in Conti (`esitoMovimento`
   confonde un pagamento scontato legittimo con un acconto parziale, dal
   nono giro di ricerca) — merita un'unità a sé.
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
