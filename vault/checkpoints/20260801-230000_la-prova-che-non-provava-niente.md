# Checkpoint — la prova che non provava niente, e la controprova che l'ha detto

- **Tipo**: unità (15 prove sul ponte Sentinella → Scudo) + **una prova
  corretta**, scoperta dalla sua stessa controprova
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `beadf52`

## L'unità

Il ponte Sentinella → Scudo esiste per rispondere alla domanda che l'ente fa
dopo un superamento: **«e voi cosa avete fatto?»**. Quindici prove su
`ultimaLetturaOltre`, `superamentiAperti`, `azioniDiOrigine`, `statoPonte`,
`bozzaAzioneSuperamento`.

Le regole che valgono il lavoro:

- **Senza soglia non esiste superamento.** Non se ne inventa una: un punto senza
  soglia impostata non è né dentro né fuori, e dichiararlo fuori riempirebbe il
  quadro di rossi che nessuno può chiudere.
- **Un punto senza storico è comunque un superamento**, con la voce
  «valore-corrente» al posto di una data. Farlo sparire perché non c'è una data
  da citare toglierebbe dall'elenco un superamento vero.
- **«Nessuna azione» è ROSSO, non grigio.** La casella vuota è esattamente la
  risposta che l'ente non vuole sentire, e un grigio la farebbe sembrare
  un'informazione mancante invece di un problema.
- **Le azioni si legano al PRECISO superamento**, non al punto: quella chiusa a
  marzo non deve far sembrare gestito quello di luglio.
- **La bozza porta con sé da dove viene** (app, tipo, punto, voce, data) e la
  nota cita valore misurato, soglia applicata e data: in Scudo resterebbe
  altrimenti un compito senza storia.

Controprova su una copia: **7 difetti rimessi, 7 visti, 0 non visti.**

## ⚠️ La prova che non provava niente

La prima delle sette non cadeva. La prova si chiama *«l'ultima lettura oltre è
la più RECENTE, non la più alta»*, e il difetto rimesso era proprio *ordinare
per valore invece che per data*. Eppure: **non distingue**.

La ragione non era nel difetto: era nei **dati della prova**. Erano scritti così

```
01/07 → 10     03/07 → 20     05/07 → 3      soglia 10
```

e lì «la più recente fra quelle oltre» e «la più alta» sono **la stessa
lettura** — il 03/07. Qualunque dei due criteri dava la stessa risposta: la
prova passava per un motivo che non era quello scritto nel suo nome.

Corretta la **prova**, non la sonda:

```
01/07 → 50     03/07 → 12     05/07 → 3      soglia 10
```

Ora il picco è del 1° e l'ultimo superamento è del 3, le due risposte sono
**diverse**, e il difetto si vede subito (`data: 2026-07-01 (valore 50)`).

È una variante nuova di una regola già scritta — *una prova che non sa fallire
non dimostra niente* — e la variante è: **una prova può sapere fallire in
generale e non saper fallire sul punto che dichiara**, se i dati che le si danno
fanno coincidere la risposta giusta con quella sbagliata. Quello che l'ha
scoperta non è stata la lettura del codice: è stata la controprova, che ha
risposto «non distingue» invece di un rassicurante verde.

## Stato

- **575** KPI (433 all'inizio della giornata) → **834** prove `node`, verdi in UTC
- **142 prove nuove** in giornata, **2 difetti di prodotto** corretti, **2** in
  coda, **1 prova vacua** corretta
- giro a 19 banchi: agli ultimi banchi (contrasto per superficie)

## Prossimo passo atomico

Continuare sulle funzioni scoperte di Sentinella finché il giro non finisce —
il gruppo del **referto del sismografo** (`refertiDaVolate`, `ppvDiVolata`,
`riferimentoReferto`, `motivoReferto`), che è il documento che esce dall'app e
va all'ente.

Appena il giro finisce, nell'ordine: `isoLocale`/`oggiISO` in `shared/` con il
test di identità, i tre punti di categoria A del giorno locale, l'ora persa in
`preparaLetture`, lo zero di comodo di Flotta.

## Bloccanti

- Nessuno.
