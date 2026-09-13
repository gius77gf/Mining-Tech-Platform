# Checkpoint — 2026-09-05T19:40:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7ecf4089 — nomi-liberi: la seconda domanda (lo scope) anche sui riferimenti nudi — e
il secondo nome libero vero del giorno, nell'export dei near-miss di Scudo

## Completato
`fuoriScopeNudi` in `apps/deepwork-id/tests/nomi-liberi.mjs` (regola su
pagine e moduli+suite, denominatore, due controprove che rimettono i difetti
veri di oggi: `letture` di Sentinella e `per` di Scudo), 26 → 31 prove.
Costo misurato prima su una copia: 74.379 + 121.320 riferimenti nudi, 1
allarme e quello vero. Scudo: `per` → `etichettaPeriodoNearMiss(nmPeriodo)`
del modulo, premuto nel browser (striscia verde, file scaricato, 0 errori),
`scudo-documenti` 89 ok. CLAUDE.md: «in quante forme un nome può
comparire?». Giro `node` sulla copia: 40 comandi a posto. Pin invariati
(prove 3.209, run-kpi 2728, asserzioni 3.647, copertura 901/901).

## Stato roadmap
Voce `[x]` «`nomi-liberi`: la seconda domanda (lo scope) anche sui
riferimenti NUDI…»; il candidato in coda alla voce di Sentinella chiuso con
il rimando.

## Prossimo passo atomico
Un'altra mancanza confermata di B4 che il codice può colmare senza decisioni
del fondatore. Le liste più lunghe sono Campo (11) e Sentinella (11):
rileggere le righe «CONFERMATA ASSENTE» di `docs/CONCORRENTI_CAMPO.md` (la
tabella con il verdetto), scartare quelle che chiedono hardware, backend o
una decisione commerciale, e scegliere la più chiesta da un ispettore.
Per ognuna: (1) la metà sul mondo con `WebSearch` (seconda mano, marcata),
(2) il delta dal MECCANISMO aprendo `apps/campo/campo-data.js` («chi calcola
questa cosa oggi, sotto un altro nome?»), (3) funzione pura nel modulo
provata in scratchpad prima di scriverla, (4) pagina, CSV/foglio se escono,
run-kpi, banchi di Campo, scatto guardato, riga del documento → C'È con i
comandi, B4 aggiornata, checkpoint.

## Blocchi
Nessuno.
