# Checkpoint — 2026-08-08 14:47 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`57c78cf` — fix(campo,scudo): le spunte di due persone non si cancellano più

## Che cosa è stato completato
**Tre punti su dodici** della misura 5b passano al **percorso puntato**: la
checklist del giro macchina (Campo) e le due note/foto delle ispezioni (Scudo).
Due persone che spuntano voci **diverse** della stessa lista non si cancellano
più a vicenda.

### I due pezzi che il piano non prevedeva, e che li ha trovati l'apertura
1. **Il contrassegno di cancellazione.** Le due di Scudo sanno anche
   **togliere** una voce, e col percorso puntato una cancellazione non si
   scrive con `undefined` — si scrive con `deleteField()`. Ma le pagine non
   hanno in mano le primitive di Firestore: il livello dati le nasconde
   apposta. Quindi `DW_CANCELLA`, che ognuna delle due strade traduce a modo
   suo (`deleteField()` col database vero, `delete` nella dimostrazione).
   ⛔ È un oggetto **congelato e unico**, non una stringa: una sentinella
   scritta come testo può collidere con un dato vero, e quella collisione non
   produce niente da leggere. C'è la prova che una stringa somigliante **resta
   un dato**.
2. **`percorsiDi`, che sa dire NO.** Una chiave che contiene **già** un punto
   verrebbe spezzata, e il dato finirebbe in un ramo che non esiste **senza
   nessun errore**. Risponde `null` — la convenzione di casa per «non si può»
   — e chi chiama riscrive l'oggetto intero: meno buono, non sbagliato. Tutti e
   tre i punti hanno quel ripiego scritto.

## Verifiche
- **il giro VERO**, non la sola funzione: si apre il livello dati della
  **dimostrazione** (`campoData()`, mode `demo`), si spuntano due voci
  diverse con **due scritture separate** come due telefoni, e si pretende che
  convivano, che non resti nessuna chiave letterale col punto, e che il
  contrassegno tolga la voce davvero;
  ⚠️ è `await test(...)`: una prova asincrona **lasciata in volo** in fondo al
  file non verrebbe aspettata. Misurato che sale davvero: **1904 → 1905**, e le
  «asincrone aspettate» da **6 a 7**;
- **controprova sui file veri, due versi**: togliendo la traduzione a **una**
  app la guardia del collegamento cade e la **nomina**; togliendo il rifiuto
  delle chiavi col punto cade `percorsiDi`;
- giro `node` **27/27** sul disco e sulla copia (patch identica);
- pagine aperte davvero: campo **38 ok / 0 KO**, scudo **33 ok / 0 KO**.

## Restano NOVE punti, dichiarati
Gli **elenchi** (Sentinella `letture`/`tarature`, Scudo `azioniId`,
`misure`) vogliono una **transazione**, non `arrayUnion`: uno corregge una
lettura già dentro (l'indice di un array non si scrive col percorso puntato),
uno aggiunge **e taglia** a `MAX_LETTURE`, uno è un **import in blocco**.
E `atmosfera` **non è** il caso della spunta persa: è un modulo inviato intero.

## Prossimo passo atomico
**Gli elenchi con `runTransaction`**, partendo da `letture` di Sentinella —
il più affilato, perché due import sullo stesso punto di monitoraggio ne perdono
uno e quelle letture finiscono nel report per l'ARPA. Serve prima capire come il
livello dati espone una transazione (oggi non la espone: è una **firma da
allargare**, non una copia da fare).
⛔ La **coda offline** resta per ultima.

⏳ E resta da raccogliere il **giro del browser** (PID 16670, ~3h11), registro in
`scratchpad/nomi4/giro-nuovo.txt`: `leggi-giro.mjs`, sezione 1 prima della 2.
⚠️ Attesta `c3888fe`. ⚠️ Il rosso di una controprova è il verde del banco.

## Blocchi
Nessuno.
