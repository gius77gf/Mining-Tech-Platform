# Checkpoint — 2026-09-04T13:36:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3d3fb620 — Conti: la riga della fattura elettronica torna con sé stessa; decimali di riga

## Completato
Delta della ricerca sulla fattura elettronica dal meccanismo (nove domande,
in fondo a `docs/RICERCA_CONTINUA_CONTI.md`) e le due cose che ne uscivano
vere: la quadratura di riga (prima nessuno la controllava) e i decimali di
quantità/prezzo (2..8 invece di 2 fissi). run-kpi 2547, banco XML 17/0 nei
due versi, giro node 38/0. Albero pulito.

## Prossimo passo atomico
Tre cantieri paralleli appena lanciati: Sentinella (numerone troncato a 320
e tabella che scorre nella scheda del punto), Flotta (l'evento «contatore
azzerato / sostituito»), ricerca Terra (i moduli regionali della denuncia
annuale, metà sul mondo). In casa: il candidato (c) di Conti — l'unità di
misura sconosciuta nell'XML dichiarata invece di «TN» — poi raccogliere i
cantieri uno per uno (rimisurare, copia + giro node, commit, documenti).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-25, Q1; registro
esplosivi; TD24 / codice IPA / split payment (col commercialista).
