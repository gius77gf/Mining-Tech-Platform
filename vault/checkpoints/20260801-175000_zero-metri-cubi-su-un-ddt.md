# Zero metri cubi su un DDT

**Data:** 01/08/2026 · **Area:** `apps/conti/conti-data.js` (`quantitaPesata`)
**Unità precedente:** `20260801-172000_un-no-motivato.md`

## Il caso aggiunto, e il difetto che ha scoperchiato

Applicato il criterio scritto un'unità fa — *un caso da dimostrare deve poter
mancare senza portarsi via il resto* — la «quantità non calcolabile» di Conti
passa: è **locale**, una riga su tredici. Aggiunta `d7`: una pesata **venduta a
metro cubo, senza densità e senza quantità scritta**. Ci si arriva da un import
o da un dato vecchio (il form la blocca), ed è realistica.

E appena messa in dimostrazione, il numero è uscito **sbagliato**:

```
d7 → {"t":24.3,"m3":0}
```

**Zero metri cubi.** Non «non calcolabile»: zero. Su un DDT, zero metri cubi non
è un vuoto — è **una consegna dichiarata di niente**, su un documento che
viaggia col camion.

## ⛔ La causa: `+null` fa 0, e `Number.isFinite(0)` risponde true

```js
const m3 = d.unitaVendita === "m3" && Number.isFinite(+d.quantita)
  ? +d.quantita : convertiQuantita(t, "t", "m3", d.densita);
```

`+null → 0`, `Number.isFinite(0) → true`: la guardia lascia passare l'assenza e
il ramo restituisce **`+d.quantita`**, cioè zero. `convertiQuantita` — che la
cosa giusta la fa, e risponde `null` senza densità — **non veniva nemmeno
chiamata**.

⚠️ È la trappola che **questo stesso file documenta in altri due punti**, con
tanto di commento («`Number.isFinite(+g.base)` DA SOLO NON BASTA»). Scritta due
volte, e mancata la terza.

## Perché nessuno l'aveva vista

Perché **il caso non c'era in dimostrazione**. Il codice difettoso era lì da
prima; le prove giravano su pesate complete; la pagina non poteva mostrarlo.
È la sesta volta stanotte che **aggiungere il caso alla dimostrazione fa
emergere un difetto vero** — e la più netta, perché qui il difetto non era una
frase mancante ma **un numero sbagliato su un documento fiscale**.

## La correzione

Guardia **prima** della coercizione (`qDich == null || String(qDich).trim() === ""`),
come il resto del modulo fa altrove. Ora `d7` dà `m3: null` e la riga scrive
«quantità non calcolabile».

⚠️ E uno **zero scritto dall'utente resta zero**: è un dato, non un vuoto. La
prova lo pretende esplicitamente, altrimenti la correzione avrebbe buttato via
un'informazione vera.

## Verifica

`run-kpi` **1121/0** (4 asserzioni nuove: `null`, `undefined`, `""` → null;
`0` scritto → 0; con densità il conto si fa dal netto). Controprova: rimessa la
coercizione senza guardia, cade. ⚠️ Il ripristino ha sbagliato una volta —
la sostituzione ha colpito anche la **definizione** di `qNota` rendendola
auto-referenziale (1116/5) — visto subito e corretto: è la ragione per cui il
`git diff` si guarda sempre dopo un ripristino, non solo l'esito.
Suite: stile 271/0, demo 8/0, sonda-vuoto 7/0, copertura 0 scoperte,
numeri-nei-documenti 17/0, banco **51/0**.

## Prossimo passo atomico

Mettere **questa riga** sotto il banco: la pesata `d7` deve mostrare «quantità
non calcolabile» nell'elenco, e **non** «0 m³». È il caso più netto per il
`vietato`, perché qui lo zero non è un colore tranquillo ma una **quantità
consegnata**. Poi resta l'ultima condizione della lista, il numero del
cartellone di Campo, da valutare col criterio del «no» motivato.
