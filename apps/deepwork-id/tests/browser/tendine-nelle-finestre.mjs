/* LE VOCI DI TENDINA DENTRO LE FINESTRE, MISURATE COL RIGHELLO DEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node tendine-nelle-finestre.mjs [--porta=9301] [--solo=scudo] [--tutte]
     node tendine-nelle-finestre.mjs --controprova   (rimette i difetti: DEVE fallire)
     node tendine-nelle-finestre.mjs --dimmi         (stampa ogni voce misurata)

   ⛔ PERCHÉ ESISTE, E PERCHÉ NON È UN DOPPIONE — la parte che conta.
   La domanda «una voce di tendina ci sta nella sua tendina?» la fa GIÀ
   `modali-dentro.mjs`, e la fa bene: cammina sui comandi, apre le finestre,
   guarda ogni `<option>` e boccia quella SCELTA. Non serviva un secondo
   camminatore, e infatti qui non c'è: l'apritore è lo stesso
   (`apri-modali.mjs`), il giro delle superfici è lo stesso (`giro.mjs`).
   Quello che cambia è il RIGHELLO, ed è tutta la ragione di questo file.

   `modali-dentro` misura lo spazio così:

       const spazio = s.clientWidth - paddingLeft - paddingRight;

   e accanto ci scrive la sua ipotesi, onestamente dichiarata:
   *«la freccia della tendina sta DENTRO quel margine perché `select.dw-input`
   la disegna col padding — dove non fosse così la misura è prudente, cioè
   assolve»*. **L'ipotesi è falsa, e la misura dice di quanto**: Chromium
   disegna la freccia dentro la SCATOLA DI CONTENUTO, non dentro il padding, e
   si prende **circa 20 px** che al testo non arrivano mai. Quel righello quindi
   non è prudente: è **cieco su una banda di 20 px**, e nella direzione che
   assolve.
   Il difetto che ci viveva dentro, misurato il 09/08 e corretto lo stesso
   giorno: `#vf-esito` di Scudo mostrava «— nessun esito registrato —», che
   chiede **201,9 px** di testo dove `clientWidth - padding` ne dà **214** a
   320 px. `modali-dentro` lo assolveva — 201,9 < 214 — e il testo era
   **tagliato**: sullo schermo si leggeva «— nessun esito registrat…».
   È alla lettera la regola di CLAUDE.md: *un controllo tenuto largo «per non
   fare falsi allarmi» può essere cieco proprio dove serve, e il costo della
   stretta si MISURA, non si teme.*

   ⛔ LA DOMANDA GIUSTA NON SI CALCOLA, SI CHIEDE AL BROWSER. Niente
   sottrazioni mie: si clona la tendina con la SOLA opzione da provare, le si
   toglie la larghezza imposta (`width:max-content`) e si legge quanto il
   browser dice di volere per mostrarla intera — testo + padding + freccia +
   bordi, tutto quello che c'è, senza che io debba sapere quanto misura
   nessuno dei pezzi. Se chiede più della scatola vera, il testo è tagliato.
   È la stessa disciplina che questo repository predica altrove: `scrollWidth >
   clientWidth` è la risposta del browser a «esce?», e l'altezza divisa per il
   corpo del carattere non lo è.

   ⚠️ E SU UN `<select>` `scrollWidth` NON RISPONDE: con `overflow:hidden` e
   `text-overflow:ellipsis` un `<select>` dà `scrollWidth === clientWidth`
   anche con l'opzione al doppio della sua larghezza. È per questo che né
   `fuori-schermo.mjs` (che chiede «esce dallo schermo?») né
   `barra-etichette.mjs` (che chiede «la parola sta nella sua colonna?»)
   potevano vedere questa famiglia: non è che guardassero male, è che la
   domanda che sanno fare, su una tendina, risponde SEMPRE «a posto».

   ⛔ COSA BOCCIA E COSA NO, ed è una decisione già presa e misurata altrove
   (`shared/dw-app-ui.css`, 31/07: 19 tendine su 84 tagliano almeno un'opzione
   e NESSUNA diventa ambigua). Casca la voce **scelta** — quella che si vede a
   tendina chiusa, cioè quella che l'utente sta leggendo: se è tagliata, il
   valore mostrato è monco. Le altre si contano e si DICHIARANO in fondo,
   perché un numero tolto in silenzio è un numero che qualcuno rimetterà.

   ⛔ E CASCA ANCHE LA VOCE VUOTA (`value=""`), SEMPRE, ANCHE SE NON È QUELLA
   SCELTA — ed è la lezione che questo banco esiste per non far ripetere, non
   una comodità. La voce vuota è quella che si vede **finché nessuno ha
   compilato il campo**: è lo stato di partenza di ogni scheda nuova, cioè il
   caso più comune del prodotto. Ed è il MENO misurato, perché nella
   dimostrazione i campi sono quasi tutti pieni: CLAUDE.md lo dice testualmente
   di «— nessun verbale —» («nella dimostrazione tutt'e due le verifiche il
   verbale ce l'hanno già»), ed è la stessa ragione per cui il taglio di
   «— nessun esito registrato —» non l'ha mai visto nessuno.
   ⚠️ Senza questa riga il banco sarebbe stato **non deterministico**: misurato
   mentre lo scrivevo — l'apritore prova due comandi per forma, e nello
   scadenzario le prime due righe con verifica periodica hanno l'esito **già
   registrato**, quindi la voce vuota di `#vf-esito` non era mai quella scelta e
   la controprova non la incontrava. Un banco che prende il difetto solo se
   capita di cliccare la riga giusta è la quinta causa del «non distingue»: il
   caso difeso non c'è nella prova.

   ⛔ IL RIGHELLO È UNO SOLO, ED È ANCHE IN `modali-dentro.mjs` — DAL 09/08.
   Quel banco la domanda la faceva già, e sbagliava soltanto il righello:
   confrontava la larghezza del solo TESTO con `clientWidth - padding`, con
   scritta accanto l'ipotesi (falsa) che la freccia stesse dentro il padding.
   La correzione è entrata lì, misurando prima il costo della stretta: **due
   allarmi nuovi in tutto il repository, zero falsi** — `#sm-cava` del core e
   `#ppv-scelta` di Sentinella, tutt'e due tagli veri.

   ⛔ ALLORA PERCHÉ QUESTO FILE ESISTE ANCORA? Per una ragione sola, e MISURATA:
   **le larghezze**. `modali-dentro` ne guarda due (390 e 320) perché misura
   tutto quello che sta in una finestra e a due larghezze dura già 16m34s,
   contro la mezz'ora che `tutti.mjs` concede a una passata. Qui si chiede una
   domanda sola, quindi quattro larghezze costano due minuti a superficie.
   E servono: il taglio di una tendina vive in una FASCIA di larghezze, non
   sopra una soglia, perché il corpo del carattere dei campi cambia coi `@media`
   e la voce si stringe insieme alla scatola. Misurato su `#ppv-scelta`:
   taglia a **360** (297 px in 282) e a **390** (331 in 312), e NON taglia né a
   320 né a 430. Con le due larghezze dell'altro banco è stato preso a 390,
   cioè per fortuna: una voce la cui fascia cadesse tutta dentro 360 non la
   vedrebbe nessuno.
   ⚠️ Quindi i due NON sono due righelli per la stessa domanda: sono lo stesso
   righello a due coperture, e la divisione è dichiarata in tutt'e due i file.
   Il giorno in cui `modali-dentro` potesse permettersi quattro larghezze, la
   strada giusta è portargliele e TOGLIERE questo file — non tenerne due che
   col tempo divergono.

   ⚠️ LA PRECONDIZIONE È DICHIARATA. Se su una superficie non si apre nessuna
   finestra, il banco NON dice «a posto»: scrive `NON MISURATO`, la nomina, e
   esce diverso da zero. Un soggetto non misurato non è un soggetto a posto —
   se uscisse verde, la difesa sarebbe peggiore del difetto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, apriSuperficie, sezioniDi, vaiA, SUPERFICI, CHROMIUM } from "./giro.mjs";
import { SCEGLI, TOCCA, CHIUDI, DOVE, quanteModaliEsistono } from "./apri-modali.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || join(QUI, "..", "..", "..", "..");
const PORTA0 = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 9301;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const TUTTE = process.argv.includes("--tutte");
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
const LARGHEZZE = [320, 360, 390, 430];
const PER_FORMA = 2;          /* quanti comandi per FORMA: il taglio dipende dai dati */
const MAX_CLICK = 90;         /* tetto per sezione: un banco che non finisce non lo legge nessuno */

