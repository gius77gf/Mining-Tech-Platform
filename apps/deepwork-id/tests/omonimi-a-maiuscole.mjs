// DUE FILE CON LO STESSO NOME A MAIUSCOLE DIVERSE NON CONVIVONO SU WINDOWS E
// macOS — e su Linux, dove questo repository vive, nessuno se ne accorge.
//
// Misurato il 03/09: SEI coppie in `docs/` (`RICERCA_CONTINUA_CONTI.md` e
// `RICERCA_CONTINUA_conti.md`, e così per campo, flotta, scudo, sentinella,
// terra). Le minuscole erano nate il 14/08 da un agente di ricerca che
// cercava il file col nome sbagliato, non lo trovava, e ne creava uno —
// cioè la regola «la risposta è quasi sempre già in casa» applicata a un
// NOME DI FILE. Da allora le due serie crescevano ognuna per conto suo: la
// ricerca del 02/09 scriveva nella minuscola, il delta leggeva la maiuscola.
// Su un disco che non distingue le maiuscole (il portatile del fondatore, se
// è Windows o Mac) il `git clone` si sarebbe fermato con un errore, o avrebbe
// tenuto uno dei due file sovrascrivendo l'altro in silenzio.
//
// Il controllo guarda TUTTO il repository tracciato, non solo `docs/`: la
// stessa svista può nascere ovunque. Controprova nei due versi in fondo.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");

/* Pura, provabile: dato un elenco di percorsi ritorna i gruppi che collidono
   ignorando le maiuscole. */
export function omonimiAMaiuscole(percorsi) {
  const gruppi = new Map();
  for (const p of percorsi) {
    const k = p.toLowerCase();
    if (!gruppi.has(k)) gruppi.set(k, []);
    gruppi.get(k).push(p);
  }
  return [...gruppi.values()].filter((g) => g.length > 1).sort((a, b) => a[0].localeCompare(b[0]));
}

const tracciati = execFileSync("git", ["ls-files", "-z"], { cwd: RADICE, encoding: "utf8" }).split("\0").filter(Boolean);
const collisioni = omonimiAMaiuscole(tracciati);

let passati = 0, falliti = 0;
const prova = (nome, ok, dettaglio = "") => { (ok ? passati++ : falliti++); console.log(`  ${ok ? "✓" : "✗"} ${nome}${dettaglio ? " — " + dettaglio : ""}`); };

console.log(`\n═══ Omonimi a maiuscole diverse (${tracciati.length} file tracciati guardati) ═══`);
prova("nessuna coppia di file uguali a meno delle maiuscole", collisioni.length === 0,
  collisioni.length ? collisioni.map((g) => g.join(" ≠ ")).join("; ") : "0 collisioni");
prova("il denominatore non è vuoto (se no il verde parla di niente)", tracciati.length > 100, `${tracciati.length} file`);

// controprova: il righello sa fallire, e sa NON fallire su nomi davvero diversi
const finto = omonimiAMaiuscole(["docs/A.md", "docs/a.md", "docs/B.md", "apps/x/y.js", "apps/X/y.js"]);
prova("controprova: due coppie finte vengono viste", finto.length === 2 && finto[0].length === 2, JSON.stringify(finto));
prova("controprova: nomi diversi non collidono", omonimiAMaiuscole(["docs/A.md", "docs/AB.md", "docs/B.md"]).length === 0);

console.log(`\nRisultato omonimi a maiuscole: ${passati} passati, ${falliti} falliti`);
process.exit(falliti ? 1 : 0);
