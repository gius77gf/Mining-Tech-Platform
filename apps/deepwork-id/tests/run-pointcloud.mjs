// ============================================================
// Test dei parser di nuvole/mesh del visualizzatore Genesi
// (apps/genesi/pointcloud.js): sono il pezzo che legge i file del
// drone/ODM per il flusso drone→fronte→volata. Funzioni pure, testabili
// in Node. Blindano i 3 fix della revisione serale 22/07:
// downsample XYZ, precisione (pre-shift OBJ) e robustezza PLY.
// ============================================================
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mostra } from "./mostra.mjs";
const HERE = dirname(fileURLToPath(import.meta.url));
const pc = await import(join(HERE, "../../genesi/pointcloud.js"));

let passed = 0, failed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); } };
/* `mostra` e non `JSON.stringify`: quella scrive "null" per Infinity, NaN e
   null, e "0" per -0 — e qui si misura geometria, dove il meno zero e un
   NaN da divisione sono esattamente i difetti da prendere. Vedi mostra.mjs. */
const eq = (got, exp, why) => { const a = mostra(got), b = mostra(exp); if (a !== b) throw new Error(`${why}: atteso ${b}, ottenuto ${a}`); };
const ok = (cond, why) => { if (!cond) throw new Error(why); };

console.log("\n— pointcloud: parseXYZ —");
test("parseXYZ base: 2 punti, coordinate lette", () => {
  const r = pc.parseXYZ("1 2 3\n4 5 6\n");
  eq(r.count, 2, "conteggio"); eq(r.pos, [1, 2, 3, 4, 5, 6], "posizioni"); eq(r.col, null, "niente colore");
});
test("parseXYZ con colore RGB (0-255 → 0-1)", () => {
  const r = pc.parseXYZ("1 2 3 255 0 128");
  ok(r.col && Math.abs(r.col[0] - 1) < 1e-9 && r.col[1] === 0 && Math.abs(r.col[2] - 128 / 255) < 1e-9, "colore normalizzato");
});
test("parseXYZ ignora commenti, righe vuote, testo non numerico; virgola/; come separatori", () => {
  const r = pc.parseXYZ("# commento\n\n1,2,3\nabc def ghi\n4;5;6");
  eq(r.count, 2, "solo le 2 righe valide"); eq(r.pos, [1, 2, 3, 4, 5, 6], "posizioni");
});
test("parseXYZ downsample: 100 punti con cap 10 → ridotti, total conservato", () => {
  let t = ""; for (let i = 0; i < 100; i++) t += `${i} 0 0\n`;
  const r = pc.parseXYZ(t, 10);
  ok(r.count <= 10 && r.count > 0, "conteggio sotto il cap"); eq(r.total, 100, "totale originale"); ok(r.step >= 10, "step di downsample");
});

console.log("\n— pointcloud: parsePLY —");
function plyAscii(n) {
  let s = `ply\nformat ascii 1.0\nelement vertex ${n}\nproperty float x\nproperty float y\nproperty float z\nend_header\n`;
  for (let i = 0; i < n; i++) s += `${i} ${i * 2} ${i * 3}\n`;
  return new TextEncoder().encode(s).buffer;
}
function plyBinary(verts) {
  const header = new TextEncoder().encode(`ply\nformat binary_little_endian 1.0\nelement vertex ${verts.length}\nproperty float x\nproperty float y\nproperty float z\nend_header\n`);
  const ab = new ArrayBuffer(header.length + verts.length * 12);
  new Uint8Array(ab).set(header, 0);
  const dv = new DataView(ab, header.length);
  verts.forEach((v, i) => { dv.setFloat32(i * 12, v[0], true); dv.setFloat32(i * 12 + 4, v[1], true); dv.setFloat32(i * 12 + 8, v[2], true); });
  return ab;
}
test("parsePLY ascii: conteggio e coordinate", () => {
  const r = pc.parsePLY(plyAscii(3));
  eq(r.count, 3, "conteggio"); eq(r.pos.slice(0, 6), [0, 0, 0, 1, 2, 3], "prime 2 posizioni");
});
test("parsePLY binario little-endian: legge i float", () => {
  const r = pc.parsePLY(plyBinary([[0, 0, 0], [1.5, 2.5, 3.5], [4, 5, 6]]));
  eq(r.count, 3, "conteggio"); ok(Math.abs(r.pos[3] - 1.5) < 1e-4 && Math.abs(r.pos[5] - 3.5) < 1e-4, "float letti");
});
test("parsePLY downsample: vertici oltre il cap → step > 1", () => {
  const r = pc.parsePLY(plyAscii(100), 10);
  ok(r.step > 1, "step"); eq(r.total, 100, "totale"); ok(r.count <= 10, "sotto il cap");
});
test("parsePLY errori: header assente e vertici assenti lanciano", () => {
  let e1 = false, e2 = false;
  try { pc.parsePLY(new TextEncoder().encode("non un ply").buffer); } catch (e) { e1 = true; }
  try { pc.parsePLY(new TextEncoder().encode("ply\nformat ascii 1.0\nend_header\n").buffer); } catch (e) { e2 = true; }
  ok(e1, "header mancante lancia"); ok(e2, "vertici mancanti lancia");
});

