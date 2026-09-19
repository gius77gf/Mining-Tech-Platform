/* IL RIQUADRO "OBIETTIVO TURNO" NON DISTINGUEVA "PRESTO PER SAPERLO" DA
   "INDIETRO RISPETTO AL RITMO DEL TURNO"
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-obiettivo-ritmo.mjs [--porta=8992]
     node campo-obiettivo-ritmo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dalla ricerca continua (18/09, ottavo giro su Campo,
   metodo Short Interval Control): `statoObiettivo` decideva il livello
   ("ok"/"warn"/"atteso") SOLO dalla percentuale sull'obiettivo finale, mai
   da quanto tempo del turno era già passato. Un turno fermo al 20%
   dell'obiettivo alle 10:00 di un turno 06:00-14:00 (metà turno già
   trascorsa: dovrebbe essere al 50% per essere in pari) restava "atteso" —
   lo stesso colore neutro di un turno appena iniziato — invece di
   diventare "warn" come i sistemi di settore già fanno (SIC: confronto
   coi dati A QUELL'ORA, non solo con l'obiettivo finale).
   `inizioTurno`/`fineTurno` esistevano già nello stesso modulo (servono al
   riposo fra turni) ma nessuna chiamata li collegava a `statoObiettivo`.
   Qui l'orologio si fissa con `Date.now` (la sola chiamata che
   `renderObiettivo` usa per il ritmo) e lo scenario si sceglie coi campi
   data/turno del form, non iniettando nel modulo: bastano un obiettivo,
   una durata dichiarata e un rapportino, tutti per lo stesso giorno/turno
   di comodo (mai la dimostrazione reale, che cambia con l'orologio vero). */
import { prendiChromium, CHROMIUM } from './giro.mjs';
const chromium = await prendiChromium();

const PORTA = (process.argv.find((a) => a.startsWith('--porta=')) || '').split('=')[1] || '8992';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

/* DATA/TURNO DI COMODO: turno NOTTE (22:00-06:00), scelto apposta perché
   nessun rapportino/obiettivo della dimostrazione usa quel turno — niente
   collide con ciò che la demo ha già per Mattina/Pomeriggio di "oggi".
   8 ore dichiarate → le 02:00 (4h dopo l'inizio) sono esattamente il 50%
   del turno. `Date.now` viene fissato lì sotto. */
const DATA = "2026-09-18", TURNO = "Notte";
const INIZIO_MS = new Date(2026, 8, 18, 22, 0, 0, 0).getTime();   // mese 0-based: 8 = settembre
const META_MS = INIZIO_MS + 4 * 3600000;                           // le 02:00 (giorno dopo): metà turno

/* Appesi in FONDO a ciascun array (non subito dopo `[`): `obiettivoDi` e
   `durataTurnoDi` fanno vincere l'ULTIMO che combacia, quindi anche se un
   giorno la dimostrazione avesse già qualcosa per questo stesso
   data+turno, il nostro scenario vince comunque. */
const DEMO_APPEND = `{ data: "${DATA}", turno: "${TURNO}", unita: "t", valore: 100 },\n  ],`;
const RIC_OBIE = /obiettivi: \[([\s\S]*?)\n  \],/;
const DUR_APPEND = `{ data: "${DATA}", turno: "${TURNO}", minuti: 480 },\n  ],`;
const RIC_DUR = /durate: \[([\s\S]*?)\n  \],/;
/* Rapportino con SOLO 20 t: 20% fatto contro il 50% di turno trascorso —
   il caso che questo banco vuole misurare. Il turno Notte non ha altri
   rapportini nella demo, quindi la somma resta esattamente 20. */
const RAP_INIEZIONE = `  rapportini: [\n    { id: "rrt1", data: "${DATA}", turno: "${TURNO}", stato: "inviato", titolo: "Prova ritmo", prodQta: 20, prodUnita: "t" },`;
const RIC_RAP = `  rapportini: [`;

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09:
   non solo la firma, anche tutto il corpo che legge `durate`/`adesso` — se
   no la funzione vecchia lancerebbe un ReferenceError invece di tornare
   semplicemente al comportamento di prima. */
const DIFETTO = [
  "export function statoObiettivo(ob, rapportini, attivita, durate, adesso) {",
  "export function statoObiettivo(ob, rapportini, attivita) {",
];
const DIFETTO2 = [
  `  let livello = pct >= 100 ? "ok" : pct >= 85 ? "warn" : "atteso";
  let frazioneTempo = null;
  if (livello === "atteso" && Number.isFinite(adesso)) {
    const inizio = inizioTurno(ob.data, ob.turno);
    const fine = fineTurno(durate, ob.data, ob.turno);
    if (inizio !== null && fine !== null && fine > inizio) {
      frazioneTempo = Math.round(100 * Math.min(1, Math.max(0, (adesso - inizio) / (fine - inizio))));
      // indietro rispetto al ritmo lineare del turno: la frazione di
      // obiettivo fatta è minore della frazione di turno già trascorsa.
      // Nessuna soglia inventata — un margine non ha una fonte verificata
      // (la ricerca l'ha cercato e dichiarato "non trovato"), quindi si
      // confronta il ritmo direttamente, non un ritmo-meno-tolleranza.
      if (pct < frazioneTempo) livello = "warn";
    }
  }
  return {
    data: ob.data, turno: ob.turno, unita, obiettivo, fatto,
    mancante: Math.max(0, Math.round((obiettivo - fatto) * 100) / 100),
    scarto, pct, frazioneTempo,
    livello,
  };
}`,
  `  return {
    data: ob.data, turno: ob.turno, unita, obiettivo, fatto,
    mancante: Math.max(0, Math.round((obiettivo - fatto) * 100) / 100),
    scarto, pct,
    livello: pct >= 100 ? "ok" : pct >= 85 ? "warn" : "atteso",
  };
}`,
];

