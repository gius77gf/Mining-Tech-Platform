# Genesi fuori dal browser — che cosa vuol dire, misurato

**Verificato contro il commit `838530fd`** (02/09/2026). Cantiere di sola
misura: nessun file di prodotto toccato. Ogni «non c'è» porta il comando che
l'ha cercato e la sua uscita. Le stime sono dichiarate stime.

> Per Giuseppe, in tre righe. Oggi tutto quello che Genesi produce — volate
> salvate, confronti A/B, riconciliazioni dopo lo sparo, legge di sito — vive
> **nel browser del computer** su cui è stata usata. Un collega non lo vede,
> un telefono non lo vede, e se si cancella la cronologia sparisce. Questo
> documento misura **quanto** è quel dato, **da dove passa** oggi (file), e
> **quanto costa** portarlo nei dati dell'organizzazione come fanno le altre
> app. Il piano in fondo è a unità piccole: la prima non cambia niente per chi
> usa Genesi oggi.

---

## 0. Il punto di partenza (che cosa dice già la mappa, e dove sbagliava)

`docs/MAPPA_ECOSISTEMA.md` §4 dice: Genesi non usa `orgCollection`, i dati
stanno in `localStorage` «con quattro chiavi». La prima metà è vera alla cifra:

    $ for f in genesi.html genesi-data.js pointcloud.js genesi-formato.js genesi-sw.js login.html nuvola-poc.html; do
        echo "$f orgCollection=$(grep -c orgCollection apps/genesi/$f) DeepworkID=$(grep -c DeepworkID apps/genesi/$f)"; done
    genesi.html orgCollection=0 DeepworkID=0
    genesi-data.js orgCollection=0 DeepworkID=0
    pointcloud.js orgCollection=0 DeepworkID=0
    genesi-formato.js orgCollection=0 DeepworkID=0
    genesi-sw.js orgCollection=0 DeepworkID=0
    login.html orgCollection=0 DeepworkID=0
    nuvola-poc.html orgCollection=0 DeepworkID=0

⚠️ La seconda metà — «quattro chiavi» — **è sotto di più del doppio**. Il
comando della mappa cerca la forma letterale `localStorage.getItem('…')`, e
Genesi scrive tre chiavi su nove **attraverso un alias** (`_lsGet('genesiVolate')`)
o **per concatenazione** (`'genesiCmp'+slot`). Cioè un censimento che cerca una
forma di scrittura, con la stessa faccia con cui direbbe la verità. Il conto
vero è nella tabella del §1: **9 chiavi**, di cui 8 in `genesi.html` e una
(`genesiNuvole`) scritta da `nuvola-poc.html` e letta da Genesi **e da Terra**.

---

## 1. Il censimento delle chiavi

