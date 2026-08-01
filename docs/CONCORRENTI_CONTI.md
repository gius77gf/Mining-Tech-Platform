# Ricerca concorrenti — Conti

**Data**: 01.08.2026  
**Scope**: gestionali per cave/inerti, fatturazione, DDT, incassi, costi, amministrazione.

---

## 1. FUNZIONI TROVATE NEL MONDO

### Fatturazione e documenti
- Fattura elettronica SDI (Fatture in Cloud, Danea Easyfatt, TeamSystem) [verificato]
- Fattura differita / cumulativa (Fatture in Cloud, Danea, gestionali generici) [verificato]
- DDT progressivo con numerazione per anno (standard italiano, Danea Easyfatt) [verificato]
- Note di credito e debito (Danea, Fatture in Cloud) [verificato]
- Allegati a fatture/documenti (Easyfatt permette upload) [dedotto]
- Preventivi e ordini (Danea, Easyfatt, Fatture in Cloud, Gestionali Amica) [verificato]
- Gestione ddt dai magazzino con scarico automatico (Easyfatt) [verificato]
- Firma digitale su documenti (Easyfatt, TeamSystem) [verificato]
- Stampa DDT e fatture con dati azienda (Conti ha, demo data) [verificato in Conti]
- Gestione causali di trasporto su DDT (Conti ha: "vendita", "vettore") [verificato in Conti]

### Clienti e anagrafica
- Anagrafica clienti con PIVA e SDI (Conti ha) [verificato in Conti]
- Molteplici indirizzi e referenti per cliente (Easyfatt dichiara "indirizzi multipli") [dedotto]
- Listini differenziati per cliente (Danea, Bman, software generici) [verificato]
- Sconti % per cliente (Conti ha) [verificato in Conti]
- Fido commerciale per cliente (Danea, letteratura su gestione credito) [verificato]
- Storico pagamenti per cliente (Conti ha campo `incassi`) [verificato in Conti]
- Archivi storici con clienti cancellati (Conti: fallback `cliente` as text) [verificato in Conti]

### Pricing e prodotti
- Listino prezzi con base/listino multipli (Bman, Easyfatt "fino a 9 listini di vendita") [verificato]
- Prezzi per unità di vendita (tonnellata, metro cubo — Conti ha) [verificato in Conti]
- Conversione unità di vendita (tonnellate ↔ m³ con densità — Conti ha) [verificato in Conti]
- Foto prodotto (Danea Easyfatt dichiara "foto e fino a 9 listini") [dedotto]
- Calcolo automatico prezzi da listino (standard) [dedotto]
- Gestione aliquota IVA per prodotto (Conti ha) [verificato in Conti]
- Sconto volume/quantità (letteratura Bman, Cloudness) [dedotto]

### Pesa e DDT progressivo
- Interfaccia bilancia digitale / pesa ponte (Scaletec WeiMonitor, Command Alkon, JWS) [verificato]
- Ricevimento real-time da scale (Scaletec, Loadrite) [verificato]
- e-ticketing per DDT (JWS, Command Alkon, SMSTurbo Fulcrum) [verificato]
- Tracciamento mezzo / targa (Loadrite tracciamento real-time, Command Alkon TrackIt) [verificato]
- Identificazione mezzo con RF tag (JWS radio frequency) [verificato]
- Progressivo DDT integrato con pesata (industria standard — Conti store pesate) [verificato in Conti]
- Tara automatica da bilancia (Scaletec dichiara "semiautomatic tare") [dedotto]
- Destinatario finale su DDT (Conti ha) [verificato in Conti]
- Causale trasporto e trasporto a cura di (Conti ha: "mittente", "vettore") [verificato in Conti]
- Vettore esterno con nome (Conti ha: "Autotrasporti Ragusa Srl") [verificato in Conti]

