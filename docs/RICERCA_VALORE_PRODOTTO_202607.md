# Ricerca sul VALORE DI PRODOTTO — luglio 2026

_Per Giuseppe · documento di sola ricerca: **nessuna riga di codice è stata
toccata**._

---

## Come leggere questo documento

La prima ondata di ricerca (i file `docs/RICERCA_CAMPO_202607.md`,
`RICERCA_SCUDO_202607.md`, `RICERCA_FLOTTA_202607.md`, `RICERCA_CONTI_202607.md`,
`RICERCA_SENTINELLA_202607.md`, `RICERCA_TERRA_202607.md`,
`RICERCA_GENESI_202607.md`, `RICERCA_DEEPWORKID_202607.md`) rispondeva a una
domanda precisa: **"cosa ci manca rispetto ai concorrenti e agli obblighi di
legge?"**. Quel lavoro è fatto e qui non viene ripetuto.

Questo documento risponde a una domanda **diversa**, e per la vendita è la più
importante:

> **Quali funzioni fanno dire a un titolare di cava "questo software mi serve,
> non posso più farne a meno"?**

Non è la stessa cosa. Un adempimento di legge fa comprare il software **una
volta**. Il valore percepito lo fa **tenere** — e lo fa raccontare agli altri.
Molte delle funzioni più preziose che troverai qui **non sono obbligatorie per
nessuna legge**: sono quelle che fanno risparmiare mezz'ora al giorno, o che
producono il foglio da consegnare a qualcuno.

