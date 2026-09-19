# Checkpoint — 2026-09-16T11:17:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e2ed4b3d

## Cosa completato
- Prima di questa unità: riletto `docs/RICERCA_CONTINUA_ASSENZA.md` per
  intero e trovate DUE righe invecchiate (documento più vecchio della
  sessione, 13/08):
  1. La sezione D2 dichiarava "ancora davvero muti oggi 2 su 8"
     (`scudo/infortuni`, `sentinella/monitoraggi`) — ma `grep` diretto ha
     confermato che `scartiInfortuniCsv` e `scartiMonitoraggiCsv`
     esistono e sono chiamate nelle rispettive pagine da **ieri sera**
     (commit `afa64c4a`, 15/09 20:08 UTC). Chiuso con nota di chiusura,
     nessun codice da scrivere.
  2. La proposta **P4** ("lo zero dichiarato di Flotta esce come
     dichiarato") era invece genuinamente aperta: verificato che
     `csvRicambi` scrive ancora `giacenza` senza distinguere "mai
     contata" da "contata e uguale a zero".
- Implementata **P4**: `csvRicambi` (in `flotta-data.js`) guadagna una
  quinta colonna `stato` (`predefinito`/`misurato`), derivata dallo
  stesso `numeroDichiarato(r.giacenza)` che già decide lo "0" nudo —
  nessun secondo giudizio, nessuna copia debole (regola del `shared/`
  applicata anche dentro un solo modulo: una sola sorgente di verità).
- **Deliberatamente NON tradotta in un round-trip con `parseRicambiCsv`**:
  il modello dati di un ricambio non ha oggi un campo per tenere questa
  distinzione, e introdurlo sarebbe la decisione che la proposta **P2**
  (stesso documento) vuole prendere in comune per tutti e undici i CSV
  dell'ecosistema — farla di sfuggita qui l'avrebbe inventata due volte.
- Corretti due controlli con l'header a 4 colonne scritto a mano (il test
  diretto di `csvRicambi→parseRicambiCsv`, e la voce `flotta.ricambi` in
  `CSV_TABELLE` di `shared/deepwork-id-client/dw-shell.js`), più due
  asserzioni nuove che provano davvero la distinzione (non solo che la
  colonna esiste: che un `predefinito` e un `misurato` escano diversi).
  Controprova a mano: rimesso `"misurato"` sempre, il test è caduto,
  ripristinato.
- **Nessuna funzione nuova esportata, nessun banco browser nuovo, nessun
  doc-cascade da aggiornare** — confermato con `numeri-nei-documenti.mjs`
  (43/0 prima e dopo). L'unità più leggera sul fronte documentazione di
  tutta la sessione.
- Verificato con giro isolato su worktree: 40/40 comandi, 4059
  asserzioni, 0 caduti al primo passaggio.
- Commit `e2ed4b3d`, pushato.

## Nota di metodo
Questa unità conferma due volte la regola "chi chiude un'unità aggiorna
la riga del documento che gliel'aveva proposta": la sezione D2 di
ASSENZA era stata risolta da un cantiere di ieri sera che non aveva
aggiornato quel documento (l'ha fatto sì in `DEVELOPMENT.md`, ma non
nel documento di ricerca che l'aveva proposta) — lo stesso schema già
visto oggi su Flotta (`frequenzaFermiControStoria`, chiuso ma non
dichiarato chiuso nel proprio documento di ricerca).

## Stato roadmap
`docs/RICERCA_CONTINUA_ASSENZA.md`: D2 chiusa (0/8 muti), P1 già
implicitamente completa (stessa causa di D2), P4 implementata in parte
(solo l'export, non il round-trip). Restano aperte P2 (vocabolario
condiviso a 6 codici su 11 CSV) e P3 (riga di convenzione in testa a 21
scrittori) — entrambe di scala maggiore, richiedono una decisione di
design prima di scomporle in unità.

## Prossimo passo atomico
1. Non c'è un'unità "pronta" ovvia rimasta su ASSENZA: P2/P3 sono grandi
   e richiedono scomposizione (leggere di nuovo §4 per intero prima di
   iniziare, decidere se la colonna condivisa è una `shared/dw-ponti.js`
   nuova funzione o un semplice vocabolario di costanti).
2. In alternativa, più pronta: nuova ricerca continua su Core o
   Deepwork ID (ferme al 03/09, le più indietro fra i documenti rimasti
   dopo la chiusura di Assenza).
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
