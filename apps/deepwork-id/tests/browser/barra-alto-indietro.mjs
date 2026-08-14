/* ⛔ LA BARRA IN ALTO NON DEVE TRABOCCARE ALL'INDIETRO.
   ────────────────────────────────────────────────────────────────────
   `scrollWidth > clientWidth` — la domanda che ogni banco fa quando chiede «ci
   sta?» — NON sa rispondere a questa. Con `justify-content:flex-end`, il
   contenuto che non entra esce dalla parte OPPOSTA: verso sinistra, sopra il
   vicino. La pagina non scorre, niente viene tagliato, nessun errore in
   console. È scritto in CLAUDE.md da giorni ed è la firma da cercare: un figlio
   `position:static`, senza trasformazioni, il cui rettangolo cade **fuori dalla
   scatola del padre**.

   Il caso che ha fatto nascere questo banco (13/08, core, unità B0-vicies): la
   pastiglia «NON SALVA» finiva **sopra il nome dell'utente**. Misurato a 430 px:
   pastiglia a 109,58–186, la scatola dei comandi a 174,89–416 — 65,31 px fuori
   dal padre, 59,31 px sopra il nome — e `scrollWidth == clientWidth` (430 =
   430). Nei DUE temi con gli stessi numeri alla cifra: chi l'aveva segnalato
   come difetto del tema chiaro aveva visto giusto la sovrapposizione e sbagliato
   la causa (nel chiaro il bottone del tema è acceso, fondo ambra pieno, quindi
   copre invece di lasciar trasparire).

   ⛔ E IL RAMO CHE CONTA DI PIÙ NON È QUELLO CHE SI MISURA PER PRIMO.
   Chromium da scrivania non è `pointer:coarse`: il blocco `@media (hover:none),
   (pointer:coarse)` — che alla ricerca del core dà una larghezza FISSA — non si
   applica, e su un telefono vero comanda lui. Misurato: sul ramo del tocco il
   difetto era più grosso e arrivava fino a **320 px** (120,08 px fuori dal
   padre, 42,77 sopra il nome), cioè proprio dove la correzione dei 360 px
   sembrava averlo chiuso. Con `--tocco` quelle regole vengono **ricopiate dalla
   pagina stessa** in coda al foglio (vince l'ultimo): sono LETTE, non riscritte
   qui — se domani cambiano, cambia anche la misura, e il banco stampa quante ne
   ha trapiantate così un zero si vede.

   Cosa si pretende, per ogni barra in alto trovata, a ogni larghezza:
     1. nessun figlio statico e non trasformato esce dalla scatola del padre
        (né a sinistra né a destra) di più di mezzo pixel;
     2. nessun elemento di una metà della barra si sovrappone a un elemento
        dell'altra metà;
     3. il documento non scorre di lato — se no si scambierebbe un
        traboccamento con l'altro e sembrerebbe una correzione;
     4. e — dal 13/08 — CHI CEDE PER PRIMO: dove una barra ha insieme
        l'identità di chi è collegato e una casella di ricerca, l'identità non
        può restare più stretta della ricerca. Le prime tre domande erano
        cieche su questo (il difetto sta tutto dentro i bordi), e il perché sta
        accanto a `COPPIE_CEDEVOLI`.
   I bersagli di tocco della barra si MISURANO sempre e si pretendono solo dove
   oggi sono puliti (vedi `TOCCHI_PRETESI`): sul ramo da scrivania la casella di
   ricerca del core è alta 36 px — arretrato dichiarato, non introdotto qui, e
   sul ramo del tocco il foglio la porta già a 44.

   Uso:  node apps/deepwork-id/tests/browser/barra-alto-indietro.mjs [porta]
         node …/barra-alto-indietro.mjs [porta] --solo=core
         node …/barra-alto-indietro.mjs [porta] --tocco
         node …/barra-alto-indietro.mjs [porta] --tema=chiaro
         node …/barra-alto-indietro.mjs [porta] --controprova
   La controprova rimette lo stato di PRIMA delle correzioni (identità che non
   cede, involucro della ricerca che non si stringe, testo della pastiglia
   acceso sopra i 360 px, e la larghezza FISSA della ricerca che il ramo del
   tocco imponeva) e pretende che il banco lo veda.
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const TEMA = (process.argv.find((a) => a.startsWith('--tema=')) || '').slice(7);
const TOCCO = process.argv.includes('--tocco');
const CONTROPROVA = process.argv.includes('--controprova');
const LARGHEZZE = ((process.argv.find((a) => a.startsWith('--larghezze=')) || '').slice(12)
  || '320,360,375,390,412,430,431,460,520,560').split(',').map(Number);

if (!PORTA) { console.error('Uso: node barra-alto-indietro.mjs <porta> [--solo=] [--tocco] [--tema=] [--controprova]'); process.exit(2); }

/* le barre in alto delle superfici: il core ha `.topbar` (e `.ph` nelle
   sottopagine), le app hanno `header.top`. L'elenco è corto e dichiarato: una
   superficie senza nessuna di queste è ZERO soggetti, non «a posto». */
