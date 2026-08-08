/* ⚠️ NON VA IN npm test: non prova niente, LEGGE il registro di un giro del
   browser già fatto. È uno strumento di lettura, non un controllo.

   ⛔ PERCHÉ ESISTE, ED È UNA STORIA GIÀ PAGATA DUE VOLTE IN DUE ORE (07/08).
   Un giro completo produce cinquemila righe, e dentro ci sono **due specie di
   rosso** che nel registro si scrivono uguali: il rosso di un banco che ha
   trovato un difetto, e il rosso **voluto** di una controprova, dove un KO è
   il banco che funziona. Quel giorno:
   1. ho letto «26 passati, 10 falliti» e ho aperto un cantiere su **dieci
      difetti che non esistevano** — era una controprova, e centosessanta righe
      più su la passata sana diceva «36 passati, 0 falliti» con la stessa
      identica frase;
   2. il setaccio scritto per non rifarlo ha sbagliato **due volte di seguito**:
      cercava le intestazioni con `^════`, che combacia anche con le
      **sotto**intestazioni a sei uguali (`══════ core ══════`), e riconosceva
      la controprova dalla **parola**, mentre due passate su quattro di
      `contrasto` si chiamano «non accusa chi pulsa» e «le classi mai comparse».
   La cura, già applicata a `tutti.mjs`, è che **il registro lo dica**: il
   runner sa quale passata è una controprova — è il quarto posto della tupla in
   `BANCHI` — e adesso lo scrive nell'intestazione. Questo file **legge quella
   dichiarazione**, non le parole: è la stessa regola, «un dato che il
   programma ha in mano non si indovina dal testo».

   ⛔ E L'ORDINE NON SI NEGOZIA: prima le righe «NON HO GUARDATO», poi i KO.
   Un rosso lo si vede; un «0 su 68» in fondo a una pagina di verde no — e per
   mesi il banco delle modali ha dichiarato di non aver aperto nessuna modale
   del core senza che nessuno lo leggesse. Un conteggio basso di violazioni va
   diviso per i soggetti che il banco ha **potuto** vedere.

   Uso:  node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro.txt>
         node apps/deepwork-id/tests/browser/leggi-giro.mjs --controprova     */

import { readFileSync } from "node:fs";

/* L'intestazione di una passata: OTTO uguali, non sei. La differenza è la
   ragione per cui il primo setaccio lasciò passare sessanta KO voluti. */
const INTESTAZIONE = /^════════ (.+?) ════════\s*$/;
const DICHIARA_CONTROPROVA = /CONTROPROVA: qui sotto il rosso è quello VOLUTO/;
/* «non ho guardato», in tutte le forme che i banchi usano davvero */
const NON_GUARDATO = /NON RAGGIUNTE|non ho guardato|\b0 su \d+|mai comparse|solo elencate|non misurat|salt(at|o)\b|dichiarat[oe] fuori/i;
const KO = /^\s*(✗|KO\b)/;

export function leggiGiro(testo) {
  const righe = testo.split("\n");
  const sezioni = [];
  let corrente = null;
  for (const r of righe) {
    const m = INTESTAZIONE.exec(r);
    if (m) { corrente = { nome: m[1], controprova: false, ko: [], ciechi: [] }; sezioni.push(corrente); continue; }
    if (!corrente) continue;
    /* la dichiarazione arriva SUBITO dopo l'intestazione */
    if (DICHIARA_CONTROPROVA.test(r)) { corrente.controprova = true; continue; }
    if (KO.test(r)) corrente.ko.push(r.trim());
    else if (NON_GUARDATO.test(r)) corrente.ciechi.push(r.trim());
  }
  const uscita = /USCITA (\d+)/.exec(testo);
  return {
    sezioni,
    sane: sezioni.filter((s) => !s.controprova),
    controprove: sezioni.filter((s) => s.controprova),
    uscita: uscita ? +uscita[1] : null,
    nonValido: /NON VALIDO/.test(testo),
  };
}

