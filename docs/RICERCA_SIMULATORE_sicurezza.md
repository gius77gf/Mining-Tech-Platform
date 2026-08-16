# Ricerca — Parametri reali per un simulatore di cava sintetica: **sicurezza**

Ricerca svolta il **16/08/2026**. Argomento: con quale frequenza accadono gli eventi
di sicurezza in una cava italiana, e quali adempimenti scandiscono l'anno.

⛔ **Questo documento parla SOLO del mondo.** Non ho aperto il codice del prodotto e
non dichiaro nessuna mancanza: il confronto con le nostre app lo fa chi ha il codice
in mano. È la regola nata dopo che quattro ricerche di fila hanno dichiarato mancanze
**false** cercando parole inglesi dentro un prodotto scritto in italiano.

## Come leggere le marcature — ⚠️ leggere prima dei numeri

Lo strumento a disposizione (`WebSearch`) dice **che cosa esiste**; non può aprire il
**testo primario** di una norma o di una pubblicazione. Quindi **nessun numero qui
dentro è stato letto sulla fonte**. Ogni riga porta una di queste marcature:

| Marca | Significato |
|---|---|
| `[RS]` | **Da risultati di ricerca, non verificato sulla fonte.** Il numero l'ho letto in un estratto di un sito che cita la norma o la pubblicazione INAIL, non nella norma o nella pubblicazione. |
| `[RS×2]` | Come sopra, ma **due fonti indipendenti** dicono la stessa cosa. Più affidabile, non verificato. |
| `[CALC]` | **Calcolato da me** a partire da numeri `[RS]`. Il calcolo è scritto accanto, così si può rifare o smentire. |
| `[DED]` | **Dedotto**, cioè nessuna fonte lo dice: è un ragionamento mio. Il più fragile. |
| `[CONTRADDITTORIO]` | Ho trovato **due numeri diversi** per la stessa cosa. Sono scritti tutti e due; non ho modo di decidere. |

⚠️ **Un articolo di legge o una tariffa riportati di seconda mano e scritti in una
schermata sono peggio di un dato assente**: questo software lo apre chi deve
rispondere a un ispettore. Prima che un numero di questo documento finisca in un
testo che l'utente legge, va **letto sulla fonte primaria**.

---

## A. I denominatori: quanto è grande il settore

Servono per trasformare i dati nazionali in «quante volte all'anno succede a *questa*
azienda». Sono la parte più incerta del documento.

| Grandezza | Valore | Fonte | Marca |
|---|---|---|---|
| Cave attive in Italia | **~5.000** (dismesse ~13.500) | Quarry & Construction, analisi del settore estrattivo | `[RS]` |
| Cave in Italia (altra stima) | **3.580 al 2018**, di cui **2.094 produttive** | citato in più articoli dai dati INAIL/ISTAT | `[RS]` |
| Addetti nelle cave | **25.000–30.000** | Quarry & Construction | `[RS]` |
| Addetti-anno → ore lavorate | **~1.650 h/addetto-anno** | convenzione, non una fonte | `[DED]` |

⚠️ `[CONTRADDITTORIO]` **5.000 contro 3.580 cave**: quasi certamente due perimetri
diversi (autorizzate contro produttive, oppure cave+torbiere contro sole cave), ma
non posso dimostrarlo. Chi userà il denominatore scelga e **dichiari quale**.

**Dimensione tipica d'impresa** — `[DED]`: 25.000–30.000 addetti su 2.000–5.000 siti
produttivi dà **6–14 addetti per sito**. La fascia 10–30 persone che interessa al
simulatore è quindi la parte **medio-alta** del settore, non la media. Non ho trovato
una distribuzione dimensionale delle imprese estrattive: è nella lista finale.

---

## B. Infortuni — tabella dei parametri per il simulatore

### B.1 I dati di partenza (INAIL, quinquennio 2015–2019, divisione ATECO B 08)

Tutti dal *Bollettino statistico INAIL n. 11/2020*, letto **attraverso** articoli che
lo citano (Quarry & Construction, Punto Sicuro, Studio Essepi).

| Dato | Valore | Marca |
|---|---|---|
| Denunce in **B 08** (altra estrazione di minerali da cave e miniere), 5 anni | **2.309** | `[RS]` |
| di cui **B 081** (pietra, sabbia, argilla) | **2.008** (≈87%) | `[RS]` |
| di cui **B 089** (altri minerali) | **286** (≈13%) | `[RS]` |
| dentro B 081: estrazione di **pietra** | **971** | `[RS]` |
| dentro B 081: **ghiaia, sabbia, argille, caolino** | **976** | `[RS]` |
| **Morti** in B 08, 5 anni | **26** | `[RS]` |
| di cui in B 081 | **22** (15 in B 0811, 5 in B 0812) | `[RS]` |
| Denunce **riconosciute** in B 081 | **88%** (1.777 su 2.008) — contro **66,3%** dell'insieme Industria e Servizi | `[RS]` |
| **Inabilità permanente** sugli indennizzi, B 081 | **14,9%** — contro **13,3%** delle Costruzioni | `[RS]` |

⚠️ **Tre somme non tornano**, e lo scrivo invece di aggiustarle: 2.008 + 286 = 2.294 e
non 2.309; 971 + 976 = 1.947 e non 2.008; 15 + 5 = 20 e non 22. Le differenze sono
piccole (15, 61, 2) e sono compatibili con sottoclassi non citate negli estratti che
ho letto — ma **non l'ho verificato**, e un simulatore che si basa su queste cifre
deve saperlo.

