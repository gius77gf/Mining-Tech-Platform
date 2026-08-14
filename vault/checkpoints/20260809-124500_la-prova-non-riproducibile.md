# Checkpoint — 2026-08-09T12:45:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ff240b8`

## Task completato

**Le quattro «CONFERMATA ASSENTE» di Terra rimisurate una per una** — e i
verdetti reggono tutti e quattro, mentre **tre ricerche su quattro** non
tornano più.

| riga | verdetto | ricerca |
|---|---|---|
| Cut & fill volumes | ✅ regge | ⛔ `fill` 16, `taglio`/`riempimento` 8 (erano 0) |
| Automatic stockpile detection | ✅ regge | ✅ ancora zero |
| Pit design e scheduling | ✅ regge | ⛔ `pit` 1 |
| Floating cone optimization | ✅ regge | ⛔ `floating` 1 |

## Le due cose imparate

1. ⛔ **UNA QUARTA VESTE DELLA PROVA CHE INVECCHIA: NON FALSA, NON PIÙ
   RIPRODUCIBILE.** La riga dice «cercati `cut`, `fill`, `taglio`,
   `riempimento`: **zero occorrenze**», e oggi quel comando risponde **16 e 8**.
   Il verdetto però è ancora giusto: nessuna di quelle occorrenze è un volume —
   sono **termini di disegno** (`fillStyle` della tela, la classe `dwg-taglio`
   che è un tratteggio, «la testa del riempimento» della barra di avanzamento),
   e `pit` sta dentro una parola italiana mentre `floating` è CSS.
   ⚠️ Il danno è preciso: chi rilancia il grep, legge «16» e **butta via una
   verifica valida**. Una prova che non si riproduce non è meno pericolosa di
   una falsa — è pericolosa **allo stesso modo**, perché il lettore non ha
   modo di distinguerle.
2. ⛔ **LA CURA È DIRE CHE COSA SONO LE OCCORRENZE, NON QUANTE.** Un conteggio
   invecchia da solo: basta che qualcuno usi la parola per un'altra ragione. La
   frase «nessuna di quelle occorrenze è un volume: sono termini di disegno»
   resta vera anche quando il numero cambia, e chi la rilegge sa **che cosa
   guardare** invece di dover fidarsi di una cifra.
   ⚠️ È lo stesso principio già applicato oggi due volte: sostituire un
   **numero** con un **elenco** (le prove del ponte di Campo) e con un
   **criterio** (i verdetti contati per come cominciano, non per come sono
   scritti).

## Verifiche
- i tredici termini delle quattro righe rilanciati **col comando** su
  `terra-data.js`, `index.html`, `dw-ponti.js`
- ogni occorrenza non-zero **aperta** per vedere che cos'è, invece di dedurlo
- `documenti-invecchiati`: arretrato **10 → 9 commit**, 0 che mordono
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`; oltre 4.000 righe.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: le **43 «CONFERMATA ASSENTE» rimaste** (campo 11,
sentinella 13, conti 8, flotta 5, scudo 6), una app alla volta, col metodo
appena usato — si rilancia il comando che la riga dichiara, e **ogni occorrenza
non-zero si apre** invece di concludere dal numero.
⚠️ Il conto delle 47 è sorvegliato: se una di quelle righe cambia verdetto, il
controllo cade finché la roadmap non segue.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
