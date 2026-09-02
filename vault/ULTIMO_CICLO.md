# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-02, 12:49 UTC
- **Commit di partenza**: `18622ace`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint `20260902-1108xx_fattura-elettronica-generatore.md`
— trovato per **data vera** (`node apps/deepwork-id/tests/date-checkpoint.mjs`).

Dal canarino delle 09:49 sono entrate tre unità: il **generatore della fattura
elettronica** nel modulo di Conti (`xmlFatturaPA`, unità A di tre), la
**misura di Genesi fuori dal browser** (`docs/GENESI_FUORI_DAL_BROWSER.md`,
9 chiavi non 4, quattro ponti di file, piano in 8 unità) con la mappa corretta,
e la chiusura senza difetto della seconda domanda della pesa.

⚠️ Il cantiere Flotta (il verso Conti→Flotta del ponte) è **morto sul limite di
sessione** delle 12:30 mentre scriveva nel modulo: il suo lavoro è sul disco,
non committato, e va **misurato prima di crederci** (tre funzioni esportate
senza prova, banco browser da verificare).

Adesso, in ordine:
1. la misura del cantiere Flotta: `node --check`, sintassi delle pagine,
   copertura, il banco nei tre modi — poi si finisce o si butta, con la prova;
2. l'unità B della fattura elettronica (i campi CAP/comune/provincia/regime
   fiscale/modalità di pagamento nelle Impostazioni e nell'anagrafica, CSV
   clienti andata e ritorno, dimostrazione «pronta»);
3. l'unità C: il bottone «Scarica XML per lo SdI» con la riga di onestà.

## Il primo passo

Il canarino stesso, poi `git diff --stat apps/flotta/`.