⚠️ `[CONTRADDITTORIO]` Una fonte diversa riporta per il **2019** «infortuni accertati
nelle cave: **2.246**, di cui 2.122 in occasione di lavoro e 124 in itinere». È **un
anno solo** e vale quasi quanto **tutto il quinquennio** B 08: i due numeri non
possono riferirsi allo stesso perimetro (il 2.246 probabilmente copre l'intera
sezione B, petrolio e gas compresi, o un'aggregazione più larga). **Non usare il
2.246 con il denominatore delle cave.**

### B.2 I parametri derivati — per un'azienda di 10–30 persone

Base di calcolo: **B 081**, 2.008 denunce in 5 anni = **~402 denunce/anno**; addetti
presi a **27.500** (media della forbice 25.000–30.000). Tutti `[CALC]`, e il calcolo
è scritto perché si possa smentire.

| Parametro | Valore | Come l'ho ricavato | Marca |
|---|---|---|---|
| Denunce di infortunio, tasso | **~14,6 ‰ addetti-anno** | 402 / 27.500 × 1.000 | `[CALC]` |
| Infortuni **indennizzati**, tasso | **~12,9 ‰ addetti-anno** | 14,6 × 0,88 (tasso di riconoscimento) | `[CALC]` |
| **LTIFR** (per 1.000.000 h) | **~8,8** | 14,6 / 1,65 (1.000 addetti-anno = 1,65 Mh) | `[CALC]` |
| Tasso per **200.000 h** (convenzione USA/MSHA) | **~1,77** | 14,6 × (200.000 / 1.650.000) | `[CALC]` |
| **Infortuni/anno in un'azienda da 20 persone** | **~0,29** → **circa 1 ogni 3–4 anni** | 20 × 14,6 ‰ | `[CALC]` |
| Idem, azienda da **10** | **~0,15/anno** → 1 ogni ~7 anni | 10 × 14,6 ‰ | `[CALC]` |
| Idem, azienda da **30** | **~0,44/anno** → 1 ogni ~2,3 anni | 30 × 14,6 ‰ | `[CALC]` |
| **Quota di infortuni con postumi permanenti** | **~15%** | dato B 081 diretto | `[RS]` |

✅ **Un controllo che regge**: il tasso per 200.000 h calcolato qui (**1,75**) coincide
quasi alla cifra con l'*all-injury rate* dichiarato dal **MSHA** per l'intero settore
minerario statunitense nel 2025 (**1,74 per 200.000 h**) `[RS]`. Due sistemi
statistici indipendenti e due paesi diversi: la convergenza non prova che il numero
sia giusto, ma dice che **non è assurdo**.

### B.3 Eventi mortali

| Parametro | Valore | Fonte / calcolo | Marca |
|---|---|---|---|
| Indice di frequenza **per morte**, estrazione di minerali | **0,21 ‰** addetti (contro 0,14 ‰ delle Costruzioni e 0,06 ‰ della media Industria e Servizi) | INAIL, via articoli | `[RS]` |
| Morti calcolate da B 08 | **~0,19 ‰** | 26 / 5 anni / 27.500 × 1.000 | `[CALC]` |
| Morti in un'azienda da 20 persone | **~0,004/anno** → **1 evento ogni ~250 anni-azienda** | 20 × 0,2 ‰ | `[CALC]` |

✅ Il `[RS]` (0,21) e il `[CALC]` (0,19) **convergono**, e sono ricavati da due strade
diverse: è la coppia di numeri più solida di tutto il documento.

⚠️ `[CONTRADDITTORIO]` Una fonte riferita al **2023** dà per «estrazione di minerali
da cave e miniere» un tasso di **0,04 morti accertate per mille esposti**, cioè
**cinque volte più basso**. Le spiegazioni possibili sono almeno tre (anno diverso,
«accertate» invece di «denunciate», perimetro diverso) e **non so quale sia**. Chi
mette una mortalità in un simulatore usi **0,2 ‰** con la forbice **0,04–0,21**
dichiarata, non uno dei due estremi da solo.

### B.4 Dinamiche infortunistiche — che cosa succede davvero

Fonti: INAIL, *Illustrazione delle dinamiche infortunistiche in cava. Dall'analisi
alla prevenzione* (aprile 2023, Consulenza tecnica salute e sicurezza — analizza
**19 infortuni** nel comparto delle cave di **Massa Carrara**) e INAIL, *Analisi
della sicurezza nel settore estrattivo in cave a cielo aperto* (2021, con Anepla,
Assomarmomacchine, ISTAT).

Famiglie di rischio citate dalle fonti `[RS]`, **in ordine non gerarchico** — nessuna
delle fonti che ho potuto leggere dà le **percentuali** per dinamica:

- **macchine di movimento terra** — incidenti in manovra, investimento, interferenza
  uomo/mezzo;
- **ribaltamento del mezzo** — indicato come *«una delle cause più frequenti degli
  infortuni mortali nei luoghi di lavoro»* `[RS]`, con una scheda INAIL dedicata;
- **taglio e ribaltamento delle bancate** — la manovra tipica del lapideo, trattata a
  parte dalle fonti;
- **stabilità dei fronti di scavo** — caduta di massi/materiale dall'alto;
- **cadute dall'alto** nel lavoro in quota;
- **rischio da esplosivo** (volate);
- **rischio elettrico** in cava a cielo aperto.

⚠️ **La distribuzione per dinamica non l'ho trovata in forma numerica** (vedi sezione
finale). Il campione dei 19 casi di Massa Carrara è **locale e piccolo**: usarlo come
distribuzione di probabilità sarebbe un errore.

---

## C. Near-miss (mancati infortuni)

### C.1 La piramide: che cosa dice, e perché non va usata come moltiplicatore

