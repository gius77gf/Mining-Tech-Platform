# Checkpoint — 2026-09-05T09:36:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
368c0e88 — Sentinella: la scheda della volata dichiara «che cosa manca» — seconda
iterazione, affiancata alla relazione di fine lavori di Terra
(prima: f4b628e1 docs, la ricerca di Terra segna fatti i tre candidati che
erano chiusi dal 04/09 senza la riga aggiornata)

## Completato
Seconda iterazione della scheda della volata col metodo del confronto
affiancato (riferimento: `relazioneLotto` + `fogliaRelazione` di Terra):
`nonMisurati` e terzo elemento `manca` su ogni riga nel modulo; sezione
«Che cosa manca in questa scheda», cella in corsivo, firme, piede, CSS di
stampa nel foglio. Tre scelte dichiarate: la SD non calcolabile non conta due
volte; «nessun reclamo»/«nessuna previsione»/«note: nessuna» non mancano;
una prevista non manca della misura.
Misure: run-kpi 2653/0 (stesse 3 prove, più asserzioni); banco 35 ok / 0 KO,
controprova 25 caduti su 35 con 6/6 iniezioni (la nuova sul `manca` vista da
sola: 3 KO; le due riallineate: 2 KO ciascuna); iniezioni-fresche 523/523;
sintassi 34/0; giro `node` sulla copia: 38 comandi a posto, asserzioni 3.566
(invariate: le prove nuove sono `eq` dentro prove esistenti). Scatto del
foglio b2 guardato: la sezione in fondo elenca le due voci giuste.
Trappola ripestata e scritta qui: `git -C wt reset --hard HEAD` su una
worktree staccata torna al commit CONGELATO (f4b628e1 era già avanti di uno):
la copia si ricrea, non si resetta — la regola c'era già in CLAUDE.md.

## Stato roadmap
Voce Sentinella del 05/09 chiusa con la nota della seconda iterazione. Le
cinque ricerche del 05/09 sono tutte tradotte; anche Terra (garanzia e
collaudo) e Conti (mappa e TRN/CRO) sono a zero candidati aperti.

## Prossimo passo atomico
Terza iterazione della stessa scheda, sempre per confronto affiancato ma con
l'altra metà del riferimento: il **verbale del rilievo** di Terra
(`fogliaVerbale`, «Come è stato ottenuto il numero»). La domanda: la scheda
della volata dice DA DOVE viene ogni numero (la PPV: sismografo o trascritta;
la SD: calcolata da distanza e carica; la previsione: Genesi con la sua
base), ma non dice con quale REGOLA il punto giudica (`sogliaPreset`,
soglia del ricettore, unità) — la riga «Limite del punto di misura: N mm/s
(preset …, sul ricettore …)» presa da `sogliaEffettiva`/`sogliaPreset` del
punto, e «senza soglia dichiarata» quando manca. Prima di scrivere: aprire
`grep -n "sogliaEffettiva\|function sogliaDi\|sogliaPreset" apps/sentinella/sentinella-data.js`
e provare in scratchpad con il punto v1 della dimostrazione. Se la regola
del punto è già scritta altrove nel foglio (cercare «Limite dichiarato»
della previsione, che è un'altra cosa), dirlo e fermarsi.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
