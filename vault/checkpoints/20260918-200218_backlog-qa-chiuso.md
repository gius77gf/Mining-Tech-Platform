# Checkpoint — 2026-09-18T20:02:18Z

## Tipo
unit-complete (chiusura di un intero backlog)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c50d652d

## Task completati in questo blocco
Chiuso l'intero backlog QA aperto durante la sessione odierna (task
#9-#25 del tracker), in dieci unità con commit+push singoli:

1. `abb9542f` — Genesi: stemB/subB nel Validatore (falso allarme se
   stem/sub illeggibile) + vista 3D raggi-X (carica fino al colletto
   se borraggio illeggibile).
2. `387d18d8`/`aa027f62` — Genesi: import .volata.json ignorava
   esplosivo/innesco; popup foro e timeline mostravano il tempo
   jitterato (tDet) invece del nominale (tNom).
3. `220f7c9f` — Terra: prospettoDenuncia non annotava "Residuo" come
   valore MASSIMO quando manca il pregresso dichiarato.
4. `d123446f` — Deepwork ID: admin.html offriva azioni sull'owner a un
   admin (il server le rifiuta sempre — UI mendace, non un buco di
   sicurezza).
5. `699990eb` — shared/dw-shell.js: icsCalendario generava allarmi
   VALARM nel passato per preavvisi già scaduti (i trigger relativi
   `-P{n}D` si calcolano sempre da DTSTART).
6. `f64741f0` — Scudo: organigrammaSicurezza ignorava lo stato "senza
   data" nel filtro delle formazioni in scadenza.
7. `a70be7bd` — Flotta: giacenza/soglia ricambio con punto inglese
   invece della virgola italiana.
8. `aca7b746` — Terra/Flotta/shared: nessun bottone di scrittura si
   disabilitava durante il salvataggio; promosso `occupato()` da
   Flotta a shared/dw-app-ui.js.
9. `9d48e79e` — fix su due iniezioni di controprova scadute, catturate
   dal giro completo di convergenza documenti prima ancora del push.
10. `6c23a9cf` — Conti: csvSituazioneFatture chiamava "insoluta" una
    fattura scartata dallo SdI.
11. `574afee6` — Conti: bottone "Emetti" senza `occupato()`, race sul
    numero fattura (doppio tocco → due fatture stesso numero).
12. `a49ab735` — Campo: coperturaRapportini chiamava "mancante" una
    squadra che aveva consegnato (solo senza data leggibile) — il
    documento firmato si autosmentiva nella stessa sezione.
13. `e13c0969` — Campo: **nessuno** dei quindici bottoni di scrittura
    aveva `occupato()` (zero occorrenze contro le decine delle altre
    tre app). Il più serio: la firma del turno (btn-fir).
14. `c50d652d` — Scudo/Sentinella/Conti: quattro bottoni residui
    trovati dall'audit (infortuni, scadenze, volate, DDT — quest'ultimo
    il più serio: doppio numero di documento di trasporto).

Anche `6c23a9cf` include il fix gemello: `registroVendite`/
`csvRegistroVendite` (Conti) non escludevano le fatture scartate
dallo SdI, nonostante un commento nello stesso file lo dichiarasse
già fatto (falso).

## Stato roadmap
Backlog QA della sessione interamente chiuso e verificato dal vivo
(controprova per ogni fix con banco browser dedicato, o test unitario
con controprova dove non serviva il browser). Tutte le suite locali
verdi ad ogni commit: run-kpi.mjs 3163/0, sintassi-pagine.mjs 34/0,
run-stile.mjs 330/0, suite-collegate.mjs 3/0, iniezioni-fresche.mjs
660/660 (zero ancore di controprova scadute).

## In corso ora
- Giro completo di convergenza documenti su worktree fresca
  (`/tmp/wt-final-block2`, HEAD `c50d652d`), lanciato in background
  con `nohup`, log in `/tmp/claude-.../scratchpad/giro-completo-2.log`.
- Tre nuovi cantieri QA in background (deep-pass sola-diagnosi, non
  toccano codice): Flotta, Genesi, Terra — rotazione verso app non
  ancora riviste oggi con un secondo giro approfondito.

## Prossimo passo atomico
1. Leggere il log del giro completo quando termina; propagare i numeri
   convergenti nei quattro documenti tracciati (docs/DEVELOPMENT.md,
   docs/STATO_PRODOTTO.md, docs/DECISIONI_WEEKEND.md,
   vault/ROADMAP_SETTIMANA.md), verificato con
   `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`.
2. Leggere gli esiti dei tre agenti QA (Flotta/Genesi/Terra) quando
   arrivano: verificare OGNI difetto dal vivo (mai sulla parola sola)
   prima di aprire un cantiere di correzione.
3. Se il backlog resta esaurito dopo questo giro: proseguire con la
   lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md — seconde
   iterazioni delle app, censimento di una sovrapposizione nuova nella
   mappa ecosistema, deep-research a rotazione, o la fase di
   approfondimento app-per-app aperta dal fondatore il 26/08.

## Blocchi
Nessuno. Nessun server orfano rilevato (`ss -ltn` pulito prima di
lanciare il giro).
