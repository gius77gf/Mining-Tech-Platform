# Genesi — visore nuvola di punti (point-cloud): si può fare? (documento per la decisione)

Documento per Giuseppe. I competitor (Maptek, Strayos, O-Pitblast) mostrano il
**rilievo 3D del fronte/cava** come "nuvola di punti" (point-cloud), tipicamente da
**drone/fotogrammetria o laser scanner**. Domanda: possiamo mostrarla in Genesi,
nel browser, senza backend e senza spese? E fin dove, onestamente?

> Nota di onestà: questo documento è scritto da conoscenza tecnica consolidata,
> non da una ricerca web fresca. Le scelte di fondo (Three.js rende punti nativamente,
> le nuvole grandi servono tiling/LOD) sono stabili; ma **prima di impegnarci serve
> un piccolo proof-of-concept** con un file reale del fronte per misurare i limiti sul
> device tipico dell'utente.

## Risposta in una riga
**Vedere** una nuvola di punti **piccola/media** nel browser è **fattibile subito e
gratis**: Genesi usa già Three.js, che disegna i punti nativamente. **Vedere un
rilievo drone COMPLETO** (decine/centinaia di milioni di punti) **no**: supera la
memoria del browser e serve una tecnica di "tiling/livelli di dettaglio" (Potree,
deck.gl) più pesante. Quindi: **visore base sì; visore "da rilievo professionale
completo" è un lavoro maggiore da decidere.**

## Cosa serve tecnicamente (in parole semplici)
Una nuvola di punti è un elenco di coordinate x,y,z (a volte con colore). Formati:
- **XYZ / ASCII**: testo, banale da leggere. Ideale per il primo passo.
- **PLY**: comune nell'export fotogrammetrico; leggibile.
- **LAS / LAZ**: standard dei rilievi. **LAZ** è compresso → serve un piccolo
  decompressore in WebAssembly (`laz-perf`) per leggerlo nel browser.

Three.js (già in Genesi) disegna i punti con `THREE.Points` + una geometria a buffer:
**nessuna libreria nuova** per il caso base.

## I limiti VERI (da non nascondere)
- **Memoria del browser**: caricare "tutti" i punti di un rilievo drone reale
  (decine/centinaia di milioni) **fa crashare o impallare** la pagina. Il caso base
  regge nuvole **piccole/medie** (indicativamente fino a qualche milione di punti,
  a seconda del PC/telefono) — da **verificare con un POC**.
- **Nuvole grandi = servono i "livelli di dettaglio" (LOD)**: strumenti come
  **Potree** o **deck.gl** mostrano solo i punti che servono alla distanza di
  visione, tenendo il resto su disco/tiling. È il modo giusto per i rilievi veri,
  ma è **integrazione più complessa** (conversione della nuvola in formato tiled,
  più codice).
- **Vedere ≠ capire**: mostrare la nuvola è una cosa; **ricavarne automaticamente
  il profilo reale del fronte e il burden per foro** è un passo ulteriore e più
  difficile (geometria/analisi). Da non spacciare: il visore fa vedere, non misura
  da solo la geologia.
- **Niente backend per VEDERE** (tutto lato client). Il backend servirebbe solo per
  **conservare/servire i rilievi dei clienti** — e allora scatterebbe l'isolamento
  multi-tenant (dati di aziende concorrenti) → da rimandare alla commercializzazione
  (spesa = decisione tua).

## Cosa possiamo fare — ordinato per fattibilità e onestà

### (a) SUBITO, gratis, onesto — visore BASE
Caricare un file **XYZ/PLY (ASCII)** e mostrarlo con `THREE.Points` accanto alla
volata simulata, per **vedere il fronte/cumulo rilevato** insieme al progetto.
Etichetta chiara: *"visore base per nuvole piccole/medie; per rilievi grandi va
ridotta la densità (downsample); non è un'analisi geologica automatica."*
- Effort: **piccolo** (parser + `THREE.Points` + un controllo di dimensione con
  avviso se il file è troppo grande).
- **Serve la tua revisione grafica** (aggiunge un elemento 3D nuovo).

### (b) Support LAZ (rilievi compressi) + downsample automatico
Aggiungere `laz-perf` (WASM) per leggere i **LAZ** e un **campionamento automatico**
(mostra 1 punto ogni N) così anche un file grande si vede, seppur diradato.
- Effort: **medio**. Onesto: è una vista diradata, non tutti i punti.

### (c) Nuvole grandi "vere" con LOD (Potree/deck.gl)
Integrazione di un motore a livelli di dettaglio per rilievi completi.
- Effort: **alto** (conversione tiled della nuvola, più codice, forse un passo di
  pre-elaborazione). Da fare **solo se serve davvero** — decisione tua.

## Raccomandazione
- **(a) come primo passo**, quando avremo il tuo ok grafico: visore base onesto,
  utile per affiancare il rilievo alla volata. Zero costi, zero backend.
- **(b) LAZ + downsample** come secondo passo se i tuoi file tipici sono grandi.
- **(c) LOD** solo se un domani serve caricare rilievi drone completi ad alta densità
  — è un progetto a sé.

**Serve la tua decisione**: il visore base (a) ti interessa come prossimo passo
Genesi (dopo la tua revisione estetica), o lo teniamo in roadmap più avanti? E che
formati usi tipicamente (XYZ/PLY/LAS/LAZ) e quanto grandi sono i file? Con un file
di esempio faccio un proof-of-concept per misurare i limiti reali sul tuo device.

---
Collegato: `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` (l'altro punto pesante, #4) e
`docs/GENESI_OPENSOURCE_EMULAZIONE.md` (quadro generale delle emulazioni open-source).
