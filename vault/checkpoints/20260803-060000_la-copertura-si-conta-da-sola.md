# Checkpoint — la copertura si conta da sola

**Commit:** `01f05ab` (e `78cc520` per Conti)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

Due cose piccole e una che vale per tutte le prossime sessioni.

### 1. Conti chiude quasi (3 prove)

`round2` è la funzione da cui passa **ogni** importo di Conti: se la somma
degli acconti non torna col totale al centesimo, una fattura risulta non
saldata per un millesimo e **parte un sollecito a un cliente in regola**.

`valorePesata` legge i dati **fotografati sul documento**: un DDT già
emesso vale quello che è stato consegnato e fatturato, e se domani il
listino cambia il documento non deve cambiare con lui.

La prima stesura di quella prova **non sapeva distinguere il difetto** —
causa 3 di `CLAUDE.md`: il caso difeso non c'era nella prova. Il caso che
conta è una pesata venduta a **metro cubo ma senza densità**: ha il netto
in tonnellate e la quantità a `null`, e ripiegare sul netto la valuterebbe
moltiplicando **tonnellate per un prezzo al metro cubo**. Aggiunto quel
caso: 2 su 2.

### 2. La copertura si conta da sola

`apps/deepwork-id/tests/copertura-funzioni.mjs`.

Per due giorni questo numero l'ho contato a mano, un comando alla volta, e
si è già visto cosa succede: un checkpoint ha scritto «Scudo 35/71» quando
erano 30, e un messaggio di commit «Sentinella 94/107» quando erano 89.
**Due correzioni pubbliche per un numero che un programma conta in mezzo
secondo.**

Tre cose scritte apposta:

- stampa **quante funzioni ha guardato**, non solo quante ne ha trovate
  coperte — è la difesa che `CLAUDE.md` chiede tre volte contro il
  controllo che risponde «pulito» senza aver guardato niente;
- il **fondo** per app non è un traguardo, è un pavimento: se una app ci
  scende sotto vuol dire che sono state aggiunte funzioni senza prove.
  Abbassarlo per farlo passare è esattamente il gesto che quel file esiste
  per rendere visibile;
- le eccezioni (caricatori dati e ponti demo: vogliono la rete o il
  `localStorage`) sono un **elenco scritto**, non una cosa da ricordarsi.

**Controprova**: tolto un `campo.squadraBase(` da `run-kpi.mjs`, il
controllo scende a 71/72 ed esce con 1. File ripristinato e **verificato
identico** all'originale.

## Dove siamo

**401 funzioni coperte su 409 guardate** nelle sei app:

| app | | |
|---|---|---|
| Campo | 72/72 | 100% |
| Scudo | 70/70 | 100% |
| Sentinella | 101/102 | 99% |
| Conti | 56/57 | 98% |
| Terra | 37/38 | 97% |
| Flotta | 65/70 | 93% |

Quello che resta scoperto è **tutto il blocco
`messaggioNumero`/`AVVISO_DECIMALE`**, cioè la correzione già misurata e
in attesa.

`run-kpi.mjs`: **962**; totale `node`: **1.245**.

## La correzione in sospeso è PRONTA

`scratchpad/numeri-doppi/applica.mjs` applica tutta la correzione di
`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md` in un colpo: lo shell che esporta
le due frasi (con la versione **migliore** di quella sulle migliaia), le
quattro app che le **ri-esportano** invece di ridichiararle, e la seconda
`messaggioNumero` di Flotta che diventa un alias.

Tutte e nove le ancore sono state **verificate una per una** (compaiono
esattamente una volta ciascuna) **senza scrivere niente**: il file
`applica.mjs` conta le sostituzioni e si ferma se un'ancora non torna.

Parte nel momento in cui finisce il giro del browser.

## Stato del giro del browser

Quattordicesimo banco su diciannove.

## Prossimo passo atomico

Un documento per il fondatore sulla giornata di oggi (`docs/`): non i
numeri, ma **le tre duplicazioni trovate** e la differenza fra quelle che
vanno corrette e quella che no — è la cosa che gli serve per capire perché
una giornata di prove ha prodotto tre correzioni di struttura.

Poi, appena finisce il giro: la correzione, la sua prova di **identità**, e
una **regola nuova in `run-stile.mjs`** che renda verificabile questa
classe di difetto invece di lasciarla alla memoria.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
