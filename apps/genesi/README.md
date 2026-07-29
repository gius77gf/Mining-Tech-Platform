# Deepwork Genesi

Simulatore di volate (drill & blast) per cava e superficie, calibrato su volate reali filmate. Prodotto premium dedicato dell'ecosistema Deepwork (Mining-Tech Platform).

## Avvio
App web (PWA, ES module + three.js vendorizzato): va **servita da un web server** (NON aprire con doppio click `file://`, i moduli ES verrebbero bloccati).
```
python -m http.server 8765
# poi apri  http://localhost:8765/genesi.html
```

## Contenuto
- `genesi.html` — app principale: editor 2D (maglia, fronte e piede modellabili, fori trascinabili, validatori live), simulazione 3D, catalogo esplosivi, frammentazione Kuz-Ram, PWA.
- `vendor/` — three.js 0.160 (locale, per uso offline).
- `esplosivi.json` — catalogo esplosivi · `calibrazione.json` — parametri fisici.
- `login.html` · `genesi-sw.js` (service worker) · `genesi_G_final.svg` (logo).

## Il ponte con Campo (riconciliazione automatica)

La Riconciliazione previsto-vs-reale non si riempie più a mano per la parte del
carico: la legge dal consuntivo che il fochino ha registrato in **Campo**.

1. Dalla Scheda volata, *Esporta piano di carico (CSV per il fochino)* →
   si importa in Campo.
2. In Campo il fochino registra la **carica reale foro per foro** e poi fa
   *Esporta consuntivo (CSV)*.
3. Qui: *Riconciliazione → Importa consuntivo da Campo (CSV)*.

Dal file entrano **solo** i numeri che ci sono scritti: carica reale totale,
fori con la carica registrata, scostamento complessivo e scostamento medio per
foro, più data, turno e chi l'ha fatta. Ogni valore porta scritto **da dove
viene** (`dal file`, `calcolato qui`, `previsto qui`).

**Pezzatura (X50), PPV e gittata restano vuoti**: in Campo nessuno li misura e
Genesi non li inventa — quelli li scrive chi era in cava.

Formato atteso (è quello che Campo esporta; la lettura va per **nome** di
colonna, quindi un file con le sole prime sei colonne funziona lo stesso):

```
data;turno;foro;carica_prog_kg;carica_reale_kg;scarto_pct[;scarto_kg;squadra;operatore]
```

Se il file è vuoto, illeggibile, o è il *piano* invece del *consuntivo*, l'import
si rifiuta e spiega cosa fare, senza toccare quello che c'era. Se il consuntivo
ha un numero di fori diverso dal progetto aperto, Genesi avvisa che **potrebbe
essere un'altra volata** e non calcola il confronto col previsto.

## Il ponte con Sentinella (legge di sito K e β dai referti)

La modale **Legge di sito** ricava K e β della propria roccia dai referti del
sismografo (distanza, carica massima per ritardo, PPV misurata) con una
regressione sui logaritmi, e usa la **riga al 95° percentile** per il progetto.
I referti si digitano a mano, oppure arrivano da un file — e **Sentinella li
produce da sé** dal registro volate, dove la PPV misurata è agganciata alla
volata e alla lettura del sismografo di quel giorno.

- In Sentinella: *Registri → Referti per la legge di sito → Esporta referti per
  Genesi (CSV)*. Il file esce con le colonne `distanza_m;
  carica_per_ritardo_kg; ppv_mms; riferimento; data; origine`.
- Qui: *Legge di sito → Importa referti (CSV)*. L'**intestazione viene
  riconosciuta** (`_sitoMappaColonne`) e le colonne sono già proposte giuste,
  compreso il **riferimento** (facoltativo) e la **data** del referto; l'utente
  resta l'ultima parola e le conferma guardando l'anteprima. Un file senza
  intestazione si comporta come prima: prima, seconda e terza colonna.
- **Provenienza sempre scritta**: ogni referto porta un campo `fonte` e in
  elenco una pillola — *Sentinella* (dal registro volate), *sismografo* (file
  di uno strumento), *a mano* (digitato qui), *origine non registrata* (referti
  salvati prima che il campo esistesse: non si riscrive il passato). Sopra
  l'elenco c'è il conteggio per provenienza, e la colonna `origine` esce anche
  nell'export, così il round-trip non la perde. Un dato di cui non si sa da
  dove viene non è un dato — e da K e β dipendono le distanze di sicurezza.
- **Resta opt-in**: finché la casella «Usa questa legge nei calcoli» non è
  spuntata, PPV, MIC e carica massima ammissibile continuano a usare la stima
  dalla litologia. Quando è attiva, la Scheda validatori lo dichiara nel badge
  *PPV al recettore* («ricavati dai tuoi N referti») e avvisa quando la
  distanza scalata del progetto è **fuori dall'intervallo calibrato**.

## Manda a Sentinella (la volata progettata entra nel registro volate)

È il verso opposto della *Legge di sito*, e **toglie una doppia digitazione**:
finora chi progettava una volata qui doveva riscriverla a mano nel registro
volate di Sentinella per poterla monitorare. Stessa volata, due digitazioni, due
occasioni di sbagliare. Genesi però ha già tutto quello che quel registro chiede.

*Progettazione → «📡 Manda a Sentinella (registro volate)»*: la modale mostra
**che cosa parte** — numero di fori (quelli davvero in pianta), carica totale,
**MIC** (carica massima per ritardo), distanza del recettore, distanza scalata,
**PPV prevista**, limite e norma citati, airblast previsto, e su che base è
stata fatta la previsione (legge di sito calibrata oppure stima dalla
litologia). Si scelgono la **data prevista** e il **fronte** (ricordati per la
volta dopo), e il file esce con le colonne che Sentinella **già** importa
(`CSV_VOLATE_INTESTAZIONE` in `apps/sentinella/sentinella-data.js`): nessun
formato nuovo. In Sentinella: *Registri → Registro volate → Importa da CSV*.

- **La volata entra come PREVISTA**, non come eseguita: non conta fra le volate
  eseguite di Sentinella e non entra nel report di conformità finché qualcuno non
  la conferma dopo lo sparo (potendo correggere i dati).
- **⛔ Le quattro colonne della PPV misurata escono VUOTE, sempre.** Una volata
  progettata non è stata sparata: nessuno strumento può averla misurata. La PPV
  prevista viaggia nella **sua** colonna (`ppvPrevista`) e in Sentinella non
  diventerà mai un referto per la legge di sito — se lo diventasse, la legge
  confermerebbe sé stessa e le distanze di sicurezza uscirebbero da un calcolo
  circolare. Il giro onesto è: previsione da qui → misura del sismografo in
  Sentinella → referto → K e β → previsioni migliori qui.
- **Codice volata deterministico** (`GEN-<data>-<hash del progetto>`):
  riesportando lo stesso progetto il codice non cambia, quindi Sentinella
  riconosce il doppione anche dopo che la volata è stata confermata correggendo
  fori e chili.
- I numeri del file sono gli **stessi** che mostrano la Scheda validatori e il
  report: `computeKPI()`, `computeMIC()`, `airblastDb()`, `normaPpvLab()` — una
  formula sola per ogni cosa, altrimenti due schermate direbbero due numeri.

© 2026 Deepwork · Mining-Tech Platform
