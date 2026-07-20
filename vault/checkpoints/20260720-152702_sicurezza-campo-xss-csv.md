# Checkpoint — 2026-07-20T15:27:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
33f59d9

## Completato
REVISIONE SICUREZZA (punto 5) — trovato e corretto un XSS reale.
apps/campo/index.html: l'import CSV del piano di carico coercia a numero
solo foro e prog; x/prof/borr/rit restavano stringhe grezze del file e
venivano messe in HTML senza esc() (riga lista fori). CSV ostile con
<img onerror> / <script> → esecuzione codice nella sessione di chi
importa. Fix: esc() sui 4 campi al rendering. Documentato in
docs/AUDIT_SICUREZZA.md come punto 13 (chiuso). Verificato con Playwright:
payload escapato, 0 img iniettate, 0 script eseguiti, nessun dialog.
Audit del resto: le altre interpolazioni sospette trovate erano o
costanti sviluppatore (conti rep-list) o export CSV con campi liberi già
csvCell-guardati e date da input type=date (scudo/conti) — nessun altro
vettore HTML.

## Stato roadmap
Punti coperti questo ciclo: 1 (UX seconde iterazioni: tap-KPI, stati
vuoti, validazioni, ordinamento), 4 (test: confini, input vuoti,
integrità demo; suite 113→140), 5 (sicurezza: XSS Campo CSV chiuso).

## Prossimo passo atomico
Merge PR sicurezza-campo-xss (dopo CI verde), riparti branch da main.
Prossimo: aggiungere una REGRESSIONE automatica per questo XSS —
un test che verifica che il parse del piano NON lasci passare HTML
grezzo. Opzione pulita: estrarre in campo-data.js una funzione pura
parsePianoCsv(text) (oggi la logica è inline nell'onclick), coprirla
con test in run-kpi.mjs o nuovo run-parse, e far usare la stessa
funzione all'index. In alternativa, se estrarre è troppo invasivo,
proseguire l'audit sulle ALTRE import da file (scudo CSV lavoratori:
già usa parseCsvLine + esc? verificare il render dei campi importati).
Scegliere UNA cosa, unità piccola, commit+checkpoint+PR.

## Blocchi
Nessuno.
