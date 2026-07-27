# Flotta — ricerca luglio 2026: cosa c'è, cosa manca, cosa conviene fare

Documento di sola ricerca (nessuna modifica al codice). Serve a decidere,
con calma e senza gonfiare le aspettative, i prossimi passi dell'app
**Flotta** (mezzi e manutenzioni: escavatori, pale, dumper, frantoi,
perforatrici).

Regole rispettate in tutte le proposte:
- app web statica (HTML + JavaScript) con dati su Firestore tramite l'SDK
  Deepwork ID (`orgCollection`), isolamento totale tra organizzazioni;
- **nessun hardware, nessun abbonamento, nessuna spesa**;
- niente che richieda un server nostro sempre acceso.

Aggiorna e sostituisce, come fotografia, la nota precedente
`docs/FLOTTA_MANUTENZIONE_ROADMAP.md` (che resta valida nelle sue
conclusioni: l'ordine di lavoro era il passo giusto ed è stato fatto).

---

## 1. Inventario onesto: cosa fa Flotta OGGI

Letto direttamente dal codice (`apps/flotta/index.html` e
`apps/flotta/flotta-data.js`). L'app ha quattro schermate: **Quadro,
Mezzi, Manutenzioni, Costi**.

### Quadro (dashboard)
- Quattro numeri in alto, tutti cliccabili (portano alla lista giusta):
  mezzi operativi, mezzi in manutenzione, tagliandi entro 30 giorni,
  spesa carburante del mese.
- **Priorità operative del giorno**: un'unica lista che mette insieme
  manutenzioni urgenti (sia a data sia a ore motore), ricambi sotto
  scorta e mezzi fermi o in verifica, ordinati dai più gravi.

### Mezzi
- Anagrafica semplice: **nome, area, ore motore, stato** (operativo /
  in verifica / fermo). Un tocco sulla riga fa girare lo stato.
- Aggiunta, modifica (nome/area/ore) e dismissione del mezzo (solo se
  fermo), con controllo dei nomi doppi.
- **Registro ore**: si aggiorna il contatore; l'app impedisce di
  scriverci un valore più basso del precedente.
- Filtri (tutti / operativi / in verifica / fermi), ordinamento
  (stato, ore, nome — la scelta viene ricordata), ricerca per nome o
  area, contatore dei risultati.
- **Disponibilità della flotta** in percentuale (mezzi operativi sul
  totale), con il riferimento di settore ~92-94%.
- **Import CSV del parco mezzi** (`nome;area;ore;stato`) per il primo
  caricamento, **import CSV "telemetria"** (`mezzo;ore;carburante`) per
  aggiornare in blocco le ore, **export CSV della situazione**.

### Manutenzioni
- Pianificazione **a data** oppure **a ore motore** (es. "tagliando a
  6000 h"), con eventuale **ricambio collegato**.
- Semaforo di urgenza automatico: scaduta / in arrivo / tranquilla, sia
  per le date sia per le ore.
- **Previsione in giorni**: dato un ritmo d'uso medio (ore/giorno,
  impostabile), stima fra quanti giorni cadrà un tagliando a ore.
- **Chiusura come ordine di lavoro**: si segna eseguita, si inserisce il
  costo e una nota; l'app scarica il ricambio dal magazzino, scrive
  l'intervento nello storico e registra il costo fra i costi.
- **Registro interventi** (storico: data, titolo, mezzo, ricambio,
  costo, note) con **export CSV**.
- **Magazzino ricambi**: nome, giacenza, soglia minima, carico/scarico a
  un tocco, evidenza dei ricambi sotto scorta, ricerca.

### Costi
- Voci di costo libere (voce, importo, nota) con rimozione.
- **Ripartizione percentuale per voce** (dove va la spesa) e totale.

### Sotto il cofano
- Dati su Firestore sotto l'organizzazione
  (`mezzi`, `manutenzioni`, `costi`, `ricambi`, `interventi`), quindi già
  multi-tenant; modalità demo/tour di sola lettura per chi non è loggato.
- Tutti i calcoli (urgenza, previsione, sotto scorta, priorità,
  ripartizione costi) sono funzioni pure, quindi facili da estendere e
  testare.

**In sintesi:** Flotta è già un buon *quadernone digitale* del parco
mezzi: sa quando fare i tagliandi, tiene lo storico degli interventi, il
magazzino ricambi e i costi. È una base solida e ordinata.

---

## 2. Cosa manca

### 2a. Obblighi di legge italiani non coperti (è qui il buco più grosso)

Oggi Flotta gestisce la manutenzione *del costruttore* (tagliandi), ma
**non le scadenze obbligatorie per legge del mezzo**. In una cava sono
esattamente le cose che l'ispettore chiede di vedere.

| Obbligo | In parole semplici | Ogni quanto |
|---|---|---|
| **Verifiche periodiche attrezzature — art. 71 c.11 e Allegato VII D.Lgs. 81/2008** | Per gru su autocarro, autogrù, carrelli semoventi a braccio telescopico (i "telescopici"), piattaforme elevabili, ponti sviluppabili, argani e paranchi il datore di lavoro deve far fare una verifica da un ente. La **prima** la fa l'INAIL (entro 45 giorni dalla richiesta), le **successive** l'ASL o un soggetto privato abilitato. | Dipende dall'attrezzatura. **Importante per noi:** le gru su autocarro usate nel **settore estrattivo** vanno verificate **ogni 12 mesi** (negli altri settori 24), e comunque ogni 12 mesi se la macchina ha più di 10 anni. |
| **Verifica funi e catene** | Controllo di funi, catene e ganci da parte di tecnico qualificato, **annotato sul libretto/registro di controllo della macchina**. | **Trimestrale** |
| **Registro di controllo / libretto della macchina** | Ogni verifica va annotata con data, firma di chi l'ha fatta e descrizione; i risultati vanno **tenuti a disposizione degli organi di vigilanza per 5 anni**. | Continuo |
| **Revisione delle macchine operatrici targate** | I mezzi immatricolati che circolano su strada (dumper, pale con targa) hanno la revisione alla Motorizzazione. | **Ogni 5 anni** |
| **Abilitazione dell'operatore — Accordo Stato-Regioni 22/02/2012** | Chi usa escavatori, pale caricatrici frontali, terne, dumper cingolati deve avere l'abilitazione specifica; **vale 5 anni** e poi serve l'aggiornamento. | Rinnovo a 5 anni |
| **Noleggio a freddo — art. 72 D.Lgs. 81/2008** | Se noleggi un mezzo senza operatore, il noleggiatore deve attestare che è in buono stato e **deve farsi consegnare la dichiarazione che i tuoi operatori sono formati e abilitati**, conservandola per tutta la durata del noleggio. | A ogni noleggio |
| **DPR 128/1959 (polizia delle miniere e delle cave)** | In cava il direttore responsabile e i sorveglianti devono garantire la sorveglianza su macchine e impianti e tenere i documenti a disposizione dell'ingegnere capo. | Continuo |
| **(solo se c'è la cisterna aziendale) Registro carico/scarico carburante** | Chi ha un deposito di gasolio per uso privato/industriale **oltre 10 metri cubi** deve tenere il registro di carico e scarico (elettronico o cartaceo). Sotto i 10 mc si è esenti. | Continuo, se obbligati |

**Attenzione — cosa NON possiamo promettere:** Flotta può *ricordare* le
scadenze e *conservare* la storia, ma **non sostituisce** il libretto
ufficiale della macchina né i verbali dell'ente verificatore. Va scritto
chiaro nell'app.

**Nota per non fare doppioni:** le abilitazioni delle *persone*
(patentini, corsi) sono già gestite in **Scudo** (che ha lo scadenzario
con i preset "Abilitazione attrezzature" e "Verifica periodica
attrezzature"). In Flotta ha senso mettere le scadenze **del mezzo**, e
al massimo un collegamento del tipo "chi è abilitato a usare questo
mezzo".

### 2b. Funzioni che hanno i concorrenti e noi no

Dalla ricerca su software di gestione flotta e manutenzione (CMMS) per
cave, movimento terra ed edilizia (Mainsim, Fleet2Track, eWorkOrders,
MaintainX, Oxmaint, FleetRabbit, Geotab, Site App Pro…):

1. **Controllo pre-uso (giro macchina) digitale.** L'operatore, prima di
   iniziare il turno, spunta una lista di controlli (livelli, perdite,
   cingoli/pneumatici, luci, allarmi, cinture, estintore). È la funzione
   più citata in assoluto: con carta servono 10-15 minuti, in digitale
   meno di 10, e **una voce "non ok" genera automaticamente una richiesta
   di riparazione**.
2. **Piani di manutenzione ricorrenti.** Non una singola scadenza, ma un
   piano che si **rigenera da solo** dopo l'esecuzione (tipico degli
   escavatori: 250 h olio e filtri, 500 h filtro aria e valvole, 1000 h
   olio trasmissione e idraulico, 2000 h revisione pompe). Oggi in Flotta
   ogni tagliando va ripianificato a mano dopo la chiusura.
3. **Ordine di lavoro con stati.** Il flusso standard è: aperto → in
   lavorazione → **in attesa ricambi** → completato → chiuso (e costato).
   Con **ore di manodopera** e **più ricambi** per intervento. Flotta oggi
   ha solo "pianificata" e "chiusa", 1 ricambio e un costo unico scritto
   a mano.
4. **Carburante per singolo mezzo.** Litri/ora e €/ora per macchina, con
   evidenza di chi consuma più del normale (spesso è il sintomo di un
   guasto in arrivo). Oggi il carburante in Flotta è un costo
   **aggregato**, non attribuito al mezzo.
5. **Costo totale per mezzo e costo orario.** Sommare ricambi, officina,
   carburante e noleggi per singola macchina e dividere per le ore: è il
   numero che dice se un mezzo va sostituito.
6. **Indicatori di affidabilità**: quante volte e quanto a lungo un mezzo
   è stato fermo (MTBF/MTTR semplificati), oltre alla disponibilità che
   già abbiamo.
7. **Punto di riordino "intelligente" dei ricambi.** Non solo una soglia
   fissa, ma soglia = consumo medio × tempo di consegna del fornitore +
   scorta di sicurezza. La mancanza del pezzo è una delle cause principali
   di macchina ferma a lungo.
8. **Scheda unica del mezzo (fascicolo).** Una pagina per macchina con
   tutto: dati, documenti, scadenze, storico interventi, costi. Nel
   mercato dell'usato una documentazione completa vale il 5-10% in più al
   momento della rivendita.
9. **QR code sulla macchina** per aprire al volo la sua scheda dal
   telefono o segnalare un guasto.
10. **Telemetria automatica dal costruttore.** Vedi sotto.

### 2c. Telemetria: parliamo chiaro

Esiste uno standard, **AEMP 2.0 / ISO 15143-3**, che Caterpillar, Komatsu,
Volvo, John Deere e altri espongono: restituisce in modo uniforme
posizione, **ore motore**, carburante consumato, allarmi. Sulla carta
sarebbe perfetto per Flotta.

Nella pratica, **oggi non è per noi**, e il motivo va detto senza giri di
parole:
- serve un **contratto attivo di telematica** del costruttore per ogni
  cliente (Cat VisionLink, Komtrax, ecc.), spesso a pagamento dopo i
  primi anni;
- servono **credenziali segrete** (utente/password o chiave API) per ogni
  cliente: **non si possono mettere dentro una pagina web statica**,
  perché sarebbero leggibili da chiunque. Servirebbe un pezzo di software
  nostro sul server, cioè una spesa e una complicazione;
- i portali dei costruttori spesso bloccano le chiamate dirette dal
  browser.

**Passo realistico (già presente e da migliorare):** l'utente scarica dal
portale del costruttore l'export in CSV/Excel e lo carica in Flotta.
Flotta ha già `Importa telemetria (CSV)`: il lavoro utile è renderlo più
tollerante (colonne diverse a seconda del produttore, data della lettura,
carburante attribuito al mezzo), non inseguire il collegamento automatico.
Quello resta un tema della fase di commercializzazione.

---

## 3. Proposte

Difficoltà: **S** = poche ore, nessun dato nuovo · **M** = 1-2 giorni,
qualche campo nuovo · **L** = più giorni, nuova collezione e nuova
schermata.
Priorità: **P1** = farlo presto · **P2** = subito dopo · **P3** = utile,
non urgente.

| # | Nome | Cosa fa | Perché serve | Diff. | Prio |
|---|---|---|---|---|---|
| 1 | **Scadenze di legge del mezzo** | Nuova sezione: per ogni mezzo si registrano verifica periodica Allegato VII, funi e catene (trimestrale), revisione Motorizzazione, assicurazione, con data ultima verifica ed ente. Semaforo scaduta / in scadenza, riusando il calcolo di urgenza già scritto. | È l'unico blocco **obbligatorio per legge** che oggi manca del tutto. Un mezzo non verificato è un mezzo che va fermato. Alto valore commerciale: è la prima domanda del responsabile sicurezza. | M | **P1** |
| 2 | **Controllo pre-uso (giro macchina)** | Checklist breve per tipo di mezzo, compilata dal telefono a inizio turno. Le voci "non ok" finiscono nelle priorità del Quadro e possono diventare una manutenzione con un tocco. | È la funzione più diffusa nei concorrenti e l'unica che porta **l'operatore** dentro l'app (oggi la usa solo chi sta in ufficio). Intercetta i guasti prima che fermino la macchina. | M | **P1** |
| 3 | **Piani di manutenzione ricorrenti** | Modello riutilizzabile ("ogni 250 h", "ogni 12 mesi") che alla chiusura di un tagliando **ripianifica da solo** il successivo. Preset pronti: 250 / 500 / 1000 / 2000 ore. | Toglie il lavoro manuale più noioso e la dimenticanza più frequente. Sfrutta tutto quello che Flotta sa già fare su date e ore motore. | M | **P1** |
| 4 | **Scheda del mezzo (fascicolo unico)** | Toccando un mezzo si apre la sua pagina: dati, ore, scadenze, storico interventi, ricambi consumati, costi. Con export "libretto macchina" in CSV. | Oggi le informazioni di una macchina sono sparse in tre schermate. È anche la vista che serve in caso di controllo e alla rivendita (documentazione completa = valore più alto). | M | **P1** |
| 5 | **Ordine di lavoro completo** | Stati (aperto → in lavorazione → **in attesa ricambi** → chiuso), **ore di manodopera** con costo orario, **più ricambi** per intervento, chi ha eseguito. | È lo standard di qualunque CMMS. Fa emergere il vero costo di un intervento (ricambi + manodopera) e il tempo perso ad aspettare i pezzi. | M/L | P2 |
| 6 | **Carburante per mezzo** | Registrazione dei rifornimenti (mezzo, litri, euro, ore contatore). L'app calcola **litri/ora** e **euro/ora** e segnala chi si scosta dalla propria media. | Il carburante è la voce di spesa più grossa della flotta; un consumo che sale è spesso il primo segnale di un guasto. Oggi il dato c'è ma solo aggregato. | M | P2 |
| 7 | **Costo totale e costo orario per mezzo** | Somma interventi + ricambi + carburante + noleggi per macchina, diviso le ore lavorate. | Risponde alla domanda del titolare: "questa macchina quanto mi costa all'ora, e conviene tenerla?". Con la 5 e la 6 in casa è quasi solo un calcolo. | S/M | P2 |
| 8 | **Segnalazione guasto rapida** | Un pulsante "segnala guasto" sul mezzo: descrizione breve, gravità; finisce subito nelle priorità e può diventare un ordine di lavoro. | Chiude il giro tra chi guida e chi ripara senza telefonate. Semplicissimo da fare, alto valore percepito. | S | P2 |
| 9 | **Riordino ricambi intelligente** | La soglia minima si può calcolare da consumo medio × giorni di consegna del fornitore + scorta di sicurezza; lista della spesa esportabile. | Evita il caso peggiore: macchina ferma perché il pezzo non c'è. I dati di consumo li abbiamo già nel registro interventi. | S/M | P3 |
| 10 | **Fermi macchina e affidabilità** | Registrare inizio e fine di ogni fermo; calcolare giorni di fermo, numero di guasti, tempo medio tra un guasto e l'altro. | Dà la classifica dei mezzi problematici, con i numeri e non a sensazione. | M | P3 |
| 11 | **Chi può usare cosa** | Collegamento con Scudo: sul mezzo si vede se ci sono operatori con abilitazione valida (Accordo Stato-Regioni, 5 anni). | Evita di affidare un escavatore a chi ha il patentino scaduto. Riusa dati che l'ecosistema ha già. | S/M | P3 |
| 12 | **Import telemetria più tollerante** | Riconoscere colonne con nomi diversi, la data della lettura e il carburante; anteprima prima di confermare. | È l'unica strada realistica verso i dati dei costruttori senza spese (vedi §2c). Migliora una funzione che già esiste. | S/M | P3 |

### Cosa NON proponiamo (e perché)
- **Collegamento automatico alla telemetria dei costruttori**: richiede
  contratti, credenziali segrete e un server nostro. Fuori portata oggi.
- **GPS, geofence, lettura della centralina, sensori**: sono hardware.
- **Registri con valore legale / firma digitale**: Flotta è un promemoria
  e un archivio ordinato, non un documento ufficiale. Va detto nell'app.
- **Registro fiscale carburante della cisterna**: ha senso solo se il
  cliente ha un deposito sopra i 10 mc; da valutare più avanti e solo su
  richiesta.

### Suggerimento di ordine
Prima la **1** (scadenze di legge): è un obbligo, non un vezzo, e usa
codice che c'è già. Poi la **4** (scheda del mezzo), che dà una casa a
tutto il resto, e la **2** (controllo pre-uso), che porta gli operatori
dentro l'app. La **3** (piani ricorrenti) subito dopo, perché toglie
lavoro manuale tutti i giorni.

---

## 4. Fonti

**Obblighi normativi italiani**
- [Art. 71 D.Lgs. 81/2008 — verifiche periodiche delle attrezzature](https://tussl.it/titolo-iii-uso-delle-attrezzature-di-lavoro-e-dei-dispositivi-di-protezione-individuale/capo-i-uso-delle-attrezzature-di-lavoro/art-71)
- [Allegato VII D.Lgs. 81/2008 — elenco attrezzature e periodicità](https://tussl.it/allegati/allegato-vii)
- [Eurocert — verifiche periodiche art. 71: prima verifica INAIL entro 45 giorni, successive ASL o soggetti abilitati](https://www.eurocert.it/2020/07/21/verifiche-periodiche-delle-attrezzature-lavoro-art-71-d-lgs-8108/)
- [Regione Umbria — breve guida per il datore di lavoro sulle verifiche periodiche](https://www.regione.umbria.it/documents/18/2418359/Breve+guida+per+il+Datore+di+Lavoro/3c9a5de2-54ce-430a-a7b3-b808e102fd09)
- [Repertorio Salute — vademecum verifiche periodiche delle attrezzature di lavoro (PDF)](https://www.repertoriosalute.it/wp-content/uploads/2015/11/PO_VADEMECUMSIS.pdf)
- [Centro Revisione Gru — gru su autocarro: verifica annuale nel settore estrattivo e oltre i 10 anni](https://www.centrorevisionegru.org/gru-autocarro-oltre-10-anni-verifica-annuale/)
- [Centro Revisione Gru — periodicità delle verifiche gru](https://www.centrorevisionegru.org/verifiche-periodiche-gru-ogni-quanto-farle-e-cosa-comportano/)
- [FAP srl — verifiche periodiche apparecchi di sollevamento, funi e catene e registro di controllo](https://www.fapsrl.net/le-verifiche-periodiche-sugli-apparecchi-di-sollevamento/)
- [Accordo Stato-Regioni 22 febbraio 2012 — Gazzetta Ufficiale](https://www.gazzettaufficiale.it/eli/id/2012/03/12/12A02668/sg)
- [Punto Sicuro — applicazione dell'Accordo sulle attrezzature (abilitazione operatori, validità 5 anni)](https://www.puntosicuro.it/informazione-formazione-addestramento-C-56/abc-della-formazione-l-applicazione-dell-accordo-sulle-attrezzature-AR-16205/)
- [Art. 72 D.Lgs. 81/2008 — obblighi dei noleggiatori e dei concedenti in uso](https://tussl.it/titolo-iii-uso-delle-attrezzature-di-lavoro-e-dei-dispositivi-di-protezione-individuale/capo-i-uso-delle-attrezzature-di-lavoro/art-72)
- [Assodimi — dichiarazione del datore di lavoro sulla formazione nel noleggio a freddo](https://www.assodimi.it/it/notizie-sul-noleggio/finalmente-chiarezza-sull27obbligo-del-noleggiatore-a-freddo-di-acquisire-la-dichirazione-del-datore-di-lavoro-sulla-formazione/4319)
- [Assimpredil Ance — revisione obbligatoria macchine agricole e macchine operatrici](https://portale.assimpredilance.it/articoli/revisione-obbligatoria-macchine-agricole-e-macchine-operatrici)
- [DPR 9 aprile 1959 n. 128 — norme di polizia delle miniere e delle cave (testo, Regione Toscana)](https://www.regione.toscana.it/documents/10180/15099685/D.P.R.+9+aprile+1959,%20n.+128.pdf/7cf5e783-90a0-417f-a6e5-c1dbc58bc435)
- [Assimpredil Ance — serbatoi carburanti a uso privato: obblighi e registro di carico e scarico](https://portale.assimpredilance.it/articoli/serbatoi-carburanti-uso-privato-obblighi-in-vigore-dal-1deg-gennaio-2021)

**Software di gestione flotta e manutenzione (concorrenti)**
- [Mainsim — fleet management per escavatori, gru e macchine movimento terra](https://www.mainsim.com/settori/fleet-management-software/)
- [Mainsim — ordini di lavoro in un CMMS](https://www.mainsim.com/funzioni-gestionale-manutenzioni/ordini-di-lavoro/)
- [Fleet2Track — veicoli d'opera e macchine mobili in cantiere](https://www.fleet2track.it/veicoli-dopera/)
- [eWorkOrders — fleet maintenance CMMS (ordini di lavoro, PM, ricambi)](https://eworkorders.com/fleet-maintenance-software-cmms/)
- [FleetRabbit — fleet management per piccole miniere e cave](https://fleetrabbit.com/industry/mining-fleet-software/best-mining-fleet-management-software-small-mines-quarries-2026)
- [Oxmaint — stati e ciclo di vita di un work order](https://oxmaint.com/blog/post/what-is-a-work-order-types-examples-templates)
- [MaintainX — daily inspection checklist per mezzi pesanti](https://www.getmaintainx.com/blog/daily-inspection-checklist)
- [Oxmaint — checklist giornaliera pre-uso per escavatori, pale e gru](https://oxmaint.com/industries/fleet-management/fleet-heavy-equipment-daily-pre-operation-checklist)
- [Site App Pro — gestione attrezzature, QR code e pre-start digitali](https://www.siteapppro.com/features/equipment-management)
- [HVI — storico manutenzioni e valore di rivendita dei mezzi pesanti](https://heavyvehicleinspection.com/blog/post/best-heavy-equipment-maintenance-history-tracking-software)
- [HVI — KPI di efficienza carburante (consumo orario, tempi al minimo, costo)](https://heavyvehicleinspection.com/blog/post/fuel-efficiency-kpis-for-fleets-mileage-idle-time-cost-km)

**Manutenzione, ricambi e indicatori**
- [Movimento-terra.it — guida alla manutenzione dei macchinari movimento terra (intervalli 250/500/1000/2000 h)](https://movimento-terra.it/guida-alla-manutenzione-dei-macchinari-movimento-terra/)
- [Officina 3MT — manutenzione macchine movimento terra](https://www.officina3mt.it/manutenzione-macchine-movimento-terra/)
- [Mecalux — il punto di riordino nella gestione delle scorte](https://www.mecalux.it/blog/punto-di-riordino)
- [Mainsim — metriche e KPI della manutenzione (MTBF, MTTR, disponibilità)](https://www.mainsim.com/blog/metriche-e-kpi-manutenzione/)

**Telemetria (per il futuro, non ora)**
- [AEM — standard ISO/TS 15143-3 per lo scambio dati di flotta](https://www.aem.org/standards/iso15143/3)
- [Caterpillar — FAQ sull'API ISO 15143-3 (AEMP 2.0)](https://digital.cat.com/knowledge-hub/faq/iso-15143-3-aemp-20-api-faqs)
- [Trackunit — vantaggi e limiti dello standard ISO 15143-3](https://trackunit.com/articles/benefits-from-iso-15143-4/)
