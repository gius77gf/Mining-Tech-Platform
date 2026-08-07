# Checkpoint — 2026-08-07 20:44 UTC

## Tipo
unit-complete (la guardia del PDF, otto copie che guardavano una libreria su due)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1678fa4` — *La guardia del PDF guardava una libreria su due: otto copie, tutte a meta'*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 198 | **`pdfNonPronto` al posto di otto copie** (`1678fa4`) | banchi **151 → 153**, 12 prove nuove, controprova **3 KO su 8 punti iniettati** |

## ⛔ Il difetto: 8 guardie su una libreria, 0 su undici chiamate all'altra
`if(!window.jspdf){toast('Libreria PDF non caricata')}` era scritto **otto
volte identico**, una per esportazione. Ma tutt'e otto disegnano le tabelle con
`d.autoTable`, che arriva da un **secondo** script: lì i controlli erano
**zero su undici chiamate**.

## ⛔ Ed è una MISURA che ha reso l'unità reale invece che immaginaria
«Una libreria c'è e l'altra no» sembrava un caso di scuola. Non lo è: il
service worker precacha **ogni indirizzo con il proprio `.catch()`**, e il suo
commento dichiara perché — *«per non bloccare se una CDN fallisce»*. Cioè è uno
stato che il disegno permette **apposta**. Senza aver letto quel file avrei
scritto una difesa contro un caso che non succede, o — peggio — non l'avrei
scritta affatto.

Misurato servendo `jspdf` e lasciando cadere il plugin, poi premendo il
bottone: `d.autoTable is not a function`, **zero** PDF e **nessun messaggio**.
Si preme «PDF» e non succede niente — la famiglia del `chiediDati()` di Flotta.

## ⚠️ La domanda è fatta in DUE modi apposta, e la ragione è la direzione
dell'errore
Il plugin si registra su `jsPDF.API.autoTable`, ma qui la libreria vera **non
si può misurare** (in casa non c'è rete). Una guardia troppo stretta
sbaglierebbe nel verso peggiore: bloccherebbe **tutti** i PDF anche quando
funzionano. Quindi si chiede all'API **e** a un documento vero — cioè proprio
`d.autoTable`, ciò che il codice chiama e ciò che si rompe — e si blocca solo
se rispondono di no tutt'e due. **Nel dubbio si lascia passare.**

## ⚠️ Due volte ha sbagliato il righello, non il prodotto
1. il banco premeva tre bottoni di esportazione e **nessuno dei tre** arrivava
   ad `autoTable`: rientravano prima per mancanza di dati, e il difetto
   rispondeva «tutto a posto» — la quinta causa di «non distingue». L'id della
   volata si pesca dall'**elenco vero**;
2. il finto `jsPDF` teneva `API` e il prototipo **separati**, mentre nel jsPDF
   vero `API` **è** il prototipo: il caso «con il plugin» falliva misurando una
   cosa che il prodotto non fa.
⚠️ E scrivendo la correzione ho rifatto il difetto dei commenti: la spiegazione
dentro un template literal, con i backtick veri, ha chiuso la stringa. È in
CLAUDE.md ed è la quarta volta per questa famiglia.

## Stato delle prove
Prove **2.298** (`run-kpi` 1883), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **132 sezioni**.
⚠️ Gira su un commit vecchio di **dodici**: non copre niente di stasera.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»
   — stasera ne è uscita la Dashboard, cioè un difetto vero — poi i KO,
   distinguendo le controprove. Poi **rilanciarlo sul commit corrente**.
2. ⏱️ **Le altre due esportazioni tacevano anche loro**, e non l'ho misurato:
   `exportRapportiniMeseCorrentePDF` e `exportReportTecnicoPDF` rispondevano
   `errore=null, pdf salvati=0` **senza** arrivare ad `autoTable`, cioè
   rientravano prima per un'altra ragione. Va guardato se anche quel rientro
   dice qualcosa all'utente o è un secondo silenzio. **Dichiarato, non
   verificato.**
3. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Il separatore decimale italiano nel core: **4 punti a schermo**, misurati.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
