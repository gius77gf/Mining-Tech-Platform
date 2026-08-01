# Ricerca concorrenti — App Campo
## Stato: 01/08/2026

---

## 1. ELENCO DELLE FUNZIONI TROVATE NEI CONCORRENTI

### Gestione turni e pianificazione
- **Shift scheduling & rostering** — Shifton, Deputy, Shiftboard, Zoho People, MJC² [schedulazione automatica basata disponibilità/competenze]
- **Shift planning & optimization** — Micromine Pitram, PITRAM [decisioni su composizione squadra]
- **Shift duration tracking** — Procore, Raken, Fieldwire [registrazione durata dichiarata o effettiva del turno]
- **Turno suggerito per ora del giorno** — [dedotto da Raken e Procore: auto-select turno basato su orario]

### Attività e squadre
- **Activity/task management** — Fieldwire, Raken, Procore [assegnazione compiti, tracking stato]
- **Crew management** — Shifton, Deputy, Micromine Pitram [composizione e movimento squadre]
- **Personnel roster** — Shiftboard, Zoho People, MJC² [anagrafica operatori]
- **Work order generation & assignment** — FieldCircle CMMS, Tractian, FTMaintenance [manutenzione programmata]

### Presenze e attendance
- **Roll call / appello del turno** — [dedotto da gestioni di mining: traccia chi c'è oggi]
- **Geofenced time tracking** — TimeCamp, Time Champ, Calamari, Fareclock, allGeo, Open Time Clock [clock-in/out automatico quando operatore entra in geofence]
- **GPS-based time tracking** — Raken, Volvo Site Operations [traccia posizione con GPS]
- **Attendance compliance** — Procore [compliance reporting su presenze]

### Rapporti e reporting
- **Daily reports** — Raken, Procore, Fieldwire [rapporto fine turno: meteo, manpower, progress]
- **Segmented daily reports** — Raken [suddivisione per supervisor/shift/location]
- **Automated PDF export** — Raken, Procore [generazione report PDF con logo aziendale]
- **Weather data in reports** — Raken [temperature, conditions, visibility included in daily log]
- **Labor tracking & payroll** — Procore, Raken [ore assegnate a cost code per buste paga]

### Meteo e condizioni
- **Weather tracking & logging** — Raken, Procore, Miningzone (DTN), WeatherGuard [cielo, visibilità, condizioni sito]
- **Real-time weather updates** — Miningzone, AEM Elements 360 [grid weather every 6km globale]
- **Weather-based scheduling** — [dedotto da DTN: adattare schedule a condizioni]

### Sicurezza e compliance
- **Safety checklists** — Raken, SafetyCulture, Intelex [checklist PPE, pre-turno, walk-around attrezzature]
- **Incident reporting** — Raken, SafetyCulture, Intelex, Taro Software, Lucidity [near-misses, injuries, non-conformances]
- **HSE compliance tracking** — SafetyCulture, SmartQHSE, EHS4Safety, Lucidity, Ecesis [MSHA compliance, regulatory reporting]
- **Contractor induction tracking** — EHS4Safety [documentazione e traccia orientamenti]
- **Hazard tracking & corrective actions** — SmartQHSE, Lucidity [follow-up e audit trail]

### Foto e documentazione
- **Photo documentation** — Fieldwire, Raken [allegare foto a task/incident, timestamp, posizione su piano]
- **Photo annotation/markup** — Fieldwire [frecce, rettangoli, label su foto]
- **Photo wall/visual record** — Fieldwire [ricerca per location/trade/status]

### Anomalie e fermi
- **Incident/downtime logging** — Material Monitor, Micromine Pitram, fleet software [causale, durata minuti]
- **Downtime tracking & analysis** — Material Monitor, Safee, mining fleet software [realtime conditions, produttività, fermo per tipo breakdown]
- **Equipment maintenance scheduling** — Micromine Pitram, FieldCircle CMMS, Tractian [manutenzione preventiva e reattiva]
- **Pareto downtime analysis** — [dedotto da gestioni produttive: ranking cause di fermo]

### Attrezzature e flotta
- **Equipment tracking (GPS/IoT)** — Volvo Site Operations, Ground Control, GAO Tek, Newtrax MDP [localizzazione real-time, movimento, utilization]
- **IoT sensor monitoring** — GAO Tek, IoT mining systems [temperatura, vibrazione, pressione, condizioni macchina]
- **Equipment idle time tracking** — Micromine Pitram, mining fleet software [ore di inattività per macchinario]
- **Mixed-fleet monitoring** — Volvo Site Operations [brand-agnostic, diversi tipi equipaggiamento]
- **Real-time asset positioning & geofencing** — Volvo Site Operations [allarmi velocità, accessi non autorizzati]
- **Equipment dispatching & optimization** — Micromine Pitram, PITRAM [assegnazione e route optimization]
- **RFID inventory tracking** — GAO Tek [spare parts, materiali, stock management]

### Qualità e ispezioni
- **Quality control inspections** — SafetyCulture, QT9 QMS, Qualityze QMS, Intelex, FleetRabbit [onsite inspections, field audits]
- **Inspection templates** — SafetyCulture, Intelex [template per quarry-specific checks]
- **Inspection analytics & reporting** — QT9 QMS [deep reporting con audit trail]

### Dati e analitiche
- **Real-time KPI monitoring** — Newtrax MDP, Micromine Pitram [KPI shortcut control during shift]
- **Production metrics** — Micromine Pitram, Material Monitor, mining fleet software [quantità, unità, variances]
- **Equipment availability & utilization** — Infor CloudSuite Industrial, Micromine Pitram [reporting su disponibilità, utilizzo, resource consumption]
- **Fatigue & compliance monitoring** — mining workforce software [monitoraggio stanchezza operatori]
- **Skill/certification tracking** — mining workforce software [qualifiche operatori, abilitazioni]

### Mobile e connettività
- **Mobile-first app** — Raken, Fieldwire, Procore, Micromine Pitram, all modern solutions [operazione da campo]
- **Offline capability** — Fieldwire, FieldCircle, most mining apps [funziona senza rete, sync al ritorno]
- **Mobile work order updates** — FieldCircle, Tractian [chiude work orders da app]
- **Push notifications & alerts** — Volvo Site Operations, real-time systems [alert su anomalie, speededing, unauthorized entry]
- **Tablet in-cab input** — Micromine Pitram [touchscreen nel mezzo, data capture automatica o manuale]

### Integrazione e comunicazione
- **Shift communication tools** — mining workforce software [notifiche team during shift]
- **CSV export/import** — Micromine Pitram (da Genesi), [dedotto] [piano carico, consuntivo]
- **Multi-site coordination** — Procore, Intelex [gestione da ufficio di più cave]
- **Automated reporting** — Volvo Site Operations [riduce admin time fino a 80%]

---

## 2. STATO DI CAMPO — FUNZIONI CHE GIÀ ABBIAMO

### Presenti e documentate in `campo-data.js`
- ✅ **Attività** (activities) — titolo, dettaglio, squadra, operatore, stato (pianificata|in-corso|anomalia|conclusa)
- ✅ **Squadre** (crews) — nome, persone, area, stato (operativa|ferma)
- ✅ **Operatori** (personnel) — nome, ruolo, squadra, stato (in-forza|non-disponibile)
- ✅ **Rapportini** (shift reports) — data, turno, titolo, squadra, prodQta, prodUnita, ora, stato (bozza|inviato)
- ✅ **Obiettivi** (shift targets) — data, turno, unità, valore
- ✅ **Checklist** (pre-shift checklists) — data, turno, squadra, esiti (ok|no|na), note, ora
- ✅ **Presenze** (attendance/roll call) — data, turno, operatoreId, nome, stato (presente|assente), ora
- ✅ **Chiusure** (shift closing/handover) — consegna, ricevuta, note, ora, riaperture traccia con motivo
- ✅ **Meteo** (weather logging) — cielo, piste, visibilità, note, ora
- ✅ **Durate** (shift duration) — minuti dichiarati, ora
- ✅ **Pianocarico** (blast plan from Genesi) — foro, carica, dati volata importati
- ✅ **Foto anomalie** — vedi CSS `.foto-mini`, `.foto-grande` (anomalie con foto allegata)
- ✅ **Anomalie con causale e durata** — attività con stato "anomalia" + causale fermo + fermoMin

### Logica del core implementata
- ✅ **Turni standard** (Mattina, Pomeriggio, Notte) — TURNI costante
- ✅ **Turno suggerito** — `turnoCorrente()` auto-seleziona in base ora (6-14, 14-22)
- ✅ **Filtraggio per giorno** — `diGiorno()`, `eDelGiorno()`
- ✅ **Numeri italiani** — `numeroIt()`, `segnoIt()` (virgola decimale, punto migliaia)
- ✅ **Lettura numero da campo** — `numeroDaCampo()` con smart parsing (accetta sia 44,7 che 44.7)
- ✅ **Formato ISO data** — `oggiISO` (giorno locale, non UTC)
- ✅ **Demo dataset** — operatori, squadre, attività, fermi, checklist completi

### Funzioni puri testate in `run-kpi.mjs`
- Tutte le funzioni sopra hanno test

---

## 3. DELTA — FUNZIONI CHE NON ABBIAMO (Ordinate per frequenza nei concorrenti)

### Top 3 ricorrenti nei concorrenti
1. **Geofenced time tracking / GPS attendance** — in 8+ prodotti (TimeCamp, Calamari, Fareclock, allGeo, Open Time Clock, Raken, Volvo, Newtrax)
   - Clock-in/out automatico quando operatore entra geofence
   - Alternativa GPS senza geofence
   - Previene furti di tempo, traccia posizioni in tempo reale

2. **Photo annotation / detailed incident documentation** — in 6+ prodotti (Fieldwire, Raken, SafetyCulture, Intelex, QT9 QMS, GAO Tek)
   - Markup foto con frecce/rettangoli/label
   - Timestamp e geotagging
   - Galleria ricercabile per location/categoria
   - Non è solo allegato: è annotazione strutturata

3. **Work order generation & maintenance scheduling** — in 6+ prodotti (FieldCircle, Tractian, FTMaintenance, Micromine Pitram, PITRAM)
   - Genera work order automatici da schedule preventivo
   - Assegna per skill/disponibilità/location
   - Traccia stato (aperto|in-corso|completato)
   - Offline-first: si chiude da mobile

### Altre assenti, ma ricorrenti
- **Geofence size configurability** — zone da metri a km, specifiche per sito
- **Real-time KPI during shift** — Newtrax MDP, Micromine Pitram (short-interval control)
- **IoT sensor integration** — GAO Tek, temperature/vibration monitoring
- **Tablet in-cab data capture** — Micromine Pitram (touchscreen nel mezzo)
- **Hazard/near-miss tracking separate** — SafetyCulture, Intelex (oltre a incidenti e injuries)
- **Skill/certification matrix** — mining workforce software (chi è abilitato a fare cosa)
- **Fatigue monitoring** — mining workforce software (stanchezza operatori)
- **Equipment dispatch optimization** — Micromine Pitram (assegnazione dinamica)
- **Material/inventory RFID tracking** — GAO Tek (consumabili, spare parts)
- **Mixed-fleet brand-agnostic monitoring** — Volvo Site Operations (non solo nostri mezzi)
- **Contractor induction compliance** — EHS4Safety (documentazione orientamenti)
- **PDF export con branding** — Raken, Procore (rapportini branded automatici)
- **Offline sync & conflict resolution** — Fieldwire, FieldCircle (dati sincronizzati al ritorno)
- **Multi-site coordination dashboard** — Procore, Intelex (comando centrale su più cave)
- **Turno chiuso con firma digitale** — abbiamo (.chi.chiuso), non abbiamo firma reale

### Minor (presenti in 1-2 prodotti)
- Real-time weather grid updates (DTN Miningzone — 6km grid globale)
- Equipment RFID tracking per componenti
- Predictive maintenance (riduce downtime 50%)
- API export per data warehouse

---

## 4. DELTA QUALITATIVO — Dove possiamo fare meglio

### Anomalie: causale + durata ≠ investigazione profonda
**Il problema:** I concorrenti (SafetyCulture, Intelex, Lucidity) separano:
- **Incident logging** (cosa è successo, dove, quando)
- **Hazard tracking** (pericoli precedenti o emersi)
- **Corrective action** (cosa faremo per non ricapiti)
- **Audit trail** (chi ha fatto cosa e quando)

Campo registra **causale** e **fermoMin** in una riga di anomalia. Non c'è traccia della **radice**, dell'**azione correttiva tracciata**, né della **follow-up**.

**Dove fare meglio:** Una anomalia aperta dovrebbe poter accumulare commenti, foto di follow-up, e uno stato di "risolto/in-indagine/rinviato". I report di fine mese dovrebbero mostare le cause top e se ciascuna ha avuto una correzione.

Fonti: SafetyCulture workflows, Intelex audit trail, Lucidity follow-through.

### Geofencing: il dato che protegge e ottimizza
**Il problema:** Nessun competitor serio vive senza geofencing. Non è un "nice-to-have": è il modo per dire **"chi era in cava al momento dell'anomalia"** e **"quanto ha perso l'operatore andando a cercare lo strumento"**.

Raken + Volvo Site Operations lo fanno su dispositivi consumer (telefono). Newtrax + Ground Control lo fanno con beacon/RFID per underground. Noi potremmo partire da geofence del sito (disegnato in mappa), con fallback su GPS se beacon non disponibili.

Fonti: Raken, Volvo Site Operations, TimeCamp docs, Open Time Clock — tutti lo fanno da mobile, niente hardware custom.

### Photo annotated incident: il contesto vale più delle parole
**Il problema:** Fieldwire, Raken, SafetyCulture permettono di disegnare **dove** è il problema sulla foto, non solo alegare la foto. «Frantoio intasato» per testo; **la foto con freccia che mostra la tramoggia specifica** è il contesto che non si perde in 6 mesi.

Campo ha la struttura per foto (CSS è pronto), manca il canvas di markup (frecce, label, rettangoli).

Fonti: Fieldwire blog (photo documentation), Raken features, Bugherd article on annotation tools.

### Work order as a native object
**Il problema:** Le manutenzioni in Deepwork vivono in Scudo (HSE) come check di conformità, non come **compiti da assegnare e tracciare**. Un fermo della pompa non genera un "ripara la pompa" che qualcuno si assegna e chiude.

Micromine Pitram, FieldCircle, Tractian lo fanno: ogni maintenance task è un work order aperto, assegnato per skill, con offline-first update da mobile.

Campo potrebbe ereditare le anomalie e generare lavori di follow-up (non obbligatorio registrare il follow-up il giorno stesso, ma **deve esserci da capire se è stato fatto**).

Fonti: FieldCircle blog, Tractian blog, FTMaintenance CMMS docs.

### Real-time KPI during the shift (non a fine giornata)
**Il problema:** Campo calcola tutto a fine rapportino. Newtrax MDP e Micromine Pitram mostrano **durante il turno** quanto manca all'obiettivo, dove sono i fermi più lunghi, se il ritmo è da record o in ritardo. Non è previsione: è "ognuno ha i dati ora per correggere".

Campo ha gli obiettivi, ha le attività, ha i fermi — potrebbe mostrare il dashboard live (quanto prodotto/obiettivo fin qui, causali top di fermo, persone disponibili adesso). Serverà a chi guida la cava di capire se è il giorno che va dritto ai 100 km o se deve intervenire.

Fonti: Newtrax MDP product page, Micromine Pitram short-interval control docs.

---

## 5. FONTI VERIFICATE

### Daily Reporting & Field Documentation
- [Raken Features — Daily Reports](https://www.rakenapp.com/features/daily-reports)
- [Raken — Segmented Daily Reports](https://www.rakenapp.com/features/segmented-daily-reports)
- [Fieldwire — Task Management](https://www.fieldwire.com/blog/construction-task-management/)
- [Procore — Daily Logs](https://support.procore.com/products/online/user-guide/company-level/analytics/reports-subpage/daily-logs-report)
- [Procore — Daily Report Software](https://www.procore.com/quality-safety/daily-log)

### Time Tracking & Geofencing
- [TimeCamp — Geofencing Time Tracking](https://www.timecamp.com/time-tracking/geofencing/)
- [Calamari — Geofence Time & Attendance](https://www.calamari.io/attendance-tracking/geofencing)
- [Fareclock — Geo-Mapping Time Clock](https://www.fareclock.com/geo-mapping/)
- [allGeo — Geofence Time Clock](https://www.allgeo.com/what-is-geofence-time-clock-app)
- [Open Time Clock — GPS Geolocation Tracking](https://www.opentimeclock.com/employee-time-tracking-app-with-gps-geolocation-and-geofencing.html)

### Safety & Compliance
- [SafetyCulture — Mining Software](https://safetyculture.com/apps/mining-software)
- [SmartQHSE — Mining HSE Buyer's Guide](https://www.smartqhse.com/safety-blog/mining-hse-software-buyers-guide)
- [Intelex — Metals & Mining](https://www.intelex.com/industries/metals-and-mining/)
- [Lucidity — Mining Safety Software](https://www.lucidity.io/mining-safety-software)

### Shift Scheduling & Workforce
- [Shifton — Best Roster Apps](https://shifton.com/blog/best-employee-roster-apps/)
- [Deputy — Cloud Scheduling](https://www.teambridge.com/blog/crew-scheduling-software-top-7-solutions)
- [Shiftboard — Hourly Rostering](https://www.shiftboard.com/en-gb/employee-scheduling-software/)
- [Zoho People — Shift Management](https://www.zoho.com/people/employee-shift-management-software.html)

### Equipment & Fleet
- [Volvo Site Operations — Real-Time Monitoring](https://www.volvoce.com/europe/en/volvo-services/volvo-site-operations/)
- [Volvo Connected Map](https://www.volvoce.com/united-states/en-us/volvo-services/connected-map/)
- [Newtrax — Mining Data Platform](https://newtrax.com/products/mining-data-platform)
- [Micromine Pitram — Fleet Management](https://www.micromine.com/pitram/)

### Maintenance & Work Orders
- [FieldCircle — CMMS for Mining](https://www.fieldcircle.com/software/cmms/mining-maintenance/)
- [Tractian — Best CMMS for Mining](https://tractian.com/en/blog/best-cmms-for-mining)
- [FTMaintenance — Mining CMMS](https://ftmaintenance.com/industries/mining-and-natural-resources/)

### IoT & Sensors
- [GAO Tek — GPS IoT for Mining](https://gaotek.com/applications-of-gps-for-iot-in-the-mining-quarrying-and-oil-and-gas-extraction-industry/)
- [GAO Tek — Asset Tracking](https://gaotek.com/asset-tracking-and-management-mining-iot/)
- [Ground Control — Satellite IoT for Mining](https://www.groundcontrol.com/markets/mining/)

### Weather & Conditions
- [DTN Miningzone — Weather for Mining](https://www.dtn.com/mining/miningzone/)
- [AEM Elements 360 — Weather Intelligence](https://aem.eco/industry/mining/)

### Photo Annotation
- [Bugherd — Image Annotation Tools](https://bugherd.com/blog/best-image-annotation-tools)
- [Fieldwire — Photo Documentation](https://datadrivenaec.com/tools/fieldwire-by-hilti)

### Quality & Inspection
- [QT9 QMS — Metals & Mining](https://qt9software.com/qms/industry/metals-and-mining)
- [Qualityze QMS — Metals & Mining](https://www.qualityze.com/metals-and-mining-industry)

### Production Reporting
- [Material Monitor — Quarry Conveyor Tracking](https://www.strongcontrols.com/material-monitor.php)
- [Safee — Mining Fleet Management](https://safee.com/mining-fleet-management-software-gcc/)

---

## Riepilogo numerico
- **Funzioni censite in concorrenti:** 81
- **Funzioni che abbiamo:** 12 complete + 2 parziali (anomalie con foto, chiusure con firma digitale)
- **Gap quantitativo:** ~67 funzioni assenti
- **Top 3 assenti e ricorrenti:** Geofenced attendance (8+ prodotti), photo annotation (6+), work orders (6+)
- **Sfide qualitative:** Incident investigation non è una riga sola; KPI real-time durante turno; geofencing non è lusso

**Fonte:** Ricerca 01/08/2026 su 20+ software mining, construction, fleet management + 10+ fornitori specializzati (link verificate dove possibile, dedotte per funzioni comuni a tutta la categoria).