**Metodo.** Ho letto i documenti della prima ondata, poi ho letto il codice
dell'ecosistema per capire cosa c'è davvero (in particolare
`shared/deepwork-id-client/index.js` e `apps/deepwork-id/firestore.rules`, che
sono decisivi per il capitolo sull'ecosistema collegato), poi ho fatto **19
ricerche sul web** in italiano e in inglese su adozione dei software aziendali,
tempo di primo valore, avvisi e "alert fatigue", quadri di sintesi per la
direzione, e cura dell'interfaccia. Alla fine ho tenuto solo ciò che si può
costruire **nel browser, senza spendere un euro**.

**Le tre regole di onestà che ho seguito.**
1. Se una funzione richiede **dati che il cliente non ha**, lo scrivo.
2. Se una funzione richiede **una spesa** (invii email/SMS automatici, server
   sempre acceso, archiviazione file), lo scrivo e la proposta si ferma lì.
3. Se una cosa **c'è già** in qualche app, lo dico invece di rivenderla come
   nuova.

---

## 1. Il punto di partenza: perché un gestionale viene abbandonato

Vale la pena capire prima *contro cosa* stiamo lavorando. La ricerca sul web è
molto concorde, e i numeri fanno impressione.

**Il tempo per vedere il primo valore è tutto.** Fino al **75% degli utenti
abbandona un prodotto nella prima settimana** se non vede subito a cosa serve.
Il tasso medio di "attivazione" (cioè di persone che arrivano davvero a provare
la funzione centrale del prodotto) è intorno al **37%**: su dieci che si
registrano, meno di quattro capiscono cosa fa il software. E chi va forte nella
prima settimana va forte anche a tre mesi: **il 69% dei prodotti leader
nell'attivazione a 7 giorni è leader anche nella retention a 3 mesi**. Tradotto
in cava: se il titolare non ottiene qualcosa di utile **nel primo pomeriggio**,
non lo riaprirà più.

**In Italia il problema è ancora più concreto.** Le ricerche italiane sui
gestionali per PMI dicono due cose:
- i gestionali tradizionali hanno **interfacce complesse che richiedono
  formazione continua** e rallentano il lavoro degli operatori — è il motivo
  principale per cui le PMI li stanno lasciando;
- la formazione non si fa: **il 40% delle PMI dichiara di non avere tempo**, il
  32% non ha nessuno che se ne occupi, il 23% non la considera una priorità.
- secondo McKinsey, **7 progetti di trasformazione digitale su 10 falliscono**
  o vengono abbandonati.

**Conclusione operativa per noi.** Il nostro prodotto non può presumere né
formazione, né un consulente che lo configuri, né un capocantiere paziente. Deve
essere **utile al primo utilizzo, senza spiegazioni**. Ogni funzione che
proporrò qui sotto è pesata anche su questo.

**Cosa invece rende un software indispensabile** (dalla ricerca su switching
cost e abitudini):
1. **Diventa il registro ufficiale** (il "system of record"): se lo storico
   della cava sta lì dentro, uscire costa. Non per cattiveria: perché il
   titolare *ha bisogno* di quello storico.
2. **Diventa un'abitudine quotidiana**: si apre ogni mattina perché dice cosa
   fare oggi.
3. **Produce qualcosa che serve fuori**: un foglio, un PDF, un documento che
   qualcun altro (ente, cliente, consulente, assicurazione) si aspetta.
4. **Fa risparmiare tempo in modo visibile**: la persona *sente* di aver fatto
   in due minuti quello che prima le prendeva venti.

Le quattro leve qui sopra sono l'ossatura di tutte le proposte che seguono.

---

## 2. Le funzioni ad alto valore, in ordine di rapporto valore/lavoro

**Come leggere la tabella.** "Valore" = quanto il cliente lo percepisce come
motivo per pagare. "Lavoro" = quanto costa costruirlo (S = piccolo, giorni;
M = medio, una o due settimane; L = grande). Le prime della lista sono quelle
con il **rapporto migliore**: tanto valore, poco lavoro.

| # | Funzione | App | Valore | Lavoro | Rapporto |
|---|---|---|---|---|---|
| 1 | Duplica, modelli e precompilazione intelligente | tutte | ●●●●● | **S** | 🥇 |
| 2 | Centro avvisi unico ("cosa richiede la tua attenzione") | tutte + hub | ●●●●● | **M** | 🥇 |
| 3 | Motore di stampa condiviso con intestazione dell'azienda | shared → tutte | ●●●●● | **M** | 🥇 |
| 4 | Anagrafiche condivise tra app (il dato inserito una volta) | SDK + tutte | ●●●●● | **M** | 🥈 |
| 5 | Ricerca che perdona i refusi | tutte | ●●●○○ | **S** | 🥈 |
| 6 | Scadenzario unico dell'anno + esporta in calendario (.ics) | hub + Scudo/Sentinella/Terra/Conti | ●●●●○ | **S/M** | 🥈 |
| 7 | Quadro del titolare (dieci secondi per capire come va) | hub | ●●●●● | **M** | 🥈 |
| 8 | Modalità cantiere: funziona senza campo, pollice e pulsanti grossi | Campo, Scudo, Flotta | ●●●●○ | **M** | 🥉 |
| 9 | Firma sul telefono + verbale di consegna | Scudo (poi Campo, Flotta) | ●●●●○ | **S/M** | 🥉 |
| 10 | Avvio in dieci minuti (setup guidato + dati di esempio) | Deepwork ID + tutte | ●●●●● | **M** | 🥉 |
| 11 | Registro "chi ha fatto cosa e quando" | tutte | ●●●●○ | **M** | 🥉 |
| 12 | Costo per tonnellata (il numero che nessun concorrente singolo può dare) | Conti ← Terra+Flotta+Genesi | ●●●●● | **M/L** | 🥉 |
| 13 | Riepilogo periodico pronto da consegnare | tutte | ●●●○○ | **S** | — |
| 14 | "Cosa è cambiato da quando non c'eri" | tutte | ●●●○○ | **M** | — |
| 15 | Esporta tutto / archivio di sicurezza | tutte | ●●●○○ | **S** | — |

Sotto, la scheda di ognuna.

---

### 1 · Duplica, modelli e precompilazione intelligente
**App: tutte · Lavoro: S · Valore: altissimo**

**Cosa fa.** Tre cose imparentate, che si costruiscono insieme:
- **"Duplica"** su ogni riga di elenco. Il rapportino di ieri, la manutenzione
  dell'anno scorso, la fattura del mese scorso, il rilievo precedente: un tocco
  e si riapre già compilato, si cambiano due campi e si salva.
- **"Modelli"** (schemi riutilizzabili) creati dall'utente: "Rapportino turno
  mattina — squadra frantoio", "Manutenzione 500 h escavatore",
  "Controllo settimanale fronte". Si salvano e si richiamano.
- **Precompilazione**: la data è già oggi; la squadra, il fronte, il mezzo, il
  cliente proposti sono quelli **usati l'ultima volta**; l'unità di misura è
  quella del punto di misura scelto; il numero di fattura è il successivo
  dell'ultimo.

**Perché il cliente lo percepisce come valore.** È il risparmio di tempo più
**visibile** che esista: la persona vede con i suoi occhi che quello che prima
erano dodici campi da riempire adesso sono due. La ricerca sulle interfacce
gestionali dice esattamente questo: gli utenti professionali danno più
importanza alla **velocità di completamento del compito** che all'aspetto, e i
valori proposti in automatico in base agli inserimenti precedenti riducono la
fatica mentale. Ogni campo, ogni clic deve "guadagnarsi il posto".

**Perché costa poco.** I dati per farlo **ci sono già tutti**: ogni app ha già
gli elenchi e le funzioni di creazione. "Duplica" è, in pratica, aprire il modulo
di creazione con i valori dell'oggetto scelto. La memoria dell'ultima scelta si
salva nel browser (`localStorage`), che le app già usano per ricordare
l'ordinamento.

**Attenzione onesta.** La duplicazione va **bloccata** dove creerebbe un doppione
pericoloso: un numero di fattura, un nome di mezzo, una lettura di monitoraggio.
Le app hanno già i controlli anti-doppione, vanno solo riutilizzati.

---

### 2 · Centro avvisi unico — "cosa richiede la tua attenzione"
**App: tutte + hub · Lavoro: M · Valore: altissimo**

**Cosa fa.** Una **campanella** in alto in ogni app e nell'hub, con il numero
delle cose che chiedono una decisione. Cliccandola si apre un elenco corto,
ordinato dalla più grave, dove ogni riga:
- dice **cosa** succede e **da quando** ("Visita medica di M. Rossi scaduta da 12
  giorni"),
- porta con un tocco **al punto giusto** dell'app giusta,
- ha tre azioni: **"Fatto"**, **"Ricordamelo tra 7 giorni"**, **"Non avvisarmi
  più su questo"**.

E soprattutto: **un digest, non uno stillicidio**. Una sola voce riassuntiva per
tipo ("3 tagliandi in scadenza"), non tre righe separate.

**Perché il cliente lo percepisce come valore.** È la funzione che trasforma il
software in **abitudine**: c'è un motivo per aprirlo ogni mattina. È anche quello
che il titolare compra davvero quando compra "gestione scadenze": non l'elenco,
ma la certezza di **non dimenticare**.

**Come non diventare fastidiosi** (è la parte più delicata, e la ricerca è
chiarissima). Le regole che consiglio di scrivere nero su bianco e non violare
mai:
- **Il silenzio è il valore predefinito.** Chi propone un nuovo tipo di avviso
  deve dimostrare che serve, non il contrario. Un avviso è legittimo solo se
  (a) l'utente ha chiesto di essere avvisato, oppure (b) non accorgersene ha un
  costo vero.
- **Digest invece di raffica.** I dati citati nella ricerca parlano di **+35% di
  interazione e −28% di disattivazioni** quando gli avvisi vengono raggruppati
  in un riepilogo invece che mandati uno per uno.
- **Il pallino rosso si guadagna.** Il contatore di non letti è una tassa
  permanente sull'attenzione: mettilo solo su cose che l'utente vuole davvero
  chiudere. Scadenze sì; "hai un nuovo rapportino" no.
- **Solo cose azionabili.** Se non c'è nulla da fare, non è un avviso: è una
  statistica, e va nel quadro.
- **L'utente comanda.** Deve poter dire "meno avvisi di questo tipo" senza
  cercare in trenta impostazioni.
- Chi disattiva gli avvisi tende poi ad abbandonare del tutto il prodotto (un
  dato citato spesso: **52%**). Quindi l'obiettivo non è "avvisare di più", è
  "non farsi mai spegnere".

**Perché costa poco (per quel che dà).** Il lavoro difficile — decidere **cosa è
urgente** — è **già fatto in quattro app su sei**: Flotta ha "Priorità operative
del giorno", Sentinella ha `prioritaConformita`, Scudo ha lo stato calcolato
delle scadenze, Conti ha la "priorità di incasso" e l'aging. Serve un formato
comune ("una cosa che chiede attenzione" = titolo, gravità, data, link) e una
schermata condivisa che lo mostri. Il vero lavoro nuovo sono i pulsanti
"rimanda" e "non avvisarmi più", che vanno salvati.

**⚠️ Il limite da dire subito e sempre.** Questi avvisi **vivono dentro l'app**:
si vedono quando la si apre. **Non partono email né SMS automatici**, perché
mandarli richiederebbe un server sempre acceso (Cloud Functions su piano a
consumo) e un servizio di invio a pagamento — e la decisione del fondatore è
"nessuna spesa prima della commercializzazione". Le notifiche push del telefono
sono nella stessa situazione: la parte gratuita del browser c'è, ma per
*spedirle* servirebbe qualcosa che gira sul server.
La compensazione onesta e gratuita è al punto 6 (**esportare le scadenze in un
file di calendario**): così il promemoria arriva sul telefono del titolare
attraverso il **suo** calendario, che quelle notifiche le sa già mandare.

---

### 3 · Motore di stampa condiviso con l'intestazione dell'azienda
**App: `shared/` → tutte · Lavoro: M (poi S per ogni documento) · Valore: altissimo**

**Cosa fa.** Un pezzo di codice comune, in `shared/`, che prende un contenuto e
lo trasforma in una **pagina già impaginata da stampare o salvare in PDF**, con:
- **logo, ragione sociale, partita IVA, sede** dell'azienda cliente (inseriti una
  volta nel profilo dell'organizzazione);
- **titolo del documento, data, periodo di riferimento**;
- un **numero progressivo** ("Rapporto n. 2026/0147") — è quello che fa sembrare
  un documento un documento e non una stampata;
- una riga di **firma** ("Il Direttore dei lavori ______________");
- un piè di pagina onesto: *"Documento generato da Deepwork il 27/07/2026 alle
  10:32 — i dati inseriti sono responsabilità dell'azienda"*.

**Perché il cliente lo percepisce come valore.** È **la funzione per cui si paga
volentieri**. Nessuno paga per "inserire dati": si paga per **avere il foglio
pronto quando serve**. E in una cava italiana, di fogli da consegnare a
qualcuno, nell'anno, ce ne sono parecchi.

**Cosa consegna davvero, durante l'anno, una cava italiana.**

| A chi | Documento | Da quale app esce | Nota |
|---|---|---|---|
| Committente / cliente | **Documentazione di idoneità tecnico-professionale** (allegato XVII D.Lgs. 81/08): visura camerale, DVR, POS, DURC, attestati, nomine, idoneità sanitarie | **Scudo** (ha già documenti, cantieri, lavoratori, idoneità) | Il DURC lo scarica l'azienda dall'INAIL, non lo generiamo noi: Scudo lo **archivia e ne segue la scadenza** |
| Committente / cliente | **POS** (piano operativo di sicurezza) per il cantiere esterno | Scudo | Noi non scriviamo il POS: teniamo il fascicolo e la scadenza |
| Ente / Regione | **Denuncia annuale dei volumi estratti** e contributo di cava | **Terra** | ⚠️ Le cave sono materia **regionale**: modulo e scadenza cambiano da regione a regione (vedi `RICERCA_TERRA_202607.md`) |
| Camera di commercio | **MUD** — dichiarazione ambientale annuale sui rifiuti; scadenza tipica a metà anno, sanzioni da 2.000 a 10.000 € | Sentinella (registri) | Noi **non** compiliamo il MUD: prepariamo il riepilogo da cui si compila |
| ARPA / Provincia | **Relazione annuale di monitoraggio** (rumore, polveri, acque, vibrazioni) prevista dal piano di monitoraggio dell'autorizzazione | **Sentinella** | Ha già l'export CSV: qui diventa un documento leggibile |
| Vicini / legale | **Rapporto sulla volata** con misure di vibrazione e confronto con la soglia | Sentinella + Genesi | Il documento che serve quando arriva una lamentela |
| Assicurazione | **Rapporto dell'infortunio o del quasi-infortunio** con azioni correttive | Scudo | Vale anche come traccia interna |
| Consulente / commercialista | **Situazione fatture e scadenzario** | Conti | ✅ **c'è già** in CSV: qui diventa anche stampabile |
| RSPP / medico competente | **Elenco lavoratori con scadenze formative e sanitarie** | Scudo | ✅ c'è già l'export: manca il documento intestato |
| Banca / titolare | **Riserva residua e proiezione di fine anno** | Terra | Un foglio che vale in una trattativa |
| Manutentore / venditore usato | **Libretto del mezzo**: ore, storico interventi, costi | Flotta | Aumenta il valore di rivendita del mezzo |

**Perché è fattibile senza spendere.** Si fa **interamente nel browser**, con
CSS `@media print` e la funzione "Stampa → Salva come PDF" che ogni browser ha
già. Nessuna libreria a pagamento, nessun server. Genesi ha già un report
stampabile e Campo ha già il rapporto di fine turno stampabile: **il modello
funziona, va solo reso comune e ripulito.**

**Limite tecnico da conoscere.** Il PDF prodotto dal browser può impaginarsi in
modo leggermente diverso fra Chrome, Safari e Firefox, e il controllo fine sulle
interruzioni di pagina e sulle intestazioni ripetute è limitato. Per documenti
di una o due pagine è perfetto; per un fascicolo di trenta pagine bisogna
progettare con cura le interruzioni.

---

### 4 · Anagrafiche condivise tra app — "il dato lo inserisci una volta"
**App: SDK condiviso + tutte · Lavoro: M · Valore: altissimo (è il nostro fossato)**

Questa funzione ha una sezione dedicata più avanti (capitolo 4), perché è il
**vantaggio competitivo strutturale** dell'ecosistema. Qui basti la scheda.

**Cosa fa.** Persone, mezzi, fronti/siti e clienti smettono di essere quattro
elenchi separati e diventano **quattro elenchi comuni**, scritti da un'app
"padrona" e **letti** da tutte le altre.

**Perché il cliente lo percepisce come valore.** Perché la cosa che più fa
odiare un software è **riscrivere le stesse cose**. Un titolare che inserisce i
14 lavoratori in Scudo e poi li ritrova già pronti in Campo quando compone le
squadre capisce **in quel momento** perché ha comprato una suite invece di
quattro programmi. La ricerca sulle suite integrate lo dice senza giri di
parole: il valore è che **il dato è memorizzato una volta sola** e i processi si
collegano da soli.

**Buona notizia tecnica** (verificata leggendo il codice): le regole di sicurezza
Firestore **permettono già** a un membro dell'organizzazione di leggere e
scrivere qualunque `organizations/{orgId}/apps/{appId}/…`. L'unica cosa che oggi
lo impedisce è l'SDK: `orgCollection(nome)` è sigillato sull'app corrente. Serve
quindi **un'aggiunta piccola all'SDK**, non un cambio di architettura, e
**nessuna modifica alle regole**. Dettagli e schema nel capitolo 4.

---

### 5 · Ricerca che perdona i refusi
**App: tutte · Lavoro: S · Valore: medio-alto**

**Cosa fa.** Oggi le ricerche delle app confrontano il testo così com'è. Chi
cerca "perforatrice" e ha scritto "perfortrice", o cerca "Cimmino" quando in
archivio c'è "CIMINO", non trova nulla e conclude che **il software ha perso il
dato**. È uno dei modi più rapidi per perdere fiducia.

Serve una ricerca che:
- ignori **maiuscole e accenti** ("Perù" = "peru");
- ignori **spazi e punteggiatura** ("CAT 320-D" trova "cat320d");
- accetti **una lettera sbagliata, mancante, in più o invertita** (distanza di
  modifica 1, e 2 solo per parole lunghe);
- cerchi **in tutti i campi utili** (nome, area, ruolo, note), non solo nel primo;
- funzioni **a pezzi**: "ros vis" trova "Rossi — visita medica".

**Perché il cliente lo percepisce come valore.** Perché "il software mi trova le
cose" è una sensazione, non una funzione. E perché la ricerca è ciò che le
persone usano *invece* dei filtri, quando hanno fretta.

**Perché costa poco.** Si scrive in una cinquantina di righe di JavaScript in
`shared/` (normalizzazione + distanza di Levenshtein limitata) e si aggancia alle
ricerche che **già esistono** in tutte le app. Non serve nessuna libreria
esterna: gli elenchi di una cava sono da decine o centinaia di righe, non da
milioni, quindi il calcolo è istantaneo anche su un telefono vecchio.

---

### 6 · Scadenzario unico dell'anno + esportazione nel calendario
**App: hub + Scudo/Sentinella/Terra/Conti · Lavoro: S/M · Valore: alto**

**Cosa fa.** Due pezzi:
1. **Un calendario dell'anno** che raccoglie in un'unica vista tutte le scadenze
   che oggi vivono separate: visite mediche e corsi (Scudo), adempimenti
   ambientali e relazioni (Sentinella), rinnovi di autorizzazione e denunce
   (Terra), scadenze fatture e gare (Conti), tagliandi e verifiche (Flotta).
   Vista **mese** e vista **anno**, con i colori della gravità.
2. **Un pulsante "porta nel mio calendario"** che scarica un file `.ics` — il
   formato standard che Google Calendar, Outlook e il calendario dell'iPhone
   sanno importare.

**Perché il cliente lo percepisce come valore.** Il calendario dell'anno è il
foglio che oggi molte cave tengono appeso al muro o in un Excel. Vederlo
generato da solo, aggiornato, e **stampabile** (punto 3) è un colpo d'effetto
immediato. E il file `.ics` risolve gratis metà del problema delle notifiche:
**il promemoria arriva sul telefono attraverso il calendario del titolare**,
che quelle notifiche le manda già.

**Perché costa poco.** Il formato `.ics` è **testo puro**: si costruisce con
qualche riga di JavaScript e si scarica come un CSV, esattamente come le app già
fanno per gli export. Nessun servizio, nessun costo, nessun permesso.

**Attenzione onesta.** L'`.ics` è una **fotografia**: se poi la scadenza cambia
nell'app, la voce nel calendario del titolare **non si aggiorna da sola** (per
farlo servirebbe un indirizzo web sempre raggiungibile che il calendario
interroga — cioè un server). Va scritto nell'app: *"Questo file è una copia:
se cambi la scadenza, riscaricalo."*

---

### 7 · Il quadro del titolare — capire in dieci secondi come va
**App: hub (`apps/index.html`) · Lavoro: M · Valore: altissimo**

**Cosa fa.** Oggi l'hub è un elenco di app. Deve diventare **la schermata che il
titolare apre al mattino**, costruita secondo la regola che la ricerca ripete
ovunque: *"la prima schermata deve rispondere a una sola domanda: siamo in
carreggiata?"*.

Struttura consigliata, in ordine dall'alto (è la struttura di un giornale: il
titolo grosso in cima, i dettagli sotto):

