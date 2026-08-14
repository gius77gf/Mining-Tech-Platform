# Sentinella — ricerca luglio 2026 (ambiente: vibrazioni, rumore, polveri, acque)

Documento di ricerca per Giuseppe. Scritto in italiano semplice.
Obiettivo: capire **cosa c'è già** in Sentinella, **cosa manca** rispetto agli
obblighi italiani e ai software concorrenti, e **quali funzioni conviene fare**
restando dentro i nostri vincoli (web-app statica, HTML+JS, dati su Firestore
tramite lo SDK deepwork-id-client, multi-tenant, nessuna spesa, nessun hardware).

> ⚠️ **Avviso importante sulle soglie.** In questo documento compaiono valori
> numerici presi da norme e da fonti pubbliche. Servono a capire l'ordine di
> grandezza, **non sono verità assoluta**. Ogni soglia che finisce dentro
> Sentinella va **confermata da te** e resta comunque **modificabile
> dall'azienda cliente**, perché il limite vero di una cava lo scrive
> l'autorizzazione (AUA/VIA/prescrizioni regionali), non un software.
> In Italia, per le vibrazioni in ambiente di vita, **non esiste una legge
> nazionale con un numero unico**: si usano norme tecniche richiamate caso per
> caso. È il punto più delicato di tutta l'app.

---

## 1. Inventario onesto: cosa c'è già oggi

File: `apps/sentinella/index.html` (509 righe) e `apps/sentinella/sentinella-data.js`
(277 righe). Quattro schermate: **Quadro**, **Monitoraggi**, **Adempimenti**,
**Registri**.

### Quadro (dashboard)
- 4 riquadri KPI cliccabili: monitoraggi attivi, superamenti soglia,
  adempimenti entro 30 giorni, conformi.
- **Lista unica di priorità** (`prioritaConformita`): mette insieme le misure
  fuori soglia e le scadenze vicine/scadute, ordinate per gravità. È una buona
  idea già realizzata.

### Monitoraggi (i punti di misura)
- Elenco dei punti con **stato calcolato** (`statoMisura`): conforme /
  attenzione (≥90% della soglia) / superamento (≥100%).
- Filtri per stato, ordinamento, ricerca testuale, contatore risultati.
- Creazione/modifica/cancellazione di un punto (nome, unità, soglia).
- **Libreria di soglie preimpostate** (`SOGLIE_PRESET`): 10 voci fra DIN 4150-3
  (industriale/residenziale/sensibile), USBM RI 8507, airblast 133 dB, PM10
  giornaliero/annuo e PM10 2030. Ogni preset porta già il flag `daVerificare`.
- **Registrazione di una lettura**: aggiorna il valore e **accoda uno storico**
  (`letture`, massimo 50 voci, solo data e valore).
- **Import CSV dei punti di misura** (`parseMonitoraggiCsv`).
- **Distanza scalata** `SD = R/√W` (`scaledDistance`) e **carica massima per
  ritardo** `W = (R/SD)²` (`caricaMax`).

### Adempimenti
- Elenco scadenze con ente e giorni mancanti, ricerca, aggiunta manuale,
  **import CSV** (`parseAdempimentiCsv`), "segna come eseguito".

### Registri
- Elenco registri (rifiuti, acque meteoriche, formulari) con stato
  aggiornato/in attesa.
- **Registro volate**: data, fronte, n° fori, kg totali, kg max per ritardo,
  distanza dal ricettore, esito (regolare / con contestazione).
  Riepilogo mensile (`riepilogoVolate`), import + export CSV con protezione
  anti-doppione, blocco delle date future.
- **Export CSV "ambiente"** per ARPA/consulente: monitoraggi + adempimenti.

### Documento di ricerca già esistente
`docs/SENTINELLA_VIBRAZIONI_ROADMAP.md` — ottimo lavoro precedente, contiene
già la distinzione fondamentale: **prevedere e documentare si può, misurare no**
(serve un sismografo). Quel principio resta valido e va tenuto.

### Riassunto onesto in una riga
Sentinella oggi è **un buon registro con semaforo**: sa dirti se un valore che
hai digitato supera una soglia che hai impostato. **Non sa ancora raccontare
l'andamento nel tempo, non produce un documento da consegnare all'ente, e non
sa collegare una volata progettata con quello che è stato misurato davvero.**

