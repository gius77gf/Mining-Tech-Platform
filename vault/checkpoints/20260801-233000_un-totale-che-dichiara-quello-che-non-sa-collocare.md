# Un totale che dichiara quello che non sa collocare

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs` (Conti)
**Unità precedente:** `20260801-224500_tre-dichiarazioni-che-la-dimostrazione-non-puo-mostrare.md`

## La voce in testa alla classifica

Ricontata la misura dopo l'unità precedente, in cima c'è **«senza data», quattro
app**. Non è una frase qualunque: è la **convenzione condivisa** che `CLAUDE.md`
cita fra le cose già in casa e cercate tre volte prima di accorgersene.

Guardate le occorrenze una per una, quasi tutte sono ripieghi di campo («senza
data d'emissione», «senza data di scadenza»). Una però è di un'altra specie, ed
è la forma più forte del principio applicata a **una cifra in euro**:

> **Incassato (totale registrato)** · 25.320 € · *1 fattura incassata senza data*

I 25.320 € comprendono i **12.000** di una fattura di cui non si sa **quando**
i soldi sono arrivati. La riga lo scrive **accanto al numero**, invece di
lasciar credere che l'incasso sia tracciato. Un totale che tace su questo è
esattamente il numero tranquillo del principio — con la differenza che qui il
numero è un euro, non un badge.

## Misurato prima, come da regola

Chiamando le funzioni **come le chiama la pagina**:

```
incassatoPeriodo → {importo: 25320, movimenti: 3, fattureVecchie: 1,
                    senzaData: 1, importoSenzaData: 12000}
tempoMedioPagamento → {giorni: 26, conto: 1, senzaData: 1, ritardo: -4}
```

La dimostrazione lo produce già (`f5`), quindi **niente dati aggiunti**: si
sorveglia e basta. Ed è la terza volta oggi che la risposta era già in casa.

## La controprova

Tolta la dichiarazione dalla riga (la coda diventa il neutro «da inizio
archivio», una sola occorrenza, riportata dallo script): il totale torna a
tacere e il banco cade sul caso giusto.

## Verifica

`stati-non-misurati` **72/0** — 42 stati cercati, 6 app (erano 70/0 e 41).

## Prossimo passo atomico

Le altre tre app che dicono «senza data» — Campo, Sentinella, Terra — con
l'avvertenza uscita da questa lettura: **la maggior parte sono ripieghi di
campo**, non stati che nascondono un numero tranquillo, e vanno **dichiarati**
invece di finire nel banco uno per uno. Il criterio per scegliere quali
meritano una riga: la frase sta **accanto a un numero** (un totale, una media,
una percentuale) di cui cambia la lettura? Allora è uno stato. Se invece
sostituisce solo un campo vuoto in una riga di dettaglio, si dichiara e si va
avanti — altrimenti il banco cresce di prove che non difendono niente.
