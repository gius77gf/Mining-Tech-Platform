# Ricerca continua — Conti

**Data**: 2026-08-14  
**Verificato contro commit**: 8b364b36  
**Cosa esiste già**: Conti ha `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` che calcola il dovuto sul periodo in base a scelta della base (venduto/scavato), unità (t/m³) e aliquota. I campi di configurazione sono `canoneUnita`, `canoneBase`, `canoneAliquota`, `canoneNota`. Non c'è un modello di dichiarazione annuale né un export specifico per la conformità normativa.

---

## Il mondo — Canone di escavazione in Italia

### Come funziona il tributo

Il canone (diritto) di escavazione è un tributo che i titolari di concessioni di cavità minerali pagano agli enti pubblici (Regioni, Province, Comuni) sulla base del materiale estratto.

**Chi lo impone**: Le Regioni, sulla base di decreti legislativi dello Stato. Ogni Regione fissa le proprie aliquote e modalità.

**Base di calcolo**: Il volume estratto misurato in metri cubi (m³) o, per alcuni materiali, in tonnellate (t). La base può essere:
- **Volume estratto** (scavato): misurato da rilievi topografici o volumetrici
- **Volume venduto**: documenti di trasporto (DDT) e fatture

**Periodicità e versamento**: 
- Versamento: generalmente **semestrale** o **annuale** secondo le norme regionali
- Dichiarazione: **annuale**, entro **30 aprile** dell'anno seguente, tramite **Modello A** (compilato per ogni concessione con codice regionale unico)
- La dichiarazione va trasmessa ai gestori del Servizio Operatori Minerari (via PEC), ai comuni, province e enti gestori di aree protette

