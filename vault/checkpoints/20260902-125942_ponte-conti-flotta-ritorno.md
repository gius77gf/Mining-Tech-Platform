# Checkpoint — 2026-09-02T12:59:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d351c41a — «Il ponte torna indietro: Flotta chiede a Conti «questa spesa ce l'hai anche tu?»»

## Completato
- Il verso Conti→Flotta del primo ponte (cantiere parallelo morto sul limite di
  sessione a lavoro finito; misurato prima di crederci: run-kpi 2419/0,
  run-stile 328/0, banco 20+9 con controprova che cade in 3, scatto guardato).
  Mappa: **8** ponti su 56; le app che nessuno legge scendono a 3.
- Raccogliendo: iniezione di `flotta-numeri-tranquilli` invecchiata (trovata da
  `iniezioni-fresche`) e la coda delle note del ponte tagliata dal `.meta` in
  tutt'e due le app → `.ponte-coda`.
- Giro node sulla COPIA di ciò che si committava: 37/0.

## In corso sul disco (non committato): unità B della fattura elettronica
Fatta e verde in locale (sintassi 34/34, run-kpi 2421/0, helper 75/0): campi
CAP/comune/provincia/CF nei form cliente e Impostazioni, regime fiscale e
modalità di pagamento a tendina (nessun valore deciso dal programma), CSV
clienti con le quattro colonne in coda (file vecchio rientra), tabella delle
intestazioni in `dw-shell.js` aggiornata, dimostrazione «pronta» (prova: dal
DDT di Edilcave al file XML, `pronto: true`). Mancano: lo scatto dei due form
guardato, il giro node, i numeri nei documenti, il commit.

## Prossimo passo atomico
1. Scatto dei form Clienti e Impostazioni a 430 px (senza le variabili del
   proxy), guardarlo; giro node; numeri nei documenti; commit dell'unità B.
2. Unità C: in `apps/conti/index.html`, sulla scheda della fattura (dove sta la
   stampa di cortesia), il bottone «Scarica XML per lo SdI»: chiama
   `xmlFatturaPA(f, cliente, IMP, {pesate: PES, progressivo})`; se
   `pronto: false` NON scarica e mostra i `mancanti` con il posto dove
   scriverli; se pronto scarica `IT<piva>_<progressivo>.xml` e mostra gli
   `avvisi`; la riga fissa di onestà (Conti prepara; invio e conservazione
   gratis dal portale dell'Agenzia o col commercialista). Togliere l'eccezione
   in `funzioni-mai-usate.mjs`. Banco: punto d'uscita 13 in
   `conti-documenti-che-escono` (aprire il file, contare DettaglioLinee e
   confrontarli con lo schermo). Poi il punto 5 della roadmap fatturazione → ✅.

## Blocchi
Nessuno. PR #345 verde, aperta (unire è del fondatore).
