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
import { readFileSync } from "node:fs";
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
    /* ⛔ e non basta che esista: deve aver toccato QUESTO documento. Se no
       chiunque può incollarci `HEAD` e il documento risulterebbe fresco senza
       che nessuno abbia riletto una riga — la guardia che si spegne da sola. */
    const tocchi = git(`log --format=%H -- ${nome}`).split("\n");
    ok(tocchi.includes(pieno), `il commit \`${corto}\` esiste ma non ha mai toccato ${nome}: `
      + "una data incollata non è una verifica");
  });

  misure.push({ app, nome, corto, dietro: arretrato(corto, app) });
}

const dietro = misure.filter(x => x.dietro > 0);
console.log("\nArretrato di ciascun documento — commit sull'app dopo la verifica:");
for (const x of misure) console.log(`  ${x.dietro > 0 ? "⚠️ " : "✓  "}${x.app.padEnd(11)} verificato a \`${x.corto}\` · ${x.dietro} commit dopo`);

if (dietro.length) {
  console.log(`\n⛔ ${dietro.length} documenti su ${misure.length} sono più vecchi del codice che descrivono.`);
  console.log("   Non è un guasto: è l'arretrato, e sta qui per essere visto scendere.");
  console.log("   Le righe già trovate scadute e corrette a mano portano la loro data accanto.");
}

console.log(`\nRisultato documenti invecchiati: ${passed} passati, ${failed} falliti` +
  `  ·  ${misure.length} documenti misurati, arretrato totale ${misure.reduce((s, x) => s + x.dietro, 0)} commit`);
process.exit(failed ? 1 : 0);