/* ⛔ LE SUPERFICI SU CUI SI PRETENDE, dichiarate. Scudo è quella in cui il
   difetto viveva ed è pulita alla misura di oggi: lì un taglio è un KO. Le
   altre si misurano lo stesso ma si CONTANO e si stampano, perché un banco che
   diventa rosso in casa d'altri viene spento, non riparato — ed è la disciplina
   già scritta in `fuori-schermo.mjs`. Chi pulisce la sua app si aggiunge qui e
   da lì in poi non ci torna. */
const PRETESE = new Set(["scudo"]);
const CANDIDATE = TUTTE ? SUPERFICI.map(([n]) => n) : ["scudo"];
const NOMI = (SOLO ? [SOLO] : CANDIDATE);

/* ⛔ I DUE DIFETTI DELLA CONTROPROVA, e sono DUE apposta: due etichette con due
   soglie diverse. Un banco che cade a tutte le larghezze non sta misurando la
   larghezza — sta misurando «c'è qualcosa che non va». Qui invece:
     · l'esito lungo (250 px) deve cadere SOLO a 320 (scatola 242);
     · il soggetto lungo (302 px) deve cadere a 320 E a 360 (scatola 282),
       e passare a 390 (312) e 430 (352).
   Se il banco misurasse un'altra cosa, i due non potrebbero separarsi.
   ⚠️ La tabella si chiama `DIFETTI` ed è nella forma a rotta perché
   `iniezioni-fresche.mjs` la legga: un'iniezione che non trova più il suo
   pezzo spegne la controprova IN SILENZIO, e quel controllo è l'unico che se
   ne accorge in tre secondi invece che in sei ore. */
