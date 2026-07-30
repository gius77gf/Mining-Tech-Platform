// ============================================================
// LE REGOLE DI STILE VINCOLANTI, RESE VERIFICABILI
//
// Alcune regole di CLAUDE.md non sono gusto: sono decisioni prese una volta e
// da non rimettere in discussione. Finché vivono solo in memoria di progetto,
// prima o poi qualcuno le rompe in buona fede — e nessuno se ne accorge,
// perché non falliscono i test, si vedono solo aprendo la pagina giusta.
// Qui diventano controlli che girano in automatico.
//
// Cinque regole, oggi:
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
//
// Come si aggiunge una regola: una funzione che restituisce l'elenco delle
// violazioni con file e riga, e un `test(...)` che pretende zero.
// ============================================================
import { readFileSync } from "node:fs";
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

console.log(`\nRisultato Stile: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
