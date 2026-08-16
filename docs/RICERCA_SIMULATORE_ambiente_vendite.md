# Ricerca — parametri di mondo per il simulatore di cava sintetica
## Metà A: monitoraggio ambientale · Metà B: lato commerciale

**Data della ricerca:** 16/08/2026
**Ambito:** SOLO la metà sul MONDO. Questo documento **non apre il nostro codice** e
non dice che cosa manchi alle nostre app: il delta lo fa chi ha il codice in mano.
**Strumento usato:** `WebSearch`.
**Limite dichiarato dello strumento — leggere prima dei numeri:** `WebFetch` non è
disponibile in questo contenitore, quindi **non ho letto nessun testo primario**:
né la Gazzetta Ufficiale, né una norma UNI/DIN, né un prezzario regionale, né un
rapporto ARPA. Tutto quello che c'è scritto qui viene da **estratti di risultati di
ricerca**. È la differenza fra sapere *che cosa esiste* e sapere *che cosa dice*.

---

## Legenda delle marcature

| Marcatura | Significato |
|---|---|
| `[fonte citata]` | Valore letto sulla fonte primaria. **In questo documento non compare mai**, perché non ho potuto aprire nessuna fonte primaria. La riga resta nella legenda per non far credere a un lettore distratto che le altre due marcature siano la stessa cosa. |
| `[da risultati di ricerca]` | Valore riportato negli estratti dei risultati di `WebSearch`. Seconda mano. Il numero può essere giusto, ma **nessuno di noi lo ha verificato sulla fonte**. |
| `[dedotto]` | Non l'ha detto nessuna fonte: l'ho ricavato io (conversione, media, coerenza fra due numeri, ragionamento). Il più fragile dei tre. |

> ⛔ **VINCOLO DICHIARATO NEL MANDATO, RIPETUTO QUI PERCHÉ IL DOCUMENTO NON VIAGGI
> SENZA:** le soglie di sicurezza e i limiti di norma (curve USBM, DIN 4150, limiti
> acustici, limiti PM10) **non si toccano e non si cambiano** nel prodotto. Qui sono
> **descritti come informazione sul mondo**, di seconda mano. **Nessun valore di
> questo documento può finire in un'interfaccia, in un export o in un documento per
> un cliente prima di essere verificato sulla fonte primaria.** Un numero di legge
> riportato di seconda mano e mostrato a un cliente è peggio di un numero assente.

---

# METÀ A — MONITORAGGIO AMBIENTALE DI UNA CAVA

## A.1 · Vibrazioni da brillamento

### Che cosa si misura, e con che cosa

Un **sismografo da cantiere** (blasting seismograph) è composto da tre pezzi
[da risultati di ricerca]:

1. un **geofono triassiale**, cioè tre geofoni montati insieme — due orizzontali a
   90° fra loro e uno verticale. I tre assi si chiamano **longitudinale** (o
   radiale: verso la volata e via da essa), **trasversale** (di fianco) e
   **verticale**;
2. un **registratore digitale** (data logger) che campiona e registra;
3. un **microfono di sovrapressione**, che è il **quarto canale**: registra
   l'**air-blast** (onda d'aria).

Il geofono funziona per **induzione elettromagnetica**: la sua carcassa è
accoppiata al terreno, il terreno vibra, la bobina si muove nel campo del magnete e
produce una tensione proporzionale alla **velocità** [da risultati di ricerca].

**Come si avvia una registrazione.** Non registra in continuo: parte su **trigger**,
cioè quando la vibrazione supera una soglia impostata. Dopo lo scatto lo strumento
mostra **numero dell'evento, data e ora, il PPV di picco in mm/s su ciascuno dei tre
assi, le frequenze associate e la sovrapressione d'aria in dB lineari di picco**
[da risultati di ricerca].

**Un dettaglio che il simulatore può riprodurre gratis e che rende credibile la
scena:** l'onda aerea viaggia in aria (~340 m/s) mentre quella di terra viaggia
nella roccia (migliaia di m/s), quindi **l'air-blast arriva SEMPRE dopo** la
vibrazione del terreno [da risultati di ricerca]. A 500 m lo scarto è dell'ordine
del secondo e mezzo [dedotto].

### Le norme di misura che vengono citate

| Norma | Che cosa copre (come riportato) | Marcatura |
|---|---|---|
| **UNI 9916** | «Criteri di misura e valutazione degli effetti delle vibrazioni **sugli edifici**» | [da risultati di ricerca] |
| **UNI 9614** | Misura delle vibrazioni negli edifici e criteri di valutazione del **disturbo alle persone** | [da risultati di ricerca] |
| **DIN 4150-3** | Effetti delle vibrazioni sulle strutture: danno da costruzioni, traffico, esplosioni, industria | [da risultati di ricerca] |
| **BS 7385-2**, **ISO 4866** | Stessa famiglia | [da risultati di ricerca] |
| **USBM RI 8507** (Siskind et al., 1980) | Criterio «safe level» per volate in miniera di superficie, dipendente dalla **frequenza** | [da risultati di ricerca] |

Tutte queste norme usano **PPV** come grandezza di giudizio e **l'FFT** per
individuare la **frequenza dominante** [da risultati di ricerca]. Quindi il dato
minimo di un evento non è un numero solo: è **(PPV, frequenza)**, per tre assi, più
il dB dell'air-blast.

### Le soglie — riportate, NON verificate

> ⚠️ **Tutta questa sottosezione è di seconda mano e va verificata sulla fonte prima
> di finire in qualunque interfaccia.** Le due famiglie di criteri (europea DIN/UNI e
> americana USBM) **non sono intercambiabili** e non vanno mescolate in un unico
> numero.

| Criterio | Valore riportato | Marcatura |
|---|---|---|
| DIN 4150-3, edifici **industriali/commerciali** | fra **20 e 50 mm/s**, secondo categoria e frequenza | [da risultati di ricerca] |
| DIN 4150-3, edifici **residenziali** | in genere fra **5 e 20 mm/s**, secondo sensibilità, stato dell'edificio e frequenza | [da risultati di ricerca] |
| USBM RI 8507, 4–15 Hz, case moderne in **cartongesso** | **0,75 in/s = 19,05 mm/s** | [da risultati di ricerca] + conversione [dedotto] |
| USBM RI 8507, 4–15 Hz, interni in **intonaco su listelli** | **0,50 in/s = 12,7 mm/s** | [da risultati di ricerca] + conversione [dedotto] |
| Criterio precedente che RI 8507 ha sostituito | **51 mm/s**, ridotto di un fattore **2,5–3** nella banda 4–12 Hz | [da risultati di ricerca] |
| **Air-blast**, limite USBM/OSMRE per impulsivo | **133 dB(L)**, con strumento a risposta almeno **2–200 Hz** (RI 8485) | [da risultati di ricerca] |

⚠️ **dB(L) non è dBA.** Il dB(L) è una scala **lineare** non pesata; il dBA pesa in
base alla risposta dell'orecchio. Confonderli è un errore che cambia il numero di
parecchie unità [da risultati di ricerca].

⚠️ **La curva USBM è dipendente dalla frequenza**: i valori sopra valgono nella banda
bassa (4–15 Hz). Sopra quella banda il criterio ammette PPV più alti. **La forma
esatta della curva non l'ho potuta leggere**, solo il tratto piatto basso —
vedi «quello che non sono riuscito a trovare».

### La legge di attenuazione (utile per generare eventi sintetici)

La forma usata ovunque è [da risultati di ricerca]:

```
PPV = K · (SD)^(-b)        con   SD = D / W^d      (distanza scalata)
```

dove `D` è la distanza dalla volata, `W` la **carica per ritardo** (non la carica
totale), `d = 1/2` per carica **cilindrica** (il caso di un foro da mina) e
`d = 1/3` per carica **sferica** [da risultati di ricerca].

`K` e `b` sono **costanti di sito**: dipendono dalla roccia, dalla geologia e
dall'esplosivo, e si ricavano per **regressione su volate di prova**
[da risultati di ricerca].

Valori di `K` e `b` riportati negli estratti:

| Fonte riportata | K | b | Marcatura |
|---|---|---|---|
| Intervallo generale citato | **40 – 240** | **1,2 – 1,6** | [da risultati di ricerca] |
| Miniere USA — valore medio | **1140** | — | [da risultati di ricerca] |
| Miniere USA — limite superiore roccia dura | **1725** | — | [da risultati di ricerca] |
| Miniere USA — roccia molto confinata | **4316** | — | [da risultati di ricerca] |

⛔ **Le due famiglie di `K` non sono confrontabili e non vanno messe nella stessa
formula.** Uno stacco di un fattore ~10 fra «40–240» e «1140–4316» non è geologia:
è quasi certamente un cambio di **unità** (mm/s contro in/s, metri contro piedi, kg
contro libbre) [dedotto]. Chi implementa deve **calibrare K sui propri dati**, non
copiarlo: la formula è portabile, la costante no.

