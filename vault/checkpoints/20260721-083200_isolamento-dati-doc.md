# Checkpoint — 2026-07-21T08:32:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — docs/ISOLAMENTO_DATI.md)

## Completato
`docs/ISOLAMENTO_DATI.md` — spiegazione onesta e verificabile di COME funziona
l'isolamento dei dati tra aziende concorrenti (la promessa n.1 del prodotto) e
COME lo si dimostra. È un asset di vendita/fiducia, non solo doc interna:
serve a rassicurare l'IT di un cliente prudente. Tre barriere (spazio dati
sigillato per org, accesso solo via orgCollection, controllo lato server con
custom claims + regola "nega tutto") + prova dei 44 test regole in CI (casi
espliciti "il concorrente NON legge/scrive/cancella/manomette") + limiti
onesti (serve il live acceso). Fondato sul codice reale (firestore.rules,
run.mjs, SDK). Solo documentazione: CI invariata 228.

## Stato roadmap
6 app verticali con import+export CSV + suite 228 senza flaky + 5 doc
fondatore (STATO_PRODOTTO, DECISIONI_WEEKEND, PIANO_GO_LIVE, ONBOARDING_DATI,
ISOLAMENTO_DATI) + schede vault + roadmap allineata.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX, casi limite nelle suite emulatore, o nuove schede.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
