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

