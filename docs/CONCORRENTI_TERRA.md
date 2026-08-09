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

> **Verificato contro il codice al commit `4a5175a`** *(le quattro «CONFERMATA ASSENTE» rimisurate una per una il 09/08 — i verdetti reggono, tre ricerche su quattro no; prima era `57c78cf`, riverificato l'08/08 sera;
> le precedenti erano a `8583a0b` lo stesso giorno, a `4916275` il 06/08 e a
> `e9f9b0d` il 01/08).*
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
> il browser sanitizza i decimali (`terra-data.js:275`). `cut`, `stockpile`,
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
| Cut & fill volumes | **CONFERMATO ASSENTE** | ⏱️ *Rimisurata il 09/08: il verdetto regge, la ricerca no.* `cut` e `stockpile` danno ancora **zero**, ma `fill` ora dà **16** e `taglio`/`riempimento` **8** — e nessuna di quelle occorrenze è un volume: sono **termini di disegno** (`fillStyle` della tela, la classe `dwg-taglio` che è un tratteggio, «la testa del riempimento» della barra di avanzamento). Il conto di cut & fill non c'è: nessuna funzione confronta un terreno di partenza con uno di arrivo per dire quanto si è tolto e quanto si è messo. |
| Bench-by-bench volume tracking | ⏱️ **SCADUTA — C'È DAL 01/08** (verifica `e9f9b0d` 16:20 → costruito `e5f15a7` 16:55, **35 minuti**) | `banco` esiste (terra-data.js:42-44, 1064) ma solo come campo della fronte, non c'è tracking volumetrico per banco singolo — il tracking è per fronte (volumeFronte), non per banco |
| Automatic stockpile detection | **CONFERMATO ASSENTE** | ⏱️ *Rimisurata il 09/08:* `stockpile` e `detection` **zero**. Il cumulo si dichiara a mano, non lo riconosce nessuno da una nuvola di punti. |
| Pit design e scheduling | **CONFERMATO ASSENTE** | ⏱️ *Rimisurata il 09/08:* `design` e `scheduling` **zero**; l'unica occorrenza di `pit` è dentro una parola italiana, non un termine minerario. I lotti si creano a mano, senza nessun disegno automatico della cava. |
| Reserve estimation con optimization | **FALSO, C'È GIÀ** | terra-data.js:384 `riservaResidua()` calcola la riserva residua; usata in index.html:1082-1083 per mostrare il consumo annuale — non è full optimization ma c'è stima della riserva |
| Floating cone optimization | **CONFERMATO ASSENTE** | ⏱️ *Rimisurata il 09/08:* `cone`, `conical` e `ottimizzazione` **zero**; l'unica `floating` è un termine di CSS. Nessun ottimizzatore geometrico dello scavo. |
| Pit progression monitoring | **C'È A METÀ** | terra-data.js:670 `vitaCava()` e terra-data.js:400 `proiezioneAnnua()` monitorano vita della cava (consumo annuale, residuo, anni stimati) ma non è monitoraggio del pit design — è monitoraggio della concessione |
| Volume reconciliation (misurato vs dichiarato) | **FALSO, C'È GIÀ** | shared/dw-ponti.js:185 `riconciliazioneTurni()` fa esattamente il confronto fra volumi misurati dai rilievi e dichiarati dai turni di campo; importata e usata in terra-data.js:1152 e index.html:849; confronta `misuratoPeriodo()` (dw-ponti.js:211) con `produzioneDichiarata()` |
| Conformità design | ⏱️ **SCADUTA — C'È DAL 01/08** (verifica `e9f9b0d` 16:20 → costruito `e19e196` 18:22) | Allora zero occorrenze di `conformit`; oggi `statoConformitaQuota`, `conformitaQuota` e `conformitaProgetto` in `terra-data.js`: «stiamo scavando dove il progetto dice?» è la domanda dell'ente, e l'app sa rispondere |
| Gestione concessione regionale | **C'È A METÀ** | terra-data.js:580, 722, 959, 980 e index.html:541, 819 dichiarano "materia regionale": l'app non applica regole specifiche per regione, ma l'utente le imposta. `vitaCava()` è generico, niente regole per regione |
| Compliance reporting per ente | **C'È A METÀ** | terra-data.js:751 `riepilogoAnnuale()` e terra-data.js:857 `baseOnereEscavazione()` producono i dati per la denuncia annuale (volumi per mese/fronte, qualità, banda incertezza, onere di escavazione); index.html:819 dichiara esplicitamente "Terra ti dà i tuoi numeri ordinati, non compila la denuncia al posto tuo" — i dati ci sono, il modulo ufficiale lo compila l'utente |

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
     24 taglio        ← dentro «detta·glio·»
      1 cute
$ grep -oiE "floating|cone[a-z]*" apps/terra/terra-data.js apps/terra/index.html
      1 floating      ← dentro un commento sui numeri a virgola mobile
      1 cone          ← dentro un'altra parola
```

Zero occorrenze vere. È la stessa famiglia già scritta in CLAUDE.md — *il
controllo che non guarda dove crede* — nella sua forma più banale e più facile
da rifare: **un conto senza il suo campione non è una misura.** La difesa costa
un comando: `grep -o` e `uniq -c` prima di credere al numero.

**Riepilogo verifica:**
- **Righe verificate:** 11
- **Confermate assenti:** 4 (cut/fill, automatic detection, pit design, floating cone)
- **False (c'è già):** 2 (reserve estimation, volume reconciliation)
- **⏱️ Scadute:** 2 (bench-by-bench → `ripartizioneBanchi`, 35 minuti dopo; conformità → `conformitaProgetto`)
- **C'è a metà:** 3 (pit progression, concessione regionale, compliance reporting)

**Mancanza confermata più importante:** Automatic cut/fill volume calculation (riga 1, ricorrenza 6/13 concorrenti) — nessuna progettazione automatica del pit da disegno. Terra accetta lotti manualmente, non li genera da topografia.
