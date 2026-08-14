# Checkpoint — 2026-08-08T02:18:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`aabadeb` — *nomi-liberi: la terza domanda anche sui MODULI*

## Che cosa è stato completato

La terza domanda — i nomi **riferiti** dentro un `${…}` — girava solo sulle
pagine. Adesso gira anche sui **18 moduli**, dove il difetto è peggiore: un
nome libero **non fa rumore all'import**, esplode quando quella riga viene
**eseguita**, magari in un ramo che le prove non toccano. E i moduli non hanno
script fratelli, quindi il conto è più stretto.

Misurato: **181 riferimenti su 18 moduli, zero liberi.**

⚠️ **E la soglia del «ha davvero guardato» l'avevo scritta a occhio — 200 — e
la prova è caduta al primo giro sui 181 veri.** Una soglia si prende dalla
**misura**, non dall'impressione: è la stessa regola dei numeri nei documenti,
in miniatura, e stanotte è la quarta volta che il righello sbaglia prima del
soggetto. Ora è **150**, col numero misurato scritto accanto.

## Lo stato di `nomi-liberi`, dopo questa notte

Tre domande, tutte con il loro denominatore stampato:

    18.657 chiamate su 12 pagine, 6.699 su 18 moduli
    seconda domanda (lo scope):     18.657 + 6.699, 0 fuori scope
    terza domanda (i riferimenti):   3.771 +   181, 0 liberi

**7 → 16 prove** in una notte, e ogni domanda ha la sua controprova con un
difetto **vero** dentro (il `conta` di Terra, il `somma` di `terra-data`, il
`RIPOSO_MINIMO_ORE` di Campo).

## Prove

Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre sessanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **La regola dei trattini su Flotta**, ferma a misura: i tre legittimi
   stanno **fuori da qualunque tabella** (le tessere «Consumo» e «Gasolio», e
   il conto dei giorni di un fermo senza data). La via che regge è dare a
   quelle tessere un'**intestazione leggibile dal DOM**, non allargare la
   regola.
2. ⏱️ **La terza domanda con la forma `nome` nuda** (non `${nome}`): oggi
   guarda solo i riferimenti dentro i template. Un `const x = pippo` fuori da
   un template resta invisibile — e lì il rumore atteso è **molto** più alto,
   quindi la misura va fatta prima e potrebbe dire di lasciar perdere.

## Blocchi
Nessuno.
