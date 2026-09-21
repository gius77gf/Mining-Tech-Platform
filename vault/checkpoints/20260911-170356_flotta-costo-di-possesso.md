# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
caf157c3

## Completato
Unità 108 — Flotta: il costo di possesso nel costo orario e la fine del
leasing. `costoPossessoAnnuo` + `possessoDal` sul mezzo (form, salvataggio,
modifica), `costoOrarioMezzo(interventi, rifornimenti, mezzi)` con
`euroOraPossesso` sulle ore all'anno misurate, `perchePossesso` e
`euroOraCompleto` solo quando ci sono tutt'e due gli addendi; riga
«possesso» nel libretto; preset `fine-leasing`; E1 in leasing nella
dimostrazione. run-kpi 2907 → 2908, screenshot a 430 px guardati.

## Imparato
- `csvLibretto` scrive `\r\n`: un test che spezza su `\n` tiene il `\r` in
  coda e una regex con `$` non combacia mai — la riga stampata sembra
  identica. Si spezza come fanno gli altri test dello stesso documento.
- `giorniTra(da, a)` è `da − a`: con la finestra scritta nell'ordine
  naturale viene negativo. Le righe di `costoOrarioMezzo` portano il nome
  BREVE del mezzo, l'anagrafica quello intero: si confronta la parte prima
  di « — ».
- Un secondo campo data senza etichetta si spiega nel suggerimento del form,
  non nel `title` (su un telefono non c'è il passaggio del mouse).

## Prossimo passo atomico
Leggere il giro del browser su `2766bf9b` (`$S/giri/ultimo-log.txt`, con
`leggi-giro.mjs`) quando `ultimo-exit.txt` compare: chiudere i KO veri, poi
rilanciare il giro sul nuovo HEAD. Nel frattempo la prossima unità di
prodotto o ricerca a rotazione (terzo giro: Scudo, Terra, Sentinella, Campo
non ancora fatti al terzo giro).

## Blocchi
Nessuno.