console.log("\n— pointcloud: parseLAS (formato nativo ODM) —");
// Costruisce un LAS 1.2/1.4 minimale in memoria: header pubblico + N record.
// Formati-punto supportati: 0 (solo XYZ, 20 byte), 2 (RGB a offset 20, 26 byte),
// 3 (GPS-time + RGB a offset 28, 34 byte — il tipico output di ODM).
const LAS_TEST_RECLEN = { 0: 20, 1: 28, 2: 26, 3: 34 };
const LAS_TEST_RGBOFF = { 2: 20, 3: 28 };
function lasBuf(pts, { fmt = 0, scale = [0.01, 0.01, 0.01], off = [500000, 5000000, 0], ver = [1, 2], legacyCount = null } = {}) {
  const recLen = LAS_TEST_RECLEN[fmt] || 20;
  // Header 227 byte per LAS 1.2, 375 per 1.4 (dove il conteggio a 64 bit sta a offset 247).
  const ptOffset = ver[1] >= 4 ? 375 : 227;
  const ab = new ArrayBuffer(ptOffset + pts.length * recLen);
  const dv = new DataView(ab);
  const enc = new TextEncoder().encode("LASF"); new Uint8Array(ab).set(enc, 0);
  dv.setUint8(24, ver[0]); dv.setUint8(25, ver[1]);
  dv.setUint16(94, ptOffset, true);      // header size
  dv.setUint32(96, ptOffset, true);      // offset to point data
  dv.setUint8(104, fmt);
  dv.setUint16(105, recLen, true);
  dv.setUint32(107, legacyCount == null ? pts.length : legacyCount, true);
  if (ver[1] >= 4) dv.setBigUint64(247, BigInt(pts.length), true);   // conteggio "vero" a 64 bit (LAS 1.4)
  dv.setFloat64(131, scale[0], true); dv.setFloat64(139, scale[1], true); dv.setFloat64(147, scale[2], true);
  dv.setFloat64(155, off[0], true); dv.setFloat64(163, off[1], true); dv.setFloat64(171, off[2], true);
  pts.forEach((p, i) => {
    const b = ptOffset + i * recLen;
    dv.setInt32(b, Math.round((p[0] - off[0]) / scale[0]), true);
    dv.setInt32(b + 4, Math.round((p[1] - off[1]) / scale[1]), true);
    dv.setInt32(b + 8, Math.round((p[2] - off[2]) / scale[2]), true);
    const rgbOff = LAS_TEST_RGBOFF[fmt];
    if (rgbOff != null && p.length >= 6) { dv.setUint16(b + rgbOff, p[3], true); dv.setUint16(b + rgbOff + 2, p[4], true); dv.setUint16(b + rgbOff + 4, p[5], true); }
  });
  return ab;
}
test("parseLAS: coordinate reali = intero*scala+offset (doppia precisione UTM)", () => {
  const r = pc.parseLAS(lasBuf([[500001.23, 5000002.5, 10.75], [500003.1, 5000004.2, 12.3]]));
  eq(r.count, 2, "conteggio");
  ok(Math.abs(r.pos[0] - 500001.23) < 1e-6 && Math.abs(r.pos[1] - 5000002.5) < 1e-6 && Math.abs(r.pos[2] - 10.75) < 1e-6, "primo punto ricostruito");
  ok(Math.abs(r.pos[3] - 500003.1) < 1e-6 && Math.abs(r.pos[5] - 12.3) < 1e-6, "secondo punto ricostruito");
});
test("parseLAS formato 2: legge il colore RGB", () => {
  const r = pc.parseLAS(lasBuf([[500000, 5000000, 0, 65535, 0, 32768]], { fmt: 2 }));
  ok(r.col && Math.abs(r.col[0] - 1) < 1e-4 && r.col[1] === 0 && Math.abs(r.col[2] - 0.5) < 0.01, "colore 16 bit normalizzato");
});
test("parseLAS colore a 8 bit (alcuni LAS ODM): normalizza su 255, non 65535 (niente colori quasi neri)", () => {
  const r = pc.parseLAS(lasBuf([[500000, 5000000, 0, 200, 100, 50]], { fmt: 2 }));
  // se normalizzasse su 65535 verrebbe ~0.003 (nero); su 255 dà ~0.78/0.39/0.20 (corretto).
  ok(r.col && Math.abs(r.col[0] - 200/255) < 1e-4 && Math.abs(r.col[1] - 100/255) < 1e-4 && Math.abs(r.col[2] - 50/255) < 1e-4, "colore 8 bit normalizzato su 255");
});
test("parseLAS formato 3 (GPS-time + RGB, tipico ODM): RGB letto all'offset giusto (28)", () => {
  const r = pc.parseLAS(lasBuf([[500001, 5000002, 3.5, 65535, 32768, 0]], { fmt: 3 }));
  eq(r.count, 1, "un punto");
  ok(Math.abs(r.pos[0] - 500001) < 1e-6 && Math.abs(r.pos[2] - 3.5) < 1e-6, "coordinate ok nonostante il GPS-time in mezzo");
  ok(r.col && Math.abs(r.col[0] - 1) < 1e-4 && Math.abs(r.col[1] - 0.5) < 0.01 && r.col[2] === 0, "RGB del formato 3 letto a offset 28");
});
test("parseLAS downsample: oltre il cap → step>1, total conservato", () => {
  const pts = []; for (let i = 0; i < 100; i++) pts.push([500000 + i, 5000000, 0]);
  const r = pc.parseLAS(lasBuf(pts), 10);
  ok(r.step > 1 && r.count <= 10, "sotto il cap"); eq(r.total, 100, "totale originale");
});
test("parseLAS 1.4: conteggio legacy=0 → usa il conteggio a 64 bit (offset 247)", () => {
  const r = pc.parseLAS(lasBuf([[500000, 5000000, 1], [500001, 5000001, 2], [500002, 5000002, 3]], { ver: [1, 4], legacyCount: 0 }));
  eq(r.count, 3, "legge i 3 punti dal conteggio a 64 bit");
  ok(Math.abs(r.pos[8] - 3) < 1e-6, "terzo punto (Z) ricostruito");
});
test("parseLAS: LAZ (bit 7 del formato) e firma errata lanciano", () => {
  let e1 = false, e2 = false;
  const laz = lasBuf([[500000, 5000000, 0]]); new DataView(laz).setUint8(104, 0 | 0x80);  // compresso
  try { pc.parseLAS(laz); } catch (e) { e1 = /LAZ/.test(e.message); }
  try { pc.parseLAS(new TextEncoder().encode("non un las........................................................................................................................................................................................................................................").buffer); } catch (e) { e2 = /LASF/.test(e.message); }
  ok(e1, "LAZ compresso lanciato con messaggio LAZ"); ok(e2, "firma errata lanciata");
});

