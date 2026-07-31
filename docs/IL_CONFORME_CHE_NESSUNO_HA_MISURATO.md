# Il «Conforme» che nessuno ha misurato

*03/08. Trovato passando a tappeto le **342 funzioni pure** dei sei moduli dati
con input vuoti e cercando **un solo segno**: una risposta **tranquilla** dove
non è stato misurato niente. Nove candidati; otto sono legittimi; uno no, ed è
sulla prima schermata di Sentinella.*

---

## Il fatto, in cinque righe

```js
// apps/sentinella/index.html — creazione di un punto di misura
await db.aggiungi("monitoraggi", { nome, unita, soglia, ricettoreId, valore: 0, letture: [] });

// apps/sentinella/sentinella-data.js:89
export function statoMisura(m) {
  const r = (+m.valore || 0) / Math.max(0.001, +m.soglia || 1);
  if (r >= 1)   return { cls: "danger", label: "Superamento", ratio: r };
  if (r >= 0.9) return { cls: "warn",   label: "Attenzione",  ratio: r };
  return { cls: "ok", label: "Conforme", ratio: r };            // ← anche a zero letture
}
```

Un punto appena configurato nasce con `valore: 0` e `letture: []`. Non è stato
misurato **niente**. Il rapporto fa zero, zero è sotto 0,9, e la risposta è
**«Conforme», verde**.

## Che cosa vede l'utente, misurato

Sei punti configurati, nessuna lettura registrata:

```
Polveri P1 -> {"cls":"ok","label":"Conforme","ratio":0}
riepilogoConformita -> {"conformi":6,"attenzione":0,"superamento":0,"totale":6}

il cartellone dice:      «6 punti entro soglia»
il KPI «conformi» dice:  6
```

Tre punti dell'interfaccia, tutti d'accordo nel dire una cosa falsa:

| dove | che cosa mostra |
|---|---|
| **cartellone** in cima al Quadro | «**6** punti entro soglia», classe neutra |
| **KPI `k-conf`** | **6** |
| **badge** di ogni punto in elenco | **Conforme**, verde |

Non è un caso limite: è **il primo giorno di ogni cliente**. Si configurano i
punti di misura, e prima ancora di appoggiare uno strumento la cava risulta a
posto.

## Perché è più grave che altrove

Sentinella è l'app che produce il **report di conformità** per l'ente. Il
principio che questo difetto viola è già scritto in `CLAUDE.md`, ed è **nato
proprio qui**:

> «in Sentinella *senza dati* non è *conforme* (il report per l'ente lo dichiara
> invece di spacciarsi per a posto)»

Il **report** è stato corretto. Il **badge**, il **KPI** e il **cartellone** no.
La regola era stata applicata dove la si stava scrivendo, e non nel resto
dell'app — che è il modo in cui un principio giusto lascia indietro dei pezzi.

E l'informazione **c'è già**: la pagina calcola `nl = (m.letture || []).length`
in **due** punti (righe 1564 e 2796) e la usa per ordinare e per il grafico, ma
**non** per lo stato.

## La correzione — e il vocabolario **esiste già in questa app**

Prima di inventare una risposta nuova, la ricerca dentro casa. Sentinella **sa
già** dire «mai misurato», in `statoRigaProgramma` (`sentinella-data.js:1005`):

```js
const ul = ultimaLettura(monitoraggio);
const base = { …, ultimoValore: ul ? ul.valore : null, maiMisurato: !ul, … };
if (!partenza) return { ...base, stato: "mai", cls: "warn", label: "Mai misurato" };
```

con il commento che spiega anche **perché giallo e non rosso**:

> «lo stato è *mai misurato*, che è un **avviso e non un allarme**: magari il
> punto è stato appena creato.»

Quindi la correzione non introduce niente: **riusa**. Vocabolario `maiMisurato`,
etichetta «Mai misurato», classe `warn`, e soprattutto il **rilevatore**
`ultimaLettura(m)` — che non guarda `letture.length` grezzo ma **valida data e
valore** (`/^\d{4}-\d{2}-\d{2}$/` e `Number.isFinite`), cioè non conta come
misura una riga rotta.

