/* QUANDO SI APRE UNA FINESTRA DI CONFERMA, QUELLO CHE C'È DENTRO CI STA?
   ══════════════════════════════════════════════════════════════════════
   Perché esiste: il 01/08, scrivendo l'abbinamento dei movimenti bancari
   di Conti, uno **scatto** ha mostrato che nella finestra di conferma la
   causale del bonifico chiedeva **491 px dentro 352** — 139 tagliati via,
   e proprio sul testo che serve a decidere se quell'abbinamento è giusto.

   ⛔ E ERA PASSATA SOTTO UN BANCO VERDE. `fuori-schermo.mjs` guarda i
   COMANDI che escono dallo schermo e lo scorrimento laterale della
   PAGINA: una modale chiusa è larga zero e viene saltata, e un testo che
   trabocca dentro il suo riquadro non muove né l'una né l'altra cosa.
   È il «controllo che non guarda dove crede», nella sua forma più
   comune — il banco funziona benissimo su quello che vede.

   La domanda qui è una sola, ed è quella che il browser sa rispondere da
   solo: `scrollWidth > clientWidth`. Non si calcola niente — calcolare
   una cosa che il browser sa dire è il difetto che ha fatto riscrivere
   cinque volte il banco della barra.

   ⚠️ **LA COPERTURA È DICHIARATA, NON SOTTINTESA.** Le modali si aprono
   con un gesto generico — il bottone «Rimuovi» di una riga, che apre la
   conferma con dentro il nome vero della cosa — e quel gesto è stato
   MISURATO prima di scrivere il banco:

       flotta      162 bottoni → 6 modali aperte
       scudo       486 bottoni → 6
       sentinella  132 bottoni → 6
       terra        72 bottoni → 6
       campo         0 bottoni → 0    ← markup diverso
       conti         0 bottoni → 0    ← markup diverso

   Quindi questo banco copre **quattro app su sei**, e lo stampa. Campo e
   Conti non hanno bottoni con quel titolo: le loro modali si aprono in
   altri modi, e trovarli è un lavoro app per app. Dire «nessuna modale
   fuori posto» senza dire su quante app si è guardato sarebbe la stessa
   bugia dello «zero violazioni» ottenuto su zero soggetti.

   Uso:
     node apps/deepwork-id/tests/browser/modali.mjs 8823
     node apps/deepwork-id/tests/browser/modali.mjs 8823 --solo=conti
     node apps/deepwork-id/tests/browser/modali.mjs 8823 --controprova   */
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] && /^\d+$/.test(process.argv[2]) ? process.argv[2] : '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const LARGHEZZA = 390;

/* Le app che il gesto generico raggiunge, misurate. Chi non è qui NON è
   «a posto»: è NON GUARDATO, ed è la differenza che questo elenco esiste
   per tenere visibile. */
const RAGGIUNTE = ['flotta', 'scudo', 'sentinella', 'terra'];

const APRI = async () => {
  const t = document.querySelector('button[title^="Rimuovi"], button[aria-label^="Rimuovi"], [title^="Rimuovi"]');
  if (!t) return false;
  t.click();
  await new Promise((r) => setTimeout(r, 320));
  const ov = document.querySelector('.modal-ov');
  return !!(ov && getComputedStyle(ov).display !== 'none' && ov.getBoundingClientRect().width > 0);
};

const CHIUDI = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

/* La controprova mette dentro la modale una parola lunghissima che non si
   può spezzare: è il caso vero (un IBAN, una causale senza spazi) e deve
   traboccare. Se il banco non la vede, non sta guardando dove crede. */
const SPORCA = () => {
  const b = document.querySelector('.modal-body');
  if (!b) return false;
  const p = document.createElement('div');
  p.textContent = 'CAUSALE' + 'X'.repeat(140);
  p.style.whiteSpace = 'nowrap';
  p.dataset.controprova = '1';
  b.appendChild(p);
  return true;
};

const MISURA = () => {
  const ov = document.querySelector('.modal-ov');
  if (!ov) return { fuori: [], guardati: 0 };
  const fuori = [];
  let guardati = 0;
  ov.querySelectorAll('*').forEach((e) => {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    guardati++;
    /* la domanda che il browser sa rispondere: il contenuto sta nel suo
       riquadro? Si tollera un pixel, che è arrotondamento. */
    if (e.scrollWidth <= e.clientWidth + 1) return;
    /* un elemento che scorre di proposito non è un difetto */
    const ox = getComputedStyle(e).overflowX;
    if (ox === 'auto' || ox === 'scroll') return;
    fuori.push({
      largo: Math.round(e.scrollWidth), dentro: Math.round(e.clientWidth),
      classe: (typeof e.className === 'string' ? e.className : '').slice(0, 24) || e.tagName.toLowerCase(),
      testo: (e.textContent || '').trim().slice(0, 40),
    });
  });
  return { fuori, guardati };
};

let ok = 0, ko = 0, aperte = 0, elementi = 0;
const saltate = [];
const b = await chromium.launch({ executablePath: CHROMIUM });

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  if (!RAGGIUNTE.includes(nome)) { if (!SOLO) saltate.push(nome); continue; }
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza: LARGHEZZA, altezza: 844, montaFintoFirebase });
  let male = 0, apertaQui = 0;
  const visti = new Set();
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    if (!(await p.evaluate(APRI))) continue;
    apertaQui++; aperte++;
    if (CONTROPROVA) await p.evaluate(SPORCA);
    const r = await p.evaluate(MISURA);
    elementi += r.guardati;
    for (const f of r.fuori) {
      const chiave = `${f.classe}|${f.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave); male++; ko++;
      console.log(`  KO  ${nome}: «${f.testo}» chiede ${f.largo} px in ${f.dentro} — ${f.largo - f.dentro} tagliati  .${f.classe}`);
    }
    await p.evaluate(CHIUDI);
    await p.waitForTimeout(180);
  }
  if (apertaQui === 0) {
    console.log(`  ⚠️  ${nome}: nessuna modale aperta — il banco NON ha guardato questa app`);
  } else if (!male) { ok++; console.log(`  ok  ${nome}: ${apertaQui} modali, il contenuto ci sta dentro`); }
  await ctx.close();
}
await b.close();

console.log(`\n${ok} app pulite, ${ko} cose tagliate  ·  ${aperte} modali aperte, ${elementi} elementi misurati`);
if (saltate.length) {
  console.log(`⚠️ NON GUARDATE (il gesto generico non le raggiunge): ${saltate.join(', ')}.`);
  console.log('   Non vuol dire «a posto»: vuol dire che le loro modali si aprono in altri modi.');
}
/* nella controprova il successo è il contrario: se non ha visto niente, non sa fallire */
if (CONTROPROVA) {
  console.log(ko ? '  ✓ la controprova è stata vista: il banco sa fallire'
                 : '  ✗ IL BANCO NON SA FALLIRE: ho messo una riga che trabocca e non se n\'è accorto');
  process.exit(ko ? 0 : 1);
}
process.exit(ko ? 1 : 0);