| Modello | Rapporto | Marca |
|---|---|---|
| **Heinrich** (1931) | **1 : 29 : 300** — 1 infortunio grave, 29 lievi, 300 mancati infortuni. Da un'analisi dichiarata su 500.000 (o 550.000, le fonti divergono) casi industriali USA | `[RS×2]` |
| **Bird** (anni '60) | aggiunge un quarto livello, separando l'evento mortale da quello con conseguenze gravi con perdita di ore | `[RS]` |
| **ConocoPhillips** (2003) | aggiunge alla base i **comportamenti a rischio** | `[RS]` |
| Forma «moderna» citata da divulgatori | **1 : 30 : 300 : 3.000 : 300.000** | `[RS]` |

⛔ **La critica moderna è forte e va riportata insieme al modello, non dopo.** Il
punto non è che i rapporti siano imprecisi: è che **la relazione causale non regge**.
Sintesi delle fonti `[RS]`, principalmente **Fred Manuele** e uno studio su oltre
**25.000 stabilimenti** (PMC/NIH):

- gli eventi **mortali e gravi** accadono spesso **senza nessun preavviso** ricavabile
  dall'analisi degli eventi minori;
- storicamente gli infortuni non mortali **calavano** mentre i mortali **no**: se la
  piramide fosse causale, sarebbero dovuti calare insieme;
- solo circa il **20%** degli eventi della piramide ha il potenziale di diventare
  grave o mortale, e ha **cause diverse** dall'altro 80% `[RS]`;
- la **metodologia** con cui Heinrich costruì il triangolo non è ricostruibile.

➡️ **Conseguenza per un simulatore**: la piramide si può usare per generare **volumi
plausibili** di segnalazioni, **non** per far discendere il numero di infortuni gravi
dal numero di near-miss. Sono due processi che vanno generati **separatamente**.

### C.2 Che rapporto usano davvero i sistemi di segnalazione

| Indicatore | Valore | Marca |
|---|---|---|
| Rapporto near-miss / infortunio registrabile considerato «sano» | **> 10:1**, con **20:1** come obiettivo minimo raccomandato | `[RS]` |
| Forbice tipica dichiarata dai fornitori di sistemi QHSE | **30 – 300** near-miss per infortunio registrabile | `[RS]` |
| Sotto-segnalazione stimata dei sistemi esistenti | **~90%** | `[RS]` |
| Partecipazione in un programma maturo | **50–70%** dei dipendenti fa **almeno una** segnalazione all'anno | `[RS]` |
| Alte prestazioni | **> 200 near-miss per milione di ore lavorate** | `[RS]` |
| Unità di misura usata nel settore minerario | near-miss segnalati **per 100 dipendenti al mese** | `[RS]` |

**Parametri derivati per un'azienda da 20 persone** (33.000 h/anno = 20 × 1.650):

| Scenario | Near-miss/anno | Calcolo | Marca |
|---|---|---|---|
| Programma **maturo** (200/Mh) | **~6,6** | 33.000 / 1.000.000 × 200 | `[CALC]` |
| Rapporto **20:1** sugli infortuni | **~5,8** | 0,29 infortuni/anno × 20 | `[CALC]` |
| Rapporto **30:1** | **~8,7** | 0,29 × 30 | `[CALC]` |
| Programma **appena avviato** (sotto-segnalazione 90%) | **< 1** | 6,6 × 0,1 | `[CALC]` |

✅ Le due strade indipendenti (per ore lavorate e per rapporto sugli infortuni)
danno **6,6** e **5,8**: convergono. **Da 5 a 9 segnalazioni all'anno** è la fascia
plausibile per una cava da 20 persone con un programma che funziona; **meno di 2**
non vuol dire cava sicura, vuol dire **sistema che non raccoglie**.

### C.3 L'obbligo italiano, nuovissimo

- **D.L. 31 ottobre 2025 n. 159, art. 15**, convertito dalla **L. 29 dicembre 2025
  n. 198** `[RS×2]`.
- Obbligo per le aziende con **più di 15 dipendenti** di **comunicare i dati
  aggregati** degli eventi segnalati come mancati infortuni **e le azioni correttive
  o preventive** intraprese `[RS×2]`.
- Definizione riportata: *«qualunque evento di lavoro che avrebbe potuto causare un
  infortunio o un danno alla salute, indipendentemente dalla gravità, ma che per
  cause fortuite non lo ha prodotto»* `[RS]`.
- **Linee guida** del Ministero del Lavoro e dell'INAIL attese **entro il 30 aprile
  2026** `[RS]`; una fonte cita anche la norma tecnica **UNI 7249** come riferimento.
- L'obbligo è descritto come operativo **dal 2026** `[RS]`.

⚠️ **Questa è la riga più delicata del documento.** È una norma di pochi mesi fa, la
conosco **solo** attraverso studi legali e consulenti che la commentano, e le linee
guida attuative avevano scadenza **aprile 2026** — cioè potrebbero essere uscite e io
non le ho lette. **Prima di scrivere in un prodotto che cosa l'azienda deve
comunicare e in che forma, il testo della L. 198/2025 e le linee guida vanno letti.**

---

## D. Il calendario dell'anno: la norma e la prassi

Colonna **norma** = che cosa impone il testo (come me lo riferiscono le fonti).
Colonna **prassi** = che cosa fanno davvero le aziende, dove le fonti lo dicono.
Dove la prassi è vuota o marcata `[DED]`, **non l'ho trovata**.

### D.1 Sorveglianza sanitaria

| Adempimento | Norma | Prassi | Marca |
|---|---|---|---|
| Visita periodica generale | **Di norma una volta l'anno**, salvo diversa periodicità stabilita dal **medico competente** con motivazione, o dall'organo di vigilanza con provvedimento motivato (art. 41) | Il medico competente **allunga** spesso a 24 mesi le mansioni a rischio basso; la periodicità reale è scritta nel **protocollo sanitario**, non nella legge | `[RS]` / prassi `[DED]` |
| **Rumore** (art. 196) | Obbligatoria sopra il **valore superiore di azione LEX,8h = 85 dB(A)**; estesa su richiesta o su parere del medico sopra il **valore inferiore, 80 dB(A)**. Periodicità: **di norma annuale**, o diversa con motivazione nel DVR e comunicazione all'RLS | — | `[RS×2]` |
| **Vibrazioni** (art. 204) | Obbligatoria sopra i valori d'azione: **mano-braccio 2,5 m/s²**, **corpo intero 0,5 m/s²**. Periodicità: **di norma annuale**, o diversa motivata | Il **corpo intero** è il caso tipico del conduttore di mezzi in cava | `[RS×2]` / il commento è `[DED]` |
| **Silice cristallina respirabile** | **Cancerogeno** dal **D.Lgs 44/2020** (in vigore **24 giugno 2020**): inserita nell'**allegato XLII** («lavori comportanti esposizione a polvere di silice cristallina respirabile generata da un procedimento di lavorazione»), valore limite **0,1 mg/m³** in frazione respirabile nell'allegato XLIII | Fa scattare **tutto il capo II del titolo IX**: valutazione specifica, sorveglianza sanitaria, **registro degli esposti** | `[RS×2]` |
| **Registro degli esposti** a cancerogeni (art. 243) | **Aggiornamento triennale**, salvo modifiche sostanziali del processo produttivo; copia all'organo di vigilanza e all'istituto (ex ISPESL) | — | `[RS]` |
| Sorveglianza **dopo la cessazione** dell'esposizione | Il medico competente segnala la necessità che prosegua **oltre la fine dell'esposizione**, per il tempo ritenuto necessario | — | `[RS]` |

⚠️ La periodicità della visita per gli **esposti a cancerogeni (art. 242)** non l'ho
trovata scritta come numero: le fonti dicono che il medico competente **stabilisce il
programma** secondo protocolli basati su evidenze. È nella lista finale.

⚠️ **Il meccanismo che conta più della periodicità**: in tutti i casi sopra la legge
scrive *«di norma una volta l'anno **o con periodicità diversa** decisa dal medico
competente»*. Cioè la scadenza vera di un lavoratore **non si deriva dalla norma**:
sta nel protocollo sanitario di quell'azienda. Un calendario che assume «12 mesi per
tutti» è sbagliato **per costruzione**, e nella direzione tranquilla.

### D.2 Formazione — l'Accordo Stato-Regioni 2025 ha cambiato quasi tutto

Riferimento: **Accordo Stato-Regioni 17 aprile 2025, Rep. Atti n. 59/CSR**, in
vigore dal **19 maggio 2025** `[RS×2]`, che **abroga e sostituisce** tutti i
precedenti accordi, compreso quello del 21 dicembre 2011 `[RS]`.

⚠️ `[CONTRADDITTORIO]` sulle **date**: una fonte dà l'entrata in vigore al **19 maggio
2025**, un'altra parla di regole che cambiano **dal 24 maggio 2026** (verosimilmente
la fine di un periodo transitorio). **Non so quale regime sia in vigore oggi.** È la
prima cosa da verificare sulla Gazzetta Ufficiale.

