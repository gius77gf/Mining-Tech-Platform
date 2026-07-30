// ============================================================
// LE REGOLE DI STILE VINCOLANTI, RESE VERIFICABILI
//
// Alcune regole di CLAUDE.md non sono gusto: sono decisioni prese una volta e
// da non rimettere in discussione. Finché vivono solo in memoria di progetto,
// prima o poi qualcuno le rompe in buona fede — e nessuno se ne accorge,
// perché non falliscono i test, si vedono solo aprendo la pagina giusta.
// Qui diventano controlli che girano in automatico.
//
// Dodici regole, oggi:
//  1. NIENTE DIALOGHI DEL BROWSER. `alert()`, `confirm()`, `prompt()` sono
//     vietati dalla direttiva sullo stile. La ragione non è estetica: la
//     finestra ha il carattere e i bottoni del sistema operativo, su Android
//     compare incollata in cima allo schermo, in `confirm()` il bottone che
//     distrugge è indistinguibile da quello che annulla, e `prompt()` non
//     accetta la virgola decimale. Si usano la modale e il toast del core.
//  2. LE UNITÀ DI MISURA NON VANNO IN MAIUSCOLO. `m³` diventa `M³`, e
//     `µg/m³` diventa `ΜG/M³` — Chromium trasforma la mu in mu greca
//     MAIUSCOLA — cioè milligrammi, mille volte tanto, su un documento che il
//     cliente consegna all'ente. Il motore dei grafici condiviso avvolge da sé
//     le unità in `.dwg-u`: qui si controlla che quel meccanismo ci sia ancora
//     e che nessuna app torni a metterci una toppa locale che spegne il
//     maiuscolo a TUTTA l'intestazione (allontanandosi dal core).
//  3. NESSUN CAMPO DECIMALE È `type="number"`. In Chromium digitando «2,4» il
//     `.value` diventa «24» e `checkValidity()` risponde true: il browser
//     scarta la virgola e dichiara valido un numero dieci volte più grande.
//     Un campo si dichiara decimale in DUE modi — `step` frazionario oppure
//     `inputmode="decimal"` — e la regola all'inizio guardava solo il primo,
//     lasciandone passare 34 nel core.
//  4. NESSUN CAMPO DECIMALE SI LEGGE CON `parseNum0`, il lettore che di ciò che
//     non capisce fa ZERO. Zero non è «non lo so»: è una misura, ed è sbagliata,
//     e finisce dentro somme e medie senza lasciare traccia.
//  5. DOVE CI SONO CAMPI INTERI, LA GUARDIA È MONTATA. Gli interi restano
//     `type="number"` perché lì lo spinner serve, ma allora la virgola la
//     rifiuta `montaGuardiaInteri` di `shared/`: leggere `checkValidity()` non
//     basterebbe, perché su «1,5» il browser risponde **true**.
//  6. IL PONTE CON TERRA NON DÀ LA COLPA A CHI COMPILA. Se Campo dicesse «le
//     tue stime erano gonfie», i turni comincerebbero a scrivere numeri prudenti
//     invece di veri, e il dato peggiorerebbe dove serve. Il testo deve nominare
//     ENTRAMBE le spiegazioni, compresa quella che non riguarda i turni.
//  7. LA PROVENIENZA DI UN RILIEVO SI DECIDE IN UN POSTO SOLO. Cumulo = già
//     estratto, NON consuma il concesso; scavo sì. La regola era scritta due
//     volte: se una copia divergesse, il materiale tolto anni fa comincerebbe a
//     consumare la concessione senza nessun errore e senza nessun test rosso.
//  8. UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE non è un errore
//     per nessuno: il browser tace, la pagina si apre, la nota si vede — neutra,
//     dove il codice diceva «attenzione». Trovato dal vero: `.note.avviso`
//     esisteva in Terra e in Sentinella, in Campo e Scudo no, e tre note
//     d'avviso rendevano come note qualunque.
//  9. NESSUNA SUPERFICIE SI RISCRIVE IN CASA LA REGOLA DEGLI INTERI. Terra ne
//     aveva una copia, scritta prima che la guardia vivesse in `shared/` e con
//     un comportamento diverso: svuotava il campo. Montate tutte e due, «1.500»
//     diventava «500» — un numero plausibile e sbagliato, cioè la cosa che lo
//     svuotamento voleva evitare. Trovato digitando davvero, non leggendo.
// 10. UNO STATO VUOTO CON UN TITOLO HA ANCHE UNA SPIEGAZIONE. «Nessun mezzo da
//     lavoro» su uno schermo per il resto nero non dice a chi guarda che cosa
//     deve fare, né se il vuoto dipende da lui. Nel core erano tredici, ed è la
//     schermata che una cava nuova vede il primo giorno. Non riguarda i
//     segnaposto brevi dentro le schede («Nessun file»), che hanno la sola riga
//     di spiegazione di proposito: la regola guarda chi ha un TITOLO.
// 11. NESSUNA APP SI SCRIVE IN CASA IL SIMBOLO DELL'EURO. Il 30/07 erano tre
//     forme in tre app, ognuna con accanto la ragione per cui era quella
//     giusta: Conti «€\u00A048.200,00» (spazio unificatore), Terra
//     «€\u002048.200» (spazio normale), Flotta «€178,50» (attaccato). Nessuna
//     era sciatta: nessuna sapeva delle altre. E chi compra due app le vede una
//     accanto all'altra. La forma sta in `euro`/`euro0`/`conEuro` di `shared/`,
//     e chi ha un numero formattato a modo suo mette il simbolo con `conEuro`
//     invece di riscriverlo: è dalla scorciatoia che nascono le terze forme.
// 12. CHI SALTA I DOPPIONI LI CERCA ANCHE DENTRO IL FILE. Il 31/07 dieci
//     gestori d'importazione su dieci confrontavano ogni riga solo con
//     l'elenco caricato all'apertura della pagina, che NON si aggiorna mentre
//     il file scorre: due righe uguali nello stesso file entravano tutte e
//     due, in tutte e sei le app. E non è un caso di scuola — l'export di
//     Scudo scrive una riga per ogni scadenza, quindi ri-caricare il proprio
//     file faceva comparire tre volte lo stesso lavoratore. La regola guarda
//     solo i gestori che i doppioni li saltano davvero: dove ripetersi è
//     lecito (più letture dello stesso sensore) non pretende niente.
//
// Come si aggiunge una regola: una funzione che restituisce l'elenco delle
// violazioni con file e riga, e un `test(...)` che pretende zero.
// ============================================================
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const root = join(HERE, "..", "..", "..");   // tests → deepwork-id → apps → radice

let passed = 0, failed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); } };
const ok = (cond, why) => { if (!cond) throw new Error(why); };

