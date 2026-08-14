# Checkpoint — 2026-08-13 22:53 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `5a00578f` — le 21 prove sulle funzioni non erano bloccate dalla rete
- `564c0afe` — la ricerca sull'assenza dichiarata, con le fonti vere
- `5b466594` — Scudo: l'infortunio senza anno spariva da IF, IG e LTIFR
- `724bb02c` — Genesi: il colletto sembrava BEN CONFINATO perché la carica
  non c'era

## Che cosa è stato completato

**Tre unità, e tutte e tre nate da una domanda che nessuno aveva rifatto.**

1. **La sicurezza si verifica in casa, ed è 123 non 102.** Quattro file
   dichiaravano dall'08/08 che l'emulatore delle funzioni «chiede la rete e la
   politica del contenitore la nega», quindi 21 prove restavano «solo in CI».
   Falso: `functions/node_modules` era **vuota**. Un `npm ci` e sono **21/0**.
   Il giro adesso prova **4 su 4** — 75 regole · 19 SDK · 8 primo avvio · 21
   funzioni — e l'elenco delle suite tenute fuori è **vuoto**, tenuto come riga
   perché il conto si veda. Controprovato: tolta la cartella, **uscita 2 e
   niente provato**; rimessa, 123.
2. **Scudo, i clamp ricensiti**: 44 clamp, 38 sospetti, **zero difetti nei
   clamp** — e il difetto stava nel **vicino di casa**. Un infortunio senza anno
   leggibile spariva da IF, IG e LTIFR: **50,00 dove il vero è 100,00**, sui tre
   numeri che si portano in gara, nel verso che rassicura.
3. **Genesi, l'SDOB**: **5,84 m/kg⅓ con il pallino VERDE** dove il vero è
   **1,43**, perché la carica non c'era. E la stessa formula viveva in due posti
   con **ripieghi opposti che si compensavano per caso**: la correzione ovvia
   avrebbe portato lo sgombero persone da **404 a 197 m** senza un rosso.

## ⛔ Il filo che le lega, e vale più delle tre
**Un errore che nomina una causa plausibile la fa smettere di essere
verificata.** «La politica del contenitore nega la rete» è credibile ed è perfino
vera per `curl`; «B0-quater: un clamp fabbrica 5 kg/foro» era vera fino al 10/08.
Il segno da riconoscere non è il messaggio d'errore: è **la rinuncia scritta
accanto**. Quattro volte in una giornata, contando l'agente di ricerca che ha
dichiarato la rete bloccata avendo provato con `curl` mentre `WebSearch`
rispondeva.

## ⚠️ Un metodo nuovo, e la copia che l'ha subito ripagato
`run-kpi.mjs` lo stavano scrivendo **tre cantieri insieme**. Per committare una
unità per volta l'indice è stato costruito **da HEAD più il solo blocco
dell'unità**, con `hash-object -w` + `update-index --cacheinfo`, **senza toccare
il disco**. La copia di quello che si committa ha trovato subito che il blocco
tirato fuori usava un `import` definito altrove: due prove rosse invece di un
commit rotto in cima al branch.

## Le misure, lette sulla copia (mai sull'albero vivo)
`run-kpi` 2110 → **2124**, 0 falliti · condivisi **171/171** · app **727/727** ·
giro `node` **2903** asserzioni, 33 comandi a posto · `numeri-nei-documenti`
41/0 · emulatore **123/123**. Documenti aggiornati tutti e quattro.

## Che cos'è vivo adesso
- **Cantiere sul core** (B0-duovicies + l'arretrato del ramo touch).
- **Cantiere su Sentinella** (il report del periodo che l'adempimento chiede).
- **Cantiere sui lettori CSV muti** (B5, i nove candidati di Campo, Conti,
  Flotta e Terra).
- **Il giro del browser** su `d3653ec`, vivo da quasi quattro ore: il branch è
  **molto** più avanti, quindi i suoi KO vanno riverificati prima di aprirci un
  cantiere.

## Prossimo passo atomico
Raccogliere i tre cantieri man mano che consegnano — **un commit per unità**, con
la tecnica dell'indice costruito da HEAD finché `run-kpi.mjs` resta conteso — e
aggiornare ogni volta **la riga di roadmap che aveva proposto il lavoro**. Poi
rimisurare i banchi «numeri tranquilli» di **Scudo e Genesi**, che stanotte sono
stati saltati di proposito perché quelle due app le stavano scrivendo dei
cantieri, e rilanciare il giro del browser sullo stato di adesso.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola**
  (`orologio del vault: 7 passati, 1 falliti`), verificata di nuovo stanotte.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
