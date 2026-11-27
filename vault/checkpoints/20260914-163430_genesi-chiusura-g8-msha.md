# Checkpoint — 2026-09-14T16:34:30Z

## Tipo
unit-complete (piccola: chiusura di un delta di ricerca, solo documentazione)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Ultimo punto rimasto aperto del confronto fra il Report volata (G8) e la
ricerca "che cosa contiene davvero un rapporto di volata" (13/09): il
requisito MSHA sul "numero di persone presenti al momento del
brillamento". Verificato con `grep` (non dedotto) che è un dato di
esecuzione già tenuto da Campo (`appelloTurno`, `campo-data.js` riga
1030, con lo stesso principio del fondatore già applicato lì) — nessuna
azione per Genesi, che è un simulatore di progettazione, non un
registro di turno. Scritto in coda a
`docs/RICERCA_CONTINUA_GENESI.md`.

## Verificato

- `numeri-nei-documenti.mjs`: 43/0.
- Giro completo (diretto, working tree pulita, nessun cantiere
  parallelo): **40 comandi a posto, 0 caduti** (nessuna riga di codice
  toccata).

## Stato roadmap

Nessuna voce nuova. G8 resta chiuso nella forma già costruita (unità
precedente).

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Dodicesima unità di questo blocco (più tre canarini/aggiornamenti di
stato). Il giro completo del browser è ancora in esecuzione alle
16:34Z — oltre tre ore. Il ramo è andato avanti di **10 commit** da
quando è partito (`477ac992`), diversi dei quali toccano
`apps/genesi/genesi.html`/`genesi-data.js` o aggiungono banchi Genesi
(G8, G45, banco obiettivo/burden, banco DXF) — tutti verificati
separatamente in questo blocco con banchi mirati e screenshot.

Dato quanto il ramo è avanzato sulle superfici che il giro misura, da
qui in avanti conviene **rallentare le modifiche a `genesi.html`** fino
a che il giro non finisce e viene raccolto con `leggi-giro.mjs` — non
per fermarsi, ma per non allargare ulteriormente lo scarto che rende più
faticoso distinguere un KO vero da uno già chiuso altrove. Nel
frattempo: lavoro di sola documentazione/ricerca (già fatto per gran
parte del blocco), o attesa attiva della risposta del fondatore sul
CAD.

Nessuno stop volontario: si prosegue subito.
