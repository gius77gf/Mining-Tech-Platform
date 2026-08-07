# Checkpoint — 2026-08-07 20:5x UTC

## Tipo
unit-complete (i decimali col punto nel core: `perLettura` in `shared/`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3776a30` — *Il core scriveva i decimali col punto accanto a date italiane*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 199 | **`perLettura` e i 17 punti del core** (`3776a30`) | prove **2.298 → 2.299** (16 asserzioni nuove) |

## ⛔ Misurato aprendo, non censendo il codice
32 schermate su 32, leggendo il **testo visibile**: **undici** numeri col punto
decimale — «1071.0 mc», «3466.1», «2261.7 mc», «787.5 mc» — accanto a date
scritte all'italiana («28/07/2026»). Un censimento del codice avrebbe contato
anche i `12.5` dentro id, classi e commenti, che nessuno vede mai.
⚠️ E il conto è cambiato **col denominatore**: sulle 22 schermate elencate a
mano erano **4**, su tutte e 32 sono **11**. L'elenco a mano si accorcia da
solo — adesso è derivato dal file.

## ⛔ E la convenzione voluta era già scritta, nel PDF
`ms.mediaProf.toFixed(2).replace('.',',')`: la stessa regola, fatta a mano, in
un posto solo. Il classico di questa casa — la regola giusta esiste e chi
scriveva lo schermo se n'è tenuta una versione più debole.

## ⛔ Cercata in casa prima di scriverla
`perCampo` c'era, ma serve i **campi** (dentro un campo il punto delle migliaia
NON va: rientrerebbe ambiguo dal lettore). Il formattatore **da lettura**
mancava in `shared/` ed era già scritto **due volte fuori** — `campo-data.js` e
`flotta-data.js`, ognuna col suo commento su `useGrouping`. Ora `perLettura` è
la gemella di `perCampo`, e le due si spiegano a vicenda.

## ⛔ `useGrouping` esplicito, e la prova lo giustifica invece di ripeterlo
Al **default** Node non raggruppa i numeri di quattro cifre e Chromium sì: una
prova scritta in Node direbbe una cosa e l'utente ne vedrebbe un'altra. Con
`true` esplicito i due sono d'accordo (**3.466,1**) — ed è per questo che il
numero provato ha proprio quattro cifre.

## ⚠️ Il primo giro ha sbagliato, e l'errore vale più della correzione
Sostituendo i `toFixed(2)`, «Media prof. 3.00 m» è diventata «3 m» e il
riquadro accanto è rimasto «9.0»: cambiando il **separatore** avevo cambiato
anche il numero di **cifre**, e per giunta in un posto solo. Le cifre allineate
sono una scelta dello stile del core. Da lì l'argomento **`fisse`**: dove c'era
`toFixed(n)` si scrive `perLettura(v, n, true)` e si cambia il separatore e
**nient'altro**. Un argomento in più invece di una seconda funzione.

## ⚠️ Tre volte le controprove sono invecchiate MENTRE lavoravo
I pezzi da rimettere citano il codice, e il codice cambiava sotto. Le ha prese
tutt'e tre il conto **«difetti rimessi: N su N»** — la ragione per cui esiste.
E una era già invecchiata **prima** di stasera (`rappRiga` era passata a
`conta(...)`), verificato su `HEAD` per non attribuirmi un guasto non mio.

## ⚠️ E i documenti li ha corretti il controllo, non la memoria
`STATO_PRODOTTO.md` diceva 2.299 con addendi che facevano 2.298: due numeri
che si contraddicono **nella stessa riga**.

## Stato delle prove
Prove **2.299** (`run-kpi` **1884**), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava. Larghezze rimisurate: i numeri italiani sono più
lunghi e l'unico traboccamento a 320px resta quello già dichiarato (197/194).

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **160 sezioni**.
⚠️ Gira su un commit vecchio di **quindici**.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»,
   poi i KO, distinguendo le controprove. Poi **rilanciarlo sul commit
   corrente** — quello vecchio non copre quindici commit.
2. ⏱️ **Le due copie del formattatore**: `campo-data.js` e `flotta-data.js`
   hanno ancora la loro. Diventare **alias** di `perLettura` è l'unità dopo, e
   va fatta col test di **identità** (`campo.X === shell.perLettura`), non
   riscrivendole una terza volta. **Dichiarata, non fatta.**
3. ⏱️ **E le altre app scrivono i numeri all'italiana?** Il core l'ho misurato;
   le sei app **no**. Stessa sonda, stesso metodo. **Non misurato.**
4. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
