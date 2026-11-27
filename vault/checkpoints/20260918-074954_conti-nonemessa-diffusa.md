# Checkpoint — 2026-09-18T07:49:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4aee34a0 — fix(conti): la guardia sulle fatture non emesse arriva ovunque

## Cosa è stato completato
Dal sesto giro di deep-pass su Conti (agente a8e5ab52b4f891993), tre
difetti veri nella stessa famiglia del quinto giro (guardia
`statoSdi(f, oggi).nonEmessa`, aggiunta il 18/09 a
`kpiFrom`/`agingIncassi`/`fattureOltre90`/`esposizioneClienti`, ma non
a tutti i consumatori):

1. `incassoAtteso` (conti-data.js): nessuna guardia. Una fattura
   scartata dallo SdI con scadenza entro l'orizzonte compariva nel KPI
   "Incasso atteso (prossimi 30 gg)" come cassa in arrivo.
2. `incassoPerMese` (conti-data.js): nessuna guardia. La sezione
   "Previsione incassi" del Report diceva "escluse N già scadute: le
   trovi nell'aging qui sopra" — ma l'aging (già guardato) le esclude
   apposta: l'utente che seguiva l'indicazione non le trovava mai.
3. **Il più grave**: `apps/conti/index.html` teneva una COPIA DEBOLE
   del calcolo dell'aging per il KPI "Scaduto" del Quadro (`const
   aperte = FAT.filter(f => !f.incassata)`, mai passata da `statoSdi`)
   — propagata a `scadute`/`scadutoTot` e ai badge di conteggio che
   riusano le stesse variabili — e per il filtro "Insolute" delle
   Fatture (`fatMatch`). Due pannelli della stessa app, un click di
   distanza, dichiaravano due totali diversi per lo stesso concetto
   ("credito scaduto da sollecitare"): Quadro € 36k/4 fatture contro
   Report/Aging € 30.150/3. La fattura scartata compariva nell'elenco
   "Insolute" con badge "SOLLECITO" apparentemente attivo (l'azione
   restava comunque bloccata a valle da `sollecitabile()`, verificato
   — non era un difetto dell'azione, solo del numero e dell'elenco
   mostrati).

## Verifica
- Tutte e tre corrette aggiungendo la stessa guardia `statoSdi(...).nonEmessa`
  già in uso nelle quattro funzioni sorelle — nessuna nuova convenzione,
  nessun ricalcolo diverso.
- Verificato dal vivo con uno script Playwright ad-hoc (server statico +
  iniezione via risposta HTTP): KPI "Scaduto" ora € 30k/3 fatture
  (prima 36k/4); filtro "Insolute" ora 3 fatture, non più la scartata.
  **Nota di metodo**: la prima verifica dava un falso negativo per un
  mio errore di selettore Playwright (`[data-filtro="insolute"]` non è
  unico — esiste sia sul KPI del Quadro sia sul bottone del filtro — e
  il click ambiguo falliva silenziosamente dentro un `.catch(()=>{})`).
  Corretto restringendo a `#fat-filtri [data-filtro="insolute"]`.
