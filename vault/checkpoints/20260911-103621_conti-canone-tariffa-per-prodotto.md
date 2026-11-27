# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8b156292

## Completato
Unità 87 — Conti: la tariffa del canone per prodotto (`canoneAliquota` sul
listino, `canonePeriodo(…, prodotti)` con `tariffa` dichiarata riga per riga,
totale come somma delle righe che non si somma se un prodotto è senza
tariffa). Chiuse tutt'e due le voci aperte dalla ricerca dell'11/09 su Conti.
run-kpi 2887.

## Imparato
- Con tariffe diverse per riga il riquadro che scriveva «aliquota × base»
  contraddiceva il totale (0,55 × 179,30 ≠ 127,00): quando il totale è una
  somma, la riga che lo spiega deve dirlo — un'etichetta più stretta del
  numero che accompagna.
- Una sonda copiata con `head -12` ha perso il `goto`: il selettore «non
  trovato» era la pagina mai aperta, non il bottone. Prima di accusare un
  selettore si guarda che la pagina sia arrivata.

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 09:13Z su `184781db`
(`scratchpad/giri/giro-browser-20260911-0913.log`, `leggi-giro.mjs`) quando
`ultimo-exit.txt` compare, e chiudere i KO veri. Poi la ricerca a rotazione
del secondo giro su Flotta (domanda: «che cosa chiede l'officina e
l'assicurazione di un mezzo di cava» — mondo via WebSearch, delta dal
meccanismo), oppure una delle due mancanze dichiarate di Conti se il
fondatore decide (fondo di ripristino, margine per prodotto).

## Blocchi
Nessuno.
