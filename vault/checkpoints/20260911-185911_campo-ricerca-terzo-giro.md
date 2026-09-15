# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
98c9324f

## Completato
Unità 115 — ricerca a rotazione, terzo giro, Campo: «l'esplosivo in cava —
il registro, l'ordine di servizio e il dopo-sparo». Metà sul mondo di
seconda mano; delta dal meccanismo: la carica per foro c'è, l'avanzo reso
no; il registro dell'art. 55 è del deposito (decisione del fondatore); il
dopo-volata ha l'ora del rientro ma non quella dello sparo → voce aperta;
licenze e mina mancata a posto. Solo documenti.

## Imparato
- Un'ora registrata senza l'ora da cui contare è un dato che non giudica
  niente: «rientro alle 11:40» vale solo con «sparo alle 10:45» e con
  l'attesa dell'ordine di servizio accanto.
- Due numeri di attesa (60 dei fac-simili, 30 del D.P.R. 302 per la mina
  mancata) sono due casi diversi: si dichiarano tutt'e due, non se ne
  sceglie uno.

## Prossimo passo atomico
Unità 116, Sentinella (+ ponte per Campo): `oraSparo` e `rientroAutorizzatoDa`
sulla volata (form del dopo-volata, CSV delle volate, diario), l'attesa
minima dichiarata una volta per cava (`attesaDopoSparoMin`, dal proprio
ordine di servizio, senza numeri nostri) e `attesaDopoSparo(volata,
attesaMin)` → { stato: dopo-l-attesa | prima-dell-attesa | non-registrato |
attesa-non-dichiarata, minuti }, in `shared/dw-ponti.js` perché la legge
anche Campo (`righeVolateDelGiorno`); `kgResi` nel dopo-volata; prove in
run-kpi (prima in scratchpad), screenshot a 430 px. Prima: leggere il giro
del browser su `755ef985` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.
