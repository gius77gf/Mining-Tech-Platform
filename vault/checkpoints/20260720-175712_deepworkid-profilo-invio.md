# Checkpoint — 2026-07-20T17:57:12Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5bc2d6d

## Completato
UX Deepwork ID: Invio-da-tastiera nel profilo (new-org→btn-create-org,
inv-email→btn-invite), coerente col login. Solo scorciatoia sui pulsanti
esistenti. Syntax OK; Playwright: Invio in inv-email attiva "Invita",
nessun errore pagina (PROFILO ENTER OK).

## Stato roadmap
Invio-da-tastiera ora su: 6 app verticali (form) + Deepwork ID login +
Deepwork ID profilo. Coerenza tastiera completa sulle pagine con form
utente. Suite 159.

## Prossimo passo atomico
Merge PR deepworkid-profilo-invio (dopo CI verde), riparti branch da main.
Il pattern Invio è ora completo su tutte le pagine con form. Prossimo:
valutare se resta una micro-UX/coerenza SICURA (non toccare auth/admin/
sicurezza), o una revisione, o accettare la forte saturazione e fare una
verifica consolidata. NON gated: continuare a piccole unità di valore
reale. Candidati: recupero errore (clearErr) sui campi di login/profilo
Deepwork ID (coerente con le app), se sicuro. Verificare, commit+
checkpoint+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore.
