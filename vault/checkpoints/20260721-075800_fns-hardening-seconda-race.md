# Checkpoint — 2026-07-21T07:58:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — run-fns: chiusa la seconda race dei claim)

## Completato
Robustezza test — chiusa la SECONDA occorrenza della stessa classe di flaky
già corretta prima (propagazione asincrona dei custom claims via trigger
onMemberWrite). Nel test "con un secondo owner il declassamento passa", tizio
diventa owner e subito dopo fa login + updateMemberRole: senza attesa, il suo
token poteva avere ancora il claim vecchio → permission-denied intermittente.
Aggiunto `waitClaim("tizio","orgA","owner")` prima del login. Ora TUTTI i
punti "login subito dopo un cambio ruolo" nella suite Functions sono coperti.
Solo test, nessuna logica di prodotto. Conteggio invariato (Functions 18,
totale 226). Verifica: 3 run consecutive 18/0.

## Stato roadmap
6 app verticali con import+export CSV completi + suite test 226 senza flaky
(entrambe le race dei claim chiuse) + 3 doc fondatore + PIANO_GO_LIVE + schede.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX (es. "prossime scadenze" in Scudo), o nuove schede di
ricerca/programmi.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
