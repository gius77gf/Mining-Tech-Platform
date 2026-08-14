/* LE PAGINE SEMBRANO LA STESSA FAMIGLIA? — la misura di E8, portata dentro
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node famiglia-strutture.mjs [porta]
     node famiglia-strutture.mjs [porta] --solo=scudo
     node famiglia-strutture.mjs [porta] --controprova   (DEVE fallire)

   ⛔ PERCHÉ ESISTE, E PERCHÉ ADESSO. `docs/E8_LE_PAGINE_AFFIANCATE.md` misura
   che cosa hanno in comune le sei verticali — barra alta 62 px, titolo di
   sezione 19 px, carattere 11,5 px con 2,5 px di spaziatura, in TUTTE — e
   quella misura è la sola prova che la direttiva del fondatore («struttura
   identica al core, pelo per pelo; cambia solo il colore») sia rispettata.
   Ma il documento, alla riga «come si rifà», rimanda a uno script nello
   **scratchpad**: e una difesa che resta nello scratchpad, alla sessione dopo
   **non esiste**. È lo stesso difetto che aveva la prova della verifica
   periodica di Scudo, chiuso il 07/08 portandola in `tests/browser/`.
   Cercato prima di scrivere, col comando: in `tests/browser/` non c'è nessun
   banco con «famiglia» o «affiancate» nel nome, e `genesi-struttura.mjs` fa la
   domanda **per una superficie sola**.

   ⛔ E QUESTO BANCO NON PRETENDE CHE TUTTO SIA UGUALE — sarebbe il contrario di
   quello che E8 ha misurato. Le **etichette della barra in basso** sono scritte
   a tre misure diverse (9 / 8,5 / 8 px) ed è **giusto**: le parole di Scudo e
   Sentinella sono più lunghe e a 9 px non entrano in sei colonne. Quel fronte
   ce l'ha già `barra-etichette.mjs`, che chiede la domanda giusta — «la parola
   sta nella sua colonna?» — invece di pretendere un numero unico.
   Qui si pinza solo ciò che E8 ha misurato **identico**, cioè ciò che nessuno
   ha ragione di cambiare in casa propria.

   ⚠️ IL DENOMINATORE È DICHIARATO: si misurano le superfici che hanno una
   `.top` e una `.sec`, e quelle che non le hanno vengono **elencate come non
   misurate**, non contate a posto. «Non misurato» non è «a posto» — è la riga
   che in questo repository è stata ignorata per mesi in fondo a un riepilogo.

   ⛔ E L'ETICHETTA DI QUESTO BANCO NON DEVE ESSERE PIÙ LARGA DEL SUO NUMERO.
   Risponde a **«le sei verticali sono ancora d'accordo FRA LORO?»**, non a «le
   sei copiano il core»: sono due promesse diverse, e la seconda questo banco
   non la può fare. Misurato l'09/08 aprendo il core: **non ha nessuna `.top` e
   nessuna `.sec`** — la sua barra alta si chiama in un altro modo e il titolo
   di sezione è `.sec-title` (53 volte nella pagina). Cioè le sei condividono un
   **vocabolario di classi che il core non usa**, e prenderlo come riferimento
   qui vorrebbe dire misurare `null`.
   La conseguenza va detta perché è il buco che resta: **se un giorno tutte e
   sei si allontanassero INSIEME dal core, questo banco resterebbe verde.** Il
   confronto col core è un'altra unità, e vuole prima una mappa fra i due
   vocabolari — non un selettore in più qui dentro.
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const LARGHEZZA = 420;

/* Le misure che E8 ha trovato IDENTICHE in tutte e sei. I valori NON sono
   scritti a mano: si prendono dalla prima superficie misurata e si pretende che
   le altre combacino — così il giorno in cui il riferimento cambiasse, il banco
   non accuserebbe cinque app di essere rimaste in famiglia. */
const NOMI_MISURE = ['altezza della barra alta', 'altezza del titolo di sezione',
                     'corpo del titolo di sezione', 'spaziatura del titolo di sezione'];

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x)}` : ''}`); } };

const b = await chromium.launch({ executablePath: CHROMIUM });
/* ⚠️ `SUPERFICI` è un elenco di COPPIE `[nome, via]`, non di oggetti: filtrare
   su `s.nome` dà zero, e uno zero uniforme è il segno che si sta guardando il
   righello invece del soggetto. L'elenco delle verticali resta scritto qui
   perché il core e le pagine del servizio comune non hanno la stessa forma. */
const NOMI_VERTICALI = ['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'];
const VERTICALI = SUPERFICI.filter(([nome]) => NOMI_VERTICALI.includes(nome))
  .map(([nome, via]) => ({ nome, via }));
const misurate = [], saltate = [];

