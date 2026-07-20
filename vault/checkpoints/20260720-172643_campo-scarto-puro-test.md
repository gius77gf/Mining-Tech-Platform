# Checkpoint — 2026-07-20T17:26:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8a64456

## Completato
Punto 3 (ponte Genesi↔Campo) + punto 4 (test): estratta la matematica
dello scostamento progettato-vs-reale in campo-data.js come funzioni pure
scartoPct(reale,prog) e scartoLivello(reale,prog) (prima inline, non
testabili), usate da index.html (comportamento identico). 3 test sui
confini: 10%=ok, 25%=warn, oltre=danger; non registrato=da-registrare;
prog 0 senza crash. run-kpi 52/52; Playwright: carica 130 su 100 → badge
danger "130 kg (30%)", riepilogo 1/2. Suite 151→154; job CI aggiornato.

## Stato roadmap
Ponte Genesi→Campo verificato completo e ora con la sua matematica
blindata. Parità filtri completa (tutte le app + KPI→filtro Flotta).
Suite ~154. UX/sicurezza/test molto solidi.

## Prossimo passo atomico
Merge PR campo-scarto (dopo CI verde; job "...(154)"), riparti branch da
main. Prossimo candidato: (a) altri test sulle funzioni pure del bridge
o parsePianoCsv non ancora coperti (es. parse con separatore virgola? no,
il piano usa ';'); (b) revisione: verificare che il riepilogo piano-riep
non vada in NaN con piano vuoto (già guardato da if !PIANO.length) o con
prog somma 0 (parsePianoCsv garantisce prog>0, ok); (c) tornare al punto 1
per un'altra micro-UX. Scegliere UNA cosa piccola, verificare,
commit+checkpoint+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore
(docs/DECISIONI_WEEKEND.md).
