/* TUTTI I DOCUMENTI CHE ESCONO DALLE SEI APP, SULLA DIMOSTRAZIONE, SENZA BROWSER
   ═══════════════════════════════════════════════════════════════════════
   Uso: node apps/deepwork-id/tests/documenti-dimostrazione.mjs [--dimmi]
        node apps/deepwork-id/tests/documenti-dimostrazione.mjs --controprova
          (sporca in memoria il primo documento di ogni app con «undefined»,
           «1 rilievi» e «€ 0,00»: le prove 3 e 4 DEVONO cadere e la misura
           salire di 6 — un righello che non sa fallire non dimostra niente)

   PERCHÉ ESISTE. Il 05/09 ogni file e ogni foglio che esce dalle sei app è
   diventato una funzione pura del modulo (`csv*`, `foglia*`,
   `rapportoGiornata`, `prospettoDenuncia`, `testoConsegnaTurno`,
   `verbaleRilievo`, `relazioneLotto`). Quindi il «premere ogni bottone che
   produce un file e aprire il file» — che CLAUDE.md prescrive e che finora
   voleva un browser — si può fare qui in due secondi, su TUTTI i documenti
   insieme, con gli stessi dati di dimostrazione.

   CHE COSA GIUDICA (asserzioni):
     1. ogni documento si compone senza sollevare, e non è vuoto;
     2. nessun documento contiene «undefined», «NaN», «[object Object]» o la
        parola «null» come testo (il CSV di Conti l'ha già scritta una volta);
     3. nessun singolare sbagliato: «1 rilievi», «1 fermi», «1 giorni»… (la
        famiglia delle 32 frasi corrette il 03/08, letta sui documenti veri).
   CHE COSA MISURA E STAMPA, senza giudicare (candidati, non verdetti):
     · quante celle «tranquille» ci sono (€ 0,00 · 0% · 0 m³ · ;0;) per
       documento — un numero tranquillo dove non è stato misurato niente è il
       difetto del fondatore, ma se lo zero sia misurato o no lo sa solo chi
       apre il documento: qui si contano e si elencano con --dimmi.
   Il denominatore si stampa: quanti documenti, quante funzioni, quanti
   caratteri. Un documento che non si riesce a chiamare NON è «a posto»: si
   conta a parte e fa cadere la prova 1. */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const DIMMI = process.argv.includes("--dimmi");
const CONTROPROVA = process.argv.includes("--controprova");
const app = async (n) => import(join(HERE, "..", "..", n, n + "-data.js"));
const [campo, conti, flotta, scudo, sentinella, terra] = await Promise.all(["campo", "conti", "flotta", "scudo", "sentinella", "terra"].map(app));
const shell = await import(join(HERE, "..", "..", "..", "shared", "deepwork-id-client", "dw-shell.js"));
const OGGI = new Date(2026, 8, 5), OGGI_ISO = "2026-09-05";
const dmy = (iso) => shell.dataIt(iso, "senza data");

let passati = 0, falliti = 0;
const ok = (c, t, x) => { if (c) { passati++; console.log("  ✓ " + t); } else { falliti++; console.log("  ✗ " + t + (x !== undefined ? "\n      " + String(x).slice(0, 600) : "")); } };

/* ── I DOCUMENTI: uno per riga, con gli argomenti della dimostrazione — gli
      stessi che passa la pagina (le chiamate sono copiate dai bottoni). ── */
