/* OGNI RIQUADRO DELLA VETRINA APRE DAVVERO QUALCOSA, E DA LÌ SI TORNA INDIETRO.
   Serve per le dimostrazioni dal vivo, dove un riquadro che porta a una pagina
   bianca — o un'app da cui non si esce se non col tasto indietro del browser —
   vale più di dieci difetti nascosti. Nessun test esistente lo vedeva: i
   collegamenti sono `href`, e un `href` sbagliato non fa fallire niente.

   Cosa si pretende, per ogni scheda:
   1. il riquadro è un collegamento e punta a un file che esiste (non 404);
   2. la pagina che si apre monta DAVVERO qualcosa — non basta lo stato 200,
      perché una pagina che va in errore nel suo programma risponde 200 e resta
      vuota (è successo col core, che senza Firebase non partiva e mostrava
      solo i segnaposto);
   3. da quella pagina si torna alla vetrina con un comando visibile.

   Il core è l'eccezione dichiarata: si apre sulla sua schermata d'accesso, che
   è quello che deve fare, e il ritorno lì non c'è per scelta.

   Uso:  node apps/deepwork-id/tests/browser/vetrina-collegamenti.mjs 8823
*/
import { prendiChromium, CHROMIUM } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const BASE = `http://127.0.0.1:${PORTA}`;

/* le app che devono avere il ritorno all'ecosistema; il core no, e Deepwork ID
   nemmeno: è la porta d'ingresso, non una stanza */
const SENZA_RITORNO = ['/index.html', '/apps/deepwork-id/index.html'];

/* CONTROPROVA: con «--senza-ritorno» si serve ogni app con il comando di
   ritorno tolto. Se il banco passa lo stesso, non sta guardando quello che
   crede. Una controprova inerte è già capitata: la riga cercata non c'era
   nella forma prevista e «0 fallite» voleva dire «non ho tolto niente». */
const CONTROPROVA = process.argv.includes('--senza-ritorno');
const RITORNI = ['class="dw-home"', 'class="g-home"'];

let ok = 0, ko = 0;
const prova = (n, c, e) => {
  if (c) { ok++; console.log('  ok  ' + n); }
  else { ko++; console.log('  KO  ' + n + (e !== undefined ? '\n        -> ' + JSON.stringify(e) : '')); }
};

const b = await chromium.launch({ executablePath: CHROMIUM });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'it-IT' });
const p = await ctx.newPage();
await p.goto(`${BASE}/apps/index.html`);
await p.waitForTimeout(1500);

const schede = await p.$$eval('.scheda', (as) => as.map((a) => ({
  href: a.getAttribute('href'),
  nome: (a.querySelector('.nome') || {}).textContent || '(senza nome)',
})));
console.log(`\n── ${schede.length} riquadri nella vetrina ──`);
prova('la vetrina ha nove riquadri', schede.length === 9, schede.length);

/* ⛔ I NUMERI ANNUNCIATI DEVONO CORRISPONDERE A QUELLO CHE C'È IN PAGINA.
   Il 30/07 l'apertura diceva «5 ponti fra le app», il sottotitolo della sezione
   diceva «Quattro cose che nessuno di loro, da solo, saprebbe fare» e i riquadri
   erano quattro — mentre i ponti scritti davvero nel codice erano SEI. Tre
   numeri, tre valori diversi, tutti sbagliati, su una pagina fatta per essere
   guardata da un cliente che conta.
   È il difetto tipico di una pagina di presentazione: il numero si scrive una
   volta e poi il prodotto cresce. Qui il numero si CONFRONTA con la pagina, e
   il confronto si fa da sé ogni volta. */
{
  const dette = await p.evaluate(() => {
    const n = (s) => { const e = [...document.querySelectorAll('.cifra')]
      .find((x) => (x.querySelector('span') || {}).textContent.includes(s));
      return e ? parseInt(e.querySelector('b').textContent, 10) : null; };
    const sot = [...document.querySelectorAll('.sez-sot')].map((x) => x.textContent).join(' ');
    const parola = { quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9 };
    const dichiarataAParole = Object.entries(parola)
      .filter(([w]) => new RegExp('\\b' + w + ' cose', 'i').test(sot)).map(([, v]) => v)[0] || null;
    return { ponti: n('ponti'), dichiarataAParole, riquadriPonte: document.querySelectorAll('.ponte').length };
  });
  prova(`i ponti annunciati nell'apertura (${dette.ponti}) sono quelli mostrati (${dette.riquadriPonte})`,
    dette.ponti === dette.riquadriPonte, dette);
  prova(`e il sottotitolo dice lo stesso numero a parole (${dette.dichiarataAParole})`,
    dette.dichiarataAParole === dette.riquadriPonte, dette);
}

