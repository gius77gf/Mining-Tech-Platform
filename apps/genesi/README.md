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

© 2026 Deepwork · Mining-Tech Platform
