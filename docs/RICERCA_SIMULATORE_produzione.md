# Come funziona, in numeri, una cava di inerti italiana

**Ricerca di mondo — nessun delta sul nostro codice.**
Scritta il **16/08/2026**, contro il commit `96dd7723`. Questo documento contiene
**solo la metà sul mondo**: non ho aperto nessun file delle nostre app, non
propongo modifiche e non dichiaro nessuna mancanza. Il confronto con il prodotto
lo fa chi ha il codice in mano.

Scopo: dare a un **simulatore di cava sintetica** dei parametri che vengano da
dati pubblicati invece che da invenzione.

---

## Come leggere le marcature

| Marca | Significato |
|---|---|
| `[fonte citata]` | Il numero compare in un documento istituzionale o associativo identificabile, ripreso da più risultati concordanti |
| `[da risultati di ricerca]` | Il numero viene da estratti di ricerca; **non ho potuto aprire il testo primario** |
| `[dedotto]` | L'ho **calcolato io** da numeri marcati sopra. L'aritmetica è scritta accanto perché si possa rifare |

⚠️ **Limite dello strumento, misurato oggi e non creduto.** `WebSearch` funziona.
`WebFetch` su `webthesis.biblio.polito.it` ha risposto **`EGRESS_BLOCKED`**
(provato una volta, oggi). Quindi so **che cosa esiste** ma **non ho letto una
sola fonte primaria**: nessun numero qui sotto è stato verificato sul PDF
originale. Ogni riga `[fonte citata]` va riaperta prima di finire in una
schermata che vede un cliente.

⚠️ **E una regola che vale per tutta la tabella**: dove ho scritto `[dedotto]`,
il numero è **mio**, non del mondo. È fatto per essere ricontrollato, non per
essere copiato.

---

## 1. Produzione: quanto estrae una cava in un anno

### 1a. I totali nazionali (il denominatore)

| Parametro | Valore | Unità | Anno | Fonte | Marca |
|---|---|---|---|---|---|
| Cave autorizzate in Italia | 3.378 | cave | ~2024 | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Variazione cave autorizzate | −20,7% vs 2021; −51,3% vs 2008 | % | — | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Cave dismesse o abbandonate | 14.640 (+3,5% vs 2021) | cave | ~2024 | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Estrazione sabbia e ghiaia | 34,6 (+18,5% vs 2021) | milioni m³/anno | ~2024 | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Estrazione calcare | 51,6 (+92,5% vs 2021) | milioni m³/anno | ~2024 | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Canoni di concessione incassati dal pubblico | < 20 | milioni €/anno | ~2024 | Legambiente, Rapporto Cave 2025 | `[fonte citata]` |
| Estrazione sabbia e ghiaia (rilevazione precedente) | 29,0 | milioni m³/anno | ~2020 | Legambiente, Rapporto Cave 2021 | `[fonte citata]` |
| Estrazione calcare (rilevazione precedente) | 26,8 | milioni m³/anno | ~2020 | Legambiente, Rapporto Cave 2021 | `[fonte citata]` |
| Pietre ornamentali | > 6,2 | milioni m³/anno | ~2020 | Legambiente, Rapporto Cave 2021 | `[fonte citata]` |
| Siti attivi produttivi (cave + miniere) | 2.295 (2.227 cave + 68 miniere) | siti | 2016 | ISTAT, *Le attività estrattive da cave e miniere* | `[fonte citata]` |
| Minerali non energetici estratti | 167,8 | milioni t/anno | 2016 | ISTAT | `[fonte citata]` |
| Addetti del settore estrattivo (cave + miniere) | ~15.000 | persone | 2016 | ISTAT | `[fonte citata]` |
| Imprese autorizzate e in produzione | 1.810 (−7,5% vs 2016) | imprese | 2017 | ISTAT | `[fonte citata]` |
| Siti in produzione (su 5.154 censiti) | 2.196 | siti | 2017 | ISTAT | `[fonte citata]` |
| Calcare estratto | ~64,8 | milioni t/anno | 2017 | ISTAT | `[fonte citata]` |
| Macro-aggregato calcare+travertino+gesso+arenaria | 72,4 = **48,5%** del totale cave | milioni t/anno | 2017 | ISTAT | `[fonte citata]` |
| → Totale estratto da sole cave | 72,4 ÷ 0,485 ≈ **149,3** | milioni t/anno | 2017 | — | `[dedotto]` |
| Produttori di aggregati in Italia | 1.120 su 2.800 siti, 164 Mt (7° in Europa) | — | 2018 | UEPG / Aggregates Europe, Annual Review | `[da risultati di ricerca]` |
| Imprese del comparto aggregati | ~1.900 su ~2.500 cave (**1,5 cave per impresa**) | — | ~2020 | ANEPLA via *Aggregates Business* | `[da risultati di ricerca]` |
| Industria aggregati europea | 15.000 imprese, 26.000 siti, 187.000 addetti, ~3.000 Mt/anno | — | ~2020 | UEPG | `[da risultati di ricerca]` |

⚠️ **Il +92,5% sul calcare non è un boom: è quasi certamente un cambio di
copertura della rilevazione.** Legambiente incrocia i dati che le Regioni le
mandano, e una Regione che comincia (o smette) a rispondere sposta il totale
nazionale senza che nessuna cava abbia cambiato ritmo. Un simulatore che
prendesse quel +92,5% come tasso di crescita costruirebbe una curva falsa.
Non ho potuto aprire il rapporto per verificarlo: resta una **mia ipotesi**.

### 1b. La cava media — tre derivazioni indipendenti che convergono

Questo è il numero che serve davvero a un simulatore, e in nessuna fonte è
scritto: va **diviso**.

