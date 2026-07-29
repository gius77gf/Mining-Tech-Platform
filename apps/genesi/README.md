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

© 2026 Deepwork · Mining-Tech Platform
