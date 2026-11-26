# Checkpoint — 2026-11-26T14:56:10Z

## Tipo
unit-complete (calcolo + copertura con controprova)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3f9ffbe4 (chore(vault): F1 confermata dal giro (4330), routine riarmata, consegna di F2 al ciclo automatico)

## Cosa è stato completato — F2, primo pezzo: la MIC
- `micFinestra(holes, kg)` (genesi-data.js): per ogni finestra di 8 ms,
  `fori × carica del progetto + Σ(carica propria − carica del progetto)`
  sui soli fori che hanno un `kg` loro; il massimo fra le finestre. La
  firma NON è cambiata: i tre chiamanti (`computeMIC`, `micDaMostrare`
  nella pagina; la curva burden/carica nel modulo, che usa maglie di prova
  senza valori propri) restano com'erano.
- **Neutralità**, provata in scratchpad prima e blindata in `run-kpi.mjs`:
  senza cariche proprie il risultato è `n × kg` alla cifra (`Object.is`,
  4000 volate a caso → 0 differenze; nel test 20 combinazioni con cariche
  dai decimali scomodi).
- Con cariche proprie: un foro isolato da 200 kg batte due fori da 58 (si
  confrontano i chili delle finestre, non i conteggi); un foro scarico non
  conta; tutti scarichi → 0 (numero vero, non null); senza la carica del
  progetto la MIC resta non calcolabile anche se un foro ha la sua.
- Ponte di debug: `window.__genesi.mic` (sola lettura, passa da
  `micDaMostrare`: la prova «i sette lettori…» conta le chiamate dirette a
  `computeMIC()` e una in più la fa cadere — misurato).
- Banco `browser/genesi-foro-per-foro.mjs`: 12 → 15 asserzioni; le
  iniezioni ora dichiarano il FILE (pagina / modulo) e il server le applica
  per file; controprova: 3 KO (le due del piano di carico + la MIC).
- `run-kpi.mjs`: 3235 → 3236.

## Numeri propagati
3.733 → **3.734** prove senza rete; giro `node` 4330 → **4331** (scritto
per somma: +1 prova, nessun file nuovo; il giro dopo questo file dice il
numero vero).

## Prossimi passi
- **Prossimo passo atomico — F2, secondo pezzo: `caricaTotale`.** Oggi
  `caricaTotale(nf, kg)` = nf × kg, con `nf` che i chiamanti prendono da
  posti diversi (pagina: `measureGeom2D(D2).n` alla riga di `syncKgTot`, e
  `nf` alla riga di `_kgTotSent`; modulo: `o.nf` in ~1682). ⚠️ PRIMA di
  scrivere: capire se `nf` è «fori disegnati» o «fori di progetto» in
  ciascun chiamante (il commento di `metriPerforati` dice che lo decide il
  chiamante) — lo scarto delle cariche proprie ha senso solo quando si
  parla dei fori DISEGNATI. Forma prevista: terzo argomento facoltativo
  `holes`, risultato `nf × kg + Σ(proprio − kg)`, identico alla cifra senza
  valori propri. Poi il consumo specifico (`consumoSpecifico(kg, vol)`
  per foro e di volata) e il costo. Ogni passo con la sua prova di
  neutralità.
- Poi F3: il comando per l'utente sulla selezione multipla.

## Blocchi
Nessuno.
