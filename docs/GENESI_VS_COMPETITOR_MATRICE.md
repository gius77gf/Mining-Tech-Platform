# Genesi vs concorrenza — confronto funzione per funzione (onesto)

Documento per Giuseppe. Confronto tra Genesi e i software concorrenti (Orica
ShotPlus/BlastIQ/OREPro/FRAGTrack, Maptek BlastLogic/PointStudio, Maxam RIOBLAST,
Strayos, O-Pitblast, Austin Paradigm, Hexagon MinePlan, Deswik, BMT, JKSimBlast),
con l'indicazione **onesta** di cosa si può inserire in Genesi (che gira nel
browser, senza backend, senza costi) e cosa no.

## Premessa importante (posizionamento)
**Nessun concorrente serio è "solo browser".** Sono software desktop Windows
(spesso con licenza/abbonamento), piattaforme cloud a pagamento, o hardware +
software. Il loro valore aggiunto più forte sta nella parte **misura** della
realtà (droni, sismografi, sensori sulle perforatrici, sensori di movimento del
banco, AI su dati reali) — ed è proprio la parte che **un'app browser non può
fare** senza quell'hardware/cloud. Genesi gioca su un altro terreno: **progettare,
simulare, visualizzare e stimare**, offline e a costo zero.

## Tabella di confronto
Legenda "fattibile browser": ✅ sì · 🟡 parziale (solo su dati importati/visione) ·
⛔ no (serve hardware/cloud/dati misurati/ML/database proprietari).

| Funzione | Chi ce l'ha | Genesi oggi | Fattibile browser | Azione |
|---|---|---|---|---|
| Schema fori (drill pattern) 3D | tutti | ✅ sì | ✅ | — già presente |
| Simulazione/animazione sequenza innesco | ShotPlus, JKSimBlast | ✅ sì (3D) | ✅ | — già presente (nostro punto forte) |
| Frammentazione Kuz-Ram/KCO/Swebrec + curva + fini | tutti | ✅ sì | ✅ | — già presente |
| Vibrazioni scaled-distance/PPV | ShotPlus, RIOBLAST, O-Pitblast | ✅ sì (Devine) | ✅ | — già presente |
| Flyrock + zone di sgombero | O-Pitblast, RIOBLAST, Hexagon | ✅ sì (diretto+inverso) | ✅ | — già presente |
| Rock factor (Lilly), fori bagnati, presplit | RIOBLAST, O-Pitblast | ✅ sì | ✅ | — già presente |
| Confronto A/B progetti | vari | ✅ sì | ✅ | — già presente |
| Riconciliazione previsto-vs-reale (input misure) | Maxam, BlastLogic | ✅ sì (curva + pannello) | ✅ | — già presente |
| Signature-hole (somma ritardata) | ShotPlus, Paradigm | ✅ sì (semplificato) | 🟡 | presente ma senza sismografo resta grezzo |
| Export dati / IREDES-like | Maptek/Vulcan | ✅ sì (CSV+XML import/export) | ✅ | — già presente |
| **Progettazione carica con DECKING (cariche multiple/foro)** | JKSimBlast, BlastLogic, tutti | ✅ **FATTO** (diagramma colonna + carica/deck + beneficio vibrazioni) | ✅ | ✅ inserito |
| **Stima costi / economia della volata** | JKSimBlast, O-Pitblast, MinePlan | ✅ **FATTO** (metri/kg/inneschi, €/m³, €/t, margine) | ✅ | ✅ inserito |
| **Report volata formattato/stampabile (PDF)** | Austin Global Blast Report, tutti | ✅ **FATTO** (report stampabile → PDF) | ✅ | ✅ inserito |
| Profilo fronte / point cloud / fotogrammetria | Maptek, Strayos | 🟡 mostra mesh importata | ⛔ cattura | serve **drone/laser** (import sì, cattura no) |
| MWD / integrazione perforatrici | BlastLogic, RIOBLAST | 🟡 import MWD | ⛔ | serve **hardware sui rig** |
| Deviazione fori reale (boretrack) | O-PitDev, Strayos | ❌ | ⛔ misura | serve **strumento** in foro |
| Frammentazione MISURATA da foto | FRAGTrack, Strayos | ❌ (misura assistita sì) | ⛔ auto | serve **ML pre-addestrato** (vedi doc dedicato) |
| Movimento banco / grade control (BMT/OREPro) | BMT, Orica, Hexagon | ❌ | ⛔ | serve **sensori + rilievo post-volata + block model** |
| Programmazione detonatori elettronici reali | ShotPlus, E*STAR | ❌ | ⛔ | serve **detonatori + logger** (hardware) |
| AI/ML "vero" (Strayos-like) | Strayos, FRAGTrack | ❌ | ⛔ | serve **modelli addestrati + dati reali + cloud** |
| Database reali esplosivi/detonatori | Orica, Maxam, Austin | 🟡 catalogo generico | ⛔ reali | i valori certificati sono **proprietari** dei produttori |

## Cosa ho INSERITO (le 3 lacune davvero fattibili in browser) — FATTO
1. **Decking** ✅ — 1/2/3 cariche nello stesso foro separate da borraggio intermedio;
   nella scheda un diagramma della colonna + lunghezza e carica per deck. Onesto:
   carica totale e powder factor invariati; se i deck sono su ritardi separati la
   carica per ritardo scende a ~kg/N → vibrazioni minori (la vista 3D resta semplificata).
2. **Stima costi / economia** ✅ — prezzi unitari inseriti dall'utente (perforazione €/m,
   esplosivo €/kg, innesco €/foro, opz. valore materiale €/t) → metri perforati, kg,
   inneschi, costo totale, costo €/m³ e €/t, e margine se dai il valore del materiale.
   Etichetta onesta: ordine di grandezza, non un preventivo (no manodopera/ammortamenti/oneri).
3. **Report volata formattato/stampabile** ✅ — bottone "Report volata (stampa/PDF)":
   documento con geometria, carica, sequenza, roccia, previsioni (frammentazione, PPV,
   flyrock, sgomberi) e stima economica, ognuno etichettato PREVISTO, + disclaimer.
   Via la stampa del browser si salva in PDF. Utile verso cliente/ente.

## Cosa NON inserisco (e perché — onestà)
Tutte le funzioni marcate ⛔ sopra: **non sono fattibili in un'app browser offline**
perché richiedono **hardware** (droni, sismografi, sensori MWD, detonatori, sensori
BMT), un **backend/cloud a pagamento**, **dati misurati sul campo**, un **modello ML
pre-addestrato**, o **database proprietari** dei produttori di esplosivi. Fingerle
sarebbe la gonfiatura che non vogliamo. Per due di queste (frammentazione da foto,
visore point-cloud) esistono già i documenti-decisione dedicati
(`GENESI_FRAMMENTAZIONE_DA_FOTO.md`, `GENESI_POINT_CLOUD.md`): un primo passo ONESTO
è possibile (misura assistita, visore base), ma non la parità coi leader.

## In una riga
Genesi, con le 3 aggiunte qui sopra, copre **tutto ciò che è tecnicamente
realizzabile in un'app browser** rispetto ai competitor. Il resto del loro vantaggio
è **misura della realtà** (hardware/cloud/dati/AI): non è un limite di codice, è un
limite fisico dell'essere un'app offline — e va comunicato con onestà, non promesso.
