# «Distanza 0 m» sul documento per l'ente

**Data:** 01/08/2026 · **Area:** `apps/sentinella/` (modulo + pagina),
`apps/deepwork-id/tests/run-kpi.mjs`, `run-demo.mjs`, banco degli stati
**Unità precedente:** `20260801-201500_la-misura-che-si-accorciava-da-sola.md`

## Come ci sono arrivato

Dalla classifica corretta un'ora fa: **«non indicata», tre app**. Leggendo le
occorrenze di Sentinella una porta altrove — la distanza del ricettore — e
seguendola si arriva alla **tabella delle volate nel report di conformità**,
cioè il documento che si consegna all'ente:

```js
<td>${esc(numeroIt(v.distanzaRicettore || 0))}</td>
```

Su una volata che quel dato non l'ha mai avuto usciva **«0»**. Sulla colonna
della distanza è la peggiore che si possa scrivere: «0 m» si legge come il
**ricettore dentro il fronte**, e chi legge il report non ha modo di
distinguerlo da una misura. Lo stesso `|| 0` stava su fori, kg totali e kg
massimi per ritardo.

## ⛔ E il difetto non era nella tabella: era su tutti e tre i passaggi

1. **Il form** — `const vn = (id) => c.r.ok ? c.r.valore : 0`. Il controllo
   lascia passare il campo **vuoto** apposta (`!c.r.vuoto`), e poi lo salvava
   **zero**. Tre righe sopra c'è scritto: *«un numero illeggibile si dice, non
   si salva a zero: un chilo di esplosivo scomparso dal registro è un dato
   falso verso l'ente»* — la regola era dichiarata e il caso vuoto le sfuggiva.
2. **Il CSV** — `csvRegistroVolate` scriveva `n(+v.distanzaRicettore || 0)` e
   `parseVolateCsv` leggeva `Number.isFinite(n) ? … : 0`.
3. **La tabella** del report, sopra.

## ⚠️ Perché nessuna prova lo vedeva: le due metà sbagliavano insieme

Il giro di andata e ritorno del registro volate è la prova più forte che il
file non perda niente, e restava **verde**: `0` andava, `0` tornava,
identità rispettata. È esattamente la trappola scritta in `CLAUDE.md` — *«una
prova di andata e ritorno resta verde se le due metà sbagliano insieme»* — e
la difesa è la stessa: **asserire anche sul TESTO del file**. La prova nuova
pretende la riga esatta, con le due caselle vuote in mezzo ai punti e virgola.

**Controprova su due piani, separati apposta**: rimessi tutt'e due i difetti
cade la prova sul testo; rimesso **solo il lato lettura** cade
`back.nFori === null`. Se avessi provato solo la coppia, il lato lettura
sarebbe rimasto scoperto senza che si vedesse.

E una seconda prova dice l'altra metà della regola: **uno zero scritto da
qualcuno resta uno zero**. La guardia sta sull'assenza, non sul valore —
cancellare un «0 fori» dichiarato sarebbe l'errore opposto.

## ⛔ E `run-demo` impediva alla dimostrazione di contenere il caso

Aggiunta la volata `b4` (senza distanza), `run-demo` è caduta:
`volata b4: numerici`. Pretendeva che **ogni** volata avesse tutti i numeri,
quindi la dimostrazione **non poteva contenere** proprio il caso per cui la
difesa era appena stata costruita. È il difetto già corretto il 01/08 per le
fatture senza scadenza, **in un'altra app e da un altro autore**: segno che è
una forma, non un episodio. Corretta come là — assente ammesso, **presente e
illeggibile no** — con la controprova che rimette `kgTotali: "abc"` e la fa
cadere.

## Che cosa dice adesso il report

Sopra la tabella, quando serve:

> **Attenzione: 1 volata di questo periodo non dichiara tutti i dati.** Le
> caselle marcate **«non dichiarato»** non sono zeri: sono valori che nessuno
> ha registrato, e senza di essi la distanza scalata (SD) non si calcola.

La frase compare **solo** se c'è almeno una riga incompleta, e sta **sopra**
la tabella: un «non dichiarato» in mezzo a venti righe si perde, e chi legge
deve saperlo prima di leggere.

⚠️ Il banco **non** cerca «non dichiarato» da solo: quella pastiglia il report
la scrive già per il limite di progetto senza norma, quindi la sonda avrebbe
trovato **quella** e portato il nome di un altro caso. Cerca la frase che conta
le righe incomplete — col difetto rimesso il conto va a zero e la frase
sparisce.
⚠️ E il primo `vietato` che avevo scritto per questo caso cercava «sono zeri»,
mentre la frase giusta dice «**non** sono zeri»: sarebbe caduto sul testo
corretto. Tolto — un `vietato` inventato per riempire la colonna è peggio di
nessun `vietato`.

## Verifica

`run-kpi` **1123/0** (erano 1121: due prove nuove), `run-demo` 8/0,
`run-stile` 271/0, banco `stati-non-misurati` (numeri in fondo).

## Prossimo passo atomico

Restano di «non indicata» le altre due app: **Conti** («asta non indicata»,
«voce non indicata») e **Terra** (tre «non indicato»). Stessa strada: prima si
guarda **dove** quella frase finisce — se in un documento che esce dall'app,
ha la precedenza, perché è lì che un numero tranquillo costa di più.
