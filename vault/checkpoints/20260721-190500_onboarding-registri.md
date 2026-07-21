# Checkpoint — 2026-07-21T19:05:00Z

## Tipo
unit-complete (doc fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ONBOARDING_DATI: import registri infortuni e volate)

## Completato
Completata `docs/ONBOARDING_DATI.md` con i due nuovi import aggiunti in questa
sessione:
- Scudo — 3) registro infortuni (`data;tipo;gravita;giorniAssenza;descrizione;
  luogo`), con esempio e note.
- Sentinella — 2) registro volate (`data;fronte;nFori;kgTotali;kgMaxRitardo;
  distanzaRicettore;esito;note`), con esempio e note.
Aggiornato il riepilogo colonne (2 righe nuove) e corretta la voce Terra rilievi
con la colonna facoltativa `fronte` (aggiunta in #261). Solo documentazione; CI
invariata (300).

## Stato
6 app; onboarding CSV documentato per tutti gli import (inclusi i 2 registri
nuovi). Suite 300.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
