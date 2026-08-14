# Il giro che firmava il commit sbagliato

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/tutti.mjs`
**Unità precedente:** `20260801-062000_i-cantieri-che-sembravano-gli-stessi.md`

## Come è venuto fuori

Il giro del browser è finito con uscita **0**: «35 banchi a posto, 0 da
guardare», 525 asserzioni, nessun KO fuori dalle sezioni di controprova. Il
riepilogo in fondo diceva:

> ▶ Il giro sta girando su una COPIA di **9725787** (il committato), non sulla
> cartella viva.
> Niente di non committato: la copia è identica a quello che hai su disco.

Ma la **prima riga dello stesso log** diceva `COPIA di b34922a`. Due hash
diversi per la stessa copia, nello stesso file di output.

## Il difetto

`dichiaraSuCosaGira()` calcolava il hash così:

```js
execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: RADICE })
```

`RADICE` è la **cartella viva**, non la copia. In cima le due coincidono, e
infatti la riga era giusta; in fondo — dopo un'ora e mezza in cui il cantiere ha
continuato a committare, che è **esattamente il motivo per cui la copia
esiste** — HEAD si era spostato di **12 commit** (misurato: `git rev-list
--count b34922a..HEAD` → 12).

Il danno non è estetico. Il verde veniva **intestato a un commit che il giro non
aveva mai visto**, e la riga successiva aggiungeva «la copia è identica a quello
che hai su disco»: falsa. Fra i 12 commit c'era tutto `onereEscavazione` /
`descriviOnere` di Terra — cioè il riepilogo diceva provate proprio le
modifiche che **non erano entrate**.

È la forma peggiore del difetto che questo progetto insegue da settimane: non un
numero tranquillo dove non è stato misurato niente, ma un numero tranquillo
**intestato a qualcos'altro**.

## La correzione

Il hash si prende **una volta sola, dalla copia, quando la copia nasce**
(`COMMIT_COPIA = hashDi(dove)`), e in fondo si dichiara anche di quanto la
cartella viva è andata avanti nel frattempo:

```
⚠️ Da quando la copia è stata presa la cartella viva è andata avanti di 12 commit
   (ora è a 9725787). Questo giro attesta b34922a, NON quello che hai adesso.
```

E la frase «la copia è identica a quello che hai su disco» adesso si stampa solo
se la deriva è zero: prima era incondizionata, ed era la metà più pericolosa
del difetto — non un'informazione mancante, un'**affermazione falsa**.

## La controprova, e cosa copre davvero

`giro-su-copia.mjs` passa da **3** prove a **9**. La deriva si costruisce senza
toccare il repository: la copia si prende a `HEAD~3`, così la viva è avanti di 3
per costruzione.

Rimettendo i due difetti nel file vero (`2 iniezioni rimesse · 14029 → 14027
caratteri, −2`), cadono **2 prove su 9**, uscita 1. Ripristinato e verificato
`diff` identico all'originale.

⚠️ **E le altre 4 non cadono, il che va detto invece che nascosto.** Le prove
che misurano git — «il hash si prende dalla copia», «i due sono diversi», «la
deriva è 3» — non leggono `tutti.mjs`: dimostrano che **git sa rispondere**, non
che il giro glielo chieda nel modo giusto. È il caso 1 della tassonomia in
`CLAUDE.md`: i loro dati non possono distinguere. A guardare il difetto sono
solo le due che leggono il file. Le altre restano perché descrivono il
meccanismo, non perché lo difendano — e chiamarle difese sarebbe gonfiare il
risultato.

## Cosa vuol dire per il giro di stanotte

**I 35 banchi verdi attestano `b34922a`, non `9725787`.** Le sei unità
successive — fra cui l'onere di escavazione di Terra — non sono state provate
dal browser. Non è un allarme (le loro prove `node` girano e passano), ma va
scritto, perché un «tutto verde» ricordato senza la sua data è come una soglia
scritta su un valore monotòno: rassicura nella direzione sbagliata.

## Verifica

`giro-su-copia` **9/0**. `suite-collegate` 3/0, 43 file. `node --check` su
`tutti.mjs`.

## Prossimo passo atomico

Lo **scatto delle cinque righe di Scudo**, già in corso: il debito dichiarato
dal suo cantiere.
