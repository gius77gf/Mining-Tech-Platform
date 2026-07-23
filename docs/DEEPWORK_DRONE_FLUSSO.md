# Deepwork — flusso drone → nuvola di punti → volata (analisi onesta)

Documento per Giuseppe. Consolida la discussione sulla direzione: usare un **drone
economico** (DJI Mini) per rilevare la cava, generare una **nuvola di punti** con
**OpenDroneMap (ODM)**, conservarla in **Terra** e lavorarla in **Genesi** per
progettare/simulare le volate — restando **indipendenti da servizi esterni** e
**senza spese finché non si commercializza**.

## Filosofia (la tua, giusta)
Deepwork NON insegue la qualità dei leader: offre servizi **simili, meno precisi,
più economici**. Questo è un vantaggio, non un limite: Genesi è già uno strumento di
**stima/simulazione**, non di misura certificata. Quindi una nuvola "discreta" da un
drone consumer (senza GPS di precisione RTK) è **coerente** col ruolo di Genesi: per
progettare una volata serve la **forma del fronte e il burden approssimativo**, non
la precisione al centimetro.

## Il flusso completo e la divisione dei compiti
```
DJI Mini (foto)  →  ODM (foto → nuvola)  →  Terra (conserva/gestisce)  →  Genesi (progetta la volata)
   hardware tuo      calcolo pesante,          browser, gratis              browser, gratis
                     su MACCHINA NOSTRA
```
- **Il pezzo pesante è UNO SOLO**: foto → nuvola (fotogrammetria). Richiede potenza di
  calcolo. NON si può fare nel browser (troppo pesante, nessuna libreria matura oggi),
  e non ha senso riscriverlo: **ODM esiste già ed è gratis/open source**.
- **Tutto il resto (Terra, Genesi) è browser, gratis, nostro.**

## Indipendenza da enti esterni — SÌ, così
Non serve il servizio ODM online a pagamento (i crediti prova che hai usato). ODM è
**software libero fatto apposta per essere installato su una macchina tua** (WebODM,
gira in Docker). Il calcolo pesante non sparisce (è fisica: elaborare 100 foto costa
potenza), ma passa da "**lo affitto**" a "**ce l'ho io, gratis**".

## Dove far girare ODM — opzioni e costi (indicativi, da verificare)
Concetto chiave: la fotogrammetria è un lavoro **a lotti** — la potenza serve **solo
durante l'elaborazione** (minuti per volata), non 24/7. Quindi si paga (se si paga)
solo l'uso.

**GRATIS (giuste per ora — nessuna spesa):**
- **Il tuo PC** — WebODM in locale. Zero costo, zero dipendenza. Ideale per iniziare.
- **Google Colab / Kaggle** — potenza gratis (12–30 GB RAM), "a sessione" (dura poche
  ore, poi si scollega). Perfetto per **provare**, non per un servizio sempre pronto.
- **Oracle Cloud "Always Free"** — ~24 GB RAM ARM, gratis e sempre acceso: il più
  vicino a un "server gratis" vero. Cavilli: architettura ARM (ODM va configurato),
  installazione manuale, disponibilità gratuita a volte limitata.

**ECONOMICHE (quando serve stabilità, in commercializzazione):**
- **VPS economico** (Hetzner/Contabo/OVH): ~5–15 €/mese, sempre acceso.
- **Cloud a consumo** (accendi → elabori → spegni): **pochi centesimi/€ a volata** se
  l'uso è saltuario — spesso più economico del canone. Probabilmente la scelta più furba.

**Regola "no spesa ora":** validare tutto sul tuo PC o su un free-tier; il costo
(piccolo, a consumo) arriva solo in commercializzazione e si **gira sul prezzo al
cliente** (la cava paga il servizio, tu paghi centesimi di calcolo).

## Cosa posso costruire io (browser, gratis, senza enti esterni)
1. **Caricatore della nuvola di punti** in Genesi/Terra: apre il file esportato da
   ODM (PLY, XYZ, o LAS/LAZ) e lo mostra in 3D (Three.js, già presente). ✅
2. **Alleggerimento automatico** (downsample) se la nuvola è troppo densa per il
   browser. ✅
3. **Ritaglio/orientamento del fronte**: l'operatore indica la faccia della cava →
   Genesi ne estrae un **profilo/superficie** (semi-manuale = onesto). ✅
