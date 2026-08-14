# RICERCA CONTINUA — Vocabolario di mestiere (Cave italiane)

Questo documento raccoglie l'evoluzione del vocabolario tecnico usato in Deepwork per descrivere i processi in una cava italiana. Ogni blocco di ricerca dichiara il commit verificato e accumula proposte di miglioramento (mai cancellando quelle precedenti).

---

> # ⛔ RIVERIFICA DEL COORDINATORE (03/08) — LA PARTE BUONA È IL VOCABOLARIO, UNA PROPOSTA SU DUE È FALSA
>
> *Regola 4 della ricerca continua: niente entra sulla parola dell'agente. Ho
> riaperto i file prima di committare.*
>
> ✅ **La metà buona, ed è la metà che conta**: il censimento dei termini regge.
> «Fronte», «banco», «volata», «rilievo», «lotto», «turno», «rapportino»,
> «squadra» sono le parole giuste, e il documento non ne trova **nessuna**
> sbagliata nelle nostre app. Un risultato negativo misurato vale quanto una
> mancanza trovata — e questo era il dubbio vero, perché i testi li ha scritti
> chi in cava non ci lavora.
>
> ⛔ **La Proposta 2 è FALSA**: «Genesi non dichiara se la volata sarà
> sequenziale o simultanea». Genesi ha un selettore **«Sequenza di sparo»** con
> quattro voci — `genesi.html:663`, `<select id="dSeq">`: riga per riga,
> diagonale (echelon), V-cut, box cut — e la scelta **entra nel calcolo dei
> ritardi** (`genesi.html:1466-1467`: il V-cut e il box partono dal centro
> verso i lati, la riga è quasi simultanea). Cioè non solo la dichiariamo: ci
> calcoliamo sopra. L'agente non ha mai cercato «Sequenza di sparo»: è
> esattamente il difetto contro cui esiste l'obbligo della prova.
>
> ⚠️ **La Proposta 1 regge** — `grep -c "statoVolata\|stato_volata"
> apps/campo/campo-data.js apps/campo/index.html` → **0 e 0** — ma va letta per
> quello che è: non una parola sbagliata, un modo diverso di **raggruppare** le
> fasi. Prima di costruirla va deciso se serve davvero o se aggiunge un secondo
> posto dove dire una cosa che le fasi già dicono; e in ogni caso l'accordo con
> Genesi, che il ciclo lo conosce, viene prima.
>
> ⛔ **E due citazioni sono state tolte da questo documento**: il ritardo in
> millisecondi con il numero di riferimento del fondatore. Il vincolo è assoluto
> e vale anche per i documenti interni: quei dati non si scrivono, si usano solo
> per i calcoli.

---

## Blocco 1: Come chiama le cose chi lavora davvero in una cava italiana? (03/08/2026, commit 9a6689d)

**Data della ricerca:** 03/08/2026  
**Commit verificato:** 9a6689d

### I. MONDO — Vocabolario di mestiere con fonti

#### Fronte di scavo e sue parti

| Termine | Cosa indica | Fonte | Sinonimi/Varianti |
|---------|------------|-------|------------------|
| **Fronte di scavo** / "fronte di cava" | La parete rocciosa in escavazione | D.Lgs 152/2006 | "parete" |
| **Banco** | Il livello orizzontale di uno scavo (piano di escavazione a una certa quota). **NON** è la parete, è lo STRATO | Manuali ANEPLA | — |
| **Scarpata** / "ciglio" | La superficie inclinata della parete tra due banchi | D.Lgs 152/2006 | — |
| **Piazzale** | La zona piatta dove si accumulano i materiali estratti (cumuli) | Uso comune Nord Italia | — |

#### Fasi della volata (brillamento)

| Termine | Cosa indica | Fonte | Uso |
|---------|------------|-------|-----|
| **Volata** / "brillamento" / "scoppio" | L'atto di detonare gli esplosivi nel fronte per frammentare la roccia | D.P.R. 128/1959 | "prossima volata alle 12:30" |
| **Perforazione** | Processo di creazione dei fori per inserire esplosivi | — | "perforazione in corso" |
| **Foro** (pl. "fori") | Il singolo buco praticato nella roccia | — | "14/22 fori", "carica del foro" |
| **Carica** | Quantità di esplosivo in un singolo foro o in tutta la volata | D.P.R. 128/1959 | "carica per ritardo" (brillamento sequenziale) |
| **Sequenza di sparo** / "sequenziale" | L'ordine e i tempi di detonazione dei fori | Manuali perforazione/brillamento | "volata sequenziale" vs "simultanea" |
| **Ritardo** | Intervallo di tempo tra lo sparo di un foro e il successivo | D.P.R. 128/1959 | «ritardi in millisecondi fra un foro e il successivo» |

#### Mezzi (macchine e attrezzature)

| Termine | Cosa indica | Fonte |
|---------|------------|-------|
| **Pala meccanica** | Mezzo di carico (escavatore) | Uso comune |
| **Dumper** | Autocarro da cantiere per trasporto interno | Uso comune |
| **Autocarro** | Camion per trasporto su strada pubblica | — |
| **Perforatrice** | Macchina per praticare i fori (a colonna, girevole, jumbo) | — |
| **Compressore** | Fornisce aria compressa alla perforatrice | — |
| **Caricatrice frontale** | Mezzo di carico su ruote | — |
| **Rullo compressore** | Per il costipamento | — |
| **Frantumatore** / "impianto di frantumazione" | Per la riduzione della granulometria | — |

#### Materiali e litologia

| Termine | Cosa indica | Fonte |
|---------|------------|-------|
| **Sabbia e ghiaia** | Aggregati non cementati | D.Lgs 152/2006 |
| **Calcatura** / "roccia calcarea" | Roccia carbonatica (pietra da costruzione) | — |
| **Porfido** | Roccia ignea per ballast ferroviario | — |
| **Basalto** | Roccia vulcanica per asfalti e ballast | — |
| **Detriti** | Materiale di risulta della lavorazione, frammentato | — |
| **Filler** | Sabbia fine da frantumatore | — |

#### Documenti e rapporti

| Termine | Cosa indica | Fonte |
|---------|------------|-------|
| **Rapportino** / "rapporto di fine turno" | Documento di sintesi di un turno (tonnellate estratte, ore lavorate, attività) | Uso comune Italia |
| **Verbale di rilievo** | Documento che accompagna un rilievo topografico (chi ha misurato, data, metodo) | D.Lgs 152/2006 |
| **Atto di concessione** / "autorizzazione" / "atto di coltivazione" | Decreto che autorizza la cava | Diritto regionale |
| **Piano di coltivazione** | Documento progettuale (come, dove, quando si scava) | Prescrizione standard atti concessione |
| **Verbale di collaudo** | Documento di verifica che la coltivazione rispetta il piano | Normativa regionale |

#### Tempi di lavoro e cicli

| Termine | Cosa indica | Fonte |
|---------|------------|-------|
| **Turno** | Periodo di lavoro (mattina, pomeriggio, notte) | Uso comune |
| **Squadra** / "equipaggio" | Gruppo di operai assegnati a un turno | Uso comune |
| **Ciclo di volata** | Sequenza dalla perforazione allo sparo allo scavo del materiale frammentato | **DEDOTTO** |

#### Guasti, fermi e anomalie

| Termine | Cosa indica | Fonte |
|---------|------------|-------|
| **Fermo macchina** / "guasto" | Arresto non pianificato di un mezzo | Uso comune |
| **Incidente** | Evento che causa danno a persone o cose | D.Lgs 66/2003 |
| **Non conformità** | Situazione che non rispetta il piano o la norma | Uso comune gestionale |
| **Verifica di stabilità** | Controllo della scarpata | D.Lgs 152/2006 |

---

### II. DELTA — Confronto con il nostro codice

**File verificati:**  
`apps/campo/index.html`, `apps/terra/index.html`, `apps/genesi/genesi-data.js`, `apps/terra/terra-data.js`, `/index.html` (core)

**Vocabolario GIUSTO (usiamo i termini corretti):**

| Termine | Dove lo usiamo | Comando grep | Uscita | Stato |
|---------|----------------|-------------|--------|-------|
| **Fronte** (Fronte Nord, Fronte Est...) | apps/terra | `grep -n "Fronti di cava" apps/terra/index.html` | `480:  <div class="sec">Fronti di cava</div>` | ✓ CORRETTO |
| **Banco** (banco 1, banco 2...) | apps/terra, terra-data.js | `grep -n 'banco:' apps/terra/terra-data.js \| head -1` | `52:    { id: "f1", nome: "Fronte Nord", banco: "banco 2", ...` | ✓ CORRETTO |
| **Volata** (prossima volata...) | apps/terra | `grep -n 'volata' apps/terra/terra-data.js \| head -1` | `52:    ...dettaglio: "Prossima volata 12:30"...` | ✓ CORRETTO |
| **Perforazione** | apps/terra | `grep -n 'Perforazione' apps/terra/terra-data.js` | `53:    ...dettaglio: "Perforazione in corso · 14/22 fori"...` | ✓ CORRETTO |
| **Fori** (14/22 fori) | apps/terra | `grep -n 'fori' apps/terra/terra-data.js \| head -1` | `53:    ...14/22 fori"...` | ✓ CORRETTO |
| **Rilievo** (rilievo drone...) | apps/terra | `grep -n 'Rilievo drone' apps/terra/terra-data.js` | `100:    { id: "r1", titolo: "Rilievo drone 15/07"...` | ✓ CORRETTO |
| **Lotto** (Lotto 1, Lotto 2...) | apps/terra | `grep -n 'Lotto' apps/terra/terra-data.js \| head -1` | `67:    { id: "lo1", nome: "Lotto 1 — settore Ovest"...` | ✓ CORRETTO |
| **Turno** | apps/campo | `grep -n 'turno' apps/campo/index.html \| head -1` | `202: orari veri del turno, per persona` | ✓ CORRETTO |
| **Rapportino** | apps/terra | `grep -n 'RAPPORTINI DI TURNO' apps/terra/terra-data.js` | `137: // I RAPPORTINI DI TURNO che in esercizio arrivano da Campo` | ✓ CORRETTO |
| **Squadra** | apps/campo | `grep -n 'squadra in turno' apps/campo/index.html` | `656: ...title="Vedi le squadre in turno"...` | ✓ CORRETTO |
| **Scarpata** | apps/terra | `grep -n 'scarpata' apps/terra/index.html` | `97: ...della scarpata." }` | ✓ CORRETTO |

**Cose che MANCANO (cercate a vuoto):**

| Cosa manca | Dove dovrebbe stare | Comando cercato | Risultato | Ragione |
|-----------|-------------------|-----------------|-----------|---------|
| **"Ciclo di volata"** (come fase completa perforazione→sparo→carico) | Quadro Campo | `grep -n 'ciclo' apps/campo/index.html` | NESSUN RISULTATO | Manca il naming della sequenza completa del ciclo |
| **"Sequenziale"** (volata sequenziale vs simultanea) | Genesi, o Campo per pianificazione | `grep -n 'sequenz' apps/campo/index.html` | NESSUN RISULTATO | Genesi calcola vibrazioni ma non dichiara il tipo di sequenza |
| **"Diurno/Notturno"** (descrizione formale del turno) | Impostazioni cava o turno | `grep -n 'diurno\|notturno' apps/campo/index.html` | NESSUN RISULTATO | Generico, ma potrebbe mancarne la dichiarazione |

**Cose che ESISTONO con nomi alternativi (NON sono errori):**

| Nostra parola | Parola "formale" | Dove usiamo la nostra | Comando grep | Conclusione |
|---------------|-----------------|----------------------|-------------|-----------|
| **Autorizzazione** | "Atto di concessione" | apps/terra | `grep -n 'numeroAtto' apps/terra/terra-data.js` | ✓ ACCETTABILE (meno formale ma usato) |
| **Piano estrattivo** | "Piano di coltivazione" | apps/terra | `grep -n 'Piano estrattivo' apps/terra/index.html \| head -1` | ✓ ACCETTABILE (entrambi usati in mestiere) |
| **"Lotto"** + **"Settore"** | —— | apps/terra | `grep -n 'settore' apps/terra/terra-data.js` | ✓ CORRETTO (usiamo entrambi in sinergia) |

---