| Figura | Corso base | Aggiornamento | Marca |
|---|---|---|---|
| **Lavoratore** | generale + specifica | **quinquennale**, minimo **6 h** — decorrenza dalla **data di fine corso** riportata nell'attestato | `[RS×2]` |
| **Preposto** | **12 h** (erano 8); accesso **solo dopo** la formazione da lavoratore | **biennale** (era quinquennale), **6 h** — base e aggiornamento **solo in presenza o videoconferenza sincrona**, e-learning **vietato** | `[RS×2]` |
| **Dirigente** | **12 h** (erano 16) | **quinquennale**, **6 h** | `[RS]` |
| **Datore di lavoro che fa da RSPP** | — | **quinquennale**, **8 h** unificate (prima **6 / 10 / 14 h** per rischio basso / medio / alto) | `[RS]` |
| **RSPP / ASPP** | modulare | **quinquennale**, monte ore citato **40 h** | `[RS]` ⚠️ non confermato |
| **RLS** | 32 h | **annuale**: **4 h** se l'azienda ha **meno di 50** lavoratori, **8 h** se ne ha **più di 50**; obbligo nelle aziende con **almeno 15** lavoratori | `[RS]` |
| **Addetto primo soccorso** | **16 h** (gruppo A) | **triennale**, **6 h** per il gruppo A (**4 h** per B e C), **solo parte pratica**, docenza sanitaria, **in presenza** | `[RS×2]` |
| **Addetto antincendio** | livelli 1/2/3 | **quinquennale**: **2 h** (liv. 1), **5 h** (liv. 2), **8 h** (liv. 3) — **DM 2 settembre 2021**; prima era solo *consigliato* e triennale | `[RS×2]` |

✅ **Una cava è gruppo A per il primo soccorso, e non dipende dal numero di
dipendenti**: le fonti riportano che il gruppo A del **DM 388/2003** comprende
espressamente *«aziende estrattive ed altre attività minerarie definite dal D.Lgs
25 novembre 1996 n. 624»* `[RS×2]`. Quindi **16 h di corso base e 6 h di
aggiornamento triennale**, anche per un'azienda da 10 persone.

⚠️ **Il primo soccorso NON è stato toccato dall'Accordo 2025** — una prima fonte
diceva «biennale», e una verifica mirata l'ha smentita: le fonti concordano che gli
addetti al primo soccorso sono **esplicitamente esclusi** dal perimetro dell'ASR 2025
e restano sotto il **DM 388/2003**, con aggiornamento **triennale** `[RS×2]`.
Lo scrivo perché è **un errore che ho quasi commesso io stesso**, e chi rifà questa
ricerca lo incontrerà.

