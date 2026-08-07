# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-07 **14:51 UTC**
**Commit di partenza:** `efcf16f`

**Che cosa fa adesso.** Raccoglie i **quattro cantieri** che ha chiesto di
riconsegnare (la geometria del gradiente nel righello del contrasto, la barra di
Sentinella a 320 px, le nove uscite del core, i tre campi della verifica
periodica in Scudo) e la **ricerca sulla denuncia annuale** delle cave per Terra.
Poi, a fine giornata, applica le **quindici decisioni verdi** col piano già
scritto in roadmap (`ae2255d`): sette si applicano scrivendole, otto vogliono un
cantiere, e ognuna va dichiarata **decisa dal ciclo** nel messaggio di commit.

> ⛔ **L'ALBERO È SPORCO DI PROPOSITO, E NON VA COMMITTATO ALLA CIECA.** Alle
> 14:33 risultano modificati `contrasto.mjs`, `barra-etichette.mjs`,
> `apps/sentinella/index.html`, `apps/scudo/scudo-data.js` e `index.html`: sono
> **cinque file di quattro cantieri vivi**, scritti negli ultimi minuti. Non è
> lavoro dimenticato, è lavoro **a metà** — misurato, non supposto:
> `copertura-funzioni.mjs` dice **«1 soggetto con funzioni senza prova»**,
> perché Scudo ha già le funzioni nuove e non ancora le loro prove.
> Chi riprende il ciclo da qui: **non fare `git add` di quei file**. Si aspetta
> che il cantiere riconsegni, si verifica sulla copia di quello che si committa
> (`git worktree` + `git diff --cached | git apply` + `git add -A`), e si
> committa **app per app**. Tutto il lavoro *mio* è già committato e pushato.

**Che cosa è successo nel blocco precedente (06:05 → 09:44).** Undici commit, e
il filo è uno solo e scomodo: **tutte le cose che pesano riguardavano lo
STRUMENTO, non il prodotto.**

⛔ **Il righello dei colori mentiva.** `color-mix()` — che i temi delle app usano
— Chromium lo risolve in `color(srgb 0.163608 …)` coi canali da **0 a 1**, e il
banco li leggeva come 0-255: inchiostro nero, fondo nero, **1,01:1** su un testo
che a occhio fa più di 15:1. Erano **560 bocciature su 3.646**, e stavo per
aprire un cantiere per rifare la palette di sei app.
⚠️ E la prima correzione era una **toppa**: aggiunta la conversione per quella
notazione, un'ora dopo il fondo di Flotta è tornato `oklab(…)` — che nessun
foglio scrive, lo produce il browser interpolando. Adesso il colore lo dipinge
una tela e lo si rilegge (la stessa conversione che il browser fa per lo
schermo), e quando non lo capisce nemmeno lui la risposta è `null`: **non
misurabile non è bocciato e non è promosso**.
Esito onesto: **54 vere**, verificate a mano alla cifra.

⛔ **E il runner del giro riusava il server di un altro giro.** La regola del
contrassegno col pid è scritta in CLAUDE.md dal 01/08 e la rispettano i singoli
banchi: **non la rispettava il file da cui dipendono tutti**. È costato un giro
intero e ventidue KO che accusavano Scudo di **non esistere**.

⛔ **E i tre cantieri fermati dal limite delle 6:40 non si sono buttati.**
Misurato invece che deciso: `run-kpi` girava già 1841 su 1841, mancavano tre
cose meccaniche. Portandole a termine è saltato fuori l'ultimo KO del banco
nuovo di Genesi, **vero**: il messaggio di conferma non nominava l'**innesco**,
che è il campo che riaperto sbagliato porta lo scatter da 0,1 a 8,0 ms in
silenzio.

⚠️ **Il difetto di prodotto più grosso che resta aperto, e non è chiuso da
nessuno**: nel tema **`sole`** — quello per chi legge il telefono **in cava,
sotto il sole** — ci sono **54 violazioni AA**. Fra le peggiori: «Conforme» nel
report per l'ARPA a **2,35**, il giallo di «sta per scadere» a **1,79**, la riga
«DATI DI ESEMPIO» a **1,69**. `--tema=sole` NON è registrato nel giro di
proposito: un banco registrato che fallisce rende rosso il giro di tutti, e
queste 54 si chiudono con una **palette**, non con una correzione.

⚠️ **E le 19 decisioni scadono OGGI, a fine giornata.**
