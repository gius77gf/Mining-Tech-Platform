# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-07 **09:44 UTC**
**Commit di partenza:** `0f3d455`

**Che cosa fa adesso.** Raccoglie i **tre cantieri sul tema `sole`** (Sentinella,
Flotta, Conti) e legge il **giro completo pulito** su `4643be7`, che a dieci
sezioni non ha ancora un solo KO nelle passate sane.

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
