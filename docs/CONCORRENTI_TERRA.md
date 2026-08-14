> # ⛔ AVVISO — LA COLONNA «NON C'È» E' STATA VERIFICATA: UNA SU SEI ERA FALSA
>
> *Verificate tutte e sei le app il 01/08, riga per riga contro il codice, con
> la prova accanto a ogni verdetto (il `file:riga` se la cosa c'è, i termini
> cercati a vuoto se non c'è). La sezione «Verifica del delta» in fondo a
> ciascun documento porta i verdetti.*
>
> | app | righe | assenti confermate | **false** | ⏱️ **scadute** | a metà |
> |---|---|---|---|---|---|
> | Scudo | **17** | **6** | 2 | **2** | **7** |
> | Sentinella | 22 | **13** | 4 | ⏱️ **3** | **2** |
> | Terra | 11 | 4 | 2 | 2 | 3 |
> | Campo | 22 | 11 | 2 | ⏱️ **3** | 6 |
> | Conti | 18 | **8** | **5** | ⏱️ **3** | 2 |
> | Flotta | 16 | 5 | 3 | 0 | 8 |
> | **totale** | **106** | **47** | **18** | **13** | **28** |
>
> ✅ **E due sono già SCESE**, che è il motivo per cui il conto sta scritto: la
> **catena di custodia del dato** di Sentinella e il suo **audit trail** (a metà)
> sono stati costruiti la sera del 01/08 **perché quella riga li proponeva**.
> Una riga che diventa lavoro e poi si aggiorna è una riga che ha fatto il suo
> mestiere; una che resta ferma mentre il codice cammina è l'arretrato.
>
> ⏱️ **E LA COLONNA «SCADUTE» È NATA LA SERA STESSA, con sei righe dentro.**
> Non sono verifiche **sbagliate**: erano vere quando sono state scritte, e il
> cantiere che colmava la mancanza è girato **dopo**, lo stesso pomeriggio,
> senza sapere l'uno dell'altro. Due sono scadute in **trentaquattro e
> trentacinque minuti** (il volume per banco di Terra, lo storico tarature di
> Sentinella). È il prezzo dei cantieri paralleli — che sono anche il primo
> moltiplicatore misurato — quindi la cura non può essere lavorare in fila.
> Quanto è vecchio ciascun documento lo dice adesso un controllo:
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`.
>
> ⚠️ E il costo di non saperlo è misurato: una ricerca lanciata quella sera,
> **con il divieto esplicito** di dichiarare un «non c'è» senza la prova, ha
> proposto come mancanza l'anagrafe appaltatori di Scudo — costruita due ore
> prima, cinque funzioni esportate e dodici punti nella pagina.
>
> **Una mancanza dichiarata su sei non esisteva**, e va peggio dove il codice è
> più maturo: in Conti una riga su tre e mezzo era falsa. Le più grosse: le
> **note di credito** di Conti (impianto completo su art. 26 DPR 633/1972), la
> **gestione guasti** di Flotta, l'**aging con le fasce e il fido**, la
> **previsione dei giorni a scadenza** (che il documento elencava fra le cose
> fatte dodici righe più su, contraddicendosi da solo), la **riconciliazione
> volume misurato/dichiarato** di Terra e gli **indici infortunistici** di
> Scudo.
>
> Quindi: **l'elenco delle funzioni dei concorrenti, con le fonti, vale.** Il
> delta vale **solo dove porta la sua prova**: nessuna riga diventa lavoro
> senza passare dalla sezione di verifica. È la regola che ha impedito di
> aprire due cantieri per cose già costruite, il giorno stesso in cui è stata
> scritta.

# CONCORRENTI TERRA — analisi funzioni e differenziali

**Data ricerca:** agosto 2026  
**Mandate:** studio completo delle funzioni offerti dai concorrenti di categoria (quarry management, survey, volumes, planning).

---

## 1. MONDO — funzioni censite

### SURVEY E CALCOLO VOLUMI

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Cut & fill volumes (end area method) | Maptek Vulcan | [Vulcan Cut & Fill](https://help.maptek.com/vulcan/2025/Content/topics/OpenPit/Section_Design/OpenPit_SectionDesign_Cut-Fill.HTM) |
| Cut & fill con road design (dinamico) | Maptek Vulcan | [Vulcan Interactive Cut Planner](https://help.maptek.com/vulcan/2025/Content/topics/OpenPit/Section_Design/OpenPit_SectionDesign_Cut-Fill.HTM) |
| Bench-by-bench volume reporting | Maptek Vulcan | [Survey Volumes](https://help.maptek.com/vulcan/2025/Content/topics/Survey/Survey_Volumes/Survey_08VOLVOL.htm) |
| Stockpile volume calculation (automated) | Trimble Business Center Mining | [TBC Mining](https://geospatial.trimble.com/en/products/software/tbc-mining) |
| Slope conformance monitoring | Trimble Business Center Mining | [TBC Mining](https://geospatial.trimble.com/en/products/software/tbc-mining) |
| Volume calc da drone (1% accuracy) | Propeller Aero | [Propeller Mining](https://www.propelleraero.com/industry/mining/) |
| Automatic stockpile detection | Pix4D PIX4Dsurvey | [Stockpile Detection](https://www.pix4d.com/blog/pix4dsurvey-stockpile-detection) |
| Stockpile AI (machine learning boundaries) | DroneDeploy | [Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones) |
| 3 base-plane options per volume (Linear, Lowest Point, Triangulated) | DroneDeploy | [Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones) |
| DEM-based volume and elevation diff calculation | Agisoft Metashape | [Metashape Mining Monitoring](https://www.agisoftmetashape.com/metashape-for-mining-and-quarry-monitoring-volume-reports-and-change-detection/) |
| Pit design con switchback e roads | Carlson Mining | [Carlson Mining Overview](https://www.carlsonsw.com/api/wp-content/uploads/EN_Carlson-Mining-Overview.pdf) |
| Bench-by-bench volume calculation | Carlson Surface Mining | [Carlson Mining](https://www.miningsoftwarereviews.com/software/carlson-mining) |
| Stockpile design module | Micromine | [Micromine Alastri](https://www.micromine.com/alastri/) |

### PIANIFICAZIONE DELLA COLTIVAZIONE

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Scheduling cuts (Quick Mode) | Maptek Vulcan | [Vulcan Interactive Cut Planner](https://help.maptek.com/vulcan/2025/Content/topics/OpenPit/Section_Design/OpenPit_SectionDesign_Cut-Fill.HTM) |
| Pit design e waste dump design | Datamine Studio OP | [Open-Pit Mine Planning](https://dataminesoftware.com/solutions/planning/) |
| Reserve estimation e optimization | Datamine Studio OP | [Studio OP](https://dataminesoftware.com/solutions/planning/) |
| Schedule optimization routines | Datamine Studio OP | [Studio OP](https://dataminesoftware.com/solutions/planning/) |
| Reserve scheduling (Rapid Reserver) | Micromine | [Micromine Alastri](https://www.micromine.com/alastri/) |
| Open pit scheduling (Alastri) | Micromine | [Micromine Alastri](https://www.micromine.com/alastri/) |
| Floating cone pit optimization | RockWare RockWorks | [RockWare Mining](https://www.rockware.com/mining/) |
| Reserve estimation con grade filters | RockWare RockWorks | [RockWare Mining](https://www.rockware.com/mining/) |
| Slope stability e rock mass analysis | Strayos Rock Mass AI | [Strayos Blog](https://blog.strayos.com/rock-mass-ai/) |

### MONITORAGGIO E CONFORMITÀ

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Pit progression monitoring | Skycatch | [Skycatch-Caterpillar Integration](https://www.geomechanics.io/news/article/caterpillarskycatch-deal-integrated-mine-data-workflows-explained-for-engineers) |
| Volume reconciliation (cubic meter accuracy) | Skycatch | [Skycatch](https://blog.skycatch.com/topic/mining-drones) |
| Pit compliance tool (Crest Loss, Toe Flare, Over Break, Under Break) | Strayos | [Strayos Pit Compliance](https://blog.strayos.com/rock-mass-ai/) |
| Topographic change detection | Agisoft Metashape | [Metashape Mining](https://www.agisoftmetashape.com/metashape-for-mining-and-quarry-monitoring-volume-reports-and-change-detection/) |
| Design conformance checking (overlay) | Propeller Aero | [Propeller Mining Blog](https://www.propelleraero.com/blog/how-to-use-drone-survey-data-on-your-quarry/) |

### OPERAZIONI DI SCAVO (PERFORAZIONE E BRILLAMENTO)

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Preblast data capture (rock type, face angles, volumes) | Propeller Aero | [Propeller Mining Blog](https://www.propelleraero.com/blog/six-ways-mining-and-aggregates-businesses-use-drones/) |
| Drill pattern optimization | Strayos | [Strayos Mining](https://strayos.com/mining.html) |
| Blast fragmentation analysis | Strayos | [Strayos Drilling & Blasting](https://blog.strayos.com/rock-mass-ai/) |
| Vibration prediction e flyrock control | Strayos | [Strayos Blasting Optimization](https://blog.strayos.com/rock-mass-ai/) |

### CONVERSIONE E DENSITÀ

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Tonnage calculation con density factors | DroneDeploy | [Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones) |
| Material type e density recording | DroneDeploy | [Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones) |
| m³ → t → € conversion | Terra (attualmente) | terra-data.js: `valoreMateriale()` |

### QUALITÀ E ACCURATEZZA DEI DATI

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Survey-grade positioning (±2% tolleranza) | Propeller Aero | [Propeller Mining](https://www.propelleraero.com/industry/mining/) |
| 2-5% accuracy (photogrammetry mining) | Pix4D | [Pix4D Mining Case Study](https://www.pix4d.com/blog/drone-mining-stockpile-volume-pix4dmapper) |
| Metodo e GSD quality tracking | Terra (attualmente) | terra-data.js: `qualitaRilievo()`, `classeAccuratezza()`, `bandaVolume()` |

### INTEGRAZIONE E ESPORTAZIONE

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Report con reference surface method documented | DroneDeploy | [Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones) |
| Export a CAD/GIS/mine planning tools | Agisoft Metashape | [Metashape Mining](https://www.agisoftmetashape.com/metashape-for-mining-and-quarry-monitoring-volume-reports-and-change-detection/) |
| CSV/PDF export volumes | Propeller Aero | [Propeller Mining Blog](https://www.propelleraero.com/blog/how-stockpile-volume-measurement-works-in-drone-surveying-with-propeller/) |

### GESTIONE CONCESSIONE E AUTORIZZAZIONI

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Soglia di guardia e preavviso | Terra (attualmente) | terra-data.js: `vitaCava()` con sogliaGuardiaPct |
| Pregresso dichiarato vs misurato | Terra (attualmente) | terra-data.js: `estrattoComplessivo()`, `pregressoDichiarato` |
| Scadenza titolo e residuo autorizzato | Terra (attualmente) | terra-data.js: `vitaCava()` con dataScadenza, scadePrimaIlTitolo |
| **[dedotto]** Gestione specifica di concessioni regionali | Nessuno trovato | — |

### RIEPILOGO ANNUALE E DICHIARAZIONI

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Riepilogo annuale per ente | Terra (attualmente) | terra-data.js: `riepilogoAnnuale()` |
| Distinzione scavo vs cumulo per dichiarazione | Terra (attualmente) | terra-data.js: `provenienzaDi()`, `baseOnereEscavazione()` |
| **[dedotto]** Compliance reporting per regulatory agencies | Software dedicati (Enablon, IsoMetrix, MonitorPro) | [Mining Compliance Software](https://fleetrabbit.com/industry/mining-fleet-software/Best-Mining-Compliance-Management-Software-to-Reduce-Administrative-Work-in-2026) |

### RICONCILIAZIONE VOLUME RILEVATO VS VENDUTO

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| Volume reconciliation tra due date | Skycatch | [Skycatch-Caterpillar](https://www.geomechanics.io/news/article/caterpillarskycatch-deal-integrated-mine-data-workflows-explained-for-engineers) |
| Volume comparison vs design specifications | Propeller Aero | [Propeller Mining](https://www.propelleraero.com/industry/mining/) |
| **[dedotto]** Mapping tonnellate dichiarate (campo) vs m³ misurati | Ponte P2 (Conti/Campo) | apps/terra/terra-data.js rapportiniCampo |

### PIANI DI RIPRISTINO AMBIENTALE

| Funzione | Prodotto | Fonte |
|----------|----------|--------|
| **[dedotto]** Reclamation plan design e monitoring | Software dedicati (RESPEC, Enablon) | [RESPEC Closure](https://www.respec.com/market/mining/closure-and-reclamation/) |
| **[dedotto]** Post-closure environmental monitoring | Software dedicati | [RESPEC Environmental](https://www.respec.com/market/mining/closure-and-reclamation/environmental-permitting-remediation/) |

---

## 2. NOSTRA APP — stato attuale

Stato di Terra `terra-data.js` + `index.html`:

| Funzione | Terra | Note |
|----------|-------|--------|
| **Survey e volumi** | | |
| Cut & fill volumes | — | Non c'è |
| Bench-by-bench volume tracking | — | Non c'è |
| Automatic stockpile detection | — | Non c'è (rilievi caricati manualmente) |
| Stockpile volume calculation | C'è | Somma volumeM3 di rilievi per fronte |
| Volume comparison over time | C'è | trendVolumi(), volumiPerMese() |
| **Pianificazione** | | |
| Pit design e scheduling | — | Non c'è (lotti creati manualmente, no design automatico) |
| Reserve estimation con optimization | C'è a metà | riservaResidua() calcola solo residuo, no optimization |
| Floating cone optimization | — | Non c'è |
| **Monitoraggio** | | |
| Pit progression monitoring | C'è a metà | vitaCava(), proiezioneAnnua() monitorano il consumo |
| Volume reconciliation (misurato vs dichiarato) | — | Non c'è (ma il ponte P2 lo fa su campo/venduto) |
| Conformità design | — | Non c'è |
| **Operazioni di scavo** | | |
| Drill/blast optimization | — | Non c'è |
| Fragmentation analysis | — | Non c'è |
| **Conversione** | | |
| m³ → t → € | C'è | valoreMateriale(), pero € lo fa Conti (ponte P4) |
| Tonnage da densità preset | C'è | Usa DENSITA_PRESET da shared/dw-ponti.js |
| **Qualità** | | |
| Method e GSD tracking | C'è | qualitaRilievo(), classeAccuratezza() |
| Accuracy class (survey-grade / indicativo) | C'è | classeAccuratezza() con tolleranza tipica |
| Volume uncertainty band | C'è | bandaVolume() con tolleranza % |
| **Integrazione** | | |
| Export volumes (CSV, PDF) | C'è | Esporta dati su confronto rilievi, riepilogo annuale |
| **Concessione e autorizzazioni** | | |
| Soglia guardia e preavviso | C'è | vitaCava() con sogliaGuardiaPct |
| Pregresso dichiarato | C'è | estrattoComplessivo() con pregressoDichiarato |
| Scadenza titolo e residuo | C'è | vitaCava() con dataScadenza, anniResidui, annoEsaurimento |
| Gestione concessione regionale | C'è a metà | vitaCava() generico, niente regole specifiche per regione |
| **Riepilogo annuale** | | |
| Riepilogo per ente | C'è | riepilogoAnnuale() per anno, fronte, mese |
| Scavo vs cumulo separati | C'è | soloScavo(), soloCumulo(), distinti negli export |
| Base dell'onere (m³ lordo - detratto) | C'è | baseOnereEscavazione() con detratto per recupero |
| **Compliance** | | |
| Compliance reporting per ente | — | Non c'è (riepilogoAnnuale() da i dati, il documento lo fa chi compila) |

**Totale funzioni Terra:** ~22 funzioni rilevanti  
**Totale funzioni mondo:** ~65 funzioni censite

---

## 3. DELTA — mancanti ricorrenti nei concorrenti

Ordinate per ricorrenza (quanti produttori le hanno):

| Posizione | Funzione mancante in Terra | Ricorrenza | Prodotti con essa |
|-----------|---------------------------|-----------|-------------------|
| **1.** | **Automatic cut/fill volume calculation da disegno di pit** | 6/13 | Maptek, Datamine, Carlson, Micromine, RockWare, Strayos |
| **2.** | **Volume reconciliation: confronto misurato vs dichiarato/venduto** | 3/13 | Skycatch, Propeller, DroneDeploy (tramite tonnage) |
| **3.** | **Drill & blast optimization + fragmentation analysis** | 1/13 | Strayos (specializzato) |
| **4.** | **Preblast data capture (rock type, face angles)** | 1/13 | Propeller |
| **5.** | **Compliance reporting standardizzato per ente** | [dedotto] | Enablon, IsoMetrix, MonitorPro (separati) |
| **6.** | **Slope conformance checking e geotechnical constraints** | 3/13 | Trimble, Datamine, Strayos |
| **7.** | **Pit design con automatico road routing** | 2/13 | Maptek, Carlson |

---

## 4. DOVE POSSIAMO FARE MEGLIO

### 4.1 **Disaccoppiamento tra survey e piano** (differenziale di categoria)

I competitor fanno due cose insieme e spesso confuse:
- Survey tool (importa il rilievo, lo visualizza, calcola volume) → Maptek, Pix4D, DroneDeploy, Agisoft
- Optimization tool (progetta il pit, schedula gli scavi, stima le riserve) → Datamine, Micromine, RockWare, Maptek

Terra oggi si ferma al primo. I nostri clienti sono **direttori di cava, non ingegneri di progetto**. La domanda che si fanno:
- "Quanto ho cavato l'ultimo mese?" ✅ Terra risponde bene
- "Quanto mi resta da cavare?" ✅ Terra risponde bene (vitaCava)
- "Quando finisco?" ✅ Terra risponde bene (anniResidui)

Ma NON chiedono a Terra:
- "Come faccio a ottimizzare il disegno del pit?" (lo fa il consulente) — OK, non è il mercato di Terra
- "Come traccio che il rilievo è effettivamente quello che ho cavato?" ← Questo è il vero vuoto

### 4.2 **Tracciabilità dal rilievo al venduto** (il vuoto vero)

La ricerca mostrava che Skycatch è stato acquisito da Caterpillar specificamente per il **volume reconciliation**: un rilievo drone dice "ho cavato 5.000 m³", il turno di campo dice "ho caricato 150 tonnellate". Con le densità, quello che è stato caricato sono 5.200 m³ (al 4% di errore). Dove sono i 200 m³ che mancano?

Terra ha il ponte P2 che riceve i rapportini di turno. Ma:
- I rapportini sono in tonnellate (non tutti hanno la densità)
- Stanno dopo il rilievo (il grafico di Terra mostra la riconciliazione)
- Non li integra nel riepilogo per l'ente

**Quello che farebbe male a Maptek/Datamine/Micromine:**

"Ogni mese questa cava riconcilia quello che ha misurato col drone contro quello che il turno di campo dice di avere caricato. Se il mese scorso hai cavato 5.000 m³ sul rilievo e i turni dicono 4.900 tonnellate (densità 1,9, è 2.576 m³), sai che c'è una perdita di trasporto del 48% **e chi è responsabile**: è un trasportista senza controllo o una stima di densità sbagliata? La nostra risposta non è un numero: è il luogo dove risparmiare soldi o dove il numero che dichiara all'ente è pericolo**amente ottimista."

Tutto il resto (pit design, blast planning, conformance) lo fanno bene, ma lo vendono a ingegneri. Terra lo vende a titolari che vogliono sonni tranquilli e **non perdere soldi**.

### 4.3 **Cosa fare**

**Non** fare quello che fa Strayos (troppo specializzato, troppo verticale).  
**Fare** quello che nessuno fa bene: legare il **rilievo alla produzione ai soldi** senza chiedere di capire la matematica.

Nella roadmap, il ponte P2 (riconciliazione volume vs tonnellate) è il prossimo grande passo e va **dentro Terra**, non come documentazione. Quando uno guarda il KPI della vita cava, se c'è uno scarto fra misurato e dichiarato (dai turni), Terra dice esattamente dov'è il buco e chi lo fa.

---

## Fonti

- [Maptek Vulcan Cut & Fill](https://help.maptek.com/vulcan/2025/Content/topics/OpenPit/Section_Design/OpenPit_SectionDesign_Cut-Fill.HTM)
- [Maptek Vulcan Survey Volumes](https://help.maptek.com/vulcan/2025/Content/topics/Survey/Survey_Volumes/Survey_08VOLVOL.htm)
- [Trimble Business Center Mining](https://geospatial.trimble.com/en/products/software/tbc-mining)
- [Propeller Aero Mining](https://www.propelleraero.com/industry/mining/)
- [Pix4D Stockpile Detection](https://www.pix4d.com/blog/pix4dsurvey-stockpile-detection)
- [Pix4D Mining Case Study](https://www.pix4d.com/blog/drone-mining-stockpile-volume-pix4dmapper)
- [DroneDeploy Volume Measurement](https://help.dronedeploy.com/hc/en-us/articles/1500004963922-Volume-Measurement-with-Drones)
- [Skycatch-Caterpillar Integration](https://www.geomechanics.io/news/article/caterpillarskycatch-deal-integrated-mine-data-workflows-explained-for-engineers)
- [Agisoft Metashape Mining Monitoring](https://www.agisoftmetashape.com/metashape-for-mining-and-quarry-monitoring-volume-reports-and-change-detection/)
- [Carlson Mining](https://www.carlsonsw.com/api/wp-content/uploads/EN_Carlson-Mining-Overview.pdf)
- [Datamine Studio OP](https://dataminesoftware.com/solutions/planning/)
- [Micromine Alastri](https://www.micromine.com/alastri/)
- [RockWare Mining](https://www.rockware.com/mining/)
- [Strayos Rock Mass AI](https://blog.strayos.com/rock-mass-ai/)
- [Mining Compliance Software](https://fleetrabbit.com/industry/mining-fleet-software/Best-Mining-Compliance-Management-Software-to-Reduce-Administrative-Work-in-2026)
- [RESPEC Closure & Reclamation](https://www.respec.com/market/mining/closure-and-reclamation/)

---

## Verifica del delta (01/08)

> **Verificato contro il codice al commit `eab041d`** *(14/08 · **tutte e undici
> le righe rilanciate una per una**, dopo i sei commit di arretrato — uno dei
> quali MORDE (`c93c607`). Esito: **verdetti cambiati zero**, **dieci comandi su
> undici tornano identici**, **una prova aggiornata**.*
>
> ⚠️ **E questo documento è la prova che la forma «comando + uscita attesa»
> funziona, misurata contro sé stessa.** Il 09/08 le undici celle sono state
> riscritte togliendo ogni numero di riga e mettendoci il comando che ritrova il
> nome. Cinque giorni e sei commit dopo — fra cui uno che ha aggiunto due
> `export function` — **dieci degli undici comandi rispondono alla cifra quello
> che c'è scritto**. Nello stesso giro Conti e Flotta, che i numeri di riga li
> avevano ancora, hanno dato **cinque prove marcite ciascuna** e **35 citazioni
> `file:riga` scadute su 39 campionate**. Non è il codice di Terra a essere più
> fermo: è che *un comando si rilancia, e un numero si può solo credere*.
>
> **L'unica prova aggiornata** — «Reserve estimation con optimization», che è
> **FALSO, C'È GIÀ**: `grep -c riservaResidua apps/terra/index.html` dava `2` e
> oggi dà **`3`**. Non è marcita, è **cresciuta**: `eab041d` ha aggiunto il
> terzo lettore chiudendo «Riserva residua stimata: **0 m³ · durata ~0 anni**»
> dove nessuno aveva scritto quanto resta — uno zero tranquillo dove non era
> stato misurato niente. La riga si rafforza, il verdetto no.
>
> ⚠️ **E il commit che MORDE non ha mosso nessuna capacità**, misurato: `<button>`
> aggiunti **0** e tolti **0** (40 prima, 40 dopo), e le due `export function`
> nuove sono `scartiFrontiCsv` e `scartiRilieviCsv` — le righe che l'import
> **non fa entrare** smettono di sparire in silenzio. È cambiato **come** l'app
> dice una cosa che già faceva.
>
> ⚠️ **Una terza cosa chiusa il 14/08 NON tocca nessuna riga di questa tabella**,
> e va detto perché non la si cerchi: in `shared/dw-ponti.js` `misuratoPeriodo` e
> `intervalliFraRilievi` non contano più un rilievo **senza volume**. Cade sulla
> riga «Volume reconciliation», già **FALSO, C'È GIÀ**: la rende più giusta, non
> la muove.
>
> *(riverificato in precedenza a `3a3ca66` il 09/08 sera, a `4a5175a` lo stesso
> giorno, a `57c78cf` l'08/08 sera, a `8583a0b` lo stesso giorno, a `4916275` il
> 06/08 e a `e9f9b0d` il 01/08).*
>
> ### 09/08 (sera) — due commit, **uno che morde**, zero righe mosse
>
> Fra `4a5175a` e `3a3ca66` Terra è andata avanti di **2 commit**, **+105 righe**
> e −8, e **uno morde**: `5b9e4e5` ha portato due `export function` nuove,
> `serieDichiaratoTurni` e `descriviBuchiTurni`. Sono il **ponte P2** —
> raccontano *perché* manca un punto nel grafico «misurato contro dichiarato»
> (i rapportini non arrivano · nessun turno ha registrato · i turni hanno
> dichiarato viaggi o tonnellate senza densità, che in metri cubi non si
> portano). Cioè cadono sulla riga **Volume reconciliation**, che era già
> **FALSO, C'È GIÀ** dal 01/08: la rafforzano, non la muovono.
>
> **Nessuna delle quattro mancanze dichiarate è stata colmata**, e la prova è la
> ricerca sulle righe aggiunte, non la lettura:
>
> ```
> git diff 4a5175a..3a3ca66 -- apps/terra/ | grep -E "^\+" \
>   | grep -oiE "\b(cut|fill|stockpile|detection|pit|design|scheduling|floating|cone|conical|sterro|riporto|taglio|riempimento)\b" \
>   | sort | uniq -c
> →  (nessuna riga)
> ```
>
> **Zero occorrenze su 14 termini in 105 righe aggiunte.**
>
> ⏱️ **E QUESTO PASSAGGIO È UNA RILETTURA VERA, RIGA PER RIGA — non il
> controllo da un minuto dei due blocchi qui sotto.** Esito onesto, ed è lo
> stesso che il 09/08 è stato misurato su tutte e quarantasette le righe del
> delta: **nessun verdetto cambia, sette prove non si riproducevano più.**
> Nessuna di quelle sette era una verifica sbagliata — a marcire è **il modo in
> cui erano scritte**, perché il repository cresce:
> · **dodici numeri di riga su dodici erano scaduti** (`riservaResidua` citata a
>   384 e sta a 555, `vitaCava` a 670 e sta a 857, `misuratoPeriodo` a 211 e sta
>   a 227): i **nomi** erano giusti tutti e dodici. Adesso la prova cita il nome
>   e il comando che lo trova, che è stabile;
> · il conto di un **termine largo** si era mosso da solo (`fill` da 16 a 17,
>   `taglio`+`riempimento` da 8 a 7) senza che niente di quel mestiere entrasse
>   nel codice;
> · e due **caratterizzazioni erano false**: `fillStyle` era citato fra le
>   occorrenze di `fill` di Terra e in Terra **non c'è mai stato**
>   (`grep -c fillStyle apps/terra/terra-data.js apps/terra/index.html` → `0` e
>   `0`; vive in Genesi, che ha una tela); e l'unica `floating` era data per «un
>   termine di CSS» mentre è un commento sul **`valid floating-point number`**
>   della specifica di `<input type="number">`.
> ⚠️ Una prova falsa con un verdetto giusto non rende la riga sbagliata: la
> rende **non credibile**, e chi la riapre fra un mese la butta via insieme a
> quelle buone. È per questo che valeva riscriverle anche a verdetti fermi.
>
> **08/08, sera — quattro commit, NESSUNO che morde.** Fra `8583a0b` e `57c78cf`
> Terra è andata avanti di quattro commit e **+18 righe** e −6. Nessuno aggiunge
> o toglie una `export function` o un `<button>` — le due forme con cui qui nasce
> e muore una funzione — e aprendo il diff si vede perché: un colore
> d'inchiostro alzato per il contrasto (`--ink-dg`, 3,88 → 5,72 sul fondo più
> chiaro), un `m³` avvolto nella sua `<span class="u">` perché il maiuscolo non
> lo tocchi, e il passaggio ad `applicaPercorsi` per non riscrivere un campo
> composto per intero. **Zero funzioni nuove, zero verdetti che si muovono**:
> non c'è nessuna riga da riaprire, e questo blocco serve a dirlo — un arretrato
> che nessuno chiude si legge come un ritardo anche quando è rumore.
> Ogni riga qui sotto
> era vera **a quel commit**, e non lo è più per forza adesso: il 01/08 una riga è
> scaduta in **trentacinque minuti**, perché la verifica e il cantiere che la
> colmava sono girati lo stesso pomeriggio senza sapere l'uno dell'altro.
> Di quanti commit l'app sia andata avanti da allora lo dice
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`. Le righe già trovate
> scadute portano la loro correzione accanto, con la data.
>
> ### 08/08 (terzo passaggio) — tredici commit, cinque che mordono, zero righe mosse
>
> Fra `4916275` e `8583a0b` Terra è andata avanti di **13 commit**, **+815
> righe** e −109. **Cinque** mordono secondo `documenti-invecchiati.mjs`, cioè
> hanno aggiunto o tolto una `export function` o un `<button>` — è il numero più
> alto delle sei app, e per questo Terra era il documento da riprendere per
> primo dopo Sentinella. Quello che hanno costruito:
> `aEufonica`, `articoloNumero`, `csvRilievi`, `detrazioneRecupero`,
> `rientroRilievi`, `ripartizioneFronti`, e un bottone **«Scarica rilievi
> (CSV)»**.
>
> **Nessuna di quelle cose è una delle quattro dichiarate assenti**, e la prova
> è la ricerca sul diff, non la lettura:
>
> ```
> git diff 4916275 HEAD -- apps/terra/ | grep -E "^\+" \
>   | grep -oEi "\b(cut|fill|taglio|riempimento|stockpile|detection|pit|
>                   scheduling|floating|cone|conical)\b" | sort | uniq -c
> →  (niente)
> ```
>
> **Zero occorrenze su 11 termini in 815 righe aggiunte.** Sui file interi
> restano quattro parole, tutte già note e tutte estranee al mestiere di cui
> parlano le righe: `fill`=17 è l'attributo di disegno degli SVG (`fill=%27…`
> nelle icone), `taglio`=5 è il nome della classe CSS `dwg-taglio` (una linea
> tratteggiata), `riempimento`=2 è un commento sulla barra di avanzamento, e
> l'unico `floating` è la frase «*floating-point number*» in un commento su come
> il browser sanitizza i decimali — è la specifica di `<input type="number">`, e
> si ritrova per **frase** invece che per numero di riga:
> `grep -c 'floating-point number' apps/terra/terra-data.js apps/terra/index.html`
> → `1` e `0`. `cut`, `stockpile`,
> `detection`, `pit`, `scheduling`, `cone`, `conical`: **zero**.
>
> ⚠️ **E i confini di parola non sono un dettaglio**: è la lezione pagata
> un'ora prima riverificando Sentinella, dove una ricerca senza confini dava
> cinque falsi allarmi su cinque (`LoRa` dentro «co·lora·to», `m/s` dentro
> `mm/s`, che è l'unità della PPV). Qui senza confini `pit` e `cut` sarebbero
> entrati in decine di parole italiane e inglesi, e la riverifica avrebbe
> proposto lavoro su mancanze immaginarie.
>
> ### 06/08 (secondo passaggio) — riallineato al commit `4916275`
>
> L'app si è mossa di **un commit** dopo la verifica qui sopra, ed è il commit
> dei **disegni che mentono**: geometrie, non funzioni. Ripassato con lo stesso
> metodo — i termini del delta cercati **solo nelle righe aggiunte** — e non
> risponde niente, quindi nessuna riga cambia verdetto.
> ⚠️ E va detto che cos'è questo passaggio, per non farlo sembrare più di
> quello che è: **non è una rilettura delle righe una per una** (quella è
> quella sopra, con la sua data). È il controllo che un commit noto non abbia
> colmato una mancanza dichiarata. Costa un minuto e serve a tenere a zero
> l'arretrato che `documenti-invecchiati.mjs` misura; la prova vera resta
> quella riga per riga.

| Funzione | Verdetto | Prova |
|----------|----------|-------|
| Cut & fill volumes | **CONFERMATO ASSENTE** | ⏱️ *Prova riscritta il 09/08 (sera): il verdetto regge, la ricerca no — vedi sotto perché.* `grep -ci 'cut.\?and.\?fill\|cutfill\|end.\?area\|sterro\|riporto\|base.\?plane' apps/terra/terra-data.js apps/terra/index.html` → **`0` e `0`**. Nessuna funzione confronta un terreno di partenza con uno di arrivo per dire quanto si è tolto e quanto si è messo. **Che cosa sono le occorrenze di `fill`** (termine largo, quindi si dice che cosa sono e non quante): tutte **disegno**, mai un volume — la classe della barra della vita cava `.vita-fill`, il `fill:none` delle icone SVG, il `fill=%23…` delle icone codificate nell'URL e un `-webkit-text-fill-color`. |
| Bench-by-bench volume tracking | ⏱️ **SCADUTA — C'È DAL 01/08** (verifica `e9f9b0d` 16:20 → costruito `e5f15a7` 16:55, **35 minuti**) | ⏱️ *Prova riscritta il 09/08 (sera): la cella portava ancora la prova di PRIMA che fosse costruito — «il tracking è per fronte, non per banco» — cioè smentiva il suo stesso verdetto.* Oggi: `grep -c 'export function ripartizioneBanchi' apps/terra/terra-data.js` → **`1`**, e la pagina la importa e la chiama (`grep -c ripartizioneBanchi apps/terra/index.html` → **`3`**). Ripartisce il volume del riepilogo annuale **per banco**, leggendo il banco dalla scheda del fronte, e dichiara `misurabile: false` col motivo scritto quando non ci sono fronti — l'assenza di dato non diventa uno zero. Il tracking per fronte (`volumeFronte`) resta accanto, non al posto suo. |
| Automatic stockpile detection | **CONFERMATO ASSENTE** | ⏱️ *Prova riscritta il 09/08 (sera): stesso verdetto, comando al posto del conto.* `grep -ci 'stockpile\|point.\?cloud\|nuvola di punti\|segmentation\|auto.\?detect' apps/terra/terra-data.js apps/terra/index.html` → **`0` e `0`**. Il cumulo si dichiara a mano: non c'è nessun riconoscimento automatico da una nuvola di punti. |
| Pit design e scheduling | **CONFERMATO ASSENTE** | ⏱️ *Prova riscritta il 09/08 (sera): stesso verdetto, termini lunghi al posto di `pit` nudo.* `grep -ci 'pit.\?design\|waste.\?dump\|haul.\?road\|scheduling\|schedulazione\|bench.\?design' apps/terra/terra-data.js apps/terra/index.html` → **`0` e `0`**. I lotti si creano a mano, senza nessun disegno automatico della cava. ⚠️ `pit` da solo **non è un termine da cercare in un file italiano**: l'unica occorrenza sta dentro «*pittogrammi*», ed è il modo in cui una riverifica si convince di aver trovato qualcosa. |
| Reserve estimation con optimization | **FALSO, C'È GIÀ** | ⏱️ *Prova riscritta il 09/08 (sera): il nome era giusto, il numero di riga no (diceva 384, sta a 555).* `grep -c 'export function riservaResidua' apps/terra/terra-data.js` → **`1`**; la pagina la importa e la chiama (`grep -c riservaResidua apps/terra/index.html` → ⏱️ **`3`** *dal 14/08, era `2`: `eab041d` ha aggiunto il terzo lettore, quello che smette di scrivere «Riserva residua stimata: 0 m³ · durata ~0 anni» dove nessuno aveva scritto quanto resta*) per mostrare il consumo annuale. Non è una **full optimization** — la stima della riserva però c'è. |
| Floating cone optimization | **CONFERMATO ASSENTE** | ⏱️ *Prova riscritta il 09/08 (sera): il verdetto regge, la caratterizzazione era FALSA.* `grep -ci 'floating.\?cone\|lerchs\|grossmann\|ultimate.\?pit\|pit.\?optimi\|conical' apps/terra/terra-data.js apps/terra/index.html` → **`0` e `0`**. Nessun ottimizzatore geometrico dello scavo. ⚠️ La cella diceva «l'unica `floating` è un termine di CSS»: **non lo è** — è il commento sul `valid floating-point number` della specifica di `<input type="number">`, e l'unica `cone` sta dentro «*Icone*», il commento sulle icone SVG. Due parole inglesi corte dentro parole nostre, che è la ragione per cui la prova adesso cerca `floating cone` intero e i nomi degli algoritmi. |
| Pit progression monitoring | **C'È A METÀ** | ⏱️ *Prova riscritta il 09/08 (sera): nomi giusti, righe scadute (670 → 857 e 400 → 571).* `grep -c 'export function \(vitaCava\|proiezioneAnnua\)' apps/terra/terra-data.js` → **`2`**: monitorano la vita della cava (consumo annuale, residuo, anni stimati). Ma è monitoraggio della **concessione**, non del pit design: nessuna delle due confronta lo scavo con una geometria di progetto. |
| Volume reconciliation (misurato vs dichiarato) | **FALSO, C'È GIÀ** | ⏱️ *Prova riscritta il 09/08 (sera): tre numeri di riga scaduti su tre, i tre nomi giusti.* `grep -c 'export function \(riconciliazioneTurni\|misuratoPeriodo\|produzioneDichiarata\)' shared/dw-ponti.js` → **`3`**; la pagina di Terra le importa e le chiama (`grep -c riconciliazioneTurni apps/terra/index.html` → **`4`**). Confronta il volume **misurato dai rilievi** col **dichiarato dai turni di campo**. ⏱️ E dal `5b9e4e5` (09/08) la riga è ancora più falsa di prima: `serieDichiaratoTurni` e `descriviBuchiTurni` distinguono i **tre modi** in cui un punto del confronto può mancare, invece di chiamarli tutti «i turni non hanno dichiarato niente». |
| Conformità design | ⏱️ **SCADUTA — C'È DAL 01/08** (verifica `e9f9b0d` 16:20 → costruito `e19e196` 18:22) | ⏱️ *Rilanciata il 09/08 (sera): regge alla lettera.* Allora zero occorrenze di `conformit`; oggi `grep -c 'export function \(statoConformitaQuota\|conformitaQuota\|conformitaProgetto\)' apps/terra/terra-data.js` → **`3`**. «Stiamo scavando dove il progetto dice?» è la domanda dell'ente, e l'app sa rispondere. |
| Gestione concessione regionale | **C'È A METÀ** | ⏱️ *Prova riscritta il 09/08 (sera): la cella citava SEI righe e le occorrenze sono QUATTRO — il numero di riga era scaduto e per giunta ne prometteva due che non esistono.* `grep -ciE 'materia regionale' apps/terra/terra-data.js apps/terra/index.html` → **`2` e `2`**: due nel modulo dati (il commento sulla regola di legge cablata e quello sugli oneri a carico dell'utente) e due nella pagina (comunicazione annuale e documentazione di rilievo). L'app **dichiara** che modello, termini e destinatari sono materia regionale e li fa impostare all'utente; `vitaCava` resta generico, senza nessuna regola per regione. |
| Compliance reporting per ente | **C'È A METÀ** | ⏱️ *Prova riscritta il 09/08 (sera): nomi giusti, righe scadute — e per una beffa il `857` che indicava `baseOnereEscavazione` è oggi la riga di `vitaCava`, cioè un numero che punta a una funzione VERA e SBAGLIATA.* `grep -c 'export function \(riepilogoAnnuale\|baseOnereEscavazione\)' apps/terra/terra-data.js` → **`2`**: producono i dati per la denuncia annuale (volumi per mese e per fronte, qualità, banda d'incertezza, onere di escavazione). E la pagina lo dichiara con parole sue — `grep -c 'non compila la denuncia al posto tuo' apps/terra/index.html` → **`1`**. I dati ci sono; il modulo ufficiale lo compila l'utente. |