### 1a. Il comando e le righe

    $ grep -nE "localStorage|sessionStorage|indexedDB" apps/genesi/*.html apps/genesi/*.js
    genesi.html:1300   sitoStore()        getItem('genesiSito')
    genesi.html:1303   sitoSalva(s)       setItem('genesiSito', …)
    genesi.html:3310   cmpSave(slot)      setItem('genesiCmp'+slot, …)        ← A oppure B
    genesi.html:3313   _cmpLoad(k)        getItem(k)                           ← 'genesiCmpA' / 'genesiCmpB'
    genesi.html:3771   riconStorico()     getItem('genesiRicon')
    genesi.html:3996   (salva riconc.)    setItem('genesiRicon', …)
    genesi.html:4543   _sentStore()       getItem('genesiSent')
    genesi.html:4544   _sentSave(o)       setItem('genesiSent', …)
    genesi.html:4727   maybeConsent()     getItem('genesiDisclaimerV1')
    genesi.html:4729   consensoOk.onclick setItem('genesiDisclaimerV1','1')
    genesi.html:4788   _lsGet(k)          getItem(k)                           ← 'genesiVolate', 'genesiNuvole'
    genesi.html:4789   _lsSet(k,v)        setItem(k, …)                        ← 'genesiVolate'
    nuvola-poc.html:194/197/300/337       get/setItem('genesiNuvole')
    (le altre 14 righe trovate dal grep sono COMMENTI che raccontano queste)

    $ grep -c sessionStorage apps/genesi/*.html apps/genesi/*.js | grep -v ":0"     → nessuna riga
    $ grep -c indexedDB      apps/genesi/*.html apps/genesi/*.js | grep -v ":0"     → nessuna riga
    $ grep -c removeItem     apps/genesi/genesi.html                                → 0

Quindi: **solo `localStorage`**, nessun `sessionStorage`, nessun `IndexedDB`,
nessuna cancellazione di chiave (gli storici si accorciano dall'inizio con
`shift()`, mai si azzerano). Il service worker (`genesi-sw.js`) usa la **Cache
Storage** per HTML, `vendor/` e i due `.json` di catalogo: **non tocca dati
dell'utente** (già scritto in `docs/AUDIT_ISOLAMENTO_APP.md`, riga 43).

### 1b. La tabella

Peso **misurato in Chromium** (Playwright, pagina servita da un server locale,
`localStorage` azzerato, poi «Salva come A», «Salva come B», «Salva la volata
attuale»): unità = caratteri UTF-16 di `getItem(k).length`, che per testo ASCII
sono byte.

    chiavi prima: []
    chiavi dopo: {"genesiDisclaimerV1":1,"genesiCmpA":1130,"genesiCmpB":1130,"genesiVolate":561}
    volate salvate: 1 · chiavi record: ["id","nome","data","design","sintesi"] · chiavi design: 32
    chiavi snapshot A/B: ["ts","kpi","design"] · campi kpi: 33
    errori di pagina: 1 ['console: Failed to load resource: net::ERR_CONNECTION_RESET']   ← una risorsa esterna, non un errore di script

| chiave | chi scrive | chi legge | forma (dal codice che la scrive) | tetto | peso | tipo |
|---|---|---|---|---|---|---|
| `genesiVolate` | `salvaVolata` (4883), duplica (4912), elimina (4907) | `renderHome`, apri (4914: `Object.assign(D2, design)`) | array di `{id:'v'+Date.now(), nome, data, design:{32 campi di D2}, sintesi}` | **50** (`while(arr.length>50) arr.shift()`) | **561** per volata → 50 volate ≈ **28 KB** | **LAVORO** |
| `genesiCmpA` / `genesiCmpB` | `cmpSave(slot)` (3310) | `cmpRender`, `cmpExport` (3335, 3717) | `{ts, kpi:{33 campi}, design:{…}}` | 1 per slot | **1.130** l'uno | **LAVORO** (due progetti a confronto) |
| `genesiRicon` | salvataggio riconciliazione (3996) | `riconStorico()` ×3 (3880, 4003) | array di `{ts, nome, prev:{x50,ppv,fly,ppvBase}, real:{x50,ppv,fly,ovs,note}, campo?:{14 campi del consuntivo di Campo}}` | **nessuno** (`st.push` senza `shift`, misurato: riga 3996 non contiene `length>`) | stima ≈ 250–700 per riga | **LAVORO** (storico dopo lo sparo) |
| `genesiSito` | `sitoSalva` (1303), punti da mano (4384) e da CSV (4461) | `sitoStore/sitoLegge` → `ppvSite()` → **tutti i calcoli PPV** | `{punti:[{d, w, ppv, nome, ts, fonte:'mano'|'csv'}], usa:boolean}` | **nessuno** | stima ≈ 80 per punto | **LAVORO** (legge di sito: cambia i numeri della volata) |
| `genesiNuvole` | `nuvola-poc.html` (197, 337) | Genesi `renderHome` (4856) **e Terra** `btn-dal-drone` (`apps/terra/index.html:4465`) | array di `{nome, puntiMostrati, puntiTotali, data, volume?, puntiRitaglio?, calcolo?:{cella, quotaBase, areaCoperta, celle, georeferenziato, ritaglio:{x0,x1,y0,y1,z0,z1}}}` | **30** | stima ≈ 300–500 per lavorazione; **la nuvola NON c'è** (vedi 1c) | **LAVORO** (metadati del rilievo: volume e come è stato ottenuto) |
| `genesiSent` | `_sentSave` (4697, 4722) | `sentRender` (4648) | `{data, fronte}` — ultima data e fronte scritti nel modulo «Manda a Sentinella» | 1 | ≈ 60 | **PREFERENZA** (memoria del modulo) |
| `genesiDisclaimerV1` | consenso (4729) | `maybeConsent` (4727) | `'1'` | 1 | **1** | **PREFERENZA** |

Non ci sono chiavi per «ultima scheda aperta» o «tema»: i due contatori di
preferenza sono quelli in tabella. Nelle altre app le preferenze stanno in
`localStorage` allo stesso modo (misurato: `dwSort_ril` in Terra, `dwSort_fat`
in Conti, `campoIo`+`dwSort_att` in Campo, sei `dwFlotta*` in Flotta) mentre il
lavoro passa da `orgCollection`. Il confine LAVORO/PREFERENZA di questa tabella
segue lo stesso criterio.

### 1c. Quanto pesa una nuvola di punti — e dove NON sta

`pointcloud.js` tiene al massimo `MAXPTS = 700000` punti (riga 8) e
sottocampiona sopra (`step = ceil(total/maxpts)`, righe 22, 56, 106); una
nuvola è `{count, pos:[x,y,z,…], col?, total, step}` con `pos` array di numeri.

    $ node -e '…700000 punti × 3 coordinate a 3 decimali…'
    punti 700000 numeri 2100000 JSON byte 16333964 MB 15.6 — Float32 grezzo MB 8.0

    $ (Chromium, pagina locale) riempio localStorage a blocchi da 64 K finché rifiuta
    {"blocchi":79,"byteCodeUnit":5177344,"mb":"4.94","errore":"QuotaExceededError"}

Quindi una nuvola a tetto pesa **8 MB grezzi / 15,6 MB in JSON** e la quota di
`localStorage` misurata è **4,94 MB**: la nuvola in `localStorage` **non ci
può stare**, e infatti non ci sta. Il codice lo conferma: `genesiNuvole`
salva **solo i metadati** (nome, conteggi, volume, parametri del calcolo); la
nuvola vive in memoria in `nuvola-poc.html` finché la scheda è aperta, e il
ritaglio si esporta come file. È una scelta già fatta, non una mancanza — e
vale identica per Firestore (§4).

Il lavoro **totale** oggi in `localStorage`, con i tetti pieni: 50 volate
(28 KB) + 2 snapshot (2,3 KB) + 30 lavorazioni (≈ 15 KB) + riconciliazioni e
punti di sito senza tetto (in un uso reale: decine, non migliaia). **Ordine di
grandezza: decine di KB.** È un dato piccolo: la difficoltà non è il volume.

---

## 2. Il legame con i file: il ponte che esiste già

`docs/MAPPA_ECOSISTEMA.md` §1 e §3e censiscono **un** ponte di file
(Genesi→Sentinella). Aprendo il codice sono **di più**.

### 2a. Che cosa esce da Genesi

    $ grep -noE "download ?= ?[^;]{0,120}" apps/genesi/genesi.html
    3020: 'Volata_'+numero+'_'+data+'.volata.json'
    3530: 'genesi_scheda_volata.csv'
    3762: 'genesi_confronto_AB.csv'
    4007: 'genesi_riconciliazione.csv'
    4168: 'genesi_composito_'+_pezzo+'.csv'
    4498: 'genesi_legge_di_sito.csv'
    4721: 'genesi_volata_per_sentinella_'+data+'.csv'
    4983: 'genesi_piano_carico.csv'
    5014: 'genesi_piano_innesco.xml'
    (Blob: 1 — solo il .volata.json; gli 8 CSV/XML escono come data: URL con encodeURIComponent)

### 2b. Che cosa entra in Genesi

    $ grep -nE "type=\"file\"" apps/genesi/genesi.html
    740  fileXmlIn        .xml            → piano d'innesco (BlastPlan), lo stesso XML che esporta
    749  sigFile          .csv/.txt       → curva granulometrica (setacci)
    751  sitoFile         .csv/.txt       → referti PPV per la legge di sito (distanza, carica, PPV)
    773  riconCampoFile   .csv/.txt       → consuntivo di carico da Campo (_riconParseCampo)
    871  fileIn           .json           → .volata.json (busta {schemaV, tipo, volata, sim} o volata nuda)
    872  meshIn           .glb/.gltf/.obj → fronte 3D (drone)
    (nuvola-poc.html legge inoltre XYZ/PLY/LAS via pointcloud.js)

### 2c. Chi sta dall'altra parte — provato, non dedotto

| file | verso | l'altro capo | prova |
|---|---|---|---|
| `genesi_volata_per_sentinella_*.csv` | Genesi → Sentinella | `parseVolateCsv` (`sentinella-data.js:1014`); intestazione `CSV_VOLATE_INTESTAZIONE` con il commento «Genesi scrive queste stesse colonne» (3993) | `grep -n "Genesi" apps/sentinella/sentinella-data.js` → 6 righe, fra cui `ppvPrevFonte: /^genesi/.test(fonte)` (3771) |
| `genesi_piano_carico.csv` | Genesi → Campo | `parsePianoCsv` / `mappaPianoCsv` / `scartiPianoCsv` (`campo-data.js:2543-2597`); commento riga 42 «piano di carico volata importato da CSV, ponte Genesi» | `grep -nic genesi apps/campo/campo-data.js` → 10 |
| consuntivo di Campo | Campo → Genesi | `pianoConsuntivoCsv` (`campo-data.js:2824`, «Il consuntivo che torna a Genesi») → `riconCampoFile` in Genesi | idem |
| `genesiNuvole` (chiave, non file) | Genesi → Terra | `apps/terra/index.html:4465` legge la chiave e precompila il rilievo («il flusso drone→Terra chiuso») | `grep -n genesiNuvole apps/terra/index.html` → 1 |
| `*.volata.json` | Genesi ↔ «gestionale Deepwork» (testo della Home, riga 624) | **non trovato nel core con questi comandi** | `grep -nE "schemaV\|volata-deepwork\|application/json" index.html` → 0 righe; `grep -nE 'accept="[^"]*json' index.html` → 0; i sei `input type=file` del core (righe 1357, 2845, 3725, 4920, 6799, 6970) leggono foto, documenti, foto in chat, splat, foto, **CSV MWD** — nessuno un JSON di volata; `grep -ci genesi index.html` → 3, tutte commenti |
| `genesi_piano_innesco.xml` | Genesi → Genesi (e fuori) | lo rilegge `fileXmlIn` (5034); il destinatario esterno non è scritto nel codice | `grep -n xmlPianoInnesco apps/genesi/genesi-data.js` → 890 |

⚠️ Sul `.volata.json`: la nota dentro `esempio-fronte-cava.volata.json` dice
«dimostrare l'import in Deepwork Replica». Con `grep` nel core di oggi quel
lato **non si trova**. Non dico che non è mai esistito: dico che il commit
`838530fd` non contiene chi lo legge. È un dato da tenere nel piano (§5): il
formato busta `{schemaV, tipo, volata:{id, sitoId, tipo, numero, data, fronte,
geometria, default, fori, connessioni}, sim}` è **già lo schema di scambio di
una volata**, e vale come punto di partenza per il documento Firestore.

⛔ Il file di esempio contiene valori numerici di maglia e ritardi: qui si
cita **solo la struttura**, non i numeri, per la regola sui dati di riferimento.

### 2d. Che cosa vuol dire

Genesi ha già **quattro** scambi vivi (Sentinella, Campo nei due versi, Terra)
e tutti passano da un file o da una chiave del **browser** — cioè da una
persona che esporta e importa, o dallo stesso computer. Il ponte con Terra è
il caso limite: funziona **solo** se Terra e il visore nuvola sono aperti nello
stesso browser, e la mappa lo conta a zero perché non è né `orgCollection` né
`dw-ponti`. Portare i dati di Genesi nell'organizzazione non crea questi ponti:
**li fa smettere di dipendere dal computer**.

---

## 3. Il modello di riferimento: come Terra e Conti tengono i dati

### 3a. La forma (misurata su `terra-data.js:2159-2240`, identica in `conti-data.js:2982`)

    export async function terraData() {
      let mode = "demo", api = null;
      try {
        const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
        const id = await DeepworkID.init({ appId: "terra" });
        if (id.user && id.authState() === "member") {
          const { getDocs, addDoc, updateDoc, deleteDoc, doc, deleteField } =
            await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
          mode = "live";
          const read = async (name) => (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
          api = { fronti: () => read("fronti"), rilievi: () => read("rilievi"), …,
                  aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
                  aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), …),
                  rimuovi:  (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)) };
          // ponte di sola lettura verso un'altra app: seconda istanza SDK, pigra
          api.rapportiniCampo = async () => { … DeepworkID.init({ appId: "campo" }) … orgCollection("rapportini") … };
        } else if (id.authState() === "tour") mode = "tour";
      } catch (e) { /* backend assente: demo */ }
      if (mode !== "live") { const mem = JSON.parse(JSON.stringify(DEMO)); api = { …in memoria… }; }
      return { mode, ...api };
    }

