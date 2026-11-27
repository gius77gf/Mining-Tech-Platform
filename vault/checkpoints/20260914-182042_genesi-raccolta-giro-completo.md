# Checkpoint — 2026-09-14T18:20:42Z

## Tipo
unit-complete (raccolta del giro completo del browser + correzione dell'unico difetto Genesi trovato)

## App
Genesi (e una nota di visibilità, non un'azione, su Conti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Raccolto il giro completo del browser (`tutti.mjs`), lanciato alle
13:44Z su una copia congelata del commit `477ac992` e concluso dopo
oltre quattro ore. **Limite dichiarato**: per un errore mio la
redirezione dello stdout passava da `tail -40`, quindi ho recuperato
solo le ultime 42 righe del registro (254 banchi a posto, 25 da
guardare in totale — ma il dettaglio dei primi ~250 è perso, non
leggibile con `leggi-giro.mjs`). Non rilancio il giro intero per
recuperarlo: costerebbe altre 3+ ore per uno storico che riguarda
soprattutto altre app, fuori dal perimetro di questo blocco.

**Tutte le voci Genesi visibili nella parte recuperata** erano `ok`
tranne una: `KO frasi limite di Genesi · controprova`. Indagata a mano
(rilanciando il banco standalone, non fidandosi del titolo):
- 10 degli 11 difetti della controprova trovavano ancora il loro punto
  nella pagina ed erano presi correttamente dal banco;
- **uno era stale**: il plurale scritto a mano per "N punti caricati"
  (doveva dire "1 punto" non "1 punti" sul caso singolare) non trovava
  più il suo testo in `genesi.html`, perché il trasloco **G36** (13/09,
  cantiere B3) aveva già spostato quella logica in `_puntiNuvola`,
  funzione pura in `genesi-data.js` — la stessa famiglia già raccolta
  in CLAUDE.md: *"un'iniezione che non trova più il suo pezzo spegne la
  controprova in silenzio"*.

**Corretto al livello giusto**: la prova del caso singolare non era mai
stata riscritta per `_puntiNuvola` in `run-kpi.mjs` (solo casi plurali
erano coperti). Aggiunta, verificata contro il difetto storico prima di
lasciarla (rimesso a mano il plurale fisso: la prova cade). Tolta
l'iniezione stale dal banco del browser, con una nota che spiega dove
vive ora la copertura — non un'eccezione dichiarata e dimenticata, una
copertura spostata.

**Nota di visibilità, non un'azione** (fuori dal perimetro Genesi):
il registro recuperato mostra anche `KO le rimanenze di piazzale di
Conti: a listino, il cumulo non misurato fuori, il CSV dallo stesso
conto` — un KO REALE (non una controprova), su Conti. Non toccato,
coerente con la direttiva del fondatore di restare su Genesi; segnalato
qui perché non vada perso. E `KO finestra di caricamento · controprova`
— un banco trasversale che non copre Genesi affatto (verificato con
`grep`), fuori perimetro.

## Verificato

- `genesi-frasi-limite.mjs --controprova`: 10/10 iniezioni trovano il
  loro punto (era 10/11), 15 prove cadute come atteso — "il banco SA
  fallire".
- `genesi-frasi-limite.mjs` diretto: 36/0, invariato.
- `run-kpi.mjs`: 2970/0 (era 2969), la nuova prova verificata contro il
  difetto storico (cade se il plurale torna fisso).
- `numeri-nei-documenti.mjs`: 43/0 dopo la cascata su tutti e quattro i
  documenti (3.450→3.451 prove senza rete, giro completo `node`
  3.911→3.912) — un mio primo tentativo di riscrivere la frase aveva
  rotto il parser del controllo con una parentesi annidata (`(...
  (spostata...) ...)`), presa e corretta prima del commit, non dopo.
- Giro completo `node` su worktree isolata, **ricreata due volte per
  convergere**: 40 comandi a posto, 0 caduti, 3912 asserzioni, addendi
  verificati.

## Stato roadmap

Nessuna voce nuova. G36 (trasloco `_puntiNuvola`) ora ha coperture
allineate fra modulo e banco del browser.

## Blocchi e limiti noti

Il registro completo del giro (i primi ~250 risultati) è perso per un
errore di redirezione mio. Le voci Genesi visibili nella parte
recuperata sono tutte a posto (dopo questa correzione); non è una
garanzia sulle voci non recuperate, ma nessuna di esse riguardava
Genesi per come è organizzato l'elenco banchi di `tutti.mjs` (le voci
Genesi sono raggruppate). Il KO reale su Conti resta segnalato, non
corretto.

## Prossimo passo atomico

Il backlog di ricerca e il censimento estrazione restano esauriti; il
censimento per-bottone su Genesi è completo; il giro completo del
browser è stato raccolto e il suo unico difetto Genesi è chiuso. Se
serve un prossimo giro completo, **si redirige lo stdout su file per
intero** (non attraverso un `tail` che tronca la fonte), per poterlo
leggere davvero con `leggi-giro.mjs` — è la lezione di questo blocco.

Il fondatore non ha ancora risposto sulla domanda CAD (oltre otto ore).
Nessuna nuova accensione della routine da quella delle 15:45 UTC.

Nessuno stop volontario: si prosegue subito.
