# Genesi — ricerca luglio 2026: cosa manca davvero e cosa conviene fare

_Per Giuseppe · 27/07/2026 · documento di sola ricerca (nessuna modifica al codice)._

**Come leggere questo documento.** Su Genesi esiste già molta ricerca
(`GENESI_FONTI_SCIENTIFICHE.md`, `GENESI_ROADMAP_COMPETITOR.md`,
`GENESI_VS_COMPETITOR_MATRICE.md`, `GENESI_FRAMMENTAZIONE_DA_FOTO.md`,
`GENESI_OPENSOURCE_EMULAZIONE.md`, `DEEPWORK_DRONE_FLUSSO.md`,
`apps/genesi/PIANO_3D.md`). Qui **non** si rifà quel lavoro: le formule
scientifiche sono già verificate e non si rimettono in discussione. Questo
documento guarda **solo alle cose non ancora coperte**, e propone passi
concreti fattibili in un'app che gira nel browser, senza spese e senza
hardware.

**Onestà, una volta per tutte.** I concorrenti (Orica, Maptek, Maxam,
Austin, BME, 3GSM, O-Pitblast) hanno decenni di volate reali, team di
ingegneri, hardware in cava e assistenza. Le proposte qui sotto sono
**passi**, non un pareggio. Alcune migliorano davvero l'app; nessuna la
mette alla pari con loro.

---

## 1. Cosa Genesi ha GIÀ (sintesi, per non riproporlo)

Verificato leggendo `apps/genesi/genesi.html` (~3.400 righe) e i documenti
esistenti:

**Progetto e geometria**
Maglia fori 2D con editor (disegno, spostamento, ispettore per foro),
banco/burden/spaziatura/inclinazione/sottoperforazione/borraggio, fronte e
piede modellabili a mano (profilo deviato), decking fino a 3 cariche per
foro, presplit, import di una mesh reale del fronte (OBJ) e visore nuvola
di punti.

**Previsioni**
Frammentazione Kuz-Ram + KCO/Swebrec con curva granulometrica; rock factor
di Lilly calcolato dalla caratterizzazione dell'ammasso; vibrazioni PPV con
legge di Devine e carica massima per ritardo su finestra 8 ms; airblast;
flyrock (diretto e inverso, con anelli di sgombero); fori bagnati;
detonatori elettronici vs elettrici con la loro dispersione.

**Timing e cumulo**
Quattro sequenze (riga, diagonale/echelon, V-cut, box), tempo di
detonazione calcolato foro per foro, badge di controllo sul ritardo
inter-foro e inter-fila espressi in **ms per metro di burden**, forma e
gittata del cumulo con l'**angolo isocrono** e la direzione di
spostamento, animazione 3D della sequenza.

