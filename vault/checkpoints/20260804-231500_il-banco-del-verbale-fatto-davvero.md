# Checkpoint — il banco del verbale, fatto per davvero

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Banchi del browser:** 29 → **31**

Il checkpoint precedente diceva, testuale, che il banco del verbale **non
contava come verifica**: chiamava `window.__verbale`, che non esiste — la
funzione vive dentro il modulo — cadeva nel ramo di ripiego e stampava «1 prova,
1 passata» avendo controllato solo che la pagina si aprisse.

`tests/browser/verbale-origine.mjs` fa invece quello che fa una persona: preme
il bottone del verbale, compila la richiesta del rilevatore, e **legge il
documento che si apre** — intercettando `window.open`, perché il foglio viene
scritto lì dentro.

**6 prove, tutte verdi.** La controprova (che toglie `descriviOrigine` dalla
riga, **nella risposta HTTP**) ne fa cadere **2 su 6** con **1 iniezione**
dichiarata, e la sezione che resta è proprio quella di prima: *«Il metodo
dichiarato e il GSD collocano il rilievo nella classe di qualità topografica…»* —
cioè quanto fidarsi, senza una parola su **da dove viene** il numero.

## ⚠️ E una prova che non poteva cadere

Una riga era scritta come `… === false ? false : true`: **vera ogni volta che
l'oggetto esisteva**. Una asserzione così non è debole, è **finta** — occupa il
posto di un controllo e conta come «passata». Adesso cerca davvero la sezione
nel documento.

È la terza volta oggi che una prova doveva essere corretta perché **non
distingueva**: il sollecito che cercava «1.000,00» dove il testo scrive «€
1.000», l'assenza di provenienza a cui chiedevo di non nominare i parametri che
nomina apposta, e questa. Tutte e tre trovate **provando a farle fallire**.

## Prossimo passo atomico

1. **unità 5** della scheda sulla tracciabilità: la cella si mostra e **si può
   cambiare** nel visore — adesso che il numero scelto viene registrato, quel
   22% smette di essere una scelta invisibile del software;
2. la nota di credito nell'**export per il commercialista** e nel registro IVA;
3. giro completo a **31 esecuzioni** quando il lavoro sul codice è fermo.
