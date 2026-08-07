# Checkpoint — 2026-08-07 20:29 UTC

## Tipo
unit-complete (la Dashboard senza rete: tre riquadri vuoti che non dicevano perché)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4ee8f4e` — *La Dashboard lasciava tre riquadri vuoti che non dicevano perche'*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 197 | **la Dashboard senza rete** (`4ee8f4e`) | banchi **149 → 151**, 14 prove nuove, controprova **6 KO** |

## ⛔ Il principio del fondatore applicato a un DISEGNO invece che a un numero
**Un riquadro vuoto non dice «non c'è niente»: non dice niente.** I quattro KPI
erano scritti giusti — «5 rapportini · 3466 mc · 3 operatori · 2 rapp. fochino»
— e sotto stavano **tre rettangoli vuoti**: 3 canvas, **0 pixel dipinti**. Da lì
non si può sapere se non ci sono dati, se sta caricando o se il prodotto è rotto.

E non è un caso di laboratorio: **Chart.js arriva da un CDN**, quindi senza rete
quello è lo stato **normale** della schermata — e l'app è fatta per la cava,
cioè per il posto dove il segnale non c'è.

## ⛔ E la parte che conta: era la schermata che NESSUNA prova aveva mai aperto
`nav('dashboard')` sollevava «Chart is not defined», quindi ogni banco che
«guardava il core» la saltava **in silenzio**. È la famiglia dello «0 modali su
68» di CLAUDE.md, un piano più sotto, e come quella non lasciava niente di rosso
da leggere.
⚠️ **L'ha trovata una riga «non ho guardato», letta invece che saltata**: la
sonda che contava i decimali col punto dichiarava «21 schermate su 22 aperte
davvero», e la ventiduesima era questa. È esattamente la regola di CLAUDE.md —
*le righe che dicono «non ho guardato» vanno lette per prime*.

## ⛔ Due cause, e hanno PORTATA diversa
Per questo sono due funzioni e non un `if` solo:
- **«la libreria non è arrivata»** riguarda la **pagina**: un avviso solo per
  tutti e tre. Alla prima stesura la stessa frase da venti parole usciva **tre
  volte di fila**, due in una colonna larga la metà — si leggeva come un guasto
  ripetuto invece che come una cosa sola. Corretto alla **terza iterazione**,
  guardando lo scatto;
- **«non ci sono dati»** riguarda **un** grafico: con un filtro stretto una
  torta può essere vuota e le altre piene. E la torta dei **fochini** quel
  controllo non ce l'aveva affatto — restava vuota **anche con la rete**.

## ⚠️ E l'avviso dichiara che i numeri restano giusti
Se no chi vede sparire i grafici smette di fidarsi anche dei totali, che invece
sono esatti: una libreria di disegno che non arriva non tocca i conti.

## ⚠️ Il caso sano si costruisce servendo un finto `Chart` al posto del CDN
Senza di lui il modo più facile di far passare le prove sarebbe **togliere i
grafici**, che è l'errore opposto. Con la libreria i canvas tornano e si
pretende che siano **dipinti**, misurato in pixel.

## Stato delle prove
Prove **2.298** (`run-kpi` 1883), copertura **702/702**, banchi **151**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **116 sezioni**.
⚠️ Gira su un commit vecchio di **dieci**: non copre niente di stasera.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»
   (stasera hanno fruttato un difetto vero), poi i KO, distinguendo le
   controprove. Poi **rilanciarlo sul commit corrente**, perché quello vecchio
   non copre dieci commit.
2. ⛔ **Le altre librerie da CDN hanno lo stesso problema?** Misurato solo
   Chart.js. `jspdf` e `jspdf-autotable` sono caricate allo stesso modo
   (righe 28-29), e i bottoni «PDF» / «Report tecnico» stanno **in fondo alla
   Dashboard che ho appena guardato**. Da misurare: che cosa succede a premerli
   senza rete. L'Excel la sua difesa ce l'ha già (`_loadScript` + «serve
   connessione»), quindi il modello esiste.
3. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`, si
   serializza.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Il separatore decimale italiano nel core: **4 punti a schermo**, misurati.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
