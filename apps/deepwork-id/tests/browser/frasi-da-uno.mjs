/* ⚠️ NON VA IN npm test: non è un banco, è l'ATTREZZO che i banchi «frasi da
   uno» importano (il vocabolario e i tre rilevatori). Gira dentro di loro. */
/* IL SETACCIO DELLE FRASI NON DECLINATE, IN UN POSTO SOLO
   ══════════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE. I tre rilevatori sono nati il 06/08 dentro
   `campo-sentinella-frasi.mjs`. Il 07/08 erano già scritti **due volte** — la
   seconda in `scudo-frasi-da-uno.mjs` — e stavano per essere scritti una
   terza per Terra. È esattamente la copia debole che CLAUDE.md censisce,
   applicata ai controlli invece che al prodotto: due elenchi di parole nati
   uguali divergono al primo cambiamento, e da quel momento la stessa domanda
   riceve due risposte diverse a seconda del banco che la fa. Qui sta una
   volta sola.

   ⛔ I RILEVATORI SONO TRE E NON UNO, e ognuno è l'unico che prende almeno un
   difetto vero:
     · D1 — la parola plurale attaccata DOPO l'uno («1 volate», «1 fori»);
     · D2 — il verbo o il participio plurale PRIMA dell'uno («ci sono 1
       lettura», «Esportati 1 certificato»). È il solo che prende le frasi in
       cui il sostantivo è invariabile o già declinato, e la seconda forma —
       il PARTICIPIO — è entrata il 07/08 perché «Esportati 1 certificato» in
       Sentinella aveva il ternario giusto sul sostantivo e nessuno davanti:
       leggendo il codice sembrava la riga corretta del file;
     · D3 — l'aggettivo che sta una parola PIÙ IN LÀ («1 giorno diversi», «1
       lettura registrate»). È il solo che prende la frase del foglio per
       l'ARPA, e senza di lui la controprova cadeva lo stesso — per colpa
       degli altri difetti — cioè verde per il motivo sbagliato.

   ⚠️ `[^\d,./]` davanti all'uno: lo slash è escluso perché «0/1 squadre» è una
   frazione, non un plurale sbagliato («si legge zero su una»). Fra il numero
   e la parola solo spazi veri, mai un a capo: due riquadri accostati non sono
   una frase.

   ⛔ L'AMPIEZZA È UN NUMERO, E QUEL NUMERO SI MISURA. L'elenco è corto di
   proposito — un allarme che sbaglia insegna a non guardarlo — ma allargarlo
   non si teme, si prova: le parole entrate il 07/08 (`monitoraggi`,
   `rilievi`, `fronti`, `banchi`, i participi di D2) sono state misurate su
   Terra e Sentinella con un dato solo, 12 schermate e 3 documenti stampati,
   e hanno dato **zero** falsi allarmi. Chi ne aggiunge una rifaccia la misura
   e scriva il numero qui.

   ⛔ LE INVARIABILI NON ENTRANO fra le parole cercate: «1 attività» è giusto.
   Stanno dichiarate qui sotto perché un banco possa provare che non si sono
   infilate fra quelle cercate. */

/* Sostantivi (e i participi/aggettivi che li seguono già declinati). */
export const PAROLE = [
  // il mestiere della cava e dell'ambiente
  'fori', 'volate', 'rapportini', 'giorni', 'ore', 'righe', 'voci', 'scadenze',
  'letture', 'turni', 'squadre', 'punti', 'ricettori', 'superamenti', 'reclami',
  'tarature', 'adempimenti', 'misure', 'certificati', 'strumenti', 'minuti',
  'giornate', 'causali', 'persone', 'fermi', 'anomalie', 'documenti', 'operatori',
  'monitoraggi', 'rilievi', 'fronti', 'lotti', 'banchi', 'cumuli', 'viaggi',
  'anni', 'mesi', 'settimane',
  // aggettivi e participi che seguono il sostantivo: è il piano di sotto, ed è
  // lì che si erano nascosti «1 giorno diversi» e «1 conformi»
  'conformi', 'diversi', 'diverse', 'registrate', 'registrati', 'coperte',
  'giudicabili', 'previste', 'aperte', 'concluse', 'pianificate',
  'indicativi', 'elaborati', 'aggiunti', 'saltati', 'ripetuti',
];

/* Invariabili: «1 attività» è italiano corretto. Non si cercano. */
export const INVARIABILI = ['attività', 'foto', 'serie', 'analisi', 'specie', 'crisi'];

/* Verbi e PARTICIPI che, seguiti da «1», non sono stati declinati. */
export const VERBI = [
  'ci sono', 'restano fuori', 'restano', 'mancano', 'risultano', 'cadono',
  // i participi in testa a un messaggio di export/import: «Esportati 1
  // certificato», «Importate 1 letture». Entrati il 07/08 con il difetto che
  // li ha resi necessari.
  'esportati', 'esportate', 'importati', 'importate', 'aggiunti', 'aggiunte',
  'rimossi', 'rimosse', 'salvati', 'salvate',
];