| Via di calcolo | Aritmetica | Risultato | Marca |
|---|---|---|---|
| ISTAT 2016 | 167,8 Mt ÷ 2.295 siti attivi produttivi | **73.100 t/sito/anno** | `[dedotto]` |
| UEPG 2018 (soli aggregati) | 164 Mt ÷ 2.800 siti | **58.600 t/sito/anno** | `[dedotto]` |
| Legambiente 2025 | (34,6 + 51,6) Mm³ ÷ 3.378 cave autorizzate = 25.500 m³ → × 2,6 t/m³ | **66.300 t/cava/anno** | `[dedotto]` |

**Tre fonti che non si parlano danno 58.600, 66.300 e 73.100 t/anno.** Per un
simulatore, la cava "media" italiana di inerti sta fra **60.000 e 75.000
tonnellate all'anno**, cioè circa **25.000–30.000 m³ in banco**.

⛔ **Ma la media è il numero più ingannevole di tutti, e va detto perché nessuno
la usi da sola.** La distribuzione è fortissimamente asimmetrica: la stessa
ricerca porta una cava reale (Italcave, Taranto) che dichiara **oltre 1.200.000
t/anno** `[da risultati di ricerca]` — **sedici volte la media**. Quindi la
media nazionale non descrive nessuna cava esistente: descrive un rapporto fra
due totali. Un simulatore onesto genera una **distribuzione log-normale o di
Pareto**, non un valore centrale con del rumore attorno.

### 1c. Una scala proposta (dichiaratamente costruita, non trovata)

| Classe | Produzione | Marca |
|---|---|---|
| Piccola | 10.000 – 40.000 t/anno | `[dedotto]` |
| **Media** | **60.000 – 150.000 t/anno** | `[dedotto]` |
| Grande | 300.000 – 1.200.000+ t/anno | `[dedotto]`, estremo superiore da Italcave `[da risultati di ricerca]` |

⚠️ **Non ho trovato nessuna classificazione ufficiale piccola/media/grande per
tonnellaggio.** Cercata esplicitamente: le soglie normative italiane (VIA, AIA)
sono regionali e ragionano per **superficie e volume autorizzato complessivo**,
non per produzione annua. Questa scala è **mia**, tarata sulle tre derivazioni
qui sopra. Va presa come una convenzione del simulatore, non come un fatto.

### 1d. Dove stanno, e di che cosa sono fatte

| Parametro | Valore | Fonte | Marca |
|---|---|---|---|
| Regioni con più cave autorizzate | Lombardia, Veneto, Puglia (> 300 ciascuna) | Legambiente 2025 | `[fonte citata]` |
| Regioni con più imprese in produzione | Lombardia 245, Toscana 232, Sicilia 193 | ISTAT 2017 | `[fonte citata]` |
| Quota delle estrazioni al Nord | ~44% (68 Mt) | ISTAT / Legambiente | `[da risultati di ricerca]` |
| Lombardia: cave produttive | 273, pari al 14,4% dei prelievi nazionali | ISTAT / Legambiente | `[da risultati di ricerca]` |
| Cave attive che estraggono calcare/travertino/gesso/arenaria | 34% | ISTAT / Legambiente | `[fonte citata]` |
| Cave attive che estraggono sabbia e ghiaia | 32% | ISTAT / Legambiente | `[fonte citata]` |
| Distribuzione addetti | Lombardia 15,4%, Toscana 11%, Lazio 8,5%, Puglia 8,4% | ISTAT 2016 | `[fonte citata]` |

**Cosa varia e perché.** Le due famiglie non sono la stessa cava e un simulatore
che le confonde produce dinamiche impossibili. La **sabbia e ghiaia** si cava in
pianura alluvionale (Pianura Padana, conoidi, alvei), spesso **senza esplosivo**:
si scava con escavatore, si lava, si vaglia — quindi niente volate, niente
banchi, produzione continua e vincolata dalla falda. Il **calcare** si cava in
rilievo, per **banchi con abbattimento a esplosivo**, e la sua produzione è a
**scatti** (una volata riempie il piazzale per giorni o settimane). Il nord ha
più cave e più prelievo perché ha più domanda edilizia e più ghiaia disponibile;
il sud e le isole hanno più calcare e canoni più bassi — Basilicata e Sardegna
non ne chiedono affatto `[fonte citata]`, il che cambia la struttura dei costi
di una cava simulata a seconda di dove la si mette.

---

## 2. Il ritmo quotidiano: turni, ore, persone

