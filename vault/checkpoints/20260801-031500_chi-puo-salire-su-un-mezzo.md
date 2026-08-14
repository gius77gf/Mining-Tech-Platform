# Checkpoint — chi può salire su un mezzo

- **Tipo**: unità (5 prove su `statoRequisito`, mai provata)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `f7ea6a3`

## Cosa decide questa funzione

`statoRequisito` legge, dalle scadenze di una persona, se un requisito — visita
medica, formazione, abilitazione — è coperto. Da lì esce **chi risulta idoneo a
lavorare**. Non era nominata in nessuna prova.

## I due comportamenti bloccati, e perché proprio quelli

**1. Nessuna riga in scadenzario deve dare «mancante», non «regolare».**
L'assenza di un documento non è una conferma che va tutto bene. È la differenza
fra «non ho la visita medica di Rossi» e «Rossi è a posto», e un'app che le
confonde manda una persona su un mezzo senza titolo.

**2. Con più rinnovi vale l'ULTIMO.** Il caso vero: visita del 2025, rinnovata
nel 2027. Rimettendo il difetto (prendere la prima riga trovata invece della più
lontana) la prova fallisce con **«atteso regolare, ottenuto scaduta»** — cioè
una persona **in regola** risulterebbe scaduta e resterebbe a terra per niente.
Un difetto che costa una giornata di lavoro a qualcuno e non produce nessun
errore.

**3.** In più, il riconoscimento **per descrizione** e non solo per chiave
interna: chi carica lo scadenzario da CSV scrive «Visita medica», non
`visita-medica`. Se valesse solo la chiave, ogni requisito importato da file
risulterebbe mancante — e l'import da CSV è la strada del primo giorno di un
cliente nuovo.

## Stato

- **471** KPI (433 all'inizio della giornata), 177 stile, 43 helper, 23
  pointcloud, 9 manifest, 7 demo → **730** prove `node`, tutte verdi
- 38 prove nuove oggi su funzioni che **nessuna suite nominava**, ognuna vista
  fallire col difetto rimesso
- giro a 19 banchi del browser: in corso, al secondo banco

## Prossimo passo atomico

Leggere il riepilogo del giro a 19 banchi appena arriva. Poi continuare la
copertura per priorità di danno: `reportConformita` di Sentinella — è il
documento che il cliente consegna davvero all'ente, ed è la prova più delicata
delle rimaste, perché prima va capito bene **cosa promette** — poi
`lavoratoriScoperti` di Scudo e `coperturaControlli` di Flotta.

## Bloccanti

- Nessuno.
