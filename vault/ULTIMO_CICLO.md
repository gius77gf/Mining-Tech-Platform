# Ultimo ciclo

- **Quando**: 2026-09-19T22:45:08Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 9c10c262 (chore(vault): checkpoint di lettura sul batch genesi parziale)
- **Cosa sto per fare**: letto per intero il batch `tutti.mjs
  --solo=genesi` (73 a posto, 22 da guardare) — 20 dei 22 erano
  controprove che funzionano correttamente (escono non-zero apposta),
  1 era "NON MISURATO" (scena non raggiunta in un banco, da capire),
  1 era un crash vero: `genesi-snap-estremo.mjs` (G48) andava in timeout
  perché il secondo clic di un tratto cadeva sulla barra di navigazione
  fissa invece che sulla tela. Causa isolata per confronto con la
  baseline pre-G57: i controlli Ruota/Scala tratti (G57/G58) diventavano
  visibili troppo presto (subito dopo il primo clic, non solo dopo
  "Fine tratto"), facendo crescere la barra degli strumenti di 40 px —
  quel tanto che basta a spingere la tela sotto la barra fissa.
  Corretto in `syncTrattoUI` con una guardia `!inCorso`. Verificato dal
  vivo con Playwright a 430×900/950 e 390×950 (le combinazioni usate dai
  banchi reali): il banco che aveva trovato il difetto torna 8/8 pulito,
  la sua controprova sa ancora fallire, rotate/scale restano funzionanti
  dopo "Fine tratto". Limite dichiarato e non toccato: a viewport più
  estremi (320×700) lo stesso schiacciamento esiste ANCHE nella
  baseline pre-G57 — difetto strutturale preesistente, fuori scopo.
  1 test nuovo in run-kpi.mjs (3230/0). Giro node completo, due lanci
  consecutivi identici: 41/41, asserzioni 4282. Checkpoint:
  `vault/checkpoints/20260919-224508_genesi-fix-syncTrattoUI-tela-coperta.md`.
- **Prossimo passo atomico**: capire il "NON MISURATO" residuo nel banco
  `genesi-campi-assenti.mjs` (2 scene su 57 non raggiunte: "la spalla",
  "la spalla che non decide") — probabile problema di timing del banco,
  non ancora confermato — prima di continuare con altre unità verificate
  su Genesi.