### Che valori di PPV si misurano davvero ai ricettori

Questo è il punto in cui i risultati di ricerca sono **molto dispersi**, e la
dispersione è essa stessa l'informazione:

| Studio (come riportato) | PPV misurato | Distanza / carica | Marcatura |
|---|---|---|---|
| Cava di calcare, monitoraggio | **0,28 – 0,83 mm/s** | non specificata | [da risultati di ricerca] |
| Cava di calcare, esposizione a vibrazioni da volata | **0,80 – 17,40 mm/s** | non specificata | [da risultati di ricerca] |
| Cava di calcare | **70,5 mm/s** (max) | 115 m, 100 kg | [da risultati di ricerca] |
| Stesso studio | **15,0 mm/s** (min) | 440 m, 200 kg | [da risultati di ricerca] |
| Monitoraggio presso abitazione più vicina | **48,27 mm/s** | 500 m | [da risultati di ricerca] |

⚠️ **Non prendere una media di questi numeri.** Sono siti diversi, rocce diverse,
cariche diverse e — soprattutto — **regimi di progettazione diversi**: un sito che
misura 48 mm/s a 500 m sta ben sopra qualunque soglia residenziale citata sopra, e
quindi **non descrive una cava che lavora entro i limiti**. Metterli insieme in un
«valore tipico» produrrebbe un simulatore che genera continuamente superamenti.

**Intervallo che propongo per il simulatore, e lo dichiaro `[dedotto]`:** una cava
che rispetta i limiti, con ricettori a 300–800 m, produce ai ricettori valori
**dell'ordine di 0,5 – 5 mm/s**, con code occasionali a **5 – 15 mm/s** su volate
grosse, direzioni sfavorevoli o accoppiamenti di roccia particolari. Non è un dato:
è la fascia coerente con il fatto che i limiti residenziali citati stanno a
5–20 mm/s e che una cava autorizzata deve starci sotto **con margine**.

### Ogni quanto si misura

**Non ho trovato una periodicità stabilita a livello nazionale.** Quello che i
risultati dicono è che la frequenza è **fissata caso per caso nel PMA** (piano di
monitoraggio ambientale) che diventa parte integrante dell'autorizzazione
[da risultati di ricerca] — vedi §A.4. La prassi di misurare **a ogni volata** dove
ci sono ricettori vicini è **plausibile e coerente col fatto che lo strumento è a
trigger**, ma **non l'ho trovata scritta**: `[dedotto]`.

### Tabella parametri — A.1 Vibrazioni

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Assi registrati | 3 (longitudinale/radiale, trasversale, verticale) | — | uwavems, explosives.org, Agg-Net | [da risultati di ricerca] |
| Canali totali sismografo | 4 (3 geofono + 1 microfono) | — | Agg-Net, explosives.org | [da risultati di ricerca] |
| Grandezze per evento | PPV per asse, frequenza dominante per asse, air-blast di picco, data/ora, n° evento | — | Agg-Net | [da risultati di ricerca] |
| Banda del microfono air-blast | ≥ 2 – 200 | Hz | USBM RI 8485 via Agg-Net | [da risultati di ricerca] |
| Soglia air-blast USBM | 133 | dB(L) | Agg-Net, ERG Industrial | [da risultati di ricerca] |
| Soglia PPV residenziale DIN 4150-3 | 5 – 20 | mm/s | Micromega Dynamics | [da risultati di ricerca] |
| Soglia PPV industriale DIN 4150-3 | 20 – 50 | mm/s | Micromega Dynamics | [da risultati di ricerca] |
| Soglia USBM 4–15 Hz, cartongesso | 19,05 (0,75 in/s) | mm/s | REVEY / vibrationmonitoringcourse | [da risultati di ricerca] |
| Soglia USBM 4–15 Hz, intonaco | 12,7 (0,50 in/s) | mm/s | REVEY / vibrationmonitoringcourse | [da risultati di ricerca] |
| Banda di frequenza critica | 4 – 15 (criterio più severo 4–12) | Hz | RI 8507 via REVEY | [da risultati di ricerca] |
| Legge di attenuazione | PPV = K·(D/W^d)^(-b) | — | ScienceDirect, EFEE | [da risultati di ricerca] |
| Esponente carica, foro cilindrico | d = 0,5 | — | EFEE | [da risultati di ricerca] |
| Esponente carica, carica sferica | d = 0,333 | — | EFEE | [da risultati di ricerca] |
| Esponente attenuazione b | 1,2 – 1,6 | — | jge / oup | [da risultati di ricerca] |
| Costante K | site-specific, **da calibrare** (40–240 in un sistema di unità; 1140–4316 in un altro) | — | jge, eweb.org | [da risultati di ricerca] |
| PPV al ricettore, cava entro i limiti | 0,5 – 5 (code 5 – 15) | mm/s | — | **[dedotto]** |
| Ritardo air-blast rispetto a onda di terra, a 500 m | ~1,5 | s | — | **[dedotto]** |
| Periodicità della misura | fissata nel PMA, non nazionale | — | ARPA FVG LG21.02 | [da risultati di ricerca] |

---

## A.2 · Rumore verso l'esterno

### L'impianto normativo (riportato)

- **Legge quadro 26 ottobre 1995 n. 447** — inquinamento acustico
  [da risultati di ricerca].
