# Checkpoint — 2026-08-09T12:30:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3935940`

## Task completato

**Le 10 righe «SCADUTA» rimaste, verificate per nome — e la decisione di NON
toccare le 157 citazioni che restano.**

| verifica | esito |
|---|---|
| 12 nomi citati da Sentinella (tarature, provenienza) | **12 su 12 esistono** |
| 7 nomi citati da Scudo (appaltatori/DUVRI) | **7 su 7 esistono** |
| 4 nomi di Terra, 19 di Conti (fatto prima) | **tutti esistono** |
| citazioni `file:riga` col nome | **0 su 0** (erano 87 su 91) |
| citazioni `file:riga` senza nome | **157, dichiarate e NON toccate** |

## Le tre cose imparate

1. ⛔ **NON SI TOCCA UN SOGGETTO SANO PERCHÉ LO DICE UN'INFERENZA.** Sulle
   citazioni **col nome** la staleness era **misurata** — 87 su 91, e ho tolto
   i numeri. Sulle 157 **senza nome** sarebbe stata **dedotta** («saranno
   marce anche quelle, sono della stessa famiglia»): plausibile, e non è una
   misura. Toglierle costerebbe informazione vera dove il numero è ancora
   giusto, ed è la stessa trappola del `quantiMesi` corretto e poi ripristinato.
2. ⛔ **E LA SCORCIATOIA PER MISURARLE È STATA PROVATA E SCARTATA COL NUMERO.**
   «Quante puntano **oltre la fine** del file?» sembra il controllo che si può
   fare senza conoscere il soggetto. Dà **0 su 157**, e quello zero **non vuol
   dire niente**: i file crescono, quindi la condizione diventa ogni giorno più
   difficile da innescare. È il **fondo su un valore monotòno** già censito in
   `CLAUDE.md` per `copertura-funzioni`, in una veste nuova — e va scritto
   perché nessuno lo rifaccia scambiando quello zero per una buona notizia.
3. ⛔ **UN «0 SU 0» VA SPIEGATO, se no si legge come «tutto a posto».** Il
   controllo adesso dichiara **tutt'e due** le popolazioni: quella verificabile
   (0 su 0, perché la convenzione è cambiata) e quella che non lo è (157,
   intatte, col perché). Un numero che vale zero per una ragione buona e uno
   che vale zero perché nessuno guarda si scrivono identici.

## Verifiche
- ogni nome citato dalle dieci righe cercato **col comando** su
  `sentinella-data.js` e `scudo-data.js`: **19 su 19 presenti**
- `documenti-invecchiati` **15/0**, con le due popolazioni dichiarate
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`; oltre 4.000 righe.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito, le tredici righe «SCADUTA» sono **tutte verificate**:
la fila successiva sono le **47 «CONFERMATA ASSENTE»**, in ordine di quanto le
chiede un ispettore — e adesso hanno un conto sorvegliato, quindi chiuderne una
fa cadere il controllo finché la roadmap non segue.
⚠️ Regola da tenere: per ogni «non c'è» va **riprovato il comando**, non
riletta la riga. Una mancanza colmata da un cantiere parallelo scade in
trentaquattro minuti — è misurato.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
