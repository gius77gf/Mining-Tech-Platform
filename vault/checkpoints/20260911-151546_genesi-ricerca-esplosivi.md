# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f44b8083

## Completato
Unità 101 — ricerca a rotazione, secondo giro, Genesi: «gli esplosivi in
cava». Metà sul mondo (T.U.L.P.S., D.P.R. 302/1956, ordine di servizio,
ATF), delta dal meccanismo contro `e1d6a6d1`: una voce aperta piccola (il
preset fochino di Scudo: tre anni), due dichiarate (registro del deposito
già decisione, ordine di servizio nuova), un vincolo scritto nella decisione
20 (cinquant'anni di conservazione), una a posto. Solo documenti.

## Imparato
- Una ricerca può servire a portare il mondo SOTTO una decisione già
  dichiarata invece di riaprirla: il registro del deposito era già una
  decisione, e adesso ha due vincoli in più (giornaliero e vidimato,
  cinquant'anni) che chi decide deve sapere.
- Un preset con «mesi: null» e un riferimento che nomina l'autorità sbagliata
  è un difetto di parole del mestiere, non di calcolo: si vede solo
  confrontando il preset con nove Comuni.

## Prossimo passo atomico
Unità 102, piccola: in `apps/scudo/scudo-data.js` il preset `fochino` →
`mesi: 36` e riferimento «D.P.R. 302/1956, art. 27 — licenza comunale con
nulla osta del Prefetto, validità triennale [seconda mano]: la data vera è
quella sul titolo»; aggiornare la prova in `run-kpi` che pinna il preset
(`mansionePreset("fochino")`, `MANSIONI_PRESET`) e quella che elenca i preset
a `mesi: null`; `documenti-dimostrazione` invariata. Poi leggere il giro del
browser su `7578e26a` (`scratchpad/giri/ultimo-log.txt`, `leggi-giro.mjs`)
quando `ultimo-exit.txt` compare, chiudere i KO veri e rilanciarlo sul nuovo
HEAD.

## Blocchi
Nessuno.