**Abilitazioni alle attrezzature** — Accordo Stato-Regioni **22 febbraio 2012**
(art. 73 c. 5 D.Lgs 81/08), in vigore dal **12 marzo 2013** `[RS]`:

| Attrezzatura | Aggiornamento | Marca |
|---|---|---|
| **Escavatori idraulici**, **pale caricatrici frontali**, **terne** | **quinquennale**, **4 h** di cui **almeno 3 pratiche** | `[RS×2]` |
| **Carrelli elevatori semoventi** con conducente a bordo | **quinquennale**, **4 h** di cui **almeno 3 pratiche** | `[RS×2]` |
| **Gru mobili**, **gru su autocarro**, **PLE** | citate nello stesso accordo; monte ore di aggiornamento non verificato | `[RS]` ⚠️ |

⚠️ Le **durate dei corsi base** per attrezzatura (moduli giuridico / tecnico /
pratico) sono negli **allegati tecnici** dell'accordo, che non ho potuto aprire.

### D.3 Verifiche periodiche delle attrezzature (allegato VII)

| Aspetto | Contenuto | Marca |
|---|---|---|
| Obbligo | Le attrezzature elencate nell'**allegato VII** vanno verificate periodicamente per **stato di conservazione ed efficienza** ai fini della sicurezza (art. 71 c. 11) | `[RS×2]` |
| **Prima verifica** | La fa l'**INAIL**, entro **45 giorni** dalla richiesta; si chiede sul portale **CIVA**, indicando un soggetto abilitato | `[RS×2]` |
| **Verifiche successive** | **ASL** o **ARPA** competente per territorio, oppure **soggetto abilitato pubblico o privato** iscritto nell'elenco regionale, autorizzato dal Ministero delle Imprese e del Made in Italy | `[RS×2]` |
| **Periodicità** | Varia da **1 a 3 anni** secondo **tipo** ed **età** della macchina | `[RS]` |
| Esempi citati | **Scale aeree a inclinazione variabile** e **ponti mobili sviluppabili su carro** → **annuale** | `[RS]` |
| Conservazione | Le relazioni di verifica vanno tenute **almeno 5 anni** | `[RS]` |
| Categorie dell'allegato | **SC** sollevamento materiali · **SP** sollevamento persone · **GVR** gas, vapore e recipienti in pressione | `[RS]` |
| Adempimento collegato | In caso di **demolizione, vendita o dismissione** di un apparecchio di sollevamento va data comunicazione a **INAIL** e informazione all'**ASL** (D.M. 11 aprile 2011) | `[RS]` |
| **Funi e catene** | **Controllo trimestrale**, in assenza di indicazioni diverse del fabbricante (allegato VI); lo fa **personale competente** incaricato dal datore di lavoro, non un ente esterno | `[RS×2]` |

⛔ **La tabella completa delle periodicità dell'allegato VII non l'ho ottenuta**, ed è
il buco più grosso di questa sezione: è una tabella a più colonne (tipo di
attrezzatura × portata × età) che nessuno degli estratti riporta per intero. Vedi la
lista finale.

⚠️ **Distinzione che le fonti tengono ferma e che è facile confondere**: la *verifica
periodica* dell'allegato VII (ente terzo, 1–3 anni) e il *controllo* dell'art. 71
c. 8 (personale interno competente, trimestrale per funi e catene) sono **due cose
diverse**, con due soggetti diversi e due registri diversi.

### D.4 Il DSS e gli adempimenti di polizia mineraria

| Adempimento | Contenuto | Marca |
|---|---|---|
| **DSS** — che cos'è | La valutazione dei rischi **specifica del settore estrattivo**: integra i contenuti dell'**art. 28 D.Lgs 81/08** con quelli dell'**art. 6 (e art. 10 per i cantieri) del D.Lgs 624/96** | `[RS×2]` |
| **Quando si aggiorna** | Quando i **luoghi di lavoro hanno subito modifiche rilevanti**, e — ove necessario — **a seguito di incidenti significativi** | `[RS×2]` |
| **A chi va** | Trasmesso all'**autorità di vigilanza prima dell'inizio dei lavori**; presentato a **Provincia, Comune e AUSL** insieme alla denuncia di esercizio | `[RS×2]` |
| **Chi lo firma** | Predisposto dal **datore di lavoro**, firmato dal **direttore responsabile** e dai **sorveglianti** | `[RS]` |
| **Denuncia di esercizio** (DPR 128/59, art. 20) | Inviata a **Provincia, Comune e AUSL** almeno **8 giorni prima** dell'inizio o della ripresa dei lavori, per raccomandata a/r; indica per ogni cantiere il **titolo minerario o l'autorizzazione**, il luogo, se a **cielo aperto o in sotterraneo**, e i dati di **direttore responsabile** e **sorveglianti per ogni turno** | `[RS×2]` |
| **Variazioni** di direttore responsabile o sorveglianti | Comunicate entro **8 giorni** all'autorità di vigilanza | `[RS]` |
| **Riunione periodica** (art. 35 D.Lgs 81/08) | **Annuale**, obbligatoria nelle aziende con **più di 15 lavoratori**; partecipano datore di lavoro, RSPP, medico competente (se nominato), RLS; si esamina il DVR, **l'andamento degli infortuni e delle malattie professionali**, i criteri di scelta dei DPI, i programmi di formazione; si redige **verbale** | `[RS×2]` |

⛔ **Nessuna periodicità fissa per il DSS.** Le fonti sono concordi: l'aggiornamento è
**guidato dagli eventi** (modifiche rilevanti, incidenti significativi), non dal
calendario. Un simulatore che facesse «scadere» il DSS ogni 12 mesi starebbe
inventando un obbligo che la norma non scrive.