// Tutte le superfici che l'utente apre. Se nasce un'app, va aggiunta qui.
const SUPERFICI = [
  ["core (radice)", "index.html"],
  ["vetrina dell'ecosistema", "apps/index.html"],
  ["Genesi", "apps/genesi/genesi.html"],
  ["Conti", "apps/conti/index.html"],
  ["Flotta", "apps/flotta/index.html"],
  ["Scudo", "apps/scudo/index.html"],
  ["Campo", "apps/campo/index.html"],
  ["Sentinella", "apps/sentinella/index.html"],
  ["Terra", "apps/terra/index.html"],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html"],
  ["Deepwork ID · profilo", "apps/deepwork-id/profilo.html"],
  ["Deepwork ID · accesso", "apps/deepwork-id/index.html"],
];
// I moduli dati e il motore condiviso: nessuna interfaccia, ma è da lì che
// partirebbe una regressione silenziosa.
const MODULI = [
  ["motore grafici", "shared/dw-grafici.js"],
  ["motore grafici (stile)", "shared/dw-grafici.css"],
  ["guscio SDK", "shared/deepwork-id-client/dw-shell.js"],
  ["ponti fra le app", "shared/dw-ponti.js"],
  ["Campo (dati)", "apps/campo/campo-data.js"],
  ["Conti (dati)", "apps/conti/conti-data.js"],
  ["Flotta (dati)", "apps/flotta/flotta-data.js"],
  ["Scudo (dati)", "apps/scudo/scudo-data.js"],
  ["Sentinella (dati)", "apps/sentinella/sentinella-data.js"],
  ["Terra (dati)", "apps/terra/terra-data.js"],
];

const leggi = (rel) => { try { return readFileSync(join(root, rel), "utf8"); } catch { return null; } };

