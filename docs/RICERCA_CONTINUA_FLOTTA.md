# Flotta — ricerca continua di miglioramenti (agosto 2026)

Ricerca approssimativa di candidati di miglioramento. Una scheda per ogni pista da approfondire dopo.

## Che cosa esiste già

Flotta copre oggi:
- **F6. Scadenze di legge del mezzo** (verifica periodica, funi/catene, revisione, assicurazione, ecc. con semaforo e ricorrenza)
- **L1. Fascicolo del mezzo** (scheda unica con dati, ore, scadenze, interventi, costi)
- **L2. Giro macchina** (controllo pre-uso con checklist per tipo, anomalie che diventano manutenzioni)
- **L3. Piani ricorrenti** (tagliandi che si rigenerano da soli a +ore o +mesi)
- **L4. Carburante per mezzo** (rifornimenti con consumo litri/ora e euro/ora)
- **L5. Ordine di lavoro** (stati: da-fare / in-corso / attesa-ricambi, manodopera con ore e tariffa, ricambi consumati, costo calcolato)
- **L6. Fermi macchina** (episodi con causale, inizio, fine, durata)
- **L7. Punto di riordino ricambi** (soglia calcolata da consumo al giorno × (giorni consegna + margine), con dichiarazione di affidabilità)
- **L8. Segnalazione guasto rapida** (da macchina, tre livelli di gravità)
- **Disponibilità flotta** (% di mezzi operativi con fotografia giornaliera)
- **Priorità operative** (lista ordinata: scadenze di legge, manutenzioni urgenti, ricambi sotto scorta, mezzi fermi/in verifica)

Tutte le funzioni pure sono nel modulo `flotta-data.js`; hanno test in `apps/deepwork-id/tests/run-kpi.mjs` (copertura 65/71 funzioni).

---

## Candidati di miglioramento

> ⏱️ **QUANTE DI QUESTE RIGHE SONO STATE RIVERIFICATE, E QUANTE NO.** L'08/08
> ne è stata riaperta **una su undici** — «Carburante: il rifornimento senza
> data si salva in silenzio» — ed **era scaduta**: corretta il 03/08.
> Le altre **dieci non sono state riverificate**, e questa riga esiste per non
> lasciar credere il contrario: un elenco di mancanze che nessuno ricontrolla
> manda a lavorare dove non serve, che è l'unico modo di sprecare una
> giornata intera. Chi ne apre una, la aggiorna qui come è stato fatto con
> quella — con **la prova**, non con una data incollata.