È il terzo posto in tre giorni in cui la cosa giusta era già scritta **in
un'altra funzione della stessa app**: il report, `statoRigaProgramma`, e adesso.

### Due casi, non uno — e questo è emerso solo misurando

| situazione | `letture` | `valore` | oggi | proposta |
|---|---|---|---|---|
| punto appena creato dall'interfaccia | `[]` | `0` | **Conforme** | **Mai misurato** (`stato: "mai"`) |
| punto importato da CSV | `[]` | numero vero | **Conforme** | **Senza data** (`stato: "senza-data"`) |
| punto con una lettura a **zero** | 1 riga | `0` | Conforme | **Conforme** — non si tocca |

Il secondo caso non è «mai misurato»: `parseMonitoraggiCsv` **filtra** le righe
con `Number.isFinite(m.valore)`, quindi un punto importato **ha** un valore
dichiarato dall'utente. Ma è un valore **senza data**: non entra nella serie
storica e non si può citare in un report per l'ente. Chiamarlo «conforme» è
falso quanto l'altro; chiamarlo «mai misurato» è ingeneroso. Sono **due stati
diversi**, e vanno detti come tali.

### Una decisione che avevo scritto e che la misura ha corretto

La prima stesura di questa scheda diceva di cambiare la creazione a
`valore: null` «perché domani la distinzione sia netta». **Non serve, e
introduce rischio**: `m.valore` è letto in una dozzina di punti fra modulo e
pagina (`numeroIt(m.valore)`, `valore: +m.valore`, i grafici) e un `null` che
diventa `NaN` si vede peggio di quello che risolve. Il segnale autorevole è
`ultimaLettura(m)`, non il valore corrente — e con i due stati qui sopra la
distinzione è già netta senza toccare gli archivi.

### Le tre conseguenze a valle

1. **`riepilogoConformita` guadagna `maiMisurati` e `senzaData`**, e quei punti
   **non** entrano in `conformi`. Il totale continua a tornare:
   `conformi + attenzione + superamento + maiMisurati + senzaData === totale`.
   ⚠️ Il ramo va messo **prima** del controllo su `cls`, se no i mai misurati
   finiscono in `attenzione` (condividono il giallo);
2. **il cartellone** dice «**6 punti mai misurati**» invece di «6 punti entro
   soglia», e quando ci sono entrambi lo scrive: «4 entro soglia · **2 mai
   misurati**»;
3. **`kpiFrom`** non li lascia sparire dentro un numero che sembra buono.

### Il punto di chiamata da aggiornare, o la correzione si rompe da sola

`index.html:3327` fa `statoMisura({ ...m, valore })` **dopo** aver registrato la
lettura, ma spreta il vecchio `m`, le cui `letture` non contengono ancora quella
nuova. Con la correzione, **la prima misura di un punto** mostrerebbe nel toast
«Mai misurato» proprio mentre la si registra. La riga giusta è
`statoMisura({ ...m, valore, letture })` — `letture` è già in scope una riga
sopra.

⚠️ **Zero è un dato vero.** L'interfaccia lo dice già quando si registra una
lettura — «anche zero è un dato valido» — e questa correzione **non deve**
toglierlo: un punto con una lettura a zero è **Conforme**, e va lasciato tale.

## Le prove che vanno con la correzione

1. un punto con `letture: []` e `valore: 0` **non** è «Conforme» — e il suo
   `ratio` è `null`, non `0`;
2. un punto con **una lettura a zero** **è** «Conforme» — la controprova della
   prima, e quella che impedisce di correggere troppo;
3. un punto **importato da CSV** (valore vero, `letture: []`) è «senza data», e
   **non** è né «Conforme» né «Mai misurato»;
4. una lettura con **data non valida** non conta come misura — è la ragione per
   cui il rilevatore è `ultimaLettura` e non `letture.length`;
5. `riepilogoConformita`: `conformi + attenzione + superamento + maiMisurati +
   senzaData` **fa** il totale, su un insieme che contiene tutti e cinque i casi;
6. `puntoPeggiore` non sceglie un punto mai misurato quando ne esiste uno
   misurato — un `ratio: null` non deve ordinarsi come uno zero.