### ⏱️ Riverifica del 06/08 — `e9f9b0d` → `b12c87f`, sedici commit dopo

Le quattro righe **CONFERMATE ASSENTI** sono state rimisurate contro il codice
di oggi, perché un «non c'è» invecchia: **reggono tutte e quattro.** I sedici
commit intercorsi hanno toccato Terra sui documenti che escono (dichiarazione
«dati di esempio» sul prospetto e sul verbale, marchio sul nome dei CSV, la
decisione salita in `shared/`) e sul volume illeggibile che usciva come cella
vuota — niente che assomigli a cut&fill, pit design, stockpile detection o
floating cone.

⚠️ **E la riverifica ha rischiato di dire il contrario, per colpa del
cercatore, non del codice.** Il primo giro di `grep` — `cut\b|fill\b|taglio|
riempimento` — ha risposto **21 occorrenze in `terra-data.js`, 33 nella pagina,
5 in `dw-ponti.js`**, e letto così avrebbe fatto scrivere «la riga è scaduta,
adesso c'è». Guardando **che cosa** aveva trovato invece del solo numero:

```
$ grep -oiE "cut[a-z]*|fill[a-z]*|taglio|riempiment[oi]" apps/terra/terra-data.js | sort | uniq -c
     …  taglio        ← sempre dentro «det·taglio·» e «ri·taglio·»
      1 cute
$ grep -oiE "floating|cone[a-z]*" apps/terra/terra-data.js apps/terra/index.html
      1 floating      ← dentro un commento sui numeri a virgola mobile
      1 cone          ← dentro «I·cone·», il commento sulle icone SVG
```

