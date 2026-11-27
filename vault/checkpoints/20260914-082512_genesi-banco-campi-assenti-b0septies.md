# Checkpoint — 2026-09-14T08:25:12Z

## Tipo
unit-complete (regressione trovata in revisione e corretta — verde falso, non prodotto rotto)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**Rilanciando i banchi del browser di Genesi** (revisione di qualità dopo
il blocco G39-G44), `genesi-campi-assenti.mjs` dava **2 KO reali**:
`dB: aprire la volata senza questo valore NON uccide il 2D (0 righe di
scheda)` e lo stesso per `dS`.

**Diagnosi (misurata, non dedotta)**: non è un regresso di G39-G44 — è un
test invecchiato da **B0-septies** (implementato prima in questa stessa
sessione, unità `20260914-015629`), che il ciclo non aveva ancora
rilanciato contro i banchi del browser. Prima di B0-septies, aprire una
volata senza burden o interasse produceva comunque una scheda validatori
completa (su una geometria degenere, con NaN/zeri di coercizione). Dopo
B0-septies, `renderScheda2D` esce PRIMA di disegnare qualunque riga
quando `magliaAssenteMotivo` dichiara la maglia non posizionabile,
mostrando solo la frase dichiarata — un miglioramento deliberato (non
disegnare una pianta inventata), non un difetto. Il banco, scritto il
09/08 prima di B0-septies, pretendeva ancora `.sv-row > 20` per OGNI
campo assente, compresi i due che ora si comportano diversamente di
proposito.

**Corretto rendendo l'asserzione più giusta, non più permissiva** (regola
di CLAUDE.md): per `dB`/`dS` specificamente, il banco ora pretende **0
righe** e la frase "non disegnabile" con la ragione nominata (burden o
interasse), invece delle vecchie 20+ righe; gli altri 14 campi restano
sorvegliati con l'aspettativa originale, invariata.

**Effetto collaterale scoperto e dichiarato, non risolto**: una sezione
successiva dello stesso banco ("la terza domanda: con la spalla assente,
la gittata non esce da un burden inventato") usa `apriSenza("B")` per
verificare che la riga "gittata flyrock" non inventi un burden globale —
ma quello scenario apre un progetto SALVATO senza B, che con B0-septies
significa zero fori fin dall'apertura, quindi la scheda non renderizza
nessuna riga (nemmeno quella del flyrock) e il banco dichiara onestamente
**"non misurato"** invece di un falso "a posto". Non ho tentato di
riscrivere questo scenario: la domanda che poneva richiederebbe che B
sparisca DOPO che i fori esistono già (non prima), e se quello stato sia
ancora raggiungibile nel prodotto reale (es. tramite un rilievo boretrack
importato — funzione **gated** sulla decisione del fondatore, sezione 6
di `docs/DECISIONI_WEEKEND.md`) è una domanda che non ho deciso da solo.
Documentato con un commento datato nel file, non lasciato in silenzio.

## Verificato

1. `genesi-campi-assenti.mjs` (normale): **55 passati, 0 falliti** (da 53
   passati/2 falliti) — 64 asserzioni attese, tutte misurate tranne le 2
   "non misurate" dichiarate (la sezione della spalla, sopra).
2. `genesi-campi-assenti.mjs --controprova`: **32 passati, 23 falliti**,
   con "iniezioni: 20/20 hanno trovato il loro pezzo" — la controprova
   continua a funzionare correttamente su tutti gli altri undici campi e
   sulle righe di carica/flyrock/SDOB; i due campi B/S non producono un
   KO specifico dalla controprova (il loro comportamento — 0 righe,
   "non disegnabile" — dipende da `magliaAssenteMotivo`, chiamata da
   `genMaglia2D` indipendentemente dal difetto di `applyDesign` che la
   controprova reintroduce), ma questo non indebolisce la controprova nel
   suo complesso: il file esiste per difendere DODICI correzioni diverse,
   e undici continuano a essere sorvegliate esattamente come prima.
3. Rilanciati anche gli altri banchi Genesi del browser per lo stesso
   controllo di non-regressione: `genesi-maglia-assente.mjs` (16/16),
   `genesi-frasi-limite.mjs` (36/36), `genesi-numeri-tranquilli.mjs`
   (35/35), `genesi-piano-innesco.mjs` (17/17), `genesi-recettore-
   assente.mjs` (19/19) — tutti puliti, nessun'altra regressione trovata.
4. `sintassi-pagine.mjs` (34/34) e `numeri-nei-documenti.mjs` (puliti):
   nessun impatto sui documenti sorvegliati, essendo una modifica a un
   file di test soltanto.

## Stato roadmap

Nessuna voce nuova aperta oltre a quanto già dichiarato nel commento del
file. La domanda "il rilievo boretrack potrebbe far rivivere lo scenario
B-sparisce-dopo-i-fori?" resta implicitamente legata alla segnalazione di
sicurezza aperta su quella funzione (invariata, non toccata).

## Blocchi e limiti noti

Nessuno nuovo introdotto da questa unità. La segnalazione di sicurezza
sul boretrack (sezione 6 di `docs/DECISIONI_WEEKEND.md`) resta bloccata
sul fondatore, come sempre.

## Prossimo passo atomico

Nessun'azione obbligata. Le strade aperte restano quelle dei checkpoint
precedenti (G45 candidato non preso, ricerca continua, o il fallback
della roadmap generica). Se in futuro si lavora sul boretrack (previa
conferma del fondatore), rileggere questo checkpoint per sapere che la
sezione "terza domanda" di `genesi-campi-assenti.mjs` aspetta quella
conferma per essere riscritta con uno scenario raggiungibile.

Nessuno stop volontario: si prosegue subito.
