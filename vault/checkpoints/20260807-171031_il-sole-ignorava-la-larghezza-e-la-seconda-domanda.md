# Checkpoint — 2026-08-07 17:10:31 UTC

## Tipo
unit-complete (tre unità in un commit: la barra nei tre temi, la forbice del
righello non-testo, le sette decisioni prese dal ciclo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`63ab684` — *Il tema del sole ignorava la larghezza: tre app tagliate, e la
domanda che una barra con `overflow:hidden` non poteva sentirsi fare*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 177 | **la barra nei tre temi** | 164 etichette × 3 temi, **0 fuori posto e 0 tagliate**; controprova 13 e 31 |
| 178 | **la forbice del righello WCAG 1.4.11** | 933 accoppiamenti, **0 verdetti che cambiano** → geometria rimandata col numero |
| 179 | **le sette decisioni verdi da scrivere** | 7 prese dal ciclo, **8 lasciate aperte** perché vogliono un cantiere |

## ⛔ La seconda domanda ha trovato più della prima, di nuovo
Il cantiere della barra è morto col riavvio del contenitore lasciando solo il
banco insegnato ai tre temi. Raccolto quello, la correzione ha preso una forma
più grande del previsto, e la parte che vale è **perché**:
- la causa non era in Flotta né in Terra: è in `shared/dw-app-ui.css`, dove
  `body.dw.outdoor-mode .nav button{font-size:11px}` sta **fuori da ogni
  `@media`** e con specificità (0,3,2) batte i gradini `.nav button` (0,1,1)
  **di qualunque foglio**, compresi quelli che un'app si è misurata addosso;
- il banco chiedeva *il contenuto della barra ci sta nella barra?*, che con
  `overflow:hidden` sul **bottone** non può **mai** rispondere di no. Sotto,
  Conti tagliava **8 etichette su 10 a 430 px e 10 a 320**, a ogni larghezza,
  e il banco lo assolveva. La scala che Conti si era misurata con cura era
  vera **solo al buio**.

## ⚠️ E il righello ha sbagliato due volte, tutt'e due riconosciute dal segno
1. `!important` in un `<style>` appeso in fondo uccideva le scale che
   Sentinella, Scudo e Conti hanno già in casa: Scudo «peggiorava» da 273 a
   448 px. La regola candidata va inserita **dentro il foglio dove vivrà**
   (`insertRule` su `dw-app-ui.css`), se no si misura un prodotto che non
   esiste.
2. `scrollWidth` sul bottone conta la **pastiglia `::before` dell'attivo**:
   Scudo accusato con «40 su 37» mentre la parola ne chiede **30,5** — e
   sempre sulla **prima voce**, in più app. Un difetto identico dappertutto è
   il modo in cui si riconosce di stare guardando il righello.

## ⛔ Il segno che il disegno condiviso è sbagliato: TRE app riscrivono la stessa scala
Sentinella, Scudo e adesso Conti hanno dovuto ridire la propria scala della
barra sotto `outdoor-mode` per riavere il proprio lavoro. Un tema dovrebbe
**scalare** una misura, non **fissarla**. Dichiarato nel codice e in CLAUDE.md,
**non risolto**: è un cantiere suo.

## ⚠️ Una mia previsione smentita dalla misura, e va scritta
Il checkpoint precedente dava `contrasto-non-testo.mjs` come «il prossimo
cantiere naturale», perché accoppia le fermate a tappeto come faceva
`contrasto.mjs` prima del 07/08. **Misurato: 933 accoppiamenti, 54 con un
vicino a più fermate, forbice peggiore 1,40, ZERO verdetti che cambiano** —
contro i 63 casi con forbice ≥4 che sui testi rendevano il righello sbagliato
davvero. Portare la geometria sarebbe stato lavoro su un difetto che non morde.
Fatto invece quello che regge: il righello **dichiara l'ampiezza del proprio
dubbio** a ogni giro, così il giorno che quel numero sale si vede.

## Le sette decisioni, e le otto che NON sono state spuntate
Prese dal ciclo (regola del 01/08, dichiarate nel commit): **6, 8, 10c, 11a,
11b, 11c, 12b** — tutte decisioni che si applicano **scrivendole**.
⛔ Le otto verdi che vogliono un cantiere (**5a, 5b, 10a, 10b, 12a, 15, 18a,
18b**) restano `[ ]`: la risposta c'è, ma spuntarle senza averle costruite
sarebbe la faccia tranquilla su un lavoro non fatto. Per la **5b** la prima
unità resta la **misura** (due persone che scrivono la stessa riga), non la
funzione.
⚠️ Barrare le sette le aveva fatte **sparire** dal controllo sui documenti —
stessa famiglia del valore che si nasconde dietro un nome. Il controllo adesso
ammette il `~~`, e la ragione è scritta accanto.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**, verificato sulla copia di quello che si
committa. Banchi **138 → 141**. Copertura **688/688**.

## Che cosa sta girando adesso
Niente: il riavvio del contenitore ha ucciso i cantieri e le loro copie sono
state potate. L'albero è pulito.

## Prossimo passo atomico
1. ⛔ **Le due code di Scudo**, ferme da due checkpoint: la prova della modale
   (21 prove) vive **in scratchpad** e va portata in `tests/browser/` **con la
   registrazione in `tutti.mjs`** — alla sessione dopo, uno scratchpad non
   esiste; e il contrasto di Scudo è misurato **solo nel tema buio**.
2. **Le otto decisioni verdi che vogliono un cantiere**, in ordine di quanto
   costa sbagliarle: **10b** (chi può cancellare — resa urgente dalla 10c
   appena presa), **5a** (il messaggio del salvataggio non riuscito), **15**
   (dove vive «Il Quadro»), poi le altre.
3. ⛔ **Il tema che scala invece di fissare**: la causa dietro le tre app che
   riscrivono la stessa scala. È un cantiere su `shared/`, quindi si serializza.

## Code aperte, dichiarate
- Il giro completo dei banchi non è stato rifatto dopo questo commit: le tre
  passate nuove sono state provate a mano, una per una, sulla copia.
- «Adempimenti» governa il minimo della barra di Sentinella a 320 px
  (bersagli 41,4): decisione di prodotto, non presa.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
