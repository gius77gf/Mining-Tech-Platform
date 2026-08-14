# Il giro del browser gira su una copia

**Data:** 01/08/2026 · **Dove:** `apps/deepwork-id/tests/browser/`
**Unità precedente:** `20260801-005500_la-funzione-che-non-guardava-niente.md`

## Il problema che risolve

Il giro completo dura fra un'ora e mezza e due, e per tutto quel tempo **non si
poteva toccare `apps/` né `shared/`**: i banchi servivano la cartella viva.
`impronta.mjs` proteggeva il risultato **fermando il lavoro** — una difesa, non
una soluzione.

E una regola che chiede di non lavorare per due ore **viene violata**: è già
successo due volte in due giorni, la seconda dal cantiere che il giorno prima
aveva scritto il paragrafo. Il costo si è visto oggi: tre unità già progettate
e provate sono rimaste in coda ad aspettare.

## Cosa è stato fatto

`tutti.mjs` crea una **`git worktree` temporanea** su `HEAD`, alza il server
statico dentro quella, esporta `DW_RADICE` per i sei banchi che si servono i
file da soli, e la rimuove alla fine — **anche se il giro cade**, perché una
worktree lasciata in giro fa fallire la creazione successiva e nessuno capisce
perché.

L'impronta resta, ma cambia mestiere: sorveglia la **copia**, che non deve
muoversi mai. Adesso un suo allarme è un difetto **del giro**, non del
cantiere — il che la rende una prova più forte di prima.

## ⛔ La trappola che la copia introduce, dichiarata invece che nascosta

Una worktree su `HEAD` contiene il **committato**, non quello che c'è su disco.
Con modifiche non committate il giro proverebbe **codice diverso da quello che
si sta guardando**, e uscirebbe verde su una versione che non esiste da nessuna
parte. Sarebbe la forma peggiore del difetto che questo progetto insegue da
settimane — un risultato tranquillo ottenuto senza guardare la cosa giusta —
prodotto proprio dallo strumento che dovrebbe garantirla.

Quindi il giro **dichiara su cosa sta girando**, con l'elenco dei file rimasti
fuori, **in cima e in fondo**: stampato solo all'inizio, dopo un'ora e mezza di
scorrimento non l'ha letto nessuno — e il caso in cui serve davvero è proprio
quello in cui si legge solo il riepilogo.

E non si rifiuta di partire: rimetterebbe il cantiere ad aspettare, che è il
problema di partenza.

## La verifica

`tests/browser/giro-su-copia.mjs` (nuovo), tre prove, **e le due proprietà sono
opposte fra loro** — per questo vanno provate tutt'e due:

1. si modifica un file che le pagine caricano nella cartella **viva** e si
   pretende che la copia **non cambi** (è il motivo per cui esiste);
2. si crea un file non committato e si pretende che venga **visto**, perché è
   quello che permette di dichiararlo.

E il collegamento end-to-end: un banco vero (`nota-credito.mjs`) servito
**interamente dalla copia**, con `DW_RADICE` puntato lì — **20 su 20**. Perché
una guardia scollegata non è un errore di sintassi, esattamente come il
`<script>` dimenticato.

La guardia dell'impronta continua a funzionare: `tutti.mjs --banchi-finti`
passa, e non crea nessuna copia (quei banchi non aprono niente).

## Stato

`run-kpi` 1079, `run-stile` 268, `run-helpers` 49, copertura **454/454**, sonda
del vuoto 7/7. `CLAUDE.md` aggiornata: la regola «non si tocca il cantiere
mentre gira il giro» adesso serve molto meno, e il perché è scritto.

## Prossimo passo atomico

Verificare e committare le due **schermate** dei cantieri paralleli (i lotti in
Terra, l'analisi della causa in Scudo), guardando gli scatti e non solo
leggendo i resoconti.

Poi il **giro completo sulla copia**, che adesso si può lanciare **senza
fermare il lavoro** — ed è la prima volta.
