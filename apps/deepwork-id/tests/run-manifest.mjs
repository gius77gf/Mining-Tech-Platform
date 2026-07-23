// ============================================================
// Test dei manifest PWA di tutte le superfici installabili:
// core (index.html radice), Genesi, e le 6 app verticali. Garantisce
// che ogni manifest inline (data URI) resti JSON valido con i campi
// necessari all'installazione (nome, start_url, display standalone,
// theme_color esadecimale, almeno un'icona con src data:). Blinda la
// feature "app installabili sul telefono" contro regressioni di edit.
// ============================================================
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const root = join(HERE, "..", "..", "..");   // tests → deepwork-id → apps → radice

let passed = 0, failed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); } };
const ok = (cond, why) => { if (!cond) throw new Error(why); };

// superfici che DEVONO essere installabili (percorso relativo alla radice)
const SURFACES = [
  ["core (radice)", "index.html"],
  ["Genesi", "apps/genesi/genesi.html"],
  ["Conti", "apps/conti/index.html"],
  ["Flotta", "apps/flotta/index.html"],
  ["Scudo", "apps/scudo/index.html"],
  ["Campo", "apps/campo/index.html"],
  ["Sentinella", "apps/sentinella/index.html"],
  ["Terra", "apps/terra/index.html"],
];

function extractManifest(html) {
  const m = html.match(/rel="manifest"\s+href='data:application\/manifest\+json,([^']*)'/);
  if (!m) throw new Error("nessun <link rel=manifest> con data URI");
  return JSON.parse(decodeURIComponent(m[1]));   // come fa il browser: url-decode poi parse
}

console.log("\n— manifest PWA: presenza e validità —");
for (const [nome, rel] of SURFACES) {
  test(`${nome}: manifest JSON valido con i campi PWA`, () => {
    const html = readFileSync(join(root, rel), "utf8");
    const j = extractManifest(html);
    ok(j.name && j.name.length > 0, "name mancante");
    ok(j.short_name && j.short_name.length > 0, "short_name mancante");
    ok(j.start_url, "start_url mancante");
    ok(j.display === "standalone", `display deve essere standalone (è ${j.display})`);
    ok(/^#[0-9a-fA-F]{6}$/.test(j.theme_color || ""), `theme_color non esadecimale: ${j.theme_color}`);
    ok(/^#[0-9a-fA-F]{6}$/.test(j.background_color || ""), `background_color non esadecimale: ${j.background_color}`);
    ok(Array.isArray(j.icons) && j.icons.length >= 1, "nessuna icona");
    ok(j.icons[0].src && j.icons[0].src.startsWith("data:image/"), "icona senza src data:");
  });
}

test("i theme_color delle 6 verticali sono distinti (icone distinguibili)", () => {
  const themes = SURFACES.slice(2).map(([n, rel]) => extractManifest(readFileSync(join(root, rel), "utf8")).theme_color);
  ok(new Set(themes).size === themes.length, "due app hanno lo stesso theme_color: " + themes.join(","));
});

console.log(`\nRisultato manifest: ${passed} passati, ${failed} falliti`);
if (failed) process.exit(1);
