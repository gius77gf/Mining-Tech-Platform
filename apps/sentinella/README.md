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
| **Registri** | registri, registro volate (con la **PPV misurata** collegabile alla volata), **referti per la legge di sito** verso Genesi, **registro reclami ed esposti**, export CSV |
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

### Un punto SENZA nessuna soglia (decisione 16 del fondatore, 02/08)

Se né il punto né il suo ricettore hanno una soglia, l'app **non giudica**:
non c'è nessun limite rispetto a cui essere conformi. Lo stato è
«**Senza soglia**» (giallo) — né conforme, né in attenzione, né superamento —
e i conteggi lo **dichiarano** invece di assorbirlo:

- `riepilogoConformita()` ha un conto suo (`senzaSoglia`) e un denominatore
  onesto (`giudicabili`): «4 conformi su 5 punti giudicabili · 1 senza soglia»,
  non «4 su 6»;
- il **report** dà a quel punto l'esito `senza-soglia`, e ogni sua lettura è
  «non confrontata», non «entro soglia»;
- il **ponte con Scudo** non può vedere superamenti dove non c'è un limite, e
  lo scrive invece di dire «niente da rincorrere»;
- nessuna percentuale, nessun «0 superamenti», nessuna linea di soglia nel
  grafico: `statoMisura()` dichiara `calcolabile: false` e chi disegna la legge.

Dall'interfaccia il caso **non è raggiungibile** (il form pretende una soglia
maggiore di zero e l'import CSV scarta le righe con soglia ≤ 0): vive per dati
scritti prima o entrati da un'altra strada. Prima della decisione 16 il rapporto
usava una soglia di ripiego pari a **1**, e sullo stesso punto rispondeva
«Conforme» a 0,8 e «Superamento» a 1,2 — sbagliando in tutt'e due i versi.

### Report di conformità
È il documento che si consegna all'ente: periodo, ricettore, letture,
**soglia applicata e da dove viene**, superamenti, esito
(conforme / non conforme / senza dati / senza soglia), più reclami e volate
del periodo come contesto. Sullo schermo è una scheda Deepwork; con **Stampa** le
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

## Dalla volata al referto: il ponte verso Genesi — T8

Genesi prevede le vibrazioni con la legge di Devine `PPV = K · SD^−β`
(`SD = distanza / √(carica per ritardo)`). K e β non sono universali, sono di
**quella** cava: finché nessuno li misura Genesi li stima dalla litologia,
valori da manuale. Per ricavarli davvero servono dei **referti**, e un referto
è fatto di tre numeri: distanza del punto di misura, carica massima per
ritardo, PPV registrata.

Due di quei tre numeri il registro volate li ha già. Il terzo lo porta il
sismografo. Il ponte è solo il collegamento fra la volata e la misura di quel
giorno — **nessuna formula nuova**: la regressione la fa Genesi, che ce l'ha.

- **Collegare la PPV** (pulsante 〰 su ogni riga del registro volate): la
  modale propone le **letture di vibrazione in mm/s** registrate quel giorno
  fra i punti di misura (`lettureVibrazioniDelGiorno`), oppure permette di
  **trascrivere** il valore dal referto di uno strumento non censito. La
  provenienza resta scritta sulla volata (`ppvFonte`, `ppvPuntoId`,
  `ppvPuntoNome`, `ppvData`, `ppvOra`) e compare accanto al numero, sempre.
- **Distanze coerenti**: la modale mette a confronto la distanza scritta sulla
  volata con quella dichiarata sul ricettore del punto scelto; se non
  combaciano lo dice, perché distanza e PPV devono venire dallo **stesso**
  punto o la coppia è sbagliata.
- **Unità**: una lettura di vibrazione in un'unità diversa da mm/s **non è
  selezionabile**: non è una PPV in mm/s e usarla come tale falserebbe la
  legge. Non si converte niente.
- **Vista «Referti per la legge di sito»** (scheda Registri): quante volate
  sono già utilizzabili e quante no, **con il motivo** (manca la PPV misurata,
  la distanza del ricettore, la carica per ritardo) e con il rimedio scritto
  una volta sola. Dice anche quanti referti servono (**3** minimo, sotto **8**
  la legge resta provvisoria — le stesse soglie che usa Genesi) e
  l'**escursione di distanza scalata** coperta: senza escursione la pendenza β
  non è ricavabile e Genesi rifiuta la legge.
- **Export dei referti**: `distanza_m; carica_per_ritardo_kg; ppv_mms;
  riferimento; data; origine` — le prime tre colonne nell'ordine che la modale
  «Legge di sito» di Genesi si aspetta di default, così il file entra senza
  rimappare niente. `origine = sentinella` su ogni riga: in Genesi ogni referto
  mostra da dove viene.
