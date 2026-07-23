// ============================================================
// Test dei parser di nuvole/mesh del visualizzatore Genesi
// (apps/genesi/pointcloud.js): sono il pezzo che legge i file del
// drone/ODM per il flusso drone→fronte→volata. Funzioni pure, testabili
// in Node. Blindano i 3 fix della revisione serale 22/07:
// downsample XYZ, precisione (pre-shift OBJ) e robustezza PLY.
// ============================================================
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const pc = await import(join(HERE, "../../genesi/pointcloud.js"));

let passed = 0, failed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); } };
const eq = (got, exp, why) => { const a = JSON.stringify(got), b = JSON.stringify(exp); if (a !== b) throw new Error(`${why}: atteso ${b}, ottenuto ${a}`); };
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
// Costruisce un LAS 1.2 minimale in memoria: header pubblico (227 byte) + N record.
// Formato-punto 0 (solo XYZ, 20 byte) o 2 (con RGB, 26 byte).
function lasBuf(pts, { fmt = 0, scale = [0.01, 0.01, 0.01], off = [500000, 5000000, 0], ver = [1, 2], legacyCount = null } = {}) {
  const recLen = fmt === 2 ? 26 : 20;
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
    if (fmt === 2 && p.length >= 6) { dv.setUint16(b + 20, p[3], true); dv.setUint16(b + 22, p[4], true); dv.setUint16(b + 24, p[5], true); }
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

console.log(`\nRisultato pointcloud: ${passed} passati, ${failed} falliti`);
if (failed) process.exit(1);
