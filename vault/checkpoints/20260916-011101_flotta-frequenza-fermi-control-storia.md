# Checkpoint — 2026-09-16T01:11:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9820cb83

## Cosa completato
- Lanciata in background e appesa in coda (commit `5be7dd7f`) una ricerca
  continua su **Flotta** (undicesimo giro): cinque proposte — componenti a
  vita propria (pneumatici/cingoli/GET), manutenzione su condizione (analisi
  olio, da verificare in cava prima del codice), trend frequenza fermi
  (ripreso e sviluppato in questa unità), curva di costo crescente/vita
  economica, costo per tonnellata/m³ (richiede prima una decisione su un
  ponte Flotta↔Terra). I cinque grep sono stati riverificati
  indipendentemente prima di appendere.
- Implementata **`frequenzaFermiControStoria`** in `apps/flotta/flotta-data.js`
  — terza sorella di `consumoControStoria`/`costoControStoria`: il TASSO
  (episodi al giorno, non giorni persi) dei fermi confrontato fra la
  finestra recente e la storia del mezzo, con i due periodi divisi
  ciascuno per i propri giorni (non per una finestra fissa uguale per
  entrambi — è esattamente il difetto che la controprova ha confermato
  sapere prendere). Un fermo non collocabile non entra in nessuno dei due
  conti; zero storia → `calcolabile:false` con la ragione.
- Collegata a **`prioritaOperative`** come terza voce "trend" (badge "Fermi
  in aumento"), riusando il parametro `fermi` già esistente — nessuna
  modifica alla pagina, il rendering delle voci trend è generico (un solo
  punto di chiamata in `index.html`, nessuna stringa di badge cablata).
- Prototipata in scratchpad prima di scriverla nel modulo. **Lezione
  incontrata di nuovo**: il mio primo mock scratchpad di `dataISOEsiste`
  accettava "2026-02-30" (JS `Date.parse` la fa scorrere al 2 marzo invece
  di rifiutarla) — esattamente il bug-classe che CLAUDE.md documenta da
  mesi. Risolto scrivendo la funzione vera nel modulo (che usa l'`isoGiorno`
  reale, già indurito) e testandola con `run-kpi.mjs`, non fidandomi di una
  reimplementazione scratchpad semplificata.
- 5 test nuovi su `frequenzaFermiControStoria` + 1 su `prioritaOperative`
  in `run-kpi.mjs` (totale 3049/0, da 3043/0).
- Controprova su **entrambi** i livelli: (1) la funzione pura, iniettando
  la "copia debole" che divide per la finestra fissa invece che per i
  giorni veri della storia — la prova "ritmo stabile" cade come atteso;
  (2) il collegamento a `prioritaOperative`, disattivandolo con un
  `false &&` — la prova di wiring cade come atteso. Ripristinato da backup
  in entrambi i casi, `diff -q` conferma l'identità byte per byte.
- Trovata e corretta, di nuovo grazie a `numeri-nei-documenti.mjs` sulla
  worktree isolata, una cifra di copertura funzioni invecchiata lo stesso
  giorno (1019/1019 → 1021/1021, sei app) — **misurata**, non stimata a
  memoria come nell'unità precedente: questa volta ho aspettato il numero
  vero dal giro prima di scrivere qualunque cifra collaterale.
- `run-kpi.mjs`: 3049/0. `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`: 34/0.
  `funzioni-mai-usate.mjs`: 4/0 (la funzione nuova non è più orfana).
  `numeri-nei-documenti.mjs`: 43/0. Giro isolato (rilanciato due volte, la
  seconda dopo la correzione di copertura): **4010** asserzioni, 40/40
  comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3043→3049,
  somma nove suite 3.537→3.543, giro completo 4004→4010.
- Commit `9820cb83`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Restano aperte 4 delle 5 proposte Flotta
(componenti a vita propria, manutenzione su condizione, curva di costo/vita
economica, costo per tonnellata — quest'ultima richiede prima una decisione
architetturale) e 3 delle 4 proposte Conti (piani di rientro, sconto cassa
con il difetto collaterale reale in `esitoMovimento`, storico dei solleciti).

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Il difetto collaterale reale in Conti (`esitoMovimento` confonde un
   pagamento scontato legittimo con un acconto parziale) — merita un'unità
   a sé perché tocca la riconciliazione bancaria esistente, non solo
   un'aggiunta additiva.
2. Le 4 forme non standard rimaste della migrazione CSV righe fisiche
   (`scudo.scartiAzioniCsv`/`conti.scartiClientiCsv` su `leggiCsv()`;
   `conti.scartiPesateCsv`/`scartiIncassiCsv` su `cellePesate()`/
   `celleIncassi()`).
3. Rotazione ricerca continua: Scudo è l'unica delle sei app senza un giro
   di ricerca dedicato in questa sessione odierna (15-16/09) — candidato
   naturale per la prossima ricerca in background.
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
