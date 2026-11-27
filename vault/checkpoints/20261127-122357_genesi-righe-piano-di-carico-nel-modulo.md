# Checkpoint — Genesi: le righe del piano di carico le prepara il modulo (fetta di B3)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («refactor(genesi): le righe del piano di
carico le prepara il modulo»). Stato dei precedenti: vedi «Verifiche».

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `righePianoDiCarico(holes, progetto)` (231 →
  232 provate), identica all'espressione che stava in `btn-piano-csv`.
- `apps/genesi/genesi.html`: `const righePiano=righePianoDiCarico(D2.holes,
  D2);` — il resto del gestore (file, piano per Campo, messaggio) invariato.
- `run-kpi` 3275 → 3276; `documenti-dimostrazione` 177 documenti, 35 di
  Genesi.
- `apps/deepwork-id/tests/chi-cita.mjs` (misura dichiarata, nuova): per ogni
  riga di un corpo da spostare, quali file di prova la citano; e i nomi che
  il corpo dichiara, da cercare nel resto del gestore.
- `genesi-foro-per-foro.mjs`: un'iniezione riancorata sul modulo.
  `genesi-documenti-che-escono.mjs`: le iniezioni si applicano anche al
  modulo.

## Trovato strada facendo
- ⛔ Il conto «chi cita le righe che sposto» fatto a campione per la terza
  volta di fila: da qui lo strumento. Si usa PRIMA di ogni trasloco:
  `node apps/deepwork-id/tests/chi-cita.mjs <file col corpo>`.
- La premessa scritta nella prova («con 84 ms fra le file ci sono fori alla
  pari») è caduta al primo lancio: erano sedici istanti su sedici. Con 63 ms
  sono dieci. Il difetto «ordine rovesciato fra i pari» lo vede solo quel
  caso.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4543.
  ⚠️ Durante quel giro ho aggiunto `chi-cita.mjs` e corretto i documenti:
  l'albero si è mosso sotto di lui. Il numero torna, ma il giro che conta è
  quello sul committato, che parte dopo questo push.
- Sull'albero vero: `genesi-documenti-che-escono` 101/101 e controprova (16
  difetti su 16, applicati ora anche al modulo); `genesi-foro-per-foro`
  214/214 e controprova col rosso voluto (72 iniezioni su 72);
  `genesi-maglia-assente` 40/40.
- `3cf4d49a` (confronto A/B e i due messaggi corretti; contiene `32a0b024`):
  giro `node` sul committato 47 comandi a posto, 4541. ⚠️ Il giro dei 56
  banchi su quella copia era a 32 su 56 (32 a uscita 0) quando questo file è
  stato scritto (`scratchpad/giro54-banchi.txt`): va letto fino in fondo.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.778 prove senza rete (3276 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4543 su 47 comandi · condivisi 406 su 406 · `genesi-data.js` 232/232 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
Di B3 resta nella pagina il **CSV della scheda volata** (`btn-scheda-csv`),
e il foglio intero. NON è un trasloco puro: le righe leggono `D2`, `k`
(`computeKPI`), `_cKCsv` (costo), `_eP`/`_eA` (verdetti), `_senzaDistCsv`.
Prima di scrivere codice:
1. salvare il corpo (da `const rows=[` — o come si chiama lì — fino alla
   `let csv='parametro;valore\n'…`) in un file e lanciare
   `node apps/deepwork-id/tests/chi-cita.mjs <file>`: almeno
   `genesi-documenti-che-escono.mjs` cita `['MIC carica per ritardo (kg)', _mic],`
   e la prova «i tre file chiamano DAVVERO csvCell» cita
   `+rows.map(r=>csvCell(r[0])+';'+csvCell(`;
2. elencare OGNI nome libero del corpo (quelli che non dichiara): sono gli
   argomenti della funzione pura — `csvSchedaVolata({ progetto, k, costo,
   verdetti, … })`. Se sono più di una decina, la fetta va divisa: prima le
   RIGHE come dato (`righeSchedaVolata(...)`), poi il testo;
3. identità carattere per carattere sugli stessi dati contro il corpo di
   prima, con `new Function` come nelle due fette precedenti
   (`scratchpad/ab/identita.mjs` è il modello).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti e decimali nei CSV: prima la prova con Excel), 37
(sul telefono: trascinare un foro subito o dopo averlo scelto); 32
rimandata.