Tre cose che contano per Genesi:

1. **La stessa interfaccia nei due modi**: la pagina chiama `db.volate()`,
   `db.aggiungi('volate', …)` e non sa se sotto c'è Firestore o la memoria
   (`apps/terra/index.html:1139-1152` legge solo `db.mode` per il banner).
2. **La modalità non-live delle altre app è in memoria e NON persiste**:
   ricaricando la pagina in dimostrazione si perde tutto. Genesi oggi fa il
   contrario — persiste **senza account**. La sua modalità «locale» deve
   restare persistente, se no chi la usa oggi perde le volate: è la ragione
   per cui l'unità 1 del piano è `localStorage` dietro l'interfaccia, non
   «memoria come le altre».
3. **Il ponte verso un'altra app è una seconda istanza SDK**, mai un percorso
   scritto a mano: questo è il modo con cui Terra leggerà le nuvole di Genesi
   (unità 8), al posto della chiave del browser.

### 3b. Le funzioni che servirebbero a Genesi

Una `genesiData()` in `genesi-data.js` con `{ mode, volate, confronti,
riconciliazioni, sito, nuvole, aggiungi, aggiorna, rimuovi, logout }`. Le
otto funzioni della pagina che parlano con `localStorage` — `sitoStore`,
`sitoSalva`, `cmpSave`, `_cmpLoad`, `riconStorico`, `_sentStore`, `_sentSave`,
`_lsGet/_lsSet` — sono esattamente una parte delle «16 che toccano l'ambiente
del browser» che `genesi-estraibili.mjs` dichiara: si sostituiscono con
chiamate a `db`, non si estraggono.

    $ node apps/deepwork-id/tests/genesi-estraibili.mjs | tail -6
      16 idem, ma toccano l'AMBIENTE del browser (DOM ricevuto, tela, THREE, localStorage): restano
      59 ne leggono una o due: si portano fuori passandogliela
      33 ne leggono più di dieci: lì è un rifacimento, non un trasloco
    ⛔ E il numero che conta non è 170: è 66 — …

