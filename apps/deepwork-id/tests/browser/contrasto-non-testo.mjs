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
       perché una correzione fatta sul chiaro non deve rovinarlo;
     · il tema `sole` del CORE, che il core non ha davvero (due temi, non tre:
       la ragione col suo comando sta dove il tema viene rifiutato). Le sei app
       ce l'hanno e lì si misura.

   ⚠️ LA GEOMETRIA DEI GRADIENTI È STATA PROVATA E RIMANDATA, COL NUMERO. Il
   07/08 `contrasto.mjs` ha smesso di accoppiare a tappeto le fermate di un
   gradiente e ha cominciato a leggere inchiostro e fondo nello STESSO PUNTO:
   là serviva (forbice ≥4 su 63 casi). Qui la stessa misura dice **933
   accoppiamenti, 54 con un vicino a più fermate, forbice peggiore 1,40, zero
   verdetti che cambiano**. Portare la geometria costerebbe un cantiere e non
   correggerebbe niente. Quello che si fa invece è la regola del righello che
   **dichiara l'ampiezza del proprio dubbio**: la forbice si stampa a ogni
   giro, così il giorno che sale si vede.

   LE CLASSI MAI COMPARSE. Un soggetto che la dimostrazione non fa mai vedere
   NON è un soggetto promosso: è un soggetto non misurato. In fondo il banco
   elenca le regole che dipingono una superficie di stato e che nel DOM non
   hanno agganciato niente — è il denominatore, e va letto PRIMA dei KO.

   LE SUPERFICI: il core e le sei app verticali. Il core è entrato il 13/08 —
   fino a lì l'elenco era scritto a mano e non lo conteneva; la storia, coi
   comandi, sta accanto all'elenco.

   Uso:
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --solo=core --tema=chiaro
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=chiaro
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=sole
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --solo=campo --tutti
     node apps/deepwork-id/tests/browser/contrasto-non-testo.mjs 8823 --tema=chiaro --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

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

/* ⛔ IL CORE È ENTRATO IL 13/08, E LA RIGA CHE LO TENEVA FUORI DICEVA UNA COSA
   FALSA. Fino a quel giorno qui c'era scritto — e si leggeva bene —

     «le sei app verticali […]. Il core ha due temi suoi e classi sue, e va
      misurato da un banco che conosce la sua forma (è la lezione di
      `modali-dentro.mjs`)»

   cioè un elenco a mano con accanto la sua giustificazione. Le due metà erano
   tutt'e due sbagliate, e in modi diversi:
   1. **«va misurato da un banco che conosce la sua forma»** dà per scontato che
      quel banco ESISTA. Non esisteva. Il comando che lo dice:
        grep -ln "1\.4\.11\|non testual\|non-testo" apps/deepwork-id/tests/browser/*.mjs
        → contrasto-non-testo.mjs, contrasto.mjs, modali-dentro.mjs, tutti.mjs
      e degli altri tre nessuno misura questo: in `contrasto.mjs` le uniche
      occorrenze sono l'ECCEZIONE dei contenitori d'icona (righe «soglia
      non-testo 3:1» dentro il banco dei TESTI), in `modali-dentro.mjs` è
      l'ingombro di una tendina. Cioè bordi, pallini e fili colorati del core
      non li giudicava NESSUNO — ed è la superficie che il fondatore mostra per
      prima. È l'elenco a mano che «non sapeva nemmeno che `chiediDati`
      esistesse», applicato a una superficie intera.
   2. **«il core ha classi sue»** è vero e non c'entra: questo banco non
      conosce nemmeno le classi delle app. Riconosce i soggetti PER EFFETTO —
      legge i nomi dei token di stato dai fogli della pagina stessa e cammina
      il DOM. Il core quei token li ha, e col vocabolario di qui:
        grep -o -- "--\(success\|warn\|danger\|info\|ink-[a-z0-9]*\)\s*:" index.html | sort | uniq -c
        → 1 --success: · 1 --warn: · 1 --danger: · 1 --info: · 2 --ink-ok: …
      Quindi non serviva un banco nuovo: serviva togliere il filtro.

   ⚠️ E QUEL «1» ACCANTO A `--warn` NON È UN DETTAGLIO DI CONTABILITÀ: è il
   difetto. Nelle app ogni token di stato è dichiarato DUE volte (una per il
   buio, una per il chiaro); nel core `--success/--danger/--info/--warn` sono
   dichiarati **una volta sola**, alla riga 7904 dentro il `:root` del buio, e
   `body.light-mode` ridichiara solo la famiglia `--ink-…` (gli inchiostri
   scuri, cioè i TESTI). Effetto: nel tema chiaro una superficie dipinta
   `var(--warn)` resta l'ambra del buio — #ffa726 — sopra una scheda bianca.
   Il comando:
     grep -n -- "--warn:\|--success:\|--danger:\|--info:" index.html   →  solo 7904

   Il core resta l'unico caso speciale del ciclo, e per una ragione sola: il
   TEMA. Sta scritto dove si impone, qui sotto. */
