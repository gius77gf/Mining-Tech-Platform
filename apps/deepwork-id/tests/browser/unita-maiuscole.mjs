/* ⛔ LE UNITÀ DI MISURA NON VANNO IN MAIUSCOLO — CONTROLLATO SUL RENDERIZZATO.
   Non è gusto: «m³» diventa «M³», che si legge come un'altra grandezza (M =
   mega), e «µg/m³» diventa «ΜG/M³» — Chromium trasforma la mu in mu greca
   maiuscola — cioè milligrammi, MILLE VOLTE TANTO, su un documento che il
   cliente consegna all'ente. È già successo davvero.

   Perché serve anche questo, se `run-stile.mjs` ha già la regola 2: quella
   legge il CODICE, e il difetto vero nasce dall'incontro fra una classe con
   `text-transform: uppercase` e un contenuto che quella classe non aveva
   previsto. Il 30/07 è passata inosservata «1.637 M³» in Terra: nessuna riga
   di codice era sbagliata, sbagliato era l'incontro. Solo il renderizzato lo
   vede.

   ⚠️ SI LEGGE LA TRASFORMAZIONE, NON IL TESTO. `innerText` su una scheda
   nascosta ricade su `textContent` e il maiuscolo non si vede: il maiuscolo va
   chiesto a `getComputedStyle`, che risponde comunque.

   Uso:  node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823
         node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823 --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');

/* La misura vive nella pagina. Un elemento è colpevole se la sua
   trasformazione effettiva è maiuscola E il suo testo PROPRIO contiene
   un'unità: qualunque maiuscolo la corrompe, comprese quelle che di loro
   hanno già una maiuscola (MPa → MPA). */
/* le unità che compaiono nell'ecosistema. Non un'espressione generica: una
   lista, perché «t» dentro una parola non è una tonnellata e la lista con i
   confini di parola è l'unico modo di non riempire il risultato di rumore */
/* «h» (l'ora) è entrata il 30/07 insieme a `UNITA_DA_SALVARE` in
   `shared/deepwork-id-client/dw-shell.js`: là c'è scritto perché lei sì e il
   litro no. Sta in fondo per la stessa ragione — «km/h» e «m³/h» vanno
   riconosciute prima, o si segnalerebbe l'ora dentro una velocità. */
/* ⛔ «t» E «mc» NUDE SONO ENTRATE IL 06/08, E L'ELENCO SENZA DI LORO ERA CIECO
   PROPRIO SULL'UNITÀ PIÙ COMUNE IN CAVA. Il banco diceva «nessuna unità in
   maiuscolo» mentre in Conti erano a schermo — e su un DDT stampato — «LORDO
   (T)», «TARA (T)», «NETTO (T)»: la tonnellata diventata un tesla. Misurato
   rimettendo il difetto vero (6 punti) su una copia di `HEAD`: con l'elenco
   vecchio **0 violazioni**, con «t» dentro **2**. E il costo del rumore è
   stato misurato PRIMA di cambiare, non dopo: elenco esteso su tutte e
   **quattordici** le superfici pulite, **0 falsi allarmi**. «mc» è una unità
   vera del core (`${m.mc} mc`) e di Conti (colonna del listino), non
   un'ipotesi. Stanno in fondo con «h» per la stessa ragione d'ordine. */
const UNITA = ['m³', 'm²', 'µg/m³', 'mg/m³', 'mm/s', 'dB(A)', 'dB(L)', 'dB',
  'kg/m³', 'kg/foro', 'kg/m', 'kg', 'km/h', 'km', 'MPa', 'GPa', 'kbar', 'Hz',
  'ms/m', 'ms', 'm/kg', 't/m³', '€/m³', '€/kg', '€/foro', '€/t', '€/m',
  'cm', 'mm', 'gg', 'm³/giorno', 'm³/anno', 'h', 'mc', 't'];

