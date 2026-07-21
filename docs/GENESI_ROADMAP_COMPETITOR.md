# Genesi — dove siamo vs i big, e cosa aggiungere (roadmap con fonti)

Data: 2026-07-21 · Per Giuseppe (parte semplice) e per lo sviluppo (parte
tecnica). Richiesta del fondatore (21/07): «voglio raggiungere il loro livello,
magari qualcosa in meno, ma non ci dobbiamo allontanare tanto». Questo documento
confronta Genesi con i principali software di blast-design e propone una
**roadmap concreta di funzioni**, ordinata per impatto/fattibilità, distinguendo
cosa si può fare **nel browser** (lato client) e cosa richiede un **backend**.

> Metodo: ricerca web mirata sui competitor e sulla letteratura (fonti in
> fondo). Le affermazioni sui competitor vengono dalle loro pagine prodotto e da
> articoli tecnici; le raccomandazioni per Genesi sono nostre.

## In due righe (per Giuseppe)
Genesi è già forte sulla **simulazione** (come si frammenterà la roccia, flyrock,
fori bagnati, presplit, confronto A/B, 3D da foto). I big però hanno **due cose
che a noi mancano del tutto** e che sono ormai "da manuale": la **previsione
delle vibrazioni** (per non far tremare case/vicini oltre i limiti) e la
**riconciliazione** (confronto tra come avevi progettato la volata e com'è
andata davvero). Se aggiungiamo queste due, Genesi passa da "bel simulatore" a
"strumento completo" vicino ai leader — e diverse parti sono fattibili nel
browser.

## Cosa ha GIÀ Genesi (punti di forza)
- Frammentazione: **Kuz-Ram** (con rock-factor di **Lilly**), **KCO/Swebrec**
  (x50/xmax, migliore su fini e blocco massimo).
- **Flyrock** (gittata + anelli di sgombero), **presplit**, **confronto A/B**,
  **fori bagnati** (colonna d'acqua), **import MWD**, **ricostruzione 3D da
  foto** del fronte, export CSV/PDF.

## Cosa hanno i big che a noi MANCA (i gap)
1. **Previsione vibrazioni + airblast** — Orica *Advanced Vibration Management*
   predice vibrazione e sovrappressione legando progetto, forato reale e misure;
   Maxam RIOBLAST e O-Pitblast includono moduli vibrazioni; tutta la letteratura
   usa **scaled distance/PPV (USBM)** e il metodo **signature-hole** (si registra
   un foro singolo e si "somma" la sua onda ai ritardi scelti per prevedere il
   PPV della volata intera). **Genesi non ha nulla di tutto ciò.** ← gap #1.
2. **Riconciliazione post-volata (previsto vs reale)** — Maptek BlastLogic è
   costruito attorno a "single source of truth" e al confronto design-vs-actual
   in quasi tempo reale (import **as-drilled**, ricalcolo carica da QA/QC);
   O-PitAnalytics fa post-blast analysis. **Genesi non chiude il ciclo.** ← gap #2.
3. **Validazione frammentazione da immagine** — Orica **FRAGTrack**, **WipFrag**,
   **Split**: foto del muckpile → curva granulometrica reale da confrontare con
   la previsione. Genesi già fa 3D da foto: manca il passo "misura le pezzature".
4. **Burden reale dal fronte + deviazione fori (boretrack)** — il face profiling
   laser/foto calcola il **burden vero** lungo tutta l'altezza; il **boretrak**
   misura il foro "as-drilled" (deviazione). Genesi ha il 3D del fronte ma non
   calcola il burden reale per foro né importa la deviazione.
5. **AI/ML per frammentazione/flyrock/backbreak** — ricerca recente: **XGBoost**
   il migliore per la pezzatura (R²≈0,82), ensemble ANN-RF per prevedere
   frammentazione **e** vibrazione insieme; input tipici: burden, spaziatura,
   powder factor, sottoperforazione, profondità foro, UCS. Differenziatore, ma
   pesante.
6. **Interoperabilità dati (IREDES) + export ai detonatori elettronici** — IREDES
   (XML) è lo standard per far parlare perforatrici/software; l'MWD guida la
   carica; i detonatori elettronici si programmano con i ritardi. Genesi non
   esporta in questi formati.

## Roadmap proposta (per impatto/fattibilità)

### P0 — Grande impatto, fattibile NEL BROWSER (fatelo prima)
- **P0.1 Previsione vibrazioni (scaled distance / PPV, USBM)** *(client)*: dato
  carica per ritardo (MIC = max instantaneous charge) e distanza al ricettore,
  stima il PPV con la legge `PPV = K·(D/√W)^-β` (K, β calibrabili per sito).
  Grafico PPV vs distanza, confronto con i limiti di legge, badge verde/rosso.
  Tutto matematica → **nessun backend**. Chiude il gap #1 al 70%.
  (Sinergia: Sentinella ha già la distanza scalata per evento — riusare la
  stessa formula/coefficienti per coerenza.)
- **P0.2 Airblast (sovrappressione dB)** *(client)*: stima l'air-overpressure con
  la cube-root scaled distance; stessa UI del PPV. Piccolo, completa P0.1.
- **P0.3 Timing helper + finestra di sicurezza vibrazioni** *(client)*: dato il
  disegno, evidenzia i ritardi che fanno "sommare" i fori vicini nel tempo
  (rischio picco). Base semplice della logica signature-hole senza ancora la
  registrazione dell'onda.

### P1 — Grande impatto, fattibile nel browser con più lavoro
- **P1.1 Signature-hole (superposizione d'onda)** *(client, se il sismogramma è
  un file)*: importa la registrazione di un foro singolo (CSV/tempo-ampiezza) e
  **somma le copie ritardate** secondo i ritardi della volata → predice la
  forma d'onda e il PPV atteso. È il metodo dei big; il calcolo (convoluzione)
  gira benissimo in JS. Backend NON necessario per il calcolo; serve solo per
  archiviare le firme storiche.
- **P1.2 Riconciliazione previsto-vs-reale** *(client per il confronto, backend
  leggero per lo storico)*: schermata che affianca, per ogni volata, il
  **previsto** (x50, PPV, flyrock) e il **reale** inserito a mano o importato
  (pezzatura, vibrazione misurata, note). Riusa il ponte Genesi↔Campo già
  esistente. Chiude il gap #2. Lo storico multi-volata conviene salvarlo
  (Firestore, come già fanno le app).
- **P1.3 Burden reale dal 3D del fronte** *(client)*: da 3D-da-foto già presente,
  calcola la distanza foro↔fronte (burden vero) lungo l'altezza e segnala i
  fori con burden fuori range (rischio oversize o flyrock). Incrementale sul 3D
  esistente.

### P2 — Differenziante ma pesante (dopo, richiede backend/dati)
- **P2.1 Frammentazione da immagine del muckpile** *(client base / backend per
  ML)*: foto del cumulo → segmentazione blocchi → curva granulometrica; confronto
  con la previsione Kuz-Ram/KCO. Una versione base (soglie + watershed) gira nel
  browser; una precisa (tipo WipFrag) vuole ML e quindi backend/GPU.
- **P2.2 Modello ML di frammentazione** *(backend per il training, client per
  l'inferenza)*: allena un XGBoost/rete su dati reali (burden, spaziatura,
  powder factor, UCS…) e usa il modello leggero **nel browser** per la
  previsione. Serve un dataset e un passo di training (offline).
- **P2.3 Boretrack / deviazione fori** *(client)*: import del profilo "as-drilled"
  e visualizzazione nel 3D; ricalcolo di burden/carica reali per foro.
- **P2.4 Export/interoperabilità (IREDES, detonatori elettronici)** *(client per
  la generazione file)*: esporta il piano volata nei ritardi per i detonatori e
  in XML IREDES per perforatrici/software terzi. Utile in fase commerciale.

## Cosa NON inseguire (per ora)
- Riscrivere il motore fisico: è già solido (Kuz-Ram/KCO, Lilly, flyrock, fori
  bagnati verificati). Le nuove funzioni si AGGIUNGONO attorno, senza toccare il
  cuore fisico (regola del fondatore).
- Feature "enterprise" (flotte perforatrici live, integrazioni proprietarie
  detonatori): fase commerciale, non ora.

## Sintesi
Con **P0 (vibrazioni + airblast)** e **P1 (signature-hole + riconciliazione +
burden reale)** Genesi coprirebbe i due gap che oggi lo separano di più dai
leader, restando **in gran parte lato browser**. È esattamente il "raggiungere il
loro livello, magari qualcosa in meno" chiesto dal fondatore. P2 (AI/immagine/
IREDES) è il differenziante successivo, quando ci sarà un backend e dei dati.

