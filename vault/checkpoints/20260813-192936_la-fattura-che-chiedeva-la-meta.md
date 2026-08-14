# Checkpoint — 2026-08-13 19:29 UTC

## Tipo
unit-complete (due unità raccolte: Sentinella e Conti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimi commit
- `8d072bc5` — *Sentinella: tre copie più deboli, tutte nel punto in cui l'app
  DICE qualcosa*
- `de04c557` — *Conti: la fattura chiedeva al cliente la METÀ di quello che gli
  era stato consegnato*

## Conti — il difetto più caro della giornata

`valoreDdt` — nata il 03/08 **proprio** per non scrivere «€ 0,00» dove non è
stato misurato niente — conosceva **un solo fattore su due**. Un valore è
quantità × prezzo: sapeva fermarsi sulla **quantità**, e sul **prezzo** lasciava
lavorare `imponibileRiga`, dove `+null || 0` fa zero. Rispondeva
`{valore: 0, calcolabile: true}` — **la bandiera alzata sul caso che quella
funzione esiste per prendere**.

La regola giusta era già scritta **due volte nello stesso file**
(`prezzoDaOrdine`, e il form del DDT che si ferma). Mancava dove il documento è
**già salvato**.

**La porta, misurata**: *Pesate → «Ri-carica copia (CSV)»*. `csvPesate` scrive
la cella del prezzo vuota quando il prezzo non c'è, e `parsePesateCsv` la
rilegge `null` **di proposito**.

| dove | prima | adesso |
|---|---|---|
| DDT stampato, colonna Prezzo | `€ 0,00/t` | non indicato |
| DDT stampato, valore consegna | `€ 0,00` | non calcolabile, col perché |
| Registro Pesate | `€ 0,00` | `—` · «prezzo non scritto sul DDT» |
| CSV prospetto DDT | `0` | cella vuota |
| **fattura differita** (1 DDT sano + 1 muto) | **374,78 €** | si ferma, e dice **quale** |
| la stessa, col prezzo scritto | — | **749,57 €** |

Si chiedeva al cliente **la metà**, e niente lo diceva. E `righeDaPesate`
**fondeva** la riga senza prezzo con le forniture a prezzo zero vere: il
documento raccontava come «regalato» qualcosa che nessuno aveva deciso di
regalare.

⛔ **E la correzione ne ha scoperto un secondo — la famiglia dei difetti che
NASCONO dalle correzioni.** `venditePerProdotto` ricavava un conto con
`Math.max(0, senzaDensita − nonValorizzabili)`, che reggeva sull'invariante «non
valorizzabile è sempre anche senza densità»: vero finché le ragioni erano
**una**. Rotto l'invariante la sottrazione non diventava negativa — **faceva
sparire** dalla riga le consegne che un valore ce l'hanno. Sbagliava nella
direzione tranquilla. Adesso quel numero si **conta**.

> **Quando si aggiunge una ragione a una funzione, si cercano i conti che
> DEDUCEVANO l'altra: una sottrazione fra due insiemi regge su un invariante,
> e l'invariante non è scritto da nessuna parte.**

## Sentinella — tre copie più deboli
I file che escono erano **puliti** (CSV per l'ARPA, ricettori, tarature,
volate, referti, report), guardati uno per uno. I difetti stavano nelle
**finestre di conferma** e nell'**unità**: il **settimo** posto della famiglia
`conSoglia` (la finestra mostrava la soglia della scheda, «5 mm/s», dove la riga
sotto il dito dice «20 · dal ricettore»); la **quarta** copia del ciclo di
`contaCoperture`, che accusava «4 letture scoperte» dove il report dichiara
**zero** — e nel verso opposto le due risposte coincidono, quindi **il difetto
si vede solo dove divergono**; e l'unità letta dal campo grezzo in cinque punti,
con «41&nbsp;&nbsp;/ soglia 40» sulla prima schermata.

## Le misure
`run-kpi` **2092 → 2097 → 2103**, 0 falliti; `iniezioni-fresche` **357/357**
(la correzione di Conti aveva fatto scadere un'iniezione, presa in tre secondi);
`sintassi-pagine` 34; `run-stile` 318; `numeri-nei-documenti` 41. Tutto sulla
**copia di quello che si committa**. Documenti: **2.544 → 2.555**.

## Che cos'è vivo adesso
- **Cantiere sul core** per **B0-quindecies** (i 61 testi del tema chiaro):
  è nella fase di correzione della palette.
- **Il giro del browser** su `d3653ec` — alle 19:22 sette passate, **0 KO veri**,
  e le dieci righe rosse incontrate stanno tutte dentro sezioni **dichiarate
  controprova**.

## Prossimo passo atomico
Quando il cantiere del core consegna: diff letto riga per riga, e **rimisurare
il tema scuro** (deve restare 0 sotto soglia) prima di committare — è la
trappola già pagata, «una correzione che aggiusta un tema rompendo l'altro è
peggio del difetto». Poi, ad albero fermo, **leggere** con `giro-node.mjs` il
totale delle asserzioni del giro `node`: i documenti dichiarano ancora **2.839**
ed è invecchiato. Non si prevede: si legge dal giro — due previsioni, due
errori.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola** (il
  registro del job lo conferma: `orologio del vault: 7 passati, 1 falliti`, e
  tutto quello che gira prima è verde). Serve il sì del fondatore.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
