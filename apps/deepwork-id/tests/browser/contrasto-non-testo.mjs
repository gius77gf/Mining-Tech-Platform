/* IL CONTRASTO DI CIÒ CHE NON È TESTO — WCAG 1.4.11, soglia 3:1.
   ─────────────────────────────────────────────────────────────────────────
   PERCHÉ ESISTE. `contrasto.mjs` misura i TESTI, e da solo lascia fuori tutta
   la metà del prodotto che parla senza parole: la barretta colorata a lato di
   una riga di elenco, il filo in cima a un KPI, la striscia di un riquadro, il
   bordo rosso di un campo sbagliato. Portano informazione — spesso sono il
   secondo segnale dello stato di una riga, e in Campo la striscia gialla
   dell'appello è **il** segno che una persona non è stata spuntata — e nessun
   banco le guardava. Misurato il 07/08 nei temi chiari, prima della
   correzione: `--warn` stava a **1,85:1** contro la scheda e **1,57** contro
   il fondo pagina in Campo; in Scudo 1,92 e 1,62. Passava solo il rosso.

   COME RICONOSCE I SOGGETTI — PER EFFETTO, NON PER NOME. Un elenco di classi
   scritto a mano si accorcia da solo e non sa niente delle classi che
   nasceranno. Qui i soggetti si trovano così:
     · i NOMI dei token di stato si leggono dai fogli della pagina stessa
       (tutto ciò che si chiama --success/--warn/--danger/--info/--ink-…/
       --num-…/--bar-…), e si RISOLVONO chiedendoli a un elemento vero — mai
       leggendo il testo del CSS, che con `color-mix()` non dice il colore;
     · poi si cammina il DOM e si prende ogni superficie NON testuale dipinta
       con uno di quei colori: un lato di bordo, il fondo di un elemento che
       non contiene testo, un ::before/::after, il fill/stroke di un SVG.
   Così una classe nuova entra da sola, purché usi i colori di stato dell'app.

   CONTRO CHE COSA SI MISURA, e la scelta è dichiarata. La WCAG chiede 3:1
   contro i **colori adiacenti**. Una striscia a lato di una riga ne ha due: il
   fondo della scheda (dentro) e il fondo della pagina (fuori). Si misurano
   tutti e due e si tiene il **peggiore** — direzione prudente: fra due
   quasi-bianchi una striscia pallida non si stacca da nessuno dei due, e
   assolverla perché va bene con uno solo vorrebbe dire non vederla.
   Accanto al verdetto si stampa anche il migliore, così si vede quanto la
   scelta pesa (sui temi chiari fra i due c'è ~0,6 di rapporto).

   ⛔ DUE SCELTE DEL RIGHELLO, DICHIARATE, PERCHÉ TUTT'E DUE SONO STATE PRESE
   DOPO CHE LA PRIMA STESURA AVEVA ACCUSATO UN COLORE SANO.
   1. **Un gradiente che sfuma non è un colore che manca.** La barra di peso di
      Conti va da `--warn` pieno a `--warn` al 20% di opacità: prendendo la
      fermata peggiore usciva **1,49:1** al buio, su una barra la cui testa fa
      **8,6**. La coda che sbiadisce è il disegno, non un difetto. Quindi: per
      il SOGGETTO si tiene la fermata che si stacca di più, per il VICINO la
      peggiore. Le due direzioni sono opposte apposta.
   2. **Un bordo dello stesso colore del proprio fondo non ha un vicino
      dentro.** `.chg.active` di Campo è un interruttore pieno: fondo e bordo
      sono lo stesso verde, e il rapporto «dentro» vale 1,00 — un KO su un
      comando che si vede benissimo. Un vicino identico al soggetto non è un
      colore adiacente: viene tolto, e il confine resta quello verso fuori.

   COSA NON GUARDA, e va detto invece di lasciarlo dedurre:
     · i PIENI con del testo sopra (pastiglie, toast, bottoni accesi): lì la
       regola che conta è quella del testo, e la misura ce l'ha `contrasto.mjs`;
     · i colori scritti a mano in `rgba(...)` che non combaciano con nessun
       token — quasi sempre veli decorativi dietro un'icona, dove il segnale
       vero è l'icona;
     · il tema `scuro` non ha mai avuto questo difetto: si misura lo stesso,
       perché una correzione fatta sul chiaro non deve rovinarlo.

   LE CLASSI MAI COMPARSE. Un soggetto che la dimostrazione non fa mai vedere
   NON è un soggetto promosso: è un soggetto non misurato. In fondo il banco
   elenca le regole che dipingono una superficie di stato e che nel DOM non
   hanno agganciato niente — è il denominatore, e va letto PRIMA dei KO.

   Uso:
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=chiaro
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=sole
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --solo=campo --tutti
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=chiaro --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const TEMA = (process.argv.find((a) => a.startsWith('--tema=')) || '').slice(7);
const TUTTI = process.argv.includes('--tutti');
/* ⛔ LA CONTROPROVA RIMETTE IL DIFETTO CON LE SUE STESSE PAROLE: riporta i tre
   `--bar-…` al colore di stato crudo, che è esattamente com'erano prima del
   07/08. Il banco DEVE bocciarli. E vale solo nei temi chiari: al buio i due
   valori coincidono per costruzione, quindi lì una controprova non
   distinguerebbe niente — non perché il banco sia cieco, ma perché non c'è
   nessun difetto da rimettere. Se qualcuno la lancia senza tema, il banco lo
   dice invece di stampare un verde che non vuol dire niente. */