**Chiusura del cerchio e uscite**
Riconciliazione previsto-vs-reale (inserimento a mano + storico),
signature-hole semplificato (somma dell'onda ritardata da un CSV),
confronto A/B tra progetti, stima economica della volata, report
stampabile in PDF, esportazioni CSV, import MWD, export/import XML in
stile IREDES (dichiarato come bozza, non conformità certificata).

Tradotto: **Genesi è già un buon simulatore**. Quello che gli manca non è
"altra fisica", ma soprattutto **strumenti di lettura del progetto** (mappe
e diagnosi che dicono *dove* il progetto è debole) e **modi per farsi
correggere dal dato reale**.

---

## 2. I gap veri, in ordine di valore

### Gap A — Genesi dice "quanto", non dice "dove" (il gap più grande)

Oggi Genesi ti dà **un numero per l'intera volata**: un powder factor, un
burden, un ritardo per metro. I software professionali danno invece
**mappe**: contorni del timing, contorni del burden relief, contorni
dell'energia, diagramma del burden foro per foro. È la differenza tra "la
volata ha 0,35 kg/m³" e "**questi tre fori in fondo a destra hanno il
doppio del burden degli altri: lì avrai blocchi e rischio flyrock**".

Chi lo fa: Blastmap (BME) con i contorni di timing, elevazione, vibrazione
ed energia; 2DBench/JKSimBlast con contorni di detonazione, burden relief e
danno; SHOTPlus con l'assegnazione automatica dei ritardi in base al burden
relief; BlastLogic con i contorni di timing usati proprio per **dedurre la
direzione di movimento della roccia**; Paradigm con i contorni di timing,
vibrazione, sovrappressione e flyrock nel report.

Perché ci riguarda tanto: Genesi **ha già tutti i dati che servono**
(posizione di ogni foro, tempo di detonazione di ogni foro, carica di ogni
foro). Manca solo il disegno delle isolinee sopra la pianta. È il caso più
raro e più prezioso: **valore alto, dato nuovo zero**.

### Gap B — nessuna calibrazione automatica sui numeri veri della cava

La riconciliazione esiste, ma è un confronto grezzo su numeri inseriti a
mano: **non corregge nulla**. Nella pratica professionale il passo che
conta è l'opposto: si prendono le misure reali (in particolare le
registrazioni del sismografo, che molte cave già producono per obbligo o
per prassi verso i vicini) e si **ricava la legge di sito**, cioè i valori
K e β della formula delle vibrazioni per **quella** cava, con una
regressione sui punti misurati (distanza scalata, PPV misurato). Da lì in
poi le previsioni smettono di essere "valori tipici da manuale" e
diventano "il comportamento della tua roccia".

Genesi oggi usa K e β stimati dal tipo di roccia, e lo dichiara
onestamente. Ma **non ha il pezzo che li sostituisce col dato vero**,
anche se la matematica è banale (una regressione lineare sui logaritmi).

### Gap C — il burden reale, foro per foro, contro il fronte vero

Il fronte di cava non è mai un piano. I software dedicati al profilo del
fronte (LTI Face Profiler, 3GSM BlastMetriX, FACE 3-D) fanno esattamente
una cosa: per **ogni** foro producono un **diagramma del burden lungo la
profondità**, cioè quanta roccia c'è davanti alla carica a 2 m, a 5 m, a 8
m. È il modo con cui in cava si evitano i due problemi opposti: burden
troppo grande (blocchi, zoccoli al piede) e burden troppo piccolo
(**flyrock**, che è il rischio serio per le persone).

Genesi modella la deviazione del fronte e del piede, ma **il burden resta
un numero unico di progetto**. Questo è il gap più utile in cava e anche
il più delicato: un numero sbagliato qui è un rischio per il fochino.

### Gap D — la perforazione reale non è mai come il progetto

La letteratura è concorde: esistono tre famiglie di errore — **collaring**
(il foro parte spostato rispetto al punto previsto), **allineamento**
(angolo e direzione sbagliati) e **traiettoria** (il foro "scappa" mentre
scende, spesso seguendo la stratificazione). Gli effetti misurati sono
grossi: con una deviazione da 0,1 a 0,5 m la pezzatura media cambia
sensibilmente, e uno spostamento di 0,4 m può togliere circa il 28%
dell'energia esplosiva in un punto; il costo accessorio di perforazione
cresce di più del doppio passando da un 7% a un 21% di gradiente di
deviazione. Il problema classico degli **zoccoli al piede (toe)** è nella
maggior parte dei casi **sottoperforazione insufficiente** su uno o pochi
fori (riferimento pratico di letteratura: sottoperforazione dell'ordine
del 30% del burden).

Misurare la deviazione richiede uno strumento in foro (boretrak): **non è
alla nostra portata**. Ma **simulare** l'effetto di una precisione di
perforazione dichiarata è alla nostra portata al 100%, e nessun dato nuovo
serve.

### Gap E — interoperabilità: parliamo solo la nostra lingua

Genesi esporta CSV e un XML in stile IREDES (bozza). Nel mondo reale la
lingua franca è più prosaica: **DXF** (tutti — Vulcan, Surpac, SHOTPlus,
BlastLogic — importano ed esportano DXF), CSV di coordinate, e per le
perforatrici **IREDES**, che è uno standard XML aperto ma i cui documenti
completi sono a pagamento per i non soci. Aggiungere il DXF è poco lavoro
e apre la porta a chiunque usi un CAD.

