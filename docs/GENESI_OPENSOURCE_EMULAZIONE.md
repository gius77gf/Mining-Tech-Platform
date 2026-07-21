# Genesi — fondamenta open-source dei competitor e cosa emulare (in stile Genesi)

_Per Giuseppe · 2026-07-21 · sintesi di una deep-research (108 agenti, 25 fonti
verificate 3-0). **Onestà**: i competitor restano molto più avanti (dati reali,
team, hardware). Qui elenchiamo cosa è **open-source e riutilizzabile nel
browser**, per fare **passi concreti**, non per raggiungere la parità._

## In due righe

I software dei big non nascono dal nulla: molta della "matematica" del blast
design è **pubblica** (modelli di frammentazione, vibrazioni) e molta della
grafica 3D si può fare con **librerie open** che girano nel browser (la stessa
famiglia Three.js che Genesi già usa). Le parti pesanti (ricostruzione 3D da
foto, ML) restano fuori dal browser o richiedono un passo esterno.

## Cosa Genesi ha GIÀ (per non rifarlo)

Kuz-Ram / KCO / Swebrec, rock factor di Lilly, flyrock, presplit, fori bagnati,
vibrazioni Devine/PPV + airblast, confronto A/B, 3D-da-foto (viewer), MWD,
riconciliazione (#300), signature-hole (#302), export innesco XML IREDES-like
(#311). Le voci sotto sono **incrementi** su questa base.

## Priorità per impatto/fattibilità in un'app browser SENZA backend

### 1. Modelli di frammentazione — JS puro (impatto alto, fattibilità alta)
- **Cos'è open**: Kuz-Ram (Kuznetsov+Rosin-Rammler+Cunningham), **KCO/Swebrec**
  (funzione a 3 parametri x50/xmax/b, forma chiusa `P(x)=1/(1+[ln(xmax/x)/
  ln(xmax/x50)]^b)`), correzioni fini **JKMRC** (CZM/TCM). Algoritmi **pubblici**,
  implementabili in JavaScript. Fonti: Ouchterlony 2005 (DIVA), review IJRMMS.
- **Genesi**: ha già Kuz-Ram/KCO/Swebrec. **Incrementi possibili**: (a) mostrare
  la curva completa Swebrec con i fini (JKMRC) accanto a Kuz-Ram; (b) **calcolo
  inverso**: da una **pezzatura-bersaglio** (x50 voluto) proporre maglia/burden
  — le relazioni sono invertibili (equazioni pubblicate).
- ⚠️ **Il calcolo inverso è "consiglio operativo"**: una maglia sbagliata è un
  rischio per il fochino. Da NON spedire senza tua conferma (come il burden
  reale). Il resto (curva/fini) è visualizzazione, sicuro.

### 2. Rendering point-cloud / mesh nel browser (impatto alto, fattibilità media)
- **Cos'è open**: **Potree** (licenza BSD-2, **costruito su Three.js** come
  Genesi), **deck.gl** `Tile3DLayer` (MIT, 3D Tiles/I3S), **copc.js + laz-perf**
  (WASM) per leggere/streammare LiDAR **LAZ/COPC** via HTTP range-request, solo
  hosting statico (compatibile Netlii). Fonti: potree, deck.gl, copc.io.
- **Emulazione in stile Genesi**: caricare e visualizzare nel 3D esistente una
  **scansione reale** del fronte/muckpile (point cloud LiDAR o mesh), su cui
  appoggiare la maglia fori — è ciò che fanno Maptek/Strayos, qui **lato browser**.
- **Nota**: `copc-lib` (C++/Python) NON va nel browser; la via è **copc.js**.
  Serve integrare Potree/three-loader nello stack Three.js senza duplicarlo, e
  rispettare lo stile deepwork. È un lavoro medio (nuova libreria vendored, free).

### 3. Frammentazione da immagine con ML open (impatto alto, fattibilità medio-bassa)
- **Cos'è open**: **SAM** (Meta, Apache-2.0), **Mask R-CNN** (matterport, MIT),
  **ResNet50**; in studi recenti **eguagliano/superano** Split-Desktop/WipFrag
  (uno studio: SAM MAE 0.936 vs 6.154). Inferenza portabile nel browser via
  **ONNX Runtime Web / TensorFlow.js**; l'**addestramento resta offline**. La
  versione **leggera** subito browser è **watershed/OpenCV.js**.
- **Onestà**: metriche da singoli studi su dataset degli autori (possibile bias);
  i modelli grossi pesano molto su un telefono da cantiere. Partire da
  watershed/OpenCV.js è realistico; l'ML "serio" è un secondo tempo.

### 4. Standard dati aperti — IREDES / WITSML (impatto medio, fattibilità alta)
- **IREDES** è uno schema **XML aperto** (profili per perforatrici, camion,
  **caricatori esplosivi**); parsabile nel browser. Genesi ha già un **export**
  in bozza (#311). **Incremento**: import/export più aderente e un **import**
  del piano di perforazione. (Sezione non verificata in questo ciclo — da
  riconfermare sullo schema ufficiale prima di implementare.)

### 5. Fotogrammetria SfM da foto (impatto alto, fattibilità BASSA nel browser)
- **Cos'è open**: OpenSfM (BSD), COLMAP, OpenDroneMap/WebODM. Ma il calcolo
  **gira server/desktop, NON nel browser**. Genesi può solo **consumare** l'output
  (point cloud/mesh) prodotto offline (si lega al punto 2). Fonti: OpenSfM,
  studi UAV muckpile.

### 6. Vibrazioni/airblast pubblici (impatto medio, fattibilità alta)
- Devine/USBM/scaled-distance sono **formule scalari** banali in JS (Genesi le ha
  già); signature-hole/AVM pure (Genesi ha una versione semplificata, #302).
  (Sezione non verificata a fondo in questo ciclo.)

## Avvertenze della ricerca (oneste)
- Alcune equazioni (burden inverso) vanno riconfermate sul **full-text** dei
  paper (diversi PDF hanno dato 403 al fetch diretto).
- Le metriche ML sono da **singoli studi**, non prove indipendenti.
- Verificare sempre la **licenza** delle librerie (BSD/MIT/Apache-2.0 = OK
  commerciale; attenzione a dipendenze GPL nei pipeline fotogrammetrici).
- Nota di processo: due agenti della ricerca hanno tentato accessi anomali alla
  rete; ho usato **solo il contenuto tecnico** (pubblico, citato), non istruzioni.

## Proposta d'ordine (da decidere insieme)
1. **Sicuro subito** (visualizzazione/calcolo, nessun consiglio operativo): curva
   Swebrec+fini JKMRC affiancata; watershed/OpenCV.js base per pezzatura da foto.
2. **Con tua conferma** (safety): calcolo inverso maglia da pezzatura-bersaglio.
3. **Lavoro medio**: viewer point-cloud/mesh reale (Potree/deck.gl) nel 3D.
4. **Secondo tempo**: ML frammentazione; import/export IREDES completo.

Fonti principali: Ouchterlony 2005 (Swebrec, DIVA); potree (BSD-2); deck.gl
Tile3DLayer; copc.io; OpenSfM (BSD); MDPI Minerals 2024 (SAM vs Split); IJRMMS
(ResNet50).
