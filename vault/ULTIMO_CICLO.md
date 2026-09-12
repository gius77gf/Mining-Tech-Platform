# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 09:15 UTC
- **Commit di partenza**: `5fdfd644`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il repository è raggiungibile e HEAD combacia col remoto (nessuna
divergenza). Nella working tree sono presenti, non ancora committate, le
modifiche dell'unità 118 (Conti: `xmlFatturaPA` scrive `TD24` quando la
fattura cita dei DDT, `TD01` altrimenti; `sdi: { stato, il, nota }` sulla
fattura con `statoSdi`/`sollecitabile`/`prioritaIncasso` marcata; prove in
run-kpi già verdi nella sessione precedente). Prossimi passi immediati:
1. Rilanciare il giro `node` sulla worktree e, se verde, committare l'unità
   118 con checkpoint.
2. Leggere il giro del browser lanciato su `755ef985` (se ancora vivo o già
   concluso) con `leggi-giro.mjs` e chiudere eventuali KO veri.
3. Proseguire con la ricerca a rotazione (quarto giro: Genesi, Scudo,
   Flotta) o con le unità di prodotto aperte in `vault/ROADMAP_SETTIMANA.md`.

Nota: questo ciclo ha ricevuto anche il testo standard della routine
settimanale, che cita la fase dei "ponti fra le app" (docs/MAPPA_ECOSISTEMA.md)
e la profondità per singola app come priorità generali del fondatore — restano
valide come sfondo, ma il lavoro puntuale prosegue dal "Prossimo passo
atomico" del checkpoint più recente per data vera.
