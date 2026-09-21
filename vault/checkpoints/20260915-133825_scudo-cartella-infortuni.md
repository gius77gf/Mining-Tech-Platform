# Checkpoint — 2026-09-15T13:38:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8b228557

## Cosa è stato completato
Quindicesima unità del ciclo odierno: `cartellaLavoratore` (Scudo) ora
accetta `infortuni` e include nel fascicolo personale gli infortuni VERI
(non i near-miss) collegati al lavoratore tramite un nuovo campo
`lavoratoreId` (facoltativo, aggiunto al form di registrazione evento).
`fogliaCartella` stampa una sezione "Infortuni" solo quando ce n'è almeno
uno collegato. Zero infortuni non entra fra i "vuoti": è lo stato sperato
di una persona.

Chiude parzialmente il finding 3 (la radice) dell'ottavo giro di ricerca
su Scudo — secondo passaggio più approfondito su infortuni e denuncia
INAIL, tornato dal background. **Incidente di processo**: l'append
dell'agente a `docs/RICERCA_CONTINUA_SCUDO.md` non è mai arrivato
committato (worktree rimosso prima di accorgersi che il contenuto era
ancora solo nel working tree — stessa famiglia dell'incidente Campo del
5° giro). Recuperato dal report finale dell'agente e **ogni affermazione
riverificata di persona** prima di scriverla: tutti e 4 i finding
confermati (nessuna scadenza/documento INAIL; scala di gravità a due
valori; il `lavoratoreId` mancante — la radice; nessun follow-up per
persona). Un rischio latente segnalato (UNI 7249 sui giorni convenzionali
per invalidità permanente/morte) è dichiarato per chi apre un cantiere
futuro sulla scala di gravità.

Test: `run-kpi.mjs` +1 blocco, con controprova (tolto il filtro
tipo==="infortunio", confermata la caduta sull'esclusione del near-miss,
ripristinato e riverificato byte-identico con `diff`).

## Verifica
- `run-stile.mjs`, `sintassi-pagine.mjs`, `nomi-liberi.mjs` (giro
  completo): puliti dopo aver rimosso il worktree residuo dell'agente
  (che causava 16 falsi "pagina non guardata" — stesso falso allarme già
  visto e documentato due volte in questa sessione)
- Giro isolato su worktree pulita (`/tmp/wt-scudo-lavoratoreid`, ora
  rimossa): 39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni invariata (1006/1006): estensione di funzioni
  esistenti, nessuna funzione nuova — misurato
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1006/1006
- Worktree rimosse con `git worktree remove --force` + `git worktree prune`
  (unità propria e quella residua dell'agente)
- Push riuscito al primo tentativo: `19156c19..8b228557`

**In parallelo, un giro browser mirato** (`tutti.mjs
--solo=campo,conti,flotta,terra --limite=1800`) è tornato dal background
durante questa unità: da controllare (non ancora letto per intero).
Segnali visti a metà giro: tre possibili difetti reali in Conti (residuo
del file di export diverso dalla riga a schermo su una nota di credito;
un prodotto senza prezzo che esporta "0" invece di una cella vuota nel
listino) — nessuno di questi tocca le funzioni modificate in questa
sessione (né `testoSollecito` né `fattureOltre90`), quindi probabilmente
difetti pre-esistenti mai visti prima da un giro browser in questa
sessione.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Otto giri di ricerca aperti/chiusi in
questo ciclo. Restano aperti nell'ottavo giro su Scudo: il finding 1
(scadenza/documento INAIL — tre termini diversi, chiede una scelta),
finding 2 (terzo gradino di gravità, tocca anche il rischio UNI 7249) e
finding 4 (stato aperto/chiuso, ora possibile col `lavoratoreId` appena
aggiunto).

## Prossimo passo atomico
Leggere per intero `/tmp/giro-browser-mirato.log` (o rilanciarne la
lettura con lo strumento apposito se esiste, `leggi-giro.mjs` è pensato
per il giro `node`, non per `tutti.mjs` — verificare) per capire la
portata reale dei tre KO visti in Conti prima di aprire un cantiere:
riprodurli a mano, capire se sono difetti veri o un banco che non guarda
dove crede (famiglia già vista molte volte in questo file). Se confermati,
sono piccoli e mirati (un residuo di nota di credito, uno zero-vs-vuoto in
un CSV) — candidati naturali per la prossima unità di codice. In
alternativa, continuare il resto dei finding aperti di Scudo (finding 4,
piccolo e ora sbloccato).
