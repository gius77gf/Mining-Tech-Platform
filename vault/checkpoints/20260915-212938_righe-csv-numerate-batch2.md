# Checkpoint — 2026-09-15T21:29:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f4f85ece

## Cosa è stato completato
Secondo lotto della migrazione a `righeCsvNumerate` (numero di riga
FISICO nel file, avviata nel commit precedente su Terra):
- Scudo: `scartiScadenzeCsv`, `scartiInfortuniCsv`.
- Sentinella: `scartiMonitoraggiCsv`, `scartiRicettoriCsv`,
  `scartiAdempimentiCsv`, `scartiVolateCsv`.

Prima di editare ogni corpo si è letta la sua destrutturazione (regola
già scritta in CLAUDE.md: «chi fabbrica i dati di prova sbaglia come il
prodotto»), perché due delle sei funzioni avevano fallback diversi per
il campo `nome` (alcune sempre "riga N", altre con un ripiego su un
campo del CSV) — il test dedicato (B12) è stato scritto leggendo la
destrutturazione di ogni `parseXCsv` per costruire fixture vere, non
indovinate: due tentativi falliti prima di trovare colonne corrette
per `scartiAdempimentiCsv` (il vero ordine è titolo;ente;scadenza;
periodoMesi;giorniConsegna, non quello che avevo assunto) e per
`scartiScadenzeCsv` (un lavoratore vuoto NON è un difetto: la scadenza
può essere di "azienda").

**Scoperte due forme non standard**, lasciate fuori da questo lotto e
documentate per una unità futura dedicata:
- `scudo.scartiLavoratoriCsv` usa un rilevatore di intestazione LOCALE
  (regex su "nome" o "azienda") invece della `isIntestazione`
  condivisa — `righeCsvNumerate` andrebbe esteso per accettare un
  predicato oltre a una parola chiave;
- `scudo.scartiAzioniCsv` usa `leggiCsv()` (multi-riga, celle già
  parsate) invece dello split semplice — la numerazione fisica
  richiede che `leggiCsv` stessa esponga il numero di riga di
  partenza, cambiamento più grande della semplice sostituzione fatta
  qui.

## Verifica
- `run-kpi.mjs`: 3036 passati, 0 falliti (nuovo test B12: fixture con
  righe bianche prima della rotta per tutti e sei i lettori, con le
  colonne vere di ogni parser).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0 (nessuna pagina
  toccata). `copertura-funzioni.mjs`: 0 scoperte, 1018/1018.
  `funzioni-mai-usate.mjs`: 0 da collegare.
- Controprova (×2): reintrodotto il vecchio conteggio in
  `sentinella.scartiVolateCsv` e, separatamente, in
  `scudo.scartiScadenzeCsv` → B12 cade in entrambi i casi con
  l'assertion giusta ("atteso riga 4, ottenuto riga 2"); ripristinato
  da copia, `diff -q` byte-identico.
- Giro completo su worktree isolata: 40 comandi, 1 caduto atteso
  (`numeri-nei-documenti.mjs`, per lo scarto sui numeri) — corretto e
  riverificato in modo indipendente sulla copia di lavoro
  (`numeri-nei-documenti.mjs` 43/0, con «3.993» come nuovo candidato
  sorvegliato).

## Stato roadmap
Restano tredici lettori da migrare: Campo 2, Conti 6, Flotta 3, più i
due di Scudo con forma non standard (`scartiLavoratoriCsv`,
`scartiAzioniCsv`).

## Prossimo passo atomico
Terzo lotto: Campo (`scartiSquadreCsv`, `scartiPianoCsv` — quest'ultimo
usa `tutte` invece di `righe`, verificato oggi nel censimento iniziale,
va letto per intero prima di editarlo) e/o Flotta (`scartiTelemetriaCsv`
— anche lei con `tutte`, `scartiRicambiCsv`, `scartiMezziCsv`). Stessa
disciplina: leggere ogni corpo, non assumere la forma standard, e
verificare ogni fixture di test contro la destrutturazione vera del
parser prima di scrivere l'assertion.

In alternativa, se si preferisce chiudere prima le forme non standard:
estendere `righeCsvNumerate` per accettare un predicato invece di una
sola parola chiave (per `scartiLavoratoriCsv`), verificando che
l'estensione non cambi il comportamento esistente per tutti i chiamanti
già migrati (il contratto attuale, stringa, deve restare valido e
produrre lo stesso risultato — regola CLAUDE.md sulle firme allargate:
si cercano TUTTI i posti che leggono il valore prima di allargarlo).

## Blocchi
Nessuno.
