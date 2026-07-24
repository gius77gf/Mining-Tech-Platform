// Parser di nuvole di punti / mesh per il visualizzatore Genesi (nuvola-poc.html).
// Estratti in un modulo a parte per: (a) essere testabili in CI (funzioni PURE,
// niente DOM: usano solo TextDecoder/DataView, disponibili anche in Node); (b)
// essere riusabili dal passo 3 (aggancio del fronte al motore volata di genesi.html).
// Contengono i 3 fix della revisione serale 22/07: downsample XYZ, precisione UTM
// (centraggio a valle, qui restano coordinate grezze), pre-shift OBJ.

export const MAXPTS = 700000;   // cap punti resi: sopra, si fa downsample (browser)

// ---- Parser XYZ / TXT: righe "x y z [r g b]" separate da spazio, virgola o ';' ----
export function parseXYZ(txt, maxpts = MAXPTS) {
  const lines = txt.split(/\r?\n/); const pos = [], col = []; let hasCol = false;
  for (const ln of lines) {
    const s = ln.trim(); if (!s || s[0] === '#') continue;
    const p = s.split(/[\s,;]+/).map(Number);
    if (p.length < 3 || !isFinite(p[0]) || !isFinite(p[1]) || !isFinite(p[2])) continue;
    pos.push(p[0], p[1], p[2]);
    if (p.length >= 6 && isFinite(p[3])) { hasCol = true; col.push(p[3] / 255, p[4] / 255, p[5] / 255); }
  }
  const total = pos.length / 3;
  if (total > maxpts) {   // nuvola grande (tipico da ODM): downsample come per il PLY
    const step = Math.ceil(total / maxpts), dp = [], dc = [];
    for (let i = 0; i < total; i++) {
      if (i % step === 0) { dp.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); if (hasCol) dc.push(col[i * 3], col[i * 3 + 1], col[i * 3 + 2]); }
    }
    return { count: dp.length / 3, pos: dp, col: hasCol ? dc : null, total, step };
  }
  return { count: total, pos, col: hasCol ? col : null };
}

// ---- Parser PLY (ascii + binary_little/big_endian) ----
const PLY_SZ = { char: 1, uchar: 1, int8: 1, uint8: 1, short: 2, ushort: 2, int16: 2, uint16: 2, int: 4, uint: 4, int32: 4, uint32: 4, float: 4, float32: 4, double: 8, float64: 8 };
const PLY_RD = {
  char: (d, o) => d.getInt8(o), uchar: (d, o) => d.getUint8(o), int8: (d, o) => d.getInt8(o), uint8: (d, o) => d.getUint8(o),
  short: (d, o, l) => d.getInt16(o, l), ushort: (d, o, l) => d.getUint16(o, l), int16: (d, o, l) => d.getInt16(o, l), uint16: (d, o, l) => d.getUint16(o, l),
  int: (d, o, l) => d.getInt32(o, l), uint: (d, o, l) => d.getUint32(o, l), int32: (d, o, l) => d.getInt32(o, l), uint32: (d, o, l) => d.getUint32(o, l),
  float: (d, o, l) => d.getFloat32(o, l), float32: (d, o, l) => d.getFloat32(o, l), double: (d, o, l) => d.getFloat64(o, l), float64: (d, o, l) => d.getFloat64(o, l)
};
export function parsePLY(buf, maxpts = MAXPTS) {
  const bytes = new Uint8Array(buf); let hdrEnd = -1; const tok = 'end_header';
  for (let i = 0; i < bytes.length - tok.length; i++) { let ok = true; for (let j = 0; j < tok.length; j++) { if (bytes[i + j] !== tok.charCodeAt(j)) { ok = false; break; } } if (ok) { hdrEnd = i + tok.length; break; } }
  if (hdrEnd < 0) throw new Error('PLY senza header');
  while (hdrEnd < bytes.length && bytes[hdrEnd] !== 10) hdrEnd++; hdrEnd++;
  const lines = new TextDecoder().decode(bytes.subarray(0, hdrEnd)).split(/\r?\n/);
  let format = 'ascii', vcount = 0, inV = false; const props = [];
  for (const ln of lines) {
    const t = ln.trim().split(/\s+/);
    if (t[0] === 'format') format = t[1];
    else if (t[0] === 'element') { inV = (t[1] === 'vertex'); if (inV) vcount = +t[2]; }
    else if (t[0] === 'property' && inV) { if (t[1] === 'list') props.push({ list: true }); else props.push({ type: t[1], name: t[t.length - 1] }); }
  }
  if (!vcount) throw new Error('PLY senza vertici');
  const idx = {}; props.forEach((p, i) => { if (p.name) idx[p.name] = i; });
  for (const n of ['x', 'y', 'z']) if (!(n in idx)) throw new Error('PLY senza coordinata ' + n);
  const hasCol = ('red' in idx) && ('green' in idx) && ('blue' in idx);
  const step = Math.max(1, Math.ceil(vcount / maxpts)); const pos = [], col = [];
  if (format === 'ascii') {
    const body = new TextDecoder().decode(bytes.subarray(hdrEnd)).split(/\r?\n/); let vi = 0;
    for (const ln of body) {
      if (vi >= vcount) break; const s = ln.trim(); if (!s) continue;
      if (vi % step === 0) { const v = s.split(/\s+/).map(Number); pos.push(v[idx.x], v[idx.y], v[idx.z]); if (hasCol) col.push(v[idx.red] / 255, v[idx.green] / 255, v[idx.blue] / 255); }
      vi++;
    }
  } else {
    const le = (format !== 'binary_big_endian'); const dv = new DataView(buf, hdrEnd);
    let stride = 0; for (const p of props) { if (p.list) throw new Error('PLY con facce/liste: caricalo come OBJ per la mesh'); stride += PLY_SZ[p.type] || 0; }
    const off = []; { let a = 0; for (const p of props) { off.push(a); a += PLY_SZ[p.type] || 0; } }
    for (let i = 0; i < vcount; i++) {
      if (i % step === 0) {
        const b = i * stride;
        pos.push(PLY_RD[props[idx.x].type](dv, b + off[idx.x], le), PLY_RD[props[idx.y].type](dv, b + off[idx.y], le), PLY_RD[props[idx.z].type](dv, b + off[idx.z], le));
        if (hasCol) col.push(PLY_RD[props[idx.red].type](dv, b + off[idx.red], le) / 255, PLY_RD[props[idx.green].type](dv, b + off[idx.green], le) / 255, PLY_RD[props[idx.blue].type](dv, b + off[idx.blue], le) / 255);
      }
    }
  }
  return { count: pos.length / 3, pos, col: hasCol ? col : null, total: vcount, step };
}

