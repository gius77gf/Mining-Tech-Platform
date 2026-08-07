# Checkpoint — 2026-08-07 07:54:00 UTC

## Tipo
unit-complete (tre unità: il canarino, il terzo tema col righello corretto, e i
tre cantieri interrotti portati a termine)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a1bfee4` — *Campo, Genesi e Terra: tre cantieri interrotti a metà da un limite,
portati a termine*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 121 | **canarino** (`890c206`) | ciclo vivo alle 06:05 UTC |
| 122 | **il terzo tema, e il righello** (`aca474d`) | 560 bocciature → **29**, di cui nessuna ancora dichiarata vera |
| 123 | **i tre cantieri interrotti** (`a1bfee4`) | prove **2.246**, copertura **677/677**, banchi **129** |

## ⛔ Il banco del contrasto guardava un tema su tre
Le app hanno **tre** temi (`shared/dw-tema.js`: `scuro`, `chiaro`, `sole`) e il
banco che misura 4.638 testi ne guardava **uno**. Il non misurato che pesa di più
è `sole`: è il tema per chi legge il telefono **in cava, sotto il sole**.

⛔ **E aperto quel tema, il righello era rotto.** 560 bocciature su 3.646 testi,
quasi tutte false: `color-mix()` — che i temi delle app usano per `--muted` —
Chromium lo risolve in `color(srgb 0.163608 0.185412 0.0681569)`, coi canali da
**0 a 1**, e il banco li trattava come 0-255. Inchiostro nero, fondo nero,
**1,01:1** su un testo nerissimo su bianco che fa più di 15:1.
L'ha smentito il conto a mano su due elementi, come pretende l'intestazione di
quel banco stesso: *un KO va verificato come un OK*. Corretto: **560 → 29**.
Sul tema scuro di sempre: 4.638 testi, **0 sotto soglia** (il conto è **salito**
da 4.568, quindi non è sparito niente).

⚠️ **E la mia prima guardia sul tema era sbagliata nel verso peggiore**:
appiccicava la classe e guardava se era rimasta, chiamando `window.applyTheme`
per il core. Ma il programma del core sta in un `<script type="module">`, quindi
`applyTheme` **non è su `window`**: la classe restava e il banco ha misurato
tutto il core in un tema che quel core **non può avere**. La domanda giusta non
è «la classe è rimasta?» ma «questa superficie **sa** che cos'è questo tema?».

⛔ **E la guardia nuova non è scollegata**: la controprova appende anche un
**testimone** scritto con `color-mix()` e leggibilissimo, con una marca
**distinta** dal veleno — se portasse la stessa, una sua bocciatura verrebbe
contata come «veleno preso» e il difetto si nasconderebbe dentro il suo stesso
controllo. Col difetto rimesso: bocciato **14 su 14**, uscita 1. Senza: **0**.

## ⛔ Tre cantieri fermati a metà da un limite, e non si buttano
Alle 6:40 UTC la piattaforma ha fermato Campo, Genesi e Terra a metà frase.
Misurato invece che deciso: `run-kpi` girava già **1841 su 1841**, e mancavano
tre cose sole — una funzione senza prova (`terra.numeroRegistrato`), un banco non
registrato né tracciato (`genesi-piano-innesco.mjs`), i conti dei documenti.
Lanciando il banco è saltato fuori il suo ultimo KO, **vero**: il messaggio di
conferma dell'export non nominava l'innesco — che è il campo che, riaperto
sbagliato, porta lo «Scatter innesco» da 0,1 a 8,0 ms, ottanta volte, in
silenzio. Adesso 17/0, controprova 3 prove rosse.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti** sulla copia di ogni commit. Prove **2.246**
(`run-kpi` 1842), copertura **677/677**, banchi **129**, `suite-collegate` **97
file**.

## Che cosa sta girando adesso
**Il giro completo del browser su `aca474d`** (log:
`scratchpad/io-core/giro-2.txt`). È il primo che contiene la correzione del
motore dei grafici, che è la modifica col raggio più largo del blocco.
⚠️ Il giro precedente, su `e5b1405`, è stato **fermato**: era vecchio di cinque
commit e i suoi rossi erano già stati corretti (uno l'ho verificato: «Esportati 1
prodotto» in Conti era già `plurale(...)`).

## Prossimo passo atomico
1. **Leggere `giro-2.txt` quando finisce.** Le controprove adesso si dichiarano
   da sé nell'intestazione: si leggono i KO delle passate **senza** l'avviso.
2. **Guardare le 29 del tema `sole`, una per una**, prima di dichiararle vere.
   Il primo gruppo da verificare sono i `1:1` sugli `.avatar sup`: un `1:1`
   tondo, dice l'intestazione del banco, non è un colore — è una misura che non
   ha trovato l'inchiostro. Gli altri (3,04 / 1,79 / 1,92 su `.rosso`,
   `.giallo`, `.apar`) hanno l'aria di essere veri.
3. **Togliere le quattro classi morte** (`mac-gest-tabs`, `ec-miccia`,
   `tipo-volata-btn`, `dc-rock`) e con loro le righe di `ACCETTATE`: la suite
   pretende che spariscano insieme.
4. **Il blocco `body.outdoor-mode` del core è codice morto** (l'`applyTheme` del
   core lo toglie a ogni giro): pulizia da misurare prima — quante righe.
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08. «Entro venerdì» vuol dire **a fine
   giornata**; si applicano solo se a fine giornata non è arrivata risposta,
   dichiarandolo nel commit.

## Code aperte, dichiarate
- Le **29 del tema `sole`**, non ancora verificate.
- I tre cantieri interrotti **non hanno consegnato il loro resoconto**: se
  avevano code aperte non le conosco. Si ritrovano rileggendo i commenti che
  hanno lasciato nei moduli.
- **Conti**: `.meta.pesa` (15/31/46 px a 430/390/320); `conti_incassi.csv ·
  residuo_dopo` non conosce le note; 8 export su 9 composti nella pagina.
- **Scudo**: la dichiarazione «dimostrazione» sui 4 CSV non si vede nel
  contenuto; `stampe-fs.mjs` esclude Scudo con una prova ormai falsa; il
  fascicolo non porta l'idoneità sanitaria (art. 41).
- **Sentinella**: `csvTarature` grezzo; `#ppv-scelta`.
- **Grafici**: `.dwg-plot` a larghezza zero; il pavimento di 240; le etichette
  con 30 unità in meno di spazio.

## Blocchi
Nessuno. ⚠️ Il limite di sessione delle 6:40 è rientrato.