/* ⛔ LE NOVE ANTEPRIME SI VEDONO ALL'ARRIVO, senza scorrere. Misurato il 30/07
   su un telefono da 390 px: con `loading="lazy"` all'arrivo ne era caricata UNA
   su nove, e scendendo di corsa fino a metà pagina se ne vedevano sette — le
   altre restavano la miniatura disegnata, che è la STESSA per tutte le schede.
   Su una pagina il cui unico mestiere è far vedere nove prodotti diversi, quello
   che si vede sono nove segnaposto uguali. Nessuna prova poteva accorgersene:
   l'immagine c'è nel sorgente, il file esiste, la pagina risponde 200 — manca
   solo il momento in cui arriva, e quello lo dice soltanto il browser.
   La prova si fa su uno schermo da telefono: su un monitor largo entrano più
   schede sopra la piega e la pigrizia si vede molto meno. */
{
  const tel = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'it-IT' });
  const t = await tel.newPage();
  await t.goto(`${BASE}/apps/index.html`);
  await t.waitForTimeout(2500);
  const img = await t.evaluate(() => [...document.querySelectorAll('.anteprima img')].map((i) => ({
    file: i.src.split('/').pop(), caricata: i.complete && i.naturalWidth > 0, pigra: i.loading === 'lazy',
  })));
  const mancanti = img.filter((x) => !x.caricata);
  prova(`le nove anteprime sono già caricate all'arrivo (telefono, senza scorrere)`,
    img.length === 9 && mancanti.length === 0, { su: img.length, mancanti: mancanti.map((x) => x.file) });
  prova('e nessuna è dichiarata pigra', img.every((x) => !x.pigra),
    img.filter((x) => x.pigra).map((x) => x.file));
  await tel.close();
}

for (const { href, nome } of schede) {
  const via = new URL(href, `${BASE}/apps/index.html`).pathname;
  console.log(`\n══ ${nome}  ->  ${via}`);
  const q = await ctx.newPage();
  const errori = [];
  q.on('pageerror', (e) => errori.push(e.message));
  if (via === '/index.html') await montaFintoFirebase(q);
  if (CONTROPROVA && !SENZA_RITORNO.includes(via)) {
    await q.route('**' + via, async (r) => {
      const res = await r.fetch();
      const prima = await res.text();
      let dopo = prima;
      for (const m of RITORNI) dopo = dopo.split(m).join('class="ritorno-tolto"');
      if (dopo === prima) { console.error(`  ✗ ${nome}: CONTROPROVA INERTE, nessun comando di ritorno trovato nel sorgente`); process.exitCode = 2; }
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: dopo });
    });
  }
  const risposta = await q.goto(BASE + via, { waitUntil: 'domcontentloaded' }).catch(() => null);
  prova(`${nome}: la pagina risponde`, !!risposta && risposta.status() < 400,
    risposta ? risposta.status() : 'nessuna risposta');
  await q.waitForTimeout(via === '/index.html' ? 3200 : 2200);

  /* «monta davvero»: c'è del testo visibile e più di una manciata di elementi.
     Una pagina che va in errore nel suo programma risponde 200 e resta vuota. */
  const vivo = await q.evaluate(() => {
    const t = (document.body.innerText || '').trim();
    /* Un modulo d'accesso è LEGITTIMAMENTE piccolo: la prima versione chiedeva
       più di quaranta elementi e bocciava Deepwork ID, che ne ha trentasette
       ed è esattamente la pagina che deve essere. Non si abbassa la soglia: si
       cambia la domanda. Una pagina è viva se ha del testo E qualcosa con cui
       si interagisce — un modulo da compilare oppure un'interfaccia montata. */
    const campi = document.querySelectorAll('input, select, textarea').length;
    const comandi = document.querySelectorAll('button, a[href], [role=button]').length;
    return { caratteri: t.length, elementi: document.querySelectorAll('body *').length,
             campi, comandi, titolo: document.title };
  });
  prova(`${nome}: la pagina monta davvero (${vivo.caratteri} caratteri, ${vivo.elementi} elementi, ${vivo.campi} campi, ${vivo.comandi} comandi)`,
    vivo.caratteri > 120 && (vivo.elementi > 40 || (vivo.campi >= 1 && vivo.comandi >= 2)), vivo);
  prova(`${nome}: nessun errore di pagina`, errori.length === 0, errori.slice(0, 2));

  if (!SENZA_RITORNO.includes(via)) {
    const ritorno = await q.evaluate(() => {
      const a = [...document.querySelectorAll('a[href]')].find((x) =>
        /(^|\/)(\.\.\/)?index\.html$/.test(x.getAttribute('href') || '') &&
        /ecosistema|deepwork/i.test((x.getAttribute('title') || '') + (x.getAttribute('aria-label') || '') + x.textContent));
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { href: a.getAttribute('href'), largo: Math.round(r.width), alto: Math.round(r.height) };
    });
    prova(`${nome}: si torna all'ecosistema con un comando visibile`,
      !!ritorno && ritorno.largo > 0 && ritorno.alto >= 30, ritorno);
  }
  await q.close();
}

await b.close();
console.log(`\n${ok} passate, ${ko} fallite`);
/* nella controprova il successo è il contrario: se NON cade niente, il banco
   non sta misurando il ritorno */
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
