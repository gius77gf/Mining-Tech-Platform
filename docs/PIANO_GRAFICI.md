# Il piano dei grafici delle sei app

**A cosa serve questo documento.** Il fondatore ha chiesto **più grafici,
soprattutto dove ci sono grandi quantità di dati**. Questo documento dice
**quali** grafici fare, **in quale app**, **con quali dati** e — parte
altrettanto importante — **quali NON fare**.

Non contiene codice. È il progetto: si legge prima di scrivere una riga.

**Come è stato scritto.** Ho letto il codice e i dati veri di tutte e sei
le app (`index.html` + `<app>-data.js`), la ricerca sul cruscotto
(`docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md`), le sei schede
`docs/RICERCA_*_202607.md` e le palette (`docs/PALETTE_APP.md`). Ogni
riga delle tabelle dice **se il dato esiste davvero oggi**, non se
sarebbe bello averlo.

**Il risultato in una frase:** venti grafici nuovi in tutto l'ecosistema,
di cui **dieci da fare subito**, più quattro che ci sono già e vanno solo
rifiniti. Tutto il resto — e sono tante idee che sembravano buone — è
scartato con la motivazione scritta.

---

## PARTE 1 — Le sette regole con cui ho giudicato

Sono severe apposta. Un grafico costa lavoro, occupa spazio e, se è
sbagliato, fa **prendere decisioni sbagliate**: è peggio del niente.

### 1. La forma segue il compito

Non si sceglie il grafico "che sta bene": si sceglie quello che risponde
alla domanda. La regola è meccanica.

| Cosa devo far capire | Forma giusta |
|---|---|
| **Quanto è grande** una cosa rispetto a un'altra | barre (l'occhio confronta lunghezze meglio di qualunque altra cosa) |
| **Quale è il peggiore / il più grosso** | barre **orizzontali ordinate**, dalla più lunga |
| **Come cambia nel tempo, a passi** (mesi, giorni, turni) | barre verticali dallo zero |
| **Come cambia nel tempo, con continuità** (una misura ripetuta) | linea |
| **Di cosa è fatto un totale** | una **sola barra impilata**, mai una torta |
| **A che punto sono rispetto a un obiettivo** | barra di avanzamento con la **tacca** dell'obiettivo |
| **La forma di una tendenza, dentro una tessera** | sparkline (mini-linea senza assi) |
| **Un numero solo** | **nessun grafico**: un numero grande |

### 2. Un grafico che non cambia mai, o che ha due dati, non è un grafico

Tre fette, due barre, un valore che si muove una volta l'anno: sono
**tessere**, cioè numeri grandi con una parola di contesto. Disegnarci
sopra un grafico li rende più difficili da leggere, non più chiari.
Nel documento questi casi sono segnati come **«tessera, non grafico»**.

### 3. Mai due assi verticali

Due scale diverse nello stesso riquadro (per esempio minuti di fermo e
tonnellate prodotte) permettono di far dire al grafico qualunque cosa: basta
cambiare una delle due scale e le linee si incrociano dove si vuole. Se
servono due grandezze, si fanno **due grafici uno sopra l'altro**, allineati
sullo stesso asse dei tempi. Costa una riga di HTML in più ed è onesto.

### 4. Le barre partono sempre da zero

L'altezza della barra **è** il valore. Se la base non è zero, le altezze
mentono. Le linee possono partire sopra lo zero (una linea racconta la
forma del cambiamento), ma allora il primo e l'ultimo valore dell'asse
vanno scritti.

### 5. Nessun grafico da solo

Accanto a ogni grafico ci va **scritto il numero che conta**. Chi stampa
in bianco e nero, chi guarda il telefono al sole in piazzale, chi non
distingue bene i colori: tutti devono poter leggere il dato senza il
disegno. Le percentuali portano sempre l'assoluto accanto: «86% (12 su 14)».

### 6. Niente grafici decorativi

Il test: **se questo grafico cambia colore, qualcuno fa qualcosa di
diverso?** Se la risposta è no, il grafico si scarta. Non si aggiunge un
grafico perché «riempie la pagina» o perché «i concorrenti ce l'hanno».
Meglio sei grafici che fanno prendere decisioni che venti che fanno scena.

### 7. Onestà sui dati (la regola che ha tagliato di più)

Molte app avranno **pochissimo storico** finché il cliente non le usa per
mesi. Un grafico dell'andamento con tre punti non è un andamento: è uno
scarabocchio. Quindi ogni grafico di questo documento è classificato:

- 🟢 **funziona dal primo giorno** — basta che il cliente abbia inserito i
  suoi dati di partenza (anagrafiche, scadenze, fatture aperte);
- 🟡 **ha senso dopo settimane** di uso quotidiano;
- 🔴 **ha senso dopo mesi o un anno** di dati.

Per i 🟡 e i 🔴 il documento dice **cosa mostrare nel frattempo**. La
risposta non è mai «un grafico vuoto»: è uno **stato vuoto utile**, cioè
un riquadro che spiega cosa comparirà lì e quanto manca perché compaia
(«servono almeno 5 giornate registrate: ne hai 2»). È esattamente il
meccanismo che le app usano già per le liste vuote.

