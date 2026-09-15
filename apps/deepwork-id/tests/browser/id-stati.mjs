/* LE PAGINE DI DEEPWORK ID NEGLI STATI VERI: membro, senza organizzazione,
   ospite del tour — e i bottoni premuti.
   ────────────────────────────────────────────────────────────────────────
   ⛔ FINO AL 04/09 NESSUN BANCO AVEVA MAI VISTO QUESTE PAGINE DA CONNESSI.
   `apriSuperficie` monta il finto Firebase solo per il core; e anche montandolo,
   `finto-firebase.mjs` risponde `export default {}` per `firebase-auth.js` e
   `firebase-functions.js`, mentre l'SDK importa NOMI da tutt'e due: l'import
   fallisce al collegamento e le quattro pagine scivolano nel modo «Backend non
   ancora configurato». Cioè ogni banco — contrasto, id doppi, fuori schermo,
   bersagli di tocco — ha sempre misurato l'ANTEPRIMA, mai il prodotto che un
   cliente vede dopo l'accesso. Con `finto-id.mjs` l'SDK parte e le pagine
   raggiungono gli stati che esistono davvero.

   Quello che è uscito alla prima passata (04/09), tutto misurato e corretto:
   · profilo: «attiva» per un'app la decideva la pagina con
     `e.validUntil.toDate()` — copia più debole di `_entitlementAttivo` dell'SDK,
     che accetta anche stringhe ISO e millisecondi. Con una scadenza scritta
     come stringa la pagina moriva nel `catch`, diceva «Backend non ancora
     configurato» a un membro connesso e lasciava la griglia del MOCKUP;
   · profilo e amministrazione: `#msg` senza nessuna regola `.msg` — testo
     nudo, senza fondo né bordo, 566 px sotto il bottone e fuori dalla finestra;
   · profilo: «Crea» col nome vuoto partiva; l'organizzazione creata non
     compariva nell'elenco finché non si ricaricava;
   · amministrazione: «scade tra 1 giorni», «scade tra 0 giorni» su un invito
     già scaduto, «disabled» in inglese, e la guardia sull'anteprima che
     rispondeva a QUALUNQUE tocco della pagina (anche nel campo dell'email per
     scriverci) mentre nel modo vivo rileggeva membri e inviti a ogni click;
   · accesso: «Qualcosa non ha funzionato» con la password vuota, «Email o
     password non corretti» dopo aver chiesto una password NUOVA;
   · i collegamenti in linea alti 15 px contro i 44 di `--tap`.

   ⚠️ I codici d'errore che il finto restituisce (`auth/missing-password`,
   `auth/user-not-found`, `auth/popup-closed-by-user`…) sono quelli documentati
   dall'SDK Firebase v10: riprodotti, non misurati contro Firebase vero.

   Uso:  node id-stati.mjs 8823            (oppure --porta=8823)
         node id-stati.mjs 8823 --controprova   rimette i difetti nel corpo
                                                servito: DEVE cadere
*/
import { prendiChromium, CHROMIUM } from './giro.mjs';
import { montaFintoId, DATI_ORG } from './finto-id.mjs';

const args = process.argv.slice(2);
const CONTROPROVA = args.includes('--controprova');
const PORTA = Number((args.find((a) => a.startsWith('--porta=')) || '').slice(8)) || Number(args.find((a) => /^\d+$/.test(a))) || 8823;
const BASE = `http://127.0.0.1:${PORTA}`;

let ok = 0, ko = 0, misurate = 0;
const prova = (n, c, e) => {
  misurate++;
  if (c) { ok++; console.log('  ok  ' + n); }
  else { ko++; console.log('  KO  ' + n + (e !== undefined ? '\n        -> ' + JSON.stringify(e).slice(0, 300) : '')); }
};

/* I DIFETTI, per pagina (il percorso è quello dalla radice del repository:
   `iniezioni-fresche.mjs` lo legge e va a controllare che ogni pezzo esista
   ANCORA lì — con il solo nome del file cercava nel core): [cerca, sostituisci]. Ognuno è il difetto VERO
   com'era nel sorgente prima del 04/09, non una caricatura. Dove il prodotto è
   difeso due volte (campo vuoto: la guardia della pagina E la traduzione del
   codice) si tolgono TUTT'E DUE, se no la controprova non distingue. */