Il **primo** test è il numero 2, non il numero 1: la correzione più facile da
sbagliare qui è quella che, per non dire «Conforme» a vuoto, smette di dirlo
anche a chi ha misurato zero.

### Scritte **prima** della correzione, e già provate a fallire

Le sei sono state scritte e lanciate sul modulo **non ancora corretto**:
**cinque cadono**, ognuna col messaggio che nomina il suo caso, e la sesta —
la numero 2, quella che protegge lo zero misurato — **passa, e deve passare
anche dopo**. È il modo di non scrivere le prove *addosso* al comportamento
appena ottenuto.

E una delle sei è stata **rifatta**, perché passava già oggi:

> La prima versione della numero 6 diceva «un punto mai misurato non diventa il
> punto messo peggio» e confrontava i due `ratio`. Passava, e **non perché il
> codice fosse a posto**: `0 > 1,6` è falso esattamente come `null > 1,6`. È il
> **caso (1)** della tassonomia in `CLAUDE.md` — i dati della prova facevano
> **coincidere** la risposta giusta con quella sbagliata.

Al suo posto una prova che distingue davvero **e** difende una regola di casa:
`statoMisura` deve usare **lo stesso vocabolario** di `statoRigaProgramma`
(`stato: "mai"`, «Mai misurato», `cls: "warn"`). Due funzioni della stessa app
non possono chiamare la stessa idea in due modi — è la duplicazione che questa
settimana è già costata una giornata.

---

## Gli altri otto candidati: perché non sono difetti

Il censimento a tappeto ne ha segnalati nove. Vale la pena scrivere **perché
otto non lo sono**, se no la prossima lettura li ritrova e li riapre:

| funzione | risposta a vuoto | perché va bene |
|---|---|---|
| `conti.livelloSollecito` | `cls "ok"` | l'argomento è **giorni di ritardo**: zero giorni = nessun ritardo, ed è un fatto |
| `flotta.urgenza` | `cls "ok"` | idem, ragiona su una distanza in giorni |
| `flotta.riepilogoControllo` | `gravita "ok"` | un giro macchina **senza voci fuori posto** è davvero a posto |
| `scudo.livelloScadenza`, `terra.livelloScadenzaTerra` | `cls "ok"` | prendono una data: nessuna data vicina = nessuna urgenza |
| `sentinella.confermaVolataEseguita` | `esito "regolare"` | è il campo precompilato di un modulo, non un giudizio |

### Due che **non** sono difetti oggi, ma lo sarebbero domani

`scudo.statoAzione` e `scudo.statoIspezione` rispondono **«regolare»** a
un'azione correttiva aperta **senza data**:

```js
if (!a.scadenza) return "regolare";          // senza data non allarma
```

Misurata la raggiungibilità, come chiede `CLAUDE.md` prima di irrigidire:
**nessun percorso crea oggi un'azione senza data**. Il form la pretende, con un
messaggio esplicito («Servono l'azione da fare e la data entro cui farla: senza
una data non entra nello scadenzario»); la creazione automatica da un'ispezione
passa sempre una scadenza; e la nota nell'interfaccia dichiara la regola («Le
azioni **non chiuse con una data** entrano nel semaforo»).

Quindi è una **trappola dormiente**, come lo erano le guardie di `go()` — e come
quella va detta per quello che è: non un difetto di oggi, ma una riga che il
giorno in cui nascerà un percorso nuovo (un'azione creata da un ponte, o
importata da CSV) risponderà **«regolare»** su qualcosa che nessuno ha
programmato. Quando si tocca quel codice, la risposta giusta è **«senza
scadenza»**, non «regolare».

---

---

## La seconda forma di vuoto, e le tre facce di `urgenzaOre`

La prima passata guardava la **lista vuota** — «non c'è nessuna riga». Ma esiste
un secondo vuoto, più frequente: **la riga c'è e non è compilata**. Si crea la
scheda e la si lascia a metà, ed è quello che succede davvero.

Rifatta la sonda con `[{}]` al posto di `[]`: **tre casi in più**, e uno merita
la sua sezione.

