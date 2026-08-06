/* «1 FORI» — IL PLURALE INCHIODATO ACCANTO A UN NUMERO, SU TUTTE LE SUPERFICI
   ══════════════════════════════════════════════════════════════════════════
   Uso:
     node apps/deepwork-id/tests/browser/uno-solo.mjs 8823
     node apps/deepwork-id/tests/browser/uno-solo.mjs 8823 --solo=core
     node apps/deepwork-id/tests/browser/uno-solo.mjs 8823 --controprova

   ⛔ PERCHÉ ESISTE, e la ragione è che il `grep` ha già fallito una volta.
   Il 06/08 il banco delle modali ha trovato in Scudo «restano **1 voci** su
   25» — nella stessa testata dove le altre due frasi il singolare ce l'avevano.
   Contando: **351** ternari del singolare scritti a mano nelle sei app, **8**
   nel core, zero in `shared/`. Da lì `plurale`/`conta` in `dw-shell`.
   Poi, ripulendo il core, il censimento a `grep` ha detto «non resta niente» —
   e la pagina, resa con **un solo** rapportino, diceva ancora «1 rapportini ·
   1 fori». Il codice scrive questa frase in **tre dialetti** e la ricerca ne
   conosceva uno:
     · `${n} fori`          — quello che cercavo
     · `+' fori'`           — concatenazione: il motivo non lega
     · `<b>${n}</b> fori`   — il tag in mezzo: idem
   Sono serviti tre giri, e ogni giro è cominciato dal browser. Quindi la
   difesa non può essere un altro `grep`: dev'essere **la pagina resa**.

   ⚠️ E LA SECONDA SONDA HA SBAGLIATO ANCHE LEI, in un modo che vale scrivere:
   camminando sui **nodi di testo** non trovava niente, perché il numero e la
   parola stanno in due nodi diversi (`<b>1</b> fori`). Il testo che l'utente
   legge è la **concatenazione** dei nodi, non un nodo: si misura `innerText`.

   COSA GUARDA. Ogni schermata di ogni superficie, `innerText`, e cerca
   «1 <parola al plurale>». L'elenco delle parole è **corto di proposito**:
   solo sostantivi del mestiere il cui plurale è inequivocabile. Un elenco
   lungo sarebbe un elenco che sbaglia, e un allarme che sbaglia insegna a non
   guardarlo (misurato il 01/08 sui «non c'è» scaduti, e di nuovo il 06/08 con
   la regola 26 che ha accusato il catalogo degli inneschi di Genesi).

   ⛔ E LE INVARIABILI SONO DICHIARATE, NON DIMENTICATE: «1 foto», «1 serie»,
   «1 analisi», «1 specie» sono **giuste** in italiano — la parola non cambia
   al plurale. Se una di quelle finisse in elenco, il banco accuserebbe una
   frase corretta.

   ⚠️ IL LIMITE, dichiarato perché non prometta troppo: guarda quello che la
   dimostrazione mostra. Se un conto non vale mai 1 nei dati d'esempio, il
   difetto c'è e questo banco non lo vede — per quello serve costruire il caso,
   come si fa nel `--controprova` qui sotto. Quello che questo banco garantisce
   è che **non nasca un «1 fori» visibile** senza che nessuno se ne accorga. */
