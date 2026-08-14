/* ⛔ LA STRISCIA DI UN RIQUADRO DEVE DIRE IL SUO STATO, NON LA SUA DECORAZIONE.
   Un riquadro «recap» che riporta una proiezione FUORI PIANO è marcato `err` dal
   programma, ma il 30/07 in Terra usciva con la striscia VERDE: `.note.recap`
   era scritta due righe più sotto di `.note.err`, stessa specificità, e vinceva
   l'ultima. Il colore diceva l'opposto dello stato — il modo peggiore di
   sbagliare, perché sembra funzionare.

   Perché il banco vive nel browser e non in `run-stile.mjs`: qui non c'è nessuna
   riga di codice sbagliata da cercare. Il difetto nasce dall'INCONTRO fra due
   regole giuste, e l'incontro lo sa solo il motore che le applica. La stessa
   ragione di `unita-maiuscole.mjs`.

   Come misura: monta sulla pagina vera — con i fogli veri, nell'ordine vero — le
   combinazioni che il programma genera davvero, e chiede al motore che colore ha
   la striscia. Non legge il CSS: legge il risultato.

   Uso:  node apps/deepwork-id/tests/browser/note-stato.mjs 8823
         node apps/deepwork-id/tests/browser/note-stato.mjs 8823 --controprova
*/
import { prendiChromium, CHROMIUM, SUPERFICI, apriSuperficie } from './giro.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2] || '8823';
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');

/* le sei app con i riquadri informativi (il core ha i suoi `.info-box`, la
   vetrina non ne ha) */
const APP = SUPERFICI.filter(([n]) => ['campo', 'conti', 'flotta', 'scudo', 'sentinella', 'terra'].includes(n));

/* le combinazioni che il programma genera davvero: decorazione + stato.
   `recap err` è quella che è uscita verde, `eco avviso` è la gemella in
   Sentinella, `esito err` quella che tre app si erano scritta a mano. */
const COMBINAZIONI = [
  ['note recap err', '--danger'],
  ['note recap avviso', '--warn'],
  ['note esito err', '--danger'],
  ['note esito avviso', '--warn'],
  ['note eco avviso', '--warn'],
  ['note norma err', '--danger'],
  ['note err', '--danger'],
  ['note avviso', '--warn'],
];

/* La controprova rimette il difetto con le sue stesse parole: la decorazione
   torna a dipingere la proprietà invece della variabile. Se il banco continua a
   passare, non sta guardando dove crede. Agisce sulle decorazioni DELLE APP (è
   lì che il difetto viveva): `.note.esito`, che sta in `shared`, non passa da
   qui perché la trasformazione tocca solo il corpo della pagina. */
const rimettiIlDifetto = (corpo) => corpo
  .replace(/\.note\.(recap|esito|eco|norma)\{--note-bar:/g, '.note.$1{border-left-color:')
  .replace(/(\.note\.eco\{[^}]*?)--note-bar:/g, '$1border-left-color:');

const MISURA = (combinazioni) => {
  const out = [];
  const risolvi = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  for (const [classi, variabile] of combinazioni) {
    const d = document.createElement('div');
    d.className = classi;
    d.textContent = 'prova';
    document.body.appendChild(d);
    const cs = getComputedStyle(d);
    /* il colore atteso va risolto DALLA PAGINA: --danger può cambiare per app,
       e un valore scritto a mano qui misurerebbe la mia idea, non la sua */
    const sonda = document.createElement('div');
    sonda.style.color = `var(${variabile})`;
    document.body.appendChild(sonda);
    out.push({ classi, avuto: cs.borderLeftColor, atteso: getComputedStyle(sonda).color, variabile });
    sonda.remove(); d.remove();
  }
  return out;
};

let ok = 0, ko = 0;
const b = await chromium.launch({ executablePath: CHROMIUM });
for (const [nome, via] of APP) {
  if (SOLO && SOLO !== nome) continue;
  const { ctx, p } = await apriSuperficie(b, {
    nome, via, porta: PORTA, trasforma: CONTROPROVA ? rimettiIlDifetto : null,
  });
  let male = 0;
  for (const m of await p.evaluate(MISURA, COMBINAZIONI)) {
    if (m.avuto === m.atteso) { ok++; continue; }
    male++; ko++;
    console.log(`  KO  ${nome}: «${m.classi}» ha la striscia ${m.avuto}, doveva avere var(${m.variabile}) = ${m.atteso}`);
  }
  if (!male) console.log(`  ok  ${nome}: tutte e ${COMBINAZIONI.length} le combinazioni mostrano il proprio stato`);
  await ctx.close();
}
await b.close();
console.log(`\n${ok} combinazioni giuste, ${ko} che dicono un colore sbagliato`);
/* nella controprova il successo è il contrario */
process.exit(CONTROPROVA ? (ko ? 0 : 1) : (ko ? 1 : 0));
