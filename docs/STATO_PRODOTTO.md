# Stato del prodotto — l'ecosistema in parole semplici

Data: 2026-07-23, **con un aggiornamento del 30/07 qui sotto** · Per Giuseppe
(fondatore). Questo file risponde a una
domanda sola: **oggi, cosa fa ciascuna app, cos'è pronto e cosa aspetta una
tua decisione?** Niente gergo. Se una cosa serve una tua scelta, la trovi
anche in `docs/DECISIONI_WEEKEND.md` (l'elenco delle decisioni).

Come leggerlo:
- **Cosa fa già** = funziona adesso, nella demo e (quando il login live sarà
  acceso) anche con i dati veri dell'azienda cliente.
- **Pronto** = testato, si può mostrare a un cliente.
- **Aspetta te** = una decisione o una spesa che spetta a te; finché non la
  dai, i cicli automatici non la toccano.

Regola di fondo valida per TUTTE le app: ogni azienda cliente vede **solo i
propri dati** (isolamento totale — è la promessa numero uno del prodotto).
Le app girano nel browser; senza login mostrano una **demo** con dati finti
così un commerciale può farle vedere senza configurare nulla.

---

## ⚠️ Aggiornamento del 4 settembre — tutte le app guardate in profondità, in quattro righe

**Diciannove difetti veri, corretti, in due giorni di passate.** Ogni app e il
core sono stati aperti schermata per schermata a 390 e 320 px nei temi, ogni
bottone che produce un file è stato premuto e il file aperto, la dimostrazione
svuotata pezzo per pezzo. Le cose più grosse: la home di Genesi che **non
scorreva sul telefono da cinque settimane**; una norma sconosciuta che veniva
sostituita con «DIN residenziale» e usciva nei file con un limite e un
verdetto; il Quadro di Campo e di Sentinella che dicevano «tutto tranquillo»
su una giornata o una cava in cui non era stato registrato niente; un appalto
senza sito che in Scudo diventava «a posto»; un importo tagliato («€ 12.750»
per «€ 12.750,00») nell'ordine di lavoro di Flotta; il rapporto di Terra con la
pastiglia sopra il titolo. E i dati di riferimento tuoi in un file di Genesi
pubblicato sul sito: tolti, con un controllo che legge anche i JSON.

**Quello che resta è tuo**: tre decisioni nuove (22-24) in
`docs/DECISIONI_WEEKEND.md`, che con le altre fanno undici.

**La giornata ha avuto quattro interruzioni per limite di crediti**: ogni
volta si sono persi i cantieri appena aperti e il giro completo del browser;
il giro FILTRATO per famiglia (89 passate, un'ora e un quarto) è arrivato in
fondo ed è la forma che regge.

## ⚠️ Aggiornamento del 3 settembre — il terzo lato del triangolo, in cinque righe

**Le scorte a piazzale si misurano, non si stimano più.** Terra ha una schermata
nuova, «Inventario dei cumuli»: la fotografia del piazzale a una data (per ogni
cumulo il materiale e i metri cubi; un cumulo che nessuno ha misurato resta
«non misurato», non zero). Conti la legge e chiude il conto che ogni cava fa a
fine mese — cavato − venduto − variazione delle scorte — in tonnellate, con la
densità giusta per ciascuno (in banco per il fronte, del listino per i cumuli).
Se lo scarto non torna, Conti dice il verso: materiale sparito (sfrido,
ripristino, uscite non pesate) o materiale in più (manca un rilievo, o una
densità è sbagliata). Il verbale di riconciliazione registra anche questo terzo
lato, o scrive perché restava stimato.

**Il rapportino del fochino ha l'esito dello sparo.** Colpi esplosi contati e
colpi mancati con la nota di dove sono e chi bonifica: se non è scritto niente
l'app dice «non contato», mai «0 mancati». Il pericolo si vede nell'elenco,
nella scheda, nel PDF e nella cronologia della cava. E i chili di esplosivo
sono anche per tipo, come li vuole il registro di carico e scarico.

**Un difetto piccolo ma della famiglia peggiore**, trovato leggendo il core: la
freccia della calotta di una galleria scritta a **zero** (cielo piatto) veniva
letta come «mai scritta» e i fori di contorno nascevano su un arco di un metro
che tu avevi tolto. Corretto, con la prova sul sorgente.

**Sei documenti di ricerca esistevano due volte** con lo stesso nome a
maiuscole diverse: su un computer Windows o Mac il repository non si sarebbe
scaricato intero. Uniti, e un controllo impedisce che ricapiti.

**Due ricerche nuove, con il delta**: il rapporto di volata (le due mancanze
vere sono quelle chiuse sopra) e i ruoli in cava — oggi chi entra in
un'organizzazione vede tutte le app, e le figure di legge (direttore
responsabile, sorvegliante, RSPP, medico) sono nomine in Scudo, non permessi:
è la decisione Q1, tua, preparata e non presa. Nella notte la sessione ha
toccato il limite dei crediti e si è ripresa alle 05:40.

## ⚠️ Aggiornamento del 2 settembre — la giornata dei ponti

*Il blocco del 30 luglio qui sotto resta vero. Questo dice che cosa è cambiato
il 2 settembre, in un giorno solo, con la fase nuova che hai aperto il 26/08
(«i dettagli di ogni app»).*

**Le app si parlano di più.** La mappa dell'ecosistema (`docs/MAPPA_ECOSISTEMA.md`)
contava 6 ponti di dati su 56 possibili; a sera sono **10**. Quattro sono nuovi:
- **Conti ↔ Flotta, nei due versi**: lo stesso euro di gasolio o di officina non
  si conta più due volte senza saperlo. In Conti la schermata Costi mostra
  voce per voce quanto c'è anche in Flotta; in Flotta ogni spesa uguale alla
  cifra porta il contrassegno «anche in Conti». Se l'altra app non risponde
  lo dice per nome, e **non** scrive zero.
- **Terra e Flotta → Scudo**: la schermata Scadenze di Scudo apre con «Tutta
  la cava»: le scadenze della concessione, dei mezzi e delle persone con la
  stessa regola, in un muro solo. È quello che i software del mestiere
  chiamano scadenzario unico.

**La fattura elettronica esce da Conti.** Il bottone «XML per lo SdI» sulla
fattura produce il file per il Sistema di Interscambio. Onestà: Conti lo
prepara; l'invio e la conservazione si fanno gratis dal portale dell'Agenzia
o col commercialista, e il tracciato va passato dal controllo formale del
portale prima del primo invio vero. Se manca un dato (CAP, regime fiscale…)
il file **non** esce e la finestra dice che cosa manca e dove scriverlo.

**Sette passate in profondità, sette app** (Conti, Scudo, Flotta, Campo,
Sentinella, Terra, il core): ogni banco lanciato, ogni schermata guardata,
ogni file che esce aperto. Difetti veri trovati e chiusi: in Conti una pesata
senza tara «vendeva il camion»; in Scudo la copertura formazione diceva
«tutte regolari» sopra una verifica scaduta; in Flotta la tessera del
carburante scriveva «€ 0,00» per un mese senza rifornimenti registrati; in
Terra il foglio per l'ente chiamava «complessiva» un'incertezza stimata su un
rilievo su quattro. Campo, Sentinella e il core: puliti.

**Genesi fuori dal browser**: misurato prima di costruire
(`docs/GENESI_FUORI_DAL_BROWSER.md`): nove chiavi, quattro ponti di file già
vivi, l'offline come vincolo vero; piano in otto unità. Aspetta la tua
decisione 5b (la coda offline).

**Aspetta te**: la PR #345 su GitHub raccoglie tutto questo ed è verde; unire
a main è una tua scelta. I nomi e i temi delle app restano sospesi come hai
chiesto.

---

### La sera del 2 settembre, in sei righe

**Genesi è uscita dal browser.** Fino a stamattina i suoi dati (volate salvate,
confronti A/B, riconciliazioni, legge di sito, lavorazioni del drone) vivevano
solo nella memoria del browser di un computer: nessun'altra app poteva
leggerli, e cambiando computer sparivano. Da stasera Genesi ha la stessa
«porta» delle altre app: da sola sul dispositivo lavora come prima (nessuno
perde niente), con un'organizzazione scrive nelle sue collezioni, e senza rete
torna da sola al browser — misurato staccando la rete. C'è il bottone «Porta
nell'organizzazione» (una volta sola, non cancella niente), e Terra legge già
le lavorazioni del drone da lì: è il **primo ponte di dati verso Genesi**. La
mappa è a **12 ponti su 56**; nessuna app è più senza scambio di dati. Del
piano in otto unità resta solo la coda offline, che è la tua decisione 5b.

**Il triangolo della produzione si legge in un'unità sola.** Sotto «Cavato
contro venduto» Conti mostra ora anche «Prodotto contro venduto» (quello che i
turni di Campo dichiarano, in tonnellate, contro la pesa), e il cavato di Terra
anche in tonnellate con la densità in banco che Terra dichiara sull'atto — con
scritto quando è un valore tipico da verificare. E il **verbale di
riconciliazione**: il divario del periodo si conserva con la causa che gli hai
trovato e una nota; se i dati cambiano dopo, Conti lo dice accanto invece di
sovrascrivere.

**Flotta dice quando un mezzo beve più del suo solito**: gli ultimi trenta
giorni contro la sua storia, con la forbice e «da guardare» sopra una
tolleranza dichiarata come scelta nostra (nessuna norma la fissa).

**Sei ricerche, sei delta dal meccanismo** (Conti, Flotta, Scudo, Sentinella,
Campo, Terra): quasi tutto quello che i concorrenti fanno c'era già, con il
nome del mestiere; le poche mancanze vere sono chiuse (il verbale, il consumo
contro la storia, la densità che era già in casa) o sospese a te — sono le
decisioni **19, 20 e 21** in `docs/DECISIONI_WEEKEND.md`: la volata sparata
come documento emesso, le notifiche fuori dall'app (costano), quattro numeri
di legge che non scrivo senza il testo.

**Tutte e sei le app rimisurate in profondità** dopo le modifiche, nessun
difetto nuovo; un banco «intermittente» rimisurato a macchina ferma tre volte,
verde. Un giro completo del browser è partito a sera sulla copia di quello che
è committato: si legge domattina.

## ⚠️ Aggiornamento del 30 luglio — leggi prima questo

*Il resto del documento è del **23 luglio** e le schede app per app sono ancora
valide: descrivono cose che ci sono e che sono solo cresciute. Quello che è
cambiato in una settimana, però, non c'è — e sono le cose che si vedono per
prime. Questa pagina è la prima che l'indice ti fa aprire: se la leggessi senza
questo blocco, racconteresti il prodotto com'era e la dimostrazione ti
smentirebbe.*

**Quante sono le app.** Il documento dice «6 app + Genesi + Deepwork ID». Il
conto non è cambiato — sono sempre otto strumenti più l'accesso — ma adesso c'è
una **vetrina** (`/apps/`) che li presenta tutti e nove con la schermata vera di
ognuno. È la pagina da aprire per prima davanti a qualcuno.

**⚠️ Il 3 agosto sono stati trovati e chiusi quattro difetti veri**, e uno era
vivo nell'app della **sicurezza**: una scadenza importata da un file con la data
sbagliata di battitura entrava in archivio e restava **verde per sempre** — una
visita medica che non sarebbe mai comparsa fra quelle da fare. Gli altri tre:
Sentinella diceva «**Conforme**» su punti di misura che nessuno aveva ancora
letto (il primo giorno di ogni cliente); Flotta poteva dichiarare «SCADUTA» un
tagliando che **non aveva un obiettivo**; Conti poteva bloccare la pagina.
Non li ha trovati una rilettura: li ha trovati **un programma** che chiama tutte
le funzioni con dati vuoti e cerca **un solo segno** — un numero tranquillo dove
non è stato misurato niente. Quel programma resta e adesso controlla da solo.
Il racconto è in `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`.

**Le cose grosse arrivate dopo il 23:**

- **La vetrina dell'ecosistema.** Apertura con tre schermate vere, i sei ponti
  fra le app, nove schede raggruppate per momento del lavoro, e una riga «da
  dove comincio» che smista per problema. Il bottone «Prova il tour» entra
  davvero nel tour, in un colpo solo.
- **I grafici**, in tutte le app. Un motore condiviso scritto in casa (nessuna
  libreria): andamenti con soglia, barre ordinate, ciambelle, sparkline, e
  sotto ogni grafico la tabella «Dati» per chi vuole i numeri.
- **Le app si parlano davvero: sei ponti**, non più uno slogan. Chi va al
  fronte con un documento scaduto, il cavato contro il venduto, le vibrazioni
  misurate che correggono la volata dopo, il carico reale che torna nel
  progetto, un superamento che diventa un'azione con una data, e i turni che
  riempiono il buco fra un volo di drone e l'altro.
- **L'estetica unificata**: le sei verticali hanno la struttura del core pelo
  per pelo, ognuna con la propria tinta. Niente più finestre grigie del
  browser: solo i riquadri del prodotto.
- **Una convenzione sola** per i numeri scritti a mano, per le unità di misura
  e per i soldi, valida in tutte le app — con i controlli automatici che
  impediscono a un'app di riscriversene una propria.

**Quanto è controllato, oggi** *(ricontato il 18/08 lanciando le suite, non a
memoria)*: **3.079** prove automatiche che girano senza rete — **2598** sulle
funzioni delle app, **328** sulle regole di stile, 75 sugli aiuti condivisi, 32
sulla nuvola di punti, **19** sull'ordine con cui due trigger riscrivono i
claims, 9 sul manifesto, 8 sulla demo, 7 sulle rivendicazioni del
primo avvio, 3 sulle superfici che stampano e su chi le preme — più **129** che
girano con l'emulatore Firestore (**81** sulle
**regole di sicurezza**, 19 sull'SDK, 21 sulle funzioni, 8 sul primo avvio) e
**241 esecuzioni** che aprono davvero le pagine in un browser.
⚠️ *Il primo avvio è tornato da 10 a **8** l'08/08, e non è un passo indietro:
le due prove aggiunte quel giorno chiedevano lo* stato finale *delle
rivendicazioni, che dove le Cloud Functions girano è di* `rebuildClaims` *e non
dello script. Sono diventate le* **7** *senza emulatore qui sopra, che guardano
il soggetto giusto — ciò che* `bootstrapOwner` **scrive** *— e girano ovunque.*
⚠️ *Dei quattro addendi dell'emulatore, l'08/08 ne sono stati **rimisurati
tre** — 75, 19 e 8 — lanciandoli davvero. Il quarto (**21** sulle funzioni)
resta **non verificato**: vuole l'emulatore delle funzioni, che in questo
contenitore non parte perché chiede la rete e la politica la nega. Il numero
era 58 e non 68 perché nessuno l'aveva più lanciato in casa: la suite delle
regole si lancia con* `firebase emulators:exec --only firestore --project
demo-deepwork "cd tests && node run.mjs"`.
*(⚠️ Il **3.079** conta nove suite: il giro completo ne esegue **3.508**, e da
oggi quel numero **lo stampa il giro** — `node apps/deepwork-id/tests/giro-node.mjs`,
riga «Asserzioni eseguite dal giro». Le altre suite contano **file** invece che
casi — crescono da sole quando nasce un file — e fra i comandi ci sono le
**controprove**, che sono asserzioni vere ma su un difetto messo apposta:
per questo il numero da citare resta il primo.
⛔ **Fino al 09/08 questo secondo numero era DERIVATO a mano** («era 2.663
l'08/08 e questa unità ha aggiunto un caso»), e diceva **2.728** dove il vero è
2.757. Un conto che si muove da solo va derivato da un **comando**, non
ricopiato — ed è la stessa ragione per cui la riga qui sopra era rimasta ferma a
2.251 e 2.474 mentre il titolo era già aggiornato: il controllo sorveglia il
**totale**, non la prosa che lo spiega.
⚠️ E il giro lo stampa **col suo denominatore**: 22 comandi su 34 hanno una riga
da sommare, e gli altri **12 sono nominati** — non vuol dire che non abbiano
provato niente, vuol dire che quel conto non li vede.)*
E **814 funzioni pure su 814** delle sei app sono chiamate per nome dalle prove:
tutte al 100%. Vuol dire che non ne resta nessuna che nessuno ha ancora
guardato — non che siano provate *bene*, che è un'altra domanda.

⛔ **Delle sei app**, appunto: **Genesi non ha un modulo dati** e le sue 192
funzioni stanno dentro la pagina, dove `node` non arriva. Il 100% è vero per
quello che guarda, e dal 01/08 il censimento lo dice da sé invece di lasciarlo
intendere.

Le prove sulle funzioni delle app sono passate da **433 a 971 in una giornata**,
e non sono prove di forma: hanno fatto emergere **otto difetti veri** — fra cui
un grafico del core che mostrava la produzione del mese sbagliato, un ruolo di
sicurezza obbligatorio che risultava coperto da una persona non più in azienda,
e una misura del sismografo che spariva dal report per l'ente.

⚠️ **Le suite girano anche con l'orologio del cliente** (`TZ=Europe/Rome`), non
solo con quello del contenitore, che è a Greenwich. La differenza non è teorica:
tre punti del prodotto sbagliavano il giorno **ogni giorno**, e in UTC erano
tutti verdi.

Ognuno ha la sua **controprova**: si rimette il difetto e si pretende che il
controllo fallisca.

⚠️ **E il 01/08 si è scoperto che non basta.** La regola che vieta i dialoghi
del browser aveva la sua controprova, e passava — ma quella controprova
guardava **tre superfici a un punto ciascuna**. Rimettendo il difetto in tutti
i punti difficili, **764 iniezioni su 1030 non venivano viste**: la regola era
cieca su gran parte del codice, core compreso, mentre diceva «a posto». La
lezione è entrata nelle regole di lavoro: *una controprova va misurata anche
nella sua **copertura**, non solo nel suo esito.* Sapere fallire in un punto
non dimostra niente sugli altri mille. Tutte le regole sono state rifatte così,
e adesso ognuna **stampa quante superfici e quanti punti ha davvero toccato**.
*(Le 106 con l'emulatore il 31/07 non hanno potuto girare in questo ambiente:
la rete di lavoro blocca una chiamata che l'emulatore fa all'avvio. Il numero
qui sopra è contato sui file, non su un'esecuzione di oggi — e questa
distinzione va tenuta, perché «contate» e «passate» non sono la stessa cosa.)*

### Il 1º agosto, in quattro righe: i controlli che non guardavano

Una giornata sui **controlli**, non sulle funzioni. Serve saperlo, perché sullo
schermo non si vede niente di nuovo — e proprio per questo va raccontata.

- **Una regola era cieca, e diceva di stare bene.** Quella che vieta le
  finestrelle grigie del browser (`alert`, `conferma`) — vietate perché su
  Android compaiono incollate in cima e il bottone che cancella è
  indistinguibile da quello che annulla. Aveva la sua verifica, e passava. Ma
  la verifica guardava **tre pagine in un punto ciascuna**: rimettendo il
  difetto in tutti i punti difficili, **764 volte su 1030 non veniva visto**.
  Adesso la verifica è a tappeto, e ogni controllo **dice quanti punti ha
  guardato davvero**. Un «nessun problema» ottenuto senza guardare niente è la
  bugia più costosa che ci sia in un programma.
- **«La pagina si apre» non voleva dire «l'app funziona».** Spegnendo il
  programma di ogni app, la verifica passava lo stesso su nove pagine su nove:
  guardava quanta roba c'è in pagina, e la struttura delle app è scritta a
  mano nel file, quindi c'è comunque. Adesso si controlla un segno che
  **solo il programma acceso** può lasciare.
- **Un messaggio ne cancellava un altro.** In tre app l'esito delle
  esportazioni veniva scritto sopra la riga che dice se stai lavorando sui
  **dati veri** o su dati di prova: dopo il primo export quella conferma non
  tornava più. Ora ogni comando ha il suo posto dove parlare.
- **I documenti: l'indice ne citava 26 su 46.** Fuori c'erano tutte e dodici le
  ricerche e i due documenti sull'estetica. Sistemato, e verificato anche il
  contrario — nessun nome citato punta a un file che non esiste.

Una cosa **non** fatta, e volutamente: si è misurato se i messaggi d'errore
delle app dicono «e adesso cosa faccio», su 127 messaggi letti uno per uno. La
risposta è che **vanno già bene**, quindi non è stato riscritto niente.
Riscrivere messaggi che funzionano per far vedere del lavoro fatto è il
contrario di quello che serve.

### Il 31 luglio, in quattro righe: caricare e ri-caricare i dati

Una giornata sola su una cosa sola — **far entrare i dati del cliente e poterli
riportare fuori** — perché è il primo giorno del pilota, ed è lì che un
prodotto fa bella o brutta figura.

- **Il doppione dentro il file.** Se lo stesso lavoratore, prodotto o mezzo
  compare due volte nello **stesso** file, adesso entra **una volta sola**, in
  tutte le app. Prima entrava due volte, e il caso non era teorico:
  l'esportazione di Scudo scrive una riga per ogni scadenza, quindi
  ri-caricare il proprio file faceva comparire **tre volte lo stesso
  lavoratore**.
- **Il file esportato si ri-carica davvero — ma solo sette.** Provati uno per
  uno mandandoli dentro l'app: squadre, gare, listino, magazzino ricambi,
  anagrafica, registro infortuni, ricettori. Tutti gli altri file che le app
  scaricano sono **prospetti** per il commercialista o per l'ente e **non**
  sono una copia di sicurezza: il documento lo diceva, ed era falso per più
  della metà. Ora è corretto, ed è la **decisione 12**.
- **Un bottone di Conti non faceva niente.** Due bottoni avevano lo stesso
  identificativo, e cliccando «Esporta listino» non succedeva nulla. Trovato,
  corretto, e chiuso con un controllo automatico che d'ora in poi lo vede.
- **Il file sbagliato non entra più.** Ri-caricando nel listino il file dei
  *prezzi convertiti* entravano tutti i prodotti a **prezzo zero** con l'IVA
  sbagliata, senza un avviso. Adesso non entra niente e l'app dice quale file
  serve.

**Due cose che aspettano una tua decisione**, nuove rispetto al 23:
`docs/REVISIONE_SICUREZZA_202607.md` (l'isolamento fra aziende tiene ed è
provato; dentro l'azienda, invece, tutti possono tutto) e
`docs/PERCHE_DEEPWORK_E_GENESI.md` (la frase da dire quando ti chiedono perché
esistono tutti e due).

---

## ⚠️ Aggiornamento del 9 agosto — i numeri che dicevano una cosa tranquilla senza aver misurato niente

C'è una regola del prodotto che vale per tutte le app: **quando un dato manca,
l'app deve dirlo, non tirare a indovinare.** Un numero rassicurante dove nessuno
ha misurato niente è peggio di nessun numero, perché nessuno va a
controllarlo.

Oggi quella regola è stata applicata a **Genesi**, e ha trovato tre numeri che
la violavano — tutt'e tre fra quelli con cui si decide se una volata si può
sparare:

- **la carica massima che parte insieme.** Su un progetto senza fori disegnati
  l'app rispondeva la carica di **un solo foro**: il valore più basso possibile,
  quindi la vibrazione prevista più tranquilla. Nei numeri: **3,28 mm/s invece
  di 23,95**, sette volte più bassa. Adesso dice «non calcolabile» e spiega
  perché.
- **la carica totale e il costo.** Con la carica per foro illeggibile il foglio
  scriveva «0 kg» e un costo **più basso del vero** — cioè un margine più alto
  di quello reale. Adesso il costo non calcolabile si dichiara: gli addendi che
  si possono ancora contare restano contati, e manca solo quello che manca.
- **la pezzatura prevista** (quanto vengono grossi i blocchi). Sbagliava in
  **due direzioni opposte sullo stesso schermo**: il consumo specifico scriveva
  «0,00 kg/m³», che rassicura, e la pezzatura passava da 27 a **97 cm**, che
  allarma.

⛔ **E la cosa più importante è arrivata dopo.** Sistemate tutte e tre, si è
scoperto che **bastavano due clic per rimetterle a inventare**: aprendo una
volata con un valore illeggibile e toccando **un campo qualunque** — anche uno
che con la carica non c'entra niente — l'app rimetteva **5 kg per foro** al
posto del «non calcolabile», senza nessun avviso. Una difesa che si spegne così
non è una difesa. Adesso un campo il cui valore non si legge **resta vuoto** e
l'app lo **dice per nome** quando apri la volata.

⚠️ **Quello che resta da fare, detto chiaro**: la stessa cosa vale ancora per la
**geometria** (spalla, spaziatura, profondità) e per altri dodici campi — ci sto
lavorando. E per due valori del **recettore** delle vibrazioni l'invenzione va
nella direzione che *allarma* invece che rassicurare: sono meno pericolosi, ma
restano invenzioni.

E in **Scudo** sono state corrette due tendine che sul telefono si leggevano a
metà: una diceva «— nessun esito registrat…» e l'altra tagliava il nome
dell'ente che fa la verifica. ⚠️ La cosa che vale la pena sapere: la frase era
scritta bene e la funzione che la accorcia funzionava — **a sbagliare era il
righello**, che si dimenticava dei venti pixel della freccina della tendina. E
il controllo automatico che avrebbe dovuto accorgersene **aveva lo stesso identico
errore**: sorvegliante e sorvegliato sbagliavano insieme.

## ⚠️ Aggiornamento del 7 agosto — i colori nei tre modi di guardare lo schermo

Le app hanno **tre modi di mostrarsi**: scuro (di sera, in ufficio), chiaro, e
un modo **«sole»** pensato per il telefono in cava, dove la luce di mezzogiorno
sbianca tutto. Fino a stamattina i colori delle sei app erano stati controllati
**solo nel modo scuro**: sugli altri due nessuno li aveva mai aperti.

Aperti, sono venute fuori **54 scritte troppo pallide per essere lette** —
compresa la parola «Conforme» nell'esito di un report per l'ente, e i numeroni
grandi dei cruscotti. Adesso sono **zero in tutti e tre i modi**, in tutte e sei
le app, e ogni palette è stata decisa sui **suoi** sfondi, non con una formula
uguale per tutti (gli sfondi chiari di ogni app sono velati del suo colore, e
la differenza si vede).

**E c'era un secondo pezzo che nessuno guardava**: le **barrette colorate** a
lato delle righe — quelle che dicono a colpo d'occhio se una cosa è a posto, in
scadenza o scaduta. Non sono testo, quindi nessun controllo le misurava. Sul
chiaro erano **quasi invisibili**: la gialla, che in Campo è *il* segno che una
persona non è stata spuntata all'appello, si leggeva meno della metà di quanto
serve. Anche quelle adesso sono a posto, e i **badge pieni** («SCADUTA»,
«INSOLUTA») non sono cambiati di un pixel: si è aggiunto un colore per le
scritte, non si è tirato quello dei fondi.

**Nel core** è stato tolto un intero foglio di stile per un modo di
visualizzazione che **non si accende dalla versione 4.4** (137 regole, 11 KB): non si
vedeva, ma due volte in un giorno qualcuno ci ha ragionato sopra credendo che
servisse. E la scheda «Sistema» delle Impostazioni scriveva «Outdoor mode:
disattivato» — una riga che poteva stampare **una parola sola per sempre**, su
un pannello che si apre proprio quando si vuole capire come sta l'app: adesso
dice il tema che stai davvero usando.

---

## Il quadro d'insieme
Abbiamo **6 app verticali** (una per problema di cava) + **Genesi** (il
simulatore di volata) + **Deepwork ID** (il login/abbonamenti comune, la
"Fase 0" da cui dipendono tutte). Le 6 verticali sono a un buon punto:
ognuna ha le sue schermate, i suoi calcoli utili e, dove ha senso, l'**import
da CSV** per caricare lo storico senza riscriverlo a mano.

Cosa manca in generale, per passare da "demo" a "vendibile davvero":
1. **Accendere il login live** (progetto Firebase nuovo) — decisione + serve
   il tuo account Google. Vedi `DECISIONI_WEEKEND.md` punto 1.
2. **Messaggio d'errore quando un salvataggio live non riesce** — oggi in
   demo non fallisce mai; in live un problema di rete resterebbe muto. È una
   scelta di stile, poi è meccanica. Vedi `DECISIONI_WEEKEND.md` punto 5.

Nessuna delle due tocca le funzioni: sono il "collaudo per la vendita".

### Novità trasversali (dopo il 21/07) — valgono per tutte e 6 le app
Rifiniture d'uso quotidiano aggiunte in modo uniforme, verificate con screenshot:
- **Ricerca + conteggio in ogni lista**: scrivi e trovi subito (una fattura, un
  mezzo, una scadenza, un ricambio…), con "N · su totale".
- **Modifica dei record al volo** (icona matita ✎): correggi un dato senza cancellare
  e rifare (prima si perdeva lo storico). Cambiare pagina annulla la modifica in corso.
- **Export CSV di ogni lista principale** (per il commercialista/consulente/ente).
- **App installabili sul telefono** (PWA): ogni app si può mettere sulla home come
  un'app vera, a schermo intero, utile in cava con poca connettività.

---

## 1. Scudo — sicurezza e idoneità del personale
**A cosa serve**: tenere sotto controllo visite mediche, formazione e
scadenze dei lavoratori, così non ti trovi un operaio non idoneo sul fronte.

**Cosa fa già**:
- Semaforo delle scadenze (in regola / in scadenza / scaduto) con quanti
  giorni mancano.
- **Idoneità**: etichetta chiara, qual è il prossimo controllo e quanto è
  critico se salta.
- **Copertura formazione**: a colpo d'occhio quanti sono coperti e quanti no.
- **Adempimenti tipici di cava preimpostati** (sorveglianza sanitaria,
  formazioni, patentini, DSS…): li scegli da un elenco invece di scriverli.
- **Promemoria pronto da inviare**: su una scadenza scaduta o in scadenza copi
  con un tasto il testo della convocazione da mandare al lavoratore (email/SMS).
- **Registro infortuni e near-miss** con il numero grande dei **giorni senza
  infortuni** (il "cartellone" della sicurezza): i near-miss non azzerano il
  conto ma si registrano; import/export CSV per l'RSPP.
- **Import scadenzario** e anagrafica da CSV; **export** CSV per il consulente
  o il medico competente.

**Aggiunto dopo il 23 luglio** *(riletto il 30/07 con l'app aperta davanti)*:
- **Le azioni correttive**: un problema smette di essere segnalato e basta —
  ha chi se ne occupa, entro quando, e uno stato che si chiude. È anche il
  **ponte con Sentinella**: un superamento ambientale o il reclamo di un
  residente arrivano qui come non conformità da chiudere.
- **Ispezioni e checklist periodiche**: quello che va guardato ogni tanto,
  con la sua ricorrenza, invece di ricordarselo.
- **Cantieri e siti** e i **documenti aziendali**: i documenti fisici — DVR,
  DSS, nomine — con la loro scadenza, non solo quelli delle persone.
- **La matrice della formazione per mansione** e il **registro dei DPI** per
  lavoratore: chi ha ricevuto cosa e quando va sostituito.
- Il **ponte con Campo**: prima che la squadra vada al fronte si sa **chi ha
  un documento scaduto**. È la cosa che questa app fa e che nessun foglio di
  calcolo fa, perché richiede di sapere anche chi è in turno oggi.

**Pronto**: sì, come vetrina. **Aspetta te**: solo l'accensione live comune.

---

## 2. Campo — rapportini e fermi macchina di cantiere
**A cosa serve**: raccogliere cosa è successo in giornata (produzione, fermi,
scarti) senza carta.

**Cosa fa già**:
- Rapportino di giornata con un **riassunto in una riga** pronto da leggere.
- **Fermi macchina** raggruppati per causale (guasto, attesa, ecc.): vedi
  subito dove perdi tempo.
- **Scarto %** con livello (accettabile/alto) sul materiale.
- **Avanzamento della giornata**: quante attività concluse sul totale.
- **Copertura rapportini di turno**: quante squadre hanno già consegnato il
  rapportino e chi manca ancora, prima del cambio turno.
- **Import piano da CSV** ed **export** consuntivo.

**Aggiunto dopo il 23 luglio** *(riletto il 30/07 con l'app aperta davanti)*:
- **«Cosa tocca a me»**: chi apre l'app dice chi è, e vede solo le attività
  della sua squadra. Prima l'app rispondeva a «cosa sta succedendo», non a
  «cosa devo fare io», che è la domanda vera di chi arriva alle sei.
- **Il turno vero e proprio**: inizio turno con checklist, chi c'è oggi, meteo
  e condizioni del sito, obiettivo del turno con lo scostamento, e la
  **chiusura del turno** — dopo la quale il turno **non si riscrive più**.
- **Squadre e operatori**: chi lavora dove, e l'assegnazione delle attività.
- **Il piano di carico che arriva da Genesi**, e la **carica reale** che torna
  indietro nella riconciliazione: è uno dei sei ponti.
- **La settimana in cava**, giorno per giorno, e **dove si perde tempo**.
- **La foto sull'anomalia**, ridimensionata nel telefono prima di partire.

**Pronto**: sì. **Aspetta te**: solo l'accensione live comune.

---

## 3. Flotta — mezzi, manutenzioni e ricambi
**A cosa serve**: sapere quali mezzi sono disponibili, quando scadono i
tagliandi e se stai finendo i ricambi.

**Cosa fa già**:
- **Disponibilità** della flotta (quanti mezzi operativi ora).
- **Urgenza manutenzioni**: ordina cosa va fatto prima, anche in ore-motore.
- **Previsione**: fra quanti giorni un mezzo arriva alla soglia tagliando.
- **Ricambi sotto scorta** e scarico automatico della giacenza.
- **Ripartizione dei costi** per voce (dove va la spesa: carburante/ricambi/…).
- **Priorità operative del giorno**: un'unica lista "cosa fare oggi" che unisce
  manutenzioni urgenti (a data e a ore motore), **ricambi sotto scorta** e mezzi
  fermi, con i più gravi in cima.
- **Import telemetria da CSV** (ore-motore dai portali OEM) ed **export** della
  situazione del parco per la direzione/officina.

**Aggiunto dopo il 23 luglio** *(riletto il 30/07 con l'app aperta davanti)*:
- **Il giro macchina di inizio turno**: il controllo che l'operatore fa sul
  mezzo prima di partire diventa la **lista di lavoro dell'officina**. È il
  passaggio che trasforma un modulo in un flusso: prima il controllo finiva su
  un foglio che nessuno rileggeva.
- **La scheda del mezzo**: registro ore, storico dei fermi, interventi fatti.
- **I piani ricorrenti di manutenzione** (ogni N ore motore o ogni N mesi) e
  il **semaforo delle scadenze di legge**.
- **Il carburante per mezzo**: rifornimenti, litri per ora di lavoro e costo
  orario — che è il numero con cui ci si accorge di un guasto che sta
  arrivando, prima che il mezzo si fermi.
- **I costi della flotta** per voce, e **quanto tenere a scorta** di ogni
  ricambio.

**Pronto**: sì. **Aspetta te**: l'accensione live comune. Il collegamento
**automatico in tempo reale** con i portali dei mezzi richiede un pezzo di
server (non si può fare solo nel browser) — de-rischiato, scritto nel vault,
si fa quando decidi di investirci.

---

## 4. Conti — fatture, incassi e gare
**A cosa serve**: sapere chi ti deve pagare, quando, e come stanno le gare.

**Cosa fa già**:
- **Scadenzario incassi** per fasce (a scadere / scaduto da 30-60-90 gg).
- **Priorità di incasso** e **solleciti a livelli** (dal promemoria gentile
  al sollecito formale) sulle fatture non pagate.
- **Incasso atteso** nel periodo e **previsione incassi mese per mese**.
- **Esposizione per cliente** (chi ci deve di più → chi chiamare per primo).
- **Interessi di mora di legge** stimati sulle insolute (un numero vero per il
  sollecito) e **riepilogo gare**.
- **Sollecito pronto da inviare**: su una fattura scaduta copi con un tasto il
  testo del sollecito (con mora e totale dovuto) da mandare al cliente.
- **Estratto conto cliente**: per un cliente con più fatture aperte, copi un
  unico documento con tutte le fatture, la mora e il totale dovuto.
- **Import fatture da CSV** ed **export** della situazione.

**Aggiunto dopo il 23 luglio** *(riletto il 30/07 con l'app aperta davanti)*:
- **Il registro delle pesate / DDT** e la **fattura differita**: i documenti di
  trasporto diventano una fattura senza ricopiare una riga. È il pezzo che
  cambia la giornata di chi fattura, e non c'era.
- **Il listino prodotti** con la densità, e le **consegne da fatturare** —
  l'elenco di quello che è uscito dal cancello e non è ancora stato fatturato.
- **Canoni e diritti di escavazione**: quello che si paga al Comune o alla
  Regione, che cambia da posto a posto e va tenuto per anno.
- **I dati della tua azienda**, cioè l'intestazione dei documenti che escono.
- **Il ponte con Terra — «cavato contro venduto»**: i metri cubi misurati dal
  rilievo messi accanto alle tonnellate uscite dal cancello. Se c'è un divario
  che non si spiega con lo sfrido, l'app lo dice invece di lasciarlo scoprire a
  fine anno. C'è anche il **valore del cavato ai prezzi del listino**.
- **I grafici che rispondono alle domande vere**: emesso contro incassato,
  tempi reali di pagamento per cliente, crediti aperti per fascia di ritardo,
  previsione incassi, venduto per prodotto.

**Pronto**: sì. **Aspetta te**: l'accensione live comune. La **fattura
elettronica** vera (invio allo SdI dell'Agenzia delle Entrate) **non si può
fare solo nel browser**: serve un intermediario o la PEC. Studiato e scritto
nel vault; è una scelta tua se e quando aggiungerlo.

---

## 5. Sentinella — vibrazioni e conformità delle volate
**A cosa serve**: dimostrare che le tue volate rispettano i limiti di legge
su vibrazioni e rumore, così eviti contestazioni dei vicini/enti.

**Cosa fa già**:
- Stato di ogni misura rispetto alla soglia.
- **Preset di soglia** normativi già pronti da scegliere (invece di
  inventarli): parti dal riferimento giusto.
- **Distanza scalata** e **carica massima per ritardo** (in progettazione
  volata: quanti kg non superare per restare sotto la soglia di vibrazione).
- **Riepilogo conformità**: quante misure dentro/fuori limite.
- **Registro delle volate** (brogliaccio di brillamento): il log di ogni volata
  (data, fronte, fori, kg, distanza), con la distanza scalata calcolata per
  ognuna e le eventuali contestazioni; import/export CSV per gli enti.
- **Import sensori** da CSV ed **export** di monitoraggi e adempimenti.

**Aggiunto dopo il 23 luglio** *(riletto il 30/07 con l'app aperta davanti)*:
- **I ricettori — case, scuole, confini**: il monitoraggio smette di essere
  «una misura» e diventa «una misura *in un punto che ha un nome*», che è
  quello che chiede chi legge il report.
- **Il programma di monitoraggio** e l'**andamento per ricettore**: cosa va
  misurato, dove e quando, invece di ricordarselo.
- **Il punto messo peggio**, in cima: si apre l'app e si sa dove guardare.
- **Le allerte con «cosa abbiamo fatto»** — è il **ponte con Scudo**: un
  superamento di soglia o il reclamo di un residente smettono di essere un
  numero rosso e diventano una non conformità con chi se ne occupa ed entro
  quando. Un grafico rosso non chiude niente.
- **Reclami ed esposti** registrati, e il **report di conformità** che esce
  già scritto per l'ente.
- **I referti per la legge di sito**: è il **ponte con Genesi**, le vibrazioni
  misurate che correggono la previsione della volata dopo.
- **Importa le letture dello strumento** direttamente dal file del sismografo.

**Pronto**: sì, ed è una delle app con più "personalità" (pochi competitor la
raccontano in modo semplice). **Aspetta te**: l'accensione live comune. Le
**soglie di legge esatte** per zona sono un riferimento nel vault: vanno
confermate col tuo tecnico prima di venderle come "a norma".

---

## 6. Terra — volumi, rilievi drone e riserve
**A cosa serve**: sapere quanto materiale hai estratto (dai rilievi drone) e
quanto te ne resta in autorizzazione.

**Cosa fa già** *(riletto il 30/07 con l'app aperta davanti, non a memoria:
metà di questo elenco è arrivata dopo il 23 e mancava)*:
- Volumi del mese e avanzamento sul piano annuo, **calcolati** dai rilievi
  (mai scritti a mano: sono difendibili in un controllo).
- **Da m³ a valore**: metri cubi → tonnellate → euro (leghi il rilievo alla
  contabilità).
- **Qualità e classe di accuratezza** del rilievo (metodo RTK/GCP, GSD) con la
  **banda di incertezza** sul volume ("19.400 m³ ± 388"), così il numero è
  difendibile in un controllo o in riconciliazione col venduto.
- **Riserva residua** e fra quanti anni si esaurisce; **andamento volumi**
  (ultimo rilievo vs precedente).
- **Proiezione di fine anno**: al ritmo attuale, quanti m³ arriverai a estrarre
  entro dicembre, con avviso se rischi di **superare il volume autorizzato**.
- **Import rilievi da CSV** ed **export** di fronti e rilievi.

**Aggiunto dopo il 23 luglio** (le schermate ci sono: si controlla aprendo l'app):
- **I fronti di cava**: stato di ognuno, e *«da dove esce il materiale»*.
  Prima il volume era un numero solo per tutta la cava.
- **Il riepilogo annuale dei volumi**, che è quello che l'ente chiede: mese per
  mese, da quale fronte, rispetto al volume concesso, anno per anno, gli
  **oneri di escavazione** e la voce *«come lo consegni»*.
- **Confronto fra due rilievi**: quanto è cambiato fra un volo e l'altro.
- **Lo scadenzario di Terra**, col semaforo e le ricorrenze: le scadenze
  dell'autorizzazione smettono di vivere su un calendario a parte.
- **Il ponte con Campo**: *«quello che dichiarano i turni»*, *«da quale fronte,
  secondo i turni»* e *«il confronto col rilievo»*. Il drone vola ogni tanto;
  nel frattempo i turni danno la stima del momento, **tenuta separata dalla
  misura vera** — che è la parte importante: una stima messa accanto a una
  misura, in una settimana, diventa indistinguibile da essa.
- **Il piano estrattivo** e le **impostazioni del controllo**.

**Pronto**: sì. **Aspetta te**: solo l'accensione live comune.

---

## Genesi — il simulatore di volata (a parte)
**A cosa serve**: provare la volata sullo schermo invece che sulla roccia, e
uscirne col piano di carico per il fochino.

*Questa scheda era rimasta una riga («il gioiello tecnico…») che non diceva
cosa fa. Riscritta il 30/07 con l'app aperta davanti: è l'app che fa più
impressione a chi guarda, e aveva la scheda più povera.*

**Cosa fa già**:
- **Progetto 2D**: si disegna la maglia dei fori e la **sequenza di sparo** in
  pianta, coi ritardi decisi foro per foro e le linee di innesco.
- **Simulazione 3D**: la volata sul fronte, fase per fase, col fronte
  modificabile dentro la scena (maniglie su cresta e piede, quote, annulla) e
  le **colonne di carica segmentate a colori** dentro ogni foro.
- Sette gruppi di parametri, che sono le sette domande di una volata:
  **geometria**, **carica e sequenza**, **roccia e geologia**, **fori
  bagnati**, **presplit** (il taglio del profilo), **vibrazioni e recettore**,
  **costi e resa**.
- **La banda d'incertezza** che nasce dalla precisione di perforazione: un
  risultato dichiarato senza il suo margine è un risultato che promette troppo.
- **La mappa dell'energia** foro per foro: dove ce n'è troppa e dove troppo poca.
- **Le tue volate** salvate, e il **caricamento della nuvola del drone** per
  lavorare sul fronte vero invece che su un fronte inventato.
- **Riconciliazione previsto contro reale**: il consuntivo di carico che torna
  da Campo si mette accanto al previsto. È uno dei sei ponti, e con quello delle
  vibrazioni da Sentinella è il motivo per cui il modello migliora invece di
  restare quello del manuale.

**Pronto**: da mostrare, sì — è la schermata che fa capire in dieci secondi che
non è un foglio di calcolo. **Aspetta te**: il **motore fisico non si tocca
senza una tua indicazione** — è una regola tua. Per la prossima mossa serve che
tu dica *quale* rifinitura vuoi per prima: vedi `DECISIONI_WEEKEND.md` punto 6
e `apps/genesi/PIANO_3D.md`. Nel vault c'è già la ricerca (formula Swebrec)
pronta per quando deciderai di procedere, e in
`docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` sta scritto **onestamente cosa quella
strada non può dare**: serve a non promettere in vendita quello che non c'è.

---

## Deepwork ID — l'accesso comune (la "Fase 0")
**A cosa serve**: una password sola per tutte le app, e i dati di ogni azienda
chiusi in casa propria.

**Cosa fa già**: registrazione e accesso, il **tour senza registrarsi** (che è
come si fa vedere il prodotto senza configurare niente), l'organizzazione coi
suoi membri e i suoi inviti, i ruoli, e la griglia degli abbonamenti per app.

**Quello che va detto con precisione**, perché è la domanda numero uno di un
cliente: **l'isolamento fra aziende concorrenti tiene, ed è provato** — 58 test
automatici che provano a leggere, scrivere, cancellare ed elencare i dati del
concorrente, e falliscono tutti come devono. Dentro la stessa azienda, invece,
**oggi tutti possono tutto**: chi è stato invitato per compilare i rapportini
può anche cancellare una fattura. Non è un difetto nascosto, è un lavoro non
ancora fatto — e la scelta di dove passa la riga è tua:
`docs/REVISIONE_SICUREZZA_202607.md`.

**Aspetta te**: l'accensione del progetto Firebase (gratis, dieci minuti) —
è il collo di bottiglia di tutto il resto.

---

## In una frase
Le 6 app verticali **funzionano e si possono mostrare oggi**. Il passo che
sblocca la vendita vera non è dentro le app: è **accendere il login live**
(progetto Firebase) e decidere **come avvisare l'utente se un salvataggio non
riesce**. Tutto il resto (fattura elettronica, telemetria in tempo reale,
soglie di legge esatte, motore di Genesi) è **studiato e in attesa di una tua
scelta**, non di lavoro tecnico bloccato.
