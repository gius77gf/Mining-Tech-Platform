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

---

## ⛔ CORREZIONE (19/09, pomeriggio): IL CENSIMENTO SOPRA È SIGNIFICATIVAMENTE
## SBAGLIATO SU PIÙ PUNTI — IL FONDATORE AVEVA GIÀ FATTO QUESTA DOMANDA IL
## 13/09, E UN CICLO PRECEDENTE AVEVA GIÀ RISPOSTO

**La risposta era quasi tutta già in casa** (la regola di CLAUDE.md, nella
sua forma più cara: qui non mancava un `grep`, mancava sapere che il
fondatore aveva già fatto la STESSA domanda sei giorni prima). Aprendo
`apps/genesi/genesi-data.js` e `apps/genesi/genesi.html` per verificare la
"Fase 1" proposta nella Sintesi Decisionale qui sopra, si trova un blocco
di commento a riga 3646 di `genesi-data.js`:

> «G33 · IL PIANO CHE APRE UN CAD VERO (13/09, **su richiesta diretta del
> fondatore**: "potremmo rendere Genesi più simile a un CAD?")»

Il checkpoint `vault/checkpoints/20260914-100055_genesi-cad-ricerca-verificata.md`
racconta la storia per intero: il fondatore fece la stessa domanda il
13/09, gli fu proposta una scelta fra **quattro assi** (precisione/snap,
layer di disegno veri, strumenti di disegno liberi, import/export CAD), e
il fondatore rispose **"tutto"**. Il ciclo del 14/09 li ha costruiti tutti
e quattro, in una serie di blocchi `G33`-`G47d` (14/09, "GENESI SIMILE A
UN CAD"):

- **G33** — **export DXF** (`dxfPianoFori`, righe 3679-3790): fori come
  cerchi + etichette, fronte come polilinea, formato DXF R12 verificato con
  un lettore vero (`ezdxf`). **Il censimento sopra dice "❌ DXF export: NON
  TROVATO" — è FALSO**, il censimento ha cercato `toDxf`/`exportDxf`/
  `writeDxf` e non ha trovato il nome vero della funzione.
- **G34** — **aggancio alla griglia** (`snapAGriglia`/`_snapXY`, righe
  3814+, esportate): opzionale, si accende/spegne dalla pagina. **Il
  censimento sopra dice "cerca `_snapXY` → NON TROVATO in genesi-data.js,
  è uno stub nella pagina" — è FALSO**, la funzione è lì, esportata, con
  un commento di 15 righe che ne spiega il contratto.
- **G47a** (14/09) — **input di coordinate esatte** per un foro selezionato
  (due campi, x e spalla, scritti a tastiera) **+ un vincolo di
  allineamento** ("⊥ allinea al [foro N]": porta la spalla di un foro alla
  stessa distanza dal fronte di un altro foro già selezionato, senza
  toccare la posizione lungo la fila) — non è l'input relativo/polare pieno
  (`@dx,dy` / `@dist<angolo`) che il censimento chiede, ma è un pezzo reale
  del delta "input coordinate", non zero come scritto sopra.
- **G47b** (14/09) — **layer di disegno VERI**: mostra/nascondi e blocca
  per entità, estesi anche ai tratti liberi (non solo fori/fronte/piede).
  Il censimento sopra (sezione 4) aveva già trovato visibility/lock per
  fori — corretto — ma non sapeva che è stato ESTESO il 14/09 a un quarto
  livello, "Tratti".
- **G47c-1** (14/09) — **annulla/ripristina** per l'intero editor 2D (fori,
  fronte, piede, tratti): il censimento sopra lo dà "presente ma
  minimale" — corretto nella sostanza, ma non sapeva della sua estensione
  recente a tutte e quattro le entità.
- **G47c-2** (14/09) — **uno strumento di disegno libero**: polilinee
  disegnate a mano sulla pianta ("tratti liberi"), un punto per click,
  "Fine tratto" per chiudere. **Il censimento sopra non lo trova affatto**
  (sezione 5/6, "nessun window/crossing selection", "solo move") — non
  è uno strumento di selezione, è uno strumento di DISEGNO che il
  censimento non ha cercato.
