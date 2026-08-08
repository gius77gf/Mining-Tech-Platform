# I fogli stampati che nessun banco preme — misurato l'08/08

Risultato **parziale e dichiarato tale**, scritto perché senza questa pagina il
cantiere dopo rifà le stesse due misure sbagliate. Verificato contro il commit
`6ae0490`.

## Da dove nasce la domanda

In due ore, l'08/08, la domanda *«dove questa app compone qualcosa che ESCE,
chi decide i suoi numeri?»* ha dato **due difetti veri**: il volume in bianco
che usciva `0` dal CSV dei rilievi di Terra e **rientrava** come misura, e la
data di consegna dei DPI di Scudo che sul verbale firmato si leggeva «—», cioè
«non serve». Tutt'e due nel posto che CLAUDE.md indica per primo, e tutt'e due
invisibili al censimento statico: si vedono **premendo il bottone e leggendo il
foglio**.

Domanda ovvia: **e gli altri fogli?**

## La risposta, in una riga

`apps/deepwork-id/tests/browser/stampe-fs.mjs` preme i bottoni di stampa e
legge il foglio in `@media print` — ma solo di **quattro** app su sei.
**Scudo e Campo non ci sono**, e sono tre fogli:

| foglio | app | chi lo preme oggi |
|---|---|---|
| Verbale di consegna dei DPI | scudo | **nessun banco** |
| Cartella del lavoratore | scudo | **nessun banco** |
| Rapporto di turno | campo | **nessun banco** |
| Libretto macchina | flotta | `stampe-fs` |
| Report ambientale | sentinella | `stampe-fs` |
| Preventivo · DDT · Fattura | conti | `stampe-fs` |
| Denuncia annuale | terra | `stampe-fs` |

⚠️ **E non è che il contenuto manchi**: la dichiarazione «dati di esempio» c'è
in tutt'e due (`grep -c "solo-stampa\|DATI DI ESEMPIO"` dà **4** per Campo e
**4** per Scudo; `avvisoEsempio` compare **7** volte in Scudo e **4** in Campo).
Quello che manca è **qualcuno che verifichi che arrivi fino al foglio**. È la
forma della guardia scollegata: la difesa è scritta, e nessuno chiede se regge.
E il commento di `stampe-fs` dichiara Scudo fuori — ma lo dichiara in una riga
che racconta la storia del 03/08, non in un elenco che si legge.

## ⛔ Due righelli sbagliati prima di arrivarci, scritti perché nessuno li rifaccia

L'elenco dei bottoni di stampa **non si deriva dal testo del sorgente**, e ci
sono volute due misure per saperlo. La tecnica che funziona per gli export CSV
— cercare `download = "…"` e risalire al `$("btn-…").onclick` che la contiene —
qui **non regge**, perché `window.print()` non sta quasi mai dentro un gestore:

1. **risalendo al gestore più vicino**: 6 bottoni censiti su sei app, **1
   foglio uscito su ~8**. Pescava `#btn-dpi` invece di `#btn-dpi-verb`, cioè il
   gestore sbagliato, e su Terra e Conti nessuno;
2. **inseguendo la catena a tre anelli** (`window.print()` → la funzione che lo
   contiene → chi la chiama → l'`onclick`): **peggio**, 3 bottoni e sempre 1
   foglio. La funzione che contiene la stampa non è quella che il passo
   all'indietro trova: in `stampaVerbale` di Scudo, prima di `window.print()`,
   c'è `const fine = () => {…}` — e il riconoscitore aggancia **`fine`**.

La conclusione misurata: **l'elenco dei fogli va scoperto a RUNTIME**, premendo
i bottoni e guardando chi chiama `print`, oppure — come fa `stampe-fs` oggi —
scritto a mano **con l'elenco delle superfici dichiarato**, così un'app fuori
elenco si vede invece di sparire. La seconda è quella che regge adesso; la
prima è il lavoro giusto se un giorno i fogli diventassero molti.

## Il censimento parziale che si è potuto fare

Sul solo foglio raggiunto — il **report ambientale di Sentinella** — ci sono
**10 trattini «—»**, e vanno **giudicati uno per uno**, non contati: un «—» su
un campo facoltativo va bene, su un dato che il foglio esiste per portare no.

    2 × «Superamenti»      2 × «ORA»
    1 × «Media mm/s»       1 × «Massimo mm/s»
    1 × «Media dB(A)»      1 × «Massimo dB(A)»
    1 × «SD»               1 × (cella accanto a «22,03 µg/m³»)

**Non giudicati**, e la ragione è che il giudizio è il lavoro vero: quel report
va a un ente, e la differenza fra «non misurato» e «zero» lì è esattamente il
principio del fondatore. Sono candidati, non difetti.

## Il lavoro che ne segue, in ordine

1. **Portare Scudo e Campo dentro `stampe-fs.mjs`** — tre fogli, con la stessa
   forma già usata: si preme il bottone, si legge il foglio in `@media print`,
   si pretende che dichiari di essere un esempio e che dica **che cosa
   comporta**. Il verbale DPI ha già la sua frase («non va fatto firmare, non
   va allegato ai Documenti, non prova la consegna»): va **verificata**, non
   riscritta.
2. **Giudicare i dieci trattini di Sentinella**, uno per uno, con la domanda:
   *questo «—» dice «non serve» dove la verità è «nessuno l'ha misurato»?*
3. Solo dopo, e se serve, il riconoscitore a runtime dei bottoni di stampa.