## Fonti
- Orica SHOTPlus / BlastIQ / Advanced Vibration Management / FRAGTrack:
  https://www.orica.com/digital-solutions/blast-design-and-execution/shotplus ·
  https://www.orica.com/digital-solutions/blast-design-and-execution/blastiq ·
  https://im-mining.com/2021/04/15/latest-orica-software-predicts-vibration-airblast-outcomes-protect-sensitive-structures-maximise-blast-outcomes/
- Maptek BlastLogic (riconciliazione, as-drilled, single source of truth):
  https://www.maptek.com/products/blastlogic/
- Maxam RIOBLAST (moduli vibrazioni/frammentazione/flyrock, MWD):
  https://fundacionmaxam.com/en/fundacion/catedra_maxam/blasting_solutions/design_and_simulation_of_blasts_rioblast
- Strayos (AI, drone/fotogrammetria, Rock Mass AI, post-blast):
  https://strayos.com/ ·
  https://blog.strayos.com/webinar-summary-after-the-blast-measuring-blast-performance-with-drones-and-ai/
- O-Pitblast (DTM da drone/laser, O-PitDev deviazione, O-PitAnalytics):
  https://teamarmaan.com/o-pitsurface/
- Frammentazione Kuz-Ram modificato / KCO / Swebrec:
  https://www.sciencedirect.com/science/article/abs/pii/S1365160909000811 ·
  https://www.scielo.org.za/scielo.php?script=sci_arttext&pid=S2225-62532021000300004
- Signature-hole + superposizione d'onda + detonatori elettronici:
  https://www.researchgate.net/publication/392327397_An_integrated_approach_of_signature_hole_vibration_monitoring_and_modeling_for_quarry_vibration_control ·
  https://www.sciencedirect.com/science/article/abs/pii/S1365160921001994
- ML per frammentazione/flyrock/backbreak (XGBoost, ensemble ANN-RF):
  https://link.springer.com/article/10.1007/s40033-024-00812-7 ·
  https://www.nature.com/articles/s41598-025-33871-1
- Face profiling / burden reale / boretrack:
  https://www.hsa.ie/eng/your_industry/quarrying/drilling_and_blasting/face_profiling_and_drill_hole_logging/
- IREDES (standard dati, MWD→carica):
  https://iredes.org/architecture-2/ · https://en.wikipedia.org/wiki/IREDES
