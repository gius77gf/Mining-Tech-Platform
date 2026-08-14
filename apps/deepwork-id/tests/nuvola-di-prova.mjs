/* ⚠️ NON VA IN npm test: non è una suite, è il **soggetto** su cui girano le
   prove del volume — lo importa `run-pointcloud.mjs`. Da solo non misura
   niente: genera una nuvola e la scrive in LAS.

   ⛔ UN FRONTE DI CAVA DI CUI SI CONOSCE IL VOLUME VERO.
   Sta in un file suo perché lo useranno più suite (oggi `run-pointcloud.mjs`).

   PERCHÉ ESISTE, e la ragione è il 02/08. Il fondatore non può fare un volo
   con il drone sulla sua cava, e ha proposto due strade: una nuvola pubblica
   scaricata da internet, oppure ricostruirne una da un suo filmato. La
   seconda non è praticabile da qui (il video dovrebbe passare da git, e la
   fotogrammetria vuole ore di CPU e programmi che qui non ci sono). La prima
   funziona ed è stata fatta: due file veri, pubblici e scaricabili da questo
   contenitore, misurati in `docs/NUVOLA_DI_PUNTI.md`.

   ⚠️ Ma un file vero da solo NON basta, ed è il punto che rende necessario
   questo modulo: **di un rilievo vero non si conosce la risposta giusta**. Se
   il nostro calcolo dice 2.232.876 m³, nessuno sa se è vero — si può solo
   vedere che non esplode. Qui invece la superficie è una FORMULA, quindi il
   volume esatto si integra: le prove possono dire «sbagliamo del 2%» invece
   di «non è andato in errore».
   Le due cose stanno insieme: il file vero prova che il LETTORE regge il
   mondo (formati, coordinate UTM, colori a 16 bit, 110.000 punti); questo
   prova che il CALCOLO dà il numero giusto.

   Che cosa riproduce di un volo vero: coordinate UTM di grandezza reale
   (dove `float32` perde fino a **25 cm** sulla nord — misurato, e non era la
   cifra che ci si aspettava: 1,8 cm è la perdita sull'est), rumore di 2 cm, occlusioni (il buco che la
   roccia si fa da sé), punti volanti (uccelli, polvere, ricostruzioni
   sbagliate), colore a 16 bit, LAS 1.2 formato punto 3 — lo stesso dei due
   file veri. Che cosa NON riproduce, detto per non venderlo per più di
   quello che è: la geometria vera di UNA cava, la distribuzione della densità
   di un volo reale, gli errori sistematici del GPS, e qualunque cosa dipenda
   dal come si vola. Per quelle serve il volo del fondatore. */

const HDR = 227, REC = 34;   // LAS 1.2 · point data record format 3

/* Deterministico di proposito: una prova che cambia soggetto a ogni giro
   non è una prova. */
function rnd(seme) {
  let s = seme >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ⛔ IL PIAZZALE NON È SCENOGRAFIA. `volumeCumulo` prende come quota di base
   il **2° percentile** delle quote, non il minimo: senza una parte piana in
   basso larga almeno il 2% dei punti, la base finisce mezzo metro più su e il
   volume cala. Misurato al primo tentativo, con una gradonata senza piazzale:
   **−8,51%**, e leggendo il codice non si vedeva. In una cava vera il
   piazzale c'è sempre — è dove passano i camion. */
function quota(x, piazzale, scarpata, H) {
  if (x <= piazzale) return 0;                      // il piazzale a valle
  if (x >= piazzale + scarpata) return H;           // il ripiano in cima
  return (H * (x - piazzale)) / scarpata;           // la scarpata
}

export function fronteDiCava(opz = {}) {
  const {
    n = 60000, L = 60, W = 40, H = 12, piazzale = 20, scarpata = 18,
    origineX = 636400, origineY = 4849300, origineZ = 210,   // UTM 33N
    rumore = 0.02,                       // 2 cm: la precisione di un rilievo da drone
    buchi = [],                          // occlusioni: [x, y, raggio]
    isolati = 0,                         // punti volanti
    altezzaIsolati = [5, 35],            // quanto sopra il ripiano
    seme = 7,
  } = opz;
  const r = rnd(seme);
  const xs = [], ys = [], zs = [];
  let messi = 0, tentativi = 0;
  while (messi < n && tentativi < n * 6) {
    tentativi++;
    const x = r() * L, y = r() * W;
    if (buchi.some(([bx, by, rr]) => (x - bx) ** 2 + (y - by) ** 2 < rr * rr)) continue;
    zs.push(quota(x, piazzale, scarpata, H) + (r() - 0.5) * 2 * rumore);
    xs.push(x); ys.push(y); messi++;
  }
  for (let i = 0; i < isolati; i++) {
    xs.push(r() * L); ys.push(r() * W);
    zs.push(H + altezzaIsolati[0] + r() * (altezzaIsolati[1] - altezzaIsolati[0]));
  }

  /* il volume VERO sopra il piano di base: la superficie dipende solo da x,
     quindi è un integrale in una variabile per la larghezza. Non è una stima
     con un'altra formula — è la stessa funzione che ha generato i punti. */
  let vero = 0;
  const passi = 200000, dx = L / passi;
  for (let i = 0; i < passi; i++) vero += quota((i + 0.5) * dx, piazzale, scarpata, H) * dx;
  vero *= W;

  return { xs, ys, zs, vero, L, W, H, piazzale, scarpata, punti: xs.length,
           origine: [origineX, origineY, origineZ] };
}

/* Scrive la nuvola in LAS 1.2 formato punto 3 — così le prove passano dal
   lettore vero (`parseLAS`) invece di infilare numeri a mano: se un giorno
   l'intestazione venisse letta storta, queste prove se ne accorgono. */
export function scriviLAS(nuvola) {
  const { xs, ys, zs, origine } = nuvola;
  const n = xs.length;
  const buf = new ArrayBuffer(HDR + n * REC);
  const dv = new DataView(buf);
  new Uint8Array(buf).set([0x4c, 0x41, 0x53, 0x46], 0);   // "LASF"
  dv.setUint8(24, 1); dv.setUint8(25, 2);                 // versione 1.2
  dv.setUint16(94, HDR, true);
  dv.setUint32(96, HDR, true);
  dv.setUint8(104, 3);                                    // formato punto 3 (RGB)
  dv.setUint16(105, REC, true);
  dv.setUint32(107, n, true);
  const S = 0.01;                                         // scala: il centimetro
  dv.setFloat64(131, S, true); dv.setFloat64(139, S, true); dv.setFloat64(147, S, true);
  dv.setFloat64(155, 0, true); dv.setFloat64(163, 0, true); dv.setFloat64(171, 0, true);
  for (let i = 0; i < n; i++) {
    const b = HDR + i * REC;
    dv.setInt32(b, Math.round((origine[0] + xs[i]) / S), true);
    dv.setInt32(b + 4, Math.round((origine[1] + ys[i]) / S), true);
    dv.setInt32(b + 8, Math.round((origine[2] + zs[i]) / S), true);
    dv.setUint16(b + 12, 100, true);                      // intensità
    const g = Math.max(0, Math.min(65535, Math.round(30000 + zs[i] * 1500)));
    dv.setUint16(b + 28, g, true); dv.setUint16(b + 30, g, true); dv.setUint16(b + 32, g, true);
  }
  return buf;
}
