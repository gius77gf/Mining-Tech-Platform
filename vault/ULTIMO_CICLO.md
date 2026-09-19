# Ultimo ciclo

- **Quando**: 2026-09-19T20:10:48Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 2cfa9272 (feat(genesi): G59, statistica di QC
  sulla deviazione di perforazione)
- **Cosa sto per fare**: chiusa l'ultima riga di
  `docs/RICERCA_CONTINUA_GENESI.md` sotto "proposto da ricerca, non
  verificato" — «timing timeline» — verificando che è GIÀ PRESENTE:
  `buildTicks()` (genesi.html, "UI: timeline") disegna una tacca per
  foro dentro `#ticks`, sovrapposta alla barra di scorrimento `#track`
  della simulazione 3D, posizionata su `f.tDet/SIM.tEnd*100%` — è
  letteralmente una linea del tempo con la sequenza dei ritardi. Nessun
  codice scritto: costruirla avrebbe duplicato una funzione esistente,
  la stessa lezione già presa 3 volte su 6 nella stessa ricerca
  (Rosin-Rammler, Swebrec, isocrone: tutte "non c'è" false). La sezione
  "proposto da ricerca" della ricerca JKSimBlast del 19/09 è ora vuota.
  Checkpoint:
  `vault/checkpoints/20260919-201048_genesi-timing-timeline-gia-presente.md`.
- **Prossimo passo atomico**: leggere il registro completo di `tutti.mjs
  --solo=genesi` (lanciato alle 20:08Z con l'output intero salvato su
  file, non troncato con `| tail -20` come l'ultima volta) appena
  finisce, e distinguere i KO veri dalle controprove volute fra i "21 da
  guardare" del batch precedente (dopo G58) prima di aprire qualunque
  cantiere su di essi.
