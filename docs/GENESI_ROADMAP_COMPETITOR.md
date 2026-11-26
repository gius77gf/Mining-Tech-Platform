# Genesi — dove siamo vs i big, e cosa aggiungere (roadmap con fonti)

Data: 2026-07-21 · Per Giuseppe (parte semplice) e per lo sviluppo (parte
tecnica). Richiesta del fondatore (21/07): «voglio raggiungere il loro livello,
magari qualcosa in meno, ma non ci dobbiamo allontanare tanto». Confronto di
Genesi con i principali software di blast-design + **roadmap concreta di
funzioni**, ordinata per impatto/fattibilità, distinguendo cosa si può fare
**nel browser** (client) e cosa richiede un **backend**.

> Metodo: ricerca web sui competitor e sulla letteratura (fonti in fondo) +
> verifica di cosa Genesi ha GIÀ leggendo il codice (`apps/genesi/genesi.html`).
> Le affermazioni sui competitor vengono dalle loro pagine/articoli; le
> raccomandazioni sono nostre.

> ⛔ **RILETTO E CORRETTO IL 12/09 (unità 128) — QUESTO DOCUMENTO ERA
> INVECCHIATO SUI DUE PUNTI PIÙ IMPORTANTI CHE PROPONEVA.** Stavo per aprire
> un cantiere su "P0.2 Signature-hole": grep prima di scrivere codice
> (`grep -n "sommaRitardata\|ondaDaCsv" apps/genesi/genesi-data.js`) ha
> trovato la funzione già scritta, testata (2 test, 40 asserzioni in
> `run-kpi.mjs`) e
> **wired in pagina** (`sigFile`/`sigImport`/`sigRender`, con tanto di testo
> che cita "il metodo dei big (Orica AVM)"). Controllando per lo stesso
> motivo anche P0.1 e P1.1: **entrambe fatte pure loro**
> (`confrontoPerForo` con un pannello vero "Foro per foro — progetto aperto
> contro consuntivo"; `h.burdenVero` da `distanzaDaSpezzata` sul fronte 3D,
> con la riga rossa/ambra quando si scosta dal nominale). Tre "gap" su
> sei di questo documento erano già chiusi, e nessuno aveva aggiornato la
> riga che li proponeva — è la regola di CLAUDE.md *"chi chiude un'unità
> aggiorna la riga del documento che gliel'aveva proposta"*, qui violata da
> chi (unità imprecisate, prima del 12/09) le ha chiuse senza tornare qui.
> Il documento sotto è stato **riscritto per riflettere lo stato vero**,
> non solo annotato: la versione originale del 21/07 proponeva P0.1/P0.2
> come "da fare" e la Sintesi le chiamava "il gap più grande" — chi avesse
> letto solo quelle due righe avrebbe aperto un cantiere su lavoro fatto.

## ⛔ 26/11 — Dove sta davvero il distacco dai concorrenti, rimisurato sul codice (e il piano che ne segue)

*Richiesta del fondatore, 26/11: «dobbiamo trovare il modo di portare Genesi
al livello dei concorrenti». Fonti: la ricerca approfondita dello stesso
giorno (`reports/Genesi formati di scambio cava.md`) e il delta fatto
aprendo le funzioni (`docs/RICERCA_CONTINUA_GENESI.md`, sezione 26/11).*

**In due righe (per Giuseppe).** Sui CALCOLI Genesi regge il confronto: la
sintesi qui sotto resta vera. Il distacco è altrove, in due posti che questo
documento finora non nominava: **(1) in Genesi tutti i fori di una volata
sono uguali** — una sola profondità, una sola carica, un solo borraggio, un
solo diametro, una sola inclinazione — mentre in ogni programma concorrente
ogni foro ha i suoi valori, ed è lì che un tecnico lavora tutti i giorni;
**(2) Genesi non entra nel passaggio di file della cava** (GPS, perforatrice,
sonda), perché non sa dove si trova nel cantiere.

