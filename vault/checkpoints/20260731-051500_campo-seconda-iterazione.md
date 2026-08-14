# Checkpoint — 31/07/2026 05:15 UTC

## Task completato
**Seconda iterazione sul lato Campo del ponte P2.**

| Commit | Cosa |
|---|---|
| `4ccfa6a` | Un confronto incompleto non dichiara più un accordo |

## Il difetto, e perché era il tipo peggiore
Coi viaggi dentro il periodo la frase diceva «i due numeri si parlano» e «le stime
stanno reggendo», e **in coda** ammetteva che i viaggi non erano nel conto. Ma se
quei viaggi fossero contati il dichiarato salirebbe, e l'accordo apparente potrebbe
sparire.

Dichiarare un accordo basandosi su **metà dei dati** è il numero comodo — la cosa
che questo progetto rifiuta in tutti gli altri cinque ponti, e che qui mi era
scappata dentro. Non era un errore di calcolo: il calcolo era giusto e diceva
`parziale: true`. Era la **frase** che leggeva solo metà del risultato.

Adesso quando il conto è parziale il verdetto si tira indietro e spiega: quanti
viaggi restano fuori, perché, e che «da questo confronto non si può dire se i due
numeri tornano».

Dello stesso stampo un dettaglio minore: contava «7 rapportini» includendo quello
in viaggi, che nei metri cubi non entra. Ora conta quelli che hanno contribuito.

## La sedicesima volta, e la prima muta
Lo stato «con-viaggi» era **identico** a quello normale, e la prova diceva ok. Il
bersaglio della sostituzione non combaciava — avevo omesso due campi della riga — e
**`String.replace` su un bersaglio sbagliato non fa niente e non lo dice**. La prova
mostrava lo stato normale sostenendo di mostrare quello coi viaggi.

È la stessa famiglia delle altre: la prova che gira su zero campi, quella che tiene
il percorso invece del contenuto. Corretto alla radice in **entrambe** le prove
sugli stati — Campo e Terra usavano lo stesso schema, quindi la stessa trappola —
con un controllo che pretende che la trasformazione abbia cambiato la sorgente.
Nelle mie sostituzioni in Python l'assert c'era da sempre; nelle trasformazioni in
JS me l'ero dimenticato.

## La domanda lasciata aperta, chiusa con una ragione scritta
Sul lato Terra ci sono tessere e un grafico, qui solo una nota di testo. È **giusto
così**, e la ragione sta ora nel codice: questa è la schermata in cui si **compila**
un rapportino — chi la apre è venuto per scrivere il suo turno, e l'informazione sul
rilievo la vuole di passaggio. Le tessere sono un quadro di controllo, e qui
competerebbero con la lista dei rapportini e col form che stanno sotto, cioè con le
cose per cui la schermata esiste. In Terra il volume **è** il soggetto della pagina,
e là sono al loro posto.

## Anche quello che non deve esserci
Con Terra non raggiungibile e con un rilievo solo la sezione è alta **0 px**:
nessun buco strano fra «Produzione di oggi» e la lista dei rapportini. Senza densità
compare la nota che rimanda a Terra. Tutti e sei gli stati senza errori di pagina.

## Stato
Suite: **293 KPI**, **72 stile**, 7 demo, 43 helper, 23 pointcloud, 9 manifest.
Tutte verdi.

## Prossimo passo atomico
**Terza iterazione sul lato Campo**, che chiude il conto delle tre chieste dalla
direttiva. Due cose concrete da guardare, entrambe emerse da questa seconda:

1. **La nota cresce troppo.** A 390 px il caso parziale è alto **178 px** contro i
   130 del caso normale, ed è un muro di testo in una schermata di lavoro. Da
   decidere con la sezione accanto al riferimento: la frase si può spezzare in due
   note (il numero, poi l'avvertenza) come fa Terra, oppure accorciare — ma **senza**
   togliere le due spiegazioni possibili, che sono la ragione per cui il tono
   funziona. Da misurare l'altezza dopo, non stimarla.
2. **Il periodo non è scelto qui.** Campo usa sempre l'intervallo fra gli ultimi due
   voli. In Terra c'è la tendina; qui probabilmente **non serve** — chi compila
   guarda l'ultimo periodo, non lo storico — ma la risposta va scritta come è stata
   scritta quella sulle tessere, invece di restare un'omissione.

Poi, se restano crediti: **il grafico dei buchi non è ancora provato con `x` di
etichette diverse** (mesi, date, numeri) — le prove usano sempre `['A','B','C','D']`.
Un'etichetta lunga su quattro punti a 390 px è il posto tipico dove il testo si
sovrappone, ed è il genere di difetto che si vede solo guardando.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), la copertura mancante sui campi interi di Genesi (tutti dentro modali,
verificati per montaggio e non per digitazione), e i tre punti che aspettano il
fondatore — progetto Firebase (10 minuti), permessi per ruolo, blocco del turno
chiuso lato server.
