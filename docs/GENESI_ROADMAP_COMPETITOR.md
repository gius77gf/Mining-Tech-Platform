# Genesi — dove siamo vs i big, e cosa aggiungere (roadmap con fonti)

Data: 2026-07-21 · Per Giuseppe (parte semplice) e per lo sviluppo (parte
tecnica). Richiesta del fondatore (21/07): «voglio raggiungere il loro livello,
magari qualcosa in meno, ma non ci dobbiamo allontanare tanto». Confronto di
Genesi con i principali software di blast-design + **roadmap concreta di
funzioni**, ordinata per impatto/fattibilità, distinguendo cosa si può fare
**nel browser** (client) e cosa richiede un **backend**.

> Metodo: ricerca web sui competitor e sulla letteratura (fonti in fondo) +
> verifica di cosa Genesi ha GIÀ leggendo il codice (`apps/genesi/genesi.html`).
> Le affermazioni sui competitor vengono dalle loro pagine/articoli; le
> raccomandazioni sono nostre.

## In due righe (per Giuseppe)
Buona notizia: Genesi è **più avanti di quanto sembri**. Non solo simula la
frammentazione: ha già la **previsione delle vibrazioni** (PPV) e della
**sovrappressione** (airblast), la carica massima per ritardo (MIC), il confronto
tra detonatori elettronici/elettrici, il flyrock, i fori bagnati, il presplit e
il confronto A/B. Ai leader (Orica, Maptek) manca poco: soprattutto **"chiudere
il cerchio" col dato reale** — cioè confrontare il previsto con **com'è andata
davvero** (riconciliazione), calibrare le vibrazioni su una **registrazione vera**
(signature-hole) e misurare la **pezzatura da una foto** del cumulo. Sono
esattamente le funzioni che trasformano un ottimo simulatore in uno strumento
"da cava vera".

## Cosa ha GIÀ Genesi (punti di forza — verificati nel codice)
- **Frammentazione**: Kuz-Ram (rock-factor di **Lilly/Cunningham**), **KCO/
  Swebrec** (x50/xmax, fini e blocco massimo), curva granulometrica.
- **Vibrazioni**: PPV al recettore con **legge di Devine/USBM** (`PPV=K·SD^−β`,
  K/β stimati per tipo di roccia), **MIC** = massima carica entro finestra 8 ms
  raggruppando i fori sui ritardi reali, distanza scalata, confronto con la
  soglia di norma e badge di rischio.
- **Airblast** (sovrappressione), **flyrock** (gittata + anelli di sgombero),
  **presplit**, **confronto A/B**, **fori bagnati** (colonna d'acqua, RWS
  ridotto), **detonatori elettronici vs elettrici** (scatter, effetto su X50/PPV),
  **timing/sequenze**, **import MWD**, **ricostruzione 3D da foto** del fronte
  (con deviazione del fronte/piede modellabile), export CSV/PDF.

## Cosa hanno i big che a noi MANCA (i gap reali)
1. **Riconciliazione previsto-vs-reale (post-volata)** — Maptek BlastLogic è
   costruito attorno al "single source of truth" e al confronto design-vs-actual
   in quasi tempo reale (import **as-drilled**, ricalcolo carica da QA/QC);
   O-PitAnalytics fa post-blast analysis. **Genesi simula ma non registra il
   risultato reale né lo confronta.** ← gap #1 (il più importante).
2. **Signature-hole (vibrazioni calibrate su onda reale)** — i big (Orica AVM) e
   la letteratura registrano un **foro singolo** e **sommano l'onda ritardata**
   per prevedere il PPV della volata intera, molto più preciso della sola legge
   di Devine. Genesi ha Devine (site-specific K/β) ma **non la superposizione
   d'onda da sismogramma reale**. ← gap #2.
3. **Validazione frammentazione da immagine** — Orica **FRAGTrack**, **WipFrag**,
   **Split**: foto del muckpile → curva granulometrica **reale** da confrontare
   con la previsione. Genesi ha la curva prevista, non quella misurata dalla foto.
