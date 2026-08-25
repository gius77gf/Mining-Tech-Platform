/* ⛔ IL MARCHIO NON SI TOCCA — E ADESSO E' UN CONTROLLO, NON UNA BUONA
   INTENZIONE.

   Regola fondamentale del fondatore, ripetuta piu' volte e alla fine dettata
   come dogma (24/08): «il logo dev'essere sempre e solo quello originale, non
   ci devono essere variazioni, deve diventare un dogma invariabile».

   La regola stava scritta in CLAUDE.md dal 23/08 ed era gia' stata violata —
   non in malafede, ma per SEMPLIFICAZIONE: tre direzioni grafiche in un
   pomeriggio, ognuna con il marchio «adattato» a quella misura. Una regola
   scritta e' affidata alla memoria di chi legge; questo file no.

   Quattro domande, e ognuna sa fallire (`--controprova` le rimette tutte):
   1. il disegno del marchio nella pagina e' IDENTICO a quello canonico di
      `index.html` (il CORE), elemento per elemento, attributo per attributo —
      confrontato dopo aver tolto SOLO `width` e `height`, che sono la misura
      e non il disegno;
   2. tutte le copie nella pagina sono identiche FRA LORO (due misure diverse
      dello stesso marchio vanno bene; due disegni diversi no);
   3. il rapporto fra `width` e `height` e' quello del `viewBox` — se a una
      certa misura non si legge si cambia la MISURA, non le proporzioni;
   4. la parola «Deepwork» ha una veste sola: ogni volta che compare come
      marchio testuale porta `class="parola"` (regola ferrea del 24/08 — prima
      la barra e il piede la scrivevano color panna e solo il titolo era ambra).

   Uso:  node marchio-intatto.mjs <pagina.html> [--controprova]
*/
import { readFileSync } from 'fs';

const PAGINA = process.argv[2];
const CONTROPROVA = process.argv.includes('--controprova');
const CANONE = '/home/user/Mining-Tech-Platform/index.html';

let ok = 0, ko = 0;
const dice = (c, t, extra) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${extra !== undefined ? `\n        -> ${extra}` : ''}`); }
};

/* Tutti i marchi di un testo. Si prende il tag per intero: il confronto e'
   sulla stringa, non su una lettura «intelligente» che potrebbe perdere pezzi. */
function marchi(testo) {
  return [...testo.matchAll(/<svg class="marchio"[\s\S]*?<\/svg>/g)].map(m => m[0]);
}
/* ⛔ IL CANONE NON PORTA `class="marchio"`: nel core il marchio e' un <svg>
   nudo, riconoscibile dal suo viewBox. Cercare la classe anche li' dava ZERO
   copie canoniche — e il file usciva 2 dicendo «non posso giudicare», che e'
   la forma onesta ma non protegge nulla. */
function marchiCanone(testo) {
  return [...testo.matchAll(/<svg[^>]*viewBox="0 0 120 122"[\s\S]*?<\/svg>/g)].map(m => m[0]);
}
/* Il disegno, senza la misura: `width` e `height` sono l'unica cosa che
   `marchio(px)` ha il permesso di cambiare. Gli spazi si normalizzano perche'
   un a capo in piu' non e' una variazione del marchio. */
const disegno = (svg) => svg
  .replace(/\s(width|height|class|aria-hidden|xmlns)="[^"]*"/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const misure = (svg) => {
  const w = +(svg.match(/\swidth="([\d.]+)"/) || [])[1];
  const h = +(svg.match(/\sheight="([\d.]+)"/) || [])[1];
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '';
  const [, , vw, vh] = vb.split(/\s+/).map(Number);
  return { w, h, vw, vh };
};

let sorgente = readFileSync(PAGINA, 'utf8');
const canone = marchiCanone(readFileSync(CANONE, 'utf8'));

if (CONTROPROVA) {
  /* I difetti VERI di questa famiglia, non caricature: sono esattamente quelli
     che sono stati commessi il 23/08 — il tratto ingrossato «perche' a quella
     misura non si vede», un pezzo del fondo tolto «perche' e' un dettaglio»,
     e le proporzioni forzate. Piu' la parola scritta di un altro colore. */
  const DIFETTI = [
    ['stroke-width="2.2"', 'stroke-width="4"'],
    ['<polygon points="60,72 16,17 104,17" fill="#14100a"/> ', ''],
    ['width="110" height="112"', 'width="110" height="90"'],
    ['<b class="parola">Deepwork</b>', '<b>Deepwork</b>'],
  ];
  let messi = 0;
  for (const [a, b] of DIFETTI) {
    if (sorgente.includes(a)) { sorgente = sorgente.split(a).join(b); messi++; }
  }
  console.log(`⚠️  CONTROPROVA: qui sotto il rosso e' quello VOLUTO — ${messi}/${DIFETTI.length} difetti rimessi`);
  if (messi < DIFETTI.length) {
    console.log(`  KO  un'iniezione non ha trovato il suo pezzo: la controprova guarderebbe`);
    console.log(`      un prodotto sano e direbbe «so fallire» avendone rimessi ${messi} invece di ${DIFETTI.length}`);
    ko++;
  }
}