### Gap F — nessun riferimento normativo italiano nell'app

Genesi è un'app italiana per cave italiane e **non nomina mai** il quadro
normativo in cui il cliente lavora: DPR 128/1959 (polizia delle miniere e
delle cave), TULPS artt. 46-47 per le licenze di deposito esplosivi,
D.Lgs. 81/2008 per la sicurezza sul lavoro. Non serve — e sarebbe
pericoloso — che l'app dia istruzioni operative o distanze di sgombero
"da norma". Serve invece che dica con chiarezza **quali riferimenti
esistono e a chi chiedere**, e che ripeta che le stime di flyrock non
sostituiscono le distanze stabilite dal responsabile e dall'autorità.

### Gap G — cose che restano fuori portata (e vanno dette)

- **Frammentazione misurata da foto**: già analizzata a fondo nel
  documento dedicato. Conclusione invariata: la misura assistita
  dall'operatore è onesta e fattibile; l'automatismo affidabile no. Nella
  ricerca di oggi non è emerso nessun progetto **open source** maturo di
  analisi granulometrica del cumulo: i sistemi citati in letteratura
  (WipFrag, Split-Desktop, Fragalyst, IPACS, Fragscan) sono commerciali, e
  i limiti sono fisici — sotto i 2,5-3 cm la foto non vede, e la terza
  dimensione del cumulo non c'è. Le vie moderne (SAM, ricostruzione 3D
  multi-vista) sono ricerca, non prodotto gratuito.
- **Movimento del banco / grade control** (sensori BMT), **detonatori
  elettronici programmati davvero**, **MWD in tempo reale dalle
  perforatrici**: richiedono hardware. Fuori portata, punto.
- **Modelli AI addestrati**: richiedono un dataset di volate reali che non
  abbiamo. Il posto giusto per l'AI arriverà **dopo** aver raccolto dati
  con la riconciliazione, non prima.

---

## 3. Tabella delle proposte

Legenda difficoltà: **S** = piccola (poche ore/un giorno) · **M** = media
(qualche giorno) · **L** = grande (una settimana o più).
Colonna "dati": ✅ = si fa **subito con dati sintetici**, cioè col progetto
che l'utente già inserisce · 🛰️ = dà il meglio **solo col rilievo reale**
(drone/nuvola di punti) · 📄 = servono **misure che il cliente già
possiede** (referti del sismografo, vagliature), non hardware nuovo.