const BARRE = ['.topbar', '.ph', 'header.top'];

/* ⛔ NON un elenco di superfici pulite scritto a mano: qui si dichiara solo
   DOVE i bersagli di tocco si pretendono. Sul ramo da scrivania la casella di
   ricerca del core è alta 36 px per scelta del foglio (`min-height:36px`) e il
   blocco del tocco la porta a 44: pretenderlo anche da scrivania renderebbe
   questo banco rosso dalla nascita, cioè da ignorare. */
const TOCCHI_PRETESI = TOCCO;

/* ⛔ UN'ECCEZIONE DICHIARATA, COL SUO CONTO ACCANTO — E SORVEGLIATA NEI DUE
   VERSI. Entrata il 13/08 con l'unità B0-duovicies, insieme alla correzione
   che ha tolto `width:120px` dal ramo del tocco.
   Quel `width` fisso faceva due mestieri: dava alla ricerca una larghezza che
   non scalava (e a 320 px lasciava al NOME DELL'UTENTE 23,42 px — due lettere
   e i puntini) e le faceva anche da pavimento per il dito. Tolto, la casella
   segue di nuovo la scala del foglio e il nome torna a 53,44; il prezzo è che
   a 320 px, e SOLO lì, la casella è larga 39,56 invece di 44. Le due strade
   per riavere il pavimento sono state provate e misurate — un `min-width:44px`
   rimette 4,44 px di traboccamento ALL'INDIETRO sopra il nome (cioè il difetto
   che questo banco esiste per prendere), e `min-width:min-content` su
   `.topbar-cmd` porta il nome a 11 px — quindi qui si sceglie, non si nasconde.
   ⚠️ E SI SORVEGLIA CHE SI PRESENTI ANCORA, che è la lezione di
   `sonda-vuoto.mjs`: un'eccezione che non si presenta più è una riga che
   copre un difetto che non c'è più (o una misura cambiata sotto). Se il caso
   scritto qui non si vede, il banco lo dice invece di stare zitto.
   ⚠️ La larghezza è la SOLA cosa scusata: l'altezza resta pretesa a 44 (la dà
   `min-height:44px` nel blocco del tocco), e ogni altro bersaglio della barra
   resta preteso a 44×44 come prima. */
const TOCCHI_SCUSATI = [{
  superficie: 'core', chi: 'global-search', larghezza: 320, soloTocco: true,
  wMin: 38, wMax: 41, perche: 'la scala della ricerca vale più del pavimento: 39,56×44 contro un nome da 23,42 px',
}];
const scusatiVisti = new Set();
const scusabile = (nome, larghezza, t) => TOCCHI_SCUSATI.some((e, i) => {
  if (e.superficie !== nome || e.larghezza !== larghezza || e.chi !== t.chi) return false;
  if (e.soloTocco && !TOCCO) return false;
  /* la larghezza è scusata solo NELLA FORBICE misurata: se domani scendesse a
     20 px non sarebbe più lo stesso caso, e questa riga non deve coprirlo */
  if (!(t.w >= e.wMin && t.w <= e.wMax) || t.h < 44 || !t.mio) return false;
  scusatiVisti.add(i); return true;
});

