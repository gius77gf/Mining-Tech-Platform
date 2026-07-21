// ============================================================
// Conti — accesso dati (C4). Schema condiviso (orgCollection da
// autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/conti/):
//   fatture/{id}: { numero, cliente, importo, emessa (ISO), scadenza (ISO), incassata (bool) }
//   gare/{id}:    { titolo, base, scadenza (ISO), stato: aperta|vinta|persa }
// KPI CALCOLATI: da incassare, in scadenza, gare aperte, DSO.
// ============================================================

import { parseCsvLine, numIt, giorniTra } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  fatture: [
    { id: "f1", numero: "2026/031", cliente: "Edilcave Srl", importo: 18300, emessa: "2026-06-07", scadenza: "2026-07-08", incassata: false },
    { id: "f2", numero: "2026/034", cliente: "Stradesud", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25", incassata: false },
    { id: "f3", numero: "2026/035", cliente: "Comune di Modica", importo: 8100, emessa: "2026-07-10", scadenza: "2026-08-10", incassata: false },
    { id: "f4", numero: "2026/036", cliente: "Calcestruzzi RG", importo: 5900, emessa: "2026-07-18", scadenza: "2026-08-18", incassata: false },
    { id: "f5", numero: "2026/028", cliente: "Edilcave Srl", importo: 12000, emessa: "2026-05-12", scadenza: "2026-06-12", incassata: true },
  ],
  gare: [
    { id: "g1", titolo: "Comune di Ragusa — inerti 2026-27", base: 120000, scadenza: "2026-07-28", stato: "aperta" },
    { id: "g2", titolo: "ANAS — manutenzione SS115", base: 340000, scadenza: "2026-08-12", stato: "aperta" },
    { id: "g3", titolo: "Consorzio bonifica — massi scogliera", base: 85000, scadenza: "2026-06-30", stato: "vinta" },
    { id: "g4", titolo: "Provincia — pietrisco lotto 3", base: 60000, scadenza: "2026-05-15", stato: "persa" },
  ],
};

export function giorni(dataISO, oggi = new Date()) {
  return giorniTra(dataISO, oggi);
}

export function kpiFrom(fatture, gare, oggi = new Date()) {
  const aperte = fatture.filter(f => !f.incassata);
  const daIncassare = aperte.reduce((t, f) => t + (+f.importo || 0), 0);
  const inScadenza = aperte.filter(f => giorni(f.scadenza, oggi) <= 10).length;
  const gareAperte = gare.filter(g => g.stato === "aperta").length;
  // DSO ~ media dei giorni dall'emissione (sulle fatture non incassate)
  const dso = aperte.length
    ? Math.round(aperte.reduce((t, f) => t + Math.max(0, -giorni(f.emessa, oggi) || 0), 0) / aperte.length)
    : 0;
  return { daIncassare, inScadenza, gareAperte, dso };
}

// Aging degli incassi: suddivide le fatture NON incassate per fasce di
// ritardo rispetto alla scadenza (giorni negativi = scaduto). È lo
// strumento amministrativo con cui si capisce quanto credito è "vecchio"
// e va sollecitato per primo. Ogni fascia: numero fatture + importo.
export function agingIncassi(fatture, oggi = new Date()) {
  const b = {
    nonScaduto: { conto: 0, importo: 0 },
    g1_30:      { conto: 0, importo: 0 },
    g31_60:     { conto: 0, importo: 0 },
    g61_90:     { conto: 0, importo: 0 },
    oltre90:    { conto: 0, importo: 0 },
  };
  for (const f of fatture) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    // fattura senza data (o data non valida): non è classificabile come
    // scaduta → la contiamo come "non scaduto", non gonfiamo lo scaduto.
    if (isNaN(g)) { b.nonScaduto.conto++; b.nonScaduto.importo += (+f.importo || 0); continue; }
    const imp = +f.importo || 0;
    let k;
    if (g >= 0) k = "nonScaduto";
    else { const r = -g; k = r <= 30 ? "g1_30" : r <= 60 ? "g31_60" : r <= 90 ? "g61_90" : "oltre90"; }
    b[k].conto++; b[k].importo += imp;
  }
  b.scadutoTot = b.g1_30.importo + b.g31_60.importo + b.g61_90.importo + b.oltre90.importo;
  return b;
}

