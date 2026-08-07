/* IL CORE NON DICHIARA CHILI E METRI CUBI CHE NESSUNO HA MISURATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-volate-non-misurate.mjs [--porta=8496]
     node core-volate-non-misurate.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. È il gemello di `core-rapportini-non-misurati.mjs` sull'altro
   documento del core, e nasce dall'ultima delle QUATTRO copie deboli della
   stessa decisione: `misureVolataProgetto` sta in `shared/`, il documento la
   chiamava, la scheda la chiamava, il riquadro la chiamava — e **l'elenco no**.
   Scriveva, di suo:
       ${v.tot_fori||0} fori${v.tot_kg>0?' · '+v.tot_kg+' kg':''} · ${v.tot_mc||0} mc
   cioè due bugie tranquille in una riga sola:
   · **«0 mc»** dove nessuno ha scritto le profondità. Non è un caso di
     laboratorio: `tot_mc = tot_metri × B × S`, e `tot_metri` è la somma delle
     profondità dei fori — senza quelle il prodotto è zero. Su un progetto di
     volata «0 mc» si legge «non rende niente», non «non l'ha misurato nessuno»;
   · i **chili che spariscono**: `v.tot_kg>0` fa cadere il pezzo intero, quindi
     una volata mai caricata e una caricata a zero si scrivono **identiche**.
     È il modo silenzioso di dire la stessa bugia — quello che non lascia
     niente da leggere, e infatti la dimostrazione ce l'aveva dentro da mesi
     («10 fori · 787.5 mc», terza volata, tutti i fori con `kg:''`).

   ⚠️ PERCHÉ UN BANCO DEL BROWSER E NON `run-kpi`. La regola è provata in
   `shared/` dove vive. Quello che `node` non può vedere è il **collegamento**:
   che l'elenco la chiami davvero, e che quello che ne esce **ci stia nella
   riga**. `.ssub` è `white-space:nowrap` + ellissi, quindi una dichiarazione
   giusta ma lunga diventa testo morto — ed è il motivo per cui l'elenco non
   può riusare `volKg`/`volMc` così com'erano: misurato, la volata caricata a
   metà chiedeva **295px** su 252 disponibili a 390px, tagliata a OGNI
   larghezza. La stessa riga era anche nel riquadro «ultime volate» della
   dashboard, e lì era tagliata da prima di questo lavoro.

   ⛔ IL LIMITE È DICHIARATO, NON NASCOSTO. A 320px UNA combinazione esce lo
   stesso, e il banco la stampa invece di saltarla: «almeno … kg» insieme a
   «mc non calcolabili» chiede 197px su 194 (caso G). Non si accorcia oltre
   senza ridurre le parole a sigle. Il KO scatta alla larghezza di riferimento
   (390px); a 320 il banco **conta e stampa**, perché un peggioramento in un
   punto a fronte di una bugia tolta è una scelta, e una scelta si legge.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DOCUMENTO: le volate entrano
   sostituendo l'array della dimostrazione nella risposta HTTP, cioè passando
   dalla via vera. Il file su disco non si tocca. E la prova che l'aggancio ha
   preso guarda **quante volate l'app ha in mano**, non quanti caratteri sono
   stati sostituiti.

   ⛔ E IL FINTO FIRESTORE DEVE RIFIUTARE, non rispondere vuoto: con un
   Firestore che dice «nessun documento» il core crede di essere al primo
   avvio, semina il database e l'accesso risponde «Credenziali errate» su
   credenziali giuste. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8496;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I SETTE STATI, e servono tutti: se ci fossero solo i
   malati, il modo più facile di far passare le prove sarebbe spegnere ogni
   numero — l'errore opposto e altrettanto grave. `misureVolataProgetto` legge
   `v.fori`, quindi i casi si costruiscono sui FORI e i totali si scrivono
   coerenti con loro, come farebbe `ricalcolaTotaliVolata`. */
const foro = (i, prof, kg) => `{id:'f${i}',num:${i},x:${i},y:0,prof:${prof},diam:89,kg:${kg},`
  + `esplosivo:'',ritardo:'',innesco:'',sequenza:${i},note:''}`;
const vol = (id, numero, nome, fori, totMetri, totKg, totMc) =>
  `{id:'${id}',numero:${numero},nomeProgetto:'${nome}',tipo:'cava',cavaId:'cava_1',data:'2026-07-20',`
  + `default:{diametro_mm:89},fori:[${fori}],connessioni:[],tot_fori:${fori.split("},{").length},`
  + `tot_metri:${totMetri},tot_kg:${totKg},tot_mc:${totMc},note:'',createdBy:'user_admin',createdAt:0,updatedAt:0}`;