/* ⛔ DOMANDA 4 — CHI CEDE PER PRIMO. Le prime tre domande guardano se qualcosa
   ESCE, si accavalla o fa scorrere la pagina: sono tutt'e tre cieche sul danno
   che una barra fa restando perfettamente dentro i suoi bordi. Misurato il
   13/08 sul ramo del tocco del core: «0 da guardare» nei due rami e nei due
   temi — e aveva ragione, niente usciva — mentre a 320 px al nome dell'utente
   restavano **23,42 px** («Gi…») e alla casella di ricerca 61,58. Non era
   spazio sparito: era spazio riassegnato al contrario della decisione scritta
   nel foglio, che dice a lettere «a cedere dev'essere la ricerca».
   La domanda è quella, e non un numero: **l'identità non può essere più
   stretta della ricerca.** Un minimo in pixel invecchierebbe col carattere e
   con la lingua; un confronto fra due elementi della stessa barra no.
   ⚠️ L'elenco è corto e DICHIARATO: una superficie che non ha tutt'e due gli
   elementi è zero soggetti, non «a posto», e il banco lo stampa. Oggi la
   coppia ce l'ha il solo core; le sei app hanno una barra senza ricerca. */
const COPPIE_CEDEVOLI = [{ superficie: 'core', identita: '#h-user', ricerca: '.topbar-search-input' }];

const MISURA_COPPIA = (c) => {
  const a = document.querySelector(c.identita), b = document.querySelector(c.ricerca);
  if (!a || !b) return null;
  const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
  if (ra.width + ra.height === 0 || rb.width + rb.height === 0) return null;
  return { id: +ra.width.toFixed(2), ric: +rb.width.toFixed(2) };
};

/* lo stato di PRIMA della correzione del 13/08. Sono VALORI di proprietà, non
   righe di sorgente citate a memoria: non scadono quando il codice si sposta.
   ⚠️ La riga della ricerca è quella tolta con B0-duovicies: era dentro il
   blocco `pointer:coarse`, quindi da scrivania non si vedeva — ma rimessa qui
   vale su tutt'e due i rami, ed è la sola che fa cadere la domanda 4. */
const CSS_PRIMA = `
  .topbar-id{flex:0 1 auto;}
  .topbar-search-wrap{min-width:auto;}
  .topbar-search-input{width:120px;}
  @media(min-width:361px){.sync-badge .sync-testo{display:inline;}.sync-badge{padding:5px 10px;}}`;

/* il tema si mette DAI DATI: le impostazioni di partenza del core dichiarano
   `theme:'dark'`. Un `replace` che non trova niente NON fallisce e restituisce
   il testo identico — cioè il banco misurerebbe il buio credendo di misurare il
   chiaro. Qui la superficie che non ha quel dato viene RIFIUTATA e dichiarata
   in fondo, che è diverso da misurarla in silenzio. */
const temaRifiutato = [];
const temaDaiDati = (nome) => (corpo) => {
  if (!TEMA) return corpo;
  const cerca = "theme:'dark'";
  if (!corpo.includes(cerca)) {
    if (!temaRifiutato.includes(nome)) temaRifiutato.push(nome);
    return corpo;
  }
  return corpo.replace(cerca, TEMA === 'chiaro' ? "theme:'light'" : cerca);
};

/* ⛔ LE REGOLE DEL TOCCO SI LEGGONO DALLA PAGINA, NON SI RISCRIVONO QUI. Una
   copia a mano diventa vecchia in silenzio: è la copia debole applicata a un
   banco. Si cammina sui fogli, si prendono le `@media` la cui condizione parla
   di `pointer:coarse` o `hover:none`, e si rimettono in coda — a parità di
   specificità vince l'ultimo, quindi valgono come se il telefono ci fosse. */