⚠️ Non ho trovato **nessuna fonte** che documenti la **prassi** — cioè se le aziende
lo revisionino comunque con cadenza annuale, magari in occasione della riunione
dell'art. 35. È l'ipotesi che verrebbe in mente `[DED]`, e **non è provata**.

⚠️ Le **norme regionali** aggiungono adempimenti: la ricerca ha incontrato pagine di
polizia mineraria di **Piemonte**, **Emilia-Romagna**, **Toscana**, **Lombardia** con
modulistica propria. **Il calendario di una cava non è nazionale.**

---

## E. Tabella riassuntiva dei parametri per il simulatore

Solo le righe che considero utilizzabili. Tutto il resto sta nella lista finale.

| # | Evento | Frequenza attesa | Unità | Fonte | Marca |
|---|---|---|---|---|---|
| 1 | Denuncia di infortunio | **14,6** | ‰ addetti-anno | INAIL B 081 2015-19 / addetti Q&C | `[CALC]` |
| 2 | Infortunio indennizzato | **12,9** | ‰ addetti-anno | come sopra × 88% | `[CALC]` |
| 3 | Infortunio, azienda 20 addetti | **0,29** (≈ 1 ogni 3–4 anni) | eventi/anno | come sopra | `[CALC]` |
| 4 | Infortunio con **postumi permanenti** | **14,9%** degli indennizzati | quota | INAIL B 081 | `[RS]` |
| 5 | **Evento mortale** | **0,2** (forbice 0,04–0,21) | ‰ addetti-anno | INAIL, due strade | `[RS]`+`[CALC]` |
| 6 | Evento mortale, azienda 20 addetti | **0,004** (≈ 1 ogni 250 anni) | eventi/anno | come sopra | `[CALC]` |
| 7 | LTIFR | **8,8** | per 1.000.000 h | derivato da (1) | `[CALC]` |
| 8 | Tasso per 200.000 h | **1,77** (MSHA USA 2025: 1,74) | per 200.000 h | derivato + MSHA | `[CALC]`+`[RS]` |
| 9 | **Near-miss**, programma maturo | **200** | per 1.000.000 h | benchmark QHSE | `[RS]` |
| 10 | Near-miss, azienda 20 addetti, programma maturo | **5–9** | segnalazioni/anno | (9) e rapporto 20-30:1 | `[CALC]` |
| 11 | Near-miss, programma appena avviato | **< 1** | segnalazioni/anno | sotto-segnalazione 90% | `[CALC]` |
| 12 | Rapporto near-miss / infortunio «sano» | **20:1** minimo, **30–300:1** tipico | rapporto | benchmark QHSE | `[RS]` |
| 13 | Visita medica periodica | **12** (ma la fissa il protocollo sanitario) | mesi | art. 41/196/204 | `[RS×2]` |
| 14 | Registro esposti a cancerogeni | **36** | mesi | art. 243 | `[RS]` |
| 15 | Aggiornamento lavoratore | **60** (6 h) | mesi | ASR 2025 | `[RS×2]` |
| 16 | Aggiornamento **preposto** | **24** (6 h) | mesi | ASR 2025 | `[RS×2]` |
| 17 | Aggiornamento dirigente | **60** (6 h) | mesi | ASR 2025 | `[RS]` |
| 18 | Aggiornamento DL-RSPP | **60** (8 h) | mesi | ASR 2025 | `[RS]` |
| 19 | Aggiornamento **RLS** | **12** (4 h < 50 lav., 8 h ≥ 50) | mesi | D.Lgs 81/08 | `[RS]` |
| 20 | Aggiornamento **primo soccorso** (gruppo A) | **36** (6 h) | mesi | DM 388/2003 | `[RS×2]` |
| 21 | Aggiornamento **antincendio** | **60** (2/5/8 h per livello) | mesi | DM 2/9/2021 | `[RS×2]` |
| 22 | Aggiornamento **abilitazione macchine** | **60** (4 h, ≥3 pratiche) | mesi | ASR 22/2/2012 | `[RS×2]` |
| 23 | **Verifica periodica** allegato VII | **12 – 36** secondo tipo ed età | mesi | art. 71 c. 11 | `[RS]` |
| 24 | **Controllo funi e catene** | **3** | mesi | allegato VI | `[RS×2]` |
| 25 | **Riunione periodica** art. 35 | **12** (se > 15 lavoratori) | mesi | art. 35 | `[RS×2]` |
| 26 | **DSS** | **nessuna periodicità fissa** — si aggiorna su *modifica rilevante* o *incidente significativo* | evento | D.Lgs 624/96 | `[RS×2]` |
| 27 | Comunicazione **near-miss aggregati** (> 15 dip.) | annuale? **frequenza non nota**, linee guida attese 30/04/2026 | ? | L. 198/2025 | `[RS]` ⚠️ |

---

## F. Quello che non sono riuscito a trovare

Elenco esplicito, perché **un buco dichiarato vale più di un numero inventato**.

1. **La tabella completa delle periodicità dell'allegato VII.** So che vanno da 1 a 3
   anni secondo tipo ed età; **non ho la riga per riga** (gru su autocarro, PLE,
   carrelli semoventi a braccio telescopico, generatori di vapore, recipienti in
   pressione). È la cosa più utile che manca. Si trova nell'allegato VII del
   D.Lgs 81/08, che è un testo pubblico di poche pagine.