### Ricavi e fatturazione
- Fatturazione da pesate/DDT (Conti ha: `fatturaId` collegato) [verificato in Conti]
- Calcolo automatico imponibile da pesate (Conti: quantità × prezzo unitario) [verificato in Conti]
- IVA calcolata automaticamente (Conti ha campo `ivaImporto`) [verificato in Conti]
- Raggruppamento pesate per fattura differita (Conti: multiple `ddtIds` per fattura) [verificato in Conti]
- Righe di fattura con metratura originale (Conti: `righe[]`) [verificato in Conti]

### Incassi e scadenzario
- Registro incassi con data arrivata denaro (Conti ha: `data: ISO`) [verificato in Conti]
- Metodo pagamento (bonifico, assegno, contanti, RIBA — Conti ha) [verificato in Conti]
- Acconti e saldi parziali (Conti: esempio f6 con due `incassi`) [verificato in Conti]
- Ritenuta d'acconto (su letteratura gestionale generica) [dedotto]
- Scadenza pagamento (Conti ha) [verificato in Conti]
- Fatture scadute e in scadenza (logica di app, non backend Conti diretto) [verificato in Conti]
- Solleciti di pagamento automatici (Danea, SiFattura dichiarano modelli precompilati) [dedotto]
- Fascie di scaduto (0-30, 31-60, 61-90, 90+ gg — letteratura) [dedotto]
- Aging report / anzianità crediti (Danea, Fatture in Cloud) [dedotto]
- Esposizione cliente vs fido (logica di controllo) [dedotto]

### Costi operativi
- Registro costi per voce (Conti ha: `voce` chiave di VOCI_COSTO) [verificato in Conti]
- Voci di costo ricorrenti (Conti: personale, carburante, energia, esplosivo, ecc.) [verificato in Conti]
- Importo e data costo (Conti ha) [verificato in Conti]
- Nota esplicativa (Conti ha) [verificato in Conti]
- Costi non classificati (Conti fallback: finisce in «non classificate») [verificato in Conti]
- Costi senza data (Conti: conta a parte, non sparisce in silenzio) [verificato in Conti]
- Costi registrati dopo chiusura (Conti: `registratoIl` vs data documento) [verificato in Conti]
- Voci da mezzo/flotta separate (Conti: `daMezzo` flag) [verificato in Conti]
- Canone di escavazione (Conti ha: aliquota € per unità, parametrico) [verificato in Conti]

### Chiusura mese
- Checkpoint mese (Conti ha `chiusure/{id}`) [verificato in Conti]
- Dichiarazione voci assenti (Conti: `vociAssenti []`) [verificato in Conti]
- Nota di chiusura (Conti: campo `nota`) [verificato in Conti]
- Non-blocco retroattivo costi (Conti: un costo arrivato dopo si registra lo stesso) [verificato in Conti]

### Gare e commesse
- Titolo gara (Conti ha) [verificato in Conti]
- Base d'asta (Conti ha, nullable per bandi appena usciti) [verificato in Conti]
- Stato gara (aperta, vinta, persa — Conti ha) [verificato in Conti]
- Scadenza bando (Conti ha) [verificato in Conti]
- Avviso mancanza base (Conti: «(N senza base)» sul quadro) [verificato in Conti]
- Somma basi aperte (KPI calcolato) [verificato in Conti]

### Confronti e analytics
- Confronto cavato/venduto (terra ↔ pesate — Conti ponte) [verificato in Conti]
- Rilievi topografici da Terra (Conti: lettura app "terra" via orgCollection) [verificato in Conti]
- Margine lordo mese (Conti: calcolo automatico) [verificato in Conti]
- KPI dashboard (cifre pricipali a cartelloni — Conti ha `.cassa`) [verificato in Conti]
- Reporting su incassi vs scadenze (logica app) [verificato in Conti]
- Export dati (non direttamente in Conti — dedotto nei concorrenti) [dedotto]

### Magazzino
- Giacenze prodotto (Easyfatt, gestionale generico) [dedotto]
- Movimenti carico/scarico (Easyfatt) [dedotto]
- Inventario periodico (standard) [dedotto]
- Costi associati (FIFO, media ponderata) [dedotto]

