# Checkpoint — 2026-07-21T16:45:00Z

## Tipo
unit-complete (fix condivisi da review shared — 3/4)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — parseCsvLine: delimitatore fuori virgolette + trim solo campi non quotati)

## Completato (Unit B: parseCsvLine)
Due bug di `parseCsvLine` dalla review del codice condiviso (parser usato da
TUTTE le app in import):
- **Rilevamento delimitatore**: prima `line.includes(";")` guardava anche
  dentro le virgolette, così un CSV a virgole con un `;` dentro un campo quotato
  (`"a;b",c`) veniva scambiato per file a `;` → `["a;b,c"]` (colonne rotte). Ora
  `rilevaDelim` conta i separatori SOLO fuori dalle virgolette → `["a;b","c"]`.
- **Trim dei campi quotati**: `.trim()` veniva applicato a tutti i campi, anche
  a quelli messi tra virgolette apposta per conservare gli spazi (`" Mario "`
  → `"Mario"`). Ora si tiene traccia per-campo se era quotato: i quotati
  conservano gli spazi, gli altri vengono ripuliti.
- `run-helpers.mjs`: +2 test (delimitatore fuori virgolette; quotato conserva
  gli spazi, non quotato no). Helper 33→35; CI 292→294.
Verifica: helper 35/0, KPI 161/0 (nessuna regressione sui parser delle app,
che comunque ri-trimmano), demo 7/0; smoke 6/6 app pulite; tutte le regressioni
di parseCsvLine (virgolette raddoppiate, guardia formula, apostrofo legittimo,
fallback virgola, round-trip csvCell) verdi.

## Rimane dalla review shared
- Unit C (minore): `switchOrg` non azzera `this.entitlement` prima del reload
  (flag di fatturazione stantìo su errore transitorio; isolamento OK — è già
  garantito da orgId corretto).

## Stato: review shared → isolamento SOLIDO; 3/4 bug chiusi. Suite 294.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART; poi Unit C (SDK switchOrg). Proseguire.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