4. **Aggancio al motore volata**: la nuvola diventa la base reale del fronte, e da lì
   parte la **simulazione 3D** che Genesi già fa. ✅
5. **Ponte Terra→Genesi**: Terra conserva la nuvola del rilievo, Genesi la richiama
   per la volata. ✅

## I limiti onesti (da non nascondere)
- **Scala assoluta** da drone consumer (no RTK/punti di controllo a terra): la
  geometria relativa (forma del fronte) è buona; la scala esatta è approssimativa.
  Ottima per **progettare**, NON per un "consuntivo volumi certificato".
- **RAM**: il consumo di ODM dipende da **quante foto** e a che risoluzione. Rilievi
  piccoli entrano nel gratis; rilievi grandi vogliono più RAM/tempo (ODM ha
  impostazioni per ridurre — coerente con "meno preciso, più economico").
- **Formati**: il visore ora legge **direttamente il LAS** (è il formato con cui ODM
  esporta la nuvola: `odm_georeferenced_model.las`), oltre a **PLY** e **XYZ**. Il
  **LAZ** (la stessa nuvola ma compressa) va prima riesportato in LAS o PLY (in
  WebODM/CloudCompare "Salva con nome") — il decompressore LAZ nel browser sarebbe
  pesante e per ora non serve.
- **Free a sessione** (Colab): non è "produzione" affidabile (si scollega) — va bene
  per validare e per l'uso saltuario di adesso.

## Percorso a passi concreti
1. **[software, io, gratis]** Caricatore + visualizzatore nuvola in Genesi/Terra →
   tu provi con la TUA nuvola del DJI. È il primo pezzo "nostro" del flusso.
2. **[software, io]** Ritaglio fronte + estrazione profilo → aggancio alla volata.
3. **[tu, gratis]** WebODM sul tuo PC per generare le nuvole (o free-tier per provare).
4. **[commercializzazione]** ODM su cloud a consumo/VPS, costo girato sul cliente.

## Decisioni tue
- Da quale formato partire per il caricatore (che file ti dà il tuo WebODM: PLY? LAS/LAZ? XYZ?).
- Se vuoi che parta subito con il **passo 1** (caricatore/visualizzatore nuvola).
- Quale ambiente ODM preferisci provare per primo (tuo PC / Colab / Oracle Free).

## Prova pratica del weekend (passo-passo)
Per verificare il flusso a costo zero, col tuo DJI Mini:
1. **Scatta le foto** del fronte col drone (tante, sovrapposte tra loro ~70%).
2. **Genera il 3D senza usare il tuo PC**: apri **Google Colab** o una **Space di
   Hugging Face** (gratis, dal browser) con WebODM/una demo di fotogrammetria;
   carica le foto → ottieni la **nuvola** (LAS/PLY/XYZ) e/o la **mesh** (OBJ).
3. **Caricalo in Genesi**: apri il deploy-preview di #321 + `/apps/genesi/nuvola-poc.html`,
   premi **"Carica 3D"** e scegli il file. Va bene il **`.las`** che ti dà ODM
   (o PLY/XYZ per la nuvola, OBJ/GLB per la mesh) — il visore li apre direttamente.
4. **Isola il fronte**: coi 3 cursori (larghezza/altezza/profondità) stringi il box
   finché resta solo la faccia della cava; controlla le **dimensioni** (in metri).
5. **Esporta** il fronte ritagliato (.xyz) — servirà per l'aggancio alla volata (passo 3).
Note: il POC gestisce nuvole grandi (downsample automatico) e coordinate
georeferenziate (UTM) senza perdere precisione. Il **`.las`** di ODM si carica
così com'è; solo se ti ritrovi un **`.laz`** (compresso) va prima riesportato in
LAS o PLY. Poi dimmi com'è andata: costruisco l'aggancio alla
simulazione volata sui tuoi dati veri.

## Collegati
- `docs/GENESI_POINT_CLOUD.md` — dettaglio tecnico del visore point-cloud in Genesi.
- `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md` — l'altra idea da foto (frammentazione), più difficile (serve ML).
- `docs/GENESI_VS_COMPETITOR_MATRICE.md` — dove Genesi sta rispetto ai competitor.
