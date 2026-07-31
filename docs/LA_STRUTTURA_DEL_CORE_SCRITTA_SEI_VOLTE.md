# La struttura del core è scritta sei volte

*Misurato il 02/08. La direttiva del fondatore dice che le app copiano
l'impianto del core «pelo per pelo, senza cambiare una virgola». Oggi quella
copia esiste **sei volte**, e una si è già staccata.*

## Il fatto, misurato

Ogni app verticale ha un blocco `<script>` classico che porta la **struttura**
del core: la navigazione fra le pagine, il **toast**, la **modale** che
sostituisce `alert()` e `confirm()`, la conferma, la richiesta di un valore, la
chiusura con Escape o toccando fuori, i riquadri raggiungibili da tastiera e
l'**alone che segue il mouse**.

| app | righe del blocco |
|---|---|
| Sentinella | 89 |
| Conti | 105 |
| Terra | 106 |
| Scudo | 111 |
| Campo | 112 |
| Flotta | 141 |

**Il 76% delle righe è identico in tutte e sei.** Non «simile»: identico,
carattere per carattere.

E funzione per funzione:

| funzione | copie | versioni diverse | caratteri per copia |
|---|---|---|---|
| `toast` | 6 | 1 | 286 |
| `chiudiModale` | 6 | 1 | 251 |
| `chiedi` | 6 | 1 | 312 |
| `chiediValore` | 3 | 1 | 586 |
| **`apriModale`** | 6 | **2** | 868 / **929** |

In tutto: **27 copie**, circa **12.100 caratteri** di codice duplicato.

## E una si è già staccata

`apriModale` in **Scudo** prende un quarto parametro che le altre cinque non
hanno:

```js
function apriModale(titolo, corpo, bottoni, opzioni)
// opzioni.autofocus === false: la modale NON porta il fuoco nel primo campo.
```

E la ragione, scritta lì accanto, **è buona**: serve alla segnalazione rapida
del near-miss, che si compila a tocchi — far salire la tastiera del telefono
davanti ai pulsanti sarebbe un dispetto.

Questo è il punto. **Non è successo per sciatteria: è successo perché serviva.**
Un'app ha avuto bisogno di una cosa in più, l'ha aggiunta nella sua copia, e le
altre cinque non l'hanno saputo. Domani un'altra ne avrà bisogno di un'altra, e
la distanza cresce di un pezzo alla volta senza che nessuno decida niente.

È lo stesso difetto che oggi è stato chiuso tre volte sui **dati**
(`messaggioNumero`, `dataPiuGiorni`, `giorni`) — qui è sulla **struttura**, che
è proprio la cosa che la direttiva vuole identica.

## Cosa NON è duplicato, ed è giusto

Il **CSS** no: toast, modale, stato vuoto e alone stanno in
`shared/dw-app-ui.css`, una volta sola. *(Verificato: la prima passata di questa
misura guardava solo `dw-app-shell.css` e `deepwork-style.css` e concludeva che
mancasse tutto — era il controllo a guardare nel posto sbagliato, non il codice
a essere sbagliato.)*

E il 24% di righe proprie di ogni app è in buona parte **legittimo**: il
selettore dell'alone cambia perché cambiano i componenti (`.segnala` c'è solo
in Scudo).

## La correzione — ✅ FATTA il 02/08

Un modulo condiviso — `shared/dw-app-ui.js` — caricato come script classico
esattamente come `dw-tema.js` e `dw-grafici.js` fanno già, con dentro le cinque
funzioni **in una versione sola**: quella di Scudo, che è un **soprainsieme**
compatibile (il quarto parametro è facoltativo, e chi non lo passa ha il
comportamento di prima).

Ogni app smette di ridefinirle e usa quelle. Il selettore dell'alone resta un
parametro, perché quello **deve** poter cambiare.

Come si verifica che non cambia niente: per ogni app, aprire la pagina in
Chromium e provare **il toast** (compare, sparisce), **la modale** (si apre, il
fuoco va dove deve, Escape la chiude, il tocco fuori la chiude) e **l'alone**.
Con lo screenshot prima e dopo.

