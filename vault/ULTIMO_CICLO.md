# Ultimo ciclo

- **Quando**: 2026-09-19T18:31:11Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 3f4b0ecc (feat(genesi): G56d seconda
  iterazione, anello visivo per foro senza raccordo)
- **Cosa sto per fare**: implementata la seconda trasformazione CAD
  della sezione 3 di docs/RICERCA_GENESI_CAD.md — G57, "Ruota tratti"
  (`trattiRuotati` in genesi-data.js): ruota tutti i tratti attorno al
  loro centroide comune, per correggere sul posto l'orientamento di un
  rilievo DXF con assi diversi da Genesi, senza dover reimportare.
  Deliberatamente NON applicabile ai fori (mx/my sono burden/spaziatura,
  non coordinate libere — stesso principio del mirror G50). Verificato
  dal vivo con Playwright: import DXF reale, rotazione di 90° con la
  matematica controllata a mano, Ctrl+Z, angolo illeggibile (guardia),
  cambio tool, e screenshot a 320/390/430px senza fuori-schermo. 6 test
  nuovi in run-kpi.mjs (3220/0). Giro node completo 41/41, asserzioni
  stabilizzate a 4272 dopo aver corretto un conto di funzioni condivise
  invecchiato (genesi-data.js 175→176). tutti.mjs --solo=genesi lanciato
  ma non ancora concluso al momento del commit (sistema sotto carico da
  più giri paralleli di questa sessione) — verificato a mano in modo più
  mirato del batch generico. Checkpoint:
  `vault/checkpoints/20260919-183111_genesi-g57-ruota-tratti.md`.
  **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` al prossimo ciclo; poi valutare se «Scale» per i tratti
  ha un caso d'uso reale prima di costruirlo (stessa disciplina già
  applicata a rotate/mirror — non costruire solo perché un CAD ce l'ha).
