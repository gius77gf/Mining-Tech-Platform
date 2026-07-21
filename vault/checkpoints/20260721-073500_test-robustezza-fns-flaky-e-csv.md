# Checkpoint — 2026-07-21T07:35:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — robustezza test: fix flaky Functions + edge case CSV)

## Completato
Robustezza dei test (qualità, nessuna logica di prodotto toccata):
1. **Fix test FLAKY delle Cloud Functions** (`run-fns.mjs`). Il test
   "un ADMIN non può rimuovere un owner; l'ultimo owner non è rimovibile"
   falliva a intermittenza (visto fallire sul CI di #215). Causa: dopo un
   ripristino di ruolo, i custom claims si aggiornano via trigger
   onMemberWrite in modo ASINCRONO; loggandosi come boss troppo presto, il
   token portava ancora il claim vecchio ("admin") → removeMember rispondeva
   permission-denied invece di failed-precondition. Aggiunto helper
   `waitClaim(uid, org, role)` che aspetta la propagazione del claim (poll
   admin SDK) prima del login. Verificato: 3 run consecutive 18/0.
2. **+4 edge case CSV** (`run-kpi.mjs`): CRLF (export Excel) per tutti e 4 i
   parser + scarto valori non validi (importo ≤ 0, ore negative, data non
   ISO) + virgola decimale. È il #1 modo in cui un import fallisce nel mondo
   reale. KPI 107→111.
Totale CI 220→224 (ci.yml aggiornato). Full suite verificata sotto emulatori:
Helper 22 · KPI 111 · Demo 6 · Rules 44 · SDK 15 · Functions 18 · Bootstrap 8.

## Stato roadmap
6 app verticali con import+export CSV (parità) + suite test irrobustite
(niente più flaky sul CI) + doc STATO_PRODOTTO + schede vault.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
altre seconde iterazioni UX, altri casi limite nelle suite, o nuove schede.

## Blocchi
Login live / gestione errori scritture: decisione fondatore. SdI / telematics
live / ciclo chiuso / Genesi motore / soglie di legge: gated, de-rischiati.