const RITAGLIA_TOCCO = () => {
  let prese = 0;
  const pezzi = [];
  for (const foglio of document.styleSheets) {
    let regole; try { regole = foglio.cssRules; } catch (e) { continue; }
    for (const r of regole) {
      if (r.type !== CSSRule.MEDIA_RULE) continue;
      const cond = (r.conditionText || r.media.mediaText || '').replace(/\s/g, '');
      if (!/pointer:coarse|hover:none/.test(cond)) continue;
      for (const dentro of r.cssRules) { pezzi.push(dentro.cssText); prese++; }
    }
  }
  const s = document.createElement('style');
  s.id = 'dw-ramo-tocco';
  s.textContent = pezzi.join('\n');
  document.head.appendChild(s);
  return prese;
};

/* la misura vera: figli fuori dalla scatola del padre, e metà che si accavallano */
const MISURA = (SEL) => {
  const fuori = [], accavalli = [];
  let barre = 0, figliGuardati = 0, contenitori = 0;
  const nome = (e) => e.id || (typeof e.className === 'string' && e.className.trim().split(/\s+/)[0]) || e.tagName;
  const visibile = (e) => { const g = getComputedStyle(e);
    return g.display !== 'none' && g.visibility !== 'hidden' && e.getBoundingClientRect().width + e.getBoundingClientRect().height > 0; };

  for (const sel of SEL) for (const barra of document.querySelectorAll(sel)) {
    if (!visibile(barra)) continue;
    barre++;
    /* domanda 1 — ogni contenitore in riga dentro la barra, la barra compresa */
    const cand = [barra, ...barra.querySelectorAll('*')];
    for (const p of cand) {
      const g = getComputedStyle(p);
      if (g.display !== 'flex' && g.display !== 'inline-flex') continue;
      if (g.flexDirection.startsWith('column')) continue;
      if (!visibile(p)) continue;
      contenitori++;
      const rp = p.getBoundingClientRect();
      for (const f of p.children) {
        const gf = getComputedStyle(f);
        if (gf.display === 'none' || gf.position !== 'static' || gf.transform !== 'none') continue;
        const r = f.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        figliGuardati++;
        const sx = rp.left - r.left, dx = r.right - rp.right;
        if (sx > 0.5 || dx > 0.5)
          fuori.push({ barra: nome(barra), padre: nome(p), figlio: nome(f),
                       sinistra: +Math.max(0, sx).toFixed(2), destra: +Math.max(0, dx).toFixed(2),
                       rett: [+r.left.toFixed(2), +r.right.toFixed(2)],
                       padreRett: [+rp.left.toFixed(2), +rp.right.toFixed(2)] });
      }
    }
    /* domanda 2 — due metà della barra che si accavallano. Si confrontano le
       FOGLIE (un antenato contiene sempre i suoi figli: confrontarlo darebbe
       sovrapposizioni finte), e solo fra rami diversi della barra. */
    const meta = [...barra.children].filter(visibile);
    const foglie = (radice) => [radice, ...radice.querySelectorAll('*')]
      .filter((e) => e.children.length === 0 && visibile(e));
    for (let i = 0; i < meta.length; i++) for (let j = i + 1; j < meta.length; j++)
      for (const a of foglie(meta[i])) for (const b of foglie(meta[j])) {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ox > 0.5 && oy > 0.5)
          accavalli.push({ barra: nome(barra), a: nome(a), b: nome(b), x: +ox.toFixed(2), y: +oy.toFixed(2) });
      }
  }
  /* domanda 3 — e nel frattempo il documento non ha cominciato a scorrere */
  const scorre = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  /* i bersagli della barra */
  const tocchi = [];
  for (const sel of SEL) for (const barra of document.querySelectorAll(sel)) {
    if (!visibile(barra)) continue;
    for (const e of barra.querySelectorAll('button, a[href], input, [role="button"], [onclick]')) {
      if (!visibile(e)) continue;
      const r = e.getBoundingClientRect();
      const s = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const mio = !!s && (s === e || e.contains(s));
      tocchi.push({ chi: nome(e), w: +r.width.toFixed(1), h: +r.height.toFixed(1), mio });
    }
  }
  return { fuori, accavalli, scorre, barre, figliGuardati, contenitori, tocchi };
};

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const superfici = SUPERFICI.filter(([n]) => !SOLO || n === SOLO);
if (SOLO && !superfici.length) { console.error(`✗ --solo=${SOLO}: superficie sconosciuta`); process.exit(2); }

