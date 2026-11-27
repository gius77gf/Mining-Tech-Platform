# Checkpoint — 2026-09-13T10:26:21Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`44a39973`

## Completato

Secondo pezzo della richiesta diretta del fondatore ("un pò tutte e tre
le alternative"), dopo l'export DXF (unità precedente, G33): il
**disegno di precisione**.

- Nuova funzione pura `snapAGriglia(v, passo)` in `genesi-data.js`
  (blocco G34): aggancia al multiplo più vicino del passo scelto; non
  tocca il valore se il passo non è valido (zero/negativo/non
  numerico) né se il valore in ingresso è già illeggibile (NaN resta
  NaN — non è questa funzione a doverlo dichiarare o correggere).
- Bottone "Griglia" nella barra dei livelli del Progetto 2D
  (`genesi.html`), stesso pattern (classe `.dl-tog`/`.dl-f`) dei toggle
  Isocrone/Relief/Energia/Innesco già esistenti — nessuna struttura
  nuova, solo una nuova voce nella struttura che c'era. Passo
  selezionabile: 0,10 / 0,25 / 0,50 / 1,00 m.
- **Spento di default**: un progetto salvato prima di questa unità
  disegna e si comporta esattamente come prima, perché l'aggancio si
  applica SOLO nel momento in cui l'utente sta posizionando un punto
  col mouse/dito (`d2Down`/`d2Move`), mai sui dati già salvati.
- Griglia visibile sul canvas SOLO quando l'aggancio è acceso (un aiuto
  invisibile non aiuta), con un tetto di 400 tratti per asse — difesa
  contro un passo scritto a mano fuori dai valori del menù, non un
  limite d'uso reale (i valori offerti su una pianta di poche decine
  di metri non lo toccano mai).
- Tre prove nuove in `run-kpi.mjs`, provate contro il difetto (tolto
  l'arrotondamento in una copia: la prova cade da sola — poi
  ripristinato e verificato `diff` vuoto).
- Fondo di copertura di `genesi-data.js` alzato 141→142.
- Documenti corretti di conseguenza (misura, non stima):
  `DEVELOPMENT.md`, `STATO_PRODOTTO.md`, `DECISIONI_WEEKEND.md`,
  `ROADMAP_SETTIMANA.md` — 3.413→3.416 prove senza rete,
  305/305→306/306 funzioni condivise, genesi-data.js 141/141→142/142,
  **147→148 funzioni nella pagina di Genesi e 55→56 estraibili** (la
  nuova `_snapXY` legge due variabili del modulo, `D2.snap` e
  `D2.snapPasso`, quindi cade nel bucket "una o due" del censimento
  `genesi-estraibili.mjs`), e l'asserzioni-totali-del-giro
  3.871→3.874.

Verificato sulla **copia** (git worktree) di quello che si sta
committando, quattro volte in questa unità (l'ultima dopo l'ultimo
numero corretto): `giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata; lo status generale del blocco aggiornato con la
data e il numero di prove corrente.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden **invariato**: l'aggancio
alla griglia arrotonda solo la posizione durante un trascinamento a
mano, non ricalcola niente, non tocca il calcolo del burden/relief né
l'editor del fronte 3D usato per quei calcoli (questa unità ha toccato
solo il Progetto 2D — fori, e i punti di fronte/piede quando modificati
da lì).

Resta aperta la domanda posta al fondatore su come conciliare
"aspetto più professionale in stile CAD" (terzo pezzo di "tutte e tre")
con la regola vincolante "struttura identica al core, pelo per pelo" —
nessuna risposta ancora arrivata, nessun lavoro iniziato su quel pezzo.

## Prossimo passo atomico

In attesa della risposta del fondatore sul terzo pezzo (aspetto
CAD vs. struttura del core), le strade aperte e sicure sono:

1. **Estendere il disegno di precisione**: quote/misure a schermo sul
   Progetto 2D (es. mostrare la distanza fra due fori selezionati, o
   fra un foro e il fronte) — stesso perimetro sicuro di questa unità
   (Progetto 2D, non tocca il fronte 3D né i calcoli).
2. **Se si passa ad altro**: tornare al giro di ricerca continua
   (prossima app in rotazione dopo Genesi) o alla verifica visiva
   rimasta in sospeso (scheda signature-hole, citata nei checkpoint
   precedenti) — sempre rispettando il blocco di sicurezza su
   geometria/flyrock/burden.

Nel frattempo continuare a lavorare senza fermarsi (regola del
fondatore: nessuno stop volontario), scegliendo fra le due strade sopra
la prossima unità piccola e verificabile.