- **DPCM 14 novembre 1997** — «Determinazione dei valori limite delle sorgenti
  sonore». Contiene **Tabella A** (classi di destinazione d'uso del territorio),
  **Tabella B** (valori limite di **emissione**), **Tabella C** (valori limite
  assoluti di **immissione**), **Tabella D** (valori di **qualità**)
  [da risultati di ricerca].
- **DM 16 marzo 1998** — tecniche di rilevamento e misurazione
  [da risultati di ricerca].
- La misura la fa un **tecnico competente in acustica ambientale**, figura istituita
  dalla L. 447/95 [da risultati di ricerca].

### Le quattro cose che vanno tenute distinte

1. **Limite di immissione (assoluto)** — il rumore che arriva all'esterno da
   **tutte le sorgenti insieme**, confrontato col limite della **classe acustica**
   in cui sta il ricettore.
2. **Limite di emissione** — il rumore della **singola sorgente** (la cava).
3. **Criterio differenziale** — quanto la cava fa **salire** il rumore rispetto al
   fondo, misurato **dentro** l'abitazione.
4. **Valori di qualità** — obiettivi, non limiti.

Il criterio differenziale è **aggiuntivo** ai limiti assoluti, **non li sostituisce**
[da risultati di ricerca]. Cioè una cava può stare sotto il limite assoluto e
sforare lo stesso.

### I numeri — riportati, NON verificati

> ⚠️ **Seconda mano.** Le tabelle vere stanno nell'allegato al DPCM 14/11/1997 in
> Gazzetta Ufficiale, che non ho potuto aprire.

**Periodi di riferimento:** diurno **06:00–22:00**, notturno **22:00–06:00**
[da risultati di ricerca].

**Tabella C — valori limite assoluti di immissione, i soli confermati dai risultati:**

| Classe | Descrizione | Diurno | Notturno | Marcatura |
|---|---|---|---|---|
| III | aree di tipo **misto** | **60** dB(A) | **50** dB(A) | [da risultati di ricerca] |
| V | aree prevalentemente **industriali** | **70** dB(A) | **60** dB(A) | [da risultati di ricerca] |
| VI | aree **esclusivamente** industriali | **70** dB(A) | **70** dB(A) | [da risultati di ricerca] |

Le classi **I, II e IV** e **tutta la Tabella B (emissione)** **non sono state
confermate** dai risultati di ricerca. Vedi «quello che non sono riuscito a trovare»:
lì scrivo i valori che credo, marcati `[dedotto]`, **fuori** da questa tabella,
perché non voglio che si copino da qui.

**Criterio differenziale** [da risultati di ricerca]:

| Elemento | Valore | Marcatura |
|---|---|---|
| Limite differenziale **diurno** | **5** dB | [da risultati di ricerca] |
| Limite differenziale **notturno** | **3** dB | [da risultati di ricerca] |
| Dove si misura | **all'interno degli ambienti abitativi** | [da risultati di ricerca] |
| Dove **non** si applica | classe **VI** della Tabella A | [da risultati di ricerca] |

**Soglie di non applicabilità del differenziale** (art. 4 c. 2 DPCM 14/11/97, come
riportato): il disturbo è ritenuto trascurabile e il criterio non si applica se
[da risultati di ricerca]:

| Condizione | Diurno | Notturno |
|---|---|---|
| Rumore **ambientale** misurato a **finestre aperte** inferiore a | **50** dB(A) | **40** dB(A) |
| Rumore **ambientale** misurato a **finestre chiuse** inferiore a | **35** dB(A) | **25** dB(A) |

Questo è un meccanismo che un simulatore può riprodurre e che produce una scena
realistica: **una cava lontana da centri abitati non è soggetta al differenziale**,
perché il rumore che arriva è già sotto quelle soglie.

### Ogni quanto si misura

Come per le vibrazioni: **non ho trovato una periodicità nazionale**. La frequenza
delle campagne fonometriche è quella prescritta nel **PMA / atto autorizzativo**
[da risultati di ricerca]. ARPA FVG ha linee guida distinte per le
**indagini fonometriche** di controllo e per le **attività temporanee**
[da risultati di ricerca].

### Tabella parametri — A.2 Rumore

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Periodo diurno | 06:00 – 22:00 | — | DPCM 14/11/97 via ANIT | [da risultati di ricerca] |
| Periodo notturno | 22:00 – 06:00 | — | DPCM 14/11/97 via ANIT | [da risultati di ricerca] |
| Numero di classi acustiche | 6 (I…VI) | — | DPCM 14/11/97 via ANIT/Magister | [da risultati di ricerca] |
| Immissione classe III | 60 / 50 | dB(A) Leq | cedingegneria, Magister | [da risultati di ricerca] |
| Immissione classe V | 70 / 60 | dB(A) Leq | cedingegneria, Magister | [da risultati di ricerca] |
| Immissione classe VI | 70 / 70 | dB(A) Leq | cedingegneria, Magister | [da risultati di ricerca] |
| Differenziale diurno | 5 | dB | ST-LINE, ARPAE | [da risultati di ricerca] |
| Differenziale notturno | 3 | dB | ST-LINE, ARPAE | [da risultati di ricerca] |
| Soglia non applicabilità, finestre aperte | 50 (diurno) / 40 (notturno) | dB(A) | Legislazione Tecnica, Magister | [da risultati di ricerca] |
| Soglia non applicabilità, finestre chiuse | 35 (diurno) / 25 (notturno) | dB(A) | Legislazione Tecnica, Magister | [da risultati di ricerca] |
| Chi misura | tecnico competente in acustica ambientale | — | acustico.com | [da risultati di ricerca] |
| Periodicità campagne | fissata dal PMA / autorizzazione | — | ARPA FVG | [da risultati di ricerca] |

---

## A.3 · Polveri: PM10 e polveri sedimentabili

Sono **due misure diverse**, con strumenti diversi, unità diverse e regimi
normativi diversi. Confonderle è l'errore più facile di questo capitolo.

### PM10 — qualità dell'aria

Materiale particolato in sospensione, misurato in **µg/m³** su volume d'aria
aspirato. È regolato dal **D.Lgs 155/2010**, che è la norma sulla **qualità
dell'aria ambiente**, non una norma sulle cave [da risultati di ricerca].

| Limite | Valore | Marcatura |
|---|---|---|
| Media **annua** | **40 µg/m³** | [da risultati di ricerca] |
| Media **giornaliera** | **50 µg/m³** | [da risultati di ricerca] |
| Superamenti giornalieri ammessi | **35** all'anno civile | [da risultati di ricerca] |

> ⚠️ Seconda mano. E c'è un'incertezza in più: la revisione europea dei limiti di
> qualità dell'aria (direttiva 2024/2881) **non l'ho verificata** — vedi «quello che
> non sono riuscito a trovare». Un limite PM10 scritto in un'interfaccia oggi
> potrebbe già essere quello vecchio.

### Polveri sedimentabili — deposizione

Sono la polvere che **si deposita** per gravità su una superficie, misurata in
**mg/m²·giorno**. Si misura con un **deposimetro**, tipicamente **tipo Bergerhoff**
(«bulk»): un imbuto cilindrico su una bottiglia di raccolta, **campionatore
passivo**, senza alimentazione elettrica [da risultati di ricerca].

**Periodo di esposizione: circa un mese** [da risultati di ricerca]. Questo è il
dato di ritmo che serve al simulatore: la polvere sedimentabile **non è un dato
giornaliero**, è un valore mensile per punto di misura.

Confrontando più deposimetri in posizioni diverse si valuta l'impatto delle
lavorazioni e l'esposizione della popolazione [da risultati di ricerca].

**Valore di riferimento trovato — e va letto con attenzione:** un obiettivo di
qualità di **250 mg/m²·giorno** per le polveri totali, ma in un caso **specifico di
un impianto siderurgico**, non un limite nazionale [da risultati di ricerca].

⛔ Da quanto ho trovato, **non esiste un limite di legge nazionale italiano per le
polveri sedimentabili**: i valori che si incontrano sono **prescrizioni
autorizzative** o **obiettivi di qualità** definiti caso per caso `[dedotto dai
risultati]`. Il valore TA-Luft di 350 mg/m²·giorno che si sente citare
**non è stato confermato** dai risultati — vedi la sezione finale.

### Tabella parametri — A.3 Polveri

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| PM10 media annua | 40 | µg/m³ | ARPA Piemonte, ISPRA | [da risultati di ricerca] |
| PM10 media giornaliera | 50 | µg/m³ | ARPA Piemonte, ISPRA | [da risultati di ricerca] |
| PM10 superamenti/anno ammessi | 35 | conteggio | ARPA Piemonte, ISPRA | [da risultati di ricerca] |
| Strumento polveri sedimentabili | deposimetro Bergerhoff «bulk», passivo | — | SNPA / ARPA FVG | [da risultati di ricerca] |
| Durata esposizione deposimetro | ~30 | giorni | SNPA, ARPA VdA | [da risultati di ricerca] |
| Unità polveri sedimentabili | mg/(m²·giorno) | — | ARPAL, ARPA Umbria | [da risultati di ricerca] |
| Obiettivo di qualità trovato (contesto siderurgico, **non cava**) | 250 | mg/(m²·giorno) | ARPAL | [da risultati di ricerca] |
| Esistenza di un limite nazionale per le sedimentabili | **nessuno trovato** | — | — | **[dedotto]** |

---

## A.4 · Chi controlla: il rapporto con ARPA

### Lo strumento che regge tutto: il PMA

Il **Piano di Monitoraggio Ambientale (PMA)** viene allegato all'atto autorizzativo
e **diventa parte integrante dell'autorizzazione**: è lo strumento con cui si
verifica l'impatto reale dell'attività estrattiva [da risultati di ricerca].

**Matrici ambientali coperte** [da risultati di ricerca]:
aria · acque sotterranee · acque superficiali · **rumore** · **vibrazioni** ·
biodiversità · **radiazioni ionizzanti** (queste ultime specifiche solo per le
**cave di monte**).

**Fasi:** il monitoraggio copre il periodo di coltivazione e, dove pertinente, anche
le attività di **recupero ambientale** [da risultati di ricerca].

### Chi fa che cosa

- Il **proponente/esercente** redige il PMA ed esegue le misure.
- **ARPA regionale** valuta il piano in sede di VIA/autorizzazione e svolge i
  controlli [da risultati di ricerca].
- **Provincia / Città metropolitana / Regione** sono le autorità competenti
  all'autorizzazione, a seconda della legge regionale [da risultati di ricerca].
- Per gli impianti soggetti ad **AIA** lo strumento analogo si chiama **PMC**
  (Piano di Monitoraggio e Controllo) [da risultati di ricerca].

Esiste una linea guida ARPA FVG dedicata proprio a questo:
**LG21.01** («struttura di un piano di monitoraggio relativo alla VIA») e
**LG21.02** («redazione di un piano di monitoraggio di un'attività estrattiva»)
[da risultati di ricerca]. È il documento più vicino a una specifica operativa che
ho trovato, e **rimanda esplicitamente a UNI 9614 e UNI 9916** per le vibrazioni
[da risultati di ricerca].

### La consegna annuale dei quantitativi

Separata dal monitoraggio ambientale c'è la **statistica mineraria annuale**: il
titolare di autorizzazione di cava è tenuto a **comunicare ogni anno alla Regione i
dati statistici** sull'attività estrattiva; in Piemonte, per esempio, attraverso il
portale telematico **«Servizio Esercenti Minerari»** [da risultati di ricerca].
A livello nazionale i dati confluiscono in **UNMIG** (Ufficio nazionale minerario
per gli idrocarburi e le georisorse, MASE) che pubblica la statistica, storicamente
in collaborazione con **ISTAT** [da risultati di ricerca].

**La scadenza di quella dichiarazione non l'ho trovata** — vedi sezione finale.

### Tabella parametri — A.4 Controlli

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Documento che fissa il monitoraggio | PMA, parte integrante dell'autorizzazione | — | Assimpredil ANCE, ARPA Lombardia | [da risultati di ricerca] |
| Matrici monitorate | aria, acque sotterranee, acque superficiali, rumore, vibrazioni, biodiversità (+ rad. ionizzanti in cave di monte) | — | ARPA FVG LG21.02 | [da risultati di ricerca] |
| Analogo per impianti AIA | PMC | — | ARPAT, ARPA Veneto | [da risultati di ricerca] |
| Norme richiamate per vibrazioni | UNI 9614, UNI 9916 | — | ARPA FVG LG21.02 | [da risultati di ricerca] |
| Fasi coperte | coltivazione + recupero ambientale | — | ARPA FVG LG21.02 | [da risultati di ricerca] |
| Consegna annuale quantitativi | statistica mineraria annuale alla Regione | — | Regione Piemonte | [da risultati di ricerca] |
| Aggregatore nazionale | UNMIG (MASE), con ISTAT | — | unmig.mase.gov.it, ISTAT | [da risultati di ricerca] |
| Periodicità dei controlli ARPA | **non trovata** (definita caso per caso) | — | — | — |

---

# METÀ B — IL LATO COMMERCIALE

## B.5 · Prezzi degli inerti

### Due mondi di prezzo che non vanno confusi

⛔ **La distinzione più importante di tutta questa metà**, e la sbaglierebbe
chiunque metta i due numeri nella stessa colonna:

1. **Prezzo franco cava** (o «f.co cava»): il materiale caricato sul camion in
   piazzale. È quello che una cava fattura. **Ordine di grandezza: 8–28 €/t.**
2. **Voce di prezzario regionale per opere pubbliche**: comprende
   **fornitura, stesa, livellamento e compattazione in opera**, cioè una
   lavorazione, non una fornitura. **Ordine di grandezza: 28–57 €/m³.**
   `[dedotto]` sul fatto che includa la posa — è la ragione per cui i due numeri
   divergono così tanto, e va verificata leggendo la descrizione della voce.

Chi confronta i due numeri senza saperlo conclude che il prezzario paga il triplo
del mercato. Non è vero: **sta comprando un'altra cosa**.

### Prezzi franco cava trovati nei listini pubblici

⚠️ Tutti da listini di **singole aziende**, anni **2022–2024**. Sono **prezzi di
un'azienda in un momento**, non un indice di mercato.

| Materiale | Prezzo | Unità | Nota | Marcatura |
|---|---|---|---|---|
| Misto granulare stabilizzato 0/30 | 2,54 €/q → **25,40** | €/t | dichiarato anche come 38,00 €/m³ | [da risultati di ricerca] |
| Sabbia naturale 0/2 | 2,82 €/q → **28,20** | €/t | dichiarato anche come 45,00 €/m³ | [da risultati di ricerca] |
| Ghiaia naturale 0/10, 10/25 | 2,76 €/q → **27,60** | €/t | dichiarato anche come 40,00 €/m³ | [da risultati di ricerca] |
| Stabilizzato (spurgo fino) | **8,00** | €/t | il più basso trovato | [da risultati di ricerca] |
| Misto naturale (tout-venant) di fiume o cava | **11,01 – 14,73** | €/t | | [da risultati di ricerca] |
| Sabbie vagliate, sabbia fine da intonaco, ghiaie/pietrischi 7/15 e 15/30 (area Biella) | **14,80 – 22,78** | €/t | | [da risultati di ricerca] |
| Franco cava, Emilia (cava Gaianello) | **18,00** | €/t | escluso trasporto | [da risultati di ricerca] |
| Franco cava, Emilia (cava Montecreto) | **15,00** | €/t | escluso trasporto | [da risultati di ricerca] |
| Sabbia naturale (elenco prezzi di gara) | **20,72** | €/t | densità dichiarata 1,60 t/m³ | [da risultati di ricerca] |

⚠️ **Una nota di mestiere che emerge dai listini**: gli inerti sono
**venduti a peso** (quintali/tonnellate), non a volume — il volume compare come
indicazione di comodo [da risultati di ricerca]. È coerente con la pesa a ponte
(§B.7).

### Trasporto

Il trasporto è una voce a parte e **cresce a scaglioni di distanza**
[da risultati di ricerca]:

| Distanza | Costo |
|---|---|
| 0 – 10 km | **3,00 €/t** |
| 11 – 20 km | **4,00 €/t** |
| 21 – 30 km | **6,00 €/t** |

⚠️ **Questo è il numero che spiega perché il mercato degli inerti è locale.** Su un
materiale da 15 €/t, 30 km di trasporto aggiungono il **40%** `[dedotto]`. Un
simulatore che non modella il trasporto non riprodurrà mai il fatto che una cava
compete con chi le sta vicino e con nessun altro.

### Prezzari

- **Misto granulometrico stabilizzato per fondazione stradale**: nei prezzari
  regionali va da circa **28 €/m³ a quasi 57 €/m³** [da risultati di ricerca].
- Regioni con i costi degli aggregati più **alti**: **Lazio, Veneto, Sardegna**;
  più **bassi**: **Basilicata, Molise, Abruzzo, Calabria, Umbria**
  [da risultati di ricerca].
- **Prezzario nazionale delle opere pubbliche**: introdotto dalla
  **L. 199/2025 (Bilancio 2026), art. 1 commi 487–494**; adozione attesa entro il
  **29/06/2026**; **non vincolante** e **non sostitutivo** dei prezzari regionali —
  serve come riferimento tecnico comune per identificare soglie di scostamento
  territoriale; le stazioni appaltanti che se ne discostano devono motivare.
  Istituito anche un **Osservatorio sperimentale presso il MIT**
  [da risultati di ricerca].
- Le simulazioni sui prezzari regionali mostrano scostamenti **fino al 130%** su un
  edificio e **oltre 250 mila €/km** su una strada [da risultati di ricerca].

### Tabella parametri — B.5 Prezzi

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Prezzo franco cava, fascia bassa (spurghi, tout-venant) | 8 – 15 | €/t | listini Stabili, Piselli, cave EM | [da risultati di ricerca] |
| Prezzo franco cava, fascia media (misti, stabilizzati) | 15 – 25 | €/t | listini vari | [da risultati di ricerca] |
| Prezzo franco cava, fascia alta (sabbie lavate, pezzature selezionate) | 25 – 29 | €/t | listini vari | [da risultati di ricerca] |
| Trasporto 0–10 km | 3,00 | €/t | listino cave EM | [da risultati di ricerca] |
| Trasporto 11–20 km | 4,00 | €/t | listino cave EM | [da risultati di ricerca] |
| Trasporto 21–30 km | 6,00 | €/t | listino cave EM | [da risultati di ricerca] |
| Incidenza trasporto a 30 km su materiale da 15 €/t | ~40 | % | — | **[dedotto]** |
| Voce prezzario, misto stabilizzato **in opera** | 28 – 57 | €/m³ | LavoriPubblici | [da risultati di ricerca] |
| Scostamento massimo fra prezzari regionali (edificio) | fino a 130 | % | LavoriPubblici | [da risultati di ricerca] |
| Unità di vendita reale | **a peso** (q/t), non a volume | — | listini | [da risultati di ricerca] |

---

## B.6 · Densità: da tonnellate a metri cubi

⛔ **Tre densità diverse, e vanno tenute separate** `[dedotto]`, perché il
simulatore le userà in tre punti diversi:

1. **in banco** — la roccia in posto, prima dell'abbattimento (serve per il volume
   estratto e per il canone);
2. **sciolto in mucchio** — il materiale in cumulo dopo frantumazione e vagliatura
   (serve per il magazzino e per la conversione di vendita);
3. **compattato in opera** — dopo la stesa e il rullo (serve al cliente, non a noi).

I numeri qui sotto sono quasi tutti della **famiglia 2 (sciolto in mucchio)**, che è
quella dei listini.

| Materiale | Densità | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Misto stabilizzato 0/30 | **1,75** (1750 kg/m³) | t/m³ | Bacchi SpA | [da risultati di ricerca] |
| Mista 0–20 | **1,70** | t/m³ | tabella pesi specifici inerti | [da risultati di ricerca] |
| Mista 0–30 | **1,75** | t/m³ | tabella pesi specifici inerti | [da risultati di ricerca] |
| Pietrisco (tutte le pezzature 2-5, 4-8, 8-18, 15-30, 30-50) | **1,40** | t/m³ | tabella pesi specifici inerti | [da risultati di ricerca] |
| Sabbione naturale | **1,40** | t/m³ | tabella pesi specifici inerti | [da risultati di ricerca] |
| Sabbia **asciutta** | **1,50** (1500 kg/m³) | t/m³ | YouMath | [da risultati di ricerca] |
| Sabbia **umida** | **2,00** (2000 kg/m³) | t/m³ | YouMath | [da risultati di ricerca] |
| Sabbia naturale (elenco prezzi gara) | **1,60** | t/m³ | Tennacola | [da risultati di ricerca] |
| Ghiaia e pietrisco (peso unitario geotecnico) | 16,0 kN/m³ ≈ **1,63** | t/m³ | GeoStru | [da risultati di ricerca] + conversione **[dedotto]** |
| Sabbia secca (peso unitario geotecnico) | 17,0 kN/m³ ≈ **1,73** | t/m³ | GeoStru | [da risultati di ricerca] + conversione **[dedotto]** |
| Sabbia umida (peso unitario geotecnico) | 18,0 kN/m³ ≈ **1,83** | t/m³ | GeoStru | [da risultati di ricerca] + conversione **[dedotto]** |

**Una verifica incrociata che vale la pena scrivere**, perché è l'unica prova
interna che questo capitolo contiene `[dedotto]`: tre listini danno **sia** il
prezzo al quintale **sia** quello al metro cubo, quindi la densità implicita si
ricava per divisione.

| Materiale | €/t | €/m³ | Densità implicita |
|---|---|---|---|
| Misto stabilizzato 0/30 | 25,40 | 38,00 | **1,50 t/m³** |
| Sabbia naturale 0/2 | 28,20 | 45,00 | **1,60 t/m³** |
| Ghiaia naturale 0/10, 10/25 | 27,60 | 40,00 | **1,45 t/m³** |

Cioè le densità *commercialmente usate* stanno in una fascia stretta, **1,45–1,60
t/m³**, più bassa dei valori geotecnici e più bassa dell'1,75 dichiarato da un
produttore per lo stesso stabilizzato. **Non è una contraddizione da risolvere: è
la dispersione vera del dato**, e dice che una conversione t↔m³ nel prodotto va
sempre fatta con una densità **dichiarata e modificabile**, mai con una costante
nascosta.

**Fascia che propongo per il simulatore** `[dedotto]`: **1,4 – 1,8 t/m³** sciolto in
mucchio, con **1,5 t/m³** come valore di comodo per gli inerti misti e **1,6 t/m³**
per le sabbie.

⚠️ **La densità in banco del calcare e il fattore di rigonfiamento (swell) non li ho
trovati** — vedi sezione finale. Senza il coefficiente di rigonfiamento non si passa
dal volume del vuoto di scavo al volume dei cumuli.

---

## B.7 · Come si vende: DDT, pesa, fattura, incasso

### Il ciclo

1. Il camion **si pesa vuoto** (tara) e **pieno** (lordo) sulla **pesa a ponte**: il
   netto è la quantità venduta. Gli inerti si vendono **a peso**
   [da risultati di ricerca].
2. Alla consegna si emette un **DDT** (documento di trasporto).
3. A fine mese i DDT confluiscono in una **fattura differita**.
4. Il cliente paga a scadenza — o non la rispetta.

### La pesa a ponte: metrologia legale

| Elemento | Valore | Marcatura |
|---|---|---|
| Riferimento europeo | Direttiva **MID 2014/32/UE** | [da risultati di ricerca] |
| Riferimento italiano per la verificazione periodica | **D.M. 21 aprile 2017 n. 93** | [da risultati di ricerca] |
| Periodicità della **verificazione periodica** delle pese a ponte | **triennale** | [da risultati di ricerca] |
| Chi la esegue | **Camera di Commercio** o **laboratori accreditati**, su richiesta dell'utente metrico | [da risultati di ricerca] |
| Esito positivo | **contrassegno adesivo verde** con la data entro cui riverificare | [da risultati di ricerca] |
| Che cosa si controlla | inalterabilità metrologica nel tempo, integrità di **marcature** e **sigilli** | [da risultati di ricerca] |

⚠️ **La classe di precisione (III) associata alle pese a ponte non è stata
confermata** dai risultati — vedi sezione finale.

Un dettaglio utile al simulatore `[dedotto]`: una verificazione **scaduta** o un
sigillo rotto rendono lo strumento non utilizzabile per una transazione commerciale.
È un evento a bassa frequenza (triennale) ma con effetto immediato sulla vendita.

### La fattura differita

| Elemento | Valore | Marcatura |
|---|---|---|
| Base normativa | **art. 21 comma 4 lett. a) DPR 633/1972** | [da risultati di ricerca] |
| Codice tipo documento (fattura elettronica) | **TD24** | [da risultati di ricerca] |
| Termine di emissione | **entro il 15 del mese successivo** a quello di consegna/spedizione | [da risultati di ricerca] |
| Che cosa documenta | **più operazioni** dello stesso mese solare verso lo **stesso soggetto**, supportate da DDT o documento equivalente | [da risultati di ricerca] |
| Requisito del DDT | deve essere idoneo a **identificare i soggetti** fra cui è effettuata l'operazione | [da risultati di ricerca] |
| Codice affine | **TD25**, per un caso particolare non chiarito dai risultati | [da risultati di ricerca] |