const DOC = [];
const doc = (a, nome, f) => DOC.push({ app: a, nome, f });
{ // TERRA
  const D = terra.DEMO, aut = terra.autorizzazioneVigente(D.autorizzazioni);
  const R = terra.riepilogoAnnuale(D.rilievi, 2026, aut);
  const DEN = { R, aut, soglia: aut && +aut.sogliaGuardiaPct > 0 ? +aut.sogliaGuardiaPct : null, base: terra.baseOnereEscavazione(R, {}), banchi: terra.ripartizioneBanchi(R, D.fronti) };
  doc("terra", "csvInventari", () => terra.csvInventari(D.inventari));
  doc("terra", "csvRiepilogoAnno", () => terra.csvRiepilogoAnno(DEN, D.fronti, OGGI));
  doc("terra", "csvFrontiRilievi", () => terra.csvFrontiRilievi(D.fronti, D.rilievi));
  doc("terra", "csvRilievi", () => terra.csvRilievi(D.rilievi, D.fronti));
  doc("terra", "prospettoDenuncia", () => terra.prospettoDenuncia(DEN, D.fronti, OGGI));
  for (const l of D.lotti) doc("terra", "relazioneLotto " + l.id, () => terra.relazioneLotto(l, D.rilievi, D.fronti, OGGI));
  for (const r of D.rilievi.filter((x) => terra.rilievoUsabile(x))) doc("terra", "verbaleRilievo " + r.id, () => terra.verbaleRilievo(r, { rilievi: D.rilievi, fronti: D.fronti, autorizzazioni: D.autorizzazioni }));
}
{ // CONTI
  const D = conti.DEMO, NOT = D.note || [];
  doc("conti", "csvSituazioneFatture", () => conti.csvSituazioneFatture(D.fatture, D.incassi, NOT, D.clienti));
  doc("conti", "csvIncassi", () => conti.csvIncassi(D.incassi));
  doc("conti", "csvProspettoIncassi", () => conti.csvProspettoIncassi(D.incassi, D.fatture, NOT, D.clienti));
  doc("conti", "csvClienti", () => conti.csvClienti(D.clienti));
  doc("conti", "csvProspettoClienti", () => conti.csvProspettoClienti(D.clienti));
  doc("conti", "csvProspettoCosti", () => conti.csvProspettoCosti(D.costi, "2026-01-01", "2026-12-31"));
  doc("conti", "csvPrezziConvertiti", () => conti.csvPrezziConvertiti(D.prodotti));
  doc("conti", "csvPesate", () => conti.csvPesate(D.pesate));
  doc("conti", "csvProspettoDdt", () => conti.csvProspettoDdt(D.pesate, D.fatture, D.ordini));
  doc("conti", "csvListino", () => conti.csvListino(D.prodotti));
  doc("conti", "csvGare", () => conti.csvGare(D.gare));
  doc("conti", "csvProspettoPreventivi", () => conti.csvProspettoPreventivi(D.ordini, D.clienti, OGGI));
  for (const o of D.ordini) doc("conti", "fogliaPreventivo " + o.id, () => conti.fogliaPreventivo(o, { clienti: D.clienti, oggi: OGGI }));
  for (const p of D.pesate) doc("conti", "fogliaDdt " + p.id, () => conti.fogliaDdt(p, { clienti: D.clienti }));
  for (const f of D.fatture) doc("conti", "fogliaFattura " + f.id, () => conti.fogliaFattura(f, { clienti: D.clienti, incassi: D.incassi, note: NOT }));
}
{ // CAMPO
  const D = campo.DEMO;
  const dg = (l) => (l || []).filter((r) => campo.eDelGiorno(r, OGGI_ISO));
  const d = { oggi: OGGI_ISO, rapportini: dg(D.rapportini), attivita: dg(D.attivita), obiettivi: D.obiettivi, checklist: D.checklist,
    meteo: D.meteo, chiusure: D.chiusure, squadre: D.squadre, operatori: D.operatori, presenze: D.presenze, durate: D.durate,
    volateSentinella: D.volateSentinella, infortuniScudo: D.infortuniScudo };
  for (const t of campo.TURNI) doc("campo", "csvAppello " + t, () => campo.csvAppello(D.operatori, D.presenze, D.durate, OGGI_ISO, t, "", dmy));
  doc("campo", "csvStorico", () => campo.csvStorico(campo.storicoSettimana(D.attivita, D.rapportini, 14), campo.registrazioniSenzaGiorno(D.attivita, D.rapportini)));
  doc("campo", "csvAttivita", () => campo.csvAttivita(D.attivita));
  doc("campo", "csvSquadre", () => campo.csvSquadre(D.squadre));
  doc("campo", "testoConsegnaTurno", () => campo.testoConsegnaTurno(d, { avviso: "", dmy }));
  doc("campo", "rapportoGiornata", () => campo.rapportoGiornata(d, { dmy }));
}
{ // SCUDO
  const D = scudo.DEMO;
  doc("scudo", "csvRegistroInfortuni", () => scudo.csvRegistroInfortuni(D.infortuni));
  doc("scudo", "csvPersonaleScadenze", () => scudo.csvPersonaleScadenze(D.lavoratori, D.scadenze, D.documenti));
  doc("scudo", "csvAzioni", () => scudo.csvAzioni(D.azioni));
  doc("scudo", "csvProspettoAzioni", () => scudo.csvProspettoAzioni(D.azioni, { lavoratori: D.lavoratori, infortuni: D.infortuni, ispezioni: D.ispezioni }));
  doc("scudo", "csvRiepilogoNearMiss", () => scudo.csvRiepilogoNearMiss(D.infortuni, D.azioni, 90, OGGI));
  for (const l of D.lavoratori) {
    doc("scudo", "fogliaVerbaleDpi " + l.id, () => scudo.fogliaVerbaleDpi(l, { dpi: D.dpi, mansioni: D.mansioni, oggi: OGGI }));
    doc("scudo", "fogliaCartella " + l.id, () => scudo.fogliaCartella(scudo.cartellaLavoratore(l, { scadenze: D.scadenze, mansioni: D.mansioni, dpi: D.dpi, nomine: D.nomine, documenti: D.documenti }, OGGI), OGGI));
  }
}
{ // FLOTTA
  const D = flotta.DEMO;
  doc("flotta", "csvRegistroInterventi", () => flotta.csvRegistroInterventi(D.interventi));
  doc("flotta", "csvScadenzeDiLegge", () => flotta.csvScadenzeDiLegge(D.scadenze, D.mezzi, OGGI, 30));
  doc("flotta", "csvCosti", () => flotta.csvCosti(D.costi));
  doc("flotta", "csvRicambi", () => flotta.csvRicambi(D.ricambi));
  doc("flotta", "csvSituazione", () => flotta.csvSituazione(D.mezzi, D.manutenzioni, D.ricambi, D.rifornimenti));
  doc("flotta", "csvGiriMacchina", () => flotta.csvGiriMacchina(D.controlli));
  doc("flotta", "csvListaDellaSpesa", () => flotta.csvListaDellaSpesa(flotta.propostaScorte(D.ricambi, D.interventi, {})));
  doc("flotta", "csvFermiMacchina", () => flotta.csvFermiMacchina(D.fermi, OGGI));
  doc("flotta", "csvBudget", () => flotta.csvBudget(flotta.budgetVsSpesa(D.budget, D.costi, 2026, OGGI)));
  for (const m of D.mezzi) doc("flotta", "csvLibretto " + (m.id || m.nome), () => flotta.csvLibretto(m, { manutenzioni: D.manutenzioni, interventi: D.interventi, scadenze: D.scadenze, controlli: D.controlli, rifornimenti: D.rifornimenti, fermi: D.fermi }, OGGI, 30));
}
{ // SENTINELLA
  const D = sentinella.DEMO;
  doc("sentinella", "csvRefertiGenesi", () => sentinella.csvRefertiGenesi(sentinella.refertiDaVolate(D.volate).tutti));
  doc("sentinella", "csvAmbiente", () => sentinella.csvAmbiente(D.monitoraggi, D.adempimenti, D.ricettori));
  doc("sentinella", "csvRegistroVolate", () => sentinella.csvRegistroVolate(D.volate));
  doc("sentinella", "csvRicettori", () => sentinella.csvRicettori(D.ricettori));
  doc("sentinella", "csvTarature", () => sentinella.csvTarature(D.monitoraggi));
  for (const v of D.volate) doc("sentinella", "fogliaVolata " + v.id, () => sentinella.fogliaVolata(v, { monitoraggi: D.monitoraggi, reclami: D.reclami, ricettori: D.ricettori, oggi: OGGI }));
}

