# Checkpoint — 2026-09-14T21:02:59Z

## Tipo
unit-complete (chiude G47 nella sua interezza)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a8be6d8d

## Completato

**G47d** — import DXF in sola lettura, ultima fetta di "Genesi simile a
un CAD". `dxfInTratti` (genesi-data.js) legge LINE e POLYLINE da un
file DXF esterno e li porta dentro come `D2.tratti` — **mai** come
fori, fronte o piede.

La scelta di sicurezza che chiude la ricerca del 13/09
(`docs/RICERCA_CONTINUA_GENESI.md`, "import CAD/DXF: come i software
commerciali evitano l'errore di convenzione degli assi"): nessuna
fonte trovata descrive una validazione esplicita della convenzione
prima di fidarsi della geometria per un calcolo di burden/sicurezza —
solo difese indirette. Qui il rischio non si valida, si **toglie alla
radice**: un tratto non entra in nessun calcolo (relief, energia,
burden, flyrock). Un orientamento sbagliato si vede (tratteggio
distinto per i tratti importati, avviso esplicito) e si annulla con UN
Ctrl+Z — l'intero import è un'unica operazione annullabile.

## Verificato

- Round-trip contro il nostro stesso export (G33, `dxfPianoFori`): un
  profilo esportato rientra come un tratto identico, punto per punto.
- Test puro in `run-kpi.mjs`: andata/ritorno, una LINE isolata, e tre
  casi che non devono produrre niente (file vuoto, file illeggibile,
  LINE di lunghezza zero, POLYLINE con un solo VERTEX) — verificato
  contro il difetto storico (filtro di lunghezza zero rimosso) prima
  di committare.
- `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/0 (dopo
  tre cicli di correzione, vedi sotto). `iniezioni-fresche.mjs`: 565
  sul bersaglio. `copertura-funzioni.mjs`: fondo di `genesi-data.js`
  alzato 152→153.
- Screenshot Playwright: import di una LINE e una POLYLINE, i CIRCLE/
  TEXT dei fori NON diventano tratti, l'avviso sulla convenzione degli
  assi compare davvero, un solo Ctrl+Z toglie l'intero import.
- **Banco browser committato**: `apps/deepwork-id/tests/browser/
  genesi-dxf-import.mjs` (8 prove) + controprova (rimette un difetto
  reale — l'import smette di essere un'unica operazione annullabile —
  e cade esattamente su quella prova).
- Giro completo su worktree isolata: **rilanciato due volte** (stesso
  schema delle unità precedenti: il primo giro ha segnalato lo scarto
  delle asserzioni per il file e la prova nuovi, corretto, rilanciato):
  **40 comandi a posto, 0 caduti**.

## Corretto in cascata

287→289 banchi del browser, 123→124 file di banco distinti,
3.451→3.452 prove sulle nove suite (`run-kpi` 2970→2971),
3.915→3.917 asserzioni del giro completo, 316→317 funzioni condivise
(`genesi-data.js` 152→153). Tabella di `genesi-estraibili.mjs`
(61→60 "una o due", 18→19 "sei-dieci", 69→68 estraibili): **non un
cantiere vero**, lo stesso margine accettato dello strumento già
misurato su G47a — `d2Snap` letta come se leggesse più variabili per
via delle parole nel commento italiano appena scritto sopra di lei.

## Stato roadmap

**G47 — "Genesi simile a un CAD" — CHIUSA nella sua interezza.**
Checkbox flippato a `[x]`, riga tolta dall'indice delle voci aperte
(19→18, verificato con `numeri-nei-documenti.mjs`). Le quattro fette:

| Fetta | Cosa | Commit |
|---|---|---|
| G47a | Coordinate esatte (x/spalla) + vincolo di allineamento | `bc8544f6` |
| G47c-1 | Annulla/ripristina per l'editor 2D | `69cc8f85` |
| G47c-2 | Tratti liberi (prima entità 2D senza semantica di prodotto) | `43ed5e9a` |
| G47b | Livelli veri (mostra/nascondi/blocca per entità) | `cba3a0a0` |
| G47d | Import DXF in sola lettura, come tratti | `a8be6d8d` |

Il fondatore aveva risposto **"tutto"** alla domanda di chiarimento sui
quattro assi proposti (precisione/snap, layer, strumenti di disegno,
import/export CAD): tutti e quattro sono ora costruiti, verificati e
commessi. Nessuna fetta è stata dichiarata fatta senza screenshot +
banco browser committato + giro isolato, come richiesto dalla
scomposizione originale.

## Blocchi e limiti noti, invariati

- Il gate di sicurezza sul rilievo boretrack
  (`deviazioneForiDaCsv`/`burdenVeroDaRilievo`, `docs/DECISIONI_WEEKEND.md`
  §6) resta bloccato sul fondatore. G47d non lo tocca: è una famiglia di
  rischio diversa, risolta diversamente (i tratti importati non entrano
  mai in un calcolo, mentre il rilievo boretrack sì).
- Le curve di soglia USBM/DIN (§9) restano invariate.
- G47d non supporta LWPOLYLINE (solo POLYLINE classica R12, la stessa
  forma del nostro export): se un file DXF moderno usa solo LWPOLYLINE,
  quella geometria non verrebbe letta. Non dichiarato come bug — è lo
  stesso limite deliberato già scelto per l'export (`_dxfPolilinea`,
  13/09), documentato lì con la ragione tecnica (DXF R12 non supporta
  LWPOLYLINE). Un'estensione futura, se un file reale lo richiede.
- Editing dei vertici già disegnati (fori/fronte/piede/tratti) non è
  nello scope di nessuna fetta di G47: si può solo aggiungere,
  trascinare durante il disegno, ed eliminare. Modificare un punto già
  fissato di un tratto o profilo dopo il fatto richiederebbe hit-test e
  drag su ogni tipo — un'estensione futura se richiesta, non implicita
  in "Genesi simile a un CAD".

## Prossimo passo atomico

**G47 è chiusa. Nessuno stop volontario**: per la regola del fondatore
("se la roadmap sembra finita, non è finita"), si prosegue subito con
la prossima voce aperta di `vault/ROADMAP_SETTIMANA.md` — **Q1**
(proposte sui ruoli reali dentro l'organizzazione, `docs/
RICERCA_DEEPWORKID_202607.md`, legata alla decisione 10b/10c) è la
prossima nell'elenco delle voci aperte per nome. Se Q1 risulta già
bloccata su una decisione del fondatore (da verificare rileggendo il
suo stato), si scende all'elenco successivo o si passa al punto 1
della lista "SE LA ROADMAP SEMBRA FINITA" del kickoff (seconde
iterazioni delle app verticali, rimandati del censimento, ricerca
continua a rotazione sulle sei app).