---

## Fatto

`shared/dw-app-ui.js` esiste e tutte e sei le app lo usano: **28.865
caratteri** di codice duplicato tolti dalle pagine. Nella versione condivisa è
entrato il **soprainsieme**, cioè il quarto parametro di Scudo — che adesso
ce l'hanno tutte invece di una sola.

**Un errore fatto e corretto, che vale la pena tenere.** La prima passata sulle
cinque app ha infilato la chiamata d'aggancio *dentro un import multilinea*, e
tutte e cinque hanno smesso di funzionare. L'ha trovato il banco in mezzo
secondo, e per il motivo giusto: **prova la modale invece di guardare se la
pagina si apre**. Il risultato diceva `toast:true, modale:true` ma
**`chiusa:false`** — Escape non chiudeva più niente. Un banco che avesse
guardato solo il caricamento avrebbe risposto «tutto a posto» su cinque pagine
rotte.

---

## La seconda metà: anche la navigazione si è staccata

*Misurato subito dopo, con la stessa domanda.*

Nel blocco classico di ogni app resta la funzione `go(id)`, che cambia pagina.
Esiste in **sei copie** e ha **due versioni**:

- cinque app (331 caratteri) fanno
  `document.getElementById("page-" + id).classList.add("active")` — **senza
  guardia**. Se quella pagina non esiste, la riga **solleva un errore** e la
  navigazione si ferma lì: schermo fermo, nessun messaggio;
- **Flotta** (431 caratteri) ha le guardie (`if (pag)`, `if (nav)`) **e** una
  mappa: la scheda del mezzo e l'ordine di lavoro non hanno una voce loro nella
  pillola di navigazione — che resta di sei voci, come dev'essere — e allora
  tengono acceso il segnalibro del *padre* (parco mezzi, officina).

Di nuovo, come per `apriModale`: la versione che si è staccata è **la
migliore**, e si è staccata **perché serviva**. Le altre cinque non l'hanno
saputo, e si portano dietro una **trappola dormiente** — `go()` con un id che
non esiste ferma la navigazione senza dire niente.

La forma condivisa è quindi ancora una volta il **soprainsieme**: le guardie di
Flotta per tutti, e la mappa come parametro facoltativo, perché *quella* è di
Flotta e deve restare sua.

### Ma «trappola dormiente» quanto dorme? — *misurato il 03/08*

Prima di irrigidire, la misura. Per ogni app: quante pagine esistono, quante
voci ha la pillola di navigazione, con quanti id diversi viene chiamato `go()`.

| app | pagine | voci nav | id passati a `go()` | id senza voce nav |
|---|---|---|---|---|
| Campo | 5 | 5 | 5 | — |
| Conti | 7 | 7 | 7 | — |
| **Flotta** | **8** | **6** | **8** | `sch`, `odl` |
| Scudo | 6 | 6 | 6 | — |
| Sentinella | 6 | 6 | 6 | — |
| Terra | 6 | 6 | 6 | — |

**Nessuna app chiama oggi `go()` verso una pagina che non esiste.** La trappola
è dormiente davvero, non già scattata: le guardie servono contro l'id di
*domani*, non contro un difetto di oggi, e va detto così invece di raccontarlo
più grosso di quel che è.

Quello che la tabella mostra bene è **perché** Flotta si è staccata: è l'unica
con più pagine che voci di navigazione — la scheda del mezzo e l'ordine di
lavoro si aprono da dentro, e la pillola resta di sei voci. Senza la mappa, i
suoi due id spegnerebbero il segnalibro invece di lasciarlo acceso sul padre.
Cioè: la mappa è una **funzione**, le guardie sono una **protezione**, e solo
la seconda va data a tutti.

### ✅ FATTO il 03/08

`go` sta in `shared/dw-app-ui.js` con le guardie per tutte e la mappa come
parametro dell'aggancio:

```js
dwUiAggancia({ navDi: (id) => (id === "sch" ? "mez" : id === "odl" ? "man" : id), alone: ".item,.kpi" });
```

