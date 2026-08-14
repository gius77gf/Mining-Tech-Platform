# Checkpoint — la striscia di un riquadro dice il suo stato

- **Tipo**: difetto visivo trovato guardando uno screenshot, chiuso in `shared/`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `9b3dfb6`

## Da dove è partita

Era rimasto un caso rosso dal banco del contrasto: in Terra una pastiglia
marcata «danger» veniva dipinta **verde**, a 1,64:1, dentro la nota che avvisa
del rischio di superare il volume autorizzato. Tre tentativi di indovinarlo
leggendo il codice sono falliti; l'ha detto il motore, interrogato con CDP
(`CSS.getMatchedStylesForNode`): vinceva `.note.recap b`, che è (0,2,1) e batte
`.badge.danger` (0,2,0).

Poi, **guardando lo screenshot della correzione**, è saltato fuori il secondo
difetto: la striscia a sinistra della stessa nota era verde anche lei. Il codice
marcava la nota `err` di proposito — il commento accanto dice «la striscia dice
già tutto» — ma `.note.recap` era scritta due righe più sotto di `.note.err`, e
a parità di specificità vince l'ultima.

## Cosa è stato fatto

1. `.note b` e `.note.recap b` ora portano `:not(.badge)`. Una pastiglia dentro
   una nota resta un `<b>`, ma il colore di una pastiglia è il suo **stato**: la
   nota non ha voce in capitolo su di lei.
2. Le regole di stato (`err`, `avviso`, `ok`) vivevano in **quattro app con tre
   grafie diverse**. Adesso stanno in `shared/dw-app-ui.css` una volta sola, e le
   due metà passano da due strade diverse: la **decorazione** (`recap`, `esito`,
   `eco`, `norma`) tinge la variabile `--note-bar`, lo **stato** dipinge il bordo
   direttamente. Così lo stato vince sempre — non perché sta più in basso.

## La prova

`apps/deepwork-id/tests/browser/note-stato.mjs`: monta sulla pagina vera, con i
fogli veri nel loro ordine vero, le **otto combinazioni** che il programma genera
davvero, e chiede al motore che colore ha la striscia. Non legge il CSS: legge il
risultato — come `unita-maiuscole.mjs`, e per la stessa ragione (qui nessuna riga
di codice è sbagliata; sbagliato è l'incontro).

**Controprova**: rimesso il difetto con le sue stesse parole, cadono **14
combinazioni su 48**, in tutte e sei le app. Senza quel passaggio non si saprebbe
se il banco stia guardando dove crede.

## Un effetto collaterale che vale la pena raccontare

Aggiungendo `.note.avviso` a `shared/`, una controprova di `run-stile.mjs` ha
smesso di fallire: usava proprio «avviso» come esempio di parola **mai
definita**, ed è diventata una regola vera. Una controprova che dipende da una
parola del prodotto scade quando il prodotto cresce — ora usa una parola
inventata.

## Prossimo passo atomico

Sono già partite altre due unità (l'ora fra le unità di misura e la copertura dei
banchi): il loro checkpoint è il prossimo. Dopo, **la seconda iterazione della
vetrina**: rimetterla accanto al core e alle migliori pagine di categoria e
correggere dove la nostra è più povera — è la terza iterazione richiesta dalla
regola dell'eccellenza, e la vetrina ne ha viste due.

## Bloccanti

- Nessuno.
