# Checkpoint — gli indici in pagina, e una classe presa da un'altra app

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

Il campo delle **ore lavorate** e i tre indici sono nella scheda degli infortuni
di Scudo, con la collezione `oreAnno` (un'organizzazione che non le ha mai
scritte legge una lista vuota, come per gli incassi).

Senza le ore la scheda dice **«non calcolabili»** con la ragione, e sotto i
conteggi che non dipendono dalle ore. Con le ore compaiono i tre indici e il
**denominatore in chiaro** — «su 100.000 ore lavorate» — perché un indice senza
il suo denominatore non è verificabile.

## ⚠️ E una classe presa da un'altra app

La prima stesura usava `.mrec`, la riga chiave/valore. In **Scudo quella classe
non esiste**: zero occorrenze (in Conti ce ne sono 7, ed è lì che l'avevo vista).
Le righe uscivano attaccate:

> Indice di frequenza (IF)**10,00**

**Il banco non poteva vederlo**: legge il `textContent`, e il testo conteneva già
le due parti — 8 prove su 8 verdi con la riga rotta. L'ho visto **nello
screenshot**, che è la seconda volta oggi che quella regola paga.

Riscritto nella forma che la scheda usa già due riquadri più su («Infortuni: 1 ·
near-miss: 5»): una riga sola coi valori in accento. *La struttura si copia dal
core; le classi si prendono dalla propria app, non da quella accanto.*

## Prossimo passo atomico

1. **giro completo a 33 esecuzioni** — quello lanciato prima del riavvio del
   contenitore è andato perso, e quella verifica non è stata fatta;
2. dalle schede: il **registro costi esteso** di Conti (porta d'ingresso alla
   marginalità) o l'**analisi causa-radice** di Scudo.
