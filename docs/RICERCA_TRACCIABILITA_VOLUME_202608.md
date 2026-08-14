# La tracciabilità del volume dal visore — ricerca prima di scriverla

*03/08. Terza voce del censimento per valore, descritta così: «la domanda
scavo/cumulo c'è ed è fatta bene, ma **nessun metadato di provenienza viene
salvato**: né lato cella, né quota di base, né punti del ritaglio». Questa
scheda misura quanto pesano quei metadati — e la risposta non è «sarebbe
carino averli».*

---

## 1. Il documento fa già la domanda a cui i dati non sanno rispondere

Il **verbale di rilievo** — il foglio che accompagna il rilievo quando lo si
mostra a un ente — ha una sezione intitolata, testuale:

> ## Come è stato ottenuto il numero

Per un rilievo inserito a mano quella sezione dice la cosa giusta: classe di
accuratezza dal metodo dichiarato e dal GSD, con la tolleranza tipica. Ma per un
volume arrivato **dal visore** non può dire niente di vero su come il numero è
nato, perché di quel calcolo Terra non conserva **nessun** parametro.

E non è che i parametri non esistano. Esistono, sono **già calcolati**, e
vengono buttati via una riga dopo.

---

## 2. Il numero che spiega il numero è già calcolato, e viene scartato

`volumeCumulo` in `apps/genesi/pointcloud.js:133` ritorna **cinque** valori:

```js
return { volume: vol, areaCelle: filled * cellM * cellM, celle: filled, zBase, cella: cellM };
```

Il visore ne salva **uno**:

```js
a[a.length-1].volume = Math.round(v.volume) + (_georef ? '' : ' u³');
a[a.length-1].puntiRitaglio = sel.length / 3;
```

`zBase`, `cella`, `areaCelle`, `celle` — **calcolati e persi**. E il ritaglio
stesso (`window._crop`, sei numeri: x0,x1,y0,y1,z0,z1) non viene salvato
nemmeno nel visore.

Poi Terra, dal record del visore, prende **il volume e basta**: non porta con sé
neppure `puntiRitaglio` e `puntiTotali`, che il visore invece salva.

| dato | esiste? | salvato dal visore | arriva in Terra |
|---|---|---|---|
| volume | sì | ✅ | ✅ |
| punti del ritaglio | sì | ✅ | ❌ |
| punti totali della nuvola | sì | ✅ | ❌ |
| **lato cella** | **sì, calcolato** | ❌ | ❌ |
| **quota di base (`zBase`)** | **sì, calcolato** | ❌ | ❌ |
| **area coperta** | **sì, calcolato** | ❌ | ❌ |
| scatola del ritaglio | sì, in memoria | ❌ | ❌ |
| georeferenziazione sì/no | sì | ❌ | ❌ (dedotta) |
| nome del file | sì | ✅ | ❌ (solo nel toast) |

---

## 3. Quanto pesano davvero — misurato, non stimato

### Il lato cella può spostare il volume di un quinto

Misura su un **cono sintetico** di volume noto (raggio 15 m, altezza 6 m,
volume esatto **1.413,7 m³**, campionato a 10 cm), fatta girando
`volumeCumulo` vera:

| lato cella | volume calcolato | scarto dal vero |
|---|---|---|
| 0,25 m | 1.398,0 m³ | **−1,1 %** |
| 0,50 m | 1.443,0 m³ | **+2,1 %** |
| 1,00 m | 1.535,3 m³ | **+8,6 %** |
| 2,00 m | 1.726,4 m³ | **+22,1 %** |

Il verso non è casuale ed è **strutturale**: il metodo prende la quota
**massima** di ogni cella, quindi più la cella è grossa più la superficie viene
tirata verso l'alto. Su una forma convessa il segno resta questo; la grandezza
dipende dalla forma, e va detto — il cono è un caso di prova, non una cava.

**E il lato cella non lo sceglie l'utente: lo sceglie il software**, dal
ritaglio:

```js
Math.max(0.25, Math.min(2, (x1 - x0) / 60))
```