const CERCA = ({ controprova, UNITA }) => {
  const out = [];
  if (controprova) {
    /* ⛔ LA CONTROPROVA SI MISURA ANCHE NELLA COPERTURA, NON SOLO NELL'ESITO.
       Fino al 06/08 sporcava la pagina con **una** unità sola («12 m³») e
       chiedeva «hai visto qualcosa?»: sapere fallire su una delle trentacinque
       non dice niente sulle altre trentaquattro — ed era esattamente il caso,
       perché «t» non era nemmeno in elenco e la controprova diceva ok. Adesso
       inietta **una riga per ogni unità** e pretende che siano riconosciute
       tutte, stampando il conto. */
    const box = document.createElement('div');
    box.id = 'dw-cp-unita';
    box.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#fff';
    /* ⛔ E DAL 07/08 OGNI UNITÀ SI INIETTA IN DUE SCRITTURE, non una: quella
       minuscola e quella con l'INIZIALE MAIUSCOLA. È la forma che il core
       usava davvero — «Mc totali», «Kg/foro» — e su cui il banco era cieco
       perché il confronto guardava le maiuscole. Una controprova che prova
       solo la scrittura che il banco già sapeva leggere conferma quello che
       non è in dubbio: il conto delle iniezioni raddoppia apposta. */
    /* ⚠️ E l'iniziale maiuscola si inietta SOLO dove esiste davvero: per `MPa`,
       `GPa`, `Hz` e i cinque prezzi che cominciano per `€` la maiuscola
       dell'iniziale è l'iniziale stessa, e iniettare due volte la stessa
       scrittura fa credere di aver provato il doppio. La prima stesura le
       contava lo stesso e rispondeva «62/70»: non era il banco a sbagliare,
       era l'elenco delle attese — il controllo, come al solito, prima del
       prodotto. */
    for (const u of UNITA) {
      const alt = u[0].toUpperCase() + u.slice(1);
      for (const scrittura of (alt === u ? [u] : [u, alt])) {
        const s = document.createElement('span');
        s.textContent = ' 12 ' + scrittura;
        s.style.textTransform = 'uppercase';
        s.style.display = 'inline-block';
        s.className = 'controprova-unita';
        s.dataset.cp = u + '|' + (scrittura === u ? 'minuscola' : 'Iniziale');
        box.appendChild(s);
      }
    }
    document.body.appendChild(box);
  }
  document.querySelectorAll('body *').forEach((el) => {
    const proprio = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim()).join(' ');
    if (!proprio) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.textTransform !== 'uppercase') return;
    /* ⛔ IL CONFRONTO IGNORA LE MAIUSCOLE, E FINO AL 07/08 NO. Sembra un
       dettaglio e non lo è: il banco leggeva `textContent`, cioè il testo
       SORGENTE, e cercava «mc» minuscolo. Ma nel core le etichette erano
       scritte «Mc totali», «Kg/foro», «Kg/mc» — con la maiuscola iniziale,
       perché sono la prima parola di un'etichetta — e `indexOf` non le
       trovava. Renderizzate diventavano «MC TOTALI», «KG/FORO», «KG/MC»: il
       difetto era a schermo e il banco diceva «nessuna unità in maiuscolo».
       È la stessa famiglia della «t» nuda del 06/08 — un elenco che sembra
       completo e non copre la forma più comune — con in più il fatto che qui
       a mancare non era una voce, era il CONFRONTO.
       Misurato prima di stringere, come vuole CLAUDE.md: ignorando le
       maiuscole escono 15 casi in più, di cui 11 veri (tutti nel core) e 4
       falsi allarmi — `DB` il database e `H` l'altezza, cioè parole intere che
       per caso si scrivono come un'unità. Quei quattro stanno in `ACCETTATI`
       più sotto, dichiarati uno per uno con la ragione. */
    const basso = proprio.toLowerCase();
    const unita = UNITA.find((u) => {
      const i = basso.indexOf(u.toLowerCase());
      if (i < 0) return false;
      /* deve essere un'unità, non un pezzo di parola: prima di lei uno spazio o
         una cifra, dopo di lei niente che continui la parola */
      const prima = i === 0 ? ' ' : proprio[i - 1];
      const dopo = proprio[i + u.length] || ' ';
      return /[\s\d(/·,]/.test(prima) && !/[a-zA-Zà-ù]/.test(dopo);
    });
    if (!unita) return;
    out.push({ unita, testo: proprio.slice(0, 46), cp: el.dataset.cp || '',
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 44) });
  });
  return out;
};

/* ⛔ LE QUATTRO ECCEZIONI, DICHIARATE UNA PER UNA CON LA RAGIONE — e non è una
   maglia larga, è il prezzo misurato del confronto che ignora le maiuscole.
   Ignorando le maiuscole escono 15 casi in più: 11 veri (tutti nel core, tutti
   corretti in questa stessa unità avvolgendo l'unità in `.u`) e questi 4, che
   sono PAROLE INTERE che per caso si scrivono come un'unità.
   ⚠️ Ho provato e SCARTATO la regola furba «un'unità sta dopo un numero»: la
   forma più comune nel nostro ecosistema è «Volume (m³)», che di numeri davanti
   non ne ha, e quella regola avrebbe reso cieco il banco proprio sul caso per
   cui è nato. Quattro righe scritte a mano costano meno di un controllo che
   guarda dove non serve.
   ⛔ E come in `sonda-vuoto.mjs`, ogni eccezione deve PRESENTARSI ANCORA: se
   una non si presenta più, la riga che la scusa è più vecchia del codice e sta
   coprendo un difetto che non c'è. Il banco lo dice invece di tacere. */