const DIFETTI = {
  'apps/deepwork-id/index.html': [
    ["if (!campiPieni('login-email', 'login-pass')) return; ", ''],
    ["if (c.includes('missing-password')) return 'Scrivi la password.';", ''],
    ["if (c.includes('user-not-found') || c.includes('invalid-email')) { msg(", 'if (false) { msg('],
    ['.switch a { display: inline-block; padding: 13px 6px; margin: -13px -6px; }', ''],
  ],
  'apps/deepwork-id/profilo.html': [
    ['const on = !!(e && e.attivo);', 'const on = !!(e && e.active && (!e.validUntil || e.validUntil.toDate() > new Date()));'],
    ["    $('new-org').value = '';\n    await disegnaOrgs();\n    await disegnaApp();", "    $('new-org').value = '';"],
    ['.msg.info  { display: block; background: rgba(199,183,148,.10); border: 1px solid var(--border2); color: var(--muted2); }', ''],
  ],
  'apps/deepwork-id/admin.html': [
    ['if (n < 0) return `scaduto il ${data}`;', ''],
    ['if (n === 0) return `scade oggi (${data})`;', ''],
    ['if (n === 1) return `scade domani (${data})`;', ''],
    ['${esc(STATO[m.status] || m.status || \'\')}', '${esc(m.status || \'\')}'],
    ['    if (!rm && !rv) return false;\n    if (!VIVO) return anteprima();', '    if (!VIVO) return anteprima();\n    if (!rm && !rv) return false;'],
    ["esito('Ruolo aggiornato.', 'ok')", "msg('Ruolo aggiornato.')"],
    ["for (const i of ['inv-email', 'inv-role', 'btn-invite']) $(i).disabled = true;", ''],
    ['width: auto; min-height: var(--tap); padding: 4px 10px; font-size: 11px;', 'width: auto; min-height: 34px; padding: 4px 10px; font-size: 11px;'],
  ],
  'apps/deepwork-id/non-autorizzato.html': [
    ['.foot-links a, #btn-reverify { display: inline-block; padding: 13px 6px; margin: -13px -6px; }', ''],
  ],
};
/* si conta per INIEZIONE, non per caricamento: le pagine si aprono più volte */
const rimessi = new Set(); let attesi = 0;
for (const v of Object.values(DIFETTI)) attesi += v.length;

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });

async function apri(file, scenario, W = 390) {
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, locale: 'it-IT', serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  if (CONTROPROVA) {
    await p.route(`**/apps/deepwork-id/${file}`, async (r) => {
      const res = await r.fetch();
      let corpo = await res.text();
      for (const [cerca, metti] of DIFETTI['apps/deepwork-id/' + file] || []) {
        /* ⚠️ un replace che non trova niente non fallisce: si conta, e alla
           fine si pretende che TUTTI abbiano trovato il loro pezzo */
        if (corpo.includes(cerca)) { corpo = corpo.split(cerca).join(metti); rimessi.add(file + '|' + cerca); }
        else console.error(`  ✗ ${file}: l'iniezione non trova «${cerca.slice(0, 60)}»`);
      }
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: corpo });
    });
  }
  await montaFintoId(p, scenario);
  await p.goto(`${BASE}/apps/deepwork-id/${file}`, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  return { ctx, p, errori };
}
const testoMsg = (p) => p.evaluate(() => (document.getElementById('msg') || { textContent: '' }).textContent.trim());
const stileMsg = (p) => p.evaluate(() => { const m = document.getElementById('msg'); const cs = getComputedStyle(m); const r = m.getBoundingClientRect(); return { bg: cs.backgroundColor, bordo: cs.borderTopWidth, h: r.height }; });
const altezzaTocco = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }, sel);

/* ═══ ACCESSO ═══ */
console.log('\n══ index.html');
{
  const { ctx, p, errori } = await apri('index.html', { stato: 'anonymous' }, 320);
  await p.fill('#login-email', 'titolare@cava-alfa.it');
  await p.click('#btn-login'); await p.waitForTimeout(500);
  const m = await testoMsg(p);
  prova(`con la password vuota il messaggio dice che cosa manca («${m}»)`, /password/i.test(m) && !/qualcosa/i.test(m), m);
  const t = await altezzaTocco(p, '#to-register');
  prova(`«Registrati» risponde al dito su almeno 40 px (${t && t.h})`, t && t.h >= 40, t);
  prova('nessun errore di pagina', errori.length === 0, errori);
  await ctx.close();
}
{
  const { ctx, p } = await apri('index.html', { stato: 'anonymous', errori: { sendPasswordResetEmail: 'auth/user-not-found' } });
  await p.fill('#login-email', 'nessuno@esempio.it');
  await p.click('#btn-reset'); await p.waitForTimeout(500);
  const m = await testoMsg(p);
  prova(`«Password dimenticata?» su un'email sconosciuta non parla di password sbagliata («${m.slice(0, 60)}…»)`,
    !/password non corretti/i.test(m) && m.includes('nessuno@esempio.it'), m);
  await ctx.close();
}

