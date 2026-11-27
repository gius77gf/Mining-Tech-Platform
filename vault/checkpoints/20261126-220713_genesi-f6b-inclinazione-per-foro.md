# Checkpoint — Genesi, foro per foro F6b: l'inclinazione di ogni foro (e le sei fette sono chiuse)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): foro per foro, F6b…»). Il
precedente, `787969c9` (le spline del DXF), è confermato dal giro `node`
completo: 43 comandi a posto, 4415 asserzioni, come scritto nei documenti.

## Che cosa è stato fatto
- Censimento prima di scrivere: `D2.incl` si legge in 9 punti (non 14), e
  NESSUN conto di carica la usa. È geometria (piede in pianta, rotazione nel
  3D) più la gittata, che è una previsione e resta sul progetto.
- `apps/genesi/genesi-data.js` (200/200 esportazioni provate)
  - `incl` in `_REGOLE_PER_FORO` (≥ 0: zero è un valore), in
    `LIMITI_PER_FORO` (0–30°, unità «°») e quindi in `CAMPI_PER_FORO`;
    `tabellaFori` e `COLONNE_TABELLA_FORI` portano la nona colonna.
  - `scostamentoPiedeForo(h, progetto)`: lunghezza × seno dell'inclinazione,
    coi valori di QUEL foro; `null` se una delle due non si sa.
  - `xmlPianoInnesco`: `<Inclination unit="deg">` nel foro solo se è sua;
    `<DesignInclination>` in PlanData solo se almeno un foro ne ha una.
- `apps/genesi/genesi.html` (150 funzioni di pagina, nessuna nuova)
  - scheda del foro: quinto campo `#diIncl`; i gradi attaccati al numero.
  - tabella: colonna `incl.` (`.ft-incl`) sopra i 560 px; griglia di base a
    nove colonne; il rombo della riga guarda TUTTI i campi propri (prima
    carica, profondità e borraggio: un foro col solo diametro suo non l'aveva).
  - pianta: il piede di ogni foro da `scostamentoPiedeForo` (⛔ prima
    `D2.prof` per tutti); scena 3D: rotazione da `f.suoi.incl` se c'è.
  - piano XML: `incl:D2.incl` allo scrittore; il lettore rilegge
    `DesignInclination` e l'`Inclination` di ogni foro.
  - `.volata.json`: `inclinazione_gradi` per foro se è sua, e — nuova —
    `geometria.inclinazione_gradi` del progetto, riletta all'import con
    `valoreCampo` e scritta nei due campi (`#pIncl`, `#dIncl`).
- Prove: `run-kpi.mjs` 3252 → 3253 (tre asserzioni che usavano l'inclinazione
  come esempio di «campo non per foro» ora usano la sottoperforazione);
  controprova 10 su 10. Banco `browser/genesi-foro-per-foro.mjs` 146 → 170,
  12 iniezioni nuove (52 in tutto, tutte sul bersaglio); aggiornata
  l'iniezione di `genesi-documenti-che-escono.mjs` che citava la riga
  `geometria`.
- Numeri: 3.753 prove senza rete; giro `node` 4416 (per somma: 4415 + 1);
  condivisi 374/374.

## Due cose imparate
1. ⛔ Lo scatto ha visto ciò che il banco non vedeva: a 900 px la nona cella
   andava a capo sotto ogni riga (avevo aggiunto la soglia a 560 px senza
   portare a nove la griglia di base). Il banco diceva «la colonna c'è e la
   tabella non scorre», ed era vero. Ora misura che le celle di una riga
   stiano alla stessa altezza, a 900, 570, 540 e 430 px.
2. Un test che usa un campo come ESEMPIO di ciò che il prodotto non fa
   («l'inclinazione non è per foro») cade il giorno in cui il prodotto lo fa:
   va spostato su un esempio che resta vero, non cancellato.

## Dichiarato
- Il piano d'innesco XML porta l'inclinazione del progetto SOLO quando un
  foro ne ha una sua (per non cambiare i piani di ieri). È una mancanza
  vera per chi perfora: voce aperta in roadmap.
- La pianta ora mostra piedi che possono stare OLTRE la linea del fronte
  (10 m a 20° con 3 m di spalla): nessun avviso lo dice. Voce aperta.
- La direzione dell'inclinazione è una sola («verso la faccia»): un foro non
  può inclinarsi di lato.

## Stato roadmap
Chiuse `F6b` e l'ombrello `FORO PER FORO` (sei fette su sei). Aperte per
Genesi: `il piede che esce dalla faccia`, `il piano d'innesco XML non porta
l'inclinazione del progetto`. In attesa del fondatore: decisione 33 (quale
carica usano le previsioni — vale ora anche per diametro e inclinazione),
decisione 34 (decodificatore LAZ), decisione 28 (pezzatura da foto),
decisione 32 (aggancio al cantiere, rimandata).

## Prossimo passo atomico — il piano XML porta l'inclinazione del progetto
È la più piccola e chiude un giro di andata e ritorno:
1. `xmlPianoInnesco`: in `PlanData`, dopo `HoleDiameter`, scrivere SEMPRE
   `'    '+_tag('HoleInclination','deg',p.incl)+'\n'` (assente → status
   «non-calcolabile», come gli altri) e togliere `DesignInclination`
   (diventerebbe un doppione: il progetto è già dichiarato). `_mancanti`
   NON va toccato: un piano senza inclinazione dichiarata non è «da non
   usare», è un piano di ieri.
2. Lettore nella pagina: `numOf(plan,'HoleInclination')` → `D2.incl`
   (0–30), tenendo `DesignInclination` come ripiego per i file scritti
   oggi (26/11) — e una prova che li riapre entrambi.
3. Prove: `run-kpi` (il test F6b cita `DesignInclination`: aggiornarlo) e
   la sezione 14 del banco (`/<DesignInclination unit="deg">10</`).
   `iniezioni-fresche` letta dal codice d'uscita.
4. Poi `il piede che esce dalla faccia`: SOLA LETTURA di
   `grep -n "altezzeForiDaPiede\|burdenVero\|Spalla (burden) per foro" apps/genesi/genesi.html apps/genesi/genesi-data.js`
   per capire che cosa Genesi sa della pendenza del fronte, prima di
   proporre un avviso.

## Blocchi
Nessuno tecnico.
