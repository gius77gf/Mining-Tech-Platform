# L'ordinamento tranquillo

**Data:** 01/08/2026 · **Area:** `apps/conti/conti-data.js` (`prioritaIncasso`)
**Unità precedente:** `20260801-145000_la-fattura-che-resta-fuori.md`

## Il terzo dei cinque, e non era dove pensavo

«senza scadenza: non si sa entro quando» c'era nel sorgente di Conti e **non
compariva a schermo**. Le due ipotesi erano: un dettaglio da aprire, oppure un
ramo che la dimostrazione non raggiunge. **Nessuna delle due.**

La frase sta nel pannello «cosa fare adesso», che mostra le prime **tre**
fatture per priorità d'incasso. E `prioritaIncasso` faceva così:

```js
const g = giorni(f.scadenza, oggi);
return { f, ritardo: Number.isFinite(g) ? Math.max(0, -g) : 0 };
```

Una fattura **senza data di scadenza** prendeva `ritardo: 0` — **lo stesso
numero di una fattura comodamente nei termini** — e l'ordinamento è per ritardo
decrescente. Quindi la fattura di cui si sa **meno** finiva in fondo, fuori dal
pannello. La pagina aveva la frase pronta e non la vedeva nessuno.

## ⛔ Perché questa forma è peggio delle altre

Non è un numero tranquillo su uno schermo: è un **ordinamento tranquillo**.
Non scrive niente di falso — **nasconde**. E si vede solo se qualcuno va a
chiedersi perché una frase scritta non compare mai.

## ⚠️ E c'era una prova che lo blindava

```
test("prioritaIncasso: fattura senza data = ritardo 0 (non in cima per errore)")
  eq(p[0].ritardo, 0, "senza data → ritardo 0");
```

Metà della sua ragione era **giusta**, ed è quella nel nome: un ignoto non deve
scavalcare un ritardo misurato, cioè non si inventa un allarme. L'altra metà no:
`0` è il numero delle fatture **nei termini**.

⚠️ Ed è parola per parola la correzione che **`agingIncassi` aveva già
ricevuto**, dodici righe più sotto nello stesso file: *«"non scaduto" è la
fascia TRANQUILLA, e un credito di cui nessuno sa quando dovrebbe rientrare ci
finiva dentro in verde»*. **Stesso difetto, due funzioni, una sistemata e una
no** — e la prova della seconda teneva ferma la versione sbagliata.

## La correzione

`ritardo` è **`null`** quando la scadenza non c'è, con `senzaScadenza: true`
accanto. L'ordinamento tratta i tre casi separatamente: **prima chi è davvero in
ritardo**, poi **chi non si sa**, poi chi si sa essere a posto. Una cosa che non
si sa vale più attenzione di una che si sa a posto, ma **meno** di un ritardo
misurato: non si inventa un allarme.

⚠️ *Dove* metterla è una scelta di prodotto, non un calcolo: sta scritto nel
commento che se il fondatore la vuole in cima si cambia una riga — ma non si
torna a chiamarla zero.

In dimostrazione la fattura senza scadenza passa dal **5° posto al 3°**, e
compare.

## Verifica

`run-kpi` **1120/0** (prova nuova + quella invecchiata corretta perché sia più
giusta, non più permissiva). Banco **43/0**, 20 stati. Controprove: rimesso
`ritardo 0`, cadono **due prove `node` e la riga del banco**. Ripristinato e
verificato identico — ⚠️ al primo tentativo il `cp` è fallito perché la shell
era in un'altra cartella (secondo caso stanotte): se n'è accorto il `git status`
di rito. `run-stile` 271/0, demo 8/0, sonda-vuoto 7/0, copertura 0 scoperte,
numeri-nei-documenti 17/0 (⚠️ avevo alzato anche la copertura a 466: non è nata
nessuna funzione, solo una corretta — rimessa a 465).

## Prossimo passo atomico

Restano **due** dei cinque: Flotta «Quando cadrà non si sa: …» (nel dettaglio di
una manutenzione) e Terra «questo lotto non dichiara nessun fronte…». Per
tutt'e due, l'ordine ormai collaudato: chiamare le funzioni **come le chiama la
pagina**, poi guardare se la dimostrazione le raggiunge, e solo alla fine
decidere se il buco è nei dati, nella pagina o — come stavolta — in una
**regola** che tratta l'ignoto come un valore.
