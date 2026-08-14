/* ⛔ IL FILTRO DEL GIRO: SCEGLIE DAVVERO, E DICHIARA CHE COSA HA LASCIATO FUORI.
   ══════════════════════════════════════════════════════════════════════════
   `tutti.mjs` ha 198 passate a 4,1 minuti l'una: 13,5 ore, cioè più di una
   sessione. Con `--solo=` un ciclo verifica in minuti le superfici toccate.
   Ma un filtro senza dichiarazione è **peggio** del giro lento: un giro
   parziale stampa le stesse identiche frasi di un giro intero — stesse
   intestazioni, stesso «N banchi a posto» — e chi legge il registro crede di
   avere davanti il verdetto di tutto il prodotto. È la famiglia già pagata
   quattro volte in questo repository (il registro troncato che sembra
   completo, il rosso voluto letto come guasto, il riepilogo contato due
   volte), e la cura è sempre la stessa: **un dato che il programma ha in mano
   non si indovina dal testo, si stampa**.

   Questo file prova le due cose nei DUE versi, perché una guardia che scatta
   sempre passerebbe metà delle domande e renderebbe il giro impossibile da
   usare:
     · col filtro  → meno passate, e la riga «GIRO PARZIALE» con quante ne
       restano fuori;
     · senza       → tutte e 198, e **nessuna** riga di parzialità;
     · nome ignoto → il giro NON parte e esce diverso da zero (è il difetto già
       chiuso su `contrasto-non-testo.mjs`, dove un `--solo=` sbagliato usciva
       zero dichiarando di non aver guardato niente).

   La metà pura (`scegliBanchi`) si prova qui in millisecondi; il collegamento
   al runner si prova lanciando un giro **finto** (`--banchi-finti`), che non
   apre nessun browser — perché una guardia scollegata non è un errore di
   sintassi e si vede solo provandola.

   Uso:  node apps/deepwork-id/tests/browser/filtro-banchi.mjs                */

import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { scegliBanchi, dichiaraFiltro, combacia } from "./scegli-banchi.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ✓ ${t}`); } else { ko++; console.log(`  ✗ ${t}${x !== undefined ? `: ${x}` : ""}`); } };

/* ══ 1. LA SCELTA, sui banchi VERI ═══════════════════════════════════════
   ⚠️ Non su una lista inventata: una prova su banchi finti direbbe che la
   funzione funziona, non che funziona **su questo giro**. I banchi si leggono
   dal sorgente di `tutti.mjs` — importarlo alzerebbe un server e aprirebbe
   Chromium, ed è la ragione per cui la scelta sta in un file suo. */
const sorgente = readFileSync(join(QUI, "tutti.mjs"), "utf8");
const blocco = sorgente.slice(sorgente.indexOf("const BANCHI = ["), sorgente.indexOf("\nconst FINTI = ["));
/* ⚠️ `[^']+` NON basta, e questa riga è già costata una misura sbagliata: sei
   nomi contengono un apostrofo sfuggito («la manina promette un tocco che
   c\'è», «non trabocca all\'indietro»), e il righello si fermava lì — 192 su
   198, cioè una prova che dichiarava di guardare tutti i banchi guardandone
   il 97%. È il terzo apostrofo che inganna uno strumento in questa casa. */
