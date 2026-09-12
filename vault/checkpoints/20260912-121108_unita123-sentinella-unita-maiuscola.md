# Checkpoint — 2026-09-12T12:11:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3b2c8ee1

## Cosa è stato completato (unità 123)

Chiusi i 2 KO veri trovati dal giro del browser lanciato sul commit
`a820c6d2` (unità 118), letto con `leggi-giro.mjs` a fine unità 122:
Sentinella, modale «Dopo-volata: l'ispezione dopo…», l'etichetta
`Esplosivo reso (kg)` non incapsulava l'unità in `<span class="u">`,
quindi la regola condivisa `.fl{text-transform:uppercase}` la disegnava
come «ESPLOSIVO RESO (KG)» — un'unità di misura in maiuscolo, la
violazione che la regola 1 di `run-stile.mjs` esiste per impedire (ma
quella regola guarda il sorgente delle app che usano il vocabolario
dichiarato; questo era un caso non ancora coperto, trovato solo dal
banco del browser che apre davvero le modali).
Corretto con lo stesso pattern già usato tre volte nello stesso file
(`PPV misurata`, `Carica totale`, `Carica massima per ritardo`):
`Esplosivo reso (<span class="u">kg</span>)`.

Verificato: `run-stile.mjs` (328/328) e `sintassi-pagine.mjs` (34/34)
verdi; confermata l'esistenza della regola CSS `.fl .u{text-transform:
none}` che rende il fix strutturalmente corretto. `giro-node.mjs` su
worktree pulita: **40 comandi a posto, 0 caduti, exit 0**.

## Stato roadmap

Nessuna voce di roadmap dedicata (era un KO segnalato dal giro del
browser, non una voce pianificata). Nessuna modifica a
`vault/ROADMAP_SETTIMANA.md` necessaria.

## Blocchi
Nessuno.

## Prossimo passo atomico

Questo chiude la lettura del giro del browser sul commit `a820c6d2`
(entrambi i KO veri risolti). Le unità 121-123 toccano `apps/genesi/*` e
`apps/sentinella/index.html`: un giro del browser mirato
(`--solo=pagine-vive,csv-dimostrazione,disegni,contrasto` su Genesi,
`--solo=modali-dentro,unita-maiuscole` su Sentinella) confermerebbe che
non sono stati introdotti nuovi difetti visivi, ma non è strettamente
necessario prima di proseguire — il trasloco di Genesi non ha cambiato
comportamento (verificato via `run-kpi.mjs` e l'iniezione di
controprova) e la correzione di Sentinella è un cambiamento HTML isolato
e già verificato staticamente. Se il tempo lo permette, lanciarlo
comunque per completezza prima del prossimo cantiere sostanzioso.
Continuare con la prossima unità piccola dalla roadmap (B12, B4,
B0-bis, B0, C2, E-serie, Q1, o altre funzioni della fascia 3-5/6-10 di
Genesi ora elencabili con `genesi-estraibili.mjs --elenco`). Mai
fermarsi: se la roadmap sembra esaurita, si prosegue con seconde
iterazioni, ricerca a rotazione o revisione qualità.
