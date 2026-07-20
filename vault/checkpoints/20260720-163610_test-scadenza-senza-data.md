# Checkpoint — 2026-07-20T16:36:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
abd4898

## Completato
Test edge-case: scudo.statoScadenza con data mancante (undefined/vuota/
null) → "regolare" (non NaN/scaduta), e kpiFrom con una scadenza senza
data lascia il lavoratore tra i regolari. Blinda il comportamento
graceful su dati incompleti. run-kpi locale: 47 passati, 0 falliti.
Totale 148→149; job CI aggiornato.

## Stato roadmap
Suite 113→149 nel ciclo. UX trasversale completa e uniforme su tutte le
app (tap-KPI, stati vuoti sezioni+quadro, validazione+recupero errore,
invio tastiera, focus-return, conferme delete). Sicurezza: 2 XSS chiusi +
parser CSV puro. Test funzioni pure molto estesi.

## Prossimo passo atomico
Merge PR test-scadenza-senza-data (dopo CI verde; job "...(149)"),
riparti branch da main. Prossimo candidato: continuare a blindare i casi
di dati incompleti sulle altre funzioni di stato — es. flotta.urgenza già
gestisce dataISO assente (a ore), ma sentinella.giorni/conti.giorni con
data mancante danno NaN: verificare se un adempimento/fattura senza data
può arrivare a giorni() e, in caso, aggiungere un test o una guardia.
In alternativa diversificare (focus-return sui form secondari, o controllo
sicurezza core). Scegliere UNA cosa piccola, verificare, commit+checkpoint
+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.
