# Checkpoint — 2026-07-21T11:55:00Z

## Tipo
unit-complete (ricerca)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ricerca accuratezza rilievi)

## Completato
`vault/RICERCA_ACCURATEZZA_RILIEVI.md` — ricerca di prodotto per Terra:
quanto è affidabile un volume da drone in funzione del metodo (RTK/PPK ~3 cm;
GCP ±1,25% sul volume; senza GCP fino a ±8%; GSD 1–2 cm/px; checkpoint
indipendenti per validare). Ne deriva un BACKLOG per Terra: (1) classe di
accuratezza del rilievo da metodo+GSD; (2) banda di incertezza sul volume
("19.400 m³ ±388"); (3) riconciliazione col venduto (ponte Terra↔Conti, futuro).
Framing onesto (valori tipici, da confermare coi checkpoint), fonti secondarie
concordanti citate (WebSearch). Solo doc: CI invariata 253.

## Stato roadmap
6 app verticali robuste, cruscotti coerenti, review complete, seconde
iterazioni complete, + 2 ricerche→backlog (HSE→Scudo, accuratezza→Terra) +
doc fondatore. Suite 253.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Implementare il passo 1–2 del
backlog: Terra `classeAccuratezza` + banda incertezza volume (pure+test+UI).
SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