**4.064 caratteri** tolti dalle sei pagine, e con loro **sparisce l'ultimo
blocco `<script>` classico di ogni app**: dentro non era rimasto altro che
`go`. Le sei app adesso hanno solo i tre script condivisi e il proprio modulo.

Come è stato verificato — **provando la navigazione, non guardando se la pagina
si apre**, che è la lezione pagata il 02/08 con cinque pagine rotte che
rispondevano «tutto a posto»: per ognuna delle sei app si preme ogni voce della
pillola e si pretende che diventi attiva **una sola** pagina e si accenda **un
solo** segnalibro; in Flotta si pretende in più che `sch` e `odl` tengano acceso
il segnalibro del padre; e in tutte si chiama `go()` con un id inventato e si
pretende che la navigazione **regga**. **62 asserzioni, 44 navigazioni, zero
rosse.**

La controprova serve alla pagina una versione del file condiviso **senza le
guardie** — cioè la versione delle cinque app di prima — e ne cadono
**sei**, una per app: esattamente le asserzioni sull'id che non esiste. Il
banco è entrato nella suite (`tests/browser/navigazione.mjs`), che passa da
**19 a 21** esecuzioni: una difesa che resta nello scratchpad, alla sessione
dopo non esiste.

---

## La terza metà: le sei app non erano sei

*Misurato il 03/08, scrivendo la regola che impedisce alla duplicazione di
tornare.*

Il conto «sei copie» era giusto per le **app verticali**, ma le superfici che
aprono una modale sono **nove**. Le altre tre non erano state guardate:

| superficie | che cosa ha in casa | è un problema? |
|---|---|---|
| **core** (radice) | `toast` con una durata che dipende dal modo «all'aperto» (`DB.settings.outdoor`: 4 secondi invece di 2,5, perché al sole si legge più piano) | **no**: il core è l'originale, il file condiviso è stato estratto da lì |
| **Deepwork ID · amministrazione** | `apriModale` a tre parametri, `chiudiModale`, `chiedi` scritta come freccia | **sì, ed è il caso facile**: è esattamente la forma che il condiviso accetta già |
| **Genesi** | `toast` senza il tipo, `chiedi`, `chiediValore` | **sì, ed è il caso difficile** |

### Perché Genesi è il caso difficile

Due divergenze, e la seconda è una **trappola vera**:

1. **gli id sono altri.** Il condiviso cerca `modal`, `modal-body`,
   `modal-foot`, `modal-campo`; Genesi ha `mdl`, `mdl-body`, `mdl-foot`,
   `mdl-campo`, e le sue funzioni si chiamano `mdlApri` / `mdlChiudi`. Passare
   al condiviso vuol dire rinominare nel markup, non solo togliere tre
   funzioni;
2. **`chiediValore` ha il terzo parametro incompatibile.**

   ```js
   // condiviso  (e le sei app)
   chiediValore(titolo, corpo, campoHtml, etichettaOk)
   // Genesi
   chiediValore(titolo, corpo, valore, etichettaOk)   // ← un VALORE, e il campo se lo costruisce da sé
   ```

   Stesso nome, stesso numero di parametri, **significato diverso**. Se un
   giorno qualcuno caricasse `dw-app-ui.js` in Genesi «per allinearla», la
   chiamata — una sola, riga 3895, quella che dà il nome a una volata prima di
   salvarla — continuerebbe a compilare e comincerebbe a passare il **nome
   proposto** dove ci va l'HTML del campo. Nessun errore: il campo comparirebbe
   vuoto, e chi salva si ritroverebbe la volata senza nome che aveva appena
   letto nel riquadro.

   *(Il conto è piccolo apposta: `chiediValore` la usa **un punto solo**,
   `chiedi` un punto solo, `toast` cinquantasette. Il numero non c'entra —
   quello che rende questa divergenza peggiore delle altre è che **non si
   vede**.)*

   È il difetto peggiore della famiglia — non due copie che **divergono**, ma
   due copie che **si somigliano abbastanza da scambiarsi di posto**.

