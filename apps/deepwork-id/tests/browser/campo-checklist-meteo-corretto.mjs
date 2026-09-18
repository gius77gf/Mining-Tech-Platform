/* IL RICONTROLLO DEI FRONTI DOPO IL MALTEMPO SPARISCE DA SOLO SE IL METEO
   VIENE CORRETTO DOPO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-checklist-meteo-corretto.mjs [--porta=8993]
     node campo-checklist-meteo-corretto.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass QA su Campo (18/09), confermato
   dal vivo: `vociChecklist(meteo)` decideva la forma della lista guardando
   SOLO il meteo ATTUALE del turno. `salvaMeteo` fa un `db.aggiorna` quando il
   record del turno esiste già — niente impedisce di correggere il meteo a
   turno aperto. Se il ricontrollo dei fronti (la voce che compare quando
   piove o gela, D.P.R. 128) era stato risposto "no" mentre il cielo era
   "Pioggia", e il meteo del turno viene POI corretto a "Sereno" (l'ultimo
   salvato vince, `meteoDi`), `vociChecklist` torna a dare le nove voci fisse:
   quella risposta smette di essere anche solo ITERATA da `statoChecklist` —
   sparisce dal cartellone dal vivo, dalla riga dell'elenco, e (per
   costruzione dello stesso difetto) dal rapporto di fine giornata e dalla
   consegna di turno. Un "no" di sicurezza che si cancella da solo senza che
   nessuno lo tocchi. La correzione: `vociChecklistSalvata(meteo, esiti)`
   tiene la voce se ha già una risposta scritta, anche quando il meteo di
   oggi non la chiederebbe più. */
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

/* DATA reale di oggi (locale, stesso algoritmo di `isoLocale`): la checklist
   di Campo non ha un campo data scelto dal form, legge sempre OGGI. TURNO
   "Notte", per coerenza col banco gemello sull'obiettivo — checklist e meteo
   della dimostrazione sono array vuoti, quindi nessun turno collide. */
const now = new Date();
const DATA = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const TURNO = 'Notte';
const SQUADRA = 'Squadra A — Perforazione';

/* Nove voci fisse tutte "ok" più il ricontrollo (indice 9) risposto "no":
   esattamente lo scenario — il turno ha davvero trovato un fronte da
   ricontrollare e l'ha segnalato mentre pioveva. */
const ESITI = { ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i), 'ok'])), '9': 'no' };
const CHK_INIEZIONE = `[
    { id: "chktest1", data: "${DATA}", turno: "${TURNO}", squadra: "${SQUADRA}", esiti: ${JSON.stringify(ESITI)}, note: "", ora: "" },
  ]`;
/* Due record meteo per lo STESSO turno: pioggia (quando la checklist è stata
   compilata), poi sereno (la correzione fatta dopo). `meteoDi` fa vincere
   l'ULTIMO: oggi il meteo "vero" è sereno, ma la risposta al ricontrollo
   resta scritta. */
const MET_INIEZIONE = `[
    { data: "${DATA}", turno: "${TURNO}", cielo: "Pioggia", piste: "Bagnate", visibilita: "Buona", note: "" },
    { data: "${DATA}", turno: "${TURNO}", cielo: "Sereno", piste: "Asciutte", visibilita: "Buona", note: "corretto dopo" },
  ]`;

/* IL DIFETTO DA RIMETTERE: `vociChecklistSalvata` torna a essere un semplice
   passa-mano a `vociChecklist(meteo)`, ignorando `esiti` — esattamente il
   comportamento di prima del 18/09 sera, riprodotto sulla nuova funzione
   invece che sui cinque punti di chiamata che sostituiva. */