**Cosa contiene la dichiarazione annuale (Modello A)**:
- Codice identificativo della concessione/autorizzazione
- Volume estratto nel periodo (in m³ o t secondo l'aliquota)
- Prodotto estratto (calcare, sabbia e ghiaia, argilla, gesso, ecc.)
- Allegati richiesti (fatture, DDT, rilievi topografici secondo le norme regionali)
- Firma del titolare della concessione

Fonte: [FAQ Veneto - terre e rocce da scavo](https://www.arpa.veneto.it/temi-ambientali/suolo/faq-su-terre-e-rocce-da-scavo); [Regione Piemonte - Onere per il diritto di escavazione](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione)

### Variazioni regionali

#### Piemonte
- **Base**: Volume estratto (m³ o t)
- **Aggiornamento 2026**: Adeguamento ISTAT 2,4% su tariffe 2024-2025
- **Modello**: Dichiarazione entro 30 aprile tramite Servizio Operatori Minerari
- Fonte: [Regione Piemonte - Onere per diritto escavazione 2025](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione-materiale-estratto-nel-2025)

#### Lombardia
- **Base**: Volume estratto (m³)
- **Tariffe aggiornate**: Gennaio 2026, adeguamento 2,4% su base ISTAT programmata 2024-2025
- **Distribuzione**: 84% ai comuni interessati (per infrastrutture e recupero ambientale), 16% a regione/enti
- **Periodi**: Semestrale o annuale secondo tariffa
- Fonte: [ANCI Lombardia - Aggiornamento tariffe 2026](https://anci.lombardia.it/dettaglio-circolari/2026122143-aggiornamento-tariffe-di-escavazione/anci.lombardia.it)

#### Toscana
- **Base**: Volume estratto, espresso in €/m³
- **Delibera Giunta 736/2021**: Tariffe per estrazioni di materiali industriali e per costruzioni
- **Aggiornamenti**: Incremento ISTAT 0,6% annuale; +2% se azienda manca di certificazioni ambientali/sicurezza o in aree con vincoli paesaggistici
- Fonte: [Delibera Regione Toscana 736/2021](https://www.confindustriatoscanasud.it/index.php/edilizia-infrastrutture-e-politiche-territoriali/delibera-regione-toscana-7362021-contributi-escavazione-materiali-industriali-1/)

#### Differenza fra mine e cave
Secondo Regio Decreto n. 1443/1927: le **cave** sono lasciate al disponibile del proprietario terriero (Pubblica Amministrazione non riscuote canone); il canone si applica solo alle **miniere** dove il deposito è sottratto al proprietario.

Fonte: [Oneri istruttori e diritti di escavazione - Città Metropolitana Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/oneri_diritti_escavazione.html)

### Come i software di settore lo gestiscono

Software e piattaforme gestionali per cave e miniere (es. Catasto Cave e Miniere):
- **Calcolo automatico**: Dell'importo dovuto per volume × aliquota regionale configurata
- **Gestione aliquote**: Lettura da tariffari regionali, aggiornamento per inflazione
- **Dichiarazioni**: Generazione di moduli conformi alle norme regionali, esportazione dati per Modello A
- **Non-calcolabilità**: Dichiarazione di impossibilità di calcolo quando aliquota manca o volume non disponibile
- **Scadenze**: Tracciamento delle scadenze di versamento e dichiarazione per regione

Fonte: [Catasto Cave e Miniere - Manuale Utente v2.2.1 - Gennaio 2026](https://www.caveminiere.servizirl.it/catmc/assets/doc/ManualeUtenteCATCM.pdf)

---

## Il DELTA su Conti — Cosa manca

**Schermata**  |  **Che cosa non va**  |  **Come si vede**  |  **Quanto costa**  |  **Come si misura**
---|---|---|---|---
Canone (sezione corrente) | Nessun modello di dichiarazione annuale esportabile (Modello A o simile conforme alle norme regionali) | Nessun bottone "Scarica dichiarazione" o "Esporta modello" nel pannello canone; nessun file CSV/PDF generato | Medio: codificare la struttura del Modello A con i dati del periodo (volume, prodotto, date), esportare in CSV o generico per stampa. Dipende da quale regione si mira per primo (norme diverse). | Cercare nell'indice HTML: `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia' apps/conti/index.html` → 0; in conti-data.js cercare funzioni di export tipo `export function csvDichiarAnnuale\|dichiarazioneAnnuale` → 0. Nessuna struttura dati.
Canone (sezione corrente) | Impossibilità di marcare il canone come "dichiarato" o "versato" nella storia (tracciamento della conformità) | No campo di stato (es. "dichiarazione attesa", "versato il 30/04", "controllato"). Il valore resta sempre calcolato, senza storia. | Basso: aggiungere stato/nota sulla dichiarazione e versamento; fare persistere il dato di "data di dichiarazione". | Cercare nello schema di `canonePeriodo` in conti-data.js: controllare se restituisce un oggetto con `dichiarazioneData`, `statoVersamento`, ecc. → `grep -n "dichiarazu\|versatu\|statoCanone" conti-data.js` → 0 risultati.
Canone (sezione corrente) | Nessuna notifica di scadenza dichiarazione (30 aprile per anno precedente) | No reminder, no toast, no avviso in dashboard KPI | Basso: aggiungere logica di avviso per data di scadenza. È già il modello di Conti per altre scadenze. | `grep -ciE 'april.*30\|scadenza.*dichiar\|30.*april' apps/conti/` → 0.
Canone (sezione corrente) | Configurazione per materiale non supportata (tariffa diversa per calcare/sabbia/argilla come da norme regionali) | Un'unica aliquota `canoneAliquota` vale per tutto il periodo; nessun "listino" dei materiali con aliquota propria come nel listino dei prodotti | Medio-alto: estendere impostazioni per supportare aliquote per prodotto/materiale. Correlato al listino esistente. | `grep -n "canoneAliquota\|canone.*listino" conti-data.js` → trova 1 solo campo `canoneAliquota` numerico. Nel listino cercare: `grep -ciE 'canone.*aliquota\|prodotto.*canone' conti-data.js` → 0.

**Nessuna delle tre mancanze è stata trovata nel codice.**

#### Ricerche dettagliate

```bash
# Modelli di dichiarazione
grep -ciE 'dichiarazione.*annuale|modello.*a|scarica.*modello|export.*dichiar' /home/user/Mining-Tech-Platform/apps/conti/index.html
# Risultato: 0

# Stato versamento/dichiarazione
grep -n 'dichiarazioneData\|statoVersamento\|versatu\|dichiaraCome' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: nessun match

# Aliquote per materiale
grep -ciE 'prodotto.*canone|canone.*prodotto|aliquota.*per.*materiale' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: 0

# Avvisi di scadenza
grep -ciE '30.*aprile|scadenza.*dichiarazione|deadline.*canone' /home/user/Mining-Tech-Platform/apps/conti/
# Risultato: 0
```

#### Cosa c'è già

- `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` — calcola il dovuto su un periodo
- Campi `canoneUnita` (t/m³), `canoneBase` (venduto/scavato), `canoneAliquota` (€/unità), `canoneNota`
- Interfaccia di input (ID: `can-base`, `can-unita`, `can-ali`, `can-nota`) con validazione
- Nota a display: "Il canone si versa agli enti ... molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti"
- Pattern di export CSV già presente per fatture, pesate, incassi, clienti, listino

---

**Proposta prioritaria**: Aggiungere una sezione di riepilogo dichiarativo (numero quantità per anno, verifica rispetto a quanto caricato, data di versamento storico) con opzione di esportazione in formato adatto a Modello A. Non è urgente finché non si sa quale regione seguire per primo (tariffari diversi).

---

## ⛔ RIVERIFICA DEL 14/08 — i verdetti reggono, i RIGHELLI no

*Rimisurato dal ciclo contro il commit `8b364b36`, prima che qualunque riga di
qui entrasse in roadmap. Vale la regola della casa: **niente entra sulla parola
dell'agente**, e un «non c'è» senza la sua ricerca accanto vale zero.*

**Esito: 4 mancanze su 4 confermate nel verdetto, 4 prove su 4 da rifare.** È la
stessa forma già censita per i documenti del delta — *«una prova che invecchia
non rende la riga sbagliata: la rende non credibile»* — con la differenza che
qui non è invecchiata: **è nata storta**, e i quattro modi sono tutti già
scritti in `CLAUDE.md`.

### I quattro righelli, e che cosa rispondono davvero

1. ⛔ **`grep` su una CARTELLA senza `-r`.** Scritto
   `grep -ciE '30.*aprile|scadenza.*dichiarazione' apps/conti/` → l'uscita vera è
   `grep: apps/conti/: Is a directory` **e poi `0`**. Cioè lo zero è **del
   righello**, non del codice. Fatto giusto (`grep -rciE "30 aprile|scadenza.*dichiaraz" apps/conti/`):
   `README.md:0 · index.html:0 · conti-data.js:0`. **Il verdetto regge**, ma per
   la prima volta è provato.
2. ⛔ **La pipe SFUGGITA dentro `-E`.** Nella tabella la prova è scritta
   `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia'` → **0**, e
   quello zero è garantito: con `\|` dentro `-E` la pipe è **letterale**. Senza
   la sfuggita, lo stesso comando risponde **3**. È la trappola che questo
   repository ha già pagato il 14/08 sul delta, scritta due volte nello stesso
   documento.
3. ⛔ **I refusi nei termini.** `grep -n 'dichiarazu\|versatu\|statoCanone'`:
   due parole su tre **non esistono in nessuna lingua**, e la terza è cercata
   senza `-E` con le pipe letterali. Un comando così **non può** rispondere
   altro che zero.
4. ⚠️ **Il conto che si contraddice da sé.** La riga «Nessuna delle **tre**
   mancanze è stata trovata nel codice» sta sotto una tabella che ne elenca
   **quattro**. È il difetto che togliamo dal prodotto, fatto da noi in un
   documento — e la difesa è quella già scritta: *ogni addendo ha un lettore che
   lo conosce, il totale no*.

### Le quattro righe, riverificate una per una

| mancanza | verdetto | la prova, rifatta |
|---|---|---|
| nessun modello di dichiarazione annuale esportabile | **VERA**, ma **non** «non se ne parla»: la pagina la **nomina già** | `grep -ciE "dichiarazione annuale\|modello a\b\|scarica.*dichiaraz" apps/conti/index.html` → **1**, ed è la nota del pannello canone («molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti»). Quello che manca è **l'export**, non la consapevolezza. |
| nessun campo di stato «dichiarato / versato» | **VERA** | Le impostazioni del canone sono tre e sono queste: `canoneUnita`, `canoneAliquota`, `canoneNota` (più `canoneBase`). Nessun campo di stato, nessuna data di versamento. Letto nel letterale `impostazioni` di `conti-data.js`. |
| nessun avviso della scadenza | **VERA** | vedi righello 1: `0` su tutti e tre i file, provato. |
| aliquota unica, non per materiale | **VERA** | `grep -ciE "aliquot" apps/conti/conti-data.js` → **90 righe**, di cui `canoneAliquota` **5** e `aliquotaIva` **23**: cioè la parola «aliquota» in questo file parla quasi sempre di **IVA**, e del canone ce n'è **una sola**, numerica. |

### Quello che NON ho rimisurato, e va detto
⚠️ **Tutta la metà sul mondo** — le tariffe di Piemonte, Lombardia e Toscana,
il «Modello A», il termine del 30 aprile, gli adeguamenti ISTAT — è **riportata
dall'agente con le sue fonti e NON è stata riverificata**. Prima che un numero
di lì finisca in una schermata o in un documento del prodotto, va aperto il
testo di legge citato: una tariffa sbagliata detta a un cliente è peggio di una
tariffa assente.

### E un righello sbagliato l'ho scritto IO, in questa stessa sezione
⚠️ Nella prima stesura della riga sull'aliquota avevo scritto «`aliquot` dà **8**
occorrenze, tutte `aliquotaIva`». Sono **90 righe**, di cui 5 del canone e 23
dell'IVA: avevo riportato il numero di un *altro* comando, più stretto, lanciato
un minuto prima. Cioè: **stavo correggendo dei righelli falsi con un righello
falso.** L'ha presa il rilancio del comando prima di committare — non la
rilettura, che l'aveva lasciato passare. È la ragione per cui in questa casa una
prova è **un comando con la sua uscita** e non una frase che descrive una
ricerca.

### Che cosa è cambiato mentre la ricerca girava — ⏱️ SCADUTA IN DUE ORE
⏱️ La riga qui sopra diceva «un cantiere **sta** togliendo il
`+cfg.canoneAliquota || 0`». Adesso è **committato**: con l'aliquota mai
impostata `canonePeriodo` risponde `dovuto: null` con le bandiere `noto` e
`calcolabile` e un `motivo` che dice quale dei due manca — non più `0`. Quindi
la descrizione del calcolo scritta più su in questo documento è **scaduta**, ed
è scaduta in **due ore**: è il «non c'è» scaduto, la seconda forma, e non è
colpa di nessuno — il cantiere girava di fianco alla ricerca.
⚠️ Aggiornato qui invece che riscritto sopra, perché **la riga vecchia serve**:
una ricerca che si autocorregge in silenzio non insegna niente a chi la rilegge
fra un mese.

---

## Ricerca del 2026-09-02 — la pesa a ponte: che cosa esce e in che forma

### Fatti dal mondo

- **Campi tipici del cartellino di pesata**: numero progressivo pesata, data pesata, ora prima pesata, ora seconda pesata, targa/numero mezzo, cliente/fornitore, materiale/descrizione merce, peso lordo (prima pesata), peso tara (mezzo vuoto, dedotto da seconda pesata prima del carico), peso netto (merce pesata), codice pesata/numero ricevuta. [Bottaro Bilance - software pese a ponte; seconda mano]

- **Struttura di pesata ponte in due tempi**: il mezzo entra (registrazione lordo), poi viene caricato, rientra (registrazione lordo nuovo), dal quale il sistema calcola tara mezzo e netto caricato. Stampa automatica di documenti per il cliente. [seconda mano - pratica industriale standard]

- **Termini base**: peso lordo = totale (merce + contenitore); peso netto = sola merce; tara = solo contenitore/mezzo. [FocusJunior.it, chimica-online.it; seconda mano]

- **Formati di esportazione software pesa**: PDF, Excel, Word, CSV sono i formati comuni citati da Laumas, Dini Argeo, WeightIT. [WeightIT/Metricode; seconda mano]

- **Protocolli di comunicazione peso**: RS232 seriale (standard storico), Modbus RTU su RS232/RS485 (per automazione industriale), Ethernet con DHCP, USB, Wi-Fi opzionale su indicatori Dini Argeo DFWX. [Dini Argeo, Sinergica Soluzioni; seconda mano]

- **Software specializzati per cave di inerti**: Vincro offre software di pesatura con integrazione diretta agli indicatori peso comuni, stampa automatica DDT/ricevute di pesata, gestione prezzi e fatture, esportazione dati. [vincro.it; seconda mano]. Coop Bilanciai fornisce software personalizzato interno con ricezione ordini da gestionale esterno e trasmissione dati pesatura verso gestionale per bollettazione/fatturazione/magazzino. [coopbilanciai.com; seconda mano].

- **Legame pesata → DDT**: il DDT (Documento di Trasporto) contiene numero identificativo, dati delle parti, descrizione merce, numero pezzi, numero pacchi, pesi dei pacchi, data consegna. Quando il sistema di pesata emette un DDT, i dati di carico pesato alimentano automaticamente il campo quantità/peso del DDT. [Fattura24, Fiscomania; seconda mano]

- **DDT nella fattura elettronica SdI**: sezione `DatiDDT` in XML contiene i riferimenti al documento di trasporto. È possibile allegare il DDT nel file XML e inserire più sezioni DatiDDT quando una fattura copre più DDT. Il DDT specifica peso e quantità della merce trasportata, che poi la fattura legge come base di quantificazione. [Fattura.it, WindDoc; seconda mano]

- **Integrazione pesata-gestionale**: piattaforme gestionali come Ergo captano automaticamente i dati di pesatura quando viene emesso un DDT, trasferendo il peso al sistema di gestione magazzino e preparando i dati per la bollettazione e la fatturazione. [infominds.eu; seconda mano]

- **Verifica metrica pesa a ponte**: la normativa cita D.M. 93/2017 per le verifiche periodiche delle bilance industriali. [dedotto da riferimenti a norme metrologiche; non verificato direttamente]

### Formati di export trovati

| Produttore | Formato | Colonne/Campi principali | Fonte |
|---|---|---|---|
| Coop Bilanciai | PC/USB (formato non specificato) | Dati pesatura da indicatore → foglio dati/gestionale | coopbilanciai.com |
| Dini Argeo | Software AF03/AF04/AF05 per indicatori 3590E/CPWE | Configurabile (pesatura, statistiche, etichettatura, pesa-veicoli) | diniargeo.it |
| Laumas | Supervisory software, formato non nominato | Raccolta e archiviazione dati pesatura per archivio | laumas.com |
| WeightIT (Metricode) | PDF, Excel, Word | Kilogrammi, clienti/fornitori, descrizione merce | weightit.it |
| Vincro | CSV/dati strutturati | Carico pesato, DDT, intestazione cliente, materiale, prezzo | vincro.it |

### Domande per chi ha il codice in mano

1. Quando entra in sistema una pesata ponte con tara non registrata (mezzo nuovo, tara mancante), come decide il netto: rimanda l'operatore, assume tara zero, o dichiara non-calcolabile?
2. Un documento di pesata esce da questa app collegato a un DDT per numero, data e ora, oppure rimane separato e il DDT lo legge in un momento diverso?
3. Dove nasce il nesso fra la quantità della pesata e il peso dichiarato nel DDT: nella app di pesa, oppure il DDT lo legge da un'esportazione successiva del gestionale?
4. Se un'esportazione CSV di pesate verso la fatturazione specifica il netto, e il cliente dopo il carico scopre che il netto era sbagliato, con quale meccanismo si nota il disallineamento (nota di credito, rettifica)?
5. Il sistema conosce quale indicatore peso (quale pesa a ponte, quale ID di dispositivo) ha registrato una pesata, o è trasparente e scrive solo il numero finale?


---

## Ricerca del 2026-09-02 — riconciliazione prodotto / venduto / scorte (metà sul mondo)

**Che cosa esiste già**: non verificato da questa ricerca; il delta lo fa chi ha il codice.

### Grandezze confrontate in una riconciliazione di inventario

Una riconciliazione mensile di inventario in una cava confronta quattro classi di dati [seconda mano: Birdi, minebright]:

1. **Tonnellate prodotte da turni**: volumi estratti stimati dai turni di lavoro e dalle schermate operative
2. **Tonnellate pesate in uscita**: totale lordo dalle pese a ponte, meno pesi a vuoto, registrato su DDT e fatture
3. **Rilievi volumetrici di cumuli (stockpile)**: misurati con drone (fotogrammetria, LiDAR) e convertiti in tonnellate tramite densità
4. **Densità**: fattore cruciale che lega volume a tonnellate; distinto in densità in banco (1,55–2,75 g/cm³ per calcare) e densità sciolta/bulk (1,4–1,5 t/m³ per aggregati) [seconda mano: CivilToday, calcolatori aggregati]

### Tolleranze e frequenze

**Tolleranza accettata**: ±2–5% di varianza su drone con densità verificata; ±5–10% con rilievi GPS tradizionali [seconda mano: Birdi, Propeller Aero, Kespry].

**Frequenza di riconciliazione**: **mensile** per la maggior parte delle cave attive; settimanale per siti ad alto throughput, trimestrale per materiali lenti. L'allineamento con cicli di reporting finanziario è lo standard [seconda mano: Propeller Aero, DroneDeploy].

### Cause tipiche degli scarti

1. **Stima a occhio dei volumi estratti**: i turni dichiarano volumi senza verifiche; errori di ±10–15% comuni
2. **Swell/shrinkage non controllato**: materiale sciolto vs compatto varia 20–40% a seconda di umidità e granulometria; errori densità ±10%, errori swell ±33% possibili [seconda mano: DroneDeploy, Propeller Aero]
3. **Densità non aggiornata**: una variazione 1,60 → 1,55 t/m³ su 50.000 m³ = 2.500 t di differenza [seconda mano: Propeller Aero]
4. **Doppi conteggi in pesata**: stesso carico pesato due volte, o pesata parziale non tracciata
5. **Cumuli non rilevati**: stockpile piccoli o nascosti non entrano nel rilievo drone
6. **Vendite senza pesata**: consegne non registrate sulla pesa (astuccaggio informale)

### Software del settore

| Software | Che cosa riconcilia | Fonte |
|----------|-------------------|-------|
| **Command Alkon / Apex** | Ticketing scale, inventario, dispatch; integra pese con produzione e fleet tracking | [seconda mano: Command Alkon] |
| **Trimble Business Center** | Volume stockpile da rilievi (SX12, X9 laser); estrae volumi automatici per reportistica | [seconda mano: Trimble Geospatial] |
| **Propeller Aero / Stockpile Reports** | Drone volumetria + storici; esporta a ERP per riconciliazione; tolleranza 2–5% | [seconda mano: Propeller Aero] |
| **Kespry Cloud** | Mining-only, volumetria entro 1–3%, integrazione ERP, esportazione liste per riconciliazione mensile | [seconda mano: Kespry] |
| **Birdi** | Multi-site, collaborative, drone volumetria con shrink/swell, target 2–5% | [seconda mano: Birdi] |
| **Datamine (Tier 1 Mining)** | Enterprise production accounting; mine-to-mill reconciliation completa, metallurgical accounting | [seconda mano: Datamine Software] |

### Domande per il delta (confronto con app)

1. **Come la nostra app raccoglie le stime di tonnellate prodotte da turno?** Deriva da volumi eye estimate (m³ scavato) o da pesate progressive?
2. **Distingue densità in banco da densità sciolta (bulk)?** E traccia quando la densità viene aggiornata (per cambi di materiale, umidità)?
3. **Chi decide la base di riconciliazione** — scavato, venduto, o rilievi drone?
4. **Esiste un flusso di storico dei rilievi volumetrici** (cumuli per data) con versioning, o ogni nuovo rilievo sovrascrive il precedente?
5. **Come si registra un'anomalia di riconciliazione** (es. prodotto 1.000 t, venduto 950 t, cumulo +30 t → delta −20 t)? C'è campo di causa, chi indaga, follow-up?
6. **La frequenza di riconciliazione è programmabile?** (mensile, settimanale, su richiesta)

### Fonti

- [Birdi: How to reconcile stockpile volumes](https://www.birdi.io/blog-post/how-to-reconcile-stockpile-volumes-a-step-by-step-guide-for-mine-and-quarry-operators)
- [Propeller Aero: Streamline Inventory Management](https://www.propelleraero.com/blog/streamline-inventory-management-at-your-quarry-or-mine-with-stockpile-reports/)
- [Kespry: Inventory Management](https://kespry.com/aerial-intelligence/use-cases/inventory-management/)
- [DroneDeploy: Accurate Stockpile Measurements](https://www.dronedeploy.com/blog/how-to-get-accurate-stockpile-measurements-in-mining)
- [Propeller Aero: Calculating Shrink/Swell](https://help.propelleraero.com/hc/en-us/articles/28452401313559-Calculating-Shrink-Swell)
- [Propeller Aero: Audit Aggregate Inventory](https://www.propelleraero.com/blog/audit-aggregate-inventory/)
- [Minebright: Mine Reconciliation Guide](https://minebright.com/reconciliation-guide/)
- [Datamine: Production Accounting](https://dataminesoftware.com/solutions/production/)
- [Trimble Geospatial: Mining Operations](https://geospatial.trimble.com/en/industries/mining/operations-and-processing)
- [CivilToday: Density of Aggregate](https://civiltoday.com/civil-engineering-materials/aggregate/198-density-of-aggregate)


### Il delta, fatto da chi ha il codice in mano (02/09, contro `f20b9668`)

Le sei domande, risposte aprendo le funzioni e non cercando i nomi. Per ogni
«non c'è» il comando e la sua uscita, così si rilancia.

1. **Come si raccolgono le stime dei turni** → esiste: il rapportino di Campo
   porta `prodQta` + `prodUnita`, e `produzioneRapportino` in `shared/dw-ponti.js`
   accetta tre unità — `grep -oE 'RAPP_UNITA = \[[^]]*\]' shared/dw-ponti.js` →
   `["t", "m³", "viaggi"]`. È una stima a occhio di fine turno, come nel mondo;
   nessuna pesata progressiva, e il ponte 3f la confronta con la pesa **solo in
   tonnellate**, dichiarando fuori m³ e viaggi.
2. **Densità in banco contro densità sciolta** → **non c'è come dato, c'è come
   avvertenza**. Il listino ha UNA densità per prodotto (`prodotti.densita`, in
   t/m³, 69 occorrenze in `conti-data.js`) ed è quella di vendita; ogni DDT ne
   conserva una copia (`pesate.densita`), quindi lo storico per consegna esiste.
   Un campo distinto per la densità in banco: `grep -cE
   'densitaBanco|densitaInBanco|densitaSciolta|inBanco' apps/conti/conti-data.js
   apps/terra/terra-data.js` → **0 e 0**. La schermata «Cavato contro venduto»
   lo DICE («il rilievo misura il volume in banco, mentre la densità del
   listino è quella con cui vendi… Conti non lo corregge con nessun coefficiente
   inventato») — è il principio giusto applicato a un dato che manca. ⏱️
   **Candidato**: una densità in banco per litotipo, dichiarata dall'azienda
   (non inventata), che permetta di convertire il cavato di Terra in tonnellate
   e chiudere il triangolo su una sola unità. Valore alto (la ricerca lo mette
   fra le prime cause di scarto: 1,60 → 1,55 t/m³ su 50.000 m³ sono 2.500 t),
   costo medio (listino + `riconciliazione` + nota). *Proposto da ricerca,
   meccanismo verificato, NON in roadmap finché non lo decide un cantiere.*
3. **La base della riconciliazione** → oggi sono DUE confronti a coppie sulla
   stessa schermata: cavato (Terra) contro venduto, prodotto (Campo) contro
   venduto. La terza grandezza del mondo — **le scorte a piazzale misurate come
   inventario** — non esiste in nessuna delle tre app: `grep -ciE
   'stockpile|scorte a piazzale|inventario' apps/terra/terra-data.js` → **0**,
   idem in Conti. Terra conosce il cumulo solo come *provenienza* di un volume
   rimosso (`provenienza: "cumulo"`, 32 occorrenze), non come volume che sta
   fermo sul piazzale. Quindi l'equazione che il mondo chiude ogni mese —
   prodotto − venduto = Δ scorte — da noi ha il terzo termine mancante, e la
   schermata lo chiama onestamente «scorte a piazzale **stimate**». ⏱️
   **Candidato** (il più grosso): un rilievo di Terra di tipo «inventario dei
   cumuli» (volume per prodotto, alla data), e in Conti la chiusura del
   triangolo. Valore alto, costo alto (Terra + Conti + ponte). *Proposto da
   ricerca, meccanismo verificato.*
4. **Storico dei rilievi con versioni** → esiste: ogni rilievo è un record
   datato in `rilievi` di Terra, mai sovrascritto (la dimostrazione ne ha sette
   da tre anni, t0–t6, e il confronto sceglie per periodo).
5. **Registrare un'anomalia con la causa** → **non c'è**: `grep -n divario
   apps/conti/conti-data.js | grep -ciE 'aggiungi|salva|storico|chiusur'` →
   **0**. Il divario si calcola ogni volta e non si conserva; le tre cause
   possibili la schermata le elenca già, in ordine, ma nessuno può scrivere
   «era la seconda» e ritrovarlo il mese dopo. Le `chiusure` di Conti chiudono
   i COSTI del mese (`statoMese`), non la riconciliazione. ⏱️ **Candidato**:
   un verbale di riconciliazione per periodo — divario, causa scelta fra
   quelle elencate, nota — salvato in `orgCollection`, con lo storico che
   mostra se il divario cresce. Valore medio, costo basso.
6. **Frequenza programmabile** → parziale: il periodo è libero (dal/al) con i
   due scorciatoie «Quest'anno» / «Anno scorso» (`grep -cE 'btn-ric-anno|
   btn-ric-prec' apps/conti/index.html` → 4); manca un «questo mese» e non c'è
   nessun promemoria. Costo basso, ma da solo vale poco senza il punto 5.

Riassunto: **tre esistono (1, 4, e il principio del 2), due mancano davvero
(3 e 5), una è a metà (6)**. Nessuna delle due mancanze entra in roadmap sulla
parola di questa ricerca: entrano quando un cantiere le sceglie, e il primo
candidato per costo/valore è il **5** (il verbale), perché dà uno storico ai
due confronti che esistono già.
