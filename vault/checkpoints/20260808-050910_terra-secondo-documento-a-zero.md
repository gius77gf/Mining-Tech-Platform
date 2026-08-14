# Checkpoint — 2026-08-08T05:09:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2d292ad` — *Terra: il secondo documento a zero — 46 commit di arretrato
invece di 71*

## Che cosa è stato completato

Terra aveva l'arretrato **più insidioso** delle sei app: 13 commit e **cinque
che mordono** — cioè che hanno aggiunto o tolto una `export function` o un
`<button>`, le due forme con cui qui nasce e muore una funzione. Cinque è il
numero più alto, e per questo Terra era il documento da riprendere subito dopo
Sentinella.

Quello che quei cinque hanno costruito: `aEufonica`, `articoloNumero`,
`csvRilievi`, `detrazioneRecupero`, `rientroRilievi`, `ripartizioneFronti`, e
un bottone **«Scarica rilievi (CSV)»**. **Nessuna** di quelle cose è una delle
quattro dichiarate assenti (cut & fill, rilevamento automatico dei cumuli, pit
design e scheduling, floating cone).

La prova è la ricerca, non la lettura: **zero occorrenze su 11 termini in 815
righe aggiunte**. Sui file interi restano quattro parole, tutte estranee al
mestiere di cui parlano le righe — `fill`=17 è l'attributo di disegno degli
SVG, `taglio`=5 è la classe CSS `dwg-taglio` (una linea tratteggiata),
`riempimento`=2 è un commento sulla barra di avanzamento, e l'unico `floating`
è la frase «*floating-point number*» in un commento sui decimali.

## Il numero che scende, che è il motivo per cui il conto esiste

| | arretrato | di cui mordono | documenti a zero |
|---|---|---|---|
| prima di stanotte | **71** | 16 | 0 su 6 |
| dopo Sentinella | 59 | 15 | 1 su 6 |
| dopo Terra | **46** | **10** | **2 su 6** |

## ⚠️ E la lezione dell'unità prima è servita subito

I **confini di parola** non sono un dettaglio: su Sentinella, un'ora fa, una
ricerca senza confini aveva dato **cinque falsi allarmi su cinque**. Qui senza
confini `pit` e `cut` sarebbero entrati in decine di parole italiane e inglesi,
e la riverifica avrebbe proposto lavoro su **mancanze immaginarie** — cioè
esattamente il danno contro cui questi documenti sono nati.

## Prove

- `documenti-invecchiati`: `✓ terra verificato a 8583a0b · 0 commit dopo, di
  cui 0 che MORDONO`.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **1.636
righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, e sono tutt'e due lavoro che non tocca le pagine:
- ⏱️ **I quattro documenti che restano**, per arretrato decrescente. Il metodo
  è ormai fisso e costa dieci minuti l'uno: (1) `documenti-invecchiati` dice
  quanti commit e quali **mordono**; (2) si guarda che cosa hanno aggiunto
  (`git show … | grep "export function\|<button"`); (3) si cerca sul **diff**
  con i termini che ogni riga dichiara, **con i confini di parola**; (4) le
  righe «a metà» si rimisurano sui file interi; (5) si sposta il timbro
  all'ultimo commit dell'app.
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola — quello sì tocca le pagine, e vuole il giro fermo.

## Blocchi
Nessuno.
