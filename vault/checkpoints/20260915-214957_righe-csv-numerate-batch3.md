# Checkpoint — 2026-09-15T21:49:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
37e579ef

## Cosa è stato completato
Terzo lotto della migrazione a `righeCsvNumerate`:
- Campo: `scartiSquadreCsv` (forma standard), `scartiPianoCsv` (usava
  `tutte` per trovare l'intestazione da ripassare a `parsePianoCsv` —
  quella parte è rimasta intatta, solo lo scaffolding di numerazione è
  sostituito).
- Flotta: `scartiRicambiCsv`, `scartiMezziCsv` (forma standard).

Nel mezzo di questa unità è arrivato il fire schedulato "Weekly Dev
Session": eseguito il protocollo canarino come commit isolato
(`2251474b`, path `vault/ULTIMO_CICLO.md` con `git commit -- <path>`
per non toccare i file già in stage di questa unità), poi ripreso
esattamente da dove interrotto.

## Verifica
- `run-kpi.mjs`: 3037 passati, 0 falliti (nuovo test B13 — fixture
  costruite leggendo prima la destrutturazione di ogni parser, non
  indovinate).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0 (nessuna pagina
  toccata). `copertura-funzioni.mjs`: 0 scoperte, 1018/1018.
  `funzioni-mai-usate.mjs`: 0 da collegare.
- Controprova (×2): vecchio conteggio reintrodotto in
  `campo.scartiPianoCsv` e, separatamente, in `flotta.scartiMezziCsv`
  → B13 cade in entrambi i casi; ripristinato da copia, byte-identico.
- Giro completo su worktree isolata: 40 comandi, 1 caduto atteso
  (`numeri-nei-documenti.mjs`) — corretto (run-kpi 3037, somma nove
  suite 3.528, giro completo 3.994) e riverificato in modo indipendente
  (43/0).

## Stato roadmap
Restano nove lettori: i sei di Conti, e le tre forme non standard
(`scudo.scartiLavoratoriCsv`, `scudo.scartiAzioniCsv`,
`flotta.scartiTelemetriaCsv`).

## Prossimo passo atomico
Quarto lotto: i sei lettori di Conti
(`scartiFattureCsv`, `scartiGareCsv`, `scartiListinoCsv`,
`scartiPesateCsv`, `scartiIncassiCsv`, `scartiClientiCsv`) — leggere
ogni corpo per intero prima di editare (Conti ha il file più grande e
più variato: `scartiPesateCsv` ha già un `senzaPeso` visto nel
censimento iniziale, verificarne la forma esatta prima di assumerla
standard). Dopo Conti, i 21 lettori standard sono tutti migrati:
restano solo le tre forme non standard, che vanno affrontate con
un'estensione dedicata di `righeCsvNumerate` (predicato invece di sola
parola chiave, per `scartiLavoratoriCsv`) o rimandate a quando si
deciderà di dare a `leggiCsv` un numero di riga fisico (per
`scartiAzioniCsv` e — verificare se si applica anche a lei —
`scartiTelemetriaCsv`, che usa `mappaTelemetriaCsv` per un'intestazione
posizionale).

Se si preferisce cambiare fronte dopo quattro lotti sullo stesso tema:
la rotazione della ricerca continua non ha ancora toccato Deepwork ID
né il core in questo ciclo (vedi `vault/ULTIMO_CICLO.md`).

## Blocchi
Nessuno.
