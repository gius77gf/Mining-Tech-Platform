# Checkpoint — il doppione dentro il file, in tutte e sei le app

- **Tipo**: tre unità in fila, nate dalla misura che il checkpoint precedente
  aveva chiesto
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `3a89a3e` (la regola in `shared/`), `44eaeaf` (il giro sui dieci
  gestori), `88548e7` (la regola 12 di `run-stile`)

## La misura, prima di toccare niente

Il difetto trovato ieri in Scudo aveva una forma precisa: *si controlla il
doppione contro l'elenco caricato all'apertura, che non si aggiorna mentre il
file scorre*. La domanda era se fosse solo suo. Letti tutti e diciassette i
gestori d'importazione delle sei app:

- **sette** i doppioni non li saltano affatto, ed è giusto così (più letture
  dello stesso sensore, più rapportini nello stesso turno: ripetersi è lecito);
- **dieci** li saltano — e **dieci su dieci** guardavano solo l'archivio.

Non era un difetto di Scudo. Era del prodotto.

## Una regola sola, in `shared/`

`senzaDoppioni` sta in `dw-shell.js` accanto a `parseCsvLine`, e la funzione di
Scudo nata ieri **smette di avere la sua copia e la chiama**. È la regola del
fondatore: una cosa che serve a sei app vive in `shared/` e si chiama, non si
ricopia — è il difetto che è già costato una giornata con la convenzione sui
numeri.

Due decisioni prese apposta, scritte lì dove vivono:

- **vince la prima scrittura**, non l'ultima: chi rilegge il proprio file si
  aspetta l'ordine in cui l'ha scritto;
- **una chiave vuota passa.** Senza chiave non si può decidere se sia un
  doppione, e schiacciare insieme le righe senza chiave farebbe sparire dati
  veri. Chi le scarta è il lettore dell'app, che sa quali campi sono
  obbligatori per quella cosa lì.

La chiave è una **funzione**, non un nome di campo, perché a volte è composta:
gli adempimenti di Sentinella considerano doppione la stessa pratica con la
**stessa scadenza** — la stessa pratica l'anno dopo non lo è.

## Il messaggio dice due ragioni, perché sono due

«già presenti (saltate)» e «ripetute nel file» non sono la stessa cosa: la
seconda si corregge nel foglio di calcolo prima di ricaricare, la prima no. Chi
legge deve poterle distinguere.

## La regola 12, perché la correzione non sparisca

Dieci correzioni in dieci punti diversi sono dieci occasioni di tornare
indietro senza che nessuno se ne accorga. Ora un gestore che i doppioni li
**salta** deve anche averli cercati **dentro il file** — e la difesa vale sia
nel gestore sia dentro la funzione di lettura (è il caso di Scudo), ma
guardando il **corpo** di quella funzione: «da qualche parte nel modulo»
lascerebbe passare un lettore che non la chiama solo perché un altro la chiama.

**Stile 128 → 135, KPI 377 → 383.** Controprovata due volte: con i gestori
finti dentro la suite, e — quella che conta — rimettendo il difetto nel file
**vero** di Terra, dove la regola ha indicato la riga giusta (2683).

## L'errore di percorso, che è la ragione per cui CLAUDE.md lo dice

Il blocco della regola 12 l'avevo **appeso in coda** al file, dopo il riepilogo
che chiude con `process.exit`: non veniva eseguito. Il totale era rimasto a
128 con «0 falliti» — esattamente come un file di prova inerte. Se ne è accorto
solo il **controllo del totale**, che è precisamente il motivo per cui in
CLAUDE.md sta scritto di guardare che il totale salga, non solo che i falliti
siano zero.

## Prossimo passo atomico

**Il giro completo della suite del browser** (`node apps/deepwork-id/tests/browser/tutti.mjs`)
sul lavoro di oggi: sono state toccate tutte e sei le pagine — sei liste di
import cambiate e sei messaggi riscritti — e finora la verifica è stata che il
modulo si aggancia e che i gestori sono montati, non che le pagine restino a
posto. Undici banchi, compresi il fuori-schermo a 390 e 360 px e le unità di
misura nel maiuscolo, che è proprio quello che i messaggi nuovi rischiano di
rompere.

## Bloccanti

- Nessuno.
