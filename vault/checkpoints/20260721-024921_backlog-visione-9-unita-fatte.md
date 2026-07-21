# Checkpoint — 2026-07-21T02:49:21Z

## Tipo
bookkeeping / stato

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — aggiornamento ROADMAP_SETTIMANA)

## Completato
Aggiornato ROADMAP_SETTIMANA.md: segnate ✅ le 9 unità "subito/S" della
Roadmap di Visione realizzate stanotte (PR #186–#194, tutte mergiate),
segnata ⏸ la voce 7 (Genesi frammentazione, rimandata: motore fisico).

## Riepilogo della sessione (21/07, notte)
1) RICERCA PIVOT (richiesta esplicita del fondatore): 7 schede
   "Potenziale — <App>" + "Soglie normative — riferimento per Sentinella"
   su ecosistema-vault/main; sintesi in vault/ROADMAP_VISIONE.md (PR #185).
   NB: i 7 workflow deep-research della sera prima erano falliti per limite
   web (reset 1am UTC); rifatti con subagenti controllati dopo il reset.
2) 9 UNITÀ "subito/S" nel prodotto, una per app + extra, ciascuna con
   helper puro + test + screenshot + PR mergiata:
   - Sentinella: soglie normative preimpostate (#186) + distanza scalata (#193)
   - Conti: aging incassi (#187) + riepilogo gare (#192)
   - Scudo: idoneità sanitaria art. 41 (#188)
   - Terra: m³→valore (#189) + qualità del dato (#194)
   - Campo: causali di fermo (#190)
   - Flotta: scadenzario predittivo a ore (#191)
   Suite test 167 → 190. Tutte le PR CI-verdi e mergiate su main.

## Stato roadmap
Le voci "subito/S" più semplici e isolate sono esaurite. Restano:
- Genesi 2° modello frammentazione (gated di fatto: motore fisico).
- Registro volate completo (M, nuova collezione).
- Epiche M/L della Visione: scadenzari con alert multi-soglia, KPI OEE/
  disponibilità, work order + ricambi, rapportino turno + handover, report
  margine, SdI/pesa/telematics/centraline; e il "ciclo chiuso".

## Prossimo passo atomico
Aprire PR di questo aggiornamento; dopo merge, RESTART da origin/main e
iniziare la prima EPICA M isolata a basso rischio — proposta: Scudo
scadenzario con alert multi-soglia (helper `livelloScadenza` con fasce
60/30/15/7/1 gg, additivo, senza toccare statoScadenza esistente).
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi frammentazione: cautela sul motore fisico.