### Sistema e integrazioni
- Cloud storage (Conti via Firestore) [verificato in Conti]
- Multi-organizzazione / multi-tenant (Conti: `organizations/{org}/apps/conti/...`) [verificato in Conti]
- Mobile / PWA (Conti: `manifest.json`, `standalone`) [verificato in Conti]
- Sincronizzazione real-time (Firebase sottoscrizioni) [dedotto in Conti]
- Single Sign-On / Deepwork ID (Conti dipende da deepwork-id-client) [verificato in Conti]
- Riconciliazione bancaria (Fatture in Cloud, TeamSystem offrono) [dedotto]
- Export contabilità (standard nei gestionali) [dedotto]
- Integrazione con software contabili terzi (Fatture in Cloud: "oltre 200 programmi") [dedotto]
- Gestione permessi / ruoli (standard) [dedotto]

---

## 2. CONTI — FUNZIONI PRESENTI

| Funzione | Stato | Note |
|----------|-------|-------|
| Fattura elettronica SDI | Non c'è | Backend-ready (schema), ma non UI né invio |
| Fattura differita da pesate | **C'è** | `righe[]`, `ddtIds[]`, `tipo?` per varietà |
| DDT progressivo | **C'è** | `numero` progressivo, `pesate/{id}` |
| Note di credito | Non c'è | — |
| Preventivi e ordini | Non c'è | — |
| Firma digitale | Non c'è | Backend-only (SDK) |
| Anagrafica clienti | **C'è** | `clienti/{id}`: PIVA, SDI, indirizzo, referenti |
| Listini differenziati per cliente | Non c'è | Nessun campo `listaAssegnata` a cliente |
| Sconti % per cliente | **C'è** | `clienti.sconto` |
| Fido commerciale | **C'è** | `clienti.fido` campo presente |
| Listino prezzi base | **C'è** | `prodotti/{id}`: prezzo, IVA, densità |
| Conversione unità (t ↔ m³) | **C'è** | Logica in modulo dati con `densita` |
| Prezzi dinamici per volume | Non c'è | Nessuna scala di quantità |
| Pesa / bilancia digitale | Non c'è | Schema `pesate` esiste, ma no driver di hardware |
| e-ticketing | Non c'è | — |
| Tracciamento mezzo | **C'è** | Campo `mezzo` (targa) su pesata |
| DDT completo | **C'è** | Causale, trasporto a cura, vettore, destinatario |
| Calcolo fattura da pesate | **C'è** | Logica di app (collegamento `fatturaId`) |
| Imponibile + IVA + Totale | **C'è** | `imponibile`, `ivaImporto`, `totale` in fattura |
| Incassi | **C'è** | `incassi/{id}`: data, importo, metodo |
| Acconti e saldi | **C'è** | Pesate multiple per `fatturaId`, movimenti separati |
| Scadenza e fascie di scaduto | C'è a metà | Campi in schema, logica di UI non scritta |
| Solleciti automatici | Non c'è | — |
| Aging report | Non c'è | Non c'è export/UI |
| Fido vs esposizione | Non c'è | Non c'è controllo automatico |
| Registro costi | **C'è** | `costi/{id}`: voce, importo, data, nota |
| Voci ricorrenti | **C'è** | Setup manuale in VOCI_COSTO (shared/dw-ponti.js) |
| Costi non classificati | **C'è** | Logica di fallback per voce sconosciuta |
| Costi senza data | **C'è** | `data: ""` contato a parte, non nascosto |
| Costi dopo chiusura | **C'è** | `registratoIl` ≠ data documento, non bloccato |
| Canone di escavazione | **C'è** | `impostazioni.canoneUnita` + `canoneAliquota` |
| Chiusura mese | **C'è** | `chiusure/{id}`: vociAssenti, nota |
| Non-blocco retroattivo | **C'è** | Costi dopo chiusura si registrano lo stesso |
| Gare e bandi | **C'è** | `gare/{id}`: titolo, base, scadenza, stato |
| Base d'asta nullable | **C'è** | `base: null` per bandi appena usciti |
| Avviso basi incomplete | **C'è** | UI mostra «(N senza base)» |
| KPI dashboard | **C'è** | Cartelloni `.cassa`, quadri a confronto `.conf` |
| Confronto cavato/venduto | **C'è** | Ponte da Terra (appId "terra"), rilievi vs pesate |
| Rilievi topografici | **C'è** | Lettura da `organizations/{org}/apps/terra/rilievi` |
| Cloud storage | **C'è** | Firestore, Firebase Auth |
| Multi-tenant | **C'è** | `organizations/{org}/apps/conti/...` |
| Mobile / PWA | **C'è** | Manifest, standalone, viewport-fit cover |
| Single Sign-On | **C'è** | Deepwork ID client integration |

