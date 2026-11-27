# Tabelle dei fori e dati d'innesco elettronico: formati di scambio (Kirra come «stele di Rosetta»)

> **Come leggere queste note.** Ogni riga porta l'URL e un frammento testuale. La marcatura dice *come* è stata letta la fonte:
> - **[L] letta** = sorgente letto per intero e copiato alla lettera (clone git del repository pubblico, oppure PDF estratto in testo). È il livello più affidabile.
> - **[W] letta via WebFetch** = pagina aperta con lo strumento WebFetch. Lo strumento risponde attraverso un modello che riassume: le frasi fra virgolette sono quelle che lo strumento ha restituito come citazioni, ma non sono verificate carattere per carattere.
> - **[S] seconda mano** = solo snippet di ricerca; la pagina non è stata letta (bloccata o non raggiungibile). Il testo fra virgolette è quello restituito dallo strumento di ricerca e **può essere una parafrasi**: va riletto sulla pagina prima di scriverlo in una schermata.
>
> **Tre fatti di contesto che cambiano il peso di tutto il resto** (ricerca del 26/11/2026):
> 1. **Il codice dei parser/writer di Kirra Design NON è pubblico.** Il repository `github.com/brentbuffham/Kirra` e il suo wiki chiedono credenziali (`git ls-remote` → `fatal: could not read Username`). La documentazione stessa dichiara di aver tolto i «private wiki links». Quindi la richiesta «cita gli array di campi dal sorgente» è soddisfatta **solo indirettamente**: dalla documentazione (che in un commit dichiara di essere stata scritta leggendo `src/fileIO/TextIO/BlastHoleCSVPresetInfo.js`) e dai post pubblici dell'autore. Dove il layout non è pubblico è scritto «**formato non mostrato**».
> 2. **Kirra Design non è open-source**: è distribuita con «Kirra Licence v1.0». Open (MIT) sono solo repository satellite: `Kirra-2D` (vecchio prototipo 3D), `KirraScheduler`, `shotplan-web`.
> 3. **La prima stesura della documentazione Kirra (marzo 2026) conteneva layout inventati**, poi corretti: i motori di ricerca li servono ancora (varianti «20 / 25 colonne», sezione «BMM CSV»). Non vanno usati.
>
> Sorgenti clonati: `brentbuffham/kirra-docs` @ `fd571590` (26/11/2026, 596 commit), `brentbuffham/Kirra-2D` @ `b1bfa6d8` (17/08/2025), `brentbuffham/KirraScheduler` @ `12121eb1` (13/07/2026), `brentbuffham/EPIROCSurfaceManager` @ `e95aad15` (21/09/2026), `brentbuffham/shotplan-web` @ `bf4e7a29` (21/08/2026).
>
> Pagine NON leggibili (dichiarate): `support.blastiq.com` (403 su tre articoli), `fcc.report` (403), `manualshive.com` (pagina «Access Denied»), `georeference.org` (503), `docplayer.net` (host fuori dalla rete consentita), `manuals.online` (404), post buymeacoffee con etichetta CBLAST / Orica / Surpac / Wenco (la pagina-etichetta non mostra il corpo del post).

---

## 1. I preset CSV di Kirra (4, 7, 9, 12, 14, 29–35 colonne): ordine esatto, unità, angoli, ritardi

### Takeaway
I preset di Kirra sono CSV **a virgola, senza virgolette, punto decimale**, riconosciuti **solo dal numero di colonne**; l'ordine è sempre Est-Nord-Quota, colletto poi fondo foro, e il ritardo è **relativo** al foro `fromHoleID` in millisecondi. I preset lunghi (29–35) **non sono «14 + extra»**: dalla colonna 10 l'ordine cambia, e i preset 30/32 scritti da Kirra non coincidono col layout posizionale che l'importatore si aspetta per quei conteggi.

### Cited Findings

