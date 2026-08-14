/* ⚠️ NON VA IN npm test: non è un banco, è la regola del CAMPIONE SCAPPATO che
   due banchi si chiedono sui file che escono (`csv-dimostrazione.mjs` per le
   sei app, `genesi-documenti-che-escono.mjs` per Genesi). Sta in un file suo e
   non dentro uno dei due perché quei due sono **script**: importarne uno per
   prendergli una funzione ne farebbe partire il server e il giro intero.
   ────────────────────────────────────────────────────────────────────────

   ⛔ UN CAMPIONE CHE È SCAPPATO DAL SUO RECINTO SI RICONOSCE DALLE CIFRE.
   CLAUDE.md, 07/08: «un file di scambio porta il NOMINALE, non il campione», e
   il segno da riconoscere è sempre lo stesso — **un numero con quindici
   decimali dove lo schermo ne mostra zero**. Quel giorno il `.volata.json` di
   Genesi scriveva `42,332516881726825` per un ritardo progettato a **42 ms**
   (lo scatter d'innesco che `buildSim` somma apposta alla simulazione, col
   nominale conservato lì accanto nello stesso oggetto), e il giro di andata e
   ritorno lo perdeva: l'importatore ricava il passo dalla mediana delle
   differenze fra ritardi distinti, con lo scatter sono tutte diverse, e il
   ripiego riportava a **25 ms** una volata progettata a 42.

   È stato trovato **aprendo il file a mano**, e la lezione era rimasta scritta
   in prosa — cioè affidata alla memoria di chi legge, che è precisamente il
   difetto per cui esistono le suite. Adesso la domanda si fa da sé su ogni
   file che esce, e vale per qualunque valore sporcato apposta (rumore,
   scatter, jitter) o mai arrotondato: in un file che ESCE dall'azienda quella
   coda di cifre non ha nessun mestiere, e a chi lo riapre in un foglio di
   calcolo dice il falso — suggerisce una precisione che la misura non ha.

   ⚠️ **LA SOGLIA È MISURATA, NON TEMUTA.** È la regola dei controlli tenuti
   larghi «per non fare falsi allarmi»: l'ampiezza è un numero, e quel numero
   si conta prima di scegliere. Sui **33 file veri** usciti dai 36 bottoni di
   export delle sei app la distribuzione dei decimali è

       1 cifra → 113 numeri · 2 cifre → 12 · 3 cifre → 18 · 4 o più → ZERO

   cioè la soglia a quattro costa **zero** falsi allarmi oggi. Il giorno che ne
   costasse uno sarebbe un numero nuovo da guardare, non rumore da zittire.

   ⚠️ E si legge il NUMERO, non il testo: le date `2026-08-07` non hanno il
   punto, gli orari `10:45` nemmeno, e un raggruppamento delle migliaia
   (`1.234.567,89`) non entra per costruzione — le due guardie ai lati
   rifiutano una cifra o un separatore attaccati. Le tre forme sono provate
   dentro i due banchi che usano questa funzione, col caso vero accanto:
   una prova che non sa fallire non dimostra niente. */

export const MAX_DECIMALI = 3;

/* ⛔ L'UNICA ECCEZIONE, DICHIARATA PER NOME E CON LA RAGIONE — e il modo in cui
   è nata è la parte che vale. La soglia era stata misurata sui 33 file delle
   sei app (zero numeri a quattro cifre); montata su Genesi ha subito acceso un
   KO, e **non era un difetto**: `genesi_signature_composito.csv` è una
   TRACCIA — 1.970 campioni `tempo_ms;ampiezza` di un'onda sismica — e le sue
   quattro cifre sono un `toFixed(4)` scritto apposta, cioè una decisione di
   arrotondamento, non una coda scappata. Un'ampiezza in mm/s si rilegge in un
   programma che la ridisegna, e lì la quarta cifra è segnale.
   Il modo giusto di trattarla è quello che CLAUDE.md prescrive per i controlli
   larghi: **un elenco corto e scritto batte una regola larga che nasconde**.
   Alzare la soglia a quattro per tutti avrebbe fatto passare in silenzio un
   campione a cinque cifre in ogni altro file.
   ⚠️ E vale la regola di `sonda-vuoto`: un'eccezione che non serve più è
   un'eccezione che nasconde. Ogni voce dichiara il banco che deve incontrarla,
   e quel banco pretende che si presenti ancora — se il file cambia nome o
   sparisce, la riga qui sotto diventa rossa invece di restare a coprire un
   difetto che non c'è più. */
export const SOGLIE = {
  "genesi_composito_": { max: 4, banco: "genesi",
    perche: "traccia d'onda: `comp[i].toFixed(4)`, l'ampiezza in mm/s si rilegge per ridisegnarla" },
};

/* ⛔ LA CHIAVE È UN PREFISSO, E LA RAGIONE È UN DIFETTO CORRETTO IL 07/08. Quel
   file usciva col nome **fisso** `genesi_signature_composito.csv`: due confronti
   diversi — un'altra onda registrata, un'altra volata — si sovrascrivevano a
   vicenda senza che il browser chiedesse niente. Adesso il nome porta l'onda da
   cui viene, i fori e il ritardo, quindi un nome per esteso qui dentro non
   combacerebbe mai più.
   ⚠️ E il prefisso è la forma **stretta** che regge il cambiamento: non una
   sottostringa e non una regex — `startsWith`, sull'inizio che l'app costruisce.
   Un'eccezione dichiarata con una regex larga tornerebbe a scusare file che non
   ha mai visto. */
export const chiaveSoglia = (nome) => {
  const n = String(nome || "");
  return Object.keys(SOGLIE).find((x) => n === x || n.startsWith(x)) || null;
};
export const sogliaPer = (nome) => {
  const k = chiaveSoglia(nome);
  return k ? SOGLIE[k].max : MAX_DECIMALI;
};

/* ⛔ E LA PRIMA STESURA AVEVA LE GUARDIE, ED ERANO IL BUCO. Portava
   `(?<![\d.,]) … (?![\d.,])` per non farsi ingannare da un raggruppamento
   delle migliaia — ragionevole, e falso: **un numero seguito da una virgola
   non veniva visto**, e in un JSON quello è il caso normale. Sul
   `.volata.json` di Genesi, che ha `"interasse_m": 3.5,` e `"x": 1.75,`, il
   setaccio rispondeva **«0 numeri guardati»** — cioè era cieco proprio sul
   file per cui era stato scritto, e ci rispondeva con un OK.
   L'ha preso il **conto dei soggetti** stampato accanto all'esito, non
   l'esito: uno zero fra parentesi in mezzo a otto righe verdi. È la ragione
   per cui quel conto c'è.
   ⚠️ E la guardia non serviva: un raggruppamento delle migliaia ha gruppi da
   **tre** cifre, cioè sempre **sotto** la soglia — `1.234.567,89` produce
   `1.234` (3), `567,89` (2), e nessuno dei due allarma. Il caso da cui ci si
   difendeva non poteva far male: la difesa sì. */
export function campioniScappati(testo, max = MAX_DECIMALI) {
  const tutti = [...String(testo).matchAll(/\d+[.,](\d+)/g)];
  return { guardati: tutti.length,
           scappati: tutti.filter((m) => m[1].length > max).map((m) => m[0]) };
}
