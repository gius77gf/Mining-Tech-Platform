/* ⛔ IL TOUR PORTA DA QUALCHE PARTE? — il controllo che rende il tour una
   promessa verificabile invece che un bottone.

   Il fondatore (25/08): «va reso operativo il tour, questo significa avere un
   link che colleghi questa pagina alle varie app».

   Un collegamento rotto in una vetrina non fallisce: la pagina si apre, il
   bottone si preme, e chi lo preme trova un 404. Nessun errore da leggere, e
   se ne accorge il cliente. Qui si chiede l'unica cosa che conta: OGNI
   indirizzo del tour corrisponde a un file che esiste nel repository?

   Cinque domande, e ognuna sa fallire (`--controprova` le rompe tutte):
   1. ogni collegamento verso `/apps/…` o `/` punta a un file VERO;
   2. tutte e nove le app hanno il loro collegamento nella pagina;
   3. i tre bottoni «Prova il tour» portano a un'app, non a un'ancora morta;
   4. i collegamenti che escono dal sito si aprono in una scheda nuova con
      `rel="noopener"` — se no la pagina aperta puo' riscrivere questa;
   5. non restano `href="#"` sui comandi (l'unico ammesso e' il marchio nella
      barra, che riporta in cima, ed e' dichiarato per nome).

   Uso:  node tour-vivo.mjs <pagina.html> [--controprova]
*/
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const PAGINA = process.argv[2];
const CONTROPROVA = process.argv.includes('--controprova');
const RADICE = '/home/user/Mining-Tech-Platform';

/* ⛔ L'unico `href="#"` ammesso, DICHIARATO PER NOME. Un'eccezione contata e'
   un'eccezione che qualcuno puo' riaprire; una tollerata in silenzio no. */
const ANCORE_AMMESSE = ['segno'];

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${x}` : ''}`); }
};

let html = readFileSync(PAGINA, 'utf8');

if (CONTROPROVA) {
  /* I difetti VERI di questa famiglia: il percorso che sembra giusto e non lo
     e' (Genesi non e' `/apps/genesi/`, la sua pagina si chiama `genesi.html`),
     il bottone lasciato a `#` da una bozza, e la scheda nuova senza
     `noopener`. Non caricature: sono i tre modi in cui un tour si rompe. */
  const DIFETTI = [
    ['/apps/genesi/genesi.html', '/apps/genesi/'],
    ['<a class="bot pri" href="/" target="_blank" rel="noopener">Prova il tour</a>',
     '<a class="bot pri" href="#">Prova il tour</a>'],
    [' target="_blank" rel="noopener">Terra', ' target="_blank">Terra'],
  ];
  let messi = 0;
  for (const [a, b] of DIFETTI) if (html.includes(a)) { html = html.split(a).join(b); messi++; }
  console.log(`⚠️  CONTROPROVA: qui sotto il rosso e' quello VOLUTO — ${messi}/${DIFETTI.length} difetti rimessi`);
  if (messi < DIFETTI.length) {
    console.log(`  KO  un'iniezione non ha trovato il suo pezzo: guarderei un prodotto sano`);
    ko++;
  }
}

/* tutti i collegamenti della pagina, con i loro attributi */
const ancore = [...html.matchAll(/<a\s([^>]*)>/g)].map(m => m[1]);
const attr = (a, n) => (a.match(new RegExp(`${n}="([^"]*)"`)) || [])[1] || '';
const interni = ancore
  .map(a => ({ href: attr(a, 'href'), target: attr(a, 'target'), rel: attr(a, 'rel'), cls: attr(a, 'class') }))
  .filter(x => x.href.startsWith('/'));

dice(ancore.length > 0, `la pagina contiene collegamenti (${ancore.length})`);
dice(interni.length > 0, `collegamenti verso il sito: ${interni.length}`);
if (!interni.length) { console.log('\nnon posso giudicare: mi fermo.'); process.exit(2); }

// 1. ogni indirizzo corrisponde a un file vero
function risolve(href) {
  const p = join(RADICE, href.replace(/^\//, ''));
  if (existsSync(p) && statSync(p).isDirectory()) return existsSync(join(p, 'index.html'));
  return existsSync(p);
}
const rotti = [...new Set(interni.map(x => x.href))].filter(h => !risolve(h));
dice(rotti.length === 0,
  `tutti e ${new Set(interni.map(x => x.href)).size} gli indirizzi del tour puntano a un file che esiste`,
  rotti.length ? rotti.join(', ') : undefined);

// 2. tutte le app sono raggiungibili
const ATTESE = ['/', '/apps/deepwork-id/', '/apps/genesi/genesi.html', '/apps/terra/',
                '/apps/campo/', '/apps/flotta/', '/apps/scudo/', '/apps/conti/', '/apps/sentinella/'];
const presenti = new Set(interni.map(x => x.href));
const assenti = ATTESE.filter(v => !presenti.has(v));
dice(assenti.length === 0,
  `tutte e ${ATTESE.length} le app hanno il loro collegamento nella pagina`,
  assenti.length ? `mancano: ${assenti.join(', ')}` : undefined);

// 3. i bottoni del tour portano a un'app
const tour = ancore.filter(a => /Prova il tour/.test(html.slice(html.indexOf(`<a ${a}>`), html.indexOf(`<a ${a}>`) + 200)));
const bottoni = [...html.matchAll(/<a\s([^>]*)>Prova il tour<\/a>/g)].map(m => m[1]);
const morti = bottoni.filter(a => !attr(a, 'href').startsWith('/'));
dice(bottoni.length >= 2 && morti.length === 0,
  `i ${bottoni.length} bottoni «Prova il tour» portano a un'app`,
  morti.length ? morti.map(a => attr(a, 'href') || '(senza href)').join(', ') : undefined);

// 4. scheda nuova e noopener
const senzaGuardia = interni.filter(x => x.target === '_blank' && !/noopener/.test(x.rel));
dice(senzaGuardia.length === 0,
  `ogni collegamento che apre una scheda nuova porta rel="noopener" (${interni.filter(x => x.target === '_blank').length} collegamenti)`,
  senzaGuardia.length ? senzaGuardia.map(x => x.href).join(', ') : undefined);

// 5. nessun comando lasciato a `#`
const vuoti = ancore
  .map(a => ({ href: attr(a, 'href'), cls: attr(a, 'class') }))
  .filter(x => x.href === '#' && !ANCORE_AMMESSE.some(c => x.cls.split(/\s+/).includes(c)));
dice(vuoti.length === 0,
  `nessun comando lasciato a href="#" (ammesso solo: ${ANCORE_AMMESSE.join(', ')})`,
  vuoti.length ? vuoti.map(x => `class="${x.cls}"`).join(', ') : undefined);

console.log(`\nRisultato tour vivo: ${ok} passati, ${ko} falliti  ·  ${interni.length} collegamenti interni, ${new Set(interni.map(x => x.href)).size} destinazioni distinte`);
if (CONTROPROVA) {
  console.log(ko > 0 ? '✔ CONTROPROVA OK: col tour rotto, il controllo cade.'
                     : '✗ CONTROPROVA FALLITA: ho rotto il tour e nessuno se n\'e\' accorto.');
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);
