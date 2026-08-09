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
/* ⛔ E LA CHIUSURA, che è la metà che mancava — misurata l'08/08 su un registro
   vero. La dichiarazione era un'etichetta su UNA riga, e un banco che stampa
   una PROPRIA intestazione a otto uguali apriva qui una sezione nuova, non
   coperta: i suoi KO **voluti** tornavano a leggersi come difetti veri.
   Successo su `struttura di Genesi · controprova`, che dichiarava, e poi il
   banco apriva «Genesi: la struttura è quella del core? · controprova» —
   quattordici KO voluti finiti fra i veri, cioè esattamente il cantiere-fantasma
   che questo file esiste per impedire. La cura del 07/08 valeva solo per i
   banchi che non si intestano da sé.
   Adesso `tutti.mjs` chiude la dichiarazione, e qui la si legge come un
   INTERVALLO: ogni sezione aperta fra l'apertura e la chiusura eredita il
   flag. ⚠️ Si eredita solo DENTRO l'intervallo: fuori, una sezione nuova
   riparte da zero — se no la prima controprova del giro dipingerebbe di
   «voluto» tutto quello che viene dopo, che è il difetto opposto e peggiore. */
const FINE_CONTROPROVA = /FINE CONTROPROVA/;
/* ⛔ IL RIEPILOGO FINALE È UNA RIPETIZIONE, E CONTARLO GONFIA I DIFETTI DI
   QUATTRO VOLTE. Misurato l'08/08 su un registro vero: «KO veri: 47», di cui
   **37** erano le righe del riepilogo di `tutti.mjs` — un rigo per passata, cioè
   lo stesso rosso già stampato più su. E fra quelle 37 c'erano le controprove,
   il cui rosso è VOLUTO: la loro dichiarazione vale nell'intervallo della
   passata, non in fondo al registro, quindi qui rientravano tutte dalla
   finestra. Il numero che questo file esiste per rendere leggibile era il più
   sbagliato di tutti.
   Si legge la DICHIARAZIONE che il runner stampa, non la parola «RIEPILOGO»:
   è la lezione già pagata due volte (la controprova riconosciuta dal nome, le
   sotto-intestazioni a sei uguali). ⚠️ Il ripiego sul nome resta, dichiarato,
   perché i registri scritti PRIMA di questa riga non hanno la dichiarazione e
   sono esattamente quelli che si riaprono per capire com'è andata: senza
   ripiego, un giro vecchio continuerebbe a contare 47 dove sono 10. */