const { createServer } = await import('node:http');
const { readFileSync, existsSync, statSync } = await import('node:fs');
const { join, extname } = await import('node:path');
const R = process.env.DW_RADICE || '/home/user/Mining-Tech-Platform';
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let iniezioni = 0, colpite = 0;
const server = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split('?')[0]);
  if (rotta === '/__contrassegno') { s.writeHead(200, { 'content-type': 'text/plain' }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { s.writeHead(404); return s.end('no'); }
  let corpo = readFileSync(p);
  if (p.endsWith('apps/campo/campo-data.js')) {
    let t = corpo.toString('utf8');
    let n = 0;
    t = t.replace(RIC_OBIE, (m0, dentro) => { n++; return `obiettivi: [${dentro}\n    ${DEMO_APPEND}`; });
    t = t.replace(RIC_DUR, (m0, dentro) => { n++; return `durate: [${dentro}\n    ${DUR_APPEND}`; });
    const t2r = t.replace(RIC_RAP, RAP_INIEZIONE);
    if (t2r !== t) n++;
    t = t2r;
    if (n < 3) throw new Error(`INIEZIONE A VUOTO: solo ${n}/3 ancoraggi (obiettivi/durate/rapportini) hanno combaciato`);
    iniezioni++;
    corpo = Buffer.from(t, 'utf8');
    if (CONTROPROVA) {
      let t2 = t.replace(DIFETTO[0], DIFETTO[1]);
      if (t2 === t) throw new Error('CONTROPROVA A VUOTO: la firma di statoObiettivo non combacia più');
      colpite++;
      const t3 = t2.replace(DIFETTO2[0], DIFETTO2[1]);
      if (t3 === t2) throw new Error('CONTROPROVA A VUOTO: il corpo del ritmo non combacia più');
      colpite++;
      corpo = Buffer.from(t3, 'utf8');
    }
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
/* Fissa l'orologio della pagina PRIMA che qualunque script parta: la sola
   chiamata che conta per questo banco è `Date.now()` dentro
   `renderObiettivo` — `new Date()` senza argomenti resta quella vera, ma
   qui non serve toccarla perché data/turno si scelgono dal form, non da
   OGGI/turnoCorrente(). */
await p.addInitScript((meta) => { window.Date.now = () => meta; }, META_MS);
const errori = [];
p.on('pageerror', (e) => errori.push(e.message));

console.log(`\n════════ Campo: l'obiettivo di turno distingue "presto" da "indietro rispetto al ritmo"${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/campo/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.click('#nav-rap');
await p.waitForTimeout(500);
await p.evaluate((d) => {
  const di = document.getElementById('ob-data'); if (di) { di.value = d.data; di.dispatchEvent(new Event('change')); }
}, { data: DATA });
await p.evaluate((t) => {
  const se = document.getElementById('ob-turno'); if (!se) return false;
  const opt = [...se.options].find((o) => o.value === t || o.textContent.trim() === t);
  if (opt) { se.value = opt.value; se.dispatchEvent(new Event('change')); return true; }
  return false;
}, TURNO);
await p.waitForTimeout(500);

const cartello = await p.evaluate(() => {
  const el = document.getElementById('ob-stato');
  return el ? { html: el.innerHTML, testo: el.innerText } : null;
});
console.log(`  cartello: ${JSON.stringify(cartello && { testo: cartello.testo })}`);
ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!cartello, 'il cartello "ob-stato" esiste');
ok(cartello && /20%/.test(cartello.testo), 'mostra il 20% fatto (il rapportino iniettato)', cartello && cartello.testo);
ok(cartello && /class="board warn"/.test(cartello.html), '⛔ il riquadro è "warn" (indietro), non il neutro "atteso"', cartello && cartello.html.slice(0, 200));
ok(cartello && /indietro rispetto al ritmo del turno/i.test(cartello.testo),
  'e il testo nomina esplicitamente il ritmo del turno, non solo "manca X"', cartello && cartello.testo);

console.log(`\n${iniezioni} iniezioni di scenario · ${colpite} difetti rimessi (0 = niente controprova)`);
await browser.close();
server.close();
if (CONTROPROVA) {
  console.log(`\nCONTROPROVA — difetto rimesso: ${falliti} cadute su ${passati + falliti}, ${passati} rimaste in piedi.`);
  console.log(falliti > 0 ? 'controprova: il banco SA fallire' : 'controprova: NON distingue');
  process.exit(falliti > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${passati} passati, ${falliti} falliti`);
process.exit(falliti > 0 ? 1 : 0);