---

## 2. Cosa manca

### 2a. Buchi funzionali evidenti (indipendenti dalle norme)
1. **Nessun grafico**: lo storico esiste (`letture`) ma si vedono solo le
   ultime 3 letture come testo. Senza una linea nel tempo con la soglia
   disegnata sopra, un responsabile ambiente non ci lavora.
2. **Nessun import CSV delle misure nel tempo**: si importano i *punti*, non le
   *letture*. Ma i dati veri arrivano proprio così: un file con data, ora e
   valore, esportato dallo strumento.
3. **Nessuna anagrafica dei ricettori** (le case, la scuola, il confine). Oggi
   la distanza è un numero libero scritto a mano ogni volta.
4. **Nessun documento stampabile**: non esiste un report da allegare a una
   comunicazione all'ente o da mostrare a un vicino che protesta.
5. **Nessun registro dei reclami/esposti** dei residenti.
6. **Le scadenze non si rigenerano**: eseguito un adempimento periodico
   (semestrale, annuale) sparisce e va riscritto a mano.
7. **La soglia è un numero solo**: per le vibrazioni il limite dipende dalla
   **frequenza**, per il PM10 dal **tipo di media** (giornaliera o annua) e dal
   **numero di superamenti annui consentiti**. Un unico numero fisso è una
   semplificazione che in alcuni casi dà il semaforo sbagliato.

### 2b. Cosa dicono le norme italiane (e cosa Sentinella non copre)

