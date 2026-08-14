# Checkpoint — una misura che non è abbastanza buona per agirci

- **Tipo**: misura preparatoria, dichiarata insufficiente
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Cosa ho provato a misurare

Il **secondo** dei «dieci dettagli che fanno sembrare il prodotto curato»
(`docs/RICERCA_VALORE_PRODOTTO_202607.md`): *«gli errori dicono cosa fare, non
cosa è successo»*. La domanda giusta è: quanti messaggi d'errore delle sei app
rispondono a **«e adesso?»**.

## Il numero, e perché non lo uso

Prima lettura: **120 messaggi, 48 che dicono anche cosa fare, 72 no**.

Ma guardando gli esempi, la sonda **prende troppo**: fra i «72» ci sono
frammenti che non sono messaggi d'errore affatto — «Incasso del », «Import
squadre: …», pezzi di stringhe composte a pezzi. La mia espressione afferra la
prima stringa di `esito(...)` anche quando il `"err"` sta molto più in là, su un
ramo diverso.

**Quindi il 72 è un limite superiore, non un conteggio.** Agire su un numero
così vorrebbe dire riscrivere messaggi che vanno già bene e mancarne altri.

## Perché lo scrivo invece di rifarlo subito

Perché è la stessa forma di difetto raccolta oggi tre volte in `CLAUDE.md` — *il
controllo che non guarda dove crede* — e questa volta l'ho vista **prima** di
costruirci sopra. Una misura sbagliata che genera lavoro è peggio di nessuna
misura: il lavoro sembra fatto.

**La sonda giusta** deve legare il testo al **ramo** in cui compare, non alla
distanza fra due stringhe: si guarda l'espressione `esito(id, TESTO, "err")` con
un vero riconoscimento degli argomenti, non con una finestra di caratteri.

## Prossimo passo atomico

Rifare la sonda contando gli **argomenti** invece dei caratteri, e solo dopo
decidere se c'è un'unità. E prima ancora: leggere il riepilogo del giro a
**quindici banchi**, lanciato e lasciato in pace.

## Bloccanti

- Nessuno.
