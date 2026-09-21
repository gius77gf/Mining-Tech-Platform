# Ultimo ciclo

- **Quando**: 2026-09-21T11:36:41Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 186aa1f3 (test(genesi): copertura browser per
  la modellazione 3D del fronte)
- **Cosa sto per fare**: scritto un nuovo banco browser sui quattro
  bottoni camera della scena 3D (12/0), trovando un difetto REALE
  misurato dal vivo: la camera "Da terra 50 m" non arriva mai a y=1,7
  come dice la sua formula, perché la barriera anti-sottoterra del
  trascinamento libero (`ctrl.maxPolarAngle`) la clampa sempre a
  y≈5,5015 — confermato col calcolo trigonometrico a mano. Non
  corretto di iniziativa (tre strade diverse, nessuna ovvia): aggiunta
  la **decisione 31** in `docs/DECISIONI_WEEKEND.md`. Il banco blinda
  il comportamento misurato, con riferimento esplicito alla decisione.
  Propagati banchi 457→458, file distinti 209→210. Checkpoint:
  `vault/checkpoints/20260921-113641_genesi-camere-decisione31.md`.
- **Prossimo passo atomico**: interazione di selezione del singolo
  foro (`holeInfoShow`, righe ~2927-2946), o secondo passaggio su
  `docs/GENESI_ROADMAP_COMPETITOR.md`/`docs/RICERCA_CONTINUA_GENESI.md`
  se quell'area risultasse già coperta. Mandato del fondatore
  invariato: solo Genesi, massimo sforzo.
