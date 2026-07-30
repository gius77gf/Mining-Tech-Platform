/* GLI STESSI TRE CONTROLLI, SU TUTTE LE SUPERFICI CHE MONTANO LA GUARDIA.
   Su Genesi i dieci campi interi sono stati digitati davvero; sulle altre sei
   superfici la guardia era ancora verificata solo per MONTAGGIO. Qui si naviga
   ogni app come la naviga una persona — la barra delle sezioni, le sezioni a
   fisarmonica — e in ogni campo intero che si incontra si battono le tre cose
   che distinguono la guardia dalla sua assenza:
     1. la virgola viene DETTA (messaggio a schermo);
     2. «1.500» vale 1500, non 1,5 (il caso in cui il valore migliora davvero);
     3. un intero normale si scrive senza intralci.

   Due cose imparate su Genesi e riportate qui:
   - i tempi di attesa sono lunghi perché il container non ha GPU e le pagine
     pesanti scendono a pochi fotogrammi al secondo: coi tempi corti Playwright
     dichiara «non cliccabile» un campo visibile, fermo e scoperto;
   - il toast del core è `<div id="toast">`, senza classe: un selettore che
     guarda solo le classi dà per assente un messaggio che c'è.

   CONTROPROVA: con «--senza-guardia» la stessa pagina viene servita con la riga
   che monta la guardia sostituita da un commento. Se i controlli passano lo
   stesso, non stanno misurando la guardia. */
import { montaFintoFirebase } from './finto-firebase.mjs';

/* Playwright non è una dipendenza del repo (nessuno vuole un `npm install` per
   aprire il progetto) ed è installato globalmente nella macchina di lavoro. La
   risoluzione dei moduli ES non guarda NODE_PATH, quindi il semplice
   `import 'playwright'` funziona solo se lo si lancia da una cartella che ce
   l'ha accanto. Si prova il nome, e se non c'è si prova il posto. */
async function prendiChromium() {
  for (const dove of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs',
                      '/opt/node22/lib/node_modules/playwright/index.js']) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error('Playwright non si trova. Installalo, o lancia questo file da una cartella che ce l\'ha accanto.');
  process.exit(2);
}
const chromium = await prendiChromium();

const PORTA = process.argv[2];
const SENZA = process.argv.includes('--senza-guardia');
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);

const SUPERFICI = [
  ['core', '/index.html'],
  ['campo', '/apps/campo/index.html'],
  ['flotta', '/apps/flotta/index.html'],
  ['scudo', '/apps/scudo/index.html'],
  ['sentinella', '/apps/sentinella/index.html'],
  ['terra', '/apps/terra/index.html'],
  ['genesi', '/apps/genesi/genesi.html'],
];
const MONTA_RE = /montaGuardiaInteri\s*\(\s*\(m(?:\s*,\s*el)?\)\s*=>[\s\S]*?\n?\s*\);/;

/* Qualche campo non si vede finché non si fa una scelta: in Scudo la riga
   «si ripete ogni N mesi» compare solo dopo aver scelto un adempimento tipico
   dalla tendina. Non è una scorciatoia: è il gesto che farebbe la persona. */
const APRITORI = {
  scudo: async (p) => {
    const opz = await p.$$eval('#scad-preset option', (os) => os.map((o) => o.value).filter(Boolean));
    if (opz.length) { await p.selectOption('#scad-preset', opz[0]).catch(() => {}); await p.waitForTimeout(400); }
  },
};

