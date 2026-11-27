# Checkpoint — 2026-09-16T13:20:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6225df74

## Cosa è stato completato
Passata "in profondità" su Campo (binario 2 della fase aperta dal fondatore
il 26/08), seguendo il metodo dichiarato: aprire i documenti che ESCONO
(bottoni che producono un file) e confrontarli con la loro sorella a
schermo. Letto `rapportoGiornata` e `testoConsegnaTurno` in
`apps/campo/campo-data.js` (i due documenti "sorella" della giornata), poi
il loro cablaggio in `apps/campo/index.html`.

**Difetto trovato, reale**: `rapportoGiornata` — il rapporto di fine turno
che si STAMPA E SI FIRMA — aveva guadagnato la sezione "Volate del giorno"
il 15/09 (commit `21759bfe`, dal delta della ricerca sul "mestiere della
cava"), testata a fondo come funzione pura in `run-kpi.mjs`. Ma il punto in
cui la PAGINA la chiama (`$("btn-rapporto-turno").onclick`) non passava mai
`volateSentinella: VOL_SENT` — un semplice dimenticanza di cablaggio,
diversa dal bug del modulo dati (che era corretto). Effetto: quella sezione
del documento firmato diceva SEMPRE "Sentinella non raggiungibile", anche
quando il ponte P6 aveva letto dati veri — mentre `testoConsegnaTurno`
(bottone "Consegna di turno"), lo stesso identico dato, lo riceveva già,
dallo stesso ponte.

Un test di cablaggio esisteva già per questa chiamata (`run-kpi.mjs`:
"Campo · la pagina non compone più nessuna sezione del rapporto stampato"),
ma il suo regex guardava solo l'INIZIO della riga della chiamata (fino ad
`attivita: ATT_OGGI`) — non arrivava al parametro mancante, scritto più
avanti nella stessa chiamata. È la stessa famiglia già scritta in
CLAUDE.md: un controllo che esiste ma non guarda abbastanza della riga che
deve sorvegliare.

**Correzione**:
- `apps/campo/index.html`: aggiunto `volateSentinella: VOL_SENT` alla
  chiamata di `rapportoGiornata` nel bottone "Rapporto di fine turno".
- `apps/deepwork-id/tests/run-kpi.mjs`: rinforzato il test di cablaggio
  esistente con un nuovo test dedicato che verifica ESPLICITAMENTE che
  ENTRAMBE le chiamate (`testoConsegnaTurno` e `rapportoGiornata`) passino
  `volateSentinella: VOL_SENT`, con un commento che spiega la storia del
  buco (perché non si ripeta in silenzio).
- Controprova manuale: rimosso `volateSentinella: VOL_SENT` dalla pagina
  con una patch Python temporanea, confermato che il nuovo test cade sul
  ramo `rapporto`, ripristinato via `cp` + `diff` (identico all'originale),
  confermato verde di nuovo.

run-kpi 3096→3097, run-stile/sintassi-pagine/copertura-funzioni tutti
verdi. Doc-cascade aggiornato in tutti e quattro i documenti sorvegliati:
somma nove suite 3.590→3.591, giro-totale 4068→4069. Giro isolato su
worktree pulita: **40/40 comandi, 0 caduti, 4069 asserzioni, primo
tentativo** (nessuna iniezione da ri-ancorare questa volta, a differenza
dell'unità precedente).

## Stato roadmap
Nessun task esplicito della roadmap settimanale interessato: era una
passata in profondità auto-diretta su Campo, come richiesto dal kickoff del
ciclo corrente (binario 2, "aprire ogni schermata, premere ogni bottone che
produce un file, aprire il file"). §3h di `docs/MAPPA_ECOSISTEMA.md` (il
censimento di nuove sovrapposizioni, binario 1) risultava già chiuso al
16/09 con "sovrapposizioni non collegate: 0" prima di questa unità — non
riaperto, verificato leggendo il documento invece di rifare il censimento.

## Prossimo passo atomico
Proseguire la stessa passata in profondità su Campo (o su un'altra app):
candidati aperti sul MEDESIMO metodo (documenti che escono confrontati con
lo schermo):
1. Continuare su Campo: aprire `csvStorico`, `csvAttivita`, `csvAppello`,
   `csvSquadre` (righe 846-2773 di `campo-data.js`) e confrontare le loro
   colonne coi campi che lo schermo mostra — stesso metodo appena riuscito.
2. Ripetere lo stesso "documento gemello" su un'altra app che abbia due
   funzioni sorelle (una per lo schermo/testo, una per la stampa): Scudo ne
   aveva una (chiusa in questo blocco, unità precedente); controllare se
   Sentinella, Conti, Flotta o Terra hanno lo stesso schema di coppie
   testo/stampa con un cablaggio da verificare riga per riga (non fidarsi
   di un test di cablaggio esistente che controlla solo l'inizio della
   chiamata: la lezione di questa unità è che va esteso a verificare OGNI
   parametro rilevante, non solo la presenza della chiamata).
3. In alternativa: ASSENZA P2 (colonna di vocabolario condiviso su 11 CSV),
   se si vuole affrontare la decisione di design più grande rimasta aperta.

## Blocchi
Nessuno. Repository raggiungibile, worktree pulite dopo l'uso.
