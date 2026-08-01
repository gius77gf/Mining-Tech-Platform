/* ⚠️ NON VA IN npm test: non è una suite né un banco, è un AIUTO che le suite
   importano — non ha prove dentro e non fallisce mai, quindi metterlo in CI
   aggiungerebbe un verde che non guarda niente. Le sue prove ci sono, e stanno
   dove il difetto ha morso: `run-kpi.mjs`, cinque asserzioni sotto «harness».
   Il controllo che pretende questa riga (`suite-collegate`) ha fatto il suo
   lavoro il giorno stesso in cui il file è nato.

   COME SI SCRIVE UN VALORE DENTRO UNA PROVA
   ══════════════════════════════════════════════════════════════════════
   Fino al 01/08 le suite confrontavano i valori con `JSON.stringify`, e
   quella funzione **confonde cose diverse**. Non è un dettaglio teorico:
   il difetto è saltato fuori scrivendo l'andamento degli indici di Scudo,
   dove una controprova ha risposto «non distingue» perché

       JSON.stringify(Infinity) === "null"

   cioè l'asserzione «da zero la variazione percentuale non esiste →
   `null`» **passava anche col difetto rimesso dentro**, dove la funzione
   rispondeva `Infinity`.

   ⛔ E LE COLLISIONI SONO CINQUE, NON UNA (misurate, non dedotte):

     JSON.stringify(Infinity)   -> "null"      ┐
     JSON.stringify(-Infinity)  -> "null"      ├ quattro valori diversi,
     JSON.stringify(NaN)        -> "null"      │ una sola scrittura
     JSON.stringify(null)       -> "null"      ┘
     JSON.stringify(-0)         -> "0"          (e -0 conta, in geometria)
     JSON.stringify({a:undefined}) -> "{}"      (campo assente = campo vuoto)
     JSON.stringify({a:NaN})    -> '{"a":null}' (dentro un oggetto, uguale)

   Il punto che rende la cosa grave non è il numero di collisioni: è
   **dove cadono**. `null` è la convenzione con cui tutto l'ecosistema dice
   «questo non si può calcolare» — il principio del fondatore, quello per
   cui l'assenza di un dato non è un dato favorevole. Quindi il buco stava
   esattamente sotto le prove che difendono quel principio: `Infinity` è
   quello che viene fuori da una divisione per zero, cioè **proprio il
   difetto** che quelle prove esistono per fermare.

   Questa funzione sta in un file suo perché la usano DUE suite
   (`run-kpi.mjs` e `run-pointcloud.mjs`): una regola che serve a due
   posti si scrive una volta sola, che è la stessa regola di `shared/`
   applicata agli strumenti di prova. `run-helpers.mjs` non ne ha bisogno:
   il suo `eq` confronta già con `!==`, e usa `JSON.stringify` solo per
   SCRIVERE il messaggio d'errore.

   ⚠️ Quello che NON cambia, di proposito: l'ordine delle chiavi resta
   quello di inserimento, come in `JSON.stringify`. Ordinarle avrebbe reso
   `{a,b}` uguale a `{b,a}` — forse più giusto, ma è un cambio di senso di
   2.389 asserzioni fatto di straforo, e non è quello che questa unità sta
   correggendo. */
export function mostra(v, visti = new Set()) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  const t = typeof v;
  if (t === "number") {
    /* i quattro che JSON.stringify appiattiva su "null", più il meno zero */
    if (Number.isNaN(v)) return "NaN";
    if (v === Infinity) return "Infinity";
    if (v === -Infinity) return "-Infinity";
    if (Object.is(v, -0)) return "-0";
    return String(v);
  }
  if (t === "string") return JSON.stringify(v);
  if (t === "boolean") return String(v);
  if (t === "bigint") return String(v) + "n";
  if (t === "function") return `funzione ${v.name || "anonima"}`;
  if (t === "symbol") return String(v);
  /* un riferimento circolare faceva LANCIARE JSON.stringify, cioè faceva
     fallire la prova con un messaggio che non parlava della prova */
  if (visti.has(v)) return "[ciclo]";
  visti.add(v);
  let out;
  if (v instanceof Date) {
    out = Number.isNaN(v.getTime()) ? "Data(non valida)" : JSON.stringify(v.toISOString());
  } else if (Array.isArray(v)) {
    out = "[" + v.map(x => mostra(x, visti)).join(",") + "]";
  } else if (v instanceof Set) {
    out = "Set[" + [...v].map(x => mostra(x, visti)).join(",") + "]";
  } else if (v instanceof Map) {
    out = "Map{" + [...v].map(([k, x]) => mostra(k, visti) + ":" + mostra(x, visti)).join(",") + "}";
  } else {
    /* `Object.keys` e non `JSON.stringify`: così la chiave che vale
       `undefined` COMPARE, invece di sparire e far sembrare l'oggetto
       identico a uno che quella chiave non ce l'ha mai avuta. */
    out = "{" + Object.keys(v).map(k => JSON.stringify(k) + ":" + mostra(v[k], visti)).join(",") + "}";
  }
  visti.delete(v);
  return out;
}