| # | Nome | Cosa fa | Perché serve | Diff. | Prio | Dati |
|---|---|---|---|---|---|---|
| 1 | **Mappa dei contorni isocroni** | Disegna sulla pianta 2D le isolinee dei tempi di detonazione (passo scelto dall'utente) e una freccia della direzione di sviluppo | È il modo standard di *vedere* se la sequenza si apre correttamente; rende visibili errori di timing che oggi restano numeri. Genesi ha già i tempi di ogni foro: è solo disegno | M | **P0** | ✅ |
| 2 | **Burden relief foro per foro** | Per ogni foro: tempo di sparo ÷ distanza dalla faccia libera = ms/m disponibili a *quel* foro; colora i fori fuori range e li elenca | Oggi il controllo ms/m è un unico numero medio: nasconde i fori che sparano prima di avere spazio libero (blocchi, picchi di vibrazione, flyrock). Riferimenti di letteratura: ~8-14 ms/m tra prima e seconda fila, ~5 ms/m tra le ultime, regola pratica ~3 ms per piede di burden tra fori | M | **P0** | ✅ |
| 3 | **Legge di sito da misure vere (K e β)** | Tabella dove si inseriscono le misure reali del sismografo (distanza, carica per ritardo, PPV misurato); Genesi calcola la regressione e propone K e β **della cava**, con l'errore | È il salto da "valori tipici da manuale" a "la tua roccia": il passo che i professionisti considerano obbligatorio. Matematica banale (regressione sui logaritmi), tutta nel browser | M | **P0** | 📄 |
| 4 | **Diagramma del burden per foro lungo la profondità** | Dal profilo del fronte (disegnato a mano o importato dal rilievo) calcola il burden reale a più quote per ogni foro; segnala i fori sotto/sopra soglia | È la funzione centrale dei software di profilatura del fronte, e tocca direttamente il rischio flyrock e gli zoccoli al piede | L | **P1** | 🛰️ (utile anche ✅ come "cosa succederebbe se") |
| 5 | **Banda d'incertezza da precisione di perforazione** | L'utente dichiara la precisione attesa (errore di collaring in cm, deviazione in % per metro); Genesi rifà i conti molte volte con errori casuali e mostra la **banda** su burden, powder factor, x50 e gittata flyrock | Onesto e didattico: mostra che il progetto "perfetto" non esiste e quanto costa una perforazione imprecisa. Non richiede boretrak né alcun dato nuovo | M | **P1** | ✅ |
| 6 | **Mappa dell'energia (powder factor locale)** | Assegna a ogni foro la sua area di competenza e calcola il kg/m³ *locale*, poi lo colora sulla pianta | Rende visibili le zone sotto-caricate (blocchi, zoccoli) e sovra-caricate (flyrock, backbreak). Solo geometria, nessuna fisica nuova | M | **P1** | ✅ |
| 7 | **Diagnostica errori di perforazione** | Pannello che parte dal sintomo osservato (zoccoli, blocchi in fondo, backbreak, colletti aperti) e mostra le cause probabili con il parametro di Genesi da controllare | Piccolo, sicuro (è didattica, non un comando), e utile a un fochino vero. Sfrutta i badge già presenti (sottoperforazione, borraggio/B, S/B, H/B) | S | **P1** | ✅ |
| 8 | **Import/export DXF della maglia** | Esporta i fori come DXF (e li reimporta) accanto a CSV e XML | DXF è la lingua franca dei CAD e dei software minerari: apre l'interoperabilità con poco lavoro | S | **P1** | ✅ |
| 9 | **Riferimenti normativi italiani** | Scheda con i riferimenti generali (DPR 128/1959, TULPS artt. 46-47, D.Lgs. 81/2008) e i link, più l'avvertenza fissa che le stime dell'app non sostituiscono le decisioni del responsabile e dell'autorità | Genesi parla a cave italiane e oggi tace su questo. **Solo riferimenti e link**: nessuna istruzione operativa, nessuna distanza "da norma" calcolata dall'app | S | **P1** | ✅ |
| 10 | **Stima del backbreak (danno al fronte residuo)** | Indicatore di rischio di rottura oltre l'ultima fila, dai parametri già presenti (burden dell'ultima fila, borraggio, ritardo inter-fila, energia) | Il backbreak è un problema costoso e di sicurezza (stabilità del fronte alto); la letteratura concorda sui fattori (burden e borraggio eccessivi lo peggiorano, ritardi lunghi lo riducono) | M | P2 | ✅ (calibrazione: 📄) |
| 11 | **Calibrazione di sito dell'x50 dalla riconciliazione** | Dopo N volate riconciliate, propone un fattore correttivo sull'x50 previsto per quella cava | Chiude il cerchio della riconciliazione. **Attenzione: tocca il motore fisico** → non si fa senza il tuo via libera esplicito | M | P2 | 📄 |
| 12 | **Archivio timing riutilizzabile** | Salva e richiama schemi di ritardi collaudati come "modelli" per volate simili | Comodità, non scienza. Utile quando ci saranno più volate in archivio | S | P2 | ✅ |

### Nota importante sulle proposte 4 e 5 (sicurezza)

La proposta 4 (burden reale per foro) è la più preziosa **e** la più
delicata: un burden calcolato male produce un avviso di flyrock sbagliato.
Il modo onesto di spedirla è **come diagnosi, non come istruzione**:
mostrare il burden calcolato e da quale profilo viene, evidenziare i fori
anomali, e ripetere che la decisione operativa resta del responsabile.
Coerente con la scelta già fatta di non spedirla finché non la si prova su
un fronte reale della tua cava (documentata in `GENESI_NUOVE_FUNZIONI.md`).

