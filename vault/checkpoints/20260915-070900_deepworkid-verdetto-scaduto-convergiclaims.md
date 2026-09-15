# Checkpoint — 2026-09-15T07:09:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5325bebf (pushato)

## Cosa è stato completato

Chiuso il secondo giro di ricerca in background (Deepwork ID, Conti
seconda passata, Sentinella seconda passata — vedi checkpoint precedente
per Conti). Deepwork ID non era mai stata passata al setaccio in questa
sessione: tre findings, tutti riverificati a mano — mai agito sulla parola
dell'agente.

**Finding A (corretto)**: `docs/REVISIONE_SICUREZZA_202607.md` (30/07)
riportava, come esito misurato dall'emulatore, «PERMESSO modifica il totale
di una fattura» e «PERMESSO cancella una fattura», concludendo «dentro
l'azienda chi può cancellare? Oggi tutti». La decisione 10b (07/08,
`firestore.rules:128-138`, funzione `documentoEmesso`) ha chiuso questo per
`conti/fatture`, `conti/note`, `scudo/documenti` — ma il documento non era
mai stato riletto. Riverificato in prima persona (non fidandomi del
comando riportato dall'agente, che aveva un bug di percorso —
`cd tests && node tests/sonda-permessi.mjs` raddoppia `tests/tests/`):
rilanciato `emulators:exec --only firestore --project demo-deepwork "node
tests/sonda-permessi.mjs"` da `apps/deepwork-id`, output oggi: `negato`
MODIFICA e `negato` CANCELLA (erano `PERMESSO` il 30/07). Buco 1
(l'abbonamento non è una barriera) è ancora tutto vero, verificato nello
stesso rilancio. Corretto il documento con un aggiornamento datato in cima
(15/09), inline nei due punti falsi (Buco 2, Proposta B, domanda 2 del
fondatore), senza cancellare il testo originale — resta leggibile come
riferimento storico di cosa era vero al 30/07.

**Finding B (candidato, aggiunto un test)**: `convergiClaims`
(`apps/deepwork-id/functions/claims.js`) dichiara `convergiuto: true`
quando le sue ultime due letture coincidono — ma con **tre** scritture di
membership ravvicinate sullo stesso utente (es. accettazione di più
inviti in un colpo solo, prevista da `ARCHITETTURA.md` §4), un trigger
nato dalla prima scrittura può convergere ed essere l'ultimo ad atterrare
PRIMA che la terza organizzazione sia mai stata visibile dal suo lato —
perdendo silenziosamente quell'org dal token, **senza nessun warning**.
Riprodotto indipendentemente in scratchpad (script scritto da zero dopo
aver letto `claims.js` a mente fredda, non lo script dell'agente), poi
aggiunto come test permanente in `claims-convergenza.mjs` (19→22 prove).
Non osservato in produzione: limite meccanico dimostrato, mitigato (non
eliminato) dalla chiamata esplicita finale che `acceptInvites` già fa dopo
aver scritto tutti gli inviti nello stesso giro. Nessuna modifica al
meccanismo in questa unità.

**Finding C (candidato di scope, NON implementato)**: il DDT di Conti
(collezione `pesate`) non è in `documentoEmesso` — qualunque membro può
cancellarlo/modificarlo su Firestore diretto anche dopo che ha un
`fatturaId` (l'app nasconde solo il bottone). Non cross-organizzazione.
Aggiunto come **decisione 29** in `docs/DECISIONI_WEEKEND.md` (nuova
sezione datata 15/09, con la mia risposta di default se il fondatore non
risponde in settimana), NON implementato di iniziativa: è esattamente il
tipo di scelta sui permessi che la 10b riserva a lui. Corretta anche la
"porta d'ingresso" del documento (15→16 decisioni aperte) e una premessa
imprecisa della voce 19 preesistente, che dava per scontato che la 10b
coprisse "chi cancella un DDT emesso" in generale.

**Verifica**:
- `claims-convergenza.mjs`: 22/0 (nuovo blocco di 3 asserzioni, verificate
  a mano: T3 nato per ultimo converge súbito sul quadro completo, T1 in
  ritardo sovrascrive il token perdendo orgC, dichiarandosi comunque
  convergiuto senza warning).
- `numeri-nei-documenti.mjs`: 43/0 (cascata 2989/19→2990/22... la parte
  claims era ancora 19 dall'unità precedente: bumped a 22, totale
  3.471→3.474 in tutti e quattro i documenti).
- `run-kpi.mjs`: 2990/0 (invariato). `run-stile.mjs`: 328/0.
  `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree separata (scoped esattamente ai sei file di
  questa unità, ricostruita da zero dopo un primo giro reso stale da
  ulteriori modifiche — ucciso per PID, non per nome, verificato nessun
  orfano rimasto sulla porta): **40 comandi a posto, 0 caduti**. Cifra
  "asserzioni eseguite dal giro" misurata fresca: 3.940 (da 3.937),
  scritta in `DEVELOPMENT.md`/`STATO_PRODOTTO.md` PRIMA del commit finale.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi (lo stesso identico set delle due volte, dato lo split fra
  l'unità Conti già committata e questa).
- Nel mezzo: gestita una re-firma della routine (canarino delle 06:45
  UTC) senza contaminare questa unità — `vault/ULTIMO_CICLO.md` committato
  da solo (`f40caa3d`), i sei file di questa unità tenuti fuori
  dall'indice con `git reset` durante la finestra del canarino e
  ri-aggiunti dopo.

## Stato roadmap

Decisione 29 aggiunta a `docs/DECISIONI_WEEKEND.md`, in attesa di risposta
del fondatore (nessuna azione automatica sulla policy di sicurezza).

## Prossimo passo atomico

Nessuna unità in sospeso su questo fronte. Terzo binario disponibile, dal
mandato del ciclo (06:45 UTC): (a) il ponte Flotta→Conti
(`confrontoCostiMezzi` in `shared/dw-ponti.js`, a metà — manca la lettura
vera da Conti e i dati di dimostrazione, prima voce della mappa
ecosistema); (b) una terza tornata di ricerca mirata in background su tre
app ancora scoperte da un secondo passaggio (Terra, Flotta, Campo secondo
giro); (c) la passata in profondità su un'app (aprire ogni schermata,
premere ogni bottone che produce un file). Nessuno stop volontario: si
prosegue subito.
