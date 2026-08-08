# Checkpoint — 2026-08-08 15:30 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`924c442` — fix(scudo): azioni collegate e misure del permesso dentro la transazione

## Che cosa è stato completato
Quarto passo della 5b, e **chiude i punti di Scudo**. `trasforma` entra nel suo
livello dati sulle **due strade** — con la **stessa** funzione condivisa che usa
Sentinella, non una seconda copia — e i due punti a elenco ci passano:
- **`azioniId`**: due persone che collegano azioni diverse alla stessa analisi
  si cancellavano a vicenda. E il controllo «questa azione c'è già» va rifatto
  **dentro** la transazione, se no si torna a decidere su una lettura vecchia —
  quando c'è già **non si scrive affatto** (è a questo che serve il contratto
  «niente da fare non scrive»);
- **`misure`** del permesso di lavoro: si rilegge anche **il verso** della
  spunta (mettere o togliere), perché deciderlo su una lettura vecchia è lo
  stesso errore un passo più in là.

## ⚠️ La guardia che guardava la cosa sbagliata
`collegaAzioneAllAnalisi` aveva `if (!db.aggiorna) return` — rimasta a
guardare **la funzione che non usa più**. Su un livello dati senza
`trasforma` sarebbe passata e poi morta. Allineata a ciò che si usa.

## Verifiche
- la **guardia collegata** pretende `trasforma` su **tutt'e due** le
  dimostrazioni, per nome: togliendola a Scudo **cade e lo dice**. Se domani
  servirà a una terza app, quella riga lo fa vedere subito;
- giro `node` **27/27** sul disco e sulla copia (patch identica);
  `run-kpi` **1908**; pagina di Scudo aperta davvero (**33 ok / 0 KO**).

## Restano TRE siti, dichiarati
Sentinella: la **correzione** di una lettura già dentro, e le `tarature` (×3
chiamate, 2 siti). Stessa cura, stesso `trasforma`.

## Prossimo passo atomico
Le **tarature di Sentinella** e la **correzione di una lettura** — gli ultimi tre
siti dei dodici. Poi la 5b ha finito la sua parte «conflitti», e resta solo la
**coda offline**, che va per ultima e nel browser.

## Da guardare
⚠️ **L'esito della CI su `d4c7bea`** (la correzione del rifiuto non gestito):
in casa la controprova non riproduce la corsa, quindi è la CI a dire se è
chiusa. Se fosse ancora rossa, il rifiuto arriva da un altro punto e va cercato
lì — **non si ritocca la sonda a caso**.
⏳ Il **giro del browser** (PID 16670) attesta `c3888fe`: nessuna delle
quattordici unità di oggi è dentro.

## Blocchi
Nessuno.