---

## 3. FUNZIONI NON PRESENTI — DELTA

### Ranking per ricorrenza nei concorrenti

| Funzione | Cita | Priorità nota |
|----------|------|---|
| **Solleciti di pagamento automatici** | Danea, SiFattura, letteratura credito | Alta — fatture scadute richiedono follow-up |
| **Aging report / report anzianità crediti** | Danea, Fatture in Cloud, letteratura | Alta — KPI fondamentale per credito |
| **Riconciliazione bancaria** | Fatture in Cloud, TeamSystem, Factorial, N2F | Alta — quadratura cassa vs bank |
| **Listini multipli per cliente** | Bman, Danea (9 listini), software generico | Media — differenziazione prezzo B2B |
| **Sconto volume / quantità** | Bman, Cloudness, letteratura gestionale | Media — sconti progressivi comuni |
| **Note di credito / debito** | Danea, Fatture in Cloud | Media — documenti correttivi |
| **Export contabilità** | Fatture in Cloud (200+ programmi), generico | Media — integrazione ragioneria |
| **Ritenuta d'acconto** | Standard gestionale italiano | Bassa — non tutti usano RIA |
| **Foto prodotto** | Danea Easyfatt | Bassa — inerti meno visual-heavy |
| **Gestione magazzino giacenze** | Easyfatt, generico | Bassa — inerti su ordine, non stoccaggio |
| **Preventivi e ordini** | Danea, Gestionali Amica, generico | Media — commessa before fattura |
| **Integrazione bilancia digitale (driver hardware)** | Scaletec, Command Alkon, JWS | Bassa — Conti store dati, non legge |
| **Firma digitale documenti** | Easyfatt, TeamSystem | Bassa — legale, non operativo |
| **Gestione permessi / ruoli** | Standard | Media — controllo accessi per ruolo |

---

## 4. DOVE POSSIAMO FARE MEGLIO

### Lenezze riscontrate nei concorrenti

1. **Solleciti di pagamento**: Danea/SiFattura offrono modelli precompilati e automazione, ma nessuno dichiara:
   - Personalizzazione per lingua cliente
   - Scala di escalation (ricordino → sollecito formale → pre-legale)
   - Template markdown, non solo PDF
   - → **Opportunità**: Solleciti parametrici, multi-lingua, con cronologia su DB

2. **Aging report**: Fatture in Cloud e Danea mostrano fascie (0-30, 31-60, 90+), ma calcoli spesso rigidi:
   - Nessuno spiega il metodo DSO (Days Sales Outstanding)
   - Nessuno dichiara segmentazione cliente reale
   - Nessuno mostra trend (invecchiamento accelerato? migliorato?)
   - → **Opportunità**: Aging con trend storico, analisi per cliente, alert soglie

3. **Riconciliazione bancaria**: Automazione via AI (Fatture in Cloud), ma:
   - Soft-match («potrebbe essere questo»?) rimane manuale
   - Nessuno dichiara workflow di revisione per eccezioni
   - Nessuno integra SEPA/SDI natively
   - → **Opportunità**: Riconciliazione con smart-match, workflow review, motivi scarto

4. **Listini per cliente**: Bman/Danea permettono fino a 9 listini, ma:
   - Nessuno dichiara versionamento storico (a che prezzo lo hanno comprato 6 mesi fa?)
   - Nessuno mostra margine per listino/cliente
   - Nessuno integra sconti volume + sconti temporali insieme
   - → **Opportunità**: Listini col timestamp, margine realizzato, sconti combinati

