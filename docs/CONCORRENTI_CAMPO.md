> # ⛔ AVVISO — LA COLONNA «NON C'È» E' STATA VERIFICATA: UNA SU SEI ERA FALSA
>
> *Verificate tutte e sei le app il 01/08, riga per riga contro il codice, con
> la prova accanto a ogni verdetto (il `file:riga` se la cosa c'è, i termini
> cercati a vuoto se non c'è). La sezione «Verifica del delta» in fondo a
> ciascun documento porta i verdetti.*
>
> | app | righe | assenti confermate | **false** | ⏱️ **scadute** | a metà |
> |---|---|---|---|---|---|
> | Scudo | **17** | **6** | 2 | **2** | **7** |
> | Sentinella | 22 | **13** | 4 | ⏱️ **3** | **2** |
> | Terra | 11 | 4 | 2 | 2 | 3 |
> | Campo | 22 | 11 | 2 | ⏱️ **3** | 6 |
> | Conti | 18 | **8** | **5** | ⏱️ **3** | 2 |
> | Flotta | 16 | 5 | 3 | 0 | 8 |
> | **totale** | **106** | **47** | **18** | **13** | **28** |
>
> ✅ **E due sono già SCESE**, che è il motivo per cui il conto sta scritto: la
> **catena di custodia del dato** di Sentinella e il suo **audit trail** (a metà)
> sono stati costruiti la sera del 01/08 **perché quella riga li proponeva**.
> Una riga che diventa lavoro e poi si aggiorna è una riga che ha fatto il suo
> mestiere; una che resta ferma mentre il codice cammina è l'arretrato.
>
> ⏱️ **E LA COLONNA «SCADUTE» È NATA LA SERA STESSA, con sei righe dentro.**
> Non sono verifiche **sbagliate**: erano vere quando sono state scritte, e il
> cantiere che colmava la mancanza è girato **dopo**, lo stesso pomeriggio,
> senza sapere l'uno dell'altro. Due sono scadute in **trentaquattro e
> trentacinque minuti** (il volume per banco di Terra, lo storico tarature di
> Sentinella). È il prezzo dei cantieri paralleli — che sono anche il primo
> moltiplicatore misurato — quindi la cura non può essere lavorare in fila.
> Quanto è vecchio ciascun documento lo dice adesso un controllo:
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`.
>
> ⚠️ E il costo di non saperlo è misurato: una ricerca lanciata quella sera,
> **con il divieto esplicito** di dichiarare un «non c'è» senza la prova, ha
> proposto come mancanza l'anagrafe appaltatori di Scudo — costruita due ore
> prima, cinque funzioni esportate e dodici punti nella pagina.
>
> **Una mancanza dichiarata su sei non esisteva**, e va peggio dove il codice è
> più maturo: in Conti una riga su tre e mezzo era falsa. Le più grosse: le
> **note di credito** di Conti (impianto completo su art. 26 DPR 633/1972), la
> **gestione guasti** di Flotta, l'**aging con le fasce e il fido**, la
> **previsione dei giorni a scadenza** (che il documento elencava fra le cose
> fatte dodici righe più su, contraddicendosi da solo), la **riconciliazione
> volume misurato/dichiarato** di Terra e gli **indici infortunistici** di
> Scudo.
>
> Quindi: **l'elenco delle funzioni dei concorrenti, con le fonti, vale.** Il
> delta vale **solo dove porta la sua prova**: nessuna riga diventa lavoro
> senza passare dalla sezione di verifica. È la regola che ha impedito di
> aprire due cantieri per cose già costruite, il giorno stesso in cui è stata
> scritta.

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

---

## Verifica del delta (01/08 · riverificato il 03/08 · **arretrato richiuso il 06/08**)

> **Verificato contro il codice al commit `3a3ca66`** (09/08, secondo passaggio ·
> **tutte e ventidue** le righe rilanciate, non solo le confermate assenti —
> **un verdetto cambia** e **sette prove non si riproducevano più**; prima era
> `6e5f409` lo stesso giorno, `57c78cf` l'08/08, `4743c69` il 06/08).
>
> ### 09/08 (quinto passaggio) — la direttiva 7, e il verdetto che ne esce
>
> L'arretrato diceva **1 commit, 0 che MORDONO** — cioè nessuna `export
> function` e nessun `<button>` nati o morti. È vero: il commit `3a3ca66` fa
> passare `misura-zero` fra gli stati muti della riconciliazione. Ma «0 che
> mordono» non vuol dire «niente da rileggere», e infatti rileggendo **tutte**
> le righe — non solo le undici confermate assenti, che erano l'unica cosa
> rimisurata il passaggio prima — è saltato fuori un verdetto scaduto da
> **sei giorni**, e sette prove che un lettore non poteva più rilanciare.
>
> **Il verdetto che cambia è uno: il near-miss.** Era «C'È A METÀ
> (nell'ecosistema)», e la metà che mancava era **Campo**. È stata costruita il
> 03/08 alle 12:57 (`88bc73f`), **tre ore e quarantotto minuti** dopo la
> verifica del 03/08 (`6048442`, 09:09) che la dichiarava assente — la solita
> forma: la verifica e il cantiere sono girati la stessa mattina senza sapere
> l'uno dell'altro. ⚠️ E questo documento **lo sapeva già**: il blocco del 06/08
> qui sotto elenca «il near-miss segnalato dal fronte» fra le cose che quei
> commit hanno costruito. La riga della tabella e la sezione «la mancanza
> confermata più importante» sono rimaste ferme lo stesso, per sei giorni.
> Cioè l'informazione era **nel documento**, in prosa, e non è arrivata nelle
> due righe che qualcuno legge per decidere che lavoro fare: **un blocco di
> racconto non aggiorna una tabella.**
>
> **Le sette prove che non si riproducevano più** — verdetto invariato in tutte
> e sette, è la QUARTA FORMA d'invecchiamento (la prova marcisce, il giudizio
> no). Le cause, che sono sempre le stesse quattro:
> · **geofencing** — «zero occorrenze in tutto il repo» è falso, e lo era
>   **fin dal primo commit del repository**: `coordinat` prende `coordinamento`
>   (il DSS coordinato di Scudo), `latitudin`/`longitudin` prendono
>   `latitudinal`/`longitudinal` degli shader di `three.module.js`, e il
>   **core** ha da sempre `Lat GPS`/`Lon GPS` della cava. *Termine largo.*
> · **photo annotation** — `disegna` dà **24** occorrenze e sono tutte nostre
>   (disegnare grafici), `markup` è l'HTML, `frecc` è la freccia nativa di un
>   `<select>`. *Gergo di casa, che peggiora proprio perché si lavora.*
> · **work order** — `azione correttiva` dà **17**: la riga lo diceva già nella
>   sua nota ⏱️ e continuava a cercarla fra i termini a zero. *Si contraddiceva
>   da sola.*
> · **fatigue** — stessa cosa, più netta: verdetto «SCADUTA — c'è dal 01/08» e
>   sotto «cercati `riposo`… zero», mentre `riposo` dà **74**.
> · **multi-cava** — il totale (13 `cantiere`) regge, la **scomposizione** no:
>   «tre `questo cantiere` e una `altro cantiere`» sono **due e due**.
> · **API export** — «sette funzioni che compongono un CSV»: gli export col
>   nome `csv` sono **otto**, ma solo **cinque compongono**; tre leggono.
>   *Un numero contato per nome invece che per effetto — esattamente l'errore
>   che la stessa riga aveva corretto il 07/08 sul conto dei download.*
> · **PDF con marchio** — la citazione `riga 3692` è finita a 4316.
>   *Numero di riga.*
>
> ⚠️ E una cosa che il metodo non prevedeva: `logo`, cercato per trovare il
> marchio del cliente, dà **14** righe di cui **12** sono `Riepilogo`,
> `riepilogoFermi`, `pianoRiepilogo`, `dialogo` e `meteorologo`. È la prima
> causa (termine corto dentro parole comuni) in una veste italiana che nessuno
> si aspetta: il rimedio è `\blogo\b|marchio`, che dà 4 righe tutte pertinenti.
>
> ### 08/08 (terzo passaggio) — nove commit, tre che mordono, nessuna riga mossa
>
> Fra `4743c69` e `9818d4a` Campo è andata avanti di **9 commit**, **+374
> righe** e −89, **tre** dei quali mordono. Quello che hanno costruito:
> `avvisoSenzaGiorno`, `csvAppello`, `csvAttivita`, `descriviChecklist`,
> `minutiFermoDi`, `senzaGiornoDiLavoro` — cioè due export CSV, il conto dei
> minuti di un fermo e il caso del rapporto **senza giorno di lavoro**.
> **Nessuna** di quelle cose è una delle undici dichiarate assenti, che parlano
> tutte di **hardware e di integrazioni**: GPS e geofencing, sensori IoT,
> tablet in cabina, dispatch dinamico, RFID/barcode, telemetria multi-marca,
> sincronizzazione offline, cruscotto multi-cava, griglia meteo DTN,
> manutenzione predittiva.
>
> La prova è doppia, e tutt'e due danno **zero**:
>
> ```
> git diff 4743c69 HEAD -- apps/campo/ | grep -E "^\+" \
>   | grep -oEi "\b(geofenc|GPS|IoT|sensore|tablet|in-cab|cabina|dispatch|RFID|
>                    barcode|QR|telemetri|multi-sito|multi-cava|DTN|predittiv|
>                    service worker)\b" | sort | uniq -c
> →  (niente)
> ```
>
> e sui **file interi**, con i confini di parola: `geofenc`, `GPS`, `IoT`,
> `tablet`, `dispatch`, `RFID`, `barcode`, `DTN`, `predittiv`, `multi-cava`,
> `multi-sito` → **0 ciascuno**. Cioè non solo i nove commit non hanno
> costruito niente di quello: **non c'è traccia di nessuno dei termini in tutta
> l'app**, che è la forma più forte in cui una riga «non c'è» può reggere.
>
> ### 06/08 — l'ultimo arretrato dei sei documenti va a zero
>
> Fra `6048442` e `d9524fa` Campo è andata avanti di **4 commit** e **+597
> righe** (il near-miss segnalato dal fronte, il rapporto di fine turno che
> dichiara di essere una dimostrazione, la regola dei file che escono salita in
> `shared/`). Nessuna riga del delta si muove, e la prova sono le **sole righe
> aggiunte**:
>
> ```
> git diff 6048442 HEAD -- apps/campo/ | grep -E "^\+" \
>   | grep -oEi "GPS|IoT|QR|RFID|XMLHttpRequest|annotaz|barcode|codice a barre|
>                geofenc|geolocation|latitudin|longitudin|coordinat|in.?cab|
>                cabina|fatica|fatigue|ore consecutive|riposo|instradament|
>                dispatch|ordine di lavoro|inventario|magazzino|giacenza|
>                multi-cava|multi-sito|predittiv|previsione|
>                manutenzione preventiva|fetch\(|canvas|markup" | sort | uniq -c
> →       2 ioT
> →       1 riposo
> ```
>
> **Due occorrenze su 34 termini, e le ho aperte tutt'e due** — che è la regola
> imparata stamattina su Terra e ripetuta oggi su Sentinella:
> · `ioT` sta dentro **`avvis·ioT·esto`** (`avvisoEsempioTesto`), la funzione
>   che scrive l'avviso di dimostrazione: camelCase, come `colOra` in
>   Sentinella;
> · `riposo` sta in un **commento** che descrive i dati inventati del rapporto
>   («nomi, orari, ore lavorate e ore di riposo tutti inventati»).
>
> ⚠️ **E il secondo meritava un controllo in più, non un'alzata di spalle.** Un
> commento che nomina «ore di riposo» fra i dati della dimostrazione suggerisce
> che il modello *le abbia*. Verificato: le ha — `RIPOSO_MINIMO_ORE`,
> `riposoPrimaDelTurno`, `riposoDiTurno`, `STATI_RIPOSO`, con il D.Lgs 66/2003
> art. 7 citato e il caso «non misurabile» gestito (`campo-data.js:1296-1361`,
> `index.html:2587-2602`). Ma il documento **lo sapeva già**: la riga «Fatigue
> monitoring» è marcata ⏱️ *SCADUTA — c'è dal 01/08* e cita quelle stesse
> funzioni. Cioè il sospetto era giusto e la risposta era che il lavoro era già
> stato fatto — il caso opposto a quello che costa, e va scritto anche questo,
> perché altrimenti sembra che il controllo trovi sempre qualcosa.
>
> *(Il blocco qui sotto è la verifica del 03/08 e resta com'era scritta.)*
>
> ### 06/08 (secondo passaggio) — riallineato al commit `4743c69`
>
> L'app si è mossa di **un commit** dopo la verifica qui sopra, ed è il commit
> dei **disegni misurati col righello**: geometrie e testi, non funzioni nuove.
> Ripassato col metodo che oggi ha funzionato otto volte su otto — i termini
> del delta cercati **solo nelle righe aggiunte** — e non risponde niente,
> quindi nessuna riga cambia verdetto.
> ⚠️ E si dica che cos'è: **non è una rilettura riga per riga** (quella è
> sopra, con la sua data). È il controllo che un commit noto non abbia colmato
> una mancanza dichiarata. Serve a tenere a zero l'arretrato che
> `documenti-invecchiati.mjs` misura; la prova vera resta quella riga per riga.
>
> ⏱️ **Riverificato a `57c78cf` (08/08, sera).** L'arretrato segnalava **un commit
> che MORDE** — cioè che ha aggiunto o tolto una `export function` o un
> `<button>`, le due forme con cui qui nasce e muore una funzione. Aperto:
> sono i due rifacimenti dei CSV di oggi, e **nessuna riga di questo documento
> cambia**. La ragione è misurata, non dedotta: quei commit hanno cambiato
> **zero `<button>`** e hanno aggiunto **sei scrittori interni**
> (`csvListino`, `csvGare`, `csvRicambi`, `csvSquadre`,
> `csvRegistroInfortuni`, `csvPersonaleScadenze`) per export che **esistevano
> già come bottoni**: è cambiato **dove** si compone il file, non che cosa
> l'utente può fare. Un confronto coi concorrenti si muove quando si muove
> una **capacità**, e qui non se n'è mossa nessuna.

> **Verificato al commit `6048442`** (03/08). *(La prima verifica era
> a `f3432f4`, 01/08 16:55; il 03/08 le righe sono state ripassate contro il
> codice di oggi e **una ha cambiato verdetto**, nella direzione che costa:
> «contractor induction» da **assente confermata** a ⏱️ **scaduta in parte** —
> l'anagrafe appaltatori di Scudo è entrata alle 19:28 dello stesso 01/08, due
> ore e mezzo dopo che la riga la dichiarava assente. Aggiornati anche i
> `file:riga` del rapporto stampabile, che i cantieri di questi due giorni
> avevano spostato di seicento righe.)*
>
> Ogni riga qui sotto
> era vera **a quel commit**, e non lo è più per forza adesso: il 01/08 una riga è
> scaduta in **trentacinque minuti**, perché la verifica e il cantiere che la
> colmava sono girati lo stesso pomeriggio senza sapere l'uno dell'altro.
> Di quanti commit l'app sia andata avanti da allora lo dice
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`. Le righe già trovate
> scadute portano la loro correzione accanto, con la data.

*Ogni voce marcata «non c'è» nella sezione 3 e nella sezione 4 è stata riaperta
sul codice: **23 voci in 22 righe**, perché «geofenced time tracking» e «geofence
size configurability» sono la stessa cosa e hanno un verdetto solo. I duplicati
fra sezione 3 e sezione 4 (geofencing, photo annotation, KPI real-time) sono
contati una volta sola.*

⚠️ *Le righe citate per **Scudo** sono state rimisurate a fine verifica: quel
giorno due cantieri paralleli stavano lavorando su quel file, quindi il
riferimento che conta è il **nome** della funzione, non il numero.*

| Funzione | Verdetto | Prova |
|---|---|---|
| Geofenced time tracking / GPS attendance (e «geofence size configurability») | **CONFERMATO ASSENTE** | `grep -ciE 'geofenc\|geolocation\|navigator\.geolocation\|\bGPS\b\|latitudine\|longitudine\|coordinat' apps/campo/campo-data.js apps/campo/index.html shared/dw-ponti.js` → **0, 0, 0**. E la forma che regge in tutto il repository, perché i due termini sono inglesi e tecnici: `grep -rciE 'navigator\.geolocation\|geofenc' apps/ shared/ index.html --include=*.js --include=*.html --exclude-dir=node_modules --exclude-dir=vendor` → **nessun file diverso da zero**. L'unico «posizione» di Campo è la lettura **per posizione** delle colonne del CSV quando manca l'intestazione (`mappaPianoCsv`, `parsePianoCsv`). ⏱️ *Prova riscritta il 09/08, e il verdetto non si muove: diceva «**zero occorrenze in tutto il repo**», che è falso — e lo era già al primo commit del repository, quindi non è scaduta, era larga. Che cosa sono le occorrenze che quella ricerca prendeva: `coordinat` prende il **DSS coordinato** di Scudo (art. 9 D.Lgs 624/96) e le `coordinate` 3D di Genesi/Terra; `latitudin`/`longitudin` prendono `latitudinal`/`longitudinal`, i due nomi di uno shader di `three.module.js`; e `GPS` prende i campi **`Lat GPS`/`Lon GPS` della cava nel core** (`cf-lat`, `cf-lon`), che sono una coppia sola scritta a mano nell'anagrafica per disegnare la mappa OpenStreetMap — un dato **statico del sito**, non la posizione di una persona. Nessuno dei tre è geofencing, e la distanza fra i due mondi è esattamente `navigator.geolocation`, che non compare da nessuna parte.* |
| Photo annotation / documentazione fotografica strutturata | **C'È A METÀ** | *C'è*: allegato foto con validazione e ridimensionamento — `eImmagine`, `byteFoto`, `eFotoValida`, `misuraRidotta`, `FOTO_MAX_BYTE`, `FOTO_TENTATIVI` (`campo-data.js:713-774`), compressione via canvas (`index.html:2626-2644`), ora dello scatto (`a.fotoOra`) e foto nel rapporto stampabile (`index.html:3085`). *Manca*: il canvas di **markup** (frecce, rettangoli, etichette sopra la foto) e la **galleria ricercabile** per luogo/categoria. ⏱️ *Prova riscritta il 09/08 · verdetto invariato.* `grep -ciE 'annotaz\|strokeRect\|beginPath\|lineTo\|moveTo\|toBlob' apps/campo/campo-data.js apps/campo/index.html` → **0 e 0**: sono i nomi con cui si disegna **sopra** una tela, e non ce n'è nessuno. Le **sole tre** chiamate di tela in tutta la pagina — `getContext`, `drawImage`, `toDataURL`, `grep -cE 'getContext\|drawImage\|toDataURL' apps/campo/index.html` → **3** — stanno tutte e tre dentro `ridimensionaFoto`, cioè servono a **rimpicciolire** il file, non a disegnarci sopra. Manca anche la galleria: `galleria` → 0. *La prova di prima cercava `markup`, `frecce` e `disegna` e non si riproduceva più: `disegna*` dà **24** occorrenze e sono tutte nostre — «disegna la barra», «disegnare il grafico» —, `markup` è l'HTML in un commento di banco, `frecc` è «la freccia nativa» di un `<select>`. Il gergo di casa entra nel conto, e peggiora proprio perché si lavora.* |
| Work order generation & maintenance scheduling | **C'È A METÀ** (nell'ecosistema) — e la motivazione scritta in §4 è **falsa** | Gli ordini di lavoro **esistono e sono completi**, ma in **Flotta**, non in Scudo come dice §4 («Le manutenzioni in Deepwork vivono in Scudo (HSE)»): `STATI_ORDINE` da-fare/in-corso/attesa-ricambi (`apps/flotta/flotta-data.js:1574`), `ordineDaManutenzione`, `costoOrdine` con manodopera+ricambi+spese (1601), `validaRigaManodopera`, `validaRigaRicambio`, `riepilogoOrdini`, generazione da controllo pre-uso (`manutenzioniDaControllo`, 1161) e da guasto (`manutenzioneDaGuasto`, 1279). *Manca davvero*: il ponte **Campo → Flotta**, cioè un'anomalia di Campo che genera l'ordine di lavoro. ⏱️ **Metà scaduta il 01/08**: l'`azione correttiva` adesso c'è (`azioniDelFermo`, `29f0229` 17:45). **Resta assente** il ponte Campo → Flotta, cioè l'anomalia che genera l'*ordine di lavoro* in officina: sono due cose diverse e solo la prima è stata costruita. La prova di ciò che manca, riscritta il 09/08: `grep -ciE 'ordine di lavoro\|ordini di lavoro\|work order\|officina' apps/campo/campo-data.js apps/campo/index.html` → **0 e 0**. ⏱️ *Prima la stessa cella cercava anche `azione correttiva` e `follow-up` «: zero», cioè **si contraddiceva da sola** — la sua nota diceva che l'azione correttiva c'è, e i termini sotto la cercavano fra le cose assenti. Rimisurato: `azione correttiva` dà **17** occorrenze in Campo, `follow-up` **0**. Il verdetto non cambia; cambia che adesso la prova cerca solo quello che davvero non c'è.* |
| Real-time KPI during shift | **FALSO, C'È GIÀ** | `avanzamentoGiornata` (`campo-data.js`) disegnato live in `index.html:1358-1370`; `statoObiettivo` con `mancante`/`pct`/`livello` reso da `renderObiettivo` (`index.html`); `disponibilitaTurno` con il flag **`provvisorio`** (1039) che fa scrivere «**finora** N%» e «Disponibilità turno X · **in corso**» (`index.html:1885-1887`); `paretoFermi` disegnato a `index.html:1443`; `appelloTurno` per chi c'è adesso. La frase «Campo calcola tutto a fine rapportino» è smentita dal codice che distingue esplicitamente il turno finito da quello in corso. |
| IoT sensor integration (temperatura, vibrazione) | **CONFERMATO ASSENTE** | `grep -ciE '\bIoT\b|sensore|vibrazione|telemetri|internet of things'` su `campo-data.js` e `campo/index.html` → **0 e 0**. ⏱️ *Termine ancorato il 09/08: `IoT` senza confini combaciava con «iniz**ioT**urno», una funzione nostra — 7 righe, tutte falsi positivi, verdetto invariato. È il gergo di casa che entra nel conto, la terza causa censita: peggiora **proprio perché si lavora**.* Nessuna `fetch(`/`XMLHttpRequest` verso servizi esterni nella pagina. |
| Tablet in-cab data capture | **CONFERMATO ASSENTE** | Cercati `tablet`, `in-cab`, `in cab`, `cabina`: zero in `campo-data.js` e `campo/index.html`. |
| Hazard / near-miss tracking separato | ⏱️ **SCADUTA — C'È DAL 03/08** (verifica `6048442` 03/08 09:09 → costruito `88bc73f` 03/08 **12:57**, tre ore e quarantotto minuti dopo) | *C'è, in Scudo*: `infortuni/{id}` con `tipo: infortunio\|near-miss`, `categoria` del rischio, `gravita`, `luogoTipo` (`scudo-data.js`, esempi `i1`…`i6`). *E adesso c'è anche in Campo*, che è la metà che questa riga dichiarava assente — è il **ponte P5**: il bottone «Segnala un near-miss» (`btn-nm`) in cima alla schermata, `segnalazioniDelTurno`, `testoSegnalazioniTurno` e `categorieGiaSegnalate` in `campo-data.js`, la segnalazione anonima e la foto, e la scrittura nel registro di sicurezza di Scudo (`toast("Near-miss registrato in Scudo."`). Prova: `grep -ciE 'near-miss\|mancato infortunio' apps/campo/campo-data.js apps/campo/index.html` → **11 e 14** (era 0 e 0). ⏱️ *Verdetto cambiato il 09/08, con sei giorni di ritardo, ed è la parte che vale: **il documento lo sapeva già** — il blocco del 06/08 qui sopra elenca «il near-miss segnalato dal fronte» fra le cose costruite. Il racconto era aggiornato e la tabella no. Un blocco di prosa non aggiorna una riga di tabella, e la riga di tabella è quella che qualcuno legge per decidere che lavoro fare.* ⚠️ *E va detto che cosa resta, senza gonfiarlo e senza usarlo per non cambiare il verdetto: l'**hazard** dei concorrenti — la condizione insicura segnalata **prima** che succeda qualcosa, distinta dal near-miss — non esiste in nessuna delle due app. `grep -ciE 'hazard\|condizione insicura\|osservazione di sicurezza' apps/campo/*.js apps/campo/index.html apps/scudo/scudo-data.js apps/scudo/index.html` → **0 ovunque**, e i tipi ammessi restano `infortunio\|near-miss`. È una mancanza diversa da quella che questa riga dichiarava, quindi non la tiene in piedi: se un giorno diventerà lavoro, servirà una riga sua.* |
| Skill / certification matrix («chi è abilitato a fare cosa») | **FALSO, C'È GIÀ** | La matrice esiste per intero in Scudo: `MANSIONI_PRESET` con `requisiti` e `dpi` per mansione (`scudo-data.js:1199`), `abilitazioneLavoratore` con esito `puo`/`attenzione`/`no` e l'elenco dei bloccanti (1298), `matriceMansione`, `riepilogoMansioni`, i requisiti censiti (`patentino-attr` — Accordo Stato-Regioni 22/02/2012 —, `fochino` — D.P.R. 302/1956, righe 977-978). E **Campo la consuma già**: `idoneitaDiTurno`/`idoneitaOperatore`/`inTurnoOggi` in `shared/dw-ponti.js:408-508`, importate in `campo/index.html:845` e usate nel Quadro (1350) e nell'appello delle squadre (1729). |
| Fatigue monitoring | ⏱️ **SCADUTA — C'È DAL 01/08** (verifica `f3432f4` 16:55 → costruito `ccff0c3` 19:09; `RIPOSO_MINIMO_ORE`, `riposoPrimaDelTurno`, `riposoDiTurno`, `STATI_RIPOSO` ex D.Lgs 66/2003 art. 7 — e dal 01/08 notte anche gli **orari veri per persona** (`orariPresenza`, `orariDiTurno`, `minutiOrario`), cioè il riposo non è più una stima sulla durata **dichiarata** del turno: chi resta due ore in più adesso l'app lo sa) | Prova di ciò che **c'è**, riscritta il 09/08: `grep -cE 'RIPOSO_MINIMO_ORE\|riposoPrimaDelTurno\|riposoDiTurno\|STATI_RIPOSO' apps/campo/campo-data.js` → **10**, e `grep -ciE 'ore consecutive' apps/campo/campo-data.js` → **3**; gli orari veri per persona sono `orariPresenza`, `orariDiTurno`, `minutiOrario`, e la durata del turno `durataTurnoDi`. ⏱️ *La cella diceva ancora «cercati `fatica`, `stanchez`, `fatigue`, `riposo`, `ore consecutive`: zero», cioè **la riga si contraddiceva da sola**: il verdetto dichiarava la cosa costruita dal 01/08 e la prova sotto continuava a dichiararla assente. Rimisurato: `riposo` dà **74** occorrenze fra modulo e pagina, `ore consecutive` **3**; `fatica`, `stanchez` e `fatigue` restano a **0**, ma sono i termini dei concorrenti, non i nostri — cercare le parole di un altro nel proprio codice è un modo di non trovarlo mai. È la stessa forma già corretta il 07/08 sulla riga delle anomalie: una prova scaduta non rende sbagliato il verdetto, lo rende non credibile.* |
| Equipment dispatch optimization | **CONFERMATO ASSENTE** | Cercati `dispatch`, `assegnazione dinamica`, `instradamento`: zero. Esiste l'assegnazione **manuale** a squadra/operatore (`etichettaAssegnazione`, 358; `caricoSquadre`, 392), non l'ottimizzazione. |
| Material / inventory RFID tracking | **CONFERMATO ASSENTE** in Campo | Cercati `RFID`, `barcode`, `codice a barre`, `QR`, `inventario`, `giacenza`, `magazzino` in `campo-data.js` e `campo/index.html`: zero. *Nota d'ecosistema*: la giacenza esiste in **Flotta**, ma sui **ricambi** (`sottoScorta`, `flotta-data.js:625`; `scaricoGiacenza`, 617; `propostaScorte`, 1823), non sui materiali di cava. |
| Mixed-fleet brand-agnostic monitoring | **CONFERMATO ASSENTE** | Stessa ricerca di `telemetri`/`GPS`: zero in Campo. In Flotta c'è solo l'import CSV dai portali OEM (`parseTelemetriaCsv`, `flotta-data.js:531`), che è brand-agnostico ma non è monitoraggio. |
| Contractor induction compliance | ⏱️ **SCADUTA IN PARTE — C'È A METÀ NELL'ECOSISTEMA DAL 01/08** (verifica `f3432f4` 16:55 → costruito `425bf40` **19:28**, due ore e mezzo dopo) | *C'è, in Scudo*: l'anagrafe delle imprese esterne con la loro **qualifica** — `appaltatori` (`scudo-data.js`), `TIPI_DOC_APPALTATORE` con CCIAA, DURC e autocertificazione ex art. 47 D.P.R. 445/2000, `docDiAppaltatore`, `qualificaAppaltatore`, `descriviQualifica`, gli appalti per impresa e per cantiere (`appaltiDiAppaltatore` 3350, `riepilogoAppalti` 3360), chi va verificato per primo (`appaltatoriDaVerificare` 3384) e il **documento di coordinamento**; e il permesso di lavoro chiede se il lavoro lo fa un'impresa esterna (`scudo/index.html:1407`, 2546). *Manca davvero, ed è la metà che il concorrente chiama «induction»*: il verbale di **accoglienza della singola persona** che entra in cava per conto dell'impresa. Scudo verifica l'**impresa** (qualifica, coordinamento), non la **persona**, e lo dichiara: «i corsi dei suoi addetti li garantisce l'impresa» (`index.html:1407`) — è una scelta, non una dimenticanza, ma il registro di chi è stato accolto e quando non esiste da nessuna parte. *In Campo*: sempre zero — rifatta la ricerca il 03/08, `appaltator`, `contractor`, `ditta esterna`, `impresa esterna`, `induction`, `accoglienza` in `campo-data.js`, `campo/index.html` e `shared/dw-ponti.js` non compaiono; le sole occorrenze in tutto `apps/` sono in Scudo. |
| PDF export con branding | **C'È A METÀ** | *C'è*: il **«Rapporto di fine turno» stampabile completo** — bottone `btn-rapporto-turno` (`index.html:903`), generatore a `index.html:3626-3750`, con quadro, checklist, meteo, appello nominativo, obiettivo, attività, fermi per causale, disponibilità per turno, foto delle anomalie, produzione, rapportini, chiusura e firme, riaperture; apre in scheda nuova con `window.print()` (3747), quindi «salva in PDF» è un passo del browser. *Manca*: il **marchio del cliente** — l'intestazione è fissa. ⏱️ *Prova riscritta il 09/08 · verdetto invariato: la citazione era «riga 3692», e quella riga è finita a 4316. Il nome, che è stabile: `grep -c 'Deepwork Campo · ' apps/campo/index.html` → **1**, ed è l'unica intestazione che il foglio stampato conosce (`<h1>Rapporto di fine turno</h1>` seguito da `Deepwork Campo · ${oggi}`), con il piede «Generato da Deepwork Campo». Nessun logo né ragione sociale dell'azienda: `grep -ciE '\blogo\b\|marchio' apps/campo/index.html` → **4** righe (2 per `\blogo\b`, 2 per `marchio`), e sono la variabile d'alone `--glow-logo`, la scritta `logo-sm` della barra in alto, e due commenti sul **marchio della dimostrazione** che `nomeCsvDimostrazione` mette sui file che escono — nessuna delle quattro è il marchio del cliente.* ⚠️ *E il termine `logo` senza i confini di parola non si può usare: `grep -ciE 'logo' apps/campo/index.html` dà **14** righe, e dodici sono `Riepilogo`, `riepilogoFermi`, `pianoRiepilogo`, `dialogo` e `meteorologo`. È la prima causa d'invecchiamento — un termine corto dentro parole comuni — in una veste italiana che non viene in mente.* ⏱️ **E il «fermi per causale» di questo elenco diceva meno del vero fino al 03/08** (`6048442`): la tabella stampata portava solo il **conto** delle anomalie, non i minuti, quindi un fermo mai misurato e uno da quasi un'ora erano la stessa riga. Adesso porta il tempo perso e dichiara quanti fermi i minuti non ce l'hanno. |
| Offline sync & conflict resolution | **CONFERMATO ASSENTE** | Nessuna registrazione di service worker in `campo/index.html` (cercato `serviceWorker`: zero). Lo scheletro può arrivare dalla cache del `sw.js` di radice, che però **non precarica** nessun file sotto `apps/` (`APP_SHELL`, `sw.js:7-25`) e li prende solo a runtime. Soprattutto: **i dati non hanno persistenza offline** — l'SDK usa `getFirestore` liscio (`shared/deepwork-id-client/index.js:63`), mentre `persistentLocalCache` è attivato **solo nel core** (`index.html:126-137`). Nessuna coda di scritture, nessuna risoluzione di conflitti: cercati `IndexedDb`, `persistentLocalCache`, `enableIndexedDbPersistence` in `shared/` → zero. |
| Multi-site coordination dashboard | **CONFERMATO ASSENTE** | `grep -ciE 'multi-sito\|multi-cava\|più cave\|\bsede\b' apps/campo/campo-data.js apps/campo/index.html` → **0 e 0**. `cantiere` è il termine largo di questa riga e non si può contare, si può solo caratterizzare: `grep -ohiE '[a-zà-ù]*cantiere[a-zà-ù]*' apps/campo/campo-data.js apps/campo/index.html \| sort \| uniq -c` → **8 `capocantiere`** (il ruolo, di cui uno in maiuscolo) e **5 `cantiere` nudo**, e nessuno dei tredici è un secondo sito: due sono **«questo cantiere»** detto del nostro lavoro nei commenti — il gergo di casa, non quello della cava —, una è «squadre di cantiere» nel commento dell'import CSV, e due sono la ragione a testo libero «altro cantiere» offerta quando un operatore non è disponibile. Resta l'`area` della squadra («fronte Est»). Un'organizzazione = una cava; niente confronto fra siti. ⏱️ *Scomposizione corretta il 09/08 · verdetto invariato: diceva «**tre** questo cantiere … **una** altro cantiere», e sono **due e due** — e lo erano già al commit precedente, quindi non era scaduta, era contata male. Il totale (tredici) era giusto, ed è esattamente il modo in cui un errore di scomposizione sopravvive: **ogni addendo ha un lettore che lo conosce, il totale no.*** |
| Turno chiuso con firma digitale | **C'È A METÀ** — la riga del documento era già giusta | *C'è*: `chiusuraDi`, `turnoChiuso`, consegna/ricevuta/ora, blocco delle modifiche dopo la firma (`index.html:1069-1093`) e la **traccia delle riaperture** con chi/quando/perché (`riaperture` 676, `ultimaRiapertura` 697). *Manca*: la firma **reale** — cercati `firma digitale`, `firma grafometrica`: zero; la firma è il nome di chi consegna scritto in un campo di testo. |
| Real-time weather grid (DTN, 6 km) | **CONFERMATO ASSENTE** | Il meteo è **inserito a mano**: `METEO_CIELO`/`METEO_PISTE`/`METEO_VISIBILITA`, `meteoDi`, `meteoAvverso`. `grep -cE 'fetch\(\|XMLHttpRequest\|https://api' apps/campo/index.html` → **0**. ⏱️ *Nota d'ecosistema aggiunta il 09/08 · verdetto invariato, ma un lettore che cerca fuori da Campo la trova e senza questa riga la scambierebbe per una scadenza:* il **core** ha una scheda meteo che chiamerebbe un proxy con la latitudine e la longitudine della cava (`CLOUD_PROXY_URL`, `?lat=…&lon=…`), ma quella costante è la **stringa vuota** e la scheda si nasconde da sé — quindi oggi non parte nessuna chiamata, e comunque sarebbe il meteo **di un punto**, non la griglia a 6 km che il concorrente vende. |
| Equipment RFID per componenti | **CONFERMATO ASSENTE** | Stessa ricerca di `RFID`/`barcode`/`QR`: zero in Campo e in Flotta. |
| Predictive maintenance | **CONFERMATO ASSENTE** in Campo | Cercati `predittiv`, `previsione`, `manutenzione preventiva` in `campo-data.js`: zero. *Nota d'ecosistema*: in Flotta c'è la **previsione a scadenza** (`previsioneGiorni`, `flotta-data.js:696`; `ritmoOreMezzi`, 2053; `tagliandiInScadenza`, 2110), che è programmazione, non previsione di guasto. |
| API export per data warehouse | **C'È A METÀ** | *C'è*: ⏱️ **cinque** export CSV, non uno — la prova di questa riga era rimasta al primo. Contati il 07/08 **per effetto** (`a.download =` sul committato, non per somiglianza di nome): `campo_appello.csv` (`index.html:2947`), `campo_storico.csv` (3333), `campo_attivita.csv` (3593), `campo_squadre.csv` (3997), `campo_consuntivo_carico.csv` (4495) — più la consegna di turno `.txt`, che non è un CSV ma **esce** lo stesso. ⏱️ *E il conto delle funzioni del modulo è stato corretto il 09/08, per lo stesso motivo per cui il conto dei download era stato corretto il 07/08 — contato per **nome** invece che per **effetto**.* Diceva «**sette** funzioni che compongono un CSV»; rimisurato: `grep -cE '^export function [a-zA-Z_]*[Cc]sv' apps/campo/campo-data.js` → **8**, ma di quelle otto **cinque compongono** (`csvStorico`, `csvAttivita`, `csvAppello`, `csvSquadre`, `pianoConsuntivoCsv` — sono le sole che finiscono con `CONSUNTIVO_COLONNE.join(";")` o simile) e **tre leggono** (`parseSquadreCsv`, `parsePianoCsv`, `mappaPianoCsv`). Un lettore che rilancia il conto sul nome trova otto e crede scaduta tutta la riga. `pianoConsuntivoCsv` con `CONSUNTIVO_COLONNE` è ancora lì, ed è uno dei cinque. *Manca*: qualunque endpoint o API; nessuna chiamata in uscita esiste nella pagina — **questo non è cambiato**, ed è il motivo per cui il verdetto resta «c'è a metà». ⚠️ La correzione non ribalta la riga: la rende **credibile**. Una prova che invecchia fa buttare via la riga giusta insieme a quelle sbagliate — è la stessa cosa che il 06/08 era costata due righe di `CONCORRENTI_SCUDO.md` («l'unica stampa è il verbale DPI»: erano due). |
| Anomalie: radice, azione correttiva tracciata, follow-up (§4.1) | ⏱️ **SCADUTA — COMPLETA DAL 01/08** (verifica `f3432f4` 16:55 → costruito `29f0229` 17:45, **50 minuti**: `ORIGINE_FERMO` e `azioniDelFermo` in `apps/campo/campo-data.js:2513,2584`, `azioniDiOrigine` e `statoPonte` in `shared/dw-ponti.js:1091,1102`, 11 usi nella pagina di Campo (`azioniDelFermo`, `statoRisposta`, `bozzaAzioneFermo`, `fermiEAzioni`, `coperturaFermi`, `anomalieAperte`). ⏱️ *Prova rimisurata il 09/08: il verdetto regge, la prova no.* Diceva che tutti e tre i nomi stavano in `shared/dw-ponti.js` — due ci stanno sotto un altro nome (la regola generale, `azioniDiOrigine`) e due vivono nel modulo di Campo (il caso particolare, il fermo). E i «12 punti» non erano più riproducibili: il ponte è cresciuto e ha altri nomi, quindi il numero adesso dice **quali** invece di quanti. La metà che mancava era proprio questa) | *C'è, in Scudo*: le azioni correttive complete — `azioni/{id}` con `descrizione`, `responsabileId`, `scadenza`, `stato`, `esito`, `dataChiusura`, `origineTipo`/`origineId` (`scudo-data.js:16-18`, esempi 163-166), `statoAzione`, `azioniUrgenti`, `azioniDiEvento`, e l'analisi del «perché» che genera `azioniId` (60-63); nella pagina la freccia che riporta all'evento d'origine (`apps/scudo/index.html:2053`). ⏱️ **E LA PROVA QUI SOTTO ERA RIMASTA QUELLA DI PRIMA, cioè questa riga si contraddiceva da sola**: l'intestazione diceva «completa dal 01/08» e il corpo continuava a dire che manca. Quello che c'era scritto — *«`origineTipo` ammette `evento\|ispezione\|nc\|superamento\|reclamo` e **non** un'anomalia di Campo»* — era vero al `f3432f4` ed è **falso dal `29f0229`**. Riverificato il 07/08 sul committato: `ORIGINI_CAMPO = ["fermo"]` (`scudo-data.js:913`), `daCampo(a)` (915), la frase che ne esce in `origineAzione` — «da un fermo di produzione registrato in Campo» e, sul documento, «fermo di produzione (Campo)» — e la prova che pretende `scudo.ORIGINI_CAMPO` e `campo.ORIGINE_FERMO` **uguali** (la ragione è scritta a 911-912). Quindi l'anomalia registrata al fronte **ci entra**. ⚠️ Resta vero un pezzo più piccolo, e va detto senza gonfiarlo: il commento dello schema in cima al modulo (`scudo-data.js:29`) elencava le origini **senza `fermo`** — corretto il 07/08. Una riga scaduta nel corpo non rende sbagliato il verdetto: rende **non credibile** tutta la riga, e chi la riapre fra un mese la butta via insieme a quelle giuste. |

