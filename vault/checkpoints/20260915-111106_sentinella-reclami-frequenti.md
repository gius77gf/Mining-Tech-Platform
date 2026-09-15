# Checkpoint — 2026-09-15T11:11:06Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b2d48adc

## Cosa è stato completato
Settima unità del ciclo odierno: `reclamiPerRicettore` in
`apps/sentinella/sentinella-data.js`, raggruppa i reclami per `ricettoreId`
(quelli senza `ricettoreId` restano fuori dal conto — l'assenza di un dato non
è un dato favorevole), calcola totale storico, quanti nella finestra recente
(default 180 giorni) e la data dell'ultimo, ordinati per frequenza NELLA
FINESTRA (non sul totale storico). `apps/sentinella/index.html` mostra sotto
il riepilogo reclami esistente i ricettori con più di un reclamo negli ultimi
sei mesi.

Test: `run-kpi.mjs` +1 (2998→2999), 6 asserzioni, verificate con controprova
(filtro-finestra sostituito con `nellaFinestra = gr.length`, confermato che
l'asserzione sull'ordinamento cade, ripristinato e riverificato byte-identico
con `diff`).

Giro isolato su worktree pulita (`/tmp/wt-sentinella-reclami`, ora rimossa):
40/40 comandi a posto, 0 caduti. `numeri-nei-documenti.mjs`: 43/0, copertura
998/998. Documenti a cascata aggiornati: `docs/DEVELOPMENT.md`,
`docs/STATO_PRODOTTO.md`, `vault/ROADMAP_SETTIMANA.md`, `docs/DECISIONI_WEEKEND.md`
— totale prove 3.482→3.483, "asserzioni eseguite dal giro" corretto a 3949
(misurato fresco sulla worktree, non riportato a mano dall'unità precedente).

## Verifica
- `git worktree add -q --detach /tmp/wt-sentinella-reclami HEAD` +
  `git diff --cached | git -C /tmp/wt-sentinella-reclami apply` +
  `git -C /tmp/wt-sentinella-reclami add -A`
- `node apps/deepwork-id/tests/giro-node.mjs` sulla copia: 40 comandi a posto,
  0 caduti
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs` sulla copia
  (con i due doc corretti copiati dentro): 43 passati, 0 falliti
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
- Push riuscito al primo tentativo: `c7cb5b17..b2d48adc`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md` per il dettaglio aggiornato. Sesto giro di
ricerca chiuso (Flotta, Sentinella, Deepwork ID); settima unità di codice
(questa) chiude uno dei findings di quel giro. Restano da tradurre in codice
gli altri finding confermati non ancora implementati (Flotta, Terra — vedere
le sezioni "confermate" in `docs/RICERCA_CONTINUA_FLOTTA.md` e
`docs/RICERCA_CONTINUA_TERRA.md`), e attende risposta del fondatore la
Decisione 30 (rimozione membro Deepwork ID) e i quattro punti aperti su
Genesi (Direzione A/B1/B2 di `docs/GENESI_EVOLUZIONE_STRATEGICA.md`,
Decisione 28 misura-assistita, Decisione 25 mesh vuota) — nessuno di questi
va implementato senza conferma esplicita.

## Prossimo passo atomico
Aprire `docs/RICERCA_CONTINUA_FLOTTA.md` e `docs/RICERCA_CONTINUA_TERRA.md`,
scegliere il prossimo finding confermato-ma-non-implementato con il costo più
basso, verificarlo di nuovo contro il codice attuale (niente entra sulla
parola di un round di ricerca precedente senza un secondo controllo fresco),
e implementarlo con lo stesso schema di questa unità (funzione pura +
prova con controprova + giro isolato + cascata documenti). In alternativa, se
nessun finding residuo è abbastanza economico per un'unità piccola, avviare
un settimo round di ricerca continua in background (rotazione: un'app non
ancora coperta due volte in questa sessione, es. Conti o Campo) mentre si
lavora su un'altra unità in parallelo, per non restare mai fermi fra un'unità
e l'altra.
