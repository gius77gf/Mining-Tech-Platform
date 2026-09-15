# Checkpoint — 2026-09-14T18:34:25Z

## Tipo
unit-complete (difetto reale trovato in una funzionalità di questo stesso blocco, corretto)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Chiudendo un loop lasciato esplicitamente aperto nel checkpoint G45
("il caso 'tutto verde' non è stato fotografato separatamente"), ho
costruito lo screenshot vero del caso verde — impostando `D2` PRIMA di
navigare al 2D, non mutandolo dopo (la lezione già imparata su
`measureGeom2D` che legge la maglia disegnata, non i parametri
nominali). Leggendo l'elenco completo delle righe (`.sv-dot`/`.sv-lab`)
è uscito un fatto che rovescia una parte dell'unità precedente: `PPV al
recettore`, `MIC (carica/ritardo)` e `Airblast (sovrappr.)` sono
`rows.push(...)` **dentro `renderScheda2D`**, nello stesso array che il
badge di sintesi conta — non in un "pannello KPI separato" come la
frase di perimetro del badge (e la voce di roadmap che l'aveva
scomposta con cautela) affermava.

**Verificato prima di correggere**, non deciso a occhio:
`grep -c 'id="d2-scheda"'` → **1**, un contenitore solo; l'unica scritta
"KPI" nella pagina è l'intestazione della tabella di confronto A/B
(`cmpRender`), un modale diverso, aperto da un altro bottone — non "qui
sopra" come diceva la frase. Controllata anche la fonte: la ricerca del
14/09 su cui G45 si basava **non** fa questa affermazione — l'ho
introdotta io scrivendo la voce di roadmap, senza riverificarla nel
codice, e l'ho poi trascinata fidandomi di me stesso invece di
rileggere `renderScheda2D` per intero.

**La direzione dell'errore è l'opposto di quella temuta**: il rischio
per cui G45 era stato scomposto con cautela era "il badge promette PIÙ
di quanto guarda" (un falso 🟢); quello uscito era "il badge dichiara
di guardare MENO di quanto guarda davvero" — comunque un numero (qui,
un perimetro) scritto senza misurarlo. Stessa famiglia, verso diverso.

**Corretto**: tolta la frase falsa dal badge (`genesi.html`) e dal suo
commento; la nuova frase di perimetro dice solo "stima di progetto: non
sostituisce una misura sul campo" — vera, perché quello resta valido
(previsioni empiriche, non misure certificate). Corretta la voce di
roadmap con una nota datata **appesa**, non riscritta sopra quella
vecchia (append-only, come da regola).

## Verificato

- Screenshot a 430px del caso rosso (3 gravi, 11/22 fuori fascia) con
  la frase corretta: "geometria, carica, esplosivo, vibrazione,
  airblast e flyrock. Stima di progetto: non sostituisce una misura sul
  campo." — leggibile, ben allineata.
- `sintassi-pagine.mjs`: 34/34. `run-stile.mjs`: 328/328.
- `genesi-campi-assenti.mjs` (55/0) e `genesi-frasi-limite.mjs` (36/0):
  invariati, nessun conteggio di riga toccato.
- `numeri-nei-documenti.mjs`: 43/0 (nessun numero sorvegliato mosso,
  solo testo).
- Giro completo su worktree isolata: **40 comandi a posto, 0 caduti**,
  3912 asserzioni invariate.

## Stato roadmap

G45 (già chiusa) ha una nota di correzione datata in coda. Nessuna voce
nuova.

## Blocchi e limiti noti

Nessuno nuovo. Il badge ora dichiara correttamente di coprire TUTTI gli
indicatori della scheda (geometria, carica, esplosivo, vibrazione,
airblast, flyrock) — è più completo di quanto l'unità precedente
credesse.

## Prossimo passo atomico

Diciannovesima unità di questo blocco (più sette canarini/aggiornamenti
di stato). Questa correzione chiude anche l'ultimo loop esplicitamente
lasciato aperto nei checkpoint di oggi. Il fondatore non ha ancora
risposto sulla domanda CAD (oltre nove ore). Backlog di ricerca,
censimento estrazione, censimento per-bottone e giro completo del
browser tutti chiusi o esauriti per questo blocco.

**Lezione generale, oltre al caso**: una frase di perimetro/cautela
copiata da un documento di ricerca (o da una voce di roadmap scritta
in un'unità precedente) vuole la stessa verifica nel codice di
qualunque altro "non c'è" — non basta che la cautela sia nella
direzione giusta, il fatto dentro la cautela va misurato lo stesso. È
la stessa regola di sempre, applicata questa volta alla propria
scrittura di due ore prima, non a un agente esterno.

Nessuno stop volontario: si prosegue subito.
