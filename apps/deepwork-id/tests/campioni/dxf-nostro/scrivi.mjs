/* Scrive i disegni DXF di questa cartella col codice di prodotto.
     node apps/deepwork-id/tests/campioni/dxf-nostro/scrivi.mjs
   Poi li si fa leggere a ezdxf (`leggi.py`, qui accanto).
   NON VA IN npm test: è lo strumento che RIGENERA i campioni (scrive file),
   non una prova. La prova è `dxf-nostro-da-cad.mjs`, che pretende che i file
   committati siano ancora quelli che questo script scriverebbe. */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CASI } from "./casi.mjs";
const QUI = dirname(fileURLToPath(import.meta.url));
const genesi = await import("../../../../genesi/genesi-data.js");
for (const [nome, c] of Object.entries(CASI)) writeFileSync(join(QUI, nome + ".dxf"), genesi.dxfPianoFori(c.fori, c.diam, c.profilo, c.progetto));
console.log(Object.keys(CASI).length + " disegni scritti da Genesi in " + QUI);
