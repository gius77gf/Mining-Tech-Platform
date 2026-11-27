# Checkpoint — 2026-09-19T07:16:28Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8bc24938 — test(genesi): banco browser per lo snap a estremo (G48), ricerca implementazione CAD

## Cosa è stato completato
Chiuso il ciclo di verifica del secondo blocco di cantieri Genesi
dispatchati dopo G48 (QA deep-pass + ricerca implementazione CAD).

- [x] Scritto e verificato `apps/deepwork-id/tests/browser/genesi-snap-estremo.mjs`:
      prova il collegamento nel canvas vero di G48 (che `run-kpi.mjs` non
      può vedere). Due trappole pestate e corrette prima di fidarsi del
      banco: `.click()`/`.hover()` per posizione relativa rifiutavano di
      agire quando `#d2-scheda` intercettava il punto calcolato (risolto
      con `mouse.move`/`down`/`up` su coordinate di viewport assolute); un
      offset di test scelto a mano cadeva sul bordo della tolleranza di
      G48 per via della risoluzione interna del canvas (960px) diversa
      dalla sua dimensione CSS (402px) — misurato con uno script apposta
      prima di correggere, non indovinato. Registrato in `tutti.mjs`
      (195→196 file di banco, 431→433 esecuzioni), propagato nei quattro
      documenti sorvegliati.
- [x] Processato il report QA deep-pass su Genesi (`a4ff260ea9f56f6a8`):
      due findings, **entrambi verificati e scartati** dopo controllo
      indipendente — i tre bottoni di export segnalati sono generatori di
      download client-side senza scrittura su Firestore (la famiglia di
      difetto che `occupato()` previene non si applica); `numeroDaCampo`
      duplicata in 5 app è già nota e dichiarata di proposito da
      `nomi-doppi.mjs` ("0 da sistemare"). Nessuna azione necessaria —
      documentato in roadmap con la verifica per intero, per non far
      riaprire lo stesso dubbio a chi legge dopo.
- [x] Processato il report di ricerca implementazione CAD
      (`acba0f79b5cf78b19`), dispatchato in SEQUENZA (non in parallelo)
      dopo il primo agente di ricerca di stamattina, per evitare la
      collisione di scrittura già pestata una volta oggi: ha aggiunto
      algoritmi minimi e stima di costo per le tre lacune CAD ancora
      aperte (selezione multipla, trasformazioni, blocchi/input polare) a
      `docs/RICERCA_GENESI_CAD.md`. Non ancora verificato riga per riga
      contro il codice — prossimo passo prima di implementare.

## Verifica prima del commit
`sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/43 (18/18
voci d'indice, 433 banchi, copertura 1053/1053). `suite-collegate.mjs`:
3/3 (196 file di banco). Banco `genesi-snap-estremo.mjs`: 8/8 normale,
controprova 8 passati/1 fallito (l'unico KO voluto, quello che deve
cadere quando si rimette il codice pre-G48).

## Stato roadmap
Bilancio del pivot su Genesi fin qui: una capacità CAD reale implementata
e provata (snap a oggetti, G48), due report QA/ricerca processati con
verifica indipendente (uno confermava "niente da fare", l'altro ha dato
materiale per i prossimi passi). Restano tre lacune CAD confermate:
selezione multipla, trasformazioni (rotate/scale/mirror), blocchi
riusabili + input relativo/polare pieno.

## Prossimi passi
- **Prossimo passo atomico**: verificare riga per riga la sezione di
  ricerca appena aggiunta a `docs/RICERCA_GENESI_CAD.md` contro
  `apps/genesi/genesi.html`/`genesi-data.js` (stessa disciplina già
  applicata due volte oggi), poi scegliere fra selezione multipla e
  trasformazioni come prossima unità — la ricerca consiglia la selezione
  multipla per prima (costo piccolo, abilita le trasformazioni dopo).
- Aprire un secondo/terzo fronte in parallelo su Genesi (direttiva 26/07
  riletta dentro una sola app): un candidato è l'input relativo/polare
  (form di coordinate esatte già esiste da G47a, l'estensione al parsing
  di `@dx,dy`/`@dist<ang` è isolata e ben scoperta dalla ricerca).
- Il giro completo del browser (`giro-completo-19-0552.log`, PID 23083)
  era a 9 commit di distanza (3 sulle superfici misurate) all'ultimo
  controllo: da rileggere con `leggi-giro.mjs` quando arriva in fondo, o
  da considerare per uno spegni-e-rilancia se continua a crescere la
  distanza.

## Blocchi
Nessuno.
