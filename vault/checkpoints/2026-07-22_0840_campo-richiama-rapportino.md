# Checkpoint — 2026-07-22 — Campo: richiama rapportino (fatto)

## Task completato
Seconda iterazione, app Campo. Un rapportino inviato per errore non era
correggibile (solo le bozze erano toccabili). Ora toccando un
rapportino INVIATO lo si richiama in bozza (con conferma, ora azzerata)
per correggerlo e reinviarlo; il tocco su una bozza resta "invia".
Stesso criterio di correggibilità applicato a Conti (annulla incasso) e
Sentinella (registro bidirezionale).

Verifica: sintassi OK; Playwright — "Rapportino perforazione"
inviato -> richiamato in bozza -> reinviato, nessun errore; screenshot
(design intatto, ✕ elimina solo sulle bozze).

## Commit
- 176c84b  Campo: richiama in bozza un rapportino inviato (correzione)

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima 2a iterazione: rivedere Terra
(pattern correggibilità/validazioni) e Scudo/Flotta per lacune simili,
poi validazioni dei form. MAI fermarsi.