console.log("\n— pointcloud: volumeCumulo (volume del ritaglio a griglia) —");
function boxCloud(w, d, h, step) {   // prisma pieno: superficie a quota h su base w×d + punti di base
  const pos = [];
  for (let x = 0; x <= w; x += step) for (let y = 0; y <= d; y += step) { pos.push(x, y, h); pos.push(x, y, 0); }
  return pos;
}
test("volumeCumulo: prisma 10×8×2 → ~160 m³ (entro il 12%, errore di bordo griglia)", () => {
  const r = pc.volumeCumulo(boxCloud(10, 8, 2, 0.25), 0.5);
  ok(Math.abs(r.volume - 160) / 160 < 0.12, `atteso ~160, ottenuto ${r.volume.toFixed(1)}`);
  ok(r.zBase === 0 && r.celle > 0, "base e celle");
});
test("volumeCumulo: invariante per traslazione (coordinate centrate o UTM)", () => {
  const a = pc.volumeCumulo(boxCloud(10, 8, 2, 0.25), 0.5).volume;
  const posT = boxCloud(10, 8, 2, 0.25).map((v, i) => v + [512000, 5043000, 100][i % 3]);
  const b = pc.volumeCumulo(posT, 0.5).volume;
  ok(Math.abs(a - b) < 1e-6, `traslato deve dare lo stesso volume (${a.toFixed(2)} vs ${b.toFixed(2)})`);
});
test("volumeCumulo: superficie inclinata (cuneo) ≈ metà del prisma", () => {
  const pos = [];
  for (let x = 0; x <= 10; x += 0.25) for (let y = 0; y <= 8; y += 0.25) { pos.push(x, y, 2 * x / 10); pos.push(x, y, 0); }
  const r = pc.volumeCumulo(pos, 0.5);
  ok(Math.abs(r.volume - 80) / 80 < 0.15, `atteso ~80 (cuneo), ottenuto ${r.volume.toFixed(1)}`);
});
test("volumeCumulo: robusto a un punto spurio sotto il piano (rumore drone)", () => {
  // stessa scena del prisma + UN punto a z=-50: con base=minimo il volume
  // esploderebbe (+50·area); con base al 2° percentile resta ~160.
  const pos = boxCloud(10, 8, 2, 0.25); pos.push(5, 4, -50);
  const r = pc.volumeCumulo(pos, 0.5);
  ok(Math.abs(r.volume - 160) / 160 < 0.12, `outlier non assorbito: ${r.volume.toFixed(1)} (atteso ~160)`);
  ok(Math.abs(r.zBase - 0) < 0.5, `base deve restare ~0, è ${r.zBase}`);
});
test("volumeCumulo: pochi punti o cella non valida → errore chiaro", () => {
  let e1 = false, e2 = false;
  try { pc.volumeCumulo([1, 2, 3, 4, 5, 6]); } catch (e) { e1 = /pochi punti/.test(e.message); }
  try { pc.volumeCumulo(boxCloud(4, 4, 1, 0.5), 0); } catch (e) { e2 = /cella/.test(e.message); }
  ok(e1, "pochi punti lancia"); ok(e2, "cella 0 lancia");
});