### III. PROPOSTE (Formato: schermata · che cosa non va · come si vede · quanto costa · come si misura)

#### Proposta 1: Aggiungere "stato ciclo di volata" a Campo
- **Schermata:** Quadro Campo (riepilogo attività giornaliera), sezione "Fronte Est"
- **Che cosa non va:** Chi legge "Perforazione in corso · 14/22 fori" non sa in quale fase del ciclo siamo (finito perforare? Pronti a sparare? Già caricato?)
- **Come si vede:** Un operatore direbbe "il ciclo della volata è al 60%"; le nostre app lo dicono passo per passo ma non come FASE UNICA
- **Quanto costa:** Aggiungere un campo booleano o enum "statoVolata" con stati: `previsto | perforazione | pronto-sparo | sparato | caricamento | concluso`
- **Come si misura:** Verificare che Campo permetta di dichiarare lo stato completo del ciclo, non solo attività separate; controllare che il Quadro lo mostri accanto alle fasi

#### Proposta 2: Dichiarare tipo di sequenza volata in Genesi
- **Schermata:** Genesi, scheda di progettazione della volata (dove si inseriscono carica, ritardi, ecc.)
- **Che cosa non va:** Genesi calcola PPV assumendo una sequenza (Devine: carica per ritardo), ma non dichiara esplicitamente se la volata sarà sequenziale o simultanea
- **Come si vede:** Un progettista dichiara il tipo di sequenza accanto al calcolo
- **Quanto costa:** Aggiungere un campo select "Tipo di sequenza" con opzioni: `sequenziale | simultanea | ritardi variabili`; ricalcolare PPV se cambia
- **Come si misura:** Verificare che il verbale di volata (export Genesi) contenga la scelta di sequenza; controllare che i calcoli cambino se si sceglie "simultanea" (PPV più alta)

**Nessun errore di vocabolario riscontrato.** Il nostro uso di termini è **essenzialmente corretto** e allineato al mestiere. Le mancanze sono **concettuali** (naming di fasi composite, non di parole). La proposta di miglioramento è di **esplicitare il ciclo completo** come entità unica operativa, non di correggere parole sbagliate.


---

