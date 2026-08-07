# Checkpoint — 2026-08-07 08:45:00 UTC

## Tipo
unit-complete (tre unità: il righello dei colori chiesto al browser, la guardia
della porta sul runner, e le due lezioni in CLAUDE.md)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b622f04` — *CLAUDE.md: una regola scritta qui va cercata per prima nel codice
che la usa di più*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 124 | **il righello dei colori** (`6043235`) | 560 → 29 → **54 vere**, verificate a mano alla cifra |
| 125 | **la guardia della porta sul runner** (`4643be7`) | `impronta-giro` 10 → **15** prove, nei due versi |
| 126 | **le lezioni in CLAUDE.md** (`b622f04`) | — |

## ⛔ La prima correzione era una toppa, e l'ho scoperto verificando a mano
Stamattina il banco leggeva `color(srgb 0.16 …)` coi canali 0-1 come se fossero
0-255; avevo aggiunto la conversione **per quella notazione** e 560 bocciature
erano diventate 29. Poi, verificando un KO come un OK, in Flotta il fondo
effettivo è tornato **`oklab(0.256758 …)`** — che nessun foglio scrive (il `grep`
sul sorgente dava zero): lo produce il **browser** interpolando.
Aggiungere `oklab` sarebbe stata la terza toppa, e la quarta arriverebbe con
`oklch`. ⛔ **La regola è calcolare una cosa che il browser sa dire**: si dipinge
un pixel su una tela e lo si rilegge — la stessa conversione che fa per
dipingere lo schermo, cioè quello che l'utente vede. E quando il colore non lo
capisce nemmeno lui, la risposta è `null`: **non misurabile non è bocciato e non
è promosso**, si conta a parte e si dichiara.
Esito onesto: **54 su 3.694** nel tema `sole`, e sono **vere** — due verificate
a mano alla cifra («Conforme» 2,35 dove ne servono 3; `.amt-n neg` 3,24).

## ⛔ E il runner riusava il server di un altro giro
`tutti.mjs` faceva «se qualcuno risponde sulla porta, lo riuso». Lanciato un giro
nuovo mentre il vecchio era vivo, il nuovo ha misurato per venti minuti la copia
dell'altro; poi, fermato il vecchio, ha letto **zero caratteri per schermata** —
ventidue KO che accusavano Scudo di non esistere.
La regola del contrassegno col pid era **scritta in CLAUDE.md dal 01/08** e la
rispettavano i singoli banchi: non la rispettava il file da cui dipendono tutti.
Controprova nei **due versi**, perché una guardia che si ferma sempre passerebbe
il primo e renderebbe il giro impossibile da lanciare.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**. Prove **2.246**, copertura **677/677**,
banchi **129**, `suite-collegate` **97 file**.

## Che cosa sta girando adesso
**Un giro completo PULITO su `4643be7`** (log:
`scratchpad/io-core/giro-3.txt`), con il contrassegno riletto dal server —
dichiarato in cima: *«Contrassegno riletto dal server: è il mio (pid 2925)»*.
⛔ Il registro precedente (`giro-2.txt`) è **contaminato** e i suoi 104 KO non
vanno usati: almeno ventidue sono l'effetto del server morto.

## Prossimo passo atomico
1. **Leggere `giro-3.txt`** quando finisce — è il primo registro affidabile che
   contiene la correzione del motore dei grafici. Le controprove si dichiarano
   da sé nell'intestazione; le passate sane sono quelle senza l'avviso.
2. **Le 54 del tema `sole`**: è una **palette**, cioè una decisione di colore da
   prendere con la ricerca cromatica e verificata a contrasto (direttiva
   estetica). Quando è fatta, si registra `--tema=sole` in `tutti.mjs` — adesso
   NON è registrato di proposito, perché un banco registrato che fallisce rende
   rosso il giro di tutti.
3. **Togliere le quattro classi morte** e con loro le righe di `ACCETTATE`.
4. **Il blocco `body.outdoor-mode` del core** è codice morto: pulizia da
   misurare prima.
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
Le stesse del checkpoint precedente, più: le **54** del tema `sole`; e il fatto
che i tre cantieri interrotti non hanno consegnato il loro resoconto.

## Blocchi
Nessuno.
