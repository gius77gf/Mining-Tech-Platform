# Checkpoint — 2026-09-05T08:19:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9fa7038e — Sentinella: la comunicazione della volata — la voce del diario che mancava

## Completato
- Candidato (a) della ricerca Sentinella: `campiComunicazioneVolata`,
  `descriviComunicazione`, `DESTINATARI_COMUNICAZIONE`; CSV del registro con
  tre colonne in coda (censimento aggiornato); azione sulla riga; riga e
  report che la scrivono anche quando manca. Demo b1 comunicata.
- run-kpi +3 (2646/0); banchi registro 28/0 e report 23/0; scatti guardati;
  giro `node` sulla copia verde, 3.558 asserzioni; documenti 3.127 / 819.

## Prossimo passo atomico
Candidato (b), costo minimo: la riga di portata del report — in
`apps/sentinella/index.html`, dove il report compone l'esito (cercare
`rep-esito` / la sezione con «Soglia applicata»), una frase fissa: «Questo
documento valuta la soglia applicata ai punti di misura (effetti sugli
edifici, UNI 9916 / DIN 4150-3); non valuta il disturbo alle persone (UNI
9614), che richiede una misura diversa.» Va anche nel testo di `ESITI`? No:
è una portata del documento, non un esito — una riga sola, sotto l'esito,
classe `.rep-punto-meta` come le altre note. Prova nel banco
`sentinella-report-dichiarazioni` (la frase c'è, una volta, e cita UNI 9614).
Poi (d): destinatario e periodo dall'adempimento sul documento quando il
report parte da un adempimento (`periodoAdempimento`, campo `ente`).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
