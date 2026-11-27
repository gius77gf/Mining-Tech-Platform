# Checkpoint — 2026-09-13T05:29:13Z

## Tipo
nota di chiarimento (nessun codice toccato)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`cbc3fa87`

## Completato

Lo stop hook ha segnalato un file non tracciato:
`vault/checkpoints/20260913-045428_genesi-ricon-scroll-orizzontale-trovato.md`
era stato scritto (per documentare la SCOPERTA del difetto di scorrimento
nella griglia di riconciliazione) ma mai aggiunto all'indice — il lavoro
di quell'unità è proseguito dritto alla correzione invece che fermarsi lì,
e il commit successivo ha aggiunto solo il checkpoint di CHIUSURA
(`20260913-052259_genesi-ricon-scroll-chiuso.md`), lasciando il primo file
sul disco.

Recuperato e committato ora (`cbc3fa87`), con contenuto invariato: descrive
correttamente il momento della scoperta, prima della correzione.

⚠️ **Effetto collaterale da dichiarare, non da nascondere**: essendo
entrato in git DOPO il checkpoint di chiusura, `date-checkpoint.mjs` ora
segnala che il "più recente per nome" (052259, chiuso) e il "più recente
per data vera di git" (045428, scoperta) **sono diversi** — esattamente
il difetto che quello strumento esiste per catturare. Per chi legge
questa cartella: **il difetto della griglia di riconciliazione è
risolto**, il contenuto di verità è nel checkpoint di chiusura
(`20260913-052259`) e nel commit `7d3d2764`; questo mismatch è solo un
artefatto di ordine di commit, non un segno che la correzione sia
incompleta o che ci sia lavoro nuovo da fare su quel difetto.

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

Nessuno nuovo. Blocco di sicurezza su geometria/flyrock/burden invariato.

## Prossimo passo atomico

Nessuna azione necessaria sul difetto della griglia (chiuso). Le strade
aperte restano quelle already elencate: attendere risposta del fondatore
sulla segnalazione di sicurezza, proseguire la verifica visiva (scheda
signature-hole), o una nuova ricerca di fianco.

⚠️ **Lezione per i cicli futuri**: quando un'unità cambia rotta a metà
(da "dichiara e rimanda" a "corregge subito"), il checkpoint scritto per
la prima intenzione va o cestinato (se mai scritto su disco) o
committato SUBITO prima di proseguire — non lasciato sul disco mentre si
continua a lavorare, perché lo stop hook lo scopre solo alla fine e il
suo ordine di ingresso in git non rispecchia più l'ordine reale del
lavoro.