Questo è **esattamente il ritmo di una cava**: decine di DDT al mese per lo stesso
cliente, una sola fattura mensile. Un simulatore che generi consegne giornaliere e
fatture mensili sta riproducendo il meccanismo giusto.

### Pagamenti: quello che dice la legge

| Elemento | Valore | Marcatura |
|---|---|---|
| Norma | **D.Lgs 231/2002** (transazioni commerciali) | [da risultati di ricerca] |
| Termine generale | **30 giorni** dal ricevimento merci / prestazione | [da risultati di ricerca] |
| Estensione | possibile **per accordo scritto**, entro certi limiti (**60 giorni** citato) | [da risultati di ricerca] |
| Interessi di mora | **automatici** dal giorno successivo alla scadenza, **senza costituzione in mora** | [da risultati di ricerca] |
| Saggio (art. 5) | **tasso di rifinanziamento principale BCE + 8 punti percentuali** | [da risultati di ricerca] |
| Esempio I semestre 2026 | BCE 2,15% → **10,15%** annuo | [da risultati di ricerca] |
| Clausole nulle perché inique (esempi citati) | pagamento a 60 gg **dal ricevimento fattura**; decorrenza interessi dal 180° anziché dal 30° giorno | [da risultati di ricerca] |

> ⚠️ Il tasso BCE cambia ogni semestre. Un simulatore che lo inchioda al 10,15%
> invecchierà; il **+8 punti** è la parte stabile, il **2,15%** è la parte volatile.

