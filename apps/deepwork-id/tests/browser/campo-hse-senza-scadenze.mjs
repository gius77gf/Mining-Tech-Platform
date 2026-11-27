/* IL BANNER AGGREGATO DI "CHI C'È IN SQUADRA" TACEVA SU CHI NON HA
   ANCORA NESSUN DOCUMENTO REGISTRATO IN SCUDO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-hse-senza-scadenze.mjs [--porta=8991]
     node campo-hse-senza-scadenze.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Campo (secondo giro, 18/09):
   `idoneitaDiTurno` (shared/dw-ponti.js) sa dire nove stati, incluso
   `senza-scadenze` (una persona collegata a Scudo con ZERO documenti
   registrati per lei) — distinto da `non-collegato` (nessun collegamento
   con Scudo, un lavoro non ancora fatto). Il guard del banner aggregato in
   `renderOperatori` (index.html) e il suo ripiego finale controllavano
   scadute/inScadenza/nonIdonei/conPrescrizioni/senzaData ma NON
   `senzaScadenze`: una squadra con solo persone mai verificate faceva
   scrivere «Documenti in corso di validità per TUTTE le persone in
   elenco» — falso — mentre la riga della singola persona (`notaHSE`,
   colore già corretto in `CLASSE_HSE`) diceva già «nessun documento
   registrato in Scudo».
   Il caso vero: "Anna Neri" (d4) esiste in Scudo con idoneità "idoneo" ma
   ZERO righe in `scadenzeScudo` — nessun operatore di Campo la referenzia
   nella demo. Qui si aggiunge un operatore che la collega, iniettando
   SOLO la risposta HTTP di campo-data.js (mai il file su disco). */
import { prendiChromium, CHROMIUM } from './giro.mjs';
const chromium = await prendiChromium();

const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '8991';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

const BUONA = `{ id: "o5", nome: "Youssef Amrani", ruolo: "Manutentore", squadra: "Squadra C", stato: "non-disponibile" },`;
const STORTA = BUONA + `\n    { id: "o6", nome: "Anna Neri", ruolo: "Impiegata", squadra: "Squadra C", stato: "in-forza", lavoratoreId: "d4" },`;
/* LA GUARDIA DA TOGLIERE per rimettere il difetto */
const GUARDIE = [
  [` || hse.senzaScadenze`, ``],
  [`          + (hse.senzaScadenze ? \`\${hse.senzaScadenze} \${hse.senzaScadenze === 1 ? "non ha ancora nessun documento registrato" : "non hanno ancora nessun documento registrato"} in Scudo: non è «a posto», è una persona di cui non si sa niente. \` : "")\n`, ``],
];

const { createServer } = await import('node:http');
const { readFileSync, existsSync, statSync } = await import('node:fs');
const { join, extname } = await import('node:path');
const R = process.env.DW_RADICE || '/home/user/Mining-Tech-Platform';
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let sostituzioni = 0, colpite = 0;
const server = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split('?')[0]);
  if (rotta === '/__contrassegno') { s.writeHead(200, { 'content-type': 'text/plain' }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { s.writeHead(404); return s.end('no'); }
  let corpo = readFileSync(p);
  if (p.endsWith('apps/campo/campo-data.js')) {
    let t = corpo.toString('utf8');
    const prima = t;
    t = t.replace(BUONA, STORTA);
    if (t === prima) throw new Error(`INIEZIONE A VUOTO: «${BUONA}» non si trova più nella demo`);
    sostituzioni++;
    corpo = Buffer.from(t, 'utf8');
  }
  if (CONTROPROVA && p.endsWith('apps/campo/index.html')) {
    let t = corpo.toString('utf8');
    for (const [cerca, metti] of GUARDIE) {
      const t2 = t.replace(cerca, metti);
      if (t2 === t) throw new Error(`CONTROPROVA A VUOTO: questa guardia non si trova più → ${cerca.slice(0, 60)}…`);
      t = t2; colpite++;
    }
    corpo = Buffer.from(t, 'utf8');
  }
  s.writeHead(200, { 'content-type': TIPI[extname(p)] || 'application/octet-stream' });
  s.end(corpo);
});
await new Promise((r, x) => { server.once('error', x); server.listen(PORTA, r); });
{ const r = await fetch(`${BASE}/__contrassegno`).then((x) => x.text()).catch(() => '');
  if (r !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un altro server: mi fermo.`); process.exit(2); }
}

const browser = await chromium.launch({ executablePath: CHROMIUM });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errori = [];
p.on('pageerror', (e) => errori.push(e.message));

console.log(`\n════════ Campo: chi non ha ancora un documento registrato in Scudo non sparisce dal banner${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/campo/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.evaluate(() => { if (window.go) window.go('squ'); });
await p.waitForTimeout(1000);
/* si filtra sulla sola Squadra C — Youssef (non collegato) e Anna Neri
   (collegata, zero documenti) — per isolare il caso puro dagli altri
   problemi (scadute/non-idoneo/prescrizioni) delle squadre A/B, che
   altrimenti terrebbero il guard vero anche senza la correzione. */
await p.evaluate(() => {
  const sel = document.getElementById('ope-filtro');
  if (!sel) return;
  const opt = [...sel.options].find((o) => /Squadra C/i.test(o.textContent));
  if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event('change')); }
});
await p.waitForTimeout(500);

const banner = await p.evaluate(() => {
  const el = document.getElementById('ope-hse');
  return el ? { classi: el.className, testo: el.innerText } : null;
});
console.log(`  banner: ${JSON.stringify(banner)}`);
ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!banner, 'il banner "ope-hse" esiste');
ok(banner && !/^Documenti in corso di validità per <?b?>?tutte/i.test(banner.testo) && !/tutte le persone in elenco/i.test(banner.testo),
  '⛔ il banner NON dice "tutte le persone" mentre Anna Neri non ha nessun documento registrato', banner && banner.testo);
ok(banner && /non ha ancora nessun documento registrato/i.test(banner.testo),
  'e nomina esplicitamente chi non ha ancora nessun documento registrato', banner && banner.testo);

console.log(`\n${sostituzioni} sostituzioni · ${colpite} guardie tolte (0 = niente controprova)`);
await browser.close();
server.close();
if (CONTROPROVA) {
  console.log(`\nCONTROPROVA — difetto rimesso: ${falliti} cadute su ${passati + falliti}, ${passati} rimaste in piedi.`);
  console.log(falliti > 0 ? 'controprova: il banco SA fallire' : 'controprova: NON distingue');
  process.exit(falliti > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${passati} passati, ${falliti} falliti`);
process.exit(falliti > 0 ? 1 : 0);