const APP = SUPERFICI.filter(([n]) => ['core', 'campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].includes(n));
/* ⛔ UN `--solo=` CHE NON COMBACIA CON NIENTE STAMPAVA UN VERDE E USCIVA ZERO.
   Trovato il 13/08 col comando dell'unità, prima ancora di correggere l'elenco:
   `--solo=core` dava «0 app misurate · 0 sopra 3:1, 0 sotto» e **uscita 0** —
   cioè la risposta tranquilla dove non si è guardato niente, che è il principio
   del fondatore violato dentro il banco che lo difende. Un nome sbagliato a
   riga di comando ha lo stesso effetto, e in un giro nessuno se ne accorge. */
if (SOLO && !APP.some(([n]) => n === SOLO)) {
  console.error(`✗ --solo=${SOLO}: non è una superficie di questo banco. Sono ${APP.map(([n]) => n).join(', ')}.`
    + '\n  Mi fermo invece di stampare «0 misurate, 0 sotto soglia», che si legge come un verde.');
  process.exit(2);
}

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
    /* ⛔ QUANTO VALE LA SCELTA DELLA FERMATA, DICHIARATO INVECE CHE NASCOSTO.
       Quando il vicino è un gradiente, `rr` accoppia il soggetto con la sua
       fermata PEGGIORE — ovunque quella fermata stia fisicamente. È lo stesso
       accoppiamento «a tappeto» che `contrasto.mjs` ha smesso di fare il 07/08
       passando alla geometria (inchiostro e fondo letti nello stesso punto).
       ⚠️ QUI LA GEOMETRIA È STATA PROVATA E RIMANDATA, COL NUMERO, perché
       nessuno la rifaccia alla cieca: sui 933 accoppiamenti del tema chiaro
       solo **54** hanno un vicino a più fermate, la forbice peggiore è
       **1,40** (cinque casi sopra 1, zero sopra 2), e gli accoppiamenti in cui
       la scelta della fermata **cambia il verdetto** sono **ZERO**. Sui testi
       la stessa misura dava 63 casi con forbice ≥4: lì il righello sbagliava
       davvero, qui no — perché un soggetto non testuale è quasi sempre una
       superficie piccola con vicini in tinta piena.
       Quindi si tiene il caso peggiore (direzione prudente) e si STAMPA la
       forbice accanto: il giorno che un gradiente conterà, il numero è già lì
       e si vedrà salire. È la regola del righello che dichiara l'ampiezza del
       proprio dubbio invece di essere corretto a metà. */
    const perVicino = vicini.map((v) => v.colori.map((b) => Math.max(...colori.map((c) => rap(c, b)))));
    const rr = perVicino.map((per) => Math.min(...per));
    const forbice = Math.max(...perVicino.map((per) => Math.max(...per) - Math.min(...per)));
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
      forbice: +forbice.toFixed(2), fermateVicino: Math.max(...vicini.map((v) => v.colori.length)),
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
        /* ⛔ «HA AGGANCIATO» DEVE VOLER DIRE «È STATO MISURATO», NON «STA NEL
           DOM» — se no un soggetto che c'è ma non si vede sparisce da TUTT'E
           DUE i conti: non misurato (il giro salta gli invisibili, riga
           `nascosto`) e non dichiarato (perché `querySelectorAll` l'ha
           trovato). È il buco del `.toast.success` di CLAUDE.md, dove una cosa
           usciva dal censimento perché «vista» e non veniva misurata perché
           non era mai stata a schermo.
           Misurato il 13/08 sul core: `.scad-badge.warn`, `.scad-badge.danger`
           e `.sitem.danger` hanno **22 nodi ciascuno nel DOM e ZERO visibili**
           in tutte e 26 le sezioni — stanno in schermate rese e non mostrate.
           Col conto sul DOM sarebbero scomparsi in silenzio; col conto sul
           VISIBILE restano dove devono stare, fra le righe «non ho guardato».
           Si usa la stessa domanda della misura, non una sua copia più debole. */
        let c = 0;
        try { c = [...document.querySelectorAll(sel)].filter((el) => {
          if (nascosto(el)) return false;
          const q = el.getBoundingClientRect();
          return q.width >= 1 && q.height >= 1;
        }).length; } catch (e) { continue; }
        if (c === 0) maiComparse.push(sel); else usati.add(sel);
      }
    });
  }
  /* ⛔ `usati` VA RESTITUITO, NON SOLO SOTTRATTO QUI. Questa funzione gira UNA
     VOLTA PER SEZIONE, quindi `usati` sa solo che cosa ha agganciato nella
     sezione corrente: un selettore che vive in una schermata sola risulta
     «mai comparso» dalle altre venticinque, e la sottrazione fatta qui dentro
     non può accorgersene. Chi somma le sezioni deve poter sottrarre alla fine.
     Misurato il 13/08 sul core: **5 righe su 21 erano false** — i quattro
     `#global-nav .bn[data-scr="…"].active` (la voce accesa esiste, ed è accesa
     nella SUA sezione: `.active` è una classe, non la pseudo-classe `:active`
     che il ripulitore toglie) e `body.light-mode .bn.active`. Cioè la riga
     «non ho guardato», che in questa casa si legge PRIMA dei KO, accusava di
     non essere mai comparso un elemento che sta a schermo — e nella direzione
     che fa aprire un cantiere su niente. */
  return { soggetti, decorativi, conteggio, usati: [...usati],
    maiComparse: [...new Set(maiComparse)].filter((s) => !usati.has(s)), soglia };
};

