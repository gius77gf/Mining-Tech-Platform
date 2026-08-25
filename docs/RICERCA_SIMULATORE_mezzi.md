# Ricerca — Quanto lavora, quanto consuma e quanto si rompe una macchina da cava

**Data:** 16/08/2026 · **Ambito:** solo il MONDO (nessun confronto con il nostro
codice, nessuna proposta di modifica: quella metà la fa chi ha il codice in mano).
**Scopo:** parametri per un **simulatore di cava sintetica** che si comporti come
una cava vera.

## Come si legge questo documento (e quanto vale)

Lo strumento usato è `WebSearch`. `WebFetch` risponde **`EGRESS_BLOCKED`**
(provato su `wheelercat.com`, che ospita un PDF pubblico del Caterpillar
Performance Handbook: bloccato). Conseguenza **da non dimenticare**: so **che cosa
esiste** e che cosa i risultati di ricerca ne riportano, **non ho letto nessun
testo primario**. Nessuna tabella di costruttore è stata aperta con i miei occhi.

Marcatura usata su ogni numero:

| marca | che cosa vuol dire |
|---|---|
| `[fonte citata]` | il risultato di ricerca **attribuisce** il numero a una fonte istituzionale o primaria nominata (prezzario regionale, D.Lgs., Accordo Stato-Regioni, Performance Handbook, ISTAT). Resta **di seconda mano**: non ho aperto il documento. |
| `[da risultati di ricerca]` | numero letto in un risultato di ricerca commerciale, di blog o di rivista di settore, **senza** una fonte primaria nominata. |
| `[dedotto]` | aritmetica o inferenza mia, a partire dai numeri qui sopra. Dichiarata come tale. |

⚠️ **Un numero di legge, una tariffa o una formula riportata di seconda mano non
va mostrata a un cliente.** Prima va aperto il testo primario.

---

## 1 · Ore di lavoro: il turno, il contaore, e le ore vere

Sono **tre grandezze diverse** e il simulatore le deve tenere separate, se no
sbaglia di un fattore due.

1. **Ore di turno** — le ore in cui c'è un operatore sulla macchina.
2. **Ore contaore (ore motore)** — quello che il contaore incrementa. **Include il
   minimo**, cioè il motore acceso senza lavorare. È il numero su cui si contano
   i tagliandi.
3. **Ore produttive** — ore contaore meno il minimo, e ancora meno le pause, i
   riposizionamenti, le attese del camion.

### Ore/anno

| grandezza | valore | fonte | marca |
|---|---|---|---|
| Escavatore, ore/anno tipiche | **1.000 – 2.000** h/anno | rivista di settore / rivenditori | `[da risultati di ricerca]` |
| Escavatore 36 t, Nord America, dato telematico | **~1.000** h/anno, di cui **~40% al minimo** | dato dichiarato «da macchine dei clienti» (telematica costruttore) | `[fonte citata]` |
| Pala gommata, imprese generali | **1.200 – 1.500** h/anno | rivista di settore | `[da risultati di ricerca]` |
| Escavatore, uscita dalla produzione primaria | **~6 anni ≈ 9.800 h** | rivista di settore | `[da risultati di ricerca]` |
| Escavatore, vita utile con buona manutenzione | **15.000 h e oltre** | rivenditori | `[da risultati di ricerca]` |
| Pala gommata, vita utile | **~10 anni ≈ 7.000 – 12.000 h** | rivenditori | `[da risultati di ricerca]` |

⚠️ **Le ore/anno di cava sono più dure delle ore/anno di edilizia.** Una fonte lo
dice esplicitamente: *«rock and quarry hours are harder than landscaping hours»*,
e classifica il **caricamento al fronte in cava** come *severe duty*: **80-100% di
carico motore**, urti, polvere estrema `[da risultati di ricerca]`. La stessa
fonte prescrive, per quel servizio, di **dimezzare tutti gli intervalli di
manutenzione** (fattore **0,5×**) — vedi §3.

### Giorni/anno e turni

| grandezza | valore | fonte | marca |
|---|---|---|---|
| Turno standard | **8 h** (può essere 6, o fino a 12) | normativa/prassi italiana del lavoro a turni | `[fonte citata]` |
| Turnisti su due turni, 5-6 gg/settimana | **247,5 giornate/anno** da 8 h | contrattualistica del lavoro | `[fonte citata]` |
| Turnisti a ciclo continuo (3 turni, 7 gg) | **232,5 giornate/anno** da 8 h | contrattualistica del lavoro | `[fonte citata]` |

⚠️ Quei due numeri vengono dalla **contrattualistica generale del lavoro a
turni**, non da un contratto di settore delle cave: sono un ordine di grandezza
per la giornata lavorativa, non il calendario di una cava. Una cava di inerti in
Italia lavora tipicamente su **un turno diurno**, ma non ho trovato una fonte che
lo dichiari con un numero — vedi «quello che non sono riuscito a trovare».

### Fattore di utilizzo: le due catene, e il rischio di contarle due volte

Nella letteratura di stima dei lavori di movimento terra il fattore si chiama
**job efficiency factor** ed è quasi sempre espresso come «l'ora da 50 minuti»:

| grandezza | valore | fonte | marca |
|---|---|---|---|
| Ora produttiva convenzionale | **50 min/h = 0,83** | manualistica di stima | `[fonte citata]` |
| Intervallo usato in pratica | **0,70 – 0,85** (alcune fonti scendono a **0,50**) | manualistica di stima | `[da risultati di ricerca]` |
| Tempo al minimo, escavatore | **~40%** delle ore contaore | telematica costruttore | `[fonte citata]` |
| Tempo al minimo, pala gommata | **40 – 50%**, secondo l'applicazione | rivista di settore | `[da risultati di ricerca]` |
| Tempo al minimo, media di flotta (≈75.000 macchine, 12 mesi, Nord America) | **38%** | telematica costruttore | `[fonte citata]` |
| Obiettivo raccomandato per il minimo | **< 20-30%** delle ore motore | consulenti di flotta | `[da risultati di ricerca]` |
| Ore di flotta «sottoutilizzate» | **40 – 50%** | consulenti di flotta | `[da risultati di ricerca]` |

⛔ **Attenzione a non moltiplicare 0,83 per 0,60: misurano cose che si
sovrappongono.** L'«ora da 50 minuti» degli estimatori è calata su un ciclo di
scavo e **contiene già** una parte delle attese; il 38-40% di minimo della
telematica è misurato sul **contaore** e contiene tutto quello che l'estimatore
teneva fuori. Usarli in cascata dà un utilizzo del 50% che nessuna fonte
dichiara. Per il simulatore la catena onesta è **una sola**, e va scelta:

- **catena «contaore»** (quella dei dati telematici, e quella su cui cadono i
  tagliandi): `ore turno → ore contaore → ore contaore × (1 − quota minimo)`;
- **catena «produzione»** (quella della stima dei volumi): `ore contaore ×
  job efficiency`.

`[dedotto]` L'avvertenza è mia; le fonti danno i due numeri, nessuna li combina.

---

## 2 · Consumi di gasolio