---

## PARTE 2 — La grammatica comune (uguale in tutte e sei)

Perché venti grafici sembrino **un solo prodotto** e non venti esperimenti.

### 2.1 Due sole taglie

| | **Tessera compatta** | **Grafico grande** |
|---|---|---|
| Dove | dentro il Quadro (la schermata di riepilogo) | nella schermata di dettaglio della sua materia |
| Dimensione | mini-grafico ~64×20 px accanto a un numero grande | larghezza piena della scheda, altezza 150-200 px |
| Assi | nessuno | sì, con le tacche |
| Etichette | nessuna: il numero grande è l'etichetta | sì, diradate quando i punti sono tanti |
| Serve a | far capire in un secondo se va su o giù | far capire **dove intervenire** |

Regola: **nel Quadro non entra mai un grafico grande.** Il Quadro è il
colpo d'occhio; l'approfondimento sta nella sua schermata.

### 2.2 Il calcolo è separato dal disegno

Modello già in casa e già collaudato: `serieStorica()` in
`apps/sentinella/sentinella-data.js` calcola punti, percorso, tacche e
linea di soglia; la pagina si limita a disegnare l'SVG. È il pattern
giusto: la geometria si può collaudare senza aprire un browser. **Tutti i
grafici nuovi seguono questo schema**, e le funzioni di geometria comuni
(barre orizzontali, barre verticali, sparkline, barra con tacca) vanno in
un aiuto condiviso, non copiate sei volte.

### 2.3 SVG puro, nessuna libreria

Vincolo assoluto: nessuna dipendenza esterna, nessuna spesa, pagine
autonome. Sempre `viewBox` + `width:100%; height:auto`, così il grafico si
adatta da solo al telefono. Niente `<foreignObject>`, niente filtri SVG,
niente ombre dentro l'SVG (si comportano male in stampa e su alcuni
telefoni). Massimo ~50 punti: oltre, si aggrega per settimana o per mese.

### 2.4 I colori (da `docs/PALETTE_APP.md`, senza inventare nulla)