const CONTROPROVA = process.argv.includes('--controprova');
const CLASSE_TEMA = { chiaro: 'light-mode', sole: 'outdoor-mode' };
if (TEMA && !CLASSE_TEMA[TEMA]) {
  console.error(`✗ tema sconosciuto: «${TEMA}». Sono ${Object.keys(CLASSE_TEMA).join(', ')} (o niente per il buio).`);
  process.exit(2);
}
if (CONTROPROVA && !TEMA) {
  console.error('✗ la controprova vuole un tema chiaro (--tema=chiaro o --tema=sole): al buio il difetto\n'
    + '  non esiste, i due livelli sono lo stesso colore, e una controprova che non può fallire\n'
    + '  non dimostra niente.');
  process.exit(2);
}
const SOGLIA = 3;

/* le sei app verticali: sono quelle che caricano `dw-app-ui.css` e hanno i tre
   temi. Il core ha due temi suoi e classi sue, e va misurato da un banco che
   conosce la sua forma (è la lezione di `modali-dentro.mjs`). */
const APP = SUPERFICI.filter(([n]) => ['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].includes(n));

const MISURA = (soglia) => {
  /* ── lettura dei colori. `color(srgb …)` ha i canali da 0 a 1: è la settima
     trappola di `contrasto.mjs`, e costò 560 bocciature false. ── */
  const leggi = (s) => {
    if (!s || s === 'none' || s === 'transparent') return null;
    let m = s.match(/^color\(srgb\s+([-\d.eE]+)\s+([-\d.eE]+)\s+([-\d.eE]+)(?:\s*\/\s*([-\d.eE%]+))?\)/);
    if (m) {
      const a = m[4] == null ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      const q = (v) => Math.max(0, Math.min(1, +v)) * 255;
      return [q(m[1]), q(m[2]), q(m[3]), a];
    }
    m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map((x) => x.endsWith('%') ? parseFloat(x) / 100 * 255 : parseFloat(x));
    return [p[0], p[1], p[2], p.length > 3 ? (p[3] > 1 ? p[3] / 255 : p[3]) : 1];
  };
  const sopra = (f, d) => f[3] >= 1 ? f
    : [f[0] * f[3] + d[0] * (1 - f[3]), f[1] * f[3] + d[1] * (1 - f[3]), f[2] * f[3] + d[2] * (1 - f[3]), 1];
  const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const rap = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
  const chiave = (c) => c ? [Math.round(c[0]), Math.round(c[1]), Math.round(c[2])].join(',') : '';
  const scrivi = (c) => c ? `rgb(${chiave(c)})` : '—';
  const fermate = (bi) => {
    const out = [];
    if (!bi || bi === 'none') return out;
    const re = /(?:rgba?\([^)]*\)|color\(srgb[^)]*\))/g;
    let m; while ((m = re.exec(bi))) { const c = leggi(m[0]); if (c && c[3] > 0) out.push(c); }
    return out;
  };
  /* il fondo effettivo: si sale finché non si trova qualcosa di opaco. Torna
     una lista, perché un gradiente è più di un colore. */
  const fondoDi = (el, saltaSeStesso) => {
    let n = saltaSeStesso ? el.parentElement : el;
    const strati = [];
    while (n && n.nodeType === 1) {
      const st = getComputedStyle(n);
      const g = fermate(st.backgroundImage);
      const c = leggi(st.backgroundColor);
      if (g.length) strati.push(g);
      else if (c && c[3] > 0) { strati.push([c]); if (c[3] >= 1) break; }
      n = n.parentElement;
    }
    let base = [255, 255, 255, 1];
    for (let i = strati.length - 1; i >= 0; i--) if (i > 0) for (const c of strati[i]) base = sopra(c, base);
    return (strati[0] || [[255, 255, 255, 1]]).map((c) => sopra(c, base));
  };

  /* ── i NOMI dei token di stato, letti dai fogli della pagina ── */
  /* ⚠️ `if (r.cssRules) ricorri; continue;` PERDE TUTTE LE REGOLE NORMALI, e la
     prima stesura di questo banco ci è caduta: da quando Chromium supporta il
     CSS annidato **anche una `.item{…}` ha un `cssRules`** (vuoto, ma non
     falso), quindi ogni regola veniva scambiata per un contenitore e saltata.
     Contate: **24 regole viste su 512**, e il banco stampava «0 superfici di
     stato» su una pagina che ne ha decine. Si guarda la regola PRIMA, e si
     ricorre solo se ha davvero dei figli. */
  const camminaRegole = (rs, fn) => {
    for (const r of rs) {
      fn(r);
      if (r.cssRules && r.cssRules.length) camminaRegole(r.cssRules, fn);
    }
  };
  const nomi = new Set();
  for (const foglio of document.styleSheets) {
    let regole; try { regole = foglio.cssRules; } catch (e) { continue; }
    camminaRegole(regole, (r) => {
      const t = r.style ? r.cssText || '' : '';
      const re = /(--(?:success|warn|danger|info|ink-[a-z0-9]+|num-[a-z0-9]+|bar-[a-z0-9]+))\s*:/g;
      let m; while ((m = re.exec(t))) nomi.add(m[1]);
    });
  }
  /* ── e i loro VALORI, chiesti a un elemento vero: una variabile che contiene
     un `color-mix()` non dice il suo colore finché qualcuno non la usa ── */
  const sonda = document.createElement('span');
  sonda.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px';
  document.body.appendChild(sonda);
  const perColore = new Map();
  for (const n of nomi) {
    sonda.style.color = '';
    sonda.style.color = `var(${n})`;
    const c = leggi(getComputedStyle(sonda).color);
    if (!c || c[3] <= 0) continue;
    const k = chiave(c);
    if (!perColore.has(k)) perColore.set(k, []);
    perColore.get(k).push(n);
  }
  sonda.remove();
  const nomeDi = (c) => (perColore.get(chiave(c)) || []).join('/');

  const soggetti = [];
  const decorativi = [];
  const conteggio = { dipinte: 0, diStato: 0, visti: 0 };
  const usati = new Set();
  const nascosto = (el) => { const st = getComputedStyle(el);
    return st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0; };
  /* ⛔ UN COLORE CHE PULSA SI DICHIARA, NON SI GIUDICA. `.kpi.danger` anima il
     bordo alto all'infinito (`pulseDanger`): sorpreso a metà pulsazione dà un
     numero diverso a ogni giro, e un banco che a volte boccia e a volte no
     insegna a non guardarlo. È la quarta trappola di `contrasto.mjs`, presa
     qui prima che mordesse. Le animazioni FINITE si aspettano; queste no. */
  const pulsa = (el) => {
    try {
      return el.getAnimations().some((a) => {
        const t = a.effect && a.effect.getTiming();
        return t && t.iterations === Infinity;
      });
    } catch (e) { return false; }
  };
  const haTesto = (el) => (el.textContent || '').trim().length > 0;

  /* `colori` sono le fermate del soggetto: si tiene quella che si stacca di
     più (scelta 1 dell'intestazione). I vicini portano già il loro peggiore. */
  const aggiungi = (el, tipo, colori, vicini0, extra) => {
    conteggio.dipinte++;
    const nome = colori.map((c) => nomeDi(c)).find(Boolean);
    if (!nome) return;                       // non è un colore di stato: fuori
    conteggio.diStato++;
    /* scelta 2: un vicino identico al soggetto non è un colore adiacente */
    const vicini = vicini0.filter((v) => !v.colori.every((b) => colori.some((c) => chiave(c) === chiave(b))));
    if (!vicini.length) return;
    const rr = vicini.map((v) => Math.min(...v.colori.map((b) => Math.max(...colori.map((c) => rap(c, b))))));
    const colore = colori[0];
    const peggio = Math.min(...rr), migliore = Math.max(...rr);
    /* ⛔ UN'ECCEZIONE CORTA E SCRITTA, non una regola larga. `--info` non dice
       uno STATO in questo ecosistema: dipinge la striscia di serie di `.note`,
       cioè la decorazione di un riquadro che si riconosce dal proprio bordo e
       dal proprio testo. La WCAG 1.4.11 esclude quello che è puramente
       decorativo, e nessuna delle sei app ha mai misurato un livello per
       `--info`. Sta FUORI dal verdetto ma DENTRO al registro, coi suoi numeri:
       se un giorno quella barretta diventerà un segnale, il numero è già lì. */
    const dest = /^--info(\/|$)/.test(nome) ? decorativi : soggetti;
    dest.push({ tipo, token: nome, col: scrivi(colore), pulsa: pulsa(el),
      peggio: +peggio.toFixed(2), migliore: +migliore.toFixed(2),
      vicini: vicini.map((v, i) => `${v.dove} ${scrivi(v.colori[0])} ${rr[i].toFixed(2)}`).join(' · '),
      sel: (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
        + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '')).slice(0, 90),
      ...extra });
  };

  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (nascosto(el)) continue;
    conteggio.visti++;
    const st = getComputedStyle(el);
    const dentro = { dove: 'dentro', colori: fondoDi(el, false) };
    const fuori = { dove: 'fuori', colori: fondoDi(el, true) };

    /* A — i lati di bordo */
    for (const lato of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(st[`border${lato}Width`]);
      const sty = st[`border${lato}Style`];
      if (!(w >= 1) || sty === 'none' || sty === 'hidden') continue;
      const c = leggi(st[`border${lato}Color`]);
      if (!c || c[3] <= 0) continue;
      aggiungi(el, `bordo:${lato.toLowerCase()}`, [c[3] < 1 ? sopra(c, dentro.colori[0]) : c],
        [dentro, fuori], { px: w });
    }
    /* B — un elemento senza testo dipinto di suo: pallini, barrette, riempimenti */
    if (!haTesto(el) && el.namespaceURI !== 'http://www.w3.org/2000/svg') {
      const bi = fermate(st.backgroundImage);
      const bc = leggi(st.backgroundColor);
      const cand = (bi.length ? bi : (bc && bc[3] > 0 ? [bc] : [])).map((c) => sopra(c, fuori.colori[0]));
      if (cand.length) aggiungi(el, 'fondo-muto', cand, [fuori], { px: Math.round(Math.min(r.width, r.height)) });
    }
    /* C — ::before / ::after con un fondo proprio */
    for (const pe of ['::before', '::after']) {
      const ps = getComputedStyle(el, pe);
      if (!ps || ps.content === 'none' || +ps.opacity === 0) continue;
      if (!(parseFloat(ps.width) > 0) && !(parseFloat(ps.height) > 0)) continue;
      const bi = fermate(ps.backgroundImage);
      const bc = leggi(ps.backgroundColor);
      const cand = (bi.length ? bi : (bc && bc[3] > 0 ? [bc] : []))
        .map((c) => sopra([c[0], c[1], c[2], c[3] * (+ps.opacity)], dentro.colori[0]));
      if (cand.length) aggiungi(el, 'pseudo' + pe, cand, [dentro], {});
    }
    /* D — le figure: un tratto o un riempimento SVG che dice uno stato */
    if (el.namespaceURI === 'http://www.w3.org/2000/svg' && el.tagName !== 'svg') {
      for (const q of ['stroke', 'fill']) {
        const c = leggi(st[q]);
        if (!c || c[3] <= 0) continue;
        aggiungi(el, 'svg-' + q, [c[3] < 1 ? sopra(c, fuori.colori[0]) : c], [fuori], {});
      }
    }
  }

  /* ── le regole che dipingono uno stato e che nel DOM non hanno agganciato
     niente: il denominatore, non un'assoluzione ── */
  const maiComparse = [];
  const RE_STATO = /--(?:success|warn|danger|info|ink-|num-|bar-)/;
  const RE_NONTESTO = /(?:border[a-z-]*|background(?:-color|-image)?|fill|stroke)\s*:[^;]*var\(\s*--(?:success|warn|danger|info|ink-|num-|bar-)/;
  for (const foglio of document.styleSheets) {
    let regole; try { regole = foglio.cssRules; } catch (e) { continue; }
    camminaRegole(regole, (r) => {
      if (!r.selectorText || !RE_STATO.test(r.cssText || '')) return;
      if (!RE_NONTESTO.test(r.cssText)) return;
      for (const s of r.selectorText.split(',')) {
        const sel = s.trim().replace(/::?(before|after|hover|focus|active|focus-visible|disabled|first-child|placeholder)\b[^ ]*/g, '');
        if (!sel || /^(0%|50%|100%|from|to)$/.test(sel)) continue;
        let c = 0; try { c = document.querySelectorAll(sel).length; } catch (e) { continue; }
        if (c === 0) maiComparse.push(sel); else usati.add(sel);
      }
    });
  }
  return { soggetti, decorativi, conteggio, maiComparse: [...new Set(maiComparse)].filter((s) => !usati.has(s)), soglia };
};

