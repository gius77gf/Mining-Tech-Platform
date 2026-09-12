# Checkpoint — 2026-09-12T19:12:07Z

## Tipo
correzione di banco di verifica (nessun codice di prodotto toccato)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`af95c36c`

## Completato

Chiuso il secondo blocco del "prossimo passo atomico" del checkpoint
133: i 4 falliti pre-esistenti di `genesi-struttura.mjs` (il consenso
che non si sblocca spuntando la casella, il modale che non si chiude
con Escape, il campo "Salva la volata" introvabile). Sembravano tre
difetti diversi fra loro e diversi da tutto il resto trovato in questo
blocco — **ed erano invece l'ultima comparsa della STESSA causa unica**
misurata per la prima volta in `genesi-numeri-tranquilli.mjs`: lo
script della pagina impiega 13-20s a finire di cablare i suoi gestori
in questo ambiente senza GPU, e l'attesa fissa di 2,5s del banco
scadeva molto prima che `$('disclaimerChk').onchange=...` (riga ~4838
di `genesi.html`) fosse anche solo assegnato — da lì la cascata su
Escape e sul campo del salvataggio, entrambi testati dopo.

Sostituita l'attesa fissa con un'attesa attiva dello sparire di
`#splash` (segno che il grosso del cablaggio è fatto), tetto 25s.
**Risultato: 14/18 → 18/18.** Controprova (`--prima`) confermata: 4/18
passate, 14 fallite come previsto sullo stato pre-migrazione — il
banco sa ancora fallire.

**Con questa unità si chiude la famiglia di difetti scoperta in questo
blocco**: quattro banchi Genesi (`genesi-numeri-tranquilli.mjs`,
`genesi-frasi-limite.mjs`, `genesi-foglio-in-cava.mjs`,
`genesi-struttura.mjs`) totalizzavano **66 falliti pre-esistenti**,
sparsi su quattro "cause" che sembravano indipendenti (navigazione
bloccata, contatori vuoti, banco schiantato, consenso/modale/campo
introvabili) ed erano tutte la stessa causa unica: uno startup più
lento di quanto ogni banco aspettasse, misurato per la prima volta con
`elementFromPoint` sullo splash. Nessuno di questi era un difetto del
prodotto — tutti confermati pre-esistenti su una worktree del commit
precedente a tutta questa sessione.

## Stato roadmap

Nessuna voce nuova: chiusura di un filone di correzioni di
infrastruttura di verifica aperto in questo blocco (unità 132-134).

## Blocchi e limiti noti

Resta **un solo fallito isolato**, di natura diversa (non timing, ma
ordine di definizione): in `genesi-frasi-limite.mjs`, il toast "Volata
importata: 1 foro" — l'intercettazione di `window.toast` fatta dal
banco può perdersi se l'app definisce/ridefinisce `window.toast` DOPO
che il banco l'ha già intercettata. Dichiarato nel checkpoint
dell'unità 133, non risolto: la cura probabile (spostare
l'intercettazione dentro `addInitScript`) è un cambiamento di ordine,
non di attesa, e va verificata con attenzione perché non rompa gli
altri controlli dello stesso banco che oggi passano.

## Prossimo passo atomico

Con la famiglia "splash lento" chiusa su tutti e quattro i banchi
Genesi, le strade aperte sono:
1. Il singolo fallito residuo di `genesi-frasi-limite.mjs` (vedi sopra
   e il checkpoint 133) — piccolo, isolato, non urgente.
2. Tornare al lavoro sul prodotto: P2.1 (frammentazione da foto) resta
   bloccato sulla decisione #28 in `docs/DECISIONI_WEEKEND.md`; il
   cantiere B3 (funzioni estraibili da `genesi.html`) è in gran parte
   esaurito dei candidati facili (checkpoint 20260912-175849).
3. Una nuova ricerca di fianco su un angolo di Genesi non ancora
   coperto (`docs/RICERCA_CONTINUA_GENESI.md` copre finora: rapporto di
   volata, progettato-vs-perforato, piano di tiro, esplosivi/licenze,
   limiti Kuz-Ram, presplit/detonatori) — o tradurre in unità concreta
   il delta della ricerca presplit/detonatori appena raccolta (unità
   precedente a questa, non ancora tradotta in codice).
