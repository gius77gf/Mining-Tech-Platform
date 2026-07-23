# Checkpoint — 2026-07-23T02:00:00Z

## Tipo
unit-complete (Genesi — il visualizzatore drone ora legge il LAS, formato nativo di ODM)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — parseLAS + POC + test)

## Completato
Fallback genuino, NON speculativo (never-stop): tappare un buco di formato reale
in vista della "prova del weekend" del fondatore col dato ODM vero. Il POC
leggeva PLY/XYZ/OBJ/GLB, ma **ODM/WebODM esporta la nuvola come LAS**
(`odm_georeferenced_model.las`): scaricando la sua nuvola, il fondatore avrebbe
avuto in mano un `.las`/`.laz` che il visualizzatore NON apriva. È conoscenza di
formato, non un'ipotesi sulla forma del fronte (che resta gated).
- **`apps/genesi/pointcloud.js`** — nuovo `parseLAS(buf, maxpts)`: header pubblico
  LAS a offset fissi (little-endian) + record di punto. Coordinata reale =
  intero*scala+offset in DOPPIA precisione (UTM sui milioni → centraggio a valle,
  coerente coi fix serali OBJ/PLY). Colore RGB per i formati-punto 2/3/5/7/8/10
  (normalizzazione 8/16 bit auto). Downsample come gli altri parser. Riconosce il
  **LAZ** (bit 7 del formato-punto) e lancia un messaggio chiaro ("riesportalo in
  LAS o PLY"): il LAZ compresso richiederebbe un decompressore pesante.
- **`apps/genesi/nuvola-poc.html`** — import di `parseLAS`; `accept` e testo
  ampliati a `.las`/`.laz`; loader: `.las` → parseLAS, `.laz` → messaggio guida
  ("in WebODM/CloudCompare Salva con nome in LAS/PLV"); nota aggiornata.
- **`apps/deepwork-id/tests/run-pointcloud.mjs`** — +4 test LAS (ricostruzione
  coordinate UTM, colore formato 2, downsample, LAZ+firma-errata lanciano):
  11 → 15, tutti verdi. Helper `lasBuf()` costruisce un LAS 1.2 in memoria.
- **CI**: etichetta 340 → 344.

Verifica: syntax OK (modulo + inline POC); test puri verdi (helpers 43, kpi 174,
pointcloud 15, demo 7 = 239 puri + emulatore = 344); **smoke browser reale**: LAS
da 500 punti georeferenziato caricato nel POC → 500 elementi, pannello ritaglio
visibile, zero errori console.

## Prossimo passo atomico
Passo 3 drone (aggancio fronte→motore volata di genesi.html) resta gated sul test
weekend del fondatore col dato reale. Ora la catena di lettura copre i formati che
ODM produce davvero (nuvola LAS/PLY/XYZ, mesh OBJ/GLB). Fallback nel frattempo:
seconde iterazioni app / test / rotazione ricerca.

## Blocchi
Passo 3 drone: gated sul fondatore (forma reale, non a indovinare). #321 estetica:
gated. LAZ compresso: fuori portata senza decompressore pesante (dato messaggio guida).