// ---- Parser LAS (nuvola binaria): è il formato PREDEFINITO con cui ODM/WebODM
// esporta la nuvola (odm_georeferenced_model.las). Header pubblico a offset fissi
// (little-endian) + record di punto. Coordinata reale = intero * scala + offset,
// calcolata in DOPPIA precisione: le UTM stanno sui milioni e — come per OBJ/PLY —
// il centraggio a valle (placeCloud) evita la perdita di Float32. Il LAZ (LAS
// compresso) NON è gestito: richiede un decompressore pesante; va riesportato in
// LAS o PLY. La firma resta "LASF" anche per il LAZ, che si riconosce dal bit 7
// del formato-punto. ----
const LAS_RGB_OFF = { 2: 20, 3: 28, 5: 28, 7: 30, 8: 30, 10: 30 };  // offset RGB nel record, per formato-punto
export function parseLAS(buf, maxpts = MAXPTS) {
  const dv = new DataView(buf);
  if (buf.byteLength < 227 || dv.getUint8(0) !== 76 || dv.getUint8(1) !== 65 || dv.getUint8(2) !== 83 || dv.getUint8(3) !== 70)
    throw new Error('LAS senza firma LASF');
  const verMinor = dv.getUint8(25);
  const ptOffset = dv.getUint32(96, true);
  let ptFormat = dv.getUint8(104);
  if (ptFormat & 0x80) throw new Error('LAS compresso (LAZ): riesportalo in LAS o PLY');
  ptFormat &= 0x3f;
  const recLen = dv.getUint16(105, true);
  let count = dv.getUint32(107, true);
  if (!count && verMinor >= 4 && buf.byteLength >= 255) count = Number(dv.getBigUint64(247, true));
  if (!count) throw new Error('LAS senza punti');
  if (recLen < 12) throw new Error('LAS: record punto troppo corto');
  const sx = dv.getFloat64(131, true), sy = dv.getFloat64(139, true), sz = dv.getFloat64(147, true);
  const ox = dv.getFloat64(155, true), oy = dv.getFloat64(163, true), oz = dv.getFloat64(171, true);
  const rgbOff = LAS_RGB_OFF[ptFormat];
  const hasCol = rgbOff != null && ptOffset + (count - 1) * recLen + rgbOff + 6 <= buf.byteLength;
  const step = Math.max(1, Math.ceil(count / maxpts));
  const pos = [], rawCol = []; let maxCol = 0;
  for (let i = 0; i < count; i++) {
    if (i % step !== 0) continue;
    const b = ptOffset + i * recLen;
    if (b + 12 > buf.byteLength) break;
    pos.push(dv.getInt32(b, true) * sx + ox, dv.getInt32(b + 4, true) * sy + oy, dv.getInt32(b + 8, true) * sz + oz);
    if (hasCol) {
      const r = dv.getUint16(b + rgbOff, true), g = dv.getUint16(b + rgbOff + 2, true), bl = dv.getUint16(b + rgbOff + 4, true);
      if (r > maxCol) maxCol = r; if (g > maxCol) maxCol = g; if (bl > maxCol) maxCol = bl;
      rawCol.push(r, g, bl);
    }
  }
  // LAS memorizza il colore in 16 bit, ma alcuni file (anche da ODM) ci mettono valori
  // a 8 bit (0-255): normalizzo sul divisore giusto per non renderli quasi neri.
  let col = null;
  if (hasCol && rawCol.length) { const d = maxCol > 255 ? 65535 : 255; col = rawCol.map(v => v / d); }
  return { count: pos.length / 3, pos, col, total: count, step };
}