const trovati = marchi(sorgente);

/* prima di giudicare: ho guardato qualcosa? Un controllo su zero soggetti
   stampa lo stesso il suo verde. */
dice(canone.length > 0, `il marchio canonico si legge da index.html — il CORE (${canone.length} copie)`);
dice(trovati.length > 0, `la pagina contiene almeno un marchio (${trovati.length})`);
if (!canone.length || !trovati.length) { console.log('\nnon posso giudicare: mi fermo.'); process.exit(2); }

// 1. identico al canone
const rif = disegno(canone[0]);
const diversi = trovati.filter(s => disegno(s) !== rif);
dice(diversi.length === 0,
  `tutti e ${trovati.length} i marchi della pagina sono IDENTICI a quello del core`,
  diversi.length ? `${diversi.length} diverso/i. Primo scarto:\n           canone: ${rif.slice(0, 150)}\n           pagina: ${disegno(diversi[0]).slice(0, 150)}` : undefined);

// 2. identici fra loro
const forme = new Set(trovati.map(disegno));
dice(forme.size === 1, `le copie nella pagina sono tutte lo stesso disegno (${forme.size} forma/e distinte)`);

// 3. proporzioni del viewBox
const storte = trovati.map(misure).filter(m =>
  !(m.w && m.h && m.vw && m.vh) || Math.abs(m.w / m.h - m.vw / m.vh) > 0.02);
dice(storte.length === 0,
  `le proporzioni seguono il viewBox in tutte le copie (a una misura difficile si cambia la MISURA, non il marchio)`,
  storte.length ? storte.map(m => `${m.w}x${m.h} contro viewBox ${m.vw}x${m.vh}`).join(', ') : undefined);

// 4. la parola ha una veste sola
const parole = [...sorgente.matchAll(/<b[^>]*>Deepwork<\/b>/g)].map(m => m[0]);
const senzaClasse = parole.filter(p => !/class="[^"]*\bparola\b/.test(p));
dice(parole.length > 0 && senzaClasse.length === 0,
  `la parola «Deepwork» porta sempre la sua veste ambra (${parole.length} occorrenze come marchio testuale)`,
  senzaClasse.length ? senzaClasse.join(' · ') : undefined);

console.log(`\nRisultato marchio intatto: ${ok} passati, ${ko} falliti  ·  ${trovati.length} marchi nella pagina, ${canone.length} nel canone`);
if (CONTROPROVA) {
  console.log(ko > 0 ? '✔ CONTROPROVA OK: col marchio toccato, il controllo cade.'
                     : '✗ CONTROPROVA FALLITA: ho toccato il marchio e nessuno se n\'e\' accorto.');
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);