| Parametro | Valore / intervallo | Unità | Fonte | Marca |
|---|---|---|---|---|
| Orario normale | 8 h/giorno, **40 h/settimana** | ore | CCNL settore miniere/cave (impianto storico, dal 1963-64: 40 h su **5 giorni**, riposo il sabato) | `[fonte citata]` |
| Maggiorazione turno notturno | +8% sulla paga base | % | CCNL storico miniere | `[fonte citata]` |
| Computo del tempo di lavoro | da ingresso a uscita dal pozzo/discenderia | — | CCNL storico miniere | `[fonte citata]` |
| CCNL applicabile oggi | *Aziende esercenti attività di escavazione e lavorazione dei materiali lapidei* | — | fonti giuslavoristiche | `[da risultati di ricerca]` |
| Turni all'impianto di frantumazione | 1 turno tipico; **2-3 turni** dove serve produzione continua | turni/giorno | letteratura di settore su impianti | `[da risultati di ricerca]` |
| Presenza di turni notturni | esiste realmente (annuncio di lavoro per addetto impianto frantumazione: richiesta disponibilità a **turni notturni** e ad alcuni **weekend programmati**) | — | offerta di lavoro provincia di Trento | `[da risultati di ricerca]` |
| Addetti all'impianto di frantumazione | **1** operatore per sorveglianza e conduzione; **2** in situazioni più complesse | persone | letteratura di settore su impianti | `[da risultati di ricerca]` |
| Giorni lavorativi | **~200** | giorni/anno | documento VIA di cava («circa 200 giorni lavorativi all'anno») | `[da risultati di ricerca]` |
| Ore/giorno nel trasporto inerti | 10-12 | ore | forum di settore autotrasporto | `[da risultati di ricerca]` — **bassa affidabilità** |

### Addetti per sito — due derivazioni indipendenti

| Via di calcolo | Aritmetica | Risultato | Marca |
|---|---|---|---|
| ISTAT 2016 | ~15.000 addetti ÷ 2.295 siti attivi | **6,5 addetti/sito** | `[dedotto]` |
| UEPG Europa | 187.000 addetti ÷ 26.000 siti | **7,2 addetti/sito** | `[dedotto]` |

**Due fonti che non si parlano danno 6,5 e 7,2.** Per una cava media, un
organico di **6-8 persone** è il valore che regge alla misura.

⚠️ Due avvertenze sulla cifra. (1) Gli «addetti» ISTAT sono contati **per
impresa**, quindi comprendono amministrazione e direzione che non stanno in
cava: gli operativi sul piazzale sono **meno** di 6-8. (2) La media è di nuovo
asimmetrica — con 1,5 cave per impresa `[da risultati di ricerca]`, l'impresa
tipica è piccolissima, e il gestore-proprietario che guida anche la pala è un
caso normale, non un'eccezione.

**Composizione plausibile di una cava media** (`[dedotto]`, nessuna fonte la
scrive): 1 responsabile/direttore dei lavori (figura richiesta per legge,
spesso non a tempo pieno né esclusivo), 1 capocantiere o preposto, 2-3
operatori di macchine (escavatore, pala, dumper), 1 addetto impianto, 1
manutentore/pesatore-amministrativo. Il fochino e il perforatore in una cava di
calcare sono quasi sempre **esterni**, chiamati per la volata — il che spiega
perché l'organico stabile resta basso anche dove si usa esplosivo.

**Cosa varia e perché.** Una cava di sabbia e ghiaia con lavaggio ha più
impianto e quindi più addetti fissi d'impianto; una cava di calcare ha più
mezzi in movimento e più ricorso a ditte esterne (perforazione, brillamento,
frantumazione mobile a noleggio). Il turno unico diurno è la norma; il secondo
turno compare quando l'impianto è il collo di bottiglia, non quando lo è la
cava.

---

## 3. Il trasporto

| Parametro | Valore / intervallo | Unità | Fonte | Marca |
|---|---|---|---|---|
| Massa complessiva autocarro 4 assi | 32 (legale) — fino a **40** come mezzo d'opera | t | Codice della Strada art. 54 / guide autotrasporto | `[fonte citata]` |
| Tara autocarro 4 assi | ~13 | t | guide autotrasporto | `[da risultati di ricerca]` |
| **Portata utile autocarro 4 assi** | **~19** | t | guide autotrasporto (32 − 13) | `[da risultati di ricerca]` |
| Volume caricabile, materiale secco | ~19 | m³ | guide autotrasporto | `[da risultati di ricerca]` |
| Complessi veicolari mezzi d'opera | fino a **56** t di massa complessiva (autorizzazione) | t | Città Metropolitana di Bologna, trasporti eccezionali | `[fonte citata]` |
| Camion/giorno, cava grande (1,2 Mt/anno) | **100-150** in ingresso/uscita, **+10-20** per attività connesse | camion/giorno | Italcave (Taranto), pagina descrittiva | `[da risultati di ricerca]` |
| Mezzi/giorno, cava piccola-media | «**una ventina** di mezzi al giorno per circa 200 giorni lavorativi» | mezzi/giorno | documento VIA di cava | `[da risultati di ricerca]` |
| Capacità benna pala gommata | 1-3 (macchine piccole/medie); 5+ (grandi) | m³ | letteratura macchine | `[da risultati di ricerca]` |
| Ciclo di caricamento di un autocarro | ~10 passate con benna 1,5 m³, **2,5-3 min** per camion | min | forum di settore | `[da risultati di ricerca]` — **bassa affidabilità** |
| Produttività pala in caricamento | ~20 camion/ora ≈ ~300 m³/ora (valore di punta, non medio) | — | forum di settore | `[da risultati di ricerca]` — **bassa affidabilità** |

### La verifica che lega produzione e viaggi

Il numero di viaggi **non è un parametro libero**: discende dalla produzione.

Cava media, 70.000 t/anno, 200 giorni lavorativi:
`70.000 ÷ 200 = 350 t/giorno ÷ 19 t = ` **≈ 18 viaggi/giorno** `[dedotto]`

E il documento VIA trovato indipendentemente dice «**una ventina** di mezzi al
giorno». **I due numeri combaciano** — è la conferma più solida di questa
sezione, perché arriva da due strade che non si toccano.

⚠️ **Sulla cava grande il conto NON torna, e lo scrivo invece di aggiustarlo.**
`1.200.000 ÷ 200 = 6.000 t/giorno ÷ 150 camion = 40 t per camion`, che è sopra
la portata utile di un 4 assi. Le spiegazioni possibili sono tre e non so quale
sia vera: (a) si usano **autotreni** da 56 t di massa complessiva, con ~35-38 t
utili; (b) i «100-150 camion» sono **veicoli distinti**, non **viaggi** — e ogni
veicolo ne fa più d'uno; (c) i giorni lavorativi sono più di 200. La differenza
fra «camion» e «viaggi» è esattamente il tipo di ambiguità che un simulatore
deve risolvere **in modo dichiarato**, perché le due letture danno numeri che
differiscono di un fattore 2-3.

**Cosa varia e perché.** Il trasporto è dove nord e sud divergono di più. Una
cava di pianura vicino a un impianto di calcestruzzo scarica con viaggi brevi e
molti giri per veicolo; una cava di calcare in rilievo che serve un mercato
lontano ha viaggi lunghi, meno giri, e spesso **dumper articolati interni** che
portano dal fronte all'impianto (mezzi che non escono mai in strada e non hanno
limiti di massa stradali) più autocarri stradali per l'uscita. Un simulatore
che modella un solo tipo di mezzo perde la distinzione **movimentazione interna
/ vendita in uscita**, che è la stessa distinzione fra tonnellate **estratte** e
tonnellate **vendute**.

