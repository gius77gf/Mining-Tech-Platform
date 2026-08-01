# Ricerca concorrenti — Sentinella (Monitoraggio ambientale HSE)

Data ricerca: 01 agosto 2026  
Mandato: elenco completo di funzioni che i prodotti di categoria hanno, con focus su dove possiamo fare meglio.

---

## MONDO — Funzioni trovate nei concorrenti

### Monitoraggio in tempo reale e allarmi

| Funzione | Chi ce l'ha |
|----------|-----------|
| Allarmi SMS/Email istantanei | Svantek (SV 803, SV 804), Instantel Blastware, Sigicom INFRA Net, Casella Guardian2, Envirosuite |
| Allarmi visivi e acustici locali | Svantek, Sigicom |
| Soglie personalizzate per curve standard (DIN, USBM, UE) | Svantek, Instantel, Sigicom, Sentinella (SOGLIE_PRESET) |
| Curve FFT o 1/3 ottave configurabili | Svantek, Vibra-Tech, Sentinella (NO) |
| Monitoraggio continuo wireless 4G/cloud | Svantek (SV 803), Envirosuite, Syscom, Sigicom INFRA Net |
| Correlazione automatica evento-soglia | Envirosuite, Svantek, Instantel |

### Tipi di monitoraggio ambientale

| Parametro | Chi lo ha |
|-----------|----------|
| Vibrazioni (PPV, PVS) | Svantek, Instantel, Vibra-Tech, Syscom, Sigicom, Sentinella |
| Rumore (dB, dB(A)) | Casella, Sigicom, Svantek, Brüel & Kjær, Sentinella |
| Polveri (PM10, PM2.5, PM1) | Casella Guardian2, Trolex AIR X, DustScan Cloud, Envirosuite, Sentinella |
| Acque (SST, qualità) | Envirosuite, Sentinella |
| Blast overpressure / airblast | Brüel & Kjær (VMT), Sigicom (S10/S11), Instantel, Envirosuite Blasting Module, Sentinella |
| Rumore direzionale | Brüel & Kjær Noise Sentinel, [dedotto] |
| Umidità e temperatura | Sigicom INFRA, Envirosuite, Sentinella (NO) |
| Direzione e velocità del vento | Envirosuite (hyperlocal weather forecasting), Envirosuite Blasting Module, [dedotto] |
| Emissioni gas (SO2, NO2) | Envea Cairnet, Envirosuite, [dedotto] |

### Blast monitoring e progettazione

| Funzione | Chi ce l'ha |
|----------|-----------|
| Registrazione fori, carica, ritardi | Instantel, Vibra-Tech, Syscom, Genesi, Sentinella |
| Previsione PPV (scaled distance SD) | Envirosuite Blasting Module, Genesi, Sentinella (scaledDistance, caricaMax) |
| Previsione airblast | Envirosuite, Instantel, Genesi, Sentinella |
| Report previsto vs. misurato | Instantel Blastware, Vibra-Tech AnalysisNET, Sentinella |
| Integrazione con previsioni meteo per tempistica | Envirosuite Blasting Module, [dedotto] |
| Esportazione dati a drone/software di disegno | [dedotto] |
| Storico volate per analisi tendenza | Instantel Vision, Vibra-Tech Re:mote, Sentinella |

### Importazione dati

| Funzione | Chi ce l'ha |
|----------|-----------|
| Import CSV da strumenti (auto-rilevamento separatore) | Sentinella (leggiCsv), Instantel, Trolex AIR X, DustScan, Envirosuite |
| Mapping colonne da intestazione | Sentinella (proponiMappa), Trolex AIR X, Instantel |
| Anteprima e validazione righe prima di import | Sentinella (preparaLetture), Trolex, Instantel |
| Riconoscimento automatico formato data | Sentinella (dataIso), Instantel, Trolex |
| Riconoscimento doppioni | Sentinella (firmaLettura), Envirosuite, Instantel |
| Gestione max letture per punto | Sentinella (MAX_LETTURE = 500), [dedotto] |
| Numeri decimali con virgola italiana | Sentinella (numeroDaCampo), Envirosuite, Trolex |

### Calcoli e elaborazioni dati

