# Ultimo ciclo

- **Quando**: 2026-09-19T20:06:46Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 9e6357bc (feat(genesi): G58, scala tratti
  dall'origine)
- **Cosa sto per fare**: valutato «Blocchi/simboli riusabili» (ultima
  trasformazione CAD del censimento) e SCARTATO per ora — il censimento
  stesso lo dichiara costo GRANDE/priorità BASSA-MEDIA, senza un caso
  d'uso reale verificato in Genesi oggi. Al suo posto, implementata
  G59 — `deviazioneStatistiche` in genesi-data.js: media e massima della
  deviazione RADIALE di perforazione (`Math.hypot(dx,dy)`, non dx/dy col
  segno, che dipende dalla convenzione di assi del rilievo boretrack
  ancora non confermata), segnalata dalla ricerca del 19/09 su Genesi
  come mancanza reale rispetto al QC statistico di JKSimBlast —
  verificata prima con un `grep` per nome (zero righe) prima di scriverla.
  Mostrata nel pannello di import del rilievo, verificata dal vivo con
  Playwright (numeri ricalcolati a mano, combaciano alla cifra). 2 test
  nuovi in run-kpi.mjs (3229/0). Giro node completo, due lanci
  consecutivi identici: 41/41, asserzioni 4281 (corretto anche un
  placeholder lasciato per errore in STATO_PRODOTTO.md durante la
  propagazione — stessa trappola già presa e chiusa durante G58, presa e
  corretta di nuovo subito). Checkpoint:
  `vault/checkpoints/20260919-200646_genesi-g59-deviazione-statistiche.md`.
- **Prossimo passo atomico**: rilanciare `tutti.mjs --solo=genesi` con
  l'output intero salvato su file (non `| tail -20` come nell'ultimo
  lancio, che ha perso il dettaglio dei "21 da guardare" del batch dopo
  G58), leggere quei 21 e distinguere KO veri da controprove volute
  prima di aprire un cantiere su di essi.