const ACCETTATI = new Map([
  ['core|sl|DB', 'il database, in una scheda di diagnosi. Acronimo, e in maiuscolo ci va: il decibel qui non c\'entra.'],
  ['genesi||Profondità H', '«H» è il simbolo dell\'altezza del fronte, non l\'ora. La sua unità è scritta accanto, in `<u class="uni">(m)</u>`.'],
  ['genesi|sv-lab|Rigidità H/B', 'il rapporto di rigidità: due simboli geometrici, nessuna ora.'],
  ['genesi|sv-lab|Rapporto di rigidità H/B', 'la riga distesa dello stesso rapporto.'],
]);
const scusato = (nome, classe, testo) => {
  for (const [k, ] of ACCETTATI) {
    const [n, c, t] = k.split('|');
    if (n === nome && c === classe && testo.startsWith(t)) return k;
  }
  return null;
};

let ok = 0, ko = 0, superfici = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
const scusatiVisti = new Set();
const visti = new Set();
const riconosciute = new Set();   // solo controprova: quali unità iniettate sono state viste
for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  superfici++;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  let trovate = 0;
  for (const s of await sezioniDi(p, nome)) {
    await vaiA(p, nome, s);
    for (const v of await p.evaluate(CERCA, { controprova: CONTROPROVA, UNITA })) {
      if (v.cp) { riconosciute.add(v.cp); continue; }   // è la nostra iniezione, non il prodotto
      const chiave = `${nome}|${v.classe}|${v.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      const scusa = scusato(nome, v.classe, v.testo);
      if (scusa) { scusatiVisti.add(scusa); continue; }
      trovate++; ko++;
      console.log(`  KO  ${nome}: «${v.testo}» in maiuscolo — dentro c'è «${v.unita}»  .${v.classe}`);
    }
  }
  if (!trovate) { ok++; console.log(`  ok  ${nome}: nessuna unità di misura in maiuscolo`); }
  await ctx.close();
}
await b.close();

if (CONTROPROVA) {
  /* ⛔ IL VERDETTO È LA COPERTURA, NON «HO VISTO QUALCOSA». Un'unità che
     l'elenco contiene ma che il confine di parola non lascia mai passare è un
     buco silenzioso: qui si vede, perché resta fuori dal conto. */
  /* le attese si derivano con LA STESSA REGOLA dell'iniezione, non a mano */
  const attese = UNITA.flatMap((u) => u[0].toUpperCase() + u.slice(1) === u
    ? [`${u}|minuscola`] : [`${u}|minuscola`, `${u}|Iniziale`]);
  const mancanti = attese.filter((k) => !riconosciute.has(k));
  console.log(`\ncontroprova su ${superfici} superfici: ${attese.length - mancanti.length}/${attese.length}`
    + ` scritture riconosciute quando sono in maiuscolo (${UNITA.length} unità, ${attese.length - UNITA.length} con l'iniziale che cambia)`);
  if (mancanti.length) console.log(`  NON riconosciute: ${mancanti.join(', ')}`);
  process.exit(mancanti.length ? 1 : 0);
}

/* le eccezioni che non si presentano più: solo se il giro ha guardato TUTTE le
   superfici, se no `--solo=` le farebbe sparire tutte e l'allarme sarebbe falso */
let orfane = 0;
if (!SOLO) {
  for (const [k, perche] of ACCETTATI) {
    if (scusatiVisti.has(k)) continue;
    orfane++; ko++;
    console.log(`  KO  l'eccezione «${k}» non si presenta più (${perche}) — o il testo è cambiato, e allora questa riga va tolta.`);
  }
}

console.log(`\n${ok} superfici pulite, ${ko} violazioni  ·  ${UNITA.length} unità cercate su ${superfici} superfici`
  + (SOLO ? '' : `  ·  ${scusatiVisti.size} eccezioni presentate su ${ACCETTATI.size} dichiarate`));
process.exit(ko > 0 ? 1 : 0);
