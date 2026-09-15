# Checkpoint — 2026-09-15T23:16:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1cb18e1d

## Cosa è stato completato
Chiusa la Proposta 2 di `docs/RICERCA_CONTINUA_PAROLE.md` (documento
invecchiato dal 04/09, riverificato da un agente più presto in questo
ciclo): la riga che dichiara il periodo di un report generato da un
adempimento in Sentinella diceva «Le date non sono state scelte a
mano: si ricavano dalla scadenza del...» — una negazione. Riscritta al
positivo, «Periodo ricavato dalla scadenza del...», uniformandola alla
forma già usata altrove nello stesso ecosistema (`provenienzaVolume`
di Conti, `intestazioneOrigineReport`/`DICHIARAZIONI_PERIODO.ricavato`
nello stesso file di Sentinella). Riscrittura di una frase, nessuna
logica toccata.

Anche la Proposta 4 (numero di riga fisico negli import CSV) è stata
marcata chiusa nello stesso documento — era già stata implementata
nei quattro lotti precedenti (`righeCsvNumerate`), solo il documento
non lo dichiarava ancora.

Aggiornato il banco browser esistente `tests/browser/sentinella-
periodo-adempimento.mjs`: l'assertion che citava la vecchia frase ora
pretende la nuova forma e vieta ogni negazione residua; aggiunta una
sesta iniezione dedicata alla sua controprova.

## Verifica
- Banco browser: 36 ok, 0 KO. Controprova isolata (`--controprova
  --difetto=5`) cade esattamente sulle due nuove assertion; con tutti
  e sei i difetti insieme, 16/36 cadono (atteso, difetti multipli
  insieme).
- `run-kpi.mjs` 3040/0, `run-stile.mjs` 328/0, `sintassi-pagine.mjs`
  34/0 — nessun conteggio cambiato (la modifica non tocca nessuna
  suite `node`).
- Verificato su worktree isolata (copia esatta di quello che si sta
  committando): tutti e quattro puliti, incluso
  `numeri-nei-documenti.mjs` (43/0, nessuna cifra da correggere in
  questa unità).

## Stato roadmap
`docs/RICERCA_CONTINUA_PAROLE.md`: 2 proposte chiuse (2, 4), 3 restano
aperte (1, 3, 5) — tutte e tre toccano una scelta di prodotto o
richiedono più lavoro (denuncia riepilogativa mensile, vocabolario del
"non calcolabile" trasversale a 117+112 punti, pesato/presunto in
Conti).

## Prossimo passo atomico
Nessuna unità piccola e sicura pronta senza decisione del fondatore o
lavoro più grande sui filoni aperti oggi. Candidati per il prossimo
blocco, in ordine di preferenza:
1. Il primo passo atomico verso "Il Quadro" nel core, MA verificato
   che il pattern proposto da un giro di ricerca precedente
   (funzione-ponte generica in `shared/dw-ponti.js`) non regge: quel
   modulo contiene SOLO funzioni pure (nessuna lettura Firestore live
   — le letture live vivono nei file `-data.js` di ogni app, es.
   `ponteScudo` in `sentinella-data.js`). Prima di scrivere qualunque
   ponte per Il Quadro va deciso DOVE vive la lettura live (dentro
   `index.html` stesso, che non ha un modulo `-data.js` proprio, o in
   `shared/deepwork-id-client/index.js` come estensione dell'SDK) —
   scomporre questo prima di scrivere codice, come richiesto da
   CLAUDE.md.
2. Proposta 3 di PAROLE (una parola sola per "non calcolabile", niente
   "non rilevato"): trasversale a 117+112 punti, richiede prima una
   misura di quante occorrenze useranno quale forma prima di scrivere
   qualunque codice — non è piccola come le proposte già chiuse.
3. Seconda iterazione UX/estetica su un'app non ancora toccata con una
   passata dedicata in questo ciclo.

## Blocchi
Nessuno tecnico.
