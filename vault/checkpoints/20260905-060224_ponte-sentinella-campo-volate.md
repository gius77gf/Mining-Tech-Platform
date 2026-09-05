# Checkpoint — 2026-09-05T06:02:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7fd55081 — Il ponte Sentinella→Campo: le volate del giorno nella consegna di turno

## Completato
- Ponte P6 Sentinella→Campo: sezione «VOLATE DEL GIORNO (registro di
  Sentinella)» nella consegna di turno e nota `#turno-volate` sullo schermo,
  con tre risposte dichiarate (non leggibile / nessuna / righe con fronte,
  fori, chili, PPV e fonte). Nessun giudizio di conformità.
- Lo stato della volata e la PPV passano in `shared/dw-ponti.js` (+
  `riassuntoVolateDelGiorno`); Sentinella ri-esporta con identità provata.
- In Campo cinque copie dell'apertura dell'SDK diventano `apriApp`/`leggiApp`.
- Dimostrazione: le cinque volate di Sentinella copiate id per id (provato).
- run-kpi +4 (2634/0); banco consegna 21/0 in demo e «come live», controprova
  cade; giro `node` sulla copia verde, 3.546 asserzioni. Documenti 3.115 /
  810 / 226; mappa 13 ponti su 56, «app che nessuno legge» 1; roadmap chiusa.

## Prossimo passo atomico
La mappa dice ora «app che nessuno legge: Deepwork ID» (è l'identità, non
un'app di dati) e «sovrapposizioni non collegate: la 3e» (bloccata da §4/5b).
Prossima unità a costo basso: Sentinella, la stessa domanda in senso inverso —
il registro volate di Sentinella potrebbe mostrare accanto a una volata
eseguita la CARICA REALE del turno di Campo (il consuntivo, `pianocarico`)
quando il giorno coincide. PRIMA di scrivere: misurare con
`grep -n "kgTotali\|carica" apps/sentinella/sentinella-data.js | head` come
Sentinella usa i chili di una volata (kgTotali, kgMaxRitardo) e se la legge
di sito li prende da lì; poi decidere se il ponte ha valore (la PPV prevista
dipende dalla carica per ritardo, non dalla totale) — se non c'è un
meccanismo che ne beneficia, NON farlo e passare alla passata in profondità
di seconda iterazione su Flotta (docs/RICERCA_CONTINUA_FLOTTA.md, ultima
sezione), che ha voci aperte.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