### Pagamenti: quello che succede davvero

Studi **Cribis** sulle abitudini di pagamento [da risultati di ricerca]:

| Segmento | Giorni medi di pagamento |
|---|---|
| **Media nazionale (tutti i settori)** | **71** |
| **Edilizia (complessivo)** | **80** |
| Edilizia specializzata | **89** |
| Installatori | **80** |
| Costruzione di edifici | **75** |

Puntualità e ritardi gravi [da risultati di ricerca]:

| Indicatore | Valore | Periodo dichiarato |
|---|---|---|
| Pagatori puntuali, comparto edile | **45,6%** | settembre 2023 |
| Ritardi gravi (>90 gg), comparto edile | **7,9%** | settembre 2023 |
| Ritardi gravi (>90 gg), costruzioni | **6%** | Q4 2025 |
| Puntualità nazionale | **42%** | (trimestre non chiarito) |
| Puntualità Sud | **31,6%** | (trimestre non chiarito) |
| Riduzione ritardi >90 gg, costruzioni | **−1,6%** su Q2 2024 | Q2 2025 |

⚠️ **Le date di questi dati sono miste e non tutte chiare dagli estratti.** Prendere
uno di questi numeri e scrivere «oggi in edilizia si paga a X giorni» sarebbe una
frase più larga del suo numero.

**Il divario è il dato che conta** `[dedotto]`: la legge dice **30 giorni**, il
settore paga a **80**. Un simulatore realistico deve generare una distribuzione di
incasso **centrata ben oltre il termine contrattuale**, con una coda del ~6–8% oltre
i 90 giorni.

### Tabella parametri — B.7 Vendita e incasso

| Parametro | Valore / intervallo | Unità | Fonte | Marcatura |
|---|---|---|---|---|
| Verificazione periodica pesa a ponte | 3 | anni | D.M. 93/2017 via Bottari, CCIAA | [da risultati di ricerca] |
| Emissione fattura differita | entro il 15 del mese successivo | — | art. 21 c.4 DPR 633/72 via FiscoeTasse | [da risultati di ricerca] |
| Codice fattura differita | TD24 | — | FiscoeTasse, Agenzia Entrate | [da risultati di ricerca] |
| Termine di pagamento di legge | 30 (estendibile per iscritto, 60 citato) | giorni | D.Lgs 231/2002 | [da risultati di ricerca] |
| Maggiorazione interessi di mora | +8 | punti % su tasso BCE | art. 5 D.Lgs 231/2002 | [da risultati di ricerca] |
| Tasso mora I sem. 2026 | 10,15 | % annuo | MioLegale | [da risultati di ricerca] |
| Giorni medi di pagamento, edilizia | 80 | giorni | Cribis | [da risultati di ricerca] |
| Giorni medi di pagamento, media nazionale | 71 | giorni | Cribis | [da risultati di ricerca] |
| Quota ritardi gravi (>90 gg), costruzioni | 6 – 8 | % | Cribis | [da risultati di ricerca] |
| Divario legge ↔ prassi | ~50 | giorni | — | **[dedotto]** |

