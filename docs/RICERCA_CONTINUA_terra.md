# Ricerche continue — Terra

## Ricerca del 2026-09-02 — il rilievo e la dichiarazione dei quantitativi: il mondo

### Fatti dal mondo

1. **Rilievo fotogrammetrico con drone**: il rapporto professionale contiene GSD (Ground Sampling Distance, la dimensione reale di un pixel sul terreno), punti di controllo a terra (GCP) per precisione centimetrica o sub-centimetrica, errore RMS (accettabile quando inferiore a 1-2 volte il GSD), modello 3D, ortofoto e dati per calcolo volumetrico con errori inferiori all'1% [seconda mano: geocorsi.it; ispezionicondrone.it].

2. **Laser scanner terrestre e LiDAR da drone**: precision millimetrica per scanner professionali (Faro, Riegl); LiDAR da drone consegue 2-5 cm di accuratezza assoluta in condizioni corrette. Utilizzati per DTM, curve di livello, calcoli volumetrici in tempi brevi [seconda mano: microgeo.it; ingenio-web.it; dronezero.net].

3. **Densità in banco**: calcare solido 2200-2600 kg/m³, calcare frantumato ~2240 kg/m³ (variabile per spazi vuoti); terra ~1800 kg/m³ per conversione volume-tonnellate [seconda mano: omnicalculator.com; contabilità di cantiere].

4. **Dichiarazione annuale statistica mineraria**: i titolari di autorizzazione comunicano annualmente volumi estratti (m³ o tonnellate) alle Regioni. Rilevazione nazionale ISTAT realizzata annualmente su "Pressione antropica e rischi naturali". Deadline in genere aprile dell'anno successivo [seconda mano: regione.piemonte.it; istat.it].

5. **Canone di escavazione**: calcolato su volume di materiale estratto, varia per litotipo e Regione. Piemonte: aggiornamento 2026 con L.R. 16/2025 (agosto 6, 2025), adeguamento ISTAT ogni due anni [seconda mano: regione.piemonte.it].

6. **Distribuzione geografica cave**: Lombardia 484 siti, Piemonte 434, Veneto 372, Toscana 369 (anno 2017). Lombardi produce oltre 23 milioni t, Piemonte 10,6 Mt, Veneto 9,4 Mt di sabbia e ghiaia [seconda mano: istat.it, 2019].

### Software e formati del rapporto professionale

| Software | Formato rapporto | Dati contenuti | Fonte |
|----------|-----------------|-----------------|-------|
| Pix4D | PDF, GeoTIFF, LAS, DXF | Ortofoto, nuvola di punti, DSM, volume | [seconda mano: coptrz.com; dronedesk.io] |
| DroneDeploy | PDF, GeoTIFF, LAS | Mappa 2D/3D, ortomosaico, rilievo volumetrico | [seconda mano: dslrpros.com; skyebrowse.com] |
| Agisoft Metashape | PDF, OBJ, LAS, DXF | Modello 3D, ortomosaico, nuvola di punti | [seconda mano: coptrz.com; wezom.com] |
| Propeller | PDF, DXF, LandXML | Volume, profili di scavo/riporto, rilievo | [seconda mano: dronedesk.io] |
| Carlson Suite | DXF, LandXML, ASCII | DTM, profili volumetrici, curve di livello | [seconda mano: carlsonsoft.com indicato in topgeometri.it] |
| Geocat (italiano) | DXF, WinCAD | Rilievo topografico, integrazione Carlson | [seconda mano: topgeometri.it] |

### Canone di escavazione per Regione

| Regione | Base calcolo | Aliquota indicativa | Fonte |
|---------|-------------|-------------------|--------|
| Piemonte | Volume m³ estratto per litotipo | Aggiornata 2026 (L.R. 16/2025), dettagli su foglio calcolo "Servizio Esercenti" | [seconda mano: regione.piemonte.it] |
| Nazionale (quadro) | m³ estratti da rilievo o tonnellate vendute | <50 €/m³ in alcune Regioni (simbolico), aliquote crescenti per tipo minerale | [seconda mano: quarryandconstructionweb.it] |
| Lombardia, Veneto, Toscana | Non specificato in risultati | Gestiti dai singoli enti regionali; dati ISTAT disponibili per volumi ma non tariffe pubbliche | [seconda mano: istat.it; indicatoriambientali.isprambiente.it] |

