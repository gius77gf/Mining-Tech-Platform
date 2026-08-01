# Trentotto regole su quarantatré

**Data:** 01/08/2026 · **Area:** `docs/DUE_FOGLI_PER_LA_STESSA_BARRA.md` (nuovo)
**Unità precedente:** `20260801-115500_la-barra-che-usciva-dallo-schermo.md`

## Perché questa misura, e perché prima di toccare `shared/`

Il checkpoint precedente si chiudeva con una frase che era ancora un sospetto:
*«finché i due fogli disegnano la stessa barra in due modi, ogni pagina che li
carica entrambi dipende dalla lunghezza delle sue parole»*. Il secondo item
aperto della roadmap — **E0, consolidamento in `shared/`** — è esattamente quel
lavoro, e finora era una buona intenzione **senza numeri**.

La direttiva del fondatore dice ricerca approfondita **prima** di ogni scelta.
Toccare `shared/` a occhio, con tre app e sette pagine che ne dipendono in
combinazioni diverse, è il modo migliore per rompere qualcosa che oggi funziona.

## I numeri

| foglio | selettori |
|---|---|
| `deepwork-style.css` | 18 |
| `dw-app-shell.css` | 43 |
| `dw-app-ui.css` | 208 |

**49 selettori sono definiti in più di un foglio**, e il grosso è fra shell e
ui: **38 dei 43 di `dw-app-shell.css` sono ridefiniti da `dw-app-ui.css`**, che
viene caricato dopo e quindi vince. Non è duplicazione qualunque: sono `.top`,
`.nav`, `.page`, `.kpi`, `.item`, `.badge`, `.sec` — l'impianto intero.

## Il guaio, e non è l'inefficienza

Quando una pagina carica **entrambi**, di shell restano vive **cinque** regole:

```
.top h1 .accent   .top .sub   .kpi.accent   .kpi.accent .n   .item:active
```

⛔ E lì c'è il difetto di stamattina, spiegato: **le due metà della barra alta
arrivano da fogli diversi**. Il layout di `.top` lo decide `dw-app-ui`
(`display:flex`); lo stile di `.top .sub` lo decide `dw-app-shell`, che quella
barra la pensava a **blocco**. I due testi diventano voci affiancate senza
regole di restringimento, e col titolo lungo il secondo esce.

## E la mappa che spiega perché una correzione ovvia può peggiorare

Undici pagine, **tre combinazioni diverse**: le sei app e `admin.html` caricano
style+shell+ui; `profilo.html` shell **senza** ui; `genesi.html` **solo** ui;
tre pagine solo style. È il motivo per cui la mia correzione a `profilo.html`
era sbagliata — lì `.top-brand` e `.logo-sm` non esistono — e il motivo per cui
E0 va fatto **pagina per pagina, rimisurando**.

## Che cosa lascia in mano al prossimo

Quattro passi in ordine di rischio, scritti nel documento: togliere da shell i
38 ridefiniti (senza effetto dove i due convivono), decidere che cosa carica
`profilo.html`, dare una casa sola ai cinque superstiti, e — il punto che
impedisce il ritorno — **un controllo che si accorga se due fogli condivisi
definiscono lo stesso selettore**, nella forma già usata da `nomi-doppi.mjs`
per le funzioni: o è la stessa regola, o la differenza si dichiara con la
ragione.

⚠️ Con l'avvertenza scritta in grassetto: **nessun passo va fatto a occhio**.
Il difetto di oggi era invisibile da lontano e si vedeva solo aprendo la pagina
a 390 px.

## Verifica

Misura ripetibile con `node` sui tre fogli, senza rete e senza browser (togliere
i commenti, prendere i selettori di primo livello, incrociarli). `run-stile`
272/0, `numeri-nei-documenti` 17/0.

## Prossimo passo atomico

Il **punto 4** del documento, che è l'unico che si può fare senza toccare
`shared/`: la regola in `run-stile.mjs` che pretende che due fogli condivisi
non definiscano lo stesso selettore, o che la differenza sia dichiarata. Nasce
già rossa con **49 casi**, quindi la prima versione dichiara i 49 come stato di
fatto e la regola impedisce che diventino 50 — poi E0 li smonta uno alla volta e
il numero **scende**, che è il segno che il lavoro sta andando avanti.