**Riconoscimento e conteggi ammessi**
- Il preset si sceglie dal numero di colonne: «The parser dispatches strictly on column count. It accepts files with **4, 7, 9, 12, 14, 29, 30, 31, 32 or 35** columns; any other count is skipped with a warning (unless the file has a header row…)» — **[L]** [csv-formats (pubblicata)](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [sorgente md](https://github.com/brentbuffham/kirra-docs/blob/main/importing/csv-formats.md)
- I file a 4/7/9/12 colonne non portano il nome della volata: «Files with 4, 7, 9 or 12 columns carry no blast name; their holes go into one blast named `BLAST_` followed by a short code.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- In esportazione i preset sono otto: «picking the preset is how you choose between the eight presets (4 / 7 / 9 / 12 / 14 / 30 / 32 / 35)» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**4 colonne** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Ordine: `holeID` · `X` «collar Easting (m)» · `Y` «collar Northing (m)» · `Z` «collar Elevation (m)». Fondo foro = colletto («Creates collar-only holes — toe coordinates default to the collar position»).
- Esempio riportato dalla pagina:
  ```
  H001,477750.5,6771850.2,335.0
  H002,477755.5,6771850.2,335.0
  ```
- Descrizione in-app: «`{holeID, startX, startY, startZ}` — Creates dummy holes (0 m length, collar = toe = imported XYZ).» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**7 colonne** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Ordine: `holeID` · colletto `X / Y / Z` · fondo `endX / endY / endZ`. Esempio: `H001,477750.5,6771850.2,335.0,477751.2,6771849.8,320.0`
- «Length, angle, and bearing are derived from the geometry. Diameter is left at 0 (a valid no-diameter hole).» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**9 colonne** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Aggiunge col. 8 `holeDiameter` (mm) e col. 9 `holeType` «e.g. `Production`, `Buffer`, `Presplit`, `Trim`».
- «Holes default to connecting to themselves with zero delay — set tying via hole properties.» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**12 colonne** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Aggiunge col. 10 `fromHoleID` «upstream hole in the timing chain», col. 11 `delay` «milliseconds relative to `fromHoleID`», col. 12 `color` «`#RRGGBB` hex, or a named colour like `red` / `blue`».

**14 colonne (formato consigliato per andata e ritorno)** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Ordine: 1 `entityName` (nome della volata) · 2 `entityType` (`hole`) · 3 `holeID` · 4–6 colletto `X / Y / Z` · 7–9 fondo `endX / endY / endZ` · 10 `holeDiameter` (mm) · 11 `holeType` · 12 `fromHoleID` · 13 `delay` (ms) · 14 `color`.
- Esempio riportato dalla pagina:
  ```
  Pattern_A,hole,H001,477750.5,6771850.2,335.0,477751.2,6771849.8,320.0,115,Production,,0,#FF0000
  Pattern_A,hole,H002,477755.5,6771850.2,335.0,477756.2,6771849.8,320.0,115,Production,Pattern_A:::H001,25,#FF0000
  ```
- Forma di `fromHoleID`: «in legacy single-entity files, just the holeID (e.g. `H001`). In multi-entity files (14-col), use `entityName:::holeID` (e.g. `Pattern_A:::H001`).»

**29–35 colonne: colonne 1–24 comuni** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Avvertenza testuale: «**29- to 35-column files are not "14 + extras".** Cols 1-9 match the 14-col layout, but from col 10 onward the order diverges — grade, subdrill, and bench come **before** `holeDiameter`.»
- Ordine: 1 `entityName` · 2 `entityType` («not read») · 3 `holeID` · 4–6 `startX, startY, startZ` · 7–9 `endX, endY, endZ` · 10–12 `gradeX, gradeY, gradeZ` («recalculated from subdrill») · 13 `subdrillAmount` («**Vertical** delta-Z (m), not along-hole») · 14 `subdrillLength` («Along-hole subdrill (m) (not read)») · 15 `benchHeight` («(m) (recalculated)») · 16 `holeDiameter` (mm) · 17 `holeType` · 18 `fromHoleID` · 19 `delay` · 20 `color` · 21 `holeLength` («Calculated (m) (recalculated)») · 22 `holeAngle` («Angle from vertical (`0` = vertical) (recalculated)») · 23 `holeBearing` («Azimuth clockwise from North (recalculated)») · 24 `holeTime` («Hole fire time (recalculated)»).
- «Grade, bench, length, angle, bearing and fire time are **recalculated** on import, so their columns can hold any value.»

**29–35 colonne: dalla colonna 25 (layout posizionale letto dall'importatore)** — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)

| Col | 29 / 30 colonne | 31 / 32 colonne | 35 colonne |
|---|---|---|---|
| 25 | `rowID` | `measuredLength` | `measuredLength` |
| 26 | `posID` | `measuredMass` | `measuredLengthTimeStamp` |
| 27 | `burden` | `rowID` | `measuredMass` |
| 28 | `spacing` | `posID` | `measuredMassTimeStamp` |
| 29 | `connectorCurve` | `burden` | `measuredComment` |
| 30 | (ignored) | `spacing` | `measuredCommentTimeStamp` |
| 31 | — | `connectorCurve` (32-column files only) | `rowID` |
| 32 | — | (ignored) | `posID` |
| 33 | — | — | `burden` (m) |
| 34 | — | — | `spacing` (m) |
| 35 | — | — | `connectorCurve` |

(tabella copiata dalla pagina) — «Empty `rowID` / `posID` parse as `null`.»

**I preset 30 e 32 *scritti* da Kirra hanno un altro layout dalla colonna 25**
- «Kirra's own **30 Column** and **32 Column** exports write the measured fields (with timestamps) from column 25 and carry a header row of Kirra field names. A 29-32 column file with that header is read **by name**, so Kirra's exports round-trip. A headerless 29-32 column file is read in the older positional layout shown in the table.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Il messaggio del commit che ha fissato i layout dichiara la fonte e l'ordine del writer: «Read src/fileIO/TextIO/BlastHoleCSVPresetInfo.js for the exact column order. […] cols 25-30  measuredLength + ts, measuredMass + ts, measuredComment + ts / 32-col adds rowID, posID (cols 31-32); empty parses to null. / 35-col adds burden, spacing, connectorCurve (cols 33-35).» — **[L]** [commit 4486179](https://github.com/brentbuffham/kirra-docs/commit/4486179965cd530722cc32b38d491dae473665ba)
- **Contraddizione interna alla documentazione**: la pagina di esportazione dice invece «The **30** and **32** presets write measured fields from column 25, which the importer does not expect for those counts — use **14** or **35** for Kirra-to-Kirra round trips.» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html); contraddetta da [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) («read by name, so Kirra's exports round-trip»).
- Descrizioni in-app: 30 = «Standard round-trip without rowID / posID / burden / spacing / connectorCurve. Preserves grade points, subdrill, bench, timing, and measured fields.» · 32 = «30-column + `rowID` + `posID`» · 35 = «**Complete** — every blast hole property the parser reads back». — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**Riga d'intestazione**
- Regola di rilevamento: «A header row is detected when any of columns 4-6 (collar X/Y/Z) in one of the first three lines is non-numeric, and the line has at least 6 columns.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Nomi di campo che Kirra scrive in intestazione (solo tre sono citati): «the names Kirra itself writes, such as `holeID`, `startXLocation`, `holeDiameter`». La riga d'intestazione completa dei preset lunghi: **formato non mostrato** nella documentazione pubblica. — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- I nomi interni completi dei campi (utili come candidati di intestazione) sono elencati nella pagina delle proprietà: `entityName`, `entityType`, `holeID`, `startXLocation, startYLocation, startZLocation`, `endXLocation, endYLocation, endZLocation`, `gradeXLocation, gradeYLocation, gradeZLocation`, `subdrillAmount`, `subdrillLength`, `benchHeight`, `holeDiameter`, `holeType`, `holeLengthCalculated`, `holeAngle`, `holeBearing`, `fromHoleID`, `timingDelayMilliseconds`, `colorHexDecimal`, `measuredLength, measuredMass, measuredComment`, `burden, spacing`, `rowID, posID`, `visible`. — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)

**Definizioni geometriche**
- Angolo: «**holeAngle** | Angle from vertical (0° = vertical, 90° = horizontal)» · Direzione: «**holeBearing** | Bearing from north (clockwise)» — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)
- Formule: «**HoleLength** | `√(ΔX² + ΔY² + ΔZ²)`» · «**VerticalDrop** | `StartZ - EndZ = BenchHeight + SubdrillAmount`» · «**HoleAngle** | `arccos(VerticalDrop / HoleLength)`» · «**HoleBearing** | `atan2(ΔX, ΔY)`» — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)
- Sottoperforazione, due campi: «**subdrillAmount** | Vertical distance (deltaZ) from grade to toe — positive = downhole» · «**subdrillLength** | Vector distance from grade XYZ to toe XYZ — positive = downhole» · «**benchHeight** | DeltaZ from collar to grade (always absolute)» — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)
- Assi: X = Est, Y = Nord, Z = quota («**X** | East-West (meters east)», «**Y** | North-South (meters north)») · Direzione: 0° Nord, 90° Est, 180° Sud, 270° Ovest. — **[L]** [coordinate-system](https://brentbuffham.github.io/kirra-docs/reference/coordinate-system.html)
- Angolo contro inclinazione: «**Hole Angle** | 0° = vertical (straight down) | 90° = horizontal» / «**Dip (Mast Angle)** | 90° = vertical | 0° = horizontal»; nota: «Surpac uses -90 for vertical down.» — **[L]** [coordinate-system](https://brentbuffham.github.io/kirra-docs/reference/coordinate-system.html)

**Ritardi e legami**
- Colonna `delay` nei preset lunghi: «**Relative** milliseconds. Accepts `na` / `n/a` / `null` / `nan` (case-insensitive) → stored as no delay, for the harness-wire / null-connector convention» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- In scrittura: «Missing numeric values are written as `0.0000` so the file stays parseable in strict CSV readers. A hole with no delay is written as `NA`.» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Tempo assoluto → ritardo (solo Custom CSV): «If the CSV provides absolute `holeTime` but no `timingDelayMilliseconds`, Kirra walks the timing graph and derives each delay as `myTime − fromHoleTime`.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)

**Unità, separatori, limiti del parser**
- «**Units** — Coordinates in metres, diameter in millimetres, delays in milliseconds. Bare numbers, no unit suffixes.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- «**Holes CSV / TXT (preset columns)** has no File units: it always writes metres.» · «**Decimal separator** — period (`.`); 4 decimal places by default» · «**File encoding** — UTF-8 (no BOM)» · «**Visible holes only.** Hidden holes are filtered out at export» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- «The parser splits on every comma — quoted fields are not recognised.» · «Comma-decimal locales (`12,5`) are **not** supported.» · «**Strict column count.** […] a hand-crafted file with the wrong count will parse as the wrong variant.» · Valori di ripiego: «`holeDiameter = 0`, `holeType = "Undefined"`, `delay = 0`, `color = "red"`». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Coordinate non valide non fermano l'import: «`end ← collar` (zero-length / dummy hole) when the toe is bad» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)

**CSV dei dati misurati (9 colonne)**
- Intestazione in import: `EntityName,EntityType,HoleID,MeasuredLength,LengthTimeStamp,MeasuredMass,MassTimeStamp,Comment,CommentTimeStamp`; «A first line containing `EntityName` is treated as a header.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- In export i nomi dichiarati sono diversi: «9 columns in this order: `entityName`, `entityType`, `holeID`, `measuredLength`, `measuredLengthTimeStamp`, `measuredMass`, `measuredMassTimeStamp`, `measuredComment`, `measuredCommentTimeStamp`» — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**Custom CSV (mappatura libera) — le scelte che Kirra chiede all'utente**
- «**Angle Convention** | **Angle (0° = vertical)**, Kirra's own, or **Dip (0° = horizontal)**, converted as 90 − value.» · «**Diameter Units** | **mm**, **m** or **inches** — converted to mm on import.» · separatore: «comma, tab, semicolon and so on — is detected automatically». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Priorità della geometria quando il file ne dà più d'una: «1. **Collar + Toe** coordinates (overrides L/A/B if both present) 2. **Collar + Length / Angle / Bearing + Subdrill** (forward calc) 3. **Toe + L/A/B + Subdrill** (reverse calc — collar back-derived from toe) 4. **Collar + L/A/B only** (subdrill defaults to 1) 5. **Collar only** (length = `benchHeight + subdrill`, angle = 0, bearing = 0)». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Sottoperforazione negativa: «**Negative below grade** — tick it when the file stores subdrill as a negative number below grade, as BlastLogic's *Design charge standoff* does.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Intestazioni riconosciute da sole: «`Hole ID`, `HoleID`, `BlastHoleId`» → `holeID`; «`Easting`, `East`, `Collar X`, `Start X`» → `startXLocation`; «`Bearing`, `Azimuth`» → `holeBearing`; e una scelta dichiarata: «A bare `X`, `Y` or `Z` header is deliberately **not** matched: it would also match `EndX`, `ToeX` and so on.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Piedi: «**US survey foot (1200/3937 m)**»; «Over a big northing they don't [agree]: at 6,770,000 m they're about 44 ft apart.»; le lunghezze sono lette sempre in piedi internazionali, gli angoli e i tempi «are never converted». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Colonne di carica scritte da Kirra: intestazioni fra parentesi quadre «such as `deckType[1]` or `primerDepth[2]`»; una versione precedente della pagina nominava anche «`deckBaseFormula[N]`, `primerDetonatorDelayMs[N]`». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [csv-export @5bb39bd](https://github.com/brentbuffham/kirra-docs/blob/5bb39bd9135e900241478406ded7243ad7292f02/exporting/csv-export.md)

**Dove sta (e non sta) il codice**
- Nomi dei file sorgente citati dalla documentazione prima di essere rimossi: «`src/fileIO/TextIO/BlastHoleCSVParser.js`», «`src/fileIO/TextIO/BlastHoleCSVWriter.js`, `CustomBlastHoleTextWriter.js`», registro dei formati «`src/fileIO/init.js`». — **[L]** [csv-formats @5bb39bd](https://github.com/brentbuffham/kirra-docs/blob/5bb39bd9135e900241478406ded7243ad7292f02/importing/csv-formats.md) · [supported-formats @97b3399](https://github.com/brentbuffham/kirra-docs/blob/97b3399ce1d7fb62a89b9a488663acf2a9254d70/reference/supported-formats.md)
- Rimozione dichiarata: «Private wiki links and source-file references removed from the CSV pages and the pitfalls page.» — **[L]** [commit ffb49bf](https://github.com/brentbuffham/kirra-docs/commit/ffb49bf228e11c82a9209a34e9e9e0ec7501f26c)
- Licenza: «Kirra Design is distributed under the **Kirra Licence v1.0** (2026)»; solo lo Scheduler è indicato come pubblico («Kirra Scheduler is publicly available: github.com/brentbuffham/KirraScheduler»). — **[L]** [about](https://brentbuffham.github.io/kirra-docs/about.html)
- Il repository pubblico `Kirra-2D` (MIT) è un prototipo vecchio con un altro CSV: i campioni hanno intestazione `Hole Name,Collar X,Collar Y,Collar Z,Toe X,Toe Y,Toe Z,diameter,subdrill,shape` (10 col.) o con `,holeColour` in coda (11 col.); prima riga dati di `10Holes.csv`: `1,478808.41,6772359.09,395.19,478808.41,6772359.09,392.5,127,0.2,mesh-cross`. — **[L]** [csv-samples/10Holes.csv](https://github.com/brentbuffham/Kirra-2D/blob/main/csv-samples/10Holes.csv) · [SUBSET_BLAST_11_COLUMN.csv](https://github.com/brentbuffham/Kirra-2D/blob/main/csv-samples/SUBSET_BLAST_11_COLUMN.csv)
- Nel loader di quel prototipo il diametro ha due letture: `const diameter_2 = parseFloat(row[Object.keys(row)[columnOrder.diameter - 1]] * 1000); // if diameter is in meters` e `const diameter_1 = parseFloat(row[Object.keys(row)[columnOrder.diameter - 1]]); // if diameter is in mm`. — **[L]** [fileCSVLoader.js](https://github.com/brentbuffham/Kirra-2D/blob/main/src/file/import/fileCSVLoader.js)
- Il file di progetto `.kap` è un archivio: «KAP is a ZIP archive containing JSON files: manifest.json, holes.json, drawings.json, surfaces.json, products.json, charging.json, configs.json, layers.json» (commento nel sorgente MIT dello Scheduler). — **[L]** [kapImport.js](https://github.com/brentbuffham/KirraScheduler/blob/main/src/io/kapImport.js)

**Avviso sulle versioni vecchie della pagina**
- La stesura di marzo 2026 descriveva varianti a «20» e «25» colonne e una 35 che finiva con «Visible»; è stata riscritta. Una sezione era dichiaratamente inventata: «The section was fabricated and has been removed.» (BMM CSV). — **[L]** [csv-formats @4f4ceac](https://github.com/brentbuffham/kirra-docs/blob/4f4ceac8efac1e30bc7edecd1ebbb50d13c25f02/importing/csv-formats.md) · [commit 3dd5489](https://github.com/brentbuffham/kirra-docs/commit/3dd548933b7537d6418029675d1fbbb4ad7a6bf9)

### Inferences
- *(deduzione)* Il layout dei preset 30/32 **scritti** da Kirra è: colonne 1–24 comuni + `measuredLength`, timestamp, `measuredMass`, timestamp, `measuredComment`, timestamp (30) + `rowID`, `posID` (32). Lo si ricava combinando il messaggio del commit 4486179 con la frase «write the measured fields (with timestamps) from column 25»; nessuna pagina pubblica lo mostra come tabella.
- *(deduzione)* Per un programma terzo il bersaglio più sicuro è il **14 colonne** (unico dichiarato «recommended round-trip format» e uguale in lettura e scrittura) oppure il **35**, mai il 30/32: la documentazione stessa si contraddice su quei due.
- *(deduzione)* Poiché grade, banco, lunghezza, angolo, direzione e tempo vengono **ricalcolati** all'import, in Kirra la verità geometrica è la coppia colletto–fondo più `subdrillAmount`; chi scrive un file per Kirra può lasciare quelle colonne a qualunque valore, ma chi **legge** un file di Kirra non deve fidarsi che `holeTime` sia coerente se il file è stato ritoccato a mano.
- *(deduzione)* Il separatore `:::` dentro `fromHoleID` e l'assenza di virgolette implicano che un nome di volata o un ID foro contenente una virgola rompe il file senza errore.

### Gaps
- **Array di campi e stringhe d'intestazione dal sorgente**: non ottenibili — `github.com/brentbuffham/Kirra` e il wiki sono privati. Riga d'intestazione esatta dei preset 30/32/35: *formato non mostrato*.
- Layout del preset «All Columns» visto nell'interfaccia di `blastingapps.com/dist/kirra.html` (**[W]**: voci «30 Column», «32 Column», «35 Column», «All Columns»): non documentato.
- Unità e formato di `connectorCurve` e formato dei timestamp misurati: non indicati.
- Non è stato aperto il pacchetto dell'applicazione distribuito nella cartella `downloads/` del repository dei documenti: sarebbe lettura di un binario di software sotto licenza, fuori dal perimetro («niente decompilazione»).

---

## 2. Formati di terze parti letti/scritti da Kirra e che cosa rivelano del loro layout

### Takeaway
Kirra dichiara 31 importatori e 39 esportatori, ma **la documentazione pubblica descrive il comportamento, quasi mai la tabella dei campi**; i layout verificabili alla lettera sono solo quattro: Epiroc (geofence/sockets e convenzione X=Nord), IREDES (struttura XML, dal post dell'autore e dallo schema ufficiale), intestazioni Surpac STR/DTM (da un file campione) e i file di carica `products.csv` / `chargeConfigs.csv`. Per CBLAST, ParVS3, VXT, BPD, IKN, SPF, AQM, Wenco NAV il layout colonna per colonna è **non mostrato**.

### Cited Findings

**Matrice dichiarata**
- «**31 importers** and **39 exporters** in Kirra's file registry (CSV and DXF variants count separately)»; «**Not supported:** Orica SPF export, DetNet `.vs3` binary». — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- L'autore stesso avverte che gli export sono poco collaudati: «File format outputs are still largely untested against live field data» (presentazione ISEE) e «**Other formats may also be untested**». — **[L]** [kirra-presentation.html](https://brentbuffham.github.io/kirra-docs/ISEE-presentation/kirra-presentation.html) · [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)

**IREDES XML (Epiroc)**
- Scambio di assi: «IREDES files store coordinates Y before X; Kirra swaps them.» e «IREDES uses X for Northing and Y for Easting. Kirra handles the swap automatically on export.» — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html) · [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Struttura del file come la descrive l'autore di Kirra (post pubblico «Part 2»): radice `DRPPlan`, namespace `http://www.iredes.org/xml/DrillRig` e `http://www.iredes.org/xml` (prefisso `IR`); intestazione `IR:GenHead` con `IR:FileCreateDate` e `IR:IRversion`; `IR:PlanId`, `IR:PlanName`, `IR:Comment`, `IR:Project`, `IR:WorkOrder`; `DrillPosPlan`; `DrillPlan` con `NumberOfHoles` e `Hole`; coda `IR:GenTrailer` con `IR:FileCloseDate` e `IR:ChkSum`. Esempio di foro riportato dallo strumento:
  ```xml
  <Hole>
    <HoleId>BH001</HoleId>
    <HoleName>BH001</HoleName>
    <StartPoint>
      <IR:PointX>7654321.000</IR:PointX>  <!-- Northing (Y) -->
      <IR:PointY>321456.000</IR:PointY>   <!-- Easting (X) -->
      <IR:PointZ>450.500</IR:PointZ>      <!-- Elevation (Z) -->
    </StartPoint>
    <EndPoint>
      <IR:PointX>7654321.500</IR:PointX>
      <IR:PointY>321456.200</IR:PointY>
      <IR:PointZ>438.000</IR:PointZ>
    </EndPoint>
    <TypeOfHole>Production</TypeOfHole>
    <DrillBitDia>251</DrillBitDia>
    <MwdOn>1</MwdOn>
    <HoleOptions xmlns:opt="opt">
      <opt:HoleData>
        <ExtendedHoleStatus>Undrilled</ExtendedHoleStatus>
      </opt:HoleData>
    </HoleOptions>
  </Hole>
  ```
  Checksum (riassunto dello strumento, non citazione): CRC32 calcolato sul testo con `<IR:ChkSum></IR:ChkSum>` vuoto, conservando i fine riga `\r\n`, scritto in decimale; limiti di schema riportati: 1000 fori per piano, 10 bracci, 1000 segmenti di linea. — **[W]** [buymeacoffee.com/brentbuffham/iredes](https://buymeacoffee.com/brentbuffham/iredes)
- Schema ufficiale, tipo `DRholeType` (ordine dei figli): `HoleId` (1..1, «Hole id code. To uniquely identify each hole in the plan.») · `HoleName` (0..1) · `StartPoint` (`IR:IRpointType`, 1..1) · `EndPoint` (`IR:IRpointType`, 1..1) · `TypeOfHole` (0..1) · `DrillBitDia` (`xsd:unsignedShort`, «Drill bit diameter. UNIT: mm») · `DrillBitType` · `RollAngle` · `MwdOn` (`xsd:boolean`) · `HoleOptions`. — **[W]** [iredes.org/irdocs/drholetype.html](https://iredes.org/irdocs/drholetype.html)
- Schema ufficiale, `DrillPlan`: `NumberOfHoles` («Total number of holes in plan») · `Hole` (`DRholeType`, 1..1000) · `BoomSeq` (0..10) · `LineTable` · `EquipmentData` · `DrillBits`. — **[W]** [iredes.org/irdocs/drillplan.html](https://iredes.org/irdocs/drillplan.html)
- Il fondo foro contiene già la sottoperforazione: «None of the subdrilling values are used; they are all set to No because the End point value includes the subdrilling depth.»; «The orientation, inclination, and length properties are calculated using the Start Point and the End Point values in the file.» — **[W]** [Trimble Business Center — Import IREDES](https://help.fieldsystems.trimble.com/tbc/12438.htm)
- Versione di schema indicata dall'autore: «Schema Version: V 1.3», namespace «http://www.iredes.org/xml/DrillRig». — **[L]** [README EPIROCSurfaceManager](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/README.md)

**Epiroc Surface Manager (`.geofence`, `.hazard`, `.sockets`, piano di perforazione testuale)** — manuale ufficiale Epiroc «Surface Manager Version 2.19, 2019-07-12», ospitato nel repository pubblico
- Sistema di riferimento del piano testuale: «Left hand coordinate system where X is pointing north, Y pointing east and Z is pointing up.» · «Bearing — 0 degrees is pointing in positive X direction. 90 degrees is pointing in positive Y direction.» · «Vertical Angle — The angle between Z axis and hole vector described by start position in XY and end position in XY.» (pp. 133–134) — **[L]** [SurfaceManager.en.pdf](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Il formato testuale del piano **non è fisso**, è una mappatura configurabile: «Select the delimiter used in the text file. Default value for Basic text format is Tab.» · «Number of Header Rows […] Default value for Basic text format is 1» · «Convert From US Survey Feet to Meters» · «Default Hole Length — When end point is omitted the value is used to calculate end point from start point.» · «Convert from start XYZ and end XYZ or convert from end XYZ and calculate start XYZ using angles.» · «Column Number (Column Mappings) — The order of the column to map. First column starts with 1.» (pp. 131–133) — **[L]** [SurfaceManager.en.pdf](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Geofence e sockets: «1 — Header row. This row will be ignored in the parsing, but must contain at least one character. / 2…n — Points in the geofence. One point per row that specifies X and Y coordinates separated with comma. E.g. 10, 12 will generate a point with X=10 and Y=12.» Esempio del manuale:
  ```
  X,Y – put any text here
  10,20
  30,30
  30,50
  20,60
  ```
  (pp. 77 e 79) — **[L]** [SurfaceManager.en.pdf](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Nomi dei piani: «In case of exporting to SmartROC equipment, drill plan names can only have a-z, A-Z, 0,9, _.» (p. 75) — **[L]** [SurfaceManager.en.pdf](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Lato Kirra: «Import Epiroc Surface Manager coordinate files (`.geofence`, `.hazard`, `.sockets`, `.txt`). These use Y,X (Northing, Easting) coordinate ordering.»; per geofence, hazard e sockets «Kirra asks for the **Elevation (Z)** to place them at». — **[L]** [other-formats @6b8f75f](https://github.com/brentbuffham/kirra-docs/blob/6b8f75f9ab4d4f39942710dfb8625a0325059d82/importing/other-formats.md) · [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- Post dell'autore («Part 1»): «All Epiroc formats use Y, X order (Northing first, Easting second).»; esempio `7654100.0000,321000.0000`; consiglio di evitare i commenti `#`; «practical limit: 150 points to avoid rig issues» per `.geofence`. — **[W]** [buymeacoffee — epiroc-surface-manager-file-format-specification](https://buymeacoffee.com/brentbuffham/epiroc-surface-manager-file-format-specification)
- Query SQL dell'autore: «`RawStartPointY` → `Collar_X`», «`RawStartPointX` → `Collar_Y`». — **[L]** [README EPIROCSurfaceManager](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/README.md)

**Surpac `.str` (stringhe) e `.dtm`**
- Ordine delle coordinate: «Surpac writes coordinates as **Northing (Y), Easting (X), Elevation (Z)** — the reverse of the usual X, Y, Z.»; «Kirra reads both text and binary `.str` files.» — **[L]** [surpac-dtm-str](https://brentbuffham.github.io/kirra-docs/importing/surpac-dtm-str.html)
- I fori come stringhe: «Each hole in the string file is a collar point and a toe point. Surpac stores extra information about each point in its **descriptor** fields (D1, D2 …), and different sites put different things there — so Kirra asks what each one holds.» Scelte offerte: «**Hole ID**, **Length**, **Diameter**, **Subdrill**, **Dip**, **Angle**, **Bearing**, **Burden**, **Spacing**, **Hole Type**, or **(Ignore)**». — **[L]** [surpac-dtm-str](https://brentbuffham.github.io/kirra-docs/importing/surpac-dtm-str.html)
- Layout di partenza nominati: «**Survey (10-field)**, **Survey (5-field)** or **Surpac 6.3 DrillBlast**»; di quest'ultimo: «maps D3 to Hole ID, D4 to Length, D5 to Diameter and so on»; diametro «**metres (×1000)** or **millimetres**». — **[L]** [surpac-dtm-str](https://brentbuffham.github.io/kirra-docs/importing/surpac-dtm-str.html)
- Schema testuale STR (da una versione **precedente** della pagina — stesura iniziale, meno affidabile):
  ```
  filename, dd-Mmm-yy,,description
  0, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000
  32000, Y1, X1, Z1,
  32000, Y2, X2, Z2,
  ...
  0, 0.000, 0.000, 0.000, END
  ```
  con «String number `32000` indicates surface vertices». — **[L]** [surpac-dtm-str @867185e](https://github.com/brentbuffham/kirra-docs/blob/867185e6c07747219e09d73587a753d7de153aa5/importing/surpac-dtm-str.md)
- Schema testuale DTM (stessa versione precedente): `filename.str,` / `0, 0.000, 0.000, 0.000, END` / `OBJECT, 1,` / `TRISOLATION, 1, neighbours=no,validated=true,closed=no` / `1, 2, 3, 1, 0, 0, 0,` — «Each triangle line contains: Triangle ID, Vertex 1, Vertex 2, Vertex 3, and three neighbour references (0 = boundary edge).» — **[L]** [surpac-dtm-str @867185e](https://github.com/brentbuffham/kirra-docs/blob/867185e6c07747219e09d73587a753d7de153aa5/importing/surpac-dtm-str.md)
- **Riscontro su file vero** (campione pubblico, corpo binario): prima riga `mka_pd_stg4_202406_v1,11-Jun-24,,ssi_styles:survey.ssi`, seconda riga `0,           0.000,           0.000,           0.000,           0.000,           0.000,           0.000`; il `.dtm` gemello apre con `mka_pd_stg4_202406_v1.str,0887930400;algorithm=standard;fields=x,y`. Le due righe d'intestazione confermano lo schema sopra. — **[L]** [mka_pd_stg4_202406_v1.str](https://github.com/brentbuffham/Kirra-2D/blob/main/csv-samples/mka_pd_stg4_202406_v1.str) · [.dtm](https://github.com/brentbuffham/Kirra-2D/blob/main/csv-samples/mka_pd_stg4_202406_v1.dtm)
- Campi standard secondo un altro produttore: «the standard fields in a SURPAC string file are STRING NUMBER, Y,X,Z, DESCRIPTION»; numeri di stringa «in the range 1-98»; Vulcan non legge i binari («import of .str and .dtm binary files are not supported») e pretende «two header records». — **[S]** [Datamine SUPEST](https://docs.dataminesoftware.com/StudioRM/3.0/Process_Help_XML/supest.htm) · [Maptek Vulcan — Import Surpac](https://help.maptek.com/vulcan/2026/topics/File/Import/File_Import_Surpac_DesignStringsV1.htm)
- Micromine `.str` è un'altra cosa: «Not the same format as a Surpac `.str`.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)

**CBLAST (`.csv`)**
- «4 records per hole: HOLE, PRODUCT, DETONATOR, STRATA.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- Che cosa ne ricava il parser: «Diameter is read in **metres** and converted to millimetres.» · «Angle is from vertical, as in Kirra. Holes come in with no subdrill — the grade is at the toe.» · «A hole with no explosive product is typed **No Charge**; the rest are **Production**.» · «The delay comes from the hole's first detonator record.» · «Decks are built from the product lengths. Product densities are not in the file». — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- I nomi dei prodotti sono testo libero: «CBLAST files contain product names (e.g. "ANFO 0820", "Stemming") but not product properties like density, VOD, or energy. […] **Product names in the CBLAST file must match exactly** (case-sensitive)». — **[L]** [other-formats @6b8f75f](https://github.com/brentbuffham/kirra-docs/blob/6b8f75f9ab4d4f39942710dfb8625a0325059d82/importing/other-formats.md)
- **Attribuzione incoerente del formato** nella stessa documentazione: «Orica CBLAST CSV […] for Orica systems» in una pagina, «Carlson / CBLAST blast design CSV» in un'altra. — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html); contraddetta da [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Campi e ordine di ciascun record: **formato non mostrato**.

**Orica SHOTPlus `.spf` (solo lettura)**
- «ZIP archive containing XML blast data. SPF export is not implemented.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- Contenuto letto: «Hole positions come from the design coordinates, or the actual coordinates where there is no design.» · «**Ties** come across with their delays and colours.» · «Burden and spacing are kept where the file has them.» · «**Products and charging** are built, with the tie types linked to their products.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Provenienza dichiarata dei file di riferimento: «Orica — SHOTPlus format reference files» (ringraziamenti). — **[L]** [release-notes](https://brentbuffham.github.io/kirra-docs/release-notes.html)
- Nomi degli elementi XML: **formato non mostrato**.

**Orica i-kon `.ikn` (solo scrittura, non verificato)**
- «ZIP wrapper around `TimingPlan.xml`. **Export has not yet been verified against an Orica i-kon logger / SHOTPlus** — treat as preliminary.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- Schema di `TimingPlan.xml`: **formato non mostrato**.

**DetNet / Dyno Nobel DigiShot 4G — `.parvs3`**
- «CSV-formatted, same layout both directions. The `.parvs3` extension keeps it apart from other CSV formats.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- «Reads a DigiShot 4G `.parvs3` file — one row per deck, with absolute delays on the explosive decks. The file needs **Hole ID**, **Collar X** and **Deck Number** columns.» · «Diameters of 5 or less are taken as metres; a missing diameter defaults to 115 mm.» · «Hole angles are read between 0° and 90°, so up-holes are not supported.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- In scrittura: «Row-per-deck with absolute delays on explosive decks; primer rows land on the deck containing the primer». — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Elenco completo delle colonne oltre le tre obbligatorie: **formato non mostrato**.

**DetNet ViewShot — `.vxt` sì, `.vs3` no**
- «Reads a ViewShot project saved as **ViewShot Text (`.vxt`)**. The binary `.vs3` format is not supported: open the file in ViewShot and use **File → Save As → ViewShot Text (.vxt)** first.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Perché il binario è escluso: «Binary layout is not fully reverse-engineered and ViewShot rejects round-tripped exports. Use `.vxt` instead.» — **[L]** [supported-formats @97b3399](https://github.com/brentbuffham/kirra-docs/blob/97b3399ce1d7fb62a89b9a488663acf2a9254d70/reference/supported-formats.md)
- Contenuto: «**Products, decks, primers and harness wire** are built»; «A file holding several patterns gives one blast per pattern.»; «Chevrons, outlines and text in the project come in as drawings». — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Sintassi del `.vxt`: **formato non mostrato**.

**Davey Bickford — `.bpd`**
- «Reads a Davey Bickford blast plan (`.bpd`). These files hold positions in latitude and longitude […] **Select current projection** — already set to WGS84, the system BPD files use». — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Non porta la geometria del foro: «A blast plan carries positions and timing, not hole geometry. Holes come in vertical, with placeholder diameter, grade, angle, bearing and subdrill, and a default charge.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Natura del file (versione precedente della matrice): «XML blast plan. CRC validated on load.» — **[L]** [supported-formats @97b3399](https://github.com/brentbuffham/kirra-docs/blob/97b3399ce1d7fb62a89b9a488663acf2a9254d70/reference/supported-formats.md)
- Nomi degli elementi: **formato non mostrato**.

**Scelta automatica del formato di timing elettronico**
- «Electronic timing exports use the **Electronic Timing** row on the **Blasts** tab of the Export dialog. It picks **Davey BPD**, **Orica IKN** or **DetNet CSV** from your blast's detonator system; you can override the choice in the row's dropdown.» — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)
- Il percorso del filo è un dato del foro: «**Path / channel** — a number, or a letter (A, B, C …) for systems that identify paths by letter.» più un numero di «**commander** (or equivalent firing-unit)». — **[L]** [harness-wire-assignment](https://brentbuffham.github.io/kirra-docs/charging/harness-wire-assignment.html)

**Austin Powder Paradigm Terra — `.blst`**
- «Reads a Paradigm Terra `.blst` scene (Format 21 or later).» · «The **active charge scenario** becomes the holes' charging.» · «**Timing scenarios** are added to the **Electronic Timing** list.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)

**Cat MineStar AQM (solo scrittura)**
- «Export blast hole data to Cat MineStar Activity Queue Manager CSV format. Supports dynamic column ordering -- you specify which columns to include and their order in the export dialog.» — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Testo nell'interfaccia della versione ospitata: «MINESTAR - AQM - Outputs up to 11 columns (Angle, Azimuth, Diameter, etc.)». — **[W]** [blastingapps.com/dist/kirra.html](https://blastingapps.com/dist/kirra.html)
- Estensione incoerente nella documentazione: `.csv` nella matrice, `.aqm` nella pagina di export. — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html); contraddetta da [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Elenco delle undici colonne: **formato non mostrato**. Nessun DXF «Aquila» è documentato in Kirra.

**DXF dei fori**
- Standard a due livelli: «`HOLES` | A circle at the collar (sized to the hole diameter), a line from collar to toe, and small circles at the grade and toe» · «`HOLE_TEXT` | The hole ID as text at the collar». Variante Vulcan: «Each hole is written as a 3D POLYLINE through collar, grade and toe, with Vulcan XData tags (including the hole name).» — **[L]** [dxf-export](https://brentbuffham.github.io/kirra-docs/exporting/dxf-export.html)

**Maptek Vulcan `.arch_d`**
- «3-point holes are interpreted as `collar → grade → toe` (sub-drilled); 2-point holes are interpreted as `collar → toe` with no sub-drill.»; il file non porta il diametro: «Vulcan stores no hole diameter -- it stores a rig *name*». — **[L]** [other-formats @6b8f75f](https://github.com/brentbuffham/kirra-docs/blob/6b8f75f9ab4d4f39942710dfb8625a0325059d82/importing/other-formats.md) · [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)

**Wenco NAV, KML, LAS, GeoTIFF**
- Wenco: «Wenco NAV ASCII | `.nav` | […] TEXT, POINT, LINE entities.»; «triangle records become a surface. Binary NAV files are not supported». Sintassi dei record: **formato non mostrato**. — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html) · [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- KML come tabella fori: «Hole details are read from a placemark's description as `{key:value}` pairs, and from its **ExtendedData** fields […] The field names are Kirra's: `diameter`, `calculatedHoleLength`, `subdrillAmount`, `holeType`.» — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- LAS e GeoTIFF non portano fori: sono nuvole di punti e raster («ASPRS LAS / LAZ | LAS versions 1.0 to 1.4», «GeoTIFF (raster) | Elevation rasters and RGB / RGBA imagery»). — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)

**File di carica di Kirra (ZIP con due CSV)**
- `products.csv`, colonne obbligatorie `ProductName`, `Type`, `Density` («Bulk density in g/cc»); esempio d'intestazione: `ProductName,Type,Density,VOD,RWS,Colour,Notes`. `chargeConfigs.csv` è **trasposto**: `Type,Description,Field,[1],[2],[3]`, con innesco scritto come `{1,fx:chargeBase-0.3,Det{GENERIC-MS},HE{BS400G}}`. — **[L]** [products-csv](https://brentbuffham.github.io/kirra-docs/charging/products-csv.html)

**Formati storici (utili come esempio di «ritardo scritto come nome»)**
- SHOTPlan 3 `.xel`: «A ShotPlan plan names its surface connectors (`TLD 42`, `CD 17`, `MSC 175`) rather than storing their delays, so Kirra reads the delay from the name.»; «ShotPlan keeps 8 significant figures. Coordinates over 1,000,000 (most UTM northings) lose precision». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html) · [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Dal parser MIT pubblico di quel formato: «Numeric columns are Pascal `write(x:width)` fields, not whitespace-delimited.» e «`1.0000000E+20` is the *undefined* sentinel (used for RL)». — **[L]** [shotplan-web/src/format/xel.js](https://github.com/brentbuffham/shotplan-web/blob/main/src/format/xel.js)
- Datavis DBS `.sgf`: «The files hold no surface ties and no firing times. Each hole has its downhole detonator delay only». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)

### Inferences
- *(deduzione)* I formati d'innesco elettronico non sono tabelle uniformi: **BPD** = posizioni geografiche + tempi senza geometria; **ParVS3** = una riga per deck con ritardo **assoluto**; **CBLAST** = record eterogenei per foro; **IKN** = XML dentro uno ZIP. Un convertitore «tabella fori → logger» deve quindi scegliere a monte se il ritardo è relativo (stile Kirra) o assoluto (stile ParVS3) e se la chiave è il foro o il deck.
- *(deduzione)* La frase «same layout both directions» per ParVS3 e l'obbligo di «Hole ID, Collar X, Deck Number» indicano un CSV **con intestazione per nome** (non posizionale), ma l'elenco completo non è pubblico.
- *(deduzione)* Lo scambio X/Y di IREDES non è una stranezza del file ma la convenzione del costruttore («X is pointing north»): vale per tutta la famiglia Epiroc, testo compreso.
- *(deduzione)* Per Surpac il vero problema non è la sintassi ma il **significato dei descrittori D1…Dn**, che cambia da sito a sito: Kirra lo risolve chiedendo la mappatura invece di indovinarla.

### Gaps
- Layout campo per campo di CBLAST, ParVS3, VXT, BPD, IKN (`TimingPlan.xml`), SPF, AQM, Wenco NAV, STR «Surpac 6.3 DrillBlast» (D6 e seguenti): *formato non mostrato* in fonti pubbliche raggiungibili.
- I post dell'autore con etichetta **CBLAST**, **Orica**, **Surpac**, **Wenco** esistono (`buymeacoffee.com/brentbuffham/posts/270296`, `/273904`, `/270284`, `/270555`) ma la pagina mostra solo l'elenco, non il corpo: non letti. Sono il candidato più promettente per colmare il buco.
- `iredes.org`: non letta la definizione di `IRpointType` (PointX/PointY/PointZ) né un file DRPPlan ufficiale d'esempio; un altro ricercatore copre IREDES in dettaglio.
- Nessuna fonte trovata su un «DXF Aquila» o sul formato nativo MineStar; `georeference.org/forum/t8632` (un thread con un `.str` vero) ha risposto 503.

---

## 3. Sistemi d'innesco elettronico: quale file si carica nel logger/blaster per assegnare i ritardi

### Takeaway
Dai manuali pubblici risulta che **nessun logger accetta direttamente un CSV generico di ritardi**: il CSV entra nel *software di progetto del produttore* (ViewShot 3D, SHOTPlus, BlastMap, Paradigm, HiPlanner), che poi manda al dispositivo un piano proprietario. I layout di colonna di quei CSV non sono pubblicati; l'unica eccezione trovata è Hanwha, dove un manuale parla di un «CSV design file» importato sul terminale, ma la pagina non è leggibile.

### Cited Findings

**Dyno Nobel / DetNet — DigiShot Plus 4G, CE4 Tagger, ViewShot 3D**
- Sequenza del manuale (p. 95): «3. Design Plan» · «Import the .CSV file» · «Create the timing design» · «Create the tag path for each string» · «4. Send design to (Tagger)» · «Click on FILE» · «Click "Device Communication"» · «Select either "Send Plan Locations Only (4G only)" or "Send to Device"». — **[W]** [ManualsLib — DigiShot Plus 4G, p. 95](https://www.manualslib.com/manual/2787868/Digishot-Plus-4g.html?page=95)
- Il piano arriva al Tagger solo da ViewShot: «The data written into the detonator is taken from a plan downloaded into the CE4 Tagger via ViewShot 3D.» (p. 90) · «Users can download 10 different plans into the CE4 Tagger.» (p. 92) · «Download the Plan (via ViewShot 3D on the PC) onto the CE4 Tagger to enable the use of the Tag by Plan option.» (p. 94) · «The ViewShot 3D plan will be displayed as a list.» (p. 100) — **[W]** [ManualsLib — DigiShot Plus 4G](https://www.manualslib.com/manual/2787868/Digishot-Plus-4g.html)
- Tre modalità di tagging: «"Basic (B)", "Advanced (A)", and "Planned (P)"» (p. 55); «With the Planned (P) tagging option, both the location and a delay must be written into the detonator.» (p. 90) — **[W]** [ManualsLib — DigiShot Plus 4G](https://www.manualslib.com/manual/2787868/Digishot-Plus-4g.html)
- Dal manuale del CE4 Tagger: «Rows can be tagged in any order. Row numbers have to be manually changed.»; «Absolute delays must be manually assigned to Special detonators according to the blast plan.» — **[S]** [fcc.report — CE4 Tagger UTM-00330](https://fcc.report/FCC-ID/2ARNH-13631680/4152985.pdf)
- «Allows for 10 ViewShot® plans to be stored on the CE4 Tagger.» — **[S]** [dynonobel.com — DigiShot Plus 4G](https://www.dynonobel.com/apac/recent-innovations/digishot-plus-4g)
- ViewShot «imports data from third-party planning software» (articolo di settore 2012, formato non descritto). — **[S]** [womp-int.com](https://womp-int.com/story/2012vol12/story025.htm)
- Colonne del CSV importato da ViewShot: **formato non mostrato**. Lato Kirra il ponte è `.vxt` / `.parvs3` (vedi sezione 2).

**Orica — i-kon, SHOTPlus**
- Esportazione al logger: dal calcolo «EBS logging report», con anteprima di tempi e assegnazione fori; frasi riportate dallo snippet: «The Logger screen can manage up to 16 characters. It is important to keep the following limits for successful exports.» e «The file name will show the Logger number and Blaster number in this format L01B1»; i limiti, nel riassunto dello strumento (non citazione): 8 caratteri per l'ID foro, 16 per il tipo di foro, 16 per il titolo della volata. Ritorno con la funzione «Import from Logger». — **[S]** [BlastIQ — How to export and import between SHOTPlus UG and i-kon loggers](https://support.blastiq.com/hc/en-us/articles/360035592453-How-to-export-and-import-between-SHOTPlus-UG-and-i-kon-loggers) (pagina 403 al tentativo di lettura)
- Regole sugli ID: «enforce renaming of duplicate Hole IDs before allowing export for i-kon logger exports»; «Hole IDs with letters as a suffix (eg: A1R) are now exportable to Logger II but prevented from export to Logger I». — **[S]** [BlastIQ — SHOTPlus Release Notes](https://support.blastiq.com/hc/en-us/articles/36049051382297-SHOTPlus-Release-Notes-6-1-1-6-6-8-1)
- Esistono file `.IKN` importabili in SHOTPlus: corretto un difetto per cui «when importing a .IKN file, SHOTPlus was not importing some holes with hole angles close to 360°». — **[S]** [BlastIQ — SHOTPlus Release Notes](https://support.blastiq.com/hc/en-us/articles/35474900024473-SHOTPlus-Release-Notes-6-9-3-6-12-1)
- Import testuale in SHOTPlus (File → Import → Text file): si tolgono le intestazioni e si trascina ogni etichetta sulla colonna; gruppi di nomi di colonna «Common, Design, Measurements, Design Loading and Actual Loading»; opzione «Update existing holes by ID»; «the text files must have the same number of columns». — **[S]** [BlastIQ — Text Importer](https://support.blastiq.com/hc/en-us/articles/360042885414-Text-Importer) · [Importing Text File Data to SHOTPlus](https://support.blastiq.com/hc/en-us/articles/1500000678582-Importing-Text-File-Data-to-SHOTPlus)
- Campi di progetto nominati: «Design Collar X/Y/Z, Design Angle, and Design Bearing» contro «Drilled Angle and Drilled Bearing». — **[S]** [BlastIQ — SHOTPlus Blasthole Refactor](https://support.blastiq.com/hc/en-us/articles/16706499384729-SHOTPlus-Blasthole-Refactor)
- WebGen: nessuna fonte trovata.

**BME — AXXIS Titanium, BlastMap, XPLOLOG**
- «Import/export AXXIS electronic delay detonator IDs and design timing.» · «Export design information to a .csv file.» · «This allows for integration with 3rd party software such as drill navigation software for drilling according to the design.» · «Import wizard to import any .txt or .xlsx data file from third-party software.» · «Import or export planned data to Xplolog's hole and deck data capturing software.» — **[W]** [bme.co.za/blastmap](https://bme.co.za/blastmap)
- XPLOLOG: «Import design data from any blast design software through the import wizard.»; registra «actual dipping (incl. first dipped), priming, charging, top up and stemming values»; «Add and delete unplanned holes to a designed blast.» — **[W]** [bme.co.za/xplolog](https://bme.co.za/xplolog/)
- Tempo di progetto «exported directly to the Titanium logger» (dichiarazione a stampa). — **[S]** [miningweekly.com](https://www.miningweekly.com/article/blast-planning-taken-to-new-heights-2020-04-13)
- Colonne e formato del file verso il logger: **formato non mostrato**.

**Austin Powder — E\*STAR, Paradigm**
- «Import data from XLSX and CSV files, specify where the data is defined and what units to read it as.» · «Or import existing timing designs from .xlsx or .csv». — **[W]** [paradigm.austinpowder.com/Features](https://paradigm.austinpowder.com/Features)
- Paradigm «will export hole data (such as collar/toe positions, charging, timing and more) to a csv file» e può «export timing to Austin Powder timing loggers and Enaex loggers». — **[S]** [paradigm.austinpowder.com](https://paradigm.austinpowder.com) (le due frasi non sono state ritrovate nella pagina `/Features` letta)
- File di scena `.blst` «Format 21 or later» (letto da Kirra). — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)

**Davey Bickford (Enaex) — Daveytronic, D2D**
- File del piano `.bpd`: posizioni in latitudine/longitudine WGS84 più tempi, senza geometria del foro (vedi sezione 2). — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Il software ha un «import converter» per coordinate e dati «from formats such as CSV and Excel» (articolo su Daveytronic III). — **[S]** [constructionequipmentguide.com](https://www.constructionequipmentguide.com/daveytronic-iii-digital-blasting-system-enhances-safety/11717)
- Manuale D2D con le colonne: non trovato.

**Hanwha — HiTRONIC / HEBS II**
- Snippet del manuale HEBS II (p. 21): file CSV salvato nel percorso condiviso del terminale TC56, cartella «HiPlanner», poi «IMPORT DESIGN FILE». — **[S]** [manualshive.com — Hanwha HEBS II](https://manualshive.com/en/manual/hanwha/hebs-ii/3713709) (pagina «Access Denied» al tentativo di lettura)
- Colonne del CSV: **formato non mostrato**.

**Chi dichiara di esportare verso quali sistemi (lato software di progetto)**
- DataBlast Pro, «Timing Export Types»: «Austin Powder E\*Star», «Daveytronic», «Daveytronic Synchro», «Dyno DigiShot Plus 4G (Commander)», «Dyno DigiShot Plus», «Dyno DigiShot», «Dyno SmartShot 2 Wire», «Dyno SmartShot 4 Wire», «Dyno SmartShot», «Orica i-kon». — **[W]** [DataBlast 2.14 — Maintain electronic detonator systems](https://docs.dataminesoftware.com/DataBlast/Pro/2.14/K-System-Administration/Product-Maintenance/Maintain-Electronic-Detonator-Systems.htm)
- Parametri per apparecchiatura nella stessa pagina (sono i vincoli che un file deve rispettare): «Path Prefix», «Use Path Letter», «Detonator Number Format», «Number Dets Independently», «Max Dets Per Blast», «Max Blasting Groups/Boxes», «Max Wiring Paths», «Max Dets Per Hole», «Max Dets Per Wiring Path», «Min Delay», «Max Delay», «First Det Number Offset», «Launch External Programmer», «External Programmer Path». — **[W]** [DataBlast 2.14](https://docs.dataminesoftware.com/DataBlast/Pro/2.14/K-System-Administration/Product-Maintenance/Maintain-Electronic-Detonator-Systems.htm)
- Kirra: «It picks **Davey BPD**, **Orica IKN** or **DetNet CSV** from your blast's detonator system». — **[L]** [supported-formats](https://brentbuffham.github.io/kirra-docs/reference/supported-formats.html)

**Riepilogo: chi accetta un CSV «semplice»**

| Sistema | Dove entra il CSV | Che cosa va al dispositivo | Colonne pubblicate? |
|---|---|---|---|
| Dyno/DetNet DigiShot Plus 4G | ViewShot 3D («Import the .CSV file») | piano ViewShot via «Device Communication» | no |
| Orica i-kon | SHOTPlus (import testo a colonne trascinate) | export al logger (file `L01B1`); esiste `.IKN` | no (solo nomi di gruppi) |
| BME AXXIS | BlastMap («any .txt or .xlsx») | timing al logger Titanium | no |
| Austin E\*STAR | Paradigm (XLSX/CSV con unità) | export ai logger Austin/Enaex | no |
| Davey Bickford | software del produttore (CSV/Excel) | `.bpd` | no |
| Hanwha HiTRONIC | terminale TC56 / HiPlanner («IMPORT DESIGN FILE») | — | no |

(fonti: le righe sopra)

### Inferences
- *(deduzione)* L'attributo che tutti i sistemi chiedono oltre al ritardo non è una coordinata ma il **percorso di collegamento**: stringa/tag path (DetNet), wiring path e «path letter» (DataBlast), logger + blaster (Orica), path/channel + commander (Kirra). Un file di soli «foro, ritardo» è insufficiente per quasi tutti.
- *(deduzione)* I limiti che fanno fallire un export non sono nel formato ma nei vincoli del sistema: lunghezza dell'ID foro (8 caratteri in i-kon), ID duplicati, numero massimo di detonatori per percorso, ritardo minimo/massimo. Sono dati di configurazione, non di file.
- *(deduzione)* I ritardi scritti nel detonatore sono **assoluti** (tempo di sparo): lo confermano «absolute delays on the explosive decks» (ParVS3) e «Absolute delays must be manually assigned» (CE4). Un modello dati a ritardi relativi deve risolvere la catena prima di esportare.

### Gaps
- Nessun manuale pubblico leggibile mostra le **colonne** del CSV di ViewShot 3D, SHOTPlus → logger, BlastMap → AXXIS, Paradigm → E\*STAR, D2D, HiPlanner.
- Sasol/Enaex (oltre alla citazione indiretta via Paradigm), DetNet come prodotto autonomo, Orica WebGen: nessuna fonte trovata.
- Tutti gli articoli BlastIQ sono risultati 403 alla lettura: le voci Orica sono di seconda mano. `docplayer.net` («SHOTPlus Standard Inputs and Outputs») è fuori dalla rete consentita.
- Non è stato verificato in nessun manuale se il numero di serie/ID del detonatore viaggi nel file di progetto (BME lo dichiara: «detonator IDs and design timing»; per gli altri non risulta).

---

## 4. Come i software di blast design esportano il timing

### Takeaway
L'unico export documentato con chiarezza è quello di Datamine DataBlast: un CSV in cui **i fori sono in ordine di percorso di cablaggio** (elettronico) o alfanumerico (non elettrico), con ritardi e coordinate di colletto e fondo, e con **separatore che segue le impostazioni regionali di Windows**. Per Deswik, O-Pitblast e JKSimBlast non è stata trovata documentazione pubblica dell'export verso detonatori elettronici.

### Cited Findings

**Datamine DataBlast Pro**
- Elettronico: il CSV elenca «the holes in the order of the wiring path(s), with their delays and the co-ordinates of their collars and toes.» Comando: «Export Electronic Timing» nel nastro Reports. — **[W]** [DataBlast 2.13 — Export Timing to a CSV File](https://docs.dataminesoftware.com/DataBlast/Pro/2.13/H-Initiation-Module/Export-Timing-to-a-CSV-File.htm)
- Non elettrico: «For non-electric pattern, the exported .csv file (see File Formats) lists the holes in alphanumerical order, with their delays, the co-ordinates of their collars and toes and their depths.» — **[S]** [DataBlast 2.9 — Export Timing to a CSV File](https://docs.dataminesoftware.com/DataBlast/Pro/2.9/H-Initiation-Module/Export-Timing-to-a-CSV-File.htm)
- Separatore: «The separator character aligns with your Windows regional settings.» — **[W]** [DataBlast 2.13](https://docs.dataminesoftware.com/DataBlast/Pro/2.13/H-Initiation-Module/Export-Timing-to-a-CSV-File.htm)
- Nomi delle colonne: **formato non mostrato** (la pagina «File Formats» elenca solo le estensioni: per `.csv` dice che «The separator need not be a comma»). — **[W]** [DataBlast 2.13 — File Formats](https://docs.dataminesoftware.com/DataBlast/Pro/2.13/B-Introduction-Topics/File-Formats.htm)
- Import del reticolo (utile per capire che cosa DataBlast considera minimo): «The minimum data to define each hole is:» nome del foro, X/Y/Z del colletto, e le coordinate del fondo («preferred») oppure direzione, inclinazione e lunghezza. Tipi di colonna: «Collar Easting (X), Collar Northing (Y), Collar RL (Z), Drill Toe Easting (X), Drill Toe Northing (Y), Drill Toe RL (Z), Hole Depth, Diameter, Angle, Bearing, Hole ID, Charge Depth, and Custom Properties». Preselezionati: «Hole ID, Collar Easting (X), Collar Northing (Y), Collar RL (Z), Bearing, Angle and Hole Depth». — **[W]** [DataBlast 2.14 — Import a drill pattern](https://docs.dataminesoftware.com/DataBlast/Pro/2.14/D-Design-Module/Import-a-Drill-Pattern.htm)
- Opzioni d'import: delimitatore «Comma, Tab, Semicolon and Space; or enter a character for Other»; decimale «Period and Comma; or enter a character for Other»; migliaia «None, Period and Comma»; unità «Millimetres, Centimetres, Metres, Kilometres, Feet and Inches»; «Zero Angle Style» (vedi sezione 5). — **[W]** [DataBlast 2.14 — Import a drill pattern](https://docs.dataminesoftware.com/DataBlast/Pro/2.14/D-Design-Module/Import-a-Drill-Pattern.htm)
- Formati proprietari nominati: `.dbif` «DataBlast Design Interchange File», `.dcit` «DataBlast CSV Import Template», `.cfg` per le perforatrici Wenco. — **[W]** [DataBlast 2.13 — File Formats](https://docs.dataminesoftware.com/DataBlast/Pro/2.13/B-Introduction-Topics/File-Formats.htm)
- La struttura dell'export verso le perforatrici Flanders ARDVARC è **configurabile dall'utente**, non fissa: lo schermo serve a «edit the structure of data to be exported from DataBlast Pro to a Flanders ARDVARC drill system». — **[W]** [DataBlast 2.10 — Flanders ARDVARC Blast Plan File Import Specification](https://docs.dataminesoftware.com/DataBlast/Pro/2.10/M-DataBlastScreens/SCREEN-FlandersARDVARCBlastPlanFileImportSpecification.htm)

**Maptek BlastLogic**
- Import/export generici: «Blasts or selection of holes as comma-separated values (CSV) files or AutoCAD DXF files»; verso Orica: «Hole actual parameters and charge plans for importing into SHOTplus». Nessun sistema d'innesco nominato nella pagina. — **[W]** [BlastLogic 2026 — Data](https://help.maptek.com/blastlogic/2026/topics/menus-and-tools/home/data.htm)
- Colonne consigliate per i dati di perforazione: «collar X, collar Y, collar Z, angle, bearing, length, and hole ID». — **[W]** [BlastLogic 2026 — Data](https://help.maptek.com/blastlogic/2026/topics/menus-and-tools/home/data.htm)
- Un export BlastLogic reale ha 217 colonne (dato riportato da Kirra: «the example below is a 217-column BlastLogic design export»). — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)

**Kirra**
- Export «Charging Timing»: «`charging-timing` | Computed deck fire times»; export «Electronic Timing» in `.bpd` / `.ikn` / `.csv` secondo il sistema del detonatore. — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Nel Custom CSV i campi di timing selezionabili sono: «From Hole ID, Timing Delay (ms), Initiation Time, Tie Color» e, per innesco, «Detonator Delay (ms)», «Total Downhole Delay (ms)». — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)

**JKSimBlast 2DBench**
- «Report option exports the blast to a text file (lines, labels, holes, nodes, decks, delays in the same format as the Copy function)»; import minimo: «one point or hole per line, with E and N coordinates». — **[S]** [Scribd — 2DBench Tutorial](https://www.scribd.com/document/484597154/2DBench-Tutorial-pdf) (caricamento non ufficiale, versione non verificata)
- Un export dedicato «to electronic detonator»: non trovato.

**BME BlastMap, Austin Paradigm**
- BlastMap: «Export design information to a .csv file.» — **[W]** [bme.co.za/blastmap](https://bme.co.za/blastmap)
- Paradigm: export CSV di «collar/toe positions, charging, timing». — **[S]** [paradigm.austinpowder.com](https://paradigm.austinpowder.com)

### Inferences
- *(deduzione)* In DataBlast l'**ordine delle righe è informazione**: nel file elettronico la sequenza è quella del percorso di cablaggio, cioè l'ordine in cui i detonatori vengono letti dal logger. Riordinare il CSV (per esempio per nome foro) cambia il significato del file.
- *(deduzione)* Un CSV esportato su un PC italiano da DataBlast userà con ogni probabilità **`;` come separatore** e, di conseguenza, la virgola decimale — esattamente la combinazione che il parser dei preset di Kirra dichiara di non leggere («Comma-decimal locales […] are **not** supported»).
- *(deduzione)* Il minimo comune fra i programmi è: ID foro, colletto X/Y/Z, fondo X/Y/Z (preferito alla terna direzione/inclinazione/lunghezza perché non dipende da convenzioni angolari), ritardo.

### Gaps
- Deswik (OPDB) e O-Pitblast: nessuna documentazione pubblica dell'export di timing trovata; le ricerche hanno restituito solo pagine di altri produttori.
- Nomi delle colonne del CSV di timing di DataBlast: non pubblicati nelle pagine lette.
- JKSimBlast: solo copie non ufficiali su Scribd, non lette.
- La pagina Maptek Vulcan «Import Blast Holes — CSV Mapping» è stata aperta ma lo strumento ha restituito solo il menu di navigazione (pagina da 356.896 caratteri): contenuto non letto.

---

## 5. Le convenzioni che più spesso rompono gli scambi

### Takeaway
Le rotture non dipendono dalla sintassi dei file ma da **otto ambiguità ricorrenti**: origine dell'angolo (verticale o orizzontale), ordine Nord/Est, unità del diametro, definizione di sottoperforazione, ritardo relativo o assoluto, separatore decimale, presenza o assenza della geometria, lunghezza e unicità degli ID. Ogni programma documentato offre un interruttore per alcune di esse e tace sulle altre.

### Cited Findings

**Angolo dalla verticale o inclinazione dall'orizzontale**
- Kirra: «**Hole Angle** | 0° = vertical (straight down) | 90° = horizontal» / «**Dip (Mast Angle)** | 90° = vertical | 0° = horizontal»; conversione «`90 − value`». — **[L]** [coordinate-system](https://brentbuffham.github.io/kirra-docs/reference/coordinate-system.html) · [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Surpac: «Surpac uses -90 for vertical down.» — **[L]** [coordinate-system](https://brentbuffham.github.io/kirra-docs/reference/coordinate-system.html)
- DataBlast, «Zero Angle Style» (esempio del manuale): «hole angles are measured from the horizontal plane; that is, a vertical hole measured downwards is 90°.»; il valore predefinito è quello del sito. — **[W]** [DataBlast 2.14 — Import a drill pattern](https://docs.dataminesoftware.com/DataBlast/Pro/2.14/D-Design-Module/Import-a-Drill-Pattern.htm)
- BlastLogic espone la scelta: «"Angle (from horizontal)" or "Angle (from vertical)"». — **[W]** [BlastLogic 2026 — Data](https://help.maptek.com/blastlogic/2026/topics/menus-and-tools/home/data.htm)
- Rilievi di deviazione: «**Inclination (0° = vertical)** or **Dip (−90° = vertical)**». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- Epiroc: «Vertical Angle — The angle between Z axis and hole vector». — **[L]** [SurfaceManager.en.pdf, p. 134](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- ParVS3: «Hole angles are read between 0° and 90°, so up-holes are not supported.» — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)

**Direzione (bearing/azimut)**
- Kirra: oraria da Nord, «`atan2(ΔX, ΔY)`». — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)
- BlastLogic ha due versi: «"Bearing (top down)" or "Bearing (bottom up)"». — **[W]** [BlastLogic 2026 — Data](https://help.maptek.com/blastlogic/2026/topics/menus-and-tools/home/data.htm)
- Epiroc: 0° = +X, e +X è il **Nord**. — **[L]** [SurfaceManager.en.pdf, pp. 133–134](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Vicino a 360° si rompe: SHOTPlus «was not importing some holes with hole angles close to 360°» da `.IKN`. — **[S]** [BlastIQ — SHOTPlus Release Notes](https://support.blastiq.com/hc/en-us/articles/35474900024473-SHOTPlus-Release-Notes-6-9-3-6-12-1)
- Rilievi: «Heading offset (°) — Correct the survey heading, for example from magnetic to grid north». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)

**Ordine Nord/Est e sistema di riferimento**
- Kirra: «Kirra expects Easting (X), Northing (Y), Elevation (Z).» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Surpac: «**Northing (Y), Easting (X), Elevation (Z)**». — **[L]** [surpac-dtm-str](https://brentbuffham.github.io/kirra-docs/importing/surpac-dtm-str.html)
- IREDES/Epiroc: «X is pointing north, Y pointing east» (manuale Epiroc); «IREDES uses X for Northing and Y for Easting» (Kirra). — **[L]** [SurfaceManager.en.pdf, p. 133](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf) · [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Davey `.bpd`: latitudine/longitudine WGS84, va proiettato. — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Controllo di plausibilità adottato da Kirra: avviso se i dati sono «more than 100 km from the data you already have». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- Le coordinate grandi perdono precisione nei formati a cifre fisse: ShotPlan «keeps 8 significant figures […] lose precision, down to about 0.1 m». — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)

**Unità**
- Diametro: mm in Kirra; **metri** in CBLAST («Diameter is read in **metres**»); in ParVS3 euristica «Diameters of 5 or less are taken as metres»; intero in mm in IREDES («`xsd:unsignedShort` […] UNIT: mm»); Vulcan non lo porta affatto («Vulcan stores no hole diameter»). — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html) · **[W]** [iredes.org — DRholeType](https://iredes.org/irdocs/drholetype.html) · **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Piedi: due definizioni, internazionale (0,3048 m) e US survey (1200/3937 m); Epiroc ha la casella «Convert From US Survey Feet to Meters». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [SurfaceManager.en.pdf, p. 133](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- Decimali e separatori: Kirra preset solo punto e virgola-separatore; DataBlast separatore «aligns with your Windows regional settings». — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · **[W]** [DataBlast 2.13](https://docs.dataminesoftware.com/DataBlast/Pro/2.13/H-Initiation-Module/Export-Timing-to-a-CSV-File.htm)

**Colletto, fondo, quota di progetto, sottoperforazione**
- Due definizioni di sottoperforazione nello stesso prodotto: verticale (`subdrillAmount`) e lungo il foro (`subdrillLength`): «Both are written on export so other software can use whichever convention it prefers.» — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- Segno: «Convert subdrill to negative […] (some downstream systems expect this)»; BlastLogic la scrive negativa come «*Design charge standoff*». — **[L]** [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html) · [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)
- IREDES: il fondo foro include la sottoperforazione («the End point value includes the subdrilling depth»). — **[W]** [Trimble TBC](https://help.fieldsystems.trimble.com/tbc/12438.htm)
- CBLAST: nessuna sottoperforazione («the grade is at the toe»). — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Vulcan: 3 punti = colletto-quota-fondo, 2 punti = senza sottoperforazione. — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Lunghezza contro profondità: in Kirra `holeLengthCalculated` è la distanza 3D colletto–fondo, mentre il dislivello è «`StartZ - EndZ = BenchHeight + SubdrillAmount`». — **[L]** [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)
- File senza quota: molti piani ShotPlan «have no collar elevations. Those collars come in at **0 m**, and the import summary says how many.» — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- Fondo foro omesso: Epiroc usa un «Default Hole Length»; Kirra 4 colonne crea fori di lunghezza zero. — **[L]** [SurfaceManager.en.pdf, p. 133](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf) · [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html)

**Ritardi**
- Relativo al foro a monte (Kirra `delay`), assoluto per deck (ParVS3), dedotto dal nome del connettore (ShotPlan: `TLD 42`), assente (Datavis DBS: solo ritardo in foro). — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html) · [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- «Nessun ritardo» non è zero: `na` / `n/a` / `null` / `nan` in lettura, `NA` in scrittura. — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [csv-export](https://brentbuffham.github.io/kirra-docs/exporting/csv-export.html)
- Più legami sullo stesso foro: «Where several ties reach one hole, the one whose signal arrives first is kept». — **[L]** [importing/other-formats](https://brentbuffham.github.io/kirra-docs/importing/other-formats.html)
- Ritardi fuori catalogo vengono arrotondati in silenzio dichiarato: «A delay that is not on the list is written as the nearest one, and the export summary counts them.» — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)

**Identificativi**
- i-kon: 8 caratteri per l'ID foro; ID duplicati da rinominare prima dell'export; suffissi letterali ammessi solo su Logger II. — **[S]** [BlastIQ — articolo logger](https://support.blastiq.com/hc/en-us/articles/360035592453-How-to-export-and-import-between-SHOTPlus-UG-and-i-kon-loggers) · [Release Notes](https://support.blastiq.com/hc/en-us/articles/36049051382297-SHOTPlus-Release-Notes-6-1-1-6-6-8-1)
- Epiroc SmartROC: nomi di piano solo «a-z, A-Z, 0,9, _». — **[L]** [SurfaceManager.en.pdf, p. 75](https://github.com/brentbuffham/EPIROCSurfaceManager/blob/main/SurfaceManager.en.pdf)
- IREDES: al massimo 1000 fori per piano. — **[W]** [iredes.org — DrillPlan](https://iredes.org/irdocs/drillplan.html)
- ShotPlan non scrive i nomi dei fori: «ShotPlan numbers holes by their order in the file». — **[L]** [exporting/other-formats](https://brentbuffham.github.io/kirra-docs/exporting/other-formats.html)
- Nomi dei prodotti come chiave testuale sensibile alle maiuscole (CBLAST). — **[L]** [other-formats @6b8f75f](https://github.com/brentbuffham/kirra-docs/blob/6b8f75f9ab4d4f39942710dfb8625a0325059d82/importing/other-formats.md)

**Che cosa i file NON portano (e viene riempito con valori di comodo)**
- BPD: «Holes come in vertical, with placeholder diameter, grade, angle, bearing and subdrill, and a default charge. Kirra says so when the import finishes». — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- CBLAST: densità dei prodotti assenti. — **[L]** [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html)
- Diametro di ripiego che cambia secondo il formato: `0` nei preset CSV («`holeDiameter = 0`»), 115 mm in ParVS3 («a missing diameter defaults to 115 mm») e in Vulcan ARCH_D («Otherwise the default hole diameter is 115 mm»), `115` come predefinito del campo («Diameter in mm (default 115)»). — **[L]** [csv-formats](https://brentbuffham.github.io/kirra-docs/importing/csv-formats.html) · [blast-formats](https://brentbuffham.github.io/kirra-docs/importing/blast-formats.html) · [other-formats @6b8f75f](https://github.com/brentbuffham/kirra-docs/blob/6b8f75f9ab4d4f39942710dfb8625a0325059d82/importing/other-formats.md) · [hole-properties](https://brentbuffham.github.io/kirra-docs/reference/hole-properties.html)

### Inferences
- *(deduzione)* La coppia **colletto XYZ + fondo XYZ** è l'unica rappresentazione geometrica che attraversa tutti i formati senza convenzioni angolari: Kirra la mette prima nella priorità, DataBlast la chiama «preferred», IREDES e Surpac usano solo quella. Angolo e direzione andrebbero trattati come valori **derivati** e mai come sorgente quando il fondo è disponibile.
- *(deduzione)* Tre controlli costano poco e intercettano la maggior parte degli errori d'import: (1) distanza dei dati dall'esistente (> 100 km = sistema di riferimento sbagliato o Nord/Est invertiti); (2) diametro implausibile (≤ 5 = metri); (3) tutti i fori con angolo 90 = inclinazione scambiata per angolo dalla verticale.
- *(deduzione)* Un valore di ripiego (diametro 115, foro verticale, carica predefinita) è un dato **non misurato**: Kirra lo dichiara a fine import per il BPD; è lo stesso principio «l'assenza di un dato non è un dato favorevole», e un importatore dovrebbe marcare ogni campo riempito per ripiego.
- *(deduzione)* Poiché la sottoperforazione ha tre incognite indipendenti (verticale o lungo foro, segno, inclusa o no nel fondo), un file di scambio dovrebbe scrivere sia il punto di quota di progetto sia il fondo, come fa il preset a 35 colonne.

### Gaps
- Non trovata una fonte che dichiari la convenzione d'angolo di CBLAST oltre alla frase di Kirra («from vertical, as in Kirra»), né quella dei file ViewShot/ParVS3 (solo l'intervallo 0–90).
- Convenzione di segno dell'inclinazione in SHOTPlus («Design Angle») non verificata: gli articoli BlastIQ non sono leggibili.
- Le altre opzioni di «Zero Angle Style» in DataBlast non sono descritte nella pagina letta (c'è un solo esempio).
- Nessuna fonte pubblica trovata sulla gestione del fuso/ora nei timestamp dei dati misurati.
