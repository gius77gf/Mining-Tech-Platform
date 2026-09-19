# Checkpoint — 2026-09-19T00:05:12Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0e2a18a6 — fix(test): terra-sequenza-lotto pretendeva un articolo sbagliato ("il 80%")

## Cosa è stato completato
Il giro di convergenza lungo (PID 688, partito 20:01:20Z, attestava
`c50d652d`) aveva segnalato un solo KO vero:
`terra-sequenza-lotto.mjs` — "e la frase riporta ESATTAMENTE la
percentuale calcolata dal modulo (34,8%)". Per la regola del giro stesso
("ogni KO è vero A QUEL COMMIT, non adesso: si riverifica prima di aprire
un cantiere"), riverificato da zero contro il codice ATTUALE (28+ commit
dopo, 21 dei quali toccano superfici misurate):

- Ricalcolato a mano `sequenzaLotto(lo5, DEMO.lotti, DEMO.rilievi)` in
  Node: `precedentePct: 34.83` (62.700/180.000 m³ di lo4, rilievi r0+r1+r3
  su f1), frase `"aperto prima che Lotto 4 — settore Nord raggiungesse
  l'80%: oggi è al 34,8%"` — **il calcolo è corretto**, l'elisione
  italiana `articoloNumero("il","80")` sceglie giustamente `l'` (80 è
  nella fascia 80-89 che vuole l'apostrofo).
- Il banco però pretendeva testualmente `"raggiungesse il 80%"`
  (senza apostrofo) — un refuso della REGOLA DI TEST scritta il 16/09,
  non un difetto del prodotto: il commento della stessa unità (riga 16
  del banco) diceva già correttamente "l'80%", solo la regex
  dell'asserzione (riga 100) era rimasta con l'articolo sbagliato.
  Confermato eseguendo il banco riga per riga PRIMA della correzione:
  fallisce davvero, e il testo mostrato nell'errore contiene già
  `"l'80%"` — la prova che il prodotto non ha mai sbagliato.
- Corretta la regex. Rilanciato: 8/8 normale, controprova invariata
  (3 KO sotto `--controprova`, «1 su 1» iniezioni rimesse davvero).

Questo chiude l'unico KO vero segnalato dal giro lungo. **Nessun
difetto di prodotto**: era un difetto della prova, della famiglia
"il righello sbaglia, non il codice" già documentata più volte in
CLAUDE.md.

## Verifica dopo il commit
`run-kpi.mjs` 3177/3177 (invariato) · `sintassi-pagine.mjs` 34/34 ·
`run-stile.mjs` 330/330 · `numeri-nei-documenti.mjs` 43/43, 413 banchi,
copertura 1049/1049 (tutti i numeri già propagati restano validi, nessuna
propagazione necessaria in questo passo).

## Stato del giro lungo (PID 688)
Ancora vivo alle 00:05Z (etime ~3h52 al momento del controllo), file di
log ancora in crescita attiva (non fermo, non orfano) — non ucciso.
Il branch è però avanzato di 21 commit su superfici misurate dal suo
avvio: qualunque KO ulteriore che produca da qui in avanti va
ririverificato allo stesso modo prima di agire, e i suoi numeri non
vanno propagati nei documenti senza un giro fresco sul commit corrente.

## Stato roadmap
Tutte e sei le app hanno avuto almeno un giro di deep-pass QA mirato
oggi (18/09), alcune due. L'unico KO pendente dal giro lungo è chiuso.
Nessun finding noto rimasto aperto.

## Prossimi passi
- **Prossimo passo atomico**: nessun finding specifico in coda. Procedere
  col fallback di CLAUDE.md ("SE LA ROADMAP SEMBRA FINITA, NON È
  FINITA"): aprire un nuovo giro di ricerca-continua a rotazione su
  un'app diversa da quelle già toccate stasera dalla ricerca (l'ultima
  è stata Flotta, reorder-point/safety-stock, già chiusa), mantenendo
  la regola dei ≥3 cantieri paralleli; e/o una seconda iterazione
  UX/estetica con screenshot su un'app verticale (fallback punto 1).
- Continuare a controllare periodicamente il giro lungo (PID 688) senza
  fermarsi ad aspettarlo: se produce altri KO, riverificarli contro il
  codice attuale prima di agire, esattamente come fatto qui.

## Blocchi
Nessuno.
