# Checkpoint — 2026-09-14T03:04:19Z

## Tipo
unit-complete (correzione ambientale su un banco esistente)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Applicata a `genesi-campi-assenti.mjs` la stessa guardia già scritta in
`genesi-locale.mjs` (`pg.route("https://www.gstatic.com/**", r=>r.abort())`
prima di ogni `goto`), segnalata come candidato nel checkpoint precedente
(`20260914-024256`) invece di essere lasciata scritta e basta.

**Verificato prima e dopo, non dedotto**: senza la guardia il banco non
riusciva a completare l'apertura della PRIMA pagina in 90 secondi (in questo
contenitore la rete verso `gstatic.com` non fallisce subito come in un
contenitore senza rete affatto — resta appesa fino al taglio del proxy).
Con la guardia: **53 passati, 2 falliti** su 64 asserzioni attese in circa
6 minuti e 20 secondi — i sedici campi sorvegliati e la domanda sulla carica
misurati per intero, la domanda sulla spalla dichiarata «NON MISURATA» (due
delle quattro schede di quella sezione non si sono aperte) invece di
accusare un difetto inesistente.
⚠️ **Non ho approfondito la causa della sezione «spalla» non misurata**: può
essere una flakiness di timing dopo ~6 minuti di uso continuo del browser,
non necessariamente collegata a questa correzione (che tocca solo la
velocità di apertura, non la logica). Lasciato dichiarato, non corretto:
misurare la causa esatta è un'unità a sé, e "non misurato" è l'esito onesto
per un soggetto che il banco non è riuscito a raggiungere — molto meglio
del comportamento precedente (il banco non arrivava nemmeno lì).

Nessuna modifica di logica: una riga aggiunta, nessuna tabella `DIFETTI`
toccata. `iniezioni-fresche.mjs` (560/560, invariato) e
`sintassi-pagine.mjs` (34/34, invariato) confermano che non è cambiato
niente altro. Giro completo su worktree isolata: **40/40 comandi, 0
caduti**, nessun numero di documento diventato stale (nessun bank nuovo
registrato, solo una correzione dentro uno esistente).

## Stato roadmap

Nessuna voce toccata: correzione ambientale su un banco già esistente, non
una decisione o un'unità di prodotto.

## Blocchi e limiti noti

La sezione "terza domanda: la spalla" di `genesi-campi-assenti.mjs` resta
non misurata in questo contenitore per una causa non ancora indagata.

## Prossimo passo atomico

Rileggere `vault/ROADMAP_SETTIMANA.md` (indice delle voci aperte) per la
prossima unità Genesi, o continuare con la ricerca di fianco già raccolta
su G7 (ottimizzatore di volata) verso un'unità di prodotto scomposta in
pezzi piccoli. Nessuno stop volontario.