// ---- Volume del ritaglio (metodo a griglia, come i tool di volumetria drone):
// i punti (x,y,z con z=quota, convenzione ODM/LAS) vengono proiettati su una
// griglia XY di lato cellM; per ogni cella si prende la quota MASSIMA (superficie)
// e si integra sopra il piano di base z=minimo del ritaglio. Assunzione ONESTA:
// il ritaglio contiene un cumulo/rilievo sopra una base ~piana — è una STIMA
// (stessa famiglia del metodo standard dei tool commerciali), non una misura
// certificata. Funziona anche su coordinate centrate (contano solo le differenze). ----
export function volumeCumulo(pos, cellM = 0.5) {
  const n = Math.floor(pos.length / 3);
  if (n < 30) throw new Error('troppi pochi punti per stimare un volume');
  if (!(cellM > 0)) throw new Error('lato cella non valido');
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity;
  for (let i = 0; i < n; i++) {
    const x = pos[3*i], y = pos[3*i+1], z = pos[3*i+2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
  }
  const W = Math.max(1, Math.ceil((maxX - minX) / cellM));
  const H = Math.max(1, Math.ceil((maxY - minY) / cellM));
  if (W * H > 4e6) throw new Error('area troppo estesa per questa cella: aumenta il lato');
  const top = new Float64Array(W * H).fill(-Infinity);
  for (let i = 0; i < n; i++) {
    const cx = Math.min(W - 1, Math.floor((pos[3*i] - minX) / cellM));
    const cy = Math.min(H - 1, Math.floor((pos[3*i+1] - minY) / cellM));
    const k = cy * W + cx, z = pos[3*i+2];
    if (z > top[k]) top[k] = z;
  }
  let vol = 0, filled = 0;
  for (let k = 0; k < W * H; k++) if (top[k] > -Infinity) { filled++; vol += (top[k] - minZ) * cellM * cellM; }
  return { volume: vol, areaCelle: filled * cellM * cellM, celle: filled, zBase: minZ, cella: cellM };
}

// ---- Pre-shift OBJ: trasla i vertici in DOPPIA precisione (primo vertice come
// origine) PRIMA di OBJLoader, che altrimenti li mette in Float32 perdendo
// precisione sulle coordinate georeferenziate (UTM ~5.000.000). ----
export function preShiftOBJ(txt) {
  const lines = txt.split(/\r?\n/); let ox = null, oy = 0, oz = 0;
  for (const ln of lines) { if (ln[0] === 'v' && ln[1] === ' ') { const p = ln.trim().split(/\s+/); ox = +p[1]; oy = +p[2]; oz = +p[3]; break; } }
  if (ox == null || !isFinite(ox)) return { shifted: txt, off: { x: 0, y: 0, z: 0 } };
  const out = lines.map(ln => {
    if (ln[0] === 'v' && ln[1] === ' ') { const p = ln.trim().split(/\s+/); return 'v ' + (+p[1] - ox) + ' ' + (+p[2] - oy) + ' ' + (+p[3] - oz) + (p.length > 4 ? ' ' + p.slice(4).join(' ') : ''); }
    return ln;
  });
  return { shifted: out.join('\n'), off: { x: ox, y: oy, z: oz } };
}
