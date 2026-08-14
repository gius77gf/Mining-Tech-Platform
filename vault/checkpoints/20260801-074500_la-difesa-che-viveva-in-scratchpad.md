# La difesa che viveva in scratchpad

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-072500_terra-non-fa-euro.md`

## Il problema, che è di forma e non di codice

Nelle due unità precedenti lo stesso difetto è comparso in **due app a un'ora di
distanza**: uno stato che dice «non è stato misurato» esisteva nel codice, era
provato, era commentato — e **nessuno poteva vederlo**, perché la dimostrazione
non conteneva il caso. In Scudo tre volte, in Terra una.

Nessuna prova `node` poteva accorgersene: il codice era **giusto**. Erano i dati
a non arrivarci. E le due sonde che l'hanno trovato erano script di scratchpad,
cioè — testuale in `CLAUDE.md` — *una difesa che resta nello scratchpad, alla
sessione dopo non esiste*.

## Il banco

`stati-non-misurati.mjs` apre le pagine vive e pretende che **sei** stati di
questo tipo compaiano davvero sullo schermo:

| app | stato |
|---|---|
| Scudo | documento senza stato · ispezione chiusa a metà · nomina senza data · lavoratore senza scadenze |
| Terra | anno con lo scavo mai rilevato · base dell'onere non dichiarabile |

È `sonda-vuoto.mjs` preso dall'altro capo: quella guarda i **moduli** e chiede
che non nascano numeri tranquilli; questo guarda la **pagina** e chiede che gli
stati che dicono «non si sa» ci siano. **13 prove, 6 stati cercati.**

⛔ E pretende la **riga**, non il testo: contenitore dichiarato, altezza diversa
da zero, e nessuna riga più alta di 1,6× le sorelle. Sono le tre trappole in cui
la versione di scratchpad era caduta — una per volta, e ogni volta dicendo
«trovata».

## Due difetti trovati mentre lo scrivevo

1. **`prendiChromium()` non prende un percorso**: restituisce il modulo, non un
   browser. La prima riga era `prendiChromium(CHROMIUM)`.
2. **La denuncia di Terra si apre sull'anno CORRENTE**, che è misurato: lo stato
   «non dichiarabile» c'era e il banco non lo trovava, perché non aveva scelto
   l'anno cieco. Da qui il passo `prima` ({dentro, testo}), che clicca il 2024
   prima di misurare. Senza, il banco avrebbe detto KO su una pagina sana — cioè
   avrebbe accusato il codice per un difetto suo.

## La controprova, su due piani

1. **incorporata** (`--controprova`): cerca uno stato che nessuna pagina scrive.
   Se il banco lo «trova», non sta guardando dove crede. Cade come deve.
2. **la regressione vera**: rimesso `c6` a `stato: "valido"` nella dimostrazione
   di Scudo (`+6 caratteri`) — cioè il difetto di stanotte, riprodotto — il
   banco dice **KO: «documento senza stato — non compare in #doc-list»**. È
   esattamente il caso per cui esiste: una dimostrazione che perde un caso in
   silenzio. Ripristinato e verificato `diff` identico.

## Collegato, non solo scritto

Aggiunto a `tutti.mjs` con la sua controprova: **39 banchi** (erano 37).
`suite-collegate` passa da 43 a **44 file guardati**, tutti in una delle tre
case — cioè il banco non è orfano.

⚠️ `numeri-nei-documenti` è caduta **2 volte** e aveva ragione: i due documenti
dicevano ancora «37 esecuzioni». Corretti, poi 17/0. È la seconda volta in due
unità che quella guardia prende un numero invecchiato che avrei scritto giusto
solo per fortuna.

## Verifica

`stati-non-misurati` **13/0** (6 stati), controprova incorporata cade come deve,
controprova per regressione cade sul caso giusto. `suite-collegate` 3/0, 44
file. `numeri-nei-documenti` 17/0, 39 banchi. `run-stile` 271/0,
`copertura-funzioni` 0 scoperte, `nomi-doppi` 0 da sistemare.

## Prossimo passo atomico

Il **campo del volume detratto per recupero** in Terra: oggi
`baseOnereEscavazione` lo accetta e nessuno può scriverlo. Prima della UI va
deciso **dove si persiste**, perché è un dato **per anno** e Terra non ha
un'entità «anno» — le candidate sono un campo sull'autorizzazione indicizzato
per anno oppure una collezione nuova. Da progettare in scratchpad prima di
scrivere nel modulo, come pretende `CLAUDE.md` (tre progetti su tre bocciati in
quel passaggio il 05/08).
