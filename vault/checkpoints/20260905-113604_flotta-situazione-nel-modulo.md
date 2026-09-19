# Checkpoint — 2026-09-05T11:36:04Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9c04e84a — Flotta: la situazione del parco si compone nel modulo — sette file su
otto, e l'ottavo è il libretto

## Completato
`csvSituazione` nel modulo di Flotta; la pagina chiama; `flotta.prospetto`
verificato chiamando l'export; tre iniezioni riancorate sul modulo, e quella
di `statoScorta` riscritta coi nomi del modulo (citava `RIC` e faceva morire
l'export: la controprova scendeva a 66 controlli su 80 senza dirlo).
Misure: run-kpi 2670/0; flotta-documenti 79/79, controprova 8/8 rimessi e 19
KO su 80; flotta-numeri-tranquilli 27/27; nomi-liberi 26/0; iniezioni
525/525; copertura 848/848 (fondo Flotta 122); giro `node` sulla copia: 38
comandi a posto, asserzioni 3.583. Documenti: 3.151 prove, run-kpi 2670.

## Stato roadmap
Voce Flotta aperta: resta il libretto (Flotta) e sei file di Conti.

## Prossimo passo atomico
Conti, i due più corti: `conti_incassi.csv` (`btn-inc-export`: righe da
INC×FAT con `statoFattura(f, INC, NOT)`, `movimentiDiFattura`, il residuo dopo
ogni incasso che toglie lo stornato) e `conti_clienti.csv` (`btn-cli-export`:
`cellaNum` per sconto e fido — «fido non impostato» ≠ «fido 0»). Per ognuno:
`csvX` nel modulo con la costante dell'intestazione, la pagina chiama, prova
in run-kpi sulla dimostrazione, riga nel censimento `CSV_TABELLE` con
`fonte:` (se già censiti con `pagina:`, passarli a `fonte:` e aggiornare le
due soglie), iniezioni dei banchi riancorate — controllando che il banco
APPLICHI per file e leggendo «N difetti rimessi davvero». Prima:
`grep -n "^export function \(round2\|importiFattura\|statoFattura\|movimentiDiFattura\|nomeCliente\|nomeMetodo\|cellaNum\)" apps/conti/conti-data.js`
— ciò che manca nel modulo (probabilmente `cellaNum`, `nomeMetodo`) sale o si
passa. Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
