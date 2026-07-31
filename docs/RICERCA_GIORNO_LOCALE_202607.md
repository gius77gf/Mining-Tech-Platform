# «Oggi» non è quello che dice `toISOString()`

**Misurato il 31/07/2026.** Non è un sospetto: ogni riga qui sotto è l'uscita di
uno script che ha eseguito il codice vero con l'orologio dell'Italia
(`TZ=Europe/Rome`), non un ragionamento sul codice.

## Come è venuto fuori

Una prova nuova sul programma di monitoraggio di Sentinella andava provata
**contro il difetto** (regola di `CLAUDE.md`: una prova che non sa fallire non
dimostra niente). Il difetto era «i giorni sommati in ora locale invece che
UTC», e sotto l'orologio del contenitore — che è **UTC** — la controprova
rispondeva *«non distingue»*: il difetto c'era, ma in UTC non si vede.

Rilanciata con `TZ=Europe/Rome`, la controprova ha visto il difetto. E, di
rimbalzo, la suite intera lanciata con l'orologio italiano è **caduta in due
punti** su `ritmoMedioAnnuo` di Terra — due prove che in UTC erano verdi.

È la stessa lezione già scritta, in una veste nuova: **un controllo che gira in
un ambiente diverso da quello del cliente misura l'ambiente, non il prodotto.**
Il contenitore è in UTC; le cave sono in Italia, cioè UTC+1 d'inverno e UTC+2
d'estate. Ogni conto che passa da `toISOString()` su una data costruita in ora
**locale** perde da una a due ore, e quando quelle ore attraversano la
mezzanotte cambia il **giorno**.

## Cosa fa `toISOString()` che nessuno si aspetta

`toISOString()` scrive sempre **l'istante in UTC**. Una data costruita in ora
locale — `new Date()`, oppure `new Date(anno, mese, 1)` — è un istante che in
Italia sta **una o due ore avanti** rispetto a UTC. Mezzanotte del 1° maggio a
Roma è ancora **le 22:00 del 30 aprile** a Greenwich, e `toISOString()` scrive
appunto aprile.

## Le due categorie, misurate

```
== A · SEMPRE sbagliati (non è un caso di bordo)
  core: chiave del mese nel grafico 6 mesi        UTC: 2026-04     vero: 2026-05
        l'etichetta accanto dice invece: mag
  conti: scadenza fattura a 30 giorni dal 01/07   UTC: 2026-07-30  vero: 2026-07-31
  terra: ritmo medio, estremo alto della finestra UTC: ieri        vero: oggi

== B · sbagliati fra mezzanotte e le 2 (cioè durante il turno di notte)
  core: data di un rapportino scritto alle 00:30  UTC: 2026-06-01  vero: 2026-06-02
  conti: data di una fattura emessa alle 00:30    UTC: 2026-06-01  vero: 2026-06-02
  terra: un rilievo di oggi è «nel futuro»?       UTC: SÌ → rifiutato   vero: no
  core: mese proposto nell'export del 1° del mese UTC: 2026-05     vero: 2026-06
  terra: anno in corso per la deplezione riserve  UTC: 2025        vero: 2026
```

### I tre della categoria A, spiegati

**1. Il grafico «ultimi 6 mesi» del core mostra il mese sbagliato. Sempre.**
`index.html:1826` e `index.html:1897` costruiscono ogni barra così:

```js
const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
months.push({ key: d.toISOString().slice(0, 7),                     // ← UTC
              lbl: d.toLocaleDateString("it", { month: "short" }) }); //  ← locale
```

La **chiave** con cui si raccolgono i dati è UTC, l'**etichetta** che l'utente
legge è locale. Le due si riferiscono a due mesi diversi: la barra scritta
«mag» contiene la produzione di **aprile**. Non un giorno, non un caso di
bordo: tutte e sei le barre, tutto l'anno, per tutti gli utenti italiani. È il
grafico della scheda cava e quello del gemello digitale.

**2. Le scadenze delle fatture di Conti cadono un giorno prima.**
`apps/conti/index.html:1340`:

```js
const piuGiorni = (iso, n) => { const d = new Date(iso + "T00:00:00");   // ← locale
  d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };    // ← UTC
```