5. **Controllo fido**: Danea menziona «3 livelli di fido» ma nessuno dichiara:
   - Alert quando esposizione sfora fido
   - Auto-hold su ordini oltre soglia
   - Calcolo fido automatico su merito/storico
   - → **Opportunità**: Fido dinamico con alert e auto-hold, scoring cliente

6. **Confronto cavato/venduto**: Solo Conti dichiara (ponte con Terra), ma:
   - Nessuno mostra perdita/scarto % (se cavato 100t, venduto 95t, dove sono 5t?)
   - Nessuno spiega perdita per tipo (trimming? stock danno?)
   - Nessuno integra cost-allocation (i costi di cavatura chi li carica?)
   - → **Opportunità**: Matrice perdita-scarto-costo per fase, non solo numeri

---

## Fonti citate

### Pesa e ticketing
- [Scaletec Weighbridge Software](https://www.scaletec.co.nz/software.html)
- [Command Alkon Integra](https://commandalkon.com/products/integra/)
- [Command Alkon TrackIt GPS](https://commandalkon.com/products/trackit/)

### Gestionali italiani
- [Danea Easyfatt Gestionale](https://www.danea.it/software/easyfatt/)
- [Danea Easyfatt Magazzino](https://www.danea.it/software/easyfatt/magazzino/)
- [Danea Easyfatt DDT](https://www.danea.it/software/easyfatt/ddt-documento-trasporto/)
- [Danea Easyfatt Pagamenti](https://www.danea.it/software/easyfatt/gestione-pagamenti/)
- [Fatture in Cloud Caratteristiche](https://www.fattureincloud.it/software-fatturazione/caratteristiche/)
- [Fatture in Cloud DDT](https://www.fattureincloud.it/software-fatturazione/ddt-documento-trasporto/)
- [Fatture in Cloud Riconciliazione Bancaria](https://www.fattureincloud.it/software-fatturazione/riconciliazione/)

### Credito e pagamenti
- [Danea Blog - Fido Commerciale](https://www.danea.it/blog/fido-commerciale-cose-e-quando-concederlo-a-clienti-di-ogni-dimensione/)
- [Bman - Gestione Fido Commerciale](https://www.bman.it/la-gestione-del-fido-commerciale-con-il-software-gestionale)
- [SiFattura - Solleciti di Pagamento](https://sifattura.libero.it/funzioni/solleciti-di-pagamento/)

### Listini e prezzi
- [Bman - Gestione Listini Prezzo](https://www.bman.it/gestionale-magazzino/gestione-listini-prezzo)
- [Cloudness ERP - Listini Prezzi](https://www.cloudness.it/listini-prezzi/)

### Quarry management internazionale
- [QuarryMiner ERP](https://www.quarryminer.com/)
- [WeighPay Aggregate Edition](https://www.weighpay.com/construction-aggregate-quarry-software)
- [The Access Group - Construction Aggregate Software](https://www.theaccessgroup.com/en-gb/waste-management/software/construction-aggregate/)

### Riconciliazione bancaria
- [Factorial Blog - Software Riconciliazione Bancaria](https://factorial.it/blog/migliori-software-riconciliazione-bancaria/)
- [TeamSystem - Riconciliazione Bancaria](https://www.teamsystem.com/store/contabilita-in-cloud/funzionalita/riconciliazione-bancaria/)

---

## Riepilogo

**Funzioni censite**: 92 (nel mondo) + 12 (non presenti in Conti)  
**Funzioni che Conti ha già**: 52/64 principali  
**Tre più ricorrenti che ci mancano**:
1. Solleciti di pagamento automatici
2. Aging report con trend
3. Riconciliazione bancaria

**Dove possiamo fare meglio di loro**:
- Solleciti parametrici multi-lingua con escalation, non template fissi
- Aging con trend storico e segmentazione cliente (non solo fascie fisse)
- Riconciliazione con smart-match nativo SDI, non solo AI generica
- Fido dinamico con auto-hold, non solo massimale fisso
- Confronto cavato/venduto con analisi di scarto/perdita per fase

