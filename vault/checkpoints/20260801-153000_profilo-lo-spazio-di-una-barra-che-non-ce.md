# `profilo.html`: lo spazio riservato a una barra che non c'è

**Data:** 01/08/2026 · **Area:** `shared/dw-app-shell.css`
**Unità precedente:** `20260801-150500_e0-passo3-shell-ridotto-a-una-pagina.md`
(commit `9766918`)

## Che cosa è stato fatto

`body.dw { padding-bottom: calc(64px + env(safe-area-inset-bottom)) }` teneva
libera in fondo alla pagina l'altezza della barra di navigazione. Ma
`profilo.html` **non ha** una barra di navigazione — e da ieri
`dw-app-shell.css` è il foglio di quella pagina e basta.

Non era spazio scelto: era spazio **avanzato**, rimasto da quando lo stesso
foglio serviva anche le sei app. Al suo posto uno stacco **deciso**: 24 px più
l'intaglio del telefono, cioè lo stesso respiro che `dw-app-ui.css` dà in fondo
alle pagine delle app.

| | prima | dopo |
|---|---|---|
| pagina @390 | 1100 px | **1060** |
| pagina @360 | 1140 px | **1100** |
| spazio sotto l'ultimo elemento | 64 px | **24** |

## ⛔ Il primo tentativo era giusto nel numero e sbagliato nella pagina

Al primo colpo lo stacco l'avevo messo sulla `.page`
(`padding: 16px 16px 24px`), togliendo del tutto il fondo dal `body`. I numeri
erano **migliori** di quelli finali — pagina a 1044 invece di 1060, cioè 56 px
recuperati invece di 40 — e la prova sarebbe passata.

Poi ho guardato lo **scatto del fondo pagina**, prima e dopo affiancati: il
messaggio di stato era **incollato al bordo inferiore**. La ragione è nel
markup, non nel foglio: `#msg` sta **fuori** dalla `.page`, quindi una
spaziatura messa lì non lo riguarda.

Rimesso lo stacco sul `body`, che vale per qualunque cosa finisca per ultima.
È esattamente la regola di `CLAUDE.md`: gli screenshot vanno **guardati**, non
solo prodotti — qui il numero era contento e la pagina no.

## Verifica

`profilo.html` rimisurata a **390 e 360 px**: larghezza pari al viewport in
tutt'e due (nessun elemento sporge — è la stessa domanda che fa
`fuori-schermo`), `.top` 88, `.item` 62, `padding-bottom` calcolato **24px**,
l'ultimo elemento finisce a 1036 su una pagina alta 1060.

Le sette pagine che **non** caricano più questo foglio, rimisurate per
sicurezza: altezze identiche al pixel (campo 1494, conti 1681, flotta 1755,
scudo 2060, sentinella 1989, terra 1795, admin 975), `.top` 61 per tutte. Cioè
il foglio è davvero isolato su una pagina sola.

`run-stile` **274/0**. Il giro completo del browser (`tutti.mjs`, su copia
congelata) sta ancora girando sul commit `68e1852`.

## Prossimo passo atomico

Leggere l'esito del giro completo su copia (`tutti.mjs`) e, se pulito, passare
ai **quattro banchi mai girati sulle tre superfici nuove** — `unita-maiuscole`,
`note-stato`, `vuoti-azione`, `navigazione` su `id · accesso`, `id · profilo`,
`id · amministrazione`: sono le tre pagine entrate nell'elenco solo oggi, e su
di esse quei quattro controlli non hanno mai misurato niente. Se trovano
qualcosa, quello è il lavoro.

Poi restano E7 (Genesi, allineamento 2D/HUD al core) e E8 (le sette pagine
affiancate).
