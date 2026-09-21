# Checkpoint — 2026-09-14T18:57:20Z

## Tipo
unit-complete (scomposizione prima di scrivere codice — il fondatore ha risposto)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Il fondatore ha risposto in conversazione alla domanda di chiarimento
lasciata aperta dal checkpoint `20260914-100055` ("hai riflettuto su
come rendere Genesi simile ad un CAD? — quale aspetto intendevi?"): con
una parola sola, **"Tutto"**. La domanda proponeva quattro assi
distinti (precisione/snap, layer, strumenti di disegno, import/export
CAD) con lo stato reale di ciascuno già verificato nel codice a quel
tempo.

**Scomposto in G47 (roadmap) prima di scrivere codice**, stessa
disciplina già usata per G7 e G38 in questo stesso blocco: quattro
fette (G47a-d), ordinate dal più maturo/meno rischioso al più delicato:

- **G47a — coordinate esatte e vincoli di allineamento.** La base
  (`D2.snap`, `snapAGriglia`, G34 del 13/09) esiste già; manca poter
  scrivere la posizione esatta di un punto a tastiera e un vincolo di
  allineamento con l'ultimo punto selezionato.
- **G47b — livelli di disegno veri.** Non esistono: gli interruttori
  già in pagina mostrano/nascondono un CALCOLO o una vista, non un
  gruppo di disegno con colore/blocco/creazione proprio.
- **G47c — strumenti di disegno liberi.** Non esistono per la maglia
  (un punto alla volta); l'infrastruttura di annulla/ripristina
  (`mdlUndo`/`mdlRedo`, 40 passi) esiste già ed è riusabile.
- **G47d — import DXF in lettura.** Solo esportazione oggi
  (`dxfPianoFori`, G33). Il più delicato: la ricerca del 13/09 ha già
  segnalato il rischio di convenzione degli assi diversa fra un file
  esterno e Genesi — va fatto per ultimo, con una validazione esplicita
  prima di fidarsi di un punto importato (stessa famiglia di rischio
  del gate boretrack, ma non lo stesso gate: quello resta bloccato sul
  fondatore, questo è un rischio diverso da progettare bene).

## Verificato

- `numeri-nei-documenti.mjs`: 43/0, indice delle voci aperte
  riallineato (19/19, +1 per G47).
- Giro completo (working tree pulita, nessuna riga di codice toccata):
  40 comandi a posto, 0 caduti.

## Stato roadmap

Voce G47 aperta con le quattro fette scomposte. Nessuna presa ancora:
questo checkpoint chiude la scomposizione, il prossimo apre G47a.

## Blocchi e limiti noti

⛔ **Segnalazione di sicurezza invariata**: G47d dovrà rispettare la
stessa cautela già scritta per il rilievo boretrack — un dato esterno
con una convenzione di assi sbagliata produce un calcolo silenziosamente
errato. Non è lo stesso gate (quello resta bloccato sul fondatore per
`deviazioneForiDaCsv`/`burdenVeroDaRilievo`), ma la stessa famiglia di
attenzione: quando si arriverà a G47d, si valida la convenzione prima di
disegnare qualunque punto importato, non dopo.

## Prossimo passo atomico

Iniziare **G47a**: nell'ispettore del foro selezionato (`renderInspector`,
dove oggi il ritardo è già editabile con lo stesso pattern), aggiungere
due campi editabili per la posizione esatta (x lungo la fila, spalla dal
fronte) e un'azione "allinea con l'ultimo selezionato" che usa
`D2.selPrev` (già tracciato dal 13/09 per la misura fra due fori
qualunque). Verificare con screenshot e un banco browser prima di
dichiarare la fetta fatta.

Nessuno stop volontario: si prosegue subito.
