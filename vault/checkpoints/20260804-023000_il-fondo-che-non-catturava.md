# Checkpoint — il fondo non catturava il caso che prometteva

**Commit:** *(questo)*
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa c'era scritto, e che cosa faceva

L'intestazione di `copertura-funzioni.mjs` diceva, testuale:

> «La SOGLIA non è un traguardo: è un fondo. **Se una app ci scende sotto, vuol
> dire che sono state aggiunte funzioni senza prove** — e allora questo
> controllo fallisce e lo dice, invece di lasciarlo scoprire fra un mese.»

Misurato: aggiungendo a Terra un `export function funzioneMaiProvata`, la riga
diventa **`40/41  98%`** e il controllo esce **0** — «9 sopra il fondo, 0
sotto».

Il motivo è aritmetico e vale per **qualunque** soglia su un valore monotòno: il
fondo sta sul numero di funzioni **coperte**, e aggiungere codice non provato non
lo fa scendere. Quel fondo cattura le **prove tolte**, non il **codice aggiunto
senza prove** — cioè esattamente il caso che la riga prometteva, e nella
direzione che rassicura.

È la stessa famiglia già raccolta tre volte in `CLAUDE.md` («il controllo che non
guarda dove crede»), con una variante nuova: qui il controllo guardava il posto
giusto, ma **la grandezza sbagliata**.

## La correzione

Due regole, e la prima è quella vera:

1. **nessuna funzione scoperta.** Tutte e sei le app e tutti e tre i moduli
   condivisi sono al **100%**: il fondo era una scala mentre si saliva, e in
   cima la regola giusta è «non se ne lascia indietro nessuna». Chi aggiunge una
   funzione aggiunge la prova, o la dichiara in `FUORI` **con la ragione
   scritta**;
2. il **fondo** resta come seconda guardia, per il caso in cui il 100% non sia
   raggiungibile e vada abbassato di proposito: almeno il numero non scende di
   nascosto.

## E il codice condiviso, che nessuno contava

Il censimento si chiama «quante funzioni delle **app** sono provate» e guardava
solo `apps/<nome>/<nome>-data.js`. Ma la regola vincolante dice che ciò che
serve a due app vive in `shared/` — quindi il codice **più delicato di tutti**
restava fuori dal conto, e una funzione nuova aggiunta lì non avrebbe fatto
scendere nessun numero.

**Misurato prima di allarmarsi**, che è l'altra regola: la copertura vera lì è
**46 su 46** — `dw-ponti.js` 18, `dw-shell.js` 23, `pointcloud.js` 5. Non c'era
un buco nel **prodotto**; c'era un buco nel **controllo**, che rispondeva «tutto
a posto» su un perimetro più stretto del suo nome. Adesso il perimetro è
dichiarato, con il suo fondo e la ragione per cui ogni modulo ci sta.

Sei funzioni restano fuori **con la ragione scritta**: `montaGuardiaInteri`,
`interoScritto`, `mountExit` e `timbroLocale` toccano il DOM o l'orologio e
vivono nei banchi del browser; `ESITI_TURNO` e `MAXPTS` sono costanti.

## Controprova

Tre difetti, ognuno su una copia, e il censimento deve **cadere col motivo
giusto** e uscire **1**:

| difetto | riga caduta |
|---|---|
| funzione nuova senza prova in Terra | `✗ terra 40/41 98% 1 SENZA PROVA: funzioneMaiProvata` |
| funzione nuova senza prova in `shared/dw-ponti.js` | `✗ dw-ponti 18/19 1 SENZA PROVA: regolaCondivisaMaiProvata` |
| fondo alzato sopra la copertura vera | `✗ terra 40/40 100% SOTTO IL FONDO DI 99` |

Tre su tre. E il terzo serve a dimostrare che la **seconda** guardia è ancora
viva: togliendo una regola si può rompere l'altra senza accorgersene.

## Numeri

- copertura app **424 / 424**, copertura condivisi **46 / 46**
- soggetti censiti: **6 app + 3 moduli condivisi** = 9
- `CLAUDE.md`: nuova nota vincolante «un fondo cattura le prove tolte, non il
  codice aggiunto senza prove»

## In corso

Il **giro a 25 banchi** del browser è ancora vivo (39 minuti, sesto banco).
Finché gira: `docs/`, `vault/` e le suite `node`; nessuna modifica a moduli e
pagine.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
2. **Terra/Genesi — unità 1 e 2 della tracciabilità del volume**;
3. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
