# Checkpoint — 2026-07-21T21:20:00Z

## Tipo
unit-complete (test — confini fasce aging incassi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test off-by-one aging incassi)

## Completato
Nuovo test di regressione sui CONFINI ESATTI delle fasce di aging incassi
(Conti): 30/31/60/61/90/91 giorni di ritardo. La logica è
`r<=30 → 1-30, r<=60 → 31-60, r<=90 → 61-90, else oltre 90`; un off-by-one qui
sposterebbe un credito nella fascia sbagliata (impatto su solleciti e priorità
di incasso). Le scadenze del test cadono a esattamente r giorni di ritardo
(verificato con la funzione reale `giorni`) e ogni fattura deve finire nella
fascia attesa: g1_30=1, g31_60=2, g61_90=2, oltre90=1.

KPI 172→173; CI 312→313. Suite verde (173/0).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: altri confini/edge
puri non coperti, oppure nuova unità UX/revisione.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
