/* ⛔ NIENTE DEVE FINIRE FUORI DALLO SCHERMO DI UN TELEFONO.
   È già successo due volte, e tutte e due le volte se n'è accorto un essere
   umano guardando uno screenshot, non una prova:
   - in Sentinella, a 390 px, la barra in basso tagliava «REPORT»: una sezione
     intera dell'app irraggiungibile, senza nessun errore da nessuna parte;
   - nella vetrina, l'alone d'apertura era più largo dello schermo e faceva
     comparire lo scorrimento laterale.
   Il difetto non fa rumore: la pagina si apre, tutto sembra a posto, e quello
   che manca manca in silenzio.

   Cosa si pretende, su uno schermo da 390 px e su uno da 360:
   1. la pagina non scorre di lato (`scrollWidth` non supera la larghezza);
   2. ogni COMANDO visibile — bottone o collegamento — sta dentro lo schermo.

   ⚠️ SI GUARDANO SOLO I COMANDI, non tutti gli elementi. Aloni, sfumature e
   decorazioni escono dallo schermo di proposito e vengono ritagliate: metterli
   nel conto riempirebbe il risultato di rumore, e un banco rumoroso è un banco
   che nessuno legge. Il metro è: «una persona riesce a toccarlo?».

   ⚠️ E si guarda la POSIZIONE NEL DOCUMENTO, non nel viewport: un comando che
   sta sotto la piega ha comunque un `left`/`right` giusti, mentre chiedere
   `elementFromPoint` risponderebbe `null` e sembrerebbe irraggiungibile.

   Uso:  node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823
         node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823 --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const LARGHEZZE = [390, 360];

/* La controprova sporca una superficie che è a posto: allarga un comando fino a
   farlo uscire. Senza, «0 fuori schermo» può voler dire «non sto guardando». */
const SPORCA = () => {
  const b = [...document.querySelectorAll('button, a[href]')]
    .find((e) => e.getBoundingClientRect().width > 0);
  if (b) { b.style.position = 'relative'; b.style.left = '600px'; b.dataset.controprova = '1'; }
};

const MISURA = (larghezza) => {
  const fuori = [];
  document.querySelectorAll('button, a[href], [role=button]').forEach((e) => {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return;
    /* la posizione nel DOCUMENTO: sommando lo scorrimento si toglie di mezzo la
       piega, che con la raggiungibilità non c'entra niente */
    const sx = r.left + window.scrollX, dx = r.right + window.scrollX;
    if (dx <= larghezza + 0.5 && sx >= -0.5) return;
    fuori.push({
      testo: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 26) || '(senza testo)',
      sx: Math.round(sx), dx: Math.round(dx),
      classe: (typeof e.className === 'string' ? e.className : '').slice(0, 30),
    });
  });
  return {
    fuori,
    scorreDiLato: document.documentElement.scrollWidth > larghezza + 0.5,
    scrollWidth: document.documentElement.scrollWidth,
  };
};

let ok = 0, ko = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    let male = 0;
    const visti = new Set();
    for (const s of await sezioniDi(p, nome)) {
      await vaiA(p, nome, s);
      if (CONTROPROVA) await p.evaluate(SPORCA);
      const r = await p.evaluate(MISURA, larghezza);
      if (r.scorreDiLato && !visti.has('lato')) {
        visti.add('lato'); male++; ko++;
        console.log(`  KO  ${nome} @${larghezza}: la pagina scorre di lato (${r.scrollWidth} px di contenuto)`);
      }
      for (const f of r.fuori) {
        const chiave = `${f.classe}|${f.testo}`;
        if (visti.has(chiave)) continue;
        visti.add(chiave); male++; ko++;
        console.log(`  KO  ${nome} @${larghezza}: «${f.testo}» sta da ${f.sx} a ${f.dx} px — fuori dallo schermo  .${f.classe}`);
      }
    }
    if (!male) { ok++; console.log(`  ok  ${nome} @${larghezza}: niente fuori schermo`); }
    await ctx.close();
  }
}
await b.close();
console.log(`\n${ok} schermate pulite, ${ko} cose fuori dallo schermo`);
/* nella controprova il successo è il contrario */
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