### Riepilogo numerico — Campo

| | |
|---|---|
| Righe verificate | **22** |
| Confermate assenti | **13** |
| False (c'era già) | **2** |
| A metà | **7** |

⏱️ **La tabella qui sopra è la fotografia del 01/08 e va letta come tale** — è
il conto di quel giorno, non di oggi, e nessuno gliel'aveva mai scritto
accanto. Quattro delle tredici «confermate assenti» e una delle sette «a metà»
sono state **colmate dal prodotto** nei giorni seguenti, quindi al 09/08 le
stesse ventidue righe si dividono così:

| | | |
|---|---|---|
| Righe verificate | **22** | |
| Confermate assenti | **11** | tutte hardware o integrazioni |
| False (c'era già) | **2** | KPI in tempo reale, matrice delle abilitazioni |
| ⏱️ Scadute (colmate dal prodotto) | **4** | fatigue, contractor induction, anomalia→azione correttiva, **near-miss** |
| A metà | **5** | photo annotation, work order, PDF col marchio, firma reale, API |

⚠️ La quarta scaduta è quella trovata **oggi** (il near-miss): fino a stamattina
erano tre, ed era «a metà» a cinque. Il conto che la roadmap dichiara va
allineato con questa riga, se no la prossima lettura ricomincia da un numero
vecchio — è la regola «chi chiude un'unità aggiorna la riga che gliel'aveva
proposta», applicata al conto invece che al testo.

**Le false:** *real-time KPI durante il turno* (c'è, e con il flag `provvisorio` che distingue «finora» da «finito») e *skill/certification matrix* (c'è per intero in Scudo, e Campo ne legge già l'esito nell'appello).

**Errore di fatto trovato nel documento, oltre ai verdetti:** §4 «Work order as a native object» scrive che «le manutenzioni in Deepwork vivono in Scudo (HSE) come check di conformità». Non è vero: vivono in **Flotta**, come ordini di lavoro con stato, manodopera, ricambi e costo calcolato. Chi avesse letto quella riga avrebbe progettato da zero una cosa che esiste da settimane.

### La mancanza confermata più importante — Campo

> ⏱️ **QUESTA MANCANZA È STATA COLMATA IL 01/08 ALLE 17:45** (`29f0229`), cinquanta
> minuti dopo che la riga qui sotto è stata scritta. Il testo resta com'era —
> serve a ricordare che **la voce più in vista di un documento invecchia come
> tutte le altre**, e che qui non c'è più lavoro da fare. Quale sia adesso la
> mancanza più importante di Campo **non lo si può dire senza riverificare**: è
> esattamente ciò che misura `documenti-invecchiati.mjs`.
>
> ⏱️ **E LA RISPOSTA DEL 03/08 È SCADUTA A SUA VOLTA, IN TRE ORE E
> QUARANTOTTO MINUTI — riverificata il 09/08.** Il blocco qui sotto dichiarava
> «il near-miss segnalabile dal fronte» come la mancanza più importante di
> Campo, misurata alle 09:09 del 03/08 (`6048442`). È stata **costruita alle
> 12:57 dello stesso giorno** (`88bc73f`): bottone «Segnala un near-miss»
> (`btn-nm`) in cima alla schermata, `segnalazioniDelTurno`,
> `testoSegnalazioniTurno`, `categorieGiaSegnalate`, segnalazione anonima, foto,
> e la riga che finisce nel registro di sicurezza di Scudo. Prova:
> `grep -ciE 'near-miss|mancato infortunio' apps/campo/campo-data.js apps/campo/index.html`
> → **11 e 14**, dove il 03/08 dava **0 e 0**.
>
> ⚠️ **Ed è la seconda volta di fila che la voce più in vista di questo
> documento invecchia — la prima è raccontata due paragrafi più su, e la
> lezione non è stata imparata.** Il testo del 03/08 resta com'era scritto, per
> la stessa ragione di allora. Ma va aggiunta la cosa nuova: qui il documento
> **sapeva** — il blocco del 06/08 elenca «il near-miss segnalato dal fronte»
> fra le cose costruite, a duecento righe di distanza da questa. Quindi non è
> mancata la misura, è mancato il **collegamento**: chi aggiorna il racconto in
> cima non tocca la sezione in fondo, e chi legge la sezione in fondo non
> risale al racconto. **Una dichiarazione che vale per una riga va scritta
> sulla riga**, non in un blocco che la nomina.
> Quale sia adesso la mancanza più importante di Campo **non lo si può dire
> senza riverificare**: fra le undici confermate assenti restano solo hardware
> e integrazioni (GPS, IoT, tablet in cabina, RFID, offline, multi-cava), e
> nessuna delle sei righe «a metà» è stata rimessa in ordine di importanza.
>
> ✅ **Riverificato il 03/08, e la risposta era: il near-miss segnalabile
> dal fronte.** Misurato quel giorno, non riportato dal documento vecchio:
> `near-miss`, `mancato infortunio`, `quasi infortunio`, `hazard` in
> `campo-data.js`, `campo/index.html` e `shared/dw-ponti.js` → **zero, zero,
> zero**. In Scudo invece il giro è completo e costruito apposta per il
> piazzale: «Segnala un near-miss» (`scudo/index.html:774`, con il commento a
> 207 — *«si segnala in piedi sul piazzale, con i guanti»*), la sezione
> «Infortuni e near-miss» (1185), il riepilogo aggregato nella forma che chiede
> la **L. 198/2025** per le aziende oltre i 15 addetti (1215-1233), e l'azione
> correttiva collegata (1067).
>
> ⚠️ **E va detto che cosa NON è**, se no è un allarme gonfiato: non è una
> funzione che manca all'ecosistema — c'è, ed è fatta bene. È una **funzione
> che non sta dove sta la persona**. Chi è al fronte ha in mano Campo, e per
> segnalare il quasi-infortunio che ha appena visto deve uscire, aprire
> un'altra app e ritrovarcisi dentro. È la stessa forma del ponte «anomalia →
> azione correttiva» che è stato costruito il 01/08: non si inventa niente, si
> collega da dove il fatto succede a dove il fatto viene trattato. La
> differenza è il **momento**: un fermo si registra a mente fredda a fine
> turno, un near-miss o lo si segnala nei trenta secondi dopo o non lo si
> segnala più — ed è precisamente il dato che la legge nuova chiede di
> contare.

**Il ponte «anomalia di Campo → azione correttiva».** Non è la più ricorrente fra i
concorrenti (lo sono geofencing e photo annotation), ma è l'unica che oggi fa
perdere un dato che l'app ha già in mano: al fronte si registra la causale e i
minuti di fermo, e lì la riga muore — mentre la macchina che le darebbe seguito
(responsabile, scadenza, chiusura, verifica) è già costruita in Scudo e non
aspetta altro che un `origineTipo` in più.

È anche la mancanza che l'ispettore vede per primo: un registro di anomalie
senza traccia di che cosa si è fatto per non farle ricapitare è esattamente il
documento che in una visita non regge, e per chiuderla non serve inventare
niente — serve collegare due cose che esistono.
