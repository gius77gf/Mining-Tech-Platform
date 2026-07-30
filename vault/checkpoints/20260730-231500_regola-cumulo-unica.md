# Checkpoint — 30/07/2026 23:15 UTC

## Task completato
**L'ultima copia conosciuta della regola del cumulo, e un controllo perché non ne
nascano altre.**

| Commit | Cosa |
|---|---|
| `401f3eb` | Conti passa da `provenienzaDi`; regola 7 in CI |

## Il verso, guardato prima di toccare
`eCumulo` in `conti-data.js` era una copia privata della regola che decide se un
rilievo è **scavo** o **ripresa da cumulo**, con un commento che dichiarava di
essere «la stessa regola di Terra» — una divergenza in attesa di succedere.

Qui sbagliare è grosso **e silenzioso**: `eCumulo` vero vuol dire cumulo, cioè
materiale già estratto che **non** consuma il volume concesso. Invertirlo per
sbaglio farebbe consumare la concessione a roccia tolta anni fa, e non lo
segnalerebbe niente: nessun errore, nessun test rosso, solo un numero sbagliato
in un documento che va all'ente. Il punto d'uso era **uno solo** — verificato
prima di scrivere, non dopo — e l'avvertimento è ora scritto accanto al codice.

## La regola 7 cercava la cosa sbagliata
Prima versione: «vietato confrontare con "cumulo"». Ha segnalato **tre punti
perfettamente legittimi**, fra cui `soloCumulo` di Terra e la riga che avevo
appena scritto io in Conti. Perché `provenienzaDi(r) === "cumulo"` è l'uso normale
e inevitabile della funzione condivisa.

Peggio: nel controllo-del-controllo avevo **asseritο quell'errore come una
feature** («e la regola vede anche il confronto sul risultato della funzione
condivisa»). Se non avessi fatto girare la regola sui file veri, avrei consegnato
un controllo che vieta l'uso corretto.

Quello che va vietato è **ricavare la provenienza dal record grezzo**: leggere
`.provenienza` e deciderne il significato in casa, che è esattamente com'erano
nate le due copie. La regola guarda quel gesto, nel codice vivo, e distingue
quattro casi che restano permessi: confrontare il risultato della funzione
condivisa, passarle il campo grezzo per farselo normalizzare, scrivere il campo,
e raccontare la cosa in un commento. Controprova sul file vero: rimettendo il
`conti-data.js` di un'ora prima, la regola lo indica per nome alla riga 1159.

## Stato
Suite: **72 stile** (la settimana è cominciata con 2 regole, oggi sono 7),
**288 KPI**, 7 demo, 43 helper, 23 pointcloud, 9 manifest. Tutte verdi.

## Prossimo passo atomico
**Il grafico che manca alla sezione dei turni di Terra: dichiarato contro
misurato, intervallo per intervallo.** Oggi il confronto si vede un periodo alla
volta, dalla tendina, e la domanda che conta — «le stime dei turni stanno
migliorando o peggiorando?» — non ha risposta: bisognerebbe cambiare tendina
quattro volte e ricordare i numeri a memoria.

Il motore condiviso `shared/dw-grafici.js` c'è già e `intervalliFraRilievi` dà
esattamente le colonne. Due decisioni da prendere con la testa, non per abitudine:
1. **quale forma.** Barre appaiate (misurato accanto a dichiarato) oppure una
   linea dello scostamento in %? La seconda è più compatta ma nasconde la scala:
   un 10% su 500 m³ e un 10% su 20.000 m³ sono cose diverse. Le regole già scritte
   in `docs/` vietano i due assi verticali, che era la terza strada;
2. **i periodi senza dati non si disegnano a zero** — regola già stabilita per gli
   altri grafici: dove i turni non hanno dichiarato niente resta un buco, contato
   a parole, perché uno zero disegnato sembra una produzione nulla invece di
   un'assenza di informazione.
Poi provarlo a 390 px e **guardare** lo screenshot: sui grafici è dove sono usciti
i difetti peggiori (un grafico gonfiato del 250% su schermo grande, le unità in
maiuscolo).

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), e i tre punti che aspettano il fondatore — progetto Firebase (10
minuti), permessi per ruolo, blocco del turno chiuso lato server.