**Riga 1 — da 4 a 6 numeri, non di più.** Le ricerche sono unanimi: gli
executive leggono la prima riga e passano oltre; troppi numeri e la schermata
non si legge più. Ogni numero ha (a) un **valore**, (b) un **confronto** (vs
mese scorso / vs piano), (c) un **semaforo**, (d) è **cliccabile** e porta
all'app giusta. Proposta:
- **volume estratto nel mese** e proiezione a fine anno vs volume autorizzato
  (da Terra — la funzione `proiezioneAnnua` esiste già ed è ottima);
- **disponibilità della flotta** in % (da Flotta — esiste già);
- **giorni senza infortuni** e scadenze di sicurezza scadute (da Scudo);
- **crediti scaduti** in euro e incasso atteso a 30 giorni (da Conti — esiste già);
- **superamenti di soglia ambientale** del mese (da Sentinella);
- **minuti di fermo impianto** della settimana e causale peggiore (da Campo —
  il Pareto esiste già).

**Riga 2 — "cosa richiede la tua attenzione oggi".** Le 5 righe più gravi
prese dal centro avvisi (punto 2).

**Riga 3 — l'andamento.** Tre grafichini minimi (volume, disponibilità, incassi)
degli ultimi 6 mesi. Serve a rispondere a "stiamo migliorando o peggiorando?",
che è la domanda vera di un titolare.

**Riga 4 — le app**, come oggi, ma con un pallino di stato per ciascuna.

**Perché il cliente lo percepisce come valore.** Perché è **la schermata che
giustifica il prezzo davanti al commercialista o al socio**. È anche l'unica
schermata che il titolare (che non inserisce dati) userà davvero: se non c'è,
compra il software chi lavora, non chi paga.

**Regole da rispettare, dalla ricerca.**
- Ogni indicatore deve avere un **obiettivo** e una **definizione scritta**: se
  due persone in azienda non sono d'accordo su cosa significa un numero, il
  quadro non viene creduto e viene abbandonato.
- Meglio **pochi indicatori** che copertura completa.
- Mai far scorrere la pagina prima di aver capito la situazione.
- **Scrivere sempre "dati aggiornati al …"**: un numero senza data non è
  affidabile.

**Attenzione onesta.** Il quadro **non può inventare** i numeri: mostra solo
quelli delle app **attive e alimentate** in quella organizzazione. Se il cliente
ha comprato solo Scudo, il riquadro dei volumi deve dire *"Terra non è attiva"*,
non uno zero. Uno zero finto distrugge la fiducia più della casella vuota.
Tecnicamente serve il punto 4 (lettura tra app) per farlo funzionare.

---

### 8 · Modalità cantiere — funziona senza campo, si usa con il pollice
**App: Campo, Scudo, Flotta · Lavoro: M · Valore: alto**

