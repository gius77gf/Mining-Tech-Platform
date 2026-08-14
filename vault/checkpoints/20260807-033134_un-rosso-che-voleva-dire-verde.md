# Checkpoint — 2026-08-07 03:31:34 UTC

## Tipo
unit-complete (due unità: il refuso `ords`, e la controprova che si leggeva come
un guasto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ba8ede8` — *Un rosso che voleva dire verde: la controprova stampava la stessa
frase della passata sana, e ci sono cascato io*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 112 | **il refuso `ords`** (`9c5e3c1`) | `display:block` invece di `flex`, gap **normal** invece di 8px |
| 113 | **la controprova che ingannava** (`ba8ede8`) | `e5b1405^` **36/0**, `e5b1405` **36/0** — i 10 KO non esistevano |

## ⛔ L'errore è mio, e vale scritto per intero
Leggendo il registro del giro completo ho visto `Risultato messaggio del ripiego:
26 passati, 10 falliti` e ho aperto un cantiere su **dieci difetti che non
esistevano**. Erano la **controprova**, cioè il rosso voluto — e nello stesso
registro, centosessanta righe più su, la passata sana diceva `36 passati, 0
falliti` **con la stessa identica frase**.

    riga  84   Risultato messaggio del ripiego: 36 passati, 0 falliti   ← sana
    riga 246   Risultato messaggio del ripiego: 26 passati, 10 falliti  ← controprova

⚠️ E anche la mia **spiegazione** era sbagliata: avevo dato la colpa a
`SEZIONI_CORE` allargato da 17 a 26 schermate. Quel banco non importa
`SEZIONI_CORE` e non chiama né `sezioniDi` né `vaiA`. Ipotesi ragionevole,
smentita dalla misura sulle due worktree.

## ⛔ MA SOTTO C'ERA UN DIFETTO VERO, PIÙ GRAVE DI QUELLO CHE CERCAVO
La controprova si accontentava di `falliti > 0`. Avrebbe stampato «il banco SA
fallire» **anche se a cadere fosse stata l'asserzione «il programma del core è
partito davvero»** — cioè col banco rotto e il rilevatore mai messo alla prova.
È la quarta delle cinque cause di CLAUDE.md letta al contrario: non l'iniezione
puntata nel posto sbagliato, ma la **verifica che non guarda dove cade**.

Adesso la controprova guarda **quali** asserzioni cadono: almeno una, **zero**
sulla struttura del banco, e **ogni caso** morso dall'iniezione, se no dichiara
`PARZIALE`. Provata su tre difetti rimessi e tutt'e tre diagnosticati giusti —
prima della correzione il secondo sarebbe uscito **verde**.
La stessa trappola cercata negli altri quattro banchi con quella forma: ce
l'aveva solo `core-date-illeggibili.mjs`, corretto allo stesso modo.

## ⚠️ E il refuso che non fa rumore
`class="ords"` — con la esse — su tre filtri di Scudo. La classe non esiste, e il
refuso di una classe non produce **niente da leggere**: nessun errore, nessuna
prova rossa. Misurato: `display:block`, `gap: normal`, `margin-bottom: 0` contro
`flex`, `gap:8px`, `10px` di ogni altra fila dell'ecosistema.
⚠️ E lo strumento aveva sbagliato prima di rispondere giusto: contava
`class="fld"` scritto **dentro un commento** come un uso — lo stesso difetto
trovato stanotte in un altro controllo. Va corretto **prima** che il censimento
entri nelle prove. Orfane vere: **15 su 1.156** classi.

## Stato delle prove
Prove `node` **2.196**, copertura **662/662**, banchi **122**. Giro `node` 21
comandi, 0 caduti sulla copia di ogni commit.

## Che cosa sta girando adesso
1. **Il giro completo del browser** su una copia di `e5b1405` — otto banchi in,
   **nessun rosso nelle passate sane**. Una guardia avvisa quando finisce e
   separa le passate sane dalle controprove.
2. **Un cantiere** sul traboccamento **all'indietro** a 320 px nel core (il
   documento va a 333 px e nessun elemento sporge a destra).

## Prossimo passo atomico
1. **Leggere il giro completo quando finisce**, separando le passate sane dalle
   controprove — che adesso si distinguono, ed è il motivo per cui questa unità
   esiste.
2. **Raccogliere il cantiere del 320 px**: un banco registrato che fallisce rende
   rosso il giro di tutti.
3. **Correggere il censimento delle classi orfane** (i commenti non sono usi) e
   **portarlo nelle prove** con le 15 eccezioni dichiarate una per una.
4. **Ad albero fermo**: la correzione del motore dei grafici col suo banco, e il
   **pieno senza spesa** nei dati d'esempio di Flotta.
5. **`unita-maiuscole` guarda le maiuscole**: ignorandole escono 15 casi in più,
   **4 falsi allarmi** (`DB`, `H`) e **11 veri, tutti nel core**. Decisione col
   numero già in mano.
6. ⚠️ **Le 19 decisioni**: «entro venerdì 07/08» vuol dire **a fine giornata**.
   Si applicano solo se a fine giornata non è arrivata risposta, dichiarandolo
   nel commit.

## Code aperte, dichiarate
- Il KO del **320 px**, affidato a un cantiere.
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D — decisione, non copia debole.
- **Conti**: `.meta.pesa` taglia 15 px su 1 riga DDT su 5.
- **Scudo**: le tre copie di `.fld`/`.fcamp` divergono sul `gap` (Terra ne ha 53).
- Il **minimo di visibilità** dei grafici e `#ppv-scelta` di Sentinella.

## Blocchi
Nessuno.
