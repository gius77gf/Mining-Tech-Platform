# Checkpoint — 2026-07-24T07:00:00Z

## Tipo
unit-complete (scienza Genesi — airblast verificato in struttura)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — GENESI_FONTI_SCIENTIFICHE.md)

## Completato
Verificato l'airblast di Genesi contro RI 8485 (Siskind/Stachura/Stagg/Kopp 1980):
scaling cubico ✓, pendenza −24 dB/decade (esponente −1,2 USBM) ✓, limite 133 dB(L)
= standard OSM per sistemi 2 Hz (scala completa 134/133/129) ✓. Resta [NV] la sola
intercetta 172 (plausibile; il codice già la dichiara "stima da calibrare").
Con questo, TUTTE le aree di sicurezza di Genesi (vibrazioni, flyrock, airblast)
sono verificate contro la letteratura.

## Prossimo passo atomico
**Calcolatore volume-dal-ritaglio** (proposta Terra, parte NON gated): funzione pura
`volumeCumulo(pos)` in pointcloud.js (griglia 2D + integrazione sopra piano base) +
test CI + riga di volume nel riquadro ritaglio del POC (sola visualizzazione, zero
modello dati). Serve alla prova drone del weekend. Poi stasera: revisione + chiusura
settimana.

## Blocchi
Gates invariati (punto 9, estetica, drone, #321).
