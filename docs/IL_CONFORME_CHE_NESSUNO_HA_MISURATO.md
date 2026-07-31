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

## La correzione

> **`statoMisura` guadagna una quarta risposta**, prima di tutte le altre:
>
> ```js
> if (!((m.letture || []).length) && m.valore == null)  // mai misurato
>   return { cls: "none", label: "Mai misurato", ratio: null };
> ```
>
> `ratio: null` e non `0`: un rapporto che nessuno ha calcolato non è zero.

Tre conseguenze, tutte volute:

1. **`riepilogoConformita` guadagna `maiMisurati`**, e quei punti **non**
   entrano in `conformi`. Il totale continua a tornare: `conformi + attenzione +
   superamento + maiMisurati === totale`;
2. **il cartellone** dice «**6 punti mai misurati**» invece di «6 punti entro
   soglia» quando non c'è nient'altro da dire, e quando ci sono entrambi lo
   scrive: «4 entro soglia · **2 mai misurati**»;
3. **`kpiFrom`** non conta i mai misurati fra gli «attivi» in ascolto senza
   dirlo — o li conta e lo dichiara, ma non li lascia sparire dentro un numero
   che sembra buono.

### Il punto delicato: `valore: 0` è già scritto negli archivi

I punti creati finora hanno `valore: 0`, non `valore: null`. Quindi il **solo**
modo onesto di distinguere «mai misurato» da «misurato e vale zero» è
`letture.length === 0` — e va accettato che un punto **importato da CSV** con un
valore ma senza storico rientri nel caso «misurato» (ha un valore dichiarato:
`parseMonitoraggiCsv` porta `m.valore`). La condizione va quindi scritta
**guardando le letture, non il valore**, e la creazione va cambiata a
`valore: null` perché domani la distinzione sia netta.

⚠️ **Zero è un dato vero.** L'interfaccia lo dice già quando si registra una
lettura — «anche zero è un dato valido» — e questa correzione **non deve**
toglierlo: un punto con una lettura a zero è **Conforme**, e va lasciato tale.
Il caso da cambiare è quello con **nessuna** lettura, non quello con la lettura
a zero.

## Le prove che vanno con la correzione

1. un punto con `letture: []` **non** è «Conforme» — e il suo `ratio` è `null`,
   non `0`;
2. un punto con **una lettura a zero** **è** «Conforme» — la controprova della
   prima, e quella che impedisce di correggere troppo;
3. `riepilogoConformita`: `conformi + attenzione + superamento + maiMisurati`
   **fa** il totale, su un insieme che contiene tutti e quattro i casi;
4. `puntoPeggiore` non sceglie un punto mai misurato quando ne esiste uno
   misurato — un `ratio: null` non deve ordinarsi come uno zero.

Il **primo** test è il numero 2, non il numero 1: la correzione più facile da
sbagliare qui è quella che, per non dire «Conforme» a vuoto, smette di dirlo
anche a chi ha misurato zero.

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

## La lezione, che è più grande del difetto

Il principio «l'assenza di un dato non è un dato favorevole» è in `CLAUDE.md` da
giorni e ha già evitato guai in tre app. Ma era applicato **a mano, dove chi
scriveva ci pensava**. Questa sonda — 342 funzioni chiamate a vuoto, un solo
segno cercato — ha trovato in pochi minuti l'unico posto in cui era rimasto
indietro, **e proprio nell'app dove il principio era nato**.

Un principio che vive nella memoria di chi legge copre il codice che sta
scrivendo in quel momento. Per coprire il resto serve qualcosa che lo cerchi.
