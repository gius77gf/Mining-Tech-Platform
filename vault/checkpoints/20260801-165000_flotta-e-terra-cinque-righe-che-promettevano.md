# Flotta e Terra: cinque righe che promettevano un tocco che non c'è

**Data:** 01/08/2026 · **Area:** `apps/flotta/index.html`, `apps/terra/index.html`,
`docs/LA_MANINA_CHE_PROMETTE.md`
**Unità precedente:** `20260801-163000_conti-la-manina-solo-a-chi-la-merita.md`
(commit `8607c08`)

## Che cosa è stato fatto

Portata la stessa domanda alle altre quattro app, con una sonda che **non
guarda le classi** — ogni app le chiama a modo suo — ma mette il **cursore
calcolato** contro **l'aggancio vero della riga**, sezione per sezione.

| app | voci | promettevano e non mantenevano |
|---|---|---|
| campo | 32 | **0** (già a posto) |
| flotta | 68 | 3 → **0** |
| terra | 46 | 2 → **0** |
| scudo | 118 | **91**, non toccata: vedi sotto |

Nessuna app ha il difetto opposto — una riga viva che non lo dice — in nessuna
delle sei.

**Flotta**: mancava `statico` alla lista delle scadenze. La stessa lista, resa
dentro la scheda del mezzo, la classe ce l'aveva: due rese della stessa cosa, e
una si era dimenticata.

**Terra**: mancava `cursor:default` alle righe «da quale fronte, secondo i
turni», che sono di sola lettura. Terra la usa in quattro punti su cinque.

Tutt'e due seguono la convenzione che l'app **usa già**, non una nuova.

## ⚠️ E la sonda ha dovuto imparare una terza forma di «viva»

Non solo `onclick` e non solo un `data-` con una delega, ma anche essere una
**`<label>` con dentro un controllo** — cliccabile per natura. Senza,
Conti risultava con otto righe bugiarde che bugiarde non erano.

## Verifica

Dopo: campo **0/0**, flotta **0/0**, terra **0/0** — e Conti e Sentinella
erano già state portate a zero nelle due unità precedenti.
`run-stile` 274/0, `run-kpi` 1123/0, `numeri-nei-documenti` 17/0.

## Il censimento, e la cosa che non ho fatto

`docs/LA_MANINA_CHE_PROMETTE.md` raccoglie la misura e — più importante — il
problema che le correzioni **non** risolvono: **sei app, cinque convenzioni
diverse** per dire «questa riga si tocca».

| filosofia | app |
|---|---|
| parti viva, marca le ferme | campo (stile in riga), flotta (`.statico`), terra (stile in riga) |
| parti ferma, marca le vive | conti (`.tap`), sentinella (`.cliccabile`) |
| parti viva e basta | **scudo** |

Due versi opposti, tre nomi, due modi di scriverla — la forma che `CLAUDE.md`
chiama per nome: *una regola che serve a due app vive in `shared/`*. Il costo si
è già visto due volte oggi, in piccolo, ed è esattamente il difetto che ho
appena corretto in Flotta e in Terra.

⛔ Per questo **Scudo non l'ho toccata**, pur essendo il caso grosso (91 righe
su 118): correggerla copiando a occhio una delle cinque convenzioni vuol dire
scriverne una sesta volta. La decisione riguarda tutte.

## Prossimo passo atomico

La convenzione **una sola, in `shared/dw-app-ui.css`**, nel verso giusto:
*parti ferma e marca le vive*. La ragione è misurabile: dimenticare di marcare
una riga **viva** si vede subito (non si accende); dimenticare di marcare una
riga **ferma** non si vede — ed è il difetto di oggi, cinque volte.
Poi Scudo con quella, e un banco del browser che pretende **zero promesse
mancate** su tutte le superfici, stampando quante voci ha guardato.
