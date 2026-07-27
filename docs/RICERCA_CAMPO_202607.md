# Ricerca su CAMPO — operativo di campo (luglio 2026)

Documento di sola ricerca: **nessuna modifica al codice**. Serve a decidere, con
calma, cosa aggiungere a Campo e in che ordine. Scritto in modo semplice: dove
compare una parola tecnica, viene spiegata subito.

Metodo: prima ho letto tutto il codice dell'app (`apps/campo/index.html` e
`apps/campo/campo-data.js`), poi ho fatto 12 ricerche sul web in italiano e in
inglese su come funzionano i software di gestione operativa per cave, miniere e
cantieri. Alla fine ho tenuto solo le idee che si possono davvero costruire con
quello che abbiamo: una pagina web statica, dati su Firestore tramite l'SDK
Deepwork ID, installabile come app sul telefono (PWA). Niente hardware, niente
abbonamenti, niente sensori.

---

## 1. Inventario onesto: cosa fa Campo OGGI

Tutto quello che segue l'ho verificato riga per riga nel codice, non è una
promessa di brochure.

### Attività della giornata
- Si crea un'attività con **titolo** e **dettaglio** (testo libero).
- Quattro stati che si cambiano toccando la riga, in ciclo:
  pianificata → in corso → conclusa → (di nuovo) pianificata; l'anomalia riporta
  a "in corso".
- Su un'attività in **anomalia** si possono indicare:
  - la **causale del fermo**, scelta da una lista fissa di 9 voci (guasto
    meccanico, mancanza materiale, attesa mezzo, intasamento impianto, meteo,
    manutenzione programmata, cambio turno, sicurezza, altro);
  - i **minuti di fermo**.
- Filtri (tutte / in corso / pianificate / anomalie), ricerca per testo,
  ordinamento (stato o titolo, memorizzato sul telefono), conteggio, modifica di
  titolo e dettaglio, esportazione in CSV.
- **Pareto dei fermi**: barre che mostrano dove si è perso più tempo oggi, con i
  minuti totali e la causale peggiore. ("Pareto" = classifica dal problema più
  grosso al più piccolo.)
- **Avanzamento della giornata**: quante attività sono concluse sul totale, in
  percentuale, con la ripartizione per stato.

### Squadre
- Elenco con **nome, numero di persone, area, stato** (operativa / ferma); si
  ferma o riattiva una squadra con un tocco (con conferma).
- **Import e export CSV** nello stesso formato (nome;persone;area;stato), quindi
  il file esportato si può ri-caricare: utile per l'avvio in una nuova cava.
- Controllo dei doppioni sul nome.

### Rapportini di turno
- Bozza con **titolo, squadra, turno (mattina/pomeriggio/notte), produzione
  (testo libero), consegne al turno successivo** (l'"handover", cioè quello che
  il turno che smonta lascia detto a quello che monta).
- Ciclo bozza → inviato (con ora automatica) → richiamabile in bozza; le bozze si
  possono cancellare.
- **Copertura**: dice quante squadre hanno consegnato il rapportino e nomina
  quelle che mancano. È esattamente la funzione che i software concorrenti
  vendono come "shift handover".

### Uscite / documenti
- **Consegna di turno** in file di testo (rapportini + anomalie aperte).
- **Rapporto di fine turno stampabile**: si apre una pagina già impaginata e
  pronta per la stampa o il PDF, con quadro dei numeri, tabella attività, fermi
  per causale, tabella rapportini e squadre che non hanno consegnato.
- **Export CSV** di attività e squadre.

### Ponte con Genesi (piano di carico)
- Si importa il CSV del piano di carico esportato da Genesi e, foro per foro, si
  registra la **carica reale**; l'app calcola lo **scostamento** dal progetto e
  lo colora (verde ≤10%, giallo ≤25%, rosso oltre), con riepilogo in cima ed
  export del consuntivo.

### Fondamenta tecniche
- Dati isolati per organizzazione tramite `orgCollection` dell'SDK Deepwork ID
  (nessun percorso Firestore scritto a mano): multi-tenant rispettato.
- Modalità demo/tour quando non si è collegati, con banner di avviso.
- Funzioni di calcolo pure e testabili (KPI, fermi, Pareto, copertura,
  avanzamento, scostamento carica).
- Manifest PWA incluso: l'app si installa sul telefono.

### Limiti reali che ho trovato leggendo il codice (da dire chiaramente)
1. **Non esiste la data.** Attività, squadre e rapportini non hanno un campo
   data né un campo turno salvato in modo strutturato. Conseguenza: "rapportini
   oggi" in realtà conta *tutti* i rapportini inviati, e non esiste nessuno
   storico: domani i dati di oggi sono ancora lì, mescolati.
