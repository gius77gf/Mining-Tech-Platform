# Checkpoint — 2026-07-21T09:05:00Z

## Tipo
unit-complete (ricerca)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ricerca HSE scadenze cava)

## Completato
`vault/RICERCA_HSE_SCADENZE_CAVA.md` — ricerca di prodotto per Scudo (app HSE).
Individua il DOPPIO BINARIO normativo della cava (D.Lgs 81/2008 generale +
D.Lgs 624/1996 specifico estrattivo, con DSS/sorvegliante/comunicazioni) e una
lista di adempimenti a scadenza (persona: sorveglianza sanitaria, formazione+
aggiornamenti, preposto/dirigente, primo soccorso, antincendio, RLS, patentini
attrezzature, fochino; azienda: DSS, DVR, verifiche attrezzature, nomine,
riunione periodica). Da qui un BACKLOG per Scudo (passo 1: SCADENZE_PRESET come
le SOGLIE_PRESET di Sentinella, con avviso daVerificare). Framing onesto: non
consulenza legale, periodicità da confermare con RSPP/medico competente; fonti
secondarie concordanti citate. Fatta con WebSearch (WebFetch resta 403 in
questo ambiente). Solo doc: CI invariata 232.

## Stato roadmap
6 app verticali con import+export CSV robusto + suite 232 + doc fondatore
indicizzati + nuova ricerca HSE che apre un backlog concreto per Scudo.
In corso: review adversarial dei calcoli KPI (subagent) — eventuali fix a seguire.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Agire sugli esiti della review
calcoli; poi eventualmente implementare SCADENZE_PRESET in Scudo (passo 1 del
backlog HSE). SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
