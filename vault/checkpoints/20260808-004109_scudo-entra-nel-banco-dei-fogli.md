# Checkpoint — 2026-08-08T00:41:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`65037a2` — *stampe-fs: Scudo entra col suo verbale e la sua cartella, nei due versi*

## Che cosa è stato completato

**Il difetto di processo.** `stampe-fs.mjs` — il banco che preme i bottoni di
stampa e legge il foglio in `@media print` — dichiarava «Scudo resta fuori da
questo banco» **da cinque giorni**, in una riga che racconta la storia del
03/08 invece di essere un elenco che si legge. Intanto ai due fogli di Scudo
(verbale di consegna dei DPI, cartella del lavoratore) **nessuno faceva la
domanda di quel banco**: *dichiari di essere fatto di dati d'esempio, e dici
che cosa comporta?* Ed è proprio lì che il 03/08 è uscita la scadenza stampata
come una qualunque e l'08/08 la data di consegna che si leggeva «non serve» —
due difetti veri sulla superficie meno guardata.

**Chiuso, nei due versi:**
- `--controprova`: si spegne la **decisione** (`avvisoEsempio`), non la frase —
  come per Conti e Terra, che hanno un posto solo che decide «questo è un
  foglio di dimostrazione». Una prova che restasse verde direbbe che sta
  guardando un foglio che non passa di lì, cioè una copia debole nata nel
  frattempo. **4 KO su Scudo, 26 sul giro intero, 0 iniezioni mancate.**
- `--live`: sui dati veri i fogli escono **puliti**. Marchiare «DATI DI
  ESEMPIO» il fascicolo personale di un lavoratore vero sarebbe il danno più
  grosso che questo banco possa causare, e una guardia che si accende sempre
  non è una guardia. **50 su 50.**

Banco **58 → 73** prove. Etichette in `tutti.mjs` aggiornate.

⚠️ E un'asserzione l'ho scritta larga e corretta subito: la conseguenza della
cartella la pretendevo con `/non/i`, che combacia con qualunque frase — cioè
avrebbe detto «ok» anche se la riga fosse sparita. Adesso è alla lettera («non
va esibita a un ispettore»), diversa da quella del verbale perché i due fogli
vietano cose diverse.

## ⛔ E l'errore mio, che vale più dell'unità

La prima stesura di `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md` diceva anche:

> | Rapporto di turno | campo | **nessun banco** |

**Falso.** `campo-foglio-turno.mjs` esiste, con tre passate (normale,
`--controprova`, `--live`). E i due fogli di Scudo erano premuti da **altri
tre** banchi, per altre domande. Avevo cercato **dentro `stampe-fs.mjs`** e
concluso «non c'è» per tutto il resto — la stessa mossa che la direttiva 5
vieta agli agenti di ricerca, fatta da chi quella regola l'aveva appena
applicata a due cantieri nella stessa notte.

Un comando di tre secondi la smentiva:
`grep -rln "btn-dpi-verb\|btn-cartella" apps/deepwork-id/tests/browser/*.mjs`
→ **quattro** file.

Il documento adesso porta la correzione **prima del resto**, e il verdetto
vero è più stretto e ancora utile: i fogli erano premuti, **la domanda non
gliela faceva nessuno**.

## E i due righelli scartati, scritti perché nessuno li rifaccia

L'elenco dei bottoni di stampa **non si deriva dal sorgente**. La tecnica che
funziona per gli export CSV (`download = "…"` → risalire all'`onclick`) qui non
regge, perché `window.print()` non sta quasi mai dentro un gestore:
1. risalendo al gestore più vicino: 6 bottoni, **1 foglio su ~8**, e pescava
   `#btn-dpi` invece di `#btn-dpi-verb`;
2. inseguendo la catena a tre anelli: **peggio**, 3 bottoni — in
   `stampaVerbale`, prima di `window.print()`, c'è `const fine = () => {…}` e
   il riconoscitore aggancia `fine`.
Conclusione: o si scopre a **runtime**, o si tiene l'elenco a mano **con le
superfici dichiarate**.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre trenta commit fa. Ordine: prima le righe **«non ho
guardato»**, poi i KO, distinguendo le controprove.

Poi:

- ⏱️ **Giudicare i dieci trattini del report di Sentinella**, uno per uno, con
  la domanda: *questo «—» dice «non serve» dove la verità è «nessuno l'ha
  misurato»?* Quel foglio va a un ente. Censiti per etichetta nel documento,
  **non giudicati**: sono candidati.
- ⏱️ **La stessa domanda sui riferimenti in `nomi-liberi`**, non solo sulle
  chiamate — misurando prima gli allarmi su una copia.

## Blocchi
Nessuno.