/* ── il testo di un documento: un CSV è già testo; un foglio è un oggetto di
      stringhe annidate, e si legge ogni stringa (le chiavi no). ── */
const testoDi = (x, out = []) => {
  if (x == null) return out;
  if (typeof x === "string") out.push(x);
  else if (Array.isArray(x)) x.forEach((y) => testoDi(y, out));
  else if (typeof x === "object") Object.values(x).forEach((y) => testoDi(y, out));
  else if (typeof x === "number" && !Number.isFinite(x)) out.push("NaN");
  return out;
};
/* i plurali che una frase col numero UNO non deve portare — le parole dei
   documenti di questa casa, non un dizionario */
const PLURALI = "rilievi|fermi|giorni|righe|persone|dispositivi|addestramenti|rapportini|squadre|mesi|ore|minuti|volate|consegne|fatture|scadenze|mezzi|interventi|fronti|banchi|lotti|azioni|infortuni|letture|punti|indicativi|presenti|assenti|viaggi|turni|voci|ricambi|controlli|documenti|anomalie|riprese|cumuli|note di credito|near-miss registrati|mancati infortuni|clienti|ordini|preventivi|pesate|incassi|costi|manutenzioni|verifiche|ispezioni|lavoratori|operatori|reclami|ricettori|monitoraggi|superamenti|attività concluse|ore lavorate|euro|tonnellate|metri";
const SINGOLARE = new RegExp("(^|[^\\d.,])1 (" + PLURALI + ")\\b", "g");
const SPORCO = /\bundefined\b|\bNaN\b|\[object Object\]|(^|[;\s"(])null([;\s")]|$)/;
const TRANQUILLO = /€ 0,00|(^|[^\d,.])0%|(^|[^\d,.])0 m³|;0(;|$)/gm;

