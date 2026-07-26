# Genesi — fondamento scientifico dei modelli (bozza di lavoro, 23/07/2026)

Richiesta esplicita del fondatore (23/07): tracciare OGNI modello di Genesi alla sua
letteratura scientifica primaria — formula pubblicata, limiti di validità, critiche,
sviluppi moderni — e derivarne correzioni concrete.

**STATO DEL DOCUMENTO (agg. 24/07 notte)**: le aree CORE sono ora **verificate
sulle fonti** e confrontate col codice — ✅ vibrazioni USBM (curva Z letta dalla
figura originale), ✅ DIN 4150-3 (fatto strutturale multi-fonte), ✅ flyrock
(Richards & Moore / Lundborg / McKenzie), ✅ frammentazione (Swebrec/KCO e xP-frag
dagli abstract). Le voci ancora marcate **[NV]** sono minori e non bloccanti
(prefattore Sungun, range k di R&M, intercetta airblast, fori bagnati — tutti
minori; McKenzie verificato al 100%; frontiere DIN confermate multi-fonte). Le PROPOSTE DI CORREZIONE
alle soglie (sez. 4 e 4-bis) restano GATED sul fondatore.

---

## 1. Frammentazione — Kuz-Ram (Kuznetsov + Cunningham + Lilly)

**Fonti primarie da acquisire**: Kuznetsov (1973); Cunningham (1983, 1987, 2005 —
"The Kuz-Ram fragmentation model – 20 years on"); Lilly (1986, blastability index).

