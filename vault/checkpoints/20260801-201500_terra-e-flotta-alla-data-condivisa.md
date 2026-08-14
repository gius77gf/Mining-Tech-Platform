# Terra e Flotta alla data condivisa, e la prova che una rinomina è riuscita

**Data:** 01/08/2026 · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Partenza del ciclo:** `806ec54` (canarino)
**Unità precedente:** `20260801-192832_i-tre-cantieri-genesi-e-la-data-italiana.md`

## Che cosa è stato completato

Il passo che l'unità precedente aveva lasciato **aperto e dichiarato**: Terra e
Flotta non erano state migrate alla `dataIt` condivisa, «perché quella di Flotta
valida già e la `dmy` di Terra fa un'altra cosa».

⛔ **La prima metà di quella ragione era falsa, e l'ha detto la misura.** Prima
di toccare una riga ho messo le tre funzioni una accanto all'altra sugli stessi
sette casi:

| valore | flotta | terra | shared |
|---|---|---|---|
| `2026-02-30` | **30/02/2026** | **30/02/2026** | — |
| `2026-13-45` | **45/13/2026** | **45/13/2026** | — |
| `2026-07-31T10:00` | 31/07/2026 | **—** | 31/07/2026 |

«Valida già» voleva dire **valida la forma**: `^\d{4}-\d{2}-\d{2}$` è contenta
di un 30 febbraio. E Terra sbagliava **nei due versi opposti** — accettava una
data che non esiste *e* rifiutava un istante, cioè perdeva una data buona. Se
avessi creduto alla riga scritta il blocco prima, due difetti veri sarebbero
rimasti dentro con la mia firma sopra.

La seconda metà invece era vera: la `dmy` di Terra scrive **gg/mm senza
l'anno**, ed è un'altra funzione da quella di Campo che ha lo stesso nome — il
caso che `nomi-doppi.mjs` esiste per prendere. Ha preso il nome che dice quello
che fa: **`giornoMese`**, in 6 punti.

## ⛔ Perché non bastava aprire le pagine

`pagine-vive` dice che una pagina **si apre**. Ma `giornoMese` vive nelle
etichette dei grafici e nei titoli dei rilievi, che si disegnano **solo entrando
nelle sezioni**: un nome rimasto vecchio in un ramo che il primo schermo non
tocca è un `ReferenceError` che nessuna suite `node` e nessuna apertura di
pagina vedrebbero — la pagina si apre e muore al primo tocco, che è
letteralmente il difetto già descritto in `CLAUDE.md` per il `<script>`
dimenticato.

Quindi la prova della rinomina è stata una sonda che **naviga**: tutte le
sezioni di tutte e sei le app, raccogliendo `pageerror`, con la prova di aver
davvero cambiato schermata (quante schermate **diverse** ha visto).

```
terra 6 · flotta 6 · campo 5 · conti 9 · scudo 7 · sentinella 6
39 sezioni, 39 schermate diverse, nessun errore di pagina
```

Le «6 schermate diverse su 6 sezioni» sono lì per la ragione scritta in
`CLAUDE.md`: un banco che non naviga fotografa otto volte il Quadro e risponde
«tutto a posto».

## E la settima voce di Scudo, vista solo nello scatto

Il cantiere degli appaltatori ha aggiunto la voce «Appalti»: a 320px in modalità
outdoor «Quadro» chiedeva **40px in una cella da 39**. Un pixel — invisibile
leggendo il codice, e la regola 19 (colonne = voci) era rispettata.
Il primo rimedio **peggiorava**: `overflow:hidden` copiato da Conti passa da 1
etichetta tagliata a **3**, perché azzera la larghezza minima automatica e le
colonne diventano davvero uguali. Conti se lo permette perché ha parole corte.
Misurato: 8px → 1 tagliata, **7,5px → nessuna**. Sotto i 370px outdoor e
modalità normale **convergono**, ed è scritto in chiaro nel commento invece che
nascosto: con sette voci su 320px non c'è spazio per essere più grandi *e*
interi, e fra le due vince intera.

## Verifica

`run-kpi` **1308/0**, copertura **543/543** e 10 soggetti a posto,
`numeri-nei-documenti` 17/0 (**1675 prove** contate, e i documenti sono
allineati), `giro-node.mjs` verde. Sonda di navigazione: **39 sezioni, 0
errori**. `0` occorrenze di `dmy(` rimaste in Terra e in Flotta.

## Prossimo passo atomico

Aprire i tre cantieri paralleli del blocco successivo su app diverse (regola del
primo moltiplicatore: **almeno tre insieme**), e in parallelo la ricerca mirata
con `haiku` su un argomento a rotazione.
