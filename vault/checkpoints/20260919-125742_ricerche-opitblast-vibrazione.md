# Checkpoint — 2026-09-19T12:57:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1cf0cbbf — docs(genesi): due ricerche in background + correzione di un falso "non c'è"

## Cosa è stato completato
Due ricerche Haiku in background chiuse, entrambe verificate col codice
prima di accettarne le conclusioni.

- [x] **Confronto con O-Pitblast**: confermata la parità già nota su
      vibrazione, frammentazione (Kuz-Ram), import topografia (LAS/OBJ).
      Confermate con grep proprio due mancanze vere (cloud sharing, app
      mobile).
- [x] ⛔ **Trovato e corretto un falso "non c'è"**: la ricerca dichiarava
      assente il confronto pianificato-vs-reale in tempo reale
      ("Analytics dashboard"), cercando il vocabolario inglese
      (planned/actual/varianza) invece del meccanismo. Verificato con
      `grep -n confrontoPerForo apps/genesi/genesi.html
      apps/genesi/genesi-data.js`: `confrontoPerForo`
      (genesi-data.js:758) + `_riconForiHtml` (genesi.html:4399) fanno
      esattamente questo, foro per foro, dal vivo, con badge a tre
      livelli — non solo un CSV come scritto. Ridimensionata la proposta
      di roadmap che si basava sulla premessa sbagliata: il delta vero è
      solo l'aggregato storico fra PIÙ volate, non costruito e non
      proposto (richiede prima una domanda di prodotto).
- [x] **QA sui calcoli di vibrazione/distanza di sicurezza** (PPV, soglie
      USBM/DIN): zero difetti trovati con riproduzione. Spot-check
      indipendente su `esitoPpv` (genesi-data.js:352-359) conferma che
      "nonConfrontabile" e "sotto soglia" restano stati distinti in tutta
      la catena — il caso più pericoloso per questa famiglia di codice
      (un "non lo so" mostrato come "va bene") non si presenta.

Nessuna modifica al codice: solo ricerca, in append.

## Verifica prima del commit
`numeri-nei-documenti.mjs`: 43/43 (il file di ricerca non è fra i quattro
tracciati numericamente, ma il controllo resta verde). Nessuna suite di
codice toccata.

## Stato roadmap
Con due ricerche di più chiuse (una azionata in parte con la correzione,
una senza azione perché il codice era già corretto), Genesi ha ora tre
fronti di ricerca esauriti in questo pivot: snap magnetico (→ G56),
Deswik.Blast (nessuna azione), O-Pitblast (una correzione documentale),
QA su G48-G56 (→ G56b), QA su vibrazione/PPV (nessuna azione). Tutte le
priorità del censimento CAD restano costruite o dichiarate.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo del
  browser (PID 18070, oltre 3 ore, ancora vivo) con `leggi-giro.mjs`
  appena arriva in fondo.
- Con tre concorrenti/aree ormai confrontati (Deswik, O-Pitblast,
  censimento CAD generale) e la QA su editor 2D + vibrazioni fatta,
  valutare un fronte diverso: o un quarto concorrente (JKSimBlast, Orica
  BlastIQ), o una QA sulla parte 3D/simulazione di Genesi (mai toccata
  finora), o iniziare a preparare (senza decidere) i dati per la
  Decisione #43 (blocchi/simboli) in modo che il fondatore abbia
  materiale pronto quando deciderà.
- Continuare a verificare ogni "non c'è" col meccanismo, non col nome —
  è la seconda volta in questa sessione che questo esatto errore produce
  un falso risultato (la prima: l'export DXF di G56/RICERCA_GENESI_CAD.md).

## Blocchi
Nessuno.
