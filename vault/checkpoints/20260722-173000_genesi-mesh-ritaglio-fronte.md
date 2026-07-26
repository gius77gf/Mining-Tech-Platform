# Checkpoint — 2026-07-22T17:30:00Z

## Tipo
unit-complete (Genesi — passo 2: caricamento mesh + ritaglio del fronte)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — mesh + ritaglio fronte)

## Completato
Via libera esplicito del fondatore ("puoi procedere"). Passo 2 del flusso
drone→nuvola/mesh→volata: esteso `apps/genesi/nuvola-poc.html` (POC autonomo,
non tocca genesi.html) da solo-nuvola a **3D → fronte**.
- **Caricamento MESH** oltre alla nuvola: OBJ (OBJLoader) e GLB/GLTF (GLTFLoader),
  entrambi vendorizzati. ODM esporta la mesh proprio in OBJ → coperto. La mesh è
  centrata, resa come superficie (MeshStandard + luce direzionale → si legge la forma).
- **Ritaglio del fronte**: 6 cursori (larghezza/altezza/profondità, min+max) che
  pilotano 6 piani di clipping Three.js (`localClippingEnabled`) → isolano la
  faccia della cava dal rilievo intero; box wireframe che mostra la selezione;
  dimensioni del ritaglio in tempo reale.
- **Export ritaglio** (.xyz): esporta i punti/vertici DENTRO il box in coordinate
  reali (ri-aggiunge il baricentro tolto per il rendering) → il fronte isolato è
  salvabile per il passo successivo (aggancio alla simulazione volata).

Verifica: syntax OK; Playwright — nuvola XYZ (regressione ok), mesh OBJ caricata
come "superficie", i cursori cambiano le dimensioni del ritaglio, export senza
errori, nessun errore di pagina; screenshot: mesh resa + box di ritaglio visibile
che taglia la superficie.

## Prossimo passo atomico
Passo 3: agganciare il fronte ritagliato al MOTORE volata di Genesi (genesi.html)
— dal profilo del ritaglio ricavare il fronte (cresta/piede) che il Progetto 2D/
simulazione già usano. Da fare con cautela (tocca genesi.html) e idealmente dopo
che il fondatore prova il POC con la sua nuvola/mesh reale (weekend). Poi ponte
Terra→Genesi.

## Blocchi
Il passo 3 (aggancio al motore) idealmente aspetta il test del fondatore col dato
reale. LAZ compresso: rimandato (laz-perf). #321 unico branch.
