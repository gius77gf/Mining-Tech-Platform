# Checkpoint — 2026-07-21T06:28:26Z

## Tipo
unit-complete (test sicurezza)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test isolamento collezioni nuove)

## Completato
SICUREZZA (requisito #1 multi-tenant): test di isolamento per le
collezioni NUOVE aggiunte stanotte (es. flotta/ricambi), a conferma che
la regola generica `apps/{appId}/{document=**}` le protegge esattamente
come le altre.
- run.mjs: seed flotta/ricambi per orgA e orgB; +3 test (il concorrente
  non legge/scrive la collezione nuova di orgA; il membro legge la propria).
  Emulatore: 41→44 test rules, tutti verdi. Totale CI 211→214.
Verifica: `firebase emulators:exec --only firestore` → 44 passati, 0
falliti (i log PERMISSION_DENIED sono le negazioni attese degli assertFails).

## Stato roadmap
Grosso in-app coperto su tutte le 6 app + epiche M + rifiniture + due
schede di secondo passaggio (Swebrec per Genesi, SdI per Conti) che
de-rischiano gli epici gated. Suite CI 214.

## REGOLA FONDATORE: NON FERMARSI MAI (ribadita 21/07). Proseguo a oltranza:
finito il grosso → rifiniture, test, ricerche di secondo passaggio, nuovi
programmi.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Continuare con: altre
seconde iterazioni per app, o estendere ancora le suite emulatore (SDK/
Functions), o nuove schede di secondo passaggio (es. telematics ISO
15143-3 per Flotta, pesa→ticket per Conti). SENZA FERMARSI.

## Blocchi
Ciclo chiuso e integrazioni: gated (fondatore). Genesi frammentazione:
gated (motore fisico). Entrambi de-rischiati nel vault.
