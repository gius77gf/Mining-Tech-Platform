# Checkpoint — lo scavo consuma il concesso, la ripresa no

- **Tipo**: unità (13 prove su Terra)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `a1481d6`

## L'unità

Terra era la meno coperta in proporzione (23 funzioni su 39). La distinzione che
regge tutta l'app — e che sta anche nei moduli degli enti — è una sola:

**Il materiale tolto dal fronte consuma il volume autorizzato; quello ripreso da
un cumulo era già stato estratto e si conta a parte.**

Contarli insieme farebbe risultare esaurita una concessione che non lo è — o,
peggio, **nasconderebbe un esaurimento vero** sotto un numero gonfiato dai
cumuli. La controprova lo mostra in un numero: coi cumuli dentro, luglio passa
da 15.000 a **65.000 m³**.

E il verso opposto, altrettanto importante: un rilievo **senza** il campo
provenienza vale **scavo**. Dare per «cumulo» quello che non è dichiarato farebbe
sparire volume vero dal conto della concessione.

## L'altra che vale il lavoro

Fra due voli del drone, lo **scavato** è la **somma dei rilievi in mezzo**, non
la differenza fra i due volumi — quella è quanto è **cambiato il fronte**, ed è
un'altra cosa. Rimessa la differenza, il numero che si dichiara all'ente passa
da 20.000 a **7.000 m³**.

Più: due fronti diversi non si confrontano (sarebbe una differenza fra due posti
della cava che sembra un avanzamento); il **giorno** della scadenza non è ancora
«scaduta», c'è la giornata per farla; e i tipi di scadenza preimpostati
dichiarano **sempre** di essere da verificare, perché periodicità e termini
stanno nell'atto e nella legge regionale e Terra non li indovina.

## ⚠️ Una nota di metodo, dalla sonda che si è fermata

La controprova sulla provenienza **non è partita**: l'ancora
`export function provenienzaDi` non esiste in `terra-data.js`. E non è un errore
di battitura — quella regola **non sta nell'app**: vive in `shared/dw-ponti.js`,
e Terra la **ri-esporta**. È esattamente la regola di `CLAUDE.md` («una regola
che serve a due app vive in `shared/`»), applicata a tre app.

La controprova ha dovuto iniettare nel **ponte** e dirottare l'import di una
copia di Terra. Il fatto che la sonda si sia **fermata** invece di rispondere
«pulito» è quello che ha fatto vedere dove sta davvero la regola: la difesa
scritta stamattina continua a lavorare, e stavolta ha insegnato qualcosa
sull'architettura invece che su un difetto.

Controprova finale: **10 difetti rimessi, 10 visti, 0 non visti.**

## Stato

- **760** KPI (433 all'inizio della giornata) → **1043** prove `node`, verdi in
  UTC **e** in ora italiana
- **327 prove nuove** in giornata, **8 difetti di prodotto** trovati e corretti,
  **1 prova invecchiata** corretta, **3 prove rinforzate**
- Terra: da **23/39** a **36/39** funzioni coperte

## Prossimo passo atomico

Resta **Flotta** (29/71), l'ultima app sotto la metà. I gruppi scoperti più
sostanziosi sono le **scadenze dei mezzi** (`statoScadenzaMezzo`,
`scadenzeOrdinate`, `contaScadenzeMezzi`, `validaScadenzaMezzo`) e il
**magazzino ricambi**. Le scadenze dei mezzi sono revisioni, assicurazioni e
collaudi: un mezzo con la revisione scaduta che gira in cava è un problema
serio, ed è la stessa famiglia dei documenti dei lavoratori in Scudo.

## Bloccanti

- Nessuno.
