# Checkpoint — 2026-08-09T12:00:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`9098a85`

## Task completato

**La citazione `file:riga` nei documenti del delta è morta al 96%: 87 scadute
su 91**, e adesso quel numero è misurato a ogni giro invece di essere ignorato.

| documento | scadute / verificabili |
|---|---|
| campo | 8 / 8 |
| conti | **46 / 47** |
| flotta | 17 / 19 |
| scudo | 1 / 1 |
| sentinella | 15 / 16 |
| terra | 0 / 0 |

## Le tre cose imparate

1. ⛔ **IL VERDETTO REGGE, IL NOME REGGE, È IL NUMERO DI RIGA CHE MUORE.**
   Verificati uno per uno i **19 nomi** citati dalle tre righe di Conti e i
   **4** di Terra: esistono tutti. Ma `STATI_PREVENTIVO` era citato a 3129 ed è
   a **3668**, `validaScaglioni` a 1507 ed è a **1839**, `importoBancario` a
   2662 ed è a **3197**. Un file che cresce di centinaia di righe al giorno
   sposta ogni citazione; nessuno può tenerle aggiornate, e chi riapre la riga
   legge «la prova è falsa» e butta via anche il verdetto.
2. ⛔ **LA DECISIONE, PRESA COL NUMERO: UNA PROVA CITA IL NOME, NON LA RIGA.**
   Il nome si verifica con un `grep` in tre secondi ed è stabile; la riga costa
   manutenzione a ogni commit e la ripaga con niente. È lo stesso principio del
   «derivare invece di scrivere», applicato alla prosa.
   ⚠️ **E NON si riscrivono tutte adesso**: 91 modifiche di prosa in sei
   documenti sono più rischio che valore a fine giornata. Il conto sta in
   `documenti-invecchiati.mjs` **per essere visto scendere**, e ogni riga che
   qualcuno tocca perde i suoi numeri — che è come questa casa tratta gli
   arretrati.
3. ⚠️ **IL CONTROLLO NON FALLISCE, ED È UNA SCELTA.** Farlo fallire vorrebbe
   dire fermare il lavoro finché 87 righe di prosa non sono riscritte. È una
   **misura**, come l'arretrato dei commit — e la differenza fra una misura e
   una regola va decisa guardando che cosa succede il giorno in cui il numero è
   alto.
   ⚠️ E la prima stesura è morta con `EISDIR`: `existsSync` risponde vero anche
   per una **cartella**, e un nome di file corto può combaciare con una
   directory. Si chiede se è un file.

## Verifiche
- `documenti-invecchiati` **15 passati, 0 falliti**, con la nuova riga di misura
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`; oltre 3.800 righe.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: **le 10 righe «SCADUTA» rimaste** (conti 3, scudo 2,
sentinella 3, terra 2) col metodo di Campo — ogni nome cercato col comando, e
i numeri di riga tolti dalle righe che si toccano, così l'87 scende.
⚠️ Conti da sola vale **46** delle 87 citazioni scadute: è lì che il conto
scende più in fretta.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
