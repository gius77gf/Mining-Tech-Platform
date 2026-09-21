/* UNA FATTURA SCARTATA DALLO SdI GONFIAVA "EMESSO CONTRO INCASSATO"
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-emesso-scartata.mjs [--porta=8996]
     node conti-emesso-scartata.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Conti: `emessoIncassato` sommava
   `importiFattura(f).totale` per ogni fattura emessa nel mese SENZA
   applicare `!statoSdi(f, oggi).nonEmessa` — la guardia già propagata a
   nove funzioni gemelle (agingIncassi/fattureOltre90/kpiFrom/
   incassoAtteso/testoSollecito/esposizioneClienti/incassoPerMese/
   estrattoContoCliente/registroVendite). Il caso vero è già nella demo:
   la fattura f4 (€ 5.900, "Calcestruzzi RG") è scartata dallo SdI il
   19/07/2026, e il Report contava comunque i suoi 5.900 € come "emesso"
   di luglio insieme agli 8.100 € della f3 — 14.000 invece di 8.100. */
import { prendiChromium, CHROMIUM } from './giro.mjs';
const chromium = await prendiChromium();

const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '8996';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

/* LA GUARDIA DA TOGLIERE per rimettere il difetto */
const GUARDIA = [
  `    if (statoSdi(f, oggi).nonEmessa) continue;\n    const k = String(f.emessa || "").slice(0, 7);`,
  `    const k = String(f.emessa || "").slice(0, 7);`,
];

const { createServer } = await import('node:http');
const { readFileSync, existsSync, statSync } = await import('node:fs');
const { join, extname } = await import('node:path');
const R = process.env.DW_RADICE || '/home/user/Mining-Tech-Platform';
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let colpite = 0;
const server = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split('?')[0]);
  if (rotta === '/__contrassegno') { s.writeHead(200, { 'content-type': 'text/plain' }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { s.writeHead(404); return s.end('no'); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith('apps/conti/conti-data.js')) {
    let t = corpo.toString('utf8');
    const [cerca, metti] = GUARDIA;
    const t2 = t.replace(cerca, metti);
    if (t2 === t) throw new Error(`CONTROPROVA A VUOTO: questa guardia non si trova più → ${cerca.slice(0, 60)}…`);
    t = t2; colpite++;
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

console.log(`\n════════ Conti: la fattura scartata dallo SdI non è "emesso" nel Report${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/conti/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
await p.evaluate(() => { if (window.go) window.go('rep'); });
await p.waitForTimeout(800);

const righe = await p.evaluate(() => [...document.querySelectorAll('#flusso-list .item')].map((el) => ({
  mese: (el.querySelector('.name') || {}).textContent || '',
  emesso: (el.querySelector('.amt-n') || {}).textContent || '',
})));
console.log(`  righe: ${JSON.stringify(righe)}`);
const luglio = righe.find((r) => /lug 2026/i.test(r.mese));

ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!luglio, 'la riga di luglio 2026 è in elenco', JSON.stringify(righe));
ok(luglio && /8\.100,00/.test(luglio.emesso) && !/14\.000/.test(luglio.emesso),
  '⛔ luglio 2026 mostra 8.100,00 € emesso (solo f3), non 14.000,00 € (f3+f4 scartata)', luglio && luglio.emesso);

console.log(`\n${colpite} guardie tolte (0 = niente controprova)`);
await browser.close();
server.close();
if (CONTROPROVA) {
  console.log(`\nCONTROPROVA — difetto rimesso: ${falliti} cadute su ${passati + falliti}, ${passati} rimaste in piedi.`);
  console.log(falliti > 0 ? 'controprova: il banco SA fallire' : 'controprova: NON distingue');
  process.exit(falliti > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${passati} passati, ${falliti} falliti`);
process.exit(falliti > 0 ? 1 : 0);
