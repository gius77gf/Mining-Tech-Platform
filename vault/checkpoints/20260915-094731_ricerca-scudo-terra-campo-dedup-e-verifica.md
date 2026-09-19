# Checkpoint — 2026-09-15T09:47:31Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
115528a3 (pushato)

## Cosa è stato completato

Chiuso il quarto giro di ricerca (Sentinella `fogliaVolata`, Conti
`applicaIncassi`, Conti DDT `cancellazioneLasciaBuco`, Genesi
`simulaPerforazione` — 4 fix committati e pushati in questo blocco). Aperto
il quinto giro: tre agenti `haiku` in background su Scudo, Campo, Terra con
domande "prima il mondo, poi la nostra app" (mandato mirato, cinque
vincoli come da CLAUDE.md).

**⛔ Incidente di processo**: ho lanciato i tre agenti SENZA `isolation:
"worktree"`, condividendoli la stessa cartella di lavoro fra loro e con me.
Due conseguenze:
1. Ho scritto nel prompt il path del documento in **minuscolo**
   (`docs/RICERCA_CONTINUA_campo.md` ecc.) senza controllare prima la
   convenzione già in uso: Scudo e Terra avevano già un file canonico
   **maiuscolo** con mesi di storia di ricerca (`SCUDO.md`, `TERRA.md`).
   Gli agenti Scudo e Terra hanno ricreato esattamente l'incidente "sei
   documenti doppi" già chiuso il 05/09 — preso da `omonimi-a-maiuscole.mjs`
   (1 caduto su 4) prima che finisse in un giro completo.
2. L'agente Campo ha dichiarato "git add + commit + push completati" ma
   **non è vero**: nessuna traccia in `git log`, `git log --all` né
   `git reflog` di nessun commit Campo, e il file non esiste su disco. La
   causa più probabile è una collisione con le operazioni git concorrenti
   degli altri due agenti nella stessa cartella (staging/commit che si sono
   sovrapposti). L'agente ha riportato successo senza che fosse vero — la
   stessa famiglia di «uno script che non fallisce non ha per forza fatto
   qualcosa», in una veste nuova: qui era un AGENTE, non uno script, a
   dichiarare un'azione mai avvenuta.

**Rimedio applicato** (Scudo e Terra): riverificato DI PERSONA ogni
affermazione dei due documenti nuovi (regola "niente entra sulla parola
dell'agente") prima di unirli ai file canonici:
- **Scudo**: 1 lacuna su 3 confermata (sospensioni disciplinari non
  modellate, campo assente). **2 su 3 erano FALSE**: le soglie di urgenza a
  cascata (7/15/30 gg) esistono già in `livelloScadenza`
  (`scudo-data.js:763`, con un commento che cita esplicitamente le fasce
  come riferimento del mondo già consultato); il toggle "segnalazione
  anonima" nel form near-miss esiste già in `index.html` (righe
  6201-6366) — il grep dell'agente per "anonimo" in quel file ha dato
  zero, e rilanciato dà **11 righe**.
- **Terra**: 3 lacune su 3 confermate, con una precisazione: il margine fra
  esaurimento del volume e scadenza del titolo si può già calcolare dai
  campi che `vitaCava()` restituisce (`anniResidui`, `dataScadenza`), manca
  solo esporlo come numero di giorni invece del solo booleano
  `scadePrimaIlTitolo`.

Contenuto vero unito nei due file canonici (`RICERCA_CONTINUA_SCUDO.md`,
`RICERCA_CONTINUA_TERRA.md`) con nota di processo e riverifica per ogni
voce; i due duplicati minuscoli cancellati.

**Verifica**: `omonimi-a-maiuscole.mjs` 4/0 (era 3/1),
`numeri-nei-documenti.mjs` 43/0. Nessun codice toccato, solo documenti — non
serve il giro completo isolato per questa unità (nessun `test()` nuovo,
nessuna cascata di prove da aggiornare).

## Stato roadmap

Quinto giro di ricerca: Scudo e Terra chiusi (uniti, con verdetto corretto
sulle lacune false). **Campo ancora da rifare** — il lavoro dell'agente è
andato perso, ma il suo riepilogo finale (nel mio contesto di
conversazione) riporta comunque tre lacune con dettaglio sufficiente da
poter essere riverificate e riscritte senza ripetere la ricerca sul mondo
da zero, se necessario.

## Prossimo passo atomico

Messaggiare l'agente Campo (id `a51143158543b4afd`, ancora indirizzabile
via SendMessage) per fargli rifare SOLO l'ultimo passo — scrivere il
contenuto (che ha già, dal suo stesso riepilogo) nel file **canonico
corretto** `docs/RICERCA_CONTINUA_CAMPO.md` (maiuscolo, append, mai
sovrascrivendo) e ricommittare/pushare **ora che non ci sono più agenti
fratelli a correre nella stessa cartella**. In alternativa, se il
riepilogo nel contesto è sufficiente, riverificare di persona le sue tre
lacune (chiusura turno senza verifiche di prerequisito; ricevuta di
consegna non obbligatoria; testo di consegna non archiviato in modo
tracciabile) leggendo `apps/campo/campo-data.js` e `index.html`, e unirle
direttamente al file canonico come fatto per Scudo e Terra — evitando di
rilanciare un altro agente per un lavoro che si può verificare da soli in
pochi minuti. **Lezione da applicare ai prossimi giri di ricerca**: lanciare
agenti paralleli che scrivono su file diversi ma nella STESSA cartella di
lavoro va evitato, o va usato `isolation: "worktree"` per ciascuno — e
prima di scrivere un path in un mandato, va controllato se esiste già una
convenzione di maiuscole/minuscole per quel nome. Nessuno stop volontario:
si prosegue subito.
