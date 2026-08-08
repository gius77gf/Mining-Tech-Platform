# Checkpoint — 2026-08-08T00:05:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ba14cdc` — *nomi-liberi: la seconda domanda anche sui MODULI*

## Che cosa è stato completato

Chiuso il rimandato scritto nel checkpoint precedente: la seconda domanda —
*il nome esiste, ma esiste QUI?* — girava solo sulle **pagine**. Adesso gira
anche sui **18 moduli**, dove il difetto è **peggiore**: un nome libero non fa
rumore all'import, esplode quando quella riga viene **eseguita**, cioè magari
in un ramo che le prove non toccano. E i moduli non hanno script fratelli,
quindi il conto è più stretto e più affidabile.

⚠️ **Costo misurato prima di pretenderlo**, come per le pagine e come pretende
la regola del 07/08: **0 allarmi su 6.698 chiamate e 18 moduli**. La misura è
stata fatta con una riga di stampa provvisoria e solo dopo trasformata in
asserzione — non il contrario.

**La controprova.** `somma` è dichiarata dentro **tre funzioni diverse** di
`terra-data.js`, ognuna con la sua: è la forma esatta dell'omonimo che inganna
la prima domanda. Iniettata una sua chiamata in `anniConVolumi`, che una
`somma` non ce l'ha, la prova pretende **tre** cose in fila:
1. che la **prima** domanda resti cieca (`nomiLegati` lega comunque il nome) —
   se un giorno lo vedesse, questo racconto è invecchiato e va **riscritto**,
   non spento;
2. che la **seconda** lo veda;
3. che sul modulo **sano** non accusi nessuna delle tre dichiarazioni vere —
   una guardia che si accende sempre non è una guardia.

## Prove

`nomi-liberi` **10 → 12** prove (non è fra le sei suite che contano
asserzioni: i conti dei documenti non si muovono). Giro `node`: **23 comandi,
0 caduti**, sulla copia di quello che si committava.
Il riepilogo del file adesso porta il denominatore per intero: *«seconda
domanda (lo scope): 18.656 chiamate su 12 pagine e 6.698 su 18 moduli, 0 fuori
scope»*.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre trenta commit fa, quindi il suo verde non riguarda quello
che c'è adesso. Ordine: prima le righe **«non ho guardato»** (denominatori,
superfici non raggiunte, «0 su N»), poi i KO, distinguendo le **controprove**,
dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

- ⏱️ **Scudo · verbale DPI**: «Consegnato il» scriverebbe «—» su una data
  assente, mentre la colonna accanto è stata corretta il 03/08 per esattamente
  questo. Proposto da un cantiere, **non ancora verificato da me** — e per
  regola non entra sulla parola dell'agente.
- ⏱️ **La stessa domanda sui riferimenti, non solo sulle chiamate.** Oggi
  `nomi-liberi` guarda `nome(`; un `const x = pippo` con `pippo` inesistente
  non lo vede — dichiarato nell'intestazione fin dalla prima stesura, e mai
  misurato. Prima di scriverlo: **contare gli allarmi su una copia**, perché lì
  il rumore atteso è molto più alto che sulle chiamate.

## Blocchi
Nessuno.
