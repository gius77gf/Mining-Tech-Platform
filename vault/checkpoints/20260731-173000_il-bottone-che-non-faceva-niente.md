# Checkpoint — il bottone che non faceva niente, e cosa c'era dietro

- **Tipo**: cinque unità nate una dall'altra, tutte da una domanda sola
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `d55554b` (giro di andata e ritorno + Conti), `1214fe5` (le note
  con l'id doppio), `d206222` (la promessa del backup, corretta), `4a50731`
  (decisione 12 al fondatore), `3a85ad3` (il banco degli id e la regola 13)

## La domanda da cui è partito tutto

*«Il file che l'app scarica, si ri-carica davvero?»* Il documento lo promette a
chi compra — è la copia di sicurezza e il modo di spostare i dati da una
postazione all'altra — e nessuno l'aveva mai verificato. Una promessa così si
rompe **senza rumore**: basta aggiungere una colonna a un'esportazione, il file
continua a scaricarsi benissimo, e ci si accorge il giorno in cui serve, cioè il
peggiore.

## Quattro cose vere, trovate una dentro l'altra

**1. L'export delle fatture di Conti non è un backup.** Scrive
`numero;cliente;emessa;imponibile…`, il lettore aspetta
`numero;cliente;importo;emessa…`: in terza posizione c'è una **data** dove si
cerca un **importo**, la riga cade, e ri-caricando il proprio export si
ottengono **zero fatture**. È un prospetto da commercialista, ed è giusto che lo
sia — sbagliata era la promessa.

**2. Un bottone di Conti non faceva niente.** Due bottoni avevano lo **stesso
`id`** (`btn-lis-export`). `getElementById` restituisce il primo, quindi
«Esporta listino (CSV)» non riceveva nessun gestore, e con lui era
irraggiungibile l'unico export che calcola i prezzi convertiti a tonnellata e a
metro cubo. In più i due file si chiamavano **tutti e due** `conti_listino.csv`:
nella cartella dei download uno copre l'altro.

**3. Lo stesso difetto, altre due volte.** In Flotta e Sentinella due note
condividevano `ric-esito`: quella sotto il form non mostrava **mai** niente, e
la conferma di «Aggiungi» compariva **122 px** (Flotta) e **332 px**
(Sentinella) più in su, lontano dal bottone premuto. Va detto per intero: il
messaggio non si perdeva, perché `esito()` fa anche un toast — il difetto è la
nota che resta sulla pagina, nel posto sbagliato.

**4. La copia di sicurezza copre metà dei dati.** Misurando tutti e trentadue i
file che le app scaricano: **sette** si ri-caricano davvero, gli altri sono
prospetti. Restano senza backup proprio le cose che una cava non può riscrivere
a mano — pesate e DDT, incassi, clienti, azioni correttive, rilievi drone,
registro volate.

## Le difese, perché non tornino

- **Sette controlli di andata e ritorno** leggono l'intestazione dal **sorgente
  della pagina** (non da una copia: una copia invecchia in silenzio, ed è
  esattamente il difetto che si cerca) e rimandano dentro una riga scritta come
  la scrive l'export. **KPI 383 → 391.**
- **Un banco nuovo, `id-unici.mjs`**: due elementi con lo stesso id, cercati
  nella pagina **viva** dopo aver visitato tutte le sezioni. Nove superfici
  pulite.
- **Regola 13**: due esportazioni non scaricano lo stesso nome di file.
  Trentadue esportazioni, zero collisioni. **Stile 136 → 149.**

## La cosa da ricordare: dove si guarda cambia la risposta

Gli id ripetuti, cercati **nel testo dei file**, sono **45** — e quasi tutti non
sono difetti: stanno dentro i modelli delle modali, che il browser monta uno
alla volta. Cercati nella **pagina viva** sono **3**, e sono tutti e tre veri.
Una regola sul sorgente avrebbe prodotto 45 falsi allarmi e sarebbe stata spenta
dopo due giorni: il posto giusto per quel controllo è il browser, e non è un
dettaglio tecnico — è la differenza fra una difesa che dura e una che viene
disattivata.

## Quello che ho lasciato al fondatore

**Decisione 12**: costruire l'export ri-caricabile per le sei collezioni scoperte
è fattibile e senza rischio, ma sono sei unità e tolgono tempo ad altro.
L'alternativa è dirlo in chiaro al cliente prima del pilota — che è una scelta
commerciale, non mia. Nel frattempo nessuna promessa falsa resta scritta.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro completo** della suite del browser (in corso), e
rilanciarlo **dopo** le modifiche di oggi alle pagine di Conti, Flotta e
Sentinella: il giro attualmente in esecuzione è partito prima di quelle
correzioni, quindi i suoi ultimi banchi leggono file diversi da quelli dei
primi. Un risultato misto è peggio di nessun risultato, perché sembra completo.

## Bloccanti

- Nessuno.