Lo stesso vale per la 5: la banda d'incertezza va presentata come **"quanto
può sbagliare la previsione"**, mai come "ecco il valore vero".

### Cosa NON proporre

- Riscrivere il motore fisico: già verificato, si lascia stare.
- Inseguire l'analisi automatica della frammentazione da foto: già
  deciso, e la ricerca di oggi conferma che non esiste una via open source
  matura.
- Qualunque cosa richieda hardware (boretrak, sensori di movimento,
  detonatori programmabili, MWD live) o un backend a pagamento.

---

## 4. Ordine di lavoro consigliato

1. **Proposte 1 + 2 insieme** (contorni isocroni + burden relief per
   foro): stesso pezzo di codice, stesso disegno, e insieme trasformano il
   timing da "numero" a "mappa". È il miglior rapporto valore/lavoro di
   tutto l'elenco, e non serve nessun dato nuovo.
2. **Proposta 3** (legge di sito K e β): il primo vero ponte verso il dato
   reale, usando referti che le cave già hanno.
3. **Proposte 6, 7, 8, 9**: quattro pezzi piccoli e sicuri che alzano la
   qualità percepita dell'app.
4. **Proposta 5**, poi **4** (quest'ultima solo con un fronte reale su cui
   provarla e con la tua conferma).
5. Le P2 dopo, e la 11 **solo** con il tuo via libera esplicito.

---

## 5. Fonti

**Profilo del fronte e burden per foro**
- LTI LaserSoft Face Profiler: https://lasertech.com/product/face-profiler/
- Face Profiler (Mining Technology): https://www.mining-technology.com/products/faceprofiler-blast-analysis/
- 3GSM BlastMetriX (profilo e diagramma di burden per ogni foro): https://3gsm.at/learning/blastmetrix-blast-design-software-redefined/
- Face profiling e logging dei fori (Health & Safety Authority, IE): https://www.hsa.ie/eng/your_industry/quarrying/drilling_and_blasting/face_profiling_and_drill_hole_logging/

**Timing, contorni isocroni, burden relief**
- BME Blastmap (contorni di timing, burden relief, energia): https://bme.co.za/blast-alliance/blastmap/
- Maptek BlastLogic — Timing contours: https://help.maptek.com/blastlogic/2023/topics/menus-and-tools/analysis/timing.htm
- Orica SHOTPlus: https://www.orica.com/Products---Services/Mining-Services/BlastIQ/Technologies/shotplus
- Austin Paradigm (report con contorni di timing/vibrazione/flyrock): https://paradigm.austinpowder.com/
- JKSimBlast / 2DBench (contorni di detonazione, burden relief, danno): https://www.soft-blast.com/Software/JKSimBlast.html
- Selezione dei ritardi inter-foro e inter-fila basata sul burden relief (PDF): https://miningandblasting.wordpress.com/wp-content/uploads/2009/09/selection-of-inter-hole-and-inter-row-timing-based-on-burden-relief-analysis.pdf
- Effetti del timing sulla frammentazione (PDF): https://miningandblasting.wordpress.com/wp-content/uploads/2009/09/timing-effects-on-fragmentation.pdf
- Effetto del ritardo delle file posteriori su frammentazione e forma del cumulo: https://www.researchgate.net/publication/342013600_THE_EFFECT_OF_BACK_ROWS_DELAY_TIMING_AND_SIZE_OF_BLAST_ON_FRAGMENTATION_AND_MUCKPILE_SHAPE_PARAMETER
- USBR — Chapter 19, Blast Design (manuale pubblico): https://www.usbr.gov/tsc/techreferences/mands/geologyfieldmanual-vol2/Chapter19.pdf
- OSMRE — Surface Blast Design (modulo formativo pubblico): https://www.osmre.gov/sites/default/files/inline-files/Module3_0.pdf

