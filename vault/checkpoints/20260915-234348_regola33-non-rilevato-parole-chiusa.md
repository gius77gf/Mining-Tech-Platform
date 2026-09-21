# Checkpoint — 2026-09-15T23:43:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
70090fce

## Cosa completato
- `apps/deepwork-id/tests/run-stile.mjs`: aggiunta la **regola 33** — nessuna
  superficie/modulo scrive «non rilevato» (in italiano, nei rapporti di prova
  di questa casa, vuol dire il contrario di «non misurato»/«non calcolabile»:
  è il principio del fondatore violato dal testo invece che dal calcolo).
  Scansione con `senzaCommenti` (il testo vive dentro le stringhe mostrate
  all'utente, non nelle chiamate — è la regola 6, presa a modello). Controprova
  nei due versi inclusa. 330 passati, 0 falliti (da 328).
- Chiude **PAROLE proposta 3, parte (b)** in `docs/RICERCA_CONTINUA_PAROLE.md`.
- **PAROLE proposta 3, parte (a)** (unificare "n.d."/"non determinabile" di
  Terra con "non calcolabile") misurata e dichiarata **deliberatamente NON
  fatta**: `grep -rn "non determinabile" apps/ shared/` → una sola occorrenza
  reale, `apps/terra/terra-data.js:3343`, che rappresenta una **classe di
  accuratezza del rilievo** (un concetto diverso da "non calcolabile", non un
  doppione da unificare).
- Doc-cascade corretto in `docs/DEVELOPMENT.md`/`docs/STATO_PRODOTTO.md`: la
  cifra "asserzioni eseguite dal giro" era rimasta a **3.999** (stale) mentre
  il giro isolato appena lanciato (worktree, `giro-node.mjs`) ha misurato
  **4001** — corretto in entrambi i documenti. La somma delle nove suite era
  già corretta a **3.534** in `STATO_PRODOTTO.md` r.215, ma un secondo
  riferimento allo stesso numero (r.235) era rimasto al vecchio **3.532**:
  corretto anche quello.
- Verificato `node apps/deepwork-id/tests/numeri-nei-documenti.mjs` sull'albero
  vivo: **43 passati, 0 falliti**.
- Verificato `run-kpi.mjs` (3040/0) e `sintassi-pagine.mjs` (34/0): nessuna
  regressione.
- Commit `70090fce` (6 file), pushato su
  `claude/scheduled-tasks-remote-control-bk4ap6`.
- Worktree isolata `wt-regola33` rimossa e potata dopo l'uso.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md` — proposta 3 di PAROLE chiusa (parzialmente,
con motivazione scritta); proposte 2 e 4 di PAROLE già chiuse in unità
precedenti della sessione odierna.

## Prossimo passo atomico
Rotazione ricerca continua: fin qui coperte oggi (15/09) Genesi, Campo,
Deepwork ID, core/index.html, Terra, Sentinella (via PAROLE). **Scudo, Conti e
Flotta** risultano le meno recentemente ricercate — lanciare una
`/deep-research` (o Agent general-purpose con WebSearch se il workflow fallisce)
mirata su una di queste tre, seguendo il formato "prima il mondo, poi la
nostra app" e la regola "non c'è va provato, non dichiarato" di CLAUDE.md.

In parallelo, come unità di codice indipendente: i **cinque lettori CSV non
standard** rimasti fuori dalla migrazione `righeCsvNumerate` — `scudo.
scartiAzioniCsv`/`conti.scartiClientiCsv` (basati su `leggiCsv()`),
`flotta.scartiTelemetriaCsv` (header posizionale via `mappaTelemetriaCsv`),
`conti.scartiPesateCsv`/`scartiIncassiCsv` (parser di celle dedicati
`cellePesate()`/`celleIncassi()`) — ciascuno richiede di dare al proprio
parser un tracciamento del numero di riga fisico proprio, non riusabile da
`righeCsvNumerate` così com'è: unità dedicata più grande, una per famiglia.

Non fermarsi qui: per la regola del fondatore (esaurimento crediti), aprire
subito l'unità successiva fra le due sopra o le altre candidate già elencate
nel checkpoint precedente (`20260915-231657_sentinella-provenienza-periodo-
positivo.md`): scoping della funzione-ponte per letture live di Firestore
(non in `shared/dw-ponti.js`, che è solo funzioni pure — va deciso dove),
oppure iterazione estetica di secondo passaggio su un'app non ancora toccata
oggi con lavoro di design dedicato.

## Blocchi
Nessuno.
