/* ⛔ NIENTE DEVE FINIRE FUORI DALLO SCHERMO DI UN TELEFONO.
   È già successo due volte, e tutte e due le volte se n'è accorto un essere
   umano guardando uno screenshot, non una prova:
   - in Sentinella, a 390 px, la barra in basso tagliava «REPORT»: una sezione
     intera dell'app irraggiungibile, senza nessun errore da nessuna parte;
   - nella vetrina, l'alone d'apertura era più largo dello schermo e faceva
     comparire lo scorrimento laterale.
   Il difetto non fa rumore: la pagina si apre, tutto sembra a posto, e quello
   che manca manca in silenzio.

   ⛔ E IL 03/08 È SUCCESSA UNA TERZA VOLTA, CON QUESTO BANCO CHE DICEVA «ok».
   In Campo la pillola «Squadra A · Luca Bianchi» chiedeva 198 px dentro un
   blocco di testo che ne ha 131 e usciva dal suo riquadro, coprendo la colonna
   del badge e della matita. Il banco non l'ha visto, e la ragione NON è la
   larghezza — succedeva anche a 390 e a 360 px, quelle che questo file prova
   da sempre. È la DOMANDA a essere una sola: «esce dallo SCHERMO?». Quella
   pillola nello schermo ci stava benissimo; usciva dal PROPRIO riquadro, e
   `.item` ha `overflow:hidden`, quindi la pagina non scorreva nemmeno di lato.
   Un elemento che dipinge fuori dal proprio riquadro si mangia il posto del
   vicino: è lo stesso difetto silenzioso, un piano più sotto.

   Cosa si pretende, adesso, e sono DUE domande diverse:
   A. su uno schermo da 390 px e da 360 (`--larghezze=` per chiederne altre):
      1. la pagina non scorre di lato (`scrollWidth` non supera la larghezza);
      2. ogni COMANDO visibile — bottone o collegamento — sta dentro lo schermo.
   B. a 390, 360 e 320 px: dentro una VOCE DI LISTA (`.item`, `.sitem`) niente
      dipinge fuori dal proprio riquadro (`scrollWidth` oltre `clientWidth`).

   ⚠️ SI GUARDANO SOLO I COMANDI (domanda A), non tutti gli elementi. Aloni,
   sfumature e decorazioni escono dallo schermo di proposito e vengono
   ritagliate: metterli nel conto riempirebbe il risultato di rumore, e un banco
   rumoroso è un banco che nessuno legge. Il metro è: «una persona riesce a
   toccarlo?».

   ⚠️ E si guarda la POSIZIONE NEL DOCUMENTO, non nel viewport: un comando che
   sta sotto la piega ha comunque un `left`/`right` giusti, mentre chiedere
   `elementFromPoint` risponderebbe `null` e sembrerebbe irraggiungibile.

   ⚠️ LA DOMANDA B È RISTRETTA ALLE VOCI DI LISTA, ED È UNA SCELTA MISURATA, non
   una pigrizia. Guardando TUTTI gli elementi di tutte le superfici a 320/360/390
   il 03/08 venivano fuori 46 casi: core 5, vetrina 8, scudo 8, sentinella 16,
   terra 2, genesi 6, accesso di Genesi 1 — quasi tutti impaginazioni larghe
   (`.hero`, `.wrap`, tabelle) che nessuno stava sistemando. Una regola che
   nasce con 46 violazioni non è una regola, è un elenco che si impara a non
   guardare. Dentro le voci di lista, invece, un `scrollWidth` di troppo vuol
   dire una cosa sola: un pezzo di testo sta coprendo il badge o il comando
   accanto. Ed è lì che il difetto di Campo viveva.

   ⚠️ E C'È UN FONDO DI 4 px, anche quello misurato: le pillole `.badge` hanno
   `letter-spacing`, e l'ultimo carattere si porta dietro la sua spaziatura —
   Scudo dava 6 casi tutti da +2 o +3 px, cioè rumore tipografico, e col fondo
   scende a zero. I difetti veri erano +67 (Campo), +36 e +71 (Sentinella).

   ⚠️ LA DOMANDA B È PRETESA SOLO DOVE OGGI È PULITA (`PRETESE`), sulle altre è
   CONTATA E STAMPATA. Ragione: al 03/08 l'arretrato è tutto in Sentinella (22
   segnalazioni: 7 a 390 px, 7 a 360, 8 a 320 — sono quattro o cinque righe di
   elenco viste a tre larghezze), ed è lavoro di un altro cantiere. Un banco che
   diventa rosso in casa d'altri viene spento, non riparato. L'arretrato è
   dichiarato per essere visto scendere: chi pulisce la sua app si aggiunge a
   `PRETESE`, e da lì in poi non ci torna.

   Uso:  node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823
         node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823 --controprova
         node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823 --solo=campo
         node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823 --larghezze=320
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
const CHIESTE = (process.argv.find((a) => a.startsWith('--larghezze=')) || '').slice(12)
  .split(',').map((x) => +x).filter((x) => x > 0);
const LARGHEZZE = CHIESTE.length ? CHIESTE : [390, 360];
/* la domanda B si fa anche sul telefono più stretto: Campo si usa al fronte,
   coi guanti, e 320 px non è un caso limite ma lo schermo su cui vive */