/* Aggettivi che stanno un posto più in là del numero. */
export const AGGETTIVI = [
  'diversi', 'diverse', 'conformi', 'giudicabili', 'coperte', 'registrate',
  'registrati', 'previste', 'aperte', 'concluse', 'pianificate', 'collegati',
  'collegate', 'misurati', 'misurate', 'rimaste', 'precedenti', 'presenti',
  'vecchie', 'indicativi', 'elaborati', 'scoperte', 'saltate', 'saltati',
  'ripetuti', 'usabili', 'nuovi', 'nuove',
];

export const D1 = () => new RegExp('(?:^|[^\\d,./])1[  ]+(' + PAROLE.join('|') + ')\\b', 'gi');
export const D2 = () => new RegExp('\\b(' + VERBI.join('|') + ')[  ]+1(?=[  ][a-zà-ù])', 'gi');
export const D3 = () => new RegExp('(?:^|[^\\d,./])1[  ]+[a-zà-ù]+[  ]+(' + AGGETTIVI.join('|') + ')\\b', 'gi');

/* ⚠️ LE ESPRESSIONI SI COSTRUISCONO A OGNI CHIAMATA, e non è pignoleria: una
   `RegExp` con la bandiera `g` porta con sé `lastIndex`, quindi condividerne
   una fra due testi fa saltare le prime occorrenze del secondo — un setaccio
   che dice «pulito» avendo guardato metà. */

/* Setaccia un testo e restituisce le righe da leggere, col contesto attorno.
   `dove` è l'etichetta con cui il banco dice DOVE ha guardato: senza, un
   elenco di frasi non si sa a quale schermata appartiene. */
export function setaccia(dove, testo) {
  const t = String(testo || '');
  const out = [];
  for (const [re, quale] of [[D1(), 'D1'], [D2(), 'D2'], [D3(), 'D3']]) {
    for (const m of t.matchAll(re)) {
      out.push(`[${quale} ${dove}] …${t.slice(Math.max(0, m.index - 70), m.index + 90).replace(/\s+/g, ' ')}…`);
    }
  }
  return out;
}

/* Il testo di un documento HTML costruito dalla pagina (le stampe di Terra
   vivono in una finestra nuova: lì non arriva né il `@media print` né
   `innerText`). Si toglie lo stile, si aprono i tag e si normalizzano gli
   spazi — e le entità che `esc()` produce si rimettono a posto, se no
   «L&#39;importo» sembrerebbe un difetto e non lo è. */
export function testoDocumento(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

/* L'aggancio da montare PRIMA di `goto` per catturare quello che esce: le
   finestre nuove (`window.open` + `document.write`) e i toast. Sta qui perché
   lo vogliono tutti i banchi che premono i bottoni dei documenti, e scritto
   due volte diverge come il vocabolario.
   ⚠️ Il toast NON si legge dal DOM: sparisce da solo, e un banco che arriva
   tardi misura una pagina senza toast e dice «pulito». Si intercetta la
   funzione — ed è lì che stava «Importate 1 letture», che la nota accanto
   scriveva già al singolare. */
export const AGGANCIO_DOCUMENTI = `
window.__dwDoc = {}; window.__dwToast = [];
(() => {
  let n = 0;
  window.open = () => { const k = 'doc' + (++n); window.__dwDoc[k] = '';
    return { document: { write: (h) => { window.__dwDoc[k] += h; }, close: () => {} },
             focus: () => {}, print: () => {} }; };
  const clic = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) return; return clic.apply(this, arguments); };
})();
`;

/* Va montato DOPO che la pagina è partita, con `p.evaluate`: `toast` la
   installa la struttura condivisa, e prima di allora non esiste — un aggancio
   messo in `addInitScript` troverebbe `window.toast` indefinito e non
   aggancerebbe niente, cioè lo script che «non fallisce» senza aver fatto
   nulla. Torna `true` solo se ha agganciato davvero: chi lo chiama può
   pretenderlo invece di fidarsi.
   Aggancia anche il `<a download>`, perché un banco che preme i bottoni di
   export senza fermarli si porta dietro i file veri. */
export const AGGANCIO_DOPO_CARICO = () => {
  window.__dwToast = window.__dwToast || [];
  if (!window.__dwScaricoFermato) {
    window.__dwScaricoFermato = true;
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (this.download) return; return clic.apply(this, arguments); };
  }
  const t = window.toast;
  if (typeof t === 'function' && !window.__dwToastMontato) {
    window.__dwToastMontato = true;
    window.toast = (...a) => { window.__dwToast.push(String(a[0])); return t(...a); };
    return true;
  }
  return false;
};
