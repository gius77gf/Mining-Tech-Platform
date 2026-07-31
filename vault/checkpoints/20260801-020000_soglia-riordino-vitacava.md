# Checkpoint — la soglia, il riordino e la vita della cava

- **Tipo**: unità (13 prove nuove su tre funzioni mai provate)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `cf63b4e` (soglia), `eb55e09` (riordino + vita cava)

## Perché queste tre

Seguendo la **priorità di danno** stabilita nel checkpoint precedente: dopo i
soldi vengono i numeri che vanno all'ente e quelli su cui si decide una spesa.

- **`sogliaEfficace`** decide **contro quale numero** si confronta una lettura,
  cioè se quella lettura diventa un superamento nel report che il cliente
  consegna all'ente.
- **`puntoDiRiordino`** decide quanti pezzi tenere a magazzino prima che il
  fornitore consegni.
- **`vitaCava`** dice quanto materiale resta nella concessione.

Nessuna delle tre era nominata in nessuna prova.

## Il caso che vale il lavoro

`sogliaEfficace` con **unità diverse**: se il punto misura in dB(A) e il
ricettore ha una soglia in mm/s, la funzione **non** usa il numero del
ricettore — tornerebbe un verdetto inventato su un documento che va all'ente —
ma torna alla soglia del punto e alza `conflitto`, così l'interfaccia lo può
dire. Rimettendo il difetto (ignorare il conflitto) la prova fallisce con
«atteso 55, ottenuto 3»: cioè avrebbe confrontato una lettura in decibel contro
un limite in millimetri al secondo.

Gli altri due difetti rimessi, e presi:
- il riordino arrotondato **in giù** → soglia 5 invece di 6, cioè restare a
  secco il giorno in cui il mezzo è fermo;
- il residuo di concessione **senza il pavimento a zero** → «−4.000 m³» su un
  documento, che è peggio di un errore.

## Dove ho sbagliato io, e come l'ho saputo

Le tre prove su `vitaCava` sono nate **rosse**, e non per un difetto del
codice: avevo indovinato il nome del campo (`percentuale` invece di `pct`) e
soprattutto la forma dei dati — `estrattoComplessivo` conta **solo** i rilievi
con `stato: "elaborato"`, ed è giusto così: un rilievo ancora da elaborare non
è materiale uscito dalla cava.

È esattamente l'avvertenza di `CLAUDE.md`: quando una prova nuova fallisce, si
legge **come il codice si aspetta i dati** prima di dire che c'è un difetto. Una
prova sbagliata che accusa il codice fa perdere più tempo di nessuna prova. La
ragione è finita in un commento accanto ai dati di prova.

## Stato

- **460** KPI (erano 433 stamattina), 177 stile, 43 helper, 23 pointcloud, 9
  manifest, 7 demo → **719** prove `node`, tutte verdi
- giro a 19 banchi: in corso

## Prossimo passo atomico

Continuare per priorità di danno sulle funzioni ancora scoperte. Le prossime
tre, con la stessa logica «se sbaglia, chi se ne accorge e quando»:
`reportConformita` di Sentinella (è il documento vero che va all'ente),
`autorizzazioneVigente` di Terra (se sbaglia si cava con un titolo scaduto) e
`consumoPerMezzo` di Flotta. Ogni prova va vista fallire col difetto rimesso.

## Bloccanti

- Nessuno.
