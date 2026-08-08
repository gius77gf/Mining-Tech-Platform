/* QUELLO CHE ESCE DAGLI APPUNTI — premuto il bottone, letto quello che copia.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node appunti-dimostrazione.mjs [--porta=8766]
     node appunti-dimostrazione.mjs --live         (l'app crede di essere in
                                                    produzione: il testo deve
                                                    uscire PULITO)
     node appunti-dimostrazione.mjs --controprova  (toglie la dichiarazione:
                                                    DEVE fallire)

   ⛔ PERCHÉ NON BASTAVANO I DUE BANCHI CHE C'ERANO GIÀ. La dimostrazione si
   dichiara in due posti, e ognuno ha il suo banco: nel NOME del file che si
   scarica (`csv-dimostrazione.mjs`) e nella TESTATA del foglio che si stampa
   (`stampe-fs.mjs`). Poi c'è una terza uscita, che non è né un file né un
   foglio e che nessuno dei due poteva vedere: un testo COPIATO NEGLI APPUNTI.
   In Scudo è il bottone «Promemoria» dello scadenzario, che prepara il
   sollecito da mandare a un lavoratore — nome, adempimento, data, e la frase
   che gli chiede di contattare l'ufficio.
   Misurato il 07/08 premendo il bottone in dimostrazione e leggendo gli
   appunti, PRIMA della correzione:

       Oggetto: promemoria scadenza — Visita medica
       Gentile Mario Rossi,
       ti ricordiamo che «Visita medica periodica» risulta SCADUTA dal
       02/07/2026 (36 giorni fa). …

   Completo, credibile, e senza una parola che dicesse che è finto. Un file
   scaricato porta il marchio nel nome e un foglio stampato ce l'ha in testa;
   un testo incollato in un'email non ha né l'uno né l'altro — è l'uscita con
   la difesa più debole di tutte, ed era anche quella che va a una PERSONA
   invece che a un archivio.

   ⛔ E IL CENSIMENTO CHE TROVA GLI EXPORT NON POTEVA TROVARLA: gli altri due
   banchi derivano i loro soggetti dal disco cercando `…download = …` e i
   blocchi `@media print`. Un `navigator.clipboard.writeText` non somiglia a
   nessuno dei due. È lo stesso difetto di forma dell'elenco copiato dalla
   sagoma di un'app e poi dichiarato generale: qui i soggetti si cercano per
   quello che FANNO (scrivono negli appunti), non per come somigliano a un
   export.

   ⛔ LA SECONDA DOMANDA: E SU UN DATO VERO? Una guardia che si accende sempre
   non è una guardia — marchiare «DATI DI ESEMPIO» il sollecito vero mandato a
   un lavoratore vero sarebbe peggio del difetto che chiude. `--live` rovescia
   la lettura del modo e allora le prove si rovesciano con lei: lo stesso
   bottone deve copiare il testo NUDO. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8766;
const CONTROPROVA = process.argv.includes("--controprova");
const FINGE_LIVE = process.argv.includes("--live");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I SOGGETTI, DERIVATI DAL DISCO e non scritti a mano: si cerca chi scrive
   negli appunti (`clipboard.writeText`) e si dichiara l'app. Il giorno in cui
   una seconda app copierà un testo, questo banco la vede senza che nessuno se
   ne debba ricordare — che è il motivo per cui gli elenchi qui dentro sono
   derivati e non ricordati. */
