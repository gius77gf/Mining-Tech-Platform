# La sonda che non navigava, e la riga che adesso lo impedisce

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/giro.mjs`
**Unità precedente:** `20260801-155500_sentinella-la-manina-solo-a-chi-la-merita.md`
(commit `c640006`) — **di cui questo file corregge i numeri**

## Che cosa è successo

`vaiA(p, nome, sezione)` vuole **tre** argomenti. Nella sonda scritta per
misurare i cursori l'ho chiamata con **due**: `vaiA(p, sez)`. La sezione è
finita in `nome`, `sezione` è rimasta `undefined`, e la funzione è uscita
**senza cliccare niente**.

Effetto: la sonda ha girato le sezioni di Conti e Sentinella misurando **sempre
la stessa schermata**. Non ha dato errore, non ha dato zero, ha dato numeri
plausibili — e li ho presi per buoni e scritti in un checkpoint e in un
messaggio di commit.

⚠️ E il modo in cui l'ho scoperto è quello che rende la cosa istruttiva: il
sintomo **non sembrava un guasto della sonda, sembrava un prodotto strano** —
la stessa riga («Polvere · Reclamo aperto», «Edilcave Srl · 4 DDT da
fatturare») che compariva in *tutte* le sezioni. Ho passato mezz'ora a cercare
un difetto nel prodotto, e in mezzo ci ho scritto pure che «forse `.page.active`
sta su più sezioni insieme, ma non l'ho stabilito». Non l'avevo stabilito
perché non c'era: le pagine attive sono sempre **una**.

## I numeri veri

| | sonda ferma | sonda che naviga |
|---|---|---|
| Sentinella, voci guardate | 42 *(la dashboard × 6)* | **39** |
| con `.cliccabile` | 36 | **14** |
| ferme | 6 | **25** |
| bottoncini `.arr` | 36 | **56** |
| in disaccordo con la classe | 0 | **0** |

La correzione fatta ieri al prodotto **regge**, ed è più utile di come l'avevo
raccontata: le voci che smettono di promettere un tocco che non c'è sono **25**,
non 6.

E la domanda decisiva — *fra le voci senza la classe ce n'è qualcuna viva?* —
adesso ha una risposta misurata bene, separando l'aggancio **sulla riga** da
quello **dentro** la riga (il bottoncino `.arr`, che è lui il bersaglio):

> **39 voci · 14 con `.cliccabile` · 14 con un aggancio sulla riga · nessuna
> voce viva resta senza la classe.**

## Conti: il difetto era mio, non suo

Con la sonda che naviga, Conti si comporta benissimo: una sola `.page.active`
per volta, e le 15 righe `.item.tap` compaiono dove devono — **14 in
`nav-fat`** (le fatture) e **1 in `nav-cos`**. Il «0 righe con `.tap`» che
avevo misurato era la dashboard, dove `.tap` non ce n'è.

Quindi il sospetto sul prodotto cade, e resta in piedi solo la domanda vera,
che è la stessa di Sentinella: le voci di Conti senza `.tap` sono ferme davvero?
È l'unità successiva, adesso che lo strumento misura.

📌 Nota di metodo, e non è la prima volta oggi: **la regola «quando il controllo
e il sorgente si contraddicono, il difetto è nel controllo» ha funzionato**.
L'avevo scritta ieri per non toccare Conti a occhio, e mi ha risparmiato una
modifica sbagliata a un'app sana.

## La riga che lo impedisce

`vaiA` adesso controlla il **numero di argomenti** e si rifiuta di far finta:

```
vaiA(p, nome, sezione) vuole TRE argomenti: chiamata con 2 ("nav-fat" è finito
in `nome`). Senza il terzo non naviga, e il banco misurerebbe la stessa
schermata a ogni giro.
```

⚠️ Il controllo è sul **numero** di argomenti, non sul valore: una `sezione`
vuota è legittima — è quello che risponde `sezioniDi` per le pagine senza barra
di navigazione, e vuol dire «guardala tutta in una passata». Una guardia sul
valore avrebbe bocciato le tre pagine di Deepwork ID entrate oggi nell'elenco.

Controprova nei **tre** versi, senza browser: due argomenti → scatta; tre con
sezione vuota → passa; tre normali → passa. *3 attese rispettate, 0 no.*
E i banchi veri, che `vaiA` la chiamano bene da sempre (`grep`: cinque file,
tutti con tre argomenti), continuano a girare.

## Prossimo passo atomico

Conti: rifare su di lei la misura riga per riga, adesso che la sonda naviga —
quante voci senza `.tap` hanno un aggancio **sulla riga**. Se zero, la stessa
riga di Sentinella (`.item{cursor:default}`); se no, il difetto è che manca la
classe a qualcuna, e allora la correzione è un'altra.

E prima ancora: leggere l'esito del giro completo del browser (`tutti.mjs`).
