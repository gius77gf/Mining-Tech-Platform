# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T12:51:46Z
- **Commit di partenza**: 8424442e
- **Cosa sto per fare**: chiudere tre unità dai deep-pass QA già scritte e
  verificate in worktree isolate: accessibilità toast (shared/dw-app-ui.js
  e core/Genesi/admin, /tmp/wt-toast-a11y — giro di convergenza dei numeri
  in corso), Terra (`renderValore` usava `rilievoUsabile` invece di
  `rilievoUsabileConData` — un rilievo a calendario impossibile gonfiava il
  «Valore del materiale estratto» di oltre 13 volte, mentre la Denuncia
  restava corretta; nuovo banco browser dedicato, verificato con
  controprova), Flotta (`csvGiriMacchina` scriveva le ore col punto inglese
  invece della virgola italiana — sesta ricorrenza della stessa famiglia
  già chiusa in cinque export gemelli, verificato con controprova). Due
  nuovi agenti di deep-pass QA in background su Terra e Flotta hanno già
  fruttato questi due difetti; ne servono di nuovi per mantenere ≥3
  cantieri. Dopo: la trappola del focus nella modale (shared/dw-app-ui.js)
  e il listener accumulato su #modal-foot in Conti.
