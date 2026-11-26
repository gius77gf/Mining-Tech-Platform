# Checkpoint — 2026-11-26T20:08:18Z — F6a, il diametro per foro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è d197064c; giro node su
d197064c confermato: 43/43, 4343)

## Completato — Genesi, foro per foro, F6a: il diametro
- **Censimento prima**: 25 letture di `D2.diam` nella pagina. CONTI e FILE →
  per foro; PREVISIONI (confinamento del colletto, gittata, uniformità
  Kuz-Ram, rapporti geometrici, presplit, scena 3D) → restano sul diametro
  del progetto, come la carica (decisione 33).
- **Modulo** (`genesi-data.js`, nessuna esportazione nuova: 198/198):
  `diam` in `_REGOLE_PER_FORO` e `LIMITI_PER_FORO` (50–160 mm, `intero`);
  `_dentroLimitiForo` conosce gli interi; `capienzaFori` usa il diametro del
  foro (e lo riporta nella riga); `xmlPianoInnesco` scrive `HoleDiameter`
  dentro il foro solo se è suo; `dxfPianoFori` disegna il cerchio col diametro
  del foro; `tabellaFori` porta `diam` e `propri.diam`,
  `COLONNE_TABELLA_FORI` ha otto colonne. Salvataggio, lettore del piano,
  conta e «torna al progetto» seguono da soli (girano su `CAMPI_PER_FORO`).
- **Pagina**: quarto elemento in `_VAL_FORO` (`diDiam`); colonna `ft-largo` in
  tabella, visibile sopra i 480 px; `.volata.json` e lettore XML col diametro
  del foro; `capienzaFrase` dice il diametro di QUEL foro.
- **Neutralità** provata su copia del modulo prima di toccare il prodotto: XML
  e DXF identici al byte senza diametri per foro; capienza e salvataggio
  invariati.
- **Prove**: run-kpi 3248 → 3249 (+1 nuova; cinque asserzioni che fissavano
  «tre campi» aggiornate una per una — dove serviva «un campo che non è per
  foro» ora si usa l'inclinazione). Banco `genesi-foro-per-foro.mjs`
  134 → 146, controprova 40 iniezioni su 40 (una riancorata: la riga della
  capienza era cambiata).
- **Fuori, dichiarato**: il piano di carico CSV non ha la colonna del diametro
  (intestazione in `shared/dw-ponti.js`, letta da Campo: non è lavoro di sola
  Genesi).

## Numeri scritti nei documenti
3.747 prove senza rete (run-kpi 3249); giro node 4344 (per somma: +1; da
confermare); `genesi-data.js` 198/198 e 150 funzioni nella pagina (invariati).

## Stato roadmap
F1–F5 ✅ · capienza ✅ · F6a ✅ · F6b (inclinazione) aperta. Decisione 33 in
attesa del fondatore.

## Prossimo passo atomico
Il foro per foro è arrivato dove può arrivare senza decisioni del fondatore
(resta l'inclinazione, che cambia la geometria 3D, e la decisione 33). Si
passa al punto successivo del piano di Genesi, **le nuvole di punti LAZ**:
1. leggere `docs/RICERCA_CONTINUA_GENESI.md` (sezione 26/11) e
   `reports/Genesi formati di scambio cava.md` sulla parte LAZ;
2. `grep -n "laz\|LAZ" apps/genesi/pointcloud.js apps/genesi/genesi.html` per
   vedere che cosa dice oggi il lettore davanti a un `.laz` (lo rifiuta con
   un messaggio? lo legge male?) — MISURARE con un file `.laz` vero scritto da
   `laspy` (come i 19 `.las` già usati: lo script generatore è accanto ai
   campioni), nel browser;
3. decidere fra decompressione in casa (LASzip è un formato pubblico ma il
   decodificatore aritmetico è lungo) e rifiuto onesto con istruzioni («salva
   come LAS»): la scelta si fa con la misura di quanto costa, e se è una
   scelta di prodotto va in `docs/DECISIONI_WEEKEND.md`.
Piccola cosa lasciata lì (pagina, pianta 2D): la proiezione del piede di un
foro inclinato usa `D2.prof` per tutti — con una profondità propria dovrebbe
usare `valoreDiForo(h,'prof',D2)`; è la prima riga di F6b.

## Blocchi
Nessuno. In attesa del fondatore: decisione 33; canarino su main (serve una PR).
