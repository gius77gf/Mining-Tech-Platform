/* ============================================================
   ⛔ UN'INIEZIONE CHE NON TROVA PIÙ IL SUO PEZZO SPEGNE UNA CONTROPROVA
      IN SILENZIO.
   ------------------------------------------------------------
   Perché esiste. Un banco del browser prova di saper fallire rimettendo il
   difetto nel file che serve: cerca una stringa di codice e la sostituisce con
   la versione rotta. Ma quella stringa cita il codice **testualmente**, e il
   codice si muove — di solito perché è **migliorato**. Quando la stringa non
   combacia più non succede niente di visibile: la pagina servita resta SANA, la
   controprova gira su un prodotto sano e non trova niente, e il banco dichiara
   «non distingue». È la terza delle cinque cause di «non distingue» censite in
   CLAUDE.md: non si tocca né la prova né il codice, si guarda l'INIEZIONE.

   Misurato l'08/08: **174 iniezioni in 20 banchi, TRE scadute**, e tutte e tre
   per lo stesso motivo buono — una decisione spostata in una funzione condivisa
   (`provenienzaPpv`, `_ppvBaseHtml`) e le unità avvolte in `<span class="u">`.
   Il costo di non accorgersene: tre controprove che dicevano «non distingue» da
   giorni, dentro registri da cinquemila righe.

   ⚠️ QUESTO CONTROLLO NON APRE UN BROWSER e non serve un server: guarda le
   stringhe e i file. Gira in `npm test`, cioè **prima** del commit, mentre il
   giro del browser che se ne accorgerebbe dura sei ore.

   ⚠️ DUE FORME DI TABELLA, e la prima stesura ne conosceva UNA. La solita è
   `[cerca, sostituisci]`; `scudo-disegni.mjs` mette il FILE davanti —
   `[file, cerca, sostituisci]`. Leggendo tutto come la prima, il nome del file
   finiva nel posto della stringa da cercare: **tre allarmi falsi**, tutti nello
   stesso banco. Un difetto identico in più righe vicine è il modo in cui si
   riconosce di stare guardando il righello.
   ============================================================ */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const BANCHI = join(QUI, "browser");
const R = join(QUI, "..", "..", "..");

/* I file che un banco può servire trasformati. Elenco DERIVATO dal disco per le
   app (una app nuova entra da sola), più il core e i moduli condivisi. */
const SORGENTI = [];
for (const p of ["index.html", "sw.js"]) SORGENTI.push(p);
for (const f of readdirSync(join(R, "shared"))) if (f.endsWith(".js")) SORGENTI.push("shared/" + f);
for (const f of readdirSync(join(R, "shared", "deepwork-id-client"))) {
  if (f.endsWith(".js")) SORGENTI.push("shared/deepwork-id-client/" + f);
}
for (const app of readdirSync(join(R, "apps"), { withFileTypes: true })) {
  if (!app.isDirectory()) continue;
  for (const f of readdirSync(join(R, "apps", app.name))) {
    if (f.endsWith(".html") || f.endsWith(".js")) SORGENTI.push(`apps/${app.name}/${f}`);
  }
}
const testi = SORGENTI.map((p) => {
  try { return readFileSync(join(R, p), "utf8"); } catch { return ""; }
});

/* ⛔ I BANCHI LA CUI TABELLA NON SI LEGGE DA FERMI, dichiarati per nome con la
   ragione — e l'elenco è **sorvegliato**: se uno di questi diventa leggibile,
   o se ne compare uno nuovo, il controllo cade. È la disciplina di
   `sonda-vuoto`: un'eccezione che non serve più è un'eccezione che nasconde. */