### ✅ L'amministrazione è passata al condiviso — 03/08

Era il caso «facile» solo a guardare il JavaScript. Misurando anche il **CSS**
si è visto che la copia era doppia: **26 regole** nel suo `<style>`, di cui
**18 già in `shared/dw-app-ui.css`** — e **15 identiche carattere per
carattere** (contate normalizzando gli spazi).

Le **tre** che differivano meritano di essere scritte, perche la domanda «quale
delle due e quella giusta?» non si risolve a gusto:

| regola | copia locale | condiviso | chi ha ragione |
|---|---|---|---|
| `.modal-box` | `animation: mdUp .25s var(--ease)` | `fadeUp .25s ease` | **il condiviso**: il CORE scrive `animation:fadeUp .25s ease`, ed e il riferimento |
| `.mbtn.danger` | `color: #2a0906` | `color: var(--on-dg)` | **il condiviso**: `--on-dg` vale `#2b0705` ed e definito in `deepwork-style.css`, che la pagina carica gia |
| `.mbtn.danger:hover` | idem | idem | idem |

Tolti **2.043 caratteri di CSS** e **1.420 di JavaScript**; e rimasta la sola
regola davvero sua (`.modal-body p + p`).

**Che cosa e cambiato a vederlo, e va detto:** caricando il foglio condiviso
l'amministrazione ha preso anche il resto dell'impianto — «← profilo» adesso e
il bottone `.dw-home` come nelle sei app, le righe hanno la profondita delle
schede, le due note in fondo sono riquadri `.note` invece di paragrafi grigi, e
c'e l'alone che segue il mouse, che qui non c'era. E **piu** di «spostare la
modale», ed e esattamente quello che la direttiva chiede: struttura identica.
Verificato che il colore non sia scappato: la barra delle note e
`var(--note-bar)` → `var(--info)`, che e il valore che **tutte** le app usano
per una nota semplice; l'accento della pagina resta la sabbia `#c7b794`.

**E un difetto della regola 17, trovato da questo passaggio.** La regola
riconosceva «questa pagina carica il condiviso» cercando la stringa
`dw-app-ui.js` **ovunque nel file**: il commento che la nominava bastava.
Infatti ha detto «sette superfici» quando lo `<script>` non c'era ancora — e il
conto che sta li apposta ha sbagliato **verso l'alto**, cioe nella direzione
che rassicura. Adesso cerca il tag.

### La regola che tiene il conto

Da oggi l'elenco è scritto in `run-stile.mjs` (**regola 17**) con la ragione di
ognuno, e non è un permesso: se una superficie nuova si scrive la struttura in
casa il controllo **fallisce**; se una di queste tre passa al condiviso, il
controllo dice che l'elenco va accorciato. La stessa forma del `FONDO` del
censimento delle funzioni: un numero che può solo migliorare, e che nessuno
deve ricordarsi di guardare.

E controlla anche il verso opposto, che è l'errore già fatto una volta: chi
**usa** toast e modale deve averle da qualche parte. Togliere le funzioni
locali scordando il `<script>` non è un errore di sintassi — la pagina si apre,
sembra a posto, e muore al primo tocco.

---

## Genesi, misurata prima di toccarla — 03/08

*L'ultima superficie rimasta, e l'unica su cui il piano è stato **misurato
prima** invece che scritto a intuito. È servito: tre delle quattro cose
trovate non si vedono leggendo il codice delle funzioni, che è l'unica parte
che qualcuno aveva guardato finora.*

### 1. Genesi non carica **niente** di condiviso

Non è «una app che ha una copia locale»: è l'unica superficie che non prende
un solo file da `shared/`. Zero fogli di stile, zero script — nemmeno
`deepwork-style.css`, che le sei app caricano tutte. Tutto quello che ha se
l'è scritto in casa.

