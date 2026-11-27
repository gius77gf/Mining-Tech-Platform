# Checkpoint — 2026-09-15T03:49:40Z

## Tipo
unit-complete (documento, nessun codice toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
baae0a9b (pushato)

## Cosa è stato completato

Lanciate tre passate in profondità in background su tre app non ancora
toccate questa finestra (agenti `a4d310e0a9aa33985` su Flotta,
`a4c697b7667ab3d28` su Conti, `a3aa9dc2aff01f1f8` su Sentinella), per
soddisfare la regola dei "almeno tre cantieri paralleli per blocco" e
continuare la caccia ai "numeri tranquilli". Sono ancora in corso al
momento di questo checkpoint: i loro risultati verranno riverificati a
mano — niente entra sulla parola dell'agente — quando arriveranno.

Nel frattempo, mentre gli agenti giravano, ho fatto una passata manuale
diretta su **Terra** (`terra-data.js`, ~3900 righe): il modulo si è
rivelato già estremamente maturo — ogni funzione candidata
(`detrazioneRecupero`, `baseOnereEscavazione`, `divarioRecupero`,
`attesaCollaudo`, `garanziaVincolata`) ha già, con commenti espliciti
datati, la difesa esatta della famiglia "numero tranquillo" che stavo
cercando (bandiere `misurabile`, avvisi quando un ripiego supera il
lordo, distinzione fra "zero" e "non misurato"). Nessun difetto vero
trovato lì in questa passata — dichiarato come tale, non forzato un
candidato debole.

Ho poi verificato lo stato del blocco roadmap "D-ter — le otto verdi
che vogliono un cantiere" (5a, 5b, 10a, 10b, 12a, 15, 18a, 18b): **tutte
già decise**, e delle costruibili quasi tutte già costruite (18a/18b il
07/08, 10b e 12a per la stessa data secondo `docs/DECISIONI_WEEKEND.md`
riga 339); restano bloccate legittimamente solo 10a (barriera
abbonamento — richiede prima chi scrive gli entitlement, nessuna app lo
fa oggi) e 15 (Il Quadro — decisione presa, ma nessun codice ancora
scritto: sei ponti da costruire, unità grande, non atomica) e la metà
"funzione" di 5b (coda offline — bloccata sulla decisione del fondatore
su chi vince in un conflitto di scrittura). Nessuna azione presa su
questi tre: sono correttamente bloccati, non abbandonati per scelta.

**Trovato invece un difetto più piccolo ma concreto in un documento**:
`docs/CONCORRENTI_FLOTTA.md` (riga 512) proponeva ancora come "unità da
aprire" la regola "il primo dei due" (ore **o** mesi, quello che arriva
prima, per i tagliandi) — ma leggendo `apps/flotta/flotta-data.js`
(`prossimoTagliando`, righe 2603-2662) quella regola era **già stata
decisa e costruita l'11/09**, poche ore dopo che la riga del documento
era stata scritta (la nota di 11/09 nel documento cita la stessa
ricerca che poi ha portato al commit dello stesso giorno). Verificato:
- Il codice gestisce già il caso `ogniOre > 0 && ogniMesi > 0` generando
  entrambe le scadenze (`da: "entrambi"`), con `oreIgnote` quando manca
  il contatore.
- Test dedicato già presente in `run-kpi.mjs`: "⛔ Flotta ·
  prossimoTagliando con ore E mesi: nascono tutt'e due le scadenze...".
- `grep -cE 'da: "entrambi"' apps/flotta/flotta-data.js` → **2** (ho
  scritto per errore "3" nella prima stesura della correzione, e l'ho
  ricontrollato e corretto PRIMA di committare — regola "un comando si
  rilancia, un numero si può solo credere").

Corretta la riga del documento per dichiarare la chiusura con la prova,
invece di lasciare un "non c'è" scaduto che avrebbe mandato un cantiere
futuro a rifare un lavoro già fatto (esattamente la famiglia di difetto
"documento invecchiato" che CLAUDE.md descrive più volte). Nessun
codice toccato: `numeri-nei-documenti.mjs` non sorveglia questo file,
riverificato comunque 43/0 dopo la modifica (nessun impatto).

## Stato roadmap

Nessuna voce di roadmap chiusa in questa unità (era una correzione di
documentazione, non un'unità di roadmap). In attesa dei tre report degli
agenti in background su Flotta/Conti/Sentinella.

## Prossimo passo atomico

Quando arriva il report di uno dei tre agenti (`a4d310e0a9aa33985`
Flotta, `a4c697b7667ab3d28` Conti, `a3aa9dc2aff01f1f8` Sentinella),
riverificare a mano ogni difetto proposto (grep/lettura diretta del
codice, mai fidarsi della parola dell'agente) prima di scrivere
qualunque riga di codice; se un difetto è confermato, seguire la
disciplina rodata: fix → test con difetto iniettato e rimesso a posto →
giro isolato su worktree → `git status --short` prima del commit →
checkpoint → push. Se tutti e tre i report tardano, continuare con
un'altra passata diretta (io stesso, come su Terra) sulla app rimanente
non ancora coperta questa finestra, o tornare al blocco "B4 — le
mancanze confermate del delta" per un altro candidato piccolo e già
deciso come quello appena chiuso qui.

Nessuno stop volontario: si prosegue subito.
