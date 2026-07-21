# Checkpoint — 2026-07-21T21:40:00Z

## Tipo
unit-complete (feature UX — Campo, export squadre / parità import-export)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo export squadre CSV)

## Completato
Chiusa la seconda (e ultima) asimmetria import/export della mappatura: in Campo
le squadre si importavano ma non si esportavano (l'unico export era il
consuntivo carico).
- `campo/index.html`: import di `csvCell` da dw-shell; bottone "Esporta squadre
  (CSV)" accanto all'import; handler che scarica `nome;persone;area;stato`
  (csvCell su nome/area, anti-injection), file `campo_squadre.csv`. STESSO
  formato dell'import → round-trippabile.
- `ONBOARDING_DATI.md`: nota "Backup" nella sezione squadre.

Verifica (Playwright, round-trip): esporto le 3 squadre demo, ri-carico il file
→ "0 aggiunte, 3 già presenti (saltate)", lista invariata (3→3), nessun errore.

## MILESTONE: parità import-export completa
Con gare (#288) e ora squadre, ogni entità importabile è anche esportabile in
formato ri-caricabile. Backup/condivisione uniformi in tutto l'ecosistema.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: nuova unità (test
puri di edge non coperti, revisione, o UX su un'app).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
