# Il lettore di CSV in `shared/`, e il bonifico che spariva

**Data:** 01/08/2026 · **Tipo:** debito dichiarato, chiuso · **Branch:**
`claude/scheduled-tasks-remote-control-bk4ap6`
**Commit:** `3aa6b12` · **Partenza del ciclo:** `806ec54` (canarino)
**Unità precedente:** `20260801-184016_i-tre-cantieri-e-i-due-buchi-dellharness.md`

## Che cosa è stato completato

`leggiCsv` era l'**unico lettore di CSV completo** dell'ecosistema — separatore
deciso su tutto il file, virgolette doppie raddoppiate, BOM, terminatori
Windows, e soprattutto **l'a capo dentro un campo quotato** — e viveva dentro
Sentinella. Conti, che da ieri legge l'estratto conto della banca, usava
`parseCsvLine` **riga per riga**.

## ⛔ Il difetto è stato misurato, non dedotto

Le banche la descrizione lunga la scrivono su più righe dentro le virgolette:

```
21/07/2026;"BONIFICO DA CAVA ROSSI SRL
SALDO FATTURA 2026/034";12.300,00
```

La lettura riga per riga produceva **due righe rotte** e le scartava tutt'e due:
l'incasso da **12.300 €** — l'unico movimento vero del file — spariva.

Lo scarto era **dichiarato**, quindi non silenzioso. Ma il pagamento non si
abbinava, e la fattura restava aperta con la sua mora ex D.Lgs 231/2002 che
corre. È il caso peggiore che questa funzione possa produrre: non un numero
sbagliato, una **lettera sbagliata a un cliente che ha pagato**.

## La decisione che vale la pena tenere

Si è spostata **solo `leggiCsv`**. `paresIntestazione` e `proponiMappa` sono la
proposta di mappatura delle colonne per la schermata di import di Sentinella:
servono a **una** app, e portarle in `shared/` sarebbe stato spostare **per
ordine**, non perché due app le usano. La regola dice «serve a due app», non
«sta bene insieme» — e allargarla di straforo è il modo in cui `shared/` diventa
un cassetto.

## Verifica

Sul formato vero di Conti: **8 movimenti prima e dopo, zero scartati**, e la
causale su due righe arriva intera con l'importo giusto.

Controprova: rimessa la lettura riga per riga (1 punto, +106 caratteri, file
ripristinato identico), la prova cade dicendo la cosa esatta — *«atteso 8,
ottenuto 9»*.

Sulla copia di quello che si committa (sul disco ci sono tre cantieri in volo):
`run-kpi` **1253/0**, `run-stile` 275/0, `run-demo` 8/0, `run-helpers` 49/0,
copertura **514/514** e 9 soggetti a posto, `sonda-vuoto` 7/0, `nomi-doppi` 0 da
sistemare, `numeri-nei-documenti` 17/0. Anche con `TZ=Europe/Rome`.

Il fondo di `sentinella` **scende** da 110 a 109 e la ragione è scritta: non è
una prova tolta, è una funzione traslocata — `dw-shell` sale da 29 a 30 dello
stesso passo.

⚠️ **E un errore mio l'ha preso il controllo dei numeri nei documenti**: la mia
sostituzione aveva scritto 1253 anche al posto delle 275 prove di stile, e la
riga si contraddiceva da sola («la frase dice 1620 ma i suoi addendi fanno
2598»). Seconda volta nella giornata che quel controllo prende **me** invece del
codice.

## Stato roadmap

Tre cantieri aperti in parallelo su Scudo (appaltatori e DUVRI, art. 26 D.Lgs
81/08), Campo e Flotta (ognuno sceglie la mancanza confermata più utile dal
proprio delta, con l'obbligo di riverificare che sia ancora vera).

## Prossimo passo atomico

Raccogliere i tre cantieri e committarli **app per app**, misurando la copia di
ciò che si committa e non il disco — che con i cantieri aperti si muove. Poi,
dalle mancanze confermate rimaste, aprire il giro successivo.

Il candidato più promettente per il ciclo dopo, che non è una funzione ma un
buco strutturale: **le 192 funzioni di Genesi vivono dentro `genesi.html`** e
`node` non le importa, quindi sono l'unica parte del prodotto con **zero prove
pure**. Tirarne fuori un modulo dati è un cantiere intero, ed è dichiarato in
`docs/DEVELOPMENT.md` invece che nascosto.
