# Checkpoint — la tracciabilità del volume arriva fino al verbale

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

Chiuse le unità **1, 2 e 3** della scheda (la 4, le funzioni pure, era già
dentro dal ciclo scorso).

## 1 — Il visore conserva quello che già calcolava

`volumeCumulo` restituisce cinque valori e il visore ne salvava **uno**.
`zBase`, `cella`, `areaCelle`, `celle` e la **scatola del ritaglio** finiscono
ora in `calcolo` dentro il record `genesiNuvole`.

Il lato cella ha anche un nome adesso (`_cella`) invece di essere un'espressione
dentro la chiamata: è il numero che vale il **22%** e che sceglie il software,
non l'utente.

## 2 — Il ponte di Terra li porta dentro, e **la data non si inventa più**

C'era `$("new-ril-data").value = oggiISO()` seguito da `err("new-ril-data",
false)`: la data messa a **oggi** e il campo subito marcato **valido**. Chi
elabora il volo del lunedì il giovedì si ritrovava un rilievo datato giovedì,
precompilato, verde, e **nessun motivo per guardarlo** — e quella data entra nel
confronto fra due rilievi, nei giorni fra i due, nel ritmo al mese e nel periodo
del canone.

Ora si usa la data del record del visore, si **dice da dove viene** («la data è
quella del caricamento nel visore (…): confermala se il volo è di un altro
giorno»), e il campo **non** viene marcato valido: prende il fuoco. Se il visore
non ce l'ha, il messaggio lo chiede invece di riempirlo.

`origine` viaggia col rilievo **solo se viene davvero dal visore**, e si azzera
dopo ogni registrazione — se no il rilievo successivo, scritto a mano,
erediterebbe un lato cella che non ha mai avuto.

## 3 — Il verbale lo stampa

La sezione si intitola «Come è stato ottenuto il numero» e finora diceva solo la
**classe di accuratezza** — cioè quanto fidarsi, non da dove viene. Ora chiama
`descriviOrigine(r)`: per un rilievo dal visore stampa lato cella, quota di base
(col perché del 2° percentile), area coperta, punti del ritaglio sul totale e la
scatola; per uno senza provenienza **dichiara** che il numero non è
riproducibile, invece di tacere.

## ⚠️ Quello che NON è verificato, e va detto

Il banco che ho scritto per leggere la sezione del verbale **non l'ha
raggiunta**: la funzione che compone il documento non è esposta su `window`, il
banco è caduto nel ramo «si prova dal bottone» e ha stampato *«1 prove, 1
passata»* — cioè ha verificato solo che la pagina si apra. **Non lo conto come
verifica**: è esattamente un controllo che dice ok senza aver guardato dove
crede.

Verificato davvero: le **7 prove** su `descriviOrigine` (che coprono tutti i
rami, incluso quello d'assenza), il **punto di chiamata** nel verbale, l'import,
e le suite tutte verdi.

## Prossimo passo atomico

1. **il banco del verbale, fatto per davvero**: premere il bottone della stampa
   e leggere il documento che si apre, con la controprova che toglie
   `descriviOrigine` dalla riga e pretende la caduta;
2. **unità 5** della scheda: la cella si mostra e si può cambiare nel visore —
   adesso che il numero scelto viene almeno registrato;
3. la nota di credito nell'export per il commercialista.