---

## 4. Le volate (solo cave di calcare / roccia dura)

| Parametro | Valore / intervallo | Unità | Fonte | Marca |
|---|---|---|---|---|
| Diametro fori | **89** o **115** | mm | cava di calcare italiana (Italcave) | `[da risultati di ricerca]` |
| Numero fori per volata | **12-24** | fori | idem | `[da risultati di ricerca]` |
| Interasse fori (spacing) | **2 – 3,5** | m | idem | `[da risultati di ricerca]` |
| Profondità fori | **8** oppure **16** | m | idem | `[da risultati di ricerca]` |
| Volume abbattuto per volata | **~2.700** | m³ | idem | `[da risultati di ricerca]` |
| Frequenza volate (cava da 1,2 Mt/anno) | **~1 al giorno** | volate | idem | `[da risultati di ricerca]` |
| Maglia (burden × spacing) | **3 × 3** | m | cava Monte Budellone (calcare) | `[da risultati di ricerca]` |
| Altezza massima del banco | **12** | m | cava Monte Budellone | `[da risultati di ricerca]` |
| **Consumo specifico di esplosivo** | **~250 g/m³** (= 0,25 kg/m³) | g/m³ | cava Monte Budellone | `[da risultati di ricerca]` |
| Altezza banco (altra fonte italiana) | 5 – 8 | m | letteratura di settore | `[da risultati di ricerca]` |
| Altezza banco (pratica internazionale) | 15, con burden 4 m, spacing 4 m, borraggio 4 m, **2-3 file** | m | HSA Irlanda, *Determining Minimum Burdens for Quarry Blasting* | `[da risultati di ricerca]` |
| Parametri generali calcare (letteratura) | profondità 3,5-10,5 m; burden 3-3,5 m; spacing 3,5-6 m; borraggio 1,5-4,0 m | m | letteratura internazionale su cave di calcare | `[da risultati di ricerca]` |
| Metodo di dimensionamento usato in Italia | metodo **G. Berta** (carica specifica da parametri della roccia, dell'esplosivo, della loro interazione e dalla frammentazione voluta) | — | tesi e manualistica italiana | `[fonte citata]` |
| Definizione di consumo specifico | kg esplosivo ÷ m³ di roccia abbattuta | kg/m³ | manualistica | `[fonte citata]` |

### Tre verifiche di coerenza interna, tutte e tre tornano

**(1) I fori spiegano il volume.**
`18 fori (media di 12-24) × maglia 3 × 3 m × 16 m di profondità = 2.592 m³`
La fonte dichiara **~2.700 m³**. `[dedotto]` — combacia. Cioè la volata da 2.700
m³ è quella con i **fori da 16 m**, non da 8: il banco di quella cava è alto
~15-16 m, coerente con la pratica internazionale (15 m) e **non** con i «5-8 m»
dell'altra fonte italiana. Le due fonti descrivono due cave diverse, non si
smentiscono.

**(2) L'esplosivo per volata.**
`2.700 m³ × 0,25 kg/m³ ≈ ` **675 kg di esplosivo per volata** `[dedotto]`
(il consumo specifico viene da una cava diversa da quella dei 2.700 m³ — è un
accostamento **mio**, non una misura).

**(3) La frequenza è una conseguenza, non un parametro.**
`2.700 m³ × 2,6 t/m³ ≈ 7.000 t per volata` `[dedotto]`
`1.200.000 t/anno ÷ 7.000 t = ` **171 volate/anno** ≈ una per ogni giorno
lavorativo — che è **esattamente quello che quella cava dichiara**. La coerenza
regge.

⛔ **E qui sta il risultato che vale più di ogni singolo numero di questa
sezione.** Applicando lo stesso conto a una cava **media**:
`66.000 t/anno ÷ 7.000 t per volata ≈ ` **9-10 volate all'anno**, cioè
**circa una al mese** `[dedotto]`.

Quindi la risposta alla domanda «ogni quanto si spara, una a settimana o al
mese?» è: **non è un parametro indipendente**. La frequenza è
`produzione annua ÷ (volume della volata × densità)`, e cambia di un fattore
**venti** fra una cava media (mensile) e una grande (giornaliera). Un simulatore
che fissa «una volata a settimana» come costante produrrà, per costruzione, una
produzione annua incoerente con la dimensione della cava che dichiara di
simulare. Il parametro libero giusto è la **dimensione della volata** (fori ×
maglia × altezza banco), che dipende dalla geometria del fronte; la frequenza si
**deriva**.

⚠️ **Attenzione a un vincolo che il conto puro non vede**: sotto una certa
frequenza la volata non si fa lo stesso, perché chiamare fochino, perforatrice e
personale esterno ha un costo fisso. Una cava piccola tende a fare **volate più
grandi e più rade** (accumulando fronte) piuttosto che volate piccole e
frequenti. Questo è `[dedotto]` da logica economica: **non ho trovato nessuna
fonte che lo misuri**.

### Densità e fattori di conversione (necessari per passare da m³ a t)

| Parametro | Valore | Unità | Fonte | Marca |
|---|---|---|---|---|
| Peso di volume del calcare in banco | **2.400 – 3.200** | kg/m³ | tabelle pesi specifici materiali (studi tecnici) | `[da risultati di ricerca]` |
| Calcare compatto, valore d'uso | ~2.600 – 2.700 | kg/m³ | idem | `[dedotto]` dall'intervallo sopra |
| Materiale sciolto dopo abbattimento | ~1.400 – 1.600 | kg/m³ | tabelle terreni e rocce | `[da risultati di ricerca]` |
| Coefficiente di rigonfiamento (swell) | `2.600 ÷ 1.600 = 1,63` … `2.600 ÷ 1.400 = 1,86` | — | rapporto fra le due righe sopra | `[dedotto]` |

⚠️ **Quel rigonfiamento è più alto di quello che la manualistica di solito cita
per il calcare abbattuto (~1,5-1,6), e non so risolvere la discrepanza.**
Probabilmente le tabelle del «materiale sciolto» che ho trovato non descrivono
roccia appena brillata ma materiale già frantumato e con fini, che si assesta di
più. Riporto il conto che esce dai numeri che ho, **senza aggiustarlo** per
farlo somigliare al valore atteso: chi userà questo parametro sappia che sta fra
**1,5 e 1,9** e che l'incertezza è del 25%.

⚠️ Il rigonfiamento è il parametro che un simulatore dimentica quasi sempre e
che rompe subito la coerenza: **il volume che esce dal fronte non è il volume
che entra nel cassone**. 2.700 m³ in banco diventano **4.100-5.000 m³** sciolti
a seconda del coefficiente. Se il simulatore conta i viaggi sui metri cubi in
banco, sbaglia dal 50% all'85%. Contare in **tonnellate** evita del tutto il
problema — ed è anche il modo in cui la cava vende e pesa.

**Cosa varia e perché.** Il consumo specifico dipende dalla roccia (un calcare
massivo e tenace chiede più esplosivo di uno stratificato e fratturato, che è
già mezzo abbattuto dalla natura) e dalla **frammentazione voluta**: chi vende
pietrame grosso spara meno di chi alimenta un frantoio che vuole pezzatura
fine. L'altezza del banco è vincolata dall'autorizzazione e dalla sicurezza,
non dalla convenienza: 5-8 m in cave con vincoli stretti o fronti bassi, 12-16 m
dove è consentito. Vicino a case, la volata si fa **più piccola e più frequente**
per tenere basse le vibrazioni — cioè l'esatto contrario dell'ottimo economico.

---

## 5. Le fonti statistiche italiane: che cosa esiste

| Fonte | Che cosa contiene | Periodicità | Accessibilità | Marca |
|---|---|---|---|---|
| **ISTAT — *Le attività estrattive da cave e miniere*** | Il censimento più completo: siti per stato di attività (attivi, attivi produttivi, inattivi), minerali per tipo, **quantità estratte in peso E in volume**, dati da atti di autorizzazione e concessione. Diffuso a livello nazionale, di ripartizione e **regionale** | Annuale, poi interrotta/rarefatta (ultime edizioni note: 2013-2015, 2015-2016, **2017**) | PDF pubblici su istat.it; ripubblicati da MASE-UNMIG e Certifico | `[fonte citata]` |
| **Legambiente — *Rapporto Cave*** | Cave autorizzate, dismesse, volumi estratti per materiale, **canoni di concessione per Regione**, quadro normativo regionale. Incrocia i dati forniti da Regioni e Province Autonome con quelli ISTAT | Circa quadriennale (2008, 2011, 2014, 2017, 2021, **2025**) | PDF pubblico (`legambiente.it/wp-content/uploads/2025/10/CAVE-report-finale-3.pdf`) | `[fonte citata]` |
| **ISPRA — Annuario dei Dati Ambientali** | Indicatore *«Siti di estrazione di minerali di seconda categoria (cave)»* — le cave sono per legge minerali di **seconda categoria** | Annuale | `indicatoriambientali.isprambiente.it` | `[fonte citata]` |
| **MASE — UNMIG** | Ripubblica e ospita i report ISTAT sulle attività estrattive; competenza sulle miniere (prima categoria) | — | `unmig.mase.gov.it` | `[fonte citata]` |
| **ANEPLA** | Associazione degli estrattori e produttori di ghiaia, sabbia e pietrisco (fondata a Parma nel 1962, sede a Milano, in Confindustria dal 1972). Rappresenta l'Italia in **Aggregates Europe – UEPG** | — | `anepla.it` — **non ho trovato dati di produzione pubblicati** | `[fonte citata]` per l'esistenza, **non** per i dati |
| **UEPG / Aggregates Europe — Annual Review** | Produzione, numero di siti, numero di imprese e addetti **per paese**, con l'Italia fra le schede nazionali | Annuale | PDF pubblici su `aggregates-europe.eu` | `[fonte citata]` |
| **Federbeton (e ATECAP)** | *Rapporto di Filiera* e *Rapporto di Sostenibilità* del cemento e calcestruzzo: produzione di preconfezionato, consumo di **aggregati naturali e riciclati**. ANEPLA è socio di Federbeton | Annuale | `blog.federbeton.it`, `atecap.it` | `[fonte citata]` |
| **Piani Cave regionali / provinciali** | Il dato più fine che esista: singola cava, volumetria autorizzata, durata, ambiti estrattivi. **Ogni Regione ha il suo** | Variabile | Portali regionali VIA/SIRA | `[fonte citata]` |
| **Documenti VIA / SIA delle singole cave** | Progetti di coltivazione con produzione media annua prevista, sistemi e fasi di coltivazione, **macchinari, manodopera**, impianti, studi di traffico | Per procedimento | Portali regionali (Sardegna SIRA, Liguria docvia, Calabria, VdA…) | `[fonte citata]` |

### Numeri di contesto trovati sulla filiera a valle

| Parametro | Valore | Anno | Fonte | Marca |
|---|---|---|---|---|
| Calcestruzzo preconfezionato prodotto in Italia | 28,42 milioni m³ (+5,1%) | 2019 | Federbeton | `[da risultati di ricerca]` |
| Calcestruzzo preconfezionato prodotto in Italia | 33,1 milioni m³ | 2022 | Federbeton | `[da risultati di ricerca]` |
| Aggregati naturali usati (perimetro associativo) | 16,5 milioni t (+17,6% vs 2020) | 2021 | Federbeton | `[da risultati di ricerca]` |
| Impianti di preconfezionato | ~400 (aziende associate); il preconfezionato è ~80% della produzione totale | ~2018 | ATECAP | `[da risultati di ricerca]` |

⚠️ Le 16,5 Mt di aggregati Federbeton **non** sono il consumo nazionale: sono il
perimetro delle aziende associate. Accostarle alle ~150 Mt ISTAT sarebbe un
confronto fra due denominatori diversi.

**Cosa varia e perché.** Le fonti si contraddicono per costruzione, e il
simulatore deve scegliere **una** convenzione: ISTAT conta in **peso e volume**
e censisce **siti**, Legambiente conta in **volume** e censisce **autorizzazioni**
(che non sono tutte produttive: nel 2017 ISTAT registrava 5.154 siti censiti ma
solo 2.196 in produzione, cioè **meno della metà**). Chi confronta «3.378 cave
autorizzate» con «2.295 siti attivi» sta confrontando due cose diverse e
concluderà, sbagliando, che c'è stato un crollo o un boom.

---

## 6. La stagionalità — la parte più debole di questa ricerca

| Parametro | Valore | Fonte | Marca |
|---|---|---|---|
| La stagionalità nelle costruzioni è ufficialmente riconosciuta | ISTAT pubblica **indice grezzo**, **corretto per gli effetti di calendario** e **destagionalizzato**, depurando le fluttuazioni dovute a «fattori meteorologici, consuetudinari, legislativi» | ISTAT, *Indice della produzione nelle costruzioni* | `[fonte citata]` |
| Ampiezza dello scarto grezzo/corretto | a marzo 2026: indice **grezzo +4,4%** su base annua contro indice **corretto per calendario −0,2%** | ISTAT via stampa economica | `[da risultati di ricerca]` |
| Occupazione nelle costruzioni, minimo stagionale | **febbraio: −10%** rispetto alla media annua | Federal Reserve Bank of Chicago | `[da risultati di ricerca]` — **dato USA, NON trasferibile** |
| Occupazione nelle costruzioni, massimo stagionale | **agosto: +7%** rispetto alla media annua | Federal Reserve Bank of Chicago | `[da risultati di ricerca]` — **dato USA, NON trasferibile** |

⛔ **Il dato americano NON va usato per l'Italia, e la ragione è dirimente: in
Italia agosto è il mese di fermo.** Negli Stati Uniti agosto è il picco
dell'attività edilizia; in Italia le imprese edili chiudono per ferie e il
calcestruzzo si ferma. Copiare quella curva metterebbe il **massimo** proprio
dove l'Italia ha un **minimo profondo**. È l'errore più grave che questa ricerca
poteva produrre, e lo scrivo per impedirlo.

⚠️ **Non ho trovato coefficienti stagionali mensili italiani.** Cercati
esplicitamente su ISTAT (indice grezzo mensile della produzione nelle
costruzioni), su Federbeton/ATECAP (produzione mensile di preconfezionato) e in
letteratura sugli aggregati: nessun risultato con i valori per mese. So che
**esistono** — l'indice grezzo mensile ISTAT è pubblicato in serie storica su
`dati.istat.it` (dataset `DCSC_INDXPRODCOSTR_1`) — ma non ho potuto aprirlo
(`WebFetch` bloccato) e i risultati di ricerca riportano solo variazioni
puntuali, non il profilo annuale.

**Forma qualitativa, `[dedotto]` e da verificare prima dell'uso.** L'anno
italiano dell'edilizia ha **due** minimi, non uno: **gennaio-febbraio** (freddo,
gelo, giornate corte, cantieri fermi) e **agosto** (ferie). I massimi stanno in
**maggio-luglio** e in **settembre-ottobre**. È una curva a **doppia gobba**,
strutturalmente diversa da quella a gobba singola dei paesi dove agosto è alta
stagione. Un simulatore che usi una sinusoide semplice sbaglierà proprio i due
mesi che un utente di cava riconosce a colpo d'occhio.

