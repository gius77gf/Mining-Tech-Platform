# Terra — ricerca di prodotto (luglio 2026)

Documento per Giuseppe. Domanda di partenza: **Terra oggi cosa fa davvero, e
cosa le manca per essere lo strumento del direttore di cava** — non solo per i
volumi, ma anche per gli **obblighi verso gli enti** (autorizzazione, denunce,
fideiussione, ripristino).

Metodo: prima ho letto il codice di `apps/terra/` riga per riga (niente
promesse su funzioni che non esistono), poi ho fatto una ricerca sul web su
normativa italiana delle cave, calcolo dei volumi da rilievo e software
concorrenti. Alla fine c'è una tabella di proposte con difficoltà e priorità.

> ⚠️ **Avvertenza importante, da tenere sempre presente**: in Italia le cave
> sono materia **REGIONALE**. Non esiste una legge unica nazionale che dica
> "il volume si denuncia così, entro questa data". Ogni regione ha la sua
> legge, il suo piano (PRAE) e i suoi moduli. Quello che scrivo qui sono i
> **temi ricorrenti**, non regole valide ovunque. Terra deve essere costruita
> in modo **configurabile** (l'utente imposta le sue scadenze e le sue soglie),
> mai con regole fisse "di legge" scritte nel codice. Questo documento non è
> un parere legale.

---

## 1. Inventario onesto — cosa c'è già in Terra

File: `apps/terra/index.html` (450 righe), `apps/terra/terra-data.js` (288
righe). Struttura a 4 schermate: **Quadro · Fronti · Rilievi · Piano**.

### Dati che Terra sa gestire (le "collezioni" su Firestore, isolate per azienda)
| Collezione | Campi | Note |
|---|---|---|
| `fronti` | nome, banco, quota, dettaglio, avanzamento %, stato (attivo/sospeso) | CRUD completo + import CSV |
| `rilievi` | titolo, data, tipo, volume m³, metodo (RTK/PPK/GCP…), GSD, fronte, stato (elaborato/pianificato) | aggiunta, cancellazione dei pianificati, import CSV |
| `piano` | titolo, dettaglio, stato (vigente/in esame), volume annuo pianificato, riserve m³ | solo il volume annuo è modificabile a mano |

### Funzioni già FATTE e funzionanti
1. **Fronti di cava**: elenco, aggiunta, modifica (nome/banco/quota),
   sospensione/riattivazione, import da CSV, volume estratto per fronte.
2. **Rilievi**: registrazione di un rilievo con volume, oppure pianificazione
   di un rilievo futuro (data futura = "pianificato", senza volume). Ricerca,
   filtri, ordinamento, conteggio.
3. **Qualità e onestà del numero** — è la cosa migliore che Terra ha oggi:
   - `classeAccuratezza()`: dal metodo (RTK/PPK/GCP) e dal GSD assegna
     "Survey-grade" (tolleranza tipica ±2%) o "Indicativo" (±8%);
   - `bandaVolume()`: mostra il volume come **"19.400 m³ ± 388"** invece di un
     numero finto-esatto. Pochissimi strumenti lo fanno in modo così chiaro.
4. **Andamento**: `trendVolumi()` confronta gli ultimi due rilievi elaborati
   (in aumento / in calo, con percentuale).
5. **Proiezione di fine anno** (`proiezioneAnnua`): dal ritmo attuale stima
   quanto si estrarrà entro dicembre e lo confronta col volume annuo
   pianificato/autorizzato, con semaforo verde/giallo/**rosso** ("rischio di
   superare il volume autorizzato"). Questa è già una funzione di
   **conformità**, ed è un punto di forza.
6. **Riserva residua** (`riservaResidua`): riserve − estratto nell'anno, e
   durata stimata in anni al ritmo del piano.
7. **Valore del materiale**: m³ → tonnellate → euro, con una **libreria di
   densità tipiche per litotipo** (`DENSITA_PRESET`, 10 voci con fonte) e
   l'avviso che la densità va confermata in laboratorio.
8. **Ponte col visore drone di Genesi** (pulsante "🛸 Dal visore drone"):
   riprende dal browser l'ultimo ritaglio con volume calcolato nel visore
   nuvola e **precompila il modulo del rilievo**. Il flusso drone → volume →
   Terra è già chiuso, seppure in modo semplice.
9. **Import/export CSV** di fronti e rilievi, con controllo dei doppioni.
10. **PWA**, stile Deepwork con accento verde, modalità tour con dati di
    esempio, isolamento multi-azienda via SDK Deepwork ID.

### Cosa NON c'è (per chiarezza)
- Nessuna gestione dell'**atto autorizzativo** (numero, ente, scadenza,
  volume totale concesso, superficie, prescrizioni).
- Nessuna **fideiussione**, nessun **collaudo**, nessuna scadenza da
  monitorare: Terra non avvisa di niente.
- Nessun **piano di coltivazione strutturato**: la collezione `piano` è
  praticamente un elenco di note; non ci sono lotti, fasi, quote di progetto,
  cronoprogramma.
- Nessun **ripristino ambientale**: non si sa quanta superficie è stata
  scavata e quanta recuperata.
- Nessun **registro per gli enti**: non c'è un riepilogo annuale dei volumi
  stampabile o esportabile in un formato che assomigli a una denuncia.
- Nessuna **riconciliazione** tra il volume rilevato e il materiale
  effettivamente venduto/pesato.
- Nessuna **mappa**: niente curve di livello, niente sezioni, niente cut&fill.
  Terra oggi è tutta a numeri ed elenchi.
- I **volumi si sommano** senza distinguere "scavo" da "accumulo": un rilievo
  di un cumulo di materiale già estratto e un rilievo di scavo del fronte
  finiscono nello stesso totale. È un limite concettuale da sistemare presto.

Documenti già esistenti da tenere collegati: `docs/TERRA_RILIEVI_ROADMAP.md`
(confronto coi software di rilievo), `vault/RICERCA_ACCURATEZZA_RILIEVI.md`
(da dove vengono le tolleranze ±2%/±8%), `docs/DEEPWORK_DRONE_FLUSSO.md`
(il flusso drone → nuvola), `docs/GENESI_POINT_CLOUD.md` (il visore).

---

## 2. Cosa manca — dalla ricerca

### 2a. Gli obblighi verso gli enti (il vero buco di Terra)

**L'autorizzazione all'esercizio.** In tutte le regioni scavare richiede
un'autorizzazione (o concessione) coerente col **PRAE — Piano Regionale delle
Attività Estrattive**, che dice *dove* si può cavare e con quali criteri.
L'atto fissa: l'area, il **volume estraibile**, la **durata** e le
prescrizioni. Le durate cambiano molto: si trovano concessioni fino a 12 anni
in alcune regioni e autorizzazioni fino a 20 anni in Sicilia (L.R. 6/2024).
→ *Terra oggi non sa nemmeno quando scade l'autorizzazione del cliente.*

**La fideiussione (la garanzia).** Per ottenere l'autorizzazione l'azienda
deposita una **polizza fideiussoria** che garantisce il ripristino. Non è un
dettaglio: la polizza va **tenuta in vita** fino allo svincolo, va **rinnovata**
se i lavori si allungano, e si **svincola solo dopo il collaudo finale** (in
alcune regioni con un sopralluogo formale a cui partecipano titolare,
direttore dei lavori, Comune e ufficio regionale delle risorse estrattive).
→ *È una scadenza costosa da dimenticare: perfetta per uno scadenzario.*

**VIA e verifica di assoggettabilità (screening).** I progetti di cava
rientrano nell'Allegato IV del D.Lgs 152/2006: sotto certe soglie si fa la
**verifica di assoggettabilità** (screening), sopra la **VIA** vera e propria.
Le soglie sono ridotte in percentuale dai criteri del D.M. 52/2015 e dalle
regole regionali. Anche l'esito dello screening ha scadenze e prescrizioni da
rispettare.
→ *Terra può tenerne traccia come documento con scadenza e prescrizioni, senza
mai pretendere di dire "tu devi fare la VIA": quello lo dice il tecnico.*

**La denuncia annuale dei volumi / statistica mineraria.** Questo è il tema più
concreto. Diverse regioni obbligano il titolare a comunicare ogni anno:
volumi **estratti**, volumi **lavorati**, volumi **commercializzati** e
destinazione, oltre ai materiali di provenienza esterna trattati in cava.
In Piemonte c'è un modello statistico da inviare **entro il 30 aprile**, e va
inviato **anche se non si è scavato nulla** (spiegandone il motivo). Alcune
regioni chiedono anche la comunicazione di **fine lavori entro 30 giorni**, con
verifica dei volumi scavati e delle opere di recupero.
→ *Terra ha già tutti i numeri per compilarla: manca solo la vista annuale e
l'export.*

**Gli oneri/diritti di escavazione.** Molte regioni fanno pagare un **contributo
a metro cubo estratto**. Esempio verificabile: in Piemonte, per sabbie e ghiaie
per calcestruzzo/conglomerati/sottofondi, **0,51 €/m³** (tariffe aggiornate dal
1° gennaio 2026 e riviste ogni due anni con l'indice ISTAT). Dettaglio
importante: la tariffa si applica al volume estratto **al netto** del materiale
usato per il recupero ambientale della cava stessa; per la pietra ornamentale
si applica invece solo alla quantità commercializzata.
→ *Un calcolo semplicissimo (m³ × tariffa) che però nessuno ha sotto mano, e
che lega Terra a Conti.*

**Le planimetrie aggiornate.** Il **D.P.R. 128/1959** ("polizia delle miniere e
delle cave") impone di tenere **aggiornate le planimetrie dei lavori**, con
consegna al distretto minerario di una copia aggiornata, firmata da direttore e
rilevatore. L'obbligo nella sua forma più stringente riguarda miniere e cave in
sotterraneo, ma la logica — *il rilievo periodico è un obbligo, non un lusso* —
regge anche a cielo aperto, e molte leggi regionali la ripetono a modo loro.
→ *Terra può diventare l'archivio ordinato e datato di quei rilievi.*

**Il ripristino ambientale.** Le norme regionali chiedono che il recupero sia
fatto **contestualmente** alla coltivazione dove possibile, e che coltivazione e
recupero siano **articolati in lotti successivi**. Si trovano progetti reali in
cui *un nuovo lotto di coltivazione può iniziare solo dopo che almeno l'80% del
recupero ambientale del lotto precedente è completato*.
→ *È una regola numerica, quindi Terra la può calcolare e segnalare.*

### 2b. Cosa fanno i concorrenti (e cosa vale la pena copiare)

Dai software di rilievo drone (Propeller, Pix4D, DroneDeploy) e di mine
planning (Surpac, Datamine, Micromine, K-MINE):

| Funzione dei concorrenti | Vale per noi? |
|---|---|
| Volume calcolato **dal dato 3D**, non digitato | Sì — c'è già il POC in Genesi, va rifinito il ponte |
| **Confronto tra due rilievi** (cut/fill): quanto e **dove** si è scavato | In parte: il "quanto" sì, il "dove" (mappa a colori) è pesante per il browser |
| **Confronto col progetto** (superficie di progetto vs rilievo) | Sì, ma in versione semplice: quote di progetto per banco, non superfici 3D |
| **Timeline dei rilievi** con avanzamento nel tempo | Sì, facile e di grande effetto |
| **Sezioni** e **curve di livello** | Fattibile in browser (marching squares / d3-contour, poche righe) |
| **Calcolo riserve** con qualità/tenori | No: serve un modello geologico, fuori portata |
| **Riconciliazione** rilievo ↔ produzione ↔ pesa | Sì, ed è il nostro punto forte perché abbiamo Conti |
| Report ripetibile / verbale di rilievo | Sì, facilissimo e molto richiesto |

Punto importante sulla riconciliazione: nella pratica il volume rilevato e le
tonnellate della pesa **non tornano mai perfettamente**. Il materiale in banco
si "gonfia" quando viene abbattuto (**swell / fattore di rigonfiamento**, tipico
+20…+40% a seconda di umidità e pezzatura), e gli errori di densità possono
arrivare a ±10% se la densità non è misurata sul materiale vero. Chi lavora in
cava lo sa e vuole vedere **la differenza spiegata**, non nascosta.

### 2c. Idee di valore (dove Terra può essere migliore, non solo "uguale")

- **Terra come "cruscotto di conformità"**: non "quanti m³ ho fatto", ma
  *"sono dentro l'autorizzato? quanto mi resta di vita cava? cosa scade?"*.
  I software di rilievo raccontano il passato, Terra può raccontare il rischio.
- **Onestà come funzione**: la banda ±% c'è già. Estenderla a tutti i numeri
  derivati (tonnellate, euro, oneri) è il nostro marchio di fabbrica.
- **Semplicità per chi non è tecnico**: nessun concorrente parla al direttore
  di cava in italiano semplice. Frasi come *"al ritmo attuale finisci
  l'autorizzato a novembre"* valgono più di una mappa 3D.

---

## 3. I collegamenti con le altre app

### 3a. Con il visore nuvola di **Genesi** (da NON duplicare)
Il visore vive in `apps/genesi/pointcloud.js` + `apps/genesi/nuvola-poc.html`.
Sa già: caricare LAS/PLY/XYZ/OBJ, alleggerire nuvole grandi, ritagliare con tre
cursori, e **stimare il volume del ritaglio** con `volumeCumulo()` — metodo a
griglia: proietta i punti su celle quadrate (0,5 m di lato), prende la quota
massima per cella e integra sopra un piano di base preso al **2° percentile**
delle quote (così un punto sporco sotto il piano non gonfia il volume).

**Onestà su cosa vale davvero questo numero** (importante, da non gonfiare):
- È una **stima**, della stessa famiglia dei metodi commerciali, ma con
  **base piana**: va bene per un cumulo su piazzale, molto meno per uno scavo
  su terreno inclinato.
- L'accuratezza è quella del rilievo di partenza: con drone consumer **senza
  punti di controllo a terra** la forma è buona ma la **scala assoluta è
  approssimativa** (la banda "Indicativo ±8%" di Terra è lì apposta).
- Non è fotogrammetria: le foto diventano nuvola con **OpenDroneMap**, fuori
  dal browser (vedi `docs/DEEPWORK_DRONE_FLUSSO.md`).

**Cosa serve fare, quindi:** *non* riscrivere il visore in Terra, ma **rinforzare
il ponte**. Oggi passa solo il numero del volume, tramite la memoria del
browser. Il passo giusto è portarsi dietro anche la **provenienza** (nome del
file, lato della cella, quota di base usata, numero di punti, data) e salvarla
nel rilievo: così il volume è **tracciabile** e difendibile in un controllo,
non un numero comparso dal nulla. Ed è anche il modo di distinguere finalmente
"volume di scavo" da "volume di cumulo".

### 3b. Con **Conti** (volumi → tonnellate → valore)
La catena logica completa è:

```
rilievo (m³ in banco)  ──×densità in situ──▶  tonnellate  ──×prezzo──▶  €
        │                                          │
        │                                          └──▶ CONFRONTO con le tonnellate
        │                                               realmente vendute (Conti)
        └──× tariffa €/m³ ──▶ onere di escavazione dovuto alla Regione (Conti)
```

Terra oggi fa solo il primo pezzo, e lo fa **dentro Terra**, con densità e
prezzo digitati a mano. I due anelli mancanti sono quelli che portano soldi
veri:
1. **Riconciliazione**: "il rilievo dice 19.400 m³ ≈ 50.400 t; le fatture di
   Conti dicono 46.800 t venduti; differenza −7%". Va spiegata (rigonfiamento,
   scarti, materiale ancora in piazzale, errore del rilievo) — non nascosta.
2. **Oneri di escavazione**: m³ estratti × tariffa regionale = costo da mettere
   a bilancio, con la regola del netto per il materiale usato nel ripristino.

Nota tecnica: essendo app diverse ma stessa organizzazione, il collegamento si
fa leggendo le collezioni dell'altra app tramite lo stesso SDK Deepwork ID —
niente percorsi Firestore scritti a mano, l'isolamento tra aziende resta
intatto. Da valutare col fondatore se Terra può leggere i dati di Conti o se
serve un riepilogo condiviso.

---

## 4. Tabella delle proposte

Difficoltà: **S** = poche ore · **M** = una o due giornate · **L** = più giorni
o richiede decisioni del fondatore.
Priorità: **1** = da fare presto · **2** = subito dopo · **3** = quando c'è tempo.

| # | Nome | Cosa fa | Perché serve | Diff. | Pri. |
|---|---|---|---|---|---|
| 1 | **Scheda autorizzazione** | Nuova collezione: numero atto, ente, date, superficie, **volume totale autorizzato**, tipo materiale, prescrizioni, note | Oggi Terra non sa qual è il titolo che regge tutto il lavoro. È la base di quasi tutto il resto | M | 1 |
| 2 | **Contatore vita cava** | Volume totale autorizzato − somma di tutto l'estratto = quanto resta, e in quanti anni | Terra oggi controlla solo l'anno. Il rischio vero è sforare il **totale** concesso | S | 1 |
| 3 | **Scadenzario Terra** | Elenco unico di scadenze: autorizzazione, **fideiussione**, screening/VIA, collaudo, rilievo periodico. Semaforo e avvisi | Dimenticare il rinnovo di una polizza costa carissimo. Stesso schema già usato in Scudo | M | 1 |
| 4 | **Riepilogo annuale volumi (per la denuncia)** | Vista per anno: estratto per fronte/materiale/mese, totale, confronto con l'autorizzato; export CSV e stampa | Molte regioni chiedono una denuncia annuale dei volumi. I dati ci sono già, manca la vista | M | 1 |
| 5 | **Provenienza del volume dal visore** | Il ponte con Genesi salva anche file, cella, quota di base, punti, data; e chiede se è **scavo** o **cumulo** | Rende il volume tracciabile e difendibile, e risolve il difetto di sommare scavo e cumuli insieme | S | 1 |
| 6 | **Riconciliazione con Conti** | m³ → t (densità) vs tonnellate vendute; mostra la differenza in % con il fattore di rigonfiamento | Il numero che il titolare guarda per primo. Nessun concorrente lo racconta in italiano semplice | M | 2 |
| 7 | **Oneri di escavazione** | Tariffa €/m³ impostabile dall'utente, calcolo del dovuto per periodo, con il netto del materiale da ripristino | Costo reale, ricorrente, oggi calcolato a mano su un foglio | S | 2 |
| 8 | **Piano di coltivazione a lotti** | Il piano diventa lotti/fasi: volume previsto, quote di partenza e arrivo, anni, stato, avanzamento per lotto | I progetti autorizzati sono organizzati per lotti: oggi Terra non li rappresenta affatto | M | 2 |
| 9 | **Ripristino ambientale** | Superficie scavata vs ripristinata per lotto, % di recupero, regola configurabile "nuovo lotto solo se il precedente è recuperato almeno all'X%" | Obbligo reale e ricorrente, e condizione per lo svincolo della garanzia | M | 2 |
| 10 | **Verbale di rilievo stampabile** | Una pagina per rilievo: volume, banda ±, metodo, GSD, provenienza, fronte, firma direttore | Il deliverable documentale che i concorrenti vendono; per noi è quasi gratis | S | 2 |
| 11 | **Confronto tra due rilievi dello stesso fronte** | Delta di volume tra due date con banda d'errore combinata | Il "quanto è stato scavato tra le due date" senza dover fare cut/fill 3D | S | 2 |
| 12 | **Timeline dell'avanzamento** | Grafico dei volumi cumulati nel tempo con la linea dell'autorizzato | Un'immagine che spiega in 2 secondi se si è in pari col piano | M | 2 |
| 13 | **Quote di progetto per banco** | Per ogni banco: quota di progetto, quota rilevata, alzata/pedata, scostamento | Scavare sotto quota è una violazione seria e un rischio di stabilità | M | 3 |
| 14 | **Curve di livello del ritaglio** | Dalla griglia di quote già calcolata in Genesi, curve di livello con marching squares (d3-contour, poche righe, nessun servizio esterno) | Rende visivo quello che oggi è solo un numero | M | 3 |
| 15 | **Mappa cut/fill tra due rilievi** | Differenza tra due griglie di quote, colorata (rosso scavato / blu accumulato) | La funzione-simbolo dei concorrenti. **Ma**: richiede due nuvole ben allineate; con drone consumer senza punti a terra il risultato può essere fuorviante | L | 3 |
| 16 | **Archivio nuvole per rilievo** | Conservare in cloud il file della nuvola legato al rilievo | Utile, ma i file sono grandi: **richiede una decisione di spesa** → rinviato | L | — |

Non proposto di proposito: fotogrammetria nel browser (foto → nuvola), modello
geologico/tenori, integrazione con servizi GIS a pagamento. Tutti fuori portata
o fuori dai vincoli (niente spese, niente licenze).

**Ordine consigliato per iniziare**: 1 → 2 → 3 → 4 → 5. Sono cinque unità
piccole, tutte sui dati che Terra già ha o che l'utente digita una volta sola,
e insieme trasformano Terra da "registro dei volumi" a **strumento di
conformità** — il motivo per cui un direttore di cava paga.

---

## 5. Fonti

**Regole diverse in ogni regione**: quanto segue serve a capire i temi, non a
dedurre obblighi. Prima di scrivere in Terra qualunque frase tipo "devi fare
X entro Y", va verificata la legge della regione del cliente, e in ogni caso è
meglio rendere scadenze e soglie **configurabili dall'utente**.

Normativa e autorizzazioni
- [Attività estrattive — Regione Piemonte](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive) · [competenze regionali](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/competenze-regionali-materia-attivita-estrattive)
- [Piani Regionali delle Attività Estrattive — quadro per regione (Exeo)](https://www.exeo.it/Articoli/11054/pianificazione-attivita-estrattiva-regioni-province.aspx) · [L'autorizzazione amministrativa alla coltivazione di una cava](https://www.exeo.it/Articoli/11049/l-autorizzazione-amministrativa-alla-coltivazione-di-una-cava.aspx)
- [PRAE Puglia — norme tecniche di attuazione (PDF)](http://cartografia.sit.puglia.it/doc/NTA_PRAE_revisione_finale_BIS_281009.pdf) · [L.R. Puglia 22/2019](https://olympus.uniurb.it/index.php?Itemid=137&catid=27&id=20665%3A2019puglia22&option=com_content&view=article)
- [PRAE Campania — linee guida (PDF)](https://sito.regione.campania.it/lavoripubblici/Elaborati_PRAE_2006/c_Linee_guida.pdf)
- [L.R. Piemonte 23/2016 — disciplina delle attività estrattive](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=17012:pie23_16&catid=27&Itemid=137)
- [L.R. Sicilia 6/2024 — riordino normativo materiali da cava](http://www.edizionieuropee.it/LAW/HTML/222/si3_06_088.html) · [testo ARS](https://w3.ars.sicilia.it/lex/L_2024_006.htm)
- [Regolamento regionale Calabria 8/2023](https://olympus.uniurb.it/index.php?Itemid=137&catid=27&id=30744%3Acal8_23&option=com_content&view=article)
- [D.P.R. 128/1959 — polizia delle miniere e delle cave (PDF)](https://pugliacon.regione.puglia.it/documents/72607/118877/AE_LEX_IT_04_DPR128_59.pdf/9c8638e0-d0d8-2916-9ec4-1d88d806bc0d) · [testo in Gazzetta Ufficiale](https://www.gazzettaufficiale.it/eli/id/1959/04/11/059U0128/sg)
- [Autorizzazione alla coltivazione di cava — documentazione tipica (Comune di Ascoli Piceno)](https://www.comune.ap.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/6704) · [Comune di Massa](https://www.comune.massa.ms.it/servizi/autorizzazione-attivita-di-coltivazione-cava)

VIA / verifica di assoggettabilità
- [Normativa vigente in materia di VIA — ISPRA](https://www.isprambiente.gov.it/it/attivita/autorizzazioni-e-valutazioni-ambientali/valutazione-di-impatto-ambientale-via/normativa-vigente-in-materia-di-via-1)
- [Verifica di assoggettabilità (screening) — Regione Liguria](https://www.regione.liguria.it/homepage-ambiente/cosa-cerchi/via-vas-aia-aua/valutazione-impatto-ambientale-via/campo-di-applicazione-e-autorita-competente/verifica-di-assoggettabilita-alla-via-screening.html) · [Provincia di Padova](https://www.provincia.pd.it/03-verifica-di-assoggettabilita-art-19-del-dlgs-1522006)
- [D.M. 52/2015 — linee guida sulle soglie (Gazzetta Ufficiale)](https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=0&art.idArticolo=1&art.versione=1&art.codiceRedazionale=15A02720&art.dataPubblicazioneGazzetta=2015-04-11&art.idGruppo=0&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=1)
- [Autorizzazione cava: in istanza anche gli atti per la VIA (ReteAmbiente)](https://www.reteambiente.it/news/34501/autorizzazione-cava-in-istanza-anche-atti-per-valutazione-im/)

Fideiussioni, collaudo, ripristino
- [Garanzie — Regione del Veneto](https://www.regione.veneto.it/web/ambiente-e-territorio/garanzie) · [presentazione delle fideiussioni — SIT Puglia](https://pugliacon.regione.puglia.it/web/sit-puglia-ambiente/presentazione-delle-fidejussioni)
- [Bollettino Regione Abruzzo — svincolo della garanzia dopo il collaudo finale (PDF)](https://bura.regione.abruzzo.it/sites/bura.regione.abruzzo.it/files/bollettini/2025-07-22/bollettino-speciale-numero-182-del-25-07-2025.pdf)
- [Il recupero ambientale delle cave: un vincolo spesso disatteso (RGA Online)](https://rgaonline.it/giurisprudenza/il-recupero-ambientale-delle-cave-un-vincolo-spesso-disatteso/)
- [Autorizzazioni all'esercizio dell'attività estrattiva — Città metropolitana di Milano](https://www.cittametropolitana.mi.it/portale/URP/Servizi/Ambiente/cave/schede/Autorizzazioni_esercizio_attivita_estrattiva?idf=2524&idp=2)

Denunce dei volumi e oneri
- [Statistica mineraria annuale — Regione Piemonte (invio entro il 30 aprile)](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale)
- [Onere per il diritto di escavazione — Regione Piemonte (tariffe €/m³)](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione) · [oneri istruttori e diritti di escavazione — Città metropolitana di Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/oneri_diritti_escavazione.html)
- [Le tariffe di escavazione delle cave: obiettivi e contraddizioni (Quarry & Construction)](https://www.quarryandconstructionweb.it/rubriche/collaborazioni/le-tariffe-di-escavazione-delle-cave:-gli-obiettivi-e-le-contraddizioni-della-legislazione-regionale.htm)
- [L.R. Veneto sulle attività estrattive — comunicazione dei volumi estratti/lavorati/commercializzati](https://bur.regione.veneto.it/BurvServices/pubblica/DettaglioLegge.aspx?id=366192)

Piano di coltivazione, lotti e fasi
- [Linee guida sulla documentazione da presentare — Regione Valle d'Aosta](https://www.regione.vda.it/allegato.aspx?pk=44927)
- [Esempio reale di piano di coltivazione e sistemazione (PDF, Comune di Toano)](https://www.comune.toano.re.it/wp-content/uploads/R2.1_PSC_Fora-di-Cavola_Progetto.pdf)
- [Studio preliminare ambientale con lotti e cronoprogramma — Regione Calabria (PDF)](https://www.regione.calabria.it/wp-content/uploads/2025/01/STUDIO_PRELIMINARE_AMBIENTALE.pdf)
- [Norme tecniche di attuazione, autorizzazione estrattiva — Comune di Sassuolo (PDF)](https://www.comune.sassuolo.mo.it/servizi/ambiente/approfondimenti/autorizzazione-estrattiva-cave/norme_tecniche_di_attuazione.pdf/@@download/file)

Calcolo dei volumi e precisione dei rilievi
- [Calcolo dei volumi di sterro e riporto — sezioni ragguagliate (PDF, Geodis)](http://www.geodis.it/Articolocalcolovolumi.pdf) · [metodo delle sezioni ragguagliate (Ctrl+Alt+CAD)](http://ctrl-alt-cad.blogspot.com/2012/02/calcolo-volumi-metodo-delle-sezioni.html)
- [Rappresentazione grafica dei volumi (Zanichelli, PDF)](https://online.scuola.zanichelli.it/cannarozzomisure-files/Volume_3/Approfondimenti/Zanichelli_Cannarozzo_Vol3_UnitaQ4_08.pdf)
- [Stockpile survey accuracy: confronto tra metodologie](https://www.dronetechaerospace.co.uk/post/stockpile-survey-accuracy-a-technical-comparison-of-modern-methodologies)
- [Drone surveying 101: dal GSD alle nuvole di punti (DroneDeploy)](https://www.dronedeploy.com/blog/drone-surveying-101-from-gsd-to-point-clouds) · [differenza 1,1% rispetto al rilievo tradizionale](https://www.dronedeploy.com/blog/closing-the-gap-how-archer-western-and-dronedeploy-observed-a-1-1-difference-in-stockpile-quantities-compared-to-traditional-survey-methods)
- [RTK, GCP e precisione GPS spiegati (GeoNadir)](https://geonadir.com/rtk-explained/)
- [Drone mining & quarry survey guide (Angell Surveys)](https://angellsurveys.com/insights/drone-mining-quarry-survey-volumetrics-guide/)
- [DEM, DSM e DTM spiegati (3Dsurvey)](https://3dsurvey.si/what-is-an-elevation-model/) · [misurare volumi e cambiamenti nel tempo (SPH Engineering)](https://www.sphengineering.com/news/how-to-measure-volumes-and-track-landscape-changes)

Riconciliazione e fattori di rigonfiamento
- [Come riconciliare i volumi dei cumuli (Birdi)](https://www.birdi.io/blog-post/how-to-reconcile-stockpile-volumes-a-step-by-step-guide-for-mine-and-quarry-operators)
- [Swell nelle coltivazioni a cielo aperto (Atlantech)](https://atlantech.com.au/2026/05/06/swell-in-open-cut-mining-the-hidden-multiplier-behind-volumes-costs-and-dump-capacity/)
- [Mine reconciliation — guida semplificata (minebright)](https://minebright.com/reconciliation-guide/)

Software concorrenti
- [Propeller — confronto tra superfici e misure di volume](https://help.propelleraero.com/hc/en-us/articles/19384053844631-Surface-comparisons-and-volume-measurements-in-Propeller) · [progress tracking](https://www.propelleraero.com/platform/progress-tracking/) · [sezioni da dati drone](https://www.propelleraero.com/blog/cross-section-survey-using-drone-data/)
- [GEOVIA Surpac (Dassault)](https://www.3ds.com/products/geovia/surpac) · [Datamine — planning](https://dataminesoftware.com/solutions/planning/) · [Micromine](https://www.micromine.com/beyond/) · [K-MINE 2026](https://k-mine.com/streams/webinar-k-mine-2026-one-software-platform-for-mining-industry/)
- [Project Building — gestionale italiano per cave e impianti](https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html)

Tecnica per le curve di livello (fattibilità nel browser)
- [d3-contour — marching squares su una griglia](https://d3js.org/d3-contour) · [repository](https://github.com/d3/d3-contour) · [maplibre-contour, curve da DEM nel browser](https://github.com/onthegomap/maplibre-contour) · [marching squares (Wikipedia)](https://en.wikipedia.org/wiki/Marching_squares)

---

## Collegati
- `docs/TERRA_RILIEVI_ROADMAP.md` — confronto con i software di rilievo drone
- `vault/RICERCA_ACCURATEZZA_RILIEVI.md` — da dove vengono le tolleranze ±2%/±8%
- `docs/DEEPWORK_DRONE_FLUSSO.md` — il flusso drone → nuvola → Terra/Genesi
- `docs/GENESI_POINT_CLOUD.md` — il visore nuvola (che Terra NON deve duplicare)
- `docs/SCUDO_NORMATIVA_CAVE.md` — normativa sicurezza (confine con Scudo: la
  sicurezza sta in Scudo, l'autorizzazione a coltivare sta in Terra)
