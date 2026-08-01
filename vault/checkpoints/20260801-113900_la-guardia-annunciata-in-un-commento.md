# La guardia annunciata in un commento

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/run-stile.mjs`,
`tests/browser/giro.mjs`
**Unità precedente:** `20260801-235958_un-limite-senza-la-norma-da-cui-viene.md`
**Canarino del ciclo:** `1812823` (11:29 UTC, ora letta da `date -u`)

## Come ci sono arrivato

Il checkpoint precedente mandava a due cose: il **giro completo del browser** e
poi la roadmap. Il giro è partito (su copia congelata, quindi si può lavorare
mentre cammina); nell'attesa ho aperto il primo item non spuntato della
roadmap — *«le due pagine dimenticate anche nei banchi del browser»* — per
scoprire che **era già stato fatto**: `id · non autorizzato` e `genesi ·
accesso` sono in `SUPERFICI` di `giro.mjs` da stamattina.

Prima di spuntare la casella ho letto la riga che quel lavoro si era lasciato
dietro:

> ⚠️ *Un elenco tenuto a mano si aggiorna quando qualcuno se ne ricorda: **il
> controllo in fondo a questo file pretende che le due liste combacino**.*

## ⛔ Quel controllo non esisteva

Non in fondo a `giro.mjs` — che finisce con `vaiA` — e **in nessun altro punto
del repo**: `grep` su `run-stile`, `combacino`, `due liste` non trova nulla.

È la **guardia scollegata** di cui `CLAUDE.md` parla due volte (il `<script>`
dimenticato, la bandiera che nessuno legge), qui nella forma peggiore:
**annunciata in un commento**, quindi chi legge la dà per fatta e non la cerca.
Un elenco che si dichiara sorvegliato e non lo è vale meno di un elenco che
ammette di essere tenuto a mano.

## Che cosa nascondeva, misurato

| elenco | superfici |
|---|---|
| regole di stile (`run-stile.mjs`) | **15** |
| giro del browser (`giro.mjs`) | **11** |

Quattro pagine passavano le regole di stile e **non le apriva nessun banco**:
su di esse nessuno ha mai misurato contrasto, id doppi, fuori-schermo, bersagli
di tocco. Tre sono pagine che un cliente apre davvero — **accesso**,
**profilo** e **amministrazione** di Deepwork ID; la quarta è la prova di
lettura nuvola/mesh di Genesi.

## Il controllo, adesso scritto

Vive in `run-stile.mjs`, perché è la suite che il censimento delle superfici lo
possiede già. Pretende tre cose e le dice separate: nessuna superficie delle
regole di stile fuori dal giro (o dichiarata in `FUORI_GIRO` **con la
ragione**), nessuna pagina nel giro che le regole di stile non guardano, e
nessuna scusa in `FUORI_GIRO` che non serva più — la stessa forma di
`sonda-vuoto`, dove un'eccezione che non si presenta più è un'eccezione che
nasconde.

⚠️ L'elenco di `giro.mjs` si legge **come testo**, non importandolo: quel file
tira dentro Playwright, e una suite `node` che gira senza rete non deve
dipendere dal browser per sapere che cosa il browser dovrebbe guardare.

**La prova che sa fallire c'è per costruzione**: scritta la regola, è caduta
subito nominando le tre pagine. È stata verde solo dopo averle aggiunte davvero
al giro.

`nuvola-poc.html` resta fuori **con la ragione scritta**: è un banco di prova
(il titolo dice «prova»), come `_collaudo-grafici.html` che era già escluso —
le regole di stile la guardano perché è HTML, ma non è una superficie che un
cliente apre.

## Verifica

`run-stile` **272/0** (era 271: la regola nuova) — l'elenco del giro passa da
**11 a 14** superfici, e l'unica rimasta fuori è dichiarata. `run-kpi` 1123/0,
`suite-collegate` 3/0 su 46 file, `date-checkpoint` 3/0, `numeri-nei-documenti`
17/0 — caduta 3 volte sul totale delle prove e sui suoi addendi, e aveva ragione
tutte e tre.

⚠️ **Il giro completo del browser è stato fermato a due banchi su 39**: cambiando
l'elenco delle superfici il suo esito sarebbe stato comunque superato, e tenere
lavoro non committato in attesa di un risultato che sta per essere buttato è
peggio che rilanciarlo. Va rifatto **sulle quattordici** superfici, ed è il passo
successivo.

## Prossimo passo atomico

Il **giro completo** con le **quattordici** superfici: le tre pagine appena
aggiunte non le ha mai aperte nessun banco, quindi è probabile che qualcosa
salti fuori — contrasto o bersagli di tocco sono i due che pescano di più su
pagine mai guardate. Se esce un difetto, quello diventa l'unità successiva; se
non esce niente, si va al secondo item aperto della roadmap (**E0,
consolidamento in `shared/`**).
