# Checkpoint — 2026-09-15T22:59:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3ff3461a

## Cosa è stato completato
Dal secondo giro di ricerca su Genesi (blast design, competitor
SHOTPlus/Strayos/O-Pitblast, standard IREDES — WebSearch, marcato di
seconda mano): costruito il pannello «Burden per foro» sulla scheda
Progetto 2D.

- `apps/genesi/genesi-data.js`: `burdenPerForo(holes)` — legge
  `h.burdenVero`/`h.burdenLoc`, già scritti su ogni foro da
  `energiaSuMaglia` a ogni rigenerazione della maglia (nessun import,
  nessun calcolo nuovo). Un foro senza uno dei due è "non calcolabile",
  mai un burden inventato. Soglia 85% (la stessa già usata nell'avviso
  aggregato "fronte stretto", qui applicata foro per foro — non
  unificata con quella esistente, per non fare a metà un refactoring
  più grande che tocca due logiche di classificazione diverse).
  Aggiunta anche `numeroForo(h, i)`, esportando la forma già scritta
  quattro volte nel file (sequenza di sparo se c'è, altrimenti la
  posizione) per la prima funzione nuova che ne aveva bisogno — le
  quattro copie esistenti non sono state toccate.
- `apps/genesi/genesi.html`: bottone "📐 Burden per foro (dalla
  maglia)" nella scheda Progetto 2D, accanto al pannello del rilievo
  boretrack, stesso stile.
- **Nuovo banco permanente**: `apps/deepwork-id/tests/browser/
  genesi-burden-per-foro.mjs`, registrato in `tutti.mjs` (293 esecuzioni
  ora, 126 file distinti). Verifica visiva vera con Playwright: bottone
  raggiungibile, messaggio esplicito senza maglia, pannello popolato
  con la maglia reale di un progetto salvato (16 fori), soglia
  dell'85% verificata iniettando in memoria due fori sulla maglia
  vera (uno dentro, uno oltre) e leggendo il colore giusto per
  ciascuno — non solo "il pannello non è vuoto", la domanda che questo
  file esiste per fare.

## Verifica
- `run-kpi.mjs`: 3040 passati, 0 falliti (nuovo test dedicato).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0.
  `copertura-funzioni.mjs`: 0 scoperte (app 1080/1080, condivisi
  335/335 — +2 per le due funzioni nuove). `funzioni-mai-usate.mjs`:
  0 da collegare. `classi-orfane.mjs`: 0 morte.
- Controprova (codice): tolta la soglia dell'85% (sempre "dentro") →
  il test dedicato cade sull'assertion giusta; ripristinato da copia,
  byte-identico.
- Controprova (browser, `--controprova`): il banco stesso inietta il
  proprio difetto nel modulo servito e cade su 2 delle sue 11 prove —
  esattamente quelle sulla colorazione "oltre"; 1/1 iniezioni trovate.
- Giro completo su worktree isolata: 40 comandi, 1 caduto atteso
  (`numeri-nei-documenti.mjs`) — corretto con le cifre reali misurate
  (run-kpi 3040, somma nove suite 3.532, giro completo 3.999, banchi
  browser 293/126, copertura condivisa 335/335) e riverificato (43/0).

## Stato roadmap
Il secondo giro di ricerca su Genesi è chiuso: il delta era piccolo,
sicuro e additivo, ed è stato costruito. Deepwork ID e il core hanno
avuto la loro passata di ricerca in questo ciclo; Campo ha avuto una
riverifica che non ha prodotto un'unità (il delta trovato — ciclo di
vita per-voce sui "lavori non conclusi" — richiede una decisione di
prodotto sul flusso di consegna turno, non ancora presa).

## Prossimo passo atomico
Nessuna unità piccola e sicura è pronta senza una decisione del
fondatore sui filoni aperti oggi (voce 31 sulla revoca degli accessi;
i cinque lettori CSV non standard restano a bassa priorità; il
ciclo di vita delle azioni di Campo). Candidati per il prossimo blocco:
1. Il core (`index.html`): la ricerca di oggi ha confermato che "Il
   Quadro" (il cruscotto multi-app) NON è ancora costruito — decisione
   15 già presa dal fondatore il 07/08, ma il cantiere è "grande, non
   atomico" (sei ponti verso le app). Il primo passo atomico proposto
   dalla ricerca: una funzione-ponte generica di sola lettura in
   `shared/dw-ponti.js` (stesso pattern di `ponteScudo`, parametrica su
   `appId` e collezione), con test sull'isolamento fra organizzazioni —
   sblocca il cantiere senza toccare nessuna app esistente e senza
   richiedere una nuova decisione.
2. Seconda iterazione UX/estetica su un'app non ancora toccata in
   questo ciclo con una passata dedicata (Genesi, Campo, Terra).
3. Le tre forme non standard dei lettori CSV, se si preferisce
   chiuderle prima di aprire un fronte nuovo.

## Blocchi
Nessuno tecnico.
