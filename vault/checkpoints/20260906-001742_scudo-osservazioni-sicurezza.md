# Checkpoint — 2026-09-06T00:17:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
85d76267 — Scudo: le osservazioni di sicurezza

## Completato
Buona pratica vista o cosa da correggere, dallo stesso modale del near-miss
(«0 · Che cosa segnali»), `tipo: "osservazione"` + `esito`, composte da
`bozzaOsservazione` sopra la STESSA `bozzaNearMiss` di `shared/`; contate a
parte (`riepilogoOsservazioni`, `descriviLetturaOsservazioni`, `pochi` sotto
`MIN_TENDENZA`); filtro «Osservazioni», pastiglia dell'esito, `#oss-riep`.
run-kpi +12 (2763); banco `scudo-osservazioni.mjs` 52 ok, controprova 18/52
(3/3 per file), 257 esecuzioni / 108 file; copertura 913/913 (fondo Scudo
206). Scatti guardati. Docs: CONCORRENTI_SCUDO tre righe a C'È, B4 scudo 5 e
totale 40, mondo in RICERCA_CONTINUA_SCUDO (seconda mano dichiarata).

## Stato roadmap
Voce `[x]` «LE OSSERVAZIONI DI SICUREZZA DI SCUDO (06/09, notte)».

## Prossimo passo atomico
La prossima riga della B4 (40 confermate assenti: campo 11 · sentinella 11 ·
conti 5 · flotta 4 · terra 4 · scudo 5) che il codice può colmare senza
hardware, backend o una decisione commerciale. Prima di aprire il cantiere:
1. leggere la riga nel documento dei concorrenti dell'app scelta
   (`docs/CONCORRENTI_<APP>.md`, sezione «CONFERMATE ASSENTI») e RIFARE la
   sua prova col comando, non col numero: se il termine è del mondo, cercare
   il MECCANISMO nel modulo (`apps/<app>/<app>-data.js`), non la parola;
2. progettare la funzione in scratchpad (`$S/racc/`) e provarla lì prima di
   scriverla nel modulo; il record che esce da una pagina si compone nel
   modulo o in `shared/`, mai nella pagina;
3. prove in `run-kpi.mjs` PRIMA del riepilogo, sincrone; banco del browser
   con controprova per file (`[da, a, FILE]` + `applica(t, file)`), registrato
   in `tutti.mjs`; scatti GUARDATI; pin (prove, run-kpi, copertura, banchi)
   aggiornati nei quattro documenti; giro `node` sulla COPIA del committando;
   commit con `-F`; checkpoint nuovo; push.
Le candidate si prendono dalle sezioni «CONFERMATE ASSENTI» dei sei
documenti dei concorrenti, non da questa riga. ⚠️ E una l'ho quasi scritta
qui come candidata ed era FALSA: «riconciliazione bancaria» di Conti C'È dal
01/08 (`parseMovimentiCsv`, `abbinaMovimenti`; il documento la dà SCADUTA,
cioè colmata) — l'avevo cercata per parola, e il nome che avevo in testa
(`parseEstrattoCsv`) non esiste. Trenta secondi di `grep` sull'export l'hanno
fermata prima di entrare nel checkpoint.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore (come sempre).
