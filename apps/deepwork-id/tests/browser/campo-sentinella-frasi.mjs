/* LE FRASI DI CAMPO E SENTINELLA CON UN DATO SOLO
   ══════════════════════════════════════════════════════════════════════════
   Uso:
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823 --controprova
     node apps/deepwork-id/tests/browser/campo-sentinella-frasi.mjs 8823 --solo=campo

   ⛔ PERCHÉ NON BASTAVA `uno-solo.mjs`, che questa famiglia la guarda già.
   Quel banco cerca «1 <parola al plurale>» su ogni schermata di ogni
   superficie, e su Campo e Sentinella rispondeva **verde**. Ma il suo limite è
   scritto nella sua intestazione, e va letto: *«guarda quello che la
   dimostrazione mostra. Se un conto non vale mai 1 nei dati d'esempio, il
   difetto c'è e questo banco non lo vede»*. La dimostrazione di Sentinella ha
   sei punti di misura e dodici letture: il ramo del singolare non lo attraversa
   mai nessuno.
   Servendo la stessa dimostrazione **tagliata a un elemento per collezione**,
   sulle stesse identiche schermate sono uscite cinque frasi sbagliate, fra cui
   due sui documenti che ESCONO — il foglio per l'ARPA («misure registrate in
   **1 giorno diversi**») e il riepilogo dei referti («**Restano fuori 1
   volate**»). Cioè: non mancava una regola, mancava il **caso**.

   ⛔ E IL CASO SI COSTRUISCE NEI DATI SERVITI, MAI SUL DISCO: CLAUDE.md lo
   vieta, perché un giro del browser che gira in quel momento misurerebbe il
   difetto iniettato. Il taglio passa da `rotte` di `giro.mjs`, che riscrive la
   risposta HTTP del modulo dati; il file su disco non viene toccato.

   ⛔ LA SECONDA DOMANDA — quella che CLAUDE.md chiede di farsi dopo ogni
   controllo nuovo: *se il difetto stesse un piano più sotto, questo banco lo
   direbbe?* Sotto il plurale del sostantivo c'è l'accordo di tutto il resto
   della frase, ed è lì che i difetti si erano nascosti: il **verbo** («ci sono
   1 attività registrata»), l'**aggettivo** che segue il sostantivo già
   declinato («1 giorno **diversi**»), il **participio** («1 **conformi**»).
   Per questo i rilevatori sono TRE e non uno:
     · D1 — la parola plurale attaccata DOPO l'uno («1 volate»);
     · D2 — il verbo plurale PRIMA dell'uno («ci sono 1», «restano 1»);
     · D3 — l'aggettivo plurale una parola PIÙ IN LÀ («1 giorno diversi»).
   Ognuno dei tre è l'unico che prende almeno un difetto vero, e per due di
   loro si è visto solo dopo averli scritti: D2 è il solo che avrebbe preso «In
   questo periodo ci sono 1 attività registrata» (lì il sostantivo è
   invariabile e il ternario c'era: la sola parola che distingue il singolare
   era il verbo, scritto fisso), e D3 è il solo che prende la frase del foglio
   per l'ARPA — con due rilevatori la controprova cadeva lo stesso, per colpa
   degli altri difetti, e quella riga non la guardava nessuno.

   ⚠️ LA FRAZIONE NON È UN PLURALE SBAGLIATO, e questa riga nasce da un falso
   allarme del primo giro: «Rapportini consegnati da **0/1 squadre**» è giusto
   — è un rapporto, si legge «zero su una». L'uno preceduto da `/` viene quindi
   escluso, come `uno-solo.mjs` esclude già cifra, virgola e punto.

   ⚠️ IL MESE HA BISOGNO DEL SUO OROLOGIO. «Rispetto a aprile» (manca la d
   eufonica) si vede solo quando il mese precedente comincia per a — due mesi
   l'anno su dodici. Il caso si monta fermando l'orologio di
   `andamentoRicettore` a maggio 2026 e spostando indietro di due mesi le
   letture della dimostrazione: tutt'e due nel modulo SERVITO, in una
   trasformazione sola.

   COSA NON GUARDA, dichiarato perché non prometta troppo: le unità di misura
   (`unita-maiuscole.mjs`), i numeri tranquilli sullo zero
   (`campo-numeri-tranquilli.mjs`, `sentinella-numeri-tranquilli.mjs`) e il
   testo tagliato dal clamp. Su quest'ultimo la misura è stata fatta a mano il
   06/08 e il risultato è un negativo: 153 righe con clamp, 27 tagliano
   davvero, 3 tagliano una parola che dichiara una non-misura — e tutt'e tre
   sono la NOTA scritta dall'utente, non una dichiarazione calcolata, che resta
   sempre visibile. */
