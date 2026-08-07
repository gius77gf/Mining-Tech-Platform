# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-07 **06:05 UTC**
**Commit di partenza:** `c203fc3`

⚠️ **E questo ciclo parte con un limite della piattaforma già scattato.** I tre
cantieri aperti sul blocco precedente (Campo, Genesi, Terra) sono stati
**interrotti a metà** da «hai raggiunto il limite di sessione, si riapre alle
6:40 UTC». Il loro lavoro è **sul disco e non committato**: `apps/campo/`,
`apps/genesi/`, `apps/terra/`, più `run-kpi.mjs`, `copertura-funzioni.mjs` e un
banco nuovo non tracciato. Non va committato finché non è verificato — un'unità
interrotta a metà committata è peggio di un'unità non fatta.

**Che cosa è successo nel blocco precedente (03:43 → 06:00).** Nove commit.

⛔ **Il filo: una domanda sola, e ha risposto in QUATTRO VERSI.** La domanda di
CLAUDE.md — *dove questa app compone qualcosa che esce, chi decide i suoi
numeri?* — finora era stata usata in un verso solo. Applicata a Flotta, Scudo,
Conti e Sentinella ne ha dati quattro, e tre erano nuovi:
1. **il file più povero dello schermo** (il verso classico): in Conti il CSV per
   il commercialista scriveva `insoluta;0;9750` dove la stampa della **stessa**
   fattura diceva già «Annullata, esigibile € 0,00»;
2. **lo schermo più povero del file** — in Flotta e in Scudo la pagina buttava
   via un dato che il file conservava. **Nessuna prova lo guardava, perché tutti
   cercano il difetto nell'altra direzione**;
3. **tutt'e due tacciono**: la fattura che non quadra lo diceva solo a chi la
   stampava, e quella bandiera era letta in **1 punto su tutta l'app**;
4. **un'uscita che nessun banco guardava**: il censimento per **somiglianza**
   trovava 4 uscite di Scudo, quello per **effetto** ne trova **7** — due stampe
   e gli **appunti**, il cui testo era completo, credibile e con **zero parole**
   che dicessero che è una dimostrazione. È l'uscita con la difesa più debole e
   **l'unica che va a una persona**.

⛔ **Il difetto che chiede soldi**: nel sollecito di Conti una **nota di
credito** usciva come «acconti per € 9.000» quando il cliente ne aveva versati
6.000 e 3.000 li avevamo stornati noi. Il residuo era giusto e la sottrazione
tornava — per questo non si vedeva.

⛔ **E 24 grafici su 38 erano disegnati fuori scala**, in cinque app su sei. Il
documento diceva «uno su tre», ma era misurato sulle sole schermate
d'**apertura**: Flotta, dichiarata sana, ne aveva **7 su 8**, e l'unico pulito
era proprio quello che era stato guardato.

⚠️ **La lezione del blocco, e vale più dei difetti: il controllo ha sbagliato
prima del prodotto QUATTRO volte, tre delle quali mie.** Il setaccio che avevo
scritto per non rileggere un rosso di controprova come un guasto ha sbagliato
due volte di seguito; l'elenco delle attese di una controprova diceva «62 su 70»
mentre il banco era a posto; e la ragione con cui era stata giustificata una
correzione del core aveva l'aritmetica giusta su una superficie che **non
esiste** (`outdoor-mode` nel core è codice morto).
La cura strutturale: **un dato che il programma ha in mano non si indovina dal
testo** — adesso il registro del giro dichiara da sé quali passate sono
controprove.

**Che cosa fa adesso.** Riprende dal checkpoint
`20260807-052700_una-domanda-sola-in-quattro-versi.md`, con in mano una misura
appena fatta e non ancora committata: il banco del contrasto guardava **un tema
su tre**, e aperto il tema `sole` — quello per chi legge il telefono **in cava,
sotto il sole** — dava **560 bocciature su 3.646 testi**.
⛔ Ma **la stragrande maggioranza era il righello**: `color-mix()`, che i temi
delle app usano, Chromium lo risolve in `color(srgb 0.16 0.18 0.07)` con i
canali da **0 a 1**, e il banco li trattava come 0-255 — inchiostro nero, fondo
nero, **1,01:1** su un testo nerissimo su bianco. Corretto il parser: **da 560 a
29**. Le 29 vanno guardate una per una prima di dire che sono vere.

⚠️ **E le 19 decisioni scadono OGGI, venerdì 07/08, a fine giornata.**
