# Checkpoint — 2026-08-07 20:05:55 UTC

## Tipo
unit-complete (l'elenco delle volate del core: la quarta copia debole)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`f108ef0` — *L'elenco delle volate era la quarta copia debole: «0 mc» dove
nessuno aveva misurato*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 195 | **`volRiga` nel core** (`f108ef0`) | banchi **147 → 149**, 13 prove nuove, controprova **7 KO** |

## ⛔ Il difetto, e non era quello che il checkpoint precedente prevedeva
Il passo atomico diceva «l'elenco delle volate è una terza copia debole» e
sospettava la **data**. Aperto il file, `fmt()` delega già a `dataIt`: quella
copia era stata corretta. La copia debole vera era **un'altra cosa nella stessa
riga**, e della famiglia della settimana:

    ${v.tot_fori||0} fori${v.tot_kg>0?' · '+v.tot_kg+' kg':''} · ${v.tot_mc||0} mc

- **«0 mc»** dove nessuno ha scritto le profondità: `tot_mc = tot_metri × B × S`
  e `tot_metri` è la somma delle profondità dei fori, quindi senza quelle il
  prodotto è **zero**. Su un progetto di volata «0 mc» si legge «non rende
  niente», non «non l'ha misurato nessuno»;
- i **chili che spariscono**: `v.tot_kg>0` fa cadere il pezzo intero, quindi una
  volata mai caricata e una caricata a zero si scrivono **identiche** — il modo
  silenzioso, quello che non lascia niente da leggere.

`misureVolataProgetto` sta in `shared/` ed è **importata in `index.html`**:
documento, scheda e riquadro la chiamavano già. L'elenco era il quarto sito, ed
è quello che il fondatore apre per primo su quella schermata. La dimostrazione
lo mostrava **da mesi** («10 fori · 787.5 mc», terza volata, tutti i fori con
`kg:''`) e nessuna prova ci guardava.

## ⛔ E la misura ha deciso il lavoro, contro la soluzione ovvia
La cosa ovvia era riusare `volKg`/`volMc`. **Misurato: non ci stanno.** `.ssub`
è `white-space:nowrap` + ellissi e ha **252px** a 390, **234** a 360, **194** a
320; con le parole intere la volata caricata a metà chiede **295px**, tagliata a
**ogni** larghezza. Quindi la decisione resta una sola e cambia il **vestito**:
`volRiga`, la stessa forma che `rappRiga` ha già per i rapportini. «almeno»
invece di «(parziale)» non è una scorciatoia — è la parola che il **PDF del
fochino usa già** (`fm.parziale?'almeno ':''`).

## ⛔ Un quinto sito trovato dalla misura, e tagliato da prima
Il riquadro «ultime volate» della dashboard (riga 2322) usava proprio la forma
a parole intere dentro una `.ssub`: era **tagliato da prima di questo lavoro**,
e non se n'era accorto nessuno. Passa da `volRiga` e adesso ci sta.

## ⛔ Il limite è dichiarato, non nascosto
A 320px **una** combinazione esce lo stesso: «4 fori · almeno 56 kg · mc non
calcolabili» chiede **197px su 194**. Non si accorcia oltre senza ridurre le
parole a sigle. È un peggioramento **in un punto** a fronte di una bugia tolta —
la forma di prima a 320 ci stava sempre, e diceva il falso. Il banco la
**stampa a ogni giro** invece di saltarla.

## ⚠️ E tre volte ha sbagliato il righello, non il prodotto
1. la prima sonda diceva «ci sta» per **ogni** forma, sempre `252/252`: prima
   di crederle le ho messo dentro una frase lunga apposta — `603/252 TAGLIATA`,
   quindi sapeva fallire;
2. le prime frasi candidate erano misurate con `1.323` e `787,5`, cioè con
   separatori che **il core non scrive**: misuravano più largo del vero, e le
   uscite vere sono state rimisurate;
3. il primo giro del banco ha dato un KO che era **il mio cercatore**: `«senza
   profondita»` è sottostringa di `«meta carica senza profondita»` e pescava la
   riga sbagliata. Rinominato il caso.

## ⛔ E il caso difeso non c'era nella prova
Al primo giro il banco diceva «a 320px **0 righe escono**» — ma la combinazione
che esce (mezza carica **E** senza profondità) fra i miei sei casi **non
c'era**. È la quinta causa di «non distingue» di CLAUDE.md, e senza il settimo
caso il banco avrebbe dichiarato pulito un limite che esiste.

## Stato delle prove
Prove **2.298** (`run-kpi` **1883**), copertura **702/702**, banchi **149**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ **Il giro completo**, partito alle 19:08 su `2ab9535`
(`scratchpad/io-core/giro-5.txt`), a **73 sezioni**.
⚠️ **Gira su un commit ormai vecchio di sei**: non copre incassi, clienti,
azioni correttive, i nomi dei file 3D né questa unità. Va letto sapendolo.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** quando finisce: leggere **PRIMA** le righe «non ho
   guardato», poi i KO, distinguendo le controprove (l'intestazione lo
   dichiara). Poi decidere se rilanciarlo sul commit corrente.
2. ⏱️ **Coda nuova, misurata oggi e dichiarata**: il core scrive i decimali col
   **punto** — «787.5 mc», «1240.3 mc» — accanto a date italiane «30/07/2026».
   `numIt` in `shared/` è il **lettore**; un **scrittore** non esiste né in
   `shared/` né nel core. Prima di aprire il cantiere va contato **quanti punti
   decimali escono davvero a schermo**: è un'unità sua, e va fatta in un posto
   solo (`shared/`), non riscritta nel core.
3. ⛔ **Il tema che scala invece di fissare** — tre app hanno dovuto riscriversi
   la stessa scala della barra sotto `outdoor-mode`. Cantiere su `shared/`, si
   serializza.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**,
   con l'`appId` come argomento.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
