# Checkpoint — 2026-09-10T22:40:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6fbe22e7

## Completato
Unità 55 — i listini per cliente in Conti, nominati e assegnabili: la mancanza
«a metà» della riga «Listini differenziati per cliente» di CONCORRENTI_CONTI.
Modulo (`listinoDelCliente`, `prodottoPerCliente`, `validaListino`,
`descriviListino`, `csvListini`), pagina (sezione «Listini per cliente»,
tendina nella scheda cliente, la pesata che dice «Prezzo del listino «X»» col
base accanto), dimostrazione («Cantieri stradali» su Stradesud), banco
`conti-listini.mjs` (38 ok, controprova 20/38 su 3/3 per file), run-kpi 2815,
copertura 939/939, docs e pin aggiornati.

## Imparato
- La prima stesura di `csvListini` scriveva i prezzi con la virgola e l'unità
  «m3»; il file gemello `csvListino` scrive il punto e «mc». Due convenzioni
  nella stessa app: presa dal banco che legge il testo del file, non dalla
  prova del modulo (che confermava la virgola perché l'avevo scritta io).
- Il gancio `textContent` di `.k`+`.v` non ha spazio in mezzo («Netto20,00 t»):
  le regex sul riepilogo vanno scritte con `\s*`, se no accusano la pagina.

## Prossimo passo atomico
Leggere il registro del giro filtrato del browser (`scratchpad/giri/
giro-browser-20260910-2157.log`, con `leggi-giro.mjs`) quando finisce:
sezione 0, «non ho guardato», KO veri. Poi la seconda delle tre cose indietro
rispetto ai concorrenti che il codice può colmare (docs/CONCORRENTI_CONTI.md,
«Le otto mancanze confermate»): la prossima riga senza risposta, con la
domanda «chi decide oggi quel numero?» aperta sul modulo prima di scrivere.

## Blocchi
Nessuno.
