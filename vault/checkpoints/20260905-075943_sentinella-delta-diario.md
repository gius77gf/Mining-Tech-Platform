# Checkpoint — 2026-09-05T07:59:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8530f7dd — Ricerca Sentinella: il delta del diario delle volate, dal meccanismo

## Completato
- Delta scritto sotto la ricerca, sei risposte con i comandi, cinque candidati (a)-(e); roadmap: voce nuova con riga d'indice. Giro `node` sulla copia verde.

## Prossimo passo atomico
Candidato (a): la comunicazione sulla volata. Progetto in scratchpad, poi modulo: campi facoltativi `comunicataA` (ente | residenti | entrambi | vuoto), `comunicataIl` (ISO), `comunicazioneRif` (testo); `descriviComunicazione(v)` che risponde «nessuna comunicazione registrata» quando manca (mai «—»); `csvRegistroVolate` e `parseVolateCsv` con le tre colonne IN CODA e il censimento `sentinella.volate` in dw-shell aggiornato; pagina: azione sulla riga del registro («Segna comunicazione», `chiediDati`) che aggiorna la volata, la riga che la mostra, e la colonna «Comunicazione» nella tabella «Volate del periodo» del report. Prove in run-kpi (descrizione, CSV andata e ritorno, testo del file); banco: quello che apre il registro (cercare `vol-list` in tests/browser).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi, TD24/IPA/split payment, registro dei terzi.
