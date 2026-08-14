# Checkpoint — 2026-08-08 17:05 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`079ebe3` — fix(scudo): «da assegnare» copriva anche il responsabile che non
è più in anagrafica

## Da dove è nata, e perché è interessante

Da una riga di `docs/RICERCA_CONTINUA_SCUDO.md` che **era falsa**: diceva che
un'azione senza responsabile «appare nella lista senza che nessuno sappia che è
un buco». Verificata prima di lavorarci — la regola di casa, «niente entra sulla
parola dell'agente» — Scudo scriveva già **«responsabile da assegnare»**, in due
punti dello schermo e come cella del CSV. Era un «non c'è» senza la prova di
aver guardato.

⛔ **Ma aprire una riga falsa non è tempo perso: sotto c'era un difetto vero, ed
era l'OPPOSTO di quello scritto.** Non l'azione *senza* responsabile — quella
era raccontata bene — ma l'azione **con** un responsabile che dall'anagrafica è
stato tolto. Il percorso è ordinario e l'ho fatto premendo i bottoni: si rimuove
un lavoratore, le sue azioni restano con l'id dentro, e da quel momento dicono
«da assegnare», cioè *nessuno se ne occupa* di un'azione che un responsabile ce
l'ha. Chi legge può riassegnarla a un altro.

## Che cosa è stato corretto

**Cinque copie della stessa domanda**, e nessuna conosceva quello stato:

| dove | prima | adesso |
|---|---|---|
| urgenze del Quadro | «responsabile da assegnare» | «responsabile non più in anagrafica» |
| elenco delle azioni | idem | idem |
| elenco delle ispezioni | «chi la esegue: da assegnare» | «chi la esegue: non più in anagrafica» |
| scheda dell'ispezione | il responsabile **spariva dalla frase** | si dichiara |
| scadenzario | «da assegnare» sulla riga di un'azione | la stessa frase dello schermo |
| **CSV delle azioni** | «da assegnare» | «non più in anagrafica» |

La **decisione** (quale dei cinque stati) sta adesso in `shared/dw-ponti.js`,
`statoResponsabile` — perché la condividono due app, ed è la regola di casa. La
**frase** resta di ciascuna: Sentinella nomina Scudo, perché lo legge da fuori;
Scudo no. Una regola condivisa non può contenere il nome di un'altra app.

⛔ **E la causa è dichiarata prima che accada.** La finestra che chiede conferma
della rimozione elencava le scadenze e taceva sulle azioni e sulle ispezioni di
cui quella persona è responsabile — cioè taceva proprio sulla cosa che sta per
rompere. Adesso le conta: *«È il responsabile di 2 azioni correttive ancora
aperte e 1 ispezione non ancora chiusa: non spariscono, ma da lì in poi
risulteranno senza un responsabile in anagrafica. Se puoi, riassegnale prima.»*
È l'ultimo momento in cui si possono riassegnare.

## Come è stato verificato

- `run-kpi` **1910 → 1912** (due prove nuove), 0 falliti.
- **Controprova**: rimesso il difetto in `shared/dw-ponti.js` (una riga, «1
  soggetto toccato» stampato), cadono **tre** prove in tre file di soggetti
  diversi — Sentinella, la decisione condivisa, e Scudo. File ripristinato da
  una copia `cp` e `diff -q` a confermarlo.
- **Scatto guardato**, e la prova più forte è che le due frasi convivono **nella
  stessa schermata**: la prima riga dice «responsabile da assegnare» (azione
  `a3`, che davvero non ha nessuno) e la seconda e la terza «responsabile non
  più in anagrafica» (`a1` e `a4`, di Giulia Verdi appena rimossa). Un campione
  solo non avrebbe distinto «funziona» da «adesso lo dice a tutti».
- **Il CSV scaricato e aperto**, non dedotto: schermo e file dicono le stesse
  parole sugli stessi dati.
- Giro `node` verde **sulla copia di ciò che si committa** (worktree da `HEAD` +
  `diff --cached | git apply` + `add -A`, diff identico).
- Numeri dei documenti rimisurati: **2.351 → 2.353** prove, copertura
  **711 → 712**.

## Quello che lo scatto ha trovato e la rilettura no

Nel **mio stesso testo**: «1 ispezione non ancora **chiuse**». È il difetto del
singolare che questa casa insegue da giorni, rifatto scrivendo la frase che
avverte di un altro difetto — e preso solo perché la sonda stampa il dialogo
invece di dichiararlo aperto. Con «1» cambiano l'articolo, la preposizione e il
verbo: una parola scambiata non basta.

## Stato roadmap

Spuntata la riga nuova in `vault/ROADMAP_SETTIMANA.md`. La riga di ricerca che
l'aveva proposta è stata **riscritta con l'esito** (direttiva 7): dichiarata
falsa quando fu scritta, col difetto vero che ci stava sotto.

## Prossimo passo atomico

`documenti-invecchiati.mjs` adesso segna **⛔ sentinella**: `db04ac5`, **7
commit dopo, di cui 1 che MORDE** — ed è il mio `48450a2`, che ha aggiunto una
funzione a Sentinella. Riverificare le righe di quel documento del delta contro
il committato di adesso e riscrivere il commit dichiarato: è esattamente il
meccanismo della direttiva 7, e il numero deve tornare a zero. Comando:

    node apps/deepwork-id/tests/documenti-invecchiati.mjs

⚠️ Una riga che **regge** ma porta una prova invecchiata non va lasciata: è la
terza forma di invecchiamento — il verdetto è giusto e la prova no, e chi la
riapre butta via tutta la riga.

## Rimasto in sospeso (non mio da decidere)

Il **giro del browser** (PID 16670, oltre 5h20, registro
`scratchpad/nomi4/giro-nuovo.txt`, ancora in crescita, nessuna passata arrivata
al limite dei 30 minuti) va raccolto con `leggi-giro.mjs`, sezione 1 prima
della 2 e le righe «non ho guardato» prima dei KO. Attesta `c3888fe`: nessuna
unità di oggi ci sta dentro.
La parte di prodotto della decisione **5b** (accendere o no la coda offline, chi
vince e come lo si dice a chi ha perso) resta una scelta del fondatore.

## Blocchi

Nessuno.
