/* LA NAVIGAZIONE FUNZIONA DAVVERO? — si PROVA, non si guarda se la pagina si apre.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node navigazione.mjs [porta]
     node navigazione.mjs --senza-guardie   (serve la versione senza guardie: DEVE fallire)

   È la lezione del 02/08: cinque pagine rotte rispondevano «tutto a posto» a un
   banco che guardava solo il caricamento. Qui si preme ogni voce della pillola e
   si pretende che la pagina giusta diventi attiva E che il segnalibro giusto si
   accenda — compresa la mappa di Flotta, che è la ragione per cui la sua copia
   si era staccata. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = "/home/user/Mining-Tech-Platform";
const SENZA_GUARDIE = process.argv.includes("--senza-guardie");
const PORTA = Number(process.argv.find((a) => /^\d+$/.test(a))) || 8322;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si serve una versione di dw-app-ui.js SENZA le guardie, cioè
     la versione delle cinque app di prima. Deve far cadere la prova dell'id
     che non esiste. Si tocca solo la risposta HTTP, mai il file. */
  if (SENZA_GUARDIE && p.endsWith("dw-app-ui.js")) {
    const t = corpo.toString("utf8")
      .replace("if (pag) pag.classList.add(\"active\");", "pag.classList.add(\"active\");");
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
let ok = 0, ko = 0, mosse = 0;
const dice = (buono, testo, extra) => {
  if (buono) { ok++; console.log(`  ok  ${testo}`); }
  else { ko++; console.log(`  KO  ${testo}${extra !== undefined ? `\n        -> ${JSON.stringify(extra)}` : ""}`); }
};

for (const a of APP) {
  console.log(`\n══════ ${a}`);
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${a}/index.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);

  dice(errori.length === 0, `${a}: nessun errore di pagina`, errori.slice(0, 2));
  dice(await pg.evaluate(() => typeof window.go === "function"),
    `${a}: \`go\` arriva dal modulo condiviso`);

  const voci = await pg.evaluate(() =>
    [...document.querySelectorAll(".nav button[id^=nav-]")].map((b) => b.id.slice(4)));
  dice(voci.length >= 5, `${a}: la pillola ha ${voci.length} voci`);

  for (const v of voci) {
    const r = await pg.evaluate((id) => {
      window.go(id);
      const p = document.getElementById("page-" + id);
      const n = document.getElementById("nav-" + id);
      return {
        pagina: !!(p && p.classList.contains("active")),
        segnalibro: !!(n && n.classList.contains("active")),
        attive: document.querySelectorAll(".page.active").length,
        accese: document.querySelectorAll(".nav button.active").length,
      };
    }, v);
    mosse++;
    dice(r.pagina && r.segnalibro && r.attive === 1 && r.accese === 1,
      `${a} → ${v}: pagina attiva e un solo segnalibro acceso`, r);
  }

  if (a === "flotta") {
    for (const [id, padre] of [["sch", "mez"], ["odl", "man"]]) {
      const r = await pg.evaluate(([x, p]) => {
        window.go(x);
        const pag = document.getElementById("page-" + x);
        const nav = document.getElementById("nav-" + p);
        return {
          pagina: !!(pag && pag.classList.contains("active")),
          padreAcceso: !!(nav && nav.classList.contains("active")),
          accese: document.querySelectorAll(".nav button.active").length,
        };
      }, [id, padre]);
      mosse++;
      dice(r.pagina && r.padreAcceso && r.accese === 1,
        `flotta → ${id}: si apre e tiene acceso il segnalibro di «${padre}»`, r);
    }
  }

  /* LA GUARDIA: un id che non esiste non deve far saltare niente. È il caso
     che oggi non capita mai (misurato), e proprio per questo si prova qui. */
  const dopoIgnoto = await pg.evaluate(() => {
    const prima = document.querySelectorAll(".page.active").length;
    let esploso = false;
    try { window.go("questa-pagina-non-esiste"); } catch (e) { esploso = true; }
    let ancoraViva = false;
    try { window.go("__tornaindietro__"); ancoraViva = true; } catch (e) {}
    return { prima, esploso, ancoraViva };
  });
  mosse++;
  dice(!dopoIgnoto.esploso && dopoIgnoto.ancoraViva,
    `${a}: \`go\` con un id che non esiste non ferma la navigazione`, dopoIgnoto);

  await pg.close();
}

await b.close();
srv.close();
console.log(`\n${ok} passate, ${ko} fallite · ${mosse} navigazioni provate`);
if (SENZA_GUARDIE) {
  console.log(ko > 0
    ? "CONTROPROVA PRESA: senza le guardie il banco cade, quindi sa fallire."
    : "⛔ CONTROPROVA INERTE: senza le guardie non cade niente — questo banco non misura la guardia.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);
