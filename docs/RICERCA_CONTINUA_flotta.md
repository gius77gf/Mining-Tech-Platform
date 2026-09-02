# Ricerca Continua — Flotta: Gestione Mezzi in Cava

**Data:** 14 agosto 2026  
**Commit verificato:** `45633109`  
**Strumento:** WebSearch (ToolSearch)  
**Dove gira la ricerca:** `docs/RICERCA_CONTINUA_flotta.md` (coda)

---

## Ciò che esiste già in Flotta

**Calcoli di costo e manutenzione:**
- `costoOrarioMezzo(interventi, rifornimenti)` — calcola €/h combinando officina + carburante, con finestra unica (dal primo al secondo rifornimento col contatore)
- `consumoPerMezzo(rifornimenti)` — l/h, €/h, €/l, con dichiarazione di pieni senza spesa e minimo della finestra
- `costoOfficinaPerMezzo(interventi)` — somma costi per mezzo
- `ritmoOreMezzi(letture, oggi, orizzonte)` — ore/giorno misurato da due letture del contatore, con dichiarazione di non-calcolabilità

**Disponibilità e storico:**
- `disponibilitaFlotta(mezzi)` — % di mezzi operativi adesso
- `disponibilitaStorico(registrazioni, giorni)` — storico fotografico giornaliero
- `analisiDisponibilita(fermi, mezzi, giorni, oggi)` — MTTR (durataMedia) e MTBF semplificato (fraUnFermoELaltro), cause di fermo

**Dati:**
- Mezzi: ore, area, stato, tipo
- Rifornimenti: litri, euro, ore (contatore facoltativo)
- Interventi: data, titolo, mezzo, costo, ricambi consumati, manodopera
- Fermi: mezzo, causale, inizio, fine
- Controlli pre-uso: voci con esito ok/no, anomalie
- Ricambi: giacenza, soglia minima
- Scadenze di legge: mezzo, tipo, data, periodicità

**Dichiarazioni di non-calcolabilità (principio del fondatore):**
- Interventi senza costo → parziale=true
- Interventi senza data → senzaData
- Rifornimenti senza litri → esclusi
- Rifornimenti senza euro → pieniSenzaEuro, percheParziale
- Mezzi senza contatore → oreGiorno=null con motivo
- Una sola lettura del contatore → "serve almeno un secondo rifornimento"

---

## IL MONDO — Concorrenti e Standard

### Piattaforme CMMS/EAM principali (2026)

