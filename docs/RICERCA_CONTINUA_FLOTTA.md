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
