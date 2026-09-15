# Checkpoint — 2026-09-15T02:47:28Z

## Tipo
misura (nessun commit di codice in questa unità, ricerca in corso)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f2284dcd

## Cosa è stato fatto

Con B3 (6 unità: `computeInnesco2D`, `_sigDetTimes`, `mdlProfSnap`,
`crestZ`, `measureGeom2D`, `interpFronte`) e B12 (il residuo geometrico
della calotta della galleria) chiusi e pushati in questo ciclo, ho
verificato che gli 10 file di test del browser per Scudo coprono già
sette delle otto sezioni di navigazione (`nav-dash`, `nav-doc`,
`nav-isp`, `nav-perm`, `nav-pers`, `nav-scad`, `nav-azio`) — la sezione
**appalti** (`nav-appa`, la gestione dei cantieri/appaltatori e del
DUVRI) risulta l'unica senza un file di test dedicato.

Lanciato un agente in background per una passata in profondità VERA su
quella sezione (non un `grep` a memoria): legge prima i test già
esistenti in `run-kpi.mjs` su `statoAppalto`/`duvriDovuto`/
`riepilogoAppalti`/`impresaPermesso` per non riscoprire un difetto già
chiuso, poi apre davvero la pagina con Playwright (server statico +
iniezione dati via la risposta HTTP di `scudo-data.js`, stesso metodo
di `scudo-numeri-tranquilli.mjs`) e cerca la stessa famiglia di difetti
già presa cinque volte altrove in Scudo: un badge/pastiglia che dice
«a posto» quando il dato per deciderlo manca davvero.

## Prossimo passo atomico

Attendere il risultato dell'agente. Se trova candidati veri (misurati
nella pagina viva, non dedotti dal codice): scrivere il banco
`scudo-appalti-*.mjs` seguendo lo stesso schema di
`scudo-numeri-tranquilli.mjs`, correggere il difetto nel modulo dati
(mai un dialogo del browser, mai una copia riscritta — si legge
sempre `apps/scudo/scudo-data.js`), aggiungere la prova con difetto
iniettato, cascata documenti se tocca un numero sorvegliato, giro
isolato su worktree, commit, checkpoint.

Se l'agente non trova nulla di misurato: scrivere comunque il
resoconto (che cosa è stato provato e scartato, per nome — regola
«MISURATO PRIMA DI IRRIGIDIRE»), e passare alla sezione successiva o a
un'altra app (Campo, pari livello di urgenza).

Nessuno stop volontario: si prosegue appena l'agente risponde.
