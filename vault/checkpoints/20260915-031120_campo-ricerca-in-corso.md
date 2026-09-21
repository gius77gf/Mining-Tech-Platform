# Checkpoint — 2026-09-15T03:11:20Z

## Tipo
misura (nessun commit di codice in questa unità, ricerca in corso)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d92647e6

## Cosa è stato fatto

Con la sezione appalti di Scudo chiusa (checkpoint precedente), ho
verificato Campo prima di aprire un cantiere: a differenza di Scudo,
**tutte e cinque le sue sezioni di navigazione** (`nav-dash`,
`nav-att`, `nav-squ`, `nav-rap`, `nav-set`) hanno già almeno un banco
browser dedicato (`campo-numeri-tranquilli.mjs`,
`campo-foglio-turno.mjs`, `campo-sentinella-frasi.mjs`,
`campo-disegni.mjs`, più i due banchi-ponte
`ponte-genesi-campo.mjs`/`conti-ponte-campo.mjs`). Non c'è quindi una
sezione scoperta come "appalti" era per Scudo: il prossimo difetto, se
c'è, va cercato in un caso limite non ancora provato dentro una
sezione già in parte coperta, non in uno schermo mai aperto.

Lanciato un agente in background con un mandato più mirato di quello
usato per Scudo: prima mappare quali funzioni pure di `campo-data.js`
hanno una copertura sottile in `run-kpi.mjs` (solo il percorso
felice), poi concentrarsi sui **ponti** verso Genesi e Conti — dove
questo repository ha già preso i suoi difetti peggiori di "numero
tranquillo" in altre app (riferimenti orfani dopo una cancellazione,
id disallineati fra due app) — e verificare dal vivo con Playwright,
non dedurre dal codice.

## Prossimo passo atomico

Attendere il risultato dell'agente. Se trova un candidato misurato
dal vivo: stesso schema già applicato a Scudo — correggere nel modulo
dati (mai un dialogo del browser, mai una copia riscritta), aggiungere
la prova con difetto iniettato al banco più pertinente (o crearne uno
nuovo se il candidato è in un'area davvero scoperta), cascata
documenti se tocca un numero sorvegliato, giro isolato su worktree,
commit, checkpoint.

Se l'agente non trova nulla di misurato: registrare comunque che cosa
è stato provato e scartato (per nome — regola «MISURATO PRIMA DI
IRRIGIDIRE»), e valutare se continuare su un'altra app (Flotta, Conti,
Sentinella, Terra) o tornare a un altro binario della fase v7.0 (i
ponti dell'ecosistema, se un candidato concreto emerge rileggendo
`docs/MAPPA_ECOSISTEMA.md` con più cura di quanto fatto finora).

Nessuno stop volontario: si prosegue appena l'agente risponde.
