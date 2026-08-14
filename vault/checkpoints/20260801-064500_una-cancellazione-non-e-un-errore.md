# Checkpoint — una cancellazione riuscita non è un errore

- **Tipo**: una unità nata da una sonda rifatta bene
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Come è saltata fuori

Avevo dichiarato insufficiente la prima sonda sugli errori (afferrava la prima
stringa di `esito(...)` anche quando il `"err"` stava su un ramo diverso). L'ho
rifatta contando gli **argomenti** della chiamata invece dei caratteri — e ha
trovato una cosa che non stavo cercando: fra i messaggi d'**errore** c'erano
frasi come *«Cliente eliminato»* e *«Prodotto eliminato dal listino»*.

Non erano falsi positivi. Erano davvero segnati `"err"`: **nota rossa e toast
d'errore per un'azione che l'utente aveva chiesto e che è andata a buon fine.**
Cioè l'app che dà dell'incapace a chi ha fatto la cosa giusta — proprio mentre
la ricerca sul valore dice che un messaggio non deve mai lasciare all'utente
l'impressione di aver sbagliato lui.

## Come ho deciso, invece di scegliere a gusto

Ho guardato il **riferimento**: il core usa `success` per **ogni** eliminazione
riuscita, senza eccezioni. Le app divergevano, e la direttiva sullo stile dice
che i comportamenti d'interazione si copiano dal core *pelo per pelo*.

**Quattordici** messaggi corretti: nove in Scudo, cinque in Conti. La ragione è
scritta una volta per app, non quattordici.

## Il valore della sonda rifatta

La prima versione avrebbe fatto **due** danni: segnalare 72 messaggi da
riscrivere (molti dei quali vanno benissimo) e **non far vedere** questi
quattordici, perché li avrebbe seppelliti nel rumore. Rifarla non è stato un
lusso: è stato ciò che ha reso visibile il difetto vero.

## Onestà sul metodo

Avevo scritto che il giro a quindici banchi andava lanciato **e lasciato in
pace**, e poi ho toccato due pagine mentre girava. Le modifiche sono stringhe di
messaggio e non toccano nulla di ciò che i banchi guardano (interi, contrasto,
unità, fuori schermo, id, bersagli) — ma la regola l'avevo scritta io, e vale
comunque: **la prossima volta si aspetta.**

## Prossimo passo atomico

Leggere il riepilogo del giro a quindici banchi (in corso). Poi rifare il conto
degli errori «che dicono cosa fare» con la sonda buona, che adesso c'è, e
decidere se ne esce un'unità — senza riscrivere messaggi che vanno già bene.

## Bloccanti

- Nessuno.
