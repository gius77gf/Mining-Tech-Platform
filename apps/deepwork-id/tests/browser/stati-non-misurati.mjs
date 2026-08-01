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
  /* stessa forma di Sentinella: la riga dell'anno diceva «Scavati 0 m³» dove
     il fronte non l'aveva rilevato nessuno, e quello zero l'ente lo legge come
     una dichiarazione. Non basta che compaia «Scavo non misurato»: accanto non
     ci deve essere una cifra di scavo. */
  ['terra', 'anno con lo scavo mai rilevato', '#nav-den', null, '#den-storico', /scavo non misurato/i,
    null, { vietato: /scavati\s*[\d.,]+\s*m³/i,
            perche: 'accanto a «scavo non misurato» non si scrive nessun volume scavato' }],
  ['terra', 'base dell\'onere non dichiarabile', '#nav-den', null, '#den-oneri', /non è stato misurato/i,
    { dentro: '#den-anni', testo: '2024' }],
  /* ⛔ Un lotto che non dichiara nessun fronte NON ha volume zero: non ha un
     modo di essere misurato. «misurati —», non «misurati 0 m³», perche' su un
     lotto lo zero vorrebbe dire «non ci abbiamo ancora lavorato» e la verita'
     e' che manca il collegamento. Quarto dei cinque stati veri; in
     dimostrazione sono tre lotti su sei. */
  /* ⚠️ La riga nomina il LOTTO, non solo la frase: «misurati —» compare anche
     su un lotto che il fronte ce l'ha ma non ha ancora rilievi, e con quella
     regex la controprova NON distingueva (caso 1 della tassonomia: i dati
     facevano coincidere la risposta giusta con quella sbagliata). «Lotto 1» è
     senza fronte in dimostrazione. */
  ['terra', 'lotto senza fronte: misurato «—», non zero', '#nav-pia', null, '#lot-list',
    /Lotto 1[\s\S]*misurati\s*—/i, null, { vietato: /Lotto 1[\s\S]*misurati\s*0\s*m³/i,
                                            perche: 'un lotto senza fronte non ha «misurati 0 m³»' }],
  /* ⛔ Campo e' il caso che ha dato il nome al principio: «non lo so» non e'
     «non c'e'», perche' se suona l'allarme contare assente chi nessuno ha
     spuntato vuol dire NON ANDARLO A CERCARE. La dimostrazione non aveva
     nessuna presenza, quindi l'appello mostrava tutti da spuntare — che si
     legge «mai usato», non «di queste persone non si sa niente». Adesso i tre
     turni di oggi mostrano i tre stati, e il banco guarda quello PARZIALE. */
  /* ⚠️ NON basta cercare «ancora da spuntare»: lo dice anche l'appello VUOTO
     («appello non ancora cominciato · 4 ancora da spuntare»). Con quella regex
     la prova passava anche svuotando le presenze — cioe' portava il nome del
     caso parziale e ne provava un altro, che e' peggio di nessuna prova. Il
     parziale si riconosce perche' qualcuno E' stato spuntato: c'e' un assente
     E c'e' ancora qualcuno da spuntare, nella stessa riga. */
  ['campo', 'appello a meta\': qualcuno non l\'ha spuntato nessuno', '#nav-rap', null, '#pre-board',
    /\bassente\b[\s\S]*ancora da spuntare/i, { seleziona: '#chk-turno', valore: 'Mattina' }],
  ['campo', 'appello completo: il contrasto', '#nav-rap', null, '#pre-board',
    /appello completo/i, { seleziona: '#chk-turno', valore: 'Pomeriggio' }],
  /* Flotta e Sentinella un caso ciascuna ce l'avevano gia' in dimostrazione:
     qui non si aggiungono dati, si mette sotto guardia quello che c'e' — se
     un domani sparisce dalla demo, il banco lo dice invece di restare verde. */
  ['flotta', 'costo senza data: non sparisce dal periodo in silenzio', '#nav-cos', null, '#cos-list',
    /senza data/i],
  /* ⛔ Un tagliando A ORE su un mezzo di cui non si conosce il ritmo: non si
     sa QUANDO cadrà, e il cartellone lo scrive invece di stimare a caso. Era
     nel gruppo dei cinque stati veri usciti dalla lettura a mano della misura
     `stati-sorvegliati` — e la dimostrazione lo produce gia' da se'
     (`daStimare: 1`), quindi qui non si aggiungono dati: si sorveglia. */
  ['flotta', 'tagliando a ore senza ritmo: non si sa quando cadrà', '#nav-dash', null, '#kpi-tag',
    /non si sa quando/i],
  /* ⛔ Qui non basta che lo STATO sia dichiarato: il commento del modulo dice
     che il difetto vero e' il numero tranquillo scritto ACCANTO al badge —
     «0 µg/m³ / soglia 40» accanto a «Mai misurato», due frasi opposte sulla
     stessa riga, e quella con la cifra e' la sola che si guarda. Misurato: una
     controprova che toglieva la frase e rimetteva la cifra NON faceva cadere il
     banco, perche' il badge restava e la regex lo accettava. Da qui `vietato`. */
  /* ⛔ Una fattura aperta SENZA data di scadenza: non è in ritardo e non è nei
     termini — «non si sa», e finché è così resta fuori dallo scadenzario, che
     lo **dichiara** invece di metterla in una fascia a caso. Secondo dei
     cinque stati veri; la dimostrazione lo produce già (`f7`). */
  ['conti', 'fattura senza scadenza: resta fuori e lo dice', '#nav-rep', null, '#aging-list',
    /non si sa, e finché/i],
  /* ⛔ E nel pannello «cosa fare adesso»: la fattura senza scadenza c'e' e dice
     perche'. Prima non compariva — non per un difetto della pagina, che la
     frase ce l'aveva pronta, ma perche' `prioritaIncasso` le dava «ritardo 0»
     e il pannello ne mostra tre. Terzo dei cinque stati veri. */
  ['conti', 'da fare adesso: la fattura senza scadenza compare', '#nav-dash', null, '#prio-list',
    /non si sa entro quando/i],
  ['sentinella', 'punto in programma e mai misurato', '#nav-dash', null, '#all-list',
    /nessuna misura registrata/i, null, { vietato: /\d+[\s\u00a0]*[^\s]*\s*\/\s*soglia/i,
                                          perche: 'accanto a «mai misurato» non si scrive nessuna cifra' }],
];

