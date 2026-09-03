# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-03, 00:47 UTC
- **Commit di partenza**: `8e60d844`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint più recente per **data vera**
(`node apps/deepwork-id/tests/date-checkpoint.mjs`): la giornata del 2
settembre ha chiuso il ponte 3f (Campo→Conti), il ponte Genesi→Terra, sette
unità su otto del piano «Genesi fuori dal browser», il verbale di
riconciliazione di Conti, il cavato in tonnellate, il consumo contro la storia
in Flotta, e le passate in profondità su Conti, Flotta, Scudo e Sentinella.

Il giro completo del browser lanciato ieri alle 22:29Z **è morto con la
sessione** dopo sette minuti (registro fermo alle 22:36, nessun processo
vivo): va rilanciato **presto nel ciclo**, come dice CLAUDE.md, e nel
frattempo si lavora solo su test e documenti.

Adesso, in ordine:
1. rilanciare il giro del browser sulla copia di `8e60d844` e verificare che il
   registro esista e cresca;
2. mentre gira: seconde iterazioni sui documenti e sulle suite `node`
   (candidati rimasti: inventario cumuli in Conti — ricerca 3 —, i tre
   «numeri di legge» sospesi al testo primario, che NON si scrivono);
3. a giro finito: `leggi-giro.mjs`, riverifica di ogni KO sul commit
   corrente prima di aprire un cantiere, aggiornamento della voce di roadmap
   «I 20 KO del giro del 09/08», checkpoint.
