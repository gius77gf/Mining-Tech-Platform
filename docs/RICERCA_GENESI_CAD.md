# Ricerca Genesi: Capacità CAD Fondamentali

**Data apertura ricerca:** 2026-09-19  
**Mandato:** censire le capacità che rendono un editor 2D/3D un "CAD vero" (non solo canvas che disegna), verificare quale esiste già in Genesi, quale manca, quale è parziale.

**Metodologia:** (1) ricerca web sugli standard CAD professionali, (2) verifica riga per riga nel codice di Genesi (apps/genesi/genesi.html e genesi-data.js), (3) dichiarazioni oneste: un "non c'è" accompagnato dal comando grep effettivo o dalla spiegazione del meccanismo cercato.

---

## Capacità Fondamentali di un CAD (da ricerca sul mondo)

Basato su: AutoCAD, BricsCAD, LibreCAD, FreeCAD. I feature universali che distinguono un CAD da uno strumento di disegno generico sono:

### 1. **Sistemi di Input Coordinate** (assoluto, relativo, polare)
- **Assoluto:** specificare posizioni nel sistema globale (x, y dall'origine)
- **Relativo:** spostamenti incrementali dal punto corrente (@Δx,Δy)
- **Polare:** distanza e angolo (@distanza<angolo)
- **Ortho mode:** limitare input a direzioni orizzontali/verticali
- **Fonte:** [AutoCAD 2D Drafting](https://opentextbc.ca/autocad2d/chapter/grids-and-snap/), [BricsCAD Docs](https://help.bricsys.com/en-us/document/bricscad/drawing-accurately/snap-and-grid)

### 2. **Snap a Oggetti (Object Snap)**
- **Endpoint:** fine di un segmento
- **Midpoint:** centro di un segmento
- **Center:** centro di un cerchio/arco
- **Intersection:** incrocio fra linee
- **Perpendicular:** perpendicolare ad una linea
- **Tangent:** tangente a una curva
- **Fonte:** [AutoCAD Object Snaps](https://www.autodesk.com/blogs/autocad/object-snaps-basics-autocad-foundations/), [nanoCAD Snap Mode](https://nanocad.com/learning/online-help/nanocad-platform/object-snap-mode/)

### 3. **Griglia e Snap a Griglia**
- **Grid:** griglia di punti regolari sul piano di lavoro
- **Snap:** costringere il cursore ad aderire ai punti griglia
- **Grid/Snap indipendenti:** densità visiva ≠ densità di snap
- **Fonte:** [NVCC CAD Grid & Snap](https://pressbooks.nvcc.edu/cad201/chapter/grids-and-snap/), [nanoCAD](https://nanocad.com/learning/online-help/nanocad-platform/snap-and-grid-mode/)

### 4. **Gestione Layer (Strati)**
- **Visibilità:** mostra/nascondi per layer
- **Lock/Unlock:** blocca layer per evitare selezioni/modifche accidentali
- **Colore per layer:** identità visiva del layer
- **Fonte:** implicito in tutti gli editor professionali

### 5. **Strumenti di Selezione**
- **Punto singolo:** click su un oggetto
- **Window selection:** finestra che contiene completamente gli oggetti
- **Crossing selection:** finestra che incrocia gli oggetti (anche parzialmente)
- **Fonte:** implicito in tutti gli editor

### 6. **Trasformazioni Precise**
- **Move:** sposta oggetto a distanza/coordinate specifiche
- **Rotate:** ruota di angolo specifico attorno a un punto
- **Scale:** scala uniforme o su assi specifici
- **Mirror:** rifletti attorno a una linea
- **Array/Copia:** crea array rettangolare o polare
- **Fonte:** [Rhino Transforms](http://docs.mcneel.com/rhino/6/usersguide/en-us/html/ch-08_transforms.htm), [VariCAD](https://www.varicad.com/userdata/files/help/en/manual13.htm)

### 7. **Quotatura (Dimensioning)**
- **Linear:** cota di distanza fra punti
- **Angular:** cota angolare
- **Raggio/Diametro:** su cerchi
- **Fonte:** implicito in CAD professionali

### 8. **Undo/Redo Robusto**
- **Undo:** reversa l'azione precedente (illimitato, non uno step)
- **Redo:** ripristina azione annullata
- **History buffer:** storia completa delle azioni
- **Fonte:** [AutoCAD Undo/Redo](https://knowledge.autodesk.com/support/autocad-web-app/learn-explore/caas/CloudHelp/cloudhelp/ENU/AutoCAD-Web-Help/files/List-Commands/AutoCAD-Web-Help-List-Commands-Undo-and-Redo-html-html.html), [nanoCAD](https://nanocad.com/learning/online-help/nanocad-platform/redo-commands/)

### 9. **Blocchi/Simboli Riusabili**
- **Block definition:** salva un disegno come componente riusabile
- **Block instance:** inserisce una copia di un blocco
- **Block library:** catalogo di blocchi per il progetto
- **Edit block:** modifica tutte le istanze aggiornando la definizione
- **Fonte:** [AutoCAD CADnotes](https://www.cad-notes.com/wbwa-challenge-3-reusable-content/)

### 10. **Snap Magnetico Durante il Disegno**
- **Tracciamento dinamico:** mostra guida geometrica mentre disegni
- **Smart guides:** rileva allineamenti con oggetti vicini
- **Fonte:** implicito negli editor professionali

### 11. **Standard di Scambio File (DXF/DWG)**
- **DXF:** formato aperto, ASCII/binario, supportato universalmente
- **DWG:** formato proprietario Autodesk (ampiamente supportato)
- **Interoperabilità:** import/export senza perdita di dati
- **Fonte:** [DXF Overview](https://www.adobe.com/creativecloud/file-types/image/vector/dxf-file.html), [Wikipedia DXF](https://en.wikipedia.org/wiki/AutoCAD_DXF), [DXF Editors](https://dxfstore.com/ultimate-guide-to-the-top-10-free-dxf-editors-for-cad-enthusiasts-enhance-your-design-experience-without-breaking-the-bank/)

---

## Censimento Genesi: Cosa C'è, Cosa Manca, Cosa è Parziale

### 1. **Sistemi di Input Coordinate**
**STATO:** Parziale (solo assoluto, nessun relativo/polare)

- ✅ **Coordinate assolute:** sì, l'input form ha campi per X (`dB`, `dS` spalla/interasse) e Y (profondità `dH`)
  - Verificato in genesi.html riga ~740-748: `<input type="text" inputmode="decimal" id="dB" ... value="3.0">` etc
  - Le coordinate sono lette come valori numerici
- ❌ **Input relativo (@Δx,Δy):** NON TROVATO
  - Cercato: `@` in genesi.html → zero occorrenze
  - Cercato: `relativo` in genesi-data.js → zero (parola non nel dominio volate)
- ❌ **Input polare (@distanza<angolo):** NON TROVATO
  - Cercato: `polare` / `angolo` come input → solo in Inclinazione `dIncl` (°) per tutta la maglia, non per coordinate singole
- ⚠️ **Ortho mode:** NON TROVATO come toggle, ma implicito nel drag
  - genesi.html riga ~6504: `my=Math.max(0.3,my); mx=Math.max(-3,Math.min(...)` → costrain dei limiti, non ortho puro

**DELTA:** Manca sistema relativo/polare. È un blocco se Genesi vuole diventare un CAD geometrico vero.

---

### 2. **Snap a Oggetti (Object Snap)**
**STATO:** Inesistente

- ❌ **Endpoint snap:** NON TROVATO
- ❌ **Midpoint snap:** NON TROVATO
- ❌ **Center snap:** NON TROVATO
- ❌ **Intersection snap:** NON TROVATO
- ❌ **Perpendicular snap:** NON TROVATO
- ⚠️ **Snap a griglia/punti nominali:** SÌ, parzialmente
  - genesi.html riga ~6504: `mx=_snapXY(D2, mx); my=_snapXY(D2, my);`
  - genesi-data.js: cerca `_snapXY` → **NON TROVATO in genesi-data.js**, è uno stub nella pagina
  - Comportamento: snap al valore intero più vicino (griglia da 0.1 m basata su forma della maglia)

**DELTA:** Assente completamente. Quando l'utente disegna il piano dei fori, non può snap a endpoint/intersezioni di linee già disegnate.

---

### 3. **Griglia e Snap a Griglia**
**STATO:** Parziale (visiva sì, snap ai passi della maglia)

- ✅ **Grid display:** sì, canvas con righe/colonne della maglia
  - Verificato in genesi.html: `<canvas id="d2-canvas"...>`
  - genesi-data.js riga ~6215-6416: `function drawDesign2D()` disegna griglia basata su `D2.S` (interasse) e `D2.B` (spalla)
- ✅ **Snap a griglia:** sì, implicitamente ai passi della maglia
  - _snapXY quantizza al passo di 0.1 m (hardcoded o derivato)
- ✅ **Griglia/snap indipendenti:** sì, maglia è fissa (D2.B × D2.S), snap è floating
- ❌ **Toggle visibilità griglia:** NO toggle esplicito trovato (è sempre visibile)

**DELTA:** Base c'è, ma non configurabile. È un CAD molto specializzato alla maglia.

---

### 4. **Gestione Layer**
**STATO:** Presente e funzionante

- ✅ **Layer visibility (mostra/nascondi):** SÌ
  - genesi.html riga ~821-823: `<button type="button" class="ds-occhio" data-strato="fori" title="Mostra/nascondi i fori">👁</button>`
  - 4 layer: "fori", "fronte", "piede" (topografia del fronte in 3D, visibile solo in quel segmento)
  - genesi.html riga ~736-814: form UI con pulsanti per toggles
  - Layer toggle a click: `ds-occhio` button → JavaScript, cercato in genesi.html

- ✅ **Layer lock/unlock:** SÌ
  - genesi.html riga ~821-823: `<button type="button" class="ds-lucchetto" data-strato="fori" title="Blocca/sblocca i fori">🔓</button>`
  - Titolo: "bloccato: niente clic né trascinamento"
  - genesi.html riga ~6598: `function foriBloccati(){ return layerLock && layerLock.includes('fori'); }` ✓
  - Check prima di modifica: `if(foriBloccati()) return;` (riga ~6601, ~6615, etc)

- ⚠️ **Colore per layer:** Parziale
  - Cercato: `--fori-color`, `--fronte-color` in genesi.html → ZERO match
  - I layer hanno colori CSS fissi (giallo per fori, grigio per fronte, etc) ma non variano per layer
  - Non è una proprietà layer modificabile

**DELTA:** Visibility e lock sì, colore per layer è fisso (stilistico, non parametrico).

---

### 5. **Strumenti di Selezione**
**STATO:** Presente ma minimale

- ✅ **Selezione punto singolo:** SÌ
  - genesi.html riga ~6501: `D2.sel=i; d2drag=i;` → seleziona il foro cliccato
  - Click su canvas riga ~6651: `cv.addEventListener('pointerdown',d2Down);`
  - Visual feedback: il foro selezionato si disegna diverso (cerchio riempito)

- ❌ **Window selection (finestra di selezione):** NON TROVATO
  - Cercato: `window`, `rect`, `drag-rect` → niente di quel tipo
  - Solo click singolo su un oggetto

- ❌ **Crossing selection:** NON TROVATO

**DELTA:** Solo selezione singola. Niente multi-select.

---

### 6. **Trasformazioni Precise**
**STATO:** Move sì (via drag + input numerici), rotate/scale/mirror/array NO

- ✅ **Move:** SÌ
  - genesi.html riga ~6504: drag del foro, le coordinate aggiornano live
  - Oppure input numerico: riga ~6632 `d2Move()`: modifica `h.mx` direttamente
  - Possibile muovere un foro sia via UI numerica che via trascinamento

- ❌ **Rotate:** NON TROVATO per singoli oggetti
  - Rotazione applicata solo a tutta la maglia via `dIncl` (inclinazione della maglia), non a singoli fori

- ❌ **Scale:** NON TROVATO

- ❌ **Mirror:** NON TROVATO
  - Cercato: `mirror`, `rifletti`, `simmetria` → zero match in genesi-data.js e HTML

- ❌ **Array/Copia:** PARZIALMENTE (è generato automaticamente dalla maglia)
  - La maglia genera un array rettangolare: `D2.perRow` fori per riga, `D2.nFile` file
  - Ma non è uno strumento di trasformazione, è la geometria base della maglia
  - Non si crea un array di un oggetto selezionato

**DELTA:** Solo move. Rotate/scale/mirror sono assenti. Array è implicito nella maglia, non uno strumento di copia selezionabile.

---

### 7. **Quotatura (Dimensioning)**
**STATO:** Visualizzazione sì (output), ma non come strumento di input

- ⚠️ **Quotatura lineare:** Visualizzata, non è uno strumento
  - genesi.html: le quote sono stampate sul foglio / export CSV (dimensioni della maglia)
  - genesi-data.js riga ~800+: fogli di stampa contengono quote (altezza, interasse, spalla, etc)
  - Ma non è uno strumento per cui l'utente dice "cota questa linea", il sistema la calcola da parametri

- ❌ **Quotatura angolare:** NO (tranne Inclinazione della maglia globale)

- ❌ **Raggio/Diametro:** NO (i fori sono punti, non cerchi con raggio annotato)

**DELTA:** Le quote escono dal disegno, ma non sono uno strumento in cui l'utente crea quote. È documentazione post-design, non input di progetto.

---

### 8. **Undo/Redo Robusto**
**STATO:** Presente ma minimale

- ✅ **Undo:** SÌ
  - genesi.html riga ~815: `<button type="button" id="d2Undo" class="dt-undo" title="Annulla l'ultima modifica (Ctrl+Z)" disabled>↩</button>`
  - genesi.html riga ~6503: `d2PushUndo();` chiamato prima di ogni modifica
  - genesi-html: `d2Undo.onclick=()=>{ ... d2PopUndo(); ... }`
  - Stack di undo è mantenuto, ma non visto il limite

- ✅ **Redo:** SÌ
  - genesi.html riga ~816: `<button type="button" id="d2Redo" class="dt-undo" title="Ripristina (Ctrl+Y)" disabled>↪</button>`
  - Funzionalità gemella a undo

- ⚠️ **Illimitato:** Presunto sì, ma stack non è misurato nel codice letto
  - Probabile che sia limitato dal browser (memoria)

**DELTA:** C'è e funziona, ma il limite dello stack non è noto.

---

### 9. **Blocchi/Simboli Riusabili**
**STATO:** NON PRESENTE

- ❌ **Block definition:** NON TROVATO
  - Cercato: `block`, `simbolo`, `componente` → zero match nel contesto blocchi riusabili
  - genesi non ha una libreria di blocchi

- ❌ **Block instance:** NO

- ❌ **Block library:** NO

- ❌ **Edit block:** NO

**DELTA:** Assente completamente. La maglia è generata proceduralmente, non come istanze di blocchi.

---

### 10. **Snap Magnetico Durante il Disegno (Dynamic Tracking)**
**STATO:** NON PRESENTE (o molto minimale)

- ❌ **Tracciamento dinamico (guide geometriche):** NON TROVATO
  - Cercato: `track`, `guide`, `align` → zero match nel contesto dinamico
  - Il canvas disegna la maglia, non le guide di movimento

- ❌ **Smart guides (allineamento automatico):** NO
  - Cercato: `smart`, `align` → niente di quel tipo

- ⚠️ **Drag del foro aggiorna in tempo reale:** SÌ, ma è feedback di disegno, non snap
  - genesi.html riga ~6504: `drawDesign2D()` viene richiamato a ogni `pointermove`
  - È visualizzazione live, non snap magnetico a geometrie

**DELTA:** Nessuna guida geometrica durante il disegno. È tutto basato su snap a griglia.

---

### 11. **Standard di Scambio File (DXF/DWG)**
**STATO:** DXF import parziale, export NO

- ✅ **DXF import:** Parziale
  - genesi-data.js: funzioni `dxfInTratti()`, `_dxfEntita()`, `parseXYZ()`
  - Importa LINE, POLYLINE, LWPOLYLINE (dal checkpoint 20260919-023026, è stato corretto l'import di LWPOLYLINE)
  - Legge coordinate XY da file DXF e le converte in formato Genesi (tratti, profilo)
  - Checkpoint 20260919-023026: "LWPOLYLINE — l'entità polilinea di DEFAULT di AutoCAD/LibreCAD/QCAD"
  - **Limite:** importa solo geometria 2D (linee/polilinee), non attributi layer/colore

- ❌ **DXF export:** NON TROVATO
  - Cercato: `toDxf`, `exportDxf`, `writeDxf` → zero match
  - Genesi esporta CSV (documentazione) e JSON (formato interno), non DXF
  - Non rilegge il disegno in DXF da nessun'altra app

- ❌ **DWG:** NON SUPPORTATO (nemmeno import)
  - DWG è proprietario, richiede libreria speciale (o come DXF riscrittura da altre app)

**DELTA:** Importa DXF (profilo della cava da rilievo/CAD), non lo esporta. Bottleneck per interoperabilità.

---

## Sintesi Decisionale

**Genesi è attualmente:**
- ✅ Un calcolatore 2D specializzato sulla volata esplosiva con interfaccia CAD-like
- ✅ Editor "maglia + parametri" robusto (undo/redo, layer hide/lock)
- ❌ NON un CAD generale 2D

**Blocchi critici per diventare CAD vero:**

1. **Input coordinate relativo/polare** - disegno preciso senza basarsi sulla maglia
2. **Snap a oggetti (endpoint, intersezione, perpendicolare)** - precisione senza maglia
3. **Trasformazioni di selezione (rotate, scale, mirror su fori singoli)** - editing localizzato
4. **Selezione multipla (window/crossing)** - operazioni batch
5. **Blocchi/simboli** - riuso di pattern comuni (es. gallerie, pozzi, pilastri di cava)
6. **Export DXF** - scambio bidirezionale con rilievo/topografia

**Punti di forza da mantenere:**
- Snap a griglia della maglia (specializzato, non generale)
- Undo/redo funzionante
- Layer management (visibilità, lock)
- Integrazione DXF import (rilievi topografici)

**Proposte per progresso graduato verso CAD:**
- **Fase 1 (minima):** Snap endpoint su linee del fronte importate (DXF)
- **Fase 2 (media):** Input relativo per posizionare fori rispetto a geometrie importate
- **Fase 3 (completa):** Selezione multipla + trasformazioni + blocchi parametrici per pattern comuni

---

**Nota di continuità (19/09):** due ricerche Haiku sono state dispatchate in
parallelo su questo stesso file il 19/09 — questa sul censimento capacità
CAD fondamentali, un'altra sui concorrenti diretti (Deswik, Maptek, Orica,
JKSimBlast, O-Pitblast, Datamine, Vulcan, Surpac). Entrambe usavano `Write`
(sovrascrittura intera) invece di append: la seconda ha sovrascritto la
prima senza che nessuna delle due leggesse lo stato più recente dell'altra.
La sezione dei concorrenti è stata recuperata dal suo output grezzo
(conservato integralmente nella cronologia dell'agente) e riattaccata qui
sotto — non è stata rifatta da capo, per non sprecare la ricerca reale già
svolta. Il suo "delta rispetto a Genesi" era dichiarato dall'agente stesso
come superficiale ("non è stata ancora fatta analisi profonda"): il
censimento riga-per-riga qui sopra resta quello di riferimento per il
delta, quello sui concorrenti resta di riferimento per il mondo esterno.

---

## 2026-09-19 — Censimento concorrenti blast design CAD

### Prodotti analizzati

1. **Deswik.Blast** (Deswik)
   - Tipo: Desktop + cloud-based
   - CAD: 3D environment completo con primitive drawing (poligoni, linee, punti)
   - Formato: DXF/DWG import/export, formati proprietari
   - Strumenti: Snap to grid, layer management, dimensioning, symbol libraries
   - Prezzo: Commerciale
   - Fonte: Sito ufficiale Deswik [di seconda mano]

2. **Maptek BlastLogic** (Maptek)
   - Tipo: Desktop (Windows)
   - CAD: 3D modeling con view interattiva, disegno di geometrie di scavo
   - Formato: Support DXF, DWG, formati geologici (blockmodel)
   - Strumenti: Snap-to-grid, layer system, quotatura automatica
   - Prezzo: Commerciale (parte della suite Maptek)
   - Fonte: Documentazione Maptek [di seconda mano]

3. **Orica SHOTPlus / BlastIQ** (Orica, 35+ anni di mercato)
   - Tipo: Desktop (Windows), recente versione web
   - CAD: 2D + 3D design environment, hole pattern drawing
   - Formato: DXF/DWG native, ASCII interchange
   - Strumenti: Drill hole layout, geometry snapping, layer-based design
   - Prezzo: Commerciale (leader di mercato)
   - Fonte: Sito Orica [di seconda mano]

4. **JKSimBlast** (JK Tech, Julius Kruttschnitt Mineral Research Centre)
   - Tipo: Desktop (Windows/Linux)
   - CAD: 2D hole pattern design, 3D visualization
   - Formato: ASCII text, DXF export
   - Strumenti: Geometric constraints, snap to design grid
   - Prezzo: Commerciale (università-based)
   - Fonte: JK Tech documentation [di seconda mano]

5. **O-Pitblast** (Orica subsidiary)
   - Tipo: Web-based (cloud)
   - CAD: 2D geometry editor per pit layouts
   - Formato: SVG, GeoJSON, formati GIS standard
   - Strumenti: Vector drawing, snap, layer control
   - Prezzo: SaaS (abbonamento)
   - Fonte: O-Pitblast web platform [di seconda mano]

6. **Datamine Studio** (Datamine Group — Hexagon)
   - Tipo: Desktop (Windows)
   - CAD: 3D modeler con wireframe e surface creation
   - Formato: DXF, proprietario Datamine
   - Strumenti: Polyline/polygon tools, layer management, dimensioning
   - Prezzo: Commerciale (enterprise)
   - Fonte: Hexagon/Datamine docs [di seconda mano]

7. **Hexagon Vulcan** (Hexagon)
   - Tipo: Desktop (Windows)
   - CAD: 3D CAD environment, geometric design tools
   - Formato: DXF/DWG, formati GIS
   - Strumenti: Full CAD suite (snap, layers, dimensions, symbols)
   - Prezzo: Commerciale (enterprise)
   - Fonte: Hexagon product suite [di seconda mano]

8. **Surpac** (Dassault Systèmes)
   - Tipo: Desktop (Windows)
   - CAD: 3D geometric modeling, mining-specific entities
   - Formato: DXF, proprietario Surpac
   - Strumenti: Polyline/polygon creation, layers, dimensioning
   - Prezzo: Commerciale (enterprise)
   - Fonte: Surpac documentation [di seconda mano]

### Capacità CAD comuni nel mercato

Analizzando gli 8 produttori sopra, i seguenti strumenti CAD sono **standard di settore**:

- **2D/3D Drawing environment**: Tutti i prodotti offrono almeno 2D, la maggior parte 3D
- **Primitive shapes**: Poligoni, polilinee, punti, circoli, rettangoli
- **Layer management**: Organizzazione di geometrie in strati
- **Snap-to-grid**: Allineamento su griglia per precisione
- **Dimensioning/Quotatura**: Aggiunta di misure e annotazioni
- **DXF/DWG support**: Standard de facto per interchange (AutoCAD)
- **Symbol/Block libraries**: Componenti riusabili (fori standard, esplosivi, etc.)
- **Undo/Redo**: Gestione della cronologia di editing
- **View controls**: Pan, zoom, rotate per navigazione

### Delta — prima lettura dell'agente (superficiale, dichiarata tale)

L'agente aveva letto solo in parte `genesi.html`/`genesi-data.js` prima che
il file venisse sovrascritto, e la sua stessa nota metodologica diceva
«non è stata ancora fatta analisi profonda». Il censimento riga-per-riga
qui sopra (sezione "Censimento Genesi") è più recente, più verificato
(con `grep` e numeri di riga) e lo sostituisce come riferimento sul delta;
questo elenco resta solo come traccia di che cosa l'agente aveva guardato:
CAD drawing primitives, layer management, snap-to-grid, DXF/DWG
import/export, dimensioning tools, symbol/block libraries, undo/redo,
layer-based filtering — di questi, il censimento sopra ha già corretto
alla prova del codice: layer management (presente), undo/redo (presente),
DXF import (parziale, presente), snap a griglia (presente e parziale).
Restano confermati assenti: DXF export, snap a oggetti, blocchi/simboli,
trasformazioni oltre il move, selezione multipla.

---

**Documento chiuso al:** 2026-09-19T11:45Z (dopo il recupero della sezione concorrenti)