**Cosa fa.** Tre cose che vanno insieme:
1. **Funziona senza connessione.** In cava il telefono spesso non prende. Oggi —
   e questo è un buco che ho verificato nel codice — **solo Genesi ha un service
   worker** (`apps/genesi/genesi-sw.js`): tutte le altre app hanno il manifest
   (quindi si installano sul telefono) ma **senza connessione mostrano una
   pagina bianca**. Servono due cose: un service worker che tenga in memoria la
   pagina, e la **persistenza offline di Firestore**, che il client di Firebase
   offre già: le scritture fatte offline finiscono in coda e si sincronizzano da
   sole al ritorno del segnale.
2. **Inserimento rapido a pulsanti grossi.** Una schermata sola, poche voci,
   aree di tocco larghe, tastiera numerica per i numeri: "attività conclusa",
   "fermo impianto + causale + minuti", "ore motore del mezzo", "quasi-infortunio".
3. **Foto compressa dal telefono**, ridimensionata nel browser prima di salvare.

**Perché il cliente lo percepisce come valore.** Perché è la differenza fra un
dato inserito **quando succede** e un dato inserito **la sera, a memoria, se
qualcuno si ricorda**. Tutta la ricerca sulle app da cantiere dice la stessa
cosa: *"il funzionamento offline è la caratteristica che decide se un'app da
cantiere verrà usata o no"*. E senza dati inseriti, tutto il resto del software
è vuoto.

**Attenzione onesta, importante.**
- La persistenza offline di Firestore sul web funziona su Chrome, Safari e
  Firefox, ma **non è magia**: se due persone modificano la stessa cosa offline,
  vince l'ultima che si sincronizza. Per gli inserimenti nuovi (che sono il 95%
  dei casi in cava) non è un problema; per le modifiche va detto.
- Le **foto vanno tenute piccole**. Oggi Scudo salva l'allegato **dentro il
  documento Firestore**, con un tetto intorno ai 400 KB, perché un documento
  Firestore non può superare 1 MB. Il posto giusto per i file sarebbe Firebase
  Storage, che però **richiede il piano a consumo**: quindi, finché la regola è
  "nessuna spesa", si resta su foto compresse e poche per oggetto, **e lo si
  scrive nell'app**.

---

### 9 · Firma sul telefono e verbale di consegna
**App: Scudo (poi Campo e Flotta) · Lavoro: S/M · Valore: alto**

**Cosa fa.** Un riquadro in cui si firma **col dito sullo schermo**; la firma
diventa un'immagine piccolissima in bianco e nero che finisce dentro il
documento stampabile del punto 3. Usi concreti in cava:
- **verbale di consegna dei DPI** firmato dal lavoratore (è un documento che
  serve davvero, ed è il primo che un ispettore chiede);
- **presa visione** del POS o della procedura da parte della squadra;
- **rapportino di turno** accettato dal capoturno;
- **riconsegna del mezzo** dopo la manutenzione.

**Perché il cliente lo percepisce come valore.** Perché sostituisce un giro di
carta: stampare, far firmare, scansionare, archiviare, ritrovare. È il tipo di
funzione che fa dire "ah, allora serve davvero".

**Perché costa poco.** Si fa con un `<canvas>` HTML in un centinaio di righe,
senza librerie. La firma esportata in bianco e nero pesa **pochi kilobyte**,
quindi sta comodamente dentro un documento Firestore senza toccare il limite.

**Attenzione onesta, da scrivere nell'app.** Una firma disegnata sullo schermo
**non è una firma digitale a valore legale** (quella richiede un certificato
qualificato, che costa). È l'equivalente di una firma su carta scansionata: vale
come prova di un fatto aziendale, non come firma qualificata. Il valore
probatorio aumenta molto se è accompagnata dal **registro delle attività**
(punto 11), che è esattamente ciò che la letteratura sull'audit trail dice:
serve a dimostrare *chi ha firmato, quando, su quale versione*.

---

### 10 · Avvio in dieci minuti — setup guidato e dati di esempio
**App: Deepwork ID + tutte · Lavoro: M · Valore: altissimo (ma indiretto)**

**Cosa fa.**
- Alla prima apertura, **tre domande** e non di più: come si chiama l'azienda,
  quante persone, quante cave/cantieri. Da queste tre risposte l'ecosistema
  precompila quello che può.
- **Una lista di avvio visibile** con la spunta: "① inserisci i tuoi lavoratori
  ② segna la prima scadenza ③ stampa il primo documento". La ricerca è netta: una
  **lista di avvio con avanzamento visibile** funziona molto meglio di un tour
  guidato che non si può riprendere, e il **setup guidato batte i tour del
  30-60%**.
- **Dati di esempio** già dentro, chiaramente marcati e **cancellabili con un
  tocco**: la schermata vuota è il nemico numero uno. Meglio far vedere com'è il
  software pieno.
- Gli **import CSV già esistenti** (li hanno praticamente tutte le app) vanno
  messi *dentro* questo percorso, non nascosti in un menu.

**Perché il cliente lo percepisce come valore.** Perché è la differenza fra
comprare e usare. I numeri di riferimento della ricerca: obiettivo **30-40% di
utenti che arrivano al primo valore entro 7 giorni**, e **meno di 20 minuti** per
il primo risultato utile. Per noi il "primo valore" è chiarissimo e va scelto
una volta per tutte: **stampare il primo documento intestato con i propri dati**
(punto 3). È il momento in cui il titolare capisce a cosa serve.

**Attenzione onesta.** Oggi l'ingresso di un collega dipende dalle Cloud
Functions, che **non girano sul piano gratuito** (è il rischio R1 già segnalato
in `RICERCA_DEEPWORKID_202607.md`). Finché è così, il percorso di avvio deve
essere pensato per **una persona sola** che poi invita gli altri quando sarà
possibile — e va detto chiaramente, non nascosto.

---

### 11 · Registro "chi ha fatto cosa e quando"
**App: tutte · Lavoro: M · Valore: alto**

**Cosa fa.** Ogni oggetto importante (una scadenza, un documento, una fattura,
una lettura, un intervento) porta con sé una piccola **storia**: creato da Tizio
il 12/03 alle 9:14; stato cambiato da Caio il 14/03; importo corretto da Sempronio
il 20/03 (da 4.200 a 4.500). Visibile con un tocco su "storia" e **incluso nei
documenti stampati** quando serve.

**Perché il cliente lo percepisce come valore.** Tre motivi molto pratici:
1. **Fine delle discussioni interne**: "chi ha cambiato questo dato?" ha una
   risposta.
2. **Valore di prova.** La letteratura italiana sull'audit trail lo dice con
   chiarezza: senza registro è molto difficile dimostrare le condizioni in cui
   una cosa è stata fatta, in caso di contestazione. Per una cava — vicini che
   si lamentano, ispezioni, infortuni, contenziosi su forniture — è un argomento
   di vendita forte.
3. **Fiducia nel software**: sapere che "il sistema si ricorda tutto" è
   esattamente ciò che rende un software il **registro ufficiale** dell'azienda,
   e quindi difficile da abbandonare.

**Attenzione onesta.** Ogni riga di registro è **una scrittura in più** su
Firestore: il piano gratuito ha un tetto giornaliero di scritture, e un registro
troppo chiacchierone lo consuma. Quindi: si registrano **solo i cambi che
contano** (creazione, cancellazione, cambio di stato, cambio di importo o di
data), **non** ogni carattere digitato; e si tiene un tetto (per esempio le
ultime 30 voci per oggetto), come Sentinella già fa con lo storico delle letture
(massimo 50).

---

### 12 · Il costo per tonnellata — il numero che nessun concorrente singolo può dare
**App: Conti, alimentata da Terra + Flotta + Genesi + Campo · Lavoro: M/L · Valore: altissimo**

**Cosa fa.** Un unico numero, aggiornato ogni mese: **quanto ci costa produrre
una tonnellata di materiale**, scomposto nelle sue voci (perforazione ed
esplosivo, carico e trasporto, manutenzione dei mezzi, fermi impianto,
personale). E il suo fratello: **il margine per tonnellata**, cioè cosa resta
rispetto al prezzo di vendita.

**Perché il cliente lo percepisce come valore.** Perché è **la domanda che ogni
titolare di cava si fa e a cui quasi nessuno sa rispondere con precisione**. Il
costo per unità è uno dei pochi indicatori di produzione universalmente
riconosciuti, insieme a disponibilità e OEE. E soprattutto: **nessun software
singolo può calcolarlo**. Un gestionale di manutenzione conosce i costi ma non i
volumi; un software di rilievo conosce i volumi ma non i costi; un gestionale
contabile conosce le fatture ma non la produzione. **Noi abbiamo tutti e tre i
pezzi.** Questo è, a mio parere, l'argomento di vendita più forte
dell'ecosistema.

