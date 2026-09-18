# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T03:48:04Z
- **Commit di partenza**: 2036687c
- **Cosa sto per fare**: chiudere in tre commit separati (Terra, Sentinella,
  Campo) i difetti del terzo/quarto giro di deep-pass già corretti e
  verificati nel working tree (varianzaLottoAnno con calendario impossibile
  in Terra; il ponte meteo con Campo mancante su due delle quattro chiamate
  di misuraFuoriCondizioni in Sentinella; il giudizio di idoneità e i
  near-miss del turno assenti da rapportoGiornata/testoConsegnaTurno in
  Campo). Ogni commit viene verificato con un giro isolato su una worktree
  a strati (layer1 = solo Terra, layer2 = + Sentinella, layer3 = + Campo)
  prima di essere pushato. Dopo: proseguire con i difetti già confermati e
  ancora da correggere (Conti: registroVendite senza il controllo
  riepilogoIvaFattura(f).quadra; Genesi: D2.tratti non azzerato su «Apri»),
  poi continuare la rotazione di deep-pass/ricerca continua sulle app
  rimanenti.
