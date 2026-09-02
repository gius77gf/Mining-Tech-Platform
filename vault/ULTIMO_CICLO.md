# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-02, 09:49 UTC
- **Commit di partenza**: `522c7658`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint
`20260902-092957_pesi-a-meta-conti.md` — trovato per **data vera**
(`node apps/deepwork-id/tests/date-checkpoint.mjs`), non per nome.

La fase è quella aperta dal fondatore il 26/08: **i dettagli di ogni app**, su
due binari. Oggi, prima del canarino, sono già chiuse tre unità: il **primo
ponte Flotta→Conti** sullo schermo (mappa 6 → 7), la **prima passata su Conti**
(zero difetti del prodotto, venti dell'ambiente: il proxy del contenitore fa
aspettare 12,7 s ai banchi, tolto ai figli in `tutti.mjs`), e i **pesi a
metà** in Conti (`pesiPesata`: una pesata senza tara non vende il camion e non
vale zero).

Adesso, tre cantieri insieme, come pretende la direttiva 3:

| cantiere | perimetro | che cosa fa |
|---|---|---|
| Conti (io) | `apps/conti/` | la seconda domanda della pesa: che cosa succede a una pesata corretta DOPO la fattura |
| Flotta (agente) | `apps/flotta/` | il verso Conti→Flotta del ponte: Flotta non sa che `daMezzo` esista |
| Genesi (agente) | solo `docs/` | la misura di che cosa vuol dire far uscire Genesi dal browser (nessun codice) |

Nessun cantiere committa: raccolgo io, app per app, con la verifica sulla copia
di ciò che si committa.

## Il primo passo

Il canarino stesso: questo file, un commit che comincia con `canarino:`, il
push. Poi `righeDaPesate` e il salvataggio della pesata nella pagina di Conti.
