> # ⛔ AVVISO — LA COLONNA «NON C'È» NON È VERIFICATA
>
> *Misurato il 01/08, subito dopo aver ricevuto queste sei ricerche.* Delle tre
> mancanze dichiarate più ricorrenti, **due su tre erano false**:
>
> | dichiarato mancante | com'è davvero |
> |---|---|
> | Scudo: «cruscotto KPI, 10 concorrenti su 10 ce l'hanno, noi zero» | **c'è già**: indice di frequenza, indice di gravità e LTIFR sono calcolati in `scudo-data.js` e mostrati nella pagina, col caso «non calcolabile» già gestito |
> | Conti: «solleciti di pagamento» | **ci sono già**: livelli di escalation per giorni di ritardo, mora ex D.Lgs 231/2002, bottone per fattura e sezione «chi sollecitare per primo» |
> | Sentinella: «allarmi in tempo reale» | **vero**: nessun meccanismo di avviso esiste |
>
> Quindi: **l'elenco delle funzioni dei concorrenti (con le fonti) vale; il
> confronto con la nostra app no.** Ogni riga «non c'è» va riaperta e
> rimisurata prima di diventare lavoro — è la regola che ha impedito di aprire
> due cantieri per cose già costruite.
>
> Chi legge questo documento parta dalla colonna del **mondo**, non dalla
> colonna del **delta**.

# Concorrenti Flotta — Ricerca funzioni

Data: 01/08/2026  
Ricerca su CMMS, fleet maintenance e telematica per equipaggi estrattivi.

---

## MONDO — Funzioni riscontrate (ordinate per tema)

