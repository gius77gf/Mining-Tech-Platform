# Checkpoint — 2026-09-12T12:03:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
46fad1f1

## Cosa è stato completato (unità 122)

Seconda funzione della fascia di mezzo di B3, dopo `_sitoParseCsv`
(unità 121): `_sentCell` era marcata legata a quattro variabili del
modulo per lo stesso falso positivo del tokenizzatore di
`genesi-estraibili.mjs` (lettere dentro la sua regex `/[\r\n\t]+/g`).
Letta a mano è pura — chiama `csvCell` di `shared/` dopo aver
normalizzato gli a-capo. Trasloco in `genesi-data.js` accanto a
`_sentNum`, parola per parola, portato con lei il commento storico sulla
terza copia debole di `csvCell` che correggeva.

Una prova di comportamento in `run-kpi.mjs`, e aggiornata la prova "sono
USCITE dalla pagina" per coprire anche lei.

**Trovata e corretta una controprova che sarebbe scaduta subito**: la
prova "i tre file che escono chiamano DAVVERO csvCell" cercava la vecchia
definizione dentro `genesi.html`; corretta per leggere `genesi-data.js`
per l'export verso Sentinella. La controprova del browser
(`genesi-numeri-tranquilli.mjs --controprova`) iniettava il difetto nella
pagina SERVITA (non nel file sorgente): il server ora serve anche
`genesi-data.js` sotto `--controprova`, e l'ancora dell'iniezione segue
la funzione al suo indirizzo vero. Verificato lanciando la controprova
per intero (browser reale): **7 difetti su 7 rimessi, 18 prove cadute**
come atteso; il banco normale resta verde (**35/35**).

Effetti a cascata sui documenti, tutti verificati: fondo di
`genesi-data.js` in `copertura-funzioni.mjs` 128→129; tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md` 150→149 funzioni, 19→18 nel
bucket 3-5; scomposizione del codice condiviso 292/292→293/293,
`genesi-data.js` 128/128→129/129; totale prove locali 3.396→3.397
(`run-kpi` 2915→2916) in quattro documenti; giro completo
3.854→3.855 asserzioni.

Verificato con `giro-node.mjs` su worktree pulita: **40 comandi a posto,
0 caduti, exit 0**.

## Il giro del browser sul commit precedente (a820c6d2) è stato letto

Il giro lanciato durante l'unità 118/119 è finito (2h15, 53 banchi a
posto, 4 da guardare). Letto con `leggi-giro.mjs`: **2 KO veri**, entrambi
lo stesso difetto — Sentinella, modale «Dopo-volata», etichetta
`Esplosivo reso (kg)` con l'unità in maiuscolo (manca il
`<span class="u">` che la esclude dalla trasformazione `.fl`). Tutto il
resto era controprova (35 passate, rosso voluto) o righe "non ho
guardato" (temi assenti per app che non li hanno, classi mai comparse).
Corretto separatamente (vedi prossimo commit, non ancora checkpointato
quando questo file è stato scritto).

## Stato roadmap

Aggiunta nota datata 12/09 dentro l'entry B3 in
`vault/ROADMAP_SETTIMANA.md` (unità 122, seconda della fascia). Resta
`[ ]`: il cantiere non è chiuso, restano 17 funzioni nel bucket 3-5 e 24
nel 6-10.

## Blocchi
Nessuno.

## Prossimo passo atomico

Il fix dell'etichetta `Esplosivo reso (kg)` in `apps/sentinella/index.html`
è già scritto e verificato (staticamente: `run-stile.mjs` e
`sintassi-pagine.mjs` verdi; il pattern è identico a tre etichette sane
nello stesso file) ma non ancora committato quando questo checkpoint è
stato scritto: va committato come unità a sé (123), con giro-node su
worktree prima del commit, poi checkpoint.
Dopo: continuare con la prossima unità piccola. Non serve un nuovo giro
del browser sul solo commit di Genesi (121-122): tocca `genesi.html` e
`genesi-data.js`, ma `sintassi-pagine.mjs`, `nomi-liberi.mjs` e
`import-esistenti.mjs` (tutti nel giro `node`, già verdi) coprono il
rischio residuo di un trasloco puro senza cambio di firma; un giro
mirato su Genesi (`--solo=pagine-vive,csv-dimostrazione,disegni,contrasto`)
resta comunque utile se il tempo lo permette, prima di aprire il
prossimo cantiere sostanzioso.
