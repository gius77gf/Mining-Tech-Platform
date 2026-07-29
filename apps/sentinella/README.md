# Sentinella

App ambiente / HSE. Buyer: responsabile HSE.

Sentinella **non misura**: registra i valori che arrivano dagli strumenti
(sismografi, fonometri, centraline) o inseriti a mano, li confronta con la
soglia impostata dall'azienda e li documenta. Ogni soglia resta un valore
scelto dall'utente, mai «un limite di legge».

## Schermate

| Schermata | Cosa c'è |
|---|---|
| **Quadro** | KPI, cartellone di conformità, il punto messo peggio in miniatura, allerte |
| **Monitoraggi** | punti di misura + serie storica, registrazione misure, **import letture da CSV**, **anagrafica ricettori**, distanza scalata |
| **Adempimenti** | scadenze ambientali con ente e giorni mancanti, import CSV |
| **Registri** | registri, registro volate, **registro reclami ed esposti**, export CSV |
| **Report** | **report di conformità stampabile** (periodo, ricettore, esito) |

## I quattro pezzi del blocco 2

### Import delle letture (CSV)
Gli strumenti esportano formati tutti diversi, quindi il file si legge
com'è e **le colonne le sceglie l'utente**. Il lettore CSV è scritto in
casa (`leggiCsv` in `sentinella-data.js`): nessuna libreria, nessun CDN,
tutto nel browser. Regge separatore `;` `,` e tabulazione, campi tra
virgolette (anche con a capo dentro), BOM, e la **virgola decimale**
(`4,8` → `4.8`, via `numIt` dello SDK). Le date si leggono in
**giorno/mese** (formato italiano): `12/07/2026`, `12-07-2026`,
`12.07.2026`, `2026-07-12`, anche con l'ora attaccata.

Prima di scrivere qualcosa compare l'**anteprima**: riga per riga si vede
cosa entra, cosa è un doppione e cosa viene scartato **con il motivo**.
I duplicati (stessa data+ora+valore) vengono saltati sia rispetto allo
storico già presente sia dentro lo stesso file, così reimportare due
volte lo stesso export non raddoppia la serie. Si tengono le ultime
`MAX_LETTURE` (500) letture per punto.

### Anagrafica ricettori
Il **ricettore** è il punto sensibile da proteggere: casa, scuola,
confine. Porta tipo, distanza dalla cava, classe acustica (DPCM
14/11/1997, solo descrittiva) e, se l'utente la imposta, la **soglia
propria** — quella scritta nell'autorizzazione per quella casa.

Regola applicata da `sogliaEfficace()`: se il punto di misura è collegato
a un ricettore che ha una soglia propria **e la stessa unità di misura**,
vince quella del ricettore. Se le unità non coincidono **non si converte
niente**: vale la soglia del punto e il conflitto viene scritto sia
nell'elenco sia nel report. Una conversione indovinata su un valore di
sicurezza sarebbe un errore grave.

### Report di conformità
È il documento che si consegna all'ente: periodo, ricettore, letture,
**soglia applicata e da dove viene**, superamenti, esito
(conforme / non conforme / senza dati), più reclami e volate del periodo
come contesto. Sullo schermo è una scheda Deepwork; con **Stampa** le
regole `@media print` lo trasformano in un A4 su carta bianca (barra,
menu e comandi spariscono, i grafici passano a inchiostri leggibili).
Nessuna libreria PDF: si usa la stampa del browser → «Salva come PDF».

### Registro reclami ed esposti
Giorno, ora, tipo, ricettore, chi ha segnalato, cosa è stato fatto,
aperto/chiuso. I reclami del periodo compaiono nel report accanto alle
misure di quei giorni.

## Programma di monitoraggio (scheda Programma)

