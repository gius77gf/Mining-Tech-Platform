# Checkpoint — 2026-09-11T03:10:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
306288b9

## Completato
Unità 67 — ricerca a rotazione su Scudo e delta fatto: `icsCalendario` in
shared/, `calendarioScadenze` in Scudo, bottone «Calendario (.ics)» nel
Scadenzario. run-kpi 2854, copertura 941/941.

## Imparato
- Un modulo di `shared/` lo carica anche il browser: `Buffer` non esiste lì.
  La sonda che preme il bottone prima del commit l'ha preso; le prove `node`
  no, perché in `node` `Buffer` c'è.
- Il pin «export nelle quattro app» non conta Scudo: prima di alzare un pin si
  guarda CHI c'è nel suo denominatore.
- Un file che si IMPORTA perde il nome: la dichiarazione della dimostrazione
  deve stare nel contenuto che sopravvive (nome del calendario, ogni titolo,
  descrizione). L'ha preso `csv-dimostrazione` sulla prima stesura — il banco
  che «sa giudicare un'estensione» va allargato quando nasce un formato nuovo,
  e la sua domanda va scritta per QUEL formato, non copiata dal .txt.

## Prossimo passo atomico
Leggere il giro filtrato del browser su `cfe459ec`
(`scratchpad/giri/giro-browser-20260911-0046.log`, `leggi-giro.mjs`) se è
finito. Poi il calendario .ics nelle altre tre app con scadenzario (Flotta:
scadenze di legge e tagliandi a data; Sentinella: adempimenti; Terra:
autorizzazioni) riusando `icsCalendario` — un'app per unità — oppure la
ricerca a rotazione sull'app successiva (Sentinella).

## Blocchi
Nessuno.