| schermata | che cosa non va | come si vede | quanto costa | come si misura |
|---|---|---|---|---|
| **Quadro** | Il badge "Tagliandi 30gg" conta righe, non giorni di gap prima della scadenza: un tagliando a 60h con contatore a 5950 h conta quanto uno a 10h, perché entrambi rientrano nella "finestra di 30 giorni" di stima. La finestra è un'ipotesi, non una misura. | Numero grosso nel KPI in alto; toccando riporta alla lista filtrante. Se il numero è "3" non si sa se mancano 3 giorni o se 3 tagliandi cadono nella prossima settimana di stima. | piccolo | Leggere il codice di `tagliandiInScadenza()` (`flotta-data.js` riga ~640) e misurare su due mezzi uno con velocità nota e uno senza contatore: il numero deve uguagliare quelli scritti nel quadro senza approssimazioni. |
| **Manutenzioni** | Quando una manutenzione passa da "da-fare" a "in-corso" e torna a "da-fare" (l'officina ha deciso di aspettare), l'ordine di lavoro perde la storia: ore e ricambi già scritti si buttano via. Non c'è "sospeso". | Form aperto, cambio stato, torno indietro: i campi si puliscono. Nessun messaggio che dica "hai cambiato idea, i dati scritti andranno persi". | piccolo | Compilare un ordine (ore, ricambi, note), cambiar stato tre volte fra "in-corso" e "da-fare", e verificare leggendo i dati che restino solo i campi dello stato finale. |
| **Carburante** | ⏱️ **RIGA SCADUTA — verificata e chiusa l'08/08.** Era vera quando fu scritta; il difetto è stato corretto il **03/08**, e il commento accanto alla correzione racconta proprio questo caso: «con la sola forma, un rifornimento datato *30 febbraio* si salvava». Oggi `validaRifornimento` (flotta-data.js) chiude con `if (!dataISOEsiste(iso)) errori.data = "Serve il giorno del rifornimento."`, e la pagina quell'errore lo **mostra**: `err("rif-data", …)`, `esito(…, "err")` e il fuoco che torna sul campo. Non si salva più in silenzio, e non scrive `null`. *(Sotto, il testo originale, tenuto per capire che cosa fu misurato.)* Quando un rifornimento viene aggiunto senza data (campo richiesto), ma il form lo accetta in silenzio e scrive null, l'app poi non lo conta nel consumo (che richiede la data). Il messaggio di "campo obbligatorio" non appare. | Si compila il form "Rifornimento", si lascia vuoto il campo data, si tocca "Salva" → nulla accade, nessun cartellone rosso di errore. Ricaricando, il rifornimento è stato salvato comunque, con data null. | piccolo | Provare a salvare un rifornimento senza data col tasto Tab e non toccando il calendario. |
| **Grafico disponibilità** | I giorni senza registrazione (chi non ha aperto l'app) restano buchi nel grafico, ed è onesto — ma il bordo destro del grafico mostra fino a "oggi", facendo sembrare che il valore di tre giorni fa sia il valore di adesso. | Apri la pagina del Quadro il lunedì dopo un weekend senza aperture: il grafico mostra il venerdì, poi buco da sabato a domenica, poi il lunedì. Occhio al lettore: il martedì il lunedì diventa "ieri" e la posizione dice un valore vecchio di due giorni come se fosse nuovo. | piccolo | Leggere il tooltip del punto più a destra; deve dire qual è la data vera (non "oggi" se è relativo). |
| **Scadenze di legge** | Quando una scadenza è marcata "scaduta", ma l'utente non ha messo la "ultimaData" della verifica (quando è stato fatto l'ultimo controllo), il fascicolo del mezzo non sa se la macchina aspetta una verifica **vera** (obbligatoria per legge) o se è solo un promemoria non completato. | Quadro → clicca su una scadenza rossa di "Gru su autocarro" → fascicolo mezzo. Se il campo "Ultima verifica" è vuoto e il campo "Data scadenza" è nel rosso, non si sa se ispezionare la macchina o se è già verificata. | piccolo | Aprire il fascicolo di un mezzo con una scadenza in rosso ma senza "ultimaData" e verificare quale informazione viene mostrata all'ispettore che chiama. |
| **Filtri e ordinamenti** | Nella lista delle manutenzioni, il filtro "da fare / in lavorazione / chiuse" non ha un ordinamento dichiarato (che sia urgenza, data, mezzo). L'ordine sembra casuale fra le manutenzioni di uno stesso stato. | Lista manutenzioni del Quadro, tutte "da fare", niente di apparentemente più urgente. Scorrendo, il Tagliando a 50h è sotto il Tagliando a 5000h, che suggerisce nessun ordinamento di urgenza. | piccolo | Toccare il filtro "Da fare" nella lista delle manutenzioni e annotare l'ordine dei titoli; riaprir Flotta il giorno dopo e verificare se l'ordine cambia. |
| **Costo totale per mezzo** | Il fascicolo mostra "speso" (officina + carburante) ma non divide per ore lavorate per dare "costo orario". La proposta #7 della ricerca (~riga 202 di RICERCA_FLOTTA_202607.md) resta non implementata. | Fascicolo di un mezzo: c'è il numero totale di euro spesi, ma niente che dica "questa macchina mi costa €45 all'ora" — il numero decisionale che risponde a "conviene tenerla?". | piccolo | Confrontare il "speso" sul fascicolo con la somma di officina dal grafico + consumo da rifornimenti, e verificare il calcolo dell'ora media (speso ÷ ore lavorate o ore contatore). |
| **Ricambi senza prezzo** | Un ricambio consumato in officina senza prezzo noto entra nell'ordine e il costo totale lo dichiara ("ricambi: 1 pezzo a prezzo sconosciuto"), ma nell'export CSV e nel fascicolo quel numero di pezzi sparisce dal conteggio perché non ha prezzo: due conteggi diversi dello stesso consumo. | Apri un ordine di lavoro, aggiungi un ricambio senza prezzo nel campo "Nome pezzo", salva. Leggi il costo totale (dice "sconosciuto"), poi esporta il fascicolo → il conteggio dei pezzi consumati non lo cuenta. | piccolo | Aggiungere un ricambio senza prezzo, calcolare il costo visualizzato, poi esportare il fascicolo e contare i pezzi nella riga del fascicolo. |
| **Controllo pre-uso: anomalie multiple** | Se la stessa voce di sicurezza (es. "Freni") viene marcata "non va" due volte nello stesso giorno (giro mattina + giro pomeriggio), il conteggio della riga "anomalie" del Quadro la conta due volte, raddoppiando il numero di "cose da fare" sui fermi di sicurezza. | Fai due giri diversi lo stesso giorno sullo stesso mezzo, marca "Freni non va" in entrambi → il fascicolo dice "2 anomalie", non "1 anomalia ripetuta". | piccolo | Fare due controlli pre-uso lo stesso giorno sullo stesso mezzo con la stessa voce marcata "no" in entrambi, e contare le righe di manutenzione aperte: devono essere 1, non 2. |
| **Colonna di provenienza nelle manutenzioni** | Nel registro interventi chiusi, il fascicolo non mostra da dove nasce ogni ordine (se da "giro macchina", "guasto" segnalato, o "piano" ricorrente). La nota interna lo dice, ma non è una colonna. | Fascicolo → interventi chiusi: l'elenco non ha un'indicazione visiva che distingua il tagliando programmato da quello scoperto dal giro macchina. Un ispettore che guarda il registro non sa quanti interventi erano noti in anticipo. | piccolo | Leggere la `nota` del primo intervento in fascicolo e verificare se contiene "giro macchina", "guasto", o "piano", senza guardar fuori il testo. |

---

## Commenti

**Nessun TO-DO trovato nel codice**: il progetto non usa segnalatori di lavoro rimandato.

**La regola del null**: il modulo distingue molto bene "non lo so" da "zero" (es. ore motore `null` vs ore motore `0`), e la usa coerentemente. È una forza: i numeri che escono dal modulo sono onesti.

**La ricerca iniziale non è stagnante**: i candidati qui non sono "le cose che la ricerca aveva detto e non sono ancora fatte", ma nuovi spunti trovati leggendo il codice vivo (ordinamenti, esportazioni, conteggi duplicati).


---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_FLOTTA.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

# Ricerca Continua — Flotta: Gestione Mezzi in Cava

**Data:** 14 agosto 2026  
**Commit verificato:** `45633109`  
**Strumento:** WebSearch (ToolSearch)  
**Dove gira la ricerca:** `docs/RICERCA_CONTINUA_FLOTTA.md` (coda)

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


## Ricerca del 2026-09-02 — manutenzione preventiva e carburante dei mezzi

### Che cosa esiste già da noi
Non verificato da questa ricerca: il delta lo fa chi ha il codice.

### Intervalli di manutenzione programmata
I costruttori (Volvo, Komatsu, Caterpillar) usano intervalli **additivi** a 250/500/1000/2000 ore [seconda mano: heavyvehicleinspection.com]. Caterpillar cita 1.000 ore per estensione OEM con lubrificanti e monitoraggio S·O·S [seconda mano: cat.com]. Komatsu Komtrax pubblica milestone collegate al telematics [seconda mano: heavyvehicleinspection.com].

### Consumi tipici e tolleranze
Pale gommate medie: 22–45 L/h [seconda mano: taopparts.com]. Escavatori: 15–20 L/h [seconda mano: quarryandconstructionweb.it]. A regime minimo (40% throttle): 3,7 L/h [seconda mano: taopparts.com]. Sistemi SCC (sincronizzazione consumo carburante) rilevano anomalie quando lo scostamento supera soglia configurata tra entrate/uscite/livello sonda [seconda mano: controllogasolio.it]. Tolleranza di olio motore: fino a 1 L ogni 1.000–2.000 km in casi estremi [seconda mano: inforicambi.it].

### Disponibilità (Availability)
Formula: A = uptime/(uptime+downtime) oppure A = MTBF/(MTBF+MTTR) [seconda mano: fleetrabbit.com]. Medie di settore: 85–95% per flotte curate; MTBF tipico 400–600 h per escavatori; compliance PM > 85% è il principale leva su disponibilità [seconda mano: heavyvehicleinspection.com].

### Registro manutenzione — D.Lgs 81/2008 art. 71
Obbligo: scariche scritte dei controlli iniziale, periodico, straordinario (risultati su carta, ultimi 3 anni a disposizione); registro aggiornato; conferma permanenza requisiti di sicurezza nel tempo [seconda mano: edafos.it, certifico.com, tussl.it].

### Prodotti e funzioni
| Prodotto | Manutenzione preventiva | Controllo carburante | Fonte |
|---|---|---|---|
| Komatsu Komtrax | Intervalli PM da OEM; ore motore, fault codes in tempo reale | Consumi e caution alerts [dedotto] | komatsu.com |
| Cat VisionLink | PM scheduling su ore; reporting per macchina | [dedotto] | zieglercat.com |
| Volvo CareTrack | Gestione remota PM | [dedotto] | [di riferimento] |
| Trackunit | Utilization in tempo reale; service scheduling | Fuel monitoring integrato | trackunit.com |
| Samsara | Diagnostica motore, ELD | Fuel/energy monitoring | samsara.com |
| Fleetio | Scheduling; integrazione multi-OEM | DVIR con Samsara; integrazione telematica | fleetio.com |

### Domande per il delta
1. Chi decide **quando scade** un tagliando: le ore motore, il calendario, il consumo rilevato, il tipo di suolo (polveroso)?
2. Il consumo misurato su **delta ore** — come si tratta se l'operatore dimentica il registro fra due riempimenti?
3. **Tolleranza di consumo anomalo** — Flotta distingue perdita (graduale) da furto (improvviso) o accumula solo il delta?
4. **Motore a regime minimo** — se un mezzo staziona per ore, il consumo di 3,7 L/h entra nel budget ore lavoro o ha una voce sua?
5. **Disponibilità calcolata** — usa MTBF del costruttore o MTBF misurato su questa flotta?

### Fonti
- [https://heavyvehicleinspection.com/blog/post/volvo-construction-equipment-maintenance-schedule](seconda mano)
- [https://www.cat.com/it_IT/products/new/equipment/excavators/](seconda mano)
- [https://www.taopparts.com/blog/en/fuel-consumption-on-wheel-loaders-excavators-bulldozers-dumpers](seconda mano)
- [https://fleetrabbit.com/blogs/post/mining-fleet-uptime](seconda mano)
- [https://www.edafos.it/attrezzature-e-macchine/registro-manutenzione-attrezzature-obblighi-controlli/](seconda mano)
- [https://trackunit.com/trackunit-manager/](seconda mano)
- [https://www.samsara.com/products/telematics](seconda mano)
- [https://www.fleetio.com/](seconda mano)
- [https://www.controllogasolio.it/](seconda mano)

### Il delta, fatto da chi ha il codice in mano (02/09, contro `c703c076`)

Le cinque domande, risposte aprendo `apps/flotta/flotta-data.js` e non
cercando i nomi del mondo. Per ogni «non c'è» il comando e la sua uscita.

1. **Chi decide quando scade un tagliando** → esiste, nei due modi e mai
   insieme: `prossimoTagliando(man, oreAttuali, dataChiusura)` riparte dalle
   ORE che il mezzo ha adesso (+`ogniOre`) oppure dal CALENDARIO
   (+`ogniMesi`); `tagliandiInScadenza(manutenzioni, mezzi, letture, oggi,
   orizzonte)` proietta le ore a una data col ritmo del mezzo
   (`ritmoOreMezzi`) e conta a parte i `nonStimabili` — i mezzi senza un
   ritmo leggibile, dichiarati sulla tessera invece che messi a zero. I
   piani 250/500/1000/2000 h che i costruttori usano sono quelli di
   `pianoTagliando(chiave)` e `propostaTagliando`; la dimostrazione ne ha tre
   (`grep -c 'ogniOre:' apps/flotta/flotta-data.js` → 8). Il suolo polveroso
   non entra: la ricerca lo cita come fattore dei costruttori, da noi il passo
   è quello scritto sul piano — è una scelta, non una mancanza.
2. **Il consumo su ore incomplete** → esiste, e la regola è scritta nel
   commento di `validaRifornimento`/`consumoPerMezzo`: si scarta il PRIMO
   pieno (il gasolio che c'era dentro è stato bruciato in ore che non abbiamo),
   si sommano i pieni dal secondo in poi e si dividono per le ore fra il primo
   e l'ultimo; con un rifornimento solo il consumo non esiste e la funzione
   dice `perche`. Il contatore sceso lo rifiuta `validaRifornimento(dati,
   oreMezzo)` prima di salvare; `ritmoOreMezzi` lo scarta nelle letture.
3. **Una tolleranza di consumo anomalo** → **non c'è**: `grep -ciE 'consumo
   anomalo|anomal[a-z]* (di|del|nel) consumo' apps/flotta/flotta-data.js` → **0** (le 37
   occorrenze di «anomal» sono le anomalie del giro di CONTROLLO del mezzo,
   `anomalie` nelle checklist, un'altra cosa). Flotta calcola i l/h per mezzo
   e li mostra; non li confronta con una soglia né col ritmo dello stesso
   mezzo nei mesi prima. ⏱️ **Candidato**: il consumo del periodo contro la
   media del mezzo (stesso mezzo, mesi precedenti), con la forbice detta a
   parole e SENZA distinguere perdita da furto — quello non lo sa nessun
   software, lo sa chi guarda il mezzo; costo basso (funzione pura su
   `consumoPerMezzo` per finestre). ✅ **Fatto il 02/09, la sera stessa**:
   `consumoControStoria(rifornimenti, mezzo, oggi, finestra)` in
   `flotta-data.js` (finestra recente contro la storia, le regole di
   `consumoPerMezzo`, nessun giudizio nel modulo), `TOLLERANZA_CONSUMO_PCT`
   dichiarata come scelta della pagina, la riga del mezzo che dice il recente
   contro il suo solito e «da guardare» sopra la tolleranza; banco
   `flotta-consumo-storia.mjs` con la storia iniettata nel modulo servito.
4. **Il motore al minimo** → **non c'è come voce**: `grep -ciE 'regime
   minimo|al minimo|idle' apps/flotta/flotta-data.js` → **0**. Le ore del contatore sono ore
   motore, e il gasolio bruciato fermo ci finisce dentro senza nome. Un dato
   che i telematici hanno (idle time) e che chi scrive a mano il registro non
   ha: prima di aggiungere una voce va chiesto in cava se qualcuno la
   compilerebbe. *Candidato debole, dichiarato.*
5. **Disponibilità** → esiste, ed è calcolata sui FERMI REGISTRATI, non su un
   MTBF di catalogo: `affidabilitaFlotta(fermi, mezzi, giorni, oggi)` conta
   giorni-macchina disponibili meno persi, taglia i fermi alla finestra,
   tiene fuori dal denominatore i mezzi usciti dal parco e li dichiara, e il
   tempo medio fra due fermi lo scrive solo da due episodi in su (`grep -ci
   mtbf apps/flotta/flotta-data.js` → **1**, ed è un commento: il conto del
   tempo medio fra fermi c'è con un nome italiano — è il «cercare il
   meccanismo, non il nome» di CLAUDE.md). Il valore 85-95 % del settore
   citato dalla ricerca è di seconda mano e NON va in nessuna schermata.
6. **Il registro di controllo (D.Lgs 81/2008 art. 71, Allegato VII)** →
   esiste come citazione nei preset delle scadenze del mezzo (`grep -n
   '81/2008' apps/flotta/flotta-data.js` → 5 righe, art. 71 c.11, Allegato VII, art. 72) e nei
   controlli del mezzo con esito e anomalie; la conservazione per tre anni
   citata dalla ricerca non è una regola del codice (i dati non si cancellano
   da soli) — verificare quella durata sul testo di legge prima di scriverla
   in una schermata: la ricerca la riporta di seconda mano.

Riassunto: **quattro esistono (1, 2, 5, 6), due mancavano (3 e 4)**, e il solo
candidato con un valore chiaro era il **3** (il consumo del mezzo contro la sua
stessa storia) — *fatto la sera stessa; resta il 4, dichiarato debole*. Nessuno dei numeri di settore della ricerca (l/h, 85-95 %,
MTBF 400-600 h) va scritto nel prodotto: sono di seconda mano.


## Ricerca del 2026-09-04 — la telematica dei mezzi e lo standard AEMP/ISO 15143-3 (metà sul mondo)

⛔ **Nessuna pagina primaria è stata letta**: la rete si raggiunge solo con
`WebSearch` (usato); `WebFetch` e `curl` restano bloccati
(EGRESS_BLOCKED/403) e non sono stati usati. Ogni campo, formato, cadenza o
nome di prodotto citato qui sotto viene dai **risultati di ricerca** — cioè
da come li riassumono terzi — non dal testo dello standard ISO o dalla
documentazione API letta di persona. Marcato `[seconda mano: dominio]` riga
per riga.

### Già scritto (non ripetuto)

Questo documento ha **già** una sezione «Standard di Scambio Dati: AEMP 2.0 /
ISO 15143-3» (righe 163-178: che cos'è, ~20 parametri, i benefici, quattro
fonti) e una sezione «MTBF/MTTR e Calcoli di Disponibilità» (righe 134-146:
definizioni generali, downtime cost $5-15k/h e $130k/h per asset ad alta
produzione). La riverifica del 14/08 ha già confermato **VERA** la mancanza
di un import AEMP in Flotta e ha già scartato «safety stock» come falsa
mancanza. La ricerca del 02/09 ha già coperto Komtrax/VisionLink/CareTrack a
livello di prodotto e le domande sul contatore che scende, sul rifornimento
parziale e sulla disponibilità — con il delta già fatto lo stesso giorno da
chi ha il codice in mano (righe 366-432): quattro risposte esistono già in
`flotta-data.js`, due no. Questa ricerca **approfondisce** lo stesso terreno
con il dettaglio dei campi, della cadenza, dei limiti e dei formati di
scambio che le sezioni precedenti non avevano ancora messo a fuoco, e aggiunge
due argomenti non ancora toccati: i **codici DTC → causale di fermo** e i
**file CSV dei distributori di carburante** (Piusi/Gilbarco).

---

### 1. Lo standard ISO 15143-3 (AEMP 2.0): campi, cadenza, formato, chi lo implementa, limiti

**Che cos'è e chi lo implementa** [seconda mano: forconstructionpros.com,
digital.cat.com, autopi.io]: AEMP 2.0 è stato formalizzato come **ISO
15143-3:2020**, un protocollo a web service (JSON e XML) per lo scambio di
dati telemetrici di macchine da cantiere/cava fra portali OEM diversi e
sistemi di fleet management terzi, così da evitare un connettore proprietario
per ogni marca. Elenco di produttori che lo supportano, citato da un unico
articolo di settore: **Bomag, Cat, Dynapac, HAMM, Hitachi, Huppenkothen,
Hyundai, JCB, John Deere, Kobelco, Komatsu, Liebherr, Sennebogen, Takeuchi,
Vögele, Volvo, Wacker Neuson, Wirtgen Group, Zeppelin**
[seconda mano: forconstructionpros.com]. Caterpillar (VisionLink) è citato
come uno dei primi ad aver esteso l'integrazione mixed-fleet allo standard
ISO oltre al proprio AEMP 1.0 [seconda mano: forconstructionpros.com,
digital.cat.com]. Non trovato con WebSearch un elenco ufficiale e completo
delle marche conformi mantenuto da AEMP/ISO stessa — l'elenco sopra viene da
un solo articolo secondario, non dallo standard.

**Campi esposti**: la cifra ricorrente in più fonti indipendenti è **~20
parametri comuni** [seconda mano: autopi.io, flespi.com, trackunit.com]:
identificazione asset (equipmentHeader), ultima posizione nota, ore operative
cumulate (cumulative operating hours = ore motore totali da vita macchina),
ore idle cumulate (cumulative idle/nonoperating hours — motore acceso, mezzo
fermo, nessun comando azionato — espresse con coppia data-ora + valore
cumulato) [seconda mano: digital.cat.com — CAT ISO 15143-3 API Developer
Guide, come riassunto nei risultati], consumo carburante cumulato, consumo
carburante nelle 24h, livello/percentuale carburante residuo e capienza
serbatoio, distanza percorsa cumulata, temperature motore, stato motore
acceso/spento, percentuale di potenza media, DEF (citato solo genericamente
come «fuel/DEF» in un riassunto di seconda mano, senza il nome esatto del
campo) [seconda mano: geoforce.com — riassunto llms.geoforce.com]. Un
articolo cita esplicitamente **cinque parametri primari minimi** che ogni
fleet mixed-brand dovrebbe ingerire, ma non ne elenca i nomi nel testo
ripreso dalla ricerca [seconda mano: forconstructionpros.com — non è stato
possibile leggere quali sono i cinque, solo che il numero è cinque]. Codici
di guasto: citati come parte del payload nei riassunti generali («fault
codes», «engine fault codes») ma senza un campo AEMP dedicato nominato nei
risultati — probabile che restino nell'area **proprietaria** del singolo OEM,
non nello standard stesso (si veda sotto).

**Cadenza/latenza**: John Deere raccomanda un polling **non più frequente di
un'ora**, perché la propria cache è oraria; alcuni endpoint di posizione
hanno un refresh di **2 ore**, e poiché il dato viene tirato dal provider «a
sprazzi» un ingresso/uscita da una geofence può arrivare in ritardo o non
arrivare affatto [seconda mano: llms.geoforce.com]. Non trovato con WebSearch
un numero di cadenza unico dichiarato dallo standard stesso (sembra lasciato
al singolo OEM/endpoint).

**Formato**: JSON e XML via web service/API REST — descritto così in tre
fonti indipendenti [seconda mano: autopi.io, trackunit.com, digital.cat.com].

**Limiti noti**:
- **Dati proprietari fuori standard**: Caterpillar stessa consiglia il
  prodotto «ISO API» solo per i casi d'uso di base e il prodotto «VisionLink
  API» proprietario a chi vuole dati più ricchi — cioè l'OEM ammette che lo
  standard è un sottoinsieme del proprio dato completo [seconda mano:
  digital.cat.com — FAQ ISO 15143-3 riassunte]. Un'altra fonte generalizza:
  «alcuni produttori forniscono dati che non rispettano AEMP 2.0, oppure non
  offrono telematica OEM-integrata, oppure usano dispositivi vecchi senza
  telematica installata» [seconda mano: llms.geoforce.com].
- **Mezzi vecchi senza telematica**: una stima ricorrente in più fonti dello
  stesso vociferatore (fleetrabbit.com, più fonti aggregate da geotab.com/
  gminsights.com) dice che il **40-60%** del parco cantiere/cava pre-2015 non
  ha telematica di fabbrica, e che l'hardware OEM copre l'**85-95%** delle
  macchine **nuove** consegnate contro il 25-40% del parco esistente coperto
  da piattaforme aftermarket [seconda mano: gminsights.com/fleetrabbit.com —
  stessa famiglia di cifre ripetuta su più articoli dello stesso fornitore,
  quindi bassa indipendenza delle fonti]. La soluzione citata per colmare il
  buco è il **retrofit aftermarket** (dispositivo GPS/CAN universale con
  cablaggio dedicato) [seconda mano: fleetrabbit.com, boschservicesolutions.com].
- **Perforatrici (Epiroc/Sandvik)**: Epiroc InSite dichiara di integrarsi «via
  API AEMP standardizzata (ISO 15143-3)» per gli attrezzi/attacchi idraulici
  [seconda mano: epiroc.com]; Sandvik offre «My Sandvik OnSite», una
  soluzione **on-premise** che lavora su rete locale e si integra in qualsiasi
  sistema di mining di superficie — non è chiaro dai risultati se esponga
  AEMP o solo un'API proprietaria [seconda mano: mining.sandvik]. Un
  fornitore terzo (FleetRabbit) dichiara di ingerire codici guasto da Epiroc,
  Sandvik, Atlas Copco e Komatsu Mining «convertendo i codici grezzi in
  alert in linguaggio semplice» — ma questo è il fornitore terzo che parla di
  sé, non una conferma che quegli OEM espongano AEMP nativamente [seconda
  mano: fleetrabbit.com].

**Fiducia complessiva su questo blocco**: **media**. Lo scheletro (che cos'è,
~20 campi, JSON/XML, elenco larga di OEM aderenti) è confermato da più fonti
indipendenti; i nomi esatti dei singoli campi, la cadenza di ogni singolo
OEM e la lista dei «cinque parametri primari» **non sono stati letti alla
fonte primaria** — solo riassunti da articoli terzi.

---

### 2. I contatori: contatore che scende, ore motore/lavoro/folle, CMMS e dati mancanti

**Contatore che scende o salta**: un forum di rivenditori (non uno studio,
ma citato con un numero) riporta che «il 5-8% delle macchine usate mostra
una discrepanza fra il contachilometri al cruscotto e il log dell'ECM»,
segno che la manipolazione del contaore è un problema noto nel settore
[seconda mano: heavydutyyard.com, citato in un thread di forum specialistico
tractorbynet.com]. Sulla **sostituzione di centralina/quadro strumenti**: più
fonti aneddotiche (forum tecnici, non documentazione OEM) concordano che
quando si sostituisce l'ECM o il quadro il tecnico *dovrebbe* reimpostare le
ore corrette al momento dell'installazione, ma «questo non sempre avviene
come previsto», e il contatore può ripartire da zero [seconda mano:
newagtalk.com, planetnautique.com — fonti aneddotiche di settore agricolo/
nautico, non specifiche mining]. Non trovato con WebSearch un documento
ufficiale di un OEM da cava (Komatsu/Cat/Volvo) che descriva la propria
**procedura interna** di riconciliazione ore dopo un reset di centralina:
quello che emerge sono casi singoli raccontati da rivenditori, non una
policy dichiarata.
Il caso concreto più citato (Komtrax, presentato come il primo sistema
telematico di serie del settore dal 2007): un cliente ha fatto tirare un
report Komtrax e ha scoperto che il cruscotto segnava 5.100 ore — le stesse
5.100 ore registrate da Komtrax **due anni prima** — mentre l'ECM corrente
segnava 8.400 ore: cioè il contatore fisico era stato sostituito/azzerato e
il portale telematico, conservando lo storico lato server, ha permesso di
vedere il salto **all'indietro** che il solo contaore meccanico non
mostrava [seconda mano: heavydutyyard.com]. Non è chiaro dai risultati se il
portale Komtrax segnali *da solo* l'anomalia (un avviso automatico) o se
serva che qualcuno lo confronti a mano, come nell'esempio.

**Distinzione ore motore / ore lavoro / ore folle** [seconda mano: gethapn.com,
superkilometerfilter.com, matrackinc.com — riassunti concordi]:
- **Ore motore (engine hours)**: tempo totale col motore acceso, **comprese**
  le ore di idle — è il dato di base che il contaore fisico registra.
- **Ore folle (idle hours)**: motore acceso, mezzo fermo, nessuna funzione
  azionata (niente pala, niente martello). Bruciano gasolio e «consumano»
  intervalli di manutenzione senza produrre usura da lavoro. Due cifre di
  settore citate: Volvo CE dichiara una media di **28-30%** di tempo idle
  sulle grandi flotte cantiere, Komatsu **38%** su circa 75.000 macchine
  Nord America [seconda mano: superkilometerfilter.com — numeri di secondo
  livello, attribuiti agli OEM ma non letti sul documento OEM originale].
- **Ore lavoro (working hours)**: ricavate per **sottrazione** — ore motore
  meno ore idle riportate dal telematico — non sono un contatore fisico a sé
  [seconda mano: gethapn.com].
- La percentuale di idle è definita come ore idle / ore motore totali
  riportate dal telematico [seconda mano: superkilometerfilter.com].

**Come un CMMS (Fiix, UpKeep, MaintainX) tratta la manutenzione a ore e i
dati mancanti** [seconda mano: fiixsoftware.com, mpulsesoftware.com,
f7i.ai — riassunti concordi]: la manutenzione «a contatore» richiede
un'azione in più rispetto a quella a calendario (bisogna che qualcuno o
qualcosa legga il contatore) e scatta quando la lettura supera una soglia
configurata (Fiix la chiama «meter trigger»). Il punto esplicito trovato più
volte, sempre in forma di principio e non di funzione precisa: **«una
lettura vecchia trattata come fresca è peggio di nessuna lettura, perché può
sopprimere un ordine di lavoro che sarebbe dovuto scattare»**, e **«quando un
sensore tace, il CMMS dovrebbe segnalare il buco invece di portare avanti in
silenzio l'ultima lettura nota come se fosse attuale»** [seconda mano:
riassunto aggregato attribuito a guide UpKeep/Fiix — non è stato possibile
leggere quale prodotto specifico implementi questo comportamento di default
e quale invece lo lasci come lettura ferma]. Non trovato con WebSearch un
numero concreto («dopo N giorni senza lettura il sistema segnala X»): il
principio è dichiarato, la soglia non è pubblica nei risultati.

**Fleetio/Samsara/Geotab**: il flusso dichiarato è che Fleetio ingerisce
contaore/odometro **quotidianamente** dai device telematici (in alcuni casi
più spesso) così che i promemoria di servizio restino accurati, con
diagnostica/DTC e dati DVIR sincronizzati automaticamente da Samsara o
Geotab per far scattare gli ordini di lavoro «sull'uso reale invece che
sulla stima a calendario» [seconda mano: fleetio.com/samsara.com, riassunti
aggregati da fleetopsclub.com e oxmaint.com]. Non trovato con WebSearch il
comportamento esplicito di Fleetio quando l'integrazione telematica smette
di mandare letture per più giorni (fallback a manuale? sospensione del
piano? nessuna fonte lo descrive).

**Fiducia**: **media** sullo scheletro (distinzione ore, principio del dato
mancante nel CMMS); **bassa** sui numeri isolati (5-8% discrepanza, 28-38%
idle) perché vengono da singole fonti aggregatrici, non da un ente terzo
indipendente o dal documento OEM originale.

---

### 3. Fermi e codici guasto: da DTC a causale, KPI mining (GMG)

**Da DTC a fermo con causale**: i risultati confermano *che cosa è* un DTC
(codice generato dalla centralina di bordo per segnalare un malfunzionamento,
usato per decidere l'intervento e ridurre il fermo) ma **non è stata
trovata con WebSearch** una fonte che descriva il meccanismo tecnico preciso
di **mappatura** da un codice SPN/FMI (SAE J1939) o proprietario a una
causale di fermo testuale nel software di flotta: query dedicata
`"diagnostic trouble code" "downtime event" "reason code" mapping mining
fleet` → risultati generici sui DTC (Motive, Verizon Connect, Datatruck,
Linxup) senza descrivere la tabella di corrispondenza. È plausibile che ogni
fornitore mining (FleetRabbit citato) traduca i codici in «alert plain
language con azione raccomandata» internamente, ma il **come** (tabella
statica per codice, per famiglia di codice, o intervento umano) non è
descritto nei risultati [seconda mano: fleetrabbit.com — dichiarazione di
prodotto, non un meccanismo].

**Causali standard nel mining** [seconda mano: heavyvehicleinspection.com,
miningdoc.tech, wjarr.com — sommari concordi ma nessuno con un elenco
codificato ufficiale]: le famiglie di causale ricorrenti citate per il
mining truck-and-shovel sono **guasto meccanico** (motore, idraulico,
gomme, GET/denti benna, argano, perni, pompe, elettrico), **gomme/pneumatici**
(citate anche a sé per quanto pesano — condizioni fangose le danneggiano
rapidamente), **meteo** (condizioni avverse che fermano carico/trasporto o
impongono fermate di sicurezza), **attesa ricambio** (i ritardi di consegna
si aggravano proprio col meteo avverso, secondo la stessa fonte). Non
citate esplicitamente nei risultati: «mancanza operatore» e «fermo
programmato» come voci di un elenco standard — sono categorie plausibili
per analogia ma **non trovate con WebSearch** come causali nominate in una
fonte mining. Una fonte generica (non mining-specifica) raccomanda una
**tassonomia di 15-25 codici massimo**, allineati ai modi di guasto e ai
vincoli operativi, motivando che senza codici standard si hanno
«categorizzazione incoerente fra turni, codici generici, inserimenti tardivi
o mancanti, nessuna possibilità di analizzare il trend dei modi di guasto»
[seconda mano: fonte non nominata esplicitamente nel riassunto, dominio
generico fleet/CMMS].

**GMG — Global Mining Guidelines Group**: esiste una **«Guideline for a
Standardized Time Classification Framework for Mobile Equipment in Surface
Mining»** (pubblicata, versione citata nei risultati come del 2020, con un
PDF ospitato su gmggroup.org) che definisce un **Time Usage Model** con
categorie standard [seconda mano: gmggroup.org, im-mining.com,
me.smenet.org]:
- **Operating Standby (SB)**: il mezzo è disponibile ma non sta operando, e
  non c'è intenzione immediata di farlo operare per una decisione di
  gestione (sotto il controllo del management).
- **External Standby**: il mezzo è disponibile, richiesto e assegnato a un
  progetto/sito, ma non può essere operato per ragioni **fuori** dal
  controllo immediato del management operativo.
- **Operating Delay (OD)**: il mezzo sta operando ma è temporaneamente
  fermato/impedito da ritardi inerenti all'operazione stessa o alle
  condizioni fisiche/ambientali immediate.
- **Manutenzione (programmata/non programmata)**: la fonte dichiara
  esplicitamente che al momento della pubblicazione c'era **poco consenso**
  su come classificarla, e serve ulteriore collaborazione prima di poterla
  includere in un modo utile al benchmarking fra aziende [seconda mano:
  im-mining.com — dichiarazione esplicita del limite dello standard stesso,
  non una nostra deduzione].
Il Time Usage Model è descritto come lo strumento con cui le aziende minerarie
catturano il tempo operativo complessivo e il fermo, per misurare e tracciare
la performance [seconda mano: connectedmine.com.au].

**MTBF/MTTR — definizioni generali** (non è stata trovata la definizione
testuale precisa **del documento GMG**, solo definizioni di settore generico
ripetute in più fonti non mining-specifiche) [seconda mano: firgelliauto.com,
checkproof.com]: **MTBF** = tempo medio fra un guasto e l'altro di un modulo
hardware, tipicamente una stima del produttore prima che si verifichi un
guasto; **MTTR** = tempo medio per riportare un asset alla piena operatività
dopo un guasto non pianificato, dal momento in cui il mezzo si ferma al
momento in cui torna in servizio in sicurezza — cioè l'intero ciclo di
riparazione, non solo la mano d'opera attiva. **Disponibilità** = MTBF /
(MTBF + MTTR), oppure uptime/(uptime+downtime) [già in questo documento,
righe 134-146 e 332-333]. Non trovato con WebSearch il testo esatto delle
definizioni GMG di MTBF/MTTR — il PDF esiste (`gmggroup.org/wp-content/
uploads/2024/07/20200713_Time_Classification_Framework...pdf`) ma non è
stato letto (WebFetch bloccato): quello che precede è la definizione
**generica** di ingegneria affidabilistica, non necessariamente quella che
il GMG adotta parola per parola.

**Fiducia**: **bassa** sulla mappatura DTC→causale (non trovata una fonte
diretta); **media** sulle famiglie di causale mining (concordi fra più fonti
ma nessun elenco codificato ufficiale); **media** sul Time Usage Model GMG
(fonte primaria esiste e citata da terzi, ma non letta di persona);
**bassa** sul testo esatto delle definizioni GMG di MTBF/MTTR (probabile che
il GMG non usi affatto quei due acronimi, dato che il framework parla di
categorie di tempo, non di tassi di guasto — questo è dedotto dalla
struttura del documento come riassunta, non confermato).

---

### 4. File di scambio semplici: CSV OEM, distributori di carburante, vocabolario italiano

**CSV esportati dai portali OEM** [seconda mano: help.myvisionlink.com,
riassunti aggregati]: VisionLink permette di scaricare o pianificare report
via email in **CSV, XLSX, JSON e XML**, con cadenza una tantum o
schedulata (giornaliera/settimanale/mensile). Le colonne tipiche citate nei
riassunti, senza un elenco ufficiale di intestazioni: **ore operative, ore
idle, posizione, codici guasto motore, segnalazioni di manutenzione, letture
carburante e DEF, livello carburante, utilizzo complessivo**. Non trovato
con WebSearch l'elenco letterale delle intestazioni di colonna di un CSV
VisionLink o Komtrax reale (serve accedere al pannello amministratore o al
supporto Caterpillar/Komatsu, dicono le stesse fonti secondarie) — quindi
qui non si può scrivere un nome di colonna con fiducia alta.

**Distributori di carburante (Piusi, Gilbarco)**:
- **Piusi** (serie Cube/Self Service Management «Agilis»): il software
  esporta in **.pdf, .xlsx o .txt**; la memoria locale del dispositivo tiene
  le ultime **255 erogazioni**, esportabili e organizzabili via interfaccia
  PC; il report può essere stampato/riepilogato **per utente**, e nel
  sistema si può inserire codice mezzo, chilometraggio, data e ora
  dell'erogazione [seconda mano: piusi.com, centretank.com]. Non trovato
  con WebSearch un elenco letterale delle colonne del file **.txt/.csv** di
  Piusi (nomi di campo esatti) — solo che i campi *contengono* mezzo, km,
  data/ora.
- **Gilbarco/Gasboy**: il sistema di identificazione automatica del veicolo
  (AVI) combina letture di **odometro e ore motore** per monitorare il
  consumo, programmare la manutenzione e controllare il chilometraggio;
  **DataFLEX360** genera report periodici personalizzati per contabilità,
  budget e gestione operativa [seconda mano: gilbarco.com]. Non trovato con
  WebSearch il formato file o le colonne esatte dell'export DataFLEX360 —
  solo la sua funzione dichiarata.
- **Limite comune dichiarato dalla ricerca stessa**: nessuna delle due fonti
  OEM (Piusi, Gilbarco) pubblica online un fac-simile o uno schema delle
  colonne del proprio file di export; l'informazione disponibile via
  `WebSearch` descrive **che cosa il sistema fa**, non **come è fatto il
  file** — un limite dello strumento di ricerca su questo punto specifico,
  non un'assenza nel mondo.

**Vocabolario italiano del mestiere** — non è stata trovata una fonte che
elenchi le parole insieme come glossario; sono confermate una per una nei
risultati sparsi già citati sopra e in ricerche precedenti di questo
documento:
- **contaore**: presente nei forum tecnici italiani come sinonimo di
  «hour meter» — non citato in una fonte di settore mining con questa
  ricerca, ma è il termine corrente (dedotto dall'uso comune, non da una
  fonte trovata oggi).
- **erogazione**: usato nei materiali Piusi stessi («erogazioni») per
  indicare un singolo rifornimento registrato dal distributore [seconda
  mano: piusi.com].
- **disponibilità meccanica / utilizzo**: confermati come termini italiani
  correnti in ambito OEE/manutenzione industriale, con **utilizzo lordo**
  (tempo macchina accesa / tempo totale disponibile) e **utilizzo netto**
  (tempo di produzione effettiva / tempo totale disponibile) come due
  varianti distinte [seconda mano: bravomanufacturing.it, cyberplan.it —
  fonti di manutenzione industriale generica, non specifiche cava/mining;
  non è stato confermato se il mining italiano usa la stessa distinzione
  lordo/netto o una propria].
- **fermo, causale, tagliando, intervento**: confermati come termini
  correnti nei siti italiani di CMMS generico (Mainsim, Bravo Manufacturing)
  ma, di nuovo, non specifici del settore cava — «tagliando» in particolare
  è terminologia automotive/officina, non è stata trovata una fonte che
  confermi il suo uso in un contesto **mining/cava** italiano specificamente
  (è ragionevole per prossimità lessicale, ma resta una supposizione non
  verificata con questa ricerca).

**Fiducia**: **bassa** su tutto questo blocco. Il tipo di file (CSV, XLSX,
TXT) e la funzione dei sistemi sono confermati da fonti dirette OEM
(piusi.com, gilbarco.com); le **colonne esatte** e il **vocabolario italiano
mining-specifico** non sono stati trovati con `WebSearch` — sono o dedotti
per prossimità o assenti.

---

### Fonti

| URL | Che cosa dice | Fiducia |
|---|---|---|
| [digital.cat.com — ISO 15143-3 (AEMP 2.0) API Developer Guide](https://digital.cat.com/knowledge-hub/articles/iso-15143-3-aemp-20-api-developer-guide) | Campi (idle cumulato, fuel remaining), Cat consiglia prodotto proprietario per dati ricchi | media |
| [digital.cat.com — ISO 15143-3 (AEMP 2.0) API FAQs](https://digital.cat.com/knowledge-hub/faq/iso-15143-3-aemp-20-api-faqs) | Cache oraria, refresh posizione 2h, limiti di conformità di alcuni OEM | media |
| [trackunit.com — Everything you should know about ISO 15143-3](https://trackunit.com/articles/benefits-from-iso-15143-4/) | Standard aperto, ~20 parametri | media |
| [autopi.io — AEMP 2.0 Explained](https://www.autopi.io/blog/what-is-aemp-telematics-standard/) | JSON/XML, benefici mixed-fleet | media |
| [flespi.com — AEMP protocol parser](https://flespi.com/protocols/aemp) | Campi timeseries (idle, fuel remaining ratio) | media |
| [llms.geoforce.com — AEMP/ISO 15143-3 mixed-fleet ingestion](https://llms.geoforce.com/aemp-iso-15143-3-mixed-fleet-ingestion) | Cadenza Deere oraria, limiti di conformità OEM, elenco campi | media |
| [forconstructionpros.com — Cat VisionLink AEMP 2.0](https://www.forconstructionpros.com/construction-technology/equipment-monitoring-logistics/news/12316218/caterpillar-visionlink-improves-mixedfleet-integration-with-aemp-20-telematics-standard) | Elenco OEM aderenti, 5 parametri primari (non nominati) | bassa (fonte unica per l'elenco OEM) |
| [epiroc.com — Introducing Epiroc InSite](https://www.epiroc.com/en-us/newsroom/2025/insite) | InSite si integra via API AEMP standardizzata | media |
| [mining.sandvik — My Sandvik digital services](https://www.mining.sandvik/en/digital-solutions/operations-and-connected-fleet/sandvik-telemetry/) | My Sandvik OnSite, soluzione on-premise di rete locale | bassa (non conferma AEMP) |
| [fleetrabbit.com — Best Mining Drill Rig Maintenance Software](https://fleetrabbit.com/industry/mining-fleet-software/best-mining-drill-rig-maintenance-software-blasthole-drilling-2026) | Ingestione fault code da Epiroc/Sandvik/Atlas Copco/Komatsu Mining | bassa (fornitore terzo che parla di sé) |
| [gminsights.com — Construction Equipment Telematics Market](https://www.gminsights.com/industry-analysis/construction-equipment-telematics-market) | 40-60% parco pre-2015 senza telematica, 85-95% copertura OEM su nuovo | bassa (cifra di mercato aggregata) |
| [heavydutyyard.com — How Accurate Are Equipment Hour Meters](https://www.heavydutyyard.com/blog/hour-meter-guide) | 5-8% discrepanza cruscotto/ECM; caso Komtrax 5.100 vs 8.400 ore | bassa (fonte aggregatrice, casi aneddotici) |
| [gethapn.com — Engine Hours vs. Odometer Maintenance Scheduling](https://gethapn.com/blog/engine-hours-vs-odometer-maintenance/) | Working hours = ore motore − ore idle | media |
| [superkilometerfilter.com — Engine Hours vs Idle Hours](https://superkilometerfilter.com/engine-hours-vs-idle-hours-and-how-they-affect-your-vehicle/) | Definizioni idle/engine hours; 28-30% Volvo, 38% Komatsu idle medio | bassa (cifre di secondo livello) |
| [fiixsoftware.com — What is Meter Based Maintenance](https://fiixsoftware.com/glossary/meter-based-maintenance/) | Meccanismo trigger a contatore | media |
| [mpulsesoftware.com — Automated Meter Readings](https://mpulsesoftware.com/blog/cmms/automated-meter-readings/) | Principio: lettura vecchia trattata come fresca è peggio di nessuna lettura | media |
| [fleetio.com — Fleet Integrations](https://www.fleetio.com/solutions/integrations) | Sync giornaliero contaore da Samsara/Geotab | media |
| [gmggroup.org — Standardized Time Classification Framework PDF](https://gmggroup.org/wp-content/uploads/2024/07/20200713_Time_Classification_Framework-GMG-DAU-v01-r01-1.pdf) | Documento primario del Time Usage Model — **non letto**, solo citato da terzi | media (esistenza confermata, contenuto di seconda mano) |
| [im-mining.com — GMG publishes time classification framework](https://im-mining.com/2020/09/01/gmg-publishes-standardised-time-classification-framework-mobile-equipment-surface-mining/) | Categorie SB/External Standby/OD, «poco consenso» su manutenzione | media |
| [connectedmine.com.au — The Time Usage Model](https://connectedmine.com.au/content-hub/the-time-usage-model-a-pillar-in-mining-analytics) | Time Usage Model come strumento operativo | media |
| [checkproof.com — How OEE, MTBF & MTTR Help Reduce Downtime](https://www.checkproof.com/blog/predictive-maintenance/downtime-reduction-how-oee-mtbf-mttr-help-you-stay-ahead/) | Definizione generica MTTR (ciclo intero, non solo mano d'opera) | bassa (non mining-specifica) |
| [heavyvehicleinspection.com — Predictive Maintenance for Mining Equipment](https://heavyvehicleinspection.com/blog/post/predictive-maintenance-mining-equipment-guide) | Famiglie di guasto meccanico truck-and-shovel (motore, idraulico, gomme, GET) | media |
| [miningdoc.tech — common causes of unplanned downtime](https://www.miningdoc.tech/question/what-are-the-common-causes-of-unplanned-downtime-in-a-truck-and-shovel-operation-and-how-are-they-minimized/) | Meteo e ritardo ricambi collegati | media |
| [help.myvisionlink.com — Generating reports](https://help.myvisionlink.com/en_US/Content/Generating_reports.htm) | Export CSV/XLSX/JSON/XML schedulato | media |
| [piusi.com — Cube MC 2.0](https://www.piusi.com/usa/products/cube-mc-2-0) | Export .pdf/.xlsx/.txt, 255 erogazioni in memoria locale | media |
| [gilbarco.com — Automatic Vehicle Identification](https://www.gilbarco.com/mea/our-solutions/payment-solutions/automatic-vehicle-identification) | AVI combina odometro + ore motore; DataFLEX360 per report | media |
| [bravomanufacturing.it — Indicatori di efficienza OEE](https://www.bravomanufacturing.it/kpi-di-efficienza/) | Utilizzo lordo vs netto, formule italiane | media |

---

### Domande per il delta (sul meccanismo — nessuna risposta qui)

1. Chi, in Flotta, decide che una lettura del contatore ore è **scesa** o
   incongruente rispetto alla precedente, e quella decisione distingue fra
   «errore di battitura», «sostituzione di centralina/reset» e «guasto del
   sensore»? Oggi `validaRifornimento` la rifiuta prima di salvare: la
   rifiuta e basta, o registra da qualche parte *che* è stata rifiutata,
   distinguibile da un rifornimento mai inserito?
2. Flotta distingue ore motore, ore lavoro e ore folle da qualche parte, o
   il contatore che riceve è **un solo numero** (ore motore) senza la
   possibilità di sapere quanta parte è stata a vuoto? Se un domani arrivasse
   un dato di idle (da un CSV OEM o da un contatore aggiuntivo), che
   funzione lo riceverebbe e come cambierebbe `ritmoOreMezzi`/
   `consumoPerMezzo`?
3. Chi decide, oggi, la **causale** di un fermo in `fermi` — è un campo
   libero compilato da chi registra, o un elenco chiuso di valori? Se
   chiuso, quali sono le voci, e coprono le famiglie che il mondo usa
   (meccanico, gomme, attesa ricambio, meteo, mancanza operatore, fermo
   programmato) o ne mancano/ne avanzano?
4. `analisiDisponibilita`/`affidabilitaFlotta` — la distinzione GMG fra
   «Operating Standby» (fermo per decisione del management) ed «External
   Standby» (fermo per cause fuori dal controllo del management) esiste già
   nei dati di `fermi`, magari sotto un altro nome, o Flotta oggi calcola un
   fermo unico senza questa distinzione? E se un domani arrivasse un fermo
   da telematica (senza causale umana, solo un codice guasto), che campo lo
   accoglierebbe?
5. Oggi Flotta riceve carburante e ore **a mano o da CSV**: quel CSV, che
   forma ha? Se domani arrivasse un file di export di un distributore
   (Piusi/Gilbarco) o di un portale OEM (VisionLink/Komtrax), quale funzione
   esistente (`leggiCsv`, `parseCsvLine`) lo leggerebbe, e le sue colonne
   combaciano già con quello che un distributore vero esporta o servirebbe
   un mapping?
6. Il principio del fondatore («assenza di un dato non è un dato
   favorevole») — se domani mancasse la lettura del contatore per *giorni*
   (mezzo telematico offline, non solo un rifornimento saltato), quale
   funzione se ne accorgerebbe oggi, e quella funzione lo dichiarerebbe come
   «non misurato» o lo lascerebbe scorrere silenziosamente nell'ultima
   lettura nota?

### Il delta, fatto da chi ha il codice in mano (04/09, verificato contro il commit `c75239f5`)

Le sei domande, risposte aprendo `apps/flotta/flotta-data.js` (80 funzioni
esportate); ogni «non c'è» con il comando.

1. **Il contatore che scende.** Due posti, con due risposte diverse e tutt'e
   due deliberate: `validaRifornimento(dati, oreMezzo)` RIFIUTA prima di
   salvare una lettura più bassa di mezz'ora rispetto all'ultima registrata
   («Il contatore segna meno delle N ore già registrate sul mezzo: controlla»)
   — non registra il rifiuto, e un rifornimento rifiutato è indistinguibile da
   uno mai inserito; `consumoPerMezzo` (riga ~2222, `sceso`) e
   `ritmoOreMezzi` invece TENGONO le letture e rispondono `null` con il
   `perche` («il contatore è sceso», «fra la prima e l'ultima lettura il
   contatore non è salito»). Nessuna delle due distingue refuso, centralina
   sostituita o sensore guasto: `grep -n "centralina\|reset" flotta-data.js` →
   la nota della causale «guasto-elettrico» e un `preset` preso per la coda
   della parola: niente sul tema. Non c'è un evento «contatore
   azzerato» che riapra il conto da zero.
2. **Ore motore / lavoro / folle.** Un numero solo: `parseTelemetriaCsv` legge
   `mezzo; ore; carburante`, `validaRifornimento` un `ore` a un decimale.
   `grep -n "folle\|idle\|oreLavoro" flotta-data.js` → 0. Un dato di idle non
   avrebbe oggi nessuna porta: entrerebbe come colonna nuova del CSV di
   telemetria e come campo del rifornimento, e `ritmoOreMezzi`/
   `consumoPerMezzo` continuerebbero a ragionare sulle ore motore (giusto: il
   tagliando si fa sulle ore motore).
3. **La causale del fermo.** Elenco CHIUSO, `CAUSALI_FERMO` (nove voci con
   nota): guasto meccanico / idraulico / elettrico, gomme o cingoli, attesa
   ricambi, manutenzione programmata, verifica o revisione, manca l'operatore,
   altro. Contro le famiglie del mondo mancano solo **meteo** e la distinzione
   «fermo programmato» (c'è: «manutenzione programmata» e «verifica») —
   «mancanza operatore» c'è già, cercata col nome della casa.
4. **Operating vs External standby.** Non c'è come campo: la causale
   implicitamente lo dice (manutenzione/verifica = scelta del gestore;
   operatore/gomme/guasto = subìto) ma `affidabilitaFlotta` conta i fermi
   tutti insieme (con `persi`, `episodi`, `senzaDate` dichiarati, e
   `fermoCollocabile` per quelli senza data) — `grep -n "standby\|subito\|scelto"
   flotta-data.js` → la nota di «manutenzione» («è un fermo scelto») e tre
   commenti dove «subito» e «scelto» sono parole comuni: niente sul tema. Un
   fermo da telematica (solo un codice guasto) non avrebbe un campo: `grep -n
   "codice\b\|DTC\|dtc" flotta-data.js` → «codice» compare solo nel senso di
   programma, nei commenti; 0 sul tema.
5. **Il CSV che entra.** `parseTelemetriaCsv` vuole `mezzo;ore;carburante`
   (con `numIt`, la virgola italiana); un export Piusi/Gilbarco o VisionLink
   ha altre colonne e altri nomi del mezzo: servirebbe una mappa di colonne
   come quella di Sentinella (`preparaLetture(righe, mappa)`), che è lo stesso
   meccanismo e vivrebbe in `shared/` il giorno in cui la usano in due.
6. **Il contatore fermo per giorni.** `ritmoOreMezzi` lo dichiara:
   `r.eta > ORIZZONTE_TAGLIANDI` (30 giorni) → «l'ultima lettura del contatore
   è di N giorni fa: quel ritmo racconta un periodo passato, non questo», e
   il ritmo è `null`; `consumoControStoria` ha la sua finestra. Il principio è
   applicato dove il numero si forma; quello che non c'è è un avviso sul
   mezzo («nessuna lettura da N giorni») fuori dal conto del ritmo.

**Che cosa ne segue** (candidati con costo e misura, nessuno aperto):
- (a) ✅ **fatta il 04/09** — la causale **meteo** in `CAUSALI_FERMO`, prima di
  «altro» (misurato: la tendina della pagina la deriva dall'elenco e mostra
  dieci voci; `nomi-doppi` 0 da sistemare con Campo; run-kpi +3 asserzioni);
- (b) ✅ **fatta il 04/09** — l'evento vive sul rifornimento che apre il
  nuovo contatore (`contatoreNuovo`, `oreVecchie`), non su una lista del
  mezzo: nessuna firma cambiata. `azzeramentiDelMezzo`, `spezzaLetture`,
  `trattoCorrente`, `fraseContatoreSostituito`; consumo, ritmo e storia
  contano sul tratto corrente e dichiarano `tratti`/`contatoreDal`; una
  lettura più bassa SENZA dichiarazione resta «sceso». run-kpi +13, Flotta
  102/102, banco `flotta-contatore` 42/0 e controprova 10 su 42. ✅ E il
  cantiere a sé è **fatto il 04/09, sera**: il tagliando a ore porta
  `scrittaIl`, scritto prima dell'ultimo azzeramento è «non confrontabile» col
  motivo (`contatoreDelTagliando`, `urgenzaTagliando`), e l'ordine propone la
  riscrittura sul contatore nuovo (`propostaRiscrittura`, confermata da una
  persona). run-kpi +13, banco `flotta-contatore` 72/0;
- (c) ✅ **fatta il 05/09** — `mappaColonne(intestazione, indizi, opzioni)` in
  `shared/deepwork-id-client/dw-shell.js` (con `nomeColonna`): la domanda
  «quale colonna è X?» scritta una volta, con esclusioni, ordine, condizionali
  e facoltative. Flotta la usa con `INDIZI_TELEMETRIA` (`mappaTelemetriaCsv`;
  `parseTelemetriaCsv` e `scartiTelemetriaCsv` per nome quando l'intestazione
  ha mezzo e ore, per posizione altrimenti) e l'esito dell'import dice le
  colonne riconosciute; Conti ha rifatto `mappaMovimentiCsv` sopra la stessa
  funzione, rispondendo come prima. Misura: «Asset;Engine Hours;Fuel (l);Site»
  entra intero e «Litri;Ore motore;Targa» — colonne in altro ordine — pure
  (prima la targa finiva nei litri). ⏱️ Restano candidati, NON fatti:
  nessuno: ✅ `mappaPianoCsv` di Campo è passata sopra `mappaColonne` il 05/09,
  con l'opzione `esatto` (nomi interi: «ms» non deve prendere «relief ms per
  m»), e ✅ `proponiMappa`/`proponiColonneEvento` di Sentinella lo stesso
  giorno, nel modo «dentro» (l'indizio in qualunque punto: «vel» prende
  «velocità (mm/s)») e con le colonne già prese (`presi`), tenendo il ripiego
  sui dati; tutt'e due rispondono come prima. I quattro lettori sono uno;
- (d) ✅ **fatta il 04/09** — «scelto / subìto» derivato dalla causale
  (`naturaFermo`: manutenzione e verifica scelti; guasti, gomme, ricambi,
  operatore, meteo subìti; «altro» e le chiavi sconosciute NON classificati,
  dichiarati a parte), in `affidabilitaFlotta` come `scelti`/`subiti`/
  `nonClassificati` con giorni ed episodi: la somma delle tre parti è `persi`
  ed `episodi` alla cifra (prova in run-kpi). La frase dei fermi lo scrive
  («1 giorno di fermo scelto … e 13 giorni di fermo subìto»), misurata a 320 e
  390 senza uscire dal riquadro.

## Ricerca del 2026-09-11 — i piani a chilometri, e la regola «il primo dei due»: il mondo

⚠️ **Seconda mano, marcata**: fatta con `WebSearch` (che risponde), non con
`WebFetch`. Nessun intervallo di manutenzione citato qui entra in una
schermata: i numeri dei tagliandi li dà il libretto del costruttore, non un
risultato di ricerca.

### Che cos'è, fuori

- I gestionali di flotta (Mainsim, X-Fleet, FleetUP, Avrios, Zucchetti,
  Michelin Connected Fleet) tengono per ogni bene **piani per chilometri,
  per ore motore o per calendario**, scelti per categoria: «cambio olio ogni
  30.000 km» per il camion, «revisione ogni 500 ore» per la macchina
  operatrice; il contatore giusto lo legge la telematica, se c'è, se no lo
  scrive una persona. *[risultati di ricerca: Mainsim, X-Fleet, FleetUP]*
- La regola dei libretti è **«il primo dei due»**: il tagliando si fa quando
  scade la prima fra la condizione di tempo e quella di percorrenza (o di
  ore) — «ogni 12-24 mesi o ogni 15-30.000 km, a seconda di quale arriva
  prima» per un veicolo stradale. *[risultati di ricerca: UnipolMove,
  DottorGomma, automobilista.it — generici, da automobile]*
- Per i camion la frequenza dipende da ore d'uso e tipo di attività, e la
  manutenzione ordinaria è distinta da quella programmata in officina.
  *[risultati di ricerca: Volvo Trucks, Truck24, Botto Ricambi]*

Fonti (risultati di ricerca, non lette per intero):
[Mainsim — fleet management](https://www.mainsim.com/settori/fleet-management-software/) ·
[X-Fleet](https://www.il-software.it/gestionale_flotta_aziendale.htm) ·
[FleetUP](https://www.fleetup.it/software-gestionale-flotta-aziendale/) ·
[Michelin Connected Fleet](https://connectedfleet.michelin.com/it/soluzione/software-per-la-gestione-delle-flotte-aziendali) ·
[Volvo Trucks — manutenzione camion](https://www.volvotrucks.it/it-it/news/il-vocabolario-del-camionista/camion-come-fare-manutenzione.html) ·
[DottorGomma — km o tempo](https://www.dottorgomma.it/blog/tagliando-auto-ogni-quanto-km-o-tempo/) ·
[Truck24 — manutenzione mezzo commerciale](https://www.truck24.it/la-manutenzione-di-un-mezzo-commerciale/).

### Domande per il delta (fatte al meccanismo)

1. *Che mezzi modella Flotta?* → `TIPI_MEZZO`: escavatore, pala, «dumper /
   camion», perforatrice, impianto, sollevamento, altro — macchine da cava,
   il cui contatore è l'ORA MOTORE (`mezzi[].ore`, `ritmoOreMezzi`,
   `PIANI_TAGLIANDO` 250/500/1000/2000 h). Il mezzo targato esiste come
   **adempimento** (revisione alla Motorizzazione ogni 5 anni, «mezzo
   targato»), non come mezzo con un contachilometri.
2. *Chi decide quando scade un tagliando?* → `prossimoTagliando(man, ore,
   data)`: «Due modi, MAI insieme» — a ore se il piano ha `ogniOre`, se no a
   calendario se ha `ogniMesi`. Un piano con tutt'e due prende le ore e
   **ignora i mesi**. `urgenzaTagliando` legge le ore; l'urgenza per data la
   dà lo scadenzario. Il «primo dei due» dei libretti **non c'è**.

### Il delta, fatto da chi ha il codice in mano (11/09, contro `36fba50e`)

- **Chilometri**: la riga di `CONCORRENTI_FLOTTA` resta «assente» ed è
  giusta, ma va detto **per chi**: per i camion stradali di una cava che
  consegna in proprio. Flotta oggi li classifica sotto «dumper / camion» e li
  conta a ore. Prima di aggiungere un contachilometri serve una decisione di
  prodotto (un mezzo ha UN contatore: ore o km, scelto sulla scheda; piani,
  ritmo e consumo cambiano unità) — è un cantiere da sei-otto unità, e va
  aperto quando una cava con camion propri lo chiede. **Candidato dichiarato,
  non aperto.**
- **Il primo dei due**: questo sì è del mestiere di Flotta com'è, e costa
  poco. Un tagliando dei libretti è «ogni 500 h **o** 12 mesi, quello che
  arriva prima»; Flotta lo sa dire solo a ore **oppure** a mesi. Delta
  concreto: `prossimoTagliando` con tutt'e due i passi scrive tutt'e due le
  scadenze (ore previste E data prevista), e l'urgenza è la peggiore delle
  due; la frase lo dice («a 6.370 h o entro il 12/03/2027, quello che arriva
  prima»). **In roadmap come prossima unità.**

## Ricerca del 2026-09-11 — secondo giro: che cosa chiedono l'officina e l'assicurazione di un mezzo di cava (il mondo)

⚠️ **Seconda mano, marcata**: fatta con `WebSearch` (che risponde), non con
`WebFetch` (che non legge il testo primario). Nessun numero di norma entra in
una schermata; quelli qui sotto servono a decidere il delta.

### Che cosa chiedono, fuori

- **L'officina ragiona a ORE MOTORE, non a calendario**: cambio olio motore e
  filtri ogni 250 h, filtro aria e controlli ogni 500 h, olio trasmissione e
  idraulico a 1.000 h; il libretto del fabbricante fissa gli intervalli, e un
  dumper su tre turni consuma le 250 h in meno di dieci giorni. I gestionali
  di settore leggono le ore dalla telematica e aprono l'ordine di lavoro al
  passaggio dell'intervallo, mezzo per mezzo. *[risultati di ricerca:
  puntosicuro.it, movimento-terra.it, mamsnc.it, getclue.com, fleetrabbit.com]*
- **L'assicurazione**: dal 2024 l'RCA è **obbligatoria anche per i mezzi che
  non escono mai dalla cava** (l'obbligo segue l'uso del veicolo, non la
  strada: cantieri, magazzini, cave); deroga solo per macchine agricole non
  immatricolate coperte da RCT volontaria; sanzione da 866 a 3.464 €. *[risultati
  di ricerca: Assimpredil Ance, asaps.it, praugest.it — D.Lgs. 184/2023 di
  seconda mano, NON da scrivere in una schermata]*
- **La revisione** delle macchine operatrici immatricolate è ogni **5 anni**
  (art. 58 CdS), ma l'obbligo **non è ancora operativo**: manca il decreto
  attuativo, quindi oggi non è sanzionabile. *[risultati di ricerca: Assimpredil
  Ance, certifico.com, insic.it — stato che cambia, da riverificare]*
- **Le verifiche INAIL** (D.Lgs. 81/2008, art. 71 e Allegato VII): per gli
  apparecchi di sollevamento oltre 200 kg il datore di lavoro chiede la **prima
  verifica entro 60 giorni dalla messa in servizio** (la fa l'INAIL, che
  redige la scheda tecnica); le successive ogni 1-3 anni secondo tipo ed età,
  da ASL o soggetti abilitati. *[risultati di ricerca: tussl.it, progetto81.it,
  biblus.acca.it, puntosicuro.it]*
- **Il sinistro**: dopo un urto o un danno l'assicurazione chiede una denuncia
  con data, ora, luogo, mezzo (targa o telaio), conducente, dinamica, danni a
  cose e persone, testimoni e foto. *[deduzione di mestiere: nessuna fonte
  trovata sul modulo specifico per le macchine operatrici]*

### Fonti (seconda mano)

- PuntoSicuro — La manutenzione in sicurezza delle macchine movimento terra: https://www.puntosicuro.it/edilizia-C-10/la-manutenzione-in-sicurezza-delle-macchine-movimento-terra-AR-12189/
- movimento-terra.it — Guida alla manutenzione dei macchinari movimento terra: https://movimento-terra.it/guida-alla-manutenzione-dei-macchinari-movimento-terra/
- Assimpredil Ance — RCA obbligatoria anche per le macchine operatrici che non circolano su strada: https://portale.assimpredilance.it/articoli/assicurazione-rca-obbligo-anche-per-le-macchine-operatrici-che-non-circolano-su-strada
- ASAPS — Responsabilità civile macchine operatrici e carrelli elevatori: https://www.asaps.it/downloads/files/responsabilita_macchine_operatrici.pdf
- Assimpredil Ance — Revisione macchine operatrici, nuove proroghe: https://portale.assimpredilance.it/articoli/revisione-macchine-operatrici-nuove-proroghe
- Certifico — Revisione generale macchine agricole e operatrici, tabella scadenze: https://www.certifico.com/sicurezza-lavoro/news-sicurezza/revisione-generale-macchine-agricole-e-macchine-operatrici-tabella-scadenze
- TUSSL — Allegato VII, D.Lgs. 81/2008: https://tussl.it/allegati/allegato-vii
- Biblus — La guida INAIL per la verifica periodica degli apparecchi di sollevamento: https://biblus.acca.it/guida-inail-apparecchi-di-sollevamento/
- FleetRabbit — Mining fleet management software for small mines and quarries 2026: https://fleetrabbit.com/industry/mining-fleet-software/best-mining-fleet-management-software-small-mines-quarries-2026
- Clue — Fleet maintenance software with telematics and ERP: https://www.getclue.com/blog/fleet-maintenance-software-with-telematics-and-erp

### Domande per il delta (sul MECCANISMO, non sul nome)

1. Chi pianifica il tagliando, e su che cosa: ore o calendario?
2. Chi sa quando scade la verifica dell'attrezzatura, e chi sa quando scade la PRIMA?
3. Chi tiene la scadenza dell'assicurazione, e che cosa dice del mezzo che non esce dalla cava?
4. Chi conosce l'identità del mezzo (targa, telaio, matricola, anno, messa in servizio)?
5. Chi registra un sinistro, e chi lo consegna all'assicurazione?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `9e56a538`)

- **Domanda 1 — C'È, a ore motore.** `PIANI_TAGLIANDO` con i quattro passi
  del mondo (`grep -cE 'ogniOre: (250|500|1000|2000)'` → 7),
  `prossimoTagliando` che pianifica il successivo alla chiusura,
  `urgenzaTagliando` e `contatoreDelTagliando` sulle ore; la telematica
  (AEMP/ISO 15143-3) è la ricerca del 04/09 (`grep -cE 'ISO 15143|AEMP'`
  in questo documento → 33). **Niente da aggiungere.**
- **Domanda 2 — C'È la periodica, MANCA la prima.** `SCADENZE_MEZZO_PRESET`
  ha `verifica-periodica` (→ 2) e la nota dice che «la prima verifica la
  fa l'INAIL» (`grep -ciE 'prima verifica'` → 1, nella nota), ma nessun
  meccanismo sa QUANDO scade la prima: il mezzo non ha una data di messa in
  servizio (`grep -ciE 'messaInServizio|messa in servizio|immatricol|telaio|matricola'`
  su modulo e pagina → apps/flotta/flotta-data.js:2 apps/flotta/index.html:0, e le due del modulo sono «immatricolate» nella nota della revisione) e i 60 giorni non si calcolano — oggi l'utente
  scrive la data a mano, come per ogni scadenza. **Mancanza confermata,
  piccola e aperta**: la data di messa in servizio sul mezzo e un preset
  «prima verifica» a **giorni** (60) da quella data, non a mesi.
  ✅ **FATTO lo stesso giorno, unità 89**: `messaInServizio` sul mezzo,
  preset `prima-verifica` a 60 giorni, `primaVerificaDa`/`scadenzaDaPreset`,
  la proposta nella pagina, la nota dell'assicurazione. Prova: `grep -c
  'chiave: "prima-verifica"' apps/flotta/flotta-data.js` → 1.
- **Domanda 3 — C'È.** Il preset `assicurazione` (→ 1) a 12 mesi con la
  data della polizza. Il mondo aggiunge una cosa che la nota non dice: l'RCA
  vale **anche per il mezzo che non esce mai dalla cava**. **Delta di testo**,
  senza numero di legge in schermata: si fa insieme alla voce della domanda 2.
- **Revisione — C'È** (`chiave: "revisione"` → 2, 60 mesi, mezzi targati).
  Che l'obbligo non sia ancora operativo è uno stato che cambia con un
  decreto: **non si scrive nel prodotto** — chi lo scrivesse oggi lo
  troverebbe falso domani. Dichiarato.
- **Domanda 4 — MANCA, e chiede una decisione.** Il mezzo ha nome, tipo, ore,
  area e stato: nessuna targa, telaio, matricola, anno (→ apps/flotta/flotta-data.js:2 apps/flotta/index.html:0). Il libretto
  (`csvLibretto`) e la denuncia di sinistro li vorrebbero. È una scelta di
  modello dati (quali campi, e se obbligatori): **dichiarato, non aperto** —
  la data di messa in servizio della domanda 2 ne è il primo campo, e apre
  la strada.
- **Domanda 5 — MANCA.** Nessun sinistro in Flotta (`grep -ciE 'sinistr|incidente'`
  su modulo e pagina → apps/flotta/flotta-data.js:0 apps/flotta/index.html:2, e le due della pagina sono «a sinistra»: la
  regex prende `sinistr` anche lì — un righello largo, dichiarato); le causali dei fermi sono "guasto-meccanico" "guasto-idraulico" "guasto-elettrico" "gomme-cingoli" "attesa-ricambi" "manutenzione" "verifica" "operatore" "meteo" "altro"— un urto oggi si registra come
  fermo per guasto, e l'infortunio della persona sta in Scudo. Un sinistro
  del mezzo è un fatto a cavallo delle due app (fermo + eventuale infortunio
  + denuncia all'assicurazione): **dove vive** è una decisione. Dichiarato.

**Riassunto** — 1 mancanza **confermata e aperta** (la prima verifica dalla
messa in servizio, con la nota RCA), 2 **dichiarate** che chiedono una
decisione (l'identità del mezzo; il sinistro), 2 **già a posto** (tagliandi a
ore; assicurazione e revisione come scadenze), 1 stato del mondo che **non si
scrive** (la revisione non ancora operativa).

## Ricerca del 2026-09-11 — terzo giro: che cosa chiedono il leasing, la verifica periodica e i numeri della telematica (il mondo)

⚠️ **Seconda mano, marcata**: fatta con `WebSearch` (che risponde), non con
`WebFetch` (che non legge il testo primario). Nessun numero di norma o di
benchmark entra in una schermata; quelli qui sotto servono a decidere il
delta.

### Come va, fuori

- **Il leasing di una macchina movimento terra**: chi la usa ha obblighi di
  **conservazione, manutenzione e uso** secondo il libretto del costruttore
  (niente funzioni diverse né sollecitazioni oltre quelle ammesse); la
  documentazione della macchina con certificazioni e libretto d'uso e
  manutenzione viaggia col contratto; per l'usato la società di leasing
  chiede una **perizia** del valore; alla scadenza tre strade — **riscatto**
  (valore residuo tipico fra l'1 % e il 5 %), restituzione, o rinnovo con un
  mezzo nuovo. *[risultati di ricerca: movento.academy, spalease.it,
  giulianogroup.eu, credemleasing.it, dirittobancario.it]*
- **La verifica periodica** (D.Lgs. 81/2008, art. 71 c. 11 e Allegato VII):
  la prima verifica la fa l'INAIL (o un soggetto abilitato) su richiesta del
  datore di lavoro, che comunica la messa in servizio allegando la
  dichiarazione CE; poi le periodicità dell'Allegato VII, con la **scheda
  tecnica** rilasciata dopo la prima verifica; un **escavatore con gancio**
  usato per sollevare rientra nel gruppo SC ed è soggetto a verifica
  **annuale** (circolare ISPESL 1088/2003, di seconda mano). *[risultati di
  ricerca: eurocert.it, biblus.acca.it, tussl.it, puntosicuro.it,
  notiziariosicurezza.it, vertest.it, kuadrasrl.com, tecnicasrl.net]*
- **I numeri della telematica** (fornitori e associazioni, non norme): molte
  macchine stanno **al minimo il 40–60 %** delle ore di funzionamento; un
  escavatore al minimo brucia circa un gallone l'ora; le flotte migliori
  tengono gli escavatori sopra il **75 % di utilizzo** contro una media del
  55–65 %; sopra il **60–70 % di utilizzo** delle ore disponibili conviene
  **comprare**, sotto **noleggiare**; il carburante può essere il 10 % del
  ricavo orario prima di manutenzione e ammortamento; la telematica registra
  ore motore, cicli di benna, tempo al minimo, carico. *[risultati di
  ricerca: geotab.com, aem.org, envuetelematics.com, cnba.us, fieldfix.ai,
  quarryingmachinery.com, sectordeepdive.com, pricemachinery.com]*

### Fonti (risultati di ricerca, non lette per intero)

movento.academy · spalease.it · giulianogroup.eu · credemleasing.it ·
dirittobancario.it · eurocert.it · biblus.acca.it · tussl.it · puntosicuro.it
· notiziariosicurezza.it · vertest.it · kuadrasrl.com · tecnicasrl.net ·
geotab.com · aem.org · envuetelematics.com · cnba.us · fieldfix.ai ·
quarryingmachinery.com · sectordeepdive.com · pricemachinery.com.

### Domande per il delta (sul MECCANISMO, non sul nome)

1. Chi calcola quanto costa un'ora di un mezzo, e che cosa ci mette dentro?
2. Chi sa quanto un mezzo lavora rispetto a quanto potrebbe (l'utilizzo)?
3. Chi sa quanto sta al minimo?
4. Chi ricorda la fine del leasing e il riscatto, e chi sa che cosa vale
   la restituzione?
5. Chi tiene le verifiche periodiche dell'Allegato VII, prima verifica e
   annuali?
6. Chi legge la telematica?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `ab12321f`)

- **Domanda 1 — C'È A METÀ, ed è il delta.** `costoOrarioMezzo(interventi,
  rifornimenti)` somma officina e carburante per ora (`euroOra ≈
  euroOraOfficina + euroOraCarburante`, con la bandiera `parziale` quando
  manca un importo). Il **possesso** — la quota d'ammortamento o il canone del
  leasing — non c'è: `grep -ciE 'valore residuo|ammortament|deprezz'` → 0 e 0
  (modulo, pagina), e il record del mezzo porta `nome, ore, area, stato`. Il
  costo orario che il mondo confronta col ricavo (e con cui decide se
  comprare o noleggiare) è **possesso più esercizio**: oggi il nostro è solo
  esercizio, e non lo dice. **Mancanza confermata, aperta**: un campo
  facoltativo sul mezzo (`costoPossessoAnnuo`, canone o quota annua, con
  «da quando»), `costoOrarioMezzo` che aggiunge `euroOraPossesso` quando sa
  le ore all'anno (dal ritmo misurato, `ritmoOreMezzi`) e dichiara «possesso
  non registrato» quando no; il libretto e il fascicolo del mezzo che
  scrivono le tre voci separate.
  ✅ **FATTO l'11/09 (unità 108)**: `costoPossessoAnnuo` + `possessoDal` sul
  mezzo, `euroOraPossesso` / `oreAnno` / `perchePossesso` / `euroOraCompleto`
  in `costoOrarioMezzo(interventi, rifornimenti, mezzi)`, riga «possesso» nel
  libretto, lista con «Col possesso» o «Solo esercizio».
- **Domanda 2 — DICHIARATO, chiede una decisione.** `ritmoOreMezzi` misura
  le ore al giorno dal contatore; l'**utilizzo** vuole un denominatore (le
  ore in cui il mezzo POTEVA lavorare: i turni della cava, che vivono in
  Campo) e quel denominatore è una scelta — 8 ore? i turni registrati? Senza
  di lui il 60–70 % del mondo non si può confrontare. Dichiarato.
- **Domanda 3 — NON MISURABILE senza telematica, e lo si scrive.** `grep
  -ciE 'idle|folle|al minimo'` → 0 e 0. Il contatore del mezzo conta le ore
  motore, non distingue lavoro da minimo: il 40–60 % del mondo è un numero che
  Flotta **non può** dare, e non lo inventa. Resta con la domanda 6.
- **Domanda 4 — MANCA, ed è piccola.** I noleggi sono voci di costo («Noleggi
  esterni») e c'è il preset «Noleggio a freddo» (`grep -c 'noleggio-freddo'`
  → 1); il **leasing** — fine contratto, riscatto, obblighi di restituzione —
  non ha un posto: `grep -ciE 'leasing|riscatt'` → 1 e 0, e l'uno è il
  classificatore delle voci di costo che manda la parola «leasing» fra i
  noleggi (il canone entra come spesa; il contratto, la sua fine e il
  riscatto no). Un preset di
  scadenza «Fine leasing / riscatto» (data del contratto, `mesi: null`, nota
  sulle tre strade e sulla perizia dell'usato) costa cinque righe ed entra
  nella stessa voce aperta della domanda 1 (il canone è il costo di possesso).
  ✅ **FATTO l'11/09 (unità 108)**: preset `fine-leasing` in Flotta (`mesi:
  null`, nota sulle tre strade e la perizia dell'usato, di seconda mano).
- **Domanda 5 — C'È.** I preset dell'art. 71 e dell'Allegato VII (verifica
  periodica, registro di controllo, prima verifica INAIL entro 60 giorni
  dall'unità 89) e la famiglia «sollevamento» che riconosce gru, autogrù,
  piattaforme dal nome: `grep -ciE 'gancio|sollevament|allegato VII|scheda
  tecnica'` → 9 nel modulo. L'escavatore col gancio è un caso di quella
  famiglia: la nota lo può nominare, non serve un preset.
- **Domanda 6 — DICHIARATO (già nel vault).** La telematica è un import
  (`grep -c 'telemat'` → 3, tutti commenti che rimandano alla nota del vault
  «Telematics — cosa può fare Flotta»): una decisione su formati e fornitori,
  non un'unità.

**Riassunto** — 1 mancanza **confermata e aperta** in due pezzi (il costo di
possesso nel costo orario; il preset «fine leasing / riscatto»), 2
**dichiarate** (l'utilizzo, che chiede un denominatore; la telematica), 1
**non misurabile** e scritta come tale (il tempo al minimo), 1 **già a posto**
(le verifiche periodiche).

---

## 15/09 — sesto giro di ricerca mirata: manutenzione preventiva basata sul trend, non solo su soglie fisse

*Nota di processo: prodotta da un agente in background, lanciato stavolta
con `isolation: "worktree"` per la lezione pagata nel giro precedente
(collisione fra agenti nella stessa cartella). La worktree era però
staccata da un commit di fine agosto, quindi il suo `git log`/i suoi
numeri di riga non sono quelli di questa sessione: il contenuto sotto è
stato riverificato di persona sul codice VERO di questa sessione (righe
corrette), non copiato dal suo report.*

**Il meccanismo, verificato**: Flotta decide le manutenzioni SOLO su
soglie fisse — `urgenzaManutenzione` (`flotta-data.js:2835`) confronta
`urgenzaTagliando` (via ore) e `urgenza` (via data), nessuna delle due
guarda un trend. `prioritaOperative` (`flotta-data.js:1429`) fa lo stesso.
I dati per un trend ESISTONO già come funzioni-punto (non serie storiche):
`consumoPerMezzo` (`flotta-data.js:2941`), `costoOfficinaPerMezzo`
(`flotta-data.js:1888`), `durataFermo`/`giorniFermo`
(`flotta-data.js:3756`/`3749`) — ma calcolano un valore per il periodo
scelto, non una tendenza nel tempo. Verificato:
`grep -in "trend\|predict\|degrad" apps/flotta/flotta-data.js` → **zero
occorrenze** (confermato anche sul codice di questa sessione, non solo su
quello della worktree).

**Le due lacune (confermate)**:
1. **Fascicolo mezzo**: nessun "consumo medio storico vs attuale" né
   "costo per intervento in aumento" né "frequenza fermi in aumento/calo"
   — solo i totali. I CMMS professionali segnalano un mezzo 20-45 giorni
   prima del guasto usando esattamente questi tre segnali (fonti citate
   dall'agente, marcate `[proposto da ricerca, non verificato]`: oxmaint,
   heavyvehicleinspection, fleetrabbit — cifre di settore non riverificate
   da qui, solo la lacuna nel codice lo è).
2. **Priorità operative**: `prioritaOperative` riordina solo su giorni
   rimasti alla scadenza, mai su un segnale di trend — un mezzo con
   consumi in forte aumento non sale in priorità anche se la scadenza è
   lontana.

**Costo indicativo** (stima dell'agente, non verificato): medio-alto per
il fascicolo (serve storicizzare i valori, oggi calcolati "a periodo" e
non conservati come serie), piccolo per il riordino di `prioritaOperative`
una volta che il trend esiste.

**Riassunto** — 2 lacune **confermate** (nessuna funzione di trend esiste,
verificato indipendentemente sul codice vero); nessuna era già coperta
dai giri di ricerca precedenti su Flotta.

⛔ **CORREZIONE DEL 15/09, RIVERIFICANDO PRIMA DI IMPLEMENTARE: UN TERZO DELLA
LACUNA 1 ERA GIÀ FALSA.** Il grep dell'agente (`trend|predict|degrad`) non
trova `consumoControStoria` (`flotta-data.js`), che fa esattamente «consumo
medio storico vs attuale» — finestra recente contro tutto ciò che c'è prima,
con `TOLLERANZA_CONSUMO_PCT` dichiarata — **da prima di questo giro di
ricerca** (nata il 02/09, un giro di ricerca precedente su Flotta, già wired
in `index.html` e mostrata riga per riga nella lista rifornimenti). È lo
stesso difetto descritto altrove in questo file — «cercare il nome del mondo
invece del meccanismo» — applicato dall'agente a sé stesso, dentro la sua
propria area di competenza.
✅ **FATTO lo stesso giorno**: la parte vera della lacuna 1, «costo per
intervento in aumento», mancava davvero (`grep -in "trend\|predict\|degrad"`
confermato a zero anche da qui). Aggiunta `costoControStoria(interventi,
nomeMezzo, oggi, finestraGiorni=90)`, stessa forma di `consumoControStoria`
ma sulla MEDIA per intervento (non una somma per ora — un mezzo con un
intervento in più nella finestra non deve sembrare più caro se ognuno gli
costa uguale). Soglia dichiarata `TOLLERANZA_COSTO_PCT = 25` (più larga di
quella del carburante: il costo di un intervento varia da sé fra un
tagliando e una riparazione, nessuna fonte del 15/09 dà una tolleranza di
settore per questo segnale). Wired in `fascicoloMezzo` (`costoStoria`) e
nel libretto macchina (`sch-int`), accanto al recap dell'officina.
✅ **FATTO lo stesso giorno**: la lacuna 2, `prioritaOperative` che ora
accetta anche `rifornimenti` e `interventi` (facoltativi) e aggiunge una
voce categoria "trend" (gravità "warn") per ogni mezzo OPERATIVO il cui
consumo o costo per intervento è sopra la sua tolleranza dichiarata —
RIUSA `consumoControStoria`/`costoControStoria`, non ne riscrive una copia
qui dentro. Un mezzo fermo o in verifica non riceve il trend: è già in
cima per una ragione più urgente. Wired in `index.html` passando `RIF` e
`INT` alla chiamata esistente; senza i due parametri il comportamento
resta quello di prima, parola per parola.
⏱️ **Resta aperta**: «frequenza fermi in aumento/calo» (terzo segnale
della lacuna 1 — richiede storicizzare `durataFermo`/`giorniFermo` come
serie, non solo un totale). È l'unica lacuna del sesto giro ancora aperta.

---

## 15/09 — settimo giro di ricerca mirata: decisioni di sostituzione mezzi e total cost of ownership

**Tema**: Supporto alle decisioni di sostituzione dell'attrezzatura basato su costo totale di proprietà (TCO), ciclo di vita e analisi di convenienza economica fra riparazione e sostituzione.

### Che cosa esiste già in Flotta

**PASSO 1 - Verifica dei meccanismi** (ripetibile con `grep -in`):
- `possessoDal`: data d'inizio possesso/locazione (ISO) — aggiunto 11/09
- `costoPossessoAnnuo`: canone annuo di leasing o quota annua d'ammortamento (EUR) — aggiunto 11/09
- `messaInServizio`: data di messa in servizio dell'attrezzatura (ISO) — aggiunto 11/09
- `costoOrarioMezzo(interventi, rifornimenti)` — calcola costo orario medio per mezzo (interventi + carburante)
- `costoControStoria(interventi, nomeMezzo)` — trend dei costi di manutenzione (finestra recente vs storico)
- `consumoControStoria(rifornimenti, nomeMezzo)` — trend di consumo carburante
- `affidabilitaFlotta(fermi, mezzi)` — tempo di fermo e perdita di disponibilità per mezzo
- `ritmoOreMezzi(letture)` — ritmo di accumulo delle ore motore (previsione di tagliandi futuri)

**Uscita grep**:
```
grep -n "possessoDal\|costoPossessoAnnuo\|messaInServizio" apps/flotta/flotta-data.js | head -5
6:                        costoPossessoAnnuo? (€: canone di leasing o quota annua), possessoDal? (ISO) — dal 11/09 }
223:    { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5870, area: "fronte Est", stato: "operativo", tipo: "escavatore", costoPossessoAnnuo: 42000, possessoDal: "2024-01-15" },
229:    { id: "m5", nome: "Perforatrice P2 — Epiroc", ore: 2980, area: "fronte Est", stato: "verifica", tipo: "perforatrice", messaInServizio: "2026-08-25" },
530:export function primaVerificaDa(messaInServizio, giorni = 60) {
```

### PASSO 2 - Ricerca mirata: pratica mondiale su TCO e decisioni di sostituzione

**Query WebSearch**: "fleet vehicle replacement decision total cost of ownership mining equipment 2026"

**Risultati primari** (fonti di seconda mano — non verificate da primarie):
1. **Total Cost of Ownership (TCO)**: include acquisition cost, fuel consumption, maintenance labor, parts, insurance, depreciation, disposal, e downtime cost. Mining equipment replacement è guidato da costo orario crescente e perdita di produttività.
2. **Maintenance cost thresholds** (NFPA, industry practice): attrezzatura nuova ~$0.15–$0.25/hour (all-in: fuel + preventive maintenance); attrezzatura >10 anni ~$1.10+/hour (reactive repairs, downtime). Soglia tipica di sostituzione: quando la manutenzione supera il 60% del valore attuale o costo orario raddoppia.
3. **Residual value** (leasing standard): equipment residuale tipico 1–5% del valore di acquisto a fine leasing (come già citato in RICERCA_FLOTTA 4, del 02/09).
4. **Mining-specific**: decisione repowering vs. sostituzione dipende da produttività marginale, conformità normativa (emissioni), e costo di opportunità del fermo.
5. **AEMP 2.0 / ISO 15143-3** telemetry standard (giro 3, già documentato): integra dati motore (ore, consumi, temperature, codici guasto) con costi per decisioni automizzate.

**Dichiarazione di fonte**: tutti i numeri ($0.15–$0.25/hour, 60%, 1–5%) sono riportati da risultati di ricerca, non verificati da testi primari. La soglia del 60% è pratica dichiarata, non legge.

### PASSO 3 - Delta: Flotta vs. pratica mondiale

**Schermata**: Fasciicolo del mezzo (`fascicoloMezzo` in `index.html`). Mostra ore attuali, stato, manutenzioni, consumo carburante, costi di officina, tendenza di consumo e costo — ma NESSUN dato di ciclo di vita economico.

**Che cosa non va**: Flotta traccia costi operativi (manutenzione, carburante) e disponibilità, ma NON calcola:
- **Total Cost of Ownership (TCO)**: somma unica di acquisition + operating costs + downtime
- **Costo orario ammortizzato**: `costoOrarioMezzo` include solo interventi + rifornimenti, non la quota di ammortamento del possesso annuale
- **Età dell'attrezzatura e deprecazione**: `possessoDal` e `messaInServizio` esistono ma nessuna funzione le usa per calcolare anni di servizio o residuo
- **Soglia di sostituzione**: nessun meccanismo per confrontare "cost to repair" (intervento singolo) vs. "cost to replace" (TCO di un mezzo nuovo)
- **Previsione di convenienza**: nessun segnale quando il costo orario supera una soglia di industria (tipo i $1.10/h per mezzo >10 anni)

**Come si vede**: Nella lista priorità (`prioritaOperative`), un mezzo vecchio che costa molto di manutenzione appare solo come "trend warn" (costo per intervento in aumento), non come "decision point: convenibile sostituirlo?". Chi legge vede i numeri e sa che costano molto, ma non ha un numero unico (TCO o costo orario ammortizzato) che dica sì/no.

**Quanto costa** (sforzo per colmarla):
- Calcolare età in anni: `etaMezziAnni(possessoDal, oggi)` — una riga, usabile in `costoOrarioMezzo` e in filtri
- Amortizzare costo annuale: `costoAmmortizzatoOreAnnuali(costoPossessoAnnuo, oreAnnue)` — aggiunge quota possesso al costo orario
- TCO su base storica: `tcoMezzo(mezzo, interventi, rifornimenti, anni_possesso)` — un'unica funzione che somma acquisition (costoPossessoAnnuo × anni) + operating costs (interventi + rifornimenti) + availability loss (downtime cost).
- Soglia di sostituzione: `meritoDiSostituzione(mezzo, dati)` — segnala se TCO orario supera soglia di industria (60% di valore nuovo, o $1.10/h per >10 anni)

**Come si misura**:
- **Verifica d'esito**: per tre mezzi di età diversa (2, 6, 12 anni), `tcoMezzo` deve restituire somma di: (costoPossessoAnnuo × anni) + (sum interventi) + (sum rifornimenti). Controllare su una copia fissa che il numero cambi se si varia uno dei tre addendi.
- **Accuratezza TCO orario**: per mezzo di 10 anni con 50.000 ore, costo possesso €50k/anno (€500k totale), interventi €120k, rifornimenti €180k → TCO totale €800k → €16/ora. Verificare che `tcoMezzo` non esca né 12/h (missing possesso) né 18/h (double-counting).
- **Segnale soglia**: un mezzo a €1.50/ora deve accendere il segnale di sostituzione (oltre la soglia); uno a €0.90/h no. Testare su due ricette di dati, una per lado della soglia.
- **Coerenza con costoOrarioMezzo**: il nuovo TCO orario deve dichiarare che cosa include e cosa no (es. «include amortamento, esclude downtime» se si sceglie di non pesare il fermo) — un conto nascosto è un conto che diverge dal vecchio senza che nessuno lo veda.

### Note e fonti

- **Tema già toccato?**: No. I giri precedenti hanno coperto AEMP 2.0, costi di manutenzione per intervento, consumo carburante, trend di affidabilità. Nessuno ha unificato questi nella decisione di sostituzione e ciclo di vita economico.
- **False mancanze corrette**: no — il tema è genuino e misurabile.
- **Checkpoint di progetto**: il commit `c3888fe` (fine 14/09) non contiene TCO, amortamento o segnale di sostituzione. La ricerca è contemporanea a quella data.

---

## 15/09 — correzione (mia, non della ricerca): "costo orario ammortizzato" era già scritto

⛔ **Riletto il codice PRIMA di scrivere la prima fetta del delta, e la
mancanza n. 2 sopra è FALSA — `costoOrarioMezzo` l'ammortamento del
possesso lo calcola già.** `grep -n "euroOraCompleto\|euroOraPossesso"
apps/flotta/flotta-data.js apps/flotta/index.html`:

```
apps/flotta/flotta-data.js:2085:    const euroOraPossesso = possessoAnnuo != null && possessoAnnuo > 0 && oreAnno ? Math.round(...) : null;
apps/flotta/flotta-data.js:2103:      euroOraPossesso, perchePossesso,
apps/flotta/flotta-data.js:2110:      euroOraCompleto: ore && !nienteSpesa && euroOraPossesso != null ? Math.round(100 * (spesaInFinestra / ore + euroOraPossesso)) / 100 : null,
apps/flotta/index.html:2301:          <div class="meta">${m.euroOraCompleto != null
apps/flotta/index.html:2302:            ? `Col possesso: <b>${eur(m.euroOraCompleto)}</b> <span class="u">/h</span> (${eur(m.possessoAnnuo)} all'anno su ${numTx(m.oreAnno)} ore all'anno misurate)`
```

`euroOraCompleto` spalma `costoPossessoAnnuo` sulle ore/anno della
finestra del contatore e lo somma a officina+carburante — esattamente
l'"ammortizzare costo annuale" che la mancanza n. 2 proponeva di
costruire da zero — ed è già mostrato nel fascicolo del mezzo
(`sch-kpi`, riga "Col possesso"). La mancanza n. 2 e la relativa voce
di "quanto costa"/"come si misura" sopra non vanno tradotte in codice.

**Il delta vero, molto più stretto**: `pagellaMezzi` — la funzione che
CONFRONTA i mezzi fra loro e alimenta `prioritaOperative` — usa
`c.euroOra` (solo officina+carburante) contro `mediaEuroOra` (anch'essa
solo esercizio), MAI `euroOraCompleto`. Verificato leggendo
`pagellaMezzi` (flotta-data.js:4048-4132): lo scostamento che decide
`fermo`/`costo`/`verdetto` è tutto calcolato sul €/h di solo esercizio.
Quindi: un mezzo con un canone di leasing alto ma poca officina appare
"in linea" o "sotto media" nella pagella — la schermata che il parco
usa per decidere quale mezzo guardare per primo — anche se il suo
costo pieno (mostrato solo nel SUO fascicolo, mai nel confronto) è il
più alto della flotta. È lo stesso principio del fondatore delle
mancanze n. 3/4/5 sopra (nessun segnale unico che dica "conviene
sostituirlo"), ma la causa è diversa e più piccola: non manca il
calcolo, manca il suo USO nel confronto fra macchine.

**Quanto costa**: molto meno della n. 2 originale — `pagellaMezzi` già
riceve `righeCosto` (l'array di `costoOrarioMezzo`, che porta
`euroOraCompleto`); serve aggiungere una seconda media
(`mediaEuroOraCompleto`, sugli stessi mezzi con `euroOraCompleto` non
nullo) e un secondo scostamento, SENZA toccare `costoOrarioMezzo`.

**Come si misura**: due mezzi con lo stesso `euroOra` di esercizio ma
`costoPossessoAnnuo` diverso (uno 0/non registrato, uno alto) devono
avere lo stesso verdetto sull'esercizio e uno scostamento diverso sul
completo — e un mezzo senza `costoPossessoAnnuo` registrato non deve
uscire "in linea" per finta: deve dichiarare che il confronto pieno
non è possibile per lui (stessa regola delle bandiere non lette,
regola 20 di `run-stile`).

Non preso per costruzione in questa unità: prima fetta del delta TCO
fatta separatamente (`etaMezzo`, sull'età del mezzo, indipendente da
questo e già committata).

---

## 16/09 — undicesimo giro: componenti a vita propria, manutenzione su condizione, trend fermi, curva di sostituzione, costo per unità di produzione

*Nota di processo (regola 1): letto per intero questo documento (1458 righe,
9+ giri precedenti dal 14/08 al 15/09) prima di proporre. Già confermati
esistenti e quindi NON riproposti: `costoOrarioMezzo`/`euroOraCompleto`,
`consumoControStoria`/`costoControStoria`, `costoPossessoAnnuo`/
`possessoDal`/`messaInServizio`/`etaMezzo`, `CAUSALI_FERMO` con
`naturaFermo`, gli azzeramenti del contatore (`azzeramentiDelMezzo`,
`spezzaLetture`), i piani tagliando a ore o a mesi, le scadenze di legge, il
preset `fine-leasing`. Dichiarati ma non fatti da giri precedenti: la voce
"frequenza fermi in aumento/calo" (sesto giro, 15/09 — ripresa e sviluppata
qui) e l'uso di `euroOraCompleto` dentro `pagellaMezzi` (bug di cablaggio già
diagnosticato, non un tema di ricerca — non ripreso qui).*

Strumento: `WebSearch`; nessuna fonte letta per intero con `WebFetch`. I
cinque comandi grep a zero (o con le righe citate) sono stati **riverificati
indipendentemente** prima di appendere — stesso esito riportato dall'agente
in tutti i casi.

### 1. Pneumatici, cingoli e denti benna (GET): componenti a vita propria
**Come si vede (il mondo, di seconda mano):** i CMMS di flotta pesante
trattano pneumatici e GET come asset con vita propria tracciata a ore/km
separatamente dal veicolo — rotazione, usura, sostituzione predittiva; la
vita utile del GET si misura in ore macchina e varia da 400 a 4.000+ ore per
sito. Sistemi dedicati (Bradken GETVision, Motion Metrics GET Trakka)
tracciano le ore dall'installazione e generano alert vicino al limite.
**Come si vede (prova, riverificata il 16/09):**
    $ grep -rciE "dataMontaggio|oreMontaggio|montatoIl|installatoIl|vitaComponente" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0
Gomme/cingoli/denti benna esistono solo come voce di checklist pre-uso,
causale di fermo, nome di ricambio a magazzino o riga di costo libera:
nessuno porta una data/ora di montaggio né un contatore di vita separato
dalle ore totali del mezzo.
**Il delta:** il pezzo più vicino già esistente è `azzeramentiDelMezzo`/
`spezzaLetture`/`trattoCorrente` — la stessa logica "il contatore può
ripartire da un punto diverso, si tiene un tratto corrente" serve identica
per "questo componente ha un proprio punto di partenza sulle ore del mezzo".
Evento `{mezzo, tipo, montatoAOre, data}` + `vitaComponente(evento,
oreMezzoAttuali)`.
**Quanto costa (stima non verificata):** medio.
**Come si misura:** due componenti sullo stesso mezzo (montati a 4.000h e
8.500h, mezzo oggi a 9.000h) devono dare vita 5.000h e 500h, non un valore
derivato dalle ore totali; un mezzo senza eventi deve dichiarare "vita non
tracciata", non ometterla in silenzio.

### 2. Manutenzione su condizione (analisi olio)
**Come si vede (il mondo, di seconda mano):** i costruttori vendono
programmi di campionamento olio (Caterpillar S·O·S, Komatsu KOWA) a cadenza
250-300h motore / 500h altri componenti, che possono allungare o accorciare
l'intervallo fisso in base all'esito.
**Come si vede (prova, riverificata il 16/09):**
    $ grep -rciE "analisiOlio|campioneOlio|condizione.*manutenzione|manutenzione.*condizione|SOS\b" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0
`pianoTagliando`/`prossimoTagliando` conoscono solo ORE o CALENDARIO
(`{ogniOre, ogniMesi}`); nessun terzo ingresso basato su una misura di
condizione.
**Il delta:** campo opzionale `esitoUltimoCampione` (ok/attenzione/critico +
data); `urgenzaTagliando` tratta "critico" come soglia già scaduta,
"attenzione" come preavviso raddoppiato — riusa l'urgenza esistente.
**Quanto costa (stima non verificata):** medio-basso, **e solo se un
cliente vero fa davvero campionare l'olio** — da verificare in cava prima di
costruire (stessa cautela già scritta in questo documento per altre voci
manuali).
**Come si misura:** due mezzi, stesso piano 500h e stesse ore, uno con
ultimo campione "critico" e uno "ok": il primo deve uscire in cima a
`prioritaOperative`, il secondo no.

### 3. La frequenza dei fermi come TREND (riprende un gap aperto il 15/09)
**Come si vede (il mondo, di seconda mano):** MTBF/MTTR sono KPI core anche
nel mining, ma utili come **andamento**, non come cifra isolata; la
disponibilità media di settore è 72-78%, le operazioni "world-class"
superano il 92%.
**Come si vede (prova, riverificata il 16/09):**
    $ grep -n "fraUnFermoELaltro\|MTBF\|mtbf" apps/flotta/flotta-data.js
    3475: (commento, elenco campi)
    3980: (commento)
    3982:    fraUnFermoELaltro: episodi >= 2 ? Math.round(10 * disponibili / episodi) / 10 : null,
`affidabilitaFlotta` calcola l'MTBF semplificato su **un'unica finestra**,
un valore puntuale — non esiste l'equivalente di `consumoControStoria`/
`costoControStoria` applicato ai fermi.
**Il delta:** `frequenzaFermiControStoria`, terza istanza dello stesso
pattern già scritto due volte nel modulo (finestra recente vs. storia,
soglia di tolleranza nominata, `null`+motivo sotto un minimo di episodi) —
copiare la firma, non reinventare il corpo.
**Quanto costa (stima non verificata):** piccolo — è il caso più a basso
rischio dei cinque, per costruzione (pattern già provato due volte).
**Come si misura:** un mezzo con 2 fermi/30gg e 2 fermi nei 90gg precedenti
(ritmo stabile) → "in linea"; uno con 4 fermi/30gg contro 2 nei 90gg
precedenti (ritmo raddoppiato) → segnalato; meno di 2 episodi totali →
`null` con motivo, mai un "in linea" di comodo.

### 4. Curva di costo crescente e punto di sostituzione (vita economica)
**Come si vede (il mondo, di seconda mano):** il costo/ora di una macchina
scende dopo la messa in servizio, si stabilizza, poi risale quando i
componenti invecchiano; una soglia di screening citata: manutenzione+
riparazione annua che supera il 50% del valore di sostituzione corrente è
segnale per considerare la sostituzione. Un caso mining specifico (Epiroc
Simba) stima una vita economica di circa 7 anni.
**Come si vede (prova, riverificata il 16/09):**
    $ grep -rciE "vitaEconomica|curvaCosto|inflessione|puntoOttimale" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0
`costoControStoria` ha una finestra fissa a 90 giorni per confronto
ravvicinato, non una serie pluriennale con un'inflessione da rilevare.
**Il delta:** (1) funzione che raggruppa interventi+rifornimenti per anno di
vita del mezzo, riusando `costoOfficinaPerMezzo`/`consumoPerMezzo`; (2)
regola che dichiara se gli ultimi 2-3 anni sono in salita rispetto al minimo
storico, con "non abbastanza storia" sotto una soglia minima di anni.
**Quanto costa (stima non verificata):** medio-alto — il più oneroso dei
cinque, perché richiede storicizzare i costi per anno (oggi si calcolano "a
periodo" su richiesta, non si tengono come serie).
**Come si misura:** tre mezzi sintetici (costo/ora piatto, in discesa da
rodaggio, in salita negli ultimi 3 anni) devono ricevere tre verdetti
diversi; un mezzo con meno di 3 anni di storia deve dire "curva non ancora
leggibile", mai un verdetto di comodo.

### 5. Costo per unità di produzione (€/tonnellata o m³ movimentato)
*(già confermata VERA il 14/08 in questo documento — riconfermata oggi)*
**Come si vede (il mondo, di seconda mano):** il trasporto pesa 40-55% dei
costi operativi in cava, misurato come $/tonnellata; il set di KPI core del
settore include esplicitamente "fuel per tonne"/"cost per ton" accanto a
MTBF/MTTR e disponibilità.
**Come si vede (prova, riverificata il 16/09):**
    $ grep -rciE "costoPerTonn|euroPerTonn|perTonnellata|volumiM3|ponteCampo|ponteTerra" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0
    $ grep -niE "ponte.*flotta|flotta.*ponte" shared/dw-ponti.js
    1088: PONTE · FLOTTA → CONTI — LO STESSO EURO CONTATO DUE VOLTE
    1186: PONTE · CONTI → FLOTTA — LA FATTURA DELL'OFFICINA E L'ORDINE DI LAVORO
`shared/dw-ponti.js` ha ponti Flotta↔Conti ma nessun ponte Flotta↔Terra (che
tiene i volumi estratti/movimentati): manca il dato di ingresso, non solo la
funzione — decisione di dove vive il dato prima di scrivere codice, come già
per l'identità del mezzo e il sinistro (giri dell'11/09).
**Quanto costa (stima non verificata):** piccolo per la funzione pura una
volta deciso l'ingresso; medio se si sceglie un ponte nuovo con Terra
(giustificato: serve a due app).
**Come si misura:** mezzo con costo/ora e produzione dichiarata nello
stesso periodo → numero coerente cambiando un input; senza produzione
dichiarata → "non calcolabile: manca la produzione del periodo", mai un
costo/tonnellata a zero o omesso in silenzio.

**Riepilogo:** 5 mancanze confermate (grep riverificati indipendentemente su
tutti e cinque i temi), di cui una (costo per tonnellata) richiede prima una
decisione architetturale (ponte con Terra o campo manuale) e una
(manutenzione su condizione) richiede una verifica di mercato prima del
codice (nessun cliente ha ancora chiesto il campionamento olio). Il tema più
piccolo e pronto per un'unità di codice è il n°3 (trend frequenza fermi):
copia diretta di un pattern già scritto due volte nel modulo.

**✅ 16/09 — il n°3 (frequenza dei fermi contro la storia) è stato
implementato**, commit `9820cb83` (delle 01:10 UTC, prima che questo giro di
ricerca finisse di scrivere il proprio riepilogo — è la forma "il verdetto
regge e la riga invecchia mentre la si scrive" già nota a questo file):
`frequenzaFermiControStoria` in `flotta-data.js`, terza sorella di
`consumoControStoria`/`costoControStoria`, tasso in episodi/giorno (non un
conteggio nudo, i due periodi hanno lunghezze diverse), `TOLLERANZA_FERMI_PCT`
dichiarata come scelta nostra (nessuna fonte di settore la dà). Wired in
`index.html` (riga 1557), test in `run-kpi.mjs`. Restano aperte quattro
mancanze dello stesso giro (costo/tonnellata — decisione architetturale;
manutenzione su condizione — verifica di mercato; curva di costo/vita
economica; guasto→causale con codici DTC).

*Fonti (di seconda mano, via WebSearch): oxmaint.com, uffizio-telematics.com,
raptormining.com, mining-technology.com, bradken.com, cat.com, komatsu.com,
berrytractor.com, opsima.com, heavyvehicleinspection.com,
firgelliauto.com, link.springer.com, thundersaidenergy.com.*

---

## 16/09 — dodicesimo giro: salute unificata del mezzo, anomalie di consumo, valore residuo

*Ricerca indipendente, non continuazione dei giri precedenti. Tre temi ad alto impatto non affrontati dalla ricerca fino al 16/09 (undicesimo giro).*

### 1. Health Index Unificato del Mezzo — scoring di salute 0–100
**Come si vede (il mondo, di seconda mano):**
I moderni CMMS e sistemi di fleet health monitoring (citati da fleetrabbit.com, symx.ai, tenderd.com) combinano tre segnali indipendenti in un unico "health score": frequenza di guasti (MTBF trend), usura meccanica (consumo e costo per intervento in aumento), e disponibilità media. Un mezzo a score alto (80+) richiede monitoraggio leggero; sotto 50 entra in revisione/sostituzione. Il mercato di health monitoring per heavy equipment vale 4,89 mld $ nel 2026 [di seconda mano].

**Come si vede (prova, 16/09):**
    $ grep -rciE "healthIndex|healthScore|indiceS?alute|punteggio.*mezzo" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0

Flotta dispone di tre segnali separati (`frequenzaFermiControStoria`, `costoControStoria`, `consumoControStoria`, `disponibilitaFlotta`) ma li mostra indipendentemente. Non esiste una funzione che li combini in un numero unico per dire "questo mezzo è in ottima/buona/cattiva salute".

**Il delta:** `healthIndexMezzo(mezzo, frequenzaFermi, costoManutenzione, consumo, disponibilita, oggi)` che normalizza ciascun segnale su una scala 0–100 con pesi dichiarati (es. disponibilità 40%, frequenza fermi 30%, usura meccanica 30%), e restituisce un punteggio di salute totale. Visualizzabile nel fascicolo e nella lista di priorità come banda di colore (verde/giallo/rosso).

**Quanto costa (stima):** piccolo — somma pesata di valori già calcolati, nessun dato nuovo.

**Come si misura:** un mezzo con disponibilità 85% (buona), nessun fermo questo mese (buono), consumo e costo in linea (buono) → health index 85+; uno stesso mezzo con disponibilità 60%, 3 fermi nel mese (cattivo), costo di intervento raddoppiato (cattivo) → health index <50; il numero cambia coerentemente al mutare di un segnale.

---

### 2. Anomaly Detection su Consumo Carburante — rilevazione perdite e pattern anomali
**Come si vede (il mondo, di seconda mano):**
Le piattaforme di fuel management per mining (fleetrabbit.com, farmonaut.com, brevetti USPTO 11993507/10246104) utilizzano machine learning per identificare anomalie in tempo reale: consumo improvviso doppio, refueling fuori zona approvata, flusso di carburante con motore spento, serbatoio che scende senza rifornimento. Gli standard industriali vedono guadagni di 11–15% di efficienza quando vengono implementati controlli sistematici. Una perdita di carburante non rilevata costa 15–25% in più del budget annuale di gasolio [di seconda mano].

**Come si vede (prova, 16/09):**
    $ grep -rciE "anomal.*consumo|perdita.*gasolio|consumoAnomal|outlier|anomalia.*combustibile" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0

`consumoPerMezzo` calcola media l/h e €/h per mezzo e periodo, con dichiarazione di pieni senza euro e minimo di finestra. `consumoControStoria` confronta finestra recente (90gg) contro storico totale. Nessuna funzione identifica il singolo rifornimento fuori norma, il pattern di consumo cambiato, o la perdita graduale rispetto al ritmo teorico del mezzo.

**Il delta:** `consumoAnomalyDetection(rifornimenti, mezzo, oreAttuali, tolleranzePercent)` che per ogni rifornimento calcola: (1) il consumo atteso basato su ore fra due rifornimenti e il consumo medio storico del mezzo; (2) il delta fra atteso e osservato; (3) se il delta supera la tolleranza dichiarata (es. +25% per sopravventure, −20% per sospetto furto), restituisce una riga di alert con mezzo, data, motore e azione suggerita.

**Quanto costa (stima):** piccolo — calcolo puro su dati già presenti, nessuna telematica nuova.

**Come si misura:** un mezzo con consumo storico 35 l/h, ultimo rifornimento dopo 50 ore di lavoro, osservato 1.400 litri → consumo atteso ~1.750 l, rilevato 1.400 l = −20% → segnala "possibile perdita il 15/09"; stesso mezzo, giorni dopo, rifornimento di 2.100 litri dopo 50 ore → +20% → avviso "consumo alto il 17/09, verificare carico/velocità". Test su tre mezzi sintetici (consumo stabile, in aumento, con spike anomali) deve produrre tre verdetti diversi.

---

### 3. Stima Automatica del Valore Residuo — deprecazione e decisione di sostituzione
**Come si vede (il mondo, di seconda mano):**
I modelli predittivi accademici (ASCE Journal of Computing in Civil Engineering, researchgate.net) e commerciali (Fleet Residuals, automotive-fleet.com, fleetnews.co.uk) stimano il valore residuo di heavy equipment basandosi su età, ore motore accumulate, trend di costi di manutenzione, disponibilità media nel periodo. Una macchina nuova con zero fermi e consumo stabile conserva il 75–80% del valore dopo 3 anni; una stessa classe con 6 fermi/anno e costo di manutenzione raddoppiato cala a 40–50% [di seconda mano, nessuna fonte primaria letta].

**Come si vede (prova, 16/09):**
    $ grep -rciE "valoreResiduo|residualValue|deprecazione|stimaValore|valutazioneAuto" apps/flotta/flotta-data.js apps/flotta/index.html
    apps/flotta/flotta-data.js:0
    apps/flotta/index.html:0

Flotta dispone di: `etaMezzo(possessoDal, oggi)` (anni dal possesso), `costoPossessoAnnuo` (canone), `costoOrarioMezzo` (spesa operativa), `costoControStoria` (trend di manutenzione), `affidabilitaFlotta` (disponibilità). Nessuna funzione combine questi in una stima di valore residuo corrente.

**Il delta:** `valoreResiduo(mezzo, costoDiAcquisizione, etaAnni, oreMotore, trendCostoManutenzione, disponibilitaMedia, prezzoMercatoDiRiferimento)` che applica una formula combinata — decremento base per anni (deprecazione retta 10–15% annuo), riduzione aggiuntiva per usura (trend di costo in salita, disponibilità sotto soglia), e stima del recupero di scarto metallico di fine vita. Restituisce valore residuo EUR e percentuale di perdita di valore rispetto all'acquisizione.

**Quanto costa (stima):** medio — richiede decidere i parametri della deprecazione (velocità, fattori di riduzione per usura) e validare contro i prezzi di scrap reali di mercato per quel tipo di mezzo.

**Come si misura:** tre mezzi di stessa classe, stesso prezzo di acquisto 100k EUR, età 2/5/10 anni, trend di costo e disponibilità diversi → tre stime di residuo diverse; controllo su mezzo storico del cliente (es. venduto 2 anni fa a X, prezzo stimato il giorno prima della vendita Y) → differenza fra stima e prezzo reale < 15%; mezzo in fine vita (>15 anni, no disponibilità) → residuo stimato solo come scrap metallico, mai valore negativo.

---

**Riassunto:** 3 mancanze confermate (grep su entrambi i file → 0 in tutti i tre temi). Ordine suggerito di priorità:
1. **Health Index** — piccolo, impatto immediato sulla priorità operativa, riusa dati esistenti
2. **Anomaly Detection su consumo** — piccolo, rilevanza alta per perdite/furti, genera alert concreti
3. **Valore Residuo** — medio, rilevanza strategica su decisioni di sostituzione, richiede decisioni su parametri di mercato

*Fonti (di seconda mano, via WebSearch): fleetrabbit.com, farmonaut.com, symx.ai, tenderd.com, worldmetrics.org, ascelibrary.org (ASCE Journal 2008), researchgate.net, automotive-fleet.com, fleetnews.co.uk, USPTO (11993507, 10246104, 12006203, 12330927, 9418557).*

---

**⛔ 16/09 — riverifica indipendente (regola "niente entra sulla parola dell'agente"), prima di tradurre queste tre proposte in codice.**

La proposta **#2 (Anomaly Detection su consumo carburante) è probabilmente un
falso "non c'è": il MECCANISMO esiste già sotto un altro nome.**
`consumoControStoria` (in `flotta-data.js`, dal delta della ricerca continua
dell'undicesimo giro — vedi sezione precedente di questo stesso documento)
confronta già il tasso di consumo recente contro la storia del mezzo, con una
tolleranza dichiarata (`TOLLERANZA_CONSUMO_PCT`) e un verdetto `forbicePct`/
`verso`: è esattamente "rileva un pattern anomalo nel consumo confrontando
con la storia del mezzo", la definizione stessa della proposta #2. La
ricerca ha cercato `anomal.*consumo|perdita.*gasolio|consumoAnomal|outlier`
(0 risultati, corretto: quelle parole non ci sono) senza aprire
`consumoControStoria` per leggere COSA fa, non come si chiama — è la trappola
già scritta in CLAUDE.md: *"la domanda 'c'è X?' si sbaglia, la domanda 'chi
calcola Y?' no"*. Verificato aprendo il codice (righe 4717 e seguenti):
`consumoControStoria(rifornimenti, nomeMezzo, oggi, finestraGiorni)` scarta il
primo pieno di ogni tratto (il gasolio già dentro non è misurabile), richiede
almeno due pieni con ore in ciascun periodo, e dichiara `perche` quando non
può giudicare — le stesse regole di onestà che la proposta #2 chiederebbe.
**Non tradurre in codice.**

Le proposte **#1 (Health Index) e #3 (Valore residuo) non sono state
riverificate con lo stesso rigore** e meritano una lettura mirata prima di
scomporle in un'unità:
- **#1** rischia di sovrapporsi a `pagellaMezzi` (già in `flotta-data.js`),
  che confronta costo e disponibilità contro la media del parco con verdetti
  distinti (`in linea`/segnalato/`solo-meta`) — MA non li fonde in un unico
  numero 0-100. Prima di scrivere un health index, va deciso se un punteggio
  unico è coerente con lo stile di questo prodotto (che tipicamente tiene le
  dimensioni separate proprio per non nascondere un'assenza di dato dietro
  un numero tranquillo — vedi il principio del fondatore su questo in
  CLAUDE.md) o se il valore vero sta altrove (es. un badge riassuntivo che
  RIMANDA alle due misure esistenti invece di sostituirle).
- **#3** si sovrappone parzialmente al delta #4 già aperto in questo stesso
  documento ("Curva di costo crescente e punto di sostituzione — vita
  economica"): quello risponde a QUANDO sostituire, questo a QUANTO vale
  oggi. Sono domande diverse ma usano gli stessi ingredienti (età, trend di
  costo, disponibilità) — leggere prima il delta #4 per non costruire due
  funzioni che duplicano la stessa curva con parametri diversi e
  scoordinati.

Nessuna delle tre proposte è entrata in roadmap da questa riverifica.

---

## 16/09 — censimento a doppio punto di chiamata: candidato trovato, MA non della stessa famiglia dei tre difetti veri di oggi

Stesso giorno, stesso metodo che ha trovato tre difetti veri su Campo,
Terra e Conti (una scrittura chiamata da più punti della pagina, confronto
delle chiavi passate). Su Flotta il candidato più forte trovato da un
agente Explore era: il salvataggio manuale di un mezzo
(`index.html:4625/4628`) scrive `tipo`/`messaInServizio`/`costoPossessoAnnuo`/
`possessoDal`; l'import CSV (`index.html:4738`,
`db.aggiungi("mezzi", { nome: r.nome, area: r.area, ore: r.ore, stato: r.stato })`)
ne scrive solo quattro.

**Verificato personalmente, e la conclusione è diversa da quella
proposta**: a differenza dei tre difetti di oggi (dove il dato ERA
disponibile — parsato dal CSV o presente nello stato della pagina — e si
perdeva solo nella scrittura), qui **il dato non esiste da nessuna parte
da cui prenderlo**. `parseMezziCsv` (`flotta-data.js:1161-1183`) legge
strutturalmente solo `nome;area;ore;stato` — lo dice anche il messaggio
d'errore della pagina («le colonne devono essere nome;area;ore;stato»,
`index.html:4730`) — e **non esiste nessun `csvMezzi` esportatore**
(`grep -n "csvMezzi\|CSV_MEZZI_INTESTAZIONE" apps/flotta/flotta-data.js`
→ zero risultati): l'import di Flotta è un onboarding di un parco nuovo,
non il giro export→import di una copia di sicurezza come per i clienti di
Conti o i rilievi di Terra.

E il commento su `costoOrarioMezzo` (`flotta-data.js:2037-2047`, 11/09)
conferma che `costoPossessoAnnuo` è **già** un campo opzionale con la
gestione «senza il campo, resta `null` con la ragione — mai uno zero»: un
mezzo importato da CSV senza possesso registrato mostra esattamente lo
stesso «possesso non registrato» di un mezzo aggiunto a mano il cui
proprietario ha lasciato il campo vuoto. Non c'è modo di distinguere i due
casi dallo schermo, ma è la stessa ambiguità che esiste già per QUALUNQUE
mezzo con quel campo vuoto — non una regressione introdotta dall'import.

**Conclusione: questa NON è la stessa famiglia dei tre difetti trovati
oggi.** È un limite di FORMATO (il CSV di onboarding ha quattro colonne
per scelta, non quattro per un errore di trascrizione), non un difetto di
CABLAGGIO (un dato presente altrove e perso in un punto). La domanda
giusta per chi volesse ampliarlo non è «perché manca», è una decisione di
prodotto: vale la pena dare a Flotta un `csvMezzi` esportatore e un
formato di import più ricco, come Terra e Conti hanno per le loro
entità principali? Non deciso qui, di proposito — è la stessa famiglia di
decisione architetturale che questo documento e CLAUDE.md chiedono di non
prendere di sfuggita dentro un'unità che doveva solo cercare un difetto.

Nessun codice toccato in questa unità: il censimento a doppio punto di
chiamata su Flotta non ha trovato un difetto della famiglia cercata.

---

## Ricerca del 2026-09-16 — import/export CSV completo dei mezzi per backup/restore e onboarding

⛔ **CORREZIONE (16/09, subito dopo, riverifica indipendente): due dei
numeri di riga citati sotto sono sbagliati — verificati con `sed -n` sul
file vero, non presi sulla parola dell'agente.**
- **`index.html:4334-4339` NON è il salvataggio manuale.** È il codice che
  popola il FORM di modifica quando si apre un mezzo esistente (`$("mez-
  servizio").value = ...`), non la scrittura nel database. La chiamata
  vera che scrive è `db.aggiungi("mezzi", {...})` a **riga 4628** (con
  `tipo`/`messaInServizio`/`costoPossessoAnnuo`/`possessoDal`) e
  `db.aggiorna("mezzi", ...)` a **riga 4625** — misurato oggi stesso, in
  un'unità precedente di questa stessa giornata (censimento a doppio
  punto di chiamata su Flotta).
- **`index.html:4480-4487` NON è l'import CSV dei mezzi.** Quel blocco
  esporta un calendario ICS delle scadenze (`calendarioMezzi`), un'altra
  funzionalità che non c'entra. Il gestore vero dell'import CSV è
  `$("mez-file").onchange`, con la scrittura `db.aggiungi("mezzi", {
  nome: r.nome, area: r.area, ore: r.ore, stato: r.stato })` a **riga
  4738** — anche questa misurata oggi stesso nella stessa unità.
- **`parseMezziCsv`** è correttamente in `flotta-data.js`, ma l'intera
  funzione va da **riga 1161 a 1183**, non solo "riga 1165" (che è dove
  cade la riga di destrutturazione delle quattro colonne — quel dettaglio
  è giusto, l'intervallo della funzione no).
- **`csvSituazione`** esiste davvero (`flotta-data.js:1113`, chiamata da
  `index.html:4788`) e la sua conclusione — esporta manutenzioni/ricambi,
  non un backup del parco mezzi — è corretta.

Il VERDETTO della ricerca (4 campi in import contro 8 nel salvataggio
manuale, nessun `csvMezzi` esportatore) resta quello già misurato e
documentato nella sezione immediatamente sopra questa, datata sempre
16/09: è la stessa conclusione raggiunta indipendentemente due volte,
il che la rende più solida, non meno. Ma i numeri di riga citati sotto
in questa sezione (specialmente nella tabella DELTA) vanno letti con
questa correzione in testa — non sono stati riscritti uno per uno per
non deformare il resto della ricerca sul mondo, che resta la parte di
valore di questa unità.

**Data:** 16 settembre 2026, 21:33Z  
**Strumento:** WebSearch  

### ⛔ Contesto — ciò che è stato scoperto oggi

Un censimento a **doppio punto di chiamata** ha rivelato una **asimmetria critica**
nel ciclo di import/export dei dati del parco mezzi:

1. **Salvataggio manuale** (righe 4334-4339 di index.html): la form scrive **8 campi**:
   - nome, area, ore, stato (i 4 iniziali)
   - **tipo** (chiave del tipo di mezzo: escavatore, dumper, ecc.)
   - **messaInServizio** (ISO data di messa in servizio)
   - **costoPossessoAnnuo** (€: canone leasing o quota ammortamento/anno)
   - **possessoDal** (ISO data da cui inizia il costo)

2. **Import CSV** (righe 4480-4487 di index.html): legge **4 soli campi**:
   - nome, area, ore, stato
   - **Mancano tutti gli altri** (tipo, messaInServizio, costoPossessoAnnuo, possessoDal)
   - Comando di verifica: `grep -n "parseMezziCsv" apps/flotta/flotta-data.js:1165` → righe 1165 di import leggono solo 4 colonne

3. **Export CSV** (righe 4792-4797 di index.html + `csvSituazione` in flotta-data.js):
   - Esporta **situazione della flotta** (manutenzioni e ricambi), NON un backup completo del parco mezzi
   - **Non esiste `csvMezzi`**: `grep -n "csvMezzi" apps/flotta/flotta-data.js` → **0 risultati**
   - Solo `csvSituazione` viene usato per export

**Conseguenza:** Un ciclo di **andata e ritorno (backup → modifica offline → restore)**
perde i 4 campi aggiuntivi. Un **onboarding da CSV** di un parco existente non può
fornire questi dati al primo caricamento.

### Il mondo — Come i software leader gestiscono import/export completo

#### Piattaforme di fleet management (quarry/mining, 2026)

**Fleetio** — construction equipment & mixed fleet  
[https://help.fleetio.com/en_US/importexport-data](https://help.fleetio.com/en_US/importexport-data)  
Supporta CSV import con template download e mappatura flessibile dei campi. Esporta
flotta completa con backup giornaliero. I campi di **acquisition date** (data
acquisto, costo iniziale) e **asset lifecycle** (tipo di asset, stato) sono
tracciati come campi obbligatori per backup/restore.

**Samsara** — fleet management con focus OEM integration  
[https://www.samsara.com/industries/construction](https://www.samsara.com/industries/construction)  
Bulk data import per equipment con metadati completi (tipo, data servizio, costo).
OEM integration (Komatsu, CAT, Volvo) include equipment type, acquisition date,
lifecycle status. Dati esportabili in formato completo per audit e migrazione.

**Tenna** — construction equipment tracking, multi-asset  
[https://www.tenna.com/blog/best-construction-equipment-management-software/](https://www.tenna.com/blog/best-construction-equipment-management-software/)  
Traccia equipment type, acquisition date, cost basis, depreciation schedule,
acquisition value. Import da CSV con validazione del ciclo di vita completo dell'asset.

**Komatsu Komtrax** — telematics nativa, mining equipment  
[https://www.komatsu.com/en-us/technology/smart-mining/asset-management](https://www.komatsu.com/en-us/technology/smart-mining/asset-management)  
Equipaggi tracciati con tipo di macchina (OEM declared), ore motore cumulate,
stato operativo. Storico manutenzione esportabile con tutte le metriche di ciclo di vita.

#### Campi standard considerati "minimi" nel settore

**Asset identification & lifecycle** [fonti: Tenna, Samsara, Fleetio, heavyvehicleinspection.com]:
- **Equipment type** (escavatore, dumper, pala gommate) — decide manutenzione preventiva,
  checklist di controllo, disponibilità ricambi
- **Acquisition date** (data di messa in servizio) — calcola ammortamento, scadenza verifiche
  iniziali, anni di vita residua
- **Acquisition cost** (costo d'acquisto o valore iniziale) — base per ammortamento e
  costo orario totale
- **Ownership cost & date** (leasing annuo, quota ammortamento, data inizio) — entra nel
  calcolo costo/ora che decide se conviene tenere o dismettere il mezzo

**Dati operativi**:
- Operating hours (ore motore cumulate) — da telematica o inserimento manuale
- Status (operativo, in manutenzione, fermi) — ridichiarazioni delle scadenze

#### Standard di scambio: ISO 55000 e pratiche di backup/restore

**ISO 55000** (Asset Management generale) [fonte: infosys.com]:  
Definisce che gli asset devono essere tracciati dal ciclo di acquisizione fino alla
dismissione, con **ciclo completo di dati esportabili** per audit e continuità.

**CSV per onboarding vs. backup** [fonte: Fleetio.com, oxmaint.com, Asset Panda Pro]:  
Il mondo distingue nettamente:
1. **Onboarding iniziale**: CSV ricco con tutti i campi (tipo, date di servizio, costi),
   perché si assume che il cliente abbia dati esterni (un ERP, un foglio di stima)
2. **Backup/restore periodico**: CSV che contiene esattamente quello che il sistema sa
   (query di export completo), usato per migrazione fra tool, disaster recovery, o
   trasferimento fra sedi

Nessuna piattaforma esporta **meno** di quello che importa: sarebbe un buco di dati
garantito.

### DELTA — Flotta vs. Il mondo

| Aspetto | Nel mondo | In Flotta oggi | Differenza | Impatto |
|---------|-----------|---|---|---|
| **Campi in import CSV** | 8+ (tipo, date, costi, stati, …) | 4 (nome, area, ore, stato) — `parseMezziCsv` riga 1165 | Mancano: tipo, messaInServizio, costoPossessoAnnuo, possessoDal | Onboarding incomplete; perdita dati al restore |
| **Export completo** | Funzione dedicata, full-data CSV | Solo `csvSituazione` (manutenzioni/ricambi) — `grep -n "csvMezzi" → 0` | Non esiste `csvMezzi` per export del parco | Backup incomplete; non replicabile in altro sistema |
| **Ciclo andata-ritorno** | ✅ (export → modify → re-import preserves all) | ❌ (export non contiene i dati in import; i 4 campi scompaiono) | Format mismatch — index.html righe 4480-4487 importa solo 4, righe 4335-4339 salvano 8 | Perdita configurazione (tipo, costi) a ogni ciclo |
| **Validazione input** | Accetta colonne opzionali con default sensate | Niente: colonna mancante = fallisce | — | UX: importazione "non sa come riuscire" invece di proporre difese |

### Come si misurerebbe il delta colmato

1. **Test di andata-ritorno**: esportare un parco con `csvMezzi()`, re-importarlo,
   verificare che `typeof m.tipo === 'string'` e `m.costoPossessoAnnuo != null`
2. **Test di input fallback**: importare CSV con colonna tipo/costo mancante, verificare
   che il mezzo entra comunque con `tipo: null` (indovinato dal nome come oggi) e
   `costoPossessoAnnuo: null` (dichiarato, non zero di comodo)
3. **Integrazione banco**: `flotta-import-export.mjs` (in `apps/deepwork-id/tests/browser/`?)
   che legge un CSV, lo importa, lo esporta, e rilegge tutte e otto le colonne

### Fonti

- [https://help.fleetio.com/en_US/importexport-data](Fleetio: Import/Export Data)
- [https://www.samsara.com/industries/construction](Samsara: Construction Fleet Management)
- [https://www.tenna.com/blog/best-construction-equipment-management-software/](Tenna: Best Construction Equipment Management)
- [https://www.komatsu.com/en-us/technology/smart-mining/asset-management](Komatsu: Asset Management)
- [https://www.infosys.com/industries/mining/industry-offerings/asset-management.html](Infosys: Mining Asset Management & Predictive Maintenance)
- [https://heavyvehicleinspection.com/assets-management](HVI: Asset Management for Fleet)



---

## Ricerca del 2026-09-18 — componenti a vita propria: manca la soglia di vita attesa e l'avviso, non il tracciamento

*Nota di processo (regola 1): letto per intero questo documento (1950 righe, undici/dodici giri precedenti dal 14/08 al 16/09) prima di scegliere l'angolo. Contesto ricevuto: oggi (17-18/09) sono stati chiusi due difetti del deep-pass su Flotta — la virgola italiana nei CSV e `vitaComponenti` che ignorava il contatore sostituito del mezzo. Non riproposti. Già confermati esistenti e quindi NON riproposti: `componentiDelMezzo`/`vitaComponenti`/`TIPI_COMPONENTE` (undicesimo giro, 16/09, costruiti lo stesso giorno), il riuso di `contatoreDelTagliando` dentro `vitaComponenti` (corretto il 17/09), `consumoControStoria`/`costoControStoria`/`frequenzaFermiControStoria`, `pagellaMezzi`, `healthIndex`/`anomaly detection`/`valore residuo` (dodicesimo giro, 16/09 — il primo scartato come falso "non c'è" perché coincide con `consumoControStoria`, gli altri due dichiarati senza riverifica di rigore e non ripresi qui), il CSV import/export dei mezzi a 4 contro 8 campi (già proposto due volte indipendentemente il 16/09).*

### Che cosa esiste già su questo tema specifico (verificato oggi, non dedotto)

`vitaComponenti(componenti, nomeMezzo, oreMezzoAttuali, letture)` (`apps/flotta/flotta-data.js:2966-2981`) calcola, per ogni pneumatico/cingolo/dente benna montato, le ore trascorse dal montaggio (`vitaOre = ore attuali − montatoAOre`), riusando `contatoreDelTagliando` per non confondersi quando il contatore del mezzo è stato sostituito dopo il montaggio (bug corretto ieri, 17/09). `TIPI_COMPONENTE` ha solo `{chiave, etichetta}` — tre voci, nessun campo di vita attesa. La pagina (`apps/flotta/index.html:4110-4131`, sezione `sch-comp` del fascicolo mezzo) mostra la vita in ore con un badge sempre `class="badge accent"` quando `calcolabile` è vero, indipendentemente dal valore di `vitaOre`: un componente a 200h e uno a 8.000h ricevono lo stesso colore. Verificato:

```
$ grep -rciE "vitaAttesa|oreAttese|percentualeVita|vitaResidua|vitaPct|sogliaComponente|limiteVita" apps/flotta/flotta-data.js apps/flotta/index.html
apps/flotta/flotta-data.js:0
apps/flotta/index.html:0
$ grep -n "export function prioritaOperative" apps/flotta/flotta-data.js
1520:export function prioritaOperative(mezzi, manutenzioni, ricambi, oggi = new Date(), scadenze = [], preavvisoGiorni = 30, fermi = [], letture = [], rifornimenti = [], interventi = []) {
```

`prioritaOperative` — la funzione che alimenta la lista di ciò-che-serve-guardare-oggi — non riceve `componenti` fra i suoi dieci parametri: un pneumatico o un dente benna a fine vita non può mai comparire lì, anche se il dato (`vitaOre`) esiste già nel fascicolo del singolo mezzo. Per vederlo bisogna aprire ogni mezzo uno per uno.

### Il mondo (WebSearch, nessuna fonte letta per intero — WebFetch bloccato)

- **GET (denti benna, taglienti):** i sistemi dedicati generano **alert attivi** e metriche di usura, non solo un contatore — «Bradken's GETVision™ Solution delivers actionable alerts and wear metrics that support improved onsite safety, productivity and availability of GET» [seconda mano: bradken.com]. Il tracciamento a cicli/carico serve a segnalare la sostituzione **prima** che la perdita di prestazioni sia visibile: «cycle-count tracking combined with load monitoring to indicate replacement timing before performance loss becomes visible» [seconda mano: crmining.com/heavyvehicleinspection.com — riassunti concordi]. Nessuna fonte ha dato una percentuale-soglia universale nei risultati di questa ricerca (coerente con quanto già scritto l'undicesimo giro: la vita del GET varia 400–4.000+ h **per sito**, quindi la soglia non può essere una costante di prodotto).
- **Pneumatici:** il pattern ricorrente è un **valore soglia esplicito con margine d'anticipo**, non solo la misura grezza — «Fleet software gets alerts when approaching the 4/32" DOT legal minimum — with enough advance warning to schedule a planned replacement rather than react to a citation or a failure on the road» [seconda mano: oxmaint.com]; alcuni sistemi proiettano la vita residua da una curva di usura: «track each tire's wear-rate curve and project remaining useful life in days or miles» [seconda mano: tirewatcher.com — riassunto]. Per il mining specifico, l'usura è più veloce e più variabile del contesto stradale: «poor road surfaces reduce tire life by 30 to 50 percent» [seconda mano: fleetrabbit.com].

**Fiducia**: media sullo scheletro (alert esiste come pratica diffusa, soglia dichiarata invece di dedotta), bassa sui numeri isolati (30-50%, percentuali di soglia specifiche) perché di seconda mano e non mining-specifiche per i pneumatici.

### Il delta

Flotta ha già il pezzo più difficile (il conteggio delle ore corretto anche attraverso un cambio di contatore, cosa che il mondo cerca faticosamente di ricostruire dal lato telematico). Manca il pezzo più semplice: **una soglia dichiarata per tipo di componente, e un avviso quando la vita misurata la supera o vi si avvicina** — esattamente la differenza fra «tracciare» (fatto) e «generare alert vicino al limite» (undicesimo giro, citato ma non tradotto in delta perché quel giorno il tracciamento stesso non esisteva ancora).

⚠️ **Non è un numero che il prodotto può inventare**: la vita attesa di un pneumatico o di un dente benna dipende dal modello del mezzo, dal fornitore del componente e dal terreno del sito (il mondo lo conferma: 400-4.000+ h di forbice per il solo GET). Coerentemente con la cautela già scritta in questo documento per «manutenzione su condizione» (15/09) e per i campi opzionali del costo di possesso, la soglia va **dichiarata dall'utente per componente** (un campo `vitaAttesaOre` opzionale sull'evento di montaggio, non una costante di prodotto), mai assunta.

| schermata | che cosa non va | come si vede | quanto costa | come si misura |
|---|---|---|---|---|
| **Fascicolo mezzo → Componenti** | `vitaComponenti` calcola le ore dal montaggio ma non le confronta con nessuna vita attesa: il badge è sempre `accent` (stesso colore) sia per un pneumatico a 200h sia per uno a 8.000h già ben oltre ogni vita ragionevole. Senza una soglia dichiarata dall'utente il caso resta "vita non giudicata", non un colore tranquillo. | `grep -n 'badge \${c.calcolabile' apps/flotta/index.html` → la classe è sempre `accent`/`tag` sulla sola `calcolabile`, mai su `vitaOre`; `grep -rciE "vitaAttesa\|sogliaComponente" apps/flotta/flotta-data.js apps/flotta/index.html` → **0 e 0**. | piccolo | Aggiungere `vitaAttesaOre` opzionale all'evento di montaggio (`componenti`); `vitaComponenti` calcola anche `pctVita = vitaOre/vitaAttesaOre` e un `stato` ("ok"/"attenzione" sopra l'80%/"scaduto" sopra il 100%) SOLO quando `vitaAttesaOre` è dichiarata, altrimenti `stato:"non giudicato"` — mai un default nascosto. Due componenti sintetici, uno con soglia e uno senza, devono ricevere `stato` diverso e lo stesso `vitaOre` di prima. |
| **Quadro → Priorità operative** | Un componente scaduto o vicino a scadere non può mai comparire in `prioritaOperative`: la funzione non riceve `componenti` fra i suoi parametri, quindi anche il giorno in cui esistesse una soglia (riga sopra), il segnale resterebbe visibile solo aprendo il fascicolo di ogni mezzo uno per uno. | `grep -n "export function prioritaOperative" apps/flotta/flotta-data.js` → firma con dieci parametri, nessuno chiamato `componenti`; confermato leggendo il corpo della funzione (righe 1520 e seguenti), che non cita mai `vitaComponenti`. | piccolo (una volta fatta la riga sopra) | `prioritaOperative` riceve `componenti` come undicesimo parametro facoltativo (retrocompatibile: senza, comportamento identico), e aggiunge una voce categoria "componente" (gravità "warn" su "attenzione", più alta su "scaduto") per ogni mezzo OPERATIVO con almeno un componente sopra soglia — stesso schema già usato per il trend di consumo/costo/fermi (RIUSA, non reinventa il livello di gravità). Due mezzi sintetici, uno con un dente benna al 60% e uno al 110% della vita attesa, devono produrre zero e una voce rispettivamente; un mezzo fermo non riceve la voce (stessa regola già applicata al trend). |

**Riepilogo**: 1 mancanza confermata su un meccanismo che è **il proseguimento naturale** di un lavoro già fatto (non un tema nuovo scollegato) — il tracciamento delle ore esiste dal 16/09 ed è stato appena corretto (17/09) per il caso del contatore sostituito, ma non è mai stato confrontato con nessuna soglia né mai arrivato alla lista di priorità. Nessuna delle proposte è stata tradotta in codice da questa unità di ricerca (solo lettura e ricerca, come da mandato).

*Fonti (di seconda mano, via WebSearch): [bradken.com — Ground Engagement Tools](https://www.bradken.com/products-and-services/mining-and-resources/ground-engagement-tools), [crmining.com — Ground Engaging Tools (GET) Systems for Mining](https://crmining.com/ground-engaging-tools/), [heavyvehicleinspection.com — Mining Heavy Equipment Fleet Management: Complete Guide 2026](https://heavyvehicleinspection.com/blog/post/mining-heavy-equipment-fleet-management-complete-guide), [oxmaint.com — AI Tire Tread Depth & Wear Detection Guide](https://oxmaint.com/industries/fleet-management/ai-tire-tread-depth-and-wear-detection-guide), [tirewatcher.com](https://tirewatcher.com/), [fleetrabbit.com — Best Mining Haul Road Maintenance Software in 2026](https://fleetrabbit.com/industry/mining-fleet-software/best-mining-haul-road-maintenance-software-2026).*

✅ **ENTRAMBE LE RIGHE IMPLEMENTATE IL 18/09 (commit `917c9b22`), la stessa
giornata di questa ricerca.** `vitaAttesaOre` opzionale per componente,
`vitaComponenti` calcola `pctVita`/`stato` ("ok"/"attenzione"/"scaduto",
soglia 80%) solo quando dichiarata; `prioritaOperative` ha guadagnato la
categoria "componente" (gravità "warn"/"danger", stesso schema del
trend) leggendo `m.componenti` per ogni mezzo operativo. Verificato oggi
(18/09, unità successiva) rileggendo il codice attuale:
`grep -n "vitaAttesaOre\|SOGLIA_VITA_ATTENZIONE_PCT" apps/flotta/flotta-data.js`
e la firma di `prioritaOperative` (linea con `componenti` come decimo
parametro, `catRank.componente` nell'ordinamento finale). Questa riga
resta per il metodo — un "non c'è" scritto un'ora prima di essere colmato
è la stessa trappola descritta in CLAUDE.md ("il non c'è scaduto") — non
come lavoro ancora da fare.
