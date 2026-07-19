# Pubblicazione delle app — stato e piano

## Fase gratuita (ATTIVA ora)

Il sito Netlify esistente di Deepwork pubblica l'intero repository
(`netlify.toml` in radice, publish = root). Con la struttura monorepo
questo significa che OGNI app è già raggiungibile online come percorso
del sito esistente, senza alcun sito aggiuntivo e senza costi:

- Deepwork core:  https://<sito-esistente>/
- Deepwork ID:    https://<sito-esistente>/apps/deepwork-id/
- Genesi:         https://<sito-esistente>/apps/genesi/genesi.html
- Scudo:          https://<sito-esistente>/apps/scudo/   (quando esisterà)
- ... e così via per ogni cartella di apps/

I riferimenti condivisi (`../../shared/...`) funzionano perché tutto è
servito dallo stesso sito. Ogni merge su main = deploy automatico.

## Fase commercializzazione (DOPO, su decisione del fondatore)

Quando si arriverà alla vendita: acquisto di UN dominio (unica spesa,
~10-20€/anno) e sottodomini per app (id.dominio, scudo.dominio, ...).
Tecnicamente: siti Netlify per sottocartella (base directory) con uno
step di build che copia shared/ dentro ogni app, oppure redirect/proxy
dal sito unico. Da decidere allora — NON ora (decisione del fondatore:
nessuna spesa prima della commercializzazione).