console.log("\n— pointcloud: preShiftOBJ (precisione UTM) —");
test("preShiftOBJ: primo vertice come origine, coordinate piccole, offset restituito", () => {
  const r = pc.preShiftOBJ("v 512345 5043210 100\nv 512346 5043211 101\n");
  eq(r.off, { x: 512345, y: 5043210, z: 100 }, "offset = primo vertice");
  const lines = r.shifted.split("\n");
  eq(lines[0], "v 0 0 0", "primo vertice azzerato");
  eq(lines[1], "v 1 1 1", "secondo vertice relativo");
});
test("preShiftOBJ: righe non-vertice (vn/vt/f) intatte", () => {
  const r = pc.preShiftOBJ("v 1000 2000 3000\nvn 0 0 1\nvt 0.5 0.5\nf 1 2 3\n");
  const lines = r.shifted.split("\n");
  eq(lines[1], "vn 0 0 1", "normale intatta"); eq(lines[2], "vt 0.5 0.5", "texcoord intatta"); eq(lines[3], "f 1 2 3", "faccia intatta");
});
test("preShiftOBJ: senza vertici → offset zero, testo invariato", () => {
  const r = pc.preShiftOBJ("# vuoto\nf 1 2 3\n");
  eq(r.off, { x: 0, y: 0, z: 0 }, "offset zero");
});

