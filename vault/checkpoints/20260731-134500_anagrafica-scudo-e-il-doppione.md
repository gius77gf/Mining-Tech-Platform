# Checkpoint — l'anagrafica di Scudo, e il doppione che nessuno vedeva

- **Tipo**: due unità (estrazione + documento) nate dalla riga «saltata» del
  controllo di stamattina
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `cb9e883` (la funzione e le prove), `577956a` (il documento)

## Perché proprio questa

Il controllo nuovo sugli esempi del documento aveva una sola riga saltata:
l'anagrafica lavoratori di Scudo, **l'unico dei diciassette import scritto
dentro la pagina** invece che come funzione pura. Quindi l'unico che nessuna
prova poteva guardare. Ed è l'anagrafica delle **persone**: il primo file che
una cava carica.

## Il difetto che è venuto fuori portandola fuori

Nella pagina non si vedeva. Il controllo del doppione confrontava il nome con
l'elenco **già in archivio**, e quell'elenco **non si aggiornava mentre il file
scorreva**: due righe uguali nello stesso file entravano tutte e due.

Non è un caso di scuola. L'**Esporta CSV** di Scudo scrive **una riga per ogni
scadenza**: un lavoratore con tre scadenze compare **tre volte** nel proprio
file. Ri-caricarlo — che è il modo più naturale di spostare i dati da una
postazione a un'altra, o di rimetterli dopo un backup — faceva comparire **tre
«Rossi»** in anagrafica. Nessun errore, nessun avviso: solo un elenco sbagliato
che qualcuno avrebbe scoperto settimane dopo.

## Com'è adesso

`parseLavoratoriCsv` sta in `apps/scudo/scudo-data.js` come le altre sedici.
Toglie l'intestazione, le righe senza nome, la riga «AZIENDA» che l'export usa
per le scadenze non intestate a nessuno, e **i doppioni dentro il file** — a
parità di nome ignorando maiuscole e spazi, tenendo la **prima** scrittura. Il
confronto con chi è già in archivio resta alla pagina, che è l'unica a
conoscerlo: è la divisione giusta, non una comodità.

## Le prove

Nove asserzioni nuove, **KPI 372 → 377**. La controprova toglie il filtro dei
doppioni e i test cadono dicendo la cosa giusta: *«atteso 1, ottenuto 3»*.
Verificato anche nel browser che il modulo si **agganci davvero** — non basta
che la pagina «monti», i bottoni sono HTML statico: sono stati letti i tre
gestori (`onclick`, `onchange`, `onclick`) e sono funzioni, senza nessuna
eccezione JS. Le uniche richieste fallite sono i font e Firebase, che il proxy
blocca da sempre.

E la mappa del controllo sugli esempi ora è **completa**: diciassette import,
diciassette funzioni pure, zero righe saltate.

## Il documento

La nota diceva «un nome già presente viene saltato», vero solo per l'archivio.
Ora dice il doppione nei **due** sensi e spiega **da dove viene il caso vero**
(l'export una-riga-per-scadenza), che è la parte che serve a chi prepara il
file.

## Prossimo passo atomico

**Cercare lo stesso difetto negli altri sedici import.** Il difetto di Scudo ha
una forma precisa e ripetibile: *si controlla il doppione contro l'elenco
caricato all'apertura, che non si aggiorna mentre il file scorre*. Se un altro
import fa lo stesso, ha lo stesso buco. Si misura leggendo i sedici gestori
nelle sei pagine e chiedendosi, per ognuno: **cosa succede se la stessa riga
compare due volte nello stesso file?** Misura prima, correzioni dopo — e se il
difetto c'è più di una volta, la prova va scritta perché non torni.

## Bloccanti

- Nessuno.
