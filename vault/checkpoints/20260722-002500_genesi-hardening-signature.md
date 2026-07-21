# Checkpoint — 2026-07-22T00:25:00Z

## Tipo
unit-complete (revisione/hardening — feature Genesi appena in produzione)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — hardening signature-hole)

## Contesto
Nuovo ciclo. Dal checkpoint precedente il prossimo passo era Genesi P1 (burden
reale dal 3D). Valutato: il segno della deviazione del profilo fronte è
ambiguo dal solo codice, e un warning flyrock col segno sbagliato sarebbe
PERICOLOSO per il fochino → NON spedisco burden-reale senza certezza (serve
verifica geometrica col fondatore). Ho invece fatto la revisione di ciò che è
appena andato in produzione (fallback #5).

## Completato
Hardening delle due feature Genesi shippate (#300 riconciliazione, #302
signature-hole):
- `_sigDetTimes()`: guardia contro l'array vuoto (perRow/file forzati ≥1;
  fallback [0]) → evita `Math.max([])=-Infinity` e NaN nella superposizione se
  qualcuno azzera i fori.
- Signature-hole: nota di onestà sull'assunzione (ogni foro contribuisce con la
  stessa firma del foro registrato; per fori molto più lontani il composito è
  cautelativo).
- Verificate: riconciliazione (escape XSS su nome/note, delta con guardia
  divisione-per-zero) e signature-hole (numeri/SVG, nessun testo utente in
  innerHTML) → nessun buco.

Verifica: node --check OK; Playwright signature-hole → composito 12,39 mm/s,
nessun pageerror.

## Prossimo passo atomico
Aprire PR. Poi: burden-reale SOLO dopo aver chiarito col fondatore il segno
della deviazione fronte (o verificato live). Altrimenti proseguire con qualità
delle altre app verticali (fallback #1) o test aggiuntivi (fallback #4).

## Blocchi
Burden-reale Genesi: serve conferma convenzione geometrica. Motore fisico: non
toccare. Core Fasi 3-4: gated.
