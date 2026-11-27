# Checkpoint — 2026-09-19T08:02:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a9f344db — docs: Decisione #43 — blocchi/simboli riusabili per Genesi (fondatore)

## Cosa è stato completato
Chiusa l'ultima voce della sezione 4 del censimento CAD verificato
(`docs/RICERCA_GENESI_CAD.md`): i blocchi/simboli riusabili per pattern
di fori ricorrenti. A differenza di G48 (snap a oggetti), G49
(selezione multipla) e G50 (rifletti la selezione) — tutte "prima
fetta piccola" senza toccare il modello dati di `D2` — i blocchi
richiedono un modello dati nuovo (definizioni + istanze con
posizione/rotazione/scala propria) e un flusso a più passi: non
un'estensione di quello che c'è. Filata come **Decisione #43** in
`docs/DECISIONI_WEEKEND.md`, non implementata — la scelta se e quando
aprire questo cantiere è del fondatore, coerente con la regola di
questa sessione (le decisioni architetturali/di prodotto vanno filate,
mai implementate unilateralmente).

- [x] Letta la sezione 4 della ricerca (righe 776-833+) e verificata
      contro il codice attuale di `D2`.
- [x] Decisione #43 scritta con il formato nuovo (checklist diretta,
      non la tabella `## N. Title` più vecchia — esente dal controllo
      incrociato `sezioni`/`citate`).
- [x] Isolata nella stessa decisione, come nota collaterale, la parte
      più economica della stessa sezione — l'input di coordinate
      relativo/polare (`@dx,dy` / `@dist<angolo`) per i campi
      `#diX`/`#diY` di G47a — dichiarata esplicitamente NON bloccata
      da questa decisione: può partire come cantiere a sé.
- [x] Header "le decisioni aperte sono" portato da **29** a **30**
      (un nuovo `- [ ]` non spuntato), verificato con
      `numeri-nei-documenti.mjs` prima e dopo.

## Verifica prima del commit
`numeri-nei-documenti.mjs`: 43/43 (decisioni: 30 aperte, 28 sezioni, 29
indicizzate — il nuovo formato non richiede la citazione in tabella).
`run-kpi.mjs`: 3197/3197. `sonda-vuoto.mjs`: 15/15.

## Stato roadmap
Bilancio del pivot su Genesi: tre capacità CAD implementate e provate
(G48, G49, G50), una lacuna grande filata come decisione per il
fondatore (blocchi), e un pezzo piccolo isolato e pronto da aggredire
(input relativo/polare).

## Prossimi passi
- **Prossimo passo atomico**: implementare l'input relativo/polare per
  i campi `#diX`/`#diY` (G47a) in `apps/genesi/genesi.html` — parser
  che riconosce `@dx,dy` (spostamento relativo al punto precedente) e
  `@dist<angolo` (distanza+angolo), altrimenti tratta l'input come
  assoluto (comportamento attuale invariato). Prima verificare in
  scratchpad la logica del parser (CLAUDE.md: funzione nuova si prova
  fuori dal modulo prima di scriverla dentro), poi funzione pura in
  `genesi-data.js` con test in `run-kpi.mjs`, poi banco browser con
  controprova.
- Controllare l'esito del giro completo del browser
  (`giro-completo-19-0745.log`, PID 6814, avviato 07:53:44Z) con
  `leggi-giro.mjs` (sezione 0 per prima) — non ancora verificato in
  questo checkpoint.
- Continuare il pattern ≥3 fronti dentro Genesi: valutare un nuovo
  agente Haiku di ricerca/QA su un'altra superficie di Genesi (in
  sequenza se tocca lo stesso file, per evitare la collisione già
  documentata).

## Blocchi
Nessuno.