Fattura del 01/07 a 30 giorni: la scadenza proposta è **30/07**, non 31/07.
Sempre, tutto l'anno. Un giorno su un documento fiscale, e su un conto che poi
diventa «giorni di ritardo» nel sollecito.

**3. Il ritmo medio annuo di Terra non vede la misura di oggi.**
`apps/terra/terra-data.js:517-525` prende la mezzanotte **locale** e la scrive
in **UTC**: l'estremo alto della finestra è quindi **ieri**, e un rilievo
elaborato oggi resta fuori dal conto che stima *quando finisce il volume
concesso*. È il difetto che ha fatto cadere due prove verdi.

### E la categoria B non è un dettaglio, in una cava

«Fra mezzanotte e le due» in un ufficio è un caso di bordo. In una cava con il
**turno di notte** è l'orario in cui si scrive il rapportino. Il core lo
data al giorno prima, e Terra arriva a **rifiutare** un rilievo di oggi
dicendo che è «nel futuro».

## Il difetto sotto il difetto: la stessa regola scritta sei volte

`oggiISO` — «che giorno è oggi, in ISO» — esiste **sei volte** nel progetto, in
**tre** versioni diverse:

| dove | come | esito |
|---|---|---|
| `apps/campo/campo-data.js:131` | con lo scarto di fuso, **esportata**, con il commento che spiega perché | giusto |
| `apps/flotta/index.html:1336` | con lo scarto di fuso, copiata | giusto |
| `apps/scudo/index.html:2672` | con lo scarto di fuso, copiata | giusto |
| `apps/terra/index.html:2806` | con lo scarto di fuso, copiata | giusto |
| `apps/sentinella/index.html:2203` | con lo scarto di fuso, copiata | giusto |
| `apps/conti/index.html:1338` | `new Date().toISOString()` | **sbagliato** |

Campo aveva già capito tutto, e l'aveva pure **scritto nel commento**: *«usare
`toISOString()` sulla data grezza darebbe il giorno UTC e in Italia, la sera
tardi, sbaglierebbe di un giorno intero»*. Poi la stessa regola è stata
ricopiata quattro volte e riscritta male una quinta. È **esattamente** il
difetto che in questo progetto è già costato una giornata con la convenzione sui
numeri, e la regola di `CLAUDE.md` che ne è nata dice dove va messa: **una regola
che serve a due app vive in `shared/`, e le app la ri-esportano** — un alias, non
una seconda implementazione.

## Cosa fare (unità concrete, in quest'ordine)

1. **`isoLocale(data)` e `oggiISO()` in `shared/deepwork-id-client/dw-shell.js`**,
   accanto a `giorniTra` che già ragiona in ora locale. Campo **ri-esporta**
   `oggiISO` col nome che ha sempre avuto; il test pretende l'**identità**
   (`campo.oggiISO === shell.oggiISO`), non il comportamento: due copie uguali
   oggi divergono domani senza che nessuno lo veda.
2. **I tre della categoria A**, che sono quelli che sbagliano ogni giorno: le
   due chiavi dei mesi nel core, `piuGiorni` di Conti, la finestra di
   `ritmoMedioAnnuo` in Terra.
3. **I sei della categoria B**, uno per uno, distinguendo i punti in cui la data
   è **scritta su un dato** (rapportino, fattura, lettura) da quelli in cui è
   solo una **proposta** che l'utente può cambiare.
4. **Le prove girano anche con l'orologio italiano.** Una prova che passa solo
   in UTC misura il contenitore. Va aggiunta una passata `TZ=Europe/Rome` alla
   suite, altrimenti fra un mese ci ricaschiamo.
5. **Una regola in `run-stile.mjs`** che vieta `toISOString()` su una data
   costruita in ora locale quando se ne prende solo il giorno: è la forma
   verificabile di tutto questo documento.

## Quello che NON va fatto

**Non** una sostituzione in blocco di tutti i `toISOString()`. Alcuni sono
**giusti così**: `sentinella-data.js:972` e i due di `shared/dw-ponti.js`
costruiscono la data con `"T00:00:00Z"` e la spostano con `setUTCDate` —
entrano in UTC ed escono in UTC, e sono coerenti. Cambiarli introdurrebbe il
difetto che stiamo togliendo. Vale la regola già imparata: **misurare prima di
irrigidire**, uno per uno.