**Vibrazioni.** In Italia non esiste una legge con un limite numerico per le
vibrazioni in ambiente di vita: si usano le **norme tecniche UNI**. La
**UNI 9916** è la norma di *metodo* per misurare e valutare gli effetti delle
vibrazioni sugli edifici e richiama la tedesca **DIN 4150-3** per i valori
guida; la **UNI 9614** riguarda invece il *disturbo alle persone* (accelerazioni
pesate, valori diversi giorno/notte). La DIN 4150-3 non dà un numero unico ma
**una curva per bande di frequenza** e per tre categorie di edificio
(industriale, residenziale, sensibile/storico): indicativamente 20–50 mm/s,
5–20 mm/s e 3–10 mm/s salendo con la frequenza.
→ *Manca in Sentinella*: il campo **frequenza dominante** accanto al PPV e la
verifica sulla curva invece che sul singolo numero; manca il riferimento a
UNI 9614 per il disturbo alle persone (che è quasi sempre il motivo vero dei
reclami: la gente sente la casa vibrare molto prima che si crepi l'intonaco).

**Rumore.** L'impianto è la **Legge quadro 447/1995** con il **DPCM 14/11/1997**
che fissa, in base alla **classe acustica** assegnata dal Comune, i valori
limite di **emissione** (tab. B), di **immissione assoluta** (tab. C) e di
**qualità** (tab. D), più il **criterio differenziale** (dentro l'abitazione:
+5 dB di giorno, +3 dB di notte, non applicabile in classe VI). I due periodi di
riferimento (**TR**) sono diurno 06–22 e notturno 22–06; il parametro è il
**LAeq,TR**, con tecniche di campionamento e tempi di osservazione/misura
definiti dal DM 16/03/1998. Le lavorazioni temporanee particolarmente rumorose
possono ottenere una **autorizzazione comunale in deroga** (radice nel
DPCM 1/3/1991, oggi gestita dai regolamenti comunali).
→ *Manca in Sentinella*: la **classe acustica del sito**, la distinzione
**diurno/notturno**, il concetto di **campagna fonometrica** (una misura di
rumore non è un numero, è una relazione di un tecnico competente in acustica),
e un posto dove archiviare le **deroghe** ottenute con il loro periodo di
validità.

**Polveri.** Il riferimento è la qualità dell'aria: direttiva **2008/50/CE**
(recepita dal D.Lgs. 155/2010) con PM10 **50 µg/m³** come media giornaliera da
non superare più di **35 volte l'anno** e **40 µg/m³** come media annua. La
nuova direttiva **(UE) 2024/2881** stringe i valori dal 2030 (PM10 giornaliero
a 45 µg/m³, media annua a 20 µg/m³) e va recepita entro l'11/12/2026.
Attenzione: questi sono limiti di *qualità dell'aria ambiente*, non limiti "di
emissione della cava" — in cava i valori si applicano tramite le prescrizioni
del **piano di monitoraggio ambientale** (VIA/AUA), che spesso prevedono
**deposimetri** (polvere depositata) oltre alle centraline PM10.
Sulla mitigazione le fonti tecniche sono concordi: la **bagnatura delle piste**
è la misura più efficace (una bagnatura giornaliera dell'ordine di 0,3 l/m²
riduce il risollevamento di oltre il 60%), insieme al **limite di velocità
sulle piste** (tipicamente 20–25 km/h), barriere/dune, pulizia ruote e teloni.
→ *Manca in Sentinella*: la media mobile e il **conteggio dei superamenti
annui**, la distinzione fra PM10 e polveri sedimentabili, e soprattutto un
**registro delle azioni di mitigazione** ("oggi abbiamo bagnato le piste"), che
è esattamente la prova che serve quando arriva un reclamo.

**Acque.** Le **acque meteoriche di dilavamento** e di **prima pioggia** sono
regolate dall'**art. 113 del D.Lgs. 152/2006** e demandate in gran parte alle
**Regioni**: se l'acqua è venuta a contatto con sostanze legate all'attività
non è più "meteorica" ma **scarico industriale**, con autorizzazione e limiti.
I limiti generali di scarico in acque superficiali sono nella **Tabella 3,
Allegato 5, Parte Terza** (per esempio: pH 5,5–9,5; solidi sospesi totali
≤ 80 mg/l in acque superficiali, ≤ 200 mg/l in fognatura). Molti di questi
titoli confluiscono nella **AUA** (DPR 59/2013), che dura **15 anni** e va
rinnovata **almeno 6 mesi prima** della scadenza.
→ *Manca in Sentinella*: un **fascicolo campionamenti acque** con più parametri
per prelievo (pH, SST, torbidità…) e il confronto con i limiti configurabili;
e la **regola del rinnovo AUA a −6 mesi**, che oggi va scritta a mano.

**Esplosivi e volate.** L'uso di esplosivo in cava è disciplinato da
**DPR 128/1959** e **D.Lgs. 624/1996** (polizia mineraria): registri e ordini di
servizio sono obbligatori, ma **non fissano una soglia numerica di vibrazione**.
Il limite lo impone l'autorizzazione locale.
→ *Conferma*: le soglie in Sentinella devono restare **parametriche**, mai
presentate come "limite di legge italiano".

### 2c. Cosa fanno i software concorrenti (e noi no)
Guardando le piattaforme di monitoraggio ambientale per cave/cantieri
(Envirosuite, SiteHive, Soft dB, Sixense, ecc.), le funzioni ricorrenti sono:
- **cruscotto unico** che mette insieme rumore, vibrazioni e polveri;
- **serie storiche** con soglie disegnate sopra e confronto fra punti;
- **allarmi automatici** quando il valore si avvicina o supera il limite;
- **correlazione con il meteo** (vento, direzione) per dimostrare se la polvere
  veniva davvero dal sito;
- **gestione dei reclami** con la ricostruzione di cosa stava succedendo a
  quell'ora;
- **report per l'ente e per i vicini**, con dimostrazione di conformità.
Di queste sei, oggi Sentinella ha (parzialmente) solo la prima. Le altre cinque
sono tutte fattibili **senza hardware**, se i dati entrano via CSV o a mano —
e infatti sono le proposte del punto 4.

### 2d. Da dove arrivano i dati (senza spendere niente)
Gli strumenti tipici di cava sono i **sismografi da volata** (famiglia Instantel
Minimate/Blastmate col software Blastware, e concorrenti equivalenti), le
**centraline polveri** e i **fonometri**. Tutti producono, per ogni evento, le
stesse quattro-cinque informazioni: data/ora, PPV per le tre componenti
(longitudinale, trasversale, verticale), frequenza dominante associata,
sovrappressione d'aria in dB, più eventuale nota. Le buone pratiche di settore
(ISEE, *Field Practice Guidelines for Blasting Seismographs*) descrivono proprio
questo contenuto minimo.
**Conseguenza pratica per noi**: non serve nessuna integrazione a pagamento.
Serve che Sentinella accetti un **CSV generico e tollerante**, in cui l'utente
dica quale colonna è la data, quale il valore e quale l'unità. Il costo di
questa scelta è zero e funziona con qualunque marca.

---

## 3. Il PONTE con Genesi

**Genesi ha già i calcoli, Sentinella non deve rifarli.** In `apps/genesi/genesi.html`
esistono: legge di attenuazione **PPV = K·SD^−β** (Devine) con K e β stimati
dalla litologia, la **MIC** (carica massima entro la finestra di 8 ms), il
**limite PPV** scelto per normativa/edificio (DIN residenziale, industriale,
sensibile; USBM intonaco/cartongesso) e frequenza, la stima **airblast** in dB,
il modulo **signature-hole** (somma ritardata di un'onda reale importata) e la
**riconciliazione previsto-vs-reale** (dove il fochino inserisce X50, PPV e
flyrock misurati dopo lo sparo, con storico locale ed export CSV).

Quindi il ponte **non è "portare le formule in Sentinella"**: è portare i
**risultati** e chiudere il cerchio.

### Come dovrebbe funzionare, in parole semplici
1. **In Genesi**, finita la progettazione della volata, si preme un pulsante
   tipo "Manda a Sentinella" (esiste già il precedente del *piano di carico CSV*
   verso Campo, riga 2698 di `genesi.html`: stessa tecnica, nessuna novità
   tecnologica).
2. Il file (CSV o JSON) contiene poche cose, tutte già calcolate da Genesi:
   data prevista, fronte, n° fori, kg totali, **MIC (kg max per ritardo)**,
   distanza del ricettore, **SD**, **PPV previsto**, **limite scelto e nome
   della norma**, **airblast previsto**, e un **codice volata** univoco.
3. **In Sentinella** quel file diventa una riga del registro volate con le
   colonne "previsto" già piene. La volata nasce nello stato **"prevista"**.
4. Dopo lo sparo, chi ha il sismografo importa (o digita) i valori **misurati**:
   PPV reale, frequenza, airblast. La riga passa a **"misurata"** e Sentinella
   calcola lo **scarto previsto → misurato** e l'**esito rispetto al limite**.
5. Il registro accumula le coppie previsto/misurato. Con una decina di volate si
   può mostrare un grafico **SD vs PPV misurato**: è la **taratura del sito**,
   cioè i valori di K e β veri di quella cava. Quel risultato **torna indietro a
   Genesi** (import nella riconciliazione già esistente) e da lì in poi le
   previsioni di Genesi non sono più di letteratura, ma **della cava del
   cliente**. Questo è il pezzo che nessuna delle due app può fare da sola ed è
   il vero argomento di vendita dell'ecosistema.
6. Se arriva un **reclamo**, la riga di volata porta con sé tutto: previsione,
   misura, limite citato, distanza dal ricettore. È la risposta pronta all'ente.

### Regole di onestà del ponte (da non violare)
- Ogni numero deve dire **da dove viene**: `PREVISTO (Genesi)` oppure
  `MISURATO (strumento X)` oppure `INSERITO A MANO`. Mai mescolarli in una
  colonna sola.
- Se manca la **frequenza misurata**, il confronto usa il ramo **più
  cautelativo** della curva, con avviso scritto. È il comportamento corretto in
  assenza di misura.
- Il ponte deve funzionare anche **senza Genesi** (import CSV manuale), perché
  un cliente può comprare solo Sentinella.
- Il passaggio dei dati fra le due app deve restare dentro **l'organizzazione**
  (orgCollection dello SDK): mai un canale che possa far viaggiare dati fra
  aziende diverse, che qui sono concorrenti.

---

## 4. Tabella delle proposte

Difficoltà: **S** = poche ore · **M** = un'unità di lavoro piena · **L** = più unità.
Priorità: **1** = farei subito · **2** = subito dopo · **3** = quando c'è tempo.

| # | Nome | Cosa fa | Perché serve | Diff. | Pri. |
|---|------|---------|--------------|-------|------|
| 1 | **Serie storica con grafico** | Per ogni punto di misura, una linea nel tempo con la soglia disegnata sopra e i superamenti evidenziati. SVG puro, niente librerie. | È il buco più visibile: lo storico c'è già nei dati ma non si vede. Senza andamento, l'app non racconta niente. | M | 1 |
| 2 | **Import CSV delle letture** | Carica un file `data;ora;valore` (colonne scelte dall'utente) e riempie lo storico di un punto. Tollerante su separatore e virgola decimale. | È l'unico modo realistico di far entrare i dati veri di sismografi, centraline e fonometri senza integrazioni a pagamento. | M | 1 |
| 3 | **Anagrafica ricettori** | Elenco dei punti sensibili (case, scuola, confine) con distanza, tipo di edificio, classe acustica, soglia associata e nota. Volate e misure si agganciano al ricettore. | Oggi la distanza si riscrive a mano ogni volta. Le norme ragionano per ricettore, non per cava. Sblocca report e reclami. | M | 1 |
| 4 | **Ponte Genesi → Sentinella** | Import del file volata di Genesi: previsto già compilato (MIC, SD, PPV previsto, limite, norma), poi inserimento dei valori misurati e calcolo dello scarto. | È il ciclo chiuso dell'ecosistema (task B4 della roadmap) e l'argomento di vendita più forte. | M | 1 |
| 5 | **Report di conformità stampabile** | Documento A4 (stampa del browser → PDF) per volata o per periodo: eventi, distanze, cariche, previsto/misurato, limite citato, esito, disclaimer. | È l'unica cosa che il cliente consegna davvero all'ente o mostra al vicino. Alto valore commerciale, costo tecnico basso. | M | 1 |
| 6 | **Registro reclami/esposti** | Data, ora, chi ha reclamato, tipo (rumore/polvere/vibrazione), collegamento all'evento di quel giorno, azione fatta, esito. | Il reclamo è il momento in cui l'azienda rischia. Avere la risposta documentata in 30 secondi è ciò che vendono i concorrenti. | M | 1 |
| 7 | **Limite per frequenza (curva)** | Il punto vibrazioni accetta anche la frequenza dominante; il limite si legge sulla curva DIN 4150-3 / USBM invece che da un numero fisso. Frequenza mancante → ramo più cautelativo, con avviso. | Un unico numero può dare semaforo verde quando la norma direbbe rosso (o viceversa). È correttezza tecnica. **Valori da confermare.** | M | 2 |
| 8 | **Regole di allarme** | Oltre al superamento singolo: "3 superamenti in 30 giorni", "media mobile 7 giorni", "n° superamenti PM10 nell'anno" con contatore. | Il rischio vero non è il picco isolato ma la ripetizione. È il task C3 della roadmap. | M | 2 |
| 9 | **Scadenze ricorrenti** | L'adempimento porta una periodicità (semestrale, annuale, AUA 15 anni con avviso a −6 mesi); quando lo segni fatto, la prossima si crea da sola con la data giusta. | Oggi ogni scadenza periodica va riscritta a mano: si dimentica, e dimenticare una scadenza ambientale costa. | S | 2 |
| 10 | **Fascicolo campionamenti acque** | Un prelievo = più parametri (pH, SST, torbidità…) con limite per parametro, punto di scarico, laboratorio, data del referto. | Oggi le acque sono un solo numero. Un prelievo reale ha sempre più parametri e un referto da allegare. | M | 2 |
| 11 | **Registro azioni di mitigazione** | Log rapido: bagnatura piste, pulizia ruote, limitazione velocità, chi e quando. Compare nel report accanto ai valori. | È la prova di "diligenza" che difende l'azienda davanti a un reclamo o a un controllo ARPA. Costa poco e vale molto. | S | 2 |
| 12 | **Meteo dell'evento** | Campi manuali vento (velocità/direzione), pioggia, temperatura sulla lettura o sulla volata. | Con vento contrario la polvere non veniva dalla cava: senza questo dato non lo puoi dimostrare. I concorrenti lo fanno con sensori, noi a mano. | S | 3 |
| 13 | **Scheda "Le mie soglie"** | Pagina che elenca ogni soglia in uso con: valore, fonte, chi l'ha confermata, data. Avviso fisso "verificare sull'autorizzazione". | Protegge noi e il cliente. Nessuna soglia deve sembrare "legge" quando non lo è. | S | 2 |
| 14 | **Deroghe rumore** | Archivio delle autorizzazioni comunali in deroga per attività temporanee: atto, periodo, limiti concessi, orari. Avviso alla scadenza. | Chi lavora in deroga deve saper dire quando scade. Oggi non c'è posto dove metterlo. | S | 3 |
| 15 | **Taratura del sito (K e β)** | Dai dati previsto/misurato accumulati, regressione su SD vs PPV per stimare K e β della cava; export verso la riconciliazione di Genesi. | Trasforma il registro in un patrimonio: le previsioni di Genesi diventano quelle di quella cava. Serve però un numero minimo di misure vere. | L | 3 |

**Nota di prudenza sulle taglie.** Le proposte 1, 2, 3, 4, 5, 6 sono quelle che
cambiano davvero la percezione dell'app. Le altre sono utili ma non
sostituiscono queste sei. Non ho inserito niente che richieda hardware,
abbonamenti o API a pagamento.

---

## 5. Fonti

**Vibrazioni**
- UNI 9916 — criteri di misura e valutazione degli effetti delle vibrazioni sugli edifici: https://ediliziainrete.it/norme/uni-9916 · scheda tecnica: http://geo-tec.it/wp-content/uploads/2015/02/Norme-UNI-9916-04-Criteri-di-misura-e-valutazione-degli-effetti-delle-vibrazioni-sugli-edifici.pdf
- Rapporto UNI 9916 ↔ DIN 4150-3 e assenza di legge italiana: https://www.vielleacustica.it/cms/rilievo-vibrazioni-cosa-dice-la-legge/ · https://www.portaleagentifisici.it/faq_viewer_hav.php?id=182
- DIN 4150-3, valori guida per categoria di edificio e banda di frequenza: https://micromega-dynamics.com/din-4150-3-vibration-limits-buildings/ · https://profound.nl/din-4150-3-explained-what-do-the-limit-values-mean-in-practice/
- UNI 9614 — disturbo alle persone (accelerazioni pesate, giorno/notte): https://www.acusticatecnica.it/vibrazioni-uni-9614-uni-9916/ · https://www.rumoreevibrazioni.it/it/blog/vibrazioni-ferroviarie-analisi-e-mitigazione-secondo-la-norma-uni-9614
- Approfondimento ministeriale "Vibrazioni" (VIA): https://va.mite.gov.it/File/Documento/743447
- USBM RI 8507 / limiti frequency-based e airblast 133 dB: https://explosives.org/vibration-basics/limits/ · https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/2011WVDEP%20%20Airblast%20Research%20Final.pdf

**Rumore**
- Legge quadro 447/1995: https://www.acustica.it/documenti/legge%20447.pdf
- DPCM 14/11/1997 — valori limite di emissione, immissione, qualità (tabelle A–D): https://www.anit.it/wp-content/uploads/2015/02/DPCM_14_11_19971.pdf · https://www.anit.it/norma/d-p-c-m-14-11-1997-determinazione-dei-valori-limite-delle-sorgenti-sonore/
- Quadro normativo rumore (ARPA Lombardia): https://www.arpalombardia.it/temi-ambientali/rumore-e-vibrazioni/la-normativa-sul-rumore/
- DPCM 1/3/1991 e deroghe per attività temporanee rumorose: https://www.mase.gov.it/portale/documents/d/guest/dpcm_01_03_91-pdf-1 · https://www.comune.como.it/it/servizi/ambiente-e-verde/rumore/autorizzazione-in-deroga-ai-limiti-esposizione-del-rumore/
- Tempi di riferimento/osservazione/misura e criterio differenziale (linee guida ARPA FVG): https://www.arpa.fvg.it/documents/747/LINEE-GUIDA-DOCUMENTAZIONE-SU-IMPATTO-ACUSTICO_QrSIkPW.pdf
- Esposti dei cittadini per rumore (ARPA Piemonte / Veneto / Lombardia): https://www.arpa.piemonte.it/scheda-informativa/gestione-esposti-segnalazioni · https://www.arpa.veneto.it/temi-ambientali/rumore/esposti-dei-cittadini-per-rumore · https://www.arpalombardia.it/agenda/notizie/2012/il-controllo-del-rumore/

**Polveri**
- Direttiva (UE) 2024/2881 — nuovi valori 2030: https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=OJ:L_202402881 · sintesi: https://temi.camera.it/leg19/post/la-direttiva-2024-2881.html · https://www.arpa.sicilia.it/approvata-direttiva-ue-su-qualita-dellaria-ambiente-standard-piu-rigorosi-per-gli-inquinanti-da-raggiungere-entro-il-2030/
- Deposimetri e misura della polverosità (SNPA/ARPA FVG): https://www.snpambiente.it/snpa/arpa-fvg/lefficacia-dei-deposimetri-nella-misura-della-polverosita/
- Mitigazione (bagnatura piste, velocità sulle piste) in documenti di cava: https://allegatiatti.comune.lucca.it/Anno%202017/pr_cave_balbano/Integrazione_del_16.08.18/RT-AD0465.AC.AMB-signed.pdf · https://va.mite.gov.it/File/Documento/948264

**Acque**
- Art. 113 D.Lgs. 152/2006 — acque meteoriche di dilavamento e di prima pioggia: https://www.brocardi.it/codice-dell-ambiente/parte-terza/sezione-ii/titolo-iii/capo-iv/art113.html · guida: https://certifico.com/ambiente/documenti-ambiente/documenti-ambiente-enti/guida-acque-meteoriche-di-dilavamento-e-di-prima-pioggia
- Tabella 3, Allegato 5, Parte Terza (pH 5,5–9,5; SST ≤ 80 mg/l in acque superficiali): https://www.ecosurvey.it/wp-content/uploads/2018/02/VALORI-LIMITI-DI-EMISSIONE-IN-ACQUE-SUPERFICIALI-E-IN-FOGNATURA.pdf · https://va.mite.gov.it/File/Documento/3546
- AUA — DPR 59/2013, durata 15 anni, rinnovo a −6 mesi: https://www.bosettiegatti.eu/info/norme/statali/2013_0059.htm · https://ambiente.regione.emilia-romagna.it/it/valutazioni-ambientali-e-autorizzazioni/autorizzazioni/autorizzazione-unica-ambientale

**Cave, esplosivi, piani di monitoraggio**
- DPR 128/1959 (polizia mineraria): https://www.gazzettaufficiale.it/eli/id/1959/04/11/059U0128/sg
- D.Lgs. 624/1996: https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm · linee guida regionali: https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137
- Vademecum adempimenti sicurezza attività estrattive: https://enbital.it/docs_upload/VADEMECUM-ADEMPIMENTI-SICUREZZA-ATTIVITA-ESTRATTIVE-Dic-2022_20230228170416.pdf
- Piani di monitoraggio ambientale (ARPA Lombardia / ISPRA): https://www.arpalombardia.it/per-enti-e-imprese/piani-di-monitoraggio-ambientale-pma/ · https://www.isprambiente.gov.it/files2026/notizie/parte_i_cap1-6_bozza.pdf

**Strumentazione e software di settore**
- ISEE — Field Practice Guidelines for Blasting Seismographs (2020): https://isee.org/docs/default-source/isee-digital-downloads/isee-field-practice-guidelines-for-blasting-seismographs-2020.pdf
- ISEE — Performance Specifications for Blasting Seismographs (2022): https://isee.org/docs/default-source/isee-digital-downloads/2022-isee-performance-specifications-for-blasting-seismographs.pdf
- Instantel Blastware (manuale, gestione eventi e report): https://www.geo-instruments.com/wp-content/uploads/blastware-manual.pdf · https://www.instantel.com/blastware-faqs
- Funzioni tipiche dei software di monitoraggio ambientale per cave: https://envirosuite.com/ · https://sitehive.com/industries/quarries-mines · https://www.softdb.com/monitoring/ · https://www.sixense-group.co.uk/services/instrumentation-and-monitoring/environmental-monitoring-noise-vibration-dust · https://www.agg-net.com/resources/articles/environment-restoration/boundary-monitoring-at-quarries

---

### Promemoria finale
1. **Nessuna soglia entra nell'app senza la tua conferma**, e resta comunque
   modificabile dal cliente.
2. **Sentinella non misura**: registra, confronta e documenta. Ogni valore deve
   dire se è previsto, misurato da strumento altrui, o inserito a mano.
3. Documento di ricerca: **non modifica codice**. Le proposte vanno scelte da te
   prima di essere implementate.
