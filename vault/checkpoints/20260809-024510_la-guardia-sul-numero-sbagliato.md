# Checkpoint — 2026-08-09T02:45:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a9e858f`

## Task completato

**Il filo del singolare, portato avanti su cinque superfici** — Scudo, Genesi
(pagina e modulo), Campo (pagina e modulo) e il core. Il censimento è passato
da **54 punti da leggere a 24**.

## Le tre cose imparate

1. ⛔ **LA GUARDIA C'ERA, MA SU UN ALTRO NUMERO** — ed è il caso che vale più
   di tutti, perché nessun censimento «cerca una guardia su questa variabile»
   lo può prendere. In Campo:
   `r.scadute.length > 1 ? " (e altri " + (r.scadute.length - 1) + " documenti)"`.
   Il controllo è giusto per decidere **se** scrivere la coda; ma il numero
   **stampato** è `length - 1`, che vale esattamente **1** quando i documenti
   sono due — il caso più comune di tutti. «e altri 1 documenti». Sono due
   variabili diverse che sembrano la stessa: quella che **decide** e quella che
   si **legge**.
2. ⛔ **UNA RIGA SEGNALATA DA UN CONTROLLO NON È ANCORA UN DIFETTO.** In Scudo
   avevo corretto `quantiMesi + " mesi"` e poi l'ho **ripristinata**, con la
   ragione scritta accanto: quella variabile vale 12, 6 o 4 — mai 1 — perché lo
   decide la larghezza del grafico due righe più su. La correzione non avrebbe
   corretto niente e avrebbe tolto dal codice l'unico posto in cui si legge che
   quei tre valori sono gli unici possibili. È la stessa disciplina del foglio
   di Scudo accusato dal righello: **si guarda il soggetto prima di credere
   allo strumento.**
3. ⚠️ **UNA PROVA NUOVA CHE FALLISCE ACCUSA IL CODICE, E QUASI SEMPRE HA TORTO
   LEI.** La mia asserzione su `testoRiposo` deduceva la finestra dalle
   presenze passate, mentre `riposoPrimaDelTurno` la prende come **sesto
   argomento**: senza, `giorni` restava al 7 di serie e la prova misurava il
   caso di sopra credendo di misurarne un altro. Prima si legge **come il
   codice si aspetta i dati**.

## Le correzioni, con la ragione
- **Scudo**: «1 mesi» sulla sostituzione di un DPI; «ogni 1 mesi» → «ogni mese»
  su un corso mensile; «1 voci» sulla checklist di un modello;
- **Genesi** (9 punti, tutti concatenazione): «1 fori» sulla volata a **foro
  singolo** — che è quella con cui si tara la legge di sito — e «1 referti»
  sulla legge calibrata su **un** referto, cioè proprio il numero che l'utente
  deve pesare;
- **Campo**: «1 persone», «1 fori» (import e consuntivo), e «nei 1 giorni» →
  «nel giorno prima di questo», dove col «1» cambia la **preposizione**;
- **core**: «1 fori» sulla riga del rapportino;
- **`genesi-data`**: «legge di sito · 1 referti».
⚠️ Restano **dichiarati al plurale** con la ragione: «campioni» di un'onda
sismografica (migliaia, un'onda da un campione non è un'onda) e «foto», che in
italiano è invariabile.

## Verifiche
- KPI **1922 passati, 0 falliti**, con due asserzioni nuove sul ramo nuovo
- `sintassi-pagine` 34/0 · `iniezioni-fresche` **215/215** · `run-stile` 318/0
- `giro-node` **34 comandi a posto, 0 caduti** dopo ogni unità, e rifatto sulla
  **copia** di ciò che si committa

## Stato roadmap
Riga «I ternari del singolare»: da **54** punti da leggere a **24** in 8 file,
con 77 scartati perché hanno una guardia sulla loro variabile e 9 costanti.
Restano Conti (2), Flotta (11 fra ore, giorni e mesi), Terra e le code.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`) appena finisce: alle
02:44 era vivo da **3h38**, con un figlio che macinava CPU e il registro
cresciuto 10 secondi prima — quindi **sano, non piantato**. Ordine:
**sezione 0 (età)** → **righe «non ho guardato»** → **KO veri**.
⛔ Attesta un commit di **otto unità fa**: i suoi KO vanno riverificati sul
commit di adesso prima di aprirci un cantiere.
Se il giro è ancora lungo: continuare il singolare da **Flotta**, che ha il
gruppo più numeroso (ore motore, giorni di copertura, mesi registrati, finestra
dei fermi) — l'elenco lo rifà
`scratchpad/sing/trova2.mjs`, che è una **misura**, non un controllo.

## Blocchi
Nessuno.
