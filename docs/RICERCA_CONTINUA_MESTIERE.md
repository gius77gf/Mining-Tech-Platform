# RICERCA CONTINUA: il mestiere della cava

Documento in coda, mai sovrascritto. Ogni tornata dichiara il commit contro cui
è stata verificata, quello che esisteva già in casa, e per ogni «non c'è» il
comando con la sua uscita.

---

## Tornata 1 — 13/08/2026 · «Il rapporto di fine turno e l'ispettore»

**Verificato contro il commit `8f6c9c1b`** (13/08/2026 23:05 UTC).
**Domanda**: che cosa contiene davvero un rapporto di fine turno in una cava
italiana, e che cosa chiede un ispettore quando arriva.

### 0 · Lo strumento, dichiarato prima dei risultati

`WebFetch` è stato **negato dal proxy su tutti e dieci i domini provati**
(`parlamento.it`, `istat.it`, `it.wikipedia.org`, `puntosicuro.it`,
`edizionieuropee.it`, `pugliacon.regione.puglia.it`, `regione.piemonte.it`,
`provincia.re.it`, `enbital.it`, `asl4.liguria.it`), con errore
`EGRESS_BLOCKED`. **Nessuna pagina si è aperta.** Quello che segue viene dal
**testo restituito da `WebSearch`**, che cita e riassume quelle pagine, con il
**link canonico** accanto a ogni voce. Dove la fonte non basta a decidere, la
riga è marcata `[dedotto]` e non va usata per costruire codice senza rileggere
il testo di legge.

⚠️ **E un mio grep ha prodotto un «non c'è» falso, dentro questa stessa
ricerca.** Cercando `autorit. di vigilanza` con un punto al posto della
`à` ho avuto **0 righe** e stavo per scrivere che Scudo non conosce
l'autorità di vigilanza: in UTF-8 la `à` sono **due byte**, e il punto ne
combacia uno. Rifatto con l'accento vero: **11 righe**, fra cui il ciclo di
vita del DSS. È la famiglia già scritta in `CLAUDE.md` — *un censimento che
cerca un nome risponde «non c'è» con la stessa faccia con cui direbbe la
verità* — in una veste nuova: **il nome era giusto, a sbagliare era la
codifica**. Regola pratica per chi cerca in italiano: **le parole accentate si
cercano intere, mai con un jolly sull'accento.**

⚠️ **E la seconda volta è stata peggiore, perché sbagliava nel verso
tranquillo: il termine era giusto, era il PERIMETRO a essere sbagliato.**
Cercando gli esplosivi avevo grepato `apps/campo apps/scudo apps/terra
apps/sentinella` — le app «del turno e della sicurezza» — e avuto
`detonator` → **0**, `esplosiv` → **15**. Su tutto `apps/` sono **48** e
**114**, perché a mancare era **Genesi**, cioè l'app che l'esplosivo lo
progetta. Stavo per scrivere che di detonatori in casa non c'è traccia. Il
perimetro me l'ero scelto **per argomento**, e l'argomento era proprio quello
che escludevo. Regola: **un censimento dichiara il perimetro insieme al
numero**, e quando il numero è zero la prima domanda non è «manca?», è **«ho
guardato dove starebbe?»**.

### 1 · Che cosa esiste GIÀ in casa (letto prima di proporre)

Letti: `docs/RICERCA_CONTINUA_NORME.md` (289 righe), `apps/campo/campo-data.js`
(3.326 righe) e la sua pagina, `apps/scudo/scudo-data.js` (5.271),
`apps/terra/terra-data.js` (2.787).

- **`RICERCA_CONTINUA_NORME.md`** ha già analizzato il D.Lgs 624/96 e dà il
  ciclo di vita del DSS come **CORRISPONDE** (redazione prima dell'inizio,
  certificazione annuale, aggiornamento dopo modifiche o incidenti,
  trasmissione all'autorità di vigilanza). **Non lo rimetto in discussione.**
  Non tocca invece: DPR 128/59, denuncia di esercizio, statistica mineraria,
  l'elenco dell'art. 10, la relazione infortuni.
- **Scudo** ha: `cicloDss` con i dodici mesi di certificazione e la
  trasmissione su una riga sua (`descriviTrasmissioneDss`, con `null` che non
  diventa mai un sì); `NOMINE_RUOLI` con **sorvegliante** e **direttore
  responsabile** entrambi `obbligatoria: true` e col riferimento al 624/96;
  `SCADENZE_PRESET` con `esposti-silice` (art. 243 D.Lgs 81/08, 36 mesi),
  `dss-aggiorn`, `dss-trasmiss`, `sorvegliante`, `rumore-vibraz`;
  `csvRegistroInfortuni` con la nota della prognosi aperta; sei
  `MODELLI_ISPEZIONE` (giro di sorveglianza, fronte, piste, impianto, mezzi,
  DPI/emergenza); `ENTI_VERIFICA` con INAIL/ASL/ARPA e i 45 giorni dell'art. 71
  c.11; l'anagrafe appaltatori; il riepilogo mancati infortuni (L. 198/2025).
- **Campo** ha: chiusura del turno con **due firme e un'ora** (`chiusuraDi`,
  `riassuntoChiusura`), turno chiuso non più modificabile (`turnoChiuso`),
  **riaperture tracciate e mai cancellate** (`riaperture`,
  `riassuntoRiapertura`), appello con il «non lo so» che non diventa assente
  (`appelloTurno`), orari veri di presenza (`orariPresenza`), **riposo di 11
  ore** fra i turni con lo stato `non-misurabile` (`riposoPrimaDelTurno`, che
  cita D.Lgs 66/2003 art. 7), checklist di inizio turno con `descriviChecklist`
  che dichiara le voci **senza risposta**, meteo e condizioni del sito con lo
  stato `non-registrato`, fermi con causale e minuti e il «senza minuti»
  dichiarato, produzione per unità (t / m³ / viaggi, mai sommate fra loro),
  piano e consuntivo delle cariche, `segnalazioniDelTurno` sugli infortuni del
  turno, la **consegna di turno in testo** e il **rapporto di fine turno
  stampabile**.