- Nuovo test in `run-kpi.mjs` (dopo il test del quinto giro): fixture
  emessa+scartata sullo stesso cliente per `incassoAtteso`/
  `incassoPerMese`, più un controllo statico sul sorgente di
  `index.html` per le due guardie di pagina (stesso pattern già in uso
  nel test del quinto giro). KPI: 3134 → **3135**.
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4129** (documenti corretti da 4128). 9-suite sum:
  **3.629**. Banchi invariati (345, nessun nuovo banco per questa
  unità). `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, confermato
  PRIMA del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Conti chiusa. **Terza ondata
(Terra + Conti) completa.**

## Nuovi report arrivati, da chiudere (entrambi verificati dal vivo,
## entrambi con fix suggerito NON applicato dall'agente — compito di
## sola verifica)

1. **Scudo, quinto giro di deep-pass** (agente aaab8ded50f563b28):
   `cartellaLavoratore` (scudo-data.js:4598-4694) non segnala un DPI
   previsto dalla mansione ma mai consegnato — controlla solo il caso
   "zero DPI consegnati in totale" (righe 4639-4640), non il caso "un
   tipo specifico manca fra altri consegnati". Il Quadro (`allarmiDpi`)
   e il "Fascicolo per l'ispettore" (`fascicoloIspezione`, righe
   4841-4849) già incrociano correttamente mansione.dpi con le
   consegne — solo `cartellaLavoratore`/`fogliaCartella` (il documento
   stampato PER L'ISPETTORE) no. Verificato dal vivo: Luca Bianchi
   (d2, "Escavatorista/palista", richiede otoprotettori mai
   consegnati) → `cartellaLavoratore` dice `completa: true`, il foglio
   stampato dice "Tutte le sezioni della cartella contengono dati
   registrati" senza menzionare l'otoprotettori mancante.
2. **Core, deep-pass mirato** (agente af68760cefe52ac3e): `esitoSparo()`
   in `shared/deepwork-id-client/dw-shell.js:1966-1981` ha una guardia
   di coerenza ASIMMETRICA — blocca "colpi mancati > fori caricati" ma
   non il caso simmetrico "colpi esplosi > fori caricati" quando
   `mancati` è `null` (il campo si compila per primo, quindi è il caso
   normale a metà compilazione). Il commento del codice dichiara
   l'intento di bloccare "l'unico caso impossibile" in modo simmetrico,
   ma l'implementazione copre solo mezzo. Verificato dal vivo: 10
   colpi esplosi dichiarati su 2 fori caricati → nessun blocco, nessun
   avviso, il rapportino si salva e il numero impossibile finisce nel
   PDF stampato (collegato al registro esplosivi/deposito).

3. **Flotta, quarto giro di deep-pass** (agente a9a71df5a05374fef):
   il libretto macchina esportato in CSV (`csvLibretto`, via
   `fascicoloMezzo` in flotta-data.js) non porta la sezione
   "Componenti a vita propria" che lo stesso libretto STAMPATO mostra
   (`#sch-comp` non ha `no-print`, quindi compare nella stampa; il CSV
   la ignora perché `fascicoloMezzo` non legge mai `m.componenti`).
   Viola l'invariante che il codice stesso dichiara per le altre
   sezioni troncate a schermo ("lo storico completo esce dal CSV").
   Verificato dal vivo: l'Escavatore E1 in demo ha un pneumatico al
   93,5%/94% della vita attesa (stato "attenzione") visibile a schermo
   e in stampa, assente dal CSV (regex di controllo su tutto il file:
   nessuna riga "componente"/"pneumatico"/"vita attesa"). Fix
   suggerito dall'agente (non applicato): aggiungere una sezione
   "componente" a `csvLibretto`, leggendo `vitaComponenti` come fa già
   `#sch-comp`.

## Prossimo passo atomico
1. Implementare e chiudere il fix di **Scudo** (`cartellaLavoratore`):
   per ogni mansione in `mie`, confrontare `m.dpi` con i `tipo`
   presenti in `verbale.righe` e aggiungere i tipi mancanti a
   `righeGuaste`/`daSistemare` (o un nuovo secchio), stesso schema di
   `allarmiDpi`. Verificare dal vivo (stesso caso Luca Bianchi/
   otoprotettori), scrivere un test in run-kpi.mjs e/o estendere un
   banco browser esistente su Scudo, worktree isolata, giro completo,
   commit, push, checkpoint.
2. Poi il fix del **core** (`esitoSparo`): aggiungere il quarto ramo
   (o generalizzare il primo) per `esplosi !== null && mancati ===
   null && fori > 0 && esplosi > fori`. Stesso ciclo di verifica.
3. Poi il fix di **Flotta** (`csvLibretto`/`fascicoloMezzo`): aggiungere
   la sezione "componente" leggendo `vitaComponenti`, come fa già
   `#sch-comp`. Stesso ciclo di verifica.
4. Continuare "mai fermarsi": mantenere ≥3 cantieri paralleli aprendone
   di nuovi (candidati: Sentinella/Terra ricerca continua sul mestiere,
   un secondo giro mirato su Deepwork ID/shared, un giro su Genesi al
   terzo round) man mano che i cantieri correnti si chiudono, sempre
   verificando ogni difetto contro il codice attuale prima di agire.

## Blocchi
Nessuno.
