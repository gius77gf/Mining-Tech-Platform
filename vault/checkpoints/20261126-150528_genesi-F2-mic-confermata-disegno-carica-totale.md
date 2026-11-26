# Checkpoint — 2026-11-26T15:05:28Z

## Tipo
conferma + disegno del passo successivo (nessun codice in questa unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
601bbc58 (feat(genesi): foro per foro, F2 — la carica massima per ritardo somma le cariche vere dei fori)

## Cosa è stato completato
Giro `node` sul commit 601bbc58: **43 comandi su 43, 4331 asserzioni** —
letto dal giro tutto verde, e uguale al numero scritto nei documenti.

## Il disegno del passo successivo (letto nel codice, NON ancora scritto)
`caricaTotale(nf, kg)` = nf × kg ha SEI chiamanti, e `nf` non è la stessa
cosa in tutti (lo dice il commento sopra `costoVolata`: «la griglia di
progetto nel primo, i fori DISEGNATI negli altri due»):
- pagina: `syncKgTot` (`measureGeom2D(D2).n`), `_kgTotSent` (registro per
  Sentinella, `nf`), e quattro `costoVolata({nf, kg:D2.kg, …})` — righe
  ~3498, ~3669, ~4079, ~7747 (quest'ultima con `kg:Q` e `nf:_nf`);
- modulo: `costoVolata` chiama `caricaTotale(o.nf, o.kg)`.
Forma prevista, da provare PRIMA in scratchpad:
1. una funzione sola nel modulo, `scartoCaricheProprie(holes, kg)` → la
   somma di (carica propria − carica del progetto) sui fori che ne hanno
   una; **0** se nessuno ne ha; `null` se la carica del progetto non si
   legge (non si può dire di quanto un foro si scosta da un numero che non
   c'è);
2. `caricaTotale(nf, kg, scarto)` → `nf × kg + scarto`, con `scarto`
   facoltativo: assente o 0 dà ESATTAMENTE il numero di oggi (x + 0 = x);
3. `costoVolata` passa `o.scartoKg` a `caricaTotale`;
4. ⚠️ ogni chiamante va guardato UNO PER UNO: lo scarto dei fori disegnati
   si aggiunge solo dove `nf` SONO i fori disegnati. Dove `nf` è la griglia
   di progetto (fori per fila × file) e i fori disegnati sono un altro
   numero, aggiungere lo scarto mescolerebbe due conti: lì prima si decide
   che cosa mostrare (candidato per docs/DECISIONI_WEEKEND.md se non è
   ovvio), non si somma alla cieca.
Stessa forma poi per la profondità (`metriPerforati(nf, prof, sub)`: i metri
perforati con profondità per foro) e per il consumo specifico.
Prove obbligatorie per ogni pezzo: neutralità alla cifra sulla dimostrazione
(KPI e file che escono identici prima e dopo), e un caso in cui un foro
diverso cambia SOLO ciò che deve.

## Prossimi passi
- **Prossimo passo atomico**: il punto 1 e 2 qui sopra in scratchpad, poi
  nel modulo con le prove; poi i chiamanti uno per uno, a cominciare da
  `syncKgTot` e dal registro per Sentinella (i due dove `nf` va verificato
  che sia il numero dei fori disegnati).

## Blocchi
Nessuno.