- **⛔ La PPV non si inventa**: entrano solo le volate con una misura. Senza
  PPV la volata resta fuori (e il motivo è scritto); una PPV a zero o non
  numerica viene rifiutata. Un referto inventato falserebbe K e β, e da K e β
  dipendono le distanze di sicurezza.
- **Registro volate**: export e import portano in coda quattro colonne
  facoltative (`ppvMisurata; ppvFonte; ppvPunto; ppvOra`), così la misura non
  si perde nel giro export → import. Un file vecchio a otto colonne si importa
  come prima: la volata resta senza PPV, non con una finta.
- **Volate vecchie**: registrate prima che questi campi esistessero, compaiono
  come «da completare» con il motivo. Nessun crash, nessun valore dedotto.

## Dalla volata progettata al registro: il ponte DA Genesi — T9

Il verso opposto di T8, e serve a togliere una **doppia digitazione**: chi
progetta una volata in Genesi doveva riscriverla a mano qui per poterla
monitorare. Stessa volata, due digitazioni, due occasioni di sbagliare. Genesi
però conosce già tutto quello che questo registro chiede — data, fronte, numero
di fori, kg totali, kg massimi per ritardo (la **MIC**, che calcola dai tempi di
detonazione), distanza del recettore, e la **PPV prevista**.

In Genesi: *progetta la volata → «📡 Manda a Sentinella»* → il file esce nel
formato che questo registro **già** importa. Qui: *Registri → Registro volate →
Importa da CSV*.

**Le due distinzioni che tengono in piedi tutto.**

1. **PREVISTA ≠ ESEGUITA.** Una volata progettata non è una volata sparata: i
   suoi chili sono ancora in deposito e la sua data può essere domani. La riga
   nasce **prevista** (badge col colore dell'app, icona del calendario, striscia
   `st-accent`) e diventa **eseguita** solo quando qualcuno lo conferma. Le
   previste **non** contano fra le volate eseguite, **non** entrano nel report di
   conformità (`reportConformita`) e **non** compaiono come «volata di quel
   giorno» accanto a un superamento (`volateDelGiorno`, `coincidenzaVolata`): un
   progetto non è un fatto, e un documento che va all'ente non può dire che è
   stato sparato dell'esplosivo che non è stato sparato.
2. **PPV PREVISTA ≠ PPV MISURATA.** Campi diversi (`ppvPrevista` /
   `ppvMisurata`), etichette diverse a schermo («PPV **prevista**» / «PPV
   **misurata**», sempre con la parola attaccata), colonne diverse nel CSV. Dove
   ci sono entrambe compare lo **scarto** previsto → misurato in mm/s e in
   percentuale: è la cosa che rende utile il registro, perché dice se il modello
   ci prende **in questa cava**.

- **⛔ Una volata prevista non diventa MAI un referto per la legge di sito.**
  `refertoDaVolata` la marca `prevista` e non `pronto`, con un unico motivo
  scritto («è ancora prevista»): non le si chiede una PPV che non può esistere.
  `csvRefertiGenesi` ha una **seconda guardia** ridondante (`!r.prevista`), e il
  pulsante 〰 sulle previste non c'è; se un clic ci arrivasse comunque,
  `collegaPpv` si ferma e lo spiega. Tre controlli su una cosa sola perché da
  quella legge dipendono le **distanze di sicurezza**: se un valore previsto
  entrasse nella regressione, la legge confermerebbe sé stessa.
- **La conferma dopo lo sparo** (spunta sulla riga): modale con i dati del
  progetto già dentro e **correggibili** — in cava il progetto cambia (fori
  saltati, carica ridotta, giorno spostato). Il messaggio dice **che cosa** è
  stato corretto rispetto al progetto. La data **non può essere nel futuro** (una
  volata eseguita è un fatto avvenuto): l'errore si legge dentro la modale, che
  resta aperta con quello che si era già scritto. La **previsione non si tocca**,
  altrimenti il confronto previsto → misurato sarebbe con un numero aggiustato
  dopo, cioè con niente.
- **Compatibilità**: una volata **senza** il campo `stato` — tutte quelle
  registrate finora — vale come **eseguita**, che è ciò che è. `riepilogoVolate`
  restituisce su uno storico esistente esattamente gli stessi numeri di prima;
  le previste si contano a parte (`riepilogoPreviste`, con l'avviso **da
  confermare** quando la data è già arrivata).
