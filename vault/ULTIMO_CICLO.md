# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-02, 18:48 UTC
- **Commit di partenza**: `a038ee85`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint `20260902-*_core-stato-e-3c.md` — trovato
per **data vera** (`node apps/deepwork-id/tests/date-checkpoint.mjs`).

Dal canarino delle 12:49 sono entrate le passate in profondità su Campo,
Sentinella, Terra e sul core, il muro unico delle scadenze (Scudo legge Terra
e Flotta con una regola sola in `shared/`), e la mappa corretta sulle famiglie
3c e 3d, che erano già in un posto solo.

Sul disco, **non committato**, sta a metà il ponte **3f — Campo→Conti**, il
prodotto dichiarato dai rapportini contro il venduto a peso: la funzione
`confrontoProdottoVenduto` è in `shared/dw-ponti.js` (validata sulla cava
sintetica), il modulo di Conti ha la lettura da Campo e una dimostrazione
incompleta che chiama un aiuto per le date relative ancora da scrivere.

Adesso, in ordine:
1. finire il modulo (l'aiuto per le date, la dimostrazione copiata da Campo
   con la prova che sia una copia), `node --check` e `run-kpi`;
2. il terzo lato nella schermata di riconciliazione di Conti, con i tre esiti
   (Campo irraggiungibile → avviso e nessuno zero; confrontabile; non in
   tonnellate);
3. il banco del browser nei tre modi, la mappa §3f e §6 (→ 11 ponti), la
   roadmap, il giro `node`, il commit con `-F`, il checkpoint, il push.
