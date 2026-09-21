# Ultimo ciclo

- **Quando**: 2026-09-21T11:11:37Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 919d5469 (test(genesi): copertura browser per
  play/pausa/scrub della timeline)
- **Cosa sto per fare**: scritto un nuovo banco browser su Genesi per la
  modellazione 3D del fronte (`#btnModella`, trascinamento delle
  maniglie cresta/piede, 13/0), aggiungendo al ponte di debug
  `window.__genesi` gli helper minimi necessari per proiettare una
  maniglia Three.js sullo schermo (`mdlHandleScreenPos`) e leggere lo
  stato (`modella`/`mdlUndoLen`/`mdlRedoLen`). Nessun `DIFETTI`/
  `--controprova`: nessun bug storico da riprodurre. Propagati banchi
  456→457, file distinti 208→209, asserzioni 4285→4286 (da confermare
  con l'ultimo giro dopo questo checkpoint). Checkpoint:
  `vault/checkpoints/20260921-111137_genesi-banco-modella-fronte-3d.md`.
- **Prossimo passo atomico**: bottoni camera (`[data-cam]`) e selezione
  del singolo foro (`holeInfoShow`), oppure secondo passaggio su
  `docs/GENESI_ROADMAP_COMPETITOR.md`/`docs/RICERCA_CONTINUA_GENESI.md`
  se quell'area risultasse priva di bersagli. Mandato del fondatore
  invariato: solo Genesi, massimo sforzo.