2. **La produzione è testo libero** ("3 viaggi, 90 t"): bella da leggere, ma non
   sommabile. Non si può fare nessun totale né confronto con un obiettivo.
3. **Il piano di carico non viene salvato.** Le cariche reali che il fochino
   digita vivono solo nella memoria della pagina: basta ricaricare e si perdono.
   Su Firestore finisce solo una riga con data e numero fori.
4. **Nessun legame con le persone e i mezzi.** Le squadre hanno un *numero* di
   persone, non i nomi (che invece esistono già in Scudo), e nessuna attività è
   collegata a un mezzo (che esiste già in Flotta).
5. **Nessuna foto.** In cava la foto è il modo più veloce e più onesto di
   spiegare un problema.
6. **Offline non c'è davvero.** Il manifest rende l'app installabile, ma senza
   service worker (il pezzo di codice che tiene in cache l'app) se manca il
   segnale la pagina non si apre.
7. **Nessuna firma o validazione** del preposto sul rapporto di fine turno.

---

## 2. Cosa manca rispetto a chi fa questo mestiere da anni

Qui riassumo cosa ho trovato nei software del settore (GroundHog, Commit Works,
Micromine Pitram, Opsima, SafetyCulture, Clue, oltre ai gestionali italiani di
cantiere tipo TeamSystem, PlanRadar, InfoMinds) e nei modelli di rapporto di
turno realmente usati in cava e miniera.

### 2.1 Cosa contiene un rapporto di fine turno professionale
Dai modelli reali per supervisori di cava/miniera, le voci ricorrenti sono:

- data, turno, ora di inizio e fine, sito/area;
- **personale presente** (chi c'era, ruoli, ditte esterne, visitatori), assenze;
- **mezzi e impianti** assegnati e loro stato;
- **produzione** del turno (tonnellate, metri cubi, viaggi) confrontata con
  l'obiettivo;
- **fermi**, con causale *e durata*;
- **meteo e condizioni del sito** (pioggia, vento, nebbia, visibilità, stato
  delle piste);
- **eventi di sicurezza**: near-miss (quasi-incidenti), infortuni, briefing di
  inizio turno, permessi di lavoro, ispezioni fatte;
- **consumi**: carburante, esplosivo, materiali di consumo;
- **attività fatte / non fatte / in sospeso**;
- **consegne al turno successivo** e firma di chi consegna e di chi riceve.

Campo copre bene: attività, fermi con causale e durata, consegne, produzione (ma
solo come testo). Copre poco o niente: personale presente, mezzi, meteo, eventi
di sicurezza, consumi, obiettivo di produzione, firma.

### 2.2 Le idee forti dei concorrenti, tradotte alla nostra scala
- **Compliance to plan** ("rispetto del piano"): all'inizio del turno si dichiara
  cosa si vuole fare e quanto si vuole produrre; alla fine si misura quanto è
  stato rispettato. È il cuore commerciale dei prodotti di fascia alta. Da noi si
  può fare in forma semplice: un obiettivo per turno e uno scostamento nel
  rapporto. **Fattibile.**
- **Short Interval Control** vero (controllo ogni 2-4 ore con dati automatici dai
  mezzi): richiede telemetria, dispatch, GPS. **Non fattibile onestamente**, e va
  detto invece di fingerlo. Possiamo però offrire un "controllo a metà turno"
  fatto a mano, che è una versione ridotta ma vera.
- **Disponibilità e utilizzo dei mezzi / OEE**: la disponibilità si calcola come
  ore in cui la macchina poteva lavorare diviso ore pianificate. Con i minuti di
  fermo che già raccogliamo e una durata di turno dichiarata, **la disponibilità
  di turno è alla nostra portata**. L'OEE completo (che include ritmo e qualità
  del prodotto) richiede misure continue di portata e di qualità: **non è alla
  nostra portata** e non va promesso.
- **Codici di fermo standardizzati**: le fonti tecniche consigliano 5-6
  categorie principali e 15-25 sotto-voci. Noi abbiamo 9 voci piatte: si può
  fare un secondo livello (es. "Guasto meccanico → idraulica / motore /
  usura utensile") senza complicare l'uso.
- **Checklist di inizio turno** (pre-start) su mezzi e area: è la funzione più
  diffusa in assoluto nelle app da campo, ed è tutta compilazione manuale:
  **fattibile al 100%**.
- **Presenze e appello di emergenza**: sapere chi è in cava adesso, per il
  punto di raccolta in caso di emergenza. Con i nomi già presenti in Scudo si fa
  un "chi c'è oggi" a spunta. **Fattibile.**
- **App da campo: poche schermate, pochi tap, offline, foto.** Tutte le fonti
  sul lavoro in campo dicono la stessa cosa: se serve più di qualche tocco,
  l'operatore non la usa e torna al foglio di carta. Firestore ha già la cache
  offline con coda di scrittura, e un service worker completa il quadro:
  **fattibile e ad alto valore**.
- **Pesate, targhe, tonnellaggio automatico** (pesa a ponte, riconoscimento
  targa, sistemi di pesatura sulle pale): richiedono hardware e integrazioni.
  **Fuori portata**, si registra a mano.
- **Notifiche push a tutta la squadra**: tecnicamente possibile con la PWA, ma
  richiede il progetto Firebase attivo e configurazioni ulteriori. **Rimandata**
  alla fase go-live.

### 2.3 Un aggancio normativo utile (senza promettere adempimenti)
Il D.P.R. 128/1959 (polizia delle miniere e delle cave) prevede che i luoghi di
lavoro dove ci sono lavoratori siano **visitati almeno una volta per turno dal
sorvegliante**, e che i nominativi dei sorveglianti siano indicati **per ogni
turno**. È una traccia perfetta per una funzione semplice: un "giro del
sorvegliante" da spuntare con ora e note, e il nome del sorvegliante sul
rapporto di turno. Attenzione: possiamo offrire uno **strumento di registro
interno**, non dichiarare che sostituisce i registri obbligatori (il rapporto
stampabile lo dice già in fondo, ed è giusto tenerlo).

---

## 3. Tabella delle proposte

Difficoltà: **S** = poche ore, **M** = una o due unità di lavoro, **L** = più
unità. Priorità: **1** = prima di tutto, **2** = subito dopo, **3** = quando
c'è tempo.

| # | Nome | Cosa fa | Perché serve | Diff. | Pri. |
|---|------|---------|--------------|-------|------|
| 1 | **Data e turno su ogni registrazione** | Salva `data` (ISO) e `turno` su attività, rapportini e fermi; l'app mostra di default il giorno corrente | È la fondamenta di tutto: senza data non esistono storico, confronti, né KPI veri. Oggi "rapportini oggi" conta in realtà tutti | M | 1 |
| 2 | **Produzione in numeri** | Campo numerico + unità (t, m³, viaggi) accanto alla nota di testo; totale del turno calcolato | Rende la produzione sommabile e confrontabile: senza questo nessun obiettivo e nessun ponte verso Terra e Conti | S | 1 |
| 3 | **Salvataggio del piano di carico** | Le cariche reali per foro vanno su Firestore, non solo in memoria | Oggi basta ricaricare la pagina e il lavoro del fochino sparisce: è un difetto, non una funzione mancante | S | 1 |
| 4 | **Chi fa cosa** | Ogni attività può essere assegnata a una squadra (e, in un secondo momento, a un mezzo di Flotta) | Il capocantiere assegna il lavoro; oggi le attività sono anonime e non si capisce chi le sta facendo | S | 1 |
| 5 | **Obiettivo di turno e scostamento** | Si dichiara l'obiettivo del turno (es. 900 t); il rapporto mostra fatto/obiettivo e la differenza | È il "compliance to plan" dei concorrenti, alla nostra portata e senza dati automatici. È anche la cosa più vendibile | M | 1 |
| 6 | **Archivio dei giorni e storico settimana** | Selettore di data, elenco dei giorni passati, andamento della settimana (produzione, fermi, attività concluse) | Trasforma Campo da lavagna di oggi a registro dell'attività: è quello che il direttore di cava chiede | M | 2 |
| 7 | **Disponibilità di turno** | Ore di turno dichiarate meno minuti di fermo → percentuale di disponibilità, con la causale peggiore | Indicatore riconosciuto nel settore, che possiamo calcolare con dati che già raccogliamo. NON è l'OEE: va chiamato col suo nome | S | 2 |
| 8 | **Checklist di inizio turno** | Lista di controllo a spunta (mezzi, piste, segnaletica, DPI, briefing fatto) con esito e note | È la funzione più diffusa nelle app da campo, tutta manuale e quindi al 100% alla nostra portata | M | 2 |
| 9 | **Presenze del turno** | "Chi c'è oggi" a spunta, con i nomi presi da Scudo; conteggio presenti e assenti, elenco stampabile | Serve per l'appello in emergenza e per il rapporto; oggi le squadre hanno solo un numero di persone | M | 2 |
| 10 | **Foto sull'anomalia** | Una foto (scattata dal telefono, ridimensionata) allegata a un'anomalia o a un rapportino | In cava la foto spiega in due secondi ciò che il testo non spiega. Riusiamo il modello già usato in Scudo per gli allegati, con limite di dimensione | M | 2 |
| 11 | **Offline vero** | Service worker per la cache dell'app + persistenza offline di Firestore + indicatore "in attesa di rete" | In cava il segnale manca. Senza questo l'app installata non si apre e l'operatore torna alla carta | M | 2 |
| 12 | **Meteo e condizioni del sito** | Campo semplice a scelte rapide (sereno/pioggia/vento/nebbia) + note su piste e visibilità, nel rapporto | Voce presente in tutti i modelli professionali; spiega i fermi e mette al riparo in caso di contestazioni. A mano, senza servizi a pagamento | S | 2 |
| 13 | **Firma e chiusura del turno** | Nome di chi consegna e di chi riceve, ora di chiusura, blocco delle modifiche dopo la chiusura | Dà valore di documento al rapporto e chiude formalmente la consegna: è la richiesta ricorrente dei supervisori | S | 2 |
| 14 | **Evento di sicurezza dal campo** | Segnalazione rapida di near-miss/infortunio dal turno, che compare in Scudo | Chi vede il problema è in cava, non in ufficio: chiude il cerchio con l'app HSE già esistente | M | 2 |
| 15 | **Anomalia mezzo → Flotta** | Da un'anomalia con causale "guasto meccanico" si apre un ordine di lavoro in Flotta | Evita la doppia digitazione e mostra il valore dell'ecosistema (già previsto come ponte in roadmap) | M | 2 |
| 16 | **Giro del sorvegliante** | Registrazione del sopralluogo per turno (ora, area, esito, note) con il nome del sorvegliante | Aggancio concreto alla prassi del settore estrattivo italiano; strumento di registro interno, non sostituto dei registri obbligatori | S | 3 |
| 17 | **Causali di fermo a due livelli** | Le 9 causali attuali diventano categorie, con sotto-voci facoltative | Le fonti tecniche indicano 5-6 categorie e 15-25 sotto-voci come misura giusta: analisi più utile senza rallentare chi inserisce | S | 3 |
| 18 | **Piano squadre settimanale** | Griglia settimana × squadre con turno assegnato, assenze e copia della settimana precedente | Già in roadmap (C5); è il passo da "oggi" a "settimana prossima". Grosso, va fatto dopo le fondamenta (1 e 6) | L | 3 |
| 19 | **Controllo di metà turno** | Un promemoria a metà turno per registrare l'avanzamento rispetto all'obiettivo | È la versione onesta e manuale dello Short Interval Control: utile, senza fingere di avere dati in tempo reale | S | 3 |
| 20 | **Rapporto di turno più ricco** | Il rapporto stampabile assorbe le nuove voci: presenze, meteo, obiettivo/fatto, disponibilità, foto, firme | Il documento è il prodotto finito che il cliente tocca con mano; ogni funzione nuova deve arrivarci dentro | S | 3 |

### Ordine consigliato
Prima le **fondamenta** (1, 2, 3, 4): sono piccole ma sbloccano tutto il resto.
Poi il **valore visibile** (5, 6, 7) e infine il **lavoro sul campo** (8-13).
I ponti tra app (14, 15) e il piano settimanale (18) vengono dopo.

### Cosa NON proporre (per onestà)
- Produzione automatica da pesa a ponte, sistemi di pesatura sulle pale, lettura
  targhe: serve hardware.
- Posizione dei mezzi in tempo reale, telemetria, dispatch: serve hardware e
  abbonamenti.
- Short Interval Control automatico e OEE completo: mancano i dati continui.
- Notifiche push: possibili in futuro, ma dipendono dal progetto Firebase attivo.
- Timbratura con badge/NFC per le presenze: serve hardware; la spunta manuale sì.

---

## 4. Fonti

Rapporto di fine turno e consegna (handover)
- [Shiftbase — End of Shift Report: what to include for a smooth handover](https://www.shiftbase.com/blog/end-of-shift-report)
- [SafetyCulture — Supervisor Shift Report (mining)](https://safetyculture.com/library/mining/supervisor-shift-report-oliqN)
- [SafetyCulture — SWC HSE Shift Report, compliance to plan (mining)](https://safetyculture.com/library/mining/swc-hse-shift-report-compliance-to-plan-golding-swc-pe4ffg1vvnfxtizg)
- [SafetyCulture — Load and Haul Supervisor Shift Log](https://safetyculture.com/library/mining/draft-srm-chl-load-and-haul-supervisor-shift-log-bczjr3si9amceceb)
- [Oxmaint — Shift logbook software: digital handover for 24/7 operations](https://oxmaint.com/blog/post/shift-logbook-software-digital-handover-operations)
- [Fabrico — Best digital shift handover software (2026)](https://www.fabrico.io/blog/best-shift-handover-software/)
- [Innovapptive — Shift handover / electronic logbook](https://www.innovapptive.com/product/operations-suite/shift-handover)

Controllo del piano, SIC e indicatori
- [Commit Works — Compliance to Plan](https://www.commit.works/compliance-to-plan/)
- [Commit Works — Short Interval Control for mining](https://commit.works/short-interval-control/)
- [Micromine Pitram — Short Interval Control](https://www.micromine.com/pitram-short-interval-control/)
- [GroundHog — Short Interval Control](https://groundhogapps.com/groundhog-short-interval-control/)
- [Opsima — Mining industry KPIs: 30 metrics + formulas](https://opsima.com/blog/kpis/mining-industry-kpis/)
- [Oxmaint — Downtime reason code mapping for OEE](https://oxmaint.com/industries/steel-plant/downtime-reason-code-mapping-for-oee)
- [Oxmaint — Availability KPI explained for OEE](https://oxmaint.com/industries/steel-plant/availability-kpi-explained-for-oee)
- [OEE.com — OEE factors: availability, performance, quality](https://www.oee.com/oee-factors/)
- [Fabrico — Best OEE software for mining & aggregates (2026)](https://www.fabrico.io/blog/best-oee-software-mining-aggregates/)

Produzione e operatività in cava
- [Clue — Equipment management software for quarry & aggregates](https://www.getclue.com/industries/aggregate-and-quarry)
- [Quarry Tracking — material tracking](https://quarrytracking.com/)
- [Opsima — Mining & quarry operations software](https://opsima.com/industries/mining-quarry)

Checklist, sicurezza e presenze
- [SafetyIQ — Machinery pre-start checklist](https://www.safetyiq.com/resources/machinery-pre-start-checklist)
- [PopProbe — Quarry mobile equipment pre-operational inspection checklist](https://www.popprobe.com/checklist-library/mining-quarrying/equipment-safety/quarry-mobile-equipment-pre-operational-inspection-checklist)
- [Attendit — Emergency roll call & mustering](https://attenditai.com/blog/emergency-roll-call-accurate-headcount-in-under-a-minute)
- [Litum — What is emergency mustering](https://litum.com/what-is-emergency-mustering/)

Turni e squadre
- [Parim — 3 shift pattern explained](https://www.parim.co/blog/3-shift-pattern)
- [Totalmobile — Examples of shift patterns](https://www.totalmobile.com/blog/capabilities/rostering/examples-of-shift-patterns-and-traditional-approaches-to-shift-working/)
- [TurniX — software gestione turni (Italia)](https://sviluppoturni.it/)

App da campo e offline
- [SafetyCulture — Best field data collection apps 2026](https://safetyculture.com/apps/field-data-collection-app)
- [Firebase — Access data offline (Firestore)](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Guida PWA + Firebase offline mode](https://chibicart.com/blog/pwa-firebase-offline-mode-guide)

Prassi italiana (rapportini, giornale dei lavori, normativa estrattiva)
- [PlanRadar — Rapportino giornaliero di cantiere](https://www.planradar.com/it/rapportino-giornaliero-cantiere-modello/)
- [InfoMinds — Rapportino di cantiere](https://infominds.eu/rapportino-di-cantiere/)
- [Quarry & Construction — Sorvegliante e preposto nel settore estrattivo](https://quarryandconstructionweb.it/rubriche/collaborazioni/le-figure-del-sorvegliante-e-del-preposto-per-il-settore-estrattivo-analogie-e-differenze/)
- [D.P.R. 9 aprile 1959 n. 128 — Norme di polizia delle miniere e delle cave (testo)](https://pugliacon.regione.puglia.it/documents/72607/118877/AE_LEX_IT_04_DPR128_59.pdf/9c8638e0-d0d8-2916-9ec4-1d88d806bc0d)

---

*Documento di ricerca — nessuna modifica al codice. Le proposte vanno scelte dal
fondatore prima di diventare unità di lavoro.*
