# Checkpoint — 2026-09-05T07:49:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
cb974bb6 — Ricerca Sentinella: il diario delle volate e la relazione periodica per l'ente (metà sul mondo)

## Completato
- Sezione nuova in coda a `docs/RICERCA_CONTINUA_SENTINELLA.md`: sette fatti
  dal mondo (linea guida ARPA FVG sul diario delle volate; UNI 9614 accanto a
  UNI 9916; contenuto del rapporto post-operam; cadenza caso per caso; polizia
  mineraria; centralina come documentazione; tabella tipica), otto fonti con
  la fiducia, sei domande per il delta. Delta NON scritto (regola del 14/08).
- Guardie dei documenti verdi; giro `node` sulla copia verde.

## Prossimo passo atomico
Il DELTA della ricerca qui sopra, dal meccanismo: aprire in
`apps/sentinella/sentinella-data.js` `reportConformita`, `taratureDelReport`,
`coincidenzaVolata`, la collezione `reclami` (DEMO e funzioni che la leggono:
`grep -n "reclam" sentinella-data.js | head`) e il foglio di stampa della
volata nella pagina (`grep -n "fogli\|window.open\|stampa" apps/sentinella/index.html | head`),
e rispondere alle sei domande UNA per una, ogni «non c'è» col comando e la sua
uscita, scrivendo la sezione «Il delta, fatto da chi ha il codice in mano
(05/09, verificato contro il commit …)». Poi la prima unità che ne esce, se
il delta la conferma: la più probabile è la domanda 1 (la volata che porta la
comunicazione fatta e il reclamo collegato — il «diario» della linea guida),
da progettare in scratchpad prima di scrivere nel modulo.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
