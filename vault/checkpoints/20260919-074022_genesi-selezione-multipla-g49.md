# Checkpoint — 2026-09-19T07:40:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
42d2a5d6 — feat(genesi): selezione multipla dei fori — prima fetta (G49)

## Cosa è stato completato
Terzo cantiere Genesi del pivot: selezione multipla dei fori (G49),
secondo asse CAD confermato dal censimento dopo lo snap a oggetti (G48).

- [x] `D2.selMulti` (array di ID, non indici — stessa lezione già scritta
      per `D2.selPrev`): Maiusc+clic su un foro esistente lo aggiunge/
      toglie; un click senza Maiusc lo svuota; "Elimina selezionati"
      (bottone condizionale, stesso schema di "Fine tratto") li toglie
      tutti insieme con un solo `d2PushUndo`.
- [x] Scope volutamente più stretto della window/crossing selection
      piena proposta dalla ricerca: un modificatore su un click esistente
      non tocca né il click singolo (D2.sel) né la creazione di un foro
      su spazio vuoto. La selezione a rettangolo resta un passo
      successivo.
- [x] `foriSenzaId` in genesi-data.js, pura e testata.
- [x] Banco browser `genesi-selezione-multipla.mjs`: due scoperte fatte
      scrivendolo, non assunte — la scheda progetto nasce con una maglia
      di 12 fori già disegnata (i punti di prova si leggono da
      `D2.holes` dopo l'apertura, mai assunti come "canvas vuoto"), e il
      canvas nasce fuori dal viewport (y≈1381 su 900px): il mouse "vero"
      usato per aggirare l'intercettazione di `#d2-scheda` (stessa causa
      di G48) non scorre la pagina da solo come farebbe `.click()` su un
      locator — serve `scrollIntoViewIfNeeded()` esplicito.

## Verifica prima del commit
`run-kpi.mjs`: 3193/3193. `copertura-funzioni.mjs`: 346/346, 0 senza
prova. `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/43.
`suite-collegate.mjs`: 3/3 (197 file di banco). Banco
`genesi-selezione-multipla.mjs`: 14/14 normale, controprova 8/15 (7 KO
voluti, tutti sull'unica cosa che il difetto tocca).

## Stato roadmap
Bilancio del pivot su Genesi: due capacità CAD reali implementate e
provate (G48 snap a oggetti, G49 selezione multipla). Restano due
lacune confermate: trasformazioni (rotate/scale/mirror) e blocchi
riusabili + input relativo/polare pieno. La ricerca consiglia le
trasformazioni come prossimo passo, riusando proprio `D2.selMulti`
appena costruito.

## Prossimi passi
- **Prossimo passo atomico**: verificare la sezione "TRASFORMAZIONI" di
  `docs/RICERCA_GENESI_CAD.md` contro il codice, e valutare una prima
  fetta piccola — es. "elimina e rimonta specchiati rispetto a un asse"
  o un semplice "ruota di N gradi attorno al centro della selezione" sui
  fori in `D2.selMulti`, riusando la struttura appena costruita.
- Il giro completo del browser lanciato stamattina (PID 23083) era già a
  9 commit di distanza al penultimo controllo; con altri 3 commit da
  allora è probabilmente da rileggere/rilanciare per staleness prima di
  fidarsi di qualunque suo KO.
- Continuare a verificare ogni pezzo della ricerca CAD contro il codice
  PRIMA di implementare — la disciplina che ha già evitato due volte di
  costruire qualcosa che esisteva già o di fidarsi di un delta sbagliato.

## Blocchi
Nessuno.
