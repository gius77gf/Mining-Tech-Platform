/* GLI STATI «NON MISURATO» SI VEDONO DAVVERO NELLE PAGINE.
   ────────────────────────────────────────────────────────
   Uso:
     node stati-non-misurati.mjs [porta]
     node stati-non-misurati.mjs --controprova   (cerca uno stato che NON c'è:
                                                  DEVE cadere)

   ⚠️ PERCHÉ ESISTE. Il 01/08, in due app a un'ora di distanza, è saltato fuori
   lo stesso difetto — e nessuna prova `node` poteva vederlo, perché il codice
   era **giusto**: erano i dati della dimostrazione a non contenere il caso.

   · in **Scudo** i ripieghi «Stato non indicato», «Chiusa a metà» e «Senza data
     di nomina» esistevano, erano provati e commentati, e **non li vedeva
     nessuno**: tutti i documenti avevano uno stato, le ispezioni chiuse erano
     complete, e sei nomine su sei avevano la data;
   · in **Terra** il «non dichiarabile» della base dell'onere era invisibile per
     la stessa ragione: nessun anno senza rilievi di scavo.

   È il principio del fondatore preso dall'altro capo. `sonda-vuoto.mjs` guarda
   i **moduli** e chiede che non nascano numeri tranquilli; qui si guarda la
   **pagina viva** e si chiede il contrario: che gli stati che dicono «non è
   stato misurato» compaiano davvero sullo schermo. Una difesa che il cliente
   non può vedere è una difesa che nessuno può controllare — e alla prima
   modifica della dimostrazione sparisce senza far rumore.

   ⛔ E si pretende la RIGA, non il testo: la prima versione di questa sonda
   (in scratchpad) trovava «Senza data di nomina» dentro il riepilogo in cima e
   diceva «c'è», mentre la riga della persona stava in una scheda chiusa, alta
   ZERO pixel. Quindi: contenitore dichiarato, altezza diversa da zero, e
   nessuna riga che va a capo rispetto alle sorelle. */
import { prendiChromium, CHROMIUM } from './giro.mjs';

const args = process.argv.slice(2);
const CONTROPROVA = args.includes('--controprova');
const PORTA = Number(args.find((a) => /^\d+$/.test(a))) || 8899;

/* [app, etichetta, tab in basso, sotto-scheda o null, contenitore, testo, prima?]
   `prima` = {dentro, testo}: un elemento da cliccare prima di misurare.
   ⚠️ Serve, e la prima versione non ce l'aveva: la denuncia di Terra si apre
   sull'anno CORRENTE, che è misurato — quindi lo stato «non dichiarabile»
   c'era e la sonda non lo trovava, perché non aveva scelto l'anno cieco. */
const CASI = [
  ['scudo', 'documento senza stato', '#nav-doc', null, '#doc-list', /stato non indicato/i],
  ['scudo', 'ispezione chiusa a metà', '#nav-isp', null, '#isp-list', /chiusa a metà/i],
  ['scudo', 'nomina senza data', '#nav-pers', 'nom', '#nom-list', /senza data di nomina/i],
  ['scudo', 'lavoratore senza scadenze', '#nav-pers', 'lav', '#pers-list', /nessuna scadenza/i],
  ['terra', 'anno con lo scavo mai rilevato', '#nav-den', null, '#den-storico', /scavo non misurato/i],
  ['terra', 'base dell\'onere non dichiarabile', '#nav-den', null, '#den-oneri', /non è stato misurato/i,
    { dentro: '#den-anni', testo: '2024' }],
];
/* la controprova cerca uno stato che nessuna pagina scrive: se la sonda dice
   «trovato» anche questo, non sta guardando dove crede */
const FINTO = [['scudo', 'stato inventato', '#nav-doc', null, '#doc-list', /pinco pallino non misurato/i]];

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0, guardati = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x)}` : ''}`); } };

const perApp = {};
for (const c of (CONTROPROVA ? FINTO : CASI)) (perApp[c[0]] = perApp[c[0]] || []).push(c);

for (const [app, casi] of Object.entries(perApp)) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 950 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  await p.goto(`http://localhost:${PORTA}/apps/${app}/index.html?demo=1`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);

  for (const [, etichetta, tab, sotto, dove, re, prima] of casi) {
    if (await p.$(tab)) { await p.click(tab); await p.waitForTimeout(800); }
    if (sotto) {
      const sel = `#pers-tabs [data-tab="${sotto}"]`;
      if (await p.$(sel)) { await p.click(sel); await p.waitForTimeout(800); }
    }
    if (prima) {
      const fatto = await p.evaluate(([dentro, testo]) => {
        const c = document.querySelector(dentro);
        if (!c) return false;
        const b = [...c.querySelectorAll('button, .chg, [data-anno]')]
          .find((x) => x.textContent.trim() === testo);
        if (!b) return false;
        b.click(); return true;
      }, [prima.dentro, prima.testo]);
      if (!fatto) { dice(false, `${app}: ${etichetta} — non trovo «${prima.testo}» in ${prima.dentro}`); guardati++; continue; }
      await p.waitForTimeout(800);
    }
    const r = await p.evaluate(([fonte, dove]) => {
      const rx = new RegExp(fonte, 'i');
      const SEL = '.item, .note, .badge';
      const radice = document.querySelector(dove);
      if (!radice) return { assente: `contenitore ${dove} non trovato` };
      const semi = radice.matches(SEL) ? [radice] : [];
      const el = [...semi, ...radice.querySelectorAll(SEL)]
        .filter((e) => e.getBoundingClientRect().height > 0)
        .find((e) => rx.test(e.innerText || e.textContent || ''));
      if (!el) return null;
      const riga = el.closest('.item') || el;
      riga.scrollIntoView({ block: 'center' });
      const sorelle = [...(riga.parentElement ? riga.parentElement.children : [])]
        .filter((x) => x !== riga && x.classList.contains('item'))
        .map((x) => Math.round(x.getBoundingClientRect().height));
      return { altezza: Math.round(riga.getBoundingClientRect().height), sorelle };
    }, [re.source, dove]);
    guardati++;
    const nome = `${app}: ${etichetta}`;
    if (!r) { dice(false, `${nome} — non compare in ${dove}`); continue; }
    if (r.assente) { dice(false, `${nome} — ${r.assente}`); continue; }
    dice(r.altezza > 0, `${nome} — si vede sullo schermo`, r.altezza);
    const max = r.sorelle.length ? Math.max(...r.sorelle) : null;
    if (max) dice(r.altezza <= max * 1.6, `${nome} — non manda la riga a capo`, { riga: r.altezza, sorelle: max });
  }
  dice(errori.length === 0, `${app}: nessun errore di pagina`, errori[0]);
  await ctx.close();
}
await browser.close();

console.log(`\n${guardati} stati cercati nelle pagine vive${CONTROPROVA ? ' (CONTROPROVA: devono cadere)' : ''}`);
console.log(`${ok + ko} prove · ${ok} passate, ${ko} fallite`);
if (CONTROPROVA) {
  const atteso = ko > 0;
  console.log(atteso ? '✓ la controprova cade, come deve' : '✗ LA CONTROPROVA NON CADE: la sonda non guarda dove crede');
  process.exit(atteso ? 0 : 1);
}
process.exit(ko ? 1 : 0);
