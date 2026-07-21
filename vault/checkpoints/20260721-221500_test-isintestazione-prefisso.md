# Checkpoint — 2026-07-21T22:15:00Z

## Tipo
unit-complete (test — edge di isIntestazione su keyword-prefisso)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test prefisso isIntestazione)

## Completato
Test di regressione su una proprietà di correttezza dell'helper condiviso
`isIntestazione` (introdotto in #283): una keyword che è PREFISSO di un nome
di colonna più lungo NON deve essere scambiata per intestazione — serve il
delimitatore SUBITO dopo il nome. Es.: header keyword "data" NON deve
riconoscere come intestazione una riga/colonna "dataInizio;...", né "nome"
deve matchare "nominativo;...". Senza questa garanzia, una riga di dati il cui
primo campo inizia con la parola-chiave verrebbe erroneamente scartata.
- `run-helpers.mjs`: +1 test (3 asserzioni: dataInizio/nominativo negativi,
  data esatto positivo). Helper 42→43; CI 313→314.

Verifica: helpers 43/0.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. In background è in corso una revisione
approfondita del core index.html (fallback #6): agire sui suoi eventuali
finding reali come prossima unità.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile/prodotto: fondatore.
SdI / telematics live / ciclo chiuso / Genesi motore / soglie di legge: gated.
