# Checkpoint — 2026-07-21T20:45:00Z

## Tipo
unit-complete (revisione qualità/sicurezza + miglioramento — Scudo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — dedup import infortuni + esito revisione)

## Revisione (fallback #5): esito PULITO
Audit del codice recente su main, in particolare i render delle 6 app verticali:
- XSS: TUTTI i campi di testo utente (nome, titolo, cliente, descrizione, nota,
  dettaglio, ruolo, area, ente, voce, banco, mezzo...) sono escapati con `esc()`
  in ogni lista. I `${...}` non protetti sono solo id Firestore (charset sicuro,
  mai da CSV) ed enum/numeri controllati. Nessun buco.
- Import CSV: dopo il fix header delimiter-agnostico (#283), BOM UTF-8 (gestito
  da trim), righe con soli separatori/spazi (scartate dal filtro chiave) e
  header a virgole sono tutti robusti. Verificato per parseGareCsv/parseFattureCsv.
- Validazioni form: gli handler "Aggiungi" validano campi obbligatori con
  bordo rosso + messaggio d'esito + clearErr all'input; dedup per nome dove ha
  senso.
- Liste: ordinamenti sensati (es. registro infortuni per data desc), stati
  vuoti presenti, delete con `confirm()`.

## Miglioramento trovato e applicato
UNICA incoerenza: l'import del **registro infortuni** (Scudo) NON faceva dedup,
a differenza di tutti gli altri import. Per un fondatore non tecnico, un doppio
click su "Importa" avrebbe raddoppiato SILENZIOSAMENTE un registro HSE.
- `scudo/index.html`: dedup su firma `data|tipo|descrizione` contro gli eventi
  esistenti e anche dentro lo stesso file; feedback allineato agli altri import
  ("N aggiunti, M già presenti (saltati)").

Verifica: syntax modulo OK; Playwright — 1° import 2→4 ("2 aggiunti"), 2° import
identico resta 4 ("0 aggiunti, 2 saltati"), nessun errore. Nessun nuovo test
unitario (logica UI inline); CI resta 312.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: verificare se altri
import "a eventi" (es. volate Sentinella) meritano lo stesso dedup, oppure
nuova unità UX/test.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
