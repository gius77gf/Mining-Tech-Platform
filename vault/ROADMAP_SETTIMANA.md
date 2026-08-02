# Roadmap Settimana — lunedì 03/08 → venerdì 07/08/2026
### v6.0 "LO STANDARD DELLE FUNZIONI" — dalla sequenza dichiarata dal fondatore il 27/07

> La settimana precedente (27/07 → 01/08, l'estetica) resta nella storia di git:
> `git show 934b3c3:vault/ROADMAP_SETTIMANA.md`. Questo file rappresenta **solo
> la settimana in corso**. I checkpoint invece non si sovrascrivono mai.

---

## 🔴 Quello che aspetta te, Giuseppe

Hai scritto che questa settimana potresti rispondere. Le decisioni aperte sono
**25**, e in cima a `docs/DECISIONI_WEEKEND.md` c'è ora una pagina che le
ordina per **quanto costano a te**, non per numero. In tre righe:

- **3 le decido solo con te, mai da solo.** Se i dati di default nel core sono
  veri o inventati (se sono veri, sono **pubblici su GitHub adesso**); il via
  libera a togliere le password in chiaro dal sorgente; le curve dei limiti di
  vibrazione. Toccano la sicurezza delle persone o dei dati.
- **3 richiedono che tu apra qualcosa**: il progetto Firebase nuovo, le regole
  di sicurezza di quello esistente, un file di un volo drone vero.
- **19 sono scelte di prodotto**, e per ognuna c'è già la risposta che darei io.
  **Se entro venerdì non dici niente procedo con quelle e lo scrivo nel
  commit** — così resta chiaro che le ha decise il ciclo e non tu, e si cambiano
  in qualunque momento. ⚠️ Dieci delle diciannove danno la stessa risposta con
  parole diverse: *«quando non si sa, si dice che non si sa»*. Se su quella sei
  d'accordo in generale, **una tua riga sola basta per tutte e dieci**.

- [ ] **D. Le 25 decisioni** — `docs/DECISIONI_WEEKEND.md`, pagina d'ingresso in
      cima al file.

---

## 🎯 L'obiettivo della settimana

La sequenza l'hai dichiarata tu il 27/07: **prima l'estetica, nei giorni
successivi lo standard di ogni funzione e funzionalità, con lo stesso livello di
approfondimento.** L'estetica è la settimana scorsa. Questa è **lo standard
delle funzioni** — e la notte fra l'1 e il 2 agosto ha detto da dove si comincia.

⛔ **Il filo che tiene insieme tutto quello che è saltato fuori: i numeri che
mentono con la faccia tranquilla.** In una notte sola, su codice che passava
tutte le prove:

| dove | che cosa diceva all'utente | che cosa era vero |
|---|---|---|
| Flotta · costo orario | «63,03 €/h», e la macchina in cima alla classifica | **28,61 €/h** (+120%), e la macchina cara era un'altra |
| Conti · scadenze | «fattura insoluta da 152 giorni» | la scadenza era il **30 febbraio**, un giorno che non esiste |
| Genesi · soglia vibrazioni | «50,8 mm/s», la più permissiva | la frequenza era illeggibile: **non si poteva dire** |
| Terra · densità | conversione fatta a 1,6 t/m³ | un valore **prestampato nel form**, che nessuno aveva scelto |
| Sentinella · grafico letture | «30/02/2026» come un giorno qualunque | idem |

Nessuno era un errore di calcolo. Erano tutti **la stessa cosa**: un numero
scritto dove non era stato misurato niente. È il principio che hai dato tu, e
questa settimana serve a farlo valere **funzione per funzione**, non a memoria.

## Task

### A — Chiudere ciò che la notte ha lasciato a metà (lunedì)

- [ ] **A1. Flotta — la metà gasolio del costo orario.** Misurata e dichiarata,
      non corretta: `consumoPerMezzo` scarta il primo pieno (il gasolio della
      finestra è quello messo *dopo* la prima lettura) ma `costoOrarioMezzo` lo
      rimette nel numeratore. **+93,7% su Pala P1**, +50,4% su Dumper D1, +49,2%
      su Escavatore E1. Sono **due conti della stessa cosa che divergono**,
      dieci righe sotto il commento che vieta esattamente questo.
- [ ] **A2. `shared/` — la densità della cava, una sola.** Terra ha imparato a
      leggerla dall'atto o dalla prova di laboratorio; **Campo continua a usare
      il preset**. Il giorno in cui un cliente dichiara 1,95 nell'atto, Terra
      riconcilia a 1,95 e Campo a 1,90: due schermate, due scostamenti, stessa
      cava, stesso mese. Va in `shared/dw-ponti.js` con la prova di **identità**
      (`terra.X === ponti.X`), non di somiglianza.
- [ ] **A3. Conti — il DDT eredita il prezzo dell'ordine.** Si concorda un
      prezzo su un'offerta, il cliente accetta, e poi ogni bolla di consegna
      ricalcola dal listino: l'offerta dice 10,50 e il DDT rifà 12,00. Non è un
      difetto nuovo — con gli scaglioni appena costruiti è solo diventato
      **visibile**.
- [ ] **A4. Un banco per le modali.** Stanotte due difetti veri dentro le
      finestre di dialogo li ha trovati **solo un occhio umano**: un'unità in
      maiuscolo in Sentinella, e in Terra le etichette di una tendina tagliate a
      320px — dove il taglio si portava via *esattamente la differenza fra le
      due fonti*. Nessun banco apre le modali: quella classe di difetto oggi è
      scoperta dall'automatico.

### B — Lo standard delle funzioni, app per app (martedì → venerdì)

- [ ] **B1. La caccia sistematica ai numeri tranquilli**, non a intuito. La
      `sonda-vuoto` esiste già e ne dichiara sette: va estesa a cercare il
      **pattern** — `+null`, `|| 0`, `Number.isFinite(0)`, una media senza
      denominatore, un rapporto con numeratore e denominatore su periodi
      diversi — e a **contare quanti ne trova in ognuna delle sei app**. Il
      numero è la misura del lavoro che resta.
- [ ] **B2. Gli altri due difetti che Genesi ha trovato e non ha blindato**: un
      **codice di norma sconosciuto** prende in silenzio la soglia residenziale
      (l'etichetta e il numero raccontano due cose diverse), e `sitoFit` scrive
      **`r2: 0`** dove r² non è calcolabile.
- [ ] **B3. Genesi continua a uscire dalla pagina.** Da 186 funzioni dentro
      `genesi.html` siamo a **174**; le estraibili senza toccare l'architettura
      sono circa **90**. È l'unico pezzo di prodotto che vive quasi tutto fuori
      dalla portata delle prove.
- [ ] **B4. Le mancanze confermate del delta**, in ordine di quanto le chiede un
      ispettore. Conto aggiornato al 02/08: **54 confermate**, 6 **scadute**
      (colmate senza che la riga lo sapesse), 2 **colmate di proposito**. Regola
      nuova: chi chiude un'unità **aggiorna la riga del documento che gliel'aveva
      proposta** — è la sola cosa che fa scendere l'arretrato.

### C — Ricerca continua, nei tempi morti

- [ ] **C1. Verificare contro il codice** le tre proposte della ricerca sulle
      verifiche periodiche delle attrezzature (D.Lgs 81/08 art. 71 e Allegato
      VII, DM 11/04/2011): il **verificatore** non tracciato, il **verbale** non
      allegato, l'**esito** come testo libero invece che come lista.
- [ ] **C2. Ricerca a rotazione**, una app per giro, col vincolo che ha fatto la
      differenza: **incollare il comando e la sua uscita** per ogni «non c'è».
      Misurato su tre tornate: chi va a cercare **il meccanismo** nel modulo
      rende 3 proposte su 3; chi cerca **la nostra parola** rende 1 su 5.

### E — Rimandati dalla settimana dell'estetica (aperti, non decaduti)

- [ ] **E0.** Consolidamento in `shared/` — proseguito parecchio stanotte (data
      italiana, lettura CSV, allegati, conto dei giorni, unità di misura), resta
      il censimento di ciò che è ancora scritto due volte.
- [ ] **E7.** Genesi — allineamento delle parti 2D/HUD al core (la scena 3D
      resta come sta: è un'altra cosa).
- [ ] **E8.** Verifica finale: le sette pagine affiancate devono sembrare la
      stessa famiglia.
- [ ] **G7–G9.** Genesi: ottimizzatore di volata, report professionale,
      rifiniture di scena.
- [ ] **Q1.** Proposte di `docs/RICERCA_DEEPWORKID_202607.md` (ruoli reali
      dentro l'organizzazione) — legata alla decisione **10b/10c**.

## Vincoli

- Non pushare mai su `main`: si lavora sul branch di sessione, per `main` si
  passa da Pull Request.
- Nessuna spesa (domini, piani a pagamento) prima della commercializzazione.
- ⛔ I dati di riferimento del fondatore non compaiono **mai** in interfaccia,
  export o documenti.
- ⛔ Soglie di sicurezza (curve USBM/DIN), dati di default sensibili e
  mitigazione password: **non si toccano** senza conferma esplicita in chat.
- Commit piccoli e frequenti; un checkpoint **nuovo** per ogni unità completata,
  mai sovrascritto.

## Riferimenti

- Ultimo checkpoint **per data vera**:
  `vault/checkpoints/20260801-235400_quattro-cantieri-e-un-numero-piu-alto-di-ogni-suo-addendo.md`
  ⚠️ *Non* il più alto in ordine alfabetico: in `vault/checkpoints/` ci sono
  ancora file **datati avanti** rispetto al giorno in cui sono entrati in git
  (640 precedenti alla regola, contati da `date-checkpoint.mjs`). Chi va per
  nome apre il file sbagliato credendo che sia il più fresco.
- Le decisioni: `docs/DECISIONI_WEEKEND.md` — pagina d'ingresso in cima.
- Stato misurato al 02/08: **1.838 prove** che girano senza rete, copertura
  **591/591** e nessuna funzione scoperta, 49 banchi che aprono le pagine in un
  browser vero.