const b = await chromium.launch({ executablePath: CHROMIUM });
let ko = 0, ok = 0, dipinte = 0, diStato = 0, visti = 0, misurate = 0;
const rifiutate = [], mai = new Map(), peggiori = [], pulsanti = [], deco = new Map();
/* quanti difetti la controprova ha rimesso in ogni superficie, e quanti KO ha
   prodotto ognuna: servono a non far promuovere la controprova dai KO veri di
   una superficie in cui non ha iniettato niente */
const iniettati = new Map(), koPerApp = new Map();
/* la forbice di TUTTI i soggetti, non solo di quelli stampati: serve a vedere
   il numero salire il giorno che un gradiente comincerà a contare */
const forbici = [];
for (const [nome, via] of APP) {
  if (SOLO && SOLO !== nome) continue;
  /* ⛔ IL CORE IL TEMA CHIARO CE L'HA — QUELLO CHE NON HA È L'INTERRUTTORE
     CONDIVISO, e le due cose si somigliano abbastanza da far scrivere la
     ragione sbagliata accanto al numero giusto. `contrasto.mjs` ci è già
     cascato e l'ha corretto il 13/08: stampava «core non ha il tema "chiaro":
     NON misurata», che è una riga «non ho guardato» col conto esatto e la
     causa inventata. Qui si nasce con la versione giusta invece di ripagarla.
     I comandi che la dicono:
       grep -n "body.light-mode{" index.html   →  8021
       grep -c "dwTema" index.html             →  0
     Il core fa `classList.toggle('light-mode', temaChiaro())` dentro
     `applyTheme`, e `temaChiaro()` legge `DB.settings.theme`. Non ha
     `window.dwTema` perché non carica `shared/dw-tema.js` — ha due temi suoi.
     Quindi il tema si passa DAI DATI: nelle impostazioni di partenza del
     servito c'è `theme:'dark'`, e scambiarlo con `'light'` fa entrare il core
     nel suo tema chiaro **dalla propria porta**. Non si appiccica la classe:
     `applyTheme` la rimetterebbe a posto al primo giro e si misurerebbe un
     tema che quel core non ha (già pagato in `contrasto.mjs`, «decine di KO
     falsi»).
     ⚠️ E LA SOSTITUZIONE SI CONTA. Un `replace` che non trova niente non
     fallisce: restituisce il testo identico, e il banco misurerebbe IL BUIO
     stampando «core · chiaro» in cima. Sarebbe il verde più falso di tutti,
     perché al buio questo difetto non c'è per costruzione. */
  const temaDaiDati = (nome === 'core' && TEMA === 'chiaro')
    ? (corpo) => {
        const dopo = corpo.replace("theme:'dark'", "theme:'light'");
        if (dopo === corpo) {
          console.error("✗ core: non ho trovato `theme:'dark'` nelle impostazioni di partenza:"
            + ' mi fermo invece di misurare il buio chiamandolo chiaro.');
          process.exit(2);
        }
        return dopo;
      }
    : null;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase, trasforma: temaDaiDati });
  if (TEMA) {
    const messa = await p.evaluate(({ cls, t }) => {
      /* chi non ha `dwTema` non è per forza senza tema: il core il suo se l'è
         già messo dai dati (vedi `temaDaiDati` qui sopra), quindi la domanda
         giusta non è «so mettere questo tema?» ma «la superficie CE L'HA?» —
         che è la stessa domanda, fatta dopo che a deciderla è stato il
         programma della pagina e non questo banco. */
      if (!window.dwTema) return document.body.classList.contains(cls);
      try { localStorage.setItem('dw-tema', t); } catch (e) { /* niente */ }
      window.dwTema(t);
      return document.body.classList.contains(cls);
    }, { cls: CLASSE_TEMA[TEMA], t: TEMA });
    if (!messa) {
      /* ⛔ IL CORE NON HA IL TEMA `sole`, E QUESTA VOLTA LA RAGIONE È VERA —
         verificata, non dedotta dal fatto che manchi `dwTema` (che è
         esattamente l'errore corretto qui sopra). Il core la classe
         `outdoor-mode` la TOGLIE a ogni giro:
           grep -n "outdoor-mode" index.html | grep -v ":not(.outdoor-mode)"
           → 1341: function applyTheme(){ … document.body.classList
                     .remove('outdoor-mode'); … }
           → 8889: «Il core ha DUE temi, scuro e chiaro. La classe
                     `outdoor-mode` era il terzo, e il foglio che lo dipingeva
                     è stato tolto il 07/08 — 137 selettori»
         Delle 20 occorrenze nel file, **17 sono `body:not(.outdoor-mode)`** —
         una negazione tenuta apposta per la specificità, non un tema vivo.
         Quindi «core · sole: non misurata» è la verità, e il tema `sole`
         resta un concetto delle sole app. */
      const perche = nome === 'core' && TEMA === 'sole'
        ? 'il core ha DUE temi (scuro e chiaro): `applyTheme` fa `classList.remove("outdoor-mode")` a ogni giro'
        : 'la classe viene tolta dalla pagina stessa';
      console.log(`  ⚠️  ${nome} non ha il tema «${TEMA}» — ${perche}. NON misurata.`);
      rifiutate.push(nome); await ctx.close(); continue;
    }
  }
  if (CONTROPROVA) {
    /* il difetto di prima: la striscia torna al colore di stato crudo */
    /* ⛔ E SI CONTA QUANTI TOKEN HA DAVVERO CAMBIATO, perché col core
       nell'elenco questa iniezione ha smesso di essere universale:
         grep -c -- "--bar-ok\|--bar-wr\|--bar-dg" index.html   →  0
         grep -c -- "--bar-ok" apps/campo/index.html            →  3
       Il core i due livelli non ce li ha: dipinge con i token di stato crudi e
       basta. Un `setProperty` su un token che nessuno legge non fallisce e non
       cambia niente — è «l'iniezione che non inietta», la terza delle cinque
       cause. Senza questo conto la controprova avrebbe promosso sé stessa coi
       KO VERI del core, che nel tema chiaro ci sono comunque: verdetto giusto,
       prova inesistente. Chi non riceve l'iniezione esce dal VERDETTO della
       controprova e finisce in una riga «non ho guardato», non fra i muti. */
    const messi = await p.evaluate(() => {
      const s = getComputedStyle(document.body);
      let n = 0;
      for (const [bar, crudo] of [['--bar-ok', '--success'], ['--bar-wr', '--warn'], ['--bar-dg', '--danger']]) {
        const prima = s.getPropertyValue(bar).trim();
        const dopo = s.getPropertyValue(crudo).trim();
        if (!prima || !dopo || prima === dopo) continue;   // token assente, o già uguale: non è un difetto rimesso
        document.body.style.setProperty(bar, dopo);
        n++;
      }
      return n;
    });
    iniettati.set(nome, messi);
    if (!messi) console.log(`  ⚠️  ${nome}: la controprova non ha rimesso NESSUN difetto (non ha i --bar-…):`
      + ' quello che segue è il prodotto vero, e non prova che il banco sappia fallire.');
  }
  misurate++;
  const perApp = [];
  /* i due insiemi che vanno confrontati DOPO tutte le sezioni, non dentro una */
  const maiApp = new Set(), usatiApp = new Set();
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    const res = await p.evaluate(MISURA, SOGLIA);
    dipinte += res.conteggio.dipinte; diStato += res.conteggio.diStato; visti += res.conteggio.visti;
    for (const x of res.soggetti) perApp.push({ ...x, sez: s });
    for (const x of [...res.soggetti, ...res.decorativi]) {
      forbici.push({ app: nome, forbice: x.forbice, fermate: x.fermateVicino, peggio: x.peggio, migliore: x.migliore, sel: x.sel, token: x.token });
    }
    for (const x of res.decorativi) {
      if (x.peggio < SOGLIA) deco.set(`${nome}: ${x.sel} · ${x.token} · ${x.peggio}`, 1);
    }
    for (const m of res.maiComparse) maiApp.add(m);
    for (const u of res.usati) usatiApp.add(u);
  }
  /* la sottrazione vera si fa QUI, quando tutte le sezioni hanno parlato: un
     selettore che ha agganciato in una sezione qualunque NON è mai comparso. */
  for (const m of maiApp) if (!usatiApp.has(m)) mai.set(nome + ' ' + m, 1);
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
  koPerApp.set(nome, male.length);
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
/* ⛔ L'AMPIEZZA DEL DUBBIO DEL RIGHELLO, STAMPATA SEMPRE. Dove il vicino è un
   gradiente il verdetto usa la sua fermata peggiore, ovunque quella fermata
   stia: la forbice dice di quanto quella scelta pesa. Serve a due cose — a non
   fidarsi di un numero che ha una forbice larga, e a far VEDERE il giorno che
   questi numeri salgono, che è il giorno in cui varrà la pena portare qui la
   geometria di `contrasto.mjs`. Oggi non vale: la misura è nell'intestazione. */
{
  const multi = forbici.filter((x) => x.fermate > 1);
  const decisivi = multi.filter((x) => x.peggio < SOGLIA && x.peggio + x.forbice >= SOGLIA);
  const sopra = (n) => multi.filter((x) => x.forbice >= n).length;
  console.log(`\nFORBICE DEL RIGHELLO: ${forbici.length} accoppiamenti, ${multi.length} con un vicino a più fermate`
    + ` · ≥4: ${sopra(4)} · ≥2: ${sopra(2)} · ≥1: ${sopra(1)}`
    + ` · verdetti che dipendono da quale fermata si sceglie: ${decisivi.length}`);
  for (const x of multi.filter((y) => y.forbice >= 1).slice(0, 8)) {
    console.log(`   · ${x.app} ${x.token} ${x.sel} — da ${x.peggio} a ${(x.peggio + x.forbice).toFixed(2)}`);
  }
}
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
  /* ⛔ IL VERDETTO SI FA SOLO SU CHI IL DIFETTO L'HA RICEVUTO. Sommare i KO di
     tutte le superfici farebbe passare la controprova grazie ai KO VERI del
     core — che nel tema chiaro esistono a prescindere — cioè un «✓ so
     fallire» dimostrato da un prodotto rotto invece che da un'iniezione. E il
     denominatore si stampa sempre: «N su M», non solo il segno. */
  const conIniezione = [...iniettati.entries()].filter(([, n]) => n > 0).map(([a]) => a);
  const senza = [...iniettati.entries()].filter(([, n]) => n === 0).map(([a]) => a);
  const koVeri = conIniezione.reduce((s, a) => s + (koPerApp.get(a) || 0), 0);
  if (senza.length) {
    console.log(`\n⚠️  ${senza.length} superfici NON hanno ricevuto nessun difetto (non hanno i --bar-…):`
      + ` ${senza.join(', ')}. Fuori dal verdetto: i loro KO sono prodotto, non iniezione.`);
  }
  console.log(koVeri
    ? `\n✓ CONTROPROVA: col difetto rimesso il banco lo vede (${koVeri} KO su ${conIniezione.length} superfici iniettate).`
    : `\n✗ CONTROPROVA: col difetto rimesso il banco NON lo vede su nessuna delle ${conIniezione.length} superfici iniettate. Non sta guardando le strisce.`);
  process.exit(koVeri ? 0 : 1);
}
/* ⛔ ZERO SUPERFICI MISURATE NON È ZERO DIFETTI. Se ogni superficie è stata
   rifiutata (per esempio `--solo=core --tema=sole`, che è un caso legittimo e
   dichiarato), il conto dei KO vale zero e l'uscita sarebbe **0**: un verde
   che riguarda il nulla. È la stessa trappola del `--solo` sconosciuto, e la
   stessa regola del banco che «non accusa ma esce diverso da zero» quando non
   ha potuto misurare. Nel giro non scatta mai — `tutti.mjs` lancia questo
   banco senza `--solo`, e le sei app i tre temi ce li hanno tutti. */
if (!misurate) {
  console.log('\n✗ NESSUNA superficie misurata: quello che sta qui sopra non è un verde, è un giro a vuoto.');
  process.exit(2);
}
process.exit(ko ? 1 : 0);
