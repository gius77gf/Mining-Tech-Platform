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
> ✅ **E l'08/08 Sentinella è il primo documento ad arrivare a ZERO di
> arretrato** (`documenti-invecchiati.mjs`: *0 commit dopo, di cui 0 che
> mordono*), portando il totale delle sei app da **71 a 59** commit e i
> «mordono» da 16 a 15. Le tredici righe confermate assenti sono state
> **ricercate di nuovo**, non ridatate: la prova sta in fondo, in «Verifica del
> delta», con i termini e i conti.
>
> ⏱️ **La riga «Sentinella» è del 02/08, le altre cinque sono del 01/08.** Questo
> documento è stato **riverificato riga per riga** contro il codice di oggi: due
> righe sono ⏱️ **scadute** (l'allegato dell'adempimento e — a metà — la
> certificazione degli strumenti), e il conto delle confermate scende da 15 a
> **13**. Le prove stanno in fondo, in «Verifica del delta». Le altre cinque
> copie di questa tabella portano ancora i numeri del 01/08: si allineano quando
> qualcuno riverifica il loro documento.
> ⚠️ E due colonne del **totale** non tornano con la somma delle righe (103 su
> 105): la riga **Conti** perde due righe, tolte dalle confermate il 01/08 senza
> essere aggiunte alle scadute. Misurato e dichiarato qui, non corretto: questo
> cantiere può toccare solo il documento di Sentinella.
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

---

## Verifica del delta (01/08 · riverificata riga per riga il 02/08 · **arretrato richiuso il 06/08**)