// I dialoghi vietati compaiono di proposito DENTRO I COMMENTI, che spiegano
// perché sono stati mandati via: bisogna saper distinguere il commento dal
// codice.
//
// ⚠️ NON si fa con `replace(/\/\*[\s\S]*?\*\//g, '')`. L'ho provato e sembrava
// funzionare: tutte le superfici passavano. Poi la controprova — rimettere un
// `window.prompt()` nel core e pretendere che il controllo fallisse — è passata
// anche quella, e allora si è visto perché: il core passava da 537.000 a
// 137.000 caratteri. Nel codice ci sono `/*` e `*/` dentro stringhe ed
// espressioni regolari, quindi l'accoppiamento non greedy legava i delimitatori
// sbagliati e cancellava 400.000 caratteri di codice VIVO. Il controllo diceva
// «nessuna violazione» perché non stava guardando quasi niente: la stessa
// trappola dei test inerti che dicono «0 falliti».
//
// Quindi si scorre il testo una volta e si segna, carattere per carattere, se
// si è dentro un commento, una stringa o un'espressione regolare.
function mascheraCodice(t) {
  const vivo = new Uint8Array(t.length);   // 1 = codice vero
  let i = 0;
  const prevSignificativo = (k) => { for (let j = k - 1; j >= 0; j--) { const c = t[j]; if (c !== " " && c !== "\t" && c !== "\n" && c !== "\r") return c; } return ""; };
  while (i < t.length) {
    const c = t[i], d = t[i + 1];
    if (c === "/" && d === "/") { while (i < t.length && t[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i += 2; while (i < t.length && !(t[i] === "*" && t[i + 1] === "/")) i++; i += 2; continue; }
    if (c === "<" && t.startsWith("<!--", i)) { i += 4; while (i < t.length && !t.startsWith("-->", i)) i++; i += 3; continue; }
    if (c === "'" || c === '"' || c === "`") {
      vivo[i] = 1; i++;
      while (i < t.length) { if (t[i] === "\\") { i += 2; continue; } if (t[i] === c) { i++; break; } i++; }
      continue;
    }
    // un'espressione regolare comincia con / solo dove non può stare una divisione
    if (c === "/" && "(,=:[!&|?{};\n".includes(prevSignificativo(i))) {
      vivo[i] = 1; i++;
      let inClasse = false;
      while (i < t.length) {
        if (t[i] === "\\") { i += 2; continue; }
        if (t[i] === "[") inClasse = true;
        else if (t[i] === "]") inClasse = false;
        else if (t[i] === "/" && !inClasse) { i++; break; }
        else if (t[i] === "\n") break;
        i++;
      }
      continue;
    }
    vivo[i] = 1; i++;
  }
  return vivo;
}

// Il complemento di `mascheraCodice`: quello maschera il CONTENUTO delle
// stringhe, giusto per i dialoghi (un `prompt(` dentro una stringa non è una
// chiamata). Ma il testo che l'utente LEGGE vive proprio nelle stringhe, quindi
// per le regole sui testi serve l'opposto: via i commenti, resta tutto il resto.
// Scritto con la stessa scansione carattere per carattere, per la stessa ragione:
// un'espressione regolare sui commenti taglierebbe 400.000 caratteri di codice
// vivo, come è già successo.
function senzaCommenti(t) {
  let out = "", i = 0;
  const prevSignificativo = (k) => { for (let j = k - 1; j >= 0; j--) { const c = t[j]; if (c !== " " && c !== "\t" && c !== "\n" && c !== "\r") return c; } return ""; };
  while (i < t.length) {
    const c = t[i], d = t[i + 1];
    if (c === "/" && d === "/") { while (i < t.length && t[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i += 2; while (i < t.length && !(t[i] === "*" && t[i + 1] === "/")) i++; i += 2; continue; }
    if (c === "<" && t.startsWith("<!--", i)) { i += 4; while (i < t.length && !t.startsWith("-->", i)) i++; i += 3; continue; }
    if (c === "'" || c === '"' || c === "`") {
      out += c; i++;
      while (i < t.length) { if (t[i] === "\\") { out += t[i] + (t[i + 1] || ""); i += 2; continue; } out += t[i]; if (t[i] === c) { i++; break; } i++; }
      continue;
    }
    if (c === "/" && "(,=:[!&|?{};\n".includes(prevSignificativo(i))) {
      out += c; i++;
      let inClasse = false;
      while (i < t.length) {
        if (t[i] === "\\") { out += t[i] + (t[i + 1] || ""); i += 2; continue; }
        if (t[i] === "[") inClasse = true; else if (t[i] === "]") inClasse = false;
        else if (t[i] === "/" && !inClasse) { out += t[i]; i++; break; }
        else if (t[i] === "\n") break;
        out += t[i]; i++;
      }
      continue;
    }
    out += c; i++;
  }
  return out;
}

// `deferredPrompt.prompt()` è l'API di installazione della PWA, non un dialogo:
// si riconosce perché ha un oggetto davanti. Cerchiamo la chiamata NUDA.
//
// MA `window.` va contato: il core scriveva proprio `window.prompt('Distanza
// reale…')`. La prima versione di questo controllo escludeva tutto ciò che
// aveva un punto davanti, quindi si sarebbe lasciata sfuggire esattamente la
// violazione che avevo appena corretto. L'ha scoperto il controllo del
// controllo qui sotto, ed è la ragione per cui esiste.
const DIALOGHI = /(alert|confirm|prompt)\s*\(/g;

function dialoghiIn(testo) {
  const vivo = mascheraCodice(testo);
  const fuori = [];
  let m;
  DIALOGHI.lastIndex = 0;
  while ((m = DIALOGHI.exec(testo)) !== null) {
    const at = m.index;
    if (!vivo[at]) continue;                       // sta in un commento o in una stringa
    // cosa c'è davanti al nome: se è un punto è il metodo di un oggetto —
    // `deferredPrompt.prompt()` è l'API della PWA, non un dialogo. Ma
    // `window.prompt(` sì: il core scriveva proprio così, e la prima versione
    // di questo controllo se lo lasciava sfuggire.
    const prima = testo.slice(Math.max(0, at - 40), at);
    if (/\.\s*$/.test(prima) && !/\b(?:window|globalThis|self)\s*\.\s*$/.test(prima)) continue;
    if (/[\w$]$/.test(prima)) continue;            // parte di un identificatore più lungo
    const riga = testo.slice(0, at).split("\n").length;
    const testoRiga = (testo.split("\n")[riga - 1] || "").trim().slice(0, 90);
    fuori.push({ riga, quale: m[1], testo: testoRiga });
  }
  return fuori;
}

console.log("\n── Regola 1: niente dialoghi del browser ──");
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  const src = leggi(rel);
  if (src === null) continue;                      // superficie non ancora esistente
  test(`${nome}: nessun alert/confirm/prompt del browser`, () => {
    const v = dialoghiIn(src);
    ok(v.length === 0, `${rel} — ${v.map(x => `riga ${x.riga}: ${x.quale}() « ${x.testo} »`).join(" | ")}`);
  });
}
// Il controllo del controllo. Non è pedanteria: la prima versione passava su
// tutte le superfici E passava anche con un `window.prompt()` rimesso a mano
// nel core. Un controllo che non sa fallire non sta controllando niente.
test("il controllo si accorge dei dialoghi veri", () => {
  ok(dialoghiIn("function x(){ if(confirm('sicuro?')) fai(); }").length === 1, "confirm() nudo");
  ok(dialoghiIn("window.prompt('x')").length === 1, "window.prompt");
  ok(dialoghiIn("  alert('ciao');").length === 1, "alert indentato");
  ok(dialoghiIn("if(!confirm('x'))return;").length === 1, "confirm dentro una condizione");
  ok(dialoghiIn("globalThis.confirm('x')").length === 1, "globalThis.confirm");
});
test("il controllo non accusa quello che non è un dialogo", () => {
  ok(dialoghiIn("/* qui c'era confirm('x') */ nulla();").length === 0, "dentro un commento a blocco");
  ok(dialoghiIn("// vecchio: alert('ciao')").length === 0, "dentro un commento di riga");
  ok(dialoghiIn("deferredPrompt.prompt();").length === 0, "l'API della PWA non è un dialogo");
  ok(dialoghiIn("const s = 'usa confirm(x) invece';").length === 0, "dentro una stringa");
  ok(dialoghiIn("miaConferma('x'); reconfirm('y');").length === 0, "nomi che finiscono uguale");
  ok(dialoghiIn("obj.alert('x');").length === 0, "un metodo di un altro oggetto");
});
// La controprova che vale più di tutte: si rimette un dialogo DENTRO I FILE
// VERI e si pretende che il controllo lo trovi. È così che ho scoperto che la
// prima versione non funzionava — passava su tutte le superfici e passava anche
// col dialogo rimesso, perché il taglio dei commenti a espressioni regolari
// cancellava 400.000 caratteri di codice vivo (`/*` e `*/` compaiono anche
// dentro stringhe e regex, e l'accoppiamento non greedy legava i delimitatori
// sbagliati). Una prova che non sa fallire sul difetto non dimostra niente.
for (const [nome, rel, ancora] of [
  ["core", "index.html", "function reconCalibra("],
  ["Genesi", "apps/genesi/genesi.html", "function salvaVolata("],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html", "async (...a) => {"],
]) {
  test(`controprova su ${nome}: un dialogo rimesso a mano viene trovato`, () => {
    const src = leggi(rel);
    ok(src, `${rel} non trovato`);
    ok(src.includes(ancora), `l'ancora « ${ancora} » non c'è più in ${rel}: aggiornare la controprova`);
    ok(dialoghiIn(src).length === 0, `${rel} parte pulito`);
    for (const veleno of ["window.prompt('x');", "if(!confirm('x'))return;", "alert('x');"]) {
      const rotto = src.replace(ancora, veleno + " " + ancora);
      const trovati = dialoghiIn(rotto);
      ok(trovati.length === 1,
        `« ${veleno} » iniettato in ${rel} non è stato trovato (trovati ${trovati.length}) — il controllo non sta guardando il codice`);
    }
  });
}
test("un `/*` dentro un'espressione regolare non apre un commento", () => {
  const insidia = "const re = /\\/\\*/; confirm('mi devi trovare');";
  ok(dialoghiIn(insidia).length === 1, "il confirm dopo la regex deve essere trovato");
});

console.log("\n── Regola 2: le unità di misura non vanno in maiuscolo ──");
test("il motore dei grafici avvolge le unità in .dwg-u", () => {
  const js = leggi("shared/dw-grafici.js");
  ok(js, "shared/dw-grafici.js non trovato");
  ok(/function\s+testoConUnita/.test(js), "manca testoConUnita: era il meccanismo che sottrae l'unità al maiuscolo");
  ok(/'dwg-axlab dwg-u'/.test(js), "l'etichetta d'asse deve portare .dwg-u: contiene SOLO l'unità");
  ok(/function\s+paiUnita/.test(js), "manca paiUnita, il riconoscimento di cosa è un'unità");
});
test(".dwg-u spegne il maiuscolo, nel foglio condiviso", () => {
  const css = leggi("shared/dw-grafici.css");
  ok(css, "shared/dw-grafici.css non trovato");
  const blocco = css.match(/\.dwg-u[^{]*\{[^}]*\}/);
  ok(blocco, "manca la regola per .dwg-u");
  ok(/text-transform:\s*none/.test(blocco[0]), `.dwg-u deve togliere il maiuscolo — trovato: ${blocco[0]}`);
});
test("nessuna app rimette una toppa locale sui grafici", () => {
  // Una toppa come `.dwg-tab thead th{text-transform:none}` corregge l'unità
  // ma spegne il maiuscolo anche a «Voce» e «Quota», cioè allontana la tabella
  // dal core: la struttura deve restare identica al riferimento.
  const colpevoli = [];
  for (const [nome, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null) continue;
    const re = /\.(dwg-axlab|dwg-tab\s+thead\s+th|dwg-title)\s*\{[^}]*text-transform\s*:\s*none/g;
    if (re.test(src)) colpevoli.push(`${nome} (${rel})`);
  }
  ok(colpevoli.length === 0,
    `la correzione sta in shared/, non nelle app: ${colpevoli.join(", ")}`);
});
test("paiUnita non prende una data per un'unità", async () => {
  // «Cavato e venduto — 01/01/2026 – 31/12/2026» finisce con una data, e la
  // barra la faceva sembrare `l/h`. Le due esclusioni imparate su titoli veri.
  const js = leggi("shared/dw-grafici.js");
  ok(/\[0-9\]/.test(js) || /0-9/.test(js), "manca l'esclusione delle cifre: una data non è un'unità");
  ok(/coda\.length\s*>\s*8/.test(js), "manca il limite di lunghezza: oltre 8 caratteri è una parola, non un'unità");
});

console.log("\n── Regola 3: un campo decimale non è mai type=number ──");
// Misurato in Chromium: in un `<input type="number">`, digitando «2,4» da
// tastiera il `.value` diventa «24» e `checkValidity()` risponde true. Il
// browser scarta la virgola, tiene le cifre e chiama valido un numero dieci
// volte più grande — e in cava chi compila scrive la virgola. Su una carica di
// esplosivo, su un imponibile o su una coordinata GPS è il difetto peggiore
// della piattaforma, perché è silenzioso.
// Un campo decimale si dichiara tale in DUE modi, e questa regola all'inizio
// guardava solo il primo — per questo passava mentre nel core ne restavano 34
// dello stesso difetto, nella stessa schermata dei 32 corretti:
//   1. `step` frazionario (step="0.1"): la firma classica;
//   2. `inputmode="decimal"`: il campo dichiara la tastiera decimale sul
//      telefono, quindi si aspetta un numero con la virgola — e allora
//      `type="number"` è un difetto anche senza step, perché lo step assente
//      vale 1 e il browser rifiuta i decimali oltre a scartare la virgola.
// Il caso 2 era il peggiore proprio perché sembrava già a posto: fra quei 34
// c'erano il diametro del foro, la spalla del calcolatore di carica e i
// parametri di Kuz-Ram, dove «3,5» diventava 35.
const APP_SEI = SUPERFICI.filter(([n]) => !/core|Deepwork ID/.test(n));
function numeriDecimali(src) {
  const fuori = [];
  const tag = /<input\b[^>]*>/gi;
  let m;
  while ((m = tag.exec(src)) !== null) {
    const t = m[0];
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    const perStep = st != null && st[1].includes(".");
    const perInputmode = /inputmode="decimal"/.test(t);
    if (!perStep && !perInputmode) continue;        // campo intero: va bene così
    const id = /id="([^"]*)"/.exec(t);
    fuori.push({ id: id ? id[1] : "(senza id)", perche: perStep ? "step " + st[1] : 'inputmode="decimal"' });
  }
  return fuori;
}
for (const [nome, rel] of APP_SEI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale è rimasto type=number`, () => {
    const v = numeriDecimali(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
  });
}
test("il controllo si accorge di un campo decimale rimesso a type=number", () => {
  ok(numeriDecimali('<input id="x" type="number" step="0.1">').length === 1, "step frazionario trovato");
  // la seconda firma: dichiarato decimale dall'inputmode, senza step. È quella
  // che la regola non guardava, e che nel core lasciava passare 34 campi.
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal">').length === 1, "inputmode=decimal su type=number trovato");
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal" step="1">').length === 1, 'step="1" non assolve: la percentuale 12,5 resta vietata');
  ok(numeriDecimali('<input id="x" type="number" step="1">').length === 0, "un campo intero non è un difetto");
  ok(numeriDecimali('<input id="x" type="number" inputmode="numeric">').length === 0, "un intero che dichiara la tastiera intera va bene");
  ok(numeriDecimali('<input id="x" type="text" inputmode="decimal" step="0.1">').length === 0, "convertito: a posto");
  // controprova sui file veri: si rimette il difetto e il controllo deve vederlo
  for (const [nome, rel] of [["Campo", "apps/campo/index.html"], ["Genesi", "apps/genesi/genesi.html"]]) {
    const src = leggi(rel);
    if (!src) continue;
    ok(numeriDecimali(src).length === 0, `${nome} parte pulito`);
    for (const veleno of ['<input id="veleno" type="number" step="0.1">',
                         '<input id="veleno" type="number" inputmode="decimal">']) {
      const rotto = src.replace('<input', veleno + '<input');
      ok(numeriDecimali(rotto).length === 1, `${nome}: il difetto iniettato viene trovato (${veleno})`);
    }
  }
});
// IL CORE è convertito anche lui, in due passaggi perché la regola all'inizio
// vedeva metà del difetto: prima i 32 campi con lo step frazionario — fra cui le
// COORDINATE GPS della cava (`cf-lat`/`cf-lon`, dove «37,0625» diventava
// 370625) e i parametri di volata (`a-b` spalla, `a-s` interasse, `a-mh`
// carica massima per ritardo, `a-pm` consumo specifico) — poi altri 34 che si
// dichiaravano decimali col solo `inputmode`, fra cui il diametro del foro, la
// spalla del calcolatore di carica e i parametri di Kuz-Ram.
// Adesso la regola vale su TUTTA la piattaforma, core compreso: non c'è più
// nessuna superficie esentata.
test("core: nessun campo decimale è rimasto type=number", () => {
  const v = numeriDecimali(leggi("index.html") || "");
  ok(v.length === 0,
    `index.html — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
});
test("e i campi INTERI del core sono rimasti type=number", () => {
  // La conversione deve riguardare SOLO i decimali: sugli interi (anno, km,
  // numero di fori) lo spinner del browser serve, e mezzo foro non esiste.
  //
  // ⚠️ Qui prima c'era `ok(n === 53)`, il conteggio del giorno in cui l'ho
  // scritto. Era una trappola: quando si è scoperto che 34 di quei 53 non erano
  // interi ma decimali travestiti, il test ha accusato la correzione invece del
  // difetto. Un conteggio inchiodato scambia il progresso per una regressione.
  // Adesso il controllo guarda la NATURA dei campi, che è ciò che la regola
  // dice davvero: ogni campo rimasto `type=number` deve essere un intero.
  const src = leggi("index.html") || "";
  const rimasti = (src.match(/<input\b[^>]*type="number"[^>]*>/g) || []);
  ok(rimasti.length > 0, "nel core non c'è più nessun campo intero: la conversione ha preso troppo");
  const sospetti = rimasti.filter((t) => {
    if (/inputmode="decimal"/.test(t)) return true;             // si dichiara decimale
    const st = /step="([^"]*)"/.exec(t);
    return st != null && st[1].includes(".");                   // step frazionario
  });
  ok(sospetti.length === 0,
    `campi ancora type=number ma dichiarati decimali: ${sospetti.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
  // e nessuno degli interi rimasti deve dichiarare la tastiera decimale
  const tastiera = rimasti.filter((t) => /inputmode="(?!numeric)/.test(t));
  ok(tastiera.length === 0,
    `interi con la tastiera sbagliata: ${tastiera.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
});

console.log("\n── Regola 4: un numero che non si capisce non diventa zero ──");
// Cambiare il tipo del campo era metà del lavoro: l'altra metà è chi lo legge.
// Nel core 17 campi decimali passavano da `parseNum0`, che di ciò che non
// capisce fa ZERO — un costo di riparazione a zero, ore di lavoro a zero, litri
// di gasolio a zero. Zero non è «non lo so»: è una misura, ed è sbagliata, e
// finisce dentro somme e medie senza lasciare traccia.
// Adesso quei campi passano da `numDetto` (che lo dice e blocca il salvataggio)
// o da `numDaCampo` (che restituisce null, per i dati facoltativi).
function decimaliLettiConZero(src) {
  const ids = new Set();
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/inputmode="decimal"/.test(t)) continue;
    const id = /id="([^"]*)"/.exec(t);
    // gli id costruiti dentro un template (`id="f-${i}"`) non si possono cercare
    if (id && id[1] && !id[1].includes("$")) ids.add(id[1]);
  }
  const fuori = [];
  for (const id of ids) {
    // `parseNum0($('co-gas').value)` e `parseNum0($('r-d2')?.value)`
    const re = new RegExp("parseNum0\\(\\s*\\$\\(\\s*['\"]" + id.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") + "['\"]\\s*\\)\\??\\.value", "g");
    const n = (src.match(re) || []).length;
    if (n) fuori.push({ id, quante: n });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale si legge con parseNum0`, () => {
    const v = decimaliLettiConZero(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.quante}×)`).join(", ")}: di ciò che non capisce fa zero, e zero è una misura`);
  });
}
test("il controllo si accorge di una lettura rimessa a parseNum0", () => {
  const finto = `<input type="text" inputmode="decimal" id="costo">`;
  ok(decimaliLettiConZero(finto).length === 0, "senza letture non c'è violazione");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo').value);`).length === 1, "la lettura con zero viene trovata");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo')?.value);`).length === 1, "anche con l'accesso prudente");
  ok(decimaliLettiConZero(finto + `x=numDetto('costo','il costo');`).length === 0, "il lettore che parla va bene");
  ok(decimaliLettiConZero(`<input type="number" id="anno">x=parseNum0($('anno').value);`).length === 0,
    "su un campo INTERO parseNum0 non è un difetto: lì lo zero è un numero come un altro");
  // controprova sul file vero: si rimette il difetto e il controllo deve vederlo
  const core = leggi("index.html");
  if (core) {
    ok(decimaliLettiConZero(core).length === 0, "il core parte pulito");
    const rotto = core.replace("</body>", "<script>x=parseNum0($('co-gas').value);</script></body>");
    ok(decimaliLettiConZero(rotto).length === 1, "il difetto iniettato nel core viene trovato");
  }
});