Il piano: **che cosa si misura, dove e ogni quanto**. Una riga = un punto di
misura + ogni quanti giorni va misurato, con una **tolleranza** (il ritardo che
l'azienda considera accettabile), una data «in vigore dal» e una nota.

Lo stato **non si salva**: si calcola dall'ultima lettura del punto
(`statoRigaProgramma`), come già succede per le scadenze. Così una riga non può
restare «in regola» mentre nessuno misura più.

- oltre la tolleranza → **in ritardo** (rosso)
- scaduta ma dentro la tolleranza → **da fare** (giallo)
- non ancora scaduta → **in regola** (verde)
- nessuna lettura e nessuna data di inizio → **mai misurato** (giallo)
- riga **sospesa** (si tocca la riga): resta scritta, smette di risultare in ritardo

Le righe in ritardo o da fare entrano anche nelle **allerte del quadro**,
insieme a superamenti e adempimenti, ordinate per gravità.

Le periodicità del menù (`PERIODICITA`) sono solo scorciatoie in **giorni**:
«ogni mese» vale 30 giorni e «ogni sei mesi» 182 — giorni contati, non mesi di
calendario, così la scadenza è prevedibile. **Nessuna frequenza di legge è
scritta nel codice**: le frequenze le impone l'autorizzazione o il piano di
monitoraggio e le scrive l'utente.

Collezione `programma`: se non esiste (nessuna riga) tutte le schermate
funzionano come prima — provato con la collezione assente e con i dati vuoti.

## Andamento per ricettore (scheda Programma)

Scelto un ricettore, per ogni punto di misura collegato: la **soglia
applicata** (quella del ricettore se ce l'ha), il grafico delle letture degli
ultimi 6 mesi con la soglia disegnata sopra, e il confronto fra il **mese in
corso** e quello **precedente** (letture, media, massimo, superamenti).

Due regole di onestà, scritte a schermo quando scattano:

- sotto **3 letture** nella finestra il grafico **non si disegna**: una linea
  fra due misure non è un andamento;
- se uno dei due mesi non ha letture il confronto non si fa; se una media
  poggia su **una sola lettura** il confronto è mostrato ma marcato come
  debole.

Il grafico è quello del motore condiviso `dwGrafici.linea` (nessuna libreria,
nessun CDN, `shared/` non toccata).

## Dal superamento (o dal reclamo) all'azione correttiva — T7

Un valore fuori soglia, o la telefonata di un residente, non si chiude da
solo: chiede che **qualcuno faccia qualcosa entro una data**. Quel
meccanismo esiste già e sta in **Scudo** — le azioni correttive
(aperta → in corso → chiusa) dentro lo scadenzario della sicurezza. Sentinella
**non ne costruisce un secondo**: apre l'azione là, già collegata al fatto che
l'ha generata, e ne mostra lo stato.

- Nel Quadro c'è la sezione **«Cosa abbiamo fatto»**: per ogni superamento
  aperto e per ogni reclamo si vede se un'azione è stata aperta, a che punto è
  e se è stata chiusa. È la risposta pronta quando l'ente chiede «e voi cosa
  avete fatto?».
- Un tocco su **Apri azione correttiva** propone testo, data (30 giorni) e
  responsabile (l'anagrafica di Scudo), mostra l'**origine già scritta** e
  crea l'azione con `origineTipo: "superamento"|"reclamo"`, `origineId`,
  `origineVoce` — lo stesso schema che Scudo usa già per eventi e ispezioni.
- **Niente doppioni**: l'identità di un superamento è il punto di misura *più*
  il giorno della lettura che l'ha causato (`origineVoce`). Tornando sullo
  stesso superamento l'azione è già lì e il pulsante non c'è più; un
  superamento di un giorno diverso è un fatto nuovo e merita un'azione nuova.
- L'azione porta con sé il **testo dell'origine** (`origineNota`,
  `origineData`): Scudo non può leggere le collezioni di Sentinella
  (l'isolamento dello SDK è per organizzazione **e** per app), e un'azione che
  dicesse solo «origine: xyz» sarebbe illeggibile per l'RSPP.
- **Coincidenza con la volata**: se quel giorno c'è stata una volata, la voce
  lo segnala come cosa *da guardare*, dicendo a chiare lettere che
  «**coincidenza di data, non una causa dimostrata**: per collegare i due fatti
  servono la misura strumentale dell'evento, l'ora e una valutazione tecnica».
  Nessun nesso suggerito che non sia dimostrato.
- **Trasporto**: da autenticati, SDK Deepwork ID inizializzato sull'app di
  destinazione (`appId: "scudo"`), stessa organizzazione, sempre
  `orgCollection("azioni")`. In demo/tour non esiste alcun backend e le due app
  sono due pagine: il finto backend condiviso è una riga di `localStorage`
  (`deepwork.demo.azioni-ponte`) — serve solo a far vedere la catena completa,
  non esiste in live. Se Scudo non è raggiungibile la pagina resta com'era:
  elenco vuoto e una riga che lo spiega.

## Regole rispettate

- **Soglie di sicurezza**: i preset normativi (`SOGLIE_PRESET`, DIN 4150-3 /
  USBM / PM10) sono **invariati**. La novità è solo la soglia per ricettore,
  impostata dall'utente.
- **Unità mai in maiuscolo**: `text-transform:uppercase` trasformerebbe
  `µg/m³` in `MG/M³` (milligrammi, mille volte tanto). Su un documento che
  va all'ente sarebbe un errore, quindi le unità escono dal maiuscolo
  (`.tab th .u`, `.graf-axlab`, override locale di `.dwg-axlab`).
- Niente `alert()`/`confirm()`/`prompt()`: toast e modale del core.
- I messaggi passati a `esito()`/`toast()` sono **testo semplice** (finiscono
  in `textContent`): l'HTML ci comparirebbe scritto.
- Grafici con `dwGrafici` (`shared/dw-grafici.js`), senza modificare
  `shared/`: un solo asse verticale, punti fuori soglia a rombo, etichette
  dei tempi corte (`GG/MM`) perché il motore non le dirada per larghezza.
- Ogni accesso dati passa dallo SDK (`orgCollection`): collezioni
  `monitoraggi`, `adempimenti`, `registri`, `volate`, `ricettori`, `reclami`,
  `programma`.

## Verifiche

- Sintassi: script inline estratti e passati a `node --check` /
  `node --input-type=module --check`.
- Funzioni pure: 22 test su lettore CSV, date, mappatura colonne,
  duplicati, soglia efficace e report.
- Prova visiva: server statico + Chromium headless (telefono 360/390 px,
  desktop 1280 px) e **PDF A4 reale** generato con `page.pdf()` per
  controllare la stampa.
