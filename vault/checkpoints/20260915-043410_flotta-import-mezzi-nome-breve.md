# Checkpoint — 2026-09-15T04:34:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3df48d43 (pushato)

## Cosa è stato completato

Chiuso il primo dei tre difetti trovati dalle passate in profondità lanciate
in parallelo su Flotta, Conti e Sentinella (checkpoint precedente
`20260915-034940`). Riverificato a mano — grep diretti sul codice, non la
parola dell'agente — prima di agire.

**Il difetto**: `nomeBreve()` (tutto ciò che precede " — " nel nome del
mezzo) è dichiarata dal modulo come "la chiave con cui tutta l'app collega
manutenzioni, scadenze, interventi e controlli". Il form interattivo di
creazione mezzo confronta già per nome breve prima di lasciar passare un
nome che collide con uno esistente. L'import CSV del parco (`mez-file`,
`apps/flotta/index.html`) confrontava invece il **nome intero**, sia dentro
il file appena letto (`senzaDoppioni(lette, x => x.nome)`) sia contro
l'archivio già presente (`MEZ.some(m => m.nome.trim().toLowerCase() ===
r.nome.toLowerCase())`).

Un mezzo già registrato con marca/modello (demo: "Escavatore E1 — CAT 352")
non fermava una riga CSV che portasse solo il nome corto ("Escavatore E1",
come lo esporterebbe un gestionale diverso): nasceva un secondo documento
con lo stesso nome breve. Da lì ogni ricerca per nome breve (tagliandi via
`prossimoTagliando`/`urgenzaManutenzione`, libretto di manutenzione via
`fascicoloMezzo`, affidabilità del parco via `affidabilitaFlotta`, costo
orario via `costoOrarioMezzo`) trovava un mezzo A CASO fra i due — un
tagliando scaduto sul mezzo vero poteva leggersi "tranquillo" sul fantasma
appena creato con zero ore di storia.

**La correzione**: allineate entrambe le chiavi di confronto a
`nomeBreve(...)`, sia nel dedup interno al file sia contro l'archivio.

**Verifica**:
- Nuovo banco dedicato `apps/deepwork-id/tests/browser/flotta-import-
  mezzi-nome-breve.mjs`, modellato su `terra-inventario-csv.mjs` (server
  statico + contrassegno pid + `db.aggiungi` vero, non un mock): costruisce
  il caso con la dimostrazione reale (m1 = "Escavatore E1 — CAT 352"),
  importa un CSV con la sola riga "Escavatore E1" e verifica che l'esito
  dica "1 già presente (saltato)" e non "1 mezzo aggiunto", e che il parco
  mostri "Escavatore E1" una volta sola dopo l'import.
- Eseguito direttamente (non solo dichiarato): 8/8 in modalità normale.
- Controprova (rimette il vecchio confronto per nome intero): 4 KO su 8,
  esattamente sulle asserzioni che contano — la controprova sa fallire.
- Registrato in `apps/deepwork-id/tests/browser/tutti.mjs` (banco + sua
  controprova), altrimenti sarebbe un banco che nessuno lancia.
- `sintassi-pagine.mjs`: 34/34. `run-stile.mjs`: 328/0 (invariato, nessuna
  struttura nuova contata). `numeri-nei-documenti.mjs`: aggiornati 289→291
  banchi del browser e 124→125 file di banco distinti in tutti e quattro i
  documenti cascata (il nuovo banco+controprova sono due esecuzioni in più
  da un file in più); verificato 43/0.
- Giro isolato su worktree separata, DUE volte: la prima ha scoperto che il
  "giro completo" dichiarato nei documenti (3.931) era già stale di 1
  rispetto al vero (3.932) — corretto anche questo, poi rilanciato pulito:
  **40 comandi a posto, 0 caduti**, "e i 2 documenti che lo dichiarano
  dicono lo stesso numero".
- `git status --short` verificato prima del commit: esattamente i 7 file
  intesi (index.html, tutti.mjs, il nuovo banco, i 4 documenti).

## Stato roadmap

Nessuna voce di roadmap dedicata (era un difetto trovato da ricerca
mirata, non una voce già scritta). Aggiornato solo il conteggio dei banchi
nei quattro documenti cascata.

## Prossimo passo atomico

Committare il secondo difetto già verificato e pronto (Conti:
`estrattoContoCliente`/`testoSollecito` non escludevano le fatture "come
non emesse" dal totale/mora — codice e test già scritti e verificati con
`node run-kpi.mjs` diretto, 2985/0). Serve solo un giro isolato fresco su
worktree (i precedenti due tentativi erano su snapshot con il documento
ancora a 3.931, già corretti in questo commit): ricostruire la worktree da
HEAD (ora 3df48d43), applicare il diff staged di Conti, rilanciare
`giro-node.mjs`, verificare `git status --short`, poi `git commit -F` +
push + checkpoint. Poi lo stesso per Sentinella (terzo difetto, già
codificato e testato: `misureDelGiornoPerReclamo` con la soglia efficace
del ricettore invece di quella grezza del punto).

Nessuno stop volontario: si prosegue subito.
