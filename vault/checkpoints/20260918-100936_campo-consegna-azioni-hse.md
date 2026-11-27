# Checkpoint — 2026-09-18T10:09:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8bb1b40f — fix(campo): testoConsegnaTurno porta il semaforo delle azioni correttive HSE, come già rapportoGiornata

## Cosa è stato completato
Dal deep-pass QA su Campo (agente a93b2c29f7a4870b8): `testoConsegnaTurno`
(il documento che il turno entrante legge per primo) nominava una voce
non a posto della checklist e basta, mentre il documento gemello
`rapportoGiornata` già mostra accanto a ogni voce lo stato dell'azione
correttiva aperta in Scudo — "(azione chiusa)", "(1 azione da
chiudere)", "(senza azione)". Il chiamante in `index.html` non passava
nemmeno `azioni: AZI_HSE` alla funzione (a differenza della chiamata
gemella a `rapportoGiornata`, che lo passa già).

Corretto in `apps/campo/campo-data.js` (`testoConsegnaTurno` usa
`vociNonAPosto` con la stessa forma di `rapportoGiornata` quando
`AZI_C` è un array) e in `apps/campo/index.html` (passa
`azioni: AZI_HSE`).

## Verifica
- Nuovo test con controprova (verificato: con la riga vecchia rimessa a
  mano il test cade correttamente, stesso semaforo di
  `rapportoGiornata` atteso).
- Nuovo test di cablaggio (grep sul sorgente) che pretende
  `azioni: AZI_HSE` in ENTRAMBE le chiamate.
- KPI: 3143 → **3145**.
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4140**. 9-suite sum: **3.639** (3145+330+83+32+9+8+7+3+22).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — quattro nuove unità verificate da agenti in background
Durante questa unità sono arrivati due nuovi report di deep-pass QA
indipendenti (Genesi, shared/dw-app-ui.js), che si aggiungono alla coda
di Sentinella già aperta. Sette difetti verificati in tutto, non ancora
implementati:

**Sentinella** (già in coda dal checkpoint precedente):
1. `dataIt` locale in `sentinella-data.js:431-435` non valida il
   calendario (vs. la versione condivisa `dw-shell.js:1686-1689` con
   `dataISOEsiste`). Usata nei documenti che escono; lo schermo usa la
   versione condivisa corretta.

**Genesi** (agente a4a598fd97c867b83):
2. `D2.relLo`/`D2.relHi` (finestra del relief, badge di rischio) non
   entrano in `volSnapshot` e non vengono ripristinati su "Apri" — la
   STESSA famiglia di difetto (campo del form mai salvato/ripristinato)
   già corretta TRE volte oggi stesso nello stesso file (tratti, poi
   dir/costi, poi errColl/dev), rimasta fuori dal censimento "34 campi"
   di quel lavoro. Scenario: si alza la finestra del relief per un
   progetto A, si apre un progetto B senza reload — B eredita la
   finestra di A, classificando male il rischio (blocchi/vibrazioni/
   proiezioni) sulla Scheda Validatori.
3. `pointcloud.js:parseXYZ` (righe 11-19): su un file XYZ con righe
   miste (alcune con RGB, altre senza), `pos` ha 3 valori per ogni riga
   valida ma `col` solo per le righe con RGB completo — i due array si
   disallineano indice-a-indice dal primo "buco" in poi, e
   `nuvola-poc.html:151-158` li passa come `BufferAttribute` di `count`
   diverso sulla stessa geometria: i colori si scalano sui punti
   sbagliati. Nessun test in `run-pointcloud.mjs` copre righe miste.

**shared/dw-app-ui.js e fogli condivisi** (agente a2cd701aa80f1f010,
cinque difetti — il primo è una regressione seria confermata con `git
blame`):
4. **`shared/dw-app-ui.css:276-287`** (commit 68e1852b0) dà
   `cursor:pointer` a `.item` SENZA condizioni; 79 minuti dopo, lo
   stesso giorno, `dw-app-ui.css:305-320` (commit 64d8a7edb) introduce
   `.item.tocca{cursor:pointer}` per marcare SOLO le righe cliccabili —
   ma con la base già incondizionata, `.item.tocca` è un no-op e la
   manina torna su ogni riga di tutte e sei le app. Effetto a valle:
   ogni app ha rimediato da sola in modo diverso (Conti/Scudo/Sentinella
   ridefiniscono `.item{cursor:default}` locale; Flotta inventa
   `.item.statico`; Campo/Terra ripetono `cursor:pointer` ridondante e
   tappano riga per riga con `style="cursor:default"` inline, 11+ volte
   in Terra) — la frammentazione che la riforma `.tocca` voleva
   chiudere. Esiste già un banco dedicato (`promesse-tocco.mjs`) ma il
   difetto vive nella regola condivisa, non in una pagina.
5. Il toast di errore in Genesi non ha un CSS diverso da un messaggio
   normale: Genesi non carica `dw-app-ui.css` ma usa il `toast()` JS
   condiviso (chiamato con `tipo:"err"` in `genesi.html:1282`); il CSS
   locale definisce solo `#toast`/`#toast.show`, nessuna regola
   `.err`/`.success`/`.warn` — un errore di validazione ha lo stesso
   colore ambra neutro di un messaggio qualunque.
6. Toast senza `role="status" aria-live="polite"` in Genesi e
   deepwork-id/admin (le altre sei superfici ce l'hanno) — un messaggio
   toast non viene annunciato a uno screen reader in quelle due pagine.
7. Nessuna trappola del focus nella modale nonostante `aria-modal=
   "true"` dichiarato su tutte le 8 pagine: `dwUiAggancia()` gestisce
   `Escape` ma non `Tab`, nessun `inert`/`aria-hidden` sul resto della
   pagina — con la modale aperta, Tab ripetuto porta il focus su
   elementi sotto il backdrop, visivamente coperti ma interattivi.
8. Listener accumulato senza fine su `#modal-foot` in Conti
   (`index.html:6165`, flusso "Scrivi il verbale"): ogni apertura
   aggiunge un `addEventListener` in più (`once:false`, mai
   `removeEventListener`), perché `apriModale()` svuota solo
   `innerHTML` senza toccare i listener sul contenitore persistente.

## Prossimo passo atomico
Priorità suggerita: (4) la regressione CSS della manina — è la più
diffusa (tutte e sei le app) e la più "attiva" (continua a generare
rimedi divergenti ogni volta che qualcuno se ne accorge in un'app
singola); poi (2) Genesi relLo/relHi, stessa famiglia di tre fix già
fatti oggi, rischio di sicurezza sul campo (classificazione del rischio
vibrazioni/proiezioni); poi le altre a scelta. Isolare in una nuova
worktree e continuare "mai fermarsi": con 8 difetti verificati in coda,
non serve dispatchare nuovi agenti finché la coda non si accorcia
sensibilmente — concentrarsi sull'implementazione.

## Blocchi
Nessuno.