const LARGHEZZE_RIQUADRO = CHIESTE.length ? CHIESTE : [390, 360, 320];
const FONDO = 4;

/* Le superfici per cui la domanda B è PRETESA.
   ⛔ C'È SOLO `campo`, ed è una scelta, non una dimenticanza: è la sola app che
   qualcuno ha aperto a 320 px, misurato e sistemato (696 elementi guardati
   dentro le voci di lista, zero fuori). Core, vetrina, conti, flotta, scudo e
   terra il 03/08 misuravano zero anche loro, ma sono cantieri di altri e in
   movimento: metterli qui vuol dire far diventare rosso in casa d'altri un
   controllo che nessuno ha chiesto — ed è il modo di farlo spegnere. Chi pulisce
   la sua app ce la aggiunge, e da lì in poi il difetto non ci torna. */
const PRETESE = new Set(['campo']);

/* La controprova sporca una superficie che è a posto: allarga un comando fino a
   farlo uscire. Senza, «0 fuori schermo» può voler dire «non sto guardando». */
const SPORCA = () => {
  const b = [...document.querySelectorAll('button, a[href]')]
    .find((e) => e.getBoundingClientRect().width > 0);
  if (b) { b.style.position = 'relative'; b.style.left = '600px'; b.dataset.controprova = '1'; }
};

/* La controprova della domanda B: si appende a un blocco di testo di una voce
   di lista una parola indivisibile più larga del blocco — cioè esattamente il
   difetto di Campo, che era una pillola `white-space:nowrap` più larga della
   `.info` che la conteneva. Torna 1 se ha davvero trovato dove iniettare: una
   controprova va misurata anche nella sua COPERTURA, non solo nel suo esito. */
const SPORCA_RIQUADRO = () => {
  /* ⛔ IL BERSAGLIO DEVE ESSERE VISIBILE, e la prima versione non lo pretendeva:
     prendeva la prima `.item .info` del DOCUMENTO, che nella maggior parte
     delle sezioni sta in una `.page` con `display:none`. Risultato: «15
     iniezioni, 3 viste», e le 12 mancanti non erano un buco del controllo —
     era l'iniezione che iniettava dove nessuno guarda (la terza delle cinque
     cause per cui una controprova dice «non distingue»). */
  const bersaglio = [...document.querySelectorAll('.item .info, .sitem .info')]
    .find((e) => e.getBoundingClientRect().width > 0);
  if (!bersaglio) return 0;
  const s = document.createElement('span');
  s.dataset.controprova = '1';
  s.style.cssText = 'display:inline-block; white-space:nowrap';
  s.textContent = 'controprova'.repeat(12);
  bersaglio.appendChild(s);
  return 1;
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

/* Domanda B. `overflow-x` diverso da `visible` vuol dire che qualcuno ha
   DICHIARATO di voler ritagliare o far scorrere: non è un difetto, è una
   scelta (la sottoscritta della barra alta è tagliata con i puntini apposta). */
const MISURA_RIQUADRO = (fondo) => {
  const fuori = [];
  let guardati = 0;
  document.querySelectorAll('.item, .sitem').forEach((voce) => {
    voce.querySelectorAll('*').forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
      if (cs.overflowX !== 'visible') return;
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      guardati++;
      const ecc = Math.round(e.scrollWidth - e.clientWidth);
      if (ecc <= fondo) return;
      fuori.push({
        ecc, largo: e.clientWidth,
        classe: (typeof e.className === 'string' ? e.className : '').slice(0, 30) || e.tagName.toLowerCase(),
        testo: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) || '(senza testo)',
      });
    });
  });
  return { fuori, guardati };
};

