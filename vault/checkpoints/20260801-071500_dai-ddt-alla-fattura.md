# Checkpoint — la numerazione, e dai DDT alla fattura

- **Tipo**: unità (14 prove su tre funzioni mai provate, tutte su soldi)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `b806b97` (numerazione), `2ea8d4c` (DDT → fattura)

## Perché queste

Sono il **flusso vero della cava**: tanti viaggi documentati da DDT durante il
mese, una fattura riepilogativa alla fine. Nessuna delle tre funzioni era
nominata da una prova, e tutte e tre decidono cose che poi stanno su un
documento fiscale.

## Le tre regole che valgono il lavoro

**1. I buchi nella numerazione non si riempiono.** Se esistono la 001 e la 005,
la prossima è la **006**. La 002-004 possono essere state annullate: riusarle
creerebbe due documenti con lo stesso numero, cioè l'irregolarità che si voleva
evitare. Ed è un errore che non si vede subito e poi non si può più sistemare
se non con una nota di credito.

**2. Un DDT già fatturato non torna in una seconda fattura.** Tutto il lavoro lo
fa una riga sola — `filter(p => !p.fatturaId)` — e senza quella il cliente
pagherebbe **due volte lo stesso viaggio**.

**3. Prezzi diversi dello stesso prodotto restano righe diverse.** Fonderle
darebbe un prezzo medio che non è quello di **nessun** DDT, su un documento in
cui ogni riga deve essere verificabile. Stessa cosa per unità (tonnellate e
metri cubi non si sommano) e aliquote, che al registro IVA fanno storia a sé.

## Una cosa imparata sul riconoscere i numeri

`prossimoNumero` legge **anche** la forma «001/2026», non solo «2026/001». Non
è una gentilezza: chi arriva da un altro gestionale scrive spesso numero/anno, e
se non la riconoscessimo la proposta ripartirebbe da 001 — cioè proprio il
doppione. È il genere di dettaglio che si vede solo pensando a **da dove
arrivano i dati**, non guardando la funzione.

## Metodo

Tutte le controprove su una **copia** del modulo (`_tmp-cp.js`, cancellata
dopo), perché gira il giro dei banchi e le pagine importano l'originale.
Verificato che ogni difetto rimesso faccia cadere le prove giuste.

## Stato

- **515** KPI (433 all'inizio della giornata) → **774** prove `node`, verdi
- **82 prove nuove** in giornata, **2 difetti di prodotto** corretti
- giro a 19 banchi: in corso (primo banco)

## Prossimo passo atomico

Continuare sulle funzioni scoperte di Sentinella, che sono le più numerose (50
su 75): `preparaLetture` e `unisciLetture` — l'import delle letture dal
sismografo, dove un doppione o una lettura persa cambia il report che va
all'ente. Poi, a giro finito, la correzione dello zero di comodo rimasto in
`apps/flotta/index.html` (riga ~1397/1401), già isolata e verificata come reale.

## Bloccanti

- Nessuno.
