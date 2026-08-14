# Checkpoint — 2026-08-14 11:03 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `745b53f5` — identità: due trigger, e quello in ritardo cancellava un'org dal token
- `0bc0f408` — Sentinella: una lettura SENZA valore contava come una misura di ZERO
- `5bcaf0b3` — core: la maglia non scritta usciva come 3,5 × 4 in sei punti, PDF compreso

## Che cosa è stato completato

**⛔ Il rosso che si presenta UNA VOLTA SU TRENTA era un difetto vero.** La CI è
caduta su `run-sdk.mjs` — «membro di DUE org cambia org attiva» → *Non sei membro
di questa organizzazione* — su un commit che conteneva **solo un file di
checkpoint**; in casa, con gli stessi tre emulatori, **19/0 per tre giri di
fila**. Tutti i segni di quello che si chiama «flaky» e si rilancia.
Sotto c'era un **aggiornamento perduto**: `rebuildClaims` legge le membership e
scrive i claims, due scritture ravvicinate sullo stesso utente svegliano **due**
trigger, e quello partito prima — che ha letto una fotografia in cui la seconda
membership non c'era — se atterra per **ultimo** lascia nel token **una org
sola**. Firestore dice `active`, il token dice di no, e non lo segnala niente
finché qualcuno non riscrive una membership.
La cura: **dopo aver scritto si rilegge** (`convergiClaims`). E la difesa non
poteva **aspettare** la gara — sarebbe stata verde quasi sempre anche col
difetto rimesso, cioè non avrebbe saputo fallire: l'**ordine delle mosse è
scritto** con dei finti (19 prove, 8 cadono con la forma vecchia).

**Sentinella — «Conforme» su un punto che non ha mai misurato niente.** Una
lettura con `valore: null` contava come una misura di **zero** (`+null` fa 0,
`Number.isFinite(0)` è true). **Rimisurato da me**, non sulla parola del
cantiere, importando il modulo di `HEAD` e quello del disco nello stesso
processo: `statoMisura` **«Conforme», ratio 0** prima, «Mai misurato» dopo — e la
stessa riga esce nel CSV per l'ARPA.
⚠️ E la mia PRIMA riverifica ha rifatto la trappola della *fixture indovinata*:
ho scritto `sogliaMms` dove il campo si chiama `soglia`, e la risposta era
«Senza soglia» — un'altra risposta giusta a un'altra domanda. Si legge il
codice del lettore **prima** di scrivere il caso.

**Il core — la maglia non scritta usciva 3,5 × 4** in barra, riquadro condiviso,
campi, schema SVG e **PDF**. Il numero più insidioso: interasse svuotato → 14
fori invece di 16 e **i mc restano identici** (126×3×4 = 144×3×3,5): il ripiego
riempie il buco così bene che un confronto affiancato non lo vede.
B0-septies (il **disegno** 2D senza maglia) è rimasta ferma al fondatore: qui
sono entrati solo i **numeri scritti a chi legge**.

## ⛔ Due lezioni sugli strumenti, tutte e due pagate oggi
1. **Un censimento degli export che non conosce CommonJS accusa il codice sano.**
   `import-esistenti` cercava solo le forme ESM e ha dato due falsi allarmi sul
   primo file delle Cloud Functions importato da una suite `node`. Costo
   dell'allargamento, misurato prima: **9 nomi veri da 2 file, zero falsi** — e i
   due nomi dell'esempio scritto **in un commento** non entrano, perché la
   scansione filtra per fase.
2. **`pkill -f` dentro un cantiere uccide anche le misure di chi lo ha aperto.**
   Un cantiere ha fermato il proprio giro per nome e ha portato via il mio, che
   stava verificando la copia di ciò che stavo per committare. Il segno è un
   registro che **si ferma a metà** e sembra un giro non ancora finito.

## Le misure
`run-kpi` **2312**, prove **2.787**, giro `node` **36 comandi a posto, 0
caduti**, **3.161** asserzioni, copertura app **755/755**. Sotto l'emulatore, con
la correzione: regole 75, SDK **19**, funzioni **21**, primo avvio **8**.
Ogni commit verificato sulla **copia di ciò che si committava** (worktree da
`HEAD` + il solo blocco di quel cantiere in `run-kpi.mjs`, messo nell'indice con
`hash-object` + `update-index`); la divisione fra i due cantieri è stata provata
rimettendo insieme i due pezzi e confrontandoli col disco.

## Che cos'è vivo
- Il **quarto giro mirato** del browser (48 passate) sta ancora girando: letto a
  metà con `leggi-giro.mjs` dà **0 KO veri su 31 passate sane**.
- Una **ricerca** in background su *che cosa contiene un rapporto di fine turno
  in cava* — solo la metà sul MONDO, come pretende la regola del 14/08.

## Prossimo passo atomico
Rileggere il quarto giro quando finisce, poi aprire **i comandi morti dentro la
finestra di caricamento**. Misurato oggi il meccanismo: in Campo i soli
`onclick` sono di **navigazione** (6, tutti `go(...)`), e ogni azione è agganciata
con `addEventListener` **dentro il modulo** — quindi nella finestra non c'è
nessun ascoltatore e premere non produce **niente**, nemmeno un errore in
console. Serve una decisione su *che cosa* deve dire la pagina.

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies** (il disegno 2D senza maglia), le
  **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**: fermi al
  fondatore.
