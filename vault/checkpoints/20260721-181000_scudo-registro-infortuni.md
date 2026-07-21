# Checkpoint — 2026-07-21T18:10:00Z

## Tipo
unit-complete (feature — Scudo, completamento HSE)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo registro infortuni e near-miss)

## Completato
Nuova capacità HSE per Scudo: **registro infortuni e near-miss** con la metrica
di testa del cartellone sicurezza, i **giorni senza infortuni**.
- `scudo-data.js`: nuova collezione `infortuni` (sotto apps/scudo/, coperta
  dalla regola generica orgCollection — nessuna modifica alle rules, nessun
  gate). Helper puro `riepilogoInfortuni(infortuni, oggi)`: giorni dall'ultimo
  infortunio VERO (i near-miss NON azzerano il contatore ma si contano a parte),
  numero infortuni/di cui gravi/near-miss, giorni di assenza totali. giorniSenza
  null se non c'è nessun infortunio (no falso zero). API live+demo estese con
  `infortuni`. DEMO con 2 eventi realistici.
- `index.html`: banner "🦺 X giorni senza infortuni" sul Quadro (verde ≥30 gg,
  giallo sotto) + sezione "Infortuni e near-miss" nella pagina Documenti
  (riepilogo, lista con badge tipo/gravità/assenza e rimozione, form di
  registrazione data/tipo/gravità/giorni/descrizione). Tutti i campi utente
  escapati.
- `run-kpi.mjs`: +2 test (giorni senza infortuni ~168 con near-miss escluso,
  conteggi/assenza; null senza infortuni veri). `run-demo.mjs`: integrità
  DEMO.infortuni. KPI 161→163; CI 294→296.
Verifica: KPI 163/0, demo 7/0, syntax OK; Playwright — banner "168 giorni",
riepilogo corretto, form: registrato un infortunio di oggi → banner a "0 giorni",
lista a 3 eventi; nessun errore.

## Stato roadmap
6 app verticali; Scudo ora copre anche il registro infortuni (HSE completo lato
adempimenti + eventi). Suite 296.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
