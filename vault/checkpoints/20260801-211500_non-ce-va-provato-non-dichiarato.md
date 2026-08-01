# «Non c'è» va provato, non dichiarato

**Data:** 01/08/2026 · **Area:** `docs/CONCORRENTI_*.md`, `CLAUDE.md`
**Unità precedente:** `20260801-203000_le-regole-nuove-del-ciclo-e-le-ricerche-sui-concorrenti.md`
(commit `f75a9e8`)

## Che cosa è successo

Prima cosa fatta col delta delle sei ricerche sui concorrenti: **verificarlo
invece di crederci**. Delle tre mancanze dichiarate più ricorrenti, **due su tre
erano false**.

| dichiarato mancante | verificato |
|---|---|
| Scudo — «cruscotto degli indici: 10 concorrenti su 10, noi zero» | **falso**: indice di frequenza, indice di gravità e LTIFR sono calcolati in `scudo-data.js:1837-1838` e mostrati in `index.html:1745`, col caso `calcolabile: false` già gestito |
| Conti — «solleciti di pagamento» | **falso**: livelli di escalation per giorni di ritardo (`conti-data.js:581`), mora ex D.Lgs 231/2002, bottone per fattura (`index.html:1826`) e sezione «chi sollecitare per primo» (`index.html:635`) |
| Sentinella — «allarmi in tempo reale» | **vero**: nessun meccanismo di avviso esiste, solo commenti che distinguono avviso da allarme |

**Due cantieri stavano per aprirsi su cose già costruite**, e li ha fermati la
regola scritta tre ore prima: *niente entra in roadmap sulla parola
dell'agente*. È il ritorno più concreto che una regola di metodo abbia dato in
giornata.

## Che cosa è stato fatto

**1. I sei documenti prendono un avviso in cima**, misurato e non generico:
l'elenco delle funzioni dei concorrenti **con le fonti** vale (470 censite); il
**confronto con la nostra app no**. Chi legge parte dalla colonna del *mondo*,
non da quella del *delta*.

**2. `CLAUDE.md` guadagna la difesa per la prossima volta**: per ogni «non c'è»
l'agente deve scrivere **la prova di aver guardato** — il termine cercato e il
file, oppure la riga se l'ha trovato a metà. Un «non c'è» senza la sua ricerca
accanto vale zero, e un elenco di mancanze gonfiato è **peggio di nessun
elenco**: manda a lavorare dove non serve, che è l'unico modo di sprecare una
giornata intera.

**3. Tre cantieri aperti insieme** — Scudo, Sentinella e Terra — con un mandato
solo: riaprire ogni riga «non c'è» del proprio documento e verificarla con
almeno tre termini di ricerca diversi, scrivendo il verdetto **sempre con la
prova**. È il primo uso vero della regola sui cantieri paralleli.

## Verifica

`run-stile` **274/0**. Il giro completo del browser sta ancora girando su copia
congelata e finora è pulito: 14 superfici a posto sui tempi relativi, e la sua
controprova cade su tutte e quattordici.

## Prossimo passo atomico

Raccogliere le tre verifiche del delta e, dalle mancanze **confermate**,
scegliere il primo lavoro vero. L'unica confermata finora è quella di
Sentinella (nessun avviso quando una lettura supera la soglia): prima di
progettarla va deciso se può vivere **senza infrastruttura nuova**, perché la
regola del fondatore è che non si spende — e un avviso che richiede un servizio
di notifiche è una decisione, non un'unità.