for (const s of VERTICALI) {
  if (SOLO && s.nome !== SOLO) continue;
  /* ⚠️ `apriSuperficie` torna `{ ctx, p, errori }`, non la pagina: prenderla
     per una pagina dà «pg.evaluate is not a function» — un errore onesto, che
     è meglio di un banco che misura `undefined` e stampa zero. */
  const { ctx, p: pg } = await apriSuperficie(b, { ...s, porta: PORTA, larghezza: LARGHEZZA, montaFintoFirebase });
  if (!pg) { saltate.push([s.nome, 'la superficie non si è aperta']); continue; }
  /* ⛔ LA CONTROPROVA CAMBIA LA PAGINA VIVA, NON IL FILE: si rimpicciolisce la
     barra alta di una superficie sola. Se il banco non se ne accorge, sta
     guardando qualcosa che non è la barra.
     ⚠️ E LA PRIMA STESURA NON INIETTAVA NIENTE — la terza delle cinque cause,
     presa dal banco stesso che ha detto «non distingue». Scriveva
     `t.style.height = '48px'`: l'attributo `style` compariva davvero
     (`height: 48px`), e `getComputedStyle` continuava a rispondere **62px**,
     perché una regola del foglio condiviso vince con `min-height`. Un difetto
     rimesso che il browser scarta è indistinguibile da un difetto non rimesso:
     si forza con `setProperty(..., 'important')` e si tocca ANCHE
     `min-height`, se no il minimo regge da solo. */
  if (CONTROPROVA && s.nome === (SOLO || 'scudo'))
    await pg.evaluate(() => {
      const t = document.querySelector('.top');
      if (!t) return;
      t.style.setProperty('height', '48px', 'important');
      t.style.setProperty('min-height', '48px', 'important');
    });
  const m = await pg.evaluate(() => {
    const top = document.querySelector('.top'), sec = document.querySelector('.sec');
    if (!top) return { manca: '.top' };
    if (!sec) return { manca: '.sec' };
    const cs = getComputedStyle(sec);
    return {
      'altezza della barra alta': Math.round(top.getBoundingClientRect().height),
      'altezza del titolo di sezione': Math.round(sec.getBoundingClientRect().height),
      'corpo del titolo di sezione': cs.fontSize,
      'spaziatura del titolo di sezione': cs.letterSpacing,
    };
  });
  await ctx.close();
  if (m.manca) { saltate.push([s.nome, `non ha «${m.manca}»`]); continue; }
  misurate.push([s.nome, m]);
}
await b.close();

if (!misurate.length) {
  console.error('✗ nessuna superficie misurata: il banco non prova niente.');
  process.exit(2);
}

/* il riferimento è la PRIMA misurata, non un numero scritto a mano */
const [nomeRif, rif] = misurate[0];
console.log(`\n  riferimento: «${nomeRif}» — ${NOMI_MISURE.map((n) => `${n} ${rif[n]}`).join(' · ')}`);
for (const [nome, v] of misurate.slice(1))
  for (const misura of NOMI_MISURE)
    dice(v[misura] === rif[misura], `${nome}: ${misura} come «${nomeRif}»`, { atteso: rif[misura], trovato: v[misura] });

if (saltate.length) {
  console.log('\n  ⚠️  NON MISURATE (non vuol dire «a posto»):');
  for (const [n, perche] of saltate) console.log(`      · ${n}: ${perche}`);
}
console.log(`\nRisultato famiglia delle strutture: ${ok} passati, ${ko} falliti`
  + `  ·  ${misurate.length} superfici misurate su ${VERTICALI.length}, ${saltate.length} dichiarate non misurate`
  + `  ·  ${NOMI_MISURE.length} misure per superficie, a ${LARGHEZZA} px`);
console.log('  ⚠️  risponde a «le sei sono d\'accordo FRA LORO?», non a «le sei copiano il core»:'
  + ' il core non ha né `.top` né `.sec` (usa `.sec-title`), quindi se si allontanassero TUTTE INSIEME'
  + ' dal core questo banco resterebbe verde. Il confronto col core è un\'altra unità.');
console.log('  ⚠️  le ETICHETTE della barra in basso NON stanno qui di proposito:'
  + ' sono a tre corpi diversi ed è giusto (le parole di Scudo e Sentinella non entrano a 9 px).'
  + ' Quel fronte lo tiene `barra-etichette.mjs`, che chiede «la parola sta nella sua colonna?».');
if (CONTROPROVA) {
  if (ko > 0) console.log('✔ CONTROPROVA OK: col difetto rimesso il banco fallisce.');
  else { console.error('⛔ CONTROPROVA FALLITA: il banco non distingue.'); process.exit(1); }
  process.exit(0);
}
process.exit(ko ? 1 : 0);
