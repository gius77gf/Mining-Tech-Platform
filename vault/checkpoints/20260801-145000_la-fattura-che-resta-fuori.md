# Il secondo dei cinque: la fattura che resta fuori e lo dice

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-142000_il-primo-dei-cinque-stati-veri.md`

## Che cosa è finito sotto guardia

Una **fattura aperta senza data di scadenza**. Nello scadenzario incassi non è
in ritardo e non è nei termini: *«non si sa, e finché è così **resta fuori**»* —
e lo scadenzario lo **dichiara** invece di infilarla in una fascia a caso. Su un
prospetto che si guarda per decidere chi sollecitare, una fattura messa nella
fascia sbagliata è peggio di una fattura fuori: sposta un numero senza dirlo.

La dimostrazione lo produce già da sé (`f7`, «Cave del Sud», € 4.400 senza
scadenza — è la riga aggiunta il 01/08 quando si è scoperto che `run-demo`
pretendeva date valide e quindi **impediva** proprio il caso su cui la difesa
era appena stata costruita).

## Verifica e controprova

Banco **41/0**, 19 stati, sei app. Controprova: data una scadenza a `f7`, il
banco cade sul caso giusto — l'avviso sparisce perché la fattura entra in una
fascia normale. Ripristinato, `git status` vuoto. `run-kpi` 1119/0, `run-stile`
271/0, `run-demo` 8/0.

## ⚠️ Il terzo dei cinque non si è fatto trovare

«senza scadenza: **non si sa entro quando**» — nel sorgente di Conti c'è, ma
visitando tutte le sezioni non compare a schermo. Due ipotesi da distinguere
prima di scrivere righe: sta in un **dettaglio** che si apre con un tocco
(come il DDT), oppure è un ramo che la dimostrazione non raggiunge. Non
l'ho dichiarato coperto e non l'ho tolto dalla lista: resta il prossimo.

## Prossimo passo atomico

1. **Conti**, «senza scadenza: non si sa entro quando»: prima capire **dove**
   dovrebbe comparire (probabilmente nella riga della fattura, quindi con un
   tocco che apre il dettaglio), poi decidere;
2. **Flotta**, «Quando cadrà non si sa: …», stessa forma — sta nel dettaglio di
   una manutenzione;
3. **Terra**, «questo lotto non dichiara nessun fronte…».
Per tutti e tre vale l'ordine imparato stanotte: chiamare le funzioni **come le
chiama la pagina** prima di dire che il caso non c'è.
