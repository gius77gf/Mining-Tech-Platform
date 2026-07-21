# Checkpoint — 2026-07-22T00:00:00Z

## Tipo
unit-complete (feature Genesi — P0.1 riconciliazione previsto-vs-reale)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi: riconciliazione previsto/reale)

## Contesto
Direttiva del fondatore: Genesi deve raggiungere il livello dei rivali. Dalla
roadmap (GENESI_ROADMAP_COMPETITOR.md), il gap #1 è la RICONCILIAZIONE (come
Maptek BlastLogic): chiudere il cerchio confrontando il previsto col reale.
Implementato come P0.1 (lato browser, NON tocca il motore fisico).

## Completato
Nuovo pannello "🎯 Riconciliazione (previsto vs reale)" nella schermata design
(accanto al confronto A/B, stesso stile):
- Affianca il PREVISTO (X50, PPV, gittata flyrock — da computeKPI()) al REALE
  misurato inserito dal fochino, con SCOSTAMENTO colorato (verde <15%, giallo
  <35%, rosso oltre) aggiornato in tempo reale.
- Campi: X50 reale, PPV reale, flyrock reale, oversize %, nome/data, note.
- Salvataggio storico in localStorage (come A/B) + tabella storico + export CSV
  (con guardia CSV-injection). Input utente escapato (anti-XSS, funzione _rEsc
  aggiunta perché Genesi non aveva un esc).

Verifica: node --check del modulo OK; Playwright — modale mostra il previsto,
X50 reale 40 vs previsto 47 → scostamento "-7.0 cm (-15%)", salvataggio nello
storico ("Volata test"), export, nessun pageerror. Screenshot catturato.

## Prossimo passo atomico
Aprire PR (merge = deploy produzione Genesi). Prossime feature roadmap: P0.2
signature-hole, poi P1 (burden reale, boretrack, export). Oppure, per la
sequenza del fondatore, qualità delle altre app.

## Blocchi
Motore fisico Genesi: non toccare. Backend (P2): fase successiva. Core Fasi
3-4: gated.
