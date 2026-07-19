# Licenze di terze parti — Deepwork Replica

Deepwork Replica usa i seguenti componenti di terze parti. Tutti sono compatibili con la distribuzione del prodotto.

| Componente | Versione | Licenza | Uso |
|---|---|---|---|
| [three.js](https://github.com/mrdoob/three.js) | r160 | MIT | Motore di rendering 3D (WebGL). Vendorizzato in `vendor/build/three.module.js` |
| three.js — OrbitControls | r160 | MIT | Controllo camera libera. Vendorizzato in `vendor/examples/jsm/controls/OrbitControls.js` |
| [Barlow / Barlow Condensed](https://fonts.google.com/specimen/Barlow) | — | SIL Open Font License 1.1 | Tipografia UI (caricata da Google Fonts) |

## Note

- **three.js (MIT):** `Copyright © 2010-2024 three.js authors`. La distribuzione richiede di conservare l'avviso di licenza, già presente in testa al file vendorizzato.
- **Barlow (OFL):** font di Jeremy Tribby, distribuiti via Google Fonts. Per un uso 100% offline (demo in fiera senza rete) i file `.woff2` andranno scaricati e serviti localmente con il rispettivo `OFL.txt` (passo previsto alla rifinitura della demo offline).
- **Audio:** il boato è **sintetizzato a runtime** via Web Audio API (rumore filtrato + oscillatore sub). Nessun campione audio di terze parti è incluso — nessun obbligo di attribuzione.
- **Dati di calibrazione:** derivati da riprese video di proprietà dell'azienda del fondatore. I video restano locali e non vengono distribuiti col software (vedi `SIMULATORE_architettura.md` §4.4 sul trattamento dati).

## Strumenti di sviluppo (NON distribuiti)

- **ffmpeg** (`.tools/`, build GPL): usato solo per l'analisi locale dei video di calibrazione. Strumento interno, non incluso nel prodotto distribuito.
