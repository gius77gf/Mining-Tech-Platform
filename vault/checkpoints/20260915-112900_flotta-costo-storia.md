# Checkpoint — 2026-09-15T11:29:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
58213a69

## Cosa è stato completato
Ottava unità del ciclo odierno: `costoControStoria` in
`apps/flotta/flotta-data.js`, stessa forma di `consumoControStoria` (02/09)
ma sulla MEDIA per intervento — il costo d'officina di un mezzo sta salendo
rispetto al suo solito? Interventi senza costo (manodopera interna) esclusi
da storia e finestra, soglia dichiarata `TOLLERANZA_COSTO_PCT = 25` (più
larga di quella del carburante, per la ragione scritta nel commento della
funzione). Wired in `fascicoloMezzo` (`costoStoria`) e nel libretto macchina
(`sch-int` in `index.html`).

Chiude parzialmente il sesto giro di ricerca su Flotta (15/09, manutenzione
predittiva da trend): la lacuna "costo per intervento in aumento" era vera
ed è ora coperta. **Correzione importante scritta in
`docs/RICERCA_CONTINUA_FLOTTA.md`**: un terzo di quella stessa lacuna
("consumo medio storico vs attuale") era GIÀ FALSA al momento della
ricerca — `consumoControStoria` esisteva da prima (02/09), l'agente non
l'ha trovata perché il suo grep cercava le parole del mondo
(`trend|predict|degrad`) invece del meccanismo. Restano aperte: la
frequenza fermi in aumento/calo, e il riordino di `prioritaOperative` sul
trend (ora "piccola" con due segnali disponibili).

Test: `run-kpi.mjs` +3 (2999→3002), con controprova (tolto il filtro
`costo > 0`, confermata la caduta dell'asserzione sul costo escluso,
ripristinato e riverificato byte-identico con `diff`).

## Verifica
- `run-stile.mjs --solo=flotta` e `sintassi-pagine.mjs` mirati: puliti prima
  del giro completo
- Giro isolato su worktree pulita (`/tmp/wt-flotta-trend`, ora rimossa):
  39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati, non
  per un difetto di codice
- **Misura invece di riportare a mano**: il giro ha stampato "Asserzioni
  eseguite dal giro: 3909" (non i 3949 ereditati a vista dall'unità
  precedente). La copertura funzioni (998→1000) è stata verificata
  confrontando due worktree — una sull'ultimo commit (`34f09c27`), una sul
  lavoro nuovo — invece di dedurla dal numero di funzioni aggiunte: il
  delta vero è +2 (la funzione più la sua soglia dichiarata come costante
  esportata, la stessa convenzione già in uso per `TOLLERANZA_CONSUMO_PCT`)
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1000/1000
- Worktree rimosse con `git worktree remove --force` + `git worktree prune`
  (anche la worktree di confronto `/tmp/wt-before-flotta`)
- Push riuscito al primo tentativo: `34f09c27..58213a69`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Sesto giro di ricerca (Flotta,
Sentinella, Deepwork ID) ora chiuso su entrambe le sue unità di codice
disponibili (reclami frequenti di Sentinella, costo contro storia di
Flotta). Restano aperti: i due segnali dichiarati di Flotta (fermi in
aumento/calo, priorità operative sul trend), i finding di Terra non ancora
tradotti in codice, la Decisione 30 e i quattro punti Genesi in attesa del
fondatore — nessuno di questi va implementato senza conferma esplicita.

## Prossimo passo atomico
Aprire `docs/RICERCA_CONTINUA_TERRA.md`, cercare i finding "confermati e
aperti" non ancora tradotti in codice (round del 5° giro di ricerca, quelli
rimandati per costo), riverificarli freschi contro il codice attuale (la
lezione di oggi: ricontrollare che il meccanismo non esista già con un
altro nome prima di scrivere il codice), e implementare il più economico
con lo stesso schema di questa unità. In alternativa, se nessun finding
residuo è abbastanza piccolo per un'unità atomica, avviare un settimo giro
di ricerca continua in background su un'app non ancora coperta due volte
in questa sessione (Conti o Campo), mentre si prosegue con un'altra unità
in parallelo per non restare fermi fra un'unità e l'altra.