const DIFETTI = {
  "apps/scudo/index.html": [[
    `"— nessun esito —")}</select>`,
    `"— nessun esito registrato —")}</select>`,
  ]],
  "apps/scudo/scudo-data.js": [[
    `nome: "Soggetto abilitato", quando:`,
    `nome: "Soggetto pubblico o privato abilitato", quando:`,
  ]],
};
/* le soglie che la controprova pretende: sotto questa larghezza il difetto
   DEVE farsi vedere, da questa in su NON deve — ed è la prova che il banco
   misura la larghezza e non l'umore */
const SOGLIE = [["vf-esito", 360], ["vf-ente", 390]];

const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ⛔ IL SERVER È MIO E LO DICHIARA. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro e dice cose vere su una
   cartella che nessuno sta guardando. La porta si cambia, e poi il contrassegno
   col proprio pid si RILEGGE dal server — è la sola prova che chi risponde sia
   io. Vale doppio qui: mentre questo banco gira può girare il giro completo,
   che serve una worktree su un commit più vecchio. */
let iniezioni = 0, mancate = 0;
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    for (const [file, coppie] of Object.entries(DIFETTI)) {
      if (!p.endsWith(file)) continue;
      let t = corpo.toString("utf8");
      for (const [cerca, sostituisci] of coppie) {
        const n = t.split(cerca).length - 1;
        /* ⚠️ UN `replace` CHE NON TROVA NIENTE NON FALLISCE: restituisce il
           testo identico, il banco gira su un prodotto SANO e dichiara «non
           distingue». Si conta e si dice. */
        if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); mancate++; }
        else { t = t.replace(cerca, sostituisci); iniezioni++; }
      }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let PORTA = 0;
for (let i = 0; i < 12 && !PORTA; i++) {
  const t = PORTA0 + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) PORTA = t; else srv.removeAllListeners("error");
}
if (!PORTA) { console.error(`✗ nessuna porta libera fra ${PORTA0} e ${PORTA0 + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${PORTA}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${PORTA} · contrassegno riletto = pid ${process.pid} ✔`);
}
if (CONTROPROVA) console.log("⚠️  CONTROPROVA: qui sotto il rosso è quello VOLUTO.");

/* ══ LA MISURA, dentro la pagina ═══════════════════════════════════════════
   Per ogni `<select>` della finestra aperta e per ogni sua opzione:
   · `intero`  — quanto il BROWSER dice di volere per mostrarla tutta;
   · `scatola` — quanto è larga davvero la tendina;
   · `vecchio` — lo spazio come lo calcola `modali-dentro` (clientWidth meno i
     padding). Non serve a giudicare: serve a stampare LA BANDA CIECA, cioè di
     quanto quel righello assolve. Un numero che qualcuno può rilanciare vale
     più di una frase che descrive una misura. */
