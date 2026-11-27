# Checkpoint — 2026-09-15T16:29:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0184e8b7

## Cosa è stato completato
Ventottesima unità del ciclo odierno: seconda correzione alla ricerca G9
di Genesi (rifiniture di scena 3D), stavolta su una mia stessa
affermazione precedente ("la proposta 3 resta verificata come scritta").

Nel cercare un possibile punto d'aggancio per la proposta 3 (annotazione
on-hover per foro) prima di valutare se costruirla, trovato che Genesi
ha già un pannello HUD per foro (`holeInfoShow`, genesi.html:2863) con
un `Raycaster` su `pointerdown` — esattamente il "legend/tooltip con
dettagli" che la proposta chiedeva, solo triggerato dal clic invece che
dall'hover (scelta di prodotto, non un buco), senza burden/PPV per foro.
La ricerca originale aveva cercato `CSS2DRenderer`/`CSS3DRenderer`/uno
"sprite system" — il MECCANISMO tecnico — invece del risultato, e la mia
prima riverifica (unità 22) non l'aveva preso perché aveva controllato
solo che le funzioni citate esistessero, non che il risultato finale
mancasse davvero.

Corretto il documento in coda: il delta vero è molto più piccolo di
quanto scritto — due righe in più a un pannello esistente, non un
sistema da costruire da zero. Non implementato: richiede prima
verificare se le funzioni di sequenza/MIC espongono un valore per
singolo foro (oggi chiamate su un gruppo).

Prima di questa correzione: lanciato un altro giro di ricerca in
background su Flotta (settimo giro, ancora in corso) e verificato con
`contrasto.mjs` che Scudo e Sentinella (le app più toccate oggi) non
hanno regressioni di contrasto (663 e 492 testi misurati, 0 sotto
soglia).

## Verifica
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (nessun codice
  toccato in questa unità, solo documenti)
- `contrasto.mjs --solo=sentinella`: 492 testi, 0 sotto soglia
- `contrasto.mjs --solo=scudo`: 663 testi, 0 sotto soglia
- `barra-etichette.mjs` (tutte le superfici, unità precedente): 180
  etichette, 0 fuori posto
- Push riuscito al primo tentativo: `669f1d8a..0184e8b7`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. G9 di Genesi ora ha tutt'e tre le
proposte riverificate di persona: 1 (burden map) vera, 2 (PPV isoline)
da ripensare (funzione citata non esiste), 3 (annotazione) quasi tutta
già costruita — il delta reale è solo due campi in più su un pannello
esistente. Nessuna delle tre presa per costruzione oggi.

## Prossimo passo atomico
Quattro ricerche su quattro tornate oggi (Genesi ×2, Sentinella, Terra)
hanno contenuto almeno una correzione reale dopo la riverifica di
persona — un segnale forte che vale la pena raccogliere in una riga di
CLAUDE.md o della roadmap: **cercare il MECCANISMO/RISULTATO prima del
NOME TECNICO specifico** quando si verifica una ricerca su un'interazione
UI (qui: "esiste un pannello con questi dati?" invece di "esiste
CSS2DRenderer?"). Il ciclo prosegue con:
1. Attendere il settimo giro di ricerca su Flotta (in corso in
   background) e riverificarlo con la stessa attenzione.
2. Considerare se estendere `holeInfoShow` di Genesi con burden/PPV per
   foro — piccolo, ma richiede prima leggere `sequenzaSuMaglia`/
   `micFinestra` per capire se espongono un valore per singolo foro.
3. La prima fetta di sezioni trasversali su Terra (scomposta nell'unità
   27), quando c'è tempo per farla con la cura dovuta a un pattern UI
   nuovo.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
