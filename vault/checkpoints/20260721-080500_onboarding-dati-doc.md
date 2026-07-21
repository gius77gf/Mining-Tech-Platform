# Checkpoint — 2026-07-21T08:05:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — docs/ONBOARDING_DATI.md)

## Completato
`docs/ONBOARDING_DATI.md` — manuale pratico per preparare i CSV di caricamento
dati di una cava, app per app. Documenta TUTTI gli import costruiti (Scudo
anagrafica + scadenzario, Flotta telemetria, Conti fatture, Terra rilievi,
Campo piano volata) con colonne, esempio e note; dichiara che Sentinella non
ha ancora import (verificato). È il manuale operativo del Passo 6 del
PIANO_GO_LIVE: rende l'onboarding del cliente pilota concretamente eseguibile.
Regole comuni: separatore `;`, date AAAA-MM-GG, header opzionale, isolamento.
Solo documentazione: CI invariata 226.

## Stato roadmap
6 app verticali con import+export CSV + suite test 226 senza flaky + 4 doc
fondatore (STATO_PRODOTTO, DECISIONI_WEEKEND, PIANO_GO_LIVE, ONBOARDING_DATI)
+ schede vault.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX su altre app, casi limite nelle suite, o nuove schede.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
