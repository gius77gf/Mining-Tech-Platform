# Checkpoint — 2026-07-21T22:10:00Z

## Tipo
unit-complete (documentazione — regola generale di backup/export)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ONBOARDING_DATI: regola generale Backup/Export)

## Completato
Ora che la parità import-export è completa (ogni entità importabile è anche
esportabile — #288 gare, #289 squadre), l'ho reso esplicito nel manuale
d'onboarding come regola VALIDA PER TUTTI: ogni schermata di import ha accanto
un bottone "Esporta (CSV)" per la copia di sicurezza / lo spostamento dati, e
il file esportato si re-importa senza duplicare (dedup #284/#285).
- `ONBOARDING_DATI.md`: nuovo punto "Backup" nella sezione "Regole valide per
  tutti i file".

Nessun codice toccato; CI resta 313.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI. Il backlog
non-gated di alto valore è in gran parte esaurito: valutare revisioni di
secondo passaggio (core index.html), o attendere sblocchi del fondatore per i
task gated (progetto Firebase go-live, decisioni di stile/prodotto).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile/prodotto: fondatore.
SdI / telematics live / ciclo chiuso / Genesi motore / soglie di legge: gated.