### Domande per chi ha il codice in mano

1. Chi converte il volume in banco (m³ misurati dal rilievo drone/laser) alle tonnellate da dichiarare alle Regioni, e con quale densità (2200-2600 per calcare)?
2. Come Terra concilia il volume in banco del rilievo con il peso venduto alla pesa (che è il dato fiscale della vendita)?
3. Il rilievo professionale è conservato per controlli da parte dell'ente estrattivo, e se sì con quale formato standardizzato (PDF, DXF, LandXML, nuvola LAS)?
4. Come si passa da periodicità del rilievo (mensile? trimestrale? annuale?) alle dichiarazioni regionali (scadenza aprile dell'anno dopo)?
5. Se il canone si calcola su m³ estratto, chi legge quella misura dal rilievo drone e la consegna all'amministratore per il pagamento?

---

## Ricerca del 2026-09-02 — il rilievo periodico con il drone e la dichiarazione all'ente (metà sul mondo)

### Che cosa esiste già da noi

Non verificato da questa ricerca: il delta lo fa chi ha il codice.

### I parametri del volo e l'accuratezza attesa

**GSD (Ground Sample Distance)**: GSD tipico per rilievi professionali in cava 1–2,5 cm/px (risultati: Wingtra, Propeller, JOUAV). Il calcolo dipende da altezza di volo, risoluzione sensore e lunghezza focale: GSD = (altezza volo × larghezza sensore) / (lunghezza focale × larghezza immagine) [seconda mano: wingtra.com; enterprise-insights.dji.com].

**Altezza di volo**: varia da 30 a 120 m per rilievi in cava, dipendente da GSD desiderato e da conformazione del terreno (differenze di quota riducono il GSD locale) [seconda mano: propelleraero.com; dslrpros.com].

**Ground Control Points (GCP)**: 5–8 GCP distribuiti ai vertici e al centro dell'area, oppure fino a uno solo se usato PPK; best practice: 2–4 checkpoint indipendenti per verifica [seconda mano: propelleraero.com; unmannedtechshop.co.uk; skyebrowse.com].

**RTK/PPK**: RTK (Real-Time Kinematic) offre 1–2 cm di accuratezza in tempo reale via base station; PPK (Post-Processed Kinematic) applica le correzioni dopo il volo, accuratezza identica, più robusto a interruzioni di collegamento [seconda mano: dronedeploy.com; geonadir.com; propelleraero.com].

**Sovrapposizione foto**: tipicamente 60–80% sovrapposto longitudinale e 30–40% laterale per rilievo fotogrammetrico solido [seconda mano: pix4d.com; agisoft.com].

**Accuratezza attesa**: orizzontale 1–3 cm, verticale 2–3 cm con GCP; senza GCP ma con PPK, 2–5 cm orizzontale e 5–10 cm verticale. RICS Band D/E: ±10–25 mm su dettagli, ±2–4% su volumi [seconda mano: propelleraero.com; angellsurveys.com].

### Come si confrontano due rilievi e le cause d'errore

**Differenza DEM (DEM of Difference)**: confronto tra superficie rilevata a due tempi diversi tramite sottrazione punto per punto; il risultato è una mappa di altimetrie differenziali [seconda mano: sciencedirect.com; arxiv.org].

**Superficie di riferimento**: scelta di un piano di riferimento stabile (base della cava, banco naturale) su cui agganciare i rilievi successivi; errori se il riferimento si muove o subisce assestamenti [seconda mano: provincia.pc.it; geoteasrl.it].

**Vegetazione e zone d'acqua**: cause di errore; la vegetazione nasconde il suolo e produce scarti fino a 50 cm; le zone d'acqua causano perdita di dati (riflessi, assorbimento ottico). Mitigation: use NDVI-based masking, LiDAR penetrante (quando disponibile), rilievi in stagioni a minor vegetazione [seconda mano: nature.com; arxiv.org; ncbi.nlm.nih.gov].

### Frequenza dei rilievi e rapporto all'ente

**Periodicità**: mensile, trimestrale o annuale dipende da velocità di escavazione e obbligo contrattuale; per cave in attività, controllo almeno trimestrale [seconda mano: provincia.pc.it; acqualodigiana.it].

**Stato Avanzamento Lavori (SAL)**: redatto periodicamente (mensile o per milestone), contiene quantità estratte (m³ o t), descrizione e costi; firmato da direttore lavori [seconda mano: pedago.it; ingenio-web.it; studiopetrillo.com].

**Dichiarazione all'ente**: deadline tipicamente aprile dell'anno successivo per dichiarazione annuale statistica; Piemonte: comunicazione via portale "Servizio Esercenti Minerari"; in Campania, pagamento contributi entro 31/3 o 30/9 dell'anno seguente [seconda mano: regione.piemonte.it].

### Software e forma del calcolo volumetrico

| Prodotto | Calcolo volume | Input | Output |
|----------|---|---|---|
| Pix4D | DEM + superficie riferimento = prism volume | Ortofoto, nuvola punti | m³, GeoTIFF, DXF |
| Agisoft Metashape | Point cloud → superficie → diferenza | Immagini drone → DSM/DTM | m³, LAS, OBJ, DXF |
| DJI Terra | LiDAR o fotogrammetria → DEM | Volo DJI + RTK/PPK | Ortomosaico, DEM, DXF |
| Propeller | Volume app su DSM | Immagini, GCP/RTK | m³, PDF, DXF |
| Trimble Stratus | Point cloud → superficie | Dati Propeller | m³, profili cut/fill, DXF |
| Carlson Suite | Point cloud + DTM → volume | LAS, DXF, nuvola | m³, LandXML, profili |

[seconda mano: propelleraero.com; dronedeploy.com; researchgate.net; carlsonps.com; anvil.so]

### Domande per il delta (il confronto con la nostra app)

1. Chi decide la tolleranza ammissibile per un rilievo periodico (es. ±3% o ±5 m³ su un volume calcolato)?
2. Come Terra distingue fra errore legittimo di misura (variabilità dello strumento, vegetazione residua) e variazione reale del volume?
3. Il rilievo periodico è conservato in un formato che permette il confronto automatico di due date diverse (LAS, DEM in griglia)?
4. La nostra app accetta il confine della cava come superficie di riferimento per il calcolo differenziale, o richiede un datum esterno?
5. Come Terra gestiSce la conversione automatica fra m³ in banco (dal DEM) e tonnellate dichiarabili (con quale densità per litotipo)?

### Fonti (tutte [seconda mano])

- wingtra.com/surveying-gis/ground-sample-distance/
- enterprise-insights.dji.com/blog/ground-sample-distance
- propelleraero.com/ (blog e volume calculation articles)
- dronedeploy.com/blog/what-is-the-difference-between-rtk-ppk-and-gcp-and-why-does-it-matter
- geonadir.com/rtk-explained/
- unmannedtechshop.co.uk/blogs/knowledge-base/ground-control-points-guide-drone-mapping
- skyebrowse.com/news/posts/ground-control-points-guide
- angellsurveys.com/insights/drone-mining-quarry-survey-volumetrics-guide/
- nature.com (DEM accuracy, water extraction)
- arxiv.org (DEM differencing in mining)
- ncbi.nlm.nih.gov (vegetation monitoring in mines)
- provincia.pc.it/Allegati/Livelli/Allegato%207_Rilievi%20topografici...
- acqualodigiana.it/wp/wp-content/uploads/2020/03/GARA-2020-01-RILIEVI...
- pedago.it/blog/stato-avanzamento-lavori.htm
- ingenio-web.it/articoli/stato-avanzamento-lavori...
- studiopetrillo.com/relazione-conto-finale.html
- regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale
- researchgate.net (Agisoft/Pix4D/DJI Terra comparison)
- carlsonps.com/products/carlson-photocapture
- anvil.so/post/pix4d-vs-agisoft-photogrammetry-software-comparison


### Il delta, fatto da chi ha il codice in mano (02/09, contro `8d0fb886`)

Le cinque domande, risposte aprendo `apps/terra/terra-data.js`.

1. **Chi decide la tolleranza di un rilievo** → la decide il METODO scritto sul
   rilievo, non una percentuale a mano: `classeAccuratezza(rilievo)` legge il
   metodo (RTK/PPK/GCP, con le negazioni «senza GCP» riconosciute) e il GSD
   (`grep -ci GSD apps/terra/terra-data.js` → 23, `GCP` → 14, `RTK` → 11), `bandaVolume(volumeM3,
   tolleranzaPct)` scrive la forbice, e un rilievo senza metodo ha tolleranza
   **ignota**, non zero: `incertezzaScavo` somma le tolleranze note e DICHIARA
   chi copre e chi no (misurato il 03/08 sul verbale per l'ente: 388 m³ «di
   incertezza» erano il 2 % di UN rilievo su quattro). La «± 3 %» della
   ricerca (RICS, di seconda mano) non entra: la classe la dà il metodo.
2. **Errore di misura contro variazione vera** → non si distingue con un
   numero: si distingue con la BANDA. Due rilievi consecutivi hanno ciascuno la
   propria banda, e il confronto cavato/venduto e il verbale scrivono il ± accanto
   al volume; sotto la banda una differenza non è una variazione. Vegetazione e
   acqua (`grep -ci vegetaz apps/terra/terra-data.js` → 0, `acqua` → 0) NON sono campi: sono cause
   che un rilievo dovrebbe scrivere nella nota del metodo. ⏱️ Candidato debole:
   un campo «zone escluse dal calcolo» sul rilievo; da chiedere in cava se
   qualcuno lo compilerebbe.
3. **Il formato del rilievo** → Terra conserva il VOLUME e i metadati (data,
   metodo, GSD, quota base, provenienza), non il DEM (`grep -ciE 'DEM' apps/terra/terra-data.js` → 7,
   tutti in testi/commenti). Il confronto automatico fra due date è sui volumi
   dichiarati (`rilievoPrecedente`, `serieAnnuale`), non fra superfici: il DEM
   vive nel software del drone e nel visore nuvola di Genesi (la nuvola stessa
   non entra in Firestore, §4a del piano Genesi — un LAS pesa quanto tutta
   l'organizzazione). È una scelta scritta, non una mancanza da colmare.
4. **La superficie di riferimento** → non è una domanda di Terra: il volume
   arriva già calcolato (dal drone, dal visore o a mano); Terra registra la
   quota di fondo dell'atto (`quotaFondoM`) e la quota base del ritaglio del
   visore (`quotaBase`, che quando la nuvola non è georeferenziata è `null` e
   il foglio lo dice — 13/08). Il datum resta nel software di calcolo.
5. **m³ in banco → tonnellate** → esiste da oggi in shared: `densitaDellaCava`
   (atto → laboratorio → valore tipico da verificare) e `cavatoInTonnellate`,
   che Conti usa nel Report; la densità è UNA per cava, dichiarata sull'atto,
   non «per litotipo» in un listino — chiederla due volte darebbe due risposte
   per la stessa cava (il commento di `densitaDelMateriale`).

**Il rapporto all'ente**: `riepilogoAnnuale(rilievi, anno, autorizzazione)`
(somma prudente delle bande, cumulato e residuo del titolo) e il foglio
stampato con la dichiarazione di incompletezza. I NOMI degli adempimenti per
regione e le scadenze (aprile, 31/3 e 30/9…) che la ricerca riporta sono di
seconda mano e NON vanno in nessuna schermata: è la decisione 21 di
`docs/DECISIONI_WEEKEND.md`, allargata alla dichiarazione annuale.

Riassunto: **quattro su cinque esistono (1, 2, 4, 5), il 3 è una scelta
dichiarata**; nessun numero della ricerca entra nel prodotto.
