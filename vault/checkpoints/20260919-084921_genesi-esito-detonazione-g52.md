# Checkpoint — 2026-09-19T08:49:21Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e729faeb — feat(genesi): l'esito della detonazione — misfire nella riconciliazione (G52)

## Cosa è stato completato
Sesto cantiere Genesi del pivot, e il primo che non viene dal censimento
CAD ma da `docs/RICERCA_CONTINUA_GENESI.md` (la ricerca continua in
background, letta a fine blocco come vuole CLAUDE.md): un buco di
sicurezza reale, verificato indipendentemente con `grep` prima di
implementare.

- [x] **Il problema**: il consuntivo Campo→Genesi porta i chili caricati
      ma non l'esito della detonazione — un foro caricato e MAI sparato
      (misfire, colpo cieco) produce lo stesso scostamento vicino a
      zero di uno sparato regolarmente. Confermato con `grep` mirato:
      zero occorrenze di "misfire"/"colpo cieco" in tutto Genesi.
- [x] Colonna opzionale `esito` (`sparato`/`misfire`) in
      `_riconParseCampo`, letta per nome, retrocompatibile (un
      consuntivo di ieri resta leggibile, senza inventare un default).
- [x] `_riconRiassuntoCampo`: tre uscite dichiarate — colonna assente
      (`nMisfire:null`, "non lo so"), colonna presente e zero
      (`nMisfire:0`, uno zero VERO), colonna presente e N misfire
      (allarme). Lo stesso principio del fondatore già applicato a
      `misurabile`/`kgReale`, qui sul dato più pericoloso della
      schermata.
- [x] Avviso rosso distinto (`.ricamp-danger`, nuovo — non il
      `.ricamp-warn` arancione delle note di qualità dati) in cima alla
      scheda, con l'id dei fori nominati per esteso.
- [x] Propagato dove la stessa svista era già stata pagata una volta
      (`riconSave`/`rec.campo`, `csvRiconciliazione`): un campo non
      copiato lì sparirebbe dalla riga di storico e dal CSV che esce
      dall'azienda nel momento stesso in cui si salva. Colonna
      `campo_misfire` aggiunta IN FONDO al CSV (mai in mezzo: primo
      tentativo sbagliato, corretto prima del commit).
- [x] Banco browser `genesi-esito-detonazione.mjs`: importa un
      consuntivo vero (file upload reale) nella scheda Riconciliazione
      e verifica i tre casi, con una controprova che spegne la
      distinzione "non tracciato"/"zero misfire".
- [x] Aggiornata la dichiarazione dell'intestazione CSV in
      `shared/deepwork-id-client/dw-shell.js` (`CSV_TABELLE`), che il
      censimento B8 confronta contro l'export vero — presa e corretta
      prima del commit.

## Verifica prima del commit
`run-kpi.mjs`: 3206/3206. `copertura-funzioni.mjs`: 0 senza prova.
`sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/43.
`suite-collegate.mjs`: 3/3 (200 file di banco, 441 esecuzioni).
`sonda-vuoto.mjs`: 15/15 (0 tranquilli nuovi). `nomi-doppi.mjs` e
`classi-orfane.mjs`: invariati (0 problemi). Banco
`genesi-esito-detonazione.mjs`: 8/8 normale, controprova 6 passati/3 KO
voluti (iniezione trovata 1/1).

## Stato roadmap
Bilancio del pivot su Genesi: cinque capacità reali implementate e
provate (G48 snap a oggetti, G49 selezione multipla, G50 rifletti la
selezione, G51 input relativo/polare, G52 esito della detonazione), una
lacuna grande filata come Decisione #43 per il fondatore (blocchi
riusabili). La sezione 4 del censimento CAD è chiusa per intero; G52
apre un fronte diverso, dalla ricerca continua sul mestiere invece che
dal censimento competitor.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo del
  browser (nello scratchpad, PID 6815, avviato 07:53:44Z — ancora vivo
  all'ultimo controllo, sul blocco `contrasto`) con `leggi-giro.mjs`
  quando arriva in fondo. ⚠️ Il codice è cambiato più volte MENTRE il
  giro girava (G51, G52): la guardia dell'impronta di `tutti.mjs`
  dovrebbe dichiararlo NON VALIDO da sola — verificarlo, non dare per
  scontato che il giro sia attendibile.
- Rileggere la coda di `docs/RICERCA_CONTINUA_GENESI.md` per altre
  proposte non ancora processate (quella su misfire era l'ultima
  sezione; controllare se ce ne sono altre più indietro non ancora
  chiuse).
- Continuare il pattern ≥3 fronti dentro Genesi: valutare un nuovo giro
  di ricerca/QA in background su un'altra superficie, in sequenza se
  tocca lo stesso file per evitare la collisione già documentata.

## Blocchi
Nessuno.
