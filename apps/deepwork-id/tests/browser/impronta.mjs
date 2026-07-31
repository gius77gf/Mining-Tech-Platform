/* L'IMPRONTA DEI FILE CHE LE PAGINE CARICANO.
   ────────────────────────────────────────────────────────────────────────
   PERCHÉ ESISTE. `CLAUDE.md` scrive, da ieri, che non si modificano moduli
   dati e pagine mentre gira un giro del browser: quelle righe se le carica il
   banco, e il suo risultato diventa falso in un verso o nell'altro. La regola è
   scritta, chiara, con il racconto della volta che è costata 19 banchi — **e in
   due giorni è stata violata due volte, dalla stessa persona che l'ha
   scritta**.

   Il repository lo dice già di sé stesso, in un'altra pagina: *«una regola
   scritta è affidata alla memoria di chi legge»*. Le due volte che quella frase
   è servita, la risposta è stata la stessa: si smette di scriverla e si mette
   un controllo. Questo è il controllo.

   COSA FA. Prende l'impronta dei file che una pagina carica davvero — le nove
   superfici, i moduli dati, `shared/` — prima del giro, fra un banco e l'altro
   e alla fine. Se qualcosa cambia, il giro **dichiara sé stesso NON VALIDO**
   invece di stampare un riepilogo verde, e dice **dopo quale banco** è
   cambiato: i banchi prima di quel punto hanno misurato il codice giusto, gli
   altri no.

   COSA NON GUARDA, DI PROPOSITO. I file sotto `tests/` (nessuna pagina li
   importa: le iniezioni lì sono sicure, e lo dice `CLAUDE.md`), `docs/`,
   `vault/`, `.git`. Un controllo che grida al lupo quando si scrive un
   documento viene spento entro il secondo giro. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative, sep } from "node:path";

/* Le cartelle in cui NON si entra mai. `tests` è nell'elenco per una ragione
   precisa, non per velocità: modificare un file di prova durante un giro è
   legittimo, e segnalarlo renderebbe il controllo rumoroso proprio nel caso in
   cui il lavoro è permesso. */
const FUORI = new Set([".git", "node_modules", "tests", "docs", "vault", ".github", "img", "immagini"]);

/* Quello che una pagina carica: sé stessa, i suoi moduli, gli stili. `.json` e
   `.webmanifest` ci stanno perché il core e le app li leggono a runtime. */
const CONTA = /\.(html|js|mjs|css|json|webmanifest)$/i;

export function impronta(radice) {
  const fuori = new Map();
  const cammina = (dir) => {
    for (const v of readdirSync(dir, { withFileTypes: true })) {
      if (v.name.startsWith(".") && v.name !== ".well-known") continue;
      const p = join(dir, v.name);
      if (v.isDirectory()) { if (!FUORI.has(v.name)) cammina(p); continue; }
      if (!CONTA.test(v.name)) continue;
      const rel = relative(radice, p).split(sep).join("/");
      fuori.set(rel, createHash("sha1").update(readFileSync(p)).digest("hex"));
    }
  };
  cammina(radice);
  return fuori;
}

/* Le differenze fra due impronte, già in italiano: che cosa è cambiato e come.
   Si distinguono le tre forme perché portano informazioni diverse — un file
   *sparito* durante un giro è un guaio più grosso di uno modificato. */
export function differenze(prima, dopo) {
  const d = [];
  for (const [f, h] of dopo) {
    if (!prima.has(f)) d.push({ file: f, come: "aggiunto" });
    else if (prima.get(f) !== h) d.push({ file: f, come: "modificato" });
  }
  for (const f of prima.keys()) if (!dopo.has(f)) d.push({ file: f, come: "sparito" });
  return d;
}

/* CONTROPROVA DEL RILEVATORE — `node impronta.mjs --controprova`.
   Lavora su una cartella temporanea sua: non tocca il repository, che è
   esattamente il gesto che questo file esiste per impedire. */
if (process.argv[1] && process.argv[1].endsWith("impronta.mjs") && process.argv.includes("--controprova")) {
  const { mkdtempSync, writeFileSync, mkdirSync, rmSync, unlinkSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const base = mkdtempSync(join(tmpdir(), "impronta-"));
  mkdirSync(join(base, "apps", "terra"), { recursive: true });
  mkdirSync(join(base, "tests"), { recursive: true });
  mkdirSync(join(base, "docs"), { recursive: true });
  writeFileSync(join(base, "index.html"), "<h1>core</h1>");
  writeFileSync(join(base, "apps", "terra", "index.html"), "<h1>terra</h1>");
  writeFileSync(join(base, "apps", "terra", "terra-data.js"), "export const a = 1;\n");
  writeFileSync(join(base, "apps", "terra", "note.txt"), "non è codice");
  writeFileSync(join(base, "tests", "run-kpi.mjs"), "// una prova\n");
  writeFileSync(join(base, "docs", "scheda.md"), "# scheda\n");

  const a = impronta(base);
  let ok = 0, ko = 0;
  const dice = (buono, t, extra) => { if (buono) { ok++; console.log(`  ok  ${t}`); }
    else { ko++; console.log(`  KO  ${t}${extra !== undefined ? ` -> ${JSON.stringify(extra)}` : ""}`); } };

  console.log(`\n════════ il rilevatore sa accorgersene? ════════`);
  dice(a.size === 3, `guarda i 3 file che una pagina carica, non gli altri 3`, [...a.keys()]);
  dice(differenze(a, impronta(base)).length === 0, "senza cambiamenti non dice niente");

  /* 1 — un modulo dati modificato: è il caso vero, quello già successo due volte */
  writeFileSync(join(base, "apps", "terra", "terra-data.js"), "export const a = 2;\n");
  const d1 = differenze(a, impronta(base));
  dice(d1.length === 1 && d1[0].file === "apps/terra/terra-data.js" && d1[0].come === "modificato",
    "un modulo dati modificato viene visto, e nominato", d1);

  /* 2 — un file di PROVA modificato: NON deve dire niente. È la metà che rende
     il controllo utilizzabile: durante un giro si lavora sulle suite. */
  writeFileSync(join(base, "tests", "run-kpi.mjs"), "// due prove\n");
  writeFileSync(join(base, "docs", "scheda.md"), "# scheda cambiata\n");
  const d2 = differenze(a, impronta(base)).filter((x) => x.file !== "apps/terra/terra-data.js");
  dice(d2.length === 0, "modificare test e documenti NON fa scattare niente", d2);

  /* 3 — una pagina sparita */
  unlinkSync(join(base, "apps", "terra", "index.html"));
  const d3 = differenze(a, impronta(base)).filter((x) => x.come === "sparito");
  dice(d3.length === 1 && d3[0].file === "apps/terra/index.html", "una pagina sparita viene vista", d3);

  /* 4 — una pagina nuova */
  writeFileSync(join(base, "apps", "terra", "stampa.html"), "<h1>nuova</h1>");
  const d4 = differenze(a, impronta(base)).filter((x) => x.come === "aggiunto");
  dice(d4.length === 1 && d4[0].file === "apps/terra/stampa.html", "una pagina nuova viene vista", d4);

  rmSync(base, { recursive: true, force: true });
  console.log(`\n${ok} passate, ${ko} fallite`);
  process.exit(ko ? 1 : 0);
}