**Sequenze V-cut ed echelon**
- V-Type firing pattern, evidenze sulla frammentazione migliorata: https://www.researchgate.net/publication/369255510_V-Type_Firing_Pattern_in_Blasting_Evidence_to_Substantiate_the_Improved_Fragmentation
- Analisi sperimentale di frammentazione, vibrazione e movimento della roccia: https://www.researchgate.net/publication/39425264_Experimental_analysis_of_fragmentation_vibration_and_rock_movement_in_open_pit_blasting

**Deviazione dei fori ed errori di perforazione**
- Hole deviations in mining operations: types, sources and effects: https://www.researchgate.net/publication/289833523_Hole_deviations_in_mining_operations_Types_sources_and_effects
- Effects of blast-hole deviation on drilling and muck pile loading cost: https://www.researchgate.net/publication/281936796_Effects_of_Blast-Hole_Deviation_on_Drilling_and_Muck_Pile_Loading_Cost
- Correlazione deviazione / pezzatura / costo di frammentazione: https://www.researchgate.net/publication/283476143_Correlation_of_Blast-hole_Deviation_and_Area_of_Block_with_Fragment_Size_and_Fragmentation_Cost
- Effetto delle caratteristiche dell'ammasso sulla deviazione: https://researchgate.net/publication/268802774_The_effects_of_rock_mass_characteristics_on_blast_hole_deviation
- Pratiche di brillamento per controllare il piazzale e correggere gli zoccoli (Agg-Net): https://www.agg-net.com/resources/articles/drilling-blasting/blasting-practices-to-control-quarry-floors-and-correct-toes
- Toeing the line (Quarry Magazine): https://www.quarrymagazine.com/2020/01/31/toeing-the-line-blasting-practices-to-control-quarry-floors-correct-toes/
- P&Q University Lesson 4 — Drilling & Blasting: https://www.pitandquarry.com/pq-university-lesson-4-drilling-and-blasting/

**Movimento del cumulo**
- Modelling blast movement and muckpile formation (position-based dynamics): https://www.tandfonline.com/doi/full/10.1080/17480930.2020.1835210
- Blast movement modelling and measurement: https://www.researchgate.net/publication/289118692_Blast_movement_modelling_and_measurement
- Blasted muckpile modelling in open pit mines (PDF): https://ijmge.ut.ac.ir/article_95683_ff847dd6620727176c72cccf928ddeff.pdf

**Monitoraggio vibrazioni e integrazione col progetto**
- Instantel / Orica — come i modelli di calcolo usano i dati del sismografo: https://www.instantel.com/orica
- GeoSonics/Vibra-Tech — gestione dati di monitoraggio: https://www.geosonicsvibratech.com/faqs/vibration-monitoring-and-data-management-solutions-for-mine-management/
- White Industrial Seismology — Alpha-Blast (analisi dati sismografo): https://whiteseis.com/seismograph-products/seismograph-data-analysis-software/alpha-blast-software/
- Blast Vibration Basics (divulgativo): https://tbredblast.com/posts/blastvibration3

**Riconciliazione post-volata**
- Maptek BlastLogic: https://www.maptek.com/products/blastlogic/
- Orica BlastIQ: https://www.orica.com/products---services/blasting/blastiq/home
- Hexagon — mine blast data management: https://hexagon.com/solutions/mine-blast-data-management
- K-MINE drill & blast (passaporto del foro, riconciliazione): https://k-mine.com/mining-software/drill-blast-design/
- O-PitSurface / O-PitAnalytics: https://teamarmaan.com/o-pitsurface/

