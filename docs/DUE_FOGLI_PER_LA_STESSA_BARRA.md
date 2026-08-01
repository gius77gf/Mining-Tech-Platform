# Due fogli condivisi disegnano la stessa cosa

*Misurato il 01/08/2026, dopo che la barra dell'amministrazione di Deepwork ID è
uscita dallo schermo su un telefono. Non è la storia di quella pagina: è la
misura di **perché** poteva succedere, e serve a rendere concreto l'item E0
della roadmap («consolidamento in `shared/`»), che finora era una buona
intenzione senza numeri.*

## I tre fogli, e quanto si sovrappongono

| foglio | selettori |
|---|---|
| `shared/deepwork-style.css` | 18 |
| `shared/dw-app-shell.css` | 43 *(→ **23** dopo il passo 3, sotto)* |
| `shared/dw-app-ui.css` | 208 |

**49 selettori sono definiti in più di un foglio.** Il grosso è fra shell e ui:

> **38 dei 43 selettori di `dw-app-shell.css` sono ridefiniti da
> `dw-app-ui.css`** — che nelle pagine viene caricato **dopo**, quindi vince.

Non è una duplicazione qualunque: sono le stesse cose disegnate due volte —
`.top`, `.nav`, `.page`, `.kpi`, `.item`, `.badge`, `.sec`, `.avatar`, `.info`,
`.name`, `.meta`.

## I cinque che sopravvivono, e il guaio che fanno

Quando una pagina carica **entrambi**, di `dw-app-shell.css` restano vive solo
cinque regole:

```
.top h1 .accent    .top .sub    .kpi.accent    .kpi.accent .n    .item:active
```

⛔ E qui c'è il difetto vero, non un'inefficienza: **le due metà della barra
alta arrivano da fogli diversi**. Il *layout* di `.top` lo decide `dw-app-ui`
(`display:flex; align-items:center`); lo *stile* di `.top .sub` lo decide
`dw-app-shell`, che quella barra la pensava come un **blocco** — titolo sopra,
sottotitolo sotto.

Risultato: `h1` e `.sub` diventano due voci affiancate di una riga senza regole
di restringimento. Finché il titolo è corto ci stanno; quando è lungo il secondo
esce dallo schermo. È esattamente ciò che è successo all'amministrazione —
**441 px di contenuto in 390** — e che a `profilo.html` non succede solo perché
«PROFILO» è una parola corta.

## Chi carica che cosa (e perché conta)

| pagina | fogli |
|---|---|
| le sei app + `admin.html` + `_collaudo-grafici` | style + **shell + ui** |
| `profilo.html` | style + **shell** (senza ui) |
| `genesi.html` | **ui** soltanto |
| `deepwork-id/index.html`, `non-autorizzato.html`, `apps/index.html` | **style** soltanto |

Tre combinazioni diverse su undici pagine. Ed è la ragione per cui una
correzione «ovvia» può peggiorare le cose: portando `admin.html` alla struttura
del core ho provato ad applicarla anche a `profilo.html`, e lì `.top-brand`,
`.logo-sm` e `.role-sm` **non esistono** — quella pagina `dw-app-ui.css` non lo
carica. Il titolo è rimasto senza stile, e l'ho ripristinata.

## ⛔ Misurato dopo: il piano migliore non è togliere regole, è non caricarle insieme

*(01/08, seconda misura. La prima proposta — «togliere da shell i 38 ridefiniti»
— era la più ovvia, non la migliore.)*

Ritagliata la barra alta di **tutte e nove** le pagine che ne hanno una, sul tag
di chiusura vero, e cercato chi usa davvero i cinque superstiti:

| superstite | chi lo usa |
|---|---|
| `.top .sub` | **solo `profilo.html`** |
| `.top h1 .accent` | **solo `profilo.html`** |
| `.kpi.accent`, `.kpi.accent .n` | **solo Flotta** (`class="kpi accent"`, 3 punti) |
| `.item:active` | tutte le pagine con `.item` |

