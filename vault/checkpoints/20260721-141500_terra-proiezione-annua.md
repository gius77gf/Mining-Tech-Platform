# Checkpoint — 2026-07-21T14:15:00Z

## Tipo
unit-complete (feature — Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra proiezione di fine anno vs autorizzato)

## Completato
Terra calcolava riserva residua e avanzamento piano, ma non avvisava se al
ritmo attuale si sta per SUPERARE il volume annuo AUTORIZZATO (rischio legale:
non si può estrarre più del concesso).
- `terra-data.js`: `proiezioneAnnua(rilievi, pianificatoAnnuoM3, oggi)` pura e
  testabile. Dalla frazione di anno trascorsa e dall'estratto dell'anno stima
  con proiezione lineare il totale di fine anno e lo confronta col piano annuo.
  stato: danger se supera l'autorizzato, warn se ≥90%, ok sotto. proiezione
  null se è troppo presto nell'anno (<~1 mese) per una stima onesta. null se
  non c'è un piano annuo.
- `index.html`: nuova riga `pia-proiezione` nella pagina Piano: "Proiezione di
  fine anno al ritmo attuale: ~X m³ (Y% dell'autorizzato) — rischio di superare
  il volume autorizzato: rallenta o chiedi una variante" (badge colorato per
  gravità). Messaggio onesto quando è troppo presto.
- `run-kpi.mjs`: +2 test (supera l'autorizzato → danger con estratto 79.400/
  piano 125.000; null senza piano; proiezione null se inizio anno). KPI 148→150;
  CI 267→269.
Verifica: KPI 150/0, syntax module OK, Playwright (Terra/Piano: "~143.892 m³
(115% dell'autorizzato) — rischio di superare" in badge danger; nessun errore).

## Stato roadmap
6 app robuste. Terra ora avvisa sul rischio di sforare l'autorizzato. Suite 269.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