import { prendiChromium, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';

const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
if (!PORTA) { console.error('serve la porta del server statico'); process.exit(2); }

/* Le parole che, precedute da «1», dicono che la frase non è stata declinata.
   Sostantivi e aggettivi insieme, ma corte di proposito: un elenco lungo è un
   elenco che sbaglia, e un allarme che sbaglia insegna a non guardarlo.
   ⛔ `attività`, `foto`, `serie`, `analisi` sono INVARIABILI e non entrano:
   «1 attività» è giusto. Stanno dichiarate sotto per essere lette. */
const PAROLE = [
  // sostantivi del mestiere
  'fori', 'volate', 'rapportini', 'giorni', 'ore', 'righe', 'voci', 'scadenze',
  'letture', 'turni', 'squadre', 'punti', 'ricettori', 'superamenti', 'reclami',
  'tarature', 'adempimenti', 'misure', 'certificati', 'strumenti', 'minuti',
  'giornate', 'causali', 'persone', 'fermi', 'anomalie', 'documenti', 'operatori',
  // aggettivi e participi che seguono il sostantivo: è il piano di sotto, ed è
  // lì che si erano nascosti «1 giorno diversi» e «1 conformi»
  'conformi', 'diversi', 'diverse', 'registrate', 'registrati', 'coperte',
  'giudicabili', 'previste', 'aperte', 'concluse', 'pianificate',
];
const INVARIABILI = ['attività', 'foto', 'serie', 'analisi', 'specie', 'crisi'];

/* I verbi che, seguiti da «1», non sono stati declinati. */
const VERBI = ['ci sono', 'restano fuori', 'restano', 'mancano', 'risultano', 'cadono'];

/* ⛔ E GLI AGGETTIVI CHE STANNO UN POSTO PIÙ IN LÀ, che è dove si nascondeva il
   difetto peggiore di tutti — quello sul foglio per l'ARPA. Scritto il banco
   con due soli rilevatori, la controprova è caduta lo stesso e sembrava a
   posto: ma «misure registrate in **1 giorno diversi**» non l'aveva vista
   nessuno dei due, perché dopo l'«1» c'è `giorno` (singolare, giusto) e
   l'aggettivo sbagliato viene DOPO di lui. A far cadere il banco erano stati
   gli altri sette difetti — cioè la seconda delle due letture di «non
   distingue» in CLAUDE.md: il codice difeso in profondità, che qui vuol dire
   una controprova verde per il motivo sbagliato. Si è visto solo perché il
   riepilogo ELENCA le frasi trovate e fra quelle `nav-rep` non compariva mai.
   La regola generale: quando il sostantivo è già declinato, il difetto scivola
   sulla parola dopo, e un rilevatore che guarda solo la parola attaccata al
   numero non ci arriva. */
const AGGETTIVI = ['diversi', 'diverse', 'conformi', 'giudicabili', 'coperte',
  'registrate', 'registrati', 'previste', 'aperte', 'concluse', 'pianificate',
  'collegati', 'collegate', 'misurati', 'misurate', 'rimaste', 'precedenti'];

/* ⚠️ `[^\d,./]` — lo slash è escluso perché «0/1 squadre» è una frazione, non
   un plurale sbagliato. Fra il numero e la parola solo spazi veri, mai un a
   capo: due riquadri accostati non sono una frase (lezione di `uno-solo`). */
const D1 = new RegExp('(?:^|[^\\d,./])1[  ]+(' + PAROLE.join('|') + ')\\b', 'gi');
const D2 = new RegExp('\\b(' + VERBI.join('|') + ')[  ]+1(?=[  ][a-zà-ù])', 'gi');
const D3 = new RegExp('(?:^|[^\\d,./])1[  ]+[a-zà-ù]+[  ]+(' + AGGETTIVI.join('|') + ')\\b', 'gi');

const APP = {
  campo: { via: '/apps/campo/index.html', modulo: '**/campo-data.js' },
  sentinella: { via: '/apps/sentinella/index.html', modulo: '**/sentinella-data.js' },
};

/* ── IL TAGLIO: la dimostrazione ridotta a un elemento per collezione ──────
   Il seme è la riga con cui tutt'e due i moduli copiano la dimostrazione in
   memoria. Se un giorno cambiasse, `rotte` se ne accorge da sé: una
   trasformazione che non cambia niente ferma il banco invece di lasciarlo
   girare su dati interi stampando verde. */
const SEME = 'const mem = JSON.parse(JSON.stringify(DEMO));';
const tagliaAUno = (t) => t.replace(SEME, SEME
  + '\n    for (const k of Object.keys(mem)) if (Array.isArray(mem[k])) mem[k] = mem[k].slice(0, 1);');

/* ── L'OROLOGIO: fermo a maggio 2026, con le letture spostate indietro ──── */
const OROLOGIO = 'const oggi = opts.oggi ? new Date(opts.oggi) : new Date();';
const aMaggio = (t) => {
  if (!t.includes(OROLOGIO)) { console.error('✗ orologio di andamentoRicettore non trovato'); process.exit(2); }
  return t.replace(OROLOGIO, 'const oggi = new Date("2026-05-20T09:00:00");')
    .replace('export async function sentinellaData() {',
      'for (const m of DEMO.monitoraggi || []) for (const l of (m.letture || [])) '
      + 'l.data = String(l.data).replace("2026-06", "2026-04").replace("2026-07", "2026-05");\n'
      + 'export async function sentinellaData() {');
};

/* ── LA CONTROPROVA: i difetti veri rimessi nella copia SERVITA ───────────
   Sono le otto frasi trovate il 06/08, nella forma esatta che avevano prima
   della correzione. Non sono difetti inventati: se una di queste non facesse
   più cadere il banco, vorrebbe dire che il banco ha smesso di guardare lì. */
const DIFETTI = {
  campo: [
    ['${conta(av.pianificate, "pianificata", "pianificate")}', '${av.pianificate} pianificate'],
    ['In questo periodo ${attTot === 1 ? "c\'è" : "ci sono"} <b>${attTot}</b>',
     'In questo periodo ci sono <b>${attTot}</b>'],
  ],
  sentinella: [
    ['${conf.conformi} ${plurale(conf.conformi, "conforme", "conformi")} ·', '${conf.conformi} conformi ·'],
    ['su ${conf.totale} ${plurale(conf.totale, "punto", "punti")} in ascolto', 'su ${conf.totale} punti in ascolto'],
    ['<b>${conf.conformi}</b> ${plurale(conf.conformi, "conforme", "conformi")} ·', '<b>${conf.conformi}</b> conformi ·'],
    ['${plurale(R.nMancanti, "Resta", "Restano")} fuori <b>${R.nMancanti}</b> ${plurale(R.nMancanti, "volata", "volate")}',
     'Restano fuori <b>${R.nMancanti}</b> volate'],
    ['misure registrate in ${gg(C.nGiorniMisurati)}${C.nGiorniMisurati === 1 ? "" : " diversi"}',
     'misure registrate in ${gg(C.nGiorniMisurati)} diversi'],
    ['Rispetto ${esc(aMese(MESI_IT[pre.mese - 1]))}', 'Rispetto a ${esc(MESI_IT[pre.mese - 1])}'],
  ],
};

let nIniezioni = 0, iniezioniMancate = 0;
const inietta = (app) => (testo) => {
  let t = testo;
  for (const [da, a] of DIFETTI[app]) {
    const n = t.split(da).length - 1;
    /* ⚠️ UN `replace` CHE NON TROVA NIENTE NON FALLISCE: si conta e si dice. */
    if (n !== 1) { console.log(`  ⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 60)}…»`); iniezioniMancate++; continue; }
    t = t.replace(da, a); nIniezioni++;
  }
  return t;
};

let ok = 0, ko = 0, schermate = 0, caratteri = 0;
const trovate = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 260)}` : ''}`); }
};

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

