# Checkpoint — 2026-08-07 02:00:01 UTC

## Tipo
unit-complete (quattro unità dopo il checkpoint delle 01:40)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`9d45309` — *Campo lascia la sua copia di `.dw-btn.mini`: la coda dichiarata,
chiusa appena il file si è liberato*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 100 | **il limite del rosso, scritto** (`4e13874`) | `<b class="bad">` veri e visibili nella dimostrazione: **zero** |
| 101 | **CLAUDE.md · il campione scappato** (`9bc3e66`) | 1 famiglia nuova, misurata su Genesi |
| 102 | **i riferimenti della roadmap** (`6d6727e`) | fermi al 03/08: 2.092 → **2.193**, 84 → **120** |
| 103 | **Campo lascia la copia di `.mini`** (`9d45309`) | rimisurato: 11px, `min-height` 44px |

## ⛔ La chiusura onesta di una mia unità: *il rosso che non si vede*
Avevo misurato il colore di `b.bad` su un elemento **iniettato** e dichiarato la
correzione fatta. Poi l'ho cercato **vero**, girando tutte le sezioni di Flotta:
`<b class="bad">` veri e visibili nella dimostrazione **ZERO**. I due casi che
li producono — un pieno senza la sua spesa, un consumo parziale — nei dati
d'esempio non capitano mai.
La regola è giusta e serve a un cliente con dati veri, ma **nessun banco può
vederla oggi**, e dirlo cambia quanto vale quel verde.
⚠️ E indica una cosa da fare: è la lezione di `run-demo.mjs` — un campo assente
**non è un refuso, è uno stato che il prodotto sa raccontare**. Un pieno senza
spesa fra i dati d'esempio renderebbe **visibile la funzione** e **misurabile la
regola** in un colpo solo. Non fatto adesso: i dati d'esempio li leggono decine
di banchi e quattro cantieri stanno girando. È un'unità sua, da fare ad albero
fermo.

## ⛔ La famiglia nuova in CLAUDE.md: *un file di scambio porta il nominale, non il campione*
Dal difetto di Genesi. Il pannello diceva «42 ms» e il file con cui una volata
si **riapre** scriveva `42,332516881726825`: lo **scatter d'innesco** che la
simulazione somma di proposito, col nominale conservato lì accanto. Il danno sta
nel ritorno — l'importatore ricava il passo dalla mediana delle differenze, e
col rumore riportava a **25 ms** una volata progettata a **42**.
Il segno da riconoscere, che vale ovunque: **un numero con quindici decimali
dove lo schermo ne mostra zero**. E il modo di prenderlo è **rifare il giro**:
nessuna prova che guardi solo il file lo vede, perché il file è coerente con sé.

## Verifica trasversale sul committato
`uno-solo` su una copia di `HEAD`: **67 schermate, 174.567 caratteri**, tutte e
quattordici le superfici, **0 KO** — il filo del singolare regge dopo tutti i
commit di stanotte. `sintassi-pagine`: 15/15 anche sul disco coi cantieri dentro.

## Stato delle prove
Prove `node` **2.193**, copertura **662/662**, banchi **120**. Giro `node` 21
comandi, 0 caduti sulla copia di ciò che si committa, a ogni commit.

## Che cosa sta girando adesso
**Quattro cantieri**: **Scudo** (banco con un dato solo + `.fld` e `.acc`), **il
core** (le modali: 11 su 68), **Conti** (con un dato solo, metodo `rotte`),
**Terra + Sentinella** (idem, e Sentinella produce il foglio per l'ARPA).
⛔ I loro file sul disco **non vanno committati**: sono lavoro a metà. Si
raccolgono uno per uno quando consegnano.

## Prossimo passo atomico
1. **Raccogliere i quattro cantieri**, uno per uno: indice, verifica sulla
   **copia di ciò che si committa**, controprove **rilanciate da me**, contatori
   dei documenti **rimisurati** (non presi dal riepilogo del cantiere: fra la
   sua misura e il commit gli altri lo muovono).
2. **Ad albero fermo**: far atterrare la correzione del motore dei grafici
   **insieme** al suo banco registrato (manca la misura a tappeto e il caso
   «grafico in una sezione nascosta», dove `.dwg-plot` è largo zero e il ripiego
   dà un numero plausibile e sbagliato).
3. **Ad albero fermo**: il pieno senza spesa nei dati d'esempio di Flotta.
4. **Il censimento delle classi orfane nei test** (15 eccezioni da dichiarare).
5. **I 4 CSV di Scudo** senza marchio della dimostrazione.
6. **Le 19 decisioni scadono oggi, venerdì 07/08.**

## Code aperte, dichiarate
- `.dw-btn.mini` resta duplicata **solo** nel `<style>` di Scudo (cantiere dentro).
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D — decisione, non copia debole.
- Il **minimo di visibilità** che appiattisce i valori piccoli, `#ppv-scelta` di
  Sentinella, `.meta.pesa` di Conti: misurati, dichiarati.

## Blocchi
Nessuno.