const b = await chromium.launch({ executablePath: CHROMIUM });
let ko = 0, ok = 0, dipinte = 0, diStato = 0, visti = 0, misurate = 0;
const rifiutate = [], mai = new Map(), peggiori = [], pulsanti = [], deco = new Map();
for (const [nome, via] of APP) {
  if (SOLO && SOLO !== nome) continue;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA });
  if (TEMA) {
    const messa = await p.evaluate(({ cls, t }) => {
      if (!window.dwTema) return false;
      try { localStorage.setItem('dw-tema', t); } catch (e) { /* niente */ }
      window.dwTema(t);
      return document.body.classList.contains(cls);
    }, { cls: CLASSE_TEMA[TEMA], t: TEMA });
    if (!messa) {
      console.log(`  ⚠️  ${nome} non ha il tema «${TEMA}»: NON misurata.`);
      rifiutate.push(nome); await ctx.close(); continue;
    }
  }
  if (CONTROPROVA) {
    /* il difetto di prima: la striscia torna al colore di stato crudo */
    await p.evaluate(() => {
      const s = getComputedStyle(document.body);
      for (const [bar, crudo] of [['--bar-ok', '--success'], ['--bar-wr', '--warn'], ['--bar-dg', '--danger']]) {
        document.body.style.setProperty(bar, s.getPropertyValue(crudo).trim());
      }
    });
  }
  misurate++;
  const perApp = [];
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    const res = await p.evaluate(MISURA, SOGLIA);
    dipinte += res.conteggio.dipinte; diStato += res.conteggio.diStato; visti += res.conteggio.visti;
    for (const x of res.soggetti) perApp.push({ ...x, sez: s });
    for (const x of res.decorativi) {
      if (x.peggio < SOGLIA) deco.set(`${nome}: ${x.sel} · ${x.token} · ${x.peggio}`, 1);
    }
    for (const m of res.maiComparse) mai.set(nome + ' ' + m, (mai.get(nome + ' ' + m) || 0) + 1);
  }
  /* una riga per (tipo, selettore, token): la stessa striscia su venti righe
     è un difetto solo, e venti righe uguali non si leggono */
  const agg = new Map();
  for (const x of perApp) {
    const k = [x.tipo, x.sel, x.token].join('|');
    const p0 = agg.get(k);
    if (!p0) agg.set(k, { ...x, n: 1 });
    else { p0.n++; if (x.peggio < p0.peggio) { p0.peggio = x.peggio; p0.migliore = x.migliore; p0.vicini = x.vicini; } }
  }
  const tutteLeRighe = [...agg.values()].sort((a, b2) => a.peggio - b2.peggio);
  const righe = tutteLeRighe.filter((x) => !x.pulsa);
  for (const x of tutteLeRighe.filter((y) => y.pulsa)) {
    pulsanti.push(`${nome}: ${x.sel} · ${x.token} · ${x.peggio} colto a metà pulsazione`);
  }
  const male = righe.filter((x) => x.peggio < SOGLIA);
  ko += male.length; ok += righe.length - male.length;
  console.log(`\n══════ ${nome}${TEMA ? ' · ' + TEMA : ''} ══════  ${righe.length} superfici di stato distinte, ${male.length} sotto ${SOGLIA}:1`);
  for (const x of (TUTTI ? righe : male)) {
    const seg = x.peggio < SOGLIA ? 'KO' : 'ok';
    console.log(`  ${seg}  ${String(x.peggio).padStart(5)} (migliore ${String(x.migliore).padStart(5)})  ${x.tipo.padEnd(15)} ${x.token.padEnd(22)} ×${String(x.n).padStart(3)}  ${x.sel}`);
    if (x.peggio < SOGLIA) { console.log(`        vicini: ${x.vicini}`); peggiori.push(`${nome}: ${x.sel} ${x.token} ${x.peggio}`); }
  }
  await ctx.close();
}
await b.close();

