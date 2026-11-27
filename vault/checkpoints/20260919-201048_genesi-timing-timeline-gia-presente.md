# Checkpoint — 2026-09-19T20:10:48Z

## Tipo
unit-complete (correzione documento, nessun codice)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2cfa9272 (feat(genesi): G59, statistica di QC sulla deviazione di perforazione)

## Cosa è stato completato
Chiudendo G59, l'ultima riga rimasta in `docs/RICERCA_CONTINUA_GENESI.md`
sotto "proposto da ricerca, non verificato" era: «Visualizzazione di
timing timeline (sequenza ritardi su una linea del tempo, non contour
plot 3D) — utilità media». La stessa ricerca del 19/09 aveva già trovato
false 3 delle sue 6 mancanze iniziali (Rosin-Rammler, Swebrec, isocrone),
sempre per la stessa causa: cercava il NOME del mondo invece del
MECCANISMO in casa. Applicata la stessa domanda qui.

- [x] **Verificato di persona, cercando il meccanismo**: `buildTicks()`
  (genesi.html, sezione "UI: timeline") disegna un `.tick` per ogni foro
  dentro `#ticks`, sovrapposto alla barra di scorrimento `#track` della
  simulazione 3D, posizionato per `f.tDet/SIM.tEnd*100%` — è
  letteralmente una linea del tempo con la sequenza dei ritardi (non uno
  spatial contour plot come le isocrone, che sono un'altra cosa già
  trovata presente). Il tooltip di ogni tacca mostra «foro N · X ms» col
  tempo di progetto (G16, non lo scatter sorteggiato).
- [x] **Nessun codice scritto**: la mancanza era falsa, non c'era niente
  da costruire. Costruire una seconda "timing timeline" avrebbe duplicato
  una funzione che esiste già — esattamente il rischio che questo file
  chiama "spaccare in due una funzione progettata unita".
- [x] Chiusa la riga in `docs/RICERCA_CONTINUA_GENESI.md` (append) con la
  verifica e il riferimento al codice, così nessun cantiere futuro la
  riapra sulla parola della ricerca originale.
- [x] `numeri-nei-documenti.mjs`: 43/0, invariato (nessun numero
  sorvegliato in questo file). `documenti-invecchiati.mjs`: 15/0.

## Stato roadmap
La sezione "proposto da ricerca, non verificato" di
`docs/RICERCA_CONTINUA_GENESI.md` è ora VUOTA: entrambe le sue righe sono
state chiuse (G59 fatto per davvero, timing timeline già presente). La
ricerca del 19/09 su Genesi/JKSimBlast è quindi esaurita: delle sei
mancanze iniziali, quattro erano false o parziali (corrette nello stesso
documento prima di oggi), una vera e ora colmata (G59), una vera e già
chiusa qui.

## Prossimi passi
- **Prossimo passo atomico**: leggere il registro completo di `tutti.mjs
  --solo=genesi` (lanciato con l'output intero su file, non `| tail -20`)
  appena finisce — task in corso, avviato alle 20:08Z — e distinguere i
  KO veri dalle controprove volute fra i "21 da guardare" del batch
  precedente.
- Restano da confermare/valutare le due mancanze "vere ma non
  riverificate con lo stesso rigore" della stessa ricerca (Blastatistics:
  statistica sulla deviazione — **appena fatta con G59**; 2DRing
  underground — architetturalmente fuori scope, coerente con Genesi
  surface-bench, non un lavoro da fare).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
