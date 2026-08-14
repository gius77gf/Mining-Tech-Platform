# Tre difese che nessuno poteva vedere

**Data:** 01/08/2026 · **Area:** `apps/scudo/scudo-data.js` (dimostrazione)
**Unità precedente:** `20260801-064900_il-giro-che-firmava-il-commit-sbagliato.md`

## Il debito, e cosa c'era sotto

Il cantiere di Scudo aveva dichiarato: «le modifiche alla pagina non sono state
guardate a schermo». Cinque righe da fotografare. Lo scatto ne ha trovate
**due**.

Prima di dare la colpa alla pagina, `grep`: tutte e cinque le stringhe ci sono,
e i tab pure. Il difetto non era nel codice — era che **la dimostrazione non
contiene i casi**. Le tre righe mancanti sono ripieghi che si accendono solo su
un dato che non c'è:

| riga | si accende quando | nella dimostrazione |
|---|---|---|
| **Stato non indicato** | `D[d.stato]` non trova lo stato | 5 documenti, tutti `valido`/`da-rivedere` |
| **Chiusa a metà** | ispezione `completata` con voci in bianco | q1 chiusa 8/8, q2 in corso |
| **Senza data di nomina** | `!dataISOEsiste(n.dal)` | 6 nomine su 6 con la data |

Cioè: **tre difese scritte, provate, commentate — e invisibili**. Non le poteva
vedere il fondatore, non le poteva vedere uno scatto, non le vedeva nessuno.

È la lezione del 01/08 su `run-demo.mjs`, ritrovata da un'altra strada: *un
campo assente non è un refuso, è uno stato che il prodotto sa raccontare, e
metterlo nella dimostrazione è un modo di mostrarlo.* Lì era la fattura senza
scadenza; qui sono tre.

## Le tre righe aggiunte

- **`c6`** — «Autorizzazione allo scarico acque di lavorazione», `stato: ""`,
  meta «Da archivio cartaceo, stato non registrato».
- **`q3`** — ispezione «Impianto di lavorazione» dichiarata **completata** con
  3 voci su 8 compilate. ⚠️ Il modello va scelto fra quelli veri: la prima
  versione inventava `modello: "stoccaggio"`, che in `MODELLI_ISPEZIONE` non
  esiste.
- **`o7`** — nomina a **direttore** senza `dal`, «Da registro cartaceo: data di
  decorrenza non riportata».

## ⚠️ Perché `o7` sta su «direttore» e non su «preposto»

La prima versione la metteva su preposto (d2). Misurato prima di lasciarla:
la pastiglia usciva **«Formazione non registrata»**, rossa — perché nella catena
`fb` i due rossi della formazione vengono **prima** di `senzaData`, e in
dimostrazione **nessuno** ha il corso da preposto (misurato: 6 lavoratori su 7
`mancante`, d3 `in-scadenza`). La riga aggiunta per mostrare una cosa ne
mostrava un'altra.

`direttore` non ha requisito di formazione, quindi la catena arriva a
`senzaData`. E il rosso **«Da nominare»** non si perde: resta acceso su
`medico`, che è l'altro ruolo obbligatorio scoperto — controllato prima di
scegliere, non dopo.

## Quello che si vede adesso, e che prima era codice morto

Il riepilogo delle ispezioni scrive:

> Da fare: 1 (di cui 1 in ritardo) · completate: 2 su 3 · voci non conformi
> trovate finora: 1. **Attenzione: 5 voci sono rimaste senza esito in
> un'ispezione chiusa: su quelle non è stato guardato niente.**

Quella frase esisteva già e non era mai comparsa: è il principio del fondatore
scritto dalla pagina, e fino a stanotte non lo leggeva nessuno. Stessa cosa per
«senza data di nomina: 1» nel riepilogo delle nomine.

## ⚠️ E la sonda ha sbagliato mira tre volte

Vale la pena scriverlo perché è sempre lo stesso errore, e ogni volta rispondeva
«trovata»:

1. cercava «Senza data di nomina» dopo aver cliccato `#nav-pers` e la trovava
   **alta 0 px**: nomine e DPI sono sotto-schede (`TAB_PERS`), e senza il click
   su `[data-tab=nom]` quella riga non è mai comparsa sullo schermo. La trappola
   dell'altezza zero di `CLAUDE.md`, qui al contrario — **accettata** invece che
   scartata;
2. cercava in tutta la pagina, e cascava sul **riepilogo** in cima (che quella
   frase la contiene) invece che sulla riga della persona. Ora ogni voce
   dichiara il suo contenitore;
3. i selettori del contenitore erano inventati (`#lav-list` invece di
   `#pers-list`), e includendo la radice senza guardia una riga diventava
   **l'elenco intero**.

Adesso la sonda pretende: riga trovata **nel contenitore dichiarato**, altezza
**diversa da zero**, e altezza non oltre 1,6× le righe sorelle (la barra a
capo). Cinque su cinque, 0 da guardare.

## Verifica

Scatti **guardati**, non solo prodotti: le tre righe nuove hanno la striscia
gialla e la pastiglia `warn` giusta, nessuna manda la riga a capo (98/95/98 px
contro sorelle fino a 115). Suite intere con `TZ=Europe/Rome`: kpi 1113/0,
stile 271/0, demo 8/0, helpers 49/0, pointcloud 26/0, manifest 9/0, sonda-vuoto
7/0 (*7 tranquilli, 7 dichiarati*), numeri-nei-documenti 17/0 (458/458),
copertura 9 soggetti 0 scoperte, nomi-doppi 0 da sistemare, date-checkpoint 3/0,
suite-collegate 3/0.

## Prossimo passo atomico

La **pagina di stampa del riepilogo annuale di Terra**, che consuma
`descriviOnere` e i due campi impostati dal cliente (tariffa €/m³ e volume
detratto per recupero). È il 2° dei cinque documenti prioritari, e quattro su
cinque aspettano ormai solo la pagina.
