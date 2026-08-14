# Ricerca continua — COME SI DICHIARA CHE UN DATO NON C'È

**Domanda del ciclo:** come dichiarano i sistemi professionali e regolamentati
che un valore **non è disponibile — e perché**, dentro un file che qualcun altro
dovrà rileggere? Cioè: come si distingue **zero** da **non misurato** da **non
applicabile**.

**Verificato contro il commit `f97eb358`** (branch
`claude/scheduled-tasks-remote-control-bk4ap6`, 13/08/2026).
**Metodo:** prima il mondo con le fonti, poi la nostra casa con le prove.
Ogni «non c'è» in casa nostra porta accanto il comando e la sua uscita.
Ogni affermazione sul mondo porta il link; quello che ho dedotto è marcato
`[dedotto]`.

⚠️ **Limite dello strumento, dichiarato.** La ricerca sul web funziona; le
**pagine** dei siti degli standard (`sdmx.org`, `hl7.org`, `ec.europa.eu`,
`iredes.org`, `xbrl.org`, `dd.eionet.europa.eu`, `w3.org`) sono **negate dal
proxy** di questo contenitore. Dove non ho potuto aprire la pagina ho usato il
testo restituito dalla ricerca, oppure una **copia della stessa fonte** su un
dominio raggiungibile — ed è dichiarato caso per caso. Le definizioni SDMX qui
sotto vengono da una copia **integrale e citabile** del vocabolario, aperta
davvero.

---

## 0. CHE COSA ESISTE GIÀ IN CASA (letto prima di proporre)

Va detto subito, perché cambia il senso di tutto il resto: **su questo argomento
non partiamo da zero, e in un punto siamo già allineati a uno standard senza
saperlo.**

| dove | che cosa c'è già | prova |
|---|---|---|
| `shared/dw-ponti.js:1187` | `numeroDichiarato(x)` — l'unica funzione che decide se un numero *c'è*; `null` quando non c'è | `grep -n "export function numeroDichiarato" shared/dw-ponti.js` → `1187` |
| `apps/deepwork-id/tests/run-stile.mjs:2713` | il **vocabolario chiuso** delle bandiere: `misurabile`, `leggibile`, `calcolabile`, `noto`, `attendibile`, `pochi` — sorvegliato dalla regola 20 (una bandiera che nessuno legge non protegge niente) | `grep -n "const BANDIERE" run-stile.mjs` → `2713` |
| tutte le app | **531 righe nominano** una di quelle bandiere — **52 delle quali sono commenti**, quindi il conto NON è «531 usi» (scudo 149, conti 95, terra 83, genesi 83, campo 62, sentinella 34, flotta 23) | `grep -rn "misurabile\|leggibile\|calcolabile\|attendibile\|noto:" apps/ shared/ --include=*.js \| wc -l` → `531`; delle quali `\| grep -c ":[ ]*\(//\|\*\)"` → `52` |
| `apps/genesi/genesi-data.js:877-914` | `xmlPianoInnesco` scrive **l'elemento vuoto con `status="non-calcolabile"`** invece di uno zero, più un commento di ATTENZIONE che conta i valori mancanti | `grep -n "non-calcolabile" apps/genesi/genesi-data.js` → 6 righe |
| `apps/terra/terra-data.js:1848` | `rientroRilievi` — l'audit di **andata e ritorno**: quante righe rientrano, e per ognuna che non rientra **la ragione a parole** | `grep -rn "export function rientro" apps/*/[a-z]*-data.js` → **1 sola** |
| 5 lettori su 5 misurati | nessun ripiego silenzioso: `Number.isFinite(n) ? … : null` | vedi §3, prova D1 |

⛔ **E il primo risultato di questa ricerca è che Genesi ha già inventato, da
sola e per necessità, il disegno di GML/ISO 19115.** `<MaxInstantCharge
unit="kg" status="non-calcolabile"/>` è, riga per riga, quello che lo standard
geografico scrive `xsi:nil="true" nilReason="unknown"`: **elemento senza valore
+ attributo che dice il perché**. Non è una mancanza da colmare: è una
convenzione nostra che si può **battezzare** con un nome che il mondo già
conosce. Vale come risultato quanto una mancanza.

---

## 1. IL MONDO

### 1.1 SDMX / Eurostat — `CL_OBS_STATUS` e `CL_CONF_STATUS`

È lo standard con cui le statistiche ufficiali di mezzo mondo si scambiano i
numeri. La sua idea centrale: **ogni osservazione ha un valore E uno stato**, e
lo stato è un codice di una lista chiusa.

