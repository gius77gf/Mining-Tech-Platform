# Checkpoint — un controllo firmato non si riscrive

- **Tipo**: unità (10 prove sulle ispezioni periodiche di Scudo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `4e1803a`

## L'unità

`nuovaIspezioneDaModello`, `riepilogoIspezione`, `vociNonConformi`,
`statoIspezione`, `riepilogoIspezioni`, `esitoLabel`. Le ispezioni periodiche
sono il **terzo ingresso** del registro delle azioni correttive, dopo gli eventi
e i due ponti ambientali: da una voce **non conforme** nasce un'azione. Con
questa unità il giro è chiuso da tutti e tre i lati.

## La regola che vale il lavoro, e non è un conteggio

Riguarda il **tempo**: le voci del modello vengono **copiate dentro**
l'ispezione. Un modello che cambia domani non deve riscrivere le ispezioni già
fatte — **un controllo firmato non si modifica a posteriori**, e un'ispezione
che cambiasse forma dopo la firma non varrebbe niente davanti a nessuno.

La controprova lo dice meglio di qualunque spiegazione: collegando le voci
invece di copiarle, *«un modello che cambia domani riscrive un controllo già
firmato»*.

## Le altre

- **Quello che manca si conta come «da fare»**, non si dà per conforme:
  altrimenti un controllo mai finito risulta tutto a posto.
- **«Non applicabile» è una risposta data**, e chiude il controllo.
- **La nota della voce non conforme viaggia con lei**: è quella che diventa la
  descrizione dell'azione correttiva, e perderla lascerebbe un compito senza il
  fatto che l'ha generato.
- **Un'ispezione completata non è più in ritardo** (stesso principio delle
  azioni chiuse).
- **Le non conformità si contano anche nelle ispezioni CHIUSE**: un rilievo
  trovato resta un fatto, e chiudere il controllo non lo cancella.

Controprova: **7 difetti rimessi, 7 visti, 0 non visti.**

## Stato

- **708** KPI (433 all'inizio della giornata) → **991** prove `node`, verdi in
  UTC **e** in ora italiana
- **275 prove nuove** in giornata, **7 difetti di prodotto** trovati e corretti
- Scudo: da **22/71** a **58/71** funzioni coperte

## Prossimo passo atomico

Chiudere Scudo con i **near-miss** (`categoriaNearMiss`, `luogoNearMiss`,
`descrizioneNearMiss`, `riepilogoNearMiss`) e `muroScadenze` /
`dataDaPeriodicita`. Il near-miss è la segnalazione che si fa **in piedi sul
piazzale, con i guanti**: se costa più di pochi secondi non la fa nessuno, e le
funzioni che compongono la descrizione da due tocchi sono quello che la rende
possibile.

Dopo Scudo, il censimento dice che le meno coperte restano **campo** (26/73) e
**flotta** (29/71).

## Bloccanti

- Nessuno.