const MISURA = () => {
  const ov = document.getElementById("modal");
  if (!ov || !ov.classList.contains("show")) return null;
  const out = [];
  for (const s of ov.querySelectorAll("select")) {
    const scatola = s.getBoundingClientRect().width;
    if (scatola < 1) continue;
    const cs = getComputedStyle(s);
    const vecchio = s.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    for (const o of s.options) {
      const cl = s.cloneNode(false);
      cl.removeAttribute("id");
      const oo = document.createElement("option");
      oo.textContent = o.textContent;
      cl.appendChild(oo);
      cl.style.cssText = cs.cssText;
      cl.style.position = "absolute"; cl.style.left = "-9999px"; cl.style.top = "0";
      cl.style.width = "max-content"; cl.style.minWidth = "0";
      cl.style.maxWidth = "none"; cl.style.flex = "0 0 auto";
      s.parentNode.appendChild(cl);
      const intero = cl.getBoundingClientRect().width;
      cl.remove();
      /* la misura del solo TESTO, con lo stesso righello di `modali-dentro`:
         serve a dire di quanto quel confronto è cieco, non a giudicare */
      const sp = document.createElement("span");
      sp.style.cssText = "position:absolute;left:-9999px;top:0;white-space:pre;visibility:hidden";
      sp.style.font = cs.font; sp.style.letterSpacing = cs.letterSpacing;
      sp.textContent = o.textContent;
      document.body.appendChild(sp);
      const testo = sp.getBoundingClientRect().width;
      sp.remove();
      out.push({
        id: s.id || (s.className || "select"),
        testo: (o.textContent || "").trim().slice(0, 46),
        intero: Math.round(intero * 10) / 10,
        scatola: Math.round(scatola * 10) / 10,
        larghezzaTesto: Math.round(testo * 10) / 10,
        vecchio: Math.round(vecchio * 10) / 10,
        scelta: o.selected,
        /* la voce VUOTA: quella che si vede finché il campo non è compilato.
           `value === ""` è la convenzione con cui tutte le tendine di questo
           ecosistema scrivono il proprio segnaposto (`opz(..., vuoto)`). */
        vuota: o.value === "",
        taglia: intero - scatola > 0.5,
        vistoDalVecchio: testo > vecchio + 1,
      });
    }
  }
  return out;
};

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });

/* ⛔ DUE CONTI SEPARATI, e non è pignoleria. I KO del PRODOTTO sono quelli che
   in controprova diventano il rosso VOLUTO; i verdetti della CONTROPROVA sono
   quelli che devono restare verdi anche lì — «l'iniezione ha trovato il suo
   pezzo», «cade sotto la soglia e non sopra». Sommandoli in un numero solo, una
   controprova rotta si nasconderebbe dietro il rosso che ha prodotto apposta:
   è la famiglia del rosso voluto che si legge uguale a quello vero. */