Cambia la natura del lavoro: nelle sei app e nell'amministrazione «passare al
condiviso» voleva dire **togliere una copia** da una pagina che il condiviso
già lo caricava. Qui vuol dire **collegare una pagina che non è mai stata
collegata**, e il rischio non è la funzione che si sposta: è tutto il resto che
arriva insieme.

### 2. Il nome `modal` in Genesi è **già occupato**, e da qualcosa che pesa

Il piano diceva «rinominare `mdl` → `modal`». Misurando si è visto che
`id="modal"` in Genesi **esiste già**, alla riga 962, e non è una modale
qualsiasi: è il **cancello di consenso** — l'avvertenza che dichiara che i
frammenti volanti della simulazione sono *estetici* e che è **vietato** usarli
per definire aree di sgombero o distanze di sicurezza. Si apre da
`maybeConsent()` con `display:flex`, ha la sua casella da spuntare e il suo
`#modalOk`.

Quindi la rinomina non è una sostituzione di stringhe: è uno **scambio di
inquilino** su un id che porta un'avvertenza di sicurezza. E il prefisso `mdl`
è a sua volta sovraccarico — sette id **non** sono della modale ma
dell'editor del fronte 3D (`mdlQuote`, `mdlTools`, `mdlR`, `mdlRLab`,
`mdlUndo`, `mdlRedo`, `mdlReset`): una sostituzione `mdl` → `modal` fatta a
tappeto li porterebbe via tutti e sette.

Da rinominare sono **cinque** id, non dodici: `mdl`, `mdl-tit`, `mdl-body`,
`mdl-foot`, `mdl-campo`.

### 3. Il CSS di Genesi **non è una copia invecchiata** — ed è il contrario dell'amministrazione

| | amministrazione | Genesi |
|---|---|---|
| regole della famiglia modale/toast | 26, di cui 18 già nel condiviso | 30, di cui 14 col nome del condiviso |
| **identiche** carattere per carattere | **15 su 18** | **2 su 14** |
| divergenti | 3 — e le locali erano quelle **invecchiate** | 12 |
| solo sue | 8 | 16 |

Ma il numero da solo mente. Messe affiancate, tutte e dodici le divergenti
divergono per **una cosa sola**: come si chiama la stessa idea.

```
.modal-head   Genesi   border-bottom:1px solid var(--line);  color:var(--tx)
              condiviso border-bottom:1px solid var(--border); color:var(--text)
.modal-body   Genesi   color:var(--mut2)
              condiviso color:var(--muted2)
.mbtn.danger  Genesi   background:#ef5350; color:#2a0906
              condiviso background:var(--danger); color:var(--on-dg)
```

Non due gusti diversi: gli **stessi valori** con nomi diversi, e cablati dove
Genesi il nome non ce l'ha mai messo. Nell'amministrazione la domanda era
«quale delle due è quella giusta» e la risposta era il condiviso, perché la
copia locale era una fotografia vecchia. Qui la domanda è un'altra: **Genesi
dichiara i nomi che il condiviso pronuncia?**

### 4. La risposta è no, ed è il numero che decide il piano

> Il foglio condiviso pronuncia **76** variabili. Genesi ne definisce **12**
> (`--bg --cu --cuD --ease --line --mut --mut2 --ok --panel --panel2 --tx
> --warn`). Le **non** definite sono **72 su 76**.

E una variabile CSS che non esiste **non fallisce**: la dichiarazione diventa
invalida e la proprietà ricade sull'ereditato o sull'iniziale. Nessun errore in
console, nessuna riga rossa — un bordo che sparisce, un testo che prende il
colore del genitore, un raggio che torna a zero. È la stessa forma del
principio che il prodotto applica ai numeri: **l'assenza di un dato non è un
dato favorevole**, e qui il dato assente si traveste da «va bene così».

Il conto del contagio: **22 selettori** del foglio condiviso cadrebbero su
markup che Genesi **ha già** — non solo la famiglia `.modal-*`, che è quella
che si vuole, ma anche `.kpi`, `.kpi.ok`, `.kpi.warn`, `.badge.ok`,
`.badge.tag`, `.note.ok`, `.dw-btn`. Cioè le schede e le pillole della
schermata di progetto, ridipinte con tinte che nella pagina non esistono.

