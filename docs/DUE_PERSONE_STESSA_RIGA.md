# Due persone che scrivono la stessa riga — la misura

*08/08/2026. È la misura che la **decisione 5b** chiede prima della funzione:
il fondatore ha scritto «sì al lavoro senza rete, **ma prima misuro cosa succede
a due persone che scrivono la stessa riga**». Qui non c'è nessuna conclusione
dedotta: ogni riga è quello che il database ha risposto.*

Come rifarla:

```sh
cd apps/deepwork-id && firebase emulators:exec --only firestore \
  --project demo-deepwork "cd tests && node due-persone-stessa-riga.mjs"
```

Due contesti **autenticati diversi** — Anna e Bruno, due membri della stessa
organizzazione, cioè due telefoni in cava — con le **regole di sicurezza vere**
caricate. Si esercita esattamente quello che fa il livello dati delle app:

```js
aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data)
```

## Che cosa risponde il database

| # | Caso | Esito misurato |
|---|---|---|
| 1 | Anna cambia l'**ora**, Bruno lo **stato** — campi diversi | **convivono**: `{ora:"08:30", stato:"assente"}` |
| 2 | tutt'e due lo **stesso campo** | vince **l'ultimo**, e il primo non lo sa |
| 3 | **leggi‑modifica‑riscrivi** di un campo **composito** | la spunta di Anna **è persa in silenzio** |
| 4 | lo stesso, col **percorso puntato** (`"esiti.dpi"`) | **convivono** |
| 5 | la riga è stata **cancellata** nel frattempo | scrittura **rifiutata**, `not-found` |
| 6 | `set` senza `merge` su una riga esistente | gli **altri campi spariscono** |

### Il caso che conta è il 3, e non è teorico
Il caso 1 rassicura e il caso 2 è ovvio (chi scrive per ultimo vince: è quello
che ci si aspetta). **Il pericolo è il 3**, perché è la forma che le app usano
davvero: la lista `esiti` viene letta dallo stato locale, cambiata in **un**
punto, e riscritta **intera**. Due persone che spuntano **voci diverse della
stessa lista** si cancellano a vicenda — e nessuna delle due vede un errore.

Il caso 4 dice che **la cura esiste ed è una riga**: scrivendo il percorso
puntato le due spunte convivono, perché il database applica la modifica al
singolo campo invece di sostituire l'oggetto.

Il caso 5 è una buona notizia già in casa: `updateDoc` su una riga cancellata
**non la resuscita**, viene rifiutata. Chi lo raccoglie è il messaggio del
salvataggio fallito della **decisione 5a**, già montato nelle sei app.

Il caso 6 è un avvertimento per il codice che verrà: `set` senza `merge`
**cancella** i campi che non nomina.

## Quanto siamo esposti — il censimento

I campi compositi si **derivano** dai dati di dimostrazione (non si elencano a
mano), e si incrociano con le chiamate che li scrivono **interi**:

| App | Campo | Dove |
|---|---|---|
| Campo | `esiti` | checklist del giro macchina — 1 punto |
| Scudo | `esiti` | ispezioni — 2 punti |
| Scudo | `azioniId` | analisi delle cause — 1 punto |
| Scudo | `misure` | permessi di lavoro — 1 punto |
| Scudo | `atmosfera` | permessi di lavoro — 1 punto |
| Sentinella | `tarature` | monitoraggi — 3 punti |
| Sentinella | `letture` | monitoraggi — 3 punti |

**Dodici punti, in quattro app su sei.** Conti, Flotta e Terra hanno campi
compositi nei dati (`scaglioni`, `righe`, `manodopera`, `voci`, `frontiId`) ma
**nessuno di quei campi viene scritto da un aggiornamento parziale**: là si
riscrive tutta la riga da un modulo, che è un caso diverso.

