# Genesi — roadmap estetica del visualizzatore 3D (bozza di lavoro, 23/07/2026)

Direttiva esplicita del fondatore (23/07): rendere il 3D di Genesi più
**professionale**, riferimento **Paradigm** (la suite di blast design di Austin
Powder). Non si copia il loro marchio: si adottano le **convenzioni da software
professionale** che loro e gli altri leader usano.

**STATO ONESTO**: raccolta fatta (23/07 sera); la verifica incrociata automatica è
fallita per **limite tecnico della sessione**. Claim marcati **[NV]** = da
verificare aprendo le fonti prima di implementare. Ogni unità estetica verrà
comunque implementata singolarmente e mostrata al fondatore con **screenshot
prima/dopo**: è lui il giudice finale.

---

## Come si presenta Paradigm (raccolto, [NV])
- **[NV]** Terreno come **mesh 3D fototessuturata** (importa OBJ con texture
  fotografiche del sito, e superfici/curve di livello DXF/DWG): il suo "look"
  caratteristico è il terreno con la foto reale drappeggiata sopra, non geometria
  piatta.
- **[NV]** **Heatmap di quota** sovrapposta al terreno, con scala colori
  configurabile (es. per evidenziare la quota di progetto del piazzale).
- **[NV]** I fori sono **colonne di carica segmentate a colori** direttamente nel
  3D (aria / borraggio / esplosivo / innesco, secondo le regole di carica) — non
  semplici cilindri.
- **[NV]** Ambiente di progettazione **3D-first**: cariche e tempi si progettano
  dentro la scena 3D (con codifica visiva dei tempi di sparo per foro).

## Tecniche Three.js leggere e OFFLINE (fattibili senza asset esterni)
- **[NV]** **RoomEnvironment + PMREMGenerator.fromScene** = illuminazione
  d'ambiente (IBL) per materiali PBR **senza alcun file HDRI esterno**: è un addon
  (~150 righe, MIT) costruito solo con primitive procedurali, integrabile in ~4
  righe; è la stessa ricetta di illuminazione usata da `model-viewer` di Google
  (lo standard del 3D "curato" sul web). → compatibile col nostro vincolo
  offline/niente CDN (va vendorizzato come gli altri addon che già abbiamo).
- **[NV]** PMREMGenerator: prefiltraggio fisicamente corretto per i materiali PBR;
  crearne **una sola istanza** all'avvio e riusarla.
- Tecniche standard aggiuntive da valutare (conoscenza consolidata Three.js, da
  provare col prima/dopo): **tone mapping ACES** + esposizione, ombre morbide
  (PCFSoft), nebbia/atmosfera leggera, antialiasing, transizioni di camera fluide,
  gizmo di orientamento (view cube).

## Convenzioni "da tecnico di cava" (danno l'aria professionale)
- **Freccia del nord**, **barra di scala**, griglia metrica con quote.
- **Legenda quote/colori** (si sposa con la heatmap di quota).
- Etichette/quote leggibili e viste ortografiche oltre alla prospettica.

## Proposta di roadmap (ordine impatto visivo / sforzo — da validare col fondatore)
1. **Tone mapping ACES + esposizione** — poche righe, alza subito la resa di luci
   e materiali esistenti.
2. **IBL con RoomEnvironment** (vendorizzato) — il salto di qualità percepita
   maggiore a costo quasi nullo; [NV] da verificare l'addon prima.
3. **Colonne di carica segmentate nel 3D** — allinea il look a Paradigm E riusa
   dati che abbiamo già (borraggio/carica/decking/acqua dei raggi-X).
4. **Heatmap di quota sul terreno** (colori per vertice, con legenda).
5. **Freccia nord + barra di scala + griglia quotata** (HUD).
6. **Ombre morbide + atmosfera**; poi gizmo di navigazione e transizioni camera.

Fuori dal gratis/offline (eventuali decisioni del fondatore, NON ora): sfondo
fototessuturato dal drone (quando il flusso Terra→Genesi porterà la mesh reale del
SUO sito — a quel punto la "foto drappeggiata" arriva gratis dal nostro stesso
flusso drone, che è la convergenza più bella di tutte).

## Rifacimento fronte/terreno (25/07 — dalla revisione severa del fondatore)

Diagnosi (confermata da ricerca su texture mapping per terreni): i difetti
"maculato/patchwork/blocchi" venivano da TRE cause tecniche:
1. **Texture senza scala reale**: le mappe procedurali erano stirate sull'intera
   superficie (una piastrella da 256 px su ~100 m) → chiazze giganti a terra.
   Fix: **UV in spazio-mondo** con scala fissa (8 m/piastrella), `repeat/offset`
   derivati da dimensioni e posizione reali → parete CONTINUA tra i pannelli
   (offset per-pannello casuali eliminati) e suolo in scala.
2. **Flat shading** su terreno e parete → faccette dure "low-poly".
   Fix: shading liscio (normali interpolate) + normal map per il dettaglio.
3. **Piano del muckpile visibile da subito**: da piatto "macchiava" il suolo
   disegnando in anticipo l'area di caduta (il "maculato" del fondatore).
   Fix: invisibile fino al primo materiale a terra.
Più: variante di texture NON stratificata a terra (le bancate orizzontali
sembravano strisce), tonalità unificata blocco/banco (0,92), suolo 1,0.
Fonti ricerca: gamedev.net "Texturing large terrain", NVIDIA GPU Gems 2 cap. 12
(tile-based texture mapping), polycount "UV mapping for terrain", discoverthreejs
(texture intro), discussioni Unity su texture stirate su pendii.

## Prossimi passi
1. Verificare i claim [NV] (dopo il reset del limite di sessione).
2. Implementare le unità 1–2 e mostrare il **prima/dopo** al fondatore.
3. Proseguire nell'ordine solo con il suo giudizio positivo (regola: l'estetica la
   giudica lui).
