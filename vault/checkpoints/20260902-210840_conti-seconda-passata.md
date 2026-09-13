# Checkpoint — 2026-09-02T21:08:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c703c076 — Conti, seconda passata in profondità: il Report cresciuto, rimisurato

## Completato
Famiglia dei banchi di Conti rilanciata (tutti a zero KO), contrasto nei
tre temi (1.049 testi, 0 sotto soglia), i casi limite del verbale a mano a
320 px, un difetto di frase chiuso (lo «0,00 t in 0 viaggi» del terzo lato).
Giro node 37/37.

## Prossimo passo atomico
Sul disco, NON committata, c'è la ricerca (metà sul mondo) su manutenzione
preventiva e carburante dei mezzi, appesa a `docs/RICERCA_CONTINUA_flotta.md`.
Va fatto il delta dal MECCANISMO in `apps/flotta/flotta-data.js`: chi decide
quando scade un tagliando (ore motore o calendario? cercare le funzioni sulle
scadenze di manutenzione, non la parola «tagliando»); come si calcola il
consumo l/h e con quale guardia sul contatore sceso (`consumoPerMezzo`,
`ritmoOreMezzi`); se esiste una soglia di consumo anomalo; se il minimo
motore ha una voce; che cosa misura `affidabilitaFlotta` (disponibilità: su
fermi registrati, non MTBF). Ogni «non c'è» con comando e uscita. Poi
committare la ricerca col delta.
Dopo: il candidato 2 della ricerca di Conti (densità in banco per litotipo)
progettato in scratchpad, oppure la passata in profondità su Flotta.

## Blocchi
Nessuno.