> # ⛔ RIVERIFICA 14/08 (commit `92276aff`) — IL BLOCCO 2 ARRIVA DALLO SCRATCHPAD DI UN AGENTE MORTO, E UNA SUA RIGA È FALSA
>
> **Provenienza, dichiarata perché conta:** il Blocco 2 qui sotto **non l'ho
> scritto io**. L'ha scritto un agente di ricerca il 13/08 che è morto sul
> limite di sessione **prima di poterlo consegnare**; il testo è rimasto in
> `scratchpad/ricerca-parole/coda.md` e lo porto dentro qui **integro**, perché
> il lavoro è buono e buttarlo sarebbe stato il costo peggiore. Quello che
> aggiungo è la **riverifica**, che lui non ha fatto in tempo a fare.
>
> ⚠️ **Il documento dichiarava il commit `5fae710a`; oggi il ramo è a
> `92276aff`, avanti di 11 commit, 4 dei quali toccano le superfici.** Ho
> rilanciato **tutti** i comandi del Blocco 2. Esito onesto:
>
> ✅ **Undici conti su dodici sono identici a HEAD** — «non misurato/mai
> misurato» **112**, «non rilevato» **0**, «non calcolabile» **117**, «mancato
> infortunio» **15**, «presunto» **0**, «tout-venant» **0**,
> «sterile|cappellaccio» **0**, «formulario» **0**, «cava di prestito» **0**,
> «verificato in partenza|da verificarsi a destino» **0**, «sfrido» **6**.
> Cioè il Blocco 2 **non è invecchiato**: si può leggere come scritto.
>
> ⛔ **UNA RIGA È FALSA, E NON ERA SCADUTA: ERA SBAGLIATA QUANDO È STATA
> SCRITTA.** La riga «`abbancament|ripristino ambientale` → **0**» (tabella
> II.2, e ci poggia la **Proposta 6**) a HEAD dà **1**. Ma non è un «non c'è»
> scaduto: `git show 5fae710a:shared/dw-ponti.js | grep -c 'Ripristino
> ambientale'` → **1**. C'era già **quel giorno**, in quel commit, nel file che
> il documento dichiara di aver misurato.
>
> ⛔ **La causa è il RIGHELLO, e vale la pena scriverla perché si rifà da
> sola: la pipe SCAPPATA dentro `grep -E` non è un'alternativa, è un carattere
> letterale.** Provato nei due versi sullo stesso albero:
> `grep -rEoi shared -e 'abbancament|ripristino ambientale'` → **1**;
> `grep -rEoi shared -e 'abbancament\|ripristino ambientale'` → **0**.
> Il `\|` serve a `grep` *base*, e in `-E` cerca il carattere `|` in mezzo alle
> parole: non trova mai niente, **e non fallisce**. È esattamente la famiglia
> già scritta in `CLAUDE.md` — *un censimento che cerca un nome risponde «non
> c'è» con la stessa faccia con cui direbbe la verità* — con l'aggravante che
> qui il nome era giusto e a mentire era la **sintassi del comando**.
> ⚠️ **E il danno è circoscritto, perché va detto quanto è grande:** le altre
> righe con la pipe reggono lo stesso (`sterile|cappellaccio` dà **0** in
> tutt'e due i modi, verificato). Il difetto morde **solo** dove una delle due
> metà avrebbe fatto centro — cioè solo dove c'era qualcosa da trovare, che è
> il verso peggiore.
>
> ⛔ **Conseguenza sulla Proposta 6, che va letta corretta:** «ripristino» in
> casa **non manca affatto** — `grep -rEoi … -e 'ripristin'` → **32**
> occorrenze, e una di quelle è una **voce di costo dell'ecosistema**
> (`shared/dw-ponti.js:880`, `{ chiave: "ripristino", etichetta: "Ripristino
> ambientale", gruppo: "concessione" }`), cioè il concetto è già modellato e
> condiviso fra le app. Restano veri, e li ho rimisurati, i due «non c'è» che
> la proposta usa davvero: **`abbancament` → 0** e
> **`sterile|cappellaccio` → 0**. Quindi la Proposta 6 **non cade**, ma il suo
> «quanto costa» cambia: non è «introdurre il ripristino», è «nominare lo
> **sterile**», e va scritta accanto alla voce di costo che **esiste già**.
>
> ✅ **E un numero che sembrava sbagliato era giusto: il righello ero io.**
> `624/96` in Scudo: il Blocco 2 dice **36**, la mia prima misura diceva 29.
> La sua è quella buona — 29 sono le **righe** di `scudo-data.js`, 36 sono le
> **occorrenze** (`grep -o … | wc -l`), che è quello che il documento
> dichiarava di contare. Lo scrivo perché è la lezione di sempre: *quando una
> misura non torna, il sospettato più facile è il soggetto, ed è quasi sempre
> il righello* — e stavolta il righello era il mio.


---

## Blocco 2: come si dice, su un registro vero, che un dato NON c'è (13/08/2026, commit 5fae710a)

**Data della ricerca:** 13/08/2026
**Commit verificato:** `5fae710a` (branch `claude/scheduled-tasks-remote-control-bk4ap6`)
**Agente:** ricerca continua — vocabolario di mestiere, seconda tornata

### 0. CHE COSA C'ERA GIÀ IN QUESTO DOCUMENTO (obbligo di lettura, regola 1)

Prima di scrivere una riga ho letto tutto il file. Il **Blocco 1 (03/08, commit
9a6689d)** più la **riverifica del coordinatore** contengono già:

- il vocabolario del **fronte** (fronte di scavo, banco, scarpata/ciglio, piazzale);
- il vocabolario della **volata** (volata/brillamento, perforazione, foro, carica,
  sequenza di sparo, ritardo);
- **mezzi** (pala, dumper, autocarro, perforatrice, compressore, frantumatore),
  **materiali** (sabbia e ghiaia, calcare, porfido, basalto, detriti, filler),
  **documenti** (rapportino/rapporto di fine turno, verbale di rilievo, atto di
  concessione, piano di coltivazione), **tempi** (turno, squadra), **guasti**;
- il **delta già misurato**: undici termini nostri dichiarati CORRETTI con il
  comando e l'uscita, e la conclusione «nessun errore di vocabolario riscontrato»;
- **Proposta 1** (stato del ciclo di volata in Campo) — riverificata e ancora
  aperta, ma con la riserva del coordinatore;
- **Proposta 2** (tipo di sequenza in Genesi) — **dichiarata FALSA** dal
  coordinatore: `<select id="dSeq">` esiste e i suoi valori entrano nel calcolo.

⛔ **Quindi qui NON ritratto niente di tutto questo.** Questo blocco copre solo
gli argomenti che il Blocco 1 non tocca: **pesa e vendita**, **sicurezza**,
**materiali di scarto**, e soprattutto la domanda che il mandato mette al primo
posto — **come si scrive che un dato non è stato misurato**.

⚠️ **Limite dichiarato dello strumento**: la rete risponde alla ricerca, ma
**quasi tutte le pagine istituzionali sono negate al fetch**
(`EGRESS_BLOCKED`: `parlamento.it`, `arpal.liguria.it`, `atlantelavoro.inapp.org`,
`proactive-info.it`). Dove non ho potuto aprire la pagina cito **il link
canonico** e uso il testo che la ricerca ha restituito, e **lo dico**. Ogni
deduzione mia è marcata `[dedotto]`.

---

### I. MONDO — come si dice fuori

#### I.1 ⭐ Il punto che vale più di tutti: in italiano tecnico «non c'è» sono QUATTRO parole diverse, e non sono sinonimi

Questa è la scoperta del blocco, e ribalta il modo in cui si legge la nostra
domanda. Chi compila un registro vero in Italia ha a disposizione **quattro
diciture distinte**, e usarne una per l'altra è un errore di sostanza:

| Dicitura | Che cosa dice davvero | Dove vive | Fonte |
|---|---|---|---|
| **non eseguito / non effettuato** | la misura **non è stata fatta**. Nessuno è andato a misurare. | registri di controllo e manutenzione, liste di verifica | uso corrente; il DSS chiede di attestare i controlli **eseguiti** (D.Lgs 624/96 art. 6) |
| **non rilevato — «n.r.»** | la misura **È STATA FATTA** e il risultato sta **sotto il limite di rilevabilità (LOD)**. È un dato misurato. | rapporti di prova di laboratorio, referti ARPA | «n.r. significa < al Limite di Rilevabilità LOD… ogni risultato espresso come n.r. **non indica l'assenza del parametro**» — [ARPAL, Guida alla lettura del Rapporto di prova](https://www.arpal.liguria.it/files/qualita/guida_RdP.pdf) *(pagina non apribile: EGRESS_BLOCKED, testo dalla ricerca)*; [ARPA Piemonte, Qualità del dato](http://ctntes.arpa.piemonte.it/Raccolta%20Metodi%202003/html/frame/descrizionequalit.htm) |
| **non determinato / non determinabile — «n.d.»** | il numero **non si può ricavare**: manca un ingrediente del conto, o il metodo non si applica. | rapporti di prova, schede di accuratezza | stessa famiglia dei rapporti di prova; «ND = not detected/not detectable» compare anche come variante — [ARPA Piemonte](http://ctntes.arpa.piemonte.it/Raccolta%20Metodi%202003/html/frame/descrizionequalit.htm) |
| **dato non disponibile** *(distinto da)* **dato non validato** | il dato **dovrebbe esserci e non è a portata di mano** — oppure c'è ma **nessuno l'ha ancora controllato**. Sono **due stati diversi, con due colori diversi**. | bollettini e tabelle di qualità dell'aria delle ARPA | «Il colore **bianco** indica *Dato non disponibile* e il colore **grigio** indica *Dato non validato*» — [Arpae Emilia-Romagna, dati qualità aria](https://www.arpae.it/it/temi-ambientali/aria/dati-qualita-aria) |

⛔ **La trappola, e va scritta grossa: «non rilevato» NON vuol dire «non
misurato».** Vuol dire il contrario: qualcuno è andato, ha misurato, e lo
strumento non ha visto niente sopra la sua soglia. Un'app che scrive «non
rilevato» dove intende «nessuno ha misurato» sta **dichiarando una misura che
non esiste** — ed è esattamente il verso tranquillizzante contro cui esiste il
principio del fondatore.

⭐ **E le ARPA hanno già la difesa che questo prodotto sta costruendo**: la
**bandiera di validità del dato** accanto al numero. «I dati scaricabili
includono quattro diverse *flag di validità del dato*, indicative del buon
funzionamento o meno della strumentazione», e un buco strumentale si dichiara
per nome nella nota («dato mancante di Benzene per **anomalia strumentale**») —
[Arpae](https://www.arpae.it/it/temi-ambientali/aria/dati-qualita-aria). Cioè
il mondo non scrive solo «manca»: scrive **perché** manca.

#### I.2 ⭐ Il modulo pubblico che dichiara «questo numero non è pesato»: il FIR

Il **Formulario di Identificazione dei Rifiuti** ha, sul peso, **due caselle
alternative da barrare**, e sono la formula italiana bell'e pronta per dire «di
questo numero non mi fido»:

- **«Peso verificato in partenza»** — «va barrata **solo** nel caso di quantità
  verificata in partenza con strumenti di misurazione del peso nella
  disponibilità del Produttore/Detentore»;
- **«Peso da verificarsi a destino»** — si indica un **peso presunto**, e
  «sarà onere del destinatario, una volta terminato il carico, compilare il
  relativo campo». ⚠️ E la regola che chiude il cerchio: **«la quantità va
  comunque indicata»** anche quando si barra «da verificarsi a destino».

Fonti: [Wikipedia — Formulario di identificazione dei rifiuti](https://it.wikipedia.org/wiki/Formulario_di_identificazione_dei_rifiuti);
[BibLus — FIR: cos'è e come si compila](https://biblus.acca.it/formulario-identificazione-dei-rifiuti-fir/);
[SIA — Come compilare il FIR](https://www.insia.it/come-compilare-il-formulario-di-identificazione-dei-rifiuti/).

⭐ **Perché conta per noi**: il mestiere ha già una parola per «numero che c'è ma
non è stato pesato» — **presunto**, contrapposto a **verificato**. Non è «non
calcolabile» e non è «—»: è **un numero, dichiarato per quello che è**. È il
principio del fondatore scritto dentro un modulo di legge.

#### I.3 ⭐ E la legge sulle cave impone di dichiarare uno ZERO invece di tacere

**D.Lgs 624/1996, art. 25** (sicurezza e salute nelle industrie estrattive):
entro i primi **15 giorni di ogni mese** il titolare trasmette all'autorità di
vigilanza una **denuncia riepilogativa mensile — «anche se negativa»** — degli
infortuni del mese precedente. Nello stesso articolo:

- entro **24 ore**, per telegramma o fax, ogni infortunio **mortale** o con
  guaribilità **oltre 30 giorni**;
- se, **contro la prognosi iniziale**, l'infortunato non guarisce entro 30
  giorni, denuncia **entro la settimana successiva**, con la documentazione
  medica;
- la denuncia porta **una dichiarazione firmata dal direttore responsabile**
  sulle cause e le circostanze.

Fonti: [D.Lgs. 25 novembre 1996 n. 624 — testo](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
*(pagina non apribile: EGRESS_BLOCKED)*; [Olympus/Uniurb — D.Lgs 624/1996](https://olympus.uniurb.it/index.php?Itemid=137&catid=5&id=216%3Adecreto-legislativo-25-novembre-1996-n-624-sicurezza-dei-lavoratori-nelle-industrie-estrattive&option=com_content&view=article);
[PuntoSicuro — sicurezza e valutazione dei rischi nelle cave](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/sicurezza-valutazione-dei-rischi-per-le-attivita-estrattive-nelle-cave-AR-21944/).

⭐ **«Anche se negativa» è, alla lettera, «l'assenza di un dato non è un dato
favorevole» scritta in una norma del 1996.** Un mese senza infortuni non si
racconta col silenzio: si **dichiara**.

#### I.4 Sicurezza — le parole e chi le firma

| Termine | Che cosa dice | Fonte |
|---|---|---|
| **mancato infortunio** | è la traduzione che usa **INAIL** per *near miss*; convivono «mancato incidente» e «quasi infortunio». Nessuna delle tre è sbagliata. | [INAIL/BibLus — istruzioni per la gestione del «mancato infortunio»](https://biblus.acca.it/sicurezza-sul-lavoro-da-inail-le-istruzioni-per-la-gestione-del-mancato-infortunio/); [BibLus — near miss](https://biblus.acca.it/near-miss-sicurezza-cos-e-un-mancato-infortunio-e-come-si-gestisce/) |
| **sorvegliante** | figura **obbligatoria** in cava; è nominato dal titolare e **deve dichiarare di conoscere il DSS nella denuncia di esercizio**. | [D.Lgs 624/96](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm); [Regione Toscana — linee guida D.Lgs 624/96](https://www.regione.toscana.it/documents/10180/70872/Linee+guida+regionali+DLgs+624+del+96/e59e9f59-9962-4571-bcf9-1711f52e9acb) |
| **direttore responsabile** | in cava **deve essere ingegnere laureato e abilitato**; le variazioni si denunciano entro **8 giorni**; le sostituzioni di sorvegliante sotto i **40 giorni** non si denunciano ma vogliono un **ordine di servizio**. | [D.P.R. 128/1959, norme di polizia delle miniere e delle cave](https://www.regione.toscana.it/documents/10180/15099685/D.P.R.+9+aprile+1959,%20n.+128.pdf/7cf5e783-90a0-417f-a6e5-c1dbc58bc435) |
| **DSS — documento di sicurezza e salute** | è il nome che il settore estrattivo dà al documento di valutazione dei rischi, e va **attestato ogni anno**. | [Regione Toscana, linee guida](https://www.regione.toscana.it/documents/10180/70872/Linee+guida+regionali+DLgs+624+del+96/e59e9f59-9962-4571-bcf9-1711f52e9acb) |
| **registro infortuni** | ⚠️ **abolito**: D.Lgs 151/2015 art. 21 c. 4, efficace dal **23/12/2015**; al suo posto INAIL ha messo il **«Cruscotto infortuni»**. Resta la **comunicazione telematica entro 48 ore** dal certificato per assenze di **almeno 1 giorno** oltre quello dell'evento. | [INAIL circ. 31/2016 — abolizione registro infortuni, rilascio «Cruscotto infortuni»](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15600%3Ainail31_2016&catid=6&Itemid=137) |
| **prognosi** | è la parola giusta, e la sua forma aperta («prognosi riservata», «prognosi ancora aperta») è il modo in cui il mestiere dice **«quanto è costato non si sa ancora»**. | uso medico-assicurativo corrente; D.Lgs 624/96 art. 25 la usa («contrariamente alla prognosi iniziale») |

#### I.5 Materiali, pesa e vendita

| Termine | Che cosa dice | Fonte |
|---|---|---|
| **tout-venant** / «misto di cava» / «misto granulare» / «stabilizzato» | il materiale **così com'esce**, non selezionato: «misto naturale di cava (tout venant)… proveniente da cave autorizzate **senza subire selezione**». Sono **sinonimi commerciali dello stesso prodotto**. | [Superbeton — tout venant](https://www.superbeton.it/inerti/aggregati_ingegneria/aggregati_ingegneria_1551803387_1551803535/tout_venant.htm); [Canzian Inerti — misto natura](https://www.canzianinerti.it/materiale/misto-natura-aggregato-naturale-inerti/) |
| **sterile** / **cappellaccio** | il materiale **che non si vende**: limi e argille dentro il giacimento, e la copertura. Va nel **piano di gestione dei rifiuti di estrazione** e si usa per il **rinterro** dei vuoti e delle scarpate. | [Comune di Modena — Piano di gestione dei rifiuti di estrazione, cava Rangoni](https://www.comune.modena.it/Plone/argomenti/inquinamento/valutazione-impatto-ambientale-v-i-a/area-cava-rangoni/elaborati-progettuali/c07_piano-di-gestione-dei-rifiuti-di-estrazione) |
| **abbancamento** / **ripristino** (o «recupero ambientale») | il riempimento dei vuoti di coltivazione a fini di ripristino. | [Regione Liguria — ripristino e abbancamento](https://www.regione.liguria.it/homepage-sviluppo-economico/cosa-cerchi/attivit%C3%A0-estrattive-cave/disciplina-attivita-recupero-inerte-in-cava.html) |
| **pesa a ponte** · **lordo / tara / netto** | il camion entra vuoto → si registra la **tara**; carico e seconda pesata → **lordo**; **netto = lordo − tara**. È esattamente il nostro ciclo. | [I Bilanciai — pesa a ponte](https://www.ibilanciai.com/en/prodotti/pesa-a-ponte/) |
| **denuncia di esercizio** | il modulo con cui la cava dichiara ogni anno l'esercizio e le figure (direttore responsabile, sorvegliante). | [Regione Piemonte — modello denuncia di esercizio di cava](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/modello-denuncia-esercizio-cava-impianto-connesso) |

⚠️ **Un «non c'è» del MONDO, non nostro, e va detto**: cercando un modello
pubblico di **rapporto di fine turno** o di **giornale di cava** non ne è uscito
nessuno — né normativo né di associazione di categoria. Le ricerche riportano
solo cronaca locale e adempimenti generali. Cioè **quel documento non ha una
forma standard pubblica**: è aziendale. `[dedotto]` Il che vuol dire che sul
rapportino **non c'è una fonte da imitare** e la carenza dichiarata in
`CLAUDE.md` («che cosa contiene davvero un rapporto di fine turno») **non si
chiude leggendo: si chiude chiedendo a una cava**. Vale la pena scriverlo,
perché è un argomento su cui altri agenti torneranno a cercare a vuoto.

---

### II. DELTA — la nostra casa, coi comandi e le uscite

Tutti i comandi girano dalla radice del repository, su `5fae710a`, con
`--exclude-dir=node_modules --exclude-dir=vendor --include='*.html' --include='*.js'`
e sull'insieme `index.html apps/campo apps/conti apps/flotta apps/genesi
apps/scudo apps/sentinella apps/terra shared` (abbreviato `$F` qui sotto).

#### II.1 ✅ QUELLO CHE È GIÀ GIUSTO — e questa è la metà che conta

| Nostra parola | Verdetto | Comando | Uscita |
|---|---|---|---|
| **«non misurato» / «mai misurato»** | ✅ **la parola giusta**, ed è quella che il mestiere riserva alla misura mai fatta | `grep -rEoi $F -e '(non\|mai) misurat[oaie]' \| wc -l` | **112** |
| **«non rilevato»** — la parola-trappola | ✅ **non la usiamo mai**, ed è il risultato migliore del blocco: se comparisse, dichiarerebbe una misura mai fatta | `grep -rEoi $F -e 'non rilevat[oaie]' \| wc -l` | **0** |
| **«n.d.» = «non determinabile»** (classe di accuratezza) | ✅ uso **corretto**, ed è la sigla dei rapporti di prova | `grep -rEn 'n\.d\.' apps/terra/terra-data.js apps/terra/index.html` | `terra-data.js:610: return { classe: "n.d.", label: "Accuratez…` · `index.html:4048: ca.classe === "n.d." ? "non determinabi…` |
| **«mancato infortunio»** (il termine INAIL) | ✅ presente, e **usato come glossa dell'inglese** nel punto in cui si sceglie: `<option value="near-miss">Near-miss (mancato infortunio)</option>` | `grep -rEoi $F -e 'mancat[oi] infortun' \| wc -l` | **15** |
| **«sorvegliante» e «preposto», distinti** | ✅ e con la norma giusta accanto: *«In cava il sorvegliante è obbligatorio (D.Lgs 624/96) e il preposto va individuato formalmente (D.Lgs 81/08, D.L. 146/2021)»* | `grep -n 'sorvegliante' apps/scudo/index.html \| head -1` | `1086: …il sorvegliante è obbligatorio (D.Lgs 624/96)…` |
| **«DSS»** | ✅ 138 occorrenze in Scudo, con la forma estesa scritta 3 volte | `grep -rEoc '\bDSS\b' apps/scudo/index.html` | **138** |
| **«prognosi aperta»** | ✅ ed è **fatta bene**: la casella vuota diventa *«assenza da quantificare»* invece di uno zero — *«Uno zero vorrebbe dire "non è costato nemmeno una giornata"»* | `grep -n 'prognosi' apps/scudo/index.html \| head -4` | `1492`, `3084 (…da quantificare (prognosi aperta))`, `3443`, `4833` |
| **«zero misurato» ≠ «non misurato»** | ✅ **scritto a chiare lettere in Terra**, ed è la distinzione che l'ente pretende | `grep -n 'zero' apps/terra/index.html \| grep misurato` | `2200: …«zero misurato» e «non misurato» per l'ente non sono la stessa cosa.` |
| **«gravità non dichiarata»** | ✅ e la nota che l'accompagna è **di mestiere**: *«chi segnala in piedi sul piazzale spesso non sa dire come sarebbe finita, e "non lo so" è una risposta»* | `grep -n 'non lo so. è una risposta' apps/scudo/index.html` | `1455` |
| **lordo − tara = netto** | ✅ il ciclo della pesa a ponte, e il netto **non si digita** | `grep -n 'Il netto NON si digita' apps/conti/conti-data.js` | `1858: // Il netto NON si digita: è sempre lordo − tara.` |
| **«misto di cava (non classificato)»** | ✅ nel listino di Conti, ed è il nome commerciale vero del tout-venant | `grep -n 'Misto di cava' apps/conti/conti-data.js` | `159: nome: "Misto di cava (non classificato)", unitaPrezzo: "t", prezzo: 6.5, densita: null` |

⛔ **Conclusione onesta, e non è gonfiata: sulle parole di questo blocco non ho
trovato NESSUN termine sbagliato.** Il vocabolario della sicurezza di Scudo è
il migliore delle sei app — cita le norme giuste, distingue sorvegliante da
preposto, e la sua gestione della prognosi aperta è più prudente di quella di
un registro cartaceo. Le proposte qui sotto sono **aggiunte** e **una
correzione di formula**, non correzioni di parole sbagliate.

#### II.2 ❌ QUELLO CHE NON C'È (ogni riga col comando e l'uscita)

| Cosa | Comando | Uscita |
|---|---|---|
| «denuncia **riepilogativa** (mensile)» | `grep -rEoi 'riepilogativ' apps/scudo \| wc -l` | **0** |
| «**anche se negativa**» (il mese a zero dichiarato) | `grep -rEoi 'anche se negativ' apps/scudo \| wc -l` | **0** |
| «peso **verificato in partenza**» / «**da verificarsi a destino**» | `grep -rEoi $F -e 'verificato in partenza\|da verificarsi a destino' \| wc -l` | **0** |
| «**presunto**» (come qualifica di un numero) | `grep -rEoi $F -e 'presunt' \| wc -l` | **0** |
| «**tout-venant**» | `grep -rEoi $F -e 'tout.?venant' \| wc -l` | **0** |
| «**sterile**» / «**cappellaccio**» | `grep -rEoi $F -e 'sterile\|cappellaccio' \| wc -l` | **0** |
| «**formulario**» (FIR rifiuti) | `grep -rEoi $F -e 'formulario' \| wc -l` | **0** |
| «**cava di prestito**» | `grep -rEoi $F -e 'cava di prestito' \| wc -l` | **0** |
| «**pedata**» / «**alzata**» del gradone | `grep -rEoi $F -e 'pedata del gradone\|alzata del gradone' \| wc -l` | **0** (⚠️ «gradone» **c'è**, 4 occorrenze in Terra e Scudo, sempre come *«altezza e pendenza dei gradoni»*: è la formula del DSS, quindi **non è una mancanza** — è un altro modo, altrettanto corretto, di dire la stessa geometria) |
| «**abbancamento**» / «**ripristino ambientale**» | `grep -rEoi $F -e 'abbancament\|ripristino ambientale' \| wc -l` | **0** |

⚠️ **E due «non c'è» che NON propongo, perché non servono a un utente**:
«formulario» e «cava di prestito» descrivono attività che le nostre app non
coprono (il trasporto di rifiuti, e il cantiere stradale che apre una cava
temporanea). Elencarli come mancanze sarebbe gonfiare. Restano qui **solo come
misura**, così chi domani vorrà quel cantiere sa che si parte da zero.

#### II.3 ⚖️ LE FRASI NUOVE DI STANOTTE, GIUDICATE UNA PER UNA

> «un capocantiere la direbbe così?» — e dove la risposta è sì, lo dico.

**A) «N righe del file non sono entrate: «riga 3» perché manca il nome della squadra»**
(`shared/deepwork-id-client/dw-shell.js:286`, `frasePersi`)
✅ **Sì, la direbbe così** — e meglio di come me l'aspettavo: la frase **nomina
la riga, dà la ragione, si ferma a tre nomi e poi conta**. È la forma di un
verbale di scarto. Comando: `grep -n 'function frasePersi' shared/deepwork-id-client/dw-shell.js` → `286`.
⛔ **Ma il numero di riga citato non è il numero di riga del file**, ed è un
difetto vero, non di vocabolario: `nRiga` conta **dopo** aver tolto le righe
vuote e l'intestazione
(`.split(/\r?\n/).map(r => r.trim()).filter(Boolean).filter(r => !isIntestazione(...))`,
poi `nRiga++`). Comando e uscita:
`grep -n 'filter(Boolean)' apps/campo/campo-data.js apps/conti/conti-data.js | wc -l` → **8**,
`sed -n '2438,2452p' apps/campo/campo-data.js` mostra il conto e `nome: "riga " + nRiga`.
Chi legge «riga 3» apre il foglio a riga 3 e **trova una riga sana**. → **Proposta 4**.

**B) «non calcolabile»** (117 occorrenze, sei app)
✅ **Parola giusta e trasparente**, e in italiano tecnico è ammessa. ⚠️ Ma
**convive con «non determinabile»** in Terra (`n.d.`) per lo stesso stato, e
questo è l'unico punto in cui il nostro dialetto si sdoppia. Un rapporto di
prova ne usa **una sola**. → **Proposta 3** (dichiarare quale, non
riscriverne 117).

**C) «non misurato» (Terra) e «mai misurato» (Sentinella)**
✅ **Giuste tutt'e due, e la differenza fra loro è di mestiere, non un caso**:
«non misurato» dice *in questo periodo nessuno ha misurato*, «mai misurato»
dice *da quando esiste questo punto non è mai stato misurato*. Un sorvegliante
le distingue. E la riga di Terra `index.html:2200` è la migliore frase di
mestiere che ho trovato in tutto il repository: *«"zero misurato" e "non
misurato" per l'ente non sono la stessa cosa»*. **Nessuna proposta.**

**D) «Periodo dell'adempimento «X»: dal … al … Le date non sono state scelte a
mano.»** (`apps/sentinella/index.html:5316-5327`)
⚠️ **La prima metà sì, la seconda no.** «Periodo dell'adempimento» è una
formula da registro. «**Le date non sono state scelte a mano**» invece è una
frase che descrive **il nostro programma**, non il dato: dice che cosa *non* è
successo. Su un registro la provenienza di un periodo si scrive al **positivo**
— «periodo di riferimento **ricavato dalla scadenza del …**» — che è per altro
esattamente quello che la frase continua a dire quattro parole dopo
(`index.html:5318: "). Le date non sono state scelte a mano: si ricavano dalla
scadenza del "`). ⭐ E il modello ce l'abbiamo **in casa**: `provenienzaVolume`
di Conti (`apps/conti/index.html:4809`) scrive *«178 m³ misurati da 3 rilievi di
Terra, dal … al …»* — provenienza al positivo, senza negazioni. → **Proposta 2**.

**E) «Nel registro c'è 1 infortunio di cui non si legge l'anno: non è in
nessuno di questi conteggi»** (`apps/scudo/scudo-data.js:3947-3949`)
✅ **Sì, e questa è la frase migliore delle cinque.** Dice il numero, dice
**dove non è**, e dice **perché**. È la forma con cui un ispettore si aspetta di
vedere trattata una riga illeggibile.
⚠️ Un solo appunto sulla parola **«registro»**: il *registro infortuni* come
documento obbligatorio **non esiste più dal 23/12/2015** ([INAIL circ.
31/2016](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15600%3Ainail31_2016&catid=6&Itemid=137)).
Nel parlato di cava «il registro» resta il modo normale di chiamare l'elenco
interno degli eventi, quindi **non è un errore** e non propongo di cambiarlo;
va però saputo che a un RSPP quella parola evoca un adempimento abolito.
`[dedotto]` — non ho una fonte che dica come lo chiamano in cava oggi.

---

### III. PROPOSTE

*Formato: schermata · che cosa non va · come si vede · quanto costa · come si misura.*

#### Proposta 1 ⭐ — Scudo: la **denuncia riepilogativa mensile «anche se negativa»**
- **Schermata:** Scudo → sezione «Infortuni e near-miss» (`apps/scudo/index.html:1388`), sotto il «Riepilogo near-miss».
- **Che cosa non va:** un mese senza infortuni oggi non produce **niente**: la sezione semplicemente non dice nulla di quel mese. Ma il D.Lgs 624/96 art. 25 impone al titolare di trasmettere all'autorità di vigilanza, entro i primi 15 giorni del mese, una denuncia riepilogativa **«anche se negativa»** degli infortuni del mese precedente. Cioè la legge sulle cave pretende **esattamente** il principio del fondatore: lo zero si **dichiara**, non si tace. E noi, che quel principio lo applichiamo dappertutto, sull'unico punto in cui è **un obbligo di legge** non lo facciamo.
- **Come si vede:** `grep -rEoi 'riepilogativ' apps/scudo | wc -l` → **0**; `grep -rEoi 'anche se negativ' apps/scudo | wc -l` → **0**; `grep -rEoc '624/96' apps/scudo/index.html apps/scudo/scudo-data.js` → **36** (cioè la norma la citiamo già 36 volte, ma non questo suo articolo).
- **Quanto costa:** una funzione `riepilogoMensileInfortuni(mese)` nel modulo dati che restituisce il conto del mese **e la sua bandiera** (`nessunEvento: true` è un esito, non un vuoto), più un blocco stampabile con la dicitura di legge — «Denuncia riepilogativa degli infortuni del mese di … — **negativa**» — e lo spazio per la firma del **direttore responsabile**, che l'art. 25 pretende. Una unità.
- **Come si misura:** (1) `node apps/deepwork-id/tests/run-kpi.mjs` con un mese a zero eventi deve dare `{ nessunEvento: true, infortuni: 0 }` e **non** `null` né un elenco vuoto; (2) si preme il bottone di stampa su un mese vuoto e si apre il file: deve contenere la parola **«negativa»** e il campo della firma. La prova che conta è quella sul **mese vuoto**, non sul mese pieno — è la regola della prova negativa già scritta in `CLAUDE.md`. (3) Controprova: tolta la bandiera, il foglio del mese vuoto deve diventare indistinguibile da quello di un mese mai aperto, e la prova deve cadere.
- **Fonte:** [D.Lgs 624/1996 art. 25](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm) *(pagina non apribile: EGRESS_BLOCKED; testo dalla ricerca)* · [Olympus/Uniurb — D.Lgs 624/1996](https://olympus.uniurb.it/index.php?Itemid=137&catid=5&id=216%3Adecreto-legislativo-25-novembre-1996-n-624-sicurezza-dei-lavoratori-nelle-industrie-estrattive)

#### Proposta 2 ⭐ — Sentinella: la provenienza di un periodo si scrive al positivo
- **Schermata:** Sentinella → riga sotto il selettore del periodo di un adempimento (`apps/sentinella/index.html:5316-5327`).
- **Che cosa non va:** la frase «**Le date non sono state scelte a mano**» racconta il comportamento del programma con una negazione. Un registro dichiara **da dove viene** un periodo, non che cosa non è successo: «periodo di riferimento, ricavato dalla scadenza del …». La forma giusta la abbiamo già in casa — `provenienzaVolume` di Conti scrive «*N m³ misurati da 3 rilievi di Terra, dal … al …*» — quindi non è una parola da inventare, è una **forma da uniformare**.
- **Come si vede:** `grep -n "non sono state scelte" apps/sentinella/index.html` → `5318`; `grep -n "function provenienzaVolume" apps/conti/index.html` → `4809`.
- **Quanto costa:** riscrittura di **una frase** in tre punti (`5316`, `5325`, `5327`), niente logica. Trenta minuti, il grosso è la revisione dei testi collegati.
- **Come si misura:** (1) `grep -c "non sono state scelte a mano" apps/sentinella/index.html` deve andare a **0**; (2) il banco `browser/` che apre il Quadro di Sentinella legge la riga e pretende che contenga **«ricavato»** o **«ricavate»** e la parola che nomina la fonte (la scadenza), cioè una **provenienza**, non una negazione; (3) ⛔ la riga deve continuare a **sparire** quando le date si toccano a mano (`index.html:1665` dice che è già così): la controprova rimette la riga a date toccate e la prova deve cadere.
- **Fonte:** `[dedotto]` sulla forma (nessuna norma detta come si scrive una provenienza); il modello è **interno**, `apps/conti/index.html:4809`. La regola generale — dichiarare la provenienza di un dato accanto al dato — è quella delle bandiere di validità ARPA: [Arpae, dati qualità aria](https://www.arpae.it/it/temi-ambientali/aria/dati-qualita-aria).

#### Proposta 3 ⭐ — Tutte: **una sola parola** per «non si può calcolare», e il divieto scritto di «non rilevato»
- **Schermata:** trasversale — ovunque un numero non si possa fare (117 punti) e ovunque una misura non ci sia (112 punti).
- **Che cosa non va:** **due cose, e la seconda è la difesa di un risultato già buono.** (a) Per lo stesso stato l'ecosistema dice «**non calcolabile**» (117) e, in Terra, «**non determinabile**» (`n.d.`, classe di accuratezza): due parole per un concetto, che è la copia debole applicata al vocabolario. (b) Soprattutto: oggi non usiamo **mai** «non rilevato» — ed è **giusto**, perché nei rapporti di prova italiani «n.r.» vuol dire *misurato e sotto il limite di rilevabilità*, cioè **il contrario** di «nessuno ha misurato». Ma quel risultato è affidato alla fortuna: nessuna regola lo protegge, e la prima persona che scriverà «non rilevato» al posto di «non misurato» starà **dichiarando una misura mai fatta**, nel verso tranquillizzante, senza che niente diventi rosso.
- **Come si vede:** `grep -rEoi $F -e 'non calcolabile' | wc -l` → **117**; `grep -rEoi $F -e '(non|mai) misurat[oaie]' | wc -l` → **112**; `grep -rEoi $F -e 'non rilevat[oaie]' | wc -l` → **0**; `grep -n 'n\.d\.' apps/terra/terra-data.js` → `610`.
- **Quanto costa:** **niente riscritture di massa.** Una **regola nuova in `run-stile.mjs`** (la 21ª): vietato «non rilevato» / «n.r.» come modo di dire «non misurato», e ammesso **solo** accanto a una soglia strumentale dichiarata; più una riga di vocabolario in `CLAUDE.md` che fissa la coppia — «**non misurato**» per la misura mai fatta, «**non calcolabile**» per il conto che non si può fare — e dichiara «non determinabile»/`n.d.` di Terra come **sinonimo ammesso nel suo contesto** (classe di accuratezza), con la ragione. Un'ora.
- **Come si misura:** (1) la regola deve dare **0 violazioni** su tutte le superfici oggi (il repository è già pulito: è il numero da difendere, non da migliorare); (2) **controprova obbligatoria**: si inietta `non rilevato` in una pagina vera e la regola deve **fallire** — se non fallisce, la regola non guarda dove crede; (3) la regola usa `senzaCommenti`, non `mascheraCodice`, perché il soggetto è un **testo dentro una stringa** (è la trappola già pagata dalla regola 6); (4) si stampa **quanti soggetti ha guardato** (superfici e occorrenze esaminate), se no uno «0 violazioni» non si distingue da un filtro che non trova niente.
- **Fonte:** [ARPAL — Guida alla lettura del Rapporto di prova](https://www.arpal.liguria.it/files/qualita/guida_RdP.pdf) *(non apribile: EGRESS_BLOCKED; dalla ricerca: «n.r. significa < al Limite di Rilevabilità LOD… non indica l'assenza del parametro ricercato»)* · [ARPA Piemonte — Qualità del dato](http://ctntes.arpa.piemonte.it/Raccolta%20Metodi%202003/html/frame/descrizionequalit.htm) · [Arpae — dato non disponibile ≠ dato non validato](https://www.arpae.it/it/temi-ambientali/aria/dati-qualita-aria)

#### Proposta 4 — Import CSV (sei app): il numero di riga citato dev'essere quello del **file**
- **Schermata:** ogni esito di import CSV — Campo (squadre, personale), Conti (incassi, pesate, listino, fatture, gare), e tutti quelli che passano da `frasePersi`.
- **Che cosa non va:** il messaggio dice ««riga 3» perché manca il nome della squadra», ma `nRiga` conta **dopo** aver tolto le righe vuote e l'intestazione. Con un'intestazione e una riga vuota in mezzo, la «riga 3» del messaggio è la **riga 5** del foglio: chi apre il file cerca nel posto sbagliato e trova una riga sana. È lo stesso danno del banco che accusa il prodotto di un difetto immaginario, spostato sull'utente.
- **Come si vede:** `sed -n '2438,2452p' apps/campo/campo-data.js` mostra `.filter(Boolean).filter(r => !isIntestazione(...))` prima del `nRiga++` e poi `nome: "riga " + nRiga`; `grep -n 'filter(Boolean)' apps/campo/campo-data.js apps/conti/conti-data.js | wc -l` → **8** (stessa forma in otto lettori).
- **Quanto costa:** si numera **prima** di filtrare e si porta l'indice avanti — cioè si scorre `split(/\r?\n/)` con l'indice e si saltano le righe da ignorare invece di eliminarle. È un cambio locale in ogni `scarti*Csv`, e la funzione condivisa `frasePersi` **non si tocca**. ⚠️ Vale la regola della firma troppo stretta: **una funzione sola** che restituisce `{riga, testo}` dalle righe grezze, ri-esportata dai moduli, invece di otto copie.
- **Come si misura:** prova in `run-kpi.mjs` — un CSV con **intestazione + riga vuota + tre righe** di cui l'ultima rotta deve dare `nome: "riga 5"` (la posizione nel file), non `"riga 3"`; e la **controprova** rimette il conteggio filtrato e la prova deve cadere. Poi si conta che il totale delle prove sia **salito**, non solo che i falliti siano zero.
- **Fonte:** `[dedotto]` sul modo giusto di citare una posizione; il principio è quello dei registri numerati per progressivo (il registro di carico/scarico e il FIR citano la posizione **fisica**, non l'ordinale dei record validi).

#### Proposta 5 — Conti: «**pesato**» contro «**presunto**», con le parole del FIR
- **Schermata:** Conti → scheda di un DDT e riga della pesata; e il CSV che ne esce.
- **Che cosa non va:** Conti tiene **due strade** per la quantità di una consegna: il **netto della pesa a ponte** (lordo − tara, misurato) e la **conversione m³ ↔ t con la densità** (`convertiQuantita`, `conti-data.js:1459`), che è una **stima**. Sullo schermo le due arrivano allo stesso posto e — a differenza del **prezzo** e del **volume**, che Conti sa già dichiarare per provenienza — la quantità non dice da quale delle due viene. ⚠️ **Il concetto di dichiarare la provenienza esiste già** (`provenienzaVolume`, «Provenienza del prezzo non dichiarata»): la mancanza è **solo sulla quantità**, e va detta così per non gonfiarla.
- **Come si vede:** `grep -rEoi $F -e 'verificato in partenza|da verificarsi a destino' | wc -l` → **0**; `grep -rEoi $F -e 'presunt' | wc -l` → **0**; `grep -n 'convertiQuantita' apps/conti/conti-data.js` → `1459`, `2051`, `2144`; e per contro `grep -n 'function provenienzaVolume' apps/conti/index.html` → `4809` (la forma giusta, applicata al volume).
- **Quanto costa:** un campo di provenienza sulla quantità con **due soli valori** e le parole che il pesatore già conosce dal formulario — «**pesato**» (dalla pesa: lordo − tara) e «**presunto, da verificarsi a destino**» (convertito con la densità) — mostrato accanto al numero e **portato nel CSV**. ⛔ E il posto giusto è il **modulo**, non la pagina: è dove il documento si compone che nascono le copie deboli, quindi la stessa funzione che decide la provenienza a schermo deve deciderla nell'export. Una unità.
- **Come si misura:** (1) prova in `run-kpi.mjs`: una consegna con pesata collegata → `provenienza: "pesato"`; la stessa senza pesata e con densità → `"presunto"`; **senza densità** → `null` e la quantità resta «non calcolabile» (il ripiego non deve inventare una terza risposta); (2) **si preme il bottone e si apre il file**: la colonna della provenienza dev'esserci nel CSV e coincidere con quella a schermo sullo **stesso** DDT — è la sola prova che prende la copia debole del documento; (3) controprova: tolta la provenienza dall'export, la prova (2) deve cadere.
- **Fonte:** [Formulario di identificazione dei rifiuti — «peso verificato in partenza» / «peso da verificarsi a destino»](https://it.wikipedia.org/wiki/Formulario_di_identificazione_dei_rifiuti) · [BibLus — come si compila il FIR](https://biblus.acca.it/formulario-identificazione-dei-rifiuti-fir/) · [SIA — compilazione FIR](https://www.insia.it/come-compilare-il-formulario-di-identificazione-dei-rifiuti/)

#### Proposta 6 (minore) — Terra/Conti: i materiali che **non si vendono**
- **Schermata:** Terra → lotti e volumi; Conti → listino.
- **Che cosa non va:** il nostro vocabolario dei materiali copre solo il **venduto** (stabilizzato, pietrisco, sabbia, misto di cava). Mancano le due parole con cui una cava chiama il resto: «**sterile**» (limi e argille dentro il giacimento) e «**cappellaccio**» (la copertura). Non è un vezzo lessicale: sono materiali che entrano nel **piano di gestione dei rifiuti di estrazione** e che si riusano per l'**abbancamento**, quindi **occupano volume nei rilievi di Terra senza essere ricavo in Conti** — ed è esattamente il tipo di divario che Conti oggi spiega come «sfrido» (`apps/conti/index.html:5163-5171`).
- **Come si vede:** `grep -rEoi $F -e 'sterile|cappellaccio' | wc -l` → **0**; `grep -rEoi $F -e 'abbancament|ripristino ambientale' | wc -l` → **0**; per contro `grep -rEoi $F -e 'sfrido' | wc -l` → **6** (cioè il **concetto** del materiale che si perde c'è, il **nome** del materiale che non si vende no).
- **Quanto costa:** ⚠️ **prima si decide se serve**, e non è ovvio: aggiungere una classe di materiale tocca Terra e Conti insieme e apre un secondo posto dove dire una cosa. Il passo piccolo e sicuro è **solo lessicale**: nella frase del divario di Conti, accanto a «sfrido di lavorazione, materiale fermo a piazzale», nominare anche lo **sterile** — una parola in una frase che già esiste.
- **Come si misura:** `grep -c 'sterile' apps/conti/index.html` → da 0 a 1, **e** il banco dei testi verifica che la frase del divario compaia sulla dimostrazione con quella parola dentro. Per il passo grande, la misura vera è un'altra e va fatta prima: **quante volte, nella dimostrazione, un rilievo di Terra contiene volume che Conti non può fatturare** — se il numero è zero, la classe di materiale non serve e la proposta si chiude qui.
- **Fonte:** [Comune di Modena — Piano di gestione dei rifiuti di estrazione (cava Rangoni)](https://www.comune.modena.it/Plone/argomenti/inquinamento/valutazione-impatto-ambientale-v-i-a/area-cava-rangoni/elaborati-progettuali/c07_piano-di-gestione-dei-rifiuti-di-estrazione) · [Regione Liguria — ripristino e abbancamento](https://www.regione.liguria.it/homepage-sviluppo-economico/cosa-cerchi/attivit%C3%A0-estrattive-cave/disciplina-attivita-recupero-inerte-in-cava.html)

---

### IV. QUELLO CHE HO CERCATO E **NON** PROPONGO (perché nessuno lo rifaccia)

| Ipotesi | Perché è caduta | Prova |
|---|---|---|
| «Usiamo *near-miss* invece della parola italiana» | **Falsa come accusa.** INAIL stessa affianca i due termini, e noi la glossa italiana ce l'abbiamo **nel punto in cui si sceglie**: `<option value="near-miss">Near-miss (mancato infortunio)</option>` e la nota «I **near-miss** (mancati infortuni) non azzerano i giorni…». | `grep -n 'mancato infortunio' apps/scudo/index.html` → `965`, `1484`, `1507`, `3451`; [INAIL via BibLus](https://biblus.acca.it/sicurezza-sul-lavoro-da-inail-le-istruzioni-per-la-gestione-del-mancato-infortunio/) |
| «Manca *pedata/alzata* del gradone» | **Falsa.** Terra e Scudo dicono la stessa geometria con la formula del **DSS**: «Altezza e pendenza dei gradoni come previsto nel DSS». Cambiarla peggiorerebbe. | `grep -n 'gradoni' apps/scudo/scudo-data.js` → `394`, `1535` |
| «Manca *formulario rifiuti* e *cava di prestito*» | **Vero come conteggio (0 e 0), inutile come proposta**: descrivono attività fuori dal perimetro delle app. Misurato e lasciato lì. | `grep -rEoi $F -e 'formulario\|cava di prestito' \| wc -l` → **0** |
| «*Registro infortuni* è una parola sbagliata perché abolita» | **Non abbastanza per proporre un cambio.** L'adempimento è abolito (D.Lgs 151/2015), ma l'elenco interno degli eventi si chiama «registro» nel parlato, e non ho una fonte che dica come lo chiamano oggi in cava. `[dedotto]` — resta come nota, non come cantiere. | [INAIL circ. 31/2016](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15600%3Ainail31_2016&catid=6&Itemid=137) |
| «Cerchiamo il modello standard del *rapporto di fine turno*» | **Non esiste pubblicamente.** Tre ricerche, nessun modello né normativo né di categoria. La carenza dichiarata in `CLAUDE.md` **non si chiude leggendo**: si chiude chiedendo a una cava. | ricerche su «rapporto di fine turno cava», «giornale di cava», «registro giornaliero produzione»: solo cronaca locale e adempimenti generali |

---

### V. RIGHE PROPOSTE DA CHIUDERE QUANDO IL CANTIERE PASSA

*(regola: chi chiude un'unità aggiorna la riga del documento che gliel'aveva
proposta — è la sola cosa che fa scendere il numero dei documenti invecchiati)*

- Proposta 1 (denuncia riepilogativa mensile) — **aperta** al 13/08, commit `5fae710a`
- Proposta 2 (provenienza del periodo in Sentinella) — **aperta**
- Proposta 3 (una parola sola + divieto di «non rilevato») — **aperta**
- Proposta 4 (numero di riga del file negli import) — **aperta**
- Proposta 5 (pesato / presunto in Conti) — **aperta**
- Proposta 6 (sterile e cappellaccio) — **aperta, da decidere prima di costruire**

---

## Blocco 3: le QUATTRO FORME delle ragioni — e la quinta che nessuno ha dichiarato (14/08/2026, commit `92276aff`)

**Data della ricerca:** 14/08/2026
**Commit verificato:** `92276aff` (branch `claude/scheduled-tasks-remote-control-bk4ap6`)
**Agente:** ricerca continua — vocabolario di mestiere, terza tornata

### 0. CHE COSA C'ERA GIÀ (obbligo di lettura, regola 1)

Ho letto tutto il file prima di scrivere. Il **Blocco 1** copre fronte, volata,
mezzi, materiali, documenti, tempi; il **Blocco 2** (che ho riverificato nel
banner qui sopra) copre pesa e vendita, sicurezza, e le quattro diciture del
mondo per «non c'è» — con la scoperta che vale più di tutte, cioè che
**«non rilevato» non vuol dire «non misurato»**.

⛔ **Quindi qui non ritratto niente di tutto quello.** Il Blocco 2 ha giudicato
cinque frasi nuove (`frasePersi`, «non calcolabile», «non misurato / mai
misurato», il periodo di Sentinella, l'infortunio senza anno di Scudo) e **ne
ha lasciata fuori una**, che il mandato metteva in elenco: **le quattro forme
delle ragioni** — «non è stato scritto», «non si legge», «la data non esiste»,
«è negativo». Questo blocco è tutto lì dentro.

⚠️ **Limite dichiarato dello strumento, rimisurato oggi**: `WebFetch` è ancora
negato sui domini istituzionali (`EGRESS_BLOCKED` verificato oggi su
`rentri.gov.it`). Dove la pagina non si apre cito il **link canonico** e uso il
testo che la ricerca restituisce, dicendolo. Le mie deduzioni sono `[dedotto]`.

---

### I. MONDO — che cosa fa un registro vero davanti a una casella vuota

#### I.1 ⭐ «Quello che non è scritto non è stato fatto» non è un modo di dire: è una massima con dietro la Cassazione

È il principio con cui in Italia si giudica la **documentazione sanitaria**, ed
è il più vicino che il nostro ordinamento abbia a quello che il fondatore
chiede alle app. Il punto non è che la casella vuota sia brutta: è che
**l'incompletezza produce conseguenze, e ricadono su chi doveva scrivere**.

> Le carenze della cartella clinica **non possono andare a vantaggio** della
> struttura che l'ha compilata, ma **si riflettono a suo danno**: chi era
> obbligato a scrivere e conservare non può trarre beneficio dal fatto che quei
> documenti manchino. Quando l'incompletezza impedisce di stabilire il nesso
> causale, scatta il meccanismo della **colpa presunta**.

Fonti: [Infermieristicamente/NurSind — «La Corte di Cassazione sentenzia: se non hai scritto… non hai fatto»](https://www.infermieristicamente.it/articolo/6564/la-corte-di-cassazione-sentenzia-se-non-hai-scritto%E2%80%A6-non-hai-fatto/) ·
[La Legge per Tutti — cartella clinica incompleta](https://www.laleggepertutti.it/733804_cartella-clinica-incompleta-cosa-rischia-il-medico) ·
[Studio Legale Mondello — valore probatorio della cartella clinica](https://www.studiolegalemondello.it/cartella-clinica-come-ottenerla-valore-probatorio/)

⭐ **Perché conta per noi, ed è il risultato più forte del blocco:** la nostra
frase del core — *«Nessun foro porta i chili caricati: il totale non è zero,
**non è stato scritto**»* (`index.html:4354` e `7603`) — **è la massima della
Cassazione applicata a un foglio di volata**. Non è una perifrasi gentile per
dire «manca un dato»: dichiara che **nessuno ha scritto**, e che quel silenzio
è uno stato con un responsabile, non uno zero. La parola è **giusta**, e ha una
dottrina dietro.

#### I.2 ⭐ Un registro non ammette spazi vuoti — e l'errore si annulla, non si cancella

La regola trasversale dei registri italiani (carico/scarico rifiuti,
corrispettivi) non è sulle parole ma sulla **forma**, e dice due cose che ci
riguardano:

- **i dati si registrano in modo leggibile e senza lasciare spazi vuoti**;
- un errore **non si cancella**: si **barra** e ci si scrive accanto
  «**registrazione annullata**», lasciando **sempre visibile** l'originale.
  Ciò che si modifica deve **restare leggibile**.

Fonti: [Rifiutoo — errori e correzioni del formulario](https://www.rifiutoo.com/blog/5-errori-compilazione-formulario-rifiuti/) ·
[Sistriforum — barrare gli errori sul registro](https://www.sistriforum.com/t4088-registri-carico-scarico-rifiuti-barrare-gli-errori) ·
[Datalog — registro dei corrispettivi, come si compila](https://www.datalog.it/registro-dei-corrispettivi-cose-e-come-si-compila/) ·
[Finom — registro dei corrispettivi](https://finom.co/it-it/blog/registro-dei-corrispettivi/)

⭐ **Il delta concettuale, e ci assolve:** «senza spazi vuoti» è la ragione per
cui una riga scartata **deve** produrre una frase invece di sparire — che è
esattamente quello che `frasePersi` fa. E «l'originale resta leggibile» è la
ragione per cui, quando una cella non si legge, la nostra frase **riporta il
testo trovato** (`«…», non «" + s + "»`) invece di sostituirlo: stiamo già
facendo la cosa che il registro cartaceo pretende.

#### I.3 ⚠️ Un «non c'è» del MONDO, e va dichiarato invece che riempito

Cercando una **dicitura prescritta** per il campo obbligatorio non compilato —
il corrispettivo ufficiale del nostro «non è stato scritto» — **non ne è uscita
nessuna**. Le istruzioni RENTRI (all. 1 al D.D. 251/2023, sostituito dal
**D.D. 210 del 31/07/2026**) regolano *che cosa* va scritto, non *come si
annota che manca*.

Fonti: [RENTRI — modalità di compilazione del registro cronologico e del FIR](https://www.rentri.gov.it/news/modalita-di-compilazione-del-registro-cronologico-di-carico-e-scarico-e-del-fir)
*(pagina non apribile: `EGRESS_BLOCKED` verificato oggi; testo dalla ricerca)* ·
[FederANSIG — RENTRI, nuove istruzioni registro e formulario (D.D. 210/2026)](https://www.cnc-group.net/index.php/rifiuti-speciali/la-rintracciabilita/rentri-dd-210-2026-nuove-istruzioni-registro-formulario)

`[dedotto]` **Conclusione onesta: su questo punto non c'è una fonte da imitare.**
Il mondo prescrive che il campo **sia** compilato, e tace su come si dice che non
lo è. Quindi il nostro vocabolario delle ragioni **non copia niente: lo stiamo
inventando noi**, ed è una ragione in più perché sia scritto in un posto solo.
Lo annoto perché è un argomento su cui un altro agente tornerebbe a cercare a
vuoto — come già successo, nel Blocco 2, col modello di rapporto di fine turno.

---

### II. DELTA — le quattro forme, misurate una per una

Comandi dalla radice, su `92276aff`, con
`--exclude-dir=node_modules --include='*.html' --include='*.js'` sull'insieme
`index.html apps shared`.

#### II.1 ✅ LE QUATTRO FORME ESISTONO, SONO DELIBERATE, E UN CAPOCANTIERE LE DIREBBE COSÌ

| Forma | Occorrenze | Che stato dice | Un capocantiere la direbbe? |
|---|---|---|---|
| «**non è stato scritto**» (e «non è stata scritta / misurata / dichiarata») | **11** | il campo è **vuoto**: nessuno l'ha compilato | ✅ **sì**, ed è la massima della Cassazione sulla documentazione (I.1) |
| «**non si legge**» | **96** | c'è **qualcosa** e non è un numero/una data | ✅ **sì**, è il parlato esatto di chi ha in mano un foglio |
| «**la data non esiste**» | **10** | la forma è giusta ma il **giorno non esiste** (30/02) | ✅ **sì**, e distingue un caso che «non si legge» nasconderebbe |
| «**è negativo**» / «**non è maggiore di zero**» | **7** | leggibile, ma **fuori dominio** | ✅ **sì** |

⭐ **E non sono nate per caso: sono una convergenza CENSITA, e sta scritta nel
codice.** Il commento di `ragioneData` in Scudo (`apps/scudo/scudo-data.js:2876-2886`)
lo dice per esteso: *«LE PAROLE SONO QUELLE CHE LE NOVE FUNZIONI DI B5 HANNO
GIÀ, non nuove: censite, le loro **diciassette ragioni sono convergute su
quattro forme**»*. Terra (`terra-data.js:1828-1836`) aggiunge la ragione per cui
le prime due non si fondono: *«"non è stato scritto" e "non si legge" sono due
ragioni DIVERSE e la differenza serve a chi deve correggere il file: nel primo
caso la colonna è vuota, nel secondo c'è scritto qualcosa che non è un numero.
**Sono due azioni diverse.**»*

⛔ **Verdetto, e non è gonfiato: su queste quattro non c'è niente da correggere.**
È il caso che il mandato chiede di dichiarare — *se una nostra parola è già
quella giusta, dillo*. Lo è, ed è meglio della media: la distinzione
vuoto/illeggibile **non ce l'ha nessun registro pubblico che ho trovato** (I.3),
e noi la facciamo perché cambia a chi si va a chiedere il rimedio.

⭐ **Una finezza che merita di essere nominata perché sembra una divergenza e
non lo è:** Campo scrive «**non è maggiore di zero**» (foro) dove Terra scrive
«**è negativo**» (volume). Sono **domini diversi**, non due parole per la stessa
cosa: un numero di foro **zero** è sbagliato, un volume **zero** è legittimo —
è lo «zero misurato» che Terra difende a `index.html:2200`. Cambiare l'una
nell'altra **introdurrebbe** un difetto.
Comando: `grep -rn '"il numero del foro non è maggiore di zero"\|"il volume è negativo"' apps` →
`apps/campo/campo-data.js:2598`, `apps/terra/terra-data.js:1855` e `:1937`.

#### II.2 ⛔ MA IL CENSIMENTO NE TROVA **CINQUE**, E LA QUINTA NON È DICHIARATA DA NESSUNA PARTE

Censendo **tutte** le stringhe di ragione dei moduli dati — non cercando i
quattro nomi, che è il modo di farsi rispondere quello che si è chiesto — la
forma più frequente di tutte **non è fra le quattro**:

    grep -rhoE --include='*.js' '"manca [^"]*"' apps shared | sort -u

Uscita: **21 occorrenze**, e sono queste: `manca il cliente`, `manca il nome del
fronte`, `del lavoratore`, `del mezzo`, `del prodotto`, `del ricambio`, `del
ricettore`, `della squadra`, `dello strumento`, `manca il numero del foro`,
`della fattura`, `manca il titolo dell'adempimento`, `della gara`, `manca la
descrizione dell'azione`, `manca la ragione sociale`, `manca la data della
taratura`, `manca la scadenza`, `manca il costo di`, `manca ancora 1 foro`.

⭐ **E ha una regola vera, che regge alla misura:** «**manca X**» si usa per i
campi di **identità** (nome, numero, titolo, cliente, ragione sociale,
descrizione — 21), «**X non è stato scritto**» per i campi di **valore**
(importo, prezzo, carica, volume, durata, data — 10). Comando:
`grep -rhoE --include='*.js' '"[^"]*non è stat[oa] scritt[oa][^"]*"' apps shared | wc -l` → **10**.
✅ **La distinzione è giusta e un capocantiere la fa**: «manca il nome della
squadra» e «l'importo non è stato scritto» non sono la stessa frase, e nessuno
direbbe «il nome della squadra non è stato scritto».

⛔ **Il problema non è la parola: è che la quinta forma non è scritta in nessun
commento, mentre le altre quattro lo sono in tre posti.** Una regola affidata
alla memoria di chi legge è la definizione di regola che diverge — ed è già
successo, vedi qui sotto.

#### II.3 ⛔ LA DIVERGENZA C'È, È IN UN FILE SOLO, E STA A 750 RIGHE DAL SUO PROPRIO VOCABOLARIO

`apps/sentinella/sentinella-data.js` contiene **due dialetti per gli stessi due
stati**:

| Stato | La forma canonica (riga **797**, `ragioneData`) | Che cosa scrive `parseTaratureCsv` (righe **1547-1549**) |
|---|---|---|
| campo **vuoto** | «la data **non è stata scritta**» | «**manca** la data della taratura» · «**manca** la scadenza» |
| c'è qualcosa e **non si legge** | «la data **non si legge**: va scritta AAAA-MM-GG, non «X»» | «la data della taratura **non è una data**» · «la scadenza **non è una data**» |

Comando e uscita:

    grep -n '"la data non è stata scritta"' apps/sentinella/sentinella-data.js   → 797
    grep -n 'manca la data della taratura\|non è una data' apps/sentinella/sentinella-data.js → 1548, 1549

⛔ **Due cose, e la seconda è peggiore della prima.**
1. Una **data** è un campo di valore, quindi per la regola della quinta forma
   dovrebbe dire «non è stata scritta»: qui dice «manca». È l'unica eccezione
   alla regola in tutto il repository.
2. «**non è una data**» è una **sesta forma**, e copre insieme due stati che
   tutto il resto della casa tiene separati — «non si legge» (c'è scritto
   `01/03/2026`, rimediabile riscrivendo il formato) e «non esiste»
   (`2026-02-30`, rimediabile solo chiedendo che giorno fosse). Chi riceve
   «non è una data» **non sa quale dei due gli è capitato**, cioè non sa che
   cosa andare a chiedere — che è esattamente la ragione per cui Terra scrive
   che «sono due azioni diverse».

⚠️ **Ed è la stessa cosa detta con due nomi nello stesso file**, che è il difetto
contro cui il commento di Terra mette in guardia alla lettera: *«la stessa cosa
si chiama con lo stesso nome nei due versi, se no chi legge crede che siano due
difetti diversi»*.

#### II.4 ⛔ PERCHÉ È DIVERGIATO PROPRIO LÌ: IL GUARDIANO C'È, DICHIARA IL SUO DENOMINATORE, E QUEL LETTORE È FUORI

La difesa esiste ed è fatta bene — `run-kpi.mjs` (~riga 29195) tiene una tabella
`NOVE` che, per ogni lettore, prova **una riga rotta per ogni ragione che quel
lettore sa dare**, e si chiude dichiarando il proprio denominatore:

    eq(NOVE.length, 9, "⛔ INGRESSO · la tabella copre tutti e nove i lettori CSV di Campo/Conti/Flotta/Terra");

⭐ Quel `eq` è **il modo giusto** di scrivere un controllo, ed è raro: se un
lettore uscisse dalla tabella il numero scenderebbe e si vedrebbe. Ma la riga
**«di dove arriva» va guardata quanto il numero** — ed è qui che si apre il
buco. Misurato:

| | conto | comando |
|---|---|---|
| lettori `scarti*Csv` esportati nelle **sei** app | **19** | `grep -rn --include='*.js' '^export function scarti[A-Za-z]*Csv' apps shared \| wc -l` |
| di cui coperti dalla tabella | **9** | l'`eq` qui sopra |
| `scarti*Csv` delle **quattro app che l'etichetta nomina** | **13** | campo 2 · conti 6 · flotta 3 · terra 2 |
| lettori con un `motivo` proprio **fuori** dalla famiglia `scarti*Csv` | **1** (`parseTaratureCsv`) | `grep -rn 'motivo = "manca' apps` → `sentinella-data.js:1547` |

⛔ **Due difetti distinti, e vanno separati:**
1. **L'etichetta è più larga del suo numero** — la famiglia già nominata in
   `CLAUDE.md`. Dice «**tutti e nove** i lettori CSV di
   Campo/Conti/Flotta/Terra»: in quelle quattro app i lettori sono **13**, non
   nove. I quattro fuori sono `campo.scartiPianoCsv`, `conti.scartiGareCsv`,
   `conti.scartiClientiCsv`, `flotta.scartiRicambiCsv`. Il numero è onesto, la
   **frase intorno** no — e chi la legge crede che quelle app siano coperte.
2. **Sentinella e Scudo sono fuori del tutto** (3 + 3 lettori), e **la
   divergenza sta esattamente lì.** Non è una coincidenza: è il posto in cui
   nessuna prova pretende una frase.

#### II.5 ⛔ E LA CASA CONDIVISA DICHIARATA DAL CODICE NON È MAI STATA COSTRUITA

Il commento di Scudo si chiude così: *«Questa spiegazione serve a DUE app e
finché sta scritta due volte può divergere: la sua casa vera è `shared/`, e ci
sta scrivendo un altro cantiere.»* Verificato oggi: **quel cantiere non è
arrivato.**

    grep -rn 'ragioneData' shared/                → nessun risultato
    grep -c 'la data non è stata scritta' apps/scudo/scudo-data.js       → 1  (riga 2891)
    grep -c 'la data non è stata scritta' apps/sentinella/sentinella-data.js → 1  (riga 797)

Cioè `ragioneData` è scritta **due volte, identica, in due app**, e `shared/`
contiene solo `frasePersi` — che compone la **frase**, non decide la **ragione**.
È alla lettera la regola vincolante di `CLAUDE.md`: *una regola che serve a due
app vive in `shared/`, e mai riscritta*. Il commento lo sa, lo dichiara, e la
dichiarazione da sola non ha costruito niente — che è la lezione già scritta:
**dichiarare un punto cieco non lo illumina.**

---

### III. PROPOSTE

*Formato: schermata · che cosa non va · come si vede · quanto costa · come si misura.*
*(numerate da 7 per non collidere con le sei del Blocco 2)*

#### Proposta 7 ⭐ — Sentinella: `parseTaratureCsv` parla un dialetto che il resto della casa non parla
- **Schermata:** Sentinella → import CSV dei certificati di taratura, riga di esito per ogni riga scartata.
- **Che cosa non va:** per i **due** stati che tutta la casa distingue, questo lettore usa parole sue: «manca la data della taratura» dove il canone è «la data **non è stata scritta**», e soprattutto «**non è una data**» — una forma che **fonde** «non si legge» e «non esiste». Chi riceve il messaggio non sa se deve **riscrivere il formato** o **andare a chiedere che giorno era**: sono due azioni diverse, ed è la ragione per cui la distinzione esiste. La forma giusta è nello **stesso file**, 750 righe più su (`ragioneData`, riga 797).
- **Come si vede:** `grep -n '"la data non è stata scritta"' apps/sentinella/sentinella-data.js` → **797**; `grep -n 'manca la data della taratura\|non è una data' apps/sentinella/sentinella-data.js` → **1548**, **1549**. E il canone dichiarato: `sed -n '2876,2886p' apps/scudo/scudo-data.js`.
- **Quanto costa:** `parseTaratureCsv` chiama `ragioneData(dR)` e `ragioneData(sR)` invece dei due ternari scritti a mano; resta il caso suo, «la scadenza viene prima della taratura», che è **fuori dalle quattro forme a ragione** (è un vincolo fra due campi, non uno stato di un campo). Il nome dello strumento resta «manca il nome dello strumento», che è la quinta forma **usata giusta**. Mezz'ora.
- **Come si misura:** (1) in `run-kpi.mjs`, un CSV di tarature con la data vuota deve dare **la stessa identica stringa** che `scartiScadenzeCsv` di Scudo dà sullo stesso valore — l'asserzione è l'**identità fra le due frasi**, non il testo scritto a mano nella prova (se no si blinda la copia); (2) una riga con `01/03/2026` deve dire «**non si legge**» e una con `2026-02-30` «**non esiste**», cioè **due frasi diverse** dove oggi ce n'è una sola: `ok(a !== b)`; (3) controprova: si rimettono i due ternari e le prove (1) e (2) devono **cadere tutt'e due**.
- **Fonte:** interna (il canone è `apps/scudo/scudo-data.js:2876-2891` e `apps/terra/terra-data.js:1828-1836`); il principio che vuoto e illeggibile siano stati distinti è `[dedotto]`, ma poggia sul fatto misurato in I.3 che **nessun registro pubblico li distingue**, quindi la distinzione è nostra e va difesa da noi.

#### Proposta 8 ⭐ — `run-kpi.mjs`: il guardiano delle ragioni copre 9 lettori su 19, e la sua etichetta ne promette di più
- **Schermata:** nessuna — è la prova che tiene il vocabolario di tutte le schermate d'import.
- **Che cosa non va:** **due cose separate.** (a) L'`eq(NOVE.length, 9, …)` dice «tutti e nove i lettori CSV di **Campo/Conti/Flotta/Terra**», ma quelle quattro app ne hanno **13**: l'etichetta è più larga del numero, e chi la legge crede che quelle app siano coperte. (b) **Sentinella e Scudo non sono nella tabella affatto** (3 + 3 lettori), ed è esattamente lì che il vocabolario è divergiato (Proposta 7). Il controllo non è debole: è **onesto e circoscritto**, e nessuno ha letto fin dove arriva.
- **Come si vede:** `grep -rn --include='*.js' '^export function scarti[A-Za-z]*Csv' apps shared | wc -l` → **19**; per app: campo **2**, conti **6**, flotta **3**, terra **2**, sentinella **3**, scudo **3**. I quattro scoperti nelle app nominate: `campo.scartiPianoCsv`, `conti.scartiGareCsv`, `conti.scartiClientiCsv`, `flotta.scartiRicambiCsv`.
- **Quanto costa:** si portano i dieci lettori mancanti nella tabella (una riga di casi ciascuno) e l'`eq` va da 9 a **19**; oppure — se qualcuno resta fuori per una ragione vera — quella ragione si **scrive accanto al nome**, come fa già il giro `node` con le suite che vogliono gli emulatori. ⛔ E l'etichetta si riscrive dicendo **che cosa conta e che cosa no**, invece di nominare quattro app. Due ore, il grosso è inventare i casi rotti.
- **Come si misura:** (1) `node apps/deepwork-id/tests/run-kpi.mjs`: il **totale delle prove deve salire** — non basta che i falliti siano zero, è la regola già pagata due volte; (2) l'`eq` sul denominatore deve **derivare** l'elenco dal disco (`scarti*Csv` esportate) invece di portarlo a mano, così un lettore nuovo entra da solo — è la stessa correzione già fatta a `UI_CONDIVISA` di `run-stile`, e la ragione è identica: **un elenco a mano non può accorgersi di un nome che non sa che esista**; (3) controprova: si toglie un lettore dall'elenco derivato e la prova deve cadere.
- **Fonte:** interna e misurata; il principio è `CLAUDE.md`, *«un numero è sorvegliato solo dove il controllo ARRIVA, e l'elenco di dove arriva va guardato quanto il numero»*.

#### Proposta 9 ⭐ — La casa condivisa delle ragioni, che il codice dichiara e nessuno ha costruito
- **Schermata:** nessuna — è il vocabolario che **tutte** le schermate d'import parlano.
- **Che cosa non va:** `ragioneData` è scritta **due volte identica** (Scudo `2891`, Sentinella `797`), e la **quinta forma** («manca X», 21 occorrenze, per i campi di identità) non è dichiarata in nessun commento pur essendo la più usata di tutte. Il commento di Scudo dichiara già che la casa vera è `shared/` e che «ci sta scrivendo un altro cantiere»: **verificato, non è mai arrivato** (`grep -rn 'ragioneData' shared/` → nessun risultato).
- **Come si vede:** `grep -rn 'ragioneData' shared/` → **nessun risultato**; `grep -c 'la data non è stata scritta' apps/scudo/scudo-data.js apps/sentinella/sentinella-data.js` → **1 e 1**; `grep -rhoE --include='*.js' '"manca [^"]*"' apps shared | wc -l` → **21**.
- **Quanto costa:** `ragioneData` (e le sorelle per numero e per nome) si spostano in `shared/dw-ponti.js`, che è già la casa dichiarata per la logica che sta **fra** le app; i moduli la **ri-esportano** col nome con cui l'hanno sempre chiamata, così le pagine non cambiano — **un alias non è una seconda implementazione**. Accanto ci va il commento che elenca **cinque** forme, non quattro, con la regola identità/valore scritta. Un'unità.
- **Come si misura:** (1) il test pretende l'**identità** (`scudo.ragioneData === ponti.ragioneData`), non il comportamento — due copie uguali oggi divergono domani senza che nessuno lo veda, ed è la regola già scritta in `CLAUDE.md`; (2) `copertura-funzioni.mjs` deve continuare a dare **100%** con `shared/dw-ponti.js` dentro il censimento; (3) ⛔ **la prova che conta davvero è quella negativa**: una forma **nuova** inventata da un lettore futuro deve far **cadere** qualcosa — cioè l'insieme delle ragioni ammesse si dichiara, e una ragione fuori vocabolario è un KO. Senza quello si è spostato il codice senza impedire la divergenza, che era il problema.
- **Fonte:** interna; il principio è la regola vincolante di `CLAUDE.md` sul `shared/`, e la dichiarazione d'intento è nel codice stesso (`apps/scudo/scudo-data.js:2884-2886`).

#### Proposta 10 (minore) — «registrazione annullata»: la parola del registro per la riga che si toglie
- **Schermata:** ovunque si cancelli una riga già registrata (Conti → fatture e pesate; Scudo → azioni; Campo → rapportini).
- **Che cosa non va:** i registri italiani non **cancellano**: barrano e scrivono «**registrazione annullata**», lasciando leggibile l'originale. `[dedotto]` sul fatto che ci serva: **prima si misura se una cancellazione lascia traccia**, e non l'ho verificato — non propongo un cantiere su un'ipotesi.
- **Come si vede:** `grep -rEoi --include='*.html' --include='*.js' index.html apps shared -e 'registrazione annullata|annullat[oa]' | wc -l` — **da lanciare**: la riga entra solo se il conto è basso e le cancellazioni risultano silenziose.
- **Quanto costa:** da decidere dopo la misura. Se le cancellazioni già lasciano traccia, **questa proposta si chiude qui** ed è un risultato buono.
- **Come si misura:** si cancella una fattura nella dimostrazione e si guarda se l'elenco, l'export CSV e il totale **dicono** che c'era una riga in più — non se la riga sparisce bene.
- **Fonte:** [Rifiutoo — errori e correzioni del formulario](https://www.rifiutoo.com/blog/5-errori-compilazione-formulario-rifiuti/) · [Sistriforum](https://www.sistriforum.com/t4088-registri-carico-scarico-rifiuti-barrare-gli-errori)

---

### IV. QUELLO CHE HO CERCATO E **NON** PROPONGO (perché nessuno lo rifaccia)

| Ipotesi | Perché è caduta | Prova |
|---|---|---|
| «Le quattro forme sono improvvisate / suonano da programmatore» | **Falsa, e nel verso opposto.** Sono una convergenza **censita** (17 ragioni → 4 forme), dichiarata in tre commenti, e la distinzione vuoto/illeggibile è **più fine di quella di qualunque registro pubblico** che sia riuscito a leggere. | `sed -n '2876,2886p' apps/scudo/scudo-data.js`; `sed -n '1828,1836p' apps/terra/terra-data.js` |
| «Campo dice *non è maggiore di zero* e Terra *è negativo*: uniformare» | **Falsa, e uniformare romperebbe.** Sono domini diversi: un foro **0** è sbagliato, un volume **0** è lo «zero misurato» che Terra difende. | `grep -rn '"il numero del foro non è maggiore di zero"\|"il volume è negativo"' apps` → `campo:2598`, `terra:1855,1937` |
| «*manca X* è una sbavatura da uniformare a *non è stato scritto*» | **Falsa.** Ha una regola vera (identità **21** contro valore **10**) e in italiano è la frase giusta: nessuno dice «il nome della squadra non è stato scritto». Il difetto non è la parola: è che **la regola non è scritta** → Proposta 9. | `grep -rhoE --include='*.js' '"manca [^"]*"' apps shared \| sort -u` |
| «Manca una dicitura ufficiale da imitare per il campo non compilato» | **Vero, e il "non c'è" è del MONDO, non nostro.** RENTRI prescrive che il campo sia compilato e tace su come si annota che non lo è. Il nostro vocabolario non copia: lo inventiamo noi. | [RENTRI](https://www.rentri.gov.it/news/modalita-di-compilazione-del-registro-cronologico-di-carico-e-scarico-e-del-fir) *(EGRESS_BLOCKED)* · [FederANSIG D.D. 210/2026](https://www.cnc-group.net/index.php/rifiuti-speciali/la-rintracciabilita/rentri-dd-210-2026-nuove-istruzioni-registro-formulario) |
| «Il *registro infortuni* di Scudo va rinominato perché abolito» | **Già valutata e scartata nel Blocco 2**, non la ripropongo. | vedi Blocco 2 §IV |

---

### V. RIGHE PROPOSTE DA CHIUDERE QUANDO IL CANTIERE PASSA

*(regola: chi chiude un'unità aggiorna la riga del documento che gliel'aveva proposta)*

- Proposta 7 (il dialetto di `parseTaratureCsv`) — **aperta** al 14/08, commit `92276aff`
- Proposta 8 (il guardiano che copre 9 lettori su 19) — **aperta**
- Proposta 9 (la casa condivisa delle ragioni + la quinta forma dichiarata) — **aperta**
- Proposta 10 («registrazione annullata») — **aperta, da MISURARE prima di costruire**

⚠️ **E una riga del Blocco 2 va corretta, non chiusa:** la Proposta 6 poggiava
su «`abbancament|ripristino ambientale` → 0», che è **falso** (vedi il banner in
cima: «Ripristino ambientale» è una voce di costo in `shared/dw-ponti.js:880`,
e c'era già al commit che il Blocco 2 dichiara). La proposta resta valida
**ristretta allo «sterile»**, che è a **0** davvero.

---

### VI. ⏱️ NOTA DI FRESCHEZZA — che cosa si stava muovendo MENTRE scrivevo

*(la regola del «non c'è» scaduto: le due volte peggiori sono state scadute in
trentaquattro e trentacinque minuti, perché un cantiere parallelo colmava la
mancanza senza saperlo. Quindi dichiaro lo stato del mondo all'istante in cui
consegno.)*

⚠️ **Al momento della consegna un altro cantiere stava scrivendo, NON committato,
proprio in `shared/deepwork-id-client/dw-shell.js`** — il file su cui poggia la
Proposta 9. `git status` → ` M shared/deepwork-id-client/dw-shell.js`, **+172
righe**: sta aggiungendo `CSV_TABELLE`, un censimento delle **32** intestazioni
CSV dell'ecosistema, per accorgersi che l'utente ha caricato **il file di
un'altra tabella** (un CSV di fatture nell'anagrafica dei lavoratori faceva
entrare due lavoratori chiamati «numero» e «2026/001»).

✅ **Ho verificato che questo NON scade nessuna delle mie quattro proposte**, e
il comando è quello: `grep -rn 'ragioneData' shared/` → **nessun risultato**,
anche con le 172 righe nuove sul disco. Quel cantiere lavora sul
*riconoscimento del file sbagliato*, non sul *vocabolario delle ragioni*: sono
due strati diversi dello stesso import. La Proposta 9 resta aperta.

⛔ **E una cosa che quel cantiere fa già meglio di come l'avevo scritta io, da
dire invece di intestarmi:** `CSV_TABELLE` porta accanto a ogni voce il campo
`fonte`, e `run-kpi` **pretende che combaci alla lettera con la prima riga che
quella funzione scrive davvero** — cioè un elenco **sorvegliato**, che cade il
giorno in cui un export guadagna una colonna. È esattamente la forma che la
**Proposta 8** chiede per la tabella `NOVE` (denominatore derivato dal disco,
non scritto a mano). Quindi la Proposta 8 non propone un'idea nuova: propone di
**applicare alle ragioni il modello che l'import ha già adottato accanto**, ed è
un argomento più forte, non più debole.

⚠️ **Tutti i numeri di questo blocco sono stati rimisurati su una copia pulita
del COMMITTATO** (`git worktree --detach HEAD`), non sul disco con il lavoro
altrui sopra: undici conti su undici identici. La regola è quella già scritta —
*fra la misura e il commit un albero con cantieri aperti cambia* — e qui cambiava
davvero.

⛔ **E un'ultima misura, che riguarda QUESTO documento e non il codice: il
commit che ogni blocco dichiara non lo sorveglia nessuno.**
`documenti-invecchiati.mjs` cerca la riga «verificato contro il codice al
commit …» e la cerca **solo** nei `docs/CONCORRENTI_*.md`
(`readdirSync(…).filter(n => /^CONCORRENTI_.*\.md$/.test(n))`, riga 260); i
`RICERCA_CONTINUA_*.md` sono **fuori dal suo elenco**, e infatti oggi gira
verde su **6 documenti misurati** senza aver mai aperto questo.
Comando e uscita: `grep -c 'verificato contro il codice al commit'
docs/RICERCA_CONTINUA_PAROLE.md` → **0**;
`node apps/deepwork-id/tests/documenti-invecchiati.mjs` → *«15 passati, 0
falliti · 6 documenti misurati»*.
⚠️ Non è un guasto e non propongo di cambiarlo qui: è la ragione per cui le
riverifiche di questo file **si fanno a mano**, ed è esattamente quello che il
banner in cima ha dovuto fare — trovando una riga falsa. Chi legge lo sappia:
su questo documento la data non è garantita da niente, è garantita da chi la
rimisura. È la regola già scritta in `CLAUDE.md` — *un numero è sorvegliato
solo dove il controllo arriva* — applicata al documento che la contiene.