let ok = 0, ko = 0, prove = 0;
let vOk = 0, vKo = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 240)}` : ""}`); }
};
const verdetto = (c, t, x) => {
  prove++;
  if (c) { vOk++; console.log(`  ok  [verdetto] ${t}`); }
  else { vKo++; console.log(`  ✗   [verdetto] ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 240)}` : ""}`); }
};

/* i conti che vanno letti PRIMA dei KO: le righe «non ho guardato» */
const denom = [];              /* una riga per superficie e larghezza */
const nonMisurate = [];        /* superfici che non hanno aperto niente: NOMINATE */
const nonScelteTagliate = new Set();
const bandaCieca = new Set();  /* voci che il righello vecchio assolve e questo boccia */
const cascate = new Map();     /* id → larghezze a cui la voce scelta è tagliata */
/* ⛔ E I SOGGETTI CHE IL BANCO DEVE AVER VISTO, per nome. Un banco che gira
   senza incontrarli non è «a posto»: è un banco che ha guardato altrove — la
   famiglia del controllo che non guarda dove crede. Le due tendine della
   finestra della verifica periodica sono quelle su cui il difetto è vissuto,
   quindi sono la PRECONDIZIONE di questo banco e vanno nominate. */
const ATTESI = { scudo: ["vf-esito", "vf-ente", "vf-verbale"] };
const incontrati = new Set();
const scelteTagliate = new Set();

for (const nome of NOMI) {
  const via = (SUPERFICI.find(([n]) => n === nome) || [])[1];
  if (!via) { console.log(`  ·   superficie sconosciuta: ${nome}`); continue; }
  let sorgente = "";
  try { sorgente = readFileSync(join(R, via.replace(/^\//, "")), "utf8"); } catch (e) { /* la conta resta a zero */ }
  const nelProgramma = sorgente ? quanteModaliEsistono(sorgente) : 0;
  let aperteInTutto = 0, candidatiInTutto = 0;

  for (const larghezza of LARGHEZZE) {
    const { ctx, p } = await apriSuperficie(b, { nome, via, porta: PORTA, larghezza, altezza: 900 });
    const atteso = p.url();
    let aperteQui = 0, tendineQui = 0, opzioniQui = 0, tagliateQui = 0, candidatiQui = 0;
    const titoli = new Set();

    /* ⛔ OGNI NAVIGAZIONE PASSA DI QUI, E QUI SI PUÒ SOLO INCIAMPARE, NON
       MORIRE. `vaiA` chiama `page.waitForTimeout`: se la pagina è stata chiusa
       (un comando che apre una scheda, un contesto saltato) solleva, e il banco
       muore a metà giro — dichiarando MENO PROVE, che è la trappola scritta in
       CLAUDE.md: un totale più basso si legge «ha guardato meno roba», non «si
       è rotto». Misurato mentre scrivevo questo file: due larghezze su quattro
       stampate, la terza mai, e nessuna riga rossa a dirlo. */
    const torna = async (sez) => { if (p.isClosed()) return false; await vaiA(p, nome, sez).catch(() => {}); return !p.isClosed(); };
    for (const s of await sezioniDi(p, nome)) {
      if (p.isClosed()) break;
      if (!(await torna(s))) break;
      const casa = await p.evaluate(DOVE).catch(() => "");
      const fatti = [], forme = [];
      let diFila = 0, click = 0;
      while (click < MAX_CLICK) {
        if (p.isClosed()) break;
        const scelto = await p.evaluate(SCEGLI, [fatti, forme, PER_FORMA]).catch(() => null);
        if (!scelto) { if (++diFila >= 5) break; continue; }
        if (typeof scelto.restano === "number" && scelto.restano > candidatiQui) candidatiQui = scelto.restano;
        if (scelto.fine) break;
        fatti.push(scelto.chiave); forme.push(scelto.sagoma);
        click++;
        const r = await p.evaluate(TOCCA, 170).catch(() => null);
        if (p.isClosed()) break;
        if (!r || p.url() !== atteso) {
          diFila++;
          if (p.url() !== atteso) { await p.goto(atteso).catch(() => {}); await p.waitForTimeout(1000).catch(() => {}); await torna(s); }
          if (diFila >= 5) break;
          continue;
        }
        diFila = 0;
        if (r.restata) { await p.evaluate(CHIUDI).catch(() => {}); continue; }
        if (!r.aperta) {
          /* il tocco può aver portato altrove: si torna a casa, se no da qui
             in poi si misura un'altra schermata credendo di essere qui */
          const ora = await p.evaluate(DOVE).catch(() => casa);
          if (casa && ora !== casa) await torna(s);
          continue;
        }
        aperteQui++; titoli.add(r.titolo.replace(/\d+/g, "#").slice(0, 46));
        const voci = await p.evaluate(MISURA).catch(() => null);
        await p.evaluate(CHIUDI).catch(() => {});
        {
          const ora = await p.evaluate(DOVE).catch(() => casa);
          if (casa && ora !== casa) await torna(s);
        }
        if (!voci) continue;
        const viste = new Set(voci.map((v) => v.id));
        tendineQui += viste.size; opzioniQui += voci.length;
        for (const v of voci) {
          incontrati.add(v.id);
          if (DIMMI) console.log(`      · ${nome}@${larghezza} #${v.id} «${v.testo}» intero ${v.intero} scatola ${v.scatola}${v.scelta ? " (scelta)" : ""}`);
          if (v.taglia && !v.vistoDalVecchio) {
            bandaCieca.add(`${nome}@${larghezza} #${v.id} «${v.testo}» — chiede ${v.intero} in ${v.scatola}, ma il testo (${v.larghezzaTesto}) sta nei ${v.vecchio} del righello vecchio`);
          }
          if (!v.taglia) continue;
          tagliateQui++;
          /* si giudica quello che l'utente VEDE a tendina chiusa: la voce
             scelta adesso, e la voce vuota — che è quella che vedrà chiunque
             apra la scheda senza aver compilato il campo */
          if (!v.scelta && !v.vuota) { nonScelteTagliate.add(`${nome}|${v.id}|${v.testo}`); continue; }
          if (!cascate.has(v.id)) cascate.set(v.id, new Set());
          cascate.get(v.id).add(larghezza);
          scelteTagliate.add(`${nome}|${larghezza}|${v.id}|${v.testo}`);
          const perche = v.scelta ? "mostra" : "mostrerà, finché il campo è vuoto,";
          const riga = `${nome} @${larghezza} «${r.titolo.slice(0, 26)}»: la tendina #${v.id} ${perche} «${v.testo}» TAGLIATO — chiede ${v.intero} px in ${v.scatola}`;
          console.log(`  ·   ${PRETESE.has(nome) ? "" : "(non preteso) "}${riga}`);
        }
      }
    }
    aperteInTutto += aperteQui; candidatiInTutto += candidatiQui;
    denom.push(`${nome} @${larghezza}px: ${aperteQui} finestre aperte (${titoli.size} diverse) · ${tendineQui} tendine · ${opzioniQui} voci misurate · ${tagliateQui} tagliate`);
    /* ⛔ UNA PROVA PER SUPERFICIE E LARGHEZZA, SEMPRE LO STESSO NUMERO. Prima
       qui c'era un `dice` per ogni voce tagliata: il totale delle prove saliva
       coi difetti e SCENDEVA quando sparivano — cioè un banco che crolla a metà
       dichiara meno prove e nessuno se ne accorge, che è la trappola scritta in
       CLAUDE.md. Adesso la riga è una per larghezza e il totale è fisso: se ne
       manca una, il numero lo dice.
       ⚠️ E dice anche QUANTO ha guardato: una prova verde che ha misurato zero
       voci non è una prova, è un banco che non è arrivato. */
    const tagliateScelte = [...scelteTagliate].filter((x) => x.startsWith(`${nome}|${larghezza}|`));
    const testo = `${nome} @${larghezza}px: ${opzioniQui} voci misurate in ${aperteQui} finestre, `
      + `${tagliateScelte.length} voci VISIBILI (scelte o vuote) tagliate`;
    /* ⚠️ E SULLE SUPERFICI NON PRETESE LA PROVA NON SPARISCE, CAMBIA DOMANDA:
       lì si pretende solo di AVER GUARDATO (`opzioniQui > 0`), e i tagli si
       stampano come arretrato dichiarato. Contare un «non preteso» come un
       `ok` sarebbe un'etichetta più larga del suo numero — un verde che non ha
       verificato niente. Così invece ogni passata contata è una domanda vera,
       e il totale resta fisso comunque. */
    if (PRETESE.has(nome)) dice(opzioniQui > 0 && tagliateScelte.length === 0, testo, tagliateScelte.slice(0, 4));
    else dice(opzioniQui > 0, `(non preteso, guardato) ${testo}`);
    await ctx.close();
  }

  /* ⛔ LA PRECONDIZIONE. «Non misurato» non è «a posto»: se la superficie non
     ha aperto niente, il banco la NOMINA e non la assolve. E i due casi si
     separano, perché portano a due lavori opposti: zero candidati vuol dire
     che non ci siamo arrivati (accesso, navigazione, selettore); candidati sì
     e finestre no vuol dire che ci siamo arrivati e non c'era niente da aprire. */
  if (aperteInTutto === 0) {
    nonMisurate.push(`${nome}: NON MISURATO — ${candidatiInTutto} comandi trovati, 0 finestre aperte`
      + ` (nel suo programma ce ne sono ${nelProgramma} da aprire).`
      + (candidatiInTutto === 0 ? " Zero candidati: non ci sono arrivato." : " Candidati sì, finestre no."));
  } else {
    dice(true, `${nome}: ${aperteInTutto} finestre aperte in tutto (nel programma ce ne sono ${nelProgramma})`);
  }
  /* ⛔ E LA PRECONDIZIONE PER NOME. Il banco può girare, aprire ventiquattro
     finestre e non incontrare MAI la tendina su cui il difetto è vissuto: sarebbe
     verde avendo guardato altrove. I soggetti attesi si dichiarano e si
     pretendono — e quando non si presentano il banco NON accusa e NON assolve:
     scrive che non li ha misurati ed esce diverso da zero. */
  const attesi = ATTESI[nome] || [];
  if (attesi.length) {
    const persi = attesi.filter((x) => !incontrati.has(x));
    if (persi.length) nonMisurate.push(`${nome}: NON MISURATO — le tendine ${persi.map((x) => "#" + x).join(", ")} non sono mai comparse in nessuna finestra aperta.`);
    else dice(true, `${nome}: le ${attesi.length} tendine sorvegliate sono state incontrate tutte (${attesi.map((x) => "#" + x).join(", ")})`);
  }
}

