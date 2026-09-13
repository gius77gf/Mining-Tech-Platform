/* OGNI RIQUADRO DELLA VETRINA APRE DAVVERO QUALCOSA, E DA LÌ SI TORNA INDIETRO.
   Serve per le dimostrazioni dal vivo, dove un riquadro che porta a una pagina
   bianca — o un'app da cui non si esce se non col tasto indietro del browser —
   vale più di dieci difetti nascosti. Nessun test esistente lo vedeva: i
   collegamenti sono `href`, e un `href` sbagliato non fa fallire niente.

   ⛔ RISCRITTO IL 04/09, PERCHÉ ERA ROSSO SU HEAD DA DIECI GIORNI E NESSUNO
   L'AVEVA LANCIATO. La vetrina è stata rifatta il 25-26/08 (la corona, la
   fascia, le schede con «Apri X›»); questo banco cercava ancora `.scheda`,
   `.cta.primaria`, `.cifra`, `.sez-sot`, `.ponte`, `.anteprima img` — classi
   che nella pagina nuova NON ESISTONO. Misurato il 04/09 sul disco: 3 passate,
   5 fallite, e «0 superfici hanno un segno d'avvio», cioè il ciclo sui
   riquadri non seguiva NIENTE. Il checkpoint del 25/08 lo diceva («la
   copertura esiste, ma nessuna passata è girata da quando la pagina è quella
   nuova»): era vero, e nessuno l'ha raccolto. È la forma del «già coperto» che
   non copre: un banco registrato in `tutti.mjs` che accusa una pagina di non
   avere riquadri, e un giro che dichiara «da guardare» una cosa che nessuno
   guarda. I selettori di oggi sono quelli che usa `apps/vetrina/strumenti/
   tour-aperto.mjs`, che è l'altro righello sulla stessa pagina: chi cambia
   l'uno guardi l'altro.

   Cosa si pretende:
   1. nove riquadri «Apri …», con i nomi ATTUALI delle app (i nomi nuovi sono
      SOSPESI, docs/NOMI_E_MARCHI.md: un nome proposto che entrasse qui
      farebbe cadere questa riga);
   2. il marchio Deepwork nella pagina è IDENTICO a quello canonico del core,
      elemento per elemento — letto dal server, sulla stessa copia servita;
   3. «Prova il tour» porta dove porta il riquadro di Deepwork (il core, che
      dal 25/08 È il tour: la sua schermata d'accesso mostra le credenziali
      demo), in tutt'e quattro le sue copie;
   4. ogni collegamento interno della pagina risponde (non 404);
   5. per ogni riquadro: la pagina risponde, monta DAVVERO qualcosa, il suo
      programma è partito, nessun errore di pagina, e da lì si torna alla
      vetrina con un comando visibile (il core e Deepwork ID sono le eccezioni
      dichiarate: portone e schermata d'accesso, non stanze);
   6. la pagina d'accesso di Deepwork ID: con «#tour» il tour parte da solo, e
      senza frammento l'accesso normale resta intatto.

   Uso:  node apps/deepwork-id/tests/browser/vetrina-collegamenti.mjs 8823
         … --senza-ritorno    (controprova: si toglie il comando di ritorno)
         … --senza-programma  (controprova: si uccide il modulo di ogni pagina)
*/
import { prendiChromium, CHROMIUM } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const BASE = `http://127.0.0.1:${PORTA}`;

/* le app che devono avere il ritorno all'ecosistema; il core no, e Deepwork ID
   nemmeno: è la porta d'ingresso, non una stanza */
const SENZA_RITORNO = ['/index.html', '/apps/deepwork-id/'];
/* i nomi ATTUALI (docs/NOMI_E_MARCHI.md, §3: fino a nuova decisione restano
   questi; i candidati non entrano in nessuna schermata) */
const NOMI_ATTESI = ['Deepwork', 'Campo', 'Flotta', 'Scudo', 'Terra', 'Conti', 'Sentinella', 'Genesi', 'Deepwork ID'];

