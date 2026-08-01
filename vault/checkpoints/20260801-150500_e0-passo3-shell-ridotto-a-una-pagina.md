# E0 passo 3: `dw-app-shell.css` ridotto alla pagina che serve

**Data:** 01/08/2026 · **Area:** `shared/dw-app-shell.css`,
`apps/deepwork-id/tests/run-stile.mjs`, `docs/DUE_FOGLI_PER_LA_STESSA_BARRA.md`
**Unità precedente:** `20260801-131500_e0-i-due-fogli-non-si-caricano-piu-insieme.md`
(commit `68e1852`)

## Che cosa è stato fatto

Dopo il passo 2, `dw-app-shell.css` serviva **una pagina sola** —
`apps/deepwork-id/profilo.html` — e ne portava ancora **41 regole**. Tolte le
**18 che in quella pagina non trovano niente**: tutta la barra in basso
(`.nav*`), tutti i KPI (`.kpis`, `.kpi*`), `.tour-banner`, `.badge.danger`, e il
bottone «Esci» (`.dw-exit`, `.dw-exit:hover`, `body.has-exit .top h1`).

Quest'ultimo merita una riga: `.dw-exit` lo crea `mountExit` di
`dw-shell.js`, e `mountExit` **la chiamano solo le sei app** — `profilo.html`
importa da quel modulo soltanto `esc`. Quindi non era «raro»: era
**impossibile**.

Riscritta anche l'intestazione del foglio, che diceva «shell comune delle app»
e non lo è più: adesso dice di chi è, perché, e dove sta lo stile delle app.

## Come si è misurato, e perché in due modi

`profilo.html` disegna righe, avatar e badge **da JavaScript**: un censimento
che guarda il sorgente vede meno di quello che c'è. Quindi due misure
indipendenti:

1. le classi/id/tag citati nel file (statica);
2. `querySelectorAll` di ogni selettore **dentro il browser**, a pagina
   costruita.

Danno lo **stesso** risultato: 23 vive, 18 morte. Due strade diverse che
arrivano allo stesso numero valgono più di una sola ripetuta.

## Verifica

`profilo.html` rifotografata a **390 e 360 px**, prima e dopo:
**0 pixel diversi su 429.000 e 410.400**, altezza 1100 e 1140 invariate,
`.top` 88, `.item` 62.

⚠️ E uno zero va messo alla prova, se no dice solo che non è successo niente:
tolta **anche** `.avatar`, che la pagina usa davvero (−313 caratteri) → la
pagina cambia subito, alta 1100 → **1079** e la riga da 62 a **55 px**.
Ripristinato identico (confronto col testo originale, non a memoria).

Suite `node`: `run-stile` **274/0**, `run-kpi` 1123/0,
`numeri-nei-documenti` 17/0. Il giro completo del browser
(`tutti.mjs`, su copia congelata) sta girando sul commit precedente.

## I due controlli si sono accorciati da soli, ed è il punto

Questo è il **secondo verso** delle regole 22 e 23 al lavoro: non hanno
protetto da un difetto nuovo, hanno **preteso che l'elenco dimagrisse**.

| | prima | dopo |
|---|---|---|
| doppioni fra fogli condivisi | 50 | **32** |
| divergenze dichiarate | 12 | **3** |

E le tre che restano sono esattamente quelle che devono restare: `.top h1`,
`.top h1 .accent`, `.top .sub` — la barra alta **a blocco** di `profilo.html`,
cioè la differenza da cui era nato tutto il difetto, adesso chiusa in un foglio
che nessun'altra pagina carica.

## ⛔ Una soglia mia, sbagliata, e l'ho presa in faccia il giorno dopo averla scritta

La regola 23 conteneva:

```js
ok(shell.size > 30 && ui.size > 100, "la lettura dei fogli non sta guardando niente");
```

Voleva dire «ho letto il foglio». Diceva «il foglio è grande». Sceso shell a 23
regole **per il motivo giusto**, la guardia ha gridato al guasto — e se avessi
guardato solo l'esito avrei creduto a un problema di lettura.

È la lezione di `CLAUDE.md` sulle soglie su valori che si muovono
(«si controlli **che cosa fa scendere il numero**»), applicata al file che
quella lezione la fa rispettare. Adesso controlla due cose separate: che i file
**si leggano** (`!= null`) e che abbiano **almeno una regola**.

## Prossimo passo atomico

`body.dw { padding-bottom: calc(64px + env(safe-area-inset-bottom)) }` riserva
lo spazio della barra in basso, che `profilo.html` **non ha**: misurati, sono
**64 px di vuoto** sotto l'ultimo elemento (a 390 px la pagina è alta 1100,
l'ultima cosa finisce a 1036; a 360 px 1140 contro 1076). Non tolto in questa
unità di proposito — doveva costare **zero pixel**, e un ritocco vero si misura
per conto suo. È l'unità successiva: togliere la riserva, rimisurare le due
larghezze, e controllare che l'ultimo elemento resti staccato dal fondo di uno
spazio scelto invece che avanzato.

Restano in coda dal ciclo: i quattro banchi mai girati sulle tre superfici nuove
(`unita-maiuscole`, `note-stato`, `vuoti-azione`, `navigazione`), E7 (Genesi
2D/HUD), E8 (le sette pagine affiancate).
