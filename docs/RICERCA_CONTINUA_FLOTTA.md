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
