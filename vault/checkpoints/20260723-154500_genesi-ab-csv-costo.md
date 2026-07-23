# Checkpoint — 2026-07-23T15:45:00Z

## Tipo
unit-complete (revisione qualità Genesi #321 + fix di coerenza CSV A/B)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/genesi/genesi.html)

## Completato
Fallback #5 (revisione qualità) sulle aggiunte #321 di Genesi (costi, decking, import
XML, riconciliazione da misure), via subagent con tracciamento riga-per-riga.
- **ESITO: nessun bug pericoloso** (numeri sbagliati/insicuri). Verificati corretti:
  coerenza unità dei costi (m×€/m, kg×€/kg, fori×€/foro), divisioni protette, guardia
  del decking (il gap non può andare negativo, i segmenti SVG sommano a _Ltot),
  whitelist XML non aggirabile, interpolazione x50 senza denominatore zero. Buona
  conferma di solidità.
- **Un'incoerenza minore corretta**: l'export CSV del confronto A/B (`cmpExport`)
  ometteva la riga del **costo** che invece compare sia a schermo (`cmpRender`) sia nel
  CSV della singola volata. Aggiunta `['Costo totale stima (EUR)',A.kpi.cost||0,...]`
  in coda all'array, con la stessa etichetta del CSV singolo. Ora il file esportato
  del confronto combacia con ciò che vedi.

## Verifica
Syntax OK. Il percorso dati è già provato (il confronto a schermo usa A.kpi.cost dalla
stessa `computeKPI`); il fix aggiunge solo quella riga all'export. Guardia `||0` per i
progetti A/B salvati prima della feature costi.

## Prossimo passo atomico
Never-stop: rotazione fallback. Le aggiunte #321 sono ora riviste e coerenti. Gated:
passo 3 drone (dato reale), revisione estetica #321.

## Blocchi
Nessuno per questa unità.