import { prendiChromium, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const CONTROPROVA = process.argv.includes('--controprova');
if (!PORTA) { console.error('serve la porta del server statico'); process.exit(2); }

/* I sostantivi del mestiere col plurale inequivocabile. Corto di proposito. */
const PLURALI = [
  'fori', 'volate', 'rapportini', 'mezzi', 'cave', 'clienti', 'utenti',
  'giorni', 'ore', 'righe', 'voci', 'scadenze', 'azioni', 'letture',
  'lotti', 'banchi', 'fronti', 'turni', 'squadre', 'fatture', 'ordini',
  'consegne', 'pesate', 'ricettori', 'guasti', 'consumi', 'lavori',
  'ispezioni', 'infortuni', 'documenti', 'allegati', 'punti', 'referti',
];
/* ⛔ INVARIABILI: «1 foto» è GIUSTO. Stanno qui per essere lette, non per
   essere ricordate — e il controllo in fondo pretende che nessuna sia finita
   anche nell'elenco sopra. */
const INVARIABILI = ['foto', 'serie', 'analisi', 'specie', 'crisi', 'ipotesi'];

/* ⛔ NIENTE A CAPO IN MEZZO, E QUESTA RIGA NASCE DA UN'ACCUSA FALSA AL PRIMO
   GIRO. Con `\s+` il banco ha segnalato «1 MEZZI» in Flotta — ma `innerText`
   unisce le righe, e lì c'erano DUE piastrelle di KPI: «A POSTO / 1» e poi
   «MEZZI COINVOLTI / 3». Il numero e la parola non stanno nella stessa frase,
   stanno in due riquadri diversi. Adesso fra il numero e la parola si accetta
   solo uno spazio vero, mai un a capo: una frase che va a capo fra il numero e
   il suo sostantivo non esiste, due riquadri accostati sì. */
const RE = new RegExp('(?:^|[^\\d,.])1[ \u00A0]+(' + PLURALI.join('|') + ')\\b', 'gi');

let ok = 0, ko = 0, testi = 0, schermate = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 240)}` : ''}`); }
};

/* la controprova: una frase sbagliata messa nella pagina, per vedere se il
   banco la trova davvero. Senza, «nessuna violazione» non dimostra niente. */
const FRASE_ROTTA = 'Riepilogo del turno: 1 fori misurati, 1 rapportini consegnati.';

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
const male = [];

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  try {
    if (CONTROPROVA) {
      /* si inietta nel DOM, non nel file: nessun'altra misura ne risente */
      await p.evaluate((f) => {
        const d = document.createElement('div');
        d.textContent = f;
        (document.querySelector('.screen.active, .page.active, body') || document.body).appendChild(d);
      }, FRASE_ROTTA);
    }
    const sezioni = await sezioniDi(p, nome);
    const viste = sezioni.length ? sezioni : [null];
    for (const s of viste) {
      if (s) { try { await vaiA(p, nome, s); } catch (e) { continue; } }
      await p.waitForTimeout(120);
      const t = await p.evaluate(() => {
        const e = document.querySelector('.screen.active, .page.active') || document.body;
        return e.innerText || '';
      });
      if (!t) continue;
      schermate++; testi += t.length;
      for (const m of t.matchAll(RE)) {
        const i = Math.max(0, m.index - 40);
        male.push(`${nome}${s ? ' @' + s : ''}: «1 ${m[1]}» — …${t.slice(i, m.index + 40).replace(/\n/g, ' ⏎ ')}…`);
      }
    }
  } finally { await ctx.close(); }
}
await b.close();

/* ⛔ QUANTI SOGGETTI HA GUARDATO DAVVERO: uno «zero violazioni» senza questo
   numero non distingue «pulito» da «non ho aperto niente». */
dice(schermate >= 20, `abbastanza schermate lette (${schermate}, ${testi} caratteri)`, schermate);
dice(!PLURALI.some((x) => INVARIABILI.includes(x)),
  'nessuna parola invariabile è finita fra i plurali cercati (accuserebbe una frase giusta)');

if (CONTROPROVA) {
  dice(male.length >= 2,
    `controprova: con la frase rotta nella pagina il banco DEVE trovarla (trovate ${male.length})`,
    male.slice(0, 3).join('\n        '));
  console.log(`\n${ok} ok, ${ko} KO  ·  controprova: ${male.length} frasi rotte viste su ${schermate} schermate`);
  process.exit(ko > 0 ? 1 : 0);
}

dice(male.length === 0, 'nessun plurale inchiodato accanto a un «1»', male.join('\n        '));
console.log(`\n${ok} ok, ${ko} KO  ·  ${schermate} schermate lette, ${testi} caratteri`
  + `  ·  ${PLURALI.length} parole cercate, ${INVARIABILI.length} invariabili dichiarate ed escluse`);
process.exit(ko > 0 ? 1 : 0);