### Che cosa dichiarano i costruttori, e come

Il **Caterpillar Performance Handbook** pubblica tabelle di consumo in **litri/ora
e US gal/ora** per modello, su **tre colonne — Low / Medium / High**. La cosa
importante per un simulatore è **come sono definite quelle tre colonne**: i valori
vengono dalla telematica (VisionLink), per regione, e **assumono una quota di
minimo**:

| colonna | quota di minimo assunta |
|---|---|
| Low | **50%** |
| Medium | **30%** |
| High | **10%** |

`[fonte citata]` — riportato in più risultati che citano il Performance Handbook.

⛔ **Quindi le colonne del costruttore NON sono «macchina scarica / media /
carica»: sono «macchina che sta ferma al minimo per metà del tempo / per un terzo
/ quasi mai».** Un simulatore che modella separatamente il tempo al minimo e poi
usa la colonna «Low» come consumo di una macchina poco caricata **conta il minimo
due volte**. Con una quota di minimo del 38-40% (§1), la colonna coerente con la
media di flotta sta **fra Low e Medium**, più vicina a Medium. `[dedotto]`

⚠️ Un'altra riga del Handbook, citata dai risultati, dice che per alcuni modelli
(336D2/340D2, 336E) i consumi orari sono presi **direttamente dalle macchine dei
clienti** registrate su Product Link nel mondo `[fonte citata]`. Cioè in quel
caso il «dato di costruttore» **è già un dato di esercizio reale**, non un valore
di banco: la distinzione costruttore/reale, per il carburante Caterpillar, è meno
netta di quanto ci si aspetti.

### Valori (tutti di seconda mano)

| classe di macchina | consumo | condizione | marca |
|---|---|---|---|
| Escavatore 10-20 t | **5 – 12** L/h | generico | `[da risultati di ricerca]` |
| Escavatore 20-30 t e oltre | **15 – 25** L/h | generico | `[da risultati di ricerca]` |
| Escavatore ~33 t (classe CAT 330) | **38 – 53** L/h (10-14 US gal/h) | dichiarato per quel modello | `[da risultati di ricerca]` |
| Pala gommata compatta | **7,5 – 15** L/h (2-4 gal/h) | carico moderato | `[da risultati di ricerca]` |
| Pala gommata da miniera, benna 10+ yd³ | **75 – 114** L/h (20-30 gal/h) | punte di caricamento | `[da risultati di ricerca]` |
| Dumper articolato | **37 – 56** L/h | carico normale | `[da risultati di ricerca]` |
| Dumper articolato | **75 – 93** L/h | carico pesante continuo o forti pendenze | `[da risultati di ricerca]` |

⚠️ **Il salto fra «escavatore 20-30 t: 15-25 L/h» e «classe 330: 38-53 L/h» è
troppo grande per essere solo taglia.** Le due righe vengono da pagine diverse,
quasi certamente con condizioni diverse (probabile: la prima è un valore medio
comprensivo di minimo, la seconda una punta a pieno carico). **Non vanno messe
nella stessa colonna di una tabella senza dichiarare che non sono confrontabili.**
Per il simulatore, se serve un solo numero, la forma onesta è **un intervallo
largo con la dichiarazione dell'incertezza**, non una media dei due.

### Il fattore umano

> «Operators alone can change production and fuel consumption in the same machine
> by up to **15%**» `[da risultati di ricerca]`

È un parametro di simulazione utile: **±15% sul consumo a parità di macchina e di
lavoro, per effetto del solo operatore**.

### Frantoio / impianto

| grandezza | valore | marca |
|---|---|---|
| Energia di frantumazione | **2,2 – 3,5 kWh/t** | `[da risultati di ricerca]` |
| Energia, «impianto medio» (stessa famiglia di fonti) | **oltre 200 kWh/t** | `[da risultati di ricerca]` |
| Incidenza dell'energia sui costi operativi di un impianto inerti | **30 – 40%** | `[da risultati di ricerca]` |
| Risparmio dichiarato con recupero energetico | **10 – 15%** | `[da risultati di ricerca]` |