---

## B.8 · Canone di escavazione

### Come funziona

Il canone (o «onere per il diritto di escavazione», o «contributo estrattivo» —
**il nome cambia da regione a regione**) è:

- **imposto dalla Regione**, con **legge regionale**: non esiste una disciplina
  nazionale unica [da risultati di ricerca];
- calcolato **sul volume estratto**, quindi in **€/m³** (non in €/t)
  [da risultati di ricerca];
- **differenziato per tipo di materiale** (sabbia/ghiaia costa meno delle pietre
  ornamentali) [da risultati di ricerca];
- pagato **annualmente** [da risultati di ricerca];
- in alcune regioni fissato dalla **Giunta regionale** con atto separato dalla legge,
  quindi **aggiornabile senza cambiare la legge** (Lombardia, Liguria)
  [da risultati di ricerca].

⚠️ **Attenzione a non confonderlo con l'indennizzo al proprietario del fondo**: in
Liguria, per esempio, il concessionario paga **due** cose diverse per ogni m³ — un
**indennizzo annuo al proprietario** e un **canone di concessione alla Regione**
[da risultati di ricerca].

### I valori trovati

| Regione / fonte | Valore | Unità | Marcatura |
|---|---|---|---|
| **Piemonte** (L.R. 23/2016), sabbie e ghiaie | **0,51** | €/m³ | [da risultati di ricerca] |
| **Piemonte**, pietre ornamentali | **0,85** | €/m³ | [da risultati di ricerca] |
| **Lombardia** | canone annuo per m³, **importo fissato dalla Giunta** | €/m³ | [da risultati di ricerca] |
| **Liguria** (L.R. 12/2012) | canone alla Regione **+** indennizzo al proprietario, entrambi per m³, fissati dalla Giunta | €/m³ | [da risultati di ricerca] |
| **Basilicata, Sardegna** | **nessun canone**, per nessun materiale | — | [da risultati di ricerca] |
| **Valle d'Aosta** | canone **solo** per sabbia e ghiaia | — | [da risultati di ricerca] |
| Regioni con canoni più bassi: **Calabria, Lazio, Puglia, Umbria, Valle d'Aosta** | **< 0,50** | €/m³ | [da risultati di ricerca] |
| Ritorno pubblico complessivo da sabbia e ghiaia, Italia | **≤ 20 milioni** | €/anno | [da risultati di ricerca] |

⚠️ **La dispersione è enorme e va modellata come tale**: da **zero** (Basilicata,
Sardegna) a **0,85 €/m³** (Piemonte, ornamentali). Un simulatore che usa un canone
unico nazionale sta riproducendo un mondo che non esiste.

### Contesto di scala (Rapporto Cave 2025, Legambiente)

Utile per dimensionare una cava sintetica «media» [da risultati di ricerca]:

| Grandezza | Valore | Variazione dichiarata |
|---|---|---|
| Cave **autorizzate** in Italia | **3.378** | −51,3% sul 2008; −20,7% sul rapporto 2021 |
| Sabbia e ghiaia estratte | **34,6 milioni di m³/anno** | +18,5% sul 2021 |
| Calcare estratto | **51,6 milioni di m³/anno** | +92,5% |
| Pietre ornamentali | **5,5 milioni di m³/anno** | −11,3% |

Un conto grezzo `[dedotto]`, e da trattare come tale: 34,6 + 51,6 + 5,5 ≈ **91,7
Mm³/anno** su **3.378** cave autorizzate dà una media di **~27.000 m³/anno per
cava**. La media è un cattivo descrittore in un settore così sbilanciato — molte
cave sono autorizzate e ferme, alcune sono enormi — ma serve almeno a dire che
l'ordine di grandezza di una cava media è **decine di migliaia di m³/anno**, non
centinaia di migliaia.

Con quel volume e un canone di 0,50 €/m³, il canone di una cava media è
dell'ordine di **13.000 €/anno** `[dedotto]` — coerente con il fatto che il ritorno
pubblico nazionale da sabbia e ghiaia sia riportato «non oltre 20 milioni €».

⚠️ Il quadro normativo nazionale di riferimento per le attività estrattive viene
descritto come **fermo al R.D. 1443/1927** [da risultati di ricerca]: è la ragione
per cui tutto il resto è regionale.

---

# Quello che NON sono riuscito a trovare

Elenco esplicito. Ogni riga qui dentro è un buco **dichiarato**: se qualcuno lo
colma, questa sezione si accorcia e si vede.

### Sul mondo — vibrazioni
1. **La curva completa USBM RI 8507**: ho solo il tratto piatto basso (4–15 Hz,
   12,7 e 19,05 mm/s). Il ramo crescente sopra i 15 Hz — che è quello che ammette
   PPV più alti alle frequenze alte — **non l'ho trovato**.
2. **La tabella completa DIN 4150-3**: ho solo gli intervalli riassunti
   (5–20 e 20–50 mm/s). I valori per **classe di edificio × banda di frequenza**,
   che è la forma vera della tabella, mancano.
3. **Il contenuto di UNI 9916 e UNI 9614**: sono norme **a pagamento**, e non le ho
   potute aprire. So che esistono e che cosa coprono, non che cosa prescrivono.
4. **Una periodicità di misura stabilita per norma** per le vibrazioni in cava. La
   prassi «una misura per volata» resta una mia deduzione.
5. **Valori di PPV misurati in cave ITALIANE**: tutti i valori misurati che ho
   trovato sono di studi internazionali. Nessuna serie italiana.
6. **Il numero tipico di volate all'anno** in una cava italiana di calcare, che
   servirebbe a dimensionare la frequenza degli eventi nel simulatore.

### Sul mondo — rumore
7. **Le classi acustiche I, II e IV della Tabella C.** Fuori dalla tabella
   principale perché **non confermate**, e le scrivo qui apposta: credo che siano
   **I: 50/40, II: 55/45, IV: 65/55 dB(A)** diurno/notturno — `[dedotto]`,
   **non verificato**, **da non copiare in un'interfaccia**.
8. **Tutta la Tabella B (valori limite di emissione).** La regola che si sente
   citare è «5 dB sotto l'immissione» — `[dedotto]`, non confermata.
9. **La Tabella D (valori di qualità).**
10. **La durata e le condizioni di una misura fonometrica di controllo** (tempo di
    misura, tempo di riferimento, condizioni meteo ammesse) secondo il
    **DM 16/3/1998**: so che il decreto esiste ed è quello, non che cosa prescriva.
11. **La periodicità delle campagne fonometriche** per una cava.

### Sul mondo — polveri
12. **Il valore TA-Luft** per le polveri sedimentabili (il famoso 350 mg/m²·giorno):
    cercato, **non confermato**. L'unico valore trovato è **250 mg/m²·giorno** in un
    contesto **siderurgico**, non di cava.
13. **Valori tipici di polveri sedimentabili misurati attorno a una cava.** Ho il
    metodo (Bergerhoff, ~30 giorni) e non i numeri.
14. **La revisione europea dei limiti di qualità dell'aria** (direttiva UE
    2024/2881, applicazione 2030): non cercata a fondo. Il 40/50/35 del D.Lgs
    155/2010 potrebbe non essere il quadro futuro.
15. **Contributo tipico di una cava al PM10 al ricettore** (incremento sopra il
    fondo): è il numero che direbbe se una cava sia o no una sorgente rilevante, e
    non l'ho trovato.

### Sul mondo — controlli
16. **La scadenza della dichiarazione annuale dei quantitativi estratti.**
17. **La frequenza dei controlli ARPA** (ispezioni programmate): definita caso per
    caso, nessun valore trovato.
18. **Il contenuto operativo di ARPA FVG LG21.02** (le tabelle di frequenza per
    matrice): ho il titolo e l'indice concettuale, non le tabelle.

### Sul mondo — commerciale
19. **Un indice di mercato degli inerti italiano.** Tutti i prezzi trovati sono
    listini di singole aziende, 2022–2024. Non ho trovato né una serie ISTAT né un
    indice ANEPLA/Assobeton per gli aggregati.
20. **Prezzi 2025–2026**: i listini pubblici trovati si fermano al 2024.
21. **La descrizione completa della voce di prezzario** per il misto stabilizzato:
    la mia affermazione che i 28–57 €/m³ includano la posa è `[dedotto]` e va
    verificata leggendo la voce.
