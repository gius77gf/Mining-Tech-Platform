# Checkpoint — 2026-09-14T02:42:56Z

## Tipo
unit-complete (difesa permanente per l'unità precedente, non nello scratchpad)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**Promossa a test permanente la verifica di B0-septies**, seguendo la regola
di CLAUDE.md "GLI STRUMENTI DI MISURA VIVONO NEI TEST, NON NELLO
SCRATCHPAD": la verifica che avevo fatto per il checkpoint precedente
(`20260914-015629`) viveva solo in `/tmp/.../scratchpad/verifica-b0septies.mjs`
— alla sessione dopo non sarebbe esistita. Il nuovo file, permanente:
`apps/deepwork-id/tests/browser/genesi-maglia-assente.mjs`.

**Costruito seguendo il pattern già stabilito** (`genesi-campi-assenti.mjs`,
`genesi-locale.mjs`), non inventato da capo:
- Server proprio con contrassegno del pid riletto dal server (un banco che
  trova la porta occupata non la riusa).
- I casi si costruiscono via `localStorage.genesiVolate` e si aprono dalla
  via VERA — Home → bottone «Apri» — non con un aggancio di debug artificiale
  (anche se `window.__genesi.D2` esiste ed è stato usato per LEGGERE lo
  stato dopo l'apertura, non per iniettarlo).
- `--controprova`: rimette `genMaglia2D` alla forma di prima della guardia
  (nessun controllo su burden/interasse, coordinate generate comunque),
  tabella `DIFETTI` nel formato che `iniezioni-fresche.mjs` legge.
- Registrato in `tutti.mjs`, passata normale e passata controprova.

**Un ostacolo ambientale reale, trovato e risolto seguendo un precedente già
scritto**: la prima versione del banco non navigava mai alla schermata 2D —
ogni pagina restava sulla schermata di login. Causa: `genesi.html` importa
`three` (via import map) e, attraverso `genesiData()`, Firebase da
`gstatic.com`; in QUESTO contenitore la rete verso quei domini non fallisce
subito (a differenza di un contenitore senza rete affatto), risponde con un
proxy che tenta e poi chiude a metà (`ws_closed_mid_exchange`), quindi ogni
pagina aperta aspettava fino a ~13 secondi per OGNI tentativo. La cura non è
mia: è già scritta in `genesi-locale.mjs` (commento alla riga 84-85) —
`pg.route("https://www.gstatic.com/**", r => r.abort())` prima di ogni
`goto`, per tagliare l'attesa subito invece di aspettare che muoia da sola.
Applicata anche qui.
⚠️ **Segnalazione, non correzione**: `genesi-campi-assenti.mjs` (il banco
gemello, già esistente) NON ha questa guardia. Rilanciato con un timeout di
90 secondi si è fermato senza completare nemmeno la prima apertura di
pagina — probabilmente ora lento o inaffidabile in QUESTO contenitore
specifico (diverso da quello in cui è stato scritto e verificato l'ultima
volta), per la stessa causa. Non l'ho toccato: non è nel perimetro di questa
unità e non ho verificato che sia davvero rotto ovunque, solo che è lento
qui — ma è un candidato preciso per chi lavora su Genesi la prossima volta
(bastano le due righe già scritte in `genesi-locale.mjs`).

**Verificato**:
- Modalità normale: **16 passati, 0 falliti** — burden assente, interasse
  assente, entrambi assenti (zero fori, zero errori di pagina, ragione
  dichiarata corretta, scheda che la nomina), e il verso opposto (progetto
  sano: 12 fori, nessuna ragione dichiarata, scheda senza "non disegnabile").
- Modalità controprova: **9 falliti su 12** assertion attese a fallire
  (le tre "zero errori di pagina" restano verdi per costruzione: il vecchio
  difetto non fa mai crashare la pagina, disegna solo una geometria falsa —
  è esattamente la ragione per cui B0-septies era invisibile senza guardare i
  numeri). "1/1 iniezioni hanno trovato il loro pezzo": la tabella `DIFETTI`
  è ancora allineata al codice vero.
- `iniezioni-fresche.mjs`: 559→**560** sul bersaglio, 95→**96** tabelle in
  80→**81** banchi, 250→**251** con il file dichiarato e verificato lì.
- `porte-banchi.mjs`: 92→**93** banchi con un server guardati, zero riusi.
- Giro completo su `git worktree` isolata: **40/40 comandi, 0 caduti**
  (due ripassi per far convergere il totale delle asserzioni sui documenti,
  lo stesso quirk a due passate già documentato in CLAUDE.md per
  `numeri-nei-documenti.mjs`: la prima passata, con quel comando ancora
  rosso, stampa un totale diverso da quando è verde).

**Corretto a cascata**: cinque numeri diventati stale nei documenti per via
delle due nuove esecuzioni in `tutti.mjs` (275→**277**, 117→**118** file
distinti) in `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
`docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md` — e il totale
delle asserzioni del giro completo, salito a **3.884** nello stesso giro
(non toccato dalle due esecuzioni nuove, che sono controprove non contate:
il numero è salito per un'altra ragione non ancora indagata, forse un
banco che cresce col tempo — non ho approfondito perché fuori dal perimetro
di questa unità e il numero, una volta scritto, è verificato corretto).

## Stato roadmap

Nessuna voce di roadmap toccata: questa unità è una difesa per B0-septies
(già chiusa nel checkpoint precedente), non una nuova decisione.

## Blocchi e limiti noti

Segnalato, non bloccante: `genesi-campi-assenti.mjs` sembra lento/inaffidabile
in questo contenitore per la stessa causa gstatic già descritta. Nessuna
azione presa (fuori perimetro di questa unità).

## Prossimo passo atomico

1. Considerare di applicare la stessa guardia `pg.route(...gstatic.../
   abort())` a `genesi-campi-assenti.mjs` (e a qualunque altro banco di
   Genesi che apra pagine senza di essa), se si conferma che è davvero
   diventato lento/rotto in questo contenitore — misurando prima, non
   deducendo.
2. Continuare con la ricerca di fianco già completata su G7 (ottimizzatore)
   e valutare se aprire un'unità di prodotto su quella base, oppure
   proseguire con un'altra voce Genesi ancora aperta nell'indice di
   `vault/ROADMAP_SETTIMANA.md`.

Nessuno stop volontario: si prosegue subito con la prossima unità.