**Da dove arrivano i pezzi** (tutti già presenti nelle app):
- **volumi estratti** → Terra (`rilievi`, con la banda di incertezza) ;
- **da m³ a tonnellate** → Terra ha già la libreria di densità per litotipo;
- **costi dei mezzi e manutenzioni** → Flotta (i costi ci sono già);
- **costo della volata** → Genesi (la stima economica c'è già);
- **minuti di fermo per causale** → Campo (il Pareto c'è già);
- **ricavi e prezzi** → Conti.

**Attenzione onesta, e va detta forte.** Questo numero è vero solo se il cliente
inserisce i costi con costanza. In particolare:
- **il costo del personale** oggi non è in nessuna app, e molte cave non
  vorranno metterlo (è un dato sensibile): va reso **facoltativo**, con la
  possibilità di inserire un costo orario medio invece dei singoli stipendi;
- **il gasolio** oggi in Flotta è un numero mensile, non per mezzo;
- **la produzione venduta** vera passa dalla **pesa**, che quasi nessuna cava ha
  collegata a un software nostro: i volumi di Terra sono quelli *estratti*, non
  quelli *venduti*, e la differenza (scarti, sfridi, giacenze) esiste;
- quindi il numero va sempre presentato come **stima con una banda**, mai come
  verità contabile. Terra ha già lo stile giusto ("19.400 m³ ± 388"): va usato
  anche qui.

Se il cliente non ha questi dati, la funzione deve **dirglielo** e mostrare cosa
manca ("Manca il costo del personale: il costo/tonnellata che vedi è solo di
mezzi ed esplosivo"). È molto meglio di un numero sbagliato.

---

### 13 · Riepilogo periodico pronto da consegnare
**App: tutte · Lavoro: S · Valore: medio**

**Cosa fa.** Un pulsante "riepilogo della settimana / del mese" che produce un
testo già scritto, pronto da copiare in una email, o da stampare col motore del
punto 3: *"Settimana 30: 4 volate, 12.400 m³ movimentati, disponibilità flotta
91%, 340 minuti di fermo (causale principale: guasto meccanico), 2 scadenze in
avvicinamento."*

**Perché il cliente lo percepisce come valore.** Perché è quello che il direttore
di cava scrive **a mano ogni lunedì**. Conti ha già dimostrato che l'approccio
funziona: i testi pronti per il sollecito e per l'estratto conto sono la parte
più apprezzabile dell'app.

**Perché costa poco.** I numeri sono già tutti calcolati: è composizione di
testo.

---

### 14 · "Cosa è cambiato da quando non c'eri"
**App: tutte · Lavoro: M · Valore: medio**

**Cosa fa.** All'apertura, se sono passati più di due giorni dall'ultimo accesso,
un riquadro discreto: *"Dall'ultima volta (venerdì): 3 rapportini consegnati, 1
manutenzione chiusa, 2 nuove scadenze, 1 superamento di soglia."* Un tocco per
chiuderlo, un tocco per vedere il dettaglio.

**Perché il cliente lo percepisce come valore.** Perché la ricerca sui centri
notifiche insiste su questo punto: *"la superficie 'cosa ti sei perso' conta:
chi riapre il prodotto dopo qualche giorno ha bisogno di un riassunto chiaro"*.
Per un titolare che apre l'app due volte a settimana, è la funzione che gli fa
sentire di avere il controllo senza starci dentro tutti i giorni.

**Attenzione onesta.** Serve sapere **quando è stato l'ultimo accesso**: si
salva nel profilo utente (`users/{uid}`), che le regole già permettono a
ciascuno di scrivere per sé. Costo: una scrittura per accesso, trascurabile.

---

### 15 · Esporta tutto / archivio di sicurezza
**App: tutte · Lavoro: S · Valore: medio, ma sblocca la vendita**

**Cosa fa.** Un pulsante "scarica tutti i miei dati" che produce i CSV di ogni
elenco dell'app (molti ci sono già) più un file leggibile con la data
dell'estrazione.

**Perché il cliente lo percepisce come valore.** Sembra controintuitivo — stiamo
rendendo più facile andarsene — ma è il contrario: **la paura di restare
prigionieri è una delle obiezioni più forti all'acquisto**, specie da parte di
aziende familiari diffidenti. Dire "i dati sono tuoi, li porti via quando vuoi"
toglie l'obiezione. Ed è anche il modo corretto di rispondere al diritto GDPR
alla portabilità dei dati (tema già aperto in `RICERCA_DEEPWORKID_202607.md`).

---

## 3. I dieci dettagli che fanno sembrare il prodotto curato

Questi non sono funzioni: sono **abitudini di costruzione**. Costano poco
ciascuno, ma insieme fanno la differenza fra "un software fatto da qualcuno" e
"un software fatto bene". Sono tutti applicabili **subito e a tutte le app**, e
consiglio di scriverli come regole vincolanti (in `CLAUDE.md` o in
`shared/README.md`).

### 1. Le schermate vuote insegnano, non si scusano
Mai "Nessun elemento". Una schermata vuota ha **tre pezzi**: cosa manca, **a
cosa serve**, e il pulsante che fa la prima cosa.

> ❌ *"Nessuna scadenza."*
> ✅ **"Non hai ancora scadenze."** Le scadenze ti avvisano prima che una visita
> medica o un corso scada, così non ti trovi scoperto durante un'ispezione.
> `[Aggiungi la prima]` `[Usa i 14 adempimenti tipici di cava]` `[Importa da CSV]`

Nota: Scudo ha **già** i 14 adempimenti preimpostati e quasi tutte le app hanno
l'import CSV. Metterli nella schermata vuota è lavoro quasi nullo con effetto
grosso.

### 2. Gli errori dicono cosa fare, non cosa è successo
Un messaggio di errore deve rispondere a "e adesso?". Mai lasciare l'utente con
l'impressione di aver sbagliato lui.

> ❌ *"Errore: permission-denied"*
> ✅ **"Non sono riuscito a salvare: il tuo accesso a quest'azienda è stato
> cambiato. Prova a uscire e rientrare. Il testo che avevi scritto è ancora qui,
> non l'hai perso."**

Regola pratica: ogni errore ha **causa in parole semplici + cosa fare + garanzia
sui dati**. E il testo che l'utente ha digitato **non si perde mai**.

### 3. "Annulla" al posto di "sei sicuro?"
La ricerca è molto chiara: la frizione deve essere **proporzionale al danno**.
- Azione **reversibile** (segnare eseguita una manutenzione, cambiare stato,
  archiviare): niente finestra di conferma. Si fa subito e compare in basso un
  messaggino: **"Fatto. Annulla"**, per 8-10 secondi.
- Azione **irreversibile** (cancellare un lavoratore con tutto lo storico,
  cancellare una fattura incassata): lì sì, conferma — e la conferma deve dire
  **cosa si perde** e chiedere di scrivere il nome, non "OK/Annulla".

Le app oggi usano `confirm()` del browser un po' ovunque: sostituirlo con questo
schema è uno dei ritocchi che si notano di più.

### 4. La ricerca perdona
Vedi il punto 5 del capitolo precedente. Aggiungo il dettaglio che si nota:
quando la ricerca non trova nulla, **non dire "nessun risultato"**: dire
**"Nessun risultato per 'perfortrice'. Forse cercavi: perforatrice?"** oppure
"Prova a cercare solo una parola". E lasciare visibile il pulsante "azzera la
ricerca", perché il caso più comune di "il software è rotto" è un filtro rimasto
attivo che l'utente non vede.

### 5. Il software si ricorda di te
Le app ricordano già l'ordinamento: va esteso e reso **uniforme** — stesso
comportamento in tutte, salvato con la stessa chiave.
Da ricordare: filtro attivo, ordinamento, ultima schermata aperta, ultima
organizzazione, ultime scelte usate nei moduli (squadra, fronte, mezzo, turno),
riquadri aperti/chiusi.
Passo successivo, se piace: **viste salvate** con un nome ("I miei mezzi fermi",
"Scadenze del reparto frantoio"), che è una funzione che i gestionali grossi
vendono come personalizzazione avanzata e da noi costa pochissimo perché è
salvare tre valori.

### 6. L'ordine predefinito ha una testa
Mai ordinare per nome "perché è l'ordine naturale". **In cima va ciò che chiede
attenzione**: la scadenza più vicina, il mezzo fermo, la fattura più vecchia,
l'anomalia aperta. L'ordine alfabetico è un'opzione, non il valore predefinito.
Regola aggiuntiva: le righe **critiche** non si distinguono **solo** per colore
(chi non distingue bene i colori non le vede): sempre colore **+ un'icona o una
parola** ("scaduta").

### 7. Il salvataggio è visibile e onesto
Il dubbio "si sarà salvato?" è quello che fa perdere fiducia in silenzio.
- Dopo ogni salvataggio: **"Salvato alle 10:32"**, discreto, sotto il modulo.
- Se si è offline: **"Non sei collegato. Ho tenuto quello che hai scritto e lo
  salvo appena torna la linea."** (con la persistenza offline di Firestore è
  letteralmente quello che succede).
- Mai un finto "salvato" quando non lo è. Questa è già stata segnalata come una
  debolezza (R10 in `RICERCA_DEEPWORKID_202607.md`).

### 8. Numeri e date scritti come li scrive un italiano
- Migliaia con il punto e decimali con la virgola: **19.400 m³**, non `19400`.
  (`numIt()` esiste già in `shared/deepwork-id-client/dw-shell.js`: va usata
  **ovunque**.)
- **Sempre l'unità di misura** accanto al numero.
- Le date in **doppia forma**: *"scade tra 5 giorni (12/08/2026)"*. Il tempo
  relativo si capisce al volo, la data assoluta serve per parlarne al telefono.
- I numeri incerti con la loro **banda**, come Terra fa già: *"19.400 m³ ± 388"*.
  È una cosa che quasi nessun concorrente fa e che fa sembrare il prodotto
  serio.

### 9. Si usa con una mano sola, con i guanti
In cava il telefono si tiene con una mano.
- Il pulsante principale **in basso**, dove arriva il pollice, non in alto a
  destra.
- Aree di tocco **grandi** (almeno 44×44 punti), e distanti fra loro le azioni
  pericolose da quelle innocue — la vicinanza fra "salva" e "cancella" è una
  delle cause di errore più documentate.
- **Tastiera numerica** quando il campo è numerico (`inputmode="decimal"`):
  sembra un dettaglio da niente, ed è quello che gli operatori notano subito.
- Nessuna finestrella minuscola con testo da 11 pixel.

### 10. Da ogni schermata si può portare via qualcosa
Ogni elenco e ogni riepilogo devono avere almeno uno fra: **stampa**,
**esporta CSV**, **copia testo**. È l'abitudine che ha reso Conti la più
"adulta" delle app, ed è economica.
Aggiunta: in cima a ogni riepilogo, la riga **"dati aggiornati al …"**. Un
numero senza data non viene creduto.

**Undicesimo, fuori classifica ma importante:** mentre i dati arrivano, non
mostrare uno spinner che gira sul vuoto. Mostrare la **forma** della schermata
(i riquadri grigi al posto dei numeri). Fa percepire l'app più veloce anche a
parità di tempo reale.

---

## 4. Il vantaggio dell'ecosistema collegato

È il capitolo strategicamente più importante. Un concorrente può copiare una
nostra funzione. **Non può copiare il fatto che sei app parlano la stessa
lingua**, perché lui vende una cosa sola.

### 4.1 Lo stato di fatto tecnico (verificato nel codice)

Due cose vanno sapute prima di progettare qualunque cosa.

**Buona notizia.** Le regole di sicurezza in `apps/deepwork-id/firestore.rules`
già dicono:

```
match /apps/{appId}/{document=**} {
  allow read:  if memberOf(orgId) || (isDemoOrg(orgId) && signedIn());
  allow write: if memberOf(orgId) && !isDemoOrg(orgId);
}
```

Cioè: **un membro dell'organizzazione può già leggere i dati di qualunque app
della *sua* organizzazione**. L'isolamento fra aziende concorrenti — che è la
cosa delicata — resta intatto, perché è la parte `organizations/{orgId}` a
proteggerlo, ed è testata.

**Il vero ostacolo è piccolo e sta nell'SDK.** In
`shared/deepwork-id-client/index.js`:

```js
orgCollection(name) {
  return collection(this._db, "organizations", this.orgId,
                    "apps", this.appId, name);   // ← sigillato sull'app corrente
}
```

L'app corrente non può quindi *nominare* un'altra app. **Serve un'aggiunta
all'SDK, non un cambio di architettura e nessuna modifica alle regole.**

### 4.2 La proposta: un'area "comune"

Invece di far leggere ogni app dentro le altre (che crea un groviglio di
dipendenze), propongo una **zona condivisa**:

```
organizations/{orgId}/apps/_comune/persone     ← chi lavora in azienda
organizations/{orgId}/apps/_comune/mezzi       ← escavatori, pale, dumper, frantoi
organizations/{orgId}/apps/_comune/siti        ← cave, fronti, cantieri esterni
organizations/{orgId}/apps/_comune/clienti     ← clienti e committenti
organizations/{orgId}/apps/_comune/avvisi      ← le cose che chiedono attenzione
organizations/{orgId}/apps/_comune/azienda     ← logo, ragione sociale, P.IVA, sede
```

Con una sola aggiunta all'SDK, per esempio `id.sharedCollection('persone')`, che
punta a `apps/_comune/persone`. Le regole **coprono già** questo percorso
(`_comune` è un `appId` come gli altri).

**La regola d'oro per non fare confusione: ogni anagrafica ha UNA app padrona
che la scrive, tutte le altre la leggono.**

| Anagrafica comune | Chi la scrive (padrona) | Chi la legge |
|---|---|---|
| **persone** | Scudo | Campo (squadre), Flotta (operatore), Genesi (fochino), Conti (costo orario), hub |
| **mezzi** | Flotta | Campo (attività e fermi), Scudo (attrezzature con verifica periodica), Conti (costi), Genesi (perforatrice) |
| **siti / fronti** | Terra | Genesi (dove si spara), Sentinella (ricettori e punti di misura), Campo (area), Scudo (cantieri) |
| **clienti** | Conti | Scudo (documenti per il committente), Terra (destinazione materiale) |
| **azienda** (logo, P.IVA) | Deepwork ID | **tutte** — è l'intestazione di ogni documento stampato |
| **avvisi** | tutte scrivono, formato unico | hub, centro avvisi |

### 4.3 Lo schema dei passaggi — il dato inserito una volta

Questi sono i percorsi concreti. La freccia significa "questo dato, già
inserito, serve anche lì".

**Percorso A — la persona**
```
Scudo: nuovo lavoratore (nome, ruolo, telefono)
  │
  ├─→ Campo      compone le squadre scegliendo dai nomi veri (non testo libero)
  ├─→ Flotta     assegna un mezzo a un operatore
  ├─→ Genesi     indica il fochino responsabile della volata
  ├─→ Conti      costo orario medio per il costo/tonnellata (facoltativo)
  └─→ Scudo      idoneità sanitaria, formazione, consegna DPI, presenza al corso
                 → e il RITORNO: "questa persona è in squadra oggi ma ha la
                   visita medica scaduta" — è un avviso che vale da solo
                   il prezzo dell'ecosistema
```

**Percorso B — la volata (il più ricco che abbiamo)**
```
Genesi: progetto della volata (fori, cariche, sequenza, previsione PPV)
  │
  ├─→ Campo       piano di carico per la squadra  ✅ IL PONTE ESISTE GIÀ
  ├─→ Sentinella  registro volate: data, fronte, n° fori, kg totali,
  │               kg max per ritardo, distanza dal ricettore
  │               (le colonne del registro coincidono già con l'output di Genesi)
  │                 └─→ misura reale della vibrazione dopo la volata
  │                       └─→ RITORNO a Genesi: taratura della legge di Devine
  │                           sui dati veri di QUESTA cava
  ├─→ Terra       volume abbattuto → confronto con il rilievo successivo
  └─→ Conti       costo dell'esplosivo e degli accessori → costo/tonnellata
```

**Percorso C — il volume e il denaro**
```
Terra: rilievo (volume m³ ± banda, metodo, fronte)
  │
  ├─→ Terra       proiezione di fine anno vs volume autorizzato  ✅ ESISTE GIÀ
  ├─→ Conti       m³ → tonnellate (densità del litotipo) → valore  ✅ metà esiste già
  ├─→ Sentinella  base per la denuncia annuale e per il contributo di cava
  └─→ hub         il primo numero del quadro del titolare
```

**Percorso D — il mezzo**
```
Flotta: mezzo (nome, area, ore motore, stato)
  │
  ├─→ Campo       "l'attività è ferma perché il mezzo X è guasto"
  │                 └─→ RITORNO a Flotta: il fermo di Campo apre da solo
  │                     una segnalazione di manutenzione
  ├─→ Scudo       attrezzature soggette a verifica periodica (art. 71)
  ├─→ Conti       costi di manutenzione e gasolio → costo/tonnellata
  └─→ Flotta      libretto del mezzo stampabile (storico + costi + ore)
```

**Percorso E — le scadenze (il collettore)**
```
Scudo (visite, corsi, DPI) ─┐
Sentinella (adempimenti)  ──┤
Terra (autorizzazioni)    ──┼─→  apps/_comune/avvisi  ─→  centro avvisi (punto 2)
Conti (fatture, gare)     ──┤                          ─→  calendario dell'anno (punto 6)
Flotta (tagliandi)        ──┘                          ─→  quadro del titolare (punto 7)
                                                       ─→  file .ics per il telefono
```

### 4.4 Le regole di onestà del collegamento

Da rispettare, altrimenti la cosa diventa pericolosa invece che utile:

1. **Nessun dato inventato.** Se un'app che dovrebbe fornire un dato non è
   attiva in quell'organizzazione, la casella dice **"Terra non è attiva"**, non
   uno zero. Uno zero finto è peggio del vuoto.
2. **Il ponte è sempre visibile e revocabile.** Quando Sentinella riprende una
   volata da Genesi, deve scrivere *"ripreso da Genesi il 12/03 — modifica se
   non corrisponde"*. Mai un dato che arriva di nascosto.
3. **Chi legge non corregge chi scrive.** Se Campo si accorge che un nome è
   sbagliato, manda l'utente a correggerlo in Scudo. Altrimenti si creano due
   verità.
4. **L'isolamento fra aziende non si tocca mai.** Nessun percorso Firestore
   scritto a mano, tutto passa dall'SDK. Questa regola sta già in `CLAUDE.md` e
   vale a maggior ragione qui.
5. **La migrazione va gestita.** Le app oggi hanno già dentro i loro elenchi
   (Scudo ha i lavoratori, Flotta ha i mezzi, Terra ha i fronti). Il passaggio
   all'area comune va fatto **una app alla volta**, con una funzione che sposta i
   dati esistenti, e senza rompere chi sta già usando l'app.
6. **Il collegamento non deve creare dipendenze circolari.** Sei app che si
   leggono a vicenda senza regole diventano ingestibili. Lo schema
   "una padrona, tante lettrici" serve esattamente a evitarlo.

### 4.5 Come si racconta al cliente (perché è anche un argomento di vendita)

> "Con un gestionale della sicurezza, i tuoi lavoratori li inserisci lì. Con un
> gestionale dei mezzi, li reinserisci lì. Con il programma dei rilievi, i fronti
> li reinserisci ancora. Con Deepwork li inserisci **una volta**. E in più: quando
> il capoturno mette in squadra Rossi, se Rossi ha la visita medica scaduta il
> sistema te lo dice — perché è lo stesso Rossi. Nessuno dei tre programmi
> separati potrebbe accorgersene."

E l'argomento più forte di tutti, dal punto 12: **il costo per tonnellata**. Chi
vende solo manutenzione conosce i costi ma non i volumi. Chi vende solo rilievi
conosce i volumi ma non i costi. Noi conosciamo entrambi.

---

## 5. Cosa NON proporre (onestà)

Per chiudere il cerchio, le idee che sembrano ottime e che vanno **scartate o
ridimensionate**, con il motivo.

| Idea | Perché non si può (oggi) |
|---|---|
| Email o SMS automatici di promemoria | Richiede un server sempre acceso (Cloud Functions su piano a consumo) e un servizio di invio. **Costa.** L'alternativa gratuita è il centro avvisi + il file `.ics` |
| Notifiche push sul telefono | Ricevere è gratis nel browser, ma **spedirle** richiede un server. Stessa storia |
| Archivio foto e documenti senza limiti | Firebase Storage richiede il piano a consumo. Oggi le foto stanno dentro il documento Firestore (limite 1 MB, in pratica ~400 KB compressi) e **va detto nell'app** |
| Firma con valore legale pieno | Richiede un certificato qualificato, che si compra. La firma sul canvas vale come firma su carta scansionata, non di più |
| Fatturazione elettronica verso lo SdI | Richiede un intermediario accreditato. Conti può **preparare** i dati, non inviarli (già detto in `RICERCA_CONTI_202607.md`) |
| Collegamento con la pesa o con la telemetria dei mezzi | È hardware, e ogni marca parla la sua lingua. Al massimo **import CSV** — che Flotta ha già |
| Costo per tonnellata "certificato" | Manca il costo del personale e il dato della pesa. Va presentato come **stima con banda**, mai come contabilità |
| Compilazione automatica di MUD e denunce regionali | I moduli cambiano per regione e per anno. Possiamo produrre il **riepilogo da cui si compila**, non il modulo firmato |
| Riempire il quadro del titolare con dati di app non comprate | Va scritto "non attiva". Uno zero finto distrugge la fiducia in cinque secondi |

---

## 6. Ordine di lavoro consigliato

Se dovessi scegliere l'ordine, questo:

**Primo blocco — si vede subito, costa poco** (tutte le app diventano più belle
e più veloci senza cambiare architettura):
1. Duplica + precompilazione + memoria delle scelte (punto 1)
2. I dieci dettagli del capitolo 3 — soprattutto schermate vuote, errori,
   "Annulla" al posto di "sei sicuro", numeri all'italiana
3. Ricerca che perdona i refusi (punto 5)

**Secondo blocco — i documenti, cioè il motivo per cui si paga**:
4. Motore di stampa condiviso con intestazione azienda (punto 3)
5. I primi tre documenti veri: fascicolo idoneità tecnico-professionale (Scudo),
   relazione di monitoraggio (Sentinella), libretto del mezzo (Flotta)

**Terzo blocco — l'abitudine quotidiana**:
6. Formato comune degli avvisi + centro avvisi (punto 2)
7. Scadenzario dell'anno + esportazione `.ics` (punto 6)

**Quarto blocco — l'ecosistema, che è il fossato**:
8. `sharedCollection` nell'SDK + anagrafica **persone** condivisa (Scudo → Campo)
9. Anagrafiche **mezzi** e **siti**
10. Quadro del titolare nell'hub (punto 7)

**Quinto blocco — il campo e il numero che vende**:
11. Service worker e persistenza offline su tutte le app (punto 8)
12. Costo per tonnellata (punto 12)

---

## 7. Fonti

### Adozione, tempo di primo valore, abbandono
- [Average Time to Value by SaaS Category: 2026 Benchmark Report — Artisan Strategies](https://www.artisangrowthstrategies.com/blog/average-time-to-value-saas-category-2026-benchmark-report)
- [Time to Value: The 2026 SaaS Onboarding Metrics Framework — Digital Applied](https://www.digitalapplied.com/blog/customer-onboarding-time-to-value-2026-saas-metrics-framework)
- [What Is Product Adoption? — Gainsight](https://www.gainsight.com/blog/product-adoption/)
- [Why Users Drop Off During Onboarding and How to Fix It — SaaS Factor](https://www.saasfactor.co/blogs/why-users-drop-off-during-onboarding-and-how-to-fix-it)
- [Product Adoption Metrics for B2B SaaS — Userflow](https://www.userflow.com/blog/product-adoption-metrics)

### Perché le PMI italiane lasciano il gestionale
- [Software gestionale PMI: comprendere e gestire la resistenza al cambiamento — So-Smart](https://www.so-smart.it/it/blogreader/software-gestionale-resistenza-cambiamento.html)
- [Perché molte PMI stanno abbandonando i gestionali tradizionali — GestAPP](https://www.gestapp.it/news/software-gestionali/perche-molte-pmi-stanno-abbandonando-i-gestionali-tradizionali)
- [La domanda di formazione delle PMI oggi — Formazione & Cambiamento](https://www.formazione-cambiamento.it/frontiere/politiche-dell-apprendimento/la-domanda-di-formazione-delle-pmi-oggi-riflessioni-da-unindagine-recente)
- [Gestione cambiamento aziendale: perché l'adozione non è trasformazione — Best Tech Partner](https://www.besttechpartner.ai/2026/04/28/gestione-cambiamento-aziendale-perche-l-adozione-non-e-trasformazione/)

### Cosa rende un software difficile da abbandonare
- [The Future of Switching Costs is B2B — Jeffrey Towson](https://jefftowson.com/membership_content/why-the-future-of-switching-costs-is-b2b-winning-tech-strategy-daily-article/)
- [Switching Costs: How High Switching Costs Create an Economic Moat — FasterCapital](https://fastercapital.com/content/Switching-Costs--Stick-with-Success--How-High-Switching-Costs-Create-an-Economic-Moat.html)
- [Software as a Habit — LinkedIn](https://www.linkedin.com/pulse/software-habit-every-product-managers-dream-omri-ziv)

### Velocità di inserimento, modelli, scorciatoie
- [Important UX Rules for B2B Web Applications — Hakuna Matata Tech](https://www.hakunamatatatech.com/our-resources/blog/b2b-mobile-app-ux-ui-design-best-practices-and-trends-in-2024)
- [Four UX Concepts Easily Forgotten in B2B Design — Bootcamp/Medium](https://medium.com/design-bootcamp/four-ux-concepts-easily-forgotten-in-b2b-design-92214d6adb7d)
- [Top 10 Software Features For Bulk Data Entry — Perfect Data Entry](https://perfectdataentry.com/top-10-software-features-for-bulk-data-entry/)
- [Reusable Checklist Apps: Build Once, Use Forever — MaintainIQ](https://maintainiq.com/reusable-checklist-apps/)
- [Manifestly — Checklist Software for Recurring Tasks](https://www.manifest.ly/checklist-software-made-simple)

### Avvisi, promemoria e "alert fatigue"
- [Understanding and Managing Alert Fatigue — SuprSend](https://www.suprsend.com/post/alert-fatigue)
- [How to Reduce Notification Fatigue: 7 Proven Product Strategies — Courier](https://www.courier.com/blog/how-to-reduce-notification-fatigue-7-proven-product-strategies-for-saas)
- [Notification UX: 8 Best Practices + Real Examples — Eleken](https://www.eleken.co/blog-posts/notification-ux)
- [In-App Notification Center for SaaS: Design Patterns — SuprSend](https://www.suprsend.com/post/in-app-notification-center)
- [How to Help Users Avoid Notification Fatigue — MagicBell](https://www.magicbell.com/blog/help-your-users-avoid-notification-fatigue)
- [4 tips for preventing notification fatigue — Opensource.com](https://opensource.com/article/21/1/alert-fatigue)

### Quadri di sintesi per la direzione
- [Executive Dashboard Design Best Practices: 10 Rules — AppDeck](https://appdeck.com/blog/executive-dashboard-design-best-practices)
- [Best practices for designing and building a great KPI dashboard — insightsoftware](https://insightsoftware.com/blog/best-practices-for-designing-and-building-a-great-kpi-dashboard/)
- [Executive Dashboards: 13 Examples, Templates & Best Practices — Improvado](https://improvado.io/blog/executive-dashboards)
- [KPI produzione: quali indicatori monitorare — Logikamente](https://logikamente.it/blog/gestione-produzione/kpi-di-produzione-quali-indicatori-monitorare/)
- [Indicatori di efficienza degli impianti: OEE, KPI macchina — Bravo Manufacturing](https://www.bravomanufacturing.it/kpi-di-efficienza/)

### Ecosistema collegato e "dato unico"
- [What is the benefit of an integrated solution versus a point solution? — Planon](https://planonsoftware.com/us/resources/blogs/what-is-the-benefit-of-an-integrated-solution-versus-a-point-solution/)
- [Integrated Solutions vs. Point Solutions — HSI Donesafe](https://www.donesafe.com/blog/product/4-reasons-to-choose-an-integrated-solution-over-multiple-point-solutions/)
- [What Is a Single Source of Truth (SSOT)? — MuleSoft](https://www.mulesoft.com/resources/esb/what-is-single-source-of-truth-ssot)

### Cura dell'interfaccia (schermate vuote, errori, conferme, ricerca)
- [Designing the Overlooked Empty States — UXPin](https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/)
- [Empty State UX Examples & Best Practices — Pencil & Paper](https://www.pencilandpaper.io/articles/empty-states)
- [How to Write Better Microcopy for Interfaces — HTMLBurger](https://htmlburger.com/blog/microcopy-for-interfaces/)
- [Confirmation Dialogs Can Prevent User Errors (If Not Overused) — Nielsen Norman Group](https://www.nngroup.com/articles/confirmation-dialog/)
- [Dangerous UX: Consequential Options Close to Benign Options — Nielsen Norman Group](https://www.nngroup.com/articles/proximity-consequential-options/)
- [SaaS Destructive Actions & Confirmation UX Patterns — SaaS UI Design](https://www.saasui.design/blog/saas-destructive-actions-confirmation-ux-patterns)
- [Fuse.js — Lightweight fuzzy-search in JavaScript](https://github.com/krisk/fuse)
- [Fuzzy search: a comprehensive guide to implementation — Meilisearch](https://www.meilisearch.com/blog/fuzzy-search)
- [Save and personalize list views — Microsoft Learn (Dynamics 365)](https://learn.microsoft.com/en-us/previous-versions/dynamics365-release-plan/2019wave2/dynamics365-business-central/saving-personalizing-list-views)

### Avvio guidato e primo valore
- [User Onboarding: The complete guide to activating and retaining users — Appcues](https://www.appcues.com/blog/user-onboarding)
- [How to Identify Your Product's "Aha!" Moment — Whatfix](https://whatfix.com/blog/aha-moment/)
- [Best UX Onboarding Examples: Patterns, Use Cases, and Goals — Chameleon](https://www.chameleon.io/blog/ux-onboarding-examples)

### Documenti, stampa e campo
- [How to Generate PDFs in JavaScript in the Browser — APITemplate.io](https://apitemplate.io/blog/how-to-generate-pdfs-in-javascript-or-browser/)
- [Print.js — libreria JavaScript per la stampa](https://printjs.crabbly.com/)
- [Access data offline — Firestore (documentazione Firebase)](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [PWA + Firebase Offline Mode: Building Apps That Work Anywhere — ChibiCart](https://chibicart.com/blog/pwa-firebase-offline-mode-guide)
- [Get Your Crew to Use the App: Field Guide — Projul](https://projul.com/blog/construction-mobile-app-field-guide/)
- [Best Construction Daily Report Apps — SmartBarrel](https://smartbarrel.io/blog/best-construction-daily-report-apps/)

### Documenti che una cava italiana consegna a terzi
- [ALLEGATO XVII — Idoneità tecnico professionale (D.Lgs. 81/08)](https://www.testo-unico-sicurezza.com/81/allegato-xvii-idoneita-tecnico-professionale.html)
- [Allegato XVII D.Lgs. 81/08: documenti appaltatori — Appalti Chiari](https://appaltichiari.it/blog/allegato-xvii-dlgs-81-08-documenti-appaltatori)
- [MUD 2026: guida pratica su scadenze, obblighi e sanzioni — REM Ecologia](https://remecologia.it/mud-2026-pubblicato-il-decreto-guida-pratica-su-scadenze-obblighi-e-sanzioni/)
- [MUD 2026: scadenza, obblighi e sanzioni — Ergo-Tec](https://www.ergo-tec.it/mud-2026-scadenza-obblighi-e-sanzioni/)
- [Report annuale — ARPA Veneto](https://www.arpa.veneto.it/servizi/ippc/servizi-alle-aziende/report-annuale)
- [Attività estrattive — Regione Piemonte](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive)
- [Disposizioni in materia di contributi dovuti per attività di cava — Bollettino di Legislazione Tecnica](https://legislazionetecnica.it/node/8107895)

### Registro delle attività (audit trail)
- [Audit Trail: lo strumento per garantire conformità e sicurezza — Real Document Solution](https://www.realdocumentsolution.it/blog/audit-trail-strumento-per-garantire-conformita-sicurezza-dati/)
- [Audit Logging e Tracciamento per Compliance — Culture Digitali](https://culturedigitali.eu/notizie/audit-logging-e-tracciamento-per-compliance-nel-crm-best-practice-tecniche/)
- [Che cosa è un Audit Trail? — AtroPIM](https://www.atropim.com/it/glossario/audit-trail)

### Software gestionali per cave (cosa vendono i concorrenti)
- [Quarry Software Solutions — Herbst Software](https://www.herbstsoftware.com/quarry-software-solutions/)
- [Construction Aggregate and Quarry Management Software — The Access Group](https://www.theaccessgroup.com/en-gb/waste-management/software/construction-aggregate/)
- [Quarry Management and Maintenance 101 — CheckProof](https://www.checkproof.com/quarry-management-and-maintenance-101/)

---

## Documenti collegati (già nel repo, non ripetuti qui)

- `docs/RICERCA_SCUDO_202607.md`, `RICERCA_CAMPO_202607.md`,
  `RICERCA_FLOTTA_202607.md`, `RICERCA_CONTI_202607.md`,
  `RICERCA_SENTINELLA_202607.md`, `RICERCA_TERRA_202607.md`,
  `RICERCA_GENESI_202607.md`, `RICERCA_DEEPWORKID_202607.md` — cosa manca
  rispetto a concorrenti e obblighi
- `docs/SPECIFICA_ESTETICA_CORE.md` — il modello estetico a cui tutte le app
  devono aderire
- `docs/ONBOARDING_DATI.md` — il primo caricamento dei dati
- `docs/ISOLAMENTO_DATI.md`, `docs/AUDIT_ISOLAMENTO_APP.md` — l'isolamento fra
  aziende concorrenti, che nessuna proposta di questo documento tocca

---

## In tre righe

Il prodotto diventa indispensabile quando **fa risparmiare tempo visibile**
(duplica, precompila, ricorda), **dice ogni mattina cosa fare** (centro avvisi),
e **produce il foglio che il cliente deve consegnare a qualcun altro** (motore
di stampa intestato). Il fossato che nessun concorrente può scavalcare è che
**sei app condividono lo stesso dato**, e da quel dato esce un numero che nessun
software singolo può calcolare: **il costo per tonnellata**.
