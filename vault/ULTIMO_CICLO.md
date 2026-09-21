# Ultimo ciclo

- **Quando**: 2026-09-21T10:14:14Z (letta da `date -u`, non predetta)
- **Commit di partenza**: fc8bb528 (chore(vault): propaga il numero
  vero di asserzioni (4284), giro-node pulito)
- **Cosa sto per fare**: controllati i layer del Progetto 2D
  (Isocrone/Energia/Innesco/Griglia) come ultimo candidato per il
  metodo "verifica dal vivo": nessun segno di difetto storico non
  coperto, a differenza di tratti/innesco-xml — non scritto un banco
  senza un difetto noto da riprodurre. Chiuso il blocco con un
  checkpoint di bilancio:
  `vault/checkpoints/20260921-101414_genesi-blocco-esaurito-giro-pulito.md`.
  Stato misurato: giro-node.mjs 41/41, 0 caduti, 4284 asserzioni,
  documenti coerenti.
- **Prossimo passo atomico**: cambiare area — la scena 3D (`buildSim`/
  `renderSim`) e la timeline dello sparo, cercando azioni utente senza
  copertura browser (play/pausa/scrub, cambio qualità, cambio look),
  invece di continuare su RICERCA_CONTINUA_GENESI.md o gli export 2D
  (entrambi già esauriti in questo blocco). Mandato del fondatore
  invariato: solo Genesi, massimo sforzo.
