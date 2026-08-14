# Sei cantieri, e il guasto che mi sono fatto da solo

**Data:** 01/08/2026 · **Area:** tutte e sei le app, `shared/`, `tests/`, `docs/`
**Unità precedente:** `20260801-170447_la-taratura-e-lo-strumento-che-confondeva-i-valori.md`
(commit `bb96582`)
**Commit:** da `08c86d4` a `6efb0a5`

## ⛔ Prima di tutto: il difetto che ho introdotto io

Committando il lavoro sugli allegati (`4ce1809`) ho messo nell'indice
`apps/scudo/index.html` **credendolo libero** — il cantiere di Scudo era finito.
Ma quello di **Campo** l'aveva toccato, e con ragione (senza quelle righe il suo
ponte consegnava una falsità). Mi sono portato dietro l'`import { daCampo }`
**senza** `scudo-data.js`, rimasto su disco.

Un import ESM di un nome inesistente è un errore **duro**. Misurato affiancando
due copie:

| | voci in elenco azioni | KPI del quadro | errore |
|---|---|---|---|
| `HEAD` (4ce1809) | **0** | `—/—/—/—/—/—/—/—` | `does not provide an export named 'daCampo'` |
| disco | 4 | `2/2/1/13/2/3/2/2` | nessuno |

**Per cinque commit la pagina di Scudo non partiva.** Riparato in `29f0229` e
verificato **sul committato**, non sul disco: KPI pieni, zero errori.

E la parte che conta: **nessun controllo l'ha preso**, e per una ragione
ripetibile — le suite `node` non importano le pagine, `run-stile` legge il
testo (e un import sbagliato è sintatticamente perfetto), il giro completo del
browser dura ore, e **su disco funzionava tutto**. Il difetto viveva solo nella
differenza fra il disco e il committato.

Da lì due cose: la regola in `CLAUDE.md` (*non si mette nell'indice un file che
un cantiere sta modificando* — la tecnica giusta, costruire il contenuto da
`HEAD` e metterlo nell'indice senza toccare il working tree, la usavo già per i
file di test) e un banco nuovo, `browser/pagine-vive.mjs`, che fa una domanda
sola sulla copia congelata di `HEAD`: *ogni superficie si apre senza errori?*
Un minuto, quindi si lancia prima di ogni push.

## I due buchi nell'harness, e sono della stessa famiglia

**1. `eq` confrontava con `JSON.stringify`**, che appiattisce cinque coppie:
`Infinity`, `-Infinity`, `NaN` e `null` si scrivono **tutti** `"null"`. Non
conta il numero, conta **dove cade**: `null` è la convenzione con cui
l'ecosistema dice «non si può calcolare», e `Infinity` è **quello che il difetto
produce**. Trovato perché una controprova rispondeva «non distingue» col difetto
rimesso dentro.

**2. `test` era sincrono**, quindi una prova `async` non veniva mai contata: un
`ok(false)` dentro una di loro lasciava il totale a **«0 falliti»**. Erano
quattro in `run-kpi` e una in `run-stile` — e la ragione per cui erano
sopravvissute è che in `run-stile` ce n'era **una sola**.

Il risultato onesto, che non va gonfiato: dopo tutt'e due le correzioni **la
suite resta verde**. Non nascondevano difetti già scritti — mordevano le prove
**nuove**, mentre le si scriveva.

## Le sei unità di prodotto

| app | cosa | il punto |
|---|---|---|
| **Sentinella** | taratura degli strumenti | «era tarato **quel giorno**?», non «è tarato oggi?» |
| **Sentinella** | la graffetta sugli adempimenti | e la regola degli allegati passa in `shared/` |
| **Scudo** | andamento degli indici | anno senza ore = **buco**, mai zero |
| **Terra** | volume banco per banco | il lavoro è stato **non aggiungere un campo** |
| **Campo → Scudo** | dal fermo all'azione correttiva | «non lo so» ha il suo colore, diverso dal rosso |
| **Conti** | abbinamento dei movimenti bancari | l'incerto **non diventa** una proposta |
| **Flotta** | il salvataggio senza rete | le scritture non falliscono: **restano appese** |

Su Flotta la misura ha cambiato il rimedio: con `disableNetwork`, `addDoc`
rimane **pendente per sempre**. Un `try/catch` non prende niente — la difesa è
un **orologio**.

## La verifica del delta, chiusa

| | righe | assenti | **false** | a metà |
|---|---|---|---|---|
| sei app | **105** | 63 | **18** | 24 |

**Una mancanza dichiarata su sei non esisteva**, e va peggio dove il codice è
più maturo (Conti: una su tre e mezzo). L'avviso in cima ai sei documenti adesso
porta questo conto invece di dire «non verificata».

## Quello che lo scatto ha trovato e il codice no

Sei difetti, tutti invisibili leggendo: un campo alto **120 px invece di 63**
(`flex:1 1 120px` è una base *verticale* dentro `.form.col`); una causale che
chiedeva **491 px in 352**, tagliata proprio dove serve leggerla; un toast di
nove righe che copriva il bottone; una riga d'errore due schermate più in basso;
un allegato valido che si annunciava **«0 KB»**, cioè con la cifra che l'app usa
per dire «vuoto»; e su Scudo un fermo di macchina chiamato **«non conformità»**
davanti a un ispettore.

⚠️ E una mia supposizione corretta: avevo scritto che il difetto del campo
stava «anche in Conti, Flotta, Scudo e Terra». Misurato: **Scudo 0, Terra 0**,
Conti non ha `.form.col`, Campo non ha quella base. Resta solo Flotta.

## Verifica

`giro-node.mjs --tz`: **30 comandi a posto, 0 caduti** — quindici suite, due
volte, in UTC e con l'orologio del cliente. È il primo giro fatto **col comando
solo** invece che a memoria; quello a memoria, tre ore prima, ne lanciava
undici, e le quattro dimenticate contenevano il controllo che ha fatto cadere
la CI.

`run-kpi` **1214/0** (era 1125 stamattina), `run-stile` 275/0, copertura
**499/499**, 45 banchi del browser.

## Prossimo passo atomico

Portare in `shared/dw-ponti.js` `statoPonte`/`statoRisposta`, che oggi sono **la
stessa regola scritta due volte** in Sentinella e Campo — il cantiere l'ha
lasciata dichiarata in un commento invece che nascosta, e il codice pronto sta
nel suo rapporto. Il test deve pretendere l'**identità** (`campo.statoRisposta
=== ponti.statoPonte`), non il comportamento, e va tolta la riga di
`campo.statoRisposta` da `ALLARMI_ACCETTATI`.

⛔ **Decisione aperta per il fondatore**, da non prendere da soli: la
**persistenza offline** dell'SDK. Il core ce l'ha, le sei app no, e un commento
in `sw.js:66` dice il contrario. Il codice è pronto, ma porta quattro rischi
dichiarati — i ponti, il messaggio di Flotta da cambiare insieme, la cache che
resta su disco **per origine e non per organizzazione** (che è l'unica barriera
difesa dai 58 test), e le letture che diventerebbero vecchie in silenzio.
