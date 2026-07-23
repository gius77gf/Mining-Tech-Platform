# Checkpoint — 2026-07-23T23:20:00Z

## Tipo
unit-complete (estetica 3D — unità 1: IBL procedurale, prima/dopo per il fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/genesi/genesi.html)

## Contesto
Direttiva estetica del fondatore (23/07): "più professionale, riferimento Paradigm".
Ricognizione: ACES + esposizione + ombre PCFSoft + antialias GIÀ presenti
(overhaul A2-A6); le colonne di carica colorate GIÀ presenti (Raggi-X). Mancavano:
IBL (illuminazione d'ambiente), nord/scala, heatmap quote.

## Completato — unità 1: IBL procedurale
`scene.environment` generato con **PMREMGenerator.fromScene su una mini-scena
cielo/orizzonte/suolo costruita al volo** (solo core Three.js, zero asset esterni,
offline). Prima iterazione a piena intensità → SLAVAVA il fronte (onestà: bocciata
da me al confronto screenshot); seconda iterazione con intensità 0,34 e sole
moderato → il fronte guadagna struttura e variazione tonale senza sbiancare, fps
invariati (25-26). Blocco singolo commentato e REVERSIBILE con una riga.
Screenshot ibl-prima.png / ibl-dopo2.png inviati al fondatore: GIUDICE FINALE è lui
(se preferisce l'originale più scuro, revert immediato).

## Verifica
Syntax OK; smoke browser senza errori di pagina; confronto visivo a 3 scatti
(prima / piena / attenuata) fatto e documentato.

## Prossimo passo atomico
Attendere giudizio fondatore su IBL (tenere/revert/regolare). Nel frattempo unità 2
candidate: freccia nord + barra di scala (HUD, convenzione professionale, zero
rischio). Poi restanti [NV] frammentazione + heatmap quote.

## Blocchi
Giudizio estetico IBL: fondatore. Curva Z (punto 9), prova drone, #321: gated.
