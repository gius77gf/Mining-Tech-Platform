# Checkpoint — 2026-09-13T13:11:46Z

## Tipo
unit-complete (ricerca, nessun codice)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`382656e3`

## Completato

Settima ricerca di fianco: "il mestiere della cava" in un taglio
diverso dal rapporto di volata già coperto — dichiarazione annuale dei
quantitativi estratti (Modello A, DPR 128/1959, UNMIG/MASE) e ispezioni
periodiche (Commissione Mineraria, VVF, INAIL, ARPA), più il Registro
degli Esplosivi. Tutto di seconda mano, con fonte e fiducia dichiarate;
nessuna periodicità nazionale univoca trovata per le ispezioni —
dichiarato onestamente invece di inventare un numero.

⚠️ **Terzo difetto di processo su sette ricerche, di una specie nuova
rispetto ai due precedenti**: non un timestamp fabbricato, non un
delta scritto contro le regole — stavolta un **difetto di inserimento**
che ha corrotto la GIUNZIONE con la sezione precedente. L'append
dell'agente ha spostato l'ultima voce della lista fonti della sezione
Orica/Maxam (già chiusa, già verificata pulita) fuori dal suo elenco,
lasciandola orfana in fondo al file dopo la sezione nuova. Contenuto
della nuova sezione intatto; solo la cucitura fra le due era rotta.
Corretto rimettendo la voce al suo posto, con una nota nel documento
stesso che generalizza la lezione: **un append può corrompere quello
che c'era prima, non solo aggiungere quello che c'è dopo** — la
rilettura dopo la scrittura va fatta guardando anche la giunzione, non
solo che la sezione nuova esista.

Aggiunta anche una dichiarazione di appartenenza: il contenuto (
dichiarazione annuale, registro esplosivi) è più vicino al mestiere di
Scudo e Terra che a quello di Genesi — utile comunque per l'ecosistema,
ma va letto sapendo a chi appartiene di più.

Verificato con `numeri-nei-documenti.mjs` (43 passati, 0 falliti).

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

**Bilancio delle sette ricerche di questo blocco, per chi riprende**:
tre difetti di processo trovati e corretti (un file mai scritto
nonostante il "fatto"; un timestamp fabbricato; una giunzione corrotta
da un append) — tutti e tre catturati SOLO perché ogni volta il file è
stato riletto per davvero prima di committare, mai fidandosi del solo
riepilogo in chat dell'agente. Le altre quattro ricerche erano pulite.
Nessuno dei tre difetti ha raggiunto un commit: la disciplina di
verifica ha funzionato ogni volta.

Le strade di codice sicure su Genesi restano esplorate per questo
blocco (vedi checkpoint precedenti). Il ciclo di ricerca sulla regola 1
di CLAUDE.md è ora ampio: mestiere della cava (rapporto di volata,
dichiarazione annuale/ispezioni), concorrenti (quattro prodotti
enterprise approfonditi), parole del mestiere (vocabolario confermato),
norme citate (USBM/DIN 4150-3/UNI 9916 confermati). Prossimo ciclo:
attendere una risposta del fondatore, o continuare con ricerca su un
argomento ancora più di nicchia se si sceglie di proseguire (es. gli
standard IREDES per l'export del piano di innesco, già usato da Genesi
ma non ancora verificato in dettaglio contro lo standard reale).
Continuare senza fermarsi (regola del fondatore).