// Import fatture da CSV (per l'avvio: caricare le fatture esistenti invece
// di riscriverle a mano). Colonne: numero;cliente;importo;emessa;scadenza
// [;incassata] (header opzionale). Coerce importo a numero, incassata a
// booleano ("si"/"true"/"1"); scarta le righe senza numero/cliente/importo
// valido. numero/cliente sono testo grezzo → escapare dove mostrati. Pura.
export function parseFattureCsv(text) {
  const vero = (v) => /^(si|sì|true|1|x)$/i.test(String(v || "").trim());
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !/^numero\s*;/i.test(r))
    .map(r => {
      const [numero, cliente, importo, emessa, scadenza, incassata] = parseCsvLine(r);
      return {
        numero: (numero || "").trim(), cliente: (cliente || "").trim(),
        importo: numIt(importo),
        emessa: (emessa || "").trim() || null, scadenza: (scadenza || "").trim() || null,
        incassata: vero(incassata),
      };
    })
    .filter(f => f.numero && f.cliente && Number.isFinite(f.importo) && f.importo > 0);
}

// Interessi di mora di legge (D.Lgs 231/2002, transazioni commerciali) su una
// fattura insoluta: danno un NUMERO vero al sollecito. Decorrono dal giorno
// dopo la scadenza, senza messa in mora. Interessi = importo × tasso%/100 ×
// giorni/365. Tasso di riferimento BCE + 8 punti (1° sem 2026 = 10,15%); è un
// parametro aggiornabile ogni semestre, DA CONFERMARE col commercialista. Più
// €40 forfettari di spese (art. 6), esposti a parte. Zero se non in ritardo.
// Vedi vault/RICERCA_INTERESSI_MORA.md. Pura e testabile.
export const TASSO_MORA_DEFAULT = 10.15;   // % annuo — 1° semestre 2026 (GU 15/2026)
export const SPESE_RECUPERO_231 = 40;      // € forfettari art. 6 D.Lgs 231/2002

export function interessiMora(importo, giorniRitardo, tassoAnnuo = TASSO_MORA_DEFAULT) {
  const imp = +importo || 0, g = +giorniRitardo || 0, t = +tassoAnnuo || 0;
  if (imp <= 0 || g <= 0 || t <= 0) return { interessi: 0, giorni: Math.max(0, g), tasso: t };
  const interessi = Math.round(imp * (t / 100) * (g / 365) * 100) / 100;
  return { interessi, giorni: g, tasso: t };
}

// Livello di sollecito in base ai giorni di ritardo di una fattura insoluta:
// nessuno (non scaduta), 1° sollecito, 2° sollecito, ultimo avviso. Fasce
// pensate come promemoria progressivi. Pura e testabile.
export function livelloSollecito(giorniRitardo) {
  const g = +giorniRitardo || 0;
  if (g <= 0)  return { livello: 0, label: "", cls: "ok" };
  if (g <= 15) return { livello: 1, label: "1° sollecito", cls: "warn" };
  if (g <= 45) return { livello: 2, label: "2° sollecito", cls: "warn" };
  return { livello: 3, label: "ultimo avviso", cls: "danger" };
}

// Formattazioni PURE (niente locale ICU, così i test sono deterministici):
// euro all'italiana (18.300 / 83,42) e data GG/MM/AAAA da ISO.
function euroIt(v) {
  const n = Math.round((+v || 0) * 100) / 100;
  const [int, dec] = Math.abs(n).toFixed(2).split(".");
  const intG = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const seg = dec === "00" ? intG : intG + "," + dec;
  return (n < 0 ? "-" : "") + seg;
}
function dataIt(iso) {
  const s = String(iso || "").slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || "—");
}