**Cosa dice la letteratura (raccolto, da verificare):**
- **[NV]** Il prefattore 0,06 del rock factor (A = 0,06·(RMD+JF+RDI+HF)) è
  **sito-dipendente**: alla miniera di rame di Sungun gli autori hanno dovuto
  sostituirlo con **0,073 (+22% circa)** per far combaciare l'x50 misurato — prova
  diretta che un Kuz-Ram non calibrato può essere sistematicamente sbagliato del
  ~20% o più. *(Gheibie et al., "Modified Kuz-Ram fragmentation model and its use
  at the Sungun Copper Mine")*
- **[NV]** L'indice di uniformità **n di Cunningham calcolato dalla sola geometria**
  (burden, spacing, diametro, lunghezza carica, precisione di perforazione) è
  **insufficiente**: serve una correzione per le proprietà dell'ammasso roccioso
  (Blastability Index). *(stessa fonte)*

**Implicazione per Genesi**: prevedere un **fattore di calibrazione di sito**
sull'x50 — e Genesi ha già lo strumento perfetto per stimarlo: la
**riconciliazione previsto-vs-reale** (l'x50 misurato sul muckpile può correggere
il prefattore, esattamente l'approccio Sungun). Da proporre al fondatore come
evoluzione naturale (il motore fisico non si tocca senza suo via libera).

## 2. Granulometria — Swebrec / KCO (Ouchterlony)

**Fonte primaria**: Ouchterlony (2005), "The Swebrec function…", *Mining
Technology*, DOI 10.1179/037178405X44539.

- ✅ **VERIFICATO (24/07, dall'abstract della fonte)**: la Swebrec è a **3
  parametri (x50, xmax, b)**, forma unica per volata E frantumazione — la nostra
  implementazione KCO traccia a questa fonte.
- ✅ **Range di validità verificato**: fit su centinaia di curve granulometriche
  VAGLIATE con correlazione **0,997 o migliore (r² > 0,995)** su **2–3 ordini di
  grandezza** di dimensione. → validata su ~2–3 decadi, NON illimitatamente nei
  fini: è il range da mostrare all'utente.
- ✅ **Verificato testualmente**: la Swebrec nel Kuz-Ram (= **modello KCO**, nome
  proposto nello stesso paper) "rimuove due dei suoi difetti: la scarsa capacità
  predittiva nei fini e l'assenza del taglio superiore alle pezzature". → la
  scelta già fatta in Genesi (KCO accanto a Kuz-Ram) è CONFERMATA dalla fonte.

## 3. Incertezza intrinseca — xP-frag (Sanchidrián & Ouchterlony)

**Fonte primaria**: Sanchidrián & Ouchterlony (2017), *Rock Mechanics and Rock
Engineering*, DOI 10.1007/s00603-016-1131-9.

- ✅ **VERIFICATO (24/07)**: xP-frag predice **direttamente i percentili dal 5°
  al 100°** senza assumere alcuna distribuzione ("distribution-free"); parametri
  calibrati su **169 volate a gradone reali** in siti e litologie diverse.
  Citazione esatta: *Rock Mechanics and Rock Engineering* **50: 781-806 (2017)**.
- ✅ **Errore atteso verificato: < 25% a qualunque percentile** (testuale). Il
  rapporto "metà-un terzo dei modelli preesistenti" (→ Kuz-Ram/KCO ~50-75%) resta
  inferenza dall'abstract, ragionevole ma da citare come tale.
- ✅ Il modello incorpora fattori di forma del gradone, rapporto
  resistenza/energia e scala; l'effetto del **ritardo** è parte del quadro
  (fragmentation-energy fan degli stessi autori).

**Implicazione per Genesi (onestà, priorità alta)**: dichiarare all'utente la
**banda d'incertezza** delle previsioni di frammentazione (ordine ±50% senza
calibrazione di sito). È coerente con la filosofia "stima onesta, non misura" e ci
distingue dai venditori di certezze. xP-frag stesso è un candidato "modello v2"
(pesante: da valutare col fondatore).

## 4. Vibrazioni — distanza scalata e limiti USBM — ✅ VERIFICATO (24/07 notte)

**Fonte verificata**: manuale tecnico SME/REVEY Associates ("Vibration and
Air-Overpressure", 2013) che riproduce la figura originale della curva Z e cita le
primarie: **Siskind, Stagg, Kopp, Dowding (1980), RI 8507, USBM**; **Siskind,
Stagg, Wiegand, Schultz (1993), RI 9523, USBM**; **Oriard (1970/72, Bulletin AEG
IX-1)**; Bauer & Caldwell (1971); Wiss & Parmalee (1974). Verifica fatta LEGGENDO
il PDF (pagg. 5-11), non da indice di ricerca.

- ✅ Forma standard **PPV = K·(D/√W)^m**, W = massima carica-per-ritardo:
  confermata, con K = "rock energy transfer constant" e m sempre negativo.
- ✅ **Inviluppo di Oriard confermato al numero**: per pendenza −1,6, K da **24 a
  605 imperiale (171–4316 metrico)**; pendenze tipiche **da −1,0 a −1,9**.
  → i K 1200–2800 / β 1,40–1,75 di Genesi sono DENTRO l'inviluppo. ✅
- ✅ **Curva Z di RI 8507 — punti esatti dalla figura originale**:
  - parte da **5,1 mm/s a 1 Hz** e sale lungo uno **spostamento costante ≈0,76 mm
    (0,030 in)** → PPV_lim ≈ **4,8·f mm/s** fino a incontrare il plateau;
  - plateau **12,7 mm/s** (intonaco su listelli) e **19,0 mm/s** (cartongesso)
    nella banda centrale (~4–12 Hz);
  - poi risale lungo lo **spostamento costante 0,2 mm (0,008 in)** → PPV_lim ≈
    **1,28·f mm/s** fino a 40 Hz;
  - da **40 Hz**: plateau **50,8 mm/s**. 
- ✅ **Validità**: SOLO crepe cosmetiche in case residenziali a telaio di legno
  (la rottura reale di intonaco/cartongesso in genere richiede **>100 mm/s**);
  mai intesa per cemento/acciaio/tubazioni (RI 9523: tubazioni interrate sicure
  fino a **127 mm/s**). Bonus verificato (Bauer & Caldwell 1971): la roccia
  intatta non si frattura sotto **254 mm/s**.
- ✅ **Scaling**: radice quadrata per cariche cilindriche in foro; **radice cubica**
  per cariche sferiche e per l'**airblast** (utile per la parte airblast di Genesi).

### ➜ CONFRONTO COL CODICE (verificato) e PROPOSTA DI CORREZIONE — GATED
`ppvLimit()` in genesi.html (righe 682-687) usa un gradino piatto: 12,7/19 sotto i
40 Hz, 50,8 sopra. Rispetto alla curva Z vera:
- **4–12 Hz**: combacia. ✅
- **≥40 Hz**: combacia. ✅
- **Sotto ~4 Hz**: Genesi è **MENO conservativo** della curva Z (es. a 2 Hz la
  curva vera dà ~9,6 mm/s, Genesi concede 19). È il caso di grandi distanze/terreni
  soffici (frequenze dominanti basse) → rilevante per SICUREZZA, anche se raro in
  cava a corto raggio.
- **12/15–40 Hz**: Genesi è PIÙ conservativo del necessario (a 30 Hz la curva vera
  concede ~38 mm/s, Genesi tiene 19): non pericoloso, ma sovra-restrittivo.
**Proposta pronta (attende via libera del fondatore — tocca soglie di sicurezza):**
sostituire i due rami USBM con la curva piecewise esatta:
`lim(f) = min(plateau, max(4.79*f, …))` ovvero — cartongesso:
`f<4 → 4.79*f; 4–15 → 19; 15–40 → 1.277*f; ≥40 → 50.8`; intonaco:
`f<2.65 → 4.79*f; 2.65–10 → 12.7; 10–40 → 1.277*f; ≥40 → 50.8` (mm/s).
Con nota UI: "curva USBM RI 8507 — valida per edifici residenziali (crepe
cosmetiche), non per strutture in c.a./acciaio". I rami DIN 4150-3 restano da
verificare a parte (non coperti da questa fonte).
- ✅ (parziale) **Carica-per-ritardo**: la finestra è convenzionale; Genesi usa 8 ms
  (prassi USBM/OSMRE comune) — coerente, la conferma normativa puntuale resta [NV].

**Implicazione per Genesi (sicurezza, priorità massima)**:
1. Verificare nel codice quali K/m usiamo e come li presentiamo: devono essere
   **dichiarati come valori tipici da calibrare in sito** (il signature-hole che
   già abbiamo è lo strumento giusto).
2. Nelle schermate dei limiti, precisare **a cosa si applica** la soglia (edifici
   residenziali vs altro).

## 5. Flyrock — ✅ VERIFICATO in larga parte (24/07 notte)

**Fonti**: Richards & Moore (2004, Terrock); Lundborg et al. (1975); McKenzie
(2009, SDOB); review moderna van der Walt & Spiteri (2020).

**Esito del confronto col codice (`flyrockEst`, righe 795-811): MOLTO BUONO.**
- ✅ **I 3 meccanismi di Richards & Moore confermati** (face burst dal fronte,
  cratering dal piano, rifling dal borraggio) e la **formula confermata**:
  L = (k²/g)·(√m/B)^2,6 — identica al codice (stesso esponente 2,6, m = carica
  lineare kg/m, cratering con lo stemming al posto del burden, rifling con
  sin(2θ)). La struttura di Genesi è quella pubblicata.
- ✅ **Tetto di Lundborg (1975) confermato**: Lm = 260·d^⅔ (d in POLLICI). Il
  codice usa 30,1·d^⅔ con d in mm = **conversione esatta** (260/25,4^⅔ = 30,14). ✓
- ✅ **McKenzie (2009) VERIFICATO AL 100%** (24/07): la formula pubblicata è
  **Range_max = 10 · SDOB^(−2,167) · Ø^0,667** (Ø in mm, SDOB in m/kg^⅓) —
  **identica al codice** di Genesi (coefficiente 10 ed entrambi gli esponenti).
  Anche la definizione di SDOB nel codice (borraggio + 5Ø sulla radice cubica
  della carica nei primi 10Ø) segue la convenzione standard (centro della carica
  di testa). Bonus dalla stessa fonte: esiste la formula gemella per la PEZZATURA
  del frammento (3,1·SDOB^−2,167·Ø^0,667·(2,6/ρ)) — possibile estensione futura.
  E la review 2020 giudica l'approccio SDOB **il più efficace** per la gittata.
- ✅ (parziale) **Fattori di sicurezza**: il fattore **×2** sulla gittata prevista è
  confermato come "minimo appropriato" nella prassi Terrock/R&M (con moltiplicatori
  separati mezzi/persone come input standard); il **×4 persone** usato da Genesi è
  prassi diffusa ma il valore esatto resta **[NV]** da fonte primaria. Essendo PIÙ
  conservativo, non è un rischio.
- **[NV]** Il range del **k** (13,5 tenero → 27 duro) mappato da Genesi sull'UCS è
  plausibile e coerente con l'uso Terrock, ma il range pubblicato preciso resta da
  verificare su Richards & Moore 2004.
- **Avvertenza di letteratura**: TUTTE le formule empiriche di flyrock hanno grande
  dispersione (è il motivo dei fattori di sicurezza e dell'avvertenza già presente
  in Genesi che vieta di usare la stima per definire le aree di sgombero reali —
  scelta CORRETTA e da mantenere).

## 4-bis. DIN 4150-3 — ✅ VERIFICATO il fatto strutturale (24/07 notte)

**Fonti**: convergenza multi-fonte (Micromega Dynamics, Oculus Monitoring, ISSMGE
TC203, tabelle riprodotte in letteratura) — i PDF integrali erano inaccessibili
stanotte, quindi i NUMERI di frontiera vanno ri-confermati sul testo della norma,
ma il fatto chiave è confermato da più fonti indipendenti:
- ✅ La Tabella 1 di DIN 4150-3 (breve durata, in fondazione) dà limiti **in
  funzione della frequenza** per 3 classi (industriale / residenziale / sensibile),
  con range **20→50 / 5→20 / 3→10 mm/s** — che combaciano coi valori di frontiera
  usati da Genesi;
- ✅ **I valori intermedi si calcolano per INTERPOLAZIONE LINEARE** dentro le
  bande (10–50 Hz e 50–100 Hz): la norma è una rampa, NON un gradino.

### ➜ CONFRONTO COL CODICE: stessa semplificazione del caso USBM
`ppvLimit()` applica il valore di FINE banda a tutta la banda (es. residenziale:
f<50 → 15 mm/s). Rispetto alla rampa DIN: a **20 Hz** la norma interpolata dà
**≈7,5 mm/s**, Genesi concede **15** → **meno conservativo fino a ~2×** nella
parte bassa delle bande (11–30 Hz, che è proprio la banda tipica delle volate a
media distanza). Sopra i 100 Hz e ai bordi banda combacia.
**Proposta pronta (stessa decisione del punto USBM — attende via libera):**
`function dinInterp(f,v10,v50,v100){ if(f<=10)return v10; if(f<=50)return
v10+(v50-v10)*(f-10)/40; if(f<=100)return v50+(v100-v50)*(f-50)/50; return v100; }`
con (5,15,20) residenziale, (20,40,50) industriale, (3,8,10) sensibile — la
struttura esatta della norma. **Livello di conferma dei sei numeri di frontiera:
ALTO** (24/07: 5+ fonti indipendenti concordi su valori e bande — ResearchGate
"Table 1 DIN 4150-3", Svantek, Micromega, Oculus, ISSMGE; il testo integrale della
norma resta non accessibile, quindi non "letto in originale" ma la convergenza è
completa e i valori coincidono con quelli già in Genesi).

## 6. Airblast — ✅ VERIFICATO in struttura (24/07 mattina)

**Fonte primaria**: Siskind, Stachura, Stagg & Kopp (1980), USBM **RI 8485** (lo
studio che abbassò i limiti dal precedente 140 dB ai livelli attuali).

**Confronto col codice** (`_db = 172 − 24·log10(SD³)`, limite 133 dB(L)):
- ✅ **Scaling a radice cubica** per l'airblast: confermato (due fonti indipendenti).
- ✅ **Pendenza −24 dB/decade** = esponente −1,2: la forma standard USBM
  (dB lineare in log(SD) è la relazione canonica di RI 8485).
- ✅ **Limite 133 dB(L)**: è il valore regolatorio OSM per i sistemi di misura più
  comuni (2 Hz high-pass); la scala completa OSM/RI 8485 è 134 (0,1 Hz) / 133
  (2 Hz) / 129 dB (5-6 Hz) a seconda dello strumento. La scelta di Genesi è quella
  standard; la fascia warn 128-133 è prudente.
- **[NV]** L'**intercetta 172** (metrico): plausibile e nell'ordine delle equazioni
  pubblicate per volate da fronte, ma non pinnata a una specifica regressione
  pubblicata → correttamente il codice la presenta già come "stima da calibrare".
  Da pinnare quando la fonte integrale sarà accessibile.

## 5-bis. Aree ancora da completare
- **Fori bagnati / decoupling / decking**: non ancora coperti dalla letteratura
  (la fisica implementata resta dichiarata come stima).
- **Numeri di frontiera DIN** da ri-confermare sul testo della norma (sez. 4-bis).
- **Intercetta airblast 172** da pinnare (sez. 6).

## 6. Prossimi passi (ordine)
1. **Verificare i claim [NV]** aprendo le fonti (dopo il reset del limite).
2. **Confronto formula-per-formula col codice** di `genesi.html` (esponenti,
   coefficienti, unità): certificare dove combacia, segnalare dove no.
3. **Completare flyrock/airblast/fori bagnati** (ricerca dedicata).
4. **Elenco correzioni per il fondatore**, ordinato per sicurezza (flyrock e
   vibrazioni prima). Il motore fisico si tocca SOLO col suo via libera.

## Prima verifica LOCALE codice-vs-letteratura (23/07 sera — vibrazioni)

Fatta subito, senza rete, confrontando `genesi.html` con i valori raccolti:

**Coerenze trovate (buone notizie):**
- La formula è la **scaled distance canonica**: `PPV = K·(D/√MIC)^−β` (riga ~1882),
  con **MIC su finestra 8 ms** raggruppando i tempi reali dei fori (riga 689) —
  combacia con la convenzione standard di carica-per-ritardo [NV].
- `ppvSite()` (riga 680): **K 1200–2800 (metrico), β 1,40–1,75** derivati dalla
  litologia — DENTRO l'inviluppo di Oriard raccolto (K 171–4316, β 1,0–1,9) [NV],
  e il commento nel codice dichiara già "K conservativo/upper-bound, STIMA — da
  calibrare con monitoraggio reale". Onestà già presente.
- `ppvLimit()` (righe 682-687): le soglie USBM combaciano con gli ancoraggi
  raccolti di RI 8507: **12,7 mm/s** (intonaco) e **19 mm/s** (cartongesso) sotto
  i 40 Hz, **50,8 mm/s** da 40 Hz in su [NV]. E i limiti sono già presentati **per
  tipo di edificio** (DIN res/ind/sensibile, USBM intonaco/cartongesso), NON come
  soglia universale — proprio ciò che la letteratura raccomanda.

**Discrepanza candidata — ✅ CONFERMATA il 24/07 leggendo la figura originale di
RI 8507** (vedi sezione 4: sotto ~4 Hz Genesi è meno conservativo; tra 15 e 40 Hz
è sovra-restrittivo). Proposta di correzione piecewise esatta pronta in sezione 4,
**in attesa del via libera del fondatore** (tocca soglie di sicurezza).

## Fonti raccolte (da riverificare aprendole)
- Gheibie et al. — *Modified Kuz-Ram fragmentation model and its use at the Sungun
  Copper Mine* (via ResearchGate).
- Ouchterlony 2005 — *Mining Technology*, DOI 10.1179/037178405X44539 (Swebrec).
- Sanchidrián & Ouchterlony 2017 — *Rock Mech Rock Eng*, DOI 10.1007/s00603-016-1131-9 (xP-frag).
- SME (2013) — *Vibration and air-overpressure handout* (sintesi USBM RI 8507/8485,
  Oriard) — fonte secondaria autorevole, utile come indice delle primarie.

Nota di processo: un sotto-agente della ricerca è stato segnalato dal sistema per
aver letto file di configurazione dell'ambiente durante un errore di rete; il suo
output NON è stato usato (la sua fetch era fallita). Nessun dato di questo documento
proviene da quel percorso.
