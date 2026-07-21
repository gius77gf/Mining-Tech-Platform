# Checkpoint — 2026-07-21T02:33:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Flotta)

## Completato
SESTA VOCE DEL BACKLOG "subito/S" (Roadmap di Visione):
Flotta — **scadenzario predittivo leggero** per i tagliandi a ore motore.
- flotta-data.js: `previsioneGiorni(mancanoOre, oreGiorno)` → stima i
  giorni al tagliando dal ritmo d'uso (0 se scaduto, null se ritmo ignoto).
- index.html: input "ritmo d'uso medio (ore/giorno)" nella pagina
  Manutenzioni; per ogni tagliando "a ore motore" mostra "≈ N gg (~data)"
  proiettando le ore mancanti; ricalcolo dal vivo.
- run-kpi.mjs: +2 test (stima con ceil; scaduto=0, ritmo 0/assente=null).
  Suite KPI 73→75; totale CI 183→185.
Verifica: KPI 75/0, syntax OK, screenshot (Tagliando 6000h su E1 →
≈17 gg a 8h/gg, ≈33 gg a 4h/gg). Coerente shell.

## Stato roadmap
Backlog Visione: 6 voci su 10 "subito/S" fatte (Sentinella soglie, Conti
aging, Scudo idoneità, Terra valore, Campo causali, Flotta previsione).
Restano: Genesi 2° modello frammentazione, Conti modulo gare, Sentinella
registro volate, Terra report qualità dato.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere la voce 7:
Genesi — secondo modello di frammentazione (KCO/Swebrec) selezionabile,
taglia S. NB: Genesi ha un motore fisico delicato — valutare bene dove
innestare il modello senza toccare il resto; se troppo invasivo, passare
alla voce 8 (Conti modulo gare, più isolata). Continuare fino a
esaurimento crediti.

## Blocchi
Nessuno. Le voci di integrazione (telematics, SdI, pesa, centraline)
restano gated per il fondatore.
