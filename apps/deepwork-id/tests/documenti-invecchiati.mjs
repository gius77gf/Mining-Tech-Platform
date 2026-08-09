// ============================================================
// QUANTO SONO VECCHI I DOCUMENTI DEL DELTA
//
// ⛔ PERCHÉ ESISTE. Il 01/08, in un pomeriggio solo, **tre fonti indipendenti**
// hanno detto «non c'è» di cose costruite poche ore prima:
//   · `docs/CONCORRENTI_TERRA.md` dava per assente la **conformità al progetto**
//     e il **volume per banco**: la prima verificata alle 16:20, costruita alle
//     16:55 — la riga è invecchiata in **trentacinque minuti**;
//   · `docs/CONCORRENTI_SENTINELLA.md` dava per assente lo **storico tarature**,
//     che quella sera è diventato sette funzioni esportate;
//   · una ricerca lanciata alle 21:45, **con il divieto esplicito** di dichiarare
//     un «non c'è» senza la prova, ha proposto come mancanza l'**anagrafe
//     appaltatori** di Scudo, costruita due ore prima e visibile in cinque
//     funzioni esportate e dodici punti della pagina.
//
// Non è un «non c'è» **sbagliato**: è un «non c'è» **scaduto**, ed è una forma
// diversa perché nessuno dei tre autori ha fatto niente di male — la verifica
// era vera quando è stata scritta. È il prezzo dei cantieri paralleli, che sono
// anche il primo moltiplicatore misurato: la cura non può essere lavorare in
// fila, deve essere meccanica.
//
// ⚠️ COSA QUESTO CONTROLLO **NON** FA, e va detto perché il tentativo è stato
// fatto e **misurato**. La strada ovvia era rimettere alla prova i termini che
// ogni riga dichiara di aver cercato («cercati `conformit`, `conform`: zero
// occorrenze») e segnalare quelli che adesso rispondono. Misurato su 65 righe e
// 160 termini: **8 righe segnalate, 2 vere, 6 falsi allarmi**, e **2 righe vere
// non viste**. La ragione non è il confronto, è la **lettura**: la colonna della
// prova è prosa, scritta da sei autori in sei notazioni, e cita i nomi di ciò
// che ESISTE come controesempio accanto ai termini cercati a vuoto — quindi un
// lettore automatico prende `nettoPesata` per un termine cercato e grida. Un
// allarme che sbaglia tre volte su quattro insegna a non guardarlo. La misura
// sta in `scratchpad`, ma il suo esito sta qui: **non rifarlo alla cieca.**
//
// QUELLO CHE QUESTO CONTROLLO FA, e che non ha falsi allarmi mai: non guarda le
// righe, guarda **le date**. Ogni documento dichiara il commit contro cui è
// stato verificato; il controllo pretende che quel commit **esista** e che abbia
// **davvero toccato quel documento**, e poi stampa di **quanti commit** l'app è
// andata avanti da allora. È la stessa forma già usata per i checkpoint datati
// avanti: un arretrato **dichiarato e misurato**, che il giorno in cui qualcuno
// lo sistema **scende e si vede**.
// ============================================================
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

/* la riga che ogni documento deve portare, e che il controllo cerca */
export const RIGA = /verificato contro il codice al commit `([0-9a-f]{7,40})`/i;

let passed = 0, failed = 0;
const test = (nome, fn) => { try { fn(); passed++; console.log(`  ✓ ${nome}`); } catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); } };
const ok = (c, why) => { if (!c) throw new Error(why); };

const git = (cmd) => execSync(`git ${cmd}`, { cwd: RADICE, encoding: "utf8" }).trim();

/* ⛔ UN CONTROLLO CHE NON PUÒ MISURARE NON DICE «A POSTO». In una copia poco
   profonda (`clone --depth`) la storia non c'è e ogni conto risponderebbe zero:
   quello sarebbe il numero tranquillo dove non è stato misurato niente. */
export function storiaLeggibile(radice = RADICE) {
  try {
    const n = +execSync("git rev-list --count HEAD", { cwd: radice, encoding: "utf8" }).trim();
    const superficiale = execSync("git rev-parse --is-shallow-repository", { cwd: radice, encoding: "utf8" }).trim() === "true";
    return { leggibile: n > 1 && !superficiale, commit: n, superficiale };
  } catch (e) { return { leggibile: false, commit: 0, superficiale: false, errore: e.message }; }
}

