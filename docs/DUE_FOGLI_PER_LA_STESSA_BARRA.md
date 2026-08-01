# Due fogli condivisi disegnano la stessa cosa

*Misurato il 01/08/2026, dopo che la barra dell'amministrazione di Deepwork ID è
uscita dallo schermo su un telefono. Non è la storia di quella pagina: è la
misura di **perché** poteva succedere, e serve a rendere concreto l'item E0
della roadmap («consolidamento in `shared/`»), che finora era una buona
intenzione senza numeri.*

## I tre fogli, e quanto si sovrappongono

| foglio | selettori |
|---|---|
| `shared/deepwork-style.css` | 18 |
| `shared/dw-app-shell.css` | 43 |
| `shared/dw-app-ui.css` | 208 |

**49 selettori sono definiti in più di un foglio.** Il grosso è fra shell e ui:

> **38 dei 43 selettori di `dw-app-shell.css` sono ridefiniti da
> `dw-app-ui.css`** — che nelle pagine viene caricato **dopo**, quindi vince.

Non è una duplicazione qualunque: sono le stesse cose disegnate due volte —
`.top`, `.nav`, `.page`, `.kpi`, `.item`, `.badge`, `.sec`, `.avatar`, `.info`,
`.name`, `.meta`.

## I cinque che sopravvivono, e il guaio che fanno

Quando una pagina carica **entrambi**, di `dw-app-shell.css` restano vive solo
cinque regole:

```
.top h1 .accent    .top .sub    .kpi.accent    .kpi.accent .n    .item:active
```

⛔ E qui c'è il difetto vero, non un'inefficienza: **le due metà della barra
alta arrivano da fogli diversi**. Il *layout* di `.top` lo decide `dw-app-ui`
(`display:flex; align-items:center`); lo *stile* di `.top .sub` lo decide
`dw-app-shell`, che quella barra la pensava come un **blocco** — titolo sopra,
sottotitolo sotto.

Risultato: `h1` e `.sub` diventano due voci affiancate di una riga senza regole
di restringimento. Finché il titolo è corto ci stanno; quando è lungo il secondo
esce dallo schermo. È esattamente ciò che è successo all'amministrazione —
**441 px di contenuto in 390** — e che a `profilo.html` non succede solo perché
«PROFILO» è una parola corta.

## Chi carica che cosa (e perché conta)

| pagina | fogli |
|---|---|
| le sei app + `admin.html` + `_collaudo-grafici` | style + **shell + ui** |
| `profilo.html` | style + **shell** (senza ui) |
| `genesi.html` | **ui** soltanto |
| `deepwork-id/index.html`, `non-autorizzato.html`, `apps/index.html` | **style** soltanto |

Tre combinazioni diverse su undici pagine. Ed è la ragione per cui una
correzione «ovvia» può peggiorare le cose: portando `admin.html` alla struttura
del core ho provato ad applicarla anche a `profilo.html`, e lì `.top-brand`,
`.logo-sm` e `.role-sm` **non esistono** — quella pagina `dw-app-ui.css` non lo
carica. Il titolo è rimasto senza stile, e l'ho ripristinata.

## Che cosa farne (proposta per E0, in ordine di rischio)

1. **Togliere da `dw-app-shell.css` i 38 selettori che `dw-app-ui.css`
   ridefinisce.** Sono già senza effetto dove i due convivono; l'unico posto
   dove cambierebbe qualcosa è `profilo.html`, l'unica pagina che carica shell
   **senza** ui. Va fatto insieme al punto 2.
2. **Decidere che cosa carica `profilo.html`.** O passa a `shell + ui` come le
   sue sorelle — e allora va rimisurata, perché il commento in `admin.html`
   racconta che aggiungere `ui` a una pagina nata senza **le cambia l'impianto**
   (una riga da 74 a 115 px, la pagina da 802 a 992, e a 390 px comparve lo
   scroll orizzontale) — oppure resta com'è e si dichiara.
3. **I cinque superstiti trovano una casa sola.** `.top .sub` in particolare non
   deve stare in un foglio che disegna una barra a blocchi mentre un altro la
   disegna a riga: o la barra è una sola struttura (`.top-brand` del core, come
   nelle sei app) o le regole si contraddicono a ogni parola lunga.
4. **Un controllo che lo tenga fermo.** Oggi nessuna prova si accorge che due
   fogli condivisi definiscono lo stesso selettore. La forma è quella già usata
   da `nomi-doppi.mjs` per le funzioni: o è la **stessa** regola, o la
   differenza va **dichiarata con la ragione**.

⚠️ **Nessuno di questi passi va fatto a occhio.** Ogni pagina che cambia foglio
va rimisurata con `fuori-schermo` e `contrasto` alle due larghezze del banco:
il difetto di oggi era invisibile da lontano e si vede solo aprendo la pagina a
390 px.

## Come rifare la misura

`node` sui tre fogli, senza rete: si tolgono i commenti, si prendono i selettori
di primo livello e si incrociano. Lo script sta nello scratchpad di questa
unità; se serve stabilmente, il posto giusto è una regola di `run-stile.mjs`
(punto 4).
