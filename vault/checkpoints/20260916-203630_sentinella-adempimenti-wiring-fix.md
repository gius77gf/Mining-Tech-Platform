# Checkpoint — 2026-09-16T20:36:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
27282b10

## Cosa è stato completato
Censimento a doppio punto di chiamata ripetuto su Sentinella (dopo Campo,
Terra, Conti): **quarto difetto vero trovato con lo stesso metodo nello
stesso giorno**, delegato a un agente Explore in background e verificato
personalmente riga per riga prima di agire (parser, entrambi i call site,
il consumatore a valle e il punto dove il report si blocca).

Trovato: `parseAdempimentiCsv` (`sentinella-data.js:965-988`) legge
correttamente le due colonne facoltative `periodoMesi`/`giorniConsegna`
(già testate). Il gestore che scrive davvero nel database dopo l'import
(`$("ade-file").onchange`, `index.html:5509-5537`) chiamava
`db.aggiungi("adempimenti", { titolo, ente, scadenza })` senza le due
chiavi, pur essendo entrambe già presenti sull'oggetto restituito dal
parser. La registrazione manuale (`btn-ade`) le scrive già.

Effetto verificato leggendo il consumatore: `periodoAdempimento`
(`sentinella-data.js:3231-3253`) tratta `periodoMesi` assente come
`motivo: "senza-periodicita"`; sullo schermo la riga mostra «periodo
coperto non dichiarato», e il bottone «Prepara il report»
(`index.html:4909-4911`) **si rifiuta di partire**, con lo stesso
messaggio di un adempimento mai compilato — anche se il file del
consulente dichiarava fedelmente il periodo.

Corretto: aggiunte `periodoMesi: r.periodoMesi, giorniConsegna:
r.giorniConsegna` alla chiamata. Nessuna normalizzazione a `null`
necessaria (a differenza del fix su Terra dello stesso giorno):
`parseAdempimentiCsv` restituisce sempre le due chiavi con un valore —
un numero o `null`, mai `undefined` — quindi già sicuro per `addDoc`.

Toccati:
- `apps/sentinella/index.html`: una riga (le due chiavi aggiunte alla
  chiamata `db.aggiungi` dell'import CSV).
- `apps/deepwork-id/tests/run-kpi.mjs`: nuovo test di wiring dedicato con
  controprova.
- `docs/RICERCA_CONTINUA_SENTINELLA.md`: nota di chiusura, con anche i
  due candidati scartati dallo stesso censimento (famiglia Flotta: campi
  mai raccolti o mai portati dal formato CSV, non regressioni).

Controprova sul codice vero: rimesse le due chiavi, confermato che il
test dedicato cade, ripristinato via `cp` + `diff`. Verificati anche
`run-stile.mjs` (330/0) e `sintassi-pagine.mjs` (34/0).

Doc-cascade: run-kpi 3107→3108, somma nove suite 3.601→3.602, giro-totale
4086→4087. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4087 asserzioni — predetto e confermato ESATTO al primo tentativo**
(dodicesima unità di fila con predizione esatta).

## Stato roadmap
Il censimento a doppio punto di chiamata ha trovato **quattro difetti
veri su cinque tentativi** (Campo, Terra, Conti, Sentinella sì; Flotta
no, con la ragione distinta e scritta). Resta non ancora provata con
questo metodo in questa sessione: Scudo (ha avuto una passata di
profondità nel ciclo precedente, ma con un metodo da verificare se è lo
stesso).

## Prossimo passo atomico
1. **Provare il censimento a doppio punto di chiamata su Scudo** — ultima
   app rimasta. Stesso mandato agli agenti Explore usato per
   Terra/Conti/Flotta/Sentinella, poi verifica personale prima di agire.
2. A quel punto tutte e sei le app avranno avuto un tentativo con questo
   metodo in questa sessione: se anche Scudo non produce un candidato
   della stessa famiglia, il metodo ha reso quello che poteva rendere
   (4-5 successi su 6 tentativi) e si torna alla lista "SE LA ROADMAP
   SEMBRA FINITA" di CLAUDE.md — seconde iterazioni sulle app verticali,
   P3 di ASSENZA, revisione qualità/sicurezza, nuova deep-research a
   rotazione, o la decisione di prodotto lasciata aperta su Flotta
   (round-trip CSV completo per i mezzi).
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
