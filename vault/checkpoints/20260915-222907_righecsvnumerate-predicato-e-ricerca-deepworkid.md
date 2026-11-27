# Checkpoint — 2026-09-15T22:29:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d3b04b14

## Cosa è stato completato
Due filoni chiusi nella stessa unità (entrambi piccoli, verificati
separatamente con la loro controprova):

**1. Estensione di `righeCsvNumerate`** (shared/deepwork-id-client/
dw-shell.js): accetta ora, oltre a una parola chiave singola, un
PREDICATO (funzione che riceve la riga di testo grezza). Contratto a
stringa invariato per i 18 chiamanti già migrati. Migrato con lei
`scudo.scartiLavoratoriCsv`, l'unico lettore che riconosce
l'intestazione sulla prima CELLA già scomposta ("nome"/"azienda")
invece che con `isIntestazione`. **19 lettori ora migrati, restano
cinque forme non standard** basate su celle già parsate
(`scudo.scartiAzioniCsv`, `flotta.scartiTelemetriaCsv`,
`conti.scartiPesateCsv`, `conti.scartiIncassiCsv`,
`conti.scartiClientiCsv`).

**2. Terzo giro di ricerca su Deepwork ID** (rotazione della ricerca
continua, mai passata al setaccio in questa sessione prima d'oggi):
riverificata la revoca degli accessi. `docs/RICERCA_DEEPWORKID_202607.md`
(R4, 26/07) aveva già visto correttamente che sul percorso gratuito il
claim resta valido finché non si rilancia un aggiornamento manuale —
non una scoperta nuova. Verificato oggi, riga per riga: non esiste
nemmeno lo script per farlo (`onMemberWrite`/`rebuildClaims`/
`removeMember` scritte e testate ma mai deployate — piano Spark, niente
Cloud Functions; `ls apps/deepwork-id/scripts/` → solo
`bootstrap-owner.mjs`). Appeso in coda a `RICERCA_DEEPWORKID_202607.md`
(mai sovrascritto) e aggiunta la voce **31** in
`docs/DECISIONI_WEEKEND.md` — non implementato, è una decisione di
sicurezza multi-tenant (tocca l'architettura e la scelta già presa dal
fondatore di non attivare Blaze).

## Verifica
- `run-kpi.mjs`: 3039 passati, 0 falliti (nuovo test B15).
- `run-helpers.mjs`: 83 passati, 0 falliti (nuovi test sul predicato,
  incluso «un predicato che dice sempre sì scarta tutto»).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0 (nessuna pagina
  toccata). `copertura-funzioni.mjs`: 0 scoperte, 1018/1018.
  `funzioni-mai-usate.mjs`: 0 da collegare.
- Controprova (×2): (a) reintrodotto il vecchio contratto a sola
  stringa nell'helper condiviso → i test del predicato cadono; (b)
  reintrodotto il vecchio conteggio (posizione nell'elenco filtrato) in
  `scartiLavoratoriCsv` → B15 cade. Ripristinato da copia in entrambi i
  casi, byte-identico.
- Giro completo su worktree isolata: 40 comandi, 1 caduto atteso
  (`numeri-nei-documenti.mjs`) — corretto con le cifre reali misurate
  (run-kpi 3039, run-helpers 83, somma nove suite 3.531, giro completo
  3.997) e riverificato (43/0). Corretto anche il conteggio delle
  "decisioni aperte" (17→18) in cima a `DECISIONI_WEEKEND.md` dopo aver
  aggiunto la voce 31 — un secondo controllo di quel file
  ("la porta d'ingresso conta le decisioni aperte che ci sono davvero")
  l'aveva preso subito.

## Stato roadmap
Restano cinque forme non standard dei lettori CSV, tutte a bassa
priorità (nessun difetto per l'utente, solo la numerazione "riga N" in
un messaggio d'errore resta sulla vecchia convenzione). Deepwork ID ha
avuto la sua passata di ricerca in questo ciclo; resta il core
(index.html alla radice) come unica superficie non ancora toccata da
una ricerca dedicata in questa sessione.

## Prossimo passo atomico
Nessuna unità di codice è pronta e sicura senza una decisione del
fondatore in questo momento su questi due filoni (i lettori non
standard richiedono ciascuno un cambiamento più grande a `leggiCsv`/
`cellePesate`/`celleIncassi`/`mappaTelemetriaCsv`; la voce 31 aspetta
una risposta). Il ciclo prosegue con:
1. Una ricerca a rotazione sul core (`index.html` alla radice), mai
   passata al setaccio in questa sessione.
2. In alternativa, riprendere `docs/GENESI_ROADMAP_COMPETITOR.md` con
   la proposta già scomposta dal secondo giro di ricerca su Genesi di
   oggi (pannello "Burden per foro" su tutti i fori dalla ricostruzione
   3D automatica — nessuna decisione del fondatore richiesta, costo
   dichiarato "medio", non ancora messa in costruzione).
3. Seconda iterazione UX/estetica su un'app non ancora toccata in
   questo ciclo (es. Genesi o il core).

## Blocchi
Nessuno tecnico. Due filoni sono ora in attesa di decisione del
fondatore (voce 31, e le forme non standard restano un rischio noto e
basso, non un blocco).
