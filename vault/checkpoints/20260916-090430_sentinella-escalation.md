# Checkpoint — 2026-09-16T09:04:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
747d6431

## Cosa completato
- Riverificato indipendentemente, riga per riga sul codice vero (grep
  rilanciato, non sulla parola dell'agente), il nono giro di ricerca
  continua su Sentinella: entrambe le due mancanze dichiarate erano vere
  — `statPeriodo`/`confrontoMesi`/`andamentoRicettore` non sommano mai i
  superamenti di TUTTI i punti di un ricettore su una finestra mobile;
  nessuna identità propria dello strumento (matricola), solo il punto.
- Chiuso il delta **più fondato dei due**: l'escalation sui superamenti
  ripetuti. `superamentiUltimiGiorni(monitoraggi, ricettori, ricettoreId,
  oggi, finestraGiorni, sogliaPattern)` riusa `sogliaEfficace` (la stessa
  regola con cui un superamento si decide ovunque nell'app) e
  `lettureNelPeriodo` — non una settima copia del "questa lettura conta?".
  La soglia (quanti superamenti, quanti giorni) resta un PARAMETRO: nessuna
  fonte del mondo (ERP, TARP, entrambe di seconda mano) ne dà una
  universale.
- `bozzaAzioneSuperamento` diventa pattern-aware tramite `opts.pattern`
  opzionale e retrocompatibile: aggiunge "è il 3° superamento negli
  ultimi 30 giorni su questo ricettore" alla nota SOLO quando il pattern
  è raggiunto. Badge "N° in Mgg" nel ponte, silenzioso quando non
  pertinente.
- **NON implementato**: la seconda mancanza (identità dello strumento).
  La ricerca stessa la dichiara incerta — nessuna fonte conferma che le
  cave estrattive usino strumenti itineranti fra postazioni, è
  un'inferenza dal mondo dei laboratori — quindi è andata in
  `docs/DECISIONI_WEEKEND.md` come decisione 28, non implementata di
  iniziativa.
- **Trappola demo evitata, non pagata**: il piano iniziale era aggiungere
  letture recenti sopra soglia a `v2` (Vibrazioni V2 — confine Nord) per
  mostrare il pattern. Misurato PRIMA di committare: `v2` è collegato al
  ricettore `rc2`, la cui soglia vera è 20 mm/s — il punto esiste apposta
  per dimostrare che la soglia del ricettore vince su quella (più bassa)
  del punto (prova già esistente, riga ~22020 di run-kpi.mjs). Aggiungere
  letture a 5-6 mm/s (sopra i 5 del punto, sotto i 20 veri) non avrebbe
  mai generato un pattern; alzarle sopra 20 avrebbe rotto la narrazione di
  quella dimostrazione. Scoperto SOLO eseguendo la prova sintetica prima
  di toccare la demo — la stessa disciplina di "una funzione nuova si
  prova in scratchpad prima di scriverla nel modulo", applicata ai dati.
  Anche un secondo tentativo di aggiungere le letture (per il solo scopo
  di arricchire lo storico, senza badge) ha rotto due asserzioni esistenti
  di `coperturaTaratura` (i conteggi coperta/scoperta cambiano quando
  cambiano le letture nel periodo di validità di un certificato) — anche
  quello scartato.
- **Verificato invece nel browser iniettando un caso**, mai sul file su
  disco (`tests/browser/sentinella-escalation-superamenti.mjs`, sul
  modello del CASI di `scudo-verifica-periodica.mjs`): un punto/ricettore
  con date relative a `Date.now()` (non hardcoded, per non invecchiare).
  5/5 normale, controprova 1/1.
- Test in `run-kpi.mjs`: episodi veri vs letture sotto soglia, somma su
  tutti i punti del ricettore, soglia efficace del ricettore (non del
  punto), finestra mobile coi bordi esatti, nessuna soglia = nessun
  episodio, `bozzaAzioneSuperamento` con/senza pattern, e la prova
  onesta sulla dimostrazione (nessun pattern oggi, coerente con zero
  superamenti aperti — non forzato).
- ⚠️ Trovato e corretto durante la verifica: `oggiIso = new
  Date(oggi).toISOString().slice(0,10)` prendeva il giorno in UTC, non
  locale — la stessa famiglia di difetto documentata a lungo in
  CLAUDE.md (`docs/RICERCA_GIORNO_LOCALE_202607.md`). Corretto con
  `isoLocale`, già in `shared/`.
- Verifica: doppio giro isolato, stesso "far west" atteso su
  `numeri-nei-documenti.mjs` al primo passaggio, secondo verde: 40/40
  comandi, 4049 asserzioni confermate.
- Doc-cascade finale: run-kpi 3073→3080, somma nove suite 3.567→3.574,
  copertura 1040/1040→1041/1041, giro completo 4041→4049, banchi
  browser 307→309 esecuzioni / 133→134 file distinti.
- `copertura-funzioni.mjs`: FONDO sentinella 187→195 (7 erano arretrato
  di sessioni precedenti mai attribuito, dichiarato per nome; 1 di
  questa unità).
- Aggiunta la decisione 28 in `docs/DECISIONI_WEEKEND.md` (identità
  dello strumento) con la riga nella tabella indice, altrimenti
  `numeri-nei-documenti.mjs` la vedrebbe "fuori dalla porta d'ingresso".
- Commit `747d6431` (unità), in corso il commit del checkpoint.

## Stato roadmap
Sentinella ha chiuso il primo dei due delta del nono giro di ricerca
continua (l'unico dei due implementabile senza una conferma di
prodotto). Tutte e sei le app hanno avuto almeno un giro di ricerca
continua in questa sessione.

## Prossimo passo atomico
1. Nessuna app è "senza ricerca" — la rotazione ricorre da capo:
   candidato più fresco per un secondo passaggio è quello con meno
   giri fatti finora in questa sessione (verificare col conteggio dei
   giri nei rispettivi `docs/RICERCA_CONTINUA_<app>.md`).
2. Alternativa pronta senza nuova ricerca: Terra ha ancora tre delta
   aperti del tredicesimo giro (allerta apertura fuori programma,
   report per banco×anno) — l'allerta è parente stretto di
   `sequenzaLotto`, già scomposto concettualmente nel checkpoint
   precedente.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