console.log("\n── Regola 7: la provenienza di un rilievo si decide in un posto solo ──");
// Un rilievo di CUMULO è materiale già estratto e NON consuma il volume
// concesso; uno di SCAVO sì. La regola era scritta due volte — in Terra come
// `provenienzaRilievo` e in Conti come `eCumulo`, con un commento che dichiarava
// di essere «la stessa regola di Terra», cioè una divergenza in attesa. Adesso la
// sorgente è `provenienzaDi` in `shared/dw-ponti.js`.
// Perché vale un controllo automatico: se una copia divergesse, il materiale
// tolto anni fa comincerebbe a consumare la concessione (o il contrario) e il
// difetto non si vedrebbe da nessuna parte — nessun errore, nessun test rosso,
// solo un numero sbagliato in un documento che va all'ente.
//
// ⚠️ COSA cerca questa regola, perché la prima versione cercava la cosa
// sbagliata: NON è vietato confrontare con «cumulo» — `provenienzaDi(r) ===
// "cumulo"` è l'uso normale e inevitabile, e la prima versione lo segnalava in
// tre punti legittimi (fra cui `soloCumulo` di Terra). È vietato **ricavare la
// provenienza dal record grezzo**: leggere `.provenienza` e deciderlo in casa,
// che è esattamente com'erano nate le due copie.
const RICAVA = /\.provenienza\b/;
function ricavaProvenienza(src) {
  const vivo = mascheraCodice(src);
  const fuori = [];
  const re = new RegExp(RICAVA.source, "g");
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!vivo[m.index]) continue;                 // in un commento non decide niente
    // legittimo dove si SCRIVE il campo o lo si passa a `provenienzaDi`; sospetto
    // dove nella stessa espressione compare la parola «cumulo»
    const intorno = src.slice(Math.max(0, m.index - 120), m.index + 120);
    if (!/cumulo/i.test(intorno)) continue;
    if (/provenienzaDi\s*\(/.test(intorno)) continue;
    fuori.push({ riga: src.slice(0, m.index).split("\n").length, testo: intorno.replace(/\s+/g, " ").slice(60, 170) });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  if (rel === "shared/dw-ponti.js") continue;     // è la sorgente della regola
  const src = leggi(rel);
  if (src === null) continue;
  const v = ricavaProvenienza(src);
  if (!v.length && !/provenienza/.test(src)) continue;   // il file non c'entra
  test(`${nome}: non ricava la provenienza dal record grezzo`, () => {
    ok(v.length === 0,
      `${rel} — riga ${v.map((x) => x.riga).join(", ")}: la regola vive in shared/dw-ponti.js (provenienzaDi)`);
  });
}
test("il controllo distingue la copia dall'uso normale", () => {
  const copia = 'const eCumulo = (r) => String((r && r.provenienza) || "").toLowerCase() === "cumulo";';
  ok(ricavaProvenienza(copia).length === 1, "una copia che ricava dal record grezzo viene vista");
  ok(ricavaProvenienza('const cum = provenienzaDi(r) === "cumulo";').length === 0,
    "confrontare il risultato della funzione condivisa è l'uso NORMALE, non una violazione");
  ok(ricavaProvenienza('provenienza: provenienzaDi({ provenienza }),').length === 0,
    "e passarle il campo grezzo per farselo normalizzare va bene");
  ok(ricavaProvenienza('// qui si leggeva r.provenienza e si confrontava con "cumulo"').length === 0,
    "la stessa cosa raccontata in un commento non è una violazione");
  ok(ricavaProvenienza('r.provenienza = "scavo";').length === 0,
    "e scrivere il campo non è deciderne il significato");
});