**a) Come si scrive l'assenza, e come si scrive la ragione.** Con un **attributo
codificato accanto al valore** — `OBS_STATUS` — non toccando il valore. Le
definizioni qui sotto sono **verbatim** dalla copia integrale del vocabolario
SDMX pubblicata da UK Government Linked Data
([sdmx-code.ttl](https://raw.githubusercontent.com/UKGovLD/publishing-statistical-data/master/specs/src/main/vocab/sdmx-code.ttl),
aperta e letta):

| codice | nome | definizione (verbatim) |
|---|---|---|
| `A` | Normal | «Normal is the default value (if no value is provided) and is used when no special coded qualification is assumed.» |
| `B` | Break | «Break observations are characterised as such when different content exist or a different methodology has been applied to this observation as compared with the preceding one.» |
| `E` | Estimated value | «Observation obtained through an estimation methodology (e.g. to produce back-casts) or based on the use of a limited amount of data or ad hoc sampling.» |
| `I` | Imputed value | «Observation imputed by international organisations to replace or **fill gaps** in national data series…» |
| `M` | **Missing value** | «Data can be missing due to various reasons: data **do not exist**, are **insignificant** (or **not collected because they are below a certain threshold**), are **unreliable**, are **not relevant for the period**, or other reason not elsewhere specified.» |
| `P` | Provisional value | «An observation is characterised as "provisional" when the source agency considers that the data, almost certainly, are expected to be revised.» |
| `S` | Strike | «A known strike that occurred in the corresponding period that may have affected the observation or caused a missing value.» |

⛔ **E il punto che ci riguarda di più: la versione 2.2 ha SPEZZATO quel `M` in
ragioni separate**, perché una sola parola «mancante» non bastava:
`O` = *missing value* generico, `L` = «Missing value; **data exist but were not
collected**», `Q` = «Missing value; **suppressed**», `M` = il caso in cui il
dato **non può esistere**
([sdmx.org, annuncio v2.2](https://sdmx.org/news/new-version-of-code-list-for-observation-status-version-2-2/);
[testo delle definizioni v2.0/2.2](https://sdmx.org/wp-content/uploads/CL_OBS_STATUS_v2_0_18-6-2014.doc);
esiste già una [v2.3](https://sdmx.org/news/version-2-3-of-cl_obs_status-released/);
l'elenco completo dei venti codici — `A B D E F G I K W O M P S L H Q J N U V` —
è riportato anche
[qui](https://github.com/smart-data-models/dataModel.SDMX/blob/master/Observation/doc/spec.md)).
La lezione per noi non è l'elenco: è che **chi ha lavorato dieci anni su questo
ha scoperto che «manca» va diviso almeno in quattro** — non esiste, esiste ma
non è stato raccolto, è stato soppresso, non si sa.

La **riservatezza** viaggia su un secondo asse, `CONF_STATUS`, e non si mescola
con l'assenza (stessa fonte verbatim): `F` = Free, `C` = Confidential
statistical information, `N` = Not for publication, `D` = «Secondary
confidentiality set by the **sender**», `S` = «…set and managed by the
**receiver**». Cioè: *«non lo vedi»* e *«non l'ho misurato»* sono **due colonne
diverse**. Eurostat ha allineato i suoi flag a questa separazione **il 27
gennaio 2025**, spezzandoli nelle due liste `Obs_status` e `Conf_status`
([Eurostat, formati disponibili](https://ec.europa.eu/eurostat/web/user-guides/data-browser/download-data/available-formats)).

**b) Che cosa fa un lettore conforme — nessun valore di ripiego.** In SDMX il
«default» riguarda lo **stato** (`A` quando non è dichiarato niente), **non il
valore**: nessuna riga dello standard autorizza a mettere un numero al posto di
un'osservazione mancante. Al contrario, esiste un problema riconosciuto e un
pacchetto ufficiale Eurostat solo per decidere **quale bandiera propagare a un
totale**: «it is not straightforward what flag shall be propagated to an
aggregated value like sum, average, quintiles», con tre metodi documentati
(gerarchia, frequenza, peso) —
[eurostat/flagr](https://github.com/eurostat/flagr). Cioè: **l'assenza non si
riempie, si propaga — e si propaga fino ai totali.** È esattamente il principio
del fondatore, scritto da un'agenzia statistica.
Il solo caso in cui un numero viene messo al posto di un buco ha un codice
**suo** e si dichiara: `I` = *imputed*, «to fill gaps».

**c) Come si distingue zero da assente in un CSV.** Con **due mezzi insieme**:
un **segnaposto** nella cella e una **lettera** accanto.
- il segnaposto è il **due punti**: «A cell contains a colon if no value is
  available for a time period, i.e. the colon means **not available**. For a
  time period that does not match the frequency indicated in the series key the
  colon means **not applicable**»
  ([Eurostat, come scaricare i dataset](https://ec.europa.eu/eurostat/web/user-guides/data-browser/download-data/download-datasets));
- la ragione è un **flag** separato dal valore **da uno spazio**, in una colonna
  `OBS_FLAG` quando il formato la prevede (stessa fonte). I flag usati da
  Eurostat: `b` break, `c` confidential, `d` definition differs, `e` estimated,
  `f` forecast, `n` not significant, `p` provisional, `r` revised, `s` Eurostat
  estimate, `u` low reliability, `z` **not applicable**
  ([vocabolario Eurostat obs_status](https://dd.eionet.europa.eu/vocabulary/eurostat/obs_status/view));
- e la combinazione dice la cosa che a noi manca: **`:` da solo = non
  disponibile**, **`:z` = non applicabile** — due assenze diverse scritte in
  modo diverso nella stessa cella. Nelle pubblicazioni `:z` si stampa `-`
  ([Eurostat, Tutorial: Symbols and abbreviations](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Tutorial%3ASymbols_and_abbreviations)),
  che raccomanda anche: «flags for **not available** and **confidential** data
  **should be always included** in statistical tables».

### 1.2 ISO 19115 / GML — `xsi:nil` + `nilReason`

Lo standard dei dati geografici: rilievi, sensori, cartografia. Il più vicino a
Terra e a Genesi per mestiere.

**a)** L'elemento resta **presente e vuoto**, marcato `xsi:nil="true"`, e la
ragione va in un **attributo dedicato**, `nilReason`, con una lista chiusa
(definizioni verbatim da
[OGC 08-085r8](https://docs.ogc.org/is/08-085r8/08-085r8.html) /
[gml/3.2.1/basicTypes.xsd](https://schemas.opengis.net/gml/3.2.1/basicTypes.xsd)):

| valore | definizione |
|---|---|
| `inapplicable` | «There is no value.» |
| `missing` | «The correct value is **not readily available to the sender** of this data.» |
| `template` | «The value **will be available later**.» |
| `unknown` | «The correct value is **not known to, and not computable by**, the sender of this data.» |
| `withheld` | «The value is **not divulged**.» |

più due vie di fuga dichiarate: `other:testo` (una spiegazione breve, senza
spazi) e un `anyURI` che punta a un documento che spiega l'eccezione.

**b)** La ragione è **leggibile da un programma**, e le distinzioni servono a
decidere: `template` dice «torna fra un mese», `inapplicable` dice «non tornare
mai», `unknown` dice «nemmeno chi te l'ha mandato lo sa». Nessun ripiego
numerico è previsto: un `nil` **non è un valore**.

**c)** In CSV non si applica — GML è XML. È il motivo per cui la parte CSV di
questa ricerca vive negli standard statistici e non qui.

### 1.3 HL7 v3 `nullFlavor` e FHIR `dataAbsentReason`

La sanità è il posto dove sbagliare un'assenza fa danni immediati, e infatti è
il vocabolario **più fine di tutti**.

**a)** In HL7 v3, l'attributo `nullFlavor` si mette **su qualunque campo**, non
solo sui numeri (definizioni dalla
[code system v3-NullFlavor](https://terminology.hl7.org/5.3.0/CodeSystem-v3-NullFlavor.html)):
`NI` = No information («the most general and default exceptional value»),
`UNK` = Unknown («a proper value is applicable, but is not known»),
`ASKU` = «Asked, but not known» (l'ho chiesto e non lo sa),
`NASK` = «Not asked» (non gliel'ho chiesto),
`NAV` = «Temporarily unavailable… **is expected to be available later**»,
`MSK` = Masked (c'è, ma non te lo do, per privacy o sicurezza),
`NA` = Not applicable,
`OTH` = Other («the actual value is not an element in the value domain»).

⛔ **La coppia `ASKU`/`NASK` è la cosa più utile di tutta questa ricerca per un
prodotto da cava**, e non ha nessun equivalente in casa nostra: distingue
**«ho chiesto e la risposta non c'è»** da **«nessuno ha chiesto»**. È la
differenza fra un ricettore che ha registrato e non ha superato nulla, e un
ricettore che nessuno è andato a leggere. E CLAUDE.md la contiene già in
italiano, scritta per Campo: *«nell'appello del turno, "non lo so" non è "non
c'è"»* — cioè abbiamo trovato per conto nostro metà di `NASK`.

In FHIR (la versione moderna) il valore **si omette** e accanto compare un
elemento gemello col trattino basso che porta l'estensione:
`"_valueQuantity": { "extension": [{ "url": ".../data-absent-reason",
"valueCode": "asked-unknown" }] }`
([estensione](https://www.hl7.org/fhir/R4/extension-data-absent-reason.html),
[code system](https://hl7.org/fhir/R4/codesystem-data-absent-reason.html)).
Due codici che ci riguardano da vicino, verbatim: `not-a-number` = «The numeric
value is **undefined or unrepresentable** due to a floating point processing
error»; `masked` = «The information is not available due to security, privacy or
related reasons».

**b)** Il lettore **non ha nessun ripiego**: il codice è una *ragione*, mai un
valore. La regola forte di FHIR è che il campo `dataAbsentReason` e il valore
**non possono coesistere** — o c'è il numero, o c'è il perché. `[dedotto]` dalla
forma dell'estensione (il valore viene omesso e sostituito dal gemello `_`), non
da una riga citabile che ho potuto aprire.

**c)** Non si applica: FHIR è JSON/XML.

### 1.4 XBRL — `xsi:nil` sui fatti (il caso più debole, e va detto)

**a)** Il fatto è presente con `xsi:nil="true"` e **nessuna ragione**: «The nil
attribute of XML Schema is used to allow facts to be reported with a "null"
value to indicate that an information is **unknown or an inapplicable**
information» — le due cose insieme, indistinguibili
([XBRL FRIS](https://www.xbrl.org/technical/guidance/FRIS-PWD-2004-11-14.htm)).

**b)** Il lettore lo tratta **come se il fatto non ci fosse**: «if a fact with a
nil attribute is sent then the value should be treated as **not existing and to
be ignored**», e «xsi:nil = true is normally **the same as being absent**»
(stessa fonte). Nei totali il fatto nil **non entra**: la somma pesa su meno
termini, non su uno zero.

**c)** Non si applica.

⚠️ **Perché lo cito lo stesso:** XBRL è la prova che **dichiarare l'assenza
senza la ragione è la metà debole del lavoro** — è la cosa che facciamo oggi noi
con la cella vuota. È il gradino che abbiamo già salito; quello sopra è la
ragione.

### 1.5 Statistica ufficiale italiana ed europea — i simboli

L'ISTAT usa quattro simboli, e **sono quattro ragioni diverse**, non quattro
modi di dire «vuoto» ([Annuario statistico italiano, Avvertenze e simboli
convenzionali](https://www.istat.it/it/files/2011/02/Guida-alla-lettura4.pdf);
[versione online](http://rsdi.regione.basilicata.it/geoserver/www/annuario/Avvertenze_e_simboli.html)):

| simbolo | significato |
|---|---|
| `-` (trattino) | a) **il fenomeno non esiste**; b) il fenomeno esiste ed è misurato, ma **i casi non si sono verificati** |
| `....` (quattro punti) | **il fenomeno esiste, ma il dato non si conosce** per qualsiasi ragione |
| `..` (due punti) | il numero **non raggiunge la metà** della cifra dell'ordine minimo considerato, oppure la scarsità del fenomeno rende i valori **non significativi** |
| `*` (asterisco) | dato **oscurato a tutela del segreto statistico** |

⛔ **Il trattino ISTAT è la trappola che ci riguarda.** Da noi il trattino `—` è
il segno dell'**assenza**; per l'ISTAT lo stesso segno vale anche per «misurato,
ed è successo zero volte». Sono le due cose che questa casa passa il tempo a
separare, scritte con **lo stesso carattere** dal principale istituto statistico
italiano — cioè l'ambiguità che un cliente potrebbe portarsi in casa leggendo i
nostri fogli con l'occhio dell'ente. Il vocabolario largo di Eurostat (`:` e
`:z`) è più preciso di quello italiano, e il nostro è più preciso del trattino
ISTAT solo perché **noi non usiamo `—` per lo zero misurato** — regola scritta
in casa (`checkpoint 20260808-015138`, «i trattini diventano regola»).

### 1.6 La sintassi che manca al CSV: chi dichiara che cosa vuol dire «vuoto»

Il CSV non ha l'elemento vuoto. Due standard risolvono la cosa allo stesso modo:
**il file dichiara da sé quali stringhe significano "manca"**.
- **W3C CSVW**: la proprietà `null` è «an atomic property giving the string or
  strings used for null values within the data. If the string value of the cell
  is equal to any one of these values, the cell value is `null`»
  ([Model for Tabular Data and Metadata on the Web](https://w3c.github.io/csvw/syntax/),
  [vocabolario](https://www.w3.org/ns/csvw));
- **Frictionless Table Schema**: la proprietà `missingValues` è una **lista**
  (`["", "N/A", "-99"]`), e la stringa vuota **non è** automaticamente mancante:
  bisogna metterla dentro
  ([Table Schema](https://github.com/frictionlessdata/tableschema-py/blob/main/README.md)).

`[dedotto]` — la conseguenza per noi: una cella vuota **non si interpreta da
sola**. Chi apre un nostro CSV con un programma conforme a uno di questi due
standard e senza il descrittore, per definizione **non sa** se la nostra cella
vuota è un'assenza o una stringa vuota.

---

## 2. IL NOSTRO MESTIERE

### 2.1 WITSML (perforazione) — il valore nullo si DICHIARA nel file

È l'unico standard del nostro mondo in cui ho trovato una convenzione esplicita,
e la sua idea è diversa da tutte quelle sopra: invece di un elemento vuoto, si
usa un **valore sentinella** — ma **dichiarato dentro il file**. L'elemento
`nullValue` si scrive nell'intestazione del log **e per singola curva**
(`logCurveInfo`), e il valore di fatto standard del settore è **`-999.25`**
([WITSML STORE API 1.4.1](https://docs.pronova-tde.com/witsml/v47/pdfs/WITSML_STORE_API_V1.4.1.pdf);
[nota d'uso su null values](https://drilling.intelie.com/administration/high-frequency-data/witsml-null-values)).

`[dedotto]` — il punto trasferibile non è il `-999.25`, che è una scelta brutta e
figlia dei nastri degli anni Ottanta: è che **il file porta con sé la propria
convenzione**, invece di lasciarla nella testa di chi l'ha scritto. È la stessa
idea di `missingValues` di Frictionless, applicata da un settore che assomiglia
al nostro.

### 2.2 IREDES (perforazione/volata) — NON TROVATO, e questo è un risultato

Non ho trovato **nessuna convenzione documentata** su come IREDES dichiari un
valore mancante. Le query provate, tutte con risultati ma nessuno pertinente:
- `IREDES drilling XML standard missing value hole not drilled status code`
- `IREDES "DrillLog" XML schema optional element unknown value drilling report specification PDF`

Il sito ufficiale ([iredes.org/irdocs/](https://iredes.org/irdocs/), che pubblica
la documentazione degli schemi `DrillPlan` e `DrillRig`) è **negato dal proxy di
questo contenitore**, quindi non ho potuto leggere gli XSD. Quello che si può
dire con la misura in mano: `[dedotto]` essendo XML Schema, IREDES eredita
comunque `xsi:nil`, ma **niente prova** che definisca un `nilReason` proprio.
⛔ **Chi riprende questo filo apra gli XSD, non ridichiari il "non c'è" sulla
mia parola** — e il nostro `xmlPianoInnesco` è già dichiarato «bozza in stile
IREDES, non conformità certificata» (`genesi-data.js:908`), quindi non stiamo
promettendo niente che non possiamo mantenere.

### 2.3 Vibrazioni da volata (ISEE/OSMRE) — «il sismografo non è scattato»

Qui una convenzione **esiste ed è del nostro mestiere esatto**. Il programma di
valutazione dei dati di vibrazione dell'OSMRE (l'ente federale USA per le
miniere) prevede il caso in cui «the unit **did not trigger** to record the PPV
and/or the AB», e documenta **due comportamenti ammessi**: «the user may choose
to **eliminate the blast record** from the dataset or may choose to **enter the
trigger threshold settings** for the unit» — con un tetto dichiarato: «to avoid
biasing the dataset results, the data set should **not contain a large
percentage of records (less than 5%)** where the unit did not trigger»
([OSMRE BIVDEP 2.0](https://www.osmre.gov/sites/default/files/inline-files/OSMRE_BIVDEP%202.0%20Documentation.pdf);
riferimento normativo: [ISEE Field Practice Guidelines for Blasting
Seismographs](https://isee.org/docs/default-source/isee-digital-downloads/isee-field-practice-guidelines-for-blasting-seismographs-2020.pdf)).

⛔ **Tre cose da portare a casa, tutte e tre nostre:**
1. una lettura mancata **non è mai uno zero**: le due uscite ammesse sono
   *togliere la riga* oppure *scrivere la soglia di scatto* — e la seconda è
   dichiaratamente prudente, non tranquilla;
2. **si dichiara quante righe sono in quello stato**, e c'è una soglia oltre la
   quale il campione non vale più. È il **denominatore** che CLAUDE.md pretende
   da ogni censimento, scritto da un ente pubblico;
3. e **togliere la riga è ammesso solo se si dice quante ne sono state tolte** —
   che è esattamente ciò che i nostri lettori CSV oggi non fanno (§3, D2).

### 2.4 Pesatura (bilance/pese a ponte) — NON TROVATO

Query provate: `weighbridge software CSV export "tare" missing weight "0"
convention ticket unweighed mining quarry data exchange standard`. Risultati:
solo pagine commerciali di produttori di software di pesatura, nessuno standard
di scambio, **nessuna convenzione sul dato mancante**. `[dedotto]` il mercato
della pesatura non ha un formato aperto paragonabile a IREDES o WITSML: ognuno
esporta il proprio CSV. Se un giorno servisse, la convenzione la dovremo
**dichiarare noi nel file** (§2.1).

---

## 3. IL DELTA — la nostra casa, misurata

### D1 · Il giro di andata e ritorno: 11 coppie provate, 3 righe perse, 1 assenza diventata zero

Misura fatta scrivendo un record con **un numero assente**, esportandolo col
nostro scrittore e rileggendolo col nostro lettore
(script in scratchpad, `ricerca-assenza2/giro.mjs`, sola lettura):

```
Rilievi (terra)         | 1→0 RIGA PERSA          | csv: 2026-08-01;;drone;;F1;scavo
Pesate (conti)          | 1→1 | netto    = null   → assente (ok)
Incassi (conti)         | 1→0 RIGA PERSA          | csv: F1;2026-08-01;;bonifico
Clienti (conti)         | 1→1 | fido     = null   → assente (ok)
Listino (conti)         | 1→0 RIGA PERSA          | csv: Pietrisco;t;;;22
Gare (conti)            | 1→1 | base     = null   → assente (ok)
Ricambi (flotta)        | 1→1 | giacenza = 0      → ZERO
Squadre (campo)         | 1→1 | persone  = null   → assente (ok)
Ricettori (sentinella)  | 1→1 | distanza = null   → assente (ok)
Tarature (sentinella)   | 1→1 | scadenza = ""     → assente (ok)
Azioni (scudo)          | 1→1 | scadenza = null   → assente (ok)
─────────────────────────────────────────────────────────────────────
righe perse: 3 · assenza diventata zero: 1 · assenza conservata: 7
```

**Lettura onesta dei tre esiti:**
- **7 su 11 conservano l'assenza**, e questo è il comportamento che gli standard
  chiedono (§1.1b). Non è un caso: i lettori scrivono
  `Number.isFinite(n) ? … : null` in tutti i punti misurati
  (`apps/campo:2408`, `apps/conti:733`, `apps/flotta:681`, `apps/scudo:1886`,
  `apps/sentinella:815`). **Siamo già allineati sul punto che conta di più.**
- **L'unico «zero» NON è un difetto**, e va detto invece di accusare:
  `csvRicambi` scrive `0` di proposito per una giacenza assente, e
  `parseRicambiCsv` lo rilegge `0`, con la ragione scritta accanto
  (`flotta-data.js:643`): *«la GIACENZA che manca vale zero (decisione 1: è la
  risposta giusta, e il contrario nasconderebbe i pezzi finiti, che sono quelli
  da ordinare)»*. Scrittore e lettore concordano, e la direzione è quella
  **allarmante**. Nel vocabolario SDMX questo si chiama e si scrive: è un
  **valore di default dichiarato**, cugino del codice `I` (*imputed*). Quello
  che manca è che la **dichiarazione non esce dal file**: il cliente che apre
  `ricambi.csv` legge `0` e non ha modo di sapere che nessuno ha mai contato.
- **Le 3 righe perse sono la scoperta vera** (D2).

### D2 · 13 lettori possono cancellare una riga; 8 punti di import su 13 non lo dicono

```
lettori CSV che possono scartare una riga per un DATO mancante: 13/23
punti di import di quei lettori nelle pagine: 13
 · dichiarano lo scarto (entro 40 righe): 5   → campo/piano, flotta/telemetria,
                                                scudo/lavoratori, scudo/scadenze,
                                                sentinella/adempimenti
 · MUTI: 8  → conti/fatture, conti/incassi, conti/listino, conti/pesate,
              scudo/infortuni, sentinella/monitoraggi, sentinella/volate,
              terra/rilievi
```
(misura riproducibile: censimento dei `parse*Csv` con un `.filter` che scarta su
un dato, incrociato con il testo dei loro punti d'uso in `apps/*/index.html`.)

⚠️ **RIMISURATO DA CHI INTEGRA, il 13/08 — e i due righelli non danno lo stesso
numero.** La regola di casa è che niente entra sulla parola dell'agente, quindi
il censimento è stato rifatto in modo indipendente: **23 lettori CSV** (lo stesso
totale), e i **candidati** — corpo che contiene un `.filter(` o un `continue;`
senza nessuna parola tipo «scartate»/«ragione» — sono **15**, non 13:
`campo.parseSquadreCsv` · `conti.parseFattureCsv` · `conti.parseListinoCsv` ·
`conti.parsePesateCsv` · `conti.parseIncassiCsv` · `flotta.parseTelemetriaCsv` ·
`flotta.parseMezziCsv` · `scudo.parseLavoratoriCsv` · `scudo.parseScadenzeCsv` ·
`scudo.parseAzioniCsv` · `sentinella.parseRicettoriCsv` ·
`sentinella.parseAdempimentiCsv` · `sentinella.parseVolateCsv` ·
`terra.parseFrontiCsv` · `terra.parseRilieviCsv`.
⛔ **Nessuno dei due numeri è il conto dei difetti**, e il verdetto vero lo dà
solo la lettura una riga per volta: un `.filter` che toglie l'intestazione o
l'ultima riga vuota è **giusto**. Sulle passate di questa forma il rapporto è
stato meno di uno su dieci. Il numero da citare, finché il cantiere non ha
letto, è **«candidati», non «difetti»** — e i due righelli in disaccordo sono
esattamente la ragione per cui si legge invece di correggere a tappeto.
⚠️ E la differenza fra 13 e 15 non è un errore di nessuno dei due: la ricerca
chiedeva «può scartare **per un dato mancante**» (più stretta, e giudicata
leggendo), il mio righello chiede «scarta **e non lo dichiara**» (più larga, e
statica). **Due domande diverse danno due numeri diversi**, ed è la regola già
scritta in `CLAUDE.md`: quando un controllo dichiara un arretrato, si guarda con
quale unità lo misura.

⛔ **E la causa non è una dimenticanza di chi ha scritto le pagine: è
STRUTTURALE, e nessuna pagina la può correggere.** Il filtro sta **dentro** il
lettore, che restituisce **solo i sopravvissuti**:
`parseRilieviCsv` finisce con
`.filter(p => dataISOEsiste(p.data) && Number.isFinite(p.volumeM3) && …)`
(`terra-data.js:1781`). Quando la pagina scrive `righe.length`
(`terra/index.html:4534`), quel numero **è già ripulito**: chi chiama non ha
mai avuto in mano le righe cancellate, quindi **non può dichiararle nemmeno
volendo**. È la terza via, quella che nessuno standard ammette: non un ripiego,
non una propagazione — una **cancellazione silenziosa**. E l'OSMRE (§2.3) la
ammette solo insieme al conto di quante righe sono state tolte.

⚠️ **Difesa che esiste già, e va nominata:** `rientroRilievi`
(`terra-data.js:1848`) fa esattamente la domanda giusta — riscrive ogni rilievo,
lo rilegge, e per ogni riga che non torna dà **la ragione a parole** («la data
non esiste», «il volume non è stato misurato», «il volume è negativo»). Ma
misura la perdita **in uscita**, prima di scaricare, e **esiste in un posto
solo**: `grep -rn "export function rientro" apps/*/[a-z]*-data.js` → **1 riga**.

### D3 · Nessun nostro CSV porta la RAGIONE dell'assenza

```
grep -rn "non misurat\|mai misurat\|non calcolabil\|non leggibil\|non applicabil" \
  apps/*/[a-z]*-data.js | grep -ic "csv\|righe.push\|join(\";\")"
→ 0
```
Le intestazioni lo confermano: `data;volumeM3;metodo;gsd;fronte;provenienza`
(terra), `fatturaId;data;importo;metodo` (conti), `nome;giacenza;sogliaMin;prezzo`
(flotta), `nome;unita;prezzo;densita;iva` (conti listino). Nessuna colonna di
stato dell'osservazione. La cella vuota c'è — **18 punti dentro le funzioni
`csv*` scrivono `""` per un `null`** (e 67 in tutti i moduli dati, ma quelli
comprendono usi che con i CSV non c'entrano: il numero da guardare è 18) — ma
**è muta**: dice *che* manca, mai *perché*. Nel vocabolario di §1.4,
siamo al livello di XBRL — il gradino sotto a SDMX, GML e FHIR.

### D4 · Il mondo non è mai entrato in casa: zero termini di standard

```
grep -rn "OBS_STATUS\|nilReason\|nullFlavor\|xsi:nil\|dataAbsentReason" \
  docs/ vault/ apps/ shared/ --include=*.md --include=*.js
→ 0 righe (le uniche occorrenze di "SDMX" e "IREDES" sono i documenti Genesi,
   che citano IREDES come formato di scambio, non come convenzione sull'assenza)
```
Cioè: le nostre sei bandiere sono state **inventate da capo**, e bene. Ma non
hanno mai potuto essere confrontate con la lista chiusa di chi fa questo da
vent'anni, e infatti si vede dove sono corte (D5).

### D5 · Il nostro vocabolario contro il loro: dove è corto, e dove è più fine

| loro | noi | stato |
|---|---|---|
| `unknown` / `UNK` (non si sa) | `misurabile:false`, `noto:false` | **c'è** |
| `inapplicable` / `NA` (non si applica) | — | **manca**: da noi non-applicabile e non-misurato finiscono nella stessa cella vuota |
| `template` / `NAV` (arriverà più tardi) | `pochi` ci si avvicina («ancora troppo poco per dirlo») | **parziale** |
| `NASK` (nessuno ha chiesto) vs `ASKU` (chiesto, non si sa) | l'idea è scritta in CLAUDE.md per l'appello di Campo, ma **non è una bandiera** | **manca come codice** |
| `withheld` / `MSK` (c'è ma non si mostra) | — | **manca** (oggi non serve; servirà il giorno dei ruoli dentro l'organizzazione) |
| `not-a-number` (illeggibile) | `leggibile:false` | **c'è**, ed è più chiaro del loro |
| `I` *imputed* (valore messo per riempire, dichiarato) | la decisione 1 di Flotta lo fa **senza dichiararlo nel file** | **parziale** |
| `CONF_STATUS` su un asse separato | — | **manca l'asse**, non il caso |

---

## 4. PROPOSTE

Formato: **dove · che cosa non va · come si vede · quanto costa · come si
misura.** Nessuna di queste entra in roadmap sulla mia parola: i numeri sopra
sono misurati, le proposte no.

**P1 — Il lettore non cancella: dichiara.**
· **Dove:** gli 8 lettori muti di D2, a partire da `parseRilieviCsv`
(`terra-data.js:1763`) e `parsePesateCsv`/`parseIncassiCsv`/`parseListinoCsv`
(conti). · **Che cosa non va:** una riga con un dato mancante viene **cancellata
dentro il lettore**, che restituisce solo i sopravvissuti: la pagina conta
`righe.length` su un numero già ripulito e non può dire niente, nemmeno
volendo. Un ripristino da copia di sicurezza può quindi perdere righe **in
silenzio totale**. · **Come si vede:** si esporta un CSV di rilievi in cui un
volume non è stato misurato, lo si ri-importa, e il messaggio dice «Rimesse
dentro N» senza mai nominare la riga sparita. · **Quanto costa:** la forma
esiste già ed è quella di `rientroRilievi` — il lettore restituisce
`{ righe, scartate: [{ riga, ragione }] }`, e i punti d'uso aggiungono una coda
al toast. Otto lettori, otto punti d'uso; la firma va allargata **una volta
sola** in `shared/` se la scelta è di renderla comune (regola: una regola che
serve a due app vive in `shared/dw-ponti.js`). · **Come si misura:** il
censimento di D2 rifatto — `punti di import muti: 8 → 0` — più una prova per
lettore che gli passa un CSV con una riga incompleta e pretende
`scartate.length === 1` **con la ragione giusta**, non solo diversa da zero.

**P2 — La ragione viaggia nella cella, con un vocabolario chiuso.**
· **Dove:** gli 11 CSV che rientrano davvero (D1), non i prospetti. · **Che cosa
non va:** la cella vuota dice *che* manca e mai *perché*: chi riapre il file —
il commercialista, l'ente, noi fra sei mesi — non distingue «il drone non è
passato» da «non si applica a questo fronte» da «il file della macchina era
illeggibile». D3 lo misura a zero. · **Come si vede:** si apre
`rilievi.csv` e si guarda la riga `2026-08-05;;drone;;F1;scavo`: la seconda
colonna è vuota, e non c'è niente in tutto il file che spieghi il vuoto.
· **Quanto costa:** una colonna `stato` per riga (non per cella), con **sei
codici derivati dalle bandiere che già abbiamo** e una corrispondenza dichiarata
con SDMX/GML — es. `mai-misurato` (≈ `L`/`unknown`), `non-applicabile`
(≈ `z`/`inapplicable`), `illeggibile` (≈ `not-a-number`), `non-ancora`
(≈ `template`), `predefinito` (≈ `I`, la decisione 1 di Flotta), `misurato`.
Il vocabolario sta in `shared/dw-ponti.js`; ogni scrittore aggiunge una colonna,
ogni lettore la legge e la ignora se non la conosce (compatibilità all'indietro:
un file vecchio a sei colonne resta leggibile — è la stessa scelta già presa in
`parseRilieviCsv:1776` per il `fronte`). · **Come si misura:** prova di andata e
ritorno che pretende che **il codice torni identico** (`terra.X === ponti.X` per
i codici, non il comportamento), più il conto degli scrittori che scrivono la
colonna: `0/11 → 11/11`. E la prova che conta: un record con un'assenza e un
record con uno **zero misurato** devono uscire **diversi** e rientrare
**diversi** — un campione solo non distingue «funziona» da «sono tutti uguali».
⚠️ **Non è nuova a metà:** `docs/RICERCA_CONTINUA_TERRA.md:300` propone già una
**nota in fondo al CSV di Terra** che spieghi vuoto contro zero. Questa proposta
la generalizza e la rende **leggibile da un programma** invece che da una
persona; se si sceglie la nota, quella riga va aggiornata da chi la chiude.

**P3 — Il file dichiara la propria convenzione (stile WITSML/Frictionless).**
· **Dove:** tutti e 21 gli scrittori CSV. · **Che cosa non va:** un nostro CSV
non dice da nessuna parte che cosa vuol dire una cella vuota. Chi lo apre con un
programma conforme a CSVW o a Table Schema **per definizione non lo sa** (§1.6),
e chi lo apre con Excel vede una cella vuota identica a una cella cancellata per
sbaglio. · **Come si vede:** si apre un qualunque nostro CSV: la prima riga è
l'intestazione delle colonne e basta. · **Quanto costa:** **una riga di
commento** in testa, uguale per tutti, scritta in un posto solo
(`shared/dw-ponti.js`) e usata dai 21 scrittori — «cella vuota = dato non
disponibile; `0` = valore misurato pari a zero; i numeri hanno il punto
decimale». È la proposta più economica delle tre e quella che protegge di più il
cliente. ⚠️ Va misurato prima **che cosa fanno i nostri lettori con una riga di
commento in testa** (`isIntestazione` guarda la prima parola): se la scartano
già, il costo è zero; se no, la riga va nel nome del file o in un `.txt`
gemello. · **Come si misura:** conto degli scrittori la cui prima riga dichiara
la convenzione (`0/21 → 21/21`), **e** una prova di andata e ritorno per tutte e
11 le coppie che pretende che il file con la riga in più si rilegga identico —
se no la difesa rompe i ripristini, che è peggio del difetto.

**P4 — Lo zero dichiarato di Flotta esce come dichiarato.**
· **Dove:** `csvRicambi` (`flotta-data.js:647`). · **Che cosa non va:** una
giacenza mai contata esce nel file scritta `0`, per una decisione **giusta e
motivata** (nasconderla nasconderebbe i pezzi finiti). Ma la motivazione resta
**dentro casa**: il file che va al magazziniere o al fornitore dice «zero pezzi»
con la stessa faccia con cui direbbe un conteggio vero. È il caso `I`
(*imputed*) di SDMX, che nello standard **ha un codice apposta** proprio perché
un valore messo per riempire non si può confondere con uno misurato. · **Come si
vede:** D1, riga `Ricambi (flotta) | giacenza = 0`. · **Quanto costa:** se entra
P2, **niente**: è una riga di codice che marca quella cella `predefinito`. Da
sola, una colonna in più nel solo CSV dei ricambi. · **Come si misura:** il giro
di D1 rifatto: la riga Ricambi deve tornare `giacenza = 0` **con** lo stato
`predefinito`, e un ricambio contato davvero a zero deve tornare `0` con lo
stato `misurato` — i due casi devono essere **distinguibili nel file**, che oggi
non lo sono.

---

## 5. RIASSUNTO PER IL FONDATORE

Fuori da noi, chiunque debba consegnare numeri a un ente ha imparato la stessa
cosa: **un numero che manca ha bisogno di due informazioni, non di una** — che
manca, e perché. La statistica europea lo scrive con due punti e una lettera
(`:` e `:z`); i dati geografici con un elemento vuoto e un attributo
(`nilReason="unknown"`); la sanità con un vocabolario così fine da distinguere
«gliel'ho chiesto e non lo sa» da «non gliel'ho chiesto». E nessuno di loro,
mai, mette un numero al posto del buco: al massimo lo fa **dichiarandolo**, con
un codice apposta.

Noi siamo messi meglio di quanto sembri: l'assenza ha un nome
(`numeroDichiarato`), sei bandiere e un controllo che pretende che qualcuno le
legga; **sette giri di andata e ritorno su undici conservano l'assenza**; Genesi
ha già inventato da sola, il 13/08, l'esatto disegno dello standard geografico.
Quello che manca è tutto **sul confine**: appena il dato esce in un file, la
ragione resta dentro. E in un punto il confine si mangia il dato intero — otto
punti d'importazione su tredici **cancellano in silenzio** una riga a cui manca
un numero, e non per distrazione: il filtro sta dentro il lettore, che
restituisce solo i sopravvissuti, quindi la pagina **non potrebbe dirlo nemmeno
volendo**.

L'ordine di valore è questo: prima P1 (una riga non sparisce senza che qualcuno
lo dica), poi P3 (il file spiega sé stesso, e costa una riga), poi P2 (la
ragione diventa leggibile da un programma).