const VERI = [...blocco.matchAll(/^\s*\['((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'/gm)].map((m) => [m[1], m[2]]);
/* ⛔ IL DENOMINATORE, e non è una formalità: è la sola riga che si accorge se
   domani qualcuno scrive una passata in una forma che questo lettore non
   conosce. Senza, un «25 passati» resterebbe verde guardando meno soggetti. */
const APERTURE = (blocco.match(/^\s*\['/gm) || []).length;

dice(VERI.length === APERTURE,
  `i banchi veri si leggono TUTTI dal sorgente (${VERI.length} lette su ${APERTURE} dichiarate)`,
  `${VERI.length}/${APERTURE}`);

const tutto = scegliBanchi(VERI, {});
dice(tutto.scelti.length === VERI.length, "senza filtro restano TUTTE le passate", tutto.scelti.length);
dice(tutto.fuori === 0 && tutto.ignoti.length === 0, "e non c'è niente fuori");
dice(dichiaraFiltro(tutto, {}) === null, "e non stampa nessuna riga di parzialità: un avviso sempre acceso non si legge più");

const scudo = scegliBanchi(VERI, { solo: "scudo" });
dice(scudo.scelti.length > 0 && scudo.scelti.length < VERI.length,
  `--solo=scudo ne sceglie ${scudo.scelti.length} su ${VERI.length}`, scudo.scelti.length);
dice(scudo.scelti.every(([n, f]) => /scudo/i.test(n) || /scudo/i.test(f)), "e sono tutte di Scudo");
dice(scudo.fuori === VERI.length - scudo.scelti.length, "e il conto di quelle fuori torna", scudo.fuori);
dice(/GIRO PARZIALE/.test(dichiaraFiltro(scudo, { solo: "scudo" }) || ""), "e la riga lo DICHIARA");
dice(/NON sono state misurate/.test(dichiaraFiltro(scudo, { solo: "scudo" }) || ""),
  "e dice che le altre non sono misurate, non che sono a posto");

/* ⛔ UNA PASSATA E LA SUA CONTROPROVA NON SI POSSONO SEPARARE: un banco scelto
   senza la sua controprova gira senza la prova di saper fallire, cioè il verde
   che vale meno di tutti. Il filtro combacia sul FILE, quindi le prende
   insieme per costruzione — e questa prova pretende che resti vero. */
const conControprove = scudo.scelti.filter(([n]) => / · controprova| · .*controprova/i.test(n)).length;
dice(conControprove > 0, `e si porta dietro le controprove dello stesso file (${conControprove})`, conControprove);

/* gli ignoti si contano UNO PER UNO: se si guardasse solo il risultato
   complessivo, un nome storto accanto a uno buono sparirebbe */
const misto = scegliBanchi(VERI, { solo: "scudo,questonomenonesiste" });
dice(misto.ignoti.length === 1 && misto.ignoti[0] === "questonomenonesiste",
  "un nome storto accanto a uno buono viene NOMINATO lo stesso", JSON.stringify(misto.ignoti));

const daN = scegliBanchi(VERI, { da: 61 });
dice(daN.scelti.length === VERI.length - 60 && daN.saltate === 60,
  "--da=61 riparte dalla 61ª (le prime 60 restano fuori, e si contano)", `${daN.scelti.length}/${daN.saltate}`);
dice(daN.scelti[0][0] === VERI[60][0], "e la prima scelta è davvero la 61ª: --da= è 1-based come il registro");

dice(combacia("SCUDO", "i documenti di Scudo", "scudo-documenti.mjs"), "le maiuscole non contano da nessuno dei due lati");
dice(!combacia("", "qualsiasi", "qualsiasi.mjs"), "un pezzo vuoto non combacia con tutto");

/* ══ 2. IL COLLEGAMENTO AL RUNNER, con un giro finto (niente browser) ═════ */
const radice = mkdtempSync(join(tmpdir(), "filtro-banchi-"));
mkdirSync(join(radice, "shared"), { recursive: true });
writeFileSync(join(radice, "index.html"), "<!doctype html><p>finta</p>");

function giro(extra) {
  return new Promise((r) => {
    execFile(process.execPath,
      [join(QUI, "tutti.mjs"), "8997", "--banchi-finti", `--radice-impronta=${radice}`, "--limite=60", ...extra],
      { encoding: "utf8", timeout: 120000 },
      (err, stdout, stderr) => r({ codice: err ? (err.code ?? 1) : 0, testo: (stdout || "") + (stderr || "") }));
  });
}

console.log("\n── Il collegamento al runner (giro finto, niente browser) ──");

const intero = await giro([]);
dice(/finto 1/.test(intero.testo) && /finto 3/.test(intero.testo), "senza filtro girano tutte le passate finte");
dice(!/GIRO PARZIALE/.test(intero.testo), "e NON compare la riga di parzialità", intero.testo.slice(-200));
dice(intero.codice === 0, `e il giro finto esce zero (uscita ${intero.codice})`, intero.codice);

const filtrato = await giro(["--solo=finto 1"]);
dice(/finto 1/.test(filtrato.testo), "col filtro la passata scelta gira");
dice(!/finto 3/.test(filtrato.testo), "e le altre NON girano", filtrato.testo.slice(-300));
dice(/GIRO PARZIALE/.test(filtrato.testo), "e il registro dichiara di essere parziale");
dice(/--solo=finto 1/.test(filtrato.testo), "e dice con quale filtro è stato lanciato");

const storto = await giro(["--solo=nomecheNONesiste"]);
dice(storto.codice !== 0, `un nome sconosciuto NON esce zero (uscita ${storto.codice})`, storto.codice);
dice(/non combaciano con nessuna passata/.test(storto.testo), "e lo dice invece di lanciare tutto o niente");
dice(!/finto 1/.test(storto.testo), "e non ha misurato niente: si è fermato PRIMA di alzare il server");

console.log(`\nRisultato filtro dei banchi: ${ok} passati, ${ko} falliti`
  + `  ·  ${VERI.length} passate vere lette dal sorgente, 3 giri finti`);
process.exit(ko > 0 ? 1 : 0);