const CONTROPROVA = process.argv.includes('--senza-ritorno');
const RITORNI = ['class="dw-home"', 'class="g-home"'];
const SENZA_PROGRAMMA = process.argv.includes('--senza-programma');

let ok = 0, ko = 0;
const prova = (n, c, e) => {
  if (c) { ok++; console.log('  ok  ' + n); }
  else { ko++; console.log('  KO  ' + n + (e !== undefined ? '\n        -> ' + JSON.stringify(e).slice(0, 400) : '')); }
};

let conSegnoAvvio = 0, avvioRosso = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'it-IT', serviceWorkers: 'block' });
const p = await ctx.newPage();
await p.goto(`${BASE}/apps/index.html`);
await p.waitForTimeout(1500);

/* 1 · nove riquadri, coi nomi attuali */
const schede = await p.$$eval('a.apri', (as) => as.map((a) => ({
  href: a.getAttribute('href'),
  nome: (a.textContent || '').replace(/[›»]/g, '').replace(/^\s*Apri\s+/i, '').trim() || '(senza nome)',
})));
console.log(`\n── ${schede.length} riquadri nella vetrina ──`);
prova('la vetrina ha nove riquadri «Apri …»', schede.length === 9, schede.length);
const nomi = schede.map((s) => s.nome);
prova(`i nomi sono quelli attuali (${nomi.join(', ')})`,
  NOMI_ATTESI.every((n) => nomi.includes(n)) && nomi.every((n) => NOMI_ATTESI.includes(n)),
  { mancano: NOMI_ATTESI.filter((n) => !nomi.includes(n)), inattesi: nomi.filter((n) => !NOMI_ATTESI.includes(n)) });

/* 2 · il marchio è quello del core, elemento per elemento. Si legge dal SERVER
   (la stessa copia che il giro sta servendo), non dal disco: così un giro su
   una worktree giudica quello che sta misurando. Il confronto è quello di
   `apps/vetrina/strumenti/marchio-intatto.mjs`: si tolgono SOLO misura, classe
   e attributi di servizio, e si normalizzano gli spazi. */
{
  const m = await p.evaluate(async () => {
    const disegno = (svg) => svg.replace(/\s(width|height|class|aria-hidden|xmlns)="[^"]*"/g, '').replace(/\s+/g, ' ').trim();
    const core = await (await fetch('/index.html', { cache: 'no-store' })).text();
    const canone = [...core.matchAll(/<svg[^>]*viewBox="0 0 120 122"[\s\S]*?<\/svg>/g)].map((x) => disegno(x[0]));
    /* ⚠️ si legge il SORGENTE della vetrina, non l'`outerHTML` del DOM: in un
       documento HTML il browser serializza `<polygon …/>` come
       `<polygon …></polygon>`, e il confronto col testo del core dava «6
       diversi» su sei marchi identici (misurato il 04/09, prima stesura). */
    const sorgente = await (await fetch(location.pathname, { cache: 'no-store' })).text();
    const pagina = [...sorgente.matchAll(/<svg class="marchio"[\s\S]*?<\/svg>/g)].map((x) => disegno(x[0]));
    return { canone: canone.length, pagina: pagina.length, diversi: pagina.filter((d) => d !== canone[0]).length,
             forme: new Set(pagina).size, esempio: pagina[0] ? pagina[0].slice(0, 120) : null, rif: canone[0] ? canone[0].slice(0, 120) : null };
  });
  prova(`il marchio canonico si legge dal core servito (${m.canone} copia)`, m.canone === 1, m);
  prova(`i ${m.pagina} marchi della vetrina sono IDENTICI a quello del core (${m.diversi} diversi, ${m.forme} forma)`,
    m.pagina >= 1 && m.diversi === 0 && m.forme === 1, m);
}

