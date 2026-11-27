# Checkpoint — 2026-09-14T21:32:48Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c45452b5

## Contesto

G47 ("Genesi simile a un CAD") è chiuso nella sua interezza (checkpoint
precedente, commit `e6e5f761`). Per la regola del fondatore ("se la
roadmap sembra finita, non è finita"), ho cercato la prossima voce
apertura non bloccata su una decisione del fondatore: **Q1** (ruoli
nell'organizzazione) è esplicitamente "una decisione di prodotto del
fondatore" — non azionabile da sola. Un agente Explore ha scansionato
`vault/ROADMAP_SETTIMANA.md` e segnalato **B3** ("Genesi continua a
uscire dalla pagina") come il candidato più forte: nessuna dipendenza
esterna, pattern già consolidato, cantiere con la sua stessa suite di
misura (`genesi-estraibili.mjs`).

## Completato

Prima fetta di B3 ripresa dopo G47: **`pfNominale`**, trasloco CON
cambio di firma (la prima di questo tipo dal bucket "una o due" invece
che "sei-dieci/più di dieci" — le fette precedenti di B3 erano tutte
"legami di una riga" senza cambio di firma).

- `pfNominale(D2)` in `genesi-data.js`, componendo due funzioni già
  pure del modulo (`consumoSpecifico`, `volumeForo`): nessun calcolo
  nuovo, solo l'argomento esplicito invece di leggere `D2` dalla
  chiusura della pagina.
- 5 punti nella pagina che la chiamavano aggiornati a `pfNominale(D2)`.
- **Due prove storiche in `run-kpi.mjs` erano diventate stale dal
  trasloco stesso**: pinnavano il testo sorgente ESATTO della vecchia
  definizione a zero argomenti (`function pfNominale(){ return
  consumoSpecifico(...) }`) e la vecchia forma di chiamata
  (`pfNominale()`) dentro un'altra riga di prodotto. Non cancellate:
  corrette per leggere la nuova forma — una era già passata come "il
  foro ha il suo numero e il progetto no" e verificava una guardia
  vera (che il rapporto non si calcoli senza tutt'e due i pezzi), non
  andava persa solo perché il testo sorgente è cambiato forma.
- Nuova prova diretta, verificata contro un difetto iniettato
  (`prof` sostituito con `B` — un vero swap di argomento, non
  commutativo come B↔S che invece non cambia il risultato e non
  sarebbe stato preso: misurato prima di scegliere quale difetto
  iniettare).

## Verificato

- `sintassi-pagine.mjs`: 34/34. `run-kpi.mjs`: 2972/0 (era 2971).
- `copertura-funzioni.mjs`: fondo di `genesi-data.js` alzato 153→154.
- `numeri-nei-documenti.mjs`: 43/0 (dopo due cicli di correzione).
- Giro completo su worktree isolata: **rilanciato due volte** (stesso
  schema di ogni unità di questo blocco): il primo giro ha segnalato
  lo scarto delle asserzioni per la nuova prova (3.917→3.918),
  corretto, rilanciato: **40 comandi a posto, 0 caduti**.

## Corretto in cascata

154 funzioni restano nella pagina di Genesi (era 155), 59 nel bucket
"una o due" (era 60), **67 estraibili** (era 68) — scesi di uno perché
la funzione è uscita DEL TUTTO, non lascia un wrapper: una funzione già
uscita non è più "da estrarre". 318 funzioni condivise totali
(`genesi-data.js` 154/154). 3.452→3.453 prove sulle nove suite
(`run-kpi` 2971→2972), 3.917→3.918 asserzioni del giro completo.

## Stato roadmap

B3 aggiornata in coda alla sua storia append-only (riga ~3860 di
`vault/ROADMAP_SETTIMANA.md`), con i numeri verificati ora, non
ricopiati. **59 funzioni restano nel bucket "una o due"** da cui
pescare la prossima fetta con lo stesso schema (cambio di firma).

## Prossimo passo atomico

Ripetere lo stesso schema su un'altra funzione del bucket "una o due"
di `genesi-estraibili.mjs --elenco`. Candidati semplici già letti in
questa sessione (leggono solo `D2`, nessuna scrittura DOM, nessun
ambiente browser — quindi davvero estraibili senza rifare
un'architettura):
- `d2HitTest(px,py)` / `d2HitTestPt(px,py)` — leggono `D2`, chiamano
  `interpFronte`/`activeProf` (già pure o da verificare se pure).
- `measureGeom2D()` — legge solo `D2`.
- `pieDev()`, `computeInnesco2D()` — attenzione: quest'ultima potrebbe
  essere già un legame di una riga verso `innescoSuMaglia` (verificare
  prima di trattarla come nuova, per non duplicare lavoro già fatto).
- `isoPasso()`, `activeProf()`, `reliefCls()`, `interpFronte()` —
  tutte "legge: D2" da sole nella tabella.

Per ciascuna: leggere il corpo, verificare che non tocchi DOM/ambiente
(altrimenti resta in pagina per scelta dichiarata, non per
dimenticanza), contare i call site nella pagina, spostarla in
`genesi-data.js` con `D2` come primo parametro, aggiornare i call
site, verificare se qualche prova storica in `run-kpi.mjs` pinna il
suo vecchio testo sorgente (cercare il nome della funzione in
`run-kpi.mjs` PRIMA di spostare, non dopo — è la lezione di questa
unità), aggiungere una prova diretta con verifica contro un difetto
iniettato scelto apposta perché NON sia commutativo/invisibile,
aggiornare fondo di `copertura-funzioni.mjs` e tabella di
`docs/DEVELOPMENT.md`, doc-cascade sui quattro documenti, giro isolato
(atteso: rilanciato due volte, la prima segnala lo scarto delle
asserzioni per la nuova prova).

Nessuno stop volontario: si prosegue subito con la prossima funzione.