**Che cosa è stato deciso il 26/11.** Il punto (2) — l'aggancio al cantiere e
gli scambi di file — è **rimandato dal fondatore** (decisione 32), e file
veri di strumenti non ce ne sono. Resta il punto (1), che non ha bisogno né
di file né di aggancio, ed è la base di tutto il resto: una tabella di fori
da scambiare ha senso solo se i fori possono essere diversi.

### La prova del punto (1), perché nessuno lo riscopra a parole
- I parametri sono del PROGETTO: `D2.prof`, `D2.kg`, `D2.stem`, `D2.diam`,
  `D2.incl` (campi `dH`, `dKg`, `dStem`, `dD`, `dIncl` della scheda).
- Le proprietà che il codice scrive su un singolo foro sono posizione, tempi
  e misure derivate (`mx`, `my`, `tDet`, `tMano`, `relief`, `burdenLoc`,
  `burdenVero`…): nessuna carica, nessuna profondità.
- `micFinestra(holes, kg)` riceve UN `kg` per tutta la volata; il piano di
  carico (`genesi_piano_carico.csv`) e l'XML scrivono la stessa profondità e
  la stessa carica su ogni riga.
- Quanto è largo il lavoro, contato: `D2.kg` compare 48 volte nella pagina,
  `D2.prof` 41, `D2.stem` 44, `D2.diam` 25, `D2.incl` 14. Non è un'unità, è
  un cantiere a fette.

### Il piano, a fette che non rompono niente
Regola del fondatore rispettata: **le formule non si toccano** — cambia
quali numeri ricevono. Ogni fetta lascia i progetti esistenti identici,
perché un foro senza valori suoi continua a usare quelli del progetto.