/* 3 · «Prova il tour» porta dove porta Deepwork */
{
  const tour = await p.$$eval('a.bot.pri', (as) => as.map((a) => ({ testo: a.textContent.trim(), href: a.getAttribute('href') })));
  const deepwork = (schede.find((s) => s.nome === 'Deepwork') || {}).href;
  prova(`i ${tour.length} bottoni «Prova il tour» portano dove porta il riquadro di Deepwork (${deepwork})`,
    tour.length >= 1 && tour.every((t) => /prova il tour/i.test(t.testo) && t.href === deepwork), tour);
}

/* 4 · ogni collegamento interno risponde */
{
  const vie = [...new Set(await p.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href'))))];
  const rotti = [];
  for (const v of vie) {
    const r = await p.request.get(BASE + v).catch(() => null);
    if (!r || r.status() >= 400) rotti.push({ v, stato: r ? r.status() : 'nessuna risposta' });
  }
  prova(`tutti i ${vie.length} collegamenti interni distinti rispondono`, vie.length > 0 && rotti.length === 0, rotti);
}

/* 6 · la pagina d'accesso di Deepwork ID e il frammento «#tour» */
for (const [frammento, atteso] of [['', 0], ['#tour', 1]]) {
  const q = await ctx.newPage();
  await montaFintoFirebase(q);
  await q.addInitScript(() => {
    window.__tourCliccato = 0;
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'btn-tour') window.__tourCliccato++;
    }, true);
  });
  await q.goto(`${BASE}/apps/deepwork-id/index.html${frammento}`);
  await q.waitForTimeout(2600);
  const n = await q.evaluate(() => window.__tourCliccato);
  prova(frammento ? 'con «#tour» il tour parte da solo, una volta sola'
                  : `senza frammento l'accesso normale resta intatto`,
    n === atteso, { atteso, avuto: n });
  await q.close();
}