let ok = 0, ko = 0, koB = 0, arretrato = 0, iniezioniB = 0, elementiB = 0, trovatiB = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  const larghezze = [...new Set([...LARGHEZZE, ...LARGHEZZE_RIQUADRO])].sort((x, y) => y - x);
  for (const larghezza of larghezze) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 844, montaFintoFirebase });
    let male = 0, arretratoQui = 0;
    const visti = new Set();
    for (const s of await sezioniDi(p, nome)) {
      await vaiA(p, nome, s);
      if (CONTROPROVA) {
        await p.evaluate(SPORCA);
        iniezioniB += await p.evaluate(SPORCA_RIQUADRO);
      }
      if (LARGHEZZE.includes(larghezza)) {
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
      if (LARGHEZZE_RIQUADRO.includes(larghezza)) {
        const q = await p.evaluate(MISURA_RIQUADRO, FONDO);
        elementiB += q.guardati;
        trovatiB += q.fuori.length;   /* prima che il de-duplicatore accorpi */
        for (const f of q.fuori) {
          const chiave = `riquadro|${f.classe}|${f.testo}`;
          if (visti.has(chiave)) continue;
          visti.add(chiave);
          const preteso = PRETESE.has(nome);
          if (preteso) { male++; ko++; koB++; } else { arretrato++; arretratoQui++; }
          console.log(`  ${preteso ? 'KO' : '··'}  ${nome} @${larghezza}: «${f.testo}» chiede ${f.largo + f.ecc} px `
            + `dentro ${f.largo} — esce dal suo riquadro di ${f.ecc} px  .${f.classe}`
            + (preteso ? '' : '  (arretrato dichiarato, non preteso)'));
        }
      }
    }
    /* ⚠️ «ok» SOLO SE NON C'È NEMMENO ARRETRATO: la riga finale non deve dire
       «niente fuori dal proprio riquadro» tre righe sotto averne elencati sei.
       Un banco che si contraddice da solo è un banco che si smette di leggere. */
    if (!male && !arretratoQui) { ok++; console.log(`  ok  ${nome} @${larghezza}: niente fuori schermo, niente fuori dal proprio riquadro`); }
    else if (!male) console.log(`  ··  ${nome} @${larghezza}: niente fuori schermo · ${arretratoQui} fuori dal proprio riquadro, nell'arretrato dichiarato`);
    await ctx.close();
  }
}
await b.close();
console.log(`\n${ok} schermate pulite, ${ko} cose fuori posto `
  + `(${ko - koB} fuori dallo schermo, ${koB} fuori dal proprio riquadro) · `
  + `${elementiB} elementi guardati dentro le voci di lista, ${arretrato} nell'arretrato non preteso`);
if (CONTROPROVA) {
  /* `trovatiB` è il conto GREZZO, prima che il de-duplicatore accorpi le
     ripetizioni: `koB` conta una volta sola lo stesso difetto in dieci
     sezioni, e letto da solo farebbe sembrare la controprova più povera di
     quello che è. Il numero che dice se ha guardato è `trovatiB` contro
     `iniezioniB`. */
  console.log(`controprova: ${iniezioniB} iniezioni nelle voci di lista, `
    + `${trovatiB} viste (${koB} dopo l'accorpamento)`);
}
/* nella controprova il successo è il contrario: devono cadere TUTTE E DUE le
   domande. Se l'iniezione nelle voci non ha trovato dove entrare (superficie
   senza `.item .info`), la seconda non si pretende — ma il numero si stampa,
   perché un'iniezione che non inietta è la terza delle cinque cause per cui
   una controprova dice «non distingue». */
const bDaProvare = iniezioniB > 0 && [...PRETESE].some((n) => !SOLO || SOLO === n);
process.exit(CONTROPROVA
  ? ((ko - koB > 0) && (!bDaProvare || koB > 0) ? 0 : 1)
  : (ko ? 1 : 0));
