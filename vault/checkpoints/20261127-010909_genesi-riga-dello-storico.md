# Checkpoint — Genesi: la riga che resta nello storico dice i fori con valori loro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): la riga che resta nello
storico…»). Il precedente, `205d9132` (il confronto A/B coi fori con valori
loro), è confermato dal giro `node` completo: 43 comandi a posto, 4421
asserzioni. ⚠️ Quel giro è uscito 1 per UN numero scritto: in
`docs/STATO_PRODOTTO.md` era rimasto «4420» (in una riga lunga che il mio
`grep` di controllo non aveva mostrato). Corretto in questo commit.

## Che cosa è stato fatto
- Seconda passata coi valori per foro accesi, partita dallo storico: la riga
  che una volata salvata lascia in Home («12 fori · 600 kg · X50 34 cm») la
  componeva la pagina, nessuna prova la guardava, e non diceva che la volata
  aveva fori con valori loro.
- Modulo: `sintesiVolata(kpi)`. «12 fori · 1 con valori propri · 550 kg ·
  X50 34 cm (foro tipo)». «foro tipo» solo se per qualche foro la pezzatura
  non è calcolata. Senza valori per foro: la riga di sempre, carattere per
  carattere. Mai «null»/«undefined»/«NaN» nella riga.
- Pagina: `volSnapshot` prende la riga dal modulo; la copia nella pagina è
  tolta. Le volate già salvate tengono la riga che avevano.
- Prove: `run-kpi.mjs` 3258 → 3259 (controprova 9 su 9); banco
  `genesi-foro-per-foro.mjs` 208 → 214 (salva col bottone vero, legge il
  record e la riga in Home a 320 px), 72 iniezioni. Scatto di Home guardato.
- Numeri: 3.759 prove senza rete; giro `node` 4422 (per somma: 4421 + 1 — da
  confermare col giro su questo commit); `genesi-data.js` 208/208; condivisi
  382 su 382.

## Lezioni di questa unità
- Un numero in una riga lunghissima non si vede con `grep | cut -c1-230`:
  il «4420» di STATO_PRODOTTO stava oltre il taglio. Per i numeri tracciati
  si usa `grep -c` per file, o `grep -o` con contesto, non la riga tagliata.

## Stato roadmap
Chiusa «Genesi — la riga che resta nello storico dice i fori con valori
loro». Aperta e ferma: «Genesi — il piede che esce dalla faccia»
(decisione 35).

## Prossimo passo atomico
**Seconda passata coi valori per foro accesi — i due record che ESCONO
verso le altre app.**
1. `apps/genesi/genesi.html`, intorno a `GDB.aggiungi('previste',rec)` (la
   volata prevista per Sentinella) e `GDB.aggiungi('piani',recPiano)` (il
   piano per Campo): leggere come si compone `rec` e `recPiano`.
2. Con un foro scarico e uno col borraggio corto (dal ponte
   `window.__genesi.D2.holes[i]`), premere i due bottoni e leggere i record
   da `GDB.previste()` / `GDB.piani()`: la carica massima per ritardo è
   quella vera (F2)? Il piano per Campo porta la carica di OGNI foro? Si
   dice da qualche parte che ci sono fori con valori loro?
3. ⛔ Se la correzione tocca `shared/dw-ponti.js` o la pagina di Campo o di
   Sentinella: NON si tocca (mandato solo Genesi) — si annota in roadmap con
   la misura. Se sta nel record composto da Genesi: si corregge lì, coi tre
   conti di `computeKPI` (`foriPropri`, `flyTipo`, `fragTipo`).
4. Poi: la scena 3D (stessa domanda), e `B3. Genesi continua a uscire dalla
   pagina`.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede); 32 rimandata. Piano di carico CSV senza diametro e inclinazione
per foro: intestazione in `shared/dw-ponti.js`, letta da Campo — annotato.