const DICHIARA_RIPETIZIONE = /RIPETIZIONE: qui sotto NON ci sono difetti nuovi/;
const NOME_RIEPILOGO = /^RIEPILOGO$/;
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
  let dentroControprova = false;   // l'intervallo fra la dichiarazione e la sua chiusura
  for (const r of righe) {
    const m = INTESTAZIONE.exec(r);
    if (m) {
      corrente = { nome: m[1], controprova: dentroControprova, ripetizione: NOME_RIEPILOGO.test(m[1]), ko: [], ciechi: [] };
      sezioni.push(corrente); continue;
    }
    /* la chiusura si legge ANCHE senza una sezione aperta: è il runner a
       stamparla, e vale comunque da qui in giù */
    if (FINE_CONTROPROVA.test(r)) { dentroControprova = false; continue; }
    if (!corrente) continue;
    /* la dichiarazione arriva SUBITO dopo l'intestazione */
    if (DICHIARA_CONTROPROVA.test(r)) { corrente.controprova = true; dentroControprova = true; continue; }
    if (DICHIARA_RIPETIZIONE.test(r)) { corrente.ripetizione = true; continue; }
    if (KO.test(r)) corrente.ko.push(r.trim());
    else if (NON_GUARDATO.test(r)) corrente.ciechi.push(r.trim());
  }
  const uscita = /USCITA (\d+)/.exec(testo);
  return {
    sezioni,
    /* «sane» = le passate i cui KO sono difetti VERI e NUOVI: né le controprove
       (rosso voluto) né il riepilogo finale (rosso già contato più su) */
    sane: sezioni.filter((s) => !s.controprova && !s.ripetizione),
    controprove: sezioni.filter((s) => s.controprova),
    ripetizioni: sezioni.filter((s) => s.ripetizione),
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
    /* ⛔ IL CASO CHE HA MORSO DAVVERO: il banco stampa una PROPRIA intestazione
       a otto uguali dentro la controprova. Prima apriva una sezione nuova non
       coperta, e i suoi KO voluti finivano fra i difetti veri. */
    "════════ pagine vive: la sua intestazione ════════",
    "  ✗ anche questo è voluto, ma sta sotto un'intestazione del BANCO",
    "   ⚠️  FINE CONTROPROVA — da qui in giù il rosso torna a essere quello VERO.",
    "════════ un banco sano dopo la controprova ════════",
    "  ✗ e QUESTO è un difetto vero",
    /* ⛔ E IL RIEPILOGO FINALE, che è una RIPETIZIONE: le sue righe sono lo
       stesso rosso già stampato sopra, controprove comprese. Contarle porta il
       conto dei difetti da 2 a 5 — sul registro vero, da 10 a 47. */
    "════════ RIEPILOGO ════════",
    "   ⚠️  RIPETIZIONE: qui sotto NON ci sono difetti nuovi — è il conto delle passate già stampate sopra.",
    "  KO  pagine vive · controprova",
    "  KO  un banco sano dopo la controprova",
    "  KO  pagine vive: la sua intestazione",
    "USCITA 0",
  ].join("\n");
  const r = leggiGiro(finto);
  const male = [];
  /* ⛔ GLI ORARI, nei TRE stati — e il terzo è quello che conta: senza le righe
     nuove il lettore deve dire «non lo so», non inventare un'ora. È il difetto
     del 09/08 (sei checkpoint con «dalle 07:55Z» invece di 06:56Z) messo sotto
     prova invece che raccontato. */
  const conFine = "Partito alle 2026-08-09T06:56:09Z (UTC).\nGiro partito alle 2026-08-09T06:56:09Z, finito alle 2026-08-09T12:30:00Z — 5h33 (UTC).";
  if (!/partito 2026-08-09T06:56:09Z, finito 2026-08-09T12:30:00Z — durato 5h33/.test(oreDelGiro(conFine)))
    male.push(`orari: il caso completo non viene letto — ${oreDelGiro(conFine)}`);
  if (!/nessuna riga di fine/.test(oreDelGiro("Partito alle 2026-08-09T06:56:09Z (UTC).")))
    male.push("orari: un giro senza riga di fine deve dirsi TRONCO, non finito");
  if (!/non lo si indovina/.test(oreDelGiro("un registro vecchio, senza orari")))
    male.push("orari: un registro senza orari deve dire «non lo so», mai inventarne uno");
  if (r.sezioni.length !== 5) male.push(`sezioni: ${r.sezioni.length} invece di 5 — la sotto-intestazione a sei uguali ne ha aperta una in più`);
  if (r.sane.length !== 2) male.push(`passate sane: ${r.sane.length} invece di 2 — il riepilogo finale è stato contato fra le sane`);
  if (r.ripetizioni.length !== 1) male.push(`riepiloghi: ${r.ripetizioni.length} invece di 1`);
  if (r.ripetizioni[0] && r.ripetizioni[0].ko.length !== 3)
    male.push(`righe del riepilogo raccolte: ${r.ripetizioni[0].ko.length} invece di 3 — vanno tenute per poterle DICHIARARE, non buttate`);
  /* ⚠️ E il ripiego sul NOME, per i registri scritti prima che la
     dichiarazione esistesse: sono quelli che si riaprono per capire com'è
     andata, e senza ripiego continuerebbero a contare 47 dove sono 10. */
  const vecchio = leggiGiro(["════════ RIEPILOGO ════════", "  KO  un banco qualunque", "USCITA 0"].join("\n"));
  if (vecchio.sane.length !== 0 || vecchio.ripetizioni.length !== 1)
    male.push("un registro SENZA la dichiarazione (scritto prima) non viene riconosciuto dal nome del riepilogo");
  if (r.controprove.length !== 2) male.push(`controprove: ${r.controprove.length} invece di 2 — l'intestazione del BANCO dentro la controprova non ha ereditato il flag`);
  const koSani = r.sane.flatMap((s) => s.ko);
  if (koSani.length !== 2) male.push(`KO veri: ${koSani.length} invece di 2 — i voluti sono stati contati, o quello dopo la FINE è stato perso`);
  /* ⛔ e il verso opposto, che è il difetto peggiore: dopo la chiusura il rosso
     torna VERO. Ereditare per sempre dipingerebbe di «voluto» tutto il resto
     del giro, cioè nasconderebbe i difetti invece di mostrarli. */
  if (!r.sane.some((x) => x.nome === "un banco sano dopo la controprova"))
    male.push("dopo la FINE CONTROPROVA una sezione nuova deve tornare SANA");
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
  /* ⛔ IL VERSO CHE CONTA: un commit vecchio DEVE risultare più vecchio di uno
     recente. E la forma dell'asserzione è stata PAGATA, l'08/08, con una CI
     rossa: la prima stesura pretendeva che `HEAD~5` desse esattamente **5**, e
     in casa era vero. In CI no — **1407** — perché GitHub non prova il branch,
     prova il MERGE del branch col ramo di destinazione: da un commit di fusione
     `HEAD~5..HEAD` raccoglie anche tutto il secondo genitore. È la variante
     dell'ambiente che misura sé stesso invece del prodotto, e vale la regola di
     casa: *sotto un ambiente diverso, prima di scrivere un'asserzione su uno
     stato, si chiede che FORMA ha quello stato lì.*
     Quello che si prova adesso è una proprietà vera dappertutto, e non
     tautologica: il conto **cresce** andando indietro, e non è mai zero per un
     commit che non è HEAD. Sul numero esatto non si può dire niente di
     portatile, e dirlo lo stesso è come scriverlo a mano in un banco. */
  let uno = null, cinque = null;
  try {
    uno = etaDelGiro(execSync("git rev-parse HEAD~1", { encoding: "utf8" }).trim());
    cinque = etaDelGiro(execSync("git rev-parse HEAD~5", { encoding: "utf8" }).trim());
  } catch (e) { /* storia corta o clone superficiale: si salta, dichiarandolo */ }
  if (uno && !uno.noto) male.push("un commit vero della storia dovrebbe essere noto");
  if (uno && uno.noto && uno.dopo < 1) male.push(`un commit che non è HEAD dovrebbe dare almeno 1, dà ${uno.dopo}`);
  if (uno && cinque && uno.noto && cinque.noto && !(cinque.dopo > uno.dopo))
    male.push(`andando indietro il conto deve CRESCERE: HEAD~1 dà ${uno.dopo}, HEAD~5 dà ${cinque.dopo}`);
  if (!uno) console.log("  ⚠️  storia troppo corta (o clone superficiale): il verso «vecchio» non è stato provato");

  console.log(male.length ? "⛔ NON DISTINGUE:\n  " + male.join("\n  ") : "controprova: il lettore separa il rosso VOLUTO da quello VERO, la sotto-intestazione non lo inganna, e l'ETÀ del giro sa dire «vecchio», «fresco» e «non lo so»");
  process.exit(male.length ? 1 : 0);
}