/* l'arretrato di un documento: quanti commit ha fatto l'app dopo la verifica */
export function arretrato(commitVerifica, app, radice = RADICE) {
  return +execSync(`git rev-list --count ${commitVerifica}..HEAD -- apps/${app}/`,
    { cwd: radice, encoding: "utf8" }).trim();
}

/* ⛔ E IL CONTO DEI COMMIT NON È IL CONTO DI CIÒ CHE PUÒ AVER INVALIDATO IL
   DOCUMENTO. Il 07/08 sei cantieri hanno rifatto le palette delle sei app: sei
   commit, sei app, **zero** funzioni e zero bottoni toccati — e l'arretrato è
   salito da 27 a 33 senza che una sola riga dei documenti potesse essere
   scaduta. Questi documenti dicono **che cosa l'app SA FARE**; un colore
   cambiato non può renderli falsi.
   Il costo di un contatore che sale per ragioni che non contano è già misurato
   in questa casa e sta in CLAUDE.md: un allarme che sbaglia tre volte su
   quattro insegna a non guardarlo. Quindi accanto al numero grezzo si stampa
   quello che **morde**: i commit che hanno aggiunto o tolto una `export
   function` nel modulo dati o un `<button>` nella pagina — cioè le due forme
   con cui in questo monorepo nasce e muore una funzione.
   Misurato il 07/08 sulle sei: **33 commit di arretrato, 7 che mordono**
   (campo 2, terra 2, conti 1, scudo 1, sentinella 1, flotta **0** — il suo
   documento è aggiornato su ciò che conta, e il conto grezzo diceva 3).
   ⚠️ Il grezzo NON si toglie: un commit che riscrive una frase può benissimo
   smentire una riga del documento, e questo conto non lo vedrebbe. I due numeri
   dicono due cose diverse e vanno letti tutt'e due — quello che morde dice
   «qui si è sicuramente perso qualcosa», il grezzo «qui potrebbe». */
/* `fino` è un argomento e non una costante `HEAD` perché serve alle prove qui
   sotto: una controprova che può guardare solo fino a HEAD misurerebbe un
   intervallo che cambia a ogni commit, cioè si smentirebbe da sola domani.
   È la regola di casa — una copia nasce quasi sempre da una firma troppo
   stretta: prima di ricopiare un corpo, chiedersi se manca un parametro. */
export function arretratoCheMorde(commitVerifica, app, radice = RADICE, fino = "HEAD") {
  return morsi(commitVerifica, app, radice, fino).length;
}

/* ⛔ E IL NUMERO DA SOLO NON BASTA A LAVORARCI. «7 commit che mordono» dice
   quanto c'è da fare e non **dove**: chi riapre l'arretrato deve rifarsi da capo
   il `git rev-list` e leggersi i diff, che è il lavoro che questo file esiste per
   togliere. Restituire gli hash costa zero — sono già in mano — e trasforma un
   numero in un elenco su cui si comincia.
   ⚠️ È la stessa cosa che oggi si è imparata due volte sui banchi: un conteggio
   senza i suoi soggetti accanto non si sa leggere. */