const APP = ["conti", "flotta", "sentinella", "terra", "campo", "scudo", "genesi"];
const copiaNegliAppunti = (app) => {
  const rel = app === "genesi" ? "apps/genesi/genesi.html" : `apps/${app}/index.html`;
  const p = join(R, rel);
  if (!existsSync(p)) return null;
  const src = readFileSync(p, "utf8");
  return /clipboard\s*&&\s*navigator\.clipboard\.writeText|clipboard\.writeText\(/.test(src) ? rel : null;
};
const SOGGETTI = APP.map((a) => [a, copiaNegliAppunti(a)]).filter(([, r]) => r);

/* Il bottone di ogni soggetto: dove sta, come ci si arriva, e che cosa deve
   dire il testo che ne esce. Un soggetto trovato dal disco e non descritto qui
   NON viene misurato — e allora il banco lo DICE, invece di lasciarlo cadere
   fuori da un riepilogo verde. */
/* ⛔ UNA LISTA PER APP, NON UN BOTTONE — e la firma stretta è la ragione per
   cui Conti non era misurata affatto. L'08/08, aggiungendola, si è visto che
   ha DUE uscite negli appunti: il sollecito di pagamento (nelle fatture) e
   l'estratto conto (nei report). Con la firma vecchia bisognava sceglierne
   una, cioè lasciare l'altra fuori dal riepilogo — proprio la cosa che questo
   banco esiste per non fare. Un argomento in più toglie la copia. */
const COME = {
  scudo: [
    { sezione: "nav-scad", bottone: "#scad-list [data-prom-scad]",
      dentro: /Gentile /, quale: "il promemoria di scadenza allo scadenzario" },
  ],
  /* ⛔ CONTI ERA CENSITA E MAI PREMUTA, e sotto ci stava un difetto vero: i suoi
     due testi uscivano SENZA la dichiarazione «dati di esempio». Sono i due
     documenti che una persona incolla in un'email e manda a un cliente per
     chiedergli soldi. Il banco lo diceva da giorni in fondo al riepilogo —
     «NON MISURATE: conti» — e nessuno l'aveva letto: è la regola delle righe
     «non ho guardato», da leggere PRIMA dei KO. */
  conti: [
    { sezione: "nav-fat", bottone: "[data-sollecito]",
      dentro: /Oggetto: sollecito di pagamento/, quale: "il sollecito di pagamento nelle fatture" },
    { sezione: "nav-rep", bottone: "[data-espo]",
      dentro: /Estratto conto —/, quale: "l'estratto conto del cliente nei report" },
  ],
};

/* L'INIEZIONE della controprova: si toglie la dichiarazione dal testo, cioè
   si spegne il vestito e non la decisione — la decisione (`modoDimostrazione`)
   ce l'ha già la sua controprova in `csv-dimostrazione.mjs`, e due iniezioni
   sullo stesso strato proverebbero due volte la stessa cosa.

   ⛔ L'INIEZIONE HA CAMBIATO BERSAGLIO L'08/08, ED È UN MIGLIORAMENTO NON UNA
   TOPPA. Prima toglieva la dichiarazione dalla pagina di ogni app, dove ognuna
   se l'era riscritta; adesso la regola sta in `shared/`, quindi si spegne LÌ —
   in un posto solo, e la controprova copre tutte le app insieme invece di una
   per volta. Il segno che il bersaglio è quello giusto: il conto delle
   iniezioni non deve mai essere zero, e sotto c'è la riga che lo pretende. */
const DA_TOGLIERE = /export function avvisoTestoDimostrazione\([^)]*\) \{[\s\S]*?\n\}/;
const SHARED = "shared/deepwork-id-client/dw-shell.js";
let nIniezioni = 0, nMancate = 0;
const inietta = (rotta, t) => {
  const dentro = rotta.replace(/^\//, "");
  if (CONTROPROVA && dentro === SHARED) {
    const q = (t.match(DA_TOGLIERE) || []).length;
    if (q !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${rotta}: ${q} soggetti per la dichiarazione`); nMancate++; return t; }
    nIniezioni++;
    return t.replace(DA_TOGLIERE, "export function avvisoTestoDimostrazione() { return \"\"; }");
  }
  /* ⛔ SI INIETTA SOLO DOVE SI MISURA. Il censimento trova più superfici di
     quante ne siano descritte in `COME`, e iniettare in una che nessuno preme
     produce un «INIEZIONE MANCATA» che non è un difetto — è rumore, e un
     allarme che sbaglia insegna a non guardarlo. */
  if (!SOGGETTI.some(([a, r]) => r === dentro && COME[a])) return t;
  if (FINGE_LIVE) {
    const q = (t.match(/modoDimostrazione\(([^)]*?)db\.mode\)/g) || []).length;
    if (q < 1) { console.log(`⛔ INIEZIONE MANCATA in ${rotta}: nessuna lettura del modo da rovesciare`); nMancate++; return t; }
    nIniezioni += q;
    return t.replace(/(modoDimostrazione\([^)]*?)db\.mode\)/g, '$1"live")');
  }
  /* in controprova la pagina non si tocca: il bersaglio è `shared/`, sopra. */
  return t;
};

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* il contrassegno col proprio pid, riletto dal server: un banco che trova la
     porta occupata e la riusa misura la copia di qualcun altro */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (/\.(html|js|mjs)$/.test(p) && (CONTROPROVA || FINGE_LIVE)) corpo = Buffer.from(inietta(rotta, corpo.toString("utf8")), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`
    + `${CONTROPROVA ? "  · CONTROPROVA (il testo deve uscire NUDO, il banco deve diventare rosso)" : ""}`
    + `${FINGE_LIVE ? "  · FINGE LIVE (il testo deve uscire PULITO)" : ""}`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 260)}` : ""}`); } };

/* la dichiarazione DEVE esserci in dimostrazione e NON DEVE esserci su un dato
   vero: è la stessa prova letta nei due versi, non due prove */
const ATTESO = !FINGE_LIVE;
const muti = [], nonDescritti = [];

console.log(`\n${SOGGETTI.length} superfici che copiano negli appunti, censite sul disco: ${SOGGETTI.map(([a]) => a).join(", ")}`);

