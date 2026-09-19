# Checkpoint — 2026-09-15T09:02:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3a992c82 (pushato)

## Cosa è stato completato

Chiusa la prima delle due unità Conti rimandate nel checkpoint precedente
(`20260915-085139`). Riverificato a mano il finding del quarto giro di
ricerca in background, poi disegnato e verificato personalmente il fix.

**Il difetto**: `applicaIncassi` — la lista "decorata" che alimenta filtri,
contatori delle schede, colore e testo della riga, i KPI del cruscotto,
cioè quasi tutta la schermata Fatture — chiamava `statoIncasso`, che non
conta le note di credito. Il sotto-testo del residuo (riga della lista) e
il foglio stampato chiamano invece `statoFattura`, che le note le conta
già (fix chiuso in questa stessa sessione, unità `statoFattura`
saldata/parziale). Con un incasso parziale seguito da una nota che azzera
il residuo — il caso normale, «prima il cliente salda, poi si emette la
nota», dichiarato nel commento di `statoFattura` stessa — le due fonti
divergevano: la riga diceva ancora «aperta, parziale», il sotto-testo,
due righe sotto sullo stesso riquadro, diceva già «saldata».

**La correzione**: `applicaIncassi(fatture, incassi, note)` chiama adesso
`statoFattura(f, incassi, note)` al posto di `statoIncasso(f, incassi)`.
`statoFattura` chiama già `statoIncasso` al suo interno e ne eredita ogni
campo che `applicaIncassi` restituiva — non è un secondo calcolo, è lo
stesso con la vista completa. Il terzo parametro `note` è opzionale: senza
note passate il comportamento è **identico** a prima (verificato
empiricamente, non solo per lettura del codice).

**Verifica**:
- Comparazione diretta prima di scrivere il fix nel modulo (disciplina
  "una funzione nuova si prova in scratchpad prima"): confronto
  `JSON.stringify` fra vecchio e nuovo comportamento su (a) tutte le 7
  fatture della dimostrazione e (b) 5 casi limite sintetici (nessun
  incasso, saldo esatto, eccedenza, incasso multiplo, flag legacy senza
  movimenti) — **0 differenze** in entrambi, prima di committare.
- Nuovo test in `run-kpi.mjs`: senza note passate il comportamento non
  cambia (compatibilità); con le note la fattura passa da «aperta,
  parziale» a «saldata»; il risultato con note coincide esattamente coi
  campi che produrrebbe `statoFattura` chiamata a mano con gli stessi
  nomi di campo di `applicaIncassi`; e sulla dimostrazione vera, senza
  note, zero differenze col comportamento di prima (non un'affermazione,
  una misura dentro la suite).
- `numeri-nei-documenti.mjs`: cascata dei quattro documenti aggiornata
  (run-kpi 2994→2995, totale 3.478→3.479) e la cifra "asserzioni eseguite
  dal giro" ricalcolata fresca sulla worktree isolata (3.902).
- Giro isolato su worktree separata, scoped esattamente ai 7 file di
  questa unità: **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Del quarto
giro di ricerca (Sentinella, Conti, Genesi): Sentinella chiusa, Conti
`applicaIncassi` chiusa (questa unità). Restano: Conti (numerazione DDT
"senza salti" dichiarata ma non imposta — non ancora affrontato, destinato
probabilmente a `docs/DECISIONI_WEEKEND.md` come nota/decisione piuttosto
che a un fix di codice) e Genesi (`simulaPerforazione` ripiega
silenziosamente su B/S/prof invece di rispettare il contratto
`volumeForo`/"non calcolabile" — non ancora affrontato, e non ancora
riverificato indipendentemente di persona, come richiede la regola
"niente entra sulla parola dell'agente").

## Prossimo passo atomico

Riverificare di persona il finding di Genesi (`simulaPerforazione`) aprendo
il file e leggendo il contratto di `volumeForo`/`pfNominale` come
riferimento, prima di decidere il fix (probabile: usare `volumeForo` come
guardia sullo stesso modello di `pfNominale`, "non calcolabile" invece del
ripiego silenzioso). In parallelo o subito dopo, scrivere la nota su DDT
"senza salti" in `docs/DECISIONI_WEEKEND.md` (tocca l'assunzione
"readonly = niente doppioni", vera, ma "senza salti" non lo è mai stata
davvero — è una domanda per il fondatore, non un bug). Poi, per la regola
"il lavoro non finisce mai da solo": lanciare un nuovo giro di ricerca
mirata (tre cantieri paralleli su app non ancora coperte in questo giro,
o un secondo passaggio più approfondito su un'area già toccata) seguendo
il mandato corretto della routine (`docs/MAPPA_ECOSISTEMA.md` §6 come
fonte di stato vivo). Nessuno stop volontario: si prosegue subito.
