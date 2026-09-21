# Checkpoint — 2026-09-15T04:44:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b84daff9 (pushato)

## Cosa è stato completato

Chiuso il secondo dei tre difetti trovati dalle passate in profondità di
questo blocco (checkpoint `20260915-034940`). Riverificato a mano — lettura
diretta del codice, riproduzione con la fattura `f4` della dimostrazione —
prima di agire.

**Il difetto**: `sollecitabile()` (`apps/conti/conti-data.js`) blocca il
bottone «Sollecito» su una fattura «come non emessa» (scartata dallo SdI, o
mai inviata): «prima si rimanda, poi si sollecita». La lettera gemella,
`estrattoContoCliente()` — che riepiloga TUTTO l'aperto di un cliente in un
documento pronto per email/PEC — non passava mai da
`statoSdi(f, oggi).nonEmessa`: la fattura scartata restava dentro `totale`,
`scaduto`, il calcolo della mora ex D.Lgs 231/2002 e il «Totale dovuto ad
oggi», con solo una frase informativa in coda alla riga («scartata dallo
SdI: come non emessa, sarà rimandata»). Riprodotto con `f4` (Calcestruzzi
RG, € 5.900, scartata, unica fattura aperta del cliente): il documento
chiedeva formalmente € 5.985,94 di mora e capitale su una fattura che per
il fisco non è mai stata emessa. `testoSollecito()` (la lettera per singola
fattura) aveva lo stesso buco a livello di funzione pura: il controllo
viveva solo nella pagina, PRIMA di chiamarla — un secondo chiamante futuro
lo avrebbe ereditato senza saperlo.

**La correzione**:
- `estrattoContoCliente`: le fatture "come non emesse" sono ora escluse da
  `totale`/`scaduto`/`moraTot`/`spese`/`totaleDovuto`, e dichiarate in un
  secchio a parte quando presenti («Di cui non ancora emesse, escluse dal
  totale sopra e non richiedibili finché non lo sono: N fatture · € X»),
  sullo stesso modello di `agingIncassi`/`divarioRecupero` (un secchio suo,
  non uno zero silenzioso).
- `testoSollecito`: aggiunto `if (statoSdi(f, oggi).nonEmessa) return null;`
  dentro la funzione pura stessa (difesa in profondità), non solo nel
  bottone che la chiama.

**Verifica**:
- Tre nuovi casi nel test esistente `"Conti · statoSdi e sollecitabile..."`
  (`run-kpi.mjs`): il totale/scaduto di Calcestruzzi RG (sola fattura
  scartata) va a zero e il documento non contiene più «Totale dovuto ad
  oggi» né «Interessi di mora»; il documento dichiara il secchio con
  l'importo esatto; `testoSollecito` chiamato direttamente sulla stessa
  fattura torna `null`; un cliente con UNA fattura emessa e UNA scartata
  (dati sintetici) mostra solo la prima nel totale aperto, la seconda resta
  nel suo secchio senza sommarsi né sparire.
- Numeri calcolati e verificati con uno script diretto prima di scriverli
  nel test (mai indovinati).
- Test preesistente `"Sentinella · rispostaReclamo..."` — NON toccato da
  questa unità (fa parte del terzo difetto, Sentinella, ancora da
  committare separatamente).
- `run-kpi.mjs` diretto: 2985/0 (il totale dei blocchi `test()` non sale,
  perché le nuove asserzioni sono dentro un test già esistente — atteso,
  non un errore: `passed`/`failed` contano i blocchi `test()`, non le
  singole `ok()`/`eq()`).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/34.
  `numeri-nei-documenti.mjs`: 43/0 (nessun numero di documento tocca
  questa unità, che non aggiunge un blocco `test()` nuovo).
- Giro isolato su worktree separata (staging scoped a `conti-data.js` +
  solo l'hunk di `run-kpi.mjs` pertinente, separato dagli hunk di
  Sentinella con `git apply --cached` su una patch estratta a mano dal
  diff completo): **40 comandi a posto, 0 caduti**, documenti coerenti.
- `git status --short` verificato prima del commit: esattamente
  `apps/conti/conti-data.js` + `apps/deepwork-id/tests/run-kpi.mjs` (con
  ancora dentro, non committati, gli hunk di Sentinella — verificato con
  `git diff --cached --stat` che mostrava solo le righe di Conti).

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata).

## Prossimo passo atomico

Committare il terzo e ultimo difetto di questo giro di ricerca (Sentinella:
`misureDelGiornoPerReclamo` con la soglia EFFICACE del ricettore invece
della soglia grezza del punto — codice e test già scritti e verificati con
`run-kpi.mjs` diretto, 2985/0, comprese le due direzioni: falso
"superamento" sui dati veri della demo v2/rc2, falso "conforme" su uno
scenario costruito con un ricettore sensibile). Restano staged/non
committati: `apps/sentinella/index.html`, `apps/sentinella/sentinella-
data.js`, e l'ultimo hunk di `apps/deepwork-id/tests/run-kpi.mjs` (righe
1453 e 26608 del diff originale). Procedura: `git status --short` per
confermare che SOLO i tre file di Sentinella restano (Conti e Flotta sono
già committati e puliti), worktree isolata da HEAD (ora b84daff9),
`giro-node.mjs`, verifica, commit, push, checkpoint, push checkpoint.

Dopo le tre unità: continuare con altre passate in profondità (Terra già
fatta a mano senza esito; restano da coprire ulteriormente Scudo e Campo
oltre le sezioni già toccate questa settimana) o tornare al blocco B4.

Nessuno stop volontario: si prosegue subito.