/* Legge ogni sezione di una superficie e raccoglie le frasi non declinate. */
async function guarda(app, { modulo, caso, etichetta }) {
  const { ctx, p, errori } = await apriSuperficie(b, {
    nome: app, via: APP[app].via, porta: PORTA,
    rotte: [[APP[app].modulo, modulo]],
    trasforma: CONTROPROVA ? inietta(app) : null,
  });
  const sezioni = await sezioniDi(p, app);
  for (const s of sezioni) {
    await vaiA(p, app, s);
    /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
       fotografa la stessa schermata a ogni giro e risponde «tutto a posto». */
    const t = await p.evaluate(() => {
      const a = [...document.querySelectorAll('.page')].find((x) => getComputedStyle(x).display !== 'none');
      return a ? a.innerText : null;
    });
    if (t === null) { dice(false, `${app}/${etichetta}: nessuna schermata aperta in «${s}»`); continue; }
    schermate++; caratteri += t.length;
    for (const [re, quale] of [[D1, 'D1'], [D2, 'D2'], [D3, 'D3']]) {
      for (const m of t.matchAll(re)) {
        trovate.push(`[${quale} ${app}/${caso}/${s}] …${t.slice(Math.max(0, m.index - 60), m.index + 80).replace(/\n/g, ' · ')}…`);
      }
    }
  }
  dice(errori.length === 0, `${app}/${etichetta}: la pagina non solleva errori`, errori.slice(0, 2));
  await ctx.close();
}

