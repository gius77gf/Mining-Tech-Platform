# Checkpoint — 2026-09-16T00:02:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0cf6223c

## Cosa completato
- `apps/flotta/flotta-data.js`: migrata `scartiTelemetriaCsv` a `righeCsvNumerate`
  con un **predicato** invece di una parola chiave — è l'ultima forma "non
  standard" col meccanismo di riconoscimento intestazione a matchare quello
  già risolto per `scudo.scartiLavoratoriCsv`: qui l'intestazione si riconosce
  per NOME di colonna (`mappaTelemetriaCsv`), non con una parola fissa, quindi
  il predicato chiede "sono la prima riga vista?" (chiuso su `perNome` e un
  flag mutabile) invece di ispezionare il contenuto della riga.
- La riga persa senza nome del mezzo, nella forma **posizionale** (senza
  intestazione riconoscibile), ora si nomina con la riga **fisica** nel file
  invece che con la posizione fra i sopravvissuti — verificato con due casi in
  scratchpad prima di toccare il modulo.
- Aggiornati due test preesistenti in `run-kpi.mjs` che assumevano ancora la
  vecchia numerazione (`"riga 4"` → `"riga 5"` nella tabella NOVE; `"riga 3"` →
  `"riga 4"` nel test dedicato dell'export OEM), più un nuovo test B16 con due
  casi (intestazione per nome + forma posizionale).
- Controprova: rimessa la vecchia numerazione per posizione con un contatore
  locale, la prova B16 cade come atteso (`atteso "riga 5", ottenuto "riga 3"`);
  ripristinato da backup, `diff -q` conferma l'identità byte per byte.
- `run-kpi.mjs`: 3041/0 (da 3040/0). `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`:
  34/0. Nessuna regressione.
- Giro isolato su worktree: **4002** asserzioni (40 comandi, 0 caduti).
  `numeri-nei-documenti.mjs`: 43/0 sull'albero vivo dopo la correzione.
- Doc-cascade aggiornato in `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md`: run-kpi
  3040→3041, somma nove suite 3.534→3.535, giro completo 4001→4002.
- Commit `0cf6223c`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.
- **Chiude la migrazione `righeCsvNumerate`**: restano solo 4 forme non
  standard basate su celle già parsate (`scudo.scartiAzioniCsv`,
  `conti.scartiClientiCsv`, entrambe su `leggiCsv()`; `conti.scartiPesateCsv`/
  `scartiIncassiCsv`, su `cellePesate()`/`celleIncassi()`), invece delle
  cinque precedenti.
- Lanciata in background una ricerca continua su **Conti** (decimo giro,
  agente general-purpose con WebSearch): quattro proposte nuove — piani di
  rientro/dilazioni, concentrazione portafoglio clienti, sconto cassa (con un
  difetto collaterale reale in `esitoMovimento`: un pagamento scontato
  legittimo viene letto come acconto parziale), storico dei solleciti
  inviati. Tutte le quattro mancanze dichiarate portano il comando grep e la
  sua uscita letterale; **ho riverificato indipendentemente i quattro grep a
  zero prima di fidarmene** (tutti confermati: 0 su tutti e quattro i temi in
  `conti-data.js` e `index.html`). Da appendere a
  `docs/RICERCA_CONTINUA_CONTI.md` (in coda, mai sovrascrivendo) nella
  prossima unità, marcato "proposto da ricerca, non verificato" per il resto
  del contenuto (costi stimati, dettagli di implementazione).

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Migrazione CSV righe fisiche: chiusa nella
forma "tutti i lettori esistenti, standard e non", tranne le 4 forme a celle
già parsate sopra elencate (unità dedicata più grande, a parte).

## Prossimo passo atomico
1. Appendere il decimo giro di ricerca su Conti (già ricevuto, verificato nei
   suoi quattro grep a zero) a `docs/RICERCA_CONTINUA_CONTI.md`, in coda, col
   formato fisso (schermata · che cosa non va · come si vede · quanto costa ·
   come si misura) e la marcatura "non verificato" sui dettagli di stima.
2. Poi aprire un'unità concreta su una delle quattro proposte — la più piccola
   e autonoma è la **concentrazione portafoglio clienti** (funzione pura
   `concentrazionePortafoglio`, nessun nuovo dato da raccogliere, si appoggia
   a `esposizioneClienti` già esistente) — o continuare con le 4 forme non
   standard rimaste della migrazione CSV.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
