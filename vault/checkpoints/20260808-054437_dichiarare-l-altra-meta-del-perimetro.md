# Checkpoint — 2026-08-08T05:44:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`23dcd43` — *copertura-funzioni: dichiarare anche l'ALTRA metà del perimetro*

## Che cosa è stato completato

Continuando il censimento degli **elenchi scritti a mano** (l'unità prima ne ha
trovato uno che nessuno confrontava col disco), ho guardato le quattro suite
che non leggono la cartella: `copertura-funzioni`, `nomi-doppi`, `sonda-vuoto`,
`classi-orfane`.

`copertura-funzioni` **dichiarava già** che Genesi resta fuori, e lo dice bene.
Ma restavano fuori anche **cinque moduli condivisi**, e quello non lo diceva
nessuno: il numero **«703 su 703, tutte al 100%»** — quello che finisce nei
documenti del fondatore — si leggeva **più largo di quello che è**.

La ragione è **tecnica e legittima**: il censimento legge gli `export` ESM, e
quei cinque non ne hanno — espongono un oggetto globale (`dwGrafici`,
`dwFluido`), attaccano funzioni a `window` (la struttura condivisa) o sono una
**classe** (l'SDK). **Non sono scoperti**: sono provati altrove, e adesso è
scritto dove — `dwGrafici.geometria` in `run-kpi`, i banchi `*-disegni`, la
regola 17 di `run-stile`, le 19 di `run-sdk` sotto l'emulatore, i banchi del
contrasto nei tre temi.

> **Una ragione tecnica non dichiarata è indistinguibile da una
> dimenticanza** — ed è esattamente per questo che un'ora fa tre moduli erano
> fuori da ogni regola di `run-stile` senza che nessuno lo sapesse.

Nessun numero cambia: cambia quello che il controllo **dice di aver guardato**.

## ⚠️ E due risultati negativi, che vanno scritti come i positivi

Cercando il difetto ho misurato due cose che **non** erano difetti, e dirlo
serve a non farle ricercare:
- **`genesi-formato.js` è già nel censimento** (riga 252, fondo 8), e tutte e
  otto le sue funzioni sono citate da `run-kpi`. Sembrava il candidato più
  probabile e non lo era.
- **`run-kpi` e `import-esistenti` leggono il disco**; solo quattro suite
  hanno elenchi a mano, e di quelle `copertura-funzioni` era l'unica il cui
  numero esce nei documenti.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.
- Il riepilogo del censimento adesso stampa il perimetro vero: *«6 app + 5
  moduli con export ESM; gli altri 5 non sono scoperti, sono contati da
  un'altra parte»*, con la riga di ciascuno.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. **3.649 righe**, ed è entrato nelle
**controprove** finali (l'ultima intestazione è *«unità · controprova»*, che si
dichiara da sé: lì il rosso è quello **voluto**).

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt`**, che è vicino alla fine (in coda scrive
`USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** — e stavolta il registro le
   dichiara da sé («⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO»), che
   è la correzione fatta il 07/08 proprio perché due volte in due ore avevo
   aperto cantieri su difetti voluti;
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo (tocca le pagine):
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola.

## Blocchi
Nessuno.
