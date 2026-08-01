# «non si sa» contro «non si salta»

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/stati-sorvegliati.mjs`
**Unità precedente:** `20260801-131500_56-poi-53-poi-42.md`

## Letta la lista, saltato fuori il quarto difetto della stessa misura

Aperte a mano le undici occorrenze di «non si sa» nel testo che l'utente vede.
La prima riga di Conti:

> …il numero è **progressivo per anno** e te lo propone Conti: così **non si
> salta** e non si duplica.

«non si sa» è un prefisso di «non si **sa**lta». E anche di «non si **sa**lva»,
che nei moduli è di casa. La ricerca era una **sottostringa senza confine di
parola**, e pescava frasi che col principio non c'entrano niente.

## La correzione, e perché non è una regex furba

Non basta `\b`: in italiano la stessa frase si coniuga, e «non si **sanno**» o
«non si **saprà**» sono lo stesso stato. Quindi la regola è: dopo la frase ci
può stare **fine di parola**, oppure una delle **code dichiarate**
(`nno`, `prà`, `pranno`, `peva`). Dichiarate in un elenco, non indovinate con
un'espressione regolare astuta che nessuno saprebbe rileggere.

Occorrenze: **42 → 40**.

## La prova sta dentro la misura

Cinque casi, e i primi due sono i difetti veri trovati leggendo:

```
"così non si salta e non si duplica"   → false
"il costo non si salva mai"            → false
"senza scadenza: non si sa entro quando" → true
"di questi non si sanno le date"       → true
"non si saprà mai"                     → true
```

Se cadono, la misura **si ferma con uscita 1** invece di stampare un elenco
sbagliato — è l'unica cosa in questo file che può fallire, e deve.
**Controprova**: tolto il confine di parola, dice *«IL CONFINE DI PAROLA È
ROTTO: 2 casi su 5»* e nomina i due.

## E finalmente la classificazione, che era il punto

Le undici occorrenze di «non si sa», lette una per una:

| dove | che cos'è |
|---|---|
| Scudo · riepilogo persone «di N non si sa niente» | **già sorvegliata** dal banco |
| Scudo · «senza mansione non si sa quali corsi» (×2) | **già sorvegliata**: è un `vuoti` della cartella, e il banco stampa quel foglio |
| Conti · «così non si salta» | **falso positivo**, corretto qui |
| Conti · «non ha la densità: non si sa quanti m³» | messaggio di **validazione**, non uno stato |
| Sentinella · «un valore di cui non si sa da dove viene» | **testo esplicativo** in una nota |
| **Flotta · «+N a ore: non si sa quando»** | ⛔ **stato vero, non sorvegliato** |
| **Flotta · «Quando cadrà non si sa: …»** | ⛔ **stato vero, non sorvegliato** |
| **Conti · «senza scadenza: non si sa entro quando»** | ⛔ **stato vero, non sorvegliato** |
| **Conti · «non si sa, e finché è così resta fuori»** | ⛔ **stato vero, non sorvegliato** |
| **Terra · «questo lotto non dichiara nessun fronte…»** | ⛔ **stato vero, non sorvegliato** |

**Cinque stati veri** che nessun banco guarda, in tre app. Gli altri sei sono
dichiarati qui e non vanno più riguardati: è la parte che serviva a impedire
che la prossima unità rifacesse la strada.

## Verifica

Misura: 40 occorrenze, scansione in fase, confine di parola 5/5.
`run-stile` 271/0, `run-kpi` 1119/0, `suite-collegate` 46 file.

## Prossimo passo atomico

Mettere nel banco i **cinque stati veri**, uno per uno — con l'avvertenza che
quattro su cinque sono in **Flotta e Conti**, dove la dimostrazione va prima
guardata: se il caso non c'è nei dati d'esempio, aggiungerlo **prima** di
scrivere la riga del banco, come si è fatto per Scudo, Terra e Campo. È la
lezione di stanotte ripetuta tre volte: un banco scritto su un caso che la
dimostrazione non contiene non prova niente e non lo dice.
