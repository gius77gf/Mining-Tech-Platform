# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-08-14, 12:13 UTC
- **Commit di partenza**: `87f8e568`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint
`20260814-120500_la-regola-che-guarda-dove-il-browser-non-arriva.md` — trovato
per **data vera** (`git log --name-only -- vault/checkpoints/`), non per nome.

⚠️ **Non si riparte da fermo: quattro cantieri stanno già lavorando** sul tema
della settimana — *i numeri che mentono con la faccia tranquilla* — uno per app
sui perimetri liberi, e un **giro mirato del browser** gira su una copia
immobile di `ffcb8b16`:

| cantiere | perimetro | che cosa cerca |
|---|---|---|
| Flotta | `apps/flotta/` | 22 ripieghi «di mestiere» censiti, da portare al gradino 2 |
| Conti | `apps/conti/` | 18, e i punti dove il **documento si compone** |
| Terra | `apps/terra/` | 19, e il foglio che va **all'ente** |
| Genesi | `apps/genesi/` | 111 — l'app dove il difetto è nato (`B \|\| SPALLA`) |

Nessun cantiere committa: raccolgo io, uno per volta, con l'indice costruito da
`HEAD` più il solo blocco di ciascuno (in `run-kpi.mjs` scrivono in quattro), e
la verifica sulla **copia di ciò che si committa**.

## Da dove viene questo tratto

Il blocco precedente ha chiuso otto unità con la CI verde su tutte: la **gara
sui claims** che la CI trovava una volta su trenta (un aggiornamento perduto
vero, non un flaky), la lettura **senza valore** che in Sentinella contava come
misura di **zero** — col file per l'ARPA che diceva «Conforme» —, la **maglia
non scritta** che nel core usciva `3,5 × 4` fin sul PDF, i **comandi muti**
nella finestra di caricamento (18 su 21), i contatori nati «0» in Flotta e
Conti, e la **regola 21** che guarda dove il browser non arriva.

## Il primo passo

Raccogliere i cantieri appena consegnano e leggere il giro mirato con
`browser/leggi-giro.mjs`, riverificando ogni KO **prima** di aprirci sopra un
cantiere: un KO su una domanda che in quel registro non era mai comparsa prima
è quasi sempre un banco migliorato a metà giro, non un difetto del prodotto.

---

# Ciclo del 2026-08-14, 15:13Z — «i numeri che mentono con la faccia tranquilla»

**Commit di partenza: `a65802be`.** Branch
`claude/scheduled-tasks-remote-control-bk4ap6`, allineato col remoto (0 commit
da tirare).

## Che cosa sto per fare

Tre cantieri sono **vivi in questo momento** e non hanno ancora consegnato:

| cantiere | perimetro | che cosa cerca |
|---|---|---|
| Scudo | `apps/scudo/`, regola 21 | i clamp mai letti, e i **fratelli** di un contatore riempito solo dentro un ramo che può non essere mai preso |
| core | `index.html` | i 50 ripieghi rimasti **dopo** `magliaDetta`, a partire dallo stesso campo con **due costanti diverse** (`lunghezza_m \|\| 20` contro `\|\| 5`) |
| Sentinella | `apps/sentinella/` | i 20 ripieghi, e **dove il documento si compone**: il file che va all'ARPA |

Il cantiere di **Campo** ha già consegnato e il suo blocco aspetta in
`run-kpi.mjs`: si committa insieme agli altri, perché in quel file scrivono in
tre. Nessun cantiere committa; raccolgo io, con l'indice costruito da `HEAD`
più il solo blocco di ciascuno e la verifica sulla **copia di ciò che si
committa**.

## Da dove viene questo tratto

Il blocco precedente ha chiuso, con la CI verde: i **metri perforati inventati**
di Genesi (costo −42% con `calcolabile: true`, e il colpevole era un `+`, non un
`||` — `null + 0.9` fa 0,9); il **censimento che contava `|| String(x)`** come
costante di mestiere mentre il suo commento dichiarava il difetto già corretto;
e la domanda del banco della finestra di caricamento che **leggeva una schermata
sola** e accusava un pannello chiuso.

⚠️ **Un KO del giro è stato riverificato e ASSOLTO**, e sta scritto perché
nessuno ci apra sopra un cantiere: `isp-c-cnt` di Scudo resta «—» dopo l'arrivo
dei dati perché vive dentro `#isp-compila`, `display:none` finché non si apre
un'ispezione.

## Il primo passo

Raccogliere i tre cantieri appena consegnano, uno per volta, verificando ogni
numero riferito **richiamando il codice io** invece di crederci: nell'unità di
Genesi le chiavi che avevo scritto a memoria erano un'altra tabella, e il segno
che l'ha tradita è che **anche il caso sano** rispondeva «non calcolabile».
