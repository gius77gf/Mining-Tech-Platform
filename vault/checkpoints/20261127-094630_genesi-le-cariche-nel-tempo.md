# Checkpoint — Genesi: sul report il disegno «Cariche nel tempo», con la MIC in arancio

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): sul report il disegno
«Cariche nel tempo»…»). Dei precedenti: `b5a7d010` (report con pianta e
tabella) è confermato dal giro `node` (47 comandi, 4535) e dal giro completo
dei 56 banchi di Genesi su una copia del committato, 56 su 56 a uscita 0.
⚠️ `2a0714a2` (la MIC dice quali fori) ha il giro di conferma ANCORA IN CORSO
(`scratchpad/giro47.log`, `giro47-banchi.txt`): va letto.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `caricheNelTempo`, `diagrammaTempiPerFoglio`
  (225 → 227 provate). Stesse finestre di `micFinestra`.
- `apps/genesi/genesi.html`: `_rLarga` (larghezza dei disegni del foglio,
  una volta sola); «Cariche nel tempo» dopo «Carica & sequenza».
- `run-kpi` 3270 → 3271; `genesi-foglio-pianta.mjs` 73 → 82 controlli,
  controprova 16 → 20 difetti (l'iniezione 7 riancorata su `_rLarga`).

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4537.
- Sull'albero vero: `genesi-foglio-pianta` 82/82 e controprova «✔» (20
  difetti su 20, ognuno sul suo controllo); foglio-in-cava
  55/55, numeri-tranquilli 39/39, maglia-assente 40/40, report-misfire 7/7,
  recettore-assente 19/19.
- Scatto del foglio a 430 px guardato (pianta, cariche nel tempo, frase
  sotto la MIC). A 1280 NON guardato a occhio: lo coprono i controlli di
  geometria del banco (nessuna scritta fuori o sovrapposta, barre dentro).
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.773 prove senza rete (3271 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4537 su 47 comandi · condivisi 401 su 401 · `genesi-data.js` 227/227 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
**Il CSV della scheda volata dice chi forma la MIC** (limite dichiarato
nell'unità della MIC; guardato: quel file lo rileggono solo i banchi, per
NOME del parametro — `grep -ln "scheda_volata\|MIC carica per ritardo"` su
test, app e shared dà tre banchi e la pagina). Patch pronte in
`scratchpad/csvmic/` (`patch_pagina.py`, `patch_banco.py`), non ancora
girate nel browser:
1. Pagina: `micChi:_m.chi` in `computeKPI`; riga
   `['Fori che formano la MIC', k.micCalcolabile?(k.micChi||''):'']` dopo
   «Perche la MIC non e calcolabile» (⚠️ senza toccare la riga
   `['MIC carica per ritardo (kg)', _mic],`: la cita un'iniezione di
   `genesi-documenti-che-escono.mjs`).
2. Banco `genesi-foglio-pianta.mjs`: gancio su `a.click()` per i file
   `data:`; due controlli (la riga del CSV è la frase del foglio), un
   difetto in più (21). Attesi 84 controlli.
3. Una prova in `run-kpi` sulla pagina; numeri nei documenti; roadmap.
Poi: banchi che leggono quel CSV da rigirare (`genesi-documenti-che-escono`,
`genesi-foro-per-foro`, `genesi-maglia-assente`).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.
