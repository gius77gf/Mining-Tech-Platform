/* «SCARICA TUTTO» SCARICA DAVVERO TUTTO (11/09).
   ─────────────────────────────────────────────────────────────────
   Dalla ricerca trasversale dell'11/09: 34 collezioni su 65 non avevano
   nessuna uscita delle righe. Adesso ogni app ha in fondo al Quadro il
   bottone «Scarica tutto (JSON)», montato da `montaScaricaTutto` di
   `dw-shell.js` con l'elenco dichiarato `<APP>_COLLEZIONI`.

   Questo banco preme il bottone in ogni app, APRE il file scaricato e
   pretende che dentro ci siano TUTTE le collezioni dichiarate (lette
   dall'intestazione stessa del file, `elenco`, che la pagina passa dal
   modulo), che nessuna manchi e che l'intestazione dica di che app è. Le
   prove `node` sanno che il compositore è giusto; solo il browser sa se il
   bottone legge davvero le collezioni e se il file esce.

   Uso:
     node scarica-tutto.mjs [porta]        (serve un server statico sulla porta: lo alza tutti.mjs)
     node scarica-tutto.mjs --controprova  (pretende una collezione inventata: DEVE cadere)
     --solo=campo,terra                    (solo alcune app) */
import { readFileSync } from 'node:fs';
import { prendiChromium, CHROMIUM, apriSuperficie } from './giro.mjs';

const args = process.argv.slice(2);
const CONTROPROVA = args.includes('--controprova');
const PORTA = Number(args.find((a) => /^\d+$/.test(a))) || 8899;
const SOLO = (args.find((a) => a.startsWith('--solo=')) || '').slice(7).split(',').filter(Boolean);

const APP = ['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].filter((a) => !SOLO.length || SOLO.includes(a));
if (SOLO.length && APP.length !== SOLO.length) { console.log(`⛔ --solo= nomina app che non esistono: ${SOLO.filter((s) => !APP.includes(s)).join(', ')}`); process.exit(2); }

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0, nonMisurate = 0;

for (const nome of APP) {
  const { ctx, p } = await apriSuperficie(browser, { nome, via: `/apps/${nome}/index.html`, porta: PORTA });
  const c = await p.evaluate(() => { const b = document.getElementById('btn-scarica-tutto'); return b ? { hint: (b.closest('.tools').nextElementSibling || {}).innerText || '' } : null; });
  if (!c) { nonMisurate++; console.log(`  NON MISURATA  ${nome}: il bottone «Scarica tutto» non c'è nella pagina`); await ctx.close(); continue; }
  let file = null, testo = '';
  try {
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), p.click('#btn-scarica-tutto')]);
    file = dl.suggestedFilename(); testo = readFileSync(await dl.path(), 'utf8');
  } catch (e) { ko++; console.log(`  KO  ${nome}: il bottone non ha scaricato niente (${String(e.message || e).slice(0, 80)})`); await ctx.close(); continue; }
  let P = null;
  try { P = JSON.parse(testo); } catch (e) { ko++; console.log(`  KO  ${nome}: il file ${file} non è JSON leggibile`); await ctx.close(); continue; }
  const attese = Array.isArray(P.elenco) ? P.elenco.slice() : [];
  if (CONTROPROVA) attese.push('collezione-inventata-apposta');
  const dentro = Object.keys(P.collezioni || {});
  const mancanti = attese.filter((n) => !dentro.includes(n));
  const problemi = [];
  if (P.app !== nome) problemi.push(`l'intestazione dice app «${P.app}», non «${nome}»`);
  if (!attese.length) problemi.push('il file non porta l\'elenco delle collezioni');
  if (mancanti.length) problemi.push(`collezioni dichiarate e non nel file: ${mancanti.join(', ')}`);
  if ((P.mancanti || []).length) problemi.push(`il file stesso dichiara letture mancate: ${P.mancanti.join(', ')}`);
  if (!/^deepwork-[a-z]+-[a-z0-9-]+-\d{8}-\d{4}\.json$/.test(String(file))) problemi.push(`il nome del file non è quello promesso: ${file}`);
  const righe = Object.values(P.collezioni || {}).reduce((a, r) => a + (Array.isArray(r) ? r.length : 0), 0);
  if (problemi.length) { ko++; console.log(`  KO  ${nome}: ${problemi.join(' · ')}`); }
  else { ok++; console.log(`  ok  ${nome}: ${file} — ${dentro.length} collezioni, ${righe} righe, nessuna mancante (la pagina promette ${(c.hint.match(/\d+/) || ['?'])[0]} collezioni)`); }
  await ctx.close();
}

await browser.close();
console.log(`\n${ok} app scaricano tutto, ${ko} no, ${nonMisurate} senza bottone (NON misurate: non vuol dire a posto)`);
if (CONTROPROVA) {
  if (ko === APP.length) { console.log('La controprova ha visto la collezione inventata in tutte le app: il banco sa fallire.'); process.exit(0); }
  console.log(`\n⚠️ CONTROPROVA INCOMPLETA: solo ${ko} app su ${APP.length} hanno segnalato la collezione inventata.`); process.exit(1);
}
process.exit(ko > 0 || nonMisurate > 0 ? 1 : 0);
