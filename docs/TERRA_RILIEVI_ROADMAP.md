# Terra — rilievi e volumetrie: confronto onesto e roadmap (ricerca 24/07)

Nota di ricerca (fallback dei cicli automatici, zero modifiche al codice): dove sta
Terra rispetto ai software di rilievo drone/volumetrie per cave, e quali passi sono
fattibili nel browser. Le modifiche al modello dati restano gated sul fondatore.

## Cosa fa Terra OGGI (dal codice)
- **Fronti** (CRUD completo con modifica in-place) e **rilievi** con volume,
  metodo (RTK/PPK/GCP), GSD → **classe di accuratezza** e **banda ±%** sul volume
  (`classeAccuratezza`, `bandaVolume`) — onestà sul margine d'errore già integrata.
- **Trend volumi** tra rilievi, **proiezione annua** vs autorizzato (ok/warn/danger),
  **riserva residua** in anni, **valore del materiale** (densità/prezzo), import/
  export CSV. Tutto org-isolato e coperto da test.

## Cosa fanno i leader (Propeller, Pix4D, DroneDeploy, Strayos)
1. **CALCOLANO il volume dal dato 3D** (nuvola/DEM): stockpile e scavo misurati
   direttamente dal rilievo, non inseriti a mano.
2. **Confronto tra rilievi (cut/fill)**: differenza tra due superfici in date
   diverse → quanto è stato scavato/accumulato e DOVE.
3. Ortofoto/DEM come deliverable documentali; report volumetrici ripetibili con
   baseline tra date.
4. Precisione survey-grade (Pix4D) o flusso di produzione (Propeller/DroneDeploy) —
   tutti cloud/desktop A PAGAMENTO per elaborazione.

## Divario e passi FATTIBILI (ordinati per impatto — convergenza col flusso drone)
1. **Volume DAL ritaglio della nuvola, nel browser** (impatto ALTO, riuso ALTO):
   abbiamo già la catena — LAS/PLY/XYZ → visore → ritaglio del cumulo/fronte
   (`pointcloud.js` + nuvola-poc). Il passo: griglia 2D dei punti ritagliati +
   integrazione delle quote sopra un piano di base = **volume del cumulo misurato
   da noi, gratis, offline**. È la funzione-simbolo dei leader, alla nostra
   portata con la nostra filosofia ("meno preciso, più economico": banda ±% già
   pronta in Terra per dichiarare l'errore). *(Il calcolatore è puro e testabile;
   SALVARE il volume calcolato nel rilievo tocca il modello dati → fondatore.)*
2. **Confronto semplificato tra 2 rilievi dello stesso fronte** (impatto medio):
   Terra ha già il trend sui totali; il passo onesto è il delta per-fronte con
   banda d'errore combinata. Il VERO cut/fill spaziale (mappa del dove) richiede
   DEM e va dichiarato fuori portata browser per ora.
3. **Baseline/report ripetibile** (impatto medio): il report CSV esiste; un
   "verbale di rilievo" stampabile (come il report di Genesi) con trend, banda e
   metodo darebbe il deliverable documentale dei leader.
Punto di forza già nostro: **riserva residua in anni e proiezione vs autorizzato**
— un taglio gestionale che i tool di puro rilievo spesso non hanno.

## Limiti onesti
- Terra non fa fotogrammetria (foto→nuvola): quella resta a ODM (gratis,
  self-host — vedi DEEPWORK_DRONE_FLUSSO). Terra parte dalla nuvola/valori.
- Il volume dal ritaglio erediterà l'accuratezza del rilievo consumer: si dichiara
  con la banda ±% (già implementata), non si spaccia per misura certificata.

## Prossimo passo (quando il fondatore sceglie)
Consigliato il **punto 1** (volume dal ritaglio): completa il flusso drone
(rilievo → nuvola → ritaglio → VOLUME in Terra → volata in Genesi) e dà alla
prova del weekend uno sbocco immediato in Terra oltre che in Genesi.

## Fonti
- [Pix4D vs DroneDeploy 2026 (Skyebrowse)](https://www.skyebrowse.com/news/posts/pix4d-vs-dronedeploy)
- [Best drone stockpile measurement software 2026 (WifiTalents)](https://wifitalents.com/best/drone-stockpile-measurement-software/)
- [Drone mapping software guide 2026 (Dronedesk)](https://dronedesk.io/drone-mapping-software-guide)
- [Drone volumetrics (Advexure)](https://advexure.com/blogs/news/drone-volumetrics-saving-time-and-enhancing-accuracy-in-stockpile-measurements)
