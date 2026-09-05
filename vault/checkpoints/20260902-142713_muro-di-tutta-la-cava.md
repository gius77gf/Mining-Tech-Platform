# Checkpoint — 2026-09-02T14:27:13Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a40e1ab5 — «Scudo: il muro di tutta la cava — concessione, mezzi e persone con la stessa regola»

## Completato
Il ponte 3b è chiuso nei due tempi: la regola unica in shared (`876350f2`) e il
muro visibile in Scudo. Mappa: **10** ponti di dati su 56, 4 famiglie non
collegate. Banco `scudo-scadenze-unite.mjs` (11 + 10, controprova cade in 3),
scatto del riquadro guardato (Terra e Flotta con la pastiglia, la fideiussione
«tra 28 gg» col suo preavviso di 90). Giro node 37/0. Documenti: 2.908 prove,
3.317 asserzioni, 211 esecuzioni del browser da 86 file.

## Il conto della giornata (02/09)
Dieci unità: ponte Flotta→Conti sullo schermo, passata Conti (ambiente e
calendario), pesi a metà, fattura elettronica (A generatore, B campi, C
bottone), Genesi fuori dal browser (misura), ponte Conti→Flotta, regola unica
delle scadenze, passata Scudo, muro di tutta la cava. Ponti 6 → 10.

## Prossimo passo atomico
Il binario che si alterna: **la passata in profondità sulla prossima app**.
Candidata: **Flotta** — è quella che oggi ha guadagnato un ponte in ingresso e
uno in uscita, e la sua ricerca del 02/09 (`docs/RICERCA_CONTINUA_flotta.md`)
lascia cinque domande sul meccanismo, la prima delle quali è misurabile subito:
*«chi calcola il costo orario quando il contatore ore è SCESO?»* — aprire
`ritmoOreMezzi` e `consumoPerMezzo` in `flotta-data.js` (CLAUDE.md ricorda che
il 03/08 la prima rifiutava il contatore sceso e la seconda no), costruire in
scratchpad due letture con il contatore che torna indietro e guardare che cosa
dicono le due funzioni e la schermata. Poi i cinque banchi `flotta-*.mjs` senza
proxy, i file che escono aperti, gli scatti guardati — come per Conti e Scudo.
In parallelo (cantiere, altra app): la stessa passata su **Terra**.

## Blocchi
Nessuno. PR #345 verde, aperta (unire è del fondatore).
