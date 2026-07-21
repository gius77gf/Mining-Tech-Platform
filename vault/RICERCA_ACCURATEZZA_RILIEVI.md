# Ricerca — accuratezza dei rilievi drone e volumi (backlog per Terra)

Data: 2026-07-21 · Ricerca di prodotto per **Terra** (rilievi drone e volumi).
Obiettivo: capire quanto è "affidabile" un volume da drone in funzione del
metodo, per far dire a Terra — in modo onesto — una **classe di accuratezza** e
una **banda di incertezza** sul volume, così il numero è "difendibile" in un
controllo e nella riconciliazione col venduto.

⚠️ **Onestà**: valori TIPICI da letteratura secondaria concordante; l'accuratezza
reale del singolo volo va confermata coi **checkpoint indipendenti** del
rilevatore. Non è una garanzia di legge.

## I numeri chiave (tipici)
- **RTK/PPK** (drone con correzione satellitare): accuratezza ~**3 cm**
  orizzontale/verticale.
- **GCP** (punti di controllo a terra): ~1–2 cm orizzontale, 2–3 cm verticale.
- **Errore sul VOLUME**: ~**±1–3%** con un buon flusso (GCP o RTK+checkpoint);
  studi riportano **±1,25%** con marker/GCP e fino a **±8%** SENZA GCP.
- **GSD** (cm/pixel) tipico per cava: **1–2 cm/pixel**; quota di volo ~60–120 m.
- **Checkpoint indipendenti**: sempre consigliati per validare (l'accuratezza
  "difendibile" è tutto il senso dell'esercizio).

Traduzione per il fondatore: un volume da drone **non è un numero esatto**, ha
una tolleranza. Se dico "19.400 m³" senza dire "±3%", in una riconciliazione
col venduto (o con l'ente) quel numero è attaccabile. Terra può fare la
differenza dicendo **la classe** e **la banda**.

## Backlog per Terra (unità piccole, non gated)
1. **Classe di accuratezza del rilievo** (pura, testabile): da `metodo` + `gsd`,
   classifica il rilievo in `survey-grade` (RTK/PPK o GCP + GSD ≤ 2 cm),
   `indicativo` (senza GCP/senza metodo), o `n.d.`. Badge nel dettaglio rilievo,
   accanto a `qualitaRilievo` che già mostra metodo+GSD.
2. **Banda di incertezza sul volume** (pura, testabile): dal volume e da una
   %tolleranza (default per classe: ±2% survey-grade, ±8% indicativo), mostra
   "19.400 m³ (±388 m³)". Così il volume è onesto e difendibile.
3. **Riconciliazione col venduto** (ponte Terra↔Conti, futuro): confronto tra
   volume estratto (rilievo) e materiale venduto (Conti), con la banda di
   incertezza come "verde/giallo" sullo scostamento. È un pezzo del ciclo
   chiuso (parte quando 2 app sono live).
4. (Onboarding) Nell'import rilievi, il `metodo` alimenta la classe: già oggi il
   CSV importa `metodo;gsd`.

Il passo 1 e 2 sono il naturale prossimo incremento di Terra, stesso pattern di
`qualitaRilievo`/`riservaResidua`, senza affermare accuratezze come certe (ogni
banda porta la nota "tipica, da confermare coi checkpoint del rilevatore").

## Fonti (secondarie, concordanti)
- Photogrammetry accuracy — factors, limits, best practices (The Future 3D):
  https://www.thefuture3d.com/learn/photogrammetry-accuracy-guide/
- Stockpile volume measurement with drones — guide (GeoWGS84):
  https://www.geowgs84.com/post/stockpile-volume-measurement-with-drones-a-complete-guide
- Stockpile volume with drone photogrammetry (Pix-Pro):
  https://www.pix-pro.com/blog/stockpile-volume-drone-photogrammetry
- Precision volumetrics — GCP vs no-GCP (Impact Aerial):
  https://www.impactaerial.co.uk/2026/04/24/measuring-stockpile-volumes-with-a-drone-the-ultimate-guide-to-precision-volumetrics/
- Stockpile volumes — RTK/PPK accuracy (Propeller):
  https://www.propelleraero.com/blog/how-stockpile-volume-measurement-works-in-drone-surveying-with-propeller/
