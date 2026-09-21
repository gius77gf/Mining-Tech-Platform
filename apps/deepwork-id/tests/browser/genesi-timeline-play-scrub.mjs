/* TIMELINE DELLO SPARO (play/pausa/scrub) — copertura nuova, NESSUN difetto
   storico noto da riprodurre (a differenza di genesi-ruota-scala-tratti.mjs
   e genesi-innesco-xml-roundtrip.mjs, che hanno una tabella DIFETTI perché
   correggono un bug già successo). Trovata SENZA copertura con
   `grep -rl 'id="track"\|id="play"' apps/deepwork-id/tests/browser/*.mjs`
   → zero risultati, sul controllo play/pausa/scrub della schermata 3D dello
   sparo (`#play`, `#track`, `[data-spd]`), che è un'interazione di primo
   piano dell'app (`vault/checkpoints/20260921-101414_...`, "prossimo passo
   atomico"). Letto il sorgente (`setSimT`/`setPlaying`/`trackT`, genesi.html
   righe ~2787-2827): nessun segno di un bug mai corretto — quindi qui non
   c'è un DIFETTI/--controprova da rimettere, e la sua assenza è
   deliberata: la regola "una prova che non sa fallire non dimostra niente"
   vale per gli STRUMENTI di misura (chi controlla un altro controllo), non
   impone un difetto finto su ogni banco di comportamento — lo stesso
   principio già usato da `interi-superfici.mjs`/`documenti-dimostrazione.mjs`,
   banchi di sola copertura positiva.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-timeline-play-scrub.mjs [--porta=8763]
   (nessun --controprova: non c'è un difetto da rimettere, vedi sopra) */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8763;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(readFileSync(p));
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-timeline-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-timeline-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

async function apriSim() {
  const pg = await b.newPage({ viewport: { width: 900, height: 780 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="sim"]');
  await pg.waitForTimeout(300);
  return pg;
}
const stato = (pg) => pg.evaluate(() => ({
  simT: window.__genesi.simT,
  tEnd: window.__genesi.SIM.tEnd,
  playLbl: document.getElementById("play").textContent,
  tstate: document.getElementById("tstate").textContent,
  fillPct: parseFloat(document.getElementById("trackfill").style.width) || 0,
  thumbPct: parseFloat(document.getElementById("thumb").style.left) || 0,
}));

console.log(`\n════════ Genesi: timeline dello sparo (play/pausa/scrub) ════════`);

const pg = await apriSim();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const s0 = await stato(pg);
dice(s0.tEnd > 0, `la volata di default ha una durata reale (letto tEnd=${s0.tEnd})`, s0);
dice(s0.simT === 0 && s0.playLbl === "▶" && s0.tstate === "pronto" && s0.fillPct === 0,
  `stato iniziale: fermo a 0, bottone ▶, "pronto" (letto ${JSON.stringify(s0)})`, s0);

// --- PLAY: il bottone avvia subito (sincrono), il tempo avanza dopo ---
await pg.click("#play");
const sPlayNow = await stato(pg);
dice(sPlayNow.playLbl === "❚❚" && sPlayNow.tstate === "in corsa",
  `subito dopo il clic su Play: bottone ❚❚, stato "in corsa" (letto ${JSON.stringify(sPlayNow)})`, sPlayNow);

await pg.waitForTimeout(350);
const sPlayDopo = await stato(pg);
dice(sPlayDopo.simT > 0 && sPlayDopo.simT < sPlayDopo.tEnd,
  `dopo ~350ms di play il tempo è avanzato ma la volata non è ancora finita (letto simT=${sPlayDopo.simT}/${sPlayDopo.tEnd})`, sPlayDopo);
dice(Math.abs(sPlayDopo.fillPct - sPlayDopo.simT / sPlayDopo.tEnd * 100) < 0.5,
  `la barra riempita segue la percentuale del tempo (letto ${sPlayDopo.fillPct}% vs simT/tEnd=${(sPlayDopo.simT / sPlayDopo.tEnd * 100).toFixed(2)}%)`, sPlayDopo);

// --- PAUSA: il tempo si ferma dove sta ---
await pg.click("#play");
const sPausaSubito = await stato(pg);
dice(sPausaSubito.playLbl === "▶" && sPausaSubito.tstate === "pausa",
  `subito dopo il clic di pausa: bottone ▶, stato "pausa" (letto ${JSON.stringify(sPausaSubito)})`, sPausaSubito);
await pg.waitForTimeout(300);
const sPausaDopo = await stato(pg);
dice(sPausaDopo.simT === sPausaSubito.simT,
  `in pausa il tempo NON avanza da solo (letto ${sPausaSubito.simT} poi ${sPausaDopo.simT})`, sPausaDopo);

// --- SCRUB: trascinare la barra porta il tempo a metà, e mette in pausa ---
await pg.click("#play"); // rimette in play, per provare che lo scrub lo fermi
await pg.waitForTimeout(120);
const track = pg.locator("#track");
const box = await track.boundingBox();
const metaX = box.x + box.width * 0.5, midY = box.y + box.height / 2;
await pg.mouse.move(box.x + 4, midY);
await pg.mouse.down();
await pg.mouse.move(metaX, midY, { steps: 5 });
await pg.mouse.up();
const sScrubMeta = await stato(pg);
dice(sScrubMeta.tstate === "pausa" && sScrubMeta.playLbl === "▶",
  `iniziare a trascinare la barra mette in pausa (letto ${JSON.stringify({ tstate: sScrubMeta.tstate, playLbl: sScrubMeta.playLbl })})`, sScrubMeta);
dice(Math.abs(sScrubMeta.fillPct - 50) < 3,
  `trascinato al centro della barra, il tempo è a metà (letto ${sScrubMeta.fillPct}%)`, sScrubMeta);

// --- SCRUB al fondo: oltre il bordo destro, `trackT` chiude a u=1 (Math.min) ---
await pg.mouse.move(metaX, midY);
await pg.mouse.down();
await pg.mouse.move(box.x + box.width + 30, midY, { steps: 5 });
await pg.mouse.up();
const sScrubFine = await stato(pg);
dice(sScrubFine.tstate === "fine" && Math.abs(sScrubFine.simT - sScrubFine.tEnd) < 1,
  `trascinato in fondo, il tempo tocca la fine e lo stato dice "fine" (letto simT=${sScrubFine.simT}/${sScrubFine.tEnd}, tstate=${sScrubFine.tstate})`, sScrubFine);

// --- Play da fine: riparte da 0, non resta bloccato alla fine ---
await pg.click("#play");
const sRipartito = await stato(pg);
dice(sRipartito.tstate === "in corsa" && sRipartito.simT < sRipartito.tEnd,
  `premendo Play da "fine" la volata riparte da 0 invece di restare bloccata (letto simT=${sRipartito.simT}/${sRipartito.tEnd}, tstate=${sRipartito.tstate})`, sRipartito);
await pg.click("#play"); // rimette in pausa, pulizia

// --- Velocità: cambiare [data-spd] non rompe nulla e sposta la selezione ---
await pg.click('[data-spd="0.1"]');
const spdOn = await pg.evaluate(() => document.querySelector('[data-spd="0.1"]').classList.contains("on"));
const spdOffAltri = await pg.evaluate(() =>
  ["1", "0.025"].every((v) => !document.querySelector(`[data-spd="${v}"]`).classList.contains("on")));
dice(spdOn && spdOffAltri, `selezionare "slow ×10" lo marca attivo e disattiva le altre velocità (on=${spdOn}, altre spente=${spdOffAltri})`);

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;
