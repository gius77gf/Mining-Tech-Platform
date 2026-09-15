# Checkpoint — 2026-09-13T09:53:59Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ec865cd9`

## Completato

Primo pezzo concreto della richiesta diretta del fondatore: "potremmo
rendere genesi più simile ad un CAD?", risposta via AskUserQuestion
**"un pò tutte e tre le alternative"** (disegno di precisione,
interoperabilità DXF, aspetto più professionale). Questa unità copre
**solo** l'interoperabilità DXF (export).

- Nuova funzione `dxfPianoFori(fori, diamMm, profilo)` in
  `genesi-data.js` (blocco G33): SOLO esportazione, nessun calcolo
  nuovo, nessuna soglia di sicurezza toccata — i numeri che escono
  (mx/my dei fori, i punti del profilo del fronte) sono quelli che
  Genesi ha già calcolato e mostra a schermo. Due layer: FORI (cerchio
  + etichetta per foro) e FRONTE (polilinea del profilo, mai inventata
  se il profilo manca).
- ⛔ **Autocorrezione prima del commit**: la prima stesura usava
  `LWPOLYLINE` per il profilo del fronte, e il commento diceva
  "verificata aprendola in QCAD/LibreCAD durante lo sviluppo" — **falso**,
  non l'avevo fatto. Installato `ezdxf` (libreria Python di lettura DXF
  vera) e verificato per davvero: `DXFStructureError: missing
  'AcDbPolyline' subclass in LWPOLYLINE` — un DXF R12 senza
  HEADER/TABLES non può avere `LWPOLYLINE` (vuole i marcatori di
  sottoclasse del DXF R14+). Corretto con la forma classica a tre pezzi
  `POLYLINE`/`VERTEX`/`SEQEND`, valida dal DXF più vecchio in poi, e
  riverificata con lo stesso lettore dopo la correzione: 3 cerchi, 3
  etichette, una polilinea a 4 vertici (il quinto punto scartato perché
  non numerico), nessuna eccezione. Il commento in codice adesso dice
  la verità (verificata con `ezdxf`, non "a occhio sul testo" né con
  un'affermazione mai controllata).
- Bottone "📐 Esporta piano fori (DXF per CAD)" in `genesi.html`,
  accanto agli altri export del Progetto 2D, stesso pattern (`data:`
  URI + `<a download>`) degli export CSV/XML esistenti. Il messaggio
  dice esplicitamente se il livello FRONTE è uscito o no (il profilo
  non sempre c'è).
- Tre prove nuove in `run-kpi.mjs`, provate contro il difetto (tolto il
  filtro sulle coordinate non numeriche in una copia: la prova cade da
  sola, 2→4 cerchi — poi ripristinato e verificato `diff` vuoto).
- Fondo di copertura di `genesi-data.js` alzato 140→141 in
  `copertura-funzioni.mjs`.
- Quattro documenti corretti di conseguenza (misura, non stima):
  `DEVELOPMENT.md`, `STATO_PRODOTTO.md`, `DECISIONI_WEEKEND.md`,
  `ROADMAP_SETTIMANA.md` — 3.410→3.413 prove senza rete, 304/304→305/305
  funzioni condivise, genesi-data.js 140/140→141/141.
  ⚠️ **E un numero già scostato PRIMA di questa unità** (asserzioni
  totali del giro, 3.868 nei documenti) è stato ricontato e corretto a
  **3.871** — non è un numero introdotto da questa unità: la prima
  verifica (con `numeri-nei-documenti.mjs` ancora rosso) dava 3.828,
  perché quel comando falliva ed era escluso dalla somma; corretto
  quello, il comando passa e la sua «43 passati» rientra nel totale
  (3.828+43=3.871). Verificato che i due documenti che lo dichiarano
  dicano lo stesso numero (il giro lo pretende).
- ⚠️ Trappola incontrata scrivendo la correzione stessa: il primo
  tentativo su `DEVELOPMENT.md` metteva "(G33)" prima della parentesi
  con gli addendi — la regex di `numeri-nei-documenti.mjs` cerca la
  PRIMA parentesi dopo «senza rete», quindi leggeva "G33" invece della
  somma e il controllo diceva «0 addendi trovati». Tolto l'inciso fra
  parentesi, tenuto lo stesso contenuto senza `(...)` di troppo.

Verificato sulla **copia** (git worktree) di quello che si sta
committando, tre volte (l'ultima dopo il fix del numero 3.871):
`giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata ancora in ROADMAP_SETTIMANA.md per il piano CAD;
lo status generale del blocco è aggiornato con la data e il numero di
prove corrente.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden **invariato** (nessuna
riga toccata da questa unità: DXF è solo esportazione di numeri già
calcolati, non tocca il calcolo).

Non ancora affrontato: la tensione fra "aspetto più professionale/CAD"
(terzo pezzo della richiesta "tutte e tre") e la regola vincolante
"STRUTTURA: IDENTICA AL CORE, PELO PER PELO" — da sollevare esplicitamente
col fondatore prima di disegnare qualunque toolbar/pannelli in stile CAD,
non da decidere da soli.

## Prossimo passo atomico

Due strade aperte, indipendenti:

1. **Rispondere al fondatore** riassumendo il piano a fasi per "tutte e
   tre le alternative": (a) interoperabilità DXF — FATTO in questa unità
   (solo export; l'import DXF è una decisione a parte, rimandata
   esplicitamente perché potrebbe portare lo stesso rischio di
   convenzione-assi già segnalato per l'import boretrack, se la
   geometria importata finisse per toccare calcoli); (b) strumenti di
   disegno di precisione (snap-to-grid, quote/misure nell'editor 2D
   e/o nell'editor del fronte 3D — quest'ultimo da valutare con
   cautela contro il blocco di sicurezza, perché tocca l'editor usato
   per il burden); (c) aspetto più professionale in stile CAD — e qui
   sollevare esplicitamente la tensione con "struttura identica al
   core, pelo per pelo", chiedendo come conciliarla (dettagli in stile
   CAD dentro la shell esistente del core, vs. deroga esplicita per
   Genesi).
2. **Se si prosegue senza attendere risposta**: iniziare a scoping
   la parte (b) — strumenti di disegno di precisione — partendo dal
   Progetto 2D (`genesi.html`, `d2-canvas`), che non tocca il fronte 3D
   né il blocco di sicurezza: uno snap-to-grid sul posizionamento manuale
   dei fori è un buon primo pezzo piccolo e verificabile.

Nel frattempo, ricerca di fianco (round successivo, rotazione delle
app): prossima app da coprire dopo Genesi nel giro "ricerca continua".