### Il piano che ne esce: **due unità, non una**

**Unità A — solo il JavaScript** (meccanica, verificabile, nessuna decisione
aperta):

1. rinominare il cancello di consenso in `#consenso` / `#consensoOk` — è il
   pezzo che oggi occupa il nome, e il suo nome nuovo lo descrive meglio di
   `modal`;
2. rinominare i **cinque** id della modale (`mdl` → `modal`, `mdl-tit` →
   `modal-title`, `mdl-body` → `modal-body`, `mdl-foot` → `modal-foot`,
   `mdl-campo` → `modal-campo`), lasciando stare i sette dell'editor 3D;
3. riscrivere il **solo** punto che chiama `chiediValore`, che passa un valore
   dove il condiviso vuole l'HTML del campo — è la divergenza che compilerebbe
   in silenzio, ed è la ragione per cui questa unità non si fa a tappeto;
4. caricare `shared/dw-app-ui.js` e togliere `toast`, `mdlApri`, `mdlChiudi`,
   `chiedi`, `chiediValore` locali, aggiornando le **tre** chiamate a `mdlApri`
   e le **cinque** a `mdlChiudi`;
5. **non** caricare il foglio condiviso: le regole `.modal-*` di Genesi restano
   dove sono e continuano a vestire gli stessi id.

Genesi **non** prende `go()`: non ha pagine `.page` né una pillola `.nav`, si
muove per sezioni `data-scr` con la sua barra in basso. Non è una copia che si
è staccata, è un'altra cosa — e va scritto, se no la prossima lettura conta una
duplicazione che non c'è.

**Unità B — il colore, e non è un lavoro di pulizia.** Perché Genesi possa
prendere anche il CSS condiviso deve prima **dichiarare** la sua palette con i
nomi del condiviso — cioè avere una voce in `docs/PALETTE_APP.md` come le
altre sei, con i contrasti verificati. È esattamente la seconda metà della
direttiva sullo stile («colore: identità propria di ogni app»), e non si
risolve rinominando dodici variabili: `--grad`, `--edge`, `--sh1..4`,
`--halo-1/2`, `--glow-*` sono **concetti** che Genesi oggi non ha, non
sinonimi di qualcosa che ha.

Farle insieme vorrebbe dire mettere nello stesso commit una migrazione
meccanica e una scelta cromatica: se qualcosa si vede storto in uno screenshot,
non si saprebbe quale delle due l'ha fatto.

### Le misure sono controllate, non ricordate

Tutte e sei stanno in `numeri-nei-documenti.mjs` — il file che esiste apposta
perché «un numero scritto in un documento non fallisce: sta lì e invecchia». La
suite passa da **8 a 14** prove.

Ed è voluto che siano **destinate a cadere**: l'unità A fa sparire i cinque id
`mdl`, e da quel momento la prova che li cerca fallisce. È il modo giusto —
quando il piano viene eseguito, il documento che lo descrive smette di essere
vero **subito**, non sei settimane dopo che qualcuno se ne accorge leggendo.

**Controprova, otto difetti rimessi uno alla volta su copie** (`genesi.html` non
si tocca mentre gira un giro del browser): id della modale che sparisce, id
dell'editor 3D travolto dalla rinomina, `#modal` che smette di essere il
cancello di consenso, un `<script>` condiviso che compare, una variabile
mancante che viene definita, una classe in più del foglio condiviso, e i due
numeri del documento invecchiati a mano. **Otto su otto** fanno cadere la prova
che porta il loro nome, **una sola** ciascuno; sui file sani, sette passate e
zero cadute.

Una cosa imparata scrivendola: per i due difetti sul **documento** la difesa del
«quanti caratteri ho cambiato» stampa **+0** — `72` → `70` è una sostituzione a
lunghezza uguale. È il corollario già scritto in `CLAUDE.md`, e qui si è
presentato da solo: la conta da sola mente, e serve il confronto fra la copia e
l'originale.