const NON_LEGGIBILI = [];
/* ⛔ E L'ELENCO È VUOTO DALL'08/08, PERCHÉ L'UNICA ECCEZIONE È DIVENTATA IL
   POSTO DOVE IL DIFETTO VIVEVA. `scudo-documenti.mjs` era dichiarato non
   leggibile «perché la tabella si costruisce da variabili del banco
   (`MODULO`)»: ragione vera, eccezione onesta — e in quel buco, l'unico che
   questo controllo non guardava, si erano scadute **sei iniezioni su
   ventisei**. Il banco stampava «✔ CONTROPROVA OK» perché le venti rimaste
   bastavano a farlo cadere, quindi il rosso c'era e sembrava tutto a posto:
   la forma peggiore, un controllo che passa avendo guardato meno di quello
   che crede.
   Le sei erano scadute per la ragione di sempre — il codice si era MOSSO
   perché era migliorato: quattro export saliti da `index.html` al modulo
   accanto alle funzioni che decidono le stesse cose a schermo, un
   `LAV.find(...)` scritto a mano diventato `etichettaResponsabile`, e le
   parentesi dei parametri delle funzioni freccia.
   La cura non è dichiarare meglio l'eccezione: è **toglierla**. Le variabili
   che la tabella usa sono costanti di stringa dichiarate nel banco stesso —
   `const PAGINA = "…", MODULO = "…"` — quindi si leggono e si passano
   all'`eval` come preambolo. ⚠️ Si guarda solo la parte di sorgente PRIMA
   della tabella: dopo ci sono le stringhe da iniettare, che possono contenere
   qualunque cosa somigli a un'assegnazione. */
const costantiDi = (src, finoA) => {
  const preambolo = [];
  /* ⚠️ E anche `join("apps", "scudo", "index.html")`: `scudo-verifica-periodica`
     compone così il percorso della pagina, e senza questo ramo la sua tabella
     restava illeggibile — cioè un'eccezione da dichiarare al posto di una riga
     di regex. `join` è quello importato qui sopra: l'`eval` ce l'ha in vista. */
  for (const m of src.slice(0, finoA).matchAll(/\b([A-Z_][A-Z0-9_]*)\s*=\s*(join\([^)]*\)|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)) {
    preambolo.push(`const ${m[1]} = ${m[2]};`);
  }
  return preambolo.join("\n");
};

/* ⛔ E IL 09/08 QUESTO CONTROLLO È CADUTO NELLA FAMIGLIA CHE ESISTE PER
   PRENDERE: CERCAVA **UN NOME SOLO**. La riga qui sotto diceva
   `src.search(/const DIFETTI\s*=\s*\[/)`, cioè guardava le tabelle che si
   chiamano esattamente `DIFETTI` e si aprono con una quadra. Fuori restavano
   `DIFETTO`, `DIFETTI_MODULO`, `DIFETTI_PAGINA`, `DIFETTI_FLOTTA`,
   `DIFETTI_MOTORE`, `DIFETTO_MODULO`, `INIEZIONI`, `COME_LIVE`, e ogni tabella
   scritta come oggetto (`DIFETTI = {` per rotta). Il conto: **215 iniezioni in
   23 banchi** dichiarate, contro le **296 in 35** che ci sono — cioè una su
   quattro non era guardata da nessuno, e il file stampava «zero scadute» con la
   faccia della verità.
   È alla lettera la regola scritta in CLAUDE.md l'08/08 — *«un censimento che
   cerca UN nome risponde "non c'è" con la stessa faccia con cui direbbe la
   verità»* — applicata al controllo che quel giorno stesso era nato per
   togliere un'eccezione. Un'eccezione dichiarata l'avrei riletta; un nome
   scritto dentro una regex no.
   ⚠️ Il costo, misurato prima di allargare (mai «stringo e vedo»): sono entrate
   **81 iniezioni** e **TRE erano scadute**, tutte per la ragione buona di
   sempre — il codice si è mosso perché è migliorato:
   · `campo-foglio-turno · COME_LIVE`, l'avviso passato a una funzione
     condivisa: costava **TRE KO fantasma** nel giro del 08/08, cioè un cantiere
     su difetti che non esistevano;
   · `scudo-frasi-da-uno · DIFETTI_PAGINA`, la frase dell'export cresciuta di un
     ramo in mezzo;
   · `scudo-verifica-periodica · INIEZIONI`, che ha perfino cambiato **file**:
     il CSV del personale è salito nel modulo dati.
   Zero falsi allarmi. Il timore di «allargare fa rumore» era ragionevole e la
   misura l'ha smentito, come già per `nomi-liberi`.

   IL VOCABOLARIO, e perché è un vocabolario e non una forma. Provata prima la
   strada senza nomi — «è una tabella d'iniezione se è una lista di coppie di
   stringhe» — e dà **nove allarmi di cui sette falsi**: `COMBINAZIONI` di
   `note-stato` sono classi CSS, `PLURALI` e `PAROLE` sono parole, `GIRI` e
   `LISTE` sono selettori. Sono tutte liste di coppie di stringhe, e nessuna
   cita il codice. Quindi il nome resta il criterio — ma **il denominatore si
   dichiara**: le tabelle di coppie che il vocabolario NON prende si contano e
   si stampano, così una quarta convenzione di nome compare come un numero
   invece che come silenzio. È la lezione delle righe «non ho guardato». */