console.log("\n════════ tutti i documenti delle sei app, sulla dimostrazione, senza browser ════════");
/* la controprova: il PRIMO documento di ogni app esce sporco — è lo scanner
   che si mette alla prova, non il prodotto (che qui non si tocca) */
if (CONTROPROVA) {
  const visti = new Set();
  for (const d of DOC) if (!visti.has(d.app)) { visti.add(d.app); const f = d.f; d.f = () => testoDi(f()).join("\n") + "\nundefined · 1 rilievi · € 0,00\n"; }
  console.log("  ⚠️ CONTROPROVA: sei documenti sporcati in memoria — qui sotto il rosso è quello VOLUTO");
}
const perApp = {};
let chiamabili = 0, caratteri = 0, singolari = [], sporchi = [], vuoti = [], rotti = [], tranquilli = 0;
const tranqPer = [];
for (const d of DOC) {
  let out;
  try { out = d.f(); } catch (e) { rotti.push(d.app + " · " + d.nome + " → " + String(e && e.message).slice(0, 120)); continue; }
  chiamabili++;
  const testi = testoDi(out);
  const testo = testi.join("\n");
  caratteri += testo.length;
  perApp[d.app] = (perApp[d.app] || 0) + 1;
  if (testo.trim().length < 20) vuoti.push(d.app + " · " + d.nome);
  for (const t of testi) {
    let m; SINGOLARE.lastIndex = 0;
    while ((m = SINGOLARE.exec(t))) singolari.push(d.app + " · " + d.nome + " → «1 " + m[2] + "» in «" + t.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\n/g, " ") + "»");
    if (SPORCO.test(t)) sporchi.push(d.app + " · " + d.nome + " → «" + t.slice(0, 120).replace(/\n/g, " ") + "»");
  }
  const n = (testo.match(TRANQUILLO) || []).length;
  if (n) { tranquilli += n; tranqPer.push([d.app + " · " + d.nome, n]); }
}
const denominatore = `${chiamabili} documenti su ${DOC.length} (${Object.entries(perApp).map(([a, n]) => a + " " + n).join(", ")}), ${caratteri.toLocaleString("it-IT", { useGrouping: true })} caratteri letti`;
console.log("  [denominatore] " + denominatore);
ok(rotti.length === 0, "ogni documento della dimostrazione si compone senza sollevare (" + DOC.length + ")", rotti.join("\n      "));
ok(vuoti.length === 0, "e nessuno è vuoto", vuoti.join(", "));
ok(sporchi.length === 0, "⛔ nessun documento scrive «undefined», «NaN», «[object Object]» o la parola «null»", sporchi.join("\n      "));
ok(singolari.length === 0, "⛔ nessun documento dice «1 rilievi», «1 fermi», «1 giorni»… (" + PLURALI.split("|").length + " plurali cercati)", singolari.join("\n      "));
ok(chiamabili >= 60 && caratteri > 50000, "il controllo ha guardato abbastanza soggetti da voler dire qualcosa: " + denominatore);
console.log(`  [misura] celle «tranquille» (€ 0,00 · 0% · 0 m³ · ;0;): ${tranquilli} in ${tranqPer.length} documenti — CANDIDATI, non verdetti: se lo zero sia misurato lo sa solo chi apre il documento` + (DIMMI ? "\n      " + tranqPer.map(([n, k]) => n + " (" + k + ")").join("\n      ") : " (--dimmi per l'elenco)"));
console.log(`\nRisultato documenti della dimostrazione: ${passati} passati, ${falliti} falliti  ·  ${denominatore}`);
if (CONTROPROVA) {
  const bene = falliti === 2 && sporchi.length === 6 && singolari.length === 6 && tranqPer.filter(([n]) => /csvInventari|csvSituazioneFatture|csvAppello Mattina|csvRegistroInfortuni|csvRegistroInterventi|csvRefertiGenesi/.test(n)).length === 6;
  console.log(bene ? "✔ CONTROPROVA OK: lo scanner SA fallire (2 prove cadute, 6 sporchi, 6 singolari, 6 documenti in più fra i tranquilli)"
    : `⛔ CONTROPROVA FALLITA: ${falliti} cadute, ${sporchi.length} sporchi, ${singolari.length} singolari — lo scanner non vede quello che dovrebbe`);
  process.exit(bene ? 0 : 3);
}
process.exit(falliti ? 1 : 0);