- **Colonne** (in coda a quelle di T8, tutte facoltative): `stato; ppvPrevista;
  ppvPrevLimite; ppvPrevNorma; ppvPrevFonte; airblastPrevisto; codiceVolata`.
  L'intestazione completa è `CSV_VOLATE_INTESTAZIONE`, **nello stesso file** di
  `parseVolateCsv`: due elenchi di colonne in due punti diversi si scollano.
  Export e import passano da `csvRegistroVolate` / `parseVolateCsv`. Genesi
  lascia **vuote** le quattro colonne della PPV misurata: non ha niente da
  scriverci.
- **Doppioni**: `firmaVolata` usa il **codice volata** se c'è (lo scrive Genesi,
  deterministico dal progetto) e sopravvive alla conferma — così reimportare il
  file dopo aver corretto fori e chili non crea una riga fantasma. Senza codice
  si torna alla firma di prima (`data|fronte|nFori|kgTotali`): i file già in giro
  si deduplicano esattamente come prima.

## La virgola decimale: come si scrivono i numeri

In cava i numeri li scrive un fochino italiano, e un fochino italiano scrive
**2,4**. Fino al 29/07 i campi decimali erano `<input type="number">`, e quel
tipo di campo non è neutro rispetto alla virgola: la specifica HTML gli impone
come valore un *valid floating-point number*, cioè col **punto**. Chromium,
provato in locale `en-US` **e** `it-IT`, si comporta allo stesso modo: digitando
`2,4` **butta via la virgola e lascia `24`**. Non un errore, non un campo vuoto:
un numero dieci volte più grande, salvato in silenzio. Sul campo della **PPV
misurata** questo significa un falso superamento e — peggio — un valore
sbagliato dentro la regressione della legge di sito.

Il `replace(",", ".")` che il codice faceva non serviva a niente: la virgola
era già stata scartata dal browser prima che JavaScript vedesse il valore.
Nemmeno `lang="it"` avrebbe risolto: il comportamento di `type="number"` non
dipende dalla lingua della pagina.

Da qui in poi i **14 campi decimali** dell'app sono
`<input type="text" inputmode="decimal">`:

| dove | campi |
| --- | --- |
| Registra misura | `mis-valore` |
| Ricettori | `ric-dist`, `ric-soglia` |
| Nuovo punto di misura | `sen-soglia` |
| Distanza scalata | `sd-carica`, `sd-dist`, `sd-target` |
| Registra volata | `vol-kg`, `vol-kgmax`, `vol-dist` |
| Collega la PPV misurata | `ppv-val` |
| Conferma volata eseguita | `conf-kg`, `conf-kgmax`, `conf-dist` |

`inputmode="decimal"` tiene la **tastiera numerica** sul telefono; il carattere
digitato arriva sempre al codice; e il numero lo legge una sola funzione,
`numeroDaCampo()` in `sentinella-data.js`, che accetta `2,4` · `2.4` ·
`1.250,75` · `1,250.75` e restituisce `{ vuoto, ok, valore, grezzo, motivo }`.
I campi interi (numero di fori, giorni del programma) restano `type="number"`:
lì la virgola non serve e lo spinner del browser è un vantaggio.

Il prezzo da pagare è che `min`/`max`/`step` del browser non valgono più: la
validazione è **nostra**, in `numeroDaCampo` più il messaggio scritto sul posto.
Quello che l'app **non** fa più è salvare uno zero al posto di un numero che
non ha capito: lo dice. Sul campo della PPV misurata, mentre si scrive, una
riga sotto il campo dichiara il valore che verrà salvato («Verrà salvato
2,4 mm/s»).

## Regole rispettate

- **Soglie di sicurezza**: i preset normativi (`SOGLIE_PRESET`, DIN 4150-3 /
  USBM / PM10) sono **invariati**. La novità è solo la soglia per ricettore,
  impostata dall'utente.
- **Unità mai in maiuscolo**: `text-transform:uppercase` trasformerebbe
  `µg/m³` in `MG/M³` (milligrammi, mille volte tanto). Su un documento che
  va all'ente sarebbe un errore, quindi le unità escono dal maiuscolo
  (`.tab th .u`, `.graf-axlab`). Per i grafici del motore condiviso non c'è
  più un override qui: `shared/dw-grafici.js` avvolge l'unità in `.dwg-u`.
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
- Virgola decimale: Chromium con locale `en-US` e `it-IT`, digitando `2,4` in
  tutti e 14 i campi (il valore resta `2,4`); PPV salvata riletta dal record e
  dal **CSV dei referti per Genesi**, dove la colonna `ppv_mms` esce `2.4` —
  non `24`, non vuota. Provati anche `2.4`, `1.250,75` e un testo non
  numerico, che viene rifiutato con il motivo scritto.