const CASI = [
  /* A · tutto misurato: il caso sano, che deve continuare a dire i numeri */
  vol("zzA", 901, "tutto misurato", [foro(1, 9, 8), foro(2, 9, 8), foro(3, 9, 8)].join(","), 27, 24, 283.5),
  /* B · profondità sì, chili no: i chili non esistono, i mc sì */
  vol("zzB", 902, "senza chili", [foro(1, 9, "''"), foro(2, 9, "''"), foro(3, 9, "''")].join(","), 27, 0, 283.5),
  /* C · chili sì, profondità no: i mc vengono ZERO per moltiplicazione */
  vol("zzC", 903, "senza profondita", [foro(1, "''", 8), foro(2, "''", 8), foro(3, "''", 8)].join(","), 0, 24, 0),
  /* D · né l'uno né l'altro: la riga sarebbe tutta caveat, si dice una volta */
  vol("zzD", 904, "niente di niente", [foro(1, "''", "''"), foro(2, "''", "''")].join(","), 0, 0, 0),
  /* E · caricata a metà: il totale c'è ed è PIÙ BASSO del vero, e va detto */
  vol("zzE", 905, "caricata a meta", [foro(1, 9, 8), foro(2, 9, 8), foro(3, 9, "''"), foro(4, 9, "''")].join(","), 36, 16, 378),
  /* G · caricata a metà E senza profondità: è la combinazione più lunga che
     `volRiga` sappia produrre, e a 320px è quella che esce. Va nei casi
     proprio per questo: una prova che non contiene il caso difeso risponde
     «tutto a posto» senza aver guardato niente. */
  vol("zzG", 907, "meta carica al buio",
    [foro(1, "''", 28), foro(2, "''", 28), foro(3, "''", "''"), foro(4, "''", "''")].join(","), 0, 56, 0),
  /* F · nessun foro: non c'è niente da contare, e nemmeno da fingere */
  `{id:'zzF',numero:906,nomeProgetto:'vuota',tipo:'cava',cavaId:'cava_1',data:'2026-07-20',`
  + `default:{diametro_mm:89},fori:[],connessioni:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,`
  + `note:'',createdBy:'user_admin',createdAt:0,updatedAt:0}`,
];
const ANCORA = "const DEFAULT_DEPOSITO = {";
const CON_CASI = "DEFAULT_VOLATE.length=0;DEFAULT_VOLATE.push(...[" + CASI.join(",") + "]);\n" + ANCORA;

/* IL DIFETTO DA RIMETTERE: la riga VERA che il core aveva, non una caricatura. */
const DIFETTI = [
  ['<div class="ssub">${volRiga(v)}</div>',
   `<div class="ssub">\${conta(v.tot_fori||0,'foro','fori')}\${v.tot_kg>0?' · '+v.tot_kg+' kg':''} · \${v.tot_mc||0} mc</div>`],
];

