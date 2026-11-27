# Checkpoint — 2026-09-02T10:10:39Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a7ba0d19 — «Conti: il file XML della fattura elettronica, preparato nel modulo e mai promesso oltre»

## Completato
- Seconda domanda della pesa chiusa senza difetto: una pesata fatturata non si
  modifica (solo stampa; la cancellazione sparisce con `fatturaId`) e la fattura
  differita conserva le sue `righe`: nessun documento fiscale si riscrive da solo.
- **Unità A della fattura elettronica**: `xmlFatturaPA` in `conti-data.js`
  (FPR12, `{xml, mancanti, avvisi, pronto}`), 3 blocchi di prove (43
  asserzioni), controprova a mano sulla guardia `quadra`, eccezione dichiarata
  con scadenza in `funzioni-mai-usate` (da togliere all'unità C). Copertura
  Conti 142/142; documenti a 2.890 prove, 3.296 asserzioni, 762/762.
- Verifica sulla COPIA di ciò che si committava (worktree + diff cached), perché
  il cantiere Flotta ha tre funzioni ancora senza prova sul disco vivo.

## Cantieri aperti (non miei, non committati)
- Flotta: il verso Conti→Flotta del ponte (agente ancora al lavoro).
- Genesi: `docs/GENESI_FUORI_DAL_BROWSER.md` consegnato (438 righe): 9 chiavi,
  non 4; quattro ponti di file, non uno; l'offline è il vincolo vero (decisione
  5b del fondatore); piano in 8 unità ≈ 20 ore. Da leggere e committare come
  unità a sé, aggiornando la mappa §4 (che contava quattro chiavi).

## Prossimo passo atomico
**Unità B della fattura elettronica — i campi che mancano.** In
`apps/conti/index.html`: form Impostazioni (`az-cap`, `az-comune`, `az-prov`,
`az-regime` a tendina con i codici RFxx più comuni e «chiedi al commercialista»,
`az-cf`, `az-pagamento` a tendina MPxx) salvati in `impostazioni` con le chiavi
lette da `xmlFatturaPA` (`aziendaCap`, `aziendaComune`, `aziendaProvincia`,
`aziendaRegimeFiscale`, `aziendaCodiceFiscale`, `modalitaPagamento`); form
cliente (`cl-cap`, `cl-comune`, `cl-prov`, `cl-cf`) salvati come `cap`,
`comune`, `provincia`, `codiceFiscale`; `CSV_CLIENTI_INTESTAZIONE` e
`clienteDaCella` (colonne in coda, così il file vecchio rientra) con la prova di
andata e ritorno; dimostrazione con i campi compilati per c1 e per l'azienda,
così `xmlFatturaPA` sulla dimostrazione diventa `pronto` (prova in run-kpi da
aggiungere: «la dimostrazione è pronta»). Poi C: il bottone.

## Blocchi
Nessuno. PR #345 verde, aperta.