Le sei app, `admin.html` e `_collaudo-grafici` usano già **la struttura del
core** (`.top-brand`). L'unica pagina rimasta indietro è `profilo.html` — che è
anche l'unica a caricare shell **senza** ui.

Da qui il piano vero, che risolve il conflitto **senza riscrivere una regola**:

1. spostare in `dw-app-ui.css` i superstiti che servono alle pagine che
   caricano ui: `.item:active` (tutte) e `.kpi.accent` + `.kpi.accent .n`
   (Flotta);
2. **togliere il `<link>` a `dw-app-shell.css`** dalle sette pagine che caricano
   entrambi;
3. `dw-app-shell.css` resta il foglio **di `profilo.html`**, con i suoi
   `.top .sub` e `.top h1 .accent` — che lì sono giusti, perché lì la barra è
   davvero un blocco.

Effetto: i **38 doppioni spariscono** senza toccare il contenuto delle regole, e
il conflitto della barra alta non può più presentarsi, perché **nessuna pagina
carica più i due fogli insieme**. La regola nuova di `run-stile.mjs` costringerà
ad accorciare l'elenco dichiarato: è il suo secondo verso, e serve proprio a
questo.

⚠️ Da rimisurare comunque, pagina per pagina: le sette perdono 43 regole di
shell, e 38 erano già coperte da ui — ma le altre 5 no. Prima di committare:
`fuori-schermo` e `contrasto` alle due larghezze, e scatti prima/dopo.

## ⛔ Terza misura: «cinque superstiti» era sbagliato, ed erano otto

*(01/08, dopo aver tolto il `<link>` e prima di committare.)*

Il conto dei superstiti qui sopra è costruito sui **nomi dei selettori**: un
selettore che compare in tutt'e due i fogli è «ridefinito», quindi morto.
**È falso**, ed è lo stesso errore che mi aveva fatto perdere `display:none` su
`.page`: due regole con lo stesso nome possono portare **proprietà diverse**, e
quella che ui non ridichiara resta viva.

Rifatta la misura sulle **dichiarazioni** — per ogni proprietà scritta da shell,
ui la riscrive? — con un lettore che conta la profondità delle graffe (il primo
tentativo, a espressione regolare, leggeva **20 regole su 41**, perché non
entrava nei blocchi di `@media`, e non se ne accorgeva: per questo lo script
stampa quante regole ha letto).

Risultato: **2 selettori assenti e 18 proprietà non ridichiarate.** Delle 18,
tre categorie:

| perdita | verdetto | perché |
|---|---|---|
| `.top h1` (margin, font-size, letter-spacing), `.top h1 .accent`, `.top .sub` | **morta** | nelle sette pagine non c'è nessun `<h1>` né `.sub` dentro `.top` (gli `<h1>` trovati stanno nei modelli di **stampa**) |
| `.kpi.ok/.warn/.danger .n` → `color` | **morta** | ui scrive `-webkit-text-fill-color:transparent` su `.kpi .n` per il gradiente: il `color` di shell era già invisibile |
| tutte le `.nav*` (border-top, padding-bottom, flex, position, font-size, margin-bottom, right, box-shadow) | **correzione** | ui disegna la barra **del core** (pillola sospesa, icone svg, `--nav-cols`); quelle di shell erano il residuo della barra piatta e la contaminavano. È la stessa cosa vista negli scatti: l'etichetta passa da 11px a **9px/700, identica a `.bn span` del core** |
| `.kpi:hover` → `border-color` | **lasciata cadere, dichiarata** | il core **non ha** un hover sulle sue `.kpi-card`: ui ne ha uno suo (sollevamento + alone `::after`), coerente e completo. La tinta del bordo arrivava da shell per caso |
| ⛔ `.item` → `cursor` | **PERDITA VERA** | il core scrive `cursor:pointer` su `.sitem`; ui non lo scriveva, lo metteva shell |
| ⛔ `.arr` → `color`, `font-size` | **PERDITA VERA** | il core scrive `.sarr{color:var(--muted);font-size:18px}`; ui ha solo il posizionamento e le regole per l'`svg`, ma nelle sei app `.arr` contiene il **carattere** `›` (52 volte). Senza shell il chevron eredita il colore del testo e la misura di serie: **più acceso e più piccolo** di quanto deve essere |