⛔ **I primi due numeri sono incompatibili di due ordini di grandezza e vengono
dallo stesso ambito.** 200 kWh/t su un impianto da 200 t/h vorrebbe dire 40 MW,
che è la potenza di un quartiere: quasi certamente è un refuso o un'unità diversa
(kWh/giorno? per un'altra lavorazione?). **Per il simulatore si usa 2,2-3,5 kWh/t
e si dichiara che il 200 è stato visto e scartato**, se no qualcuno lo rimette.
`[dedotto]`

---

## 3 · Manutenzione programmata

### Intervalli a ore (macchine movimento terra)

| ogni | interventi | marca |
|---|---|---|
| **giornaliero** | livelli, ingrassaggio, controllo visivo, scarico condensa | `[da risultati di ricerca]` |
| **50 h** | controllo tensione cingoli (gomma) | `[da risultati di ricerca]` |
| **250 h** | **olio motore + filtro olio + filtro gasolio** | `[da risultati di ricerca]` |
| **500 h** | filtro aria, controllo gioco valvole | `[da risultati di ricerca]` |
| **1.000 h** | olio trasmissione, **olio idraulico** | `[da risultati di ricerca]` |
| **2.000 h** | revisione pompe, taratura elettronica, controllo computer di bordo | `[da risultati di ricerca]` |

Una seconda fonte dà, per l'escavatore, la manutenzione ordinaria completa **ogni
200-250 h** `[da risultati di ricerca]` — coerente con la riga dei 250.

### Il moltiplicatore che cambia tutto: il servizio in cava

> *Severe duty (quarry face-loading, mining, demolition, rock handling): 80-100%
> engine load, heavy shock impact, extreme dust exposure.* **PM adjustment: 0,5×
> base — cut all PM intervals in half.** `[da risultati di ricerca]`

⛔ **È il parametro più importante di questa sezione**, e va tenuto separato dagli
intervalli nominali: **il libretto dice 250 h, la cava li fa a 125.** Un
simulatore che usa gli intervalli di libretto per una macchina al fronte
sottostima gli eventi di manutenzione **del doppio**.

`[dedotto]` Con 1.500 h/anno e servizio severo (125 h effettive): **~12
tagliandi/anno per macchina** contro i ~6 nominali.

### Controlli non a calendario

| soggetto | criterio | marca |
|---|---|---|
| Denti benna | sostituzione quando lo spessore residuo è **~1/3** dell'originale; a quel punto la penetrazione è già calata del **20-30%** e il consumo di carburante è **già salito** | `[da risultati di ricerca]` |
| Denti benna | **verifica visiva settimanale** | `[da risultati di ricerca]` |
| Cingoli in gomma | controllo tensione **ogni 50 h**; sostituzione **sempre in coppia** | `[da risultati di ricerca]` |

⚠️ La riga sui denti è interessante per un simulatore perché descrive un
**degrado continuo che si vede prima nei consumi che nel guasto**: il dente
consumato non rompe niente, fa salire il gasolio e scendere la produzione. È
esattamente il tipo di dinamica che un simulatore può rendere e un foglio di
manutenzione a calendario no.

### Usura dei rivestimenti del frantoio

| soggetto | durata | marca |
|---|---|---|
| Rivestimenti di **frantumazione primaria** | **400 – 800 h** | `[da risultati di ricerca]` |
| Rivestimenti **secondari/terziari** | **1.500 – 3.000 h** | `[da risultati di ricerca]` |
| Su roccia **tenera/media** (calcare, arenaria) | **100 – 300 h** | `[da risultati di ricerca]` |
| Su roccia **molto abrasiva** (granito, basalto, quarzite) | **50 – 150 h** | `[da risultati di ricerca]` |
| Soglia di sostituzione mantello/concavo | **~70% di usura** (30% di spessore residuo), o crepe visibili | `[da risultati di ricerca]` |
| Rapporto ricambi | **2-3 cambi di mantello per ogni cambio di concavo** | `[da risultati di ricerca]` |
| Estensione della vita con manutenzione professionale | **+20 – 40%** | `[da risultati di ricerca]` |

⛔ **Le prime due righe e le seconde due si contraddicono** (400-800 h contro
100-300 h per il primario): la differenza è **la durezza del materiale**, che nel
primo caso non è dichiarata. Per il simulatore la variabile che comanda **non è
la posizione nell'impianto, è l'abrasività della roccia** — e la forbice fra le
due estremità è **da 50 h a 3.000 h, cioè 60×**. Un parametro con questa forbice
va **chiesto all'utente**, non messo a default. `[dedotto]`

---

## 4 · Guasti e disponibilità

| grandezza | valore | contesto | marca |
|---|---|---|---|
| **Disponibilità tecnica**, flotta mineraria «world-class» | **85 – 95%** | benchmark di settore | `[da risultati di ricerca]` |
| Disponibilità, mezzi di supporto (perforatrici, dozer, livellatrici) | **85 – 88%** | benchmark di settore | `[da risultati di ricerca]` |
| **Utilizzo** (quota del tempo disponibile in cui la macchina lavora davvero) | **70 – 85%** «world-class» | benchmark di settore | `[da risultati di ricerca]` |
| **OEE** obiettivo | **> 85%** | benchmark di settore | `[da risultati di ricerca]` |
| **OEE** media di settore | **60 – 65%** | benchmark di settore | `[da risultati di ricerca]` |
| **OEE** dumper, studi su flotte reali | **sotto il 40%** | studi citati | `[da risultati di ricerca]` |
| **MTBF** dumper, media di settore | **60 – 80 h** | benchmark di settore | `[da risultati di ricerca]` |
| **MTBF** dumper, «best-in-class» | **450 – 600 h** | benchmark di settore | `[da risultati di ricerca]` |
| **MTTR** reale contro tempo di riparazione attivo | **2 – 5×** | manutenzione industriale | `[da risultati di ricerca]` |
| Riduzione del fermo non programmato con manutenzione predittiva | **35 – 50%** | fornitori di predittiva | `[da risultati di ricerca]` |

**Formula standard:** `disponibilità = MTBF / (MTBF + MTTR)` `[fonte citata]`

⛔ **Tre avvertenze prima di usare questi numeri.**

1. **La forbice del MTBF è 7,5×** (60-80 contro 450-600 h) e i due numeri sono
   dati come «media» e «migliori»: sono **quasi certamente definizioni diverse di
   guasto** (qualunque fermo contro il solo fermo che interrompe la produzione),
   non solo flotte diverse. La definizione non l'ho trovata scritta.
2. **La media e il benchmark non stanno insieme.** Con MTBF 70 h e MTTR anche
   solo 4 h la disponibilità fa **94,6%**, cioè cade dentro la fascia
   «world-class 85-95%» pur essendo la flotta **media**. Delle due l'una: o
   quella disponibilità è calcolata su un MTBF diverso, o il MTTR reale è molto
   più alto di 4 h. `[dedotto]` **Il simulatore non può prendere le due righe
   dalla stessa tabella.**
3. La formula `60/(60+1,5) = 97,6%` che compare nei risultati è **l'esempio di un
   calcolatore generico**, non un dato minerario: non va citata come benchmark.

`[dedotto]` **Numero di fermi non programmati.** Con MTBF 70 h e 1.500 h/anno di
contaore: **~21 fermi/anno per macchina**. Con MTBF 500 h: **~3/anno**. Sono i
due estremi credibili, e la distanza fra loro è il vero parametro da esporre.

⚠️ Tutti i numeri di questa sezione vengono da **miniera** (mining), non da cava
di inerti. Una cava è più piccola, meno strumentata e con macchine più vecchie:
usare i benchmark minerari come default per una cava italiana è **ottimista**.

---

## 5 · Ricambi e scorte

### La regola di riordino della manutenzione industriale

**Punto di riordino (ROP)** = `scorta di sicurezza + (consumo medio × lead time)`
`[fonte citata]` — è la formula standard, ripetuta identica in più fonti.

**Scorta di sicurezza** (forma accademica) = `z × deviazione standard della
domanda × √(lead time)`, con **z fra 1 e 2** (più alto = minore rischio di
rottura di stock) `[fonte citata]`.

**Esempio riportato per un ricambio industriale** (cuscinetti): consumo medio
**0,5 pz/giorno**, lead time fornitore **7 giorni**, scorta di sicurezza **30% ≈
1 pz** → punto di riordino `(0,5 × 7) + 1 ≈ 5 pezzi` `[da risultati di ricerca]`.

⚠️ Nell'esempio la scorta di sicurezza è calcolata come **percentuale del consumo
nel lead time** (30%), non con la formula statistica: sono **due metodi diversi**,
e il secondo è quello che si usa quando la deviazione standard non si conosce —
cioè quasi sempre, in una cava. Vale la pena tenerli tutt'e due nel simulatore
come **due politiche**, non come una sola. `[dedotto]`

### Che cosa si tiene a magazzino

Non ho trovato una lista di magazzino di una cava vera. Quello che le fonti
nominano come parti soggette a usura e a sostituzione ricorrente:

- **filtri** (olio motore, gasolio, aria, idraulico) — legati agli intervalli di §3;
- **oli e lubrificanti** (motore, trasmissione, idraulico);
- **denti benna e portadenti** (usura continua, verifica settimanale);
- **cingoli** in gomma o in acciaio (sostituzione **in coppia**);
- **pneumatici** per pale gommate e dumper;
- **rivestimenti del frantoio**: mantelli, concavi, piastre delle mascelle
  (rapporto **2-3 mantelli per concavo**).

⚠️ Questo elenco è **compilato da me** mettendo insieme le parti nominate nelle
fonti di §3: è `[dedotto]`, non un censimento di magazzino.

### Perché la scorta conta: il costo del non averla

> Le riparazioni d'emergenza costano **3 – 10 volte** la stessa riparazione fatta
> a programma `[da risultati di ricerca]`.

> Il MTTR reale supera il tempo di riparazione attivo di **2-5×**, e fra le cause
> elencate c'è esplicitamente **l'approvvigionamento e la logistica dei ricambi**
> `[da risultati di ricerca]`.

`[dedotto]` Per il simulatore: **la mancanza di un ricambio non è un evento a
parte, è un moltiplicatore del fermo.** Modellare il magazzino come una cosa
scollegata dai fermi macchina perde esattamente il legame che le fonti indicano
come dominante.

### Rapporto programmato / non programmato

| grandezza | valore | marca |
|---|---|---|
| Obiettivo «world-class» | **80% programmato / 20% correttivo** (ore di manodopera) | `[da risultati di ricerca]` |
| Fascia «proattiva e stabile» | **60 – 80%** programmato | `[da risultati di ricerca]` |
| Fascia «di transizione» | **40 – 60%** programmato | `[da risultati di ricerca]` |
| Realtà dichiarata | «la maggior parte degli impianti industriali sta **sotto la metà** dell'obiettivo» | `[da risultati di ricerca]` |

---

## 6 · Scadenze di legge dei mezzi (Italia)

⛔ **Tutta questa sezione è di seconda mano.** Nessun testo di legge è stato
aperto. Ogni riga va riletta sul testo primario prima di finire in un prodotto.

### 6.1 Verifiche periodiche delle attrezzature — art. 71 c. 11 e **Allegato VII**, D.Lgs. 81/2008

- L'obbligo **non riguarda ogni macchina**: solo le attrezzature elencate
  nell'**Allegato VII** `[fonte citata]`.
- Due famiglie: **SC** (sollevamento materiali non azionati a mano e
  idroestrattori a forza centrifuga) e **SP** (sollevamento persone)
  `[fonte citata]`.
- **Periodicità da 1 a 3 anni**, secondo tipo di attrezzatura, **settore di
  impiego** e **vetustà** `[fonte citata]`.
- **Prima verifica periodica**: si richiede a **INAIL**, entro **45 giorni** dalla
  scadenza; se INAIL non può, delega un **soggetto abilitato** `[fonte citata]`.
  Le successive si richiedono direttamente al soggetto abilitato.

**Gru su autocarro** — il caso meglio documentato dai risultati, e istruttivo
perché la periodicità **dipende dal settore**:

| condizione | periodicità | marca |
|---|---|---|
| Settori **costruzioni, siderurgico, portuale, ESTRATTIVO** | **annuale** | `[fonte citata]` |
| Altri settori | **biennale** | `[fonte citata]` |
| **Oltre 10 anni di servizio** | **annuale**, in qualunque settore | `[fonte citata]` |

⛔ **Per una cava questo è il caso peggiore di default: settore estrattivo →
annuale.** Un simulatore che mettesse «biennale» come normale sbaglierebbe
proprio sul settore che ci interessa.

Altre attrezzature nominate nell'Allegato VII dai risultati: **autogru, carrelli
semoventi a braccio telescopico, carroponte, gru a bandiera / monorotaia / a
torre / derrick / a cavalletto, idroestrattori a forza centrifuga** (sollevamento
materiali non azionato a mano, **portata > 200 kg**); **ponti mobili sviluppabili
su carro** `[fonte citata]`.

⚠️ **Novità 2026 riportata:** la **L. 11 marzo 2026, n. 34** avrebbe modificato
l'Allegato VII inserendo la categoria *«Piattaforme di lavoro mobili elevabili e
piattaforme di lavoro fuori strada per operazioni in frutteto — verifica
triennale»* `[fonte citata]`. **Da verificare sul testo**: è recente, non
riguarda direttamente la cava, ma dimostra che l'Allegato VII **cambia**.

⚠️ **Un escavatore o una pala, in quanto tali, NON sono nell'Allegato VII** —
non sono apparecchi di sollevamento. La verifica periodica INAIL scatta sulla
**gru**, non sull'escavatore. Non ho trovato una fonte che lo dica in negativo
in modo esplicito, quindi è `[dedotto]` dalla lettura dell'elenco.

### 6.2 Revisione stradale (Codice della Strada)

- **Art. 114 CdS**: solo le macchine operatrici **targate, immatricolate e con
  carta di circolazione** possono circolare su strada aperta al pubblico
  `[fonte citata]`.
- L'obbligo di **revisione periodica** per macchine agricole e macchine operatrici
  immatricolate è stato disposto **dal 31/12/2015**, con priorità ai mezzi
  immatricolati prima dell'01/01/2009 `[fonte citata]`.
- ⛔ **Ed è ancora largamente non operativo.** Il *Milleproroghe 2026* (dato come
  **L. 27 febbraio 2026, n. 26**, in G.U. n. 49 del 28/02/2026, in vigore
  dall'01/03/2026) sarebbe la **quinta proroga** `[fonte citata]`. Calendario
  riportato: prima scadenza **31/12/2026** per i mezzi immatricolati entro il
  **31/12/1983**; **31/12/2027** per quelli immatricolati fra **01/01/1984** e
  **31/12/1996**; finestre successive per le classi più recenti `[fonte citata]`.
- **Il decreto interministeriale attuativo manca ancora**, a dieci anni di
  distanza: è la ragione dichiarata dei rinvii `[fonte citata]`.

⚠️ **Per un simulatore questo è un parametro «vivo»:** la scadenza esiste
sulla carta, la data si sposta ogni anno, e il mezzo vero in cava spesso non è
nemmeno targato (se non esce dal piazzale). Modellarla come una scadenza fissa
sarebbe più falso che non modellarla.

### 6.3 Abilitazione dell'operatore (non del mezzo, ma scade allo stesso modo)

- **Accordo Stato-Regioni 22 febbraio 2012**, attuativo dell'**art. 73 c. 5 del
  D.Lgs. 81/2008** `[fonte citata]`.
- Validità dell'abilitazione: **5 anni** dalla verifica finale `[fonte citata]`.
- Aggiornamento: **minimo 4 ore**, di cui **3 di pratica** `[fonte citata]`.
- Macchine coinvolte citate: **escavatori idraulici, pale caricatrici frontali,
  terne, autoribaltabili a cingoli** `[fonte citata]`.
- Obbligo in vigore **dal 12/03/2013** `[fonte citata]`.

---

## 7 · Costi

### Costo orario da prezzari pubblici italiani (nolo a caldo = con operatore e carburante)

| voce | costo | fonte | marca |
|---|---|---|---|
| Escavatore cingolato **232 kW / 316 CV** | **179,30 €/h** | Prezzario Regione Siciliana **2024** | `[fonte citata]` |
| Minipala compatta gommata | **76,20 €/h** (base 46,26 + 29,94 di oneri, **+39,29%**) | Prezzario Regione Siciliana **2024** | `[fonte citata]` |
| **Dumper 23 t** | **64,75 €/h** | Prezzario Regione **Calabria** | `[fonte citata]` |

⚠️ **Il prezzario Calabria che compare nei risultati è del 2009**: quel 64,75 €/h
è vecchio di sedici anni e non va usato senza rivalutazione. Il prezzario
**Abruzzo 2025** esiste ed è pubblico, ma i risultati non ne hanno mostrato le
tariffe.

⚠️ La riga della minipala è la più utile per il simulatore **non per il suo
valore ma per la sua struttura**: il prezzario espone **base + oneri**, con gli
oneri al **39,29%** della base. È il modo in cui i prezzari italiani compongono un
costo orario.

**Il nolo a caldo include carburante e lubrificante** `[fonte citata]`.

### Costo orario di mercato (noleggio commerciale con operatore)

| macchina | costo | marca |
|---|---|---|
| Escavatore 10 q (1 t) | **65,80 €/h** | `[da risultati di ricerca]` |
| Escavatore 35 q (3,5 t) | **130 €/h** | `[da risultati di ricerca]` |
| Escavatore 60 q (6 t) | **180 €/h** | `[da risultati di ricerca]` |

⛔ **Questi tre numeri non sono confrontabili con il prezzario e vanno tenuti
separati.** Un escavatore da **6 tonnellate** a 180 €/h contro uno da **232 kW**
(che ne pesa dieci volte tanto) a 179,30 €/h è impossibile come dato di costo: il
listino commerciale include **trasporto, minimi di fatturazione e margine**, il
prezzario no. Sono **prezzi di vendita**, non costi di esercizio. `[dedotto]`

### Struttura del costo

| voce | valore | marca |
|---|---|---|
| Prezzo d'acquisto sul totale del possesso (TCO) | **20 – 30%** | `[da risultati di ricerca]` |
| Carburante sui costi operativi | **fino al 30%** | `[da risultati di ricerca]` |
| Energia sui costi operativi di un impianto inerti | **30 – 40%** | `[da risultati di ricerca]` |

**Costi di possesso (fissi):** ammortamento, licenze, assicurazioni, tasse, costo
del capitale, valore di realizzo `[fonte citata]`.
**Costi di esercizio (variabili, per ora di lavoro):** riparazioni, carburante,
manutenzione preventiva, **pneumatici o cingoli**, **parti di usura**
`[fonte citata]`.

⚠️ Non ho trovato una **ripartizione percentuale completa** (gasolio X%,
manutenzione Y%, ammortamento Z%, operatore W%) da una fonte sola e attribuibile.
Le fonti danno pezzi sparsi che non sommano a 100.

### Gasolio: prezzo e accisa (Italia, 2026)

| grandezza | valore | marca |
|---|---|---|
| Prezzo gasolio autotrazione, agosto 2026 | **2,104 €/L** | `[da risultati di ricerca]` |
| Accisa piena gasolio autotrazione 2026 | **672,90 €/1.000 L = 0,6729 €/L** | `[fonte citata]` |
| Allineamento accisa gasolio/benzina | completato il **19/03/2026** | `[fonte citata]` |
| IVA | **22%** sull'intero importo | `[fonte citata]` |
| Rimborso ADM autotrasporto (veicoli ≥ 7,5 t, Euro 5+) | accisa effettiva **403,22 €/1.000 L** dal 01/01 al 18/03/2026, **603,22** dal 19 al 31/03/2026 | `[fonte citata]` |
| Esenzioni per usi industriali e agricoli | **Tabella A, D.Lgs. 504/1995** | `[fonte citata]` |

⛔ **Nello stesso risultato compaiono due valori di accisa — 0,6729 €/L e
0,61740 €/L — senza spiegazione.** Non so quale sia la corrente. **Questo numero
non va scritto in nessuna schermata** finché non è letto sul testo primario.

⚠️ **La riga che conta per una cava è l'ultima**: il gasolio consumato **dentro**
la cava non è gasolio da autotrazione, e la Tabella A del D.Lgs. 504/1995
disciplina esenzioni e aliquote ridotte per usi industriali. **Non ho trovato
l'aliquota applicabile alle macchine operatrici in cava.** È probabilmente il
singolo numero più importante di tutta questa sezione per un conto economico, ed
è quello che non ho. Vedi §9.

---

## 8 · Tabella riepilogativa dei parametri per il simulatore

Solo i parametri, con la fonte e la marcatura. Le avvertenze stanno nelle sezioni.

| # | parametro | valore / intervallo | unità | fonte | marca |
|---|---|---|---|---|---|
| 1 | Ore/anno escavatore | 1.000 – 2.000 | h/anno | rivista di settore | `[da risultati di ricerca]` |
| 2 | Ore/anno escavatore 36 t (telematica) | ~1.000 | h/anno | telematica costruttore | `[fonte citata]` |
| 3 | Ore/anno pala gommata | 1.200 – 1.500 | h/anno | rivista di settore | `[da risultati di ricerca]` |
| 4 | Vita utile escavatore (uscita produzione) | ~9.800 (~6 anni) | h | rivista di settore | `[da risultati di ricerca]` |
| 5 | Vita utile escavatore (massima) | 15.000+ | h | rivenditori | `[da risultati di ricerca]` |
| 6 | Vita utile pala gommata | 7.000 – 12.000 (~10 anni) | h | rivenditori | `[da risultati di ricerca]` |
| 7 | Durata turno | 8 (6 – 12) | h | prassi/normativa lavoro | `[fonte citata]` |
| 8 | Giornate/anno, 2 turni | 247,5 | gg | contrattualistica | `[fonte citata]` |
| 9 | Giornate/anno, ciclo continuo | 232,5 | gg | contrattualistica | `[fonte citata]` |
| 10 | Job efficiency factor | 0,83 (0,70 – 0,85; min 0,50) | — | manualistica di stima | `[fonte citata]` |
| 11 | Quota di minimo, escavatore | ~40% | % ore contaore | telematica costruttore | `[fonte citata]` |
| 12 | Quota di minimo, pala gommata | 40 – 50% | % ore contaore | rivista di settore | `[da risultati di ricerca]` |
| 13 | Quota di minimo, media flotta (75.000 macchine) | 38% | % ore contaore | telematica costruttore | `[fonte citata]` |
| 14 | Quota di minimo, obiettivo | < 20 – 30% | % ore contaore | consulenti | `[da risultati di ricerca]` |
| 15 | Consumo escavatore 10-20 t | 5 – 12 | L/h | generico | `[da risultati di ricerca]` |
| 16 | Consumo escavatore 20-30 t+ | 15 – 25 | L/h | generico | `[da risultati di ricerca]` |
| 17 | Consumo escavatore classe 33 t | 38 – 53 | L/h | per modello | `[da risultati di ricerca]` |
| 18 | Consumo pala compatta | 7,5 – 15 | L/h | generico | `[da risultati di ricerca]` |
| 19 | Consumo pala da miniera (10+ yd³) | 75 – 114 | L/h | generico | `[da risultati di ricerca]` |
| 20 | Consumo dumper articolato, carico normale | 37 – 56 | L/h | generico | `[da risultati di ricerca]` |
| 21 | Consumo dumper articolato, carico pesante | 75 – 93 | L/h | generico | `[da risultati di ricerca]` |
| 22 | Minimo assunto nelle colonne Low/Medium/High del costruttore | 50 / 30 / 10 | % | Cat Performance Handbook | `[fonte citata]` |
| 23 | Effetto dell'operatore su consumo e produzione | ±15 | % | rivista di settore | `[da risultati di ricerca]` |
| 24 | Energia di frantumazione | 2,2 – 3,5 | kWh/t | settore inerti | `[da risultati di ricerca]` |
| 25 | Incidenza energia su costi impianto inerti | 30 – 40 | % | settore inerti | `[da risultati di ricerca]` |
| 26 | Tagliando olio motore + filtri | 250 | h | manualistica | `[da risultati di ricerca]` |
| 27 | Filtro aria, gioco valvole | 500 | h | manualistica | `[da risultati di ricerca]` |
| 28 | Olio trasmissione + idraulico | 1.000 | h | manualistica | `[da risultati di ricerca]` |
| 29 | Revisione pompe, tarature | 2.000 | h | manualistica | `[da risultati di ricerca]` |
| 30 | Controllo tensione cingoli | 50 | h | manualistica | `[da risultati di ricerca]` |
| 31 | **Moltiplicatore intervalli in servizio severo (cava)** | **0,5×** | — | rivista di settore | `[da risultati di ricerca]` |
| 32 | Carico motore in servizio severo | 80 – 100 | % | rivista di settore | `[da risultati di ricerca]` |
| 33 | Soglia sostituzione denti benna | ~1/3 spessore residuo | — | fornitori | `[da risultati di ricerca]` |
| 34 | Calo di penetrazione a soglia denti | 20 – 30 | % | fornitori | `[da risultati di ricerca]` |
| 35 | Rivestimenti frantoio primario | 400 – 800 | h | fornitori | `[da risultati di ricerca]` |
| 36 | Rivestimenti frantoio secondario/terziario | 1.500 – 3.000 | h | fornitori | `[da risultati di ricerca]` |
| 37 | Rivestimenti su roccia tenera/media | 100 – 300 | h | fornitori | `[da risultati di ricerca]` |
| 38 | Rivestimenti su roccia molto abrasiva | 50 – 150 | h | fornitori | `[da risultati di ricerca]` |
| 39 | Soglia sostituzione mantello | ~70% usura | — | fornitori | `[da risultati di ricerca]` |
| 40 | Mantelli per concavo | 2 – 3 | pz | fornitori | `[da risultati di ricerca]` |
| 41 | Disponibilità tecnica world-class | 85 – 95 | % | benchmark mining | `[da risultati di ricerca]` |
| 42 | Disponibilità mezzi di supporto | 85 – 88 | % | benchmark mining | `[da risultati di ricerca]` |
| 43 | Utilizzo world-class | 70 – 85 | % | benchmark mining | `[da risultati di ricerca]` |
| 44 | OEE obiettivo / media / dumper reali | >85 / 60-65 / <40 | % | benchmark mining | `[da risultati di ricerca]` |
| 45 | MTBF dumper, media | 60 – 80 | h | benchmark mining | `[da risultati di ricerca]` |
| 46 | MTBF dumper, best-in-class | 450 – 600 | h | benchmark mining | `[da risultati di ricerca]` |
| 47 | MTTR reale / tempo attivo di riparazione | 2 – 5 | × | manutenzione industriale | `[da risultati di ricerca]` |
| 48 | Costo riparazione d'emergenza / a programma | 3 – 10 | × | manutenzione industriale | `[da risultati di ricerca]` |
| 49 | Riduzione fermi con predittiva | 35 – 50 | % | fornitori predittiva | `[da risultati di ricerca]` |
| 50 | Rapporto programmato/correttivo, obiettivo | 80 / 20 | % ore manodopera | manutenzione industriale | `[da risultati di ricerca]` |
| 51 | Punto di riordino | `SS + (consumo medio × lead time)` | — | logistica | `[fonte citata]` |
| 52 | Scorta di sicurezza | `z × σ × √(lead time)`, z 1 – 2 | — | logistica | `[fonte citata]` |
| 53 | Verifica gru su autocarro, settore estrattivo | 12 | mesi | All. VII D.Lgs. 81/2008 | `[fonte citata]` |
| 54 | Verifica gru su autocarro, altri settori | 24 | mesi | All. VII D.Lgs. 81/2008 | `[fonte citata]` |
| 55 | Verifica gru su autocarro oltre 10 anni | 12 | mesi | All. VII D.Lgs. 81/2008 | `[fonte citata]` |
| 56 | Periodicità Allegato VII, intervallo generale | 12 – 36 | mesi | All. VII D.Lgs. 81/2008 | `[fonte citata]` |
| 57 | Termine richiesta prima verifica | 45 | gg prima della scadenza | prassi INAIL | `[fonte citata]` |
| 58 | Soglia portata apparecchi di sollevamento | > 200 | kg | All. VII D.Lgs. 81/2008 | `[fonte citata]` |
| 59 | Validità abilitazione operatore | 5 | anni | Acc. Stato-Regioni 22/02/2012 | `[fonte citata]` |
| 60 | Aggiornamento abilitazione | 4 (di cui 3 pratiche) | h | Acc. Stato-Regioni 22/02/2012 | `[fonte citata]` |
| 61 | Costo orario escavatore cingolato 232 kW | 179,30 | €/h | Prezzario Sicilia 2024 | `[fonte citata]` |
| 62 | Costo orario minipala gommata | 76,20 (46,26 + 39,29% oneri) | €/h | Prezzario Sicilia 2024 | `[fonte citata]` |
| 63 | Costo orario dumper 23 t | 64,75 | €/h | Prezzario Calabria (2009) | `[fonte citata]` |
| 64 | Prezzo d'acquisto sul TCO | 20 – 30 | % | consulenti | `[da risultati di ricerca]` |
| 65 | Carburante sui costi operativi | fino a 30 | % | consulenti | `[da risultati di ricerca]` |
| 66 | Prezzo gasolio autotrazione, ago 2026 | 2,104 | €/L | rilevazione di settore | `[da risultati di ricerca]` |
| 67 | Accisa gasolio autotrazione 2026 | 0,6729 (⚠️ vedi §7) | €/L | normativa accise | `[fonte citata]` |

---

## 9 · Costruttore contro esercizio reale

Le fonti danno **entrambe le facce solo in tre punti**. Dove esiste il confronto,
il reale è sempre peggiore — ma **non sempre per la ragione che ci si aspetta**.

| grandezza | dato di costruttore / obiettivo | dato di esercizio reale | rapporto |
|---|---|---|---|
| Intervalli di manutenzione | libretto: 250 / 500 / 1.000 / 2.000 h | servizio severo in cava: **0,5×** → 125 / 250 / 500 / 1.000 h | **2× più eventi** |
| OEE | obiettivo > 85% | media di settore 60-65%; dumper reali **< 40%** | fino a **2× peggio** |
| MTBF dumper | best-in-class 450-600 h | media 60-80 h | **~7× peggio** |
| Manutenzione programmata | obiettivo 80% | «la maggior parte degli impianti sta sotto la metà» → < 40% | **2× peggio** |
| Tempo al minimo | obiettivo < 20-30% | 38-40% misurato su flotta | **~1,5× peggio** |
| MTTR | tempo di riparazione attivo | reale, con diagnosi + ricambi + logistica | **2-5× peggio** |

⛔ **Il consumo di carburante è l'eccezione, e va detto:** per Caterpillar i
valori pubblicati **vengono già dalla telematica delle macchine dei clienti**, non
da un banco prova `[fonte citata]`. Quindi lì **non c'è** un «dato ideale» da
peggiorare: c'è un dato reale già mediato su una popolazione, e la variabilità che
resta è quella dell'**applicazione** e dell'**operatore** (±15%).

`[dedotto]` **La regola pratica per il simulatore**, se serve un solo
moltiplicatore: dove la fonte dà un obiettivo, il reale sta a **1,5-2×** in
peggio; dove la fonte dà un best-in-class di affidabilità, il reale può stare a
**5-7×** in peggio. Non è la stessa cosa e non va usato lo stesso fattore.

---

## 10 · Contraddizioni trovate nelle fonti (da non appianare)

Le elenco perché **un simulatore che le media produce un numero che non descrive
nessuna cava**.

1. **Energia di frantumazione: 2,2-3,5 kWh/t contro «oltre 200 kWh/t»** — due
   ordini di grandezza, stessa famiglia di fonti. Il 200 è quasi certamente
   sbagliato o in altra unità.
2. **Consumo escavatore 20-30 t: 15-25 L/h contro 38-53 L/h per la classe 33 t** —
   fattore 2, condizioni non dichiarate.
3. **Rivestimenti frantoio primario: 400-800 h contro 100-300 h** — la differenza
   è la durezza della roccia, non dichiarata nella prima riga.
4. **MTBF dumper: 60-80 h contro 450-600 h** — fattore 7,5; probabile differenza
   nella **definizione di guasto**, che non ho trovato scritta.
5. **Disponibilità 85-95% «world-class» contro MTBF medio 60-80 h** — con MTTR
   plausibile la flotta *media* cadrebbe dentro la fascia world-class: le due
   righe non vengono dalla stessa definizione.
6. **Accisa gasolio 2026: 0,6729 €/L contro 0,61740 €/L** nello stesso risultato.
7. **Noleggio commerciale contro prezzario**: escavatore da 6 t a 180 €/h contro
   escavatore da 232 kW a 179,30 €/h — sono prezzi di vendita contro costi.

---

## 11 · Quello che non sono riuscito a trovare

Elenco esplicito, come richiesto. Ognuna di queste righe è una **mancanza vera**,
non una cosa che non ho cercato.

1. **Le tabelle del Caterpillar Performance Handbook.** So che esistono, so come
   sono strutturate (Low/Medium/High con quota di minimo dichiarata), **non ho
   letto un solo valore in L/h dal documento**. Il PDF è pubblico su almeno due
   domini; `WebFetch` è bloccato su entrambi. Chi ha accesso a una rete non
   filtrata lo apre in cinque minuti e questa ricerca migliora di molto.
2. **Qualunque dato Komatsu, Volvo o Liebherr per modello.** Solo la media di
   idle Komatsu (38%) è emersa; nessuna tabella di consumo.
3. **Consumo del dumper articolato per modello** (Volvo A40, Cat 745): solo la
   fascia generica 37-56 / 75-93 L/h, mai un valore attribuito a un modello.
4. **Ore/anno e giorni/anno di una cava di inerti ITALIANA.** Tutti i dati di
   ore/anno vengono da Nord America o dall'edilizia generica. I 247,5 / 232,5
   giorni vengono dalla contrattualistica generale del lavoro a turni, non dal
   settore estrattivo.
5. **L'aliquota di accisa applicabile al gasolio usato dalle macchine operatrici
   dentro una cava.** So che le esenzioni per usi industriali stanno nella
   **Tabella A del D.Lgs. 504/1995**; non ho trovato la voce applicabile. È
   probabilmente il numero più importante che manca per un conto economico.
6. **Una ripartizione percentuale completa del costo orario** (gasolio /
   manutenzione / ammortamento / operatore) da una fonte sola. Ho solo pezzi che
   non sommano a 100.
7. **Le tariffe complete del Prezzario Abruzzo 2025** e di ogni altro prezzario
   regionale recente: i documenti esistono e sono pubblici, ma senza `WebFetch`
   ho solo le poche voci che i risultati di ricerca hanno esposto.
8. **Un elenco reale di magazzino ricambi di una cava.** L'elenco di §5 l'ho
   compilato io mettendo insieme le parti nominate altrove: è `[dedotto]`.
9. **I valori di lead time dei ricambi** per macchine da cava in Italia (giorni
   dal fornitore). La formula del punto di riordino ce l'ho, il numero da metterci
   dentro no.
10. **La definizione di «guasto» usata nei benchmark MTBF minerari** — qualunque
    fermo, o solo il fermo che ferma la produzione? Senza questa, il numero non è
    utilizzabile.
11. **La durata di un fermo macchina tipico in ore**, per famiglia di guasto. Ho
    solo il rapporto MTTR reale / tempo attivo (2-5×), mai un valore assoluto.
12. **Se e quando la revisione stradale delle macchine operatrici diventi
    davvero esigibile**: il decreto attuativo manca da dieci anni e le date si
    spostano ogni Milleproroghe.
13. **Il testo dell'Allegato VII con la tabella completa delle periodicità.** Ho
    solo il caso della gru su autocarro, che i risultati documentano bene, e
    l'intervallo generale 1-3 anni.
14. **Dati sull'usura degli pneumatici** di pale e dumper in cava (ore di vita,
    costo): nominati come voce di costo, mai quantificati.

---

## Fonti

Prezzari e costi:
- [Regione Siciliana — noli a caldo e a freddo 2024](https://www.regione.sicilia.it/sites/default/files/2024-11/noli%20a%20caldo%20e%20a%20freddo%20anno%202024.pdf)
- [Regione Siciliana — tabella manodopera e noli 2024](https://www.regione.sicilia.it/sites/default/files/2024-01/Tabella%20manodopera%20e%20noli%202024_0.pdf)
- [Regione Calabria — prezzario, volume III (manodopera e noli)](https://www.consiglioregionale.calabria.it/gestbur_2002/prezzario/2009/volume_iii.pdf)
- [Regione Abruzzo — prezzario opere edili 2025](https://bura.regione.abruzzo.it/sites/bura.regione.abruzzo.it/files/bollettini/2025-01-13/all-prezzario-opere-edili-regione-abruzzo-2025-manodopera-noli-prestazioni-1.pdf)
- [Boom & Bucket — heavy equipment ownership costs](https://www.boomandbucket.com/blog/heavy-equipment-ownership-costs-breakdown-for-contractors-2026)

Consumi:
- [Caterpillar Performance Handbook — estratto consumi (wheelercat)](https://wheelercat.com/wp-content/uploads/2023/01/Cat-Performance-Handbook-from-VST-fuel-consumption-2022-12-09T21-20-09.pdf) — ⚠️ non leggibile da qui
- [Caterpillar Performance Handbook ed. 29 (Univ. of Washington)](http://courses.washington.edu/esrm468/468%20Class%20material/PHB29.pdf)
- [Fuel Table — Excavators (PDF)](https://static1.squarespace.com/static/58877529414fb5283ed14a6b/t/5888f8bfb8a79b5efa002f01/1485371584196/Fuel+Table+-+Excavators.pdf)
- [Excavator fuel consumption per hour](https://desimachines.com/blog/excavator-fuel-consumption-per-hour/)
- [Volvo CE — Fuel Efficiency Guarantee](https://www.volvoce.com/united-states/en-us/volvo-services/fuel-efficiency-services/fuel-efficiency-guarantee/)
- [Twin srl — efficienza energetica negli impianti di frantumazione](https://www.twinsrl.it/news/9/efficienza-energetica-negli-impianti-di-frantumazione-strategie-pratiche-per-ridurre-i-consumi-in-cava/)
- [Twin srl — impianti di frantumazione, come funzionano e costi](https://www.twinsrl.it/news/3/impianti-di-frantumazione-come-funzionano-e-quanto-possono-costare/)

Ore, utilizzo e vita utile:
- [Construction Equipment — component life sketches](https://www.constructionequipment.com/earthmoving/wheel-loaders/article/10708736/component-life-sketches-wheel-loader-excavator-and-crawler-dozer-economic-life)
- [Construction Equipment — how to manage engine idling](https://www.constructionequipment.com/sustainability/article/10757122/how-to-manage-engine-idling-for-efficiency)
- [Equipment World — is it time for a new wheel loader](https://www.equipmentworld.com/roadbuilding/article/14957252/is-it-time-for-a-new-wheel-loader)
- [Thompson Tractor — average lifespan of construction equipment](https://thompsontractor.com/blog/average-lifespan-of-common-construction-equipment/)
- [Productivity of construction equipment (dispensa universitaria, PDF)](http://ndl.ethernet.edu.et/bitstream/123456789/89958/1/Chapter%202_Productivity%20of%20Equipments_Lecture%20note.pdf)
- [KSU — earthmoving materials and operations (PDF)](https://faculty.ksu.edu.sa/sites/default/files/2.ce417-note-ch2.pdf)
- [Fiscomania — lavoro a turni 2026](https://fiscomania.com/lavoro-a-turni/)
- [Assolombarda — dispensa sull'orario di lavoro](https://www.assolombarda.it/servizi/lavoro-e-previdenza/documenti/dispensa-02-2022-lorario-di-lavoro)

Manutenzione, guasti, ricambi:
- [Guida alla manutenzione dei macchinari movimento terra](https://movimento-terra.it/guida-alla-manutenzione-dei-macchinari-movimento-terra/)
- [Giffi Noleggi — manutenzione escavatore](https://www.giffinoleggi.com/it/manutenzione-escavatore-in-8-semplici-mosse.html)
- [Heavy Vehicle Inspection — wheel loader PM schedule](https://heavyvehicleinspection.com/blog/post/wheel-loader-preventive-maintenance-schedule)
- [Heavy Vehicle Inspection — mining uptime benchmark](https://heavyvehicleinspection.com/fleet-management/uptime/mining-uptime-benchmark)
- [RMC — denti per benne](https://www.rmcricambi.com/denti-per-benne-se-consumati-nessuno-se-ne-accorge-ma-tutto-rallenta/)
- [TCE Magazine — manutenzione cingoli escavatore](https://www.tcemagazine.it/74545/manutenzione-cingoli-escavatore/)
- [Mining Crusher Parts — how long do cone crusher liners last](https://www.miningcrusherparts.com/blog/how-long-do-cone-crusher-liners-last/)
- [Tycosen — cone crusher liners vs jaw plate replacement cycles](https://tycosen.com/cone-crusher-liners-vs-jaw-plate-parts-wear-mechanism-structure-differences-replacement-cycles/)
- [Opsima — MTBF formula e benchmark](https://opsima.com/blog/kpis/mean-time-between-failures/)
- [Opsima — mining industry KPIs](https://opsima.com/blog/kpis/mining-industry-kpis/)
- [Limble — planned vs unplanned maintenance ratio](https://limble.com/blog/planned-vs-unplanned-maintenance-ratio)
- [Innovapptive — PM/CM ratio 80/20](https://www.innovapptive.com/blog/how-to-improve-pm-ratio-80-20-maintenance-effectiveness-guide)
- [Mecalux — punto di riordino](https://www.mecalux.it/blog/punto-di-riordino)
- [Mecalux — 7 formule per la gestione delle scorte](https://www.mecalux.it/blog/formula-calcolo-scorte-di-magazzino)
- [Ingenia — magazzino ricambi senza stockout](https://ingenia.cloud/blog/come-gestire-magazzino-ricambi-senza-stockout)

Norme e scadenze:
- [Edafos — verifiche periodiche attrezzature, scadenze 2026](https://www.edafos.it/attrezzature-e-macchine/verifiche-periodiche-delle-attrezzature-di-lavoro/)
- [Progetto81 — verifiche periodiche attrezzature di sollevamento, Allegato VII](https://www.progetto81.it/blog/61/attrezzature-sollevamento)
- [Centro Revisione Gru — gru su autocarro oltre 10 anni](https://www.centrorevisionegru.org/gru-autocarro-oltre-10-anni-verifica-annuale/)
- [Art. 114 Codice della Strada](https://www.avvocatoandreani.it/servizi/codice-della-strada/art-114-cds.html)
- [Assimpredil Ance — revisione obbligatoria macchine agricole e operatrici](https://portale.assimpredilance.it/articoli/revisione-obbligatoria-macchine-agricole-e-macchine-operatrici)
- [Certifico — revisione macchine agricole e operatrici, tabella scadenze](https://www.certifico.com/sicurezza-lavoro/news-sicurezza/revisione-generale-macchine-agricole-e-macchine-operatrici-tabella-scadenze)
- [Consulenza Agricola — proroga revisione macchine agricole](https://consulenzaagricola.it/circolari/varie/26616-revisione-macchine-agricole-proroga-conferma-natura-strutturale-rinvio)
- [Scuola Sicurezza — patentino escavatore e macchine movimento terra](https://www.scuolasicurezza.it/patentino-escavatore-macchine-movimento-terra/)
- [Centrofor — aggiornamento escavatore e pala caricatrice (4 ore)](https://www.centrofor.com/aggiornamento-escavatore-idraulico-e-pala-caricatrice-frontale-abilitazione-4-ore-esami/)

Gasolio e accise:
- [ProntoAccise — aliquote accise gasolio 2026](https://www.prontoaccise.it/aliquote-accise-gasolio-2026)
- [Legge in Chiaro — accise benzina e gasolio 2026](https://leggeinchiaro.it/accise-benzina-gasolio-2026-come-cambiano-i-prezzi-esempio/)
- [Rivaluta — prezzi medi mensili gasolio autotrazione](https://www.rivaluta.it/prezzi/prezzi-gasolio-autotrazione.asp)
- [Contratto Trasporti — prezzo gasolio agosto 2026](https://www.contrattotrasporti.it/prezzo-gasolio/)
