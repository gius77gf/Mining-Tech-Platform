# Checkpoint — 2026-07-21 — Import CSV robusto (fatto)

## Task completato
L'import "Importa da CSV" di Scudo faceva uno split ingenuo su
`[;,\t]`: un campo esportato tra virgolette con `;` interno (es.
`"Capo;Turno"`) o l'apostrofo di guardia anti-formula messo da
csvCell si sarebbe corrotto al re-import. Aggiunto `parseCsvLine()`
in shared/deepwork-id-client/dw-shell.js:
- rispetta le virgolette (campo con separatore interno resta unito,
  `""` = virgoletta letterale);
- delimitatore: preferisce `;`, poi TAB, poi `,`;
- toglie l'apostrofo di guardia SOLO se davanti a `= + - @` (un nome
  che inizia legittimamente con `'`, es. "'ndrangheta", non è toccato).
Usato nell'import di Scudo → round-trip export↔import senza perdite.

Verifiche: 7 nuovi test in run-helpers.mjs (parseCsvLine + round-trip
csvCell→parseCsvLine); suite 70→77. Prova end-to-end Playwright su
Scudo: esportato un lavoratore `=SUM(A1:A9)` con ruolo `Capo;Turno`,
re-importato → riconosciuto come duplicato (guardia tolta
correttamente) e ruolo riletto unito. Nessun errore di pagina.

## Nota
Resta un quirk PRE-ESISTENTE (fuori ambito): l'export mischia righe
lavoratore e righe azienda (sentinella "AZIENDA"), quindi un
re-import crea un finto lavoratore "AZIENDA". L'export è pensato per
backup/consulente, non per il re-import; da valutare in una revisione
futura del formato.

## Commit
- e8539ea  Import CSV robusto: parseCsvLine rispetta virgolette e guardia
(entra nella PR #95 con la protezione CSV-injection e i test helper)

## Prossimo passo atomico
Attendere CI verde su PR #95 (ora 77 test) e mergiare. Poi continuare
fino a esaurimento crediti; ciclo SERALE (~21:40 UTC) = revisione
COMPLETA prima di nuovi task. MAI fermarsi volontariamente.
