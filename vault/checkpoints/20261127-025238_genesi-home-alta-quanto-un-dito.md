# Checkpoint — Genesi: la Home alta quanto un dito, un banco riparato, un rosso cronico trovato

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): la Home alta quanto un dito…»).
Il precedente, `a1d51e2d` (i comandi del Progetto 2D alti quanto un dito), è
confermato dal giro `node` completo: 47 comandi a posto, 4523 asserzioni.

## Che cosa è stato fatto
- Home: i tre comandi di ogni volata salvata da 19 px a 44; i comandi sotto
  gli elenchi da 30 a 44; sul telefono i tre comandi vanno sotto il testo.
  Solo CSS, in fondo al foglio. Scatti a 430 e 320 guardati.
- Banco `genesi-colonna-progetto.mjs`: le due domande anche sulla Home, con
  una volata salvata dal bottone vero. 19 → 26 controlli; controprova 9
  difetti rimessi su 9, cadono 15.
- ⛔ Rigirati TUTTI i banchi del browser di Genesi dopo `a1d51e2d` (54): 52
  a posto, 2 caduti.
  1. `genesi-snap-estremo`: rotto dalla MIA modifica (sul commit di prima
     passa). Clic a coordinate di schermo senza portare la pianta in vista:
     con la pianta scesa di 62 px il clic cadeva sul tasto «Home» della barra
     in basso. Riparato il banco (centra la pianta): 8/8, controprova cade.
  2. `genesi-campi-assenti`: cade anche sul commit di prima. Bisezione su 35
     commit: rosso dal `1b904f01` del 14/09 (scelta voluta: senza spalla la
     maglia non si disegna). Il banco lo dichiara da sé («NON MISURATI»). È
     un rosso cronico: voce APERTA in roadmap.
- Numeri: invariati (giro `node` 4523 su 47, 465 esecuzioni nel browser).

## Lezioni di questa unità
- «Rigirare i banchi vicini alla modifica» non bastava: i quattro che avevo
  scelto passavano, il quinto — che clicca la pianta a coordinate fisse — no.
  Una modifica che sposta TUTTO di qualche decina di pixel va provata su
  tutti i banchi della superficie, non su quelli che ne parlano.
- Davanti a due banchi caduti la prima domanda è «cadevano anche prima?»:
  un `git archive` del commit precedente in scratchpad e `DW_RADICE` lo
  dicono in due minuti. Uno era mio, l'altro era lì da due mesi e mezzo.
- `fuori-schermo.mjs` vuole la PORTA di un server come primo argomento: un
  mio lancio senza è uscito 1 e sembrava un difetto.

## Stato roadmap
Chiusa «la Home alta quanto un dito, e un banco riparato». Aperte:
«`genesi-campi-assenti.mjs` è rosso dal 14/09» (da fare), «Genesi → Campo —
il piano di carico CSV…» (fuori mandato), «il piede che esce dalla faccia»
(decisione 35). E7 aperta: restano finestre e comandi sopra il 3D.

## Prossimo passo atomico
**Chiudere il rosso cronico di `genesi-campi-assenti.mjs`.**
1. Aprire `apps/deepwork-id/tests/browser/genesi-campi-assenti.mjs` dalla
   riga «la terza domanda» alla fine. Oggi: `apriSenza("B")` → scheda senza
   righe → `nonMisurati.push(...)` due volte → uscita 1.
2. Riscrivere la sezione sulla verità di oggi, senza allentare niente:
   · senza spalla (e senza spalla col borraggio 1,6): la pagina non solleva
     errori, `D2.holes.length === 0`, la scheda dice «Pianta non disegnabile:
     manca …» e NON contiene nessuna gittata né distanza di sgombero (nessun
     numero seguito da «m» nella scheda);
   · con la spalla: «101 m … 202 / 404 m» e il verdetto del flyrock inverso;
     con borraggio 1,6: «174 m» — i numeri di sempre.
   Il denominatore dichiarato in fondo («64 asserzioni attese … 9 sulla
   SPALLA») va ricontato.
3. Nel commento del banco: la forbice «fra 101 e 133 m» non è raggiungibile
   dalla pagina dal 14/09 (cercare prima se un'altra via la raggiunge: un
   `.volata.json` importato coi fori ma senza spalla?) e resta provata in
   `run-kpi` — dire quale prova, per nome.
4. Controprova del banco, poi il testo: «manca burden» → la parola del
   campo («la spalla»), in `magliaAssenteMotivo` (genesi-data.js) e nei due
   punti della pagina che lo stampano; aggiornare le prove che lo citano.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
