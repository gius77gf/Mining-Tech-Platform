# Checkpoint — il verde su un anno che nessuno ha misurato

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.359 → **1.360**, tutte verdi con `TZ=Europe/Rome`

## 1. Che cosa mancava alla sonda del vuoto

Guardava un vuoto solo: **tutto** vuoto. Ma la forma che aveva smascherato
`urgenzaOre` è un'altra — **un argomento assente accanto a uno buono**: le ore
fatte dal mezzo si sanno, il tagliando previsto no. È il caso vero, ed è anche
il più insidioso: con tutto vuoto una funzione si ferma sulla prima guardia e
**non arriva mai** al conto che sbaglia.

Aggiunte sei forme miste (`[null, 500]`, `["", 500]`, `[500, null]`, e le tre
con una data).

## 2. Che cosa è saltato fuori: `terra.proiezioneAnnua`

```js
const stato = pctPiano == null ? "ok" : pctPiano > 100 ? "danger" : ...
```

`stato` rispondeva **"ok"** anche quando non c'era **niente** da proiettare — né
un rilievo dell'anno in corso, né abbastanza anno trascorso per una stima. E la
pagina di Terra prende quello stato e ci **colora il KPI dell'avanzamento**.

**Misurato in pagina** (zero rilievi dell'anno, piano annuo scritto):

| | classe del KPI | colore del numero | frase accanto |
|---|---|---|---|
| **prima** | `kpi ok` | `rgb(39,190,165)` — teal pieno | «al ritmo attuale **~0 m³** … — sotto il limite autorizzato» |
| **dopo** | `kpi` | il gradiente della tinta dell'app | «**non calcolabile**. Quest'anno non è ancora stato registrato nessun volume» |

**Zero non è un ritmo lento: è l'assenza della misura.** Ed è la seconda faccia
dello stesso difetto — il colore *e* la frase.

### Chi lo sapeva già, ed è il punto

Il grafico dell'avanzamento, venti righe più sotto, **si difendeva da solo**:

```js
stato: pr.stato === "ok" ? null : pr.stato,   // il colore si accende solo se ha qualcosa da dire
```

Il KPI no. La stessa regola scritta in un posto e dimenticata nell'altro: è
esattamente la forma che `CLAUDE.md` vieta. Adesso sta **nella funzione** —
`senza-rilievi` e `presto` sono distinti dai tre stati che sono una **misura**,
e i due chiamanti accendono il colore solo su quelli.

## 3. Le due controprove, e perché ne servivano due

1. **rimesso il difetto**: `run-kpi.mjs` e `sonda-vuoto.mjs` cadono **tutt'e
   due**; ripristino verificato **identico** all'originale (−52 caratteri
   all'andata, confronto byte a byte al ritorno);
2. **rimesso il difetto E tolte le sei forme**: la sonda **non lo vede**. Cioè
   sono state le forme nuove a trovarlo — senza questa seconda misura «ora la
   sonda vede di più» sarebbe stata una frase, non un fatto.

## 4. ⚠️ Il filtro nuovo ha accecato la sonda al primo tentativo

Le sei forme miste hanno prodotto **quattro falsi positivi**: `["2026-07-31",
null]` dà a una funzione di **un** parametro una data **buona**, e il `null` in
più finisce su un argomento con valore di serie — che JavaScript **non applica**
quando gli si passa `null` esplicito. Risultato: `oggi` diventa il 1970, la
scadenza del 2026 è lontanissima, «regolare». Giustamente: **il dato non
mancava**. Una sonda del vuoto che chiama una funzione coi parametri pieni sta
misurando sé stessa.

Da lì il filtro `valePer`: una forma si somministra solo se almeno un parametro
**dichiarato** riceve un valore assente. **E la prima versione era sbagliata**:
contava «presente» un array con dentro un record vuoto — cioè `[{}]`, che
l'intestazione del file stesso indica come **la forma più produttiva di tutte**.

Se ne è accorta la **seconda guardia**, non io: `campo.pianoRiepilogo` è sparito
dagli allarmi dichiarati. Non era guarito — **non veniva più chiamato**. Reso
ricorsivo (`[{}]` è assente perché tutti i suoi elementi lo sono): **885**
somministrazioni scartate invece di 2.739, e `pianoRiepilogo` è tornato.

> *Un filtro che toglie rumore va misurato anche su quello che toglie di buono.*
> È la stessa famiglia di «il controllo che non guarda dove crede», ma nata al
> contrario: non da un filtro scritto male, da un filtro scritto **bene per il
> caso a cui pensavo** e cieco su quello che contava.

`conti.livelloSollecito` è uscito da `ALLARMI_ACCETTATI` per la stessa via: era
dichiarato accettabile un allarme che **non nasceva da un dato mancante** (500
giorni di ritardo, rosso giusto). Col filtro il caso non si presenta più e la
seconda guardia l'ha preteso fuori. **È il modo giusto di accorciare quell'elenco
— non a memoria.**

## 5. ⚠️ Errore mio, il secondo dello stesso tipo

Ho modificato `apps/terra/terra-data.js` e `apps/terra/index.html` **mentre
girava** `tests/browser/tutti.mjs` — la regola che ho scritto io stesso ieri. Il
giro è stato **ucciso**, non letto: era arrivato a `contrasto` su *flotta*,
quindi nessuna misura di Terra è stata falsata, ma non lo sapevo quando ho
premuto invio.

Due volte in due giorni vuol dire che **la regola scritta non basta**: va resa
un controllo. La prossima unità è quella.

## Prossimo passo atomico

1. **Il giro che si accorge da solo di essere stato falsato**: `tutti.mjs`
   registra l'impronta dei file che le pagine caricano all'**inizio** e la
   riverifica alla **fine**; se qualcosa è cambiato dichiara il giro **NON
   VALIDO** invece di stampare un verde. È l'unica forma che non dipende dalla
   memoria di chi modifica.
2. Poi rilanciare il giro completo sul codice di adesso.
3. **`genesi-struttura.mjs`**: pretendere che fallisca, poi `--prima`.
4. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`).
5. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2.
6. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Restano le decisioni del fondatore in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.
