# Checkpoint — 2026-08-08T05:03:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ca99a55` — *Sentinella: il primo documento ad arrivare a zero di arretrato*

## Che cosa è stato completato

`documenti-invecchiati.mjs` dichiara da giorni un arretrato — sei documenti di
ricerca più vecchi del codice che descrivono — e sta lì **«per essere visto
scendere»**. Sentinella era il più vicino: 12 commit, 1 che morde.

**Riverificato, non ridatato**, che è la differenza fra una verifica e una data
incollata:
- sul **diff dei 12 commit** (622 righe aggiunte): **zero occorrenze su 34
  termini**;
- sui file interi, la riga **a metà** sulla certificazione degli strumenti:
  `61672`, `45669`, `matricola`, `serial`, `numero di serie`,
  `classe.*strument` → **0 ciascuno**; `modello` ne dà **1**, ed è il modello di
  **calcolo** della PPV prevista.
- L'unico commit che morde, `e34aff3`, ha aggiunto quattro funzioni
  (`distanzaDelRicettore`, `sogliaDelRicettore`, `contaCoperture`,
  `csvRicettori`): **nessuna** costruisce una delle cose dichiarate assenti.

**Arretrato: sentinella 12 → 0**, totale delle sei app **71 → 59** commit, i
«mordono» da **16 a 15**. È il primo documento a toccare lo zero da quando il
conto esiste.

## ⚠️ E la prima riverifica l'ho sbagliata io, non il documento

Rifacendo le ricerche **senza distinzione di maiuscole e senza confini di
parola** mi risultavano cinque righe da guardare: `LoRa`=14, `Hz`=7, `m/s`=50,
`COV`=1, `API`=24. Guardate una per una:
- `LoRa` combacia con «co·**lora**·to» e «a·**llora**»;
- `COV` con `cover` (`viewport-fit=cover`);
- `API` con «C·**API**·TO»;
- e **tutte e 50** le `m/s` sono `mm/s` — l'**unità della PPV**, cioè il dato
  centrale dell'app;
- le `Hz` sono le sette etichette dei preset DIN/USBM, come il documento già
  diceva.

**Cinque falsi allarmi su cinque, e il difetto era il righello.** Sta scritto
nel documento e non solo qui, perché una riverifica fatta male **produce lavoro
su mancanze immaginarie** — che è esattamente il danno contro cui quel
documento è nato. È la sesta volta stanotte che il sospettato facile era il
soggetto ed era il righello.

## Prove

- `documenti-invecchiati`: `✓ sentinella verificato a db04ac5 · 0 commit dopo,
  di cui 0 che MORDONO`.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **1.447
righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`).
- ⏱️ **Il prossimo documento per arretrato è `terra`** (13 commit, **5** che
  mordono — il numero più alto delle sei). Stesso metodo: diff sui termini
  dichiarati, poi le righe a metà sui file interi, e **con i confini di
  parola**, che è la lezione appena pagata.

## Blocchi
Nessuno.
