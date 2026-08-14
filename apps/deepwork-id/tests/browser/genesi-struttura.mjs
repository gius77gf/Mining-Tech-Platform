/* GENESI È PASSATA AL CONDIVISO DAVVERO? — il banco dell'unità A.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-struttura.mjs [porta]
     node genesi-struttura.mjs --prima   (finge lo stato PRE-migrazione: DEVE fallire)

   PERCHÉ ESISTE. Genesi è l'ultima superficie che si scrive in casa toast e
   modale. Il piano della migrazione è misurato in
   docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md, e ha tre trappole che un
   controllo statico non vede:

   1. **il nome `modal` è GIÀ OCCUPATO** dal cancello di consenso — l'avvertenza
      che dichiara estetici i frammenti volanti e vieta di usarli per le distanze
      di sicurezza. Rinominare la modale su quell'id senza spostare il cancello
      vuol dire rompere un'avvertenza di sicurezza, e il browser non se ne
      accorge: la pagina si apre;
   2. **il prefisso `mdl` è sovraccarico**: SETTE id non sono della modale ma
      dell'editor del fronte 3D. Una sostituzione a tappeto se li porterebbe via
      tutti e sette, e la pagina continuerebbe a caricarsi;
   3. **`chiediValore` ha il terzo parametro incompatibile**. In Genesi è un
      VALORE (il nome proposto per la volata), nel condiviso è l'HTML del campo.
      Stesso nome, stessa arità, significato diverso: **compila lo stesso**, e il
      campo comparirebbe VUOTO — chi salva si ritroverebbe la volata senza il
      nome che aveva appena letto nel riquadro.

   Nessuna delle tre è un errore di sintassi. Per questo si prova qui, aprendo
   la pagina e toccandola.

   Genesi NON importa Firebase (misurato: zero riferimenti a gstatic), quindi
   non serve il finto-firebase come per il core. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/* La radice che il banco SERVE. Di serie è la cartella viva, ma `tutti.mjs`
   la punta su una COPIA congelata (`DW_RADICE`): così il giro non pretende più
   che nessuno lavori per un'ora e mezza. Vedi docs/PIANO_GIRO_SU_COPIA.md. */
const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PRIMA = process.argv.includes("--prima");
/* ⚠️ Questo banco alza un SERVER SUO, quindi non può prendere la porta
   posizionale che `tutti.mjs` passa a tutti i banchi: si metterebbe sulla porta
   del server comune e cadrebbe con EADDRINUSE, dentro un elenco dove il suo
   esito verrebbe letto come «il banco è rosso». La porta si cambia con
   `--porta=`, che nessun altro passa. */
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8329;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm" };

let iniezioni = 0;   // quante sostituzioni ha fatto DAVVERO la controprova

/* ⛔ E LA CONDIZIONE CHE RENDE SENSATA LA CONTROPROVA, misurata sul file.
   Il primo tentativo si accontentava di «ho iniettato qualcosa»: ne è arrivata
   UNA sostituzione su sei — `id="modal"`, che oggi è del cancello di consenso,
   cioè la trappola 1 di questo stesso file — e il verdetto avrebbe detto «✓ il
   banco SA fallire» mentre le quindici cadute venivano quasi tutte dal fatto
   che Genesi non è migrata. Una controprova dimostra qualcosa solo se, TOLTA
   l'iniezione, il banco passerebbe. Il segno inequivocabile della migrazione è
   il `<script>` del condiviso: se non c'è, `--prima` non ha niente da provare. */
