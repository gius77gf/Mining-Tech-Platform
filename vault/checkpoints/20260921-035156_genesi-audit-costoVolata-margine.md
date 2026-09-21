# Checkpoint — 2026-09-21T03:51:56Z

## Tipo
verifica (nessun codice)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3ee7d87a (canarino: ciclo automatico vivo, 2026-09-21T03:48:16Z)

## Cosa è stato completato
Seguito il "prossimo passo atomico": audit del calcolo economico di
Genesi (`costoVolata`, margine) con lo stesso metodo delle unità
precedenti — lettura diretta del codice, poi verifica dal vivo con
Playwright.

- [x] **Letta `costoVolata` per intero**: è già il punto unico
  dichiarato (un tempo scritta tre volte, ora consolidata — il
  commento lo dice esplicitamente), con distinzione corretta
  null-vs-zero su ogni addendo (perforazione/esplosivo/inneschi), i
  prezzi con ripiego a zero DICHIARATO come scelta ("un prezzo non
  inserito è «non lo addebito»", non un dato assente), il ricavo
  indipendente dal costo (non sparisce se il costo non c'è), e il
  margine che sparisce SOLO se manca uno dei due (mai un sottrazione
  con `null` che produce un numero finto).
- [x] **Controllati i 4 punti che chiamano `costoVolata`** (KPI/3D live,
  export CSV, foglio stampabile, scheda validatori): ognuno passa un
  `nf` diverso (griglia di progetto vs fori disegnati) con la ragione
  scritta e incrociata nei commenti — non è una divergenza
  accidentale, è la stessa distinzione già vista e corretta altrove in
  questa stessa area (G "il Report conta sui fori disegnati, non la
  griglia" — già un'unità chiusa).
- [x] **Verificato dal vivo con Playwright**: aperta una volata demo
  con prezzi e valore materiale impostati, la scheda mostra "Totale
  volata €2.412" e "Margine (materiale 4,5 €/t) €11.426 (€13.838
  ricavo)" — **13.838 − 2.412 = 11.426**, l'aritmetica torna
  esattamente sullo schermo vero, non solo nella funzione isolata.
  Screenshot guardato: layout pulito a 390 px, nessun troncamento.
- [x] **Nessun difetto trovato.**

## Verifica prima del commit
Nessun codice toccato in questa unità.

## Stato roadmap
Con questa, il giro di audit diretto sulle funzioni "core" di calcolo
di Genesi avviato nei cicli precedenti è ora ampio: relief/innesco,
trasformazioni CAD, statistica di deviazione, signature-hole,
volume nuvola di punti, obiettivo x50/capacità foro, comparatore A/B,
export XML piano innesco, e ora costo/margine — **tutti confermati
solidi**, senza eccezioni trovate. Le ricerche specifiche (CAD/
JKSimBlast, mestiere della cava/blast report) sono chiuse.

## Prossimi passi
- **Prossimo passo atomico**: con l'audit manuale a rendimento
  fortemente decrescente (zero difetti trovati nelle ultime ~9
  aree controllate), cambiare metodo per il prossimo blocco:
  o (a) leggere per intero UNI 9916 e le ISEE guidelines invece dei
  soli riassunti WebSearch (l'unica pista di ricerca non ancora
  approfondita), o (b) verificare se `tests/simulatore/cava-sintetica.mjs`
  (il generatore di cava sintetica citato in CLAUDE.md) copre Genesi e,
  se sì, usarlo per uno stress-test massivo invece di casi singoli
  scelti a mano — il metodo che in altre app di questo ecosistema ha
  trovato difetti che i casi singoli non vedevano.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
