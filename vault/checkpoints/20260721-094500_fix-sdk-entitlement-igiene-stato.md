# Checkpoint — 2026-07-21T09:45:00Z

## Tipo
unit-complete (bugfix da review adversarial SDK)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — fix igiene stato SDK: entitlement/tour/expiry)

## Completato
Terza review adversarial, questa volta sull'SDK deepwork-id-client/index.js (il
"gate unico" del multi-tenant). Buona notizia: l'ISOLAMENTO è confermato SOLIDO
(nessun percorso verso l'org di un altro, orgCollection legge orgId dal vivo,
switchOrg non serve refresh token, nessun off-by-one sulle date). Corretti 5 bug
reali di correttezza attorno a entitlement/stato (nessuno indebolisce la
sicurezza; la rendono più corretta):
1. **Entitlement che "resta" cambiando account** (bypass del gate a pagamento):
   `_loadClaimsAndOrg` ora azzera SEMPRE `this.entitlement` prima di ricaricare
   → un account senza org raggiunto senza logout NON passa più hasEntitlement.
2. **loginTour lasciava le org del login precedente**: ora azzera `this.orgs`/
   `entitlement` → in tour non si può "rientrare" in un'org via switchOrg.
3. **hasEntitlement assumeva validUntil = Timestamp Firestore**: nuovo helper
   `_entitlementAttivo` normalizza validUntil (Timestamp | stringa ISO | millis)
   senza mai lanciare.
4. **listEntitlements non filtrava scaduti/inattivi**: ora ogni voce porta
   `attivo` calcolato con la stessa regola (la griglia profilo non mostra app
   scadute come incluse). Non-breaking (aggiunge un campo).
5. **createOrganization non attivava la nuova org**: ora imposta orgId alla nuova
   org (evita che orgCollection punti alla vecchia se c'era una defaultOrgId).
+ commento su orgCollection (chiamarla ad ogni accesso, mai memorizzare il ref).
- run-sdk.mjs: +4 test (cambio account, tour, ISO string, attivo). SDK 15→19;
  totale CI 237→241.
Verifica: suite completa sotto emulatori 241/0 (Helper 22 · KPI 124 · Demo 6 ·
Rules 44 · SDK 19 · Functions 18 · Bootstrap 8).

## Stato roadmap
6 app verticali robuste + SDK con igiene stato corretta + isolamento confermato
solido dai test + suite 241 + doc fondatore + ricerca HSE + Scudo preset.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
Conti previsione incassi per mese (helper già progettato), o altre voci HSE, o
altre review/ricerche.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
