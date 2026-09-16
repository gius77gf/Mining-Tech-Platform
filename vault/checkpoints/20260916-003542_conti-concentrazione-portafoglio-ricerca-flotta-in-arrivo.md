# Checkpoint — 2026-09-16T00:35:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6125ff90

## Cosa completato
- Lanciata in background una ricerca continua su **Conti** (decimo giro):
  quattro proposte (piani di rientro/dilazioni, concentrazione portafoglio
  clienti, sconto cassa con un difetto collaterale reale in `esitoMovimento`,
  storico dei solleciti inviati). I quattro grep a zero riverificati
  indipendentemente prima di fidarmene. Appesa in coda a
  `docs/RICERCA_CONTINUA_CONTI.md` (commit `008a62e5`).
- Implementata **`concentrazionePortafoglio`** in `apps/conti/conti-data.js`
  — la proposta più piccola e autonoma delle quattro: riusa
  `esposizioneClienti` (già ordinata per totale decrescente) invece di
  ricalcolare il totale una seconda volta; `calcolabile:false` con la
  ragione quando il credito aperto è zero (principio del fondatore:
  l'assenza non è un dato favorevole).
- Mostrata in `apps/conti/index.html`, scheda Clienti, come nota sotto la
  lista dell'esposizione: solo il numero dichiarato, nessun blocco
  automatico (stessa disciplina di `avvisoFidoPesata`).
- Prototipata in scratchpad prima di scriverla nel modulo (regola CLAUDE.md).
- Test in `run-kpi.mjs` (due nuovi, incluso il caso "zero credito aperto =
  non calcolabile, non zero per cento") e in `tests/browser/
  conti-barre-peso.mjs` (sezione 6, nuova): la quota mostrata nella pagina
  deve essere quella che le righe della lista stessa danno — non ricalcolata
  a parte — verificato leggendo il DOM col browser vero.
- Controprova su ENTRAMBI i livelli (modulo e pagina): difetto iniettato in
  ciascuno, la prova relativa cade come atteso; ripristinato da backup,
  `diff -q` conferma l'identità byte per byte in entrambi i casi.
- Trovata e corretta, grazie a `numeri-nei-documenti.mjs` sulla worktree
  isolata, una cifra di copertura funzioni invecchiata **lo stesso giorno**
  in cui la funzione nuova entra: 1018/1018 → 1019/1019 (sei app), in
  `docs/DEVELOPMENT.md` e `docs/STATO_PRODOTTO.md`.
  ⚠️ **Lezione per il prossimo ciclo**: la prima misura del giro isolato
  aveva scritto un valore per il totale "asserzioni eseguite dal giro"
  **stimato a memoria (4004)** invece di misurato — per puro caso ha
  coinciso col valore vero misurato dopo la correzione, ma la sequenza
  corretta (misurare *dopo* aver sistemato ogni cifra collaterale scoperta
  dal giro stesso, non scrivere un numero e sperare che regga) va rispettata
  sempre: il giro va rilanciato da capo ogni volta che si tocca un documento
  che il giro stesso legge.
- `run-kpi.mjs`: 3043/0. `numeri-nei-documenti.mjs`: 43/0. Giro isolato
  (rilanciato due volte, la seconda dopo la correzione): **4004** asserzioni,
  40/40 comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3041→3043,
  somma nove suite 3.535→3.537, giro completo 4002→4004 (misurato davvero).
- Commit `6125ff90`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.
- Lanciata in background una seconda ricerca continua, su **Flotta**
  (nessuna ricerca dedicata oggi finora): cinque proposte ricevute —
  componenti a vita propria (pneumatici/cingoli/GET, distinti dal mezzo),
  manutenzione su condizione (analisi olio), trend della frequenza fermi
  (riprende un gap dichiarato aperto il 15/09), curva di costo crescente/vita
  economica, costo per tonnellata/m³ movimentato (già confermata vera il
  14/08, riconfermata). **Non ancora appesa** a `docs/RICERCA_CONTINUA_FLOTTA.md`
  né riverificata indipendentemente: da fare nella prossima unità.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Restano aperte delle quattro proposte
Conti: piani di rientro, sconto cassa (con il difetto collaterale reale in
`esitoMovimento`), storico dei solleciti.

## Prossimo passo atomico
1. Riverificare indipendentemente i grep a zero della ricerca su Flotta
   (già ricevuta, in attesa) e appenderla a `docs/RICERCA_CONTINUA_FLOTTA.md`
   in coda, formato fisso, marcata "non verificato" sui costi/dettagli.
2. Poi aprire un'unità concreta: il tema 3 di quella ricerca
   (`frequenzaFermiControStoria`) è il più piccolo e già scritto come "copia
   esatta del pattern di `consumoControStoria`/`costoControStoria`" —
   candidato naturale per la prossima unità di codice.
3. In parallelo restano aperte: il difetto collaterale reale nello sconto
   cassa di Conti (`esitoMovimento` confonde un pagamento scontato legittimo
   con un acconto parziale — merita un'unità a sé, tocca la riconciliazione
   bancaria), e le 4 forme non standard rimaste della migrazione CSV
   (`leggiCsv`/`cellePesate`/`celleIncassi`).
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