Un ritaglio di 15 m prende 0,25; uno di 120 m prende **2**. Cioè: ritagliare
un fronte intero invece di un pezzo cambia il volume di una ventina di punti
percentuali, **senza che da nessuna parte compaia il perché**.

### La quota di base è una moltiplicazione, non una sfumatura

Il volume è `Σ (quota_cella − zBase) × cella²`. Ne segue, esatta:

> **1 m di errore sulla quota di base = area coperta × 1 m³ di errore.**

Sullo stesso cono l'area coperta misurata è **729 m²**: un metro di base
sbagliata sono **729 m³**. Con un'aliquota di canone d'esempio (0,55 €/m³, il
valore che sta nelle impostazioni di Conti) fanno **401 €** su un solo rilievo —
e, cosa che pesa di più, **729 m³ di concessione** consumati o non consumati.

La difesa c'è già ed è buona — `zBase` è il **2° percentile** delle quote, non
il minimo assoluto, proprio per non farsi gonfiare da un punto spurio sotto il
piano. Ma è una difesa **invisibile**: nessuno può verificarla dopo, perché il
valore non viene conservato.

---

## 4. Un difetto trovato misurando, e non è un metadato

Il ponte di Terra scrive:

```js
$("new-ril-data").value = oggiISO();
...
err("new-ril-data", false);
```

Cioè: la data del rilievo viene messa a **oggi**, e il campo viene subito
marcato **valido**. Ma il visore, nel suo record, ha già `data: timbroLocale()`
— il momento in cui quella nuvola è stata caricata.

Chi elabora il volo del lunedì il giovedì si ritrova un rilievo datato giovedì,
precompilato, verde, e nessun motivo per guardarlo. E la data del rilievo non è
un dettaglio: entra nel confronto fra due rilievi, nei «giorni fra i due», nel
ritmo al giorno e al mese, e nel periodo del canone.

> **Decisione 1 — la data non si inventa.** Si precompila con la data del
> record del visore, **dicendo da dove viene** («dal visore, caricata il …»), e
> si lascia il campo **da confermare** invece di darlo per buono. È lo stesso
> criterio del metodo, che il ponte già tratta bene: mette `"senza GCP"` perché
> un drone consumer non è topografia, e sbagliare **verso il basso** sulla
> qualità è la direzione sicura.

---

## 5. Che cosa va salvato, e dove

> **Decisione 2 — il rilievo porta con sé la sua provenienza, in un oggetto
> solo.**

```js
rilievi/{id}.origine = {
  da: "visore",                  // manuale | visore | csv
  file: "cava_2026_07_15.las",
  quandoVisore: "2026-07-15T09:12",
  puntiTotali: 4_812_331,
  puntiRitaglio: 218_004,
  cella: 0.5,                    // m — il lato della griglia
  quotaBase: 340.42,             // m — il 2° percentile usato come piano
  areaCoperta: 729,              // m²
  ritaglio: { x0, x1, y0, y1, z0, z1 },
  georeferenziato: true,
}
```

Perché un **oggetto** e non otto campi sparsi: perché così `origine == null`
significa una cosa sola e chiara — *«di questo rilievo non sappiamo come è nato»*
— e i rilievi vecchi ricadono lì senza inventare valori. È la stessa forma con
cui `provenienza` assente vale «scavo»: **una regola dichiarata**, non un
riempimento.

> **Decisione 3 — il verbale dice quello che sa, e ammette quello che non sa.**
> La sezione «Come è stato ottenuto il numero», per un rilievo dal visore,
> aggiunge: metodo a griglia, **lato cella**, **quota di base** e come è stata
> scelta, area coperta, punti del ritaglio sul totale, e la scatola del
> ritaglio. Per un rilievo **senza** `origine` scrive che la provenienza del
> calcolo non è registrata — non tace, che è la forma in cui l'assenza si
> traveste da normalità.

E il corollario che vale per tutti i numeri di questa famiglia: **una misura che
non si può rifare non si può difendere**. Un volume senza ritaglio, senza cella
e senza quota di base non è riproducibile nemmeno da chi l'ha fatto.

---

## 6. Le unità di lavoro che ne escono

