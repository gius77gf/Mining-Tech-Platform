/* I BOTTONI DEGLI STATI VUOTI PUNTANO A QUALCOSA CHE ESISTE.
   ────────────────────────────────────────────────────────────────────────
   Dal 31/07 gli stati vuoti del **primo giorno** — quelli dove un cliente
   nuovo è fermo perché una lista è ancora vuota — hanno il terzo pezzo che
   mancava: **come si comincia**. I bottoni non fanno il lavoro, **portano**:
   cliccano il comando che esiste già (`data-vuoto-fai="#id-del-bottone"`) o
   mettono il fuoco sul primo campo del form (`data-vuoto-fai="id-del-campo"`).

   ⚠️ PERCHÉ QUESTO BANCO ESISTE. Scrivendolo ho **indovinato** due
   identificativi che non esistevano (`new-lav-nome`, `btn-scad-import`), e i
   bottoni sarebbero stati muti: un difetto che non fa nessun rumore — nessun
   errore in console, nessun test rosso, solo un bottone che non fa niente
   proprio nella schermata che serve a chi comincia. L'ho visto perché avevo
   misurato; senza misura, sarebbe arrivato al cliente.

   Il banco non prova che il bottone «funzioni»: prova la cosa che si rompe
   davvero, cioè che **il bersaglio esista nella pagina viva**, dopo aver
   visitato tutte le sezioni (metà degli elementi nasce quando una schermata
   si apre).

   Uso:
     node vuoti-azione.mjs [porta]
     node vuoti-azione.mjs --controprova   (punta a un id inventato: DEVE cadere)
*/
import { prendiChromium, CHROMIUM, apriSuperficie, sezioniDi, vaiA } from './giro.mjs';

const args = process.argv.slice(2);
const CONTROPROVA = args.includes('--controprova');
const PORTA = Number(args.find((a) => /^\d+$/.test(a))) || 8899;

/* app → i bersagli che i suoi stati vuoti nominano. Quando si aggiunge
   un'azione a uno stato vuoto, il suo bersaglio va aggiunto QUI: è l'elenco
   che rende il controllo capace di accorgersene. */
const BERSAGLI = [
  ['scudo',  '/apps/scudo/index.html',  ['new-nome', 'new-scad-desc', 'btn-import-csv', 'btn-import-scad']],
  ['flotta', '/apps/flotta/index.html', ['mez-nome', 'btn-mez-import']],
  ['conti',  '/apps/conti/index.html',  ['pr-nome', 'btn-lis-import']],
  ['terra',  '/apps/terra/index.html',  ['fro-nome', 'btn-fro-import']],
  ['campo',  '/apps/campo/index.html',  ['squ-nome', 'btn-squ-import']],
  ['sentinella', '/apps/sentinella/index.html', ['sen-nome', 'btn-ric-import']],
];

const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;

for (const [nome, via, ids] of BERSAGLI) {
  const cercati = CONTROPROVA ? [...ids, 'id-che-non-esiste-apposta'] : ids;
  const { ctx, p } = await apriSuperficie(browser, { nome, via, porta: PORTA });
  for (const s of await sezioniDi(p, nome)) await vaiA(p, nome, s).catch(() => {});
  const esiti = await p.evaluate((lista) => lista.map((id) => [id, !!document.getElementById(id)]), cercati);
  const mancanti = esiti.filter(([, c]) => !c).map(([id]) => id);
  if (mancanti.length === 0) { ok++; console.log(`  ok  ${nome}: tutti i ${cercati.length} bersagli esistono`); }
  else {
    ko++;
    console.log(`  KO  ${nome}: ${mancanti.length} bersagli non esistono → ${mancanti.join(', ')}`);
    console.log('        un bottone dello stato vuoto che punta lì non fa niente, e non lo dice nessuno');
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${ok} app con tutti i bersagli a posto, ${ko} con bersagli mancanti`);

/* Come per il banco degli id: in controprova si esce MALE se il difetto NON
   viene trovato, perché vorrebbe dire che il controllo non sa fallire. */
if (CONTROPROVA) {
  if (ko === BERSAGLI.length) {
    console.log("La controprova ha trovato l'id inventato in tutte le app: il banco sa fallire.");
    process.exit(0);
  }
  console.log(`\n⚠️ CONTROPROVA INCOMPLETA: solo ${ko} app su ${BERSAGLI.length} hanno segnalato l'id inventato.`);
  process.exit(1);
}
process.exit(ko > 0 ? 1 : 0);