/* ⛔ CONTI STA A PARTE, e non per pigrizia: il suo caso non è una riga di un
   elenco, è un FOGLIO che si costruisce solo quando qualcuno lo chiede. Il DDT
   stampava «Causale del trasporto: Vendita» e «Trasporto a cura di: mittente»
   fissi nel codice — una dichiarazione su un documento fiscale, che è il posto
   dove questo difetto costa di più. Qui si chiede il foglio come lo chiede
   l'utente (click su [data-stampa-ddt]) e si legge che cosa c'è scritto.
   ⚠️ Le etichette NON si cercano a testo: il CSS le mette in maiuscolo e
   `innerText` riflette la trasformazione. Si leggono le caselle per struttura. */
const FOGLI_CONTI = [
  ['s1', 'DDT completo a cura del mittente', { manca: false, cura: /mittente/i, causale: /Vendita/ }],
  ['s4', 'DDT a cura di un vettore, col suo nome', { manca: false, cura: /Autotrasporti/i }],
  ['s2', 'DDT senza causale: lo dichiara invece di scrivere «Vendita»', { manca: true, causale: /da indicare/i }],
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

  for (const [, etichetta, tab, sotto, dove, re, prima, extra] of casi) {
    if (await p.$(tab)) { await p.click(tab); await p.waitForTimeout(800); }
    if (sotto) {
      const sel = `#pers-tabs [data-tab="${sotto}"]`;
      if (await p.$(sel)) { await p.click(sel); await p.waitForTimeout(800); }
    }
    if (prima && prima.seleziona) {
      /* una tendina, non un bottone: `selectOption` non basta da solo perche'
         la pagina ridisegna su «change», che va lasciato arrivare */
      const ok = await p.selectOption(prima.seleziona, prima.valore).then(() => true).catch(() => false);
      guardati++;
      if (!ok) { dice(false, `${app}: ${etichetta} — non riesco a scegliere «${prima.valore}» in ${prima.seleziona}`); continue; }
      await p.waitForTimeout(800);
    } else if (prima) {
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
      /* ⚠️ `.board` c'e' perche' l'appello di Campo non e' una riga ne' una
         nota: e' il cartellone in cima, che e' proprio il posto dove il numero
         tranquillo si vedrebbe. Un elenco di selettori e' anche una
         dichiarazione di dove si e' guardato. */
      const SEL = '.item, .note, .badge, .board, .recap, .kpi';
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
      return { altezza: Math.round(riga.getBoundingClientRect().height), sorelle,
               testo: (riga.innerText || '').replace(/\n/g, ' ') };
    }, [re.source, dove]);
    guardati++;
    const nome = `${app}: ${etichetta}`;
    if (!r) { dice(false, `${nome} — non compare in ${dove}`); continue; }
    if (r.assente) { dice(false, `${nome} — ${r.assente}`); continue; }
    dice(r.altezza > 0, `${nome} — si vede sullo schermo`, r.altezza);
    const max = r.sorelle.length ? Math.max(...r.sorelle) : null;
    if (max) dice(r.altezza <= max * 1.6, `${nome} — non manda la riga a capo`, { riga: r.altezza, sorelle: max });
    /* ⛔ la seconda meta' del principio: non basta DIRE che non si sa, non si
       deve scrivere accanto un numero che sembra una misura */
    if (extra && extra.vietato) {
      /* si mostra QUELLO CHE HA FATTO CADERE, non i primi 90 caratteri della
         riga: un messaggio che non contiene il colpevole fa ricominciare la
         caccia da capo */
      const colpa = r.testo.match(extra.vietato);
      dice(!colpa, `${nome} — ${extra.perche}`, colpa && colpa[0]);
    }
  }
  dice(errori.length === 0, `${app}: nessun errore di pagina`, errori[0]);
  await ctx.close();
}

