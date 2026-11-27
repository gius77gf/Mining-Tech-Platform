# Checkpoint — 2026-09-05T12:30:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4e65e6d8 — Flotta: il libretto del mezzo nel modulo — otto file su otto; e il
banco del libretto aveva la controprova rossa da una unità

## Completato
`csvLibretto` e le parole condivise (`oreMotoreTesto`, `oreLavoroTesto`,
`ogniMesiTesto`, `lavorazioneTesto`, `codaContatoreTesto`,
`ETICHETTA_STATO_MEZZO`) nel modulo di Flotta; la pagina chiama e tiene gli
alias. Censito `flotta.libretto`. ⛔ Corretti due banchi che iniettavano solo
nella pagina: `libretto-vuoti` (controprova ROSSA da una unità, exit 3, il
difetto 4 citava codice salito nel modulo) e `flotta-frasi-da-uno` (quattro
iniezioni riancorate). Adesso tutt'e due applicano per file.
Misure: run-kpi 2679/0; libretto-vuoti 26/26 e controprova 4/4;
flotta-frasi-da-uno 42/42 e controprova 24/24; flotta-documenti 79/79 +
controprova 8/8; nomi-liberi 26/0; iniezioni 525/525; copertura 875/875
(fondo Flotta 130); giro `node` sulla copia: 38 comandi a posto, asserzioni
3.592. Documenti: 3.160 prove, run-kpi 2679.

## Stato roadmap
Voce «FLOTTA — otto file composti nella pagina» CHIUSA: Scudo 2, Campo 1,
Flotta 8/8, Conti 6/6 — tutti i file composti nella pagina sono nel modulo.

## Prossimo passo atomico
La lezione della giornata sui banchi va scritta dove si rilegge:
**quattro banchi su quattro** (`flotta-documenti-che-escono`,
`conti-documenti-che-escono`, `libretto-vuoti`, `flotta-frasi-da-uno`)
applicavano le iniezioni SOLO alla pagina, e un'iniezione riancorata sul
modulo restava «trovata» da `iniezioni-fresche` ma mai rimessa — la
controprova stampava «✔ distingue» grazie alle altre. Due cose: (1) un
paragrafo in CLAUDE.md, sezione «Test», con la misura (4 banchi, e la forma
del segno: la riga «N difetti rimessi davvero» rossa in mezzo a un verde);
(2) una guardia statica in `iniezioni-fresche.mjs`: per ogni banco che ha
almeno una tupla con un terzo elemento (file), il sorgente del banco deve
leggere quel terzo elemento nel punto in cui applica — cioè contenere una
destrutturazione a tre (`[da, a, f]` / `[cerca, sostituisci, file]`) o un
`applica(t, file)`; se no si stampa il nome del banco come «dichiara un
file che non legge». Misurare il costo prima (quanti banchi hanno tuple a
tre, quanti le leggono), come chiede la regola sul righello.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