console.log("\n── Regola 6: il ponte con Terra non dà la colpa a chi compila ──");
// Decisione presa PRIMA di scrivere il codice, e messa qui perché è il tipo di
// cosa che si perde riscrivendo un testo: quando la produzione dichiarata dai
// turni non torna col rilievo del drone, Campo NON deve dare la colpa a chi ha
// stimato. Se dicesse «le tue stime erano gonfie», la conseguenza prevedibile è
// che i turni comincino a scrivere numeri prudenti invece di numeri veri, e il
// dato peggiora proprio dove serve. Il testo deve nominare ENTRAMBE le
// spiegazioni possibili, compresa quella che non riguarda i turni.
test("Campo: quando i numeri non tornano, il testo nomina entrambe le spiegazioni", () => {
  const src = leggi("apps/campo/index.html") || "";
  ok(/rap-terra/.test(src), "la sezione del ponte con Terra c'è");
  ok(/stima di turno/.test(src), "il testo nomina la stima di turno come possibile causa");
  ok(/volo che non ha coperto/.test(src),
    "e nomina anche il volo che non copre tutto lo scavo: senza, lo scarto ricade tutto sui turni");
  // ⚠️ Le frasi vietate compaiono di PROPOSITO nei commenti, che spiegano perché
  // sono vietate — la stessa situazione della regola sui dialoghi del browser, e
  // la prima versione di questo controllo è caduta proprio lì, segnalando il
  // commento che documentava la decisione. Si guarda solo il codice VIVO, con lo
  // stesso tokenizzatore.
  // il testo mostrato vive nelle stringhe, quindi si tolgono solo i commenti:
  // `mascheraCodice` maschererebbe proprio il contenuto che qui va guardato
  const testo = senzaCommenti(src);
  const nelVivo = (frase) => new RegExp(frase, "i").test(testo);
  for (const accusa of ["le tue stime", "hai stimato", "gonfiat", "per colpa"]) {
    ok(!nelVivo(accusa), `il testo mostrato non usa «${accusa}»: un rimprovero fa scrivere numeri prudenti, non veri`);
  }
  // il controllo del controllo: la frase iniettata nel codice vivo deve essere vista
  ok(nelVivo("stima di turno"), "e il controllo sa vedere una frase che sta davvero nel testo");
});

