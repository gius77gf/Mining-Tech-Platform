# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 12:45 UTC
- **Commit di partenza**: `c6696f65`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita.
Sessione continua dallo stesso ciclo delle 09:15/09:45 UTC: sette unità
completate e pushate da allora (119-125), tutte verificate con
`giro-node.mjs` su worktree pulita prima del commit. Riassunto:
rimisurato/corretto `docs/MAPPA_ECOSISTEMA.md` (16 ponti su 56, Genesi
sbloccata dal 02/09 — vedi nota sotto); chiuso senza difetto l'esame delle
fatture demo di Conti; estratte quattro funzioni pure da `genesi.html` a
`genesi-data.js`, con due tool di misura corretti a cascata; letto un giro
completo del browser e chiusi due KO veri (unità in maiuscolo in Sentinella);
corretta una voce della roadmap (B4, il quinto bottone di Campo) che diceva
"da fare" per un lavoro già completato e testato (94/94) in un cantiere
precedente.

## Prossimi passi immediati

1. Un giro del browser mirato (Genesi + Sentinella, lanciato dopo l'unità
   123, log in `$SCRATCHPAD/giri/ultimo-log.txt`) potrebbe essere ancora in
   corso: verificare col pid, leggerlo con `leggi-giro.mjs` appena finito.
2. Continuare a scorrere `vault/ROADMAP_SETTIMANA.md`: B4 ha altre voci
   sotto quella già corretta; oppure B12, B0-bis, B0, C2, E-serie, Q1.
3. Il cantiere B3 (Genesi fuori dal browser) ha ancora funzioni nella
   fascia 3-5/6-10 (`genesi-estraibili.mjs --elenco`), ma le rimaste sono in
   maggioranza genuinamente stateful o toccano fisica della volata (MIC,
   PPV): richiedono la stessa rigor di `computeMIC` (parola per parola,
   migliaia di casi generati), non un trasloco semplice — pianificarle come
   unità a sé, non improvvisarle.

⚠️ **Nota sul prompt fisso della routine**: cita ancora la mappa dei ponti
e lo stato di Genesi come erano il 26/08 ("6 ponti su 56", "Genesi NON esce
dal browser"). Questi fatti sono superati da settimane di lavoro misurato:
non vanno riverificati alla lettera come se fossero il punto di partenza —
il documento vivo è `docs/MAPPA_ECOSISTEMA.md`. Il canarino di questo ciclo
serve a dire che il lavoro è vivo, non a resettare lo stato a quello del
prompt.
