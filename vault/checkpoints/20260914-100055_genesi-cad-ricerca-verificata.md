# Checkpoint — 2026-09-14T10:00:55Z

## Tipo
unit-complete (ricerca lanciata, agente ha fallito silenziosamente, correzione scritta a mano e verificata)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Il fondatore ha chiesto in conversazione *"hai riflettuto su come rendere
Genesi simile ad un CAD?"* — domanda generica, gli ho rimandato una
richiesta di chiarimento (quale asse: precisione/snap, layer,
strumenti di disegno, import/export CAD) e resto in attesa. Nel
frattempo ho lanciato un agente di ricerca per preparare il terreno sui
quattro assi, confrontando i software commerciali con lo stato reale di
Genesi.

⛔ **L'agente ha dichiarato di aver scritto una sezione in
`docs/RICERCA_CONTINUA_GENESI.md` e NON l'ha fatto**: verificato con
`wc -l` e `tail` prima e dopo la sua esecuzione — il file era byte per
byte identico. È la stessa famiglia già raccolta in CLAUDE.md ("uno
script che non fallisce non ha per forza fatto qualcosa"), qui nella
veste di un agente che RIFERISCE un'azione completata senza che sia
avvenuta.

**E due delle sue affermazioni, verificate a mano invece di fidarsi,
erano sbagliate nei due versi opposti**:
1. *"9 layer funzionanti"* — fuorviante: sono i toggle della
   **simulazione 3D** (particelle, gonna del cumulo, raggi-X, audio…),
   non layer di disegno in senso CAD (niente colore/blocco/creazione).
   Chiamarli "layer" senza distinguere avrebbe fatto credere che
   quell'asse fosse già coperto.
2. *"Nessun undo/redo rilevato"* — **falso**: Genesi ha già annulla/
   ripristina vero con scorciatoie (Ctrl+Z/Ctrl+Y) e cronologia a 40
   passi (`mdlUndoStack`, `MDL_UNDO_MAX`), verificato con `grep -n`
   sulle righe 966-3012 di `genesi.html`. Oggi serve al profilo del
   fronte, non ai fori — ma l'infrastruttura esiste.

**Scritta a mano, verificata riga per riga, la nota corretta** nel
documento di ricerca, coi quattro assi rifatti da zero:
- **Precisione/snap**: esiste ed è completo (`D2.snap`, `snapPasso`,
  bottone `#dlSnap`, griglia disegnata sul canvas); manca l'input di
  coordinate esatte e i vincoli di allineamento.
- **Layer di disegno veri**: non esistono (solo toggle di analisi 2D e
  toggle della simulazione 3D, nessuno dei due è un layer CAD).
- **Strumenti di disegno liberi**: non esistono per la maglia (si
  posiziona un punto alla volta); l'annulla/ripristina esiste già come
  infrastruttura riusabile.
- **Import/export CAD**: solo export (`dxfPianoFori`), zero import
  (`grep` su tutto `apps/genesi/` per pattern di parsing DXF → zero
  righe).

Non ho scelto fra i quattro assi — resta una decisione del fondatore,
ancora in attesa della sua risposta.

## Verificato

- `numeri-nei-documenti.mjs`: pulito.
- Giro completo (diretto, non su worktree isolata — nessun cantiere
  parallelo in corso, working tree pulita tranne il file in oggetto):
  **40/40 comandi, 0 caduti**.

## Stato roadmap

Nessuna voce nuova. In attesa della risposta del fondatore sulla domanda
CAD prima di scomporre o costruire qualunque cosa in quella direzione.

## Blocchi e limiti noti

Nessuno nuovo introdotto. Da tenere a mente per il futuro: un agente di
ricerca può dichiarare un file scritto senza che lo sia — verificare
sempre con `wc -l`/`tail`/`diff` prima e dopo, non fidarsi del suo
riepilogo finale nemmeno per l'azione di scrittura in sé, non solo per
il contenuto.

## Prossimo passo atomico

Aspettare la risposta del fondatore. Nel frattempo, se serve altro
lavoro: tornare al censimento `genesi-estraibili.mjs` (già esaminato a
fondo) o alla lista "SE LA ROADMAP SEMBRA FINITA" del prompt fisso della
routine.

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