console.log("\n── Regola 5: dove ci sono campi interi, la guardia è montata ──");
// I campi decimali sono diventati campi di testo; gli INTERI restano
// `type="number"` di proposito, perché lì lo spinner serve. Ma questo lascia al
// browser l'ultima parola sulla virgola, e misurato in Chromium «1,5» diventa
// «15» con `checkValidity()` che risponde **true**: leggere la validità non
// basta, il numero è già stato distrutto e dichiarato buono. Serve la guardia
// su `beforeinput`, e sta in `shared/` una volta sola.
// Questa regola non prova il MECCANISMO (quello si prova col browser, con tasti
// veri): prova che nessuna superficie con campi interi si dimentichi di
// montarla, che è la cosa che si perde aggiungendo una pagina.
function campiInteri(src) {
  let n = 0;
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    if (st && st[1].includes(".")) continue;
    if (/inputmode="decimal"/.test(t)) continue;
    n++;
  }
  return n;
}
const montaGuardia = (src) => /montaGuardiaInteri\s*\(/.test(src);
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const n = campiInteri(src);
  if (!n) continue;
  test(`${nome}: ${n} campi interi, e la guardia è montata`, () => {
    ok(montaGuardia(src),
      `${rel} ha ${n} campi interi ma non chiama montaGuardiaInteri: su quei campi «1,5» diventa 15 in silenzio`);
  });
}
test("la guardia condivisa esiste e distingue interi da decimali", () => {
  const shell = leggi("shared/deepwork-id-client/dw-shell.js") || "";
  ok(/export function montaGuardiaInteri/.test(shell), "montaGuardiaInteri è esportata da shared/");
  ok(/export function eCampoIntero/.test(shell), "e il riconoscimento del campo intero è a parte, provabile");
  ok(/beforeinput/.test(shell), "si attacca a beforeinput, dove il carattere si può ancora rifiutare");
  // il controllo del controllo: una superficie con campi interi e senza guardia
  // deve fallire
  const finto = '<input type="number" id="fori">';
  ok(campiInteri(finto) === 1 && !montaGuardia(finto), "il difetto iniettato viene visto");
  ok(campiInteri('<input type="number" step="0.1">') === 0, "un decimale non è un campo intero");
  ok(campiInteri('<input type="number" inputmode="decimal">') === 0, "e nemmeno uno dichiarato dall'inputmode");
  ok(campiInteri('<input type="text" inputmode="numeric">') === 0, "un campo di testo non ha bisogno della guardia");
});

console.log("\n── Regola 10: uno stato vuoto con un titolo ha anche una spiegazione ──");
// Trovato aprendo il core per la prima volta in locale: tredici stati vuoti
// mostravano icona e titolo e basta — «Nessun mezzo da lavoro» su uno schermo
// per il resto nero. È la schermata che una cava nuova vede il primo giorno, e
// non diceva né che cosa fare né di chi fosse il compito. Le sei app, che dal
// core hanno copiato tutto, su questo erano più ricche del loro riferimento.
// Non riguarda i segnaposto brevi dentro le schede («Nessun file»), fatti
// apposta di sola spiegazione: si guarda chi ha un TITOLO.
function vuotiSenzaSpiegazione(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  const re = /empty-title/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 500);
    if (!/empty-sub/.test(finestra)) {
      const t = /empty-title[^>]*>([^<]{0,60})/.exec(finestra);
      fuori.push((t && t[1].trim()) || "(titolo dinamico)");
    }
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const muti = vuotiSenzaSpiegazione(src);
  test(`${nome}: ogni stato vuoto con titolo dice anche cosa fare`, () => {
    ok(muti.length === 0,
      `${rel}: ${muti.length} stati vuoti mostrano solo il titolo (${muti.slice(0, 4).join(" · ")}): ` +
      `chi apre l'app il primo giorno non capisce se il vuoto dipende da lui`);
  });
}
test("la regola 10 sa vedere il difetto che è stato tolto", () => {
  const difetto = '<div class="empty-state"><div class="empty-icon">🚜</div>' +
    '<div class="empty-title">Nessun mezzo da lavoro</div></div>';
  const messo = difetto.replace("</div></div>", '</div><div class="empty-sub">Aggiungilo col ＋.</div></div>');
  ok(vuotiSenzaSpiegazione(difetto).length === 1, "lo stato vuoto muto viene visto");
  ok(vuotiSenzaSpiegazione(messo).length === 0, "e quello che spiega no");
  ok(vuotiSenzaSpiegazione('<div class="empty-state"><div class="empty-sub">Nessun file</div></div>').length === 0,
    "il segnaposto breve dentro una scheda non è una violazione");
});