const VOCABOLARIO = /^(DIFETT|INIEZION|COME_LIVE)/;

/* ⛔ QUATTRO FORME DI TABELLA, non due, e la quarta è la più onesta delle
   altre. Oltre a `[cerca, sostituisci]` e alle due col percorso in testa o in
   coda, ci sono `[cerca, sostituisci, 1]` (il numero di occorrenze attese) e la
   forma a OGGETTO — `{ file, perche, da, a }` di `graf-scala` e
   `scudo-verifica-periodica` — dove la stringa da cercare ha un **nome**, `da`,
   e non va indovinata affatto. Quando c'è, si legge quella. */
const stringhe = (a) => a.filter((x) => typeof x === "string");
const coppieDi = (v) => {
  if (v && typeof v === "object" && !Array.isArray(v) && typeof v.da === "string") return [[v.da, String(v.a ?? "")]];
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string" || typeof x === "number") && stringhe(v).length >= 2) return [stringhe(v)];
    if (v.length && v.every((x) => x && typeof x === "object")) {
      const out = [];
      for (const x of v) { const c = coppieDi(x); if (!c) return null; out.push(...c); }
      return out;
    }
    return null;
  }
  if (v && typeof v === "object") {   // `DIFETTI = { "rotta": [ [cerca, sost], … ] }`
    const out = [];
    for (const k of Object.keys(v)) { const c = coppieDi(v[k]); if (!c) return null; out.push(...c); }
    return out;
  }
  return null;
};

