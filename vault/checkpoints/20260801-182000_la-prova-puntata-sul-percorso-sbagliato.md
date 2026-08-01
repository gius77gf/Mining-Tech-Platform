# La prova puntata sul percorso sbagliato

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-175000_zero-metri-cubi-su-un-ddt.md`

## Messa sotto guardia la riga, e la guardia non guardava

Scritta la riga del banco sul **elenco delle pesate**: «quantità non
calcolabile» presente, e vietato un «0 m³» accanto. Verde. Poi la controprova:
rimesso il difetto (`+null` → 0)… e il banco è rimasto **verde lo stesso**.

**Caso 3** della tassonomia di `CLAUDE.md`: l'iniezione non stava su un percorso
che la prova esercita. La riga della lista scrive

```js
${p.quantita == null ? "quantità non calcolabile" : …}
```

cioè legge il **campo grezzo**, non `quantitaPesata`. Correggere quella funzione
o romperla non cambia una virgola di quella cella: la frase compare comunque, e
la mia prova la vedeva comparire.

## Dove `quantitaPesata` viene consumata davvero

Nel **foglio del DDT**, casella «Volume corrispondente» — che compare **solo se
i m³ ci sono**. Col difetto, `m3` vale 0, la casella compare, e ci scrive:

```
0,00 m³ (netto ÷ densità 0,00 t/m³)
```

Un volume di consegna pari a zero **e** una densità pari a zero, su un documento
che viaggia col camion. La guardia spostata lì **distingue**, e il messaggio di
fallimento contiene la frase falsa per intero.

## Che cosa imparo, oltre al caso

Una prova può essere **giusta nel merito e cieca nel punto**: «la riga dice
quantità non calcolabile» era vero, utile e verificato — ma non era la prova del
difetto che avevo appena corretto. Senza la controprova sarebbe rimasta lì col
nome di una difesa che non faceva.

⚠️ E la riga sull'elenco **l'ho tolta**, non tenuta «tanto male non fa»: una
seconda prova che sembra guardare la stessa cosa e non la guarda è peggio di
nessuna prova — la prossima persona la legge e crede che quel percorso sia
coperto.

## Verifica

Banco **56/0** — 25 stati, sei app, due fogli stampati. Controprova: rimesso il
difetto, cade con `"0,00 m³ (netto ÷ densità 0,00 t/m³)"` nel messaggio.
Ripristinato, `git status` vuoto.

## Prossimo passo atomico

L'ultima condizione della lista «non calcolabile»: il **numero del cartellone di
Campo**. Da valutare col criterio del «no» motivato — un cartellone è meno
locale di una riga, e potrebbe ricadere nello stesso rifiuto del residuo di
Terra. Poi la voce successiva della classifica («non registrato», quattro app).
