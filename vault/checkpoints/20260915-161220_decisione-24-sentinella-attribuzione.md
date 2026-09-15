# Checkpoint — 2026-09-15T16:12:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9c361ee2

## Cosa è stato completato
Venticinquesima unità del ciclo odierno: riverificata di persona la
ricerca del settimo giro su Sentinella (attribuzione delle modifiche —
chi ha corretto una lettura o cambiato una soglia, non solo quando).

Trovato e corretto un errore minore: la ricerca citava `statoDiFatto`
come una funzione con `chi` nella firma — non esiste nessuna funzione
con quel nome. `statoDiFatto` è un campo del ricettore, il cui `chi` è
già scritto e persistito, ma è **chi ha segnalato** (il ricettore), non
l'operatore interno — stessa distinzione per il `chi` dei reclami. La
correzione non cambia il verdetto: nessuna funzione traccia l'operatore
INTERNO che modifica un dato (`correggiLettura`/`annullaLettura`
confermate senza parametro utente, con grep).

Scritta la decisione 24 in `docs/DECISIONI_WEEKEND.md`: non implementata
di iniziativa perché (a) è un giudizio su una persona reale in un
contesto potenzialmente legale, e (b) — la ragione più forte — nessun'altra
app di questo ecosistema legge oggi l'identità dell'operatore collegato
per scriverla nei dati (verificato con grep sull'intero shared/ e su
Scudo): sarebbe la prima volta, e il meccanismo giusto probabilmente vive
in `shared/`, non dentro Sentinella sola. Tre strade proposte con la
domanda su dove vive il meccanismo.

## Verifica
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (nessun codice
  toccato in questa unità, solo documenti)
- Push riuscito al primo tentativo: `880d5eb7..9c361ee2`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Il settimo giro di ricerca su
Sentinella è chiuso: la sua unica lacuna confermata è ora una decisione
scritta (24), non un'unità di codice in sospeso. Restano aperte in
`DECISIONI_WEEKEND.md` le decisioni 1, 4, 7, 9 (bloccate per regola o
per dato del fondatore), la 5b coda offline, la 19 (ricettore), la 20
(fine abbonamento), la 21 (Conti debiti), la 22 (Scudo INAIL), la 23
(Conti scoring), e ora la 24 (Sentinella attribuzione).

## Prossimo passo atomico
Il ciclo prosegue (direttiva 5: più cantieri insieme su app diverse).
Con Scudo, Conti e Sentinella tutti chiusi su ciò che si può fare senza
il fondatore, i candidati più pronti sono:
1. **Nuovo giro di ricerca in background** su Campo, Terra o Flotta
   (secondo passaggio più approfondito, stesso schema usato oggi su
   Scudo/Sentinella) — nessuna delle tre ha ancora avuto un secondo
   passaggio in questo ciclo.
2. **Seconda iterazione estetica/UX** con confronto affiancato su
   un'app diversa da Scudo/Sentinella (già toccate oggi).
3. G9 di Genesi (rifiniture di scena 3D, proposta 3 — annotazione
   on-hover) resta un candidato verificato, non preso per il rischio di
   un'area 3D non familiare: valutare se affrontarlo con tempo dedicato
   alla verifica visiva.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