for (const app of Object.keys(APP)) {
  if (SOLO && SOLO !== app) continue;
  await guarda(app, { modulo: tagliaAUno, caso: 'uno', etichetta: 'un dato solo' });
}
/* Il mese col nome che comincia per vocale: solo Sentinella lo scrive. */
if (!SOLO || SOLO === 'sentinella') {
  await guarda('sentinella', { modulo: (t) => aMaggio(tagliaAUno(t)), caso: 'maggio', etichetta: 'orologio a maggio' });
  /* ⚠️ Questa è l'unica frase che i due rilevatori non sanno vedere: non c'è
     nessun «1» in mezzo. Si chiede al testo reso, non al codice. */
  const { ctx, p } = await apriSuperficie(b, {
    nome: 'sentinella', via: APP.sentinella.via, porta: PORTA,
    rotte: [[APP.sentinella.modulo, aMaggio]],
    trasforma: CONTROPROVA ? inietta('sentinella') : null,
  });
  await vaiA(p, 'sentinella', 'nav-prog');
  const t = await p.evaluate(() => {
    const a = [...document.querySelectorAll('.page')].find((x) => getComputedStyle(x).display !== 'none');
    return a ? a.innerText : '';
  });
  schermate++; caratteri += t.length;
  const conf = t.includes('Rispetto a');
  dice(conf && !/Rispetto a aprile|Rispetto a agosto/i.test(t),
    'il confronto fra i mesi mette la d eufonica («rispetto ad aprile»)',
    conf ? t.slice(t.indexOf('Rispetto a'), t.indexOf('Rispetto a') + 60) : 'il verdetto del confronto non è comparso');
  await ctx.close();
}

for (const f of trovate) console.log(`      ${f}`);
dice(trovate.length === 0, `nessuna frase lasciata al plurale con un dato solo (${trovate.length} trovate)`, trovate[0]);

/* ⛔ IL CONTROLLO SUL RIGHELLO, non sul risultato: quante schermate ha letto
   davvero, e nessuna parola invariabile finita fra quelle cercate. */
dice(schermate >= (SOLO ? 5 : 12), `abbastanza schermate lette (${schermate}, ${caratteri} caratteri)`, schermate);
const doppie = INVARIABILI.filter((w) => PAROLE.includes(w));
dice(doppie.length === 0, 'nessuna parola invariabile è finita fra quelle cercate (accuserebbe una frase giusta)', doppie);

if (CONTROPROVA) {
  const attese = (SOLO ? DIFETTI[SOLO].length : DIFETTI.campo.length + DIFETTI.sentinella.length);
  console.log(`\n  ${nIniezioni} iniezioni riuscite (${iniezioniMancate} mancate) su ${attese} difetti dichiarati`);
  if (iniezioniMancate) { console.error('✗ un difetto non è stato rimesso: il banco non è stato messo alla prova'); process.exit(1); }
  console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate, ${caratteri} caratteri`);
  /* Nella controprova il verde è il fallimento: i difetti sono dentro. */
  if (ko === 0) { console.error('✗ CONTROPROVA: coi difetti rimessi il banco NON è caduto'); process.exit(1); }
  console.log('✔ CONTROPROVA: coi difetti rimessi il banco cade, come deve.');
  process.exit(0);
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate, ${caratteri} caratteri`
  + `  ·  ${PAROLE.length} parole, ${VERBI.length} verbi e ${AGGETTIVI.length} aggettivi cercati, ${INVARIABILI.length} invariabili escluse`);
process.exit(ko ? 1 : 0);
