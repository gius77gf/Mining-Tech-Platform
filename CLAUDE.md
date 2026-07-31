# Mining-Tech-Platform — istruzioni per Claude

Monorepo dell'ecosistema Deepwork: software per cave/attività
estrattive, venduto ad aziende spesso CONCORRENTI tra loro.
Fondatore: Giuseppe (non tecnico — spiegare le cose in modo semplice,
in italiano, senza dare conoscenze per scontate).

## Struttura
- Radice: Deepwork core (index.html monolite ~8k righe, PWA su
  Netlify — deploy automatico ad ogni merge su main)
- `apps/<nome>/` — le app dell'ecosistema (deepwork-id, genesi, scudo,
  campo, flotta, conti, sentinella, terra). Ognuna raggiungibile
  online come /apps/<nome>/ sul sito esistente (vedi apps/DEPLOY.md)
- `shared/` — stile deepwork vincolante (deepwork-style.css,
  dw-app-shell.css) e SDK identità (deepwork-id-client/)
- `vault/` — memoria di lavoro: ROADMAP_SETTIMANA.md + checkpoints/
- `docs/` — audit e piani (AUDIT_SICUREZZA.md, MITIGAZIONE_PASSWORD.md)

## Procedura dei cicli di lavoro automatici
1. `git pull` per allinearsi, poi leggere vault/ROADMAP_SETTIMANA.md
   e il checkpoint PIÙ RECENTE in vault/checkpoints/ (timestamp più
   alto nel nome, esclusa la sottocartella archivio): riprendere dal
   suo "Prossimo passo atomico".
2. Unità piccole, commit frequenti. Al completamento di OGNI unità:
   nuovo file checkpoint (MAI sovrascrivere i precedenti) con task
   completato, hash commit, prossimo passo atomico preciso; aggiornare
   lo stato del task in ROADMAP_SETTIMANA.md.
3. OGNI ciclo lavora FINO AD ESAURIMENTO DEI CREDITI, senza eccezioni
   (regola del fondatore, ribadita due volte): finita un'unità se ne
   inizia SUBITO un'altra; se la roadmap sembra finita si prosegue con
   seconde iterazioni, rimandati, test, revisioni — il lavoro non
   finisce mai da solo. VIETATO "chiudere il blocco" o fermarsi per
   scelta: l'unico stop legittimo è il limite tecnico della
   piattaforma. Il "punto stabile" (commit pulito + checkpoint
   completo dopo ogni unità) serve SOLO a rendere sicura
   l'interruzione forzata, mai a giustificare una fermata volontaria.
4. Ciclo serale: NON più un blocco fisso di revisione (direttiva
   fondatore 26/07). Al suo posto si prosegue con ricerca e sviluppo; la
   qualità si tiene con verifiche dentro OGNI unità (screenshot, test,
   controllo sintassi).
5. LAVORO IN CONTEMPORANEA su tutte e sei le app (direttiva 26/07): in
   ogni ciclo più cantieri aperti insieme, un agente per app (i file
   sono separati in apps/<nome>/, nessun conflitto). Si serializza solo
   ciò che tocca shared/, docs/, vault/.

## Regole vincolanti
- ⛔ DATI DI RIFERIMENTO DEL FONDATORE — REGOLA FERREA E IMMUTABILE
  (25/07, non va più ripetuta): i dati che il fondatore ha fornito
  all'inizio erano SOLO ORIENTATIVI, per far capire i video che stava
  mostrando. NON devono comparire da nessuna parte nell'interfaccia,
  nei testi, negli export o nei documenti dell'app: archivio dei 190
  video, le 6/23 volate misurate, maglia 4,5×3,5, Nonel 25 ms, 15-20
  fori, calcare come "dominio di validità", e qualunque altra citazione
  di quella origine. Si possono USARE internamente per i calcoli e le
  calibrazioni, ma MAI mostrare né citare. Nessuna eccezione.