/* ═══ PROFILO ═══ */
console.log('\n══ profilo.html');
{
  const dati = DATI_ORG();
  dati['organizations/org_cava_alfa/entitlements'].push({ id: 'conti', active: true, validUntil: '2999-01-01T00:00:00Z' });
  const { ctx, p, errori } = await apri('profilo.html', { stato: 'member', dati });
  const m = await testoMsg(p);
  const tile = await p.$$eval('#apps-grid .app-tile', (e) => e.map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  prova('un abbonamento con la scadenza scritta come stringa ISO non manda la pagina nel modo «backend non configurato»', !/backend/i.test(m), m);
  prova(`e l'app con quella scadenza è «Attiva» (${tile.find((x) => x.startsWith('Conti'))})`, tile.includes('ContiAttiva'), tile);
  prova('le app scadute o spente restano «Non inclusa» (Campo scaduta ieri, Flotta active:false)', tile.includes('CampoNon inclusa') && tile.includes('FlottaNon inclusa'), tile);
  await p.click('#btn-create-org'); await p.waitForTimeout(500);
  const vuoto = await testoMsg(p);
  prova(`«Crea» col nome vuoto non parte e lo dice («${vuoto}»)`, /nome/i.test(vuoto), vuoto);
  const chiamateVuoto = await p.evaluate(() => (window.__chiamateId || []).filter((c) => c.n === 'createOrganization').length);
  prova('e il server non è stato chiamato', chiamateVuoto === 0, chiamateVuoto);
  await p.fill('#new-org', 'Cava Nuova Srl');
  await p.click('#btn-create-org'); await p.waitForTimeout(700);
  const nomi = await p.$$eval('#orgs-list .name', (e) => e.map((x) => x.textContent));
  prova(`dopo «Crea» l'organizzazione nuova è nell'elenco senza ricaricare (${nomi.join(', ')})`, nomi.includes('org_nuova'), nomi);
  const st = await stileMsg(p);
  prova(`il messaggio ha un fondo e un bordo, non è testo nudo (bg ${st.bg}, bordo ${st.bordo})`, st.h > 0 && st.bg !== 'rgba(0, 0, 0, 0)' && st.bordo !== '0px', st);
  prova('nessun errore di pagina', errori.length === 0, errori);
  await ctx.close();
}

/* ═══ AMMINISTRAZIONE ═══ */
console.log('\n══ admin.html');
{
  const { ctx, p, errori } = await apri('admin.html', { stato: 'member', dati: DATI_ORG() }, 320);
  const inviti = await p.$$eval('#inv-list .meta', (e) => e.map((x) => x.textContent.trim()));
  const membri = await p.$$eval('#mem-list .meta', (e) => e.map((x) => x.textContent.trim()));
  prova('l\'invito che scade entro domani non dice «tra 1 giorni» né «tra 0 giorni»', inviti.some((t) => /scade (oggi|domani)/.test(t)) && !inviti.some((t) => /tra [01] giorni/.test(t)), inviti);
  prova('l\'invito già scaduto (ancora «pending» sul server) dice «scaduto il …»', inviti.some((t) => /scaduto il \d\d\/\d\d\/\d{4}/.test(t)) && !inviti.some((t) => /tra -\d+ giorni/.test(t)), inviti);
  prova('l\'invito vivo tiene la doppia forma «tra N giorni (data)»', inviti.some((t) => /scade tra \d+ giorni \(\d\d\/\d\d\/\d{4}\)/.test(t)), inviti);
  prova('lo stato del membro è in italiano («Disattivato», non «disabled»)', membri.some((t) => /Disattivato/.test(t)) && !membri.some((t) => /disabled/.test(t)), membri);
  const mini = await altezzaTocco(p, '.btn-mini');
  prova(`«Rimuovi» è alto almeno 44 px (${mini && mini.h})`, mini && mini.h >= 44, mini);
  await p.click('.sec'); await p.waitForTimeout(300);
  const letture0 = await p.evaluate(() => (window.__chiamateId || []).filter((c) => c.n === 'getDocs').length);
  await p.click('.sec'); await p.waitForTimeout(400);
  const letture1 = await p.evaluate(() => (window.__chiamateId || []).filter((c) => c.n === 'getDocs').length);
  prova(`un tocco in una zona neutra non rilegge membri e inviti (${letture0} → ${letture1} letture)`, letture1 === letture0, { letture0, letture1 });
  await p.selectOption('[data-role="u2"]', 'member'); await p.waitForTimeout(500);
  const toast = await p.evaluate(() => { const t = document.getElementById('toast'); const r = t ? t.getBoundingClientRect() : null; return t ? { testo: t.textContent.trim(), mostrato: t.classList.contains('show'), dentro: r.top >= 0 && r.bottom <= innerHeight } : null; });
  prova(`«Ruolo aggiornato» compare nel toast del core, dentro la finestra (${JSON.stringify(toast)})`, toast && toast.mostrato && /Ruolo aggiornato/.test(toast.testo) && toast.dentro, toast);
  prova('nessun errore di pagina', errori.length === 0, errori);
  await ctx.close();
}
{
  const { ctx, p } = await apri('admin.html', { stato: 'member', email: 'capocava@cava-alfa.it', orgs: { org_cava_alfa: 'member' }, dati: DATI_ORG() });
  const spenti = await p.$$eval('#inv-email, #inv-role, #btn-invite', (e) => e.map((x) => x.disabled));
  prova('per il membro semplice il modulo d\'invito è spento (il server lo rifiuterebbe)', spenti.length === 3 && spenti.every(Boolean), spenti);
  const st = await stileMsg(p);
  prova(`la nota «sei membro semplice» ha un fondo, non è testo nudo (bg ${st.bg})`, st.h > 0 && st.bg !== 'rgba(0, 0, 0, 0)', st);
  await ctx.close();
}
{
  /* l'ANTEPRIMA: senza backend (scenario null → nessun finto, l'import di
     Firebase fallisce come nei banchi di sempre) */
  const { ctx, p } = await apri('admin.html', null);
  await p.click('.sec'); await p.waitForTimeout(300);
  const dopoSec = await testoMsg(p);
  prova('in anteprima un tocco sull\'intestazione «Membri» non fa comparire nessun avviso', dopoSec === '', dopoSec);
  await p.click('#inv-email'); await p.waitForTimeout(300);
  const dopoCampo = await testoMsg(p);
  prova('e nemmeno un tocco nel campo dell\'email per scriverci', dopoCampo === '', dopoCampo);
  await p.click('[data-remove="u2"]'); await p.waitForTimeout(300);
  const dopoRimuovi = await testoMsg(p);
  prova(`mentre «Rimuovi» dice che è un'anteprima («${dopoRimuovi.slice(0, 40)}…»)`, /anteprima/i.test(dopoRimuovi), dopoRimuovi);
  await ctx.close();
}

/* ═══ NON AUTORIZZATO ═══ */
console.log('\n══ non-autorizzato.html');
{
  const { ctx, p, errori } = await apri('non-autorizzato.html', { stato: 'unauthorized', emailVerified: false }, 320);
  for (const sel of ['#lnk-tour', '#lnk-logout', '#btn-reverify']) {
    const t = await altezzaTocco(p, sel);
    prova(`${sel} risponde al dito su almeno 40 px (${t && t.h})`, t && t.h >= 40, t);
  }
  prova('nessun errore di pagina', errori.length === 0, errori);
  await ctx.close();
}

await b.close();
console.log(`\nRisultato stati di Deepwork ID: ${ok} passati, ${ko} falliti  ·  ${misurate} prove su 4 pagine`);
if (CONTROPROVA) {
  console.log(`⚠️  CONTROPROVA: ${rimessi.size}/${attesi} difetti rimessi nel corpo servito`);
  if (rimessi.size < attesi) { console.log('  ✗ CONTROPROVA INERTE: un\'iniezione non ha trovato il suo pezzo — guarderebbe un prodotto sano'); process.exit(2); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : '✗ CONTROPROVA FALLITA: ho rimesso i difetti e nessuno se n\'è accorto.');
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko ? 1 : 0);
