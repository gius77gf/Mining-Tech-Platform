# Checkpoint — 2026-07-22T22:15:00Z

## Tipo
unit-complete (POC nuvola — precisione anche per la MESH georeferenziata)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — precisione mesh UTM)

## Completato
Completata la correzione precisione (revisione serale): lo stesso problema UTM
colpiva la MESH (OBJLoader mette i vertici in Float32 prima che io centri).
- `apps/genesi/nuvola-poc.html`: `preShiftOBJ(txt)` pre-trasla i vertici dell'OBJ
  in doppia precisione (primo vertice come origine) PRIMA di darlo a OBJLoader;
  `placeMesh` accetta l'offset e lo somma al baricentro per riesportare in
  coordinate reali. Solo le righe "v " sono traslate (vn/vt intatte).

Verifica: syntax OK; Playwright con OBJ a coord UTM (~500k/5M) e dettaglio z 5 cm
→ "mesh (superficie)", dimensioni 5.6 × 0.1 × 5.6 (il dettaglio 0,1 m è PRESERVATO,
prima cancellato), nessun errore. Point-cloud e mesh ora coerenti e precise sui
dati georeferenziati reali.

## Prossimo passo atomico
Revisione serale conclusa: 3 fix reali sul POC (downsample XYZ, precisione UTM
nuvola, precisione UTM mesh) → robusto per il test del fondatore col dato ODM reale.
Proseguo coi fallback. Passo 3 drone gated sul test weekend.

## Blocchi
Passo 3 drone: gated sul fondatore. #321 estetica: gated. #321 unico branch.