// Testo PRONTO di un sollecito di pagamento per una fattura INSOLUTA, da
// copiare e inviare (email/PEC). Mette insieme gli estremi della fattura, i
// giorni di ritardo, gli interessi di mora di legge (D.Lgs 231/2002) e i €40
// forfettari art. 6, con un totale dovuto. Ritorna null se la fattura NON è
// scaduta (niente da sollecitare) o se i dati non sono validi. La nota "da
// confermare col commercialista" resta nell'interfaccia, non nella lettera al
// cliente. Pura e testabile: nessun DOM, `oggi` e `tasso` iniettabili.
export function testoSollecito(fattura, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT) {
  const f = fattura || {};
  const imp = +f.importo || 0;
  const g = giorni(f.scadenza, oggi);
  if (imp <= 0 || !Number.isFinite(g) || g >= 0) return null;   // non scaduta o dati non validi
  const ritardo = -g;
  const m = interessiMora(imp, ritardo, tassoAnnuo);
  const totale = Math.round((imp + m.interessi + SPESE_RECUPERO_231) * 100) / 100;
  const cliente = (f.cliente || "").trim() || "Spett.le cliente";
  const numero = (f.numero || "").trim() || "—";
  const tassoTxt = String(tassoAnnuo).replace(".", ",");
  const e = (v) => "€ " + euroIt(v);
  return [
    `Oggetto: sollecito di pagamento — fattura ${numero}`,
    ``,
    `Spett.le ${cliente},`,
    `risulta non ancora saldata la fattura n. ${numero} di ${e(imp)}, scaduta il ${dataIt(f.scadenza)} (${ritardo} giorni di ritardo).`,
    ``,
    `La preghiamo di provvedere al pagamento nel più breve tempo possibile. Ai sensi del D.Lgs 231/2002 sulle transazioni commerciali, dalla scadenza maturano interessi di mora al tasso del ${tassoTxt}% annuo, oltre a ${e(SPESE_RECUPERO_231)} di spese forfettarie di recupero (art. 6).`,
    ``,
    `Riepilogo alla data odierna:`,
    `- Importo fattura: ${e(imp)}`,
    `- Interessi di mora (stima, ${ritardo} gg): ${e(m.interessi)}`,
    `- Spese forfettarie art. 6: ${e(SPESE_RECUPERO_231)}`,
    `- Totale dovuto: ${e(totale)}`,
    ``,
    `Gli interessi sono calcolati al tasso di legge vigente e saranno aggiornati alla data dell'effettivo pagamento. Restiamo a disposizione per ogni chiarimento.`,
    `Distinti saluti.`,
  ].join("\n");
}

// Incasso atteso nei prossimi N giorni: somma delle fatture aperte la cui
// scadenza cade da oggi a oggi+N (non ancora scadute). È l'entrata di cassa
// PREVISTA, complementare all'aging (che guarda al ritardo passato).
export function incassoAtteso(fatture, giorniAvanti = 30, oggi = new Date()) {
  let importo = 0, conto = 0;
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g >= 0 && g <= giorniAvanti) { importo += (+f.importo || 0); conto++; }
  }
  return { conto, importo };
}

// Esposizione per CLIENTE: totale delle fatture NON incassate per ogni cliente,
// dal più esposto, con quante fatture e quanto è già scaduto. Serve al credito
// per sapere CHI chiamare per primo (l'esposizione concentrata è il rischio
// vero). Ignora le fatture con importo ≤ 0. Pura e testabile.
export function esposizioneClienti(fatture, oggi = new Date()) {
  const per = {};
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const imp = +f.importo || 0;
    if (imp <= 0) continue;
    const cli = ((f.cliente || "").trim()) || "—";
    const p = per[cli] || (per[cli] = { cliente: cli, totale: 0, scaduto: 0, conto: 0 });
    p.totale += imp; p.conto++;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g < 0) p.scaduto += imp;
  }
  return Object.values(per).sort((a, b) => b.totale - a.totale || a.cliente.localeCompare(b.cliente, "it"));
}

