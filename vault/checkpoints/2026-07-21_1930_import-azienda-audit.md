# Checkpoint — 2026-07-21 — Fix riga-azienda import + audit (fatto)

## Task completato
1. Chiuso il quirk annotato nel checkpoint precedente: l'import CSV di
   Scudo ora salta la riga sentinella "AZIENDA" dell'export (regex
   `^(nome|azienda)$`), così un re-import non crea più un finto
   lavoratore. Round-trip export↔import senza perdite anche quando ci
   sono scadenze a livello azienda.
   Prova Playwright (cache-bust): esportato + re-importato → "0
   aggiunti, 9 saltate", `=SUM(A1:A9)` riconosciuto come duplicato
   (guardia tolta correttamente). Nessun errore di pagina.
2. docs/AUDIT_SICUREZZA.md: aggiunti punto 9 (iniezione CSV — CHIUSO,
   rimando a PR #95) e punto 10 (XSS contesto-attributo — PULITO:
   verificate TUTTE le interpolazioni negli attributi delle app, sono
   solo ID Firestore o enum hardcoded, mai testo libero utente).

## Commit
- 3cc30d7  Scudo import: salta la riga-azienda; audit CSV/attributi

## Stato PR
PR #95 (sicurezza export/import CSV, 77 test) MERGIATA in main.
Branch di sessione ripartito da main; questa unità è la prima del
nuovo giro → nuova PR.

## Prossimo passo atomico
Push (force-with-lease, branch ripartito da main) + nuova PR + merge a
CI verde. Poi continuare fino a esaurimento; ciclo SERALE (~21:40 UTC)
= revisione COMPLETA prima di nuovi task. MAI fermarsi volontariamente.
