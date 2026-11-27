# Checkpoint — 2026-09-19T17:43:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e932501c (fix(genesi): G56d, innFrom=-1 distingue primo della volata da foro senza raccordo)

## Cosa è stato completato
Seconda iterazione su G56d (principio dell'eccellenza, CLAUDE.md: la
prima versione non è mai quella buona): il foro con `innFuoriFascia`
era corretto nei dati e nel Validatore, ma **invisibile sulla pianta**
— `drawInnesco2D` disegna solo le linee di collegamento e non lascia
nessun segno per un foro senza raccordo, quindi con l'occhio sul
disegno (non sul pannello testuale) il difetto restava impossibile da
notare.

- [x] Anello rosso pieno, sempre acceso col livello **Innesco** attivo,
  attorno a ogni foro con `h.innFuoriFascia` (genesi.html, blocco di
  disegno dei fori). Diverso dall'anello del relief (tratteggiato,
  gradiente di gravità): qui non c'è gradazione — o il raccordo c'è o
  il foro non si accende.
- [x] **Verificato con screenshot Playwright reale**, non solo a
  unità: maglia con due fori adiacenti tolti, livello Innesco acceso —
  il quinto pallino della fila (quello isolato) mostra l'anello rosso
  con l'ombra, distinto da tutti gli altri collegati da frecce.
  Screenshot inviato a corredo del checkpoint precedente.

## Verifica prima del commit
- `sintassi-pagine.mjs`: 34/0.
- `giro-node.mjs` completo: 41/41 comandi a posto, 0 caduti, numeri
  invariati (nessun conto di prove tocca il disegno canvas).
- `tutti.mjs --solo=genesi` (lanciato PRIMA di questa modifica, sul
  commit G56d): tornato pulito — 74 banchi a posto, 21 da guardare
  (controprove), nessun KO non-controprova nuovo.
- Nessun test unitario nuovo: è disegno canvas puro, verificato con
  screenshot come da convenzione del repository per questa categoria
  di modifiche («Il browser serve per SCOPRIRE un difetto... quello
  che il browser scopre e basta vive in tests/browser/», e qui non
  c'è un valore numerico da bloccare, solo un tratto visivo).

## Stato roadmap
Chiusa la famiglia G56c/G56d (relief e innesco): dati, testo del
Validatore e disegno sulla pianta tutti e tre coerenti sulla stessa
distinzione (vero primo vs. foro irraggiungibile/non verificabile).

## Prossimi passi
- **Prossimo passo atomico**: `energiaSuMaglia` letta e confermata
  NON condividere il difetto di G56c/G56d (usa geometria locale per
  fila — vicino sinistro/destro nella stessa fila e fila precedente —
  non un "vicino più vicino nel tempo entro una distanza massima"):
  pista chiusa senza bisogno di verifica dal vivo.
- Cercare il prossimo filone di lavoro su Genesi: seconda iterazione
  di un'altra funzione già consegnata, oppure una nuova verifica
  diretta (scenario asimmetrico) su un'area non ancora toccata questa
  sessione (es. il calcolo del burden vero/`distanzaDaSpezzata`, o il
  pannello 3D raggi-X).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
