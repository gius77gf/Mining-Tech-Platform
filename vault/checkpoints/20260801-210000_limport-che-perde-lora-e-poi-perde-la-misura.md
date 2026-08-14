# Checkpoint — l'import che perde l'ora, e poi perde la misura

- **Tipo**: unità (14 prove su due funzioni mai provate) + **un terzo difetto di
  prodotto**, misurato e in attesa del momento giusto per correggerlo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `dd6a120`

## Perché queste due funzioni

`preparaLetture` e `proponiMappa` stanno **a monte** di `unisciLetture`, che
avevo coperto un'ora fa. Lì si decide come si mettono insieme le letture; qui si
decide **quali letture esistono**. È il punto in cui un file del sismografo
diventa la serie storica che finisce nel report per l'ente, e nessuna delle due
era nominata da una prova.

## Le quattro regole che valgono il lavoro

1. **Nessuna riga sparisce in silenzio.** Ogni riga del file torna indietro con
   il suo esito e, se scartata, con il motivo scritto in italiano. Un import
   muto è il modo migliore per perdere dati senza accorgersene: nessun errore,
   nessun avviso, solo una serie storica più corta di quella che si è caricata.
2. **Il numero di riga è quello del FILE**, intestazione compresa. Chi legge
   «riga 5» va a cercarla nel foglio: se contassimo le righe di dati, la riga 5
   dell'anteprima sarebbe la 6 del file e l'utente correggerebbe **la cella
   sbagliata**.
3. **`07/12/2026` è il 7 dicembre.** Fra la lettura italiana e quella americana
   ci sono **cinque mesi**, su una data che va su un documento.
4. **Il 31/02 si scarta, non si «corregge»** in 3 marzo. Una data inventata è
   peggio di una data mancante, perché nessuno la va a controllare.

Più: lo **zero è una misura buona** — è il fondo di una giornata senza volate, e
scartarlo toglierebbe dal report proprio i giorni tranquilli, cioè quelli che
danno ragione all'azienda; «manca» e «scritto male» restano **due motivi
diversi** perché suggeriscono due azioni diverse (compilare / correggere); la
notazione scientifica dello strumento è un numero; e una colonna non fa due
mestieri.

## ⚠️ Il difetto trovato (misurato, non sospettato)

`preparaLetture` legge l'ora così:

```js
const ora = oraHm(cO >= 0 ? oraRaw : dataRaw);
```

Se l'utente **ha scelto** una colonna per l'ora, l'ora viene cercata **solo** lì.
Ma i file veri scrivono spessissimo «12/07/2026 08:00» nella cella della data
**e** hanno una colonna Ora che per quelle righe è vuota. In quel caso l'ora
c'è, sta sotto gli occhi, e viene buttata.

Non finisce con un'etichetta più povera. Misurato:

```
file: 12/07/2026 08:00 · 0,5   e   12/07/2026 14:00 · 0,5
con la colonna Ora scelta e vuota → ore lette: ["",""]
  unisciLetture → aggiunte: 1, duplicati: 1, letture: 1
senza colonna Ora                 → ore lette: ["08:00","14:00"]
  unisciLetture → aggiunte: 2, duplicati: 0, letture: 2
```

Perse l'ora, le due misure hanno la **stessa firma** (data + ora + valore) e la
seconda viene scartata come doppione. **Una misura sparisce dal report che va
all'ente**, e l'interfaccia lo annuncia pure — «1 doppione scartato» — con la
stessa sicurezza con cui direbbe una cosa vera. È la categoria peggiore, la
stessa delle «0 ore» di stamattina.

La correzione è una riga: se la colonna scelta non dà un'ora, si guarda **anche**
la cella della data. Non può peggiorare niente, perché `oraHm` pretende i due
punti e una data non ne ha.

**Non l'ho applicata adesso**: `sentinella-data.js` è importato dalle pagine e il
giro a 19 banchi sta girando (è a `scudo`, 17 banchi su 19). La regola di
stamattina vale anche per le correzioni buone, non solo per i difetti finti: un
modulo cambiato a metà giro rende ambiguo tutto quello che il giro dice.

## Metodo — la conta prima della sonda

Dopo la controprova che stamattina **non era partita**, ogni difetto rimesso
adesso stampa **quanti caratteri ha cambiato nella copia**, e lo script si
ferma se la copia risulta identica all'originale:

```
ok  righe scartate buttate via         (+18 car.) → la prova cadrebbe: righe: 1
ok  riga contata fra i dati            (-30 car.) → la prova cadrebbe: riga: 1
ok  data letta all'americana           (0 car.)   → la prova cadrebbe: 2026-07-12
ok  data impossibile «corretta»        (-72 car.) → la prova cadrebbe: 2026-02-31
ok  lo zero preso per un mancante      (-17 car.) → la prova cadrebbe: valore non numerico
ok  un motivo solo per i due casi      (-31 car.) → la prova cadrebbe: valore non valido
ok  colonna proposta due volte         (-11 car.) → la prova cadrebbe: colOra = colData = 0
7 difetti visti, 0 non visti
```

Il terzo cambia **zero caratteri** — è uno scambio di due argomenti — ed è
proprio il caso in cui la conta da sola avrebbe mentito: per quello il controllo
è doppio (conta **e** confronto con l'originale).

## Stato

- **541** KPI (433 all'inizio della giornata) → **800** prove `node`, verdi
- **108 prove nuove** in giornata, **2 difetti di prodotto** corretti, **1**
  misurato e in coda
- giro a 19 banchi: 17 su 19, moduli e pagine non toccati

## Prossimo passo atomico

Aspettare la fine del giro (mancano due banchi) e poi, in una sola unità, le
**due correzioni già isolate e verificate**, ognuna con la sua prova che nasce
rossa:

1. `preparaLetture` — l'ora cercata anche nella cella della data quando la
   colonna scelta è vuota;
2. `apps/flotta/index.html` ~1397/1401 — lo zero di comodo che scrive «X ha 0
   ore: il tagliando è proposto a 500» su un mezzo di cui non sappiamo le ore.

Nel frattempo, sempre e solo su `run-kpi.mjs`: le funzioni di Sentinella ancora
scoperte dopo queste due.

## Bloccanti

- Nessuno.
