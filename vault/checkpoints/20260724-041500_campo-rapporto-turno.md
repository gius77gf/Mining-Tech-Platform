# Checkpoint — 2026-07-24T04:15:00Z

## Tipo
unit-complete (Campo — rapporto di fine turno stampabile)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/campo/index.html)

## Completato
Attuato il punto 1 della roadmap Campo (non-gated: zero modifiche ai dati, riusa
solo dati esistenti — stesso pattern del report di Genesi): pulsante "🖨 Rapporto
di fine turno" nella pagina rapportini → pagina stampabile con: KPI del quadro
(attività concluse/totale, anomalie aperte, squadre con rapportino), tabella
attività ordinata per criticità (anomalie in cima, con causale), fermi per
causale, rapportini (squadra/turno/produzione/consegne/stato+ora), squadre senza
rapportino, nota onesta ("registro operativo, non sostituisce i registri
obbligatori"). Tutto con esc() sui campi liberi. È il deliverable di fine turno
che i leader (GroundHog/ABB) mettono al centro.

## Verifica
Syntax OK. Browser: popup si apre, contiene Quadro/Attività/Fermi/Rapportini con i
dati demo (anomalia "Frantoio primario" in cima), screenshot pulito, zero errori.

## Prossimo passo atomico
Venerdì sera (~21:40): REVISIONE del giorno + CHIUSURA SETTIMANA (riassunto per la
revisione weekend). Prima, se c'è un altro ciclo: restanti [NV] minori scienza o
attesa input fondatore sui gates.

## Blocchi
Gates invariati: ppvLimit (punto 9), estetica IBL/HUD, durata fermi, drone, #321.