console.log("\n── Regola 9: nessuna superficie si riscrive in casa la regola degli interi ──");
// Trovata dal vero, digitando: in Terra «1.500» diventava «500». Terra aveva la
// sua copia della stessa regola, scritta prima che la guardia vivesse in
// `shared/`, e con un comportamento DIVERSO — oltre a rifiutare il separatore
// svuotava il campo. Montate tutte e due, il «1» spariva e restava «500»: un
// numero plausibile e sbagliato, cioè proprio quello che lo svuotamento voleva
// evitare. La guardia condivisa, da sola, in quel caso dà 1500.
// La regola vincolante del progetto dice che una regola che serve a due app vive
// in `shared/` e non si riscrive; questa la rende verificabile.
// Cosa si cerca: un ascoltatore `beforeinput` che, fuori da `shared/`, guarda i
// separatori decimali. Il testo si prende senza commenti (i commenti PARLANO di
// beforeinput, e non sono codice), non mascherato, perché qui interessa il
// codice vero e le espressioni regolari ci vivono dentro.
function guardieInCasa(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  // FINESTRA A LUNGHEZZA FISSA, non un'espressione regolare che «arriva fino
  // alla parentesi»: la prima versione era `[\s\S]{0,400}?\)`, e il non greedy
  // si fermava alla parentesi di `(e)`, tre caratteri dopo. Guardava un pezzo
  // in cui la virgola non poteva esserci, quindi non trovava niente su nessuna
  // superficie — e i controlli passavano a vuoto. L'ha detto la controprova.
  const re = /addEventListener\(\s*["']beforeinput["']/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 400);
    if (/\[\.,\]|\[,\.\]|\bvirgola\b/.test(finestra)) fuori.push(finestra.slice(0, 90).replace(/\s+/g, " "));
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const suoi = guardieInCasa(src);
  test(`${nome}: la regola degli interi non è riscritta in casa`, () => {
    ok(suoi.length === 0,
      `${rel} intercetta beforeinput sui separatori per conto proprio (${suoi.length}): ` +
      `la regola sta in shared/, e due copie con comportamenti diversi si pestano i piedi — ${suoi[0] || ""}`);
  });
}
test("la regola 9 sa vedere il difetto che è stato tolto", () => {
  // il codice VERO che stava in Terra, rimesso qui dentro: se il controllo non
  // lo vede, non sta guardando dove crede
  const difetto = `el.addEventListener("beforeinput", (e) => {
      if (!e.data || !/[.,]/.test(e.data)) return;
      e.preventDefault(); el.value = ""; });`;
  ok(guardieInCasa(difetto).length === 1, "la copia locale che svuotava il campo viene vista");
  ok(guardieInCasa('// qui una volta c\'era un addEventListener("beforeinput") con la virgola').length === 0,
    "un commento che ne parla non è una violazione");
  ok(guardieInCasa('document.addEventListener("beforeinput", (ev) => { registra(ev); });').length === 0,
    "un beforeinput che non guarda i separatori non c'entra");
});

/* ══════════════════════════════════════════════════════════════════════
   REGOLA 8 · UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE
   ══════════════════════════════════════════════════════════════════════
   `class="note avviso"` in un'app che non ha `.note.avviso` non è un errore per
   nessuno: il browser non protesta, la pagina si apre, e la nota si vede — solo
   che si vede NEUTRA dove il codice diceva «attenzione». Trovato dal vero: la
   regola esisteva in Terra e in Sentinella, e in Campo e Scudo no, quindi tre
   note d'avviso rendevano come note qualunque.
   Si guardano i modificatori della famiglia `note`, che è quella che porta il
   SIGNIFICATO (recap, avviso, esito, err): una classe che dice come leggere il
   testo e non fa niente è peggio di nessuna classe, perché chi scrive crede di
   averlo detto. */
const MODIFICATORI_NOTA = /class="note ([a-z][a-z-]*)"/g;
/* COSA CONTA COME «DEFINITA», imparato sbagliando due volte in una:
   · `.note.esito.err{…}` definisce `esito` quanto `.note.esito{…}` — la prima
     versione cercava solo la parentesi subito dopo e dichiarava orfane 54 note;
   · `.prescr{…}` da sola vale: una classe può portare stile senza passare da
     `.note`, e pretendere il prefisso sarebbe una regola inventata da me;
   · i fogli di `shared/` si leggono TUTTI. Elencarne tre a mano ha nascosto
     `dw-app-ui.css`, che è proprio quello che definisce `.note.esito`.
   È la solita lezione: una prova sbagliata che accusa il codice costa più di
   nessuna prova. */
/* i fogli di shared/ si LEGGONO, non si elencano: scriverne cinque a mano è come
   ho appena nascosto `dw-app-ui.css`, e la volta dopo si nasconderebbe quello nuovo */
const CSS_CONDIVISI = readdirSync(join(root, "shared"))
  .filter((f) => f.endsWith(".css")).map((f) => "shared/" + f);
function classiDefinite(css, dentro) {
  /* SI RACCOLGONO TUTTI I NOMI DI CLASSE che compaiono nel CSS, senza provare a
     capire se sono in posizione di selettore. Ci ho provato tre volte con uno
     sguardo all'indietro e ho sbagliato tre volte — l'ultima su `.note.vera`,
     dove il carattere che precede è una lettera, non un delimitatore.
     Raccogliere in più è il verso GIUSTO in cui sbagliare: al massimo questa
     regola lascia passare un'orfana, mentre raccogliere in meno ACCUSA il codice
     di un difetto che non ha — ed è già costato tre giri qui sopra.
     Si guarda solo dentro il CSS: per un file HTML, i blocchi <style>. */
  for (const m of css.matchAll(/\.(-?[a-z][a-z0-9-]*)/g)) dentro.add(m[1]);
}
function soloCss(src, rel) {
  if (rel.endsWith(".css")) return src;
  return [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
}
function noteSenzaStile(src, rel = "x.html") {
  const definiti = new Set();
  classiDefinite(soloCss(src, rel), definiti);
  for (const f of CSS_CONDIVISI) {
    const css = leggi(f);
    if (css) classiDefinite(css, definiti);
  }
  const usati = new Map();
  for (const m of src.matchAll(MODIFICATORI_NOTA)) {
    if (!definiti.has(m[1])) usati.set(m[1], (usati.get(m[1]) || 0) + 1);
  }
  return [...usati.entries()].map(([cls, n]) => `«note ${cls}» usata ${n} volte e mai definita`);
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const orfane = noteSenzaStile(src, rel);
  test(`${nome}: ogni modificatore di nota ha uno stile`, () => {
    ok(orfane.length === 0,
      `${rel}: ${orfane.join("; ")} — la nota si vede neutra dove il codice diceva altro`);
  });
}
/* ── REGOLA 11: il simbolo dell'euro non si riscrive in casa ─────────────── */
function euroInCasa(src) {
  const fuori = [];
  /* si guarda il CODICE senza commenti: un «€» dentro una spiegazione è
     legittimo, e anche un'etichetta come «Importo €» o l'unità «€/t». Quello
     che si cerca è il simbolo INCOLLATO A UN'ESPRESSIONE — cioè un pezzo di
     formattazione — che è il gesto da cui sono nate le tre forme diverse. */
  const codice = senzaCommenti(src);
  const re = /"\u20AC[\u0020\u00A0]?"\s*\+|\+\s*"\u20AC[\u0020\u00A0]?"/g;
  let m;
  while ((m = re.exec(codice)) !== null) {
    /* ⚠️ LA RIGA SI CERCA NEL SORGENTE VERO, non in quello ripulito. `senzaCommenti`
       toglie righe e quindi sposta la numerazione: la prima versione di questa
       regola indicava la riga 1202 di Conti, dove non c'era niente, mentre il
       difetto stava alla 1259. Un controllo che punta il dito nel posto sbagliato
       fa perdere più tempo di uno che non c'è. */
    const quantesime = codice.slice(0, m.index).split(m[0]).length;
    let pos = -1;
    for (let k = 0; k < quantesime; k++) pos = src.indexOf(m[0], pos + 1);
    const riga = pos < 0 ? "?" : src.slice(0, pos).split("\n").length;
    fuori.push(`riga ${riga}: ${m[0].trim()} — il simbolo si mette con conEuro() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  /* dw-shell è il posto dove la regola VIVE: lì il simbolo ci deve stare */
  if (rel.includes("dw-shell")) continue;
  const casi = euroInCasa(src);
  test(`${nome}: non si scrive in casa il simbolo dell'euro`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 11 sa vedere il difetto che è stato tolto", () => {
  /* le tre forme vere, com'erano scritte nelle tre app prima del 30/07 */
  ok(euroInCasa('const eur = (v) => "\u20AC\u00A0" + NUM2.format(v);').length === 1,
    "la forma di Conti");
  ok(euroInCasa('const eur = (n) => "\u20AC\u0020" + Math.round(n);').length === 1,
    "quella di Terra");
  ok(euroInCasa('return "\u20AC" + n.toLocaleString("it-IT");').length === 1,
    "e quella di Flotta, attaccata");
  ok(euroInCasa('const eur = euro; // \u20AC 48.200,00').length === 0,
    "un commento che mostra il risultato non è una violazione");
  ok(euroInCasa('<label>Importo \u20AC</label>').length === 0,
    "e nemmeno un'etichetta che chiede un importo");
  ok(euroInCasa('{ unita: "\u20AC/t" }').length === 0,
    "né l'unità di misura di un prezzo");
});

test("il controllo delle note sa fallire", () => {
  /* la controprova: una classe inventata dentro una sorgente che non la definisce
     deve essere segnalata, e una definita no */
  ok(noteSenzaStile('<style></style><div class="note inventata">x</div>').length === 1,
    "una classe mai definita viene vista");
  ok(noteSenzaStile('<style>.note.vera{color:red}</style><div class="note vera">x</div>').length === 0,
    "una definita nello stesso file non viene segnalata");
  ok(noteSenzaStile('<style>.note.vera.rossa{color:red}</style><div class="note vera">x</div>').length === 0,
    "e una definita solo in una variante — `.note.vera.rossa` — conta come definita");
  ok(noteSenzaStile('<style>.vera{white-space:pre-wrap}</style><div class="note vera">x</div>').length === 0,
    "e una classe che porta stile per conto suo, senza il prefisso `.note`");
  ok(noteSenzaStile('<style></style><div class="note">x</div>').length === 0,
    "una nota senza modificatore non ha niente da definire");
  /* la controprova del difetto appena tolto: dentro un elenco separato da virgole
     ogni classe conta, anche quelle dopo la prima */
  ok(noteSenzaStile('<style>.top,.nav,.vera,.altro{display:none}</style><div class="note vera">x</div>').length === 0,
    "in un elenco di selettori conta anche una classe che non è la prima");
  /* e una classe scritta SOLO nel markup, mai nel foglio, resta orfana anche se
     la parola compare altrove nel documento: si guarda dentro <style>, non nel testo */
  /* la parola dev'essere INVENTATA: qui c'era «avviso», che il 30/07 è diventata
     una regola di stato vera in `shared/dw-app-ui.css` — e la controprova, che
     legge anche i fogli condivisi, ha smesso di fallire. Una controprova che
     dipende da una parola del prodotto scade quando il prodotto cresce. */
  ok(noteSenzaStile('<style>.altro{color:red}</style><p>fandonia</p><div class="note fandonia">x</div>').length === 1,
    "la parola nel testo non vale come definizione: conta solo il foglio di stile");
});


/* ── REGOLA 12: chi salta i doppioni li cerca anche DENTRO il file ─────────
   Misurato il 31/07: dieci gestori d'importazione su dieci confrontavano ogni
   riga solo con l'elenco caricato all'apertura della pagina — e quell'elenco
   non si aggiorna mentre il file scorre. Due righe uguali nello stesso file
   entravano tutte e due, in tutte e sei le app.

   Non è un caso di scuola: l'export di Scudo scrive una riga per ogni
   scadenza, quindi il file di un lavoratore con tre scadenze lo nomina tre
   volte, e ri-caricarlo faceva comparire tre volte la stessa persona.

   La regola guarda SOLO i gestori che il doppione lo saltano davvero (quelli
   che contano `dup++` o `saltat*++` accanto a un `.some(`): dove i doppioni
   sono leciti — più letture dello stesso sensore, più rapportini nello stesso
   turno — non si pretende niente. E la difesa vale anche se sta nella funzione
   di lettura invece che nel gestore: è il caso dell'anagrafica di Scudo, dove
   `parseLavoratoriCsv` chiama la regola condivisa. Quello che non deve
   succedere è che non ci sia da nessuna parte delle due. */
function corpiImportazione(src) {
  const righe = src.split("\n");
  const fuori = [];
  for (let i = 0; i < righe.length; i++) {
    const m = /\$\("([\w-]*file)"\)\.onchange/.exec(righe[i]);
    if (!m) continue;
    const corpo = [];
    for (let k = i; k < Math.min(i + 45, righe.length); k++) {
      corpo.push(righe[k]);
      if (righe[k] === "  };") break;
    }
    fuori.push({ id: m[1], riga: i + 1, testo: corpo.join("\n") });
  }
  return fuori;
}
function dedupSoloInArchivio(src, modulo) {
  const fuori = [];
  for (const h of corpiImportazione(src)) {
    const salta = /\.some\(/.test(h.testo) && /(dup|saltat\w*)\+\+/.test(h.testo);
    if (!salta) continue;                              // qui i doppioni sono leciti
    if (/senzaDoppioni\(/.test(h.testo)) continue;     // difesa nel gestore
    /* difesa nella funzione di lettura: si guarda IL CORPO di quella funzione,
       non tutto il modulo — «da qualche parte nel file» lascerebbe passare un
       lettore che non la chiama solo perché un altro la chiama. */
    const usata = /(parse\w*Csv)\s*\(/.exec(h.testo);
    if (usata && modulo) {
      const inizio = modulo.indexOf(`export function ${usata[1]}(`);
      if (inizio >= 0) {
        const dopo = modulo.indexOf("\nexport ", inizio + 1);
        const corpoFn = modulo.slice(inizio, dopo < 0 ? modulo.length : dopo);
        if (/senzaDoppioni\(/.test(corpoFn)) continue;
      }
    }
    fuori.push(`riga ${h.riga}: «${h.id}» salta i doppioni ma solo contro l'archivio — manca senzaDoppioni() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  if (!/^apps\/(campo|conti|flotta|scudo|sentinella|terra)\/index\.html$/.test(rel)) continue;
  const src = leggi(rel);
  if (src === null) continue;
  const app = rel.split("/")[1];
  const modulo = leggi(`apps/${app}/${app}-data.js`);
  const casi = dedupSoloInArchivio(src, modulo);
  test(`${nome}: chi salta i doppioni li cerca anche dentro il file`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 12 sa vedere il difetto che è stato tolto", () => {
  /* Il gestore com'era davvero prima del 31/07, in tutte e sei le app. */
  const difetto = [
    '  $("squ-file").onchange = async (e) => {',
    '    const righe = parseSquadreCsv(await file.text());',
    '    let agg = 0, dup = 0;',
    '    for (const r of righe) {',
    '      if (SQU.some(q => q.nome === r.nome)) { dup++; continue; }',
    '      agg++;',
    '    }',
    '  };',
  ].join("\n");
  ok(dedupSoloInArchivio(difetto, null).length === 1, "il gestore di prima è una violazione");
  const corretto = difetto.replace(
    "const righe = parseSquadreCsv(await file.text());",
    "const righe = senzaDoppioni(parseSquadreCsv(await file.text()), x => x.nome);");
  ok(dedupSoloInArchivio(corretto, null).length === 0, "con la difesa nel gestore, no");
  const conModulo = "export function parseSquadreCsv(t) {\n  return senzaDoppioni(righe, x => x.nome);\n}\n";
  ok(dedupSoloInArchivio(difetto, conModulo).length === 0, "e nemmeno con la difesa dentro il lettore");
  /* la difesa dentro un ALTRO lettore non vale */
  const altroLettore = "export function parseAltroCsv(t) {\n  return senzaDoppioni(r, x => x.n);\n}\nexport function parseSquadreCsv(t) {\n  return r;\n}\n";
  ok(dedupSoloInArchivio(difetto, altroLettore).length === 1, "la difesa di un altro lettore non copre questo");
  /* un gestore che i doppioni li accetta di proposito non viene toccato */
  const lecito = '  $("mis-file").onchange = async (e) => {\n    const righe = parseLettureCsv(t);\n    for (const r of righe) await db.aggiungi("letture", r);\n  };';
  ok(dedupSoloInArchivio(lecito, null).length === 0, "dove i doppioni sono leciti non si pretende niente");
});


console.log(`\nRisultato Stile: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);