> **Verificato contro il codice al commit `7a03bc4`** *(14/08 · **22 righe di
> verdetto su 22 riguardate**, dopo i tre commit che MORDONO segnalati
> dall'arretrato — `ff1d013`, `e008d8a`, `7a03bc4`. Esito: **verdetti cambiati
> zero**; **zero ricerche cadute** (le undici «CONFERMATA ASSENTE» rilanciate
> una per una tornano tutte a `0 e 0`: SMS/notifiche, wireless/4G, temperatura,
> vento, SO2/NO2, portale pubblico, webhook/endpoint/OAuth, Android, modelli di
> dispersione, cron/scheduler, widget); ma **diciotto citazioni `file:riga`
> scadute su diciotto**, tolte e sostituite col comando che ritrova il nome, e
> **due prove riscritte perché il loro NUMERO era già scaduto** — il `m/s` che
> diceva «47, tutte e quarantasette `mm/s`» ed erano **48** (adesso la prova è
> l'**uguaglianza fra i due conti**, che non scade), e il `grep -c
> 'data-ade-rep|rep-origine'` **senza `-E`**, che cerca la stringa letterale e
> risponde **0**: un «non c'è» prodotto dal righello, sulla riga che serviva a
> dimostrare che una cosa c'è.
> ✅ E una riga si è **allungata** senza cambiare verdetto: la **catena di
> custodia del dato** ha adesso anche l'ingresso — `7a03bc4` ha portato
> `scartiRicettoriCsv`, `scartiAdempimentiCsv` e `scartiVolateCsv`, cioè le
> righe che l'import non fa entrare smettono di sparire in silenzio.
> Prima era `6645782`.)*
>
> **Verificato in precedenza al commit `6645782`** *(09/08 pomeriggio · le TREDICI rilanciate **di nuovo** dopo il lavoro sulle tendine e sulla miniatura: **tredici verdetti su tredici reggono**, e **tre prove su tredici non si riproducevano più** — `COV` pescava «viewport-fit=**cov**er», `API` pescava «capire/capita/capisce», `ios` pescava «silenziosa/inchiostro». Tutt'e tre riscritte col comando e coi termini lunghi, che è la forma misurata come l'unica che sopravvive. Prima era `2c22fee`, e prima ancora `079ebe3`)* — l'ultimo che ha toccato
> `apps/sentinella/` al momento della verifica, cioè **il codice che è stato
> davvero letto**. *(La precedente era a `db04ac5`, lo stesso 08/08.)*
>
> ### 08/08, sera — nove commit, uno che morde, e tredici righe che non si muovono
>
> Fra `db04ac5` e `079ebe3` Sentinella è andata avanti di **nove commit**. Uno
> solo **morde** secondo `documenti-invecchiati.mjs`, e la funzione che ha
> aggiunto è **una**: `descriviResponsabile`, che sceglie come dire *chi* deve
> fare un'azione correttiva quando l'elenco dei lavoratori arriva da Scudo e la
> lettura può fallire. Il nono commit non aggiunge niente qui: sposta la
> **decisione** di quella funzione in `shared/dw-ponti.js`, perché la stessa
> domanda serviva anche a Scudo, e lascia in Sentinella solo la **frase**.
>
> **Nessuna delle tredici confermate assenti la riguarda**, e non è un giudizio
> a occhio: quelle tredici parlano di **condizioni della misura** (umidità,
> temperatura, vento), di **come il documento esce** (report periodico
> automatico, FFT e terzi d'ottava, PDF/Excel) e di **quanto ci si mette ad
> accorgersene** (allarmi SMS/email). Le ricerche sui due file di oggi danno
> **zero** su `xlsx`, `excel`, `jspdf`, `notific` e `offline` — le stesse di
> ogni ripasso. Una funzione che sceglie una **frase** non costruisce nessuna
> di quelle cose.
>
> ⚠️ **E questo blocco esiste perché il numero scendesse, non perché la data
> fosse vecchia.** L'arretrato era diventato ⛔ per una modifica **mia**, fatta
> il giorno stesso: chi chiude un'unità aggiorna il documento che quell'unità
> tocca, se no il conto sale da solo e chi lo legge non sa più se stia guardando
> un ritardo o un rumore di fondo.
>
> ### 08/08 — i dodici commit ripassati, e le tredici righe reggono tutte
>
> Fra `4743c69` e `db04ac5` Sentinella è andata avanti di **12 commit**,
> **+622 righe** e −112 su `sentinella-data.js` e `index.html`. Uno solo di
> quei dodici **morde** secondo `documenti-invecchiati.mjs` — `e34aff3` — cioè
> è l'unico che ha aggiunto o tolto una `export function` o un `<button>`, le
> due forme con cui qui nasce e muore una funzione. Le quattro funzioni che ha
> aggiunto sono `distanzaDelRicettore`, `sogliaDelRicettore`, `contaCoperture`
> e `csvRicettori`: **nessuna** costruisce una delle cose che questo documento
> dichiara assenti.
>
> La prova non è la lettura, è la ricerca, rifatta con gli stessi termini che
> ogni riga dichiara di aver cercato:
>
> ```
> git diff 4743c69 HEAD -- apps/sentinella/ | grep -E "^\+" \
>   | grep -oEi "SMS|e-?mail|notific|wireless|4G|LoRa|telemetr|FFT|ottav|
>                spettro|temperatur|umidit|anemometr|\bvento\b|SO2|NO2|benzene|
>                cittadin|webhook|endpoint|OAuth|android|matricola|61672|
>                dispersion|AERMOD|cron|scheduler|widget|
>                dashboard configurabil" | sort | uniq -c
> →  (niente)
> ```
>
> **Zero occorrenze su 34 termini in 622 righe aggiunte.** E la riga **a metà**
> sulla certificazione degli strumenti rimisurata a parte sui file interi:
> `61672`, `45669`, `matricola`, `serial`, `numero di serie`,
> `classe.*strument` → **0 occorrenze ciascuno**; `modello` ne dà **1**, ed è
> il *modello di calcolo* della PPV prevista. Il verdetto regge alla cifra.
>
> ⚠️ **E LA PRIMA RIVERIFICA È STATA SBAGLIATA DA ME, non dal documento.**
> Rifacendo le ricerche sui file interi **senza distinzione fra maiuscole e
> minuscole e senza confini di parola** mi risultavano cinque righe da
> guardare: `LoRa`=14, `Hz`=7, `m/s`=50, `COV`=1, `API`=24. Guardate una per
> una: `LoRa` combacia con «co·lora·to» e «a·llora», `COV` con `cover`, `API`
> con «C·API·TO», e **tutte e 50** le `m/s` sono `mm/s`, che è l'unità della
> PPV — cioè il dato centrale dell'app. Le `Hz` sono le sette etichette dei
> preset DIN/USBM, come il documento diceva già. **Cinque falsi allarmi su
> cinque, e il difetto era il mio righello**, non il codice né la riga: una
> riverifica va fatta con la stessa cura della verifica, se no produce lavoro
> su mancanze immaginarie — che è esattamente il danno contro cui questo
> documento è nato.
>
> ### 06/08 — gli otto commit ripassati, e nessuna riga si è mossa
>
> Fra `2ab6295` (verifica del 02/08) e `8042b15` Sentinella è andata avanti di
> **8 commit**, **+597 righe** su `sentinella-data.js` e `index.html` (il ponte
> con Genesi, il report che non dice più «Conforme» su tre mesi di misure, il
> file per l'ARPA con la soglia di ogni schermata, la lettura datata 30 febbraio,
> i CSV di dimostrazione). La domanda della riverifica è **una sola**: qualcuno
> di quei commit ha costruito una delle 22 cose che questo documento dichiara
> assenti o a metà? La risposta è **no**, e la prova è il diff, non la lettura:
>
> ```
> git diff 2ab6295 HEAD -- apps/sentinella/ | grep -E "^\+" \
>   | grep -oEi "SMS|e-?mail|notific|wireless|4G|LoRa|telemetr|FFT|ottav|spettro|
>                temperatur|umidit|anemometr|\bvento\b|SO2|NO2|benzene|cittadin|
>                webhook|endpoint|OAuth|android|matricola|61672|modificatoDa|
>                creatoDa|dispersion|AERMOD|cron|scheduler|widget|
>                dashboard configurabil" | sort | uniq -c
> →       1 lora
> ```
>
> **Una sola occorrenza su 34 termini, ed è la sillaba di «al·lora·»** (riga
> aggiunta: *«ha quelle colonne, e allora la risposta è `null`»*). Sui file
> interi lo stesso termine dà 13 righe, tutte `colOra`, `colValore`, `colora`,
> `colorato` — il rilevatore di colonne del CSV, in camelCase; e l'unico `cov`
> di tutta l'app è `viewport-fit=cover` nel `<meta>` (`index.html:5`).
> Le due righe **a metà** rimisurate a parte, con `grep -o` + `uniq -c` come
> pretende la lezione del 06/08 su Terra: il «chi» dell'audit trail dà `47
> utente` (la parola nei commenti e nei testi) + `3 uid` (gli id dei gradienti
> SVG), `modificatoDa`/`creatoDa` **zero**; l'identità dello strumento dà `2
> modello`, ed è il *modello di calcolo* della PPV. Restano a metà tutt'e due.
>
> ⚠️ **Il vincolo circolare descritto qui sotto non c'è più** — è stato tolto il
> 02/08 proprio da questa riverifica — e infatti oggi l'arretrato di Sentinella
> torna a **0**, che prima era un fondo irraggiungibile per costruzione.
> *(Prima qui c'era `f5dab46`, e il capoverso qui sotto spiega perché: il
> controllo pretendeva un commit che avesse toccato il **documento**, e il
> commit che contiene la verifica non si può citare — il suo hash non esiste
> ancora quando scrivi la riga. Il vincolo circolare è stato tolto lo stesso
> giorno, e adesso vale il commit dell'app.)*
> Tutte e 22 le righe sono
> state riaperte il **02/08** contro `apps/sentinella/sentinella-data.js` e
> `apps/sentinella/index.html`, con un `grep` **prima** di ogni verdetto. La
> verifica precedente era del 01/08 al commit `e9f9b0d`, e nel frattempo
> l'app era andata avanti di **14 commit**: l'arretrato più alto dei sei
> documenti.
>
> ⚠️ **Il commit dichiarato non è quello che ho letto, e la ragione va detta
> invece che nascosta.** Il codice che ho aperto è il working tree al commit
> **`3e6a9fc`** — e per `apps/sentinella/` quel tree è identico a HEAD, perché
> `git status` non dava niente di non committato su nessuno dei due file. Ma
> `documenti-invecchiati.mjs` pretende un commit che abbia **davvero toccato
> questo documento** (è la difesa contro la data incollata), e né `3e6a9fc` né
> l'ultimo commit di Sentinella (`2ab6295`) lo toccano: l'ultimo che lo tocca è
> `f5dab46`. Quindi l'arretrato che il controllo stampa — **4 commit**, era 14 —
> è **pessimista per costruzione**: quei quattro (`ac090c9`, `9b89ed2`,
> `15571b5`, `2ab6295`) sono già dentro questa verifica. È un limite del
> controllo, non una scorciatoia, e non si può aggirare scrivendoci HEAD: un
> documento non può dichiarare il commit che lo contiene, perché quell'hash non
> esiste ancora quando lo si scrive.
>
> ### 06/08 (secondo passaggio) — riallineato al commit `4916275`
>
> L'app si è mossa di **un commit** dopo la verifica qui sopra, ed è il commit
> dei **disegni che mentono**: geometrie, non funzioni. Ripassato con lo stesso
> metodo — i termini del delta cercati **solo nelle righe aggiunte** — e non
> risponde niente, quindi nessuna riga cambia verdetto.
> ⚠️ E va detto che cos'è questo passaggio, per non farlo sembrare più di
> quello che è: **non è una rilettura delle righe una per una** (quella è
> quella sopra, con la sua data). È il controllo che un commit noto non abbia
> colmato una mancanza dichiarata. Costa un minuto e serve a tenere a zero
> l'arretrato che `documenti-invecchiati.mjs` misura; la prova vera resta
> quella riga per riga.
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

### Il conto, prima e dopo

| quando | confermate | false | ⏱️ scadute | a metà | totale |
|---|---|---|---|---|---|
| 01/08, **com'era scritto qui in fondo** | 17 | 4 | 1 | 0 | 22 |
| 01/08, **com'era davvero** | 15 | 4 | 2 | 1 | 22 |
| **02/08, questa verifica** | **13** | **4** | **3** | **2** | **22** |

⚠️ **La seconda riga non è una correzione di comodo, è aritmetica.** Il 01/08 la
**catena di custodia** e l'**audit trail** sono stati *tolti* dalle confermate —
l'avviso in cima lo racconta, «due sono già scese» — senza essere *aggiunti* da
nessun'altra parte: la riga «Sentinella» dell'avviso faceva 15+4+1+0 = **20** su
22 righe, e il conteggio qui in fondo diceva ancora **17** perché quelle due le
contava fra le assenti. Le stesse due righe in due posti con due numeri diversi.
Adesso ogni riga sta in **una** colonna sola, e il totale torna.

### Le due righe che hanno cambiato verdetto oggi

Tutt'e due ⏱️ **scadute**, e nello stesso modo che CLAUDE.md descrive: erano
vere quando sono state scritte (verifica del 01/08 alle 16:20) e il cantiere che
le colmava è girato **lo stesso pomeriggio**, senza sapere l'uno dell'altro.

1. **Documento/allegato per adempimento** → colmata dal commit `4ce1809`
   («La graffetta: un adempimento porta il documento»), **01/08 17:33**, cioè
   **un'ora e tredici minuti** dopo la verifica che la dichiarava assente.
2. **Certificazione/validazione strumenti** → colmata **a metà** dai tre commit
   della taratura (`76e7937` 16:54, `b66b856` 18:32, `e7542ab` 18:37): il
   certificato del centro di taratura c'è, la classe di conformità dello
   strumento no.

Nessun'altra riga si è mossa. Le tredici confermate sono confermate **anche
oggi**, con i termini rimisurati; le quattro false restano false (sono cambiati
solo i numeri di riga, che il codice cresciuto ha spostato); le due già segnate
scadute o a metà il 01/08 reggono.

---

Ogni riga marcata come "non c'è" o "c'è a metà" verificata contro il codice reale di `apps/sentinella/sentinella-data.js` e `apps/sentinella/index.html`.

### Righe "C'è a metà"

| Funzione | Verdetto | Prova (rimisurata il 02/08 · `3e6a9fc`) |
|----------|----------|-------|
| Report: export PDF | **FALSA** — c'era già, e c'è ancora | Il bottone «Stampa / Salva PDF» e il suo gestore, che chiama `window.print()`. ⏱️ *Prova riscritta il 14/08 — i tre `file:riga` erano scaduti tutti e tre (la riga si era già spostata due volte, 1252 → 1393 → altrove: è la dimostrazione che il numero di riga non è una prova)*: `grep -c 'btn-rep-stampa' apps/sentinella/index.html` → **2** (il bottone e il suo gestore) e `grep -c 'window.print()' apps/sentinella/index.html` → **1**. |
| Blast monitoring: correlazione previsto/misurato | **FALSA** — c'era già, e c'è ancora | ⏱️ *Prova riscritta il 14/08 — i tre `file:riga` erano scaduti, il verdetto no*: `grep -cE 'export function scartoPpvVolata' apps/sentinella/sentinella-data.js` → **1** e `grep -c 'previsto, misurato e scarto' apps/sentinella/index.html` → **2** (la sezione del report e la riga della lista). |
| Validazione numeri: float con virgola | **FALSA** — c'era già, e adesso su più campi | La convenzione è `<input type="text" inputmode="decimal">` sui campi decimali, mai `type="number"`. ⏱️ *Prova riscritta il 14/08 — i sedici numeri di riga erano un elenco che si sposta a ogni commit, e il verdetto regge*: `grep -c 'inputmode="decimal"' apps/sentinella/index.html` → **16**, e i `grep -c 'type="number"' apps/sentinella/index.html` → **5** sono **tutti e cinque campi INTERI** (`prg-giorni`, `prg-toll`, `ade-consegna`, `vol-nfori`, `conf-nfori`: giorni, tolleranza e numero di fori), cioè non contraddicono la convenzione — la caratterizzazione resta vera anche quando il numero cambia. `numeroDaCampo` (`sentinella-data.js`) delega al lettore **condiviso** di `shared/deepwork-id-client/dw-shell.js`, che legge la virgola italiana. |
| Flagging non-misurabilità: mai/conforme | **FALSA** — c'era già, e dal 02/08 gli stati sono **cinque** | Lo stato `"mai"` («Mai misurato», `calcolabile:false`) e — nuovo, **decisione 16** — lo stato `"senza-soglia"` («Senza soglia»). Nel report gli esiti sono quattro e non tre: `ESITI` distingue `senza-dati` da `senza-soglia`. ⏱️ *Prova riscritta il 14/08 — i sette numeri di riga erano scaduti tutti, il verdetto no*: `grep -c '"senza-soglia"' apps/sentinella/sentinella-data.js` → **4**, `grep -cE 'const ESITI' apps/sentinella/sentinella-data.js` → **1**, `grep -c 'senza-dati' apps/sentinella/sentinella-data.js` → **2**, e i badge nella pagina `grep -c 'senza-soglia' apps/sentinella/index.html` → **6**. *(Il verdetto del 01/08 regge; la decisione 16 lo rafforza invece di ribaltarlo.)* |

### Righe "Non c'è"

Le ricerche qui sotto sono state **rifatte** il 02/08 sui due file, e accanto a
ogni «non c'è» c'è il termine cercato col numero di occorrenze **vere** (i
falsi positivi sono dichiarati: un `grep` su `4G` prende `colOra`, uno su `API`
prende l'oggetto interno `api`, e contarli come presenze sarebbe l'errore
opposto).

| Funzione | Verdetto | Prova (rimisurata il 02/08 · `3e6a9fc`) |
|----------|----------|-------|
| Allarmi SMS/Email in tempo reale | **CONFERMATA ASSENTE** | Cercati su tutt'e due i file `SMS`, `e-?mail`, `notific`, `invia.*avviso`, `push notification` → **0 occorrenze**. |
| Monitoraggio wireless 4G | **CONFERMATA ASSENTE** | Cercati `wireless`, `4G`, `LoRa`, `IoT`, `telemetr`, `datalogger`, `gateway` → 13 righe, **tutte falsi positivi** (`colOra`, `colValore`, `colora`, `colorato`): zero occorrenze vere. L'unica strada d'ingresso resta l'import CSV (`leggiCsv`, `preparaLetture`). |
| Curva FFT 1/3 ottave configurable | **CONFERMATA ASSENTE** | `grep -ciE 'FFT\|ottav\|spettro\|Hz' apps/sentinella/sentinella-data.js apps/sentinella/index.html` → **7 e 0**, tutte e sette dentro le **etichette** dei preset di soglia (`SOGLIE_PRESET`: «<10 Hz», «4-15 Hz», «>40 Hz») e nella norma scritta su una volata (`ppvPrevNorma`). ⏱️ *Il `file:riga` è stato tolto il 14/08 perché scaduto; il nome regge:* `grep -cE 'export const SOGLIE_PRESET' apps/sentinella/sentinella-data.js` → **1**. Sono bande **citate nel testo di un limite**, non un'analisi in frequenza. |
| Umidità, temperatura | **CONFERMATA ASSENTE** | Cercati `temperatur`, `umidit`, `igrometr`, `°C` → **0 occorrenze**. Nessun campo, nessun tipo di misura, nessuna colonna d'import. |
| Direzione + velocità vento | **CONFERMATA ASSENTE** | ⏱️ *Rimisurata il 09/08: `raffic`, `anemometr`, `meteorolog` e `direzione del vento` danno ancora **zero**.* ⛔ Ma **`m/s` non è un termine di ricerca usabile in quest'app**: `grep -c 'm/s'` e `grep -c 'mm/s'` danno **lo stesso identico numero** su tutt'e due i file, cioè **ogni occorrenza di `m/s` è dentro un `mm/s`** — l'unità della vibrazione che Sentinella misura per mestiere. ⏱️ *Riscritto il 14/08: qui c'era «**47**, tutte e quarantasette», ed erano **48**. Il conto scade a ogni commit; l'**uguaglianza fra i due conti** no, ed è quella che dimostra il punto.* Cercare l'unità del vento dentro l'app della velocità di vibrazione è il righello che sbaglia, non il prodotto: il verdetto regge sui quattro termini che restano, e `\bvento\b` da solo pure **0** (le 2 righe che rispondono a `\bventi\b` sono il numerale «venti», dentro due commenti). `meteo` dà 1 riga, ed è il titolo del **registro delle acque meteoriche** (⏱️ *il `file:riga` è stato tolto il 14/08 perché scaduto*). |
| Emissioni gas (SO2, NO2) | **CONFERMATA ASSENTE** | `grep -ciE 'SO2\|NO2\|benzene\|camino\|composti organici'` → **0 e 0**. ⏱️ *Termini corretti il 09/08: `COV` combaciava con «viewport-fit=**cov**er» e `gas` è troppo corto per essere sicuro. Il verdetto non cambiava — l'unica occorrenza era un `<meta>` — ma una prova che pesca un meta tag non si può rilanciare.* I tipi di misura restano vibrazioni, rumore, polveri, acque, airblast. |
| Portale pubblico per residenti | **CONFERMATA ASSENTE** | Cercati `portale pubblic`, `public portal`, `cittadin`, `trasparenz` → **0 occorrenze**. ⏱️ *Prova riscritta il 14/08 — il `file:riga` era scaduto, il verdetto no*: `grep -c 'residenti' apps/sentinella/index.html` → **1**, ed è il testo di aiuto della sezione **reclami** («Qui si scrivono le segnalazioni dei residenti: giorno, ora, chi ha chiamato») — interna, chi risponde al telefono, non un accesso dall'esterno. |
| Integrazione API | **CONFERMATA ASSENTE** | `grep -ciE 'webhook\|endpoint\|OAuth'` → **0 e 0**. ⏱️ *Termini corretti il 09/08: `API` da solo combacia con «ca**pi**re», «ca**pi**ta», «ca**pi**sce» (22 righe) e `REST` con «**rest**a», «**rest**ituisce» (176): due parole italianissime. Il verdetto regge — le occorrenze erano tutte la variabile interna `api` di `sentinellaData()`, cioè il collegamento allo SDK di Deepwork ID. Nessuna interfaccia verso l'esterno. ⏱️ *I due `file:riga` sono stati tolti il 14/08 perché scaduti; i nomi reggono e vanno cercati con `async`, che è il modo in cui sono dichiarati:* `grep -cE 'export async function (sentinellaData\|ponteScudo)' apps/sentinella/sentinella-data.js` → **2**. *(Il **ponte** con Scudo — `ponteScudo` — è un collegamento **fra app nostre** dentro la stessa organizzazione, non un'API pubblica: le due cose non vanno raccontate come se fossero la stessa.)* |
| Smartphone app nativa | **CONFERMATA ASSENTE** | `grep -ciE 'android\|play store\|app store\|app nativa\|react native\|capacitor'` → **0 e 0**. ⏱️ *Termine corretto il 09/08: `ios` combaciava con «silenz**ios**a» e «inch**ios**tro» (9 righe). Verdetto invariato.* Resta la PWA. |
| Audit trail (chi, quando, cosa è cambiato) | 🟡 **A METÀ** — colmata a metà il 01/08, e il verdetto **regge** | `correggiLettura` (`sentinella-data.js`) conserva il **primo** valore e l'**ultima** correzione, così una misura ritoccata non può più sembrare quella originale. Il limite è scritto nel commento di quella funzione: **i passaggi intermedi non si conservano**. ⏱️ *Il `file:riga` è stato tolto il 14/08 perché scaduto*; il nome regge: `grep -cE 'export function correggiLettura' apps/sentinella/sentinella-data.js` → **1**. E il «chi» non c'è: `grep -ciE 'modificatoDa\|creatoDa' apps/sentinella/sentinella-data.js apps/sentinella/index.html` → **0 e 0**, mentre il termine largo `utente\|autore\|uid` non è usabile — dà decine di righe e sono **tutte** la parola «l'utente» nei commenti e nei testi più gli `uid` che sono gli **id dei gradienti SVG** dei grafici (caratterizzazione al posto del conto, perché il conto sale a ogni commento nuovo) — sono tutte la parola «l'utente» nei commenti e nei testi, più tre `uid` che sono gli **id dei gradienti SVG** dei grafici. `modificatoDa` e `creatoDa`: zero. Dentro l'organizzazione i ruoli sono una **decisione aperta**, non un difetto. |
| Storico tarature strumenti | ⏱️ **SCADUTA — c'è dal 01/08**, e il verdetto **regge** | Verifica `e9f9b0d` 16:20 → costruito `76e7937` 16:54, **34 minuti**. Oggi: `coperturaTaratura` (`sentinella-data.js`), `statoTaraturaStrumento`, `taratureDelReport`, `parseTaratureCsv`, `abbinaTarature`, `csvTarature`, `allerteTaratura`; ⏱️ *Prova riscritta il 14/08 — i tre `file:riga` erano scaduti, il verdetto no*: `grep -cE 'export function (coperturaTaratura\|statoTaraturaStrumento\|taratureDelReport\|parseTaratureCsv\|abbinaTarature\|csvTarature\|allerteTaratura)' apps/sentinella/sentinella-data.js` → **7** (tutte e sette), e nella pagina la card del report `grep -ci 'riferibilit' apps/sentinella/index.html` → **9**. |
| Certificazione/validazione strumenti | ⏱️ 🟡 **SCADUTA A METÀ** — *cambiata oggi* | **Il pezzo che c'è**, dai commit della taratura (`76e7937` 01/08 16:54, `b66b856` 18:32, `e7542ab` 18:37): numero di certificato e centro di taratura, le due date che dicono **quali letture il certificato copre**, l'import e l'export CSV dei certificati (`CSV_TARATURE_INTESTAZIONE = "strumento;data;scadenza;centro;certificato;nota"`) e il report che dichiara la **riferibilità** invece di darla per scontata (`DICHIARAZIONI_TARATURA`). ⏱️ *Prova riscritta il 14/08 — i quattro `file:riga` erano scaduti, il verdetto no*: `grep -cE 'CSV_TARATURE_INTESTAZIONE\|DICHIARAZIONI_TARATURA' apps/sentinella/sentinella-data.js` → **3**. **Che cosa manca ancora, detto con precisione:** l'**identità e la classe dello strumento**. `grep -ciE '61672\|45669\|matricola\|serial\|numero di serie\|classe.*strument' apps/sentinella/sentinella-data.js apps/sentinella/index.html` → **0 e 0** *(rilanciato il 14/08)*. `modello` è stato tolto dai termini perché non è usabile: dà 2 righe ed è il *modello di calcolo* della PPV prevista, non il modello dello strumento — ⏱️ *e il `file:riga` che lo citava era scaduto.* Un certificato di **taratura** dice che lo strumento è stato confrontato con un campione; una dichiarazione di **conformità** dice che quello strumento è, per esempio, un fonometro di classe 1 secondo IEC 61672 — e nel modulo non c'è nessun campo per dirlo. *(Che l'ente chieda l'una o l'altra è una **deduzione** di questo documento, non una norma letta riga per riga.)* |
| Catena di custodia dato | ⏱️ **SCADUTA — colmata il 01/08**, la riga ha fatto il suo lavoro | `provenienzaMisura` (`sentinella-data.js`), `descriviProvenienza`, `campiProvenienza`, `correggiLettura`, `composizioneProvenienza`: ogni misura porta se è entrata **da file** (con nome del file e momento) o **a mano**, e una misura di cui non si sa nulla è **«provenienza non dichiarata»** (`FONTE_IGNOTA`) — non «a mano». Il report dichiara la composizione (`DICHIARAZIONI_PROVENIENZA`). ⏱️ *Prova riscritta il 14/08 — i due numeri di riga erano scaduti, il verdetto no*: `grep -cE 'export function (provenienzaMisura\|descriviProvenienza\|campiProvenienza\|correggiLettura\|composizioneProvenienza)' apps/sentinella/sentinella-data.js` → **5** e `grep -cE 'FONTE_IGNOTA\|DICHIARAZIONI_PROVENIENZA' apps/sentinella/sentinella-data.js` → **5**. ✅ **E dal 14/08 la catena si è allungata dalla parte dell'ingresso**, senza cambiare il verdetto: `7a03bc4` ha aggiunto i tre lettori che dicono **quali righe di un file NON sono entrate e perché** — `grep -cE 'export function (scartiRicettoriCsv\|scartiAdempimentiCsv\|scartiVolateCsv)' apps/sentinella/sentinella-data.js` → **3**, letti dalla pagina (`grep -cE 'scartiRicettoriCsv\|scartiAdempimentiCsv\|scartiVolateCsv' apps/sentinella/index.html` → **4**). Prima una riga scartata dall'import spariva in silenzio, che è l'assenza di un dato raccontata come un dato favorevole. |
| Modellazione dispersione inquinanti | **CONFERMATA ASSENTE** | Cercati `dispersion`, `pennacchio`, `CALPUFF`, `AERMOD`, `inquinant` → **0 occorrenze**. *(`scaledDistance`/`caricaMax` sono un modello di **propagazione delle vibrazioni**, non di dispersione di inquinanti in aria: non contano come presenza.)* |
| Report automatico periodico | **CONFERMATA ASSENTE** — ⏱️ *ma metà della prova è scaduta il 13/08, per opera nostra* | **Quello che resta assente, ed è il verdetto:** nessuna consegna programmata. `grep -ciE 'cron\|scheduler\|invio automatic\|report automatic\|programmazione dell.invio' apps/sentinella/sentinella-data.js apps/sentinella/index.html` → **0 e 0**, e i termini del canale d'uscita `grep -ciE 'e-?mail\|smtp\|sendmail\|notifica automatica\|invio programmato'` → **0 e 0**. Il report si costruisce premendo un bottone (`renderReport`, `btn-rep-stampa`) e la consegna è la finestra di stampa del browser. ⛔ *E non è una dimenticanza: siamo una PWA senza backend, quindi «invio automatico» scritto in un'interfaccia che non invia niente sarebbe un numero tranquillo — la decisione è di non fingerlo.* ⏱️ **Scaduta invece la seconda metà, il 13/08:** questa riga diceva «lo scadenzario (`prioritaConformita`) ricorda la scadenza dell'adempimento ma non produce il report», ed è **falso da oggi** — dalla riga della scadenza si arriva al Report con il **periodo dell'adempimento già impostato**, senza digitare date. Prova: `grep -c 'periodoAdempimento' apps/sentinella/sentinella-data.js apps/sentinella/index.html` → **6 e 3**; `grep -cE 'data-ade-rep\|rep-origine' apps/sentinella/index.html` → **5**. ⚠️ *Il `-E` è stato aggiunto il 14/08: senza, `grep` cerca la stringa **letterale** `data-ade-rep\|rep-origine` e risponde **0** — un «non c'è» prodotto dal righello, sulla stessa riga che serve a dimostrare che una cosa c'è.* I nomi (stabili, non le righe): `periodoAdempimento`, `descriviPeriodoAdempimento`, `DICHIARAZIONI_PERIODO`, `dataMenoMesi`, `PERIODI_ADEMPIMENTO` nel modulo; `apriReportDaAdempimento`, `scordaOrigineReport` nella pagina. ⛔ **Resta vero, e va detto con precisione, che `PERIODICITA` non è la periodicità del documento**: quella conta i **giorni** con cui si misura un punto, questa i **mesi di calendario** che un adempimento copre — un trimestre che chiude il 30/09 comincia il 01/07, non il 03/07, e due giorni non guardati sono due giorni veri. |
| Notifica automatica residenti su reclami | **CONFERMATA ASSENTE** | Discende dalla riga sopra sul portale: nessun canale verso l'esterno. Cercati `notific`, `e-?mail`, `SMS` → **0 occorrenze**. |
| Documento/allegato per adempimento | ⏱️ **SCADUTA — c'è dal 01/08** · *cambiata oggi* | Colmata dal commit **`4ce1809`** («La graffetta: un adempimento porta il documento, e la regola vive in shared/»), **01/08 17:33**, cioè **un'ora e tredici minuti** dopo la verifica che la dichiarava assente. Oggi c'è il blocco dell'allegato, la graffetta sulla riga dell'adempimento, l'apertura del documento (con il caso «il file salvato non è leggibile» gestito invece che ignorato), il salvataggio e il controllo del file scelto. La regola vive in `shared/` come previsto — le stesse funzioni che usa Scudo. ⏱️ *Prova riscritta il 14/08 — i sei `file:riga` erano scaduti tutti e sei, il verdetto no*: `grep -cE 'export function (controllaAllegato\|testoAllegatoRifiutato\|pezziDataURL)' shared/deepwork-id-client/dw-shell.js` → **3**, e `grep -ciE 'controllaAllegato\|testoAllegatoRifiutato\|pezziDataURL' apps/sentinella/index.html` → **4**. |
| Dashboard configurabile | **CONFERMATA ASSENTE** | Cercati `widget`, `dashboard configurabil`, `layout personalizz`, `personalizza il quadro` → **0 occorrenze**. Il Quadro è un impianto fisso. |

### Conteggio (02/08)

- **Righe verificate:** 22
- **Confermate assenti:** **13** *(erano 15 — vedi «Il conto, prima e dopo»)*
- **False (c'è già):** 4 *(invariate; solo i numeri di riga si sono spostati)*
- **⏱️ Scadute:** **3** — storico tarature (`76e7937`, 34 minuti), catena di custodia (`896b1ea`), allegato dell'adempimento (`4ce1809`, 1 h 13 min) — **+1 rispetto a prima**
- **A metà:** **2** — audit trail (manca il «chi» e i passaggi intermedi), certificazione strumenti (manca la classe di conformità dello strumento) — **+1 rispetto a prima**

### Le 13 confermate, in ordine di quanto le chiederebbe un ispettore

⚠️ **L'ordine è un giudizio di mestiere, non una norma letta riga per riga.** È
dichiarato tale di proposito: chi lo usa per aprire un cantiere lo rimetta alla
prova, e le prime due voci sono anche quelle su cui questo documento è meno
sicuro, perché nascono da come si **suppone** che un ispettore legga un rapporto
di misura, non da un protocollo che qualcuno qui abbia letto.

1. **Umidità e temperatura** — sono le condizioni in cui la misura è stata
   presa. Un rapporto che non le porta lascia all'ente una domanda senza
   risposta, e il documento è il prodotto di Sentinella.
2. **Direzione e velocità del vento** — stessa famiglia, e per polveri e rumore
   pesa di più: è la condizione che può rendere una misura non rappresentativa.
   Oggi il report non sa dire con che vento si misurava.
3. **Report automatico periodico** — l'autorizzazione fissa una cadenza di
   consegna; lo scadenzario la ricorda, ma il documento lo costruisce a mano una
   persona, e una consegna dimenticata è un rilievo.
4. **Curva FFT / bande di terzo d'ottava** — serve quando c'è una componente
   tonale contestata e il limite in dB(A) non basta a chiudere la questione.
5. **Allarmi SMS/Email in tempo reale** — non è una domanda sul documento, è la
   domanda «quanto tempo avete impiegato ad accorgervene»: 7 produttori su 12 ce
   l'hanno, ed è la ricorrenza più alta di tutto l'elenco.
6. **Emissioni gas (SO2, NO2)** — pesa solo dove c'è un impianto di
   combustione (asfalti, calce): non è una mancanza per tutte le cave.
7. **Modellazione dispersione inquinanti** — chiesta quando bisogna dimostrare
   *perché* un valore è alto, non solo *che* è alto.
8. **Monitoraggio wireless 4G** — cambia il modello di raccolta più che il
   documento, e richiede hardware.
9. **Portale pubblico per residenti** — trasparenza: raramente richiesta da un
   ispettore, spesso decisiva col vicinato.
10. **Notifica automatica ai residenti sui reclami** — discende dalla 9.
11. **Integrazione API verso l'esterno** — richiesta da chi ha già un altro
    sistema, non dall'ente.
12. **Dashboard configurabile** — comodità interna.
13. **App nativa per smartphone** — la PWA copre l'uso in cava.

### La mancanza confermata più importante

Con l'elenco riordinato, la voce singola più costosa resta quella con la
ricorrenza più alta fra i concorrenti — **gli allarmi SMS/Email in tempo reale**
(7 produttori su 12) — ma le **condizioni meteo della misura** (umidità,
temperatura, vento) sono due righe che vanno insieme, costano meno di un canale
di notifica e finiscono **dentro il documento che va all'ente**, che è il posto
dove Sentinella si gioca la sua ragione d'essere. Se si apre un solo cantiere,
è quello.