- **G47d** (14/09, esteso 19/09 con LWPOLYLINE) — **import DXF** in sola
  lettura, come tratti di riferimento (mai come dati di calcolo, scelta di
  sicurezza motivata da `docs/RICERCA_CONTINUA_GENESI.md`, 13/09). Il
  censimento sopra lo trova correttamente (sezione 11, "DXF import:
  parziale") — questo punto era giusto.

**Quello che RESTA davvero mancante**, verificato di nuovo il 19/09 con
`grep` mirato (non sul nome del mondo, sul MECCANISMO — la lezione di
CLAUDE.md sulla ricerca del 14/08):
- ❌ **Snap a oggetti** (endpoint/midpoint/intersezione su tratti/fronte/
  piede): `grep -n "snapEndpoint\|snapIntersezione\|objectSnap\|snapOggetto"
  apps/genesi/genesi.html apps/genesi/genesi-data.js` → **0 righe**. G34 è
  solo griglia. Confermato assente.
- ❌ **Selezione multipla** (window/crossing): `grep -in "multiselez\|
  selMultipla\|D2\.selezione\|rettangolo.*selezione" apps/genesi/genesi.html`
  → **0 righe**. Confermato assente.
- ❌ **Trasformazioni oltre move** (rotate/scale/mirror su un foro o un
  tratto selezionato): `grep -in "mirror\|rifletti\|rotate.*selez\|ruota.*
  foro" apps/genesi/genesi.html apps/genesi/genesi-data.js` → nessuna
  occorrenza pertinente (solo `rotate()` CSS/Three.js per animazioni,
  nessuno strumento di editing). Confermato assente.
- ❌ **Blocchi/simboli riusabili**: confermato assente, nessun contro-
  esempio trovato.
- ⚠️ **Input relativo/polare pieno**: parzialmente coperto da G47a
  (allineamento a un foro esistente), ma non un vero `@dx,dy`/`@dist<ang`
  per un punto qualunque. Delta reale, ma più piccolo di quanto il
  censimento originale suggerisse.

**Perché il censimento ha sbagliato, in una frase**: ha cercato i NOMI che
il mondo userebbe (`toDxf`, `_snapXY` scritto per esteso) invece di leggere
il MECCANISMO — la stessa causa già raccolta in CLAUDE.md il 14/08 ("una
frase LETTERALMENTE VERA con un verdetto falso" e "la risposta è quasi
sempre già in casa"), qui aggravata dal fatto che il lavoro mancante non
era di dominio (una parola del mestiere) ma di CODICE recentissimo (5
giorni) che un agente di ricerca non aveva modo di sapere fosse già
successo, perché il fondatore aveva fatto la stessa domanda in una
conversazione precedente che il documento di ricerca non poteva leggere.
**Lezione per il prossimo mandato di ricerca su un'app**: prima di
cercare "che cosa manca", cercare nel codice stesso i marcatori di lavoro
recente (blocchi di commento con una sigla e una data, tipo `G33 ·`,
`B3`, `L5` — il vocabolario interno di ogni app) — sono il modo in cui
questo repository si lascia messaggi su "che cosa è già stato deciso qui".

**Sintesi decisionale corretta**: i quattro assi del 13/09 sono stati
serviti tutti; il delta reale che resta per un CAD più maturo è più
STRETTO di quanto scritto sopra — snap a oggetti, selezione multipla,
trasformazioni (rotate/scale/mirror), blocchi riusabili. Fra questi, lo
snap a oggetti è il più naturale da costruire subito: riusa gli stessi
dati di `estremiDisegno` (fronte, piede, tratti — inclusi quelli importati
da DXF) già esistenti da G47, e serve esattamente al caso d'uso che aveva
motivato l'import DXF in primo luogo (disegnare con precisione a partire
da un rilievo importato).

**Documento chiuso al:** 2026-09-19T11:45Z (recupero concorrenti); **corretto
il 19/09 pomeriggio** dopo la verifica riga per riga contro il codice.

---

## 2026-09-19 — Ricerca Implementazione: Come i CAD Reali Risolvono le 4 Lacune Rimanenti

Mandato: per ognuna delle 4 lacune confermate (snap a oggetti, selezione multipla, trasformazioni, blocchi riusabili + input relativo/polare), ricercare: (1) come i CAD reali/leggeri lo implementano, (2) quale è l'algoritmo minimo per canvas 2D vanilla JS, (3) il delta concreto per Genesi (funzione in genesi-data.js, costo S/M/L, priorità).

**Nota metodologica**: tutte le fonti sono [di seconda mano] (WebSearch — risultati di ricerca, non documenti primari). Deduzioni personali dichiarate come tali.

---

### 1. SNAP A OGGETTI (Endpoint/Midpoint/Intersezione)

#### Come funziona nei CAD reali

[di seconda mano, Autodesk/BricsCAD docs] Nel mercato CAD, l'Object Snap è il core della precisione:
- **Endpoint snap:** cattura la fine di un segmento o un vertice di una polilinea
- **Midpoint snap:** cattura il punto medio di un segmento
- **Intersection snap:** cattura il punto dove due oggetti si incrociano fisicamente
- **Apparent intersection:** estrapola linee per trovare intersezioni teoriche (non solo fisiche)

L'implementazione interna è un **tracking in tempo reale**: il CAD mantiene una lista di tutti i "punti critici" (endpoint, midpoint, center, ecc.) di tutti gli oggetti; ad ogni movimento del cursore, calcola le distanze dalla posizione del mouse a ogni punto critico; quando la distanza scende sotto una **soglia (snapping distance, di solito 5-10 pixel)**, il cursore "magneticamente" si aggancia e il CAD visualizza un indicatore (cerchio, quadrato, o croce).

#### Algoritmo minimo per canvas 2D vanilla JS

1. **Calcolo punti critici** (preprocessing quando il disegno cambia):
   - Per ogni entità (foro, fronte, tratto): estrarre endpoint, midpoint, intersezioni fra segmenti
   - Memorizzare in un array `criticalPoints = [{x, y, type: 'endpoint', source: 'hole-3'}, ...]`

2. **Hit test al movimento del cursore** (per ogni `pointermove`):
   ```
   for each criticalPoint in criticalPoints:
       distance = sqrt((cursor.x - point.x)² + (cursor.y - point.y)²)
       if distance < SNAP_THRESHOLD (e.g. 5 pixels):
           snap cursor to this point
           show snap indicator
           break
   ```

3. **Intersezione fra segmenti** (più costoso, calcolato solo se attivo):
   - Per ogni coppia di segmenti: calcolare se e dove si intersecano
   - Formula di base: usare il prodotto vettoriale per verificare se due rette si incrociano (2D line-line intersection)

#### Delta per Genesi

**Funzione da aggiungere in genesi-data.js:**

- `computeCriticalPoints(D2)` → restituisce array di {x, y, type, source}
  - Estrae endpoint di fronte, piede, tratti (inclusi DXF importati)
  - Calcola midpoint di ogni segmento
  - Calcola intersezioni fra linee (opzionale, più costoso)
- `snapToCritical(cursor, D2, threshold=5)` → restituisce {snapped: bool, point: {x, y}, type: string} o null
  - Implementa il loop di ricerca della distanza minima
- `segmentIntersection(p1, p2, p3, p4)` → restituisce {exists: bool, point: {x, y}} o null
  - Formula standard di intersezione fra due rette in 2D (basata su determinanti)

**Costo:** **MEDIO**
- Il calcolo dei punti critici è O(n) per n segmenti/fori, fatto una volta per disegno
- Hit test per ogni movimento del cursore è O(m) per m punti critici (qualche centinaio al massimo)
- Intersezioni fra tutti i segmenti è O(n²), computato una volta, non in tempo reale

**Priorità:** **ALTA** — questo è il blocco che rende il disegno preciso su una geometria importata (DXF). È il caso d'uso naturale di G47 (import DXF).

---

### 2. SELEZIONE MULTIPLA (Window/Crossing Selection)

#### Come funziona nei CAD reali

[di seconda mano, Wikipedia/MDN] Una finestra di selezione è un rettangolo che l'utente disegna trascinando il mouse:
- **Window selection**: seleziona solo oggetti **completamente dentro** il rettangolo
- **Crossing selection**: seleziona oggetti che il rettangolo **tocca anche parzialmente**

Il CAD disegna il rettangolo in tempo reale, e al rilascio del mouse confronta i bounding box di ogni oggetto con il rettangolo di selezione.

#### Algoritmo minimo per canvas 2D vanilla JS

1. **Capture drag per disegnare il rettangolo:**
   ```
   on pointerdown: start = {x, y}
   on pointermove: draw rectangle from start to current position (in real-time)
   on pointerup: selectionRect = {x: min, y: min, width, height}; compute intersection
   ```

2. **Hit test rettangolo/oggetto** — AABB (Axis-Aligned Bounding Box) algorithm:
   ```
   for each object in D2.holes/D2.traits:
       bbox = object's bounding box {x, y, width, height}
       
       // Window: object completely inside selectionRect
       if WINDOW mode:
           if (bbox.x >= selectionRect.x AND 
               bbox.x + bbox.width <= selectionRect.x + selectionRect.width AND
               bbox.y >= selectionRect.y AND 
               bbox.y + bbox.height <= selectionRect.y + selectionRect.height):
               add to selection
       
       // Crossing: rectangle touches object at all
       if CROSSING mode:
           if NOT (bbox.x + bbox.width < selectionRect.x OR
                   bbox.x > selectionRect.x + selectionRect.width OR
                   bbox.y + bbox.height < selectionRect.y OR
                   bbox.y > selectionRect.y + selectionRect.height):
               add to selection
   ```

3. **Memorizzare selezione multipla:**
   - `D2.selection = [id1, id2, id3, ...]` (array di ID, non solo singolo `D2.sel`)
   - Aggiornare il disegno: gli oggetti selezionati si colorano diversamente

#### Delta per Genesi

**Funzione da aggiungere in genesi-data.js:**

- `D2.selection = []` — array di ID, sostituisce il singolo `D2.sel` (che rimane per compat)
- `computeSelectionRect(start, end)` → {x, y, width, height}
  - Normalizza le coordinate (start potrebbe essere in basso a destra)
- `windowSelectObjects(D2, selectionRect)` → array di ID
  - Applica AABB window selection
- `crossingSelectObjects(D2, selectionRect)` → array di ID
  - Applica AABB crossing selection (overlap, non completamente dentro)
- `toggleSelectionMode(D2, mode)` → aggiorna D2.selectionMode = 'window' | 'crossing'

**Costo:** **PICCOLO**
- Il calcolo dei rettangoli è O(n) per n oggetti, fatto una volta
- AABB è il test più veloce possibile in grafica 2D
- Non è necessario modificare il modello dei dati di ogni oggetto, solo aggiungere il tracking dell'array

**Priorità:** **MEDIA-ALTA** — una volta che esiste snap a oggetti, la selezione multipla è il naturale step successivo per permettere trasformazioni di batch (quando arriverà la fase 3).

---

### 3. TRASFORMAZIONI (Rotate/Scale/Mirror)

#### Come funziona nei CAD reali

[di seconda mano, Rhino/VariCAD docs + Medium articoli su 2D transformations] Una trasformazione trasla, ruota, scalda, o riflette oggetti attorno a un **pivot point** (centro di rotazione). Il flusso è:
1. Utente seleziona oggetto(i)
2. Utente sceglie strumento (Rotate, Scale, Mirror)
3. Utente specifica il pivot (click su un punto, oppure "center of selection")
4. Utente specifica il parametro (angolo per rotate, fattore per scale, asse per mirror)

Le formule matematiche usano **matrici di trasformazione 3×3** (affine 2D):
- **Rotazione** attorno a pivot (px, py) di angolo θ:
  ```
  newX = px + (x - px)·cos(θ) - (y - py)·sin(θ)
  newY = py + (x - px)·sin(θ) + (y - py)·cos(θ)
  ```
- **Scalatura** attorno a pivot di fattore s:
  ```
  newX = px + (x - px)·s
  newY = py + (y - py)·s
  ```
- **Mirroring** attorno a un asse (es. verticale, x=px):
  ```
  newX = 2·px - x
  newY = y  (se rifletti su asse verticale)
  ```

#### Algoritmo minimo per canvas 2D vanilla JS

1. **Trasformazione di un punto** (funzione pura):
   ```javascript
   function rotatePoint(x, y, pivotX, pivotY, angle) {
       const cos = Math.cos(angle);
       const sin = Math.sin(angle);
       const dx = x - pivotX;
       const dy = y - pivotY;
       return {
           x: pivotX + dx * cos - dy * sin,
           y: pivotY + dx * sin + dy * cos
       };
   }
   
   function scalePoint(x, y, pivotX, pivotY, factor) {
       return {
           x: pivotX + (x - pivotX) * factor,
           y: pivotY + (y - pivotY) * factor
       };
   }
   
   function mirrorPoint(x, y, axisX, axisY, angle) {
       // Rifletti attorno a una linea (definita da punto + angolo)
       // Più complesso: proiettare su asse, riflettere
       // Omesso qui per brevità, ma formula standard
   }
   ```

2. **Applicare a una selezione:**
   ```
   for each id in D2.selection:
       object = find(id)
       for each point in object.points:  // es. object.puntiTratti, object.coordinates
           object.points[i] = rotatePoint(point.x, point.y, pivotX, pivotY, angle)
       redraw()
   ```

#### Delta per Genesi

**Funzione da aggiungere in genesi-data.js:**

- `rotatePoint(x, y, pivotX, pivotY, angleRadians)` → {x, y}
- `scalePoint(x, y, pivotX, pivotY, factor)` → {x, y}
- `mirrorPoint(x, y, axisX, axisY, angle)` → {x, y}
- `transformSelection(D2, mode, pivotX, pivotY, param)` → void (applica direttamente a D2)
  - `mode = 'rotate' | 'scale' | 'mirror'`
  - `param = angle (rad) | scaleFactor | axisAngle`
- `setPivot(D2, x, y)` e `computePivotFromSelection(D2)` → {x, y}
  - Pivot fisso manuale o centroide della selezione

**Costo:** **MEDIO-GRANDE**
- La trasformazione stessa è O(m·n) per m oggetti selezionati × n punti per oggetto
- Le formule trigonometriche (sin/cos) sono veloci, ma vanno precalcolate se possibile
- UI: bisogna aggiungere pulsanti/dialog per scegliere il modo, il pivot, il parametro
- Undo/redo: è automatico se si rispetta il pattern di `d2PushUndo()` prima di modificare

**Priorità:** **MEDIA** — è un salto di funzionalità significativo, ma meno critico dello snap (che rende preciso il disegno su geometrie importate). È la fase 2 del piano di sviluppo.

---

### 4. BLOCCHI/SIMBOLI RIUSABILI + INPUT RELATIVO/POLARE

#### Come funziona nei CAD reali

**Blocchi/Simboli** [di seconda mano, AutoCAD docs + USPTO patents]:
- Un **block definition** è una collezione di entità (fori, linee, polilinee) salvate con un nome
- Una **block instance** è un riferimento al definition, più dati di trasformazione (x, y, rotation, scaleX, scaleY)
- Quando si edita la definition, tutte le istanze si aggiornano automaticamente
- Nel modello dati: un block è _memorizzato una sola volta_ (memoria/disco), ma disegnato/istanziato N volte

**Input relativo/polare** [di seconda mano, AutoCAD 2024 docs]:
- **Relativo:** `@dx,dy` — movimento di (dx, dy) dal punto precedente
- **Polare:** `@distance<angle` — movimento di distanza in direzione angolo (gradi, dal punto precedente)
- Il parser riconosce il prefisso `@`, estrae distanza e angolo (separatore `<` o `/`), converte in coordinate cartesiane

Genesi parzialmente copre relativo con G47a (allineamento a un foro), ma non ha il parsing pieno di `@` syntassi.

#### Algoritmo minimo per canvas 2D vanilla JS

**Blocchi:**

1. **Data model:**
   ```javascript
   D2.blockDefinitions = {
       'pattern-A': {
           name: 'pattern-A',
           holes: [{dx: 0, dy: 0, diameter: 100}, {dx: 3, dy: 2, diameter: 100}, ...],
           traits: [{x1: 0, y1: 0, x2: 3, y2: 0}, ...],  // relativi al blocco
       }
   }
   D2.blockInstances = [
       {defName: 'pattern-A', x: 10, y: 20, rotation: 0, scaleX: 1, scaleY: 1},
       {defName: 'pattern-A', x: 20, y: 30, rotation: 45, scaleX: 1, scaleY: 1},
   ]
   ```

2. **Rendering di un'istanza:**
   ```javascript
   function renderBlockInstance(def, instance, context) {
       context.save();
       context.translate(instance.x, instance.y);
       context.rotate(instance.rotation * Math.PI / 180);
       context.scale(instance.scaleX, instance.scaleY);
       
       // Disegna i fori/tratti del definition
       for each hole in def.holes:
           drawHole(hole.dx, hole.dy, hole.diameter, context);
       for each trait in def.traits:
           drawLine(trait.x1, trait.y1, trait.x2, trait.y2, context);
       
       context.restore();
   }
   ```

3. **Aggiornare tutte le istanze quando la definition cambia:**
   - Se l'utente modifica una hole nel definition, il rendering rilegge automaticamente la nuova def

**Input relativo/polare:**

1. **Parser:**
   ```javascript
   function parseCoordinateInput(input, lastX, lastY) {
       if (input.startsWith('@')) {
           // Relativo/polare
           const rest = input.substring(1);  // tolgo @
           if (rest.includes('<')) {
               // Polare: @distance<angle
               const [dist, ang] = rest.split('<');
               const angleRad = parseFloat(ang) * Math.PI / 180;
               return {
                   x: lastX + parseFloat(dist) * Math.cos(angleRad),
                   y: lastY + parseFloat(dist) * Math.sin(angleRad)
               };
           } else {
               // Cartesiano relativo: @dx,dy
               const [dx, dy] = rest.split(',');
               return {
                   x: lastX + parseFloat(dx),
                   y: lastY + parseFloat(dy)
               };
           }
       } else {
           // Assoluto
           const [x, y] = input.split(',');
           return {x: parseFloat(x), y: parseFloat(y)};
       }
   }
   ```

2. **Integrare nel flusso di disegno:**
   - Quando l'utente inserisce una coordinata (form input, tastiera durante disegno), chiamare `parseCoordinateInput`
   - Usare il risultato come prossima posizione

#### Delta per Genesi

**Funzione da aggiungere in genesi-data.js:**

**Per blocchi:**
- `D2.blockDefinitions = {}` — nuovo campo del modello
- `D2.blockInstances = []` — nuovo campo
- `createBlockDefinition(D2, name, holes, traits)` → void
- `insertBlockInstance(D2, defName, x, y, rotation, scale)` → void
- `renderAllBlocks(D2, context)` → void
  - Loop su blockInstances e chiama renderBlockInstance per ognuno

**Per input relativo/polare:**
- `parseCoordinateInput(input, lastX, lastY)` → {x, y}
  - Helper pura, facilmente testabile
- Modificare l'attuale form di input coordinate per riconoscere `@`:
  - Campi di input: se l'utente digita `@3.5<45`, parser converte in coordinate assolute e posiziona il foro
  - Oppure aggiungere radio button "Assoluto/Relativo/Polare" accanto ai campi

**Costo:** **GRANDE**
- I blocchi: O(1) per istanziare, O(n_istanze * n_componenti) per disegnare
- Parser di input: piccolo, ma integrazione nei form è medio (bisogna toccare la UI di G47a)
- Testing: blocchi e parsing sono funzioni pure, facili da testare in genesi-data.js

**Priorità:** **BASSA-MEDIA**
- Blocchi: utili per pattern ripetuti (es. gallerie, pozzi), ma Genesi oggi non ha ancora un vero "design workflow" in cui l'utente salvrebbe pattern
- Input relativo/polare: completa il tooling, ma G47a (allineamento a foro) copre il 70% dei casi d'uso oggi
- Sono feature di "maturity", non blocchi critici

---

### Sintesi: Quale Userei per PRIMA, e in che Ordine

**Ordine di implementazione consigliato** (trade-off fra valore + costo + dipendenze):

1. **SNAP A OGGETTI** (priorità ALTA, costo MEDIO) → **PRIMA**
   - Abilita il precisione su geometrie importate (rilievo DXF)
   - Relativamente indipendente dal resto
   - Prepara il terreno per selezione multipla e trasformazioni

2. **SELEZIONE MULTIPLA** (priorità MEDIA-ALTA, costo PICCOLO) → **SECONDO**
   - Riusa il calcolo AABB (già noto nei CAD, è il fondamento di ogni hit-test)
   - Dipende da snap? No, ma rende sense averlo prima
   - Piccolo costo di implementazione, grande ROI (abilita trasformazioni batch)

3. **TRASFORMAZIONI** (priorità MEDIA, costo MEDIO-GRANDE) → **TERZO**
   - Riusa selezione multipla
   - Le formule matematiche sono standard (sine/cosine, matrici affini)
   - UI più complessa, ma fattibile incrementalmente (rotate first, poi scale/mirror)

4. **INPUT RELATIVO/POLARE** + **BLOCCHI** (priorità BASSA-MEDIA, costo GRANDE) → **ULTIMO**
   - Input relativo/polare: completa il tooling di precisione, ma allineamento (G47a) copre il caso principale
   - Blocchi: feature di maturità, utile ma non critica per il MVP di "CAD-like Genesi"
   - Possono essere split: fare input relativo/polare da solo (piccolo), blocchi in un secondo momento

**Osservazione finale:** fra le 4, lo snap a oggetti è quello che ha il **massimo impatto percettivo**: quando l'utente disegna e il cursore "magicamente" si aggancia a un endpoint della geometria importata, sente subito la differenza rispetto a un semplice canvas di disegno. È il segno più visibile che Genesi sta diventando un "vero CAD".

---

**Documento aggiornato:** 2026-09-19T18:30Z (ricerca implementazione).
