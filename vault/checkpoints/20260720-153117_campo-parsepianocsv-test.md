# Checkpoint — 2026-07-20T15:31:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
51da087

## Completato
Regressione automatica per l'XSS di Campo (punto 13 audit): estratta la
logica di parsing del piano CSV (prima inline nell'onclick, non testabile)
in campo-data.js come parsePianoCsv(text) PURA. index.html ora la importa
e la usa. Comportamento identico verificato con Playwright (import valido
→ 2 fori; payload <img onerror> → 0 elementi iniettati, nessuna esecuzione).
4 test aggiunti in run-kpi.mjs: header saltato, coercizione foro/prog,
scarto righe non valide, campo libero preservato come testo (documenta che
la difesa XSS è l'esc a valle). run-kpi locale: 42 passati, 0 falliti.
Suite KPI 38→42, totale 140→144; job CI aggiornato.

## Stato roadmap
Suite salita 113→144 in questo ciclo. Sicurezza: XSS Campo trovato,
corretto (esc) e ora blindato con parser puro + test.

## Prossimo passo atomico
Merge PR parsePianoCsv (dopo CI verde; job "...(144)"), riparti branch da
main. Prossimo: continuare l'audit degli import da file — verificare lo
Scudo import CSV lavoratori (btn-import-csv → parseCsvLine): controllare
che i campi importati (nome/ruolo/tel) siano escapati dove mostrati nelle
liste (pers-list usa esc su l.nome? verificare) e che parseCsvLine +
render non lascino passare HTML. Se già sicuro, aggiungere comunque un
test di regressione o passare al punto 2 (rimandati del censimento in
docs/CENSIMENTO_FEATURE.md). Scegliere UNA cosa, unità piccola,
commit+checkpoint+PR.

## Blocchi
Nessuno.