**Frammentazione da immagine (stato dell'arte)**
- WipFrag: https://wipware.com/products/wipfrag/
- Fragmentation analysis con WipFrag (studio): https://www.researchgate.net/publication/360937989_Fragmentation_Analysis_of_Blasted_Rock_Using_WipFrag_Image_Analysis_Software
- Analisi granulometrica del cumulo con scale sferiche multiple: https://www.sciencedirect.com/science/article/abs/pii/S0263224124016610
- Stima della frammentazione da nuvola di punti 3D con deep learning: https://www.mdpi.com/2076-3417/13/19/10985
- (vedi anche il documento dedicato `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md`)

**Backbreak / danno al fronte**
- Blasting e stabilità del fronte alto: https://www.sciencedirect.com/science/article/pii/S2095268618306578
- Nuova metodologia per prevedere il backbreak: https://www.sciencedirect.com/science/article/abs/pii/S136516091200247X
- Practical assessment of rock damage due to blasting: https://www.researchgate.net/publication/329137963_Practical_assessment_of_rock_damage_due_to_blasting

**Scambio dati e formati**
- IREDES — architettura dello standard: https://iredes.org/architecture-2/
- IREDES (voce enciclopedica): https://en.wikipedia.org/wiki/IREDES
- Maptek Vulcan — export verso IREDES: https://help.maptek.com/vulcan/2025/Content/topics/Drill_and_Blast/Analysis_and_Reporting/DrillandBlast_Export_to_IREDES.htm
- Trimble — import di file IREDES (.xml): https://help.fieldsystems.trimble.com/tbc/12438.htm
- Orica — import fori in SHOTPlus (Surpac .str, DXF): https://support.blastiq.com/hc/en-us/articles/360026681454-How-to-import-blast-holes-into-SHOTPlus-Underground
- Maptek BlastLogic — dati e formati: https://help.maptek.com/blastlogic/2022/topics/menus-and-tools/home/data.htm

**Riferimenti normativi italiani (solo generali, nessuna istruzione operativa)**
- DPR 9 aprile 1959 n. 128 — Norme di polizia delle miniere e delle cave (testo): https://www.tuttoprevenzioneincendi.it/images/Norme/DPR_09_04_1959_n_128.pdf
- DPR 128/1959 (copia regionale, PDF): https://pugliacon.regione.puglia.it/documents/72607/118877/AE_LEX_IT_04_DPR128_59.pdf
- Regione Toscana — schema di procedura di sicurezza per l'uso di esplosivi in cava: https://www301.regione.toscana.it/bancadati/atti/Contenuto.xml?id=5138049&nomeFile=Delibera_n.64_del_31-01-2017-Allegato-A
- Polizia mineraria — Regione Piemonte (competenze e adempimenti): https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/polizia-mineraria
- Emilia-Romagna — competenze in materia di attività estrattive (PDF): https://ambiente.regione.emilia-romagna.it/it/suolo-bacino/argomenti/attivita-estrattive-e-minerarie/cave/cave-convegni/competenze-dell2019agenzia-per-la-sicurezza-territoriale-e-protezione-civile/@@download/file/20181112_4_CompetenzeProCivPoliziaMineraria_Campisi.pdf
- TULPS art. 47 (licenza prefettizia per deposito esplosivi): https://www.brocardi.it/testo-unico-pubblica-sicurezza/titolo-ii/capo-v/art47.html
- Prefettura — licenza di deposito e minuta vendita di esplosivi: https://prefettura.interno.gov.it/it/prefetture/padova/licenza-deposito-e-minuta-vendita-esplosivi-i-iv-e-v-cat
- Regolamento TULPS, allegati esplosivi (PDF): https://www.tuttoprevenzioneincendi.it/images/Norme/RD_06_05_1940_N_635_Allegati_TULPS_ESPLOSIVI.pdf

> **Avvertenza sulle fonti normative**: sono indicate **solo come
> riferimenti da consultare**, per orientarsi e per sapere a chi
> rivolgersi (autorità di polizia mineraria regionale, Prefettura). Non
> costituiscono istruzioni operative, e nessuna stima di Genesi
> (flyrock, vibrazioni, distanze) può sostituire le prescrizioni
> stabilite dal responsabile della cava e dall'autorità competente.

---

## 6. In una riga

Il vero passo avanti per Genesi non è aggiungere altra fisica, ma
**mostrare dove il progetto è debole** (mappe di timing, burden relief ed
energia — tutto già calcolabile con quello che c'è) e **farsi correggere
dai numeri veri della cava** (legge di sito K e β dai referti del
sismografo). Il resto sono passi utili ma minori; la parità coi grandi non
è in gioco e non va promessa.
