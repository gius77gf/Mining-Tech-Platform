# Checkpoint — 2026-09-11T00:22:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6a109185

## Completato
Unità 60 (ottava e nona fetta di B3, un commit): G26 — `pfCls` +
`ENECOL`/`ENELAB`, `classeRelief` + `RELCOL`, `codiceVolataGenesi`; G27 —
`_sigSpark`, `_ppvBaseHtml`, `shade` in `genesi-data.js` e `fmtT` in
`genesi-formato.js`. Tutte identiche (0 divergenze su 20.000 casi ciascuna).
run-kpi 2842, genesi-data 112/112, genesi-formato 9/9, 152 funzioni nella
pagina.

## Imparato
- Un `kill` per PID va fatto sul PID che si è LETTO, non su tutti quelli che
  la stessa ricerca ha stampato: due bash somiglianti, uno era la catena da
  fermare e l'altro il giro di verifica da tenere. Spento tutt'e due,
  rilanciato uno.
- Una catena in background che finisce con `git add -A` stagia anche il lavoro
  iniziato DOPO averla lanciata: o si aspetta prima di toccare l'albero, o la
  catena si ferma a prima dello stage.

## Prossimo passo atomico
Leggere il registro del giro filtrato del browser (`scratchpad/giri/
giro-browser-20260910-2157.log`, `leggi-giro.mjs`) se è finito: il KO
«terra @320 la barra taglia» sta DENTRO la controprova (voluto). Poi la
decima fetta di B3 (restano 48 a una o due variabili): `mdlProfSnap`,
`d2HitTest`/`d2HitTestPt` (leggono `D2._m`: la firma prende la mappa),
`_sentCodice` è fatto; oppure una passata sull'emulatore (123 prove) o la
ricerca a rotazione su un'app.

## Blocchi
Nessuno.