| Elemento del grafico | Token |
|---|---|
| barre e linea principale | `--app-accent` (colore base dell'app) |
| seconda serie, riferimento, media | `--app-support2` (il colore di appoggio) |
| **numeri e testo** del grafico | `--app-accent2` — mai `--app-accent`, che non ha contrasto per il testo |
| griglia e assi | `--border` |
| una barra o un punto **fuori norma** | `--danger` / `--warn`, e **solo** in quel caso |
| soglia, limite, obiettivo | linea tratteggiata `--app-support2` con etichetta scritta |

Due regole di colore che non si toccano: **gli stati non si usano come
decorazione** (il rosso vuol dire «fuori norma», non «terza serie»), e **il
colore non è mai l'unica differenza**: sempre anche tratteggio, forma o
etichetta. Spessore delle linee 1,5-2 px: sotto 1 px, su fondo scuro e al
sole, la linea sparisce.

---

## PARTE 3 — I grafici, app per app

Legenda delle colonne: **Priorità** alta/media/bassa · **Difficoltà** S
(mezza giornata) / M (una-due unità di lavoro) / L (più unità, o serve un
dato nuovo) · **Quando** 🟢 subito / 🟡 dopo settimane / 🔴 dopo mesi.

---

### 3.1 SCUDO — sicurezza e personale

**Che tipo di dati ha.** Tante **scadenze** (visite, corsi, patentini,
DPI), pochi **eventi** (infortuni e mancati infortuni). È il contrario di
un'app da grafici di andamento: la sua ricchezza è nel *calendario*, non
nella *serie storica*. Per questo Scudo ha **due** grafici, non sei — ed è
la risposta onesta.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **S1** | Per ogni tipo di adempimento (visita medica, antincendio, primo soccorso, patentini…), quante persone sono in regola, quante scadono entro 30 giorni e quante sono già scadute | «**Su quale adempimento sono scoperto?**» — dice se il problema è tutto sulle visite mediche o sparso su tutto | **Personale**, grafico grande (sostituisce la lista `cop-list`, che oggi dà solo un badge per riga) | **Barre orizzontali impilate**, ordinate dalla peggiore: tre segmenti (in regola · entro 30 gg · scadute) | ✅ Ci sono. `coperturaFormazione()` in `scudo-data.js` restituisce già esattamente questi tre conteggi per tipo | **alta** · S · 🟢 |
| **S2** | Il muro delle scadenze: quante scadenze cadono in ciascuno dei prossimi 12 mesi, con la parte già scaduta a sinistra | «**In che mese mi si accumula il lavoro?**» — permette di raggruppare cinque visite mediche in una mattina invece di rincorrerle una per una | **Scadenze**, grafico grande, sopra la lista | **Barre verticali** dallo zero, una per mese; la colonna «già scadute» in `--danger` staccata a sinistra | ✅ Ci sono: `scadenze.dataScadenza` + `statoScadenza()`. Nessun campo nuovo | **media** · M · 🟢 |
| **S3** | Azioni correttive: quante chiuse sul totale aperto | «**Le cose che ci siamo detti di fare, le stiamo facendo?**» | **Azioni**, in cima | **Barra di avanzamento** (non un grafico): numero grande + barra + «3 su 7 chiuse, 2 fuori tempo» | ✅ Ci sono: `riepilogoAzioni()` | **media** · S · 🟢 |

**Scartati in Scudo, con il motivo**

- **Andamento degli infortuni nel tempo.** Una cava ben gestita ha zero o
  pochissimi eventi l'anno: sarebbe un grafico con due barre. Peggio: un
  grafico degli infortuni **spinge a non dichiarare** gli eventi piccoli,
  che è il contrario di quello che serve. Resta la **tessera «giorni senza
  infortuni»**, che è lo strumento vero usato nelle cave, e che nell'app
  esiste già. Il numero non diventa mai rosso: un contatore azzerato è un
  fatto appena successo, non una colpa da cruscotto.
- **Ciambella delle idoneità** (idoneo / con prescrizioni / non idoneo).
  Tre voci di cui una quasi sempre al 95%: una fetta enorme e due
  fessure. Tessera con i tre conteggi.
- **Documenti per stato** (valido / da rivedere / scaduto). Stesso motivo:
  tre numeri. Tessera.
- **Indici infortunistici** (frequenza, gravità). Servono le **ore
  lavorate**, che nessuna app registra. Non si fanno e non si promettono.

---

### 3.2 CAMPO — operatività di giornata

**Che tipo di dati ha.** È l'app con **più righe al giorno** di tutte:
attività, fermi con i minuti, rapportini di turno con la produzione. È
quindi la prima candidata dei grafici del fondatore — con un però: quei
dati **nascono solo se qualcuno li registra ogni turno**. Al primo giorno
Campo è vuota.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **C1** *(esiste già)* | Dove si è perso tempo oggi: minuti di fermo per causale | «**Cosa mi ha fermato la cava stamattina?**» | **Quadro**, grafico grande — c'è già (`fermi-pareto`) | **Barre orizzontali ordinate** — forma già corretta | ✅ `paretoFermi()` | rifinitura · S · 🟢 |
| **C2** | Minuti di fermo totali per giornata, ultimi 14 giorni | «**Sto peggiorando o migliorando?**» — un fermo brutto capita, tre settimane di fermi è un problema di manutenzione | **Attività**, grafico grande | **Barre verticali** dallo zero, una per giorno | ✅ `attivita.data` + `attivita.fermoMin`. Nessun campo nuovo | **media** · M · 🟡 (servono ~10 giornate) |
| **C3** | Produzione per turno negli ultimi 14 giorni: una colonna per giorno, divisa in mattina / pomeriggio / notte | «**Quale turno rende meno, e sempre lo stesso?**» — è la domanda che porta a spostare una squadra o un mezzo | **Rapportini**, grafico grande | **Barre verticali impilate** (tre segmenti = tre turni) | ✅ `rapportini` ha `data`, `turno`, `prodQta`, `prodUnita`. ⚠️ **Tonnellate e metri cubi non si sommano**: un grafico per unità di misura, mai mischiate (`totaliProduzione()` già le tiene separate) | **media** · M · 🟡 |
| **C4** | Piano di carico: di quanto la carica **reale** di ogni foro si è scostata dal progetto | «**Ho caricato come previsto? Quali fori sono fuori?**» — è il controllo che il fochino fa a mano oggi | **Attività** (riquadro piano di carico), grafico grande | **Barre verticali** con lo **zero al centro** (scostamento in più sopra, in meno sotto), bande di tolleranza al 10% e al 25% disegnate dietro | ✅ `pianocarico.prog` e `.reale` esistono e `scartoPct()`/`scartoLivello()` sono già scritte. ⚠️ Il piano si popola solo importando il CSV: senza import il riquadro resta vuoto | **alta** (quando c'è il dato) · M · 🟢 se il piano è importato |
| **C5** | Avanzamento della giornata e squadre che hanno consegnato il rapportino | «**Quanto manca alla fine del turno?**» | **Quadro** | **Barre di avanzamento**, non grafici | ✅ `avanzamentoGiornata()`, `coperturaRapportini()` | **media** · S · 🟢 |

**Scartati in Campo**

- **Ciambella degli stati delle attività** (pianificata / in corso /
  conclusa / anomalia). Quattro fette che cambiano ogni ora: illeggibile e
  inutile. La **barra di avanzamento** di C5 dice la stessa cosa meglio.
- **Grafico delle squadre operative/ferme.** Sono tre o quattro squadre:
  si contano a occhio. Tessera.
- **Curva cumulativa di Pareto** (la linea che sale fino al 100% sopra le
  barre). È un secondo asse travestito, e le barre già ordinate dicono
  esattamente la stessa cosa. Al massimo si scrive accanto a ogni barra la
  sua percentuale sul totale.

---

### 3.3 FLOTTA — mezzi e manutenzione

**Che tipo di dati ha.** Anagrafica mezzi (stato di **adesso**, non
storico), manutenzioni programmate, ricambi, e due tabelle di soldi:
`costi` (voce + importo, **senza data**) e `interventi` (ordini di lavoro
chiusi, **con data, mezzo e costo**). La seconda è la miniera d'oro che
oggi non viene usata per niente.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **F1** | Dove va la spesa della flotta: quanto pesa ogni voce (carburante, ricambi, noleggi…) | «**Dove se ne vanno i soldi?**» — cambia su cosa si tratta col fornitore | **Costi**, grafico grande | **Barre orizzontali ordinate**, importo scritto in fondo a ogni barra | ✅ `ripartizioneCosti()` calcola già voce, importo e percentuale. **Oggi il risultato è una riga di testo**: «Carburante 66% · Ricambi 25% …» | **alta** · S · 🟢 |
| **F2** | Quanto è costato di officina ogni singolo mezzo, dal più caro | «**Quale macchina mi sta mangiando i soldi?**» — è la domanda che porta a decidere se ripararla o sostituirla | **Mezzi**, grafico grande | **Barre orizzontali ordinate** (un mezzo per riga) | ✅ `interventi` ha `mezzo` e `costo`. Serve una funzione di raggruppamento nuova (non un campo nuovo) | **alta** · M · 🟡 |
| **F3** | Spesa di officina mese per mese | «**La manutenzione mi sta costando sempre di più?**» | **Costi**, grafico grande, sotto F1 | **Barre verticali** dallo zero, un mese per colonna | ⚠️ **Solo dagli `interventi`**, che hanno la data. Le voci di `costi` **non hanno data**: con quelle il grafico è impossibile. → *Manca: un campo `data` sulla voce di costo* | **media** · M · 🔴 |
| **F4** | Com'è messo il parco adesso: operativi / in verifica / fermi | «**Quanti mezzi posso mandare al fronte stamattina?**» | **Quadro**, tessera compatta | **Una sola barra impilata** larga quanto la scheda + numero grande della percentuale + il riferimento di settore scritto accanto | ✅ `disponibilitaFlotta()` e `mezzi.stato` | **media** · S · 🟢 |
| **F5** | Ricambi: giacenza rispetto alla scorta minima | «**Cosa devo ordinare oggi?**» | **Manutenzioni**, dentro la lista | **Barra di riempimento** per riga (il CSS esiste già), non un grafico | ✅ `sottoScorta()` | **bassa** · S · 🟢 |

**Scartati in Flotta**

- **Andamento della disponibilità dei mezzi nel tempo.** Flotta salva lo
  **stato di adesso**, non la storia: non esiste «com'era la disponibilità
  a giugno». Disegnare una linea con un punto solo, o peggio ripetere il
  valore di oggi all'indietro, sarebbe **inventare dati**. *Manca: una
  fotografia giornaliera automatica (una riga al giorno: data, operativi,
  totale).* Fino ad allora resta F4, che dice la verità: la fotografia di
  oggi.
- **Ciambella della ripartizione dei costi.** È la tentazione numero uno
  di tutte le app gestionali. L'occhio confronta male gli angoli e malissimo
  le fette adiacenti; con più di quattro voci diventa un mosaico. F1 dice
  la stessa cosa in metà spazio e senza legenda.
- **Ore motore per mezzo.** Un mezzo con 9.000 ore non è «peggio» di uno
  con 3.000: sono macchine diverse comprate in anni diversi. Il numero
  utile è *quante ore mancano al prossimo tagliando*, e per quello c'è già
  `prioritaOperative()`, che dà **una lista ordinata**: una lista di sei
  righe non ha bisogno di diventare un grafico.

---

### 3.4 CONTI — amministrazione

**Che tipo di dati ha.** L'app con i calcoli più maturi del repo:
invecchiamento del credito, previsione incassi mese per mese, esposizione
per cliente, interessi di mora. Tre di questi calcoli **oggi finiscono in
liste con una barretta dietro**: sono grafici già per tre quarti.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **N1** | Invecchiamento del credito: quanto è fermo da 1-30, 31-60, 61-90, oltre 90 giorni | «**Quanto del mio credito è vecchio?**» — sotto i 60 giorni si telefona, sopra i 90 si cambia strategia | **Report** (già lì) come grafico grande, **e** una versione a **una sola barra impilata** nel **Quadro** | **Barre orizzontali** per fascia | ✅ `agingIncassi()` dà conteggi e importi. La lista con la barretta esiste già: va portata a barre vere con l'asse | **alta** · S · 🟢 |
| **N2** | Liquidità attesa nei prossimi 6 mesi, mese per mese | «**Con cosa ci pago gli stipendi di settembre?**» | **Report**, grafico grande | **Barre verticali** dallo zero, un mese per colonna — il tempo va in orizzontale, per questo qui la lista non basta | ✅ `incassoPerMese()`. Le fatture già scadute restano **fuori** dal grafico (sono un sollecito, non un'entrata prevista): il calcolo lo fa già | **alta** · S · 🟢 |
| **N3** | I clienti più esposti, dal più grosso, con quanto è già scaduto e dove sta il fido | «**Chi chiamo per primo, e chi ha già sforato il fido?**» — l'esposizione concentrata è il rischio vero | **Clienti**, grafico grande (primi 8 clienti) | **Barre orizzontali ordinate**, ogni barra divisa in «a scadere» e «già scaduto», con una **tacca verticale** sul fido | ✅ `esposizioneClienti()` restituisce già totale, scaduto, fido e il flag `oltreFido` | **alta** · M · 🟢 |
| **N4** | Emesso e incassato, mese per mese, negli ultimi 12 mesi | «**Incasso davvero quello che fatturo?**» — è la domanda della liquidità, diversa da «quanto ho fatturato» | **Report**, grafico grande | **Due barre affiancate** per mese (emesso · incassato), **stessa unità, un solo asse** | ⚠️ Metà: `fatture.emessa` c'è, ma **`incassata` è solo sì/no, senza la data**. Oggi si può fare solo l'emesso. → *Manca: un campo `dataIncasso` sulla fattura.* È un campo, non un progetto | **media** · M · 🔴 |
| **N5** | Gare: aperte, vinte, perse e il tasso di vittoria | «**Quante ne vinco?**» | **Gare**, in cima | **Tessera, non grafico**: tre numeri e una percentuale | ✅ `gareRiepilogo()` | **bassa** · S · 🟢 |

**Scartati in Conti**

- **Torta delle gare vinte/perse.** Due fette che si muovono tre volte
  l'anno. E finché le gare decise sono meno di dieci, la percentuale è
  rumore: `gareRiepilogo()` fa già la cosa giusta restituendo `null`
  quando non c'è ancora niente di deciso.
- **Fatturato cumulato dall'inizio.** Sale sempre. È il numero di vanità
  per eccellenza: fa piacere e non fa fare niente.
- **DSO (giorni medi di incasso).** Richiede il fatturato del periodo, che
  Conti non ha — il codice lo dichiara esplicitamente. Si scrive **«età
  media del credito»**, che è quello che sappiamo davvero. Chiamarlo DSO
  davanti a un commercialista sarebbe una figuraccia.

---

### 3.5 SENTINELLA — ambiente e monitoraggi

**Che tipo di dati ha.** È l'**unica app con un vero storico**: ogni punto
di misura porta l'elenco delle letture con data e valore, e ogni punto ha
la sua soglia. È il terreno naturale dei grafici, ed è anche l'app che ne
ha già uno fatto bene.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **T1** *(esiste già)* | Serie storica di un punto di misura, con la soglia tratteggiata e i superamenti marcati | «**Questo punto sta peggiorando o è stato un caso isolato?**» | **Monitoraggi**, grafico grande, si apre sotto la voce di lista | **Linea** nel tempo + linea di soglia | ✅ `serieStorica()` — il grafico meglio fatto del repo | **alta** (estensione) · S · 🟢 |
| **T2** | Lo stesso grafico del punto **peggiore**, in miniatura | «**C'è qualcosa fuori norma proprio adesso?**» | **Quadro**, tessera compatta | **Sparkline** (nessun asse) + numero grande del valore e della soglia | ✅ Riuso di `serieStorica()` con geometria ridotta | **alta** · S · 🟢 |
| **T3** | Quante volte ogni punto ha superato la sua soglia negli ultimi 12 mesi | «**Quale sensore mi dà problemi davvero?**» — distingue il punto critico dal punto sfortunato una volta | **Monitoraggi**, grafico grande, sopra l'elenco | **Barre orizzontali ordinate**, un punto per riga | ✅ Le `letture[]` e le soglie ci sono; serve una funzione di conteggio nuova | **media** · M · 🔴 |
| **T4** | Esplosivo impiegato mese per mese, con il numero di volate scritto sopra ogni colonna | «**Quanto sto usando, e quando si concentra?**» — serve per i registri e per parlare col fornitore | **Registri**, grafico grande | **Barre verticali** dallo zero — **un solo asse**: i kg sono le barre, il numero di volate è un'etichetta, mai una seconda linea con la sua scala | ✅ `volate` ha `data` e `kgTotali` | **media** · M · 🔴 |
| **T5** | Taratura del sito: ogni volata come un punto, con la distanza scalata sull'orizzontale e la vibrazione misurata sulla verticale | «**Con questa carica, a questa distanza, quanto tremerà?**» — è la domanda che oggi si risponde con una formula generica invece che con i dati della propria cava | **Monitoraggi**, grafico grande | **Dispersione** (nuvola di punti) con la linea di tendenza. *È l'unica eccezione alla tabella delle forme: quando la domanda è «che relazione c'è fra due grandezze», la nuvola di punti è l'unica forma che risponde* | ❌ **Manca il legame**: le `volate` hanno carica e distanza, i `monitoraggi` hanno le letture, ma **niente collega la lettura alla volata che l'ha prodotta**. → *Manca: un campo `volataId` sulla lettura (oppure il valore misurato sulla volata).* Serve anche un minimo di **venti volate misurate** perché la nuvola dica qualcosa | **alta** come valore · L · 🔴 |

**Nel frattempo, per T5:** la formula della distanza scalata è già
implementata (`scaledDistance()`, `caricaMax()`). La tessera «carica
massima consigliata per questa distanza» funziona **oggi** e dice
onestamente che è una stima generica; il grafico la sostituirà con la
misura della cava vera. Questo è l'esempio migliore di stato vuoto utile:
non un riquadro vuoto, ma il calcolo prudente in attesa del dato.

**Scartati in Sentinella**

- **Ciambella conformi / in attenzione / in superamento.** Tre numeri, di
  cui uno quasi sempre grande e due quasi sempre a zero. Tessera.
- **Tutte le misure di tutti i punti su un unico grafico.** Unità diverse
  (mm/s, dB(A), µg/m³, mg/l): non stanno sullo stesso asse, e metterle
  insieme richiederebbe due o tre assi verticali. Vietato dalla regola 3.
  Un punto, un grafico.

---

### 3.6 TERRA — estrattivo e rilievo

**Che tipo di dati ha.** Pochi record ma **pesanti**: ogni rilievo vale
decine di migliaia di metri cubi, e c'è un tetto assoluto (il volume
autorizzato) che non si può superare. È l'app dove un grafico può evitare
una violazione, non solo dare un'informazione.

**Attenzione a una cosa:** i rilievi si fanno una volta al mese o meno.
Quindi **mai una linea giornaliera**: si aggrega per mese e si usano le
barre. Una linea fitta suggerirebbe una continuità di misura che non c'è.

| # | Cosa mostra | A quale domanda risponde | Dove va | Forma | Dati | Prio · Diff · Quando |
|---|---|---|---|---|---|---|
| **R1** | Metri cubi estratti mese per mese, con la riga orizzontale del ritmo che servirebbe per stare nel piano annuale | «**Sto tenendo il ritmo del piano?**» — e se non lo tengo, da quale mese ho cominciato a perderlo | **Rilievi**, grafico grande | **Barre verticali** dallo zero + **una linea tratteggiata** del pro-quota mensile | ✅ `rilievi` (data, `volumeM3`, `stato: elaborato`) + `piano.pianificatoAnnuoM3` | **alta** · M · 🟡 (servono ~4 mesi) |
| **R2** | A che punto è l'anno rispetto a dove dovrebbe essere oggi, e dove si chiuderà al ritmo attuale | «**A fine anno sforo l'autorizzato o resto sotto?**» — è la differenza fra una telefonata al consulente a settembre e una multa a dicembre | **Quadro**, tessera compatta | **Barra con tacca** (avanzamento + tacca dell'obiettivo + segno della proiezione) | ✅ `proiezioneAnnua()` calcola già estratto, frazione d'anno, proiezione e semaforo | **alta** · S · 🟢 |
| **R3** | Estratto **cumulato** dall'inizio del titolo, con la riga del volume totale autorizzato e la proiezione tratteggiata in avanti | «**Quando finisco il volume concesso? E arriva prima l'esaurimento o la scadenza dell'atto?**» — la domanda esistenziale del titolare di cava | **Titolo**, grafico grande | **Area cumulata** nel tempo + linea del limite + prolungamento tratteggiato | ✅ `vitaCava()`, `estrattoComplessivo()`, `ritmoMedioAnnuo()` fanno già tutti i conti, compreso il confronto con la scadenza dell'atto | **alta** · M · 🔴 (serve ~1 anno di rilievi) |
| **R4** | Quanti metri cubi sono usciti da ciascun fronte | «**Da dove sta uscendo davvero il materiale?**» — spesso non è il fronte che si crede | **Fronti**, grafico grande | **Barre orizzontali ordinate** | ✅ `volumeFronte()` esiste; i rilievi hanno `fronteId`. ⚠️ I rilievi vecchi senza `fronteId` vanno mostrati come «non assegnato», non nascosti | **media** · S · 🟢 |
| **R5** *(esiste già)* | Vita della cava: quanto del volume autorizzato è già stato estratto, con la tacca della soglia di guardia | «**Quanto mi resta?**» | **Titolo**, in cima | **Barra di avanzamento con tacca** — già fatta e fatta bene | ✅ `vitaCava()` | non toccare · — · 🟢 |

**Nel frattempo, per R1 e R3:** finché i mesi con dati sono meno di
quattro, al posto del grafico va lo stato vuoto che dice **quanto manca**:
«L'andamento compare con almeno 4 mesi di rilievi: ne hai 2». E intanto R2
e R5, che funzionano dal primo rilievo, dicono già la cosa più importante.

**Scartati in Terra**

- **Ciambella dei fronti.** Tre o quattro fronti: barre ordinate (R4),
  che si leggono e si ordinano.
- **Grafico dell'avanzamento percentuale dei fronti.** È già una barretta
  dentro ogni riga della lista, ed è il posto giusto: sta accanto al nome
  del fronte a cui si riferisce.
- **Linea giornaliera dei volumi.** Vedi sopra: i rilievi non sono
  giornalieri. Disegnare una linea continua fra due punti distanti un mese
  è una bugia grafica.

---

## PARTE 4 — I dieci grafici da fare per primi

Ordinati per **valore diviso lavoro** su tutto l'ecosistema. I primi
quattro si fanno con funzioni che **esistono già**: è quasi solo disegno.

| # | App | Grafico | Perché sta qui | Diff. |
|---|---|---|---|---|
| **1** | **Flotta** | Dove va la spesa — barre orizzontali ordinate (F1) | Il calcolo c'è già ed è **già a schermo come riga di testo**. Il salto da «Carburante 66% · Ricambi 25%» a quattro barre ordinate è il massimo guadagno per unità di lavoro di tutto il piano | S |
| **2** | **Conti** | Previsione incassi 6 mesi — barre verticali (N2) | `incassoPerMese()` è già scritta e testata. Oggi è una lista: il tempo va letto in orizzontale | S |
| **3** | **Terra** | Avanzamento anno con tacca dell'obiettivo (R2) | Piccolo, sta nel Quadro, e risponde alla domanda che può evitare una violazione dell'autorizzato | S |
| **4** | **Scudo** | Copertura formazione per tipo — barre impilate (S1) | Dice in un colpo d'occhio dove l'azienda è scoperta davanti a un'ispezione. `coperturaFormazione()` restituisce già i tre numeri per riga | S |
| **5** | **Conti** | Esposizione per cliente con tacca del fido (N3) | Fa fare una telefonata precisa, oggi stesso. È il grafico che «vale soldi» in senso letterale | M |
| **6** | **Sentinella** | Il punto peggiore in miniatura nel Quadro (T2) | Riuso puro di `serieStorica()`: l'unico storico vero del repo entra nella schermata più vista | S |
| **7** | **Flotta** | Costo di officina per mezzo (F2) | Usa gli `interventi`, che oggi nessuna schermata sfrutta. Porta alla decisione più cara che un titolare prende: riparo o sostituisco | M |
| **8** | **Terra** | Volumi per mese con la riga del pro-quota (R1) | È il grafico che la scheda di Terra chiede da tempo. Vale il lavoro anche se si riempie in qualche mese | M |
| **9** | **Campo** | Scostamento della carica per foro (C4) | Alto valore tecnico e dati già modellati; dipende dall'import del piano, quindi non prima | M |
| **10** | **Conti** | Invecchiamento del credito a barre + barra impilata nel Quadro (N1) | Rifinitura di qualcosa che già funziona: giusto farla, ma dopo le cose che oggi non esistono affatto | S |

**Il primo dei successivi**, per completezza: la **taratura del sito** di
Sentinella (T5, la nuvola di punti carica-distanza / vibrazione). È
probabilmente il grafico di **maggior valore commerciale dell'intero
ecosistema** — nessun concorrente dà al cliente la curva della *sua* cava —
ma richiede un campo nuovo e mesi di misure, quindi non può stare fra i
primi dieci. Il campo però conviene aggiungerlo **subito**, così i dati
cominciano ad accumularsi mentre si fa il resto.

---

## PARTE 5 — Cosa NON fare

Idee che sembrano buone, e che invece sono trappole. In ordine di
pericolosità.

### 1. La ciambella (o la torta) della ripartizione dei costi

**Perché sembra buona:** ce l'hanno tutti i gestionali, e «fa cruscotto».
**Perché è una trappola:** l'occhio confronta bene le lunghezze e male gli
angoli. Con tre fette è inutile (tanto vale scrivere i numeri), con più di
quattro è illeggibile, e in tutti i casi serve una legenda che costringe a
spostare lo sguardo avanti e indietro. Le **barre orizzontali ordinate**
dicono la stessa cosa in metà spazio, con l'etichetta attaccata alla barra.
*Vale per Flotta (costi), Conti (gare), Scudo (idoneità), Sentinella
(conformità), Terra (fronti): sono cinque tentazioni, tutte scartate.*

### 2. Il doppio asse verticale

**Perché sembra buono:** «così vedo se i fermi fanno calare la
produzione».
**Perché è una trappola:** con due scale indipendenti si può far incrociare
le curve dove si vuole. Un grafico che si può regolare fino a dire quello
che si voleva sentire non è una misura, è un'opinione disegnata. Se
servono due grandezze: **due grafici uno sopra l'altro**, stesso asse dei
tempi, allineati. Costa una riga di HTML.

### 3. Gli andamenti costruiti su dati che non esistono

**Perché sembra buono:** la schermata sembra più ricca subito.
**Perché è una trappola:** è l'unico errore di questo elenco che fa
prendere decisioni sbagliate su numeri inventati. Due casi concreti nel
nostro repo:
- l'**andamento della disponibilità dei mezzi** (Flotta salva lo stato di
  adesso, non la storia);
- l'**andamento dei costi** dalle voci di `costi`, che non hanno data.

In entrambi i casi la strada giusta è la stessa: si dice cosa manca (una
fotografia giornaliera; un campo data), si mostra intanto la fotografia di
oggi — che è vera — e il grafico arriva quando arriva il dato.

### 4. Il grafico dell'andamento degli infortuni

Oltre a essere quasi sempre un grafico con due barre, ha un effetto
perverso noto a tutti gli addetti alla sicurezza: **se la curva diventa
una prestazione da esibire, gli eventi piccoli smettono di essere
dichiarati** — e i mancati infortuni sono proprio quelli che permettono di
prevenire quelli veri. Resta la tessera «giorni senza infortuni».

### 5. Il tachimetro (la lancetta da cruscotto d'auto)

**Perché sembra buono:** è bello e sembra professionale.
**Perché è una trappola:** occupa lo spazio di sei tessere per dire **un
numero solo**, e la posizione dell'ago non aggiunge niente alla cifra
scritta. La **barra con tacca** dice le stesse cose — valore, obiettivo,
zona buona e zona cattiva — in un decimo dello spazio.

### 6. La sparkline con tre punti

Una mini-linea serve a far vedere una **forma**. Con tre punti non c'è
forma: c'è uno zigzag che a seconda della scala sembra un crollo o una
risalita. Regola: **niente sparkline sotto i sei punti**; sotto, solo il
numero e la parola («in crescita», «stabile»).

### 7. La linea continua su misure sporadiche

Unire con una linea due rilievi distanti un mese fa credere che in mezzo
ci sia stata una progressione regolare. Non lo sappiamo. Misure sporadiche
→ **barre**, una per periodo.

### 8. La curva cumulativa sopra il Pareto

La classica linea che sale fino al 100% sopra le barre ordinate: è un
secondo asse mascherato, e non aggiunge niente che le barre già ordinate
non dicano. Se serve la quota, si scrive la percentuale accanto a ogni
barra.

### 9. I totali che salgono e basta

Fatturato dall'inizio, tonnellate dall'inizio, documenti caricati, volate
registrate. Salgono sempre, per costruzione. Non c'è nessun valore di quel
grafico che faccia fare qualcosa di diverso. (Il conteggio dei documenti
caricati, poi, misura l'uso del software, non l'andamento della cava.)

### 10. Il grafico vuoto

Un riquadro con gli assi e niente dentro dice al cliente «questa app non
funziona». Uno stato vuoto scritto bene dice «questo comparirà, ed ecco
quanto manca». Il secondo costa uguale e vende il prodotto invece di
affossarlo.

---

## PARTE 6 — I cinque dati che mancano (riepilogo)

Ogni riga è **piccola** e sblocca almeno un grafico. Sono elencate
nell'ordine in cui conviene farle.

| # | Cosa aggiungere | Dove | Cosa sblocca |
|---|---|---|---|
| 1 | Il valore di vibrazione misurato agganciato alla volata (`volataId` sulla lettura, o il valore sulla volata) | Sentinella | **T5**, la taratura della cava — il grafico di maggior valore dell'ecosistema. Da fare **subito** anche se il grafico arriva fra mesi: i dati devono cominciare ad accumularsi |
| 2 | Un campo `data` sulla voce di costo | Flotta | **F3** (andamento della spesa) e, più avanti, il costo per tonnellata |
| 3 | Un campo `dataIncasso` sulla fattura | Conti | **N4** (emesso contro incassato) e un domani il calcolo dei giorni medi reali di incasso |
| 4 | Una fotografia giornaliera del parco (data, operativi, totale) | Flotta | L'andamento della disponibilità, oggi impossibile |
| 5 | Il `fronteId` obbligatorio sui rilievi nuovi | Terra | **R4** più preciso (oggi i rilievi vecchi restano «non assegnato») |

---

## Fuori perimetro

- **Genesi**: salva solo nel browser e ha una palette ancora da definire.
  I suoi grafici si progettano dopo che i dati sono su Firestore come nelle
  altre app.
- **Il Quadro dell'hub** (il cruscotto del titolare): il suo progetto sta
  in `docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md`. Vale una sola aggiunta a
  questo documento: **nel cruscotto entrano solo tessere compatte e
  sparkline**, mai i grafici grandi di questo piano. I grafici grandi si
  raggiungono con un tocco, restando nella loro app.

---

*Documento di progettazione. Non contiene codice: la realizzazione avviene
nelle unità di lavoro, un grafico alla volta, con verifica affiancata al
riferimento e almeno tre iterazioni prima di considerarlo finito.*

---

## ⚠️ Aggiornamento del 29/07 — due grafici non sono più impossibili

Questo piano dichiarava impossibili, per mancanza di dati, l'**andamento
dei costi** e l'**andamento della disponibilità dei mezzi** in Flotta.
**Quei dati ora esistono**: alla voce di costo è stato aggiunto il campo
data, ed è stata introdotta una fotografia giornaliera del parco mezzi
(una riga al giorno con operativi e totali). I due grafici sono stati
fatti.

Restano valide, e vanno rispettate, le regole con cui sono stati fatti:
- **niente linea**, solo barre: una linea unirebbe due periodi lontani con
  un tratto continuo, cioè disegnerebbe i giorni in cui nessuno ha aperto
  l'app;
- i **periodi senza registrazioni non compaiono** e vengono contati a
  parole («mancano 3 giorni: in quei giorni l'app non è stata aperta, non
  sono zeri»);
- **nessuna tendenza sotto i tre periodi**;
- il confronto fra mesi si fa **solo fra mesi chiusi**.

Resta invece impossibile, e non va fatto, l'**emesso-contro-incassato** in
Conti: sulle fatture vecchie la data di incasso è ripiegata sulla data di
emissione, quindi il grafico mostrerebbe numeri inventati. Si sblocca solo
registrando la data di incasso vera.
