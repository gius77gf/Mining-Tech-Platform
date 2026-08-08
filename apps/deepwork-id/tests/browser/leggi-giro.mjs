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
import { execSync } from "node:child_process";

/* L'intestazione di una passata: OTTO uguali, non sei. La differenza è la
   ragione per cui il primo setaccio lasciò passare sessanta KO voluti. */
const INTESTAZIONE = /^════════ (.+?) ════════\s*$/;
const DICHIARA_CONTROPROVA = /CONTROPROVA: qui sotto il rosso è quello VOLUTO/;
/* «non ho guardato», in tutte le forme che i banchi usano davvero */
const NON_GUARDATO = /NON RAGGIUNTE|non ho guardato|\b0 su \d+|mai comparse|solo elencate|non misurat|salt(at|o)\b|dichiarat[oe] fuori/i;
const KO = /^\s*(✗|KO\b)/;
/* Il commit che il giro ATTESTA: `tutti.mjs` lo scrive nella prima riga, perché
   serve una copia immobile del committato per misurare. */
const ATTESTA = /gira(?:ndo)? su una COPIA di ([0-9a-f]{7,40})\b/;

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
    commit: (ATTESTA.exec(testo) || [])[1] || null,
  };
}

/* ⛔ QUANTO È VECCHIO QUESTO GIRO — E PERCHÉ SENZA QUESTA RIGA SI APRE UN
   CANTIERE SU DIFETTI CHE NON ESISTONO PIÙ.
   Misurato l'08/08, e mi è successo di persona: un giro lungo cinque ore e
   mezza dichiarava cinque contrasti sotto soglia nel core e in Flotta. Erano
   VERI — al commit che il giro attesta. Ma erano stati chiusi da `5d57cbc`
   **trentotto minuti dopo** quel commit, cioè quasi cinque ore prima che io
   leggessi il registro. Stavo per riaprirli.
   Il dato c'era già: `tutti.mjs` scrive nella prima riga il commit su cui gira,
   ed è la stessa disciplina di `documenti-invecchiati.mjs` — un arretrato
   **dichiarato e misurato**. Quello che mancava era la sottrazione, che costa
   un `git rev-list`. E non basta contare i commit: contano quelli che hanno
   toccato le SUPERFICI che il giro misura (il core, le app, `shared/`) —
   altrimenti un pomeriggio di documenti fa sembrare vecchio un giro fresco.
   ⚠️ Se il commit non è nella storia (registro di un'altra macchina, o branch
   riscritto) si dichiara che non si sa, invece di stampare uno zero
   tranquillizzante: l'assenza di un dato non è un dato favorevole. */
export function etaDelGiro(commit) {
  if (!commit) return { noto: false, perche: "il registro non dichiara su quale commit ha girato" };
  const git = (c) => execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try { git(`git cat-file -e ${commit}^{commit}`); }
  catch { return { noto: false, perche: `il commit ${commit} non è in questa storia di git` }; }
  try {
    const tutti = git(`git rev-list --count ${commit}..HEAD`);
    const superfici = git(`git rev-list --count ${commit}..HEAD -- index.html apps shared`);
    return { noto: true, commit, dopo: +tutti, sulleSuperfici: +superfici };
  } catch (e) {
    return { noto: false, perche: "git non risponde: " + String(e.message || e).slice(0, 80) };
  }
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
  /* ⛔ E LA CONTROPROVA DELL'ETÀ, NEI TRE VERSI CHE CONTANO. Una guardia che
     dice sempre «vecchio» sarebbe rumore; una che dice sempre «fresco»
     sarebbe la cosa che è appena costata un cantiere sfiorato. */
  const conCommit = (c) => leggiGiro(`▶ Il giro sta girando su una COPIA di ${c} (il committato), non sulla cartella viva.\nUSCITA 0`).commit;
  if (conCommit("c3888fe") !== "c3888fe") male.push("il commit attestato non viene letto dalla prima riga");
  if (leggiGiro("nessuna intestazione\nUSCITA 0").commit !== null) male.push("un registro senza dichiarazione dovrebbe dare null");
  const inventato = etaDelGiro("0000000000000000000000000000000000000000");
  if (inventato.noto) male.push("un commit che non esiste dovrebbe dare «non lo so», non un numero");
  const senza = etaDelGiro(null);
  if (senza.noto) male.push("senza commit dichiarato dovrebbe dire che non lo sa");
  const testa = etaDelGiro("HEAD");
  if (!testa.noto) male.push("su HEAD dovrebbe saperlo");
  else if (testa.dopo !== 0 || testa.sulleSuperfici !== 0) male.push(`su HEAD dovrebbe dare 0 e 0, dà ${testa.dopo} e ${testa.sulleSuperfici}`);
  /* il verso che conta davvero: un commit vecchio DEVE risultare vecchio */
  let vecchio = null;
  try { vecchio = etaDelGiro(execSync("git rev-parse HEAD~5", { encoding: "utf8" }).trim()); } catch (e) { /* storia corta */ }
  if (vecchio && vecchio.noto && vecchio.dopo !== 5) male.push(`cinque commit indietro dovrebbero dare 5, danno ${vecchio.dopo}`);
  if (vecchio && !vecchio.noto) male.push("un commit vero della storia dovrebbe essere noto");

  console.log(male.length ? "⛔ NON DISTINGUE:\n  " + male.join("\n  ") : "controprova: il lettore separa il rosso VOLUTO da quello VERO, la sotto-intestazione non lo inganna, e l'ETÀ del giro sa dire «vecchio», «fresco» e «non lo so»");
  process.exit(male.length ? 1 : 0);
}

const file = process.argv[2];
if (!file) { console.error("uso: node leggi-giro.mjs <registro.txt>"); process.exit(2); }
const r = leggiGiro(readFileSync(file, "utf8"));

/* ⛔ SEZIONE 0, E VIENE PRIMA DI TUTTO: un KO vecchio si legge esattamente come
   uno nuovo, e costa un cantiere. */
const eta = etaDelGiro(r.commit);
console.log(`\n══ 0. QUANTO È VECCHIO QUESTO GIRO ══`);
if (!eta.noto) {
  console.log(`  ⚠️  non lo so: ${eta.perche}.`);
  console.log("      I KO qui sotto vanno riverificati sul codice di adesso prima di toccare qualcosa.");
} else if (eta.sulleSuperfici === 0) {
  console.log(`  ✓ attesta \`${eta.commit}\` · il branch è avanti di ${eta.dopo} commit, `
    + `ma NESSUNO tocca le superfici misurate: i KO valgono ancora.`);
} else {
  console.log(`  ⛔ attesta \`${eta.commit}\` · il branch è avanti di ${eta.dopo} commit, `
    + `di cui ${eta.sulleSuperfici} toccano le superfici misurate (core, app, shared).`);
  console.log("      Ogni KO qui sotto è vero A QUEL COMMIT, non adesso: si riverifica prima di aprire un cantiere.");
}

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
