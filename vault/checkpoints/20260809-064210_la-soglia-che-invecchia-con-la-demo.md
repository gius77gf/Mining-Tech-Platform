# Checkpoint — 2026-08-09T06:42:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`784c965` (questa unità committata subito dopo)

## Task completato

**L'ultimo KO del giro lavorabile senza il fondatore, chiuso — ed era il banco
un'altra volta, per la sorella della causa di stamattina.**

`conti-barre-peso` dava **14 ok, 1 KO**, e il KO era una **precondizione**:
`zeri.length >= 2`, «accanto ci sono fasce a zero da confrontare». Non
misurava il prodotto: misurava **la dimostrazione**.

| | prima | dopo |
|---|---|---|
| `conti-barre-peso` sano | 14 ok, **1 KO** | **15 ok, 0 KO** |
| controprova | 5 KO | **5 KO** (immutata: non si è perso niente) |

## Le tre cose imparate

1. ⛔ **UN BANCO CHE PORTA DENTRO UN CONTO DELLA DIMOSTRAZIONE INVECCHIA QUANDO
   LA DIMOSTRAZIONE MIGLIORA — ed è la gemella, senza iniezioni, della causa di
   stamattina.** Quando il banco è nato, «Scaduto oltre 90 gg» e «Senza
   scadenza» erano tutt'e due vuote e la barra dei 12 € si leggeva **fra due
   fasce a zero**. Poi il commit `069d70e` — *«assente non è corrotto: la
   dimostrazione può mostrare il caso»* — ha messo nella demo una fattura
   **senza data di scadenza**, cioè **esattamente il caso per cui la difesa era
   stata costruita**. Da allora le fasce vuote sono una, e il banco accusava il
   prodotto di un difetto che aveva causato il prodotto migliorando.
   La regola vale per le **soglie** quanto per le **ancore**: si derivano, o si
   stampano accanto al verdetto.
2. ⛔ **E LA CORREZIONE FACILE ERA A PORTATA DI MANO: `>= 2` → `>= 1`, e il
   banco passa.** È la trappola scritta nel checkpoint delle 04:54 («la
   correzione facile che dà il verde falso»), e per non caderci ho dovuto
   chiedermi **a che cosa servivano due**: a distinguere «lo zero si disegna
   zero» da «quella riga per caso è a zero». Quel conto **non stava lì**: sta
   nella sezione 2, che guarda tutte e quattro le liste e ha **8** righe a zero.
   Quindi il `>= 2` è stato **spostato**, non tolto — alzato lì da `> 0` a
   `>= 2`, dove non dipende da una singola fascia — e nella sezione 1 resta la
   domanda diretta, che di vuote ne vuole una.
   Netto: nessuna asserzione è più permissiva di ieri, e una è più severa.
3. ⚠️ **E la prova che non si è perso niente non è un ragionamento, è la
   controprova**: col difetto rimesso la coppia cade **lo stesso con una vuota
   sola** — «12 € → 0 px, € 0 → 0 px». Se fosse passata, il `>= 1` sarebbe
   stato una permissività vera.
   Il conto delle fasce adesso **si stampa** — «1 vuote su 6: Scaduto oltre 90
   gg» — invece di essere una soglia che un dato nuovo fa cadere in silenzio.

## Verifiche
- `conti-barre-peso` **15 ok, 0 KO**, 25 barre su 4 liste
- controprova: **5 KO**, e fra questi le due asserzioni toccate
- `giro-node` **34 comandi a posto, 0 caduti**, sulla **copia di quello che si
  committava** (worktree ricreata da zero + `git add -A`)

## Stato dei 20 KO del giro
**9 chiusi · 11 aperti**, e dei 11 rimasti **7 aspettano il fondatore**.
⚠️ Bilancio dei venti, aggiornato e onesto: **due** erano difetti veri già
chiusi da altre unità, **cinque** erano attese sbagliate del banco, **tre** un
banco che non riusciva a montare il suo caso. Nove su venti non erano difetti
del prodotto — e nessuno di quei nove si vedeva senza riprodurlo.

## Prossimo passo atomico
**Gli stati «non misurato» di Campo (1 KO), che vogliono lo SCENARIO
ricostruito, non una parola allargata.** Il banco `stati-non-misurati
--solo=campo` cerca la contraddizione «fermo oltre la durata dichiarata del
turno», e nella dimostrazione la pagina risponde prima «non è registrata
nessuna attività per questo turno»: la contraddizione **non viene mai
raggiunta**. Il lavoro è nei dati serviti — registrare un'attività con un
fermo, poi dichiarare un turno più corto del fermo — e **solo dopo** si guarda
se `#disp-stato` dice «non calcolata» o una percentuale.
⛔ Allargare la regex a «calcolat[ao]» è la correzione facile che dà il verde
falso: è già scritto nel checkpoint delle 04:54 e va riletto prima di toccare
il banco.
Poi restano i **nove punti di coerenza** del raggruppamento in Genesi (numeri
che non possono superare il migliaio: coerenza, non difetto).

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
