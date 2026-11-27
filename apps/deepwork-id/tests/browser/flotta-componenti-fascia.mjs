/* UN COMPONENTE SCADUTO AVEVA LA STESSA FASCIA COLORATA DI UNO SANO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-componenti-fascia.mjs [--porta=8993]
     node flotta-componenti-fascia.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Flotta: in `disegnaScheda()`
   (`#sch-comp`, "COMPONENTI A VITA PROPRIA") la classe del CONTENITORE
   della riga era fissa a `st-accent`, indipendentemente da `c.stato` —
   solo il piccolo badge a destra usava `clsVita[c.stato]`. Le due liste
   gemelle due righe più sopra (`#sch-sca`/`#sch-man`, scadenze e
   manutenzioni) usano già `striscia[cls] || "st-accent"` per lo stesso
   scopo. Un componente scaduto (oltre il 100% della vita attesa) aveva
   quindi lo stesso bordo colorato di uno sano.
   Il caso vero: "Escavatore E1" ha un pneumatico a 1.870 h su 2.000
   dichiarate (93,5%, "attenzione" — visibile anche senza toccare nulla).
   Qui si porta la soglia a 1.500 h (iniettando SOLO la risposta HTTP di
   flotta-data.js, mai il file su disco) per farlo cadere in "scaduto"
   (124,7%) e si confronta la fascia con quella di un componente sano
   (i denti-benna, 12,3%, mai toccati). */
import { prendiChromium, CHROMIUM } from './giro.mjs';
const chromium = await prendiChromium();

const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '8993';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

const BUONA = `{ tipo: "pneumatico", data: "2025-11-10", montatoAOre: 4000, vitaAttesaOre: 2000 },`;
const STORTA = `{ tipo: "pneumatico", data: "2025-11-10", montatoAOre: 4000, vitaAttesaOre: 1500 },`;
/* LA GUARDIA DA TOGLIERE per rimettere il difetto */
const GUARDIA = [
  `\${c.calcolabile ? (striscia[clsVita[c.stato]] || "st-accent") : "st-accent"}`,
  `st-accent`,
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
  if (p.endsWith('apps/flotta/flotta-data.js')) {
    let t = corpo.toString('utf8');
    const prima = t;
    t = t.replace(BUONA, STORTA);
    if (t === prima) throw new Error(`INIEZIONE A VUOTO: «${BUONA}» non si trova più nella demo`);
    sostituzioni++;
    corpo = Buffer.from(t, 'utf8');
  }
  if (CONTROPROVA && p.endsWith('apps/flotta/index.html')) {
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

console.log(`\n════════ Flotta: un componente scaduto ha la fascia colorata giusta${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/flotta/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
await p.click('#nav-mez');
await p.waitForTimeout(500);
await p.evaluate(() => {
  const el = document.querySelector('[data-scheda-mezzo="m1"]');
  if (el) el.click();
});
await p.waitForTimeout(800);

const righe = await p.evaluate(() => {
  const items = [...document.querySelectorAll('#sch-comp .item')];
  return items.map((el) => ({
    nome: (el.querySelector('.name') || {}).textContent || '',
    classi: el.className,
    badge: (el.querySelector('.badge') || {}).textContent || '',
  }));
});
console.log(`  righe componenti: ${JSON.stringify(righe)}`);

const pneu = righe.find((r) => /pneumatic/i.test(r.nome));
const denti = righe.find((r) => /dent/i.test(r.nome));

ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!pneu && !!denti, 'ci sono almeno le due righe (pneumatico scaduto, denti benna sano)', JSON.stringify(righe));
ok(pneu && /st-danger/.test(pneu.classi), '⛔ il pneumatico scaduto (124,7%) ha la fascia st-danger', pneu && pneu.classi);
ok(denti && /st-accent/.test(denti.classi) && !/st-danger|st-warn/.test(denti.classi),
  'i denti benna sani (12,3%) restano st-accent', denti && denti.classi);
ok(pneu && denti && pneu.classi !== denti.classi,
  'e le due fasce sono DIVERSE fra loro (uno scaduto non è indistinguibile da uno sano)',
  JSON.stringify({ pneu: pneu && pneu.classi, denti: denti && denti.classi }));

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
