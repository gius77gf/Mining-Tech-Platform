# Checkpoint — 2026-09-16T19:56:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d3068cc0

## Cosa è stato completato
Passata di profondità (binario 2) su Terra: trovato e corretto un ponte
wired solo a metà, stessa famiglia del bug di `rapportoGiornata` in Campo
trovato lo stesso giorno con lo stesso metodo.

Delegato a un agente Explore in background il censimento a doppio punto di
chiamata su Terra (funzione/scrittura DB chiamata con oggetto letterale da
più punti della pagina, confronto delle chiavi passate). Ha trovato che
`csvRilievi`/`parseRilieviCsv`/`classeAccuratezza` fanno correttamente il
giro export→import della tolleranza dichiarata dal rilevatore (`tolleranzaPct`,
settima colonna, 11/09) — ma il gestore che scrive DAVVERO nel database dopo
l'import (`$("ril-file").onchange` in `apps/terra/index.html`) non passava
`tolleranzaPct` a `db.aggiungi`, mentre la registrazione manuale sì.

**Verificato personalmente prima di agire** (niente entra sulla parola
dell'agente): letti i due call site esatti (`apps/terra/index.html`, righe
~4680 e ~4852), `parseRilieviCsv` (che assegna `out.tolleranzaPct` solo
quando valido), `classeAccuratezza` (che usa `tolleranzaPct` quando presente,
altrimenti ricade sulla tipica con `fonte: "classe"`), e `terraData()` in
`terra-data.js:2718` per confermare che `db.aggiungi` scrive con `addDoc` di
Firestore.

**Trovato e corretto un secondo problema durante la verifica**: la prima
bozza del fix passava `r.tolleranzaPct` nudo, che è `undefined` quando
assente (mai una chiave in `parseRilieviCsv`) — e `addDoc` di Firestore
**lancia** su un campo `undefined`. Sarebbe stato un difetto peggiore di
quello che si stava correggendo (un crash invece di una perdita silenziosa).
Corretto normalizzando a `r.tolleranzaPct ?? null`, la stessa convenzione
già usata dalla registrazione manuale.

Effetto del difetto originale: un rilievo drone re-importato da un CSV
esportato da Terra stessa perdeva silenziosamente la tolleranza dichiarata
dal topografo, e `classeAccuratezza` ricadeva sulla tolleranza tipica della
classe — cambiando la banda `± m³` nei KPI, nel verbale di rilievo e
nell'incertezza aggregata, senza nessun errore visibile.

Toccati:
- `apps/terra/index.html`: una riga (`tolleranzaPct: r.tolleranzaPct ?? null`
  aggiunta alla chiamata `db.aggiungi` dell'import CSV).
- `apps/deepwork-id/tests/run-kpi.mjs`: nuovo test di wiring dedicato che
  legge il sorgente della pagina e verifica ENTRAMBI i punti di scrittura
  (nessun test precedente copriva questo — tutti a livello di modulo).
- `docs/RICERCA_CONTINUA_TERRA.md`: nota di chiusura con la nota di metodo
  (la ricerca sul mondo e la lettura diretta del codice trovano famiglie di
  difetti diverse, servono entrambe).

Controprova sul codice vero: rimessa l'omissione originale, confermato che
il test dedicato cade, ripristinato via `cp` + `diff`. Verificati anche
`run-stile.mjs` (330/0) e `sintassi-pagine.mjs` (34/0) dato che si è toccato
un blocco `<script>`.

Doc-cascade: run-kpi 3105→3106, somma nove suite 3.599→3.600, giro-totale
4084→4085. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti, 4085
asserzioni — predetto e confermato ESATTO al primo tentativo** (decima
unità di fila con predizione esatta).

## Stato roadmap
La passata di profondità su Terra ha prodotto un difetto reale corretto,
chiudendo il gap del checkpoint precedente ("Terra non ancora coperta con
questo metodo in questa sessione"). Ora Scudo, Campo (implicitamente, via
il bug trovato in questa sessione) e Terra sono state coperte col metodo
del censimento a doppio punto di chiamata in questo ciclo.

## Prossimo passo atomico
Nessuna strada di ricerca ASSENZA resta aperta (P2 chiuso), nessun delta
aperto sulle 13 tornate di ricerca su Terra. Strade legittime per la
prossima unità:
1. **Ripetere il censimento a doppio punto di chiamata su un'altra app**
   non ancora coperta con questo metodo in questa sessione (Conti, Flotta,
   Sentinella) — il metodo ha trovato due difetti veri su due usi (Campo,
   Terra), quindi vale la pena ripeterlo prima di considerarlo esaurito.
2. Tornare alla lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md: seconde
   iterazioni sulle app verticali, P3 di ASSENZA (misurata come costosa ma
   non impossibile), revisione qualità/sicurezza, nuova deep-research a
   rotazione.
La scelta è aperta al prossimo ciclo.

## Blocchi
Nessuno.