const file = process.argv[2];
if (!file) { console.error("uso: node leggi-giro.mjs <registro.txt>"); process.exit(2); }
const TESTO = readFileSync(file, "utf8");
const r = leggiGiro(TESTO);

/* ⛔ GLI ORARI DEL GIRO, letti dal registro e MAI indovinati. Presa dal testo e
   non dal file, così la controprova non ha bisogno di inventare un registro su
   disco — è la stessa forma di `datateNelFuturo` e di `addendiTornano`. */
export function oreDelGiro(testo) {
  const partito = /^Partito alle (\S+) \(UTC\)/m.exec(testo || "");
  const finito = /^Giro partito alle \S+, finito alle (\S+) — (\S+) \(UTC\)/m.exec(testo || "");
  if (partito && finito) return `⏱️  partito ${partito[1]}, finito ${finito[1]} — durato ${finito[2]}`;
  if (partito) return `⏱️  partito ${partito[1]} · ⚠️ nessuna riga di fine: il giro NON è arrivato in fondo, o il registro è tronco`;
  return "⏱️  ⚠️ il registro non dice quando è partito (è di prima del 09/08): non lo si indovina";
}

/* ⛔ SEZIONE 0, E VIENE PRIMA DI TUTTO: un KO vecchio si legge esattamente come
   uno nuovo, e costa un cantiere. */
