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


---

## Verifica del delta (01/08 · **riverificata riga per riga il 03/08**)

> **Verificato contro il codice al commit `57c78cf`** *(riverificato l'08/08;
> le precedenti erano a `4916275` il 06/08 e a `ecc65d5` il 01/08).*
>
> ### 08/08 (terzo passaggio) — quattordici commit, quattro che mordono, otto righe che reggono
>
> Fra `4916275` e `4c1bb43` Conti è andata avanti di **14 commit**, **+830
> righe** e −96, **quattro** dei quali mordono. Quello che hanno costruito è
> tutto **import/export CSV**: `csvClienti`, `csvIncassi`, `csvPesate`,
> `csvSituazioneFatture`, i tre lettori corrispondenti, e cinque bottoni
> («Esporta clienti / incassi / pesate», «Copia di sicurezza», «Ri-carica
> copia»).
>
> **Le otto righe confermate assenti reggono tutte**, e le ricerche sui file
> interi danno **zero** per: `pesa ponte`, `weighbridge`, `seriale`,
> `webserial`, `driver`, `loadrite`, `firma digitale`, `e-ticket`, `eticket`,
> `ticket`, `ritenuta`, `foto prodotto`, `magazzino`, `giacenz`, `ruolo`,
> `permess`, `FatturaPA`, `p7m`, `trasmission`.
>
> ⚠️ **Due righe si sono mosse INTORNO senza spostarsi, e vanno dette**, se no
> chi le riapre fra un mese trova la prova invecchiata e butta via il verdetto
> insieme a lei (è la terza forma di invecchiamento raccolta in `CLAUDE.md`):
> · **Pesa / bilancia digitale.** Il verdetto è sul **driver hardware** e
>   regge alla cifra: zero occorrenze di `seriale`, `webserial`, `loadrite`.
>   Ma la frase «le pesate **si digitano**» adesso è **stretta**: dal
>   `csvPesate` / `parsePesateCsv` una pesata può anche **entrare da un file**.
>   Fra digitare e leggere un apparecchio c'è ancora tutto lo spazio che quella
>   riga descrive — ma il modo di far entrare i dati non è più uno solo.
> · **Fattura elettronica SDI.** `sdi` passa da 22 a **28** occorrenze, e le
>   sei nuove sono la colonna `sdi` dentro l'export/import dei clienti
>   (`CSV_CLIENTI_INTESTAZIONE = "id;ragioneSociale;piva;sdi;…"`): il codice
>   destinatario adesso **viaggia anche nel CSV**. Il verdetto non cambia,
>   perché parla di **file XML e trasmissione**: `FatturaPA` e `p7m` restano a
>   **0**, e delle tre `xml` due sono il `manifest` e la terza è la frase del
>   piede di stampa (*«l'originale è il file XML trasmesso al Sistema di
>   Interscambio»*, `index.html:4456` — era 3946, il file è cresciuto).
>
> — l'ultimo che ha toccato
> `apps/conti/`, quindi l'arretrato riparte da **zero**. Il codice è stato letto
> dal **committato** (`git show HEAD:apps/conti/conti-data.js`, 3.543 righe;
> `git show HEAD:apps/conti/index.html`, 6.103 righe), non dal disco, perché
> mentre questa verifica girava altri cantieri stavano scrivendo su `apps/conti/`.
>
> La verifica precedente era ferma a `f3432f4` e aveva accumulato **12 commit**
> di arretrato. In mezzo Conti ha ricevuto **tre cantieri interi**, e si vedono
> nell'unico modo che non mente: le funzioni esportate nuove.
> `git show f3432f4:apps/conti/conti-data.js` contro `HEAD` dà **30 export nuovi
> e zero tolti**, e si dividono in tre grappoli e **solo tre**:
>
> | grappolo | export nuovi | commit |
> |---|---|---|
> | Preventivi / ordini (+ il prezzo dell'ordine ereditato dal DDT) | `STATI_PREVENTIVO`, `statoPreventivoLabel`, `statoPreventivo`, `ordineConfermato`, `rigaPreventivo`, `totaliPreventivo`, `consegnatoOrdine`, `ddtDaAgganciare`, `prezzoDaOrdine`, `descriviPrezzoOrdine`, `avanzamentoOrdine`, `descriviAvanzamento`, `portafoglioOrdini`, `preventiviDaSeguire` | `896b1ea` (01/08) → `5218350` (02/08) |
> | Prezzi a scaglioni di quantità | `validaScaglioni`, `scaglionePer`, `applicaScaglione`, `etichettaScaglione`, `descriviScaglione` | `aa14015` → `f5dab46` (01/08) |
> | Abbinamento dei movimenti bancari | `parseMovimentiCsv`, `importoBancario`, `isoDaDataItaliana`, `numeroInCausale`, `clienteInCausale`, `combinazioneUnica`, `movimentoGiaRegistrato`, `abbinaMovimenti`, `riepilogoAbbinamento`, `GRADI_ABBINAMENTO`, `ESTRATTO_ESEMPIO` | `c02836a` (01/08) |
>
> Tre grappoli, **tre righe scadute** — e nessun'altra, perché nessun altro
> export è nato. Le altre quindici righe sono state riaperte una per una lo
> stesso: i numeri di riga di §2 e §3 erano tutti spostati, e una prova che cita
> una riga sbagliata non è una prova.
> Di quanti commit l'app sia andata avanti lo dice
> `node apps/deepwork-id/tests/documenti-invecchiati.mjs`.
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

*Ogni riga marcata «Non c'è» o «C'è a metà» nella tabella §2 e ogni riga della
tabella §3 è stata riaperta sul codice. Le righe che comparivano in tutt'e due
le tabelle (solleciti, aging, note di credito, listini, preventivi, firma
digitale, bilancia, sconto volume) sono contate **una volta sola**: 18 righe
distinte.*

| Funzione | Verdetto | Prova |
|---|---|---|
| Fattura elettronica SDI (file XML + invio) | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | `grep -ci` su `conti-data.js` e `index.html`: `fatturapa` **0/0**, `FatturaPA` **0/0**, `p7m` **0/0**, `xml` **0/2** — e le due del `.html` sono il `manifest` (riga 12) e la frase del piede di stampa (3946). Nessuna generazione né trasmissione del tracciato. La nota di §2 «né UI» resta **falsa**: `clienti.sdi` (codice destinatario o PEC) è documentato a `conti-data.js:7`, valorizzato nella dimostrazione (120-121) e ha il suo campo nel form (`index.html:1386-1389`, `cl-sdi`), letto in scrittura a 4984 e ricaricato a 4815. ✅ **E una cosa è migliorata dal 01/08**: il piede della fattura stampata adesso **dichiara la mancanza** invece di lasciarla intuire — «Documento di cortesia stampato da Conti. **Non sostituisce la fattura elettronica**: l'originale è il file XML trasmesso al Sistema di Interscambio», con l'indicazione del portale gratuito **Fatture e Corrispettivi** dell'Agenzia delle Entrate (`index.html:3945-3948`). Manca il file XML e l'invio, non la consapevolezza. |
| Note di credito / debito | **FALSO, C'È GIÀ** — ed è la falsa più grossa di questo documento *(righe riallineate il 03/08)* | Impianto completo su **art. 26 DPR 633/1972**: `CAUSALI_NOTA` con il **comma** e il **termine di 12 mesi** per ogni causale (`conti-data.js:2190`), `causaleNota`, `stornatoDi`, `statoFattura` che tiene conto dello storno (2282), `validaNota`, `notaDaFattura`. Nella pagina: sezione **«Note di credito»** sotto le fatture (`index.html:707-713`), badge «Stornata / Stornata N%» sulla fattura (1933-1942), e le note che **abbassano imponibile e IVA del periodo** con le due cifre tenute separate per il commercialista (2744-2761). Lo storno entra anche in `apertoDi`, quindi in aging ed esposizione. Esiste pure la ricerca dedicata: `docs/RICERCA_NOTE_DI_CREDITO_202608.md`. |
| Preventivi e ordini | ⏱️ **SCADUTA** — vera al `f3432f4`, colmata il **01/08** e **estesa il 02/08** | **Prova che c'è, per NOME (non per riga: i numeri invecchiano a ogni commit):** `STATI_PREVENTIVO` (`conti-data.js`), `statoPreventivoLabel`, `statoPreventivo`, `ordineConfermato`, `rigaPreventivo`, `totaliPreventivo`, `consegnatoOrdine`, `ddtDaAgganciare`, `avanzamentoOrdine`, `descriviAvanzamento`, `portafoglioOrdini`, `preventiviDaSeguire`. Nella pagina: voce di navigazione **«Ordini»** (`index.html:1542`), sezione «Offerte da richiamare» (848), import a 1581-1584, resa a 2069 e 2089, export `conti_preventivi.csv` (6079). **Commit:** `896b1ea` (01/08, `git log -S"STATI_PREVENTIVO" -- apps/conti/conti-data.js`). **Prova che era vera il 01/08:** cercati allora `preventiv`, `ordine cliente`, `ordini clienti`, `conferma d'ordine`, `quote` in `conti-data.js` e `conti/index.html`: zero occorrenze; il ciclo partiva dalla pesata/DDT. ✅ **E il 02/08 è cresciuta ancora** (`5218350`): `prezzoDaOrdine` e `descriviPrezzoOrdine` fanno **ereditare al DDT il prezzo concordato sull'ordine** invece di rifare il conto dal listino del giorno — difetto misurato sui dati di dimostrazione prima di scrivere la funzione: **36,48 € in più su un camion di 25,6 t, 1.167 € sull'ordine intero**. E quando il pattuito non si sa **non si ripiega**: `calcolabile: false` con i cinque motivi scritti. |
| Firma digitale documenti | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | Cercati `firma digitale`, `firma grafometrica`, `firmato digitalmente`: **zero**. Il termine largo `firma` dà 8 occorrenze e nessuna è una firma elettronica: sei sono prosa nei commenti (`conti-data.js:2634, 3094, 3144, 3347, 3354, 3500` — «un preventivo che il cliente non ha mai firmato»), due sono **righe di firma a penna** sui documenti stampati (`index.html:2539` «Per accettazione — timbro e firma» sul preventivo, `3895` «Firma del conducente / Firma del destinatario per ricevuta» sul DDT). Cioè il posto dove servirebbe la firma digitale c'è, ed è vuoto. |
| Listini differenziati per cliente | **C'È A METÀ** — *ma la metà che c'è si è allargata due volte dal 01/08* | *C'è (tre strati, tutti verificati):* **1.** sconto per cliente — `clienti.sconto` %, validato da `scontoValido` (`conti-data.js`) e applicato in `imponibileRiga(quantita, prezzoUnitario, scontoPct)` (1429), con il DDT che stampa **prezzo di listino e sconto separati** invece del netto (la ragione è scritta a 1415-1419); **2.** scaglioni di quantità per prodotto (`validaScaglioni`, 1507 — vedi la riga sotto); **3.** ⏱️ **dal 02/08** il **prezzo concordato** che vive sull'ordine e che il DDT eredita (`prezzoDaOrdine`, 3380), cioè la forma in cui un prezzo personalizzato per cliente esiste davvero in Conti. *Manca ancora:* **più listini nominati e assegnabili** — c'è un solo listino prodotti (`prodotti/{id}`, import da `parseListinoCsv`, 652; export `conti_listino.csv`, `index.html:5745`) e nessun campo che leghi un cliente a un listino. `grep -c` sul committato: `listini` **0 in tutt'e due i file**, `listaAssegnata` **0**, `prezzoCliente` **0**, `listino cliente` **0** (`listino` da solo dà 72+124 occorrenze, tutte il listino unico). |
| Prezzi dinamici per volume / sconto quantità | ⏱️ **SCADUTA** — vera al `f3432f4`, colmata il **01/08** | **Prova che c'è, per NOME (non per riga: i numeri invecchiano a ogni commit):** `validaScaglioni` (`conti-data.js`), `etichettaScaglione`, `scaglionePer`, `descriviScaglione`, `applicaScaglione`. Nella pagina: blocco **«Prezzi a scaglioni di quantità»** nel listino (`index.html:1241-1275`), import a 1585-1586. La scala è per prodotto, a **prezzi** oppure a **sconti**, con la forma «da» (i buchi non sono rappresentabili). Sconto cliente e scaglione **si sommano**, perché il cliente deve poter rifare il conto a mente — e perché una percentuale piegata nel prezzo unitario perde soldi (misurato: 6,24 € su 2.230 t). ⚠️ Lo scaglione vive nel **preventivo, non sul DDT**: un DDT è un camion, e scegliere la banda sulla portata di un autocarro farebbe pagare il prezzo del privato a chi ha comprato 5.000 t. **Commit:** `aa14015` (01/08, `git log -S"validaScaglioni" -- apps/conti/conti-data.js`), rifinito in `f5dab46`. **Prova che era vera il 01/08:** cercati allora `scaglion`, `sconto volume`, `quantita minima`, `fascia di quantità`, `tier`: zero; lo sconto era una sola percentuale per cliente, indipendente dalla quantità. |
| Pesa / bilancia digitale (driver hardware) | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | Cercati `pesa ponte`, `weighbridge`, `seriale`, `webserial`, `driver`, `loadrite`: **zero in tutt'e due i file**. `bilancia` dà 8 occorrenze e **nessuna legge un apparecchio**: due sono commenti (`conti-data.js:234, 1921`), una è il segnaposto del campo lordo «Peso lordo in tonnellate, come sulla bilancia» (`index.html:997`), una è il disegno dell'**icona** (1696), quattro sono l'icona riusata negli stati vuoti (3965, 3970, 3976, 4404). Le pesate si digitano: `nettoPesata` (`conti-data.js`), `rigaPesata`, lordo e tara a mano. |
| e-ticketing per DDT | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | `grep -ci` su `conti-data.js` e `index.html`: `e-ticket` **0/0**, `eticket` **0/0**, `ticket` **0/0** — nemmeno la parola esiste. Il DDT esiste ma si **stampa**: `mancanzeDdt` (`conti-data.js`), `CAUSALI_TRASPORTO`, `TRASPORTO_A_CURA`, modello di stampa con le due righe di firma a penna (`index.html:3895`), export `conti_pesate_ddt.csv` (5321). |
| Scadenza e fasce di scaduto — §2 la dichiarava «C'è a metà, logica di UI non scritta» | **FALSO: la UI c'è** *(righe riallineate il 03/08)* | `statoScadenzaFattura` (`conti-data.js`) e `agingIncassi` sono **disegnate**: sezione «Aging incassi — crediti aperti per ritardo» (`index.html:1516-1518`), import a 1568, calcolo e righe a 3000-3022, totale «da sollecitare» a 3028, barra delle fasce dal motore grafico dichiarato a 391. |
| Solleciti di pagamento automatici | **FALSO, C'È GIÀ** *(righe riallineate il 03/08)* | `TASSO_MORA_DEFAULT = 10,15%` annuo — 1° semestre 2026, GU 15/2026 — e `SPESE_RECUPERO_231 = 40 €` forfettari ex **art. 6 D.Lgs 231/2002** (`conti-data.js:696-697`), `interessiMora`, `livelloSollecito(giorniRitardo)` (709), `testoSollecito` che cita la norma per esteso nel testo della lettera (763), `prioritaIncasso`, `estrattoContoCliente`. Nella pagina: bottone **«Sollecito»** su ogni fattura in ritardo (`index.html:2716`, con `livelloSollecito` a 2676) e sezione **«Priorità: chi sollecitare per primo»** (679). |
| Aging report / anzianità crediti | **FALSO, C'È GIÀ** *(righe riallineate il 03/08)* | `agingIncassi` (`conti-data.js`) con le fasce **non scaduto / 1-30 / 31-60 / 61-90 / oltre 90** e `scadutoTot`, calcolate sul **residuo** (`apertoDi`, 1269) e non sul nominale. Ha anche il secchio **`senzaScadenza`** (550, assegnato a 570) — una fattura senza data non finisce nella fascia tranquilla — che è più di quanto facciano i concorrenti citati, e la stessa convenzione la riusa `prioritaIncasso`. Reso a `index.html:1516-1518` e 3000-3028. Manca solo il **trend storico** promesso in §4.2 (l'aging è una fotografia di oggi). |
| Fido vs esposizione (alert quando si sfora) | **FALSO, C'È GIÀ** *(righe riallineate il 03/08)* | `esposizioneClienti` (`conti-data.js`) somma il residuo per cliente e restituisce **`oltreFido`** (872). Nella pagina: sezione «Esposizione per cliente (chi chiamare per primo)» (`index.html:1525`), grafico a barre con la **tacca verticale del fido** e il caso «senza fido» disegnato diverso (407-433), campo `cl-fido` con la sua spiegazione «Diventa rosso se supera il fido che hai impostato» (1401-1418), salvato in `CL_CAMPI`. ⏱️ E l'**auto-hold** che il 01/08 mancava «perché gli ordini non esistono» adesso ha il suo aggancio: gli ordini esistono (`portafoglioOrdini`, `conti-data.js:3512`), quindi non è più una mancanza di impianto ma una funzione da scrivere. |
| Riconciliazione bancaria | ⏱️ **SCADUTA** — vera al `f3432f4`, colmata il **01/08**. *Era «la mancanza confermata più importante» di questo documento* | **Prova che c'è, per NOME (non per riga: i numeri invecchiano a ogni commit):** `importoBancario` (`conti-data.js:2662`, 9 formati su 15 raccolti dagli export bancari italiani), `isoDaDataItaliana`, `parseMovimentiCsv`, `numeroInCausale`, `clienteInCausale`, `combinazioneUnica`, `GRADI_ABBINAMENTO = ["certo","probabile","debole","nessuno"]` (2808), `movimentoGiaRegistrato`, `abbinaMovimenti`, `riepilogoAbbinamento`, `ESTRATTO_ESEMPIO`. Nella pagina: voce di navigazione **«Banca»** (`index.html:1541`), sezione «Estratto conto della banca» (804-830) con caricamento CSV, esempio, svuota, import a 1567, resa a 5528, conferma degli abbinamenti certi a 4594. **Commit:** `c02836a`, 01/08 (`git log -S"abbinaMovimenti" -- apps/conti/conti-data.js`). **Prova che era vera il 01/08:** cercati allora `estratto conto bancario`, `CBI`, `movimenti bancari`, `banca`, `SEPA`: nessuna traccia di flussi bancari; gli incassi si registravano solo a mano. ⚠️ Il conflitto di nome che il 01/08 era stato segnalato è stato **evitato di proposito**: `riconciliazione(rilievi, pesate, dal, al)` (2056) resta cavato-contro-venduto, e la funzione nuova si chiama **abbinamento** — la decisione è scritta a 2609-2612. ⛔ E il difetto che questa riga esisteva per far sparire è **dichiarato nella pagina stessa**: «È l'unico punto in cui questa app ti chiedeva di ribattere a mano un dato che esiste già… Da lì viene il danno peggiore che Conti sappia fare — un **sollecito con la mora mandato su una fattura già pagata**» (`index.html:805-809`), che è parola per parola il paragrafo «mancanza più importante» qui sotto. Le proposte **si propongono e non si applicano**: sotto `probabile` non c'è nessuna proposta (2624-2625). |
| Export contabilità | **C'È A METÀ** *(riverificato il 03/08: gli export sono nove, non sei)* | *C'è*: **nove** export CSV, contati sui `a.download` del committato — `conti_situazione_fatture.csv` (`index.html:4934`), `conti_incassi.csv` (4953, che il commento chiama già «prima nota degli incassi», 4937), `conti_clienti.csv` (5006), `conti_costi_<dal>_<al>.csv` (5215), `conti_listino_prezzi.csv` (5232), `conti_pesate_ddt.csv` (5321), `conti_listino.csv` (5745), `conti_gare.csv` (5786), `conti_preventivi.csv` (6079, nuovo col cantiere degli ordini). *Manca*: un tracciato **per il programma del commercialista**. `grep -ci` sul committato: `Danea` **0/0**, `TeamSystem` **0/0**, `prima nota` **0/1** (ed è un commento), `partita doppia` **0/0**, `piano dei conti` **0/0**, `causale contabile` **0/0**, `liquidazione IVA` **0/0**. L'export è una tabella leggibile, non un formato di scambio. |
| Ritenuta d'acconto | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | `grep -ci "ritenuta"` e `grep -ci "d'acconto"` su `conti-data.js`, `index.html` e `shared/dw-ponti.js`: **zero, tutti e tre**. `importiFattura` (`conti-data.js`) e `totaliDaRighe` trattano solo imponibile, IVA e totale; `totaliPreventivo`, scritto dopo, non l'ha aggiunta. |
| Foto prodotto | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | Cercati `foto prodotto`, `immagine prodotto`: **zero**. Il termine largo `foto` dà 10 occorrenze in `conti-data.js` e **sono tutte la metafora** «il prezzo si FOTOGRAFA sul documento» (391, 1658, 1669-1670, 1691, 1700, 1953, 3178, 3217, 3359), zero in `index.html`. `prodotti/{id}` porta nome, unità, prezzo, densità, IVA (`prezzoPerTonnellata` 1060, `prezzoPerMetroCubo` 1067) e adesso anche gli scaglioni: nessun campo immagine. |
| Gestione magazzino / giacenze prodotto | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | `grep -ni` su `conti-data.js` e `index.html`: `giacenz` **0**, `magazzin` **0**, `inventario` **0**, `carico/scarico` **0**, `FIFO` **0**. Le uniche 4 occorrenze di `scorta` dicono l'**opposto**: la riconciliazione avverte esplicitamente che un divario positivo «**non è una scorta**» finché non si è controllato che non manchi un rilievo (`index.html:4421-4427`, con la decisione a 4013) e la stima del cumulo sul piazzale è dichiarata tale (1700). *Nota d'ecosistema*: la giacenza esiste in **Flotta**, ma sui ricambi d'officina (`sottoScorta`, `puntoDiRiordino`, `propostaScorte` in `flotta-data.js`), non sul venduto. |
| Gestione permessi / ruoli | **CONFERMATO ASSENTE** *(riconfermato il 03/08)* | Cercati `ruolo`, `ruoli`, `amministratore`, `admin`: **zero in tutt'e due i file**. `permess` dà 4 occorrenze e **nessuna è un modello di ruoli**: due sono la lettura negata dei rilievi di Terra (`conti-data.js:2123` e 2459, «o non hai il permesso di vederli»), due sono il permesso del **browser** per la copia negli appunti (`index.html:4864, 4883`). L'isolamento è **per organizzazione**, non per persona — coerente con quanto già dichiarato in `CLAUDE.md`: dentro l'organizzazione i ruoli sono una **decisione aperta**, non un difetto di `appId`. |

### Riepilogo numerico — Conti *(aggiornato il 03/08)*

| | 01/08 (`f3432f4`) | **03/08 (`ecc65d5`)** |
|---|---|---|
| Righe verificate | 18 | **18** |
| Confermate assenti | 11 | **8** |
| False (c'era già) | 5 | **5** |
| ⏱️ Scadute (vere allora, colmate dopo) | — *(la colonna non esisteva)* | **3** |
| A metà | 2 | **2** |
| **somma degli addendi** | 11+5+2 = **18** ✓ | 8+5+3+2 = **18** ✓ |

Le mancanze confermate **scendono da 11 a 8** in due giorni, e non perché il
metro si sia allentato: le tre righe che se ne vanno hanno tutte il loro commit
accanto. Le false restano cinque — quelle non si muovono, erano sbagliate il
giorno che sono state scritte.

#### ⛔ Le due righe perse dal conto vecchio, e dove sono finite

Il conto in cima ai sei documenti diceva per Conti `18 righe = 9 confermate +
5 false + 0 scadute + 2 a metà`, cioè **16 su 18**: due righe erano uscite
dalle confermate senza entrare da nessun'altra parte. Sono state ritrovate, e
si chiamano **«Preventivi e ordini»** e **«Prezzi dinamici per volume / sconto
quantità»**.

Come sono sparite lo dice `git show f5dab46 -- docs/CONCORRENTI_CONTI.md`, in
tre righe di diff:

```
-> | Conti | 18 | 11 | **5** | 0 | 2 |
+> | Conti | 18 | 9  | **5** | 0 | 2 |
+| Preventivi e ordini | ✅ **COLMATA IL 01/08 — la riga ha fatto il suo lavoro** | …
+| Prezzi dinamici per volume / sconto quantità | ✅ **COLMATA IL 01/08** | …
```

Chi ha scritto quel commit ha fatto **metà** della cosa giusta: ha marcato le
due righe come colmate nel corpo e le ha **tolte** dalle confermate (11 → 9),
ma non le ha **aggiunte** alle scadute, che sono rimaste a `0`. Il riepilogo
qui sotto, intanto, continuava a dire `11`. Cioè lo stesso documento portava
**due conti diversi** — 11 in fondo, 9 in cima — e nessuno dei due era giusto.

Due cose imparate, e valgono per tutti e sei i documenti:
1. **Un verdetto non si scrive solo in prosa.** «✅ COLMATA IL 01/08» è un
   verdetto vero, ma se la parola che il conto sa contare è `SCADUTA` allora
   nel conto quella riga **non esiste**. Adesso le tre righe scadute portano
   `⏱️ **SCADUTA**` in testa alla colonna del verdetto, e la spiegazione dopo.
2. **Spostare una riga è un'operazione con due metà, e la seconda si dimentica.**
   La difesa è aritmetica e costa un secondo: **gli addendi devono sommare al
   totale**. Se non sommano, la riga non è stata cancellata — è caduta in mezzo,
   e va ritrovata invece che sottratta dal totale.

⚠️ **E c'era anche un difetto di forma, corretto qui:** le due righe colmate
erano scritte con **quattro celle** in una tabella a **tre colonne**
(`Funzione | Verdetto | che cosa c'è | com'era stato cercato il 01/08`). In
Markdown la quarta cella **non si vede**: la prova di aver cercato a vuoto —
cioè la sola cosa che rende credibile un «era vero allora» — era invisibile a
chiunque leggesse il documento renderizzato invece del sorgente. Adesso le due
metà stanno nella stessa cella, marcate «Prova che c'è» e «Prova che era vera
il 01/08».

### Le otto mancanze confermate, in ordine di quanto le chiede il fisco

Ordinate per quanto le chiederebbero un **commercialista** o l'**Agenzia delle
Entrate** — non per quanto le citano i concorrenti, che è l'ordine di §3 e
risponde a una domanda diversa.

| # | mancanza | chi la chiede, e perché |
|---|---|---|
| 1 | **Fattura elettronica SDI — file XML e invio** | **Obbligo di legge** (art. 1 D.Lgs 127/2015): fra soggetti residenti la fattura *è* il file XML trasmesso al Sistema di Interscambio, e la carta è un documento di cortesia. È l'unica riga di questo elenco che non è un miglioramento ma un **adempimento**. Conti oggi ha il pezzo anagrafico (`clienti.sdi`) e lo **dichiara** nel piede di stampa, che è il modo onesto di avere un buco; il buco resta. |
| 2 | **Rimanenze / giacenze di piazzale** | Il commercialista le chiede **una volta l'anno e sempre**: le rimanenze finali entrano in bilancio (art. 2424-2426 c.c.) e in cava sono i cumuli sul piazzale. Conti sa dire quanto è stato cavato e quanto venduto, ma **rifiuta di proposito** di chiamare scorta la differenza (`index.html:4421`) — che è la decisione giusta e lascia la domanda senza risposta. |
| 3 | **Export in un tracciato contabile** *(riga «Export contabilità», a metà)* | È la richiesta che un commercialista fa **ogni mese**: non «mandami un CSV leggibile» ma «importamelo nel mio gestionale». Nove export ci sono; un formato di scambio no. |
| 4 | **Ritenuta d'acconto** | Compare nel tracciato della fattura elettronica (`DatiRitenuta`) e la chiede l'Agenzia quando c'è. Per una cava che vende inerti è **rara** — riguarda soprattutto provvigioni e prestazioni professionali — quindi sta sotto le prime tre pur essendo fiscale a pieno titolo. |
| 5 | **Firma digitale / conservazione a norma** | Non la chiede il commercialista mese per mese, ma è ciò che rende opponibile un documento in caso di verifica. Oggi il portale gratuito dell'Agenzia copre la conservazione delle fatture; resta scoperto tutto il resto (DDT, conferme d'ordine). |
| 6 | **Gestione permessi / ruoli** | Nessun fisco la chiede, ma è la prima domanda di un revisore o di un cliente strutturato: *chi* può emettere una nota di credito? Oggi la barriera provata è fra **organizzazioni**, e dentro l'organizzazione è una decisione aperta. |
| 7 | **e-ticketing per DDT** | Operativa, non fiscale: il DDT cartaceo è pienamente valido. Conta per il cliente che riceve venti bolle al giorno, non per l'Agenzia. |
| 8 | **Driver della bilancia** e **foto prodotto** | Fuori dal perimetro fiscale del tutto. Il driver toglie battitura e errori di trascrizione; la foto, su inerti, non la guarda nessuno. |

### La mancanza confermata più importante — Conti *(cambiata il 03/08)*

⏱️ **La precedente era la riconciliazione bancaria, e non lo è più: è stata
costruita il 01/08** (`c02836a`, `abbinaMovimenti` e altre dieci funzioni, con
la sua sezione «Banca» nella pagina). Il paragrafo che stava qui — «l'unico
punto in cui oggi qualcuno deve ridigitare un dato che esiste già altrove… un
sollecito con la mora mandato su una fattura già pagata» — non è stato buttato:
è finito **dentro il prodotto**, come testo introduttivo della sezione nuova
(`index.html:805-809`). Una mancanza che diventa la spiegazione della funzione
che la colma è il ciclo che questo documento esiste per far girare.

**Adesso la più importante è la fattura elettronica SDI**, ed è di una specie
diversa da tutte le altre diciassette righe: non è una funzione che ci
mancherebbe rispetto a un concorrente, è un **obbligo di legge** (art. 1
D.Lgs 127/2015). Un cliente che usasse Conti da solo non sarebbe *meno
attrezzato*: sarebbe **non conforme**, e dovrebbe tenere aperto un secondo
programma per l'unica cosa che il fisco considera la fattura.

⚠️ E va detto per intero, se no si esagera la mancanza: il pezzo che manca è
**il file e il canale**, non i dati. L'imponibile, l'aliquota, l'IVA, il
totale, il codice destinatario o la PEC del cliente, la causale del trasporto,
i DDT collegati e — dal 01/08 — la nota di credito col suo comma dell'art. 26
DPR 633/1972 sono tutti già in Conti, ed è **la parte difficile**. Quello che
non c'è è il serializzatore verso il tracciato `FatturaPA` e la trasmissione.
Con l'invio gratuito dal portale **Fatture e Corrispettivi** — che la pagina
già indica al cliente (`index.html:3947-3948`) — la strada più corta è
**generare l'XML e lasciarlo caricare a mano**, cioè la stessa forma con cui il
01/08 è entrato l'estratto conto della banca: un file dentro, un file fuori,
nessuna integrazione da mantenere e nessuna spesa — che è anche l'unica forma
compatibile con la regola «nessuna spesa prima della commercializzazione».

---

### ⏱️ Riverifica del 06/08 — `ecc65d5` → `b12c87f`, undici commit dopo

Le **otto** righe CONFERMATE ASSENTI rimisurate contro il codice di oggi.
**Reggono tutte e otto**, e tre di esse solo perché il campione è stato
**aperto** invece che contato: il conteggio secco avrebbe fatto scrivere il
contrario su tre righe su otto.

```
fatturapa|xml|sdi      →  27 occorrenze   ⚠️ da aprire
bilancia|driver|…      →  10 occorrenze   ⚠️ da aprire
permess|ruolo utente   →   4 occorrenze   ⚠️ da aprire
firma digital · e-ticket · ritenuta · foto prodotto · giacenz|magazzin  →  0
```

- **`sdi` / `xml`** — è il **codice destinatario** del cliente, un campo
  dell'anagrafica (`sdi: "ABC1234"`, `sdi: "…@pec.example.it"`), più un
  `image/svg+xml` dentro l'icona del manifest. Non c'è nessun generatore di
  XML né nessun invio: la riga regge, e il foglio stampato lo dice pure
  all'utente («non sostituisce la fattura elettronica: l'originale è il file
  XML trasmesso al Sistema di Interscambio»);
- **`bilancia`** — dieci **commenti** che spiegano un fatto del mestiere («le
  tonnellate le pesa la bilancia, i metri cubi no: non si inventano»). Non è un
  driver hardware, è la ragione per cui una conversione non si fa;
- **`permess`** — il verbo *permettere* («se la lettura non è permessa», «il
  browser non ha permesso la copia automatica»). Non è un sistema di permessi.

⚠️ **E dentro questa stessa riverifica il cercatore ha sbagliato una seconda
volta**, in modo nuovo: il comando che apriva il contesto usava una finestra di
50 caratteri prima e 45 dopo, e su `bilancia` e `permess` ha risposto **niente**
— su termini che avevano dieci e quattro occorrenze. Le righe erano più corte
della finestra. Un «nessun risultato» che significa «la mia finestra non ci
stava», letto di fretta, è **la stessa bugia** del conteggio non aperto, presa
dall'altro lato. Rifatto con `grep -n` per riga.
