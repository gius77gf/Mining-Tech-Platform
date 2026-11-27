# Checkpoint — 2026-09-11T03:35:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bcf1b491

## Completato
Unità 68 — Flotta, `calendarioMezzi` sopra `icsCalendario` di shared/:
scadenze di legge e tagliandi con una data in agenda, quelli a sole ore fuori
e contati; bottone «Calendario (.ics)» nello scadenzario; l'avviso della
dimostrazione dentro il file. run-kpi 2855, copertura 942/942, documenti 137.

## Imparato
- Una previsione non è una scadenza: un tagliando a ore ha una data solo se
  la si stima dal ritmo, e in un calendario entrerebbe come certa. Si lascia
  fuori e si DICE quanti sono, nella frase del bottone.
- Il pin «export nelle quattro app» conta Flotta e non Scudo: lo stesso file
  in due app cambia un pin sì e uno no, e la ragione va scritta accanto.

## Prossimo passo atomico
Il calendario .ics nelle due app rimaste con scadenzario, un'app per unità:
Sentinella (adempimenti del programma di monitoraggio: `statoRigaProgramma`,
il «prossimo» per ogni riga) e Terra (autorizzazioni e scadenze della
concessione). Poi la ricerca a rotazione sull'app successiva (Sentinella) o
l'undicesima tranche B3.

## Blocchi
Nessuno. Il giro filtrato del browser su `cfe459ec` è finito: 0 KO veri,
2h17, 138 righe «non ho guardato» (tutte dichiarazioni di classi mai
comparse e temi assenti, nessuna nuova).
