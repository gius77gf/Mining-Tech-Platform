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
