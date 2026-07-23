# Checkpoint — 2026-07-23T14:00:00Z

## Tipo
unit-complete (drone POC — conteggio punti nel ritaglio)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/genesi/nuvola-poc.html)

## Completato
Miglioramento non-speculativo del visore drone in vista della prova del weekend: il
riquadro del ritaglio ora mostra anche **quanti punti** cadono dentro il box, oltre
alle dimensioni. Così il fondatore, mentre stringe i cursori sulla faccia della
cava, vede subito se il ritaglio ha catturato il fronte (non vuoto, abbastanza denso)
PRIMA di esportare il .xyz. Conteggio solo per le nuvole (isPoints), iterando le
posizioni già in memoria; riusa `insideCrop`. Nessuna ipotesi sulla forma (non è il
passo 3): conta soltanto i punti esistenti.

## Verifica
Syntax OK. Smoke browser (LAS 500 punti): box pieno → "500 punti"; larghezza a metà
→ "260 punti" (coerente); zero errori console.

## Prossimo passo atomico
Never-stop: rotazione fallback. Passo 3 (aggancio fronte→volata) resta gated sul dato
reale del weekend; il visore è ora completo per la prova (legge LAS/PLY/XYZ/OBJ/GLB,
ritaglia, conta i punti, esporta). Prossimo: altra iterazione UX o test/ricerca.

## Blocchi
Passo 3 drone: gated sul dato reale. #321 estetica: gated.