Le due perdite vere sono state riportate in `dw-app-ui.css` **prima** del commit,
con la stessa forma delle altre tre (`.item:active`, `.kpi.accent`,
`.kpi.accent .n`): la dichiarazione va dove sta il foglio che la pagina carica.

📌 E resta una differenza col riferimento che questa misura ha fatto emergere,
**non** creata da E0: il core dà al chevron anche `padding:4px 8px`, le app no.
Non l'ho aggiunta qui perché avrebbe mescolato un ripristino («identico a
prima», verificabile) con un miglioramento («identico al core», che sposta il
disegno): sono due unità diverse, e insieme non si distinguono negli scatti.

## Quarta misura: quanto pesano davvero, lette dal browser

Le due dichiarazioni rimesse sono state poi misurate **calcolate**, non lette
nel foglio — 408 chevron e 433 righe su sette pagine a 390 px:

| app | `.arr` | `.item` |
|---|---|---|
| campo | **18px** (la prende da `ui`) | pointer |
| conti | 16px | pointer |
| flotta · scudo · sentinella · terra | 15px | pointer |

Cioè: **tutte e sei le app dichiarano `.arr` per conto proprio**, e quattro ci
mettono anche `font-size:15px`. Il foglio condiviso decide solo dove l'app tace:
**campo** (che non scrive la misura) sarebbe scesa in silenzio da 18 a 16 px, e
**conti** resta a 16 perché il suo reset scrive `font:inherit`, che vince
sull'`ui` per ordine di cascata. Quindi il ripristino serve a una pagina — e a
quella serve davvero. È il valore di una riga in `shared/`: non cambia niente
dove qualcuno ha già deciso, e tiene su chi non ha deciso.

⚠️ **E una cosa trovata per strada, che non è di E0 ma va scritta.** `conti` e
`sentinella` non scrivono `.item{cursor:pointer}`: scrivono `.item.tap` e
`.item.cliccabile`, cioè hanno deciso che la manina la meritano **solo le righe
che si toccano**. Quella decisione **non ha mai funzionato**: `dw-app-shell.css`
metteva `cursor:pointer` su tutte le `.item`, e le due classi erano già vere.
Il ripristino in `ui` **conserva** il comportamento di prima (E0 non deve
cambiare un pixel), quindi il difetto resta esattamente com'era — ma adesso è
misurato invece che invisibile, ed è un'unità a sé: o le due app tolgono le
classi perché non servono, o il foglio condiviso smette di decidere per loro.

## Passo 3, fatto: shell ridotto a quello che `profilo.html` usa davvero

*(01/08, subito dopo. Il foglio serviva una pagina sola e ne portava 41 regole.)*

Quali di quelle 41 trovano un elemento in `profilo.html`? Misurato in **due
modi indipendenti che si confermano a vicenda** — le classi citate nel sorgente,
e `querySelectorAll` **dentro il browser a pagina costruita**, perché
`profilo.html` disegna righe, avatar e badge da JavaScript e un censimento
statico non li vedrebbe. Le due misure danno lo stesso numero:

> **23 selettori trovano qualcosa, 18 non trovano niente.**

I 18: tutta la barra in basso (`.nav*`), tutti i KPI (`.kpis`, `.kpi*`),
`.tour-banner`, `.badge.danger`, e il bottone «Esci» (`.dw-exit`,
`body.has-exit .top h1`) — che in questa pagina non compare mai, perché
`mountExit` la chiamano soltanto le sei app. Tolte.

