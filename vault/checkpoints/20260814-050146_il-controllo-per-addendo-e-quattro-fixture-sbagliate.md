# Checkpoint — 2026-08-14 05:01 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `2d643838` — il controllo per addendo, dove i numeri nascono
- `10834141` — correggo una riga mia: `scartiVolateCsv` non ha quel difetto
- `ab863331` — CLAUDE.md: la fixture con le colonne indovinate
- `36d520a2` — B8 aperta con la misura e col limite già trovato
- `b6736d08` — B7: la stessa intermittenza su una suite `node`

## Che cosa è stato completato

**1. Il controllo per ADDENDO, messo dove i numeri nascono.** Nasce da un errore
mio: nei documenti avevo scritto «2226 + 318» dove il vero era «2223 + 321» —
**due errori che si cancellano**, quindi somma giusta, totale giusto, e ogni
controllo verde. Non si poteva prendere in `numeri-nei-documenti` (il conto
statico delle prove non funziona: **2.122 statiche contro 2.229 vere**), quindi
sta in `giro-node.mjs`, l'unico posto che le lancia tutte.
⚠️ L'elenco delle otto suite si **legge** da dove è già scritto — derivato, non
gemello — e se non si legge **lo dichiara**.
⛔ E alla prima passata ha trovato un difetto **in sé stesso**: sommava le due
passate della stessa suite (3 + 7 = 10 contro i 3 veri). È la «ripetizione
contata come roba nuova» che questo repository racconta per il 4741 di
`orologio-cliente` — **rifatta da chi la stava citando**.
Controprova: rimessa la coppia che si compensa, il giro cade e li nomina tutti e
due, con la suite accanto.

**2. La lezione che stanotte è costata quattro volte: la fixture con le colonne
indovinate.** Tre volte ha accusato un prodotto sano (`parseScadenzeCsv` 0 su 3,
`parseFattureCsv` 0 su 4, `scartiVolateCsv` che «nomina le righe con l'ora»), e
la terza era **già finita in una voce di roadmap**. Corretta **scrivendo la
correzione, non cancellando la riga**: una riga che propone un lavoro manda
qualcuno a farlo.
Scritta in `CLAUDE.md` col segno da riconoscere: *un lettore che scarta **tutto**,
compresa la riga che hai scritto sana, non è severo — è un lettore a cui hai dato
un'altra tabella.* Alla **quarta** occasione la regola ha funzionato: Campo
sembrava importare la propria intestazione come squadra, e sbagliavo io.

**3. B8, aperta con la misura E col limite.** Un CSV di fatture importato
nell'anagrafica dei lavoratori entra come **due persone chiamate «numero» e
«2026/001»**. Ma la difesa ovvia è **già esclusa**: i lettori tollerano di
proposito un file **senza** intestazione (misurato: 1 riga). Quindi non si
pretende l'intestazione — si riconosce quella di un'**altra** app e ci si ferma
dicendolo. Un cantiere ci sta lavorando.

**4. B7 estesa: l'intermittenza ha morso una suite `node`.** Il giro `--tz` ha
dichiarato caduto `funzioni-mai-usate` **solo in ora italiana** — che sarebbe
stato serio, perché l'ora italiana è quella del cliente. Rilanciata **da sola**
con lo stesso `TZ`: **4 passati, 0 falliti**. Non era l'orologio: era la macchina.
⛔ Il segno che lo distingue: il comando è caduto **senza stampare nessuna riga
`✗`**. *Un test che fallisce dice quale; uno che soccombe alla macchina non dice
niente.*

## Che cos'è vivo adesso
- **Il giro del browser**, dalle 04:29 su `93a569c3`: alle 05:01 otto passate,
  **0 KO veri**. Registro in `…/scratchpad/giro-notte/registro.txt`.
  ⚠️ **Non se ne lanci un secondo.**
- **Un cantiere su B8** (node, non compete per la macchina).
- **Una ricerca** sulle parole del mestiere, con l'istruzione di **scrivere man
  mano** invece di tenere tutto in testa: quella prima è morta sul limite con il
  documento non scritto.

## Prossimo passo atomico
Raccogliere il cantiere di **B8** quando consegna — un commit per unità, indice
costruito da HEAD — e **leggere il giro** con `leggi-giro.mjs` quando finisce,
riverificando ogni KO prima di aprirci un cantiere (il ramo si muove a ogni
unità). Poi rimisurare **B7** a macchina scarica, che adesso non lo è.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; la CI è verde con
  l'eccezione dichiarata e sorvegliata.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