1. **il visore conserva quello che ha già calcolato** — `zBase`, `cella`,
   `areaCelle`, `celle` e la scatola del ritaglio nel record `genesiNuvole`
   (`nuvola-poc.html`). È la più piccola e sblocca tutte le altre;
2. **il ponte di Terra li porta dentro** e li salva in `origine`, con la data
   che non si inventa (Decisione 1);
3. **il verbale li stampa** (Decisione 3), con il ramo «non registrata» per i
   rilievi che non ce l'hanno;
4. **funzioni pure e prove**: `origineDi(rilievo)` (con il ripiego dichiarato),
   `descriviOrigine(origine)` per il verbale, e la prova che un rilievo **senza**
   `origine` non produca una frase che sembri una misura;
5. **la cella si mostra e si può cambiare** nel visore — oggi è una scelta del
   software che vale il 22% e non si vede da nessuna parte. Questa è la più
   grossa, e conviene farla **dopo** le prime tre, quando il numero scelto verrà
   almeno registrato.

**Il primo test da scrivere non è l'aritmetica del volume** (quella è già
coperta in `run-pointcloud.mjs`): è che `descriviOrigine(null)` **non** produca
una frase rassicurante. È il difetto che questa scheda esiste per impedire.

---

## 7. Che cosa questa scheda NON decide

- **Il metodo di volumetria**: la griglia con base piana è la stessa famiglia
  dei tool commerciali ed è dichiarata come stima. Cambiarla (per esempio con
  una base da superficie di riferimento invece che da percentile) è una scheda
  sua, e va fatta **dopo** che i parametri sono registrati — se no non si può
  nemmeno confrontare il prima col dopo.
- **La classe di accuratezza dei rilievi dal visore**: oggi il ponte mette
  «senza GCP», che è la scelta prudente e giusta. Se un giorno il volo avrà
  davvero i punti di controllo, sarà l'utente a dirlo, non il software a
  dedurlo.
- **Il valore delle tolleranze** per classe: restano quelle già in Terra, e non
  si toccano qui.

---

## La misura non resta nel documento

Le tre righe della tabella non sono numeri scritti in una scheda: sono **tre
prove** in `run-pointcloud.mjs` (**23 → 26**), e blindano il **verso**, non i
decimali:

1. celle più grosse → volume più alto, **monotòno** sui quattro lati provati, e
   lo scarto fra 0,25 m e 2 m dev'essere **oltre il 15%** — se un giorno
   diventasse trascurabile, sarebbe questa scheda a dover essere riscritta, non
   il codice;
2. con cella 0,25 m lo scarto dal cono esatto sta **sotto il 5%**;
3. alzando **tutta** la nuvola di 1 m il volume **non cambia** (base e
   superficie salgono insieme) — è il modo di verificare che `zBase` sia
   davvero misurata e non un numero fisso.

**Controprova: cinque difetti** rimessi uno alla volta su una **copia** di
`pointcloud.js` (il file vero lo importa una pagina, e mentre gira un giro del
browser non si tocca). Cinque su cinque fanno cadere la prova col loro nome; sul
modulo sano, **26 passate, 0 cadute**.

E una correzione alla controprova stessa, che è la solita lezione: la prima
versione dell'iniezione «base cablata a zero» scriveva `zBase = 0` **dopo** la
dichiarazione — ma `zBase` è `const`, quindi il modulo moriva con *«Assignment
to constant variable»* e **tutte e sette** le prove cadevano. La controprova
diceva ✓ **per il motivo sbagliato**: è il caso (3) della tassonomia in
`CLAUDE.md` — l'iniezione non aveva iniettato niente, aveva rotto il file. Si
riconosce dal numero di prove cadute (sette invece di una) e dal messaggio, che
non parlava del difetto.

## Nota sul metodo di questa misura

Le percentuali della tabella vengono da un **cono sintetico** con volume noto,
non da una nuvola vera: è un banco, non una cava. Serve a misurare il
**comportamento della funzione** (il verso e l'ordine di grandezza dell'errore
al crescere della cella), che è quello che decide se la cella vada registrata e
mostrata. Su una nuvola vera i numeri saranno altri; la direzione no, perché
dipende dal fatto che ogni cella prende la quota **massima**, e quello è scritto
nel codice, non nei dati.
