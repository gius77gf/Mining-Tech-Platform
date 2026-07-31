# Checkpoint — lo sconto che l'app prometteva e non applicava

**Commit:** `df7e555`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Tipo:** difetto sui soldi, trovato dal censimento delle sei app

## Che cos'era

La scheda cliente di Conti dice **«sconto 5%»**. L'app lo salva, lo mostra
nell'elenco clienti, lo esporta nel CSV. E poi **ogni DDT e ogni fattura
differita uscivano al prezzo pieno di listino**: `rigaPesata` il cliente non lo
riceveva proprio.

Non è una funzione mancante — è una **promessa scritta nell'interfaccia che il
documento non manteneva**.

Quanto pesa, misurato su una differita vera (2.230 t a 12,34 €/t, sconto 5%):

| | |
|---|---|
| quello che l'app fatturava | **27.518,20 €** |
| quello che il cliente legge sul suo contratto | **26.142,29 €** |
| differenza, su un mese | **1.375,91 €** |

## Come si applica uno sconto — e perché non è un dettaglio

Due modi che sembrano uguali e non lo sono:

- **piegarlo dentro il prezzo unitario** obbliga ad arrotondare quel prezzo ai
  centesimi, e l'errore si moltiplica per la quantità. Sulla stessa differita
  fa **6,69 € in meno** del dovuto. Su un documento fiscale i centesimi non
  sono un dettaglio;
- **toglierlo dall'imponibile** è quello che fa un DDT italiano: il prezzo di
  **listino** lo scrive, e lo sconto lo scrive accanto, così **chi riceve il
  documento può rifare il conto**.

Quindi `prezzoUnitario` resta il listino, e nasce **`imponibileRiga` in un
posto solo** — la pesata singola e la fattura differita fanno lo stesso conto,
perché due arrotondamenti diversi sullo stesso mese darebbero due totali
diversi.

## Le tre cose che vanno tenute

1. **Compatibilità all'indietro, che qui sono documenti già consegnati.** Un
   DDT salvato prima di oggi non ha `scontoPct` e vale **esattamente** quanto
   valeva ieri. C'è una prova che lo pretende, non una speranza.
2. **Lo sconto entra nella chiave del raggruppamento.** Due consegne dello
   stesso prodotto allo stesso prezzo con **sconti diversi** — succede quando
   le condizioni cambiano a metà mese — restano due righe. Unirle vorrebbe dire
   scegliere quale dei due sconti raccontare.
3. **Si vede dappertutto**: anteprima della pesata, elenco dei DDT, DDT
   stampato (con una colonna sua), fattura stampata, anteprima della differita,
   CSV. Un numero che cambia senza spiegazione è peggio di un numero sbagliato.

## Verifica

Nel browser, con screenshot guardato. Registrando una pesata per **Edilcave**
l'anteprima dice:

> NETTO 22,30 t · PREZZO DI LISTINO € 15,50/t · **SCONTO EDILCAVE SRL − 5%** ·
> VALORE DELLA CONSEGNA **€ 328,37**

e per **Stradesud**, che sconto non ne ha, la riga non compare e il valore è
pieno (345,65 €).

Il banco è entrato nella suite — `browser/sconto-cliente.mjs`, **21 → 23**
esecuzioni — con la controprova che serve la pagina **senza il cliente nel
conto** e ne fa cadere tre.

## Due volte la prova sbagliata ha accusato il codice giusto

Sta scritto accanto alle righe, perché è il tipo di errore che fa perdere più
tempo di nessuna prova:

1. i numeri attesi erano **cablati** da un'altra prova (prezzo 12,34) mentre il
   listino dimostrativo sta a 15,50. Adesso si **ricavano** da quello che la
   pagina mostra;
2. il confronto cercava «Sconto» dove il CSS scrive **«SCONTO»**:
   `text-transform: uppercase`, e `innerText` restituisce la trasformazione
   *effettiva*. È la stessa trappola già raccolta in `CLAUDE.md`, vista dal lato
   opposto.

## Numeri

- KPI **976 → 981**, totale `node` **1.315**
- copertura funzioni pure: **413 su 413** (fondo di Conti alzato a 59)
- banchi del browser: **21 → 23**
- suite rilanciate in **ora italiana**: 3, zero cadute

## Prossimo passo atomico

Dal censimento delle sei app, in ordine di gravità:

1. **Terra — il numero dei punti è fuorviante.** Il ponte con Genesi salva
   `punti` = i punti dell'**intera nuvola**, non quelli dentro il ritaglio: un
   numero che sembra una misura di qualità del rilievo e non lo è. Va corretto
   o tolto, non lasciato lì;
2. **Sentinella — le volate nel report di conformità** (S): il documento per
   l'ente ha già tutto tranne l'argomento più forte, cioè previsto contro
   misurato con la norma citata. I dati esistono già;
3. **Flotta — la segnalazione guasto rapida** (S): l'infrastruttura c'è tutta
   (il giro macchina fa già lo stesso giro), manca il pulsante.

E, sempre in coda: l'amministrazione di Deepwork ID su `dw-app-ui.js`, e Genesi
(il caso difficile della struttura).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
