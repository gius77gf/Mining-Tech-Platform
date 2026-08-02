# Roadmap Settimana — lunedì 03/08 → venerdì 07/08/2026
### v6.0 "LO STANDARD DELLE FUNZIONI" — dalla sequenza dichiarata dal fondatore il 27/07

> La settimana precedente (27/07 → 01/08, l'estetica) resta nella storia di git:
> `git show 934b3c3:vault/ROADMAP_SETTIMANA.md`. Questo file rappresenta **solo
> la settimana in corso**. I checkpoint invece non si sovrascrivono mai.

---

## 🔴 Quello che aspetta te, Giuseppe

Domenica **02/08 abbiamo lavorato insieme, passo per passo**, e due sono
chiuse. Le aperte sono **24**; la pagina d'ingresso di
`docs/DECISIONI_WEEKEND.md` le ordina per quanto costano **a te**.

- ✅ **Chiusa la 3** — i dati di default del core sono **dimostrativi**, e non
  sulla parola: l'IBAN è quello d'esempio dei manuali, i telefoni sono in
  sequenza, i cognomi sono i segnaposto classici. Niente da bonificare, e cade
  anche l'urgenza della rotazione password (la **4** resta, ma solo come «da
  togliere prima del primo cliente vero»).
- 🟡 **La 2 è a un click**: le regole del Firebase esistente erano
  `allow read, write: if true` — **chiunque su internet poteva leggere,
  scrivere e cancellare** quel database. Le regole nuove sono scritte e
  versionate (`firestore.rules.core-vecchio`); manca solo che il fondatore
  prema «Pubblica» in console. ⚠️ Chiudere **non spegne il sito**: il core ha
  già `initDBOfflineFallback`, e il suo commento nomina alla lettera il caso
  «security rules bloccanti».
- ⏸ **La 1 (Firebase nuovo) è rimandata con la ragione**: serve a far entrare
  persone vere con un account vero, e finché non c'è un cliente pilota non ha
  nessuno a cui servire. Si fa in dieci minuti quando arriva, e si collauda
  con lui.
- 🟡 **Le quattro gemelle — 13, 14, 16, 17** — sono la stessa domanda e
  aspettano una riga sola. ⚠️ *Erano state annunciate come «dieci»: sono
  quattro, contate una per una. Lo stesso difetto che togliamo dal prodotto,
  fatto da noi in un documento.*
- Le altre **quindici** sono scelte di prodotto: se entro venerdì non arriva
  risposta si procede con la colonna «la mia risposta», **dichiarandolo nel
  commit**.

- [ ] **D. Le 24 decisioni ancora aperte** — `docs/DECISIONI_WEEKEND.md`,
      pagina d'ingresso in cima al file.

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

- [x] ✅ **A1. Flotta — la metà gasolio del costo orario.** Chiuso il 02/08. I
      tre scarti confermati alla cifra (Pala P1 **+93,7%**, Dumper D1 +50,4%,
      Escavatore E1 +49,2%), e la prova che vale più dei numeri: l'identità
      `euroOra = euroOraOfficina + euroOraCarburante` **prima non tornava** e
      adesso torna al centesimo su tutti e tre. `totale`, `officina` e
      `carburante` **identici** prima e dopo su tutti e sei i mezzi: nessun euro
      speso è sparito.
      ⛔ Ma la parte che conta è il **buco nelle prove**, non la correzione: le
      sedici prove della pagella erano tutte **relative** («la media è la spesa
      diviso le ore»), quindi restavano verdi **con qualunque numeratore**,
      difetto compreso. Ora i numeri della dimostrazione sono fissati accanto a
      come sarebbero col primo pieno dentro — il confronto affiancato **dentro
      la suite**, non in uno scratchpad che alla sessione dopo non esiste.
      ⚠️ E un esito che **smentisce** l'ipotesi del mandato, detto com'è: nessun
      verdetto della pagella cambia e la classifica non si muove. Quello che
      cambia è la **Pala P1, che esce dalla banda dal lato buono** — «un'ora sua
      costa meno della media del parco», la buona notizia che prima la
      schermata non diceva.
      *Il difetto era*: `consumoPerMezzo` scarta il primo pieno (il gasolio
      della finestra è quello messo *dopo* la prima lettura) e
      `costoOrarioMezzo` lo rimetteva nel numeratore — due conti della stessa
      cosa che divergono, dieci righe sotto il commento che lo vieta.
- [x] ✅ **A2. `shared/` — la densità della cava, una sola.** Chiuso il 02/08, e
      il difetto **misurato prima** sullo stato precedente: con la stessa
      autorizzazione Terra dava **1,95** t/m³ (dal certificato di laboratorio) e
      Campo **1,90** (il valore tipico). A valle, sulla stessa
      `riconciliazioneTurni`: scostamento **2,56% in Terra e 0% in Campo**,
      stessa cava, stesso mese. Nessuna delle due sbagliava da sola.
      ⛔ **E il buco vero era altrove.** L'identità difendeva il lato `shared/`,
      ma rimettendo il difetto **su Campo** — import compreso — `run-kpi`,
      `run-stile`, `nomi-doppi` e `copertura-funzioni` restavano **tutte e
      quattro verdi**: le suite `node` non aprono le pagine, quindi il lato dove
      il difetto nasce era scoperto. Aggiunte quattro prove che leggono **chi
      chiama** `riconciliazioneTurni` invece di elencarlo a mano.
      ⚠️ **La lezione non prevista**, e vale più dell'unità: la copia
      «identica» della funzione **è divergesa nell'atto stesso di copiarla** —
      un controllo scritto diverso su una riga, e con quella versione una
      densità **0** scritta per errore veniva sostituita di nascosto dal valore
      tipico. L'ha presa una prova, non una rilettura. È la regola del `shared/`
      dimostrata dal vivo.
      *Il difetto era*: Terra leggeva la densità dall'atto o dal laboratorio e
      Campo restava sul preset, pur costruendo la stessa riconciliazione.
      Adesso la regola sta in `shared/dw-ponti.js` con la prova di **identità**
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
