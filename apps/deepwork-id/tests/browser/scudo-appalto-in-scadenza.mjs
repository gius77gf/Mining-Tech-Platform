/* UN APPALTO CON LA QUALIFICA IN SCADENZA USCIVA "A POSTO", VERDE, MUTO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-appalto-in-scadenza.mjs [--porta=8988]
     node scudo-appalto-in-scadenza.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Scudo (18/09): `statoAppalto`
   (scudo-data.js) escludeva `qualifica.esito === "in-scadenza"` sia da
   `problemi` sia da `ignoti` — non finiva in NESSUNO dei due elenchi che
   alimentano la riga dell'appalto (`dire` in index.html), quindi un
   appalto la cui impresa ha un documento di qualifica in scadenza usciva
   verde "A posto", muto, mentre la sezione "Imprese esterne" della stessa
   pagina, sullo STESSO dato, mostra correttamente "In scadenza".
   Il caso vero è già nella demo: "Autotrasporti Valle srl" (ap1) ha un
   DURC con scadenza 2026-11-30, e il suo appalto "pa1" (Trasporto inerti
   al piazzale) è altrimenti perfetto (coordinamento sottoscritto, costi
   indicati). Qui si porta la scadenza del DURC a pochi giorni da "oggi"
   (iniettando SOLO la risposta HTTP, mai il file su disco) per farlo
   cadere nella finestra "in-scadenza" (30 giorni), e si guarda la riga
   dell'appalto — non quella dell'impresa, che era già giusta. */
import { prendiChromium, CHROMIUM } from './giro.mjs';
const chromium = await prendiChromium();

const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '8988';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

/* la scadenza vera della demo, e quella vicina che la porta "in-scadenza"
   (17 giorni da una data fissa nel passato recente della sessione — vedi
   CLAUDE.md sulla differenza fra un orologio fermo e uno che cammina: qui
   basta che sia "presto" rispetto a un oggi qualunque del 2026). */
const BUONA = `appaltatoreId: "ap1", tipoQualifica: "durc", scadenza: "2026-11-30", stato: "valido"`;
const STORTA = `appaltatoreId: "ap1", tipoQualifica: "durc", scadenza: "2026-10-05", stato: "valido"`;
/* ⛔ LE DUE GUARDIE — la riga da togliere per rimettere il difetto */
const GUARDIE = [
  [`  else if (qualifica.esito === "in-scadenza") avvisi.push(qualifica.perche);\n  else if (qualifica.esito !== "verificato") problemi.push(qualifica.perche);`,
   `  else if (qualifica.esito !== "verificato" && qualifica.esito !== "in-scadenza") problemi.push(qualifica.perche);`],
];

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
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
  if (p.endsWith('apps/scudo/scudo-data.js')) {
    let t = corpo.toString('utf8');
    const prima = t;
    t = t.replace(BUONA, STORTA);
    if (t === prima) throw new Error(`INIEZIONE A VUOTO: «${BUONA}» non si trova più nella demo`);
    sostituzioni++;
    if (CONTROPROVA) {
      for (const [cerca, metti] of GUARDIE) {
        const t2 = t.replace(cerca, metti);
        if (t2 === t) throw new Error(`CONTROPROVA A VUOTO: questa guardia non si trova più → ${cerca.slice(0, 60)}…`);
        t = t2; colpite++;
      }
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

console.log(`\n════════ Scudo: una qualifica in scadenza non sparisce dalla riga dell'appalto${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/scudo/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.evaluate(() => { if (window.go) window.go('appa'); });
await p.waitForTimeout(800);

const riga = await p.evaluate(() => {
  const el = document.querySelector('[data-appa="pa1"]');
  if (!el) return null;
  const badge = el.querySelector('.badge');
  const hint = el.nextElementSibling && el.nextElementSibling.classList.contains('form-hint')
    ? el.nextElementSibling.textContent : '';
  return { classi: el.className, badge: badge ? badge.textContent.trim() : '', hint };
});
console.log(`  riga pa1: ${JSON.stringify(riga)}`);
const riep = await p.evaluate(() => {
  const el = document.getElementById('appa-riep');
  return el ? { classi: el.className, testo: el.innerText } : null;
});
console.log(`  riepilogo: ${JSON.stringify(riep)}`);

ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!riga, 'la riga dell\'appalto "Trasporto inerti al piazzale" è in elenco');
ok(riga && !/\bok\b/i.test(riga.badge) && !/^A posto$/i.test(riga.badge),
  '⛔ il badge NON è "A posto" — la qualifica in scadenza dell\'impresa non sparisce', riga && riga.badge);
ok(riga && /scadenza/i.test(riga.hint),
  'e sotto la riga compare la ragione, con la parola "scadenza"', riga && riga.hint);
/* ⚠️ Il dettaglio numerico porta SEMPRE l'etichetta "in scadenza" (anche a
   zero): non basta cercare la parola nel testo intero, va guardato il
   TITOLO aggregato (`rA.testo`), che la nomina solo quando il conto non è
   zero — è la riga sulla prima newline. */
const titolo = riep ? riep.testo.split('\n')[0] : '';
ok(/in scadenza/i.test(titolo),
  'e il TITOLO del riepilogo (non solo il dettaglio numerico, che porta sempre l\'etichetta) nomina gli appalti "in scadenza"',
  titolo);

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
