# Lo stesso numero, scritto in due modi

*Misurato il 02/08 su Chromium e su Node, uno accanto all'altro.*

## Il fatto

`toLocaleString("it-IT")` — la funzione con cui si scrive un numero
all'italiana — **non raggruppa le migliaia allo stesso modo dappertutto**.
Sui numeri di **quattro cifre**, e solo su quelli:

| numero | Chromium *(il browser del cliente)* | Node *(dove girano le prove)* |
|---|---|---|
| 1286 | `1.286` | `1286` |
| 6375 | `6.375` | `6375` |
| 12345 | `12.345` | `12.345` |
| 999 | `999` | `999` |

Il motivo è una strategia di raggruppamento chiamata `min2`, che Node
applica di serie: raggruppa **solo da cinque cifre in su**. Scrivendo
`useGrouping: true` la differenza sparisce e tutt'e due dicono `1.286`.

## Perché conta, e perché NON è un difetto del prodotto

Dentro una pagina gira tutto nello stesso motore: l'utente vede
**`6.375 ore`**, che in italiano è giusto. Il prodotto è a posto.

Il problema è **fra la pagina e le prove**. I moduli dati
(`apps/<nome>/<nome>-data.js`) sono importati da tutt'e due: dalla pagina
nel browser e dalle prove in Node. Una funzione di quei moduli che non
fissa il raggruppamento **restituisce due stringhe diverse a seconda di
dove gira** — e allora:

- una prova che scrive «mi aspetto `6375`» **passa in Node e fallisce nel
  browser**, cioè blinda una verità che l'utente non vede mai;
- ed è già successo, in questa suite: la prova sulla frase del tagliando
  («CAT 320 ha 6375 ore») è stata scritta così proprio perché in Node
  quella era la risposta. All'utente quella frase dice **6.375**.

Una prova che misura l'ambiente invece del prodotto è la stessa famiglia
del difetto delle date: il contenitore è a Greenwich, le cave sono in
Italia. Lì la risposta è stata rilanciare le prove con l'orologio del
cliente; qui è **togliere l'ambiguità alla radice**.

## Quanti punti sono

63 chiamate in tutto. Quelle che contano sono le **7 dentro i moduli
dati**, perché solo quelle vengono lette da tutt'e due i motori:

- `apps/campo/campo-data.js` — già a posto (`useGrouping: true` scritto a
  mano, col commento che spiega perché);
- `apps/sentinella/sentinella-data.js` — già a posto;
- `apps/flotta/flotta-data.js` — **4 punti**, fra cui la frase del
  tagliando;
- `apps/terra/terra-data.js` — **2 punti**;
- `shared/deepwork-id-client/dw-shell.js` — **1 punto** (`perCampo` no: là
  il raggruppamento va **spento**, perché un punto delle migliaia dentro
  un campo rientrerebbe come numero ambiguo).

Le 56 chiamate dentro le **pagine** non hanno questo problema: girano solo
nel browser, e sono coerenti fra loro.

## Che cosa si fa

1. si scrive `useGrouping` **esplicito** nei sette punti dei moduli dati —
   `true` dove il numero si legge, `false` dove il numero rientra in un
   campo;
2. si corregge la prova del tagliando, che adesso può finalmente
   affermare quello che **l'utente vede davvero**: `6.375`;
3. si aggiunge una regola automatica: dentro un modulo dati,
   `toLocaleString("it-IT")` **deve** dire come raggruppa. Così la
   prossima volta non serve ricordarselo.
