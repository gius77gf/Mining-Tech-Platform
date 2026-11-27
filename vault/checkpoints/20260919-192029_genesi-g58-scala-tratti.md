# Checkpoint — 2026-09-19T19:20:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
97e45f76 (feat(genesi): G57, ruota tratti attorno al loro centroide comune)

## Cosa è stato completato
Terza trasformazione CAD (sezione 3 di `docs/RICERCA_GENESI_CAD.md`):
**scalare i tratti**, per un caso reale che né il censimento né G57
avevano nominato.

- [x] **G58 — `trattiScalati(tratti, fattore)` (genesi-data.js)**:
  `dxfInTratti` non legge `$INSUNITS` (l'unità dichiarata dal file DXF);
  un rilievo esportato in millimetri (comune) entra 1000 volte più
  grande dei fori/fronte di Genesi, che lavora sempre in metri.
- [x] ⛔ **Difetto trovato e corretto PRIMA del commit, con la verifica
  dal vivo**: la prima stesura copiava la scelta di G57 (pivot il
  centroide comune) — sbagliata qui. Un errore di UNITÀ sbaglia OGNI
  coordinata della stessa proporzione, **compreso il centroide**:
  scalare attorno al centroide lascia il centro esattamente dov'era,
  quindi un rilievo a 7500 mm dall'origine restava a ~7500 dopo aver
  "scalato" di 0,001 — invisibile sulla stessa pianta dei fori tanto
  quanto prima. Misurato con Playwright (DXF fino a 10.000/5.000 mm →
  restava a ~7492–7502 invece di ~0–10). Corretto: si scala
  **dall'origine** (`x·fattore`, nessun centro sottratto).
- [x] ⛔ **Secondo difetto trovato e corretto allo stesso modo**: il
  valore di default del campo (0,001) faceva scattare l'euristica
  "migliaia o decimale?" di `numeroScritto`/`gvv`
  (`NUM_AMBIGUO=/^\d{1,3}[.,]\d{3}$/`, 1-3 cifre poi ESATTAMENTE 3) —
  `gvv` tornava NaN sul valore di default del bottone stesso, quindi il
  caso d'uso principale (mm→m) sarebbe stato impossibile da digitare.
  Corretto leggendo con `numIt` (decide dal separatore, non indovina
  l'intenzione) invece di `gvv` — stessa correzione applicata anche a
  `dtRuotaGradi` di G57, che aveva la stessa vulnerabilità latente.
- [x] UI: input fattore (default 0,001) + bottone «⤢ Scala tratti»,
  stesso schema di visibilità di G57. Guardie: fattore illeggibile,
  ≤0 (rifiutati esplicitamente, non "corretti" in silenzio), =1
  (no-op dichiarato).
- [x] **Verificato dal vivo con Playwright** (non solo a unità): import
  DXF "in mm", scala ×0,001 → coordinate esatte in metri; annullamento
  (Ctrl+Z) torna ai mm originali; fattore 0/negativo/illeggibile tutti
  rifiutati coi messaggi giusti; screenshot a 320/390/430 px, nessun
  elemento fuori schermo (misurato con `getBoundingClientRect`, non
  solo guardato).
- [x] 7 test nuovi in `run-kpi.mjs`: la scala esatta dall'origine
  (contro il caso mm→m), l'involuzione ×2 poi ×0,5, i casi limite
  (fattore 0/negativo/assente/NaN/1), il collegamento nella pagina
  (nessuna scrittura su fori/fronte/piede), le guardie sul fattore.

## Verifica prima del commit
- `run-kpi.mjs`: 3227/0 (era 3220/0).
- `sintassi-pagine.mjs`: 34/0.
- `numeri-nei-documenti.mjs`: 43/0 — propagati: prove `node` 3.718→
  **3.725**; funzioni condivise (genesi-data.js 176→**177**, totale
  349→**350**); tabella estraibili di Genesi (una-o-due 38→**37**,
  tre-a-cinque 18→**19**, totale 46→**45**).
- **`giro-node.mjs` completo**: 41/41 comandi a posto, 0 caduti,
  asserzioni **4279** (dopo aver corretto — trovato mentre si
  verificava — un placeholder lasciato per errore in
  `docs/STATO_PRODOTTO.md` che rendeva quel documento invisibile al
  controllo: «la frase col totale non si trova, quindi NON è
  sorvegliato da qui». Corretto subito, non lasciato per il prossimo).
- `tutti.mjs --solo=genesi`: lanciato, non ancora concluso al momento
  di questo commit (stesso motivo delle unità precedenti: sistema sotto
  carico da più giri paralleli). Verificato a mano con Playwright in
  modo più mirato del batch generico.

## Stato roadmap
Tre delle quattro trasformazioni CAD della sezione 3 di
`docs/RICERCA_GENESI_CAD.md` completate (mirror G50, rotate G57, scale
G58 — tutte e tre limitate ai tratti, mai ai fori, per il motivo di
dominio fisico spiegato in G57). Resta: Blocchi/simboli riusabili
(costo grande, esplicitamente rimandato dal censimento).

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` al prossimo ciclo.
- Rileggere se `Blocchi/simboli riusabili` ha un caso d'uso reale prima
  di costruirlo (stessa disciplina di rotate/scale/mirror), oppure
  passare a un'altra verifica diretta/seconda iterazione su Genesi.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
