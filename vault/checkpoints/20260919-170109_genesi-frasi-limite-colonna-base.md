# Checkpoint — 2026-09-19T17:01:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b6ba5215 (fix(genesi): G56c, relief=null distingue primo della zona da vicino fuori distanza di adiacenza)

## Cosa è stato completato
Investigato il KO pre-esistente (non causato da G56c, confermato con
`git stash` su HEAD prima del lavoro di questa sessione) in
`apps/deepwork-id/tests/browser/genesi-frasi-limite.mjs`.

- [x] **Causa trovata**: l'asserzione pretendeva che la colonna
  `ppv_prev_base` fosse l'ULTIMA del CSV di riconciliazione
  (`csvRiconciliazione` in genesi-data.js). Era vero quando la prova è
  stata scritta; poi `campo_misfire` (G52) si è aggiunta DOPO di lei,
  per la stessa convenzione append-only che il modulo dichiara nei suoi
  commenti («la colonna si aggiunge in fondo, chi rilegge un export
  vecchio trova le altre nello stesso ordine»). Non è un difetto del
  prodotto: il prodotto è migliorato secondo la sua stessa regola, e la
  prova non l'aveva seguito.
- [x] **Corretta l'asserzione, non il prodotto**: adesso verifica che
  la colonna `ppv_prev_base` ESISTA per nome intero nell'intestazione
  (`(^|;)ppv_prev_base(;|$)`), non che sia l'ultima — è l'invariante
  vero che la prova doveva controllare fin dall'inizio.
- [x] Verificato che il banco sappia ancora fallire: `--controprova`
  rimette 10 difetti su 10 e fa cadere 15 prove.

## Verifica prima del commit
- `genesi-frasi-limite.mjs`: 36/0 (era 34 passati/2 falliti).
- `genesi-frasi-limite.mjs --controprova`: sa ancora fallire (15 prove
  cadute, 10/10 iniezioni rimesse) — invariato.
- `giro-node.mjs` completo: 41/41 comandi a posto, 0 caduti, numeri nei
  documenti ancora coerenti (nessun numero da propagare: questo banco
  vive fuori dal giro `node` e il conto delle sue 36 asserzioni non è
  cambiato, solo il loro verdetto).

## Stato roadmap
Chiuso il secondo dei due difetti trovati durante la verifica diretta
sugli export/scenari asimmetrici di Genesi (G56c + questa correzione).

## Prossimi passi
- **Prossimo passo atomico**: continuare la verifica diretta con scenari
  asimmetrici su altre funzioni foro-per-foro di Genesi che condividono
  la forma «vicino più vicino entro una distanza massima»
  (`innescoSuMaglia`, `energiaSuMaglia`) — potrebbero avere lo stesso
  difetto di `reliefSuMaglia` prima di G56c (null per due cause diverse).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
