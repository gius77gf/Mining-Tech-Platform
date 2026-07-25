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
1. **Flyrock — gittata (A2 del vault)**: calcolo della gittata massima
   per foro (formule empiriche validate, burden/Pd-aware) +
   visualizzazione della zona di rischio come involucro 3D sul
   terreno. È il prossimo passo. [ex A7]
2. **Fori bagnati — completamento**: l'effetto su heave esiste (_wetE);
   dal vault resta la parte su carica/accoppiamento (emulsione vs
   ANFO in acqua) e l'indicazione visiva dei fori bagnati in scena e
   nella scheda. [ex A8]
3. **Rock-factor Lilly (A9)**: caratterizzazione dell'ammasso (RMD,
   JPS, JPO, SGI, hardness) che alimenta il fattore roccia di Kuz-Ram
   al posto del preset litotipo attuale — form dedicato in
   progettazione. [ex A9]
4. **Presplit + confronto A/B (A10)**: fila di presplit nel progetto e
   vista comparata di due progetti di volata (KPI affiancati).
5. **Rifiniture estetiche mirate SOLO se emergono debolezze visive**
   nei confronti prima/dopo (es. tinte muckpile, densità nuvola su
   qualità Base) — non un overhaul: quello c'è già.

## Nota per il vault del fondatore
La voce "Fase 2 — overhaul estetico schermata 3D" in ecosistema-vault
"Prossimi passi" risulta superata dallo stato reale del codice: da
aggiornare nel weekend di revisione (spuntarla o riformularla nelle
rifiniture mirate del punto 5).

Baseline visiva: apps/genesi/baseline-3d-2026-07-19.png
(?demo=1&sim=1&simt=6 e simt=end su localhost per riprodurla).