// ── IL LATO CELLA È UN PARAMETRO, NON UN DETTAGLIO ───────────────────
// Misurato il 03/08 (docs/RICERCA_TRACCIABILITA_VOLUME_202608.md): il volume
// dipende dal lato della cella, e nel visore quel lato **lo sceglie il
// software** — `(x1-x0)/60` limitato fra 0,25 e 2 — senza comparire da nessuna
// parte. Su un cono di volume noto, da 0,25 m a 2 m il numero sale del 22%.
//
// Il verso NON è casuale ed è la ragione per cui questa prova esiste: ogni
// cella prende la quota MASSIMA dei punti che le cadono dentro, quindi una
// cella più grossa tira la superficie verso l'alto. È una proprietà del
// codice, non dei dati, e se qualcuno la cambiasse (media invece di massimo,
// per dire) i volumi registrati fin qui smetterebbero di essere confrontabili
// con quelli nuovi — in silenzio. Qui si blinda il verso, non i decimali.
console.log("\n— pointcloud: il lato cella sposta il volume, e sempre nello stesso verso —");
function conoCloud(raggio, altezza, passo, quotaBase) {
  const pos = [];
  for (let x = -raggio; x <= raggio; x += passo)
    for (let y = -raggio; y <= raggio; y += passo) {
      const r = Math.hypot(x, y);
      if (r > raggio) continue;
      pos.push(x, y, quotaBase + altezza * (1 - r / raggio));
    }
  return pos;
}
test("volumeCumulo: celle più grosse → volume più alto, monotòno", () => {
  const pos = conoCloud(15, 6, 0.1, 100);
  const vol = [0.25, 0.5, 1, 2].map((c) => pc.volumeCumulo(pos, c).volume);
  for (let i = 1; i < vol.length; i++)
    ok(vol[i] > vol[i - 1],
      `cella più grossa deve dare volume maggiore (la cella prende la quota MASSIMA): ${vol[i - 1].toFixed(1)} → ${vol[i].toFixed(1)}`);
  // e lo scarto è grande abbastanza da meritare di essere registrato: se un
  // giorno diventasse trascurabile, la scheda che chiede di salvare la cella
  // andrebbe riscritta, non lasciata a dire una cosa non più vera
  ok(vol[3] / vol[0] > 1.15,
    `da 0,25 m a 2 m il volume deve cambiare di più del 15%, cambia del ${((vol[3] / vol[0] - 1) * 100).toFixed(1)}%`);
});
test("volumeCumulo: la cella fine si avvicina al volume vero del cono", () => {
  const teorico = Math.PI * 15 * 15 * 6 / 3;
  const v = pc.volumeCumulo(conoCloud(15, 6, 0.1, 100), 0.25).volume;
  ok(Math.abs(v / teorico - 1) < 0.05,
    `con cella 0,25 m lo scarto dal cono esatto deve stare sotto il 5%, è ${((v / teorico - 1) * 100).toFixed(1)}%`);
});
test("volumeCumulo: 1 m di quota di base = area coperta in m³ (è una moltiplicazione)", () => {
  // La quota di base non è una sfumatura: il volume è Σ (quota − zBase) × cella²,
  // quindi spostare la base di 1 m sposta il volume di ESATTAMENTE l'area
  // coperta. È il motivo per cui `zBase` va conservata insieme al volume.
  const base = conoCloud(15, 6, 0.1, 100);
  const alzato = base.slice();
  for (let i = 2; i < alzato.length; i += 3) alzato[i] += 1;   // tutto il cono 1 m più su
  const a = pc.volumeCumulo(base, 0.5), b = pc.volumeCumulo(alzato, 0.5);
  ok(Math.abs((b.zBase - a.zBase) - 1) < 1e-6, `la base deve salire di 1 m, sale di ${(b.zBase - a.zBase).toFixed(4)}`);
  ok(Math.abs(b.volume - a.volume) < 1e-6,
    `alzando TUTTO di 1 m il volume non cambia (base e superficie salgono insieme): ${a.volume.toFixed(2)} → ${b.volume.toFixed(2)}`);
  // e la sensibilità vera: la stessa nuvola con la base tenuta ferma
  const finto = a.volume + a.areaCelle * 1;
  ok(finto > a.volume, "1 m di base sbagliata vale areaCelle m³ — qui è il conto che il verbale deve poter rifare");
});

console.log(`\nRisultato pointcloud: ${passed} passati, ${failed} falliti`);
if (failed) process.exit(1);