⚠️ **E il censimento dei campi compositi sottostima l'esposizione**, va detto:
per **Campo** la dimostrazione non contiene **nessun** campo composito, eppure
il codice scrive `esiti` intero. Cioè i dati d'esempio non mostrano lo stato in
cui il difetto vive — è la stessa lezione del denominatore che questo repository
ha già pagato: *un elenco derivato dai dati vede solo ciò che i dati contengono*.

⚠️ Un falso positivo dichiarato, perché nessuno lo riconti: cercando `dpi`
compare anche `db.aggiorna("dpi", …)`, che è il **nome della collezione** e
scrive campi scalari. Non è uno dei dodici.

### Il più affilato è `letture` di Sentinella
Due persone che caricano le letture di due strumenti sullo **stesso punto di
monitoraggio** perdono un import — e quelle letture finiscono nel report per
l'ARPA. È lo stesso principio che l'ecosistema applica ovunque: *un dato che
sparisce senza dirlo è peggio di un errore*.

## Che cosa NON dice questa misura
- Non dice niente sul **lavoro offline vero** (rete assente, coda locale,
  risincronizzazione): quello vuole `enableIndexedDbPersistence` nel browser, e
  va misurato **nel browser**, non in Node. È il passo dopo della 5b.
- Non dice **quanto spesso** succede: dice che **può** succedere e in quali
  dodici punti. La frequenza dipende da come lavora una cava vera, e non la
  sappiamo — non va inventata.

## Che cosa segue — e il piano CORRETTO dopo aver aperto i dodici punti

⚠️ **La prima stesura di questo piano diceva «una riga per punto» e
«`arrayUnion` dove si aggiunge in coda». Aprendo i dodici punti si è visto che
è falso per otto di essi**, ed è scritto qui perché nessuno ci riprovi alla
cieca — è la stessa regola del *misurare prima di irrigidire*.

### Fatto (08/08) — il passo che rende possibile tutto il resto
`applicaPercorsi` in `shared/dw-ponti.js`, e le **sei** dimostrazioni che la
usano al posto di `Object.assign`.
⛔ **Senza questo, la cura avrebbe funzionato solo col database vero e rotto la
dimostrazione**: il livello in memoria fa `Object.assign`, e `Object.assign` di
una chiave `"esiti.dpi"` crea una proprietà **letterale col punto dentro** —
misurato: `{"esiti":{"dpi":false},"esiti.dpi":true}`. Nessun errore da leggere,
la spunta non si vede, e a rompersi sarebbe stato proprio ciò che il fondatore
mostra.

### I dodici punti, divisi per quello che vogliono davvero
| Forma | Punti | Che cosa serve |
|---|---|---|
| **oggetto, cambia UNA voce** | Scudo `esiti` ×2, Campo `esiti` | percorso puntato — **ma** le due di Scudo sanno anche **togliere** una voce, e per cancellare col percorso puntato serve `deleteField()`: cioè un **contrassegno** che il livello dati traduca (`deleteField` con Firestore, `delete` in memoria). Non è una riga: è una riga **più** il contrassegno |
| **elenco** | Sentinella `letture` ×3, `tarature` ×3, Scudo `azioniId`, `misure` | ⛔ `arrayUnion` **non basta**, misurato punto per punto: 4121 **corregge** una lettura già dentro (l'indice di un array non si scrive col percorso puntato), 4573 aggiunge **e taglia** a `MAX_LETTURE`, 4930 è un **import in blocco**. La forma giusta è una **transazione** (`runTransaction`), che rilegge e riscrive in modo atomico |
| **modulo intero** | Scudo `atmosfera` | non è il caso della spunta persa: l'utente invia **tutte** le misure di gas insieme. Due persone che compilano lo stesso permesso sono un conflitto sullo **stesso campo** (caso 2), e la risposta lì non è tecnica |

### E solo dopo, la coda offline
Mettere in coda scritture che si cancellano a vicenda vorrebbe dire
**moltiplicare** il problema, non risolverlo.
