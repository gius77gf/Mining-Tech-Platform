# Checkpoint — 2026-07-21T21:30:00Z

## Tipo
unit-complete (feature UX — Conti, export gare / parità import-export)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti export gare CSV)

## Motivazione (dalla mappatura import/export)
Ho mappato import vs export in tutte le app: ognuna esporta ciò che importa,
TRANNE Conti, dove le gare si potevano importare ma NON esportare (l'unico
export era le fatture). Asimmetria: un fondatore non poteva fare backup né
condividere le gare.

## Completato
- `conti/index.html` (pagina Gare): bottone "Esporta gare (CSV)" accanto
  all'import. Scarica `titolo;base;scadenza;stato` (csvCell sul titolo,
  anti-injection), ordinato per scadenza, file `conti_gare.csv`. STESSO formato
  dell'import → round-trippabile.
- `ONBOARDING_DATI.md`: nota "Backup" nella sezione gare.

Verifica (Playwright, round-trip completo): esporto le 4 gare demo, ri-carico
il file esportato → "0 aggiunte, 4 già presenti (saltate)", lista invariata
(4→4), nessun errore. CSV esportato re-importabile 1:1.

## MILESTONE: parità import-export delle gare
Conti è ora allineato alle altre app: ciò che si importa si può anche
esportare.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: valutare piccole
asimmetrie residue (es. export squadre in Campo) o nuova unità test/UX.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
