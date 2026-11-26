# Checkpoint — 2026-11-26T14:34:58Z

## Tipo
unit-complete (fondazione + copertura con controprova) — sessione
interattiva; la routine è stata RIARMATA dal fondatore oggi (solo Genesi,
prossimo avvio 15:45Z), col prompt aggiornato sul piano foro per foro.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
51567197 (fix(genesi): i lettori di sismografo e sonda rifiutano col nome ciò che non è il loro formato; piano foro per foro)
Il giro `node` su quel commit: **43 comandi su 43, 4327 asserzioni**
(letto dal giro tutto verde, non sommato).

## Cosa è stato completato — F1 del progetto «foro per foro»
- `apps/genesi/genesi-data.js`: `CAMPI_PER_FORO` (kg, prof, stem),
  `valoreProprioDiForo`, `valoreDiForo(h, campo, progetto)`,
  `valoriPropriDiForo`; `foriDaDesign` rilegge i valori propri validi e
  conta in `valoriScartati` quelli scritti e illeggibili.
- `apps/genesi/genesi.html`: il salvataggio del progetto scrive i valori
  propri (un foro senza non guadagna chiavi); alla riapertura i valori
  illeggibili si dichiarano; il piano di carico legge profondità, carica e
  borraggio PER FORO da `valoreDiForo`.
- Regole provate in scratchpad prima: senza valore suo → progetto; zero
  dichiarato resta zero (foro scarico, foro non borrato), solo la profondità
  zero non è un foro; né foro né progetto → `null`; un campo non ancora per
  foro (diam, incl) → `null`, non il progetto di nascosto.
- **Neutralità misurata**: stesso progetto, piano di carico premuto su HEAD
  e sul disco → identici, 873 caratteri su 873. Con tre valori messi su due
  fori cambiano 2 righe su 12, solo nelle colonne giuste.
- Nuovo banco `browser/genesi-foro-per-foro.mjs` (12/0; controprova 11 ok +
  2 KO sulle due asserzioni causali + l'iniezione verificata), in `tutti.mjs`.
- `run-kpi.mjs`: +2 prove (3233 → 3235).
- Fuori unità, piccolo: la somma delle prove in `docs/DEVELOPMENT.md` era
  scritta in una forma che il giro non riconosceva («gli addendi lì NON sono
  sorvegliati», avviso già presente prima di oggi): riportata alla forma
  sorvegliata.

## ⚠️ Stato intermedio da conoscere
Con valori per foro presenti, le colonne DERIVATE del piano di carico
(volume servito, consumo specifico) e i numeri della scheda (MIC, carica
totale, costo) leggono ancora il valore del progetto. Oggi nessun utente può
arrivarci: non esiste un comando per dare a un foro un valore suo (solo il
ponte di debug). **Per questo F3 (il comando) viene DOPO F2 (i calcoli).**

## Numeri propagati
- Prove senza rete 3.731 → **3.733**; banchi del browser 461 → **463**; file
  di banco 212 → **213**; `genesi-data.js` 180 → **184**; condivisi 353 →
  **357**; giro `node` scritto **4329** (4327 letto + 2 prove nuove): il
  giro lanciato dopo questo file dice il numero vero.

## Prossimi passi
- **Prossimo passo atomico — F2**: MIC, carica totale e consumo specifico
  sommano le cariche vere dei fori. Prima di toccare qualcosa: leggere
  `micFinestra(holes, kg)` e `micSenzaConto(holes, kg)` (genesi-data.js) e
  TUTTI i loro chiamanti nella pagina e nel modulo (`grep -n "micFinestra\|
  micSenzaConto\|caricaTotale(" apps/genesi/*.{html,js}`); la firma si
  ALLARGA (il secondo argomento resta il kg del progetto, e ogni foro passa
  da `valoreDiForo(h,'kg',{kg})`), non si copia. Prova di neutralità
  obbligatoria: i KPI della dimostrazione identici prima e dopo, e una prova
  in cui un foro più carico alza la MIC della sua finestra e solo di quella.
  Poi `caricaTotale`: oggi è nf × kg — con valori per foro è la somma.
- Poi F3 (comando «a questi fori: carica / profondità / borraggio» sulla
  selezione multipla, input letto con `numIt`), F4, F5, F6.

## Blocchi
Nessuno.