console.log(`\n────────────────────────────────────────────────────────────`);
console.log(`${misurate} app misurate${rifiutate.length ? ` · NON misurate: ${rifiutate.join(', ')}` : ''}`);
console.log(`${visti} elementi visibili guardati · ${dipinte} superfici non testuali dipinte · ${diStato} dipinte con un colore di STATO`);
console.log(`${ok} sopra ${SOGLIA}:1, ${ko} sotto.`);
if (deco.size) {
  console.log(`\n⚠️  ${deco.size} superfici DECORATIVE (--info) sotto ${SOGLIA}:1, fuori dal verdetto per dichiarazione.`);
  console.log('   È la striscia di serie di `.note`: il riquadro si riconosce da sé, e le sue varianti di');
  console.log('   stato passano dai `--bar-…`. Nessuna app ha mai misurato un livello per --info: il');
  console.log('   giorno che qualcuno lo farà, i numeri sono questi.');
  for (const k of [...deco.keys()].sort()) console.log(`   · ${k}`);
}
if (pulsanti.length) {
  console.log(`\n⚠️  ${pulsanti.length} superfici PULSANO (animazione infinita): il colore cambia mentre lo si misura,`);
  console.log('   quindi si dichiarano invece di giudicarle. Non sono promosse: sono non misurabili qui.');
  for (const x of pulsanti) console.log(`   · ${x}`);
}
if (mai.size) {
  console.log(`\n⚠️  ${mai.size} regole dipingono una superficie di stato e nel DOM non hanno agganciato NIENTE.`);
  console.log('   Non vuol dire «a posto»: vuol dire che nessuna misura le ha viste. Da leggere PRIMA dei KO.');
  /* ⛔ SI STAMPANO TUTTE, non le prime quaranta. Un elenco troncato è la
     versione gentile del «non ho guardato» che nessuno legge: il 03/08 un
     «0 su 68» in fondo a un riepilogo è passato per mesi. Novantuno righe si
     scorrono in dieci secondi; una riga «e altre 51» no. */
  for (const k of [...mai.keys()].sort()) console.log(`   · ${k}`);
}
if (CONTROPROVA) {
  console.log(ko ? '\n✓ CONTROPROVA: col difetto rimesso il banco lo vede.'
    : '\n✗ CONTROPROVA: col difetto rimesso il banco NON lo vede. Non sta guardando le strisce.');
  process.exit(ko ? 0 : 1);
}
process.exit(ko ? 1 : 0);
