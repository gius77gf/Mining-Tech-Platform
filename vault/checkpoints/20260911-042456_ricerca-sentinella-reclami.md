# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f8428050

## Completato
Unità 71 — ricerca a rotazione su Sentinella (il registro dei reclami):
metà sul mondo con WebSearch, delta dal meccanismo verificato contro il
commit, due voci aperte in roadmap con la prova accanto.

## Imparato
- Una promessa scritta in uno stato vuoto è un requisito: «con accanto le
  misure di quel giorno» stava nella pagina da mesi senza nessuna funzione
  dietro. Gli stati vuoti vanno letti come specifiche, non come decorazione.
- Il delta si fa aprendo le funzioni (`renderReclami`, `riepilogoReclami`,
  `fogliaVolata`), non cercando la parola della ricerca: «complaint
  correlation» in casa si chiama «le misure di quel giorno».

## Prossimo passo atomico
La voce aperta «SENTINELLA — LE MISURE DI QUEL GIORNO ACCANTO AL RECLAMO»:
`misureDelGiornoPerReclamo(reclamo, ricettore, monitoraggi)` pura in
`sentinella-data.js` (letture del giorno sui punti con la stessa grandezza
del ricettore, verdetto con `statoMisura`, «nessuna lettura quel giorno»),
prove in run-kpi, la riga di `renderReclami` che la stampa, scatto guardato.
In alternativa l'undicesima tranche B3 su Genesi.

## Blocchi
Nessuno.