let guai = 0, barreTot = 0, figliTot = 0, misureTot = 0, senzaBarra = [], tocchiKo = 0, tocchiTot = 0, tocchiScusati = 0;
const coppieViste = new Set(), coppieMute = new Set();
let regoleTocco = 0;
const perSuperficie = {};

for (const [nome, via] of superfici) {
  perSuperficie[nome] = 0;
  let barreQui = 0;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 950,
      montaFintoFirebase, trasforma: TEMA ? temaDaiDati(nome) : null });
    await p.waitForTimeout(nome === 'core' ? 700 : 400);
    if (TOCCO) regoleTocco = Math.max(regoleTocco, await p.evaluate(RITAGLIA_TOCCO));
    if (CONTROPROVA) await p.addStyleTag({ content: CSS_PRIMA });
    await p.waitForTimeout(250);
    const m = await p.evaluate(MISURA, BARRE);
    misureTot++;
    barreQui = Math.max(barreQui, m.barre);
    barreTot += m.barre; figliTot += m.figliGuardati;
    tocchiTot += m.tocchi.length;
    const ktTutti = m.tocchi.filter((t) => t.w < 44 || t.h < 44 || !t.mio);
    const kt = ktTutti.filter((t) => !scusabile(nome, larghezza, t));
    tocchiScusati += ktTutti.length - kt.length;
    tocchiKo += kt.length;
    /* domanda 4 — chi cede per primo */
    const coppia = COPPIE_CEDEVOLI.find((c) => c.superficie === nome);
    let cedeIdentita = null;
    if (coppia) {
      const mc = await p.evaluate(MISURA_COPPIA, coppia);
      if (!mc) coppieMute.add(nome); else { coppieViste.add(nome); if (mc.id < mc.ric) cedeIdentita = mc; }
    }
    const quanti = m.fuori.length + m.accavalli.length + (m.scorre > 0 ? 1 : 0) + (cedeIdentita ? 1 : 0);
    if (quanti) {
      guai += quanti; perSuperficie[nome] += quanti;
      console.log(`\n✗ ${nome} · ${larghezza} px${TEMA ? ' · tema ' + TEMA : ''}${TOCCO ? ' · ramo TOCCO' : ''}`);
      for (const f of m.fuori)
        console.log(`   fuori dal padre: <${f.figlio}> esce da <${f.padre}> di ${f.sinistra} px a sinistra`
          + ` e ${f.destra} a destra — figlio ${f.rett.join('–')}, padre ${f.padreRett.join('–')}`);
      for (const a of m.accavalli)
        console.log(`   accavallamento : <${a.a}> sopra <${a.b}> per ${a.x}×${a.y} px`);
      if (m.scorre > 0) console.log(`   e il documento scorre di lato di ${m.scorre} px`);
      if (cedeIdentita) console.log(`   cede l'identità invece della ricerca: <${coppia.identita}> ${cedeIdentita.id} px`
        + ` contro <${coppia.ricerca}> ${cedeIdentita.ric} px — il foglio dice che a cedere dev'essere la ricerca`);
    }
    if (TOCCHI_PRETESI && kt.length) {
      guai += kt.length; perSuperficie[nome] += kt.length;
      console.log(`\n✗ ${nome} · ${larghezza} px · bersagli di tocco: ${JSON.stringify(kt)}`);
    }
    await ctx.close();
  }
  if (!barreQui) senzaBarra.push(nome);
}
await b.close();

/* ⛔ PRIMA DEI KO, LE RIGHE «NON HO GUARDATO». */
if (senzaBarra.length)
  console.log(`\n   ⚠️ ${senzaBarra.length} superfici senza nessuna barra in alto fra ${BARRE.join(', ')}`
    + ` — zero soggetti, NON «a posto»: ${senzaBarra.join(', ')}`);
if (TEMA)
  console.log(`   TEMA «${TEMA}»: ${superfici.length - temaRifiutato.length} superfici messe nel tema`
    + (temaRifiutato.length
      ? `, ${temaRifiutato.length} NO perché non hanno quel dato di partenza — misurate nel loro tema di serie,`
        + ` non in «${TEMA}» (${temaRifiutato.join(', ')})`
      : ''));