let agganciato = 0, colpiti = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p === join(R, "index.html")) {
    let t = corpo.toString("utf8");
    const prima = t;
    t = t.split(ANCORA).join(CON_CASI);
    if (t !== prima) agganciato = 1;
    if (CONTROPROVA) for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti++; t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e risponde «non so fallire». */
const SEGNO = join(R, "__core-vol-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-vol-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

const apri = async (larghezza) => {
  const pg = await b.newPage({ viewport: { width: larghezza, height: 900 } });
  await montaFintoFirebase(pg);
  await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
    r.fulfill({ status: 200, contentType: "text/javascript",
      body: MODULI["firebase-firestore.js"].replace(
        "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
        "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));
  await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
  await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
  /* ⚠️ I dati d'esempio arrivano DOPO che `doLogin` esiste: cliccando subito si
     legge «Credenziali errate» su credenziali giuste. Si riprova finché entra. */
  let dentro = false;
  for (let g = 0; g < 6 && !dentro; g++) {
    await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
    await pg.waitForTimeout(800);
    dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
  }
  await pg.evaluate(() => window.nav && window.nav("volate-list"));
  await pg.waitForTimeout(600);
  return { pg, dentro };
};

/* ══════ 390px: la larghezza di riferimento, dove si giudica ══════ */
const { pg, dentro } = await apri(390);
dice(agganciato === 1, `l'iniezione dei ${CASI.length} casi ha agganciato la dimostrazione (${agganciato})`);
dice(dentro, "si entra davvero nell'app");
if (CONTROPROVA) dice(colpiti === DIFETTI.length, `la controprova ha rimesso il difetto (${colpiti}/${DIFETTI.length})`);

/* ⚠️ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
   fotografa la stessa schermata a ogni giro e risponde «tutto a posto». */
const navigato = await pg.evaluate(() => {
  const s = document.getElementById("screen-volate-list");
  return !!s && getComputedStyle(s).display !== "none";
});
dice(navigato, "l'elenco delle volate è davvero aperto");

const righe = await pg.evaluate(() => Array.from(document.querySelectorAll("#volate-list-body .sitem")).map((it) => ({
  nome: (it.querySelector(".sname") || {}).textContent || "",
  sub: ((it.querySelector(".ssub") || {}).textContent || "").trim(),
  chiesto: Math.round((it.querySelector(".ssub") || { scrollWidth: 0 }).scrollWidth * 10) / 10,
  spazio: Math.round((it.querySelector(".ssub") || { clientWidth: 0 }).clientWidth * 10) / 10,
})));
const di = (n) => (righe.find((r) => r.nome.includes(n)) || { sub: "«riga non trovata»" }).sub;
console.log(`  · ${righe.length} righe lette a 390px`);
for (const r of righe) console.log(`      «${r.sub}»`);

/* ⚠️ E LA PROVA CHE I CASI SONO ARRIVATI NELLO STATO, non solo nel file: la
   sostituzione può riuscire e un `DB.volate=[...]` più tardi buttarla via.
   `DB` non è su `window`, quindi non lo si può chiedere all'app: quello che si
   guarda è che in elenco ci siano ESATTAMENTE i casi iniettati e nessuna delle
   volate della dimostrazione — se l'array fosse stato riscritto sopra, qui si
   leggerebbero «Fronte Nord» e «Gradone Est». */
const nomiVisti = righe.map((r) => r.nome).join(" | ");
dice(righe.length === CASI.length, `tutte e ${CASI.length} le volate sono in elenco (${righe.length})`, nomiVisti);
dice(!/Fronte Nord|Gradone Est/.test(nomiVisti),
  "l'iniezione ha SOSTITUITO la dimostrazione, non ci si è aggiunta", nomiVisti);

/* ⛔ IL CUORE: nessuna riga dichiara uno ZERO che nessuno ha misurato. */
const zeri = righe.filter((r) => /(^|[^\d.,])0(\s*(mc|kg))/.test(r.sub));
dice(zeri.length === 0, "nessuna riga scrive «0 mc» o «0 kg» dove non è stato misurato niente",
  zeri.map((z) => z.sub).join(" | "));

dice(/3 fori/.test(di("tutto misurato")) && /24 kg/.test(di("tutto misurato")) && /283\.5 mc/.test(di("tutto misurato")),
  "il caso sano dice ancora i suoi numeri", di("tutto misurato"));
dice(/kg non scritti/.test(di("senza chili")) && /283\.5 mc/.test(di("senza chili")),
  "senza chili: lo dichiara, e i mc restano quelli veri", di("senza chili"));
dice(/mc non calcolabili/.test(di("senza profondita")) && /24 kg/.test(di("senza profondita")),
  "senza profondità: «mc non calcolabili», non «0 mc»", di("senza profondita"));
dice(/né chili né volume/.test(di("niente di niente")),
  "né l'uno né l'altro: una dichiarazione sola, non due", di("niente di niente"));
dice(/almeno 16 kg/.test(di("caricata a meta")),
  "caricata a metà: «almeno», perché il totale è più basso del vero", di("caricata a meta"));
dice(/nessun foro/.test(di("vuota")) && !/mc/.test(di("vuota")),
  "nessun foro: non si conta e non si finge", di("vuota"));

/* ⛔ E LE PAROLE DEVONO STARE NELLA RIGA, se no sono testo morto. */
const fuori390 = righe.filter((r) => r.chiesto > r.spazio);
dice(fuori390.length === 0, `a 390px nessuna riga è tagliata (spazio ${righe[0] ? righe[0].spazio : "?"}px)`,
  fuori390.map((r) => `${r.chiesto}/${r.spazio} ${r.sub}`).join(" | "));
await pg.close();

/* ══════ 320px: qui si CONTA e si STAMPA, non si giudica ══════
   Il limite è dichiarato nell'intestazione: due combinazioni escono, e
   l'alternativa sarebbe ridurre le parole a sigle. Stamparle è la differenza
   fra una scelta e una svista. */
const { pg: pg2 } = await apri(320);
const righe320 = await pg2.evaluate(() => Array.from(document.querySelectorAll("#volate-list-body .ssub")).map((e) => ({
  sub: e.textContent.trim(), chiesto: Math.round(e.scrollWidth * 10) / 10, spazio: Math.round(e.clientWidth * 10) / 10 })));
const fuori320 = righe320.filter((r) => r.chiesto > r.spazio);
console.log(`  · a 320px: ${righe320.length} righe, ${fuori320.length} escono dallo spazio (${righe320[0] ? righe320[0].spazio : "?"}px) — DICHIARATE, non KO:`);
for (const r of fuori320) console.log(`      → ${r.chiesto}/${r.spazio}  «${r.sub}»`);
if (!fuori320.length) console.log("      (nessuna: se resta così a lungo, la riga dell'intestazione va aggiornata)");
await pg2.close();

console.log(`\nRisultato volate mai misurate${CONTROPROVA ? " · CONTROPROVA" : ""}: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));