export function morsi(commitVerifica, app, radice = RADICE, fino = "HEAD") {
  const hash = execSync(`git rev-list ${commitVerifica}..${fino} -- apps/${app}/`,
    { cwd: radice, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  const out = [];
  for (const h of hash) {
    const diff = execSync(`git show --format= ${h} -- apps/${app}/`,
      { cwd: radice, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (!/^[+-]\s*export function|^[+-].*<button/m.test(diff)) continue;
    const titolo = execSync(`git log --format=%s -1 ${h}`, { cwd: radice, encoding: "utf8" }).trim();
    out.push({ hash: h.slice(0, 7), titolo });
  }
  return out;
}

console.log("Quanto sono vecchi i documenti del delta — 6 documenti\n");

const stato = storiaLeggibile();
test("la storia di git è leggibile (se no il conto direbbe zero senza aver guardato)", () => {
  ok(stato.leggibile, stato.superficiale ? "copia superficiale: `git clone --depth` non porta la storia"
    : `storia non leggibile (${stato.commit} commit)${stato.errore ? " — " + stato.errore : ""}`);
});

const misure = [];
for (const app of APP) {
  const nome = "docs/CONCORRENTI_" + app.toUpperCase() + ".md";
  const testo = readFileSync(join(RADICE, nome), "utf8");
  const m = RIGA.exec(testo);

  test(`${nome}: dichiara il commit contro cui è stato verificato`, () => {
    ok(m, "manca la riga «verificato contro il codice al commit `<hash>`» — senza quella, "
      + "l'età del documento non è misurabile e chi lo legge non ha modo di saperlo");
  });
  if (!m) continue;

  const corto = m[1];
  test(`${nome}: quel commit esiste davvero`, () => {
    let pieno = "";
    try { pieno = git(`rev-parse ${corto}^{commit}`); } catch { ok(false, `il commit \`${corto}\` non esiste in questa storia`); }
    /* ⛔ e non basta che esista: deve aver toccato **il documento o l'app** che
       il documento descrive. Se no chiunque può incollarci un hash a caso e il
       documento risulterebbe fresco senza che nessuno abbia riletto una riga.

       ⚠️ ERA «SOLO IL DOCUMENTO», ED ERA UN VINCOLO CIRCOLARE — trovato il
       02/08 da chi stava riverificando Sentinella. Il commit che *contiene* la
       verifica non si può citare: quando scrivi la riga, quell'hash non esiste
       ancora. Quindi il più fresco dichiarabile era il commit **precedente**
       che aveva toccato il documento, e l'arretrato stampato restava
       **pessimista per costruzione**: quattro dei commit contati erano già
       dentro la verifica. Un documento riverificato oggi non poteva mai
       arrivare a zero, cioè il numero che questo controllo esiste per far
       scendere aveva un fondo che non era lo zero.
       Con l'app fra i soggetti ammessi il problema sparisce: chi verifica cita
       il commit dell'**app** che ha davvero letto — che è anche il soggetto
       vero della verifica — e da lì l'arretrato si conta onestamente.

       ⚠️ E il limite di questa guardia va detto invece che sottinteso: non
       dimostra che qualcuno abbia riletto: dimostra che l'hash è un punto vero
       della storia di quel lavoro. La prova vera è quella riga per riga —
       il `file:riga` se la cosa c'è, i termini cercati a vuoto se non c'è. */
    const tocchiDoc = git(`log --format=%H -- ${nome}`).split("\n");
    const tocchiApp = git(`log --format=%H -- apps/${app}/`).split("\n");
    ok(tocchiDoc.includes(pieno) || tocchiApp.includes(pieno),
      `il commit \`${corto}\` esiste ma non ha mai toccato né ${nome} né apps/${app}/: `
      + "una data incollata non è una verifica");
  });

  const chiMorde = morsi(corto, app);
  misure.push({ app, nome, corto, dietro: arretrato(corto, app), morde: chiMorde.length, quali: chiMorde });
}

/* ⛔ LA CONTROPROVA, NEI DUE VERSI, SU INTERVALLI CHIUSI — se no misurerebbe
   un intervallo che si allunga a ogni commit e domani direbbe un'altra cosa.
   `a1bfee4` ha portato in Campo funzioni nuove: dev'essere visto. `b50c8b4` è
   il commit delle palette di Flotta, che ha cambiato solo colori: NON dev'essere
   visto — ed è quello che conta, perché è il caso per cui questo conto esiste. */
test("il conto che morde SA vedere un commit che aggiunge funzioni", () => {
  const n = arretratoCheMorde("a1bfee4~1", "campo", RADICE, "a1bfee4");
  ok(n === 1, `su a1bfee4 (funzioni nuove in Campo) doveva contare 1, ha contato ${n}`);
});
test("il conto che morde NON vede un commit di sole palette", () => {
  const n = arretratoCheMorde("b50c8b4~1", "flotta", RADICE, "b50c8b4");
  ok(n === 0, `su b50c8b4 (solo colori in Flotta) doveva contare 0, ha contato ${n}`);
});

const dietro = misure.filter(x => x.dietro > 0);
console.log("\nArretrato di ciascun documento — commit sull'app dopo la verifica,");
console.log("e quanti di quelli hanno aggiunto o tolto una funzione o un bottone:");
for (const x of misure) {
  console.log(`  ${x.morde > 0 ? "⛔" : x.dietro > 0 ? "⚠️ " : "✓ "} ${x.app.padEnd(11)} verificato a \`${x.corto}\``
    + ` · ${String(x.dietro).padStart(2)} commit dopo, di cui ${x.morde} che MORDONO`);
  for (const m of x.quali) console.log(`                 · ${m.hash}  ${m.titolo.slice(0, 76)}`);
}

if (dietro.length) {
  console.log(`\n⛔ ${dietro.length} documenti su ${misure.length} sono più vecchi del codice che descrivono.`);
  console.log("   Non è un guasto: è l'arretrato, e sta qui per essere visto scendere.");
  console.log("   Le righe già trovate scadute e corrette a mano portano la loro data accanto.");
  console.log("   ⚠️  I due numeri dicono due cose diverse, e vanno letti tutt'e due: quelli che");
  console.log("      MORDONO hanno aggiunto o tolto una `export function` o un `<button>`, cioè le");
  console.log("      due forme con cui qui nasce e muore una funzione — lì si è sicuramente perso");
  console.log("      qualcosa. Il grezzo dice «potrebbe»: una frase riscritta può smentire una riga");
  console.log("      del documento senza toccare nessuna delle due.");
}

/* ⛔ LA CITAZIONE `file:riga` INVECCHIA A OGNI COMMIT, E QUI È MORTA AL 96%.
   Misurato il 09/08: **87 citazioni scadute su 91 verificabili** nei sei
   documenti del delta — cioè, aprendo una prova e andando a quella riga, quasi
   sempre non c'è quello che dice.
   ⚠️ E la parte che conta è che **i NOMI sono giusti**: verificati uno per uno
   i 19 di Conti e i 4 di Terra, esistono tutti. Non è il verdetto a essere
   marcio, è il **numero di riga** — che nessuno può tenere aggiornato in un
   file che cresce di centinaia di righe al giorno, e che chi riapre la riga
   legge come «la prova è falsa». È la terza forma d'invecchiamento
   (`CLAUDE.md`): il verdetto regge e scade la prova, e una prova non credibile
   fa buttare via anche le righe giuste.
   ⛔ La decisione, presa con questo numero: **una prova cita il NOME, non la
   riga.** Il nome si verifica con un `grep` in tre secondi ed è stabile; la
   riga costa manutenzione a ogni commit e la ripaga con niente. Non si
   riscrivono tutte adesso — sarebbero 91 modifiche di prosa in sei documenti,
   con più rischio che valore — ma **ogni riga che si tocca perde i suoi
   numeri**, e questo conto sta qui per essere visto scendere.
   ⚠️ Il controllo NON fallisce: è una misura, come l'arretrato dei commit.
   Farlo fallire vorrebbe dire fermare il lavoro su 87 righe di prosa. */
{
  const sorgenti = new Map();
  const leggi = (rel) => {
    if (!sorgenti.has(rel)) {
      const p2 = join(RADICE, rel);
      /* ⚠️ `existsSync` risponde vero anche per una CARTELLA, e la prima
         stesura è morta con `EISDIR` sul primo documento: un nome di file
         corto può combaciare con una directory. Si chiede se è un FILE. */
      const buono = existsSync(p2) && statSync(p2).isFile();
      sorgenti.set(rel, buono ? readFileSync(p2, "utf8").split("\n") : null);
    }
    return sorgenti.get(rel);
  };
  const percorso = (app, file) => [`apps/${app}/${file}`, `shared/${file}`, `shared/deepwork-id-client/${file}`, file]
    .find((c) => existsSync(join(RADICE, c))) || null;
  let tot = 0, vecchie = 0;
  const per = [];
  for (const f of readdirSync(join(RADICE, "docs")).filter((n) => /^CONCORRENTI_.*\.md$/.test(n)).sort()) {
    const app = f.replace(/^CONCORRENTI_|\.md$/g, "").toLowerCase();
    const testo = readFileSync(join(RADICE, "docs", f), "utf8");
    let ultimo = null, n = 0, v = 0;
    for (const m of testo.matchAll(/`([A-Za-z_$][\w$]*)`\s*\(`?([a-z0-9-]+\.(?:js|html)):(\d+)`?\)|`([A-Za-z_$][\w$]*)`\s*\((\d{3,4})\)/g)) {
      const nome = m[1] || m[4];
      const file = m[2] || ultimo;
      const riga = +(m[3] || m[5]);
      if (m[2]) ultimo = m[2];
      if (!file) continue;
      const righe = leggi(percorso(app, file) || "");
      if (!righe) continue;
      n++;
      /* finestra di ±3 righe: una prova non è sbagliata se il codice si è
         spostato di due righe, lo è se non c'è più niente lì intorno */
      if (!righe.slice(Math.max(0, riga - 4), riga + 3).join("\n").includes(nome)) v++;
    }
    if (n) per.push(`${app} ${v}/${n}`);
    tot += n; vecchie += v;
  }
  /* ⛔ SI STAMPA ANCHE A ZERO, e non è pignoleria: un controllo che tace quando
     non trova soggetti è indistinguibile da un controllo rotto. Il 09/08 il
     conto è passato da **87 su 91** a **0 su 0** in un'unità — tolti i numeri
     di riga da tutti e sei i documenti — e senza questa riga la differenza fra
     «la convenzione è cambiata» e «il righello non guarda più niente» non si
     vedrebbe. Se domani qualcuno riscrive una prova col numero di riga, il
     denominatore risale e si vede. */
  console.log(`\n⏱️  citazioni «file:riga» che non trovano più il loro nome: ${vecchie} su ${tot}`
    + (per.length ? `  (${per.join(" · ")})` : "  — nessuna citazione con la riga: la convenzione è il NOME"));
  console.log("   Non è un guasto e non fa fallire niente: i NOMI sono giusti, era il NUMERO DI RIGA");
  console.log("   che invecchiava a ogni commit — 87 su 91 erano scadute il 09/08, prima di toglierli.");
  console.log("   Una prova cita il nome, che si verifica con un grep in tre secondi ed è stabile.");

  /* ⛔ E IL RESTO DELLA POPOLAZIONE, DICHIARATO PERCHÉ NON SI PUÒ CONTROLLARE.
     Restano **157** citazioni della forma `file.js:123` **senza un nome
     accanto** (spesso un intervallo: «il blocco dell'allegato a
     `index.html:1237-1248`»). Non sono verificabili in automatico: senza un
     nome da cercare non c'è niente da confrontare con quella riga.
     ⚠️ **E la scorciatoia è stata provata e SCARTATA con la misura**, perché
     nessuno la rifaccia: «quante puntano OLTRE la fine del file?» dà **0 su
     157** — e quello zero non vuol dire niente, perché i file **crescono**.
     È la stessa trappola del fondo su un valore monotòno già censita in
     `CLAUDE.md` per `copertura-funzioni`: un controllo che può solo diventare
     più difficile da far scattare col passare del tempo.
     ⛔ Quindi NON si tolgono: sulle citazioni col nome la staleness era
     **misurata** (87 su 91), qui sarebbe **dedotta** — e in questa casa non si
     tocca un soggetto sano perché lo dice un'inferenza. Chi riscrive una di
     quelle righe le toglie il numero, come le altre. */
  console.log("   ⚠️ Restano 157 citazioni `file:riga` SENZA un nome accanto: non verificabili in");
  console.log("      automatico, e non tolte — sulle altre la staleness era misurata, qui sarebbe");
  console.log("      dedotta. («oltre la fine del file» dà 0 su 157, e non vuol dire niente: i file crescono.)");
}

console.log(`\nRisultato documenti invecchiati: ${passed} passati, ${failed} falliti` +
  `  ·  ${misure.length} documenti misurati, arretrato totale ${misure.reduce((s, x) => s + x.dietro, 0)} commit,`
  + ` di cui ${misure.reduce((s, x) => s + x.morde, 0)} che mordono`);
process.exit(failed ? 1 : 0);
