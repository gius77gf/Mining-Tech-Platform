# Il rapportino che non sta in nessun giorno

**Data:** 01/08/2026 · **Area:** `apps/campo/campo-data.js` (dimostrazione), banco degli stati
**Unità precedente:** `20260801-233000_un-totale-che-dichiara-quello-che-non-sa-collocare.md`

## Il criterio applicato subito

L'unità precedente si chiudeva con una regola per non gonfiare il banco: una
frase merita una riga **se sta accanto a un numero di cui cambia la lettura**;
se sostituisce solo un campo vuoto in una riga di dettaglio, si dichiara e si
va avanti.

Applicata alle occorrenze di «senza data» di Campo, ne passa **una**:

```js
const sdRap = senzaData(RAP);
const avvisoSdRap = sdRap ? ` (${sdRap} rapportini ancora senza data)` : "";
$("rap-cop").innerHTML = … `Rapportini consegnati da 2/3 squadre` … + avvisoSdRap;
```

Il numero accanto a cui sta è la **copertura**: «consegnati da 2/3 squadre».
Un rapportino consegnato **senza il giorno** non entra in nessuna giornata,
quindi non entra in quel conto — e senza l'avviso la riga potrebbe dire *«tutte
a posto»* mentre uno è rimasto lì. Le altre occorrenze di Campo sono ripieghi di
campo: **dichiarate qui e non riguardate**.

## Il caso non c'era, ed è un'assenza

Tutti e nove i rapportini d'esempio avevano il giorno, quindi quella frase non
la vedeva nessuno. È un'**assenza**, quindi per la regola di stamattina sta nei
dati d'esempio — e la storia è vera: il rapportino si manda dal telefono, e il
campo del giorno resta vuoto.

Provato prima in scratchpad, come pretende la regola: aggiungendo `rs0` la
**copertura di oggi non cambia** (2 su 3, mancanti identiche), cambia solo il
conto di quelli che non si sanno collocare — 0 → 1. Additivo, non strutturale.

## La controprova

Spenta la conta (`senzaData` restituisce sempre 0, riportato dallo script):
l'avviso non si accende più e il banco cade sul caso giusto.

## Verifica

`stati-non-misurati` **73/0** — 43 stati cercati, 6 app (erano 72/0 e 42).
`run-kpi` 1123/0, `run-demo` 8/0, `run-stile` 271/0.

## Prossimo passo atomico

Restano di «senza data» **Sentinella** e **Terra**. Da leggere con lo stesso
criterio, e con l'aspettativa dichiarata: in Terra «senza data» è uno **stato
di `statoScadenza`**, cioè il vocabolario condiviso — quindi la domanda non è
«c'è la frase», è **dove quello stato finisce accanto a un conteggio** (quante
scadenze sono a posto, quante scadute). In Sentinella la forma che vale è
«valore inserito a mano, **senza data**»: un valore di cui non si sa quando è
stato preso, accanto agli altri che una data ce l'hanno.