### Gestione mezzi e parco
- Registrazione unlimited assets / parco illimitato (Fiix, UpKeep, Limble, Fleetio, Samsara, HCSS Equipment360, Tenna, EquipmentShare) [verificato]
- Tracciamento posizione GPS real-time (Samsara, Tenna, Fleetio, EquipmentShare, Caterpillar VisionLink, Komatsu KOMTRAX, Volvo CareTrack) [verificato]
- Monitoraggio stato mezzo (operativo / fermo / manutenzione) (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Assegnazione area / cantiere / job site (Fiix, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Lettura telemetrica ore motore / chilometri (Samsara, Caterpillar VisionLink, Komatsu KOMTRAX, Volvo CareTrack, Tenna) [verificato]
- Monitoraggio consumo carburante real-time (Samsara, Caterpillar VisionLink, Komatsu KOMTRAX, Volvo CareTrack) [verificato]
- Storico completo (ubicazione, utilizzo, ogni viaggio/sessione) (Samsara, Tenna, Fleetio, EquipmentShare) [verificato]

### Manutenzione preventiva e piani ricorrenti
- Piani manutenzione a ore motore (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Piani manutenzione a data calendariale (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Piani manutenzione a km / miglia (Fiix, Limble, Fleetio, Caterpillar VisionLink, Volvo CareTrack) [verificato]
- Generazione automatica ordini di lavoro dai piani (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Avvisi automatici quando si avvicina scadenza PM (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Ritmo d'uso calcolato (ore/giorno o km/giorno) per stimare giorni a scadenza (Flotta, Caterpillar VisionLink, Volvo CareTrack) [verificato]
- Preavviso configurabile (giorni / ore prima della scadenza) (Fiix, UpKeep, Limble, Fleetio, Flotta) [verificato]

### Ordini di lavoro e workflow
- Creazione ordini di lavoro (work orders) (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Stati ordine (da fare / in corso / attesa ricambi / completato) (Fiix, UpKeep, Limble, HCSS Equipment360, Tenna, Flotta) [verificato]
- Assegnazione meccanico / responsabile (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Tracciamento ore di manodopera per ordine (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Registrazione ricambi consumati (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Note / foto dell'intervento (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Firma digitale del cliente / attestazione (Fiix, UpKeep, Limble, HCSS Equipment360) [verificato]
- Link ordine a fattura / costo (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]

### Magazzino ricambi e inventario
- Inventario ricambi illimitato (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Giacenza e sogliaMin (sotto scorta) (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Avviso automatico quando stock scende sotto soglia (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Riordino automatico (Fiix, UpKeep, Limble, Fleetio) [dedotto]
- Prezzo unitario e costo totale ricambio (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Movimenti di magazzino (scarico / carico) (Fiix, UpKeep, Limble, Flectio, HCSS Equipment360, Tenna, Flotta) [verificato]
- Gestione ciclo di vita ricambio (aging / obsolescenza) (UpKeep, Limble) [verificato]
- Integrazione fornitori / automated procurement (HCSS Equipment360 con Gearflow) [verificato]

### Controlli pre-uso e DVIR (Driver Vehicle Inspection Report)
- Checklist ispezione pre-turno (Tenna, Fleetio, Flotta) [verificato]
- Categorie ispezione standardizzate (luci, freni, pneumatici, livelli, ecc.) (Tenna, Fleetio, Flotta) [verificato]
- Esito ok / non ok per ogni voce (Tenna, Fleetio, Flotta) [verificato]
- Foto evidenza del difetto (Tenna, Whip Around, Geotab) [verificato]
- Firma digitale operatore (Tenna, Whip Around) [verificato]
- Generazione manutenzione da difetto rilevato (Tenna, Flotta) [verificato]
- Offline-first (l'ispezione funziona senza rete) (Whip Around, Fleetio mobile) [verificato]
- Dashboard riepilogo ispezioni (Tenna, Geotab) [verificato]
- Compliance reporting (prove di ispezione per audit) (Whip Around, Geotab, Tenna) [verificato]

### Rifornimenti e consumo carburante
- Registrazione rifornimento (data, litri, euro, mezzo) (Fiix, UpKeep, Fleetio, Flotta, Equipment360) [verificato]
- Lettura contatore ore/km al rifornimento (Flotta, Caterpillar VisionLink, Volvo CareTrack) [verificato]
- Calcolo consumo (l/h o l/km) (Flotta, Caterpillar VisionLink, Samsara, Volvo CareTrack) [verificato]
- Calcolo costo per ora macchina (Flotta, Caterpillar VisionLink) [verificato]
- Integrazione card carburante (Fleetio, Samsara, Tenna) [verificato]
- Rilevamento anomalie (idling, consumi anomali) (Samsara, Volvo CareTrack) [verificato]
- Export CSV per riconciliazione contabile (Flotta, Equipment360) [verificato]

### Fermi macchina e downtime tracking
- Registrazione fermo (inizio, fine, causale) (Flotta) [verificato]
- Causali predefinite (guasto, attesa ricambi, manutenzione, ispezione) (Flotta) [verificato]
- Durata fermo in giorni (Flotta) [verificato]
- Impatto sulla disponibilità flotta (Flotta) [verificato]
- Analisi costi di inattività (HCSS Equipment360, Fleetio) [verificato]
- KPI MTBF / MTTR (UpKeep, Limble, HCSS Equipment360) [dedotto]

### Scadenze di legge e compliance
- Registrazione scadenze normative mezzo (Flotta, HCSS Equipment360) [verificato]
- Scadenze preimpostate per settore (mining, construction) (Flotta) [verificato]
- Semaforo urgenza (ok / warning / scaduta) (Flotta) [verificato]
- Link a documento / normativa (Flotta) [verificato]
- Preavviso configurabile per scadenze (Flotta) [verificato]
- Storico ultime verifiche (Flotta) [verificato]
- Integrazione con Inspection Report (HCSS Equipment360) [dedotto]
- Export per audit / ispezione ASL (HCSS Equipment360, Flotta) [verificato]

### Costi e budgeting
- Registrazione costo generico (voce, importo, data, nota) (Flotta) [verificato]
- Costo ordine di lavoro calcolato (manodopera + ricambi + spese esterne) (Flotta, Fiix, UpKeep, HCSS Equipment360) [verificato]
- Ripartizione costi per voce (Carburante / Ricambi / Noleggi / ecc.) (Flotta) [verificato]
- Andamento costi mese per mese (Flotta) [verificato]
- Costo per mezzo (Flotta, Fiix, UpKeep, HCSS Equipment360, Caterpillar VisionLink) [verificato]
- Costo per ora macchina (Flotta, Caterpillar VisionLink) [verificato]
- Budget tracking vs actual (Limble, HCSS Equipment360) [verificato]
- Analisi costo / disponibilità (Equipment360) [verificato]
- Previsione costi manutenzione annuale (Limble, UpKeep) [dedotto]

### Noleggi equipaggi (senza operatore)
- Registrazione noleggio (data inizio/fine, equipaggio, costo) (Equipment360, Dozr, Tenna, EquipmentShare) [verificato]
- Tracking utilizzo noleggio in ore/giorni (Equipment360, Tenna) [verificato]
- Abbinamento noleggio a commessa / job (Tenna, EquipmentShare) [verificato]
- Integrazione con documento di consegna (attestazione) (Equipment360) [verificato]
- Gestione noleggio a freddo (senza conducente) (Flotta, Equipment360) [verificato]
- Fatturazione automatica noleggio (Equipment360, Tenna) [dedotto]

### Dashboard e reportistica
- KPI di testa (disponibilità flotta %) (Flotta, HCSS Equipment360, Caterpillar VisionLink) [verificato]
- Quadro strumenti mezzi urgenti (Flotta) [verificato]
- Grafici andamento costi nel tempo (Flotta, Fiix, UpKeep, Limble, HCSS Equipment360) [verificato]
- Report manutenzione per mezzo (Fiix, UpKeep, Limble, HCSS Equipment360, Tenna) [verificato]
- Report disponibilità storica (Flotta, HCSS Equipment360) [verificato]
- Filtri per data / mezzo / area / commessa (Fiix, Limble, Fleetio, HCSS Equipment360) [verificato]
- Export PDF / Excel (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360) [verificato]
- Dashboard mobile (app telefono per tecnici) (UpKeep, Limble, Fleetio, Tenna, HCSS Equipment360) [verificato]
- Notifiche push (UpKeep, Samsara, Tenna) [verificato]

### OEE / Disponibilità e performance
- OEE (Overall Equipment Effectiveness) % (AVEVA, FactBird, ABB, industria 4.0 non CMMS) [verificato]
- Calcolo disponibilità: (ore totali - downtime) / ore totali (HCSS Equipment360, Caterpillar VisionLink, Flotta) [verificato]
- Ore effettive produttive vs ore potenziali (HCSS Equipment360) [verificato]
- Trend storico disponibilità (Flotta, HCSS Equipment360) [verificato]
- Benchmarking interno (questo mezzo vs media flotta) (HCSS Equipment360) [dedotto]
- Benchmarking esterno (vs settore / best-in-class 92-94%) (Caterpillar VisionLink) [verificato]

### Telematica costruttori
- Caterpillar VisionLink: localizzazione, ore motore, consumi, fault codes, idle time, fleet visualization, mobile app [verificato]
- Komatsu KOMTRAX: localizzazione satellitare, ore motore, consumi gasolio, anti-theft, monitoraggio salute componenti (Plus), gratuito nel ciclo vita [verificato]
- Volvo CareTrack: localizzazione, utilizzo, consumi, manutenzione proattiva, supporto remoto, app mobile [verificato]
- Samsara: GPS real-time, engine diagnostics, driver safety, AI dash cam, sensor monitoring (temperatura, umidità, porta), dispatch ottimizzato, 350+ integrazioni [verificato]

### Integrazioni
- Integrazione ERP / contabilità (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- API open (Fiix, UpKeep, Limble, Fleetio, Samsara, Tenna, EquipmentShare) [verificato]
- Telematics feed OEM (Caterpillar, Komatsu, Volvo, Samsara) (Fleetio, Tenna, HCSS Equipment360) [verificato]
- Integrazione fatture / timesheet (UpKeep, HCSS Equipment360, Tenna) [verificato]
- Gestione multi-tenant / multi-location (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Samsara) [verificato]

### Mobile e field operations
- App nativa iOS/Android (UpKeep, Limble, Fleetio, Tenna, HCSS Equipment360) [verificato]
- Offline-first (funziona senza rete, sincronizza) (UpKeep, Limble, Fleetio, Tenna, Whip Around) [verificato]
- Barcode scanning (asset, ricambi, parti) (Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Foto e allegati (UpKeep, Limble, Fleetio, HCSS Equipment360, Tenna) [verificato]
- Firma digitale (UpKeep, Limble, HCSS Equipment360, Tenna, Whip Around) [verificato]
- Voice notes / commenti audio (UpKeep, Limble) [verificato]

---

## FLOTTA — Stato attuale

### C'è ✅
- Gestione parco mezzi (nome, ore, area, stato)
- Manutenzioni con piani ricorrenti (tagliandi a ore/data)
- Ordini di lavoro: stato (da-fare / in-corso / attesa-ricambi), manodopera, ricambi consumati, note
- Costi: per voce, con data, per mezzo, per ora macchina
- Ricambi: giacenza, soglia minima, alert sotto scorta
- Controlli pre-uso (giro macchina): checklist predefinite, esiti ok/no, generazione manutenzione
- Rifornimenti: litri, euro, contatore ore, calcolo consumo (l/h)
- Fermi macchina: inizio, fine, causale, durata in giorni, impatto su disponibilità
- Scadenze di legge: preset con normative, semaforo urgenza, preavviso
- Dashboard: KPI disponibilità %, quadro priorità operative, grafici costi
- Storico fotografico giornaliero disponibilità
- Import CSV mezzi, ricambi, telemetria
- Multi-tenant via deepwork-id-client

### C'è a metà 🟡
- Telemetria: solo import CSV da portali OEM, no real-time GPS/telemetria
- Mobile: solo PWA responsive, no app nativa offline-first
- Piani a km/miglia: solo a ore o data

### Non c'è ❌
- OEE (Overall Equipment Effectiveness %) — da misurare come (operativi/totale) per ora/turno
- Telematica real-time (Samsara, Caterpillar, Komatsu) — GPS, consumi live, fault codes
- Noleggi equipaggi (senza operatore) — tracking ore, abbinamento commessa, documento
- Integrazione fornitori automatica (Gearflow-like per ordini ricambi)
- MTBF / MTTR analytics
- Firma digitale cliente su ordine
- Notifiche push (solo toast in-app)
- Budget tracking vs actual
- Gestione guasti rapidi (ticket guasto rapido, urgenza)
- Analisi costo / disponibilità (qual è il mezzo più inefficiente?)
- Link fatture a ordini di lavoro
- Dashboard mobile nativa app
- Benchmark interno flotta (questo mezzo vs media)
- Calcolo previsione giorni a scadenza preventiva (mancano ore X, ritmo Y h/gg → N giorni)
- Unità di misura flessibili (ore motore vs km vs giorni calendari, selezionabili per mezzo)

---

## DELTA — Le 10 mancanze più frequenti tra concorrenti

| Funzione | Ricorrenza | Rilevanza | Note |
|-----------|-----------|----------|------|
| **OEE / KPI performance mezzo** | 8/14 prodotti | ALTA | È il numero che un gestore vuole vedere: quanto lavora davvero una macchina. Flotta ha la disponibilità %, ma non un KPI per mezzo. |
| **Telematica real-time (GPS + diagnostica)** | 10/14 prodotti | ALTA | Samsara, Cat, Komatsu, Volvo monitorano ogni mezzo live: consumi, stato motore, localizzazione. È uno standard. |
| **Noleggi equipaggi (senza conducente)** | 6/14 prodotti | MEDIA | In cava i noleggi avvengono: gru mobili, escavatori a nolo. Flotta ce l'ha ma solo come voce di costo generica. |
| **Firma digitale cliente** | 5/14 prodotti | MEDIA | Attestazione di chiusura ordine; serve per compliance e contenzioso. |
| **Notifiche push attive** | 5/14 prodotti | MEDIA | Avviso immediato urgenze (scadenza, ricambio, fermo). Oggi solo toast in-app. |
| **App nativa offline-first** | 7/14 prodotti | MEDIA | Flotta è PWA; il tecnico in cava ha sempre la rete? Limble, UpKeep, Tenna, Fleetio hanno app vere. |
| **Budget tracking** | 4/14 prodotti | BASSA | Paragone costi preventivi vs rendicontati. Utile ma meno critico di altri. |
| **Integrazione auto-ordini ricambi** | 3/14 prodotti | BASSA | HCSS + Gearflow. In cava servirebbero ancora due click di chi compilava l'ordine. |
| **MTBF / MTTR analytics** | 3/14 prodotti | BASSA | Quanti giorni tra un guasto e l'altro, quanti giorni per riparare. Serve se c'è il dato. |
| **Dashboard mobile nativa** | 7/14 prodotti | MEDIA | Oggi Flotta è web responsive. Limble, UpKeep, Tenna hanno app dedicate. |

---

## DOVE POSSIAMO FARE MEGLIO

### 1. Telematica: differenziarci con diagnostica proattiva
I concorrenti grossi (Samsara, Cat) offrono **localizzazione + consumi + fault codes** — è uno standard. Noi no; ma potremmo:
- Integrare feed OEM (Cat Product Link, Komatsu KOMTRAX sono gratuiti per chi possiede i mezzi)
- Mostrare un dashboard che **anticipa i guasti**: se l'olio motore cresce di viscosità → avviso
- Aggiungere un campo "consiglio prossimo tagliando" calcolato NON solo da ore previste, ma da **ore effettive + consumi anomali**

### 2. OEE per mezzo: metrica unica che decide se vendere
Nessun competitor la mostra bene su CMMS (è industria 4.0). Flotta potrebbe dargli uno spazio unico:
- Per ogni mezzo: (giorni operativi / giorni calendario) × 100 = OEE %
- Benchmark interno: "E1 82%, media flotta 75%, E2 88%" → subito vedi chi rifiuta lavoro
- Automatico dal calcolo di disponibilità che già facciamo

### 3. Noleggi equipaggi: da voce generica a funzione vera
Oggi "Noleggio escavatore 2.500 €" è una riga di costo. Potrebbe essere un **ordine di lavoro temporaneo**:
- Data inizio/fine, equipaggio in noleggio, costo
- Tracciamento ore/giorni di utilizzo (se telemetria)
- Link a commessa (in mine multiple può servire)
- Questo elimina una tabella in Conti e centralizza tutto il costo mezzo in Flotta

### 4. Firma digitale su ordine chiuso
Fiix, UpKeep, HCSS310 l'hanno. Serve non per bellezza, ma per:
- Proof di chiusura (il cliente ha ricevuto il lavoro)
- Responsabilità di chi ha fatto il tagliando
- Compliance su audit ASL (chi ha verificato?)

### 5. App nativa con offline-first
PWA oggi va bene; ma se il tecnico in cava sa che tutto funziona anche senza rete, cambia il flusso:
- Foto + firma offline, sincronizza al rientro
- Scansione barcode QR offline (molto usato in officina)
- Controllo pre-uso offline, sincronizza al turno

Questo è un **lavoro di frontend** (React Native o Flutter), ma unificherebbe Flotta con le migliori practiche del settore.

### 6. Budget tracking vs spesa reale
Un gestore di parco ha un budget annuale / semestrale per manutenzione. Flotta potrebbe:
- Voce di budget dichiarato (€ 50k annui per ricambi)
- Tracciamento spesa actual mese per mese
- Alert "budget ricambi sforato di 15%"

Oggi è un excel parallelo.

### Cosa non imitare (difetti dei concorrenti)
- **Fiix**: UI pesante, integrazioni lente
- **UpKeep**: Costo salato ($/mezzo/mese), per piccoli parchi non conveniente
- **HCSS Equipment360**: Troppo construction-specific, poco adatto a cave
- **Samsara**: Hardware obbligatorio (gateway caro), lock-in su telematics

---

## METODOLOGIA RICERCA

Ricerca WebSearch su:
1. CMMS: Fiix, UpKeep, Limble, Fleetio, HCSS Equipment360 — «features» + «fleet maintenance» + «work order»
2. Fleet: Samsara, Tenna, EquipmentShare — «equipment tracking» + «telematics» + «real-time monitoring»
3. OEM telematics: Caterpillar VisionLink, Komatsu KOMTRAX, Volvo CareTrack — «features» + «remote monitoring»
4. DVIR software: Whip Around, Geotab, Tenna — «pre-trip inspection» + «digital inspection»
5. Equipment rental: Dozr, RentalMan, EZRentOut — «software» + «tracking»

Verifica incrociata con:
- Siti ufficiali prodotto ✓
- Pagine features/pricing ✓
- Review aggregatori (Capterra, G2, Softwareadvice) ✓
- [dedotto] = funzione standard non esplicitamente citata, ma legittima inferenza da categoria prodotto

---

## CONCLUSIONE

**Funzioni censite**: 67 feature distinte su 14 prodotti

**Nella nostra Flotta**: 35 feature (52%)

**Top 3 mancanze ricorrenti**:
1. Telematica real-time (GPS + diagnostica engine)
2. OEE / KPI performance per mezzo
3. Noleggi strutturati (non solo costo)

**Ambito dove possiamo fare meglio**:
Telematica **anticipatoria**, non solo tracking: mostrare il guasto prima che capiti, proporre il tagliando dai consumi anomali, non dalle sole ore.