⚠️ E la stagionalità **della cava** non è quella **dell'edilizia**: una cava con
piazzale grande può **estrarre** d'inverno e **vendere** in primavera,
smorzando la curva della produzione rispetto a quella delle vendite. Le due
serie vanno tenute distinte nel simulatore. Anche questo è `[dedotto]`.

---

## 7. Quello che NON sono riuscito a trovare

Elencato per nome, perché un buco dichiarato vale più di un numero inventato.

1. **I coefficienti di stagionalità mensile italiani**, per le costruzioni o per
   gli aggregati. So che la serie ISTAT esiste (`DCSC_INDXPRODCOSTR_1`) e non ho
   potuto leggerla. **È il buco più grande di questa ricerca**, perché la
   domanda era esplicita.
2. **Qualunque testo primario.** `WebFetch` è bloccato: non ho aperto né il
   Rapporto Cave 2025, né i PDF ISTAT, né le tesi del Politecnico di Torino, né
   gli Annual Review UEPG. **Tutto quanto sopra viene da estratti di ricerca.**
3. **Dati di produzione pubblicati da ANEPLA.** L'associazione esiste ed è
   documentata, ma non ho trovato sue statistiche di produzione accessibili.
   Il numero «~1.900 imprese, ~2.500 cave» arriva da una rivista di settore che
   cita ANEPLA, non da ANEPLA.
