# Checkpoint — 2026-09-15T15:01:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
dadd7905

## Cosa è stato completato
Ventesima unità del ciclo odierno: riverificata di persona (WebSearch
diretta sulla fonte primaria, non sulla parola dell'agente) la proposta
della ricerca continua sul D.Lgs 624/96 scritta poco prima in
`docs/RICERCA_CONTINUA_NORME.md`. Confermato: l'art. 6 distingue
un'ATTESTAZIONE annuale (comma 2) da una REVISIONE dovuta solo dopo
modifiche/incidenti significativi (comma 3).

`MOTIVI_REVISIONE_DSS` chiamava la certificazione annuale «Revisione
periodica» — la stessa parola dei due motivi che davvero cambiano il
documento — mentre il suo `riferimento` accanto era già corretto. Corretta
l'etichetta a «Certificazione annuale» (stesso termine già usato in
`SCADENZE_PRESET.dss-certif`), aggiornati i riferimenti per citare il
comma giusto. **Non toccata** la periodicità di 12 mesi né il semaforo del
ciclo (`cicloDss`): la norma conferma che l'evento annuale è dovuto, non
ne contesta la cadenza — questa è una correzione di terminologia, non di
comportamento. Aggiornato anche il messaggio d'errore del form in
index.html.

Test: 1 blocco esistente esteso con 3 nuove asserzioni, controprova
verificata (vecchia etichetta rimessa, confermata la caduta, ripristinato
byte-identico). `run-kpi` invariato a 3019 (assert aggiunti dentro un test
esistente). La cascata dei documenti ha comunque richiesto un
aggiornamento: il conto grezzo "asserzioni eseguite dal giro" è per sua
natura instabile ed è salito da solo 3.926→3.969 fra un giro e l'altro,
corretto in `docs/DEVELOPMENT.md`/`docs/STATO_PRODOTTO.md`.

## Verifica
- `run-kpi.mjs`: 3019 passati, 0 falliti
- `run-stile.mjs`: 328 passati, 0 falliti
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, copertura 1012/1012
- Giro isolato su worktree (due passate, entrambe rimosse): la prima
  40/40 comandi a posto (nessuna caduta stavolta — il fix non tocca il
  conteggio del `run-kpi`), con la sola cascata dei numeri grezzi del
  giro da correggere fuori dal giro stesso; la seconda, dopo la
  correzione, 43/0 su `numeri-nei-documenti.mjs`
- Push riuscito al primo tentativo: `e6c9121a..dadd7905`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. La ricerca sul D.Lgs 624/96 è ora
chiusa sulla parte azionabile senza il fondatore (la correzione
terminologica); le altre due proposte della stessa ricerca (rinominare/
chiarire ulteriormente il form, e valutare se il semaforo `dss-certif`
debba smettere di segnare "scaduto" a 13 mesi) toccano il COMPORTAMENTO
di come Scudo segnala la conformità — non decise qui, restano candidate
per un'unità futura con più cautela (screenshot prima/dopo).

## Prossimo passo atomico
Il ciclo prosegue: nessuna unità specifica è già in coda con priorità
assoluta. Candidati, in ordine di prontezza (direttiva 5: più cantieri
aperti insieme su app diverse):
1. **Leggere il report completo della ricerca in background su Genesi**
   se ancora non lanciata quest'oggi — non risulta lanciata in questa
   sessione: valutare se aprirne una nuova (Genesi non ha avuto un
   secondo passaggio approfondito in questo ciclo) mentre si lavora su
   altro in primo piano.
2. **Seconda iterazione estetica/UX** di un'app già spedita, seguendo il
   metodo del confronto affiancato (regola vincolante «l'eccellenza è lo
   standard»).
3. Valutare se il semaforo `dss-certif` di Scudo (13 mesi → scaduto)
   debba diventare un promemoria neutro invece che un allarme rosso,
   dato che la norma non fissa quella soglia — ma solo dopo aver
   misurato con screenshot prima/dopo, perché tocca la conformità
   mostrata all'ispettore.
Il ciclo continua senza fermarsi (regola del fondatore, mai in pausa).