if (TOCCO)
  console.log(`   ramo TOCCO: ${regoleTocco} regole di \`pointer:coarse\`/\`hover:none\` lette dalla pagina e rimesse in coda`
    + (regoleTocco ? '' : ' — ZERO: il ramo del tocco NON è stato simulato, questa passata misura la scrivania'));
console.log(`   domanda 4 (chi cede per primo): ${coppieViste.size} superfici su ${superfici.length} hanno`
  + ` la coppia identità/ricerca e sono state misurate`
  + (coppieMute.size ? `; ${coppieMute.size} la dichiarano e non l'hanno resa visibile (${[...coppieMute].join(', ')})` : '')
  + `; ${superfici.length - COPPIE_CEDEVOLI.filter((c) => !SOLO || c.superficie === SOLO).length} non ce l'hanno`
  + ' — zero soggetti, NON «a posto»');

/* ⛔ L'ECCEZIONE SI DICHIARA, E SI DICHIARA ANCHE QUANDO NON SI PRESENTA. Un
   elenco più vecchio del codice copre un difetto che non c'è più: qui la forma
   da leggere è «N scusati, N dichiarati», la stessa di `sonda-vuoto.mjs`. */
{
  const attesi = TOCCHI_SCUSATI.filter((e) => !e.soloTocco || TOCCO)
    .filter((e) => !SOLO || e.superficie === SOLO)
    .filter((e) => LARGHEZZE.includes(e.larghezza));
  /* ⚠️ non sotto controprova: lì il soggetto è cambiato APPOSTA, quindi
     «l'eccezione non si presenta» sarebbe vero e non vorrebbe dire niente */
  const mancanti = CONTROPROVA ? []
    : attesi.filter((e) => !scusatiVisti.has(TOCCHI_SCUSATI.indexOf(e)));
  if (attesi.length)
    console.log(`   ⚠️ ${tocchiScusati} bersagli di tocco SCUSATI per dichiarazione su ${attesi.length} casi dichiarati:`
      + attesi.map((e) => `\n      · ${e.superficie} · ${e.chi} · ${e.larghezza} px — ${e.perche}`).join(''));
  if (mancanti.length) {
    guai += mancanti.length;
    console.log(`\n✗ ${mancanti.length} eccezioni dichiarate NON si presentano più — l'elenco è più vecchio del codice,`
      + ' e una riga che scusa un caso che non c\'è copre il prossimo che ci somiglia:'
      + mancanti.map((e) => `\n   ${e.superficie} · ${e.chi} · ${e.larghezza} px`).join(''));
  }
}
if (!TOCCHI_PRETESI)
  console.log(`   ${tocchiKo} bersagli di tocco sotto i 44 px o coperti su ${tocchiTot} misurati:`
    + ' CONTATI E NON PRETESI su questo ramo (la casella di ricerca del core è alta 36 px da foglio;'
    + ' il blocco del tocco la porta a 44 — si pretende con `--tocco`)');

console.log(`\n${barreTot} barre in alto misurate · ${figliTot} figli confrontati con la scatola del padre`
  + ` · ${misureTot} misure (${superfici.length} superfici × ${LARGHEZZE.length} larghezze)`
  + ` nel tema «${TEMA || 'scuro'}»${TOCCO ? ', ramo TOCCO' : ''} · ${guai} da guardare`);

if (CONTROPROVA) {
  const mute = Object.entries(perSuperficie).filter(([, n]) => !n).map(([s]) => s);
  console.log(guai > 0
    ? `\n✓ controprova: rimesso lo stato di prima, il banco lo vede (${guai} da guardare)`
      + (mute.length ? `\n   ⚠️ ma su ${mute.length} superfici l'iniezione non morde (${mute.join(', ')})`
        + ' — non hanno quelle classi, quindi lì questa controprova non dimostra niente' : '')
    : '\n✗ controprova: con lo stato di prima rimesso il banco NON lo vede — non sa fallire');
  process.exit(guai > 0 ? 0 : 1);
}
process.exit(guai > 0 ? 1 : 0);
