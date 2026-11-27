# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
48a69f3a

## Completato
Unità 116 — Sentinella e Campo: l'ora dello sparo e l'attesa prima del
rientro. `attesaDopoSparo` in `shared/dw-ponti.js`, quattro campi sulla
volata (sparo, chi ha autorizzato, attesa dichiarata, esplosivo reso) nel
form, nel CSV, nel foglio, nel registro e nell'azione per Scudo; la consegna
di Campo li scrive. run-kpi 2911 → 2912, copertura 993/993, screenshot a
430 px guardati (registro e dopo-volata di Sentinella).

## Imparato
- Aggiungere quattro colonne a un CSV fa cadere otto prove pinnate: sono
  tutte prove giuste (la tabella dei campi, la coda del file, l'oggetto
  letto, le liste «che cosa manca»), e si correggono rendendole più
  esigenti, non più larghe — la fixture «con tutto collegato» ora porta
  anche il dopo-sparo.
- Un verdetto in coda a una riga tagliata a due righe è testo morto: il
  rientro prima dell'attesa va per primo e corto (visto nello scatto, non
  nelle prove).
- La consegna di Campo in dimostrazione non mostra volate («nessuna è di
  oggi», per scelta): la riga si prova in run-kpi con la data di b2, non
  nel browser.

## Prossimo passo atomico
Leggere il giro del browser lanciato su `755ef985` (`$S/giri/ultimo-log.txt`,
con `leggi-giro.mjs`) quando `ultimo-exit.txt` compare: chiudere i KO veri,
rilanciare sul nuovo HEAD. Poi ricerca a rotazione, quarto giro: Conti
(candidata: la fattura elettronica e lo SdI — che cosa serve a una cava per
emettere, che cosa torna indietro; delta dal meccanismo su `fatture`,
`csvFatture`, gli stati di incasso) e Genesi (candidata: il diario di
perforazione — che cosa registra la perforatrice, i file che escono, che
cosa entra nel piano di carico).

## Blocchi
Nessuno.