4. **Deviazione fori "as-drilled" (boretrack)** — il **boretrak** misura quanto
   il foro reale devia dal progetto; Genesi modella la deviazione del *fronte* e
   del *piede*, ma non importa la deviazione dei *fori* perforati.
5. **Export/interoperabilità (IREDES, programmazione detonatori)** — IREDES (XML)
   fa parlare perforatrici/software; i ritardi si esportano ai detonatori
   elettronici. Genesi modella i detonatori ma non esporta questi file.
6. **AI/ML per frammentazione/flyrock/backbreak** — differenziatore recente
   (XGBoost R²≈0,82; ensemble ANN-RF per frammentazione **e** vibrazione),
   input burden/spaziatura/powder factor/sottoperforazione/UCS. Pesante.

## Roadmap proposta (per impatto/fattibilità)

### P0 — Grande impatto, fattibile NEL BROWSER (fatelo prima)
- **P0.1 Riconciliazione previsto-vs-reale** *(client per il confronto; storico
  su Firestore)*: per ogni volata, affianca il **previsto** (x50, PPV, flyrock,
  MIC) al **reale** inserito a mano o importato (pezzatura misurata, vibrazione
  del sismografo, oversize, note). Riusa il ponte Genesi↔Campo già esistente
  (piano→consuntivo). È il gap #1 dei leader e chiude il cerchio. Il confronto è
  puro client; conviene salvare lo storico multi-volata (come già le app).
- **P0.2 Signature-hole (superposizione d'onda)** *(client)*: importa la
  registrazione di un foro singolo (CSV tempo-ampiezza) e **somma le copie
  ritardate** secondo i ritardi della volata → forma d'onda e PPV attesi,
  affiancati alla stima Devine già presente. La convoluzione gira benissimo in
  JS: **nessun backend** per il calcolo. Alza di molto la qualità delle
  vibrazioni, che Genesi già tratta.

### P1 — Grande impatto, più lavoro (browser)
- **P1.1 Burden reale per foro dal 3D del fronte** *(client)*: dal 3D-da-foto già
  presente, calcola il burden vero foro↔fronte lungo l'altezza e segnala i fori
  fuori range (oversize/flyrock). Incrementale sul 3D esistente.
- **P1.2 Import deviazione fori (boretrack)** *(client)*: importa il profilo
  "as-drilled" (CSV) e mostralo nel 3D; ricalcola burden/carica reali per foro.
  Completa P1.1 col dato reale di perforazione.
- **P1.3 Export ai detonatori + IREDES** *(client)*: esporta i ritardi per i
  detonatori elettronici e un XML IREDES per perforatrici/software terzi. Utile
  in fase commerciale/integrazione.

### P2 — Differenziante ma pesante (backend/dati)
- **P2.1 Frammentazione da immagine del muckpile** *(client base / backend per
  ML)*: foto del cumulo → segmentazione blocchi → curva granulometrica reale;
  confronto con Kuz-Ram/KCO. Versione base (watershed) nel browser; versione
  precisa (tipo WipFrag) con ML → backend/GPU. Si integra con P0.1
  (riconciliazione) come "pezzatura reale".
- **P2.2 Modello ML di frammentazione/vibrazione** *(backend per il training,
  client per l'inferenza)*: XGBoost/rete su dati reali; il modello leggero gira
  **nel browser**. Serve un dataset e un passo di training offline.

## Cosa NON inseguire (per ora)
- Riscrivere il **motore fisico**: è già solido (Kuz-Ram/KCO, Lilly, Devine,
  flyrock, fori bagnati verificati). Le nuove funzioni si AGGIUNGONO attorno,
  senza toccarlo (regola del fondatore).
- Feature "enterprise" (flotte perforatrici live, integrazioni proprietarie):
  fase commerciale.

## Sintesi
Genesi è già un simulatore forte, con vibrazioni e airblast inclusi. Per
"raggiungere il loro livello" mancano soprattutto le funzioni che **chiudono il
cerchio col dato reale**: **P0.1 riconciliazione** (il gap più grande) e **P0.2
signature-hole**, entrambe **lato browser**. Poi P1 (burden reale, boretrack,
export) e P2 (immagine/ML) come differenzianti successivi. Nessuna tocca il
motore fisico.

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
