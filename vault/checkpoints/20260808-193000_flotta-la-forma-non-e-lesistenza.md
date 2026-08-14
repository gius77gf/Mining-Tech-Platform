# Checkpoint — 2026-08-08 19:30 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a21f50a` — fix(flotta): il CSV che va al commercialista scriveva una data che
non esiste

## Come è stata trovata

Non da un banco: applicando **la domanda** che `CLAUDE.md` dice di farsi *prima*
di leggere il codice riga per riga — *dove questa app compone qualcosa che ESCE
(un CSV, un PDF, una frase di riepilogo), chi decide i suoi numeri?* In Flotta la
risposta era **no**: la pagina decideva «ha una data» dalla **forma**
(`/^\d{4}-\d{2}-\d{2}$/`) in **otto punti**, mentre il suo stesso modulo usa
`dataISOEsiste` **undici** volte. La regola sta in `shared/` da mesi.

## Il prima e il dopo, misurato

Caso iniettato nella **risposta HTTP** (mai sul file): una voce di costo datata
**2026-02-30** — che ha la forma di una data e non esiste. Controprova servendo
**la versione vera di `HEAD`**.

| | prima (`HEAD`) | adesso |
|---|---|---|
| schermo | «—» | «senza data» |
| **CSV** | `2026-02-30` | cella **vuota** |
| messaggio | «di cui **1** senza data» | «di cui **2**» |

⛔ **Lo schermo era già onesto** — lo salvava `dataIt`, che una data impossibile
la rifiuta — e a mentire era **il file**. È il posto dove nessuna prova guarda,
perché le prove chiamano il modulo e i file li compone la pagina. E il conto in
fondo al messaggio contava quella voce fra quelle **con** la data.

Gli otto punti erano **la stessa decisione otto volte**: quali costi di
carburante entrano nel mese, come si scrive la data a schermo, se si programma
la manutenzione successiva, il precompilato e la guardia della modifica, i
giorni di distanza (dove `Date.parse` faceva **scorrere** il 30/02 al 2 marzo —
un numero **sbagliato** invece che sconosciuto), la cella del CSV, il conto dei
«senza data».

## L'errore della prima controprova, dichiarato

Rimetteva la regola della forma in **due** punti su otto, e faceva sembrare che
lo schermo dicesse già «senza data». **Una ricostruzione a metà non è lo stato
di prima: è un terzo stato che non è mai esistito.** Con `git show HEAD:` il
confronto è quello vero — ed è così che si è visto che il colpevole era il file
e non lo schermo, cioè il contrario di quello che la prima misura suggeriva.

## Quanto è raggiungibile, senza gonfiarlo

Dalla sua interfaccia Flotta prende la data da un `<input type="date">`, che
2026-02-30 non lo produce. Il caso entra da **altrove**: un dato scritto da una
versione precedente, o da un'altra app che scrive nella stessa collezione. La
correzione vale comunque, perché **la decisione era sbagliata a prescindere da
chi le porta il dato** — ed è la stessa che `parseScadenzeCsv` ha già imparato
il 03/08 («la forma non è l'esistenza»).

## Prossimo passo atomico

La stessa domanda alle **altre app**: `grep -c 'd{4}-\d{2}-\d{2}'` per pagina
dice dove la forma decide ancora al posto dell'esistenza. Flotta era a **8**,
adesso è a **0**. ⚠️ Non tutte le occorrenze sono difetti — una `slice(0,10)` su
un istante è un'altra cosa — quindi si leggono una per una, come qui.

## Sullo sfondo

Il giro del browser su `23712e6` è a ~40 minuti. Quando finisce va letto con
`leggi-giro.mjs`: sezione 0 (quanto è vecchio), poi le righe «non ho guardato»,
poi i KO.

## Blocchi

Nessuno.