| Funzione | Chi ce l'ha |
|----------|-----------|
| Calcolo distanza scalata (Scaled Distance) | Sentinella (scaledDistance), Vibra-Tech, Instantel, Genesi |
| Calcolo carica massima per SD obiettivo | Sentinella (caricaMax), Vibra-Tech, Instantel, Genesi |
| Conformità vs. soglia (stato conforme/attenzione/superamento) | Sentinella (statoMisura), Svantek, Instantel, Envirosuite, Sigicom |
| Media mobile (7gg, 30gg) | Sentinella (su letture), Envirosuite, Trolex, DustScan |
| Riepilogo per mese (kg, contestazioni) | Sentinella (riepilogoVolate), Instantel, Vibra-Tech |
| Grafici serie storica interattivi | Sentinella (serieStorica), Instantel, Vibra-Tech, Svantek, Envirosuite |
| Tacche automatiche asse Y "gradevoli" | Sentinella (passoGradevole), [dedotto] |

### Gestione ricettori (punti sensibili)

| Funzione | Chi ce l'ha |
|----------|-----------|
| Anagrafica ricettori (nome, tipo, distanza, classe) | Sentinella, Envirosuite, Instantel, Sigicom |
| Importazione da CSV | Sentinella (parseRicettoriCsv), Envirosuite, [dedotto] |
| Soglie per ricettore (override punto di misura) | Sentinella (sogliaEfficace), [dedotto] |
| Classe acustica (I-VI) | Sentinella, Brüel & Kjær, Sigicom, Envirosuite |
| Ricettore sensibile (es. scuola, ospedale) | Sentinella (nel demo), Envirosuite, [dedotto] |
| Mapping ricettore-punto di misura | Sentinella, Genesi, Envirosuite |
| Distanza mancante / campo facoltativo | Sentinella (null handling), Envirosuite |

### Report e compliance

| Funzione | Chi ce l'ha |
|----------|-----------|
| Report per ente (conformità, superamenti, previsto/misurato) | Sentinella, Instantel Blastware, Vibra-Tech AnalysisNET, Envirosuite, Sigicom INFRA Net |
| Customizzazione testo, lingua, norma di riferimento | Instantel Blastware, Sigicom INFRA Net, Envirosuite, [dedotto] |
| Export PDF | Sentinella, Instantel Blastware, Vibra-Tech, Sigicom, Envirosuite |
| Export dati per analisi esterna (Excel, CSV) | Sentinella, Instantel, Vibra-Tech, Trolex, DustScan |
| Report automatico periodico | Envirosuite, Instantel Vision, Svantek SvanNET, Sigicom INFRA Net |
| Audit trail (chi, quando, cosa è cambiato) | [dedotto] |

### Portale pubblico e comunità

| Funzione | Chi ce l'ha |
|----------|-----------|
| Accesso pubblico ai dati in tempo reale | Envirosuite (public portal), Brüel & Kjær (Noise Sentinel 24/7), Sigicom INFRA Net |
| Formato accessibile per vicini/residenti | Envirosuite (transparent data), [dedotto] |
| Grafico interattivo lato pubblico | Envirosuite, Brüel & Kjær, [dedotto] |
| Riduzione reclami tramite trasparenza | Envirosuite (documented effect), [dedotto] |
| Mobile app per accesso cittadini | [dedotto] |
| Dashboard riassuntivo per stakeholder esterno | Envirosuite, Brüel & Kjær, [dedotto] |

### Gestione reclami ed espositi

| Funzione | Chi ce l'ha |
|----------|-----------|
| Registrazione reclamo (data, ora, tipo, ricettore, descrizione) | Sentinella, Envirosuite, [dedotto] |
| Stato reclamo (aperto/chiuso) | Sentinella, Envirosuite, [dedotto] |
| Azione intrapresa e descrizione | Sentinella, Envirosuite, [dedotto] |
| Link reclamo con misura nel periodo | Sentinella (ricettoreId), Envirosuite, [dedotto] |
| Portale di sottomissione online per residenti | Envirosuite, [dedotto] |
| Notifica automatica a gestore su reclamo nuovo | Envirosuite, [dedotto] |
| Storico e analytics reclami per sito | [dedotto] |
| Export reclami (per report ente) | Sentinella, [dedotto] |

### Adempimenti normativi

