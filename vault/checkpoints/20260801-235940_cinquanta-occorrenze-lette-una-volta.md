# Cinquanta occorrenze lette una volta

**Data:** 01/08/2026 · **Area:** `docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md`,
`apps/conti/conti-data.js`, banco degli stati
**Unità precedente:** `20260801-235930_la-scadenza-di-cui-non-si-sa-quando-scade.md`

## La lista andava chiusa, non consumata una riga per volta

Dopo «senza data» la classifica resta lunga — «non si sa», «non indicato»,
«non indicata», «non registrato» a tre app ciascuna — e il checkpoint
precedente aveva già dichiarato il sospetto: **in maggioranza sono ripieghi di
campo**. Consumarla una frase per unità avrebbe fatto rileggere ogni volta le
stesse righe.

Quindi lettura unica: **50 occorrenze** nel testo che l'utente vede (commenti
esclusi, un file per volta col tokenizzatore giusto), classificate in tre
secchi e **scritte nel documento**. Il risultato:

- quelle **già sorvegliate** dal banco, spesso con altre parole;
- i **ripieghi di campo** — sostituiscono un campo vuoto in una riga di
  dettaglio e non cambiano la lettura di nessun numero: dichiarati in tabella,
  app per app, e non si riguardano più. Sono la grande maggioranza, e il
  documento li elenca invece di contarli: un numero contato a mente in un
  documento è il difetto che questo progetto ha già pagato due volte;
- **3 stati veri ancora scoperti** — questi sì contati, e sono la lista di
  lavoro vera:
  «Formazione non registrata» in Scudo, «distanza non indicata» e «norma non
  indicata sul progetto» in Sentinella.

Una lista di 50 righe è diventata una lista di 3. Ed è la stessa forma della
misura `stati-sorvegliati`: **quello che è stato guardato si dichiara**, se no
la prossima unità rifà la strada.

## Il caso preso in questa unità

Fra le occorrenze «non indicata» di Conti una passa il criterio (accanto a un
numero di cui cambia la lettura), ed è sulla **piastrella del Quadro**: la
somma delle basi d'asta delle gare aperte. Il commento accanto a quella riga la
regola ce l'aveva già scritta:

> *Un totale parziale che non dice di esserlo è un totale che inganna: se
> qualche gara aperta non ha la base, il numero lo dichiara.*

E la riga sa dichiararlo — «(1 senza base)» — ma tutte e quattro le gare
d'esempio la base ce l'avevano, quindi non lo diceva mai. **Sesta difesa
invisibile trovata oggi**, e sempre per la stessa ragione.

Aggiunta `g5`: un bando appena uscito, l'importo a base d'asta sta negli
allegati e non è ancora stato trascritto. Assenza, additiva — la somma delle
basi non si muove.

⚠️ Il banco guarda la **piastrella** (`[data-goto="gar"]`, che ha classe `kpi`),
non lo `<span class="s">`: è l'unità che l'utente vede, come per il tagliando di
Flotta. Puntando allo span il caso sarebbe caduto per un motivo che non c'entra
niente con il prodotto.

## La controprova

Tolta la coda che dichiara il parziale: il totale torna a presentarsi come se
fosse completo, e il banco cade sul caso giusto.

## Verifica

`stati-non-misurati` **76/0** — 45 stati cercati, 6 app (erano 75/0 e 44).
`run-kpi` 1123/0, `run-demo` 8/0.

## Prossimo passo atomico

I **tre stati veri** rimasti, in quest'ordine:
1. **Scudo · «Formazione non registrata»** — pastiglia rossa nella matrice
   delle nomine; è uno stato di sicurezza, ed è il più pesante dei tre. Da
   misurare: la dimostrazione lo produce? (`organigrammaSicurezza` dava **1
   formazione mancante su 7 persone**, quindi probabilmente sì: allora è solo
   la riga del banco);
2. **Sentinella · «distanza non indicata»** sul ricettore;
3. **Sentinella · «norma non indicata sul progetto»**.
Per i due di Sentinella vale l'avvertenza già scritta: la dimostrazione non ha
superamenti, quindi prima si guarda **dove** quelle frasi compaiono davvero.
