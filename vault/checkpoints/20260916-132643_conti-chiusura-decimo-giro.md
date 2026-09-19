# Checkpoint — 2026-09-16T13:26:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5d933135

## Cosa è stato completato
Durante una ricerca di unità piccole e scoperte ("twin call-site" census su
tutte le pagine — vedi sotto), ho riletto i documenti `docs/RICERCA_CONTINUA_
*.md` per candidati aperti (`grep -ln "rimandato\|Non implementato"`).
Trovato che `docs/RICERCA_CONTINUA_CONTI.md`, sezione "16/09 — decimo giro:
piani di rientro, concentrazione clienti, sconto cassa, storico dei
solleciti", dichiarava **quattro mancanze "confermate"** con prove `grep`
a zero — ma tutte e quattro risultavano GIÀ implementate leggendo
`docs/DEVELOPMENT.md`/`docs/STATO_PRODOTTO.md` (che le attribuiscono allo
stesso "decimo giro"). Rilanciato lo stesso grep oggi: tutti e quattro i
comandi ora rispondono con conteggi reali (2-14 occorrenze), non zero.
Confermato con `git log -S` il commit che ha introdotto ciascuna funzione:
`statoPianoRientro` (0caac90b), `concentrazionePortafoglio` (6125ff90),
`scontoCassaMaturato`/correzione di `esitoMovimento` (925ef62b),
`statoRecupero` (343e896f).

È la famiglia "documento invecchiato" già ampiamente censita in CLAUDE.md:
la prova era vera quando scritta, e il cantiere che ha colmato la mancanza
è girato **lo stesso giorno**, senza che i due si parlassero. Aggiunta la
nota di chiusura ✅ in coda alla sezione, con la nuova prova (i quattro
grep rilanciati oggi) e i quattro hash di commit — nessun lavoro di
prodotto nuovo, solo la disciplina "chi trova il documento invecchiato lo
chiude".

**Nota sul metodo usato per trovare candidati**: prima di questa unità ho
fatto un censimento "twin call-site" su tutte le sette app (script Python
in scratchpad, non salvato nel repo — trova funzioni chiamate con un
oggetto letterale `{...}` da più punti della stessa pagina o di pagine
diverse, e confronta le chiavi passate). Ha confermato che il difetto
dell'unità precedente (Campo/`rapportoGiornata`/`volateSentinella`) era
isolato: nessun altro caso genuino trovato su ~150 chiamate censite (due
falsi positivi verificati e scartati: `reportConformita` di Sentinella,
dove il secondo sito omette `azioni` di proposito perché quella sezione del
report non la legge — la funzione tratta `undefined` come `null`, quindi è
sicuro by design; `durataFermo` di Flotta, falso positivo del censitore
sullo spread `{...f, fine: v.fine}`).

## Stato roadmap
Nessun task esplicito della roadmap interessato. Chiusura di documentazione
di ricerca, come richiesto dalla direttiva 7 ("chi chiude un'unità
aggiorna la riga del documento che gliel'aveva proposta").

## Prossimo passo atomico
Il censimento "twin call-site" non ha trovato altri difetti genuini oltre
a quello già corretto in Campo — non serve ripeterlo a breve. Prossimi
candidati concreti, in ordine di preferenza:
1. **Continuare la passata "in profondità" su Campo**: aprire `csvStorico`,
   `csvAttivita`, `csvAppello`, `csvSquadre` (già letti parzialmente,
   nessun difetto trovato finora — `APPELLO_COLONNE` e il corpo della riga
   di `csvAppello` sono allineati, con un test che pretende l'intestazione
   dichiarata). Se restano puliti, passare a un'altra app con lo stesso
   metodo (documento che stampa/esporta confrontato con lo schermo).
2. **ASSENZA P2**: colonna di vocabolario condiviso su 11 CSV — più grande,
   richiede una decisione di design esplicita prima di scrivere codice
   (quale vocabolario, quali degli 11 lettori la adottano subito).
3. Rileggere `docs/MAPPA_ECOSISTEMA.md` §6 per lo stato aggiornato dei
   ponti, nel caso una sovrapposizione nuova sia emersa da uno dei
   cantieri di questo blocco (nessuna emersa finora oggi).

## Blocchi
Nessuno.