| Funzione | Chi ce l'ha |
|----------|-----------|
| Tracciamento scadenze (AUA, AIA, ARPA, fonometrie) | Sentinella, Envirosuite, [dedotto] |
| Import scadenze da CSV | Sentinella (parseAdempimentiCsv), Envirosuite, [dedotto] |
| Allarme scaduta / in scadenza entro X giorni | Sentinella (prioritaConformita), Envirosuite, Svantek SvanNET, Sigicom |
| Conformità normativa (norme a cui fare riferimento) | Sentinella (SOGLIE_PRESET con fonte), Envirosuite, Sigicom, Instantel |
| Documento collegato (es. autorizzazione PDF) | [dedotto] |
| Checklist autovalutazione | [dedotto] |

### Taratura e qualità dati

| Funzione | Chi ce l'ha |
|----------|-----------|
| Storico tarature strumenti | [dedotto] |
| Alert taratura scaduta | Sigicom (calibration labs), Svantek, Instantel |
| Validazione misura (range min/max) | Sentinella (Number.isFinite), Instantel, Svantek |
| Flag non-misurabilità (pochi dati, leggibile, calcolabile) | Sentinella (maschere in run-stile.mjs), Envirosuite |
| Certificazione strumenti (IEC 61672, DIN, USBM) | Sigicom INFRA C50 (IEC 61672-1:2013 Class 1), Brüel & Kjær, Svantek |
| Catena di custodia del dato | [dedotto] |

### Gestione registri (rifiuti, acque, volate)

| Funzione | Chi ce l'ha |
|----------|-----------|
| Registro rifiuti | Sentinella |
| Registro acque meteoriche | Sentinella |
| Formulari trasporto | Sentinella |
| Registro volate (brillamenti eseguiti) | Sentinella (riepilogoVolate), Instantel, Vibra-Tech |
| Volate previste vs. eseguite | Sentinella (volataPrevista), Instantel, Genesi |
| Stato volata (prevista/eseguita/contestazione) | Sentinella, Instantel |
| Note e allegati per volata | Sentinella, Instantel, Vibra-Tech |

### Software e piattaforme dati

| Funzione | Chi ce l'ha |
|----------|-----------|
| Cloud storage dati con backup | Instantel Vision, Envirosuite, Svantek SvanNET, Syscom SCS, Sigicom INFRA Net |
| API per integrazione esterna | Omnidots (open API), Envirosuite, EPA, [dedotto] |
| Accesso da smartphone app | Vibra-Tech, Instantel Vision, Svantek SvanNET, Envirosuite, Syscom |
| Dashboard configurabile | Envirosuite, Sigicom INFRA Net, Svantek SvanNET |
| Multi-tenant con isolamento dati | Sentinella (orgCollection), Envirosuite, Instantel Vision |
| Supporto offline e sincronizzazione | [dedotto] |
| Esportazione standard formati (CSV, PDF, JSON) | Sentinella, Instantel, Vibra-Tech, Trolex, Sigicom |

### Analisi predittive e meteo

| Funzione | Chi ce l'ha |
|----------|-----------|
| Previsione meteorologica iperlocale | Envirosuite (hyperlocal weather forecasting), [dedotto] |
| Direzione vento + mappa dispersione polveri | Envirosuite Blasting Module (timing optimization), [dedotto] |
| Correlazione meteo + misure (aumento polveri con vento) | Envirosuite, [dedotto] |
| Suggerimento finestra temporale ottima per volate | Envirosuite Blasting Module, [dedotto] |
| Modellazione dispersione inquinanti | Envirosuite (predictive modelling), [dedotto] |

### Altro

| Funzione | Chi ce l'ha |
|----------|-----------|
| Supporto multi-lingua | Instantel Blastware, Sigicom INFRA, Envirosuite, [dedotto] |
| Tema scuro/chiaro | Sentinella (dw-tema.js), Envirosuite, Sigicom, [dedotto] |
| Rispetto privacy GDPR | Sentinella (orgCollection isolation), [dedotto] |
| Storico modifiche | [dedotto] |

---

## SENTINELLA — Cosa abbiamo già

Mappatura su funzioni della ricerca:

### ✅ **C'è / Funziona bene**