Verifica: `profilo.html` rifotografata a **390 e 360 px**, prima e dopo →
**0 pixel diversi su 429.000 e 410.400**. Controprova, perché uno zero va messo
alla prova: tolta anche `.avatar`, che la pagina **usa** (−313 caratteri) → la
pagina cambia subito (alta 1100 → 1079, la riga da 62 a 55 px). La misura sa
distinguere una regola morta da una viva.

Effetto sui due controlli, che è il loro secondo verso al lavoro:
**doppioni 50 → 32**, **divergenze dichiarate 12 → 3**. E le tre che restano
sono esattamente quelle che devono restare: `.top h1`, `.top h1 .accent` e
`.top .sub`, cioè la barra alta **a blocco** di `profilo.html` — la differenza
che aveva causato tutto, adesso isolata in un foglio che nessun'altra pagina
carica.

⛔ **E una soglia mia, sbagliata, presa in faccia.** La regola 23 conteneva
`ok(shell.size > 30, "la lettura non sta guardando niente")`: voleva dire «ho
letto il foglio» e diceva «il foglio è grande». Sceso shell a 23 regole *per il
motivo giusto*, la guardia ha gridato al guasto. È la lezione di `CLAUDE.md`
sulle soglie su valori che si muovono, applicata al file che quella lezione la
fa rispettare. Adesso controlla che i due file **si leggano** e abbiano regole.

📌 Resta dichiarato, non fatto: `body.dw{padding-bottom:calc(64px + …)}` riserva
spazio per la barra in basso, che `profilo.html` **non ha** — misurati, sono
64 px di vuoto sotto l'ultimo elemento (a 390 px la pagina è alta 1100, l'ultima
cosa finisce a 1036). Non tolto qui perché questa unità doveva costare **zero
pixel**, e un ritocco vero si misura per conto suo.

## Che cosa farne (prima proposta, superata dalla misura qui sopra)

1. **Togliere da `dw-app-shell.css` i 38 selettori che `dw-app-ui.css`
   ridefinisce.** Sono già senza effetto dove i due convivono; l'unico posto
   dove cambierebbe qualcosa è `profilo.html`, l'unica pagina che carica shell
   **senza** ui. Va fatto insieme al punto 2.
2. **Decidere che cosa carica `profilo.html`.** O passa a `shell + ui` come le
   sue sorelle — e allora va rimisurata, perché il commento in `admin.html`
   racconta che aggiungere `ui` a una pagina nata senza **le cambia l'impianto**
   (una riga da 74 a 115 px, la pagina da 802 a 992, e a 390 px comparve lo
   scroll orizzontale) — oppure resta com'è e si dichiara.
3. **I cinque superstiti trovano una casa sola.** `.top .sub` in particolare non
   deve stare in un foglio che disegna una barra a blocchi mentre un altro la
   disegna a riga: o la barra è una sola struttura (`.top-brand` del core, come
   nelle sei app) o le regole si contraddicono a ogni parola lunga.
4. **Un controllo che lo tenga fermo.** Oggi nessuna prova si accorge che due
   fogli condivisi definiscono lo stesso selettore. La forma è quella già usata
   da `nomi-doppi.mjs` per le funzioni: o è la **stessa** regola, o la
   differenza va **dichiarata con la ragione**.

⚠️ **Nessuno di questi passi va fatto a occhio.** Ogni pagina che cambia foglio
va rimisurata con `fuori-schermo` e `contrasto` alle due larghezze del banco:
il difetto di oggi era invisibile da lontano e si vede solo aprendo la pagina a
390 px.

## Come rifare la misura

`node` sui tre fogli, senza rete: si tolgono i commenti, si prendono i selettori
di primo livello e si incrociano. Lo script sta nello scratchpad di questa
unità; se serve stabilmente, il posto giusto è una regola di `run-stile.mjs`
(punto 4).
