# Genesi — Piano tecnico overhaul estetico 3D (A1, ricognizione 2026-07-19)

Stato del motore grafico rilevato (genesi.html, 2106 righe; Three.js
modulare in vendor/ con OrbitControls, OBJ/GLTF loader, EffectComposer
+ UnrealBloom + OutputPass):

## Cosa c'è già (e va preservato)
- Post-processing con bloom; pixel ratio adattivo su 3 livelli QUALITA
  (Piena/Media/Base) con ombre disattivate su Base — righe ~597, 2047.
- Cielo a gradiente via canvas (skyTexture(stops), r.908) + Fog, con
  PRESET DI LUCE runtime che cambiano sky/fog (r.924-925) — esiste già
  un sistema "ora del giorno" embrionale (es. "Ora d'oro", r.932).
- Luci: AmbientLight + HemisphereLight + DirectionalLight sole con
  ombre PCFSoft 2048 (r.624-627); flash di detonazione a PointLight
  impulsiva che segue la sequenza reale (r.933).
- Particellari a 3 strati con sprite morbido (jet, gonna basale,
  nuvola) calibrati su 190 video reali (r.1039-1057, CAL r.543).
- Muckpile: heightfield fisico (cella 0.5 m, angolo riposo 37°,
  rigonfiamento 1.4) con eventi temporali (r.820-827) e heave factor
  esplosivo-aware/fori bagnati (r.769).
- VINCOLO (fondatore): il motore fisico NON si tocca — scatter, X50,
  two-energy, timeline restano identici.

## Lacuna principale rilevata
**Zero texture in tutta la scena** (nessun TextureLoader): tutti i
materiali sono MeshStandardMaterial flat-shading a tinta unita. È il
singolo intervento con il massimo impatto visivo.

## Piano per le unità A2-A6

### A2 — Materiali PBR roccia/fronte
- Generare texture PROCEDURALI via canvas (niente asset esterni:
  coerente con PWA offline e licenze): albedo roccia calcarea con
  variazione di tinta, bump/normal da noise, roughness map.
- Applicare a: fronte cava (bench), pavimento, pareti, chunk del
  muckpile (con 2-3 varianti di tinta per naturalezza).
- flatShading: rimuovere dove il dettaglio della normal map rende
  meglio; mantenere sui chunk piccoli (costo/beneficio).
- Rispettare QUALITA: texture 512px su Base, 1024 su Media/Piena.

### A3 — Illuminazione e cielo
- Estendere i preset esistenti in un sistema "ora del giorno" completo
  (alba / mezzogiorno / ora d'oro / crepuscolo): posizione sole,
  colore/intensità luci, stops del gradiente cielo, fog coerente.
- Aggiungere disco solare + alone nel cielo canvas; stelle opzionali
  al crepuscolo. Niente HDRI esterni (peso/offline).
- Esporre il selettore nell'UI accanto ai layer esistenti.

### A4 — Polvere e gas potenziati
- Lavorare SOLO sulla resa (non sui tempi calibrati dai video): sprite
  con più varianti di forma, tinta dalla luce di scena (uniform con
  colore sole), dissolvenza soft, leggera turbolenza nel drift.
- Aggiungere gas post-detonazione (NOx arancio tenue, breve) come
  strato separato attivabile dai layer.

### A5 — Muckpile realistico
- Superficie: mesh dal heightfield esistente (non solo chunk),
  con texture A2 e tinta più chiara della roccia in posto (materiale
  smosso), normali per il rilievo.
- Chunk in appoggio sulla superficie con orientamento casuale;
  distribuzione taglie coerente con X50/oversize già calcolati.
- Bordo del cumulo con pietrisco fine (instanced small chunks).

### A6 — HUD "vetro"
- Pannelli UI sopra il 3D: backdrop-filter blur + trasparenza scura,
  bordo sottile ambra, coerenti coi token shared/deepwork-style.css
  (che genesi dovrà importare — oggi ha stile proprio ma la palette
  coincide: ambra su scuro).
- Timeline/controlli simulazione come barra vetro in basso.

## Ordine consigliato e verifica
A2 → A3 → A5 → A4 → A6. Ogni unità: screenshot PRIMA/DOPO alla stessa
inquadratura (camera preset), confronto affiancato nel checkpoint;
test su qualità Base (prestazioni) oltre che Piena.
Baseline: apps/genesi/baseline-3d-2026-07-19.png (catturata in A1).
