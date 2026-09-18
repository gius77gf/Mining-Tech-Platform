# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T15:45:57Z
- **Commit di partenza**: e9f7ddb9
- **Cosa sto per fare**: completare il fix Flotta `csvGiriMacchina` (le ore
  col punto inglese invece della virgola italiana, sesta ricorrenza della
  stessa famiglia già chiusa in cinque export gemelli), isolato in una
  worktree fresca da HEAD (`/tmp/wt-flotta-csvgiri2`, il worktree
  precedente era stale — creato prima di quattro unità intermedie), già
  verificato con KPI + controprova, giro `giro-node.mjs` in corso. Poi, in
  coda dai deep-pass QA di background già verificati dal vivo (non sulla
  parola sola): Scudo (`statoAppalto` non segnala una qualifica «in
  scadenza»), Campo (banner Squadre ignora `hse.senzaScadenze`), Flotta
  (fascia colore della riga dei componenti a vita propria fissa
  indipendentemente da `c.stato`). Da investigare: un crash di
  `flotta-contatore.mjs --controprova` incontrato per caso, non ancora
  chiaro se difetto vero o banco invecchiato. Appena chiusa: la trappola
  del focus nella modale (shared/dw-app-ui.js E index.html — due
  implementazioni indipendenti, entrambe corrette), commit 6908c61c.
