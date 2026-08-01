# La scadenza di cui non si sa quando scade

**Data:** 01/08/2026 · **Area:** `apps/terra/terra-data.js` (dimostrazione), banco degli stati
**Unità precedente:** `20260801-235900_la-regola-in-un-posto-solo.md`

## L'ultima delle quattro app di «senza data»

E la forma più pura del principio che si sia trovata finora: la riga del
riepilogo del scadenzario è fatta di **conteggi uno accanto all'altro**.

```
5 scadenze · 1 scaduta · 2 in scadenza · 1 senza data · 1 a posto
```

Una scadenza di cui non si sa **quando** scade, contata fra le «a posto», è il
numero tranquillo per definizione. Il modulo il contatore ce l'aveva già, col
commento che dice perché: *«le righe con la data illeggibile hanno un contatore
LORO: contarle fra le a posto era il modo in cui sparivano»*. Ma tutte e quattro
le scadenze d'esempio avevano la data — quindi il contatore restava a **zero**,
la riga non lo scriveva mai, e la difesa non la vedeva nessuno.

Quinta volta oggi che una difesa scritta, provata e commentata è invisibile
perché la dimostrazione non contiene il caso.

## Il caso, e perché è additivo

`t5`: una prescrizione dell'atto il cui termine, sul titolo, è scritto a mano e
non si legge. È un'**assenza**, e l'aggiunta è additiva — misurato prima:

```
prima  {scadute:1, inScadenza:2, senzaData:0, aPosto:1, totale:4}
dopo   {scadute:1, inScadenza:2, senzaData:1, aPosto:1, totale:5}
```

Gli altri tre conteggi **non si muovono**: sale il totale e sale il contatore
delle senza-data. Esattamente quello che il criterio chiede.

## Il banco, e un selettore in più dichiarato

`#scad-count` ha classe `count`, che è la riga di riepilogo del core
(`shared/dw-app-ui.css`): non era fra i selettori del banco, e senza di lei il
banco non poteva vedere **nessuna** riga di conteggio, di nessuna app. Aggiunta,
con la ragione scritta accanto — è il posto in cui un numero tranquillo si
nasconde meglio.

Il `vietato` dice l'altra metà: se il contatore delle senza-data è **zero**, la
riga non deve comparire affatto (la pagina infatti la scrive solo `if
(rp.senzaData)`). Una voce «senza data: 0» sarebbe rumore che stanca l'occhio e
fa saltare la riga quando invece conta.

## La controprova

Tolto il ramo che le conta a parte (−51 caratteri, una sola occorrenza): il
riepilogo torna a `{senzaData: 0, aPosto: 2}` — cioè la scadenza di cui non si
sa niente passa **fra quelle a posto**, che è precisamente il difetto che il
commento del modulo descrive. Il banco cade sul caso giusto.

## Verifica

`stati-non-misurati` **75/0** — 44 stati cercati, 6 app (erano 73/0 e 43).
`run-kpi` 1123/0, `run-demo` 8/0.

## Prossimo passo atomico

«senza data» è chiusa su tutte e quattro le app. La classifica va **ricontata**,
e la voce successiva letta con il criterio ormai fisso (accanto a un numero di
cui cambia la lettura). Le candidate in testa restano «non si sa» (tre app) e
«non indicato» / «non indicata» (tre ciascuna): per queste il sospetto,
dichiarato in anticipo, è che siano in maggioranza **ripieghi di campo** — e in
quel caso si dichiarano in blocco invece di aprirne una per unità.