2. **La distribuzione percentuale degli infortuni in cava per dinamica.** Ho le
   famiglie (ribaltamento, macchine, fronti, caduta dall'alto, esplosivo, elettrico)
   ma **nessuna percentuale**. Il campione INAIL 2023 sono 19 casi di **Massa
   Carrara**: locale e troppo piccolo per farne una distribuzione.
3. **La distribuzione per parte del corpo, per età e per anzianità** dell'infortunato
   — utile a un simulatore realistico, non trovata.
4. **La distribuzione dimensionale delle imprese estrattive italiane** (quante da
   1-9, 10-19, 20-49, 50+ addetti). Ho solo una media grossolana calcolata da me.
5. **La periodicità della sorveglianza sanitaria per gli esposti a cancerogeni
   (art. 242)** espressa come numero. Le fonti dicono solo che il protocollo lo
   stabilisce il medico competente.
6. **Il regime in vigore oggi dell'Accordo Stato-Regioni 2025**: due date in
   contraddizione (19 maggio 2025 / 24 maggio 2026) e un periodo transitorio di cui
   non conosco le regole.
7. **Il monte ore di aggiornamento RSPP/ASPP** (una fonte cita 40 h, non confermata)
   e le **durate dei corsi base per attrezzatura** dell'accordo 2012.
8. **Le linee guida su near-miss** di Ministero del Lavoro e INAIL, attese entro il
   30/04/2026: potrebbero già esistere. Con esse, **la forma e la frequenza della
   comunicazione** obbligatoria — che oggi è la riga più incerta della tabella.
9. **La prassi di revisione del DSS**: nessuna fonte dice ogni quanto le aziende lo
   rifacciano davvero. L'ipotesi «annuale, con la riunione dell'art. 35» è **mia** e
   non è provata.
10. **Gli adempimenti regionali di polizia mineraria**, che esistono e cambiano da
    regione a regione. Il calendario di una cava lombarda non è quello di una cava
    toscana.
11. **Indice di gravità INAIL** per il settore estrattivo (giornate perse per addetto
    assicurato): ho la definizione, non il valore. Ho trovato solo un «0,04» che una
    fonte chiama indice di gravità e un'altra tasso di mortalità — segno che
    l'estratto era ambiguo, non che il numero sia quello.
12. **Il testo primario di qualunque cosa scritta qui sopra.** `WebFetch` risponde
    `EGRESS_BLOCKED`: tutto passa dagli estratti dei risultati di ricerca.

---

## Fonti

Infortuni e settore estrattivo:
- [Dati INAIL su infortuni in cave e miniere e sull'esposizione a silice](https://quarryandconstructionweb.it/rubriche/collaborazioni/dati-inail-su-infortuni-sul-lavoro-in-cave-e-miniere-e-sull-esposizione-a-silice-libera-cristallina-respirabile/) — Quarry & Construction
- [Infortuni: cave e miniere ai raggi X](https://www.gowem.it/Infortuni-cave-miniere-estrazione-dati-Inail)
- [Attività estrattive: i dati Inail su un settore ad alto rischio](https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/attivita-estrattive-dati-inail-settore-alto-rischio)
- [INAIL — Analisi della sicurezza nel settore estrattivo in cave a cielo aperto](https://www.inail.it/cs/internet/comunicazione/pubblicazioni/catalogo-generale/pubbl-analisi-sicurezza-settore-estrattivo-cave.html)
- [INAIL — Illustrazione delle dinamiche infortunistiche in cava (2023)](https://olympus.uniurb.it/index.php?Itemid=126&catid=98&id=30004%3Acava23&option=com_content&view=article)
- [Dati Inail — bollettino statistico (PDF)](https://www.inail.it/content/dam/inail-hub-site/documenti/dati-inail/2025/alg-dati-inail-2025-aprile-pdf.pdf)
- [INAIL — Indici di frequenza per inabilità permanente](https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/valutare-il-rischio/indici-di-frequenza-per-inabilita-permanente.html)
- [Analisi del settore estrattivo in Italia](https://quarryandconstructionweb.it/rubriche/collaborazioni/analisi-del-settore-estrattivo-in-italia/)
- [MSHA — all-injury rate 2025](https://www.dol.gov/newsroom/releases/msha/msha20260428)

Near-miss e piramide:
- [La legge di Heinrich / Bird — Certifico](https://www.certifico.com/sicurezza-lavoro/news-sicurezza/la-legge-di-heinrich-bird)
- [Piramide di Heinrich: fantasia o realtà? — Studio Marigo](https://studiomarigo.it/piramide-di-heinrich-fantasia-o-realta/)
- [The Heinrich/Bird safety pyramid: pioneering research has become a safety myth](https://risk-engineering.org/concept/Heinrich-Bird-accident-pyramid)
- [Examining Factors that Influence the Existence of Heinrich's Safety Triangle (25.000+ stabilimenti, PMC/NIH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6238149/)
- [Accident triangle — Wikipedia EN](https://en.wikipedia.org/wiki/Accident_triangle)
- [What is a near-miss reporting ratio and what ratio is healthy? — SmartQHSE](https://www.smartqhse.com/answers/near-miss-reporting-ratio)
- [Near Miss Reporting Rate Guide — Umbrex](https://umbrex.com/resources/company-analysis/risk-management-internal-audit/near-miss-reporting-rate/)
- [Enhancing Safety in Mining Using Near-Miss Reports — CDC/NIOSH (PDF)](https://stacks.cdc.gov/view/cdc/215756/cdc_215756_DS1.pdf)
- [D.L. 159/2025 — obbligo comunicazione mancati infortuni — Certifico](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note)
- [Near Miss: obblighi 2026, UNI 7249 e Legge 198/2025 — ERSG](https://www.ersg.it/it/post/gestione-dei-near-miss-cosa-cambia-per-le-aziende-dal-2026.html)

Sorveglianza sanitaria:
- [Art. 41 D.Lgs 81/2008](https://tussl.it/titolo-i-principi-comuni/capo-iii-gestione-della-prevenzione-nei-luoghi-di-lavoro/sezione-v-sorveglianza-sanitaria/art-41)
- [Art. 196 — rumore](https://tussl.it/titolo-viii-agenti-fisici/capo-ii-protezione-dei-lavoratori-contro-i-rischi-di-esposizione-al-rumore-durante-il-lavoro/art-196)
- [Art. 204 — vibrazioni](https://tussl.it/titolo-viii-agenti-fisici/capo-iii-protezione-dei-lavoratori-dai-rischi-di-esposizione-a-vibrazioni/art-204)
- [Art. 242 — cancerogeni](https://tussl.it/titolo-ix-sostanze-pericolose/capo-ii-protezione-da-agenti-cancerogeni-mutageni-o-da-sostanze-tossiche-per-la-riproduzione/sezione-iii-sorveglianza-sanitaria/art-242)
- [Art. 243 — registro di esposizione](https://www.medicoeleggi.com/argomenti000/italia2008/400116-243.htm)
- [D.Lgs 44/2020 — silice cristallina tra gli agenti cancerogeni](https://www.rivisrl.it/it/news/Decreto-Legislativo-n.-44-2020-TRA-GLI-AGENTI-CANCEROGENI-ANCHE-LA-SILICE-CRISTALLINA-RESPIRABILE/261)
- [Rischio silice: quadro normativo e metodi di valutazione — BibLus](https://biblus.acca.it/rischio-silice-valutazione-quadro-normativo/)
- [INAIL — sorveglianza sanitaria agenti cancerogeni](https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/conoscere-il-rischio/agenti-cancerogeni-e-mutageni/sorveglianza-sanitaria.html)

Formazione:
- [Nuovo Accordo Stato-Regioni 2025 — Vega Engineering](https://www.vegaengineering.com/news/nuovo-accordo-stato-regioni-2025-le-novita-sulla-formazione-dei-lavoratori-preposti-e-dirigenti/)
- [Accordo Stato-Regioni 2025 — Punto Sicuro](https://www.puntosicuro.it/informazione-formazione-addestramento-C-56/accordo-stato-regioni-2025-cambiano-le-regole-sui-corsi-a-tema-sicurezza-AR-25629/)
- [Nuovo ASR 2025: dal 24 maggio 2026 cambiano le regole — Artser](https://www.artser.it/approfondimenti/nuovo-accordo-stato-regioni-2025-sulla-formazione-per-la-sicurezza-dal-24-maggio-2026-cambiano-le-regole.html)
- [Accordo 22 febbraio 2012 — attrezzature (testo su Olympus)](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=6734:2012accordo22212&catid=7:contratti-e-relazioni-sindacali&Itemid=59)
- [Accordo 22 febbraio 2012 — Gazzetta Ufficiale](https://www.gazzettaufficiale.it/eli/id/2012/03/12/12A02668/sg)
- [Normativa primo soccorso: DM 388/2003 — Punto Sicuro](https://www.puntosicuro.it/approfondimenti/normativa-primo-soccorso-dm-388-2003/)
- [Classificazione aziende gruppo A, B e C — DM 388/2003](https://www.grupposef.com/classificazione-aziende-gruppo-a-b-e-c-secondo-il-dm-388-2003-primo-soccorso/)
- [DM 2 settembre 2021 — formazione antincendio](https://www.vegaformazione.it/PB/formazione-antincendio-dm-2-9-21-p278.html)
- [Scadenza corso RLS: l'aggiornamento annuale](https://www.normativesicurezza.com/news/scadenza-corso-rls-aggiornamento-annuale-obbligatorio)

Verifiche periodiche:
- [INAIL — manutenzione, controllo e verifica di un'attrezzatura](https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/conoscere-il-rischio/attrezzature-di-lavoro/manutenzione,-controllo-e-verifica-di-un-attrezzatura.html)
- [Allegato VII — testo unico sicurezza (BibLus)](https://biblus.acca.it/allegato-vii-testo-unico-sicurezza/)
- [Allegato VII — D.Lgs 81/2008](https://tussl.it/allegati/allegato-vii)
- [Allegato VII — PDF USL Toscana Nord Ovest](https://www.uslnordovest.toscana.it/attachments/article/5427/AllegatoVII_D.lgs.%2081-2008.pdf)
- [La verifica periodica obbligatoria per le attrezzature dell'allegato VII](https://notiziariosicurezza.it/la-verifica-periodica-obbligatoria-per-le-attrezzature-di-cui-allallegato-vii/)
- [Verifica funi e catene: periodicità e modalità — Vega Formazione](https://www.vegaformazione.it/PB/verifica-funi-catene-p526.html)

DSS e polizia mineraria:
- [Il documento di sicurezza e salute nel settore estrattivo — Punto Sicuro](https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/)
- [Il DSS per le attività estrattive — Studio Essepi](https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/documento-di-sicurezza-e-salute-dss-attivita-estrattive)
- [Vademecum sicurezza attività estrattive D.Lgs 624/96 — Certifico](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/vademecum-sicurezza-attivita-estrattive)
- [DPR 9 aprile 1959 n. 128 — norme di polizia delle miniere e delle cave](https://www.edizionieuropee.it/law/html/35/zn64_01_020.html)
- [Obblighi di polizia mineraria — Provincia di Reggio Emilia](https://www.provincia.re.it/page.asp?ID=92939&IDCategoria=701&IDSezione=4329)
- [Il lavoro in cava e in miniera: i soggetti del sistema sicurezza — Punto Sicuro](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/il-lavoro-in-cava-in-miniera-i-soggetti-del-sistema-sicurezza-salute-AR-23128/)
- [Riunione periodica art. 35 — BibLus](https://biblus.acca.it/art-35-dlgs-81-2008/)