const MIGRATA = /<script[^>]+dw-app-ui\.js/.test(readFileSync(join(R, "apps", "genesi", "genesi.html"), "utf8"));
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si serve una Genesi «com'era prima», cioè con gli id della
     modale rimessi a `mdl*` e senza il condiviso. Si tocca solo la risposta
     HTTP, mai il file — la regola di CLAUDE.md sulle iniezioni. */
  if (PRIMA && p.endsWith("genesi.html")) {
    let t = corpo.toString("utf8");
    /* ⚠️ E SI CONTA QUANTO SI È TOCCATO DAVVERO. Finché Genesi NON è migrata la
       pagina è già nello stato «prima»: queste sostituzioni trovano **zero**
       occorrenze, il banco cade lo stesso — perché cade comunque — e la
       controprova direbbe «✓ so fallire» **per il motivo sbagliato**. È il caso
       3 di `CLAUDE.md`: *l'iniezione non ha iniettato niente*. Senza questo
       conto la controprova sarebbe verde oggi e resterebbe verde per sempre. */
    for (const [re, con] of [
      [/id="modal-campo"/g, 'id="mdl-campo"'],
      [/id="modal-title"/g, 'id="mdl-tit"'],
      [/id="modal-body"/g, 'id="mdl-body"'],
      [/id="modal-foot"/g, 'id="mdl-foot"'],
      [/id="modal"(?! *= *")/g, 'id="mdl"'],
      [/<script[^>]+dw-app-ui\.js[^>]*><\/script>/g, ""],
    ]) { const q = (t.match(re) || []).length; iniezioni += q; t = t.replace(re, con); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (buono, testo, extra) => {
  if (buono) { ok++; console.log(`  ok  ${testo}`); }
  else { ko++; console.log(`  KO  ${testo}${extra !== undefined ? `\n        -> ${JSON.stringify(extra)}` : ""}`); }
};

/* ⚠️ PRIMA DELLA MIGRAZIONE QUESTO BANCO DEVE **FALLIRE**, non **MORIRE**.
   Alla prima esecuzione è morto: `window.toast(...)` non esiste ancora e
   l'eccezione dentro `evaluate` ha ucciso il processo alla nona prova su
   diciotto. Un banco che si spegne a metà non può dire quante prove ha fatto —
   ed è la domanda che questo repository si è imposto di stampare sempre. Ogni
   misura passa da qui: se il browser solleva, la prova **cade** e si prosegue. */
const misura = async (pagina, fn, arg) => {
  try { return await pagina.evaluate(fn, arg); }
  catch (e) { return { __rotto: String(e.message).split("\n")[0].slice(0, 120) }; }
};

console.log(`\n════════ Genesi: la struttura è quella del core?${PRIMA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 1400, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2500);

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

/* 1 — il condiviso è caricato e le funzioni vengono da lì */
dice(await pg.evaluate(() => typeof window.dwUiAggancia === "function"),
  "carica `shared/dw-app-ui.js` (l'aggancio esiste)");
for (const f of ["toast", "apriModale", "chiudiModale", "chiedi", "chiediValore"]) {
  dice(await pg.evaluate((n) => typeof window[n] === "function", f),
    `\`${f}\` è disponibile come funzione globale`);
}

/* 2 — i cinque id della modale hanno i nomi del core */
const idModale = await misura(pg, () =>
  ["modal", "modal-title", "modal-body", "modal-foot"].map((i) => !!document.getElementById(i)));
dice(Array.isArray(idModale) && idModale.every(Boolean), "i quattro id della modale sono quelli del core", idModale);

/* 3 — i SETTE id dell'editor 3D non sono stati travolti dalla rinomina */
const EDITOR_3D = ["mdlQuote", "mdlTools", "mdlR", "mdlRLab", "mdlUndo", "mdlRedo", "mdlReset"];
const persi = await misura(pg, (ids) => ids.filter((i) => !document.getElementById(i)), EDITOR_3D);
dice(Array.isArray(persi) && persi.length === 0, `i ${EDITOR_3D.length} id dell'editor del fronte 3D sono tutti al loro posto`, persi);

/* 4 — il cancello di consenso è ancora lì e funziona. È un'AVVERTENZA DI
   SICUREZZA: dice che i frammenti volanti sono estetici e che è vietato usarli
   per le distanze di sgombero. Se la rinomina gliela porta via, la pagina si
   apre lo stesso e nessuno se ne accorge. */
const consenso = await misura(pg, () => {
  const box = document.getElementById("consenso") || document.getElementById("modal-consenso");
  const chk = document.getElementById("disclaimerChk");
  const btn = document.getElementById("consensoOk") || document.getElementById("modalOk");
  if (!box || !chk || !btn) return { trovato: false, box: !!box, chk: !!chk, btn: !!btn };
  const primaDisabilitato = btn.classList.contains("disabled");
  chk.checked = true; chk.dispatchEvent(new Event("change"));
  const dopoAbilitato = !btn.classList.contains("disabled");
  const testo = (box.textContent || "").toLowerCase();
  return { trovato: true, primaDisabilitato, dopoAbilitato,
    diceIlVietato: testo.includes("vietato") && testo.includes("sgombero") };
});
dice(!!consenso && consenso.trovato === true, "il cancello di consenso esiste ancora (con la sua casella e il suo bottone)", consenso);
dice(!!consenso && consenso.trovato && consenso.primaDisabilitato && consenso.dopoAbilitato,
  "il consenso resta bloccato finché non si spunta la casella", consenso);
dice(!!consenso && consenso.trovato && consenso.diceIlVietato,
  "e dice ancora che è VIETATO usare i frammenti per le distanze di sgombero", consenso);

/* 5 — il toast del core compare davvero */
const toast = await misura(pg, async () => {
  window.toast("prova del banco");
  await new Promise((r) => setTimeout(r, 120));
  const t = document.getElementById("toast");
  return { visibile: !!t && t.classList.contains("show"), testo: t ? t.textContent : null };
});
dice(!!toast && toast.visibile && toast.testo === "prova del banco", "il toast compare e porta il testo giusto", toast);

/* 6 — la modale si apre, Escape la chiude, il tocco fuori la chiude */
const modale = await misura(pg, async () => {
  window.apriModale("Titolo di prova", "<p>corpo</p>", [{ label: "Annulla", azione: window.chiudiModale }]);
  await new Promise((r) => setTimeout(r, 150));
  const m = document.getElementById("modal");
  const aperta = m.classList.contains("show");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  return { aperta, chiusaConEsc: !m.classList.contains("show") };
});
dice(!!modale && modale.aperta === true, "la modale si apre", modale);
dice(!!modale && modale.chiusaConEsc === true, "e si chiude con Escape", modale);

/* 7 — LA TRAPPOLA: `chiediValore` col terzo parametro. Si preme il bottone
   VERO che salva la volata e si guarda se il nome proposto è finito nel campo.
   È il difetto che compilerebbe in silenzio. */
const proposta = await misura(pg, async () => {
  const b = document.getElementById("hgSalva") || document.getElementById("btn-salva-volata");
  if (!b) return { bottone: false };
  b.click();
  await new Promise((r) => setTimeout(r, 400));
  const campo = document.getElementById("modal-campo");
  const corpo = document.getElementById("modal-body");
  return { bottone: true, campoEsiste: !!campo, valore: campo ? campo.value : null,
    corpo: corpo ? corpo.textContent.slice(0, 60) : null };
});
dice(!!proposta && proposta.bottone === true, "il bottone «salva la volata» esiste");
dice(!!proposta && proposta.campoEsiste === true, "la richiesta del nome mostra un campo", proposta);
dice(!!proposta && proposta.campoEsiste && /^Volata /.test(String(proposta.valore || "")),
  "e il campo è PRECOMPILATO col nome proposto (il terzo parametro non si è perso)", proposta);

await pg.close();
await b.close();
srv.close();

console.log(`\n${ok + ko} prove fatte · ${ok} passate, ${ko} fallite${PRIMA ? " · controprova: le fallite sono attese" : ""}`);
if (PRIMA) {
  console.log(`\niniezioni della controprova: ${iniezioni} sostituzioni nella risposta HTTP`);
  /* ⛔ PRIMA di leggere le cadute si guarda se si è iniettato qualcosa. Con
     Genesi non ancora migrata la pagina è GIÀ nello stato «prima»: zero
     sostituzioni, quindici cadute, e un «✓ so fallire» che non dimostrerebbe
     niente — la controprova starebbe misurando il codice vero, non il difetto. */
  if (!MIGRATA) {
    console.log("⚠️ CONTROPROVA PREMATURA: Genesi non è ancora migrata.");
    console.log(`   (misurato sul file: nessun <script> di shared/dw-app-ui.js; iniezioni riuscite ${iniezioni} su 6 forme)`);
    console.log("   Le cadute qui sopra sono quelle VERE del banco, non quelle del difetto rimesso:");
    console.log("   la controprova ha senso solo quando il banco, senza --prima, passa.");
    process.exit(3);
  }
  console.log(ko >= 5
    ? "✓ il banco SA fallire: sullo stato pre-migrazione cadono le prove giuste"
    : "⚠️ troppo poche cadute: il banco potrebbe non misurare quello che dice");
  process.exit(ko >= 5 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);