// ESTRATTO CONTO di un cliente: testo pronto (email/PEC) che elenca TUTTE le
// sue fatture aperte con importo, scadenza, ritardo e interessi di mora, e
// chiude con i totali (aperto, scaduto, mora, spese €40 per fattura scaduta,
// totale dovuto). Serve quando un cliente ha PIÙ fatture aperte e vuoi
// mandargli il quadro completo, non un sollecito per singola fattura. Ritorna
// null se il cliente non ha fatture aperte. La nota "da confermare col
// commercialista" resta nell'interfaccia. Pura e testabile.
export function estrattoContoCliente(cliente, fatture, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT) {
  const nome = String(cliente || "").trim();
  if (!nome) return null;
  const aperte = (fatture || []).filter(f =>
    !f.incassata && (+f.importo || 0) > 0 && ((f.cliente || "").trim()) === nome);
  if (!aperte.length) return null;
  aperte.sort((a, b) => (a.scadenza || "").localeCompare(b.scadenza || ""));
  const e = (v) => "€ " + euroIt(v);
  let totale = 0, scaduto = 0, moraTot = 0, scaduteN = 0;
  const righe = aperte.map(f => {
    const imp = +f.importo || 0;
    totale += imp;
    const g = giorni(f.scadenza, oggi);
    const ritardo = Number.isFinite(g) && g < 0 ? -g : 0;
    let coda;
    if (ritardo > 0) {
      scaduto += imp; scaduteN++;
      const m = interessiMora(imp, ritardo, tassoAnnuo);
      moraTot += m.interessi;
      coda = `scaduta da ${ritardo} gg · mora ~${e(m.interessi)}`;
    } else {
      coda = Number.isFinite(g) ? "non ancora scaduta" : "senza scadenza";
    }
    return `- n. ${(f.numero || "—")} · ${e(imp)} · scad. ${dataIt(f.scadenza)} · ${coda}`;
  });
  const spese = scaduteN * SPESE_RECUPERO_231;
  const totaleDovuto = Math.round((totale + moraTot + spese) * 100) / 100;
  const od = new Date(oggi);
  const oiso = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, "0")}-${String(od.getDate()).padStart(2, "0")}`;
  const out = [
    `Estratto conto — ${nome}`,
    `Data: ${dataIt(oiso)}`,
    ``,
    `Fatture aperte (${aperte.length}):`,
    ...righe,
    ``,
    `Totale aperto: ${e(totale)}`,
    `Di cui scaduto: ${e(scaduto)}`,
  ];
  if (scaduteN > 0) {
    out.push(`Interessi di mora stimati (D.Lgs 231/2002, ${String(tassoAnnuo).replace(".", ",")}%): ${e(moraTot)}`);
    out.push(`Spese forfettarie art. 6 (${e(SPESE_RECUPERO_231)} × ${scaduteN} fatture scadute): ${e(spese)}`);
    out.push(`Totale dovuto ad oggi: ${e(totaleDovuto)}`);
  }
  out.push(``, `La preghiamo di provvedere alla regolarizzazione. Restiamo a disposizione per ogni chiarimento.`);
  return out.join("\n");
}

// Previsione incassi per MESE: raggruppa le fatture non incassate e non ancora
// scadute per mese-calendario (yyyy-mm) nei prossimi `mesi` mesi, così si vede
// la liquidità attesa nel tempo e non solo un totale a finestra. Le fatture già
// SCADUTE e non incassate finiscono in un bucket "scadute" a parte (vanno
// sollecitate, non pianificate come entrata futura). Ora locale. Pura e testabile.
export function incassoPerMese(fatture, mesi = 6, oggi = new Date()) {
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  const km = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ordine = [], perMese = {};
  for (let i = 0; i < mesi; i++) { const k = km(new Date(o.getFullYear(), o.getMonth() + i, 1)); ordine.push(k); perMese[k] = { mese: k, conto: 0, importo: 0 }; }
  const scadute = { conto: 0, importo: 0 };
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (!Number.isFinite(g)) continue;                 // senza data valida: non pianificabile
    const imp = +f.importo || 0;
    if (g < 0) { scadute.conto++; scadute.importo += imp; continue; }
    const k = (f.scadenza || "").slice(0, 7);          // yyyy-mm della scadenza
    if (perMese[k]) { perMese[k].conto++; perMese[k].importo += imp; }  // oltre l'orizzonte: ignorata
  }
  return { mesi: ordine.map(k => perMese[k]), scadute };
}

// Priorità di incasso: ordina le fatture APERTE per urgenza — prima le più
// in ritardo, a parità di ritardo prima l'importo più alto. Serve a sapere
// CHI sollecitare per primo. Ogni voce porta i giorni di ritardo (0 se non
// ancora scaduta). Funzione pura e testabile.
export function prioritaIncasso(fatture, oggi = new Date()) {
  return (fatture || [])
    .filter(f => !f.incassata)
    .map(f => {
      const g = giorni(f.scadenza, oggi);
      return { f, ritardo: Number.isFinite(g) ? Math.max(0, -g) : 0 };
    })
    .sort((a, b) => b.ritardo - a.ritardo || (+b.f.importo || 0) - (+a.f.importo || 0));
}

// Riepilogo delle gare d'appalto: quante aperte/vinte/perse, valore a
// base d'asta per stato, e tasso di vittoria sulle sole gare DECISE
// (vinte+perse; le aperte non contano ancora). tassoVittoria è null se
// non c'è ancora nessuna gara decisa. Funzione pura e testabile.
export function gareRiepilogo(gare) {
  const per = (s) => (gare || []).filter(g => g.stato === s);
  const somma = (arr) => arr.reduce((t, g) => t + (+g.base || 0), 0);
  const aperte = per("aperta"), vinte = per("vinta"), perse = per("persa");
  const decise = vinte.length + perse.length;
  return {
    aperte: aperte.length, vinte: vinte.length, perse: perse.length,
    baseAperta: somma(aperte), baseVinta: somma(vinte), basePersa: somma(perse),
    tassoVittoria: decise ? Math.round(100 * vinte.length / decise) : null,
  };
}

export async function contiData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "conti" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        fatture: () => read("fatture"), gare: () => read("gare"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), d),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      fatture: async () => mem.fatture, gare: async () => mem.gare,
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = mem[n].find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = mem[n].filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
