# Checkpoint — 2026-07-22T12:15:00Z

## Tipo
unit-complete (Genesi — coerenza costi/decking su tutte le superfici)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — decking nel report)

## Completato
Rifiniture di coerenza delle 3 nuove funzioni competitor (never-stop, rifiniture UX):
- **Costo nel confronto A/B** (commit precedente): `computeKPI` espone `cost`,
  `cmpRender` mostra "Costo totale (stima)" col verde sul più economico.
- **Costo nell'export CSV** della scheda (commit precedente).
- **Decking nel report** (questo commit): la sezione "Carica & sequenza" del
  report stampabile ora include la riga Decking (N cariche/foro, kg/deck,
  borraggio) quando il decking è attivo → il report riflette il progetto reale.
- **Verifica di coerenza cross-superficie**: con prezzi noti, il costo totale è
  IDENTICO su scheda, confronto A/B e report (tutti €4.986) → stessa formula
  ovunque, nessuna divergenza.

Verifica: syntax CI OK; Playwright — costo coerente su 3 superfici (uguali);
report con 2 deck mostra la riga Decking; nessun errore.

## Prossimo passo atomico
Ricerca "Conti" (fatturazione inerti / SdI / pesa / DDT) in background: alla fine
→ doc roadmap onesto (fattibile in browser vs richiede servizio esterno). Poi
altra rotazione o attendere il fondatore.

## Blocchi
#321 unico branch, attende revisione estetica fondatore. Funzioni ⛔ (hardware/
backend/SdI a pagamento/ML): gated.
