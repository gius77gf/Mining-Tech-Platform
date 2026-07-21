# Checkpoint — 2026-07-21T12:25:00Z

## Tipo
unit-complete (review sicurezza + hardening minore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — hardening esc su campo p.foro)

## Completato
Sesta review adversarial: STORED XSS nelle UI delle 6 app (in live si mostrano
dati scritti da altri membri della stessa org: un `<img onerror>` in un nome
sarebbe XSS visibile ai colleghi). ESITO: **nessuna vulnerabilità** — la
disciplina `esc()` regge su tutte e 6 le app; ogni stringa da dato utente
interpolata in innerHTML è escapata. Confermato campo per campo.
Unica nota (non sfruttabile oggi): in Campo `p.foro`/`p.prog` (numeri da import
CSV locale) erano interpolati senza esc. Applicato `esc()` per difesa in
profondità/coerenza (nessun cambio di comportamento: sono numeri; l'handler usa
`=== +attr`). CI invariata 257.
Verifica: syntax OK; handler data-foro verificato (=== +attr → match invariato);
smoke test precedente: tutte le 7 app caricano senza errori in demo.

## Stato roadmap
6 app robuste; superfici principali TUTTE passate in review adversarial (CSV,
KPI, SDK, Functions, data layer, XSS/escaping) — 12 bug reali corretti + XSS
confermato pulito; isolamento verificato solido; seconde/terze iterazioni; doc
fondatore; suite 257.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
altre rifiniture/ricerche/feature.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