let misurate = 0;
for (const [app, rel] of SOGGETTI) {
  const ricette = COME[app];
  if (!ricette) { nonDescritti.push(app); continue; }
  /* la pagina si apre UNA volta per app e si preme un bottone per ricetta: le
     ricette di una stessa app vivono in sezioni diverse, non in pagine diverse */
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, locale: "it-IT" });
  const pg = await ctx.newPage();
  /* si aggancia `writeText` invece di leggere gli appunti veri: il testo si
     prende AL VOLO, come `csv-dimostrazione` tiene per mano il Blob */
  await pg.addInitScript(() => {
    window.__copiati = [];
    Object.defineProperty(navigator, "clipboard",
      { value: { writeText: async (t) => { window.__copiati.push(String(t)); } }, configurable: true });
  });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/${rel}`);
  await pg.waitForTimeout(2600);
  dice(errori.length === 0, `${app}: la pagina non solleva errori`, errori.slice(0, 2));
  const modo = await pg.evaluate(() => (document.getElementById("mode-note") || {}).textContent || "");
  dice(/esempio|reali/i.test(modo), `${app}: la pagina è partita e dichiara il suo modo`, modo);

  for (const c of ricette) {
    console.log(`\n── ${app} · ${c.quale} ──`);
    /* si azzera fra una ricetta e l'altra, se no la seconda leggerebbe il
       testo della prima e direbbe verde senza aver premuto niente */
    await pg.evaluate(() => { window.__copiati = []; });
    const quanti = await pg.evaluate(([sez, bot]) => {
      const n = document.getElementById(sez); if (n) n.click();
      const b = document.querySelectorAll(bot);
      if (b[0]) b[0].click();
      return b.length;
    }, [c.sezione, c.bottone]);
    await pg.waitForTimeout(700);
    const copiati = await pg.evaluate(() => window.__copiati);
    dice(quanti > 0, `${app} · ${c.quale}: ci sono bottoni da premere nella dimostrazione`, quanti);
    if (!copiati.length) { muti.push(`${app} · ${c.quale} — premuto ${c.bottone}, nessun testo copiato`); continue; }
    misurate++;
    const testo = copiati[0];
    dice(c.dentro.test(testo), `${app}: il testo copiato è quello vero (${c.quale})`, testo.slice(0, 120));
    const dichiara = /DATI DI ESEMPIO/.test(testo);
    dice(dichiara === ATTESO,
      `${app} · ${c.quale}: il testo copiato ${ATTESO ? "DICHIARA di essere una dimostrazione" : "esce PULITO (nessuna dichiarazione su un dato vero)"}`,
      testo.slice(0, 200));
    if (ATTESO) {
      /* ⛔ IN TESTA E NON IN CODA: un SMS si legge dalla prima riga, e in fondo a
         un'email incollata la riga finisce sotto la firma — cioè dove non la
         legge nessuno. È la stessa lezione del dettaglio appeso in fondo a una
         riga con `line-clamp`. */
      dice(testo.trimStart().startsWith("[DATI DI ESEMPIO"),
        `${app} · ${c.quale}: la dichiarazione sta in TESTA, dove si legge`, testo.slice(0, 80));
      /* e resta un testo LEGGIBILE: la dichiarazione non mangia il messaggio */
      dice(c.dentro.test(testo.split("\n").slice(1).join("\n")),
        `${app} · ${c.quale}: e il messaggio vero è ancora tutto lì sotto`);
    }
  }
  await ctx.close();
}

/* ⛔ LE RIGHE CHE DICONO «NON HO GUARDATO» VANNO LETTE PER PRIME. */
if (nonDescritti.length) console.log(`\n⚠️  NON MISURATE: ${nonDescritti.join(", ")} — copiano negli appunti ma non hanno una riga in COME. Non vuol dire «a posto»: vuol dire che nessun bottone è stato premuto.`);
if (muti.length) { console.log(`\n⚠️  MUTE: ${muti.length}`); muti.forEach((m) => console.log("   " + m)); }
if ((CONTROPROVA || FINGE_LIVE) && nIniezioni === 0)
  console.log(`\n⛔ NESSUNA INIEZIONE È ARRIVATA: la controprova non sta provando niente.`);

console.log(`\nRisultato appunti: ${ok} passati, ${ko} falliti`
  + `  ·  ${SOGGETTI.length} superfici censite, ${SOGGETTI.length - nonDescritti.length} misurate`
  + `  ·  ${Object.values(COME).reduce((t, r) => t + r.length, 0)} uscite descritte, ${misurate} raggiunte`
  + ((CONTROPROVA || FINGE_LIVE) ? `  ·  ${nIniezioni} iniezioni, ${nMancate} mancate` : ""));
await b.close();
srv.close();
/* nella controprova il rosso è il risultato atteso: chi la lancia legge
   l'uscita al contrario, come fanno gli altri banchi */
process.exit(ko > 0 ? 1 : (nMancate > 0 ? 2 : 0));
