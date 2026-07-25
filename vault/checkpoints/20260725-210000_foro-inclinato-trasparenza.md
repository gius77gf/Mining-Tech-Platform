# Checkpoint — 2026-07-25T21:00:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — G4b inclinazione + trasparenza)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
1. **Inclinazione = del FORO, non del fronte**: rimosso lo shear che piegava
   l'intera parete; ora si inclinano solo i fori (raggi-X) e la fisica
   (flyrock/rifling) che già usava l'angolo del foro. Verificato con
   screenshot a 18°: parete verticale.
2. **Trasparenza fronte SEMPRE operativa**: muovere il cursore attiva da solo
   la vista fori (prima senza «Raggi-X» spuntato non faceva nulla).
3. **Fori interattivi**: clic su un foro (o sulla parete vicino a un foro —
   i cilindri sono sottili, c'è la selezione del più vicino) → scheda del
   singolo foro: numero, fila, istante di sparo, profondità, carica,
   borraggio, diametro; foro evidenziato, chiusura con ✕.
Verificato in browser reale: attivazione automatica OK, "Foro 6 · fila 1 ·
spara a 217 ms…" al primo clic, zero errori JS.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
G5 (il punto più criticato): RICERCA sul rendering di fronti di cava reali,
poi rifacimento estetico — blocco da sparare identico al resto del fronte,
via la macchia sul suolo, file posteriori non a blocchi squadrati.
