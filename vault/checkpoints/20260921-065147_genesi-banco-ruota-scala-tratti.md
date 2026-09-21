# Checkpoint — 2026-09-21T06:51:47Z (scritto poco dopo il lavoro descritto, che risale a ~04:50Z)

## Tipo
test (nessun codice di prodotto toccato — solo copertura)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5cda349c (chore(vault): completa la rinomina, rimuove il vecchio nome del checkpoint)

## Nota aggiunta scrivendo questo checkpoint (06:51Z)
Il `giro-node.mjs` completo lanciato per questa unità ha trovato,
correttamente, che DUE checkpoint di questo stesso ciclo erano datati
**dopo** il loro vero ingresso in git — il nome usava "circa" invece di
leggere `date -u` appena prima di scrivere il file (`20260921-043500...`,
3 minuti avanti, e `20260921-042500...`, 1 minuto e 43 secondi avanti).
È la stessa causa già scritta sei volte in `date-checkpoint.mjs` prima
d'ora, qui alla settima. Corretti con `git mv` (mai riscrivendo la
storia) e aggiunta la voce in `SCUSATI` per entrambi, seguendo
esattamente il precedente. Anche il nome di QUESTO file è stato
rinominato prima di committerlo, leggendo `date -u` sul momento invece
di stimare.

## Cosa è stato completato
Seguito il "prossimo passo atomico" del checkpoint precedente: verifica
DAL VIVO con Playwright dell'area della regressione `syncTrattoUI`
(G57/G58) corretta prima in questa sessione, e del pannello di
deviazione statistica G59.

- [x] **G59 (deviazione statistica) verificato dal vivo**: aperta una
  volata demo, importato un CSV di rilievo deviazione fori
  (`foro;dx_m;dy_m`, 12 righe), il pannello mostra correttamente
  "Deviazione dal punto di progetto — media X m · massima Y m su 12
  fori" accanto alle righe per-foro, nessun errore in console. Copre
  quello che la sessione aveva scritto ma non ancora testato dal vivo.
- [x] **Scoperto un vero buco di copertura**: la regressione
  `syncTrattoUI` (canvas spinta sotto la barra di navigazione da un
  clic che mostrava Ruota/Scala tratti un click troppo presto) era
  verificata solo con un'asserzione statica (regex sul testo della
  funzione, in `run-kpi.mjs`) e con una verifica numerica manuale al
  momento del fix — **nessun banco del browser la copriva**: verificato
  con `grep -rln "syncTrattoUI\|dtRuotaTratti" apps/deepwork-id/tests/
  browser/*.mjs` → zero file (né `genesi-tratti.mjs` né
  `genesi-snap-estremo.mjs`, gli unici due candidati plausibili, la
  toccano).
- [x] **Scritto un banco dedicato**:
  `apps/deepwork-id/tests/browser/genesi-ruota-scala-tratti.mjs`. Apre
  Genesi a un viewport stretto (390px, la larghezza dove il fix è nato),
  disegna un primo tratto e lo chiude, poi piazza il PRIMO punto di un
  secondo tratto — lo stato esatto in cui Ruota/Scala comparivano prima
  del fix — e pretende che restino nascosti. Registrato in `tutti.mjs`
  (righe dopo `genesi-snap-estremo.mjs`).
- [x] **Verificato che il banco sa fallire**: con `--controprova`
  (ripristina la condizione originale senza `!inCorso`), l'asserzione
  giusta cade (`KO` esattamente sulla riga causale) mentre tutte le
  altre restano verdi e l'iniezione è confermata trovata (1/1) — la
  prova che il banco misura davvero il meccanismo, non un effetto
  collaterale.
- ⚠️ **Un'asserzione geometrica aggiuntiva è stata scritta e poi
  TOLTA**: avevo aggiunto un controllo sulla posizione/altezza della
  tela (`getBoundingClientRect`) per catturare anche lo spostamento
  fisico, ma misurato che la tela si sposta comunque di qualche pixel
  a ogni clic (causa non isolata, probabilmente un riflusso normale del
  layout non legato a questo difetto) — un'asserzione non verificata
  contro il meccanismo esatto sarebbe stata un falso allarme pronto a
  scattare per un motivo diverso da quello del suo nome, la stessa
  famiglia di errore raccolta più volte in CLAUDE.md. Tenuta solo
  l'asserzione sullo stato `hidden` dei bottoni, verificata e
  sufficiente da sola a isolare il meccanismo.

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-ruota-scala-tratti.mjs` →
  **6 passati, 0 falliti**.
- `node apps/deepwork-id/tests/browser/genesi-ruota-scala-tratti.mjs
  --controprova` → **6 passati, 1 fallito** (esattamente l'asserzione
  causale, come atteso).
- `node apps/deepwork-id/tests/porte-banchi.mjs` → **3/0**, 181 banchi
  con server guardati (il nuovo banco è dentro, con contrassegno
  riconosciuto).
- `giro-node.mjs` completo lanciato in background per la conferma
  finale (nessuna modifica a codice di prodotto, solo un file di test
  nuovo e la sua registrazione in `tutti.mjs`).

## Stato roadmap
Nessun codice di prodotto toccato. Colmato un buco di copertura reale
su un difetto già corretto in questa sessione.

## Prossimi passi
- **Prossimo passo atomico**: attendere l'esito del `giro-node.mjs`
  completo lanciato in background, poi propagare eventuali numeri
  cambiati nei documenti tracciati (conteggio banchi/asserzioni) e
  committare. Dopo: continuare con verifica dal vivo su un'altra
  funzione recente non ancora testata interattivamente, o tornare alla
  lettura di `apps/genesi/PIANO_3D.md`/`docs/GENESI_ROADMAP_COMPETITOR.md`
  per intero se anche questo filone si esaurisce.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