22. **La densità in banco del calcare** e il **fattore di rigonfiamento (swell)**
    banco→sciolto. Senza quello non si converte il volume di scavo in volume di
    cumuli.
23. **La classe di precisione metrologica** delle pese a ponte (III?) e la **divisione
    di verifica** tipica (es. 20 kg su 60 t): il primo non confermato, il secondo
    non trovato.
24. **Che cosa fa TD25** rispetto a TD24.
25. **I canoni di escavazione di Lombardia, Veneto, Toscana in cifre**: so che
    esistono e come sono strutturati, non quanto valgono. Solo Piemonte ha numeri.
26. **La base imponibile esatta** del canone: volume **autorizzato** o volume
    **effettivamente estratto**? I risultati dicono «volume estratto», ma non
    chiariscono se sia il dichiarato annuale o l'autorizzato.
27. **La distribuzione dimensionale delle cave italiane** (quante piccole, quante
    grandi): senza quella la media di ~27.000 m³/anno è un numero senza forma.

### Sul metodo
28. **Nessuna fonte primaria letta.** Vale per tutte le 8 domande. È il limite più
    grosso di questo documento e sta scritto anche in cima.

---

# Fonti

Elencate per sezione. Sono le pagine che `WebSearch` ha restituito e da cui vengono
gli estratti: **nessuna di esse è stata aperta e letta integralmente**.

