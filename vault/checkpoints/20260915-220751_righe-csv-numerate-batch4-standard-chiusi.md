# Checkpoint — 2026-09-15T22:07:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d02c7950

## Cosa è stato completato
Quarto e ultimo lotto delle forme STANDARD: Conti —
`scartiFattureCsv`, `scartiGareCsv`, `scartiListinoCsv` (quest'ultimo
con la sua logica di `avvisi` per unità/IVA di ripiego, conservata
intatta).

Con questo lotto **i 18 lettori CSV in forma standard sono tutti
migrati** a `righeCsvNumerate` (numero di riga fisico nel file, dal
delta della riverifica sul documento invecchiato PAROLE, iniziato nel
commit `6a5707e7`). Riepilogo dei quattro lotti:
1. Terra: `scartiFrontiCsv`, `scartiRilieviCsv`.
2. Scudo: `scartiScadenzeCsv`, `scartiInfortuniCsv`; Sentinella:
   `scartiMonitoraggiCsv`, `scartiRicettoriCsv`, `scartiAdempimentiCsv`,
   `scartiVolateCsv`.
3. Campo: `scartiSquadreCsv`, `scartiPianoCsv`; Flotta:
   `scartiRicambiCsv`, `scartiMezziCsv`.
4. Conti: `scartiFattureCsv`, `scartiGareCsv`, `scartiListinoCsv`.

Restano sei forme NON standard, censite e lasciate fuori
deliberatamente perché non sono un drop-in sicuro (leggono celle già
parsate invece di testo grezzo, o riconoscono l'intestazione in modo
diverso da `isIntestazione` per parola chiave):
- `scudo.scartiLavoratoriCsv` — predicato locale (`/^(nome|azienda)$/i`)
  invece della parola chiave singola;
- `scudo.scartiAzioniCsv`, `conti.scartiClientiCsv` — basati su
  `leggiCsv()` (parser multi-riga per campi fra virgolette);
- `flotta.scartiTelemetriaCsv` — intestazione posizionale via
  `mappaTelemetriaCsv`;
- `conti.scartiPesateCsv`, `conti.scartiIncassiCsv` — basati su
  `cellePesate()`/`celleIncassi()`, parser dedicati con celle già
  separate.

## Verifica
- `run-kpi.mjs`: 3038 passati, 0 falliti (nuovo test B14).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0 (nessuna pagina
  toccata in nessuno dei quattro lotti). `copertura-funzioni.mjs`: 0
  scoperte, 1018/1018. `funzioni-mai-usate.mjs`: 0 da collegare.
- Controprova: vecchio conteggio reintrodotto in
  `conti.scartiListinoCsv` → B14 cade; ripristinato da copia,
  byte-identico.
- Giro completo su worktree isolata: 40 comandi, 1 caduto atteso
  (`numeri-nei-documenti.mjs`) — corretto (run-kpi 3038, somma nove
  suite 3.529, giro completo 3.995) e riverificato (43/0).

## Stato roadmap
La migrazione delle forme standard è chiusa. Le sei forme non standard
restano aperte come lavoro futuro, non urgente (nessun difetto per
l'utente: quei sei lettori funzionano, solo la numerazione "riga N" in
un messaggio di errore resta sulla vecchia convenzione).

## Prossimo passo atomico
Due strade, nessuna delle due urgente:
1. **Chiudere le forme non standard**, in tre unità separate (non una
   sola, per lo stesso motivo per cui questa migrazione è stata fatta
   a lotti): (a) estendere `righeCsvNumerate` per accettare un
   predicato oltre a una parola chiave, per `scartiLavoratoriCsv`
   (verificando che il contratto stringa esistente non cambi per i 18
   chiamanti già migrati); (b) dare a `leggiCsv()` un modo di esporre
   il numero di riga fisico di ogni riga parsata (serve a
   `scartiAzioniCsv`, `scartiClientiCsv`, e va verificato se lo stesso
   vale per `scartiTelemetriaCsv`); (c) lo stesso per
   `cellePesate()`/`celleIncassi()` (Conti).
2. **Cambiare fronte**: la rotazione della ricerca continua non ha
   ancora toccato Deepwork ID né il core in questo ciclo (vedi
   `vault/ULTIMO_CICLO.md`, commit `2251474b`). In alternativa, le due
   ricerche pendenti (Genesi — pannello "Burden per foro" su tutti i
   fori dalla ricostruzione 3D, nessun founder-decision richiesto ma
   costo medio; Campo — versione minima del ciclo di vita per-voce
   sui "lavori non conclusi", scartata dal ricercatore come non ancora
   "piccola e sicura") potrebbero maturare in un'unità se scomposte
   ulteriormente.

## Blocchi
Nessuno.
