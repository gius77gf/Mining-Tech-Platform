# Checkpoint — la regola che vietava i dialoghi non stava guardando

- **Tipo**: due unità (la nota del modo; il tokenizzatore e la controprova a tappeto)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `aabcad4` (le pagine), `0b2edc4` (i controlli)

## Come è saltata fuori

Cercavo tutt'altro: volevo contare quanti messaggi d'errore dicono **cosa
fare**. La sonda che avevo, per riconoscere gli argomenti di `esito(...)`,
contava le parentesi — e su un template **annidato** andava fuori fase,
inventando un quarto argomento che non c'era.

Ho controllato una delle sei segnalazioni leggendo il codice vero: erano tutte
false. E allora la domanda si è spostata dalla mia sonda ai **tokenizzatori
della suite**, che sono scritti nello stesso modo.

## Il buco, misurato

`mascheraCodice` e `senzaCommenti`, entrati in un backtick, correvano fino al
backtick **successivo**. Due danni:

1. il contenuto di `${...}` finiva marcato come stringa — ma lì dentro c'è
   **codice**: `${prompt('quanti?')}` è una chiamata, e la regola 1 non la vedeva;
2. col template annidato, il backtick che **apre** quello interno veniva preso
   per quello che **chiude** l'esterno. Da lì bastava un apostrofo — «l'ora»,
   «un'altra» — per aprire una stringa che correva in avanti masticando codice.

Rimettendo `window.prompt()` dove riprende il codice: **764 iniezioni su 1030
non venivano viste**, 31 punti su 37 nel solo core.

## La parte che conta davvero

La controprova c'**era già**, e passava. Guardava **tre superfici a un punto
ciascuna**, e nessuno di quei tre punti cadeva dove la scansione si perdeva.

Non è il difetto «il controllo non sa fallire» raccolto a luglio: questo
controllo sapeva fallire benissimo — in un punto su mille. **Una controprova va
misurata anche nella sua copertura, non solo nel suo esito.** È la lezione
nuova, ed è in `CLAUDE.md`.

Adesso la controprova è a tappeto (1030 iniezioni, e il numero si stampa), e ha
accanto una *controprova della controprova*: la scansione ingenua è tenuta apposta
nel file, e se con quella non sfuggisse niente vorrebbe dire che la prova non
sta misurando nulla.

## L'altra unità

`mode-note` — la nota che dice se si lavora sui dati veri — era usata da tre app
come lavagna per gli esiti: nove scritture, e dal primo export la conferma non
tornava più. Adesso ogni comando ha la sua nota (`rap-esito`, `rep-esito`,
`reg-esito`).

**Onestà sulla gravità**: la mia prima lettura era sbagliata in peggio. Avevo
scritto che spariva l'avviso «stai guardando dati di esempio». Non è vero:
quello è `tour-banner`, sta in cima, vive fuori dalle pagine e nessuno lo tocca.
Spariva la conferma del modo *live*, che vale meno. Ho corretto il commento
della regola prima di consegnarla: un test che racconta male la propria ragione
fa perdere tempo alla sessione dopo.

## Stato

- **171** prove di stile (erano 149), **433** KPI, 43 helper, 23 pointcloud,
  9 manifest, 7 demo — tutte verdi
- **15 banchi del browser** girati per intero: 15 a posto, 0 da guardare
- **14 regole** di stile verificabili (erano 13)

## Prossimo passo atomico

Il conto dei messaggi d'errore «che dicono cosa fare» è ancora **da rifare con
il tokenizzatore giusto**: i due numeri prodotti finora (72, poi 62) sono
entrambi da buttare, il primo perché la sonda prendeva troppo, il secondo perché
l'elenco di parole non riconosce le forme con il pronome attaccato
(*aggiungila*, *correggila*, *confermala*, *registrane*) e ne ha classificati
male almeno 26. Rifarlo leggendo i **137** messaggi veri, e decidere se ne esce
un'unità — senza riscrivere quelli che vanno già bene.

## Bloccanti

- Nessuno.
