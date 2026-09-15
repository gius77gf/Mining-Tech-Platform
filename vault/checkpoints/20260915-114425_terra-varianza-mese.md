# Checkpoint — 2026-09-15T11:44:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b40bb1ca

## Cosa è stato completato
Nona unità del ciclo odierno: `varianzaMensilePiano` in
`apps/terra/terra-data.js` — il volume scavato nel mese corrente contro il
piano annuo diviso 12, dichiarato come media (non un piano mensile vero:
Terra non ne ha uno). Un mese senza rilievi elaborati non è un mese a zero,
è "non ancora misurato" — la funzione lo dichiara invece di calcolare uno
scarto finto. Riusa `volumiPerMese` per l'aggregazione. Wired nella
schermata del piano estrattivo (`pia-mese`).

Chiude la lacuna 1 del quinto giro di ricerca su Terra (15/09). **Correzione
scritta in `docs/RICERCA_CONTINUA_TERRA.md`**: la lacuna 2 dello stesso
giro (margine fra esaurimento e scadenza) era già stata chiusa lo stesso
giorno da un'unità precedente di questo ciclo (`margineGiorni`, commit
`014f20b7`) — l'agente di ricerca girava in parallelo e non poteva saperlo.
Documentato esplicitamente perché nessuno la riapra credendola ancora
aperta. Resta aperta la lacuna 3 (finestra corta contro lunga su
`ritmoMedioAnnuo`, per rilevare un'accelerazione del ritmo).

Test: `run-kpi.mjs` +1 blocco, 6 asserzioni (3002→3003), con controprova
(tolta la guardia sui mesi senza rilievi, confermata la caduta
dell'asserzione sull'assenza-non-zero, ripristinato e riverificato
byte-identico con `diff`).

## Verifica
- `run-stile.mjs` e `sintassi-pagine.mjs` (giro completo, non mirato):
  puliti prima del giro isolato
- Giro isolato su worktree pulita (`/tmp/wt-terra-mese`, ora rimossa):
  39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Misura, non riporto a vista: il giro ha stampato "Asserzioni eseguite dal
  giro: 3910" (non i 3909 ereditati) e copertura 1000→1001 funzioni pure
  (una sola funzione nuova questa volta, senza una costante esportata
  accanto — diverso dall'unità precedente di Flotta)
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1001/1001
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
- Push riuscito al primo tentativo: `f70f476e..b40bb1ca`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Quinto giro di ricerca su Terra ora
chiuso su 2 lacune su 3 (la terza, finestra corta contro lunga, resta
aperta e piccola). Sesto giro su Flotta chiuso sulle sue due unità di
codice disponibili. Restano aperti: la lacuna 3 di Terra, i due segnali
dichiarati di Flotta (fermi in aumento/calo, priorità operative sul
trend), la Decisione 30 e i quattro punti Genesi in attesa del fondatore —
nessuno di questi va implementato senza conferma esplicita.

## Prossimo passo atomico
Implementare la lacuna 3 di Terra (`ritmoMedioAnnuo`, finestra corta contro
lunga per rilevare un'accelerazione o un rallentamento) con lo stesso
schema delle ultime tre unità — oppure, se si preferisce variare app per
il principio dei "cantieri paralleli" (CLAUDE.md, direttiva 5), avviare un
settimo giro di ricerca continua in background su un'app non ancora
coperta due volte in questa sessione (Conti o Campo), e nel frattempo
proseguire su un'altra unità piccola (es. la priorità operative di Flotta
sul trend, ora che `consumoControStoria` e `costoControStoria` esistono
entrambi) per non restare fermi fra un'unità e l'altra.