const eta = etaDelGiro(r.commit);
console.log(`\n══ 0. QUANTO È VECCHIO QUESTO GIRO ══`);
/* ⛔ E L'ETÀ IN TEMPO, non solo in commit — dal 09/08. Il giro adesso stampa
   `Partito alle …` e `Giro partito … finito … Xh` (`tutti.mjs`), perché prima
   quell'ora non c'era e chi leggeva il registro la **stimava**: il 09/08 sei
   checkpoint hanno riportato «il giro è vivo dalle 07:55Z» quando era partito
   alle **06:56Z**. Un'ora di errore su un dato che il programma aveva in mano.
   ⚠️ Se le due righe non ci sono, il registro è di prima della modifica e lo si
   dice: **non si inventa un orario**, che è esattamente il difetto da cui
   nasce questa riga. */
console.log("  " + oreDelGiro(TESTO));
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

console.log(`\n══ 2. I KO VERI — fuori le controprove (rosso voluto) e il riepilogo finale (già contato) ══`);
let koTot = 0;
for (const s of r.sane) for (const k of s.ko) { koTot++; console.log(`  [${s.nome}] ${k}`); }
if (!koTot) console.log("  (nessun KO nelle passate sane)");

console.log(`\n══ 3. IL DENOMINATORE ══`);
console.log(`  passate lette: ${r.sezioni.length} — di cui ${r.controprove.length} controprove (il loro rosso è VOLUTO), `
  + `${r.ripetizioni.length} riepiloghi finali (ripetizione) e ${r.sane.length} sane`);
console.log(`  KO veri: ${koTot} · righe «non ho guardato»: ${ciechiTot}`);
const koVoluti = r.controprove.reduce((t, s) => t + s.ko.length, 0);
console.log(`  KO voluti, tenuti fuori: ${koVoluti}`);
/* si stampa invece di sparire: un numero tolto in silenzio è un numero che
   qualcuno rimetterà, e queste righe dicono comunque QUALI passate sono cadute */
const koRipetuti = r.ripetizioni.reduce((t, s) => t + s.ko.length, 0);
if (koRipetuti) console.log(`  passate cadute, ripetute nel riepilogo finale: ${koRipetuti}`
  + `  (non sono difetti in più: sono quelli di sopra, ricontati)`);
if (r.uscita !== null) console.log(`  uscita del giro: ${r.uscita}${r.uscita === 2 ? "  ⛔ il giro si è dichiarato NON VALIDO: va rifatto" : ""}`);
else console.log("  ⚠️  nessuna riga «USCITA»: il registro è tronco, il giro non è arrivato in fondo");
if (r.nonValido) console.log("  ⛔ il registro contiene «NON VALIDO»: qualcuno ha cambiato il codice sotto al giro");