/* ── Conti: il foglio del DDT ─────────────────────────────────────────── */
if (!CONTROPROVA) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 950 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  await p.goto(`http://localhost:${PORTA}/apps/conti/index.html?demo=1`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2400);
  await p.emulateMedia({ media: 'print' });
  for (const [id, etichetta, atteso] of FOGLI_CONTI) {
    const chiesto = await p.evaluate((x) => {
      const b = document.querySelector(`[data-stampa-ddt="${x}"]`);
      if (!b) return false;
      b.click(); return true;
    }, id);
    guardati++;
    if (!chiesto) { dice(false, `conti: ${etichetta} — nessun bottone di stampa per ${id}`); continue; }
    await p.waitForTimeout(450);
    const d = await p.evaluate(() => {
      const el = document.querySelector('#stampa .doc');
      if (!el) return null;
      const box = {};
      for (const b of el.querySelectorAll('.box')) {
        const et = b.querySelector('.et');
        if (!et) continue;
        box[(et.textContent || '').trim().toLowerCase()] = (b.innerText || '').replace(et.innerText || '', '').trim();
      }
      return { causale: box['causale del trasporto'] || '', cura: box['trasporto a cura di'] || '',
               manca: !!el.querySelector('.manca') };
    });
    if (!d) { dice(false, `conti: ${etichetta} — il foglio non si è costruito`); continue; }
    dice(d.manca === atteso.manca, `conti: ${etichetta} — il riquadro «non completo» ${atteso.manca ? 'c\'è' : 'non c\'è'}`, d);
    if (atteso.causale) dice(atteso.causale.test(d.causale), `conti: ${etichetta} — causale`, d.causale);
    if (atteso.cura) dice(atteso.cura.test(d.cura), `conti: ${etichetta} — chi trasporta`, d.cura);
  }
  /* ⛔ la regola che riassume tutto: nessun foglio incompleto scrive «Vendita» */
  dice(errori.length === 0, 'conti: nessun errore di pagina', errori[0]);
  await ctx.close();
}

/* ── Scudo: la CARTELLA del lavoratore ──────────────────────────────────
   ⛔ Come il DDT, e per la stessa ragione: e' un FOGLIO, e un foglio mente
   per OMISSIONE. Una sezione vuota su un fascicolo che esce dalla stampante
   si legge «a questa persona non serve» invece di «non e' stato registrato
   niente» — e chi lo legge e' un ispettore.
   Si chiede come lo chiede l'utente: si sceglie la persona, si conferma la
   modale del core, e si guarda il foglio. */
if (!CONTROPROVA) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1300 }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  await p.goto(`http://localhost:${PORTA}/apps/scudo/index.html?demo=1`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2400);
  /* la stampa vera aprirebbe il dialogo del browser e bloccherebbe il banco */
  await p.evaluate(() => { window.print = () => {}; });
  await p.click('#nav-pers').catch(() => {});
  await p.waitForTimeout(600);
  await p.click('#pers-tabs [data-tab="dpi"]').catch(() => {});
  await p.waitForTimeout(600);

  const CARTELLE = [
    ['d1', 'cartella piena', { manca: false, contiene: /Mansioni assegnate/i,
                               vietato: /non è completa/i }],
    ['d4', 'cartella incompleta: dichiara le sezioni vuote', { manca: true,
      contiene: /non è stato registrato niente/i,
      /* ⛔ e non deve MAI limitarsi a lasciare la sezione bianca: la frase in
         fondo deve dire come vanno lette */
      pretende: /non vanno lette come «non dovuto»/i }],
  ];
  for (const [id, etichetta, atteso] of CARTELLE) {
    guardati++;
    const scelto = await p.selectOption('#dpi-verb-lav', id).then(() => true).catch(() => false);
    if (!scelto) { dice(false, `scudo: ${etichetta} — non riesco a scegliere ${id}`); continue; }
    await p.waitForTimeout(300);
    await p.click('#btn-cartella').catch(() => {});
    await p.waitForTimeout(500);
    const conferma = await p.$('#modal-foot .mbtn.primary');
    if (!conferma) { dice(false, `scudo: ${etichetta} — la modale non ha il bottone di conferma`); continue; }
    await conferma.click();
    await p.waitForTimeout(600);
    const t = await p.evaluate(() => (document.querySelector('#verbale') || {}).innerText || '');
    if (!t.trim()) { dice(false, `scudo: ${etichetta} — il foglio non si è costruito`); continue; }
    dice(atteso.contiene.test(t), `scudo: ${etichetta} — il foglio dice quello che deve`, t.slice(0, 90));
    if (atteso.vietato) dice(!atteso.vietato.test(t), `scudo: ${etichetta} — e non dice quello che non deve`,
      (t.match(atteso.vietato) || [])[0]);
    if (atteso.pretende) dice(atteso.pretende.test(t),
      `scudo: ${etichetta} — spiega come vanno lette le sezioni vuote`, t.slice(-120));
  }
  dice(errori.length === 0, 'scudo: nessun errore di pagina', errori[0]);
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
