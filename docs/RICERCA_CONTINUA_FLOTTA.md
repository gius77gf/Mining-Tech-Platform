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
- (b) l'evento «contatore azzerato/sostituito» registrato dalla persona, che
  riapre il conto senza far dire «sceso» a `consumoPerMezzo` e
  `ritmoOreMezzi` (costo medio, tocca tre lettori: elencarli prima);
- (c) la mappa di colonne per il CSV di telemetria, condivisa con Sentinella
  in `shared/` (costo medio; misura: un CSV con colonne in altro ordine
  rientra intero, e il conto dei doppioni non cambia);
- (d) ✅ **fatta il 04/09** — «scelto / subìto» derivato dalla causale
  (`naturaFermo`: manutenzione e verifica scelti; guasti, gomme, ricambi,
  operatore, meteo subìti; «altro» e le chiavi sconosciute NON classificati,
  dichiarati a parte), in `affidabilitaFlotta` come `scelti`/`subiti`/
  `nonClassificati` con giorni ed episodi: la somma delle tre parti è `persi`
  ed `episodi` alla cifra (prova in run-kpi). La frase dei fermi lo scrive
  («1 giorno di fermo scelto … e 13 giorni di fermo subìto»), misurata a 320 e
  390 senza uscire dal riquadro.
