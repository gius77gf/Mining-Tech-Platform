# I fogli stampati e la domanda che nessuno faceva a Scudo — 08/08

Verificato contro il commit `53427a3`, poi **corretto** un'ora dopo: la prima
stesura di questa pagina conteneva un «non c'è» **falso**, e la correzione è la
parte che vale di più.

## Da dove nasce la domanda

In due ore, l'08/08, la domanda *«dove questa app compone qualcosa che ESCE,
chi decide i suoi numeri?»* ha dato **due difetti veri**: il volume in bianco
che usciva `0` dal CSV dei rilievi di Terra e **rientrava** come misura, e la
data di consegna dei DPI di Scudo che sul verbale firmato si leggeva «—», cioè
«non serve». Tutt'e due nel posto che CLAUDE.md indica per primo, e tutt'e due
invisibili al censimento statico: si vedono **premendo il bottone e leggendo il
foglio**.

Domanda ovvia: **e gli altri fogli?**

## ⛔ La prima risposta era sbagliata, e va letta prima del resto

Questa pagina diceva, in tabella:

> | Verbale di consegna dei DPI | scudo | **nessun banco** |
> | Cartella del lavoratore | scudo | **nessun banco** |
> | Rapporto di turno | campo | **nessun banco** |

**Due righe su tre erano false.** Avevo cercato dentro `stampe-fs.mjs` e
concluso «non c'è» per tutto il resto — la stessa mossa che la direttiva 5
vieta agli agenti di ricerca, fatta da chi quella regola l'aveva appena
applicata a due cantieri.

Un `grep` di tre secondi la smentiva:

    grep -rln "btn-dpi-verb\|btn-cartella" apps/deepwork-id/tests/browser/*.mjs
      scudo-documenti.mjs  ·  scudo-numeri-tranquilli.mjs
      stati-non-misurati.mjs  ·  stampe-fs.mjs

    grep -n "campo-foglio-turno" apps/deepwork-id/tests/browser/tutti.mjs
      → tre passate: normale, --controprova, --live

Cioè: il rapporto di turno di **Campo ha un banco tutto suo** (che apre la
finestra nuova, legge il foglio in `@media print` e scarica anche la consegna
`.txt`), e i due fogli di **Scudo venivano premuti da tre banchi**.

## La risposta vera, più stretta e ancora utile

I due fogli di Scudo venivano premuti — ma per **altre domande**: i documenti,
i numeri tranquilli, gli stati non misurati. **Nessuno chiedeva loro la domanda
di `stampe-fs`**: *questo foglio dichiara di essere fatto di dati d'esempio, e
dice che cosa comporta?*

E il file lo diceva di sé, in una riga che raccontava una storia invece di
essere un elenco:

> *«…Scudo resta fuori da questo banco.»*

Rimasta lì **cinque giorni**. Intanto, sui due fogli meno guardati, il 03/08
usciva la scadenza stampata come una qualunque e l'08/08 la data di consegna
che si leggeva «non serve».

**Chiuso l'08/08**: Scudo è dentro `stampe-fs.mjs` con i suoi due fogli, nei
**due versi** — `--controprova` (spenta la decisione `avvisoEsempio`, 4 KO) e
`--live` (sui dati veri i fogli escono **puliti**: marchiare «DATI DI ESEMPIO»
il fascicolo personale di un lavoratore vero sarebbe il danno più grosso che
questo banco possa causare).
Banco: **58 → 73** prove; controprova 26 KO con **0 iniezioni mancate**;
`--live` 50 su 50.

⚠️ **Resta fuori Genesi**, con la ragione già misurata (non ha una modalità
dimostrazione), e **nient'altro**: le sei app verticali sono coperte.

## ⛔ E l'elenco dei bottoni di stampa non si deriva dal sorgente

Due misure per saperlo, scritte perché nessuno le rifaccia. La tecnica che
funziona per gli export CSV — cercare `download = "…"` e risalire al
`$("btn-…").onclick` che la contiene — qui **non regge**, perché
`window.print()` non sta quasi mai dentro un gestore:

1. **risalendo al gestore più vicino**: 6 bottoni censiti su sei app, **1
   foglio uscito su ~8**. Pescava `#btn-dpi` invece di `#btn-dpi-verb`;
2. **inseguendo la catena a tre anelli** (`window.print()` → la funzione che lo
   contiene → chi la chiama → l'`onclick`): **peggio**, 3 bottoni e sempre 1
   foglio. In `stampaVerbale`, prima di `window.print()`, c'è
   `const fine = () => {…}`: il riconoscitore aggancia **`fine`**.

Conclusione misurata: o si scopre a **runtime**, o si tiene l'elenco a mano
**con le superfici dichiarate**, così un'app fuori elenco si vede invece di
sparire. La seconda è quella che regge, ed è quella che questa giornata ha
rafforzato.

## Quello che resta da giudicare

Sul report ambientale di **Sentinella** — il foglio che va a un ente — ci sono
**10 trattini «—»**, censiti per etichetta e **non giudicati**: sono candidati,
non difetti. Un «—» su un campo facoltativo va bene; su un dato che il foglio
esiste per portare no, e lì la differenza fra «non misurato» e «zero» è
esattamente il principio del fondatore.

    2 × «Superamenti»      2 × «ORA»
    1 × «Media mm/s»       1 × «Massimo mm/s»
    1 × «Media dB(A)»      1 × «Massimo dB(A)»
    1 × «SD»               1 × (cella accanto a «22,03 µg/m³»)
