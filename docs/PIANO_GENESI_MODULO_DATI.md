# Un modulo dati per Genesi — misura e piano

*Misurato il 01/08/2026. Nasce dal censimento del principio dell'assenza, che
ha coperto sei app e si è fermato alla settima per una ragione strutturale.*

## Il fatto

Le sei app verticali tengono la loro logica in `apps/<nome>/<nome>-data.js`.
`node` lo importa, e da lì vengono le **1.108 prove** di `run-kpi.mjs` e il
«456 funzioni su 456» della copertura.

**Genesi no.** Le sue **191 funzioni** stanno dentro `apps/genesi/genesi.html`.
Di Genesi entra nelle suite solo `pointcloud.js` — **5 funzioni**.

È l'app che calcola **quanto esplosivo mettere in un foro** e **quanto
vibrerà** a una certa distanza. È quella dove un numero sbagliato costa di più,
ed è l'unica che `node` non può interrogare.

## ⚠️ Come sono arrivato al numero, e perché il primo era sbagliato

Vale la pena scriverlo, perché è la stessa disciplina di tutto il resto: la
misura è stata **stretta tre volte**, e ogni giro ha tolto candidati.

| giro | criterio | «estraibili» |
|---|---|---|
| 1 | il corpo non nomina DOM / 3D / rete | **113** |
| 2 | …e non **chiama** nessuna funzione che lo faccia (chiusura transitiva) | **81** |
| 3 | …e **prende almeno un argomento** | **54** |

Il terzo giro è quello che conta, ed è nato da un controllo sul mio stesso
lavoro: il giro 2 dava `pfNominale` e `rockFactorA` per **pure**, ma tutt'e due
si dichiarano `function pfNominale()` — **senza argomenti**. Una funzione senza
argomenti prende i suoi dati da fuori: non si può chiamare da una prova con dei
valori dati, qualunque cosa faccia dentro. La purezza non basta: serve una
**porta d'ingresso**.

**79 funzioni su 191 (il 41%) non prendono nessun argomento.**

## ⛔ Le funzioni che decidono i numeri di sicurezza

| funzione | firma | provabile oggi? |
|---|---|---|
| `ppvSite()` | nessun argomento | ❌ legge dalla pagina |
| `computeKPI()` | nessun argomento | ❌ |
| `flyrockEst()` | nessun argomento | ❌ |
| `pfNominale()` | nessun argomento | ❌ |
| `rockFactorA()` | nessun argomento | ❌ |
| `computeMIC()` | nessun argomento | ❌ |
| `sitoFit(punti)` | **prende i punti** | ✅ |
| `ppvLimit(norma, f)` | **prende norma e frequenza** | ✅ |

Sei su otto leggono i loro ingressi dalla pagina. `ppvSite()`, che sceglie
**K e β** — i due coefficienti da cui esce tutta la previsione di vibrazione —
chiama `sitoLegge()` e `selRoccia()` e non accetta niente dall'esterno.

## Il piano, in tre passi separati

### Passo 1 — i 54 che si spostano senza toccare niente *(basso rischio)*

**637 righe.** Prendono già argomenti, e nulla di ciò che chiamano legge la
pagina. Si spostano in `apps/genesi/genesi-data.js`, la pagina li importa, e da
subito `copertura-funzioni.mjs` e `run-kpi.mjs` li vedono.

I più sostanziosi: `_riconParseCampo(testo)` 43 righe (legge il file che torna
da Campo), `_fragCurveSVG(fr, sw, meas)` 39, `_riconRiassuntoCampo(p, nomeFile)`
39, `gseg(v, dec)` 31, **`sitoFit(punti)` 28** — la regressione della legge di
sito, cioè il pezzo di scienza più importante che oggi non ha nessuna prova
`node` — `boomAt(when, dist)` 24, `_tempoInPunto(px,py,H,h2)` 22,
`_sitoParseCsv(testo)` e `_sitoMappaColonne(intest)` (la lettura dei referti del
sismografo).

⚠️ **`ppvLimit(norma, f)` è nell'elenco ma va trattato a parte**: è la tabella
delle soglie DIN 4150-3 / USBM RI8507, e le soglie di sicurezza sono ferme
finché il fondatore non conferma. Spostarla non è cambiarla — ma allora lo
spostamento va fatto con una prova che pretenda **ogni valore identico** prima e
dopo, non «funziona».

### Passo 2 — dare una porta ai sei critici *(rischio medio, e va concordato)*

`ppvSite()` diventa `ppvSite(sito, roccia)`, e la pagina gli passa quello che
oggi va a cercare da sé. Stessa cosa per `computeKPI`, `flyrockEst`,
`pfNominale`, `rockFactorA`, `computeMIC`.

È il passo che rende **provabile la previsione di vibrazione**, ed è anche il
più delicato: cambia la firma di funzioni chiamate da più punti della pagina.
Va fatto una funzione per volta, con la prova prima e lo scatto dopo.

### Passo 3 — le restanti

Quello che resta tocca la scena 3D e il DOM, e **deve restare nella pagina**:
è la stessa divisione che le altre sei app hanno già (11–28 funzioni di solo
disegno nella pagina, tutto il resto nel modulo).

## Che cosa NON dice questa misura

- «Estraibile» non vuol dire «giusto»: dice che si può chiamare da `node` con
  dei valori. Le prove restano da scrivere.
- Il conteggio guarda le dichiarazioni **a colonna zero** (191). Il censimento
  della copertura ne conta **192** perché accetta anche una riga indentata: la
  differenza è **una** funzione, e non cambia nessuna conclusione. Sta scritto
  qui perché due numeri diversi per la stessa cosa, trovati in due documenti,
  fanno perdere mezz'ora a chi li rilegge.
- Il classificatore è **conservativo per costruzione**: taglia il corpo di ogni
  funzione fino alla dichiarazione successiva a colonna zero, quindi si tira
  dentro gli aiuti indentati — e nel dubbio marca **impuro**. Se sbaglia,
  sbaglia togliendo candidati, non aggiungendone.

## Perché conviene farlo

Non per il numero della copertura. Perché oggi, se qualcuno cambia una riga in
`ppvSite`, **nessuna prova cade**: il difetto si vedrebbe solo aprendo la
pagina, scegliendo la litologia giusta e leggendo un numero. Le altre sei app
questa condizione l'hanno superata mesi fa.
