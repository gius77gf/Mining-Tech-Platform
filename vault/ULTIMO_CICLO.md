# Ultimo ciclo

- **Quando**: 2026-09-21T04:03:33Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 7975e1c6 (chore(vault): audit costoVolata/margine,
  nessun difetto trovato)
- **Cosa sto per fare**: chiudere una riga invecchiata in
  `docs/RICERCA_CONTINUA_GENESI.md` — la proposta "avviso prima di
  esportare con indicatori gravi" era dichiarata "scartata, non
  implementata", ma `git log -S "fraseGraviExport"` mostra che è stata
  fatta lo stesso giorno (commit 8e49ccf2, G53), con una forma diversa
  (suffisso non bloccante sul toast, non il modale bloccante scartato)
  che copre tutt'e quattro gli export ed è già coperta da un banco
  dedicato. Prima verificato che `tests/simulatore/cava-sintetica.mjs`
  non copre Genesi (solo una menzione in commento), quindi scartata
  l'opzione (b) del checkpoint precedente. Checkpoint:
  `vault/checkpoints/20260921-040333_genesi-chiusura-proposta1-export-gia-fatta.md`.
- **Prossimo passo atomico**: tornare a un'unità di sviluppo vera —
  verificare con WebSearch se UNI 9916/ISEE hanno un testo integrale
  raggiungibile (misurare, non assumere il "non si può"), oppure
  scorrere altre sezioni di `docs/RICERCA_CONTINUA_GENESI.md` con lo
  stesso metodo `git log -S` per trovare altre proposte già fatte e mai
  chiuse, o davvero ancora aperte.
