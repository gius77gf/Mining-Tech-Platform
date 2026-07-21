# Checkpoint — 2026-07-21T12:45:00Z

## Tipo
unit-complete (doc fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6 (ripartito da origin/main dopo
merge #245)

## Ultimo commit
(questo commit — refresh docs/STATO_PRODOTTO.md)

## Completato
Aggiornato `docs/STATO_PRODOTTO.md` (il riferimento "cosa fa oggi ogni app" per
il fondatore, andato stale). Aggiunte al blocco "Cosa fa già" le funzioni delle
seconde iterazioni di questa settimana:
- Scudo: adempimenti HSE preimpostati, import scadenzario, export.
- Campo: avanzamento della giornata, export consuntivo.
- Flotta: ripartizione costi per voce, import telemetria, export situazione.
- Conti: previsione incassi mese, esposizione per cliente, interessi di mora
  di legge (231/2002), export.
- Sentinella: carica massima per ritardo, import sensori, export.
- Terra: classe di accuratezza + banda incertezza ("19.400 m³ ± 388"),
  andamento volumi, export.
Solo documentazione: nessun codice/test toccato, CI invariata (259).

## Stato roadmap
6 app robuste, 6 review adversarial, seconde/terze iterazioni, 3 ricerche→
feature (HSE→Scudo, accuratezza→Terra, mora→Conti), doc fondatore aggiornato.
Suite 259.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR docs; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI
con nuove unità (altre ricerche→feature / rifiniture / test).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