4. **Una classificazione ufficiale piccola/media/grande cava per tonnellaggio.**
   Cercata; le soglie normative italiane ragionano per superficie e volume
   autorizzato, e sono **regionali**. La scala al §1c è mia.
5. **Il numero di volate all'anno di una cava media italiana, dichiarato da una
   fonte.** L'ho ricavato dividendo; nessuno lo scrive.
6. **Il rapporto fra tonnellate estratte e tonnellate vendute** (scarti,
   sterili, cappellaccio, materiale invenduto a piazzale). Per una cava di
   calcare da frantumazione lo scarto non è zero, e non ho trovato una
   percentuale citabile. È un parametro che un simulatore serio deve avere.
7. **Il prezzo di vendita degli inerti alla cava** (€/t per pezzatura). Non
   cercato in questa tornata — nessun numero qui sopra lo tocca.
8. **Il consumo di gasolio** di una cava per tonnellata prodotta.
9. **Un profilo orario della giornata** (quando arrivano i camion, quando si
   spara, quando si ferma l'impianto). Nessun risultato utile.
10. **La quota di cave che lavorano su due turni** invece che su uno. Ho la
    prova che il turno notturno esiste (un annuncio di lavoro), non quanto sia
    diffuso.
11. **Dati regionali di produzione media per cava.** ISTAT li diffonde a livello
    regionale, ma non ho potuto aprire le tavole: tutte le medie qui sopra sono
    **nazionali**, e con Lombardia al 14,4% dei prelievi la variabilità
    regionale è certamente forte.
12. **Il numero medio di viaggi per veicolo al giorno**, che è la chiave per
    sciogliere l'ambiguità «camion» contro «viaggi» del §3.

---

## Riepilogo: i parametri che reggono meglio

Ordinati per solidità, cioè per **quante strade indipendenti portano allo stesso
numero** — non per quanto sono comodi.

| Parametro | Valore | Solidità |
|---|---|---|
| Produzione cava media | 60.000 – 75.000 t/anno | **Alta** — tre derivazioni indipendenti (ISTAT, UEPG, Legambiente) entro il ±11% |
| Addetti per sito | 6 – 8 | **Alta** — due derivazioni indipendenti (6,5 e 7,2) |
| Viaggi/giorno cava media | ~18-20 | **Alta** — il calcolo e un documento VIA indipendente combaciano |
| Volume per volata (calcare) | ~2.700 m³ ≈ 7.000 t | **Media** — una fonte, ma coerente con i suoi stessi fori e con la sua produzione annua |
| Giorni lavorativi | ~200/anno | **Media** — una fonte, plausibile |
| Orario | 8 h/g, 40 h/sett., 5 giorni | **Media** — CCNL, ma impianto storico da riverificare sul contratto vigente |
| Portata autocarro 4 assi | ~19 t utili | **Media** — coerente con il Codice della Strada |
| Consumo specifico esplosivo | ~0,25 kg/m³ | **Bassa** — una sola cava |
| Densità calcare | 2,6 – 2,7 t/m³ in banco | **Media** — intervallo largo in fonte (2,4-3,2) |
| Rigonfiamento (swell) | 1,5 – 1,9 | **Bassa** — il conto dalle mie fonti (1,63-1,86) non concorda con la manualistica (1,5-1,6) |
| Frequenza volate | **derivata, non assunta** | — |
| Stagionalità mensile | **non trovata** | — |

---

## Fonti

- [Legambiente, *Rapporto Cave 2025* (PDF)](https://www.legambiente.it/wp-content/uploads/2025/10/CAVE-report-finale-3.pdf)
- [Legambiente — presentazione Rapporto Cave 2025 a Ecomondo](https://www.legambiente.it/news-storie/legambiente-presenta-il-rapporto-cave-2025-a-ecomondo/)
- [Ingenio — *Rapporto Cave 2025: diminuiscono le cave autorizzate ma cresce l'estrazione*](https://www.ingenio-web.it/articoli/cave-e-inerti-da-costruzione-il-rapporto-cave-2025-di-legambiente-chiede-regole-e-piu-riciclo/)
- [La Nuova Ecologia — *Cave in Italia, ingenti i prelievi*](https://www.lanuovaecologia.it/report-cave-italia-2025-legambiente-estrazione-edilizia/)
- [La Nuova Ecologia — *Cave, in Italia 29 milioni di metri cubi di sabbia e ghiaia estratti all'anno* (Rapporto 2021)](https://www.lanuovaecologia.it/cave-italia-rapporto-legambiente-2021/)
- [ISTAT — *Attività estrattive da cave e miniere* (PDF)](https://www.istat.it/wp-content/uploads/2020/07/Attivit%C3%A0-estrattive-da-cave-e-miniere.pdf)
- [ISTAT — *Le attività estrattive da cave e miniere*, anno 2017 (PDF)](https://www.istat.it/it/files/2019/10/Report-cave-e-miniere_anno-2017.pdf)
- [ISTAT — *Le attività estrattive da cave e miniere*, anni 2015-2016 (PDF, via MASE-UNMIG)](https://unmig.mase.gov.it/wp-content/uploads/2018/12/Istat-report-attivit-estrattive-2015-2016.pdf)
- [ISTAT — *Statistics on mining and quarrying extraction activities, year 2017*](https://www.istat.it/en/press-release/statistics-on-mining-and-quarrying-extraction-activities-year-2017/)
- [ISTAT — Indice della produzione nelle costruzioni (dataset `DCSC_INDXPRODCOSTR_1`)](http://dati.istat.it/Index.aspx?DataSetCode=DCSC_INDXPRODCOSTR_1)
- [ISTAT — Indice dei prezzi alla produzione delle costruzioni (scheda qualità)](https://www.istat.it/scheda-qualita/indice-dei-prezzi-alla-produzione-delle-costruzioni/)
- [ISPRA — Siti di estrazione di minerali di seconda categoria (cave)](https://indicatoriambientali.isprambiente.it/it/georisorse/siti-di-estrazione-di-minerali-di-seconda-categoria-cave)
- [MASE-UNMIG — Le attività estrattive da cave e miniere](https://unmig.mase.gov.it/le-attivita-estrattive-da-cave-e-miniere/)
- [ANEPLA — sito ufficiale](https://anepla.it/)
- [Federbeton — Anepla fra i soci aggregati](https://www.federbeton.it/Soci/Aggregati/Anepla)
- [Aggregates Business — *Italy battling fragmentation of aggregate industry*](https://www.aggbusiness.com/italy-battling-fragmentation-aggregate-industry)
- [Aggregates Business — *Italy aims to build back better*](https://www.aggbusiness.com/feature/italy-aims-build-back-better)
- [UEPG / Aggregates Europe — Annual Review 2020-2021 (PDF)](https://www.aggregates-europe.eu/wp-content/uploads/2023/03/Final_-_UEPG-AR2020_2021-V05_spreads72dpiLowQReduced.pdf)
- [UEPG / Aggregates Europe — Annual Review 2019-2020 (PDF)](https://www.aggregates-europe.eu/wp-content/uploads/2023/03/UEPG-AR20192020_V13_03082020_spreads.pdf)
- [Federbeton — Rapporto di Filiera 2024](https://blog.federbeton.it/rapporto-di-filiera-federbeton-2024/)
- [ATECAP — Rapporto 2018 (PDF)](https://www.atecap.it/wp-content/uploads/2024/01/2018_atecap_rapporto.pdf)
- [Italcave — pagina "Cava" (Taranto, calcare)](https://italcave.it/index.php/cava)
- [OnSite News — *Trasporto di calcare nella cava Monte Budellone*](https://www.onsitenews.it/it/notizia/trasporto-di-calcare-nella-cava-monte-budellone-it-1)
- [Politecnico di Torino — *Tecniche di abbattimento controllato in una cava a cielo aperto* (tesi, PDF — non apribile da qui)](https://webthesis.biblio.polito.it/8917/1/tesi.pdf)
- [Geologi.it — *Volate 1.0 — Esplosivo in cava*](https://geologi.it/download/volate-1-0-esplosivo-in-cava/)
- [Testo Unico Sicurezza — Procedura di sicurezza: uso degli esplosivi in cava](https://www.testo-unico-sicurezza.com/procedura-di-sicurezza-uso-degli-esplosivi-in-cava.html)
- [Health and Safety Authority (Irlanda) — *Determining Minimum Burdens for Quarry Blasting* (PDF)](https://www.hsa.ie/eng/Your_Industry/Quarrying/Events_Organisations_Publications/All_Island_Quarry_Safety_Conference/Minimum-Burdens.pdf)
- [Scientific Reports — *Optimizing blast design and bench geometry ... open pit limestone mines*](https://www.nature.com/articles/s41598-025-90242-6)
- [Regione Calabria — Sintesi del progetto di coltivazione di cava (PDF)](https://www.regione.calabria.it/wp-content/uploads/2022/12/1671460908779_Elaborato_05_Sintesi_del_Progetto_di_Coltivazione.pdf)
- [Regione Liguria — Cava di calcare "Castellaro", progetto di coltivazione (PDF)](https://docvia.regione.liguria.it/screening/S888/Documentazione/PROGETTO%20DI%20COLTIVAZIONE%20%E2%80%93%20Relazione%20tecnica.pdf)
- [Verifica di assoggettabilità alla VIA — cava (PDF)](https://www.q-cumber.org/site_media/Qcontents/Qusers/Qcumber/gallery/Qpost_media/1375441056.19_3%20Verifica%20via..pdf)
- [Città Metropolitana di Venezia — Studio di impatto viabilistico (PDF)](https://politicheambientali.cittametropolitana.ve.it/sites/default/files/all_1_studio_impatto_viabile.pdf)
- [Provincia di Vicenza — Linee guida per gli studi di traffico](https://www.provincia.vicenza.it/ente/la-struttura-della-provincia/servizi/valutazione-impatto-ambientale/commissione-valutazione-impatto-ambientale/linee-guida-studi-sul-traffico)
- [Olympus (Univ. Urbino) — CCNL Chimici-Miniere, 10 marzo 1963](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=7002:chimici-miniere-ccnl-10-marzo-1963&catid=112&Itemid=139)
- [Studio Cerbone — CCNL aziende esercenti attività di escavazione e lavorazione dei materiali lapidei](https://www.studiocerbone.com/ccnl-aziende-esercenti-le-attivita-escavazione-lavorazione-dei-materiali-lapidei/)
- [CGIL Como — Orario di lavoro CCNL Industria (PDF)](https://www.cgil.como.it/wp-content/uploads/2023/05/orario-CCNL.pdf)
- [Provincia di Trento — Offerta di lavoro: addetto impianto frantumazione e lavorazione inerti](https://www.sil.provincia.tn.it/welcomepage/vacancy/view/59689)
- [TWIN — *Impianti di frantumazione: come funzionano e quanto possono costare*](https://www.twinsrl.it/news/3/impianti-di-frantumazione-come-funzionano-e-quanto-possono-costare/)
- [TruckStyle — *Camion 4 assi: caratteristiche, normativa e portata*](https://www.truckstyle.it/camion-4-assi/)
- [Città Metropolitana di Bologna — Complessi veicolari mezzi d'opera fino a 56 t](https://www.cittametropolitana.bo.it/trasporti/Trasporti_Eccezionali/Trasporti_Eccezionali_autorizzazioni/COMPLESSI_VEICOLARI_MEZZI_DOPERA_FINO_A_56_TONN)
- [Studio Petrillo — Tabella pesi specifici inerti (PDF)](https://www.studiopetrillo.com/files/Tabella%20peso%20specifico%20inerti.pdf)
- [Testo Unico Sicurezza — Tabella valori terreni e rocce](https://www.testo-unico-sicurezza.com/tabella-valori-terreni-e-rocce.html)
- [GeoStru — Database caratteristiche fisiche terreni](https://www.geostru.com/Help_Online_2015/MDC/IT/database_caratteristiche_fisic.htm)
- [Federal Reserve Bank of Chicago — *Seasonal and Business Cycles of U.S. Employment*](https://www.chicagofed.org/publications/economic-perspectives/2018/3)
- [Cribis — *Cave e miniere: i dati sull'industria estrattiva in Italia*](https://www.cribis.com/it/approfondimenti/cave-miniere-dati-industria-estrattiva-italia/)
- [Openpolis — *Le attività estrattive di materiali non energetici*](https://www.openpolis.it/le-attivita-estrattive-di-materiali-non-energetici/)
- [Legambiente / AITEC — *Linee guida progettazione, gestione e recupero delle aree estrattive* (PDF)](https://www.heidelbergmaterials.it/sites/default/files/assets/document/linee_guida_progettazione_gestione_recupero_delle_aree_estrattive.pdf)
