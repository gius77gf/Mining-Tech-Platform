# Checkpoint — il reclamo, la coincidenza che non è una causa, e il censimento

- **Tipo**: unità (11 prove sui reclami e sul ponte) + un censimento che decide
  dove andare dopo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `f420dbc`

## L'unità

`riepilogoReclami`, `etichettaReclamo`, `bozzaAzioneReclamo`,
`coincidenzaVolata`, `ESITI`. Il reclamo di un residente è l'**altro** ingresso
del ponte verso Scudo: non finisce quando è stato registrato.

**La regola più delicata non è un calcolo, è una frase.** Un superamento nello
stesso giorno di una volata va **guardato**, non **spiegato**: due fatti nello
stesso giorno sono due fatti nello stesso giorno. Scrivere «causato dalla
volata» dentro un documento che finisce all'ente è un autogol — e spesso è anche
falso: per collegarli servono la misura strumentale dell'evento, l'ora e una
valutazione tecnica. Le prove bloccano il testo (niente «causa»), l'avviso che
lo dichiara, e il fatto che senza volate quel giorno **non si scrive niente**:
un riquadro vuoto accanto a un superamento suggerirebbe un legame che nessuno ha
misurato.

**L'altra che vale il lavoro: «senza dati» non è «conforme».** È la differenza
fra «abbiamo misurato e va bene» e «non abbiamo misurato», e su un documento per
l'ente confonderle è il difetto peggiore. Resta giallo, e il testo dichiara che
il report **non può dire** se il limite è stato rispettato.

Più: un reclamo senza stato è **aperto**, non chiuso (chi non ha ancora deciso
non ha chiuso niente); una data impossibile non diventa «l'ultimo reclamo»; la
nota che arriva in Scudo porta **chi** ha segnalato e **le sue parole** fra
virgolette, perché Scudo non può leggere le collezioni di Sentinella.

Controprova: **7 difetti rimessi, 7 visti, 0 non visti.**

## Il censimento della copertura, app per app

Misurato sui moduli dati (funzioni esportate **nominate** da almeno una prova):

```
Sentinella   77/107   (era 37/107 a inizio giornata)
conti        35/58
flotta       29/71
campo        26/73
terra        23/39
scudo        22/71   ← la meno coperta
```

Delle 30 che restano scoperte in Sentinella, quasi tutte sono **costanti** e il
trasporto dati (`sentinellaData`, `ponteDemo*`): la parte che decide numeri è
coperta.

## Prossimo passo atomico

**Scudo**, che è la meno coperta e insieme quella con la posta più alta: è
l'app della sicurezza sul lavoro. Restano scoperte, fra le altre,
`statoAzione`, `azioniUrgenti`, `riepilogoAzioni`, `azioniDiEvento`,
`azioniDiIspezione`, `TIPI_DOCUMENTO` — cioè **il registro delle azioni
correttive**, che è il posto dove arrivano i due ponti di Sentinella su cui ho
appena lavorato. Si comincia da lì: chiudere il giro dal fatto ambientale
all'azione, dall'altra parte del ponte.

## Stato

- **657** KPI (433 all'inizio della giornata) → **940** prove `node`, verdi in
  UTC **e** in ora italiana
- **224 prove nuove** in giornata, **6 difetti di prodotto** corretti

## Bloccanti

- Nessuno.
