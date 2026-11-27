# Checkpoint — 2026-09-19T22:45:08Z

## Tipo
unit-complete (correzione di un difetto vero, trovato dal batch browser)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9c10c262 (chore(vault): checkpoint di lettura sul batch genesi parziale)

## Cosa è stato completato
Seguendo il "prossimo passo atomico" del checkpoint precedente, ho
rilanciato `tutti.mjs --solo=genesi` con l'output intero salvato su file
(non troncato) e l'ho letto per intero. Dei 22 "da guardare", **20 erano
controprove che funzionano correttamente** (il runner conta come "da
guardare" ogni banco che esce con codice diverso da zero, e una
controprova ESCE con codice diverso da zero DI PROPOSITO — non sono
difetti). Restavano due candidati veri: uno dichiarato "NON MISURATO"
(scena non raggiunta, non un difetto — vedi sotto) e uno che **crashava
con un'eccezione non gestita**: `genesi-snap-estremo.mjs` (G48).

- [x] **Difetto vero trovato e confermato con Playwright dal vivo, non
  dedotto**: `genesi-snap-estremo.mjs` va in timeout aspettando che
  `#dtTrattoFine` diventi cliccabile, dopo due clic che dovrebbero
  disegnare un tratto di due punti. Riprodotto a mano: il SECONDO clic
  (quello che dovrebbe aggiungere il secondo punto) non aggiunge niente
  a `D2.tratti` — il tratto resta a un punto solo.
- [x] **Causa isolata per confronto con la baseline (worktree su
  3f4b0ecc, prima di G57/G58), non indovinata**: dopo il PRIMO clic di
  un tratto, `D2.tratti.length>0` diventa vero e — con la condizione
  scritta in G57/G58 — i quattro controlli Ruota/Scala tratti diventano
  visibili SUBITO, prima ancora che il tratto sia utilizzabile. Questo fa
  crescere `#d2-tools` di ~40 px (misurato: canvas a y=688 nella
  baseline, y=728 con G57/G58). Quei 40 px bastano a spingere la tela
  sotto la barra di navigazione fissa (`#bottomnav`, `position:fixed;
  bottom:14px`): il secondo clic, calcolato sulla posizione corrente
  della tela, cade su un'icona SVG della barra invece che sul canvas.
  Confermato con `document.elementFromPoint` nel punto esatto del clic:
  `CANVAS` nella baseline, `SVG` con G57/G58.
- [x] **Corretto `syncTrattoUI` in genesi.html**: `mostraRuota` ora
  richiede anche `!inCorso` (nessun tratto ancora in fase di disegno,
  cioè nessun `aperto:true` in coda a `D2.tratti`). Un CAD vero, del
  resto, ruota/scala geometria ferma, mai una linea a metà — è anche un
  miglioramento UX coerente, non solo una toppa di layout.
- [x] **Verificato dal vivo che la correzione è completa e non
  regressiva**: durante TUTTO il disegno (primo clic, secondo clic) i
  controlli restano nascosti e la tela resta alla sua posizione/altezza
  di sempre; premendo "Fine tratto" ridiventano visibili e **funzionano
  ancora** (ruotato un tratto di 90°, verificato numericamente che le
  coordinate cambiano come atteso). Provato a 430×900, 430×950, 390×950
  (le combinazioni usate davvero dai 33+ banchi di Genesi): tutte pulite.
- [x] `genesi-snap-estremo.mjs` (il banco che aveva trovato il difetto):
  8/8, nessun crash. La sua controprova: ancora capace di fallire (8
  passati, 1 fallito voluto — la stessa asserzione che il difetto vero
  faceva cadere).
- [x] ⚠️ **Limite dichiarato, misurato e NON risolto in questa unità,
  apposta**: a viewport più estremi (320×700, più stretto e più basso di
  qualunque banco reale) lo stesso schiacciamento tela/barra-fissa esiste
  **anche nella baseline pre-G57**, quindi è un difetto strutturale
  preesistente, non introdotto da me e non coperto da nessun banco
  attuale. Non l'ho toccato: è fuori dallo scopo di questa unità
  (corregge la regressione che HO introdotto, non riprogetta il layout
  della schermata 2D per ogni combinazione possibile di viewport).
- [x] 1 test nuovo in `run-kpi.mjs`: verifica sul sorgente che
  `mostraRuota` includa `!inCorso`; provato che sa fallire rimettendo la
  condizione vecchia (fallisce, come deve).

## Verifica prima del commit
- `run-kpi.mjs`: 3230/0 (era 3229/0).
- `sintassi-pagine.mjs`: 34/0.
- `numeri-nei-documenti.mjs`: 43/0 — propagati: prove `node` 3.727→
  **3.728**; tabella estraibili di Genesi (da-tre-a-cinque 19→**18**,
  più-di-dieci 42→**43**, totale estraibili invariato a 45 — nessuno dei
  due scaglioni coinvolti contribuisce al totale).
- **`giro-node.mjs` completo, DUE lanci consecutivi identici**: 41/41
  comandi a posto, 0 caduti, asserzioni **4282** entrambe le volte (era
  4281 prima di questa correzione: +1, il test nuovo).
- `genesi-snap-estremo.mjs` (diretto, non nel giro `node`): 8/8 pulito;
  `--controprova`: 8/9, l'unico KO è quello voluto.

## Stato roadmap
Dei 22 "da guardare" del batch dopo G58/G59: 20 erano controprove che
funzionano (nessuna azione), 1 era "NON MISURATO" per una scena non
raggiunta nel banco `genesi-campi-assenti.mjs` (infrastruttura di test,
non un difetto di prodotto — da rivedere se si ripresenta), 1 era questo
difetto vero, ora corretto.

## Prossimi passi
- **Prossimo passo atomico**: capire perché il banco `genesi-campi-
  assenti.mjs` dichiara "NON MISURATI (2): la spalla..." — se è un
  problema di timing/setup del banco (probabile, dato che tutte le 55
  altre asserzioni dello stesso banco passano) o un caso reale da capire
  meglio, prima di decidere se serve un'azione.
- Valutare se il limite strutturale a viewport molto stretti+bassi (320×
  700, tela schiacciata sotto la barra fissa) merita un cantiere a sé —
  non ora: nessun banco reale lo copre e non è stato introdotto da questa
  sessione.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
