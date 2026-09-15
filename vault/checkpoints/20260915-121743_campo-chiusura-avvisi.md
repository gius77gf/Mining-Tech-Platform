# Checkpoint — 2026-09-15T12:17:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2965fc31

## Cosa è stato completato
Undicesima unità del ciclo odierno: chiuse due delle tre lacune del quinto
giro di ricerca su Campo (15/09, chiusura/consegna di turno).

- **Lacuna 2**: `btn-fir` ora blocca anche senza il nome di chi riceve
  (`fir-ricevuta`), stesso stile del messaggio già esistente per chi
  consegna. Il form-hint della pagina diceva già "due nomi": ora il
  codice lo impone davvero.
- **Lacuna 1**: `avvisiChiusuraTurno(attivita, appello)` in
  `campo-data.js` — un AVVISO non bloccante (appello incompleto, attività
  ancora "in corso", fermi senza i minuti dichiarati), riusando
  `appelloTurno`/`minutiFermoDi` senza ricalcolarli. Wired sotto il form
  di chiusura, visibile solo finché il turno non è chiuso. Un turno si
  chiude comunque: è la vita vera della cava passare le cose in sospeso
  al turno dopo.
- **Lacuna 3** (già chiusa): il round di ricerca era nato da un commit
  perduto e riscritto a memoria, e la verifica di persona ha trovato che
  `btn-consegna` scrive già su `db` (commit `574163d2`, di un'unità
  precedente di questo stesso ciclo) — documentato esplicitamente in
  `docs/RICERCA_CONTINUA_CAMPO.md` perché nessuno la riapra.

Test: `run-kpi.mjs` +1 blocco, 4 asserzioni (3005→3006), con controprova
(cambiato `=== null` in `!minutiFermoDi(a)` per i fermi senza minuti,
confermata la caduta dell'asserzione sullo zero-è-un-dato, ripristinato e
riverificato byte-identico con `diff`).

## Verifica
- `run-stile.mjs` e `sintassi-pagine.mjs` (giro completo): puliti prima
  del giro isolato
- Giro isolato su worktree pulita (`/tmp/wt-campo-chiusura`, ora
  rimossa): 39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni 1001→1002 (una funzione nuova, misurata dal giro
  stesso — non assunta)
- Un errore in corsa: il primo aggiornamento di `ROADMAP_SETTIMANA.md`
  spezzava la frase «3.XXX prove girano senza rete» su due righe, e
  `numeri-nei-documenti.mjs` non la trovava più (42/1 invece di 43/0) —
  corretto tenendo la frase su una riga sola, come pretende il censimento
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1002/1002
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
- Push riuscito al primo tentativo: `2119f45b..2965fc31`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Quinto giro di ricerca su Campo chiuso
su tutte e tre le sue lacune (2 tradotte in codice, 1 già risolta da
un'unità precedente). Sesto giro su Flotta chiuso. Quinto giro su Terra
chiuso su 2 lacune su 3 (resta la finestra corta/lunga di
`ritmoMedioAnnuo`). Nessun giro di ricerca continua è ancora stato
lanciato su Conti in questa sessione — è l'unica app rimasta senza un
round dedicato oggi.

## Prossimo passo atomico
Avviare un settimo giro di ricerca continua in background su Conti
(unica app non ancora coperta in questa sessione), mandato mirato secondo
la disciplina di CLAUDE.md (prima il mondo con le fonti citate, poi il
delta fatto da chi ha il codice in mano). Nel frattempo continuare con la
lacuna 3 di Terra (`ritmoMedioAnnuo`: finestra corta, es. ultimi 90
giorni, contro finestra lunga, per rilevare un'accelerazione o un
rallentamento del ritmo di scavo) come prossima unità di codice piccola,
così il ciclo non resta fermo fra un'unità e l'altra mentre la ricerca
cammina.