| Fetta | Che cosa | Che cosa vede l'utente |
|---|---|---|
| F1 ✅ 26/11 | Il foro può portare valori suoi (carica, profondità, borraggio), letti da una funzione sola che ripiega sul progetto (`valoreDiForo`); salvati e riaperti col progetto; il piano di carico li scrive già riga per riga | Niente ancora (nessun comando per darli: è F3). Provato che i progetti esistenti escono identici |
| F2 ✅ 26/11 (i conti) | La carica massima per ritardo (MIC) ✅ 26/11 somma le cariche VERE dei fori (`micFinestra`, identica alla cifra senza cariche proprie). La carica totale vera ✅ 26/11 nel report e nella scheda volata (`scartoCaricheProprie`); anche nella scheda dei costi e nel registro per Sentinella (stesso giorno); e nel campo «Esplosivo totale», che ora regge nei due versi; e nella scheda dei numeri principali (quando i fori in pianta sono quanti la griglia): tutti e sei i punti che mostrano la carica totale dicono lo stesso numero. Volume servito e consumo specifico per foro ✅ 26/11 (piano di carico e mappa a colori). Metri perforati veri ✅ 26/11. Resta solo la domanda di modello, decisione 33: frammentazione e simulazione 3D prendono una carica sola per la volata. ⛔ Per strada: la maglia non si rigenera più a ogni parametro toccato (prima un ritocco al borraggio cancellava i fori modificati a mano) | I numeri della scheda seguono i fori modificati |
| F3 ✅ 26/11 | Il comando: nella scheda del foro tre campi (carica, profondità, borraggio); con più fori scelti (Maiusc+clic) la scheda è quella della selezione e ciò che si scrive vale per tutti. Un valore uguale a quello del progetto non resta «proprio» (il foro torna a seguirlo); il borraggio non può essere più lungo del foro (tutto o niente); «↺ valori del progetto» li toglie in un colpo; si annulla; coi fori bloccati non si scrive. Sulla pianta un foro con valori suoi ha un rombo (una forma, non un colore). Accanto alla X50 prevista compare «foro tipo» finché la frammentazione non legge le cariche per foro (decisione 33) | Il gesto che ogni concorrente ha: c'è. ⚠️ Limite dichiarato: i tre campi sono nella scheda sotto la tela, non ancora in una tabella (F4) |
| F4 ✅ 26/11 | Tabella dei fori sotto la scheda del foro (si apre e si chiude): una riga per foro con numero, x, spalla, ritardo, carica, profondità, borraggio. Le tre ultime si scrivono nella cella con la STESSA regola della scheda (`applicaValoreForo`); si ordina per ogni colonna (l'ordine è della vista: i fori non si spostano); toccando il numero si apre la scheda di quel foro; i fori con valori loro hanno il rombo. A 430 px ci sta intera; sotto i 380 px restano a schermo le tre colonne che si scrivono | La vista che un tecnico si aspetta: c'è. ⚠️ Limiti dichiarati: x, spalla e ritardo nella tabella si leggono soltanto (si cambiano dalla scheda); nessun incolla da foglio di calcolo; con un centinaio di fori la tabella aperta si ridisegna intera a ogni modifica (non misurato oltre i 12 fori della dimostrazione) |
| F5 ✅ 26/11 (i file) | Piano di carico CSV ✅ (F1). **Piano d'innesco XML ✅ 26/11**: ogni `<Hole>` porta i suoi valori, il progetto è dichiarato a parte, e il file si rilegge (i valori per foro tornano sui fori per posizione; ciò che non torna si conta). DXF dei fori: porta solo posizione e diametro, niente da correggere. **`.volata.json` ✅ 26/11**: ogni foro esce con la sua carica, la sua profondità e (se suo) il suo borraggio. **Resta** la scena 3D: la simulazione usa il foro tipo e lo dichiara («◆ foro tipo»); farle usare i valori di ogni foro è la decisione 33 | I file che escono dicono la verità: tutti e tre |
| F6 | Diametro e inclinazione per foro (toccano la geometria 3D: per ultimi) | Fori di prima fila inclinati, fori di contorno più piccoli |

### Dopo, nell'ordine in cui conviene
1. **Nuvola di punti LAZ** — è il formato con cui esce di default
   OpenDroneMap; oggi Genesi lo rifiuta (con un messaggio chiaro) e legge
   solo LAS. Non dipende da nessuna decisione.
2. **DXF: blocchi inseriti, archi, tratti curvi** — oggi dichiarati e non
   letti; l'oracolo per farli giusti c'è già (`dxf-da-cad.mjs`).
3. **Aggancio al cantiere e scambio dei fori** (decisione 32, rimandata).
4. **Pezzatura da foto** (P2.1 qui sotto) e **modello ML** (P2.2): restano
   dove stavano.

### Due righe di questo documento e della matrice che erano troppo generose
- «Export IREDES-like … già presente»: il file esiste, ma ha un formato
  privato che rilegge solo Genesi. Non è interoperabilità con le
  perforatrici: quella vuole il `DRPPlan` vero, un file reale su cui
  provarlo e l'aggancio.
- «Import MWD»: non esiste (già tolto da qui il 12/09; nella matrice c'era
  ancora).

## In due righe (per Giuseppe)
Buona notizia: Genesi è **più avanti di quanto sembri** — più avanti di quanto
dicesse questo stesso documento fino al 12/09. Oltre a simulare la
frammentazione (con la **previsione delle vibrazioni**, la **sovrappressione**,
la MIC, il confronto detonatori, il flyrock, i fori bagnati, il presplit, il
confronto A/B), Genesi **chiude già il cerchio col dato reale** su due dei tre
fronti che separano un simulatore da uno strumento "da cava vera": confronta
il previsto con **com'è andata davvero** foro per foro (riconciliazione), e
calibra le vibrazioni su una **registrazione sismografica vera** invece della
sola legge empirica (signature-hole). Manca ancora la **pezzatura misurata da
una foto** del cumulo — quello resta il gap vero.

## Cosa ha GIÀ Genesi (punti di forza — verificati nel codice, rimisurati il 12/09)
- **Frammentazione**: Kuz-Ram (rock-factor di **Lilly/Cunningham**), **KCO/
  Swebrec** (x50/xmax, fini e blocco massimo), curva granulometrica, e
  l'inversione del modello (obiettivo di pezzatura → carica necessaria,
  `caricaDaX50Target`, unità 126/127).