- **Terra** ha: `riepilogoAnnuale` e la schermata **Denuncia** (con l'avviso
  che modulo, scadenza e modo di contare cambiano da regione a regione, e che
  molte regioni chiedono l'invio **anche negli anni in cui non si è scavato**),
  `TIPI_SCADENZA_TERRA` con `rilievo` («Rilievo periodico dei lavori —
  planimetrie aggiornate») e `denuncia`, `classeAccuratezza` e la classe di
  qualità topografica, `origineDi` con la stima dichiarata che **non consuma il
  volume concesso e non entra nella denuncia**.

**Cioè: la casa è messa molto meglio di quanto un elenco di mancanze
suggerirebbe.** Le voci qui sotto sono poche di proposito.

---

### 2 · IL MONDO — che cosa dice la norma e la prassi

#### 2.1 Il quadro documentale di una cava

| Voce | Che cosa prescrive | Fonte |
|---|---|---|
| **DSS** | Analisi dei rischi specifica dell'estrattivo. Va inviato all'**ASL competente per territorio almeno otto giorni prima dell'inizio dell'attività**, **contestualmente alla denuncia di esercizio**. Aggiornato a modifiche rilevanti e dopo incidenti rilevanti; il datore di lavoro **attesta annualmente** che luoghi, attrezzature e impianti sono progettati, utilizzati e mantenuti in efficienza in modo sicuro. Con appaltatori il **titolare** redige il **DSS coordinato** dopo aver ricevuto il DSS di ciascun appaltatore (artt. 6 e 9). | [Studio Essepi](https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/documento-di-sicurezza-e-salute-dss-attivita-estrattive) · [Puntosicuro](https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/) · testo: [D.Lgs 624/96](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm) *(pagina non aperta: proxy)* |
| **DSS — art. 10, i tredici elementi** | Il DSS indica «le soluzioni adottate, **ovvero l'assenza di rischio**, per ciascuno dei seguenti elementi»: a) protezione contro incendi, esplosioni, atmosfere esplosive o nocive; b) mezzi di evacuazione e salvataggio; c) sistemi di comunicazione, avvertimento e allarme; d) **sorveglianza sanitaria**; e) programma di ispezione, manutenzione e collaudo sistematici di attrezzature, strumentazione e impianti meccanici/elettrici/elettromeccanici; f) manutenzione del materiale di sicurezza; g) uso e manutenzione dei recipienti a pressione; h) uso e manutenzione dei mezzi di trasporto; i) esercitazioni di sicurezza; l) aree di deposito; m) **stabilità dei fronti**; n) strutture di sostegno. | [Ced Ingegneria](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/) · [Linee guida Regione Toscana](https://www.regione.toscana.it/documents/10180/70872/Linee+guida+regionali+DLgs+624+del+96/e59e9f59-9962-4571-bcf9-1711f52e9acb) *(non aperte: proxy)* |
| **Denuncia di esercizio** (art. 24 DPR 128/59) | Da compilare su **apposito modulo** e inviare a **Provincia, Comune e AUSL** **almeno otto giorni prima dell'inizio o della ripresa dei lavori**. Indica, **per ogni luogo di lavoro**: estremi del titolo minerario o dell'autorizzazione di cava; ubicazione dei lavori e se a cielo aperto o in sotterraneo; **nome, cognome e domicilio del direttore responsabile**; **nome, cognome e domicilio dei sorveglianti dei lavori, PER CIASCUN TURNO**. Le variazioni si comunicano (art. 25); gli incarichi vanno **accettati per controfirma** dagli interessati (art. 26); il direttore responsabile dev'essere **ingegnere abilitato** (art. 27). | [Provincia di Reggio Emilia](https://www.provincia.re.it/page.asp?ID=92939&IDCategoria=701&IDSezione=4329) · [Regione Piemonte — modello](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/modello-denuncia-esercizio-cava-impianto-connesso) *(non aperte: proxy)* |
| **Sorvegliante** | «Persona con le capacità e le competenze necessarie, designata dal datore di lavoro per sorvegliare i lavori nei luoghi occupati dai lavoratori»: è **costantemente presente sul luogo di lavoro**. Va indicato **uno per turno e per luogo di lavoro** perché la responsabilità sia identificabile; su siti complessi se ne possono avere più d'uno, ma **compiti e responsabilità vanno individuati formalmente nel DSS**. Obblighi principali all'art. 20 D.Lgs 624/96. | [Bollettino di Legislazione Tecnica](https://legislazionetecnica.it/node/1314819) |
| **Rilievi topografici** (artt. 32-37 DPR 128/59) | Le planimetrie dei lavori vanno **compilate e tenute aggiornate**; **entro la fine di marzo di ogni anno** se ne consegna copia aggiornata **al 31 dicembre precedente**, **con la firma del direttore**. Scala 1:500 (o d'insieme non inferiore a 1:200 con planimetrie speciali dei cantieri). Obbligo esteso ai lavori a cielo aperto quando l'ingegnere capo lo ritenga necessario per la sicurezza. | [Regione Umbria — articoli DPR 128/59](https://www.regione.umbria.it/documents/18/25173917/Allegato+articoli+abrogati+del+DPR+128+59/8ad1a27b-3f46-4dfc-a0e1-efa7eaaaeaa7) *(non aperta: proxy)* |
| **Statistica mineraria annuale** | I titolari di autorizzazione di cava trasmettono **ogni anno** i dati statistici e quelli per la banca dati delle attività estrattive, tramite **modello su sportello telematico regionale**. I dati servono a monitorare produzione e addetti, verificare la corretta esecuzione dei progetti autorizzati, **condurre le ispezioni di polizia mineraria**, verificare il rispetto delle norme di sicurezza e i lavori di chiusura e recupero ambientale. | [Regione Piemonte — statistica mineraria](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale) · [Provincia di Trento](https://www.provincia.tn.it/Documenti-e-dati/Documenti-di-supporto/Statistica-mineraria-Cave) *(non aperte: proxy)* |
| **Rilevazione Istat «Cave e miniere»** | Rilevazione annuale «Pressione antropica e rischi naturali». **Un questionario per ogni sito estrattivo e per ogni risorsa minerale estratta** (non più questionari per la stessa risorsa in base all'uso finale). Nove sezioni; la **quantità estratta** è quella estratta dal sito nell'anno di riferimento ed è **espressa in peso**. Il sistema di acquisizione (GINO) esegue **controlli automatici di qualità per evitare informazioni mancanti sulle variabili fondamentali**. | [Istat — Estrazioni di risorse minerali](https://www.istat.it/sistema-informativo-6/estrazioni-di-risorse-minerali-non-energetiche-e-acque-minerali-naturali/) · [fac-simile questionario 2024](https://www.istat.it/fascicoloSidi/1852/FAC%20SIMILE%20Questionario%20web%20CAVE%20E%20MINIERE%20ediz.%202024.pdf) *(non aperti: proxy)* |
| **Infortuni** | Il **direttore responsabile** denuncia all'**autorità di vigilanza entro 24 ore**, per telegramma o fax, ogni infortunio che abbia causato **la morte** o **lesioni con guarigione superiore a 30 giorni**; se, contro la prognosi iniziale, l'infortunato **non è guarito entro 30 giorni**, lo denuncia **entro la settimana successiva**, allegando la documentazione medica. La denuncia contiene una **relazione dettagliata firmata dal direttore responsabile** su cause e circostanze. Il **sorvegliante comunica immediatamente** ogni infortunio di cui viene a conoscenza al datore di lavoro dell'infortunato, al direttore responsabile e al titolare. | [Ced Ingegneria — D.Lgs 624/96](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/) |
| **Relazione mensile infortuni** | Fra gli obblighi dell'esercente: «trasmettere all'autorità di vigilanza una **relazione mensile riassuntiva degli infortuni**», insieme alla nomina di direttore e sorvegliante/i e all'attestazione dei loro requisiti. | [Regione Puglia, DGR 570/2015 — linee guida prevenzione e sicurezza in cava](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137) |
| **Silice cristallina respirabile** | I lavori con esposizione a polvere di **silice cristallina respirabile generata da un procedimento di lavorazione** sono in **allegato XLII** (cancerogeni). Valore limite 8 ore: **0,1 mg/m³** (allegato XLIII). Sorveglianza sanitaria e **registro degli esposti** ex art. 243 D.Lgs 81/08, aggiornato **almeno ogni tre anni**. Settori: movimento terra, **estrazione in cava e mineraria**, demolizioni, manipolazione di sabbia. | [Ambiente Sicurezza News](https://www.ambientesicurezzanews.it/sicurezza/silice-libera-cristallina-rischio-cancerogeno.php) · [ATS Brianza — buone prassi lapidei](https://www.ats-brianza.it/images/pianomirato/lapidei/Manuale%20buone%20prassi%20lavorazione%20lapidei%20rev4.pdf) |
| **Esplosivi** | Il personale incaricato dell'accettazione e del controllo del materiale esplosivo cura la compilazione del **registro di carico e scarico** e del **registro della velocità di combustione delle micce**, che riporta: data della prima verifica, tempo di combustione dichiarato dal fornitore, **tempo verificato**. Il deposito temporaneo in cantiere è ammesso solo in ambienti idonei e sotto la **custodia di personale designato per iscritto** dal datore di lavoro. L'esplosivo non utilizzato va distrutto se non ritirato dal fornitore (art. 34 DPR 302/56). | [Linea Guida n. 14 — AUSL Bologna](https://www.ausl.bologna.it/eventi/archivio/auslevent.2016-07-12.1669126488/files/Linea-Guida-n-a6-14-Utilizzo-degli-esplosivi-in.pdf) · [Procedura uso esplosivi in cava](https://www.testo-unico-sicurezza.com/procedura-di-sicurezza-uso-degli-esplosivi-in-cava.html) |

#### 2.2 Che cosa chiede un ispettore

- **In cava, specificamente**: l'organo di vigilanza chiede i dati del datore di
  lavoro e **l'organigramma della sicurezza con evidenza di incarichi, nomine e
  deleghe**; verifica la **formazione di tutti i dipendenti** e la qualifica dei
  professionisti incaricati (RSPP, medico competente). Il personale tecnico
  regionale può ispezionare **anche senza preavviso** per verificare il rispetto
  delle norme tecniche, l'**osservanza del regolamento di polizia mineraria** e
  l'attuazione effettiva delle misure del piano di sicurezza.
  ([S.I.A. Ingegneria](https://www.siaingegneria.com/articoli/normativa-sicurezza-sul-lavoro/ispezioni-organi-di-vigilanza-sicurezza-lavoro) ·
  [DGR Puglia 570/2015](https://olympus.uniurb.it/index.php?id=15828%3Apug570_15&option=com_content&view=article))
- **Nella parte generale (81/08)**: la sequenza è arrivo e identificazione,
  motivo e ambito, **richiesta documenti**, sopralluogo, dichiarazioni. I
  documenti richiesti per primi: **DVR** (firmato con data certa da datore,
  RSPP, medico competente, RLS), **nomine e accettazioni** (RSPP, medico
  competente, RLS, addetti primo soccorso e antincendio), **attestati di
  formazione** di lavoratori, preposti, dirigenti e addetti alle emergenze,
  **giudizi di idoneità**, **registro di consegna dei DPI**, Libro Unico,
  appalti/PSC/POS.
  ([Consulenza Agricola](https://consulenzaagricola.it/circolari/lavoro/19113-visita-ispettiva-in-azienda-la-documentazione-obbligatoria) ·
  [Sicurlive](https://www.sicurlivegroup.it/it/news/ispezioni-asl-cosa-aspettarsi-da-un-controllo-sulla-sicurezza))
- **Il verbale**: la descrizione della situazione accertata deve
  «fedelmente e oggettivamente rappresentare lo stato dei luoghi e delle cose
  ispezionate», e può essere integrata da rilievi fotografici o planimetrici e
  da **copie dei documenti esaminati e acquisiti sul posto**.
  ([Puntosicuro — l'intervento di vigilanza](https://www.puntosicuro.it/vigilanza-controllo-C-66/come-si-attua-l-intervento-di-vigilanza-ispezione-AR-17552/))

#### 2.3 Il rapporto di fine turno come lo compila un capocantiere

Fuori dalla norma, la prassi (rapportino di cantiere / fine turno):

- si compila **durante l'attività o subito dopo la fine dell'intervento**,
  perché così le informazioni sono più precise e cala il rischio di omissioni;
- contiene la **descrizione dei lavori svolti con le quantità relative** (metri
  cubi, metri quadri, metri lineari), che è la base per l'avanzamento e per gli
  indici di produttività;
- la **firma del capocantiere** — e, quando serve, del direttore lavori o del
  committente — dà valore formale al documento ed è spesso **richiesta
  contrattualmente**;
- le presenze riportano nominativo, qualifica, azienda di appartenenza, **ora di
  inizio e di fine**, firma;
- il costo di non farlo si vede settimane dopo: ore mancanti, attività non
  verificabili, contestazioni sulla presenza del personale.
  ([Geobadge](https://geo-badge.com/blog/rapportini-cantiere-modello-strumenti/) ·
  [Constrack](https://constrack.pro/blog/it/site-work-report-template-download/) ·
  [Geoclever — registro presenze](https://www.geoclever.it/articoli-blog/registro-presenze-cantiere/))

#### 2.4 ⚠️ La domanda che vale di più: quando un dato NON è stato misurato

Non ho trovato una norma che prescriva **il segno** da scrivere in una casella
non misurata (un trattino, «N.D.», altro): **nessuna fonte lo dice, e questa è
una risposta, non una lacuna della ricerca.** Quello che le fonti dicono, e che
è più forte di un segno grafico, sono **tre cose**:

1. **La norma dell'estrattivo pretende una dichiarazione POSITIVA di assenza,
   non una casella vuota.** L'art. 10 del D.Lgs 624/96 chiede di indicare «le
   soluzioni adottate, **ovvero l'assenza di rischio**, per ciascuno dei
   seguenti elementi». Cioè: per ognuno dei tredici punti si scrive o la
   soluzione, o **che il rischio non c'è** — e chi lo scrive se ne assume la
   responsabilità firmando il documento. Il bianco non è previsto.
   ([Ced Ingegneria](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/))
2. **Sui registri la contestazione tipica non è l'assenza del registro, è la
   sua tenuta approssimativa.** Gli errori più comuni: **annotazioni incomplete
   che riportano solo la data senza specificare che cosa è stato controllato o
   chi ha eseguito l'intervento**, e **aggiornamenti retroattivi** — il registro
   compilato settimane dopo, che perde il valore di tracciabilità cronologica.
   Per ogni intervento vanno registrati data di esecuzione, tipo di controllo,
   **anomalie rilevate** e **azioni correttive adottate**.
   ([Edafos](https://www.edafos.it/prevenzione-incendi-antincendio/registro-controlli-antincendio-cosa-annotare-chi-compila/) ·
   [Fiamma](https://fiamma-antincendio.it/registri-antincendio-compilazione-obblighi-contenuti/))
3. **Chi se ne assume la responsabilità è nominato per legge, e in cava è
   nominato PER TURNO.** Il sorvegliante è la persona costantemente presente sul
   luogo di lavoro, indicata **per ciascun turno** nella denuncia di esercizio; i
   suoi compiti, dove il sito è complesso, sono individuati **formalmente nel
   DSS**. Cioè la risposta a «chi risponde di quello che questo turno non ha
   misurato» **esiste già nella norma e ha un nome**.
   ([Provincia di Reggio Emilia](https://www.provincia.re.it/page.asp?ID=92939&IDCategoria=701&IDSezione=4329) ·
   [Legislazione Tecnica](https://legislazionetecnica.it/node/1314819))

`[dedotto]` **La lettura che ne do, marcata come deduzione**: il principio del
fondatore («l'assenza di un dato non è un dato favorevole») non è
un'invenzione di prodotto — è la forma che la norma dell'estrattivo usa già
all'art. 10, e la prassi dei registri la conferma dal lato negativo. Ma la
norma aggiunge una cosa che oggi da noi non c'è: **l'assenza dichiarata ha un
autore**. Un «non misurato» senza il nome di chi lo dichiara, sulla prassi dei
registri, è esattamente l'«annotazione incompleta» che l'ispettore contesta.

---

### 3 · IL DELTA — voce per voce, con la prova

Legenda: **C'È** · **A METÀ** · **CONFERMATA ASSENTE** (col comando e la sua
uscita).

| Voce del mondo | Da noi | Prova |
|---|---|---|
| DSS: ciclo di vita, certificazione a 12 mesi, trasmissione, aggiornamento dopo incidente | **C'È** | `cicloDss`, `MESI_CERTIF_DSS`, `descriviTrasmissioneDss` in `apps/scudo/scudo-data.js:2607-2700`; già validato in `RICERCA_CONTINUA_NORME.md` |
| DSS coordinato con appaltatori (art. 9) | **C'È** | `RICERCA_CONTINUA_NORME.md` §2, `apps/scudo/index.html:4203` («art. 9 c.2 vuole la firma») |
| Nomina di direttore responsabile e sorvegliante | **C'È** | `NOMINE_RUOLI` in `apps/scudo/scudo-data.js:3232-3264`, entrambi `obbligatoria: true` col riferimento al 624/96 |
| Registro esposti silice, 36 mesi | **C'È** | `apps/scudo/scudo-data.js:2143` (`esposti-silice`, art. 243, allegato XLII dal D.Lgs 44/2020) |
| Verifiche periodiche attrezzature, INAIL/ASL/ARPA, 45 giorni | **C'È** | `ENTI_VERIFICA`, `apps/scudo/scudo-data.js:2232-2260`; `apps/scudo/index.html:1221` |
| Riepilogo mancati infortuni (L. 198/2025) | **C'È** | `riepilogoNearMiss`, `apps/scudo/index.html:1436` |
| Rapporto di fine turno: quantità, presenze con orari, firme, fermi, checklist, meteo | **C'È, e più ricco della prassi** | generatore in `apps/campo/index.html:4268-4400`; le riaperture entrano nel documento, e i fermi «senza minuti» sono dichiarati |
| Registro compilato subito, non retroattivamente | **C'È** | `turnoChiuso` blocca la scrittura dopo la firma; `riaperture` non si cancellano mai (`apps/campo/campo-data.js:957-1028`) |
| «Chi ha eseguito» sulle annotazioni | **C'È in parte** | la chiusura porta `consegna` e `ricevuta`; l'appello porta gli orari per operatore |
| Denuncia annuale dei volumi all'ente | **C'È** | schermata Denuncia di Terra, `apps/terra/index.html:915-976`; `riepilogoAnnuale` |
| Planimetrie/rilievi periodici | **A METÀ** | esiste il tipo di scadenza `rilievo` («planimetrie aggiornate», `apps/terra/terra-data.js:1645`) ma **generico**: nessuna traccia della consegna **entro marzo** dei rilievi al **31/12** né della **firma del direttore**. `$ grep -rn 'planimetri' apps/ --include=*.js --include=*.html` → **2 righe**, nessuna delle due sul termine o sulla firma |
| **Denuncia di esercizio** (art. 24 DPR 128/59) | **CONFERMATA ASSENTE** | `$ grep -rniE 'denuncia di esercizio\|denuncia d.esercizio' apps/ shared/ index.html --include=*.js --include=*.html` → **0 righe**. E: `$ grep -rniE 'otto giorni\|8 giorni' apps/scudo/ apps/terra/ apps/campo/` → **0 righe** |
| **Sorvegliante del turno, nel turno** | **CONFERMATA ASSENTE in Campo** (la nomina c'è in Scudo) | `$ grep -rniE 'sorvegliante' apps/campo/` → **0 righe**; `$ grep -rniE 'direttore responsabile' apps/campo/ apps/terra/` → **0 righe** |
| **Comunicazione infortunio entro 24 ore all'autorità di vigilanza** (morte o prognosi > 30 giorni), e la seconda denuncia entro la settimana successiva | **CONFERMATA ASSENTE** | `$ grep -rniE 'entro 24 ore\|entro ventiquattro' apps/ --include=*.js --include=*.html` → **0 righe**. `$ grep -rniE '30 giorni' apps/scudo/ --include=*.js --include=*.html` → **9 righe, tutte e nove sulle scadenze «in scadenza entro 30 giorni»**, nessuna sulla prognosi |
| **Relazione mensile riassuntiva degli infortuni** all'autorità di vigilanza | **CONFERMATA ASSENTE** | `$ grep -rniE 'mensile\|ogni mese' apps/scudo/ --include=*.js --include=*.html` → **5 righe**: due sull'indice di frequenza mensile scartato, tre sulla periodicità proposta delle scadenze. Nessuna sulla relazione |
| **Statistica mineraria annuale / rilevazione Istat** | **CONFERMATA ASSENTE come termine** | `$ grep -rniE 'statistica mineraria\|ISTAT' apps/ --include=*.js --include=*.html` → **2 righe**, e sono **falsi positivi**: `aziStato` e `AZI.find` in `apps/scudo/index.html:4186-4187` (la sottostringa `iStat`). ⚠️ Ma Terra **la denuncia annuale ce l'ha**: qui manca il nome e la distinzione fra i due invii, non la funzione |
| **Registro carico/scarico esplosivi e verifica delle micce** | **A METÀ** | Il mestiere dell'esplosivo in casa è **molto presente**: `$ grep -rniE 'esplosiv' apps/ --include=*.js --include=*.html` → **114 righe** (di cui **95 in Genesi**), `fochino` → **46**, `detonator` → **48**. Quello che manca è il **registro di polizia**: `$ grep -rniE 'carico e scarico\|carico/scarico' apps/ --include=*.js --include=*.html` → **4 righe**, e nessuna è sugli esplosivi (magazzino ricambi e **gasolio** in Flotta, aree di manovra in Scudo); `$ grep -rniE 'velocità di combustione\|miccia\|micce' apps/ --include=*.js --include=*.html` → **1 riga**, ed è la miccia detonante come **sistema d'innesco** in `apps/genesi/genesi.html:1257`, non una verifica registrata |
| «Giornale di cava» / «registro dei lavori» come termine di mestiere | **CONFERMATA ASSENTE come parola** | `$ grep -rniE 'giornale\|registro dei lavori\|libretto' apps/campo/ apps/terra/ --include=*.js --include=*.html` → **0 righe**. ⚠️ Ma la **cosa** c'è (consegna di turno + rapporto stampabile): è un delta di **vocabolario**, non di funzione — vedi §5 |

---

### 4 · Le proposte (formato fisso)

Ognuna: **dove · che cosa non va · come si vede · quanto costa · come si
misura**. Nessuna entra in roadmap sulla parola di questa ricerca.

1. **Scudo → Nomine · La denuncia di esercizio non esiste come documento, e con
   lei manca il legame «sorvegliante ⇄ turno» che la norma pretende** · L'art.
   24 del DPR 128/59 chiede nome, cognome e domicilio dei sorveglianti **per
   ciascun turno**, oltre al direttore responsabile, e la sua accettazione per
   controfirma (art. 26); Scudo ha le nomine ma non sa a quale turno si
   riferiscono, e non ha la denuncia né il termine degli otto giorni ·
   `grep -rniE 'denuncia di esercizio' apps/` → 0 righe, `grep -rniE 'otto
   giorni|8 giorni' apps/scudo/ apps/terra/ apps/campo/` → 0 righe · **costo:
   medio** — un preset di scadenza + un campo `turni` su `NOMINE_RUOLI` con
   chiave `sorvegliante` (già `multiplo: true`) + una riga nell'organigramma ·
   **come si misura**: `organigrammaSicurezza` con tre turni dichiarati e un
   solo sorvegliante nominato deve rispondere **«due turni scoperti»** e non
   «nomina presente»; controprova: togliendo il turno dalla nomina la riga
   torna «non lo sappiamo», mai «a posto». Fonte:
   [Provincia di Reggio Emilia](https://www.provincia.re.it/page.asp?ID=92939&IDCategoria=701&IDSezione=4329),
   [Legislazione Tecnica](https://legislazionetecnica.it/node/1314819)

2. **Campo → Chiusura del turno · La firma della consegna non dice chi
   sorvegliava** · La chiusura registra «chi consegna» e «chi riceve», che sono
   ruoli di passaggio; la norma chiede che a rispondere del turno sia il
   **sorvegliante designato per quel turno**, costantemente presente. Oggi il
   rapporto di fine turno può essere firmato da chiunque abbia in mano il
   telefono, e **le assenze di misura che quel foglio dichiara non hanno un
   autore** · `grep -rniE 'sorvegliante' apps/campo/` → 0 righe; il generatore
   `apps/campo/index.html:4268` scrive «CHIUSURA DEL TURNO — consegnato da X a
   Y» e niente altro sui ruoli · **costo: basso** — un campo in più sulla
   chiusura, alimentato dalle nomine di Scudo attraverso un ponte
   (`shared/dw-ponti.js`, come `ponteScudo` di Sentinella) · **come si misura**:
   nel `.txt` della consegna e nel rapporto stampabile deve comparire una riga
   «Sorvegliante del turno: …» oppure **«sorvegliante non dichiarato»**;
   controprova: con la nomina presente in Scudo ma **scaduta** (`nominaAttiva`
   falso) la riga deve dire che la nomina non è attiva, non lasciare il nome
   liscio. Fonte:
   [Legislazione Tecnica](https://legislazionetecnica.it/node/1314819)

3. **Scudo → Infortuni · I due orologi del 624/96 non sono in app** · Il
   direttore responsabile denuncia **entro 24 ore** all'autorità di vigilanza
   morte o prognosi **oltre 30 giorni**, e **entro la settimana successiva** se
   l'infortunato non è guarito nei 30 giorni previsti. Scudo tiene benissimo la
   prognosi aperta (`prognosiAperta`, `NOTA_PROGNOSI_APERTA`) ma **non sa che
   quella stessa prognosi fa scattare un termine**: un evento con
   `giorniAssenza: null` da 40 giorni resta un numero non contato invece di un
   adempimento in ritardo · `grep -rniE 'entro 24 ore' apps/` → 0 righe;
   `grep -rniE '30 giorni' apps/scudo/` → 9 righe, tutte sulle scadenze ·
   **costo: basso** — una funzione pura sul modello di `statoScadenzaHSE`, con
   il quarto stato «non lo sappiamo» già in casa · **come si misura**:
   `run-kpi.mjs` con quattro casi — morte, prognosi 45 giorni, prognosi ancora
   aperta oltre i 30, prognosi 5 giorni — deve dare quattro risposte diverse, e
   **la prognosi aperta non deve mai dare «nessun obbligo»**. Fonte:
   [Ced Ingegneria — D.Lgs 624/96](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/)

4. **Scudo → Scadenzario · Manca la relazione mensile riassuntiva degli
   infortuni** · È un obbligo ricorrente dell'esercente verso l'autorità di
   vigilanza, e Scudo ha già tutti i dati (`csvRegistroInfortuni`,
   `riepilogoInfortuni`) · `grep -rniE 'mensile|ogni mese' apps/scudo/` → 5
   righe, nessuna sulla relazione · **costo: molto basso** — una voce in
   `SCADENZE_PRESET` con `mesi: 1` e riferimento, più il CSV già esistente
   filtrato sul mese · **come si misura**: la voce compare in
   `coperturaFormazione`/`muroScadenze` con periodicità 1, e il testo del
   preset scrive **«ogni mese»** e non «ogni 1 mesi» (la regola del singolare è
   già stata pagata in `apps/scudo/index.html:5389`). Fonte:
   [DGR Puglia 570/2015](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137)

5. **Terra → Scadenze e Denuncia · Il rilievo periodico non porta il termine né
   la firma che la norma gli dà** · Il DPR 128/59 fissa **fine marzo** per
   consegnare le planimetrie aggiornate **al 31 dicembre precedente**, **firmate
   dal direttore**; il preset `rilievo` di Terra è generico e la Denuncia non
   distingue la comunicazione regionale dei volumi dalla consegna dei rilievi ·
   `grep -rn 'planimetri' apps/` → 2 righe, nessuna sul termine · **costo:
   basso** — nota nel preset + una riga nel prospetto della Denuncia, **senza**
   inventare la periodicità regionale (che `presetScadenzaTerra` marca già
   `daVerificare: true`) · **come si misura**: nel prospetto della Denuncia di
   un anno chiuso deve comparire la data di consegna dei rilievi **oppure**
   «non risulta consegnata»; controprova: senza nessun rilievo elaborato la
   riga non deve dire «regolare». Fonte:
   [Regione Umbria — DPR 128/59](https://www.regione.umbria.it/documents/18/25173917/Allegato+articoli+abrogati+del+DPR+128+59/8ad1a27b-3f46-4dfc-a0e1-efa7eaaaeaa7)

6. **Scudo → DSS · I tredici elementi dell'art. 10 non sono un elenco in app, e
   sono la forma normativa del principio del fondatore** · L'art. 10 pretende
   che per **ciascuno** dei tredici elementi si scriva la soluzione **oppure
   l'assenza di rischio**: è esattamente «l'assenza di un dato non è un dato
   favorevole», scritta in legge. Scudo tratta il DSS come **un documento con
   una data**, non come **tredici caselle di cui nessuna può restare bianca** ·
   `grep -rniE 'assenza di rischio' apps/` → 0 righe · **costo: medio** — una
   costante `ELEMENTI_DSS` con i tredici punti e uno stato a tre valori per
   ciascuno (soluzione dichiarata / assenza di rischio dichiarata / **non
   dichiarato**) · **come si misura**: `cicloDss` su un DSS con dodici elementi
   su tredici compilati deve rispondere **«un elemento non dichiarato»** e non
   «regolare»; e la riga deve reggere la regola 20 di `run-stile` (la bandiera
   va **letta** da qualcuno). ⚠️ Da confermare sul testo di legge prima di
   costruirci sopra: l'elenco a-n viene da una fonte secondaria, la pagina di
   legge **non si è aperta**. Fonte:
   [Ced Ingegneria](https://www.cedingegneria.it/norme-tecniche/sicurezza/sicurezza-e-salute-dei-lavoratori-nelle-industrie-estrattive/)

---

### 5 · Due cose che NON propongo, e perché

- **Il «giornale di cava» come funzione nuova.** La parola non c'è
  (`grep -rniE 'giornale|registro dei lavori|libretto' apps/campo/ apps/terra/`
  → 0 righe), ma la **cosa** c'è due volte in Campo: la consegna in testo e il
  rapporto di fine turno stampabile, che portano rapportini, produzione per
  unità, obiettivo, checklist con le voci senza risposta, meteo, presenze con
  orari, riposo, fermi con i minuti, firme e riaperture. Costruire un
  «giornale» sarebbe la **terza copia**. Il delta vero è di **vocabolario** — le
  frasi devono suonare come le scriverebbe chi lavora in cava — e va misurato
  con gli occhi di un capocantiere, non con un cantiere di codice.
- **Un cruscotto degli adempimenti di polizia mineraria.** Sarebbe la
  quarta cosa che rifà lo scadenzario di Scudo. Le proposte 1, 4 e 5 sono
  **voci dentro quello che esiste**, non una schermata nuova.

### 6 · Che cosa questa ricerca NON ha potuto verificare

- Il **testo di legge** di D.Lgs 624/96 e DPR 128/59 non si è aperto: tutte le
  citazioni di articolo vengono da **fonti secondarie** (linee guida regionali,
  pagine di enti, editori tecnici). Prima di scrivere un riferimento normativo
  nell'interfaccia va riletto sul testo — è la regola che Scudo applica già
  («Nota informativa, non un parere legale»).
- I **modelli regionali** di denuncia di esercizio e statistica mineraria non si
  sono aperti: i campi esatti restano ignoti, e **non vanno dedotti**. Terra ha
  già la nota giusta («il modulo cambia da regione a regione»).
- ⚠️ `RICERCA_CONTINUA_NORME.md` colloca il D.Lgs 624/96 in «Gazzetta Ufficiale
  16 maggio 1996, n. 113»; le fonti di questa tornata lo danno pubblicato nel
  **Supplemento Ordinario della G.U. del 14 dicembre 1996, n. 293**. Una delle
  due date è sbagliata e **non l'ho risolta**: la segnalo qui perché è una
  **prova**, non un verdetto, e le prove che invecchiano rendono non credibile
  la riga giusta che le accompagna.
  ([Wikipedia — DSS](https://it.wikipedia.org/wiki/Documento_di_sicurezza_e_salute) *(non aperta: proxy)*)