**A.1 Vibrazioni**
- [Monitoraggio delle vibrazioni nelle cave — Micromega Dynamics](https://micromega-dynamics.com/it/project/quarries-monitoring/)
- [Capire lo standard DIN 4150 — Micromega Dynamics](https://micromega-dynamics.com/it/understanding-the-din-4150-standard-vibration-and-construction-monitoring/)
- [DIN 4150-3 Explained: Vibration Limits for Buildings](https://micromega-dynamics.com/din-4150-3-vibration-limits-buildings/)
- [Vibrazioni degli edifici — Svantek](https://svantek.com/applications/building-vibrations/)
- [Rilievo vibrazioni: cosa dice la legge — Vielle Acustica](https://www.vielleacustica.it/cms/rilievo-vibrazioni-cosa-dice-la-legge/)
- [RI 8507 Structure Response and Damage Produced by Ground Vibration From Surface Mine Blasting](https://vibrationmonitoringcourse.com/osmre-ground-vibration-monitoring-papersosmre-office-surface-mining-reclamation-enforcement/ri-8507-structure-response-ground-vibration-mine-blasting/)
- [REVEY Associates — Vibration, Airblast and Risk Management (PDF)](https://higherlogicdownload.s3.amazonaws.com/SMENET/d1f74698-76c6-4c73-8ced-5de57b15be03/UploadedImages/UCA-YM/TAC%20-%202013%20VIBRATION%20AND%20AIR-OVERPRESSURE%20HANDOUT%20-%20OCTOBER%202013.pdf)
- [Air Overpressure — Agg-Net](https://www.agg-net.com/resources/articles/drilling-blasting/air-overpressure)
- [The Mini-SuperGraph — Agg-Net](https://www.agg-net.com/resources/articles/drilling-blasting/the-mini-supergraph)
- [Blasting Seismographs — The World of Explosives](https://explosives.org/blast-monitoring/blasting-seismographs/)
- [Quarry Vibration Monitoring: Best Practices & Solutions — uWave](https://uwavems.com/feeds/blog/quarry-vibration-monitoring)
- [Peak particle velocity data acquisition for monitoring blast induced earthquakes in quarry sites](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5997587/)
- [Analysis of parameters of ground vibration produced from bench blasting at a limestone quarry](https://www.sciencedirect.com/science/article/abs/pii/S0267726104001125)
- [EFEE — Blast vibrations (PDF)](https://efee.eu/wp-content/uploads/2016/04/3-Blast-vibrations.pdf)
- [Blast Vibration Criteria Selection — EWEB (PDF)](https://www.eweb.org/documents/Projects/Water%20Storage/Blast-Vibration-Criteria-Selection.pdf)
- [Explosive charge mass and peak particle velocity — Journal of Geophysics and Engineering (PDF)](https://academic.oup.com/jge/article-pdf/7/3/223/26815573/jge10_3_001.pdf)

**A.2 Rumore**
- [DPCM 14/11/1997 — ANIT](https://www.anit.it/norma/d-p-c-m-14-11-1997-determinazione-dei-valori-limite-delle-sorgenti-sonore/)
- [DPCM 14/11/1997, testo (PDF) — ANIT](https://www.anit.it/wp-content/uploads/2015/02/DPCM_14_11_19971.pdf)
- [DPCM 14/11/1997 — CED Ingegneria](https://www.cedingegneria.it/norme-tecniche/energia-ambiente/determinazione-dei-valori-limite-delle-sorgenti-sonore/)
- [Classi acustiche e limiti previsti — Magister](http://www.magistersrl.eu/classi-acustiche/)
- [Limite differenziale, applicabilità — Magister](http://www.magistersrl.eu/limite-differenziale-applicabilita/)
- [Criterio differenziale di immissione — ST-LINE](https://www.stline.it/wiki/criterio-differenziale/)
- [Valori limite differenziali di immissione — Legislazione Tecnica](https://legislazionetecnica.it/node/5219101)
- [Il criterio differenziale nell'evoluzione della normativa — ARPAE (PDF)](https://www.arpae.it/it/temi-ambientali/rumore/scopri-di-piu/copy_of_2004nov20_inquinamento_acustico_infrastrutture_poli_callegari.pdf)
- [La legge quadro 447/95 (PDF)](https://www.acustica.it/documenti/legge%20quadro%20447.pdf)
- [Il tecnico competente in acustica ambientale](https://www.acustico.com/approfondimenti/il-tecnico-in-acustica-legge-447-95.html)
- [Linee guida per l'attività tecnica di controllo dell'inquinamento acustico — ARPA FVG](https://arpa.fvg.it/temi/temi/rumore/pubblicazioni/linee-guida-per-lattivita-tecnica-di-controllo-dellinquinamento-acustico/)

**A.3 Polveri**
- [PM10, quali sono i limiti stabiliti dalla legge — ARPA Piemonte](https://www.arpa.piemonte.it/faq/pm10-quali-sono-limiti-stabiliti-dalla-legge)
- [Qualità dell'aria: particolato PM10 — ISPRA Indicatori ambientali](https://indicatoriambientali.isprambiente.it/en/air-quality/ambient-air-quality-particulate-pm-10)
- [PM10 e PM2.5 — ARPA Lombardia](https://www.arpalombardia.it/temi-ambientali/aria/inquinanti/pm10-e-pm25/)
- [L'efficacia dei deposimetri nella misura della polverosità — SNPA / ARPA FVG](https://www.snpambiente.it/snpa/arpa-fvg/lefficacia-dei-deposimetri-nella-misura-della-polverosita/)
- [Il monitoraggio delle polveri sedimentabili — ARPA Umbria (PDF)](https://www.arpa.umbria.it/resources/docs/Micron0_24.pdf)
- [Monitoraggio delle deposizioni — ARPAL Liguria (PDF)](https://www.arpal.liguria.it/files/ARIA/2019/Post%20demolizione%20Ponte%20Morandi%20relazioni%20aria/Ponte_Morandi_deposimetri.pdf)
- [Rapporto monitoraggio Centrale La Spezia — ARPAL (PDF)](https://www.arpal.liguria.it/files/ARIA/2019/La%20Spezia/Aia%20Enel/Rapporto_Monitoraggio_P18_2019_ALL_compressed.pdf)
- [Deposimetro — Treccani](https://www.treccani.it/enciclopedia/deposimetro/)
- [Controllo polveri nel ciclo di vita di una cava — Full Service](https://www.fullservice-it.com/articoli/controllo-polveri-una-soluzione-ogni-fase-del-ciclo-di-vita-di-una-cava)

**A.4 Controlli e ARPA**
- [Linee guida per la redazione di un piano di monitoraggio di un'attività estrattiva — ARPA FVG](https://www.arpa.fvg.it/temi/temi/supporto-tecnico-e-controlli/pubblicazioni/linee-guida-concernenti-la-redazione-di-un-piano-di-monitoraggio-relativo-alla-procedura-di-valutazione-di-impatto-ambientale-via-di-unattivita-estrattiva/)
- [ARPA FVG — LG21.02 (PDF)](https://www.arpa.fvg.it/documents/3561/LG21.02_e2_r1_Redaz_piano_monitor_attivita_estrattiva_01_paFXjlI.pdf)
- [ARPA FVG — LG21.01 struttura del piano di monitoraggio (PDF)](https://www.arpa.fvg.it/documents/3559/LG21.01_e2_r1_Struttura_piano_monitoraggio_VIA_AE52ap1.pdf)
- [Piano di monitoraggio ambientale delle attività estrattive di cava — Assimpredil ANCE](https://portale.assimpredilance.it/articoli/piano-di-monitoraggio-ambientale-delle-attivita-estrattive-di-cava)
- [Piani di monitoraggio ambientale (PMA) — ARPA Lombardia](https://www.arpalombardia.it/per-enti-e-imprese/piani-di-monitoraggio-ambientale-pma/)
- [Il piano di monitoraggio e controllo nelle AIA — ARPAT](https://www.arpat.toscana.it/temi-ambientali/sistemi-produttivi/aia/autorizzazione/il-piano-di-monitoraggio-e-controllo-nelle-aia)
- [Piano di monitoraggio e controllo — ARPA Veneto](https://www.arpa.veneto.it/servizi/ippc/servizi-alle-aziende/piano-di-monitoraggio-e-controllo)
- [Statistica mineraria annuale — Regione Piemonte](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale)
- [Materie prime — UNMIG / MASE](https://unmig.mase.gov.it/materie-prime/)
- [Attività estrattive da cave e miniere — ISTAT (PDF)](https://www.istat.it/it/files//2020/07/Attivit%C3%A0-estrattive-da-cave-e-miniere.pdf)

**B.5 Prezzi**
- [Listino prezzi materiale inerte naturale — Stabili srl (PDF)](https://stabilisrl.it/wp-content/uploads/2022/02/ListinoPrezzi2022-Kg.pdf)
- [Listino prezzi dei materiali f.co cava — Piselli Cave (PDF)](https://www.pisellicave.it/wp-content/uploads/2021/12/LISTINO-CAVE-_2022.pdf)
- [Listino prezzi aggregati naturali — F.lli Cotellessa (PDF)](https://www.fratellicotellessa.it/inerti/Listino%20Prezzi%20INERTI.pdf)
- [Listino aggregati — Franzosi Cave (PDF)](https://gruppofranzosi.it/wp-content/uploads/2019/07/Listino-Aggregati-franzosi-cave-sedi-di-tortonavogherabasaluzzo.pdf)
- [Listino prezzi inerti — Emiliana Conglomerati (PDF)](https://www.emilianaconglomerati.it/images/pdf/Listino_Inerti_2022.pdf)
- [Elenco dei materiali e prezzi — Tennacola (PDF)](https://www.tennacola.it/public/allegatigare/83/Allegato%20A-Elenco%20dei%20materiali%20e%20Prezzi.pdf)
- [Listino prezzi all'ingrosso dei materiali da costruzione — CCIAA (PDF)](https://www.pno.camcom.it/sites/default/files/contenuto_redazione/1.pdf)
- [Prezzario nazionale opere pubbliche 2026: differenze fino al 130% tra Regioni — LavoriPubblici](https://www.lavoripubblici.it/news/prezzario-nazionale-opere-pubbliche-2026-differenze-prezzari-regionali-37452)
- [Prezzari lavori pubblici 2026 — LavoriPubblici](https://www.lavoripubblici.it/news/prezzari-lavori-pubblici-2026-prezzario-nazionale-decreto-mit-37144)
- [Prezzario nazionale dei lavori pubblici — Edilportale](https://www.edilportale.com/news/2026/01/lavori-pubblici/prezzario-nazionale-lavori-pubblici-come-funziona_108553_11.html)

**B.6 Densità**
- [Misto Stabilizzato 0/30 — Bacchi SpA](https://www.bacchispa.it/sabbia-silicea-e-inerti-umidi-naturali/misto-stabilizzato-0-30/)
- [Scheda tecnica Misto Stabilizzato 0/30 — Bacchi SpA (PDF)](https://www.bacchispa.it/wp-content/uploads/2022/04/ST_UMIDE_Stabilizzato-0-30_Rev.01-21.pdf)
- [Tabella pesi specifici inerti (PDF)](https://irp-cdn.multiscreensite.com/b99d2c6c/files/uploaded/tabella%20pesi%20specifici%20inerti.pdf)
- [Tabella peso specifico inerti — Studio Petrillo (PDF)](https://www.studiopetrillo.com/files/Tabella%20peso%20specifico%20inerti.pdf)
- [Pesi unità di volume terreni e rocce, incoerenti — GeoStru](https://help.geostru.eu/properties-specific-weights-materials/it/terreni-incoerenti.html)
- [Peso specifico della sabbia — YouMath](https://www.youmath.it/domande-a-risposte/view/6859-peso-specifico-sabbia.html)

**B.7 Vendita, pesa, fattura, incasso**
- [Verificazioni periodiche — Bottari Tecnologie](https://bottaritecnologie.it/verificazioni-periodiche/)
- [Manutenzione pese a ponte: taratura e calibrazione — CCBB](https://www.ccbb.it/manutenzione-periodica-pese-a-ponte/)
- [Verificazione periodica degli strumenti di misura MID — Metrologia-Legale.it](http://www.metrologia-legale.it/verificazione-periodica-degli-strumenti-di-misura-mid)
- [Verifica periodica strumenti metrici — CCIAA Marche](https://www.marche.camcom.it/tutela-impresa-e-consumatore/normativa-metrologia-legale/verifica-periodica-strumenti-metrici)
- [Fatture differite: guida ai codici TD24 e TD25 — FiscoeTasse](https://www.fiscoetasse.com/rassegna-stampa/28208-fatture-differite-2020-guida-ai-codici-td24-e-td25-.html)
- [Fattura elettronica differita — Fatture in Cloud](https://www.fattureincloud.it/glossario/fatturazione-elettronica/fattura-differita/)
- [FAQ emissione delle fatture elettroniche — Agenzia delle Entrate](https://www.agenziaentrate.gov.it/portale/it/web/guest/schede/comunicazioni/fatture-e-corrispettivi/faq-fe/risposte-alle-domande-piu-frequenti-categoria/emissione-delle-fatture-elettroniche)
- [Art. 5 Saggio degli interessi, D.Lgs 231/2002 — CodiceAppalti](https://www.codiceappalti.it/dlgs_231_2002/Art__5__Saggio_degli_interessi/5928)
- [Gli interessi moratori nelle transazioni commerciali — Altalex](https://www.altalex.com/documents/altalexpedia/2025/07/31/interessi-moratori-transazioni-commerciali)
- [Tasso interessi moratori / calcolo 2026 — MioLegale](https://miolegale.it/calcolo/interessi-moratori/)
- [Edilizia: abitudini di pagamento e analisi del settore — Cribis](https://www.cribis.com/it/approfondimenti/settore-edilizia-analisi-abitudini-pagamento/)
- [Studio pagamenti Q3 2025 — Cribis](https://www.cribis.com/it/approfondimenti/studio-pagamenti-q3-2025/)
- [Pagamenti: quanto sono state puntuali le imprese in Italia nel 2025 — Cribis](https://www.cribis.com/it/approfondimenti/pagamenti-quanto-sono-state-puntuali-le-imprese-in-italia-nel-2025/)

**B.8 Canone di escavazione**
- [Onere per il diritto di escavazione — Regione Piemonte](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione)
- [Regione Piemonte L.R. 23/2016, disciplina delle attività estrattive — Olympus](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=17012:pie23_16&catid=27&Itemid=137)
- [Regione Liguria L.R. 12/2012, testo unico attività estrattiva — Olympus](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=9737:2012ligurial12&catid=27&Itemid=137)
- [Banca dati normativa — Consiglio Regionale della Lombardia](https://normelombardia.consiglio.regione.lombardia.it/normelombardia/accessibile/main.aspx?iddoc=lr002021110800020&view=showdoc)
- [Le tariffe di escavazione delle cave — Quarry & Construction](https://www.quarryandconstructionweb.it/rubriche/collaborazioni/le-tariffe-di-escavazione-delle-cave:-gli-obiettivi-e-le-contraddizioni-della-legislazione-regionale.htm)
- [Legambiente presenta il Rapporto Cave 2025 a Ecomondo](https://www.legambiente.it/news-storie/legambiente-presenta-il-rapporto-cave-2025-a-ecomondo/)
- [Rapporto Cave 2025: diminuiscono le cave autorizzate ma cresce l'estrazione — Ingenio](https://www.ingenio-web.it/articoli/cave-e-inerti-da-costruzione-il-rapporto-cave-2025-di-legambiente-chiede-regole-e-piu-riciclo/)
- [Cave in Italia, ingenti i prelievi. Quadro normativo fermo al 1927 — La Nuova Ecologia](https://www.lanuovaecologia.it/report-cave-italia-2025-legambiente-estrazione-edilizia/)
- [Cave e miniere: i dati sull'industria estrattiva in Italia — Cribis](https://www.cribis.com/it/approfondimenti/cave-miniere-dati-industria-estrattiva-italia/)