let ok = 0, ko = 0;
const prova = (n, c, e) => {
  if (c) { ok++; console.log('    ok  ' + n); }
  else { ko++; console.log('    KO  ' + n + (e !== undefined ? '\n          -> ' + JSON.stringify(e) : '')); }
};

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  console.log(`\n══════ ${nome} ══════`);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 950 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const err = [];
  p.on('pageerror', (e) => err.push(e.message));
  if (SENZA) {
    await p.route('**' + via, async (r) => {
      const res = await r.fetch();
      const prima = await res.text();
      const dopo = prima.replace(MONTA_RE, '/* guardia smontata per controprova */');
      /* la sostituzione DEVE cambiare la sorgente: una controprova inerte passa
         come una prova riuscita, e il core l'ha già dimostrato — la sua riga di
         montaggio è scritta senza spazi e la prima versione non la trovava,
         quindi «9 passate, 0 fallite» voleva dire soltanto «non ho tolto niente» */
      if (dopo === prima) { console.error(`  ✗ ${nome}: CONTROPROVA INERTE, la riga della guardia non è stata trovata`); process.exitCode = 2; }
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: dopo });
    });
  }
  /* IL CORE NON SI FERMA AL LOGIN: tutto il suo programma sta in un
     `<script type="module">` che importa Firebase da gstatic, e qui la rete è
     chiusa. Senza quell'import il modulo non parte e restano i segnaposto che
     il core installa apposta — per questo `nav('ufficio')` sembrava non fare
     niente: non era il nav del core. Con i moduli finti il programma parte e le
     schermate si montano davvero. */
  if (nome === 'core') await montaFintoFirebase(p);
  await p.goto(`http://127.0.0.1:${PORTA}${via}`);
  await p.waitForTimeout(nome === 'core' ? 3500 : 2200);

  /* l'elenco completo dei campi interi del documento, con la stessa regola con
     cui la guardia decide se un campo è intero (eCampoIntero) */
  const tutti = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('input[type=number]').forEach((el, i) => {
      if (el.getAttribute('inputmode') === 'decimal') return;
      const st = el.getAttribute('step');
      if (st && st.includes('.')) return;
      if (!el.id) el.id = 'senza-id-' + i;
      out.push(el.id);
    });
    return out;
  });
  console.log(`  campi interi nel documento: ${tutti.length} -> ${tutti.join(', ') || '(nessuno)'}`);

  const visibili = () => p.evaluate(() => [...document.querySelectorAll('input[type=number]')]
    .filter((el) => el.getAttribute('inputmode') !== 'decimal'
      && !(el.getAttribute('step') || '').includes('.')
      && el.getBoundingClientRect().height > 0)
    .map((el) => el.id));

  const provati = new Set();
  async function provaCampo(id) {
    if (provati.has(id)) return;
    const el = p.locator(`#${CSS_ESC(id)}`);
    /* prima si prova in fretta; solo se non riesce si concede il tempo lungo,
       che serve alle pagine pesanti (poche decine di fotogrammi in un minuto,
       misurato) e altrove non farebbe che moltiplicare le attese */
    try { await el.scrollIntoViewIfNeeded({ timeout: 1500 }); await el.click({ timeout: 1500 }); }
    catch (primo) {
      try { await el.scrollIntoViewIfNeeded({ timeout: 9000 }); await el.click({ timeout: 9000 }); }
      catch (e) { console.log(`    ·· ${id}: non raggiungibile (${String(e.message).split('\n')[0]})`); return; }
    }
    provati.add(id);
    await svuotaToast(p);
    await el.fill('');
    await el.pressSequentially('1,5', { delay: 20 });
    await p.waitForTimeout(120);
    const avvisato = await leggiToast(p);
    await el.fill('');
    await el.pressSequentially('1.500', { delay: 20 });
    const dopoPunto = await el.inputValue();
    await el.fill('');
    await el.pressSequentially('42', { delay: 20 });
    const normale = await el.inputValue();
    prova(`${id}: la virgola viene DETTA`, /intero/i.test(avvisato), { avvisato });
    prova(`${id}: «1.500» vale 1500, non 1,5`, dopoPunto === '1500', { dopoPunto });
    prova(`${id}: un intero normale si scrive`, normale === '42', { normale });
  }

  /* giro di navigazione: ogni voce della barra sezioni, e dentro ogni schermata
     si aprono le sezioni a fisarmonica prima di guardare cosa è visibile */
  const sezioni = nome === 'core'
    ? ['@ufficio', '@admin', '@strumenti-foc']
    : await p.$$eval('.nav button[id^=nav-], #bottomnav button[data-scr]',
        (bs) => bs.map((x) => x.id || `[data-scr="${x.dataset.scr}"]`));
  console.log(`  sezioni da visitare: ${sezioni.length || 1}`);
  for (const s of sezioni.length ? sezioni : ['']) {
    if (s && s.startsWith('@')) {
      await p.evaluate((x) => { if (typeof nav === 'function') nav(x); }, s.slice(1)).catch(() => {});
      await p.waitForTimeout(400);
      /* nella schermata di amministrazione i campi stanno in una linguetta
         («Calcolo») che si apre come la aprirebbe chiunque: cliccandola. */
      if (s === '@admin') {
        const linguette = await p.$$('#screen-admin .atab');
        for (const l of linguette) {
          await l.click({ timeout: 2500 }).catch(() => {});
          await p.waitForTimeout(200);
          const c = await p.evaluate(() => !!document.getElementById('a-nf') &&
            document.getElementById('a-nf').getBoundingClientRect().height > 0);
          if (c) break;
        }
      }
      await p.waitForTimeout(200);
    } else if (s) {
      const t0 = Date.now();
      const sel = s.startsWith('[') ? `#bottomnav button${s}` : `#${s}`;
      await p.click(sel, { timeout: 4000 }).catch((e) => console.log(`    ·· ${sel}: ${String(e.message).split('\n')[0]}`));
      await p.waitForTimeout(500);
      if (Date.now() - t0 > 3000) console.log(`    ·· ${sel} ha richiesto ${Date.now() - t0}ms`);
    }
    if (APRITORI[nome]) await APRITORI[nome](p).catch(() => {});
    /* in Genesi il pannello dei parametri del 3D si apre col suo bottone */
    if (nome === 'genesi' && !(await p.evaluate(() => document.body.classList.contains('show-params')))) {
      await p.click('#btnParams', { timeout: 2000 }).catch(() => {});
      await p.waitForTimeout(400);
    }
    for (const acc of await p.$$('.dc-sec.closed .dc-sec-h, details:not([open]) > summary')) {
      await acc.click({ timeout: 2500 }).catch(() => {}); await p.waitForTimeout(90);
    }
    const v = await visibili();
    const nuovi = v.filter((x) => !provati.has(x));
    if (nuovi.length) console.log(`  — ${s || 'pagina'}: ${nuovi.join(', ')}`);
    for (const id of v) await provaCampo(id);
  }

  const mancanti = tutti.filter((x) => !provati.has(x));
  console.log(`  digitati: ${provati.size}/${tutti.length}${mancanti.length ? ` · non raggiunti: ${mancanti.join(', ')}` : ''}`);
  if (err.length) console.log('  ⚠ errori pagina:', err.slice(0, 3));
  await ctx.close();
}

await b.close();
console.log(`\n${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);

function CSS_ESC(id) { return id.replace(/([^\w-])/g, '\\$1'); }
async function svuotaToast(p) {
  await p.evaluate(() => {
    const t = document.getElementById('toast');
    if (t) { t.textContent = ''; t.className = t.className.replace(/\bshow\b/g, ''); }
  });
}
async function leggiToast(p) {
  return p.evaluate(() => [...document.querySelectorAll('#toast, .toast, [class*=toast]')]
    .map((n) => (n.innerText || n.textContent || '').trim()).filter(Boolean).join(' | '));
}
