# Checkpoint — 2026-08-07T23:56:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`457fee6` — *nomi-liberi: la seconda domanda — il nome esiste, ma esiste QUI?*

## Che cosa è stato completato

Chiuso il rimandato aperto un'ora prima, e nato da un difetto vero: il bottone
«Scarica rilievi» di Terra chiamava `conta(...)` mai importata, e
`nomi-liberi.mjs` — il controllo che esiste **apposta** per quella famiglia —
rispondeva «nessun nome che non esiste» su 18.656 chiamate.

**La causa.** L'insieme dei nomi legati è **unico per file**. Nella stessa
pagina c'è un `const conta = …` **locale a un'altra funzione**, e quello bastava
a spegnere il controllo su quel nome: guardava il **FILE**, non lo **SCOPE**.
Un omonimo qualunque, dichiarato ovunque, rendeva invisibile un nome libero.

**La cura, che non è «più severità».** Una **seconda domanda** accanto alla
prima, non al posto suo: la prima continua a rispondere «non esiste da nessuna
parte», questa risponde «esiste, **ma non qui**». Giudica per blocchi di
graffe: la dichiarazione deve stare in un blocco che **racchiude** la chiamata.

## ⚠️ Il costo misurato PRIMA di irrigidire, e i due righelli storti

La regola del 07/08 pretende di stringere su una copia e **contare gli allarmi
nuovi**. Fatto, e il conto ha diretto il lavoro:

| stesura | allarmi sull'albero sano | verdetto |
|---|---|---|
| dichiarazioni con una regex | **2** (`gx` in Genesi) | `const N=60, gx=(i)=>…`: perdeva il secondo dichiaratore |
| blocco ancorato al dichiaratore | **11** (`jsPDF` ×8, `reopen` ×3) | `const {jsPDF}=window.jspdf`: prendeva la graffa della **destrutturazione** per il blocco |
| ancora sulla parola `const` + scandaglio di `nomiDichiarati` | **0** su 18.656 chiamate, 12 pagine | e col difetto rimesso: **1, quello giusto** |

⛔ **Cioè nessuno dei tredici falsi allarmi veniva dalla domanda: venivano tutti
dal righello.** È la stessa lezione del 06/08 sulle modali («quando una misura
non torna, il sospettato più facile è il soggetto — ed è quasi sempre il
righello»), e stavolta si è vista **due volte di fila nello stesso pomeriggio**.

## E un argomento invece di una copia

La seconda domanda ha bisogno dei nomi legati **in ogni modo TRANNE**
`const/let/var` (quelli li giudica lei, guardando lo scope). `nomiLegati` ha
guadagnato un parametro: ricopiarne il corpo accanto sarebbe stata la solita
divergenza rimandata.
⚠️ E nello stesso passaggio è saltato fuori che una delle sue regex ne teneva
**due in una**: `nome: (` è sempre una **proprietà**, `nome = (` combacia anche
con `const conta = (R.a + R.b)`. Divise — con quella unita la controprova
restava **verde col difetto dentro**, che è il modo in cui una prova finisce a
non provare niente.

## Limiti dichiarati, non sottintesi

Lo scope è giudicato **per graffe**, non da un analizzatore vero: non distingue
una funzione da un `if` e non conosce l'hoisting di `var`. Sbaglia quindi **per
eccesso di prudenza** — un `var` usato prima del suo blocco non viene accusato
— e mai accusando chi è sano. Scritto nell'intestazione del file, col numero
che lo sostiene.

## Prove

`nomi-liberi` **7 → 10** prove (non è fra le sei suite che contano asserzioni,
quindi i conti dei documenti non si muovono). Giro `node`: **23 comandi, 0
caduti**, sulla copia di quello che si committava.
Controprova della seconda domanda: rimesso il difetto vero di Terra, pretende
**tre** cose in fila — che la **prima** domanda resti cieca (se un giorno lo
vedesse, il racconto è invecchiato e va riscritto, non spento), che la
**seconda** lo veda, e che sulla pagina **sana** non accusi nessuno.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre trenta commit fa, quindi il suo verde non riguarda quello
che c'è adesso. Ordine: prima le righe **«non ho guardato»** (denominatori,
superfici non raggiunte, «0 su N»), poi i KO, distinguendo le **controprove**,
dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

- ⏱️ **Scudo · verbale DPI**: «Consegnato il» scriverebbe «—» su una data
  assente, mentre la colonna accanto è stata corretta il 03/08 per esattamente
  questo. Proposto da un cantiere, **non ancora verificato da me**.
- ⏱️ **La stessa seconda domanda sui MODULI**: oggi `fuoriScope` gira solo
  sulle **pagine**. Nei moduli il difetto è peggiore (esplode quando quella
  riga viene eseguita, magari in un ramo che le prove non toccano), e il codice
  per farlo c'è già — manca il giro sui 18 moduli e la misura dei falsi
  allarmi, che va fatta prima, non dopo.

## Blocchi
Nessuno.
