# Checkpoint — 2026-09-14T19:16:59Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bc8544f6

## Completato

**G47a** — prima fetta di "Genesi simile a un CAD" (G47, il fondatore
ha risposto "tutto"). Nell'ispettore del foro selezionato:

- due campi editabili, **x** (lungo la fila) e **spalla** (dal fronte),
  stesso schema difensivo del ritardo già esistente (onchange, rifiuto
  con toast e ripristino su valore non valido, soglia 0,3 m sulla
  spalla — la stessa che il trascinamento col mouse già rispetta);
- un pulsante **"⊥ allinea al N"**, visibile solo quando esiste un
  secondo foro selezionato di riferimento (`D2.selPrev`, tracciato dal
  13/09), che porta la spalla del foro corrente a quella del
  riferimento senza toccare la posizione lungo la fila.

## Verificato

- `sintassi-pagine.mjs`: 34/34.
- `numeri-nei-documenti.mjs`: 43/0 (dopo la correzione sotto).
- Screenshot Playwright del prima/dopo (campi visibili, toast corretti,
  layout che sta nella scheda).
- **Test dell'allineamento reso genuino**: prima versione dello script
  di verifica selezionava due fori del progetto di dimostrazione che
  avevano GIÀ la stessa spalla (fila unica, tutti a my=3): il pulsante
  avrebbe "passato" la prova anche se rotto. Corretto spostando a mano
  la spalla del foro 0 a un valore diverso (5,5) PRIMA di premere
  "allinea", e verificando che torni davvero a 3 (quella del foro 1).
- Click reali del mouse sui fori: la prima versione dello script
  calcolava i pixel in coordinate INTERNE della tela (960×300) e
  cliccava lì senza riscalare alla dimensione CSS renderizzata
  (402×127) — i click cadevano fuori dal canvas e la selezione restava
  -1/-1. Corretto riscalando al rapporto CSS/interno e usando
  `locator.click({position})` (che scrolla da sé l'elemento, il canvas
  era sotto la piega del viewport di test).
- Giro completo su worktree isolata (`bc8544f6`): 40 comandi a posto,
  0 caduti.

## Corretto in `docs/DEVELOPMENT.md`

La tabella di `genesi-estraibili.mjs` si è mossa (19→18 nel bucket
"sei-dieci", 37→38 in "più di dieci"). **Non è un cantiere vero**: è il
margine accettato dello strumento stesso (contenuto di commento/stringa
scambiato per una dipendenza da variabile del modulo). Misurato
confrontando `--elenco` prima/dopo in una worktree su HEAD: il commento
italiano aggiunto contiene 4 volte la parola «da» e il codice dichiara
5 volte `dy` (il nome del campo "spalla") — due token corti che lo
strumento conta come letture ovunque compaiano nel testo, non solo dove
sono davvero letti. Sette-otto funzioni lontanissime dal punto toccato
hanno guadagnato "da"/"dy" nel proprio elenco senza che una riga del
loro corpo cambiasse. Il 61 (funzioni estraibili senza rifacimento) non
si tocca.

## Un dubbio sollevato e chiuso durante l'unità (non una correzione vera)

Rileggendo il checkpoint precedente (20260914-185720), la sua riga
compressa su G47c — *"strumenti di disegno liberi. Non esistono per la
maglia (un punto alla volta)"* — sembrava a una prima lettura affermare
che il posizionamento punto-per-punto non esistesse. Misurato
(`d2Down` riga 6040-6042 aggiunge un foro cliccando sul vuoto, `d2Move`
lo trascina; lo stesso per `fronte`/`piede`, riga 6037-6038): il
posizionamento punto-per-punto **esiste già per tutt'e tre** i tipi.
Ma **non è una correzione**: `vault/ROADMAP_SETTIMANA.md` (la stessa
voce G47, scritta per esteso) lo dice già in modo inequivocabile —
*"Oggi si piazza un punto alla volta (foro, fronte, piede): mancano
linee/polilinee libere, forme, testo"* — cioè il gap vero non è mai
stato "manca il punto", è **mancano le primitive vettoriali libere**
oltre al punto singolo (linee, polilinee, forme, testo). La riga del
checkpoint del pomeriggio era solo una scorciatoia terza troppo
compressa per reggersi da sola; la fonte di riferimento (la roadmap)
era già corretta. Registrato qui solo perché non resti un dubbio non
richiuso, non perché qualcosa vada cambiato.

Quello che invece ho **misurato come assente**, e che la roadmap non
menziona come gap a sé: nessun undo/redo per l'editor 2D.
`mdlUndo`/`mdlRedo`/`MDL_UNDO_MAX` (riga 2863-2905) sono scoped al SOLO
editor di modellazione 3D del fronte (`mdlProfSnap`/`mdlApplyProf`);
l'editor 2D (`D2.holes`/`profilo`/`piede`, e ora anche i campi di
G47a) non ha nessuna cronologia — un clic sbagliato che aggiunge un
foro, o un trascinamento accidentale, si annulla solo a mano (Elimina,
o Reset dell'intero profilo). È un prerequisito ragionevole prima di
aggiungere altre primitive di disegno libero (linee/polilinee): più
tipi di tratto si possono disegnare, più costa sbagliare un tratto
senza un Ctrl+Z.

## Stato roadmap

G47a chiusa. G47b/d restano scoperte come da roadmap. **G47c si divide
in due fette**, aggiunta qui (non era ancora scomposta):
- G47c-1 — undo/redo per l'editor 2D (prerequisito, gap misurato ora).
- G47c-2 — la primitiva di disegno libero vera e propria (linea o
  polilinea libera come nuovo tipo di entità 2D, non vincolata alla
  semantica di foro/fronte/piede), come già descritto dalla roadmap.

## Prossimo passo atomico

**G47c-1 — undo/redo per l'editor 2D.** Riusare il pattern già provato
di `mdlUndo`/`mdlRedo` (pila con cap a 40, snapshot/restore, scorciatoie
Ctrl+Z/Ctrl+Y, sincronizzazione dello stato disabled dei pulsanti),
adattato a `D2` invece che al modello 3D: uno snapshot cattura almeno
`D2.holes`, `D2.profilo`, `D2.piede` (le tre collezioni che
`d2Down`/`d2Move`/G47a mutano), push prima di ogni mutazione che
importa (aggiunta/trascinamento/eliminazione foro, aggiunta/trascinamento
punto profilo, le nuove scritture x/spalla/allinea di G47a) — non ad
ogni frame di trascinamento, sullo stesso principio già scritto per
`mdlUndoStack` ("tocco senza spostamento: non sporcare la cronologia").
Bottoni nella scheda 2D (non servono nuovi, se ne può aggiungere una
coppia vicino a "Reset fronte"), scorciatoie da tastiera solo quando la
scheda 2D è attiva (non deve rubare Ctrl+Z alla modellazione 3D se
quella scheda è aperta). Verificare con screenshot + banco browser +
giro isolato prima di dichiarare la fetta fatta. Poi G47c-2 (linea/
polilinea libera), poi G47b (livelli di disegno veri: `D2.layers` come
registro nominato invece dei booleani ad-hoc `iso`/`rel`/`ene`/`inn`),
poi G47d (import DXF, con la validazione della convenzione degli assi
prima di fidarsi di un punto importato).

Nessuno stop volontario: si prosegue subito con G47c-1.