Zero occorrenze vere. È la stessa famiglia già scritta in CLAUDE.md — *il
controllo che non guarda dove crede* — nella sua forma più banale e più facile
da rifare: **un conto senza il suo campione non è una misura.** La difesa costa
un comando: `grep -o` e `uniq -c` prima di credere al numero.

⏱️ **E il conto di `taglio` è stato tolto da questo blocco il 09/08, perché
invecchiava da solo:** era `24`, poi `26` più un `TAGLIO` maiuscolo, senza che
niente di quel mestiere entrasse nell'app — è la parola *dettaglio* che cresce
insieme ai commenti. La forma che sopravvive è quella che il campione già
mostrava: **si scrive CHE COSA sono le occorrenze, non quante.** Il comando che
resta buono a qualunque conto, perché guarda le **parole intere**:
`grep -owiE 'taglio' apps/terra/terra-data.js apps/terra/index.html` → nel modulo
dati **nessuna**, nella pagina soltanto due mestieri e **nessun volume**: la
classe CSS `dwg-taglio`, che è un tratteggio, e «il taglio a due righe», che è
il `-webkit-line-clamp` delle liste. La caratterizzazione resta vera quando il
numero cambia; il numero no.

**Riepilogo verifica:**
- **Righe verificate:** 11
- **Confermate assenti:** 4 (cut/fill, automatic detection, pit design, floating cone)
- **False (c'è già):** 2 (reserve estimation, volume reconciliation)
- **⏱️ Scadute:** 2 (bench-by-bench → `ripartizioneBanchi`, 35 minuti dopo; conformità → `conformitaProgetto`)
- **C'è a metà:** 3 (pit progression, concessione regionale, compliance reporting)

⏱️ **Rilancio del 09/08 (sera) — undici righe su undici, ZERO verdetti mossi,
SETTE prove riscritte.** I quattro numeri qui sopra non cambiano: sono gli
stessi che `numeri-nei-documenti.mjs` conta leggendo questo file, e sono ancora
`4 + 2 + 2 + 3 = 11`. Quello che è cambiato è **come sono provati**, e le cause
sono tre, tutte e tre di invecchiamento e nessuna di merito:

| che cosa non si riproduceva più | dove | perché |
|---|---|---|
| **12 numeri di riga su 12** (i nomi erano giusti tutti e dodici) | bench-by-bench, reserve estimation, pit progression, volume reconciliation, concessione regionale, compliance reporting | il file cresce: `riservaResidua` da 384 a 555, `vitaCava` da 670 a 857, `misuratoPeriodo` da 211 a 227. E `857`, che indicava `baseOnereEscavazione`, oggi è la riga di `vitaCava`: un numero scaduto che punta a una funzione **vera e sbagliata** è peggio di uno che punta al vuoto |
| **il conto di un termine largo** (`fill` 16 → 17, `taglio`+`riempimento` 8 → 7) | cut & fill, e il campione del blocco 06/08 | nessuno di quei caratteri è un volume: sono `.vita-fill`, `fill:none`, «det·taglio·». Un conto su una parola comune si muove **da solo** |
| **due caratterizzazioni false** | cut & fill (`fillStyle`), floating cone («un termine di CSS») | `fillStyle` in Terra non c'è mai stato — `grep -c fillStyle apps/terra/terra-data.js apps/terra/index.html` → `0` e `0`, vive in Genesi; e l'unica `floating` è il `valid floating-point number` di `<input type="number">`, non CSS |
| **una prova che smentiva il proprio verdetto** | bench-by-bench | la cella diceva «SCADUTA — c'è dal 01/08» e portava ancora la prova di **prima** che fosse costruito («il tracking è per fronte, non per banco»). Chi aggiornò il verdetto non aggiornò la prova |

⚠️ **Nessuna delle sette era una verifica sbagliata**, ed è il punto: erano
vere quando sono state scritte. A marcire è il **modo in cui erano scritte** —
un numero di riga, un conteggio di una parola comune, un esempio citato a
memoria. La forma che regge, e che qui è stata adottata su tutte e undici, è
quella misurata il 09/08 su Scudo: **un comando eseguibile con la sua uscita**
(`grep -ciE 'a|b|c' file` → `0` e `0`), **termini lunghi e tecnici** (`floating
cone`, `waste dump`, `point cloud`: in un testo italiano non collidono con
niente), **mai un numero di riga**, e dove il termine è per forza largo si
scrive **che cosa sono** le occorrenze invece di **quante**.

⚠️ **E i quattro comandi nuovi sono stati provati a fallire prima di essere
scritti**, perché un `grep` che risponde `0` risponde `0` anche quando è cieco:
rimessi in una copia del modulo quattro `export function` finte
(`volumeCutAndFill` con «end-area» e «sterro e riporto», `rilevaStockpile` con
«point cloud» e «segmentation», `pitDesign` con «waste-dump» e «haul-road»,
`floatingCone` con «Lerchs-Grossmann» e «ultimate pit»), tutti e quattro passano
da **0 a 1**. La copia è stata cancellata subito e il file vero non è mai stato
toccato.

⛔ **E QUELLA CONTROPROVA HA BOCCIATO LA PRIMA STESURA, con un difetto che vale
più delle sette prove riscritte: UNA PIPE SCAPPATA PER IL MARKDOWN SPEGNE
L'ALTERNANZA DI UN `grep -E`.** Dentro una cella di tabella il carattere della
pipe va scritto con la barra davanti, se no chiude la colonna — quindi i quattro
comandi erano nati come `grep -ciE 'cut.?and.?fill\|cutfill\|…'`. Ma in una
espressione regolare **estesa** quella barra-pipe non è l'alternanza: è una
**pipe letterale**. Il comando cercava la stringa `cut.?and.?fill|cutfill|…`
tutta intera, che non esiste da nessuna parte, e rispondeva **`0` e `0`** —
cioè esattamente l'uscita che il documento dichiara come prova dell'assenza.
Misurato sul file iniettato: **`0` anche lì**, dove il termine c'era.
La correzione è togliere `-E`: in una regolare **di base** la barra-pipe *è*
l'alternanza e `\?` è l'opzionale, quindi la forma che il markdown pretende è
anche quella giusta. Le altre otto celle usavano già `grep -c` in quella
sintassi ed erano sane.
⚠️ La lezione oltre al caso: **un comando che viaggia dentro un documento
attraversa la sintassi del documento**, e la tabella markdown è un secondo
linguaggio che riscrive il primo. Un `grep` copiato da una cella non è il `grep`
che chi l'ha scritto ha lanciato — a meno che non lo si rilanci **dalla cella**,
che è quello che ha preso questo. Senza la controprova sarebbero entrate quattro
prove d'assenza **cieche**, con l'uscita giusta per la ragione sbagliata.

**Mancanza confermata più importante:** Automatic cut/fill volume calculation (riga 1, ricorrenza 6/13 concorrenti) — nessuna progettazione automatica del pit da disegno. Terra accetta lotti manualmente, non li genera da topografia.