- ⛔ STILE — DIRETTIVA VINCOLANTE (fondatore 27/07, sostituisce quella
  del 25/07; «su questo non transigo»). Due metà da non confondere:
  1. **STRUTTURA: IDENTICA AL CORE, PELO PER PELO.** Le app copiano
     l'impianto estetico e le dinamiche di funzionamento del core
     Deepwork (index.html alla radice) senza cambiare "una virgola":
     stessa struttura di pagina, topbar, navigazione, card, liste,
     form, modali, toast, stati vuoti; stessi raggi, bordi, gradienti,
     ombre, spaziature, tipografia, transizioni, animazioni, alone che
     seguo il mouse; stessi comportamenti di interazione. Niente
     scorciatoie: `alert()`/`confirm()` del browser sono vietati, si usa
     il toast del core.
  2. **COLORE: IDENTITÀ PROPRIA DI OGNI APP.** NON si copiano i colori
     del core: quelli sono di Deepwork. Ogni app ha una **palette
     propria e un proprio carattere**, costruita attorno al suo colore
     principale, che va **fuso in tutto il contesto** (sfondi, aloni
     d'ambiente, bordi, grafici, stati) — non un accento sparso su un
     tema altrui. Ammessi colori di appoggio scelti per armonia, se
     servono a renderla più professionale e piacevole.
  Il punto di partenza è che oggi le app sono «un'accozzaglia di colori
  che non porta da nessuna parte»: l'obiettivo è una palette **armonica,
  accattivante e professionale** per ciascuna, decisa con ricerca
  cromatica vera e verificata per contrasto/leggibilità.
  shared/deepwork-style.css resta il veicolo tecnico della STRUTTURA;
  la palette per app passa dalle variabili di tema dell'app.
- 🎯 **L'ECCELLENZA È LO STANDARD — DETERMINANTE PER OGNI SCELTA FUTURA**
  (fondatore 27/07, da applicare a qualsiasi decisione, per sempre):
  1. **Nulla è lasciato al caso.** Ogni singola virgola e ogni singolo
     dettaglio vanno decisi con cognizione, non per abitudine o fretta.
  2. **Si parte dai migliori prodotti in circolazione**: si cercano, si
     studiano, si emulano — e poi si fa **meglio di loro**. Il metro non è
     "funziona", è "è il migliore che si possa fare".
  3. **Ricerca approfondita prima di ogni scelta**, su tutto: funzioni,
     interazioni, testi, estetica. Le ricerche vivono in `docs/` e vanno
     tradotte in unità concrete, mai gonfiate.
  4. **Metodo del confronto affiancato**: dopo ogni modifica si mette il
     risultato accanto al riferimento (il core, o il miglior prodotto di
     categoria) e si corregge dove il nostro è più povero. **Almeno tre
     iterazioni**: la prima versione non è mai quella buona. Non ci si
     ferma quando funziona, ci si ferma **quando è eccellente**.
  5. Sequenza dichiarata dal fondatore: **questa settimana l'estetica**,
     nei giorni successivi **lo standard di ogni funzione e funzionalità**,
     con lo stesso livello di approfondimento.
- **QUALITÀ VISIVA — cosa la produce davvero** (non basta applicare le
  variabili di colore): luce stratificata (ambiente + riflesso sul bordo
  alto + ombra propria + ombra proiettata), bordi che catturano la luce,
  aloni d'ambiente nella tinta dell'app, alone che segue il mouse,
  micro-profondità su badge/pillole/bottoni/campi, gerarchia tipografica
  vera con cifre allineate, movimento con curve morbide, spaziature su una
  scala coerente. Riferimenti: `docs/SPECIFICA_ESTETICA_CORE.md`,
  `docs/PALETTE_APP.md`.
- ⛔ **L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE.** Trovata il 31/07 in
  **tre app indipendenti**, scritta ogni volta da un punto di vista diverso:
  in Sentinella «senza dati» non è «conforme» (il report per l'ente lo dichiara
  invece di spacciarsi per a posto); in Scudo un requisito senza nessuna riga in
  scadenzario è **mancante**, non «regolare»; in Campo, nell'appello del turno,
  **«non lo so» non è «non c'è»** — chi nessuno ha spuntato non si conta né
  presente né assente, perché se suona l'allarme contarlo assente vuol dire non
  andarlo a cercare. Tre posti, tre autori, la stessa idea: è un **principio del
  prodotto**, e va applicato a ogni funzione nuova che riassume qualcosa. Il
  segno che è stato violato è sempre lo stesso — un numero o un colore
  **tranquillo** dove non è stato misurato niente.
- ⛔ **UNA REGOLA CHE SERVE A DUE APP VIVE IN `shared/`.** Non nel modulo di una
  delle due (nessuna app importa il modulo dati di un'altra) e **mai riscritta**:
  è il difetto che è costato una giornata intera con la convenzione sui numeri,
  finita scritta quattro volte con tre comportamenti diversi. Il posto per la
  logica che sta **fra** le app è `shared/dw-ponti.js`; il modulo dell'app la
  **ri-esporta** col nome con cui l'ha sempre chiamata, così le pagine non
  cambiano — un alias non è una seconda implementazione.
  E il test pretende l'**identità** (`terra.X === ponti.X`), non il
  comportamento: due copie uguali oggi divergono domani senza che nessuno lo veda.
- **MISURARE PRIMA DI IRRIGIDIRE.** Due volte in un giorno l'ipotesi ragionevole
  era falsa: sui campi interi «basta leggere `checkValidity()`» — no, su «1,5»
  Chromium fa «15» e risponde **true**; e su `parseNum` «si può irrigidire» — no,
  cinque letture sono celle di CSV di una perforatrice, che scrive in notazione
  scientifica. Mezz'ora di misura prima, invece di una correzione che rompe in
  silenzio.
- MULTI-TENANT: isolamento totale dei dati tra organizzazioni. Ogni
  accesso dati delle app passa dallo SDK deepwork-id-client
  (orgCollection), mai percorsi Firestore costruiti a mano.
- GIT: sviluppo sul branch di sessione designato. Niente push diretto
  su main: gli aggiornamenti passano da Pull Request (prassi:
  merge via PR anche per vault/ e docs/). Commit piccoli con messaggi
  chiari.
- SOLDI: nessuna spesa (domini, piani a pagamento) prima della fase di
  commercializzazione — decisione esplicita del fondatore.
- SICUREZZA: docs/MITIGAZIONE_PASSWORD.md è PREPARATA ma NON attivata
  senza conferma esplicita del fondatore in conversazione.

## Test
- ⚠️ **LA SUITE ESISTE E COPRE TUTTE LE APP.** Tre cantieri di fila hanno
  scritto «la mia app non ha una suite in cui mettere i test» e non è vero:
  `apps/deepwork-id/tests/run-kpi.mjs` importa **tutti** i moduli
  `apps/<nome>/<nome>-data.js`, quindi qualunque funzione pura di qualunque
  app si testa lì. Si lancia con `node apps/deepwork-id/tests/run-kpi.mjs`,
  senza emulatori e senza rete. Due avvertenze imparate a spese nostre:
  1. i test vanno inseriti **prima** del blocco di riepilogo finale, che
     chiude con `process.exit`: appesi in coda non vengono mai eseguiti, e il
     totale resta invariato senza che nulla segnali l'errore;
  2. si controlla sempre che il **totale sia salito**, non solo che i falliti
     siano zero: un file di test inerte dice «0 falliti» come uno che passa.
- ⚠️ **`toLocaleString("it-IT")` NON RAGGRUPPA ALLO STESSO MODO** in Node e nel
  browser: sui numeri di **quattro cifre** Chromium scrive «6.375» e Node
  «6375» (strategia `min2`). Da cinque cifre in su sono d'accordo. Le pagine
  non ne soffrono — girano solo nel browser — ma i **moduli dati li leggono
  tutt'e due**, e una loro funzione che non scrive `useGrouping` restituisce
  due stringhe diverse a seconda di dove gira: da lì una prova che passa in
  Node e **fallirebbe nel browser**, cioè che blinda una verità che l'utente
  non vede mai. La regola 16 di `run-stile.mjs` lo pretende scritto (anche
  `false`, dove è la scelta giusta). Misura: `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`.
- **DUE CONTROLLI CONTANO AL POSTO DELLA MEMORIA**, e sono in coda alla suite:
  `copertura-funzioni.mjs` (quante funzioni sono provate: due volte in due
  giorni quel numero è finito sbagliato in un documento perché contato a mente)
  e `nomi-doppi.mjs` (lo stesso nome esportato da due app: o è lo **stesso
  oggetto**, o la differenza va **dichiarata con la ragione**). La regola del
  `shared/` era scritta qui dentro da mesi, e in un giorno solo ne sono uscite
  **cinque** violazioni: una regola scritta è affidata alla memoria di chi legge.
- ⚠️ **UN FONDO CATTURA LE PROVE TOLTE, NON IL CODICE AGGIUNTO SENZA PROVE.** Il
  03/08 `copertura-funzioni.mjs` prometteva nella sua intestazione: «se una app
  scende sotto il fondo vuol dire che sono state aggiunte funzioni senza prove».
  **Falso, e misurato**: aggiungendo a Terra un `export function
  funzioneMaiProvata` la conta va a **40/41, 98%** e il controllo esce **0** —
  perché il fondo sta sul numero di funzioni **coperte**, che aggiungendo codice
  non provato non scende. Il caso che la riga prometteva era esattamente quello
  che non vedeva, e nella direzione che rassicura. Vale per **qualunque** soglia
  scritta su un valore monotòno: si controlli **che cosa fa scendere il numero**,
  non solo che il numero non scenda. Adesso la regola vera è **nessuna funzione
  scoperta** (tutte e sei le app e tutti e tre i moduli condivisi sono al 100%,
  e chi aggiunge una funzione aggiunge la prova o la dichiara in `FUORI` con la
  ragione); il fondo resta come seconda guardia.
  E il censimento adesso guarda anche `shared/dw-ponti.js`,
  `shared/deepwork-id-client/dw-shell.js` e `apps/genesi/pointcloud.js`: si
  chiamava «quante funzioni delle **app**» e lasciava fuori proprio il codice
  che la regola del `shared/` indica come il più pericoloso. Copertura misurata
  lì: **46 su 46**.
- Le altre suite locali (`run-demo.mjs`, `run-helpers.mjs`,
  `run-pointcloud.mjs`, `run-manifest.mjs`, `run-stile.mjs`) girano anch'esse
  con `node`.
- **`run-stile.mjs` rende verificabili le regole vincolanti** che prima
  vivevano solo qui — diciassette, al 03/08: niente dialoghi del browser, unità mai in
  maiuscolo, nessun campo decimale `type="number"`, nessun campo decimale letto
  col lettore che fa zero, la guardia sui campi interi montata dove servono, il
  ponte con Terra che non dà la colpa a chi compila, la provenienza di un
  rilievo decisa in un posto solo, e la **struttura del core mai riscritta in
  casa** (chi carica `shared/dw-app-ui.js` non ridefinisce toast e modale; chi
  le usa deve averle da qualche parte — togliere le funzioni dimenticando il
  `<script>` non è un errore di sintassi, la pagina si apre e muore al primo
  tocco). L'intestazione del file le elenca con la
  ragione di ognuna. Quando nasce un'app va aggiunta all'elenco `SUPERFICI`.
- ⚠️ **UNO STRUMENTO CONDIVISO DA TUTTI I CONTROLLI NON È CONTROLLATO DA
  NESSUNO.** Il 03/08 la scansione che sta sotto a tutte e sedici le regole
  **perdeva la fase**, per due difetti indipendenti: leggeva la pagina intera
  come JavaScript (e l'apostrofo di «l'ecosistema» nel TESTO apriva una
  stringa — da 7 a 131 apostrofi per superficie, dispari = fase invertita), e
  giudicava lo slash dall'ultimo carattere invece che dalla parola (`return
  /[;"\n]/` preso per una divisione, e la virgoletta dentro la regex apriva una
  stringa lunga 1.500 caratteri). Effetto: **115 delle 195 funzioni dichiarate a
  colonna zero in Genesi** finivano marcate «non codice», cioè la regola 1 era
  cieca su decine di migliaia di caratteri e rispondeva lo stesso «nessuna
  violazione». Il core ne usciva pulito **per caso** — due inversioni che si
  annullavano. Ogni regola aveva la sua controprova e ognuna passava: mancava
  la prova sullo **strumento**. Adesso c'è, ed è l'unica del file che verifica
  la scansione invece di una regola: *7.485 dichiarazioni in 22 file, nessuna
  presa per stringa*, con la controprova che rimette i due difetti (801 e 54
  dichiarazioni perse). E anche quella prova ha sbagliato mira due volte, per la
  solita ragione: contava solo le righe a **colonna zero** — 934 ancore, ma le
  sei pagine delle app ne davano **zero**, perché il loro codice è indentato —
  e pretendeva «è codice» dove basta «non è dentro una stringa» (l'esempio d'uso
  scritto in un commento è un commento). Racconto e misure:
  `docs/LA_SCANSIONE_CHE_PERDEVA_LA_FASE.md`.
- **Due tokenizzatori, e vanno scelti**: `mascheraCodice` maschera il
  **contenuto** delle stringhe (giusto per i dialoghi — un `prompt(` dentro una
  stringa non è una chiamata), `senzaCommenti` toglie **solo i commenti** e tiene
  il resto (giusto per le regole sui TESTI, che vivono dentro le stringhe).
  Prendere quello sbagliato dà una regola che non guarda dove crede: la regola 6
  è caduta segnalando il commento che documentava la decisione.
  **Due viste, ma UNA scansione sola** (`classifica`), dal 31/07: erano due
  scansioni gemelle scritte a poca distanza, e portavano lo stesso difetto in
  due posti — la conferma che una regola usata due volte va scritta una volta.
- ⚠️ **I TEMPLATE ANNIDATI, E IL BUCO CHE APRIVANO.** Un tokenizzatore che,
  entrato in un `backtick`, corre fino al backtick **successivo** sbaglia due
  volte: (1) il contenuto di `${...}` è **codice**, non testo — `${prompt('x')}`
  è una chiamata vera; (2) con i template annidati, che le app usano di
  continuo (`${dup ? \`, ${dup} già presenti\` : ""}`), il backtick che **apre**
  quello interno viene preso per quello che **chiude** l'esterno, e da lì la
  scansione va fuori fase: basta un apostrofo — in italiano ce n'è uno ogni due
  parole — per aprire una stringa che corre in avanti masticando codice vivo.
  Misurato: rimettendo un `window.prompt()` dove riprende il codice, **764
  iniezioni su 1030 non venivano viste**. La regola 1 (niente dialoghi del
  browser) era quindi cieca su gran parte di tutte le superfici, core compreso,
  **e la sua controprova diceva ok**: guardava tre superfici a un punto
  ciascuna, e nessuno di quei punti cadeva dove la scansione si perdeva. Adesso
  la controprova è **a tappeto** e stampa quante iniezioni ha provato.
  La lezione non è sui backtick: è che **una controprova va misurata anche nella
  sua copertura**, non solo nel suo esito. Sapere fallire in un punto non
  dimostra niente sugli altri mille.
- **Il browser serve per SCOPRIRE un difetto, non per tenerlo chiuso.** Le prove
  sui buchi dei grafici sono nate con Playwright, ma `tratti`/`percorso` prendono
  numeri e restituiscono una stringa: vivono in `run-kpi.mjs` e girano sempre. Il
  motore le espone di proposito in `dwGrafici.geometria`. Una difesa che resta
  nello scratchpad, alla sessione dopo non esiste.
- **Quello che il browser scopre e basta vive in `apps/deepwork-id/tests/browser/`**
  (vedi il suo LEGGIMI). Ci sta `interi-superfici.mjs`, che digita davvero nei
  29 campi interi di tutte e sette le superfici — 87 asserzioni, e con
  `--senza-guardia` ne devono cadere due su tre per campo. È così che è venuto
  fuori che Terra aveva una **seconda copia** della regola degli interi e
  «1.500» diventava «500».
- ⚠️ **IL CORE NON SI APRE IN LOCALE, e non è colpa del login.** Tutto il suo
  programma sta in un `<script type="module">` che importa Firebase da
  `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano
  solo i segnaposto che il core installa apposta («Funzione nav non ancora
  pronta»). Chi non lo sa passa un'ora a chiedersi perché `nav('ufficio')` non
  faccia niente: non è il `nav` del core. Si monta
  `tests/browser/finto-firebase.mjs` PRIMA di `goto` e il core parte davvero.
- ⚠️ **UNA PROVA CHE NON SA FALLIRE NON DIMOSTRA NIENTE.** Ogni controllo
  nuovo va provato **contro il difetto**: si rimette il difetto e si pretende
  che il controllo fallisca. Costa due minuti e ha già salvato due volte:
  1. `run-stile.mjs` passava su tutte le superfici **e** passava anche con un
     `window.prompt()` rimesso a mano nel core, perché tagliava i commenti con
     `replace(/\/\*[\s\S]*?\*\//g,'')` e il core scendeva da 537.000 a 137.000
     caratteri: `/*` e `*/` compaiono anche dentro stringhe ed espressioni
     regolari, l'accoppiamento non greedy legava i delimitatori sbagliati e
     cancellava 400.000 caratteri di codice **vivo**. Ora la controprova
     inietta il dialogo nei file veri, dentro la suite.
  2. La correzione delle unità nei grafici: le 11 asserzioni girate sulla
     versione precedente del motore ne facevano fallire 8. Senza quel passaggio
     non si sapeva se stessero misurando qualcosa.
- ⚠️ **UNO SCRIPT CHE «NON FALLISCE» NON HA PER FORZA FATTO QUALCOSA.** Il
  01/08 una controprova è stata **dichiarata riuscita in un messaggio di commit
  senza essere mai partita**: l'`assert` sul testo da sostituire cercava
  quattro spazi di indentazione dove il file ne ha due, è saltato **prima**
  della scrittura, e tutt'e due le sonde hanno misurato un file **sano**. Un
  `assert` che scatta, un `sed` che non trova, un `replace` che sostituisce zero
  occorrenze: finiscono tutti in silenzio o con un'uscita che sembra buona.
  Difesa: **stampare quanti soggetti ha toccato davvero** (`2 guardie tolte`,
  `-31 caratteri`) **e** confrontare la copia con l'originale — la conta da sola
  mente quando il difetto è uno scambio di due argomenti, che cambia zero
  caratteri. E il corollario: **il messaggio del commit si scrive DOPO aver
  letto l'esito.**
- ⚠️ **«NON DISTINGUE» HA DUE LETTURE OPPOSTE, E VANNO SEPARATE.** Quando la
  controprova dice che il difetto non fa cadere la prova, la causa è una di due,
  e portano a interventi contrari:
  1. **la prova non prova niente** — i suoi dati fanno **coincidere** la
     risposta giusta con quella sbagliata. Successo su «l'ultima lettura oltre
     è la più RECENTE, non la più alta», scritta con letture in cui la più
     recente **era** la più alta: passava per un motivo diverso da quello nel
     suo nome. Si correggono i **dati della prova**;
  2. **il codice è difeso in profondità** — più guardie indipendenti reggono
     la stessa regola, e toglierne una lascia in piedi l'altra. Successo sul
     vincolo T9 (una volata prevista non è mai un referto), protetto sia dal
     motivo spinto sempre sia dal flag. Si toglie **tutto lo strato**, e allora
     si vede il danno vero.
  3. **l'iniezione non ha iniettato niente** — i caratteri cambiati ci sono, ma
     nessuno sta su un percorso che viene eseguito. Successo il 02/08 mettendo
     nella copia solo la *lettura* di una cache e non la *scrittura*: la copia
     si comportava come l'originale. Non si tocca né la prova né il codice: si
     guarda **l'iniezione**.
  4. **l'iniezione è puntata nel posto sbagliato** — il difetto è vero, ma il
     nome della prova che dovrebbe cadere guarda un'altra funzione. Successo il
     02/08 togliendo il filtro delle bozze da `anniConVolumi` col nome di una
     prova che le bozze non le guarda. Si sposta l'iniezione dove il numero si
     forma davvero.
  5. **il caso difeso non c'è nella prova** — variante di (1): i dati della
     prova non arrivano mai al ramo che il difetto rompe. Successo su
     `valorePesata`, dove mancava la pesata a metro cubo **senza densità**:
     l'unico caso in cui il ripiego sul netto avrebbe moltiplicato tonnellate
     per un prezzo al metro cubo.
  Le prime due si distinguono per **dove** si interviene; le altre tre per il
  fatto che il codice non è mai stato messo alla prova.
- ⚠️ **UNA PROVA DI ANDATA E RITORNO RESTA VERDE SE LE DUE METÀ SBAGLIANO
  INSIEME.** Il giro `csvRegistroVolate` → `parseVolateCsv` pretende l'identità
  su 19 campi ed è la prova più forte che il registro non perda niente. Ma
  scritti i numeri con la **virgola** italiana invece che col punto, il giro
  resta **identico**: il lettore usa `numIt`, che la virgola la legge. Il giro
  dimostra che scrittore e lettore vanno d'accordo **fra loro**, non che il
  formato sia quello giusto per chi apre il file con un altro programma. Per
  quello serve un'asserzione sul **testo** del file (`;3.2;`). Stessa forma per
  qualunque coppia scrivi/leggi, cifra/decifra, serializza/deserializza.
- ⚠️ **LE PROVE GIRANO ANCHE CON `TZ=Europe/Rome`.** Il contenitore è in **UTC**,
  le cave sono in Italia. Il 01/08 una controprova sul conto dei giorni ha
  risposto «non distingue» in UTC e ha visto il difetto in ora italiana; la
  suite intera, rilanciata con l'orologio del cliente, è caduta in **due punti**
  che in UTC erano verdi. Da lì è uscito un cantiere intero
  (`docs/RICERCA_GIORNO_LOCALE_202607.md`): `toISOString()` su una data
  costruita in ora **locale** perde una o due ore, e quando attraversano la
  mezzanotte cambia il **giorno**. **Un controllo che gira in un ambiente
  diverso da quello del cliente misura l'ambiente, non il prodotto.**
- ⚠️ **IL CONTROLLO CHE NON GUARDA DOVE CREDE.** Variante della regola qui
  sopra, e più insidiosa: il controllo **sa** fallire, ma il suo filtro esclude
  proprio i casi che contano, e allora risponde «pulito» senza aver guardato
  niente. Il 31/07 è successo **tre volte in un giorno**:
  1. il censimento dei doppioni cercava la forma `.some(` e non vedeva i
     quattro gestori che usano un `Set` — quelli che facevano la cosa giusta;
     poi lo stesso filtro è finito **dentro la regola** nata da quel censimento,
     che quindi era cieca proprio dove il codice era sano;
  2. la controprova del banco degli id iniettava il difetto sostituendo il
     **primo** `</body>`, che in Terra, Genesi e Campo sta dentro le stringhe
     dei modelli di stampa: su tre superfici su nove il difetto non arrivava mai
     nella pagina e la controprova diceva «pulito»;
  3. la sonda sulle tendine scartava gli elementi con **altezza zero** — cioè
     tutte quelle delle sezioni non aperte — e rispondeva «nessuna tendina
     taglia il testo» mentre uno screenshot mostrava il contrario.
  La difesa: dopo aver scritto un controllo, chiedersi **quanti soggetti ha
  guardato davvero** e stamparlo (`84 tendine misurate`, `20 gestori`,
  `9 superfici`). Un numero che non torna si vede; un «zero violazioni» no.
- Quando si misura qualcosa nel browser, due trappole già pestate:
  `document.elementFromPoint` vive nel **viewport** (un elemento sotto la piega
  risponde `null` e sembra irraggiungibile: va portato in vista), e «questo
  punto è mio» significa l'elemento **o un suo discendente** — accettando anche
  un antenato si misura la riga intera e vengono fuori aree di tocco da 80 px
  che non esistono. E `innerText` su una scheda nascosta ricade su
  `textContent`, quindi il maiuscolo non si vede: va letta la trasformazione
  **effettiva** con `getComputedStyle`.
- Quando un test fallisce dopo un lavoro nuovo, prima di dire che c'è un
  difetto va letto **come il codice si aspetta i dati**: succede spesso che
  sia la prova a indovinare male i nomi dei campi, e una prova sbagliata che
  accusa il codice fa perdere più tempo di nessuna prova. Se invece il test è
  invecchiato perché il prodotto è migliorato, si corregge rendendo
  l'asserzione **più giusta, non più permissiva** (vedi `contiene`).
- Regole di sicurezza Firestore: `cd apps/deepwork-id && firebase
  emulators:exec --project demo-deepwork "cd tests && npm test"`
  (richiede firebase-tools + Java; 19 test, devono passare tutti).
- Verifica visiva pagine: server statico locale + screenshot
  (Playwright/Chromium preinstallato). Gli screenshot vanno **guardati**, non
  solo prodotti: nella giornata del 29/07 un campo scomparso, una miniatura
  illeggibile e un'unità di misura stravolta dal maiuscolo sono stati trovati
  così, e nessuno di quei difetti si vedeva leggendo il codice.
- ⚠️ **NON SI INIETTANO DIFETTI MENTRE GIRA UN GIRO DEL BROWSER.** Per provare
  che un controllo sappia fallire si rimette il difetto nel file vero e si
  ripristina subito: giusto, ed è la regola qui sopra. Ma se il file è un
  **modulo dati** (`apps/<nome>/<nome>-data.js`) o una **pagina**, quelle stesse
  righe se le carica il browser — e se un banco apre la pagina dentro la
  finestra d'iniezione, il suo risultato è **falso**, in un verso o nell'altro.
  Il 01/08 è successo: un giro a 19 banchi è stato buttato per questo. Le
  iniezioni sui file di **test** (`run-stile.mjs`, `run-kpi.mjs`) restano sicure,
  perché nessuna pagina li importa. Finché gira un giro: si lavora su `docs/`,
  `vault/` e le suite `node`, e le iniezioni sui moduli si aspettano.
- ⚠️ La cartella scratchpad è **condivisa** fra i cantieri paralleli: ogni
  agente deve creare una propria sottocartella, altrimenti si sovrascrivono i
  file di prova a vicenda (è già successo più volte).

## Contesto di progetto
- Vault Obsidian di visione/ricerca: repo gius77gf/ecosistema-vault
  (mappa ecosistema, roadmap generale, schede delle 6 app, wiki
  ricerca competitor).
- Genesi vive in apps/genesi (spostata dal vecchio repo genesi-app,
  che resta solo come archivio storico).
- Deepwork ID (apps/deepwork-id/ARCHITETTURA.md) è la Fase 0: tutte le
  app dipendono da lui per login/abbonamenti/isolamento.