const DIFETTO = [
  `export function vociChecklistSalvata(meteo, esiti) {
  const base = vociChecklist(meteo);
  if (base.length > CHECKLIST_INIZIO.length) return base;
  const e = esiti || {};
  const rispostoRicontrollo = (e[String(INDICE_RICONTROLLO)] || e[INDICE_RICONTROLLO]) != null;
  return rispostoRicontrollo ? CHECKLIST_INIZIO.concat([VOCE_RICONTROLLO]) : base;
}`,
  `export function vociChecklistSalvata(meteo, esiti) {
  return vociChecklist(meteo);
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
    const t1 = t.replace('checklist: [],', `checklist: ${CHK_INIEZIONE},`);
    if (t1 === t) throw new Error('INIEZIONE A VUOTO: "checklist: []," non combacia più');
    t = t1; n++;
    const t2 = t.replace('meteo: [],', `meteo: ${MET_INIEZIONE},`);
    if (t2 === t) throw new Error('INIEZIONE A VUOTO: "meteo: []," non combacia più');
    t = t2; n++;
    iniezioni++;
    if (CONTROPROVA) {
      const t3 = t.replace(DIFETTO[0], DIFETTO[1]);
      if (t3 === t) throw new Error('CONTROPROVA A VUOTO: vociChecklistSalvata non combacia più');
      colpite++;
      t = t3;
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

console.log(`\n════════ Campo: il ricontrollo dei fronti non sparisce se il meteo viene corretto dopo${CONTROPROVA ? ' · controprova' : ''} ════════`);

await p.goto(`${BASE}/apps/campo/index.html`, { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.click('#nav-rap');
await p.waitForTimeout(500);
await p.evaluate((sq) => {
  const se = document.getElementById('chk-squadra'); if (!se) return false;
  const opt = [...se.options].find((o) => o.value === sq || o.textContent.trim() === sq);
  if (opt) { se.value = opt.value; se.dispatchEvent(new Event('change')); return true; }
  return false;
}, SQUADRA);
await p.evaluate((t) => {
  const se = document.getElementById('chk-turno'); if (!se) return false;
  const opt = [...se.options].find((o) => o.value === t || o.textContent.trim() === t);
  if (opt) { se.value = opt.value; se.dispatchEvent(new Event('change')); return true; }
  return false;
}, TURNO);
await p.waitForTimeout(500);

const board = await p.evaluate(() => {
  const el = document.getElementById('chk-board');
  return el ? { html: el.innerHTML, testo: el.innerText } : null;
});
const lista = await p.evaluate(() => {
  const el = document.getElementById('chk-list');
  return el ? { html: el.innerHTML, righe: el.querySelectorAll('.item').length } : null;
});
console.log(`  cartello: ${JSON.stringify(board && { testo: board.testo })}`);
console.log(`  righe nella lista: ${lista && lista.righe}`);

ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!!board, 'il cartello "chk-board" esiste');
ok(!!lista && lista.righe === 10, '⛔ la lista mostra ancora le DIECI voci (il ricontrollo non è sparito dallo schermo)', lista && lista.righe);
ok(board && /class="board warn"/.test(board.html), '⛔ il cartello resta "warn" (voce non a posto), non torna verde/neutro', board && board.html.slice(0, 200));
ok(board && /voce non a posto/i.test(board.testo), '⛔ il cartello nomina la voce non a posto', board && board.testo);
ok(board && /\/10/.test(board.testo), 'il totale delle risposte conta ancora dieci voci, non nove (".../10")', board && board.testo);
const rigaRicontrollo = await p.evaluate(() => {
  const items = [...document.querySelectorAll('#chk-list .item')];
  const ultima = items[items.length - 1];
  return ultima ? { classe: ultima.className, testo: ultima.innerText } : null;
});
ok(!!rigaRicontrollo && /st-danger/.test(rigaRicontrollo.classe), '⛔ l\'ultima riga (il ricontrollo) è quella "non a posto" (st-danger)', rigaRicontrollo);
ok(!!rigaRicontrollo && /già data quando il meteo lo chiedeva/i.test(rigaRicontrollo.testo),
  'e la sua etichetta dice che la risposta è già stata data, non finge che il meteo di oggi la chieda ancora', rigaRicontrollo && rigaRicontrollo.testo);

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
