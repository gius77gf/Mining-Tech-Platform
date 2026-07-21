# Checkpoint — 2026-07-21T10:30:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra andamento volumi)

## Completato
Terra — **andamento volumi** (ultimo rilievo elaborato vs precedente): dice a
colpo d'occhio se l'estrazione accelera o rallenta, utile per capire se si è
"in pari" col piano.
- terra-data.js: `trendVolumi(rilievi)` — ultimi due rilievi elaborati per data;
  ritorna {ultimo, precedente, delta, pct} o null se meno di due. Pura.
- index.html: nota "Andamento" sopra la lista rilievi con badge in aumento/calo.
- run-kpi.mjs: +2 test. KPI 126→128; totale CI 245→247.
Verifica: KPI 128/0, syntax OK, Playwright ("ultimo rilievo 19.400 m³, +800 m³
(+4%) in aumento", nessun errore).

## Stato roadmap
6 app verticali robuste + 4 review adversarial (11 bug reali, 2 sicurezza ALTI)
+ Terra andamento volumi + Conti previsione incassi + Scudo preset HSE + suite
247 + doc fondatore.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI: altre
seconde iterazioni UX, nuove ricerche/programmi, o un'altra review adversarial
(es. core index.html o i data layer live/demo).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