### `flotta.urgenzaOre`, misurata

| `orePreviste` | `oreAttuali` | risposta |
|---|---|---|
| 600 | 500 | `{cls:"ok", label:"tra 100 h"}` — giusto |
| 600 | *ignote* | `{cls:"", label:"a 600 h"}` — **giusto, ed è la parte già corretta** |
| **`null`** | 500 | `{cls:"danger", label:"SCADUTA (+500 h)"}` |
| **`""`** | 500 | `{cls:"danger", label:"SCADUTA (+500 h)"}` |
| **`"boh"`** | 500 | `{cls:"ok", label:"**tra NaN h**"}` |
| `null` | `null` | `{cls:"", label:"**a 0 h**"}` |

Tre facce dello stesso buco:

1. un tagliando **senza ore obiettivo** viene dichiarato **scaduto da 500 ore**,
   in rosso. È `+null === 0` — la trappola dormiente già scritta in `CLAUDE.md` —
   e qui produce un **allarme inventato**, non un falso «va bene». Per questo la
   prima sonda non l'aveva vista: cercava il **tranquillo**, e questo è il
   contrario;
2. un valore non numerico scrive **«tra NaN h»** sul badge, in verde;
3. con tutt'e due ignote dice **«a 0 h»**, cioè afferma che il tagliando è
   previsto a zero ore. Il ramo giusto esiste (`Number.isFinite(prev) ? … :
   "a ore"`) ma **non si raggiunge**, perché `+null` è `0` ed è finito.

**La cosa che rende questo caso istruttivo** è che la funzione era stata
**appena corretta** per il difetto gemello, e il commento lo racconta:

> «⛔ *ZERO ORE* E *NON LO SO* SONO DUE COSE DIVERSE, anche qui. […] su un mezzo
> di cui non sappiamo il contatore mostrava *tra 500 h* IN VERDE — un colore
> tranquillo dove non è stato misurato niente.»

La guardia è stata messa su **`oreAttuali`**, con la forma giusta
(`== null || === ""` prima di convertire), e **non** su `orePreviste`, che è
rimasto un `+orePreviste` nudo. **Stesso difetto, stessa funzione, stesso
giorno: metà chiusa e metà no.**

### Ma quanto è dormiente? — misurato

Tutti e **quattro** i punti di chiamata guardano prima: `if (n.orePreviste)`,
`n.orePreviste ? … : urgenza(…)`, `if (+(n && n.orePreviste) > 0)`. E il form
scrive `orePreviste` solo attraverso un validatore
(`const orePreviste = rmh.ok ? rmh.valore : null`), quindi il campo è **sempre**
un numero finito o `null`.

Quindi: **nessuna delle tre facce è raggiungibile oggi**. È dormiente come le
guardie di `go()` — e va detto così. Ma la protezione poggia su **quattro punti
di chiamata che si ricordano**, e la regola di questa casa è che una cosa
affidata alla memoria prima o poi salta. La correzione è di tre righe, dentro la
funzione, ed è **la stessa forma già scritta lì accanto** per l'altro parametro.

---

## La lezione, che è più grande del difetto

Il principio «l'assenza di un dato non è un dato favorevole» è in `CLAUDE.md` da
giorni e ha già evitato guai in tre app. Ma era applicato **a mano, dove chi
scriveva ci pensava**. Questa sonda — 342 funzioni chiamate a vuoto, un solo
segno cercato — ha trovato in pochi minuti l'unico posto in cui era rimasto
indietro, **e proprio nell'app dove il principio era nato**.

Un principio che vive nella memoria di chi legge copre il codice che sta
scrivendo in quel momento. Per coprire il resto serve qualcosa che lo cerchi.

E la seconda passata aggiunge il corollario: **anche una sonda copre solo la
forma di vuoto che le si dà in pasto**. La lista vuota ha trovato un difetto; il
record vuoto ne ha trovati altri tre, nella stessa mezz'ora, senza cambiare una
riga della logica. Quando un controllo risponde «tutto a posto», la domanda
successiva non è *«funziona?»* ma **«che cosa ha guardato?»**.