- **Vibrazioni**: PPV al recettore con **legge di Devine/USBM** (`PPV=K·SD^−β`,
  K/β stimati per tipo di roccia), **MIC** = massima carica entro finestra 8 ms
  raggruppando i fori sui ritardi reali, distanza scalata, confronto con la
  soglia di norma e badge di rischio — **e** la calibrazione su una
  registrazione sismografica vera (**signature-hole**: `ondaDaCsv` importa il
  CSV tempo-ampiezza, `sommaRitardata` somma le copie ritardate sui tempi di
  detonazione della volata corrente e stima il PPV composito, affiancato a
  Devine nella pagina).
- **Riconciliazione previsto-vs-reale, foro per foro**: `confrontoPerForo`
  accoppia ogni foro del progetto aperto alla sua riga di consuntivo (per id
  quando disponibile, per numero altrimenti — dichiarato), con un pannello
  vero in pagina ("Foro per foro — progetto aperto contro consuntivo") che
  mostra progetto→reale, scarto e badge di stato per ciascuno.
- **Burden reale dal 3D del fronte**: `distanzaDaSpezzata` calcola la distanza
  perpendicolare vera foro↔fronte sulla ricostruzione 3D (non il burden
  nominale di progetto), salvata per foro (`h.burdenVero`) e segnalata in
  pagina quando si scosta dal nominale oltre 15 cm (rosso se il burden vero è
  sotto l'85% — il caso classico delle proiezioni).
- **Airblast** (sovrappressione), **flyrock** (gittata + anelli di sgombero),
  **presplit**, **confronto A/B**, **fori bagnati** (colonna d'acqua, RWS
  ridotto), **detonatori elettronici vs elettrici** (scatter, effetto su X50/PPV),
  **timing/sequenze**, **ricostruzione 3D da foto** del fronte (con deviazione
  del fronte/piede *simulata* — non un import di rilievo reale, vedi gap #2
  sotto), **export IREDES-like** del piano di innesco, export CSV/PDF.
  ⛔ *"Import MWD" è stato tolto da questa riga il 12/09: cercato (`grep -n
  "MWD" apps/genesi/*.{html,js}`) e non trovato — zero occorrenze. Non era un
  "non c'è" scaduto, era scritto così dal 21/07 senza che nessuno l'avesse
  verificato nel codice: la regola "niente entra sulla parola dell'agente"
  vale anche per ciò che RESTA scritto, non solo per ciò che entra.*

## Cosa hanno i big che a noi MANCA (i gap reali, rimisurati il 12/09)
1. **Validazione frammentazione da immagine** — Orica **FRAGTrack**, **WipFrag**,
   **Split**: foto del muckpile → curva granulometrica **reale** da confrontare
   con la previsione. Genesi ha la curva prevista, non quella misurata dalla
   foto. ← il gap più importante rimasto (era #3, ora #1: i due che lo
   precedevano sono chiusi).
2. **AI/ML per frammentazione/flyrock/backbreak** — differenziatore recente
   (XGBoost R²≈0,82; ensemble ANN-RF per frammentazione **e** vibrazione),
   input burden/spaziatura/powder factor/sottoperforazione/UCS. Pesante.

⛔ **Chiusi, e tolti da questo elenco il 12/09** (erano qui dal 21/07, mai
riverificati nel codice fino ad ora): *riconciliazione previsto-vs-reale*
(era il gap #1, vedi `confrontoPerForo` sopra — resta aperto solo lo
**storico multi-volata** persistito, non il confronto in sé) e
*signature-hole* (era il gap #2, vedi `sommaRitardata` sopra).

⛔ **E CHIUSO ANCHE QUESTO, LO STESSO GIORNO, DALLO STESSO BLOCCO CHE AVEVA
APPENA CORRETTO IL DOCUMENTO** — riscoperto solo grazie alla regola "chi
chiude un'unità aggiorna la riga del documento che gliel'aveva proposta":
*deviazione fori "as-drilled" (boretrack)*, era il gap #2 qui sopra fino a
poche ore dopo questa stessa riletta. `deviazioneForiDaCsv` (parser CSV
`foro/id;dx_m;dy_m`) + `burdenVeroDaRilievo` (ricalcola il burden vero
usando le posizioni MISURATE, non simulate, sulla stessa perpendicolare al
fronte 3D di `distanzaDaSpezzata`) sono state scritte nella stessa giornata
(unità 129), wired in pagina (`📡 Importa rilievo deviazione fori`, pannello
foro-per-foro progetto→vero con lo scarto colorato). ⚠️ **Con un limite da
dichiarare**: la descrizione originale del gap parlava di mostrare il
rilievo "nel 3D accanto a quello simulato" — oggi il confronto è un
**pannello numerico** per foro (burden progetto → burden vero), non un
overlay visivo 3D del profilo as-drilled accanto a quello simulato. La
sostanza del gap (dato reale invece che solo simulato, con ricalcolo del
burden) è chiusa; l'overlay 3D resta un'estensione a sé, non fatta.

## Roadmap proposta (per impatto/fattibilità) — rinumerata il 12/09 sui soli punti ancora aperti

### ✅ Fatte (verificate nel codice il 12/09, non solo dichiarate)
- **Riconciliazione previsto-vs-reale, foro per foro** — `confrontoPerForo` +
  pannello in pagina. Resta aperto solo lo **storico multi-volata persistito**
  (oggi il confronto vive nella sessione del progetto aperto, non in un
  archivio Firestore multi-volata): se servirà, è un'estensione a sé, non una
  funzione nuova.
- **Signature-hole (superposizione d'onda)** — `ondaDaCsv` + `sommaRitardata`,
  2 test dedicati e 40 asserzioni in `run-kpi.mjs` (contate riga per riga,
  non a memoria), wired in pagina (bottone import + pannello di stima PPV
  composito).
- **Burden reale per foro dal 3D del fronte** — `distanzaDaSpezzata` +
  `h.burdenVero`, con segnalazione in pagina quando si scosta dal nominale.
- **Export ai detonatori + IREDES** *(bozza)*: XML `BlastPlan` stile IREDES
  dal Progetto 2D, dichiarato "non conformità certificata".
- **Import deviazione fori (boretrack)** — `deviazioneForiDaCsv` +
  `burdenVeroDaRilievo` (unità 129), pannello foro-per-foro
  progetto→burden vero. Manca solo l'overlay visivo 3D del profilo
  as-drilled accanto al simulato (estensione a sé, non fatta).

### P2 — Differenziante ma pesante (backend/dati)
- **P2.1 Frammentazione da immagine del muckpile** *(client base / backend per
  ML)*: foto del cumulo → segmentazione blocchi → curva granulometrica reale;
  confronto con Kuz-Ram/KCO. Versione base (watershed) nel browser; versione
  precisa (tipo WipFrag) con ML → backend/GPU. Si integra con la
  riconciliazione già fatta come "pezzatura reale" da affiancare al previsto.
  ← **l'unico gap rimasto dei tre "chiudi il cerchio"**, ancora del tutto
  assente. Decisione pendente del fondatore: #28 in `docs/DECISIONI_WEEKEND.md`.
  Ricerca di mondo raccolta (metodi, software di riferimento, librerie
  open-source realizzabili in browser, limiti noti) in
  `docs/RICERCA_CONTINUA_GENESI.md`, sezione 12/09 sulla frammentazione da
  foto — nessun confronto col codice fatto lì, solo il mondo.
- **P2.2 Modello ML di frammentazione/vibrazione** *(backend per il training,
  client per l'inferenza)*: XGBoost/rete su dati reali; il modello leggero gira
  **nel browser**. Serve un dataset e un passo di training offline.

## Cosa NON inseguire (per ora)
- Riscrivere il **motore fisico**: è già solido (Kuz-Ram/KCO, Lilly, Devine,
  flyrock, fori bagnati verificati). Le nuove funzioni si AGGIUNGONO attorno,
  senza toccarlo (regola del fondatore).
- Feature "enterprise" (flotte perforatrici live, integrazioni proprietarie):
  fase commerciale.

## Sintesi *(riscritta il 12/09, corretta di nuovo lo stesso giorno)*
Genesi è già un simulatore forte, con vibrazioni e airblast inclusi — e chiude
**già** il cerchio col dato reale su riconciliazione, signature-hole **e**
deviazione fori as-drilled (boretrack), contrariamente a quanto diceva la
prima riscrittura di questa riga la mattina stessa. L'**unico** gap vero che
resta, per "raggiungere il loro livello", è **P2.1 — la pezzatura misurata da
una foto** (bloccato sulla decisione #28, non ancora presa), seguito da
P2.2 (ML) come differenziante successivo, pesante. Nessuno dei due tocca il
motore fisico.
⚠️ *Nota per chi rilegge questa riga in futuro: è la STESSA sezione che il
12/09 ha dovuto correggersi due volte in poche ore (prima P0.1/P0.2/P1
scoperte già fatte, poi P1.1). Non è un segno che il documento sia
inaffidabile — è la prova che la regola "chi chiude un'unità aggiorna la
riga del documento che gliel'aveva proposta" funziona solo se viene
davvero applicata: qui non lo era stata, per unità precedenti a questa
sessione.*

## Fonti
- Orica SHOTPlus / BlastIQ / Advanced Vibration Management / FRAGTrack:
  https://www.orica.com/digital-solutions/blast-design-and-execution/shotplus ·
  https://www.orica.com/digital-solutions/blast-design-and-execution/blastiq ·
  https://im-mining.com/2021/04/15/latest-orica-software-predicts-vibration-airblast-outcomes-protect-sensitive-structures-maximise-blast-outcomes/
- Maptek BlastLogic (riconciliazione, as-drilled, single source of truth):
  https://www.maptek.com/products/blastlogic/
- Maxam RIOBLAST (moduli vibrazioni/frammentazione/flyrock, MWD):
  https://fundacionmaxam.com/en/fundacion/catedra_maxam/blasting_solutions/design_and_simulation_of_blasts_rioblast
- Strayos (AI, drone/fotogrammetria, Rock Mass AI, post-blast):
  https://strayos.com/ ·
  https://blog.strayos.com/webinar-summary-after-the-blast-measuring-blast-performance-with-drones-and-ai/
- O-Pitblast (DTM da drone/laser, O-PitDev deviazione, O-PitAnalytics):
  https://teamarmaan.com/o-pitsurface/
- Frammentazione Kuz-Ram modificato / KCO / Swebrec:
  https://www.sciencedirect.com/science/article/abs/pii/S1365160909000811 ·
  https://www.scielo.org.za/scielo.php?script=sci_arttext&pid=S2225-62532021000300004
- Signature-hole + superposizione d'onda + detonatori elettronici:
  https://www.researchgate.net/publication/392327397_An_integrated_approach_of_signature_hole_vibration_monitoring_and_modeling_for_quarry_vibration_control ·
  https://www.sciencedirect.com/science/article/abs/pii/S1365160921001994
- ML per frammentazione/flyrock/backbreak (XGBoost, ensemble ANN-RF):
  https://link.springer.com/article/10.1007/s40033-024-00812-7 ·
  https://www.nature.com/articles/s41598-025-33871-1
- Face profiling / burden reale / boretrack:
  https://www.hsa.ie/eng/your_industry/quarrying/drilling_and_blasting/face_profiling_and_drill_hole_logging/
- IREDES (standard dati, MWD→carica):
  https://iredes.org/architecture-2/ · https://en.wikipedia.org/wiki/IREDES