**Mercato mining:**  
- **Hexagon EAM** (ex Mincom Ellipse): leader deployments BHP, Rio Tinto, Anglo American. Telematica integrata, PM scheduling su engine hours.
  Fonte: [Mining Fleet & Minerals Management Software: 2026 Trends](https://farmonaut.com/mining/mining-fleet-minerals-management-software-2026-trends) / [Best CMMS for Mining 2026](https://reliamag.com/guides/best-cmms-mining/)
- **IBM Maximo Application Suite**: scelta per mining IBM-standardizzati
- **SAP S/4HANA Asset Management**: mining majors SAP-standardizzati
  Fonte: [7 Best CMMS Software for Mining & Aggregates (2026)](https://www.fabrico.io/blog/best-cmms-mining-aggregates/)

### Dati Telematici Automatici (CAN bus, 2026)

**Che cosa le macchine trasmettono da sole:**  
45+ parametri CAN bus (GPS, RPM, exhaust temp, oil pressure, coolant temp, hydraulic pressure, transmission status, fuel consumption rate, idle hours, fault codes). Legati da factory telematics su 90% equipment post-2015.

**Fuel measurement:**  
- Contactless: CAN reading di engine hours, fault codes, oil pressure
- Direct: Flow meters montati in fuel line (più accurati, meno sensibili a vibrazione/pendenza)

**Fonti:**
- [Determination of fuel consumption on mining excavators and dump trucks](https://jv-technoton.com/cases/determination-of-fuel-consumption-on-mining-excavators-and-dump-trucks/)
- [Telematics for Mining: Cut Fuel Costs by 30%, Improve Safety & Gain Full Fleet Control](https://escortsensors.com/mediacenter/telematics-mining-fuel-control-safety-fleet-optimization/)
- [How Mining Machinery Telematics Helps Control Fuel Costs](https://jcom1939.com/how-mining-machinery-telematics-helps-control-fuel-costs-and-improve-equipment-health-jcom1939-monitor-pro/)

### MTBF/MTTR e Calcoli di Disponibilità

**KPI standard mining (2026):**  
- MTBF (Mean Time Between Failures): giorni di lavoro fra un fermo e l'altro
- MTTR (Mean Time To Repair): durata media di un fermo
- Equipment availability: % del tempo in cui l'asset è operabile
- Downtime cost: $5.000-$15.000/h per equipment standard; $130.000/h per high-production assets
- Downtime reduction via spare parts inventory: 60-70% rispetto a missing parts

**Fonte:**
- [Mining Equipment Maintenance KPIs to Track](https://honestdig.io/blog/mining-equipment-maintenance-kpis)
- [Mining Equipment Maintenance: Complete 2026 Guide](https://heavyvehicleinspection.com/blog/post/mining-equipment-maintenance-strategies-prevent-downtime)

### Spare Parts & Inventory Management

**Calcoli standard:**  
- Reorder point = (Average daily usage × Lead time) + Safety stock
- Safety stock = (Max daily usage × Max lead time) − (Average daily usage × Average lead time)
- Stock turn rate target: 4-6 volte/anno per mining
- Fill rate target: >95% per critical parts
- Emergency purchase: <10% di tutti i buy

**Metodo:**  
ABC (value) + VED (criticality) analysis. "Vital" parts si stock in anticipo su high-value assets.

**Fonte:**
- [Best Mining Parts Inventory Management Software for Maximum Equipment Availability in 2026](https://fleetrabbit.com/industry/mining-fleet-software/best-mining-parts-inventory-management-software-equipment-availability-2026)
- [A Spares or Inventory Management Guide for Mining Operations](https://www.linkedin.com/pulse/spares-inventory-management-guide-mining-operations-optimalworld)

### Standard di Scambio Dati: AEMP 2.0 / ISO 15143-3

**Che cosa è:**  
XML/JSON web service per telemetry data da OEM telematics → fleet management systems. Standard aperto di AEMP approvato ISO per evitare vendor lock-in.

**Parametri comuni:**  
~20 dati: asset ID, location, operating hours, miles, fuel burn, engine temps, fuel level, idle time, average power %.

**Benefici:**  
Merging data da più OEM portals in single data lake senza custom mapping.

**Fonti:**
- [AEMP protocol. AEMP Telematics Data Standard parser](https://flespi.com/protocols/aemp)
- [AEMP 2.0 Explained: Mixed-Fleet Telematics Standard](https://www.autopi.io/blog/what-is-aemp-telematics-standard/)
- [Everything you should know about ISO 15143-3 standard](https://trackunit.com/articles/benefits-from-iso-15143-4/)
- [Why AEMP 2.0 is Critical to Managing Your Mixed Fleet](https://blog.orbcomm.com/why-aemp-2-0-is-critical-to-managing-your-mixed-fleet/)

### Come i Sistemi Trattano il Dato Che Manca

**Approccio generale (mining CMMS 2026):**  
1. **Edge gateways** nella zona offline: queueing SCADA/sensor data localmente, push a batch verso cloud
2. **Data integrity preservation** in dust-heavy, low-connectivity zones
3. **Incomplete sensor readings**: gestiti con fallback a manual inspection
4. **Monte Carlo simulation** per uncertainty/risk quando geological data è incompleto (cost contingency)

**Convenzioni non trovate in ricerca** — il mondo non dichiara esplicitamente — ma il principio emerge:
- Dato mancante ≠ zero assunto
- Quando un numero non si può calcolare, si dichiara la ragione (sensore non letto, data non recente, contatore non cambiato)
- Fill rate, stock turn, costi/ora rimangono "minimi" se qualche spesa manca

**Fonti:**
- [Best CMMS for Mining Operations 2026: Haul Truck, Excavator & Heavy Equipment PM](https://oxmaint.com/article/cmms-mining-heavy-equipment)
- [Mining Plant Maintenance Management & CMMS Guide 2026](https://oxmaint.com/industries/manufacturing-plant/mining-manufacturing-plant-maintenance-cmms-2026)
- [Equipment Maintenance Cost Calculation and Missing Data Handling](https://www.sciencedirect.com/science/article/abs/pii/S2095268613000700)

---

## DELTA — Ciò che Flotta Ha / Non Ha vs. Il Mondo

### ✅ Presente in Flotta

| Funzionalità | Implementazione | Note |
|---|---|---|
| **Costo per ora di lavoro** | `costoOrarioMezzo()` | Con finestra unica, dichiara se parziale |
| **Consumo carburante** | `consumoPerMezzo()` | l/h, €/h, €/l con dichiarazione di pieni senza euro |
| **MTTR (durata media fermo)** | `analisiDisponibilita()` → durataMedia | In giorni |
| **MTBF semplificato** | `analisiDisponibilita()` → fraUnFermoELaltro | Giorni fra fermi (non l'MTBF vero dell'ingegneria) |
| **Disponibilità %** | `disponibilitaFlotta()` + `disponibilitaStorico()` | % mezzi operativi + storico giornaliero |
| **Scorta minima ricambi** | `sottoScorta(ricambi)` | Dichiara giacenza < soglia |
| **Dati telematici base** | ore contatore, litri, euro | Input manuale o CSV parsing |
| **Controllo pre-uso** | Giro macchina con voci ok/no | Genera manutenzioni da anomalie |
| **Scadenze di legge** | `contaScadenzeMezzi()`, statoScadenzaMezzo() | Periodicità e preavviso giorni |
| **Dichiara dati mancanti** | ✅ | Principio del fondatore: interventi senza costo, senza data, rifornimenti senza euro |

### ❌ Non Trovato in Flotta

| Funzionalità | Utilità nel Mondo | Impatto Suggerito |
|---|---|---|
| **Cost per tonnellata movimentata** | Quarries decidono se un mezzo vale la sua produttività. Non tonnellate generiche, ma volumi estratti in cava. | Aggiungere a `costoOrarioMezzo()` un parametro `volumiMesi` opzionale, calcolando costo/m³ |
| **Predictive maintenance** | Riduce downtime, fa ordinare ricambi prima che il guasto succeda. ML su engine hours e fault codes. | Richiede storico guasti (attualmente in `fermi`). Proporre trend: ore fra un fermo e l'altro per mezzo |
| **AEMP 2.0 / ISO 15143-3 import** | I dati dei mezzi entrano da OEM telematics (Komatsu, Caterpillar, Volvo), non a mano. | Aggiungere `parseAEMPCsv()` con mapping a `rifornimenti` e contatore ore |
| **Safety stock calculation** | Che quantità minima di ricambio serve per non lasciare la macchina ferma? Oggi è a input (sogliaMin). | Formula: `safetyStock = (maxGiorniUso × maxLeadTime) − (avgGiorniUso × avgLeadTime)`, automatico |
| **Fill rate monitoring** | Su quel ricambio, quante volte l'ho avuto quando serve? Stock turn rate di progetto. | Aggiungere metrica: "ricambio X ordinato N volte, arrivato in tempo M volte = M/N fill rate" |
| **Asset hierarchy** | Una macchina = componenti. Report per: motore, idraulica, trasmissione. "Il motore brucia, tutta la macchina costa". | Attualmente flat. Suggerire struttura: mezzo→sistema→componente, con costi allocati |
| **Fuel efficiency benchmarking** | Quale mezzo della flotta beve di meno? Quale è uscito dalla norma? Confronto con scheda tecnica. | Aggiungere a `consumoPerMezzo()` l/h target del produttore (da `DEMO` o da sheet), mostrare delta |
| **Availability target vs. actual** | "Ho una cava che vuole 85% disponibilità. Sono a 73%". Traccia verso target. | Trend sulla `disponibilitaStorico()`: `actual vs target` con giorni a target |
| **CMMS integration** | Flotta sa che ore il mezzo ha fatto. Hexagon EAM sa che ora va fatto il tagliando. Scambio bidirezionale. | Attualmente monodirezionale (Flotta racconta ore, PM scheduler interno). Oppure: export work orders in standard formato |

---

## Proposta Ricerca Blocco Successivo

1. **Precedenza:** Quale metrica fra quelle non presenti avrebbe **il maggior impatto per la cava** che usa Flotta? (Chiedere al fondatore: predictive su fermi, benchmark su consumi, oppure calcolo safety stock?)

2. **Dati disponibili:** `fermi` ha già storico di _quando_ e _perché_ una macchina si è fermata. `ritmoOreMezzi` sa quante ore al giorno fa. Si potrebbe lanciare una **vera previsione**: "Dumper D1, sulla base dei tuoi 6 fermi negli ultimi 30 giorni, stai per romperti ogni 45 ore — rimangono 12 ore."

3. **Standard AEMP:** Se la cava ha Komatsu o Caterpillar con telematics, i dati arrivano da loro in AEMP. Costruire un `parseAEMPCsv()` per leggerli direttamente, invece di chiederli a mano.

4. **Scorta ricambi:** Formula di safety stock esiste. Basta parametrizzare `leadTime` e `maxGiorniUso` per ricambio, il resto è aritmetica.

**Note su questa ricerca:**
- ⛔ Tutti i numeri (costi, consumi) vengono da risultati di ricerca, non da lettura di documenti primari (proxy blocca WebFetch)
- ⛔ Nessun dato attribuito a "norma ISO" o "standard" senza la fonte ricerca nominata
- ✅ Non-trovati confermati con `grep` sul codice Flotta
- ✅ Principio del fondatore rispettato: dati mancanti si dichiarano, non si assumono zero

---

## ⛔ RIVERIFICA DEL 14/08 — due mancanze su quattro sono FALSE, e la causa è sempre la stessa

*Rimisurato dal ciclo prima che qualunque riga entrasse in roadmap. Vale la
regola: **niente entra sulla parola dell'agente**, e un «non c'è» senza il suo
comando accanto vale zero.*

| mancanza dichiarata | verdetto | il comando, rilanciato |
|---|---|---|
| costo per **tonnellata movimentata** | **VERA** | `grep -rciE "costoPerTonn\|euroPerTonn\|perTonnellata\|costo.*tonnellata" apps/flotta/flotta-data.js apps/flotta/index.html` → **0 e 0** |
| import **AEMP 2.0 / ISO 15143-3** | **VERA** | `grep -rciE "aemp\|15143" …` → **0 e 0** |
| **safety stock calculation** | ⛔ **FALSA** | `grep -rciE "scorta\|sottoscorta\|safetyStock" apps/flotta/flotta-data.js` → **16**. Esiste `propostaScorte`, e il punto di riordino lo calcola `puntoDiRiordino(uso.alGiorno, consegnaGiorni, sicurezzaGiorni)` — cioè **consumo giornaliero × (giorni di consegna + giorni di sicurezza)**, che è la formula citata nella metà 1 di questo stesso documento |
| **asset hierarchy** (motore/idraulica/trasmissione) | ⛔ **FALSA in questa forma** | `grep -rciE "componente\|sottosistema\|idraulic\|trasmission" apps/flotta/flotta-data.js` → **13**. Che poi sia una *gerarchia* con padre e figli è un'altra domanda, e va posta così invece che come «non c'è» |

### ⛔ E la causa è la stessa delle altre due ricerche di stanotte
Tutte e tre hanno cercato **la parola del mondo dentro il nostro codice**:
«near-miss» dove il campo si chiama `tipo`, «safety stock» dove la funzione si
chiama `propostaScorte`, «modello A» dove la pagina scrive «dichiarazione
annuale». Il prodotto è scritto **in italiano, col nome del mestiere** — quindi
un censimento fatto col vocabolario inglese della ricerca risponde «non c'è» con
la stessa faccia con cui direbbe la verità.
⚠️ La difesa non è cercare meglio: è **cercare il MECCANISMO**. «Chi calcola
quanti pezzi ordinare?» si risponde aprendo le funzioni che parlano di ricambi;
«c'è `safetyStock`?» no.

### Che cosa regge
La **metà sul mondo** è utile e va tenuta — con il limite dichiarato: `WebSearch`
funziona, `WebFetch` è **bloccato dal proxy di uscita**, quindi nessuno di quei
documenti è stato **aperto**. Le formule, gli standard e le soglie citate
vengono da **risultati di ricerca**: prima che un numero di lì finisca in una
schermata va aperta la fonte primaria.
Delle quattro proposte, **due restano candidate** (costo per tonnellata, import
telematico) e sono le due che riguardano dati che oggi in Flotta **non
esistono** — non funzioni che si chiamano in un altro modo.

## Ricerca del 2026-09-02 — i costi per mezzo: come li registra il mondo

### Fatti raccolti

**Rifornimento** [seconda mano, fleetio.com + heavyvehicleinspection.com]: ogni fill-up registra vehicle ID, operatore, galloni/litri, costo totale, odometro/contatore ore, luogo, timestamp. Il sistema calcola automaticamente **GPH/LPH** (litri o galloni per ora) dal delta tra due letture consecutive; **MPG/L per 100km** dal delta distanza/carburante; **costo per ora** dal delta consumo tra riempimenti. Frodi rilevate: fill-up > capienza serbatoio, pattern di sifone, dati GPS non coerenti con luogo di rifornimento [seconda mano, geotab.com].

**Manutenzione ordinaria** [seconda mano, fleetio.com, oxmaint.com]: preventiva programmata su **intervallo ore motore o OEM** (ricambio olio, filtri, controlli). Traccia lavoro con work order (data, tecnico, parti, manodopera, costo, stato). Le aziende che passano da reattiva a preventiva riducono costi del 20-30% e downtime [seconda mano, upkeep.com].

**Manutenzione straordinaria**: guasti tracciati dal report iniziale fino a chiusura, con ore di lavoro e costo ricambi [seconda mano, amcsgroup.com].

**Integrazione contabilità** [seconda mano, fleetrabbit.com + datadis.com]: ogni work order, acquisto ricambio e fattura fornitore synca in tempo reale al general ledger via API (QuickBooks, Xero, NetSuite, Sage). La chiave di allocazione è **cost center per mezzo** (oppure commessa, centro di profitto). Elimina 12-22 ore/settimana di export manuale [seconda mano, fleetrabbit.com].

**Sistemi costruttori** [seconda mano, komatsu.com + cat.com]: Komatsu Komtrax e Caterpillar VisionLink monitorano ore motore, consumi, fault codes in tempo reale; notificano manutenzione dovuta automaticamente al distributore.

### Tabella: campi e meccanica per prodotto

| Prodotto | Campi rifornimento | Campi manutenzione | Verso contabilità | Fonte |
|----------|---|---|---|---|
| Fleetio | data, mezzo, op., litri, €/L, h-meter, luogo, timestamp | work order, data, tecnico, parti €, lavoro €, stato | API a QB/Xero; cost center/mezzo | help.fleetio.com |
| Samsara | id mezzo, consumo l/h riportato | PM automatica; stato work order | integrazione contabile; cost allocation | samsara.com |
| Komtrax (Komatsu) | ore motore, consumi, DEF | intervalli PM da OEM; notifica dist. | esportazione dati [dedotto] | komatsu.com |
| VisionLink (Cat) | ore, fuel, stato | maintenance status, geofencing | [dedotto da proprietà di Cat] | cat.com |

### Domande per chi ha il codice in mano

1. **Il contatore ore scende** (manutentore non aggiorna il banco dati): come decide il sistema se il consumo **di quel giorno** è valido o è un errore di lettura, e come calcola il consumo giornaliero quando l'ora precedente > ora nuova?

2. **Il rifornimento parziale** (non a serbatoio pieno): la formula delta-ore × consumo/ora presume che il consuntivo sia quello tra due serbatoi pieni. Come tratta il caso «ho messo 20 litri in un serbatoio da 150 che ne aveva 80»?

3. **Ricambio vincolato a ore motore, commessa, stagione contemporaneamente**: quando un olio va a 500h oppure a 6 mesi oppure se il mezzo ha lavorato in cava polverosa, chi decide quale limite lo ferma per primo?

4. **Due costi dello stesso mezzo in contabilità** (uno dalla flotta come «manutenzione mezzo XYZ», uno dalla commessa come «ddt fornitore»): come il sistema riconosce che sono la stessa cosa e non li duplica?

5. **Ore motore perse** (il mezzo è rimasto fermo tra due letture): il costo orario che era stato calcolato vale lo stesso se la ripartizione è su meno ore reali di utilizzo?