await b.close();
srv.close();

/* ══ IL RIEPILOGO — e si legge dall'alto ═══════════════════════════════════ */
console.log("\n──── quello che ho guardato (da leggere PRIMA dei KO) ────");
for (const r of denom) console.log(`  · ${r}`);
console.log(`  · voci tagliate ma mai visibili a tendina chiusa (dichiarate, non bocciate): ${nonScelteTagliate.size}`);
if (nonScelteTagliate.size && DIMMI) for (const x of nonScelteTagliate) console.log(`      ${x}`);

console.log("\n──── la banda cieca del righello di modali-dentro ────");
console.log(`  ${bandaCieca.size} voci sono tagliate DAVVERO e il confronto «testo contro clientWidth-padding» le assolve.`);
{ const l = [...bandaCieca];
  for (const x of l.slice(0, 12)) console.log(`      ${x}`);
  if (l.length > 12) console.log(`      … e altre ${l.length - 12}`); }

if (nonMisurate.length) {
  console.log("\n──── NON MISURATE ────");
  for (const x of nonMisurate) console.log(`  ⚠️  ${x}`);
}

if (CONTROPROVA) {
  console.log("\n──── la controprova, nei due versi ────");
  console.log(`  iniezioni riuscite: ${iniezioni} · mancate: ${mancate}`);
  verdetto(mancate === 0, "tutte le iniezioni hanno trovato il loro pezzo (se no la controprova gira su un prodotto SANO)");
  /* ⛔ E QUI STA LA PROVA CHE IL BANCO MISURA LA LARGHEZZA. Due difetti, due
     soglie: sotto la sua soglia ognuno deve farsi vedere, da lì in su NO. Un
     banco che cade dappertutto passerebbe la prima metà e fallirebbe questa. */
  for (const [id, soglia] of SOGLIE) {
    const dove = cascate.get(id) || new Set();
    const sotto = LARGHEZZE.filter((l) => l < soglia);
    const sopra = LARGHEZZE.filter((l) => l >= soglia);
    verdetto(sotto.every((l) => dove.has(l)), `#${id}: col testo lungo cade a ${sotto.join(", ")} px`, [...dove]);
    verdetto(sopra.every((l) => !dove.has(l)), `#${id}: col testo lungo NON cade a ${sopra.join(", ")} px — è la LARGHEZZA che misura, non l'umore`, [...dove]);
  }
}

const nonMisuratoEProblema = nonMisurate.length > 0;
console.log(`\nRisultato tendine nelle finestre: ${ok} passati, ${ko} falliti · ${prove} prove`
  + (CONTROPROVA ? ` · verdetti della controprova: ${vOk} passati, ${vKo} falliti` : "")
  + (nonMisurate.length ? ` · ⚠️ ${nonMisurate.length} superfici NON MISURATE` : ""));
/* ⛔ NON MISURATO ≠ A POSTO: se una superficie non si è aperta, il banco non
   può uscire zero, se no la difesa è peggiore del difetto.
   In controprova il rosso del prodotto è VOLUTO e non conta; contano i
   verdetti, più la pretesa che un rosso ci sia stato davvero. */
if (CONTROPROVA) process.exit(vKo > 0 || ko === 0 || nonMisuratoEProblema ? 1 : 0);
process.exit(ko > 0 || nonMisuratoEProblema ? 1 : 0);