/* 5 · ogni riquadro, seguito */
for (const { href, nome } of schede) {
  const via = new URL(href, `${BASE}/apps/index.html`).pathname;
  console.log(`\n══ ${nome}  ->  ${via}`);
  const q = await ctx.newPage();
  const errori = [];
  q.on('pageerror', (e) => errori.push(e.message));
  if (via === '/index.html' || via === '/') await montaFintoFirebase(q);
  if (SENZA_PROGRAMMA) {
    await q.route('**' + via, async (r) => {
      const res = await r.fetch();
      const prima = await res.text();
      const dopo = prima.split('<script type="module">').join('<script type="module">throw new Error("programma ucciso dalla controprova");');
      if (dopo === prima) { console.error(`  ✗ ${nome}: CONTROPROVA INERTE, nessun modulo trovato nel sorgente`); process.exitCode = 2; }
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: dopo });
    });
  }
  const senzaRitorno = SENZA_RITORNO.includes(via) || via === '/';
  if (CONTROPROVA && !senzaRitorno) {
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
  await q.waitForTimeout(via === '/' || via === '/index.html' ? 3200 : 2200);

  /* «monta davvero»: c'è del testo visibile e più di una manciata di elementi.
     Un modulo d'accesso è LEGITTIMAMENTE piccolo (Deepwork ID ha trentasette
     elementi): una pagina è viva se ha del testo E qualcosa con cui si
     interagisce — un modulo da compilare oppure un'interfaccia montata. */
  const vivo = await q.evaluate(() => {
    const t = (document.body.innerText || '').trim();
    const campi = document.querySelectorAll('input, select, textarea').length;
    const comandi = document.querySelectorAll('button, a[href], [role=button]').length;
    return { caratteri: t.length, elementi: document.querySelectorAll('body *').length,
             campi, comandi, titolo: document.title };
  });
  prova(`${nome}: la pagina monta davvero (${vivo.caratteri} caratteri, ${vivo.elementi} elementi, ${vivo.campi} campi, ${vivo.comandi} comandi)`,
    vivo.caratteri > 120 && (vivo.elementi > 40 || (vivo.campi >= 1 && vivo.comandi >= 2)), vivo);
  prova(`${nome}: nessun errore di pagina`, errori.length === 0, errori.slice(0, 2));

  /* «IL PROGRAMMA È PARTITO» è una domanda DIVERSA da «la pagina monta»:
     misurato il 01/08 uccidendo il modulo, «monta davvero» passava su tutte le
     superfici perché il markup è quasi tutto statico. Il segno è diverso per
     ogni famiglia, e ognuno è stato scelto misurando la pagina viva e morta:
     · le sei app → la nota del modo (`#mode-note`): 57-72 caratteri contro 0;
     · il core → `window.nav`: vivo è la funzione vera, morto il SEGNAPOSTO;
     · Genesi → i comandi con un gestore attaccato dal programma: 64 contro 0;
     · Deepwork ID (dal 04/09) → il gestore di «Accedi»: il modulo lo monta
       (`$('btn-login').onclick = …`), morto resta `null`. */
  const leggiSegno = () => {
    if (via === '/index.html' || via === '/') return q.evaluate(() => {
      try { return /\[Deepwork\] Funzione/.test(String(window.nav)) ? 0 : 1; } catch (e) { return 0; }
    });
    if (via === '/apps/genesi/genesi.html') return q.evaluate(() =>
      [...document.querySelectorAll('button')].filter((b) => b.onclick).length);
    if (via.startsWith('/apps/deepwork-id/')) return q.evaluate(() => {
      const b = document.getElementById('btn-login'); return b && typeof b.onclick === 'function' ? 1 : 0;
    });
    return q.evaluate(() => {
      const e = document.getElementById('mode-note');
      return e ? (e.textContent || '').trim().length : -1;
    });
  };
  let avvio = await leggiSegno();
  for (let i = 0; i < 20 && avvio === 0; i++) { await q.waitForTimeout(250); avvio = await leggiSegno(); }
  if (avvio >= 0) {
    conSegnoAvvio++;
    if (avvio === 0) avvioRosso++;
    const comeSegno = (via === '/index.html' || via === '/')
      ? `window.nav è ${avvio ? 'la funzione vera' : 'ancora IL SEGNAPOSTO'}`
      : via === '/apps/genesi/genesi.html' ? `${avvio} comandi hanno un gestore`
      : via.startsWith('/apps/deepwork-id/') ? `«Accedi» ${avvio ? 'ha' : 'NON ha'} il suo gestore`
      : `la nota del modo ha ${avvio} caratteri`;
    prova(`${nome}: il programma è partito davvero (${comeSegno})`,
      avvio > 0, { avvio, perche: 'col modulo morto questo segno vale 0' });
  }

  if (!senzaRitorno) {
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
console.log(`${conSegnoAvvio} superfici hanno un segno d'avvio, e su quelle si è preteso che il programma fosse partito`);
/* NOVE: sei app + core + Genesi + Deepwork ID. Il numero è asserito perché se
   domani una app perdesse il suo segno, la prova sparirebbe in silenzio e il
   totale resterebbe verde. */
const ATTESE = 9;
if (SENZA_PROGRAMMA) {
  if (avvioRosso === ATTESE) {
    console.log(`La controprova ha spento il programma e tutte e ${ATTESE} le destinazioni se ne sono accorte: la prova sa fallire.`);
    process.exit(0);
  }
  console.error(`\n⚠️ CONTROPROVA INCOMPLETA: solo ${avvioRosso} destinazioni su ${ATTESE} hanno visto il programma morto.`);
  process.exit(1);
}
if (!CONTROPROVA && conSegnoAvvio !== ATTESE) {
  console.error(`  ✗ le superfici con un segno d'avvio sono ${conSegnoAvvio}, me ne aspettavo ${ATTESE} (sei app + core + Genesi + Deepwork ID)`);
  ko++;
}
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