let totali = 0;
const scadute = [], illeggibili = [], tabelle = [], fuoriVocabolario = [];
const banchiVisti = new Set();
for (const f of readdirSync(BANCHI).filter((x) => x.endsWith(".mjs")).sort()) {
  const src = readFileSync(join(BANCHI, f), "utf8");
  for (const m of src.matchAll(/^const ([A-Z_][A-Z0-9_]*)\s*=\s*([[{])/gm)) {
    const [, nome, apre] = m;
    const fine = src.indexOf(apre === "[" ? "\n];" : "\n};", m.index);
    if (fine < 0) continue;
    let val;
    try { val = eval(costantiDi(src, m.index) + "\n(" + src.slice(m.index, fine + 2).replace(/^const [A-Z_][A-Z0-9_]*\s*=\s*/, "") + ")"); }
    catch { if (VOCABOLARIO.test(nome)) illeggibili.push(`${f} · ${nome}`); continue; }
    const coppie = coppieDi(val);
    if (!coppie || !coppie.length) { if (VOCABOLARIO.test(nome)) illeggibili.push(`${f} · ${nome} (forma non riconosciuta)`); continue; }
    if (!VOCABOLARIO.test(nome)) { fuoriVocabolario.push([f, nome, coppie.length]); continue; }
    tabelle.push(`${f} · ${nome}`);
    banchiVisti.add(f);
    for (const d of coppie) {
      /* ⛔ DUE CONVENZIONI, E IL RIGHELLO NE CONOSCEVA UNA SOLA. `scudo-disegni`
         scrive `[file, cerca, sostituisci]`, `scudo-documenti` scrive
         `[cerca, sostituisci, file]` — e il suo commento lo dice, «terzo elemento
         = il file da toccare». Leggendo sempre `d[1]` come la stringa da cercare
         si finiva a controllare la SOSTITUZIONE: sei falsi allarmi, tutti nello
         stesso banco, che è il segno con cui in questa casa si riconosce di stare
         guardando il righello. È la seconda volta per questa identica famiglia:
         la prima è scritta in CLAUDE.md e riguardava lo stesso file.
         La cura è non indovinare la posizione ma **chiedere ai dati**: il file è
         l'elemento che è un percorso di prodotto vero.
         ⚠️ E c'è una terza convenzione, `[nome, cerca, sostituisci]` di
         `salvataggio-offline`, dove nessun elemento è un percorso e il primo è
         una **etichetta in italiano**: prendendo sempre il primo si controllava
         una frase di prosa, che ovviamente «non sta in nessun file» — due falsi
         allarmi. Quello che tutte e tre hanno in comune è che l'iniezione è una
         coppia **adiacente**: quindi con tre elementi rimasti si guarda il
         **penultimo**, non il primo. */
      const parti = (Array.isArray(d) ? d : [d]).filter((x) => !SORGENTI.includes(x));
      const cerca = parti.length >= 3 ? parti[parti.length - 2] : parti[0];
      if (typeof cerca !== "string" || !cerca.trim()) continue;
      totali++;
      if (!testi.some((t) => t.includes(cerca))) scadute.push([f, nome, cerca]);
    }
  }
}
const banchi = banchiVisti.size;

let male = 0;
const dice = (ok, testo, extra) => {
  console.log(`  ${ok ? "✓" : "✗"} ${testo}${extra ? ": " + extra : ""}`);
  if (!ok) male++;
};

console.log("\n════════ le iniezioni delle controprove sono ancora sul bersaglio? ════════");
dice(scadute.length === 0,
  "ogni iniezione trova ancora il suo pezzo nel codice",
  scadute.length ? scadute.map(([f, n, c]) => `\n      ${f} · ${n} cerca ${JSON.stringify(c.slice(0, 90))}`).join("") : "");

/* ⛔ E IL DENOMINATORE, che è la ragione per cui questo controllo non si legge
   come un «zero violazioni» qualunque: quanti soggetti ha guardato davvero.
   ⚠️ Il fondo è a 250 e non a 100 perché dal 09/08 le iniezioni lette sono 296:
   lasciarlo a 100 avrebbe significato che questo controllo poteva tornare a
   guardarne un terzo senza che niente diventasse rosso — la soglia scritta su
   un valore che sale, cioè cieca proprio nel verso che rassicura. */
dice(totali > 250,
  "il controllo ha guardato abbastanza soggetti da voler dire qualcosa",
  `${totali} iniezioni in ${tabelle.length} tabelle di ${banchi} banchi, su ${SORGENTI.length} file di prodotto`);

/* ⛔ LE TABELLE CHE IL VOCABOLARIO NON PRENDE, contate e stampate: sono liste di
   coppie di stringhe che NON citano codice (classi CSS, selettori, parole al
   plurale). Non è un elenco di eccezioni da scusare — è il denominatore, e
   serve a far comparire come NUMERO una quarta convenzione di nome, invece che
   come silenzio. Se un giorno una di queste righe diventasse un'iniezione, il
   conto cambierebbe e si vedrebbe. */
console.log(`      ${fuoriVocabolario.length} tabelle di coppie fuori dal vocabolario (non citano codice di prodotto):`);
for (const [f, n, q] of fuoriVocabolario) console.log(`         ${String(q).padStart(3)} coppie · ${f} · ${n}`);

const attesi = NON_LEGGIBILI.map(([f]) => f).sort().join(",");
dice(illeggibili.sort().join(",") === attesi,
  "l'elenco dei banchi non leggibili da fermi è ancora quello dichiarato",
  `trovati [${illeggibili.join(", ")}], dichiarati [${NON_LEGGIBILI.map(([f]) => f).join(", ")}]`);
for (const [f, perche] of NON_LEGGIBILI) console.log(`      · ${f} — ${perche}`);

/* ⛔ LA CONTROPROVA: un'iniezione inventata deve essere vista. Senza, questo
   file direbbe «zero» anche se il confronto fosse rotto — ed è esattamente
   quello che il controllo esiste per impedire agli altri. */
const finta = "questa stringa non sta in nessun file del prodotto, 08/08";
dice(!testi.some((t) => t.includes(finta)),
  "controprova: una stringa inventata NON viene trovata (se no il confronto è rotto)");

console.log(`\nRisultato iniezioni fresche: ${totali - scadute.length} sul bersaglio su ${totali}`
  + `  ·  ${tabelle.length} tabelle in ${banchi} banchi, ${illeggibili.length} non leggibili da fermi (dichiarati)`
  + `  ·  ${fuoriVocabolario.length} tabelle di coppie fuori dal vocabolario`);
process.exit(male ? 1 : 0);
