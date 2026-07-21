# Checkpoint — 2026-07-21T03:17:31Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Terra deplezione riserve)

## Completato
Terra — **deplezione delle riserve** (durata stimata della cava), la
"personalità" di Terra secondo la ricerca.
- terra-data.js: `riservaResidua(riserveM3, estrattoAnno, rateAnnuoM3)`
  → { residuo, anni } (null se niente riserva stimata; anni null se ritmo
  ignoto; residuo mai negativo).
- index.html: riga nel Piano estrattivo "Riserva residua stimata: X m³ ·
  durata ~Y anni al piano annuo di Z m³ (estratti W m³ nell'anno)".
- run-kpi.mjs: +2 test (residuo/anni; null-safety). Suite KPI 88→90;
  totale CI 198→200.
Verifica: KPI 90/0, syntax OK, screenshot (demo: 1.120.600 m³ residui,
~9 anni al piano di 125k m³). Coerente shell.

## Stato roadmap
Traguardo: **200 test** in CI. Serie amplissima di unità in-app isolate
completata (research + ~14 feature/rifiniture). Restano epiche M isolate
(Scudo matrice competenze, Campo rapportino turno, Flotta work order,
Conti solleciti a livelli) e i ponti/integrazioni (gated fondatore).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Prossima unità isolata a
scelta (a basso rischio, senza decisioni del fondatore): Conti — solleciti
a livelli, oppure una rifinitura per app. Continuare fino a esaurimento
crediti.

## Blocchi
Ciclo chiuso e integrazioni: gated (decisione fondatore, vedi vault
"Progetto — Ciclo chiuso"). Genesi frammentazione: gated (motore fisico).
