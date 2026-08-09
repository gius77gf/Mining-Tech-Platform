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


---

## Verifica del delta (01/08)

> **Verificato contro il codice al commit `69e6c3f`** *(riverificato l'09/08, e le cinque «CONFERMATA ASSENTE» rimisurate una per una: i verdetti reggono, tre ricerche su cinque no;
> le verifiche precedenti erano a `57c78cf` l'08/08, a `4743c69` il 06/08 e a
> `f3432f4` il 01/08).*
>
> ### 08/08 (terzo passaggio) — otto commit, ZERO che mordono
>
> Fra `4743c69` e `5df42f6` Flotta è andata avanti di **8 commit**, **+442
> righe** e −100 — ed è l'unica delle sei con **zero commit che mordono**:
> nessuna `export function` e nessun `<button>` aggiunti o tolti. Detto in
> chiaro, perché è la ragione per cui questa riverifica costa poco: in
> quell'intervallo Flotta ha cambiato **come** dice le cose, non **quali** cose
> sa fare.
>
> La ricerca sul diff con i termini che ogni riga dichiara dà **due sole
> occorrenze**, tutt'e due `fattura`, e tutt'e due **prosa**:
> · un commento sul rifornimento (*«la pompa dice i litri, il prezzo lo dirà la
>   fattura del gasolio»*);
> · la nota di un rifornimento della dimostrazione (*«cisterna interna, fattura
>   non ancora arrivata»*).
> Nessun **legame** fra una fattura e un ordine di lavoro, che è quello che
> quella riga dichiara assente.
>
> Sui file interi: `firma digitale`, `firma grafometrica`, `stanziam`,
> `sforat`, `contabil`, `miglia`, `mile` → **0 ciascuno**; `km` → **0**, che è
> la prova diretta della riga sui piani a chilometri; `budget` → **1**, ed è un
> commento che spiega la domanda da cui nasce la decisione «la riparo ancora?»
> (`index.html:1969`), non un preventivo di spesa.
>
> ⚠️ Come per Terra e Sentinella, le ricerche sono fatte **con i confini di
> parola**: senza, `mile` entrerebbe in «si**mile**» e `km` in ogni `200km/h`
> di un testo qualunque. È la lezione pagata su Sentinella, dove senza confini
> uscivano cinque falsi allarmi su cinque.
>
> Ogni riga qui sotto
> era vera **a quel commit**, e non lo è più per forza adesso: il 01/08 una riga è
> scaduta in **trentacinque minuti**, perché la verifica e il cantiere che la
> colmava sono girati lo stesso pomeriggio senza sapere l'uno dell'altro.
> Di quanti commit l'app sia andata avanti da allora lo dice
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`. Le righe già trovate
> scadute portano la loro correzione accanto, con la data.
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
>
> ⏱️ **Riverificato a `69e6c3f` (09/08).** Fra `57c78cf` e qui Flotta è andata
> avanti di **4 commit**, **+218 righe** e −42, con **uno che MORDE**. Aperto,
> e **nessuna riga di questo documento cambia**. La misura, non la deduzione:
> · `<button>` aggiunti **0**, tolti **0** (`git diff … | grep -c '^\+.*<button'`);
> · l'unica `export function` nuova è **`statoGiro(controllo)`**, e non è una
>   capacità nuova: è il **badge del giro macchina** — che esisteva già ed è
>   documentato qui sopra fra le cose che l'app sa fare — portato dentro il
>   modulo dati accanto alla funzione che decide la stessa cosa a schermo. È il
>   movimento che questo repository fa di continuo (la decisione in un posto
>   solo), e sposta **dove** si decide, non **che cosa** l'utente può fare.
>   ⚠️ Quello che la funzione ha guadagnato è invece un *principio*: «nessun
>   giro non è un giro andato bene» — un controllo mai compilato risponde `da
>   fare` con `gravita: null` invece di «tutto a posto». Non è una riga di
>   confronto coi concorrenti, è la regola del fondatore applicata a un badge.
> · gli altri tre commit sono singolare, zero sommabile e una data del CSV:
>   cambiano **come** l'app dice le cose.
> ⚠️ E vale la nota di sempre: questa è la verifica **contro un commit noto**,
> che serve a tenere a zero l'arretrato di `documenti-invecchiati.mjs`. La
> prova vera resta quella riga per riga, con la sua data.

*Verificate tutte le righe delle liste «C'è a metà 🟡» e «Non c'è ❌», più le
righe della tabella DELTA che non vi comparivano. Due coppie erano lo stesso
punto scritto due volte — «Telematica real-time» (in ❌) è la stessa cosa di
«Telemetria: solo import CSV» (in 🟡), e «Dashboard mobile nativa» (in ❌) è la
stessa cosa di «Mobile: solo PWA» (in 🟡) — e sono contate una volta sola:
**16 righe distinte**.*

| Funzione | Verdetto | Prova |
|---|---|---|
| Telematica real-time (GPS + diagnostica + fault codes) | **C'È A METÀ** — la riga 🟡 del documento era **giusta** | *C'è*: `parseTelemetriaCsv` (`flotta-data.js`), import da CSV esportato dai portali OEM, con le letture del contatore e la loro data — che poi alimentano `ritmoOreMezzi`. *Manca*: qualunque flusso live. Cercati `GPS`, `posizione`, `real-time`, `fault code`, `diagnostic`, `latitudine` in `flotta-data.js` e `flotta/index.html`: nessuna occorrenza operativa, nessuna chiamata di rete verso un portale OEM. |
| Mobile: app nativa offline-first | **C'È A METÀ** — la riga 🟡 era **giusta**, ma per una ragione più seria di quella scritta | *C'è*: PWA installabile — manifest `standalone` con icone (`flotta/index.html:12`), e lo scheletro può arrivare dalla cache del `sw.js` di radice. *Manca*, e non è «solo l'app nativa»: **i dati non hanno persistenza offline**. Il `sw.js` non precarica nulla sotto `apps/` (`APP_SHELL`, `sw.js:7-25`) e il suo commento «le scritture le gestisce IndexedDB persistence di Firebase» (riga 66) **non è vero per le app**: `persistentLocalCache` è attivato solo nel core (`index.html:126-137`), mentre l'SDK che le app usano fa `getFirestore` liscio (`shared/deepwork-id-client/index.js:63`). Senza rete, in officina, non si scrive niente e non si legge niente. |
| Piani manutenzione a km / miglia | **CONFERMATO ASSENTE** — la riga 🟡 era **giusta** | I piani sono a ore o a data: `PIANI_TAGLIANDO` 250/500/1000/2000 **ore** (`flotta-data.js:1301-1311`), `ogniMesi` per il calendario, `aggiungiMesi`. Cercati `chilometr`, `km`, `miglia`, `odometro`, `contachilometri` in `flotta-data.js` e `flotta/index.html`: le sole occorrenze di «migliaia» riguardano il **separatore dei numeri**, non i chilometri.  ⏱️ *Rimisurata il 09/08: il verdetto regge, la ricerca no.* `chilometr`, `km`, `odometro` e `contachilometri` danno ancora **zero**; `miglia` dà **23** e sono tutte **`famiglia`, `migliaia`, `somiglia`** — cioè il termine di ricerca era sbagliato, non il verdetto. Un conto a chilometri non c'è.|
| OEE (Overall Equipment Effectiveness) | **C'È A METÀ** — e la ragione scritta nel documento («Flotta ha la disponibilità %, ma non un KPI per mezzo») è **falsa** | *C'è*, e **per mezzo**: `affidabilitaFlotta` (`flotta-data.js`) restituisce `mezzi[].pct` — la disponibilità della singola macchina sui giorni-macchina — oltre alla `pct` del parco, ed è disegnata mezzo per mezzo (`flotta/index.html:2254-2270`, con la nota «cioè una disponibilità sua del X%» accanto alla disponibilità del parco). *Manca*: **prestazione e qualità**, cioè i due fattori che rendono l'OEE un OEE — e l'assenza è già **dichiarata nel prodotto**, non dimenticata: il rapporto di Campo scrive «Disponibilità … **non è l'OEE**: l'OEE moltiplica disponibilità, prestazione e qualità, e prestazione e qualità qui non sono misurate» (`apps/campo/index.html:3079`, e già nel form a 713). |
| Noleggi equipaggi (senza operatore) | **C'È A METÀ** — «solo come voce di costo generica» è **inesatto** | *C'è*: la voce di costo `noleggio` → «Noleggi e leasing» in `shared/dw-ponti.js:657` (con `daMezzo: true`), i costi d'esempio (`flotta-data.js:331,333`) **e soprattutto** l'adempimento del noleggio a freddo fra le scadenze preimpostate: `noleggio-freddo` (413-416), con l'attestazione del buono stato e la dichiarazione che gli operatori sono formati e abilitati, da conservare per tutta la durata del noleggio. *Manca*: l'**oggetto noleggio** — data inizio/fine, ore o giorni di utilizzo, abbinamento a commessa. Cercati `noleggi`, `nolo`, `rental`: nessuna collection dedicata. |
| Integrazione fornitori / auto-ordini ricambi | **C'È A METÀ** | *C'è*: **che cosa e quanto ordinare** — `consumoRicambi` (`flotta-data.js`), `puntoDiRiordino(alGiorno, consegnaGiorni, sicurezzaGiorni)` (1805), `propostaScorte` che dà `daOrdinare`, `spesa` per riga e `spesaTotale`, e tiene a parte i ricambi `senzaConsumo` invece di inventarne la soglia. *Manca*: il **fornitore** — cercati `fornitor`, `approvvigion`, `catalogo`, `Gearflow`: nessuna anagrafica fornitori e nessun invio dell'ordine. |
| MTBF / MTTR analytics | **FALSO, C'È GIÀ** | `affidabilitaFlotta` (`flotta-data.js`) restituisce **`durataMedia`** — «durata media di un fermo (**MTTR** in giorni)» — e **`fraUnFermoELaltro`** — «giorni di lavoro fra un fermo e l'altro (**MTBF** semplificato)», commento e codice a 2010-2013, più `durataMedia` e `pct` per singolo mezzo (2002-2003). Sono anche **scritte in pagina**: «lunghi in media N giorni… Fra un fermo e l'altro il parco ha lavorato N giorni-macchina» (`flotta/index.html:2245-2246`). E hanno la regola d'onestà giusta: il «fra» non si scrive con un fermo solo (`episodi >= 2`). |
| Firma digitale cliente su ordine chiuso | **CONFERMATO ASSENTE** | Cercati `firma digitale`, `firma grafometrica`, `firma` in `flotta-data.js` e `flotta/index.html`: le uniche occorrenze sono **testi di normativa** dentro le note delle scadenze («ogni verifica va annotata con data, firma di chi l'ha fatta», 400). Nessun campo, nessun canvas di firma sull'ordine di lavoro.  ⏱️ *Rimisurata il 09/08:* le occorrenze di `firma` sono **quattro**, e due sono un significato diverso — «una **firma** troppo stretta» detto di una **funzione**, non di una persona. Nessuna è una firma raccolta dall'utente.|
| Notifiche push | **C'È A METÀ** (nell'ecosistema) | *C'è, nel core*: FCM completo — `firebase-messaging-sw.js` alla radice, registrazione del service worker dedicato e `getToken` con VAPID, token salvati sull'utente e limitati a 5 device, pronti per la Cloud Function che invierà le push (`index.html:215-245`). *Manca*: **niente in Flotta lo accende**. Le urgenze esistono e sono già ordinate — `prioritaOperative` (`flotta-data.js`) mette in fila scadenze, manutenzioni, ricambi sotto scorta e mezzi fermi con la loro gravità — ma restano dentro la pagina. Cercati `notific`, `push`, `promemoria` in `flotta-data.js`/`flotta/index.html`: solo `items.push(` di array. |
| Budget tracking vs actual | **CONFERMATO ASSENTE** | Cercati `budget`, `preventivo di spesa`, `stanziam`, `sforat` in `flotta-data.js` e `flotta/index.html`: **una sola occorrenza, in un commento** (`index.html:1591`, «il budget, che è la domanda da cui nasce la decisione…»). C'è lo **speso** — `ripartizioneCosti`, `costiPerMese`, `costoOfficinaPerMezzo`, `costoOrarioMezzo` — e non c'è nessun **dichiarato** con cui confrontarlo. |
| Gestione guasti rapidi (ticket guasto, urgenza) | **FALSO, C'È GIÀ** — è la falsa più grossa di questo documento | È un cantiere finito e numerato (**L8**): `GRAVITA_GUASTO` con tre gradini — «Non si può usare» / «Lavora, ma male» / «Piccola cosa» — e il flag `alta` che fa **proporre di mettere il mezzo in verifica** (`flotta-data.js:1228-1238`); `gravitaGuasto` che torna `null` invece del gradino più basso (1243); `validaGuasto` con messaggi scritti per chi è in piedi accanto alla macchina (1250); `manutenzioneDaGuasto` che genera la manutenzione con `origine: "guasto"`, entrando **da sola** nelle priorità del Quadro (1279). Nella pagina: bottone «Segnala un guasto» sulla scheda (`index.html:998`), icona d'avviso sulla riga del parco (1572), stile dedicato (287, 434), icona d'origine nelle liste (1133). |
| Analisi costo / disponibilità («qual è il mezzo più inefficiente?») | **C'È A METÀ** | *C'è*, per mezzo e su tutt'e due gli assi: il **costo** — `costoOrarioMezzo` (`flotta-data.js`) con `euroOra`, `euroOraOfficina`, `euroOraCarburante`, `parziale` e il caso «senza ore non si risponde 0 €/h» già gestito con `perche` — e la **disponibilità** — `affidabilitaFlotta.mezzi[].pct` (2002). E c'è il fascicolo che raccoglie i due su una macchina sola: `fascicoloMezzo` restituisce `speso` (officina + carburante) accanto a `fermo: {episodi, giorni, aperti}`. *Manca*: la **vista che li incrocia** — le classifiche disegnate sono separate (costo officina per mezzo a `index.html:1595-1615`, giorni di fermo per mezzo a 2254-2270) e nessuna mette €/h e disponibilità sullo stesso piano. |
| Link fatture a ordini di lavoro | **CONFERMATO ASSENTE** | Cercati `fattura`, `contabil`: `contabil` **zero**; `fattura` **due**, e tutt'e due sono prosa — un commento sul prezzo del gasolio e la nota di un rifornimento d'esempio (⏱️ *rimisurata il 09/08: erano zero, adesso sono due e non cambiano il verdetto*). Il costo dell'ordine si somma (`costoOrdine`, 1601) ma non ha un documento a cui agganciarsi. *Nota d'ecosistema*: il ponte fra le due app esiste, ma serve a **non contare due volte** — `VOCI_COSTO` con `daMezzo: true` in `shared/dw-ponti.js:651-657`, il badge «anche in Flotta» in Conti (`apps/conti/index.html:3069`) e l'avviso al momento di scegliere la voce (4048, 4540). |
| Benchmark interno flotta (questo mezzo vs media) | **C'È A METÀ** | *C'è*: le classifiche interne, tutte ordinate e con la nota che dice chi è in cima — giorni di fermo per mezzo con la disponibilità individuale accanto a quella del parco (`flotta/index.html:2254-2270`), costo d'officina per mezzo col «peggiore» e la sua % sul totale (1595-1615), consumo per mezzo ordinato per l/h (`consumoPerMezzo`, `flotta-data.js:1465`). E la regola giusta è già scritta: con un mezzo solo «non c'è una classifica da leggere» (`index.html:1611-1615`). *Manca*: lo **scostamento dichiarato** per ogni mezzo («E1 82%, media flotta 75%, +7») come colonna sistematica, non come frase sul primo della lista. |
| Calcolo previsione giorni a scadenza preventiva | **FALSO, C'È GIÀ** — e il documento **si contraddice da solo** | La riga «mancano ore X, ritmo Y h/gg → N giorni» è esattamente `previsioneGiorni(mancanoOre, oreGiorno)` (`flotta-data.js:696`), con la guardia contro il difetto opposto («quante ore mancano non si sa ≠ ne mancano zero», 690-695). Il ritmo si **misura**: `ritmoOreMezzi` e `ritmoDelMezzo` sui contatori che l'app ha già (rifornimenti L4 e giri macchina L2), con quattro regole dichiarate — almeno due letture, copertura di metà orizzonte, ore crescenti, ultima lettura non più vecchia dell'orizzonte. `tagliandiInScadenza` lo usa e tiene a parte i `daStimare` invece di tirare a indovinare. La sezione MONDO di **questo stesso documento** lo elenca fra le funzioni che Flotta ha: «Ritmo d'uso calcolato (ore/giorno o km/giorno) per stimare giorni a scadenza (**Flotta**, Caterpillar VisionLink, Volvo CareTrack) [verificato]». |
| Unità di misura flessibili selezionabili per mezzo | **CONFERMATO ASSENTE** | Conseguenza della riga sui km: l'unità non è un campo del mezzo. `TIPI_MEZZO` (`flotta-data.js`) e `tipoMezzoDi` scelgono la **checklist pre-uso**, non l'unità di conteggio; `oreContatore` legge sempre le ore. Cercati `unitaMisura`, `unita del mezzo`, `odometro`: zero. |

### Riepilogo numerico — Flotta

| | |
|---|---|
| Righe verificate | **16** |
| Confermate assenti | **5** |
| False (c'era già) | **3** |
| A metà | **8** |

**Le false:** *MTBF/MTTR* (calcolati e scritti in pagina), *gestione guasti
rapidi* (un cantiere finito, L8, con tre gravità e la generazione della
manutenzione) e *previsione dei giorni a scadenza* (che il documento stesso
elenca fra le cose che Flotta ha, dodici righe più su).

⚠️ **Otto righe su sedici sono «a metà», e in quattro casi la motivazione
scritta nel documento era sbagliata** (OEE «non un KPI per mezzo», noleggi
«solo voce di costo generica», mobile «solo l'app nativa», auto-ordini «due
click»). Un delta con la metà giusta e la ragione sbagliata manda a lavorare
sul pezzo sbagliato della stessa funzione: sull'OEE, per esempio, avrebbe fatto
costruire un numero per mezzo che esiste già, invece della prestazione e della
qualità, che sono la parte che manca davvero.

### La mancanza confermata più importante — Flotta

**La persistenza offline dei dati** (dentro la riga «mobile»). Non l'app nativa:
la **scrittura senza rete**. Il giro macchina di inizio turno e la segnalazione
di un guasto sono le due funzioni che Flotta ha costruito apposta per chi sta
davanti alla macchina, e sono esattamente le due che si fanno dove la rete non
c'è — al fronte, in officina, sotto il capannone.

Oggi l'SDK apre Firestore senza cache persistente mentre il core, che sta in
ufficio e la rete ce l'ha, la persistenza ce l'ha: è al contrario. E il costo di
lasciarla così non è un errore visibile — è il giro macchina che non si compila
e la macchina che parte senza.

---

### ⏱️ Riverifica del 06/08 — `f3432f4` → `8042b15`, dodici commit dopo

Le righe **CONFERMATE ASSENTI** sono state rimisurate contro il codice di oggi,
perché un «non c'è» invecchia. **Reggono tutte.** I dodici commit intercorsi
hanno toccato Flotta sul costo orario, sul badge del giro macchina che dipendeva
dall'ordine dell'elenco, sull'importo mozzato nel foglio che si consegna a chi
compra la macchina e sulla dichiarazione «dati di esempio» — niente che
assomigli a piani a chilometri, firma grafometrica, budget o fatture.

⚠️ **E stavolta il campione è stato guardato fin dal primo comando**, non dopo:
è la disciplina imparata poche ore prima su Terra, dove un conteggio non
esaminato stava per far scrivere il contrario del vero. Qui è servita subito:

```
$ for T in "km\b|chilometr|odometr" "firma digitale|grafometric" \
           "budget|stanziam|sforat" "fattur|contabil"; do
    grep -oiE "$T" apps/flotta/flotta-data.js apps/flotta/index.html | sort | uniq -c
  done
   (nessuna occorrenza)
   (nessuna occorrenza)
      1 budget          ← e va aperto, non contato
   (nessuna occorrenza)
```

L'unico `budget` sta **dentro un commento** (`index.html:1717`: «si vede subito
quale macchina sta mangiando il budget, che è la domanda da cui nasce la
decisione…»), cioè descrive **perché** l'elenco è ordinato dal mezzo più caro —
non è una funzione di budget. Contato e non aperto avrebbe fatto scrivere «la
riga è falsa, adesso c'è».

**Un conto senza il suo campione non è una misura**, ed è la seconda volta in
un pomeriggio che quella regola paga.
