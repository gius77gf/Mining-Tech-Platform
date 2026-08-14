# Checkpoint — 2026-08-08T02:28:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`5df42f6` — *Flotta: i trattini diventano regola, e l'eccezione che non si riusciva a nominare era un difetto*

## Che cosa è stato completato

Chiuso l'ultimo foglio rimasto a **misura** invece che a **regola**. Guardati
uno per uno i trattini del libretto macchina:

**Cinque sono risposte vere**, e stanno nell'elenco **per nome**:
- **«Quota»** — colonna spenta di proposito (`quota: false`): sommare
  percentuali non ha senso, quindi il conto sul totale **non esiste**;
- **«Consumo», «Gasolio», «Ore motore», «Officina»** — le tessere, dove il
  commento del codice lo dice già: *«non misurato non è zero»*. E lì quel «—»
  ha **sostituito** un «€ 0,00» **in verde**, che era il numero più tranquillo
  della tessera proprio dove nessuno aveva scritto niente.

⛔ **Il sesto non è finito in elenco, ed è la parte che insegna.** Il conto dei
giorni di un fermo **senza data d'inizio** scriveva «—» accanto a righe che
dicono «11 giorni» — cioè **«nessun giorno»**. La sua etichetta è la **frase
intera** della riga, quindi nominarlo sarebbe stato **fragile**; e la via
giusta non era allargare la regola, era **dare la parola al prodotto**: adesso
scrive **«non calcolabili»**.

> **Un'eccezione che non si riesce a nominare è spesso il segno che non è
> un'eccezione.**

⚠️ E una prova che c'era già era agganciata **al segno** invece che alla cosa:
pretendeva il trattino su quelle due righe, e sarebbe diventata rossa su una
correzione **giusta**. Ora pretende la **parola**.

`TRATTINI` confronta adesso anche l'etichetta di un trattino **fuori da una
tabella** («fuori tabella: CONSUMO»): le tessere di un foglio non hanno
un'intestazione di colonna, e senza questo il loro «—» non si poteva dichiarare
per nome — restava solo la scelta fra **accusarle** e **non guardarle**.

## Stato dei fogli stampati, chiuso

Tutti e cinque i fogli raggiungibili sono ora **sotto regola**, con le
eccezioni dichiarate per nome: Sentinella («Ora»), Scudo («Taglia»), Conti
(«Sconto»), Terra (nessuna), Flotta (cinque voci). Nessuna misura muta.

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.
`stampe-fs --solo=flotta`: 13 su 13.

## In volo

⏳ **Il giro del browser** gira sulla porta **8831**, uscita in
`scratchpad/io-core/giro-6.txt`, su una **copia di `e65d20e`** (lo dichiara
nella sua prima riga). Al momento del checkpoint è a ~212 righe su ~5.000. Le
tre intestazioni di **controprova** viste finora dichiarano già da sé che «il
rosso qui sotto è quello VOLUTO».

## Prossimo passo atomico

⛔ **Raccogliere `giro-6.txt` quando finisce** (in coda scrive `USCITA <n>`),
nell'ordine che non si negozia:
1. le righe **«non ho guardato»** — denominatori, superfici non raggiunte,
   «0 su N»: un rosso lo si vede, un «0 su 68» in fondo a una pagina di verde
   no;
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. se il giro esce con **2** si è dichiarato **non valido** da sé e va rifatto.

Poi:
1. ⏱️ **La terza domanda di `nomi-liberi` sulla forma `nome` nuda**, fuori dai
   template: oggi guarda solo dentro `${…}`. Un `const x = pippo` resta
   invisibile, e lì il rumore atteso è **molto** più alto — la misura va fatta
   prima e **potrebbe dire di lasciar perdere**, che è una risposta legittima.
2. ⏱️ Le proposte delle schede di ricerca, per priorità.

## Blocchi
Nessuno.