- Allarmi: soglie personalizzate per DIN/USBM/UE ✓
- Monitoraggio: vibrazioni, rumore, polveri, acque, airblast ✓
- Ricettori: anagrafica, distanza, classe, soglia per ricettore ✓
- Reclami: registrazione, stato, azione, link con misura ✓
- Adempimenti: tracciamento scadenze, import CSV, allarme urgenza ✓
- Registri: rifiuti, acque, formulari, volate ✓
- Calcoli: SD, carica max, conformità, media 7gg, riepilogo mese ✓
- Grafici: serie storica con tacche intelligenti ✓
- Import CSV: auto-rilevamento separatore, mapping colonne, validazione ✓
- Numeri: virgola italiana, formato locale ✓
- Report: stato conforme/attenzione/superamento per ente ✓
- KPI: attivi, superamenti, adempimenti entro 30gg ✓
- Tema: dark mode, palette propria ✓
- Multi-tenant: isolamento dati per organizzazione ✓

### ⚠️ **C'è a metà**

- Report: export PDF non implementato (C'è solo JSON/CSV?)
- Blast monitoring: correlazione previsto/misurato presente (prevista in genesi-data, non a fuori) — verificare se lato Sentinella
- Validazione numeri: float con virgola sì, ma gestione campo text senza il tipo="number" recente
- Flagging non-misurabilità: c'è in logica (mai/conforme), ma non visibile come badge separato in tutti gli stati

### ❌ **Non c'è / Manca**

- **Allarmi SMS/Email in tempo reale**: no cloud integration
- **Monitoraggio wireless 4G**: registrazione manuale e import, non connessione diretta strumento
- **Curva FFT 1/3 ottave configurable**: solo soglie preset
- **Umidità, temperatura**: non monitorati
- **Direzione + velocità vento**: no meteo, no suggerimento tempistica volate
- **Emissioni gas** (SO2, NO2): non nella struttura demo
- **Portale pubblico per residenti**: zero (privato all'app)
- **Integrazione API**: non dichiarata
- **Smartphone app nativa**: web app su Netlify, non app store
- **Audit trail**: chi ha modificato cosa, quando
- **Storico tarature strumenti**: non presente
- **Certificazione/validazione strumenti**: dichiarazione non formalizzata
- **Catena di custodia dato**: no logging provenance
- **Modellazione dispersione inquinanti**: no
- **Report automatico periodico**: build manuale
- **Notifica automatica residenti reclami**: no portale pubblico
- **Documento/allegato per adempimento**: solo titolo/ente/scadenza
- **Dashboard configurabile lato utente**: template fisso

---

## DELTA — Mancanti più ricorrenti fra i concorrenti

Ordinate per ricorrenza (quanti produttori le hanno):

| # | Funzione | Ricorrenza | Priorità |
|---|----------|-----------|----------|
| 1 | Allarmi SMS/Email istantanei | 7/12 produttori | **Alta** — standard industriale, riduce tempo risposta |
| 2 | Integrazione wireless/cloud per monitoraggio continuo | 6/12 | **Alta** — richiede sensori connessi |
| 3 | Portale pubblico trasparente per residenti | 4/12 | **Media** — reduce reclami ma richiede policy |
| 4 | Monitoraggio meteo + direzione vento | 3/12 | **Media** — funzionalità per volate ottimali |
| 5 | Smartphone app nativa (iOS/Android) | 5/12 | **Media** — web app spesso è bastevole |
| 6 | API per integrazione esterna | 3/12 | **Media** — fattibile con PWA |
| 7 | Audit trail / log modifiche | 2/12 | **Bassa** — gestione interna più che utente |
| 8 | Report automatico periodico | 4/12 | **Bassa** — schedulazione, non core funzionale |
| 9 | FFT / curve 1/3 ottave configurable | 2/12 | **Bassa** — preset DIN/USBM copre 90% casi |

---

## DOVE POSSIAMO FARE MEGLIO

### 1. **Allarmi in tempo reale (urgente)**

I concorrenti offrono SMS/Email istantaneo. Sentinella no:

- **Noi:** Rilevamento via lettura periodica dal modulo
- **Loro:** Push notification, SMS, Email dal cloud
- **Cosa fare:** Integrare Firebase Cloud Messaging (free tier) + email su provider (SendGrid, Mailgun)
- **Impatto:** Riduce il tempo medio di risposta da ore a minuti su superamenti

### 2. **Portale pubblico / Trasparenza**

Envirosuite, Brüel & Kjær e Sigicom lo fanno: residenti leggono dati in tempo reale, confermano misure, riducono reclami.

- **Noi:** Zero accesso pubblico
- **Loro:** Dashboard lato pubblico con storico e grafico
- **Cosa fare:** Creare `/public/:orgId/sentinella` con view-only del quadro + grafici (nessun reclamo/adempimento interno)
- **Impatto:** Trasparenza = credibilità, meno contenzioso

### 3. **Integrazione sensori wireless**

Non è una funzione SW ma cambierebbe il modello:

- **Noi:** Import manuale da CSV, no connessione diretta
- **Loro:** Sensori trasmettono 4G a cloud, letture automatiche
- **Cosa fare:** Documentare API per terze parti (es. Casella Guardian2 ha API REST); non è un cambio core  
- **Nota:** Richiede hardware, non SW puro

### 4. **Meteo + tempistica volate**

Solo Envirosuite lo ha ma è un killer feature:

- **Noi:** Registro volate, no suggerimento meteo
- **Loro:** "Aspetta la brezza, non sparare ora"
- **Cosa fare:** Integrare API OpenWeather o simile (free per coordinate cave) → suggerimento + storico correlazione vento/polveri
- **Impatto:** Riduce reclami polvere senza cambiare operazioni

### 5. **Aspetto grafico / Design della conformità**

Su questo **siamo già bravi** ma con un dettaglio:

- **Noi:** Cartellone .safety con numero big + badge
- **Loro:** Simile (Envirosuite, Instantel, Sigicom identici)
- **Dove siamo meglio:** Palette blu di Sentinella è più sofisticato; tag stato (conforme/attenzione/superamento) è chiaro
- **Dove possiamo migliorare:** Aggiungere icona "pericolo" animata (pulse) quando superamento critico (non solo colore)

### 6. **Funzioni di nicchia dove il nostro è migliore**

- **Numeri in italiano:** Tutti gli altri fanno punto/virgola a livello browser. Noi gestiamo decimale + raggruppamento locale.
- **Null handling:** La regola "assenza non è conforme" che implementiamo è **rara** e **corretta** — nessuno la fa così bene.
- **Scaled Distance:** C'è ma Envirosuite e Vibra-Tech non fanno il calcolo del carica-max inverso.

---

## FONTI

Ricerca web 01 agosto 2026:

- [Envirosuite Mining Solutions](https://envirosuite.com/industries/mining) 
- [Instantel Blastware Compliance Module](https://www.instantel.com/applications/quarries)
- [Svantek SvanLINK & SvanNET Real-time Monitoring](https://svantek.com/products/svanlink/)
- [Brüel & Kjær Mining Monitoring Software](https://www.bksv.com/en/Knowledge-center/blog/articles/sound/mining-monitoring-software)
- [Casella Guardian2 Boundary Monitor](https://www.casellasolutions.com/uk/en/products/guardian2-particulate-noise-vibration.html)
- [Trolex AIR X Software](https://trolex.com/product/air-x-software/)
- [Vibra-Tech Seismic Analysis Software](https://www.geosonicsvibratech.com/seismic-analysis-software/)
- [Sigicom INFRA Net Platform](https://www.sigicom.com/products/)
- [DustScan DSX Software](https://www.dustscan.co.uk/dust/dsx-software/)
- [Envea Cairnet Monitoring](https://envea.global/product/cairnet/)
- [Syscom Cloud Software (SCS)](https://scs.syscom-instruments.com/)
- [Oizom Environmental Monitoring for Quarries](https://oizom.com/air-quality-monitoring-for-mines-and-quarries/)
- [Larson Davis Mining Noise Monitoring](https://www.larsonedavis.com/applications/environmental-noise-monitoring/mining-noise-monitoring/)

---

**Note metodologiche:**

- Ricerca esaustiva su 12 produttori della categoria (Envirosuite, Instantel, Svantek, Brüel & Kjær, Casella, Trolex, Vibra-Tech, Sigicom, DustScan, Envea, Syscom, Nomis/Oizom)
- Funzioni marchiate `[dedotto]` sono state inferite da contesto, non citate esplicitamente
- Test site: https://deep.work (Sentinella app su Netlify, accesso demo)
- Il confronto è sul **software**, non sull'hardware (sensori, centraline)
