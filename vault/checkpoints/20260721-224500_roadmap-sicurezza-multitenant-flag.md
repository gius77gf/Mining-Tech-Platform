# Checkpoint — 2026-07-21T22:45:00Z

## Tipo
review + roadmap-update (registro revisione sicurezza + flag multi-tenant core)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ROADMAP: sessione 7ª parte + flag isolamento core)

## Completato
- Sweep XSS esteso a TUTTE le app `apps/*` (scudo/campo/flotta/conti/
  sentinella/terra/genesi): confermato che NESSUN campo di testo utente è
  interpolato in innerHTML senza escape. La posture XSS dell'intero ecosistema
  è a posto (app già pulite, core corretto in #294/#295).
- ROADMAP aggiornato con "SESSIONE 21/07 (7ª parte)" che documenta la
  revisione di sicurezza del core e, soprattutto, mette NERO SU BIANCO la
  segnalazione da decidere: **il core non ha isolamento multi-tenant** (usa
  collezioni Firestore globali, coerente con l'essere l'app storica
  mono-azienda). NON è un bug se il core resta single-tenant by design; se
  servirà multi-azienda dallo stesso progetto Firebase, va introdotto
  l'isolamento. Decisione del fondatore — nessuna modifica fatta.

## Riepilogo sessione (continuazione, #281–#295, 15 unità)
Parità import completa → filtro gare → header CSV delimiter-agnostico →
idempotenza dedup (infortuni/volate/rilievi/scadenze) → messaggi import utili
→ coerenza doc → test (aging, isIntestazione) → parità import-EXPORT (gare,
squadre) → revisione serale (9/9 app pulite) → revisione sicurezza CORE
(XSS + robustezza) → sweep XSS ecosistema pulito. Suite CI 301 → 314.

## Prossimo passo atomico
Aprire PR (vault); dopo merge, RESTART. Proseguire SENZA FERMARSI: eventuale
revisione della coda non ancora esaminata del core (righe ~6426→fine) per
bug di logica, o nuove rifiniture. I task ad alto valore residui sono gated
(isolamento core, go-live Firebase, decisioni di stile/prodotto).

## Blocchi
Isolamento multi-tenant del CORE + go-live + stile/prodotto + soglie di legge:
decisioni del fondatore.