### 3c. Le collezioni che nascerebbero

Sotto `organizations/{org}/apps/genesi/…` (il percorso lo costruisce
`orgCollection`, `shared/deepwork-id-client/index.js:227-231`; il costruttore
dell'SDK cita già `'genesi'` come `appId` possibile, riga 45):

| collezione | da quale chiave | un documento = | peso doc (misurato/stimato) | note |
|---|---|---|---|---|
| `volate` | `genesiVolate` | una volata salvata `{nome, data, design, sintesi}` | **561 B** | tetto «ultime 50» diventa una decisione (per organizzazione? per persona?) — non si decide qui |
| `confronti` | `genesiCmpA/B` | uno snapshot `{ts, kpi, design}` con campo `slot` | **1.130 B** | oggi sono due slot per browser; nell'org servono per persona (`autore`) |
| `riconciliazioni` | `genesiRicon` | una riga `{ts, nome, prev, real, campo?}` | ≈ 250–700 B | oggi senza tetto |
| `sito` | `genesiSito` | **un** documento `{punti:[…], usa}` oppure una collezione `puntiSito` | ≈ 80 B/punto | la legge di sito è **della cava**, non della persona: è il dato che più guadagna a essere condiviso, perché cambia la PPV prevista di tutti |
| `nuvole` | `genesiNuvole` | i metadati di una lavorazione `{nome, conteggi, volume, calcolo}` | ≈ 300–500 B | scritta da `nuvola-poc.html`; letta da Genesi e da Terra |

Restano in `localStorage`: `genesiSent` (memoria del modulo) e
`genesiDisclaimerV1` (consenso del dispositivo).

### 3d. Le regole di sicurezza: il perimetro è già coperto

    $ find . -name "*.rules" -not -path "*/node_modules/*"
    ./apps/deepwork-id/firestore.rules

    $ grep -nE "match /apps" apps/deepwork-id/firestore.rules
    89:      match /apps/{appId}/{document=**} {          → allow read: memberOf(orgId) || (isDemoOrg && signedIn)
    133:      match /apps/{appId}/{coll}/{docId} {          → create/update/delete: memberOf && !isDemoOrg (+ documentoEmesso → solo admin)
    157:      match /apps/{appId}/{coll}/{docId}/{sotto}/{docSotto=**} {   → write: memberOf && !isDemoOrg

    $ grep -c genesi apps/deepwork-id/firestore.rules   → 0
    $ grep -c genesi apps/deepwork-id/tests/run.mjs     → 0

Cioè `organizations/{org}/apps/genesi/**` è coperto **per costruzione** dalle
tre regole generiche: nessuna riga nuova serve per aprire il perimetro, e la
barriera fra organizzazioni è la stessa provata per Scudo e Flotta
(`run.mjs`, 64 righe che citano `apps/`). Quello che **non c'è** è una
prova che nomini Genesi: al momento della prima scrittura live va aggiunta in
`run.mjs` la prova **negativa** (orgB non legge `apps/genesi/volate` di orgA),
copiando quella di `scudo/turni` — costo: dieci righe.

Una decisione **non** tecnica resta aperta e va al fondatore: `documentoEmesso`
(riga 128) elenca `conti/fatture`, `conti/note`, `scudo/documenti` come
documenti che solo l'amministratore cancella. Una **volata già sparata** (cioè
con una riconciliazione) è un documento emesso? Il codice non lo dice e questo
documento non lo decide.

Esito delle regole, rilanciato in questo cantiere sotto emulatore
(`npx --yes firebase-tools@13 emulators:exec --only firestore --project demo-deepwork "cd tests && node run.mjs"`):

    Risultato: 75 passati, 0 falliti

(nel registro compaiono righe `PERMISSION_DENIED`: sono le prove negative,
quelle che pretendono un rifiuto — il rosso voluto.) Nessuna di quelle 75
nomina `genesi`.

---

## 4. I vincoli veri

### 4a. Il documento Firestore da 1 MiB contro i dati di Genesi

Il limite di 1 MiB per documento è il limite dichiarato da Firestore
(*conoscenza di seconda mano: qui `WebFetch` non legge la documentazione*).
Contro i pesi misurati:

| documento | peso | rapporto col limite |
|---|---|---|
| una volata salvata | 561 B | 1/1.800 |
| uno snapshot A/B | 1.130 B | 1/900 |
| la legge di sito con 500 referti | ≈ 40 KB | 1/25 |
| **una nuvola a MAXPTS** | **8–15,6 MB** | **8–16 volte oltre** |

La nuvola non entra in un documento, come non entra in `localStorage`
(4,94 MB misurati). **Non è un blocco**: oggi non ci sta e non ci va — sta in
un file del drone e in memoria mentre si lavora. Nell'organizzazione vale la
stessa scelta: `nuvole` porta i **metadati** (volume, parametri, ritaglio),
la nuvola resta un file. Se un giorno servisse archiviarla, è Cloud Storage
(già usato dal core per foto e documenti: `index.html:2845`, «max 50MB»), non
Firestore — e non è in questo piano.

### 4b. Il lavoro senza rete

Genesi è una PWA con service worker (`genesi-sw.js`, cache `genesi-v3`):
HTML **network-first con ripiego alla cache**, `vendor/` **cache-first**,
`.json` di catalogo stale-while-revalidate, **niente cache cross-origin**
(riga 36). Con `localStorage` questo vuol dire: **Genesi funziona in cava senza
rete, oggi, per costruzione** — ogni scrittura è locale e sincrona.

Che cosa fanno le altre app senza rete, misurato prima di questo documento:

- `tests/browser/salvataggio-offline.mjs` (01/08): con Firebase vero e rete
  chiusa, `addDoc`/`updateDoc` **non rifiutano, restano appese** («PENDENTE,
  4 s di attesa, non si muove»); `getDocs` risponde dalla cache in 8 ms.
  Quindi il gestore che fa `await db.aggiungi(...)` **non torna**: la pagina
  deve saperlo prima (`navigator.onLine`) e dirlo (Flotta lo fa: 1 `onLine`,
  `dw-shell.js:1588-1636` ha la causa «rete»).
- `tests/browser/coda-offline.mjs`: la misura della **decisione 5b** («il
  lavoro senza rete»), che `docs/DECISIONI_WEEKEND.md:185` tiene **aperta a
  metà**: la prima metà (due persone sulla stessa riga) è chiusa; la coda
  offline (`persistentLocalCache`) è **misurata, non accesa**. L'SDK oggi fa
  `getFirestore(this._app)` (index.js:63) **senza** cache persistente; solo il
  core la accende (`index.html:126-136`).

    $ grep -rnE "persistentLocalCache|enableIndexedDbPersistence" shared/deepwork-id-client/ apps/*/index.html | wc -l   → 0
    $ grep -nE "persistentLocalCache|enableIndexedDbPersistence" index.html | wc -l                                    → 6

⛔ **Questo è il vincolo che pesa più di tutti**: portare Genesi su
`orgCollection` così com'è oggi l'SDK la farebbe passare da «funziona sempre»
a «senza rete la scrittura resta appesa». Genesi si usa **al fronte** (il
fochino inserisce il reale dopo lo sparo: `riconStorico`, 3770). Quindi la
modalità live di Genesi **non può sostituire** la scrittura locale: deve
affiancarla (unità 6), oppure aspettare che la 5b venga decisa per tutte. Il
piano lo tiene esplicito invece di nasconderlo dietro «come le altre app».

### 4c. Le 170 funzioni nella pagina

    $ node apps/deepwork-id/tests/copertura-funzioni.mjs | grep -i genesi
      ✓ genesi-formato.js      8/8
      ✓ genesi-data.js        69/69
    ⛔ … Genesi non ha ancora un modulo dati unico. Le sue 170 funzioni restano dentro genesi.html, che node non importa.

Il punto per questo cantiere: **`genesiData()` non si scrive nella pagina**.
Va in `genesi-data.js` (già importato da `run-kpi.mjs:31`, 194 nomi importati
dalla pagina alla riga 1121) con lo **storage iniettabile** (un oggetto
`{getItem, setItem}`), così le prove in `node` girano su una `Map` e la pagina
gli passa `localStorage`. Se `genesiData()` finisse nella pagina sarebbe la
171ª funzione fuori portata — e la porta `Object.assign(D2, …)` (4914), che
il codice stesso chiama «la porta da cui entrano i dati che nessuno ha
controllato», resterebbe senza prova anche quando i dati arriveranno da un
collega invece che dal proprio browser.

### 4d. Due cose che cambiano di significato con più persone

- «**ultime 50**» oggi vuol dire «di questo browser». Nell'organizzazione le
  volate hanno un **autore** e un **quando**: i record di oggi hanno `data`
  ma non chi. `confronti` A/B ha senso per persona, non per cava.
- `genesiRicon` e `genesiSito` **non hanno tetto** (misurato §1b). In un
  browser è innocuo; in una collezione condivisa vuol dire che la lettura
  cresce per sempre — `read()` delle altre app fa `getDocs` dell'intera
  collezione senza paginazione (terra-data.js:2168). Non è un problema oggi
  (decine di righe), va dichiarato.

---

## 5. Il piano a unità piccole

Ordine vincolante: la prima unità **non cambia niente** per chi usa Genesi
oggi. Ogni unità è un commit con la sua prova. Ore = stima, non misura.

| # | unità | dove | prova | ore | rischio |
|---|---|---|---|---|---|
| **1** ✅ 02/09 | `genesiData({storage})` in `genesi-data.js`: interfaccia `{mode:'locale', volate, confronti, riconciliazioni, sito, nuvole, aggiungi, aggiorna, rimuovi}` **sopra le stesse chiavi di `localStorage` di oggi** (nomi e forme invariati, tetti 50/30 invariati), storage iniettabile | solo il modulo dati; **la pagina non cambia** | `run-kpi.mjs`: andata e ritorno su una `Map` per ogni collezione; i tetti; `JSON` corrotto → `[]` come oggi (`_lsGet` 4788); `copertura-funzioni` deve salire (69 → 70+); `nomi-doppi` (nessun nome nuovo condiviso) | 2 | **basso**: nessun utente la vede |
| **2** ✅ 02/09 | la pagina usa `db.volate()/aggiungi/rimuovi` per `genesiVolate` (7 punti: 4850, 4867, 4884, 4890, 4907, 4912) | `genesi.html` | `sintassi-pagine`; `nomi-liberi`; banco browser nuovo `tests/browser/genesi-locale.mjs` (lo script di misura di questo cantiere, reso prova: salva → la chiave `genesiVolate` contiene 1 record con le 5 chiavi; ricarica → la Home la mostra) | 2 | basso; la chiave resta la stessa, i dati esistenti si rileggono |
| **3** | idem per `genesiCmpA/B`, `genesiRicon`, `genesiSito`, lettura di `genesiNuvole` | `genesi.html` (e `nuvola-poc.html` per la scrittura) | stesso banco, esteso; **Terra continua a leggere la chiave** (`terra/index.html:4465`) → prova che la forma scritta da `nuvola-poc` non cambia | 3 | medio: `sitoLegge` alimenta `ppvSite()` → tutti i calcoli PPV; la prova deve leggere un numero **prima e dopo** (stesso valore) |
| **4** | modalità **live**: `DeepworkID.init({appId:'genesi'})` in `try/catch` come `terraData`, cinque `orgCollection`; `mode:'live'` solo con `authState()==='member'`; altrimenti resta `'locale'` (non «demo in memoria») | `genesi-data.js`; `run.mjs` | prova **negativa** in `run.mjs` sotto emulatore (orgB non legge `apps/genesi/volate` di orgA), copiata da `scudo/turni`; **nessuna riga nuova in `firestore.rules`** (§3d) | 3 | medio: `genesi.html` oggi importa **solo** `dw-shell.js` (riga 1140: «non porta dentro né Firebase né l'SDK»); l'SDK carica Firebase da `gstatic`, che il service worker **non mette in cache** (riga 36) → senza rete l'import fallisce e il `catch` deve riportare a `'locale'` — **va misurato staccando la rete**, non dedotto |
| **5** | «porta le tue volate nell'organizzazione»: al primo accesso live, copia una tantum delle chiavi locali nelle collezioni, con contrassegno `genesiMigratoV1` e i campi `autore`, `creatoIl` | `genesi-data.js` + un bottone in Home | prova pura: la copia è **idempotente** (seconda chiamata → 0 scritture); le chiavi locali **non si cancellano** | 2 | medio: doppioni se la stessa persona migra da due computer → il contrassegno è per browser, il doppione va dichiarato non nascosto |
| **6** | scrittura **senza rete in live**: scrittura locale **prima** (sempre, sincrona) e poi verso l'org; se `navigator.onLine===false` si dice con il toast (forma di Flotta) e la riga resta segnata `daInviare` | `genesi-data.js`, `genesi.html` | banco browser con rete staccata (Playwright `context.setOffline(true)`): la volata è salvata localmente, la Home la mostra, il toast dice «rete»; riattaccata → la riga parte | 4 | **alto ed è una decisione**: è la 5b applicata a una app. Se il fondatore accende la coda per tutte (`persistentLocalCache` nell'SDK), questa unità si riduce al toast |
| **7** | la porta `Object.assign(D2, design)` (4914) valida i campi **anche** da org: un `design` scritto da un altro browser con un campo illeggibile lascia il campo vuoto e lo dice (già così per `localStorage`) | `genesi-data.js` (funzione pura `designLeggibile`) + 1 riga in pagina | `run-kpi`: 32 campi, ognuno con un valore sporco → vuoto dichiarato, mai zero | 2 | basso |
| **8** | Terra legge le nuvole di Genesi da `orgCollection('nuvole')` con seconda istanza SDK (`appId:'genesi'`, sola lettura, pigra — forma di `rapportiniCampo`) e **tiene la chiave del browser come ripiego** | `terra-data.js`, `terra/index.html` | `run-kpi`: la scelta «org se c'è, chiave se no» è una funzione pura; il banco di Terra che preme `btn-dal-drone` resta verde | 2 | basso; dipende da 3 e 4 |

✅ **Unità 1 chiusa il 02/09** (`genesi-data.js`, blocco G8): la porta ha la
forma delle altre (`mode`, cinque lettori, `aggiungi/aggiorna/rimuovi/logout`,
tutto asincrono), storage iniettabile, e sta sopra le stesse chiavi con gli
stessi tetti — che `run-kpi` legge **dal sorgente della pagina** (il `while
(arr.length>50)` e il `while(a.length>30)` di nuvola-poc), non a memoria.
Copertura di `genesi-data` 69 → 70; `funzioni-mai-usate` da oggi guarda anche
questo modulo (misurato: zero allarmi oltre a `genesiData`, dichiarata «da
collegare» entro il 09/09). La pagina non è cambiata di un byte.

✅ **Unità 2 chiusa il 02/09**: i sette punti della pagina (`renderHome`,
`salvaVolata`, il gestore apri/duplica/elimina) passano da `GDB`
(`genesiData()`, chiamata così perché un `const db` locale esiste già alla riga
del bottone «elimina foro»); il tetto delle 50 sta nella porta e non più nella
pagina. Banco `tests/browser/genesi-locale.mjs`: salva dalla modale, ricarica,
duplica, elimina — a ogni gesto guarda la chiave SOTTO e la Home SOPRA (17
prove); la controprova rimette la Home che non legge dalla porta e cade in 8.
I banchi che scrivono `genesiVolate` a mano restano verdi: stessa chiave.

**Totale stimato: 20 ore**, di cui 4 (unità 6) sospese a una decisione che
non è tecnica. Le unità 1-3 valgono da sole anche se le 4-8 non si facessero
mai: tolgono otto funzioni di `localStorage` dalla pagina, le mettono sotto
prova, e non cambiano un byte di ciò che l'utente vede.

**Che cosa NON entra nel piano**: la nuvola in Firestore (§4a), un nuovo
formato al posto del `.volata.json` (esiste, §2c), la migrazione delle 104
funzioni «di architettura» (§4c), la scelta se una volata sparata è un
documento emesso (§3d), nomi e temi (sospesi).

---

## 6. Che cosa questo documento NON dice

- **Non dice quante organizzazioni useranno Genesi né quante volate al mese**:
  i pesi sono per record, il totale è un ordine di grandezza (decine di KB).
- **Non dice che il `.volata.json` non abbia mai avuto un lettore nel core**:
  dice che nel commit `838530fd` non si trova con i comandi del §2c.
- **Non ha misurato il comportamento senza rete della modalità live**: è
  scritto come rischio dell'unità 4 e va misurato staccando la rete, non
  dedotto dal service worker.
- **Non ha rilanciato le prove delle regole con un caso `genesi`**: le regole
  coprono il perimetro per costruzione (§3d), la prova che lo nomini è nel
  piano (unità 4). Il giro delle 75 prove esistenti è stato rilanciato in
  questo cantiere sotto emulatore: **75 passati, 0 falliti** (§3d).
- **Non decide** tetti per organizzazione, chi cancella una volata sparata,
  né se la coda offline vada accesa: sono tre decisioni del fondatore.
- **Non stima con precisione** `genesiRicon`, `genesiSito`, `genesiNuvole`
  (≈): non ho salvato una riconciliazione né un referto nel browser; i tre
  pesi misurati (561, 1.130, 1) sono quelli di cui è stato premuto il bottone.
- Il limite di 1 MiB di Firestore è di seconda mano (nessun `WebFetch`).

Strumenti di questo cantiere (scratchpad `cantiere-genesi/`): `misura-ls.mjs`
(pesi delle chiavi), `quota.mjs` (quota di `localStorage`). Sono candidati a
diventare `tests/browser/genesi-locale.mjs` nell'unità 2 — finché stanno nello
scratchpad, alla sessione dopo non esistono.
