# Checkpoint — 2026-09-02T20:59:28Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
63e4de93 — Conti: il verbale anche per «Prodotto contro venduto»

## Completato
- `renderVerbale` generalizzata per tipo (cavato in m³ / prodotto in t),
  verso a parole per ciascuno, verbale del prodotto in ogni esito del terzo
  lato; storici separati per tipo (il banco lo pretende).
- `conti-verbale.mjs` 20/20, controprova cade su tutt'e due i lati; giro node
  37/37 al primo colpo (i conti erano già giusti).

## Prossimo passo atomico
(1) La **seconda passata in profondità su Conti**: il Report ha guadagnato
oggi tre riquadri (prodotto contro venduto, due verbali) — aprire ogni
schermata a 430 e 320 px nei tre temi, premere ogni export (CSV, XML SdI,
PDF/DDT) e aprire i file, cercare i numeri tranquilli; in particolare: il
verbale con un periodo senza confronto, il verbale scritto e poi il periodo
cambiato, «Scrivi un altro verbale» con più verbali per lo stesso periodo
(si mostra l'ultimo), il contrasto delle note warn nel tema chiaro.
(2) Il candidato 2 della ricerca (densità in banco per litotipo nel listino,
per convertire il cavato di Terra in tonnellate): progettare in scratchpad
— dove vive (listino per prodotto o impostazioni per litotipo?), chi la
usa (`riconciliazione`: oggi converte il venduto in m³; con la densità in
banco si potrebbe convertire il cavato in t e chiudere il triangolo
prodotto/cavato/venduto in un'unità sola), che cosa dice la nota che oggi
avverte dello scarto sistematico.
(3) Ricerca a rotazione: la prossima app è Flotta o Scudo (Conti l'ha avuta
oggi).

## Blocchi
Nessuno.
