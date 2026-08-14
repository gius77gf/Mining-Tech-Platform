# «Con un volume» vuol dire con un numero

**Data:** 01/08/2026 · **App:** Terra (+ la suite dei numeri nei documenti)
**Unità precedente:** `20260801-050000_assente-non-e-corrotto.md`

## Il punto di partenza: una segnalazione, non una scoperta

Il cantiere di Terra aveva chiuso il censimento dichiarando una cosa lasciata
fuori: *«ne resta una **quinta variante** in `volumeMisuratoDiLotto` /
`rilieviFuoriDaiLotti` (`Number.isFinite(+r.volumeM3)` invece di `!= null`):
differisce solo su un volume non numerico. Non l'ho toccata — segnalata.»*

Andarla a chiudere ha trovato più di quello che la segnalazione diceva.

## ⛔ Misurato prima di irrigidire, e la sorpresa era nell'altro verso

La segnalazione dava per scontato che la copia a mano fosse quella *sbagliata*
e `rilievoUsabile` quella giusta. Misurando le due condizioni sui casi veri:

| `volumeM3` | `rilievoUsabile` (la canonica) | `Number.isFinite(+v)` (la copia) |
|---|---|---|
| `null` | false | **true** ⚠️ |
| `""` | **true** ⚠️ | true |
| `"  "` | **true** ⚠️ | true |
| `"abc"` | **true** ⚠️ | false |
| `{}` | **true** ⚠️ | false |
| `0` | true | true |

**Sbagliavano tutt'e due, in punti diversi.** La canonica (`volumeM3 != null`)
lasciava passare la stringa vuota e il testo; la copia a mano lasciava passare
`null`, perché `+null` fa **0** e `Number.isFinite(0)` è **true** — la trappola
scritta in `CLAUDE.md`, che qui morde a distanza di due righe da sé stessa.

E il difetto della canonica è il principio del fondatore: un rilievo il cui
volume **non si legge** passava per usabile, e poi ogni somma lo leggeva
`+r.volumeM3 || 0`, cioè **lo contava come una misura di zero**. Un volume che
non si legge non è un volume misurato zero.

**Fin dove si può arrivare, misurato**: `parseRilieviCsv` con la colonna del
volume vuota **scarta la riga** (restituisce `[]`), quindi la via dell'import è
già chiusa. Il caso arriva dal form e dai dati vecchi: latente, non impossibile.

## La correzione

`rilievoUsabile` adesso pretende un **numero**, con le tre guardie
nell'ordine obbligato — `null` fuori **prima** della conversione, stringa vuota
e spazi fuori **prima ancora**, poi `Number.isFinite`. E
`volumeMisuratoDiLotto` **chiama la funzione** invece di riscriverla: la
condizione giusta la impara lei, non ognuno per conto suo.

## Due difetti diversi, due prove diverse — e la controprova lo dimostra

Rimettendo i difetti uno per volta su una copia:

| difetto rimesso | caratteri | esito |
|---|---|---|
| `rilievoUsabile` torna a `!= null` | 100 | **cade** — i rilievi contati diventano 2 invece di 1 |
| `volumeMisuratoDiLotto` torna alla copia a mano | 38 | **cade** — diventano 3, e **l'identità si rompe** |

La coppia è il punto: la **conta** prende la regola indebolita, l'**identità**
(`filtro del lotto === rilievoUsabile`) prende la copia scritta a mano. Con la
sola conta, una sesta copia identica-per-caso passerebbe; con la sola identità,
due copie ugualmente sbagliate andrebbero d'accordo fra loro. È la stessa
ragione per cui `nomi-doppi.mjs` pretende l'identità e non il comportamento.

## ⚠️ E un secondo difetto, trovato aggiornando i documenti

`docs/STATO_PRODOTTO.md` scrive il totale delle prove **accanto alla sua
scomposizione**: «1.471 prove — 1108 sulle funzioni delle app, 271 sulle regole
di stile, 49 sugli aiuti condivisi…». Il controllo `numeri-nei-documenti.mjs`
guardava **solo il totale**: gli addendi facevano **1469** mentre il totale
accanto diceva **1471**, e nessuno se n'era accorto.

La ragione è banale e per questo si ripeterà: aggiornare il totale costa una
sostituzione, aggiornare gli addendi ne costa sei, e la sesta si dimentica.
Due numeri che si contraddicono **nella stessa frase** sono peggio di un numero
vecchio: fanno dubitare di tutti gli altri.

Adesso c'è la regola (`addendiTornano`, che prende il **testo** e non il
percorso) con la sua controprova in tre direzioni: la frase sana torna, un
addendo cambiato viene visto, e una frase che non c'è risponde `null` invece di
«tutto a posto». Verificato anche **quanti addendi trova davvero**: sei —
`1108 + 271 + 49 + 26 + 9 + 8` — non quattro che tornano per caso.

## Verifica

- `run-kpi` **1108/0** (+1 blocco: `volumeMisuratoDiLotto` usa `rilievoUsabile`,
  con 6 casi nuovi sul volume non numerico), `run-stile` 271/0, `run-demo` 8/0,
  `run-helpers` 49/0, `run-pointcloud` 26/0, `run-manifest` 9/0.
  **Totale 1.471.**
- `numeri-nei-documenti` **17/17** (+2: la regola degli addendi e la sua
  controprova), copertura 456/456.
- `sonda-vuoto` 7/0.
- Tutte con `TZ=Europe/Rome`.

⚠️ Nessuno scatto in questa unità, e non per dimenticanza: **sta girando il
giro completo del browser** su una copia congelata di `069d70e`, e una seconda
sessione di Chromium lo affamerebbe — è la misura già pagata (3,5× più lento su
4 core). Le modifiche sono tutte nel modulo dati e nelle suite, cioè nella parte
che `node` verifica per intero.

## Prossimo passo atomico

**Leggere il giro del browser fino in fondo** quando finisce, e portare a
schermo le cose che il giro non copre: le cinque righe nuove di Scudo (il
riepilogo persone, «Nessuna scadenza», «Chiusa a metà», «Senza data di nomina»,
«Stato non indicato»), che il loro cantiere ha dichiarato **non guardate**
perché Playwright gli era vietato.
