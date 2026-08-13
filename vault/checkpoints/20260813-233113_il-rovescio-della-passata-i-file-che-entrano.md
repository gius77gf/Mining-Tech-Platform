# Checkpoint — 2026-08-13 23:31 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `e008d8a4` — Sentinella: un documento vero che rispondeva a un'altra domanda
- `3c783ce7` — la ricerca sul mestiere della cava
- `c93c6078` — le righe che l'import cancellava adesso si vedono

## Che cosa è stato completato

**1. Sentinella — B4-ter.** La forma del difetto è **nuova** e vale più
dell'unità: non un numero falso, ma **un documento vero che risponde a un'altra
domanda**. Lo scadenzario sapeva *quando* va consegnato un adempimento, il Report
faceva **digitare** «dal» e «al», e fra le due cose non c'era niente — quindi il
periodo lo indovinava chi premeva il bottone, e **due date scritte a mano non
sono smentite da niente**.
⛔ `PERIODICITA` non si poteva riusare: conta i **giorni** con cui si *misura* un
punto, non i **mesi di calendario** che un documento copre. E il termine di
consegna **non ha un ripiego**: dedurre zero sposta tutto il periodo in avanti —
sulla relazione annuale il vero è `01/01→31/12/2025`, con lo zero dedotto sarebbe
`01/05/2025→30/04/2026`, cioè **un documento vero su un altro anno**.

**2. B5 — il rovescio della passata: i file che ENTRANO.** Nove lettori CSV
guardati, **nove difettosi**, e non è un `.filter` scritto male: è
**strutturale**, il filtro sta dentro il lettore. Righe scritte → entrate:
fatture **6→1**, rilievi **6→1**, incassi **5→1**, telemetria **5→1**, listino
**4→1**. Il peggiore è Conti: una riga persa è un **credito** che non entra
nell'aging né nei solleciti, e il totale a schermo è più basso del vero.
✅ E quello che è **sano** non dichiara niente — compresa la riga di coda `;;;`
che un foglio di calcolo salva da sé: contarla vorrebbe dire **accusare l'utente
di un difetto del suo Excel**.

**3. La ricerca sul mestiere della cava**, con 40 fonti: **cinque «c'è» per ogni
«assente»**. E sulla domanda della settimana, una risposta che non ci si
aspettava: nessuna fonte prescrive un *segno* per il dato non misurato, ma
l'art. 10 del 624/96 pretende una **dichiarazione positiva** — il bianco non è
previsto. Il principio di casa è già in legge, **con una cosa in più che da noi
manca: l'assenza dichiarata ha un autore, e in cava è nominato per turno.**

## ⚠️ Il metodo, e la seconda volta che la copia ha pagato l'affitto
`run-kpi.mjs` è conteso da quattro cantieri. Ogni unità si committa costruendo
l'indice **da HEAD più il solo blocco di quell'unità** (`hash-object -w` +
`update-index --cacheinfo`), senza toccare il disco. Stanotte la copia ha fermato
**due** commit rotti: un `import` definito altrove, e **undici prove rosse**
perché un altro cantiere aveva scritto il suo blocco fra il `git add` e la
verifica — prove che chiamano una funzione che non stavo committando. È alla
lettera l'`import { daCampo }` di `CLAUDE.md`.

## Le misure, sulla copia di quello che si committa
`run-kpi` **2182**, 0 falliti · copertura app **741/741** · condivisi 171/171 ·
giro `node` **2.973** asserzioni, **34 comandi a posto, 0 caduti** ·
`iniezioni-fresche` **376/376** · 198 esecuzioni di banco. Quattro documenti
allineati, e la riga di `CONCORRENTI_SENTINELLA.md` che aveva proposto il lavoro
è stata aggiornata: il verdetto regge, a scadere è la sua **prova**.

## Che cos'è vivo adesso
- **Cantiere sul core** (B0-duovicies + l'arretrato del ramo touch).
- **Cantiere su Genesi** (B0-tervicies, la spalla assente): le sue prove sono
  già sul disco, non ancora consegnate.
- **Il giro del browser è spento**, con la ragione scritta: girava da 3h52 su un
  commit da cui il ramo si era mosso di oltre trenta, e i suoi primi KO erano
  contrasti chiusi cinque ore prima.

## Prossimo passo atomico
Raccogliere i due cantieri rimasti — **un commit per unità**, indice costruito da
HEAD — e poi **rilanciare il giro del browser** su uno stato fermo, che è la sola
verifica che manca a tutto il lavoro di stanotte. Restano da fare, dichiarati con
la misura: i **quattro** lettori CSV in forma mite di Campo/Conti/Flotta/Terra, i
**sei** di Scudo e Sentinella, e il motore di `frasePersi` scritto quattro volte
che va in `shared/dw-app-ui.js`.

## Blocchi
- **Force-with-lease sul ramo**: la storia va ancora riscritta. La CI però **non
  è più rossa**: il percorso mal datato è un'eccezione dichiarata per nome e
  sorvegliata da una prova che cade il giorno in cui la storia viene riscritta.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
