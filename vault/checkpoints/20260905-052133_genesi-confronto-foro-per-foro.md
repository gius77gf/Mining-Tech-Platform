# Checkpoint — 2026-09-05T05:21:33Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
67d3a0b8 — Genesi: il confronto progettato/reale FORO PER FORO — accoppiato per id, dichiarato quando è per numero

## Completato
Pezzo (3): il cantiere GENESI↔CAMPO «foro per foro» è CHIUSO (1)(2)(3).
- `confrontoPerForo(holes, righe)` in genesi-data.js: per id o per numero
  (dichiarato), fori senza riga, righe orfane, chiavi doppie, `misurabile`.
- `scartoPct`/`scartoLivello` spostate in `shared/dw-ponti.js` (Campo
  ri-esporta, test d'identità; `sonda-vuoto` con la chiave `ponti.`).
- Pagina: tabella a due colonne sotto la riconciliazione di Campo, misurata a
  320 con tre scatti (l'ultimo intero); nota con chiave, senza-riga, orfane.
- run-kpi +5 (2628/0), `genesi-frasi-limite` 36/0, giro `node` sulla copia
  verde con 3.540 asserzioni; documenti 3.109 / 820 / 213; roadmap: voce
  chiusa e indice tolto; ricerca Genesi chiusa con ciò che resta fuori.
- La tabella in fondo alla mappa NON cambia: la direzione Campo→Genesi
  esisteva già (3e/§4), qui si è arricchita.

## Prossimo passo atomico
Genesi — il progetto salvato in Home deve portare i FORI. Osservato al pezzo
(1): `volSnapshot` (riga «design:JSON.parse(…)», ~4842) non salva `D2.holes`,
e «Apri» (~4977) fa `D2.holes=[]` → `draw2D` rigenera la maglia: un foro
aggiunto sulla tela, uno tolto e un ritardo a mano (`tMano`) NON sopravvivono
a salva→riapri — cioè un foro cancellato ricompare. Non è una scelta: è un
dato perso. Unità: (a) in `volSnapshot` aggiungere
`holes: D2.holes.map(h=>({id:h.id, mx:h.mx, my:h.my, tMano:h.tMano??null}))`
(niente tDet/seq/relief: si ricalcolano); (b) in «apri», se `design.holes` è un
array non vuoto con mx/my numerici, `D2.holes = quelle` (con `idForoMaglia`
per chi non ha id) e `computeSeq2D()`, altrimenti `[]` come oggi; (c) prova
in run-kpi su una funzione pura `foriDaDesign(design)` (valida, ripristina,
scarta i non numerici dichiarandolo); (d) banco: in
`genesi-documenti-che-escono` o nuovo, salva con un foro tolto e uno a mano,
riapri dalla Home, e pretendi gli stessi id nel piano di carico. Peso
misurato prima: una volata da 12 fori in localStorage resta sotto 2 KB.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