if (process.argv.includes("--controprova")) {
  /* ⚠️ Le due trappole vere, non inventate: una sotto-intestazione a SEI
     uguali dentro una sezione non deve aprirne una nuova, e un KO dentro una
     controprova non deve finire fra i difetti. */
  const finto = [
    "════════ pagine vive ════════",
    "  ✓ tutto bene",
    "  ⚠️  0 su 68 modali aperte",
    "══════ core ══════",
    "  ✗ un difetto VERO dopo una sotto-intestazione",
    "════════ pagine vive · controprova ════════",
    "   ⚠️  CONTROPROVA: qui sotto il rosso è quello VOLUTO. Un KO qui è il banco che funziona.",
    "  ✗ questo rosso è voluto",
    "  ✗ anche questo",
    "USCITA 0",
  ].join("\n");
  const r = leggiGiro(finto);
  const male = [];
  if (r.sezioni.length !== 2) male.push(`sezioni: ${r.sezioni.length} invece di 2 — la sotto-intestazione a sei uguali ne ha aperta una in più`);
  if (r.sane.length !== 1) male.push(`passate sane: ${r.sane.length} invece di 1`);
  if (r.controprove.length !== 1) male.push(`controprove: ${r.controprove.length} invece di 1`);
  const koSani = r.sane.flatMap((s) => s.ko);
  if (koSani.length !== 1) male.push(`KO veri: ${koSani.length} invece di 1 — i due voluti sono stati contati`);
  if (r.sane[0] && r.sane[0].ciechi.length !== 1) male.push("la riga «0 su 68» non è stata raccolta");
  if (r.uscita !== 0) male.push(`uscita: ${r.uscita}`);
  console.log(male.length ? "⛔ NON DISTINGUE:\n  " + male.join("\n  ") : "controprova: il lettore separa il rosso VOLUTO da quello VERO, e la sotto-intestazione non lo inganna");
  process.exit(male.length ? 1 : 0);
}

const file = process.argv[2];
if (!file) { console.error("uso: node leggi-giro.mjs <registro.txt>"); process.exit(2); }
const r = leggiGiro(readFileSync(file, "utf8"));

console.log(`\n══ 1. QUELLO CHE IL GIRO NON HA GUARDATO — si legge PRIMA dei KO ══`);
let ciechiTot = 0;
for (const s of r.sane) for (const c of s.ciechi) { ciechiTot++; console.log(`  [${s.nome}] ${c}`); }
if (!ciechiTot) console.log("  (nessuna riga: nessun banco ha dichiarato di non aver guardato qualcosa)");

console.log(`\n══ 2. I KO VERI — le controprove sono escluse perché il registro le dichiara ══`);
let koTot = 0;
for (const s of r.sane) for (const k of s.ko) { koTot++; console.log(`  [${s.nome}] ${k}`); }
if (!koTot) console.log("  (nessun KO nelle passate sane)");

console.log(`\n══ 3. IL DENOMINATORE ══`);
console.log(`  passate lette: ${r.sezioni.length} — di cui ${r.controprove.length} controprove (il loro rosso è VOLUTO) e ${r.sane.length} sane`);
console.log(`  KO veri: ${koTot} · righe «non ho guardato»: ${ciechiTot}`);
const koVoluti = r.controprove.reduce((t, s) => t + s.ko.length, 0);
console.log(`  KO voluti, tenuti fuori: ${koVoluti}`);
if (r.uscita !== null) console.log(`  uscita del giro: ${r.uscita}${r.uscita === 2 ? "  ⛔ il giro si è dichiarato NON VALIDO: va rifatto" : ""}`);
else console.log("  ⚠️  nessuna riga «USCITA»: il registro è tronco, il giro non è arrivato in fondo");
if (r.nonValido) console.log("  ⛔ il registro contiene «NON VALIDO»: qualcuno ha cambiato il codice sotto al giro");
