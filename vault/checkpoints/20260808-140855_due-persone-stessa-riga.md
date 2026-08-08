# Checkpoint — 2026-08-08 14:08 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d9acf53` — misura(5b): due persone che scrivono la stessa riga

## Che cosa è stato completato
La **misura che la decisione 5b chiede prima della funzione**. Due contesti
**autenticati diversi** (due membri della stessa organizzazione, cioè due
telefoni in cava), regole di sicurezza vere caricate, ed esercitando
esattamente ciò che fa il livello dati: `updateDoc` su `orgCollection`.

| # | caso | esito misurato |
|---|---|---|
| 1 | campi diversi | **convivono** |
| 2 | stesso campo | vince l'ultimo, e il primo non lo sa |
| 3 | **leggi-modifica-riscrivi** di un campo composito | la spunta dell'altro **sparisce in silenzio** |
| 4 | lo stesso col **percorso puntato** | **convivono** → la cura è una riga |
| 5 | riga cancellata nel frattempo | **rifiutata** (`not-found`): non la resuscita |
| 6 | `set` senza `merge` | cancella i campi che non nomina |

**Il caso 3 è quello vero**, perché è la forma che le app usano davvero.
Censimento dell'esposizione, **derivato** dai dati e incrociato con le chiamate
che scrivono il campo intero: **12 punti in 4 app su 6** — Campo (`esiti`),
Scudo (`esiti`, `azioniId`, `misure`, `atmosfera`), Sentinella
(`tarature`, `letture`). Il più affilato è `letture`: due import sullo
stesso punto di monitoraggio ne perdono uno, e quelle letture finiscono nel
report per l'ARPA.

## Le tre onestà scritte nel documento
- il censimento **sottostima**: per Campo la dimostrazione non contiene nessun
  campo composito, eppure il codice scrive `esiti` intero — *un elenco derivato
  dai dati vede solo ciò che i dati contengono*;
- un **falso positivo dichiarato** perché nessuno lo riconti:
  `db.aggiorna("dpi", …)` è il **nome della collezione**, non un campo;
- che cosa la misura **non dice**: niente sul lavoro offline vero (coda locale,
  risincronizzazione — vuole il browser), e niente sulla **frequenza**, che
  dipende da come lavora una cava e non la sappiamo.

## Dove vive
- `docs/DUE_PERSONE_STESSA_RIGA.md` — il racconto e le tabelle;
- `apps/deepwork-id/tests/due-persone-stessa-riga.mjs` — lo strumento che la
  rifà, **nei test e non nello scratchpad**, dichiarato **MISURA** (stampa, non
  asserisce, e vuole l'emulatore).

## Verifiche
Giro `node` **27/27**; `suite-collegate` 111 file (il marcatore è
riconosciuto); `numeri-nei-documenti` 26/26.

## Prossimo passo atomico
Due candidati, in quest'ordine:
1. **I 12 punti al percorso puntato**, e `arrayUnion` dove si aggiunge in coda
   (`tarature`, `letture` di Sentinella). ⛔ La **coda offline** viene DOPO:
   mettere in coda scritture che si cancellano a vicenda moltiplica il problema.
2. `documenti-invecchiati` dichiara **arretrato 16 commit, di cui 4 che
   mordono**: la suite passa e lo **dichiara**, quindi è una riga «non ho
   guardato» da leggere prima dei KO.

⏳ E resta da raccogliere il **giro del browser** (PID 16670, ~2h35), registro in
`scratchpad/nomi4/giro-nuovo.txt`: `leggi-giro.mjs`, sezione 1 prima della 2.
⚠️ Attesta `c3888fe`. ⚠️ Il rosso di una controprova è il verde del banco.

## Blocchi
Nessuno.
