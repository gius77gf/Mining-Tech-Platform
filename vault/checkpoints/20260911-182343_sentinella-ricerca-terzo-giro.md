# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7256c274

## Completato
Unità 113 — ricerca a rotazione, terzo giro, Sentinella: «la catena di
misura — taratura in laboratorio, calibrazione in campo, e quando una misura
non vale». Metà sul mondo di seconda mano; delta dal meccanismo: scadenza
della taratura, certificato nel report e copertura per lettura CI SONO; la
calibrazione in campo delle misure di rumore MANCA → voce aperta; la
proposta «periodicità per tipo» scartata con la ragione. Solo documenti.

## Imparato
- «Taratura» e «calibrazione» sono due cose: la prima ha una scadenza e un
  certificato, la seconda decide se la misura appena fatta vale. Il prodotto
  aveva la prima e non la seconda, e il grep sulla parola non lo diceva
  perché «calibrata» compariva quattro volte su un'altra cosa (la legge di
  sito).
- Una proposta di periodicità per tipo di strumento è un numero di seconda
  mano dentro un campo: si scarta e si scrive perché.

## Prossimo passo atomico
Unità 114, Sentinella: sulla lettura di rumore `calibrazione: { prima, dopo }`
(dB, facoltativi, nel form della lettura solo quando il punto è di tipo
rumore); sul punto `scartoCalibrazioneDb` dichiarato dall'utente (campo nel
form del punto, suggerimento senza numeri); nel modulo `scartoCalibrazione(l)`
→ { noto, scartoDb } e `validitaCalibrazione(l, punto)` → { stato: valida |
non-valida | non-registrata | soglia-non-dichiarata, scartoDb, perche };
ragione di annullamento `calibrazione` in `RAGIONI_ANNULLAMENTO`; la riga
della lettura nella scheda del punto e il report contano le letture di rumore
senza calibrazione registrata; prove in run-kpi (prima in scratchpad),
screenshot a 430 px. Poi leggere il giro del browser su `2766bf9b` quando
`ultimo-exit.txt` compare.

## Blocchi
Nessuno.
