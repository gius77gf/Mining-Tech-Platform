# Genesi — Stato reale del motore 3D e piano (A1 rivisto, 2026-07-19 sera)

REVISIONE della prima stesura: la ricognizione approfondita ha
mostrato che l'overhaul estetico indicato nel vault ("Prossimi passi")
è in larga parte GIÀ REALIZZATO nel codice. La prima stesura di questo
documento diceva "zero texture": ERA SBAGLIATA (cercava TextureLoader,
ma le texture sono generate proceduralmente via CanvasTexture).

## Scoperta chiave della giornata
L'app era ROTTA: mancavano in vendor/ i moduli di post-processing
Three.js r160 importati da genesi.html → l'app restava bloccata sulla
splash OVUNQUE (anche nel repo originale genesi-app). Risolto il
2026-07-19 (commit 64c1f88). È molto probabile che l'impressione del
fondatore ("stato di sviluppo che non soddisfa le aspettative") derivi
almeno in parte da questo: l'app non si vedeva proprio.

## Cosa esiste già (verificato nel codice e a schermo)
- Texture PBR procedurali (rockTextures ~r.660): albedo con strati,
  roughness map, normal map da noise; applicate via rockMat a
  pavimento, banco, fronte rivelato, pannelli per-foro (con offset
  UV per pannello per evitare l'effetto "riquadri"), chunk e cumulo.
  Attive sopra il livello QUALITA Base.
- Sistema LOOKS di illuminazione (r.916): preset che cambiano cielo
  (gradiente canvas), fog e luci; default "Studio Tecnico" approvato;
  override in dev con ?look=. Flash di detonazione a PointLight che
  segue la sequenza reale.
- Ombre PCFSoft 2048, bloom (UnrealBloom) + OutputPass, pixel ratio
  adattivo su 3 livelli QUALITA.
- Particellari a 3 strati (getti dai colletti, gonna basale, nuvola)
  con tempi calibrati internamente sulla dinamica osservata.
- Muckpile: heightfield fisico (cella 0.5 m, angolo riposo 37°,
  rigonfiamento 1.4, heave esplosivo-aware e ridotto per fori
  bagnati) + mesh del cumulo con materiale roccia.
- HUD "vetro" GIÀ presente: pannelli rgba scuri con backdrop-filter
  blur 14-22px, bordo ambra, ovunque (params, timeline, card home).
- Diorama "solo volata" (scelta di direzione: niente piazzale
  infinito), fronte reale importabile da fotogrammetria (OBJ), vista
  raggi-X con cilindri di carica/borraggio, profilo cresta da Deepwork.

## Lavoro REALE rimanente (allineato al vault, fase A rivista)

⏱️ **CHIUSO IL 21/09, VERIFICATO SUL CODICE VIVO** (non sulla parola di
questo documento, che era fermo al 19/07): dei cinque punti di questa
sezione, **tre sono già costruiti da tempo** e uno è chiuso ma con una
scelta di prodotto diversa da quella qui descritta.

1. ✅ **Flyrock — gittata.** Costruito: `flyrockEst`/`flyrockInv`
   (`genesi.html`, formule Richards&Moore/cratering/McKenzie/Lundborg,
   burden/Pd-aware, con la guardia sul burden mai scritto —
   `gittataSenzaSpalla`, blocco B0-tervicies) + tre anelli concentrici
   colorati nella scena 3D (gittata prevista, 2× mezzi, 4× persone),
   layer `lFly`.
2. ✅ **Fori bagnati.** Costruito: effetto su heave (`_wetE`) E
   sull'accoppiamento/RWS (`PENALITA_ACQUA`, `rwsEffettiva`, usata sia
   nel Kuz-Ram sia nel rock-factor), sezione dedicata "Fori bagnati"
   nella progettazione, indicazione visiva in scena (`wetH`) e riga
   «Fori bagnati: sì/no» nel rapporto stampato.
3. ⚠️ **Rock-factor Lilly — la FORMULA è costruita, il FORM no.**
   `fattoreRoccia` (`genesi-data.js:2866`) implementa la formula intera
   (RMD, joint factor da JPS/JPA/JCF, RDI da densità, hardness factor
   da modulo elastico o UCS) — non un placeholder. Ma i quattro
   parametri (`rmd`/`jcf`/`jps`/`jpa`) vengono **solo** dal preset del
   litotipo scelto (`selRoccia()`): verificato con `grep -n "rmd\|jcf\|
   jps\|jpa" apps/genesi/genesi.html` → **zero righe**, nessun campo
   li espone all'utente. Resta vero che manca "un form dedicato" — ma
   non manca il calcolo che descriveva come mancante.
4. ✅ **Presplit + confronto A/B.** Costruito: presplit come parametro
   di progetto con mezzifondelli in scena, dedicata sezione UI, e
   comparatore («📊 Confronta spalla (burden) per lo stesso obiettivo»,
   `btn-confronta-burden`) — KPI affiancati a parità di pezzatura
   obiettivo, non i "due progetti" letterali descritti qui, ma la
   stessa funzione di prodotto (confronto comparato).
5. **Rifiniture estetiche mirate.** Non riaperto d'iniziativa: una
   proposta concreta (burden map a colori sul banco 3D) è già stata
   verificata, il suo costo/dato-disponibile confermato, e lasciata
   come candidato per un cantiere dedicato in
   `docs/RICERCA_CONTINUA_GENESI.md` (sezione "rifiniture di scena 3D
   per la presentazione al cliente") — non un "todo" di questo
   documento.

Resta un solo lavoro reale, piccolo e preciso: **il form per RMD/JPS/
JPA/JCF** (punto 3), se e quando si deciderà che la caratterizzazione
dell'ammasso roccioso per-progetto vale più del preset per litotipo —
non è stato costruito perché non c'è ancora un segnale che serva (nessuna
ricerca o richiesta lo cita come mancanza sentita).

## Nota per il vault del fondatore
La voce "Fase 2 — overhaul estetico schermata 3D" in ecosistema-vault
"Prossimi passi" risulta superata dallo stato reale del codice: da
aggiornare nel weekend di revisione (spuntarla o riformularla nelle
rifiniture mirate del punto 5).

Baseline visiva: apps/genesi/baseline-3d-2026-07-19.png
(?demo=1&sim=1&simt=6 e simt=end su localhost per riprodurla).
